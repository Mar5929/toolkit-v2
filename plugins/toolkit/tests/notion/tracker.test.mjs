// The Notion tracker driver against the fake Notion: the interface in
// lib/work/driver.mjs, owner actions in Notion, and read-back checks.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NotionClient } from '../../lib/notion/client.mjs';
import { ensureProject } from '../../lib/notion/ensure.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../lib/notion/schema.mjs';
import { createTracker, readTrackerCache } from '../../lib/notion/tracker.mjs';
import { openTracker, REQUIRED_METHODS } from '../../lib/work/driver.mjs';
import { newRecordText, newDesignText, parseDoc, setLabel, appendHistory, getLabel } from '../../lib/work/model.mjs';
import { FakeNotion, fakeRunner, seedProjects } from './fake-notion.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// The shipped templates, so the tests follow any change to them.
const TEMPLATES = path.resolve(HERE, '..', '..', 'templates');
const WI_TEMPLATE = fs.readFileSync(path.join(TEMPLATES, 'WORK-ITEM.md'), 'utf8');
const DESIGN_TEMPLATE = fs.readFileSync(path.join(TEMPLATES, 'DESIGN.md'), 'utf8');
const TODAY = '2026-09-26';

async function setup() {
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-tracker-'));
  const config = {
    toolkit: 'toolkit-v2',
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike' },
    tracker: { type: 'notion', idPrefix: 'WI' },
    memory: { type: 'builtin' },
    notion: {},
  };
  const { notion } = await ensureProject({ client, config, mainRoot: root, rootPageId: fake.rootPageId, now: () => new Date('2026-09-26T12:00:00Z') });
  config.notion = notion;
  const project = { root, mainRoot: root, config };
  const tracker = await createTracker(project, { client, today: TODAY });
  return { fake, client, tracker, project, notion, root };
}

function record(title, extra = {}) {
  return parseDoc(newRecordText(WI_TEMPLATE, {
    id: 'WI-001', title, type: 'build', stage: '01-discovery', status: 'Backlog', parent: 'none', waiting_on: 'none', priority: 'medium',
    delivery: 'not-offered', requirements_approved: 'no', design: 'none', result_approved: 'no', updated: TODAY, ...extra,
  }));
}

test('the driver has every method the work engine needs, and openTracker loads it', async () => {
  const { tracker, project, client } = await setup();
  for (const m of REQUIRED_METHODS) assert.equal(typeof tracker[m], 'function', m);
  assert.equal(tracker.type, 'notion');
  const opened = await openTracker(project, { client, today: TODAY });
  assert.equal(opened.type, 'notion');
});

test('create assigns WI-001, WI-002 and stores meta as properties and the body as the page', async () => {
  const { tracker, fake, notion } = await setup();
  const a = record('Login page');
  const id = await tracker.create({ meta: a.meta, body: a.body });
  assert.equal(id, 'WI-001');
  const id2 = await tracker.create({ meta: record('Second').meta, body: record('Second').body });
  assert.equal(id2, 'WI-002');
  const got = await tracker.get(id);
  assert.equal(got.meta.title, 'Login page');
  assert.equal(got.meta.type, 'build');
  assert.equal(got.meta.stage, '01-discovery');
  assert.equal(got.meta.status, 'Backlog');
  assert.equal(got.meta.parent, 'none');
  assert.equal(got.meta.requirements_approved, 'no');
  assert.ok(got.body.startsWith('# WI-001: Login page\n\n## Overview'));
  assert.match(got.location, /^https:\/\/app\.notion\.com\/p\//);
  const page = Object.values(fake.pages).find((p) => p.parent.data_source_id === notion.workItems.dataSourceId && fake.titleOf(p) === 'Login page');
  assert.ok(!/^# /.test(page.markdown) && page.markdown.startsWith('## Overview'), 'the H1 is not stored in Notion');
  assert.match(page.markdown, /<table header-row="true">/);
});

test('a sub-item is linked through Parent item and listed as a child', async () => {
  const { tracker } = await setup();
  const a = record('Parent');
  const pid = await tracker.create({ meta: a.meta, body: a.body });
  const b = record('Child');
  const cid = await tracker.create({ meta: { ...b.meta, parent: pid }, body: b.body });
  const child = await tracker.get(cid);
  assert.equal(child.meta.parent, pid);
  const parent = await tracker.get(pid);
  assert.deepEqual(parent.children, [cid]);
  const list = await tracker.list();
  assert.deepEqual(list.map((r) => [r.id, r.parent]), [[pid, 'none'], [cid, pid]]);
  assert.equal(list[0].body, undefined, 'list leaves bodies out by default');
  const withBody = await tracker.list({ includeBody: true });
  assert.ok(withBody[1].body.startsWith(`# ${cid}: Child`));
});

test('update changes properties and one section, and fills Next action and Open owner questions', async () => {
  const { tracker, fake } = await setup();
  const a = record('Login page');
  const id = await tracker.create({ meta: a.meta, body: a.body });
  const before = await tracker.get(id);
  let body = setLabel(before.body, 'Next action', 'Ask the owner about SSO (agent).', { section: 'Overview' });
  body = body.replace('| Q-01 | <Specific unanswered question> | R-01, P1-T02 | Open | <owner, or another person or role> |', '| Q-01 | SSO or password? | R-01 | Open | owner |');
  const callsBefore = fake.calls.length;
  const after = await tracker.update(id, { meta: { stage: '02-refinement', waiting_on: 'owner' }, body, expectBody: before.body });
  assert.equal(after.meta.stage, '02-refinement');
  assert.equal(after.meta.waiting_on, 'owner');
  assert.equal(after.nextAction, 'Ask the owner about SSO (agent).');
  assert.equal(after.openOwnerQuestions, 1);
  assert.equal(getLabel(after.body, 'Next action', { section: 'Overview' }), 'Ask the owner about SSO (agent).');
  const patch = fake.calls.slice(callsBefore).find((c) => c.path.endsWith('/markdown') && c.method === 'PATCH');
  assert.equal(patch.body.type, 'update_content');
});

test('Mike\'s edit in another section is kept; a clash in the same section is a conflict and saves nothing', async () => {
  const { tracker, client } = await setup();
  const a = record('Login page');
  const id = await tracker.create({ meta: a.meta, body: a.body });
  const read = await tracker.get(id);
  const page = await tracker.findPage(id);
  const md = await client.getMarkdown(page.id);
  const goal = md.markdown.split('\n').find((l) => l.startsWith('**Goal:**'));
  await client.patchMarkdown(page.id, { type: 'update_content', update_content: { content_updates: [{ old_str: goal, new_str: '**Goal:** Mike wrote this in Notion.' }] } });
  const merged = await tracker.update(id, { body: appendHistory(read.body, { date: TODAY, change: 'Agent row.', effect: 'None.' }), expectBody: read.body });
  assert.match(merged.body, /Mike wrote this in Notion\./);
  assert.match(merged.body, /Agent row\./);
  await assert.rejects(
    tracker.update(id, { body: setLabel(read.body, 'Goal', 'Agent goal.', { section: 'Overview' }), expectBody: read.body }),
    (err) => err.details && err.details.conflict === true,
  );
  const now = await tracker.get(id);
  assert.match(now.body, /Mike wrote this in Notion\./);
});

test('an update refused for a parent that does not exist writes nothing, not even the body', async () => {
  const { tracker, fake } = await setup();
  const id = await tracker.create({ meta: record('A').meta, body: record('A').body });
  const before = await tracker.get(id);
  const body = setLabel(before.body, 'Next action', 'Something new (agent).', { section: 'Overview' });
  const writesBefore = fake.writes().length;
  await assert.rejects(tracker.update(id, { meta: { parent: 'WI-099' }, body, expectBody: before.body }), /WI-099 was not found/);
  assert.equal(fake.writes().length, writesBefore, 'no write was made');
  const after = await tracker.get(id);
  assert.equal(after.body, before.body);
});

test('template() gives { text } like the other trackers', async () => {
  const { tracker } = await setup();
  const t = tracker.template('WORK-ITEM.md');
  assert.equal(typeof t.text, 'string');
  assert.match(t.text, /## Overview/);
  assert.equal(t.text, WI_TEMPLATE);
});

test('expectMeta that no longer matches is a conflict', async () => {
  const { tracker } = await setup();
  const id = await tracker.create({ meta: record('A').meta, body: record('A').body });
  await assert.rejects(tracker.update(id, { meta: { stage: '03-requirements-approved' }, expectMeta: { stage: '02-refinement' } }), (err) => err.details.conflict === true);
});

test('design: create, read back as DESIGN.md, update, and a missing design without --create is an error', async () => {
  const { tracker } = await setup();
  const id = await tracker.create({ meta: record('Login page').meta, body: record('Login page').body });
  assert.equal(await tracker.getDesign(id), null);
  const text = newDesignText(DESIGN_TEMPLATE, { id, title: 'Login page', date: TODAY });
  await assert.rejects(tracker.setDesign(id, text), /has no design yet/);
  const d = await tracker.setDesign(id, text, { create: true });
  assert.deepEqual(d.meta, { work_item: id, status: 'proposed', approved: 'no' });
  assert.ok(d.body.startsWith(`# ${id}: Login page — solution design`));
  assert.match(d.text, /^---\nwork_item: WI-001\nstatus: proposed\napproved: no\n---/);
  const approved = d.text.replace('status: proposed', 'status: approved').replace('approved: no', 'approved: 2026-09-26 by Mike').replace('## What this solves\n\n<Who uses', '## What this solves\n\nPeople who log in. <Who uses');
  const d2 = await tracker.setDesign(id, approved);
  assert.equal(d2.meta.status, 'approved');
  assert.equal(d2.meta.approved, '2026-09-26 by Mike');
  assert.match(d2.body, /People who log in\./);
  const item = await tracker.get(id);
  assert.ok(item.design, 'the item shows its design');
  assert.ok(!item.body.includes('<page'), 'the design page is not in the body');
});

test('move: under another item, to the archive, and back to the top; no cycles; no groups', async () => {
  const { tracker } = await setup();
  const a = await tracker.create({ meta: record('A').meta, body: record('A').body });
  const b = await tracker.create({ meta: record('B').meta, body: record('B').body });
  let m = await tracker.move(b, a);
  assert.equal(m.parentAfter, a);
  m = await tracker.move(b, 'archive');
  assert.equal(m.archived, true);
  assert.equal((await tracker.list({ includeArchived: false })).length, 1);
  m = await tracker.move(b, 'root');
  assert.equal(m.parentAfter, 'none');
  assert.equal(m.archived, false);
  await tracker.move(b, a);
  await assert.rejects(tracker.move(a, b), /inside/);
  await assert.rejects(tracker.move(a, a), /under itself/);
  await assert.rejects(tracker.move(a, 'billing'), (err) => err.code === 3);
  await assert.rejects(tracker.create({ meta: record('C').meta, body: record('C').body }, { group: 'billing' }), (err) => err.code === 3);
});

test('sync adopts a card made with the New button', async () => {
  const { tracker, client, notion } = await setup();
  await client.createPage({ parent: { type: 'data_source_id', data_source_id: notion.workItems.dataSourceId }, properties: { title: { title: [{ type: 'text', text: { content: 'Password reset' } }] } } });
  const report = await tracker.sync();
  assert.equal(report.adopted.length, 1);
  const id = report.adopted[0].id;
  const item = await tracker.get(id);
  assert.equal(item.meta.stage, '01-discovery');
  assert.equal(item.meta.status, 'Backlog');
  assert.equal(item.meta.type, 'task');
  assert.match(item.body, /## Requirements/);
  assert.match(item.body, /Created in Notion by hand/);
  const again = await tracker.sync();
  assert.equal(again.adopted.length, 0);
});

test('sync: a Stage dragged on the board is kept, Status follows, and the gate question is asked', async () => {
  const { tracker, client, notion } = await setup();
  const id = await tracker.create({ meta: record('Build it').meta, body: record('Build it').body });
  await tracker.sync();
  const page = await tracker.findPage(id);
  await client.updatePage(page.id, { properties: { [notion.workItems.properties.stage]: { select: { name: '08-build' } } } });
  const report = await tracker.sync({ quick: true });
  assert.deepEqual(report.ownerEdits.map((e) => [e.id, e.field, e.to]), [[id, 'stage', '08-build']]);
  assert.deepEqual(report.questions.map((q) => q.code), ['requirements_not_approved']);
  assert.deepEqual(report.derived.map((d) => [d.field, d.to]), [['status', 'In Progress']]);
  const item = await tracker.get(id);
  assert.equal(item.meta.stage, '08-build');
  assert.equal(item.meta.status, 'In Progress');
  assert.match(item.body, /Changed by hand: stage from "01-discovery" to "08-build"/);
  const quiet = await tracker.sync({ quick: true });
  assert.deepEqual([quiet.ownerEdits.length, quiet.derived.length, quiet.moves.length], [0, 0, 0]);
});

test('sync reports a parent changed by hand and a trashed card', async () => {
  const { tracker, client, notion } = await setup();
  const a = await tracker.create({ meta: record('A').meta, body: record('A').body });
  const b = await tracker.create({ meta: { ...record('B').meta, parent: a }, body: record('B').body });
  await tracker.sync();
  const pb = await tracker.findPage(b);
  await client.updatePage(pb.id, { properties: { [notion.workItems.properties.parent]: { relation: [] } } });
  const r1 = await tracker.sync({ quick: true });
  assert.deepEqual(r1.moves.map((m) => [m.id, m.kind, m.from, m.to]), [[b, 'reparented', a, 'none']]);
  await client.updatePage(pb.id, { in_trash: true });
  const r2 = await tracker.sync({ quick: true });
  assert.deepEqual(r2.missing.map((m) => [m.id, m.reason]), [[b, 'It was moved to the Notion trash.']]);
});

test('quick sync with nothing changed makes one call', async () => {
  const { tracker, fake } = await setup();
  await tracker.create({ meta: record('A').meta, body: record('A').body });
  await tracker.sync();
  const before = fake.calls.length;
  const r = await tracker.sync({ quick: true });
  assert.equal(fake.calls.length - before, 1);
  assert.equal(r.changed, false);
});

test('the cache keeps what the briefing needs, outside Git', async () => {
  const { tracker, root } = await setup();
  const id = await tracker.create({ meta: record('A').meta, body: record('A').body });
  await tracker.list();
  const cache = readTrackerCache(root);
  assert.equal(cache.items[id].title, 'A');
  assert.equal(cache.items[id].stage, '01-discovery');
  assert.ok(fs.existsSync(path.join(root, '.toolkit-cache', 'notion', 'tracker.json')));
});

test('a missing Work Items setup is a clear error', async () => {
  await assert.rejects(createTracker({ root: '/x', mainRoot: '/x', config: { notion: {} } }, {}), (err) => /not set up/.test(err.message) && /ensure-project/.test(err.details.fix));
});

// Notion tracker fixes from sample run c, round 2: a hand move found by
// parallel commands is recorded once, the briefing's check only reads, the
// cache is merged instead of overwritten, parents get history rows, a write is
// read back a second time before "Saved but not verified", and the error names
// the first line that differs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { NotionClient } from '../../lib/notion/client.mjs';
import { ensureProject } from '../../lib/notion/ensure.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../lib/notion/schema.mjs';
import { createTracker, readTrackerCache, firstDifference } from '../../lib/notion/tracker.mjs';
import { newRecordText, parseDoc, parseHistory, newDesignText } from '../../lib/work/model.mjs';
import { opMove } from '../../lib/work/ops.mjs';
import { FakeNotion, fakeRunner, seedProjects } from './fake-notion.mjs';
import { readTemplate } from '../../lib/core/templates.mjs';

const WI_TEMPLATE = readTemplate('work-item');
const DESIGN_TEMPLATE = readTemplate('design');
const TODAY = '2026-09-27';

async function setup() {
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-round2-'));
  const config = {
    toolkit: 'toolkit-v2',
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike' },
    tracker: { type: 'notion', idPrefix: 'WI' },
    memory: { type: 'builtin' },
    notion: {},
  };
  const { notion } = await ensureProject({ client, config, mainRoot: root, rootPageId: fake.rootPageId, now: () => new Date('2026-09-27T12:00:00Z') });
  config.notion = notion;
  const project = { root, mainRoot: root, config };
  // Each tracker stands for one toolkit process: its own copy of the cache, one shared file.
  const open = () => createTracker(project, { client, today: TODAY, verifyRetryMs: 0 });
  return { fake, client, project, notion, root, open };
}

function record(title, extra = {}) {
  return parseDoc(newRecordText(WI_TEMPLATE, {
    id: 'WI-001', title, type: 'task', stage: '01-discovery', status: 'Backlog', parent: 'none', waiting_on: 'none', priority: 'medium',
    delivery: 'not-offered', requirements_approved: 'no', design: 'none', result_approved: 'no', updated: TODAY, ...extra,
  }));
}

async function parentAndChild(t) {
  const a = await t.create({ meta: record('A').meta, body: record('A').body });
  const b = await t.create({ meta: { ...record('B').meta, parent: a }, body: record('B').body });
  await t.sync();
  return { a, b };
}

async function clearParent(t, client, notion, id) {
  const page = await t.findPage(id);
  await client.updatePage(page.id, { properties: { [notion.workItems.properties.parent]: { relation: [] } } });
}

const handRows = (body, id) => parseHistory(body).filter((h) => h.change.startsWith('Parent changed in Notion by hand') || h.change.includes(`Sub-item ${id}`));

test('three commands that find the same hand move at once record it once and none of them fails', async () => {
  const { client, notion, open } = await setup();
  const t0 = await open();
  const { a, b } = await parentAndChild(t0);
  // Three processes started before the owner's move, each with its own cache copy.
  const procs = [await open(), await open(), await open()];
  await clearParent(t0, client, notion, b);
  const results = await Promise.allSettled(procs.map((t) => t.sync({ quick: true })));
  assert.deepEqual(results.map((r) => r.status), ['fulfilled', 'fulfilled', 'fulfilled'], JSON.stringify(results.map((r) => r.reason && r.reason.message)));
  const reported = results.filter((r) => r.value.moves.length).length;
  assert.equal(reported, 1, 'one process records and reports it; the others find the cache already in step');
  const child = await (await open()).get(b);
  assert.equal(parseHistory(child.body).filter((h) => h.change.startsWith('Parent changed in Notion by hand')).length, 1);
  const parent = await (await open()).get(a);
  assert.deepEqual(handRows(parent.body, b).map((h) => h.change), [`Sub-item ${b} moved out in Notion by hand.`]);
  const again = await (await open()).sync({ quick: true });
  assert.deepEqual(again.moves, []);
});

test('a read by a process with an older cache copy does not bring the move back', async () => {
  const { client, notion, open, root } = await setup();
  const t0 = await open();
  const { b } = await parentAndChild(t0);
  const stale = await open();
  await clearParent(t0, client, notion, b);
  const first = await (await open()).sync({ quick: true });
  assert.equal(first.moves.length, 1);
  // The older process reads: its save merges instead of writing its old "written" parent back.
  await stale.list();
  await stale.get(b);
  assert.equal(readTrackerCache(root).items[b].written.parent, 'none');
  const later = await (await open()).sync({ quick: true });
  assert.deepEqual(later.moves, []);
  const child = await (await open()).get(b);
  assert.equal(parseHistory(child.body).filter((h) => h.change.startsWith('Parent changed in Notion by hand')).length, 1);
});

test('a history row that is already there for the same hand move is not written again', async () => {
  const { client, notion, open } = await setup();
  const t0 = await open();
  const { a, b } = await parentAndChild(t0);
  await clearParent(t0, client, notion, b);
  // An earlier run wrote the row, then failed before it recorded the move.
  const rec = await t0.get(b);
  const { appendHistory } = await import('../../lib/work/model.mjs');
  const body = appendHistory(rec.body, { date: TODAY, change: `Parent changed in Notion by hand: ${a} -> none (top level).`, effect: 'It is a top-level item now.' });
  await t0.update(b, { body, expectBody: rec.body });
  const cache = readTrackerCache(t0.cacheRoot);
  cache.items[b].written.parent = a;
  cache.items[b].lastEdited = null; // the failed run never recorded the page as read
  fs.writeFileSync(path.join(t0.cacheRoot, '.toolkit-cache', 'notion', 'tracker.json'), JSON.stringify(cache));
  const r = await (await open()).sync({ quick: true });
  assert.equal(r.moves.length, 1, 'still reported');
  const child = await (await open()).get(b);
  assert.equal(parseHistory(child.body).filter((h) => h.change.startsWith('Parent changed in Notion by hand')).length, 1);
});

test('the briefing\'s check reads the row properties only: it reports the move, writes nothing, and the next command records it', async () => {
  const { client, notion, open, fake } = await setup();
  const t0 = await open();
  const { b } = await parentAndChild(t0);
  await clearParent(t0, client, notion, b);
  const hook = await open();
  const before = fake.calls.length;
  const seen = await hook.sync({ quick: true, write: false, movesOnly: true });
  assert.deepEqual(seen.moves.map((m) => [m.id, m.kind, m.to]), [[b, 'reparented', 'none']]);
  const calls = fake.calls.slice(before);
  assert.equal(calls.length, 1, `one query, no page reads or writes: ${calls.map((c) => `${c.method} ${c.path}`).join(', ')}`);
  const child = await (await open()).get(b);
  assert.equal(parseHistory(child.body).filter((h) => h.change.startsWith('Parent changed in Notion by hand')).length, 0, 'nothing written');
  const cmd = await (await open()).sync({ quick: true });
  assert.equal(cmd.moves.length, 1, 'the next toolkit command still finds it and records it');
  const after = await (await open()).get(b);
  assert.equal(parseHistory(after.body).filter((h) => h.change.startsWith('Parent changed in Notion by hand')).length, 1);
});

test('toolkit work move in Notion says "the top level" and adds history rows to the item and both parents', async () => {
  const { open } = await setup();
  const t = await open();
  const { a, b } = await parentAndChild(t);
  const c = await t.create({ meta: record('C').meta, body: record('C').body });
  const res = await opMove(t, b, 'root', { today: TODAY });
  assert.equal(res.from, a);
  assert.equal(res.to, 'the top level');
  assert.equal(parseHistory((await t.get(b)).body)[0].change, 'Moved to the top level with toolkit work move.');
  assert.equal(parseHistory((await t.get(a)).body)[0].change, `Sub-item ${b} moved out with toolkit work move.`);
  const res2 = await opMove(t, b, c, { today: TODAY });
  assert.equal(res2.from, 'the top level');
  assert.equal(parseHistory((await t.get(c)).body)[0].change, `Sub-item ${b} moved here with toolkit work move (it was under none (top level)).`);
});

test('a write is read back a second time before "Saved but not verified", and the error names the first line that differs', async () => {
  const { open } = await setup();
  const t = await open();
  const id = await t.create({ meta: record('A').meta, body: record('A').body });
  const text = newDesignText(DESIGN_TEMPLATE, { id, title: 'A', date: TODAY });
  await t.setDesign(id, text, { create: true });
  // Notion returns the page as it was a moment before the write, once: the
  // first read plans the edit, the second is the read-back.
  const real = t.client.getMarkdown.bind(t.client);
  let n = 0;
  t.client.getMarkdown = async (pageId) => {
    const md = await real(pageId);
    n += 1;
    return n === 2 ? { ...md, markdown: String(md.markdown).replace('Greeting people.', '') } : md;
  };
  const changed = text.replace('## What this design solves\n', '## What this design solves\n\nGreeting people.\n');
  const saved = await t.setDesign(id, changed);
  assert.match(saved.body, /Greeting people\./, 'the second read-back matched');
  assert.equal(n, 3);
  // Always different: the error says where.
  n = 0;
  t.client.getMarkdown = async (pageId) => {
    const md = await real(pageId);
    n += 1;
    return n === 1 ? md : { ...md, markdown: String(md.markdown).replace('Greeting people!', 'Greeting persons!') };
  };
  await assert.rejects(t.setDesign(id, changed.replace('Greeting people.', 'Greeting people!')), (err) => {
    assert.match(err.message, /^Saved but not verified: the design of WI-001 in Notion does not match what was written \(line \d+: wrote "Greeting people!"; Notion has "Greeting persons!"\)\.$/);
    return true;
  });
});

test('firstDifference names the line, and says when only spacing differs', () => {
  assert.equal(firstDifference('a\n\nb\n\nc', 'a\n\nB\n\nc'), 'line 3: wrote "b"; Notion has "B"');
  assert.equal(firstDifference('a\n\nb', 'a'), 'line 2: wrote ""; Notion has (nothing)');
  assert.equal(firstDifference('a  \n\n\n\nb', 'a\n\nb'), 'the texts differ only in spacing or escapes');
});

test('an update whose read-back differs names the section and the line that differ', async () => {
  const { open } = await setup();
  const t = await open();
  const id = await t.create({ meta: record('A').meta, body: record('A').body });
  const rec = await t.get(id);
  const { setSectionText } = await import('../../lib/work/model.mjs');
  const body = setSectionText(rec.body, 'Agreed goal', 'Greets people by name.');
  const real = t.client.getMarkdown.bind(t.client);
  let n = 0;
  t.client.getMarkdown = async (pageId) => {
    const md = await real(pageId);
    n += 1;
    return n === 1 ? md : { ...md, markdown: String(md.markdown).replace('Greets people by name.', 'Greets people by nickname.') };
  };
  await assert.rejects(t.update(id, { body, expectBody: rec.body }), (err) => {
    assert.match(err.message, /^Saved but not verified: the text of WI-001 in Notion does not match what was written \(in "Agreed goal", line 3: wrote "Greets people by name\."; Notion has "Greets people by nickname\."\)\.$/);
    return true;
  });
});

// Fixes from the final confirmation round 1 (2026-09-28, Notion run):
// ensure-root on Mike's real "All Projects" view, whose column list named the
// deleted property "eizm". Notion refused the whole view update, and the run
// saved nothing.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NotionClient, NotionError } from '../../lib/notion/client.mjs';
import { ensureRoot, ensureProject } from '../../lib/notion/ensure.mjs';
import { PROJECTS_BASE_PROPERTIES, PROJECTS_REGISTRY_PROPERTIES } from '../../lib/notion/schema.mjs';
import { FakeNotion, fakeRunner, seedProjects } from './fake-notion.mjs';

function setup() {
  const fake = new FakeNotion();
  const projects = seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const view = Object.values(fake.views).find((v) => v.parent.database_id === projects.databaseId);
  const ds = fake.dataSources[projects.dataSourceId];
  view.name = 'All Projects';
  view.configuration = {
    type: 'table',
    properties: [
      ...['Project', 'Status'].map((n) => ({ property_id: decodeURIComponent(ds.properties[n].id), visible: true })),
      { property_id: 'eizm', visible: true },
    ],
  };
  // Like Notion: a column list that names a property the data source does not have is refused.
  const real = client.updateView.bind(client);
  client.updateView = async (id, body) => {
    const known = Object.values(fake.dataSources[projects.dataSourceId].properties).map((p) => decodeURIComponent(p.id));
    const bad = ((body.configuration && body.configuration.properties) || []).find((q) => !known.includes(decodeURIComponent(q.property_id)));
    if (bad) throw new NotionError(`Notion refused PATCH v1/views/${id} (400 validation_error): Property "${bad.property_id}" not found in the database schema.`, { status: 400, notionCode: 'validation_error' });
    return real(id, body);
  };
  return { fake, projects, client, view, ds };
}

test('ensure-root leaves a deleted property\'s column out of the view update and says so', async () => {
  const { client, fake, view, ds } = setup();
  const res = await ensureRoot({ client, rootPageId: fake.rootPageId });
  assert.deepEqual(res.problems, []);
  assert.ok(res.projects && res.projects.databaseId, 'the Projects ids come back, so the command saves them');
  assert.ok(res.warnings.some((w) => /listed a column of a deleted property \(eizm\)/.test(w)), res.warnings.join('\n'));
  const listed = view.configuration.properties.map((q) => q.property_id);
  assert.ok(!listed.includes('eizm'));
  for (const p of PROJECTS_REGISTRY_PROPERTIES) {
    const id = decodeURIComponent(ds.properties[p.name].id);
    assert.ok(view.configuration.properties.some((q) => q.property_id === id && q.visible), `${p.name} is shown`);
  }
  assert.ok(res.added.includes('All Projects view: Key'));
});

test('a refused view update is a warning: ensure-root still returns the Projects ids', async () => {
  const { client, fake, view } = setup();
  const inner = client.updateView;
  client.updateView = async (id, body) => {
    if (id === view.id) throw new NotionError('Notion refused PATCH v1/views/x (400 validation_error): something else.', { status: 400, notionCode: 'validation_error' });
    return inner(id, body);
  };
  const res = await ensureRoot({ client, rootPageId: fake.rootPageId });
  assert.deepEqual(res.problems, []);
  assert.ok(res.projects && res.projects.dataSourceId);
  assert.ok(res.warnings.some((w) => /could not be changed .*so it does not show the columns Key/.test(w)), res.warnings.join('\n'));
  assert.ok(res.warnings.some((w) => /Never change his Notion view with ntn api/.test(w)));
  // ensure-project carries the warning as a note and goes on to the project row.
  const config = {
    toolkit: 'toolkit-v2', schema: 1,
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike Rihm' },
    tracker: { type: 'notion', idPrefix: 'SA' }, memory: { type: 'builtin', approval: 'onboarding' },
    salesforce: { enabled: false }, notion: {},
  };
  const proj = await ensureProject({ client, config, mainRoot: '/p1', rootPageId: fake.rootPageId, now: () => new Date('2026-09-28T12:00:00Z') });
  assert.ok(proj.report.notes.some((n) => /could not be changed/.test(n)), proj.report.notes.join('\n'));
  assert.ok(proj.notion.project && proj.notion.project.pageId, 'the project row was made');
});

// ------------------------------------------------------------------ a hand rename in Notion

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createTracker } from '../../lib/notion/tracker.mjs';
import { newRecordText, parseDoc, newDesignText, composeDoc } from '../../lib/work/model.mjs';
import { DESIGN_FIELD_ORDER } from '../../lib/work/lifecycle.mjs';
import { reportLines } from '../../lib/work/report.mjs';
import { readTemplate } from '../../lib/core/templates.mjs';

const TODAY = '2026-09-28';

async function trackerSetup() {
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-final-confirm-'));
  const config = {
    toolkit: 'toolkit-v2',
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike Rihm' },
    tracker: { type: 'notion', idPrefix: 'WI' },
    memory: { type: 'builtin' },
    notion: {},
  };
  const { notion } = await ensureProject({ client, config, mainRoot: root, rootPageId: fake.rootPageId, now: () => new Date('2026-09-28T12:00:00Z') });
  config.notion = notion;
  const project = { root, mainRoot: root, config };
  const open = () => createTracker(project, { client, today: TODAY, verifyRetryMs: 0 });
  return { fake, client, notion, open };
}

function record(title) {
  return parseDoc(newRecordText(readTemplate('work-item'), {
    id: 'WI-001', title, type: 'task', stage: '04-solution-design', status: 'Backlog', parent: 'none', waiting_on: 'owner', priority: 'medium',
    delivery: 'not-offered', requirements_approved: 'no', design: 'none', result_approved: 'no', updated: TODAY,
  }));
}

test('a title changed by hand in Notion is in the briefing\'s quick check, and the next sync puts it on the design page', async () => {
  const { client, notion, open, fake } = await trackerSetup();
  const t = await open();
  const r = record('Build the days-until command with a --weeks flag');
  const id = await t.create({ meta: r.meta, body: r.body });
  const design = parseDoc(newDesignText(readTemplate('design'), { id, title: 'Build the days-until command with a --weeks flag', date: TODAY }));
  await t.setDesign(id, composeDoc(design.meta, design.body, DESIGN_FIELD_ORDER), { create: true });
  await t.sync();
  // Mike renames the item in the Notion app.
  const page = await t.findPage(id);
  await client.updatePage(page.id, { properties: { [notion.workItems.properties.title]: { title: [{ type: 'text', text: { content: 'Build the days-until command' } }] } } });

  const hook = await open();
  const before = fake.writes().length;
  const seen = await hook.sync({ quick: true, write: false, movesOnly: true });
  assert.equal(fake.writes().length, before, 'the briefing writes nothing');
  const lines = reportLines(seen);
  assert.ok(lines.some((l) => l === `Changed by hand: ${id} title "Build the days-until command with a --weeks flag" -> "Build the days-until command". The title was changed by hand in Notion.`), lines.join('\n'));

  const cmd = await (await open()).sync({ quick: true });
  assert.ok(cmd.ownerEdits.some((e) => e.field === 'title'));
  const d = await (await open()).findDesignPage(await t.findPage(id), id);
  const back = await client.getPage(d.id);
  const title = back.properties.title.title.map((x) => x.plain_text || x.text.content).join('');
  assert.equal(title, `${id}: Build the days-until command — solution design`);
});

// ------------------------------------------------------------------ backup with a Notion tracker and Notion memory

import { fileURLToPath } from 'node:url';
import { main } from '../../lib/cli.mjs';

test('toolkit work finish says no backup was made when the tracker and memory are both in Notion', async () => {
  const HERE = path.dirname(fileURLToPath(import.meta.url));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-finish-'));
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const state = path.join(dir, 'fake-notion.json');
  fs.writeFileSync(state, JSON.stringify(fake.toJSON()));
  const project = path.join(dir, 'project');
  fs.mkdirSync(project);
  fs.writeFileSync(path.join(project, '.toolkit.json'), `${JSON.stringify({
    toolkit: 'toolkit-v2', schema: 1,
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike Rihm' },
    tracker: { type: 'notion', idPrefix: 'SA' }, memory: { type: 'notion', approval: 'onboarding' },
    salesforce: { enabled: false }, notion: {}, backup: { dir: path.join(dir, 'backups') },
  }, null, 2)}\n`);
  const env = {
    ...process.env,
    HOME: path.join(dir, 'home'),
    CLAUDE_CONFIG_DIR: path.join(dir, 'home', '.claude'),
    CODEX_HOME: path.join(dir, 'home', '.codex'),
    TOOLKIT_V2_CONFIG_DIR: path.join(dir, 'machine'),
    TOOLKIT_NTN_BIN: path.join(HERE, 'fake-ntn.mjs'),
    FAKE_NOTION_STATE: state,
    TOOLKIT_NOTION_MIN_INTERVAL_MS: '0',
  };
  const run = async (args) => {
    let out = '';
    let err = '';
    const code = await main(args, { cwd: project, env, stdout: { write: (s) => { out += s; return true; } }, stderr: { write: (s) => { err += s; return true; } }, stdin: '' });
    return { code, out, err };
  };
  assert.equal((await run(['notion', 'ensure-project', '--root-page', fake.rootPageId])).code, 0);
  const made = await run(['work', 'new', '--title', 'Small fix', '--type', 'task', '--json']);
  assert.equal(made.code, 0, made.out + made.err);
  const id = JSON.parse(made.out).id;
  assert.equal((await run(['work', 'approve', id, '--result', '--by', 'Mike Rihm'])).code, 0);
  const done = await run(['work', 'finish', id, '--by', 'Mike Rihm', '--evidence', 'The tests pass.']);
  assert.equal(done.code, 0, done.out + done.err);
  assert.match(done.out, /No automatic backup: this project keeps its work items and memory outside this computer, so nothing was copied to a backup folder\./);
  assert.equal(fs.existsSync(path.join(dir, 'backups')), false);
});

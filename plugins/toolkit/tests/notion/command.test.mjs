// `toolkit notion ensure-root | ensure-project` as whole commands, with a fake
// ntn program (fake-ntn.mjs) standing in for the Notion CLI.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../../lib/cli.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../lib/notion/schema.mjs';
import { FakeNotion, seedProjects } from './fake-notion.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FAKE_NTN = path.join(HERE, 'fake-ntn.mjs');

function sink() {
  const chunks = [];
  return { write: (s) => { chunks.push(String(s)); return true; }, text: () => chunks.join('') };
}

function setup({ tracker = 'notion', memory = 'notion' } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-cmd-'));
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const state = path.join(dir, 'fake-notion.json');
  fs.writeFileSync(state, JSON.stringify(fake.toJSON()));
  const project = path.join(dir, 'project');
  fs.mkdirSync(project);
  fs.writeFileSync(path.join(project, '.toolkit.json'), `${JSON.stringify({
    toolkit: 'toolkit-v2',
    schema: 1,
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike' },
    tracker: { type: tracker, idPrefix: 'WI' },
    memory: { type: memory, approval: 'onboarding' },
    salesforce: { enabled: false },
    notion: {},
  }, null, 2)}\n`);
  const env = {
    ...process.env,
    TOOLKIT_NTN_BIN: FAKE_NTN,
    FAKE_NOTION_STATE: state,
    TOOLKIT_V2_CONFIG_DIR: path.join(dir, 'machine'),
    TOOLKIT_NOTION_MIN_INTERVAL_MS: '0',
  };
  return { dir, project, env, rootPageId: fake.rootPageId, state };
}

async function toolkit(args, { cwd, env }) {
  const stdout = sink();
  const stderr = sink();
  const code = await main(args, { cwd, env, stdout, stderr, stdin: '' });
  return { code, out: stdout.text(), err: stderr.text() };
}

test('toolkit help lists the notion command', async () => {
  const { dir, env } = setup();
  const res = await toolkit(['help'], { cwd: dir, env });
  assert.match(res.out, /notion\s+Set up or repair the Notion Projects database/);
});

test('ensure-root without a root page says how to give one', async () => {
  const { dir, env } = setup();
  const res = await toolkit(['notion', 'ensure-root'], { cwd: dir, env });
  assert.equal(res.code, 2);
  assert.match(res.err, /--root-page/);
});

test('ensure-root adds the registry and saves the ids for this computer', async () => {
  const { dir, env, rootPageId } = setup();
  const res = await toolkit(['notion', 'ensure-root', '--root-page', `https://app.notion.com/p/Test-${rootPageId.replace(/-/g, '')}`, '--json'], { cwd: dir, env });
  assert.equal(res.code, 0, res.err || res.out);
  const json = JSON.parse(res.out);
  assert.equal(json.ok, true);
  assert.ok(json.added.includes('Key'));
  const machine = JSON.parse(fs.readFileSync(path.join(env.TOOLKIT_V2_CONFIG_DIR, 'notion.json'), 'utf8'));
  assert.equal(machine.rootPageId, rootPageId);
  assert.ok(machine.projects.dataSourceId);
});

test('ensure-project builds everything, writes the ids into .toolkit.json, and a second run changes nothing', async () => {
  const { project, env, rootPageId } = setup();
  await toolkit(['notion', 'ensure-root', '--root-page', rootPageId], { cwd: project, env });
  const first = await toolkit(['notion', 'ensure-project'], { cwd: project, env });
  assert.equal(first.code, 0, first.err || first.out);
  assert.match(first.out, /Work Items database: https:\/\/app\.notion\.com\/p\//);
  assert.match(first.out, /Created:\n {2}- Project row "Sample app"/);
  const cfg = JSON.parse(fs.readFileSync(path.join(project, '.toolkit.json'), 'utf8'));
  assert.equal(cfg.notion.rootPageId, rootPageId);
  assert.ok(cfg.notion.workItems.dataSourceId);
  assert.ok(cfg.notion.workItems.views.board);
  assert.ok(cfg.notion.memory.pages.focus);
  assert.equal(cfg.toolkit, 'toolkit-v2');
  const saved = fs.readFileSync(path.join(project, '.toolkit.json'), 'utf8');
  assert.equal(cfg.notion.verifiedAt, undefined, 'the check time is not committed');
  const second = await toolkit(['notion', 'ensure-project', '--json'], { cwd: project, env });
  const json = JSON.parse(second.out);
  const { verifiedAt, ...report } = json.report;
  assert.ok(verifiedAt);
  assert.deepEqual(report, { created: [], added: [], problems: [], notes: [], trackerPrefix: 'WI' });
  assert.equal(json.configFile, null, '.toolkit.json is not written when nothing changed');
  assert.equal(fs.readFileSync(path.join(project, '.toolkit.json'), 'utf8'), saved);
  const ensureCache = JSON.parse(fs.readFileSync(path.join(project, '.toolkit-cache', 'notion', 'ensure.json'), 'utf8'));
  assert.equal(ensureCache.verifiedAt, verifiedAt);
  const check = await toolkit(['notion', 'ensure-project', '--check'], { cwd: project, env });
  assert.equal(check.code, 0);
  assert.match(check.out, /Everything was already in place/);
});

test('a --root-page or --projects-database that is not a Notion id exits 2', async () => {
  const { dir, project, env } = setup();
  const a = await toolkit(['notion', 'ensure-root', '--root-page', 'not-an-id'], { cwd: dir, env });
  assert.equal(a.code, 2);
  assert.match(a.err, /--root-page "not-an-id" is not a Notion id or URL/);
  const b = await toolkit(['notion', 'ensure-project', '--root-page', 'not-an-id'], { cwd: project, env });
  assert.equal(b.code, 2);
  const c = await toolkit(['notion', 'ensure-root', '--root-page', '11111111222233334444555555555555', '--projects-database', 'nope'], { cwd: dir, env });
  assert.equal(c.code, 2);
  assert.match(c.err, /--projects-database/);
});

test('ensure-project outside a project exits 4', async () => {
  const { dir, env } = setup();
  const res = await toolkit(['notion', 'ensure-project'], { cwd: dir, env });
  assert.equal(res.code, 4);
});

test('an unknown subcommand exits 2', async () => {
  const { dir, env } = setup();
  const res = await toolkit(['notion', 'rebuild'], { cwd: dir, env });
  assert.equal(res.code, 2);
  assert.match(res.err, /ensure-root or ensure-project/);
});

test('the toolkit work and memory commands can use the Notion drivers the command set up', async () => {
  const { project, env, rootPageId } = setup();
  await toolkit(['notion', 'ensure-project', '--root-page', rootPageId], { cwd: project, env });
  const { openTracker } = await import('../../lib/work/driver.mjs');
  const { loadDriver } = await import('../../lib/memory/contract.mjs');
  const cfg = JSON.parse(fs.readFileSync(path.join(project, '.toolkit.json'), 'utf8'));
  const p = { root: project, mainRoot: project, config: cfg };
  const tracker = await openTracker(p, { env });
  assert.equal(tracker.type, 'notion');
  const memory = await loadDriver(p, { env });
  assert.equal(memory.backend, 'notion');
  const focus = await memory.focusGet();
  assert.match(focus.text, /# Current focus/);
});

test('memory delete in a Notion project prints the driver\'s own detail: the page is in the Notion trash for 30 days', async () => {
  const { project, env, rootPageId } = setup({ tracker: 'local' });
  assert.equal((await toolkit(['notion', 'ensure-project', '--root-page', rootPageId], { cwd: project, env })).code, 0);
  const saved = await toolkit(['memory', 'save', '--type', 'reference', '--name', 'to-remove', '--description', 'A note to remove', '--body', 'Note.\n'], { cwd: project, env });
  assert.equal(saved.code, 0, saved.err);
  const refused = await toolkit(['memory', 'delete', 'reference_to_remove'], { cwd: project, env });
  assert.equal(refused.code, 2);
  assert.match(refused.err, /moves it to the Notion trash, and Notion deletes it for good after 30 days/);
  assert.doesNotMatch(refused.err, /cannot be undone/);
  const deleted = await toolkit(['memory', 'delete', 'reference_to_remove', '--owner-approved', '--json'], { cwd: project, env });
  assert.equal(deleted.code, 0, deleted.err);
  const json = JSON.parse(deleted.out);
  assert.equal(json.trash, true);
  assert.match(json.detail, /Notion trash/);
  const text = await toolkit(['memory', 'save', '--type', 'reference', '--name', 'second', '--description', 'Another note', '--body', 'Note.\n'], { cwd: project, env });
  assert.equal(text.code, 0, text.err);
  const human = await toolkit(['memory', 'delete', 'reference_second', '--owner-approved'], { cwd: project, env });
  assert.equal(human.code, 0, human.err);
  assert.match(human.out, /^Deleted reference_second\. reference_second was moved to the Notion trash\. Notion deletes it for good after 30 days; until then it can be restored from the trash in the Notion app\.\n$/);
  assert.doesNotMatch(human.out, /cannot be undone/);
});

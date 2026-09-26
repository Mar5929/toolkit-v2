// Picking the tracker driver from .toolkit.json (ARCHITECTURE 3, 4.5; critique M18).

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { makeProject, cleanup, tk, PLUGIN_ROOT } from './helpers.mjs';
import { openTracker, REQUIRED_METHODS, trackerInstructionsPath, unsupportedTracker } from '../../lib/work/driver.mjs';
import { LocalTracker } from '../../lib/work/local.mjs';
import { requireProject } from '../../lib/core/config.mjs';
import { EXIT } from '../../lib/core/output.mjs';
import { opNew, opSet, opApprove, opFinish, mustGet } from '../../lib/work/ops.mjs';
import { parseDoc, composeDoc, setH1, canonicalId } from '../../lib/work/model.mjs';

after(cleanup);

test('a local project gets the local driver with every interface method', async () => {
  const dir = makeProject();
  const t = await openTracker(requireProject(dir));
  assert.ok(t instanceof LocalTracker);
  for (const m of REQUIRED_METHODS) assert.equal(typeof t[m], 'function', m);
  assert.equal(t.type, 'local');
  assert.equal(t.prefix, 'WI');
});

test('github and jira projects get exit 3 with the path to the written instructions', async () => {
  for (const type of ['github', 'jira']) {
    const dir = makeProject({ tracker: type });
    await assert.rejects(openTracker(requireProject(dir)), (err) => err.code === EXIT.UNSUPPORTED && err.message.includes(`plugins/work/references/trackers/${type}.md`));
    const r = await tk(dir, ['work', 'list']);
    assert.equal(r.code, 3);
    assert.match(r.stderr, new RegExp(`references/trackers/${type}\\.md`));
    const life = await tk(dir, ['work', 'lifecycle']);
    assert.equal(life.code, 0, 'the lifecycle is the same for every tracker');
  }
});

function tempDir() {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tk-layout-')));
  after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function put(file, text = '# Instructions\n') {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  return file;
}

test('tracker instructions: the repository layout finds plugins/work next to plugins/toolkit', () => {
  const where = trackerInstructionsPath('github', PLUGIN_ROOT);
  assert.equal(where.path, path.resolve(PLUGIN_ROOT, '..', 'work', 'references', 'trackers', 'github.md'));
  assert.equal(where.rel, "the work plugin's references/trackers/github.md");
  const repo = tempDir();
  const inRepo = put(path.join(repo, 'plugins', 'work', 'references', 'trackers', 'jira.md'));
  fs.mkdirSync(path.join(repo, 'plugins', 'toolkit'), { recursive: true });
  const env = { HOME: repo };
  assert.equal(trackerInstructionsPath('jira', path.join(repo, 'plugins', 'toolkit'), { env, selfRoot: null }).path, inRepo);
});

test('tracker instructions: the Claude Code cache layout finds the work plugin in a sibling folder, any version', () => {
  const home = tempDir();
  const cache = path.join(home, '.claude', 'plugins', 'cache', 'toolkit-v2');
  const toolkitRoot = path.join(cache, 'toolkit', '0.2.0');
  fs.mkdirSync(toolkitRoot, { recursive: true });
  const env = { HOME: home, CLAUDE_CONFIG_DIR: path.join(home, 'no-claude'), CODEX_HOME: path.join(home, 'no-codex') };
  // Only other versions of the work plugin: the newest wins (0.10.0 is newer than 0.9.0).
  put(path.join(cache, 'work', '0.9.0', 'references', 'trackers', 'github.md'));
  const newest = put(path.join(cache, 'work', '0.10.0', 'references', 'trackers', 'github.md'));
  assert.equal(trackerInstructionsPath('github', toolkitRoot, { env, selfRoot: null }).path, newest);
  // The toolkit's own version wins when the work plugin has it.
  const same = put(path.join(cache, 'work', '0.2.0', 'references', 'trackers', 'github.md'));
  assert.equal(trackerInstructionsPath('github', toolkitRoot, { env, selfRoot: null }).path, same);
  // The message names the file it found.
  const err = unsupportedTracker('github', toolkitRoot, env);
  assert.ok(err.message.includes(same), err.message);
});

test('tracker instructions: the Codex cache (~/.codex/plugins/cache/toolkit-v2/work/<version>/) is searched', () => {
  const home = tempDir();
  const elsewhere = path.join(home, 'somewhere', 'toolkit');
  fs.mkdirSync(elsewhere, { recursive: true });
  const inCodex = put(path.join(home, '.codex', 'plugins', 'cache', 'toolkit-v2', 'work', '0.1.0', 'references', 'trackers', 'jira.md'));
  assert.equal(trackerInstructionsPath('jira', elsewhere, { env: { HOME: home }, selfRoot: null }).path, inCodex);
  // CODEX_HOME moves it.
  const codexHome = path.join(home, 'codex-home');
  const moved = put(path.join(codexHome, 'plugins', 'cache', 'toolkit-v2', 'work', '0.3.0', 'references', 'trackers', 'jira.md'));
  assert.equal(trackerInstructionsPath('jira', elsewhere, { env: { HOME: path.join(home, 'empty'), CODEX_HOME: codexHome }, selfRoot: null }).path, moved);
});

test('tracker instructions: when the file is nowhere, the message names it plainly', () => {
  const home = tempDir();
  const env = { HOME: home };
  const where = trackerInstructionsPath('github', path.join(home, 'toolkit'), { env, selfRoot: null });
  assert.deepEqual(where, { rel: "the work plugin's references/trackers/github.md", path: null });
});

test('a missing Notion driver gives exit 3 with a clear message', async () => {
  const dir = makeProject({ tracker: 'notion' });
  const missing = async () => {
    const err = new Error("Cannot find module '/nowhere/lib/notion/tracker.mjs'");
    err.code = 'TOOLKIT_NOTION_MISSING';
    throw err;
  };
  await assert.rejects(openTracker(requireProject(dir), { importNotion: missing }), (err) => err.code === EXIT.UNSUPPORTED && /Notion tracker driver/.test(err.message));
  const broken = async () => {
    const err = new Error("Cannot find module '/somewhere/else/client.mjs' imported from /x/tracker.mjs");
    err.code = 'ERR_MODULE_NOT_FOUND';
    throw err;
  };
  await assert.rejects(openTracker(requireProject(dir), { importNotion: broken }), (err) => err.code === 'ERR_MODULE_NOT_FOUND', 'a broken driver is shown as it is');
});

test('an unknown tracker type is a validation error', async () => {
  const dir = makeProject({ tracker: 'trello' });
  const r = await tk(dir, ['work', 'list']);
  assert.equal(r.code, 2);
});

/** A tiny in-memory driver, shaped like the Notion one, to prove ops use only the interface. */
function memoryDriver() {
  const items = new Map();
  let n = 0;
  const api = {
    type: 'notion',
    prefix: 'WI',
    async list() {
      return [...items.values()].map((i) => ({ id: i.id, meta: { ...i.meta }, location: i.location }));
    },
    async get(id) {
      const i = items.get(canonicalId(id));
      return i ? { id: i.id, meta: { ...i.meta }, body: i.body, location: i.location } : null;
    },
    async create({ meta, body }) {
      n += 1;
      const id = `WI-${String(n).padStart(3, '0')}`;
      items.set(id, { id, meta: { ...meta, id }, body: setH1(body, id, meta.title), location: `https://notion.example/${id}` });
      return id;
    },
    async update(id, { meta = {}, body, expectBody }) {
      const i = items.get(canonicalId(id));
      if (expectBody !== undefined && expectBody !== i.body) {
        const err = new Error('changed');
        err.details = { conflict: true };
        throw err;
      }
      Object.assign(i.meta, meta);
      if (body !== undefined) i.body = body;
      return api.get(id);
    },
    async getDesign() {
      return null;
    },
    async setDesign() {
      throw new Error('not in this test');
    },
    async sync() {
      return { changed: false, moves: [], adopted: [], renumbered: [], ownerEdits: [], problems: [] };
    },
  };
  return api;
}

test('the operations run the same way on any driver that implements the interface', async () => {
  const dir = makeProject({ tracker: 'notion' });
  const project = requireProject(dir);
  const driver = memoryDriver();
  const t = await openTracker(project, { importNotion: async () => ({ createTracker: () => driver }) });
  assert.equal(t, driver);
  const created = await opNew(t, project, { title: 'Card', type: 'build', today: '2026-09-26' });
  assert.equal(created.id, 'WI-001');
  assert.match(created.record.body, /^\n?# WI-001: Card$/m);
  await assert.rejects(opSet(t, 'WI-001', { stage: '08' }), (err) => err.code === EXIT.INVALID);
  await opApprove(t, project, 'WI-001', { what: 'requirements', by: 'Mike', today: '2026-09-26' });
  const rec = await mustGet(t, 'WI-001');
  assert.equal(rec.meta.stage, '03-requirements-approved');
  assert.equal(rec.meta.status, 'Ready');
  await opSet(t, 'WI-001', { stage: '11' });
  const done = await opFinish(t, 'WI-001', { by: 'Mike', evidence: 'Works.', today: '2026-09-26' });
  assert.equal(done.record.meta.status, 'Done');
  assert.equal(done.record.meta.result_approved, '2026-09-26 by Mike');
  const text = composeDoc(done.record.meta, done.record.body);
  assert.equal(parseDoc(text).meta.id, 'WI-001');
});

test('a driver missing interface methods is refused', async () => {
  const dir = makeProject({ tracker: 'notion' });
  await assert.rejects(openTracker(requireProject(dir), { importNotion: async () => ({ createTracker: () => ({ list() {} }) }) }), /missing get, create, update/);
});

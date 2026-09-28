// Parity with the model project: toolkit init, run into a new Git repository
// for every tracker x memory x Salesforce setup, is compared file by file with
// scaffold/model/ (the exact copy of Mike's model project). Every difference
// must be explained by scaffold/CONDITIONS.json or be one of the files the
// toolkit adds:
//   - a model file is missing only when one of its CONDITIONS.json "only"
//     conditions does not hold, or a "jsonRemove" rule left nothing in it;
//   - an installed model file has the model file's executable bits;
//   - a model file differs only by its setup markers (dropped with the blocks
//     that do not apply), the project name filled on heading lines, the
//     generated rules list in AGENTS.md, the Salesforce lines removed from
//     .gitignore and from the paths list of publish-project-documents.md,
//     the Salesforce entries removed from the settings, and the
//     toolkit's own entries merged into .gitignore and the settings;
//   - a generated file (.memory/MEMORY.md, ai-external-knowledge/INDEX.md)
//     is the model's file exactly, because a new project has no memory
//     records and no captured topics yet;
//   - the only files not in the model are the toolkit's own (.toolkit.json,
//     tracker state and dashboard, memory meta file, .codex/config.toml,
//     .codex/rules/toolkit.rules).
// A Salesforce project with the local tracker and built-in memory gets the
// model byte for byte apart from those.
//
// Everything runs offline: Notion through the fake ntn from the Notion tests,
// Hindsight through a fake server answered in this process. This file checks
// the model with its own small readers of CONDITIONS.json, not with the
// install engine's.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanup, git, listFiles, makeHome, makeRepo, read, tempDir, testEnv } from '../project/helpers.mjs';
import { initProject } from '../../lib/project/init.mjs';
import { buildSpan, readRules, spanBody, SPAN_START, SPAN_END } from '../../lib/project/render.mjs';

after(cleanup);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN = path.resolve(HERE, '..', '..');
const MODEL = path.join(PLUGIN, 'scaffold', 'model');
const CONDITIONS = JSON.parse(read(path.join(PLUGIN, 'scaffold', 'CONDITIONS.json')));
const TOOLKIT_SETTINGS = JSON.parse(read(path.join(PLUGIN, 'templates', 'settings', 'claude-toolkit.json')));
const TOOLKIT_GITIGNORE = read(path.join(PLUGIN, 'templates', 'gitignore', 'toolkit.gitignore'));

/** Files the toolkit adds that the model does not hold. */
const TOOLKIT_FILES = new Set([
  '.toolkit.json',
  '.work-items/.toolkit-state.json',
  '.work-items/DASHBOARD.md',
  '.memory/.toolkit-meta.json',
  '.codex/config.toml',
  '.codex/rules/toolkit.rules',
]);

// ------------------------------------------------------------------ this test's own readers of the model and CONDITIONS.json

function modelFiles() {
  return listFiles(MODEL).filter((f) => f !== '.import.json');
}

function globRe(glob) {
  let re = '';
  const parts = glob.split('/');
  parts.forEach((part, i) => {
    const last = i === parts.length - 1;
    if (part === '**') {
      re += last ? '.*' : '(?:[^/]+/)*';
      return;
    }
    re += part.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*');
    if (!last) re += '/';
  });
  return new RegExp(`^${re}$`);
}

function holds(when, setup) {
  if (when === 'tracker:local') return setup.tracker === 'local';
  if (when === 'memory:builtin') return setup.memory === 'builtin';
  if (when === 'salesforce') return setup.salesforce;
  if (when === 'host:claude-code') return setup.hosts.includes('claude-code');
  if (when === 'host:codex') return setup.hosts.includes('codex');
  throw new Error(`unknown condition ${when}`);
}

/** The "only" conditions of a model path that do not hold for a setup. */
function failingConditions(rel, setup) {
  return (CONDITIONS.only || []).filter((r) => r.paths.some((p) => globRe(p).test(rel)) && !holds(r.when, setup)).map((r) => r.when);
}

/** The model text with its setup markers resolved: marker lines out, and the blocks whose condition does not hold. */
function resolveMarkers(text, setup) {
  const conditionHolds = (c) => {
    if (c === 'salesforce') return setup.salesforce;
    if (c === 'not salesforce') return !setup.salesforce;
    const m = /^(tracker|memory)=(.+)$/.exec(c);
    if (!m) throw new Error(`unknown marker ${c}`);
    return setup[m[1]] === m[2];
  };
  const out = [];
  let keep = true;
  for (const line of text.split('\n')) {
    const t = line.trim();
    const open = /^<!-- if (.+) -->$/.exec(t);
    if (open) {
      keep = conditionHolds(open[1]);
      continue;
    }
    if (t === '<!-- endif -->') {
      keep = true;
      continue;
    }
    if (keep) out.push(line);
  }
  return out.join('\n');
}

function fillName(rel, text, name) {
  const fill = (CONDITIONS.fill || []).find((f) => f.paths.includes(rel));
  if (!fill) return text;
  return text.split('\n').map((l) => (/^#{1,6} /.test(l) ? l.split(fill.text).join(name) : l)).join('\n');
}

function withoutSpan(text) {
  const lines = text.split('\n');
  const a = lines.indexOf(SPAN_START);
  const b = lines.indexOf(SPAN_END);
  return a === -1 || b === -1 ? text : [...lines.slice(0, a + 1), ...lines.slice(b)].join('\n');
}

function rule(list, rel) {
  return (CONDITIONS[list] || []).find((r) => r.path === rel);
}

/** The model's JSON with the Salesforce entries a jsonRemove rule names taken out (a non-Salesforce project). */
function modelJsonFor(rel, setup) {
  const data = JSON.parse(read(path.join(MODEL, rel)));
  const r = rule('jsonRemove', rel);
  if (!r || setup.salesforce) return data;
  const runs = (h) => [h.command, ...(h.args || [])].some((s) => typeof s === 'string' && r.hookCommandContains.some((n) => s.includes(n)));
  if (data.hooks) {
    for (const event of Object.keys(data.hooks)) {
      data.hooks[event] = data.hooks[event].map((g) => ({ ...g, hooks: g.hooks.filter((h) => !runs(h)) })).filter((g) => g.hooks.length);
      if (!data.hooks[event].length) delete data.hooks[event];
    }
    if (!Object.keys(data.hooks).length) delete data.hooks;
  }
  for (const [key, values] of Object.entries(r.values || {})) {
    const [a, b] = key.split('.');
    if (data[a] && Array.isArray(data[a][b])) {
      data[a][b] = data[a][b].filter((v) => !values.includes(v));
      if (!data[a][b].length) delete data[a][b];
    }
  }
  return data;
}

/** The project's .claude/settings.json with the toolkit's own entries taken out again. */
function settingsWithoutToolkit(installed, model) {
  const out = JSON.parse(JSON.stringify(installed));
  for (const key of Object.keys(TOOLKIT_SETTINGS)) {
    if (key === 'enabledPlugins' || key === 'permissions') continue;
    if (!(key in model)) delete out[key];
  }
  if (!('outputStyle' in model)) {
    assert.equal(out.outputStyle, 'Plain English', 'init sets the output style the model does not name');
    delete out.outputStyle;
  }
  const modelPlugins = model.enabledPlugins || {};
  for (const id of Object.keys(out.enabledPlugins || {})) {
    if (id in modelPlugins) continue;
    assert.ok(id.endsWith('@toolkit-v2') || id.endsWith('@claude-toolkit'), `${id} is a toolkit plugin switch`);
    delete out.enabledPlugins[id];
  }
  if (out.enabledPlugins && !Object.keys(out.enabledPlugins).length && !model.enabledPlugins) delete out.enabledPlugins;
  // The toolkit's permission rules: allow toolkit, and ask first for the risky toolkit commands (decision 12).
  for (const list of ['allow', 'ask']) {
    const mine = TOOLKIT_SETTINGS.permissions[list] || [];
    if (out.permissions && out.permissions[list]) {
      out.permissions[list] = out.permissions[list].filter((a) => !mine.includes(a) || ((model.permissions || {})[list] || []).includes(a));
      if (!out.permissions[list].length && !((model.permissions || {})[list])) delete out.permissions[list];
    }
  }
  return out;
}

// ------------------------------------------------------------------ offline backends

/** A Hindsight server in this process: banks, their settings, and the health route. */
function fakeHindsight() {
  const banks = new Map();
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
  return async (url, init = {}) => {
    const u = new URL(url);
    const method = init.method || 'GET';
    const body = init.body ? JSON.parse(init.body) : undefined;
    if (u.pathname === '/health') return json({ status: 'healthy' });
    if (method === 'GET' && u.pathname === '/v1/default/banks') {
      const q = u.searchParams.get('q') || '';
      const rows = [...banks.keys()].filter((id) => id.includes(q)).map((id) => ({ bank_id: id, fact_count: 0, last_write_at: null }));
      return json({ banks: rows, total: rows.length });
    }
    const m = /^\/v1\/default\/banks\/([^/]+)(\/config)?$/.exec(u.pathname);
    if (!m) return json({ detail: 'Not Found' }, 404);
    const id = decodeURIComponent(m[1]);
    if (m[2]) {
      if (!banks.has(id)) return json({ detail: 'Not Found' }, 404);
      if (method === 'PATCH') Object.assign(banks.get(id), body.updates);
      const cfg = banks.get(id);
      return json({ bank_id: id, config: { ...cfg }, overrides: { ...cfg } });
    }
    if (method === 'PUT') {
      banks.set(id, { ...(banks.get(id) || {}), ...body });
      return json({ bank_id: id });
    }
    return json({ detail: 'Not Found' }, 404);
  };
}

async function notionEnv(env) {
  const { FakeNotion, seedProjects } = await import('../notion/fake-notion.mjs');
  const { PROJECTS_BASE_PROPERTIES } = await import('../../lib/notion/schema.mjs');
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const state = path.join(tempDir('tk-parity-notion-'), 'fake-notion.json');
  fs.writeFileSync(state, JSON.stringify(fake.toJSON()));
  const out = {
    ...env,
    TOOLKIT_NTN_BIN: path.join(HERE, '..', 'notion', 'fake-ntn.mjs'),
    FAKE_NOTION_STATE: state,
    TOOLKIT_NOTION_MIN_INTERVAL_MS: '0',
  };
  fs.mkdirSync(out.TOOLKIT_V2_CONFIG_DIR, { recursive: true });
  fs.writeFileSync(path.join(out.TOOLKIT_V2_CONFIG_DIR, 'notion.json'), JSON.stringify({ rootPageId: fake.rootPageId }));
  return out;
}

async function setUp(setup) {
  const root = makeRepo();
  // A computer with no claude-toolkit plugins, so no switches beyond the fragment's are added.
  let env = testEnv(makeHome({ claudeOld: [], codexOld: [] }));
  if (setup.tracker === 'notion' || setup.memory === 'notion') env = await notionEnv(env);
  const res = await initProject({
    name: 'Acme CRM', key: `acme-${setup.tracker}-${setup.memory}${setup.salesforce ? '-sf' : ''}`, owner: 'Mike',
    tracker: setup.tracker, memory: setup.memory, salesforce: setup.salesforce, hosts: setup.hosts.join(','),
  }, { cwd: root, env, fetch: fakeHindsight() });
  return { root, res };
}

// ------------------------------------------------------------------ the comparison

/**
 * Compare one set-up project with the model. Returns the model files that
 * differ, so a caller can check that nothing else differs.
 */
function compare(root, setup) {
  const installed = listFiles(root);
  const model = modelFiles();
  const differing = [];

  for (const f of installed) {
    if (!model.includes(f)) assert.ok(TOOLKIT_FILES.has(f), `${f} is neither in the model nor a toolkit file`);
  }

  for (const f of model) {
    const failing = failingConditions(f, setup);
    const out = path.join(root, f);
    if (failing.length) {
      assert.ok(!fs.existsSync(out), `${f} is installed although ${failing.join(' and ')} does not hold`);
      continue;
    }
    const jr = rule('jsonRemove', f);
    if (!fs.existsSync(out)) {
      assert.ok(jr && jr.skipFileWhenNoHooksLeft && !setup.salesforce && !modelJsonFor(f, setup).hooks,
        `${f} is missing, and no CONDITIONS.json rule leaves it out`);
      continue;
    }
    const execBits = (p) => fs.statSync(p).mode & 0o111;
    assert.equal(execBits(out), execBits(path.join(MODEL, f)), `${f} has the model file's executable bits`);
    const want = read(path.join(MODEL, f));
    const got = read(out);
    if (got === want) continue;
    differing.push(f);

    if (f === 'AGENTS.md') {
      const expected = fillName(f, resolveMarkers(want, setup), 'Acme CRM');
      assert.equal(withoutSpan(got), withoutSpan(expected), 'AGENTS.md is the model with its markers resolved and the name filled');
      assert.equal(spanBody(got), buildSpan(readRules(root)), 'the rules list names the rule files the project has');
      continue;
    }
    if (/<!-- if |<!-- endif -->/.test(want) || (CONDITIONS.fill || []).some((r) => r.paths.includes(f))) {
      assert.equal(got, fillName(f, resolveMarkers(want, setup), 'Acme CRM'), `${f} is the model with its markers resolved and the name filled`);
      continue;
    }
    if (f === '.gitignore') {
      const lr = rule('lineRemove', f);
      const base = !setup.salesforce && lr ? want.split('\n').filter((l) => !lr.lines.includes(l)).join('\n') : want;
      assert.equal(got, `${base.replace(/\s*$/, '')}\n\n${TOOLKIT_GITIGNORE}`, '.gitignore is the model\'s, then the toolkit\'s lines');
      continue;
    }
    if (f === '.claude/settings.json') {
      const expected = modelJsonFor(f, setup);
      assert.deepEqual(settingsWithoutToolkit(JSON.parse(got), expected), expected, 'the settings are the model\'s plus the toolkit\'s entries');
      const s = JSON.parse(got);
      assert.equal(s.enabledPlugins['sf-architect-solutioning@toolkit-v2'], setup.salesforce);
      assert.deepEqual(s.worktree, { baseRef: 'head' });
      assert.ok(s.permissions.allow.includes('Bash(toolkit *)'));
      for (const rule of ['Bash(toolkit machine-setup)', 'Bash(toolkit memory delete *)', 'Bash(toolkit import *)', 'Bash(toolkit hindsight service start *)']) {
        assert.ok(s.permissions.ask.includes(rule), `${rule} asks the owner first`);
      }
      assert.equal(s.autoMemoryEnabled, false);
      continue;
    }
    if (f === '.codex/hooks.json') {
      assert.deepEqual(JSON.parse(got), modelJsonFor(f, setup));
      continue;
    }
    if (rule('lineRemove', f)) {
      const lr = rule('lineRemove', f);
      const base = !setup.salesforce ? want.split('\n').filter((l) => !lr.lines.includes(l)).join('\n') : want;
      assert.equal(got, base, `${f} is the model's file with the lines a lineRemove rule names taken out`);
      continue;
    }
    if ((CONDITIONS.generated || []).some((g) => g.path === f)) {
      assert.equal(got, want, `${f} is generated, and in a new project with no records it is the model's file exactly`);
      continue;
    }
    assert.fail(`${f} differs from the model, and nothing in CONDITIONS.json explains it`);
  }
  return differing;
}

const SETUPS = [];
for (const tracker of ['local', 'notion', 'github', 'jira']) {
  for (const memory of ['builtin', 'hindsight', 'notion']) {
    for (const salesforce of [true, false]) SETUPS.push({ tracker, memory, salesforce, hosts: ['claude-code', 'codex'] });
  }
}

for (const setup of SETUPS) {
  const name = `${setup.tracker} tracker, ${setup.memory} memory, ${setup.salesforce ? 'Salesforce' : 'not Salesforce'}`;
  test(`parity: ${name}`, { timeout: 120000 }, async () => {
    const { root, res } = await setUp(setup);
    assert.ok(res.config && res.config.toolkit === 'toolkit-v2', 'init finished');
    const differing = compare(root, setup);
    // The files with setup markers or the name always differ; nothing else may,
    // except the settings and .gitignore merges named in CONDITIONS.json.
    const allowed = new Set(['AGENTS.md', 'README.md', 'PROJECT.md', '.gitignore', '.claude/settings.json', '.codex/hooks.json', ...(CONDITIONS.lineRemove || []).map((r) => r.path)]);
    assert.deepEqual(differing.filter((f) => !allowed.has(f)), []);
  });
}

test('parity: a Salesforce project with the local tracker and built-in memory is the model byte for byte, apart from the documented changes', async () => {
  const setup = { tracker: 'local', memory: 'builtin', salesforce: true, hosts: ['claude-code', 'codex'] };
  const { root } = await setUp(setup);
  const installed = listFiles(root);
  const model = modelFiles();
  assert.deepEqual(model.filter((f) => !installed.includes(f)), [], 'every model file is installed');
  assert.deepEqual(installed.filter((f) => !model.includes(f)).sort(), [...TOOLKIT_FILES].filter((f) => f !== '.memory/.toolkit-meta.json' || installed.includes(f)).sort());
  const differing = compare(root, setup);
  const expected = ['.claude/settings.json', '.gitignore', 'AGENTS.md', 'PROJECT.md', 'README.md'];
  assert.deepEqual(differing.sort(), expected);
  // The rules list is the model's own list, and the settings add only the toolkit's entries.
  assert.equal(spanBody(read(path.join(root, 'AGENTS.md'))), spanBody(read(path.join(MODEL, 'AGENTS.md'))));
  assert.equal(read(path.join(root, '.codex', 'hooks.json')), read(path.join(MODEL, '.codex', 'hooks.json')));
  assert.equal(read(path.join(root, 'CLAUDE.md')), read(path.join(MODEL, 'CLAUDE.md')));
  // The toolkit adds: its state and dashboard, .toolkit.json, and the Codex settings.
  assert.equal(git(root, ['check-ignore', '.work-items/DASHBOARD.md']), '.work-items/DASHBOARD.md');
});

test('parity: one host only leaves out the other host\'s files and nothing else', async () => {
  for (const hosts of [['claude-code'], ['codex']]) {
    const setup = { tracker: 'local', memory: 'builtin', salesforce: true, hosts };
    const { root } = await setUp(setup);
    compare(root, setup);
    const files = listFiles(root);
    if (hosts[0] === 'codex') {
      assert.ok(!files.includes('CLAUDE.md') && !files.includes('.claude/settings.json') && !files.some((f) => f.startsWith('.claude/skills/')));
      assert.ok(files.includes('.agents/skills/sf-deploy-check/SKILL.md') && files.includes('.codex/hooks.json'));
    } else {
      assert.ok(!files.some((f) => f.startsWith('.codex/') || f.startsWith('.agents/')));
      assert.ok(files.includes('CLAUDE.md') && files.includes('.claude/skills/sf-deploy-check/SKILL.md'));
    }
  }
});

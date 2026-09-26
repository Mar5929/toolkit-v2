// toolkit init into temporary Git repositories: every setup combination the
// build plan names, running it twice, adopting an existing repository, and the
// refusals. Notion runs against the fake ntn from the Notion tests (a live run
// in the Notion test area needs TOOLKIT_NOTION_LIVE=1); Hindsight runs against
// the local server when it is up and is skipped otherwise.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  PLUGIN_ROOT, cleanup, git, initProject, listFiles, makeHome, makeRepo, read, sha, snapshot, testEnv, tk, tempDir,
} from './helpers.mjs';
import { hashText, SPAN_START, SPAN_END } from '../../lib/project/render.mjs';
import { tomlGet } from '../../lib/project/toml.mjs';
import { initProject as initDirect } from '../../lib/project/init.mjs';

after(cleanup);

const REPO = path.resolve(PLUGIN_ROOT, '..', '..');
const HERE = path.dirname(fileURLToPath(import.meta.url));

function config(root) {
  return JSON.parse(read(path.join(root, '.toolkit.json')));
}

function checkInstalledHashes(root) {
  const cfg = config(root);
  for (const [target, hash] of Object.entries(cfg.installed)) {
    const text = read(path.join(root, target));
    assert.equal(sha(hashText(target, text)), hash, `installed hash of ${target}`);
  }
}

test('local tracker + built-in memory: scaffold, AGENTS.md, settings, Codex files, seeds, and .toolkit.json', async () => {
  const { root, res } = await initProject({ tracker: 'local', memory: 'builtin' });
  assert.equal(res.code, 0, res.stderr || res.stdout);
  const files = listFiles(root);
  for (const f of ['AGENTS.md', 'PROJECT.md', 'PROJECT-ROADMAP.md', 'DECISIONS.md', 'README.md', '.gitignore', '.toolkit.json',
    '.claude/settings.json', '.claude/output-styles/plain-english.md', '.claude/rules/work-item-folders.md', '.claude/rules/work-item-stages.md',
    '.codex/config.toml', '.codex/rules/toolkit.rules', 'requirements/AGENTS.md', 'ai-external-knowledge/INDEX.md',
    '.work-items/work-item-template/WORK-ITEM.md', '.work-items/work-item-template/DESIGN.md', '.work-items/DASHBOARD.md', '.work-items/.toolkit-state.json',
    '.memory/AGENTS.md', '.memory/CURRENT_FOCUS.md', '.memory/MEMORY.md', '.memory/memory-criteria.md', '.memory/terminology-glossary.md']) {
    assert.ok(files.includes(f), `${f} is installed`);
  }
  assert.ok(!files.some((f) => /(^|\/)CLAUDE(\.local)?\.md$/.test(f)), 'no CLAUDE.md anywhere');
  assert.ok(!files.some((f) => f.startsWith('delivery/') || f.startsWith('force-app')), 'no Salesforce files');
  assert.ok(!files.some((f) => /^\.work-items\/WI-/.test(f)), 'no work items are copied');
  assert.ok(!files.some((f) => /^\.memory\/(user|feedback|project|reference|event)_/.test(f)), 'no memory records are copied');

  const agents = read(path.join(root, 'AGENTS.md'));
  assert.match(agents, /^# Acme CRM$/m);
  assert.match(agents, /Mike owns this project/);
  assert.match(agents, /IDs look like `WI-001`/);
  assert.match(agents, /built-in memory in `\.memory\/`/);
  assert.doesNotMatch(agents, /Notion|Hindsight server|sf-architect-solutioning/);
  assert.doesNotMatch(agents, /\{\{|<!-- if |<!-- endif -->|Filled by toolkit init/);
  assert.ok(agents.includes(`${SPAN_START}\nAlways on.`));
  assert.match(agents, /- `\.claude\/rules\/work-item-stages\.md`: Keep the Active Work Item Accurate/);
  assert.match(agents, /\| `ai-external-knowledge\/\*\*` \| `\.claude\/rules\/ai-external-knowledge\.md` \|/);
  assert.ok(agents.indexOf(SPAN_END) > agents.indexOf(SPAN_START));

  const settings = JSON.parse(read(path.join(root, '.claude', 'settings.json')));
  assert.equal(settings.outputStyle, 'Plain English');
  assert.equal(settings.autoMemoryEnabled, false);
  assert.deepEqual(settings.worktree, { baseRef: 'head' });
  assert.ok(settings.permissions.allow.includes('Bash(toolkit *)'));
  for (const p of ['toolkit', 'work', 'memory', 'session-skills', 'git-workflows']) assert.equal(settings.enabledPlugins[`${p}@toolkit-v2`], true, p);
  assert.equal(settings.enabledPlugins['sf-architect-solutioning@toolkit-v2'], false);
  assert.equal(settings.enabledPlugins['project-init@claude-toolkit'], false);
  assert.equal(settings.enabledPlugins['protocol-guard@claude-toolkit'], false, 'a claude-toolkit plugin from ~/.claude/settings.json is turned off too');
  assert.equal(settings.hooks, undefined, 'no Salesforce hooks outside Salesforce');

  const toml = read(path.join(root, '.codex', 'config.toml'));
  assert.equal(tomlGet(toml, ['plugins', 'toolkit@toolkit-v2', 'enabled']), true);
  assert.equal(tomlGet(toml, ['plugins', 'sf-architect-solutioning@toolkit-v2', 'enabled']), false);
  assert.equal(tomlGet(toml, ['plugins', 'second-brain@claude-toolkit', 'enabled']), false);
  assert.equal(tomlGet(toml, ['plugins', 'extra-thing@claude-toolkit', 'enabled']), false, 'a claude-toolkit plugin from ~/.codex/config.toml is turned off too');
  assert.match(read(path.join(root, '.codex', 'rules', 'toolkit.rules')), /pattern = \["toolkit"\]/);

  const cfg = config(root);
  assert.deepEqual(Object.keys(cfg), ['toolkit', 'schema', 'project', 'tracker', 'memory', 'salesforce', 'hosts', 'notion', 'hindsight', 'installed']);
  assert.deepEqual(cfg.project, { name: 'Acme CRM', key: 'acme-crm', owner: 'Mike', created: '2026-09-26' });
  assert.deepEqual(cfg.tracker, { type: 'local', idPrefix: 'WI' });
  assert.deepEqual(cfg.memory, { type: 'builtin', approval: 'onboarding' });
  assert.deepEqual(cfg.hosts, ['claude-code', 'codex']);
  assert.ok(Object.keys(cfg.installed).length >= 25);
  checkInstalledHashes(root);

  assert.equal(git(root, ['check-ignore', '.work-items/x']), '.work-items/x');
  assert.equal(git(root, ['check-ignore', '.memory/x']), '.memory/x');
  assert.match(read(path.join(root, '.work-items', 'DASHBOARD.md')), /Dashboard|DASHBOARD|Work items/i);
  assert.equal(fs.statSync(path.join(root, 'AGENTS.md')).mode & 0o777, 0o644);
});

test('init twice changes nothing the second time', async () => {
  const { root, env } = await initProject();
  const before = snapshot(root);
  const cfgFile = path.join(root, '.toolkit.json');
  const past = new Date(Date.now() - 60000);
  fs.utimesSync(cfgFile, past, past);
  const cfgTime = fs.statSync(cfgFile).mtimeMs;
  const res = await tk(root, ['init', '--name', 'Acme CRM', '--tracker', 'local', '--memory', 'builtin', '--owner', 'Mike'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /already set up/);
  assert.match(res.stdout, /Every scaffold file was already in place/);
  const afterSnap = snapshot(root);
  const changed = Object.keys(afterSnap).filter((f) => afterSnap[f] !== before[f]);
  assert.deepEqual(changed, [], 'no file is written, not even .toolkit.json or the tracker state');
  assert.equal(fs.statSync(cfgFile).mtimeMs, cfgTime, '.toolkit.json is not rewritten with the same bytes');
  // A bare re-run, with no flags, works too.
  const bare = await tk(root, ['init'], { env });
  assert.equal(bare.code, 0, bare.stderr);
});

test('Salesforce + local + built-in installs the Salesforce kit for both hosts', async () => {
  const { root, res } = await initProject({ salesforce: true, name: 'Acme Service', key: 'acme-service' });
  assert.equal(res.code, 0, res.stderr || res.stdout);
  const files = listFiles(root);
  for (const f of ['.claude/hooks/guard-protected-orgs.cjs', '.claude/hooks/guard-permission-set-deploy.cjs', '.claude/protected-orgs.json',
    '.claude/rules/salesforce-safety-guardrails.md', 'sfdx-project.json', '.forceignore', '.codex/hooks.json', 'tools/kb/README.md', 'tools/permissions/permsets.py',
    'delivery/deployment/component-tracker.csv', 'docs/permissions-runbook.md']) {
    assert.ok(files.includes(f), `${f} is installed`);
  }
  for (const d of ['force-app', 'delivery/meeting-notes', 'delivery/deliverables']) assert.ok(fs.statSync(path.join(root, d)).isDirectory(), d);
  for (const s of ['sf-component-tracker', 'sf-data-change', 'sf-deploy-check']) {
    const a = read(path.join(root, '.claude', 'skills', s, 'SKILL.md'));
    const b = read(path.join(root, '.agents', 'skills', s, 'SKILL.md'));
    assert.equal(a, b, `${s}: the Claude Code and Codex copies match`);
  }
  assert.equal(JSON.parse(read(path.join(root, 'sfdx-project.json'))).name, 'acme-service');
  const settings = JSON.parse(read(path.join(root, '.claude', 'settings.json')));
  assert.equal(settings.enabledPlugins['sf-architect-solutioning@toolkit-v2'], true);
  assert.ok(settings.permissions.deny.includes('Bash(sf org delete *)'));
  assert.ok(settings.permissions.deny.includes('Bash(git add -A)'), 'the base deny list is kept');
  assert.equal(settings.hooks.PreToolUse[0].hooks.length, 2);
  const codexHooks = JSON.parse(read(path.join(root, '.codex', 'hooks.json')));
  assert.match(codexHooks.hooks.PreToolUse[0].hooks[0].command, /--host codex/);
  assert.equal(tomlGet(read(path.join(root, '.codex', 'config.toml')), ['plugins', 'sf-architect-solutioning@toolkit-v2', 'enabled']), true);
  const agents = read(path.join(root, 'AGENTS.md'));
  assert.match(agents, /sf-architect-solutioning/);
  assert.match(agents, /`\.claude\/rules\/salesforce-safety-guardrails\.md`: Salesforce Org Safety/);
  assert.match(agents, /`force-app\/\*\*`, `tools\/kb\/\*\*`/);
  assert.match(read(path.join(root, '.gitignore')), /\.sfdx\//);
  assert.match(read(path.join(root, '.claude', 'rules', 'knowledge-direct-commit.md')), /"delivery\/\*\*"/);
  assert.deepEqual(config(root).salesforce, { enabled: true, orgs: {} });
  checkInstalledHashes(root);
});

test('hosts: Claude Code only gets no .codex files; Codex only gets no .claude/settings.json', async () => {
  const claudeOnly = await initProject({ hosts: 'claude-code', salesforce: true });
  assert.equal(claudeOnly.res.code, 0, claudeOnly.res.stderr);
  let files = listFiles(claudeOnly.root);
  assert.ok(!files.some((f) => f.startsWith('.codex/') || f.startsWith('.agents/')));
  assert.ok(files.includes('.claude/settings.json'));
  const codexOnly = await initProject({ hosts: 'codex', salesforce: true });
  assert.equal(codexOnly.res.code, 0, codexOnly.res.stderr);
  files = listFiles(codexOnly.root);
  assert.ok(!files.includes('.claude/settings.json') && !files.includes('.claude/output-styles/plain-english.md') && !files.some((f) => f.startsWith('.claude/skills/')));
  assert.ok(files.includes('.codex/config.toml') && files.includes('.agents/skills/sf-deploy-check/SKILL.md'));
  assert.ok(files.includes('.claude/rules/salesforce-safety-guardrails.md'), 'rules install for both hosts');
  assert.deepEqual(config(codexOnly.root).hosts, ['codex']);
});

test('hosts: no --hosts means both; a hosts list in .toolkit.json is kept on a second run and on sync, and "claude" means claude-code', async () => {
  const both = await initProject();
  assert.equal(both.res.code, 0, both.res.stderr);
  assert.deepEqual(config(both.root).hosts, ['claude-code', 'codex']);
  let files = listFiles(both.root);
  assert.ok(files.includes('.claude/settings.json') && files.includes('.codex/config.toml'));

  const claudeOnly = await initProject({ hosts: 'claude-code' });
  assert.equal(claudeOnly.res.code, 0, claudeOnly.res.stderr);
  const again = await tk(claudeOnly.root, ['init'], { env: claudeOnly.env });
  assert.equal(again.code, 0, again.stderr);
  const synced = await tk(claudeOnly.root, ['sync'], { env: claudeOnly.env });
  assert.equal(synced.code, 0, synced.stderr);
  files = listFiles(claudeOnly.root);
  assert.ok(!files.some((f) => f.startsWith('.codex/') || f.startsWith('.agents/')), 'no Codex files after init again and sync');
  assert.deepEqual(config(claudeOnly.root).hosts, ['claude-code']);

  // A hand-written hosts value: "claude" is Claude Code; the next init writes the standard name.
  const cfgFile = path.join(claudeOnly.root, '.toolkit.json');
  const c = config(claudeOnly.root);
  c.hosts = ['claude'];
  fs.writeFileSync(cfgFile, `${JSON.stringify(c, null, 2)}\n`);
  const alias = await tk(claudeOnly.root, ['init'], { env: claudeOnly.env });
  assert.equal(alias.code, 0, alias.stderr);
  assert.deepEqual(config(claudeOnly.root).hosts, ['claude-code']);
  assert.ok(!listFiles(claudeOnly.root).some((f) => f.startsWith('.codex/')));
});

test('hosts written by hand as a string is read as that host; a hosts value that cannot be read stops init, sync, and config set, and doctor reports it', async () => {
  const { root, env } = await initProject({ hosts: 'claude-code' });
  const cfgFile = path.join(root, '.toolkit.json');
  const noCodex = () => !listFiles(root).some((f) => f.startsWith('.codex/') || f.startsWith('.agents/'));
  const writeHosts = (value) => {
    const c = config(root);
    c.hosts = value;
    fs.writeFileSync(cfgFile, `${JSON.stringify(c, null, 2)}\n`);
  };

  // "hosts": "claude-code" is Claude Code only, not both hosts.
  writeHosts('claude-code');
  const str = await tk(root, ['init'], { env });
  assert.equal(str.code, 0, str.stderr);
  assert.deepEqual(config(root).hosts, ['claude-code'], 'saved as a list');
  assert.match(str.stdout, /hosts: "claude-code" -> \["claude-code"\]/);
  assert.ok(noCodex(), 'no .codex/ or .agents/ files');
  writeHosts('claude-code');
  const syncStr = await tk(root, ['sync'], { env });
  assert.equal(syncStr.code, 0, syncStr.stderr);
  assert.ok(noCodex());

  // Values that cannot be read: each stops init and sync with the reason, and nothing changes.
  for (const [value, reason] of [
    ['claude code', /"claude code" is not a host/],
    [['claude-code', 'cursor'], /"cursor" is not a host/],
    [42, /is 42, which is not a list of hosts/],
    ['', /names no host/],
    [[], /names no host/],
  ]) {
    writeHosts(value);
    const before = read(cfgFile);
    const res = await tk(root, ['init'], { env });
    assert.equal(res.code, 2, `init with hosts ${JSON.stringify(value)}: ${res.stdout}`);
    assert.match(res.stderr, reason);
    assert.match(res.stderr, /Init changed nothing/);
    assert.match(res.stderr, /--hosts claude-code/);
    const sync = await tk(root, ['sync'], { env });
    assert.equal(sync.code, 2, `sync with hosts ${JSON.stringify(value)}`);
    assert.match(sync.stderr, reason);
    assert.equal(read(cfgFile), before, '.toolkit.json is unchanged');
    assert.ok(noCodex(), `no Codex files with hosts ${JSON.stringify(value)}`);
  }

  // doctor names the value and the fix; the scaffold check waits for it.
  writeHosts('claude code');
  const doctor = await tk(root, ['doctor', '--json'], { env });
  const found = doctor.json.findings.find((f) => f.id === 'config-hosts');
  assert.ok(found, JSON.stringify(doctor.json.findings.map((f) => f.id)));
  assert.equal(found.severity, 'problem');
  assert.match(found.message, /"claude code" is not a host/);
  assert.match(found.fix, /toolkit config set hosts claude-code/);
  assert.ok(!doctor.json.findings.some((f) => f.id === 'scaffold-plan'), 'reported once');

  // Another setup key is refused before it is saved; setting hosts fixes it.
  const before = read(cfgFile);
  const owner = await tk(root, ['config', 'set', 'project.owner', 'Dana'], { env });
  assert.equal(owner.code, 2);
  assert.match(owner.stderr, /nothing was saved/);
  assert.equal(read(cfgFile), before);
  const fixed = await tk(root, ['config', 'set', 'hosts', 'claude-code'], { env });
  assert.equal(fixed.code, 0, fixed.stderr);
  assert.deepEqual(config(root).hosts, ['claude-code']);
  assert.ok(noCodex());
});

test('adopting an existing repository keeps its files and merges into .gitignore, settings, and the Codex config', async () => {
  const root = makeRepo();
  const home = makeHome();
  const env = testEnv(home);
  fs.writeFileSync(path.join(root, 'README.md'), '# My app\n');
  fs.writeFileSync(path.join(root, 'AGENTS.md'), '# My own agent notes\n\nUse pnpm.\n');
  fs.writeFileSync(path.join(root, '.gitignore'), 'node_modules/\n/.memory/\n');
  fs.mkdirSync(path.join(root, '.claude'));
  fs.writeFileSync(path.join(root, '.claude', 'settings.json'), '{"model":"opus","permissions":{"allow":["Bash(pnpm *)"]},"enabledPlugins":{"work@toolkit-v2":false}}\n');
  fs.mkdirSync(path.join(root, '.codex'));
  fs.writeFileSync(path.join(root, '.codex', 'config.toml'), 'model = "gpt-5"\n\n[plugins."toolkit@toolkit-v2"]\nenabled = false\n');
  const res = await tk(root, ['init', '--name', 'My App', '--tracker', 'local', '--memory', 'builtin'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.equal(read(path.join(root, 'README.md')), '# My app\n');
  assert.equal(read(path.join(root, 'AGENTS.md')), '# My own agent notes\n\nUse pnpm.\n');
  const proposal = read(path.join(root, '.toolkit-cache', 'AGENTS.proposed.md'));
  assert.match(proposal, /^# My App$/m);
  assert.match(proposal, /Always on\. Claude Code loads these/);
  assert.match(res.stdout, /AGENTS\.proposed\.md/);
  const gi = read(path.join(root, '.gitignore'));
  assert.ok(gi.startsWith('node_modules/\n/.memory/\n\n'));
  assert.match(gi, /\/\.work-items\//);
  assert.equal(gi.match(/^\/\.memory\/$/gm).length, 1, 'a line already there is not added again');
  const settings = JSON.parse(read(path.join(root, '.claude', 'settings.json')));
  assert.equal(settings.model, 'opus');
  assert.deepEqual(settings.permissions.allow, ['Bash(pnpm *)', 'Bash(toolkit *)']);
  assert.equal(settings.enabledPlugins['work@toolkit-v2'], true, 'the toolkit value wins for its own keys');
  const toml = read(path.join(root, '.codex', 'config.toml'));
  assert.match(toml, /^model = "gpt-5"$/m);
  assert.equal(tomlGet(toml, ['plugins', 'toolkit@toolkit-v2', 'enabled']), true);
  const cfg = config(root);
  assert.equal(cfg.installed['README.md'], undefined, 'a kept project file gets no installed hash');
  assert.equal(cfg.installed['AGENTS.md'], undefined);
  assert.ok(cfg.installed['.gitignore'] && cfg.installed['.claude/settings.json'] && cfg.installed['.codex/config.toml']);
});

test('a Codex config that sets a plugin switch another way is left alone and reported', async () => {
  const root = makeRepo();
  const env = testEnv(makeHome());
  fs.mkdirSync(path.join(root, '.codex'));
  const original = 'plugins."toolkit@toolkit-v2".enabled = false\n';
  fs.writeFileSync(path.join(root, '.codex', 'config.toml'), original);
  const res = await tk(root, ['init', '--name', 'X', '--tracker', 'local', '--memory', 'builtin'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /Could not merge/);
  assert.equal(read(path.join(root, '.codex', 'config.toml')), original);
  assert.equal(config(root).installed['.codex/config.toml'], undefined);
  const doctor = await tk(root, ['doctor', '--json'], { env });
  assert.ok(doctor.json.findings.some((f) => f.id === 'scaffold-conflict' && f.severity === 'problem'));
});

test('init refuses: no Git repository, a foreign .toolkit.json, missing or wrong flags', async () => {
  const env = testEnv(makeHome());
  const plain = tempDir();
  let res = await tk(plain, ['init', '--name', 'X', '--tracker', 'local', '--memory', 'builtin'], { env });
  assert.equal(res.code, 2);
  assert.match(res.stderr, /not in a Git repository/);
  assert.deepEqual(fs.readdirSync(plain), []);

  const root = makeRepo();
  fs.writeFileSync(path.join(root, '.toolkit.json'), '{"something":"else"}\n');
  res = await tk(root, ['init', '--name', 'X', '--tracker', 'local', '--memory', 'builtin'], { env });
  assert.equal(res.code, 2);
  assert.match(res.stderr, /not a Toolkit V2 settings file/);
  assert.deepEqual(listFiles(root), ['.toolkit.json']);

  const empty = makeRepo();
  for (const args of [
    ['init', '--tracker', 'local', '--memory', 'builtin'],
    ['init', '--name', 'X', '--memory', 'builtin'],
    ['init', '--name', 'X', '--tracker', 'trello', '--memory', 'builtin'],
    ['init', '--name', 'X', '--tracker', 'local', '--memory', 'cloud'],
    ['init', '--name', 'X', '--tracker', 'local', '--memory', 'builtin', '--hosts', 'cursor'],
    ['init', '--name', 'X', '--key', 'Bad Key', '--tracker', 'local', '--memory', 'builtin'],
  ]) {
    res = await tk(empty, args, { env });
    assert.equal(res.code, 2, args.join(' '));
  }
  assert.deepEqual(listFiles(empty), [], 'nothing was written');
});

test('a template error stops init before anything is written', async () => {
  const fakeRoot = tempDir('tk-plugin-');
  for (const d of ['scaffold', 'templates', 'bin']) fs.cpSync(path.join(PLUGIN_ROOT, d), path.join(fakeRoot, d), { recursive: true });
  const agents = path.join(fakeRoot, 'templates', 'AGENTS.md.tmpl');
  fs.writeFileSync(agents, `${read(agents)}\n{{project.nickname}}\n`);
  const root = makeRepo();
  const env = testEnv(makeHome());
  await assert.rejects(
    initDirect({ name: 'X', tracker: 'local', memory: 'builtin' }, { cwd: root, env, pluginRoot: fakeRoot }),
    (e) => e.code === 2 && /AGENTS\.md\.tmpl, line \d+ has an unknown token \{\{project\.nickname\}\}/.test(e.message),
  );
  assert.deepEqual(listFiles(root), []);
});

test('Hindsight memory with the server down: init stops and writes nothing', async () => {
  const root = makeRepo();
  const env = testEnv(makeHome());
  const down = async () => { throw new TypeError('fetch failed: connect ECONNREFUSED 127.0.0.1:8888'); };
  await assert.rejects(
    initDirect({ name: 'X', tracker: 'local', memory: 'hindsight' }, { cwd: root, env, fetch: down }),
    (e) => e.code === 1 && /does not answer/.test(e.message) && /toolkit hindsight service status/.test(e.details.fix),
  );
  assert.deepEqual(listFiles(root), []);
});

test('Notion tracker + Hindsight memory with the server down: the Hindsight check runs before Notion is touched', async () => {
  const root = makeRepo();
  const home = makeHome();
  const log = path.join(tempDir(), 'ntn-calls.log');
  const ntn = path.join(tempDir(), 'ntn');
  fs.writeFileSync(ntn, `#!/bin/sh\necho "$@" >> '${log}'\nexit 1\n`, { mode: 0o755 });
  const env = testEnv(home, { TOOLKIT_NTN_BIN: ntn });
  fs.mkdirSync(env.TOOLKIT_V2_CONFIG_DIR, { recursive: true });
  fs.writeFileSync(path.join(env.TOOLKIT_V2_CONFIG_DIR, 'notion.json'), JSON.stringify({ rootPageId: '11111111111111111111111111111111' }));
  const down = async () => { throw new TypeError('fetch failed: connect ECONNREFUSED 127.0.0.1:8888'); };
  await assert.rejects(
    initDirect({ name: 'X', tracker: 'notion', memory: 'hindsight' }, { cwd: root, env, fetch: down }),
    (e) => e.code === 1 && /does not answer/.test(e.message) && /Nothing was written/.test(e.message),
  );
  assert.ok(!fs.existsSync(log), 'ntn was never called');
  assert.deepEqual(listFiles(root), []);
});

test('Notion tracker + Notion memory (fake ntn): databases are set up, ids saved, no local tracker or memory folders; a second run adds no second project row', async () => {
  const { FakeNotion, seedProjects } = await import('../notion/fake-notion.mjs');
  const { PROJECTS_BASE_PROPERTIES } = await import('../../lib/notion/schema.mjs');
  const dir = tempDir('tk-notion-');
  const fake = new FakeNotion();
  const projects = seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const state = path.join(dir, 'fake-notion.json');
  fs.writeFileSync(state, JSON.stringify(fake.toJSON()));
  const home = makeHome();
  const env = testEnv(home, {
    TOOLKIT_NTN_BIN: path.join(HERE, '..', 'notion', 'fake-ntn.mjs'),
    FAKE_NOTION_STATE: state,
    TOOLKIT_NOTION_MIN_INTERVAL_MS: '0',
  });
  fs.mkdirSync(env.TOOLKIT_V2_CONFIG_DIR, { recursive: true });
  fs.writeFileSync(path.join(env.TOOLKIT_V2_CONFIG_DIR, 'notion.json'), JSON.stringify({ rootPageId: fake.rootPageId }));
  const root = makeRepo();
  const res = await tk(root, ['init', '--name', 'Sample App', '--tracker', 'notion', '--memory', 'notion', '--owner', 'Mike'], { env });
  assert.equal(res.code, 0, res.stderr || res.stdout);
  const cfg = config(root);
  assert.equal(cfg.tracker.type, 'notion');
  assert.ok(cfg.notion.workItems && cfg.notion.workItems.dataSourceId, 'Work Items ids saved');
  assert.ok(cfg.notion.memory && cfg.notion.memory.dataSourceId, 'Memory ids saved');
  assert.equal(cfg.notion.projects.dataSourceId, projects.dataSourceId);
  assert.ok(!fs.existsSync(path.join(root, '.work-items')));
  assert.ok(!fs.existsSync(path.join(root, '.memory')));
  assert.ok(!listFiles(root).includes('.claude/rules/work-item-folders.md'));
  const agents = read(path.join(root, 'AGENTS.md'));
  assert.match(agents, /Work Items database on this project's page in Notion/);
  assert.match(agents, /Memory database on this project's page in Notion/);
  const rows = () => {
    const now = FakeNotion.fromJSON(JSON.parse(read(state)));
    return Object.values(now.pages).filter((p) => p.parent && (p.parent.data_source_id === projects.dataSourceId)).length;
  };
  const before = rows();
  assert.equal(before, 1);
  const again = await tk(root, ['init'], { env });
  assert.equal(again.code, 0, again.stderr);
  assert.equal(rows(), before, 'no second project row');
  const pending = path.join(root, '.git', 'toolkit-v2', 'init-pending.json');
  assert.ok(!fs.existsSync(pending), 'the pending file is removed after a successful init');
});

test('Notion without a known root page: init says how to set it and writes nothing', async () => {
  const root = makeRepo();
  const env = testEnv(makeHome());
  const res = await tk(root, ['init', '--name', 'X', '--tracker', 'notion', '--memory', 'builtin'], { env });
  assert.equal(res.code, 2);
  assert.match(res.stderr, /toolkit notion ensure-root --root-page/);
  assert.deepEqual(listFiles(root), []);
});

async function hindsightUp() {
  try {
    const res = await fetch('http://127.0.0.1:8888/health', { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

test('local tracker + Hindsight memory against the local server: one bank for the project, reused on a second run', async (t) => {
  if (!(await hindsightUp())) {
    t.skip('Hindsight is not running at 127.0.0.1:8888');
    return;
  }
  const { HindsightClient } = await import('../../lib/hindsight/client.mjs');
  const client = new HindsightClient({});
  const key = `tkv2-test-init-${crypto.randomBytes(3).toString('hex')}`;
  const made = [key, `${key}-2`];
  try {
    const { root, env, res } = await initProject({ memory: 'hindsight', key, name: 'Init test' });
    assert.equal(res.code, 0, res.stderr || res.stdout);
    const cfg = config(root);
    assert.equal(cfg.hindsight.bank, key);
    assert.equal(cfg.hindsight.url, 'http://127.0.0.1:8888');
    assert.ok(await client.bankExists(key));
    assert.ok(!fs.existsSync(path.join(root, '.memory')));
    assert.match(read(path.join(root, 'AGENTS.md')), new RegExp(`memory bank \`${key}\``));
    const again = await tk(root, ['init'], { env });
    assert.equal(again.code, 0, again.stderr);
    assert.equal(config(root).hindsight.bank, key, 'the same bank on the second run');
    assert.equal(await client.bankExists(`${key}-2`), false, 'no second bank');
    const doctor = await tk(root, ['doctor', '--json'], { env });
    assert.ok(!doctor.json.findings.some((f) => f.area === 'memory' && f.severity !== 'note'), JSON.stringify(doctor.json.findings.filter((f) => f.area === 'memory')));
  } finally {
    for (const b of made) {
      try {
        await client.deleteBank(b);
      } catch {
        // Not there.
      }
    }
  }
});

test('Notion tracker + Notion memory live in the Toolkit V2 Notion test area (TOOLKIT_NOTION_LIVE=1)', { timeout: 600000 }, async (t) => {
  if (process.env.TOOLKIT_NOTION_LIVE !== '1') {
    t.skip('Set TOOLKIT_NOTION_LIVE=1 to run against the Notion test area.');
    return;
  }
  const area = JSON.parse(read(path.join(REPO, 'dev', 'test-runs', 'notion-test-area.json')));
  const env = testEnv(makeHome(), { HOME: process.env.HOME });
  env.TOOLKIT_V2_CONFIG_DIR = path.join(tempDir(), 'machine');
  fs.mkdirSync(env.TOOLKIT_V2_CONFIG_DIR, { recursive: true });
  fs.writeFileSync(path.join(env.TOOLKIT_V2_CONFIG_DIR, 'notion.json'), JSON.stringify({ rootPageId: area.pageId, projects: { databaseId: area.projectsDatabaseId, dataSourceId: area.projectsDataSourceId } }));
  const root = makeRepo();
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const res = await tk(root, ['init', '--name', `Init live ${stamp}`, '--key', `init-live-${stamp}`, '--tracker', 'notion', '--memory', 'notion', '--owner', 'Mike'], { env });
  assert.equal(res.code, 0, res.stderr || res.stdout);
  const cfg = config(root);
  assert.ok(cfg.notion.workItems.dataSourceId && cfg.notion.memory.dataSourceId);
  assert.notEqual(cfg.tracker.idPrefix, '', 'a prefix is recorded');
  const again = await tk(root, ['init'], { env });
  assert.equal(again.code, 0, again.stderr);
  assert.equal(config(root).notion.project.pageId, cfg.notion.project.pageId, 'the same project row');
  const work = await tk(root, ['work', 'new', '--title', 'Live init check', '--json'], { env });
  assert.equal(work.code, 0, work.stderr || work.stdout);
});

test('--dir sets up another repository; a folder inside a repository is refused', async () => {
  const root = makeRepo();
  const env = testEnv(makeHome());
  const elsewhere = tempDir();
  const res = await tk(elsewhere, ['init', '--dir', root, '--name', 'Far Away', '--tracker', 'local', '--memory', 'builtin'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.ok(fs.existsSync(path.join(root, '.toolkit.json')));
  assert.deepEqual(fs.readdirSync(elsewhere), []);
  fs.mkdirSync(path.join(root, 'sub'));
  const sub = await tk(elsewhere, ['init', '--dir', path.join(root, 'sub'), '--name', 'X', '--tracker', 'local', '--memory', 'builtin'], { env });
  assert.equal(sub.code, 2);
  assert.match(sub.stderr, /not at its top/);
});

test('init in a linked worktree puts .work-items/ and .memory/ in the main checkout', async () => {
  const main = makeRepo();
  fs.writeFileSync(path.join(main, 'README.md'), '# App\n');
  git(main, ['add', 'README.md']);
  git(main, ['commit', '-q', '-m', 'first']);
  const wt = path.join(path.dirname(main), 'wt-setup');
  git(main, ['worktree', 'add', '-q', wt, '-b', 'setup']);
  const env = testEnv(makeHome());
  const res = await tk(wt, ['init', '--name', 'App', '--tracker', 'local', '--memory', 'builtin'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.ok(fs.existsSync(path.join(main, '.work-items', 'work-item-template', 'WORK-ITEM.md')));
  assert.ok(fs.existsSync(path.join(main, '.memory', 'MEMORY.md')));
  assert.ok(!fs.existsSync(path.join(wt, '.work-items')));
  assert.ok(!fs.existsSync(path.join(wt, '.memory')));
  assert.ok(fs.existsSync(path.join(wt, '.toolkit.json')));
  assert.ok(fs.existsSync(path.join(wt, 'AGENTS.md')));
  const item = await tk(wt, ['work', 'new', '--title', 'From the worktree'], { env });
  assert.equal(item.code, 0, item.stderr);
  assert.ok(fs.readdirSync(path.join(main, '.work-items')).some((n) => n.startsWith('WI-001')));
});

test('a project key made from a name keeps letters such as ø and ß as plain letters', async () => {
  const { keyFromName } = await import('../../lib/project/setup.mjs');
  assert.equal(keyFromName('Ünïcode Prøject!!'), 'unicode-project');
  assert.equal(keyFromName('Æble Straße'), 'aeble-strasse');
  assert.equal(keyFromName('Acme CRM'), 'acme-crm');
});

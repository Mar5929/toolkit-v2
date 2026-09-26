// toolkit doctor on a healthy project and on a broken one: every problem the
// build plan names is found, and each finding carries a fix.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, makeHome, read, testEnv, tk, git } from './helpers.mjs';
import { checkBackup } from '../../lib/project/checks.mjs';

after(cleanup);

/** A home that trusts the project in Codex, trusts the toolkit hooks, and has the wrapper and pointer. */
async function healthyHome(root) {
  const home = makeHome({ trust: [root], hookTrust: ['toolkit@toolkit-v2:hooks/codex-hooks.json:session_start:0:0'] });
  const env = testEnv(home, { PATH: `${path.join(home, '.local', 'bin')}${path.delimiter}${process.env.PATH}` });
  const res = await tk(root, ['machine-setup', '--offline'], { env });
  assert.equal(res.code, 0, res.stdout + res.stderr);
  return env;
}

test('a fresh project on a set-up computer is clean', async () => {
  const { root } = await initProject();
  const env = await healthyHome(root);
  const res = await tk(root, ['doctor'], { env });
  assert.equal(res.code, 0, res.stdout);
  assert.match(res.stdout, /Result: clean\. No problems and no warnings\./);
  assert.match(res.stdout, /Notes \(1\):\n- The AGENTS\.md Commands table has no verified run or test commands yet/);
});

test('a fresh project on a computer that is not set up: Codex trust, hook trust, pointer, and wrapper are warnings with fixes', async () => {
  const { root, env } = await initProject();
  const res = await tk(root, ['doctor', '--json'], { env });
  assert.equal(res.code, 1);
  const ids = res.json.findings.filter((f) => f.severity === 'warning').map((f) => f.id).sort();
  assert.deepEqual(ids, ['codex-hook-trust', 'codex-trust', 'plugin-pointer', 'wrapper-missing']);
  for (const f of res.json.findings) if (f.severity !== 'note') assert.ok(f.fix, `${f.id} has a fix`);
});

test('a broken project: every problem is found and named with its fix', async () => {
  const { root } = await initProject({ salesforce: true });
  const env = await healthyHome(root);
  // A CLAUDE.md in the project folder and one inside requirements/.
  fs.writeFileSync(path.join(root, 'CLAUDE.md'), '@AGENTS.md\n');
  fs.writeFileSync(path.join(root, 'requirements', 'CLAUDE.md'), '# old\n');
  // Settings that stop AGENTS.md loading, and a V2 plugin switched off.
  const settingsFile = path.join(root, '.claude', 'settings.json');
  const settings = JSON.parse(read(settingsFile));
  settings.disableAllHooks = true;
  settings.enabledPlugins['memory@toolkit-v2'] = false;
  fs.writeFileSync(settingsFile, `${JSON.stringify(settings, null, 2)}\n`);
  // AGENTS.md: a leftover token and the rules list out of date (a rule removed).
  const agentsFile = path.join(root, 'AGENTS.md');
  fs.writeFileSync(agentsFile, read(agentsFile).replace('## Commands', '## Commands\n\nOwner: {{project.owner}}'));
  fs.rmSync(path.join(root, '.claude', 'rules', 'offer-context-handoff.md'));
  // The two Salesforce skill copies differ.
  fs.appendFileSync(path.join(root, '.agents', 'skills', 'sf-deploy-check', 'SKILL.md'), '\nExtra step.\n');
  // A broken work item record.
  const newItem = await tk(root, ['work', 'new', '--title', 'Login page', '--type', 'build', '--json'], { env });
  assert.equal(newItem.code, 0, newItem.stderr || newItem.stdout);
  const recordPath = (await tk(root, ['work', 'show', 'WI-001', '--path'], { env })).stdout.trim();
  fs.writeFileSync(recordPath, read(recordPath).replace(/^title: .*$/m, 'title: [draft] login'));
  // The Codex plugin switches wrong.
  const toml = path.join(root, '.codex', 'config.toml');
  fs.writeFileSync(toml, read(toml).replace('[plugins."work@toolkit-v2"]\nenabled = true', '[plugins."work@toolkit-v2"]\nenabled = false'));

  const res = await tk(root, ['doctor', '--json'], { env: { ...env, DISABLE_TELEMETRY: '1' } });
  assert.equal(res.code, 1);
  const byId = new Map();
  for (const f of res.json.findings) byId.set(f.id, f);
  for (const id of ['claude-md-on-path', 'claude-md-inside', 'disable-all-hooks', 'agents-md-env', 'agents-md-tokens', 'agents-md-span', 'claude-plugins',
    'codex-plugins', 'scaffold-missing', 'sf-skill-copies', 'sf-orgs', 'tracker-invalid']) {
    assert.ok(byId.has(id), `doctor finds ${id}: ${JSON.stringify(res.json.findings.map((f) => f.id))}`);
    assert.ok(byId.get(id).fix, `${id} has a fix`);
  }
  assert.match(byId.get('claude-md-on-path').message, /stops Claude Code from reading AGENTS\.md/);
  assert.match(byId.get('claude-plugins').message, /memory@toolkit-v2 should be true/);
  assert.match(byId.get('codex-plugins').message, /work@toolkit-v2 should be true/);
  assert.match(byId.get('tracker-invalid').message, /WI-001/);
  const text = await tk(root, ['doctor'], { env });
  assert.match(text.stdout, /Problems \(\d+\):\n1\. /);
  assert.match(text.stdout, /\n {3}Fix: /);
});

test('AGENTS.md without Toolkit V2 sections is reported with the proposal', async () => {
  const { root, env } = await initProject();
  fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Mine\n');
  await tk(root, ['sync', '--dry-run'], { env });
  const res = await tk(root, ['doctor', '--json'], { env });
  const f = res.json.findings.find((x) => x.id === 'agents-md-no-v2');
  assert.ok(f, JSON.stringify(res.json.findings));
  assert.match(f.fix, /project-setup skill/);
});

test('the backup warning: never exported and older than 7 days, or the last export older than 7 days', async () => {
  const { root, env } = await initProject();
  const project = { root, mainRoot: root, config: JSON.parse(read(path.join(root, '.toolkit.json'))) };
  const now = Date.now();
  let findings = [];
  checkBackup(project, findings, { now });
  assert.deepEqual(findings, [], 'a new project needs no backup yet');
  checkBackup(project, findings, { now: now + 8 * 24 * 3600 * 1000 });
  assert.equal(findings[0].id, 'backup-never');
  const out = path.join(path.dirname(root), 'backup');
  const exp = await tk(root, ['export', '--to', out], { env });
  assert.equal(exp.code, 0, exp.stderr);
  findings = [];
  checkBackup(project, findings, { now: now + 2 * 24 * 3600 * 1000 });
  assert.deepEqual(findings, []);
  checkBackup(project, findings, { now: now + 9 * 24 * 3600 * 1000 });
  assert.equal(findings[0].id, 'backup-old');
  assert.match(findings[0].fix, /toolkit export --to/);
});

test('a worktree Git can no longer find is reported', async () => {
  const { root, env } = await initProject();
  git(root, ['add', '.gitignore']);
  git(root, ['commit', '-q', '-m', 'first']);
  const wt = path.join(path.dirname(root), 'wt-gone');
  git(root, ['worktree', 'add', '-q', wt, '-b', 'wi-001-gone']);
  fs.rmSync(wt, { recursive: true, force: true });
  const res = await tk(root, ['doctor', '--json'], { env });
  assert.ok(res.json.findings.some((f) => f.id === 'worktree-prunable'), JSON.stringify(res.json.findings.map((f) => f.id)));
});

test('outside a project, doctor checks this computer only and exits 4', async () => {
  const env = testEnv(makeHome());
  const res = await tk(path.dirname(env.HOME), ['doctor'], { env });
  assert.equal(res.code, 4);
  assert.match(res.stdout, /is not a Toolkit V2 project/);
  assert.match(res.stdout, /This computer:\n- ~\/\.config\/toolkit-v2\/plugin-root is missing/);
  const json = await tk(path.dirname(env.HOME), ['doctor', '--json'], { env });
  assert.equal(json.code, 4);
  assert.ok(json.json.findings.some((f) => f.id === 'wrapper-missing'));
});

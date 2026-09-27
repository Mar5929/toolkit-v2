// Setup that stops part way and is run again, config set when its sync fails,
// and optional files the owner declined. Sample runs a, c, and d (round 1)
// found that a retried init treated the toolkit's own files as the project's,
// that config set saved a value although its sync failed, and that a declined
// SOUL.md came back on every sync and stayed a doctor problem.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, makeHome, makeRepo, read, testEnv, tk } from './helpers.mjs';

after(cleanup);

function config(root) {
  return JSON.parse(read(path.join(root, '.toolkit.json')));
}

const INIT = ['init', '--name', 'Acme CRM', '--tracker', 'local', '--memory', 'builtin', '--owner', 'Mike'];

test('a write refused in .codex/ stops init before any other file is written, and names the exact command to run in a terminal', async () => {
  const root = makeRepo();
  const env = testEnv(makeHome());
  fs.writeFileSync(path.join(root, '.codex'), 'a file where the folder should be\n');
  const res = await tk(root, INIT, { env });
  assert.notEqual(res.code, 0);
  const written = fs.readdirSync(root).filter((n) => n !== '.git' && n !== '.codex');
  assert.deepEqual(written, [], `nothing else is written: ${written.join(', ')}`);
  assert.ok(!fs.existsSync(path.join(root, '.toolkit.json')));
});

test('a refused write names the same answers in a terminal command (EPERM)', async () => {
  const root = makeRepo();
  const env = testEnv(makeHome());
  fs.mkdirSync(path.join(root, '.codex'));
  fs.chmodSync(path.join(root, '.codex'), 0o555);
  try {
    const res = await tk(root, [...INIT, '--hosts', 'claude-code,codex', '--json'], { env });
    assert.equal(res.code, 1, res.stdout + res.stderr);
    const err = JSON.parse(res.stdout || res.stderr);
    const command = err.error ? err.error.details.command : err.details.command;
    assert.match(command, /^toolkit init --dir .+ --name "Acme CRM" --key acme-crm --tracker local --memory builtin --owner Mike --hosts claude-code,codex$/);
    const written = fs.readdirSync(root).filter((n) => n !== '.git' && n !== '.codex');
    assert.deepEqual(written, [], 'no other file was written');
  } finally {
    fs.chmodSync(path.join(root, '.codex'), 0o755);
  }
});

test('init run again after it stopped part way records the files the first run wrote, so doctor and sync treat them as the toolkit\'s', async () => {
  const root = makeRepo();
  const env = testEnv(makeHome());
  // tests/ is read-only: the first run writes the files before it, then stops.
  fs.mkdirSync(path.join(root, 'tests'));
  fs.chmodSync(path.join(root, 'tests'), 0o555);
  let first;
  try {
    first = await tk(root, INIT, { env });
  } finally {
    fs.chmodSync(path.join(root, 'tests'), 0o755);
  }
  assert.notEqual(first.code, 0, 'the first run stops');
  assert.ok(fs.existsSync(path.join(root, '.codex', 'config.toml')), 'the first run wrote some files');
  assert.ok(fs.existsSync(path.join(root, '.claude', 'rules', 'humanize-outbound-text.md')));
  assert.ok(!fs.existsSync(path.join(root, '.toolkit.json')));

  const second = await tk(root, INIT, { env });
  assert.equal(second.code, 0, second.stderr);
  assert.doesNotMatch(second.stdout, /Kept the project's own file/);
  assert.match(second.stdout, /Recorded \d+ files that already match the toolkit's version/);
  const cfg = config(root);
  for (const target of ['.codex/config.toml', '.claude/rules/humanize-outbound-text.md', 'SOUL.md', 'tests/TEST-PLAN-TEMPLATE.md']) {
    assert.ok(cfg.installed[target], `${target} is recorded as installed`);
  }

  const doctor = await tk(root, ['doctor', '--json'], { env });
  const ids = doctor.json.findings.map((f) => f.id);
  assert.ok(!ids.includes('scaffold-changed'), `no "changed by the project" notes: ${JSON.stringify(doctor.json.findings.filter((f) => f.id === 'scaffold-changed').map((f) => f.message))}`);
  assert.ok(!ids.includes('scaffold-unrecorded'));
  const dry = await tk(root, ['sync', '--dry-run'], { env });
  assert.doesNotMatch(dry.stdout, /Changed by the project/);
});

test('sync records a file that matches the toolkit\'s version but was never recorded, and doctor warns until it does', async () => {
  const { root, env } = await initProject();
  const cfg = config(root);
  delete cfg.installed['.claude/rules/humanize-outbound-text.md'];
  fs.writeFileSync(path.join(root, '.toolkit.json'), `${JSON.stringify(cfg, null, 2)}\n`);
  const doctor = await tk(root, ['doctor', '--json'], { env });
  const f = doctor.json.findings.find((x) => x.id === 'scaffold-unrecorded');
  assert.ok(f, 'doctor warns');
  assert.match(f.message, /humanize-outbound-text\.md/);
  const sync = await tk(root, ['sync'], { env });
  assert.equal(sync.code, 0, sync.stderr);
  assert.ok(config(root).installed['.claude/rules/humanize-outbound-text.md']);
  const again = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!again.json.findings.some((x) => x.id === 'scaffold-unrecorded'));
});

test('config set saves a setup value only when its sync worked', async () => {
  const { root, env } = await initProject({ hosts: 'claude-code' });
  assert.deepEqual(config(root).hosts, ['claude-code']);
  fs.writeFileSync(path.join(root, '.codex'), 'a file where the folder should be\n');
  const res = await tk(root, ['config', 'set', 'hosts', 'claude-code,codex'], { env });
  assert.notEqual(res.code, 0);
  assert.match(res.stderr, /Nothing was saved: hosts is still/);
  assert.deepEqual(config(root).hosts, ['claude-code'], 'the old value stays');
  fs.unlinkSync(path.join(root, '.codex'));
  const ok = await tk(root, ['config', 'set', 'hosts', 'claude-code,codex'], { env });
  assert.equal(ok.code, 0, ok.stderr);
  assert.deepEqual(config(root).hosts, ['claude-code', 'codex']);
  assert.ok(fs.existsSync(path.join(root, '.codex', 'config.toml')));
});

test('a declined SOUL.md is not installed, sync never adds it back, and doctor does not report it', async () => {
  const { root, env, res } = await initProject({ extraArgs: ['--decline', 'SOUL.md'] });
  assert.equal(res.code, 0, res.stderr);
  assert.ok(!fs.existsSync(path.join(root, 'SOUL.md')));
  assert.deepEqual(config(root).declined, ['SOUL.md']);
  assert.ok(!config(root).installed['SOUL.md']);
  const sync = await tk(root, ['sync'], { env });
  assert.equal(sync.code, 0, sync.stderr);
  assert.ok(!fs.existsSync(path.join(root, 'SOUL.md')), 'sync does not add it back');
  const doctor = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!doctor.json.findings.some((f) => f.id === 'scaffold-missing'), JSON.stringify(doctor.json.findings));
  // A setup change runs sync; the declined file still stays out.
  const hosts = await tk(root, ['config', 'set', 'hosts', 'claude-code'], { env });
  assert.equal(hosts.code, 0, hosts.stderr);
  assert.ok(!fs.existsSync(path.join(root, 'SOUL.md')));
  // The owner changes his mind: clearing the list installs it again.
  const back = await tk(root, ['config', 'set', 'declined', 'none'], { env });
  assert.equal(back.code, 0, back.stderr);
  assert.ok(fs.existsSync(path.join(root, 'SOUL.md')));
  assert.deepEqual(config(root).declined, []);
});

test('declining SOUL.md after setup: config set declined records it, and the removed file is no longer a problem', async () => {
  const { root, env } = await initProject();
  assert.ok(config(root).installed['SOUL.md']);
  fs.unlinkSync(path.join(root, 'SOUL.md'));
  const before = await tk(root, ['doctor', '--json'], { env });
  assert.ok(before.json.findings.some((f) => f.id === 'scaffold-missing'));
  const set = await tk(root, ['config', 'set', 'declined', 'SOUL.md'], { env });
  assert.equal(set.code, 0, set.stderr);
  assert.deepEqual(config(root).declined, ['SOUL.md']);
  assert.ok(!config(root).installed['SOUL.md'], 'its installed record is dropped');
  const after = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!after.json.findings.some((f) => f.id === 'scaffold-missing'), JSON.stringify(after.json.findings));
  const bad = await tk(root, ['config', 'set', 'declined', 'AGENTS.md'], { env });
  assert.equal(bad.code, 2, 'only optional files can be declined');
});

test('the Codex rules file lets toolkit run outside the sandbox and asks the owner before each Git write (codex execpolicy, when Codex is installed)', async (t) => {
  const { spawnSync } = await import('node:child_process');
  const { PLUGIN_ROOT } = await import('./helpers.mjs');
  const rules = path.join(PLUGIN_ROOT, 'templates', 'codex', 'toolkit.rules');
  const probe = spawnSync('codex', ['--version'], { encoding: 'utf8' });
  if (probe.error || probe.status !== 0) {
    t.skip('codex is not installed');
    return;
  }
  const decision = (words) => {
    const res = spawnSync('codex', ['execpolicy', 'check', '--rules', rules, '--', ...words], { encoding: 'utf8' });
    assert.equal(res.status, 0, res.stderr);
    return JSON.parse(res.stdout).decision || 'none';
  };
  assert.equal(decision(['toolkit', 'work', 'sync']), 'allow');
  for (const cmd of [['git', 'add', 'src/a.js'], ['git', 'commit', '-m', 'x'], ['git', 'merge', '--ff-only', 'claude/wi-001-x'], ['git', 'worktree', 'add', '.claude/worktrees/wi-001-x', '-b', 'claude/wi-001-x'], ['git', 'worktree', 'remove', 'x'], ['git', 'branch', '-d', 'x'], ['git', 'push', 'origin', 'x'], ['git', 'fetch', 'origin']]) {
    assert.equal(decision(cmd), 'prompt', cmd.join(' '));
  }
  for (const cmd of [['git', 'status'], ['git', 'log', '--oneline'], ['git', 'worktree', 'list'], ['git', 'branch', '--show-current'], ['git', 'diff']]) {
    assert.equal(decision(cmd), 'none', `${cmd.join(' ')} is a read and is not asked about`);
  }
});

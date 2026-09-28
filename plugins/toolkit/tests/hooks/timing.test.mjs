// Hook timing (skill-references audit, 2026-09-28). Every hook runs on each
// session start, prompt, tool call, or stop, and a host stops a hook that
// passes its timeout (hooks/hooks.json, hooks/codex-hooks.json); the hook's
// work is then lost, and nothing is written to hook-errors.log. This test runs
// each event the way the hosts do (a new node process with the command from
// the hook file) and checks that it finishes well inside its timeout:
//   - in a Toolkit V2 project with work items, sub-items, memory records, and
//     a current focus: at most half of the timeout;
//   - in a Git folder that is not a Toolkit V2 project, where the toolkit
//     plugin runs too (decision 10: on in every folder): it prints nothing
//     and takes at most OUTSIDE_MAX_MS.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PLUGIN_ROOT, cleanup, initProject, makeRepo, tk } from '../project/helpers.mjs';
import { fixture, updatePatch } from './fixtures.mjs';

after(cleanup);

const OUTSIDE_MAX_MS = 2500;
const SHARE_OF_TIMEOUT = 0.5;

const claudeHooks = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, 'hooks', 'hooks.json'), 'utf8'));
const codexHooks = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, 'hooks', 'codex-hooks.json'), 'utf8'));

function runTimed(host, event, input, { cwd, env }) {
  const h = (host === 'claude' ? claudeHooks : codexHooks).hooks[event][0].hooks[0];
  const started = process.hrtime.bigint();
  const res = host === 'claude'
    ? spawnSync(h.command, h.args.map((a) => a.replace('${CLAUDE_PLUGIN_ROOT}', PLUGIN_ROOT)), { cwd, env: { ...env, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT, CLAUDE_PROJECT_DIR: cwd }, input: JSON.stringify(input), encoding: 'utf8', timeout: h.timeout * 1000 })
    : spawnSync('/bin/sh', ['-c', h.command], { cwd, env: { ...env, PLUGIN_ROOT, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT }, input: JSON.stringify(input), encoding: 'utf8', timeout: h.timeout * 1000 });
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  return { ms, timeoutMs: h.timeout * 1000, status: res.status, signal: res.signal, stdout: res.stdout, stderr: res.stderr };
}

/** The events of one host, in the order a session sends them. */
function steps(host, root, session) {
  const v = { CWD: root, SESSION: session, TURN: `${session}-t1`, PROMPT: 'Where are we?', COMMAND: 'toolkit work list', MESSAGE: 'WI-001 is at stage 06. Next I plan the build.', FILE: path.join(root, 'README.md'), PATCH: updatePatch('README.md', 'a', 'b'), REL: 'README.md', STDOUT: '' };
  return host === 'claude'
    ? [['SessionStart', fixture('claude', 'session-start.startup', v)], ['UserPromptSubmit', fixture('claude', 'user-prompt', v)], ['PreToolUse', fixture('claude', 'pre-tool.bash', v)], ['PostToolUse', fixture('claude', 'post-tool.bash', v)], ['Stop', fixture('claude', 'stop', v)]]
    : [['SessionStart', fixture('codex', 'session-start.startup', v)], ['UserPromptSubmit', fixture('codex', 'user-prompt', v)], ['PreToolUse', fixture('codex', 'pre-tool.bash', v)], ['PostToolUse', fixture('codex', 'post-tool.bash', v)], ['Stop', fixture('codex', 'stop', v)]];
}

async function busyProject() {
  const { root, env } = await initProject({ extraArgs: ['--backup-dir', 'none'] });
  for (let i = 1; i <= 12; i++) {
    const args = ['work', 'new', '--title', `Item number ${i}`, '--type', 'task'];
    if (i > 8) args.push('--parent', 'WI-001');
    assert.equal((await tk(root, args, { env })).code, 0);
  }
  for (let i = 1; i <= 10; i++) {
    const saved = await tk(root, ['memory', 'save', '--type', 'project', '--name', `fact-number-${i}`, '--description', `Project fact number ${i} about area ${i * 7}`, '--body', `# Fact ${i}\n\n**Remember:** Area ${i * 7} works this way, case ${i}.\n`, '--approved-by', 'Mike', '--allow-similar'], { env });
    assert.equal(saved.code, 0, saved.stdout + saved.stderr);
  }
  return { root, env };
}

for (const host of ['claude', 'codex']) {
  test(`${host}: every hook finishes in at most half of its timeout in a busy Toolkit V2 project`, { timeout: 180000 }, async (t) => {
    const { root, env } = await busyProject();
    const report = [];
    for (const [event, input] of steps(host, root, `timing-${host}`)) {
      const r = runTimed(host, event, input, { cwd: root, env });
      report.push(`${event} ${Math.round(r.ms)} ms of ${r.timeoutMs} ms`);
      assert.equal(r.signal, null, `${host} ${event} was stopped by its timeout`);
      assert.equal(r.status, 0, `${host} ${event}: exit ${r.status} ${r.stderr}`);
      assert.ok(r.ms <= r.timeoutMs * SHARE_OF_TIMEOUT, `${host} ${event} took ${Math.round(r.ms)} ms; its timeout is ${r.timeoutMs} ms (${report.join('; ')})`);
    }
    t.diagnostic(report.join('; '));
  });

  test(`${host}: outside a Toolkit V2 project every hook prints nothing and returns quickly`, { timeout: 60000 }, async () => {
    const root = makeRepo('not-v2');
    const { env } = await initProject();
    for (const [event, input] of steps(host, root, `outside-${host}`)) {
      const r = runTimed(host, event, input, { cwd: root, env });
      assert.equal(r.status, 0, `${host} ${event}: exit ${r.status} ${r.stderr}`);
      assert.equal(r.stdout, '', `${host} ${event} printed something outside a V2 project`);
      assert.ok(r.ms <= OUTSIDE_MAX_MS, `${host} ${event} took ${Math.round(r.ms)} ms outside a V2 project`);
    }
  });
}

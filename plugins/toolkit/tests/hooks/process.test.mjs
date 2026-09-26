// The hooks run the way the hosts run them: Claude Code starts `node` with the
// args from hooks/hooks.json; Codex runs the command string from
// hooks/codex-hooks.json in a shell with PLUGIN_ROOT set. Every event exits 0
// and prints one JSON object or nothing. The Salesforce org guards in Codex
// turn every "ask" into "deny".

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PLUGIN_ROOT, cleanup, initProject, tempDir } from '../project/helpers.mjs';
import { fixture, updatePatch } from './fixtures.mjs';

after(cleanup);

const claudeHooks = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, 'hooks', 'hooks.json'), 'utf8'));
const codexHooks = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, 'hooks', 'codex-hooks.json'), 'utf8'));

function runClaude(event, input, { cwd, env }) {
  const h = claudeHooks.hooks[event][0].hooks[0];
  const args = h.args.map((a) => a.replace('${CLAUDE_PLUGIN_ROOT}', PLUGIN_ROOT));
  return spawnSync(h.command, args, { cwd, env: { ...env, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT, CLAUDE_PROJECT_DIR: cwd }, input: JSON.stringify(input), encoding: 'utf8', timeout: h.timeout * 1000 });
}

function runCodex(event, input, { cwd, env }) {
  const h = codexHooks.hooks[event][0].hooks[0];
  // Codex sets both variables for plugin hooks.
  return spawnSync('/bin/sh', ['-c', h.command], { cwd, env: { ...env, PLUGIN_ROOT, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT }, input: JSON.stringify(input), encoding: 'utf8', timeout: h.timeout * 1000 });
}

function jsonOrNothing(res, label) {
  assert.equal(res.status, 0, `${label}: exit ${res.status} ${res.stderr}`);
  const text = res.stdout.trim();
  if (!text) return null;
  assert.equal(text.split('\n').length, 1, `${label}: one JSON line`);
  return JSON.parse(text);
}

test('every event as a real child process, both hosts: exit 0, one JSON object or nothing', async () => {
  const { root, env } = await initProject();
  const v = { CWD: root, SESSION: 'proc-1', TURN: 'turn-1', PROMPT: 'From now on keep answers short.', COMMAND: 'git add -A', FILE: path.join(root, '.work-items', 'DASHBOARD.md'), PATCH: updatePatch('.work-items/DASHBOARD.md', 'a', 'b'), REL: '.work-items/DASHBOARD.md' };
  const claudeSteps = [
    ['SessionStart', 'session-start.startup', (o) => assert.match(o.hookSpecificOutput.additionalContext, /^Project briefing/)],
    ['UserPromptSubmit', 'user-prompt', (o) => assert.match(o.hookSpecificOutput.additionalContext, /memory-save records it/)],
    ['PreToolUse', 'pre-tool.bash', (o) => assert.equal(o.hookSpecificOutput.permissionDecision, 'deny')],
    ['PreToolUse', 'pre-tool.write', (o) => assert.equal(o.hookSpecificOutput.permissionDecision, 'deny')],
    ['PostToolUse', 'post-tool.bash', (o) => assert.equal(o, null)],
    ['Stop', 'stop', (o) => assert.equal(o.hookSpecificOutput.hookEventName, 'Stop')],
  ];
  for (const [event, name, check] of claudeSteps) {
    const out = jsonOrNothing(runClaude(event, fixture('claude', name, v), { cwd: root, env }), `claude ${event}`);
    check(out);
  }
  const codexSteps = [
    ['SessionStart', 'session-start.startup', (o) => assert.match(o.hookSpecificOutput.additionalContext, /How to write replies/)],
    ['UserPromptSubmit', 'user-prompt', (o) => assert.match(o.hookSpecificOutput.additionalContext, /memory-save records it/)],
    ['PreToolUse', 'pre-tool.bash', (o) => assert.deepEqual(Object.keys(o), ['hookSpecificOutput'])],
    ['PreToolUse', 'pre-tool.apply-patch', (o) => assert.equal(o.hookSpecificOutput.permissionDecision, 'deny')],
    ['PostToolUse', 'post-tool.apply-patch', (o) => assert.equal(o, null)],
    ['Stop', 'stop', (o) => assert.deepEqual(Object.keys(o).sort(), ['decision', 'reason'])],
  ];
  for (const [event, name, check] of codexSteps) {
    const out = jsonOrNothing(runCodex(event, fixture('codex', name, { ...v, SESSION: 'proc-2' }), { cwd: root, env }), `codex ${event}`);
    check(out);
  }
});

test('a hook with no standard input at all still exits 0 quickly', async () => {
  const { root, env } = await initProject();
  const res = spawnSync(process.execPath, [path.join(PLUGIN_ROOT, 'bin', 'toolkit'), 'hook', 'stop', '--host', 'codex'], { cwd: root, env, input: '', encoding: 'utf8', timeout: 10000 });
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '');
});

// ------------------------------------------------------------------ Salesforce guards

function fakeSf() {
  const bin = tempDir('tk-fakesf-');
  const orgs = {
    status: 0,
    result: {
      nonScratchOrgs: [{ alias: 'acme-prod', username: 'admin@acme.com', instanceUrl: 'https://acme.my.salesforce.com', isSandbox: false }],
      sandboxes: [{ alias: 'acme-uat', username: 'admin@acme.com.uat', instanceUrl: 'https://acme--uat.sandbox.my.salesforce.com', isSandbox: true }],
    },
  };
  fs.writeFileSync(path.join(bin, 'sf'), `#!/bin/sh\ncase "$*" in\n  *"org list"*) echo '${JSON.stringify(orgs)}' ;;\n  *"config get"*) echo '{"status":0,"result":[]}' ;;\n  *) echo '{}' ;;\nesac\n`, { mode: 0o755 });
  return bin;
}

function runGuard(root, guard, command, { host, env }) {
  const args = [path.join(root, '.claude', 'hooks', guard)];
  if (host === 'codex') args.push('--host', 'codex');
  const input = { session_id: 's', cwd: root, hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command }, tool_use_id: 'x', ...(host === 'codex' ? { turn_id: 't', model: 'm', permission_mode: 'default', transcript_path: null } : {}) };
  const res = spawnSync(process.execPath, args, { cwd: root, env, input: JSON.stringify(input), encoding: 'utf8', timeout: 60000 });
  assert.equal(res.status, 0, res.stderr);
  return res.stdout.trim() ? JSON.parse(res.stdout) : null;
}

test('Salesforce org guards: production is denied in both hosts; a sandbox deploy asks in Claude Code and is denied in Codex', async () => {
  const { root, env } = await initProject({ salesforce: true });
  const guardEnv = { ...env, PATH: `${fakeSf()}${path.delimiter}${env.PATH}` };
  const prodClaude = runGuard(root, 'guard-protected-orgs.cjs', 'sf project deploy start -x manifest/package.xml -o acme-prod', { host: 'claude', env: guardEnv });
  assert.equal(prodClaude.hookSpecificOutput.permissionDecision, 'deny');
  const prodCodex = runGuard(root, 'guard-protected-orgs.cjs', 'sf project deploy start -x manifest/package.xml -o acme-prod', { host: 'codex', env: guardEnv });
  assert.equal(prodCodex.hookSpecificOutput.permissionDecision, 'deny');
  const sandboxClaude = runGuard(root, 'guard-protected-orgs.cjs', 'sf project deploy start -x manifest/package.xml -o acme-uat', { host: 'claude', env: guardEnv });
  assert.equal(sandboxClaude.hookSpecificOutput.permissionDecision, 'ask');
  const sandboxCodex = runGuard(root, 'guard-protected-orgs.cjs', 'sf project deploy start -x manifest/package.xml -o acme-uat', { host: 'codex', env: guardEnv });
  assert.equal(sandboxCodex.hookSpecificOutput.permissionDecision, 'deny', 'Codex cannot ask, so the guard denies');
  assert.match(sandboxCodex.hookSpecificOutput.permissionDecisionReason, /Codex cannot ask for confirmation/);
  for (const out of [prodCodex, sandboxCodex]) for (const k of ['continue', 'stopReason', 'suppressOutput']) assert.equal(out[k], undefined);
  const validate = runGuard(root, 'guard-protected-orgs.cjs', 'sf project deploy validate -x manifest/package.xml -o acme-uat', { host: 'codex', env: guardEnv });
  assert.equal(validate, null, 'a sandbox validate needs no yes');
  const read = runGuard(root, 'guard-protected-orgs.cjs', 'sf data query -q "SELECT Id FROM Account" -o acme-prod', { host: 'codex', env: guardEnv });
  assert.equal(read, null, 'reads are allowed');
  // The Codex project hook file runs the same guard with --host codex.
  const codexFile = JSON.parse(fs.readFileSync(path.join(root, '.codex', 'hooks.json'), 'utf8'));
  const cmd = codexFile.hooks.PreToolUse[0].hooks[0].command;
  const viaCodex = spawnSync('/bin/sh', ['-c', cmd], {
    cwd: root,
    env: guardEnv,
    input: JSON.stringify({ session_id: 's', turn_id: 't', cwd: root, hook_event_name: 'PreToolUse', model: 'm', permission_mode: 'default', transcript_path: null, tool_name: 'Bash', tool_use_id: 'x', tool_input: { command: 'sf project deploy start -d force-app -o acme-uat' } }),
    encoding: 'utf8',
  });
  assert.equal(viaCodex.status, 0, viaCodex.stderr);
  assert.equal(JSON.parse(viaCodex.stdout).hookSpecificOutput.permissionDecision, 'deny');
});

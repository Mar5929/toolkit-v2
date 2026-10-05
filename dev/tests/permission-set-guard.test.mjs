// Tests for the Salesforce permission set deploy guard, guard-permission-set-deploy.cjs.
// Run from the repository root: node --test dev/tests/permission-set-guard.test.mjs
// Every run copies the guard into a temporary project folder, so its receipts folder
// (.claude/.permset-preflight) is in that folder and nothing else on this Mac changes.
// No org is reached: the guard only reads the command text, a manifest, and the receipts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const source = join(repo, 'plugins/toolkit/skills/project-setup/assets/salesforce/.claude/hooks/guard-permission-set-deploy.cjs');
const scratch = mkdtempSync(join(tmpdir(), 'tkv2-permset-guard-'));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));

let count = 0;
/** A new scratch project that holds the guard, with the receipts the test gives it. */
function project(receipts = {}) {
  const dir = join(scratch, `project-${++count}`);
  mkdirSync(join(dir, '.claude', 'hooks'), { recursive: true });
  mkdirSync(join(dir, '.claude', '.permset-preflight'), { recursive: true });
  copyFileSync(source, join(dir, '.claude', 'hooks', 'guard-permission-set-deploy.cjs'));
  for (const [name, receipt] of Object.entries(receipts)) {
    writeFileSync(join(dir, '.claude', '.permset-preflight', `${name}.json`), JSON.stringify(receipt));
  }
  return dir;
}

/** Runs the guard on one command; returns its exit code and its decision, or null when it allows. */
function guard(dir, input, args = []) {
  const stdin = typeof input === 'string' ? input : JSON.stringify({ tool_name: 'Bash', tool_input: { command: input.command } });
  const result = spawnSync(process.execPath, [join(dir, '.claude', 'hooks', 'guard-permission-set-deploy.cjs'), ...args], { input: stdin, encoding: 'utf8', cwd: dir });
  return { code: result.status, decision: result.stdout ? JSON.parse(result.stdout).hookSpecificOutput : null };
}

const minutesAgo = (n) => new Date(Date.now() - n * 60000).toISOString();
const DEPLOY = 'sf project deploy start -m PermissionSet:Sales_Rep -o dev-sandbox';

test('permission set guard: a deploy that names a permission set with no receipt is denied', () => {
  const dir = project();
  const { code, decision } = guard(dir, { command: DEPLOY });
  assert.equal(code, 0);
  assert.equal(decision.hookEventName, 'PreToolUse');
  assert.equal(decision.permissionDecision, 'deny');
  assert.match(decision.permissionDecisionReason, /^Blocked: this deploy ships a permission set with no fresh preflight\./);
  assert.match(decision.permissionDecisionReason, /Not cleared: Sales_Rep \(no preflight on record\)/);
  assert.match(decision.permissionDecisionReason, /permsets\.py preflight <file> --org <sandbox>/);
});

test('permission set guard: a clean receipt under 30 minutes old lets the deploy through', () => {
  const dir = project({ Sales_Rep: { clean: true, checkedAt: minutesAgo(5) } });
  assert.deepEqual(guard(dir, { command: DEPLOY }), { code: 0, decision: null });
  assert.deepEqual(guard(dir, { command: DEPLOY }, ['--host', 'codex']), { code: 0, decision: null }, 'the Codex argument changes nothing');
});

test('permission set guard: a stale receipt, or one that is not clean, is denied', () => {
  const stale = project({ Sales_Rep: { clean: true, checkedAt: minutesAgo(31) } });
  assert.match(guard(stale, { command: DEPLOY }).decision.permissionDecisionReason, /Not cleared: Sales_Rep \(preflight is stale\)/);
  const losses = project({ Sales_Rep: { clean: false, checkedAt: minutesAgo(1) } });
  assert.match(guard(losses, { command: DEPLOY }).decision.permissionDecisionReason, /Not cleared: Sales_Rep \(last preflight found losses that were not accepted\)/);
  const noDate = project({ Sales_Rep: { clean: true } });
  assert.match(guard(noDate, { command: DEPLOY }).decision.permissionDecisionReason, /Sales_Rep \(preflight is stale\)/);
});

test('permission set guard: it finds a permission set named by a file, a folder, a manifest, or the bare type', () => {
  const dir = project({ Cleared: { clean: true, checkedAt: minutesAgo(1) } });
  const sets = join(dir, 'force-app', 'main', 'default', 'permissionsets');
  mkdirSync(sets, { recursive: true });
  writeFileSync(join(sets, 'Sales_Rep.permissionset-meta.xml'), '<PermissionSet/>');
  writeFileSync(join(dir, 'package.xml'), '<Package><types><members>Sales_Rep</members><members>Cleared</members><name>PermissionSet</name></types><types><members>Account</members><name>CustomObject</name></types></Package>');
  const reason = (command) => guard(dir, { command }).decision.permissionDecisionReason;
  assert.match(reason('sf project deploy start -d force-app/main/default/permissionsets/Sales_Rep.permissionset-meta.xml -o sbx'), /Not cleared: Sales_Rep \(no preflight on record\)/);
  assert.match(reason('sf project deploy start -d force-app -o sbx'), /Not cleared: \* \(the command deploys every permission set it can reach\)/);
  assert.match(reason('sf project deploy start -x package.xml -o sbx'), /Not cleared: Sales_Rep \(no preflight on record\)$/m, 'the cleared set in the manifest is not listed');
  assert.match(reason('sf project deploy start -m PermissionSet -o sbx'), /Not cleared: \* /);
  assert.match(reason('sfdx force:source:deploy -m PermissionSet:Sales_Rep -u sbx'), /Sales_Rep \(no preflight on record\)/);
});

test('permission set guard: other commands, a deploy with no permission set, and bad input pass with no output', () => {
  const dir = project();
  mkdirSync(join(dir, 'force-app', 'main', 'default', 'classes'), { recursive: true });
  const allowed = [
    'git status',
    'sf project deploy validate -m PermissionSet:Sales_Rep -o sbx',
    'sf project deploy preview -m PermissionSet:Sales_Rep -o sbx',
    'sf project deploy start -m ApexClass:OrderSync -o sbx',
    'sf project deploy start -d force-app/main/default/classes -o sbx',
    'sf project deploy start -x missing-manifest.xml -o sbx',
  ];
  for (const command of allowed) assert.deepEqual(guard(dir, { command }), { code: 0, decision: null }, command);
  for (const input of ['not json', '', '{"tool_input":{}}', '{"tool_input":{"command":42}}']) {
    assert.deepEqual(guard(dir, input), { code: 0, decision: null }, input);
  }
});

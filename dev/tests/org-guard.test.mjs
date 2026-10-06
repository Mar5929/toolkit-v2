// Tests for the Salesforce org guard, guard-protected-orgs.cjs,
// run with the salesforce folder's own policy file, protected-orgs.json (action "deny").
// Run from the repository root: node --test dev/tests/org-guard.test.mjs
// Every run copies the guard and its policy into a scratch project folder. A stand-in
// `sf` there answers the two org lookups the guard makes, and PATH holds only that
// stand-in, so no real Salesforce CLI and no org is ever reached.
// ORG_GUARD_FILE=<path> tests another copy of the guard, such as an older one.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const model = join(repo, 'plugins/toolkit/skills/project-setup/assets/salesforce/.claude');
const scratch = mkdtempSync(join(tmpdir(), 'tkv2-org-guard-'));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));

// The scratch project: the guard and its policy, where a project keeps them.
const project = join(scratch, 'project');
const guardFile = join(project, '.claude/hooks/guard-protected-orgs.cjs');
mkdirSync(dirname(guardFile), { recursive: true });
copyFileSync(process.env.ORG_GUARD_FILE || join(model, 'hooks/guard-protected-orgs.cjs'), guardFile);
copyFileSync(join(model, 'protected-orgs.json'), join(project, '.claude/protected-orgs.json'));

// The stand-in sf. acme-prod is production, acme-uat a sandbox, and acme-scratch a
// scratch org; the guard cannot classify any other name. It logs every call, and it
// fails on any call other than the two lookups.
const bin = join(scratch, 'bin');
const calls = join(scratch, 'sf-calls.log');
const LOOKUPS = ['config get target-org --json', 'org list --json --skip-connection-status'];
const orgs = { status: 0, result: {
  nonScratchOrgs: [{ alias: 'acme-prod', username: 'admin@acme.com', instanceUrl: 'https://acme.my.salesforce.com', isSandbox: false }],
  sandboxes: [{ alias: 'acme-uat', username: 'admin@acme.com.uat', instanceUrl: 'https://acme--uat.sandbox.my.salesforce.com', isSandbox: true }],
  scratchOrgs: [{ alias: 'acme-scratch', username: 'test-1@example.com', instanceUrl: 'https://acme.scratch.my.salesforce.com', isScratch: true }],
} };
mkdirSync(bin);
const standIn = `#!/bin/sh
echo "$*" >> '${calls}'
case "$*" in
  "${LOOKUPS[0]}") printf '{"status":0,"result":[{"value":"%s"}]}\\n' "$FAKE_SF_DEFAULT_ORG" ;;
  "${LOOKUPS[1]}") echo '${JSON.stringify(orgs)}' ;;
  *) exit 1 ;;
esac
`;
writeFileSync(join(bin, 'sf'), standIn, { mode: 0o755 });

/** Runs the guard the way a host does; returns { decision, reason }. Printing nothing means 'allow'. */
function guard(command, { host = 'claude', defaultOrg = '' } = {}) {
  const res = spawnSync(process.execPath, [guardFile, ...(host === 'codex' ? ['--host', 'codex'] : [])], {
    cwd: project,
    env: { PATH: bin, HOME: scratch, FAKE_SF_DEFAULT_ORG: defaultOrg },
    input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } }),
    encoding: 'utf8',
  });
  assert.equal(res.status, 0, res.stderr);
  if (!res.stdout.trim()) return { decision: 'allow', reason: '' };
  const out = JSON.parse(res.stdout).hookSpecificOutput;
  return { decision: out.permissionDecision, reason: out.permissionDecisionReason };
}

// The four commands that start Apex or Flow tests in an org, then the same commands in
// another word order or with colons, which the sf CLI reads as the same command.
const TEST_RUNS = ['sf apex run test', 'sfdx force:apex:test:run', 'sf logic run test', 'sf flow run test'];
const OTHER_FORMS = ['sf apex test run', 'sf test run apex', 'sf apex:run:test', 'sf force apex test run', 'sf logic:run:test', 'sf run logic test', 'sf flow:run:test', 'sf run flow test'];
const ALL_FORMS = [...TEST_RUNS, ...OTHER_FORMS];
/** The full command: the old sfdx name takes -u, the others -o. */
const run = (name, org) => `${name} -l RunLocalTests ${name.startsWith('sfdx') ? '-u' : '-o'} ${org}`;

test('the starter project policy blocks production', () => {
  assert.equal(JSON.parse(readFileSync(join(project, '.claude/protected-orgs.json'), 'utf8')).action, 'deny');
});

test('a test run against production is blocked, under every name and form', () => {
  for (const name of ALL_FORMS) {
    const r = guard(run(name, 'acme-prod'));
    assert.equal(r.decision, 'deny', name);
    assert.match(r.reason, /Guarded 'testRun' command: 'acme-prod' is a PRODUCTION org\. BLOCKED/, name);
  }
});

test('a test run against an org the guard cannot classify is blocked', () => {
  for (const name of TEST_RUNS) {
    const r = guard(run(name, 'someone-else'));
    assert.equal(r.decision, 'deny', name);
    assert.match(r.reason, /'someone-else' could not be classified/, name);
  }
  const none = guard('sf apex run test -l RunLocalTests');
  assert.equal(none.decision, 'deny', 'no -o and no default org');
  assert.match(none.reason, /no resolvable target org/);
});

test('a test run against a sandbox or scratch org passes with no question', () => {
  for (const name of ALL_FORMS) {
    for (const org of ['acme-uat', 'acme-scratch']) assert.equal(guard(run(name, org)).decision, 'allow', `${name}, ${org}`);
  }
});

test('with no -o, the default org decides', () => {
  const prod = guard('sf apex run test -l RunLocalTests', { defaultOrg: 'acme-prod' });
  assert.equal(prod.decision, 'deny');
  assert.match(prod.reason, /\(default org\): 'acme-prod' is a PRODUCTION org/);
  assert.equal(guard('sf apex run test -l RunLocalTests', { defaultOrg: 'acme-uat' }).decision, 'allow');
});

test('in Codex a test run is blocked on production and passes on a sandbox', () => {
  for (const name of TEST_RUNS) {
    assert.equal(guard(run(name, 'acme-prod'), { host: 'codex' }).decision, 'deny', name);
    assert.equal(guard(run(name, 'acme-uat'), { host: 'codex' }).decision, 'allow', name);
  }
});

test('help and reading test results pass, in production too', () => {
  const reads = [
    'sf apex run test --help',
    'sf apex run test -o acme-prod -h',
    'sf logic run test --help',
    'sf apex get test -i 707000000000001 -o acme-prod',
    'sf logic get test -i 707000000000001 -o acme-prod',
    'sf flow run test --help',
    'sf flow get test -i 707000000000001 -o acme-prod',
    'sfdx force:apex:test:report -i 707000000000001 -u acme-prod',
  ];
  for (const command of reads) {
    for (const host of ['claude', 'codex']) assert.equal(guard(command, { host }).decision, 'allow', `${host}: ${command}`);
  }
});

test('a test run inside a shell string is checked, and text that only mentions one passes', () => {
  assert.equal(guard('bash -c "sf apex run test -o acme-prod"').decision, 'deny');
  assert.equal(guard('git commit -m "Ran sf apex run test -o acme-prod"').decision, 'allow');
});

// What the guard decides for other commands: [command, in Claude Code, in Codex].
// A later change that alters one of these fails here.
const OTHER_COMMANDS = [
  ['sf project deploy start -x p.xml -o acme-prod', 'deny', 'deny'],
  ['sf project deploy validate -x p.xml -o acme-prod', 'deny', 'deny'],
  ['sf project deploy validate -x p.xml -o acme-uat', 'allow', 'allow'],
  ['sf project deploy start -x p.xml -o acme-uat', 'ask', 'deny'],
  ['sf project deploy start -x p.xml', 'deny', 'deny'], // no -o and no default org
  ['sf project deploy pipeline start -p App -b main -c devops-admin', 'deny', 'deny'],
  ['sf apex run -f x.apex -o acme-prod', 'deny', 'deny'],
  ['sf apex run -f x.apex -o acme-uat', 'ask', 'deny'],
  ['sfdx force:apex:execute -f x.apex -u acme-uat', 'ask', 'deny'],
  ['sf data create record -s Account -v "Name=A" -o acme-prod', 'deny', 'deny'],
  ['sf data create record -s Account -v "Name=A" -o acme-uat', 'ask', 'deny'],
  ['sf project delete source -m ApexClass:A -o acme-prod', 'deny', 'deny'],
  ['sf org delete scratch -o acme-scratch', 'deny', 'deny'],
  ['sf data query -q "SELECT Id FROM Account" -o acme-prod', 'allow', 'allow'],
  ['sf project retrieve start -m ApexClass -o acme-prod', 'allow', 'allow'],
  ['sf deploy metadata report -o acme-prod', 'allow', 'allow'],
  // The owner's choice (TKV-6, Q-02): Agentforce agent tests are not checked.
  ['sf agent test run -o acme-prod', 'allow', 'allow'],
  ['git status --short', 'allow', 'allow'],
];

test('every other command gets the decision it got before', () => {
  for (const [command, claude, codex] of OTHER_COMMANDS) {
    assert.equal(guard(command).decision, claude, `Claude Code: ${command}`);
    assert.equal(guard(command, { host: 'codex' }).decision, codex, `Codex: ${command}`);
  }
});

test('the guard called only the stand-in sf, and only for the two org lookups', () => {
  guard('sf apex run test', { defaultOrg: 'acme-uat' }); // makes both lookups, so this test also passes alone
  const made = [...new Set(readFileSync(calls, 'utf8').trim().split('\n'))].sort();
  assert.deepEqual(made, LOOKUPS);
});

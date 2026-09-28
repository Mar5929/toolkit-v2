// The model's Salesforce org guard, as shipped in scaffold/model/:
// .claude/hooks/guard-protected-orgs.cjs with the model's
// .claude/protected-orgs.json (action "deny").
//
// Sample run b-salesforce (bug b3) showed the guard read the whole command
// text: `toolkit work history WI-001 --note "... sf project deploy start ..."`
// was refused as a deploy, and `sf data create record --help` as a data write.
// The guard now checks only the sf and sfdx commands the shell will run. These
// tests hold both halves: text that only mentions a command passes, and every
// way of really running one is still checked.
//
// A second review showed three more things, also held here: an org set by
// SF_TARGET_ORG=... counts only for the sf command it is written in front of;
// arithmetic such as ((1<<2)) and a setting such as GIT_EDITOR='sf ...' send
// the line back to whole-text matching; and a command is known by the words
// of its name in any order, as the sf CLI reads them.
//
// Run from the repository root: node --test 'plugins/toolkit/tests/**/*.test.mjs'
// It writes only to a temporary folder. A fake `sf` on PATH answers the org
// lookups, so no real Salesforce CLI or org is used.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GUARD = path.resolve(HERE, '..', '..', 'scaffold', 'model', '.claude', 'hooks', 'guard-protected-orgs.cjs');

const TMP = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'toolkit-org-guard-')));
after(() => fs.rmSync(TMP, { recursive: true, force: true }));

// acme-prod is production and acme-uat a sandbox. Every call is logged. The
// default org is empty unless a test sets FAKE_SF_DEFAULT_ORG.
const BIN = path.join(TMP, 'bin');
const CALLS = path.join(TMP, 'sf-calls.log');
fs.mkdirSync(BIN);
const ORGS = {
  status: 0,
  result: {
    nonScratchOrgs: [{ alias: 'acme-prod', username: 'admin@acme.com', instanceUrl: 'https://acme.my.salesforce.com', isSandbox: false }],
    sandboxes: [{ alias: 'acme-uat', username: 'admin@acme.com.uat', instanceUrl: 'https://acme--uat.sandbox.my.salesforce.com', isSandbox: true }],
  },
};
fs.writeFileSync(
  path.join(BIN, 'sf'),
  `#!/bin/sh\necho "$*" >> '${CALLS}'\ncase "$*" in\n  *"org list"*) echo '${JSON.stringify(ORGS)}' ;;\n  *"config get"*) if [ -n "$FAKE_SF_DEFAULT_ORG" ]; then printf '{"status":0,"result":[{"value":"%s"}]}\\n' "$FAKE_SF_DEFAULT_ORG"; else echo '{"status":0,"result":[]}'; fi ;;\n  *) echo '{}' ;;\nesac\n`,
  { mode: 0o755 },
);

const ENV = { PATH: `${BIN}${path.delimiter}${process.env.PATH}`, HOME: TMP };

/** Run the guard the way a host does; returns 'allow', 'ask', or 'deny' and the reason. */
function guard(command, { host = 'claude', tool = 'Bash', defaultOrg = '' } = {}) {
  const args = [GUARD];
  if (host === 'codex') args.push('--host', 'codex');
  const res = spawnSync(process.execPath, args, {
    env: { ...ENV, FAKE_SF_DEFAULT_ORG: defaultOrg },
    input: JSON.stringify({ session_id: 's', hook_event_name: 'PreToolUse', tool_name: tool, tool_input: { command } }),
    encoding: 'utf8',
    timeout: 60000,
  });
  assert.equal(res.status, 0, res.stderr);
  const out = res.stdout.trim();
  if (!out) return { decision: 'allow', reason: '' };
  const o = JSON.parse(out).hookSpecificOutput;
  return { decision: o.permissionDecision, reason: o.permissionDecisionReason };
}

function sfCalls() {
  return fs.existsSync(CALLS) ? fs.readFileSync(CALLS, 'utf8') : '';
}

test('the shipped guard exists and the model blocks production', () => {
  assert.ok(fs.existsSync(GUARD), GUARD);
  const cfg = JSON.parse(fs.readFileSync(path.join(path.dirname(GUARD), '..', 'protected-orgs.json'), 'utf8'));
  assert.equal(cfg.action, 'deny');
});

test('text that only mentions a Salesforce command passes, in both hosts (bug b3)', () => {
  const before = sfCalls();
  const mentions = [
    'toolkit work history WI-001 --note "Owner ran sf project deploy start to tkv2-prod"',
    'toolkit work history WI-001 --note "The guard blocked the exact sf project deploy start command, so Mike ran it."',
    'git commit -m "Deploy WI-001 with sf project deploy start -o acme-prod"',
    "echo 'sf project deploy start -o acme-prod'",
    "cat > notes.md <<'EOF'\nRun: sf project deploy start -x p.xml -o acme-prod\nEOF",
    "toolkit work edit WI-001 --section Tasks --set-file - <<'EOF'\n- sf data create record -o acme-prod\nEOF",
    'grep -rn "sf project deploy start" delivery/',
    'git status --short && toolkit work lifecycle # sf project deploy start',
  ];
  for (const host of ['claude', 'codex']) {
    for (const command of mentions) {
      assert.equal(guard(command, { host }).decision, 'allow', `${host}: ${command}`);
    }
  }
  assert.equal(sfCalls(), before, 'a mention needs no org lookup');
});

test('sf --help and -h only print help, so they pass (bug b3)', () => {
  for (const command of ['sf data create record --help', 'sf data create record -h', 'sf project deploy start -o acme-prod --help', 'sf apex run --help | head -20']) {
    assert.equal(guard(command, { host: 'codex' }).decision, 'allow', command);
  }
});

test('reads and sandbox validates still pass', () => {
  assert.equal(guard('sf data query -q "SELECT Id FROM Account WHERE Name = \'sf project deploy start\'" -o acme-prod', { host: 'codex' }).decision, 'allow');
  assert.equal(guard('sf project deploy validate -x p.xml -o acme-uat', { host: 'codex' }).decision, 'allow');
  assert.equal(guard('sf sobject describe -s Account -o acme-prod --json', { host: 'codex' }).decision, 'allow');
});

test('a real deploy, data write, or Apex run is still checked however it is written', () => {
  const production = [
    'sf project deploy start -x p.xml -o acme-prod',
    'cd force-app && sf project deploy start -o acme-prod',
    'sf project deploy validate -x p.xml -o acme-uat && sf project deploy start -x p.xml -o acme-prod',
    'sf project deploy validate -x p.xml -o acme-prod',
    'sf project deploy start --target-org=acme-prod',
    'sf project deploy start -oacme-prod',
    'sf project:deploy:start -o acme-prod',
    '/usr/local/bin/sf data delete record -s Account -i 001 -o acme-prod',
    "sf apex run -o acme-prod <<'EOF'\nSystem.debug(1);\nEOF",
    '(sf project deploy start -o acme-prod)',
    '{ sf project deploy start -o acme-prod; }',
    'if sf project deploy start -o acme-prod; then echo ok; fi',
    'sf project deploy start -o acme-prod 2>&1 | tee deploy.log',
    '> deploy.log sf project deploy start -o acme-prod',
    'SF_TARGET_ORG=acme-prod sf project deploy start -x p.xml',
    'export SF_TARGET_ORG=acme-prod; sf project deploy start -x p.xml',
    // The shell runs these, so the whole text is still read.
    'bash -c "sf project deploy start -o acme-prod"',
    'echo "sf project deploy start -o acme-prod" | sh',
    'echo "sf project deploy start -o acme-prod" > deploy.sh && bash deploy.sh',
    "cat <<'EOF' | sh\nsf project deploy start -o acme-prod\nEOF",
    'toolkit work history WI-001 --note "$(sf project deploy start -o acme-prod)"',
    'toolkit work history WI-001 --note "ran `sf data create record -o acme-prod`"',
    "python3 - <<'PY'\nimport os\nos.system('sf project deploy start -o acme-prod')\nPY",
    'xargs sf project deploy start -o acme-prod < orgs.txt',
    "git -c alias.d='!sf project deploy start -o acme-prod' d",
    'echo "an unclosed quote sf project deploy start -o acme-prod',
    // Second review: each of these really ran the production deploy in bash and zsh.
    '((1<<2))\nsf project deploy start -o acme-prod',
    'echo $[1<<2]\nsf project deploy start -o acme-prod',
    "GIT_EDITOR='sf project deploy start -o acme-prod; true' git commit",
    "GIT_EXTERNAL_DIFF='sf project deploy start -o acme-prod #' git diff HEAD~1",
    'cat <<EOF\nsf project deploy start -o acme-prod',
    'x=1 <<EOF\nsf project deploy start -o acme-prod\nEOF',
    // The sf CLI takes the words of a name in any order, and old names.
    'sf deploy project start -o acme-prod',
    'sf start deploy project -o acme-prod',
    'sf project deploy:start -o acme-prod',
    'sf run apex -o acme-prod',
    'sf force source deploy -u acme-prod',
    'sf deploy metadata -o acme-prod',
    'sf deploy metadata validate -o acme-prod',
    'sf data update bulk -o acme-prod -f a.csv',
    'bash -c "sf start deploy project -o acme-prod"',
    'bash -c \'sf "project" deploy start -o acme-prod\'',
  ];
  for (const host of ['claude', 'codex']) {
    for (const command of production) {
      assert.equal(guard(command, { host }).decision, 'deny', `${host}: ${command}`);
    }
  }
  const viaEnv = guard('SF_TARGET_ORG=acme-prod sf project deploy start -x p.xml');
  assert.match(viaEnv.reason, /'acme-prod' is a PRODUCTION org/);
  assert.match(viaEnv.reason, /environment variable/);
});

test('an org set by SF_TARGET_ORG counts only for the sf command it is written in front of', () => {
  // Each second deploy goes to the default org. An earlier version took
  // acme-uat from elsewhere on the line and asked to approve a sandbox deploy.
  const elsewhere = [
    'SF_TARGET_ORG=acme-uat sf project deploy validate -x p.xml && sf project deploy start -x p.xml',
    'sf project deploy start -x p.xml # SF_TARGET_ORG=acme-uat',
    "echo 'SF_TARGET_ORG=acme-uat' && sf project deploy start -x p.xml",
    'SF_TARGET_ORG=acme-uat toolkit work show WI-001; sf project deploy start -x p.xml',
  ];
  for (const command of elsewhere) {
    const none = guard(command);
    assert.equal(none.decision, 'deny', `no default org: ${command}`);
    assert.match(none.reason, /no resolvable target org/, command);
    const prod = guard(command, { defaultOrg: 'acme-prod' });
    assert.equal(prod.decision, 'deny', `production default org: ${command}`);
    assert.match(prod.reason, /\(default org\): 'acme-prod' is a PRODUCTION org/, command);
    assert.doesNotMatch(prod.reason, /sandbox/, command);
  }
  // Written in front of the sf command itself, it is that command's target,
  // and the sandbox prompt says where the org came from.
  const own = guard('SF_TARGET_ORG=acme-uat sf project deploy start -x p.xml', { defaultOrg: 'acme-prod' });
  assert.equal(own.decision, 'ask');
  assert.match(own.reason, /environment variable SF_TARGET_ORG in front of the command\): 'acme-uat' is a sandbox org/);
  assert.equal(guard('SF_TARGET_ORG=acme-uat sf project deploy validate -x p.xml').decision, 'allow');
  const def = guard('sf project deploy start -x p.xml', { defaultOrg: 'acme-uat' });
  assert.equal(def.decision, 'ask');
  assert.match(def.reason, /\(default org\): 'acme-uat' is a sandbox org/);
});

test('an org set by export or a bare setting is checked beside the default org, and the stricter wins', () => {
  for (const command of ['export SF_TARGET_ORG=acme-prod; sf project deploy start -x p.xml', 'SF_TARGET_ORG=acme-prod; sf project deploy start -x p.xml']) {
    const r = guard(command, { defaultOrg: 'acme-uat' });
    assert.equal(r.decision, 'deny', command);
    assert.match(r.reason, /environment variable in the command text\): 'acme-prod' is a PRODUCTION org/, command);
    assert.equal(guard(command).decision, 'deny', `no default org: ${command}`);
  }
  // The default org is production, so the export to a sandbox does not make it a sandbox prompt.
  assert.equal(guard('export SF_TARGET_ORG=acme-uat; sf project deploy start -x p.xml', { defaultOrg: 'acme-prod' }).decision, 'deny');
});

test('Apex tests and other commands whose names hold a guarded name pass', () => {
  for (const command of ['sf apex run test -o acme-prod', 'sf apex test run -o acme-prod', 'sf project deploy report -o acme-prod', 'sf deploy metadata report -o acme-prod', 'sf deploy metadata validate -x p.xml -o acme-uat']) {
    assert.equal(guard(command, { host: 'codex' }).decision, 'allow', command);
  }
  assert.equal(guard('sf env delete scratch -o acme-uat').decision, 'deny', 'the old name of org delete scratch');
});

test('a line that also runs a command the guard cannot read is matched as whole text, as before', () => {
  // The script could run the deploy the note mentions, so the note is not trusted here.
  const r = guard('python3 tools/kb/build_edges.py && toolkit work history WI-001 --note "sf project deploy start ran"', { host: 'codex' });
  assert.equal(r.decision, 'deny');
  assert.equal(guard('python3 tools/kb/build_edges.py && toolkit work show WI-001', { host: 'codex' }).decision, 'allow', 'no Salesforce command in the text');
});

test('an org it cannot classify, or no target at all, is blocked', () => {
  assert.equal(guard('sf project deploy start -o someone-else').decision, 'deny');
  const none = guard('sf project deploy start -x p.xml', { host: 'codex' });
  assert.equal(none.decision, 'deny');
  assert.match(none.reason, /no resolvable target org/);
});

test('a sandbox change asks in Claude Code and is blocked in Codex, as before', () => {
  assert.equal(guard('sf project deploy start -x p.xml -o acme-uat').decision, 'ask');
  const codex = guard('sf project deploy start -x p.xml -o acme-uat', { host: 'codex' });
  assert.equal(codex.decision, 'deny');
  assert.match(codex.reason, /Codex cannot ask for confirmation/);
  assert.equal(guard('sf org delete scratch -o acme-uat').decision, 'deny', 'an org delete always asks or blocks');
});

test('the strictest command in a line decides', () => {
  const r = guard('sf project deploy start -o acme-uat; sf project deploy start -o acme-prod');
  assert.equal(r.decision, 'deny');
  assert.match(r.reason, /acme-prod/);
});

test('a PowerShell command line is still read as whole text', () => {
  assert.equal(guard('sf data create record --help', { tool: 'PowerShell' }).decision, 'deny');
  assert.equal(guard('sf data query -q "SELECT Id FROM Account" -o acme-prod', { tool: 'PowerShell' }).decision, 'allow');
});

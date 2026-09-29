// The verifier findings of 2026-09-28 on the CLI and doctor:
// - I4 in Codex: each prompt rule tells the agent to ask for escalated
//   permissions, and doctor checks the project's Codex rules the way it
//   checks the Claude Code ask rules;
// - flags written before an ask-first command are refused, because neither
//   host's ask rule matches that form;
// - the secret check no longer refuses harmless text;
// - a second clone of a project gets its own daily backup folder;
// - sync no longer says "Nothing new from the toolkit" for a file the project
//   changed.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { cleanup, initProject, makeHome, read, tempDir, tk, PLUGIN_ROOT } from './helpers.mjs';
import { parsePrefixRules, ruleDecision } from '../../lib/project/codex-rules.mjs';
import { ASK_FIRST_COMMANDS, askFirstCommand } from '../../lib/cli.mjs';
import { TOOLKIT_ASK_RULES } from '../../lib/project/checks.mjs';
import { secretKind } from '../../lib/memory/contract.mjs';

after(cleanup);

const RULES = path.join(PLUGIN_ROOT, 'templates', 'codex', 'toolkit.rules');
const SAMPLES = {
  'machine-setup': ['toolkit', 'machine-setup'],
  'memory delete': ['toolkit', 'memory', 'delete', 'project_old_fact', '--owner-approved'],
  'memory import': ['toolkit', 'memory', 'import', '--from', 'backup'],
  import: ['toolkit', 'import', '--from', 'backup'],
  'hindsight service install': ['toolkit', 'hindsight', 'service', 'install'],
  'hindsight service start': ['toolkit', 'hindsight', 'service', 'start'],
  'rule add --machine': ['toolkit', 'rule', 'add', '--machine', '--section', 'Replies', '--text', 'Lead with the answer.', '--source', 'Mike in chat'],
  'rule update --machine': ['toolkit', 'rule', 'update', '--machine', '--section', 'Replies', '--entry', '1', '--remove'],
};

// ------------------------------------------------------------------ I4 in Codex

test('Codex rules: every prompt rule for a toolkit command says to run it alone with require_escalated', () => {
  const text = read(RULES);
  assert.match(text, /The approval alone does not move the command out of the sandbox/);
  const blocks = text.split('prefix_rule(').slice(1).filter((b) => /pattern = \["toolkit",/.test(b) && /decision = "prompt"/.test(b));
  assert.equal(blocks.length, 5);
  for (const b of blocks) assert.match(b, /justification = "[^"]*Run it alone with sandbox_permissions require_escalated\."/);
});

test('the rules reader gives the same decisions as the template means: prompt for the ask-first commands, allow for the rest', () => {
  const rules = parsePrefixRules(read(RULES));
  assert.deepEqual(Object.keys(SAMPLES).sort(), ASK_FIRST_COMMANDS.map((c) => c.join(' ')).sort(), 'one sample per ask-first command');
  for (const words of Object.values(SAMPLES)) assert.equal(ruleDecision(rules, words), 'prompt', words.join(' '));
  assert.equal(ruleDecision(rules, ['toolkit', 'work', 'list']), 'allow');
  assert.equal(ruleDecision(rules, ['toolkit', 'hindsight', 'service', 'status']), 'allow');
  assert.equal(ruleDecision(rules, ['toolkit', 'rule', 'add', '--section', 'Replies']), 'allow', 'a project rule needs no prompt');
  assert.equal(ruleDecision(rules, ['toolkit', 'rule', 'list', '--machine']), 'allow');
  assert.equal(ruleDecision(rules, ['git', 'status']), null);
  assert.equal(ruleDecision(rules, ['git', 'commit', '-m', 'x']), 'prompt');
  // Every ask-first command also has a Claude Code ask rule.
  for (const c of ASK_FIRST_COMMANDS) assert.ok(TOOLKIT_ASK_RULES.some((r) => r.startsWith(`Bash(toolkit ${c.join(' ')}`)), c.join(' '));
});

const codex = spawnSync('codex', ['--version'], { encoding: 'utf8' });
test('the rules reader agrees with codex execpolicy check', { skip: codex.status === 0 ? false : 'the codex command is not installed' }, () => {
  const rules = parsePrefixRules(read(RULES));
  const env = { ...process.env, CODEX_HOME: tempDir('tk-codex-home-') };
  for (const words of [...Object.values(SAMPLES), ['toolkit', 'work', 'list'], ['git', 'add', 'x'], ['git', 'branch', '-D', 'x']]) {
    const res = spawnSync('codex', ['execpolicy', 'check', '--rules', RULES, ...words], { encoding: 'utf8', cwd: tempDir(), env });
    assert.equal(res.status, 0, res.stderr);
    assert.equal(ruleDecision(rules, words), JSON.parse(res.stdout).decision, words.join(' '));
  }
});

test('doctor warns when the project\'s Codex rules no longer ask before the risky toolkit commands', async () => {
  const { root, env } = await initProject({ extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  let res = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!res.json.findings.some((f) => f.id === 'codex-ask-rules'), 'the installed rules are complete');
  // The project changed the file and kept only the general allow.
  const file = path.join(root, '.codex', 'rules', 'toolkit.rules');
  fs.writeFileSync(file, 'prefix_rule(\n    pattern = ["toolkit"],\n    decision = "allow",\n    justification = "Our own rule.",\n)\n');
  res = await tk(root, ['doctor', '--json'], { env });
  const f = res.json.findings.find((x) => x.id === 'codex-ask-rules');
  assert.ok(f, JSON.stringify(res.json.findings.map((x) => x.id)));
  assert.equal(f.severity, 'warning');
  assert.deepEqual(f.commands, ASK_FIRST_COMMANDS.map((c) => `toolkit ${c.join(' ')}`));
  assert.match(f.fix, new RegExp(RULES.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  // Sync leaves the changed file alone and says what it is, without "Nothing new".
  const sync = await tk(root, ['sync', '--dry-run'], { env });
  assert.doesNotMatch(sync.stdout, /Nothing new from the toolkit/);
  assert.match(sync.stdout, /\.codex\/rules\/toolkit\.rules\. The toolkit's own version has not changed since it was installed/);
  // One prompt rule back: only the others are named.
  fs.appendFileSync(file, '\nprefix_rule(\n    pattern = ["toolkit", "machine-setup"],\n    decision = "prompt",\n)\n');
  res = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!res.json.findings.find((x) => x.id === 'codex-ask-rules').commands.includes('toolkit machine-setup'));
  // A Claude Code-only project has no Codex rules to check.
  const claudeOnly = await initProject({ hosts: 'claude-code', extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  const r2 = await tk(claudeOnly.root, ['doctor', '--json'], { env: claudeOnly.env });
  assert.ok(!r2.json.findings.some((x) => x.id === 'codex-ask-rules'));
});

// ------------------------------------------------------------------ flags before the command words

test('an ask-first command with a flag written before its words is refused and runs nothing', async () => {
  const { root, env } = await initProject();
  const saved = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'old-fact', '--description', 'An old fact about the build', '--body', 'An old fact about the build.', '--approved-by', 'Mike'], { env });
  assert.equal(saved.code, 0, saved.stderr);
  const res = await tk(root, ['--json', 'memory', 'delete', 'project_old_fact', '--owner-approved'], { env });
  assert.equal(res.code, 2);
  assert.match(res.json.error.message, /toolkit memory delete was not run: a flag was written before the command words/);
  assert.ok(fs.existsSync(path.join(root, '.memory', 'project_old_fact.md')), 'nothing was deleted');
  const host = await tk(root, ['--host', 'codex', 'import', '--from', tempDir()], { env });
  assert.equal(host.code, 2);
  assert.match(host.stderr, /toolkit import was not run/);
  assert.equal(askFirstCommand('hindsight', ['service', 'start']), 'hindsight service start');
  assert.equal(askFirstCommand('hindsight', ['service', 'status']), null);
  assert.equal(askFirstCommand('memory', ['find', 'x']), null);
  // Other commands still take a leading flag.
  const version = await tk(root, ['--json', 'version'], { env });
  assert.equal(version.code, 0);
  const list = await tk(root, ['--json', 'memory', 'list'], { env });
  assert.equal(list.code, 0, list.stderr);
});

// ------------------------------------------------------------------ the secret check

test('the secret check lets harmless text through and still refuses real secrets', () => {
  assert.equal(secretKind('The login form has a password: field and a username field.'), null);
  assert.equal(secretKind('Password: required'), null);
  assert.equal(secretKind('API key: ~/.config/app/credentials.json'), null);
  assert.equal(secretKind('API key: config/secrets/app-credentials'), null);
  assert.equal(secretKind('The token is in STAGING_API_TOKEN_VALUE'), null);
  assert.equal(secretKind('The password is stored in 1Password under Staging'), null);
  assert.equal(secretKind('password: hunter2'), 'a password');
  assert.equal(secretKind('the admin password is hunter2'), 'a password');
  assert.equal(secretKind('password=S3cret!'), 'a password');
  assert.equal(secretKind('api_key=AbCdEfGhIjKlMnOpQrStUvWx12'), 'an API key or token');
  assert.equal(secretKind('secret: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'), 'an API key or token');
  assert.equal(secretKind('the staging key is sk-ant-api03-AbCdEfGhIjKlMnOpQrStUv'), 'an API key (sk-...)');
});

// ------------------------------------------------------------------ backups

test('two clones of one project back up to separate folders on the same day', async () => {
  const home = makeHome();
  const a = await initProject({ home, key: 'shared-app', extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  const b = await initProject({ home, key: 'shared-app', extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  const ra = await tk(a.root, ['handoff-backup', '--json'], { env: a.env });
  const rb = await tk(b.root, ['handoff-backup', '--json'], { env: b.env });
  assert.equal(ra.code, 0, ra.stdout + ra.stderr);
  assert.equal(rb.code, 0, rb.stdout + rb.stderr);
  assert.equal(path.basename(ra.json.dir), `shared-app-${a.env.TOOLKIT_TODAY}`);
  assert.notEqual(rb.json.dir, ra.json.dir);
  assert.match(path.basename(rb.json.dir), new RegExp(`^shared-app-${a.env.TOOLKIT_TODAY}-[0-9a-f]{8}$`));
  assert.equal(JSON.parse(read(path.join(ra.json.dir, 'toolkit-export.json'))).from, a.root);
  assert.equal(JSON.parse(read(path.join(rb.json.dir, 'toolkit-export.json'))).from, b.root);
  // The first clone again: still its own folder.
  const again = await tk(a.root, ['handoff-backup', '--json'], { env: a.env });
  assert.equal(again.json.dir, ra.json.dir);
});

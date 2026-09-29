// Project fixes from the round 3 sample runs, the Claude Code run claude-a,
// and the Codex setup run:
// - init writes "attribution" (no AI credit) and skillListingBudgetFraction
//   0.02 into .claude/settings.json, and doctor checks both;
// - doctor exits 0 when only warnings for the other host remain;
// - doctor warns when ~/.codex/config.toml turns the V2 plugins on for every
//   folder or Codex runs an older toolkit copy, and machine-setup switches the
//   plugins off again;
// - doctor names a project still on the older single Notion Memory database;
// - the briefing lists saved memory proposals, and says which setup steps in
//   the current focus are done.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, makeHome, read, testEnv, tk } from './helpers.mjs';
import { fixture } from '../hooks/fixtures.mjs';
import { compareVersions, hidesAttribution } from '../../lib/project/checks.mjs';
import { doneSetupReminders } from '../../lib/project/brief.mjs';
import { otherHost } from '../../lib/commands/doctor.mjs';
import { TRAILER } from '../credit-lines.mjs';

after(cleanup);

/** A home that trusts the project in Codex, trusts the toolkit hooks, and has the wrapper and pointer. */
async function healthyHome(root, { codexLines = [] } = {}) {
  const home = makeHome({ trust: [root], hookTrust: ['toolkit@toolkit-v2:hooks/codex-hooks.json:session_start:0:0'] });
  if (codexLines.length) fs.appendFileSync(path.join(home, '.codex', 'config.toml'), `${codexLines.join('\n')}\n`);
  const env = testEnv(home, { PATH: `${path.join(home, '.local', 'bin')}${path.delimiter}${process.env.PATH}` });
  const res = await tk(root, ['machine-setup', '--offline'], { env });
  assert.equal(res.code, 0, res.stdout + res.stderr);
  return { env, home };
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

test('hidesAttribution and compareVersions', () => {
  assert.equal(hidesAttribution({ commit: '', pr: '' }), true);
  assert.equal(hidesAttribution({ commit: '', pr: '', sessionUrl: false }), true);
  assert.equal(hidesAttribution(false), true);
  assert.equal(hidesAttribution(undefined), false);
  assert.equal(hidesAttribution({ commit: 'Co-Authored-By: AI <ai@example.com>', pr: '' }), false);
  assert.equal(compareVersions('0.2.0', '0.10.1'), -1);
  assert.equal(compareVersions('0.2.3', '0.2.3'), 0);
  assert.equal(compareVersions('1.0.0', '0.9.9'), 1);
});

test('init writes the attribution and skill list settings, and doctor checks them', async () => {
  const { root } = await initProject({ extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  const settingsFile = path.join(root, '.claude', 'settings.json');
  const settings = JSON.parse(read(settingsFile));
  assert.deepEqual(settings.attribution, { commit: '', pr: '', sessionUrl: false });
  assert.equal(settings.skillListingBudgetFraction, 0.02);
  const { env } = await healthyHome(root);
  const clean = await tk(root, ['doctor', '--json'], { env });
  assert.equal(clean.code, 0, JSON.stringify(clean.json.findings, null, 2));

  delete settings.attribution;
  settings.skillListingBudgetFraction = 0.01;
  writeJson(settingsFile, settings);
  const res = await tk(root, ['doctor', '--json'], { env });
  assert.equal(res.code, 1);
  const byId = Object.fromEntries(res.json.findings.map((f) => [f.id, f]));
  assert.equal(byId['claude-attribution'].severity, 'problem');
  assert.match(byId['claude-attribution'].message, /has no "attribution" setting, so Claude Code adds a Co-Authored-By line/);
  assert.match(byId['claude-attribution'].fix, /"attribution": \{"commit": "", "pr": "", "sessionUrl": false\}/);
  assert.equal(byId['claude-skill-budget'].severity, 'warning');
  // The briefing shows it too, so the next session fixes it.
  const brief = await tk(root, ['brief', '--host', 'claude'], { env });
  assert.match(brief.stdout, /Setup warnings[^\n]*\n(- [^\n]*\n)*- \.claude\/settings\.json has no "attribution" setting/);

  // A local settings file that brings the credit back wins over the project file.
  settings.attribution = { commit: '', pr: '' };
  settings.skillListingBudgetFraction = 0.02;
  writeJson(settingsFile, settings);
  writeJson(path.join(root, '.claude', 'settings.local.json'), { attribution: { commit: TRAILER, pr: '' } });
  const local = await tk(root, ['doctor', '--json'], { env });
  const f = local.json.findings.find((x) => x.id === 'claude-attribution');
  assert.ok(f);
  assert.match(f.message, /^\.claude\/settings\.local\.json sets "attribution"/);
});

test('doctor run in Claude Code exits 0 when only the Codex trust warnings remain; run in Codex it does not', async () => {
  const { root } = await initProject({ extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  const home = makeHome();
  const env = testEnv(home, { PATH: `${path.join(home, '.local', 'bin')}${path.delimiter}${process.env.PATH}` });
  assert.equal((await tk(root, ['machine-setup', '--offline'], { env })).code, 0);
  const claude = await tk(root, ['doctor', '--host', 'claude'], { env });
  assert.equal(claude.code, 0, claude.stdout);
  assert.match(claude.stdout, /For Codex only \(2; the owner clears them in Codex, so they do not change this result\):\n- Codex does not trust this folder/);
  assert.match(claude.stdout, /Result: clean\. No problems and no warnings here \(2 for Codex only\)\./);
  const json = await tk(root, ['doctor', '--host', 'claude', '--json'], { env });
  assert.equal(json.json.ok, true);
  assert.equal(json.json.otherHost, 2);
  const codex = await tk(root, ['doctor', '--host', 'codex'], { env });
  assert.equal(codex.code, 1);
  assert.match(codex.stdout, /Result: 0 problems and 2 warnings\./);
  assert.equal(otherHost({ host: 'codex' }, 'claude'), 'codex');
  assert.equal(otherHost({ host: 'codex' }, 'codex'), null);
  assert.equal(otherHost({ host: 'codex' }, null), null, 'a terminal run counts every warning');
});

test('doctor warns when ~/.codex/config.toml turns the V2 plugins other than toolkit on for every folder; machine-setup switches them off, turns toolkit on, and keeps the rest', async () => {
  const { root } = await initProject();
  const codexLines = ['', '[plugins."toolkit@toolkit-v2"]', 'enabled = false', '', '[plugins."work@toolkit-v2"]', 'enabled = true', '', '[plugins."session-skills@toolkit-v2"]', 'enabled = true', '', '[plugins."memory@toolkit-v2"]', 'enabled = false'];
  const home = makeHome({ trust: [root], hookTrust: ['toolkit@toolkit-v2:hooks/codex-hooks.json:session_start:0:0'] });
  fs.appendFileSync(path.join(home, '.codex', 'config.toml'), `${codexLines.join('\n')}\n`);
  // Codex has a copy of the toolkit plugin, so machine-setup turns it on for every folder (decision 10).
  fs.mkdirSync(path.join(home, '.codex', 'plugins', 'cache', 'toolkit-v2', 'toolkit', '0.2.4'), { recursive: true });
  const env = testEnv(home, { PATH: `${path.join(home, '.local', 'bin')}${path.delimiter}${process.env.PATH}` });
  const before = await tk(root, ['doctor', '--json'], { env });
  const warn = before.json.findings.find((f) => f.id === 'codex-plugins-everywhere');
  assert.ok(warn, 'doctor warns');
  assert.match(warn.message, /on for every folder: work@toolkit-v2, session-skills@toolkit-v2\./, 'toolkit itself is meant to be on everywhere');
  assert.match(warn.fix, /toolkit machine-setup/);

  const configFile = path.join(home, '.codex', 'config.toml');
  const text = read(configFile);
  const setup = await tk(root, ['machine-setup', '--offline'], { env });
  assert.equal(setup.code, 0, setup.stdout + setup.stderr);
  assert.match(setup.stdout, /Switched off for every Codex folder in .*config\.toml \(codex plugin add had turned them on\): work@toolkit-v2, session-skills@toolkit-v2\./);
  assert.match(setup.stdout, /Switched on for every Codex folder in .*config\.toml: toolkit@toolkit-v2\./);
  assert.match(setup.stdout, /Codex: the toolkit plugin is on for every folder/);
  const after = read(configFile);
  const want = text
    .replace(/(\[plugins\."(?:work|session-skills)@toolkit-v2"\]\n)enabled = true/g, '$1enabled = false')
    .replace(/(\[plugins\."toolkit@toolkit-v2"\]\n)enabled = false/, '$1enabled = true');
  assert.equal(after, want, 'only the three switches changed');
  const again = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!again.json.findings.some((f) => f.id === 'codex-plugins-everywhere'));
  const second = await tk(root, ['machine-setup', '--offline'], { env });
  assert.doesNotMatch(second.stdout, /Switched (off|on)/, 'a second run changes nothing');
});

test('doctor warns when Codex runs an older copy of the toolkit', async () => {
  const { root } = await initProject();
  const { env, home } = await healthyHome(root);
  fs.mkdirSync(path.join(home, '.codex', 'plugins', 'cache', 'toolkit-v2', 'toolkit', '0.0.1'), { recursive: true });
  const res = await tk(root, ['doctor', '--json'], { env });
  const f = res.json.findings.find((x) => x.id === 'codex-plugin-old');
  assert.ok(f, JSON.stringify(res.json.findings.map((x) => x.id)));
  assert.match(f.message, /^Codex runs toolkit 0\.0\.1, which is older than this toolkit \(\d+\.\d+\.\d+\)\./);
});

test('doctor names a project whose Notion memory is still the older single Memory database', async () => {
  const { root } = await initProject();
  const { env } = await healthyHome(root);
  const configFile = path.join(root, '.toolkit.json');
  const config = JSON.parse(read(configFile));
  config.memory.type = 'notion';
  config.notion = { memory: { dataSourceId: '11111111-1111-1111-1111-111111111111', properties: { title: 'title' } } };
  writeJson(configFile, config);
  const res = await tk(root, ['doctor', '--json'], { env: { ...env, TOOLKIT_NTN_BIN: path.join(root, 'no-such-ntn') } });
  const f = res.json.findings.find((x) => x.id === 'notion-memory-old-layout');
  assert.ok(f, JSON.stringify(res.json.findings.map((x) => x.id)));
  assert.equal(f.severity, 'problem');
  assert.match(f.message, /still in the older single Memory database/);
  assert.match(f.fix, /toolkit notion ensure-project/);
  config.notion.memory.layout = 'lore';
  writeJson(configFile, config);
  const lore = await tk(root, ['doctor', '--json'], { env: { ...env, TOOLKIT_NTN_BIN: path.join(root, 'no-such-ntn') } });
  assert.ok(!lore.json.findings.some((x) => x.id === 'notion-memory-old-layout'));
});

test('the briefing lists saved memory proposals apart from the records, as waiting on the owner', async () => {
  const { root, env } = await initProject();
  const save = (name, extra) => tk(root, ['memory', 'save', '--type', 'project', '--name', name, '--description', `The ${name} rule`, '--body', `**Remember:** The ${name} rule.\n`, ...extra], { env });
  assert.equal((await save('deploy-window', ['--approved-by', 'Mike'])).code, 0);
  assert.equal((await save('friday-freeze', ['--proposal'])).code, 0);
  const res = await tk(root, ['brief'], { env });
  assert.match(res.stdout, /Memory proposals waiting on the owner \(not facts: do not rely on them; work-decide asks him\):\n- project_friday_freeze: The friday-freeze rule \(proposed \d{4}-\d{2}-\d{2}\)/);
  assert.match(res.stdout, /Project memory \(builtin\): 1 record, and 1 proposal the owner has not answered\./);
  assert.match(res.stdout, /Memory records:\n- project_deploy_window: The deploy-window rule/);
  assert.doesNotMatch(res.stdout.split('Memory records:')[1] || '', /friday_freeze/);
});

const SETUP_FOCUS = [
  '# Current focus',
  '',
  'Last updated: 2026-09-27, setup, agent',
  '',
  '## Now',
  '',
  '- None.',
  '',
  '## Waiting on the owner',
  '',
  '- Trust this project folder in Codex when it asks.',
  '- Open /hooks in Codex and trust the Toolkit V2 hooks.',
  '- Start a new Claude Code session after setup so it loads the project settings; check at the next session.',
  '- Decide the billing currency.',
  '',
  '## Untracked to-dos',
  '',
  '- None.',
  '',
  '## Next session starts with',
  '',
  '- Ask for the first thing to build.',
  '',
].join('\n');

test('doneSetupReminders finds the setup steps that are done and nothing else', () => {
  const none = doneSetupReminders(SETUP_FOCUS, { codexFolderTrusted: false, codexHooksTrusted: false, newClaudeSession: false });
  assert.deepEqual(none, []);
  const all = doneSetupReminders(SETUP_FOCUS, { codexFolderTrusted: true, codexHooksTrusted: true, newClaudeSession: true });
  assert.deepEqual(all.map((d) => d.line), [
    'Trust this project folder in Codex when it asks.',
    'Open /hooks in Codex and trust the Toolkit V2 hooks.',
    'Start a new Claude Code session after setup so it loads the project settings; check at the next session.',
  ]);
  assert.deepEqual(doneSetupReminders('', { codexFolderTrusted: true }), []);
});

test('the briefing says which setup steps in the current focus are done, so they are not copied forward', async () => {
  const { root } = await initProject();
  const { env } = await healthyHome(root);
  assert.equal((await tk(root, ['memory', 'focus', '--text', SETUP_FOCUS], { env })).code, 0);
  const brief = await tk(root, ['brief', '--host', 'claude'], { env });
  assert.match(brief.stdout, /Setup steps in the current focus that are done now\. They are not copied forward: take them out of "Waiting on the owner" at the next focus update:\n- "Trust this project folder in Codex when it asks\.": Codex lists this project folder as trusted\.\n- "Open \/hooks in Codex and trust the Toolkit V2 hooks\.": Codex lists the Toolkit V2 hooks as trusted\./);
  assert.doesNotMatch(brief.stdout, /"Start a new Claude Code session[^\n]*": a new Claude Code session/, 'toolkit brief is not a new session');
  assert.doesNotMatch(brief.stdout, /Decide the billing currency\.":/);
  // A Claude Code session-start hook is a new session after setup.
  const hook = await tk(root, ['hook', 'session-start', '--host', 'claude'], { env, stdin: JSON.stringify(fixture('claude', 'session-start.startup', { CWD: root, SESSION: 'r3-start' })) });
  assert.equal(hook.code, 0);
  assert.match(hook.json.hookSpecificOutput.additionalContext, /- "Start a new Claude Code session after setup so it loads the project settings; check at the next session\.": a new Claude Code session has started since setup/);
  // A computer where Codex trusts nothing: no step is marked done.
  const bare = testEnv(makeHome());
  const plain = await tk(root, ['brief', '--host', 'claude'], { env: bare });
  assert.doesNotMatch(plain.stdout, /Setup steps in the current focus that are done now/);
});

test('the briefing names toolkit memory focus --text for a focus that is still the template', async () => {
  const { root, env } = await initProject();
  const res = await tk(root, ['brief'], { env });
  assert.match(res.stdout, /Current focus: still the empty template from setup\. The memory-save skill fills it with toolkit memory focus --text '<text>'\./);
});

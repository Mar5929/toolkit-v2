// The CLI fixes from the final independent review (dev/final-review.md) and
// the confirmation runs of 2026-09-28:
// - I4 / decision 12: the risky toolkit commands ask first in both hosts;
// - I6: the duplicate check catches a reworded copy (the confirm-d pair);
// - I8 / decision 13: the backup folder, the automatic backups at work finish
//   and handoff, and the doctor checks;
// - M2: a secret is never saved to memory;
// - confirm-a 2, 3, 4, 9: owner quotes without an apostrophe, the retitle
//   and stage-back notes, and a design approved before it was filled.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { cleanup, initProject, read, tempDir, tk, PLUGIN_ROOT } from './helpers.mjs';
import { TOOLKIT_ASK_RULES } from '../../lib/project/checks.mjs';
import { compareRecords, stem } from '../../lib/memory/similar.mjs';
import { secretKind } from '../../lib/memory/contract.mjs';
import { quotesOwner } from '../../lib/work/ops.mjs';
import { parseBackupDir, backupTarget } from '../../lib/project/backup.mjs';

after(cleanup);

const RULES = path.join(PLUGIN_ROOT, 'templates', 'codex', 'toolkit.rules');
const SETTINGS = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, 'templates', 'settings', 'claude-toolkit.json'), 'utf8'));

// ------------------------------------------------------------------ I4: ask first

test('Claude Code: the settings fragment asks before the risky toolkit commands, init installs it, and doctor checks it', async () => {
  assert.deepEqual(SETTINGS.permissions.ask, [...TOOLKIT_ASK_RULES]);
  assert.deepEqual(SETTINGS.permissions.allow, ['Bash(toolkit *)'], 'every other toolkit command still runs without a prompt (ask is checked before allow)');
  const { root, env } = await initProject();
  const settingsFile = path.join(root, '.claude', 'settings.json');
  const settings = JSON.parse(read(settingsFile));
  for (const r of TOOLKIT_ASK_RULES) assert.ok(settings.permissions.ask.includes(r), r);
  assert.ok(settings.permissions.ask.includes('Bash(git reset --hard *)'), 'the model\'s own ask rules stay');
  let res = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!res.json.findings.some((f) => f.id === 'claude-ask-rules'));
  settings.permissions.ask = settings.permissions.ask.filter((r) => !r.includes('memory delete'));
  fs.writeFileSync(settingsFile, `${JSON.stringify(settings, null, 2)}\n`);
  res = await tk(root, ['doctor', '--json'], { env });
  const f = res.json.findings.find((x) => x.id === 'claude-ask-rules');
  assert.ok(f);
  assert.match(f.message, /Bash\(toolkit memory delete \*\)/);
  assert.match(f.fix, /toolkit sync/);
});

test('Codex: the command rules prompt before the risky toolkit commands, ahead of the general allow', () => {
  const text = read(RULES);
  const allowAt = text.indexOf('pattern = ["toolkit"],');
  for (const p of ['["toolkit", "machine-setup"]', '["toolkit", "memory", ["delete", "import"]]', '["toolkit", "import"]', '["toolkit", "hindsight", "service", ["install", "start"]]']) {
    const at = text.indexOf(`pattern = ${p}`);
    assert.ok(at > 0 && at < allowAt, `${p} comes before the general allow`);
  }
  assert.equal((text.match(/decision = "prompt"/g) || []).length, 7, 'four toolkit prompt rules and three Git ones');
});

const codex = spawnSync('codex', ['--version'], { encoding: 'utf8' });
test('Codex execpolicy: the risky commands prompt and the others are allowed', { skip: codex.status === 0 ? false : 'the codex command is not installed' }, () => {
  const decide = (...words) => {
    const res = spawnSync('codex', ['execpolicy', 'check', '--rules', RULES, ...words], { encoding: 'utf8', cwd: tempDir(), env: { ...process.env, CODEX_HOME: tempDir('tk-codex-home-') } });
    assert.equal(res.status, 0, res.stderr);
    return JSON.parse(res.stdout).decision;
  };
  assert.equal(decide('toolkit', 'machine-setup'), 'prompt');
  assert.equal(decide('toolkit', 'machine-setup', '--offline'), 'prompt');
  assert.equal(decide('toolkit', 'memory', 'delete', 'project_x', '--owner-approved'), 'prompt');
  assert.equal(decide('toolkit', 'memory', 'import', '--from', 'backup'), 'prompt');
  assert.equal(decide('toolkit', 'import', '--from', 'backup'), 'prompt');
  assert.equal(decide('toolkit', 'hindsight', 'service', 'install'), 'prompt');
  assert.equal(decide('toolkit', 'hindsight', 'service', 'start'), 'prompt');
  assert.equal(decide('toolkit', 'hindsight', 'service', 'status'), 'allow');
  assert.equal(decide('toolkit', 'work', 'list'), 'allow');
  assert.equal(decide('toolkit', 'memory', 'save', '--type', 'project'), 'allow');
  assert.equal(decide('toolkit', 'export', '--to', 'backup'), 'allow');
});

// ------------------------------------------------------------------ I6: reworded copies

test('the duplicate check compares stems and one-meaning words: the confirm-d pair is similar', async () => {
  assert.equal(stem('documented'), stem('document'));
  assert.equal(stem('flags'), 'flag');
  assert.equal(stem('explained'), stem('explain'));
  assert.equal(stem('every'), stem('each'));
  const older = { description: 'Document every command-line flag in the README', body: '# Flags\n\n**Remember:** Mike prefers every command-line flag to be documented in the README.\n' };
  const reworded = { description: 'Explain each command-line flag in the README file', body: '# Flags\n\n**Remember:** Mike wants each command-line flag explained in the README file.\n' };
  const cmp = compareRecords(older, reworded);
  assert.equal(cmp.similar, true, JSON.stringify(cmp));
  assert.equal(compareRecords({ description: 'The app uses Node 20' }, { description: 'The app uses Postgres 16' }).similar, false, 'a different fact is still different');

  const { root, env } = await initProject();
  const save = (name, description, point, extra = []) => tk(root, ['memory', 'save', '--type', 'user', '--name', name, '--description', description, '--body', `# ${description}\n\n**Remember:** ${point}\n`, '--approved-by', 'Mike', ...extra], { env });
  assert.equal((await save('document-cli-flags-in-readme', older.description, 'Mike prefers every command-line flag to be documented in the README.')).code, 0);
  const again = await save('explain-each-cli-flag-in-readme', reworded.description, 'Mike wants each command-line flag explained in the README file.');
  assert.equal(again.code, 2, again.stdout);
  assert.match(again.stderr, /user_document_cli_flags_in_readme/);
  assert.ok(!fs.existsSync(path.join(root, '.memory', 'user_explain_each_cli_flag_in_readme.md')));
  // The first search hit with many shared words counts too, even below the 0.6 cut-off.
  const topHit = await save('cli-flags-need-readme-notes', 'Every CLI flag needs README notes', 'Mike wants a README note for every command-line flag he adds.');
  assert.equal(topHit.code, 2, topHit.stdout);
  assert.match(topHit.stderr, /user_document_cli_flags_in_readme/);
});

// ------------------------------------------------------------------ M2: secrets

test('memory refuses a secret in the description, source, or body, and never repeats it', async () => {
  assert.equal(secretKind('the staging key is sk-ant-api03-AbCdEfGhIjKlMnOpQrStUv'), 'an API key (sk-...)');
  assert.equal(secretKind('the admin password is hunter2'), 'a password');
  assert.equal(secretKind('The password is stored in 1Password under Staging'), null);
  assert.equal(secretKind('ghp_abcdefghijklmnopqrstuvwxyz0123456789'), 'a GitHub token');
  assert.equal(secretKind('-----BEGIN OPENSSH PRIVATE KEY-----'), 'a private key');
  const { root, env } = await initProject();
  const res = await tk(root, ['memory', 'save', '--type', 'reference', '--name', 'staging-api-key', '--description', 'The staging API key', '--body', 'Remember: the staging key is sk-ant-api03-AbCdEfGhIjKlMnOpQrStUv and the admin password is hunter2', '--approved-by', 'Mike'], { env });
  assert.equal(res.code, 2);
  assert.match(res.stderr, /Body looks like it holds an API key \(sk-\.\.\.\)\. Secrets never go in memory/);
  assert.doesNotMatch(res.stderr, /AbCdEfGh|hunter2/, 'the secret is not printed');
  assert.ok(!fs.existsSync(path.join(root, '.memory', 'reference_staging_api_key.md')));
  const ok = await tk(root, ['memory', 'save', '--type', 'reference', '--name', 'staging-api-key', '--description', 'Where the staging API key is kept', '--body', 'Remember: the staging key is in 1Password under Staging.', '--approved-by', 'Mike'], { env });
  assert.equal(ok.code, 0, ok.stderr);
});

// ------------------------------------------------------------------ I8: backups

test('init --backup-dir and config set backup.dir take a full path outside the project, or none', async () => {
  const { root, env } = await initProject({ extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  assert.deepEqual(JSON.parse(read(path.join(root, '.toolkit.json'))).backup, { dir: '~/Backups/toolkit' });
  const inside = await tk(root, ['config', 'set', 'backup.dir', path.join(root, 'backups')], { env });
  assert.equal(inside.code, 2);
  assert.match(inside.stderr, /is inside the project/);
  const relative = await tk(root, ['config', 'set', 'backup.dir', 'backups'], { env });
  assert.equal(relative.code, 2);
  assert.match(relative.stderr, /is not a full path/);
  assert.equal((await tk(root, ['config', 'set', 'backup.dir', 'none'], { env })).code, 0);
  assert.equal(JSON.parse(read(path.join(root, '.toolkit.json'))).backup.dir, 'none');
  assert.equal(parseBackupDir('/Volumes/Backup/toolkit', { root }), '/Volumes/Backup/toolkit');
  const fresh = await initProject();
  assert.match(fresh.res.stdout, /Ask the owner for a backup folder outside the project/, 'init without a backup folder says to ask for one');
  assert.equal(JSON.parse(read(path.join(fresh.root, '.toolkit.json'))).backup, undefined);
});

test('toolkit work finish and toolkit handoff-backup back up .work-items/ and .memory/ to today\'s folder; with no folder they say how to set one', async () => {
  const { root, env, home } = await initProject();
  // No folder set: handoff-backup changes nothing and says how.
  let res = await tk(root, ['handoff-backup'], { env });
  assert.equal(res.code, 0);
  assert.match(res.stdout, /No backup folder is set, so \.work-items\/ and \.memory\/ were not backed up\. Ask the owner for a folder outside the project/);

  assert.equal((await tk(root, ['config', 'set', 'backup.dir', '~/Backups/toolkit'], { env })).code, 0);
  res = await tk(root, ['handoff-backup', '--json'], { env });
  assert.equal(res.code, 0, res.stdout + res.stderr);
  const project = { root, mainRoot: root, config: JSON.parse(read(path.join(root, '.toolkit.json'))) };
  const target = backupTarget(project, path.join(home, 'Backups', 'toolkit'), env.TOOLKIT_TODAY);
  assert.equal(res.json.dir, target);
  assert.equal(path.basename(target), `acme-crm-${env.TOOLKIT_TODAY}`);
  assert.ok(fs.existsSync(path.join(target, 'toolkit-export.json')));
  assert.ok(fs.existsSync(path.join(target, 'work-items', '.toolkit-state.json')));
  assert.ok(fs.existsSync(path.join(target, 'memory', 'CURRENT_FOCUS.md')));

  // A finished item is backed up at once.
  await tk(root, ['work', 'new', '--title', 'Tidy the README', '--type', 'task'], { env });
  fs.rmSync(target, { recursive: true, force: true });
  res = await tk(root, ['work', 'finish', 'WI-001', '--by', 'Mike', '--evidence', 'README tidied.', '--quote', 'Looks good, ship it.', '--json'], { env });
  assert.equal(res.code, 0, res.stdout + res.stderr);
  assert.equal(res.json.backup.status, 'done');
  assert.ok(fs.existsSync(path.join(target, 'work-items')));
  const text = await tk(root, ['work', 'show', 'WI-001'], { env });
  assert.equal(text.code, 0);
  const doctor = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!doctor.json.findings.some((f) => /^backup-/.test(f.id)), JSON.stringify(doctor.json.findings.filter((f) => /^backup-/.test(f.id))));

  // The owner chose none: nothing happens and nothing is said.
  await tk(root, ['config', 'set', 'backup.dir', 'none'], { env });
  res = await tk(root, ['handoff-backup', '--json'], { env });
  assert.equal(res.json.status, 'declined');
});

test('an export never writes over another project\'s export', async () => {
  const a = await initProject({ name: 'Alpha' });
  const b = await initProject({ name: 'Beta' });
  const shared = path.join(tempDir(), 'same-folder');
  assert.equal((await tk(a.root, ['export', '--to', shared], { env: a.env })).code, 0);
  const res = await tk(b.root, ['export', '--to', shared], { env: b.env });
  assert.equal(res.code, 2);
  assert.match(res.stderr, /holds an export of another project \(alpha\)/);
});

// ------------------------------------------------------------------ confirm-a

test('a history note quoting the owner without an apostrophe still ends the wait on him', () => {
  for (const note of ["Owner's words: yes", 'Owner’s words: yes', 'Owner words: yes', 'Owner said: yes', 'Mike said: yes', 'Mike: yes', 'Mike’s words: yes']) {
    assert.equal(quotesOwner(note, 'Mike'), true, note);
  }
  assert.equal(quotesOwner('Tests pass.', 'Mike'), false);
  assert.equal(quotesOwner('Mike said: yes', null), false, 'a name counts only when it is the owner\'s');
});

test('work set --title tells the agent to tell the owner; a stage moved back before 03 names the approval that stays', async () => {
  const { root, env } = await initProject();
  await tk(root, ['work', 'new', '--title', 'Build the tally CLI', '--type', 'task'], { env });
  let res = await tk(root, ['work', 'set', 'WI-001', '--title', 'Build tally word count CLI'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /Tell the owner in the reply: WI-001 is now called "Build tally word count CLI" \(was "Build the tally CLI"\), and its folder is now /);
  await tk(root, ['work', 'edit', 'WI-001', '--section', 'Agreed goal', '--text', 'Count words.'], { env });
  assert.equal((await tk(root, ['work', 'approve', 'WI-001', '--requirements', '--by', 'Mike'], { env })).code, 0);
  res = await tk(root, ['work', 'set', 'WI-001', '--stage', '02-refinement', '--note', 'A new line-count case came up.'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /WI-001 is back at 02 .* with a recorded requirements approval .* ask the owner again and record his answer with toolkit work approve WI-001 --requirements --by <name>\./);
});

// ------------------------------------------------------------------ skill rules the CLI and hooks now enforce

test('a memory save with no approver in onboarding mode says to ask first; with --approved-by or --proposal it does not', async () => {
  const { root, env } = await initProject();
  const facts = { alpha: 'Deploys wait for the Friday window', gamma: 'Invoices are sent on the first of the month', delta: 'The staging database is refreshed nightly' };
  const save = (name, extra) => tk(root, ['memory', 'save', '--type', 'project', '--name', name, '--description', facts[name], '--body', `Remember: ${facts[name]}.`, ...extra, '--json'], { env });
  let res = await save('alpha', []);
  assert.equal(res.code, 0, res.stderr);
  assert.equal(res.json.unapproved, true);
  const text = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'beta', '--description', 'The support inbox is checked twice a day', '--body', 'Remember: the support inbox is checked twice a day.'], { env });
  assert.match(text.stdout, /Note: project_beta was saved with no approval recorded\. Memory is in onboarding mode, so the owner is asked first/);
  res = await save('gamma', ['--approved-by', 'Mike']);
  assert.equal(res.code, 0, res.stderr);
  assert.equal(res.json.unapproved, false);
  res = await save('delta', ['--proposal']);
  assert.equal(res.code, 0, res.stderr);
  assert.equal(res.json.unapproved, false);
});

test('git add -f of .work-items/ or .memory/ is refused in a Toolkit V2 project', async () => {
  const { checkGit } = await import('../../lib/hooks/shell.mjs');
  assert.equal(checkGit('git add -f .memory/user_x.md').rule, 'git-add-ignored-data');
  assert.equal(checkGit('git add --force .work-items/WI-001-x/WORK-ITEM.md').rule, 'git-add-ignored-data');
  assert.equal(checkGit('git add -f plugins/toolkit/scaffold/model/.memory/AGENTS.md'), null, 'the toolkit repository\'s own scaffold copy');
  assert.equal(checkGit('git add .memory-notes.md'), null);
  assert.equal(checkGit('git add -f build/output.txt'), null);
});

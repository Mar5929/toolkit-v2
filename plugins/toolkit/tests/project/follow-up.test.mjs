// The follow-up pass of 2026-09-28 (dev/PROGRESS.md "For the follow-up
// pass", the open items of the skill-references and review-fixes workflows,
// and dev/final-review.md):
// - a hook failure in hook-errors.log shows in toolkit doctor and the briefing;
// - a focus line that names several setup steps is done only when all are,
//   and the hooks count as trusted only when Codex lists them as trusted;
// - a hook-delivered Codex briefing words the hook-trust finding truthfully;
// - the automatic backup never replaces a larger backup of the same day;
// - a non-Salesforce project's rules table names no Salesforce path (M5);
// - toolkit memory approve finishes a proposal the Stop hook saved;
// - CLI fix lines use 'Owner said:', single quotes, and --scope user.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, git, initProject, makeHome, makeRepo, read, testEnv, tk, tkProcess } from './helpers.mjs';
import { fixture } from '../hooks/fixtures.mjs';
import { doneSetupReminders, HOOK_RAN_UNTRUSTED } from '../../lib/project/brief.mjs';
import { parseHookErrors, HOOK_ERRORS_DAYS } from '../../lib/project/checks.mjs';
import { approvedProposalBody } from '../../lib/memory/proposals.mjs';
import { proposalBody } from '../../lib/hooks/proposal.mjs';
import { claudeMachineWideLine } from '../../lib/project/machine.mjs';

after(cleanup);

function hookErrorsFile(root) {
  return path.join(git(root, ['rev-parse', '--path-format=absolute', '--git-common-dir']), 'toolkit-v2', 'hook-errors.log');
}

// ------------------------------------------------------------------ hook failures

test('a failed hook is written to hook-errors.log, and doctor and the briefing report it until it is old', async () => {
  const { root, env } = await initProject();
  // A hook given input that is not JSON fails, exits 0, prints nothing, and logs the error.
  const res = tkProcess(root, ['hook', 'stop', '--host', 'claude'], { env, input: '{ not json' });
  assert.equal(res.code, 0);
  assert.equal(res.stdout, '');
  const file = hookErrorsFile(root);
  const entries = parseHookErrors(read(file));
  assert.equal(entries.length, 1);
  assert.equal(entries[0].event, 'stop');

  const doctor = await tk(root, ['doctor', '--json'], { env });
  const f = doctor.json.findings.find((x) => x.id === 'hook-errors');
  assert.ok(f, 'doctor reports the failure');
  assert.equal(f.severity, 'warning');
  assert.match(f.message, /^A Toolkit V2 hook failed once in the last 3 days \(stop\)\. The last failure, stop at \d{4}-\d{2}-\d{2}T[\d:.]+Z: SyntaxError/);
  assert.match(f.message, /A failed hook stops nothing and prints nothing/);
  assert.ok(f.fix.includes(file), 'the fix names the log file');

  const brief = await tk(root, ['brief', '--host', 'claude'], { env });
  assert.match(brief.stdout, /Setup warnings[^\n]*\n(?:- [^\n]*\n)*- A Toolkit V2 hook failed once/);
  const hookBrief = await tk(root, ['hook', 'session-start', '--host', 'codex'], { env, stdin: JSON.stringify(fixture('codex', 'session-start.startup', { CWD: root, SESSION: 'err-1' })) });
  assert.match(hookBrief.json.hookSpecificOutput.additionalContext, /A Toolkit V2 hook failed once/);

  // A failure older than the window is not reported.
  const old = new Date(Date.now() - (HOOK_ERRORS_DAYS + 1) * 24 * 60 * 60 * 1000).toISOString();
  fs.writeFileSync(file, `${old} user-prompt: Error: an old failure\n    at somewhere (file.mjs:1:1)\n`);
  const later = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!later.json.findings.some((x) => x.id === 'hook-errors'));
});

test('parseHookErrors reads each entry and skips its stack lines', () => {
  const text = [
    '2026-09-28T10:00:00.000Z pre-tool: TypeError: x is not a function',
    '    at preTool (lib/hooks/pre-tool.mjs:10:5)',
    'garbage line',
    '2026-09-28T11:30:00Z session-start: Error: boom',
    '',
  ].join('\n');
  assert.deepEqual(parseHookErrors(text).map((e) => [e.event, e.first]), [['pre-tool', 'TypeError: x is not a function'], ['session-start', 'Error: boom']]);
  assert.deepEqual(parseHookErrors(''), []);
});

// ------------------------------------------------------------------ setup reminders

const FOCUS = [
  '# Current focus',
  '',
  'Last updated: 2026-09-28',
  '',
  '## Now',
  '',
  '- Setup is done.',
  '',
  '## Waiting on the owner',
  '',
  '- Trust this project folder and the Toolkit V2 hooks, including the two Salesforce guards, in Codex /hooks; setup step, drop when doctor stops reporting it.',
  '- Open /hooks in Codex and trust the Toolkit V2 hooks.',
  '- Trust the two Salesforce guards in Codex /hooks.',
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

test('a focus line that names several setup steps is done only when every one of them is done', () => {
  const lines = (facts) => doneSetupReminders(FOCUS, facts).map((d) => d.line.split(' ').slice(0, 5).join(' '));
  // Sample run confirm-b, bug 1: the Toolkit V2 hooks alone never mark the combined line done.
  assert.deepEqual(lines({ codexFolderTrusted: false, codexHooksTrusted: true, codexSfGuardsTrusted: false }), ['Open /hooks in Codex and']);
  assert.deepEqual(lines({ codexFolderTrusted: true, codexHooksTrusted: true, codexSfGuardsTrusted: false }), ['Open /hooks in Codex and']);
  assert.deepEqual(lines({ codexFolderTrusted: false, codexHooksTrusted: false, codexSfGuardsTrusted: true }), ['Trust the two Salesforce guards']);
  const all = doneSetupReminders(FOCUS, { codexFolderTrusted: true, codexHooksTrusted: true, codexSfGuardsTrusted: true });
  assert.equal(all.length, 3);
  assert.equal(all[0].why, 'Codex lists this project folder as trusted; Codex lists the Toolkit V2 hooks as trusted; Codex lists the Salesforce org guards in .codex/hooks.json as trusted');
  assert.ok(!all.some((d) => /billing/.test(d.line)));
  // "Trust this project" names the folder step even when the same line names the hooks; "the project's hooks" does not.
  const one = (line) => FOCUS.replace('- Decide the billing currency.', `- ${line}`);
  const both = one('Trust this project in Codex and open /hooks to trust the hooks.');
  assert.ok(!doneSetupReminders(both, { codexHooksTrusted: true }).some((d) => /Trust this project in Codex/.test(d.line)));
  assert.ok(doneSetupReminders(both, { codexFolderTrusted: true, codexHooksTrusted: true }).some((d) => /Trust this project in Codex/.test(d.line)));
  assert.ok(doneSetupReminders(one("Trust the project's hooks in Codex /hooks."), { codexHooksTrusted: true }).some((d) => /project's hooks/.test(d.line)));
});

test('a Codex hook that ran with no trust entry does not mark the hooks step done, and the briefing says why the hook ran', async () => {
  const { root, env } = await initProject();
  assert.equal((await tk(root, ['memory', 'focus', '--text', FOCUS], { env })).code, 0);
  // The state of codex --dangerously-bypass-hook-trust: the hook runs, and config.toml trusts nothing.
  const run = await tk(root, ['hook', 'session-start', '--host', 'codex'], { env, stdin: JSON.stringify(fixture('codex', 'session-start.startup', { CWD: root, SESSION: 'bypass-1' })) });
  const text = run.json.hookSpecificOutput.additionalContext;
  assert.doesNotMatch(text, /Setup steps in the current focus that are done now/, 'nothing is done');
  assert.ok(text.includes(HOOK_RAN_UNTRUSTED), 'the hook-trust finding says the hook ran untrusted');
  assert.doesNotMatch(text, /hooks are not trusted in Codex yet, so Codex skips them/);

  // With the trust entry Codex writes after /hooks, the hooks step is done, worded as what the toolkit read.
  const home = makeHome({ trust: [root], hookTrust: ['toolkit@toolkit-v2:hooks/codex-hooks.json:session_start:0:0'] });
  const trusted = testEnv(home);
  const run2 = await tk(root, ['hook', 'session-start', '--host', 'codex'], { env: trusted, stdin: JSON.stringify(fixture('codex', 'session-start.startup', { CWD: root, SESSION: 'bypass-2' })) });
  const text2 = run2.json.hookSpecificOutput.additionalContext;
  assert.match(text2, /- "Open \/hooks in Codex and trust the Toolkit V2 hooks\.": Codex lists the Toolkit V2 hooks as trusted\./);
  assert.doesNotMatch(text2, /"Trust this project folder and the Toolkit V2 hooks, including the two Salesforce guards/, 'the Salesforce guards are not trusted');
  assert.ok(!text2.includes(HOOK_RAN_UNTRUSTED));
});

// ------------------------------------------------------------------ backups

test('the automatic backup never replaces a larger backup of the same day: it writes a new folder and keeps the earlier one', async () => {
  const { root, env, home } = await initProject({ extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  for (const title of ['Login page', 'Export button']) assert.equal((await tk(root, ['work', 'new', '--title', title], { env })).code, 0);
  const first = await tk(root, ['handoff-backup', '--json'], { env });
  assert.equal(first.code, 0, first.stdout + first.stderr);
  const day = first.json.dir;
  const items = (dir) => fs.readdirSync(path.join(dir, 'work-items'), { recursive: true }).filter((n) => n.endsWith('WORK-ITEM.md') && !n.startsWith('work-item-template'));
  assert.equal(items(day).length, 2);

  // The same project on a new computer, or a fresh clone: fewer files than today's backup.
  const shown = (await tk(root, ['work', 'show', 'WI-002', '--path'], { env })).stdout.trim();
  fs.rmSync(path.dirname(shown), { recursive: true, force: true });
  const second = await tk(root, ['handoff-backup'], { env });
  assert.equal(second.code, 0, second.stdout + second.stderr);
  assert.match(second.stdout, new RegExp(`to ${day.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d{6}\\. Today's earlier backup in ${day.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} holds more files than the project has now, so it was kept as it was\\.`));
  assert.equal(items(day).length, 2, 'the earlier backup keeps both items');
  assert.equal(fs.readdirSync(path.join(home, 'Backups', 'toolkit')).length, 2);
});

test('the backup leaves out the Obsidian settings folder in .memory/', async () => {
  const { root, env } = await initProject({ extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  fs.mkdirSync(path.join(root, '.memory', '.obsidian'), { recursive: true });
  fs.writeFileSync(path.join(root, '.memory', '.obsidian', 'workspace.json'), '{}\n');
  const res = await tk(root, ['handoff-backup', '--json'], { env });
  assert.equal(res.code, 0, res.stdout + res.stderr);
  assert.ok(fs.existsSync(path.join(res.json.dir, 'memory')));
  assert.ok(!fs.existsSync(path.join(res.json.dir, 'memory', '.obsidian')));
});

// ------------------------------------------------------------------ M5: Salesforce paths

test('a project without Salesforce gets no Salesforce path in publish-project-documents.md or the AGENTS.md rules table; a Salesforce project keeps them', async () => {
  const plain = await initProject();
  const rule = read(path.join(plain.root, '.claude', 'rules', 'publish-project-documents.md'));
  assert.doesNotMatch(rule, /PERMISSIONS-RUNBOOK|delivery\/\*\*/);
  assert.match(rule, /"requirements\/\*\*"/);
  const agents = read(path.join(plain.root, 'AGENTS.md'));
  assert.doesNotMatch(agents, /PERMISSIONS-RUNBOOK|`delivery\/\*\*`/);
  const doctor = await tk(plain.root, ['doctor', '--json'], { env: plain.env });
  assert.ok(!doctor.json.findings.some((f) => /^scaffold-/.test(f.id) && f.severity !== 'note'), JSON.stringify(doctor.json.findings.filter((f) => /^scaffold-/.test(f.id))));

  const sf = await initProject({ salesforce: true });
  const sfRule = read(path.join(sf.root, '.claude', 'rules', 'publish-project-documents.md'));
  assert.match(sfRule, /tools\/permissions\/PERMISSIONS-RUNBOOK\.md/);
  assert.match(sfRule, /"delivery\/\*\*"/);
});

// ------------------------------------------------------------------ memory approve

test('toolkit memory approve finishes a proposal the Stop hook saved: the "do not rely" words go, and the evidence says who approved it', async () => {
  const body = proposalBody('Deploys happen on Tuesdays', '2026-09-28');
  const done = approvedProposalBody(body, 'Mike', '2026-09-29');
  assert.doesNotMatch(done, /Do not rely on this/);
  assert.match(done, /^\*\*How to apply:\*\* Not stated by the owner\.$/m);
  assert.match(done, /so the toolkit's Stop hook saved it as a proposal\. Mike approved it on 2026-09-29\.$/m);
  assert.equal(approvedProposalBody('# Other\n\n**Remember:** x.\n', 'Mike', '2026-09-29'), '# Other\n\n**Remember:** x.\n', 'any other body is kept');

  const { root, env } = await initProject();
  const session = 'approve-hook';
  const TURN = 'turn-a1';
  await tk(root, ['hook', 'user-prompt', '--host', 'claude'], { env, stdin: JSON.stringify(fixture('claude', 'user-prompt', { CWD: root, SESSION: session, TURN, PROMPT: 'How does it look?' })) });
  await tk(root, ['hook', 'stop', '--host', 'claude'], { env, stdin: JSON.stringify(fixture('claude', 'stop', { CWD: root, SESSION: session, TURN, MESSAGE: 'Done.\n\nSave to memory: Deploys happen on Tuesdays?' })) });
  const key = 'project_deploys_happen_tuesdays';
  assert.equal((await tk(root, ['memory', 'get', key, '--json'], { env })).json.status, 'needs-review');
  // Concept memory: the yes names the concept (verifier, 2026-09-28); the hook's proposal starts project_deploys.
  const approved = await tk(root, ['memory', 'approve', key, '--by', 'Mike', '--concept', 'project_deploys', '--title', 'Deploys'], { env });
  assert.equal(approved.code, 0, approved.stdout + approved.stderr);
  const rec = (await tk(root, ['memory', 'get', 'project_deploys', '--json'], { env })).json;
  assert.equal(rec.status, 'current');
  assert.match(rec.body, /^# Deploys\n\n## Deploys happen on Tuesdays\n\n\*\*Remember:\*\* Deploys happen on Tuesdays\./);
  assert.doesNotMatch(rec.body, /Do not rely on this/);
  assert.match(rec.body, /Mike approved it on \d{4}-\d{2}-\d{2}\./);
  assert.equal((await tk(root, ['memory', 'get', key], { env })).code, 1, 'the proposal record is gone');
});

// ------------------------------------------------------------------ CLI wording

test('CLI fix lines use "Owner said:", single quotes, and claude plugin enable --scope user', async () => {
  const { root, env } = await initProject();
  assert.equal((await tk(root, ['work', 'new', '--title', 'Card', '--type', 'build'], { env })).code, 0);
  const refused = await tk(root, ['work', 'approve', 'WI-001', '--requirements', '--by', 'Mike', '--json'], { env });
  assert.equal(refused.code, 2);
  assert.match(refused.json.error.details.fix, /--note 'Owner said: <quote>'/);
  assert.doesNotMatch(refused.json.error.details.fix, /Owner.s words/);

  const noName = await tk(makeRepo('unnamed'), ['init', '--tracker', 'local', '--memory', 'builtin'], { env });
  assert.notEqual(noName.code, 0);
  assert.match(noName.stdout + noName.stderr, /toolkit init --name '<name>'/);

  const home = makeHome();
  const cache = path.join(home, '.claude', 'plugins');
  fs.mkdirSync(cache, { recursive: true });
  fs.writeFileSync(path.join(cache, 'installed_plugins.json'), JSON.stringify({ plugins: { 'toolkit@toolkit-v2': [{ version: '0.2.6', installPath: '/nowhere', scope: 'user' }] } }));
  assert.match(claudeMachineWideLine(testEnv(home)), /claude plugin enable toolkit@toolkit-v2 --scope user \(ask the owner first\)/);
});

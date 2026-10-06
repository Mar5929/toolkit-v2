// Tests for validate-records.mjs, the hook command that checks the form of a project's records,
// for .githooks/pre-commit, and for the settings entries that run them.
// Run from the repository root: node --test dev/tests/validate-records.test.mjs
// Every run works in a temporary folder: a project copied from the starter folders, as a Git
// repository. HOME points there, so nothing on this Mac outside that folder changes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const assets = join(repo, 'plugins/toolkit/skills/project-setup/assets');
const HOOK = '.claude/hooks/validate-records.mjs';
const script = join(assets, 'every-project', HOOK);
const scratch = realpathSync(mkdtempSync(join(tmpdir(), 'tkv2-records-')));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));
const gitPath = dirname(execFileSync('which', ['git'], { encoding: 'utf8' }).trim());
const env = { HOME: scratch, PATH: `${dirname(process.execPath)}:${gitPath}:/usr/bin:/bin`, GIT_CONFIG_NOSYSTEM: '1' };
const git = (dir, ...args) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], { cwd: dir, env, encoding: 'utf8', stdio: 'pipe' });

const put = (dir, file, text) => { mkdirSync(dirname(join(dir, file)), { recursive: true }); writeFileSync(join(dir, file), text); };
const get = (dir, file) => readFileSync(join(dir, file), 'utf8');
/** Replaces `from` with `to` in a file, and fails the test when `from` is not there. */
const change = (dir, file, from, to) => { const old = get(dir, file); assert.notEqual(old.replace(from, to), old, `${file} holds ${from}`); put(dir, file, old.replace(from, to)); };
const add = (dir, file, text) => put(dir, file, get(dir, file) + text);

let count = 0;
/** A new project straight from setup: the files every project gets, the pre-commit file, and
 * the check itself. `local: true` adds local work items and local memory. One commit. */
function fresh({ local = true } = {}) {
  const dir = join(scratch, `project-${++count}`);
  cpSync(join(assets, 'every-project'), dir, { recursive: true, filter: (from) => !/\/\.(agents|claude)$/.test(from) });
  put(dir, HOOK, readFileSync(script, 'utf8'));
  if (local) cpSync(join(assets, 'work-local/work-items'), join(dir, 'work-items'), { recursive: true });
  if (local) cpSync(join(assets, 'memory-local/memory'), join(dir, 'memory'), { recursive: true });
  change(dir, 'PROJECT.md', 'prefix: `<WI>`', 'prefix: `WI`');
  git(dir, 'init', '-q', '-b', 'main');
  git(dir, 'add', '.');
  git(dir, 'commit', '-q', '-m', 'Start');
  return dir;
}

const entry = (id, fields = {}) => `## ${id}: One workspace per client\n\n${Object.entries({ Status: 'Decided', Raised: '2026-10-01, the owner', Decided: '2026-10-02, the owner', Decision: 'Each client has one workspace.', Why: 'The owner asked for it.', Affects: 'WI-001, SEC-01', 'Replaces or replaced by': 'none', Sources: 'SRC-001', ...fields }).map(([label, value]) => `- ${label}: ${value}`).join('\n')}\n\n`;
const rule = (id, mark, source = 'DEC-001') => `### ${id}: Owner only\n\n- Mark: ${mark}\n- Rule: Only the owner of a record changes it.\n- Conditions and exceptions: None\n- Source: ${source}\n\n`;
/** Fills a system document: its Status, "Last changed via", rules, Open questions, and one Changelog row. */
function fill(dir, file, status, rules, open) {
  change(dir, file, 'Status: Not started', `Status: ${status}`);
  change(dir, file, 'via: none', 'via: DEC-001');
  change(dir, file, 'No rules yet.\n', rules);
  if (open) change(dir, file, 'None.', open);
  add(dir, file, '| 2026-10-02 | Rule added | DEC-001 | WI-001 |\n');
}
const item = (id, status = 'Done', moved = 'DEC-001 recorded. SEC-01 added.') => `---\nid: ${id}\ntitle: Client workspaces\nstate: ${status}\nstatus: ${status}\nparent: none\n---\n\n# ${id}: Client workspaces\n\n## Overview\n\n**Related items:** DEC-001, SEC-01\n\n**Moved up:** ${moved}\n\n## Notes\n\n### Sources\n\n- SRC-001: kickoff notes.\n`;
/** A project whose records are filled and correct: two decisions, three system documents with
 * rules, one integration, one source, one work item, and Current State. */
function good({ local = true } = {}) {
  const dir = fresh({ local });
  change(dir, 'DECISIONS.md', /No entries yet.*\n/, entry('DEC-001') + entry('DEC-002', { Status: 'Open', Decided: '"not yet"', Decision: 'Which plan do we buy?' }));
  fill(dir, 'system/security-model.md', 'Approved', rule('SEC-01', 'Approved (DEC-001)') + rule('SEC-02', 'Built (WI-001)') + rule('SEC-03', 'Retired'));
  fill(dir, 'system/automation.md', 'Draft', rule('AUT-01', 'Draft', 'DEC-002'), '- DEC-002');
  cpSync(join(dir, 'system/integrations/INTEGRATION-TEMPLATE.md'), join(dir, 'system/integrations/billing.md'));
  fill(dir, 'system/integrations/billing.md', 'Approved', rule('INT-01', 'Approved (DEC-001)'));
  change(dir, 'system/integrations/billing.md', '<System name>', 'Billing');
  change(dir, 'system/integrations/README.md', /No integration documents yet.*\n/, '| [billing.md](billing.md) | Billing | Approved | INT-01 |\n');
  change(dir, 'system/glossary.md', '| --- | --- | --- | --- | --- | --- |\n', '| --- | --- | --- | --- | --- | --- |\n| Workspace | App | One client\'s area | None | DEC-001 | 2026-10-02 |\n');
  change(dir, 'system/glossary.md', 'Status: Not started', 'Status: Approved');
  put(dir, 'sources/SRC-001-kickoff-notes.md', 'Kickoff notes, as received.\n');
  change(dir, 'sources/README.md', /No sources yet.*\n/, '| SRC-001 | 2026-10-01 | The client | Kickoff notes | [SRC-001-kickoff-notes.md](SRC-001-kickoff-notes.md) | DEC-001, WI-001 |\n| SRC-002 | 2026-10-01 | The client | A 2 GB export | The shared drive, folder "Exports" | none yet |\n');
  if (local) put(dir, 'work-items/WI-001-client-workspaces/WI-001.md', item('WI-001'));
  put(dir, 'memory/CURRENT_STATE.md', '# Current state\n\nLast updated: 2026-10-05, handoff, agent\n\n## Now\n\n- WI-001: client workspaces.\n');
  git(dir, 'add', '.');
  git(dir, 'commit', '-q', '-m', 'Records');
  return dir;
}

/** Runs the check with `args`; `input` is the hook's JSON, or a string to pass as it is. */
function run(dir, args = [], input = {}) {
  const result = spawnSync(process.execPath, [join(dir, HOOK), ...args], { cwd: dir, env, encoding: 'utf8', input: typeof input === 'string' ? input : JSON.stringify(input) });
  return { code: result.status, err: result.stderr, out: result.stdout };
}
// The PostToolUse input of each product: hooks.md "PostToolUse input" (Claude Code) and the
// Codex page's PostToolUse table, where apply_patch passes the patch text in tool_input.command.
const claudeEdit = (dir, file) => run(dir, [], { session_id: 'abc123', cwd: dir, permission_mode: 'default', hook_event_name: 'PostToolUse', tool_name: 'Write', tool_input: { file_path: join(dir, file), content: 'x' }, tool_response: { filePath: join(dir, file), type: 'create' }, tool_use_id: 'toolu_01' });
const codexEdit = (dir, file) => run(dir, [], { session_id: 'abc123', cwd: dir, hook_event_name: 'PostToolUse', turn_id: 't1', tool_name: 'apply_patch', tool_use_id: 'call_1', tool_input: { command: `*** Begin Patch\n*** Update File: ${file}\n@@\n-old\n+new\n*** End Patch\n` }, tool_response: 'Done' });
const clean = (result, label) => assert.deepEqual(result, { code: 0, err: '', out: '' }, label);
/** Every file under a folder with its text, to prove the check wrote nothing. */
const snapshot = (dir) => readdirSync(dir, { recursive: true }).filter((name) => !name.startsWith('.git/')).sort().map((name) => [name, statSync(join(dir, name)).isFile() ? readFileSync(join(dir, name), 'utf8') : 'folder']);

test('a new project straight from setup gives no finding in any mode', () => {
  for (const local of [true, false]) {
    const dir = fresh({ local });
    clean(run(dir, ['--all'], { cwd: dir, hook_event_name: 'Stop', stop_hook_active: false }), '--all');
    clean(run(dir, ['--staged'], ''), '--staged');
    for (const file of ['DECISIONS.md', 'system/glossary.md', 'sources/README.md', 'AGENTS.md', 'work-items/PROJECT-TASKS.md', 'memory/CURRENT_STATE.md']) {
      clean(claudeEdit(dir, file), `Claude Code edit of ${file}`);
      clean(codexEdit(dir, file), `Codex edit of ${file}`);
    }
  }
});

test('a project with correct, filled records gives no finding in any mode', () => {
  const dir = good();
  clean(run(dir, ['--all']), '--all');
  clean(run(dir, ['--staged'], ''), '--staged');
  for (const file of ['DECISIONS.md', 'system/security-model.md', 'work-items/WI-001-client-workspaces/WI-001.md']) clean(claudeEdit(dir, file), file);
});

const S = 'system/security-model.md', W = 'work-items/WI-001-client-workspaces/WI-001.md';
// [check, what is broken, how to break a good project, the file the finding names, the finding].
// 'later' marks a record made of two files: an edit says nothing, the stop and the commit report it.
const BROKEN = [
  [1, 'one DEC ID on two entries', (d) => add(d, 'DECISIONS.md', entry('DEC-001')), 'DECISIONS.md', /DEC-001 has two entries\. Give one the next free ID\./],
  [1, 'a DEC ID lower than the one before it', (d) => change(d, 'DECISIONS.md', '## DEC-001: One', '## DEC-009: One'), 'DECISIONS.md', /DEC-002 comes after a higher ID/],
  [2, 'a Status that is not one of the four', (d) => change(d, 'DECISIONS.md', 'Status: Decided', 'Status: Approved'), 'DECISIONS.md', /^DECISIONS\.md:\d+: DEC-001 has Status "Approved"\. Use one of: Open, Decided, Superseded, Withdrawn\.$/m],
  [2, 'a Decided entry with no date and name', (d) => change(d, 'DECISIONS.md', 'Decided: 2026-10-02, the owner', 'Decided: yes'), 'DECISIONS.md', /DEC-001 is Decided, so its Decided line holds the date and the name/],
  [2, 'an Open entry that does not say "not yet"', (d) => change(d, 'DECISIONS.md', 'Decided: "not yet"', 'Decided: soon'), 'DECISIONS.md', /DEC-002 is Open, so its Decided line says "not yet"/],
  [2, 'a Superseded entry that names no other entry', (d) => change(d, 'DECISIONS.md', 'Status: Decided', 'Status: Superseded'), 'DECISIONS.md', /DEC-001 is Superseded, so "Replaces or replaced by" names the entry/],
  [3, 'a top line that is missing', (d) => change(d, S, /- Governs: .*\n/, ''), S, /the top holds three lines in this order/],
  [3, 'sections out of order', (d) => change(d, S, '## Overview', '## Summary'), S, /the sections are Overview, Content, Open questions, Changelog/],
  [3, 'a Status that is not one of the three', (d) => change(d, S, 'Status: Approved', 'Status: Final'), S, /Status is "Final", but .* Set Status to Approved\./],
  [4, 'a rule with another document\'s prefix', (d) => change(d, S, '### SEC-03', '### AUT-07'), S, /AUT-07 does not fit this document, which holds SEC-## rules/],
  [4, 'one rule ID in two documents', (d) => change(d, 'system/automation.md', '### AUT-01', '### SEC-01'), S, /SEC-01 is also a rule in system\/automation\.md/],
  [4, 'a Mark that is not one of the four', (d) => change(d, S, 'Mark: Retired', 'Mark: Done'), S, /SEC-03 has Mark "Done"\. Use Draft, Approved \(DEC-###\), Built \(the work item ID\), or Retired\./],
  [5, 'an Approved rule whose decision is still Open', (d) => change(d, S, 'Approved (DEC-001)', 'Approved (DEC-002)'), S, /SEC-01 is marked Approved, which needs a Decided entry in DECISIONS\.md, but DEC-002 is Open/],
  [5, 'a document Status that disagrees with its marks', (d) => change(d, S, 'Mark: Retired', 'Mark: Draft'), S, /Status is "Approved", but the document has a rule marked Draft\. Set Status to Draft\./],
  [6, 'a "Last changed via" that names no entry', (d) => change(d, S, 'via: DEC-001', 'via: DEC-044'), S, /"Last changed via" is "DEC-044"\. Write "none", or the ID of an entry/],
  [6, 'an Open questions line that names a Decided entry', (d) => change(d, 'system/automation.md', '- DEC-002', '- DEC-001'), 'system/automation.md', /Open questions holds only the IDs of Open entries .* DEC-001 is not Open there/],
  [7, 'one SRC ID on two rows', (d) => change(d, 'sources/README.md', '| SRC-002 |', '| SRC-001 |'), 'sources/README.md', /SRC-001 has two rows/],
  [7, 'a row whose file is missing', (d) => renameSync(join(d, 'sources/SRC-001-kickoff-notes.md'), join(d, 'sources/SRC-001-notes.md')), 'sources/README.md', /SRC-001: "Where kept" names SRC-001-kickoff-notes\.md, which is not in sources\//, 'later'],
  [7, 'a file with no row', (d) => put(d, 'sources/SRC-009-email.md', 'An email.\n'), 'sources/SRC-009-email.md', /^sources\/SRC-009-email\.md: has no row in sources\/README\.md/m, 'later'],
  [9, 'an ID that is not defined', (d) => change(d, 'DECISIONS.md', 'Sources: SRC-001', 'Sources: SRC-077'), 'DECISIONS.md', /SRC-077 is written here, but sources\/README\.md has no SRC-077/],
  [9, 'a work item that names a rule that is not defined', (d) => change(d, W, 'DEC-001, SEC-01', 'DEC-001, DAT-05'), W, /WI-001\.md:\d+: DAT-05 is written here, but system\/ has no DAT-05/],
  [10, 'an angle-bracket prompt left in an entry', (d) => change(d, 'DECISIONS.md', 'The owner asked for it.', '<the reason for the decision>'), 'DECISIONS.md', /Lines that hold an angle-bracket prompt from the form: 1\. Replace each prompt/],
  [11, 'a CLAUDE.md that does not hold @AGENTS.md', (d) => put(d, 'sources/CLAUDE.md', 'See AGENTS.md\n'), 'sources/CLAUDE.md', /^sources\/CLAUDE\.md: this folder has an AGENTS\.md, so its CLAUDE\.md holds exactly one line/m],
  [12, 'an integration document with no row', (d) => change(d, 'system/integrations/README.md', /\| \[billing.*\n/, ''), 'system/integrations/billing.md', /billing\.md: has no row in system\/integrations\/README\.md/, 'later'],
  [12, 'a row whose document is missing', (d) => add(d, 'system/integrations/README.md', '| [crm.md](crm.md) | CRM | Draft | INT-02 |\n'), 'system/integrations/README.md', /the row for crm\.md names a document that is not in this folder/, 'later'],
  [13, 'a work item file not named for its ID', (d) => renameSync(join(d, W), join(d, dirname(W), 'ITEM.md')), 'work-items/WI-001-client-workspaces/ITEM.md', /this work item's id is WI-001, so its file is WI-001\.md/],
  [13, 'two work items with one ID', (d) => put(d, 'work-items/WI-001-copy/WI-001.md', item('WI-001')), 'work-items/', /WI-001 is also the id of work-items\/WI-001-/],
  [14, 'a Done work item with an empty Moved up line', (d) => change(d, W, /\*\*Moved up:\*\* .*/, '**Moved up:** <Leave empty until the closing step.>'), W, /the work item is closed, but its Moved up line is empty/],
  [15, 'a work item ID in DECISIONS.md that does not exist', (d) => change(d, 'DECISIONS.md', 'Affects: WI-001', 'Affects: WI-042'), 'DECISIONS.md', /WI-042 is not a work item in work-items\//],
  [15, 'a work item ID in Current State that does not exist', (d) => change(d, 'memory/CURRENT_STATE.md', 'WI-001', 'WI-042'), 'memory/CURRENT_STATE.md', /^memory\/CURRENT_STATE\.md:\d+: WI-042 is not a work item/m],
];
for (const [number, name, breakIt, file, finding, later] of BROKEN) {
  test(`check ${number}: ${name}`, () => {
    const dir = good();
    clean(run(dir, ['--all']), 'the correct record passes');
    breakIt(dir);
    const all = run(dir, ['--all']);
    assert.equal(all.code, 2, all.err);
    assert.match(all.err, /^validate-records\.mjs found problems: \d+\. Fix each one\. Tell the owner of any you cannot fix\.$/m);
    const line = all.err.split('\n').find((each) => finding.test(each) || new RegExp(finding.source).test(each));
    assert.ok(line?.startsWith(file), `a line for ${file} matches ${finding} in:\n${all.err}`);
    const edited = file.endsWith('/') ? W : file;
    for (const result of [claudeEdit(dir, edited), codexEdit(dir, edited)]) {
      if (later) clean(result, 'an edit does not report half of a two-file record');
      else assert.deepEqual([result.code, finding.test(result.err), result.out], [2, true, ''], 'the edit of that file reports it');
    }
    if (later) assert.match(run(dir, ['--staged'], '').err, finding);
  });
}

test('check 8: a commit that changes or deletes a filed original is stopped by .githooks/pre-commit', () => {
  const dir = good();
  const hook = join(dir, '.githooks/pre-commit');
  assert.ok(statSync(join(assets, 'every-project/.githooks/pre-commit')).mode & 0o100, 'the starter file is executable');
  assert.ok(readFileSync(hook, 'utf8').trimEnd().split('\n').length <= 6);
  git(dir, 'config', 'core.hooksPath', '.githooks');
  add(dir, 'sources/SRC-001-kickoff-notes.md', 'A correction.\n');
  git(dir, 'add', 'sources/SRC-001-kickoff-notes.md');
  assert.throws(() => git(dir, 'commit', '-m', 'Change an original'), /sources\/SRC-001-kickoff-notes\.md: this commit changes or deletes a filed source/);
  assert.match(run(dir, ['--staged'], '').err, /The commit was stopped\./);
  git(dir, 'restore', '--staged', '--worktree', 'sources/SRC-001-kickoff-notes.md');
  // A new original with its row, an edit of the list, and an edit of the folder guide all pass.
  put(dir, 'sources/SRC-003-email.md', 'An email.\n');
  add(dir, 'sources/README.md', '| SRC-003 | 2026-10-05 | The client | An email | [SRC-003-email.md](SRC-003-email.md) | none yet |\n');
  add(dir, 'sources/AGENTS.md', '\nOne more line.\n');
  git(dir, 'add', 'sources');
  assert.match(git(dir, 'commit', '-m', 'File a source'), /File a source/);
  // After an edit and at stop, the same change is not reported: check 8 is for commits only.
  add(dir, 'sources/SRC-001-kickoff-notes.md', 'A correction.\n');
  clean(run(dir, ['--all']), '--all');
  // --staged never reads work-items/ or memory/, and a crash of the check does not stop a commit.
  change(dir, W, 'status: Done', 'status: Done\nid: WI-777');
  clean(run(dir, ['--staged'], ''), 'a broken work item is not read before a commit');
  put(dir, HOOK, 'throw new Error("crash");\n');
  put(dir, 'README.md', 'Changed.\n');
  git(dir, 'add', 'README.md');
  assert.match(git(dir, 'commit', '-m', 'A crash does not stop a commit'), /A crash does not stop/);
});

test('work items in Notion or GitHub, or Hindsight memory: no local folder is expected, and an ID only has to be well formed', () => {
  const dir = good({ local: false });
  assert.deepEqual(readdirSync(join(dir, 'memory')), ['CURRENT_STATE.md'], 'only Current State, as with Hindsight');
  clean(run(dir, ['--all']), 'WI-001 has no file, and that is not a finding');
  rmSync(join(dir, 'memory'), { recursive: true });
  clean(run(dir, ['--all']), 'no memory/ folder at all');
  change(dir, 'DECISIONS.md', 'Affects: WI-001', 'Affects: wi1');
  assert.match(run(dir, ['--all']).err, /DECISIONS\.md:\d+: "wi1" is not a work item ID\. Write WI-, then the number, such as WI-031\./);
  change(dir, 'PROJECT.md', 'prefix: `WI`', 'prefix: `not used`');
  clean(run(dir, ['--all']), 'GitHub Issues: no prefix, so no work item ID is checked');
});

test('never fails because of its own error: bad input, a missing folder, no Git repository', () => {
  const dir = good();
  change(dir, 'DECISIONS.md', 'Status: Decided', 'Status: Approved');
  for (const [args, input] of [[[], 'not json'], [['--all'], '{"cwd": 5'], [[], '{}'], [[], '[]'], [[], { tool_input: { file_path: 7 } }], [[], { cwd: dir, tool_input: { command: ['', ''] } }]]) {
    const result = run(dir, args, input);
    assert.equal(result.code, 0, JSON.stringify(input));
    assert.ok(result.err.trimEnd().split('\n').length <= 1, 'at most one line');
  }
  assert.match(run(dir, [], 'not json').err, /^validate-records\.mjs did not run\. Its own error: SyntaxError: .*\n$/);
  clean(claudeEdit(dir, 'src/app.js'), 'an edit of a file that is not a record checks nothing');
  assert.equal(run(dir, [], { cwd: dir, tool_name: 'apply_patch', tool_input: { command: 'a patch in a form the check does not know' } }).code, 2, 'a Codex patch that names no file: every group is reported');
  clean(run(dir, ['--all'], { cwd: dir, hook_event_name: 'Stop', stop_hook_active: true }), 'the agent is never kept from stopping twice');
  assert.equal(run(dir, ['--all'], { cwd: dir, hook_event_name: 'Stop', stop_hook_active: false }).code, 2);
  for (const folder of ['system', 'sources', 'work-items', 'memory', 'DECISIONS.md', 'PROJECT.md']) rmSync(join(dir, folder), { recursive: true });
  clean(run(dir, ['--all']), 'a project with none of the records');
  const bare = join(scratch, 'no-git');
  put(bare, HOOK, readFileSync(script, 'utf8'));
  put(bare, 'DECISIONS.md', entry('DEC-001', { Status: 'Approved' }));
  assert.match(run(bare, ['--all']).err, /DEC-001 has Status "Approved"/, 'with no Git repository it checks the folder it ran in');
  assert.equal(run(bare, ['--staged'], '').code, 0, 'git fails outside a repository: one line, exit 0');
});

test('from a Git worktree: tracked records are read in the worktree; work items and Current State are read in the main checkout and checked against its records', () => {
  const dir = good();
  const tree = join(dir, '.claude/worktrees/task');
  git(dir, 'worktree', 'add', '-q', tree, '-b', 'claude/task');
  change(tree, 'DECISIONS.md', 'Status: Decided', 'Status: Approved');
  add(dir, 'DECISIONS.md', entry('DEC-003')); // saved to the default branch after the worktree was made
  change(dir, W, 'DEC-001, SEC-01', 'DEC-003, DAT-05');
  const stop = run(tree, ['--all'], { cwd: tree });
  assert.match(stop.err, /^DECISIONS\.md:\d+: DEC-001 has Status "Approved"/m);
  assert.deepEqual([/WI-001\.md:\d+: DAT-05 is written here/.test(stop.err), /DEC-003/.test(stop.err)], [true, false], 'DEC-003 is defined in the main checkout, where the work item is');
  clean(claudeEdit(dir, 'DECISIONS.md'), 'the main checkout\'s own DECISIONS.md is correct');
  // An edit reports only the group of the edited file: tracked records, or work items and memory.
  const item = run(tree, [], { cwd: tree, tool_input: { file_path: join(dir, W) } });
  assert.deepEqual([/DAT-05/.test(item.err), /Approved|DEC-003/.test(item.err)], [true, false]);
  assert.doesNotMatch(run(tree, [], { cwd: tree, tool_input: { file_path: join(tree, 'DECISIONS.md') } }).err, /DAT-05/);
});

test('output stays under about 2,000 characters, one line per finding, and the check writes no file', () => {
  const dir = good();
  add(dir, 'DECISIONS.md', Array.from({ length: 60 }, (_, i) => entry(`DEC-${100 + i}`, { Status: i ? 'Approved by the owner after a long talk about it' : 'x'.repeat(5000) })).join(''));
  change(dir, W, 'status: Done', 'status: Done\nextra: x');
  put(dir, 'sources/SRC-009-email.md', 'An email.\n');
  git(dir, 'add', 'DECISIONS.md');
  const before = snapshot(dir);
  for (const result of [run(dir, ['--all']), run(dir, ['--staged'], ''), claudeEdit(dir, 'DECISIONS.md'), codexEdit(dir, 'DECISIONS.md')]) {
    assert.equal(result.code, 2);
    assert.ok(result.err.length < 2000, `${result.err.length} characters`);
    assert.match(result.err, /\n\d+ more are not shown\. Fix these first\.\n$/);
    for (const line of result.err.trimEnd().split('\n').slice(1, -1)) assert.match(line, /^[\w./-]+(:\d+)?: \S.{20,330}$/, line);
  }
  assert.deepEqual(snapshot(dir), before, 'no file was written, changed, or removed');
});

test('settings snippets: Claude Code runs the check after Edit and Write and at Stop; Codex after apply_patch', () => {
  const dir = good();
  change(dir, 'DECISIONS.md', 'Status: Decided', 'Status: Approved');
  for (const memory of ['local', 'notion', 'hindsight']) {
    const claude = JSON.parse(readFileSync(join(assets, `settings/claude-settings-hooks.${memory}.json`), 'utf8')).hooks;
    const after = claude.PostToolUse.filter((group) => group.matcher === 'Edit|Write');
    assert.deepEqual(after.map((group) => group.hooks), [[{ type: 'command', command: 'node', args: ['${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-records.mjs'], timeout: 10 }]]);
    assert.deepEqual(claude.Stop, [{ hooks: [{ type: 'command', command: 'node', args: ['${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-records.mjs', '--all'], timeout: 10 }] }]);
    const codex = JSON.parse(readFileSync(join(assets, `settings/codex-hooks.${memory}.json`), 'utf8'));
    assert.equal(codex.hooks.Stop, undefined, 'Codex has no Stop entry: its Stop event needs JSON on stdout');
    const patch = codex.hooks.PostToolUse.filter((group) => group.matcher === '^apply_patch$');
    assert.deepEqual(patch.map((group) => group.hooks), [[{ type: 'command', command: 'node "$(git rev-parse --show-toplevel)/.claude/hooks/validate-records.mjs"', timeout: 10 }]]);
    assert.match(codex.description, /a check of the project's records after each file edit\.$/);
    // The Codex command runs as written, from a folder inside the project.
    const ran = spawnSync('/bin/sh', ['-c', patch[0].hooks[0].command], { cwd: join(dir, 'system'), env, encoding: 'utf8', input: JSON.stringify({ cwd: join(dir, 'system'), tool_name: 'apply_patch', tool_input: { command: '*** Begin Patch\n*** Update File: ../DECISIONS.md\n*** End Patch\n' } }) });
    assert.equal(ran.status, 2);
    assert.match(ran.stderr, /DEC-001 has Status "Approved"/);
  }
});

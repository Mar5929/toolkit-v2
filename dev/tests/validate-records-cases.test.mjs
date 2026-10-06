// More tests for validate-records.mjs: the cases the second review found (2026-10-05, TKV-24).
// Run from the repository root: node --test dev/tests/validate-records-cases.test.mjs
// The last two tests are from the review of the second round of fixes (blocker and note 8).
// The first file, validate-records.test.mjs, is at its size limit, so new cases go here.
// Every run works in a temporary folder. HOME points there, so nothing else on this Mac changes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const assets = join(repo, 'plugins/toolkit/skills/project-setup/assets');
const HOOK = '.claude/hooks/validate-records.mjs';
const scratch = realpathSync(mkdtempSync(join(tmpdir(), 'tkv2-record-cases-')));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));
const gitPath = dirname(execFileSync('which', ['git'], { encoding: 'utf8' }).trim());
const env = { HOME: scratch, PATH: `${dirname(process.execPath)}:${gitPath}:/usr/bin:/bin`, GIT_CONFIG_NOSYSTEM: '1' };
const git = (dir, ...args) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], { cwd: dir, env, encoding: 'utf8', stdio: 'pipe' });
const put = (dir, file, text) => { mkdirSync(dirname(join(dir, file)), { recursive: true }); writeFileSync(join(dir, file), text); };
const get = (dir, file) => readFileSync(join(dir, file), 'utf8');
const change = (dir, file, from, to) => { const old = get(dir, file); assert.notEqual(old.replace(from, to), old, `${file} holds ${from}`); put(dir, file, old.replace(from, to)); };
const add = (dir, file, text) => put(dir, file, get(dir, file) + text);

const W = 'work-items/WI-001-client-workspaces/WI-001.md';
const entry = (id) => `## ${id}: One workspace per client\n\n- Status: Decided\n- Raised: 2026-10-01, the owner\n- Decided: 2026-10-02, the owner\n- Decision: Each client has one workspace.\n- Why: The owner asked for it.\n- Affects: WI-001\n- Replaces or replaced by: none\n- Sources: none\n\n`;
const item = (related) => `---\nid: WI-001\ntitle: Client workspaces\nstate: Building\nstatus: In progress\nparent: none\n---\n\n# WI-001: Client workspaces\n\n**Related items:** ${related}\n\n**Moved up:**\n`;
let count = 0;
/** A project as setup leaves it, with local work items and memory, one decision (DEC-001), and
 * one work item (WI-001) that names it. One commit on `main`. */
function project() {
  const dir = join(scratch, `project-${++count}`);
  cpSync(join(assets, 'every-project'), dir, { recursive: true, filter: (from) => !/\/\.(agents|claude)$/.test(from) });
  put(dir, HOOK, readFileSync(join(assets, 'every-project', HOOK), 'utf8'));
  cpSync(join(assets, 'work-local/work-items'), join(dir, 'work-items'), { recursive: true });
  cpSync(join(assets, 'memory-local/memory'), join(dir, 'memory'), { recursive: true });
  change(dir, 'PROJECT.md', 'prefix: `<WI>`', 'prefix: `WI`');
  change(dir, 'DECISIONS.md', /No entries yet.*\n/, entry('DEC-001'));
  put(dir, W, item('DEC-001'));
  git(dir, 'init', '-q', '-b', 'main');
  git(dir, 'add', '.');
  git(dir, 'commit', '-q', '-m', 'Start');
  return dir;
}
function run(dir, args = [], input = {}, cwd = dir) {
  const result = spawnSync(process.execPath, [join(dir, HOOK), ...args], { cwd, env, encoding: 'utf8', input: typeof input === 'string' ? input : JSON.stringify(input) });
  return { code: result.status, err: result.stderr, out: result.stdout };
}
const clean = (result, label) => assert.deepEqual(result, { code: 0, err: '', out: '' }, label);
const edit = (dir, file, cwd = dir) => run(dir, [], { cwd, hook_event_name: 'PostToolUse', tool_name: 'Write', tool_input: { file_path: join(dir, file) } }, cwd);
/** The save `publish-docs` makes: a save worktree at the default branch, one commit that adds DEC-003. */
function save(main, from) {
  const tree = join(main, '.claude/worktrees/docsave-dec-003');
  git(main, 'worktree', 'add', '-q', '--detach', tree, from);
  add(tree, 'DECISIONS.md', entry('DEC-003'));
  git(tree, 'add', '--', 'DECISIONS.md');
  git(tree, 'commit', '-q', '-m', 'Record DEC-003');
  return [tree, git(tree, 'rev-parse', 'HEAD').trim()];
}

test('blocker 1, with a remote: after the save and the fast-forward of the main checkout, the pointer in the work item passes', () => {
  const dir = project();
  const remote = join(scratch, `remote-${count}.git`);
  git(scratch, 'init', '-q', '--bare', '-b', 'main', remote);
  git(dir, 'remote', 'add', 'origin', remote);
  git(dir, 'push', '-q', '-u', 'origin', 'main');
  const [tree] = save(dir, 'origin/main');
  git(tree, 'push', '-q', 'origin', 'HEAD:main');
  // What the skill did before this fix: the pointer was written while the main checkout was behind.
  put(dir, W, item('DEC-001, DEC-003'));
  assert.match(run(dir, ['--all']).err, /WI-001\.md:\d+: DEC-003 is written here, but DECISIONS\.md has no DEC-003/, 'behind the remote: reported');
  // The new step of publish-docs: bring the main checkout's default branch up to date.
  git(dir, 'fetch', '-q', 'origin', 'main');
  git(dir, 'merge', '-q', '--ff-only', 'origin/main');
  clean(run(dir, ['--all']), 'the main checkout has DEC-003 now');
  clean(edit(dir, W), 'the edit of the work item');
  put(dir, W, item('DEC-001, DEC-003, DEC-009'));
  const missing = run(dir, ['--all']);
  assert.equal(missing.code, 2);
  assert.match(missing.err, /DEC-009 is written here, but DECISIONS\.md has no DEC-009/, 'an ID no record defines is still reported');
  assert.doesNotMatch(missing.err, /DEC-003/);
});

test('blocker 1, from a worktree with no remote: a work item is checked against the main checkout\'s records', () => {
  const dir = project();
  const session = join(dir, '.claude/worktrees/task');
  git(dir, 'worktree', 'add', '-q', session, '-b', 'claude/task');
  const [, commit] = save(dir, 'main');
  git(dir, 'merge', '-q', '--ff-only', commit); // publish-docs, step 7, "No remote"
  put(dir, W, item('DEC-001, DEC-003'));
  assert.doesNotMatch(get(session, 'DECISIONS.md'), /DEC-003/, 'the session\'s branch does not hold the new record');
  clean(run(session, ['--all'], { cwd: session, hook_event_name: 'Stop' }, session), 'at stop, in the session worktree');
  clean(edit(dir, W, session), 'after the edit of the work item, from the session worktree');
  put(dir, W, item('DEC-001, DEC-003, DEC-009, SRC-044'));
  const missing = run(session, ['--all'], { cwd: session }, session);
  assert.equal(missing.code, 2);
  assert.match(missing.err, /DEC-009 is written here, but DECISIONS\.md has no DEC-009/);
  assert.match(missing.err, /SRC-044 is written here, but sources\/README\.md has no SRC-044/);
  assert.doesNotMatch(missing.err, /DEC-003/);
  // A tracked record in the session worktree is still checked against that worktree's own records.
  change(session, 'DECISIONS.md', 'Sources: none', 'Sources: SRC-077');
  assert.match(run(session, ['--all'], { cwd: session }, session).err, /^DECISIONS\.md:\d+: SRC-077 is written here/m);
});

test('finding 5: a work item that still holds the template\'s prompts gets no finding for the example IDs in them', () => {
  const dir = project();
  const form = get(dir, 'work-items/work-item-template/WORK-ITEM.md');
  for (const line of form.split('\n').filter((each) => /^\*\*(Related items|Moved up):\*\*/.test(each))) {
    assert.doesNotMatch(line.replace(/^[^<]*</, '').replace(/>$/, ''), /[<>]/, 'the prompt holds no second pair of angle brackets');
  }
  const filled = form.replace(/^id: .*$/m, 'id: WI-002').replace(/^status: .*$/m, 'status: In progress');
  assert.match(filled, /^id: WI-002$/m);
  put(dir, 'work-items/WI-002-new-item/WI-002.md', filled);
  clean(run(dir, ['--all']), 'an open item straight from the template');
  put(dir, 'work-items/WI-002-new-item/WI-002.md', filled.replace('status: In progress', 'status: Done'));
  const closed = run(dir, ['--all']);
  assert.match(closed.err, /^validate-records\.mjs found problems: 1\./, closed.err);
  assert.match(closed.err, /WI-002\.md: the work item is closed, but its Moved up line is empty/, 'check 14 sees the prompt as empty');
});

test('finding 6: text in backticks is not a prompt; a prompt outside backticks on the same line still is', () => {
  const dir = project();
  change(dir, 'DECISIONS.md', 'Each client has one workspace.', 'The cache is a `Map<Id, Account>`, keyed by the `<record id>` of the client.');
  clean(run(dir, ['--all']), 'code in backticks');
  clean(edit(dir, 'DECISIONS.md'), 'after the edit');
  change(dir, 'DECISIONS.md', 'keyed by', '<say how it is> keyed by');
  assert.match(run(dir, ['--all']).err, /^DECISIONS\.md:\d+: Lines that hold an angle-bracket prompt from the form: 1\./m);
});

test('finding 7: only a Markdown link makes a source row "kept in the repository"', () => {
  const dir = project();
  change(dir, 'sources/README.md', /No sources yet.*\n/, '| SRC-001 | 2026-10-01 | The client | A 2 GB export | The shared drive, folder "Exports", file SRC-001-export.zip | WI-001 |\n');
  clean(run(dir, ['--all']), 'kept outside Git: the place names a file whose name starts with the SRC ID');
  clean(run(dir, ['--staged'], ''), 'before a commit');
  add(dir, 'sources/README.md', '| SRC-002 | 2026-10-02 | The client | Notes | [SRC-002-notes.md](SRC-002-notes.md) | none yet |\n');
  assert.match(run(dir, ['--all']).err, /SRC-002: "Where kept" names SRC-002-notes\.md, which is not in sources\//, 'a link to a missing file is still reported');
});

test('finding 8: an edit to a file in another repository, or outside every repository, checks nothing', () => {
  const dir = project();
  const other = project();
  change(other, 'DECISIONS.md', 'Status: Decided', 'Status: Approved');
  change(dir, 'DECISIONS.md', 'Status: Decided', 'Status: Approved');
  const loose = join(scratch, `loose-${count}`);
  put(loose, 'AGENTS.md', 'A guide.\n');
  for (const file of [join(other, 'AGENTS.md'), join(other, 'CLAUDE.md'), join(other, 'system/CLAUDE.md'), join(other, W), join(loose, 'AGENTS.md')]) {
    clean(run(dir, [], { cwd: dir, tool_name: 'Edit', tool_input: { file_path: file } }), file);
  }
  clean(run(dir, [], { cwd: dir, tool_name: 'apply_patch', tool_input: { command: `*** Begin Patch\n*** Update File: ${join(other, 'AGENTS.md')}\n*** End Patch\n` } }), 'a Codex patch');
  assert.equal(edit(dir, 'AGENTS.md').code, 2, 'the same edit in the session\'s own repository is checked');
  assert.equal(edit(dir, 'system/CLAUDE.md').code, 2);
});

test('note 21: a reader that closed the output gets exit code 0 on the check\'s own error', async () => {
  const dir = project();
  const code = await new Promise((done) => {
    const child = spawn(process.execPath, [join(dir, HOOK)], { cwd: dir, env, stdio: ['pipe', 'ignore', 'pipe'] });
    child.stderr.destroy();
    child.on('exit', done);
    setTimeout(() => child.stdin.end('not json'), 200);
  });
  assert.equal(code, 0);
});

test('note 22: a record that is there but cannot be read gives one line and exit code 0', { skip: process.getuid?.() === 0 }, () => {
  const dir = project();
  put(dir, 'sources/SRC-001-notes.md', 'Notes.\n');
  chmodSync(join(dir, 'sources/README.md'), 0o000);
  for (const args of [['--all'], ['--staged'], []]) {
    const result = args.length ? run(dir, args, '') : edit(dir, 'sources/README.md');
    assert.equal(result.code, 0, args.join());
    assert.match(result.err, /^validate-records\.mjs did not run\. Its own error: Error: EACCES[^\n]*\n$/);
  }
  chmodSync(join(dir, 'sources/README.md'), 0o644);
  rmSync(join(dir, 'sources/README.md'));
  assert.match(run(dir, ['--all']).err, /sources\/SRC-001-notes\.md: has no row in sources\/README\.md\. File it with filing-project-records/, 'a missing list is an empty list');
});

test('notes 25 and 36: the first line says what happened in each mode, with no "(s)"', () => {
  const dir = project();
  change(dir, 'DECISIONS.md', 'Status: Decided', 'Status: Approved');
  const first = (result) => result.err.split('\n')[0];
  assert.equal(first(run(dir, ['--all'])), 'validate-records.mjs found problems: 1. Fix each one. Tell the owner of any you cannot fix.');
  assert.equal(first(run(dir, ['--staged'], '')), 'validate-records.mjs found problems: 1. The commit was stopped. Fix each one. Tell the owner of any you cannot fix.');
  // In Codex, exit code 2 after apply_patch replaces the tool result with this text (codex/hooks.md, "PostToolUse").
  assert.equal(first(edit(dir, 'DECISIONS.md')), 'validate-records.mjs found problems: 1. The edit was not undone. Fix each one. Tell the owner of any you cannot fix.');
  for (const result of [run(dir, ['--all']), run(dir, [], 'not json')]) assert.doesNotMatch(result.err, /\(s\)|\n\s+at |validate-records\.mjs:\d/);
});

test('review of the second fixes, blocker: a worktree session writes a record in the save worktree, which holds the default branch\'s records', () => {
  const dir = project();
  const session = join(dir, '.claude/worktrees/task');
  git(dir, 'worktree', 'add', '-q', session, '-b', 'claude/task');
  // A source filed after the session's branch was made: the default branch has it, the session's branch does not.
  change(dir, 'sources/README.md', /No sources yet.*\n/, '| SRC-001 | 2026-10-01 | The client | Kickoff notes | [SRC-001-kickoff-notes.md](SRC-001-kickoff-notes.md) | none yet |\n');
  put(dir, 'sources/SRC-001-kickoff-notes.md', 'Notes.\n');
  git(dir, 'add', '--', 'sources');
  git(dir, 'commit', '-q', '-m', 'File SRC-001');
  const tree = join(dir, '.claude/worktrees/docsave-dec-002'); // what publish-docs, step 3, makes
  git(dir, 'worktree', 'add', '-q', '--detach', tree, 'main');
  const decision = entry('DEC-002').replace('Sources: none', 'Sources: SRC-001');
  const edited = (file) => run(session, [], { cwd: session, hook_event_name: 'PostToolUse', tool_name: 'Edit', tool_input: { file_path: file } }, session);
  add(tree, 'DECISIONS.md', decision);
  clean(edited(join(tree, 'DECISIONS.md')), 'after the edit in the save worktree');
  git(tree, 'add', '--', 'DECISIONS.md');
  clean(run(tree, ['--staged'], '', tree), 'before the commit in the save worktree');
  clean(run(session, ['--all'], { cwd: session, hook_event_name: 'Stop' }, session), 'at stop in the session worktree');
  // The same entry written in the session's own worktree is checked against its branch, which has no SRC-001.
  add(session, 'DECISIONS.md', decision);
  assert.match(edited(join(session, 'DECISIONS.md')).err, /SRC-001 is written here, but sources\/README\.md has no SRC-001/);
  // An ID that no record defines is still reported in the save worktree.
  change(tree, 'DECISIONS.md', 'Sources: SRC-001', 'Sources: SRC-001, SRC-044');
  const missing = edited(join(tree, 'DECISIONS.md'));
  assert.match(missing.err, /^DECISIONS\.md:\d+: SRC-044 is written here/m);
  assert.doesNotMatch(missing.err, /SRC-001 is written/);
});

test('review of the second fixes, note 8: in a worktree session, a record of the main checkout that cannot be read does not lose the findings of the session\'s own checkout', { skip: process.getuid?.() === 0 }, () => {
  const dir = project();
  const session = join(dir, '.claude/worktrees/task');
  git(dir, 'worktree', 'add', '-q', session, '-b', 'claude/task');
  change(session, 'DECISIONS.md', 'Status: Decided', 'Status: Approved');
  chmodSync(join(dir, 'DECISIONS.md'), 0o000);
  const stop = () => run(session, ['--all'], { cwd: session, hook_event_name: 'Stop' }, session);
  const lost = /validate-records\.mjs did not run in the main checkout\. Its own error: Error: EACCES[^\n]*\n$/;
  const both = stop();
  assert.equal(both.code, 2, both.err);
  assert.match(both.err, /^validate-records\.mjs found problems: 1\. Fix each one\./);
  assert.match(both.err, /\nDECISIONS\.md:\d+: DEC-001 has Status "Approved"\./, 'the finding of the session\'s own checkout is kept');
  assert.match(both.err, lost, 'then the one line for the main checkout');
  assert.equal(edit(session, 'DECISIONS.md').code, 2, 'the same after an edit');
  // With no finding in the session's own checkout: only the one line, and exit code 0.
  change(session, 'DECISIONS.md', 'Status: Approved', 'Status: Decided');
  const one = stop();
  assert.equal(one.code, 0);
  assert.equal(one.err.split('\n').length, 2, one.err);
  assert.match(one.err, new RegExp(`^${lost.source}`));
  chmodSync(join(dir, 'DECISIONS.md'), 0o644);
  clean(stop(), 'readable again');
});

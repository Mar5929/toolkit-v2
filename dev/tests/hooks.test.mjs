// Tests for the three project hook commands and their settings snippets.
// Run from the repository root: node --test dev/tests/hooks.test.mjs
// Every run works in a temporary folder (a scratch Git repository with a memory/ folder) and
// points HOME there, so nothing on this computer outside that folder changes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SH, gitPath, standIn, testEnv } from './support.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const assets = join(repo, 'plugins/toolkit/skills/project-setup/assets');
const hooks = join(assets, 'every-project/.claude/hooks');
const settings = join(assets, 'settings');
// The starter index: memory/MEMORY.md as a new project with local memory gets it.
const STARTER_INDEX = readFileSync(join(assets, 'memory-local/memory/MEMORY.md'), 'utf8');
const scratch = mkdtempSync(join(tmpdir(), 'tkv2-hooks-'));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));
const baseEnv = testEnv(scratch, gitPath);

let count = 0;
/** A new scratch project: a Git repository with one commit and a memory/ folder kept out of Git.
 * It holds the starter MEMORY.md; pass `'MEMORY.md': null` for a project with none. */
function project(files = {}) {
  const dir = join(scratch, `project-${++count}`);
  mkdirSync(join(dir, 'memory'), { recursive: true });
  const git = (...args) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], { cwd: dir, env: baseEnv, stdio: 'pipe' });
  git('init', '-q', '-b', 'main');
  writeFileSync(join(dir, '.gitignore'), 'memory/\n');
  git('add', '.gitignore');
  git('commit', '-q', '-m', 'Start');
  const memory = { 'MEMORY.md': STARTER_INDEX, ...files };
  for (const [name, text] of Object.entries(memory)) if (text !== null) writeFileSync(join(dir, 'memory', name), text);
  return { dir, git };
}

/** Runs one hook command with the JSON on stdin; returns its exit code and output. */
function hook(file, input, args = [], env = {}) {
  const stdin = typeof input === 'string' ? input : JSON.stringify(input);
  const result = spawnSync(process.execPath, [join(hooks, file), ...args], { input: stdin, encoding: 'utf8', env: { ...baseEnv, ...env }, cwd: scratch });
  return { code: result.status, out: result.stdout, err: result.stderr };
}

const today = new Date().toISOString().slice(0, 10);
const state = (date = today, extra = '') => `# Current state\n\nLast updated: ${date}, handoff, agent\n\n## Now\n\n- WI-031 in build.\n${extra}`;
/** One memory file: its header, then its title. `fields` holds header lines such as status. */
const record = (description, fields = '', title = '') => `---\nname: x\ndescription: ${description}\ncreated: 2026-10-01\nupdated: 2026-10-05\ncheck_by: none\n${fields}---\n\n${title}Body.\n`;
const INDEX_HEAD = 'Memory index (files in memory/; open one before you rely on it):';
/** One line of the index, as the hook writes and prints it. `record` gives the name x and this date. */
const indexLine = (file, description, title = 'x') => `- [${title}](${file}.md): ${description} (updated 2026-10-05)\n`;
const BILLING = indexLine('project_billing', 'How invoices are sent');
/** Every file in a project's memory/ folder, as name and text, to prove what the hook wrote. */
const snapshot = (dir) => readdirSync(join(dir, 'memory')).sort().map((name) => [name, readFileSync(join(dir, 'memory', name), 'utf8')]);

test('session-start, local: rebuilds MEMORY.md grouped by prefix and prints Current State and one whole line per file', () => {
  const { dir } = project({
    'CURRENT_STATE.md': state(),
    'user_team_availability.md': record('Tom away to 2026-10-20; Sarah covers approvals', 'status: current\n', '# Team availability\n\n'),
    'project_client_plans.md': record('"Two more clinics open in 2027 (client, not checked)"', 'status: current\n'),
    'reference_open_items_sheet.md': record("'Open items sheet shared with the client: where it is'", 'status: current\n'),
    'event_weekly_account_load.md': record('Weekly account load: one row per run', 'status: current\n'),
    'project_proposed.md': record('Proposal: the API allows 100 calls a minute', 'status: needs-review\n'),
    'project_old.md': record('An old fact', 'status: retired\n'),
    'project_replaced.md': record('A replaced fact', 'status: superseded\n'),
    'project_topic_template.md': record('The blank form', 'status: template\n'),
    'decision_old.md': record('A decision record from before the one-home layout', 'status: current\n'),
    'notes.md': 'A file with no prefix.\n',
    'project_no_header.md': '# No header\n',
  });
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.equal(code, 0);
  // The title is the file's "# " heading; a file with none shows its name field.
  const user = indexLine('user_team_availability', 'Tom away to 2026-10-20; Sarah covers approvals', 'Team availability');
  const plans = indexLine('project_client_plans', 'Two more clinics open in 2027 (client, not checked)');
  const proposed = indexLine('project_proposed', 'Proposal: the API allows 100 calls a minute');
  const sheet = indexLine('reference_open_items_sheet', 'Open items sheet shared with the client: where it is');
  const load = indexLine('event_weekly_account_load', 'Weekly account load: one row per run');
  assert.equal(out, `The project's Current State:\n${state().trim()}\n\n${INDEX_HEAD}\n${user}${plans}${proposed}${sheet}${load}`, 'no line is cut');
  const index = readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8');
  assert.match(index, /^<!-- Generated file: .*Do not edit it by hand\. -->\n\n# Memory index\n/);
  assert.ok(index.endsWith(`## User\n\n${user}\n## Project\n\n${plans}${proposed}\n## Reference\n\n${sheet}\n## Event\n\n${load}\n## Other memory views\n\n- [Current state](CURRENT_STATE.md)\n`), 'the file holds the same lines, grouped by prefix');
  assert.doesNotMatch(index + out, /project_old|project_replaced|topic_template|decision_old|notes|no_header|Decision|glossary/i);
  assert.doesNotMatch(out, /compacted|no longer true/);
});

test('session-start, local: with no memory files the index is the starter MEMORY.md byte for byte', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state(), 'project_topic_template.md': readFileSync(join(assets, 'memory-local/memory/project_topic_template.md'), 'utf8') });
  const before = snapshot(dir);
  const { out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.ok(out.endsWith(`\n\n${INDEX_HEAD}\nNo memory files yet.\n`));
  assert.equal(readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8'), STARTER_INDEX);
  assert.deepEqual(snapshot(dir), before, 'an index that did not change is not written again');
});

test('session-start, local: a missing MEMORY.md, or one in another form, is written as the generated index', () => {
  for (const text of [null, '', 'A hand-written note.\n', '# Memory pointers\n\n| What it points to | ID | Link | Created | Last changed |\n| --- | --- | --- | --- | --- |\n']) {
    const { dir } = project({ 'CURRENT_STATE.md': state(), 'MEMORY.md': text, 'project_billing.md': record('How invoices are sent', 'status: current\n') });
    const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
    assert.equal(code, 0);
    assert.ok(out.endsWith(`${INDEX_HEAD}\n${BILLING}`), JSON.stringify(text));
    const index = readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8');
    assert.match(index, /^<!-- Generated file: /);
    assert.ok(index.includes(`## User\n\n\n## Project\n\n${BILLING}\n## Reference\n\n\n## Event\n\n\n## Other memory views\n`));
  }
});

test('session-start, local: when MEMORY.md cannot be written (a sandbox), it still prints the new index', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state(), 'project_billing.md': record('How invoices are sent', 'status: current\n') });
  chmodSync(join(dir, 'memory', 'MEMORY.md'), 0o444);
  chmodSync(join(dir, 'memory'), 0o555);
  try {
    const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
    assert.equal(code, 0);
    assert.ok(out.endsWith(`${INDEX_HEAD}\n${BILLING}`));
    assert.equal(readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8'), STARTER_INDEX, 'the file could not be changed');
  } finally { chmodSync(join(dir, 'memory'), 0o755); }
});

test('session-start, local: a missing or empty CURRENT_STATE.md prints one line naming the folder, then the index', () => {
  for (const files of [{}, { 'CURRENT_STATE.md': '\n' }]) {
    const { dir } = project({ 'project_billing.md': record('How invoices are sent', 'status: current\n'), ...files });
    const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
    assert.equal(code, 0);
    assert.match(out, /^memory\/CURRENT_STATE\.md is missing or empty in .+[\\/]project-\d+\.\n\nMemory index \(files in memory\/; open one before you rely on it\):\n- \[x\]\(project_billing\.md\): /);
    assert.doesNotMatch(out, /no longer true/);
  }
});

test('session-start: from inside a git worktree it reads memory/ in the main checkout', () => {
  const { dir, git } = project({ 'CURRENT_STATE.md': state(today, '- Main checkout line.\n') });
  const worktree = join(dir, '.claude', 'worktrees', 'wi-031');
  git('worktree', 'add', '-q', worktree, '-b', 'claude/wi-031');
  assert.equal(existsSync(join(worktree, 'memory')), false, 'memory/ is not in the worktree');
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: join(worktree) }, ['--memory', 'local']);
  assert.equal(code, 0);
  assert.match(out, /Main checkout line\./);
  assert.ok(out.endsWith(`${INDEX_HEAD}\nNo memory files yet.\n`));
});

test('session-start: after compact it adds the re-read line first', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state() });
  const { out } = hook('session-start.mjs', { source: 'compact', cwd: dir }, ['--memory', 'hindsight']);
  assert.equal(out.split('\n')[0], 'Context was just compacted. Before you answer the next message, re-read the active work item with managing-work-items, then do "Every session" in the root AGENTS.md again.');
  // The root AGENTS.md holds what to read again; the hook only points to it.
  const root = readFileSync(join(assets, 'every-project/AGENTS.md'), 'utf8');
  assert.match(root, /^## Every session$/m);
  assert.match(root, /Read them again after resume, clear, or compaction\./);
  assert.match(root, /Codex: at session start, and again after compaction, read every file in `\.claude\/rules\/`/);
  for (const source of ['startup', 'resume', 'clear']) {
    assert.doesNotMatch(hook('session-start.mjs', { source, cwd: dir }, ['--memory', 'hindsight']).out, /compacted/);
  }
});

test('session-start: asks for a prune when Current State is too long or too old', () => {
  const old = project({ 'CURRENT_STATE.md': state('2026-01-02') });
  assert.match(hook('session-start.mjs', { source: 'startup', cwd: old.dir }, ['--memory', 'local']).out, /The project's Current State is \d+ days old\. Remove the lines that are no longer true with the managing-project-memory skill\./);
  const long = project({ 'CURRENT_STATE.md': state(today, '- line\n'.repeat(40)) });
  assert.match(hook('session-start.mjs', { source: 'startup', cwd: long.dir }, ['--memory', 'hindsight']).out, /The project's Current State is \d+ lines \(limit: under 40\)\. Remove the lines that are no longer true with a direct edit, as \.claude\/rules\/hindsight-memory\.md says\./);
  // A new project's page holds its prompts and no date: it gets no prune request.
  const starter = readFileSync(join(assets, 'memory-local/memory/CURRENT_STATE.md'), 'utf8');
  for (const text of [starter, 'Last updated: `<YYYY-MM-DD, source, and person or agent>`\n']) {
    const unfilled = project({ 'CURRENT_STATE.md': text });
    assert.doesNotMatch(hook('session-start.mjs', { source: 'startup', cwd: unfilled.dir }, ['--memory', 'local']).out, /no longer true/);
  }
});

test('session-start: Current State last updated 7 days ago is not old; 8 days ago is', () => {
  const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
  const seven = project({ 'CURRENT_STATE.md': state(daysAgo(7)) });
  assert.doesNotMatch(hook('session-start.mjs', { source: 'startup', cwd: seven.dir }, ['--memory', 'local']).out, /no longer true/);
  const eight = project({ 'CURRENT_STATE.md': state(daysAgo(8)) });
  assert.match(hook('session-start.mjs', { source: 'startup', cwd: eight.dir }, ['--memory', 'local']).out, /^The project's Current State is 8 days old\. Remove the lines that are no longer true with the managing-project-memory skill\.\nThe project's Current State:\n/, 'the prune request comes before the page');
});

test('session-start: with no --memory it reads local memory', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state(), 'project_billing.md': record('How invoices are sent', 'status: current\n') });
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir });
  assert.equal(code, 0);
  assert.equal(out, hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']).out);
  assert.ok(out.startsWith("The project's Current State:\n") && out.endsWith(`${INDEX_HEAD}\n${BILLING}`));
});

test('session-start: from a subfolder of the project it still reads memory/ at the top', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state(today, '- Top folder line.\n') });
  mkdirSync(join(dir, 'system', 'integrations'), { recursive: true });
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: join(dir, 'system', 'integrations') }, ['--memory', 'local']);
  assert.equal(code, 0);
  assert.match(out, /^The project's Current State:[\s\S]*Top folder line\./);
});

test('session-start and prompt-reminder: a reader that closed the output gets exit 0 and no error text', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state() });
  const runs = [
    ['session-start.mjs', { source: 'startup', cwd: dir }, '--memory local'],
    ['prompt-reminder.mjs', { prompt: 'From now on, ask first.' }, ''],
    ['codex-after-commit.mjs', { tool_input: { command: 'git commit -m x' } }, ''],
  ];
  for (const [file, input, args] of runs) {
    // ":" exits at once, so the hook writes into a closed pipe. The exit code goes to stderr.
    const script = `{ "${process.execPath}" "${join(hooks, file)}" ${args}; echo "exit=$?" >&2; } | :`;
    const result = spawnSync(SH, ['-c', script],{ input: JSON.stringify(input), encoding: 'utf8', env: baseEnv });
    assert.equal(result.stderr, 'exit=0\n', file);
  }
});

test('session-start, hindsight: prints Current State only, the one memory file such a project has', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state(), 'MEMORY.md': null });
  assert.deepEqual(readdirSync(join(dir, 'memory')), ['CURRENT_STATE.md']);
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'hindsight']);
  assert.equal(code, 0);
  assert.equal(out, `The project's Current State:\n${state().trim()}\n`);
  assert.deepEqual(readdirSync(join(dir, 'memory')), ['CURRENT_STATE.md'], 'nothing was created');
});

test('session-start, hindsight: a MEMORY.md left from local memory is not read and not changed', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state(), 'MEMORY.md': 'untouched\n', 'project_billing.md': record('How invoices are sent', 'status: current\n') });
  const { out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'hindsight']);
  assert.doesNotMatch(out, /Memory index|untouched|project_billing/);
  assert.equal(readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8'), 'untouched\n');
});

test('session-start, hindsight: a missing CURRENT_STATE.md prints one line and exits 0', () => {
  const { dir } = project({ 'MEMORY.md': null });
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'hindsight']);
  assert.equal(code, 0);
  assert.match(out, /^memory\/CURRENT_STATE\.md is missing or empty in .+[\\/]project-\d+\.\n$/);
});

/** A folder holding a stand-in `ntn` command that prints what the test gives it. */
function fakeNtn(result) {
  const bin = join(scratch, `bin-${++count}`);
  mkdirSync(bin);
  standIn(bin, 'ntn', result);
  return bin;
}
/** The PATH of a hook run that finds the stand-in `ntn` first. */
const withNtn = (bin) => ({ PATH: [bin, baseEnv.PATH].join(delimiter) });

test('session-start, notion: prints the Current state page read with ntn, and no file from memory/', () => {
  // A project with Notion memory has no memory/ folder. One left from local memory is not read.
  const { dir } = project({ 'CURRENT_STATE.md': 'A local file that must not be printed.\n', 'project_billing.md': record('How invoices are sent', 'status: current\n') });
  const before = snapshot(dir);
  const bin = fakeNtn({ out: JSON.stringify({ object: 'page_markdown', markdown: `Last updated: ${today}, agent\n\n## Now\n\n- WI-7 in design.` }) });
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'notion', '--page', 'abc123'], withNtn(bin));
  assert.equal(code, 0);
  assert.equal(readFileSync(join(bin, 'args'), 'utf8').trim(), 'api v1/pages/abc123/markdown');
  assert.match(out, /^The project's Current State:\nLast updated: .*\n\n## Now\n\n- WI-7 in design\.\n$/);
  assert.doesNotMatch(out, /Memory index|project_billing|must not be printed/);
  assert.deepEqual(snapshot(dir), before, 'no file in memory/ was written');
  const bare = project({ 'MEMORY.md': null });
  rmSync(join(bare.dir, 'memory'), { recursive: true });
  const again = hook('session-start.mjs', { source: 'startup', cwd: bare.dir }, ['--memory', 'notion', '--page', 'abc123'], withNtn(bin));
  assert.equal(again.code, 0);
  assert.equal(again.out, out, 'the same with no memory/ folder at all');
  assert.equal(existsSync(join(bare.dir, 'memory')), false, 'no memory/ folder was created');
});

test('session-start, notion: an old or long Current state page gets the prune request naming the skill', () => {
  const { dir } = project({ 'MEMORY.md': null });
  const bin = fakeNtn({ out: JSON.stringify({ markdown: 'Last updated: 2026-01-02, handoff, agent\n## Now\n- WI-7 in design.' }) });
  const { out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'notion', '--page', 'abc123'], withNtn(bin));
  assert.match(out, /^The project's Current State is \d+ days old\. Remove the lines that are no longer true with the managing-project-memory skill\.\nThe project's Current State:\nLast updated: 2026-01-02/);
});

test('session-start, notion: a failed or missing ntn prints one line and exits 0', () => {
  const { dir } = project();
  const failing = fakeNtn({ err: '401 unauthorized\n', code: 1 });
  for (const { PATH } of [withNtn(failing), baseEnv]) {
    const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'notion', '--page', 'abc123'], { PATH });
    assert.equal(code, 0);
    assert.equal(out, 'The Notion Current state page could not be read here. Read it with the managing-project-memory skill.\n');
  }
});

test('session-start: outside a Git repository it reads memory/ in the session folder; bad input prints one line', () => {
  const plain = join(scratch, 'not-a-repo');
  mkdirSync(plain);
  for (const memory of ['local', 'hindsight']) {
    const a = hook('session-start.mjs', { source: 'startup', cwd: plain }, ['--memory', memory]);
    assert.equal(a.code, 0);
    assert.equal(a.out, `memory/CURRENT_STATE.md is missing or empty in ${plain}.\n`, memory);
  }
  mkdirSync(join(plain, 'memory'));
  writeFileSync(join(plain, 'memory', 'CURRENT_STATE.md'), state());
  writeFileSync(join(plain, 'memory', 'project_billing.md'), record('How invoices are sent', 'status: current\n'));
  const found = hook('session-start.mjs', { source: 'startup', cwd: plain }, ['--memory', 'local']);
  assert.equal(found.code, 0);
  assert.equal(found.out, `The project's Current State:\n${state().trim()}\n\n${INDEX_HEAD}\n${BILLING}`);
  assert.equal(hook('session-start.mjs', { source: 'startup', cwd: plain }, ['--memory', 'hindsight']).out, `The project's Current State:\n${state().trim()}\n`);
  assert.equal(hook('session-start.mjs', { source: 'startup', cwd: plain }, ['--memory', 'notion']).out, 'The Notion Current state page could not be read here. Read it with the managing-project-memory skill.\n');
  for (const input of ['not json', '']) {
    const b = hook('session-start.mjs', input, ['--memory', 'local']);
    assert.equal(b.code, 0);
    assert.equal(b.out.trim().split('\n').length, 1, JSON.stringify(input));
  }
  const gone = hook('session-start.mjs', { source: 'startup', cwd: join(scratch, 'no-such-folder') }, ['--memory', 'local']);
  assert.equal(gone.code, 0);
  assert.match(gone.out, /^memory\/CURRENT_STATE\.md is missing or empty in .+no-such-folder\.\n$/);
});

/** A Current State with every part at its line limit: 36 lines, each line about 110 characters. */
function fullState() {
  const line = (n) => `- ${`Line ${n} of this part, written out to the length a long line of Current State can have`.padEnd(108, '.')}`;
  const part = (name, count) => `## ${name}\n\n${Array.from({ length: count }, (_, i) => line(i + 1)).join('\n')}\n`;
  return `# Current state\n\nLast updated: ${today}, handoff, agent\n\n${[['Now', 5], ['Coming up', 3], ['Waiting on', 4], ['Standing jobs and shared files', 3], ['Next session starts with', 3]].map(([name, count]) => part(name, count)).join('\n')}`;
}

test('session-start: 30 memory files and a full Current State print whole, under the 10,000-character hook limit', () => {
  const files = { 'CURRENT_STATE.md': fullState() };
  assert.equal(fullState().trim().split('\n').length, 36, 'five parts at their line limits stay under 40 lines');
  // Each file: a name of about 30 characters, a title of 24, and a description of 100.
  for (let i = 1; i <= 30; i++) {
    const name = `${['user', 'project', 'reference', 'event'][i % 4]}_a_record_about_topic_${String(i).padStart(2, '0')}`;
    files[`${name}.md`] = record('d'.repeat(100), 'status: current\n', `# A record about topic ${String(i).padStart(2, '0')}\n\n`);
  }
  const { dir } = project(files);
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.equal(code, 0);
  assert.ok(out.length < 9500, `output is ${out.length} characters`);
  assert.doesNotMatch(out, /Cut short|no longer true/);
  assert.equal(out.match(/^- \[A record about topic \d\d\]\((?:user|project|reference|event)_a_record_about_topic_\d\d\.md\): d{100} \(updated 2026-10-05\)$/gm).length, 30, 'every file has its whole line');
});

test('session-start: more files than fit are cut between two lines, under the 10,000-character hook limit', () => {
  const files = { 'CURRENT_STATE.md': state() };
  for (let i = 1; i <= 200; i++) files[`project_a_long_name_for_record_${String(i).padStart(3, '0')}.md`] = record('A long description of what this record holds for a later session', 'status: current\n');
  const { dir } = project(files);
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.equal(code, 0);
  assert.ok(out.length < 10000, `output is ${out.length} characters`);
  assert.match(out, /^The project's Current State:/);
  assert.match(out, /\n- \[x\]\(project_a_long_name_for_record_\d{3}\.md\): A long description of what this record holds for a later session \(updated 2026-10-05\)\n\[Cut short to fit the hook limit\. Read the rest yourself: memory\/MEMORY\.md and memory\/CURRENT_STATE\.md in the main checkout\.\]\n$/, 'the cut falls between two whole lines');
  assert.equal(readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8').match(/^- \[x\]\(project_a_long/gm).length, 200, 'the file holds every line');
});

test('session-start: a Current State longer than the hook limit keeps its prune request and names both files', () => {
  // 60 lines and about 12,000 characters: more than the host shows.
  const { dir } = project({ 'CURRENT_STATE.md': state(today, `- ${'word '.repeat(40)}\n`.repeat(60)), 'project_billing.md': record('How invoices are sent', 'status: current\n') });
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.equal(code, 0);
  assert.ok(out.length < 10000, `output is ${out.length} characters`);
  assert.match(out, /^The project's Current State is 6\d lines \(limit: under 40\)\. Remove the lines that are no longer true with the managing-project-memory skill\.\nThe project's Current State:\n# Current state\n/);
  assert.ok(out.endsWith('\n[Cut short to fit the hook limit. Read the rest yourself: memory/MEMORY.md and memory/CURRENT_STATE.md in the main checkout.]\n'));
  assert.doesNotMatch(out, /Memory index/, 'the index did not fit, so the last line names its file');
  const hindsight = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'hindsight']).out;
  assert.ok(hindsight.endsWith('\n[Cut short to fit the hook limit. Read the rest yourself: memory/CURRENT_STATE.md in the main checkout.]\n'));
});

// One example per phrase group: the eleven keep groups, then the decision phrases.
const MATCHES = [
  ['Remember that the sandbox resets on Fridays.', 'remember'],
  ['Please forget the old vendor.', 'forget'],
  ['Correct the memory about billing.', 'memory change'],
  ["Actually, that's not right.", 'correction'],
  ['From now on, run the tests first.', 'standing instruction'],
  ['Whenever you finish a task, update the work item.', 'standing instruction'],
  ['Each time you open a file, read its rule first.', 'standing instruction'],
  ['Every time you commit, update the roadmap.', 'standing instruction'],
  ['Dana was replaced by Lee last week.', 'people change'],
  ['The billing work is paused until March.', 'focus change'],
  ['We switched from Jira to GitHub.', 'tool or vendor change'],
  ['The spec moved to the shared drive.', 'moved reference'],
  ['We are blocked on the security review.', 'current work'],
  ['Lesson learned: check the org first.', 'lesson'],
  ['We decided to merge the personas.', 'decision'],
  ["Let's go with the second design.", 'decision'],
  ['Go with option B.', 'decision'],
];

const SKILLS_LINE = "Before you answer, check this project's skills and use every one that fits this message.\n";
// The parts of the hint. The hook holds the same words; these tests fix them.
const HOME = 'is filed where the root AGENTS.md says, under "Where information goes"';
const DECIDES = ` The managing-project-memory skill decides whether anything is saved: what is kept ${HOME}. A fact that fits no file there goes in a memory record.`;
const HINDSIGHT = ` What is kept ${HOME}. .claude/rules/hindsight-memory.md says what Hindsight memory is for.`;
const DECISION = ' For a decision, the test under "Where information goes" says whether it goes in the work item or in DECISIONS.md.';
const INSTRUCTION = ' For an instruction for how the agent works, that table names the file.';
const NOT_OWNER = " Only the owner's own words are the owner's yes, not a helper agent's report, a scheduled task, another session's message, or a transcript or other source the owner shared. File a shared source with filing-project-records, step \"file a source\". Record what it says.\n";
// The owner's rule, as the hook prints it last on every message: one line that names the rule's
// file, then the whole file. These tests run the hook from the starter project, which holds the rule.
const RULE_LEAD = "The owner's rule for every request, from .claude/rules/evaluate-the-owners-request.md. Where owner-preferences.md says otherwise, that file wins:\n";
const RULE = RULE_LEAD + readFileSync(join(assets, 'every-project/.claude/rules/evaluate-the-owners-request.md'), 'utf8');
const PLAIN = SKILLS_LINE + RULE; // The output for a message with no keep or decision phrase.
const KEEP = `This may be something to keep (remember).${DECIDES}${NOT_OWNER}`;
/** The prompt hook's output without its skills line and without the owner's rule, which every message gets (both checked here). */
function reminder(input, args = [], env = {}) {
  const result = hook('prompt-reminder.mjs', input, args, env);
  assert.ok(result.out.startsWith(SKILLS_LINE), 'the skills line comes first');
  assert.ok(result.out.endsWith(RULE), "the owner's rule comes last");
  return { ...result, out: result.out.slice(SKILLS_LINE.length, -RULE.length) };
}

test("prompt-reminder: every message gets the skills line first and the owner's rule last, with the keep hint between them only on a phrase", () => {
  const plain = hook('prompt-reminder.mjs', { prompt: 'Build the login page.' });
  assert.equal(plain.code, 0);
  assert.equal(plain.out, PLAIN);
  assert.equal(hook('prompt-reminder.mjs', { prompt: 'Build the login page.' }, ['--skill', 'hindsight']).out, PLAIN);
  assert.equal(hook('prompt-reminder.mjs', { prompt: '' }).out, PLAIN);
  const memory = hook('prompt-reminder.mjs', { prompt: 'Remember that the sandbox resets on Fridays.' });
  assert.equal(memory.out, `${SKILLS_LINE}${KEEP}${RULE}`);
  // A message with every phrase group gets the longest output. Claude Code cuts a hook's output at 10,000 characters.
  const longest = hook('prompt-reminder.mjs', { prompt: MATCHES.map(([prompt]) => prompt).join(' ') }).out;
  assert.ok(longest.includes('moved reference, current work, lesson, decision)') && longest.length < 5000, `${longest.length} characters`);
});

test("prompt-reminder: the owner's rule is read from the project's own rule file; with no rule file the output is what it was before", () => {
  // A scratch project that holds only the hook, and then the rule file with each text in turn.
  const dir = join(scratch, 'rule-project', '.claude');
  for (const folder of ['hooks', 'rules']) mkdirSync(join(dir, folder), { recursive: true });
  writeFileSync(join(dir, 'hooks', 'prompt-reminder.mjs'), readFileSync(join(hooks, 'prompt-reminder.mjs')));
  const run = (prompt) => spawnSync(process.execPath, [join(dir, 'hooks', 'prompt-reminder.mjs')], { input: JSON.stringify({ prompt }), encoding: 'utf8', env: baseEnv, cwd: scratch });
  for (const [rule, printed] of [[null, ''], ['', ''], ['\n\n', ''], ['# My rule\n\nAsk before every merge.\n', `${RULE_LEAD}# My rule\n\nAsk before every merge.\n`]]) {
    if (rule !== null) writeFileSync(join(dir, 'rules', 'evaluate-the-owners-request.md'), rule);
    const [plain, kept] = [run('Build the login page.'), run('Remember that the sandbox resets on Fridays.')];
    assert.deepEqual([plain.status, plain.stdout, plain.stderr], [0, SKILLS_LINE + printed, ''], JSON.stringify(rule));
    assert.deepEqual([kept.status, kept.stdout, kept.stderr], [0, SKILLS_LINE + KEEP + printed, ''], JSON.stringify(rule));
  }
});

test("this repository's own UserPromptSubmit entry prints the same first line and the starter rule, and nothing when the rule's path is wrong", () => {
  const { command, args } = JSON.parse(readFileSync(join(repo, '.claude/settings.json'), 'utf8')).hooks.UserPromptSubmit[0].hooks[0];
  assert.equal(command, 'node');
  for (const [dir, printed] of [[repo, RULE], [join(scratch, 'no-such-project'), '']]) {
    // Claude Code puts the project folder in place of the placeholder and runs the command with no shell.
    const { status, stdout, stderr } = spawnSync(process.execPath, args.map((arg) => arg.replace('${CLAUDE_PROJECT_DIR}', dir)), { input: '{"prompt":"hello"}', encoding: 'utf8', env: baseEnv, cwd: scratch });
    assert.deepEqual([status, stdout, stderr], [0, printed, ''], dir);
  }
});

test('prompt-reminder: every phrase group gives one reminder naming the skill and the filing table', () => {
  for (const [prompt, label] of MATCHES) {
    const { code, out } = reminder({ prompt });
    assert.equal(code, 0);
    assert.equal(out.split('\n').length, 2, prompt);
    assert.match(out, new RegExp(`^This may be something to keep \\((?:[a-z ]+, )*${label}(?:, [a-z ]+)*\\)\\. The managing-project-memory skill decides whether anything is saved: what is kept is filed where the root AGENTS\\.md says, under "Where information goes"\\.`), prompt);
    assert.ok(out.endsWith(NOT_OWNER), prompt);
  }
});

test('prompt-reminder: an older settings entry that still names a retired skill gets managing-project-memory', () => {
  for (const skill of ['local-memory-save', 'notion-memory-save']) {
    assert.ok(reminder({ prompt: 'Remember that the sandbox resets on Fridays.' }, ['--skill', skill]).out.includes(DECIDES), skill);
  }
});

test('prompt-reminder: case, curly apostrophes, and "lets" without an apostrophe still match', () => {
  for (const prompt of ['FROM NOW ON use the sandbox.', 'Let’s go with the plan.', 'lets go with it', 'WE DECIDED yesterday.']) {
    assert.ok(reminder({ prompt }).out.includes(DECIDES), prompt);
  }
});

test('prompt-reminder: a decision adds the line that points to the filing test', () => {
  assert.equal(reminder({ prompt: 'We decided to use six permission sets.' }).out, `This may be something to keep (decision).${DECIDES}${DECISION}${NOT_OWNER}`);
  for (const prompt of ['From now on always run the tests first.', 'Remember that the sandbox resets on Fridays.']) {
    assert.ok(!reminder({ prompt }).out.includes('DECISIONS.md'), prompt);
  }
});

test('prompt-reminder, hindsight: names the rule file, never a memory skill or "the memory rule"', () => {
  const { out } = reminder({ prompt: 'We decided to use six permission sets.' }, ['--skill', 'hindsight']);
  assert.equal(out, `This may be something to keep (decision).${HINDSIGHT}${DECISION}${NOT_OWNER}`);
  assert.doesNotMatch(out, /managing-project-memory|managing-project-memory|the memory rule|pointer/);
});

test('prompt-reminder: no text names a section, rule, or skill the starter project does not have', () => {
  const every = [DECIDES, HINDSIGHT, DECISION, INSTRUCTION, NOT_OWNER].join('');
  assert.match(readFileSync(join(assets, 'every-project/AGENTS.md'), 'utf8'), /^## Where information goes$/m);
  // The hint points to the root's table and filing test. The root holds both, and the row for an instruction.
  const root = readFileSync(join(assets, 'every-project/AGENTS.md'), 'utf8');
  assert.match(root, /The test: would an agent working on a different work item need to know this\?/);
  assert.match(root, /\| The owner's preference for how the agent works .*\| `\.claude\/rules\/owner-preferences\.md`\./);
  const paths = { '.claude/rules/hindsight-memory.md': 'memory-hindsight', 'DECISIONS.md': 'every-project' };
  for (const [path, folder] of Object.entries(paths)) {
    assert.ok(every.includes(path), path);
    assert.ok(existsSync(join(assets, folder, path)), path);
  }
  const skills = { 'managing-project-memory': 'memory-process', 'filing-project-records': 'every-project' };
  for (const [skill, folder] of Object.entries(skills)) {
    assert.ok(every.includes(skill), skill);
    assert.ok(existsSync(join(assets, folder, '.claude/skills', skill, 'SKILL.md')), skill);
  }
  const filing = readFileSync(join(assets, 'every-project/.claude/skills/filing-project-records/SKILL.md'), 'utf8');
  for (const step of ['File a source']) {
    assert.ok(every.includes(`step "${step[0].toLowerCase()}${step.slice(1)}"`), step);
    assert.ok(filing.includes(`| ${step} |`), `filing-project-records has the step ${step}`);
  }
});

test('prompt-reminder: a standing instruction adds the line that points to the root table', () => {
  for (const [args, base] of [[[], DECIDES], [['--skill', 'hindsight'], HINDSIGHT]]) {
    const { out } = reminder({ prompt: 'From now on always run the tests first.' }, args);
    assert.equal(out, `This may be something to keep (standing instruction).${base}${INSTRUCTION}${NOT_OWNER}`, args.join(' '));
  }
  assert.ok(!reminder({ prompt: 'We decided to use six permission sets.' }).out.includes(INSTRUCTION));
});

test('prompt-reminder: a transcript pasted without markers gets the line on words that are not the owner\'s', () => {
  const notes = 'Here are the meeting notes from the client:\nSarah: OK, we decided to move all 15 personas.\nTom: Going forward the new org is the source.\nPlease refine this.';
  for (const args of [[], ['--skill', 'hindsight']]) {
    assert.ok(reminder({ prompt: notes }, args).out.endsWith(NOT_OWNER), args.join(' '));
  }
});

// Claude Code also runs UserPromptSubmit on turns it starts itself: a scheduled task, a background
// helper's report, a message from another session. Its input gives the hook no field that tells
// those turns from a typed one, so the hook treats every turn the same and its text is true for both.
test("prompt-reminder: a turn the app started gets the same lines, and they say such words are not the owner's yes", () => {
  const report = 'The background helper finished. Root cause: the trigger ran twice. We decided to go with option B.';
  const fields = { hook_event_name: 'UserPromptSubmit', session_id: 'abc123', cwd: scratch, permission_mode: 'default', prompt_id: 'p-1', session_title: 'Nightly check' };
  const typed = hook('prompt-reminder.mjs', { prompt: report });
  const started = hook('prompt-reminder.mjs', { ...fields, prompt: report });
  assert.equal(started.code, 0);
  assert.equal(started.out, typed.out, 'no input field changes the output');
  assert.match(started.out, /Only the owner's own words are the owner's yes, not a helper agent's report, a scheduled task, another session's message,/);
  assert.equal(hook('prompt-reminder.mjs', { ...fields, prompt: 'Run the nightly check of the open pull requests.' }).out, PLAIN);
  for (const prompt of [null, 42, ['a', 'b'], { text: 'x' }]) {
    const odd = hook('prompt-reminder.mjs', { ...fields, prompt });
    assert.equal(odd.code, 0, JSON.stringify(prompt));
    assert.equal(odd.out, PLAIN, JSON.stringify(prompt));
  }
  assert.equal(hook('prompt-reminder.mjs', fields).out, PLAIN, 'no prompt field at all');
});

test('prompt-reminder: a question about a past decision prints nothing; a new decision still does', () => {
  assert.equal(reminder({ prompt: 'remind me what we decided about the sales personas' }).out, '');
  assert.match(reminder({ prompt: 'we decided to merge the two sales personas' }).out, /\(decision\)/);
  assert.match(reminder({ prompt: "ok so here's what we decided: merge the two sales personas" }).out, /\(decision\)/);
  assert.equal(reminder({ prompt: 'can you tell me what we decided on WI-002' }).out, '');
  for (const prompt of ['can you explain why we decided to merge the personas?', 'why we decided to merge the personas?', 'is that what we decided?', 'wait is that what we decided last week', 'how we decided on pricing, can you find it', 'explain what we decided about pricing', 'what did we decide about the personas?']) {
    assert.equal(reminder({ prompt }).out, '', prompt);
  }
  for (const prompt of ["this is what we decided, merge the two sales personas", 'What we decided yesterday was to keep both personas']) {
    assert.match(reminder({ prompt }).out, /\(decision\)/, prompt);
  }
});

test('prompt-reminder: a plain question or a statement about a habit gets no keep hint', () => {
  const quiet = ['what is the root cause of the failure?', 'Do you remember the name of the flow?', 'do you remember the name of the flow', "I don't remember the name of the flow.", 'I never use tabs.', 'We always use the sandbox first.', 'Was it paused last week?', 'Should we forget the old vendor?'];
  for (const prompt of quiet) assert.equal(reminder({ prompt }).out, '', prompt);
  // The same words as a statement or an instruction still get the hint.
  for (const [prompt, label] of [['The root cause was the trigger.', 'lesson'], ['Remember the name of the flow: Order Sync.', 'remember'], ['Never use tabs.', 'standing instruction'], ['Is that clear? From now on, ask first.', 'standing instruction'], ['From now on use https://example.com/a?b=1 for the docs.', 'standing instruction']]) {
    assert.match(reminder({ prompt }).out, new RegExp(`^This may be something to keep \\(${label}\\)\\.`), prompt);
  }
});

test('prompt-reminder: a request phrased as a question gets the keep hint; a plain question does not', () => {
  const asked = [['From now on, can you always ask before you merge?', 'standing instruction'], ['Can you remember that the sandbox resets on Fridays?', 'remember'], ['Could you forget the old vendor name?', 'forget'], ['Please never use tabs, ok?', 'standing instruction'], ['It works. Going forward, should every deploy wait for my yes?', 'standing instruction'], ['Always ask before you merge, ok?', 'standing instruction'], ['Never use tabs here, right?', 'standing instruction']];
  for (const [prompt, label] of asked) assert.match(reminder({ prompt }).out, new RegExp(`^This may be something to keep \\(${label}\\)\\.`), prompt);
  for (const prompt of ['Do you remember the name of the flow?', 'Can you tell me what we decided on WI-002?', 'Could you explain why we decided to merge the personas?', 'Did the deploy finish? What is left?', 'Can you build the login page?', 'Do we always use the sandbox first?', 'Did it never finish?']) assert.equal(reminder({ prompt }).out, '', prompt);
  // The rule is one list of request words, so a request for work that holds a keep phrase also gets the hint.
  assert.match(reminder({ prompt: 'Can you find the root cause?' }).out, /\(lesson\)/);
});

test('prompt-reminder: "whenever you finish" is an instruction; "whenever you are ready" is not', () => {
  for (const prompt of ["Come by whenever you're ready.", 'Start whenever you are ready.', 'Tell me whenever you can.', 'Ping me whenever you get a chance.', 'Look at it whenever you have a minute.', 'Whenever you']) {
    assert.equal(reminder({ prompt }).out, '', prompt);
  }
  for (const args of [[], ['--skill', 'hindsight']]) {
    const { out } = reminder({ prompt: 'Whenever you finish a task, run the tests.' }, args);
    assert.ok(out.startsWith('This may be something to keep (standing instruction). '), args.join(' '));
    assert.ok(out.includes(INSTRUCTION), args.join(' '));
  }
});

test('prompt-reminder: no memory hint for other messages or pasted text; bad input prints nothing and exits 0', () => {
  for (const prompt of ['Build the login page.', 'What did we cover yesterday?', 'Can you rememberize this?', '']) {
    assert.equal(reminder({ prompt }).out, '', prompt);
  }
  const pasted = 'Here are the meeting notes:\n<pasted_content id="1">\nWe decided to move all 15 personas. From now on use the new org.\n</pasted_content id="1">\nSummarize them.';
  assert.equal(reminder({ prompt: pasted }).out, '');
  for (const input of ['not json', '', '{"prompt":']) {
    const bad = hook('prompt-reminder.mjs', input);
    assert.equal(bad.code, 0, input);
    assert.equal(bad.out, '', `no skills line and no rule when the input cannot be read: ${input}`);
  }
});

const AFTER_COMMIT = '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"A git commit command just ran. If the commit succeeded, update the work item\'s Recent History and status with managing-work-items, and the work item\'s line in the project\'s Current State when that line changed."}}\n';

test('codex-after-commit: a git commit prints the fixed reminder JSON', () => {
  for (const command of ['git commit -m "Add login"', 'git -C /repo/.claude/worktrees/x commit -m "x"', 'npm test && git commit -F msg.txt', 'git -c user.name=Owner commit', 'git --no-pager commit\n', ['bash', '-lc', 'git commit -m y']]) {
    const { code, out } = hook('codex-after-commit.mjs', { hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command } });
    assert.equal(code, 0);
    assert.equal(out, AFTER_COMMIT, JSON.stringify(command));
  }
  assert.deepEqual(JSON.parse(AFTER_COMMIT).hookSpecificOutput.hookEventName, 'PostToolUse');
});

test('codex-after-commit: the text does not claim the commit worked, whatever result the host passes', () => {
  // Codex runs PostToolUse after a Bash command that failed too, and the result's form is not fixed.
  const input = { hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command: 'git commit -m "x"' } };
  for (const tool_response of [undefined, 'nothing to commit, working tree clean', { exit_code: 1, stderr: 'error' }, { stdout: '[main 1a2b3c4] x' }]) {
    assert.equal(hook('codex-after-commit.mjs', { ...input, tool_response }).out, AFTER_COMMIT);
  }
  const text = JSON.parse(AFTER_COMMIT).hookSpecificOutput.additionalContext;
  assert.match(text, /^A git commit command just ran\. If the commit succeeded, /);
  assert.doesNotMatch(text, /a commit that worked|was committed|is committed/);
});

test('codex-after-commit: a commit made inside a helper agent (agent_id in the input) prints nothing', () => {
  const input = { hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command: 'git commit -m "x"' } };
  assert.equal(hook('codex-after-commit.mjs', { ...input, agent_id: 'agent-abc123' }).out, '');
  assert.equal(hook('codex-after-commit.mjs', input).out, AFTER_COMMIT);
});

test('codex-after-commit: other commands and bad input print nothing', () => {
  for (const command of ['git status', 'git log --grep "commit"', 'echo $(date)', 'cd "$(git rev-parse --show-toplevel)" && ls', 'git commit-tree abc', undefined]) {
    assert.equal(hook('codex-after-commit.mjs', { tool_name: 'Bash', tool_input: { command } }).out, '', String(command));
  }
  const bad = hook('codex-after-commit.mjs', 'not json');
  assert.equal(bad.code, 0);
  assert.equal(bad.out, '');
});

test('codex-after-commit: a long run of git options stays fast', () => {
  // The limit is for the pattern, which took minutes when it was slow. Starting Node alone can take
  // seconds on a busy Windows computer, so each command is timed against a plain one, and the
  // fastest of three runs counts.
  const fastest = (command) => Math.min(...[1, 2, 3].map(() => {
    const started = Date.now();
    assert.equal(hook('codex-after-commit.mjs', { tool_name: 'Bash', tool_input: { command } }).out, '');
    return Date.now() - started;
  }));
  const plain = fastest('git status');
  for (const command of [`git${' --a'.repeat(40)} status`, `git${' -c -a'.repeat(40)} status`]) {
    const extra = fastest(command) - plain;
    assert.ok(extra < 1000, `${command.slice(0, 20)}... took ${extra} ms longer than "git status"`);
  }
  for (const command of ['git --git-dir=/a/.git commit', 'git -C a -c b=c --no-pager commit --amend']) {
    assert.equal(hook('codex-after-commit.mjs', { tool_name: 'Bash', tool_input: { command } }).out, AFTER_COMMIT, command);
  }
});

// The prompt reminder names managing-project-memory itself, so local and Notion entries pass no
// skill name, and renaming the skill needs no new hook trust in Codex.
const MEMORY = { local: [], notion: [], hindsight: ['--skill', 'hindsight'] };

test('Claude Code settings snippets: the right commands, arguments, and texts for each memory choice', () => {
  for (const [memory, reminderArgs] of Object.entries(MEMORY)) {
    const { hooks: h, ...rest } = JSON.parse(readFileSync(join(settings, `claude-settings-hooks.${memory}.json`), 'utf8'));
    assert.deepEqual(Object.keys(rest), []);
    // Mike dropped the end-of-reply check (a Stop hook of type prompt) on 2026-10-01: only command handlers.
    // The one Stop hook is the record check (his yes, 2026-10-05); dev/tests/validate-records.test.mjs tests its entries.
    assert.deepEqual(Object.keys(h).sort(), ['PostToolUse', 'SessionStart', 'Stop', 'UserPromptSubmit']);
    const start = h.SessionStart[0];
    assert.equal(start.matcher, 'startup|resume|clear|compact|fork');
    assert.deepEqual(start.hooks[0].args.slice(0, 3), ['${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.mjs', '--memory', memory]);
    if (memory === 'notion') assert.deepEqual(start.hooks[0].args.slice(3), ['--page', '{{CURRENT_STATE_PAGE_ID}}']);
    assert.deepEqual(h.UserPromptSubmit[0].hooks[0].args, ['${CLAUDE_PROJECT_DIR}/.claude/hooks/prompt-reminder.mjs', ...reminderArgs]);
    assert.equal(h.UserPromptSubmit[0].matcher, undefined);
    assert.equal(h.PostToolUse.length, 3);
    const [bash, agent] = h.PostToolUse;
    assert.equal(bash.matcher, 'Bash');
    assert.equal(bash.hooks[0].if, 'Bash(git *)');
    assert.deepEqual(bash.hooks[0].args, ['${CLAUDE_PROJECT_DIR}/.claude/hooks/codex-after-commit.mjs']);
    assert.equal(agent.matcher, 'Agent');
    assert.equal(agent.hooks[0].command, 'echo');
    const agentOut = execFileSync(agent.hooks[0].command, agent.hooks[0].args, { encoding: 'utf8', env: baseEnv });
    assert.deepEqual(JSON.parse(agentOut), { hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: "A helper agent ran or was started. If it works on a work item or sub-item, update that item's status, Recent History, and Current state with managing-work-items once its report is in. A helper with no work item of its own (a researcher, reviewer, critic, checker, or verifier) needs nothing." } });
    for (const group of Object.values(h).flat()) for (const handler of group.hooks) {
      assert.equal(handler.type, 'command', 'only command hooks: the end-of-reply prompt hook is dropped');
      for (const a of handler.args ?? []) if (a.includes('/.claude/hooks/')) assert.ok(existsSync(join(hooks, a.split('/.claude/hooks/')[1])), a);
    }
  }
});

const CODEX_HELPER = JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: 'A helper agent ran or was started. If it works on a work item or sub-item, update the status, Recent History, and Current state of that item with managing-work-items once its report is in. A helper with no work item of its own (a researcher, reviewer, critic, checker, or verifier) needs nothing.' } });

test('Codex hook snippets: shell strings from the Git root, anchored matchers, no prompt hooks', () => {
  for (const [memory, reminderArgs] of Object.entries(MEMORY)) {
    const file = JSON.parse(readFileSync(join(settings, `codex-hooks.${memory}.json`), 'utf8'));
    assert.deepEqual(Object.keys(file), ['description', 'hooks'], 'only description and hooks at the top level');
    const h = file.hooks;
    assert.deepEqual(Object.keys(h).sort(), ['PostToolUse', 'SessionStart', 'UserPromptSubmit']);
    assert.equal(h.SessionStart[0].matcher, '^(startup|resume|clear|compact)$');
    assert.equal(h.PostToolUse[0].matcher, '^Bash$');
    // The helper reminder: spawn_agent (a helper starts) and wait_agent (its report comes back),
    // an echo of fixed JSON in single quotes, so its text has no apostrophe. Codex 0.157.0 names
    // the tools collaborationspawn_agent and collaborationwait_agent in hook input (cx-hooks).
    // The third entry is the record check after apply_patch (dev/tests/validate-records.test.mjs).
    assert.equal(h.PostToolUse.length, 3);
    const agent = h.PostToolUse[1];
    assert.equal(agent.matcher, '^(collaboration)?(spawn_agent|wait_agent)$');
    assert.equal(agent.hooks.length, 1);
    assert.equal(agent.hooks[0].type, 'command');
    assert.equal(agent.hooks[0].command, `echo '${CODEX_HELPER}'`);
    const commands = Object.values(h).flat().filter((g) => g !== agent).flatMap((g) => g.hooks);
    for (const c of commands) {
      assert.equal(c.type, 'command');
      assert.equal(c.args, undefined);
      assert.match(c.command, /^node "\$\(git rev-parse --show-toplevel\)\/\.claude\/hooks\/[a-z-]+\.mjs"/);
      assert.ok(existsSync(join(hooks, c.command.match(/hooks\/([a-z-]+\.mjs)/)[1])));
    }
    assert.match(h.SessionStart[0].hooks[0].command, new RegExp(`--memory ${memory}${memory === 'notion' ? ' --page \\{\\{CURRENT_STATE_PAGE_ID\\}\\}' : ''}$`));
    assert.ok(h.UserPromptSubmit[0].hooks[0].command.endsWith(['prompt-reminder.mjs"', ...reminderArgs].join(' ')), memory);
  }
});

test('Codex hook snippet commands run as written from a scratch project', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state() });
  mkdirSync(join(dir, '.claude', 'hooks'), { recursive: true });
  for (const file of readdirSync(hooks)) writeFileSync(join(dir, '.claude', 'hooks', file), readFileSync(join(hooks, file)));
  const h = JSON.parse(readFileSync(join(settings, 'codex-hooks.local.json'), 'utf8')).hooks;
  const sh = (command, input) => spawnSync(SH, ['-c', command], { cwd: dir, input: JSON.stringify(input), encoding: 'utf8', env: { ...baseEnv, PATH: [dirname(process.execPath), baseEnv.PATH].join(delimiter) } }).stdout;
  assert.match(sh(h.SessionStart[0].hooks[0].command, { source: 'startup', cwd: dir }), /^The project's Current State:/);
  assert.match(sh(h.UserPromptSubmit[0].hooks[0].command, { prompt: 'From now on, ask first.' }), /managing-project-memory/);
  assert.match(sh(JSON.parse(readFileSync(join(settings, 'codex-hooks.hindsight.json'), 'utf8')).hooks.UserPromptSubmit[0].hooks[0].command, { prompt: 'From now on, ask first.' }), /hindsight-memory\.md/);
  assert.equal(sh(h.PostToolUse[0].hooks[0].command, { tool_input: { command: 'git commit -m x' } }), AFTER_COMMIT);
  assert.equal(sh(h.PostToolUse[1].hooks[0].command, { tool_name: 'collaborationspawn_agent', tool_input: {} }), `${CODEX_HELPER}\n`);
});

test('the starter settings.json and the Salesforce Codex hooks name only commands the setup folders hold', () => {
  const starter = JSON.parse(readFileSync(join(assets, 'every-project/.claude/settings.json'), 'utf8'));
  // The starter file holds the Salesforce entries; setup takes them out of a project that is not one.
  assert.deepEqual(Object.keys(starter.hooks).sort(), ['PreToolUse', 'Stop']);
  const commands = Object.values(starter.hooks).flat().flatMap((group) => group.hooks.map((h) => h.command));
  assert.equal(commands.length, 3);
  for (const command of commands) {
    const file = command.match(/"\$CLAUDE_PROJECT_DIR\/([^"]+)"/)[1];
    assert.ok(existsSync(join(assets, 'salesforce', file)), `${file} is in the salesforce folder`);
  }
  assert.equal(starter.hooks.PreToolUse[0].matcher, 'Bash|PowerShell');
  assert.equal(starter.autoMemoryEnabled, false);
  assert.equal(starter.outputStyle, 'Plain English');
  assert.ok(existsSync(join(assets, 'every-project/.claude/output-styles/plain-english.md')));
  for (const never of ['Bash(git add -A)', 'Bash(git add .)', 'Bash(git commit -a *)', 'Bash(git push --force *)']) assert.ok(starter.permissions.deny.includes(never), never);
  const codex = JSON.parse(readFileSync(join(assets, 'salesforce/.codex/hooks.json'), 'utf8'));
  assert.deepEqual(Object.keys(codex), ['description', 'hooks'], 'only description and hooks at the top level');
  assert.deepEqual(Object.keys(codex.hooks), ['PreToolUse']);
  assert.equal(codex.hooks.PreToolUse[0].matcher, '^Bash$');
  const guards = codex.hooks.PreToolUse[0].hooks;
  assert.deepEqual(guards.map((g) => g.command.match(/hooks\/([a-z-]+\.cjs)" --host codex$/)[1]), ['guard-protected-orgs.cjs', 'guard-permission-set-deploy.cjs']);
  for (const g of guards) {
    assert.equal(g.type, 'command');
    assert.match(g.command, /^node "\$\(git rev-parse --show-toplevel\)\/\.claude\/hooks\//);
    assert.ok(existsSync(join(assets, 'salesforce/.claude/hooks', g.command.match(/hooks\/([a-z-]+\.cjs)/)[1])));
  }
});

test('plugin switches: every old claude-toolkit plugin is off in both hosts; Codex also raises the skills limit', () => {
  const claude = JSON.parse(readFileSync(join(settings, 'enabled-plugins-off.json'), 'utf8'));
  assert.deepEqual(Object.keys(claude), ['enabledPlugins']);
  for (const [name, on] of Object.entries(claude.enabledPlugins)) {
    assert.match(name, /^[a-z-]+@claude-toolkit$/);
    assert.equal(on, false);
  }
  const toml = readFileSync(join(settings, 'codex-plugins-off.toml'), 'utf8');
  const tables = [...toml.matchAll(/^\[plugins\."([a-z-]+@claude-toolkit)"\]\nenabled = false$/gm)].map((m) => m[1]);
  assert.ok(tables.length > 0);
  for (const name of tables) assert.ok(name in claude.enabledPlugins, `${name} is off in Claude Code too`);
  assert.deepEqual([...tables].sort(), Object.keys(claude.enabledPlugins).sort(), 'both hosts turn off the same plugins');
  // Codex only (baseline review 2.26, A13): 10000 tokens is the most `skills.max_context_tokens`
  // allows, so fewer skill descriptions are cut.
  assert.match(toml, /^\[skills\]\nmax_context_tokens = 10000$/m, 'room for every skill description');
  assert.equal(toml.split('\n').filter((line) => line && !line.startsWith('#')).length, tables.length * 2 + 2, 'no other lines');
});

test('the Salesforce snippet: the marketplace, exactly the seven plugins the owner uses, and the two variables', () => {
  const snippet = JSON.parse(readFileSync(join(settings, 'claude-settings-salesforce.json'), 'utf8'));
  assert.deepEqual(Object.keys(snippet).sort(), ['enabledPlugins', 'env', 'extraKnownMarketplaces']);
  const names = ['dx-devops', 'experience-lwc', 'integration', 'platform-lightning-widgets', 'platform-trust-security', 'salesforce-code-quality', 'salesforce-development'];
  assert.deepEqual(snippet.enabledPlugins, Object.fromEntries(names.map((name) => [`${name}@salesforce`, true])));
  assert.deepEqual(snippet.extraKnownMarketplaces, { salesforce: { source: { source: 'github', repo: 'forcedotcom/sf-skills' } } });
  // The plugin's automatic deploy runs only for "1". Its telemetry is off for any value that is not empty.
  assert.deepEqual(snippet.env, { SFDX_AUTO_DEPLOY: '0', SF_DISABLE_TELEMETRY: 'true' });
  // The settings file every project gets holds none of these keys: each plugin entry comes from a snippet.
  const starter = JSON.parse(readFileSync(join(assets, 'every-project/.claude/settings.json'), 'utf8'));
  for (const key of Object.keys(snippet)) assert.equal(starter[key], undefined, `the every-project settings file holds no ${key}`);
});

// Lines are at most 100 characters, so the line counts are honest. The limits are the sizes with
// every job kept; the line count was replaced by the Code limit rules (dev/GOAL.md, "Code limit");
// the limits below are the sizes as built.
test('size limit: each hook command stays small', () => {
  // validate-records.mjs: the owner's limit for the record check is 280 lines (CHECKS-SPEC.md).
  const limits = { 'session-start.mjs': 76, 'prompt-reminder.mjs': 72, 'codex-after-commit.mjs': 20, 'validate-records.mjs': 280 };
  assert.deepEqual(readdirSync(hooks).sort(), Object.keys(limits).sort(), 'exactly four hook commands');
  for (const [file, max] of Object.entries(limits)) {
    const lines = readFileSync(join(hooks, file), 'utf8').trimEnd().split('\n');
    assert.ok(lines.length <= max, `${file} has ${lines.length} lines (limit ${max})`);
    lines.forEach((line, i) => assert.ok(line.length <= 100, `${file} line ${i + 1} is over 100 characters`));
  }
});

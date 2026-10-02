// Tests for the three project hook commands and their settings snippets.
// Run from the repository root: node --test dev/tests/hooks.test.mjs
// Every run works in a temporary folder (a scratch Git repository with a memory/ folder) and
// points HOME there, so nothing on this Mac outside that folder changes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const assets = join(repo, 'plugins/toolkit/skills/project-setup/assets');
const hooks = join(assets, 'hooks');
const settings = join(assets, 'settings');
const MODEL_INDEX = [join(assets, 'model/memory/MEMORY.md'), '/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved/memory/MEMORY.md'].find(existsSync);
const scratch = mkdtempSync(join(tmpdir(), 'tkv2-hooks-'));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));
const gitPath = dirname(execFileSync('which', ['git'], { encoding: 'utf8' }).trim());
const baseEnv = { HOME: scratch, PATH: `${gitPath}:/usr/bin:/bin`, GIT_CONFIG_NOSYSTEM: '1' };

let count = 0;
/** A new scratch project: a Git repository with one commit and a memory/ folder kept out of Git. */
function project(files = {}) {
  const dir = join(scratch, `project-${++count}`);
  mkdirSync(join(dir, 'memory'), { recursive: true });
  const git = (...args) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], { cwd: dir, env: baseEnv, stdio: 'pipe' });
  git('init', '-q', '-b', 'main');
  writeFileSync(join(dir, '.gitignore'), 'memory/\n');
  git('add', '.gitignore');
  git('commit', '-q', '-m', 'Start');
  const memory = { 'MEMORY.md': MODEL_INDEX ? readFileSync(MODEL_INDEX, 'utf8') : '', ...files };
  for (const [name, text] of Object.entries(memory)) writeFileSync(join(dir, 'memory', name), text);
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
const record = (name, description, status = 'current', updated = '2026-09-29') => `---\nname: ${name}\ndescription: ${description}\nupdated: ${updated}\nmetadata:\n  type: ${name.split('_')[0]}\nstatus: ${status}\nwork_items:\n  - "[[WI-031]]"\n---\n\n# ${name}\n`;

test('session-start, local: rebuilds MEMORY.md grouped by prefix and prints Current State and the index', () => {
  const { dir } = project({
    'CURRENT_STATE.md': state(),
    'user_profile.md': record('user_profile', 'Who the owner is'),
    'project_billing.md': record('project_billing', 'How billing works', 'current', '2026-09-28'),
    'decision_permission_model.md': record('decision_permission_model', 'Merge the 15 personas into 6 permission sets'),
    'project_old_plan.md': record('project_old_plan', 'The old plan', 'superseded'),
    'project_topic_template.md': record('project_topic_template', 'What future sessions would look here to remember', 'template'),
    'decision_template.md': record('decision_template', 'The decision in one short line', 'template'),
    'memory-criteria.md': '# Memory criteria\n',
  });
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.equal(code, 0);
  assert.match(out, /^Current State:\n# Current state/);
  assert.match(out, /- WI-031 in build\./);
  const index = readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8');
  assert.match(index, /^<!-- Generated file:/, 'the first line says the file is generated');
  assert.match(index, /## User\n\n- \[user_profile\]\(user_profile\.md\): Who the owner is \(updated 2026-09-29\)\n\n## Project\n\n- \[project_billing\]\(project_billing\.md\): How billing works \(updated 2026-09-28\)\n\n## Reference\n\n\n## Event\n\n\n## Decision\n\n- \[decision_permission_model\]/);
  assert.doesNotMatch(index, /old_plan|template\.md/, 'superseded and template files are left out');
  assert.match(index, /## Other memory views\n\n- \[Current state\]\(CURRENT_STATE\.md\)/);
  assert.ok(out.includes(`Memory index (memory/MEMORY.md):\n${index.trim()}`));
  assert.doesNotMatch(out, /compacted|Prune it/);
});

test('session-start, local: with no memory files the index is the model MEMORY.md byte for byte', { skip: !MODEL_INDEX && 'no model MEMORY.md to compare with' }, () => {
  // The index still lists a memory file that was since deleted; the rebuild drops that line.
  const { dir } = project({ 'CURRENT_STATE.md': state() });
  writeFileSync(join(dir, 'memory', 'MEMORY.md'), readFileSync(MODEL_INDEX, 'utf8').replace('## User\n\n', '## User\n\n- [user_gone](user_gone.md): removed\n'));
  hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.equal(readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8'), readFileSync(MODEL_INDEX, 'utf8'));
});

test('session-start, local: a missing MEMORY.md is written with the generated-file line', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state(), 'reference_api.md': record('reference_api', 'Where the API docs are') });
  rmSync(join(dir, 'memory', 'MEMORY.md'), { force: true });
  const { code } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.equal(code, 0);
  const index = readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8');
  assert.match(index, /^<!-- Generated file:/);
  assert.match(index, /## Reference\n\n- \[reference_api\]\(reference_api\.md\): Where the API docs are/);
  assert.ok(index.startsWith("<!-- Generated file: the session-start hook rebuilds this index from each memory file's title, description, and updated date,"));
});

test('session-start, local: the index link text is the file\'s # title, then its name, then its file name', () => {
  const { dir } = project({
    'CURRENT_STATE.md': state(),
    'project_billing.md': record('project_billing', 'How billing works').replace('# project_billing', '# Billing and invoices'),
    'project_no_title.md': record('project_no_title', 'No title heading').replace('\n# project_no_title\n', '\n').replace('name: project_no_title', 'name: no-title-name'),
    'project_bare.md': '---\ndescription: Only a description\n---\n',
  });
  hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  const index = readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8');
  assert.match(index, /- \[project_bare\]\(project_bare\.md\): Only a description\n- \[Billing and invoices\]\(project_billing\.md\): How billing works \(updated 2026-09-29\)\n- \[no-title-name\]\(project_no_title\.md\): No title heading/);
});

test('session-start, local: when MEMORY.md cannot be written (a sandbox), it still prints the new index', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state(), 'event_outage.md': record('event_outage', 'The 2026-09-20 outage') });
  chmodSync(join(dir, 'memory', 'MEMORY.md'), 0o444);
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.equal(code, 0);
  assert.match(out, /## Event\n\n- \[event_outage\]\(event_outage\.md\): The 2026-09-20 outage/);
  assert.doesNotMatch(out, /stopped early/);
});

test('session-start: from inside a git worktree it reads memory/ in the main checkout', () => {
  const { dir, git } = project({ 'CURRENT_STATE.md': state(today, '- Main checkout line.\n') });
  const worktree = join(dir, '.claude', 'worktrees', 'wi-031');
  git('worktree', 'add', '-q', worktree, '-b', 'claude/wi-031');
  assert.equal(existsSync(join(worktree, 'memory')), false, 'memory/ is not in the worktree');
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: join(worktree) }, ['--memory', 'local']);
  assert.equal(code, 0);
  assert.match(out, /Main checkout line\./);
  assert.match(out, /Memory index/);
});

test('session-start: after compact it adds the re-read line first', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state() });
  const { out } = hook('session-start.mjs', { source: 'compact', cwd: dir }, ['--memory', 'hindsight']);
  assert.match(out.split('\n')[0], /^Context was just compacted\. Before you answer the next message, re-read the active work item with tracking-work-items, then PROJECT\.md, SOUL\.md if the project has one, and \.claude\/rules\/owner-preferences\.md\. In Codex, also re-read each always-on rule listed under Rules in AGENTS\.md\.$/);
  for (const source of ['startup', 'resume', 'clear']) {
    assert.doesNotMatch(hook('session-start.mjs', { source, cwd: dir }, ['--memory', 'hindsight']).out, /compacted/);
  }
});

test('session-start: asks for the refine step when Current State is too long or too old', () => {
  const old = project({ 'CURRENT_STATE.md': state('2026-01-02') });
  assert.match(hook('session-start.mjs', { source: 'startup', cwd: old.dir }, ['--memory', 'local']).out, /Current State is \d+ days old\. Prune it with the local-memory-refine skill\./);
  const long = project({ 'CURRENT_STATE.md': state(today, '- line\n'.repeat(40)) });
  assert.match(hook('session-start.mjs', { source: 'startup', cwd: long.dir }, ['--memory', 'hindsight']).out, /Current State is \d+ lines \(limit: under 40\)\. Prune it with a direct edit, as the memory rule says\./);
  const unfilled = project({ 'CURRENT_STATE.md': 'Last updated: `<YYYY-MM-DD, source, and person or agent>`\n' });
  assert.doesNotMatch(hook('session-start.mjs', { source: 'startup', cwd: unfilled.dir }, ['--memory', 'local']).out, /Prune it/);
});

test('session-start, hindsight: prints Current State only and leaves MEMORY.md alone', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state(), 'MEMORY.md': 'untouched\n', 'user_profile.md': record('user_profile', 'Who') });
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'hindsight']);
  assert.equal(code, 0);
  assert.match(out, /^Current State:\n# Current state/);
  assert.doesNotMatch(out, /Memory index/);
  assert.equal(readFileSync(join(dir, 'memory', 'MEMORY.md'), 'utf8'), 'untouched\n');
});

/** A folder holding a stand-in `ntn` command that prints what the test gives it. */
function fakeNtn(script) {
  const bin = join(scratch, `bin-${++count}`);
  mkdirSync(bin);
  writeFileSync(join(bin, 'ntn'), `#!/bin/sh\necho "$@" > "${bin}/args"\n${script}\n`);
  chmodSync(join(bin, 'ntn'), 0o755);
  return bin;
}

test('session-start, notion: prints the Current state page read with ntn', () => {
  const { dir } = project();
  const bin = fakeNtn(`printf '%s' '${JSON.stringify({ object: 'page_markdown', markdown: `Last updated: ${today}, agent\n\n## Now\n\n- WI-7 in design.` })}'`);
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'notion', '--page', 'abc123'], { PATH: `${bin}:${baseEnv.PATH}` });
  assert.equal(code, 0);
  assert.equal(readFileSync(join(bin, 'args'), 'utf8').trim(), 'api v1/pages/abc123/markdown');
  assert.match(out, /^Current State:\nLast updated: .*\n\n## Now\n\n- WI-7 in design\.\n$/);
});

test('session-start, notion: a failed or missing ntn prints one line and exits 0', () => {
  const { dir } = project();
  const failing = fakeNtn('echo "401 unauthorized" >&2; exit 1');
  for (const PATH of [`${failing}:${baseEnv.PATH}`, baseEnv.PATH]) {
    const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'notion', '--page', 'abc123'], { PATH });
    assert.equal(code, 0);
    assert.equal(out, 'The Notion Current state page could not be read here. Read it with the notion-memory-find skill.\n');
  }
});

test('session-start: outside a Git repository, or with bad input, it prints one line and exits 0', () => {
  const plain = join(scratch, 'not-a-repo');
  mkdirSync(plain);
  const a = hook('session-start.mjs', { source: 'startup', cwd: plain }, ['--memory', 'local']);
  assert.equal(a.code, 0);
  assert.match(a.out, /^The session-start hook stopped early \(.+\)\. Read Current State yourself: memory\/CURRENT_STATE\.md in the main checkout\.\n$/);
  assert.match(hook('session-start.mjs', { source: 'startup', cwd: plain }, ['--memory', 'hindsight']).out, /Read Current State yourself: memory\/CURRENT_STATE\.md in the main checkout\.\n$/);
  assert.match(hook('session-start.mjs', { source: 'startup', cwd: plain }, ['--memory', 'notion']).out, /Read Current State yourself: the Current state page, with the notion-memory-find skill\.\n$/);
  const b = hook('session-start.mjs', 'not json', ['--memory', 'local']);
  assert.equal(b.code, 0);
  assert.equal(b.out.trim().split('\n').length, 1);
});

test('session-start: output stays under the 10,000-character hook limit', () => {
  const many = {};
  for (let i = 0; i < 200; i++) many[`project_topic_${String(i).padStart(3, '0')}.md`] = record(`project_topic_${i}`, 'A long one-line summary of this concept that takes up room in the index');
  const { dir } = project({ 'CURRENT_STATE.md': state(), ...many });
  const { code, out } = hook('session-start.mjs', { source: 'startup', cwd: dir }, ['--memory', 'local']);
  assert.equal(code, 0);
  assert.ok(out.length < 10000, `output is ${out.length} characters`);
  assert.match(out, /^Current State:/);
  assert.match(out, /Cut short to fit the hook limit\. Read memory\/MEMORY\.md for the rest\.\]\n$/);
  assert.match(out, /\(updated 2026-09-29\)\n\[Cut short/, 'the cut falls between two lines');
});

// One example per phrase group: Davis's 11 groups, then the decision phrases.
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

test('prompt-reminder: every phrase group gives one reminder naming the skill', () => {
  for (const [prompt, label] of MATCHES) {
    const { code, out } = hook('prompt-reminder.mjs', { prompt }, ['--skill', 'local-memory-save']);
    assert.equal(code, 0);
    assert.equal(out.split('\n').length, 2, prompt);
    assert.match(out, new RegExp(`^This may be something to keep \\((?:[a-z ]+, )*${label}(?:, [a-z ]+)*\\)\\. The local-memory-save skill decides whether anything is saved\\.`), prompt);
  }
});

test('prompt-reminder: case, curly apostrophes, and "lets" without an apostrophe still match', () => {
  for (const prompt of ['FROM NOW ON use the sandbox.', 'Let’s go with the plan.', 'lets go with it', 'WE DECIDED yesterday.']) {
    assert.match(hook('prompt-reminder.mjs', { prompt }, ['--skill', 'notion-memory-save']).out, /The notion-memory-save skill decides whether anything is saved\./, prompt);
  }
});

test('prompt-reminder: a decision adds the work item line; Hindsight names the hindsight_ingest_document tool and owner-preferences.md', () => {
  const { out } = hook('prompt-reminder.mjs', { prompt: 'We decided to use six permission sets.' }, ['--skill', 'hindsight']);
  assert.equal(out, "This may be something to keep (decision). A fact is kept with the hindsight_ingest_document tool and an instruction by a direct edit of .claude/rules/owner-preferences.md, as the memory rule says; the rule decides whether anything is saved. A decision goes in the work item's Questions and Answers first, with managing-work-items. If these words are inside notes, a transcript, or a document the owner shared, they are source material for managing-work-items, not his words, and nothing from them is saved without his yes.\n");
});

test('prompt-reminder: a standing instruction adds the owner-preferences.md line, never a settings hook', () => {
  const line = ' An instruction for how the agent works is a line in .claude/rules/owner-preferences.md, never a settings hook.';
  for (const skill of ['local-memory-save', 'notion-memory-save', 'hindsight']) {
    const { out } = hook('prompt-reminder.mjs', { prompt: 'From now on always run the tests first.' }, ['--skill', skill]);
    assert.ok(out.startsWith('This may be something to keep (standing instruction). '), skill);
    assert.ok(out.includes(`whether anything is saved.${line} If these words`), skill);
  }
  assert.ok(!hook('prompt-reminder.mjs', { prompt: 'We decided to use six permission sets.' }, ['--skill', 'local-memory-save']).out.includes('settings hook'));
});

test('prompt-reminder: a transcript pasted without markers gets the source material line', () => {
  const notes = 'Here are the meeting notes from the client:\nSarah: OK, we decided to move all 15 personas.\nTom: Going forward the new org is the source.\nPlease refine this.';
  for (const skill of ['local-memory-save', 'notion-memory-save', 'hindsight']) {
    const { out } = hook('prompt-reminder.mjs', { prompt: notes }, ['--skill', skill]);
    assert.ok(out.endsWith(' If these words are inside notes, a transcript, or a document the owner shared, they are source material for managing-work-items, not his words, and nothing from them is saved without his yes.\n'), skill);
  }
});

test('prompt-reminder: a question about a past decision prints nothing; a new decision still does', () => {
  assert.equal(hook('prompt-reminder.mjs', { prompt: 'remind me what we decided about the sales personas' }, ['--skill', 'local-memory-save']).out, '');
  assert.match(hook('prompt-reminder.mjs', { prompt: 'we decided to merge the two sales personas' }, ['--skill', 'local-memory-save']).out, /\(decision\)/);
  assert.match(hook('prompt-reminder.mjs', { prompt: "ok so here's what we decided: merge the two sales personas" }, ['--skill', 'local-memory-save']).out, /\(decision\)/);
  assert.equal(hook('prompt-reminder.mjs', { prompt: 'can you tell me what we decided on WI-002' }, ['--skill', 'local-memory-save']).out, '');
  for (const prompt of ['can you explain why we decided to merge the personas?', 'why we decided to merge the personas?', 'is that what we decided?', 'wait is that what we decided last week', 'how we decided on pricing, can you find it', 'explain what we decided about pricing', 'what did we decide about the personas?']) {
    assert.equal(hook('prompt-reminder.mjs', { prompt }, ['--skill', 'local-memory-save']).out, '', prompt);
  }
  for (const prompt of ["this is what we decided, merge the two sales personas", 'What we decided yesterday was to keep both personas']) {
    assert.match(hook('prompt-reminder.mjs', { prompt }, ['--skill', 'local-memory-save']).out, /\(decision\)/, prompt);
  }
});

test('prompt-reminder: "whenever you finish" is an instruction; "whenever you are ready" is not', () => {
  for (const prompt of ["Come by whenever you're ready.", 'Start whenever you are ready.', 'Tell me whenever you can.', 'Ping me whenever you get a chance.', 'Look at it whenever you have a minute.', 'Whenever you']) {
    assert.equal(hook('prompt-reminder.mjs', { prompt }, ['--skill', 'local-memory-save']).out, '', prompt);
  }
  for (const skill of ['local-memory-save', 'notion-memory-save', 'hindsight']) {
    const { out } = hook('prompt-reminder.mjs', { prompt: 'Whenever you finish a task, run the tests.' }, ['--skill', skill]);
    assert.ok(out.startsWith('This may be something to keep (standing instruction). '), skill);
    assert.ok(out.includes(' An instruction for how the agent works is a line in .claude/rules/owner-preferences.md, never a settings hook.'), skill);
  }
});

test('prompt-reminder: prints nothing for other messages, pasted text, or bad input', () => {
  for (const prompt of ['Build the login page.', 'What did we cover yesterday?', 'Can you rememberize this?', '']) {
    assert.equal(hook('prompt-reminder.mjs', { prompt }, ['--skill', 'local-memory-save']).out, '', prompt);
  }
  const pasted = 'Here are the meeting notes:\n<pasted_content id="1">\nWe decided to move all 15 personas. From now on use the new org.\n</pasted_content id="1">\nSummarize them.';
  assert.equal(hook('prompt-reminder.mjs', { prompt: pasted }, ['--skill', 'local-memory-save']).out, '');
  const bad = hook('prompt-reminder.mjs', 'not json', ['--skill', 'local-memory-save']);
  assert.equal(bad.code, 0);
  assert.equal(bad.out, '');
});

const AFTER_COMMIT = '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"A git commit was just run. In this project, a commit that worked is followed by an update of the work item\'s Recent History and status with managing-work-items, and of Current State when it changed."}}\n';

test('codex-after-commit: a git commit prints the fixed reminder JSON', () => {
  for (const command of ['git commit -m "Add login"', 'git -C /repo/.claude/worktrees/x commit -m "x"', 'npm test && git commit -F msg.txt', 'git -c user.name=Mike commit', 'git --no-pager commit\n', ['bash', '-lc', 'git commit -m y']]) {
    const { code, out } = hook('codex-after-commit.mjs', { hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command } });
    assert.equal(code, 0);
    assert.equal(out, AFTER_COMMIT, JSON.stringify(command));
  }
  assert.deepEqual(JSON.parse(AFTER_COMMIT).hookSpecificOutput.hookEventName, 'PostToolUse');
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
  for (const command of [`git${' --a'.repeat(40)} status`, `git${' -c -a'.repeat(40)} status`]) {
    const started = Date.now();
    assert.equal(hook('codex-after-commit.mjs', { tool_name: 'Bash', tool_input: { command } }).out, '');
    assert.ok(Date.now() - started < 1000, `${command.slice(0, 20)}... took ${Date.now() - started} ms`);
  }
  for (const command of ['git --git-dir=/a/.git commit', 'git -C a -c b=c --no-pager commit --amend']) {
    assert.equal(hook('codex-after-commit.mjs', { tool_name: 'Bash', tool_input: { command } }).out, AFTER_COMMIT, command);
  }
});

const MEMORY = { local: 'local-memory-save', notion: 'notion-memory-save', hindsight: 'hindsight' };

test('Claude Code settings snippets: the right commands, arguments, and texts for each memory choice', () => {
  for (const [memory, skill] of Object.entries(MEMORY)) {
    const { hooks: h, ...rest } = JSON.parse(readFileSync(join(settings, `claude-settings-hooks.${memory}.json`), 'utf8'));
    assert.deepEqual(Object.keys(rest), []);
    // Mike dropped the end-of-reply check (a Stop hook of type prompt) on 2026-10-01: no Stop hook, and only command handlers.
    assert.deepEqual(Object.keys(h).sort(), ['PostToolUse', 'SessionStart', 'UserPromptSubmit']);
    const start = h.SessionStart[0];
    assert.equal(start.matcher, 'startup|resume|clear|compact|fork');
    assert.deepEqual(start.hooks[0].args.slice(0, 3), ['${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.mjs', '--memory', memory]);
    if (memory === 'notion') assert.deepEqual(start.hooks[0].args.slice(3), ['--page', '{{CURRENT_STATE_PAGE_ID}}']);
    assert.deepEqual(h.UserPromptSubmit[0].hooks[0].args, ['${CLAUDE_PROJECT_DIR}/.claude/hooks/prompt-reminder.mjs', '--skill', skill]);
    assert.equal(h.UserPromptSubmit[0].matcher, undefined);
    const [bash, agent] = h.PostToolUse;
    assert.equal(bash.matcher, 'Bash');
    assert.equal(bash.hooks[0].if, 'Bash(git *)');
    assert.deepEqual(bash.hooks[0].args, ['${CLAUDE_PROJECT_DIR}/.claude/hooks/codex-after-commit.mjs']);
    assert.equal(agent.matcher, 'Agent');
    assert.equal(agent.hooks[0].command, 'echo');
    const agentOut = execFileSync(agent.hooks[0].command, agent.hooks[0].args, { encoding: 'utf8' });
    assert.deepEqual(JSON.parse(agentOut), { hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: "A helper agent ran or was started. If it works on a work item or sub-item, update that item's status, Recent History, and Current state with managing-work-items once its report is in. A helper with no work item of its own (a researcher, reviewer, critic, checker, or verifier) needs nothing." } });
    for (const group of Object.values(h).flat()) for (const handler of group.hooks) {
      assert.equal(handler.type, 'command', 'only command hooks: the end-of-reply prompt hook is dropped');
      for (const a of handler.args ?? []) if (a.includes('/.claude/hooks/')) assert.ok(existsSync(join(hooks, a.split('/.claude/hooks/')[1])), a);
    }
  }
});

const CODEX_HELPER = JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: 'A helper agent ran or was started. If it works on a work item or sub-item, update the status, Recent History, and Current state of that item with managing-work-items once its report is in. A helper with no work item of its own (a researcher, reviewer, critic, checker, or verifier) needs nothing.' } });

test('Codex hook snippets: shell strings from the Git root, anchored matchers, no prompt hooks', () => {
  for (const [memory, skill] of Object.entries(MEMORY)) {
    const file = JSON.parse(readFileSync(join(settings, `codex-hooks.${memory}.json`), 'utf8'));
    assert.deepEqual(Object.keys(file), ['description', 'hooks'], 'only description and hooks at the top level');
    const h = file.hooks;
    assert.deepEqual(Object.keys(h).sort(), ['PostToolUse', 'SessionStart', 'UserPromptSubmit']);
    assert.equal(h.SessionStart[0].matcher, '^(startup|resume|clear|compact)$');
    assert.equal(h.PostToolUse[0].matcher, '^Bash$');
    // The helper reminder: spawn_agent (a helper starts) and wait_agent (its report comes back),
    // an echo of fixed JSON in single quotes, so its text has no apostrophe. Codex 0.157.0 names
    // the tools collaborationspawn_agent and collaborationwait_agent in hook input (cx-hooks).
    assert.equal(h.PostToolUse.length, 2);
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
    assert.match(h.UserPromptSubmit[0].hooks[0].command, new RegExp(`--skill ${skill}$`));
  }
});

test('Codex hook snippet commands run as written from a scratch project', () => {
  const { dir } = project({ 'CURRENT_STATE.md': state() });
  mkdirSync(join(dir, '.claude', 'hooks'), { recursive: true });
  for (const file of readdirSync(hooks)) writeFileSync(join(dir, '.claude', 'hooks', file), readFileSync(join(hooks, file)));
  const h = JSON.parse(readFileSync(join(settings, 'codex-hooks.local.json'), 'utf8')).hooks;
  const sh = (command, input) => spawnSync('/bin/sh', ['-c', command], { cwd: dir, input: JSON.stringify(input), encoding: 'utf8', env: { ...baseEnv, PATH: `${dirname(process.execPath)}:${baseEnv.PATH}` } }).stdout;
  assert.match(sh(h.SessionStart[0].hooks[0].command, { source: 'startup', cwd: dir }), /^Current State:/);
  assert.match(sh(h.UserPromptSubmit[0].hooks[0].command, { prompt: 'From now on, ask first.' }), /local-memory-save/);
  assert.equal(sh(h.PostToolUse[0].hooks[0].command, { tool_input: { command: 'git commit -m x' } }), AFTER_COMMIT);
  assert.equal(sh(h.PostToolUse[1].hooks[0].command, { tool_name: 'collaborationspawn_agent', tool_input: {} }), `${CODEX_HELPER}\n`);
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

// Lines are at most 100 characters, so the line counts are honest. The limits are the sizes with
// every job kept; the line count was replaced by the Code limit rules (dev/GOAL.md, "Code limit");
// the limits below are the sizes as built.
test('size limit: each hook command stays small', () => {
  const limits = { 'session-start.mjs': 76, 'prompt-reminder.mjs': 56, 'codex-after-commit.mjs': 20 };
  assert.deepEqual(readdirSync(hooks).sort(), Object.keys(limits).sort(), 'exactly three hook commands');
  for (const [file, max] of Object.entries(limits)) {
    const lines = readFileSync(join(hooks, file), 'utf8').trimEnd().split('\n');
    assert.ok(lines.length <= max, `${file} has ${lines.length} lines (limit ${max})`);
    lines.forEach((line, i) => assert.ok(line.length <= 100, `${file} line ${i + 1} is over 100 characters`));
  }
});

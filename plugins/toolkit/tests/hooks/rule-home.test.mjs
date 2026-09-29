// Where an instruction the owner gives lands, checked by the toolkit command
// and the hooks (verifier, 2026-09-29; Mike's split of 2026-09-29: rules,
// skills, and memory each hold one kind of thing; the goal adjustment: what
// must happen every time lives in the toolkit command or a hook):
// - the Stop hook counts a rule as recorded: toolkit rule add seen by
//   PostToolUse, or a changed owner-preferences.md file;
// - an instruction given with a keep phrase and saved to user_ or project_
//   memory is refused by the command, or noted by PostToolUse when the
//   command cannot read the turn (no session id);
// - promote --approved-by after a remark made in passing is refused; a rule
//   changed that way with no session id gets a PostToolUse note;
// - R-I4 with --expect: a new record (--expect absent) and a new section
//   (--expect <the concept's version>) are saved as proposals; a new feedback_
//   record or section is refused whatever --expect it carries.
// Both hosts: Claude Code (CLAUDE_CODE_SESSION_ID) and Codex (CODEX_THREAD_ID).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, read, tk } from '../project/helpers.mjs';
import { fixture } from './fixtures.mjs';
import { saveWords } from '../../lib/hooks/phrases.mjs';
import { memoryQuestionAsked } from '../../lib/hooks/proposal.mjs';
import { KEEP_REASON } from '../../lib/hooks/stop.mjs';

after(cleanup);

const HOSTS = ['claude', 'codex'];
const SESSION_VAR = { claude: 'CLAUDE_CODE_SESSION_ID', codex: 'CODEX_THREAD_ID' };
const RULE = path.join('.claude', 'rules', 'owner-preferences.md');
let seq = 0;

/** The environment of the agent's shell in a host, for one session (null: a shell with no session id). */
function shellEnv(env, host, session) {
  const e = { ...env };
  delete e.CLAUDE_CODE_SESSION_ID;
  delete e.CODEX_THREAD_ID;
  if (session) e[SESSION_VAR[host]] = session;
  return e;
}

async function hook(root, env, host, event, name, vars) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(fixture(host, name, { CWD: root, ...vars })) });
  return { code: res.code, raw: res.stdout, out: res.stdout.trim() ? JSON.parse(res.stdout) : null };
}

/** The owner's prompt of a new turn; `before` is the reply that ended the turn before it. */
async function prompt(root, env, host, session, text, before = null) {
  seq += 1;
  if (before) await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN: `rh-before-${seq}`, MESSAGE: before, STOP_ACTIVE: false });
  const TURN = `rh-turn-${seq}`;
  await hook(root, env, host, 'user-prompt', 'user-prompt', { SESSION: session, TURN, PROMPT: text });
  return TURN;
}

/** The text a hook gives the agent: Codex Stop puts it in reason, the rest in additionalContext. */
function said(res) {
  if (!res.out) return '';
  return res.out.reason || (res.out.hookSpecificOutput && res.out.hookSpecificOutput.additionalContext) || '';
}

test('the Stop hook counts a rule add as recorded after "from now on", with or without PostToolUse, in both hosts', async () => {
  const { root, env } = await initProject();
  for (const host of HOSTS) {
    const session = `${host}-stop-rule-${seq}`;
    const shell = shellEnv(env, host, session);
    // The verifier's steps: user-prompt, rule add, post-tool, stop.
    const TURN = await prompt(root, env, host, session, 'From now on keep commit messages under 50 characters.');
    const add = await tk(root, ['rule', 'add', '--section', 'Git', '--text', `Keep commit messages under 50 characters (${host}).`, '--source', 'Mike in chat'], { env: shell });
    assert.equal(add.code, 0, add.stderr);
    assert.match(add.stdout, /^Added to \.claude\/rules\/owner-preferences\.md/);
    await hook(root, env, host, 'post-tool', 'post-tool.bash', { SESSION: session, TURN, COMMAND: `toolkit rule add --section Git --text 'Keep commit messages under 50 characters.' --source 'Mike in chat'`, STDOUT: add.stdout });
    const stop = await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN, MESSAGE: 'Added to the project rules: Keep commit messages under 50 characters.', STOP_ACTIVE: false });
    assert.equal(stop.raw, '', `${host}: ${stop.raw}`);

    // PostToolUse did not see the command: the changed rule file counts.
    const TURN2 = await prompt(root, env, host, session, 'Always keep branch names under 30 characters.');
    const add2 = await tk(root, ['rule', 'add', '--section', 'Git', '--text', `Keep branch names under 30 characters (${host}).`, '--source', 'Mike in chat'], { env: shell });
    assert.equal(add2.code, 0, add2.stderr);
    const stop2 = await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN: TURN2, MESSAGE: 'Added to the project rules.', STOP_ACTIVE: false });
    assert.equal(stop2.raw, '', `${host}: ${stop2.raw}`);

    // Nothing recorded: the reason names the rules as a home.
    const TURN3 = await prompt(root, env, host, session, 'From now on, lead every status reply with the answer.');
    const stop3 = await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN: TURN3, MESSAGE: 'Understood.', STOP_ACTIVE: false });
    assert.equal(said(stop3), KEEP_REASON, `${host}: ${stop3.raw}`);
    assert.match(KEEP_REASON, /no rule, memory save, work item change, or decision/);
    assert.match(KEEP_REASON, /an instruction for how the agent works: toolkit rule add/);
  }
});

test('an instruction the owner gave with a keep phrase is refused as a user_ or project_ memory save; a fact, or --not-a-rule, is saved', async () => {
  const { root, env } = await initProject();
  // A concept made where no turn is known (a terminal): saved as before.
  const made = await tk(root, ['memory', 'save', '--type', 'user', '--name', 'profile', '--description', 'Who Mike is and the devices he uses', '--section', 'Laptop', '--body', 'Mike works on a MacBook Air.', '--approved-by', 'Mike'], { env: shellEnv(env, 'claude', null) });
  assert.equal(made.code, 0, made.stderr);
  for (const host of HOSTS) {
    const session = `${host}-instr-${seq}`;
    const shell = shellEnv(env, host, session);
    // The Codex rerun, s08: a new user_ concept whose section is the instruction.
    await prompt(root, env, host, session, "From now on, write tests with Node's built-in node:test runner, no npm packages.");
    const refused = await tk(root, ['memory', 'save', '--type', 'user', '--name', `working-preferences-${host}`, '--description', 'How Mike likes to work', '--section', 'Test runner', '--body', "Write tests with Node's built-in node:test runner, no npm packages.", '--approved-by', 'Mike', '--json'], { env: shell });
    assert.equal(refused.code, 2, refused.stdout);
    assert.match(refused.json.error.message, /is an instruction for how the agent works, and the owner asked this turn for it to be kept\. An instruction is a rule, not memory/);
    assert.equal(refused.json.error.details.rule.section, 'Testing');
    assert.match(refused.json.error.details.fix, /^Add it to the project rules in his words: toolkit rule add --section 'Testing' --text 'Write tests with Node/);
    assert.match(refused.json.error.details.fix, /save it again with --not-a-rule/);
    assert.equal(fs.existsSync(path.join(root, '.memory', `user_working_preferences_${host}.md`)), false);
    // A section of an existing concept: the same.
    const section = await tk(root, ['memory', 'save', '--concept', 'user_profile', '--section', `Replies ${host}`, '--body', 'Lead every status reply with the answer.', '--approved-by', 'Mike'], { env: shell });
    assert.equal(section.code, 2, section.stdout);
    assert.doesNotMatch(read(path.join(root, '.memory', 'user_profile.md')), /Lead every status reply/);
    // The agent's own judgment that it is a fact.
    const kept = await tk(root, ['memory', 'save', '--concept', 'user_profile', '--section', `Test habit ${host}`, '--body', `Use node:test in personal projects is what Mike does at home (${host}).`, '--approved-by', 'Mike', '--not-a-rule', '--allow-similar', '--json'], { env: shell });
    assert.equal(kept.code, 0, kept.stdout + kept.stderr);

    // A fact in a keep turn is saved as approved.
    await prompt(root, env, host, session, 'Remember that the staging sandbox is called uat2.');
    const fact = await tk(root, ['memory', 'save', '--type', 'project', '--name', `sandboxes-${host}`, '--description', `The Salesforce sandboxes of this project (${host})`, '--section', 'Staging', '--body', 'The staging sandbox is called uat2.', '--approved-by', 'Mike', '--new-concept', '--allow-similar', '--json'], { env: shell });
    assert.equal(fact.code, 0, fact.stdout + fact.stderr);
    assert.equal(fact.json.proposal, false);
  }
});

test('with no session id the command cannot see the turn, so PostToolUse adds the note: an instruction in memory, and a rule changed after a remark', async () => {
  const { root, env } = await initProject();
  for (const host of HOSTS) {
    const session = `${host}-note-${seq}`;
    const terminal = shellEnv(env, host, null);
    const TURN = await prompt(root, env, host, session, 'Going forward, ask one requirements question at a time.');
    const saved = await tk(root, ['memory', 'save', '--type', 'user', '--name', `ways-${host}`, '--description', `How Mike likes requirements asked (${host})`, '--section', 'Questions', '--body', 'Ask one requirements question at a time.', '--approved-by', 'Mike', '--new-concept', '--allow-similar'], { env: terminal });
    assert.equal(saved.code, 0, saved.stderr);
    const note = await hook(root, env, host, 'post-tool', 'post-tool.bash', { SESSION: session, TURN, COMMAND: `toolkit memory save --type user --name ways-${host} --description 'How Mike likes requirements asked' --section Questions --body 'Ask one requirements question at a time.' --approved-by Mike`, STDOUT: saved.stdout });
    assert.match(said(note), /^This saved an instruction for how the agent works to memory \(user_ways/, `${host}: ${note.raw}`);
    assert.match(said(note), /toolkit rule add --section '<area>'/);
    // --not-a-rule: no note.
    const quiet = await hook(root, env, host, 'post-tool', 'post-tool.bash', { SESSION: session, TURN, COMMAND: `toolkit memory save --concept user_ways_${host} --section Other --body 'Ask one question at a time.' --approved-by Mike --not-a-rule`, STDOUT: 'Saved to memory.' });
    assert.equal(quiet.raw, '', `${host}: ${quiet.raw}`);

    // A rule written after a remark made in passing.
    const TURN2 = await prompt(root, env, host, session, 'The status tables were nice.');
    const add = await tk(root, ['rule', 'add', '--section', 'Replies', '--text', `Use tables for status (${host}).`, '--source', 'Mike in chat'], { env: terminal });
    assert.equal(add.code, 0, add.stderr);
    const ruleNote = await hook(root, env, host, 'post-tool', 'post-tool.bash', { SESSION: session, TURN: TURN2, COMMAND: `toolkit rule add --section Replies --text 'Use tables for status.' --source 'Mike in chat'`, STDOUT: add.stdout });
    assert.match(said(ruleNote), /^This toolkit rule add changed the project rules as the owner's decision, but his message this turn has no keep phrase/, `${host}: ${ruleNote.raw}`);
    assert.match(said(ruleNote), /ask "Keep this project rule: <one line>\?"/);
    // The command itself saved a rule proposal (it could see the turn): no note.
    const proposed = await hook(root, env, host, 'post-tool', 'post-tool.bash', { SESSION: session, TURN: TURN2, COMMAND: `toolkit rule add --section Replies --text 'Use tables.' --source 'Mike in chat'`, STDOUT: "Not added to .claude/rules/owner-preferences.md: the hooks recorded no keep phrase, no other save words, and no answer to a question about memory or rules in the owner's message this turn, so it was saved as a rule proposal in memory: user_rule_use_tables." });
    assert.equal(proposed.raw, '', `${host}: ${proposed.raw}`);
  }
});

test('promote --approved-by after a remark made in passing is refused; after the owner answers the promote question it writes the rule', async () => {
  const { root, env } = await initProject();
  const terminal = shellEnv(env, 'claude', null);
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'hindsight', '--description', 'The Hindsight memory server on this Mac', '--section', 'Port', '--body', 'It listens on 127.0.0.1:8888.', '--approved-by', 'Mike'], { env: terminal });
  for (const host of HOSTS) {
    const lesson = await tk(root, ['memory', 'save', '--concept', 'project_hindsight', '--lesson', `Start it offline ${host}`, '--body', 'Set HF_HUB_OFFLINE=1 before starting Hindsight.', '--source', 'setup session'], { env: terminal });
    assert.equal(lesson.code, 0, lesson.stderr);
  }
  for (const host of HOSTS) {
    const session = `${host}-promote-${seq}`;
    const shell = shellEnv(env, host, session);
    await prompt(root, env, host, session, 'FYI the build looked fine.');
    const args = ['memory', 'promote', 'project_hindsight', '--section', `Start it offline ${host}`, '--to', 'rule', '--rule-section', 'Setup', '--text', `Set HF_HUB_OFFLINE=1 before starting Hindsight (${host}).`, '--approved-by', 'Mike'];
    const refused = await tk(root, [...args, '--json'], { env: shell });
    assert.equal(refused.code, 2, refused.stdout);
    assert.match(refused.json.error.message, new RegExp(`^The lesson "Start it offline ${host}" was not promoted: the owner's message this turn does not ask for it`));
    assert.match(refused.json.error.details.fix, /without --approved-by, ask him the question it prints/);
    assert.equal(fs.existsSync(path.join(root, RULE)) && read(path.join(root, RULE)).includes(`(${host})`), false);

    // The plan's question, then his yes.
    const plan = await tk(root, args.slice(0, -2), { env: shell });
    const ask = /Ask him: "(.+)"/.exec(plan.stdout)[1];
    assert.equal(memoryQuestionAsked(ask), true, ask);
    await prompt(root, env, host, session, 'Yes.', `Done. ${ask}`);
    const yes = await tk(root, args, { env: shell });
    assert.equal(yes.code, 0, yes.stderr);
    assert.match(read(path.join(root, RULE)), new RegExp(`- Set HF_HUB_OFFLINE=1 before starting Hindsight \\(${host}\\)\\.`));
    // The first rule also changes the AGENTS.md rules list: two files, said plainly.
    assert.match(yes.stdout, host === 'claude'
      ? /Commit \.claude\/rules\/owner-preferences\.md and AGENTS\.md by name, in one commit: the owner approved this change\. This first rule changed two files/
      : /Commit \.claude\/rules\/owner-preferences\.md by name: the owner approved this change\. It is one changed file/);
  }
  assert.equal(memoryQuestionAsked('Turn the lesson "Start it offline" into a project skill (.claude/skills/start-it-offline/SKILL.md)?'), true);
});

test('R-I4 with --expect: --expect absent and a new section with the concept\'s version are saved as proposals; a replaced section is not', async () => {
  const { root, env } = await initProject();
  const terminal = shellEnv(env, 'claude', null);
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'office', '--description', 'The office: its network and hours', '--section', 'Hours', '--body', 'The office is open 9 to 5.', '--approved-by', 'Mike'], { env: terminal });
  for (const host of HOSTS) {
    const session = `${host}-expect-${seq}`;
    const shell = shellEnv(env, host, session);
    await prompt(root, env, host, session, 'FYI, the office wifi is slow.');
    const absent = await tk(root, ['memory', 'save', '--type', 'project', '--name', `office-wifi-${host}`, '--description', `The office wifi is slow (${host})`, '--body', 'The office wifi is slow.', '--approved-by', 'Mike Rihm', '--expect', 'absent', '--new-concept', '--allow-similar', '--json'], { env: shell });
    assert.equal(absent.code, 0, absent.stdout + absent.stderr);
    assert.equal(absent.json.proposal, true, `${host}: --expect absent is a new record`);
    assert.deepEqual(absent.json.downgraded, { from: 'approved-by', by: 'Mike Rihm' });
    assert.match(read(path.join(root, '.memory', `${absent.json.key}.md`)), /^status: needs-review$/m);

    const version = (await tk(root, ['memory', 'get', 'project_office', '--json'], { env: terminal })).json.version;
    const before = read(path.join(root, '.memory', 'project_office.md'));
    const added = await tk(root, ['memory', 'save', '--concept', 'project_office', '--section', `Wifi ${host}`, '--body', `The wifi is slow in the afternoon (${host}).`, '--expect', version, '--approved-by', 'Mike Rihm', '--allow-similar', '--json'], { env: shell });
    assert.equal(added.code, 0, added.stdout + added.stderr);
    assert.equal(added.json.proposal, true, `${host}: a new section is new`);
    assert.equal(added.json.concept, 'project_office');
    assert.equal(read(path.join(root, '.memory', 'project_office.md')), before, 'the concept waits for his yes');

    // Replacing text the concept already has is an update: left as it is (the PostToolUse note covers it).
    const replaced = await tk(root, ['memory', 'save', '--concept', 'project_office', '--section', 'Hours', '--body', `The office is open 8 to 6 (${host}).`, '--expect', version, '--approved-by', 'Mike Rihm', '--json'], { env: shell });
    assert.equal(replaced.code, 0, replaced.stdout + replaced.stderr);
    assert.equal(replaced.json.proposal, false);
  }
});

test('a new feedback_ record or section is refused whatever --expect it carries; replacing an old section still works', async () => {
  const { root, env } = await initProject();
  const newOne = await tk(root, ['memory', 'save', '--type', 'feedback', '--name', 'commit-style', '--description', 'Commit style', '--body', 'Keep commits short.', '--approved-by', 'Mike', '--expect', 'absent'], { env });
  assert.equal(newOne.code, 2, newOne.stdout);
  assert.equal(fs.existsSync(path.join(root, '.memory', 'feedback_commit_style.md')), false);
  fs.writeFileSync(path.join(root, '.memory', 'feedback_ways.md'), [
    '---', 'name: feedback_ways', 'description: How the owner wants the agent to work', 'updated: 2026-09-20', 'metadata:', '  type: feedback', 'status: current',
    'source: Mike, 2026-09-20', 'last_verified: 2026-09-20', 'authorization: Approved by Mike on 2026-09-20', 'supersedes: none', '---', '',
    '# Ways of working', '', '## Force-push', '', '**Remember:** Never force-push to any branch.', '',
  ].join('\n'));
  const version = (await tk(root, ['memory', 'get', 'feedback_ways', '--json'], { env })).json.version;
  const section = await tk(root, ['memory', 'save', '--concept', 'feedback_ways', '--section', 'Replies', '--body', 'Short replies.', '--expect', version, '--approved-by', 'Mike'], { env });
  assert.equal(section.code, 2, section.stdout);
  const append = await tk(root, ['memory', 'save', '--concept', 'feedback_ways', '--section', 'Force-push', '--append', '--body', 'Not even to a fork.', '--expect', version, '--approved-by', 'Mike'], { env });
  assert.equal(append.code, 2, append.stdout);
  const replace = await tk(root, ['memory', 'save', '--concept', 'feedback_ways', '--section', 'Force-push', '--body', 'Never force-push to main.', '--expect', version, '--approved-by', 'Mike'], { env });
  assert.equal(replace.code, 0, replace.stdout + replace.stderr);
});

test('save words: a Salesforce rule or a remark about how something behaves is not a request to save', () => {
  for (const t of ['FYI the validation rule on Account blocks the load.', 'The sharing rules look wrong.', 'It always fails on Fridays.', 'Change the validation rule on Account.', 'FYI, I only ever run tip-split on my MacBook Air with Node 24.']) {
    assert.equal(saveWords(t), false, t);
  }
  for (const t of ['Change that rule.', 'Add it to the project rules.', 'You should always ask first.', 'Please never push to main.', 'That is my preference.', 'Always run the tests.', 'Use pnpm instead.']) {
    assert.equal(saveWords(t), true, t);
  }
});

test('a rules-form question already saved is named in the rules form, with its key, not "Save to memory" and <key>', async () => {
  const { root, env } = await initProject();
  const ask = 'Done. Add to the project rules: lead every status reply with the answer?';
  const first = await prompt(root, env, 'claude', 'rules-q-1', 'ok');
  await hook(root, env, 'claude', 'stop', 'stop', { SESSION: 'rules-q-1', TURN: first, MESSAGE: ask, STOP_ACTIVE: false });
  const saved = fs.readdirSync(path.join(root, '.memory')).filter((f) => f.startsWith('user_rule_'));
  assert.equal(saved.length, 1, saved.join(', '));
  const key = saved[0].replace(/\.md$/, '');
  // Another session asks the same question.
  const second = await prompt(root, env, 'claude', 'rules-q-2', 'ok');
  await hook(root, env, 'claude', 'stop', 'stop', { SESSION: 'rules-q-2', TURN: second, MESSAGE: ask, STOP_ACTIVE: false });
  const next = await hook(root, env, 'claude', 'user-prompt', 'user-prompt', { SESSION: 'rules-q-2', TURN: `${second}-next`, PROMPT: 'Later.' });
  const note = said(next);
  assert.match(note, /The unanswered "Add to the project rules: lead every status reply with the answer\?" was not saved again: memory already has the rule proposal/, note);
  assert.match(note, new RegExp(`toolkit memory approve ${key} --by <name> and his no is toolkit memory reject ${key}`));
  assert.doesNotMatch(note, /Save to memory|<key>/);
});

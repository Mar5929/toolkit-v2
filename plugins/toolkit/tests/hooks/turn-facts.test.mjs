// What the hooks know about the owner's turn, used by the toolkit command
// itself (close-out 2026-09-28; Mike's rules/skills/memory split of
// 2026-09-29):
// - R-I4 in code: a toolkit memory save --approved-by in a turn the hooks
//   recorded with no keep phrase, no other save words, and no answered memory
//   question is saved as a proposal, and says so. Both hosts: the command
//   finds its session from CLAUDE_CODE_SESSION_ID (Claude Code) or
//   CODEX_THREAD_ID (Codex).
// - toolkit rule add in such a turn saves a rule proposal; rule update is refused.
// - The Stop hook saves an instruction as a rule proposal (C1), quotes the
//   owner's words when he stated the fact (finding 5), and gives a concept
//   proposal a short heading (finding 6).
// - "Always ..." opening a sentence is a keep phrase (finding 10); a
//   `toolkit memory save --help` is not a save (finding 11).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, read, tk } from '../project/helpers.mjs';
import { fixture } from './fixtures.mjs';
import { keepPhrase, hasKeepPhrase, KEEP_LINE } from '../../lib/hooks/phrases.mjs';
import { proposalType, proposalQuestions, statedInPrompt, proposalArgs } from '../../lib/hooks/proposal.mjs';
import { readTurnFacts, passingRemark, sessionIdFromEnv } from '../../lib/hooks/turn-facts.mjs';
import { LOOSE_REASON, KEEP_REASON } from '../../lib/hooks/stop.mjs';
import { shortHeading } from '../../lib/memory/concepts.mjs';
import { requireProject } from '../../lib/core/config.mjs';

after(cleanup);

const HOSTS = ['claude', 'codex'];
const SESSION_VAR = { claude: 'CLAUDE_CODE_SESSION_ID', codex: 'CODEX_THREAD_ID' };
let seq = 0;

/** The environment of the agent's shell in a host, for one session. */
function shellEnv(env, host, session) {
  const e = { ...env };
  delete e.CLAUDE_CODE_SESSION_ID;
  delete e.CODEX_THREAD_ID;
  e[SESSION_VAR[host]] = session;
  return e;
}

async function hook(root, env, host, event, name, vars) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(fixture(host, name, { CWD: root, ...vars })) });
  return { code: res.code, raw: res.stdout, out: res.stdout.trim() ? JSON.parse(res.stdout) : null };
}

/** The owner's prompt of a new turn. */
async function prompt(root, env, host, session, text, before = null) {
  seq += 1;
  if (before) await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN: `tf-before-${seq}`, MESSAGE: before, STOP_ACTIVE: false });
  const TURN = `tf-turn-${seq}`;
  await hook(root, env, host, 'user-prompt', 'user-prompt', { SESSION: session, TURN, PROMPT: text });
  return TURN;
}

const SAVE = (name) => ['memory', 'save', '--type', 'project', '--name', name, '--description', `Tipcalc runs only on a MacBook Air with Node 24 (${name})`, '--body', 'Tipcalc runs only on a MacBook Air with Node 24.', '--approved-by', 'Mike', '--new-concept', '--allow-similar', '--json'];

test('R-I4: a save that claims the owner\'s approval after a remark made in passing is saved as a proposal, in both hosts', async () => {
  const { root, env } = await initProject();
  for (const host of HOSTS) {
    const session = `${host}-ri4-${seq}`;
    const shell = shellEnv(env, host, session);
    await prompt(root, env, host, session, 'FYI, I only ever run tipcalc on my MacBook Air with Node 24.');
    const facts = readTurnFacts(requireProject(root), shell);
    assert.ok(facts && passingRemark(facts), `${host}: ${JSON.stringify(facts)}`);
    assert.equal(facts.host, host);

    const res = await tk(root, SAVE(`${host}-remark`), { env: shell });
    assert.equal(res.code, 0, res.stdout + res.stderr);
    assert.equal(res.json.proposal, true, `${host}: saved as a proposal`);
    assert.deepEqual(res.json.downgraded, { from: 'approved-by', by: 'Mike' });
    assert.equal(res.json.approved_by, null);
    const text = read(path.join(root, '.memory', `${res.json.key}.md`));
    assert.match(text, /^status: needs-review$/m);
    assert.match(text, /^authorization: Proposed by the agent on /m);
    const human = await tk(root, SAVE(`${host}-remark-2`).filter((a) => a !== '--json'), { env: shell });
    assert.match(human.stdout, /Saved as a proposal, not as approved by Mike: the hooks recorded no keep phrase, no other words asking for a save, and no answer to a memory question in his message this turn/);

    // The PostToolUse note does not repeat it: the command already did.
    const note = await hook(root, env, host, 'post-tool', 'post-tool.bash', { SESSION: session, TURN: `tf-turn-${seq}`, COMMAND: `toolkit memory save --type project --name x --approved-by Mike`, STDOUT: human.stdout.split('\n').slice(0, 3).join(' ') });
    assert.equal(note.raw, '', `${host}: ${note.raw}`);

    // His keep phrase, his save words, or his answer to a memory question: approved.
    await prompt(root, env, host, session, 'Remember that tipcalc only runs on my MacBook Air with Node 24.');
    const kept = await tk(root, SAVE(`${host}-kept`), { env: shell });
    assert.equal(kept.json.proposal, false, `${host}: keep phrase`);
    await prompt(root, env, host, session, 'Yes.', 'Done. Save to memory: tipcalc runs only on your MacBook Air with Node 24?');
    const answered = await tk(root, SAVE(`${host}-answered`), { env: shell });
    assert.equal(answered.json.proposal, false, `${host}: an answer to the question`);
    // A terminal the owner runs has no session: nothing changes.
    await prompt(root, env, host, session, 'FYI, it is a MacBook Air.');
    const terminal = await tk(root, SAVE(`${host}-terminal`), { env: shellEnv(env, host, 'no-such-session') });
    assert.equal(terminal.json.proposal, false, `${host}: no turn file for that session`);
  }
  assert.equal(sessionIdFromEnv({ CLAUDE_CODE_SESSION_ID: ' a ' }), 'a');
  assert.equal(sessionIdFromEnv({}), null);
});

test('rule add after a remark made in passing saves a rule proposal; the owner\'s yes writes the rule; rule update is refused', async () => {
  const { root, env } = await initProject();
  for (const host of HOSTS) {
    const session = `${host}-rule-${seq}`;
    const shell = shellEnv(env, host, session);
    await prompt(root, env, host, session, 'The status tables you gave me were easier to read.');
    const res = await tk(root, ['rule', 'add', '--section', 'Replies', '--text', `Use a table for status replies (${host}).`, '--source', 'Mike in chat', '--json'], { env: shell });
    assert.equal(res.code, 0, res.stderr);
    assert.equal(res.json.action, 'rule-proposal');
    assert.equal(fs.existsSync(path.join(root, '.claude', 'rules', 'owner-preferences.md')), host === 'codex', 'claude ran first: no rule file yet');
    const listed = await tk(root, ['memory', 'list', '--status', 'needs-review'], { env: shell });
    assert.match(listed.stdout, new RegExp(`${res.json.key} \\[rule proposal for \\.claude/rules/owner-preferences\\.md, section "Replies": the owner has not answered\\]`));
    const decisions = await tk(root, ['work', 'decisions'], { env: shell });
    assert.match(decisions.stdout, new RegExp(res.json.key));
    assert.match(read(path.join(root, '.memory', 'MEMORY.md')), /\[rule proposal for \.claude\/rules\/owner-preferences\.md, section "Replies": not a rule until the owner answers\]/);

    const refused = await tk(root, ['rule', 'update', '--section', 'Replies', '--entry', '1', '--remove'], { env: shell });
    assert.equal(refused.code, 2);
    assert.match(refused.stderr, /does not ask for it/);

    await prompt(root, env, host, session, 'Yes, add it.', 'Add to the project rules: use a table for status replies?');
    const yes = await tk(root, ['memory', 'approve', res.json.key, '--by', 'Mike', '--json'], { env: shell });
    assert.equal(yes.code, 0, yes.stderr);
    assert.equal(yes.json.rule.section, 'Replies');
    assert.match(read(path.join(root, '.claude', 'rules', 'owner-preferences.md')), new RegExp(`- Use a table for status replies \\(${host}\\)\\. \\(\\d{4}-\\d{2}-\\d{2}, Mike said yes to the agent's question\\)`));
    assert.equal(fs.existsSync(path.join(root, '.memory', `${res.json.key}.md`)), false, 'the proposal is gone');
    assert.match(read(path.join(root, 'AGENTS.md')), /`\.claude\/rules\/owner-preferences\.md`: Owner Preferences/);
  }
});

test('the Stop hook saves an instruction as a rule proposal, quoting the owner when he stated it (C1, findings 5 and 6)', async () => {
  const { root, env } = await initProject();
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'output-format', '--description', 'The output format of tipcalc and who reads it', '--section', 'Lines', '--body', 'Each result is one line.', '--approved-by', 'Mike'], { env });
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'money', '--description', 'Money: how tipcalc splits and rounds a bill', '--section', 'Rounding', '--body', 'Shares round to whole cents.', '--approved-by', 'Mike'], { env });
  for (const host of HOSTS) {
    const session = `${host}-stop-${seq}`;
    const TURN = await prompt(root, env, host, session, 'Honestly the status table was much easier for me to read than the bullets.');
    const stop = await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN, MESSAGE: 'Done. **Save to memory:** you find tables easier to read than bullets in status replies?', STOP_ACTIVE: false });
    assert.equal(stop.code, 0);
    const next = await hook(root, env, host, 'user-prompt', 'user-prompt', { SESSION: session, TURN: `${TURN}-next`, PROMPT: 'ok' });
    const note = next.out.hookSpecificOutput.additionalContext;
    assert.match(note, /as a rule proposal: user_rule_mike_finds_tables_easier/, note);
    assert.match(note, /\.claude\/rules\/owner-preferences\.md, section "Replies"/);
    const key = /as a rule proposal: (user_rule_[a-z0-9_]+)/.exec(note)[1];
    const text = read(path.join(root, '.memory', `${key}.md`));
    assert.doesNotMatch(text, /concept: project_output_format/, 'never filed under the output-format concept');
    assert.match(text, /^rule_section: Replies$/m);
    assert.match(text, /\*\*Evidence and limits:\*\* On [\d-]+ the owner wrote "Honestly the status table was much easier for me to read than the bullets\." The agent asked him "Save to memory: you find tables easier/);
    await tk(root, ['memory', 'reject', key], { env });

    // A fact that belongs in a concept gets a short heading, not the whole sentence.
    const TURN2 = await prompt(root, env, host, session, 'ok');
    await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN: TURN2, MESSAGE: 'Save to memory: money shares must be whole-cent amounts because Venmo rejects fractions of a cent, so rounding happens per share?', STOP_ACTIVE: false });
    const files = fs.readdirSync(path.join(root, '.memory')).filter((f) => f.startsWith('project_proposal_'));
    assert.equal(files.length, 1, files.join(', '));
    const prop = read(path.join(root, '.memory', files[0]));
    assert.match(prop, /^concept: project_money$/m);
    assert.match(prop, /^section: Money shares must be whole-cent amounts$/m);
    await tk(root, ['memory', 'reject', files[0].replace(/\.md$/, '')], { env });
  }
});

test('proposalType, the rules question form, and statedInPrompt', () => {
  assert.equal(proposalType('you find tables easier to read than bullets in status replies', 'Mike Rihm'), 'rule');
  assert.equal(proposalType("you'd rather see the exact command than a description", 'Mike Rihm'), 'rule');
  assert.equal(proposalType('Mike prefers short replies that lead with the answer', 'Mike Rihm'), 'rule');
  assert.equal(proposalType('Ask one question at a time', 'Mike Rihm'), 'rule');
  assert.equal(proposalType('Mike hikes every Saturday morning', 'Mike Rihm'), 'user');
  assert.equal(proposalType('The staging sandbox is called uat2', 'Mike Rihm'), 'project');
  assert.deepEqual(proposalQuestions('All set. **Add to the project rules:** lead every status reply with the answer?', { withKind: true }), [{ summary: 'lead every status reply with the answer', rule: true }]);
  assert.equal(statedInPrompt('tipcalc runs on Node 24 only', 'FYI tipcalc only runs on Node 24 here'), 'FYI tipcalc only runs on Node 24 here');
  assert.equal(statedInPrompt('tipcalc runs on Node 24 only', 'What is next?'), null);
  const args = proposalArgs('Keep replies under five lines', { ownerName: 'Mike', date: '2026-09-29' });
  assert.deepEqual(args.slice(args.indexOf('--rule-section'), args.indexOf('--rule-section') + 2), ['--rule-section', 'Replies']);
  assert.equal(shortHeading('Venmo rejects payments with a fraction of a cent, so every split share must be a whole-cent amount'), 'Venmo rejects payments with a fraction');
});

test('"Always" or "Never" opening a sentence is a keep phrase (finding 10); the keep line names both homes', () => {
  assert.equal(keepPhrase('Always keep commit messages under 60 characters.'), 'always or never');
  assert.equal(keepPhrase('Thanks. Never push to main without asking.'), 'always or never');
  assert.equal(keepPhrase('It always fails on CI.'), null);
  assert.equal(keepPhrase('Never mind, skip it.'), null);
  assert.equal(keepPhrase('I never use Windows.'), null);
  assert.match(KEEP_LINE, /an instruction for how the agent works goes to the rules \(toolkit rule add\), a fact to memory/);
  for (const reason of [KEEP_LINE, KEEP_REASON, LOOSE_REASON]) assert.equal(hasKeepPhrase(reason), false, reason);
});

test('a toolkit memory save --help is not recorded as a save (finding 11)', async () => {
  const { root, env } = await initProject();
  for (const host of HOSTS) {
    const session = `${host}-help-${seq}`;
    const TURN = await prompt(root, env, host, session, 'From now on, answer in two lines.');
    await hook(root, env, host, 'post-tool', 'post-tool.bash', { SESSION: session, TURN, COMMAND: 'toolkit memory save --help', STDOUT: 'Usage: toolkit memory save ...' });
    const stop = await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN, MESSAGE: 'Here is the answer.', STOP_ACTIVE: false });
    const reason = host === 'codex' ? stop.out && stop.out.reason : stop.out && stop.out.hookSpecificOutput && stop.out.hookSpecificOutput.additionalContext;
    assert.ok(reason && reason.includes('nothing was recorded'), `${host}: the help run did not count as recording it (${stop.raw})`);
  }
});

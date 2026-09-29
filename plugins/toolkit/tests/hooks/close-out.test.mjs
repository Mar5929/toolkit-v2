// Hook fixes from the close-out of 2026-09-28 (dev/final-review.md,
// "Re-review 2026-09-28"), each tried in both hosts:
// - R-I4: a toolkit memory save --approved-by in a turn whose prompt had no
//   keep phrase or save words, and that answered no memory question, gets a
//   PostToolUse note: a remark made in passing is a proposal;
// - R-M1: the Stop hook does not ask for the exact "Save to memory:" form
//   when the message is about a memory proposal that already exists;
// - R-M7: a proposal summary that starts with a verb to the agent is feedback;
// - R-M10: rm -r of .work-items/ or .memory/ in the main checkout is refused;
// - R-M9: a password inside an address is never saved to memory.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, tk } from '../project/helpers.mjs';
import { fixture } from './fixtures.mjs';
import { proposalType, namesOpenProposal, memoryQuestionAsked } from '../../lib/hooks/proposal.mjs';
import { saveWords } from '../../lib/hooks/phrases.mjs';
import { recursiveRemovePaths } from '../../lib/hooks/shell.mjs';
import { LOOSE_REASON } from '../../lib/hooks/stop.mjs';
import { secretKind } from '../../lib/memory/contract.mjs';

after(cleanup);

const HOSTS = ['claude', 'codex'];
let seq = 0;

async function hook(root, env, host, event, name, vars) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(fixture(host, name, { CWD: root, ...vars })) });
  return { code: res.code, raw: res.stdout, out: res.stdout.trim() ? JSON.parse(res.stdout) : null };
}

const SAVE = "toolkit memory save --type user --name node-24-macbook --description 'Mike Rihm runs tip-split only on a MacBook Air with Node 24' --body-file /tmp/x.md --approved-by 'Mike Rihm'";
const PROPOSAL = "toolkit memory save --type user --name node-24-macbook --description 'Mike Rihm runs tip-split only on a MacBook Air with Node 24' --body-file /tmp/x.md --proposal";

/** One turn: the owner's prompt, then the agent's save command. Returns the PostToolUse output. */
async function turn(root, env, host, { session, prompt, command = SAVE, before = null }) {
  seq += 1;
  const TURN = `co-turn-${seq}`;
  if (before) await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN: `co-turn-before-${seq}`, MESSAGE: before });
  await hook(root, env, host, 'user-prompt', 'user-prompt', { SESSION: session, TURN, PROMPT: prompt });
  return hook(root, env, host, 'post-tool', 'post-tool.bash', { SESSION: session, TURN, COMMAND: command, STDOUT: 'Saved to memory: user_node_24_macbook (new record).' });
}

test('R-I4: a save with --approved-by after a remark made in passing gets a note, in both hosts', async () => {
  const { root, env } = await initProject();
  for (const host of HOSTS) {
    const passing = await turn(root, env, host, { session: `${host}-passing`, prompt: 'FYI, I only ever run tip-split on my MacBook Air with Node 24.' });
    assert.equal(passing.code, 0);
    const text = passing.out && passing.out.hookSpecificOutput && passing.out.hookSpecificOutput.additionalContext;
    assert.ok(text, `${host}: ${passing.raw}`);
    assert.match(text, /^This save says Mike Rihm approved it \(--approved-by\), but his message this turn has no keep phrase or other words asking for a save/);
    assert.match(text, /A fact or preference he mentions in passing is a proposal, not an approval\./);
    assert.match(text, /ask "Save to memory: <one line>\?"/);
    assert.equal(passing.out.decision, undefined, `${host}: a note, never a block`);

    // His keep phrase, or other words asking for a save: no note.
    for (const prompt of ['Remember that I only run tip-split on my MacBook Air with Node 24.', 'Save that: I only run it on Node 24.', 'Always test on Node 24.']) {
      const asked = await turn(root, env, host, { session: `${host}-asked-${seq}`, prompt });
      assert.equal(asked.raw, '', `${host}: ${prompt}`);
    }
    // His answer to the agent's "Save to memory: ...?" question: no note.
    const answered = await turn(root, env, host, { session: `${host}-answered`, prompt: 'Yes.', before: 'Done. Save to memory: you run tip-split only on your MacBook Air with Node 24?' });
    assert.equal(answered.raw, '', `${host}: an answer to the question`);
    // A proposal claims no approval: no note.
    const proposal = await turn(root, env, host, { session: `${host}-proposal`, prompt: 'FYI, I only ever run tip-split on my MacBook Air with Node 24.', command: PROPOSAL });
    assert.equal(proposal.raw, '', `${host}: a proposal`);
  }
});

test('R-I4 helpers: save words and memory questions', () => {
  assert.equal(saveWords('FYI, I only ever run tip-split on my MacBook Air with Node 24.'), false);
  assert.equal(saveWords('From now on use Node 24.'), true);
  assert.equal(saveWords('Please save that to memory.'), true);
  assert.equal(saveWords('> remember that\n\nWhat does this quote mean?'), false, 'quoted text is not the owner speaking');
  assert.equal(memoryQuestionAsked('Done. Save to memory: you use Node 24?'), true);
  assert.equal(memoryQuestionAsked('Should I keep that as a standing preference?'), true);
  assert.equal(memoryQuestionAsked('Do you approve this result?'), false);
});

test('R-M1: a loose memory question about an existing memory proposal gets no Stop block; a new one still does', async () => {
  const { root, env } = await initProject();
  const about = 'One decision needs you: a memory proposal about npm releases.\n\nI recommend yes.\n\nShould I save "Mike publishes slug releases to npm personally" to memory?';
  assert.equal(namesOpenProposal(about), true);
  assert.equal(namesOpenProposal('Should I save it to memory?'), false);
  assert.equal(namesOpenProposal('Approve user_slug_releases_npm?'), true, 'a record key');
  for (const host of HOSTS) {
    seq += 1;
    const session = `${host}-loose-${seq}`;
    await hook(root, env, host, 'user-prompt', 'user-prompt', { SESSION: session, TURN: `t-${seq}`, PROMPT: 'What do you need from me?' });
    const quiet = await hook(root, env, host, 'stop', 'stop', { SESSION: session, TURN: `t-${seq}`, MESSAGE: about });
    assert.equal(quiet.raw, '', `${host}: ${quiet.raw}`);
    seq += 1;
    const session2 = `${host}-loose-${seq}`;
    await hook(root, env, host, 'user-prompt', 'user-prompt', { SESSION: session2, TURN: `t-${seq}`, PROMPT: 'I only deploy on Tuesdays.' });
    const loud = await hook(root, env, host, 'stop', 'stop', { SESSION: session2, TURN: `t-${seq}`, MESSAGE: 'Noted. Should I save it to memory?' });
    const reason = host === 'codex' ? loud.out.reason : loud.out.hookSpecificOutput.additionalContext;
    assert.equal(reason, LOOSE_REASON, host);
  }
});

test('R-M7: a proposal summary that starts with a verb to the agent is a rule proposal (feedback_ is retired, 2026-09-29)', () => {
  assert.equal(proposalType('Ask one requirements question at a time', 'Mike Rihm'), 'rule');
  assert.equal(proposalType('Always run the tests before asking for a review', 'Mike Rihm'), 'rule');
  assert.equal(proposalType('Never deploy on Fridays', 'Mike Rihm'), 'rule');
  assert.equal(proposalType('You prefer tabs over spaces', 'Mike Rihm'), 'user', 'a preference about something other than the work is a fact about him');
  assert.equal(proposalType('The staging sandbox is called uat2', 'Mike Rihm'), 'project');
});

test('R-M10: rm -r of .work-items/ or .memory/ in the main checkout is refused in both hosts; other deletes run', async () => {
  assert.deepEqual(recursiveRemovePaths('rm -rf .work-items'), ['.work-items']);
  assert.deepEqual(recursiveRemovePaths('rm -r -f build .memory/'), ['build', '.memory/']);
  assert.deepEqual(recursiveRemovePaths('rm .memory/MEMORY.md'), [], 'not recursive');
  assert.deepEqual(recursiveRemovePaths('sudo rm --recursive -- .work-items'), ['.work-items']);
  const { root, env } = await initProject();
  fs.mkdirSync(path.join(root, 'build'), { recursive: true });
  for (const host of HOSTS) {
    for (const cmd of ['rm -rf .work-items', 'rm -rf .memory/', 'rm -rf .work-items/*', `rm -rf ${path.join(root, '.memory')}`, 'cd . && rm -Rf ./.work-items']) {
      seq += 1;
      const r = await hook(root, env, host, 'pre-tool', 'pre-tool.bash', { SESSION: `rm-${seq}`, TURN: `rm-${seq}`, COMMAND: cmd });
      assert.equal(r.out && r.out.hookSpecificOutput.permissionDecision, 'deny', `${host}: ${cmd}`);
      assert.match(r.out.hookSpecificOutput.permissionDecisionReason, /is Git-ignored on purpose, so Git cannot bring it back\. Nothing was deleted\./);
      if (host === 'codex') assert.doesNotMatch(r.out.hookSpecificOutput.permissionDecisionReason, /\.$/, 'Codex adds ". Command: ..." itself');
    }
    for (const cmd of ['rm -rf build', 'rm -rf node_modules .cache']) {
      seq += 1;
      const r = await hook(root, env, host, 'pre-tool', 'pre-tool.bash', { SESSION: `rm-${seq}`, TURN: `rm-${seq}`, COMMAND: cmd });
      assert.equal(r.raw, '', `${host}: ${cmd}`);
    }
  }
});

test('R-M9: a password inside an address is never saved to memory; a placeholder is', async () => {
  assert.equal(secretKind('postgres://admin:hunter2@db.example.com:5432/app'), 'a password in an address (scheme://user:password@host)');
  assert.equal(secretKind('redis://:s3cret@localhost:6379'), 'a password in an address (scheme://user:password@host)');
  assert.equal(secretKind('postgres://admin:<password>@db.example.com:5432/app'), null);
  assert.equal(secretKind('postgres://admin:$DB_PASSWORD@db.example.com/app'), null);
  assert.equal(secretKind('The docs are at https://docs.example.com/guide and mailto:mike@example.com'), null);
  const { root, env } = await initProject();
  const refused = await tk(root, ['memory', 'save', '--type', 'reference', '--name', 'app-database', '--description', 'The app database address', '--body', '# App database\n\n**Remember:** postgres://admin:Tr0ub4dor@db.example.com:5432/app\n', '--source', 'Mike, 2026-09-28', '--approved-by', 'Mike'], { env });
  assert.equal(refused.code, 2, refused.stdout + refused.stderr);
  assert.match(refused.stdout + refused.stderr, /a password in an address/);
  assert.doesNotMatch(refused.stdout + refused.stderr, /Tr0ub4dor/, 'the password is never repeated');
  const kept = await tk(root, ['memory', 'save', '--type', 'reference', '--name', 'app-database', '--description', 'The app database address', '--body', '# App database\n\n**Remember:** postgres://admin:<password>@db.example.com:5432/app; the password is in 1Password under App DB.\n', '--source', 'Mike, 2026-09-28', '--approved-by', 'Mike'], { env });
  assert.equal(kept.code, 0, kept.stdout + kept.stderr);
});

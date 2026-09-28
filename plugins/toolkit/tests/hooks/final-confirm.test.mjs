// Stop-hook proposal fixes from the final confirmation round 1 (2026-09-28):
// - a summary asked in the second person ("You publish your blog on Ghost")
//   is saved with the owner's name, and approve rewrites an older one
//   (local and Notion runs);
// - a preference the owner states is `user`, even about the agent
//   (Hindsight run L3), and the title is not cut in the middle of a phrase;
// - the key does not repeat its type word (Salesforce run).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { cleanup, initProject, tk } from '../project/helpers.mjs';
import { fixture } from './fixtures.mjs';
import { ownerWording, proposalArgs, proposalBody, proposalName, proposalTitle, proposalType } from '../../lib/hooks/proposal.mjs';
import { ownerWordedProposal } from '../../lib/memory/proposals.mjs';

after(cleanup);

const arg = (args, flag) => args[args.indexOf(flag) + 1];

test('a summary that starts with "you" names the owner; other summaries are kept as they are', () => {
  assert.equal(ownerWording('You publish your blog on Ghost, and Ghost keeps only the first 190 characters of a slug', 'Mike Rihm'),
    'Mike Rihm publishes Mike\'s blog on Ghost, and Ghost keeps only the first 190 characters of a slug');
  assert.equal(ownerWording('you run days-until only on your MacBook Air with Node 24', 'Mike Rihm'), 'Mike Rihm runs days-until only on Mike\'s MacBook Air with Node 24');
  assert.equal(ownerWording('You\'re the only one who deploys to production', 'Mike Rihm'), 'Mike Rihm is the only one who deploys to production');
  assert.equal(ownerWording('You deploy on Fridays, and Ghost emails you a report when you finish', 'Mike Rihm'), 'Mike Rihm deploys on Fridays, and Ghost emails Mike a report when Mike finishes');
  assert.equal(ownerWording('You don\'t want emoji in commit messages', 'Mike Rihm'), 'Mike Rihm doesn\'t want emoji in commit messages');
  assert.equal(ownerWording('Your staging sandbox is called uat2', 'Mike Rihm'), 'Mike Rihm\'s staging sandbox is called uat2');
  assert.equal(ownerWording('You try new builds on your phone first', ''), 'The owner tries new builds on the owner\'s phone first');
  assert.equal(ownerWording('Deploys happen on Tuesdays, when you are free', 'Mike Rihm'), 'Deploys happen on Tuesdays, when you are free', 'only a summary that starts with "you"');
});

test('the Stop hook proposal uses the owner\'s name, keeps the question\'s words in the evidence, and types it from the question', () => {
  const args = proposalArgs('You publish your blog on Ghost, and Ghost keeps only the first 190 characters of a slug', { ownerName: 'Mike Rihm', date: '2026-09-28' });
  assert.equal(arg(args, '--type'), 'project');
  assert.equal(arg(args, '--description'), 'Mike Rihm publishes Mike\'s blog on Ghost, and Ghost keeps only the first 190 characters of a slug');
  const body = arg(args, '--body');
  assert.match(body, /^# Mike Rihm publishes Mike's blog on Ghost, and Ghost keeps only the first 190 characters of a slug$/m);
  assert.match(body, /^\*\*Remember:\*\* Mike Rihm publishes Mike's blog on Ghost, and Ghost keeps only the first 190 characters of a slug\.$/m);
  assert.match(body, /the agent asked the owner "Save to memory: You publish your blog on Ghost, and Ghost keeps only the first 190 characters of a slug\?"/);
  assert.doesNotMatch(arg(args, '--name'), /^you\b|-you-/);
});

test('a preference the owner states is user, even about the agent; the type word is not repeated in the key; a long title is cut at a clause', () => {
  assert.equal(proposalType('For small changes, Mike prefers working directly with the agent without helper agents', 'Mike Rihm'), 'user');
  assert.equal(proposalType('You prefer tabs over spaces', 'Mike Rihm'), 'user');
  assert.equal(proposalType('The agent should run tests before asking', 'Mike'), 'feedback');
  assert.equal(proposalType('You should stop adding comments, instead of asking', 'Mike'), 'feedback');
  assert.equal(proposalName('Sandbox deploy checks in this project usually take longer than 10 minutes', 'project'), 'sandbox-deploy-checks-usually-take-longer-than-10');
  assert.equal(proposalTitle('For small changes, Mike prefers working directly with the agent without helper agents'), 'For small changes, Mike prefers working directly with the agent without helper agents', 'under 100 characters: the whole summary');
  const long = 'For small changes, Mike prefers working directly with the agent without helper agents, and he asks for a short summary at the end of each change';
  assert.equal(proposalTitle(long), 'For small changes, Mike prefers working directly with the agent without helper agents');
  const noClause = 'Mike keeps every generated report for the quarterly audit in the shared drive folder named Audit Reports Archive Current Year Only';
  assert.match(proposalTitle(noClause), /^Mike keeps every .* \w+\.\.\.$/);
  assert.ok(proposalTitle(noClause).length <= 103);
});

test('toolkit memory approve names the owner in a proposal the Stop hook saved with "you" before this fix', async () => {
  // A proposal written the old way: the question's words as they were.
  const old = proposalBody('You publish your blog on Ghost', '2026-09-28');
  const worded = ownerWordedProposal({ body: old, description: 'You publish your blog on Ghost' }, 'Mike Rihm');
  assert.match(worded.body, /^# Mike Rihm publishes Mike's blog on Ghost$/m);
  assert.match(worded.body, /^\*\*Remember:\*\* Mike Rihm publishes Mike's blog on Ghost\.$/m);
  assert.match(worded.body, /"Save to memory: You publish your blog on Ghost\?"/, 'the evidence quote is kept');
  assert.equal(worded.description, 'Mike Rihm publishes Mike\'s blog on Ghost');
  assert.deepEqual(ownerWordedProposal({ body: '# You x\n\n**Remember:** You x.\n', description: 'You x' }, 'Mike'), { body: '# You x\n\n**Remember:** You x.\n', description: 'You x' }, 'a record the hook did not save is kept');

  const { root, env } = await initProject();
  const saved = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'publish-blog-ghost', '--description', 'You publish your blog on Ghost', '--body', old, '--source', 'Agent question in a session, 2026-09-28', '--proposal'], { env });
  assert.equal(saved.code, 0, saved.stdout + saved.stderr);
  const approved = await tk(root, ['memory', 'approve', 'project_publish_blog_ghost', '--by', 'Mike Rihm'], { env });
  assert.equal(approved.code, 0, approved.stdout + approved.stderr);
  const rec = (await tk(root, ['memory', 'get', 'project_publish_blog_ghost', '--json'], { env })).json;
  assert.equal(rec.status, 'current');
  // initProject's owner is "Mike".
  assert.equal(rec.description, 'Mike publishes Mike\'s blog on Ghost');
  assert.match(rec.body, /^\*\*Remember:\*\* Mike publishes Mike's blog on Ghost\.$/m);
});

test('the Stop hook saves a second-person question with the owner\'s name', async () => {
  const { root, env } = await initProject();
  const session = 'you-wording';
  const TURN = 'turn-y1';
  await tk(root, ['hook', 'user-prompt', '--host', 'codex'], { env, stdin: JSON.stringify(fixture('codex', 'user-prompt', { CWD: root, SESSION: session, TURN, PROMPT: 'I only run it on my MacBook Air. Ask me before you save it.' })) });
  await tk(root, ['hook', 'stop', '--host', 'codex'], { env, stdin: JSON.stringify(fixture('codex', 'stop', { CWD: root, SESSION: session, TURN, MESSAGE: 'Save to memory: you run days-until only on your MacBook Air with Node 24?' })) });
  const list = (await tk(root, ['memory', 'list', '--status', 'all', '--json'], { env })).json;
  const records = list.records || list;
  const rec = records.find((r) => /days_until/.test(r.key));
  assert.ok(rec, JSON.stringify(records));
  assert.equal(rec.description, 'Mike runs days-until only on Mike\'s MacBook Air with Node 24');
});

// ------------------------------------------------------------------ Codex deny reasons

import { updatePatch } from './fixtures.mjs';

test('a Codex PreToolUse refusal has no final period, because Codex adds ". Command: ..." after it; Claude Code keeps it', async () => {
  const { root, env } = await initProject();
  const hook = async (host, name, vars) => JSON.parse((await tk(root, ['hook', 'pre-tool', '--host', host], { env, stdin: JSON.stringify(fixture(host, name, { CWD: root, SESSION: 's-deny', TURN: 't-deny', ...vars })) })).stdout);
  const codex = await hook('codex', 'pre-tool.apply-patch', { PATCH: updatePatch('ai-external-knowledge/INDEX.md', 'a', 'b') });
  assert.equal(codex.hookSpecificOutput.permissionDecision, 'deny');
  assert.match(codex.hookSpecificOutput.permissionDecisionReason, /then run toolkit index knowledge$/);
  const claude = await hook('claude', 'pre-tool.write', { FILE: `${root}/ai-external-knowledge/INDEX.md` });
  assert.match(claude.hookSpecificOutput.permissionDecisionReason, /then run toolkit index knowledge\.$/);
});

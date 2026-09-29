// Close-out fixes of 2026-09-28 (dev/final-review.md, "Re-review 2026-09-28"):
// - R-B1: the acceptance check runs before every result approval, whoever
//   built the change (the owner's decision of 2026-09-28). Moving an item to
//   11 User approval or recording the result approval with no
//   acceptance-checker check since the last build prints a note, and
//   toolkit work decisions lists the check as the agent's to-do;
// - R-M4: an Open Questions row for the owner that holds no recommendation
//   gets a note, so a later session can match "go with your recommendation";
// - R-M5: after a hand rename, toolkit work show names the item's existing
//   worktree, not one built from the new title.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, git } from './helpers.mjs';
import { acceptanceCheckRecorded } from '../../lib/work/decisions.mjs';
import { questionRowNote } from '../../lib/work/ops.mjs';

after(cleanup);

const history = (rows) => `# WI-001: X\n\n## Recent History\n\n| Date | Change or decision | Effect on the work |\n|---|---|---|\n${rows.map((r) => `| 2026-09-28 | ${r[0]} | ${r[1] || 'None.'} |`).join('\n')}\n`;

test('acceptanceCheckRecorded: a check after the last build or fix counts; one before it, or a note that no check ran, does not', () => {
  // Newest first, as the tracker writes them.
  assert.equal(acceptanceCheckRecorded(history([
    ['Set stage 09 Testing -> 11 User approval (status In review).'],
    ['Checked: R-01 to R-03 against commit 4f2a9c1; acceptance-checker: R-01 to R-03 met; evidence: tests/WI-001-TEST-PLAN.md; gaps: none'],
    ['Set stage 08 Implementation -> 09 Testing (status In progress).'],
    ['Set stage 07 Build planning -> 08 Implementation (status In progress).'],
  ])), true);
  assert.equal(acceptanceCheckRecorded(history([
    ['Set stage 10 Bug fixing -> 09 Testing (status In progress).'],
    ['Set stage 09 Testing -> 10 Bug fixing (status In progress).'],
    ['Checked: R-01; acceptance-checker: R-01 not met; evidence: report; gaps: R-01'],
  ])), false, 'a check before the fix checked the older build');
  assert.equal(acceptanceCheckRecorded(history([
    ['Checked: R-01; acceptance-checker: none, this host cannot start a worker; evidence: my own run; gaps: none'],
  ])), false);
  assert.equal(acceptanceCheckRecorded(history([
    ['Checked: R-01 and R-02; evidence: tests pass; gaps: no independent check ran because the owner chose no agent team'],
  ])), false, '"no agent team" never stands in for the check');
  assert.equal(acceptanceCheckRecorded(history([
    ['Checked: R-01 and R-02; acceptance-checker: both met; evidence: report; gaps: the manual step on a phone was not run'],
  ])), true, 'a gap in the result does not mean the check did not run');
  assert.equal(acceptanceCheckRecorded(history([['Item created.']])), false);
});

test('moving an item to 11 User approval with no acceptance check prints a note; a recorded check removes it', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await newItem(dir, 'Tip command', ['--type', 'task']);
  await tk(dir, ['work', 'set', id, '--stage', '08-implementation']);
  await tk(dir, ['work', 'set', id, '--stage', '09-testing']);
  const first = await tk(dir, ['work', 'set', id, '--stage', '11-user-approval', '--waiting-on', 'owner']);
  assert.equal(first.code, 0, first.stderr);
  assert.match(first.stdout, /Note: WI-001 is at 11 User approval, and no acceptance-checker check is recorded since its last build\. Before you ask the owner to approve the result, start one acceptance-checker that did not build it \(work-check, step 3\)\. It runs whoever built the change: "no agent team" or owner-led delivery does not remove it\./);

  const todo = await tk(dir, ['work', 'decisions', '--json']);
  const check = todo.json.agentTodos.find((t) => t.id === id && t.kind === 'acceptance_check');
  assert.ok(check, JSON.stringify(todo.json.agentTodos));
  assert.equal(check.continueWith, 'work-check');
  assert.ok(!todo.json.decisions.some((d) => d.kind === 'acceptance_check'), 'the check is the agent\'s step, not the owner\'s decision');

  // The approval before the check: recorded, with a note.
  const early = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm']);
  assert.equal(early.code, 0, early.stderr);
  assert.match(early.stdout, /Note: No acceptance-checker check of WI-001 is recorded since its last build\. The owner's approval is recorded, but the independent check comes before a result approval, whoever built the change: start one acceptance-checker now/);

  // A second item: the check is recorded first, so nothing is said.
  const id2 = await newItem(dir, 'Split option', ['--type', 'task']);
  await tk(dir, ['work', 'set', id2, '--stage', '08-implementation']);
  await tk(dir, ['work', 'set', id2, '--stage', '09-testing']);
  await tk(dir, ['work', 'history', id2, '--note', 'Checked: R-01 against commit 4f2a9c1; acceptance-checker: R-01 met; evidence: the checker report; gaps: none']);
  const second = await tk(dir, ['work', 'set', id2, '--stage', '11-user-approval', '--waiting-on', 'owner']);
  assert.doesNotMatch(second.stdout, /acceptance-checker/);
  const todo2 = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(!todo2.json.agentTodos.some((t) => t.id === id2 && t.kind === 'acceptance_check'));
  const approved = await tk(dir, ['work', 'approve', id2, '--result', '--by', 'Mike Rihm']);
  assert.doesNotMatch(approved.stdout, /acceptance-checker/);

  // A fix after the check needs a new check.
  await tk(dir, ['work', 'set', id2, '--stage', '10-bug-fixing']);
  const again = await tk(dir, ['work', 'set', id2, '--stage', '11-user-approval']);
  assert.match(again.stdout, /no acceptance-checker check is recorded since its last build/);
});

test('an Open Questions row for the owner with no recommendation gets a note; one with a recommendation does not', async () => {
  assert.equal(questionRowNote('WI-001', 'Tasks', '| Q-01 | X? | R-01 | Open | owner |'), null, 'only Open Questions rows');
  assert.equal(questionRowNote('WI-001', 'Open Questions', '| Q-02 | Which rule? Recommended: whole cents, because the bank rounds that way. | R-02 | Open | owner |'), null);
  assert.equal(questionRowNote('WI-001', 'Open Questions', '| Q-03 | Which vendor? | R-03 | Open | Finance team |'), null, 'a question for someone else');
  assert.match(questionRowNote('WI-001', 'Open Questions', '| Q-04 | Which input rule? | R-01 | Open | owner |'), /^Q-04 holds no recommendation\./);

  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await newItem(dir, 'Tip command', ['--type', 'task']);
  const bare = await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', '| Q-01 | Do you approve that input rule? | R-01 | Open | owner |']);
  assert.equal(bare.code, 0, bare.stderr);
  assert.match(bare.stdout, /Note: Q-01 holds no recommendation\. When you gave the owner one with the question, add it to the Question cell \("<question> Recommended: <answer>, because <reason>\."\), so a later session knows what "go with your recommendation" means\./);
  const withRec = await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', '| Q-02 | Which input rule? Recommended: bills of 0 or more with at most two decimals, because a bill is never negative. | R-01 | Open | owner |']);
  assert.equal(withRec.code, 0, withRec.stderr);
  assert.doesNotMatch(withRec.stdout, /holds no recommendation/);
});

test('after a hand rename, toolkit work show names the item\'s existing worktree, not one built from the new title', async () => {
  const dir = makeProject({ owner: 'Mike Rihm', commit: true });
  const id = await newItem(dir, 'Build the tip split command', ['--type', 'task']);
  const made = await tk(dir, ['work', 'show', id, '--json']);
  const { branch, folder } = made.json.worktreeBranch;
  assert.equal(branch, 'claude/wi-001-build-the-tip-split-command');
  git(dir, ['worktree', 'add', '-q', path.join(dir, folder), '-b', branch]);
  // A builder's branch made from the item's branch is longer; the item's own is named.
  git(dir, ['worktree', 'add', '-q', path.join(dir, '.claude', 'worktrees', 'wi-001-build-the-tip-split-command-task-2'), '-b', `${branch}-task-2`]);
  await tk(dir, ['work', 'set', id, '--title', 'Build the tip split bill command']);
  const shown = await tk(dir, ['work', 'show', id]);
  assert.match(shown.stdout, /Worktree branch for this item: claude\/wi-001-build-the-tip-split-command \(folder \.claude\/worktrees\/wi-001-build-the-tip-split-command\)/);
  const json = await tk(dir, ['work', 'show', id, '--json']);
  assert.equal(json.json.worktreeBranch.branch, branch);
  assert.equal(json.json.worktreeBranch.existing, true);
  // With no worktree yet, the name comes from the current title.
  const id2 = await newItem(dir, 'Readme brief', ['--type', 'task']);
  const other = await tk(dir, ['work', 'show', id2, '--json']);
  assert.equal(other.json.worktreeBranch.branch, 'claude/wi-002-readme-brief');
});

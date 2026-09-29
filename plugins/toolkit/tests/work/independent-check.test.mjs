// R-B1 in code (close-out 2026-09-28, dev/final-review.md "Before the goal can
// be called met", 1): the acceptance check before a result approval is a step
// that must happen every time, so the toolkit command enforces it (the goal
// adjustment: anything that must happen every time lives in the toolkit
// command or a hook).
// - toolkit work approve --result and toolkit work finish refuse (exit 2)
//   unless an "acceptance-checker: <verdict>" history note follows the item's
//   last move to 08 Build or 10 Bug fixing;
// - the only way past is --no-independent-check --reason <text> (a host with
//   no way to start a worker), and the reason is recorded in the history;
// - a fix after the check (a move to 10) needs a new check.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { makeProject, cleanup, tk, newItem, readRecord, recordCheck } from './helpers.mjs';
import { acceptanceCheckOrSkipRecorded, NO_CHECK_WORDS } from '../../lib/work/decisions.mjs';

after(cleanup);

async function builtItem(dir, title) {
  const id = await newItem(dir, title, ['--type', 'task']);
  await tk(dir, ['work', 'set', id, '--stage', '08-implementation']);
  await tk(dir, ['work', 'set', id, '--stage', '09-testing']);
  await tk(dir, ['work', 'set', id, '--stage', '11-user-approval', '--waiting-on', 'owner']);
  return id;
}

test('approve --result and finish refuse with exit 2 until an acceptance-checker verdict follows the last build', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await builtItem(dir, 'Tip command');
  const before = await readRecord(dir, id);

  const approve = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm', '--json']);
  assert.equal(approve.code, 2);
  assert.equal(approve.json.error.details.gate, 'acceptance_check_missing');
  assert.match(approve.json.error.message, /^The result approval of WI-001 was not recorded: no acceptance-checker verdict is recorded since its last move to 08 Build or 10 Bug fixing\./);
  assert.match(approve.json.error.message, /"no agent team" or owner-led delivery does not remove it/);
  assert.match(approve.json.error.details.fix, /toolkit work history WI-001 --note 'Checked: <what>; acceptance-checker: <its verdict>; evidence: <where>; gaps: <gaps or none>'/);
  assert.match(approve.json.error.details.fix, /Only when this host has no way to start a worker: add --no-independent-check --reason '<why no worker could start>'/);

  const finish = await tk(dir, ['work', 'finish', id, '--by', 'Mike Rihm', '--evidence', 'Tests pass.', '--quote', 'Ship it.', '--json']);
  assert.equal(finish.code, 2);
  assert.equal(finish.json.error.details.gate, 'acceptance_check_missing');
  assert.match(finish.json.error.message, /^WI-001 was not finished: no acceptance-checker verdict/);
  assert.equal(await readRecord(dir, id), before, 'nothing was changed');

  // A note that only names the checker, or says it did not run, is not a check.
  await tk(dir, ['work', 'history', id, '--note', 'acceptance-checker: none, the owner asked for no agent team']);
  assert.equal((await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm'])).code, 2);

  // The verdict recorded: both go through.
  await recordCheck(dir, id, { verdict: 'R-01 met on the exact commit' });
  const ok = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm']);
  assert.equal(ok.code, 0, ok.stderr);
  assert.doesNotMatch(ok.stdout, /acceptance-checker|independent/);
  const done = await tk(dir, ['work', 'finish', id, '--by', 'Mike Rihm', '--evidence', 'Tests pass.']);
  assert.equal(done.code, 0, done.stderr);
  assert.match(done.stdout, /^WI-001 is Done\./);
});

test('a fix after the check needs a new check', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await builtItem(dir, 'Split option');
  await recordCheck(dir, id);
  await tk(dir, ['work', 'set', id, '--stage', '10-bug-fixing']);
  await tk(dir, ['work', 'set', id, '--stage', '11-user-approval']);
  assert.equal((await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm'])).code, 2, 'the check came before the fix');
  await recordCheck(dir, id);
  assert.equal((await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm'])).code, 0);
});

test('--no-independent-check needs --reason; the reason is recorded, and finish then goes on without the flag', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await builtItem(dir, 'Rounding rule');
  const noReason = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm', '--no-independent-check']);
  assert.equal(noReason.code, 2);
  assert.match(noReason.stderr, /--no-independent-check needs --reason <text>: why this host could not start an acceptance-checker/);
  const wrongKind = await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike Rihm', '--no-independent-check', '--reason', 'x']);
  assert.equal(wrongKind.code, 2);
  assert.match(wrongKind.stderr, /applies only to a result approval/);

  const skipped = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm', '--no-independent-check', '--reason', 'This Codex host has no agent tool to start a worker.']);
  assert.equal(skipped.code, 0, skipped.stderr);
  assert.match(skipped.stdout, /Note: No independent acceptance check ran for WI-001; the reason is in its history\. Tell the owner so in the reply\./);
  const text = await readRecord(dir, id);
  assert.match(text, /Result approved by Mike Rihm without an independent acceptance check: This Codex host has no agent tool to start a worker\./);
  assert.ok(acceptanceCheckOrSkipRecorded(text.split('\n---\n').slice(1).join('\n---\n')));

  const done = await tk(dir, ['work', 'finish', id, '--by', 'Mike Rihm', '--evidence', 'Tried by hand.']);
  assert.equal(done.code, 0, done.stderr);
});

test('finish with the owner\'s words and no check needs the flag and records its reason', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await builtItem(dir, 'Readme tidy');
  const res = await tk(dir, ['work', 'finish', id, '--by', 'Mike Rihm', '--evidence', 'Read it.', '--quote', 'Looks good.', '--no-independent-check', '--reason', 'No worker can start in this host.']);
  assert.equal(res.code, 0, res.stderr);
  assert.match(await readRecord(dir, id), new RegExp(`Finished ${NO_CHECK_WORDS}: No worker can start in this host\\.`));
});

test('a history note that only holds the skip words is not a skip: finish refuses; only the row --no-independent-check writes counts (verifier, 2026-09-29)', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await builtItem(dir, 'Share rounding');
  // The verifier's bypass: free text in a note, then finish with the owner's words.
  await tk(dir, ['work', 'history', id, '--note', 'Result is ready without an independent acceptance check yet']);
  const finish = await tk(dir, ['work', 'finish', id, '--by', 'Mike Rihm', '--evidence', 'Tried it.', '--quote', 'I approve', '--json']);
  assert.equal(finish.code, 2, finish.stdout);
  assert.equal(finish.json.error.details.gate, 'acceptance_check_missing');
  // A note cannot be written to look like the approval row.
  const forged = await tk(dir, ['work', 'history', id, '--note', 'Result approved by Mike Rihm without an independent acceptance check: no reason.']);
  assert.equal(forged.code, 2);
  assert.match(forged.stderr, /A note cannot record a result approval/);
  assert.equal((await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm'])).code, 2);
  // Such a row counts only with a recorded result approval, and only in the form approve writes.
  const row = (change) => `## Recent History\n\n| Date | Change or decision | Effect on the work |\n| --- | --- | --- |\n| 2026-09-29 | ${change} | x |\n`;
  assert.equal(acceptanceCheckOrSkipRecorded(row('Result approved by Mike Rihm without an independent acceptance check: no worker.'), { resultApproved: false }), false);
  assert.equal(acceptanceCheckOrSkipRecorded(row('Result approved by Mike Rihm without an independent acceptance check: no worker.')), true);
  assert.equal(acceptanceCheckOrSkipRecorded(row('Result is ready without an independent acceptance check yet')), false);
  assert.match(await readRecord(dir, id), /status: (?!Done)/);
  // The flag's own row, with its reason, is the way past.
  const skipped = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm', '--no-independent-check', '--reason', 'This host cannot start a worker.']);
  assert.equal(skipped.code, 0, skipped.stderr);
  const done = await tk(dir, ['work', 'finish', id, '--by', 'Mike Rihm', '--evidence', 'Tried it.']);
  assert.equal(done.code, 0, done.stderr);
});

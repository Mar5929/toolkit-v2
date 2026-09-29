// Verifier finding of 2026-09-28 (minor): only the recorded form
// "acceptance-checker: <verdict>" with a verdict word counts as an acceptance
// check. A note that only names the acceptance-checker, such as "Asked whether
// to start the acceptance-checker", does not clear the to-do or the note.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { acceptanceCheckRecorded } from '../../lib/work/decisions.mjs';
import { makeProject, cleanup, tk, newItem } from './helpers.mjs';

after(cleanup);

const history = (rows) => `# WI-001: X\n\n## Recent History\n\n| Date | Change or decision | Effect on the work |\n|---|---|---|\n${rows.map((r) => `| 2026-09-28 | ${r} | None. |`).join('\n')}\n`;

test('acceptanceCheckRecorded counts only "acceptance-checker: <verdict>" with a verdict word', () => {
  assert.equal(acceptanceCheckRecorded(history(['Asked whether to start the acceptance-checker'])), false);
  assert.equal(acceptanceCheckRecorded(history(['The independent check will run next.'])), false);
  assert.equal(acceptanceCheckRecorded(history(['Started the acceptance-checker; acceptance-checker: running'])), false, 'no verdict yet');
  assert.equal(acceptanceCheckRecorded(history(['Checked: R-01; acceptance-checker: R-01 met; evidence: report; gaps: none'])), true);
  assert.equal(acceptanceCheckRecorded(history(['acceptance-checker: not ready, R-02 not met'])), true, 'a failing verdict is still a check that ran');
  assert.equal(acceptanceCheckRecorded(history(['Checked: all; acceptance-checker: ready for the owner; evidence: report; gaps: none'])), true);
  assert.equal(acceptanceCheckRecorded(history(['acceptance-checker: none, this host cannot start a worker'])), false);
});

test('a history note that only names the acceptance-checker leaves the to-do and the approval note in place', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await newItem(dir, 'Tip command', ['--type', 'task']);
  await tk(dir, ['work', 'set', id, '--stage', '08-implementation']);
  await tk(dir, ['work', 'set', id, '--stage', '09-testing']);
  await tk(dir, ['work', 'set', id, '--stage', '11-user-approval', '--waiting-on', 'owner']);
  await tk(dir, ['work', 'history', id, '--note', 'Asked whether to start the acceptance-checker']);
  const todo = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(todo.json.agentTodos.some((t) => t.id === id && t.kind === 'acceptance_check'), JSON.stringify(todo.json.agentTodos));
  // Since R-B1 in code (close-out 2026-09-28) the approval is refused, not recorded with a note.
  const refused = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm']);
  assert.equal(refused.code, 2);
  assert.match(refused.stderr, /no acceptance-checker verdict is recorded since its last move to 08 Build or 10 Bug fixing/);
});

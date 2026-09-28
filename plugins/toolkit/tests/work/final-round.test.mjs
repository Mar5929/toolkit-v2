// Work engine checks added while the four fix areas were brought together
// (final fix round, 2026-09-28). Each test names the finding it covers
// (dev/test-runs/open-bugs.md).

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { makeProject, cleanup, tk, newItem, readRecord } from './helpers.mjs';
import { parseDoc, parseHistory } from '../../lib/work/model.mjs';

after(cleanup);

const history = async (dir, id) => parseHistory(parseDoc(await readRecord(dir, id)).body);

const DESIGN = (id, words) => `# ${id}: Brief — solution design\n\n**Requirements:** ${id}  \n**Design status:** Proposed  \n**Requirements checked:** ${id} Requirements, 2026-09-27  \n**Last updated:** 2026-09-27  \n**Design approval:** Pending\n\n## What this design solves\n\n${words}\n\n## Design options\n\n### Option A — One short brief\n\nThree bullets at the top of README.md.\n`;

test('b-salesforce 47(f): changing the text of an approved design says so in the history row and keeps the approval', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  await tk(dir, ['work', 'design', id, '--create']);
  const saved = await tk(dir, ['work', 'design', id, '--text', DESIGN(id, 'A short brief.')]);
  assert.equal(saved.code, 0, saved.stderr);
  const approved = await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike Rihm']);
  assert.equal(approved.code, 0, approved.stdout + approved.stderr);
  const changed = await tk(dir, ['work', 'design', id, '--text', DESIGN(id, 'A short brief, with the CLI name corrected.')]);
  assert.equal(changed.code, 0, changed.stderr);
  assert.match(changed.stdout, /The design was approved\. A changed design may need the owner's approval again\./);
  const top = (await history(dir, id))[0];
  assert.equal(top.change, 'Design text changed after approval.');
  assert.match(top.effect, /^The text of the approved design changed\. Tell the owner what changed/);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.design, 'approved', 'the approval stays until the owner is asked again');
});

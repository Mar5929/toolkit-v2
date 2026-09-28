// Work engine fixes from the verifier's review of fix round 2: a failed
// design approval takes back what reached the item, recording the delivery
// answers the question that offered it, an approval clears the owner wait
// only when no other owner question is open, the old parent's history row
// names the sub-item, cancel removes the template guides, the Blockers
// warning has one period, a retitle keeps the old title and the folder
// rename in the history, a design choice asked without "approve" is found,
// and design header lines split by blank lines are joined.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, readRecord, recordPath } from './helpers.mjs';
import { openTracker } from '../../lib/work/driver.mjs';
import { requireProject } from '../../lib/core/config.mjs';
import { opApprove } from '../../lib/work/ops.mjs';
import { parseDoc, parseHistory, parseQuestions, validateRecord, separateLabelLines, removeHistoryRow, appendHistory } from '../../lib/work/model.mjs';
import { isDesignQuestion, isDeliveryQuestion } from '../../lib/work/decisions.mjs';

after(cleanup);

const history = async (dir, id) => parseHistory(parseDoc(await readRecord(dir, id)).body);
const DESIGN = (id) => `# ${id}: Brief — solution design\n\n**Requirements:** ${id}  \n**Design status:** Draft  \n**Design approval:** Pending\n\n## Design options\n\n### Option A — One short brief\n\nThree bullets.\n`;

test('removeHistoryRow takes out the one row it names and nothing else', () => {
  const body = '## Recent History\n\n| Date | Change or decision | Effect on the work |\n|---|---|---|\n| 2026-09-25 | Older. | Kept. |\n';
  const added = appendHistory(body, { date: '2026-09-26', change: 'Design approved by Mike.', effect: 'The design can be built.' });
  assert.equal(parseHistory(added)[0].change, 'Design approved by Mike.');
  const back = removeHistoryRow(added, { date: '2026-09-26', change: 'Design approved by Mike.' });
  assert.deepEqual(parseHistory(back).map((h) => h.change), ['Older.']);
  assert.equal(removeHistoryRow(back, { date: '2026-09-26', change: 'Design approved by Mike.' }), back, 'no match: unchanged');
});

test('local tracker: a failed item write during approve --design leaves the item and the design as they were', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  await tk(dir, ['work', 'design', id, '--create']);
  await tk(dir, ['work', 'design', id, '--text', DESIGN(id)]);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-01 | Which option do you approve: Option A or Option B? | design | Open | owner']);
  await tk(dir, ['work', 'set', id, '--waiting-on', 'owner']);
  const before = await readRecord(dir, id);
  const project = requireProject(dir);
  const t = await openTracker(project);
  const real = t.update.bind(t);
  let failed = 0;
  t.update = async (key, args) => {
    if (!failed && args.meta && args.meta.design === 'approved') {
      failed++;
      throw new Error('The disk is full.');
    }
    return real(key, args);
  };
  await assert.rejects(opApprove(t, project, id, { what: 'design', by: 'Mike', today: '2026-09-26' }), (err) => {
    assert.match(err.message, /^The design approval of WI-001 was not recorded: the design was saved, but WI-001 itself could not be updated \(The disk is full\)\. The design was written back as it was\. Nothing was approved\.$/);
    return true;
  });
  assert.equal(await readRecord(dir, id), before, 'the item file is unchanged');
  const d = await t.getDesign(id);
  assert.equal(d.meta.status, 'proposed');
  assert.equal(d.meta.approved, 'no');
});

test('recording the delivery marks the question that offered it Answered and ends the owner wait', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Big goal', ['--type', 'task', '--stage', '04']);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-01 | Would you like agents to take responsibility for delivering this, including its sub-item? | delivery | Open | owner']);
  await tk(dir, ['work', 'set', id, '--waiting-on', 'owner']);
  let d = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(d.json.decisions.some((x) => x.id === id && /Q-01/.test(x.what)));
  const r = await tk(dir, ['work', 'set', id, '--delivery', 'agent-led', '--note', "Owner's words: yes"]);
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /Marked Q-01 Answered: it asked for this delivery choice\./);
  assert.match(r.stdout, /It is no longer waiting on the owner \(waiting_on: none\)\./);
  const doc = parseDoc(await readRecord(dir, id));
  assert.deepEqual(parseQuestions(doc.body).map((q) => [q.id, q.status]), [['Q-01', 'Answered']]);
  assert.equal(doc.meta.waiting_on, 'none');
  assert.equal((await history(dir, id))[0].change, 'Set delivery agent-led. Q-01 answered. No longer waiting on the owner.');
  d = await tk(dir, ['work', 'decisions', '--json']);
  assert.equal(d.json.decisions.filter((x) => x.id === id).length, 0, 'nothing waits on the owner for it now');
  const text = await tk(dir, ['work', 'decisions']);
  assert.doesNotMatch(text.stdout, /Would you like agents/);
});

test('recording the delivery keeps the owner wait while another of his questions is open', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Big goal', ['--type', 'task', '--stage', '04']);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-01 | Should this be agent-led or owner-led? | delivery | Open | owner']);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-02 | Which colour should the banner be? | R-01 | Open | owner']);
  await tk(dir, ['work', 'set', id, '--waiting-on', 'owner']);
  const r = await tk(dir, ['work', 'set', id, '--delivery', 'owner-led', '--json']);
  assert.deepEqual(r.json.closedQuestions, ['Q-01']);
  const doc = parseDoc(await readRecord(dir, id));
  assert.equal(doc.meta.waiting_on, 'owner');
  assert.deepEqual(parseQuestions(doc.body).map((q) => [q.id, q.status]), [['Q-01', 'Answered'], ['Q-02', 'Open']]);
});

test('approve --design clears the owner wait only when no other owner question is open, and says which one still waits', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  await tk(dir, ['work', 'design', id, '--create']);
  await tk(dir, ['work', 'design', id, '--text', DESIGN(id)]);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-01 | Which option do you approve: Option A or Option B? | design | Open | owner']);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-02 | Should the banner say the date? | R-01 | Open | owner']);
  await tk(dir, ['work', 'set', id, '--waiting-on', 'owner']);
  const r = await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike']);
  assert.equal(r.code, 0, r.stderr);
  assert.doesNotMatch(r.stdout, /no longer waiting on the owner/);
  assert.match(r.stdout, /Marked Q-01 Answered/);
  assert.match(r.stdout, /It still waits on the owner for Q-02 \(waiting_on: owner\)\./);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.waiting_on, 'owner');
  assert.equal((await history(dir, id))[0].effect, 'The design can be built. Still waiting on the owner for Q-02. Q-01 answered by this approval.');

  // The result approval: no other question open, so the wait ends.
  const b = await newItem(dir, 'Result', ['--type', 'task', '--stage', '11']);
  await tk(dir, ['work', 'set', b, '--waiting-on', 'owner']);
  const ok = await tk(dir, ['work', 'approve', b, '--result', '--by', 'Mike']);
  assert.match(ok.stdout, /It is no longer waiting on the owner \(waiting_on: none\)\./);
});

test('a sub-item moved out by hand or with work move: the old parent\'s row names it', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Parent');
  const b = await newItem(dir, 'Kid', ['--parent', a]);
  const kidDir = path.dirname(await recordPath(dir, b));
  fs.renameSync(kidDir, path.join(dir, '.work-items', path.basename(kidDir)));
  await tk(dir, ['work', 'list']);
  const row = (await history(dir, a)).find((h) => h.change === `Sub-item ${b} moved out by hand.`);
  assert.equal(row.effect, `${b} is a top-level item now.`);

  const c = await newItem(dir, 'Other parent');
  const k2 = await newItem(dir, 'Second kid', ['--parent', c]);
  await tk(dir, ['work', 'move', k2, '--under', 'root']);
  const row2 = (await history(dir, c)).find((h) => h.change === `Sub-item ${k2} moved out with toolkit work move.`);
  assert.equal(row2.effect, `${k2} is a top-level item now.`);
});

test('cancel removes the template guide comments, and the Blockers warning has one period', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Dropped', ['--type', 'task']);
  assert.match(await readRecord(dir, id), /<!--/);
  await tk(dir, ['work', 'cancel', id, '--reason', 'Not needed', '--by', 'Mike']);
  assert.doesNotMatch(parseDoc(await readRecord(dir, id)).body, /<!--/, 'no template guide is left in a cancelled item');

  const rec = parseDoc(await readRecord(dir, id));
  const stale = rec.body.replace(/\*\*Blockers:\*\* None\./, '**Blockers:** Something stale.');
  const v = validateRecord({ meta: rec.meta, body: stale });
  const w = v.warnings.find((x) => x.code === 'terminal_blockers');
  assert.equal(w.message, 'WI-001 is Cancelled, but Blockers in its Overview still says: Something stale. Set it to None: toolkit work edit WI-001 --label Blockers --value \'None.\'');
});

test('a retitle keeps the old title and the folder rename in the history', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Add a version flag', ['--type', 'task']);
  const r = await tk(dir, ['work', 'set', id, '--title', 'Build the basic CLI']);
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /Updated WI-001: title "Build the basic CLI" \(was "Add a version flag"\)\./);
  const h = await history(dir, id);
  assert.equal(h.find((x) => x.change.startsWith('Set title')).change, 'Set title "Build the basic CLI" (was "Add a version flag").');
  const moved = h.find((x) => x.change.startsWith('Folder renamed for the new title'));
  assert.match(moved.change, /^Folder renamed for the new title: \.work-items\/WI-001-add-a-version-flag\/ -> \.work-items\/WI-001-build-the-basic-cli\/\.$/);
  assert.equal(h.filter((x) => /by hand/.test(x.change)).length, 0, 'the toolkit\'s own rename is not a hand move');
});

test('a design choice asked without "approve" or "pick" is the design decision; a question about option names is not', () => {
  const q = (question) => ({ id: 'Q-01', question, affects: '', status: 'Open', from: 'owner' });
  assert.equal(isDesignQuestion(q('Which approach should we take: the plain file or the database?')), true);
  assert.equal(isDesignQuestion(q('Which option fits best: A or B?')), true);
  assert.equal(isDesignQuestion(q('Which option names should the flag accept?')), false);
  assert.equal(isDesignQuestion(q('Should the design compare two approaches?')), false);
  assert.equal(isDeliveryQuestion(q('Would you like agents to take responsibility for delivering this?')), true);
  assert.equal(isDeliveryQuestion(q('When should it be delivered?')), false);
});

test('design header lines split by blank lines are joined with hard breaks when the design is saved', async () => {
  assert.equal(separateLabelLines('**Requirements:** WI-001\n\n**Design status:** Draft\n\n**Design approval:** Pending\n\n## Options\n\n**Last updated:** x\n\n**Design status:** y', { design: true }),
    '**Requirements:** WI-001  \n**Design status:** Draft  \n**Design approval:** Pending\n\n## Options\n\n**Last updated:** x\n\n**Design status:** y');
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  await tk(dir, ['work', 'design', id, '--create']);
  await tk(dir, ['work', 'design', id, '--text', `# ${id}: Brief — solution design\n\n**Requirements:** ${id}\n\n**Design status:** Proposed\n\n**Design approval:** Pending\n\n## Design options\n\n### Option A — One\n\nText.\n`]);
  const file = path.join(path.dirname(await recordPath(dir, id)), 'DESIGN.md');
  assert.match(fs.readFileSync(file, 'utf8'), /\*\*Requirements:\*\* WI-001  \n\*\*Design status:\*\* Proposed  \n\*\*Design approval:\*\* Pending\n/);
});

test('approve --requirements marks the question that asked for it Answered', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Greet', ['--type', 'task']);
  await tk(dir, ['work', 'edit', id, '--section', 'Agreed goal', '--text', 'A greeting command.']);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-01 | Do you approve requirements R-01 to R-02? | R-01, R-02 | Open | owner']);
  await tk(dir, ['work', 'set', id, '--waiting-on', 'owner']);
  const r = await tk(dir, ['work', 'approve', id, '--requirements', '--by', 'Mike']);
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /Marked Q-01 Answered: it asked for this approval\./);
  assert.match(r.stdout, /It is no longer waiting on the owner/);
  const doc = parseDoc(await readRecord(dir, id));
  assert.deepEqual(parseQuestions(doc.body).map((q) => [q.id, q.status]), [['Q-01', 'Answered']]);
  assert.match((await history(dir, id))[0].effect, /No longer waiting on the owner\. Q-01 answered by this approval\. Continue with/);
});

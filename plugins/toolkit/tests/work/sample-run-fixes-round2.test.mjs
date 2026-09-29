// Work engine fixes from the round 2 sample runs (dev/test-runs/a-d): history
// rows for the owner's hand moves, sub-items that inherit an approved design,
// warnings for skipped stages, one history row per decision, the plan checks
// in validate, closing lines at finish, --text and --remove-guide, one line per
// design decision, and a failed hand-change check that no longer stops a read.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, readRecord, recordPath, trackerDir, approveRequirements, TODAY, fillSelectedDesign, recordCheck } from './helpers.mjs';
import { parseDoc, parseHistory, getSectionText, getSectionWhole, getLabel } from '../../lib/work/model.mjs';
import { checkHandChanges } from '../../lib/commands/work.mjs';
import { collectOwnerDecisions, collectAgentTodos } from '../../lib/work/decisions.mjs';

after(cleanup);

const W = (dir, ...p) => path.join(trackerDir(dir), ...p);
const history = async (dir, id) => parseHistory(parseDoc(await readRecord(dir, id)).body);

const REQS = '#### R-01 — Greets by name\n\n**Status:** Finalized  \n**Applies to:** Everyone.  \n**Required behavior:** Prints Hello.  \n**Boundaries and exceptions:** None identified.  \n**Acceptance check:** greet prints Hello.  \n**Decision record:** Mike.  \n**Open questions:** None.\n\n#### R-02 — Shouts\n\n**Status:** Finalized  \n**Applies to:** Everyone.  \n**Required behavior:** --shout prints in capitals.  \n**Boundaries and exceptions:** None identified.  \n**Acceptance check:** greet --shout prints HELLO.  \n**Decision record:** Mike.  \n**Open questions:** None.';

const PLAN_TABLE = 'A phase is complete when its tasks are complete and its exit result has been checked.\n\n| Phase | Outcome | Status | Exit result | Sub-items |\n|---|---|---|---|---|\n| P1 — Greeting | It greets | In Progress | greet prints Hello | None. |';
const TASKS = '### P1 — Greeting\n\n- [ ] **P1-T01 — Write greet** · In Progress  \n  **Work:** Write it.  \n  **Deliverable:** greet.js.  \n  **Done when:** The test passes.  \n  **Depends on:** None.';

test('a folder the owner moved or renamed by hand gets a history row, once, on the item and on the parents it left and joined', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Greet CLI');
  const b = await newItem(dir, 'Version flag', ['--parent', a]);
  const c = await newItem(dir, 'Other');
  // Round 2, run a: the parent folder went into a group and the sub-item folder was renamed.
  fs.mkdirSync(W(dir, 'cli'));
  fs.renameSync(W(dir, 'WI-001-greet-cli'), W(dir, 'cli', 'WI-001-greet-cli'));
  fs.renameSync(W(dir, 'cli', 'WI-001-greet-cli', 'WI-002-version-flag'), W(dir, 'cli', 'WI-001-greet-cli', 'version-flag'));
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.code, 0, r.stderr);
  const ha = await history(dir, a);
  assert.match(ha[0].change, /^Moved by hand: \.work-items\/WI-001-greet-cli\/WORK-ITEM\.md -> \.work-items\/cli\/WI-001-greet-cli\/WORK-ITEM\.md\.$/);
  assert.match(ha[0].effect, /It is still a top-level item\. Group: cli\./);
  const hb = await history(dir, b);
  assert.match(hb[0].change, /^Folder renamed by hand: .*WI-002-version-flag\/WORK-ITEM\.md -> .*cli\/WI-001-greet-cli\/version-flag\/WORK-ITEM\.md\.$/);
  assert.match(hb[0].effect, /It moved along with its parent WI-001's folder and is still its sub-item\./);
  // Written once: the next command finds nothing new.
  await tk(dir, ['work', 'list']);
  assert.equal((await history(dir, a)).filter((h) => /by hand/.test(h.change)).length, 1);
  assert.equal((await history(dir, b)).filter((h) => /by hand/.test(h.change)).length, 1);

  // A sub-item moved under another item by hand: both parents say so.
  fs.renameSync(W(dir, 'cli', 'WI-001-greet-cli', 'version-flag'), W(dir, 'WI-003-other', 'version-flag'));
  const r2 = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r2.json.changes.moves.find((m) => m.id === b).parentAfter, c);
  assert.equal((await history(dir, a))[0].change, `Sub-item ${b} moved out by hand.`);
  assert.equal((await history(dir, a))[0].effect, `${b}'s parent is now ${c}.`);
  assert.equal((await history(dir, c))[0].change, `Sub-item ${b} moved here by hand (it was under ${a}).`);
  assert.match((await history(dir, b))[0].effect, new RegExp(`Its parent is now ${c}\\.`));
});

test('toolkit work move adds a history row to the parent the item left and the one it joined', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Parent A');
  const b = await newItem(dir, 'Parent B');
  const kid = await newItem(dir, 'Kid', ['--parent', a]);
  const m = await tk(dir, ['work', 'move', kid, '--under', b]);
  assert.equal(m.code, 0, m.stderr);
  assert.equal((await history(dir, a))[0].change, `Sub-item ${kid} moved out with toolkit work move.`);
  assert.equal((await history(dir, b))[0].change, `Sub-item ${kid} moved here with toolkit work move (it was under ${a}).`);
  assert.match((await history(dir, kid))[0].change, /^Moved under WI-002 with toolkit work move\.$/);
});

test('a sub-item made with --covers under a parent whose design is approved starts at planning, with no guide and a quoted approval', async () => {
  const dir = makeProject();
  const parent = await newItem(dir, 'Greet CLI', ['--type', 'build']);
  assert.equal((await tk(dir, ['work', 'edit', parent, '--section', 'Active requirements', '--text', REQS])).code, 0);
  await approveRequirements(dir, parent);
  const plain = await tk(dir, ['work', 'new', '--title', 'Shout flag', '--type', 'build', '--parent', parent, '--covers', 'R-02', '--json']);
  assert.equal(plain.code, 0, plain.stderr);
  let text = await readRecord(dir, plain.json.id);
  assert.doesNotMatch(text, /Fill-in guide/, 'a --covers sub-item starts filled in, so the guide goes');
  assert.match(text, /^requirements_approved: "2026-09-26 by Mike"$/m, 'the same quoted form toolkit work approve writes');
  assert.equal(parseDoc(text).meta.stage, '03-requirements-approved', 'no approved parent design: it goes to design');
  const v = await tk(dir, ['work', 'validate', plain.json.id, '--json']);
  assert.ok(!JSON.stringify(v.json).includes('guide_left'));

  await tk(dir, ['work', 'design', parent, '--create']);
  await fillSelectedDesign(dir, parent);
  await tk(dir, ['work', 'approve', parent, '--design', '--by', 'Mike']);
  const kid = await tk(dir, ['work', 'new', '--title', 'Version flag', '--type', 'build', '--parent', parent, '--covers', 'R-01']);
  assert.equal(kid.code, 0, kid.stderr);
  assert.match(kid.stdout, /WI-001's approved design covers it, so it starts at planning/);
  assert.match(kid.stdout, /Continue with work-on\./);
  const id = 'WI-003';
  text = await readRecord(dir, id);
  assert.equal(parseDoc(text).meta.stage, '06-implementation-plan');
  assert.match(parseHistory(parseDoc(text).body)[0].effect, /WI-001's approved design covers it/);
  const show = await tk(dir, ['work', 'show', id]);
  assert.match(show.stdout, /Design: none of its own; WI-001's design is approved \(.*DESIGN\.md\)\. Read it with: toolkit work design WI-001/);
  const json = await tk(dir, ['work', 'show', id, '--json']);
  assert.equal(json.json.design.inheritedFrom, 'WI-001');
});

test('work set warns when a stage change skips the requirements approval or the design, and removes the item guide from stage 03', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'README brief', ['--type', 'repository-maintenance']);
  const reqs = '#### R-01 — Brief\n\n**Status:** Refining  \n**Applies to:** Readers.  \n**Required behavior:** A brief.  \n**Boundaries and exceptions:** None identified.  \n**Acceptance check:** It is there.  \n**Decision record:** Mike.  \n**Open questions:** None.';
  await tk(dir, ['work', 'edit', id, '--section', 'Active requirements', '--text', reqs]);
  const r = await tk(dir, ['work', 'set', id, '--stage', '09-testing', '--json']);
  assert.equal(r.code, 0, 'a warning never refuses the change');
  assert.equal(r.json.warnings.length, 2);
  assert.match(r.json.warnings[0], /moves past 03 while R-01 is still Refining/);
  assert.match(r.json.warnings[1], /moves past 04 Solution design with no design and no history note/);
  const text = await tk(dir, ['work', 'set', id, '--stage', '10-bug-fixing']);
  assert.doesNotMatch(text.stdout, /Note:/, 'no warning for a step forward past both');
  assert.doesNotMatch(await readRecord(dir, id), /Fill-in guide/);

  const other = await newItem(dir, 'Tidy', ['--type', 'task']);
  const reasoned = await tk(dir, ['work', 'set', other, '--stage', '06', '--note', 'Design skipped: one obvious way.', '--json']);
  // The note answers the design warning. An item with no requirement written
  // at all is still warned about, whatever its type and note (sample run c,
  // round 3: a task went from 01 to 07 with no R-01 and no question asked).
  assert.equal(reasoned.json.warnings.length, 1, reasoned.json.warnings.join('\n'));
  assert.match(reasoned.json.warnings[0], /moves from 01 Discovery to 06 Implementation plan with no requirement written \(no R-01\)/);
  const withReq = await newItem(dir, 'Tidy two', ['--type', 'task']);
  await tk(dir, ['work', 'edit', withReq, '--section', 'Active requirements', '--text', reqs.replace('Refining', 'Finalized')]);
  const quiet = await tk(dir, ['work', 'set', withReq, '--stage', '06', '--note', 'Design skipped: one obvious way.', '--json']);
  assert.deepEqual(quiet.json.warnings, [], 'a written requirement and a reason given with --note');
});

test('a waiting_on change alone stays in the header: it adds no history row and never joins a row another command wrote', async () => {
  // Sample runs b and d, round 3: "Design updated (status approved). | The
  // design can be built. Now waiting on the owner." mixed two changes.
  const dir = makeProject();
  const id = await newItem(dir, 'Greeting', ['--type', 'task']);
  await tk(dir, ['work', 'history', id, '--note', "Owner's words: \"Approved.\"", '--effect', 'Requirements approved.']);
  const r = await tk(dir, ['work', 'set', id, '--waiting-on', 'agent']);
  assert.equal(r.code, 0, r.stderr);
  let h = await history(dir, id);
  assert.equal(h[0].change, "Owner's words: \"Approved.\"");
  assert.equal(h[0].effect, 'Requirements approved.', 'the row another command wrote is left as it is');
  assert.equal(h.length, 2);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.waiting_on, 'agent', 'the header has the new value');
  await tk(dir, ['work', 'set', id, '--waiting-on', 'owner']);
  h = await history(dir, id);
  assert.equal(h.length, 2);
  // With --note the change gets a row of its own.
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-01 | Which colour? | R-01 | Open | owner']);
  await tk(dir, ['work', 'set', id, '--waiting-on', 'none', '--note', 'Mike is away until Monday; the agent goes on with P2.']);
  h = await history(dir, id);
  assert.equal(h.length, 3);
  assert.equal(h[0].change, 'Set waiting on none.');
  assert.equal(h[0].effect, 'Mike is away until Monday; the agent goes on with P2.');
  // A stage change that also sets waiting on the owner names the open question.
  await tk(dir, ['work', 'set', id, '--stage', '02', '--waiting-on', 'owner']);
  h = await history(dir, id);
  assert.match(h[0].effect, /Waits for the owner's answer to Q-01 \(work-decide\)/);
});

test('a history note with no --effect says where the item goes next', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Greeting', ['--type', 'build']);
  await tk(dir, ['work', 'history', id, '--note', "Owner's words: \"Approved.\""]);
  assert.equal((await history(dir, id))[0].effect, 'Continue with work-requirements.');
});

test('validate checks the plan from stage 07: a phase table, checkbox tasks, no template examples, known phase words, and question ids', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Greet', ['--type', 'task', '--stage', '08']);
  const codes = async () => {
    const v = await tk(dir, ['work', 'validate', id, '--json']);
    return v.json.results[0].warnings.map((w) => w.code);
  };
  // The template's examples are still there (sample run c, round 2).
  let got = await codes();
  for (const c of ['roadmap_placeholder', 'tasks_placeholder', 'section_guide_left']) assert.ok(got.includes(c), `${c} in ${got}`);
  // Headings instead of the table and the checkbox list (sample run a, round 2).
  await tk(dir, ['work', 'edit', id, '--section', 'Roadmap', '--text', '### P1 — Greeting\n\n**Status:** Planned.']);
  await tk(dir, ['work', 'edit', id, '--section', 'Tasks', '--text', '### P1-T01\n\n**Status:** Planned.']);
  got = await codes();
  assert.ok(got.includes('no_roadmap_table') && got.includes('no_task_lines'), got.join(', '));
  // The template's form, with a phase word that is not one of the three.
  await tk(dir, ['work', 'edit', id, '--section', 'Roadmap', '--text', PLAN_TABLE.replace('In Progress', 'Planned')]);
  await tk(dir, ['work', 'edit', id, '--section', 'Tasks', '--text', TASKS]);
  got = await codes();
  assert.deepEqual(got.filter((c) => /roadmap|task|section_guide/.test(c)), ['roadmap_status']);
  await tk(dir, ['work', 'edit', id, '--section', 'Roadmap', '--text', PLAN_TABLE]);
  // A row in Open Questions that is not a question (sample run b, round 2).
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', '| None | No owner decision is open. | Agent verification | agent |']);
  got = await codes();
  assert.ok(got.includes('bad_question_id'), got.join(', '));
  // An item before stage 07 is not asked for a plan yet.
  const early = await newItem(dir, 'Early', ['--type', 'task', '--stage', '06']);
  const e = await tk(dir, ['work', 'validate', early, '--json']);
  assert.ok(!e.json.results[0].warnings.some((w) => /roadmap_placeholder|tasks_placeholder|no_task_lines/.test(w.code)));
});

test('finish closes Resume here and reports skipped stages and open phases; cancel closes Resume here too', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Greet', ['--type', 'task', '--stage', '11']);
  await tk(dir, ['work', 'edit', id, '--section', 'Roadmap', '--text', PLAN_TABLE]);
  await recordCheck(dir, id);
  await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike']);
  const fin = await tk(dir, ['work', 'finish', id, '--by', 'Mike', '--evidence', 'Tests pass.', '--json']);
  assert.equal(fin.code, 0, fin.stderr);
  assert.equal(fin.json.warnings.length, 2);
  assert.match(fin.json.warnings[0], /finished from 11 User approval, so stages 12 to 14 .* left no record/);
  assert.match(fin.json.warnings[1], /The Roadmap still shows P1 as In Progress/);
  const doc = parseDoc(await readRecord(dir, id));
  assert.equal(getSectionText(doc.body, 'Resume here').trim(), `Finished on ${TODAY}. Nothing to resume.`);
  const v = await tk(dir, ['work', 'validate', id, '--json']);
  assert.ok(v.json.results[0].warnings.some((w) => w.code === 'roadmap_open_after_done'));
  const show = await tk(dir, ['work', 'show', id]);
  assert.match(show.stdout, /^Stage: Done \| /m, 'a Done item shows Done, not its last stage');

  const noted = await newItem(dir, 'Noted', ['--type', 'task', '--stage', '11']);
  await tk(dir, ['work', 'history', noted, '--note', 'No remote: merged locally into main.']);
  await recordCheck(dir, noted);
  const fin2 = await tk(dir, ['work', 'finish', noted, '--by', 'Mike', '--evidence', 'Works.', '--quote', 'Ship it.', '--json']);
  assert.deepEqual(fin2.json.warnings, [], 'the history note says what happened instead');

  const gone = await newItem(dir, 'Dropped', ['--type', 'task']);
  await tk(dir, ['work', 'cancel', gone, '--reason', 'Not needed.']);
  assert.equal(getSectionText(parseDoc(await readRecord(dir, gone)).body, 'Resume here').trim(), `Cancelled on ${TODAY}. Nothing to resume.`);
});

test('edit --text and design --text need no file; edit --remove-guide removes the item guide', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Greet', ['--type', 'task']);
  const r = await tk(dir, ['work', 'edit', id, '--section', 'Agreed goal', '--text', '- Greets people.\n- By name.']);
  assert.equal(r.code, 0, r.stderr);
  assert.equal(getSectionText(parseDoc(await readRecord(dir, id)).body, 'Agreed goal').trim(), '- Greets people.\n- By name.');
  const both = await tk(dir, ['work', 'edit', id, '--section', 'Agreed goal', '--text', 'x', '--set-file', '-']);
  assert.equal(both.code, 2);
  assert.match(await readRecord(dir, id), /Fill-in guide/);
  const g = await tk(dir, ['work', 'edit', id, '--remove-guide']);
  assert.equal(g.code, 0, g.stderr);
  assert.match(g.stdout, /Removed the template's fill-in guide from WI-001\./);
  assert.doesNotMatch(await readRecord(dir, id), /Fill-in guide/);
  assert.match((await tk(dir, ['work', 'edit', id, '--remove-guide'])).stdout, /has no fill-in guide; nothing changed/);
  // The guide_left warning names a command that works.
  const other = await newItem(dir, 'Other', ['--type', 'task', '--stage', '06']);
  const v = await tk(dir, ['work', 'validate', other, '--json']);
  assert.match(v.json.results[0].warnings.find((w) => w.code === 'guide_left').message, /toolkit work edit WI-002 --remove-guide/);

  await tk(dir, ['work', 'design', id, '--create']);
  const d = await tk(dir, ['work', 'design', id, '--text', '# WI-001: Greet — solution design\n\n## What this design solves\n\nGreeting.\n', '--status', 'proposed']);
  assert.equal(d.code, 0, d.stderr);
  assert.match((await tk(dir, ['work', 'design', id])).stdout, /Greeting\./);
});

test('an open question that asks for the design choice is one decision with the proposed design; the delivery offer is the top item\'s', () => {
  const body = (rows) => `## Open Questions\n\n| ID | Question | Affects | Status | Decision needed from |\n|---|---|---|---|---|\n${rows.join('\n')}\n`;
  const items = [{
    id: 'WI-002',
    meta: { id: 'WI-002', title: 'Greet', stage: '04-solution-design', status: 'In Progress', waiting_on: 'owner', design: 'proposed', type: 'build', requirements_approved: '2026-09-26 by Mike' },
    body: body([
      '| Q-02 | Which version source do you approve for WI-002: Option A or Option B? | R-02 | Open | owner |',
      '| Q-03 | Should --version print the date too? | R-02 | Open | owner |',
    ]),
  }];
  const d = collectOwnerDecisions(items);
  assert.deepEqual(d.map((x) => x.kind), ['open_question', 'design_proposed'], 'Q-02 is folded into the design line; Q-03 stays');
  assert.match(d[1].detail, /Q-02 asks it: Which version source/);

  const todos = collectAgentTodos([
    { id: 'WI-001', meta: { id: 'WI-001', stage: '05-breakdown', status: 'In Progress', delivery: 'not-offered', type: 'build', parent: 'none' }, children: ['WI-002'], body: '' },
    { id: 'WI-002', meta: { id: 'WI-002', stage: '03-requirements-approved', status: 'Ready', delivery: 'not-offered', type: 'build', parent: 'WI-001' }, children: [], body: '' },
  ]);
  assert.deepEqual(todos.map((t) => t.id), ['WI-001'], 'the offer is made once per goal, at the top item');
});

test('a failed check for hand changes is a warning, and the command still runs', async () => {
  const failing = { sync: async () => { throw new Error('Saved but not verified: the text of TSRC-002 in Notion does not match what was written.'); } };
  const changes = await checkHandChanges(failing);
  assert.equal(changes.problems.length, 1);
  assert.equal(changes.problems[0].severity, 'warning');
  assert.match(changes.problems[0].message, /did not finish \(Saved but not verified: .*\)\. This command ran anyway/);
  const ok = await checkHandChanges({ sync: async () => ({ moves: [], problems: [] }) });
  assert.deepEqual(ok, { moves: [], problems: [] });
});

test('toolkit work show and validate still work in a project where a Recent History row holds an escaped pipe', async () => {
  // A row with an escaped pipe survives later writes.
  const dir = makeProject();
  const id = await newItem(dir, 'Pipes', ['--type', 'task']);
  await tk(dir, ['work', 'history', id, '--note', 'Chose a | b.', '--effect', 'Uses a | b.']);
  await tk(dir, ['work', 'set', id, '--waiting-on', 'owner']);
  const h = await history(dir, id);
  assert.equal(h[0].change, 'Chose a | b.');
  assert.equal(h[0].effect, 'Uses a | b.');
  assert.equal((await tk(dir, ['work', 'validate', id])).code, 0);
  assert.ok(getSectionWhole(parseDoc(await readRecord(dir, id)).body, 'Recent History').includes('a \\| b'));
  assert.equal(getLabel(parseDoc(await readRecord(dir, id)).body, 'Goal', { section: 'Overview' }).startsWith('<'), true);
  assert.ok(fs.existsSync(await recordPath(dir, id)));
});

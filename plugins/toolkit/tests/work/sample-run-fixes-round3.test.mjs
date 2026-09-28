// Work engine fixes from the round 3 sample runs (dev/test-runs/open-bugs.md):
// design approval that survives header lines with no line breaks, one
// decision counted once (result approvals, the delivery offer, draft
// designs), finished items with a closed Overview and nothing to continue
// with, validate's counts, history rows that do not mix two changes, a new
// title in the folder and the design, edit warnings, owner-ready move lines,
// branch names with the item's own prefix, parent and sub-item links in the
// text, and memory proposals in the decision list.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, readRecord, recordPath, trackerDir, approveRequirements } from './helpers.mjs';
import {
  parseDoc, parseHistory, getLabel, getSectionText, parseQuestions, parseRoadmap, getH1, separateLabelLines, inlineLabelSpan,
  designStatusLine, designStatusFromBody, setDesignStatusLine, ensureDesignStatusLine, designHasOptions, setQuestionStatus,
  linkRelatedItem, unlinkRelatedItem, addRoadmapSubItem, removeRoadmapSubItem, validateRecord, approvedDesignGaps, taskFieldsJoined,
} from '../../lib/work/model.mjs';
import { isDesignQuestion, isResultQuestion, deliveryAsked, collectOwnerDecisions, collectAgentTodos } from '../../lib/work/decisions.mjs';
import { itemIdFromBranch } from '../../lib/work/state.mjs';
import { moveOwnerLine } from '../../lib/work/report.mjs';
import { readTemplate } from '../../lib/core/templates.mjs';

after(cleanup);

const DESIGN_TEMPLATE = readTemplate('design');
const history = async (dir, id) => parseHistory(parseDoc(await readRecord(dir, id)).body);
const designFile = async (dir, id) => path.join(path.dirname(await recordPath(dir, id)), 'DESIGN.md');

// The header the agent wrote in sample run c, round 3: one label per line, no Markdown line breaks.
const JOINED_HEADER = (id) => `# ${id}: Brief — solution design\n\n**Requirements:** ${id}\n**Design status:** Proposed\n**Requirements checked:** ${id} Requirements, 2026-09-27\n**Last updated:** 2026-09-27\n**Design approval:** Pending\n\n## What this design solves\n\nA short brief.\n\n## Design options\n\n### Option A — One short brief\n\nThree bullets at the top of README.md.\n`;

// ------------------------------------------------------------------ model helpers

test('a bold label is found anywhere in a line, and the status line can be set when Notion joined the header', () => {
  const joined = '**Requirements:** TV2-001 **Design status:** Proposed **Requirements checked:** TV2-001, 2026-09-27 **Design approval:** Pending';
  assert.deepEqual(designStatusLine(joined), { label: 'Design status:', value: 'Proposed' });
  assert.equal(designStatusFromBody(joined), 'proposed');
  const approved = setDesignStatusLine(joined, 'approved', { approved: '2026-09-27 by Mike Rihm' });
  assert.equal(approved, '**Requirements:** TV2-001 **Design status:** Approved **Requirements checked:** TV2-001, 2026-09-27 **Design approval:** Approved by Mike Rihm on 2026-09-27');
  assert.equal(designStatusFromBody(approved), 'approved');
  assert.equal(inlineLabelSpan('`**Design status:** x`', 'Design status'), null, 'a label inside a code span is not a label');
  assert.equal(inlineLabelSpan('| **Design status:** | x |', 'Design status'), null, 'nor one in a table row');
  assert.equal(designStatusLine('Status: proposed').label, 'Status:', 'the older "Status:" line still counts');
});

test('separateLabelLines puts each template label on its own line with a hard break, and leaves other text alone', () => {
  assert.equal(separateLabelLines('**Requirements:** TV2-001 **Design status:** Proposed **Last updated:** 2026-09-27'),
    '**Requirements:** TV2-001  \n**Design status:** Proposed  \n**Last updated:** 2026-09-27');
  assert.equal(separateLabelLines('**Requirements:** TV2-001\n**Design status:** Proposed\n\nText.'),
    '**Requirements:** TV2-001  \n**Design status:** Proposed\n\nText.');
  // A task's fields go under the task, indented.
  assert.equal(separateLabelLines('- [x] **P1-T01 — Write** · Done **Work:** Edit. **Deliverable:** README.md. **Depends on:** None.'),
    '- [x] **P1-T01 — Write** · Done  \n  **Work:** Edit.  \n  **Deliverable:** README.md.  \n  **Depends on:** None.');
  const plain = 'Keep **bold:** words in prose.\n\n```\n**Work:** in code **Deliverable:** stays\n```\n| **Work:** | cell |';
  assert.equal(separateLabelLines(plain), plain);
  const already = '**Status:** Finalized  \n**Applies to:** Everyone.';
  assert.equal(separateLabelLines(already), already, 'text already in the template form is unchanged');
});

test('ensureDesignStatusLine adds the status line under Requirements when a design has none', () => {
  const body = '# WI-001: X — solution design\n\n**Requirements:** WI-001  \n**Last updated:** 2026-09-27\n\n## What this design solves\n';
  const out = ensureDesignStatusLine(body, 'approved');
  assert.match(out, /\*\*Requirements:\*\* WI-001  \n\*\*Design status:\*\* Approved  \n\*\*Last updated:\*\*/);
  assert.equal(designStatusFromBody(out), 'approved');
  assert.equal(ensureDesignStatusLine(out, 'proposed'), out, 'a design with a status line is unchanged');
  assert.equal(designStatusFromBody(ensureDesignStatusLine('# WI-001: X — solution design\n\nText.\n', 'proposed')), 'proposed');
});

test('designHasOptions: a template design or one that says only "Pending" is a draft; a named option or a written selected design is not', () => {
  const tpl = parseDoc(DESIGN_TEMPLATE).body;
  assert.equal(designHasOptions(tpl), false);
  assert.equal(designHasOptions('## Design options\n\nPending Mike\'s answer to Q-03.\n\n## Selected design\n\nPending owner decision.\n'), false);
  assert.equal(designHasOptions(tpl.replace('### Option A — <Short name>', '### Option A — One greeting file')), true);
  assert.equal(designHasOptions('## Selected design\n\nOne file, greet.js, prints the greeting.\n'), true);
});

test('which open questions are the design choice, the result approval, or the delivery offer', () => {
  const q = (question, affects = '') => ({ id: 'Q-01', question, affects, status: 'Open', from: 'owner' });
  assert.equal(isDesignQuestion(q('Which version source do you approve: Option A or B?')), true);
  assert.equal(isDesignQuestion(q('Do you approve the design?')), true);
  assert.equal(isDesignQuestion(q('Should the design show one plain Node.js approach or compare multiple approaches?', 'Design options')), false);
  assert.equal(isDesignQuestion(q('May one team of three helpers write the design?', 'Design team')), false);
  assert.equal(isResultQuestion(q('Do you approve the TV2-001 three-bullet parent result at 6216321?')), true);
  assert.equal(isResultQuestion(q('Do you approve the requirements R-01 to R-03?')), false);
  const body = (question, affects = 'R-01') => `## Open Questions\n\n| ID | Question | Affects | Status | Decision needed from |\n|---|---|---|---|---|\n| Q-02 | ${question} | ${affects} | Open | owner |\n`;
  assert.equal(deliveryAsked(body('Would you like agents to take responsibility for delivering this?')), true);
  assert.equal(deliveryAsked(body('Who runs the build?', 'delivery')), true);
  assert.equal(deliveryAsked(body('Which colour?')), false);
});

test('setQuestionStatus, and the parent and sub-item links in Related items and the Roadmap', () => {
  const qs = '## Open Questions\n\n| ID | Question | Affects | Status | Decision needed from |\n|---|---|---|---|---|\n| Q-01 | A? | R-01 | Open | owner |\n| Q-02 | B? | R-01 | Open | owner |\n';
  const closed = setQuestionStatus(qs, ['Q-02'], 'Answered');
  assert.deepEqual(parseQuestions(closed).map((x) => [x.id, x.status]), [['Q-01', 'Open'], ['Q-02', 'Answered']]);

  const ov = '## Overview\n\n**Goal:** G.\n\n**Related items:** <Roadmap unit, parent and related work item IDs (never folder paths), design, or external links.>\n';
  const withParent = linkRelatedItem(ov, 'parent', 'WI-001');
  assert.equal(getLabel(withParent, 'Related items', { section: 'Overview' }), 'Parent WI-001.');
  const moved = linkRelatedItem(withParent, 'parent', 'WI-003');
  assert.equal(getLabel(moved, 'Related items', { section: 'Overview' }), 'Parent WI-003.');
  assert.equal(getLabel(unlinkRelatedItem(moved, 'parent', 'WI-003'), 'Related items', { section: 'Overview' }), 'None.');
  const kids = linkRelatedItem(linkRelatedItem(ov, 'sub-item', 'WI-002'), 'sub-item', 'WI-004');
  assert.equal(getLabel(kids, 'Related items', { section: 'Overview' }), 'Sub-items: WI-002, WI-004.');
  assert.equal(getLabel(unlinkRelatedItem(kids, 'sub-item', 'WI-002'), 'Related items', { section: 'Overview' }), 'Sub-items: WI-004.');
  const own = linkRelatedItem(ov.replace(/<Roadmap unit[^>]*>/, 'See WI-009.'), 'sub-item', 'WI-002');
  assert.equal(getLabel(own, 'Related items', { section: 'Overview' }), 'See WI-009. Sub-items: WI-002.', 'the owner\'s text is kept');

  const rm = '## Roadmap\n\n| Phase | Outcome | Status | Exit result | Sub-items |\n|---|---|---|---|---|\n| P1 — Greeting | It greets | Done | ok | None. |\n| P2 — Flags | Flags | In Progress | ok | None. |\n';
  const added = addRoadmapSubItem(rm, 'WI-002');
  assert.deepEqual(parseRoadmap(added).map((r) => r.subItems), [[], ['WI-002']], 'the phase in progress gets it');
  assert.equal(addRoadmapSubItem(added, 'WI-002'), added, 'once');
  assert.deepEqual(parseRoadmap(removeRoadmapSubItem(added, 'WI-002')).map((r) => r.subItems), [[], []]);
  const tpl = parseDoc(readTemplate('work-item')).body;
  assert.equal(addRoadmapSubItem(tpl, 'WI-002'), tpl, 'the template\'s example Roadmap is left alone');
});

test('validate warns about joined task fields, a finished item\'s Blockers, and a sub-item missing from a written Roadmap', () => {
  const tpl = parseDoc(readTemplate('work-item')).body;
  assert.deepEqual(taskFieldsJoined(tpl), []);
  const joined = tpl.replace('- [ ] **P1-T01 — <Task 1 name>** · In Progress  \n  **Work:**', '- [ ] **P1-T01 — Write** · In Progress **Work:**');
  assert.deepEqual(taskFieldsJoined(joined), ['P1-T01']);
  const meta = { id: 'WI-001', title: 'X', type: 'task', stage: '08-build', status: 'In Progress', parent: 'none', waiting_on: 'none', priority: 'medium', delivery: 'not-offered', requirements_approved: 'no', design: 'none', result_approved: 'no', updated: '2026-09-27' };
  const body = `# WI-001: X\n\n${joined}`;
  assert.ok(validateRecord({ meta, body }).warnings.some((w) => w.code === 'task_fields_joined'));
  const done = { ...meta, status: 'Done', result_approved: '2026-09-27 by Mike' };
  const blocked = body.replace('**Blockers:** <Blocking decision or dependency, or “None.”>', '**Blockers:** Local merge to main needs Mike\'s approval.');
  assert.ok(validateRecord({ meta: done, body: blocked }).warnings.some((w) => w.code === 'terminal_blockers'));
  const planned = body.replace('| P1 — <Phase 1 name> | <What this phase establishes> | In Progress | <Evidence that P1 is complete> | <WI-ids or “None.”> |', '| P1 — Greeting | It greets | In Progress | ok | None. |')
    .replace(/\| P2 — <Phase 2 name>[^\n]*\n/, '');
  const v = validateRecord({ meta, body: planned }, { children: ['WI-002'] });
  assert.ok(v.warnings.some((w) => w.code === 'subitem_not_in_roadmap' && /WI-002/.test(w.message)), JSON.stringify(v.warnings));
});

test('an approved design that lacks template sections or still holds prompts is warned about', () => {
  const tpl = parseDoc(DESIGN_TEMPLATE).body;
  const gaps = approvedDesignGaps('# WI-001: X — solution design\n\n## What this design solves\n\nA brief.\n\n## Selected design\n\nOne paragraph.\n\n## Build and verification plan\n\nThe selected option\'s Build order becomes the implementation plan after Mike chooses.\n', DESIGN_TEMPLATE);
  const codes = gaps.map((g) => g.code);
  assert.ok(codes.includes('design_section_missing'));
  assert.ok(gaps.find((g) => g.code === 'design_section_missing').message.includes('"## Diagrams"'));
  assert.ok(codes.includes('design_subsection_missing'));
  assert.ok(codes.includes('design_prompt_left'));
  assert.ok(!gaps.some((g) => g.message.includes('Option comparison')), 'Option comparison is optional');
  assert.ok(approvedDesignGaps(tpl, DESIGN_TEMPLATE).some((g) => g.code === 'design_prompt_left'), 'the template itself still holds prompts');
});

test('owner-ready move lines say what changed and what stayed the same', () => {
  assert.equal(moveOwnerLine({ id: 'WI-002', kind: 'file-renamed', from: '.work-items/WI-002-a/WORK-ITEM.md', to: '.work-items/WI-002-a/notes.md', parentBefore: 'WI-001', parentAfter: 'WI-001' }),
    'Renamed file: WI-002 is now .work-items/WI-002-a/notes.md (was WORK-ITEM.md), in the same folder. It is still a sub-item of WI-001.');
  assert.equal(moveOwnerLine({ id: 'TV2-002', kind: 'reparented', parentBefore: 'none', parentAfter: 'TV2-001' }),
    'Re-parented: TV2-002 was put under TV2-001 in Notion by hand. Its parent is now TV2-001. It was a top-level item.');
  assert.equal(moveOwnerLine({ id: 'TV2-002', kind: 'reparented', parentBefore: 'TV2-001', parentAfter: 'none' }),
    'Re-parented: TV2-002 was made a top-level item in Notion by hand. It was a sub-item of TV2-001.');
  assert.equal(moveOwnerLine({ id: 'WI-003', kind: 'moved', from: '.work-items/WI-003-x/WORK-ITEM.md', to: '.work-items/archive/WI-003-x/WORK-ITEM.md', parentBefore: 'none', parentAfter: 'none', archivedBefore: false, archivedAfter: true }),
    'Moved: WI-003 from WI-003-x to archive/WI-003-x (moved by hand). It is still a top-level item. It is archived now.');
});

test('a branch named with wi- still names the item in a project with another prefix', () => {
  assert.equal(itemIdFromBranch('claude/wi-001-readme-brief', 'TV2'), 'TV2-001');
  assert.equal(itemIdFromBranch('claude/tv2-002-add-quote', 'TV2'), 'TV2-002');
  assert.equal(itemIdFromBranch('claude/wi-001-readme-brief', 'WI'), 'WI-001');
  assert.equal(itemIdFromBranch('claude/readme-brief', 'TV2'), null);
});

// ------------------------------------------------------------------ commands, local tracker

test('approve --design works when the design\'s header lines have no line breaks, and the text alone never approves', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  await tk(dir, ['work', 'design', id, '--create']);
  const saved = await tk(dir, ['work', 'design', id, '--text', JOINED_HEADER(id).replace('Proposed', 'Approved')]);
  assert.equal(saved.code, 0, saved.stderr);
  assert.match(saved.stdout, /\(proposed\)/, 'a status written in the text is not an approval');
  let text = fs.readFileSync(await designFile(dir, id), 'utf8');
  assert.match(text, /\*\*Requirements:\*\* WI-001  \n\*\*Design status:\*\* Draft  \n/, 'each header label on its own line, and the status set back');
  const r = await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike Rihm', '--json']);
  assert.equal(r.code, 0, r.stdout + r.stderr);
  text = fs.readFileSync(await designFile(dir, id), 'utf8');
  const doc = parseDoc(text);
  assert.equal(doc.meta.status, 'approved');
  assert.equal(doc.meta.approved, '2026-09-26 by Mike Rihm');
  assert.equal(designStatusFromBody(doc.body), 'approved');
  assert.match(doc.body, /\*\*Design approval:\*\* Approved by Mike Rihm on 2026-09-26/);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.design, 'approved');
  const h = await history(dir, id);
  assert.equal(h[0].change, 'Design approved by Mike Rihm.');
  assert.equal(h.filter((x) => /Design updated \(status approved\)/.test(x.change)).length, 0);
});

test('a design question and a result question are one decision with the approval, and the approval marks them Answered', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  await tk(dir, ['work', 'design', id, '--create']);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-01 | Should the design compare two approaches? | Design options | Open | owner']);
  let r = await tk(dir, ['work', 'decisions', '--json']);
  assert.deepEqual(r.json.decisions.map((d) => d.kind), ['open_question'], 'a draft design: only the question, and it is not folded into a design approval');
  await tk(dir, ['work', 'design', id, '--text', JOINED_HEADER(id)]);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-02 | Which do you approve: Option A or Option B? | R-01 | Open | owner']);
  r = await tk(dir, ['work', 'decisions', '--json']);
  assert.deepEqual(r.json.decisions.map((d) => d.kind).sort(), ['design_proposed', 'open_question']);
  assert.match(r.json.decisions.find((d) => d.kind === 'design_proposed').detail, /Q-02 asks it/);
  const a = await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike', '--json']);
  assert.deepEqual(a.json.closedQuestions, ['Q-02']);
  const qs = parseQuestions(parseDoc(await readRecord(dir, id)).body);
  assert.deepEqual(qs.map((q) => [q.id, q.status]), [['Q-01', 'Open'], ['Q-02', 'Answered']]);

  // Stage 11: the question that asks for the result approval is the same decision (sample run c: 4 listed for 2).
  const b = await newItem(dir, 'Result', ['--type', 'task', '--stage', '11']);
  await tk(dir, ['work', 'edit', b, '--section', 'Open Questions', '--append-row', 'Q-01 | Do you approve the result at 6216321? | R-01 | Open | owner']);
  r = await tk(dir, ['work', 'decisions', '--json']);
  const mine = r.json.decisions.filter((d) => d.id === b);
  assert.deepEqual(mine.map((d) => d.kind), ['result_approval']);
  assert.match(mine[0].detail, /Q-01 asks it: Do you approve the result/);
  const text = await tk(dir, ['work', 'decisions']);
  assert.match(text.stdout, /^2 decisions wait on the owner:/m);
  const ok = await tk(dir, ['work', 'approve', b, '--result', '--by', 'Mike']);
  assert.match(ok.stdout, /Marked Q-01 Answered: it asked for this approval\./);
  r = await tk(dir, ['work', 'decisions', '--json']);
  assert.equal(r.json.decisions.filter((d) => d.id === b).length, 0);
});

test('the delivery offer is not listed as an agent to-do once an open question asks it', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Big one', ['--type', 'task', '--stage', '04']);
  await newItem(dir, 'Part', ['--parent', id]);
  let r = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(r.json.agentTodos.some((t) => t.id === id && t.kind === 'delivery_offer'));
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-02 | Would you like agents to take responsibility for delivering this, with a check at each step? | Delivery | Open | owner']);
  r = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(!r.json.agentTodos.some((t) => t.id === id), 'listed once, as the owner\'s question');
  assert.ok(r.json.decisions.some((d) => d.id === id && d.kind === 'open_question' && /Q-02/.test(d.what)));
});

test('finish and cancel close the Overview, and a finished item continues with nothing', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Shout', ['--type', 'task', '--stage', '08']);
  await tk(dir, ['work', 'edit', id, '--label', 'Current position', '--value', 'Built and checked on claude/wi-001-shout at f794cc6.']);
  await tk(dir, ['work', 'edit', id, '--label', 'Blockers', '--value', 'Local merge to main needs Mike\'s approval.']);
  const f = await tk(dir, ['work', 'finish', id, '--by', 'Mike', '--evidence', 'Merged into main at 1b8fe07; 5 of 5 tests pass', '--quote', 'Ship it.']);
  assert.equal(f.code, 0, f.stderr);
  const body = parseDoc(await readRecord(dir, id)).body;
  assert.equal(getLabel(body, 'Current position', { section: 'Overview' }), 'Done on 2026-09-26. Merged into main at 1b8fe07; 5 of 5 tests pass.');
  assert.equal(getLabel(body, 'Blockers', { section: 'Overview' }), 'None.');
  assert.equal(getLabel(body, 'Next action', { section: 'Overview' }), 'None. Finished.');
  assert.doesNotMatch(body, /<!--/, 'no template guide is left in a finished item');
  const show = await tk(dir, ['work', 'show', id]);
  assert.match(show.stdout, /Stage: Done \| Waiting on: none \| Continue with: nothing \(finished\)/);
  assert.doesNotMatch(show.stdout, /Worktree branch for this item/);
  const v = await tk(dir, ['work', 'validate', id, '--json']);
  assert.ok(!v.json.results[0].warnings.some((w) => w.code === 'terminal_blockers'));

  const c = await newItem(dir, 'Dropped', ['--type', 'task']);
  await tk(dir, ['work', 'edit', c, '--label', 'Blockers', '--value', 'Waiting for the API key.']);
  await tk(dir, ['work', 'cancel', c, '--reason', 'Not needed any more', '--by', 'Mike']);
  const cb = parseDoc(await readRecord(dir, c)).body;
  assert.equal(getLabel(cb, 'Current position', { section: 'Overview' }), 'Cancelled on 2026-09-26 by Mike: Not needed any more.');
  assert.equal(getLabel(cb, 'Blockers', { section: 'Overview' }), 'None.');
  const life = await tk(dir, ['work', 'lifecycle']);
  assert.match(life.stdout, /\(Done\)\s+Done\s+Set only by toolkit work finish[^\n]*Continue with: nothing \(finished\)/);
  assert.doesNotMatch(life.stdout, /\(Cancelled\)[^\n]*work-finish$/m);
});

test('validate counts approval gate problems and open owner questions apart', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Greeting', ['--type', 'task']);
  let r = await tk(dir, ['work', 'validate']);
  assert.match(r.stdout, /^Checked 1 item: 1 clean, 0 errors, 0 approval gate problems\. No open question waits on the owner\./m);
  await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-01 | Which name? | R-01 | Open | owner']);
  r = await tk(dir, ['work', 'validate']);
  assert.match(r.stdout, /0 approval gate problems\. 1 open question waits on the owner \(toolkit work decisions lists it\)\./);
  assert.doesNotMatch(r.stdout, /questions? for the owner\./);
});

test('a new title renames the folder the toolkit named and the design heading; a folder named by hand keeps its name', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Add a version flag to the greet CLI', ['--type', 'task']);
  const kid = await newItem(dir, 'Help text', ['--parent', id]);
  await tk(dir, ['work', 'design', id, '--create']);
  const r = await tk(dir, ['work', 'set', id, '--title', 'Build the basic greet CLI', '--json']);
  assert.equal(r.code, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(trackerDir(dir), 'WI-001-build-the-basic-greet-cli', 'WORK-ITEM.md')));
  assert.ok(!fs.existsSync(path.join(trackerDir(dir), 'WI-001-add-a-version-flag-to-the-greet-cli')));
  assert.ok(r.json.notes.some((n) => /Renamed its folder to match the new title: \.work-items\/WI-001-build-the-basic-greet-cli\//.test(n)), r.json.notes.join('\n'));
  assert.ok(r.json.notes.includes('The design heading now has the new title.'));
  const design = parseDoc(fs.readFileSync(path.join(trackerDir(dir), 'WI-001-build-the-basic-greet-cli', 'DESIGN.md'), 'utf8'));
  assert.equal(getH1(design.body).heading, 'WI-001: Build the basic greet CLI — solution design');
  // The sub-item moved with the folder and is not reported as moved by hand.
  const list = await tk(dir, ['work', 'list', '--json']);
  assert.deepEqual(list.json.changes.moves, []);
  assert.match(await recordPath(dir, kid), /WI-001-build-the-basic-greet-cli\/WI-002-help-text\/WORK-ITEM\.md$/);
  // A folder the owner named by hand is left alone.
  fs.renameSync(path.join(trackerDir(dir), 'WI-001-build-the-basic-greet-cli'), path.join(trackerDir(dir), 'greet-cli'));
  const again = await tk(dir, ['work', 'set', id, '--title', 'Greet CLI', '--json']);
  assert.ok(fs.existsSync(path.join(trackerDir(dir), 'greet-cli', 'WORK-ITEM.md')));
  assert.ok(again.json.notes.some((n) => /keeps the name \.work-items\/greet-cli\//.test(n)), again.json.notes.join('\n'));
});

test('edit reports the validation problems its own change causes', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Greeting', ['--type', 'task']);
  const table = 'A phase is complete when its tasks are complete and its exit result has been checked.\n\n| Phase | Outcome | Status | Exit result | Sub-items |\n|---|---|---|---|---|\n| P1 — Greeting | It greets | Complete | ok | None. |';
  const r = await tk(dir, ['work', 'edit', id, '--section', 'Roadmap', '--text', table, '--json']);
  assert.equal(r.code, 0);
  assert.ok(r.json.warnings.some((w) => w.code === 'roadmap_status'), JSON.stringify(r.json.warnings));
  const text = await tk(dir, ['work', 'edit', id, '--section', 'Roadmap', '--text', table.replace('Complete', 'Completed')]);
  assert.match(text.stdout, /Warning after this edit: Roadmap P1 has the status "Completed"/);
  const fixed = await tk(dir, ['work', 'edit', id, '--section', 'Roadmap', '--text', table.replace('Complete', 'Done'), '--json']);
  assert.deepEqual(fixed.json.warnings, [], 'nothing new');
});

test('edit --section Tasks puts each task field on its own line', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Greeting', ['--type', 'task']);
  await tk(dir, ['work', 'edit', id, '--section', 'Tasks', '--text', '### P1 — Brief\n\n- [x] **P1-T01 — Write initial brief** · Done **Work:** Edit README. **Deliverable:** README.md at e8c9796. **Done when:** Checked. **Depends on:** None.']);
  const body = parseDoc(await readRecord(dir, id)).body;
  assert.match(getSectionText(body, 'Tasks'), /- \[x\] \*\*P1-T01 — Write initial brief\*\* · Done  \n  \*\*Work:\*\* Edit README\.  \n  \*\*Deliverable:\*\* README\.md at e8c9796\.  \n  \*\*Done when:\*\* Checked\.  \n  \*\*Depends on:\*\* None\./);
});

test('show gives the worktree branch with the item\'s own prefix', async () => {
  const dir = makeProject({ prefix: 'TV2' });
  const id = await newItem(dir, 'README brief', ['--type', 'task']);
  assert.equal(id, 'TV2-001');
  const r = await tk(dir, ['work', 'show', id]);
  assert.match(r.stdout, /Worktree branch for this item: claude\/tv2-001-readme-brief \(folder \.claude\/worktrees\/tv2-001-readme-brief\)/);
  const j = await tk(dir, ['work', 'show', id, '--json']);
  assert.equal(j.json.worktreeBranch.branch, 'claude/tv2-001-readme-brief');
});

test('a sub-item names its parent in Related items, the parent names it, and a move updates both', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Greet CLI', ['--type', 'task']);
  const plan = 'A phase is complete when its tasks are complete and its exit result has been checked.\n\n| Phase | Outcome | Status | Exit result | Sub-items |\n|---|---|---|---|---|\n| P1 — Greeting | It greets | Done | ok | None. |\n| P2 — Flags | Flags work | In Progress | ok | None. |';
  await tk(dir, ['work', 'edit', a, '--section', 'Roadmap', '--text', plan]);
  const b = await newItem(dir, 'Version flag', ['--parent', a]);
  const pa = parseDoc(await readRecord(dir, a)).body;
  const pb = parseDoc(await readRecord(dir, b)).body;
  assert.equal(getLabel(pb, 'Related items', { section: 'Overview' }), `Parent ${a}.`);
  assert.equal(getLabel(pa, 'Related items', { section: 'Overview' }), `Sub-items: ${b}.`);
  assert.deepEqual(parseRoadmap(pa).map((r) => r.subItems), [[], [b]]);
  const c = await newItem(dir, 'Other', ['--type', 'task']);
  const m = await tk(dir, ['work', 'move', b, '--under', c]);
  assert.equal(m.code, 0, m.stderr);
  assert.equal(getLabel(parseDoc(await readRecord(dir, b)).body, 'Related items', { section: 'Overview' }), `Parent ${c}.`);
  const pa2 = parseDoc(await readRecord(dir, a)).body;
  assert.equal(getLabel(pa2, 'Related items', { section: 'Overview' }), 'None.');
  assert.deepEqual(parseRoadmap(pa2).map((r) => r.subItems), [[], []]);
  assert.equal(getLabel(parseDoc(await readRecord(dir, c)).body, 'Related items', { section: 'Overview' }), `Sub-items: ${b}.`);
  assert.equal((await history(dir, c))[0].change, `Sub-item ${b} moved here with toolkit work move (it was under ${a}).`);
});

test('a sub-item gets the delivery chosen for its parent, when it is made and when the parent\'s is recorded later', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Big', ['--type', 'task', '--stage', '04']);
  const early = await newItem(dir, 'Early part', ['--parent', a]);
  const s = await tk(dir, ['work', 'set', a, '--delivery', 'agent-led', '--json']);
  assert.ok(s.json.notes.some((n) => n === `Delivery agent-led also recorded on its sub-item ${early}.`), s.json.notes.join('\n'));
  assert.equal(parseDoc(await readRecord(dir, early)).meta.delivery, 'agent-led');
  const late = await newItem(dir, 'Later part', ['--parent', a]);
  assert.equal(parseDoc(await readRecord(dir, late)).meta.delivery, 'agent-led');
});

test('an approved design missing template sections is reported by validate', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  await tk(dir, ['work', 'design', id, '--create', '--text', JOINED_HEADER(id)]);
  const a = await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike']);
  assert.equal(a.code, 0, a.stdout + a.stderr);
  const v = await tk(dir, ['work', 'validate', id, '--json']);
  const codes = v.json.results[0].design.warnings.map((w) => w.code);
  assert.ok(codes.includes('design_section_missing'), JSON.stringify(v.json.results[0].design));
});

test('toolkit work decisions lists memory proposals that wait for the owner', async (t) => {
  const dir = makeProject();
  const s = await tk(dir, ['memory', 'save', '--type', 'user', '--name', 'likes-short-replies', '--description', 'Mike likes short replies', '--body', 'Keep replies short.', '--proposal', '--json']);
  if (s.code !== 0) {
    t.skip(`toolkit memory save --proposal is not available here: ${s.stderr || s.stdout}`);
    return;
  }
  const r = await tk(dir, ['work', 'decisions', '--json']);
  assert.equal(r.code, 0, r.stderr);
  assert.deepEqual(r.json.memoryProposals.map((p) => p.key), ['user_likes_short_replies']);
  assert.equal(r.json.count, 1);
  const text = await tk(dir, ['work', 'decisions']);
  assert.match(text.stdout, /^1 decision waits on the owner:/m);
  assert.match(text.stdout, /user_likes_short_replies: Mike likes short replies\. .*Yes: toolkit memory approve user_likes_short_replies --by <name>\. No: toolkit memory reject user_likes_short_replies\./);
});

test('collectOwnerDecisions leaves a draft design out only when its text was read', () => {
  const item = (design) => ({ id: 'WI-001', meta: { id: 'WI-001', title: 'X', stage: '04-solution-design', status: 'In Progress', design: 'proposed' }, body: '', design });
  assert.equal(collectOwnerDecisions([item({ status: 'proposed' })]).length, 1, 'text not read: counted as proposed');
  assert.equal(collectOwnerDecisions([item({ status: 'proposed', body: parseDoc(DESIGN_TEMPLATE).body })]).length, 0);
  assert.equal(collectAgentTodos([]).length, 0);
});

test('a note that quotes the owner\'s answer names the step after the answer, not work-decide', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Checks', ['--type', 'task', '--stage', '09']);
  await tk(dir, ['work', 'set', id, '--waiting-on', 'owner']);
  await tk(dir, ['work', 'history', id, '--note', "Owner's words: \"All four passed.\""]);
  const h = await history(dir, id);
  assert.equal(h[0].effect, 'Continue with work-check.');
  await tk(dir, ['work', 'history', id, '--note', 'Asked the owner again.']);
  assert.equal((await history(dir, id))[0].effect, 'Continue with work-decide.', 'any other note while he is asked still says work-decide');
});

test('work design --status approved --by records the approval the same all-or-nothing way as approve --design', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  const r = await tk(dir, ['work', 'design', id, '--create', '--text', JOINED_HEADER(id), '--status', 'approved', '--by', 'Mike', '--json']);
  assert.equal(r.code, 0, r.stdout + r.stderr);
  assert.equal(r.json.status, 'approved');
  const doc = parseDoc(fs.readFileSync(await designFile(dir, id), 'utf8'));
  assert.equal(doc.meta.approved, '2026-09-26 by Mike');
  assert.equal(designStatusFromBody(doc.body), 'approved');
  const h = await history(dir, id);
  assert.deepEqual(h.slice(0, 2).map((x) => x.change), ['Design approved by Mike.', 'Design created (proposed).']);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.design, 'approved');
});

test('a sub-item folder moved by hand under another item: Related items follow on all three items', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Greet CLI', ['--type', 'task']);
  const b = await newItem(dir, 'Version flag', ['--parent', a]);
  const c = await newItem(dir, 'Other', ['--type', 'task']);
  fs.renameSync(path.join(trackerDir(dir), 'WI-001-greet-cli', 'WI-002-version-flag'), path.join(trackerDir(dir), 'WI-003-other', 'WI-002-version-flag'));
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.code, 0, r.stderr);
  const rel = async (id) => getLabel(parseDoc(await readRecord(dir, id)).body, 'Related items', { section: 'Overview' });
  assert.equal(await rel(b), `Parent ${c}.`);
  assert.equal(await rel(a), 'None.');
  assert.equal(await rel(c), `Sub-items: ${b}.`);
});

test('a question about a delivery date is not taken for the delivery offer', () => {
  const body = (question, affects = 'R-01') => `## Open Questions\n\n| ID | Question | Affects | Status | Decision needed from |\n|---|---|---|---|---|\n| Q-02 | ${question} | ${affects} | Open | owner |\n`;
  assert.equal(deliveryAsked(body('When should it be delivered?')), false);
  assert.equal(deliveryAsked(body('Should this be agent-led or owner-led?')), true);
  assert.equal(deliveryAsked(body('Should a team of agents build it?')), true);
});

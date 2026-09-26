// What happens when the owner moves, renames, copies, or edits work items by
// hand (ARCHITECTURE 4.2 "Owner edits win" and 4.3; critique B2, I1, I3, M2).

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, readRecord, recordPath, readState, trackerDir, editFile, git } from './helpers.mjs';
import { parseDoc, parseHistory, getH1, getLabel, getSectionText as getSectionTextOf } from '../../lib/work/model.mjs';
import { checkChanged } from '../../lib/work/state.mjs';
import { BUILTIN_WORK_ITEM } from '../../lib/work/templates.mjs';
import { LocalTracker } from '../../lib/work/local.mjs';
import { requireProject } from '../../lib/core/config.mjs';

after(cleanup);

const W = (dir, ...p) => path.join(trackerDir(dir), ...p);

test('a renamed folder keeps the item and is reported', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Login page');
  fs.renameSync(W(dir, 'WI-001-login-page'), W(dir, 'sign-in'));
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.code, 0);
  assert.equal(r.json.items[0].id, id);
  assert.equal(r.json.changes.moves[0].kind, 'folder-renamed');
  assert.equal(r.json.changes.moves[0].to, '.work-items/sign-in/WORK-ITEM.md');
  assert.equal(await recordPath(dir, id), W(dir, 'sign-in', 'WORK-ITEM.md'));
  const human = await tk(dir, ['work', 'list']);
  assert.doesNotMatch(human.stdout, /Renamed/, 'reported once, not on every command');
  assert.equal(readState(dir).items['WI-001'].path, 'sign-in/WORK-ITEM.md');
});

test('a renamed record file keeps the item and is reported', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Login page');
  fs.renameSync(W(dir, 'WI-001-login-page', 'WORK-ITEM.md'), W(dir, 'WI-001-login-page', 'notes.md'));
  const r = await tk(dir, ['work', 'show', id]);
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /Renamed file: WI-001 is now \.work-items\/WI-001-login-page\/notes\.md/);
  assert.equal(await recordPath(dir, id), W(dir, 'WI-001-login-page', 'notes.md'));
});

test('a folder moved by hand under another item becomes its sub-item', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Checkout');
  const b = await newItem(dir, 'Billing');
  fs.renameSync(W(dir, 'WI-002-billing'), W(dir, 'WI-001-checkout', 'WI-002-billing'));
  const r = await tk(dir, ['work', 'list', '--json']);
  const move = r.json.changes.moves.find((m) => m.id === b);
  assert.equal(move.kind, 'moved');
  assert.equal(move.parentBefore, 'none');
  assert.equal(move.parentAfter, a);
  const human = await tk(dir, ['work', 'sync']);
  assert.match(human.stdout, /Nothing changed/);
  const doc = parseDoc(await readRecord(dir, b));
  assert.equal(doc.meta.parent, a, 'parent follows location');
  assert.ok(!parseHistory(doc.body).some((h) => /Changed by hand/.test(h.change)), 'a move is not an owner edit of parent');
  const parentItem = r.json.items.find((i) => i.id === a);
  assert.deepEqual(parentItem.children, [b]);
  fs.renameSync(W(dir, 'WI-001-checkout', 'WI-002-billing'), W(dir, 'WI-002-billing'));
  const back = await tk(dir, ['work', 'list', '--json']);
  assert.equal(back.json.changes.moves[0].parentAfter, 'none');
  assert.equal(parseDoc(await readRecord(dir, b)).meta.parent, 'none');
});

test('a folder moved by hand into a group keeps its parent and reports the group', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Invoices');
  fs.mkdirSync(W(dir, 'billing'));
  fs.renameSync(W(dir, 'WI-001-invoices'), W(dir, 'billing', 'WI-001-invoices'));
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.json.changes.moves[0].id, a);
  assert.equal(r.json.changes.moves[0].parentAfter, 'none');
  assert.equal(r.json.items[0].group, 'billing');
  assert.equal(r.json.items[0].parent, 'none');
  const tree = await tk(dir, ['work', 'list', '--tree']);
  assert.match(tree.stdout, /billing\/ \(group\)\n {2}WI-001 {2}Invoices/);
  const b = await newItem(dir, 'Refunds', ['--parent', a]);
  assert.equal(await recordPath(dir, b), W(dir, 'billing', 'WI-001-invoices', 'WI-002-refunds', 'WORK-ITEM.md'));
  const dash = fs.readFileSync(W(dir, 'DASHBOARD.md'), 'utf8');
  assert.match(dash, /- billing\/ \(group\)\n {2}- WI-001 Invoices/);
});

test('a copied folder keeps the original id and renumbers the copy (and its design)', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Search');
  await tk(dir, ['work', 'design', a, '--create']);
  await newItem(dir, 'Other');
  fs.cpSync(W(dir, 'WI-001-search'), W(dir, 'WI-001-search copy'), { recursive: true });
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.code, 0, r.stdout);
  const ren = r.json.changes.renumbered;
  assert.equal(ren.length, 1);
  assert.equal(ren[0].from, 'WI-001');
  assert.equal(ren[0].to, 'WI-003');
  assert.equal(ren[0].original, '.work-items/WI-001-search/WORK-ITEM.md');
  assert.equal(await recordPath(dir, 'WI-001'), W(dir, 'WI-001-search', 'WORK-ITEM.md'), 'the original keeps its id and path');
  const copyPath = await recordPath(dir, 'WI-003');
  assert.equal(copyPath, W(dir, 'WI-003-search copy', 'WORK-ITEM.md'), 'the copy folder is renamed to its new id');
  const copy = parseDoc(fs.readFileSync(copyPath, 'utf8'));
  assert.equal(getH1(copy.body).id, 'WI-003');
  assert.match(parseHistory(copy.body).at(-1).change, /^Renumbered: this record had id WI-001/);
  const design = parseDoc(fs.readFileSync(W(dir, 'WI-003-search copy', 'DESIGN.md'), 'utf8'));
  assert.equal(design.meta.work_item, 'WI-003');
  assert.equal(readState(dir).highWater, 3);
  assert.equal(await newItem(dir, 'Next'), 'WI-004');
});

test('the template folder is skipped, and a template copy with no title is reported, not tracked', async () => {
  const dir = makeProject();
  fs.mkdirSync(W(dir, 'work-item-template'), { recursive: true });
  fs.writeFileSync(W(dir, 'work-item-template', 'WORK-ITEM.md'), BUILTIN_WORK_ITEM);
  const a = await newItem(dir, 'Real item');
  assert.equal(a, 'WI-001', 'the template id WI-001 is not counted');
  fs.cpSync(W(dir, 'work-item-template'), W(dir, 'my-idea'), { recursive: true });
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.json.items.length, 1);
  assert.ok(r.json.changes.problems.some((p) => p.message.includes('.work-items/my-idea/WORK-ITEM.md is a copy of the work item template with no title')));
  assert.equal(r.json.changes.renumbered.length, 0);
  editFile(W(dir, 'my-idea', 'WORK-ITEM.md'), 'title: <Work item title>', 'title: My idea');
  const r2 = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r2.json.changes.renumbered[0].to, 'WI-002', 'once titled, the copy is a newcomer with a duplicate id');
  const copy = parseDoc(await readRecord(dir, 'WI-002'));
  assert.equal(copy.meta.title, 'My idea');
  assert.equal(copy.meta.status, 'Backlog', 'template placeholders replaced');
  assert.equal(copy.meta.type, 'task');
  assert.equal(copy.meta.parent, 'none');
  assert.equal(getH1(copy.body).heading, 'WI-002: My idea');
  assert.equal(await recordPath(dir, 'WI-001'), W(dir, 'WI-001-real-item', 'WORK-ITEM.md'));
});

test('a WORK-ITEM.md with no id is adopted with the next id', async () => {
  const dir = makeProject();
  await newItem(dir, 'First');
  fs.mkdirSync(W(dir, 'quick-note'));
  fs.writeFileSync(W(dir, 'quick-note', 'WORK-ITEM.md'), BUILTIN_WORK_ITEM.replace('id: WI-001\n', '').replace('title: <Work item title>', 'title: Quick note'));
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.json.changes.adopted[0].id, 'WI-002');
  const doc = parseDoc(await readRecord(dir, 'WI-002'));
  assert.equal(doc.meta.id, 'WI-002');
  assert.equal(doc.meta.stage, '01-discovery');
  assert.equal(getH1(doc.body).heading, 'WI-002: Quick note');
});

test('a record made by hand with a new id is adopted and the high-water id moves up', async () => {
  const dir = makeProject();
  await newItem(dir, 'First');
  fs.mkdirSync(W(dir, 'WI-010-manual'));
  fs.writeFileSync(W(dir, 'WI-010-manual', 'WORK-ITEM.md'), BUILTIN_WORK_ITEM.replace(/WI-001/g, 'WI-010').replace(/<Work item title>/g, 'Manual'));
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.json.changes.adopted[0].id, 'WI-010');
  const doc = parseDoc(await readRecord(dir, 'WI-010'));
  assert.equal(doc.meta.status, 'Backlog');
  assert.match(parseHistory(doc.body).at(-1).change, /Adopted by the toolkit/);
  assert.equal(await newItem(dir, 'After manual'), 'WI-011');
});

test('an H1 renamed by hand becomes the title, with a history row', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Login page');
  editFile(await recordPath(dir, id), '# WI-001: Login page', '# WI-001: Sign-in page');
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.json.changes.ownerEdits[0].field, 'title');
  assert.equal(r.json.items[0].title, 'Sign-in page');
  const doc = parseDoc(await readRecord(dir, id));
  assert.equal(doc.meta.title, 'Sign-in page');
  assert.match(parseHistory(doc.body).at(-1).change, /^Changed by hand: title from "Login page" to "Sign-in page"/);
});

test('a status set to Done by hand is kept, reported, and asked about', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Docs', ['--stage', '08']);
  editFile(await recordPath(dir, id), 'status: In Progress', 'status: Done');
  const r = await tk(dir, ['work', 'sync', '--json']);
  const edit = r.json.ownerEdits.find((e) => e.field === 'status');
  assert.equal(edit.to, 'Done');
  assert.match(edit.note, /no evidence recorded/);
  assert.equal(r.json.questions[0].code, 'done_without_result_approval');
  const doc = parseDoc(await readRecord(dir, id));
  assert.equal(doc.meta.status, 'Done', 'never reverted');
  const again = await tk(dir, ['work', 'sync', '--json']);
  assert.equal(again.json.ownerEdits.length, 0, 'reported once');
  const v = await tk(dir, ['work', 'validate', id]);
  assert.equal(v.code, 2);
  assert.match(v.stdout, /Question for the owner: Did the owner approve the result of WI-001\?/);
  const dec = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(dec.json.decisions.some((d) => d.kind === 'gate' && d.id === id));
});

test('a non-terminal status set by hand is kept even though the stage gives another', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Docs', ['--stage', '04']);
  editFile(await recordPath(dir, id), 'status: In Progress', 'status: In Review');
  const r = await tk(dir, ['work', 'sync', '--json']);
  assert.equal(r.json.ownerEdits[0].field, 'status');
  assert.equal(parseDoc(await readRecord(dir, id)).meta.status, 'In Review');
  await tk(dir, ['work', 'sync']);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.status, 'In Review', 'the next sync does not undo it');
  await tk(dir, ['work', 'set', id, '--stage', '08']);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.status, 'In Progress', 'a toolkit stage change sets the status again');
});

test('a build item moved past 03 by hand is kept and becomes a question for the owner', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Importer', ['--type', 'build']);
  editFile(await recordPath(dir, id), 'stage: 01-discovery', 'stage: 08-build');
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.json.changes.ownerEdits[0].field, 'stage');
  assert.match(r.json.changes.questions[0].question, /Was moving WI-001 to 08-build the owner's requirements approval\?/);
  const doc = parseDoc(await readRecord(dir, id));
  assert.equal(doc.meta.stage, '08-build', 'kept');
  assert.equal(doc.meta.status, 'In Progress', 'status derived from the kept stage');
  const human = await tk(dir, ['work', 'validate']);
  assert.equal(human.code, 2);
  assert.match(human.stdout, /Question for the owner: Was moving WI-001 to 08-build/);
  await tk(dir, ['work', 'approve', id, '--requirements', '--by', 'Mike']);
  assert.equal((await tk(dir, ['work', 'validate'])).code, 0);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.stage, '08-build', 'approval does not move a later stage back');
});

test('a parent typed by hand is kept and asked about; the folder is not moved', async () => {
  const dir = makeProject();
  await newItem(dir, 'One');
  const b = await newItem(dir, 'Two');
  editFile(await recordPath(dir, b), 'parent: none', 'parent: WI-001');
  const r = await tk(dir, ['work', 'sync', '--json']);
  assert.equal(r.json.questions[0].code, 'parent_location_mismatch');
  assert.match(r.json.questions[0].question, /toolkit work move WI-002 --under WI-001/);
  assert.equal(parseDoc(await readRecord(dir, b)).meta.parent, 'WI-001');
  assert.equal(await recordPath(dir, b), W(dir, 'WI-002-two', 'WORK-ITEM.md'));
  const v = await tk(dir, ['work', 'validate', b, '--json']);
  assert.ok(v.json.results[0].warnings.some((w) => w.code === 'parent_location_mismatch'));
});

test('a record file moved on its own into another item folder is a sub-item of that folder item', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Parent');
  const b = await newItem(dir, 'Loose');
  fs.renameSync(W(dir, 'WI-002-loose', 'WORK-ITEM.md'), W(dir, 'WI-001-parent', 'loose.md'));
  fs.rmdirSync(W(dir, 'WI-002-loose'));
  const r = await tk(dir, ['work', 'list', '--json']);
  const item = r.json.items.find((i) => i.id === b);
  assert.equal(item.parent, a);
  assert.equal(parseDoc(await readRecord(dir, a)).meta.parent, 'none', 'the folder owner stays the parent');
  assert.equal(parseDoc(await readRecord(dir, b)).meta.parent, a);
  const moved = await tk(dir, ['work', 'move', b, '--under', 'root', '--json']);
  assert.equal(moved.code, 0, moved.stdout);
  assert.equal(await recordPath(dir, b), W(dir, 'WI-002-loose', 'loose.md'), 'a loose record gets its own folder');
});

test('a missing item is reported once, its id is never reused, and it is recognized when it comes back', async () => {
  const dir = makeProject();
  await newItem(dir, 'One');
  await newItem(dir, 'Two');
  const outside = path.join(dir, 'parked-two');
  fs.renameSync(W(dir, 'WI-002-two'), outside);
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.json.changes.missing[0].id, 'WI-002');
  assert.equal(r.json.changes.missing[0].lastLocation, '.work-items/WI-002-two/WORK-ITEM.md');
  const all = await tk(dir, ['work', 'list', '--all', '--json']);
  assert.deepEqual(all.json.missing, ['WI-002']);
  assert.equal(await newItem(dir, 'Three'), 'WI-003', 'ids are never reused');
  const v = await tk(dir, ['work', 'validate', '--json']);
  assert.ok(v.json.problems.some((p) => p.message.startsWith('WI-002 is known to the tracker but its record was not found')));
  fs.renameSync(outside, W(dir, 'WI-002-two'));
  const back = await tk(dir, ['work', 'list', '--json']);
  assert.equal(back.json.changes.moves[0].kind, 'returned');
  assert.equal(back.json.items.length, 3);
});

test('a deleted state file does not lose ids that still exist', async () => {
  const dir = makeProject();
  await newItem(dir, 'One');
  await newItem(dir, 'Two');
  fs.rmSync(W(dir, '.toolkit-state.json'));
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.json.items.length, 2);
  assert.equal(await newItem(dir, 'Three'), 'WI-003');
});

test('checkChanged is false after a toolkit write and true after a hand change', async () => {
  const dir = makeProject();
  assert.equal(checkChanged(dir).changed, false, 'no tracker yet');
  const id = await newItem(dir, 'One');
  assert.equal(checkChanged(dir).changed, false);
  const t0 = process.hrtime.bigint();
  checkChanged(dir);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  assert.ok(ms < 200, `fast: ${ms} ms`);
  const file = await recordPath(dir, id);
  fs.writeFileSync(file, `${fs.readFileSync(file, 'utf8')}\n`);
  assert.equal(checkChanged(dir).changed, true, 'a content edit counts');
  await tk(dir, ['work', 'list']);
  assert.equal(checkChanged(dir).changed, false);
  fs.mkdirSync(W(dir, 'new-group'));
  assert.equal(checkChanged(dir).changed, true, 'a new folder counts');
  await tk(dir, ['work', 'sync']);
  fs.writeFileSync(W(dir, 'DASHBOARD.md'), 'edited');
  assert.equal(checkChanged(dir).changed, false, 'the dashboard does not count');
  assert.equal(checkChanged(trackerDir(dir)).changed, false, 'the tracker folder itself is accepted');
});

test('a newer state file stops every write before any file is touched', async () => {
  const dir = makeProject();
  const one = await newItem(dir, 'One');
  await newItem(dir, 'Two');
  const file = W(dir, '.toolkit-state.json');
  const state = JSON.parse(fs.readFileSync(file, 'utf8'));
  state.schema = 99;
  fs.writeFileSync(file, JSON.stringify(state));
  const snapshot = () => {
    const out = {};
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else out[path.relative(trackerDir(dir), p)] = fs.readFileSync(p, 'utf8');
      }
    };
    walk(trackerDir(dir));
    return out;
  };
  const before = snapshot();
  const writes = [
    ['work', 'new', '--title', 'Under newer state'],
    ['work', 'history', one, '--note', 'Should not be written'],
    ['work', 'set', one, '--priority', 'high'],
    ['work', 'design', one, '--create'],
    ['work', 'move', one, '--under', 'archive'],
    ['work', 'approve', one, '--requirements', '--by', 'Mike'],
  ];
  for (const args of writes) {
    const r = await tk(dir, args);
    assert.equal(r.code, 1, `${args.join(' ')} exits 1`);
    assert.match(r.stderr, /written by a newer toolkit \(schema 99\)\. This toolkit understands schema 1, so it changed nothing\./);
  }
  assert.deepEqual(snapshot(), before, 'no folder was created and no file changed');
  assert.equal(JSON.parse(fs.readFileSync(file, 'utf8')).schema, 99);
  const list = await tk(dir, ['work', 'list', '--json']);
  assert.equal(list.code, 0, 'reading still works');
  assert.ok(list.json.changes.problems.length === 0 || list.json.changes.problems.some((p) => /newer toolkit/.test(p.message)));
});

test('an edit made by hand is picked up by the next command, and the Overall status follows an approval typed by hand', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Report', ['--type', 'task']);
  editFile(await recordPath(dir, id), 'requirements_approved: no', 'requirements_approved: 2026-09-25 by Mike');
  const r = await tk(dir, ['work', 'show', id, '--json']);
  assert.ok(r.json.changes.ownerEdits.some((e) => e.field === 'requirements_approved'));
  assert.equal(getLabel(r.json.body, 'Overall status', { section: 'Requirements' }), 'Finalized');
});

test('a group inside an item folder is refused for move and new, so the toolkit never writes a parent the folder contradicts', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Login page');
  const b = await newItem(dir, 'Session timeout');
  fs.mkdirSync(W(dir, 'WI-001-login-page', 'notes'));
  const before = await readRecord(dir, b);
  const moved = await tk(dir, ['work', 'move', b, '--under', 'WI-001-login-page/notes']);
  assert.equal(moved.code, 2);
  assert.match(moved.stderr, /inside WI-001-login-page, the folder of WI-001/);
  assert.match(moved.stderr, /--under WI-001/);
  assert.equal(await readRecord(dir, b), before, 'nothing moved and nothing written');
  const created = await tk(dir, ['work', 'new', '--title', 'In a group', '--group', 'WI-001-login-page/notes/deeper']);
  assert.equal(created.code, 2);
  assert.equal(fs.readdirSync(W(dir, 'WI-001-login-page', 'notes')).length, 0);
  const ok = await tk(dir, ['work', 'move', b, '--under', a, '--json']);
  assert.equal(ok.code, 0);
  assert.equal(parseDoc(await readRecord(dir, b)).meta.parent, a);
  const v = await tk(dir, ['work', 'validate', b, '--json']);
  assert.ok(!v.json.results[0].warnings.some((w) => w.code === 'parent_location_mismatch'));
});

test('a WORK-ITEM.md written freely with no id gets the template sections, with its text under Starting request', async () => {
  const dir = makeProject();
  await newItem(dir, 'First');
  fs.mkdirSync(W(dir, 'footer'));
  fs.writeFileSync(W(dir, 'footer', 'WORK-ITEM.md'), '# Fix the footer\n\nThe footer overlaps the cookie banner on phones.\n\n## Why\n\nIt hides the links.\n');
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.code, 0);
  assert.equal(r.json.changes.adopted[0].id, 'WI-002');
  assert.match(r.json.changes.adopted[0].reason, /template sections/);
  const doc = parseDoc(await readRecord(dir, 'WI-002'));
  assert.equal(doc.meta.title, 'Fix the footer');
  assert.equal(doc.meta.status, 'Backlog');
  assert.equal(getH1(doc.body).heading, 'WI-002: Fix the footer');
  const v = await tk(dir, ['work', 'validate', 'WI-002', '--json']);
  assert.deepEqual(v.json.results[0].errors, [], 'every section is there');
  const request = getSectionTextOf(doc.body, 'Starting request');
  assert.match(request, /The footer overlaps the cookie banner on phones\./);
  assert.match(request, /^##### Why$/m, 'the owner heading moves down inside Starting request');
  assert.match(parseHistory(doc.body).at(-1).change, /^Adopted by the toolkit: found at \.work-items\/footer\/WORK-ITEM\.md with no id\./);
  const h = await tk(dir, ['work', 'history', 'WI-002', '--note', 'Looked at it']);
  assert.equal(h.code, 0, 'the history table exists');
});

test('a record written freely with a new id gets the template sections too', async () => {
  const dir = makeProject();
  fs.mkdirSync(W(dir, 'WI-005-hand'), { recursive: true });
  fs.writeFileSync(W(dir, 'WI-005-hand', 'WORK-ITEM.md'), '---\nid: WI-005\ntitle: Hand made\ntype: bug\n---\n\n# WI-005: Hand made\n\nSearch returns nothing for accented names.\n');
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.json.changes.adopted[0].id, 'WI-005');
  const doc = parseDoc(await readRecord(dir, 'WI-005'));
  assert.equal(doc.meta.type, 'bug', 'the owner value is kept');
  assert.match(getSectionTextOf(doc.body, 'Starting request'), /accented names/);
  assert.deepEqual((await tk(dir, ['work', 'validate', 'WI-005', '--json'])).json.results[0].errors, []);
});

test('a type changed by hand to build on an item past 03 is kept and asked about', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Exporter', ['--type', 'task', '--stage', '08']);
  editFile(await recordPath(dir, id), 'type: task', 'type: build');
  const r = await tk(dir, ['work', 'sync', '--json']);
  const edit = r.json.ownerEdits.find((e) => e.field === 'type');
  assert.ok(edit);
  assert.equal(edit.to, 'build');
  assert.ok(r.json.questions.some((q) => q.code === 'requirements_not_approved' && /changed by hand to a build item at 08-build/.test(q.question)));
  assert.equal(parseDoc(await readRecord(dir, id)).meta.type, 'build', 'kept');
  const again = await tk(dir, ['work', 'sync', '--json']);
  assert.equal(again.json.questions.length, 0, 'asked once, when the change is found');
  const show = await tk(dir, ['work', 'show', id, '--json']);
  assert.equal(show.json.item.continueWith, 'work-decide');
});

test('a design set to approved by hand with no recorded approval is asked about', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Search');
  await tk(dir, ['work', 'design', id, '--create']);
  editFile(W(dir, 'WI-001-search', 'DESIGN.md'), 'status: proposed', 'status: approved');
  const r = await tk(dir, ['work', 'sync', '--json']);
  assert.ok(r.json.questions.some((q) => q.code === 'design_approved_without_record' && /toolkit work approve WI-001 --design --by <name>/.test(q.question)));
  await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike']);
  const v = await tk(dir, ['work', 'validate', id, '--json']);
  assert.deepEqual(v.json.results[0].design.gates, []);
});

test('checkChanged from a linked worktree uses the main checkout tracker, even when the worktree has a .work-items folder', async () => {
  const dir = makeProject({ commit: true });
  await newItem(dir, 'One');
  const wt = path.join(path.dirname(dir), `${path.basename(dir)}-wt`);
  git(dir, ['worktree', 'add', '-q', '-b', 'wi-001-one', wt]);
  try {
    fs.mkdirSync(path.join(wt, '.work-items', 'stray'), { recursive: true });
    const res = checkChanged(wt);
    assert.equal(res.trackerDir, trackerDir(dir));
    assert.equal(res.changed, false);
    assert.equal(checkChanged(dir).trackerDir, trackerDir(dir));
  } finally {
    git(dir, ['worktree', 'remove', '--force', wt]);
  }
});

test('a hand change found only once a write holds the lock is added to the command report', async () => {
  const dir = makeProject();
  const project = requireProject(dir);
  const a = await newItem(dir, 'Alpha');
  const tracker = new LocalTracker(project, { today: '2026-09-26' });
  const changes = await tracker.sync({ quick: true });
  tracker.collectReports(changes);
  fs.renameSync(W(dir, 'WI-001-alpha'), W(dir, 'alpha-renamed'));
  await tracker.update(a, { meta: { priority: 'high' } });
  assert.equal(changes.moves.length, 1);
  assert.equal(changes.moves[0].to, '.work-items/alpha-renamed/WORK-ITEM.md');
});

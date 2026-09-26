// Records the frontmatter reader cannot read (a title like `[draft] login`, a
// quote with no closing quote, a deleted --- line, a deleted id line). One
// broken file must never stop the other commands; it is reported with its
// path and the reader's message, left as it is, and its item stays known.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, recordPath, readState, trackerDir, editFile } from './helpers.mjs';
import { parseDoc, validateRecord } from '../../lib/work/model.mjs';
import { validateFile } from '../../lib/work/ops.mjs';
import { workSummary } from '../../lib/work/report.mjs';
import { requireProject } from '../../lib/core/config.mjs';

after(cleanup);

const W = (dir, ...p) => path.join(trackerDir(dir), ...p);

async function threeItems(dir) {
  const a = await newItem(dir, 'Home page');
  const b = await newItem(dir, 'Login page');
  const c = await newItem(dir, 'Password reset', ['--parent', b]);
  return { a, b, c };
}

for (const [label, from, to, parserText] of [
  ['a title that starts with [', 'title: Login page', 'title: [draft] login', /has text after a \[list\] or \{map\}: title: \[draft\] login/],
  ['a quote with no closing quote', 'title: Login page', 'title: "After stale lock', /no closing quote/],
]) {
  test(`one record with ${label} does not stop list, new, sync, or validate, and the report names the file`, async () => {
    const dir = makeProject();
    const { a, b, c } = await threeItems(dir);
    const file = await recordPath(dir, b);
    editFile(file, from, to);
    const brokenText = fs.readFileSync(file, 'utf8');
    const where = '.work-items/WI-002-login-page/WORK-ITEM.md';

    const list = await tk(dir, ['work', 'list', '--json']);
    assert.equal(list.code, 0, list.stderr);
    assert.deepEqual(list.json.items.map((i) => i.id), [a, c]);
    assert.equal(list.json.items.find((i) => i.id === c).parent, b, 'the sub-item keeps its parent while the parent record is broken');
    const problem = list.json.changes.problems.find((p) => p.code === 'unreadable_record');
    assert.ok(problem, 'the first command reports the broken file');
    assert.equal(problem.location, where);
    assert.equal(problem.id, b);
    assert.match(problem.message, parserText);
    assert.equal(list.json.changes.missing.length, 0, 'the item is not reported missing');
    assert.equal(list.json.changes.adopted.length, 0, 'the file is not adopted under a new id');

    const text = await tk(dir, ['work', 'list']);
    assert.equal(text.code, 0);
    assert.match(text.stdout, new RegExp(where.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'plain output names the file too');

    const created = await tk(dir, ['work', 'new', '--title', 'Search', '--json']);
    assert.equal(created.code, 0, created.stderr);
    assert.equal(created.json.id, 'WI-004', 'the broken item keeps its id; the next id is new');

    const sync = await tk(dir, ['work', 'sync', '--json']);
    assert.equal(sync.code, 0, sync.stderr);
    assert.ok(sync.json.problems.some((p) => p.location === where && parserText.test(p.message)));
    assert.equal(sync.json.missing.length, 0);
    assert.equal(sync.json.derived.filter((d) => d.id === c && d.field === 'parent').length, 0, 'the sub-item parent is not rewritten');

    const validate = await tk(dir, ['work', 'validate']);
    assert.equal(validate.code, 2, 'a file that cannot be read is a validation failure');
    assert.match(validate.stdout, new RegExp(where.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.doesNotMatch(validate.stdout, /known to the tracker but its record was not found/);

    const show = await tk(dir, ['work', 'show', b]);
    assert.equal(show.code, 2);
    assert.match(show.stderr, /WI-002 cannot be read/);
    assert.match(show.stderr, parserText);
    const set = await tk(dir, ['work', 'set', b, '--priority', 'high']);
    assert.equal(set.code, 2, 'a change to the broken item is refused');
    assert.equal(fs.readFileSync(file, 'utf8'), brokenText, 'the broken file is never written');

    const v = validateFile(file, { prefix: 'WI' });
    assert.equal(v.ok, false);
    assert.equal(v.errors[0].code, 'bad_frontmatter');
    assert.equal(v.id, b);
    assert.equal(validateRecord(brokenText).errors[0].code, 'bad_frontmatter', 'validateRecord does not throw either');

    const summary = await workSummary(requireProject(dir), { cwd: dir, sync: 'full' });
    assert.deepEqual(summary.active.map((i) => i.id), []);
    assert.ok(summary.reportLines.some((l) => l.includes(where)), 'the briefing names the file');

    assert.match(fs.readFileSync(W(dir, 'DASHBOARD.md'), 'utf8'), /## Files that cannot be read/);
    assert.equal(readState(dir).items[b].path, 'WI-002-login-page/WORK-ITEM.md', 'the state keeps the item');

    editFile(file, to, 'title: "[draft] login"');
    const fixed = await tk(dir, ['work', 'list', '--json']);
    assert.equal(fixed.code, 0);
    assert.deepEqual(fixed.json.items.map((i) => i.id), [a, b, c, 'WI-004']);
    assert.equal(fixed.json.changes.problems.filter((p) => p.code === 'unreadable_record').length, 0);
    assert.equal(fixed.json.changes.adopted.length + fixed.json.changes.renumbered.length + fixed.json.changes.moves.length, 0);
    assert.equal(fixed.json.items.find((i) => i.id === b).title, '[draft] login', 'the owner title is kept');
  });
}

test('a record whose opening --- line was deleted is reported and keeps its id', async () => {
  const dir = makeProject();
  const { a, b } = await threeItems(dir);
  const file = await recordPath(dir, a);
  const good = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, good.replace(/^---\n/, ''));
  const broken = fs.readFileSync(file, 'utf8');
  const r = await tk(dir, ['work', 'list', '--json']);
  assert.equal(r.code, 0, r.stderr);
  assert.equal(r.json.changes.adopted.length, 0, 'not adopted under a new id');
  assert.equal(r.json.changes.missing.length, 0, 'not reported missing');
  const p = r.json.changes.problems.find((x) => x.code === 'unreadable_record');
  assert.ok(p);
  assert.equal(p.id, a);
  assert.match(p.message, /missing its opening or closing "---" line/);
  assert.equal(fs.readFileSync(file, 'utf8'), broken, 'the file is left as it is');
  assert.equal(await newItem(dir, 'Next'), 'WI-004', 'no id is used up');
  fs.writeFileSync(file, good);
  const back = await tk(dir, ['work', 'list', '--json']);
  assert.deepEqual(back.json.items.map((i) => i.id), [a, b, 'WI-003', 'WI-004']);
  assert.equal(back.json.changes.missing.length + back.json.changes.adopted.length, 0);
  const all = await tk(dir, ['work', 'list', '--all', '--json']);
  assert.deepEqual(all.json.missing, [], 'no permanent missing item is left behind');
});

test('a WORK-ITEM.md whose id line was deleted by hand keeps its id and says how to fix it', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Reports');
  const file = await recordPath(dir, a);
  editFile(file, 'id: WI-001\n', '');
  const broken = fs.readFileSync(file, 'utf8');
  const r = await tk(dir, ['work', 'sync', '--json']);
  assert.equal(r.code, 0);
  assert.equal(r.json.adopted.length, 0);
  assert.equal(r.json.missing.length, 0);
  assert.ok(r.json.problems.some((p) => p.id === a && /put back the line "id: WI-001"/.test(p.message)));
  assert.equal(fs.readFileSync(file, 'utf8'), broken);
  assert.equal(await newItem(dir, 'Other'), 'WI-002');
});

test('a design the reader cannot read is reported; the item keeps its design value and is not given a second design', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Checkout');
  await tk(dir, ['work', 'design', a, '--create']);
  const design = W(dir, 'WI-001-checkout', 'DESIGN.md');
  editFile(design, 'status: proposed\n', 'status: [proposed\n');
  const r = await tk(dir, ['work', 'show', a]);
  assert.equal(r.code, 2, 'show reads the design, which cannot be read');
  assert.match(r.stderr, /The design of WI-001 cannot be read/);
  const sync = await tk(dir, ['work', 'sync', '--json']);
  assert.ok(sync.json.problems.some((p) => p.location === '.work-items/WI-001-checkout/DESIGN.md'));
  assert.equal(sync.json.derived.filter((d) => d.field === 'design').length, 0, 'design is not set to none');
  const create = await tk(dir, ['work', 'design', a, '--create']);
  assert.equal(create.code, 2);
  assert.equal(fs.readdirSync(W(dir, 'WI-001-checkout')).filter((n) => n.startsWith('DESIGN')).length, 1, 'no second design file');
  assert.equal(parseDoc(fs.readFileSync(await recordPath(dir, a), 'utf8')).meta.design, 'proposed');
});

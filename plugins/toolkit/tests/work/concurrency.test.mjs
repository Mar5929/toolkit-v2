// Parallel sessions (critique B1): five `toolkit work new` processes at once
// must get five different ids, and the state file must keep every one.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tkProcess, tk, readState, trackerDir } from './helpers.mjs';
import { parseDoc } from '../../lib/work/model.mjs';
import { readDecisions } from '../../lib/work/decisions.mjs';

after(cleanup);

test('5 concurrent work new processes get 5 different ids', async () => {
  const dir = makeProject();
  const runs = await Promise.all([1, 2, 3, 4, 5].map((n) => tkProcess(dir, ['work', 'new', '--title', `Parallel ${n}`, '--json'])));
  for (const r of runs) assert.equal(r.code, 0, r.stderr || r.stdout);
  const ids = runs.map((r) => JSON.parse(r.stdout).id).sort();
  assert.deepEqual(ids, ['WI-001', 'WI-002', 'WI-003', 'WI-004', 'WI-005']);
  const state = readState(dir);
  assert.equal(state.highWater, 5);
  assert.deepEqual(Object.keys(state.items).sort(), ids);
  const folders = fs.readdirSync(trackerDir(dir)).filter((n) => /^WI-\d+/.test(n));
  assert.equal(folders.length, 5);
  for (const f of folders) {
    const doc = parseDoc(fs.readFileSync(path.join(trackerDir(dir), f, 'WORK-ITEM.md'), 'utf8'));
    assert.ok(f.startsWith(doc.meta.id), `${f} holds ${doc.meta.id}`);
  }
  assert.equal(fs.existsSync(path.join(trackerDir(dir), '.lock')), false, 'the lock is released');
  const list = await tk(dir, ['work', 'list', '--json']);
  assert.equal(list.json.items.length, 5);
  assert.equal(list.json.changes.moves.length + list.json.changes.adopted.length + list.json.changes.renumbered.length, 0, 'no leftovers to reconcile');
  const dash = fs.readFileSync(path.join(trackerDir(dir), 'DASHBOARD.md'), 'utf8');
  for (const id of ids) assert.match(dash, new RegExp(`\\| ${id} \\|`));
});

test('parallel writers to one item and parallel syncs keep every change', async () => {
  const dir = makeProject();
  const first = await tkProcess(dir, ['work', 'new', '--title', 'Shared', '--json']);
  const id = JSON.parse(first.stdout).id;
  const notes = ['Note A', 'Note B', 'Note C', 'Note D', 'Note E'];
  const runs = await Promise.all([
    ...notes.map((n) => tkProcess(dir, ['work', 'history', id, '--note', n])),
    tkProcess(dir, ['work', 'set', id, '--priority', 'high']),
    tkProcess(dir, ['work', 'sync']),
    tkProcess(dir, ['work', 'sync']),
  ]);
  for (const r of runs) assert.equal(r.code, 0, r.stderr);
  const doc = fs.readFileSync(path.join(trackerDir(dir), 'WI-001-shared', 'WORK-ITEM.md'), 'utf8');
  for (const n of notes) assert.match(doc, new RegExp(`\\| ${n} \\|`));
  assert.match(doc, /^priority: high$/m);
});

test('5 concurrent decision add processes get 5 different ids', async () => {
  const dir = makeProject();
  const runs = await Promise.all([1, 2, 3, 4, 5].map((n) => tkProcess(dir, ['decision', 'add', '--decision', `Decision ${n}`, '--why', 'Test', '--by', 'Mike', '--json'])));
  for (const r of runs) assert.equal(r.code, 0, r.stderr || r.stdout);
  const ids = runs.map((r) => JSON.parse(r.stdout).id).sort();
  assert.deepEqual(ids, ['D-1', 'D-2', 'D-3', 'D-4', 'D-5']);
  const rows = readDecisions(fs.readFileSync(path.join(dir, 'DECISIONS.md'), 'utf8'));
  assert.equal(rows.length, 5);
});

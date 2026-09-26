import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, tkProcess, TODAY, git } from './helpers.mjs';
import { readDecisions, findDecisionsTable, decisionNumber, decisionsLockPlace } from '../../lib/work/decisions.mjs';

after(cleanup);

test('decision add creates DECISIONS.md and numbers rows D-1, D-2', async () => {
  const dir = makeProject();
  const r1 = await tk(dir, ['decision', 'add', '--decision', 'Use Postgres', '--why', 'One database for everything', '--by', 'Mike', '--json']);
  assert.equal(r1.code, 0, r1.stdout);
  assert.equal(r1.json.id, 'D-1');
  assert.equal(r1.json.created, true);
  const r2 = await tk(dir, ['decision', 'add', '--decision', 'Use SQLite | for tests', '--why', 'Speed', '--by', 'Mike', '--replaces', 'D-1']);
  assert.equal(r2.code, 0, r2.stderr);
  const text = fs.readFileSync(path.join(dir, 'DECISIONS.md'), 'utf8');
  assert.match(text, /^# Decisions/);
  const rows = readDecisions(text);
  assert.deepEqual(rows.map((r) => r.id), ['D-1', 'D-2']);
  assert.equal(rows[1].decision, 'Use SQLite | for tests', 'pipes are escaped and read back');
  assert.equal(rows[1].replaces, 'D-1');
  assert.equal(rows[0].date, TODAY);
  const list = await tk(dir, ['decision', 'list']);
  assert.match(list.stdout, /^D-1 \(\d{4}-\d{2}-\d{2}, Mike\): Use Postgres$/m);
});

test('decision add checks its input', async () => {
  const dir = makeProject();
  assert.equal((await tk(dir, ['decision', 'add', '--decision', 'X', '--by', 'Mike'])).code, 2, '--why required');
  assert.equal((await tk(dir, ['decision', 'add', '--decision', 'X', '--why', 'Y', '--by', 'Mike', '--replaces', 'D-9'])).code, 2, 'unknown replaces');
  assert.equal((await tk(dir, ['decision', 'nope'])).code, 2);
});

test('decision add appends to an existing file with its own text and a template row', async () => {
  const dir = makeProject();
  fs.writeFileSync(path.join(dir, 'DECISIONS.md'), '# Decisions\n\nIntro text Mike wrote.\n\n| ID | Date | Decision | Why | Decided by | Replaces |\n|---|---|---|---|---|---|\n| <D-n> | <YYYY-MM-DD> | <Decision> | <Why> | <Name> | <D-n or blank> |\n\n## Notes\n\nKeep this.\n');
  const r = await tk(dir, ['decision', 'add', '--decision', 'Ship weekly', '--why', 'Rhythm', '--by', 'Mike', '--json']);
  assert.equal(r.json.id, 'D-1');
  const text = fs.readFileSync(path.join(dir, 'DECISIONS.md'), 'utf8');
  assert.match(text, /Intro text Mike wrote\./);
  assert.match(text, /## Notes\n\nKeep this\.\n$/);
  assert.doesNotMatch(text, /<Decision>/, 'the template row is replaced');
  assert.equal(readDecisions(text).length, 1);
  assert.ok(findDecisionsTable(text));
  assert.equal(decisionNumber('D7'), 7);
  assert.equal(decisionNumber('D-007'), 7);
});

function addWorktree(main, name) {
  const wt = path.join(path.dirname(main), `${path.basename(main)}-${name}`);
  git(main, ['worktree', 'add', '-q', '-b', name, wt]);
  return fs.realpathSync(wt);
}

test('decision add in two worktrees at the same time gives two different ids', async () => {
  const main = makeProject({ commit: true });
  const a = addWorktree(main, 'wt-a');
  const b = addWorktree(main, 'wt-b');
  try {
    const runs = await Promise.all([
      tkProcess(a, ['decision', 'add', '--decision', 'From A', '--why', 'Test', '--by', 'Mike', '--json']),
      tkProcess(b, ['decision', 'add', '--decision', 'From B', '--why', 'Test', '--by', 'Mike', '--json']),
    ]);
    for (const r of runs) assert.equal(r.code, 0, r.stderr || r.stdout);
    const ids = runs.map((r) => JSON.parse(r.stdout).id).sort();
    assert.deepEqual(ids, ['D-1', 'D-2']);
    assert.equal(readDecisions(fs.readFileSync(path.join(a, 'DECISIONS.md'), 'utf8')).length, 1);
    assert.equal(readDecisions(fs.readFileSync(path.join(b, 'DECISIONS.md'), 'utf8')).length, 1);
    const later = await tk(main, ['decision', 'add', '--decision', 'From main', '--why', 'Test', '--by', 'Mike', '--json']);
    assert.equal(later.json.id, 'D-3', 'one after the other, uncommitted rows in other worktrees count');
    for (const d of [main, a, b]) {
      assert.equal(fs.existsSync(path.join(d, '.toolkit-decisions.lock')), false, 'no lock file in any working tree');
    }
    const place = decisionsLockPlace(a);
    assert.equal(place.shared, true);
    assert.equal(place.dir, path.join(fs.realpathSync(path.join(main, '.git')), 'toolkit-v2'));
    assert.equal(JSON.parse(fs.readFileSync(place.stateFile, 'utf8')).highWater, 3);
  } finally {
    git(main, ['worktree', 'remove', '--force', a]);
    git(main, ['worktree', 'remove', '--force', b]);
  }
});

test('a decision id is never given twice, even after its row is removed by hand', async () => {
  const dir = makeProject();
  const r1 = await tk(dir, ['decision', 'add', '--decision', 'First', '--why', 'Test', '--by', 'Mike', '--json']);
  assert.equal(r1.json.id, 'D-1');
  fs.rmSync(path.join(dir, 'DECISIONS.md'));
  const r2 = await tk(dir, ['decision', 'add', '--decision', 'Second', '--why', 'Test', '--by', 'Mike', '--json']);
  assert.equal(r2.json.id, 'D-2');
});

// Worktrees (ARCHITECTURE 4.3, critique I4): the tracker lives in the main
// checkout and every linked worktree reads and writes it there. A branch named
// wi-007-<slug> (or containing WI-007) ties the worktree to that item.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, git, trackerDir } from './helpers.mjs';
import { itemIdFromBranch, currentBranch } from '../../lib/work/state.mjs';

after(cleanup);

test('branch names tie a worktree to an item', () => {
  assert.equal(itemIdFromBranch('wi-007-login-page'), 'WI-007');
  assert.equal(itemIdFromBranch('feature/WI-12-search'), 'WI-012');
  assert.equal(itemIdFromBranch('issue-7-login'), null);
  assert.equal(itemIdFromBranch('wi-0070x'), null);
  assert.equal(itemIdFromBranch('main'), null);
  assert.equal(itemIdFromBranch('acme-3-thing', 'ACME'), 'ACME-003');
});

test('a linked worktree uses the main checkout tracker and knows its own item', async () => {
  const main = makeProject({ commit: true });
  const a = await newItem(main, 'Login page', ['--stage', '08']);
  await newItem(main, 'Search', ['--stage', '08', '--priority', 'urgent']);
  const wt = path.join(path.dirname(main), `${path.basename(main)}-wi-001`);
  git(main, ['worktree', 'add', '-q', '-b', 'wi-001-login-page', wt]);
  try {
    assert.equal(currentBranch(wt), 'wi-001-login-page');
    assert.equal(fs.existsSync(path.join(wt, '.work-items')), false, 'the worktree has no tracker of its own');
    const created = await tk(wt, ['work', 'new', '--title', 'From the worktree', '--json']);
    assert.equal(created.code, 0, created.stdout);
    assert.equal(created.json.id, 'WI-003');
    assert.ok(created.json.path.startsWith(trackerDir(main)), 'written in the main checkout');
    assert.equal(fs.existsSync(path.join(wt, '.work-items')), false);
    const show = await tk(wt, ['work', 'show', a, '--path']);
    assert.equal(show.stdout.trim(), path.join(trackerDir(main), 'WI-001-login-page', 'WORK-ITEM.md'));
    const list = await tk(wt, ['work', 'list']);
    assert.match(list.stdout, /This worktree \(branch wi-001-login-page\) works on WI-001\./);
    const next = await tk(wt, ['work', 'next', '--json']);
    assert.equal(next.json.next.id, a, 'the worktree item comes first, ahead of an urgent item');
    assert.match(next.json.reason, /wi-001-login-page/);
    const fromMain = await tk(main, ['work', 'next', '--json']);
    assert.equal(fromMain.json.next.id, 'WI-002');
    const dec = await tk(wt, ['decision', 'add', '--decision', 'Use Postgres', '--why', 'One database', '--by', 'Mike', '--json']);
    assert.equal(dec.code, 0);
    assert.equal(dec.json.file, path.join(fs.realpathSync(wt), 'DECISIONS.md'), 'DECISIONS.md is a committed file in this checkout');
  } finally {
    git(main, ['worktree', 'remove', '--force', wt]);
  }
});

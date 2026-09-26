// workSummary(): the work-item part of the session briefing.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, trackerDir } from './helpers.mjs';
import { workSummary, reportLines } from '../../lib/work/report.mjs';
import { requireProject } from '../../lib/core/config.mjs';

after(cleanup);

test('workSummary gives active items with their next skill, owner decisions, moves, and counts', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Building', ['--stage', '08']);
  await tk(dir, ['work', 'edit', a, '--label', 'Next action', '--value', 'Write the parser (agent).']);
  const b = await newItem(dir, 'Waiting', ['--stage', '04']);
  await tk(dir, ['work', 'set', b, '--waiting-on', 'owner']);
  await newItem(dir, 'Later');
  fs.renameSync(path.join(trackerDir(dir), 'WI-003-later'), path.join(trackerDir(dir), 'later-renamed'));
  const s = await workSummary(requireProject(dir), { cwd: dir, sync: 'full' });
  assert.equal(s.tracker, 'local');
  assert.equal(s.unsupported, false);
  assert.equal(s.report.moves[0].id, 'WI-003');
  assert.match(s.reportLines[0], /^Renamed folder: WI-003/);
  const act = new Map(s.active.map((x) => [x.id, x]));
  assert.equal(act.get(a).continueWith, 'work-on');
  assert.equal(act.get(a).nextAction, 'Write the parser (agent).');
  assert.equal(act.get(b).continueWith, 'work-decide');
  assert.ok(s.waitingOnOwner.some((d) => d.id === b && d.kind === 'waiting_on_owner'));
  assert.equal(s.next.id, a);
  assert.deepEqual(s.counts, { backlog: 1, ready: 0, inProgress: 2, inReview: 0, done: 0, cancelled: 0, archived: 0 });
  const quick = await workSummary(requireProject(dir), { cwd: dir });
  assert.equal(quick.report.moves.length, 0, 'the quick check finds nothing new');
});

test('workSummary fails open for trackers the toolkit does not drive', async () => {
  const dir = makeProject({ tracker: 'github' });
  const s = await workSummary(requireProject(dir), { cwd: dir });
  assert.equal(s.unsupported, true);
  assert.match(s.message, /references\/trackers\/github\.md/);
  assert.deepEqual(reportLines(null), []);
});

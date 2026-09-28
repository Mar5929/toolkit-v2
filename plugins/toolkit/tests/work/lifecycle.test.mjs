import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STAGES, STATUSES, TYPE_IDS, findStage, normalizeStage, stageNumber, statusForStage, stageShort, continueWith,
  typeNeedsRequirements, normalizeWaitingOn, parseApproval, isApproved, formatApproval, lifecycleData, normalizeStatus,
  normalizePriority, normalizeDelivery, isValidType, isKnownType, FIELD_ORDER, brokenGates,
} from '../../lib/work/lifecycle.mjs';

test('there are fourteen stages in order, each with a plain label and a continuing skill', () => {
  assert.equal(STAGES.length, 14);
  STAGES.forEach((s, i) => {
    assert.equal(s.n, i + 1);
    assert.match(s.id, /^\d{2}-[a-z-]+$/);
    assert.ok(s.label.endsWith('.'));
    assert.ok(s.next.length >= 1);
  });
  assert.deepEqual(STATUSES, ['Backlog', 'Ready', 'In Progress', 'In Review', 'Done', 'Cancelled']);
});

test('status follows stage: 01-02 Backlog, 03 Ready, 04-11 In Progress, 12-14 In Review', () => {
  for (const s of STAGES) {
    const want = s.n <= 2 ? 'Backlog' : s.n === 3 ? 'Ready' : s.n <= 11 ? 'In Progress' : 'In Review';
    assert.equal(statusForStage(s.id), want, s.id);
  }
  assert.equal(statusForStage('no-such-stage'), null);
});

test('the continuing skill per stage matches the skill index', () => {
  const want = {
    1: 'work-requirements', 2: 'work-requirements', 3: 'solution-design', 4: 'solution-design', 5: 'work-organize',
    6: 'work-on', 7: 'work-on', 8: 'work-on', 9: 'work-check', 10: 'work-check', 11: 'work-check',
    12: 'work-finish', 13: 'work-finish', 14: 'work-finish',
  };
  for (const s of STAGES) assert.equal(continueWith({ stage: s.id, status: s.status }), want[s.n], s.id);
  assert.deepEqual(findStage('03').next, ['solution-design', 'work-on']);
  assert.equal(continueWith({ stage: '08-build', status: 'In Progress', waiting_on: 'owner' }), 'work-decide');
  const approved = '2026-09-20 by Mike';
  // A finished item continues with nothing (sample runs a and d, round 3: "Continue with: work-finish" on Done items).
  assert.equal(continueWith({ stage: '08-build', status: 'Done', result_approved: approved }), 'nothing (finished)');
  assert.equal(continueWith({ stage: '08-build', status: 'Done', waiting_on: 'owner', result_approved: approved }), 'nothing (finished)');
  assert.equal(continueWith({ stage: '08-build', status: 'Cancelled' }), 'nothing (finished)');
});

test('an item that breaks an approval gate continues with work-decide, not with building', () => {
  const build = { type: 'build', stage: '08-build', status: 'In Progress', requirements_approved: 'no', waiting_on: 'none' };
  assert.deepEqual(brokenGates(build), ['requirements_not_approved']);
  assert.equal(continueWith(build), 'work-decide');
  assert.equal(continueWith({ ...build, requirements_approved: '2026-09-20 by Mike' }), 'work-on');
  assert.equal(continueWith({ ...build, type: 'task' }), 'work-on', 'a task has no requirements gate');
  assert.equal(continueWith({ ...build, stage: '02-refinement', status: 'Backlog' }), 'work-requirements', 'before 03 there is no gate');
  const doneByHand = { type: 'task', stage: '08-build', status: 'Done', result_approved: 'no' };
  assert.deepEqual(brokenGates(doneByHand), ['done_without_result_approval']);
  assert.equal(continueWith(doneByHand), 'work-decide');
});

test('stage 11 with the result approval recorded continues with work-finish', () => {
  const item = { type: 'task', stage: '11-user-approval', status: 'In Progress', result_approved: 'no', waiting_on: 'none' };
  assert.equal(continueWith(item), 'work-check');
  assert.equal(continueWith({ ...item, result_approved: '2026-09-26 by Mike' }), 'work-finish');
});

test('stages are found by number, name, or id', () => {
  assert.equal(normalizeStage('8'), '08-build');
  assert.equal(normalizeStage('08'), '08-build');
  assert.equal(normalizeStage('build'), '08-build');
  assert.equal(normalizeStage('Bug fixing'), '10-bug-fixing');
  assert.equal(normalizeStage('08-build'), '08-build');
  assert.equal(normalizeStage('requirements-approved'), '03-requirements-approved');
  assert.equal(normalizeStage('08-testing'), null);
  assert.equal(normalizeStage('launch'), null);
  assert.equal(stageNumber('14-spec-update'), 14);
  assert.equal(stageShort('11-user-approval'), '11 User approval');
});

test('only build and data-load need approved requirements', () => {
  assert.deepEqual(TYPE_IDS.filter(typeNeedsRequirements), ['build', 'data-load']);
  assert.ok(isValidType('custom-kind'));
  assert.ok(!isKnownType('custom-kind'));
  assert.ok(!isValidType('Build Thing'));
});

test('field values are normalized', () => {
  assert.equal(normalizeWaitingOn('Owner'), 'owner');
  assert.equal(normalizeWaitingOn('external:Acme IT'), 'external: Acme IT');
  assert.equal(normalizeWaitingOn('external'), null);
  assert.equal(normalizeWaitingOn('bob'), null);
  assert.equal(normalizeStatus('in progress'), 'In Progress');
  assert.equal(normalizePriority('HIGH'), 'high');
  assert.equal(normalizeDelivery('agent led'), 'agent-led');
});

test('approval values are "no" or "YYYY-MM-DD by <name>"', () => {
  assert.deepEqual(parseApproval('no'), { ok: true, approved: false });
  const a = parseApproval('2026-09-26 by Mike Rihm');
  assert.equal(a.approved, true);
  assert.equal(a.by, 'Mike Rihm');
  assert.equal(parseApproval('yes').ok, false);
  assert.equal(isApproved(formatApproval('2026-09-26', 'Mike')), true);
});

test('lifecycleData carries stages, statuses, types, gates, and approval rules', () => {
  const d = lifecycleData();
  assert.equal(d.stages.length, 14);
  assert.equal(d.statuses.length, 6);
  assert.ok(d.types.find((t) => t.type === 'build').needsRequirementsApproval);
  assert.ok(d.gates.some((g) => g.command.includes('--result')));
  assert.ok(d.approvalRules.some((r) => r.includes('never covers merge')));
  assert.deepEqual(FIELD_ORDER.slice(0, 5), ['id', 'title', 'type', 'stage', 'status']);
});

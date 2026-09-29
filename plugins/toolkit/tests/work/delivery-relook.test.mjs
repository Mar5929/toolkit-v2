// Close-out 2026-09-28, finding 3: the small-item rule recorded owner-led
// delivery before the item was planned, and the choice was never looked at
// again after the plan grew and a sub-item was split off. Now:
// - owner-led recorded as a small item before stage 06 gets a note;
// - a split (work new --parent), or an edit that gives the plan a second phase
//   or more than two tasks, prints a note, and toolkit work decisions lists
//   the delivery offer again as the agent's to-do;
// - the new sub-item does not take the parent's small-item owner-led value;
// - once the owner answers the offer, nothing is listed.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { makeProject, cleanup, tk, newItem, approveRequirements, readRecord } from './helpers.mjs';
import { smallItemRecorded, grownReason } from '../../lib/work/decisions.mjs';

after(cleanup);

const SMALL = 'Small item: one or two tasks, so no delivery offer.';

function tasks(n) {
  const lines = ['### P1 — Build', ''];
  for (let i = 1; i <= n; i++) {
    lines.push(`- [ ] **P1-T0${i} — Task ${i}** · Not Started  `, `  **Work:** Step ${i}.  `, '  **Deliverable:** Code.  ', '  **Done when:** Tests pass.  ', '  **Depends on:** None.');
  }
  return lines.join('\n');
}

test('a split after the small-item call lists the delivery offer again; the sub-item waits for it', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await newItem(dir, 'Tip split', ['--type', 'task']);
  await approveRequirements(dir, id, { by: 'Mike Rihm' });
  const set = await tk(dir, ['work', 'set', id, '--delivery', 'owner-led', '--note', SMALL]);
  assert.equal(set.code, 0, set.stderr);
  assert.match(set.stdout, /was recorded owner-led as a small item before its plan exists \(stage 06\)/);
  let d = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(!d.json.agentTodos.some((t) => t.kind === 'delivery_offer'), 'small: no offer');

  const sub = await tk(dir, ['work', 'new', '--title', 'Rounding rule', '--type', 'task', '--parent', id, '--json']);
  assert.equal(sub.code, 0, sub.stderr);
  assert.match(sub.json.notes[0], new RegExp(`^${id} was recorded owner-led as a small item, and now it has the sub-item WI-002\\. Look at the delivery offer again`));
  assert.match(await readRecord(dir, sub.json.id), /^delivery: not-offered$/m, 'the sub-item does not take the small-item value');

  d = await tk(dir, ['work', 'decisions', '--json']);
  const todo = d.json.agentTodos.find((t) => t.kind === 'delivery_offer');
  assert.ok(todo, JSON.stringify(d.json.agentTodos));
  assert.equal(todo.id, id);
  assert.equal(todo.continueWith, 'work-delegate');
  assert.match(todo.what, /now it has 1 sub-item/);

  // The owner answers the offer: owner-led by his choice, not the small-item rule.
  await tk(dir, ['work', 'set', id, '--delivery', 'agent-led', '--note', 'Owner accepted agent-led delivery.']);
  await tk(dir, ['work', 'set', id, '--delivery', 'owner-led', '--note', 'Owner said: no agent team, I will lead it.']);
  d = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(!d.json.agentTodos.some((t) => t.kind === 'delivery_offer'), 'answered: nothing listed');
});

test('a plan with more than two tasks, or a second phase, after the small-item call prints a note', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  const id = await newItem(dir, 'Readme', ['--type', 'task']);
  await approveRequirements(dir, id, { by: 'Mike Rihm' });
  await tk(dir, ['work', 'set', id, '--delivery', 'owner-led', '--note', SMALL]);
  const two = await tk(dir, ['work', 'edit', id, '--section', 'Tasks', '--text', tasks(2)]);
  assert.equal(two.code, 0, two.stderr);
  assert.doesNotMatch(two.stdout, /delivery offer/, 'two tasks is still small');
  const three = await tk(dir, ['work', 'edit', id, '--section', 'Tasks', '--text', tasks(3)]);
  assert.match(three.stdout, /Note: WI-001 was recorded owner-led as a small item, and now its plan has 3 tasks\./);
  const again = await tk(dir, ['work', 'edit', id, '--section', 'Tasks', '--text', `${tasks(3)}\n`]);
  assert.doesNotMatch(again.stdout, /delivery offer/, 'said once, when it grew');
});

test('smallItemRecorded and grownReason', () => {
  const body = (rows, extra = '') => `# WI-001: X\n\n## Recent History\n\n| Date | Change or decision | Effect on the work |\n|---|---|---|\n${rows.map((r) => `| 2026-09-29 | ${r[0]} | ${r[1]} |`).join('\n')}\n${extra}`;
  assert.equal(smallItemRecorded({ meta: { delivery: 'owner-led' }, body: body([['Set delivery owner-led.', SMALL]]) }), true);
  assert.equal(smallItemRecorded({ meta: { delivery: 'owner-led' }, body: body([['Set delivery owner-led.', 'Owner said no agent team.'], ['Set delivery owner-led.', SMALL]]) }), false, 'the newest delivery row counts');
  assert.equal(smallItemRecorded({ meta: { delivery: 'agent-led' }, body: body([['Set delivery owner-led.', SMALL]]) }), false);
  assert.equal(grownReason({ meta: {}, body: '# X\n\n## Tasks\n\n- [ ] **P1-T01 — <Task 1 name>** · Not Started\n- [ ] **P1-T02 — <Task 2 name>**\n- [ ] **P2-T01 — <Task 1 name>**\n' }), null, 'the template\'s example tasks do not count');
  assert.equal(grownReason({ meta: {}, children: [{ id: 'WI-002' }], body: '' }), 'it has 1 sub-item');
});

// The current focus in the model's four-section format, as the session
// briefing reads it (lib/project/brief.mjs and lib/memory/startup.mjs).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { focusItems, focusDropOrder } from '../../lib/project/brief.mjs';
import { briefingText } from '../../lib/memory/startup.mjs';
import { readTemplate } from '../../lib/core/templates.mjs';

const FILLED = [
  '# Current focus',
  '',
  '<!-- Fill-in guide: kept by mistake. -->',
  '',
  'Last updated: `2026-09-26, handoff, agent`',
  '',
  '## Now',
  '',
  '- WI-012 CSV export',
  '- WI-015 Large exports (sub-item of WI-012)',
  '',
  '## Waiting on the owner',
  '',
  '- Pick a hosting provider; check again 2026-10-01.',
  '',
  '## Untracked to-dos',
  '',
  '- `<An unresolved owner request without a work item.>`',
  '',
  '## Next session starts with',
  '',
  '- Continue WI-012 from its Resume here.',
  '',
].join('\n');

test('the briefing shows the four sections with text, without the fill-in guide or prompts', () => {
  assert.deepEqual(focusItems(FILLED), [
    'Last updated: 2026-09-26, handoff, agent',
    '## Now',
    '- WI-012 CSV export',
    '- WI-015 Large exports (sub-item of WI-012)',
    '## Waiting on the owner',
    '- Pick a hosting provider; check again 2026-10-01.',
    '## Next session starts with',
    '- Continue WI-012 from its Resume here.',
  ]);
  // When the briefing is too long, "Last updated" goes first, "Now" and "Next session starts with" last.
  const items = focusItems(FILLED);
  const order = focusDropOrder(items).map((i) => items[i]);
  assert.equal(order[0], 'Last updated: 2026-09-26, handoff, agent');
  assert.ok(order.indexOf('## Waiting on the owner') < order.indexOf('## Now'));
});

test('the model seed focus is reported as not filled in yet, in one line', () => {
  assert.equal(focusItems(readTemplate('memory/CURRENT_FOCUS')), null);
  assert.deepEqual(focusItems(''), []);
  const text = briefingText({ backend: 'builtin', focus: readTemplate('memory/CURRENT_FOCUS'), records: [] });
  assert.match(text, /Current focus: still the empty template from setup\./);
  assert.doesNotMatch(text, /Fill-in guide|<Current outcome/);
});

test('the memory briefing text uses the same reading of the focus', () => {
  const text = briefingText({ backend: 'hindsight', focus: FILLED, records: [{ key: 'user_plain_english', description: 'Plain English replies.', status: 'current' }] });
  assert.match(text, /Current focus:\nLast updated: 2026-09-26, handoff, agent\n## Now\n- WI-012 CSV export/);
  assert.doesNotMatch(text, /Fill-in guide|<An unresolved/);
  assert.match(text, /- user_plain_english: Plain English replies\./);
});

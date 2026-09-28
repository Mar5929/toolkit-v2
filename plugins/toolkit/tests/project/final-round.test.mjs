// Fixes made while the four fix areas were brought together (final fix
// round, 2026-09-28). Each test names the finding it covers.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { cleanup, initProject, tk } from './helpers.mjs';
import { chainedToolkitNote } from '../../lib/hooks/pre-tool.mjs';
import { itemSummary } from '../../lib/work/report.mjs';

after(cleanup);

const FOCUS = [
  '# Current focus',
  '',
  'Last updated: 2026-09-20, set by the agent',
  '',
  '## Now',
  '',
  '- WI-001 Login page: build the form.',
  '',
  '## Waiting on the owner',
  '',
  '- None',
  '',
  '## Untracked to-dos',
  '',
  '- None',
  '',
  '## Next session starts with',
  '',
  '- Record the requirements approval for WI-001.',
  '',
].join('\n');

// The focus command stamps its "Last updated:" line with the real date, and
// the work commands date an item with TOOLKIT_TODAY. The item dates below are
// set far from the real date so both tests hold on any day.
test('bug 6 (local tracker): the briefing says the current focus may be out of date when an open item changed after it', async () => {
  const { root, env } = await initProject();
  const later = { ...env, TOOLKIT_TODAY: '2099-01-02' };
  const run = async (args, e = env) => {
    const r = await tk(root, args, { env: e });
    assert.equal(r.code, 0, `${args.join(' ')}: ${r.stderr || r.stdout}`);
    return r;
  };
  await run(['memory', 'focus', '--text', FOCUS]);
  await run(['work', 'new', '--title', 'Login page', '--type', 'task'], later);
  await run(['work', 'set', 'WI-001', '--stage', '06-implementation-plan'], later);
  const res = await tk(root, ['brief'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /The current focus was last updated \d{4}-\d{2}-\d{2}, before WI-001 changed on 2099-01-02\./);
});

test('bug 6 (local tracker): a current focus saved after the newest item change gets no out-of-date line', async () => {
  const { root, env } = await initProject();
  const earlier = { ...env, TOOLKIT_TODAY: '2000-01-02' };
  await tk(root, ['work', 'new', '--title', 'Login page', '--type', 'task'], { env: earlier });
  await tk(root, ['work', 'set', 'WI-001', '--stage', '06-implementation-plan'], { env: earlier });
  const r = await tk(root, ['memory', 'focus', '--text', FOCUS], { env });
  assert.equal(r.code, 0, r.stderr);
  const res = await tk(root, ['brief'], { env });
  assert.match(res.stdout, /Active items:\n- WI-001 Login page/);
  assert.doesNotMatch(res.stdout, /The current focus was last updated/);
});

test('itemSummary carries the item\'s updated date, and a template placeholder counts as no date', () => {
  assert.equal(itemSummary({ id: 'WI-001', meta: { title: 'A', stage: '06-implementation-plan', status: 'In Progress', updated: '2026-09-26' } }).updated, '2026-09-26');
  assert.equal(itemSummary({ id: 'WI-001', meta: { title: 'A', stage: '01-discovery', status: 'Backlog', updated: '<YYYY-MM-DD>' } }).updated, null);
  assert.equal(itemSummary({ id: 'WI-001', meta: { title: 'A' } }).updated, null);
});

test('the Codex note on a chained toolkit command shows --text in single quotes', () => {
  const note = chainedToolkitNote('toolkit work show WI-001 && git status --short');
  assert.ok(note, 'a chained toolkit command gets the note');
  assert.ok(note.includes("--text '<text>' in single quotes"), note);
  assert.ok(note.includes("In Codex write an apostrophe inside that text as ’ (U+2019), or reword it; never '\\''"), note);
});

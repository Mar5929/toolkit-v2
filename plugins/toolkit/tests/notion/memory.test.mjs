// The Notion memory driver against the fake Notion: the MemoryDriver contract
// in lib/memory/contract.mjs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { NotionClient } from '../../lib/notion/client.mjs';
import { ensureProject } from '../../lib/notion/ensure.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../lib/notion/schema.mjs';
import { createDriver, backend } from '../../lib/memory/notion.mjs';
import { serializeRecord, normalizeRecord, versionOf } from '../../lib/memory/contract.mjs';
import { FakeNotion, fakeRunner, seedProjects } from './fake-notion.mjs';

const now = () => new Date('2026-09-26T12:00:00');
// A day after the fake Notion's edit times, so cached bodies count as safe to use.
const LATER = () => Date.parse('2026-09-27T12:00:00Z');

async function setup({ clock = LATER } = {}) {
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-memory-'));
  const config = {
    toolkit: 'toolkit-v2',
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike' },
    tracker: { type: 'local' },
    memory: { type: 'notion', approval: 'onboarding' },
    notion: {},
  };
  const { notion } = await ensureProject({ client, config, mainRoot: root, rootPageId: fake.rootPageId, now });
  config.notion = notion;
  const driver = await createDriver({ root, mainRoot: root, config, env: process.env, now, client, clock });
  return { fake, client, driver, config, root, clock };
}

const BODY = [
  '**Remember:** Deploys happen only on Tuesday mornings (owner, 2026-09-26).',
  '',
  '**Why:** The on-call person is free then.',
  '',
  '**How to apply:** Check the day before any deploy step. Costs $0 | cheap <for now>.',
  '',
  '**Related:** WI-001 and `docs/deploy.md`.',
  '',
].join('\n');

const INPUT = { type: 'feedback', name: 'deploy-window', description: 'Deploy only on Tuesday mornings', source: 'Mike, 2026-09-26', body: BODY };

test('the driver says it is the notion backend', async () => {
  const { driver } = await setup();
  assert.equal(backend, 'notion');
  assert.equal(driver.backend, 'notion');
  assert.match(driver.location, /Notion Memory database/);
});

test('save then get gives back exactly the text every backend stores', async () => {
  const { driver } = await setup();
  const res = await driver.save(INPUT, { expect: 'absent' });
  assert.equal(res.key, 'feedback_deploy_window');
  assert.equal(res.created, true);
  const got = await driver.get('feedback_deploy_window');
  const expected = serializeRecord(normalizeRecord(INPUT, { today: '2026-09-26' }));
  assert.equal(got.text, expected);
  assert.equal(got.version, versionOf(expected));
  assert.equal(got.version, res.version);
  assert.equal(got.valid, true);
  assert.equal(await driver.get('feedback_missing_one'), null);
});

test('a body wrapped at a fixed width is stored as whole lines; save and get give the same version, and the next save with it works', async () => {
  const { driver, fake } = await setup();
  const wrapped = '**Remember:** Deploys happen only on Tuesday mornings, because the on-call\nperson is free then.\n\n**Why:** Owner, 2026-09-26.\n';
  const res = await driver.save({ ...INPUT, body: wrapped }, { expect: 'absent' });
  const page = Object.values(fake.pages).find((p) => String(p.markdown || '').includes('Tuesday mornings'));
  assert.ok(page, 'the page was written');
  assert.match(page.markdown, /because the on-call person is free then\./, 'Notion holds the sentence on one line');
  assert.doesNotMatch(page.markdown, /<br>/);
  const got = await driver.get('feedback_deploy_window');
  assert.equal(got.version, res.version);
  assert.match(got.text, /because the on-call person is free then\./);
  const again = await driver.save({ ...INPUT, body: wrapped, description: 'Changed' }, { expect: got.version });
  assert.equal(again.created, false);
});

test('a stale expect is refused and changes nothing; the right version saves', async () => {
  const { driver } = await setup();
  const first = await driver.save(INPUT);
  await assert.rejects(driver.save({ ...INPUT, description: 'Changed' }, { expect: 'absent' }), (err) => err.code === 2);
  await assert.rejects(driver.save({ ...INPUT, description: 'Changed' }, { expect: '0000000000000000' }), (err) => err.code === 2);
  assert.equal((await driver.get('feedback_deploy_window')).description, 'Deploy only on Tuesday mornings');
  const second = await driver.save({ ...INPUT, description: 'Changed' }, { expect: first.version });
  assert.equal(second.created, false);
  assert.equal((await driver.get('feedback_deploy_window')).description, 'Changed');
});

test('an invalid record is refused before anything is written', async () => {
  const { driver, fake } = await setup();
  const before = fake.writes().length;
  await assert.rejects(driver.save({ ...INPUT, source: 'mike@example.com' }), (err) => err.code === 2);
  assert.equal(fake.writes().length, before);
});

test('list and find leave retired records out; restore brings one back as needs-review', async () => {
  const { driver } = await setup();
  await driver.save(INPUT);
  await driver.save({ type: 'project', name: 'stack', description: 'The app uses Node 20', source: 'Mike, 2026-09-26', body: '**Remember:** Node 20, no npm packages.\n' });
  assert.deepEqual((await driver.list()).map((r) => r.key), ['feedback_deploy_window', 'project_stack']);
  assert.deepEqual((await driver.list({ type: 'project' })).map((r) => r.key), ['project_stack']);
  const hit = await driver.find('tuesday deploy');
  assert.equal(hit.mode, 'keyword');
  assert.equal(hit.results[0].key, 'feedback_deploy_window');
  const r = await driver.retire('feedback_deploy_window', { reason: 'Replaced.', supersededBy: 'project_stack' });
  assert.equal(r.record.status, 'retired');
  assert.equal(r.record.superseded_by, 'project_stack');
  assert.match(r.record.body, /\*\*Retired 2026-09-26:\*\* Replaced\. Replaced by project_stack\./);
  assert.deepEqual((await driver.list()).map((x) => x.key), ['project_stack']);
  assert.equal((await driver.find('tuesday')).results.length, 0);
  assert.equal((await driver.find('tuesday', { all: true })).results.length, 1);
  const back = await driver.restore('feedback_deploy_window');
  assert.equal(back.record.status, 'needs-review');
  assert.equal(back.record.superseded_by, null);
  await assert.rejects(driver.find('x', { reflect: true }), (err) => err.code === 3);
});

test('find reads each body once and then uses the cache', async () => {
  const { driver, fake } = await setup();
  await driver.save(INPUT);
  await driver.find('tuesday');
  const before = fake.calls.length;
  await driver.find('tuesday');
  const markdownReads = fake.calls.slice(before).filter((c) => c.path.endsWith('/markdown'));
  assert.equal(markdownReads.length, 0);
});

test('delete moves the page to the trash', async () => {
  const { driver, fake } = await setup();
  await driver.save(INPUT);
  const res = await driver.delete('feedback_deploy_window');
  assert.equal(res.key, 'feedback_deploy_window');
  assert.equal(res.deleted, true);
  assert.equal(res.trash, true);
  assert.match(res.detail, /Notion trash.*30 days/);
  assert.equal(await driver.get('feedback_deploy_window'), null);
  assert.ok(Object.values(fake.pages).some((p) => p.in_trash && fake.titleOf(p) === 'feedback_deploy_window'));
  await assert.rejects(driver.delete('feedback_deploy_window'), /no memory record/);
});

test('focus: read the seed, save a new one exactly, refuse a bad one and a stale version', async () => {
  const { driver } = await setup();
  const seed = await driver.focusGet();
  assert.match(seed.text, /^# Current focus\n/);
  assert.match(seed.text, /## Next session starts with/);
  const focus = '# Current focus\n\nUpdated: 2026-09-26\n\n## Now\n\n- WI-001.\n\n## Waiting on the owner\n\n- Pick a day.\n\n## Untracked to-dos\n\n- None.\n\n## Next session starts with\n\n- Read WI-001.\n';
  const res = await driver.focusSet(focus, { expect: seed.version });
  assert.equal(res.lines, 19);
  const back = await driver.focusGet();
  assert.equal(back.text, focus);
  assert.equal(back.version, res.version);
  await assert.rejects(driver.focusSet('# Current focus\n\n## Now\n'), (err) => err.code === 2);
  await assert.rejects(driver.focusSet(focus, { expect: seed.version }), (err) => err.code === 2);
});

test('glossary: a spaced table keeps its style through Notion', async () => {
  const { driver } = await setup();
  const g = '# Terminology glossary\n\n| Term | Meaning |\n| --- | --- |\n| Board | The Work Items board |\n\n## Naming changes and aliases\n\n- Ticket → work item.\n';
  await driver.glossarySet(g);
  const back = await driver.glossaryGet();
  assert.equal(back.text, g);
});

test('status and reindex report counts and problems', async () => {
  const { driver, client, config } = await setup();
  await driver.save(INPUT);
  await client.createPage({ parent: { type: 'data_source_id', data_source_id: config.notion.memory.dataSourceId }, properties: { title: { title: [{ type: 'text', text: { content: 'not a key' } }] } } });
  const s = await driver.status();
  assert.equal(s.healthy, true);
  assert.equal(s.counts.current, 1);
  assert.equal(s.problems.length, 1);
  assert.match(s.problems[0].problem, /not <type>_<slug>/);
  const r = await driver.reindex();
  assert.equal(r.count, 1);
});

test('an unreachable Notion is reported by status, not thrown', async () => {
  const { config, root } = await setup();
  const runner = async () => ({ code: 5, stdout: '', stderr: 'error: Public API request failed (503 Service Unavailable service_unavailable): down' });
  const client = new NotionClient({ rootPageId: config.notion.rootPageId, runner, minIntervalMs: 0, maxRetries: 0 });
  const driver = await createDriver({ root, mainRoot: root, config, now, client });
  const s = await driver.status();
  assert.equal(s.healthy, false);
  assert.match(s.detail, /not reachable/);
});

test('a missing Memory setup is a clear error', async () => {
  await assert.rejects(createDriver({ root: '/x', mainRoot: '/x', config: { notion: {} } }), (err) => /ensure-project/.test(err.details.fix));
});

// ------------------------------------------------------------------ same-minute edits, locks, and concurrent edits

function pageOf(fake, key) {
  return Object.values(fake.pages).find((p) => !p.in_trash && fake.titleOf(p) === key);
}

test('an edit in Notion that keeps the same last-edited minute is seen by get, find, and reindex', async () => {
  let fakeRef = null;
  // "Now" is 30 seconds after Notion's latest write: the same minute as that write.
  const { driver, fake } = await setup({ clock: () => (fakeRef ? fakeRef.clock + 30 * 1000 : LATER()) });
  fakeRef = fake;
  await driver.save(INPUT);
  await driver.find('tuesday'); // the cache now holds the body
  const page = pageOf(fake, 'feedback_deploy_window');
  const edited = page.last_edited_time;
  // Mike edits the body in the same minute: last_edited_time does not move.
  page.markdown = page.markdown.replace('Tuesday mornings', 'Wednesday mornings NEWWORD');
  assert.equal(page.last_edited_time, edited);
  assert.equal((await driver.find('newword')).results.length, 1, 'find reads a body read in the same minute as the edit again');
  page.markdown = page.markdown.replace('NEWWORD', 'OTHERWORD');
  assert.match((await driver.get('feedback_deploy_window')).body, /OTHERWORD/, 'get reads the body from Notion');
  page.markdown = page.markdown.replace('OTHERWORD', 'THIRDWORD');
  const r = await driver.reindex();
  assert.equal(r.changed, 1);
  const cache = JSON.parse(fs.readFileSync(path.join(driver.cacheRoot, '.toolkit-cache', 'notion', 'memory.json'), 'utf8'));
  assert.match(cache.records.feedback_deploy_window.body, /THIRDWORD/, 'reindex reads every body from Notion');
  // The version get() gives is the one a save with --expect needs.
  const current = await driver.get('feedback_deploy_window');
  const saved = await driver.save({ ...INPUT, description: 'Changed' }, { expect: current.version });
  assert.equal(saved.created, false);
});

test('a cached body is used by find only when it was read two minutes or more after the last edit', async () => {
  let t = LATER();
  const { driver, fake } = await setup({ clock: () => t });
  await driver.save(INPUT);
  const page = pageOf(fake, 'feedback_deploy_window');
  t = Date.parse(page.last_edited_time) + 10 * 60 * 1000;
  await driver.find('tuesday');
  let before = fake.calls.length;
  await driver.find('tuesday');
  assert.equal(fake.calls.slice(before).filter((c) => c.path.endsWith('/markdown')).length, 0, 'safe cache entry is used');
  t = Date.parse(page.last_edited_time) + 60 * 1000;
  const fresh = await driver.get('feedback_deploy_window'); // read again within two minutes of the edit
  assert.ok(fresh);
  before = fake.calls.length;
  await driver.find('tuesday');
  assert.equal(fake.calls.slice(before).filter((c) => c.path.endsWith('/markdown')).length, 1, 'an entry read too soon is read again');
});

test('a stale --expect refusal still writes the fresh text to the cache', async () => {
  const { driver, fake } = await setup();
  const first = await driver.save(INPUT);
  const page = pageOf(fake, 'feedback_deploy_window');
  page.markdown = page.markdown.replace('Tuesday mornings', 'Friday mornings');
  await assert.rejects(driver.save({ ...INPUT, description: 'Changed' }, { expect: first.version }), (err) => err.code === 2);
  const cache = JSON.parse(fs.readFileSync(path.join(driver.cacheRoot, '.toolkit-cache', 'notion', 'memory.json'), 'utf8'));
  assert.match(cache.records.feedback_deploy_window.body, /Friday mornings/);
});

test('two saves of the same new key at the same time make one row; the second is refused', async () => {
  const { driver, client, config, root, fake } = await setup();
  const other = await createDriver({ root, mainRoot: root, config, now, client, clock: LATER });
  const results = await Promise.allSettled([
    driver.save(INPUT, { expect: 'absent' }),
    other.save({ ...INPUT, description: 'The other one' }, { expect: 'absent' }),
  ]);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
  const refused = results.find((r) => r.status === 'rejected');
  assert.equal(refused.reason.code, 2);
  const rows = Object.values(fake.pages).filter((p) => !p.in_trash && p.parent && p.parent.data_source_id === config.notion.memory.dataSourceId);
  assert.equal(rows.length, 1);
  assert.deepEqual((await driver.status()).problems, []);
});

test('an edit made in Notion after the --expect check, in another section, is kept', async () => {
  const body = '## One\n\nFirst part.\n\n## Two\n\nSecond part.\n';
  const input = { type: 'project', name: 'parts', description: 'Two parts', source: 'Mike, 2026-09-26', body };
  const fake0 = { armed: false, reads: 0 };
  const { driver, fake, client } = await setup();
  const first = await driver.save(input);
  const page = pageOf(fake, 'project_parts');
  // Mike edits section Two between the toolkit's check read and its write.
  const runner = client.runner;
  client.runner = async (args, opts) => {
    if (fake0.armed && args[1] === `v1/pages/${page.id}/markdown` && args.includes('GET')) {
      fake0.reads += 1;
      if (fake0.reads === 2) page.markdown = page.markdown.replace('Second part.', 'Second part, edited by Mike.');
    }
    return runner(args, opts);
  };
  fake0.armed = true;
  const res = await driver.save({ ...input, body: body.replace('First part.', 'First part, changed by the agent.') }, { expect: first.version });
  fake0.armed = false;
  assert.match(res.record.body, /First part, changed by the agent\./);
  assert.match(res.record.body, /Second part, edited by Mike\./);
});

test('an edit made in Notion after the --expect check, in the same section, is a conflict and saves nothing', async () => {
  const body = '## One\n\nFirst part.\n\n## Two\n\nSecond part.\n';
  const input = { type: 'project', name: 'parts', description: 'Two parts', source: 'Mike, 2026-09-26', body };
  const state = { armed: false, reads: 0 };
  const { driver, fake, client } = await setup();
  const first = await driver.save(input);
  const page = pageOf(fake, 'project_parts');
  const runner = client.runner;
  client.runner = async (args, opts) => {
    if (state.armed && args[1] === `v1/pages/${page.id}/markdown` && args.includes('GET')) {
      state.reads += 1;
      if (state.reads === 2) page.markdown = page.markdown.replace('First part.', 'First part by Mike.');
    }
    return runner(args, opts);
  };
  state.armed = true;
  const writes = () => fake.writes().filter((c) => c.path.includes(page.id)).length;
  const before = writes();
  await assert.rejects(
    driver.save({ ...input, description: 'Changed', body: body.replace('First part.', 'First part by the agent.') }, { expect: first.version }),
    (err) => err.code === 2 && /nothing was saved/.test(err.message),
  );
  state.armed = false;
  assert.equal(writes(), before, 'no property or body write was made');
});

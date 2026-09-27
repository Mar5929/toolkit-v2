// Hindsight client, bank setup, memory driver, and commands against the live
// local server (http://127.0.0.1:8888). Every bank these tests use is named
// tkv2-test-..., and only those banks are deleted at the end.
// When the server is not running, every test here is skipped.
// The find --reflect test is slow (about 20 to 30 seconds): it runs only when
// TOOLKIT_SLOW=1 is set.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { HindsightClient, DEFAULT_URL } from '../../lib/hindsight/client.mjs';
import { ensureBank, bankOwner, READ_ONLY_MCP_TOOLS, PLAIN_ENGLISH, settingsProblems } from '../../lib/hindsight/bank.mjs';
import { createDriver } from '../../lib/memory/hindsight.mjs';
import { serializeRecord, normalizeRecord, versionOf, FOCUS_SECTIONS } from '../../lib/memory/contract.mjs';
import { memoryBriefing, cachePath } from '../../lib/memory/startup.mjs';
import { requireProject } from '../../lib/core/config.mjs';
import { EXIT } from '../../lib/core/output.mjs';
import { body, cleanup, makeProject, runToolkit, tempDir } from '../memory/helpers.mjs';

const client = new HindsightClient({ url: DEFAULT_URL });
const createdBanks = new Set();
let up = false;
let skipReason = '';

before(async () => {
  try {
    const h = await client.health({ timeoutMs: 2000 });
    up = h && h.status === 'healthy';
    if (!up) skipReason = `Hindsight answered but is not healthy: ${JSON.stringify(h)}`;
  } catch (err) {
    skipReason = `Hindsight is not running at ${DEFAULT_URL}: ${err.message}`;
  }
});

after(async () => {
  for (const bank of createdBanks) {
    if (!bank.startsWith('tkv2-test-')) continue;
    try {
      await client.deleteBank(bank);
    } catch {
      // Reported by the leftover check below when it matters.
    }
  }
  cleanup();
});

function newBankId(label) {
  const id = `tkv2-test-${label}-${crypto.randomBytes(3).toString('hex')}`;
  createdBanks.add(id);
  createdBanks.add(`${id}-2`);
  return id;
}

function skipIfDown(t) {
  if (!up) {
    t.skip(skipReason);
    return true;
  }
  return false;
}

const FOCUS = `# Current focus\n\n${FOCUS_SECTIONS.map((h) => `## ${h}\n\n- WI-003\n`).join('\n')}`;

function rec(name, extra = {}) {
  return { type: 'project', name, description: `About ${name}.`, source: 'Mike in chat, 2026-09-26', body: body(`The ${name} fact is kept here.`), ...extra };
}

async function projectWithBank(label) {
  const bank = newBankId(label);
  await ensureBank({ client, bank, projectKey: bank, claimed: true });
  const { root } = makeProject({ memory: { type: 'hindsight' }, hindsight: { url: DEFAULT_URL, bank }, key: bank });
  const project = requireProject(root);
  const driver = await createDriver({ root: project.root, mainRoot: project.mainRoot, config: project.config });
  return { root, project, driver, bank };
}

test('client: health, version, and a 404 for a bank that does not exist', async (t) => {
  if (skipIfDown(t)) return;
  const h = await client.health();
  assert.equal(h.status, 'healthy');
  const v = await client.version();
  assert.match(v.api_version, /^\d+\.\d+\.\d+$/);
  const id = newBankId('absent');
  assert.equal(await client.getBankConfig(id), null);
  assert.equal(await client.bankExists(id), false);
  assert.equal(await client.forBank(id).getDocument('project_x'), null);
  const unreachable = new HindsightClient({ url: 'http://127.0.0.1:9', timeoutMs: 1000 });
  await assert.rejects(unreachable.health(), (err) => err.code === EXIT.ERROR && err.details.unreachable === true);
});

test('ensureBank creates a free bank with the toolkit settings and is safe to run again', async (t) => {
  if (skipIfDown(t)) return;
  const bank = newBankId('ensure');
  const first = await ensureBank({ client, bank, projectKey: bank, projectName: 'Ensure test' });
  assert.equal(first.bank, bank);
  assert.equal(first.created, true);
  const cfg = await client.getBankConfig(bank);
  assert.equal(cfg.config.retain_extraction_mode, 'chunks');
  assert.equal(cfg.config.enable_observations, false);
  assert.deepEqual([...cfg.config.mcp_enabled_tools].sort(), [...READ_ONLY_MCP_TOOLS].sort());
  assert.deepEqual(settingsProblems(cfg), []);
  assert.equal(bankOwner(cfg), bank);
  assert.ok(cfg.config.reflect_mission.endsWith(PLAIN_ENGLISH), cfg.config.reflect_mission);

  // Run again for the project that .toolkit.json now names: nothing to do.
  const again = await ensureBank({ client, bank, projectKey: bank, claimed: true });
  assert.equal(again.created, false);
  assert.equal(again.relation, 'this-project');
  assert.deepEqual(again.changed, []);

  // Someone changed settings: the next run puts only those back.
  await client.patchBankConfig({ retain_extraction_mode: 'concise', reflect_mission: 'Project memory.' }, bank);
  assert.equal(settingsProblems(await client.getBankConfig(bank)).length, 2);
  const repaired = await ensureBank({ client, bank, projectKey: bank, claimed: true });
  assert.deepEqual(repaired.changed.sort(), ['reflect_mission', 'retain_extraction_mode']);
  assert.equal((await client.getBankConfig(bank)).config.reflect_mission, `Project memory. ${PLAIN_ENGLISH}`);

  // The same project key without a claim (init run again after .toolkit.json was lost)
  // gets its own bank back.
  const reused = await ensureBank({ client, bank, projectKey: bank });
  assert.equal(reused.bank, bank);
  assert.equal(reused.created, false);
  assert.equal(reused.relation, 'this-project');

  // Another project key wanting the same id gets the next free one.
  const other = await ensureBank({ client, bank, projectKey: `${bank}-other` });
  assert.equal(other.bank, `${bank}-2`);
  assert.equal(other.created, true);
  assert.deepEqual(other.skipped.map((s) => s.bank), [bank]);

  // .toolkit.json naming a bank made for another key is refused.
  await assert.rejects(ensureBank({ client, bank, projectKey: 'someone-else', claimed: true }), (err) => err.code === EXIT.INVALID && /made for the project/.test(err.message));
});

test('driver: save stores the exact text; get, list, and find return it', async (t) => {
  if (skipIfDown(t)) return;
  const { driver, bank } = await projectWithBank('driver');
  const r = normalizeRecord(rec('payments-api', { approved_by: 'Mike' }));
  const saved = await driver.save(r, { expect: 'absent' });
  assert.equal(saved.created, true);
  const doc = await client.forBank(bank).getDocument('project_payments_api');
  assert.equal(doc.original_text, serializeRecord(r));
  assert.equal(doc.content_hash, saved.version, 'version is the SHA-256 the server reports');
  assert.deepEqual([...doc.tags].sort(), ['kind:record', 'status:current', 'type:project']);
  assert.equal(doc.document_metadata.approved_by, 'Mike');

  const got = await driver.get('project_payments_api');
  assert.equal(got.text, serializeRecord(r));
  assert.equal(got.version, versionOf(got.text));
  assert.equal(got.valid, true);
  assert.equal(await driver.get('project_missing'), null);

  await driver.save(rec('deploy-window', { type: 'feedback', description: 'Deploys only on Tuesday mornings.' }));
  const list = await driver.list();
  assert.deepEqual(list.map((x) => x.key), ['feedback_deploy_window', 'project_payments_api']);
  assert.equal(list[1].approved_by, 'Mike');
  const found = await driver.find('When may we deploy?');
  assert.equal(found.mode, 'recall');
  assert.ok(found.results.some((x) => x.key === 'feedback_deploy_window'), JSON.stringify(found.results));
  assert.ok(found.results.every((x) => x.description), 'results carry descriptions from metadata');
  const typed = await driver.find('deploy', { type: 'project' });
  assert.ok(typed.results.every((x) => x.type === 'project'));
});

test('driver: expect absent and stale versions are refused', async (t) => {
  if (skipIfDown(t)) return;
  const { driver } = await projectWithBank('expect');
  const first = await driver.save(rec('alpha'));
  await assert.rejects(driver.save(rec('alpha'), { expect: 'absent' }), (err) => err.code === EXIT.INVALID);
  await driver.save(rec('alpha', { description: 'Second.' }), { expect: first.version });
  await assert.rejects(driver.save(rec('alpha', { description: 'Third.' }), { expect: first.version }), (err) => err.code === EXIT.INVALID);
  assert.equal((await driver.get('project_alpha')).description, 'Second.');
});

test('driver: retire hides a record from list and find; restore brings it back; delete removes it', async (t) => {
  if (skipIfDown(t)) return;
  const { driver, bank } = await projectWithBank('retire');
  await driver.save(rec('zeppelin-hangar', { description: 'The zeppelin hangar opens on Fridays.' }));
  await driver.save(rec('boat-dock', { description: 'The boat dock opens on Mondays.' }));
  const retired = await driver.retire('project_zeppelin_hangar', { supersededBy: 'project_boat_dock', reason: 'Closed.' });
  assert.equal(retired.record.status, 'retired');
  const doc = await client.forBank(bank).getDocument('project_zeppelin_hangar');
  assert.ok(doc.tags.includes('status:retired'));
  assert.match(doc.original_text, /\nstatus: superseded\n/);
  assert.match(doc.original_text, /\*\*Superseded \d{4}-\d{2}-\d{2}:\*\* Replaced by \[project_boat_dock\]\(project_boat_dock\.md\)\. Closed\./);
  assert.deepEqual((await driver.get('project_boat_dock')).supersedes, ['project_zeppelin_hangar'], 'the replacement records what it supersedes');
  assert.deepEqual((await driver.list()).map((x) => x.key), ['project_boat_dock']);
  assert.deepEqual((await driver.list({ status: 'retired' })).map((x) => x.key), ['project_zeppelin_hangar']);
  const hidden = await driver.find('zeppelin hangar');
  assert.ok(!hidden.results.some((x) => x.key === 'project_zeppelin_hangar'), JSON.stringify(hidden.results));
  const shown = await driver.find('zeppelin hangar', { all: true });
  assert.ok(shown.results.some((x) => x.key === 'project_zeppelin_hangar'));

  const restored = await driver.restore('project_zeppelin_hangar');
  assert.equal(restored.record.status, 'needs-review');
  assert.equal(restored.record.superseded_by, null);
  assert.ok((await driver.find('zeppelin hangar')).results.some((x) => x.key === 'project_zeppelin_hangar'));

  await driver.delete('project_zeppelin_hangar');
  assert.equal(await driver.get('project_zeppelin_hangar'), null);
  await assert.rejects(driver.delete('project_zeppelin_hangar'), (err) => err.code === EXIT.ERROR);
});

test('driver: focus and glossary are documents with fixed ids', async (t) => {
  if (skipIfDown(t)) return;
  const { driver, bank } = await projectWithBank('focus');
  assert.deepEqual(await driver.focusGet(), { text: '', version: null });
  const set = await driver.focusSet(FOCUS, { expect: 'absent' });
  assert.equal((await driver.focusGet()).text, FOCUS);
  assert.equal((await driver.focusGet()).version, set.version);
  const doc = await client.forBank(bank).getDocument('focus');
  assert.deepEqual(doc.tags, ['kind:focus']);
  await assert.rejects(driver.focusSet(FOCUS, { expect: 'absent' }), (err) => err.code === EXIT.INVALID);
  await driver.glossarySet('# Terminology glossary\n\n- WI: work item\n');
  assert.match((await driver.glossaryGet()).text, /WI: work item/);
  assert.ok(!(await driver.list({ status: 'all' })).some((x) => x.key === 'focus' || x.key === 'glossary'));
});

test('driver: retire refuses a replacement that does not exist; keys typed with dashes work; delete is read back', async (t) => {
  if (skipIfDown(t)) return;
  const { driver } = await projectWithBank('keys');
  await driver.save(rec('newer'));
  await assert.rejects(driver.retire('project_newer', { supersededBy: 'project_nothing_here' }), (err) => err.code === EXIT.INVALID && /does not exist/.test(err.message));
  assert.equal((await driver.get('project_newer')).status, 'current');
  await driver.save(rec('no-force-push', { type: 'feedback' }));
  assert.equal((await driver.get('feedback_no-force-push')).key, 'feedback_no_force_push');
  const retired = await driver.retire('project-newer', { supersededBy: 'feedback_no-force-push' });
  assert.equal(retired.record.superseded_by, 'feedback_no_force_push');
  const del = await driver.delete('feedback_no-force-push');
  // The superseded record's "Replaced by" link becomes plain words; it still names its replacement.
  assert.deepEqual(del, { key: 'feedback_no_force_push', deleted: true, linksRepaired: ['project_newer'] });
  assert.equal(await driver.get('feedback_no_force_push'), null);
  const newer = await driver.get('project_newer');
  assert.match(newer.body, /Replaced by feedback_no_force_push\./);
  assert.equal(newer.superseded_by, 'feedback_no_force_push');
});

test('driver: rename makes a new document under the new key and repairs links in other records', async (t) => {
  if (skipIfDown(t)) return;
  const { driver, bank } = await projectWithBank('rename');
  await driver.save(rec('billing'));
  await driver.save(rec('accounts', { body: '# Accounts\n\n**Remember:** One org per account.\n\n**Related memories:** [billing](project_billing.md)\n' }));
  const res = await driver.rename('project_billing', 'reference_billing_rules');
  assert.equal(res.key, 'reference_billing_rules');
  assert.deepEqual(res.linksRepaired, ['project_accounts']);
  assert.equal(await client.forBank(bank).getDocument('project_billing'), null);
  const doc = await client.forBank(bank).getDocument('reference_billing_rules');
  assert.match(doc.original_text, /^---\nname: reference_billing_rules\n[\s\S]*metadata:\n  type: reference\n/);
  assert.ok(doc.tags.includes('type:reference'));
  assert.match((await driver.get('project_accounts')).body, /\[billing\]\(reference_billing_rules\.md\)/);
});

test('driver: status takes the last save from the bank row at once, and records the last export', async (t) => {
  if (skipIfDown(t)) return;
  const { driver, project } = await projectWithBank('status');
  const before = await driver.status();
  assert.equal(before.lastSave, null);
  assert.equal(before.lastExport, null);
  const t0 = Date.now();
  await driver.save(rec('first'));
  await driver.save(rec('second'));
  await driver.retire('project_first');
  await driver.focusSet(FOCUS);
  const st = await driver.status();
  assert.ok(st.lastSave, 'last save is known right after the writes');
  assert.ok(Date.parse(st.lastSave) >= t0 - 1000, `${st.lastSave} is this run's write`);
  assert.equal(st.counts.current, 1);
  assert.equal(st.counts.retired, 1);
  await driver.markExport('/tmp/somewhere');
  const after = await driver.status();
  assert.ok(after.lastExport && Date.parse(after.lastExport) >= t0 - 1000);
  // A second driver for the same project (a later command) sees the same times.
  const later = await createDriver({ root: project.root, mainRoot: project.mainRoot, config: project.config });
  assert.equal((await later.status()).lastExport, after.lastExport);
  // A driver made without the project folder still works; it just keeps no export time.
  const bare = await createDriver({ config: project.config });
  assert.equal((await bare.status()).lastExport, null);
});

test('driver: a missing bank is refused, never created with the server defaults', async (t) => {
  if (skipIfDown(t)) return;
  const bank = newBankId('missing');
  const driver = await createDriver({ config: { hindsight: { bank } } });
  await assert.rejects(driver.save(rec('x-fact')), (err) => err.code === EXIT.ERROR && /does not exist/.test(err.message) && /ensure-bank/.test(err.details.fix));
  assert.equal(await client.bankExists(bank), false, 'the bank was not created');
  const st = await driver.status();
  assert.equal(st.healthy, false);
  assert.match(st.detail, /does not exist/);
});

test('driver: reindex rewrites tags that do not match the text; status reports counts', async (t) => {
  if (skipIfDown(t)) return;
  const { driver, bank } = await projectWithBank('reindex');
  await driver.save(rec('tagged'));
  await driver.retire('project_tagged');
  const text = (await driver.get('project_tagged')).text;
  // Store the retired text with the wrong tags, as a hand edit through another tool might.
  await client.forBank(bank).retain([{ content: text, document_id: 'project_tagged', tags: ['kind:record', 'type:project', 'status:current'], metadata: { kind: 'record' } }]);
  const res = await driver.reindex();
  assert.equal(res.count, 1);
  assert.equal(res.changed, 1);
  const doc = await client.forBank(bank).getDocument('project_tagged');
  assert.ok(doc.tags.includes('status:retired'));
  assert.equal(doc.original_text, text);
  assert.equal((await driver.reindex()).changed, 0);

  await driver.save(rec('live-one'));
  const st = await driver.status();
  assert.equal(st.healthy, true);
  assert.equal(st.counts.current, 1);
  assert.equal(st.counts.retired, 1);
  assert.ok(st.lastSave, 'last save time from bank stats');
  assert.deepEqual(st.problems, []);
});

test('driver: two saves at the same time both land', async (t) => {
  if (skipIfDown(t)) return;
  const { driver } = await projectWithBank('parallel');
  await Promise.all([driver.save(rec('left')), driver.save(rec('right'))]);
  assert.deepEqual((await driver.list()).map((x) => x.key), ['project_left', 'project_right']);
});

test('commands: ensure-bank records the bank; memory save, find, status, export, and the startup cache work', async (t) => {
  if (skipIfDown(t)) return;
  const key = newBankId('cli');
  const { root } = makeProject({ memory: { type: 'hindsight' }, key });
  const ensure = await runToolkit(['hindsight', 'ensure-bank', '--json'], { cwd: root });
  assert.equal(ensure.code, 0, ensure.stdout + ensure.stderr);
  assert.equal(ensure.json.bank, key);
  assert.equal(ensure.json.created, true);
  const config = JSON.parse(fs.readFileSync(path.join(root, '.toolkit.json'), 'utf8'));
  assert.deepEqual(config.hindsight, { url: DEFAULT_URL, bank: key });
  const again = await runToolkit(['hindsight', 'ensure-bank'], { cwd: root });
  assert.match(again.stdout, /already exists and belongs to this project/);
  assert.match(again.stdout, /nothing changed/);

  const health = await runToolkit(['hindsight', 'health'], { cwd: root });
  assert.equal(health.code, 0, health.stdout);
  assert.match(health.stdout, new RegExp(`This project's bank ${key}: 0 documents, last write never\\.`));

  const saved = await runToolkit(['memory', 'save', '--type', 'user', '--name', 'plain-english', '--description', 'Mike wants plain English replies.', '--body-file', '-', '--approved-by', 'Mike', '--json'], { cwd: root, stdin: body('Use plain English.') });
  assert.equal(saved.code, 0, saved.stdout + saved.stderr);
  assert.equal(saved.json.backend, 'hindsight');
  const found = await runToolkit(['memory', 'find', 'how should replies be written', '--json'], { cwd: root });
  assert.equal(found.json.results[0].key, 'user_plain_english');
  const focus = await runToolkit(['memory', 'focus', '--set-file', '-'], { cwd: root, stdin: FOCUS });
  assert.equal(focus.code, 0, focus.stderr);
  const st = await runToolkit(['memory', 'status'], { cwd: root });
  assert.equal(st.code, 0, st.stdout);
  assert.match(st.stdout, /^Backend: hindsight$/m);
  assert.match(st.stdout, /^Records: 1 current, 0 needing review, 0 retired$/m);
  assert.match(st.stdout, /^Last save: \d{4}-\d{2}-\d{2}T/m);
  assert.match(st.stdout, /^Last export: never$/m);
  const health2 = await runToolkit(['hindsight', 'health', '--json'], { cwd: root });
  assert.equal(health2.json.bank.documents, 2, 'the record and the focus');
  assert.ok(health2.json.bank.lastWrite, 'last write is known right after the save');
  const dashed = await runToolkit(['memory', 'get', 'user_plain-english', '--json'], { cwd: root });
  assert.equal(dashed.code, 0, dashed.stderr);
  assert.equal(dashed.json.key, 'user_plain_english');
  const closest = await runToolkit(['memory', 'find', 'zebra crossing lights'], { cwd: root });
  assert.match(closest.stdout, /closest to "zebra crossing lights", best first\. A close record is not always about the question/);
  assert.match(closest.stdout, /^- user_plain_english: Mike wants plain English replies\.$/m, 'recall results are listed, not only the header');
  assert.match(closest.stdout, /^Read a record with toolkit memory get <key> before relying on it\.$/m);

  const project = requireProject(root);
  assert.ok(fs.existsSync(cachePath(project)), 'the startup cache is written after a save');
  const brief = await memoryBriefing(project);
  assert.equal(brief.source, 'cache');
  assert.match(brief.text, /user_plain_english: Mike wants plain English replies\./);
  assert.match(brief.text, /## Now/);

  const dir = path.join(tempDir(), 'hindsight-export');
  const ex = await runToolkit(['memory', 'export', '--to', dir], { cwd: root });
  assert.equal(ex.code, 0, ex.stderr);
  const st2 = await runToolkit(['memory', 'status'], { cwd: root });
  assert.match(st2.stdout, /^Last export: \d{4}-\d{2}-\d{2}T/m);
  const exported = fs.readFileSync(path.join(dir, 'user_plain_english.md'), 'utf8');
  assert.equal(exported, (await (await createDriver({ config: project.config })).get('user_plain_english')).text);
  const builtinProject = makeProject();
  const im = await runToolkit(['memory', 'import', '--from', dir], { cwd: builtinProject.root });
  assert.equal(im.code, 0, im.stdout);
  assert.equal(fs.readFileSync(path.join(builtinProject.root, '.memory', 'user_plain_english.md'), 'utf8'), exported);

  const del = await runToolkit(['memory', 'delete', 'user_plain_english'], { cwd: root });
  assert.equal(del.code, 2);
});

test('commands: ensure-bank reuses the bank made for this key, and refuses a bank made for another key', async (t) => {
  if (skipIfDown(t)) return;
  const key = newBankId('owner');
  const first = makeProject({ memory: { type: 'hindsight' }, key });
  const made = await runToolkit(['hindsight', 'ensure-bank', '--json'], { cwd: first.root });
  assert.equal(made.code, 0, made.stderr);
  assert.equal(made.json.bank, key);

  // The same key with no hindsight.bank in .toolkit.json (for example after it was lost)
  // gets the bank whose owner marker names that key, not a new <key>-2.
  const twin = makeProject({ memory: { type: 'hindsight' }, key });
  const twinRes = await runToolkit(['hindsight', 'ensure-bank', '--json'], { cwd: twin.root });
  assert.equal(twinRes.code, 0, twinRes.stderr);
  assert.equal(twinRes.json.bank, key);
  assert.equal(await client.bankExists(`${key}-2`), false, 'no second bank');

  // A project whose .toolkit.json names the first project's bank is refused, and told how to use it anyway.
  const copy = makeProject({ memory: { type: 'hindsight' }, hindsight: { url: DEFAULT_URL, bank: key }, key: `${key}-copy` });
  const refused = await runToolkit(['hindsight', 'ensure-bank'], { cwd: copy.root });
  assert.equal(refused.code, 2, refused.stdout + refused.stderr);
  assert.match(refused.stderr, new RegExp(`made for the project ${key}, and this project's key is ${key}-copy`));
  assert.match(refused.stderr, new RegExp(`Fix: If this project really should use that bank, run toolkit hindsight ensure-bank --bank ${key}`));
  const forced = await runToolkit(['hindsight', 'ensure-bank', '--bank', key], { cwd: copy.root });
  assert.equal(forced.code, 0, forced.stderr);
  assert.match(forced.stdout, new RegExp(`was made for the project ${key}\\. It is used because --bank named it\\.`));
  assert.doesNotMatch(forced.stdout, /belongs to this project/);

});

test('slow: find --reflect returns a synthesized answer (run with TOOLKIT_SLOW=1)', { timeout: 300000 }, async (t) => {
  if (skipIfDown(t)) return;
  if (process.env.TOOLKIT_SLOW !== '1') {
    t.skip('slow test: set TOOLKIT_SLOW=1 to run it (about 20 to 30 seconds)');
    return;
  }
  const { driver } = await projectWithBank('reflect');
  await driver.save(rec('deploy-window', { type: 'feedback', description: 'Deploys happen on Tuesday mornings only.', body: body('Deploy to production only on Tuesday mornings, never on Fridays.') }));
  const started = Date.now();
  const res = await driver.find('On which day may we deploy to production?', { reflect: true });
  const ms = Date.now() - started;
  t.diagnostic(`find --reflect took ${(ms / 1000).toFixed(1)} s (reflect alone ${(res.answerMs / 1000).toFixed(1)} s)`);
  t.diagnostic(`answer: ${res.answer.replace(/\s+/g, ' ').slice(0, 200)}`);
  assert.equal(res.mode, 'recall+reflect');
  assert.ok(res.answer.length > 0);
  assert.doesNotMatch(res.answer, /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/, 'the answer is not in Japanese, Chinese, or Korean');
  assert.match(res.answer, /tuesday/i);
  assert.equal(res.results[0].key, 'feedback_deploy_window');
});

test('cleanup: every bank this run made is deleted and gone', async (t) => {
  if (skipIfDown(t)) return;
  // Runs last in this file. Deletes only the tkv2-test banks this run made.
  const before = (await client.listBanks()).map((b) => b.bank_id);
  for (const id of createdBanks) {
    assert.ok(id.startsWith('tkv2-test-'));
    await client.deleteBank(id);
    assert.equal(await client.bankExists(id), false, `${id} is gone`);
  }
  const afterIds = new Set((await client.listBanks()).map((b) => b.bank_id));
  // Another test run may be making and deleting its own tkv2-test banks at the same
  // time, so only banks outside the test naming are compared.
  const real = before.filter((id) => !createdBanks.has(id) && !id.startsWith('tkv2-test-'));
  assert.deepEqual(real.filter((id) => !afterIds.has(id)), [], 'banks this run did not make are untouched');
  t.diagnostic(`deleted ${[...createdBanks].filter((id) => before.includes(id)).length} test banks`);
});

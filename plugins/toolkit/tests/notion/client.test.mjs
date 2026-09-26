// The ntn wrapper: error parsing, retries, time limits, and the root-page scope check.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  NotionClient, normalizeId, parseNtnError, writeTargets, parentRef, fileScopeCache, findNtn, ntnRunner, isNotionError,
} from '../../lib/notion/client.mjs';
import { FakeNotion, fakeRunner, fakeSleep } from './fake-notion.mjs';

const RATE = 'error: Public API request failed (429 Too Many Requests rate_limited): You have been rate limited. Please try again in a few minutes.';
const BLOCKED = 'error: Public API request failed (429 Too Many Requests public_api_request_blocked): Blocked.';
const SERVER = 'error: Public API request failed (502 Bad Gateway internal_server_error): Bad gateway.';
const T9 = 'error: Public API request failed (400 Bad Request validation_error): No matches found for this text is not on the page.';

function setup() {
  const fake = new FakeNotion();
  const sleep = fakeSleep();
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), sleep, minIntervalMs: 0, random: () => 0.5 });
  return { fake, client, sleep };
}

test('normalizeId accepts dashed ids, bare ids, and Notion URLs', () => {
  const id = '3e7b381d-a176-81ad-ad1c-eb0f8ab22d09';
  assert.equal(normalizeId('3e7b381da17681adad1ceb0f8ab22d09'), id);
  assert.equal(normalizeId(id.toUpperCase()), id);
  assert.equal(normalizeId('https://app.notion.com/p/Toolkit-V2-Notion-test-area-safe-to-delete-3e7b381da17681adad1ceb0f8ab22d09'), id);
  assert.equal(normalizeId('not an id'), null);
});

test('parseNtnError reads the one-line error ntn prints, including multi-line messages', () => {
  assert.deepEqual(parseNtnError(T9), { status: 400, statusText: 'Bad Request', code: 'validation_error', message: 'No matches found for this text is not on the page.' });
  const multi = parseNtnError('error: Public API request failed (400 Bad Request validation_error): This operation would delete 1 child page(s):\n- page: "X"');
  assert.equal(multi.code, 'validation_error');
  assert.match(multi.message, /- page: "X"/);
  assert.equal(parseNtnError('something else').status, 0);
});

test('a 429 is retried with growing waits, then succeeds', async () => {
  const { fake, client, sleep } = setup();
  fake.failNext(2, RATE);
  const page = await client.getPage(fake.rootPageId);
  assert.equal(page.id, fake.rootPageId);
  assert.equal(client.stats.retries, 2);
  assert.deepEqual(sleep.waits, [1000, 2000]);
});

test('a 429 that keeps coming stops after 5 retries', async () => {
  const { fake, client } = setup();
  fake.failNext(6, RATE);
  await assert.rejects(client.getPage(fake.rootPageId), (err) => isNotionError(err) && err.status === 429);
  assert.equal(client.stats.retries, 5);
});

test('public_api_request_blocked is never retried', async () => {
  const { fake, client } = setup();
  fake.failNext(1, BLOCKED);
  await assert.rejects(client.getPage(fake.rootPageId), /public_api_request_blocked/);
  assert.equal(client.stats.retries, 0);
});

test('a 5xx is retried for a read but not for a write, and the write is marked uncertain', async () => {
  const { fake, client } = setup();
  fake.failNext(1, SERVER);
  await client.getPage(fake.rootPageId);
  assert.equal(client.stats.retries, 1);
  fake.failNext(1, SERVER);
  await assert.rejects(
    client.createPage({ parent: { type: 'page_id', page_id: fake.rootPageId }, properties: { title: { title: [] } } }),
    (err) => err.uncertain === true && err.status === 502,
  );
});

test('a validation error is exit 2 and names the problem', async () => {
  const { fake, client } = setup();
  fake.failNext(1, T9);
  await assert.rejects(client.patchMarkdown(fake.rootPageId, { type: 'update_content', update_content: { content_updates: [] } }), (err) => err.code === 2 && /No matches found/.test(err.message));
});

test('the deadline stops a job before the next call', async () => {
  const fake = new FakeNotion();
  let t = 0;
  const runner = (args, opts) => {
    t += 1000;
    return fakeRunner(fake)(args, opts);
  };
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner, minIntervalMs: 0, deadlineMs: 1 });
  await client.getPage(fake.rootPageId).catch(() => {});
  await new Promise((r) => setTimeout(r, 5));
  await assert.rejects(client.getPage(fake.rootPageId), (err) => err.notionCode === 'deadline');
  assert.ok(t >= 0);
});

test('slow calls are counted', async () => {
  const fake = new FakeNotion();
  const runner = async (args, opts) => {
    await new Promise((r) => setTimeout(r, 15));
    return fake.handle(args, opts.input);
  };
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner, minIntervalMs: 0, slowMs: 5 });
  await client.getPage(fake.rootPageId);
  assert.equal(client.stats.calls, 1);
  assert.equal(client.stats.slowCalls.length, 1);
});

test('no sign-in (the Codex sandbox case) gives a clear error with the fix', async () => {
  const runner = async () => ({ code: 4, stdout: '', stderr: 'error: No auth token found for the current workspace.\n  hint: Run `ntn login` first, or set NOTION_API_TOKEN.' });
  const client = new NotionClient({ rootPageId: '3e7b381d-a176-81ad-ad1c-eb0f8ab22d09', runner, minIntervalMs: 0 });
  await assert.rejects(client.whoami(), (err) => err.notionCode === 'no_auth' && /ntn login/.test(err.details.fix));
});

test('ntn missing gives exit 1 with install instructions', async () => {
  const client = new NotionClient({ rootPageId: '3e7b381d-a176-81ad-ad1c-eb0f8ab22d09', runner: ntnRunner({ bin: '/nonexistent/ntn' }), minIntervalMs: 0 });
  await assert.rejects(client.whoami(), (err) => err.notionCode === 'ntn_missing' && /npm install -g ntn/.test(err.details.fix));
});

test('findNtn prefers TOOLKIT_NTN_BIN', () => {
  assert.equal(findNtn({ TOOLKIT_NTN_BIN: '/x/ntn', PATH: '' }), '/x/ntn');
});

test('the runner sends the body on standard input and closes it', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ntn-echo-'));
  const bin = path.join(dir, 'ntn');
  fs.writeFileSync(bin, '#!/usr/bin/env node\nlet s="";process.stdin.on("data",d=>s+=d).on("end",()=>{process.stdout.write(JSON.stringify({args:process.argv.slice(2),input:s}));});\n', { mode: 0o755 });
  const client = new NotionClient({ rootPageId: '3e7b381d-a176-81ad-ad1c-eb0f8ab22d09', bin, minIntervalMs: 0 });
  const res = await client.request('POST', 'v1/search', { body: { query: 'x' } });
  assert.deepEqual(res.args, ['api', 'v1/search', '-X', 'POST', '--notion-version', '2026-03-11', '-d', '@-']);
  assert.equal(res.input, '{"query":"x"}');
  const get = await client.request('GET', 'v1/views', { query: { database_id: 'abc' } });
  assert.deepEqual(get.args.slice(-1), ['database_id==abc']);
  assert.equal(get.input, '');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('writeTargets finds the object each write changes', () => {
  const id = '3e7b381d-a176-81ad-ad1c-eb0f8ab22d09';
  assert.deepEqual(writeTargets('POST', 'v1/pages', { parent: { type: 'page_id', page_id: id } }), [{ kind: 'page', id }]);
  assert.deepEqual(writeTargets('POST', 'v1/pages', { parent: { type: 'data_source_id', data_source_id: id } }), [{ kind: 'data_source', id }]);
  assert.deepEqual(writeTargets('POST', 'v1/pages', { parent: { type: 'workspace', workspace: true } }), [{ kind: 'workspace' }]);
  assert.deepEqual(writeTargets('PATCH', `v1/pages/${id}/markdown`, {}), [{ kind: 'page', id }]);
  assert.deepEqual(writeTargets('POST', 'v1/views', { database_id: id }), [{ kind: 'database', id }]);
  assert.deepEqual(writeTargets('PATCH', `v1/data_sources/${id}`, {}), [{ kind: 'data_source', id }]);
  assert.equal(writeTargets('POST', 'v1/file_uploads', {}), null);
  assert.equal(writeTargets('POST', 'v1/pages', {}), null);
  assert.deepEqual(parentRef({ type: 'block_id', block_id: id }), { kind: 'block', id });
});

test('writes under the root page are allowed; writes elsewhere are refused', async () => {
  const fake = new FakeNotion();
  const inside = fake.addPage({ parent: { type: 'page_id', page_id: fake.rootPageId }, title: 'Inside' });
  const deep = fake.addPage({ parent: { type: 'page_id', page_id: inside.id }, title: 'Deep' });
  const other = fake.addPage({ parent: { type: 'workspace', workspace: true }, title: 'Mike\'s other page' });
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  await client.updatePage(deep.id, { properties: {} });
  await assert.rejects(client.updatePage(other.id, { properties: {} }), (err) => err.notionCode === 'outside_root' && err.code === 2);
  await assert.rejects(client.createPage({ parent: { type: 'workspace', workspace: true }, properties: {} }), /top of the workspace/);
  await assert.rejects(client.request('POST', 'v1/file_uploads', { body: {} }), /not allowed/);
  // Nothing was written to the other page.
  assert.ok(!fake.writes().some((c) => c.path.includes(other.id)));
});

test('reads are never checked and cost no extra calls', async () => {
  const { fake, client } = setup();
  const other = fake.addPage({ parent: { type: 'workspace', workspace: true }, title: 'Other' });
  await client.getPage(other.id);
  assert.equal(client.stats.calls, 1);
});

test('without a root page every write is refused', async () => {
  const fake = new FakeNotion();
  const client = new NotionClient({ runner: fakeRunner(fake), minIntervalMs: 0 });
  await assert.rejects(client.updatePage(fake.rootPageId, {}), (err) => err.notionCode === 'no_root');
});

test('the scope answer is cached in memory and in the cache file', async () => {
  const fake = new FakeNotion();
  const a = fake.addPage({ parent: { type: 'page_id', page_id: fake.rootPageId }, title: 'A' });
  const b = fake.addPage({ parent: { type: 'page_id', page_id: a.id }, title: 'B' });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-'));
  const cache = fileScopeCache(path.join(dir, 'scope.json'));
  const c1 = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0, scopeCache: cache });
  await c1.updatePage(b.id, { properties: {} });
  const firstCalls = c1.stats.calls;
  await c1.updatePage(b.id, { properties: {} });
  assert.equal(c1.stats.calls - firstCalls, 1, 'second write needs no parent reads');
  const c2 = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0, scopeCache: fileScopeCache(path.join(dir, 'scope.json')) });
  await c2.updatePage(b.id, { properties: {} });
  assert.equal(c2.stats.calls, 1, 'a new process uses the cache file');
  fs.rmSync(dir, { recursive: true, force: true });
});

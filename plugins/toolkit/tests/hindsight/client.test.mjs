// The Hindsight client with a fake fetch: request shapes, errors, and the
// rule that the server must be on this computer. No server needed.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { HindsightClient, assertBankId, assertLocalUrl } from '../../lib/hindsight/client.mjs';
import { ensureBank, bankOwner, bankMissions, bankIdFor, settingsDrift, settingsProblems, withPlainEnglish, PLAIN_ENGLISH, READ_ONLY_MCP_TOOLS } from '../../lib/hindsight/bank.mjs';
import { EXIT } from '../../lib/core/output.mjs';
import { run as hindsightCommand } from '../../lib/commands/hindsight.mjs';
import { cleanup, makeProject } from '../memory/helpers.mjs';

after(cleanup);

function fakeFetch(routes) {
  const calls = [];
  const fetch = async (url, init) => {
    const u = new URL(url);
    const key = `${init.method} ${u.pathname}`;
    calls.push({ method: init.method, path: u.pathname, query: u.searchParams, body: init.body ? JSON.parse(init.body) : undefined });
    const handler = routes[key] || routes[`${init.method} *`];
    if (!handler) return new Response(JSON.stringify({ detail: 'Not Found' }), { status: 404 });
    const { status = 200, json } = handler(calls[calls.length - 1]);
    return new Response(json === undefined ? '' : JSON.stringify(json), { status });
  };
  return { fetch, calls };
}

test('only a server on this computer is allowed', () => {
  assert.equal(assertLocalUrl('http://127.0.0.1:8888'), 'http://127.0.0.1:8888');
  assert.equal(new HindsightClient({ url: 'http://localhost:8888/', fetch: async () => {} }).url, 'http://localhost:8888');
  assert.throws(() => new HindsightClient({ url: 'https://api.hindsight.vectorize.io' }), (err) => err.code === EXIT.INVALID && /never Hindsight Cloud/.test(err.message));
  assert.throws(() => assertLocalUrl('http://192.168.1.20:8888'), (err) => err.code === EXIT.INVALID);
  assert.throws(() => assertLocalUrl('not a url'), (err) => err.code === EXIT.INVALID);
});

test('bank ids are lower-case letters, digits, and dashes', () => {
  assert.equal(assertBankId('acme-crm'), 'acme-crm');
  for (const bad of ['Acme', '1abc', 'a/b', 'a b', 'proj:x', '']) {
    assert.throws(() => assertBankId(bad), (err) => err.code === EXIT.INVALID, bad);
  }
});

test('requests: repeated tags in the query, PATCH wraps updates, 404 becomes null', async () => {
  const { fetch, calls } = fakeFetch({
    'GET /v1/default/banks/b1/documents': () => ({ json: { items: [{ id: 'project_a' }], total: 1 } }),
    'PATCH /v1/default/banks/b1/config': () => ({ json: { ok: true } }),
    'POST /v1/default/banks/b1/memories': () => ({ json: { success: true } }),
  });
  const c = new HindsightClient({ bank: 'b1', fetch });
  const docs = await c.listAllDocuments({ tags: ['kind:record', 'status:current'], tagsMatch: 'all_strict' });
  assert.deepEqual(docs, [{ id: 'project_a' }]);
  assert.deepEqual(calls[0].query.getAll('tags'), ['kind:record', 'status:current']);
  assert.equal(calls[0].query.get('tags_match'), 'all_strict');
  await c.patchBankConfig({ retain_extraction_mode: 'chunks' });
  assert.deepEqual(calls[1].body, { updates: { retain_extraction_mode: 'chunks' } });
  await c.retain([{ content: 'x' }]);
  assert.deepEqual(calls[2].body, { items: [{ content: 'x' }], async: false });
  assert.equal(await c.getDocument('missing'), null);
  assert.equal(await c.getBankConfig('b1'), null);
});

test('errors: refused requests and an unreachable server name the fix', async () => {
  const refused = new HindsightClient({ bank: 'b1', fetch: async () => new Response(JSON.stringify({ detail: [{ msg: 'Field required' }] }), { status: 422 }) });
  await assert.rejects(refused.retain([]), (err) => err.code === EXIT.ERROR && /HTTP 422/.test(err.message) && /Field required/.test(err.message));
  const down = new HindsightClient({ bank: 'b1', fetch: async () => { const e = new TypeError('fetch failed'); e.cause = { code: 'ECONNREFUSED' }; throw e; } });
  await assert.rejects(down.health(), (err) => err.code === EXIT.ERROR && /nothing is listening there/.test(err.message) && /service start/.test(err.details.fix));
});

test('bankExists uses the bank list, not the config route', async () => {
  const { fetch, calls } = fakeFetch({
    'GET /v1/default/banks': (call) => ({ json: { banks: call.query.get('q') === 'b1' ? [{ bank_id: 'b1-old' }, { bank_id: 'b1' }] : [], total: 2 } }),
  });
  const c = new HindsightClient({ bank: 'b1', fetch });
  assert.equal(await c.bankExists(), true);
  assert.equal(await c.bankExists('b2'), false);
  assert.equal(calls[0].query.get('q'), 'b1');
});

test('a bank id is made from the project key; a key that starts with a digit gets p- in front', () => {
  assert.equal(bankIdFor('acme-crm'), 'acme-crm');
  assert.equal(bankIdFor('3m-portal'), 'p-3m-portal');
  assert.equal(bankIdFor('Acme_CRM v2'), 'acme-crm-v2');
  assert.equal(bankIdFor('x'.repeat(80)).length, 60);
  assert.equal(bankIdFor('---'), null);
  assert.equal(bankIdFor(''), null);
});

test('the reflect mission must say to answer in plain English; ensure-bank adds it to a bank that lacks it', () => {
  assert.match(bankMissions({ projectKey: 'k', projectName: 'Acme' }).reflect_mission, new RegExp(`${PLAIN_ENGLISH.replace('.', '\\.')}$`));
  assert.equal(withPlainEnglish('Memory for Acme'), `Memory for Acme. ${PLAIN_ENGLISH}`);
  assert.equal(withPlainEnglish('Memory for Acme.'), `Memory for Acme. ${PLAIN_ENGLISH}`);
  assert.equal(withPlainEnglish(`Memory. ${PLAIN_ENGLISH}`), `Memory. ${PLAIN_ENGLISH}`);
  assert.equal(withPlainEnglish(null), PLAIN_ENGLISH);
  const good = { config: { retain_extraction_mode: 'chunks', enable_observations: false, mcp_enabled_tools: [...READ_ONLY_MCP_TOOLS], reflect_mission: `Memory. ${PLAIN_ENGLISH}` } };
  assert.deepEqual(settingsDrift(good), {});
  const old = { config: { ...good.config, reflect_mission: 'Project memory for Acme.' } };
  assert.deepEqual(settingsDrift(old), { reflect_mission: `Project memory for Acme. ${PLAIN_ENGLISH}` });
  assert.match(settingsProblems(old).join(' '), /find --reflect can answer in another language/);
});

test('a client limit and signal stop every request: nothing is left running after an abort', async () => {
  let seen = null;
  const hang = (url, init) => new Promise((_, reject) => {
    seen = init.signal;
    init.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
  });
  const controller = new AbortController();
  const c = new HindsightClient({ bank: 'b1', fetch: hang, timeoutMs: 60000, signal: controller.signal });
  const started = Date.now();
  const pending = c.getDocument('project_x');
  setTimeout(() => controller.abort(), 50);
  await assert.rejects(pending, (err) => err.code === EXIT.ERROR && err.details.unreachable === true);
  assert.ok(Date.now() - started < 1000, 'stopped at the abort, not at the 60-second limit');
  assert.equal(seen.aborted, true);
  // A limit given to the client caps even reflect, which normally waits up to 5 minutes.
  const capped = new HindsightClient({ bank: 'b1', fetch: hang, timeoutMs: 100 });
  const t0 = Date.now();
  await assert.rejects(capped.reflect({ query: 'q' }), (err) => /no answer within 0\.1 seconds/.test(err.message));
  assert.ok(Date.now() - t0 < 2000);
  assert.equal(capped.forBank('b2').limitMs, 100, 'a client for another bank keeps the limit');
});

test('ensureBank: create with PUT, then PATCH the settings; any bank that exists is taken the first time', async () => {
  const banks = new Map([
    ['taken', { overrides: { retain_mission: bankMissions({ projectKey: 'other' }).retain_mission }, config: {} }],
    ['samekey', { overrides: { retain_mission: bankMissions({ projectKey: 'mine' }).retain_mission }, config: {} }],
    ['handmade', { overrides: {}, config: {} }],
  ]);
  const { fetch, calls } = fakeFetch({
    'GET /v1/default/banks': (call) => ({ json: { banks: [...banks.keys()].filter((b) => b.includes(call.query.get('q') || '')).map((bank_id) => ({ bank_id })), total: banks.size } }),
    'GET *': (call) => {
      const id = decodeURIComponent(call.path.split('/')[4]);
      const b = banks.get(id);
      return b ? { json: { bank_id: id, config: b.config, overrides: b.overrides } } : { status: 404, json: { detail: 'not found' } };
    },
    'PUT *': (call) => {
      const id = decodeURIComponent(call.path.split('/')[4]);
      banks.set(id, { overrides: { ...call.body }, config: { ...call.body } });
      return { json: { bank_id: id } };
    },
    'PATCH *': (call) => {
      const id = decodeURIComponent(call.path.split('/')[4]);
      const b = banks.get(id);
      Object.assign(b.config, call.body.updates);
      Object.assign(b.overrides, call.body.updates);
      return { json: { bank_id: id } };
    },
  });
  const client = new HindsightClient({ fetch });
  const res = await ensureBank({ client, bank: 'taken', projectKey: 'mine' });
  assert.equal(res.bank, 'taken-2');
  assert.equal(res.created, true);
  assert.equal(res.relation, 'this-project');
  assert.deepEqual(res.skipped, [{ bank: 'taken', owner: 'other' }]);
  const put = calls.find((c) => c.method === 'PUT');
  assert.match(put.body.retain_mission, /toolkit-v2 project key: mine$/);
  assert.match(put.body.reflect_mission, /Always answer in plain English\.$/);
  const patch = calls.find((c) => c.method === 'PATCH');
  assert.deepEqual(patch.body.updates, { retain_extraction_mode: 'chunks', enable_observations: false, mcp_enabled_tools: [...READ_ONLY_MCP_TOOLS] });
  assert.equal(bankOwner({ overrides: banks.get('taken-2').overrides }), 'mine');
  assert.deepEqual(settingsDrift({ config: banks.get('taken-2').config }), {});

  // A bank made for the same key by another project (a repeated sample run) is not shared.
  const sameKey = await ensureBank({ client, bank: 'samekey', projectKey: 'mine' });
  assert.equal(sameKey.bank, 'samekey-2');
  assert.deepEqual(sameKey.skipped, [{ bank: 'samekey', owner: 'mine' }]);

  // Named in .toolkit.json and made for this key: used, and its settings repaired.
  const own = await ensureBank({ client, bank: 'samekey', projectKey: 'mine', claimed: true });
  assert.equal(own.relation, 'this-project');
  assert.deepEqual(own.changed.sort(), ['enable_observations', 'mcp_enabled_tools', 'reflect_mission', 'retain_extraction_mode']);

  // Named in .toolkit.json but made for another key: refused, and nothing is written.
  const before = calls.length;
  await assert.rejects(ensureBank({ client, bank: 'taken', projectKey: 'mine', claimed: true }), (err) => err.code === EXIT.INVALID
    && /made for the project other, and this project's key is mine/.test(err.message)
    && /ensure-bank --bank taken/.test(err.details.fix));
  assert.ok(calls.slice(before).every((c) => c.method === 'GET'), 'no write after the refusal');

  // Named on purpose with --bank: used anyway, and the reply says whose it is.
  const explicit = await ensureBank({ client, bank: 'taken', projectKey: 'mine', claimed: true, explicit: true });
  assert.equal(explicit.bank, 'taken');
  assert.equal(explicit.relation, 'other-project');
  assert.equal(explicit.owner, 'other');

  // A bank with no toolkit marker that .toolkit.json names is used as is.
  const handmade = await ensureBank({ client, bank: 'handmade', projectKey: 'mine', claimed: true });
  assert.equal(handmade.relation, 'no-marker');
});

test('ensure-bank for a project key that starts with a digit uses p-<key> and records it', async () => {
  const banks = new Map();
  const { fetch } = fakeFetch({
    'GET /health': () => ({ json: { status: 'healthy' } }),
    'GET /v1/default/banks': (call) => ({ json: { banks: [...banks.keys()].filter((b) => b.includes(call.query.get('q') || '')).map((bank_id) => ({ bank_id })), total: banks.size } }),
    'GET *': (call) => {
      const b = banks.get(decodeURIComponent(call.path.split('/')[4]));
      return b ? { json: { config: b, overrides: b } } : { status: 404, json: { detail: 'not found' } };
    },
    'PUT *': (call) => {
      banks.set(decodeURIComponent(call.path.split('/')[4]), { ...call.body });
      return { json: {} };
    },
    'PATCH *': (call) => {
      Object.assign(banks.get(decodeURIComponent(call.path.split('/')[4])), call.body.updates);
      return { json: {} };
    },
  });
  const { root } = makeProject({ memory: { type: 'hindsight' }, key: '3m-portal' });
  const ctx = { cwd: root, json: true, env: process.env, fetch, stdout: { write: () => true }, stderr: { write: () => true } };
  const code = await hindsightCommand(['ensure-bank'], ctx);
  assert.equal(code, EXIT.OK);
  assert.ok(banks.has('p-3m-portal'), [...banks.keys()].join(', '));
  const config = JSON.parse(fs.readFileSync(path.join(root, '.toolkit.json'), 'utf8'));
  assert.equal(config.hindsight.bank, 'p-3m-portal');
});

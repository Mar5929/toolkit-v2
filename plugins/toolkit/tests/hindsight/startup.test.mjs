// The session-start briefing for Hindsight projects, without the real server:
// a server that never answers must not hold the hook process, and a cache made
// for another bank must not be shown.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { requireProject } from '../../lib/core/config.mjs';
import { cacheIdentity, cachePath, memoryBriefing } from '../../lib/memory/startup.mjs';
import { cleanup, makeProject, PLUGIN } from '../memory/helpers.mjs';

after(cleanup);

/** A local server that accepts every connection and never answers. */
function silentServer() {
  return new Promise((resolve) => {
    const sockets = new Set();
    const server = http.createServer(() => {});
    server.on('connection', (s) => {
      sockets.add(s);
      s.on('close', () => sockets.delete(s));
    });
    server.listen(0, '127.0.0.1', () => resolve({
      port: server.address().port,
      open: () => sockets.size,
      close: () => new Promise((r) => {
        for (const s of sockets) s.destroy();
        server.close(r);
      }),
    }));
  });
}

function runNode(script, cwd) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(process.execPath, ['--input-type=module', '-e', script], { cwd });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => resolve({ code, stdout, stderr, ms: Date.now() - started }));
  });
}

test('a server that never answers: the briefing gives up at the deadline and the process exits right after', async () => {
  const server = await silentServer();
  try {
    const { root } = makeProject({ memory: { type: 'hindsight' }, hindsight: { url: `http://127.0.0.1:${server.port}`, bank: 'tkv2-test-silent' } });
    const lib = (p) => pathToFileURL(path.join(PLUGIN, 'lib', p)).href;
    const script = `
      import { requireProject } from '${lib('core/config.mjs')}';
      import { memoryBriefing } from '${lib('memory/startup.mjs')}';
      const t0 = Date.now();
      const res = await memoryBriefing(requireProject(process.cwd()), { timeoutMs: 800 });
      console.log(JSON.stringify({ ...res, ms: Date.now() - t0 }));
    `;
    const run = await runNode(script, root);
    assert.equal(run.code, 0, run.stderr);
    const res = JSON.parse(run.stdout);
    assert.equal(res.ok, false);
    assert.match(res.problem, /could not be read: no answer within 0\.8 seconds\. Work that needs memory should wait/);
    assert.ok(res.ms < 1500, `the briefing returned after ${res.ms} ms`);
    // Before the fix the process stayed alive for the 30-second request timeout.
    assert.ok(run.ms < 5000, `the process exited after ${run.ms} ms`);
    assert.equal(fs.existsSync(cachePath(requireProject(root))), false, 'no cache is written from a failed read');
  } finally {
    await server.close();
  }
});

test('a cache made for another bank is not used; one made for this bank is', async () => {
  const { root } = makeProject({ memory: { type: 'hindsight' }, hindsight: { bank: 'tkv2-test-new-bank' } });
  const project = requireProject(root);
  const file = cachePath(project);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const cache = (identity) => JSON.stringify({ schema: 2, backend: 'hindsight', identity, focus: '', records: [{ key: 'project_old', type: 'project', description: 'From the old bank.', status: 'current' }] });

  const noServer = async () => { throw Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } }); };
  fs.writeFileSync(file, cache('hindsight tkv2-test-old-bank http://127.0.0.1:8888'));
  const stale = await memoryBriefing(project, { fetch: noServer, timeoutMs: 500 });
  assert.notEqual(stale.source, 'cache');
  assert.doesNotMatch(stale.text, /project_old/);

  assert.equal(cacheIdentity(project), 'hindsight tkv2-test-new-bank http://127.0.0.1:8888');
  fs.writeFileSync(file, cache(cacheIdentity(project)));
  const fresh = await memoryBriefing(project, { fetch: noServer, timeoutMs: 500 });
  assert.equal(fresh.source, 'cache');
  assert.match(fresh.text, /project_old: From the old bank\./);
});

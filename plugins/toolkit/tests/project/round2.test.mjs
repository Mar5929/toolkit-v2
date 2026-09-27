// Setup fixes from the round 2 sample runs: init blocked by the Codex sandbox
// on its way to Hindsight names the terminal command (run d), doctor says the
// sandbox blocked it instead of "the server is down" (run d), and a file the
// project had before the toolkit is described plainly (run b).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, makeHome, makeRepo, testEnv, tk } from './helpers.mjs';
import { initProject as initDirect } from '../../lib/project/init.mjs';

after(cleanup);

function sandboxFetch() {
  return async () => {
    const err = new TypeError('fetch failed');
    err.cause = Object.assign(new Error('connect EPERM 127.0.0.1:8888 - Local (0.0.0.0:0)'), { code: 'EPERM' });
    throw err;
  };
}

test('init blocked by the Codex sandbox on its way to Hindsight names the exact command to run in a terminal, and writes nothing', async () => {
  const root = makeRepo();
  const env = testEnv(makeHome());
  await assert.rejects(
    initDirect({ name: 'Greet CLI', tracker: 'local', memory: 'hindsight', owner: 'Mike', hosts: 'claude-code,codex', decline: ['SOUL.md'] }, { cwd: root, env, fetch: sandboxFetch() }),
    (e) => {
      assert.equal(e.code, 1);
      assert.match(e.message, /The Codex sandbox blocked init's request to the local Hindsight server at http:\/\/127\.0\.0\.1:8888/);
      assert.match(e.message, /The server itself may be running\. Nothing was written\./);
      assert.match(e.details.command, /^toolkit init --dir .+ --name "Greet CLI" --key greet-cli --tracker local --memory hindsight --owner Mike --hosts claude-code,codex/);
      assert.match(e.details.fix, /run this in a Terminal window \(outside Codex\)/);
      assert.doesNotMatch(e.details.fix, /service start/, 'it does not say to start a server that may be running');
      return true;
    },
  );
  assert.deepEqual(fs.readdirSync(root).filter((n) => n !== '.git'), []);
});

test('doctor blocked by the Codex sandbox on its way to Hindsight says so, not that the server is down', async () => {
  const { root, env } = await initProject();
  const cfg = JSON.parse(fs.readFileSync(path.join(root, '.toolkit.json'), 'utf8'));
  cfg.memory.type = 'hindsight';
  cfg.hindsight = { url: 'http://127.0.0.1:8888', bank: 'acme-crm' };
  fs.writeFileSync(path.join(root, '.toolkit.json'), `${JSON.stringify(cfg, null, 2)}\n`);
  const { runChecks } = await import('../../lib/project/checks.mjs');
  const { requireProject } = await import('../../lib/core/config.mjs');
  const res = await runChecks(requireProject(root), { env, fetch: sandboxFetch() });
  const findings = res.findings || res;
  const ids = findings.map((f) => f.id);
  assert.ok(ids.includes('hindsight-sandbox'), ids.join(', '));
  assert.ok(!ids.includes('hindsight-down'));
});

test('a file the project had before the toolkit is described as that, not as "The toolkit would: the project had this file"', async () => {
  const root = makeRepo();
  fs.writeFileSync(path.join(root, 'README.md'), '# My own readme\n');
  const env = testEnv(makeHome());
  const init = await tk(root, ['init', '--name', 'Acme CRM', '--tracker', 'local', '--memory', 'builtin', '--owner', 'Mike'], { env });
  assert.equal(init.code, 0, init.stderr);
  const dry = await tk(root, ['sync', '--dry-run'], { env });
  assert.doesNotMatch(dry.stdout, /The toolkit would: the project had this file/);
  assert.match(dry.stdout, /README\.md\. The project had its own file before the toolkit, so the toolkit's version was never installed\./);
  const json = await tk(root, ['sync', '--dry-run', '--json'], { env });
  const readme = json.json.changedByProject.find((c) => c.target === 'README.md');
  assert.equal(readme.preexisting, true);
  assert.deepEqual(readme.toolkitWould, []);
  const doctor = await tk(root, ['doctor', '--json'], { env });
  const note = doctor.json.findings.find((f) => f.id === 'scaffold-changed' && /README\.md/.test(f.message));
  assert.equal(note.message, "README.md is the project's own file from before the toolkit, so sync leaves it alone and the toolkit's version was never installed.");
});

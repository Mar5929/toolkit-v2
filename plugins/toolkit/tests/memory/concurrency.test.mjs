// Several real `toolkit` processes writing memory at the same time.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { addWorktree, body, cleanup, makeProject, spawnToolkit } from './helpers.mjs';

after(cleanup);

function save(cwd, name, extra = []) {
  return spawnToolkit(['memory', 'save', '--type', 'project', '--name', name, '--description', `Fact ${name}.`, '--body-file', '-', ...extra], {
    cwd,
    input: body(`Fact ${name}.`),
  });
}

test('five processes saving different records at once: every record and index line lands', async () => {
  const { root } = makeProject();
  const wt = addWorktree(root);
  const names = ['one', 'two', 'three', 'four', 'five'];
  const results = await Promise.all(names.map((n, i) => save(i % 2 ? wt : root, `parallel-${n}`)));
  for (const r of results) assert.equal(r.code, 0, r.stderr);
  const vault = path.join(root, '.memory');
  const index = fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8');
  for (const n of names) {
    assert.ok(fs.existsSync(path.join(vault, `project_parallel_${n}.md`)), n);
    assert.match(index, new RegExp(`project_parallel_${n}\\.md`));
  }
  assert.ok(!fs.existsSync(path.join(vault, '.lock')), 'the lock is released');
  const leftovers = fs.readdirSync(vault).filter((f) => f.endsWith('.tmp'));
  assert.deepEqual(leftovers, []);
});

test('five processes creating the same record with --expect absent: exactly one wins', async () => {
  const { root } = makeProject();
  const results = await Promise.all(Array.from({ length: 5 }, () => save(root, 'only-once', ['--expect', 'absent'])));
  const codes = results.map((r) => r.code).sort();
  assert.deepEqual(codes, [0, 2, 2, 2, 2], results.map((r) => r.stderr).join('\n'));
});

test('a lock left by a process that is gone is taken over', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  fs.mkdirSync(vault, { recursive: true });
  // A lock from another host is only taken over when it is older than 30 s, so use this host.
  fs.writeFileSync(path.join(vault, '.lock'), JSON.stringify({ pid: 999999, time: new Date().toISOString(), host: os.hostname() }));
  const r = await save(root, 'after-crash');
  assert.equal(r.code, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(vault, 'project_after_crash.md')));
});

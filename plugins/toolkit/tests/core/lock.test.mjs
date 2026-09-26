import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { withLock, readLock, staleReason, pidAlive } from '../../lib/core/lock.mjs';
import { EXIT } from '../../lib/core/output.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LOCK_URL = pathToFileURL(path.resolve(HERE, '../../lib/core/lock.mjs')).href;
const FSX_URL = pathToFileURL(path.resolve(HERE, '../../lib/core/fsx.mjs')).href;

const made = [];
after(() => {
  for (const dir of made) fs.rmSync(dir, { recursive: true, force: true });
});

function tempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'toolkit-lock-'));
  made.push(dir);
  return dir;
}

function deadPid() {
  const res = spawnSync(process.execPath, ['-e', 'process.stdout.write(String(process.pid))'], { encoding: 'utf8' });
  const pid = Number(res.stdout);
  assert.ok(Number.isInteger(pid) && pid > 0);
  assert.equal(pidAlive(pid), false, 'the finished child process should be gone');
  return pid;
}

function writeLock(dir, info, name = '.lock') {
  const file = path.join(dir, name);
  fs.writeFileSync(file, typeof info === 'string' ? info : JSON.stringify(info));
  return file;
}

// A child process that takes the lock `rounds` times. Inside the lock it
// claims a marker file with an exclusive create (which fails if another
// process is inside at the same time), bumps a counter, and releases.
const WORKER = `
import fs from 'node:fs';
import path from 'node:path';
const { withLock } = await import(${JSON.stringify(LOCK_URL)});
const { atomicWrite, readText } = await import(${JSON.stringify(FSX_URL)});
const [dir, rounds] = process.argv.slice(-2);
const counter = path.join(dir, 'counter.txt');
const inside = path.join(dir, 'inside.marker');
let overlaps = 0;
for (let i = 0; i < Number(rounds); i++) {
  await withLock(dir, async () => {
    try { fs.writeFileSync(inside, String(process.pid), { flag: 'wx' }); } catch { overlaps++; }
    const n = Number(readText(counter) || '0');
    await new Promise((r) => setTimeout(r, Math.random() * 3));
    atomicWrite(counter, String(n + 1));
    try { fs.unlinkSync(inside); } catch { overlaps++; }
  });
}
process.stdout.write(JSON.stringify({ pid: process.pid, overlaps }));
`;

function runWorker(dir, rounds) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['--input-type=module', '-e', WORKER, '--', dir, String(rounds)], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (c) => { stdout += c; });
    child.stderr.on('data', (c) => { stderr += c; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('five processes share one lock without overlapping or losing updates', async () => {
  const dir = tempDir();
  const rounds = 12;
  const results = await Promise.all(Array.from({ length: 5 }, () => runWorker(dir, rounds)));
  for (const r of results) {
    assert.equal(r.code, 0, r.stderr);
    assert.equal(JSON.parse(r.stdout).overlaps, 0);
  }
  assert.equal(new Set(results.map((r) => JSON.parse(r.stdout).pid)).size, 5);
  assert.equal(fs.readFileSync(path.join(dir, 'counter.txt'), 'utf8'), String(5 * rounds));
  assert.equal(fs.existsSync(path.join(dir, '.lock')), false, 'the lock file is removed at the end');
  assert.deepEqual(fs.readdirSync(dir).sort(), ['counter.txt']);
});

test('the lock file holds pid, time, and host while held, and is removed after', async () => {
  const dir = tempDir();
  const value = await withLock(dir, () => {
    const holder = readLock(path.join(dir, '.lock'));
    assert.equal(holder.info.pid, process.pid);
    assert.equal(holder.info.host, os.hostname());
    assert.ok(Math.abs(Date.parse(holder.info.time) - Date.now()) < 5000);
    assert.equal(fs.statSync(path.join(dir, '.lock')).mode & 0o600, 0o600);
    return 'result';
  });
  assert.equal(value, 'result');
  assert.equal(fs.existsSync(path.join(dir, '.lock')), false);
});

test('a custom lock name and a missing folder', async () => {
  const dir = path.join(tempDir(), 'not', 'yet');
  await withLock(dir, async () => {
    assert.ok(fs.existsSync(path.join(dir, '.memory.lock')));
  }, { name: '.memory.lock' });
  assert.equal(fs.existsSync(path.join(dir, '.memory.lock')), false);
});

test('a lock left by a process that has exited is taken over at once', async () => {
  const dir = tempDir();
  writeLock(dir, { pid: deadPid(), time: new Date().toISOString(), host: os.hostname() });
  const started = Date.now();
  await withLock(dir, () => {
    assert.equal(readLock(path.join(dir, '.lock')).info.pid, process.pid);
  });
  assert.ok(Date.now() - started < 1000, 'no waiting for a dead holder');
  assert.equal(fs.existsSync(path.join(dir, '.lock')), false);
});

test('a lock left by a crashed toolkit process is taken over', async () => {
  const dir = tempDir();
  const crash = `const { withLock } = await import(${JSON.stringify(LOCK_URL)});
await withLock(process.argv[process.argv.length - 1], () => process.exit(0));`;
  const res = spawnSync(process.execPath, ['--input-type=module', '-e', crash, '--', dir], { encoding: 'utf8' });
  assert.equal(res.status, 0, res.stderr);
  const left = readLock(path.join(dir, '.lock'));
  assert.ok(left && left.info.pid !== process.pid, 'the crashed process left its lock behind');
  assert.equal(staleReason(left, 30000), 'dead-process');
  let ran = false;
  await withLock(dir, () => { ran = true; }, { waitMs: 2000 });
  assert.equal(ran, true);
});

test('a lock older than staleMs is taken over even when its process is alive', async () => {
  const dir = tempDir();
  writeLock(dir, { pid: process.pid, time: new Date(Date.now() - 60000).toISOString(), host: os.hostname() });
  assert.equal(staleReason(readLock(path.join(dir, '.lock')), 30000), 'too-old');
  let ran = false;
  await withLock(dir, () => { ran = true; });
  assert.equal(ran, true);

  writeLock(dir, { pid: process.pid, time: new Date(Date.now() - 500).toISOString(), host: os.hostname() });
  await withLock(dir, () => { ran = 'short stale time'; }, { staleMs: 100 });
  assert.equal(ran, 'short stale time');
});

test('a fresh lock held by a live process makes the caller wait, then fail with a clear error', async () => {
  const dir = tempDir();
  const file = writeLock(dir, { pid: process.pid, time: new Date().toISOString(), host: os.hostname() });
  const before = fs.readFileSync(file, 'utf8');
  const started = Date.now();
  await assert.rejects(
    withLock(dir, () => assert.fail('must not run'), { waitMs: 300 }),
    (err) => {
      assert.equal(err.code, EXIT.ERROR);
      assert.match(err.message, /Another toolkit process/);
      assert.match(err.message, new RegExp(`process ${process.pid}`));
      assert.equal(err.details.lock, file);
      assert.match(err.details.fix, /delete/);
      return true;
    },
  );
  assert.ok(Date.now() - started >= 300);
  assert.equal(fs.readFileSync(file, 'utf8'), before, 'a live lock is left alone');
});

test('the caller waits for a live lock that is released', async () => {
  const dir = tempDir();
  const file = writeLock(dir, { pid: process.pid, time: new Date().toISOString(), host: os.hostname() });
  setTimeout(() => fs.unlinkSync(file), 150);
  const started = Date.now();
  await withLock(dir, () => {}, { waitMs: 3000 });
  assert.ok(Date.now() - started >= 140);
});

test('a lock from another computer is judged by age only', async () => {
  const dir = tempDir();
  const pid = deadPid();
  const fresh = { raw: '', info: { pid, time: new Date().toISOString(), host: 'some-other-host' }, mtimeMs: Date.now() };
  assert.equal(staleReason(fresh, 30000), null, 'cannot check a process on another computer');
  const old = { ...fresh, info: { ...fresh.info, time: new Date(Date.now() - 31000).toISOString() } };
  assert.equal(staleReason(old, 30000), 'too-old');

  writeLock(dir, fresh.info);
  await assert.rejects(withLock(dir, () => {}, { waitMs: 200 }), (err) => err.code === EXIT.ERROR);
});

test('an unreadable lock file is taken over only after a short grace period', async () => {
  const dir = tempDir();
  const file = writeLock(dir, '');
  assert.equal(staleReason(readLock(file), 30000), null, 'a brand new empty lock may still be being written');
  await assert.rejects(withLock(dir, () => {}, { waitMs: 200 }), (err) => err.code === EXIT.ERROR);

  const old = (Date.now() - 5000) / 1000;
  fs.utimesSync(file, old, old);
  assert.equal(staleReason(readLock(file), 30000), 'unreadable');
  let ran = false;
  await withLock(dir, () => { ran = true; });
  assert.equal(ran, true);
});

test('the lock is released when the function throws', async () => {
  const dir = tempDir();
  await assert.rejects(withLock(dir, async () => { throw new Error('boom'); }), /boom/);
  assert.equal(fs.existsSync(path.join(dir, '.lock')), false);
  await withLock(dir, () => {});
});

test('a lock taken over from a slow holder is not removed by that holder', async () => {
  const dir = tempDir();
  const file = path.join(dir, '.lock');
  const other = JSON.stringify({ pid: 1, time: new Date().toISOString(), host: 'other', id: 'x' });
  await withLock(dir, () => {
    fs.writeFileSync(file, other);
  });
  assert.equal(fs.readFileSync(file, 'utf8'), other);
});

test('withLock inside withLock for the same folder does not wait for itself', async () => {
  const dir = tempDir();
  const order = [];
  await withLock(dir, async () => {
    order.push('outer');
    await withLock(dir, async () => {
      order.push('inner');
    }, { waitMs: 200 });
    assert.ok(fs.existsSync(path.join(dir, '.lock')), 'the outer lock is still held');
  });
  assert.deepEqual(order, ['outer', 'inner']);
  assert.equal(fs.existsSync(path.join(dir, '.lock')), false);
});

test('concurrent callers in one process take turns', async () => {
  const dir = tempDir();
  let inside = 0;
  let maxInside = 0;
  const log = [];
  await Promise.all(Array.from({ length: 5 }, (_, i) => withLock(dir, async () => {
    inside++;
    maxInside = Math.max(maxInside, inside);
    log.push(i);
    await new Promise((r) => setTimeout(r, 5));
    inside--;
  })));
  assert.equal(maxInside, 1);
  assert.equal(log.length, 5);
});

test('withLock needs a function', async () => {
  await assert.rejects(withLock(tempDir(), null), TypeError);
});

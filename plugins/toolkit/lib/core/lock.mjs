// A lock file that lets one toolkit process at a time change a folder.
//
// await withLock(dir, fn, { name = '.lock', staleMs = 30000, waitMs = 10000 })
//
// The lock is the file <dir>/<name>, created with an exclusive open, holding
// JSON { pid, time, host, id }. While it exists, other processes wait, trying
// again with a growing pause, for up to waitMs (10 seconds). A lock is taken
// over when its process is gone (same computer) or it is older than staleMs.
// fn may be synchronous or async; the lock is held until it finishes, and is
// removed afterwards only if it is still this call's lock.
// Calling withLock for the same lock inside fn does not wait for itself.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import { EXIT, ToolkitError } from './output.mjs';

const held = new AsyncLocalStorage();
const TAKEOVER_GUARD_STALE_MS = 5000;
const UNREADABLE_GRACE_MS = 1000;
const MAX_PAUSE_MS = 100;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** True when a process with this id is running (or cannot be checked). */
export function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err && err.code === 'EPERM';
  }
}

function tryCreate(lockPath, content) {
  let fd;
  try {
    fd = fs.openSync(lockPath, 'wx', 0o644);
  } catch (err) {
    if (err && err.code === 'EEXIST') return false;
    throw err;
  }
  try {
    fs.writeSync(fd, content);
    fs.fsyncSync(fd);
  } catch (err) {
    try { fs.closeSync(fd); } catch { /* ignore */ }
    try { fs.unlinkSync(lockPath); } catch { /* ignore */ }
    throw err;
  }
  fs.closeSync(fd);
  return true;
}

/** The current holder: null when there is no lock file. */
export function readLock(lockPath) {
  let raw;
  let stat;
  try {
    raw = fs.readFileSync(lockPath, 'utf8');
    stat = fs.statSync(lockPath);
  } catch (err) {
    if (err && err.code === 'ENOENT') return null;
    throw err;
  }
  let info = null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') info = parsed;
  } catch {
    info = null;
  }
  return { raw, info, mtimeMs: stat.mtimeMs };
}

function lockTime(holder) {
  const t = holder.info ? holder.info.time : undefined;
  const ms = typeof t === 'number' ? t : typeof t === 'string' ? Date.parse(t) : NaN;
  return Number.isFinite(ms) ? ms : holder.mtimeMs;
}

/** Why a lock may be taken over ('dead-process', 'too-old', 'unreadable'), or null. */
export function staleReason(holder, staleMs, now = Date.now()) {
  if (!holder.info) {
    return now - holder.mtimeMs > Math.min(staleMs, UNREADABLE_GRACE_MS) ? 'unreadable' : null;
  }
  if (now - lockTime(holder) > staleMs) return 'too-old';
  const { pid, host } = holder.info;
  const sameHost = !host || host === os.hostname();
  if (sameHost && Number.isInteger(pid) && !pidAlive(pid)) return 'dead-process';
  return null;
}

function takeOver(lockPath, expectedRaw) {
  const guard = `${lockPath}.takeover`;
  if (!tryCreate(guard, String(process.pid))) {
    try {
      if (Date.now() - fs.statSync(guard).mtimeMs > TAKEOVER_GUARD_STALE_MS) fs.unlinkSync(guard);
    } catch {
      // Gone already.
    }
    return false;
  }
  try {
    let raw;
    try {
      raw = fs.readFileSync(lockPath, 'utf8');
    } catch (err) {
      if (err && err.code === 'ENOENT') return true;
      throw err;
    }
    if (raw !== expectedRaw) return false;
    fs.unlinkSync(lockPath);
    return true;
  } finally {
    try { fs.unlinkSync(guard); } catch { /* ignore */ }
  }
}

function describeHolder(holder) {
  if (!holder || !holder.info) return 'an unreadable lock file';
  const { pid, host, time } = holder.info;
  return `process ${pid}${host ? ` on ${host}` : ''} since ${time}`;
}

async function acquire(lockPath, { staleMs, waitMs }) {
  const started = Date.now();
  let pause = 5;
  const id = crypto.randomUUID();
  for (;;) {
    const content = JSON.stringify({ pid: process.pid, time: new Date().toISOString(), host: os.hostname(), id });
    if (tryCreate(lockPath, content)) return content;
    const holder = readLock(lockPath);
    if (holder === null) continue;
    if (staleReason(holder, staleMs) && takeOver(lockPath, holder.raw)) continue;
    if (Date.now() - started >= waitMs) {
      throw new ToolkitError(
        EXIT.ERROR,
        `Another toolkit process is using ${path.dirname(lockPath)}: the lock file ${lockPath} is held by ${describeHolder(holder)}. Waited ${Math.round(waitMs / 1000)} seconds.`,
        {
          lock: lockPath,
          holder: holder.info,
          fix: `Try again. If no toolkit command is running, delete ${lockPath}.`,
        },
      );
    }
    await sleep(pause + Math.random() * pause);
    pause = Math.min(pause * 2, MAX_PAUSE_MS);
  }
}

function release(lockPath, content) {
  try {
    if (fs.readFileSync(lockPath, 'utf8') === content) fs.unlinkSync(lockPath);
  } catch {
    // Already gone, or taken over by another process after this one was too slow.
  }
}

export async function withLock(dir, fn, { name = '.lock', staleMs = 30000, waitMs = 10000 } = {}) {
  if (typeof fn !== 'function') throw new TypeError('withLock needs a function to run.');
  const lockPath = path.resolve(dir, name);
  const current = held.getStore();
  if (current && current.has(lockPath)) return await fn();

  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  const content = await acquire(lockPath, { staleMs, waitMs });
  const inside = new Set(current || []);
  inside.add(lockPath);
  try {
    return await held.run(inside, fn);
  } finally {
    release(lockPath, content);
  }
}

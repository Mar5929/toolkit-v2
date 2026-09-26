// Small helpers: dates, slugs, and running another program.

import { spawnSync } from 'node:child_process';

function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Today's date in local time, as YYYY-MM-DD. */
export function today(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** The current time as an ISO 8601 string in UTC, for example 2026-09-26T14:03:00.000Z. */
export function nowIso(date = new Date()) {
  return date.toISOString();
}

/**
 * Turn text into a lower-case slug of letters, digits, and single dashes.
 * Accents are removed. The result is at most `max` characters and is cut at a
 * dash when one is near the limit. Returns '' when nothing usable is left.
 */
export function slugify(text, max = 40) {
  let slug = String(text ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const limit = Number.isFinite(max) && max > 0 ? Math.floor(max) : 40;
  if (slug.length > limit) {
    const cut = slug.slice(0, limit + 1);
    const lastDash = cut.lastIndexOf('-');
    slug = lastDash >= Math.floor(limit / 2) ? cut.slice(0, lastDash) : slug.slice(0, limit);
    slug = slug.replace(/-+$/g, '');
  }
  return slug;
}

/**
 * Run a program and wait for it. Never throws.
 * Returns { code, stdout, stderr, timedOut, error }.
 * code is the exit code; 127 when the program was not found; 124 on timeout.
 */
export function run(cmd, args = [], { cwd, input, timeoutMs, env } = {}) {
  const result = spawnSync(cmd, args, {
    cwd,
    input,
    env: env || process.env,
    encoding: 'utf8',
    timeout: timeoutMs && timeoutMs > 0 ? timeoutMs : undefined,
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
  const stdout = result.stdout ?? '';
  const stderr = result.stderr ?? '';
  if (result.error) {
    const err = result.error;
    if (err.code === 'ETIMEDOUT') {
      return { code: 124, stdout, stderr: stderr || `${cmd} timed out after ${timeoutMs} ms`, timedOut: true, error: err };
    }
    if (err.code === 'ENOENT') {
      return { code: 127, stdout, stderr: stderr || `${cmd}: command not found`, timedOut: false, error: err };
    }
    return { code: typeof result.status === 'number' ? result.status : 1, stdout, stderr: stderr || err.message, timedOut: false, error: err };
  }
  if (result.status === null) {
    // Killed by a signal.
    return { code: 128 + signalNumber(result.signal), stdout, stderr, timedOut: false, signal: result.signal };
  }
  return { code: result.status, stdout, stderr, timedOut: false };
}

function signalNumber(signal) {
  const table = { SIGHUP: 1, SIGINT: 2, SIGQUIT: 3, SIGKILL: 9, SIGTERM: 15 };
  return table[signal] || 1;
}

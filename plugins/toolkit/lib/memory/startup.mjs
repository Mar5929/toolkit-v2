// What the session-start hook needs from memory, fast and without failing.
//
// memoryBriefing(project, opts) -> { ok, backend, source, focus, records, text, problem }
//   Built-in memory is read live from .memory/ (no network).
//   Hindsight and Notion are read from a cache file that `toolkit memory`
//   refreshes after every write; when there is no cache yet (or it was made
//   for another bank or database), a live read is tried with one overall
//   deadline (2 seconds by default). When the deadline passes, every open
//   request is stopped, so nothing keeps the hook process running afterwards.
//   It never throws: on any failure ok is false, text is one plain line
//   naming the problem, and the hook carries on.
//
// refreshCache(project, driver) writes the cache after a write. It never throws.
// The cache is <git common dir>/toolkit-v2/memory-cache.json: inside .git, so
// it is never committed, and shared by every worktree of the project.

import path from 'node:path';
import { gitInfo } from '../core/config.mjs';
import { atomicWrite, readText } from '../core/fsx.mjs';
import { DEFAULT_URL } from '../hindsight/client.mjs';
import { loadDriver } from './contract.mjs';

export const CACHE_NAME = 'memory-cache.json';

/** The cache file for a project, or null outside Git. */
export function cachePath(project) {
  const info = gitInfo(project.mainRoot || project.root);
  return info ? path.join(info.commonDir, 'toolkit-v2', CACHE_NAME) : null;
}

/**
 * Which memory store the project's settings point at, as one string. A cache
 * made for another store (for example before hindsight.bank changed) is not used.
 */
export function cacheIdentity(project) {
  const config = (project && project.config) || {};
  const backend = (config.memory && config.memory.type) || 'builtin';
  if (backend === 'hindsight') {
    const hs = config.hindsight || {};
    return `hindsight ${hs.bank || ''} ${String(hs.url || DEFAULT_URL).replace(/\/+$/, '')}`;
  }
  if (backend === 'notion') {
    const mem = (config.notion && config.notion.memory) || {};
    return `notion ${mem.dataSourceId || ''}`;
  }
  return backend;
}

export function readCache(project) {
  const file = cachePath(project);
  if (!file) return null;
  try {
    const parsed = JSON.parse(readText(file) || 'null');
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

async function snapshot(driver, identity) {
  const focus = await driver.focusGet();
  const records = await driver.list();
  return {
    schema: 2,
    backend: driver.backend,
    identity,
    location: driver.location,
    refreshedAt: new Date().toISOString(),
    focus: focus.text || '',
    records: records.map((r) => ({ key: r.key, type: r.type, description: r.description, status: r.status })),
  };
}

function writeCacheData(project, data) {
  const file = cachePath(project);
  if (!file) return { ok: false, error: 'not a Git project' };
  atomicWrite(file, `${JSON.stringify(data, null, 2)}\n`);
  return { ok: true, path: file };
}

/** Write the cache from the driver. Returns { ok, path } or { ok: false, error }. */
export async function refreshCache(project, driver) {
  try {
    return writeCacheData(project, await snapshot(driver, cacheIdentity(project)));
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/** A short text block for the session briefing, at most maxChars characters. */
export function briefingText({ backend, focus, records }, { maxChars = 2500 } = {}) {
  const lines = [];
  const live = records.filter((r) => r.status !== 'retired');
  lines.push(`Project memory (${backend}): ${live.length} record${live.length === 1 ? '' : 's'}. Search with toolkit memory find; read one with toolkit memory get <key>.`);
  if (focus && focus.trim()) {
    lines.push('', 'Current focus:', focus.trim());
  }
  const index = live.map((r) => `- ${r.key}: ${r.description}${r.status === 'needs-review' ? ' (needs review)' : ''}`);
  if (index.length) lines.push('', 'Memory records:', ...index);
  let text = lines.join('\n');
  if (text.length > maxChars) {
    const note = '\n[Cut to fit. Run toolkit memory list for every record.]';
    text = `${text.slice(0, Math.max(0, maxChars - note.length)).replace(/\n[^\n]*$/, '')}${note}`;
  }
  return text;
}

/**
 * The memory part of the session briefing. Never throws.
 * opts: { timeoutMs = 2000, maxChars = 2500, env, fetch }
 * timeoutMs is one deadline for the whole live read, not a limit per request.
 */
export async function memoryBriefing(project, { timeoutMs = 2000, maxChars = 2500, env, fetch: fetchFn } = {}) {
  const backend = (project && project.config && project.config.memory && project.config.memory.type) || 'builtin';
  const identity = cacheIdentity(project);
  const controller = new AbortController();
  let timer;
  try {
    if (backend !== 'builtin') {
      const cached = readCache(project);
      if (cached && cached.backend === backend && cached.identity === identity) {
        return { ok: true, backend, source: 'cache', focus: cached.focus, records: cached.records, text: briefingText({ backend, ...cached }, { maxChars }), problem: null };
      }
    }
    const work = (async () => {
      const driver = await loadDriver(project, { env, fetch: fetchFn, timeoutMs, signal: controller.signal });
      return snapshot(driver, identity);
    })();
    work.catch(() => {}); // after the deadline its failure is not reported
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error(`no answer within ${timeoutMs / 1000} seconds`));
      }, timeoutMs);
    });
    const data = await Promise.race([work, deadline]);
    if (backend !== 'builtin') {
      try {
        writeCacheData(project, data);
      } catch {
        // The briefing is still right; the next write refreshes the cache.
      }
    }
    return { ok: true, backend, source: 'live', focus: data.focus, records: data.records, text: briefingText({ backend, ...data }, { maxChars }), problem: null };
  } catch (err) {
    const reason = String((err && err.message) || err).replace(/\.?\s*$/, '.');
    const problem = `Project memory (${backend}) could not be read: ${reason} Work that needs memory should wait; other work can continue.`;
    return { ok: false, backend, source: null, focus: '', records: [], text: problem, problem };
  } finally {
    clearTimeout(timer);
  }
}

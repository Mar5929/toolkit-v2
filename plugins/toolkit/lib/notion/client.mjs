// The Notion API client. Every call goes through the Notion CLI:
//   ntn api <path> -X <METHOD> --notion-version 2026-03-11 [name==value ...] [-d @-]
// The JSON body is written to the command's standard input. Standard input is
// always closed after that: `ntn` waits for input forever when it is left open.
//
// What this file guarantees:
// - Retries. A 429 (rate_limited) or 529 (service_overload) is retried with
//   exponential back-off and jitter, up to 5 times. A 500, 502, 503, or 504 is
//   retried only for reads (GET, a data source query, a search). A 429 with
//   public_api_request_blocked is never retried.
// - Pace and time. Calls start at least `minIntervalMs` apart (Notion allows
//   about 3 requests a second). Each call has a timeout (`timeoutMs`); a whole
//   operation can have a deadline (`deadlineMs`, used by hooks with 2 seconds).
//   `stats` records the number of calls, the time spent, and every call slower
//   than `slowMs` (2 seconds by default), so a caller can see what a job cost.
// - Scope. A write is refused unless its target is the root page or sits under
//   it. The client finds the target from the path and body, then walks parents
//   through the API (page, block, database, data source, view) until it reaches
//   the root page or the workspace. Answers are cached in memory; ids that are
//   in scope can also be kept in a small cache file (`scopeCache`).
//   The root page id comes from config.notion.rootPageId.
//   Known trade-off: the cache file keeps a "yes, under the root" answer for
//   24 hours. A page Mike moves out of the root page can still be written to
//   by this computer until its entry expires. Only "yes" answers are kept, so a
//   page is never refused because of the cache. trust() marks an id as in scope
//   without a walk; it is only for objects the toolkit just created there.
//
// Tests replace the `runner` with a fake that answers from recorded responses.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';

export const NOTION_VERSION = '2026-03-11';
const UUID_RE = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

// ------------------------------------------------------------------ ids

/**
 * A Notion id in its dashed lower-case form. Accepts a dashed or undashed id,
 * or a Notion URL that ends in one. Returns null when there is no id.
 */
export function normalizeId(value) {
  if (!value || typeof value !== 'string') return null;
  let s = value.trim();
  const hexes = s.match(/[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
  if (!hexes) return null;
  s = hexes[hexes.length - 1].replace(/-/g, '').toLowerCase();
  if (s.length !== 32) return null;
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
}

export function isId(value) {
  return typeof value === 'string' && UUID_RE.test(value.trim());
}

function sameId(a, b) {
  const x = normalizeId(a);
  return Boolean(x) && x === normalizeId(b);
}

// ------------------------------------------------------------------ errors

/** A failed Notion call. `status` is the HTTP status (0 when none), `notionCode` the Notion error code. */
export class NotionError extends ToolkitError {
  constructor(message, { status = 0, notionCode = null, method = null, apiPath = null, uncertain = false, fix, exit = EXIT.ERROR } = {}) {
    const details = { status, notionCode, method, path: apiPath };
    if (uncertain) details.uncertain = true;
    if (fix) details.fix = fix;
    super(exit, message, details);
    this.name = 'ToolkitError';
    this.kind = 'NotionError';
    this.status = status;
    this.notionCode = notionCode;
    this.uncertain = uncertain;
  }
}

export function isNotionError(err) {
  return Boolean(err) && err.kind === 'NotionError';
}

/**
 * Read the one-line error `ntn api` prints on failure:
 *   error: Public API request failed (404 Not Found object_not_found): Could not find page ...
 * Returns { status, statusText, code, message }.
 */
export function parseNtnError(stderr) {
  const text = String(stderr || '').trim();
  const retry = /retry[- ]after[^0-9]*(\d+)/i.exec(text);
  const m = /request failed \((\d{3})\s+([^)]*?)\s+([a-z_]+)\):\s*([\s\S]*)$/i.exec(text);
  if (m) return { status: Number(m[1]), statusText: m[2], code: m[3], message: m[4].trim(), ...(retry ? { retryAfter: Number(retry[1]) } : {}) };
  const m2 = /\((\d{3})[^)]*\)/.exec(text);
  return {
    status: m2 ? Number(m2[1]) : 0,
    statusText: '',
    code: null,
    message: text.replace(/^error:\s*/i, '') || 'The Notion CLI failed without a message.',
    retryAfter: retry ? Number(retry[1]) : undefined,
  };
}

function isReadCall(method, apiPath) {
  if (method === 'GET') return true;
  if (method !== 'POST') return false;
  return /^v1\/search$/.test(apiPath) || /^v1\/data_sources\/[^/]+\/query$/.test(apiPath) || /^v1\/views\/[^/]+\/query$/.test(apiPath);
}

// ------------------------------------------------------------------ the ntn program

/** Where the ntn program is: TOOLKIT_NTN_BIN, then PATH, then the Homebrew folders. */
export function findNtn(env = process.env) {
  if (env.TOOLKIT_NTN_BIN) return env.TOOLKIT_NTN_BIN;
  const dirs = String(env.PATH || '').split(path.delimiter).filter(Boolean);
  for (const dir of [...dirs, '/opt/homebrew/bin', '/usr/local/bin']) {
    const candidate = path.join(dir, 'ntn');
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return candidate;
    } catch {
      // Not here.
    }
  }
  return 'ntn';
}

/**
 * The default runner: runs `ntn` with the arguments and the input text, and
 * resolves { code, stdout, stderr, timedOut }. Never rejects.
 */
export function ntnRunner({ bin, env = process.env } = {}) {
  const program = bin || findNtn(env);
  return (args, { input, timeoutMs } = {}) => new Promise((resolve) => {
    let child;
    try {
      child = spawn(program, args, { env, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    } catch (err) {
      resolve({ code: 127, stdout: '', stderr: `${program}: ${err.message}`, timedOut: false });
      return;
    }
    const out = [];
    const errs = [];
    let timedOut = false;
    let timer = null;
    if (timeoutMs && timeoutMs > 0) {
      timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
      }, timeoutMs);
    }
    child.stdout.on('data', (d) => out.push(d));
    child.stderr.on('data', (d) => errs.push(d));
    child.on('error', (err) => {
      if (timer) clearTimeout(timer);
      const code = err.code === 'ENOENT' ? 127 : 1;
      resolve({ code, stdout: '', stderr: err.code === 'ENOENT' ? `${program}: command not found` : err.message, timedOut: false });
    });
    child.on('close', (code) => {
      if (timer) clearTimeout(timer);
      resolve({
        code: timedOut ? 124 : (code ?? 1),
        stdout: Buffer.concat(out).toString('utf8'),
        stderr: Buffer.concat(errs).toString('utf8'),
        timedOut,
      });
    });
    child.stdin.on('error', () => { /* the program exited before reading its input */ });
    child.stdin.end(input === undefined || input === null ? '' : input);
  });
}

// ------------------------------------------------------------------ scope cache file

/**
 * A small JSON file that remembers ids known to be under the root page.
 * Only positive answers are kept, each for `ttlMs` (one day by default), so a
 * page Mike moves out of the root is refused again after that.
 */
export function fileScopeCache(file, { ttlMs = 24 * 60 * 60 * 1000 } = {}) {
  let data = null;
  const load = () => {
    if (data) return data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      data = {};
    }
    if (!data || typeof data !== 'object') data = {};
    return data;
  };
  return {
    has(rootId, id) {
      const d = load();
      const entry = d[rootId] && d[rootId][id];
      return typeof entry === 'number' && Date.now() - entry < ttlMs;
    },
    add(rootId, ids) {
      const d = load();
      d[rootId] = d[rootId] || {};
      const now = Date.now();
      for (const id of ids) d[rootId][id] = now;
      try {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        const tmp = `${file}.${process.pid}.tmp`;
        fs.writeFileSync(tmp, `${JSON.stringify(d)}\n`);
        fs.renameSync(tmp, file);
      } catch {
        // A cache that cannot be written only costs extra calls.
      }
    },
  };
}

// ------------------------------------------------------------------ client

const sleepMs = (ms) => new Promise((r) => setTimeout(r, ms));

export class NotionClient {
  /**
   * @param {object} opts
   * @param {string} [opts.rootPageId]  writes must target this page or something under it
   * @param {Function} [opts.runner]    (args, { input, timeoutMs }) => Promise<{ code, stdout, stderr, timedOut }>
   * @param {string} [opts.bin]         path to ntn (default: findNtn)
   * @param {object} [opts.env]
   * @param {number} [opts.timeoutMs=30000]  one call
   * @param {number} [opts.deadlineMs]       the whole job, from the first call
   * @param {number} [opts.maxRetries=5]
   * @param {number} [opts.minIntervalMs=340]  the gap between call starts; TOOLKIT_NOTION_MIN_INTERVAL_MS changes it
   * @param {number} [opts.slowMs=2000]
   * @param {Function} [opts.sleep]     injectable wait, for tests
   * @param {Function} [opts.random]    injectable jitter source, for tests
   * @param {string[]} [opts.knownInScope]  ids already known to be under the root (from .toolkit.json)
   * @param {object} [opts.scopeCache] { has(rootId, id), add(rootId, ids) }
   */
  constructor(opts = {}) {
    this.rootPageId = normalizeId(opts.rootPageId || '') || null;
    this.env = opts.env || process.env;
    this.runner = opts.runner || ntnRunner({ bin: opts.bin, env: this.env });
    this.notionVersion = opts.notionVersion || NOTION_VERSION;
    this.timeoutMs = opts.timeoutMs ?? 30000;
    this.deadlineMs = opts.deadlineMs ?? null;
    this.maxRetries = opts.maxRetries ?? 5;
    const envGap = Number.parseInt(this.env.TOOLKIT_NOTION_MIN_INTERVAL_MS ?? '', 10);
    this.minIntervalMs = opts.minIntervalMs ?? (Number.isFinite(envGap) && envGap >= 0 ? envGap : 340);
    this.slowMs = opts.slowMs ?? 2000;
    this.sleep = opts.sleep || sleepMs;
    this.random = opts.random || Math.random;
    this.scopeCache = opts.scopeCache || null;
    this.started = null;
    this.lastStart = 0;
    this.stats = { calls: 0, retries: 0, totalMs: 0, slowCalls: [] };
    this.parents = new Map(); // id -> { kind, id } | { kind: 'workspace' }
    this.kinds = new Map(); // id -> 'page' | 'database' | 'data_source' | 'block' | 'view'
    this.inScope = new Map(); // id -> boolean
    if (this.rootPageId) this.inScope.set(this.rootPageId, true);
    for (const id of opts.knownInScope || []) {
      const n = normalizeId(id);
      if (n) this.inScope.set(n, true);
    }
  }

  // ---------------------------------------------------------------- raw call

  /**
   * Call one API endpoint. `apiPath` is like "v1/pages/<id>" (a leading slash is fine).
   * Returns the parsed JSON response. Throws NotionError.
   */
  async request(method, apiPath, { query, body, checkScope = true, timeoutMs } = {}) {
    const verb = String(method || 'GET').toUpperCase();
    const p = String(apiPath).replace(/^\/+/, '');
    if (checkScope && !isReadCall(verb, p)) await this.assertWritable(verb, p, body);
    return this.send(verb, p, { query, body, timeoutMs });
  }

  async send(verb, p, { query, body, timeoutMs } = {}) {
    const args = ['api', p, '-X', verb, '--notion-version', this.notionVersion];
    for (const [k, v] of Object.entries(query || {})) {
      if (v === undefined || v === null) continue;
      args.push(`${k}==${v}`);
    }
    let input = '';
    if (body !== undefined && body !== null) {
      args.push('-d', '@-');
      input = JSON.stringify(body);
    }
    const read = isReadCall(verb, p);
    let attempt = 0;
    for (;;) {
      await this.pace();
      const remaining = this.remainingMs();
      if (remaining !== null && remaining <= 0) {
        throw new NotionError(`Notion did not answer in time: the ${this.deadlineMs} ms limit for this job ran out before ${verb} ${p}.`, {
          method: verb, apiPath: p, status: 0, notionCode: 'deadline',
        });
      }
      const limit = remaining === null ? (timeoutMs ?? this.timeoutMs) : Math.min(remaining, timeoutMs ?? this.timeoutMs);
      const t0 = Date.now();
      const res = await this.runner(args, { input, timeoutMs: limit });
      const ms = Date.now() - t0;
      this.stats.calls += 1;
      this.stats.totalMs += ms;
      if (ms > this.slowMs) this.stats.slowCalls.push({ method: verb, path: p, ms });

      if (res.code === 0) {
        const text = String(res.stdout || '').trim();
        if (!text) return {};
        let json;
        try {
          json = JSON.parse(text);
        } catch (err) {
          throw new NotionError(`Notion answered ${verb} ${p} with text that is not JSON: ${err.message}`, { method: verb, apiPath: p });
        }
        this.note(json);
        return json;
      }

      if (res.code === 127) {
        throw new NotionError('The Notion CLI (ntn) was not found on this computer.', {
          method: verb, apiPath: p, notionCode: 'ntn_missing',
          fix: 'Install it with "npm install -g ntn", run "ntn login", or set TOOLKIT_NTN_BIN to its path.',
        });
      }

      if (/no auth token|ntn login/i.test(res.stderr || '') && !/request failed/i.test(res.stderr || '')) {
        throw new NotionError('The Notion CLI has no sign-in it can use here.', {
          method: verb, apiPath: p, notionCode: 'no_auth',
          fix: 'Run "ntn login" in a terminal. In a Codex session the sandbox blocks the keychain: run toolkit commands outside the sandbox (the project\'s .codex/rules/toolkit.rules allows that).',
        });
      }
      const err = res.timedOut
        ? { status: 0, code: 'timeout', message: `No answer within ${limit} ms.` }
        : parseNtnError(res.stderr);
      const status = err.status || 0;
      const code = err.code || null;
      const rateLimited = (status === 429 && code !== 'public_api_request_blocked') || status === 529 || code === 'rate_limited' || code === 'service_overload';
      const serverError = [500, 502, 503, 504].includes(status) || (res.timedOut && read);
      const retryable = rateLimited || (serverError && read);
      if (retryable && attempt < this.maxRetries) {
        attempt += 1;
        this.stats.retries += 1;
        const base = err.retryAfter ? err.retryAfter * 1000 : 1000 * 2 ** (attempt - 1);
        const wait = Math.min(60000, Math.round(base * (0.75 + this.random() * 0.5)));
        const left = this.remainingMs();
        if (left !== null && wait >= left) {
          throw new NotionError(`Notion is busy (${status || code}) and the time limit for this job does not allow another try.`, {
            method: verb, apiPath: p, status, notionCode: code,
          });
        }
        await this.sleep(wait);
        continue;
      }
      throw this.toError(verb, p, status, code, err.message, res.timedOut);
    }
  }

  toError(verb, p, status, code, message, timedOut) {
    let fix;
    if (status === 401 || code === 'unauthorized') fix = 'Run "ntn login" in a terminal to sign in to Notion again, then retry.';
    else if (status === 404 || code === 'object_not_found') fix = 'Check the id, and that the page is shared with the "Notion CLI" connection.';
    else if (status === 429 || status === 529) fix = 'Wait a minute and try again.';
    const uncertain = !isReadCall(verb, p) && (timedOut || status >= 500 || status === 0);
    const lead = timedOut ? 'Notion did not answer in time' : `Notion refused ${verb} ${p}`;
    const exit = status === 400 && code === 'validation_error' ? EXIT.INVALID : EXIT.ERROR;
    return new NotionError(`${lead}${status ? ` (${status}${code ? ` ${code}` : ''})` : ''}: ${message}`, {
      status, notionCode: code, method: verb, apiPath: p, uncertain, fix, exit,
    });
  }

  remainingMs() {
    if (!this.deadlineMs) return null;
    if (this.started === null) return this.deadlineMs;
    return this.deadlineMs - (Date.now() - this.started);
  }

  async pace() {
    const now = Date.now();
    if (this.started === null) this.started = now;
    const gap = now - this.lastStart;
    if (this.lastStart && gap < this.minIntervalMs) await this.sleep(this.minIntervalMs - gap);
    this.lastStart = Date.now();
  }

  /** Remember the parent of every object seen in a response, so scope checks need fewer calls. */
  note(json) {
    const visit = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach(visit);
        return;
      }
      const kind = obj.object;
      if (obj.id && ['page', 'database', 'data_source', 'block', 'view'].includes(kind)) {
        const id = normalizeId(obj.id);
        if (id) {
          this.kinds.set(id, kind);
          const ref = parentRef(obj.parent);
          if (ref) this.parents.set(id, ref);
        }
      }
      if (Array.isArray(obj.results)) obj.results.forEach(visit);
    };
    visit(json);
  }

  // ---------------------------------------------------------------- scope

  /** Throws unless a write with this method, path, and body targets the root page or something under it. */
  async assertWritable(verb, p, body) {
    const targets = writeTargets(verb, p, body);
    if (targets === null) {
      throw new NotionError(`Writes to ${p} are not allowed by the toolkit.`, { method: verb, apiPath: p, notionCode: 'outside_root', exit: EXIT.INVALID });
    }
    if (!this.rootPageId) {
      throw new NotionError('No Notion root page is set, so every Notion write is refused.', {
        method: verb, apiPath: p, notionCode: 'no_root',
        fix: 'Run "toolkit notion ensure-root --root-page <id>" to set the root page.',
        exit: EXIT.INVALID,
      });
    }
    for (const t of targets) {
      if (t.kind === 'workspace' || !(await this.isUnderRoot(t))) {
        throw new NotionError(
          t.kind === 'workspace'
            ? `Refused: ${verb} ${p} would write at the top of the workspace, outside the root page.`
            : `Refused: ${verb} ${p} targets ${t.kind} ${t.id}, which is not under the root page ${this.rootPageId}.`,
          { method: verb, apiPath: p, notionCode: 'outside_root', exit: EXIT.INVALID },
        );
      }
    }
  }

  /** True when the object is the root page or has it as an ancestor. */
  async isUnderRoot(ref) {
    const chain = [];
    let cur = ref && ref.id ? { kind: ref.kind, id: normalizeId(ref.id) } : null;
    for (let depth = 0; cur && depth < 60; depth++) {
      if (cur.kind === 'workspace') return this.remember(chain, false);
      const id = cur.id;
      if (!id) return this.remember(chain, false);
      if (this.inScope.has(id)) return this.remember(chain, this.inScope.get(id));
      if (this.scopeCache && this.rootPageId && this.scopeCache.has(this.rootPageId, id)) {
        this.inScope.set(id, true);
        return this.remember(chain, true);
      }
      chain.push(id);
      let parent = this.parents.get(id);
      if (!parent) parent = await this.fetchParent(cur);
      if (!parent) return this.remember(chain, false);
      cur = parent;
    }
    return this.remember(chain, false);
  }

  remember(chain, value) {
    for (const id of chain) this.inScope.set(id, value);
    if (value && this.scopeCache && this.rootPageId && chain.length) this.scopeCache.add(this.rootPageId, chain);
    return value;
  }

  async fetchParent({ kind, id }) {
    const route = {
      page: `v1/pages/${id}`,
      database: `v1/databases/${id}`,
      data_source: `v1/data_sources/${id}`,
      view: `v1/views/${id}`,
      block: `v1/blocks/${id}`,
    }[kind] || `v1/blocks/${id}`;
    try {
      const obj = await this.send('GET', route);
      return parentRef(obj.parent);
    } catch (err) {
      if (isNotionError(err) && err.status === 404 && kind === 'page') {
        // A page id can also be read as a block.
        try {
          const obj = await this.send('GET', `v1/blocks/${id}`);
          return parentRef(obj.parent);
        } catch {
          return null;
        }
      }
      if (isNotionError(err) && (err.status === 404 || err.status === 400)) return null;
      throw err;
    }
  }

  /** Mark ids as known to be under the root (ids the toolkit created there). */
  trust(...ids) {
    for (const id of ids.flat()) {
      const n = normalizeId(id || '');
      if (n) this.inScope.set(n, true);
    }
  }

  // ---------------------------------------------------------------- helpers

  get(p, query, opts = {}) { return this.request('GET', p, { ...opts, query }); }
  post(p, body, opts = {}) { return this.request('POST', p, { ...opts, body }); }
  patch(p, body, opts = {}) { return this.request('PATCH', p, { ...opts, body }); }
  del(p, opts = {}) { return this.request('DELETE', p, opts); }

  whoami() { return this.get('v1/users/me'); }
  getPage(id) { return this.get(`v1/pages/${normalizeId(id) || id}`); }
  createPage(body) { return this.post('v1/pages', body); }
  updatePage(id, body) { return this.patch(`v1/pages/${normalizeId(id) || id}`, body); }
  getMarkdown(id) { return this.get(`v1/pages/${normalizeId(id) || id}/markdown`); }
  patchMarkdown(id, body) { return this.patch(`v1/pages/${normalizeId(id) || id}/markdown`, body); }
  getDatabase(id) { return this.get(`v1/databases/${normalizeId(id) || id}`); }
  createDatabase(body) { return this.post('v1/databases', body); }
  getDataSource(id) { return this.get(`v1/data_sources/${normalizeId(id) || id}`); }
  updateDataSource(id, body) { return this.patch(`v1/data_sources/${normalizeId(id) || id}`, body); }
  getView(id) { return this.get(`v1/views/${normalizeId(id) || id}`); }
  createView(body) { return this.post('v1/views', body); }
  updateView(id, body) { return this.patch(`v1/views/${normalizeId(id) || id}`, body); }

  /** Every row of a data source that matches, following next_cursor. */
  async queryAll(dataSourceId, { filter, sorts, pageSize = 100, max = 10000 } = {}) {
    const results = [];
    let cursor;
    const id = normalizeId(dataSourceId) || dataSourceId;
    for (;;) {
      const body = { page_size: pageSize };
      if (filter) body.filter = filter;
      if (sorts) body.sorts = sorts;
      if (cursor) body.start_cursor = cursor;
      const res = await this.post(`v1/data_sources/${id}/query`, body);
      results.push(...(res.results || []));
      if (!res.has_more || !res.next_cursor || results.length >= max) break;
      cursor = res.next_cursor;
    }
    return results;
  }

  /** Every child block of a page or block, following next_cursor. */
  async childrenAll(blockId) {
    const results = [];
    let cursor;
    const id = normalizeId(blockId) || blockId;
    for (;;) {
      const query = { page_size: 100 };
      if (cursor) query.start_cursor = cursor;
      const res = await this.get(`v1/blocks/${id}/children`, query);
      results.push(...(res.results || []));
      if (!res.has_more || !res.next_cursor) break;
      cursor = res.next_cursor;
    }
    return results;
  }

  /** Every view of a database. */
  async viewsAll(databaseId) {
    const results = [];
    let cursor;
    const id = normalizeId(databaseId) || databaseId;
    for (;;) {
      const query = { database_id: id, page_size: 100 };
      if (cursor) query.start_cursor = cursor;
      const res = await this.get('v1/views', query);
      results.push(...(res.results || []));
      if (!res.has_more || !res.next_cursor) break;
      cursor = res.next_cursor;
    }
    return results;
  }
}

/** { kind, id } for a Notion parent object, or null. */
export function parentRef(parent) {
  if (!parent || typeof parent !== 'object') return null;
  switch (parent.type) {
    case 'workspace': return { kind: 'workspace' };
    case 'page_id': return { kind: 'page', id: normalizeId(parent.page_id) };
    case 'database_id': return { kind: 'database', id: normalizeId(parent.database_id) };
    case 'data_source_id': return { kind: 'data_source', id: normalizeId(parent.data_source_id) };
    case 'block_id': return { kind: 'block', id: normalizeId(parent.block_id) };
    default:
      if (parent.workspace === true) return { kind: 'workspace' };
      if (parent.page_id) return { kind: 'page', id: normalizeId(parent.page_id) };
      if (parent.data_source_id) return { kind: 'data_source', id: normalizeId(parent.data_source_id) };
      if (parent.database_id) return { kind: 'database', id: normalizeId(parent.database_id) };
      if (parent.block_id) return { kind: 'block', id: normalizeId(parent.block_id) };
      return null;
  }
}

/**
 * The objects a write changes, as [{ kind, id }], or null when the toolkit
 * does not know the endpoint (such writes are refused).
 */
export function writeTargets(verb, p, body = {}) {
  const b = body && typeof body === 'object' ? body : {};
  const seg = p.split('?')[0].split('/').filter(Boolean); // ['v1', 'pages', id, ...]
  if (seg[0] !== 'v1') return null;
  const [, res, id, sub] = seg;
  const out = [];
  const addParent = (parent) => {
    const ref = parentRef(parent);
    if (ref) out.push(ref);
    return Boolean(ref);
  };
  switch (res) {
    case 'pages':
      if (!id) {
        if (verb !== 'POST' || !addParent(b.parent)) return null;
        return out;
      }
      out.push({ kind: 'page', id: normalizeId(id) });
      if (sub === 'move' && b.parent && !addParent(b.parent)) return null;
      if (sub && !['markdown', 'move', 'properties'].includes(sub)) return null;
      return out;
    case 'databases':
      if (!id) {
        if (verb !== 'POST' || !addParent(b.parent)) return null;
        return out;
      }
      out.push({ kind: 'database', id: normalizeId(id) });
      if (b.parent && !addParent(b.parent)) return null;
      return out;
    case 'data_sources':
      if (!id) {
        if (verb !== 'POST' || !addParent(b.parent)) return null;
        return out;
      }
      if (sub) return null;
      out.push({ kind: 'data_source', id: normalizeId(id) });
      return out;
    case 'views':
      if (!id) {
        if (verb !== 'POST') return null;
        if (b.database_id) out.push({ kind: 'database', id: normalizeId(b.database_id) });
        else if (b.view_id) out.push({ kind: 'view', id: normalizeId(b.view_id) });
        else if (b.create_database && b.create_database.parent) {
          if (!addParent(b.create_database.parent)) return null;
        } else return null;
        return out;
      }
      out.push({ kind: 'view', id: normalizeId(id) });
      return out;
    case 'blocks':
      if (!id) return null;
      out.push({ kind: 'block', id: normalizeId(id) });
      return out;
    case 'comments':
      if (verb !== 'POST') return null;
      if (b.parent && b.parent.page_id) out.push({ kind: 'page', id: normalizeId(b.parent.page_id) });
      else if (b.parent && b.parent.block_id) out.push({ kind: 'block', id: normalizeId(b.parent.block_id) });
      else return null;
      return out;
    default:
      return null;
  }
}

export { sameId };

// A small HTTP client for the local Hindsight server (hindsight-api 0.10.1).
//
// Every route was checked against the running server on 2026-09-26:
//   GET    /health                                         server and database health
//   GET    /version
//   GET    /v1/default/banks                               ?q (id contains), limit, offset -> { banks, total, limit, offset };
//                                                          each row has fact_count, last_document_at, last_write_at
//                                                          (current at once after a write: use it for "last save")
//   PUT    /v1/default/banks/{bank}                        create or update a bank (POST returns 405)
//   DELETE /v1/default/banks/{bank}                        delete the bank and everything in it
//   GET    /v1/default/banks/{bank}/config                 { bank_id, config, overrides }; 404 for a bank never made,
//                                                          but 200 with defaults for a bank deleted earlier: use bankExists()
//   PATCH  /v1/default/banks/{bank}/config                 body { "updates": { ... } } (a flat body returns 422)
//   GET    /v1/default/banks/{bank}/stats                  counts and last_memory_write_at; can lag behind
//                                                          writes by a minute or more, so the toolkit does not use it
//   POST   /v1/default/banks/{bank}/memories               retain { items: [MemoryItem], async }
//   POST   /v1/default/banks/{bank}/memories/recall        { query, budget, max_tokens, tag_groups, ... }
//   POST   /v1/default/banks/{bank}/reflect                { query, budget, tag_groups, ... } -> { text, ... }
//   GET    /v1/default/banks/{bank}/documents              ?q, tags (repeat), tags_match, limit, offset -> { items, total }
//   GET    /v1/default/banks/{bank}/documents/{id}         { original_text, content_hash (SHA-256 of it), tags, document_metadata, ... }
//   DELETE /v1/default/banks/{bank}/documents/{id}         404 when missing
// A retain with an existing document_id replaces that document, its tags, and its metadata.
// Metadata values must be strings.
//
// Errors become ToolkitError: an unreachable server or a refused request is
// ERROR (exit 1) with a `fix` line. Methods that read one thing return null
// for a 404 instead of throwing.

import { EXIT, ToolkitError } from '../core/output.mjs';

export const DEFAULT_URL = 'http://127.0.0.1:8888';
export const TENANT = 'default';
export const BANK_ID_RE = /^[a-z][a-z0-9-]{0,62}$/;
const DEFAULT_TIMEOUT_MS = 30000;
export const REFLECT_TIMEOUT_MS = 300000;
export const HEALTH_TIMEOUT_MS = 2000;

/** Throws INVALID unless the bank id is lower-case letters, digits, and dashes, starting with a letter. */
export function assertBankId(bank) {
  const b = String(bank ?? '');
  if (!BANK_ID_RE.test(b)) {
    throw new ToolkitError(EXIT.INVALID, `"${b}" is not a usable Hindsight bank id. Use lower-case letters, digits, and dashes, starting with a letter (at most 63 characters).`, { bank: b });
  }
  return b;
}

/**
 * True when the connection was refused by a sandbox, not by the server: the
 * Codex sandbox blocks the network with EPERM for a command it runs, while a
 * server that is down gives ECONNREFUSED.
 */
export function sandboxBlocked(err) {
  const cause = (err && err.cause) || {};
  return cause.code === 'EPERM' || cause.code === 'EACCES' || /\bconnect EPERM\b/.test(String(cause.message || err && err.message || ''));
}

/** The fix for a request the Codex sandbox blocked. */
export const SANDBOX_FIX = 'The Codex sandbox blocked the network for this command; the server itself may be fine. Run the toolkit command alone on its own line (no &&, ;, pipe, heredoc, or script around it), so the project\'s .codex/rules/toolkit.rules runs it outside the sandbox, or ask the owner to approve running it outside the sandbox.';

function describeFailure(err, timeoutMs) {
  if (!err) return 'no answer';
  if (err.name === 'TimeoutError' || err.name === 'AbortError') return `no answer within ${Math.round(timeoutMs / 100) / 10} seconds`;
  const cause = err.cause || {};
  if (cause.code === 'ECONNREFUSED') return 'nothing is listening there';
  if (cause.code) return `${cause.code}${cause.message ? `: ${cause.message}` : ''}`;
  return err.message || String(err);
}

/** One signal that fires when any of the given signals fires. */
function anySignal(signals) {
  if (typeof AbortSignal.any === 'function') return AbortSignal.any(signals);
  const controller = new AbortController();
  for (const s of signals) {
    if (s.aborted) {
      controller.abort(s.reason);
      break;
    }
    s.addEventListener('abort', () => controller.abort(s.reason), { once: true });
  }
  return controller.signal;
}

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]', '::1']);

/**
 * Throws INVALID unless the URL points at this computer. Toolkit V2 uses only
 * a Hindsight server running on this Mac, never Hindsight Cloud or another machine.
 */
export function assertLocalUrl(url) {
  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    throw new ToolkitError(EXIT.INVALID, `"${url}" is not a URL.`);
  }
  const host = parsed.hostname.toLowerCase();
  if (!(LOOPBACK_HOSTS.has(host) || /^127\.\d+\.\d+\.\d+$/.test(host)) || !/^https?:$/.test(parsed.protocol)) {
    throw new ToolkitError(EXIT.INVALID, `The Hindsight URL ${url} is not on this computer. Toolkit V2 uses only a local Hindsight server (for example ${DEFAULT_URL}), never Hindsight Cloud.`, {
      url: String(url),
      fix: `Set hindsight.url in .toolkit.json to ${DEFAULT_URL}.`,
    });
  }
  return String(url);
}

export class HindsightClient {
  /**
   * @param {object} opts
   * @param {string} [opts.url]       server base URL (default http://127.0.0.1:8888)
   * @param {string} [opts.bank]      bank id for the bank methods
   * @param {Function} [opts.fetch]   fetch to use (tests may pass their own)
   * @param {number} [opts.timeoutMs] the longest one request may take (default 30 s;
   *                                   reflect has its own, longer limit unless this is shorter)
   * @param {AbortSignal} [opts.signal] when it fires, every open request stops at once
   */
  constructor({ url = DEFAULT_URL, bank, fetch: fetchFn, timeoutMs, signal } = {}) {
    this.url = assertLocalUrl(String(url || DEFAULT_URL)).replace(/\/+$/, '');
    this.bank = bank || null;
    this.fetch = fetchFn || globalThis.fetch;
    this.limitMs = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : null;
    this.timeoutMs = this.limitMs || DEFAULT_TIMEOUT_MS;
    this.signal = signal || null;
    if (typeof this.fetch !== 'function') {
      throw new ToolkitError(EXIT.ERROR, 'This Node.js has no fetch. The toolkit needs Node.js 20 or newer.');
    }
  }

  /** A client for another bank on the same server. */
  forBank(bank) {
    return new HindsightClient({ url: this.url, bank, fetch: this.fetch, timeoutMs: this.limitMs || undefined, signal: this.signal || undefined });
  }

  bankPath(sub = '', bank = this.bank) {
    if (!bank) throw new ToolkitError(EXIT.ERROR, 'No Hindsight bank was given.');
    return `/v1/${TENANT}/banks/${encodeURIComponent(bank)}${sub}`;
  }

  /**
   * One HTTP request. Returns the parsed JSON body ({} when empty), or null for a
   * 404 when allow404 is true. Throws ToolkitError otherwise.
   */
  async request(method, pathname, { body, query, timeoutMs, allow404 = false } = {}) {
    const url = new URL(pathname, `${this.url}/`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null || v === '') continue;
        if (Array.isArray(v)) for (const item of v) url.searchParams.append(k, String(item));
        else url.searchParams.set(k, String(v));
      }
    }
    // A limit given to the client (for example 2 s at session start) caps every request.
    const asked = timeoutMs || this.timeoutMs;
    const wait = this.limitMs ? Math.min(asked, this.limitMs) : asked;
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    let res;
    try {
      res = await this.fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: this.signal ? anySignal([this.signal, AbortSignal.timeout(wait)]) : AbortSignal.timeout(wait),
      });
    } catch (err) {
      if (sandboxBlocked(err)) {
        throw new ToolkitError(EXIT.ERROR, `The request to the Hindsight server at ${this.url} was blocked before it left this computer (${describeFailure(err, wait)}). This is the Codex sandbox, not the server.`, {
          url: this.url,
          unreachable: true,
          sandbox: true,
          fix: SANDBOX_FIX,
        });
      }
      throw new ToolkitError(EXIT.ERROR, `The Hindsight server at ${this.url} did not answer ${method} ${url.pathname} (${describeFailure(err, wait)}).`, {
        url: this.url,
        unreachable: true,
        fix: 'Run toolkit hindsight health. If the service is stopped, run toolkit hindsight service start.',
      });
    }
    const text = await res.text();
    let json = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }
    if (res.status === 404 && allow404) return null;
    if (!res.ok) {
      const detail = json && json.detail !== undefined
        ? (typeof json.detail === 'string' ? json.detail : JSON.stringify(json.detail))
        : text.slice(0, 300);
      throw new ToolkitError(EXIT.ERROR, `Hindsight refused ${method} ${url.pathname}: HTTP ${res.status}${detail ? ` (${detail})` : ''}.`, {
        url: this.url,
        status: res.status,
        detail,
      });
    }
    return json === null ? {} : json;
  }

  // ------------------------------------------------------------ server

  async health({ timeoutMs = HEALTH_TIMEOUT_MS } = {}) {
    return this.request('GET', '/health', { timeoutMs });
  }

  async version({ timeoutMs = HEALTH_TIMEOUT_MS } = {}) {
    return this.request('GET', '/version', { timeoutMs });
  }

  /** Every bank, or those whose id contains q. Follows pages. */
  async listBanks({ q } = {}) {
    const all = [];
    const limit = 100;
    for (let offset = 0; offset < 100000; offset += limit) {
      const res = await this.request('GET', `/v1/${TENANT}/banks`, { query: { q, limit, offset } });
      const banks = Array.isArray(res.banks) ? res.banks : [];
      all.push(...banks);
      if (banks.length < limit || all.length >= (res.total ?? 0)) break;
    }
    return all;
  }

  /**
   * The bank's row from the bank list, or null when the bank does not exist:
   * { bank_id, fact_count, last_document_at, last_write_at, ... }.
   * last_write_at is the newest write of a document that still exists (null
   * for an empty bank), and it is current at once, unlike GET .../stats.
   */
  async getBank(bank = this.bank) {
    const banks = await this.listBanks({ q: bank });
    return banks.find((b) => b && b.bank_id === bank) || null;
  }

  /**
   * True when the bank exists. Uses the bank list: after a bank is deleted,
   * GET .../config can still answer 200 with default settings (seen on
   * 0.10.1), so the config route cannot tell whether a bank exists.
   */
  async bankExists(bank = this.bank) {
    return (await this.getBank(bank)) !== null;
  }

  // ------------------------------------------------------------ banks

  /** { bank_id, config, overrides }, or null when the bank does not exist. */
  async getBankConfig(bank = this.bank) {
    return this.request('GET', this.bankPath('/config', bank), { allow404: true });
  }

  /** Create or update a bank (PUT). body: reflect_mission, retain_mission, ... */
  async putBank(body = {}, bank = this.bank) {
    return this.request('PUT', this.bankPath('', bank), { body });
  }

  /** Change bank settings. The server wants them wrapped in { updates }. */
  async patchBankConfig(updates, bank = this.bank) {
    return this.request('PATCH', this.bankPath('/config', bank), { body: { updates } });
  }

  /** Delete a bank and everything in it. Returns null when it does not exist. */
  async deleteBank(bank = this.bank) {
    return this.request('DELETE', this.bankPath('', bank), { allow404: true });
  }

  /** Bank counts. Can lag behind writes on 0.10.1: use getBank() and countDocuments() instead. */
  async stats(bank = this.bank) {
    return this.request('GET', this.bankPath('/stats', bank), { allow404: true });
  }

  // ------------------------------------------------------------ memories

  /** Store items. Waits until stored unless async is true. */
  async retain(items, { async = false } = {}) {
    return this.request('POST', this.bankPath('/memories'), { body: { items, async } });
  }

  async recall(body) {
    return this.request('POST', this.bankPath('/memories/recall'), { body });
  }

  async reflect(body, { timeoutMs = REFLECT_TIMEOUT_MS } = {}) {
    return this.request('POST', this.bankPath('/reflect'), { body, timeoutMs });
  }

  // ------------------------------------------------------------ documents

  /** One document with original_text, or null. */
  async getDocument(id) {
    return this.request('GET', this.bankPath(`/documents/${encodeURIComponent(id)}`), { allow404: true });
  }

  /** One page of documents (no text): { items, total, limit, offset }. */
  async listDocuments({ q, tags, tagsMatch, limit = 100, offset = 0 } = {}) {
    return this.request('GET', this.bankPath('/documents'), {
      query: { q, tags, tags_match: tagsMatch, limit, offset },
    });
  }

  /** How many documents the bank holds (records, the focus, and the glossary). */
  async countDocuments(filters = {}) {
    const page = await this.listDocuments({ ...filters, limit: 1, offset: 0 });
    return typeof page.total === 'number' ? page.total : (Array.isArray(page.items) ? page.items.length : 0);
  }

  /** Every document matching the filters, following pages. */
  async listAllDocuments(filters = {}) {
    const all = [];
    const limit = 100;
    for (let offset = 0; offset < 100000; offset += limit) {
      const page = await this.listDocuments({ ...filters, limit, offset });
      const items = Array.isArray(page.items) ? page.items : [];
      all.push(...items);
      if (items.length < limit || all.length >= (page.total ?? 0)) break;
    }
    return all;
  }

  /** Delete one document and its memory units. Returns null when it does not exist. */
  async deleteDocument(id) {
    return this.request('DELETE', this.bankPath(`/documents/${encodeURIComponent(id)}`), { allow404: true });
  }
}

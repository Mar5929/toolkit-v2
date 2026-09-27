// Hindsight memory: one bank on the local Hindsight server per project.
//
// .toolkit.json: "hindsight": { "url": "http://127.0.0.1:8888", "bank": "<id>" }
// (url may be left out). `toolkit hindsight ensure-bank` creates the bank and
// sets it to store records exactly (`chunks` extraction, no language model on save).
//
// Mapping (ARCHITECTURE section 7):
//   record        document id = key; content = serializeRecord(record), stored exactly
//                 (the model's topic format, the same text as a built-in .memory/ file);
//                 tags kind:record, type:<type>, status:<status> (the contract status:
//                 current, needs-review, or retired);
//                 metadata = the record's fields as strings (lists read them from here),
//                 including saved, which is not part of the stored text, and
//                 stored_status (superseded or archived for a retired record)
//   rename        a new document under the new key, then the old one is deleted
//   links         links in other records to a renamed, superseded, archived, or
//                 deleted record are repaired the same way as in built-in memory;
//                 a record that cannot be saved is skipped and reported (linksFailed)
//   current focus document id "focus", tag kind:focus
//   glossary      document id "glossary", tag kind:glossary
//   find          recall with tag_groups: kind:record and not status:retired
//   find --reflect  the same recall, plus reflect for a synthesized answer (uses the
//                 server's language model; slow, about 20 to 30 seconds). The
//                 question is sent with "Always answer in plain English." in front,
//                 and the bank's reflect mission says the same.
//   version       SHA-256 of the stored text (the server's content_hash)
//   last save     the newer of the bank row's last_write_at and the time this
//                 command last wrote (kept with the last export time in
//                 <git common dir>/toolkit-v2/hindsight-meta.json, shared by every
//                 worktree and never committed)
//
// The server has no compare-and-swap, so `expect` is checked with a read just
// before the write. With one person and one computer that gap is acceptable.
//
// Implements MemoryDriver from contract.mjs.

import path from 'node:path';
import { gitInfo } from '../core/config.mjs';
import { atomicWrite, readText } from '../core/fsx.mjs';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { today as localToday } from '../core/util.mjs';
import { DEFAULT_URL, HindsightClient, assertBankId } from '../hindsight/client.mjs';
import { PLAIN_ENGLISH, settingsProblems } from '../hindsight/bank.mjs';
import {
  FOCUS_ID, GLOSSARY_ID, assertFilter, assertKey, assertValidFocus, assertValidGlossary, assertValidRecord,
  approverFrom, changeRecordStatus, changeSupersedes, checkExpect, countRecords, focusLineCount, isValidKey, matchesFilter,
  normalizeDocument, normalizeRecord, notFound, parseRecord, recordSummary, renameRecordText, repairLinks,
  repairLinksWithDriver, repairResult, restoreNote, retireNote, serializeRecord, sortRecords, splitKey, storedStatus, stripFrontmatter, versionOf,
  RECORD_TYPES,
} from './contract.mjs';

export const backend = 'hindsight';
export const RECORD_TAG = 'kind:record';
export const META_NAME = 'hindsight-meta.json';

/**
 * options: { root, mainRoot, config, fetch, now, timeoutMs, signal } (see contract.mjs).
 * A project with no hindsight.bank still gets a driver: status() reports the
 * missing bank, and every other method refuses with the fix.
 */
export async function createDriver({ root, mainRoot, config, fetch: fetchFn, now, timeoutMs, signal } = {}) {
  const hs = (config && config.hindsight) || {};
  const bank = hs.bank ? assertBankId(hs.bank) : null;
  const client = new HindsightClient({ url: hs.url || DEFAULT_URL, bank, fetch: fetchFn, timeoutMs, signal });
  return new HindsightDriver({ client, now, projectRoot: mainRoot || root || null });
}

function noBankError() {
  return new ToolkitError(EXIT.INVALID, '.toolkit.json has no hindsight.bank, so there is no memory bank to use.', {
    fix: 'Run toolkit hindsight ensure-bank to create the bank and record it.',
  });
}

/** The later of two times (ISO 8601 strings, either may be empty), as ISO 8601 in UTC, or null. */
function laterTime(a, b) {
  const ta = a ? Date.parse(a) : NaN;
  const tb = b ? Date.parse(b) : NaN;
  if (Number.isNaN(ta) && Number.isNaN(tb)) return null;
  if (Number.isNaN(tb) || ta >= tb) return new Date(ta).toISOString();
  return new Date(tb).toISOString();
}

/** Tags for a record. */
export function recordTags(record) {
  return [RECORD_TAG, `type:${record.type}`, `status:${record.status}`];
}

/** Metadata for a record: every field as a string. saved is the date of this write. */
export function recordMetadata(record, { saved } = {}) {
  return {
    kind: 'record',
    key: record.key,
    name: record.name,
    type: record.type,
    description: record.description,
    status: record.status,
    stored_status: storedStatus(record),
    superseded_by: record.superseded_by || 'none',
    source: record.source,
    saved: saved || record.saved || '',
    last_verified: record.last_verified,
    approved_by: record.approved_by || '',
    authorization: record.authorization || '',
    supersedes: (record.supersedes || []).join(', ') || 'none',
  };
}

function summaryFromMetadata(id, meta) {
  const m = meta || {};
  const parts = splitKey(id) || {};
  const none = (v) => (v === undefined || v === null || v === '' || v === 'none' ? null : String(v));
  return {
    key: id,
    name: m.name || parts.name || '',
    type: m.type || parts.type || '',
    description: m.description || '',
    status: m.status || '',
    stored_status: m.stored_status || storedStatus({ status: m.status, superseded_by: none(m.superseded_by) }),
    superseded_by: none(m.superseded_by),
    source: m.source || '',
    saved: m.saved || '',
    last_verified: m.last_verified || '',
    approved_by: none(m.approved_by) ?? approverFrom(m.authorization),
  };
}

/** The YYYY-MM-DD part of an ISO time, or ''. */
function dateOf(iso) {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(iso ?? ''));
  return m ? m[1] : '';
}

function sameTags(a, b) {
  const sa = [...(a || [])].sort();
  const sb = [...(b || [])].sort();
  return sa.length === sb.length && sa.every((x, i) => x === sb[i]);
}

function sameMetadata(a, b) {
  const ka = Object.keys(a || {}).sort();
  const kb = Object.keys(b || {}).sort();
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && String(a[k]) === String(b[k]));
}

export class HindsightDriver {
  constructor({ client, now, projectRoot = null } = {}) {
    this.backend = backend;
    this.client = client;
    this.bank = client.bank;
    this.location = client.bank ? `Hindsight bank ${client.bank} at ${client.url}` : `Hindsight at ${client.url} (no bank set in .toolkit.json)`;
    this.now = typeof now === 'function' ? now : () => new Date();
    this.ready = false;
    this.projectRoot = projectRoot;
    this.metaFileCache = undefined;
  }

  // ------------------------------------------------------------ local meta file

  /** <git common dir>/toolkit-v2/hindsight-meta.json, or null outside Git. */
  metaFile() {
    if (this.metaFileCache === undefined) {
      const info = this.projectRoot ? gitInfo(this.projectRoot) : null;
      this.metaFileCache = info ? path.join(info.commonDir, 'toolkit-v2', META_NAME) : null;
    }
    return this.metaFileCache;
  }

  /** What this command recorded about this bank: { lastSave, lastAction, lastKey, lastExport, lastExportTo }. */
  readMeta() {
    const file = this.metaFile();
    if (!file) return {};
    try {
      const parsed = JSON.parse(readText(file) || 'null');
      return parsed && typeof parsed === 'object' && parsed.bank === this.bank ? parsed : {};
    } catch {
      return {};
    }
  }

  /** Record a write or an export. Never throws: the write itself already succeeded. */
  touchMeta(action, key, extra = {}) {
    try {
      const file = this.metaFile();
      if (!file) return;
      const meta = { ...this.readMeta(), ...extra, schema: 1, bank: this.bank };
      if (action) {
        meta.lastSave = this.now().toISOString();
        meta.lastAction = action;
        meta.lastKey = key || null;
      }
      atomicWrite(file, `${JSON.stringify(meta, null, 2)}\n`);
    } catch {
      // The meta file only feeds status(); a failure here must not fail a save.
    }
  }

  /** Record that the memory was exported to a folder (for the backup warning in doctor). */
  async markExport(dir) {
    this.touchMeta(null, null, { lastExport: this.now().toISOString(), lastExportTo: dir });
  }

  today() {
    return localToday(this.now());
  }

  /**
   * Refuse to work on a bank that does not exist: a save to a missing bank
   * would create it with the server defaults (a language model on every save).
   */
  async ensureReady() {
    if (this.ready) return;
    if (!this.bank) throw noBankError();
    if (!(await this.client.bankExists())) {
      throw new ToolkitError(EXIT.ERROR, `The memory bank ${this.bank} does not exist on the Hindsight server at ${this.client.url}.`, {
        bank: this.bank,
        fix: 'Run toolkit hindsight ensure-bank.',
      });
    }
    this.ready = true;
  }

  async readDoc(id) {
    const doc = await this.client.getDocument(id);
    if (doc === null) return null;
    if (typeof doc.original_text !== 'string') {
      throw new ToolkitError(EXIT.ERROR, `Hindsight has the document ${id} but not its text. The bank setting store_document_text must be on.`, { key: id });
    }
    return doc;
  }

  stored(id, doc) {
    const { record, problems } = parseRecord(doc.original_text, id);
    const meta = doc.document_metadata || {};
    if (!record.saved) record.saved = meta.saved || dateOf(doc.updated_at) || dateOf(doc.created_at) || '';
    return {
      ...record,
      version: versionOf(doc.original_text),
      text: doc.original_text,
      valid: problems.length === 0,
      problems,
    };
  }

  /** Write one record's text with tags and metadata from its frontmatter, then read it back. */
  async writeRecord(key, text, { saved } = {}) {
    const { record } = parseRecord(text, key);
    const item = {
      content: text,
      document_id: key,
      context: record.type || 'record',
      tags: recordTags(record),
      metadata: recordMetadata(record, { saved: saved || this.today() }),
      timestamp: this.now().toISOString(),
    };
    await this.client.retain([item], { async: false });
    const back = await this.readDoc(key);
    if (!back || back.original_text !== text) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the Hindsight document ${key} does not hold what was written.`, { key, bank: this.bank });
    }
    if (!sameTags(back.tags, item.tags)) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the Hindsight document ${key} has tags ${JSON.stringify(back.tags)}, not ${JSON.stringify(item.tags)}.`, { key, bank: this.bank });
    }
    return back;
  }

  // ------------------------------------------------------------ records

  async save(input, { expect } = {}) {
    const record = assertValidRecord(normalizeRecord(input, { today: this.today() }));
    const text = serializeRecord(record);
    await this.ensureReady();
    const current = await this.readDoc(record.key);
    checkExpect(current ? versionOf(current.original_text) : null, expect, `The memory record ${record.key}`);
    const back = await this.writeRecord(record.key, text, { saved: record.saved });
    this.touchMeta(current ? 'update' : 'create', record.key);
    return { key: record.key, version: versionOf(text), created: !current, record: this.stored(record.key, back) };
  }

  async get(key) {
    const k = assertKey(key);
    await this.ensureReady();
    const doc = await this.readDoc(k);
    return doc ? this.stored(k, doc) : null;
  }

  async allRecordDocs() {
    return this.client.listAllDocuments({ tags: [RECORD_TAG], tagsMatch: 'all_strict' });
  }

  async list(filter = {}) {
    assertFilter(filter);
    await this.ensureReady();
    const docs = await this.allRecordDocs();
    const out = [];
    for (const d of docs) {
      if (!isValidKey(d.id)) continue;
      let summary = summaryFromMetadata(d.id, d.document_metadata);
      if (!summary.status || !summary.type) {
        const full = await this.readDoc(d.id);
        if (!full) continue;
        summary = recordSummary(parseRecord(full.original_text, d.id).record);
      }
      if (matchesFilter(summary, filter)) out.push(summary);
    }
    return sortRecords(out);
  }

  tagGroups({ type, all }) {
    const groups = [{ tags: [RECORD_TAG], match: 'any_strict' }];
    if (!all) groups.push({ not: { tags: ['status:retired'], match: 'any_strict' } });
    if (type) groups.push({ tags: [`type:${type}`], match: 'any_strict' });
    return groups;
  }

  async find(query, { reflect = false, limit = 10, type, all = false } = {}) {
    const q = String(query ?? '').trim();
    if (!q) throw new ToolkitError(EXIT.INVALID, 'Give one or more words to search for.');
    assertFilter({ type });
    await this.ensureReady();
    const tag_groups = this.tagGroups({ type, all });
    const res = await this.client.recall({ query: q, budget: 'mid', max_tokens: 2048, tag_groups });
    const max = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const seen = new Set();
    const results = [];
    for (const r of Array.isArray(res.results) ? res.results : []) {
      const id = r.document_id;
      if (!id || seen.has(id) || !isValidKey(id)) continue;
      seen.add(id);
      const s = summaryFromMetadata(id, r.metadata);
      const snippet = stripFrontmatter(String(r.text || '')).replace(/\s+/g, ' ').trim().slice(0, 160);
      const score = r.scores && typeof r.scores.final === 'number' ? r.scores.final : null;
      results.push({ key: id, name: s.name, type: s.type, description: s.description, status: s.status, stored_status: s.stored_status, superseded_by: s.superseded_by, score, snippet });
      if (results.length >= max) break;
    }
    const out = { query: q, mode: 'recall', results };
    if (reflect) {
      const started = Date.now();
      // The bank's reflect mission says the same; this is the second guard.
      const answer = await this.client.reflect({ query: `${PLAIN_ENGLISH}\n\n${q}`, budget: 'low', tag_groups });
      out.answer = String(answer.text || '').trim();
      out.answerMs = Date.now() - started;
      out.mode = 'recall+reflect';
    }
    return out;
  }

  async changeStatus(key, { status, supersededBy = null, note = '' }) {
    const k = assertKey(key);
    await this.ensureReady();
    const current = await this.readDoc(k);
    if (!current) throw notFound(k, this.location);
    const before = parseRecord(current.original_text, k).record;
    const text = changeRecordStatus(current.original_text, { status, supersededBy, note }, k);
    const back = await this.writeRecord(k, text);
    this.touchMeta(status === 'retired' ? 'retire' : 'restore', k);
    return { key: k, version: versionOf(text), record: this.stored(k, back), before };
  }

  /** Add or remove a key in another record's `supersedes`. */
  async changeSuccessor(successorKey, change) {
    const doc = await this.readDoc(successorKey);
    if (!doc) return;
    const next = changeSupersedes(doc.original_text, change);
    if (next !== doc.original_text) await this.writeRecord(successorKey, next, { saved: (doc.document_metadata || {}).saved });
  }

  async retire(key, { supersededBy, reason } = {}) {
    const k = assertKey(key);
    const by = supersededBy ? assertKey(supersededBy) : null;
    if (by && by === k) throw new ToolkitError(EXIT.INVALID, 'A record cannot be superseded by itself.');
    if (by) {
      await this.ensureReady();
      if (!(await this.readDoc(by))) {
        throw new ToolkitError(EXIT.INVALID, `${k} was not retired: the replacement ${by} does not exist in ${this.location}.`, {
          key: k,
          supersededBy: by,
          fix: 'Save the new record first, or check the key with toolkit memory list.',
        });
      }
    }
    const res = await this.changeStatus(k, { status: 'retired', supersededBy: by, note: retireNote(this.today(), { reason, supersededBy: by }) });
    if (by) await this.changeSuccessor(by, { add: [k] });
    const change = by ? { kind: 'supersede', from: k, to: by } : { kind: 'archive', from: k };
    const repaired = await repairLinksWithDriver(this, change, { skip: by ? [k, by] : [k] });
    return { key: res.key, version: res.version, record: res.record, ...repairResult(repaired) };
  }

  async restore(key) {
    const res = await this.changeStatus(key, { status: 'needs-review', supersededBy: null, note: restoreNote(this.today()) });
    if (res.before && res.before.superseded_by) await this.changeSuccessor(res.before.superseded_by, { remove: [res.key] });
    return { key: res.key, version: res.version, record: res.record };
  }

  /** A new document under the new key, then the old one is deleted; links in other records follow. */
  async rename(key, toKey) {
    const k = assertKey(key);
    const to = assertKey(toKey);
    if (k === to) throw new ToolkitError(EXIT.INVALID, `${k} already has that key.`, { key: k });
    await this.ensureReady();
    const current = await this.readDoc(k);
    if (!current) throw notFound(k, this.location);
    if (await this.readDoc(to)) {
      throw new ToolkitError(EXIT.INVALID, `${k} was not renamed: a record with the key ${to} already exists.`, {
        key: k,
        to,
        fix: `Merge them instead: save what should stay in ${to}, then run toolkit memory retire ${k} --superseded-by ${to}.`,
      });
    }
    const before = parseRecord(current.original_text, k).record;
    const dir = storedStatus(before) === 'archived' ? 'archive' : '';
    const change = { kind: 'rename', from: k, to, fromPath: dir ? `${dir}/${k}.md` : `${k}.md`, toPath: dir ? `${dir}/${to}.md` : `${to}.md` };
    const text = repairLinks(renameRecordText(current.original_text, to), dir, change).text;
    const back = await this.writeRecord(to, text, { saved: (current.document_metadata || {}).saved });
    await this.client.deleteDocument(k);
    this.touchMeta('rename', to);
    const repaired = await repairLinksWithDriver(this, change, { skip: [to] });
    return { key: to, from: k, version: versionOf(text), record: this.stored(to, back), ...repairResult(repaired) };
  }

  async delete(key) {
    const k = assertKey(key);
    await this.ensureReady();
    const current = await this.readDoc(k);
    const res = await this.client.deleteDocument(k);
    if (res === null) throw notFound(k, this.location);
    this.touchMeta('delete', k);
    if ((await this.client.getDocument(k)) !== null) {
      throw new ToolkitError(EXIT.ERROR, `Deleted but not verified: the Hindsight document ${k} can still be read in bank ${this.bank}.`, {
        key: k,
        bank: this.bank,
        fix: `Run toolkit memory get ${k} to see it, and try the delete again.`,
      });
    }
    const archived = current ? storedStatus(parseRecord(current.original_text, k).record) === 'archived' : false;
    const repaired = await repairLinksWithDriver(this, { kind: 'delete', from: k, fromPath: archived ? `archive/${k}.md` : `${k}.md` });
    return { key: k, deleted: true, ...repairResult(repaired) };
  }

  // ------------------------------------------------------------ focus and glossary

  async readTextDoc(id) {
    await this.ensureReady();
    const doc = await this.readDoc(id);
    return doc ? { text: doc.original_text, version: versionOf(doc.original_text) } : { text: '', version: null };
  }

  async writeTextDoc(id, text, expect, label) {
    await this.ensureReady();
    const current = await this.readDoc(id);
    checkExpect(current ? versionOf(current.original_text) : null, expect, label);
    await this.client.retain([{
      content: text,
      document_id: id,
      context: id,
      tags: [`kind:${id}`],
      metadata: { kind: id },
      timestamp: this.now().toISOString(),
    }], { async: false });
    const back = await this.readDoc(id);
    if (!back || back.original_text !== text) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the Hindsight document ${id} does not hold what was written.`, { bank: this.bank });
    }
    this.touchMeta(id, null);
    return { version: versionOf(text) };
  }

  async focusGet() {
    return this.readTextDoc(FOCUS_ID);
  }

  async focusSet(markdown, { expect } = {}) {
    const text = normalizeDocument(assertValidFocus(markdown));
    const res = await this.writeTextDoc(FOCUS_ID, text, expect, 'The current focus');
    return { ...res, lines: focusLineCount(text) };
  }

  async glossaryGet() {
    return this.readTextDoc(GLOSSARY_ID);
  }

  async glossarySet(markdown, { expect } = {}) {
    const text = normalizeDocument(assertValidGlossary(markdown));
    return this.writeTextDoc(GLOSSARY_ID, text, expect, 'The glossary');
  }

  // ------------------------------------------------------------ index and status

  /** Make every record's tags and metadata match its stored text again. */
  async reindex() {
    await this.ensureReady();
    const docs = await this.allRecordDocs();
    let count = 0;
    let changed = 0;
    for (const d of docs) {
      if (!isValidKey(d.id)) continue;
      const full = await this.readDoc(d.id);
      if (!full) continue;
      count++;
      const { record } = parseRecord(full.original_text, d.id);
      if (!RECORD_TYPES.includes(record.type)) continue;
      const saved = (full.document_metadata || {}).saved || this.today();
      // A record still in the older toolkit format is written again in the model's format
      // (topic body, and the replacement of a superseded record kept in its body).
      const text = record.legacy ? serializeRecord(normalizeRecord({ ...record, saved: record.saved || saved }, { today: this.today() })) : full.original_text;
      if (text === full.original_text && sameTags(full.tags, recordTags(record)) && sameMetadata(full.document_metadata, recordMetadata(record, { saved }))) continue;
      await this.writeRecord(d.id, text, { saved });
      changed++;
    }
    if (changed) this.touchMeta('reindex', null);
    return { count, changed, detail: `Checked ${count} records in bank ${this.bank}; ${changed} had their tags, metadata, or format written again from their text.` };
  }

  async status() {
    const meta = this.bank ? this.readMeta() : {};
    const base = { backend, location: this.location, lastSave: meta.lastSave || null, lastExport: meta.lastExport || null, counts: countRecords([]) };
    if (!this.bank) {
      return { ...base, healthy: false, detail: '.toolkit.json has no hindsight.bank, so there is no memory bank yet. Run toolkit hindsight ensure-bank.', problems: [{ where: '.toolkit.json', problem: 'has no hindsight.bank.' }] };
    }
    try {
      await this.client.health();
    } catch (err) {
      return { ...base, healthy: false, detail: `Hindsight is not reachable at ${this.client.url}: ${err.message}`, problems: [{ where: this.client.url, problem: 'does not answer.' }] };
    }
    const row = await this.client.getBank();
    const cfg = row ? await this.client.getBankConfig() : null;
    if (cfg === null) {
      return { ...base, healthy: false, detail: `The Hindsight server answers, but the memory bank ${this.bank} does not exist. Run toolkit hindsight ensure-bank.`, problems: [{ where: `bank ${this.bank}`, problem: 'does not exist.' }] };
    }
    this.ready = true;
    const problems = settingsProblems(cfg).map((p) => ({ where: `bank ${this.bank}`, problem: p }));
    const docs = await this.allRecordDocs();
    const summaries = docs.filter((d) => isValidKey(d.id)).map((d) => summaryFromMetadata(d.id, d.document_metadata));
    const counts = countRecords(summaries);
    // The bank row is current at once; GET .../stats can lag a minute or more behind.
    const lastSave = laterTime(row.last_write_at, meta.lastSave);
    const inUse = counts.total - counts.retired;
    const detail = `Hindsight bank ${this.bank} at ${this.client.url}: ${inUse} record${inUse === 1 ? '' : 's'} in use, ${counts.retired} retired${problems.length ? `, ${problems.length} setting${problems.length === 1 ? '' : 's'} to fix (run toolkit hindsight ensure-bank)` : ''}.`;
    return { ...base, lastSave, counts, healthy: true, detail, problems };
  }
}

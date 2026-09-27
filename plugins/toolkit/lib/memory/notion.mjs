// Notion memory: records are rows of the project's Memory database; the
// current focus and the glossary are two child pages of the project page
// (ARCHITECTURE 7). Implements MemoryDriver from contract.mjs.
//
// How a record is stored:
// - Frontmatter -> properties: Key (the page title, <type>_<slug>), Type, Name,
//   Description, Status (current, needs-review, retired), Superseded by,
//   Source, Saved, Last verified, Approved by (the model's `authorization`
//   words, for example "Approved by Mike on 2026-09-26"), and Other fields
//   (JSON: `supersedes`, any `metadata` keys besides type, and any other
//   frontmatter keys).
// - Body -> the page body, converted by lib/notion/markdown.mjs. It is the
//   model's topic body (# Title, **Remember:**, ...), the same as a built-in
//   .memory/ file, except its first "# Title" line: Notion drops a leading
//   level-1 heading from a new page, so the page holds the body without it.
//   The title is read back from Other fields ("_heading") when it is not the
//   one the name gives ("account-model" -> "Account model").
// - A retired record is `superseded` when Superseded by or the body's newest
//   "**Superseded <date>:**" line says so, and `archived` otherwise; a
//   superseded record that names no replacement keeps its word in Other
//   fields ("_status").
// - Link repair goes on past a row it cannot save and reports it (linksFailed).
// - The stored text is serializeRecord() of the record read back: the model's
//   topic format, so every backend gives the same text for the same record.
//   version = its SHA-256.
// - Links in other records to a renamed, superseded, archived, or deleted
//   record are repaired the same way as in built-in memory. A rename changes
//   the Key, Type, and Name properties of the same page.
//   Notion's Markdown is compared after normalization (spacing, escapes), so
//   a body can read back with small spacing differences but the same words.
//
// A Git-ignored cache (lib/notion/context.mjs) keeps each record's text, its
// last-edited time, and when it was read, so find() reads only the bodies that
// changed. Notion gives last_edited_time to the minute, so an edit made in the
// same minute as a read would not change it: a cached body is used only when it
// was read at least two minutes after the page's last edit. get() and
// reindex() always read the body from Notion; only find() uses the cache.
//
// Writes (save, retire, restore, delete, focus, glossary) hold a lock on this
// computer's cache folder, so two toolkit commands cannot both create the same
// new key. A body write is planned from a fresh read with the text read for the
// --expect check as its base: an edit Mike makes in Notion in between, in a
// section this write does not change, is kept; in the same section it is a
// conflict and nothing is saved.
// delete() moves the page to the Notion trash (Notion empties it after 30 days).

import { EXIT, ToolkitError } from '../core/output.mjs';
import { today as localToday } from '../core/util.mjs';
import {
  RECORD_TYPES, assertKey, assertValidRecord, assertValidFocus, assertValidGlossary, assertFilter, approverFrom,
  changeRecordStatus, checkExpect, countRecords, keywordScore, matchesFilter, normalizeDocument, normalizeRecord, notFound,
  parseRecord, recordSummary, renameRecordText, repairLinks, repairLinksWithDriver, repairResult, restoreNote, retireNote, searchTerms,
  storedStatus,
  serializeRecord, sortRecords, splitKey, supersedesList, titleFromName, versionOf, focusLineCount, FOCUS_MAX_LINES, isValidKey,
} from './contract.mjs';
import { withLock } from '../core/lock.mjs';
import { normalizeId, isNotionError } from '../notion/client.mjs';
import { clientFor, notionCacheDir, readCache, writeCache } from '../notion/context.mjs';
import { fromNotion, toNotion, planUpdate, stripTitle, withTitle, sameLocal, detectTableStyle, localLeaves } from '../notion/markdown.mjs';
import { readValue, writeValue } from '../notion/props.mjs';
import { FOCUS_PAGE_TITLE, GLOSSARY_PAGE_TITLE } from '../notion/schema.mjs';

export const backend = 'notion';
export const CACHE_FILE = 'memory.json';
export const LOCK_NAME = '.memory.lock';
/** A cached body is used only when it was read this long after the page's last edit. */
export const CACHE_SAFE_MS = 2 * 60 * 1000;

/**
 * True when the text written for each section this write changed reads back
 * the same. Sections the write did not change may hold an edit Mike made in
 * Notion at the same time, so they are not compared.
 */
function changedLeavesMatch(backBody, nextBody, plan) {
  if (!plan || plan.type === 'none') return true;
  const changed = plan.changed || [];
  if (!changed.length) return sameLocal(backBody, nextBody);
  const back = new Map(localLeaves(backBody).map((l) => [l.key, l.local]));
  const want = new Map(localLeaves(nextBody).map((l) => [l.key, l.local]));
  return changed.every((k) => !want.has(k) || back.get(k) === want.get(k));
}

/** record field -> [property key, Notion type] */
const FIELDS = {
  key: ['title', 'title'],
  type: ['type', 'select'],
  name: ['name', 'rich_text'],
  description: ['description', 'rich_text'],
  status: ['status', 'select'],
  superseded_by: ['supersededBy', 'rich_text'],
  source: ['source', 'rich_text'],
  saved: ['saved', 'date'],
  last_verified: ['lastVerified', 'rich_text'],
  authorization: ['approvedBy', 'rich_text'],
};

/** The Other fields key that keeps a record's own "# Title" when the name does not give it. */
export const HEADING_KEY = '_heading';
/**
 * The Other fields key that keeps a retired record's status word (superseded or
 * archived) when the Status and Superseded by properties and the body do not
 * give it: a superseded record that names no replacement. The Status property
 * holds only current, needs-review, or retired.
 */
export const STATUS_WORD_KEY = '_status';

/** The page body of a record: its body without the leading "# Title" line. */
export function pageBody(body) {
  return stripTitle(body).body;
}

/** The fields a write reads back and compares. */
const COMPARED = ['type', 'name', 'description', 'status', 'superseded_by', 'source', 'saved', 'last_verified', 'authorization'];

/**
 * The authorization words from the "Approved by" property. A row written by an
 * older toolkit holds only a name there; that reads as "Approved by <name>".
 */
function authorizationOf(value) {
  const v = String(value ?? '').trim();
  if (!v) return '';
  return /\s/.test(v) ? v : `Approved by ${v}`;
}

export async function createDriver(options = {}) {
  return new NotionMemoryDriver(options);
}

export class NotionMemoryDriver {
  /**
   * options = { root, mainRoot, config, env, now } from loadDriver(), plus for
   * tests { client, runner, sleep, minIntervalMs, clock }. clock() gives the
   * time in milliseconds used to decide whether a cached body can be used.
   */
  constructor({ root, mainRoot, config = {}, env = process.env, now, client, runner, sleep, minIntervalMs, deadlineMs, timeoutMs, clock } = {}) {
    this.backend = backend;
    const mem = (config.notion && config.notion.memory) || null;
    if (!mem || !mem.dataSourceId || !mem.properties) {
      throw new ToolkitError(EXIT.INVALID, 'The Notion Memory database is not set up for this project.', {
        fix: 'Run toolkit notion ensure-project.',
      });
    }
    this.mem = mem;
    this.p = mem.properties;
    this.cacheRoot = mainRoot || root;
    this.now = typeof now === 'function' ? now : () => new Date();
    this.clock = typeof clock === 'function' ? clock : Date.now;
    this.inLock = false;
    this.client = client || clientFor({ config, root: this.cacheRoot, env, runner, sleep, minIntervalMs, deadlineMs, timeoutMs });
    this.location = `the Notion Memory database${mem.url ? ` (${mem.url})` : ''}`;
    this.cache = this.loadCache();
  }

  loadCache() {
    const cache = readCache(this.cacheRoot, CACHE_FILE);
    if (!cache.records || typeof cache.records !== 'object') cache.records = {};
    return cache;
  }

  /**
   * Run a write with this computer's memory lock. The cache is read again
   * inside the lock, so an entry another command just wrote is not lost.
   */
  async locked(fn) {
    if (this.inLock) return fn();
    return withLock(notionCacheDir(this.cacheRoot), async () => {
      this.inLock = true;
      try {
        this.cache = this.loadCache();
        return await fn();
      } finally {
        this.inLock = false;
      }
    }, { name: LOCK_NAME, staleMs: 120000 });
  }

  today() {
    return localToday(this.now());
  }

  saveCache(action) {
    this.cache.schema = 1;
    this.cache.dataSourceId = this.mem.dataSourceId;
    if (action) {
      this.cache.lastSave = this.now().toISOString();
      this.cache.lastAction = action;
    }
    writeCache(this.cacheRoot, CACHE_FILE, this.cache);
  }

  // ------------------------------------------------------------ rows

  summaryOf(page) {
    const r = {};
    for (const [field, [key]] of Object.entries(FIELDS)) {
      const v = readValue(page, this.p[key]);
      r[field] = v === null || v === undefined ? '' : String(v);
    }
    r.superseded_by = r.superseded_by || null;
    r.authorization = authorizationOf(r.authorization);
    r.approved_by = approverFrom(r.authorization);
    const word = r.status === 'retired' ? this.otherFields(page).word : null;
    if (word) r.stored_status = word;
    return r;
  }

  /** Split the Other fields JSON into supersedes, metadata, the heading, and the other keys. */
  otherFields(page) {
    const all = this.extraOf(page) || {};
    const { supersedes, metadata, [HEADING_KEY]: heading, [STATUS_WORD_KEY]: word, ...extra } = all;
    return {
      supersedes: supersedesList(supersedes),
      metadata: metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? metadata : undefined,
      heading: typeof heading === 'string' && heading.trim() ? heading.trim() : null,
      word: word === 'superseded' || word === 'archived' ? word : null,
      extra: Object.keys(extra).length ? extra : undefined,
    };
  }

  extraOf(page) {
    const raw = this.p.extra ? readValue(page, this.p.extra) : '';
    if (!raw) return undefined;
    try {
      const obj = JSON.parse(raw);
      return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length ? obj : undefined;
    } catch {
      return undefined;
    }
  }

  async rows() {
    return this.client.queryAll(this.mem.dataSourceId);
  }

  async findRow(key) {
    const rows = await this.client.queryAll(this.mem.dataSourceId, { filter: { property: 'title', title: { equals: key } } });
    const live = rows.filter((r) => !r.in_trash && readValue(r, 'title') === key);
    return live[0] || null;
  }

  /**
   * A cached body can be used when the page was not edited since it was read,
   * and it was read at least CACHE_SAFE_MS after the page's last edit. Notion
   * gives last_edited_time to the minute: an edit in the same minute as the
   * read keeps the same time, so a read made that soon cannot be trusted. Two
   * minutes also covers a small difference between this computer's clock and
   * Notion's.
   */
  cacheUsable(cached, page) {
    if (!cached || typeof cached.body !== 'string' || !cached.readAt) return false;
    if (cached.pageId !== normalizeId(page.id) || cached.lastEdited !== page.last_edited_time) return false;
    const read = Date.parse(cached.readAt);
    const edited = Date.parse(page.last_edited_time);
    return Number.isFinite(read) && Number.isFinite(edited) && read - edited >= CACHE_SAFE_MS;
  }

  /** The stored record for a page. Reads the body from Notion, or with useCache from the cache when cacheUsable() allows it. */
  async stored(page, { useCache = true } = {}) {
    const key = readValue(page, 'title');
    const cached = this.cache.records[key];
    const tableStyle = (cached && cached.tableStyle) || 'compact';
    let body;
    let readAt;
    if (useCache && this.cacheUsable(cached, page)) {
      body = cached.body;
      readAt = cached.readAt;
    } else {
      const md = await this.client.getMarkdown(page.id);
      body = fromNotion(md.markdown || '', { tableStyle }).markdown;
      readAt = new Date(this.clock()).toISOString();
    }
    const summary = this.summaryOf(page);
    const other = this.otherFields(page);
    const heading = other.heading || titleFromName(summary.name || (splitKey(key) || {}).name);
    const record = { ...summary, key, body: withTitle(heading, body), supersedes: other.supersedes };
    if (other.word && record.status === 'retired') record.stored_status = other.word;
    if (other.metadata) record.metadata = other.metadata;
    if (other.extra) record.extra = other.extra;
    const text = serializeRecord(record);
    const { record: parsed, problems } = parseRecord(text, key);
    parsed.saved = summary.saved || '';
    this.cache.records[key] = { pageId: normalizeId(page.id), lastEdited: page.last_edited_time, readAt, body, url: page.url || null, tableStyle };
    return { ...parsed, version: versionOf(text), text, url: page.url || null, valid: problems.length === 0, problems };
  }

  propertiesFor(record) {
    const props = {};
    for (const [field, [key, type]] of Object.entries(FIELDS)) {
      if (!this.p[key]) continue;
      const v = record[field];
      props[key === 'title' ? 'title' : this.p[key]] = writeValue(type, v === null || v === undefined ? '' : v);
    }
    if (this.p.extra) {
      const all = { ...(record.extra || {}) };
      const supersedes = supersedesList(record.supersedes);
      if (supersedes.length) all.supersedes = supersedes;
      if (record.metadata && Object.keys(record.metadata).some((k) => k !== 'type')) all.metadata = record.metadata;
      const heading = stripTitle(record.body).title;
      if (heading && heading !== titleFromName(record.name)) all[HEADING_KEY] = heading;
      if (record.status === 'retired') {
        const word = storedStatus(record);
        if (word !== storedStatus({ status: 'retired', superseded_by: record.superseded_by, body: record.body })) all[STATUS_WORD_KEY] = word;
      }
      props[this.p.extra] = writeValue('rich_text', Object.keys(all).length ? JSON.stringify(all) : '');
    }
    return props;
  }

  /**
   * Plan a body write from a fresh read. base is the body read for the
   * --expect check. Returns { plan, concurrent } where concurrent is true when
   * the page changed in Notion since that read. Writes nothing.
   */
  async planBody(pageId, body, base, label) {
    const md = await this.client.getMarkdown(pageId);
    const fresh = md.markdown || '';
    try {
      const plan = planUpdate({ fresh, base, next: body });
      const concurrent = base !== undefined && base !== null && !sameLocal(fromNotion(fresh).markdown, base);
      return { plan, concurrent };
    } catch (err) {
      if (err && err.details && err.details.conflicts) {
        throw new ToolkitError(EXIT.INVALID, `${label} changed in Notion while it was being saved, so nothing was saved. ${err.message}`, {
          conflicts: err.details.conflicts,
          fix: 'Read it again, then redo the change.',
        });
      }
      throw err;
    }
  }

  async applyPlan(pageId, plan) {
    if (plan.type === 'update_content') {
      await this.client.patchMarkdown(pageId, { type: 'update_content', update_content: { content_updates: plan.ops } });
    } else if (plan.type === 'replace_content') {
      await this.client.patchMarkdown(pageId, { type: 'replace_content', replace_content: { new_str: plan.new_str } });
    }
  }

  // ------------------------------------------------------------ records

  async save(input, { expect } = {}) {
    const record = assertValidRecord(normalizeRecord(input, { today: this.today() }));
    return this.writeRecord(record, expect, 'save');
  }

  async writeRecord(record, expect, action) {
    return this.locked(async () => {
      const label = `The memory record ${record.key}`;
      const existing = await this.findRow(record.key);
      // Read with the table style the last read used, so the version matches what get() gave.
      const current = existing ? await this.stored(existing, { useCache: false }) : null;
      try {
        checkExpect(current ? current.version : null, expect, label);
      } catch (err) {
        this.saveCache(); // keep the fresh text just read, so the next get() is right
        throw err;
      }
      let pageId;
      let planned = null;
      if (existing) {
        pageId = existing.id;
        // Plan the body before any write: a conflict with an edit made in Notion since the read above saves nothing.
        planned = await this.planBody(pageId, pageBody(record.body), pageBody(current.body), label);
        await this.client.updatePage(pageId, { properties: this.propertiesFor(record) });
        await this.applyPlan(pageId, planned.plan);
      } else {
        const page = await this.client.createPage({
          parent: { type: 'data_source_id', data_source_id: this.mem.dataSourceId },
          properties: this.propertiesFor(record),
          ...(pageBody(record.body).trim() ? { markdown: toNotion(pageBody(record.body)) } : {}),
        });
        this.client.trust(page.id);
        pageId = page.id;
      }
      this.cache.records[record.key] = { ...(this.cache.records[record.key] || {}), tableStyle: detectTableStyle(record.body), lastEdited: null };
      const back = await this.client.getPage(pageId);
      const stored = await this.stored(back, { useCache: false });
      const same = COMPARED.every((f) => String(stored[f] ?? '') === String(record[f] ?? ''))
        && (!this.p.extra || supersedesList(stored.supersedes).join(',') === supersedesList(record.supersedes).join(','));
      const bodyOk = planned && planned.concurrent
        ? changedLeavesMatch(pageBody(stored.body), pageBody(record.body), planned.plan)
        : sameLocal(stored.body, record.body);
      if (!same || !bodyOk) {
        this.saveCache();
        throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the Notion page for ${record.key} does not hold what was written.`, { key: record.key, location: back.url });
      }
      this.saveCache(action);
      return { key: record.key, version: stored.version, created: !existing, record: stored };
    });
  }

  /** One record, its body read from Notion (never from the cache). */
  async get(key) {
    const k = assertKey(key);
    const page = await this.findRow(k);
    if (!page) return null;
    const rec = await this.stored(page, { useCache: false });
    this.saveCache();
    return rec;
  }

  async list(filter = {}) {
    assertFilter(filter);
    const rows = await this.rows();
    const out = [];
    for (const page of rows) {
      const key = readValue(page, 'title');
      if (!isValidKey(key)) continue;
      const s = this.summaryOf(page);
      out.push(recordSummary({ ...s, key }));
    }
    return sortRecords(out.filter((s) => matchesFilter(s, filter)));
  }

  async find(query, { reflect = false, limit = 10, type, all = false } = {}) {
    if (reflect) {
      throw new ToolkitError(EXIT.UNSUPPORTED, 'find --reflect needs the Hindsight memory backend. Notion memory searches by keywords only.', {
        backend,
        fix: 'Run the search again without --reflect.',
      });
    }
    const terms = searchTerms(query);
    if (!terms.length) throw new ToolkitError(EXIT.INVALID, 'Give one or more words to search for.');
    assertFilter({ type });
    const rows = await this.rows();
    const hits = [];
    for (const page of rows) {
      const key = readValue(page, 'title');
      if (!isValidKey(key)) continue;
      const s = { ...this.summaryOf(page), key };
      if (!all && s.status === 'retired') continue;
      if (type && s.type !== type) continue;
      const rec = await this.stored(page);
      const { score, snippet } = keywordScore(rec, terms);
      if (score <= 0) continue;
      hits.push({ key, name: s.name, type: s.type, description: s.description, status: s.status, stored_status: storedStatus(rec), superseded_by: rec.superseded_by ?? null, score, snippet });
    }
    this.saveCache();
    hits.sort((a, b) => b.score - a.score || (a.key < b.key ? -1 : 1));
    const max = Number.isInteger(limit) && limit > 0 ? limit : 10;
    return { query: String(query), mode: 'keyword', results: hits.slice(0, max) };
  }

  async changeStatus(key, { status, supersededBy = null, note = '' }, action) {
    const k = assertKey(key);
    return this.locked(async () => {
      const page = await this.findRow(k);
      if (!page) throw notFound(k, this.location);
      const current = await this.stored(page, { useCache: false });
      const text = changeRecordStatus(current.text, { status, supersededBy, note }, k);
      const { record } = parseRecord(text, k);
      record.saved = this.today();
      const res = await this.writeRecord(record, current.version, action);
      return { key: k, version: res.version, record: res.record, before: current };
    });
  }

  /** Add or remove a key in another record's `supersedes`. */
  async changeSuccessor(successorKey, { add = [], remove = [] }) {
    const rec = await this.get(successorKey);
    if (!rec) return;
    const now = supersedesList(rec.supersedes);
    const next = now.filter((x) => !remove.includes(x));
    for (const x of add) if (!next.includes(x)) next.push(x);
    if (next.join(',') === now.join(',')) return;
    await this.save({ ...rec, supersedes: next }, { expect: rec.version });
  }

  async retire(key, { supersededBy, reason } = {}) {
    const k = assertKey(key);
    const by = supersededBy ? assertKey(supersededBy) : null;
    if (by && by === k) throw new ToolkitError(EXIT.INVALID, 'A record cannot be superseded by itself.');
    const note = retireNote(this.today(), { reason, supersededBy: by });
    const res = await this.changeStatus(k, { status: 'retired', supersededBy: by, note }, 'retire');
    if (by) await this.changeSuccessor(by, { add: [k] });
    const change = by ? { kind: 'supersede', from: k, to: by } : { kind: 'archive', from: k };
    const repaired = await repairLinksWithDriver(this, change, { skip: by ? [k, by] : [k] });
    return { key: res.key, version: res.version, record: res.record, ...repairResult(repaired) };
  }

  async restore(key) {
    const res = await this.changeStatus(key, { status: 'needs-review', supersededBy: null, note: restoreNote(this.today()) }, 'restore');
    if (res.before && res.before.superseded_by) await this.changeSuccessor(res.before.superseded_by, { remove: [res.key] });
    return { key: res.key, version: res.version, record: res.record };
  }

  /**
   * Give a record a new key: the same page gets the new Key, Type, and Name.
   * Its own links to itself, and links in other records, follow.
   */
  async rename(key, toKey) {
    const k = assertKey(key);
    const to = assertKey(toKey);
    if (k === to) throw new ToolkitError(EXIT.INVALID, `${k} already has that key.`, { key: k });
    const parts = splitKey(to);
    const res = await this.locked(async () => {
      const page = await this.findRow(k);
      if (!page) throw notFound(k, this.location);
      if (await this.findRow(to)) {
        throw new ToolkitError(EXIT.INVALID, `${k} was not renamed: a record with the key ${to} already exists.`, {
          key: k,
          to,
          fix: `Merge them instead: save what should stay in ${to}, then run toolkit memory retire ${k} --superseded-by ${to}.`,
        });
      }
      const current = await this.stored(page, { useCache: false });
      const dir = storedStatus(current) === 'archived' ? 'archive' : '';
      const change = { kind: 'rename', from: k, to, fromPath: dir ? `${dir}/${k}.md` : `${k}.md`, toPath: dir ? `${dir}/${to}.md` : `${to}.md` };
      const { record } = parseRecord(repairLinks(renameRecordText(current.text, to), dir, change).text, to);
      record.saved = current.saved || this.today();
      const planned = pageBody(record.body) !== pageBody(current.body) ? await this.planBody(page.id, pageBody(record.body), pageBody(current.body), `The memory record ${k}`) : null;
      await this.client.updatePage(page.id, { properties: this.propertiesFor(record) });
      if (planned) await this.applyPlan(page.id, planned.plan);
      delete this.cache.records[k];
      this.cache.records[to] = { tableStyle: current.tableStyle || 'compact', lastEdited: null };
      const back = await this.stored(await this.client.getPage(page.id), { useCache: false });
      if (back.key !== to || back.type !== parts.type) {
        this.saveCache();
        throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the Notion page for ${k} does not have the key ${to}.`, { key: k, to });
      }
      this.saveCache('rename');
      return { key: to, from: k, version: back.version, record: back, change };
    });
    const repaired = await repairLinksWithDriver(this, res.change, { skip: [to] });
    return { key: res.key, from: res.from, version: res.version, record: res.record, ...repairResult(repaired) };
  }

  /**
   * Moves the page to the Notion trash. Notion deletes it for good after 30
   * days; until then it can be restored from the trash in the Notion app.
   * Links in other records become plain words.
   */
  async delete(key) {
    const k = assertKey(key);
    const res = await this.locked(async () => {
      const page = await this.findRow(k);
      if (!page) throw notFound(k, this.location);
      const archived = storedStatus(this.summaryOf(page)) === 'archived';
      await this.client.updatePage(page.id, { in_trash: true });
      const back = await this.client.getPage(page.id);
      if (!back.in_trash) throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${k} is not in the Notion trash.`, { key: k });
      delete this.cache.records[k];
      this.saveCache('delete');
      return {
        key: k,
        deleted: true,
        trash: true,
        archived,
        detail: `${k} was moved to the Notion trash. Notion deletes it for good after 30 days; until then it can be restored from the trash in the Notion app.`,
      };
    });
    const repaired = await repairLinksWithDriver(this, { kind: 'delete', from: k, fromPath: res.archived ? `archive/${k}.md` : `${k}.md` });
    const { archived, ...out } = res;
    return { ...out, ...repairResult(repaired) };
  }

  // ------------------------------------------------------------ focus and glossary

  pageIdFor(which) {
    const id = this.mem.pages && this.mem.pages[which];
    if (!id) {
      throw new ToolkitError(EXIT.INVALID, `The Notion ${which === 'focus' ? FOCUS_PAGE_TITLE : GLOSSARY_PAGE_TITLE} page is not set up for this project.`, {
        fix: 'Run toolkit notion ensure-project.',
      });
    }
    return id;
  }

  async readDocument(which) {
    const id = this.pageIdFor(which);
    let page;
    try {
      page = await this.client.getPage(id);
    } catch (err) {
      if (isNotionError(err) && err.status === 404) return { text: '', version: null };
      throw err;
    }
    if (page.in_trash) return { text: '', version: null };
    const md = await this.client.getMarkdown(id);
    if (!String(md.markdown || '').trim()) return { text: '', version: null };
    const title = readValue(page, 'title') || (which === 'focus' ? FOCUS_PAGE_TITLE : GLOSSARY_PAGE_TITLE);
    const tableStyle = (this.cache[which] && this.cache[which].tableStyle) || 'compact';
    const text = normalizeDocument(withTitle(title, fromNotion(md.markdown, { tableStyle }).markdown));
    this.cache[which] = { text, lastEdited: page.last_edited_time, tableStyle };
    return { text, version: versionOf(text) };
  }

  async writeDocument(which, text, expect, label, action) {
    const id = this.pageIdFor(which);
    return this.locked(async () => {
      const current = await this.readDocument(which);
      try {
        checkExpect(current.text ? current.version : null, expect, label);
      } catch (err) {
        this.saveCache();
        throw err;
      }
      const { title, body } = stripTitle(text);
      const base = current.text ? stripTitle(current.text).body : undefined;
      const planned = await this.planBody(id, body, base, label);
      this.cache[which] = { ...(this.cache[which] || {}), tableStyle: detectTableStyle(text) };
      await this.applyPlan(id, planned.plan);
      if (title) {
        const page = await this.client.getPage(id);
        if (readValue(page, 'title') !== title) await this.client.updatePage(id, { properties: { title: writeValue('title', title) } });
      }
      const back = await this.readDocument(which);
      const backParts = stripTitle(back.text);
      const ok = planned.concurrent
        ? (!title || backParts.title === title) && changedLeavesMatch(backParts.body, body, planned.plan)
        : sameLocal(back.text, text);
      if (!ok) {
        this.saveCache();
        throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the Notion page for ${label.toLowerCase()} does not hold what was written.`, { page: id });
      }
      this.saveCache(action);
      return { version: back.version };
    });
  }

  async focusGet() {
    const res = await this.readDocument('focus');
    this.saveCache();
    return res;
  }

  async focusSet(markdown, { expect } = {}) {
    const text = normalizeDocument(assertValidFocus(markdown));
    const res = await this.writeDocument('focus', text, expect, 'The current focus', 'focus');
    return { ...res, lines: focusLineCount(text) };
  }

  async glossaryGet() {
    const res = await this.readDocument('glossary');
    this.saveCache();
    return res;
  }

  async glossarySet(markdown, { expect } = {}) {
    const text = normalizeDocument(assertValidGlossary(markdown));
    return this.writeDocument('glossary', text, expect, 'The glossary', 'glossary');
  }

  // ------------------------------------------------------------ index and status

  /**
   * Notion keeps its own index (the Index view). This reads every record's
   * body from Notion again (never from the cache) and rebuilds the local cache.
   */
  async reindex() {
    const rows = await this.rows();
    let count = 0;
    let changed = 0;
    const seen = new Set();
    for (const page of rows) {
      const key = readValue(page, 'title');
      if (!isValidKey(key)) continue;
      seen.add(key);
      const before = this.cache.records[key];
      await this.stored(page, { useCache: false });
      const after = this.cache.records[key];
      if (!before || before.body !== after.body || before.lastEdited !== after.lastEdited) changed++;
      if (this.summaryOf(page).status !== 'retired') count++;
    }
    for (const key of Object.keys(this.cache.records)) if (!seen.has(key)) delete this.cache.records[key];
    this.saveCache();
    return { count, changed, detail: `The Index view of the Notion Memory database lists ${count} records in use; ${changed} record texts were refreshed in the local cache.` };
  }

  async status() {
    const base = { backend, location: this.location, lastSave: this.cache.lastSave || null, lastExport: this.cache.lastExport || null, counts: countRecords([]) };
    let rows;
    try {
      rows = await this.rows();
    } catch (err) {
      return {
        ...base,
        healthy: false,
        detail: `Notion is not reachable: ${err.message}`,
        problems: [{ where: 'Notion', problem: 'does not answer. Run ntn doctor, or ntn login when the sign-in expired.' }],
      };
    }
    const problems = [];
    const summaries = [];
    const keys = new Map();
    let lastEdited = null;
    for (const page of rows) {
      const key = readValue(page, 'title');
      if (!lastEdited || page.last_edited_time > lastEdited) lastEdited = page.last_edited_time;
      if (!isValidKey(key)) {
        problems.push({ where: page.url || page.id, problem: `has the key "${key || ''}", which is not <type>_<slug>. Give it a key or delete it.` });
        continue;
      }
      if (keys.has(key)) {
        problems.push({ where: page.url || page.id, problem: `is a second row with the key ${key}; the first one is used.` });
        continue;
      }
      keys.set(key, page);
      const s = { ...this.summaryOf(page), key };
      if (!RECORD_TYPES.includes(s.type)) problems.push({ where: key, problem: `has the type "${s.type}", which is not one of ${RECORD_TYPES.join(', ')}.` });
      summaries.push(recordSummary(s));
    }
    try {
      const focus = await this.readDocument('focus');
      if (focus.text && focusLineCount(focus.text) > FOCUS_MAX_LINES) {
        problems.push({ where: FOCUS_PAGE_TITLE, problem: `has ${focusLineCount(focus.text)} lines; the limit is ${FOCUS_MAX_LINES}.` });
      }
    } catch (err) {
      problems.push({ where: FOCUS_PAGE_TITLE, problem: `cannot be read: ${err.message}` });
    }
    this.saveCache();
    const counts = countRecords(summaries);
    const inUse = counts.total - counts.retired;
    const detail = `Notion Memory database: ${inUse} record${inUse === 1 ? '' : 's'} in use, ${counts.retired} retired${problems.length ? `, ${problems.length} problem${problems.length === 1 ? '' : 's'} to look at` : ''}.`;
    return { ...base, lastSave: this.cache.lastSave || lastEdited || null, counts, healthy: true, detail, problems };
  }

  /** Record that the memory was exported (for the backup warning in doctor). */
  async markExport(dir) {
    this.cache.lastExport = this.now().toISOString();
    this.cache.lastExportTo = dir;
    this.saveCache();
  }
}

// Notion memory: records are rows of the project's Memory database; the
// current focus and the glossary are two child pages of the project page
// (ARCHITECTURE 7). Implements MemoryDriver from contract.mjs.
//
// How a record is stored:
// - Frontmatter -> properties: Key (the page title, <type>_<slug>), Type, Name,
//   Description, Status, Superseded by, Source, Saved, Last verified,
//   Approved by, and Other fields (any extra frontmatter keys, as JSON).
// - Body -> the page body, converted by lib/notion/markdown.mjs.
// - The stored text is serializeRecord() of the record read back, so every
//   backend gives the same text for the same record. version = its SHA-256.
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
  RECORD_TYPES, assertKey, assertValidRecord, assertValidFocus, assertValidGlossary, assertFilter, changeRecordStatus,
  checkExpect, countRecords, keywordScore, matchesFilter, normalizeDocument, normalizeRecord, notFound, parseRecord,
  recordSummary, restoreNote, retireNote, searchTerms, serializeRecord, sortRecords, versionOf, focusLineCount,
  FOCUS_MAX_LINES, isValidKey,
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
  approved_by: ['approvedBy', 'rich_text'],
};

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
    r.approved_by = r.approved_by || null;
    return r;
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
    const record = { ...summary, key, body };
    const extra = this.extraOf(page);
    if (extra) record.extra = extra;
    const text = serializeRecord(record);
    const { record: parsed, problems } = parseRecord(text, key);
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
      const extra = record.extra && Object.keys(record.extra).length ? JSON.stringify(record.extra) : '';
      props[this.p.extra] = writeValue('rich_text', extra);
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
        planned = await this.planBody(pageId, record.body, current.body, label);
        await this.client.updatePage(pageId, { properties: this.propertiesFor(record) });
        await this.applyPlan(pageId, planned.plan);
      } else {
        const page = await this.client.createPage({
          parent: { type: 'data_source_id', data_source_id: this.mem.dataSourceId },
          properties: this.propertiesFor(record),
          ...(record.body.trim() ? { markdown: toNotion(record.body) } : {}),
        });
        this.client.trust(page.id);
        pageId = page.id;
      }
      this.cache.records[record.key] = { ...(this.cache.records[record.key] || {}), tableStyle: detectTableStyle(record.body), lastEdited: null };
      const back = await this.client.getPage(pageId);
      const stored = await this.stored(back, { useCache: false });
      const same = ['type', 'name', 'description', 'status', 'superseded_by', 'source', 'saved', 'last_verified', 'approved_by']
        .every((f) => String(stored[f] ?? '') === String(record[f] ?? ''));
      const bodyOk = planned && planned.concurrent ? changedLeavesMatch(stored.body, record.body, planned.plan) : sameLocal(stored.body, record.body);
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
      hits.push({ key, name: s.name, type: s.type, description: s.description, status: s.status, score, snippet });
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
      const res = await this.writeRecord(record, current.version, action);
      return { key: k, version: res.version, record: res.record };
    });
  }

  async retire(key, { supersededBy, reason } = {}) {
    const by = supersededBy ? assertKey(supersededBy) : null;
    if (by && by === key) throw new ToolkitError(EXIT.INVALID, 'A record cannot be superseded by itself.');
    const note = retireNote(this.today(), { reason, supersededBy: by });
    return this.changeStatus(key, { status: 'retired', supersededBy: by, note }, 'retire');
  }

  async restore(key) {
    return this.changeStatus(key, { status: 'needs-review', supersededBy: null, note: restoreNote(this.today()) }, 'restore');
  }

  /**
   * Moves the page to the Notion trash. Notion deletes it for good after 30
   * days; until then it can be restored from the trash in the Notion app.
   */
  async delete(key) {
    const k = assertKey(key);
    return this.locked(async () => {
      const page = await this.findRow(k);
      if (!page) throw notFound(k, this.location);
      await this.client.updatePage(page.id, { in_trash: true });
      const back = await this.client.getPage(page.id);
      if (!back.in_trash) throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${k} is not in the Notion trash.`, { key: k });
      delete this.cache.records[k];
      this.saveCache('delete');
      return {
        key: k,
        deleted: true,
        trash: true,
        detail: `${k} was moved to the Notion trash. Notion deletes it for good after 30 days; until then it can be restored from the trash in the Notion app.`,
      };
    });
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

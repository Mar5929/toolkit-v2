// Notion memory: records are rows of the project's Memories database, in
// Lore's layout (lib/notion/lore-schema.mjs); the current focus and the
// glossary are two child pages of the project page (ARCHITECTURE 7).
// Implements MemoryDriver from contract.mjs.
//
// Two layouts, chosen by the memory block in .toolkit.json:
//
// Lore layout (`layout: "lore"`, what toolkit notion ensure-project builds).
// The project row has a "Memory" page holding Lore's five databases; a record
// is one row of its Memories database (lib/notion/schema.mjs lists the columns):
// - Frontmatter -> properties: Record Key (the key, <type>_<slug>; the toolkit
//   finds a row by it), Keywords (the key again, for Lore's search), Title (the
//   body's "# Title" line), Synopsis (description), Tags (the type), Status
//   (current = accepted, needs-review = proposed, superseded = superseded,
//   archived = deprecated), Supersedes (a relation to the rows this record
//   replaced), Superseded by, Source note (source), Saved, Last verified,
//   Authorization, and Other fields (JSON: any `metadata` keys besides type, any
//   other frontmatter keys, and the `supersedes` keys only when one of them has
//   no row to point at). Kind is always "note", Lore's Source is "manual",
//   Author is the owner, Agent is Claude Code or Codex, and Project points at
//   the project's row in the Memory page's Projects database.
// - A row without a Record Key (made in Notion, or by Lore's own tools) is not
//   a toolkit record: list and find leave it out and status names it.
//
// Older layout (no `layout`): one "Memory" database on the project row.
// Frontmatter -> properties: Key (the page title), Type, Name, Description,
// Status (current, needs-review, retired), Superseded by, Source, Saved, Last
// verified, Approved by, and Other fields (JSON, with "_heading" for a title
// the name does not give and "_status" for a superseded record that names no
// replacement). toolkit notion ensure-project moves such a project to the Lore
// layout; until then this driver still reads and writes it.
//
// In both layouts:
// - Body -> the page body, converted by lib/notion/markdown.mjs. It is the
//   model's topic body (# Title, **Remember:**, ...), the same as a built-in
//   .memory/ file, except its first "# Title" line: Notion drops a leading
//   level-1 heading from a new page, so the page holds the body without it.
// - A retired record is `superseded` when Superseded by or the body's newest
//   "**Superseded <date>:**" line says so, and `archived` otherwise.
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
  focusShapeProblems, isProposal,
} from './contract.mjs';
import { withLock } from '../core/lock.mjs';
import { normalizeId, isNotionError } from '../notion/client.mjs';
import { clientFor, notionCacheDir, readCache, writeCache } from '../notion/context.mjs';
import { fromNotion, toNotion, planUpdate, stripTitle, withTitle, sameLocal, detectTableStyle, localLeaves } from '../notion/markdown.mjs';
import { readValue, writeValue } from '../notion/props.mjs';
import { FOCUS_PAGE_TITLE, GLOSSARY_PAGE_TITLE, LORE_STATUS_FOR, STATUS_FROM_LORE } from '../notion/schema.mjs';

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

/** Lore layout: record field -> [property key, Notion type], for the fields stored as they are. */
const LORE_FIELDS = {
  description: ['synopsis', 'rich_text'],
  superseded_by: ['supersededBy', 'rich_text'],
  source: ['sourceNote', 'rich_text'],
  saved: ['saved', 'date'],
  last_verified: ['lastVerified', 'rich_text'],
  authorization: ['authorization', 'rich_text'],
};

/** Lore's Kind and Source for every toolkit record. */
export const LORE_KIND = 'note';
export const LORE_SOURCE = 'manual';

/** The Lore Status of a record. */
export function loreStatusOf(record) {
  return LORE_STATUS_FOR[storedStatus(record)] || LORE_STATUS_FOR.current;
}

/** The contract status and the stored word for a Lore Status ('' when empty or unknown). */
export function statusFromLore(value) {
  const word = STATUS_FROM_LORE[String(value ?? '').trim().toLowerCase()] || '';
  if (!word) return { status: String(value ?? '').trim(), word: null };
  return word === 'superseded' || word === 'archived' ? { status: 'retired', word } : { status: word, word: null };
}

/** The agent writing, for Lore's Agent column: Claude Code, Codex, or '' when not known. */
function agentName(env) {
  const e = env || {};
  if (e.PLUGIN_ROOT || e.PLUGIN_DATA || e.CODEX_THREAD_ID || e.CODEX_SANDBOX) return 'Codex';
  if (e.CLAUDECODE || e.CLAUDE_PLUGIN_ROOT || e.CLAUDE_PROJECT_DIR || e.CLAUDE_CODE_ENTRYPOINT) return 'Claude Code';
  return '';
}

/** Older layout: record field -> [property key, Notion type] */
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
  /**
   * lock: false writes without this computer's memory lock (used by toolkit
   * notion ensure-project when it moves records between layouts; the cache
   * file is still read and written, so table styles carry over).
   */
  constructor({ root, mainRoot, config = {}, env = process.env, now, client, runner, sleep, minIntervalMs, deadlineMs, timeoutMs, clock, lock = true } = {}) {
    this.backend = backend;
    const mem = (config.notion && config.notion.memory) || null;
    if (!mem || !mem.dataSourceId || !mem.properties) {
      throw new ToolkitError(EXIT.INVALID, 'Notion memory is not set up for this project: .toolkit.json has no notion.memory settings for the Memory page and its Lore databases (Projects, Topics, Memories, Entities, Facts).', {
        fix: 'Run toolkit notion ensure-project.',
      });
    }
    this.mem = mem;
    this.p = mem.properties;
    this.lore = mem.layout === 'lore';
    this.useLock = lock !== false;
    this.cacheRoot = mainRoot || root;
    this.now = typeof now === 'function' ? now : () => new Date();
    this.clock = typeof clock === 'function' ? clock : Date.now;
    this.inLock = false;
    this.owner = String((config.project && config.project.owner) || '').trim();
    this.agent = agentName(env);
    this.keyById = new Map(); // page id -> key, for the Supersedes relation
    this.client = client || clientFor({ config, root: this.cacheRoot, env, runner, sleep, minIntervalMs, deadlineMs, timeoutMs });
    this.location = this.lore
      ? `the Memories database on the project's Notion Memory page (Lore layout)${mem.url ? ` (${mem.url})` : ''}`
      : `the Notion Memory database${mem.url ? ` (${mem.url})` : ''}`;
    this.cache = this.loadCache();
  }

  loadCache() {
    const cache = readCache(this.cacheRoot, CACHE_FILE);
    if (!cache.records || typeof cache.records !== 'object') cache.records = {};
    // Entries stay after a move to the Lore layout: a cached body is used only for
    // the same page id (cacheUsable), and the table style belongs to the record text.
    return cache;
  }

  /**
   * Run a write with this computer's memory lock. The cache is read again
   * inside the lock, so an entry another command just wrote is not lost.
   */
  async locked(fn) {
    if (this.inLock || !this.useLock) return fn();
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

  /** The record key of a row: Record Key (Lore layout) or the page title (older layout). '' when it has none. */
  keyOf(page) {
    const v = this.lore ? readValue(page, this.p.recordKey) : readValue(page, 'title');
    return v === null || v === undefined ? '' : String(v).trim();
  }

  summaryOf(page) {
    if (this.lore) return this.loreSummaryOf(page);
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

  loreSummaryOf(page) {
    const r = {};
    for (const [field, [key]] of Object.entries(LORE_FIELDS)) {
      const v = this.p[key] ? readValue(page, this.p[key]) : null;
      r[field] = v === null || v === undefined ? '' : String(v);
    }
    const parts = splitKey(this.keyOf(page)) || {};
    const tags = (this.p.tags && readValue(page, this.p.tags)) || [];
    r.type = (Array.isArray(tags) ? tags : []).find((t) => RECORD_TYPES.includes(t)) || parts.type || '';
    r.name = parts.name || '';
    const { status, word } = statusFromLore(this.p.status ? readValue(page, this.p.status) : '');
    r.status = status;
    r.superseded_by = r.superseded_by || null;
    r.approved_by = approverFrom(r.authorization);
    if (word && status === 'retired') r.stored_status = word;
    return r;
  }

  /** The page ids of the rows with these keys: { ids, missing } (missing: keys with no row). */
  async pageIdsFor(keys) {
    const ids = [];
    const missing = [];
    for (const k of keys) {
      const row = await this.findRow(k);
      if (row) ids.push(normalizeId(row.id));
      else missing.push(k);
    }
    return { ids, missing };
  }

  /** The record key of the row with this page id (read from Notion when not seen yet), or null. */
  async keyForPageId(id) {
    const n = normalizeId(id || '');
    if (!n) return null;
    if (this.keyById.has(n)) return this.keyById.get(n);
    let page;
    try {
      page = await this.client.getPage(n);
    } catch (err) {
      if (isNotionError(err) && (err.status === 404 || err.status === 400)) return null;
      throw err;
    }
    const key = this.keyOf(page) || null;
    this.keyById.set(n, key);
    return key;
  }

  /**
   * Lore layout: the keys this record supersedes. The Supersedes relation, in
   * its order; the Other fields list instead when the last save could not point
   * at every key (a key with no row).
   */
  async supersedesOf(page, other) {
    if (other.supersedes.length) return other.supersedes;
    const ids = (this.p.supersedes && readValue(page, this.p.supersedes)) || [];
    const keys = [];
    for (const id of ids) {
      const k = await this.keyForPageId(id);
      if (k && isValidKey(k) && !keys.includes(k)) keys.push(k);
    }
    return keys;
  }

  /** Remember the key of every row read, for the Supersedes relation. */
  noteRows(rows) {
    for (const r of rows) {
      const k = this.keyOf(r);
      this.keyById.set(normalizeId(r.id), k || null);
    }
    return rows;
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
    return this.noteRows(await this.client.queryAll(this.mem.dataSourceId));
  }

  async findRow(key) {
    const filter = this.lore
      ? { property: this.p.recordKey, rich_text: { equals: key } }
      : { property: 'title', title: { equals: key } };
    const rows = this.noteRows(await this.client.queryAll(this.mem.dataSourceId, { filter }));
    const live = rows.filter((r) => !r.in_trash && this.keyOf(r) === key);
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
    const key = this.keyOf(page);
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
    const title = this.lore ? String(readValue(page, 'title') || '').trim() : other.heading;
    const heading = title || titleFromName(summary.name || (splitKey(key) || {}).name);
    const supersedes = this.lore ? await this.supersedesOf(page, other) : other.supersedes;
    const record = { ...summary, key, body: withTitle(heading, body), supersedes };
    if (!this.lore && other.word && record.status === 'retired') record.stored_status = other.word;
    if (other.metadata) record.metadata = other.metadata;
    if (other.extra) record.extra = other.extra;
    const text = serializeRecord(record);
    const { record: parsed, problems } = parseRecord(text, key);
    parsed.saved = summary.saved || '';
    this.cache.records[key] = { pageId: normalizeId(page.id), lastEdited: page.last_edited_time, readAt, body, url: page.url || null, tableStyle };
    return { ...parsed, version: versionOf(text), text, url: page.url || null, valid: problems.length === 0, problems };
  }

  /**
   * The page properties for a record. existing: the row as it is now (Lore
   * layout: Tags that are not a record type, put there in Notion or by Lore,
   * are kept).
   */
  async propertiesFor(record, { existing = null } = {}) {
    if (this.lore) return this.lorePropertiesFor(record, { existing });
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

  async lorePropertiesFor(record, { existing = null } = {}) {
    const props = {};
    const set = (key, type, value) => {
      if (this.p[key]) props[this.p[key]] = writeValue(type, value === null || value === undefined ? '' : value);
    };
    props.title = writeValue('title', stripTitle(record.body).title || titleFromName(record.name));
    set('recordKey', 'rich_text', record.key);
    set('keywords', 'rich_text', record.key);
    for (const [field, [key, type]] of Object.entries(LORE_FIELDS)) set(key, type, record[field]);
    set('kind', 'select', LORE_KIND);
    set('status', 'select', loreStatusOf(record));
    set('source', 'select', LORE_SOURCE);
    if (this.owner) set('author', 'rich_text', this.owner);
    if (this.agent) set('agent', 'rich_text', this.agent);
    if (this.p.tags) {
      const had = existing ? readValue(existing, this.p.tags) || [] : [];
      const others = (Array.isArray(had) ? had : []).filter((t) => !RECORD_TYPES.includes(t));
      props[this.p.tags] = { multi_select: [record.type, ...others].filter(Boolean).map((name) => ({ name: String(name) })) };
    }
    if (this.p.project && this.mem.projectRowId) props[this.p.project] = { relation: [{ id: this.mem.projectRowId }] };
    const supersedes = supersedesList(record.supersedes);
    const linked = this.p.supersedes ? await this.pageIdsFor(supersedes) : { ids: [], missing: supersedes };
    if (this.p.supersedes) props[this.p.supersedes] = { relation: linked.ids.map((id) => ({ id })) };
    if (this.p.extra) {
      const all = { ...(record.extra || {}) };
      // The keys live in the Supersedes relation; the list is kept here only when a key has no row to point at.
      if (linked.missing.length) all.supersedes = supersedes;
      if (record.metadata && Object.keys(record.metadata).some((k) => k !== 'type')) all.metadata = record.metadata;
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
      const properties = await this.propertiesFor(record, { existing });
      if (existing) {
        pageId = existing.id;
        // Plan the body before any write: a conflict with an edit made in Notion since the read above saves nothing.
        planned = await this.planBody(pageId, pageBody(record.body), pageBody(current.body), label);
        await this.client.updatePage(pageId, { properties });
        await this.applyPlan(pageId, planned.plan);
      } else {
        const page = await this.client.createPage({
          parent: { type: 'data_source_id', data_source_id: this.mem.dataSourceId },
          properties,
          ...(pageBody(record.body).trim() ? { markdown: toNotion(pageBody(record.body)) } : {}),
        });
        this.client.trust(page.id);
        pageId = page.id;
      }
      this.cache.records[record.key] = { ...(this.cache.records[record.key] || {}), tableStyle: detectTableStyle(record.body), lastEdited: null };
      const back = await this.client.getPage(pageId);
      const stored = await this.stored(back, { useCache: false });
      const same = COMPARED.every((f) => String(stored[f] ?? '') === String(record[f] ?? ''))
        && ((!this.lore && !this.p.extra) || supersedesList(stored.supersedes).join(',') === supersedesList(record.supersedes).join(','));
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
      const key = this.keyOf(page);
      if (!isValidKey(key)) continue;
      const s = this.summaryOf(page);
      out.push(recordSummary({ ...s, key }));
    }
    return sortRecords(out.filter((s) => matchesFilter(s, filter)));
  }

  /** Keyword search. Retired records only with `all`; saved proposals only with `proposals` or `all`. */
  async find(query, { reflect = false, limit = 10, type, all = false, proposals = false } = {}) {
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
    let proposalsLeftOut = 0;
    for (const page of rows) {
      const key = this.keyOf(page);
      if (!isValidKey(key)) continue;
      const s = { ...this.summaryOf(page), key };
      if (!all && s.status === 'retired') continue;
      if (type && s.type !== type) continue;
      const rec = await this.stored(page);
      const { score, snippet } = keywordScore(rec, terms);
      if (score <= 0) continue;
      if (!all && !proposals && isProposal(s)) {
        proposalsLeftOut++;
        continue;
      }
      hits.push({ key, name: s.name, type: s.type, description: s.description, status: s.status, stored_status: storedStatus(rec), superseded_by: rec.superseded_by ?? null, proposal: isProposal(s), score, snippet });
    }
    this.saveCache();
    hits.sort((a, b) => b.score - a.score || (a.key < b.key ? -1 : 1));
    const max = Number.isInteger(limit) && limit > 0 ? limit : 10;
    return { query: String(query), mode: 'keyword', results: hits.slice(0, max), proposalsLeftOut };
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
      await this.client.updatePage(page.id, { properties: await this.propertiesFor(record, { existing: page }) });
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
      const key = this.keyOf(page);
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
    return { count, changed, detail: `The Index view of the ${this.lore ? 'Memories database on the Notion Memory page' : 'Notion Memory database'} lists ${count} records in use; ${changed} record texts were refreshed in the local cache.` };
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
      const key = this.keyOf(page);
      if (!lastEdited || page.last_edited_time > lastEdited) lastEdited = page.last_edited_time;
      if (this.lore && !key) {
        const title = String(readValue(page, 'title') || '').trim();
        problems.push({ where: page.url || page.id, problem: `("${title || 'no title'}") has no Record Key, so the toolkit does not read it as a memory record. It was made in Notion or by Lore's own tools. Give it a Record Key (<type>_<slug>) to make it a record, or leave it.` });
        continue;
      }
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
      for (const p of focusShapeProblems(focus.text)) problems.push({ where: FOCUS_PAGE_TITLE, problem: `${p} Save it again with toolkit memory focus --text '<text>'; the command adds what is missing.` });
    } catch (err) {
      problems.push({ where: FOCUS_PAGE_TITLE, problem: `cannot be read: ${err.message}` });
    }
    this.saveCache();
    const counts = countRecords(summaries);
    const inUse = counts.total - counts.retired;
    const detail = `${this.lore ? 'Notion Memory page (Lore layout)' : 'Notion Memory database'}: ${inUse} record${inUse === 1 ? '' : 's'} in use, ${counts.retired} retired${problems.length ? `, ${problems.length} problem${problems.length === 1 ? '' : 's'} to look at` : ''}.`;
    return { ...base, lastSave: this.cache.lastSave || lastEdited || null, counts, healthy: true, detail, problems };
  }

  /** Record that the memory was exported (for the backup warning in doctor). */
  async markExport(dir) {
    this.cache.lastExport = this.now().toISOString();
    this.cache.lastExportTo = dir;
    this.saveCache();
  }
}

/**
 * Copy every record of one Notion memory database into another. toolkit
 * notion ensure-project uses it to move a project from the older single Memory
 * database into the Lore layout. from and to are NotionMemoryDriver objects.
 *
 * Each record is written with its stored text and read back; a record whose
 * read-back version is not the source version is reported in `failed`. Rows
 * with no memory key are not records and are listed in `skipped`. A record
 * already in `to` with the same text counts as `same`; with different text it
 * is replaced when overwrite is true (the source is still the project's
 * memory), and otherwise kept and listed in `kept`. Records that supersede
 * others are saved a second time once every row exists, so their Supersedes
 * relation points at the rows. The whole copy holds `to`'s memory lock.
 *
 * Returns { total, copied, same, kept: [{ key }], skipped: [{ title, url }], failed: [{ key, reason }] }.
 */
export async function copyRecords(from, to, { overwrite = false } = {}) {
  const out = { total: 0, copied: [], same: [], kept: [], skipped: [], failed: [] };
  const why = (err) => String((err && err.message) || err).replace(/\s+/g, ' ').trim();
  const recordOf = (rec) => {
    const { record } = parseRecord(rec.text, rec.key);
    record.saved = rec.saved || '';
    return record;
  };
  return to.locked(async () => {
    const sources = [];
    for (const page of await from.rows()) {
      const key = from.keyOf(page);
      if (!isValidKey(key)) {
        out.skipped.push({ title: key || String(readValue(page, 'title') || ''), url: page.url || null });
        continue;
      }
      if (sources.some((x) => x.key === key)) {
        out.skipped.push({ title: `${key} (a second row with this key)`, url: page.url || null });
        continue;
      }
      out.total += 1;
      try {
        sources.push({ key, rec: await from.stored(page, { useCache: false }) });
      } catch (err) {
        out.failed.push({ key, reason: `it could not be read: ${why(err)}` });
      }
    }
    // Pass 1: every record.
    for (const { key, rec } of sources) {
      try {
        const row = await to.findRow(key);
        if (!row) {
          await to.writeRecord(recordOf(rec), 'absent', 'migrate');
          out.copied.push(key);
          continue;
        }
        const cur = await to.stored(row, { useCache: false });
        if (cur.version === rec.version) out.same.push(key);
        else if (overwrite) {
          await to.writeRecord(recordOf(rec), cur.version, 'migrate');
          out.copied.push(key);
        } else out.kept.push({ key });
      } catch (err) {
        out.failed.push({ key, reason: why(err) });
      }
    }
    // Pass 2: records that supersede others, now that every row exists.
    for (const { key, rec } of sources) {
      if (!out.copied.includes(key) || !supersedesList(rec.supersedes).length) continue;
      try {
        const cur = await to.get(key);
        await to.writeRecord(recordOf(cur), cur.version, 'migrate');
      } catch (err) {
        out.failed.push({ key, reason: `its Supersedes relation was not set: ${why(err)}` });
      }
    }
    // Check: every copied record reads back with the text it had.
    for (const { key, rec } of sources) {
      if (!out.copied.includes(key)) continue;
      const back = await to.get(key);
      if (!back || back.version !== rec.version) {
        out.copied = out.copied.filter((k) => k !== key);
        out.failed.push({ key, reason: back ? 'it reads back with different text in the Lore layout' : 'it is missing after the copy' });
      }
    }
    return out;
  });
}

// The Notion tracker: work items as rows of the project's Work Items database
// (ARCHITECTURE 4.4). Implements the tracker driver interface in
// lib/work/driver.mjs, plus move() and transaction().
//
// How a work item is stored:
// - Frontmatter -> properties: title (Work item), id (ID, a Notion unique_id,
//   shown as WI-7 in Notion and as WI-007 by the toolkit), type, stage, status,
//   parent (the Parent item relation), waiting_on, priority, delivery,
//   requirements_approved, design, result_approved, updated. Two more
//   properties are filled from the body on every write: Next action and Open
//   owner questions, so a list needs no body reads.
// - Body -> the page body, converted by markdown.mjs. The "# <id>: <title>"
//   heading is not stored; it is rebuilt from the id and title on every read.
// - Design -> a child page "<id>: <title> — solution design"; its approval is
//   the Design approved property.
//
// Owner actions in Notion (ARCHITECTURE 4.4, I11):
// - A card made with the New button has an empty body. sync() adopts it: it
//   writes the work item template and fills empty fields (stage 01, Backlog).
// - A Stage dragged on the board: sync() keeps it and recomputes Status.
// - Parent item changed by hand: reported as a move (kind "reparented").
// - A card trashed or moved out of the database: reported as missing.
// - Owner edits win (model.reconcileRecord), with the values the toolkit last
//   wrote kept in a Git-ignored cache (context.notionCacheDir).
// - Body edits use update_content built from a fresh read, so text Mike
//   changed in other sections is kept; a clash in the same section is a conflict.

import { EXIT, ToolkitError } from '../core/output.mjs';
import { withLock } from '../core/lock.mjs';
import { today as todayDate } from '../core/util.mjs';
import { ensureDir } from '../core/fsx.mjs';
import {
  canonicalId, formatId, parseId, sameId, isPlaceholder, normalizeParent, composeDoc, parseDoc, reconcileRecord,
  snapshotWritten, newRecordText, getLabel, parseQuestions, isOpenOwnerQuestion, setDesignStatusLine, DESIGN_SUFFIX,
} from '../work/model.mjs';
import { DESIGN_FIELD_ORDER, DESIGN_STATUSES, statusForStage } from '../work/lifecycle.mjs';
import { loadTemplate, RECORD_FILE, DESIGN_FILE } from '../work/templates.mjs';
import { normalizeId, isNotionError } from './client.mjs';
import { clientFor, notionCacheDir, readCache, writeCache } from './context.mjs';
import { fromNotion, toNotion, planUpdate, stripTitle, withTitle, sameLocal, localLeaves } from './markdown.mjs';
import { readValue, writeValue, findValue } from './props.mjs';

export const type = 'notion';
export const CACHE_FILE = 'tracker.json';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** meta key -> [property key, Notion type]. */
const FIELD_PROPS = {
  title: ['title', 'title'],
  type: ['type', 'select'],
  stage: ['stage', 'select'],
  status: ['status', 'status'],
  waiting_on: ['waitingOn', 'rich_text'],
  priority: ['priority', 'select'],
  delivery: ['delivery', 'select'],
  requirements_approved: ['requirementsApproved', 'rich_text'],
  design: ['design', 'select'],
  result_approved: ['resultApproved', 'rich_text'],
  updated: ['updated', 'date'],
};

const ADOPT_DEFAULTS = {
  type: 'task',
  stage: '01-discovery',
  status: 'Backlog',
  waiting_on: 'none',
  priority: 'medium',
  delivery: 'not-offered',
  requirements_approved: 'no',
  design: 'none',
  result_approved: 'no',
};

export function emptyReport() {
  return { changed: false, moves: [], adopted: [], renumbered: [], ownerEdits: [], questions: [], derived: [], missing: [], problems: [] };
}

function notFound(id) {
  return new ToolkitError(EXIT.ERROR, `${id} was not found in the Notion Work Items database.`, {
    id,
    fix: 'Run toolkit work list --all to see every item, or toolkit work sync to check Notion again.',
  });
}

function conflictError(id, message, details = {}) {
  return new ToolkitError(EXIT.ERROR, `${id} changed in Notion while this command was running: ${message} Nothing was saved.`, {
    id,
    conflict: true,
    ...details,
    fix: 'Read the item again with toolkit work show, then redo the change.',
  });
}

/** Read the tracker cache (Git-ignored): { items: { id: {...} } }. */
export function readTrackerCache(root) {
  const data = readCache(root, CACHE_FILE);
  if (!data.items || typeof data.items !== 'object') data.items = {};
  return data;
}

export async function createTracker(project, options = {}) {
  return new NotionTracker(project, options);
}

export class NotionTracker {
  /**
   * @param {{ root: string, mainRoot: string, config: object }} project
   * @param {{ env?: object, pluginRoot?: string, today?: string|Function, client?: object, runner?: Function,
   *           deadlineMs?: number, timeoutMs?: number }} [opts]
   */
  constructor(project, opts = {}) {
    this.project = project;
    this.type = type;
    const config = project.config || {};
    const notion = config.notion || {};
    this.wi = notion.workItems || null;
    if (!this.wi || !this.wi.dataSourceId || !this.wi.properties) {
      throw new ToolkitError(EXIT.INVALID, 'The Notion Work Items database is not set up for this project.', {
        fix: 'Run toolkit notion ensure-project.',
      });
    }
    // The Work Items database's own prefix wins: it is what Mike sees in Notion.
    this.prefix = String(this.wi.idPrefix || (config.tracker && config.tracker.idPrefix) || 'WI').toUpperCase();
    this.p = this.wi.properties;
    this.ownerName = config.project ? config.project.owner : undefined;
    this.cacheRoot = project.mainRoot || project.root;
    this.pluginRoot = opts.pluginRoot;
    const env = opts.env || process.env;
    this.client = opts.client || clientFor({
      config, root: this.cacheRoot, env, runner: opts.runner, deadlineMs: opts.deadlineMs, timeoutMs: opts.timeoutMs, sleep: opts.sleep, minIntervalMs: opts.minIntervalMs,
    });
    const fixed = typeof opts.today === 'string' ? opts.today : env.TOOLKIT_TODAY && DATE_RE.test(env.TOOLKIT_TODAY) ? env.TOOLKIT_TODAY : null;
    this.today = typeof opts.today === 'function' ? opts.today : () => fixed || todayDate();
    this.capabilities = { move: true, groups: false, archive: true, localFiles: false };
    this.pageToId = new Map();
    this.idToPage = new Map();
    this.cache = readTrackerCache(this.cacheRoot);
    for (const [id, c] of Object.entries(this.cache.items)) {
      if (c && c.pageId) {
        this.pageToId.set(c.pageId, id);
        this.idToPage.set(id, c.pageId);
      }
    }
  }

  location(page) {
    return (page && page.url) || '';
  }

  /** The WORK-ITEM.md or DESIGN.md template as { text, source, path } (the driver interface in lib/work/driver.mjs). */
  template(name) {
    return loadTemplate(name, { pluginRoot: this.pluginRoot || undefined });
  }

  /** Run fn with a lock on this computer's cache folder, so two toolkit commands do not interleave writes. */
  async transaction(fn) {
    const dir = notionCacheDir(this.cacheRoot);
    ensureDir(dir);
    return withLock(dir, fn, { name: '.lock' });
  }

  saveCache() {
    this.cache.schema = 1;
    this.cache.dataSourceId = this.wi.dataSourceId;
    this.cache.updated = new Date().toISOString();
    writeCache(this.cacheRoot, CACHE_FILE, this.cache);
  }

  remember(id, page, extra = {}) {
    const pid = normalizeId(page.id);
    this.pageToId.set(pid, id);
    this.idToPage.set(id, pid);
    const meta = this.metaOf(page);
    const prev = this.cache.items[id] || {};
    this.cache.items[id] = {
      ...prev,
      pageId: pid,
      url: page.url || prev.url || null,
      lastEdited: page.last_edited_time || null,
      title: meta.title,
      stage: meta.stage,
      status: meta.status,
      waiting_on: meta.waiting_on,
      parent: meta.parent,
      archived: Boolean(readValue(page, this.p.archived)),
      nextAction: readValue(page, this.p.nextAction) || '',
      openOwnerQuestions: readValue(page, this.p.openOwnerQuestions) || 0,
      design: meta.design,
      fingerprint: this.fingerprint(page),
      missing: false,
      ...extra,
    };
  }

  /**
   * The row's property values in one string. Notion's last_edited_time has
   * minute precision, so a change made in the same minute as the toolkit's own
   * write is found by comparing these values instead.
   */
  fingerprint(page) {
    const meta = this.metaOf(page);
    return JSON.stringify([meta, Boolean(readValue(page, this.p.archived)), readValue(page, this.p.nextAction) || '', readValue(page, this.p.subItems) || []]);
  }

  // ------------------------------------------------------------------ properties <-> meta

  idOf(page) {
    const n = readValue(page, this.p.id);
    return typeof n === 'number' ? formatId(this.prefix, n) : null;
  }

  parentIdOf(page) {
    const rel = readValue(page, this.p.parent) || [];
    if (!rel.length) return 'none';
    const pid = normalizeId(rel[0]);
    return this.pageToId.get(pid) || `page:${pid}`;
  }

  metaOf(page) {
    const meta = { id: this.idOf(page) };
    for (const [field, [key]] of Object.entries(FIELD_PROPS)) {
      const v = readValue(page, this.p[key]);
      if (v !== null && v !== undefined && v !== '') meta[field] = String(v);
    }
    meta.parent = this.parentIdOf(page);
    return meta;
  }

  /** Properties to send for a meta patch (id is never sent; parent becomes the relation). */
  async propsFor(meta) {
    const out = {};
    for (const [field, value] of Object.entries(meta || {})) {
      if (field === 'id') continue;
      if (field === 'parent') {
        const parent = normalizeParent(value, this.prefix);
        if (parent === 'none') out[this.p.parent] = writeValue('relation', []);
        else {
          const page = await this.findPage(parent);
          if (!page) throw notFound(parent);
          out[this.p.parent] = writeValue('relation', [normalizeId(page.id)]);
        }
        continue;
      }
      const map = FIELD_PROPS[field];
      if (!map || !this.p[map[0]]) continue;
      out[this.p[map[0]]] = writeValue(map[1], value === 'none' && map[1] === 'select' && field !== 'design' ? null : value);
    }
    return out;
  }

  /** Next action and Open owner questions, read from a body. */
  bodyProps(body) {
    const out = {};
    if (this.p.nextAction) {
      const next = getLabel(body, 'Next action', { section: 'Overview' });
      out[this.p.nextAction] = writeValue('rich_text', next && !isPlaceholder(next) ? next : '');
    }
    if (this.p.openOwnerQuestions) {
      let n = 0;
      try {
        n = parseQuestions(body).filter((q) => isOpenOwnerQuestion(q, this.ownerName)).length;
      } catch {
        n = 0;
      }
      out[this.p.openOwnerQuestions] = writeValue('number', n);
    }
    return out;
  }

  // ------------------------------------------------------------------ finding pages

  async queryRows() {
    const rows = await this.client.queryAll(this.wi.dataSourceId);
    for (const r of rows) {
      const id = this.idOf(r);
      if (id) {
        this.pageToId.set(normalizeId(r.id), id);
        this.idToPage.set(id, normalizeId(r.id));
      }
    }
    return rows;
  }

  inDatabase(page) {
    const p = page && page.parent;
    return Boolean(p) && normalizeId(p.data_source_id || '') === normalizeId(this.wi.dataSourceId) && !page.in_trash;
  }

  /** The page of an item id, read fresh, or null. */
  async findPage(id) {
    const key = canonicalId(id, this.prefix);
    if (!key) return null;
    const cached = this.idToPage.get(key);
    if (cached) {
      try {
        const page = await this.client.getPage(cached);
        if (this.inDatabase(page) && this.idOf(page) === key) return page;
      } catch (err) {
        if (!(isNotionError(err) && (err.status === 404 || err.status === 400))) throw err;
      }
    }
    const n = parseId(key).n;
    const rows = await this.client.queryAll(this.wi.dataSourceId, { filter: { property: this.p.id, unique_id: { equals: n } } });
    const page = rows.find((r) => this.idOf(r) === key) || null;
    if (page) {
      this.pageToId.set(normalizeId(page.id), key);
      this.idToPage.set(key, normalizeId(page.id));
    }
    return page;
  }

  async resolveParentIds(meta) {
    if (meta.parent && meta.parent.startsWith('page:')) {
      const pid = meta.parent.slice(5);
      try {
        const page = await this.client.getPage(pid);
        const id = this.idOf(page);
        if (id) {
          this.pageToId.set(pid, id);
          meta.parent = id;
        }
      } catch {
        // Left as page:<id>; reported by validation.
      }
    }
    return meta;
  }

  /** The item's body as local Markdown, with the "# <id>: <title>" heading, plus the Notion text and child pages. */
  async readBody(page, id, title) {
    const md = await this.client.getMarkdown(page.id);
    if (md.truncated) {
      throw new ToolkitError(EXIT.ERROR, `${id} is too long for Notion to return in one read.`, { id, fix: 'Move some of its text into a child page.' });
    }
    const conv = fromNotion(md.markdown || '', { styleFrom: this.template(RECORD_FILE).text });
    const body = withTitle(`${id}: ${title}`, conv.markdown);
    return { body, notion: md.markdown || '', children: conv.children, empty: !String(md.markdown || '').trim() };
  }

  designChild(children) {
    return (children || []).find((c) => c.type === 'page' && /solution design\s*$/i.test(c.title)) || null;
  }

  record(page, { body, children } = {}) {
    const id = this.idOf(page);
    const meta = this.metaOf(page);
    const cached = this.cache.items[id] || {};
    const kids = [];
    const pid = normalizeId(page.id);
    const sub = readValue(page, this.p.subItems) || [];
    for (const k of sub) kids.push(this.pageToId.get(normalizeId(k)) || `page:${normalizeId(k)}`);
    const d = children ? this.designChild(children) : null;
    const designStatus = meta.design && meta.design !== 'none' ? meta.design : null;
    const rec = {
      id,
      meta,
      location: this.location(page),
      url: page.url || null,
      pageId: pid,
      archived: Boolean(readValue(page, this.p.archived)),
      parent: meta.parent,
      children: kids.sort(),
      design: d || cached.designPageId || designStatus
        ? { status: designStatus || 'proposed', location: d ? d.url : cached.designUrl || null }
        : null,
      nextAction: readValue(page, this.p.nextAction) || '',
      openOwnerQuestions: readValue(page, this.p.openOwnerQuestions) || 0,
    };
    if (body !== undefined) rec.body = body;
    return rec;
  }

  // ------------------------------------------------------------------ driver interface

  /** Every item. Reads only. Bodies are left out unless includeBody is true (one extra call per item). */
  async list({ includeArchived = true, includeBody = false } = {}) {
    const rows = await this.queryRows();
    const out = [];
    for (const page of rows) {
      const id = this.idOf(page);
      if (!id) continue;
      const archived = Boolean(readValue(page, this.p.archived));
      if (!includeArchived && archived) continue;
      let body;
      let children;
      if (includeBody) {
        const meta = this.metaOf(page);
        ({ body, children } = await this.readBody(page, id, meta.title || ''));
      }
      out.push(this.record(page, { body, children }));
      this.remember(id, page);
    }
    this.saveCache();
    return out.sort((a, b) => parseId(a.id).n - parseId(b.id).n);
  }

  /** One item with its body, or null. */
  async get(id) {
    const page = await this.findPage(id);
    if (!page) return null;
    const key = this.idOf(page);
    const meta = await this.resolveParentIds(this.metaOf(page));
    const { body, children } = await this.readBody(page, key, meta.title || '');
    const rec = this.record(page, { body, children });
    rec.meta.parent = meta.parent;
    rec.parent = meta.parent;
    const d = this.designChild(children);
    this.remember(key, page, d ? { designPageId: normalizeId(d.url), designUrl: d.url } : {});
    this.saveCache();
    return rec;
  }

  /** The item ids known from the last read. */
  knownIds() {
    return Object.keys(this.cache.items);
  }

  /**
   * Create an item; returns its id. Notion assigns the number, so two agents
   * can never take the same one. meta.id is ignored.
   */
  async create({ meta, body }, { group } = {}) {
    if (group) {
      throw new ToolkitError(EXIT.UNSUPPORTED, 'Notion work items have no group folders. Put the item under another item with --parent instead.');
    }
    if (!meta || isPlaceholder(meta.title)) throw new ToolkitError(EXIT.INVALID, 'A new item needs a title.');
    const local = stripTitle(body || '').body;
    const properties = {
      ...(await this.propsFor({ ...meta, parent: meta.parent || 'none' })),
      ...this.bodyProps(local),
    };
    const created = await this.client.createPage({
      parent: { type: 'data_source_id', data_source_id: this.wi.dataSourceId },
      properties,
      ...(local.trim() ? { markdown: toNotion(local) } : {}),
    });
    this.client.trust(created.id);
    const id = this.idOf(created) || this.idOf(await this.client.getPage(created.id));
    if (!id) throw new ToolkitError(EXIT.ERROR, 'Saved but not verified: Notion did not return the new item\'s ID.', { pageId: created.id });
    // A body written before the id was known may name a provisional id.
    const provisional = meta.id ? canonicalId(meta.id, this.prefix) : null;
    if (provisional && provisional !== id && local.includes(provisional)) {
      try {
        await this.client.patchMarkdown(created.id, {
          type: 'update_content',
          update_content: { content_updates: [{ old_str: provisional, new_str: id, replace_all_matches: true }] },
        });
      } catch (err) {
        if (!(isNotionError(err) && err.status === 400)) throw err;
      }
    }
    const back = await this.findPage(id);
    if (!back) throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${id} was not found after it was created.`, { id });
    const read = await this.readBody(back, id, this.metaOf(back).title || '');
    const expected = provisional && provisional !== id ? local.split(provisional).join(id) : local;
    if (this.metaOf(back).title !== String(meta.title) || !sameLocal(stripTitle(read.body).body, expected)) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${id} in Notion does not match what was written.`, { id, location: back.url });
    }
    this.remember(id, back, { written: snapshotWritten(this.metaOf(back), read.body, {}, this.prefix) });
    this.saveCache();
    return id;
  }

  /**
   * Change an item's properties and/or body. The body edit is built from a
   * fresh read (update_content), so edits Mike made in other sections are
   * kept. A section changed both in Notion and by this update is a conflict.
   */
  async update(id, { meta = {}, body, expectBody, expectMeta } = {}) {
    const page = await this.findPage(id);
    if (!page) throw notFound(id);
    const key = this.idOf(page);
    const current = await this.resolveParentIds(this.metaOf(page));
    if (expectMeta) {
      for (const [k, v] of Object.entries(expectMeta)) {
        if (k === 'parent' ? normalizeParent(current.parent, this.prefix) !== normalizeParent(v, this.prefix) : (current[k] ?? undefined) !== (v ?? undefined)) {
          throw conflictError(key, `${k} is now "${current[k] ?? ''}".`);
        }
      }
    }
    if (meta.id !== undefined && !sameId(meta.id, key)) throw new ToolkitError(EXIT.INVALID, 'The id of an item cannot be changed.');
    const patch = { ...meta };
    delete patch.id;
    let plan = null;
    let next = null;
    let fresh = null;
    if (body !== undefined && body !== null) {
      fresh = await this.readBody(page, key, current.title || '');
      next = stripTitle(body).body;
      const base = expectBody !== undefined && expectBody !== null ? stripTitle(expectBody).body : undefined;
      try {
        plan = planUpdate({ fresh: fresh.notion, base, next });
      } catch (err) {
        if (err && err.details && err.details.conflicts) throw conflictError(key, err.message, { conflicts: err.details.conflicts });
        throw err;
      }
    }
    // Everything that can refuse the update (a conflict, a parent that is not
    // found) runs before the first write, so a refused update saves nothing.
    const properties = await this.propsFor(patch);
    if (next !== null) Object.assign(properties, this.bodyProps(next));
    if (plan && plan.type === 'update_content') {
      await this.client.patchMarkdown(page.id, { type: 'update_content', update_content: { content_updates: plan.ops } });
    } else if (plan && plan.type === 'replace_content') {
      await this.client.patchMarkdown(page.id, { type: 'replace_content', replace_content: { new_str: plan.new_str } });
    }
    if (Object.keys(properties).length) await this.client.updatePage(page.id, { properties });

    const back = await this.findPage(key);
    if (!back) throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${key} was not found after writing.`, { id: key });
    const backMeta = await this.resolveParentIds(this.metaOf(back));
    const read = await this.readBody(back, key, backMeta.title || '');
    for (const [k, v] of Object.entries(patch)) {
      if (k !== 'parent' && !(FIELD_PROPS[k] && this.p[FIELD_PROPS[k][0]])) continue; // not stored in Notion
      const want = k === 'parent' ? normalizeParent(v, this.prefix) : String(v ?? '');
      const got = k === 'parent' ? normalizeParent(backMeta.parent, this.prefix) : String(backMeta[k] ?? '');
      const noneLike = (x) => x === '' || x === 'none';
      if (want !== got && !(noneLike(want) && noneLike(got))) {
        throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${key} ${k} reads back as "${got}", not "${want}".`, { id: key, field: k });
      }
    }
    if (plan && plan.type !== 'none' && !this.leavesMatch(stripTitle(read.body).body, next, plan.changed)) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the text of ${key} in Notion does not match what was written.`, { id: key, location: back.url });
    }
    const rec = this.record(back, { body: read.body, children: read.children });
    rec.meta.parent = backMeta.parent;
    rec.parent = backMeta.parent;
    this.remember(key, back, { written: this.writtenAfter(key, backMeta, read.body) });
    this.saveCache();
    return rec;
  }

  writtenAfter(id, meta, body) {
    const prev = (this.cache.items[id] && this.cache.items[id].written) || null;
    const snap = snapshotWritten(meta, body, {}, this.prefix);
    if (prev) {
      for (const k of ['statusKept', 'overallKept', 'designKept', 'parentKept']) if (prev[k] !== undefined) snap[k] = false;
    }
    return snap;
  }

  leavesMatch(backLocal, nextLocal, changed = []) {
    if (!changed || !changed.length) return sameLocal(backLocal, nextLocal);
    const back = new Map(localLeaves(backLocal).map((l) => [l.key, l.local]));
    const want = new Map(localLeaves(nextLocal).map((l) => [l.key, l.local]));
    return changed.every((k) => !want.has(k) || back.get(k) === want.get(k));
  }

  // ------------------------------------------------------------------ design

  async findDesignPage(page, id) {
    const cached = this.cache.items[id] && this.cache.items[id].designPageId;
    if (cached) {
      try {
        const d = await this.client.getPage(cached);
        if (!d.in_trash && normalizeId(d.parent && d.parent.page_id) === normalizeId(page.id)) return d;
      } catch (err) {
        if (!(isNotionError(err) && (err.status === 404 || err.status === 400))) throw err;
      }
    }
    const blocks = await this.client.childrenAll(page.id);
    const b = blocks.find((x) => x.type === 'child_page' && /solution design\s*$/i.test((x.child_page && x.child_page.title) || ''));
    if (!b) return null;
    return this.client.getPage(b.id);
  }

  designTitle(id, title) {
    return `${id}: ${title}${DESIGN_SUFFIX}`;
  }

  /** The item's design: { id, meta, body, location, text } or null. */
  async getDesign(id) {
    const page = await this.findPage(id);
    if (!page) throw notFound(id);
    const key = this.idOf(page);
    const meta = this.metaOf(page);
    const d = await this.findDesignPage(page, key);
    if (!d) return null;
    const md = await this.client.getMarkdown(d.id);
    const conv = fromNotion(md.markdown || '', { styleFrom: this.template(DESIGN_FILE).text });
    const body = withTitle(this.designTitle(key, meta.title || ''), conv.markdown);
    const line = /^Status:[ \t]*(\S+)/m.exec(conv.markdown);
    const status = line && DESIGN_STATUSES.includes(line[1]) ? line[1] : DESIGN_STATUSES.includes(meta.design) ? meta.design : 'proposed';
    const approved = (this.p.designApproved && readValue(page, this.p.designApproved)) || 'no';
    const dmeta = { work_item: key, status, approved };
    this.remember(key, page, { designPageId: normalizeId(d.id), designUrl: d.url });
    this.saveCache();
    return { id: key, meta: dmeta, body, location: d.url, text: composeDoc(dmeta, body, DESIGN_FIELD_ORDER) };
  }

  /**
   * Write the whole design (DESIGN.md text with frontmatter). Without create, a
   * missing design is an error. The caller updates the item's own design field.
   */
  async setDesign(id, markdown, { create = false } = {}) {
    const page = await this.findPage(id);
    if (!page) throw notFound(id);
    const key = this.idOf(page);
    const meta = this.metaOf(page);
    const doc = parseDoc(String(markdown ?? ''));
    const status = DESIGN_STATUSES.includes(doc.meta.status) ? doc.meta.status : 'proposed';
    const approved = doc.meta.approved !== undefined && doc.meta.approved !== '' ? String(doc.meta.approved) : 'no';
    const local = stripTitle(setDesignStatusLine(doc.hasFrontmatter ? doc.body : String(markdown ?? ''), status)).body;
    let d = await this.findDesignPage(page, key);
    const title = this.designTitle(key, meta.title || '');
    if (!d) {
      if (!create) {
        throw new ToolkitError(EXIT.ERROR, `${key} has no design yet.`, { id: key, fix: `Create one with: toolkit work design ${key} --create` });
      }
      d = await this.client.createPage({
        parent: { type: 'page_id', page_id: normalizeId(page.id) },
        properties: { title: writeValue('title', title) },
        ...(local.trim() ? { markdown: toNotion(local) } : {}),
      });
      this.client.trust(d.id);
    } else {
      const md = await this.client.getMarkdown(d.id);
      const plan = planUpdate({ fresh: md.markdown || '', next: local });
      if (plan.type === 'update_content') await this.client.patchMarkdown(d.id, { type: 'update_content', update_content: { content_updates: plan.ops } });
      else if (plan.type === 'replace_content') await this.client.patchMarkdown(d.id, { type: 'replace_content', replace_content: { new_str: plan.new_str } });
      const currentTitle = readValue(d, 'title');
      if (currentTitle !== title) await this.client.updatePage(d.id, { properties: { title: writeValue('title', title) } });
    }
    if (this.p.designApproved && (readValue(page, this.p.designApproved) || 'no') !== approved) {
      await this.client.updatePage(page.id, { properties: { [this.p.designApproved]: writeValue('rich_text', approved) } });
    }
    this.remember(key, page, { designPageId: normalizeId(d.id), designUrl: d.url });
    const back = await this.getDesign(key);
    if (!back || !sameLocal(stripTitle(back.body).body, local)) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the design of ${key} in Notion does not match what was written.`, { id: key });
    }
    return back;
  }

  // ------------------------------------------------------------------ move

  /** target: an item id (sets Parent item), "root" (clears it), or "archive" (ticks Archived). */
  async move(id, target) {
    const page = await this.findPage(id);
    if (!page) throw notFound(id);
    const key = this.idOf(page);
    const before = await this.resolveParentIds(this.metaOf(page));
    const wasArchived = Boolean(readValue(page, this.p.archived));
    const t = String(target || '').trim();
    const properties = {};
    let parentAfter = before.parent;
    let archived = wasArchived;
    if (t.toLowerCase() === 'archive') {
      if (!this.p.archived) throw new ToolkitError(EXIT.UNSUPPORTED, 'The Work Items database has no Archived property. Run toolkit notion ensure-project.');
      properties[this.p.archived] = writeValue('checkbox', true);
      archived = true;
    } else if (t.toLowerCase() === 'root') {
      properties[this.p.parent] = writeValue('relation', []);
      if (wasArchived && this.p.archived) properties[this.p.archived] = writeValue('checkbox', false);
      parentAfter = 'none';
      archived = false;
    } else if (parseId(t, this.prefix)) {
      const targetId = canonicalId(t, this.prefix);
      if (sameId(targetId, key)) throw new ToolkitError(EXIT.INVALID, `${key} cannot be put under itself.`);
      const rows = await this.queryRows();
      const parentOf = new Map(rows.map((r) => [this.idOf(r), this.parentIdOf(r)]));
      for (let cur = targetId, n = 0; cur && cur !== 'none' && n < 100; cur = parentOf.get(cur), n++) {
        if (sameId(cur, key)) throw new ToolkitError(EXIT.INVALID, `${targetId} is inside ${key}, so ${key} cannot be put under it.`);
      }
      const tp = rows.find((r) => this.idOf(r) === targetId);
      if (!tp) throw notFound(targetId);
      properties[this.p.parent] = writeValue('relation', [normalizeId(tp.id)]);
      if (wasArchived && this.p.archived) properties[this.p.archived] = writeValue('checkbox', false);
      parentAfter = targetId;
      archived = false;
    } else {
      throw new ToolkitError(EXIT.UNSUPPORTED, `Notion work items have no group folders, so "${t}" is not a place to move to. Use an item id, root, or archive.`);
    }
    const unchanged = parentAfter === before.parent && archived === wasArchived;
    if (!unchanged) await this.client.updatePage(page.id, { properties });
    const back = await this.findPage(key);
    const after = await this.resolveParentIds(this.metaOf(back));
    if (normalizeParent(after.parent, this.prefix) !== normalizeParent(parentAfter, this.prefix)) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the parent of ${key} reads back as ${after.parent}.`, { id: key });
    }
    const written = (this.cache.items[key] && this.cache.items[key].written) || null;
    this.remember(key, back, written ? { written: { ...written, parent: normalizeParent(after.parent, this.prefix) } } : {});
    this.saveCache();
    return {
      id: key,
      from: before.parent === 'none' ? 'root' : before.parent,
      to: archived ? 'archive' : parentAfter === 'none' ? 'root' : parentAfter,
      parentBefore: before.parent,
      parentAfter: after.parent,
      archived,
      nested: parentAfter !== 'none',
      unchanged,
      location: back.url,
    };
  }

  // ------------------------------------------------------------------ sync

  /**
   * Read the database, adopt cards made with the New button, recompute Status
   * from Stage, keep and report owner edits, and report re-parented, trashed,
   * and moved-out items. quick: stop after one query when nothing was edited
   * since the last sync on this computer.
   */
  async sync({ quick = false, write = true } = {}) {
    const report = emptyReport();
    const rows = await this.queryRows();
    const seen = new Set();
    const today = this.today();
    const changedRows = [];
    for (const page of rows) {
      const id = this.idOf(page);
      if (!id) continue;
      seen.add(id);
      const c = this.cache.items[id];
      if (!c || c.lastEdited !== page.last_edited_time || c.missing || c.fingerprint !== this.fingerprint(page)) changedRows.push(page);
    }
    const gone = Object.keys(this.cache.items).filter((id) => !seen.has(id) && !this.cache.items[id].missing);
    if (quick && !changedRows.length && !gone.length) return report;
    const work = quick ? changedRows : rows.filter((p) => this.idOf(p));

    for (const page of work) {
      const id = this.idOf(page);
      try {
        await this.syncOne(page, id, { report, today, write });
      } catch (err) {
        if (err && err.details && err.details.conflict) {
          report.problems.push({ severity: 'warning', id, location: page.url, message: `${id} changed while it was being checked; it will be checked again next time.` });
          continue;
        }
        throw err;
      }
    }

    for (const id of gone) {
      const c = this.cache.items[id];
      let reason = 'It is no longer in the Work Items database.';
      if (c.pageId) {
        try {
          const p = await this.client.getPage(c.pageId);
          if (p.in_trash) reason = 'It was moved to the Notion trash.';
          else if (!this.inDatabase(p)) reason = 'It was moved out of the Work Items database.';
        } catch (err) {
          if (!(isNotionError(err) && (err.status === 404 || err.status === 400))) throw err;
          reason = 'It was deleted from Notion.';
        }
      }
      report.missing.push({ id, lastLocation: c.url || null, reason });
      c.missing = true;
    }
    if (write) this.saveCache();
    return report;
  }

  async syncOne(page, id, { report, today, write }) {
    const cached = this.cache.items[id] || null;
    let meta = await this.resolveParentIds(this.metaOf(page));
    const title = meta.title || '';
    let read = await this.readBody(page, id, title);

    // A card made with the New button: fill in the template and the empty fields.
    if (read.empty) {
      if (!title.trim()) {
        report.problems.push({ severity: 'warning', id, location: page.url, message: `${id} has no title, so it was not set up. Give it a title in Notion.` });
        return;
      }
      if (!write) {
        report.problems.push({ severity: 'warning', id, location: page.url, message: `${id} has an empty body and will be set up on the next sync.` });
        return;
      }
      const fields = { ...ADOPT_DEFAULTS, updated: today };
      for (const k of Object.keys(ADOPT_DEFAULTS)) if (meta[k]) fields[k] = meta[k];
      const text = newRecordText(this.template(RECORD_FILE).text, {
        ...fields,
        id,
        title,
        parent: meta.parent,
        historyChange: `Created in Notion by hand as ${id}.`,
        historyEffect: 'The toolkit filled in the work item template.',
      });
      const doc = parseDoc(text);
      const patch = {};
      for (const k of Object.keys(fields)) if (!meta[k]) patch[k] = fields[k];
      if (meta.stage && !meta.status) patch.status = statusForStage(meta.stage) || 'Backlog';
      await this.update(id, { meta: { ...patch, updated: today }, body: doc.body });
      report.adopted.push({ id, location: page.url, reason: 'A card made in Notion with an empty body; the work item template was filled in.' });
      report.changed = true;
      return;
    }

    // Moves: a parent changed by hand, or the Archived box.
    if (cached && cached.parent !== undefined && normalizeParent(cached.parent, this.prefix) !== normalizeParent(meta.parent, this.prefix)) {
      report.moves.push({ id, kind: 'reparented', from: cached.parent, to: meta.parent, parentBefore: cached.parent, parentAfter: meta.parent, location: page.url });
    }
    const archived = Boolean(readValue(page, this.p.archived));
    if (cached && cached.archived !== undefined && cached.archived !== archived) {
      report.moves.push({ id, kind: archived ? 'archived' : 'unarchived', from: cached.archived ? 'archive' : 'board', to: archived ? 'archive' : 'board', parentBefore: meta.parent, parentAfter: meta.parent, location: page.url });
    }

    // Derived values and owner edits.
    const written = cached && cached.written ? { ...cached.written } : null;
    if (written) written.parent = meta.parent; // In Notion the relation is the parent; there is no location to compare.
    const designSource = meta.design && meta.design !== 'none' ? meta.design : undefined;
    const r = reconcileRecord({ meta, body: read.body, sources: designSource ? { design: designSource } : {}, written, today, prefix: this.prefix });
    report.ownerEdits.push(...r.ownerEdits.map((e) => ({ ...e, location: page.url })));
    report.questions.push(...r.questions);
    report.derived.push(...r.derived.filter((d) => d.field !== 'heading'));
    let latest = page;
    if (write && r.changed) {
      const bodyChanged = !sameLocal(stripTitle(r.body).body, stripTitle(read.body).body);
      const rec = await this.update(id, { meta: r.patch, ...(bodyChanged ? { body: r.body, expectBody: read.body } : {}) });
      latest = await this.findPage(id);
      meta = rec.meta;
      read = { body: rec.body };
      report.changed = true;
    }
    const snap = r.written;
    this.remember(id, latest, { written: snap });
  }
}

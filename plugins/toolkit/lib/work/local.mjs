// The local tracker: work items as folders under .work-items/ in the main
// checkout (ARCHITECTURE 4.3). Implements the tracker driver interface in
// driver.mjs, plus move(), which only a folder tracker can do.
//
// Rules this file keeps:
// - Identity is the frontmatter `id`. Any *.md with an `id` like WI-7 and no
//   `work_item` key is a record. Folder and file names may change.
// - Skipped: work-item-template/, folders starting with "_" or ".", and records
//   whose title is still "<Work item title>" (reported, not adopted).
// - A WORK-ITEM.md with no id is adopted with the next id. When it holds free
//   text instead of the template sections, it gets the template body and its
//   text goes under "### Starting request".
// - A record the frontmatter reader cannot read (or one that lost a --- line
//   or its id line) is reported with its path and the reader's message and
//   left alone. Its item stays known: it is not reported missing, not
//   adopted, and its id is never given to anything else.
// - Two records with the same id: the one at the path the state file knows
//   keeps it; the newcomer gets the next free id. Ids are never reused.
// - Nesting is the parent: a record inside another item's folder is its
//   sub-item. Plain folders are groups and do not change parents. archive/ is
//   a reserved group.
// - Owner edits win (model.reconcileRecord).
// - Every write happens under .work-items/.lock and is a temp file + rename.
// - A state file written by a newer toolkit (a higher schema) stops every
//   write before any file is touched.

import fs from 'node:fs';
import path from 'node:path';
import { atomicWrite, sha256, ensureDir, readText } from '../core/fsx.mjs';
import { withLock } from '../core/lock.mjs';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { today as todayDate, slugify } from '../core/util.mjs';
import {
  parseDoc, tryParseDoc, peekHeader, serializeDoc, composeDoc, applyMetaPatch, setH1, getH1, appendHistory, reconcileRecord, snapshotWritten,
  parseId, formatId, canonicalId, sameId, isPlaceholder, normalizeParent, DESIGN_SUFFIX, setDesignStatusLine,
  isFreeForm, freeTextForRequest, newRecordText,
} from './model.mjs';
import { DESIGN_FIELD_ORDER, DESIGN_STATUSES, FIELD_ORDER, findStage, statusForStage } from './lifecycle.mjs';
import { TRACKER_DIR, LOCK_NAME, DASHBOARD_FILE, ARCHIVE_DIR, trackerDirFor, scanTree, readState, writeState, isSkippedDir, newerStateError } from './state.mjs';
import { RECORD_FILE, DESIGN_FILE, loadTemplate } from './templates.mjs';
import { renderDashboard } from './dashboard.mjs';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const FOLDER_ID_RE = /^([A-Za-z][A-Za-z0-9]*-\d+)(.*)$/;

function parentDir(rel) {
  if (!rel) return null;
  const i = rel.lastIndexOf('/');
  return i === -1 ? '' : rel.slice(0, i);
}

function baseName(rel) {
  const i = rel.lastIndexOf('/');
  return i === -1 ? rel : rel.slice(i + 1);
}

function joinRel(a, b) {
  return a ? (b ? `${a}/${b}` : a) : b;
}

const REPORT_LISTS = ['moves', 'adopted', 'renumbered', 'ownerEdits', 'questions', 'derived', 'missing', 'problems'];

export function emptyReport() {
  return { changed: false, moves: [], adopted: [], renumbered: [], ownerEdits: [], questions: [], derived: [], missing: [], problems: [] };
}

function notFound(id) {
  return new ToolkitError(EXIT.ERROR, `${id} was not found in ${TRACKER_DIR}/.`, { id, fix: 'Run toolkit work list --all to see every item, or toolkit work sync to rescan.' });
}

function conflict(id, what) {
  return new ToolkitError(EXIT.ERROR, `${id} changed while this command was running (${what}). Nothing was saved.`, { id, conflict: true, fix: 'Run the command again.' });
}

export class LocalTracker {
  /**
   * @param {{ root: string, mainRoot: string, config: object }} project
   * @param {{ today?: string|(() => string), pluginRoot?: string, env?: object }} [opts]
   */
  constructor(project, opts = {}) {
    this.project = project;
    this.type = 'local';
    this.prefix = String((project.config && project.config.tracker && project.config.tracker.idPrefix) || 'WI').toUpperCase();
    this.dir = trackerDirFor(project.mainRoot || project.root);
    this.ownerName = project.config && project.config.project ? project.config.project.owner : undefined;
    this.pluginRoot = opts.pluginRoot;
    const env = opts.env || process.env;
    const fixed = typeof opts.today === 'string' ? opts.today : env.TOOLKIT_TODAY && DATE_RE.test(env.TOOLKIT_TODAY) ? env.TOOLKIT_TODAY : null;
    this.today = typeof opts.today === 'function' ? opts.today : () => fixed || todayDate();
    this.capabilities = { move: true, groups: true, archive: true, localFiles: true };
  }

  get trackerDir() {
    return this.dir;
  }

  /** Where a tracker-relative path is, for people: ".work-items/<rel>". */
  location(rel) {
    return `${TRACKER_DIR}/${rel}`;
  }

  /** Run fn while holding .work-items/.lock. Calls inside fn do not wait for the lock again. */
  async transaction(fn) {
    return withLock(this.dir, fn, { name: LOCK_NAME });
  }

  template(name) {
    return loadTemplate(name, { trackerDir: this.dir, pluginRoot: this.pluginRoot });
  }

  // ------------------------------------------------------------------ reading

  _readFiles(tree, state) {
    const records = [];
    const designs = [];
    const idless = [];
    const skipped = [];
    const foreign = [];
    const unreadable = [];
    // The last known path of each item that was still found at the last scan.
    const pathOwner = new Map();
    for (const [id, e] of Object.entries(state.items)) if (e && typeof e.path === 'string' && !e.missing) pathOwner.set(e.path, id);
    for (const f of tree.files) {
      let text;
      try {
        text = fs.readFileSync(f.abs, 'utf8');
      } catch {
        continue;
      }
      const loc = { rel: f.rel, abs: f.abs, name: f.name, dirRel: f.dirRel, mtimeMs: f.mtimeMs, birthtimeMs: f.birthtimeMs, hash: sha256(text) };
      const { doc, error } = tryParseDoc(text);
      if (!doc) {
        const u = this._unreadableEntry(loc, pathOwner, peekHeader(text), `The frontmatter cannot be read (${error}).`);
        if (u) unreadable.push(u);
        continue;
      }
      if (!doc.hasFrontmatter) {
        // A record whose opening or closing --- line was deleted: its id line is
        // still near the top. It is reported, never adopted under a new id.
        const peek = peekHeader(text);
        if ((peek.id || peek.workItem) && (peek.startsWithKey || f.name === RECORD_FILE || f.name === DESIGN_FILE)) {
          const u = this._unreadableEntry(loc, pathOwner, peek, 'The frontmatter block is missing its opening or closing "---" line.');
          if (u) {
            unreadable.push(u);
            continue;
          }
        }
      }
      const base = { ...loc, text, doc, meta: doc.meta, body: doc.body };
      if (doc.kind === 'design') {
        designs.push({ ...base, workItem: canonicalId(doc.meta.work_item) });
        continue;
      }
      const idp = doc.kind === 'record' ? parseId(doc.meta.id) : null;
      if (idp && idp.prefix === this.prefix) {
        const id = formatId(idp.prefix, idp.n);
        const known = state.items[id];
        if (isPlaceholder(doc.meta.title) && !(known && known.path === f.rel)) {
          const h1 = getH1(doc.body);
          if (!(h1 && h1.title && !isPlaceholder(h1.title))) {
            skipped.push({ ...base, id });
            continue;
          }
        }
        records.push({ ...base, id, n: idp.n, rawId: doc.meta.id });
        continue;
      }
      if (idp && idp.prefix !== this.prefix) {
        foreign.push(base);
        continue;
      }
      if (f.name === RECORD_FILE) {
        const h1 = getH1(doc.body);
        const title = !isPlaceholder(doc.meta.title) ? doc.meta.title : h1 && !isPlaceholder(h1.title) ? h1.title : null;
        if (title) idless.push({ ...base, title });
        else skipped.push({ ...base, id: null });
      }
    }
    // A WORK-ITEM.md with no usable id at a path the state file knows, whose
    // item is not found anywhere else, is that item with its id line removed
    // or broken by hand: reported and kept, not adopted under a new id.
    const recordIds = new Set(records.map((r) => r.id));
    for (let i = idless.length - 1; i >= 0; i--) {
      const r = idless[i];
      const was = pathOwner.get(r.rel);
      if (!was || recordIds.has(was)) continue;
      const bad = r.meta.id !== undefined ? `Its id "${r.meta.id}" is not an id such as ${this.prefix}-007.` : 'It has no id line.';
      unreadable.push({
        rel: r.rel, abs: r.abs, name: r.name, dirRel: r.dirRel, hash: r.hash, id: was, design: false, workItem: null,
        message: `${bad} The tracker knew this file as ${was}; put back the line "id: ${was}" in its frontmatter.`,
      });
      idless.splice(i, 1);
    }
    return { records, designs, idless, skipped, foreign, unreadable };
  }

  /**
   * A file the frontmatter reader could not read, when it looks like a record or
   * a design: { rel, abs, name, dirRel, id, design, workItem, message }, else null.
   * The id comes from the file's own id line, else from the state file's path map.
   */
  _unreadableEntry(loc, pathOwner, peek, message) {
    const isDesign = Boolean(peek.workItem) || (loc.name === DESIGN_FILE && !peek.id);
    const ownId = peek.id && parseId(peek.id).prefix === this.prefix ? peek.id : null;
    const known = pathOwner.get(loc.rel) || null;
    const id = isDesign ? null : ownId || known;
    if (!isDesign && !id && !peek.id && loc.name !== RECORD_FILE) return null;
    return { ...loc, id, design: isDesign, workItem: isDesign ? peek.workItemId : null, message };
  }

  /** Folder owners, parents, groups, archive flags, and children for a list of records. */
  _layout(records, state, unreadable = []) {
    const byDir = new Map();
    const add = (r) => {
      if (!byDir.has(r.dirRel)) byDir.set(r.dirRel, []);
      byDir.get(r.dirRel).push(r);
    };
    for (const r of records) add(r);
    // An unreadable record still owns its folder, so its sub-items keep their parent.
    const recIds = new Set(records.map((r) => r.id));
    for (const u of unreadable) {
      if (u.design || !u.id || recIds.has(u.id)) continue;
      add({ id: u.id, n: parseId(u.id).n, rel: u.rel, dirRel: u.dirRel, name: u.name, broken: true });
    }
    const dirOwner = new Map();
    for (const [dir, recs] of byDir) {
      if (dir === '') continue;
      let owner = null;
      if (recs.length === 1) owner = recs[0];
      else {
        const named = recs.filter((r) => r.name === RECORD_FILE);
        if (named.length === 1) owner = named[0];
        else {
          const prev = recs.filter((r) => {
            const e = state.items[r.id];
            return e && e.owner && parentDir(e.path) === dir;
          });
          owner = prev.length === 1 ? prev[0] : [...recs].sort((a, b) => a.n - b.n)[0];
        }
      }
      dirOwner.set(dir, owner);
    }
    const byId = new Map(records.map((r) => [r.id, r]));
    for (const r of records) {
      const own = dirOwner.get(r.dirRel);
      r.owner = own === r;
      r.parent = 'none';
      const groupSegs = [];
      if (own && own !== r) {
        r.parent = own.id;
      } else {
        for (let d = parentDir(r.dirRel); d !== null && d !== ''; d = parentDir(d)) {
          if (dirOwner.has(d)) {
            r.parent = dirOwner.get(d).id;
            break;
          }
          groupSegs.unshift(baseName(d));
        }
      }
      r.group = groupSegs.join('/');
      r.archived = r.rel === ARCHIVE_DIR || r.rel.startsWith(`${ARCHIVE_DIR}/`);
      r.children = [];
    }
    for (const r of records) {
      if (r.parent !== 'none' && byId.has(r.parent)) byId.get(r.parent).children.push(r.id);
    }
    return { byId, dirOwner };
  }

  _buildView(tree, state) {
    const files = this._readFiles(tree, state);
    const { byId, dirOwner } = this._layout(files.records, state, files.unreadable);
    for (const u of files.unreadable) {
      if (u.design && !u.workItem && dirOwner.has(u.dirRel)) u.workItem = dirOwner.get(u.dirRel).id;
    }
    const brokenIds = new Set(files.unreadable.filter((u) => !u.design && u.id && !byId.has(u.id)).map((u) => u.id));
    const designsFor = (id) => {
      const rec = byId.get(id);
      const list = files.designs.filter((d) => d.workItem === id);
      if (!list.length) return [];
      return list.sort((a, b) => (rec && a.dirRel === rec.dirRel ? -1 : rec && b.dirRel === rec.dirRel ? 1 : a.rel < b.rel ? -1 : 1));
    };
    const brokenDesignFor = (id) => files.unreadable.find((u) => u.design && u.workItem === id) || null;
    return { tree, state, ...files, byId, dirOwner, brokenIds, designsFor, brokenDesignFor };
  }

  /** The design status for the item, 'none' when it has no design, undefined when it cannot be known. */
  _designStatus(view, id) {
    const d = view.designsFor(id)[0];
    if (!d) return view.brokenDesignFor(id) ? undefined : 'none';
    return DESIGN_STATUSES.includes(d.meta.status) ? d.meta.status : undefined;
  }

  /** The problems to report for files that cannot be read. */
  _unreadableProblems(view) {
    return view.unreadable.map((u) => {
      const where = this.location(u.rel);
      const what = u.design ? `the design${u.workItem ? ` of ${u.workItem}` : ''}` : u.id ? `the record of ${u.id}` : 'a work item record';
      const keep = !u.design && u.id && view.brokenIds.has(u.id) ? ` ${u.id} stays a known item; its id is not given to anything else.` : '';
      return {
        severity: 'error',
        code: 'unreadable_record',
        id: u.design ? u.workItem || undefined : u.id || undefined,
        location: where,
        path: u.abs,
        message: `${where} (${what}) cannot be read. ${u.message} The toolkit leaves the file as it is until it is fixed by hand.${keep}`,
        fix: `Fix the frontmatter of ${u.abs} by hand (for example put a value that starts with [ or { in quotes), then run toolkit work sync.`,
      };
    });
  }

  /** The error for an item whose record (or design) cannot be read, or null. */
  _brokenError(view, key, { design = false } = {}) {
    if (!key) return null;
    const u = design ? view.brokenDesignFor(key) : view.unreadable.find((x) => !x.design && x.id === key && !view.byId.has(key));
    if (!u) return null;
    const where = this.location(u.rel);
    return new ToolkitError(EXIT.INVALID, `${design ? `The design of ${key}` : key} cannot be read. ${where}: ${u.message}`, {
      id: key,
      location: where,
      path: u.abs,
      unreadable: true,
      fix: `Fix the frontmatter of ${u.abs} by hand (for example put a value that starts with [ or { in quotes), then run the command again.`,
    });
  }

  /** The record for an id in a view, or an error: unreadable record, or not found. */
  _mustRecord(view, id) {
    const key = canonicalId(id, this.prefix);
    const r = key ? view.byId.get(key) : null;
    if (r) return r;
    throw this._brokenError(view, key) || notFound(id);
  }

  /** Stop before any write when a newer toolkit wrote the state file. */
  _assertWritable() {
    const { state, newer } = readState(this.dir, this.prefix);
    if (newer) throw newerStateError(state.schema);
  }

  /**
   * Give later inner rescans a report to add to: the one the command printed
   * from its first quick sync. A hand change found only once the lock is held
   * is then shown too.
   */
  collectReports(report) {
    this._collect = report && typeof report === 'object' ? report : null;
  }

  _absorb(report) {
    if (!report || !this._collect || report === this._collect) return;
    for (const k of REPORT_LISTS) {
      if (Array.isArray(report[k]) && report[k].length) {
        if (!Array.isArray(this._collect[k])) this._collect[k] = [];
        this._collect[k].push(...report[k]);
      }
    }
    if (report.changed) this._collect.changed = true;
  }

  /** Every file under .work-items/ that looks like a record or design but cannot be read. */
  brokenRecords() {
    const { state } = readState(this.dir, this.prefix);
    const view = this._buildView(scanTree(this.dir), state);
    return this._unreadableProblems(view);
  }

  _nextNumber(view, extraUsed = []) {
    let max = Number.isInteger(view.state.highWater) ? view.state.highWater : 0;
    for (const key of Object.keys(view.state.items)) {
      const p = parseId(key);
      if (p && p.prefix === this.prefix && p.n > max) max = p.n;
    }
    for (const r of view.records) if (r.n > max) max = r.n;
    for (const u of view.unreadable || []) {
      const p = u.id ? parseId(u.id) : null;
      if (p && p.prefix === this.prefix && p.n > max) max = p.n;
    }
    for (const n of extraUsed) if (n > max) max = n;
    return max + 1;
  }

  _item(view, r) {
    const d = view.designsFor(r.id)[0] || null;
    return {
      id: r.id,
      meta: { ...r.meta },
      body: r.body,
      location: this.location(r.rel),
      path: r.abs,
      archived: r.archived,
      parent: r.parent,
      group: r.group,
      children: [...r.children].sort(),
      owner: r.owner,
      design: d ? { status: d.meta.status, location: this.location(d.rel), path: d.abs } : null,
    };
  }

  // ------------------------------------------------------------------ sync

  /**
   * Rescan, adopt, renumber duplicates, derive values, report moves, rebuild the dashboard.
   * @param {{ quick?: boolean, write?: boolean }} [opts] quick: skip everything when checkChanged finds nothing new
   * @returns {Promise<object>} the report: { changed, moves, adopted, renumbered, ownerEdits, questions, derived, missing, problems }
   */
  async sync({ quick = false, write = true } = {}) {
    if (!fs.existsSync(this.dir)) return emptyReport();
    const { state, newer } = readState(this.dir, this.prefix);
    if (quick) {
      const tree = scanTree(this.dir);
      if (state.fingerprint && tree.fingerprint === state.fingerprint) {
        if (write && !newer && !fs.existsSync(path.join(this.dir, DASHBOARD_FILE))) {
          await this.transaction(() => this._writeDashboard(this._buildView(scanTree(this.dir), readState(this.dir, this.prefix).state)));
        }
        return emptyReport();
      }
      if (!state.fingerprint && !tree.files.length) return emptyReport();
    }
    if (!write || newer) return this._syncCore({ write: false }).report;
    return this.transaction(() => this._syncCore({ force: !quick }).report);
  }

  _syncCore({ force = true, write = true, dashboard = true } = {}) {
    const { state, newer } = readState(this.dir, this.prefix);
    const canWrite = write && !newer;
    const report = emptyReport();
    if (newer) {
      report.problems.push({ severity: 'error', message: `The state file was written by a newer toolkit (schema ${state.schema}). Nothing was changed; update the toolkit plugin.` });
    }
    let tree = scanTree(this.dir);
    let view = this._buildView(tree, state);
    if (!tree.exists) {
      view.report = report;
      return view;
    }
    if (!force && state.fingerprint && state.fingerprint === tree.fingerprint) {
      view.report = report;
      return view;
    }
    const today = this.today();

    // Duplicates and records without an id get the next free ids.
    const identity = this._resolveIdentity(view, report, { canWrite, today });
    if (identity.wrote) {
      tree = scanTree(this.dir);
      view = this._buildView(tree, state);
    }
    for (const r of report.renumbered) {
      const rec = view.byId.get(r.to);
      if (rec) r.location = this.location(rec.rel);
    }
    for (const a of report.adopted) {
      const rec = view.byId.get(a.id);
      if (rec) a.location = this.location(rec.rel);
    }

    // Moves, returns, new records, missing records.
    const seen = new Set();
    const movedIds = new Set();
    for (const r of view.records) {
      seen.add(r.id);
      const e = state.items[r.id];
      if (!e) {
        if (!identity.ids.has(r.id)) report.adopted.push({ id: r.id, location: this.location(r.rel), reason: 'A record the toolkit had not seen was found.' });
        continue;
      }
      if (e.missing) {
        movedIds.add(r.id);
        report.moves.push(this._move(r, e, 'returned'));
      } else if (e.path !== r.rel) {
        movedIds.add(r.id);
        const kind = parentDir(e.path) === r.dirRel ? 'file-renamed'
          : parentDir(parentDir(e.path) ?? '') === parentDir(r.dirRel) && baseName(e.path) === r.name && parentDir(e.path) !== r.dirRel ? 'folder-renamed' : 'moved';
        report.moves.push(this._move(r, e, kind));
      }
    }
    for (const m of report.moves) {
      const e = state.items[m.id];
      const r = view.byId.get(m.id);
      if (r && e && e.written && normalizeParent(e.written.parent, this.prefix) === r.parent && r.parent !== 'none' && movedIds.has(r.parent)) m.withParent = r.parent;
    }
    for (const [id, e] of Object.entries(state.items)) {
      if (seen.has(id) || e.missing || view.brokenIds.has(id)) continue;
      report.missing.push({ id, lastLocation: this.location(e.path), title: e.written ? e.written.title : undefined });
      e.missing = true;
      e.missingSince = today;
    }

    // Problems the owner should know about.
    report.problems.push(...this._unreadableProblems(view));
    for (const s of view.skipped) {
      report.problems.push({ severity: 'warning', location: this.location(s.rel), message: `${this.location(s.rel)} is a copy of the work item template with no title yet; it is not tracked until it has a title.` });
    }
    for (const f of view.foreign) {
      report.problems.push({ severity: 'warning', location: this.location(f.rel), message: `${this.location(f.rel)} has id ${f.meta.id}, which does not use this project's prefix ${this.prefix}; it is not tracked.` });
    }
    for (const d of view.designs) {
      if (!d.workItem || !view.byId.has(d.workItem)) {
        report.problems.push({ severity: 'warning', location: this.location(d.rel), message: `${this.location(d.rel)} is a design for ${d.meta.work_item || 'no item'}, which is not a tracked item.` });
      }
    }
    for (const r of view.records) {
      const list = view.designsFor(r.id);
      if (list.length > 1) report.problems.push({ severity: 'warning', id: r.id, message: `${r.id} has ${list.length} design files: ${list.map((d) => this.location(d.rel)).join(', ')}. The one beside the record is used.` });
    }

    // Derived values and owner edits.
    for (const r of view.records) {
      const e = state.items[r.id];
      const isNew = !e;
      let data = r.doc.data;
      let meta = { ...r.meta };
      let body = r.body;
      let changedHere = false;
      if (isNew && isFreeForm(body)) {
        // A record written by hand without the template sections gets them; its text goes under Starting request.
        const title = !isPlaceholder(meta.title) ? meta.title : (getH1(body) || {}).title;
        const doc = parseDoc(this._adoptedText({ meta, data, body, rel: r.rel }, r.id, today, { title, why: 'without the template sections' }));
        data = doc.data;
        meta = { ...doc.meta };
        body = doc.body;
        changedHere = true;
        const a = report.adopted.find((x) => x.id === r.id);
        if (a) a.reason = `${a.reason} It had no template sections: they were added, and its text is under Starting request.`;
      } else if (isNew) {
        const filled = this._fillDefaults(meta, today);
        if (Object.keys(filled).length) {
          applyMetaPatch(data, filled);
          meta = { ...meta, ...filled };
          changedHere = true;
          try {
            body = appendHistory(body, { date: today, change: `Adopted by the toolkit: found at ${this.location(r.rel)}.`, effect: `Filled in ${Object.keys(filled).join(', ')}.` });
          } catch {
            // No Recent History table.
          }
        }
      }
      const firstDesign = view.designsFor(r.id)[0];
      const sources = { parent: r.parent, design: this._designStatus(view, r.id) };
      if (firstDesign) sources.designApproval = firstDesign.meta.approved === undefined ? '' : String(firstDesign.meta.approved);
      const res = reconcileRecord({ meta, body, sources, written: e ? e.written || null : null, today, prefix: this.prefix });
      if (res.changed) {
        applyMetaPatch(data, res.patch);
        body = res.body;
        changedHere = true;
      }
      report.derived.push(...res.derived);
      report.ownerEdits.push(...res.ownerEdits);
      report.questions.push(...res.questions);
      if (changedHere && canWrite) {
        const text = serializeDoc(data, body);
        if (text !== r.text) atomicWrite(r.abs, text);
      }
    }

    report.changed = Boolean(report.moves.length || report.adopted.length || report.renumbered.length || report.ownerEdits.length || report.derived.length || report.missing.length);
    if (!canWrite) {
      view.report = report;
      return view;
    }
    const fresh = this._finalize(state, { all: true, dashboard });
    fresh.report = report;
    return fresh;
  }

  _move(r, e, kind) {
    const before = e.written || {};
    return {
      id: r.id,
      kind,
      from: this.location(e.path),
      to: this.location(r.rel),
      parentBefore: before.parent !== undefined ? normalizeParent(before.parent, this.prefix) : undefined,
      parentAfter: r.parent,
      archivedBefore: e.path === ARCHIVE_DIR || String(e.path).startsWith(`${ARCHIVE_DIR}/`),
      archivedAfter: r.archived,
      group: r.group,
    };
  }

  _fillDefaults(meta, today) {
    const filled = {};
    const want = {
      type: 'task',
      stage: '01-discovery',
      waiting_on: 'none',
      priority: 'medium',
      delivery: 'not-offered',
      requirements_approved: 'no',
      result_approved: 'no',
    };
    for (const [k, v] of Object.entries(want)) if (meta[k] === undefined || isPlaceholder(meta[k])) filled[k] = v;
    if (meta.updated === undefined || isPlaceholder(meta.updated)) filled.updated = today;
    return filled;
  }

  /**
   * The text for a record written by hand without the template sections: the
   * project's template body, the owner's text under "### Starting request",
   * the owner's frontmatter values kept (defaults for the rest), and an
   * "Adopted" Recent History row.
   * @param {{ meta: object, data: object, body: string, rel: string }} r
   */
  _adoptedText(r, id, today, { title, why }) {
    const m = r.meta || {};
    const val = (k, def) => (m[k] !== undefined && m[k] !== null && !isPlaceholder(m[k]) ? String(m[k]) : def);
    const stage = val('stage', '01-discovery');
    const known = findStage(stage);
    const fields = {
      id,
      title,
      type: val('type', 'task'),
      stage,
      status: val('status', statusForStage(known ? known.id : '01-discovery')),
      parent: val('parent', 'none'),
      waiting_on: val('waiting_on', 'none'),
      priority: val('priority', 'medium'),
      delivery: val('delivery', 'not-offered'),
      requirements_approved: val('requirements_approved', 'no'),
      design: val('design', 'none'),
      result_approved: val('result_approved', 'no'),
      updated: today,
      request: freeTextForRequest(r.body) || title,
      historyChange: `Adopted by the toolkit: found at ${this.location(r.rel)} ${why}.`,
      historyEffect: `Its id is ${id}. The template sections were added; the text that was in the file is under Starting request.`,
    };
    const doc = parseDoc(newRecordText(this.template(RECORD_FILE).text, fields));
    const meta = { ...doc.meta };
    for (const [k, v] of Object.entries(r.data || {})) {
      if (!Object.prototype.hasOwnProperty.call(meta, k) && k !== 'work_item' && v !== null && v !== undefined) meta[k] = v;
    }
    return composeDoc(meta, doc.body);
  }

  _resolveIdentity(view, report, { canWrite, today }) {
    const ids = new Set();
    let wrote = false;
    const used = [];
    const groups = new Map();
    for (const r of view.records) {
      if (!groups.has(r.id)) groups.set(r.id, []);
      groups.get(r.id).push(r);
    }
    const renames = [];
    const nextId = () => {
      const n = this._nextNumber(view, used);
      used.push(n);
      return formatId(this.prefix, n);
    };
    for (const [id, recs] of groups) {
      if (recs.length < 2) continue;
      const known = view.state.items[id];
      let keeper = known && !known.missing ? recs.find((r) => r.rel === known.path) : null;
      if (!keeper && known && known.hash) keeper = recs.find((r) => r.hash === known.hash) || null;
      if (!keeper) keeper = [...recs].sort((a, b) => (a.birthtimeMs - b.birthtimeMs) || (a.rel < b.rel ? -1 : 1))[0];
      for (const r of recs) {
        if (r === keeper) continue;
        const newId = nextId();
        ids.add(newId);
        report.renumbered.push({ from: r.rawId, to: newId, location: this.location(r.rel), original: this.location(keeper.rel), originalId: id });
        if (!canWrite) continue;
        const title = !isPlaceholder(r.meta.title) ? r.meta.title : (getH1(r.body) || {}).title || r.meta.title;
        applyMetaPatch(r.doc.data, { id: newId, updated: today });
        let body = setH1(r.body, newId, title);
        try {
          body = appendHistory(body, { date: today, change: `Renumbered: this record had id ${r.rawId}, which ${id} at ${this.location(keeper.rel)} already uses.`, effect: `Its id is now ${newId}.` });
        } catch {
          // No Recent History table.
        }
        atomicWrite(r.abs, serializeDoc(r.doc.data, body));
        wrote = true;
        for (const d of view.designs) {
          if (d.dirRel === r.dirRel && d.workItem === id) {
            applyMetaPatch(d.doc.data, { work_item: newId }, DESIGN_FIELD_ORDER);
            const h1 = getH1(d.body);
            const dbody = h1 ? setH1(d.body, newId, h1.title, { suffix: DESIGN_SUFFIX }) : d.body;
            atomicWrite(d.abs, serializeDoc(d.doc.data, dbody));
          }
        }
        const alone = view.records.filter((x) => x.dirRel === r.dirRel).length === 1 || r.name === RECORD_FILE;
        const m = FOLDER_ID_RE.exec(baseName(r.dirRel));
        if (r.dirRel && alone && m && sameId(m[1], r.rawId)) {
          renames.push({ from: r.dirRel, to: joinRel(parentDir(r.dirRel), `${newId}${m[2]}`) });
        }
      }
    }
    for (const r of view.idless) {
      const newId = nextId();
      ids.add(newId);
      const free = isFreeForm(r.body);
      report.adopted.push({
        id: newId,
        location: this.location(r.rel),
        reason: free
          ? 'A WORK-ITEM.md with no id was found; it was given the next id and the template sections, and its text is under Starting request.'
          : 'A WORK-ITEM.md with no id was found; it was given the next id.',
      });
      if (!canWrite) continue;
      if (free) {
        atomicWrite(r.abs, this._adoptedText({ meta: r.meta, data: r.doc.data, body: r.body, rel: r.rel }, newId, today, { title: r.title, why: 'with no id' }));
        wrote = true;
        continue;
      }
      const patch = { id: newId, title: r.title, ...this._fillDefaults(r.meta, today) };
      applyMetaPatch(r.doc.data, patch);
      let body = setH1(r.body, newId, r.title);
      try {
        body = appendHistory(body, { date: today, change: `Adopted by the toolkit: this record had no id.`, effect: `Its id is now ${newId}.` });
      } catch {
        // No Recent History table.
      }
      atomicWrite(r.abs, serializeDoc(r.doc.data, body));
      wrote = true;
    }
    // Rename copied folders deepest first, so a parent rename does not move a child away first.
    renames.sort((a, b) => b.from.split('/').length - a.from.split('/').length);
    for (const rn of renames) {
      const src = path.join(this.dir, rn.from);
      const dst = path.join(this.dir, rn.to);
      if (fs.existsSync(dst)) continue;
      try {
        fs.renameSync(src, dst);
      } catch {
        // Keep the old folder name; the id inside the record is what counts.
      }
    }
    return { wrote, ids };
  }

  /**
   * After writing: rescan, update the state file (paths, hashes, written values,
   * high-water id, fingerprint), and rebuild the dashboard.
   * @returns the fresh view
   */
  _finalize(state, { all = false, ids = [], dashboard = true } = {}) {
    const tree = scanTree(this.dir);
    const view = this._buildView(tree, state);
    const idSet = new Set(ids);
    let max = Number.isInteger(state.highWater) ? state.highWater : 0;
    for (const r of view.records) {
      const e = state.items[r.id] || {};
      e.path = r.rel;
      e.missing = false;
      delete e.missingSince;
      e.owner = r.owner;
      e.hash = r.hash;
      if (all || idSet.has(r.id) || !e.written) {
        e.written = snapshotWritten(r.meta, r.body, { parent: r.parent, design: this._designStatus(view, r.id) }, this.prefix);
      }
      state.items[r.id] = e;
      if (r.n > max) max = r.n;
    }
    for (const key of [...Object.keys(state.items), ...view.brokenIds]) {
      const p = parseId(key);
      if (p && p.prefix === this.prefix && p.n > max) max = p.n;
    }
    state.highWater = max;
    state.prefix = this.prefix;
    state.fingerprint = tree.fingerprint;
    writeState(this.dir, state);
    if (dashboard) this._writeDashboard(view);
    return view;
  }

  _writeDashboard(view) {
    const items = view.records.map((r) => this._item(view, r));
    const unreadable = this._unreadableProblems(view).map((p) => ({ id: p.id, location: p.location, message: p.message }));
    const text = renderDashboard(items, { ownerName: this.ownerName, unreadable });
    const file = path.join(this.dir, DASHBOARD_FILE);
    if (readText(file) !== text) atomicWrite(file, text);
  }

  // ------------------------------------------------------------------ driver interface

  /** Every tracked item. Reads only; call sync() first to pick up hand changes. */
  async list({ includeArchived = true } = {}) {
    const { state } = readState(this.dir, this.prefix);
    const view = this._buildView(scanTree(this.dir), state);
    return view.records
      .filter((r) => includeArchived || !r.archived)
      .sort((a, b) => a.n - b.n)
      .map((r) => this._item(view, r));
  }

  /**
   * One item, or null when there is no such item.
   * @throws ToolkitError INVALID (exit 2) when the item's record exists but cannot be read
   */
  async get(id) {
    const key = canonicalId(id, this.prefix);
    if (!key) return null;
    const { state } = readState(this.dir, this.prefix);
    const view = this._buildView(scanTree(this.dir), state);
    const r = view.byId.get(key);
    if (r) return this._item(view, r);
    const broken = this._brokenError(view, key);
    if (broken) throw broken;
    return null;
  }

  /** The item ids with the state file's last known location, including missing ones. */
  knownIds() {
    const { state } = readState(this.dir, this.prefix);
    return Object.keys(state.items);
  }

  /**
   * Create an item. The id is assigned here under the lock.
   * @param {{ meta: object, body: string }} record meta.parent places it inside that item's folder
   * @param {{ group?: string }} [opts] a group folder for a top-level item
   * @returns {Promise<string>} the new id
   */
  async create({ meta, body }, { group } = {}) {
    if (!meta || isPlaceholder(meta.title)) throw new ToolkitError(EXIT.INVALID, 'A new item needs a title.');
    ensureDir(this.dir);
    return this.transaction(() => {
      this._assertWritable();
      const view = this._syncCore({ force: false, dashboard: false });
      this._absorb(view.report);
      const n = this._nextNumber(view);
      const id = formatId(this.prefix, n);
      let baseDir = '';
      let parent = 'none';
      const parentKey = normalizeParent(meta.parent, this.prefix);
      if (parentKey !== 'none') {
        const p = this._mustRecord(view, parentKey);
        if (!p.owner) throw new ToolkitError(EXIT.ERROR, `${p.id} shares a folder with ${view.dirOwner.get(p.dirRel).id} and has no folder of its own, so it cannot hold a sub-item.`, { fix: `Move it into its own folder first: toolkit work move ${p.id} --under root.` });
        baseDir = p.dirRel;
        parent = p.id;
      } else if (group) {
        baseDir = this._checkGroup(view, group);
      }
      const slug = slugify(meta.title) || 'item';
      let folder = joinRel(baseDir, `${id}-${slug}`);
      for (let k = 2; fs.existsSync(path.join(this.dir, folder)); k++) folder = joinRel(baseDir, `${id}-${slug}-${k}`);
      const fullMeta = { ...meta, id, parent };
      const text = composeDoc(fullMeta, setH1(body, id, meta.title));
      const file = path.join(this.dir, folder, RECORD_FILE);
      ensureDir(path.dirname(file));
      atomicWrite(file, text);
      view.state.highWater = Math.max(view.state.highWater || 0, n);
      this._finalize(view.state, { ids: [id] });
      return id;
    });
  }

  /**
   * Change an item's frontmatter and/or body.
   * @param {string} id
   * @param {{ meta?: object, body?: string, expectBody?: string, expectMeta?: object }} change
   *   meta: keys to set (others keep their values); body: the whole new body.
   *   expectBody / expectMeta: what the caller read; a difference means someone else changed it (conflict error).
   * @returns {Promise<{ id, meta, body, location, path }>} the record as read back
   */
  async update(id, { meta = {}, body, expectBody, expectMeta } = {}) {
    return this.transaction(() => {
      this._assertWritable();
      const view = this._syncCore({ force: false, dashboard: false });
      this._absorb(view.report);
      const r = this._mustRecord(view, id);
      if (expectBody !== undefined && expectBody !== null && r.body !== expectBody) throw conflict(r.id, 'its text changed');
      if (expectMeta) {
        for (const [k, v] of Object.entries(expectMeta)) {
          if ((r.meta[k] ?? undefined) !== (v ?? undefined)) throw conflict(r.id, `${k} changed`);
        }
      }
      if (meta.id !== undefined && !sameId(meta.id, r.id)) throw new ToolkitError(EXIT.INVALID, 'The id of an item cannot be changed.');
      const patch = { ...meta };
      delete patch.id;
      applyMetaPatch(r.doc.data, patch);
      const newBody = body === undefined || body === null ? r.body : body;
      const text = serializeDoc(r.doc.data, newBody);
      if (text !== r.text) atomicWrite(r.abs, text);
      const fresh = this._finalize(view.state, { ids: [r.id] });
      const back = fresh.byId.get(r.id);
      if (!back) throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${r.id} was not found after writing.`, { id: r.id });
      return this._item(fresh, back);
    });
  }

  /**
   * The item's design: { meta, body, location, path } or null.
   * @throws ToolkitError INVALID (exit 2) when its design file exists but cannot be read
   */
  async getDesign(id) {
    const key = canonicalId(id, this.prefix);
    const { state } = readState(this.dir, this.prefix);
    const view = this._buildView(scanTree(this.dir), state);
    const d = key ? view.designsFor(key)[0] : null;
    if (!d) {
      const broken = this._brokenError(view, key, { design: true });
      if (broken) throw broken;
      return null;
    }
    return { id: key, meta: { ...d.meta }, body: d.body, location: this.location(d.rel), path: d.abs, text: d.text };
  }

  /**
   * Write the item's design. `markdown` is the whole DESIGN.md text (frontmatter
   * and body). work_item is always set to this item.
   * @param {{ create?: boolean }} [opts] create: allow making DESIGN.md when there is none
   * @returns {Promise<{ meta, body, location, path }>} the design as read back
   */
  async setDesign(id, markdown, { create = false } = {}) {
    return this.transaction(() => {
      this._assertWritable();
      const view = this._syncCore({ force: false, dashboard: false });
      this._absorb(view.report);
      const r = this._mustRecord(view, id);
      const existing = view.designsFor(r.id)[0] || null;
      if (!existing) {
        const broken = this._brokenError(view, r.id, { design: true });
        if (broken) throw broken;
      }
      if (!existing && !create) {
        throw new ToolkitError(EXIT.ERROR, `${r.id} has no design yet.`, { fix: `Create one with: toolkit work design ${r.id} --create` });
      }
      let file = existing ? existing.abs : path.join(path.dirname(r.abs), DESIGN_FILE);
      if (!existing && fs.existsSync(file)) file = path.join(path.dirname(r.abs), `DESIGN-${r.id}.md`);
      const doc = parseDoc(markdown);
      const data = doc.hasFrontmatter ? doc.data : {};
      const status = DESIGN_STATUSES.includes(doc.meta.status) ? doc.meta.status : 'proposed';
      applyMetaPatch(data, { work_item: r.id, status, approved: doc.meta.approved !== undefined ? doc.meta.approved : 'no' }, DESIGN_FIELD_ORDER);
      const body = setDesignStatusLine(doc.body, status);
      const text = doc.hasFrontmatter ? serializeDoc(data, body) : composeDoc(data, body, DESIGN_FIELD_ORDER);
      atomicWrite(file, text);
      const fresh = this._finalize(view.state, { ids: [r.id] });
      const d = fresh.designsFor(r.id)[0];
      if (!d) throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the design for ${r.id} was not found after writing.`, { id: r.id });
      return { id: r.id, meta: { ...d.meta }, body: d.body, location: this.location(d.rel), path: d.abs };
    });
  }

  _checkGroup(view, group) {
    const g = String(group).trim().replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    const parts = g.split('/');
    if (!g || parts.some((p) => !p || p === '.' || p === '..' || isSkippedDir(p) || !/^[A-Za-z0-9][A-Za-z0-9 ._-]*$/.test(p))) {
      throw new ToolkitError(EXIT.INVALID, `"${group}" is not a usable group folder name. Use letters, digits, spaces, dots, dashes, and underscores; no part may start with "." or "_", and work-item-template is reserved.`);
    }
    if (view.dirOwner.has(g)) {
      throw new ToolkitError(EXIT.INVALID, `${g} is the folder of ${view.dirOwner.get(g).id}. Use the id to put an item under it: --under ${view.dirOwner.get(g).id}.`);
    }
    // A group cannot sit inside an item's folder: a record there is that item's
    // sub-item (a sub-item cannot also sit in a group).
    for (let d = parentDir(g); d !== null && d !== ''; d = parentDir(d)) {
      if (view.dirOwner.has(d)) {
        const owner = view.dirOwner.get(d).id;
        throw new ToolkitError(EXIT.INVALID, `${g} is inside ${d}, the folder of ${owner}. A group must be outside every item folder; to make it a sub-item of ${owner}, use --under ${owner}.`);
      }
    }
    return g;
  }

  /**
   * Move an item (with its sub-items) under another item, into a group folder,
   * into archive/, or back to the top level.
   * @param {string} id
   * @param {string} target an item id, "root", "archive", or a group path such as "billing"
   * @returns {Promise<{ id, from, to, parentBefore, parentAfter, archived, nested, unchanged }>}
   */
  async move(id, target) {
    return this.transaction(() => {
      this._assertWritable();
      const view = this._syncCore({ force: false, dashboard: false });
      this._absorb(view.report);
      const r = this._mustRecord(view, id);
      const t = String(target ?? '').trim();
      if (!t) throw new ToolkitError(EXIT.INVALID, '--under needs an item id, a group name, archive, or root.');
      let destBase;
      let targetItem = null;
      const tKey = canonicalId(t, this.prefix);
      if (tKey && parseId(t) && view.byId.has(tKey)) {
        targetItem = view.byId.get(tKey);
        if (targetItem.id === r.id) throw new ToolkitError(EXIT.INVALID, `${r.id} cannot be moved under itself.`);
        if (r.owner && (targetItem.dirRel === r.dirRel || targetItem.dirRel.startsWith(`${r.dirRel}/`))) {
          throw new ToolkitError(EXIT.INVALID, `${targetItem.id} is inside ${r.id}, so ${r.id} cannot be moved under it.`);
        }
        if (!targetItem.owner) throw new ToolkitError(EXIT.ERROR, `${targetItem.id} has no folder of its own, so it cannot hold a sub-item.`, { fix: `Move it into its own folder first: toolkit work move ${targetItem.id} --under root.` });
        destBase = targetItem.dirRel;
      } else if (tKey && parseId(t)) {
        throw this._brokenError(view, tKey) || notFound(t);
      } else if (t.toLowerCase() === 'root') {
        destBase = '';
      } else if (t.toLowerCase() === 'archive') {
        if (r.archived) throw new ToolkitError(EXIT.INVALID, `${r.id} is already in ${ARCHIVE_DIR}/.`);
        destBase = r.parent === 'none' && r.group ? `${ARCHIVE_DIR}/${r.group}` : ARCHIVE_DIR;
      } else {
        destBase = this._checkGroup(view, t);
      }
      const nested = r.owner ? view.records.filter((x) => x !== r && x.rel.startsWith(`${r.dirRel}/`)).length : 0;
      const fromRel = r.rel;
      let moveFrom;
      let moveTo;
      if (r.owner) {
        moveFrom = r.dirRel;
        moveTo = joinRel(destBase, baseName(r.dirRel));
      } else {
        moveFrom = null;
        moveTo = joinRel(destBase, `${r.id}-${slugify(r.meta.title) || 'item'}`);
      }
      if (moveFrom === moveTo) {
        return { id: r.id, from: this.location(fromRel), to: this.location(fromRel), parentBefore: r.parent, parentAfter: r.parent, archived: r.archived, nested, unchanged: true };
      }
      const dstAbs = path.join(this.dir, moveTo);
      if (fs.existsSync(dstAbs)) throw new ToolkitError(EXIT.ERROR, `${this.location(moveTo)} already exists; nothing was moved.`);
      ensureDir(path.dirname(dstAbs));
      if (moveFrom !== null) {
        fs.renameSync(path.join(this.dir, moveFrom), dstAbs);
      } else {
        ensureDir(dstAbs);
        fs.renameSync(r.abs, path.join(dstAbs, r.name));
        for (const d of view.designsFor(r.id)) {
          if (d.dirRel === r.dirRel) fs.renameSync(d.abs, path.join(dstAbs, d.name));
        }
      }
      // Write the new parent and a history row on the moved record.
      const newParent = targetItem ? targetItem.id : 'none';
      const newRecordAbs = path.join(dstAbs, r.name);
      const doc = parseDoc(fs.readFileSync(newRecordAbs, 'utf8'));
      const today = this.today();
      const where = targetItem ? `under ${targetItem.id}` : t.toLowerCase() === 'root' ? 'to the top level' : t.toLowerCase() === 'archive' ? `to ${ARCHIVE_DIR}/` : `into the group ${destBase}`;
      applyMetaPatch(doc.data, { parent: newParent, updated: today });
      let body = doc.body;
      try {
        body = appendHistory(body, {
          date: today,
          change: `Moved ${where} with toolkit work move${nested ? ` (with ${nested} nested item${nested === 1 ? '' : 's'})` : ''}.`,
          effect: newParent !== r.parent ? `Parent is now ${newParent}.` : `Parent stays ${newParent}.`,
        });
      } catch {
        // No Recent History table.
      }
      atomicWrite(newRecordAbs, serializeDoc(doc.data, body));
      const fresh = this._finalize(view.state, { ids: [r.id] });
      const back = fresh.byId.get(r.id);
      return {
        id: r.id,
        from: this.location(fromRel),
        to: back ? this.location(back.rel) : this.location(joinRel(moveTo, r.name)),
        parentBefore: r.parent,
        parentAfter: back ? back.parent : newParent,
        archived: back ? back.archived : false,
        nested,
        unchanged: false,
      };
    });
  }
}

export { FIELD_ORDER };

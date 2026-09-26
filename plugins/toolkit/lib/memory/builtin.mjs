// Built-in memory: Markdown files in .memory/ in the main checkout.
//
// Layout (all Git-ignored):
//   .memory/<type>_<slug>.md        one record per file (status current or needs-review)
//   .memory/archive/<key>.md        retired records
//   .memory/MEMORY.md               generated index; never edit it by hand
//   .memory/CURRENT_FOCUS.md        the current focus (four sections, at most 50 lines)
//   .memory/terminology-glossary.md project terms
//   .memory/.toolkit-meta.json      last save time, last action, last export time
//   .memory/.lock                   held while a toolkit command writes
//
// The folder is found from the main checkout, so every Git worktree of the
// project reads and writes the same memory. Every write happens under the
// lock, through a temp file and a rename, and is read back. Every file the
// toolkit writes here is set to mode 0644 (readable by everyone), even when an
// older copy was owner-only (0600, as the model project left them); reindex
// fixes the mode of files it did not write. A record file that breaks a rule
// is reported by `toolkit memory status`; it never stops other records from
// being saved.
//
// Implements MemoryDriver from contract.mjs.

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { atomicWrite, ensureDir, readText } from '../core/fsx.mjs';
import { withLock } from '../core/lock.mjs';
import { today as localToday } from '../core/util.mjs';
import {
  RECORD_TYPES, RECORD_STATUSES, FOCUS_MAX_LINES, assertKey, assertValidRecord, assertValidFocus, assertValidGlossary,
  assertFilter, changeRecordStatus, checkExpect, countRecords, keywordScore, matchesFilter, normalizeDocument,
  normalizeRecord, notFound, parseRecord, recordSummary, restoreNote, retireNote, searchTerms, serializeRecord,
  sortRecords, versionOf, focusLineCount,
} from './contract.mjs';

export const backend = 'builtin';
export const VAULT_DIR = '.memory';
export const ARCHIVE_DIR = 'archive';
export const INDEX_FILE = 'MEMORY.md';
export const FOCUS_FILE = 'CURRENT_FOCUS.md';
export const GLOSSARY_FILE = 'terminology-glossary.md';
export const META_FILE = '.toolkit-meta.json';
export const LOCK_NAME = '.lock';
/** At most this many records are listed in MEMORY.md; the rest are counted. */
export const INDEX_MAX_ENTRIES = 150;
/** The mode of every file in .memory/: owner can write, everyone can read. */
export const FILE_MODE = 0o644;

const RECORD_FILE_RE = /^((?:user|feedback|project|reference|event)_[a-z0-9]+(?:_[a-z0-9]+)*)\.md$/;
const TYPE_TITLES = { user: 'User', feedback: 'Feedback', project: 'Project', reference: 'Reference', event: 'Event' };

/** The .memory folder for a main checkout. */
export function vaultPath(mainRoot) {
  return path.join(mainRoot, VAULT_DIR);
}

export async function createDriver({ root, mainRoot, now } = {}) {
  const base = mainRoot || root;
  if (!base) throw new ToolkitError(EXIT.ERROR, 'The built-in memory driver needs the project folder.');
  return new BuiltinDriver({ vault: vaultPath(base), now });
}

/** Rebuild .memory/MEMORY.md under the lock. For hooks that see a record file change. */
export async function reindexVault(mainRoot) {
  const driver = new BuiltinDriver({ vault: vaultPath(mainRoot) });
  return driver.reindex();
}

function rel(vault, file) {
  return path.relative(path.dirname(vault), file);
}

/** Write a file in the vault atomically and make it readable by everyone. */
function writeFile(target, text) {
  atomicWrite(target, text);
  setMode(target);
}

/** Set FILE_MODE. Returns true when the mode changed. Never throws. */
function setMode(file) {
  try {
    if ((fs.statSync(file).mode & 0o777) === FILE_MODE) return false;
    fs.chmodSync(file, FILE_MODE);
    return true;
  } catch {
    return false;
  }
}

/** True when the file exists and its mode is not FILE_MODE. */
function wrongMode(file) {
  try {
    return (fs.statSync(file).mode & 0o777) !== FILE_MODE;
  } catch {
    return false;
  }
}

export class BuiltinDriver {
  constructor({ vault, now } = {}) {
    this.backend = backend;
    this.vault = vault;
    this.location = vault;
    this.now = typeof now === 'function' ? now : () => new Date();
  }

  today() {
    return localToday(this.now());
  }

  activePath(key) {
    return path.join(this.vault, `${key}.md`);
  }

  archivePath(key) {
    return path.join(this.vault, ARCHIVE_DIR, `${key}.md`);
  }

  async locked(fn) {
    ensureDir(this.vault);
    return withLock(this.vault, fn, { name: LOCK_NAME });
  }

  /** The stored file for a key: { path, text, where } or null. The active copy wins. */
  readStored(key) {
    const active = this.activePath(key);
    const text = readText(active);
    if (text !== null) return { path: active, text, where: 'active' };
    const archived = this.archivePath(key);
    const old = readText(archived);
    if (old !== null) return { path: archived, text: old, where: 'archive' };
    return null;
  }

  /**
   * Read every record file. Returns { entries, problems }.
   * entries: { key, path, where, text, record, problems } for each readable record.
   * problems: { where, problem } for files that cannot be used, duplicates,
   * and records in the wrong folder.
   */
  scan() {
    const entries = [];
    const problems = [];
    const seen = new Map();
    const readDir = (dir, where) => {
      let names;
      try {
        names = fs.readdirSync(dir);
      } catch (err) {
        if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) return;
        throw err;
      }
      names.sort();
      for (const name of names) {
        const m = RECORD_FILE_RE.exec(name);
        if (!m) continue;
        const file = path.join(dir, name);
        let stat;
        try {
          stat = fs.statSync(file);
        } catch {
          continue;
        }
        if (!stat.isFile()) continue;
        const key = m[1];
        let text;
        try {
          text = fs.readFileSync(file, 'utf8');
        } catch (err) {
          problems.push({ where: rel(this.vault, file), problem: `cannot be read: ${err.message}` });
          continue;
        }
        const { record, problems: recordProblems } = parseRecord(text, key);
        if (record.status === 'template') continue; // a seed template, not a record
        const fatal = recordProblems.find((p) => p.startsWith('it has no frontmatter') || p.startsWith('its frontmatter cannot be read'));
        if (fatal || !RECORD_STATUSES.includes(record.status) || !RECORD_TYPES.includes(record.type)) {
          problems.push({ where: rel(this.vault, file), problem: `is skipped: ${recordProblems.join(' ') || 'its status or type is not valid.'}` });
          continue;
        }
        if (seen.has(key)) {
          problems.push({ where: rel(this.vault, file), problem: `is a second copy of ${key}; the copy in ${seen.get(key)} is used.` });
          continue;
        }
        seen.set(key, rel(this.vault, file));
        for (const p of recordProblems) problems.push({ where: rel(this.vault, file), problem: p });
        if (where === 'archive' && record.status !== 'retired') {
          problems.push({ where: rel(this.vault, file), problem: `is in archive/ but its status is ${record.status}. Run toolkit memory reindex to move it.` });
        }
        if (where === 'active' && record.status === 'retired') {
          problems.push({ where: rel(this.vault, file), problem: 'is retired but not in archive/. Run toolkit memory reindex to move it.' });
        }
        entries.push({ key, path: file, where, text, record, problems: recordProblems });
      }
    };
    readDir(this.vault, 'active');
    readDir(path.join(this.vault, ARCHIVE_DIR), 'archive');
    return { entries, problems };
  }

  stored(entryOrStored, key) {
    const { record, problems } = parseRecord(entryOrStored.text, key);
    return {
      ...record,
      version: versionOf(entryOrStored.text),
      text: entryOrStored.text,
      path: entryOrStored.path,
      valid: problems.length === 0,
      problems,
    };
  }

  // ------------------------------------------------------------ records

  async save(input, { expect } = {}) {
    const record = assertValidRecord(normalizeRecord(input, { today: this.today() }));
    const text = serializeRecord(record);
    return this.locked(() => {
      const current = this.readStored(record.key);
      checkExpect(current ? versionOf(current.text) : null, expect, `The memory record ${record.key}`);
      const target = record.status === 'retired' ? this.archivePath(record.key) : this.activePath(record.key);
      writeFile(target, text);
      this.removeOtherCopy(record.key, target);
      this.writeIndex();
      this.touchMeta(current ? 'update' : 'create', record.key);
      const back = readText(target);
      if (back !== text) {
        throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${target} does not hold what was written.`, { key: record.key, path: target });
      }
      return {
        key: record.key,
        version: versionOf(text),
        created: !current,
        record: this.stored({ text, path: target }, record.key),
      };
    });
  }

  removeOtherCopy(key, keep) {
    for (const p of [this.activePath(key), this.archivePath(key)]) {
      if (p !== keep) fs.rmSync(p, { force: true });
    }
  }

  async get(key) {
    const k = assertKey(key);
    const found = this.readStored(k);
    return found ? this.stored(found, k) : null;
  }

  async list(filter = {}) {
    assertFilter(filter);
    const { entries } = this.scan();
    return sortRecords(entries.map((e) => recordSummary(e.record)).filter((s) => matchesFilter(s, filter)));
  }

  async find(query, { reflect = false, limit = 10, type, all = false } = {}) {
    if (reflect) {
      throw new ToolkitError(EXIT.UNSUPPORTED, 'find --reflect needs the Hindsight memory backend. The built-in memory searches by keywords only.', {
        backend,
        fix: 'Run the search again without --reflect.',
      });
    }
    const terms = searchTerms(query);
    if (!terms.length) {
      throw new ToolkitError(EXIT.INVALID, 'Give one or more words to search for.');
    }
    assertFilter({ type });
    const { entries } = this.scan();
    const hits = [];
    for (const e of entries) {
      const r = e.record;
      if (!all && r.status === 'retired') continue;
      if (type && r.type !== type) continue;
      const { score, snippet } = keywordScore(r, terms);
      if (score <= 0) continue;
      hits.push({ key: r.key, name: r.name, type: r.type, description: r.description, status: r.status, score, snippet });
    }
    hits.sort((a, b) => b.score - a.score || (a.key < b.key ? -1 : 1));
    const max = Number.isInteger(limit) && limit > 0 ? limit : 10;
    return { query: String(query), mode: 'keyword', results: hits.slice(0, max) };
  }

  /** Change status (and superseded_by) of a stored record, keeping its other text. */
  changeStatus(key, { status, supersededBy = null, note = '' }) {
    const k = assertKey(key);
    return this.locked(() => {
      const current = this.readStored(k);
      if (!current) throw notFound(k, this.vault);
      const text = changeRecordStatus(current.text, { status, supersededBy, note }, k);
      const target = status === 'retired' ? this.archivePath(k) : this.activePath(k);
      writeFile(target, text);
      this.removeOtherCopy(k, target);
      this.writeIndex();
      this.touchMeta(status === 'retired' ? 'retire' : 'restore', k);
      return { key: k, version: versionOf(text), record: this.stored({ text, path: target }, k) };
    });
  }

  async retire(key, { supersededBy, reason } = {}) {
    const k = assertKey(key);
    const by = supersededBy ? assertKey(supersededBy) : null;
    if (by && by === k) throw new ToolkitError(EXIT.INVALID, 'A record cannot be superseded by itself.');
    if (by && !this.readStored(by)) {
      throw new ToolkitError(EXIT.INVALID, `${k} was not retired: the replacement ${by} does not exist in ${this.vault}.`, {
        key: k,
        supersededBy: by,
        fix: 'Save the new record first, or check the key with toolkit memory list.',
      });
    }
    const note = retireNote(this.today(), { reason, supersededBy: by });
    return this.changeStatus(k, { status: 'retired', supersededBy: by, note });
  }

  async restore(key) {
    return this.changeStatus(key, { status: 'needs-review', supersededBy: null, note: restoreNote(this.today()) });
  }

  async delete(key) {
    const k = assertKey(key);
    return this.locked(() => {
      const paths = [this.activePath(k), this.archivePath(k)].filter((p) => fs.existsSync(p));
      if (!paths.length) throw notFound(k, this.vault);
      for (const p of paths) fs.rmSync(p, { force: true });
      const left = paths.filter((p) => fs.existsSync(p));
      if (left.length) {
        throw new ToolkitError(EXIT.ERROR, `Deleted but not verified: ${left.join(', ')} still exists.`, { key: k, paths: left });
      }
      this.writeIndex();
      this.touchMeta('delete', k);
      return { key: k, deleted: true };
    });
  }

  // ------------------------------------------------------------ focus and glossary

  readDocument(file) {
    const text = readText(path.join(this.vault, file));
    return text === null ? { text: '', version: null } : { text, version: versionOf(text) };
  }

  async writeDocument(file, text, expect, label, action) {
    return this.locked(() => {
      const target = path.join(this.vault, file);
      const current = readText(target);
      checkExpect(current === null ? null : versionOf(current), expect, label);
      writeFile(target, text);
      this.touchMeta(action, null);
      return { version: versionOf(text) };
    });
  }

  async focusGet() {
    return this.readDocument(FOCUS_FILE);
  }

  async focusSet(markdown, { expect } = {}) {
    const text = normalizeDocument(assertValidFocus(markdown));
    const res = await this.writeDocument(FOCUS_FILE, text, expect, 'The current focus', 'focus');
    return { ...res, lines: focusLineCount(text) };
  }

  async glossaryGet() {
    return this.readDocument(GLOSSARY_FILE);
  }

  async glossarySet(markdown, { expect } = {}) {
    const text = normalizeDocument(assertValidGlossary(markdown));
    return this.writeDocument(GLOSSARY_FILE, text, expect, 'The glossary', 'glossary');
  }

  // ------------------------------------------------------------ index, meta, status

  /** The text MEMORY.md should hold for the current records. */
  indexText(entries = this.scan().entries) {
    const live = sortRecords(entries.map((e) => recordSummary(e.record)).filter((s) => s.status !== 'retired'));
    const retired = entries.filter((e) => e.record.status === 'retired').length;
    const lines = [
      '# Memory index',
      '',
      'Generated by `toolkit memory reindex` from the record files in this folder. Do not edit this file by hand: change records with `toolkit memory save`, `retire`, and `restore`. Open a record before relying on it.',
      '',
    ];
    const shown = live.slice(0, INDEX_MAX_ENTRIES);
    if (!shown.length) lines.push('No records yet.', '');
    for (const type of RECORD_TYPES) {
      const ofType = shown.filter((s) => s.type === type);
      if (!ofType.length) continue;
      lines.push(`## ${TYPE_TITLES[type]}`, '');
      for (const s of ofType) {
        const flag = s.status === 'needs-review' ? ' (needs review)' : '';
        lines.push(`- [${s.key}](${s.key}.md): ${s.description}${flag}`);
      }
      lines.push('');
    }
    if (live.length > shown.length) {
      lines.push(`${live.length - shown.length} more records are not listed here. Run \`toolkit memory list\` to see all of them.`, '');
    }
    if (retired) lines.push(`Retired records: ${retired}, in archive/. Run \`toolkit memory list --status retired\` to see them.`, '');
    lines.push('## Other memory files', '', `- [Current focus](${FOCUS_FILE})`, `- [Terminology glossary](${GLOSSARY_FILE})`, '');
    return lines.join('\n');
  }

  /** Write MEMORY.md when it differs. Call with the lock held. Returns true when it changed. */
  writeIndex(entries) {
    const text = this.indexText(entries);
    const target = path.join(this.vault, INDEX_FILE);
    if (readText(target) === text) return false;
    writeFile(target, text);
    return true;
  }

  readMeta() {
    try {
      const parsed = JSON.parse(readText(path.join(this.vault, META_FILE)) || 'null');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  /** Record the last write. Call with the lock held. */
  touchMeta(action, key, extra = {}) {
    const meta = { schema: 1, ...this.readMeta(), ...extra };
    meta.schema = 1;
    if (action) {
      meta.lastSave = this.now().toISOString();
      meta.lastAction = action;
      meta.lastKey = key || null;
    }
    writeFile(path.join(this.vault, META_FILE), `${JSON.stringify(meta, null, 2)}\n`);
  }

  /** Record that the memory was exported to a folder (for the backup warning). */
  async markExport(dir) {
    return this.locked(() => this.touchMeta(null, null, { lastExport: this.now().toISOString(), lastExportTo: dir }));
  }

  async reindex() {
    return this.locked(() => {
      let moved = 0;
      const { entries } = this.scan();
      for (const e of entries) {
        const want = e.record.status === 'retired' ? 'archive' : 'active';
        if (e.where === want) continue;
        const target = want === 'archive' ? this.archivePath(e.key) : this.activePath(e.key);
        if (fs.existsSync(target)) continue; // a second copy; status reports it
        ensureDir(path.dirname(target));
        fs.renameSync(e.path, target);
        moved++;
      }
      const after = moved ? this.scan().entries : entries;
      const changed = this.writeIndex(after) ? 1 : 0;
      let modes = 0;
      for (const file of [...after.map((e) => e.path), ...this.documentPaths()]) if (setMode(file)) modes++;
      const count = after.filter((e) => e.record.status !== 'retired').length;
      const parts = [`${INDEX_FILE} lists ${count} records`];
      if (moved) parts.push(`${moved} files moved to match their status`);
      if (modes) parts.push(`${modes} files made readable by everyone (mode 644)`);
      return { count, changed: changed + moved + modes, detail: `${parts.join('; ')}.` };
    });
  }

  /** The index, focus, glossary, and meta files (whether or not they exist). */
  documentPaths() {
    return [INDEX_FILE, FOCUS_FILE, GLOSSARY_FILE, META_FILE].map((f) => path.join(this.vault, f));
  }

  async status() {
    const exists = fs.existsSync(this.vault);
    const meta = exists ? this.readMeta() : {};
    if (!exists) {
      return {
        backend,
        location: this.vault,
        lastSave: null,
        lastExport: null,
        counts: countRecords([]),
        healthy: false,
        detail: `The memory folder ${this.vault} does not exist yet. The first save creates it.`,
        problems: [{ where: VAULT_DIR, problem: 'does not exist.' }],
      };
    }
    const { entries, problems } = this.scan();
    const counts = countRecords(entries.map((e) => recordSummary(e.record)));
    const index = readText(path.join(this.vault, INDEX_FILE));
    if (index !== this.indexText(entries)) {
      problems.push({ where: `${VAULT_DIR}/${INDEX_FILE}`, problem: 'is out of date. Run toolkit memory reindex.' });
    }
    const focus = readText(path.join(this.vault, FOCUS_FILE));
    if (focus !== null && focusLineCount(focus) > FOCUS_MAX_LINES) {
      problems.push({ where: `${VAULT_DIR}/${FOCUS_FILE}`, problem: `has ${focusLineCount(focus)} lines; the limit is ${FOCUS_MAX_LINES}.` });
    }
    const ownerOnly = [...entries.map((e) => e.path), ...this.documentPaths()].filter(wrongMode);
    for (const file of ownerOnly) {
      problems.push({ where: rel(this.vault, file), problem: 'does not have mode 644 (readable by everyone). Run toolkit memory reindex to fix it.' });
    }
    const lockFile = path.join(this.vault, LOCK_NAME);
    if (fs.existsSync(lockFile)) problems.push({ where: `${VAULT_DIR}/${LOCK_NAME}`, problem: 'exists: a toolkit command is writing, or one stopped without cleaning up.' });
    const inUse = counts.total - counts.retired;
    const detail = `Built-in memory in ${this.vault}: ${inUse} record${inUse === 1 ? '' : 's'} in use, ${counts.retired} retired`
      + (problems.length ? `, ${problems.length} problem${problems.length === 1 ? '' : 's'} to look at.` : '.');
    return {
      backend,
      location: this.vault,
      lastSave: meta.lastSave || null,
      lastExport: meta.lastExport || null,
      counts,
      healthy: true,
      detail,
      problems,
    };
  }
}

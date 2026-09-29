// Built-in memory: Markdown files in .memory/ in the main checkout, in the
// model project's formats (the files in the model's .memory/ folder).
//
// Layout (all Git-ignored):
//   .memory/<type>_<slug>.md        one concept or area per file (concept memory; lib/memory/concepts.mjs):
//                                   current, needs-review, or superseded
//   .memory/archive/<key>.md        archived topics (retired with no replacement)
//   .memory/MEMORY.md               generated index in the model's layout; never edit it by hand
//   .memory/CURRENT_FOCUS.md        the current focus (four sections, at most 50 lines)
//   .memory/terminology-glossary.md project terms (the model's table)
//   .memory/memory-criteria.md      what is worth keeping (read by agents, not by this driver)
//   .memory/AGENTS.md               how agents work in this folder
//   .memory/project_topic_template.md  the topic seed; never listed as a topic
//   .memory/.toolkit-meta.json      last save time, last action, last export time
//   .memory/.lock                   held while a toolkit command writes
//
// The folder can be opened as an Obsidian vault. Notes link each other with
// relative Markdown links such as [account model](project_account_model.md).
// When a note is renamed, superseded, archived, or deleted, every link to it in
// the other notes (and in the current focus and the glossary) is repaired:
// renamed and superseded -> the link points at the new note; archived -> the
// words plus "(archived)"; deleted -> the words only. An archived note moves
// into archive/, so its own links are rebased to start with ../. status()
// reports links that point at a note that does not exist.
//
// The folder is found from the main checkout, so every Git worktree of the
// project reads and writes the same memory. Every write happens under the
// lock, through a temp file and a rename, and is read back. Every file the
// toolkit writes here is set to mode 0644 (readable by everyone); reindex
// fixes the mode of files it did not write. A record file that breaks a rule
// is reported by `toolkit memory status`; it never stops other records from
// being saved. Missing seed files (focus, glossary, criteria, AGENTS.md) are
// written from the model's templates on the first write command (never by
// reindex, so setup's copy of the model stays exactly the model).
//
// Implements MemoryDriver from contract.mjs.

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { atomicWrite, ensureDir, readText } from '../core/fsx.mjs';
import { withLock } from '../core/lock.mjs';
import { update as updateFrontmatter } from '../core/frontmatter.mjs';
import { readTemplate } from '../core/templates.mjs';
import { today as localToday } from '../core/util.mjs';
import {
  ARCHIVE_FOLDER, RECORD_TYPES, FOCUS_MAX_LINES, addBodyNote, assertKey, assertValidRecord, assertValidFocus, assertValidGlossary,
  assertFilter, brokenLinks, changeRecordStatus, changeSupersedes, checkExpect, countRecords, fitLinks, keywordScore,
  latestStatusNote, matchesFilter, normalizeDocument, normalizeRecord, notFound, parseRecord, rebaseLinks, recordSummary,
  renameRecordText, repairLinks, restoreNote, retireNote, searchTerms, serializeRecord, sortRecords, splitKey, storedStatus,
  versionOf, focusLineCount, focusShapeProblems, isProposal, bodyTitle, titleFromName, anchorHeading, findLinks, linkVaultPath, mergedInto,
} from './contract.mjs';
import { allHeadings, assertEditedText } from './concepts.mjs';

export const backend = 'builtin';
export const VAULT_DIR = '.memory';
export const ARCHIVE_DIR = ARCHIVE_FOLDER;
export const INDEX_FILE = 'MEMORY.md';
export const FOCUS_FILE = 'CURRENT_FOCUS.md';
export const GLOSSARY_FILE = 'terminology-glossary.md';
export const CRITERIA_FILE = 'memory-criteria.md';
export const AGENTS_FILE = 'AGENTS.md';
export const META_FILE = '.toolkit-meta.json';
export const LOCK_NAME = '.lock';
/** The index budget (the model's memory rules): MEMORY.md is never cut, but status warns past these. */
export const INDEX_MAX_LINES = 150;
export const INDEX_MAX_BYTES = 25000;
/** The mode of every file in .memory/: owner can write, everyone can read. */
export const FILE_MODE = 0o644;

/** Seed files written from the model's templates when they are missing: file -> template name. */
export const SEEDS = Object.freeze({
  [FOCUS_FILE]: 'memory/CURRENT_FOCUS',
  [GLOSSARY_FILE]: 'memory/glossary',
  [CRITERIA_FILE]: 'memory/criteria',
  [AGENTS_FILE]: 'memory/AGENTS',
});

const RECORD_FILE_RE = /^((?:user|feedback|project|reference|event)_[a-z0-9]+(?:_[a-z0-9]+)*)\.md$/;
const TYPE_TITLES = { user: 'User', feedback: 'Feedback', project: 'Project', reference: 'Reference', event: 'Event' };
const OTHER_VIEWS_HEADING = '## Other memory views';

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

/**
 * The parts of the model's MEMORY.md around the generated lists: the intro
 * (the title and the "One short link per active topic" paragraph) and the
 * "## Other memory views" section, both exactly as the model has them.
 */
export function indexFrame() {
  const text = readTemplate('memory/MEMORY').replace(/\r\n/g, '\n');
  const firstType = text.search(/^## /m);
  const views = text.indexOf(OTHER_VIEWS_HEADING);
  if (firstType === -1 || views === -1) {
    throw new ToolkitError(EXIT.ERROR, `The model's .memory/${INDEX_FILE} template has no "## User" or "${OTHER_VIEWS_HEADING}" section, so the index cannot be built.`, {
      fix: 'Reinstall or update the toolkit plugin.',
    });
  }
  return { intro: text.slice(0, firstType).replace(/\n+$/, '\n'), end: text.slice(views) };
}

/** How MEMORY.md marks a saved proposal. */
export const PROPOSAL_MARK = 'proposal: not a fact until the owner answers';

/**
 * The text of MEMORY.md for a list of summaries (with stored_status), in the
 * model's layout: the intro, one "## <Type>" section per type (the prefix)
 * with one line per concept file in the vault root: its title, linked to the
 * file, its one-line summary, and the date of its last change
 * ("- [<title>](<file>) — <summary> (updated <YYYY-MM-DD>)"; concept memory,
 * Mike 2026-09-28), plus " [needs-review]" or " [superseded]", or
 * " [PROPOSAL_MARK]" for a saved proposal, whose `proposal` is true. Then
 * "## Other memory views". With no topics it is the model's MEMORY.md byte for byte.
 */
export function buildIndex(entries) {
  const { intro, end } = indexFrame();
  const chunks = [intro];
  for (const type of RECORD_TYPES) {
    chunks.push(`\n## ${TYPE_TITLES[type]}\n\n`);
    const ofType = entries.filter((e) => e.type === type).sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
    for (const e of ofType) {
      // A saved proposal is marked as one, so an agent reading only this index never takes it as a fact.
      const word = e.proposal ? ` [${PROPOSAL_MARK}]` : e.stored_status && e.stored_status !== 'current' ? ` [${e.stored_status}]` : '';
      const title = linkText(e.title || e.key);
      const date = e.updated ? ` (updated ${e.updated})` : '';
      chunks.push(`- [${title}](${e.key}.md) — ${e.description}${date}${word}\n`);
    }
  }
  chunks.push(`\n${end}`);
  return chunks.join('');
}

/** A title as the words of a Markdown link: brackets would end the link, so they are taken out. */
function linkText(title) {
  return String(title).replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim() || 'Untitled';
}

function rel(vault, file) {
  return path.relative(path.dirname(vault), file);
}

/** Write a file in the vault atomically and make it readable by everyone. */
function writeFile(target, text) {
  ensureDir(path.dirname(target));
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

function localDate(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * The date shown as a record's last change (index and list): its `updated`
 * field. A record written before concept memory has none; then its
 * last_verified date, and only then the file's modified time, which a fresh
 * clone or a memory import sets to that day for every file (verifier,
 * 2026-09-28).
 */
export function shownUpdated(record) {
  const r = record || {};
  if (r.updated) return String(r.updated);
  const verified = String(r.last_verified ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(verified)) return verified;
  return r.saved ? String(r.saved) : '';
}

/**
 * The folder ('' or 'archive') a record belongs in: archive/ only for an
 * archived record. A superseded record stays in the vault root, even when its
 * replacement is not named (see storedStatus in contract.mjs).
 */
export function folderFor(record) {
  return storedStatus(record) === 'archived' ? ARCHIVE_DIR : '';
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

  pathIn(dir, key) {
    return dir === ARCHIVE_DIR ? this.archivePath(key) : this.activePath(key);
  }

  async locked(fn) {
    ensureDir(this.vault);
    return withLock(this.vault, fn, { name: LOCK_NAME });
  }

  /**
   * Get ready for a write, with the lock held: check that the model's MEMORY.md
   * template can be read (so a write never stops halfway because the index
   * cannot be built), then write the seed files that are missing, from the
   * model's templates. except: a file this write is about to write itself.
   * A seed that cannot be written is left out; it never stops the write.
   */
  prepareWrite(except = null) {
    indexFrame();
    const written = [];
    for (const [file, name] of Object.entries(SEEDS)) {
      if (file === except) continue;
      const target = path.join(this.vault, file);
      if (fs.existsSync(target)) continue;
      try {
        writeFile(target, readTemplate(name));
        written.push(file);
      } catch {
        // The seed is optional; toolkit doctor reports a missing plugin copy.
      }
    }
    return written;
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
   * entries: { key, path, where, dir, text, record, problems } for each readable record.
   * problems: { where, problem } for files that cannot be used, duplicates,
   * and records in the wrong folder. Seed templates (status: template) are skipped.
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
        if (!record.saved) record.saved = localDate(stat.mtimeMs);
        const fatal = recordProblems.find((p) => p.startsWith('it has no frontmatter') || p.startsWith('its frontmatter cannot be read'));
        if (fatal || !['current', 'needs-review', 'retired'].includes(record.status) || !RECORD_TYPES.includes(record.type)) {
          problems.push({ where: rel(this.vault, file), problem: `is skipped: ${recordProblems.join(' ') || 'its status or type is not valid.'}` });
          continue;
        }
        if (seen.has(key)) {
          problems.push({ where: rel(this.vault, file), problem: `is a second copy of ${key}; the copy in ${seen.get(key)} is used.` });
          continue;
        }
        seen.set(key, rel(this.vault, file));
        for (const p of recordProblems) problems.push({ where: rel(this.vault, file), problem: p });
        const want = folderFor(record) === ARCHIVE_DIR ? 'archive' : 'active';
        if (where === 'archive' && want !== 'archive') {
          problems.push({ where: rel(this.vault, file), problem: `is in archive/ but its status is ${record.stored_status || record.status}. Run toolkit memory reindex to move it.` });
        }
        if (where === 'active' && want === 'archive') {
          problems.push({ where: rel(this.vault, file), problem: 'is archived but not in archive/. Run toolkit memory reindex to move it.' });
        }
        entries.push({ key, path: file, where, dir: where === 'archive' ? ARCHIVE_DIR : '', text, record, problems: recordProblems });
      }
    };
    readDir(this.vault, 'active');
    readDir(path.join(this.vault, ARCHIVE_DIR), 'archive');
    return { entries, problems };
  }

  stored(entryOrStored, key) {
    const { record, problems } = parseRecord(entryOrStored.text, key);
    if (!record.saved) {
      try {
        record.saved = localDate(fs.statSync(entryOrStored.path).mtimeMs);
      } catch {
        record.saved = this.today();
      }
    }
    return {
      ...record,
      version: versionOf(entryOrStored.text),
      text: entryOrStored.text,
      path: entryOrStored.path,
      valid: problems.length === 0,
      problems,
    };
  }

  /** Throws ERROR ("saved but not verified") when the file does not hold the text just written. */
  verify(target, text, key) {
    const back = readText(target);
    if (back !== text) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${target} does not hold what was written.`, { key, path: target });
    }
  }

  // ------------------------------------------------------------ records

  /** True when a path relative to the vault (it may start with ../) exists. */
  existsInVault(p) {
    return fs.existsSync(path.join(this.vault, ...String(p).split('/')));
  }

  /**
   * Create or replace a record. When the save moves the note between the vault
   * root and archive/ (for example an archived note saved again as current),
   * its links are rebased so they still reach the same notes, and a note that
   * leaves archive/ gets a "**Restored <date>:**" line above its Archived line.
   */
  async save(input, { expect } = {}) {
    const record = assertValidRecord(normalizeRecord(input, { today: this.today() }));
    return this.locked(() => {
      this.prepareWrite();
      const current = this.readStored(record.key);
      checkExpect(current ? versionOf(current.text) : null, expect, `The memory record ${record.key}`);
      const toDir = folderFor(record);
      const fromDir = current && current.where === 'archive' ? ARCHIVE_DIR : '';
      if (current && fromDir !== toDir) {
        record.body = fitLinks(record.body, fromDir, toDir, (p) => this.existsInVault(p)).text;
        if (fromDir === ARCHIVE_DIR && latestStatusNote(record.body) === 'archived') {
          record.body = addBodyNote(record.body, restoreNote(this.today()));
        }
      }
      const text = serializeRecord(record);
      const target = this.pathIn(toDir, record.key);
      writeFile(target, text);
      this.removeOtherCopy(record.key, target);
      this.writeIndex();
      this.touchMeta(current ? 'update' : 'create', record.key);
      this.verify(target, text, record.key);
      return {
        key: record.key,
        version: versionOf(text),
        created: !current,
        record: this.stored({ text, path: target }, record.key),
      };
    });
  }

  /**
   * Change one stored record with the lock held for the whole change (concept
   * memory: one section added or replaced). fn(stored) gives { text, ... }:
   * the new stored text. The text is checked against the record rules and
   * written as it is, so every line fn did not change keeps its exact bytes.
   * expect: the caller's --expect, checked inside the lock. The record stays
   * in its folder. Returns { key, version, created: false, record, ...what fn gave }.
   */
  async editRecord(key, fn, { expect } = {}) {
    const k = assertKey(key);
    return this.locked(() => {
      this.prepareWrite();
      const current = this.readStored(k);
      if (!current) throw notFound(k, this.vault);
      checkExpect(versionOf(current.text), expect, `The memory record ${k}`);
      const out = fn(this.stored(current, k));
      assertEditedText(out.text, k);
      writeFile(current.path, out.text);
      this.writeIndex();
      this.touchMeta('update', k);
      this.verify(current.path, out.text, k);
      const { text: _text, ...rest } = out;
      return { ...rest, key: k, version: versionOf(out.text), created: false, record: this.stored({ text: out.text, path: current.path }, k) };
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
    return sortRecords(entries.map((e) => ({ ...recordSummary(e.record), updated: shownUpdated(e.record) })).filter((s) => matchesFilter(s, filter)));
  }

  /**
   * Keyword search. Retired records only with `all`; saved proposals (the
   * owner has not answered them) only with `proposals` or `all`, so they are
   * never found as facts. `proposalsLeftOut` counts the proposals that
   * matched but were left out.
   */
  async find(query, { reflect = false, limit = 10, type, all = false, proposals = false } = {}) {
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
    let proposalsLeftOut = 0;
    for (const e of entries) {
      const r = e.record;
      if (!all && r.status === 'retired') continue;
      if (type && r.type !== type) continue;
      const { score, snippet } = keywordScore(r, terms);
      if (score <= 0) continue;
      if (!all && !proposals && isProposal(r)) {
        proposalsLeftOut++;
        continue;
      }
      hits.push({
        key: r.key, name: r.name, type: r.type, description: r.description, status: r.status,
        stored_status: storedStatus(r), superseded_by: r.superseded_by ?? null, proposal: isProposal(r), score, snippet,
      });
    }
    hits.sort((a, b) => b.score - a.score || (a.key < b.key ? -1 : 1));
    const max = Number.isInteger(limit) && limit > 0 ? limit : 10;
    return { query: String(query), mode: 'keyword', results: hits.slice(0, max), proposalsLeftOut };
  }

  // ------------------------------------------------------------ links

  /**
   * Repair links (and `supersedes` entries for a rename) in every note except
   * `skip`, and in the current focus and the glossary. Call with the lock held.
   * change: see repairLinks() in contract.mjs. Returns the changed notes: record
   * keys, or the file names of the focus and the glossary.
   */
  repairVault(change, { skip = [] } = {}) {
    const changed = [];
    for (const e of this.scan().entries) {
      if (skip.includes(e.key)) continue;
      let text = e.text;
      const fixed = repairLinks(text, e.dir, change);
      text = fixed.text;
      if (change.kind === 'rename' && e.record.supersedes.includes(change.from)) {
        text = changeSupersedes(text, { remove: [change.from], add: [change.to] });
      }
      if (text === e.text) continue;
      writeFile(e.path, text);
      changed.push(e.key);
    }
    for (const file of [FOCUS_FILE, GLOSSARY_FILE]) {
      const target = path.join(this.vault, file);
      const text = readText(target);
      if (text === null) continue;
      const fixed = repairLinks(text, '', change);
      if (!fixed.count) continue;
      writeFile(target, fixed.text);
      changed.push(file);
    }
    return changed;
  }

  /**
   * Repair links after a change the command made through other methods (for
   * example sections moved to another concept by toolkit memory split), with
   * the lock held. Returns { linksRepaired }.
   */
  async relink(change, { skip = [] } = {}) {
    return this.locked(() => {
      const linksRepaired = this.repairVault(change, { skip });
      if (linksRepaired.length) this.writeIndex();
      return { linksRepaired };
    });
  }

  /**
   * Links in the notes, the focus, and the glossary that point at a note that
   * does not exist, including a relative link to a Markdown file outside the
   * vault (../...), such as a link an archived note kept after it moved.
   * Each problem says how to fix it.
   */
  brokenLinks(entries = this.scan().entries) {
    const exists = (p) => this.existsInVault(p);
    const names = new Set();
    for (const e of entries) names.add(path.basename(e.path));
    for (const f of fs.existsSync(this.vault) ? fs.readdirSync(this.vault) : []) names.add(f);
    const findByName = (name) => names.has(name);
    const out = [];
    const check = (where, text, dir, fix) => {
      for (const b of brokenLinks(text, dir, { exists, findByName, outside: exists })) {
        const target = b.outside ? `${path.posix.normalize(`${VAULT_DIR}/${b.path}`)} (outside ${VAULT_DIR}/)` : b.path;
        out.push({ where, problem: `links to ${target}, which does not exist: ${b.link}. ${fix}` });
      }
    };
    for (const e of entries) {
      check(rel(this.vault, e.path), e.text, e.dir, `Correct the link, then save the note again with toolkit memory save and --expect <version> (toolkit memory get ${e.key} --json gives its text and version).`);
    }
    // Concept memory: a link to a section ("project_billing.md#Refund%20window") needs that heading in the note.
    const byPath = new Map(entries.map((e) => [path.posix.join(e.dir || '', path.basename(e.path)), e]));
    for (const e of entries) {
      for (const link of findLinks(e.text)) {
        if (link.kind !== 'md' || !link.anchor || link.anchor === '#') continue;
        const where = linkVaultPath(link, e.dir);
        const target = where && byPath.get(where.path);
        if (!target) continue;
        const wanted = anchorHeading(link.anchor);
        if (allHeadings(target.record.body).some((h) => anchorHeading(h) === wanted)) continue;
        out.push({ where: rel(this.vault, e.path), problem: `links to ${where.path}${link.anchor}, a section that ${target.key} does not have: ${link.full}. Correct the link (toolkit memory get ${target.key} shows its sections), then save the note again with toolkit memory save and --expect <version>.` });
      }
    }
    for (const [file, cmd] of [[FOCUS_FILE, 'focus'], [GLOSSARY_FILE, 'glossary']]) {
      const text = readText(path.join(this.vault, file));
      if (text !== null) check(`${VAULT_DIR}/${file}`, text, '', `Correct the link with toolkit memory ${cmd} --set-file <file>.`);
    }
    return out;
  }

  /** Superseded notes whose replacement does not exist, or is archived. */
  replacementProblems(entries) {
    const byKey = new Map(entries.map((e) => [e.key, e]));
    const out = [];
    for (const e of entries) {
      const by = e.record.superseded_by;
      if (storedStatus(e.record) !== 'superseded' || !by) continue;
      const next = byKey.get(by);
      if (!next) {
        out.push({ where: rel(this.vault, e.path), problem: `is superseded by ${by}, which does not exist. Archive it with toolkit memory retire ${e.key}, or save its replacement again.` });
      } else if (folderFor(next.record) === ARCHIVE_DIR) {
        out.push({ where: rel(this.vault, e.path), problem: `is superseded by ${by}, which is archived. Archive it too with toolkit memory retire ${e.key}, or restore ${by}.` });
      }
    }
    return out;
  }

  // ------------------------------------------------------------ lifecycle

  /**
   * Change the status of a stored record, keeping its other text, and move it
   * to the folder its status belongs in. Call with the lock held.
   */
  writeStatus(k, current, { status, supersededBy = null, note = '' }) {
    const text = changeRecordStatus(current.text, { status, supersededBy, note, updated: this.today() }, k);
    const { record } = parseRecord(text, k);
    const target = this.pathIn(folderFor(record), k);
    writeFile(target, text);
    this.removeOtherCopy(k, target);
    return { text, target, record };
  }

  /**
   * anchor: a section of the replacement ("#Deploy%20window"), when this record
   * was merged into a concept as that section; the retire note and the
   * repaired links point there.
   */
  async retire(key, { supersededBy, reason, anchor = '' } = {}) {
    const k = assertKey(key);
    const by = supersededBy ? assertKey(supersededBy) : null;
    if (by && by === k) throw new ToolkitError(EXIT.INVALID, 'A record cannot be superseded by itself.');
    return this.locked(() => {
      this.prepareWrite();
      const current = this.readStored(k);
      if (!current) throw notFound(k, this.vault);
      const successor = by ? this.readStored(by) : null;
      if (by && !successor) {
        throw new ToolkitError(EXIT.INVALID, `${k} was not retired: the replacement ${by} does not exist in ${this.vault}.`, {
          key: k,
          supersededBy: by,
          fix: 'Save the new record first, or check the key with toolkit memory list.',
        });
      }
      if (successor && (successor.where === 'archive' || folderFor(parseRecord(successor.text, by).record) === ARCHIVE_DIR)) {
        throw new ToolkitError(EXIT.INVALID, `${k} was not retired: the replacement ${by} is archived, so a link to it would not work.`, {
          key: k,
          supersededBy: by,
          fix: `Restore it first with toolkit memory restore ${by}, or name a record that is in use.`,
        });
      }
      const note = retireNote(this.today(), { reason, supersededBy: by, anchor: by ? anchor : '' });
      const { text, target } = this.writeStatus(k, current, { status: 'retired', supersededBy: by, note });
      if (successor) {
        const next = changeSupersedes(successor.text, { add: [k] });
        if (next !== successor.text) writeFile(successor.path, next);
      }
      const change = by
        ? { kind: 'supersede', from: k, to: by, fromPath: `${k}.md`, toPath: `${by}.md`, ...(anchor ? { anchor } : {}) }
        : { kind: 'archive', from: k, fromPath: `${k}.md` };
      // The replacement is skipped too: its own words about the old note ("replaces [old](old.md)") stay.
      const linksRepaired = this.repairVault(change, { skip: by ? [k, by] : [k] });
      this.writeIndex();
      this.touchMeta('retire', k);
      this.verify(target, text, k);
      return { key: k, version: versionOf(text), record: this.stored({ text, path: target }, k), linksRepaired };
    });
  }

  async restore(key) {
    const k = assertKey(key);
    return this.locked(() => {
      this.prepareWrite();
      const current = this.readStored(k);
      if (!current) throw notFound(k, this.vault);
      const before = parseRecord(current.text, k).record;
      const { text, target } = this.writeStatus(k, current, { status: 'needs-review', supersededBy: null, note: restoreNote(this.today()) });
      if (before.superseded_by) {
        const successor = this.readStored(before.superseded_by);
        if (successor) {
          const next = changeSupersedes(successor.text, { remove: [k] });
          if (next !== successor.text) writeFile(successor.path, next);
        }
      }
      this.writeIndex();
      this.touchMeta('restore', k);
      this.verify(target, text, k);
      return { key: k, version: versionOf(text), record: this.stored({ text, path: target }, k) };
    });
  }

  /**
   * Give a record a new key. The file is renamed in its folder, its `name`
   * (and `metadata.type` when the type changes) is set, and every link and
   * `supersedes` entry that named the old key is pointed at the new one.
   */
  async rename(key, toKey) {
    const k = assertKey(key);
    const to = assertKey(toKey);
    if (k === to) throw new ToolkitError(EXIT.INVALID, `${k} already has that key.`, { key: k });
    return this.locked(() => {
      this.prepareWrite();
      const current = this.readStored(k);
      if (!current) throw notFound(k, this.vault);
      if (this.readStored(to)) {
        throw new ToolkitError(EXIT.INVALID, `${k} was not renamed: a record with the key ${to} already exists.`, {
          key: k,
          to,
          fix: `Merge them instead: save what should stay in ${to}, then run toolkit memory retire ${k} --superseded-by ${to}.`,
        });
      }
      const dir = current.where === 'archive' ? ARCHIVE_DIR : '';
      const fromPath = dir ? `${dir}/${k}.md` : `${k}.md`;
      const toPath = dir ? `${dir}/${to}.md` : `${to}.md`;
      const change = { kind: 'rename', from: k, to, fromPath, toPath };
      // The note's own links to itself follow the rename too.
      const text = repairLinks(renameRecordText(current.text, to), dir, change).text;
      const target = this.pathIn(dir, to);
      writeFile(target, text);
      fs.rmSync(current.path, { force: true });
      const linksRepaired = this.repairVault(change, { skip: [to] });
      this.writeIndex();
      this.touchMeta('rename', to);
      this.verify(target, text, to);
      return { key: to, from: k, version: versionOf(text), record: this.stored({ text, path: target }, to), linksRepaired };
    });
  }

  async delete(key) {
    const k = assertKey(key);
    return this.locked(() => {
      indexFrame();
      const paths = [this.activePath(k), this.archivePath(k)].filter((p) => fs.existsSync(p));
      if (!paths.length) throw notFound(k, this.vault);
      const fromPath = paths[0] === this.archivePath(k) ? `${ARCHIVE_DIR}/${k}.md` : `${k}.md`;
      for (const p of paths) fs.rmSync(p, { force: true });
      const left = paths.filter((p) => fs.existsSync(p));
      if (left.length) {
        throw new ToolkitError(EXIT.ERROR, `Deleted but not verified: ${left.join(', ')} still exists.`, { key: k, paths: left });
      }
      const linksRepaired = this.repairVault({ kind: 'delete', from: k, fromPath });
      this.writeIndex();
      this.touchMeta('delete', k);
      return { key: k, deleted: true, linksRepaired };
    });
  }

  // ------------------------------------------------------------ focus and glossary

  readDocument(file) {
    const text = readText(path.join(this.vault, file));
    return text === null ? { text: '', version: null } : { text, version: versionOf(text) };
  }

  async writeDocument(file, text, expect, label, action) {
    return this.locked(() => {
      this.prepareWrite(file);
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

  /**
   * The text MEMORY.md should hold for the current records (topics in the
   * vault root). A record merged into a concept is left out: it is
   * superseded, and its facts are in the concept, which is listed (verifier,
   * 2026-09-28: after merging 6 records into 2 concepts, the index still
   * listed all 6 beside the concepts).
   */
  indexText(entries = this.scan().entries) {
    const listed = entries.filter((e) => folderFor(e.record) !== ARCHIVE_DIR && !mergedInto(e.record)).map((e) => ({
      key: e.key,
      type: e.record.type,
      title: bodyTitle(e.record.body) || titleFromName(e.record.name),
      description: e.record.description,
      updated: shownUpdated(e.record),
      stored_status: storedStatus(e.record),
      proposal: isProposal(e.record),
    }));
    return buildIndex(listed);
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

  /**
   * Move files to the folder their status belongs in (rebasing their links),
   * write files still in the older toolkit format in the model format, rebuild
   * MEMORY.md, and fix file modes.
   */
  async reindex() {
    return this.locked(() => {
      let moved = 0;
      let rewritten = 0;
      const { entries } = this.scan();
      for (const e of entries) {
        let text = e.text;
        // An older toolkit record gets the model's frontmatter and topic body; a
        // superseded one keeps its replacement, written in its Superseded line.
        if (e.record.legacy) text = serializeRecord(normalizeRecord(e.record, { today: this.today() }));
        else if (e.record.stored_status === 'retired') {
          // "retired" is the command's word; the file gets the model's word.
          text = updateFrontmatter(text, { status: storedStatus(e.record) });
        }
        const wantDir = folderFor(e.record);
        const want = wantDir === ARCHIVE_DIR ? 'archive' : 'active';
        if (e.where !== want) {
          const target = this.pathIn(wantDir, e.key);
          if (fs.existsSync(target)) continue; // a second copy; status reports it
          text = rebaseLinks(text, e.dir, wantDir).text;
          writeFile(target, text);
          fs.rmSync(e.path, { force: true });
          moved++;
          if (e.record.legacy) rewritten++;
          continue;
        }
        if (text !== e.text) {
          writeFile(e.path, text);
          rewritten++;
        }
      }
      const after = moved || rewritten ? this.scan().entries : entries;
      const changed = this.writeIndex(after) ? 1 : 0;
      let modes = 0;
      for (const file of [...after.map((e) => e.path), ...this.documentPaths()]) if (setMode(file)) modes++;
      const count = after.filter((e) => folderFor(e.record) !== ARCHIVE_DIR).length;
      const parts = [`${INDEX_FILE} lists ${count} topic${count === 1 ? '' : 's'}`];
      if (moved) parts.push(`${moved} files moved to match their status`);
      if (rewritten) parts.push(`${rewritten} files written again in the model's topic format`);
      if (modes) parts.push(`${modes} files made readable by everyone (mode 644)`);
      return { count, changed: changed + moved + rewritten + modes, detail: `${parts.join('; ')}.` };
    });
  }

  /** The index, focus, glossary, criteria, and meta files (whether or not they exist). */
  documentPaths() {
    return [INDEX_FILE, FOCUS_FILE, GLOSSARY_FILE, CRITERIA_FILE, META_FILE].map((f) => path.join(this.vault, f));
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
    let expected = null;
    try {
      expected = this.indexText(entries);
    } catch (err) {
      problems.push({ where: `${VAULT_DIR}/${INDEX_FILE}`, problem: `cannot be checked: ${err.message}` });
    }
    if (expected !== null && index !== expected) {
      problems.push({ where: `${VAULT_DIR}/${INDEX_FILE}`, problem: 'is out of date. Run toolkit memory reindex.' });
    }
    if (expected !== null) {
      const lines = expected.split('\n').length - 1;
      const bytes = Buffer.byteLength(expected);
      if (lines > INDEX_MAX_LINES || bytes > INDEX_MAX_BYTES) {
        problems.push({ where: `${VAULT_DIR}/${INDEX_FILE}`, problem: `is over its budget (${lines} lines, ${bytes} bytes; the budget is ${INDEX_MAX_LINES} lines and ${INDEX_MAX_BYTES} bytes). It is never cut: merge or retire topics with the memory-tidy skill.` });
      }
    }
    for (const e of entries) {
      if (e.record.legacy) problems.push({ where: rel(this.vault, e.path), problem: 'uses the older toolkit record format. Run toolkit memory reindex to write it in the model\'s topic format.' });
    }
    problems.push(...this.brokenLinks(entries));
    problems.push(...this.replacementProblems(entries));
    const focus = readText(path.join(this.vault, FOCUS_FILE));
    if (focus !== null && focusLineCount(focus) > FOCUS_MAX_LINES) {
      problems.push({ where: `${VAULT_DIR}/${FOCUS_FILE}`, problem: `has ${focusLineCount(focus)} lines; the limit is ${FOCUS_MAX_LINES}.` });
    }
    for (const p of focusShapeProblems(focus)) {
      problems.push({ where: `${VAULT_DIR}/${FOCUS_FILE}`, problem: `${p} Save it again with toolkit memory focus --text '<text>'; the command adds what is missing.` });
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

/** The key of a vault record path, for callers outside this module. */
export function keyOfFile(file) {
  const m = RECORD_FILE_RE.exec(path.basename(String(file ?? '')));
  return m && splitKey(m[1]) ? m[1] : null;
}

// The memory contract: one record shape and one set of operations that every
// memory backend (built-in files, Hindsight, Notion) provides.
//
// `toolkit memory ...` and the hooks never talk to a backend directly. They
// call loadDriver(project), which picks the driver from .toolkit.json
// `memory.type`, and then use only the methods described in MemoryDriver below.
//
// Driver modules:
//   builtin   -> lib/memory/builtin.mjs     (.memory/ folder in the main checkout)
//   hindsight -> lib/memory/hindsight.mjs   (one bank on the local Hindsight server)
//   notion    -> lib/memory/notion.mjs      (the project's Notion Memory database;
//                                            written by the Notion builder)
//
// Every driver module exports:
//   export const backend = '<builtin|hindsight|notion>';
//   export async function createDriver(options) -> MemoryDriver
// where options = { root, mainRoot, config, env, fetch, now, timeoutMs, signal }:
//   root      the project folder (this worktree's Git top level)
//   mainRoot  the main checkout (where Git-ignored data such as .memory/ lives)
//   config    the parsed .toolkit.json
//   env       environment variables (process.env unless a test passes others)
//   fetch     the fetch function to use (globalThis.fetch unless a test passes one)
//   now       () => Date, for tests that need a fixed clock
//   timeoutMs optional: the longest one network request may take (the startup
//             briefing passes 2000 so a slow server cannot hold the hook)
//   signal    optional AbortSignal: when it fires, every network request the
//             driver has open stops at once
//
// Helpers in this file do the checks that must be the same for every backend
// (record fields, current focus shape, stale versions). A driver calls
// assertValidRecord() before it writes, so a bad record is refused the same
// way everywhere.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { parse as parseFrontmatter, stringify as stringifyFrontmatter } from '../core/frontmatter.mjs';
import { flattenSections, splitSections, normalizeHeading } from '../core/markdown.mjs';
import { sha256 } from '../core/fsx.mjs';
import { slugify, today as localToday } from '../core/util.mjs';

/**
 * @typedef {'user'|'feedback'|'project'|'reference'|'event'} RecordType
 * @typedef {'current'|'needs-review'|'retired'} RecordStatus
 *
 * @typedef {object} MemoryRecord
 * @property {string} key            `<type>_<slug>`, for example `feedback_deploy_window`.
 *                                   The slug is the name with dashes turned into underscores.
 *                                   Every method that takes a key also accepts it typed with
 *                                   dashes (`feedback_deploy-window`); see canonicalKey().
 * @property {string} name           the slug in kebab case, for example `deploy-window`
 * @property {RecordType} type
 * @property {string} description    one line, at most DESCRIPTION_MAX characters
 * @property {RecordStatus} status
 * @property {string|null} superseded_by  the key of the record that replaced this one, or null
 * @property {string} source         who or what said it, with a date. A name, never an email address.
 * @property {string} saved          YYYY-MM-DD of the latest save
 * @property {string} last_verified  YYYY-MM-DD, or `unknown`
 * @property {string|null} [approved_by]  who approved the save, recorded when --approved-by is given
 * @property {string} body           Markdown after the frontmatter (Remember, Why, How to apply,
 *                                   Evidence and limits, Related)
 *
 * The stored form of a record is serializeRecord(record): YAML frontmatter in
 * FRONTMATTER_ORDER, then the body. The key is not in the frontmatter; it is
 * the file name (built-in), the document id (Hindsight), or the Key property
 * (Notion). A driver that stores the text must store exactly this text, so a
 * read gives back the same bytes.
 *
 * @typedef {MemoryRecord & {
 *   version: string,        opaque; pass it back as `expect` to refuse a stale write
 *   text: string,           the stored text
 *   valid?: boolean,        false when the stored record breaks a rule (it is still returned)
 *   problems?: string[],    what is wrong with it
 *   path?: string           built-in only: the file
 * }} StoredRecord
 *
 * @typedef {object} RecordSummary   a record without its body
 * @property {string} key
 * @property {string} name
 * @property {RecordType} type
 * @property {string} description
 * @property {RecordStatus} status
 * @property {string|null} superseded_by
 * @property {string} source
 * @property {string} saved
 * @property {string} last_verified
 * @property {string|null} approved_by
 *
 * @typedef {object} FindHit
 * @property {string} key
 * @property {string} name
 * @property {RecordType} type
 * @property {string} description
 * @property {RecordStatus} status
 * @property {number|null} score    higher is better; the scale depends on the backend
 * @property {string} snippet       a short piece of the matching text
 *
 * @typedef {object} FindResult
 * @property {string} query
 * @property {string} mode          'keyword' (built-in), 'recall' (Hindsight), or the driver's own word
 * @property {FindHit[]} results    best first; retired records only when `all` is true
 * @property {string} [answer]      with { reflect: true }: the synthesized answer
 * @property {number} [answerMs]    how long the synthesized answer took
 *
 * @typedef {object} TextDocument   the current focus or the glossary
 * @property {string} text          '' when there is none yet
 * @property {string|null} version  null when there is none yet
 *
 * @typedef {object} MemoryStatus
 * @property {string} backend
 * @property {string} location      where the memory lives, in words
 * @property {string|null} lastSave ISO 8601 time of the last write, or null
 * @property {string|null} [lastExport] ISO 8601 time of the last `toolkit memory export`, when the backend records it
 * @property {{ total: number, current: number, 'needs-review': number, retired: number,
 *              byType: Object<string, number> }} counts   byType counts records that are not retired
 * @property {boolean} healthy
 * @property {string} detail        one plain sentence
 * @property {Array<{ where: string, problem: string }>} problems
 *
 * @typedef {object} MemoryDriver
 * @property {string} backend       'builtin' | 'hindsight' | 'notion'
 * @property {string} location      where the memory lives, in words
 * @property {(record: MemoryRecord, opts?: { expect?: string }) =>
 *   Promise<{ key: string, version: string, created: boolean, record: StoredRecord }>} save
 *   Create or replace one record. expect: undefined (no check), 'absent' (the key must
 *   not exist yet), or a version from get() (the stored record must still have it).
 *   A stale expect throws ToolkitError INVALID and changes nothing. Reads the record
 *   back and throws ERROR "saved but not verified" when it differs.
 * @property {(key: string) => Promise<StoredRecord|null>} get
 * @property {(query: string, opts?: { reflect?: boolean, limit?: number, type?: string, all?: boolean }) =>
 *   Promise<FindResult>} find
 *   reflect: true asks the backend for a synthesized answer; a backend that cannot
 *   throws ToolkitError UNSUPPORTED (exit 3).
 * @property {(filter?: { type?: string, status?: string }) => Promise<RecordSummary[]>} list
 *   status undefined lists every record that is not retired; 'all' lists every record.
 *   Sorted by RECORD_TYPES order, then key.
 * @property {(key: string, opts?: { supersededBy?: string, reason?: string }) =>
 *   Promise<{ key: string, version: string, record: StoredRecord }>} retire
 *   Sets status retired (and superseded_by). Can be undone with restore().
 * @property {(key: string) => Promise<{ key: string, version: string, record: StoredRecord }>} restore
 *   Sets status needs-review and clears superseded_by.
 * @property {(key: string) => Promise<{ key: string, deleted: true }>} delete
 *   Removes the record for good. The command refuses to call it without --owner-approved.
 * @property {() => Promise<TextDocument>} focusGet
 * @property {(markdown: string, opts?: { expect?: string }) => Promise<{ version: string, lines: number }>} focusSet
 *   The command checks the text with assertValidFocus() first; drivers check again.
 * @property {() => Promise<TextDocument>} glossaryGet
 * @property {(markdown: string, opts?: { expect?: string }) => Promise<{ version: string }>} glossarySet
 * @property {() => Promise<{ count: number, changed: number, detail: string }>} reindex
 *   Rebuilds whatever index the backend keeps (built-in: .memory/MEMORY.md).
 * @property {() => Promise<MemoryStatus>} status
 * @property {(dir: string) => Promise<void>} [markExport]
 *   Optional. Called after `toolkit memory export` so status() can report the last export.
 *   The built-in and Hindsight drivers have it.
 *
 * Errors: a missing record throws ToolkitError ERROR (exit 1) with details.key;
 * a rule broken by the input throws INVALID (exit 2); an unreachable backend
 * throws ERROR with a `fix` naming the command that checks it.
 */

export const MEMORY_BACKENDS = Object.freeze(['builtin', 'hindsight', 'notion']);
export const RECORD_TYPES = Object.freeze(['user', 'feedback', 'project', 'reference', 'event']);
export const RECORD_STATUSES = Object.freeze(['current', 'needs-review', 'retired']);
export const FRONTMATTER_ORDER = Object.freeze([
  'name', 'type', 'description', 'status', 'superseded_by', 'source', 'saved', 'last_verified', 'approved_by',
]);
export const NAME_MAX = 60;
export const DESCRIPTION_MAX = 150;
export const KEY_RE = /^(user|feedback|project|reference|event)_[a-z0-9]+(?:_[a-z0-9]+)*$/;
export const NAME_RE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

/** The four sections of the current focus, in order (ARCHITECTURE section 7). */
export const FOCUS_SECTIONS = Object.freeze(['Now', 'Waiting on the owner', 'Untracked to-dos', 'Next session starts with']);
export const FOCUS_MAX_LINES = 50;
/** Fixed ids of the two documents that are not records (Hindsight document ids). */
export const FOCUS_ID = 'focus';
export const GLOSSARY_ID = 'glossary';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- keys

/** The key for a type and a name: keyFor('feedback', 'deploy-window') -> 'feedback_deploy_window'. */
export function keyFor(type, name) {
  return `${type}_${String(name).replace(/-/g, '_')}`;
}

/** { type, name } for a key, or null when the key is not valid. */
/**
 * The stored spelling of a key. Accepts the spellings an agent is likely to
 * type and returns the one the backends store: lower case, `_` after the
 * type, and `_` for every `-` in the slug. 'feedback_no-force-push' and
 * 'feedback-no-force-push' both give 'feedback_no_force_push'.
 * Anything that does not start with a record type is returned trimmed, as is.
 */
export function canonicalKey(key) {
  const k = String(key ?? '').trim();
  const m = /^(user|feedback|project|reference|event)[_-](.+)$/i.exec(k);
  return m ? `${m[1].toLowerCase()}_${m[2].toLowerCase().replace(/-/g, '_')}` : k;
}

export function splitKey(key) {
  const k = String(key ?? '');
  if (!KEY_RE.test(k)) return null;
  const cut = k.indexOf('_');
  return { type: k.slice(0, cut), name: k.slice(cut + 1).replace(/_/g, '-') };
}

export function isValidKey(key) {
  return KEY_RE.test(String(key ?? '')) && String(key).length <= 'reference_'.length + NAME_MAX;
}

/**
 * Throws INVALID unless the key is `<type>_<slug>`. Returns the stored
 * spelling (see canonicalKey), so a key typed with dashes finds the record.
 */
export function assertKey(key) {
  const k = canonicalKey(key);
  if (!isValidKey(k)) {
    throw new ToolkitError(EXIT.INVALID, `"${k}" is not a memory key. A key is <type>_<slug>, for example feedback_deploy_window, where type is one of ${RECORD_TYPES.join(', ')}.`, {
      key: k,
      fix: 'Run toolkit memory list to see the keys.',
    });
  }
  return k;
}

/**
 * Turn free text into a record name: lower case, letters, digits, and single
 * dashes. It is never shortened: a name longer than NAME_MAX is refused by
 * validateRecord, because two long names cut to the same length could give
 * the same key and the second save would replace the first record.
 */
export function normalizeName(text) {
  return slugify(String(text ?? '').replace(/_/g, '-'), 10000);
}

export function notFound(key, where) {
  return new ToolkitError(EXIT.ERROR, `There is no memory record with the key ${key}${where ? ` in ${where}` : ''}.`, {
    key,
    fix: 'Run toolkit memory list --status all to see the keys.',
  });
}

// ---------------------------------------------------------------- records

function oneLine(value) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

function nullable(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s === '' || s.toLowerCase() === 'none' || s.toLowerCase() === 'null' ? null : s;
}

/**
 * Fill in defaults and tidy a record given by a caller. Does not validate.
 * name is normalized; key is computed from type and name (or name from key).
 * Defaults: status current, superseded_by null, saved today, last_verified today,
 * approved_by null.
 */
export function normalizeRecord(input, { today = localToday() } = {}) {
  const src = input && typeof input === 'object' ? input : {};
  let type = oneLine(src.type).toLowerCase();
  let name = src.name !== undefined && src.name !== null && String(src.name).trim() !== '' ? normalizeName(src.name) : '';
  const givenKey = canonicalKey(oneLine(src.key));
  if ((!type || !name) && givenKey) {
    const parts = splitKey(givenKey);
    if (parts) {
      if (!type) type = parts.type;
      if (!name) name = parts.name;
    }
  }
  const record = {
    key: type && name ? keyFor(type, name) : givenKey,
    name,
    type,
    description: oneLine(src.description),
    status: oneLine(src.status || 'current').toLowerCase(),
    superseded_by: canonicalOrNull(nullable(src.superseded_by ?? src.supersededBy)),
    source: oneLine(src.source),
    saved: oneLine(src.saved) || today,
    last_verified: oneLine(src.last_verified ?? src.lastVerified) || today,
    approved_by: nullable(src.approved_by ?? src.approvedBy),
    body: normalizeBody(src.body),
  };
  if (src.extra && typeof src.extra === 'object' && Object.keys(src.extra).length) record.extra = { ...src.extra };
  return record;
}

function canonicalOrNull(value) {
  return value === null ? null : canonicalKey(value);
}

function normalizeBody(body) {
  const text = body === undefined || body === null ? '' : String(body).replace(/\r\n/g, '\n');
  const trimmed = text.replace(/^\s*\n/, '').replace(/\s+$/, '');
  return trimmed ? `${trimmed}\n` : '';
}

/** True when a value is only a template placeholder such as `<Person and date>`. */
export function isPlaceholder(value) {
  const s = String(value ?? '').trim().replace(/^`(.*)`$/, '$1').trim();
  return /^<[^<>]*>$/.test(s);
}

/**
 * Every rule a record breaks, as plain sentences. [] means valid.
 * Only the description is measured for length (never the key or file name),
 * and a `<` in a value is not treated as a placeholder unless the whole value
 * is one, such as `<Person and date>`.
 */
export function validateRecord(record) {
  const r = record || {};
  const problems = [];
  if (!RECORD_TYPES.includes(r.type)) problems.push(`type must be one of ${RECORD_TYPES.join(', ')} (got "${r.type ?? ''}").`);
  if (!r.name) problems.push('name is missing. Give a short slug such as deploy-window.');
  else if (!NAME_RE.test(r.name)) problems.push(`name "${r.name}" must be lower-case letters and digits joined by single dashes.`);
  else if (r.name.length > NAME_MAX) problems.push(`name is ${r.name.length} characters; the limit is ${NAME_MAX}. Give a shorter name; it is not cut, so two long names never become one key.`);
  if (RECORD_TYPES.includes(r.type) && r.name && NAME_RE.test(r.name) && r.key !== keyFor(r.type, r.name)) {
    problems.push(`key "${r.key}" does not match type and name; it should be ${keyFor(r.type, r.name)}.`);
  }
  if (!r.description) problems.push('description is missing. Give one line that says what the record is about.');
  else if (/\n/.test(r.description)) problems.push('description must be one line.');
  else if (r.description.length > DESCRIPTION_MAX) problems.push(`description is ${r.description.length} characters; the limit is ${DESCRIPTION_MAX}.`);
  else if (isPlaceholder(r.description)) problems.push('description is still a template placeholder.');
  if (!RECORD_STATUSES.includes(r.status)) problems.push(`status must be one of ${RECORD_STATUSES.join(', ')} (got "${r.status ?? ''}").`);
  if (r.superseded_by !== null && r.superseded_by !== undefined) {
    if (!isValidKey(r.superseded_by)) problems.push(`superseded_by "${r.superseded_by}" is not a memory key.`);
    else if (r.superseded_by === r.key) problems.push('a record cannot be superseded by itself.');
    else if (r.status !== 'retired') problems.push('superseded_by is set, but only a retired record can be superseded.');
  }
  if (!r.source) problems.push('source is missing. Say who or what said it, with a date.');
  else if (isPlaceholder(r.source)) problems.push('source is still a template placeholder. Say who or what said it, with a date.');
  else if (EMAIL_RE.test(r.source)) problems.push('source contains an email address. Use the person\'s name only.');
  if (!DATE_RE.test(String(r.saved ?? ''))) problems.push(`saved must be a date in the form YYYY-MM-DD (got "${r.saved ?? ''}").`);
  if (!(DATE_RE.test(String(r.last_verified ?? '')) || r.last_verified === 'unknown')) {
    problems.push(`last_verified must be a date in the form YYYY-MM-DD, or unknown (got "${r.last_verified ?? ''}").`);
  }
  if (r.approved_by !== null && r.approved_by !== undefined && EMAIL_RE.test(String(r.approved_by))) {
    problems.push('approved_by contains an email address. Use the person\'s name only.');
  }
  const body = String(r.body ?? '');
  if (!body.trim()) problems.push('body is empty. Write at least the Remember line.');
  else {
    const label = /^\s*\*\*[^*\n]+:\*\*\s*`?<[^<>\n]+>`?\s*$/m.exec(body);
    if (label) problems.push(`body still has a template placeholder: ${label[0].trim()}`);
  }
  return problems;
}

/** Problems as one text: each starts with a capital letter; joined by spaces. */
export function sentences(problems) {
  return problems.map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p)).join(' ');
}

/** Throws INVALID listing every problem, or returns the record. */
export function assertValidRecord(record) {
  const problems = validateRecord(record);
  if (problems.length) {
    const key = record && record.key ? ` ${record.key}` : '';
    throw new ToolkitError(EXIT.INVALID, `The memory record${key} was not saved. ${sentences(problems)}`, {
      key: record ? record.key : undefined,
      problems,
    });
  }
  return record;
}

/**
 * The stored text of a record: frontmatter in FRONTMATTER_ORDER (then any
 * keys in record.extra), a blank line, the body.
 */
export function serializeRecord(record) {
  const r = record;
  const data = {};
  for (const field of FRONTMATTER_ORDER) {
    let value = r[field];
    if (field === 'superseded_by') value = value || 'none';
    if (field === 'approved_by' && (value === null || value === undefined || value === '')) continue;
    data[field] = value === undefined || value === null ? '' : String(value);
  }
  if (r.extra && typeof r.extra === 'object') {
    for (const [k, v] of Object.entries(r.extra)) {
      if (!FRONTMATTER_ORDER.includes(k) && k !== 'key' && v !== undefined) data[k] = v;
    }
  }
  const body = normalizeBody(r.body);
  return stringifyFrontmatter(data, `\n${body}`);
}

/**
 * Read stored record text. Returns { record, problems }: problems lists rule
 * breaks (and a frontmatter that cannot be read); record holds whatever could
 * be read, with body = the whole text when there is no frontmatter.
 * Unknown frontmatter keys are kept in record.extra.
 */
export function parseRecord(text, key) {
  const problems = [];
  let data = {};
  let body = String(text ?? '');
  try {
    const parsed = parseFrontmatter(text);
    if (parsed.hasFrontmatter) {
      data = parsed.data || {};
      body = parsed.body;
    } else {
      problems.push('it has no frontmatter.');
    }
  } catch (err) {
    problems.push(`its frontmatter cannot be read: ${err.message}`);
  }
  const parts = splitKey(key);
  const str = (v) => (v === undefined || v === null ? '' : String(v));
  const record = {
    key: str(key),
    name: str(data.name) || (parts ? parts.name : ''),
    type: str(data.type) || (parts ? parts.type : ''),
    description: str(data.description),
    status: str(data.status),
    superseded_by: nullable(data.superseded_by),
    source: str(data.source),
    saved: str(data.saved),
    last_verified: str(data.last_verified),
    approved_by: nullable(data.approved_by),
    body: normalizeBody(body),
  };
  const extra = {};
  for (const [k, v] of Object.entries(data)) if (!FRONTMATTER_ORDER.includes(k)) extra[k] = v;
  if (Object.keys(extra).length) record.extra = extra;
  if (parts && record.type && parts.type !== record.type) {
    problems.push(`type "${record.type}" does not match the key ${key}.`);
  }
  for (const p of validateRecord(record)) if (!problems.includes(p)) problems.push(p);
  return { record, problems };
}

/**
 * Change the status of stored record text and return the new text. Keeps
 * every other frontmatter line as it was. status: 'retired' or
 * 'needs-review'; supersededBy: a key or null; note: a line added to the end
 * of the body ('' for none). Throws INVALID when the frontmatter cannot be read.
 */
export function changeRecordStatus(text, { status, supersededBy = null, note = '' }, key = '') {
  let parsed;
  try {
    parsed = parseFrontmatter(text);
  } catch (err) {
    throw new ToolkitError(EXIT.INVALID, `The memory record ${key} has frontmatter that cannot be read, so its status was not changed: ${err.message}`, {
      key,
      fix: 'Save the record again with toolkit memory save.',
    });
  }
  if (!parsed.hasFrontmatter) {
    throw new ToolkitError(EXIT.INVALID, `The memory record ${key} has no frontmatter, so its status was not changed.`, {
      key,
      fix: 'Save the record again with toolkit memory save.',
    });
  }
  const data = parsed.data;
  data.status = status;
  data.superseded_by = supersededBy || 'none';
  let body = parsed.body;
  if (note) body = `${body.replace(/\s+$/, '')}\n\n${note}\n`;
  return stringifyFrontmatter(data, body);
}

/** The dated line added to a record's body when it is retired. '' when there is nothing to say. */
export function retireNote(day, { reason, supersededBy } = {}) {
  const words = [reason ? String(reason).replace(/\s+/g, ' ').trim() : '', supersededBy ? `Replaced by ${supersededBy}.` : '']
    .filter(Boolean).join(' ');
  return words ? `**Retired ${day}:** ${words}` : '';
}

/** The dated line added to a record's body when it is restored. */
export function restoreNote(day) {
  return `**Restored ${day}:** check that this is still true.`;
}

/** A record without its body. */
export function recordSummary(record) {
  return {
    key: record.key,
    name: record.name,
    type: record.type,
    description: record.description,
    status: record.status,
    superseded_by: record.superseded_by ?? null,
    source: record.source,
    saved: record.saved,
    last_verified: record.last_verified,
    approved_by: record.approved_by ?? null,
  };
}

/** The version of stored text: its SHA-256. Built-in and Hindsight both use this. */
export function versionOf(text) {
  return sha256(String(text ?? ''));
}

/**
 * Refuse a stale write. current = the stored version or null when absent;
 * expect = undefined (no check), 'absent', or a version.
 */
export function checkExpect(current, expect, what) {
  if (expect === undefined || expect === null || expect === '') return;
  const label = what || 'the record';
  if (expect === 'absent') {
    if (current !== null && current !== undefined) {
      throw new ToolkitError(EXIT.INVALID, `${label} already exists, so it was not saved (--expect absent).`, {
        expected: 'absent',
        current,
        fix: 'Read it with toolkit memory get, then save with --expect <version> to replace it.',
      });
    }
    return;
  }
  if (current === null || current === undefined) {
    throw new ToolkitError(EXIT.INVALID, `${label} no longer exists, so it was not saved (--expect ${String(expect).slice(0, 12)}).`, {
      expected: expect,
      current: null,
    });
  }
  const want = String(expect);
  const ok = want.length >= 8 && String(current).startsWith(want);
  if (!ok) {
    throw new ToolkitError(EXIT.INVALID, `${label} changed since it was read, so it was not saved.`, {
      expected: want,
      current,
      fix: 'Read it again with toolkit memory get and redo the change.',
    });
  }
}

/** Sort summaries by type order, then key. */
export function sortRecords(list) {
  const order = (t) => {
    const i = RECORD_TYPES.indexOf(t);
    return i === -1 ? RECORD_TYPES.length : i;
  };
  return [...list].sort((a, b) => order(a.type) - order(b.type) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

/** Apply the list filter every driver shares. */
export function matchesFilter(summary, { type, status } = {}) {
  if (type && summary.type !== type) return false;
  if (status === undefined || status === null || status === '') return summary.status !== 'retired';
  if (status === 'all') return true;
  return summary.status === status;
}

/** Throws INVALID when a list filter names an unknown type or status. */
export function assertFilter({ type, status } = {}) {
  if (type && !RECORD_TYPES.includes(type)) {
    throw new ToolkitError(EXIT.INVALID, `--type must be one of ${RECORD_TYPES.join(', ')}.`);
  }
  if (status && status !== 'all' && !RECORD_STATUSES.includes(status)) {
    throw new ToolkitError(EXIT.INVALID, `--status must be one of ${RECORD_STATUSES.join(', ')}, or all.`);
  }
}

/** Empty counts object. */
export function emptyCounts() {
  const byType = {};
  for (const t of RECORD_TYPES) byType[t] = 0;
  return { total: 0, current: 0, 'needs-review': 0, retired: 0, byType };
}

/** Counts for a list of summaries (every status). */
export function countRecords(list) {
  const counts = emptyCounts();
  for (const r of list) {
    counts.total++;
    if (Object.prototype.hasOwnProperty.call(counts, r.status)) counts[r.status]++;
    if (r.status !== 'retired' && Object.prototype.hasOwnProperty.call(counts.byType, r.type)) counts.byType[r.type]++;
  }
  return counts;
}

// ---------------------------------------------------------------- keyword search

const STOP_WORDS = new Set(('a an and are as at be but by do does did for from has have how i in is it its of on or '
  + 'so that the this to was we what when where which who why will with you your our did about into').split(' '));

/** Lower-case search words of two or more characters, without common words. */
export function searchTerms(query) {
  const words = String(query ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/).filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
  return [...new Set(words)];
}

/**
 * Keyword score of one record for a list of terms: 3 per term in the key or
 * name, 2 in the description, 1 per body occurrence (at most 3 per term).
 * Returns { score, snippet }.
 */
export function keywordScore(record, terms) {
  if (!terms.length) return { score: 0, snippet: '' };
  const keyText = `${record.key} ${record.name}`.toLowerCase().replace(/[_-]/g, ' ');
  const desc = String(record.description || '').toLowerCase();
  const body = String(record.body || '').toLowerCase();
  let score = 0;
  let firstHit = -1;
  for (const term of terms) {
    const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    if (re.test(keyText)) score += 3;
    re.lastIndex = 0;
    if (re.test(desc)) score += 2;
    re.lastIndex = 0;
    let n = 0;
    let m;
    while ((m = re.exec(body)) && n < 3) {
      if (firstHit === -1 || m.index < firstHit) firstHit = m.index;
      n++;
    }
    score += n;
  }
  return { score, snippet: snippetAround(String(record.body || ''), firstHit) };
}

/** About 160 characters of text around a position, on one line. */
export function snippetAround(text, index, width = 160) {
  const flat = String(text ?? '');
  if (!flat) return '';
  const start = index > 40 ? index - 40 : 0;
  let piece = flat.slice(start, start + width).replace(/\s+/g, ' ').trim();
  if (start > 0) piece = `...${piece}`;
  if (start + width < flat.length) piece = `${piece}...`;
  return piece;
}

/** The body of stored text without its frontmatter, for snippets. */
export function stripFrontmatter(text) {
  const s = String(text ?? '');
  const m = /^---[ \t]*\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/.exec(s);
  return m ? s.slice(m[0].length) : s;
}

// ---------------------------------------------------------------- focus and glossary

function countLines(text) {
  const t = String(text ?? '').replace(/\s+$/, '');
  return t ? t.split(/\r?\n/).length : 0;
}

/**
 * Rules for the current focus: the four FOCUS_SECTIONS as `##` headings (any
 * order, matched without regard to case), no other `##` sections, at most
 * FOCUS_MAX_LINES lines. A `<` anywhere is fine. Returns problems ([] = valid).
 */
export function validateFocus(markdown) {
  const text = String(markdown ?? '');
  const problems = [];
  if (!text.trim()) return ['the current focus is empty.'];
  const lines = countLines(text);
  if (lines > FOCUS_MAX_LINES) problems.push(`the current focus has ${lines} lines; the limit is ${FOCUS_MAX_LINES}. Move finished or tracked items out.`);
  const sections = flattenSections(splitSections(text)).filter((s) => s.level === 2);
  const found = new Set(sections.map((s) => normalizeHeading(s.heading)));
  const wanted = FOCUS_SECTIONS.map((h) => normalizeHeading(h));
  const missing = FOCUS_SECTIONS.filter((h, i) => !found.has(wanted[i]));
  if (missing.length) problems.push(`the current focus needs these ## sections: ${missing.join(', ')}.`);
  const extra = sections.filter((s) => !wanted.includes(normalizeHeading(s.heading))).map((s) => s.heading);
  if (extra.length) problems.push(`the current focus has sections that do not belong there: ${extra.join(', ')}. It has only ${FOCUS_SECTIONS.join(', ')}.`);
  return problems;
}

export function assertValidFocus(markdown) {
  const problems = validateFocus(markdown);
  if (problems.length) {
    throw new ToolkitError(EXIT.INVALID, `The current focus was not saved. ${sentences(problems)}`, { problems });
  }
  return markdown;
}

/** Rules for the glossary: not empty. */
export function validateGlossary(markdown) {
  return String(markdown ?? '').trim() ? [] : ['the glossary is empty.'];
}

export function assertValidGlossary(markdown) {
  const problems = validateGlossary(markdown);
  if (problems.length) throw new ToolkitError(EXIT.INVALID, `The glossary was not saved. ${sentences(problems)}`, { problems });
  return markdown;
}

/** Normalize document text for storage: LF line ends, one final newline. */
export function normalizeDocument(markdown) {
  const text = String(markdown ?? '').replace(/\r\n/g, '\n').replace(/\s+$/, '');
  return text ? `${text}\n` : '';
}

export function focusLineCount(markdown) {
  return countLines(markdown);
}

// ---------------------------------------------------------------- driver loading

/** The file a backend's driver lives in. */
export function driverFile(type, dir = HERE) {
  return path.join(dir, `${type}.mjs`);
}

/**
 * Load and create the driver for a project.
 * project = { root, mainRoot, config } from requireProject().
 * options = { env, fetch, now, timeoutMs, signal } (see the top of this file),
 * and driversDir for tests (it replaces lib/memory/).
 * Throws INVALID for an unknown memory.type and UNSUPPORTED (exit 3) when the
 * driver file is not installed.
 */
export async function loadDriver(project, options = {}) {
  const config = (project && project.config) || {};
  const type = (config.memory && config.memory.type) || 'builtin';
  if (!MEMORY_BACKENDS.includes(type)) {
    throw new ToolkitError(EXIT.INVALID, `.toolkit.json says memory.type is "${type}"; it must be one of ${MEMORY_BACKENDS.join(', ')}.`, {
      fix: 'Run toolkit config set memory.type builtin (or hindsight, or notion).',
    });
  }
  const file = driverFile(type, options.driversDir || HERE);
  if (!fs.existsSync(file)) {
    throw new ToolkitError(EXIT.UNSUPPORTED, `The ${type} memory driver is not installed in this copy of the toolkit (${file} is missing).`, {
      backend: type,
      fix: 'Update the toolkit plugin, or switch memory.type in .toolkit.json.',
    });
  }
  const mod = await import(pathToFileURL(file).href);
  if (typeof mod.createDriver !== 'function') {
    throw new ToolkitError(EXIT.UNSUPPORTED, `The ${type} memory driver does not export createDriver.`, { backend: type, file });
  }
  const driver = await mod.createDriver({
    root: project.root,
    mainRoot: project.mainRoot || project.root,
    config,
    env: options.env || process.env,
    fetch: options.fetch || globalThis.fetch,
    now: options.now || (() => new Date()),
    timeoutMs: options.timeoutMs,
    signal: options.signal,
  });
  if (!driver.backend) driver.backend = type;
  return driver;
}

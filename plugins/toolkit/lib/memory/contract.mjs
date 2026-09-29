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
//   notion    -> lib/memory/notion.mjs      (the Memories database on the project's
//                                            Notion Memory page, in Lore's layout)
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
 * @property {string} saved          YYYY-MM-DD of the latest save, or '' when the backend does not know it.
 *                                   The stored `updated` date when the record has one; otherwise the
 *                                   built-in driver takes it from the file's change time, Hindsight and
 *                                   Notion from their own fields.
 * @property {string} [updated]      YYYY-MM-DD of the last change, stored in the frontmatter (concept
 *                                   memory: the index shows it). Every save sets it; a link repair keeps it.
 * @property {string} [title]        the body's "# Title" line (summaries only; see recordSummary)
 * @property {string} last_verified  YYYY-MM-DD, or `unknown`
 * @property {string} authorization  what allowed the save, in the model's words: "Approved by Mike on
 *                                   2026-09-26", "Trusted grant", or the owner's explicit request
 * @property {string|null} [approved_by]  who approved the save: the name in "Approved by <name> on <date>"
 * @property {string[]} [supersedes] keys of the records this one replaced ([] for none)
 * @property {object} [metadata]     the `metadata:` map when it holds more than `type` (kept as it was)
 * @property {object} [extra]        every other frontmatter key, kept as it was
 * @property {string} body           Markdown after the frontmatter, in the model's topic format:
 *                                   "# <Title>", then one "## <Sub-topic>" section per fact or group
 *                                   of facts (concept memory; lib/memory/concepts.mjs), each with
 *                                   **Remember:**, **Why:**, **How to apply:**, **Evidence and limits:**,
 *                                   **Related memories:**, **Authoritative records:**. A record written
 *                                   before concept memory has the labels with no "##" section.
 *
 * The stored form of a record is serializeRecord(record): the model project's
 * topic template YAML (.memory/project_topic_template.md), then the body:
 *
 *   ---
 *   name: <key>                      the file name without .md
 *   description: <one line>          the concept's one-line summary
 *   updated: <YYYY-MM-DD>            the date of the last change (concept memory)
 *   metadata:
 *     type: <type>
 *   status: <current | needs-review | superseded | archived>
 *   source: <who or what, with a date>
 *   last_verified: <YYYY-MM-DD or unknown>
 *   authorization: <what allowed the save>
 *   supersedes: <none, a key, or [key, key]>
 *   ...any other keys, kept
 *   ---
 *
 * Status words: the contract's `retired` is stored `superseded` or `archived`,
 * and a record keeps the word it was stored with (record.stored_status), so a
 * note written by hand with `status: superseded` stays superseded. `retire
 * --superseded-by` writes `superseded` and a "**Superseded <date>:** Replaced
 * by [<key>](<key>.md)." line under the title, which is where superseded_by is
 * read from; `retire` alone writes `archived` and a "**Archived <date>:**"
 * line. A superseded record stays beside the current ones; an archived record
 * lives in `archive/`, so its own links to other notes start with `../`.
 * Files in the older toolkit format (type, saved, superseded_by, approved_by
 * at the top level) are still read; the next write stores the model format.
 *
 * The key is the file name (built-in), the document id (Hindsight), or the Key
 * property (Notion). A driver that stores the text must store exactly this
 * text, so a read gives back the same bytes.
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
 * @property {string} stored_status the status word as stored: current, needs-review, superseded, or archived
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
 * @property {FindHit[]} [maybe]    recall only: records that may be about the question; read before answering
 * @property {FindHit[]} [closest]  recall only: other records ranked closest; not known to be about it
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
 * @property {(query: string, opts?: { reflect?: boolean, limit?: number, type?: string, all?: boolean, proposals?: boolean }) =>
 *   Promise<FindResult>} find
 *   reflect: true asks the backend for a synthesized answer; a backend that cannot
 *   throws ToolkitError UNSUPPORTED (exit 3). Saved proposals (isProposal) are
 *   left out unless proposals or all is true; keyword backends count them in
 *   proposalsLeftOut. Hindsight also gives `maybe`: records that may be about the
 *   question and must be read before any answer; and `closest`: records recall
 *   ranked closest that are not known to be about it (never presented as an answer).
 * @property {(filter?: { type?: string, status?: string }) => Promise<RecordSummary[]>} list
 *   status undefined lists every record that is not retired; 'all' lists every record.
 *   Sorted by RECORD_TYPES order, then key.
 * Link repair results: linksRepaired names the notes changed. Hindsight and
 * Notion also give linksFailed ([{ key, reason }], notes that could not be
 * saved; the others are still repaired) and reformatted (notes also written in
 * the model's topic format) when these are not empty. See repairLinksWithDriver().
 * @property {(key: string, opts?: { supersededBy?: string, reason?: string }) =>
 *   Promise<{ key: string, version: string, record: StoredRecord, linksRepaired: string[] }>} retire
 *   Sets status retired: `superseded` with supersededBy (the replacement's `supersedes`
 *   gains this key), `archived` without. Links in other notes are repaired: to the
 *   replacement, or to plain text with "(archived)". Can be undone with restore().
 * @property {(key: string) => Promise<{ key: string, version: string, record: StoredRecord }>} restore
 *   Sets status needs-review and clears superseded_by.
 * @property {(key: string, toKey: string) =>
 *   Promise<{ key: string, from: string, version: string, record: StoredRecord, linksRepaired: string[] }>} rename
 *   Gives a record a new key (the type may change too) and points every link and
 *   `supersedes` entry that named the old key at the new one.
 * @property {(key: string) => Promise<{ key: string, deleted: true, linksRepaired: string[] }>} delete
 *   Removes the record for good; links to it become plain text. The command refuses
 *   to call it without --owner-approved.
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
/** The status words written in a stored record (the model's words). */
export const STORED_STATUSES = Object.freeze(['current', 'needs-review', 'superseded', 'archived']);
/**
 * The model topic template's frontmatter keys, in the order they are written.
 * `updated` (concept memory, Mike 2026-09-28) sits under the one-line summary,
 * so the top of a file gives its summary and the date of its last change.
 */
export const FRONTMATTER_ORDER = Object.freeze([
  'name', 'description', 'updated', 'metadata', 'status', 'source', 'last_verified', 'authorization', 'supersedes',
]);
/** Keys of the older toolkit record format, still read. */
export const LEGACY_FIELDS = Object.freeze(['type', 'superseded_by', 'saved', 'approved_by']);
/** Every frontmatter key the toolkit reads itself; any other key is kept in record.extra. */
export const KNOWN_FIELDS = Object.freeze([...FRONTMATTER_ORDER, ...LEGACY_FIELDS]);
/** The bold labels of a topic body, in the model's order. */
export const TOPIC_LABELS = Object.freeze(['Remember', 'Why', 'How to apply', 'Evidence and limits', 'Related memories', 'Authoritative records']);
/** The authorization written when a save names no approver and no grant. */
export const NO_AUTHORIZATION = 'No approval recorded';
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

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** The authorization text for an approver: "Approved by Mike on 2026-09-26". */
export function approvalText(who, day) {
  return `Approved by ${oneLine(who)} on ${day}`;
}

/** The approver named in an authorization text ("Approved by <name>[ on <date>]"), or null. */
export function approverFrom(authorization) {
  const m = /^approved by\s+(.+?)(?:,?\s+on\s+\d{4}-\d{2}-\d{2})?\.?$/i.exec(oneLine(authorization));
  return m ? m[1].trim() : null;
}

// ---------------------------------------------------------------- approval of one fact in a concept
//
// Concept memory (verifier, 2026-09-28): a concept's `authorization` line is
// the approval of the concept, and a save of one section never rewrites it.
// A section whose approval differs from the concept's carries its own note on
// its "**Evidence and limits:**" line, the way --source is recorded:
// "Approved by Mike on 2026-09-28." or "Saved on 2026-09-28 with no approval
// recorded." A section with no note has the concept's approval.

/** The note for a section saved with no approval, in a concept that has one. */
export function unapprovedNote(day) {
  return `Saved on ${day} with no approval recorded.`;
}

/** Finds unapprovedNote() text in a section, with the space before it. */
export const UNAPPROVED_NOTE_RE = /[ \t]*Saved on \d{4}-\d{2}-\d{2} with no approval recorded\./g;

/** Who or what an authorization names, for comparing: 'mike rihm', 'no approval recorded', 'trusted grant'. */
function approvalWho(authorization) {
  const a = oneLine(authorization) || NO_AUTHORIZATION;
  const who = approverFrom(a);
  return (who || a.replace(/,?\s+on\s+\d{4}-\d{2}-\d{2}\.?$/i, '')).replace(/[.\s]+$/, '').toLowerCase();
}

/** True when two authorizations name the same approver ("Mike" and "Mike Rihm" count as the same). */
export function sameApproval(a, b) {
  const x = approvalWho(a);
  const y = approvalWho(b);
  if (x === y) return true;
  if (!approverFrom(a) || !approverFrom(b)) return false;
  return `${y} `.startsWith(`${x} `) || `${x} `.startsWith(`${y} `);
}

/**
 * The approval note for one section of a concept: null when the save's
 * authorization is the concept's own (the concept's line covers it) or a
 * proposal's; otherwise "Approved by <name> on <date>.", "Saved on <date>
 * with no approval recorded.", or the authorization text with the date.
 */
export function approvalNote(authorization, conceptAuthorization, day) {
  const a = oneLine(authorization) || NO_AUTHORIZATION;
  if (isProposalAuthorization(a) || sameApproval(a, conceptAuthorization)) return null;
  if (a === NO_AUTHORIZATION) return unapprovedNote(day);
  const text = a.replace(/[.\s]+$/, '');
  return /\d{4}-\d{2}-\d{2}/.test(text) ? `${text}.` : `${text} on ${day}.`;
}

/**
 * The keys a `supersedes` value names, canonical and without repeats: 'none',
 * '', a key, 'a, b', or a list all work. Returns [] for none.
 */
export function supersedesList(value) {
  const raw = Array.isArray(value) ? value : value === undefined || value === null ? [] : String(value).split(',');
  const out = [];
  for (const v of raw) {
    const k = nullable(v);
    if (!k) continue;
    const c = canonicalKey(k);
    if (!out.includes(c)) out.push(c);
  }
  return out;
}

/** The stored `supersedes` value: 'none', one key, or a list of keys. */
function supersedesValue(list) {
  const keys = supersedesList(list);
  if (!keys.length) return 'none';
  return keys.length === 1 ? keys[0] : keys;
}

const RETIRED_WORDS = Object.freeze(['superseded', 'archived']);

/**
 * The status word written in the file for a contract record. A retired record
 * keeps the word it was stored with (`superseded` or `archived`, as read into
 * record.stored_status or given as the status). Only the older word `retired`,
 * or no word, is decided from the record: superseded when it names its
 * replacement (superseded_by) or its newest dated note is a "**Superseded**"
 * line, archived otherwise.
 */
export function storedStatus(record) {
  const r = record || {};
  if (r.status !== 'retired') return r.status;
  const word = String(r.stored_status ?? '').trim().toLowerCase();
  if (RETIRED_WORDS.includes(word)) return word;
  if (r.superseded_by) return 'superseded';
  return latestStatusNote(r.body) === 'superseded' ? 'superseded' : 'archived';
}

const STATUS_NOTE_RE = /^\s*\*\*(Superseded|Archived|Restored) \d{4}-\d{2}-\d{2}:\*\*/m;

/**
 * The kind of the newest dated status note in a body ('superseded', 'archived',
 * 'restored'), or null. Notes are put under the title, so the first one in the
 * text is the newest.
 */
export function latestStatusNote(body) {
  const m = STATUS_NOTE_RE.exec(String(body ?? ''));
  return m ? m[1].toLowerCase() : null;
}

/** The contract status for a status word read from a file. 'template' stays as it is (a seed, not a record). */
export function contractStatus(word) {
  const w = oneLine(word).toLowerCase();
  if (w === 'superseded' || w === 'archived' || w === 'retired') return 'retired';
  return w;
}

/** A title from a record name: 'account-data-model' -> 'Account data model'. */
export function titleFromName(name) {
  const words = String(name ?? '').replace(/[-_]+/g, ' ').trim();
  return words ? words[0].toUpperCase() + words.slice(1) : 'Memory';
}

/** The text of a body's first "# " line (outside fenced code), or null. */
export function bodyTitle(body) {
  let fence = null;
  for (const line of String(body ?? '').split('\n')) {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
      continue;
    }
    if (f) {
      fence = f[1];
      continue;
    }
    const m = /^#[ \t]+(.*\S)[ \t]*$/.exec(line);
    if (m) return m[1].replace(/[ \t]+#+$/, '').trim();
  }
  return null;
}

/**
 * The link anchor for a section heading, the way Obsidian reads a Markdown
 * link to a heading: "#" and the heading, with spaces written %20
 * ("Deploy window" -> "#Deploy%20window"). A bracket, "#", and "%" are
 * written %28, %29, %23, and %25 (verifier, 2026-09-28): a bracket in a link
 * target ended the link for findLinks, so rename and the broken-link check
 * missed it, and a "#" inside the anchor reads as a heading inside a heading
 * ("Grafana (prod) alerts" -> "#Grafana%20%28prod%29%20alerts").
 */
export function headingAnchor(heading) {
  const h = String(heading ?? '').replace(/\s+/g, ' ').trim();
  if (!h) return '';
  return `#${h.replace(/%/g, '%25').replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/#/g, '%23')}`;
}

/** A heading as a link anchor names it, for comparing: '#Deploy%20window' -> 'deploy window'. */
export function anchorHeading(anchor) {
  let a = String(anchor ?? '').replace(/^#/, '');
  try {
    a = decodeURIComponent(a);
  } catch {
    // keep it as written
  }
  return a.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Set `updated` in parsed frontmatter data (from core/frontmatter.mjs parse)
 * to a date. A key that is not there yet goes right under `description`, where
 * serializeRecord writes it. The same object is changed, so every other line
 * keeps its exact text.
 */
export function setUpdated(data, day) {
  if (!data || typeof data !== 'object') return data;
  if (Object.prototype.hasOwnProperty.call(data, 'updated')) {
    data.updated = day;
    return data;
  }
  const keys = Object.keys(data);
  const at = keys.indexOf('description');
  const tail = at === -1 ? keys : keys.slice(at + 1);
  const moved = tail.map((k) => [k, data[k]]);
  for (const [k] of moved) delete data[k];
  data.updated = day;
  for (const [k, v] of moved) data[k] = v;
  return data;
}

const LABEL_LINE_RE = /^\s*\*\*([^*\n]+?):\*\*/gm;

/** The model's label for a word an agent may have written: 'why' -> 'Why', 'related' -> 'Related memories'. */
function canonicalLabel(word) {
  const w = String(word ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
  if (w === 'related') return 'Related memories';
  return TOPIC_LABELS.find((l) => l.toLowerCase() === w) || null;
}

const LABEL_WORDS = '(Remember|Why|How to apply|Evidence and limits|Related memories|Related|Authoritative records)';
const HEADING_LABEL_RE = new RegExp(`^#{2,6}\\s+\\**${LABEL_WORDS}\\**\\s*:?\\s*$`, 'i');
const PLAIN_LABEL_RE = new RegExp(`^${LABEL_WORDS}:[ \\t]*`, 'i');
const OUTSIDE_COLON_RE = new RegExp(`^\\*\\*${LABEL_WORDS}\\*\\*:[ \\t]*`, 'i');
const BOLD_LABEL_RE = new RegExp(`^\\*\\*${LABEL_WORDS}:\\*\\*[ \\t]*`, 'i');

/**
 * Write the six topic labels the way the model's topic template does
 * ("**Why:** ..."), whatever form an agent used: a heading ("## Why"), a plain
 * "Why:" at the start of a line, "**Why**:", or a lower-case word. A label
 * word repeated after the label ("**Remember:** Remember: ...") is written
 * once. Lines inside fenced code blocks are left as they are.
 * (Sample runs a and claude-a, 2026-09-27.)
 */
export function modelLabels(text) {
  const lines = String(text ?? '').split('\n');
  const out = [];
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const f = /^\s*(```|~~~)/.exec(line);
    if (fence) {
      out.push(line);
      if (f && f[1] === fence) fence = null;
      continue;
    }
    if (f) {
      fence = f[1];
      out.push(line);
      continue;
    }
    const heading = HEADING_LABEL_RE.exec(line);
    if (heading) {
      const label = canonicalLabel(heading[1]);
      // The label goes in front of the paragraph under the heading, as the template has it.
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      const next = j < lines.length ? lines[j] : '';
      const nextLabel = BOLD_LABEL_RE.exec(next) || PLAIN_LABEL_RE.exec(next) || OUTSIDE_COLON_RE.exec(next);
      // "## Remember" over "Remember: ..." is one label.
      if (nextLabel && canonicalLabel(nextLabel[1]) === label) {
        i = j - 1;
        continue;
      }
      const own =!next.trim() || /^\s*(#{1,6}\s|[-*+]\s|\d+[.)]\s|\||```|~~~|>|<!--)/.test(next) || BOLD_LABEL_RE.test(next) || PLAIN_LABEL_RE.test(next) || HEADING_LABEL_RE.test(next);
      if (own) {
        out.push(`**${label}:**`);
        continue;
      }
      out.push(`**${label}:** ${stripRepeatedLabel(next.trim(), label)}`);
      i = j;
      continue;
    }
    let m = OUTSIDE_COLON_RE.exec(line) || BOLD_LABEL_RE.exec(line) || PLAIN_LABEL_RE.exec(line);
    if (m) {
      const label = canonicalLabel(m[1]);
      const rest = stripRepeatedLabel(line.slice(m[0].length), label);
      out.push(rest ? `**${label}:** ${rest}` : `**${label}:**`);
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

/** "Remember: text" after a Remember label -> "text". */
function stripRepeatedLabel(rest, label) {
  const m = PLAIN_LABEL_RE.exec(rest) || BOLD_LABEL_RE.exec(rest) || OUTSIDE_COLON_RE.exec(rest);
  if (m && canonicalLabel(m[1]) === label) return rest.slice(m[0].length).trim();
  return rest.trim();
}

/**
 * Put a body in the model's topic format without changing what it says:
 * a "# <Title>" first line when there is no level-1 heading, the six labels
 * written in the template's bold form (modelLabels), "**Remember:**" in front
 * of the first paragraph when the body has no Remember label and that
 * paragraph has no label of its own, and the older "**Related:**" label
 * written "**Related memories:**".
 */
export function topicBody(body, { name } = {}) {
  let text = normalizeBody(body);
  if (!text) return text;
  text = normalizeBody(modelLabels(text));
  text = text.replace(/^(\s*)\*\*Related:\*\*/gm, '$1**Related memories:**');
  const lines = text.split('\n');
  const h1 = lines.findIndex((l) => /^# \S/.test(l));
  const labels = new Set([...text.matchAll(LABEL_LINE_RE)].map((m) => m[1].trim().toLowerCase()));
  if (!labels.has('remember')) {
    // Put "**Remember:**" before the first paragraph that is not a heading or a comment.
    const start = h1 === -1 ? 0 : h1 + 1;
    for (let i = start; i < lines.length; i++) {
      const l = lines[i];
      if (!l.trim() || /^#{1,6}\s/.test(l) || /^\s*<!--/.test(l)) continue;
      if (/^\s*\*\*[^*\n]+:\*\*/.test(l)) break; // some other label: leave it
      lines[i] = `**Remember:** ${l.trim()}`;
      break;
    }
  }
  if (h1 === -1) lines.unshift(`# ${titleFromName(name)}`, '');
  return normalizeBody(lines.join('\n'));
}

/**
 * Fill in defaults and tidy a record given by a caller. Does not validate.
 * name is normalized; key is computed from type and name (or name from key).
 * Defaults: status current, superseded_by null, updated from updated, else
 * saved, else today (saved: the given saved date, else updated), last_verified today,
 * authorization from approved_by ("Approved by <name> on <today>") or
 * NO_AUTHORIZATION, supersedes []. The body is put in the topic format (topicBody).
 * A save through the command sets updated to today; a driver's own rewrite
 * (a link repair) passes the stored date, so it is kept.
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
  // A name given as a whole key (the model writes name: <type>_<slug>) is the slug.
  if (type && name.startsWith(`${type}-`) && src.name && /_/.test(String(src.name))) {
    const asKey = splitKey(canonicalKey(String(src.name)));
    if (asKey && asKey.type === type) name = asKey.name;
  }
  const approvedBy = nullable(src.approved_by ?? src.approvedBy);
  const authorization = oneLine(src.authorization) || (approvedBy ? approvalText(approvedBy, today) : NO_AUTHORIZATION);
  const status = contractStatus(src.status || 'current');
  // A retired record keeps the word it was given or stored with (superseded or archived).
  let word = null;
  if (status === 'retired') {
    for (const w of [oneLine(src.status).toLowerCase(), oneLine(src.stored_status).toLowerCase()]) {
      if (RETIRED_WORDS.includes(w)) {
        word = w;
        break;
      }
    }
  }
  const updated = oneLine(src.updated) || oneLine(src.saved) || today;
  const saved = oneLine(src.saved) || updated;
  let body = topicBody(src.body, { name });
  let supersededBy = word === 'archived' ? null : canonicalOrNull(nullable(src.superseded_by ?? src.supersededBy));
  if (status === 'retired' && word !== 'archived') {
    // The replacement is named in the body's "**Superseded <date>:** Replaced by ..." line.
    if (!supersededBy) supersededBy = supersededByFromBody(body);
    // A replacement known only from a field (an older record) is written into the body, where the model keeps it.
    else if (supersededByFromBody(body) !== supersededBy) body = withSupersededNote(body, supersededBy, saved, name);
  }
  const record = {
    key: type && name ? keyFor(type, name) : givenKey,
    name,
    type,
    description: oneLine(src.description),
    status,
    superseded_by: supersededBy,
    source: oneLine(src.source),
    saved,
    updated,
    last_verified: oneLine(src.last_verified ?? src.lastVerified) || today,
    authorization,
    approved_by: approvedBy ?? approverFrom(authorization),
    supersedes: supersedesList(src.supersedes),
    body,
  };
  if (word) record.stored_status = word;
  if (isPlainObject(src.metadata) && Object.keys(src.metadata).some((k) => k !== 'type')) record.metadata = { ...src.metadata };
  if (src.extra && typeof src.extra === 'object' && Object.keys(src.extra).length) record.extra = { ...src.extra };
  return record;
}

function canonicalOrNull(value) {
  return value === null ? null : canonicalKey(value);
}

/**
 * A body with a "**Superseded <day>:** Replaced by [key](key.md)." line under
 * its title, for a superseded record whose body does not name its replacement.
 */
function withSupersededNote(body, supersededBy, day, name) {
  const date = DATE_RE.test(String(day ?? '')) ? day : localToday();
  const text = String(body ?? '').trim() ? String(body) : `# ${titleFromName(name)}\n`;
  return normalizeBody(addBodyNote(text, retireNote(date, { supersededBy })));
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

// Secrets never go in memory (the model's memory-criteria.md, "Never save as
// lasting memory"; final review M2): memory is plain text, and Notion memory
// sends it to Notion. These are the common shapes of a key, a token, a
// private key, or a password written out.
const SECRET_PATTERNS = [
  { what: 'an API key (sk-...)', re: /\bsk-(?:ant-|proj-|live-|test-)?[A-Za-z0-9_-]{16,}/ },
  { what: 'a GitHub token', re: /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/ },
  { what: 'a Notion token (ntn_...)', re: /\bntn_[A-Za-z0-9]{20,}/ },
  { what: 'a Slack token (xox...)', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}/ },
  { what: 'an AWS access key (AKIA...)', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { what: 'a Google API key (AIza...)', re: /\bAIza[0-9A-Za-z_-]{30,}/ },
  { what: 'a private key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { what: 'a bearer token', re: /\bBearer\s+[A-Za-z0-9._~+/-]{20,}/ },
  { what: 'a password', re: /\b(?:password|passwd|passcode|pwd)\s*(?::|=)\s*(\S{3,})/gi, secret: looksLikePassword },
  { what: 'a password', re: /\b(?:password|passwd|passcode)\s+is\s+(?!(?:stored|kept|saved|managed|held|in|on|at|the|a|an|not|never|required|needed|set|changed|rotated|reset|expired|shared|available|found|listed|given|sent|handled|provided|written|documented|located|entered|typed|asked|prompted|missing|wrong|correct|same|different|long|short|strong|weak|only|also|still|now)\b)["'“‘]?[^\s"'”’.,;]{3,}/i },
  { what: 'an API key or token', re: /\b(?:api[_ -]?key|secret|token|access[_ -]?key)\s*(?::|=|is)\s*["'“‘]?([A-Za-z0-9_./+~-]{20,})/gi, secret: looksLikeKey },
  // A password inside an address: scheme://user:password@host (final
  // re-review R-M9: postgres://admin:<password>@db.example.com was saved).
  { what: 'a password in an address (scheme://user:password@host)', re: /\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@]*:([^\s/@]+)@[^\s/@]+/gi, secret: looksLikeAddressPassword },
];

/**
 * True when the password part of scheme://user:password@host is a real
 * value, not a placeholder ("<password>", "****", "$DB_PASSWORD", "${PASS}").
 */
function looksLikeAddressPassword(value) {
  const v = String(value);
  if (/^<[^<>]*>$/.test(v) || /^[*•x]+$/i.test(v)) return false;
  if (/^\$\{?[A-Za-z_][A-Za-z0-9_]*\}?$/.test(v) || /^%[A-Za-z_]+%$/.test(v)) return false;
  return v.length >= 1;
}

/**
 * True when the text after "password:" looks like a password, not a word: it
 * has a digit, a sign, or a capital letter after a small one ("hunter2",
 * "S3cret!", "hUnter"). "password: field" and "Password: required" are words.
 */
function looksLikePassword(value) {
  const v = String(value).replace(/[.,;:!?)"'”’]+$/, '');
  if (/^<[^<>]*>$/.test(v) || /^[*•x]+$/i.test(v)) return false;
  return /[0-9]/.test(v) || /[^A-Za-z]/.test(v) || /[a-z][A-Z]/.test(v);
}

/**
 * True when the text after "API key:" or "token:" looks like a key: not a
 * file path (~/.config/app/key.json, config/secrets/app.env), and not the
 * name of an environment variable (STAGING_API_KEY_VALUE).
 */
function looksLikeKey(value) {
  const v = String(value);
  if (/^[~./]/.test(v)) return false;
  if (/^[A-Z][A-Z0-9_]+$/.test(v)) return false;
  if (/\.(?:json|env|ya?ml|toml|txt|md|pem|key|ini|conf|cfg|plist)$/i.test(v)) return false;
  if (v.includes('/') && v.split('/').every((seg) => /^[a-z0-9._-]*$/.test(seg))) return false;
  return true;
}

/**
 * What kind of secret a text holds, or null: an API key, a token, a private
 * key, or a password written out. Never returns the secret itself.
 */
export function secretKind(text) {
  const s = String(text ?? '');
  for (const p of SECRET_PATTERNS) {
    if (!p.secret) {
      if (p.re.test(s)) return p.what;
      continue;
    }
    p.re.lastIndex = 0;
    let m;
    while ((m = p.re.exec(s)) !== null) {
      if (p.secret(m[1])) {
        p.re.lastIndex = 0;
        return p.what;
      }
    }
  }
  return null;
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
  if (r.saved && !DATE_RE.test(String(r.saved))) problems.push(`saved must be a date in the form YYYY-MM-DD (got "${r.saved}").`);
  if (r.updated && !DATE_RE.test(String(r.updated))) problems.push(`updated must be a date in the form YYYY-MM-DD (got "${r.updated}").`);
  if (!(DATE_RE.test(String(r.last_verified ?? '')) || r.last_verified === 'unknown')) {
    problems.push(`last_verified must be a date in the form YYYY-MM-DD, or unknown (got "${r.last_verified ?? ''}").`);
  }
  if (r.authorization !== undefined && r.authorization !== null && r.authorization !== '') {
    if (isPlaceholder(r.authorization)) problems.push('authorization is still a template placeholder. Say who approved the save, or "Trusted grant".');
    else if (EMAIL_RE.test(String(r.authorization))) problems.push('authorization contains an email address. Use the person\'s name only.');
  }
  if (r.approved_by !== null && r.approved_by !== undefined && EMAIL_RE.test(String(r.approved_by))) {
    problems.push('approved_by contains an email address. Use the person\'s name only.');
  }
  for (const k of r.supersedes || []) {
    if (!isValidKey(k)) problems.push(`supersedes names "${k}", which is not a memory key.`);
    else if (k === r.key) problems.push('a record cannot supersede itself.');
  }
  for (const [field, value] of [['description', r.description], ['source', r.source], ['body', r.body]]) {
    const kind = secretKind(value);
    if (kind) {
      problems.push(`${field} looks like it holds ${kind}. Secrets never go in memory: memory is plain text, and Notion memory sends it to Notion. Keep the secret in the keychain, a password manager, or the tool's own sign-in, and save only where it is kept, for example "The staging key is in 1Password under Staging".`);
      break;
    }
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
 * The stored text of a record: the model's topic template YAML (see the top of
 * this file), then any keys in record.extra, a blank line, the body.
 */
export function serializeRecord(record) {
  const r = record;
  const status = storedStatus(r);
  let body = normalizeBody(r.body);
  if (status === 'superseded' && r.superseded_by && supersededByFromBody(body) !== r.superseded_by) {
    body = withSupersededNote(body, r.superseded_by, r.saved, r.name);
  }
  const metadata = isPlainObject(r.metadata) ? { ...r.metadata } : {};
  metadata.type = r.type;
  const ordered = Object.prototype.hasOwnProperty.call(r.metadata || {}, 'type') ? metadata : { type: r.type, ...metadata };
  const data = {
    name: r.key,
    description: r.description ?? '',
    // Only a real date is written: the updated date, else the saved date an
    // older record kept; a record with neither has none.
    updated: DATE_RE.test(String(r.updated ?? '')) ? r.updated : DATE_RE.test(String(r.saved ?? '')) ? r.saved : undefined,
    metadata: ordered,
    status,
    source: r.source ?? '',
    last_verified: r.last_verified ?? '',
    authorization: r.authorization || (r.approved_by ? `Approved by ${r.approved_by}` : NO_AUTHORIZATION),
    supersedes: supersedesValue(r.supersedes),
  };
  if (data.updated === undefined) delete data.updated;
  for (const k of Object.keys(data)) if (data[k] === null || data[k] === undefined) data[k] = '';
  if (r.extra && typeof r.extra === 'object') {
    for (const [k, v] of Object.entries(r.extra)) {
      if (!KNOWN_FIELDS.includes(k) && k !== 'key' && v !== undefined) data[k] = v;
    }
  }
  return stringifyFrontmatter(data, `\n${body}`);
}

const SUPERSEDED_NOTE_RE = /^\*\*Superseded \d{4}-\d{2}-\d{2}:\*\*[^\n]*?Replaced by \[?([a-z]+_[a-z0-9_-]+?)(?:\.md)?\]?(?:\(|\.|,|\s|$)/m;

/**
 * The key named in the body's newest dated status note when that note is a
 * "**Superseded <date>:** Replaced by ..." line, or null. An older Superseded
 * line under a newer Archived or Restored line does not count.
 */
export function supersededByFromBody(body) {
  const text = String(body ?? '');
  if (latestStatusNote(text) !== 'superseded') return null;
  const m = SUPERSEDED_NOTE_RE.exec(text);
  return m ? canonicalKey(m[1]) : null;
}

/**
 * Read stored record text. Returns { record, problems }: problems lists rule
 * breaks (and a frontmatter that cannot be read); record holds whatever could
 * be read, with body = the whole text when there is no frontmatter.
 * Unknown frontmatter keys are kept in record.extra; a `metadata` map with more
 * than `type` is kept in record.metadata. record.stored_status is the status
 * word as written (superseded, archived, ...); record.legacy is true for a file
 * in the older toolkit format.
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
  const metadata = isPlainObject(data.metadata) ? data.metadata : null;
  const legacy = !metadata && data.type !== undefined;
  const metaType = metadata && metadata.type !== undefined && metadata.type !== null ? str(metadata.type) : '';
  const type = metaType || str(data.type) || (parts ? parts.type : '');
  const storedWord = str(data.status).trim().toLowerCase();
  const status = contractStatus(storedWord);
  const authorization = data.authorization !== undefined && data.authorization !== null
    ? str(data.authorization)
    : (nullable(data.approved_by) ? `Approved by ${str(data.approved_by).trim()}` : '');
  let supersededBy = storedWord === 'archived' ? null : canonicalOrNull(nullable(data.superseded_by));
  if (!supersededBy && storedWord === 'superseded') supersededBy = supersededByFromBody(body);
  const record = {
    key: str(key),
    name: parts ? parts.name : str(data.name),
    type,
    description: str(data.description),
    status,
    stored_status: storedWord,
    superseded_by: status === 'retired' ? supersededBy : null,
    source: str(data.source),
    saved: str(data.saved) || str(data.updated),
    updated: str(data.updated),
    last_verified: str(data.last_verified),
    authorization,
    approved_by: nullable(data.approved_by) ?? approverFrom(authorization),
    supersedes: supersedesList(data.supersedes),
    body: normalizeBody(body),
  };
  if (metadata && Object.keys(metadata).some((k) => k !== 'type')) record.metadata = { ...metadata };
  const extra = {};
  for (const [k, v] of Object.entries(data)) if (!KNOWN_FIELDS.includes(k)) extra[k] = v;
  if (Object.keys(extra).length) record.extra = extra;
  if (legacy) record.legacy = true;
  if (parts && type && parts.type !== type) {
    problems.push(`metadata.type "${type}" does not match the key ${key}.`);
  }
  if (!legacy && data.name !== undefined && data.name !== null && parts && str(data.name) !== String(key)) {
    problems.push(`name "${str(data.name)}" does not match the file name ${key}; the model writes the file name without .md.`);
  }
  if (!legacy && !metadata && storedWord !== 'template') problems.push('it has no metadata.type.');
  if (storedWord && storedWord !== 'template' && !STORED_STATUSES.includes(storedWord) && storedWord !== 'retired') {
    problems.push(`status "${storedWord}" is not one of ${STORED_STATUSES.join(', ')}.`);
  }
  for (const p of validateRecord(record)) if (!problems.includes(p)) problems.push(p);
  return { record, problems };
}

/**
 * Put a dated note under the first "# " heading of a body (or at the top when
 * there is none), so a retired or restored note says so where it is read first.
 */
export function addBodyNote(body, note) {
  if (!note) return body;
  const text = String(body ?? '');
  const lines = text.split('\n');
  const h1 = lines.findIndex((l) => /^# \S/.test(l));
  if (h1 === -1) {
    const lead = text.replace(/^\s*\n/, '');
    return `\n${note}\n\n${lead}`;
  }
  let at = h1 + 1;
  while (at < lines.length && lines[at].trim() === '') at++;
  lines.splice(h1 + 1, at - (h1 + 1), '', note, '');
  return lines.join('\n');
}

/**
 * Change the status of stored record text and return the new text. Keeps
 * every other frontmatter line as it was. status: 'retired' or
 * 'needs-review' (contract words; retired is written superseded or archived);
 * supersededBy: a key or null; note: a line put under the title ('' for none).
 * A record that moves into or out of archive/ gets its own links rebased, so
 * they still point at the same notes. A file in the older toolkit format is
 * written again in the model format. updated: the date written in `updated`
 * (a status change is a change to the record); none leaves it as it is.
 * Throws INVALID when the frontmatter cannot be read.
 */
export function changeRecordStatus(text, { status, supersededBy = null, note = '', updated = null }, key = '') {
  let parsed;
  try {
    parsed = parseFrontmatter(text);
  } catch (err) {
    throw new ToolkitError(EXIT.INVALID, `The memory record ${key} has frontmatter that cannot be read, so its status was not changed: ${err.message}`, {
      key,
      fix: `Read it with toolkit memory get ${key} --json, correct the text, and save it again with toolkit memory save and --expect <version> (the version field of that read).`,
    });
  }
  if (!parsed.hasFrontmatter) {
    throw new ToolkitError(EXIT.INVALID, `The memory record ${key} has no frontmatter, so its status was not changed.`, {
      key,
      fix: `Read it with toolkit memory get ${key} --json, correct the text, and save it again with toolkit memory save and --expect <version> (the version field of that read).`,
    });
  }
  const word = status === 'retired' ? (supersededBy ? 'superseded' : 'archived') : status;
  const before = String(parsed.data.status ?? '').trim().toLowerCase();
  let body = parsed.body;
  const fromDir = before === 'archived' ? ARCHIVE_FOLDER : '';
  const toDir = word === 'archived' ? ARCHIVE_FOLDER : '';
  if (fromDir !== toDir) body = rebaseLinks(body, fromDir, toDir).text;
  body = addBodyNote(body, note);
  const { record } = parseRecord(text, key);
  if (record.legacy) {
    return serializeRecord({
      ...record, status: contractStatus(word), stored_status: word, superseded_by: status === 'retired' ? supersededBy : null, body,
      ...(updated ? { updated, saved: updated } : {}),
    });
  }
  const data = parsed.data;
  data.status = word;
  delete data.superseded_by;
  if (updated && DATE_RE.test(String(updated))) setUpdated(data, updated);
  return stringifyFrontmatter(data, body);
}

/**
 * The dated line put under a record's title when it is retired. anchor: a
 * section of the replacement ("#Deploy%20window"), for a record merged into a
 * concept as that section.
 */
export function retireNote(day, { reason, supersededBy, anchor = '' } = {}) {
  const why = reason ? String(reason).replace(/\s+/g, ' ').trim() : '';
  if (supersededBy) return `**Superseded ${day}:** Replaced by [${supersededBy}](${supersededBy}.md${anchor || ''}).${why ? ` ${why}` : ''}`;
  return `**Archived ${day}:** ${why || 'No reason was given.'}`;
}

/** The reason `toolkit memory merge` gives when it retires a record it merged into a concept. */
export function mergedReason(intoKey, heading) {
  return `Merged into ${intoKey}${heading ? `, section "${String(heading).replace(/\s+/g, ' ').trim()}"` : ''}.`;
}

const MERGED_NOTE_RE = /^\s*\*\*Superseded \d{4}-\d{2}-\d{2}:\*\* Replaced by \[[^\]\n]*\]\([^\n]*?\)\. Merged into ((?:user|feedback|project|reference|event)_[a-z0-9_]+)\b/;

/**
 * The concept a superseded record was merged into (its newest status line is
 * the one `toolkit memory merge` writes), or null. Its facts live on in that
 * concept, so the index leaves it out (verifier, 2026-09-28: after a merge
 * the index still listed every merged one-fact record).
 */
export function mergedInto(record) {
  const r = record || {};
  if (r.status !== 'retired' || storedStatus(r) !== 'superseded') return null;
  const line = String(r.body ?? '').split('\n').find((l) => STATUS_NOTE_RE.test(l));
  const m = line ? MERGED_NOTE_RE.exec(line) : null;
  return m ? m[1] : null;
}

/** The dated line put under a record's title when it is restored. */
export function restoreNote(day) {
  return `**Restored ${day}:** check that this is still true.`;
}

/**
 * Stored text with its `supersedes` list changed: add and remove are keys.
 * Keeps every other line as it was. Returns the text unchanged when nothing changes.
 */
export function changeSupersedes(text, { add = [], remove = [] } = {}) {
  const parsed = parseFrontmatter(text);
  if (!parsed.hasFrontmatter) return text;
  const now = supersedesList(parsed.data.supersedes);
  const next = now.filter((k) => !remove.includes(k));
  for (const k of add) if (!next.includes(k)) next.push(k);
  if (next.length === now.length && next.every((k, i) => k === now[i])) return text;
  parsed.data.supersedes = supersedesValue(next);
  return stringifyFrontmatter(parsed.data, parsed.body);
}

/** Stored text with a new key: `name` (and `metadata.type` when the type changed) set, other lines kept. */
export function renameRecordText(text, toKey) {
  const parsed = parseFrontmatter(text);
  const parts = splitKey(toKey);
  if (!parsed.hasFrontmatter || !parts) return text;
  const data = parsed.data;
  if (!isPlainObject(data.metadata) && data.type !== undefined) {
    // Older toolkit format: write it again in the model format.
    const { record } = parseRecord(text, toKey);
    return serializeRecord({ ...record, key: toKey, name: parts.name, type: parts.type });
  }
  data.name = toKey;
  const meta = isPlainObject(data.metadata) ? { ...data.metadata } : {};
  meta.type = parts.type;
  data.metadata = meta;
  return stringifyFrontmatter(data, parsed.body);
}

/**
 * A record without its body. stored_status is the status word as stored
 * (superseded, archived, ...); proposal is true for a saved proposal the owner
 * has not answered (see isProposal). title is the body's "# Title" (or the
 * title a backend keeps, or one made from the name); updated is the stored
 * `updated` date, else the date the backend knows (saved). concept is the
 * concept a proposal would join (proposalTarget), only when it names one.
 */
export function recordSummary(record) {
  const out = {
    key: record.key,
    name: record.name,
    type: record.type,
    title: String(record.title || '').trim() || bodyTitle(record.body) || titleFromName(record.name),
    description: record.description,
    status: record.status,
    stored_status: storedStatus(record),
    superseded_by: record.superseded_by ?? null,
    source: record.source,
    saved: record.saved,
    updated: record.updated || record.saved || '',
    last_verified: record.last_verified,
    approved_by: record.approved_by ?? null,
    proposal: isProposal(record),
  };
  const target = proposalTarget(record);
  if (target) {
    out.concept = target.concept;
    out.section = target.section;
  }
  return out;
}

/**
 * The concept a saved proposal would join, and the section it would become:
 * { concept, section } from its `concept` and `section` frontmatter fields
 * (kept in record.extra, or given at the top level of a summary), or null
 * when it names no other concept. A proposal for a new concept names none.
 */
export function proposalTarget(record) {
  const r = record || {};
  const extra = r.extra && typeof r.extra === 'object' ? r.extra : {};
  const concept = canonicalKey(oneLine(r.concept ?? extra.concept));
  if (!concept || !isValidKey(concept) || concept === r.key) return null;
  const section = oneLine(r.section ?? extra.section) || null;
  return { concept, section };
}

// ---------------------------------------------------------------- saved proposals

/**
 * A saved proposal (Mike, 2026-09-27, "Memory additions" 1): a record the
 * agent proposed ("Save to memory: ...?") that the owner has not answered.
 * It is stored with the model's needs-review status (Lore: proposed) and an
 * authorization that starts with "Proposed by". The agent never uses it as a
 * fact: find leaves it out unless asked, the briefing lists it as waiting on
 * the owner, and `toolkit memory approve` or `reject` records his answer.
 * A record that needs review for another reason (restored after a retire)
 * is not a proposal.
 */
export const PROPOSAL_PREFIX = 'Proposed by';

/** The authorization written for a proposal: "Proposed by the agent on 2026-09-28; the owner has not answered". */
export function proposalText(day) {
  return `${PROPOSAL_PREFIX} the agent on ${day}; the owner has not answered`;
}

/** True when an authorization text marks a proposal. */
export function isProposalAuthorization(authorization) {
  return /^proposed by\b/i.test(oneLine(authorization));
}

/** True for a saved proposal: status needs-review and an authorization that starts with "Proposed by". */
export function isProposal(record) {
  const r = record || {};
  return r.status === 'needs-review' && isProposalAuthorization(r.authorization);
}

// ---------------------------------------------------------------- links between notes (Obsidian style)

/** Retired records that are not superseded live in this folder of the vault (and of an export). */
export const ARCHIVE_FOLDER = 'archive';

// A link target may hold balanced brackets, as CommonMark allows
// ("project_x.md#Grafana%20(prod)%20alerts", written before headingAnchor
// encoded them): otherwise the link is not found, and rename, supersede,
// split, and the broken-link check miss it.
const MD_LINK_RE = /(!?)\[([^\]\n]*)\]\((<[^>\n]+>|(?:[^()\s]|\([^()\s]*\))+)((?:\s+"[^"\n]*")?)\)/g;
const WIKI_LINK_RE = /(!?)\[\[([^\]|#\n]+?)(#[^\]|\n]*)?(?:\|([^\]\n]*))?\]\]/g;

/**
 * The Markdown links in a text, outside fenced code blocks and `code`:
 * [{ kind: 'md'|'wiki', start, end, full, text, target, anchor }]. `target`
 * is the path as written (angle brackets removed, %20 read as a space),
 * without the #anchor. Images (![...]) are left out.
 */
export function findLinks(text) {
  const src = String(text ?? '');
  const out = [];
  const fences = [];
  const fenceRe = /^(```|~~~)[^\n]*\n[\s\S]*?(?:^\1[ \t]*$|(?![\s\S]))/gm;
  let f;
  while ((f = fenceRe.exec(src))) fences.push([f.index, f.index + f[0].length]);
  // Inline code spans (`...`) on one line are not links either.
  const spanRe = /`[^`\n]*`/g;
  let sp;
  while ((sp = spanRe.exec(src))) fences.push([sp.index, sp.index + sp[0].length]);
  const inFence = (i) => fences.some(([a, b]) => i >= a && i < b);
  let m;
  MD_LINK_RE.lastIndex = 0;
  while ((m = MD_LINK_RE.exec(src))) {
    if (m[1] || inFence(m.index)) continue;
    let target = m[3];
    const angled = target.startsWith('<');
    if (angled) target = target.slice(1, -1);
    let anchor = '';
    const hash = target.indexOf('#');
    if (hash >= 0) {
      anchor = target.slice(hash);
      target = target.slice(0, hash);
    }
    let decoded = target;
    try {
      decoded = decodeURI(target);
    } catch {
      decoded = target;
    }
    out.push({ kind: 'md', start: m.index, end: m.index + m[0].length, full: m[0], text: m[2], target: decoded, anchor, title: m[4] || '', angled });
  }
  WIKI_LINK_RE.lastIndex = 0;
  while ((m = WIKI_LINK_RE.exec(src))) {
    if (m[1] || inFence(m.index)) continue;
    out.push({ kind: 'wiki', start: m.index, end: m.index + m[0].length, full: m[0], text: m[4] !== undefined ? m[4] : m[2].trim(), target: m[2].trim(), anchor: m[3] || '', alias: m[4] });
  }
  return out.sort((a, b) => a.start - b.start);
}

/** True when a link target is a URL or an absolute path, not a note in the vault. */
export function isExternal(target) {
  return /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('/') || target === '';
}

/**
 * The vault path a link points to, from a note in `dir` ('' for the vault root,
 * 'archive' for archive/): 'project_x.md' or 'archive/project_x.md'. Null for a
 * URL, a path outside the vault, or a target that is not a Markdown file.
 * A wiki link [[project_x]] is read as project_x.md next to the note.
 */
export function linkVaultPath(link, dir = '') {
  let target = link.target;
  if (link.kind === 'wiki') {
    if (!/\.md$/i.test(target)) target = `${target}.md`;
    // Obsidian finds a wiki link by file name anywhere in the vault; the caller resolves that.
    return { path: target, wiki: true };
  }
  if (isExternal(target) || !/\.md$/i.test(target)) return null;
  const joined = path.posix.normalize(path.posix.join(dir || '.', target));
  if (joined.startsWith('../') || joined === '..') return null;
  return { path: joined.replace(/^\.\//, ''), wiki: false };
}

/** The relative link from a note in `fromDir` to the vault path `to`. */
export function relativeLink(fromDir, to) {
  const rel = path.posix.relative(fromDir || '.', to);
  return rel || path.posix.basename(to);
}

/**
 * The path a relative Markdown link points to, from a note in `dir`, even when
 * it leaves the vault ('../README.md' from the vault root). Null for a URL, an
 * absolute path, a wiki link, or a target that is not a Markdown file.
 */
export function linkPath(link, dir = '', { anyFile = false } = {}) {
  if (link.kind !== 'md' || isExternal(link.target) || (!anyFile && !/\.md$/i.test(link.target))) return null;
  return path.posix.normalize(path.posix.join(dir || '.', link.target)).replace(/^\.\//, '');
}

export function formatMdLink(link, text, target) {
  const shown = link.angled || /\s/.test(target) ? `<${target}${link.anchor}>` : `${encodeSpaces(target)}${link.anchor}`;
  return `[${text}](${shown}${link.title || ''})`;
}

function encodeSpaces(s) {
  return String(s).replace(/ /g, '%20');
}

/**
 * Rewrite links in a text. fn(link) returns the replacement text, or null to
 * keep the link. Returns { text, count }.
 */
export function rewriteLinks(text, fn) {
  const src = String(text ?? '');
  const links = findLinks(src);
  let out = '';
  let at = 0;
  let count = 0;
  for (const link of links) {
    const rep = fn(link);
    if (rep === null || rep === undefined || rep === link.full) continue;
    out += src.slice(at, link.start) + rep;
    at = link.end;
    count++;
  }
  if (!count) return { text: src, count: 0 };
  return { text: out + src.slice(at), count };
}

/**
 * Rebase the relative links of a note that moves from folder `fromDir` to
 * `toDir` (for example '' to 'archive'), so each still points at the same
 * file: notes in the vault and files outside it (../docs/spec.md). URLs,
 * absolute paths, and wiki links are left as they are.
 */
export function rebaseLinks(text, fromDir, toDir) {
  return rewriteLinks(text, (link) => {
    const where = linkPath(link, fromDir, { anyFile: true });
    if (!where) return null;
    const next = relativeLink(toDir, where);
    if (next === link.target) return null;
    return formatMdLink(link, link.text, next);
  });
}

/**
 * Rebase the links of a body written for a note that moves from folder
 * `fromDir` to `toDir` when it is not known which folder the links were written
 * for (a body an agent gives to `toolkit memory save`). A link is changed only
 * when it finds no note from `toDir` and does find one from `fromDir`.
 * exists(path) -> boolean, with the path relative to the vault (it may start
 * with ../ for a file outside the vault). Returns { text, count }.
 */
export function fitLinks(text, fromDir, toDir, exists) {
  return rewriteLinks(text, (link) => {
    const asTo = linkPath(link, toDir, { anyFile: true });
    if (!asTo || exists(asTo)) return null;
    const asFrom = linkPath(link, fromDir, { anyFile: true });
    if (!asFrom || !exists(asFrom)) return null;
    const next = relativeLink(toDir, asFrom);
    return next === link.target ? null : formatMdLink(link, link.text, next);
  });
}

/** The key of a record file path ('archive/project_x.md' -> 'project_x'), or null. */
export function keyOfVaultPath(p) {
  const base = path.posix.basename(String(p ?? ''));
  const m = /^((?:user|feedback|project|reference|event)_[a-z0-9]+(?:_[a-z0-9]+)*)\.md$/.exec(base);
  return m ? m[1] : null;
}

/**
 * Repair the links in one note after another note changed.
 * change = { kind: 'rename'|'supersede'|'archive'|'delete'|'section', from: <key>, to?: <key>,
 *            fromPath: <vault path of the old note>, toPath?: <vault path of the new note>,
 *            anchor?: <'#Heading' in the new note>, headings?: <section headings> }
 * dir is the folder of the note being repaired ('' or 'archive').
 *   rename, supersede: links to the old note point at the new one; a link whose
 *                      words were the old key or file name gets the new ones.
 *                      With anchor (a record merged into a concept as a
 *                      section), the new link goes to that section.
 *   section:           sections moved from one concept to another (toolkit
 *                      memory split): only links to the old note whose anchor
 *                      names one of `headings` point at the new note, with
 *                      the same anchor. Other links to the old note stay.
 *   unanchor:          sections taken out of a note (save --remove): links to
 *                      the note whose anchor names one of `headings` lose the
 *                      anchor and point at the note itself.
 *   archive:           the link becomes its words plus " (archived)".
 *   delete:            the link becomes its words.
 * Returns { text, count }.
 */
export function repairLinks(text, dir, change) {
  const { kind, from, fromPath = `${from}.md` } = change;
  const toPath = change.toPath || (change.to ? `${change.to}.md` : null);
  const src = String(text ?? '');
  const moved = kind === 'section' || kind === 'unanchor' ? new Set((change.headings || []).map((h) => anchorHeading(h))) : null;
  return rewriteLinks(src, (link) => {
    const where = linkVaultPath(link, dir);
    if (!where) return null;
    const hit = where.wiki ? keyOfVaultPath(where.path) === from : where.path === fromPath;
    if (!hit) return null;
    if (kind === 'unanchor') {
      if (!link.anchor || !moved.has(anchorHeading(link.anchor))) return null;
      if (link.kind === 'wiki') return `[[${from}${link.alias !== undefined ? `|${link.alias}` : ''}]]`;
      return formatMdLink({ ...link, anchor: '' }, link.text, link.target);
    }
    if (kind === 'section') {
      if (!link.anchor || !moved.has(anchorHeading(link.anchor)) || !toPath || !change.to) return null;
      if (link.kind === 'wiki') return `[[${change.to}${link.anchor}${link.alias !== undefined ? `|${link.alias}` : ''}]]`;
      return formatMdLink(link, link.text, relativeLink(dir, toPath));
    }
    // A note's own "**Superseded <date>:** Replaced by [x](x.md)" line is its history: when x is
    // superseded in turn, the line still names x (which stays where it is).
    if (kind === 'supersede' && isSupersededLine(src, link.start)) return null;
    const words = link.text;
    if (kind === 'archive') return /\(archived\)$/.test(words) ? words : `${words} (archived)`;
    if (kind === 'delete') return words;
    if (!toPath || !change.to) return null;
    const oldWords = [from, `${from}.md`, path.posix.basename(fromPath)];
    const newWords = oldWords.includes(words) ? (words.endsWith('.md') ? `${change.to}.md` : change.to) : words;
    // A link into the old note's own sections means nothing in the new note: the
    // new anchor (a merged record's section) wins, else a rename keeps its anchor.
    const anchor = change.anchor !== undefined && change.anchor !== null ? change.anchor : link.anchor;
    if (link.kind === 'wiki') {
      const alias = link.alias !== undefined ? `|${link.alias === from ? change.to : link.alias}` : '';
      const wikiAnchor = anchor ? `#${anchorHeadingText(anchor)}` : '';
      return `[[${change.to}${wikiAnchor}${alias}]]`;
    }
    return formatMdLink({ ...link, anchor }, newWords, relativeLink(dir, toPath));
  });
}

/** The heading an anchor names, as written ('#Deploy%20window' -> 'Deploy window'). */
function anchorHeadingText(anchor) {
  const a = String(anchor ?? '').replace(/^#/, '');
  try {
    return decodeURIComponent(a);
  } catch {
    return a;
  }
}

/** True when the line holding position `at` is a "**Superseded <date>:**" note. */
function isSupersededLine(text, at) {
  const start = text.lastIndexOf('\n', at - 1) + 1;
  return /^\s*\*\*Superseded \d{4}-\d{2}-\d{2}:\*\*/.test(text.slice(start, at + 1));
}

/**
 * Every link in a note that points at a vault note that does not exist.
 * exists(vaultPath) -> boolean; findByName(fileName) -> boolean for wiki links.
 * outside(path) -> boolean, optional: checks a relative Markdown link that
 * leaves the vault (a path starting with ../, relative to the vault folder);
 * without it such links are not checked.
 * Returns [{ link, path, outside? }].
 */
export function brokenLinks(text, dir, { exists, findByName = exists, outside = null } = {}) {
  const out = [];
  for (const link of findLinks(text)) {
    const where = linkVaultPath(link, dir);
    if (!where) {
      const p = typeof outside === 'function' ? linkPath(link, dir) : null;
      if (p && p.startsWith('../') && !outside(p)) out.push({ link: link.full, path: p, outside: true });
      continue;
    }
    const ok = where.wiki ? findByName(path.posix.basename(where.path)) : exists(where.path);
    if (!ok) out.push({ link: link.full, path: where.path });
  }
  return out;
}

/**
 * Repair links and `supersedes` entries in every record of any backend, and in
 * the current focus and the glossary, through the driver's own methods. For
 * backends that do not keep files (Hindsight, Notion); the built-in driver
 * repairs its files directly. skip: keys not to touch.
 *
 * One note that cannot be saved (for example a Notion row with no description)
 * never stops the others. Returns { repaired, failed, reformatted }:
 *   repaired     keys (and 'focus', 'glossary') whose links were repaired
 *   failed       [{ key, reason }] for notes whose links could not be repaired
 *   reformatted  keys of repaired records that were also written again in the
 *                model's topic format (a "# Title" or "**Remember:**" added, or
 *                the older frontmatter written in the model's)
 */
export async function repairLinksWithDriver(driver, change, { skip = [] } = {}) {
  const repaired = [];
  const failed = [];
  const reformatted = [];
  const reason = (err) => String((err && err.message) || err).replace(/\s+/g, ' ').trim();
  let summaries = [];
  try {
    summaries = await driver.list({ status: 'all' });
  } catch (err) {
    failed.push({ key: '(every record)', reason: `the records could not be listed: ${reason(err)}` });
  }
  for (const s of summaries) {
    if (skip.includes(s.key)) continue;
    try {
      const rec = await driver.get(s.key);
      if (!rec) continue;
      const dir = storedStatus(rec) === 'archived' ? ARCHIVE_FOLDER : '';
      let body = rec.body;
      const fixed = repairLinks(body, dir, change);
      body = fixed.text;
      let supersedes = rec.supersedes || [];
      if (supersedes.includes(change.from) && (change.kind === 'rename')) {
        supersedes = supersedes.map((k) => (k === change.from ? change.to : k));
      }
      const supersedesChanged = supersedes.join(',') !== (rec.supersedes || []).join(',');
      if (!fixed.count && !supersedesChanged) continue;
      await driver.save({ ...rec, body, supersedes }, { expect: rec.version });
      repaired.push(s.key);
      if (rec.legacy || topicBody(body, { name: rec.name }) !== normalizeBody(body)) reformatted.push(s.key);
    } catch (err) {
      failed.push({ key: s.key, reason: reason(err) });
    }
  }
  for (const [which, get, set] of [['focus', 'focusGet', 'focusSet'], ['glossary', 'glossaryGet', 'glossarySet']]) {
    if (typeof driver[get] !== 'function') continue;
    try {
      const doc = await driver[get]();
      if (!doc.text) continue;
      const fixed = repairLinks(doc.text, '', change);
      if (!fixed.count) continue;
      await driver[set](fixed.text, { expect: doc.version });
      repaired.push(which);
    } catch (err) {
      failed.push({ key: which, reason: reason(err) });
    }
  }
  return { repaired, failed, reformatted };
}

/**
 * The link-repair fields of a driver result: { linksRepaired } plus
 * linksFailed and reformatted when they are not empty.
 */
export function repairResult(res) {
  const out = { linksRepaired: res.repaired };
  if (res.failed.length) out.linksFailed = res.failed;
  if (res.reformatted.length) out.reformatted = res.reformatted;
  return out;
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
  // Concept memory: the snippet comes from the "## " section that holds the
  // most of the words, so a hit shows the part that matched, not the start of
  // the concept (verifier, 2026-09-28: "tuesday deploy" showed the "Deploy
  // approvals" text of project_deploy).
  const section = bestSection(String(record.body || ''), terms);
  if (section) return { score, snippet: `${section.heading}: ${snippetAround(section.text, section.first)}` };
  return { score, snippet: snippetAround(String(record.body || ''), firstHit) };
}

/**
 * The "## " section of a body that holds the most of the search terms (then
 * the most hits): { heading, text, first } where text is the section without
 * its heading line and first is the first hit in it; null for a body with no
 * "## " section, or when no section holds a term.
 */
function bestSection(body, terms) {
  const heads = [];
  let fence = null;
  let at = 0;
  for (const line of body.split('\n')) {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
    } else if (f) {
      fence = f[1];
    } else {
      const h = /^##(?!#)[ \t]+(.*?\S)[ \t]*#*[ \t]*$/.exec(line);
      if (h) heads.push({ heading: h[1].trim(), start: at, textStart: at + line.length + 1 });
    }
    at += line.length + 1;
  }
  let best = null;
  heads.forEach((h, i) => {
    const text = body.slice(h.textStart, i + 1 < heads.length ? heads[i + 1].start : body.length);
    const lower = `${h.heading}\n${text}`.toLowerCase();
    let distinct = 0;
    let count = 0;
    let first = -1;
    for (const term of terms) {
      const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
      let n = 0;
      let m;
      while ((m = re.exec(lower)) && n < 3) {
        const pos = Math.max(0, m.index - h.heading.length - 1);
        if (first === -1 || pos < first) first = pos;
        n++;
      }
      if (n) distinct++;
      count += n;
    }
    if (distinct && (!best || distinct > best.distinct || (distinct === best.distinct && count > best.count))) {
      best = { heading: h.heading, text, first, distinct, count };
    }
  });
  if (!best) return null;
  const trimmed = best.text.replace(/^\s+/, '');
  const lead = best.text.length - trimmed.length;
  return { heading: best.heading, text: trimmed, first: Math.max(0, best.first - lead) };
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

/**
 * The parts of a current focus in the model's format (.memory/CURRENT_FOCUS.md):
 * { lastUpdated, sections: [{ heading, lines }], filled }.
 * HTML comments (the fill-in guide) are left out, and so are lines that are
 * only a template prompt such as "- `<Where to resume ...>`". lastUpdated is
 * the text after "Last updated:" ('' when it is still the prompt). filled is
 * false when no section has any line left, which means the focus is still the
 * template ("None." counts as a line). Sections are in the order of the text; each `lines` keeps its
 * bullets as written.
 */
/**
 * A "Last updated:" line of the focus: plain as in the model, or bold
 * ("**Last updated:** ..." or "**Last updated**: ..."). Group 1 is its text.
 */
export const LAST_UPDATED_RE = /^\s*(?:\*\*|__)?(?:Last updated|Updated)(?::(?:\*\*|__)?|(?:\*\*|__)?:)\s*(.*?)\s*$/i;

export function parseFocus(markdown) {
  const text = String(markdown ?? '').replace(/<!--[\s\S]*?-->/g, '');
  const sections = [];
  let lastUpdated = '';
  let cur = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, '');
    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    if (h2) {
      cur = { heading: h2[1], lines: [] };
      sections.push(cur);
      continue;
    }
    if (/^#\s/.test(line)) continue;
    const upd = LAST_UPDATED_RE.exec(line);
    if (upd && !cur) {
      lastUpdated = isPlaceholder(upd[1]) ? '' : upd[1].trim().replace(/^`(.*)`$/, '$1');
      continue;
    }
    if (!cur || !line.trim()) continue;
    const item = line.replace(/^\s*[-*]\s+/, '').trim();
    if (isPlaceholder(item)) continue;
    cur.lines.push(line);
  }
  const filled = sections.some((s) => s.lines.length > 0);
  return { lastUpdated, sections, filled };
}

/** The first line of the model's CURRENT_FOCUS.md. */
export const FOCUS_HEADING = '# Current focus';

/**
 * The current focus in the model's shape before it is saved: its "# Current
 * focus" heading is kept, or added when the text has no level-1 heading. Its
 * "Last updated:" line is added under the heading when the text has none (or
 * only the template prompt), and set to today when its date is older than
 * today or missing: a save through the command is an update made today, so an
 * agent that copies last week's focus forward does not keep last week's date.
 * A bold "**Last updated:**" line is accepted and written in the model's plain
 * form. Sample runs b and claude-a saved a focus without the heading and the
 * line, and every later session copied it.
 * Returns { text, added: ['heading'|'last updated'|'date'] } ('date': an
 * older date was changed to today).
 */
export function completeFocus(markdown, { today = localToday(), by = 'toolkit memory focus' } = {}) {
  let text = String(markdown ?? '').replace(/\r\n/g, '\n');
  if (!text.trim()) return { text, added: [] };
  const added = [];
  let lines = text.replace(/^\s*\n/, '').split('\n');
  const firstSection = () => {
    const i = lines.findIndex((l) => /^##\s/.test(l));
    return i === -1 ? lines.length : i;
  };
  if (!lines.slice(0, firstSection()).some((l) => /^#\s+\S/.test(l))) {
    lines = [FOCUS_HEADING, '', ...lines];
    added.push('heading');
  }
  const top = firstSection();
  const updIdx = lines.slice(0, top).findIndex((l) => LAST_UPDATED_RE.test(l));
  const stamp = `Last updated: ${today}, saved with ${by}`;
  if (updIdx === -1) {
    const h1 = lines.findIndex((l) => /^#\s+\S/.test(l));
    // Under the heading, before any fill-in guide comment or section.
    lines.splice(h1 + 1, 0, '', stamp, '');
    added.push('last updated');
  } else {
    const raw = LAST_UPDATED_RE.exec(lines[updIdx])[1];
    const value = raw.replace(/^`(.*)`$/, '$1').trim();
    const date = /^(\d{4}-\d{2}-\d{2})\b/.exec(value);
    if (!value || isPlaceholder(raw) || isPlaceholder(value)) {
      lines[updIdx] = stamp;
      added.push('last updated');
    } else if (!date || date[1] < today) {
      lines[updIdx] = stamp;
      added.push('date');
    } else {
      lines[updIdx] = `Last updated: ${value}`;
    }
  }
  text = lines.join('\n').replace(/\n{3,}/g, '\n\n');
  return { text, added };
}

/**
 * What a saved current focus lacks of the model's shape: its "# Current
 * focus" heading, and (once it is filled in) a dated "Last updated:" line.
 * [] when it has both, when it is empty, or when it is still the template.
 */
export function focusShapeProblems(markdown) {
  const text = String(markdown ?? '');
  if (!text.trim()) return [];
  const problems = [];
  const lines = text.replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n/);
  const top = lines.findIndex((l) => /^##\s/.test(l));
  const head = top === -1 ? lines : lines.slice(0, top);
  if (!head.some((l) => /^#\s+\S/.test(l))) problems.push(`has no "${FOCUS_HEADING}" heading at the top.`);
  const parsed = parseFocus(text);
  if (parsed.filled && !parsed.lastUpdated) problems.push('has no "Last updated:" line with a date, so the briefing cannot say how old it is.');
  return problems;
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

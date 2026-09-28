// The work-item model: reading and writing WORK-ITEM.md and DESIGN.md in the
// ARCHITECTURE 4.2 format, section edit helpers, validation, derived values,
// the approval gates, and the owner-edit rule (ARCHITECTURE 4.2 "Owner edits win").
//
// Every tracker uses this file. A tracker driver's `body` is the WORK-ITEM.md
// text after the frontmatter; its `meta` is the frontmatter as an object.

import * as frontmatter from '../core/frontmatter.mjs';
import { splitSections, flattenSections, getSection, replaceSection, parseTable, appendTableRow, normalizeHeading } from '../core/markdown.mjs';
import {
  FIELD_ORDER, DROPPED_FIELDS, DESIGN_FIELD_ORDER, STATUSES, PRIORITIES, DELIVERY, DESIGN_STATUSES, ITEM_DESIGN_VALUES,
  findStage, normalizeStage, stageNumber, statusForStage, stageShort, isTerminal, isStatus, isValidType, isKnownType,
  typeNeedsRequirements, normalizeWaitingOn, parseApproval, isApproved, continueWith, brokenGates,
} from './lifecycle.mjs';

// ------------------------------------------------------------------ constants

export const SECTIONS = Object.freeze(['Overview', 'Roadmap', 'Tasks', 'Recent History', 'Open Questions', 'Requirements', 'Notes']);
export const OVERVIEW_LABELS = Object.freeze(['Goal', 'Current position', 'Next action', 'Blockers', 'Related items']);
export const HISTORY_HEADERS = Object.freeze(['Date', 'Change or decision', 'Effect on the work']);
export const QUESTION_HEADERS = Object.freeze(['ID', 'Question', 'Affects', 'Status', 'Decision needed from']);
export const ROADMAP_HEADERS = Object.freeze(['Phase', 'Outcome', 'Status', 'Exit result', 'Sub-items']);
export const REQUIREMENT_STATUSES = Object.freeze(['Refining', 'Finalized', 'Superseded']);
/** Roadmap phase status words (the work plugin's planning.md), plus Cancelled for a dropped phase. */
export const PHASE_STATUSES = Object.freeze(['Not Started', 'In Progress', 'Done', 'Cancelled']);
export const DESIGN_SUFFIX = ' — solution design';
export const DEFAULT_PREFIX = 'WI';
export const ID_WIDTH = 3;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// ------------------------------------------------------------------ ids

/**
 * Read an id. Accepts "WI-007", "wi-7", and a bare number ("7") when a prefix is given.
 * @returns {{ prefix: string, n: number } | null}
 */
export function parseId(value, prefix = null) {
  if (value === null || value === undefined) return null;
  const v = String(value).trim();
  const m = /^([A-Za-z][A-Za-z0-9]*)-(\d+)$/.exec(v);
  if (m) return { prefix: m[1].toUpperCase(), n: Number(m[2]) };
  if (prefix && /^\d+$/.test(v)) return { prefix: String(prefix).toUpperCase(), n: Number(v) };
  return null;
}

export function formatId(prefix, n, width = ID_WIDTH) {
  return `${String(prefix).toUpperCase()}-${String(n).padStart(width, '0')}`;
}

/** The standard spelling of an id ("WI-7" -> "WI-007"), or null. */
export function canonicalId(value, prefix = null) {
  const p = parseId(value, prefix);
  return p ? formatId(p.prefix, p.n) : null;
}

/** True when the value is an id with this prefix. */
export function isItemId(value, prefix = DEFAULT_PREFIX) {
  const p = parseId(value);
  return Boolean(p) && p.prefix === String(prefix).toUpperCase();
}

export function sameId(a, b) {
  const pa = parseId(a);
  const pb = parseId(b);
  return Boolean(pa && pb && pa.prefix === pb.prefix && pa.n === pb.n);
}

// ------------------------------------------------------------------ small text helpers

/** True for template text such as "<Work item title>" or an empty value. */
export function isPlaceholder(value) {
  if (value === null || value === undefined) return true;
  const v = String(value).trim();
  if (v === '') return true;
  return /^<(?!https?:|br\b|!--|\/)[\s\S]*>\.?$/i.test(v);
}

/** True for "None", "None.", or a placeholder. */
export function isNoneText(value) {
  if (isPlaceholder(value)) return true;
  return /^[“"]?none(?: identified)?\.?[”"]?\.?$/i.test(String(value).trim());
}

function eolOf(text) {
  return String(text).includes('\r\n') ? '\r\n' : '\n';
}

function str(value) {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return value;
}

/** Normal form of a parent value: "none" or a canonical id; the raw text when it is neither. */
export function normalizeParent(value, prefix = null) {
  if (value === null || value === undefined) return 'none';
  const v = String(value).trim();
  if (v === '' || isPlaceholder(v) || v.toLowerCase() === 'none') return 'none';
  return canonicalId(v, prefix) || v;
}

// ------------------------------------------------------------------ parse and serialize

/**
 * Parse a Markdown record.
 * @returns {{ data: object, meta: object, body: string, hasFrontmatter: boolean, kind: 'record'|'design'|'other' }}
 *   data keeps the file's formatting for serialize(); meta is a plain copy with string values.
 */
export function parseDoc(text) {
  const parsed = frontmatter.parse(text);
  const meta = {};
  for (const [k, v] of Object.entries(parsed.data)) {
    const s = str(v);
    if (s !== undefined) meta[k] = s;
  }
  let kind = 'other';
  if (parsed.hasFrontmatter) {
    if (Object.prototype.hasOwnProperty.call(meta, 'work_item')) kind = 'design';
    else if (Object.prototype.hasOwnProperty.call(meta, 'id')) kind = 'record';
  }
  return { data: parsed.data, meta, body: parsed.body, hasFrontmatter: parsed.hasFrontmatter, kind };
}

/**
 * parseDoc that never throws. A frontmatter block the reader cannot read
 * (for example `title: [draft] login`, or a quote with no closing quote) gives
 * { doc: null, error: '<the reader's message>' }.
 * @returns {{ doc: object|null, error: string|null }}
 */
export function tryParseDoc(text) {
  try {
    return { doc: parseDoc(text), error: null };
  } catch (err) {
    return { doc: null, error: err && err.message ? err.message : String(err) };
  }
}

const ID_LINE_RE = /^id:[ \t]*["']?([A-Za-z][A-Za-z0-9]*-\d+)["']?[ \t]*(?:#.*)?$/m;
const WORK_ITEM_LINE_RE = /^work_item:[ \t]*["']?([A-Za-z][A-Za-z0-9]*-\d+)?/m;

/**
 * Look at the top of a file (its first 40 lines) without the frontmatter reader:
 * the id on an `id: WI-7` line, whether there is a `work_item:` line (and the
 * id on it), and whether the first line with text is a `key: value` line (a
 * frontmatter block that lost its opening --- line).
 * @returns {{ id: string|null, workItem: boolean, workItemId: string|null, startsWithKey: boolean }}
 */
export function peekHeader(text) {
  const head = String(text ?? '').split(/\r?\n/).slice(0, 40).join('\n');
  const m = ID_LINE_RE.exec(head);
  const w = WORK_ITEM_LINE_RE.exec(head);
  const first = head.split('\n').find((l) => l.trim() !== '' && l.trim() !== '---') || '';
  return {
    id: m ? canonicalId(m[1]) : null,
    workItem: Boolean(w),
    workItemId: w && w[1] ? canonicalId(w[1]) : null,
    startsWithKey: /^[A-Za-z_][A-Za-z0-9_]*:(?:[ \t]|$)/.test(first),
  };
}

/**
 * Set frontmatter keys on a parsed data object, keeping the file's formatting.
 * New keys go after the nearest earlier key in `order`. A key set to undefined
 * or null in the patch is removed.
 */
export function applyMetaPatch(data, patch = {}, order = FIELD_ORDER) {
  const added = [];
  for (const [k, v] of Object.entries(patch)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    if (v === undefined || v === null) {
      delete data[k];
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(data, k)) added.push(k);
    data[k] = v;
  }
  if (!added.length) return data;
  const keys = Object.keys(data).filter((k) => !added.includes(k));
  for (const k of added) {
    const pos = order.indexOf(k);
    let insertAfter = -1;
    if (pos !== -1) {
      for (let i = keys.length - 1; i >= 0; i--) {
        const kp = order.indexOf(keys[i]);
        if (kp !== -1 && kp < pos) {
          insertAfter = i;
          break;
        }
      }
      if (insertAfter === -1) {
        // Before the first known key that comes later in the order.
        const later = keys.findIndex((x) => order.indexOf(x) > pos);
        insertAfter = later === -1 ? keys.length - 1 : later - 1;
      }
    } else {
      insertAfter = keys.length - 1;
    }
    keys.splice(insertAfter + 1, 0, k);
  }
  const values = Object.fromEntries(keys.map((k) => [k, data[k]]));
  for (const k of Object.keys(data)) delete data[k];
  for (const k of keys) data[k] = values[k];
  return data;
}

// How the model writes values that YAML readers could misread (ARCHITECTURE 4.2):
// - waiting_on is always in double quotes, because the colon in
//   "external: Acme IT" stops standard YAML readers.
// - `no` (requirements_approved, result_approved, and the design's approved) is
//   written "no" in double quotes, as the model's DESIGN.md has it, so older YAML
//   readers do not read it as the value false. The frontmatter writer quotes it
//   because it is a YAML reserved word.
// - An approval ("2026-09-27 by Mike") is written in double quotes too, whether
//   `toolkit work approve` wrote it over "no" or `work new --covers` wrote it
//   in a new record, so every record shows the same form (sample run b, round 2).
// Unchanged lines are always written back exactly as they were read.
export const QUOTED_FIELDS = Object.freeze(['waiting_on', 'requirements_approved', 'result_approved', 'approved']);

/** Text of a parsed doc (data object from parseDoc) and a body. */
export function serializeDoc(data, body) {
  return frontmatter.stringify(data, body, { quoteKeys: QUOTED_FIELDS });
}

/** A fresh record text from a plain meta object (known keys first, in order) and a body. */
export function composeDoc(meta, body, order = FIELD_ORDER) {
  const data = {};
  for (const k of order) if (meta[k] !== undefined && meta[k] !== null) data[k] = meta[k];
  for (const [k, v] of Object.entries(meta)) {
    if (!order.includes(k) && v !== undefined && v !== null) data[k] = v;
  }
  return frontmatter.stringify(data, body, { quoteKeys: QUOTED_FIELDS });
}

// ------------------------------------------------------------------ H1

const H1_ID_RE = /^([A-Za-z][A-Za-z0-9]*-\d+)\s*[:—–-]\s*(.*)$/;

/**
 * The first level-1 heading: { id, title, text, start, end } or null.
 * For a design heading the " — solution design" suffix is removed from title.
 */
export function getH1(body) {
  const text = String(body ?? '');
  const node = flattenSections(splitSections(text)).find((n) => n.level === 1);
  if (!node) return null;
  const lineEnd = node.contentStart;
  const heading = node.heading;
  const m = H1_ID_RE.exec(heading);
  let id = null;
  let title = heading;
  if (m) {
    id = m[1];
    title = m[2].trim();
  }
  let suffix = '';
  const sfx = /\s+[—–-]\s+solution design$/i.exec(title);
  if (sfx) {
    suffix = sfx[0];
    title = title.slice(0, sfx.index).trim();
  }
  return { id, title, heading, suffix, start: node.start, end: lineEnd };
}

/** Put "# <id>: <title><suffix>" as the first level-1 heading (added at the top when missing). */
export function setH1(body, id, title, { suffix = '' } = {}) {
  const text = String(body ?? '');
  const eol = eolOf(text);
  const line = `# ${id}: ${title}${suffix}`;
  const h1 = getH1(text);
  if (!h1) {
    const lead = text.replace(/^(?:[ \t]*\r?\n)+/, '');
    return `${eol}${line}${eol}${lead ? eol + lead : ''}`;
  }
  const old = text.slice(h1.start, h1.end);
  const lineEol = old.endsWith('\r\n') ? '\r\n' : old.endsWith('\n') ? '\n' : '';
  return text.slice(0, h1.start) + line + lineEol + text.slice(h1.end);
}

// ------------------------------------------------------------------ sections

/** The text under a heading (without the heading line), or null when the section is missing. */
export function getSectionText(body, heading, opts = {}) {
  const node = getSection(String(body ?? ''), heading, opts);
  if (!node) return null;
  return node.content.replace(/^(?:[ \t]*\r?\n)+/, '').replace(/\s+$/, '');
}

/** The whole section with its heading line, or null. */
export function getSectionWhole(body, heading, opts = {}) {
  const node = getSection(String(body ?? ''), heading, opts);
  return node ? node.text.replace(/\s+$/, '') : null;
}

/** Replace the text under a heading. Sub-sections are replaced too. */
export function setSectionText(body, heading, text, opts = {}) {
  return replaceSection(String(body ?? ''), heading, text, opts);
}

/** The H2 section names in the body, in order. */
export function sectionNames(body) {
  return splitSections(String(body ?? '')).flatMap((n) => (n.level === 1 ? n.children : [n])).filter((n) => n.level === 2).map((n) => n.heading);
}

function sectionRange(body, section) {
  if (!section) return { start: 0, end: String(body).length };
  const node = getSection(String(body), section);
  if (!node) return null;
  return { start: node.contentStart, end: node.end };
}

function labelRe(label) {
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^([ \\t]*(?:[-*][ \\t]+)?)\\*\\*${esc}:\\*\\*[ \\t]?`, 'i');
}

const ANY_LABEL_RE = /^[ \t]*(?:[-*][ \t]+)?\*\*[^*]+:\*\*/;

function findLabel(body, label, section) {
  const text = String(body ?? '');
  const range = sectionRange(text, section);
  if (!range) return null;
  const re = labelRe(label);
  let pos = range.start;
  while (pos < range.end) {
    const nl = text.indexOf('\n', pos);
    const lineEnd = nl === -1 || nl > range.end ? range.end : nl;
    const line = text.slice(pos, lineEnd).replace(/\r$/, '');
    const m = re.exec(line);
    if (m) {
      const valueStart = pos + m[0].length;
      // The value runs to the end of the line, plus continuation lines.
      let end = pos + line.length;
      let next = nl === -1 ? range.end : nl + 1;
      while (next < range.end) {
        const nl2 = text.indexOf('\n', next);
        const e2 = nl2 === -1 || nl2 > range.end ? range.end : nl2;
        const l2 = text.slice(next, e2).replace(/\r$/, '');
        if (!l2.trim() || ANY_LABEL_RE.test(l2) || /^ {0,3}#/.test(l2) || /^[ \t]*[-*][ \t]/.test(l2) || /^[ \t]*\|/.test(l2)) break;
        end = next + l2.length;
        next = nl2 === -1 ? range.end : nl2 + 1;
      }
      return { lineStart: pos, valueStart, end };
    }
    if (nl === -1) break;
    pos = nl + 1;
  }
  return null;
}

/** The value after a bold label such as "**Next action:**", or null when missing. */
export function getLabel(body, label, { section } = {}) {
  const found = findLabel(body, label, section);
  if (!found) return null;
  const raw = String(body).slice(found.valueStart, found.end);
  return raw.split(/\r?\n/).map((l) => l.replace(/[ \t]+$/, '').trim()).join(' ').trim();
}

/** Replace the value after a bold label. Keeps a trailing two-space line break. Throws when missing. */
export function setLabel(body, label, value, { section } = {}) {
  const text = String(body ?? '');
  const found = findLabel(text, label, section);
  if (!found) {
    const err = new Error(`The label "${label}" was not found${section ? ` in ${section}` : ''}.`);
    err.code = 'LABEL_NOT_FOUND';
    throw err;
  }
  const old = text.slice(found.valueStart, found.end);
  const hardBreak = /[ \t]{2,}$/.test(old.split(/\r?\n/).pop()) ? '  ' : '';
  const clean = String(value ?? '').replace(/\r?\n/g, ' ').trim();
  return text.slice(0, found.valueStart) + clean + hardBreak + text.slice(found.end);
}

export function hasLabel(body, label, opts = {}) {
  return findLabel(body, label, opts.section) !== null;
}

// ------------------------------------------------------------------ tables in sections

/** The first table under a heading: { headers, rows, objects } (empty when missing). */
export function sectionTable(body, heading) {
  const node = getSection(String(body ?? ''), heading);
  if (!node) return { headers: [], rows: [], objects: [], found: false, sectionFound: false };
  const t = parseTable(node.content);
  return { headers: t.headers, rows: t.rows, objects: t.objects, found: t.found, sectionFound: true };
}

const TEMPLATE_WORDS = new Set(['open', 'in progress', 'not started']);

function templateLikeCell(c) {
  return c === '' || isPlaceholder(c) || /<[^<>\n]+>/.test(c) || /^(?:Q|R)-\d+$/.test(c) || /^(?:R|P)\d*-/.test(c) || TEMPLATE_WORDS.has(c.toLowerCase());
}

function isPlaceholderRow(cells) {
  return cells.some((c) => c !== '') && cells.every(templateLikeCell) && cells.some((c) => /<[^<>\n]+>/.test(c));
}

/** True when every cell that carries meaning is template text. */
export function isTemplateRow(cells) {
  return isPlaceholderRow(cells.map((c) => String(c ?? '').trim()));
}

/**
 * Add a row to the table under a heading. Rows that are only template text are
 * removed first. The section and table must exist.
 */
export function appendSectionRow(body, heading, cells) {
  const text = String(body ?? '');
  const node = getSection(text, heading);
  if (!node) {
    const err = new Error(`The section "${heading}" was not found.`);
    err.code = 'SECTION_NOT_FOUND';
    throw err;
  }
  const content = text.slice(node.contentStart, node.end);
  const table = parseTable(content);
  if (!table.found) {
    const err = new Error(`The section "${heading}" has no table.`);
    err.code = 'TABLE_NOT_FOUND';
    throw err;
  }
  let row = cells;
  if (Array.isArray(cells)) {
    row = cells.slice(0, table.headers.length).map((c) => String(c ?? ''));
    if (cells.length > table.headers.length) {
      row[table.headers.length - 1] = cells.slice(table.headers.length - 1).join(' | ');
    }
  }
  // Recent History is newest first (the model template's guide says so).
  const history = normalizeHeading(heading) === normalizeHeading('Recent History');
  const updated = appendTableRow(content, row, { dropPlaceholderRows: (r) => isTemplateRow(r), top: history });
  const out = text.slice(0, node.contentStart) + updated + text.slice(node.end);
  // The CLI writes Recent History rows, so the section's how-to guide goes with the first real row.
  return history ? removeSectionGuide(out, heading) : out;
}

/** Add a Recent History row: | date | change | effect |. */
export function appendHistory(body, { date, change, effect = '' }) {
  return appendSectionRow(body, 'Recent History', [date, change, effect]);
}

/**
 * Take out the newest Recent History row with this date and change text
 * (used to undo a row a failed command wrote). The body is returned unchanged
 * when no row matches.
 */
export function removeHistoryRow(body, { date, change }) {
  const text = String(body ?? '');
  const node = getSection(text, 'Recent History');
  if (!node) return text;
  const content = text.slice(node.contentStart, node.end);
  const t = parseTable(content);
  if (!t.found) return text;
  const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
  const r = t.objects.findIndex((o) => norm(o.Date) === norm(date) && norm(o['Change or decision']) === norm(change));
  if (r === -1) return text;
  const span = t.rowSpans[r];
  return text.slice(0, node.contentStart) + content.slice(0, span.start) + content.slice(span.end) + text.slice(node.end);
}

// The model's fill-in guides are HTML comments. The item-level guide says
// "Delete this guide after filling the item"; each section guide explains how
// to fill that section.
const ITEM_GUIDE_RE = /<!--\s*Fill-in guide\b[\s\S]*?-->[ \t]*(?:\r?\n)?(?:[ \t]*\r?\n)?/;
const LEADING_COMMENT_RE = /^(\s*)<!--[\s\S]*?-->[ \t]*(?:\r?\n)?(?:[ \t]*\r?\n)?/;

/** True when the body still has the template's item-level fill-in guide comment. */
export function hasItemGuide(body) {
  return ITEM_GUIDE_RE.test(String(body ?? ''));
}

/** The body without the template's item-level fill-in guide comment. */
export function removeItemGuide(body) {
  return String(body ?? '').replace(ITEM_GUIDE_RE, '');
}

/** True when a section (with its sub-sections) still holds a template guide comment. */
export function hasSectionGuide(body, heading) {
  const node = getSection(String(body ?? ''), heading);
  return Boolean(node) && /<!--[\s\S]*?-->/.test(node.content);
}

/**
 * The body without the template's fill-in guide comments: every HTML comment
 * block that is word for word one of the template's own comments, wherever it
 * stands. A comment the owner or an agent wrote is kept.
 */
export function removeTemplateComments(body, templateText) {
  let text = String(body ?? '');
  let tpl = String(templateText ?? '');
  try {
    tpl = parseDoc(tpl).body;
  } catch {
    // A template without frontmatter is used as it is.
  }
  const comments = [...new Set(tpl.match(/<!--[\s\S]*?-->/g) || [])];
  for (const c of comments) {
    const esc = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    text = text.replace(new RegExp(`(^|\\n)[ \\t]*${esc}[ \\t]*(?:\\r?\\n)?(?:[ \\t]*\\r?\\n)?`, 'g'), '$1');
  }
  return text;
}

/** The body without the guide comment at the top of one section (the section itself stays). */
export function removeSectionGuide(body, heading) {
  const text = String(body ?? '');
  const node = getSection(text, heading);
  if (!node) return text;
  const content = text.slice(node.contentStart, node.end);
  const m = LEADING_COMMENT_RE.exec(content);
  if (!m) return text;
  const updated = m[1] + content.slice(m[0].length);
  return text.slice(0, node.contentStart) + updated + text.slice(node.end);
}

/** Split "a | b | c" (pipes escaped with \| stay in the cell) into cells. */
export function splitRowText(text) {
  let s = String(text ?? '').trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells = [];
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && s[i + 1] === '|') {
      cur += '|';
      i++;
      continue;
    }
    if (s[i] === '|') {
      cells.push(cur.trim());
      cur = '';
      continue;
    }
    cur += s[i];
  }
  cells.push(cur.trim());
  return cells;
}

// ------------------------------------------------------------------ structured reads of the body

/** Roadmap rows: [{ phase, id, name, outcome, status, exit, subItems: [ids], placeholder }]. */
export function parseRoadmap(body) {
  const t = sectionTable(body, 'Roadmap');
  return t.objects.map((o, i) => {
    const phase = o.Phase ?? '';
    const m = /^(P\d+)\s*[—–-]?\s*(.*)$/.exec(phase);
    const sub = o['Sub-items'] ?? '';
    return {
      phase,
      id: m ? m[1] : null,
      name: m ? m[2].trim() : phase,
      outcome: o.Outcome ?? '',
      status: o.Status ?? '',
      exit: o['Exit result'] ?? '',
      subItems: isNoneText(sub) ? [] : (sub.match(/[A-Za-z][A-Za-z0-9]*-\d+/g) || []),
      placeholder: isTemplateRow(t.rows[i]) || isPlaceholder(m ? m[2] : phase),
    };
  });
}

const TASK_RE = /^[ \t]*[-*][ \t]+\[([ xX])\][ \t]+\*\*(P\d+-T\d+)[ \t]*[—–-][ \t]*(.*?)\*\*(?:[ \t]*[·|][ \t]*(.*?))?[ \t]*$/;

/** Task lines: [{ id, name, done, status, dependsOn: [ids], line }]. */
export function parseTasks(body) {
  const text = getSectionWhole(body, 'Tasks');
  if (text === null) return [];
  const lines = text.split(/\r?\n/);
  const tasks = [];
  let current = null;
  lines.forEach((line, idx) => {
    const m = TASK_RE.exec(line);
    if (m) {
      current = { id: m[2], name: m[3].trim(), done: m[1].toLowerCase() === 'x', status: (m[4] || '').trim(), dependsOn: [], dependsOnText: '', line: idx + 1 };
      tasks.push(current);
      return;
    }
    if (current) {
      const d = /\*\*Depends on:\*\*\s*(.*)$/.exec(line);
      if (d) {
        current.dependsOnText = d[1].trim();
        current.dependsOn = isNoneText(current.dependsOnText) ? [] : (current.dependsOnText.match(/P\d+-T\d+/g) || []);
      }
    }
  });
  return tasks;
}

/** Requirement blocks: [{ id, title, status, openQuestions, placeholder }]. */
export function parseRequirements(body) {
  const req = getSection(String(body ?? ''), 'Requirements');
  if (!req) return [];
  const out = [];
  for (const n of flattenSections(req.children)) {
    const m = /^(R-\d+)\s*[—–-]?\s*(.*)$/.exec(n.heading);
    if (!m) continue;
    const status = getLabel(n.text, 'Status');
    const oq = getLabel(n.text, 'Open questions');
    out.push({
      id: m[1],
      title: m[2].trim(),
      status: status ?? '',
      openQuestions: oq && !isNoneText(oq) ? (oq.match(/Q-\d+/g) || []) : [],
      placeholder: isPlaceholder(m[2]),
    });
  }
  return out;
}

/** Open Questions rows: [{ id, question, affects, status, from, placeholder }]. */
export function parseQuestions(body) {
  const t = sectionTable(body, 'Open Questions');
  return t.objects.map((o, i) => ({
    id: o.ID ?? '',
    question: o.Question ?? '',
    affects: o.Affects ?? '',
    status: o.Status ?? '',
    from: o['Decision needed from'] ?? '',
    placeholder: isTemplateRow(t.rows[i]) || isPlaceholder(o.Question),
  }));
}

/** Recent History rows: [{ date, change, effect }]. */
export function parseHistory(body) {
  const t = sectionTable(body, 'Recent History');
  return t.objects
    .map((o, i) => ({ date: o.Date ?? '', change: o['Change or decision'] ?? '', effect: o['Effect on the work'] ?? '', placeholder: isTemplateRow(t.rows[i]) }))
    .filter((r) => !r.placeholder);
}

/** True when an Open Questions row is waiting on the owner. */
export function isOpenOwnerQuestion(q, ownerName = null) {
  if (q.placeholder) return false;
  const status = String(q.status || '').trim().toLowerCase();
  if (status && !['open', 'waiting', 'pending', 'asked'].includes(status)) return false;
  const from = String(q.from || '').trim().toLowerCase().replace(/\.$/, '');
  if (from === 'owner') return true;
  return Boolean(ownerName) && from === String(ownerName).trim().toLowerCase();
}

/** The Overview values as an object keyed by label. */
export function overview(body) {
  const out = {};
  for (const label of OVERVIEW_LABELS) out[label] = getLabel(body, label, { section: 'Overview' });
  return out;
}

// ------------------------------------------------------------------ derived values

/** "Finalized" when requirements_approved records an approval, else "Refining". */
export function overallFor(requirementsApproved) {
  return isApproved(requirementsApproved) ? 'Finalized' : 'Refining';
}

/** The status a record should show: terminal statuses stay; otherwise the stage decides. */
export function derivedStatus(meta) {
  if (isTerminal(meta.status)) return meta.status;
  return statusForStage(meta.stage) || meta.status || null;
}

/** True when the item is blocked: waiting on the owner or someone outside, or a Blockers line. */
export function isBlocked(meta, body = '') {
  const w = normalizeWaitingOn(meta.waiting_on);
  if (w === 'owner' || (w && w.startsWith('external:'))) return true;
  const b = getLabel(body, 'Blockers', { section: 'Overview' });
  return b !== null && !isNoneText(b);
}

// ------------------------------------------------------------------ gates

/**
 * Approval gates a record breaks. Each is a question for the owner, never an automatic fix.
 * @returns {Array<{ code: string, message: string, question: string }>}
 */
export function checkGates(meta, { body } = {}) {
  const gates = [];
  const id = meta.id || 'This item';
  const n = stageNumber(meta.stage);
  const reqApproved = isApproved(meta.requirements_approved);
  const codes = brokenGates(meta);
  if (codes.includes('requirements_not_approved')) {
    gates.push({
      code: 'requirements_not_approved',
      message: `${id} is a ${meta.type} item at ${n !== null ? meta.stage : meta.status} with no recorded requirements approval.`,
      question: `Was moving ${id} to ${n !== null ? meta.stage : meta.status} the owner's requirements approval? If yes: toolkit work approve ${id} --requirements --by <name>. If no: toolkit work set ${id} --stage 02-refinement.`,
    });
  }
  if (codes.includes('done_without_result_approval')) {
    gates.push({
      code: 'done_without_result_approval',
      message: `${id} is Done with no recorded result approval.`,
      question: `Did the owner approve the result of ${id}? If yes: toolkit work approve ${id} --result --by <name>. If no: toolkit work set ${id} --stage 11-user-approval --reopen.`,
    });
  }
  if (body !== undefined && body !== null) {
    const overall = getLabel(body, 'Overall status', { section: 'Requirements' });
    if (overall && /^finali[sz]ed$/i.test(overall) && !reqApproved) {
      gates.push({
        code: 'finalized_without_approval',
        message: `${id} says its requirements are Finalized, but no requirements approval is recorded.`,
        question: `Did the owner approve the requirements of ${id}? If yes: toolkit work approve ${id} --requirements --by <name>.`,
      });
    }
  }
  return gates;
}

// ------------------------------------------------------------------ validation

function problem(list, code, message, extra = {}) {
  list.push({ code, message, ...extra });
}

/**
 * Check a WORK-ITEM.md record.
 * @param {string|{meta: object, body: string, hasFrontmatter?: boolean}} input the file text, or a parsed { meta, body }
 * @param {object} [opts]
 * @param {string} [opts.prefix] the tracker's id prefix
 * @param {Set<string>|string[]} [opts.knownIds] canonical ids of every item, to check references
 * @param {string} [opts.ownerName] the owner's name from .toolkit.json
 * @param {string} [opts.locationParent] the parent the folder location gives (local tracker)
 * @returns {{ ok: boolean, errors: object[], warnings: object[], gates: object[] }}
 */
export function validateRecord(input, opts = {}) {
  const errors = [];
  const warnings = [];
  let meta;
  let body;
  let hasFm = true;
  if (typeof input === 'string') {
    const { doc, error } = tryParseDoc(input);
    if (!doc) {
      problem(errors, 'bad_frontmatter', `The frontmatter cannot be read (${error}).`);
      return { ok: false, errors, warnings, gates: [] };
    }
    meta = doc.meta;
    body = doc.body;
    hasFm = doc.hasFrontmatter;
  } else {
    meta = { ...(input.meta || {}) };
    body = input.body ?? '';
    hasFm = input.hasFrontmatter !== false;
  }
  const prefix = (opts.prefix || DEFAULT_PREFIX).toUpperCase();
  const known = opts.knownIds ? new Set([...opts.knownIds].map((x) => canonicalId(x) || x)) : null;

  if (!hasFm) {
    problem(errors, 'no_frontmatter', 'The record has no frontmatter block (--- lines at the top).');
    return { ok: false, errors, warnings, gates: [] };
  }
  const id = meta.id;
  const idParsed = parseId(id);
  if (!id || !idParsed) problem(errors, 'bad_id', `id "${id ?? ''}" is not a work item id such as ${prefix}-001.`);
  else if (idParsed.prefix !== prefix) problem(errors, 'bad_id_prefix', `id ${id} does not use this project's prefix ${prefix}.`);

  if (isPlaceholder(meta.title)) problem(errors, 'no_title', 'title is missing or still the template text.');

  if (isPlaceholder(meta.type)) problem(errors, 'no_type', 'type is missing or still the template text.');
  else if (!isValidType(meta.type)) problem(errors, 'bad_type', `type "${meta.type}" is not a lower-case word such as build or task.`);
  else if (!isKnownType(meta.type)) problem(warnings, 'unknown_type', `type "${meta.type}" is not one of the standard types; it is kept.`);

  const stageKnown = findStage(meta.stage);
  if (isPlaceholder(meta.stage)) problem(warnings, 'no_stage', 'stage is not set.');
  else if (!stageKnown) problem(warnings, 'unknown_stage', `stage "${meta.stage}" is not one of the 14 stages; it is kept as written.`);
  else if (stageKnown.id !== meta.stage) problem(warnings, 'stage_spelling', `stage "${meta.stage}" should be written ${stageKnown.id}.`);

  if (!isStatus(meta.status)) problem(errors, 'bad_status', `status "${meta.status ?? ''}" is not one of ${STATUSES.join(', ')}.`);
  else if (stageKnown && !isTerminal(meta.status) && statusForStage(stageKnown.id) !== meta.status) {
    problem(warnings, 'status_stage_mismatch', `status ${meta.status} does not match stage ${stageKnown.id} (which gives ${statusForStage(stageKnown.id)}). It is kept; toolkit work set ${id} --stage <stage> sets both.`);
  }

  const parent = normalizeParent(meta.parent, prefix);
  if (meta.parent === undefined) problem(warnings, 'no_parent', 'parent is missing; write parent: none for a top-level item.');
  else if (parent !== 'none' && !parseId(parent)) problem(errors, 'bad_parent', `parent "${meta.parent}" is not an id or none.`);
  else if (parent !== 'none' && idParsed && sameId(parent, id)) problem(errors, 'self_parent', 'parent names the item itself.');
  else if (parent !== 'none' && known && !known.has(canonicalId(parent))) problem(warnings, 'missing_parent', `parent ${parent} is not a known item.`);
  if (opts.locationParent !== undefined && normalizeParent(opts.locationParent, prefix) !== parent) {
    problem(warnings, 'parent_location_mismatch', `parent is ${parent}, but the folder location gives ${opts.locationParent}. Move it with toolkit work move ${id} --under <id|root>.`);
  }

  if (meta.waiting_on === undefined || isPlaceholder(meta.waiting_on)) problem(warnings, 'no_waiting_on', 'waiting_on is not set; use none when nothing is waited on.');
  else if (!normalizeWaitingOn(meta.waiting_on)) problem(errors, 'bad_waiting_on', `waiting_on "${meta.waiting_on}" is not owner, agent, none, or external: <who>.`);

  if (meta.priority === undefined || isPlaceholder(meta.priority)) problem(warnings, 'no_priority', 'priority is not set.');
  else if (!PRIORITIES.includes(meta.priority)) problem(errors, 'bad_priority', `priority "${meta.priority}" is not one of ${PRIORITIES.join(', ')}.`);

  if (meta.delivery === undefined || isPlaceholder(meta.delivery)) problem(warnings, 'no_delivery', 'delivery is not set; use not-offered until the owner is asked.');
  else if (!DELIVERY.includes(meta.delivery)) problem(errors, 'bad_delivery', `delivery "${meta.delivery}" is not one of ${DELIVERY.join(', ')}.`);

  for (const key of ['requirements_approved', 'result_approved']) {
    const v = meta[key];
    if (v === undefined || isPlaceholder(v)) problem(warnings, `no_${key}`, `${key} is not set; use no until the owner approves.`);
    else if (!parseApproval(v).ok) problem(errors, `bad_${key}`, `${key} "${v}" must be no or YYYY-MM-DD by <name>.`);
  }
  if (meta.design === undefined || isPlaceholder(meta.design)) problem(warnings, 'no_design', 'design is not set; use none when there is no design.');
  else if (!ITEM_DESIGN_VALUES.includes(meta.design)) problem(errors, 'bad_design', `design "${meta.design}" is not one of ${ITEM_DESIGN_VALUES.join(', ')}.`);
  if (meta.updated !== undefined && !isPlaceholder(meta.updated) && !DATE_RE.test(meta.updated)) problem(warnings, 'bad_updated', `updated "${meta.updated}" is not a YYYY-MM-DD date.`);

  if (hasItemGuide(body) && ((stageKnown && stageKnown.n >= 3) || isTerminal(meta.status))) {
    problem(warnings, 'guide_left', `The template's fill-in guide comment is still at the top of the body. It says to delete it once the item is filled. Remove it with: toolkit work edit ${id || '<id>'} --remove-guide`);
  }
  for (const k of Object.keys(meta)) {
    if (DROPPED_FIELDS.includes(k)) problem(warnings, 'dropped_field', `${k} is no longer used; remove it (requirements_approved and the Roadmap replace it).`);
    else if (!FIELD_ORDER.includes(k)) problem(warnings, 'unknown_field', `frontmatter key ${k} is not a work item field; it is kept.`);
  }

  // Body.
  const h1 = getH1(body);
  if (!h1) problem(errors, 'no_h1', `The body has no "# ${id || prefix + '-001'}: <title>" heading.`);
  else {
    if (!h1.id || (idParsed && !sameId(h1.id, id))) problem(errors, 'h1_id_mismatch', `The heading "# ${h1.heading}" does not start with the id ${id}.`);
    else if (!isPlaceholder(meta.title) && h1.title !== meta.title) problem(warnings, 'h1_title_mismatch', `The heading title "${h1.title}" differs from title "${meta.title}". toolkit work sync applies the change.`);
  }

  const names = sectionNames(body).map(normalizeHeading);
  const missing = SECTIONS.filter((s) => !names.includes(normalizeHeading(s)));
  for (const s of missing) problem(errors, 'missing_section', `The section "## ${s}" is missing.`);
  if (!missing.length) {
    const order = SECTIONS.map((s) => names.indexOf(normalizeHeading(s)));
    if (order.some((v, i) => i > 0 && v < order[i - 1])) problem(warnings, 'section_order', `The sections are not in the order ${SECTIONS.join(', ')}.`);
  }

  if (names.includes('overview')) {
    for (const label of OVERVIEW_LABELS) {
      if (!hasLabel(body, label, { section: 'Overview' })) problem(warnings, 'missing_label', `Overview has no "**${label}:**" line.`);
    }
    const related = getLabel(body, 'Related items', { section: 'Overview' });
    if (related && !isPlaceholder(related) && /(?:\.work-items\/|[\w-]+\/[\w.-]+\.md\b|WORK-ITEM\.md)/.test(related)) {
      problem(warnings, 'related_paths', 'Related items should name items by id (for example WI-004), not by path.');
    }
  }

  if (names.includes('requirements')) {
    const overall = getLabel(body, 'Overall status', { section: 'Requirements' });
    if (overall === null) problem(warnings, 'no_overall_status', 'Requirements has no "**Overall status:**" line.');
    else if (!isPlaceholder(meta.requirements_approved) && parseApproval(meta.requirements_approved).ok && overall !== overallFor(meta.requirements_approved)) {
      problem(warnings, 'overall_status_mismatch', `Overall status is "${overall}" but requirements_approved is "${meta.requirements_approved}" (which gives ${overallFor(meta.requirements_approved)}).`);
    }
    const reqs = parseRequirements(body);
    const seen = new Set();
    for (const r of reqs) {
      if (seen.has(r.id)) problem(errors, 'duplicate_requirement', `Requirement ${r.id} appears twice.`);
      seen.add(r.id);
      if (r.status && !isPlaceholder(r.status) && !REQUIREMENT_STATUSES.includes(r.status)) {
        problem(warnings, 'bad_requirement_status', `${r.id} status "${r.status}" is not one of ${REQUIREMENT_STATUSES.join(', ')}.`);
      }
    }
    if (isApproved(meta.requirements_approved)) {
      const goal = getSectionText(body, 'Agreed goal');
      if (goal !== null && isPlaceholder(goal)) problem(warnings, 'goal_placeholder', 'Requirements are approved, but the Agreed goal still holds the template text.');
    }
  }

  if (names.includes('open questions')) {
    const t = sectionTable(body, 'Open Questions');
    if (!t.found) problem(warnings, 'no_questions_table', 'Open Questions has no table.');
    else {
      const qs = parseQuestions(body);
      const seen = new Set();
      for (const q of qs) {
        if (q.placeholder) continue;
        if (!/^Q-\d+$/.test(String(q.id || '').trim())) {
          problem(warnings, 'bad_question_id', `An Open Questions row has the ID "${q.id || ''}", not a question id such as Q-01. Each row is one question; remove a row that is not a question (a "None" row is not needed).`);
        }
        if (q.id && seen.has(q.id)) problem(errors, 'duplicate_question', `Question ${q.id} appears twice.`);
        if (q.id) seen.add(q.id);
        if (opts.ownerName && q.from.trim().toLowerCase() === String(opts.ownerName).trim().toLowerCase()) {
          problem(warnings, 'owner_by_name', `${q.id || 'A question'} names the owner as "${q.from}"; write owner so the decision list finds it.`);
        }
      }
    }
  }

  if (names.includes('recent history')) {
    const t = sectionTable(body, 'Recent History');
    if (!t.found) problem(warnings, 'no_history_table', 'Recent History has no table.');
  }

  // From tracking setup (stage 07) on, the item has a plan in the template's
  // form: a phase table and checkbox tasks, with no template example left
  // (sample runs a and c, round 2: a Roadmap written as headings, and one left
  // as the template, both passed validation).
  const planned = Boolean(stageKnown && stageKnown.n >= 7);
  const PLAN_REF = 'the work plugin\'s skills/work-on/references/planning.md';
  if (names.includes('roadmap')) {
    const t = sectionTable(body, 'Roadmap');
    if (t.found && !t.headers.some((h) => normalizeHeading(h) === 'sub-items')) problem(warnings, 'no_subitems_column', 'The Roadmap table has no "Sub-items" column.');
    const rows = parseRoadmap(body);
    if (known) {
      for (const row of rows) {
        for (const sub of row.subItems) {
          if (!known.has(canonicalId(sub))) problem(warnings, 'missing_subitem', `Roadmap ${row.id || row.phase} lists ${sub}, which is not a known item.`);
        }
      }
    }
    for (const row of rows) {
      if (row.placeholder || isPlaceholder(row.status)) continue;
      const st = String(row.status).trim().replace(/\.$/, '').toLowerCase();
      if (!PHASE_STATUSES.map((s) => s.toLowerCase()).includes(st)) {
        problem(warnings, 'roadmap_status', `Roadmap ${row.id || row.phase} has the status "${row.status}"; a phase status is one of ${PHASE_STATUSES.join(', ')}.`);
      } else if (meta.status === 'Done' && !['done', 'cancelled'].includes(st)) {
        problem(warnings, 'roadmap_open_after_done', `${id || 'The item'} is Done, but Roadmap ${row.id || row.phase} still says ${row.status}. Set each finished phase to Done (toolkit work edit ${id || '<id>'} --section Roadmap).`);
      }
    }
    if (planned) {
      if (!t.found) problem(warnings, 'no_roadmap_table', `The Roadmap has no phase table (| Phase | Outcome | Status | Exit result | Sub-items |). Write the plan in the template's form (${PLAN_REF}).`);
      else if (rows.some((r) => r.placeholder)) problem(warnings, 'roadmap_placeholder', `The Roadmap still has the template's example row (P1 — <Phase 1 name>). Replace it with the real phases (${PLAN_REF}).`);
      if (hasSectionGuide(body, 'Roadmap')) problem(warnings, 'section_guide_left', 'The Roadmap still has the template\'s fill-in guide comment. Write the section again without it.');
    }
  }

  if (names.includes('tasks')) {
    const tasks = parseTasks(body);
    const ids = new Set();
    for (const t of tasks) {
      if (ids.has(t.id)) problem(errors, 'duplicate_task', `Task ${t.id} appears twice.`);
      ids.add(t.id);
    }
    for (const t of tasks) {
      for (const d of t.dependsOn) if (!ids.has(d)) problem(warnings, 'missing_dependency', `${t.id} depends on ${d}, which is not a task in this item.`);
    }
    if (planned) {
      if (!tasks.length) problem(warnings, 'no_task_lines', `Tasks has no task lines ("- [ ] **P1-T01 — <name>** · <status>"). Write the tasks in the template's checkbox form (${PLAN_REF}).`);
      else if (tasks.some((t) => isPlaceholder(t.name))) problem(warnings, 'tasks_placeholder', `Tasks still has the template's example task (P1-T01 — <Task 1 name>). Replace it with the real tasks (${PLAN_REF}).`);
      if (hasSectionGuide(body, 'Tasks')) problem(warnings, 'section_guide_left', 'Tasks still has the template\'s fill-in guide comment. Write the section again without it.');
    }
    // Sample run c, round 3: a task's fields written on the task line itself.
    const joined = taskFieldsJoined(body);
    if (joined.length) {
      problem(warnings, 'task_fields_joined', `${joined.join(', ')} ${joined.length === 1 ? 'has' : 'have'} **Work:**, **Deliverable:**, **Done when:**, or **Depends on:** on the task line. Put each field on its own line under the task (toolkit work edit ${id || '<id>'} --section Tasks does this when the text is saved again).`);
    }
  }

  // A finished item's Overview says it is finished (sample run d, round 3:
  // Done items kept "Blockers: Local merge to main needs Mike's approval").
  if (isTerminal(meta.status) && names.includes('overview')) {
    const blockers = getLabel(body, 'Blockers', { section: 'Overview' });
    if (blockers !== null && !isNoneText(blockers)) {
      problem(warnings, 'terminal_blockers', `${id || 'The item'} is ${meta.status}, but Blockers in its Overview still says: ${String(blockers).trim().replace(/\.+$/, '')}. Set it to None: toolkit work edit ${id || '<id>'} --label Blockers --value "None."`);
    }
  }

  // Every sub-item is named in the Roadmap's Sub-items column once the plan is written.
  if (planned && Array.isArray(opts.children) && opts.children.length && names.includes('roadmap')) {
    const rows = parseRoadmap(body).filter((r) => !r.placeholder);
    if (rows.length) {
      const listed = new Set(rows.flatMap((r) => r.subItems.map((s) => canonicalId(s) || s)));
      const missingKids = opts.children.map((c) => canonicalId(c) || c).filter((c) => !listed.has(c));
      if (missingKids.length) {
        problem(warnings, 'subitem_not_in_roadmap', `The Roadmap's Sub-items column does not name ${missingKids.join(', ')}. Put each sub-item in the row of the phase it belongs to.`);
      }
    }
  }

  const gates = checkGates(meta, { body });
  return { ok: errors.length === 0 && gates.length === 0, errors, warnings, gates };
}

/**
 * Check a DESIGN.md.
 * @param {string|{meta: object, body: string}} input
 * @param {{ itemId?: string, itemBody?: string, itemMeta?: object }} [opts]
 */
export function validateDesign(input, opts = {}) {
  const errors = [];
  const warnings = [];
  let meta;
  let body;
  let hasFm = true;
  if (typeof input === 'string') {
    const { doc, error } = tryParseDoc(input);
    if (!doc) {
      problem(errors, 'bad_frontmatter', `The frontmatter cannot be read (${error}).`);
      return { ok: false, errors, warnings, gates: [] };
    }
    meta = doc.meta;
    body = doc.body;
    hasFm = doc.hasFrontmatter;
  } else {
    meta = { ...(input.meta || {}) };
    body = input.body ?? '';
  }
  if (!hasFm) {
    problem(errors, 'no_frontmatter', 'The design has no frontmatter block (work_item, status, approved).');
    return { ok: false, errors, warnings, gates: [] };
  }
  if (!parseId(meta.work_item)) problem(errors, 'bad_work_item', `work_item "${meta.work_item ?? ''}" is not a work item id.`);
  else if (opts.itemId && !sameId(meta.work_item, opts.itemId)) problem(errors, 'work_item_mismatch', `work_item ${meta.work_item} does not match ${opts.itemId}.`);
  if (!DESIGN_STATUSES.includes(meta.status)) problem(errors, 'bad_design_status', `status "${meta.status ?? ''}" is not one of ${DESIGN_STATUSES.join(', ')}.`);
  if (meta.approved === undefined) problem(warnings, 'no_approved', 'approved is missing; use no until the owner approves.');
  else if (!parseApproval(meta.approved).ok) problem(errors, 'bad_approved', `approved "${meta.approved}" must be no or YYYY-MM-DD by <name>.`);
  const gates = [];
  if (meta.status === 'approved' && !isApproved(meta.approved)) {
    gates.push({
      code: 'design_approved_without_record',
      message: `The design for ${meta.work_item} says approved, but no approval is recorded.`,
      question: `Did the owner approve this design? If yes: toolkit work approve ${meta.work_item} --design --by <name>.`,
    });
  }
  const h1 = getH1(body);
  if (!h1) problem(warnings, 'no_h1', 'The design has no "# <id>: <title> — solution design" heading.');
  else if (h1.id && meta.work_item && !sameId(h1.id, meta.work_item)) problem(warnings, 'h1_id_mismatch', `The heading id ${h1.id} differs from work_item ${meta.work_item}.`);
  const bodyStatus = designStatusLine(body);
  if (bodyStatus && DESIGN_STATUSES.includes(meta.status) && !isPlaceholder(bodyStatus.value)
    && !DESIGN_LINE_WORDS[meta.status].includes(bodyStatus.value.toLowerCase())) {
    problem(warnings, 'status_line_mismatch', `The "${bodyStatus.label}" line says ${bodyStatus.value} but the frontmatter says ${meta.status}.`);
  }
  if (opts.itemMeta && opts.itemMeta.design && DESIGN_STATUSES.includes(meta.status) && opts.itemMeta.design !== meta.status) {
    problem(warnings, 'item_design_mismatch', `The work item says design: ${opts.itemMeta.design}, but the design says ${meta.status}.`);
  }
  if (meta.status === 'approved' && opts.templateText) {
    for (const w of approvedDesignGaps(body, opts.templateText)) problem(warnings, w.code, w.message);
  }
  if (opts.itemBody) {
    const reqIds = new Set(parseRequirements(opts.itemBody).map((r) => r.id));
    for (const n of flattenSections(splitSections(body))) {
      const m = /^(R-\d+)\b/.exec(n.heading);
      if (m && n.level >= 3 && reqIds.size && !reqIds.has(m[1])) {
        problem(warnings, 'unknown_requirement', `The design covers ${m[1]}, which is not a requirement in the work item.`);
      }
    }
  }
  return { ok: errors.length === 0 && gates.length === 0, errors, warnings, gates };
}

/** Design sections the model's template says to remove when they do not apply. */
const OPTIONAL_DESIGN_SECTIONS = Object.freeze(['Option comparison']);
/** Sections of an approved design that a builder reads, with the sub-sections each must keep. */
const BUILD_SECTIONS = Object.freeze(['Selected design', 'Build and verification plan']);

/**
 * What an approved design is missing compared with the model's DESIGN.md
 * template (sample run b, round 3: an approved design had no Diagrams section
 * and a one-paragraph Selected design, and validate said nothing):
 * - a "## " section of the template (Option comparison is optional);
 * - a "### " sub-section of Selected design or Build and verification plan;
 * - a template prompt ("<...>") or "Pending owner decision" left in those two sections.
 * @returns {Array<{ code: string, message: string }>}
 */
export function approvedDesignGaps(body, templateText) {
  const out = [];
  let tplBody = String(templateText ?? '');
  try {
    tplBody = parseDoc(tplBody).body;
  } catch {
    // A template without frontmatter is read as it is.
  }
  const have = new Set(sectionNames(body).map(normalizeHeading));
  const wanted = sectionNames(tplBody).filter((s) => !OPTIONAL_DESIGN_SECTIONS.some((o) => normalizeHeading(o) === normalizeHeading(s)));
  const missing = wanted.filter((s) => !have.has(normalizeHeading(s)));
  if (missing.length) {
    out.push({ code: 'design_section_missing', message: `The approved design has no ${missing.map((s) => `"## ${s}"`).join(', ')} section${missing.length === 1 ? '' : 's'}; the template has ${missing.length === 1 ? 'it' : 'them'}. A builder reads the whole design.` });
  }
  for (const name of BUILD_SECTIONS) {
    const tpl = getSection(tplBody, name);
    const mine = getSection(String(body ?? ''), name);
    if (!tpl || !mine) continue;
    const mineSubs = new Set(flattenSections(mine.children).map((n) => normalizeHeading(n.heading)));
    const subsMissing = tpl.children.map((n) => n.heading).filter((h) => !mineSubs.has(normalizeHeading(h)));
    if (subsMissing.length) {
      out.push({ code: 'design_subsection_missing', message: `"## ${name}" in the approved design has no ${subsMissing.map((h) => `"### ${h}"`).join(', ')}.` });
    }
    const text = mine.content;
    const prompt = /<(?!!--|br\b|\/|https?:)[A-Z][^<>\n]{2,}>/.exec(text.replace(/```[\s\S]*?```/g, ''));
    const pending = /pending owner decision|after (?:mike|the owner) chooses/i.exec(text);
    if (prompt || pending) {
      out.push({ code: 'design_prompt_left', message: `"## ${name}" in the approved design still holds template text (${prompt ? prompt[0] : pending[0]}). Write the chosen design there.` });
    }
  }
  return out;
}

// ------------------------------------------------------------------ new records

/**
 * Build a new WORK-ITEM.md text from a template.
 * @param {string} templateText the template file text
 * @param {object} f fields: id, title, type, stage, status, parent, waiting_on, priority, delivery,
 *   requirements_approved, design, result_approved, updated (all strings), request (optional
 *   Starting request text), historyChange, historyEffect.
 */
export function newRecordText(templateText, f) {
  const tpl = parseDoc(templateText);
  const meta = {};
  for (const k of FIELD_ORDER) if (f[k] !== undefined && f[k] !== null) meta[k] = String(f[k]);
  for (const [k, v] of Object.entries(tpl.meta)) {
    if (FIELD_ORDER.includes(k) || DROPPED_FIELDS.includes(k) || k === 'work_item') continue;
    meta[k] = v;
  }
  let body = tpl.body;
  body = setH1(body, meta.id, meta.title);
  if (hasLabel(body, 'Overall status', { section: 'Requirements' })) {
    body = setLabel(body, 'Overall status', overallFor(meta.requirements_approved), { section: 'Requirements' });
  }
  if (f.request && getSection(body, 'Starting request')) {
    body = setSectionText(body, 'Starting request', String(f.request).trim());
  }
  if (getSection(body, 'Recent History') && sectionTable(body, 'Recent History').found) {
    body = appendHistory(body, {
      date: meta.updated,
      change: f.historyChange || `Created as ${meta.id}.`,
      effect: f.historyEffect || `Starts at ${stageShort(meta.stage)}. Continue with ${continueWith(meta)}.`,
    });
  }
  return composeDoc(meta, body);
}

/** True when a body has none of the seven sections: text the owner wrote freely, not from the template. */
export function isFreeForm(body) {
  const names = new Set(sectionNames(body).map(normalizeHeading));
  return !SECTIONS.some((s) => names.has(normalizeHeading(s)));
}

/**
 * The owner's own text from a free-form body, to go under "### Starting request":
 * the first level-1 heading is removed, and every heading moves down three levels
 * (at most level 6) so it stays inside that section. Empty when there is no other text.
 */
export function freeTextForRequest(body) {
  let text = String(body ?? '');
  const h1 = getH1(text);
  if (h1) text = text.slice(0, h1.start) + text.slice(h1.end);
  text = text.replace(/^(#{1,6})(?=[ \t])/gm, (m) => '#'.repeat(Math.min(6, m.length + 3)));
  return text.trim();
}

/**
 * Build a new DESIGN.md text from a template for an item. The model's header
 * lines are filled: "**Requirements:** <id>", "**Last updated:** <date>",
 * "**Design status:**" (Draft for a proposed design), and "**Design approval:**"
 * (Pending until the owner approves). Every other prompt stays for the agent.
 */
export function newDesignText(templateText, { id, title, date, status = 'proposed', approved = 'no' }) {
  const tpl = parseDoc(templateText);
  const meta = { work_item: id, status, approved };
  for (const [k, v] of Object.entries(tpl.meta)) {
    if (DESIGN_FIELD_ORDER.includes(k) || k === 'id') continue;
    meta[k] = v;
  }
  let body = tpl.body;
  body = setH1(body, id, title, { suffix: DESIGN_SUFFIX });
  body = body.replace(/^((?:\*\*)?Requirements:(?:\*\*)?[ \t]*)(?:\[WORK-ITEM\.md\]\(WORK-ITEM\.md\)|[A-Za-z][A-Za-z0-9]*-\d+|<[^>\n]*>)/m, `$1${id}`);
  body = body.replace(/^((?:\*\*)?(?:Date|Last updated):(?:\*\*)?[ \t]*)<YYYY-MM-DD>/m, `$1${date}`);
  body = setDesignStatusLine(body, status, { approved });
  return composeDoc(meta, body, DESIGN_FIELD_ORDER);
}

/** The words the model's "**Design status:**" line uses for each frontmatter status. */
export const DESIGN_LINE_WORDS = Object.freeze({
  proposed: ['draft', 'in review', 'proposed'],
  approved: ['approved'],
  superseded: ['superseded'],
});

const OLD_STATUS_LINE_RE = /^(Status:)([ \t]*)(.*?)([ \t]*)$/m;

/**
 * Where a bold label's value is: { start, end, labelStart, value } or null.
 * The label may stand anywhere in a line, not only at its start: Notion joins
 * header lines that were written without Markdown line breaks into one
 * paragraph ("**Requirements:** TV2-001 **Design status:** Proposed ...";
 * sample run c, round 3). The value ends at the next bold label on the same
 * line, or at the end of the line.
 */
export function inlineLabelSpan(text, label) {
  const src = String(text ?? '');
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^|[ \\t])\\*\\*${esc}:\\*\\*[ \\t]*`, 'gm');
  let m;
  while ((m = re.exec(src))) {
    // Skip a label inside a code span or a table row.
    const lineStart = src.lastIndexOf('\n', m.index) + 1;
    const lineEndAt = src.indexOf('\n', m.index);
    const lineEnd = lineEndAt === -1 ? src.length : lineEndAt;
    const line = src.slice(lineStart, lineEnd);
    if (/^[ \t]*\|/.test(line)) continue;
    const before = src.slice(lineStart, m.index + m[1].length);
    if ((before.match(/`/g) || []).length % 2 === 1) continue;
    const start = m.index + m[0].length;
    const rest = src.slice(start, lineEnd);
    const next = /[ \t]+\*\*[^*\n]{1,60}:\*\*/.exec(rest);
    let end = next ? start + next.index : lineEnd;
    while (end > start && /[ \t\r]/.test(src[end - 1])) end--;
    return { start, end, labelStart: m.index + m[1].length, value: src.slice(start, end) };
  }
  return null;
}

/** Replace the value of a bold label found anywhere in a line (inlineLabelSpan); unchanged when there is none. */
function replaceInlineLabel(text, label, fn) {
  const src = String(text ?? '');
  const span = inlineLabelSpan(src, label);
  if (!span) return src;
  const next = fn(span.value);
  if (next === null || next === undefined || next === span.value) return src;
  return src.slice(0, span.start) + next + src.slice(span.end);
}

/** The design's status line: { label, value } ("**Design status:**" or an older "Status:" line), or null. */
export function designStatusLine(body) {
  const text = String(body ?? '');
  const span = inlineLabelSpan(text, 'Design status');
  if (span) return { label: 'Design status:', value: span.value.trim() };
  const m = OLD_STATUS_LINE_RE.exec(text);
  return m ? { label: 'Status:', value: m[3].trim() } : null;
}

/**
 * The frontmatter status (proposed, approved, superseded) a design body's
 * status line gives, or null when there is no line or it is still a prompt.
 * Draft and In review are a proposed design.
 */
export function designStatusFromBody(body) {
  const line = designStatusLine(body);
  if (!line || isPlaceholder(line.value)) return null;
  const v = line.value.toLowerCase();
  for (const [status, words] of Object.entries(DESIGN_LINE_WORDS)) if (words.includes(v)) return status;
  return null;
}

/**
 * Keep the design body's header lines in step with the frontmatter:
 * - "**Design status:**": proposed -> Draft (an "In review" already written is
 *   kept), approved -> Approved, superseded -> Superseded. An older "Status:"
 *   line gets the frontmatter word.
 * - "**Design approval:**" (when opts.approved is given): an approval
 *   "YYYY-MM-DD by <name>" -> "Approved by <name> on YYYY-MM-DD"; no -> Pending.
 */
export function setDesignStatusLine(body, status, opts = {}) {
  let text = String(body ?? '');
  const words = DESIGN_LINE_WORDS[status];
  if (inlineLabelSpan(text, 'Design status')) {
    if (words) {
      const word = status === 'proposed' ? 'Draft' : status === 'approved' ? 'Approved' : 'Superseded';
      text = replaceInlineLabel(text, 'Design status', (value) => {
        if (!isPlaceholder(value) && words.includes(value.trim().toLowerCase())) return null;
        return word;
      });
    }
  } else {
    text = text.replace(OLD_STATUS_LINE_RE, (all, label, gap, value, tail) => `${label}${gap || ' '}${status}${tail}`);
  }
  if (opts.approved !== undefined && opts.approved !== null) {
    const a = parseApproval(opts.approved);
    let want = null;
    if (a.ok && a.approved && a.date && a.by) want = `Approved by ${a.by} on ${a.date}`;
    else if (a.ok && !a.approved) want = 'Pending';
    if (want) {
      text = replaceInlineLabel(text, 'Design approval', (value) => {
        const v = value.trim();
        if (v === want) return null;
        if (want === 'Pending') {
          // Only a prompt, an empty value, or an approval that no longer holds becomes Pending.
          if (v && !isPlaceholder(v) && !/^approved\b/i.test(v)) return null;
        } else if (!isPlaceholder(v) && /^approved\b/i.test(v) && v.includes(a.by) && v.includes(a.date)) {
          return null; // an approval written by hand with more detail is kept
        }
        return want;
      });
    }
  }
  return text;
}

/**
 * The body with a "**Design status:**" line, added under the header lines
 * when the design has none (a design written by hand without the model's
 * header), so the status it is saved with is the status it reads back with.
 */
export function ensureDesignStatusLine(body, status) {
  const text = String(body ?? '');
  if (designStatusLine(text)) return text;
  const word = status === 'approved' ? 'Approved' : status === 'superseded' ? 'Superseded' : 'Draft';
  const eol = eolOf(text);
  const req = inlineLabelSpan(text, 'Requirements');
  if (req) {
    // Right after the "**Requirements:**" line, as the model's header has it.
    const lineEndAt = text.indexOf('\n', req.end);
    const lineEnd = lineEndAt === -1 ? text.length : lineEndAt;
    const line = text.slice(text.lastIndexOf('\n', req.start) + 1, lineEnd).replace(/\r$/, '');
    const hard = / {2,}$/.test(line) ? '' : '  ';
    const cut = text[lineEnd - 1] === '\r' ? lineEnd - 1 : lineEnd;
    return `${text.slice(0, cut)}${hard}${eol}**Design status:** ${word}  ${text.slice(cut)}`;
  }
  const h1 = getH1(text);
  if (h1) return `${text.slice(0, h1.end)}${eol}**Design status:** ${word}${eol}${text.slice(h1.end)}`;
  return `**Design status:** ${word}${eol}${eol}${text}`;
}

// ------------------------------------------------------------------ label lines

/**
 * The bold labels the model's templates put at the start of a line
 * (WORK-ITEM.md and DESIGN.md). separateLabelLines puts each one back on its
 * own line when text joined them.
 */
export const LINE_LABELS = Object.freeze([
  'Goal', 'Current position', 'Next action', 'Blockers', 'Related items',
  'Work', 'Deliverable', 'Done when', 'Depends on',
  'Overall status', 'Finalization rule',
  'Status', 'Applies to', 'Required behavior', 'Boundaries and exceptions', 'Acceptance check', 'Decision record', 'Open questions',
  'Requirements', 'Design status', 'Requirements checked', 'Last updated', 'Design approval',
  'Recommendation', 'Owner decision', 'Reason for decision',
]);

const LINE_LABEL_ALT = LINE_LABELS.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
const JOINED_LABEL_RE = new RegExp(`[ \\t]+(?=\\*\\*(?:${LINE_LABEL_ALT}):\\*\\*)`, 'g');
const LABEL_LEAD_RE = new RegExp(`^([ \\t]*)(?:[-*][ \\t]+(?:\\[[ xX]\\][ \\t]+)?)?\\*\\*(?:(?:${LINE_LABEL_ALT}):\\*\\*|P\\d+-T\\d+\\b)`);

/**
 * Put each template label back on its own line, with a Markdown hard line
 * break (two spaces) at the end of the line before it:
 *   "**Requirements:** TV2-001 **Design status:** Proposed"
 *   -> "**Requirements:** TV2-001  \n**Design status:** Proposed"
 * A line that starts with a template label or a task ("- [ ] **P1-T01 ...**")
 * is split before every later template label in it; a task's fields are
 * indented under the task. Consecutive label lines with no line break between
 * them get one, so Notion does not join them into one paragraph (sample run c,
 * round 3). Code blocks, tables, and other lines are left as they are.
 *
 * opts.design: the text is a design. Blank lines between its header lines
 * (Requirements, Design status, Requirements checked, Last updated, Design
 * approval) become hard breaks, as the model writes them (sample run c,
 * round 3, bug 43).
 */
export function separateLabelLines(text, opts = {}) {
  const src = String(text ?? '');
  const eol = eolOf(src);
  const lines = src.split(/\r?\n/);
  const out = [];
  const code = new Set(); // indexes in out of lines inside a code block
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const f = /^[ \t]*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      code.add(out.length);
      out.push(line);
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
      continue;
    }
    if (f) {
      fence = f[1];
      code.add(out.length);
      out.push(line);
      continue;
    }
    const lead = LABEL_LEAD_RE.exec(line);
    if (!lead || /^[ \t]*\|/.test(line)) {
      out.push(line);
      continue;
    }
    const isTask = /^[ \t]*[-*][ \t]+\[[ xX]\]/.test(line);
    const indent = isTask ? `${lead[1]}  ` : lead[1];
    // Split outside code spans only.
    const parts = [];
    let cur = '';
    let ticks = 0;
    for (let k = 0; k < line.length; k++) {
      if (line[k] === '`') ticks++;
      if (ticks % 2 === 0 && (line[k] === ' ' || line[k] === '\t')) {
        JOINED_LABEL_RE.lastIndex = k;
        const m = JOINED_LABEL_RE.exec(line);
        if (m && m.index === k && cur.trim()) {
          parts.push(cur);
          cur = '';
          k += m[0].length - 1;
          continue;
        }
      }
      cur += line[k];
    }
    parts.push(cur);
    if (parts.length === 1) {
      out.push(line);
      continue;
    }
    parts.forEach((p, k) => {
      const last = k === parts.length - 1;
      // The last piece keeps the line's own ending (a hard break stays a hard break).
      const piece = k === 0 ? p.replace(/[ \t]+$/, '') : `${indent}${last ? p.replace(/^[ \t]+/, '') : p.trim()}`;
      out.push(last ? piece : `${piece}  `);
    });
  }
  // A label line followed directly by another label line needs a hard break.
  for (let i = 0; i < out.length - 1; i++) {
    if (code.has(i) || code.has(i + 1)) continue;
    if (!LABEL_LEAD_RE.test(out[i]) || /^[ \t]*\|/.test(out[i])) continue;
    const next = out[i + 1];
    if (!next.trim() || !LABEL_LEAD_RE.test(next) || /^[ \t]*\|/.test(next)) continue;
    // A new list item starts its own block; only a continuation needs the break.
    if (/^[ \t]*[-*][ \t]/.test(next)) continue;
    if (!/ {2,}$|\\$|<br\s*\/?>$/i.test(out[i])) out[i] = `${out[i].replace(/[ \t]+$/, '')}  `;
  }
  return opts.design ? joinDesignHeader(out).join(eol) : out.join(eol);
}

const DESIGN_HEADER_RE = /^\*\*(?:Requirements|Design status|Requirements checked|Last updated|Design approval):\*\*/;

/** Design header lines split by blank lines, joined with hard breaks (before the first "## " section only). */
function joinDesignHeader(lines) {
  const out = [];
  let seenSection = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##[ \t]/.test(line)) seenSection = true;
    if (!seenSection && !line.trim() && out.length && DESIGN_HEADER_RE.test(out[out.length - 1])) {
      let j = i;
      while (j < lines.length && !lines[j].trim()) j++;
      if (j < lines.length && DESIGN_HEADER_RE.test(lines[j])) {
        const prev = out[out.length - 1];
        if (!/ {2,}$|\\$|<br\s*\/?>$/i.test(prev)) out[out.length - 1] = `${prev.replace(/[ \t]+$/, '')}  `;
        i = j - 1;
        continue;
      }
    }
    out.push(line);
  }
  return out;
}

/** True when a task line holds a task field (**Work:** and the others) that belongs on a line of its own. */
export function taskFieldsJoined(body) {
  const text = getSectionWhole(body, 'Tasks');
  if (text === null) return [];
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const m = TASK_RE.exec(line) || /^[ \t]*[-*][ \t]+\[[ xX]\][ \t]+\*\*(P\d+-T\d+)/.exec(line);
    if (!m) continue;
    if (/\*\*(?:Work|Deliverable|Done when|Depends on):\*\*/.test(line)) out.push(m[2] || m[1]);
  }
  return out;
}

// ------------------------------------------------------------------ design readiness

/**
 * True when a design has something for the owner to approve: an option under
 * "## Design options" with a real name ("### Option A — One short brief"), or
 * a filled "## Selected design". A design just made from the template, or one
 * that says only "Pending the owner's answer", is a draft: nothing waits for
 * his approval yet (sample run a, round 3).
 */
export function designHasOptions(body) {
  const text = String(body ?? '');
  const options = getSection(text, 'Design options');
  if (options) {
    for (const n of flattenSections(options.children)) {
      const m = /^Option\s+[A-Z0-9]+\s*[—–:-]?\s*(.*)$/i.exec(n.heading);
      if (m && m[1].trim() && !isPlaceholder(m[1].trim())) return true;
    }
  }
  const selected = getSectionText(text, 'Selected design');
  if (selected !== null) {
    const real = selected.replace(/```[\s\S]*?```/g, '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l
      && !/^#{1,6}\s/.test(l)
      && !/^\|/.test(l)
      && !/<[^<>\n]+>/.test(l)
      && !/\bpending\b/i.test(l)
      && !/^<!--/.test(l));
    if (real.length) return true;
  }
  return false;
}

// ------------------------------------------------------------------ parent and sub-item links in the text

const idListRe = (label) => new RegExp(`${label}:\\s*((?:[A-Za-z][A-Za-z0-9]*-\\d+)(?:\\s*,\\s*[A-Za-z][A-Za-z0-9]*-\\d+)*)\\.?`);

/**
 * Name a parent or a sub-item in the Overview's "**Related items:**" line
 * (sample run c, round 3: the link lived only in Notion's relation properties).
 * kind 'parent': "Parent WI-001." (a different parent named the same way is replaced);
 * kind 'sub-item': "Sub-items: WI-002, WI-003." (one list).
 * Unchanged when the line is missing or already names the id that way.
 */
export function linkRelatedItem(body, kind, id) {
  const text = String(body ?? '');
  const cur = getLabel(text, 'Related items', { section: 'Overview' });
  if (cur === null) return text;
  let next;
  if (kind === 'parent') {
    const phrase = `Parent ${id}.`;
    if (isNoneText(cur)) next = phrase;
    else if (/\bParent\s+[A-Za-z][A-Za-z0-9]*-\d+\b/.test(cur)) next = cur.replace(/\bParent\s+[A-Za-z][A-Za-z0-9]*-\d+\b/, `Parent ${id}`);
    else if (new RegExp(`\\b${id}\\b`).test(cur)) return text;
    else next = `${cur.replace(/\s+$/, '')} ${phrase}`;
  } else {
    const m = idListRe('Sub-items').exec(cur);
    if (isNoneText(cur)) next = `Sub-items: ${id}.`;
    else if (m) {
      const ids = m[1].split(/\s*,\s*/);
      if (ids.includes(id)) return text;
      next = cur.replace(m[0], `Sub-items: ${[...ids, id].join(', ')}.`);
    } else if (new RegExp(`\\b${id}\\b`).test(cur)) return text;
    else next = `${cur.replace(/\s+$/, '')} Sub-items: ${id}.`;
  }
  return next === cur ? text : setLabel(text, 'Related items', next, { section: 'Overview' });
}

/**
 * Take a parent or a sub-item out of the "**Related items:**" line, where the
 * toolkit wrote it (linkRelatedItem). Other text is left as it is; a line left
 * empty says "None."
 */
export function unlinkRelatedItem(body, kind, id) {
  const text = String(body ?? '');
  const cur = getLabel(text, 'Related items', { section: 'Overview' });
  if (cur === null || isNoneText(cur)) return text;
  let next = cur;
  if (kind === 'parent') {
    next = cur.replace(new RegExp(`\\s*\\bParent ${id}\\b(?:\\s*\\([^)]*\\))?\\.?`), '');
  } else {
    const m = idListRe('Sub-items').exec(cur);
    if (m) {
      const ids = m[1].split(/\s*,\s*/).filter((x) => x !== id);
      next = cur.replace(m[0], ids.length ? `Sub-items: ${ids.join(', ')}.` : '').replace(/\s{2,}/g, ' ');
    }
  }
  next = next.trim();
  if (next === cur) return text;
  return setLabel(text, 'Related items', next || 'None.', { section: 'Overview' });
}

/** Rewrite one row of the Roadmap table with fn(cells, headers); rows fn returns null for stay as they are. */
function mapRoadmapRows(body, fn) {
  const text = String(body ?? '');
  const node = getSection(text, 'Roadmap');
  if (!node) return text;
  const content = text.slice(node.contentStart, node.end);
  const t = parseTable(content);
  if (!t.found) return text;
  let updated = content;
  const esc = (c) => String(c ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
  for (let r = t.rows.length - 1; r >= 0; r--) {
    const cells = fn([...t.rows[r]], t.headers, r, t.rows);
    if (!cells) continue;
    const span = t.rowSpans[r];
    const lineEnd = updated.slice(span.start, span.end).match(/\r?\n$/);
    updated = updated.slice(0, span.start) + `| ${cells.map(esc).join(' | ')} |` + (lineEnd ? lineEnd[0] : '') + updated.slice(span.end);
  }
  return updated === content ? text : text.slice(0, node.contentStart) + updated + text.slice(node.end);
}

/**
 * Put a sub-item in the Roadmap's Sub-items column: in the first phase that
 * is In Progress, else the first Not Started one, else the last phase. A
 * Roadmap that is still the template's example is left alone (the plan is
 * written at stage 06), and so is one that already names the sub-item.
 */
export function addRoadmapSubItem(body, id) {
  const rows = parseRoadmap(body);
  const real = rows.map((r, k) => ({ ...r, k })).filter((r) => !r.placeholder);
  if (!real.length || rows.some((r) => r.subItems.some((s) => sameId(s, id)))) return String(body ?? '');
  const pick = real.find((r) => /^in progress\.?$/i.test(String(r.status).trim()))
    || real.find((r) => /^not started\.?$/i.test(String(r.status).trim()))
    || real[real.length - 1];
  return mapRoadmapRows(body, (cells, headers, r) => {
    if (r !== pick.k) return null;
    const col = headers.findIndex((h) => normalizeHeading(h) === 'sub-items');
    if (col === -1) return null;
    const cur = String(cells[col] || '').trim();
    cells[col] = isNoneText(cur) ? id : `${cur.replace(/\.$/, '')}, ${id}`;
    return cells;
  });
}

/** Take a sub-item out of the Roadmap's Sub-items column; a cell left empty says "None." */
export function removeRoadmapSubItem(body, id) {
  return mapRoadmapRows(body, (cells, headers) => {
    const col = headers.findIndex((h) => normalizeHeading(h) === 'sub-items');
    if (col === -1) return null;
    const cur = String(cells[col] || '');
    const ids = cur.match(/[A-Za-z][A-Za-z0-9]*-\d+/g) || [];
    if (!ids.some((x) => sameId(x, id))) return null;
    const left = ids.filter((x) => !sameId(x, id));
    cells[col] = left.length ? left.join(', ') : 'None.';
    return cells;
  });
}

// ------------------------------------------------------------------ open questions

/**
 * Set the Status cell of Open Questions rows. ids: question ids such as Q-02.
 * Returns the body unchanged when none of them is there.
 */
export function setQuestionStatus(body, ids, status) {
  const text = String(body ?? '');
  const want = new Set([].concat(ids).map((x) => String(x).trim()));
  const node = getSection(text, 'Open Questions');
  if (!node || !want.size) return text;
  const content = text.slice(node.contentStart, node.end);
  const t = parseTable(content);
  if (!t.found) return text;
  const idCol = t.headers.findIndex((h) => normalizeHeading(h) === 'id');
  const statusCol = t.headers.findIndex((h) => normalizeHeading(h) === 'status');
  if (idCol === -1 || statusCol === -1) return text;
  let updated = content;
  const esc = (c) => String(c ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
  for (let r = t.rows.length - 1; r >= 0; r--) {
    const cells = [...t.rows[r]];
    if (!want.has(String(cells[idCol] || '').trim())) continue;
    cells[statusCol] = status;
    const span = t.rowSpans[r];
    const lineEnd = updated.slice(span.start, span.end).match(/\r?\n$/);
    updated = updated.slice(0, span.start) + `| ${cells.map(esc).join(' | ')} |` + (lineEnd ? lineEnd[0] : '') + updated.slice(span.end);
  }
  return text.slice(0, node.contentStart) + updated + text.slice(node.end);
}

// ------------------------------------------------------------------ owner edits and derived values

/**
 * Bring a record's derived values in step, keeping the owner's hand edits (ARCHITECTURE 4.2).
 *
 * Derived values: status from stage, parent from location, the H1 from title,
 * "**Overall status:**" from requirements_approved, design from the design's status.
 * `written` is what the toolkit last wrote (from the state file). A copy that
 * changed since then while its source did not is an owner edit: it is kept,
 * reported, and gets a Recent History row "Changed by hand: ...". A title
 * changed in the H1 is applied to the title field. Gate-skipping hand changes
 * are reported as questions and never reverted.
 *
 * @param {object} args
 * @param {object} args.meta the record's frontmatter (strings)
 * @param {string} args.body
 * @param {{ parent?: string, design?: string, designApproval?: string }} [args.sources] parent from location, design status ('none' when there is no design), and the design's `approved` value; leave out what the tracker cannot know
 * @param {object|null} [args.written] the last written values, or null for an item seen the first time
 * @param {string} args.today YYYY-MM-DD
 * @param {string} [args.prefix]
 * @returns {{ patch: object, body: string, changed: boolean, derived: object[], ownerEdits: object[], questions: object[], written: object }}
 */
export function reconcileRecord({ meta, body, sources = {}, written = null, today, prefix = DEFAULT_PREFIX }) {
  const patch = {};
  const derived = [];
  const ownerEdits = [];
  const questions = [];
  const history = [];
  let newBody = String(body ?? '');
  const cur = { ...meta };
  const id = cur.id;
  const w = written || null;

  const recordOwnerEdit = (field, from, to, note, question) => {
    const edit = { id, field, from: from ?? '', to: to ?? '', note };
    if (question) edit.question = question;
    ownerEdits.push(edit);
    history.push({ date: today, change: `Changed by hand: ${field} from "${from ?? ''}" to "${to ?? ''}".`, effect: note });
  };
  const setField = (field, value, from) => {
    patch[field] = value;
    derived.push({ id, field, from: from ?? '', to: value });
    cur[field] = value;
  };

  // Title and H1.
  const h1 = getH1(newBody);
  if (isPlaceholder(cur.title) && h1 && h1.title && !isPlaceholder(h1.title)) {
    setField('title', h1.title, cur.title);
  } else if (!isPlaceholder(cur.title)) {
    if (!h1) {
      newBody = setH1(newBody, id, cur.title);
      derived.push({ id, field: 'heading', from: '', to: `# ${id}: ${cur.title}` });
    } else if (h1.title !== cur.title || !h1.id || !sameId(h1.id, id) || h1.id !== id) {
      if (w && cur.title === w.title && h1.title !== w.title && !isPlaceholder(h1.title) && h1.id && sameId(h1.id, id)) {
        recordOwnerEdit('title', w.title, h1.title, 'The heading was changed by hand; the title field now matches it.');
        patch.title = h1.title;
        cur.title = h1.title;
        if (h1.id !== id) newBody = setH1(newBody, id, cur.title);
      } else {
        if (w && w.title !== undefined && cur.title !== w.title) {
          recordOwnerEdit('title', w.title, cur.title, 'The title field was changed by hand; the heading now matches it.');
        }
        newBody = setH1(newBody, id, cur.title);
        derived.push({ id, field: 'heading', from: h1.heading, to: `${id}: ${cur.title}` });
      }
    } else if (w && w.title !== undefined && cur.title !== w.title) {
      recordOwnerEdit('title', w.title, cur.title, 'The title was changed by hand.');
    }
  }

  // Stage changed by hand.
  if (w && w.stage !== undefined && (cur.stage ?? '') !== (w.stage ?? '')) {
    let question;
    if (typeNeedsRequirements(cur.type) && !isApproved(cur.requirements_approved) && (stageNumber(cur.stage) ?? 0) >= 3) {
      question = `Was moving ${id} to ${cur.stage} the owner's requirements approval? If yes: toolkit work approve ${id} --requirements --by <name>. If no: toolkit work set ${id} --stage 02-refinement.`;
      questions.push({ id, code: 'requirements_not_approved', question });
    }
    recordOwnerEdit('stage', w.stage, cur.stage, question ? 'Kept. This skips the requirements approval gate; asking the owner.' : 'Kept.', question);
  }

  // Type changed by hand. A change to build or data-load on an item already at
  // 03 or later skips the requirements gate: kept and asked about.
  if (w && w.type !== undefined && (cur.type ?? '') !== (w.type ?? '')) {
    let question;
    const asked = questions.some((q) => q.code === 'requirements_not_approved');
    if (!asked && typeNeedsRequirements(cur.type) && !isApproved(cur.requirements_approved) && (stageNumber(cur.stage) ?? 0) >= 3) {
      question = `${id} was changed by hand to a ${cur.type} item at ${cur.stage}, and ${cur.type} items need the owner's requirements approval before stage 03. Did the owner approve the requirements? If yes: toolkit work approve ${id} --requirements --by <name>. If no: toolkit work set ${id} --stage 02-refinement.`;
      questions.push({ id, code: 'requirements_not_approved', question });
    }
    recordOwnerEdit('type', w.type, cur.type, question ? 'Kept. This skips the requirements approval gate; asking the owner.' : 'Kept.', question);
  }

  // Status from stage.
  const stageStatus = statusForStage(cur.stage);
  if (isTerminal(cur.status)) {
    if (w && w.status !== undefined && w.status !== cur.status) {
      let question;
      if (cur.status === 'Done' && !isApproved(cur.result_approved)) {
        question = `${id} was marked Done by hand with no recorded result approval or evidence. Did the owner approve the result? If yes: toolkit work approve ${id} --result --by <name>.`;
        questions.push({ id, code: 'done_without_result_approval', question });
      }
      recordOwnerEdit('status', w.status, cur.status,
        cur.status === 'Done' ? 'Kept. Set by the owner outside the toolkit; no evidence recorded.' : 'Kept. Set by the owner outside the toolkit; no reason recorded.',
        question);
    }
  } else if (stageStatus && cur.status !== stageStatus) {
    const statusTouched = w && w.status !== undefined && cur.status !== w.status && isStatus(cur.status);
    if (statusTouched) {
      recordOwnerEdit('status', w.status, cur.status, `Kept, although stage ${cur.stage} gives ${stageStatus}.`);
    } else if (!(w && w.status === cur.status && w.stage === cur.stage && w.statusKept)) {
      setField('status', stageStatus, cur.status);
    }
  }

  // Parent from location.
  let parentKept = false;
  if (sources.parent !== undefined) {
    const src = normalizeParent(sources.parent, prefix);
    const copy = normalizeParent(cur.parent, prefix);
    const missingCopy = cur.parent === undefined || isPlaceholder(cur.parent);
    if (copy !== src || missingCopy) {
      const firstSight = !w || w.parent === undefined;
      const copyTouched = !firstSight && copy !== normalizeParent(w.parent, prefix);
      const sourceTouched = !firstSight && src !== normalizeParent(w.parentSource, prefix);
      if (firstSight || !copyTouched || missingCopy) {
        if (firstSight || sourceTouched || missingCopy) setField('parent', src, cur.parent);
        else parentKept = true;
      } else {
        parentKept = true;
        const question = `The parent of ${id} was set to ${copy} by hand, but its folder location gives ${src}. Move it with toolkit work move ${id} --under ${copy === 'none' ? 'root' : copy}, or set the parent back.`;
        recordOwnerEdit('parent', w.parent, copy, 'Kept; the folder was not moved.', question);
        questions.push({ id, code: 'parent_location_mismatch', question });
      }
    }
  }

  // Overall status from requirements_approved.
  const overallNow = getLabel(newBody, 'Overall status', { section: 'Requirements' });
  if (w && w.requirements_approved !== undefined && (cur.requirements_approved ?? '') !== (w.requirements_approved ?? '')) {
    recordOwnerEdit('requirements_approved', w.requirements_approved, cur.requirements_approved, 'Kept. The approval was written by hand.');
  }
  if (overallNow !== null && parseApproval(cur.requirements_approved).ok) {
    const want = overallFor(cur.requirements_approved);
    if (overallNow !== want) {
      const firstSight = !w || w.overall === undefined;
      const copyTouched = !firstSight && overallNow !== w.overall;
      const sourceTouched = !firstSight && (cur.requirements_approved ?? '') !== (w.requirements_approved ?? '');
      if (firstSight || !copyTouched || sourceTouched) {
        if (firstSight || sourceTouched || !(w && w.overallKept)) {
          newBody = setLabel(newBody, 'Overall status', want, { section: 'Requirements' });
          derived.push({ id, field: 'Overall status', from: overallNow, to: want });
        }
      } else {
        let question;
        if (/^finali[sz]ed$/i.test(overallNow) && !isApproved(cur.requirements_approved)) {
          question = `The requirements of ${id} were marked Finalized by hand, but no approval is recorded. If the owner approved them: toolkit work approve ${id} --requirements --by <name>.`;
          questions.push({ id, code: 'finalized_without_approval', question });
        }
        recordOwnerEdit('Overall status', w.overall, overallNow, 'Kept.', question);
      }
    }
  }

  // design from the design's status.
  if (sources.design !== undefined) {
    const src = sources.design || 'none';
    const copy = cur.design;
    const designChanged = !w || w.designSource === undefined || src !== w.designSource;
    if (src === 'approved' && designChanged && sources.designApproval !== undefined && !isApproved(sources.designApproval)) {
      const question = `The design of ${id} says status: approved, but no approval is recorded in it (approved: ${sources.designApproval || 'no'}). Did the owner approve it? If yes: toolkit work approve ${id} --design --by <name>. If no: toolkit work design ${id} --status proposed.`;
      questions.push({ id, code: 'design_approved_without_record', question });
    }
    if (copy !== src) {
      const firstSight = !w || w.design === undefined;
      const copyTouched = !firstSight && copy !== w.design;
      const sourceTouched = !firstSight && src !== w.designSource;
      if (firstSight || !copyTouched || isPlaceholder(copy)) {
        if (firstSight || sourceTouched || isPlaceholder(copy) || !(w && w.designKept)) setField('design', src, copy);
      } else {
        let question;
        if (copy === 'approved') {
          question = `The design of ${id} was marked approved by hand. If the owner approved it: toolkit work approve ${id} --design --by <name>.`;
          questions.push({ id, code: 'design_approved_by_hand', question });
        }
        recordOwnerEdit('design', w.design, copy, `Kept, although the design file says ${src}.`, question);
      }
    }
  }

  if (w && w.result_approved !== undefined && (cur.result_approved ?? '') !== (w.result_approved ?? '')) {
    recordOwnerEdit('result_approved', w.result_approved, cur.result_approved, 'Kept. The approval was written by hand.');
  }

  // Gate questions for a record seen for the first time.
  if (!w) {
    for (const g of checkGates(cur, { body: newBody })) questions.push({ id, code: g.code, question: g.question });
  }

  for (const row of history) {
    try {
      newBody = appendHistory(newBody, row);
    } catch {
      // No Recent History table: the edit is still reported.
    }
  }

  const changed = Object.keys(patch).length > 0 || newBody !== String(body ?? '');
  if (changed && today && (cur.updated !== today)) {
    patch.updated = today;
    cur.updated = today;
  }

  const snapshot = snapshotWritten({ ...cur, ...patch }, newBody, sources, prefix);
  if (parentKept) snapshot.parentKept = true;

  return { patch, body: newBody, changed, derived, ownerEdits, questions, written: snapshot };
}

/**
 * The values the state file keeps for a record after the toolkit wrote it.
 * The *Kept flags say a derived value was left different from its source on
 * purpose (an owner edit), so the next sync does not undo it.
 */
export function snapshotWritten(meta, body, sources = {}, prefix = DEFAULT_PREFIX) {
  const h1 = getH1(body);
  const overall = getLabel(body, 'Overall status', { section: 'Requirements' });
  const stageStatus = statusForStage(meta.stage);
  const snap = {
    title: meta.title,
    heading: h1 ? h1.heading : null,
    type: meta.type,
    stage: meta.stage,
    status: meta.status,
    parent: meta.parent === undefined ? undefined : normalizeParent(meta.parent, prefix),
    parentSource: sources.parent === undefined ? undefined : normalizeParent(sources.parent, prefix),
    requirements_approved: meta.requirements_approved,
    overall,
    design: meta.design,
    designSource: sources.design === undefined ? undefined : (sources.design || 'none'),
    result_approved: meta.result_approved,
  };
  snap.statusKept = Boolean(stageStatus && !isTerminal(meta.status) && meta.status !== stageStatus);
  snap.overallKept = Boolean(overall !== null && parseApproval(meta.requirements_approved).ok && overall !== overallFor(meta.requirements_approved));
  snap.designKept = Boolean(sources.design !== undefined && meta.design !== (sources.design || 'none'));
  snap.parentKept = Boolean(sources.parent !== undefined && meta.parent !== undefined && normalizeParent(meta.parent, prefix) !== normalizeParent(sources.parent, prefix));
  for (const k of Object.keys(snap)) if (snap[k] === undefined) delete snap[k];
  return snap;
}

/** Normalize a meta object read from any tracker: string values, known keys first. */
export function normalizeMeta(meta) {
  const out = {};
  for (const k of FIELD_ORDER) if (meta[k] !== undefined && meta[k] !== null) out[k] = String(meta[k]);
  for (const [k, v] of Object.entries(meta)) if (!FIELD_ORDER.includes(k) && v !== undefined && v !== null) out[k] = typeof v === 'object' ? v : String(v);
  return out;
}

export { normalizeStage, stageNumber, statusForStage };

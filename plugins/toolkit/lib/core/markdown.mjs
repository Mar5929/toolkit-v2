// Markdown sections and pipe tables.
//
// A section is a heading line (`#` to `######`) plus everything under it up
// to the next heading of the same or a higher level. Headings inside fenced
// code blocks (``` or ~~~) are ignored.
//
// splitSections(body) -> an array of top-level section nodes. Each node is
//   { level, heading, start, end, contentStart, line, text, content, children }
//   start/end: character offsets of the whole section in body (end is exclusive)
//   contentStart: offset just after the heading line
//   line: 1-based line number of the heading
//   text: the section with its heading line; content: the section without it
// The returned array can also be used as the root node: it has level 0,
// text, content, preamble (text before the first heading), and children
// (the array itself).
//
// getSection(body, heading, { level, match }) -> the first matching node in
//   document order, or null.
//   heading: "Overview", "## Overview", a path array ['Requirements', 'R-01'],
//   or "Requirements > Active requirements". Case and extra spaces are ignored.
//   match: 'exact' (default) or 'prefix' ("R-01" finds "R-01 — Required outcome").
// replaceSection(body, heading, newText, { level, match, create }) -> new body
//   newText is the new content under the kept heading line. When newText starts
//   with a heading of the section's level, it replaces the heading too.
//   Sub-sections are part of the section and are replaced with it.
//   The blank lines the section already has after its heading and before the
//   next heading are kept; a section with no text of its own gets one blank
//   line on each side. Replacing a section with its own content changes nothing.
//   A missing section throws, unless create is true (then it is appended).
//
// parseTable(text) -> { headers, rows, objects, align, start, end, rowSpans, found }
//   for the first pipe table in text. Cells are trimmed; \| becomes |.
// renderTable(headers, rows) -> table text in the form `| a | b |` / `|---|---|`.
// appendTableRow(sectionText, cells, { dropPlaceholderRows, headers }) -> new text
// replaceTable(text, headers, rows) -> text with its first table re-rendered.

import { EXIT, ToolkitError } from './output.mjs';

const HEADING_RE = /^ {0,3}(#{1,6})(?=[ \t]|$)(.*)$/;
const FENCE_RE = /^ {0,3}(`{3,}|~{3,})(.*)$/;
const DELIM_RE = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/;

function asText(value) {
  return value == null ? '' : String(value);
}

function eolOf(text) {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

function scanLines(text) {
  const out = [];
  let pos = 0;
  while (pos < text.length) {
    const nl = text.indexOf('\n', pos);
    const end = nl === -1 ? text.length : nl + 1;
    let lineEnd = nl === -1 ? text.length : nl;
    if (lineEnd > pos && text[lineEnd - 1] === '\r') lineEnd--;
    out.push({ text: text.slice(pos, lineEnd), start: pos, end });
    pos = end;
  }
  return out;
}

function markFences(lines) {
  const fenced = new Array(lines.length).fill(false);
  let open = null;
  lines.forEach((ln, idx) => {
    const m = FENCE_RE.exec(ln.text);
    if (open) {
      fenced[idx] = true;
      if (m && m[1][0] === open.char && m[1].length >= open.length && m[2].trim() === '') open = null;
      return;
    }
    if (m && !(m[1][0] === '`' && m[2].includes('`'))) {
      open = { char: m[1][0], length: m[1].length };
      fenced[idx] = true;
    }
  });
  return fenced;
}

function cleanHeading(raw) {
  return raw.trim().replace(/(?:^|[ \t]+)#+[ \t]*$/, '').trim();
}

/** Lower-case, trimmed, single-spaced heading text for comparison. */
export function normalizeHeading(heading) {
  return asText(heading).normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

export function splitSections(body) {
  const text = asText(body);
  const lines = scanLines(text);
  const fenced = markFences(lines);
  const roots = [];
  const stack = [];
  let firstHeading = text.length;

  lines.forEach((ln, idx) => {
    if (fenced[idx]) return;
    const m = HEADING_RE.exec(ln.text);
    if (!m) return;
    const level = m[1].length;
    const node = {
      level,
      heading: cleanHeading(m[2]),
      start: ln.start,
      end: text.length,
      contentStart: ln.end,
      line: idx + 1,
      text: '',
      content: '',
      children: [],
    };
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop().end = ln.start;
    (stack.length ? stack[stack.length - 1].children : roots).push(node);
    stack.push(node);
    if (firstHeading === text.length) firstHeading = ln.start;
  });

  const finish = (node) => {
    node.text = text.slice(node.start, node.end);
    node.content = text.slice(node.contentStart, node.end);
    node.children.forEach(finish);
  };
  roots.forEach(finish);

  Object.defineProperties(roots, {
    level: { value: 0 },
    heading: { value: null },
    start: { value: 0 },
    end: { value: text.length },
    contentStart: { value: 0 },
    line: { value: 0 },
    text: { value: text },
    content: { value: text },
    preamble: { value: text.slice(0, firstHeading) },
    children: { value: roots },
  });
  return roots;
}

/** Every section node in document order. */
export function flattenSections(tree) {
  const out = [];
  const visit = (nodes) => {
    for (const n of nodes) {
      out.push(n);
      visit(n.children || []);
    }
  };
  visit(Array.isArray(tree) ? tree : tree && tree.children ? tree.children : []);
  return out;
}

function parseQuery(query) {
  const s = asText(query);
  const m = /^\s*(#{1,6})[ \t]+(.*)$/.exec(s);
  if (m) return { level: m[1].length, text: cleanHeading(m[2]) };
  return { level: undefined, text: s.trim() };
}

function headingMatches(actual, wanted, match) {
  if (actual === wanted) return true;
  if (match !== 'prefix' || !wanted) return false;
  return actual.startsWith(wanted) && /^[\s\-\u2013\u2014:.)]/.test(actual.slice(wanted.length));
}

function findIn(nodes, query, { level, match }) {
  const q = parseQuery(query);
  const wantedLevel = level || q.level;
  const wanted = normalizeHeading(q.text);
  return nodes.find((n) => (!wantedLevel || n.level === wantedLevel) && headingMatches(normalizeHeading(n.heading), wanted, match)) || null;
}

function findSection(tree, heading, opts) {
  if (Array.isArray(heading)) {
    if (!heading.length) return null;
    let scope = tree;
    let found = null;
    heading.forEach((part, idx) => {
      if (scope === null) return;
      const last = idx === heading.length - 1;
      found = findIn(flattenSections(scope), part, last ? opts : { match: opts.match });
      scope = found ? found.children : null;
    });
    return scope === null ? null : found;
  }
  const direct = findIn(flattenSections(tree), heading, opts);
  if (direct) return direct;
  if (typeof heading === 'string' && heading.includes('>')) {
    const parts = heading.split('>').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) return findSection(tree, parts, opts);
  }
  return null;
}

export function getSection(body, heading, { level, match = 'exact' } = {}) {
  return findSection(splitSections(body), heading, { level, match });
}

function trimBlock(s) {
  return s.replace(/^(?:[ \t]*\r?\n)+/, '').replace(/\s+$/, '');
}

function headingLabel(heading) {
  return Array.isArray(heading) ? heading.join(' > ') : asText(heading);
}

export function replaceSection(body, heading, newText, { level, match = 'exact', create = false } = {}) {
  const text = asText(body);
  const eol = eolOf(text);
  const replacement = asText(newText).replace(/\r?\n/g, eol);
  const node = getSection(text, heading, { level, match });

  if (!node) {
    if (!create) {
      throw new ToolkitError(EXIT.INVALID, `The section "${headingLabel(heading)}" was not found.`, { heading });
    }
    const q = parseQuery(Array.isArray(heading) ? heading[heading.length - 1] : heading);
    const lvl = level || q.level || 2;
    const content = trimBlock(replacement);
    let prefix = text;
    if (prefix && !prefix.endsWith('\n')) prefix += eol;
    if (prefix && !prefix.endsWith(eol + eol)) prefix += eol;
    return `${prefix}${'#'.repeat(lvl)} ${q.text}${eol}${content ? eol + content + eol : ''}`;
  }

  // Keep the spacing the file already uses around this section: the blank
  // lines after the heading and the whitespace before the next heading.
  // A section with no text of its own gets one blank line on each side.
  const hasFollowing = node.end < text.length;
  const defaultTrail = eol + (hasFollowing ? eol : '');
  const trailOf = (s) => s.slice(s.replace(/\s+$/, '').length).replace(/^[ \t]+/, '');
  const content = trimBlock(replacement);
  const firstLine = content.split(/\r?\n/, 1)[0] || '';
  const hm = HEADING_RE.exec(firstLine);
  let section;
  if (hm && hm[1].length === node.level) {
    const trail = trailOf(node.text);
    section = content + (trail.includes('\n') || !hasFollowing ? trail : defaultTrail);
  } else {
    let headingLine = text.slice(node.start, node.contentStart);
    if (!headingLine.endsWith('\n')) headingLine += eol;
    const old = node.content;
    const oldBody = trimBlock(old);
    let lead = eol;
    let trail = defaultTrail;
    if (oldBody) {
      lead = old.slice(0, old.length - old.replace(/^(?:[ \t]*\r?\n)+/, '').length);
      const oldTrail = trailOf(old);
      if (oldTrail.includes('\n') || !hasFollowing) trail = oldTrail;
    }
    let rest;
    if (content) rest = lead + content + trail;
    else if (!oldBody) rest = old.includes('\n') || !hasFollowing ? old : eol;
    else rest = hasFollowing ? eol : '';
    section = headingLine + rest;
  }
  return text.slice(0, node.start) + section + text.slice(node.end);
}

// ---------------------------------------------------------------- tables

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells = [];
  let cur = '';
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (c === '\\' && s[k + 1] === '|') {
      cur += '|';
      k++;
      continue;
    }
    if (c === '|') {
      cells.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  cells.push(cur.trim());
  return cells;
}

function alignOf(cell) {
  const left = cell.startsWith(':');
  const right = cell.endsWith(':');
  if (left && right) return 'center';
  if (right) return 'right';
  if (left) return 'left';
  return null;
}

function emptyTable() {
  return { headers: [], rows: [], objects: [], align: [], start: -1, end: -1, rowSpans: [], found: false };
}

export function parseTable(text) {
  const src = asText(text);
  const lines = scanLines(src);
  const fenced = markFences(lines);
  for (let i = 0; i + 1 < lines.length; i++) {
    if (fenced[i] || fenced[i + 1]) continue;
    const head = lines[i].text;
    const delim = lines[i + 1].text;
    if (!head.includes('|') || !DELIM_RE.test(delim) || HEADING_RE.test(head)) continue;
    const headers = splitRow(head);
    const delimCells = splitRow(delim);
    if (delimCells.length !== headers.length) continue;
    const rows = [];
    const rowSpans = [];
    let j = i + 2;
    for (; j < lines.length; j++) {
      const t = lines[j].text;
      if (fenced[j] || !t.trim() || !t.includes('|') || HEADING_RE.test(t)) break;
      const cells = splitRow(t);
      while (cells.length < headers.length) cells.push('');
      rows.push(cells);
      rowSpans.push({ start: lines[j].start, end: lines[j].end });
    }
    return {
      headers,
      rows,
      objects: rows.map((r) => Object.fromEntries(headers.map((h, idx) => [h, r[idx] ?? '']))),
      align: delimCells.map(alignOf),
      start: lines[i].start,
      end: j > i + 2 ? lines[j - 1].end : lines[i + 1].end,
      rowSpans,
      found: true,
    };
  }
  return emptyTable();
}

function escapeCell(value) {
  return asText(value).replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|');
}

function renderRow(cells) {
  return `| ${cells.map(escapeCell).join(' | ')} |`;
}

function normalizeCells(row, headers) {
  if (Array.isArray(row)) {
    if (row.length > headers.length) {
      throw new ToolkitError(EXIT.INVALID, `A table row has ${row.length} cells but the table has ${headers.length} columns.`);
    }
    const cells = row.map(asText);
    while (cells.length < headers.length) cells.push('');
    return cells;
  }
  if (row && typeof row === 'object') {
    const unknown = Object.keys(row).filter((k) => !headers.includes(k));
    if (unknown.length) {
      throw new ToolkitError(EXIT.INVALID, `A table row names columns the table does not have: ${unknown.join(', ')}.`);
    }
    return headers.map((h) => asText(row[h]));
  }
  throw new ToolkitError(EXIT.INVALID, 'A table row must be a list of cells or an object keyed by column name.');
}

export function renderTable(headers, rows = [], { eol = '\n' } = {}) {
  if (!Array.isArray(headers) || !headers.length) {
    throw new ToolkitError(EXIT.INVALID, 'A table needs at least one column heading.');
  }
  const hs = headers.map(asText);
  const lines = [renderRow(hs), `|${hs.map(() => '---').join('|')}|`];
  for (const row of rows) lines.push(renderRow(normalizeCells(row, hs)));
  return lines.join(eol) + eol;
}

function isPlaceholderRow(cells) {
  return cells.some((c) => c !== '') && cells.every((c) => c === '' || /^<[^<>]*>$/.test(c));
}

/**
 * Add one row to the end of the first table in sectionText.
 * cells: a list of cell texts, or an object keyed by column heading.
 * dropPlaceholderRows: true removes rows whose cells are all <placeholders>;
 *   a function (cells, index) => boolean removes the rows it returns true for.
 * headers: when the text has no table, a new table with these columns is added.
 */
export function appendTableRow(sectionText, cells, { dropPlaceholderRows = false, headers } = {}) {
  const src = asText(sectionText);
  const eol = eolOf(src);
  const table = parseTable(src);
  if (!table.found) {
    if (!headers) throw new ToolkitError(EXIT.INVALID, 'No table was found in this section.');
    const before = src.replace(/\s+$/, '');
    return `${before}${before ? eol + eol : ''}${renderTable(headers, [cells], { eol })}`;
  }
  const row = renderRow(normalizeCells(cells, table.headers));
  const drop = typeof dropPlaceholderRows === 'function' ? dropPlaceholderRows : dropPlaceholderRows ? isPlaceholderRow : null;
  let result = src;
  let insertAt = table.end;
  if (drop) {
    for (let r = table.rows.length - 1; r >= 0; r--) {
      if (drop(table.rows[r], r)) {
        const span = table.rowSpans[r];
        result = result.slice(0, span.start) + result.slice(span.end);
        insertAt -= span.end - span.start;
      }
    }
  }
  const before = result.slice(0, insertAt);
  const after = result.slice(insertAt);
  if (before && !before.endsWith('\n')) return `${before}${eol}${row}${after}`;
  return `${before}${row}${eol}${after}`;
}

/** Replace the first table in text with a freshly rendered one. */
export function replaceTable(text, headers, rows) {
  const src = asText(text);
  const table = parseTable(src);
  if (!table.found) throw new ToolkitError(EXIT.INVALID, 'No table was found to replace.');
  const eol = eolOf(src);
  let rendered = renderTable(headers, rows, { eol });
  if (!src.slice(table.start, table.end).endsWith('\n')) rendered = rendered.slice(0, -eol.length);
  return src.slice(0, table.start) + rendered + src.slice(table.end);
}

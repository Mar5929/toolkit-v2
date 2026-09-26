// Markdown both ways between the toolkit's local form and Notion's Markdown.
//
// The local form is what WORK-ITEM.md, DESIGN.md, and memory records hold:
// ordinary Markdown with blank lines between blocks, pipe tables, raw
// <placeholders>, and hard line breaks written as two trailing spaces.
//
// Notion's Markdown (GET /v1/pages/{id}/markdown) differs. Found by live tests
// on 2026-09-26 (dev/research/notion-live-tests.md):
// - blank lines are dropped; every block is one line;
// - tables are <table header-row="true"><tr><td>...</td></tr></table>;
// - literal < > $ { } ^ ~ | * are written with a backslash;
// - raw <details>, <br>, <span> and similar are read as Notion markup;
// - a line break inside one block is <br>; nested list items start with tabs;
// - text that looks like a domain (WORK-ITEM.md, docs/file.md) comes back as a
//   link [WORK-ITEM.md](http://WORK-ITEM.md);
// - a pipe table cell holding \| breaks the table, so tables are sent as <table>;
// - headings deeper than #### come back as ####;
// - a child page or database is a line <page url="...">Title</page> or
//   <database url="...">Title</database>.
//
// Two choices the toolkit makes when it sends local text:
// - lines wrapped at a fixed width inside one paragraph or list item (a soft
//   line break) are joined with a space, so Notion shows whole sentences. A
//   hard break (two trailing spaces, a trailing backslash, or <br> at the end
//   of the line) stays a line break (<br>).
// - an HTML comment block (<!-- ... -->, as in DESIGN.md) is sent as an italic
//   paragraph "*Note: ...*", because Notion would show the comment as raw text.
//   An italic paragraph that starts with "Note: " is read back as the comment.
//
// toNotion(local)          local Markdown -> Notion Markdown to send
// fromNotion(notion)       Notion Markdown -> { markdown, children }
// normalizeLocal(local)    a form for comparing two local texts (spacing, escapes)
// sameLocal(a, b)          true when the two local texts say the same thing
// planUpdate({ fresh, base, next })   update_content operations built from a fresh read
// stripTitle(body) / withTitle(title, body)   the leading "# ..." heading

import { EXIT, ToolkitError } from '../core/output.mjs';
import { renderTable } from '../core/markdown.mjs';

const FENCE_RE = /^( {0,3}|\t*)(`{3,}|~{3,})(.*)$/;
const HEADING_RE = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*#*[ \t]*$/;
const LOCAL_ITEM_RE = /^( *)([-*+]|\d{1,9}[.)])(?:[ \t]+|$)(\[[ xX]\](?:[ \t]+|$))?(.*)$/;
const NOTION_ITEM_RE = /^(\t*)([-*+]|\d{1,9}[.)]) (\[[ xX]\] )?(.*)$/;
const HR_RE = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
const TABLE_DELIM_RE = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/;
const BR_RE = /<br\s*\/?>/gi;
const CHILD_RE = /^\t*<(page|database)\b[^>]*>[\s\S]*?<\/\1>\s*$/;
const CHILD_URL_RE = /\burl="([^"]*)"/;
// An italic paragraph that starts with "Note: ": how an HTML comment is sent (toNotion).
const NOTE_RE = /^(?:\*Note: ((?:[^*\\]|\\.)*)\*|_Note: ((?:[^_\\]|\\.)*)_)$/;

/** Notion block tags whose lines are passed through untouched in both directions. */
const NOTION_BLOCK_TAGS = [
  'callout', 'details', 'summary', 'columns', 'column', 'empty-block', 'table_of_contents',
  'synced_block', 'synced_block_reference', 'audio', 'video', 'file', 'pdf', 'image', 'unknown',
  'meeting-notes', 'equation', 'breadcrumb', 'bookmark', 'embed', 'link_preview',
];
const NOTION_CONTAINER_TAGS = ['callout', 'details', 'columns', 'column', 'synced_block', 'meeting-notes'];
/** Inline Notion tags kept as markup (not escaped) in local text. */
// A real tag has only name="value" attributes, so a placeholder such as
// <File or folder that changed> is never taken for Notion markup.
const ATTRS = '(?:\\s+[a-z_-]+="[^"]*")*\\s*\\/?>';
const NOTION_INLINE_TAG_RE = new RegExp(`^<\\/?(?:br|span|u|mention-user|mention-page|mention-database|mention-data-source|mention-date|mention-link-preview|mention-agent|mention-custom-emoji|equation)${ATTRS}`);
const BLOCK_TAG_LINE_RE = new RegExp(`^\\t*<\\/?(?:${NOTION_BLOCK_TAGS.join('|')})${ATTRS}`);
const ATTR_TAIL_RE = /\s\{(?:[a-z-]+="[^"]*"\s*)+\}\s*$/;

// ------------------------------------------------------------------ inline text

function codeSpanEnd(text, i) {
  let n = 0;
  while (text[i + n] === '`') n++;
  const ticks = '`'.repeat(n);
  let j = i + n;
  for (;;) {
    const k = text.indexOf(ticks, j);
    if (k === -1) return -1;
    let m = 0;
    while (text[k + m] === '`') m++;
    if (m === n) return k + n;
    j = k + m;
  }
}

/**
 * Escape one line of local inline text for Notion. Code spans, existing
 * backslash escapes, link targets, and Notion inline tags are kept as they are.
 */
export function escapeInline(text) {
  let s = String(text ?? '');
  let tail = '';
  const attr = ATTR_TAIL_RE.exec(s);
  if (attr) {
    tail = attr[0];
    s = s.slice(0, attr.index);
  }
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '`') {
      const end = codeSpanEnd(s, i);
      if (end !== -1) {
        out += s.slice(i, end);
        i = end - 1;
        continue;
      }
      out += '\\`';
      continue;
    }
    if (c === '\\' && i + 1 < s.length) {
      out += s.slice(i, i + 2);
      i++;
      continue;
    }
    if (c === ']' && s[i + 1] === '(') {
      const close = s.indexOf(')', i + 2);
      if (close !== -1 && !/\s/.test(s.slice(i + 2, close))) {
        out += s.slice(i, close + 1);
        i = close;
        continue;
      }
    }
    if (c === '<') {
      const tag = NOTION_INLINE_TAG_RE.exec(s.slice(i));
      if (tag) {
        out += tag[0];
        i += tag[0].length - 1;
        continue;
      }
      out += '\\<';
      continue;
    }
    if (c === '>' || c === '$' || c === '{' || c === '}' || c === '^' || c === '|') {
      out += `\\${c}`;
      continue;
    }
    out += c;
  }
  return out + tail;
}

/** Undo Notion's automatic links: [x.md](http://x.md) -> x.md. */
export function undoAutoLinks(text) {
  return String(text ?? '').replace(/\[([^\[\]\n]+)\]\(([^()\s]+)\)/g, (whole, label, url) => {
    const plain = label.replace(/\\(.)/g, '$1');
    const u = url.replace(/\\(.)/g, '$1');
    if (u === `http://${plain}` || u === `https://${plain}` || u === `mailto:${plain}` || (u === plain && /^[a-z][a-z0-9+.-]*:/i.test(u))) return label;
    return whole;
  });
}

/**
 * Remove Notion's escapes from one line: \< \> \$ \{ \} \^ \~ \| become the
 * plain character; \* stays unless it stands alone between spaces. Code spans
 * are kept as they are.
 */
export function unescapeInline(text) {
  const s = undoAutoLinks(text);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '`') {
      const end = codeSpanEnd(s, i);
      if (end !== -1) {
        out += s.slice(i, end);
        i = end - 1;
        continue;
      }
    }
    if (c === '\\' && i + 1 < s.length) {
      const n = s[i + 1];
      if ('<>${}^~|'.includes(n)) {
        out += n;
      } else if (n === '*' && (i === 0 || /\s/.test(s[i - 1])) && (i + 2 >= s.length || /\s/.test(s[i + 2]))) {
        out += '*';
      } else {
        out += c + n;
      }
      i++;
      continue;
    }
    out += c;
  }
  return out;
}

// ------------------------------------------------------------------ local -> blocks

function isFence(line) {
  const m = FENCE_RE.exec(line);
  return m && !(m[2][0] === '`' && m[3].includes('`')) ? m : null;
}

function isTableStart(lines, i) {
  const head = lines[i];
  const delim = lines[i + 1];
  if (delim === undefined || !head.includes('|') || HEADING_RE.test(head)) return false;
  if (!TABLE_DELIM_RE.test(delim)) return false;
  return splitPipeRow(delim).length === splitPipeRow(head).length;
}

function splitPipeRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells = [];
  let cur = '';
  let inCode = false;
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (c === '\\' && s[k + 1] === '|') {
      cur += '|';
      k++;
      continue;
    }
    if (c === '`') inCode = !inCode;
    if (c === '|' && !inCode) {
      cells.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  cells.push(cur.trim());
  return cells;
}

function startsBlock(line, lines, i) {
  if (!line.trim()) return true;
  if (HEADING_RE.test(line)) return true;
  if (isFence(line)) return true;
  if (HR_RE.test(line)) return true;
  if (/^ {0,3}>/.test(line)) return true;
  if (LOCAL_ITEM_RE.test(line)) return true;
  if (isTableStart(lines, i)) return true;
  if (BLOCK_TAG_LINE_RE.test(line.trim()) || CHILD_RE.test(line.trim())) return true;
  if (commentBlock(lines, i)) return true;
  return false;
}

function hardBreakText(line) {
  return line.replace(/\\$/, '').replace(/[ \t]+$/, '');
}

const TRAILING_BR_RE = /<br\s*\/?>[ \t]*$/i;

/** True when a source line ends with a hard line break: two or more spaces, a backslash, or <br>. */
function endsHard(line) {
  return / {2,}$/.test(line) || /\\$/.test(line) || TRAILING_BR_RE.test(line);
}

/**
 * Add one source line of a paragraph or list item to its lines. The line
 * after a hard break starts a new entry (a line break in Notion and in the
 * local text); a soft-wrapped line is joined to the entry before it with one
 * space. `state.hard` says whether the line before ended with a hard break.
 */
function addLine(list, line, state) {
  const text = hardBreakText(line.replace(TRAILING_BR_RE, ''));
  if (!list.length || state.hard) list.push(text);
  else list[list.length - 1] = list[list.length - 1] ? `${list[list.length - 1]} ${text}` : text;
  state.hard = endsHard(line);
}

const COMMENT_START_RE = /^ {0,3}<!--/;

/**
 * An HTML comment block starting at line i: the whole block is the comment
 * and nothing else. Returns { text, next } (text: the words inside, lines
 * joined with a space) or null.
 */
function commentBlock(lines, i) {
  if (!COMMENT_START_RE.test(lines[i])) return null;
  const parts = [];
  let k = i;
  for (; k < lines.length; k++) {
    parts.push(lines[k].trim());
    if (lines[k].includes('-->')) break;
    if (k > i && !lines[k].trim()) return null;
  }
  if (k >= lines.length) return null;
  const whole = parts.join('\n');
  const m = /^<!--([\s\S]*?)-->$/.exec(whole);
  if (!m || m[1].includes('-->')) return null;
  return { text: m[1].split('\n').map((l) => l.trim()).filter(Boolean).join(' '), next: k + 1 };
}

/**
 * Local Markdown -> blocks:
 *   { type: 'heading', level, text }
 *   { type: 'paragraph', lines }
 *   { type: 'item', level, marker, check, lines, paras }   (paras: later paragraphs of the item)
 *   { type: 'table', headers, rows }
 *   { type: 'code', lines }                                 (fences included, verbatim)
 *   { type: 'quote', lines }
 *   { type: 'hr' }
 *   { type: 'raw', lines }                                  (Notion markup, verbatim)
 *   { type: 'comment', text }                               (an HTML comment block)
 * A paragraph's or item's `lines` are its hard-broken lines; soft-wrapped
 * source lines are joined into one entry (addLine).
 */
export function parseLocal(md) {
  const lines = String(md ?? '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let stack = []; // open list items: { markerCol, contentCol }
  let i = 0;
  const lastItem = () => {
    for (let k = blocks.length - 1; k >= 0; k--) {
      if (blocks[k].type === 'item') return blocks[k];
      break;
    }
    return null;
  };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      // A blank line followed by text indented under an open list item continues that item.
      const next = lines[i + 1];
      const item = lastItem();
      if (item && stack.length && next !== undefined && next.trim() && !LOCAL_ITEM_RE.test(next)) {
        const indent = next.length - next.trimStart().length;
        if (indent >= stack[stack.length - 1].contentCol && !HEADING_RE.test(next.trim()) && !isFence(next)) {
          const para = [];
          const state = { hard: false };
          i++;
          while (i < lines.length && lines[i].trim() && !startsBlock(lines[i].trimStart(), lines, i)) {
            addLine(para, lines[i].trimStart(), state);
            i++;
          }
          if (!para.length && i < lines.length) {
            addLine(para, lines[i].trimStart(), state);
            i++;
          }
          item.paras.push(para);
          continue;
        }
      }
      i++;
      continue;
    }

    const fence = isFence(line);
    if (fence) {
      stack = [];
      const block = [line.replace(/^\t+/, '')];
      const marker = fence[2];
      i++;
      while (i < lines.length) {
        const l = lines[i];
        block.push(l);
        i++;
        const m = isFence(l);
        if (m && m[2][0] === marker[0] && m[2].length >= marker.length && !m[3].trim()) break;
      }
      blocks.push({ type: 'code', lines: block });
      continue;
    }

    const trimmed = line.trim();
    if (CHILD_RE.test(trimmed)) {
      stack = [];
      blocks.push({ type: 'raw', lines: [trimmed] });
      i++;
      continue;
    }
    const comment = commentBlock(lines, i);
    if (comment) {
      stack = [];
      blocks.push({ type: 'comment', text: comment.text });
      i = comment.next;
      continue;
    }
    if (BLOCK_TAG_LINE_RE.test(trimmed)) {
      stack = [];
      const raw = collectContainer(lines, i);
      blocks.push({ type: 'raw', lines: raw.lines });
      i = raw.next;
      continue;
    }

    const h = HEADING_RE.exec(line);
    if (h) {
      stack = [];
      blocks.push({ type: 'heading', level: h[1].length, text: (h[2] || '').trim() });
      i++;
      continue;
    }
    if (HR_RE.test(line)) {
      stack = [];
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }
    if (isTableStart(lines, i)) {
      stack = [];
      const headers = splitPipeRow(lines[i]);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim() && lines[i].includes('|') && !HEADING_RE.test(lines[i])) {
        const cells = splitPipeRow(lines[i]);
        while (cells.length < headers.length) cells.push('');
        rows.push(cells.slice(0, Math.max(headers.length, cells.length)));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }
    if (/^ {0,3}>/.test(line)) {
      stack = [];
      const q = [];
      while (i < lines.length && /^ {0,3}>/.test(lines[i])) {
        q.push(hardBreakText(lines[i].replace(/^ {0,3}> ?/, '')));
        i++;
      }
      blocks.push({ type: 'quote', lines: q });
      continue;
    }

    const item = LOCAL_ITEM_RE.exec(line);
    const indent = line.length - line.trimStart().length;
    if (item && (stack.length ? indent < stack[stack.length - 1].contentCol + 4 : indent < 4)) {
      while (stack.length && indent < stack[stack.length - 1].contentCol) stack.pop();
      const level = stack.length;
      const markerCol = item[1].length;
      const contentCol = markerCol + item[2].length + 1;
      stack.push({ markerCol, contentCol });
      const check = item[3] ? item[3].trim()[1].toLowerCase() : null;
      const text = [];
      const state = { hard: false };
      addLine(text, item[4], state);
      i++;
      while (i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines, i)) {
        addLine(text, lines[i].trimStart(), state);
        i++;
      }
      blocks.push({ type: 'item', level, marker: item[2], check, lines: text, paras: [] });
      continue;
    }

    // A paragraph: this line and the lines that continue it.
    stack = [];
    const para = [];
    const state = { hard: false };
    addLine(para, line.replace(/^[ \t]+/, ''), state);
    i++;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines, i)) {
      addLine(para, lines[i].trimStart(), state);
      i++;
    }
    blocks.push({ type: 'paragraph', lines: para });
  }
  return blocks;
}

function collectContainer(lines, start) {
  const first = lines[start].trim();
  const open = /^<([a-z_-]+)/i.exec(first);
  const name = open ? open[1].toLowerCase() : '';
  const out = [lines[start]];
  let i = start + 1;
  const selfClosing = /\/>\s*$/.test(first) || new RegExp(`</${name}>\\s*$`, 'i').test(first) || !NOTION_CONTAINER_TAGS.includes(name) || first.startsWith('</');
  if (selfClosing) return { lines: out, next: i };
  let depth = 1;
  const openRe = new RegExp(`^\\t*<${name}(?=[\\s>])`, 'i');
  const closeRe = new RegExp(`</${name}>\\s*$`, 'i');
  while (i < lines.length && depth > 0) {
    const l = lines[i];
    if (openRe.test(l) && !closeRe.test(l)) depth++;
    else if (closeRe.test(l)) depth--;
    out.push(l);
    i++;
  }
  return { lines: out, next: i };
}

// ------------------------------------------------------------------ local -> Notion

function renderNotionTable(headers, rows) {
  const cell = (t) => `<td>${escapeInline(String(t ?? ''))}</td>`;
  const out = ['<table header-row="true">'];
  for (const r of [headers, ...rows]) {
    out.push('<tr>');
    for (let k = 0; k < headers.length; k++) out.push(cell(r[k]));
    out.push('</tr>');
  }
  out.push('</table>');
  return out;
}

/** Local Markdown -> the Notion Markdown to send. */
export function toNotion(md) {
  const blocks = parseLocal(md);
  const out = [];
  for (const b of blocks) {
    switch (b.type) {
      case 'heading':
        out.push(`${'#'.repeat(Math.min(b.level, 4))} ${escapeInline(b.text)}`);
        break;
      case 'paragraph':
        out.push(b.lines.map(escapeInline).join('<br>'));
        break;
      case 'item': {
        const marker = /^\d/.test(b.marker) ? b.marker : '-';
        const check = b.check ? `[${b.check === 'x' ? 'x' : ' '}] ` : '';
        out.push(`${'\t'.repeat(b.level)}${marker} ${check}${b.lines.map(escapeInline).join('<br>')}`);
        for (const p of b.paras) out.push(`${'\t'.repeat(b.level + 1)}${p.map(escapeInline).join('<br>')}`);
        break;
      }
      case 'table':
        out.push(...renderNotionTable(b.headers, b.rows));
        break;
      case 'code':
        out.push(...b.lines);
        break;
      case 'quote':
        out.push(`> ${b.lines.map(escapeInline).join('<br>')}`);
        break;
      case 'hr':
        out.push('---');
        break;
      case 'raw':
        out.push(...b.lines);
        break;
      case 'comment':
        // A star inside the note is escaped, so it cannot end the italic early.
        out.push(`*Note: ${escapeInline(b.text).replace(/(?<!\\)\*/g, '\\*')}*`);
        break;
      default:
        break;
    }
  }
  return out.join('\n');
}

// ------------------------------------------------------------------ Notion -> local

function parseNotionTable(text) {
  const rows = [];
  const header = /<table[^>]*header-row="true"/i.test(text);
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = rowRe.exec(text))) {
    const cells = [];
    const cellRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let c;
    while ((c = cellRe.exec(m[1]))) cells.push(unescapeInline(c[1].replace(/\n/g, '<br>').trim()));
    rows.push(cells);
  }
  if (!rows.length) return null;
  const width = Math.max(...rows.map((r) => r.length));
  for (const r of rows) while (r.length < width) r.push('');
  return { header, headers: rows[0], rows: rows.slice(1) };
}

/**
 * Notion Markdown -> blocks (same shapes as parseLocal) plus children:
 * the child pages and databases, as { type, url, id, title, line }.
 */
export function parseNotion(nmd) {
  const lines = String(nmd ?? '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  const children = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = isFence(line);
    if (fence) {
      const block = [line.replace(/^\t+/, '')];
      const marker = fence[2];
      i++;
      while (i < lines.length) {
        const l = lines[i];
        block.push(l);
        i++;
        const m = isFence(l);
        if (m && m[2][0] === marker[0] && m[2].length >= marker.length && !m[3].trim()) break;
      }
      blocks.push({ type: 'code', lines: block });
      continue;
    }
    const trimmed = line.trim();
    if (CHILD_RE.test(trimmed)) {
      const kind = /^<(page|database)/.exec(trimmed)[1];
      const url = (CHILD_URL_RE.exec(trimmed) || [])[1] || '';
      const title = trimmed.replace(/^<[^>]*>/, '').replace(/<\/(page|database)>\s*$/, '');
      children.push({ type: kind, url, title: unescapeInline(title), line: trimmed, index: blocks.length });
      i++;
      continue;
    }
    if (/^\t*<table\b/i.test(line)) {
      const start = i;
      while (i < lines.length && !/<\/table>\s*$/i.test(lines[i])) i++;
      const text = lines.slice(start, i + 1).join('\n');
      i++;
      const t = parseNotionTable(text);
      if (t) blocks.push({ type: 'table', headers: t.headers, rows: t.rows });
      continue;
    }
    if (BLOCK_TAG_LINE_RE.test(trimmed)) {
      const raw = collectContainer(lines, i);
      blocks.push({ type: 'raw', lines: raw.lines });
      i = raw.next;
      continue;
    }
    const h = /^(#{1,6}) (.*)$/.exec(line);
    if (h) {
      blocks.push({ type: 'heading', level: h[1].length, text: unescapeInline(h[2].trim()) });
      i++;
      continue;
    }
    if (/^---+\s*$/.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }
    if (/^> ?/.test(line)) {
      blocks.push({ type: 'quote', lines: line.replace(/^> ?/, '').split(BR_RE).map(unescapeInline) });
      i++;
      continue;
    }
    const item = NOTION_ITEM_RE.exec(line);
    if (item) {
      const check = item[3] ? item[3][1].toLowerCase() : null;
      blocks.push({
        type: 'item',
        level: item[1].length,
        marker: item[2],
        check: check === 'x' ? 'x' : check === null ? null : ' ',
        lines: item[4].split(BR_RE).map(unescapeInline),
        paras: [],
      });
      i++;
      continue;
    }
    const tabs = /^(\t+)(.*)$/.exec(line);
    const prev = blocks[blocks.length - 1];
    if (tabs && prev && prev.type === 'item' && tabs[1].length === prev.level + 1) {
      prev.paras.push(tabs[2].split(BR_RE).map(unescapeInline));
      i++;
      continue;
    }
    const note = NOTE_RE.exec(trimmed);
    if (note) {
      blocks.push({ type: 'comment', text: unescapeInline(note[1] ?? note[2]).replace(/\\\*/g, '*').trim() });
      i++;
      continue;
    }
    blocks.push({ type: 'paragraph', lines: trimmed.split(BR_RE).map(unescapeInline) });
    i++;
  }
  return { blocks, children };
}

function isOrdered(marker) {
  return /^\d/.test(marker);
}

/** 'spaced' when the first pipe table in the text uses "| --- |" delimiters, else 'compact' ("|---|"). */
export function detectTableStyle(text) {
  const m = /^\s*\|?(\s*):?-{3,}/m.exec(String(text ?? '').split('\n').find((l) => TABLE_DELIM_RE.test(l) && l.includes('-')) || '');
  return m && m[1].length ? 'spaced' : 'compact';
}

function renderPipeTable(headers, rows, style) {
  const text = renderTable(headers, rows).replace(/\n$/, '');
  if (style !== 'spaced') return text;
  const lines = text.split('\n');
  lines[1] = `| ${headers.map(() => '---').join(' | ')} |`;
  return lines.join('\n');
}

/**
 * Blocks -> local Markdown text (blank lines between blocks, tight lists).
 * opts.tableStyle: 'compact' (|---|, the default) or 'spaced' (| --- |).
 */
export function renderLocal(blocks, opts = {}) {
  const parts = [];
  const indents = []; // content column per list level
  let prev = null;
  for (const b of blocks) {
    let text;
    let sep = '\n\n';
    if (b.type === 'item') {
      indents.length = b.level;
      const pad = b.level > 0 ? ' '.repeat(indents[b.level - 1] ?? b.level * 2) : '';
      const marker = isOrdered(b.marker) ? b.marker : '-';
      const check = b.check ? `[${b.check}] ` : '';
      const content = pad.length + marker.length + 1;
      indents[b.level] = content;
      const cont = ' '.repeat(content);
      const lines = b.lines.map((l, k) => (k === 0 ? `${pad}${marker} ${check}${l}` : `${cont}${l}`));
      text = lines.join('  \n');
      for (const p of b.paras) text += `\n\n${p.map((l) => `${cont}${l}`).join('  \n')}`;
      if (prev && prev.type === 'item' && !(b.level === 0 && prev.level === 0 && isOrdered(b.marker) !== isOrdered(prev.marker)) && !prev.paras.length) sep = '\n';
    } else {
      indents.length = 0;
      switch (b.type) {
        case 'heading':
          text = `${'#'.repeat(b.level)} ${b.text}`;
          break;
        case 'paragraph':
          text = b.lines.join('  \n');
          break;
        case 'table':
          text = renderPipeTable(b.headers, b.rows, opts.tableStyle);
          break;
        case 'code':
        case 'raw':
          text = b.lines.join('\n');
          break;
        case 'comment':
          text = `<!-- ${b.text} -->`;
          break;
        case 'quote':
          text = b.lines.map((l) => `> ${l}`).join('  \n');
          break;
        case 'hr':
          text = '---';
          break;
        default:
          text = '';
      }
    }
    if (parts.length) parts.push(sep);
    parts.push(text);
    prev = b;
  }
  const out = parts.join('');
  return out ? `${out}\n` : '';
}

/**
 * Notion Markdown -> { markdown, children }. markdown is the local form
 * without child page and database lines; children lists them in order.
 */
export function fromNotion(nmd, opts = {}) {
  const { blocks, children } = parseNotion(nmd);
  const tableStyle = opts.tableStyle || (opts.styleFrom ? detectTableStyle(opts.styleFrom) : 'compact');
  return { markdown: renderLocal(blocks, { tableStyle }), children };
}

// ------------------------------------------------------------------ comparing

/**
 * A form of local Markdown for comparing: line ends, trailing spaces, blank
 * lines, table spacing, list tightness, and backslash escapes before
 * punctuation do not count. Words, order, and structure do.
 */
export function normalizeLocal(md) {
  const blocks = parseLocal(String(md ?? ''));
  const text = renderLocal(blocks);
  return text
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, '').replace(/\\([!-/:-@[-`{-~])/g, '$1'))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function sameLocal(a, b) {
  return normalizeLocal(a) === normalizeLocal(b);
}

// ------------------------------------------------------------------ titles

/**
 * Split a leading "# ..." heading from a body. Returns { title, body }:
 * title is the heading text (null when the body does not start with one),
 * body is the rest with leading blank lines removed.
 */
export function stripTitle(body) {
  const text = String(body ?? '').replace(/\r\n?/g, '\n');
  const m = /^\s*# (.+)\n?/.exec(text);
  if (!m) return { title: null, body: text };
  return { title: m[1].trim(), body: text.slice(m[0].length).replace(/^\s*\n/, '') };
}

/** Put a "# title" heading in front of a body. */
export function withTitle(title, body) {
  const rest = String(body ?? '').replace(/^\s+/, '');
  return rest ? `# ${title}\n\n${rest}` : `# ${title}\n`;
}

// ------------------------------------------------------------------ update plan

function leafKey(level, heading, seen) {
  const base = `${level}|${String(heading ?? '').replace(/\\(.)/g, '$1').replace(/\s+/g, ' ').trim().toLowerCase()}`;
  const n = (seen.get(base) || 0) + 1;
  seen.set(base, n);
  return `${base}#${n}`;
}

/**
 * Split Notion Markdown into leaves: the text before the first heading, then
 * each heading with the lines under it up to the next heading. Each leaf:
 * { key, level, heading, lines (raw Notion lines), local (its local form) }.
 */
export function notionLeaves(nmd) {
  const lines = String(nmd ?? '').replace(/\r\n?/g, '\n').split('\n');
  const leaves = [];
  const seen = new Map();
  let cur = { key: '0|#1', level: 0, heading: null, lines: [] };
  let fence = null;
  let inTable = false;
  for (const line of lines) {
    if (fence) {
      cur.lines.push(line);
      const m = isFence(line);
      if (m && m[2][0] === fence[0] && m[2].length >= fence.length && !m[3].trim()) fence = null;
      continue;
    }
    const f = isFence(line);
    if (f) {
      fence = f[2];
      cur.lines.push(line);
      continue;
    }
    if (/^\t*<table\b/i.test(line)) inTable = true;
    if (inTable) {
      cur.lines.push(line);
      if (/<\/table>\s*$/i.test(line)) inTable = false;
      continue;
    }
    const h = /^(#{1,6}) (.*)$/.exec(line);
    if (h) {
      leaves.push(cur);
      const text = unescapeInline(h[2].trim());
      cur = { key: leafKey(h[1].length, text, seen), level: h[1].length, heading: text, lines: [line] };
      continue;
    }
    cur.lines.push(line);
  }
  leaves.push(cur);
  for (const leaf of leaves) {
    while (leaf.lines.length && !leaf.lines[leaf.lines.length - 1].trim()) leaf.lines.pop();
    leaf.local = normalizeLocal(fromNotion(leaf.lines.join('\n')).markdown);
  }
  return leaves.filter((l, k) => k > 0 || l.lines.length);
}

/** Split local Markdown into leaves the same way: { key, level, heading, text, local }. */
export function localLeaves(md) {
  const lines = String(md ?? '').replace(/\r\n?/g, '\n').split('\n');
  const leaves = [];
  const seen = new Map();
  let cur = { key: '0|#1', level: 0, heading: null, lines: [] };
  let fence = null;
  for (const line of lines) {
    if (fence) {
      cur.lines.push(line);
      const m = isFence(line);
      if (m && m[2][0] === fence[0] && m[2].length >= fence.length && !m[3].trim()) fence = null;
      continue;
    }
    const f = isFence(line);
    if (f) {
      fence = f[2];
      cur.lines.push(line);
      continue;
    }
    const h = HEADING_RE.exec(line);
    if (h && h[1]) {
      leaves.push(cur);
      const text = (h[2] || '').trim();
      const level = Math.min(h[1].length, 4);
      cur = { key: leafKey(level, text, seen), level, heading: text, lines: [line] };
      continue;
    }
    cur.lines.push(line);
  }
  leaves.push(cur);
  for (const leaf of leaves) {
    leaf.text = leaf.lines.join('\n').replace(/\s+$/, '');
    leaf.local = normalizeLocal(leaf.text);
  }
  return leaves.filter((l, k) => k > 0 || l.text.trim());
}

function commonEnds(a, b) {
  let p = 0;
  while (p < a.length && p < b.length && a[p].key === b[p].key && a[p].local === b[p].local) p++;
  let s = 0;
  while (s < a.length - p && s < b.length - p && a[a.length - 1 - s].key === b[b.length - 1 - s].key && a[a.length - 1 - s].local === b[b.length - 1 - s].local) s++;
  return { p, s };
}

function countOccurrences(hay, needle) {
  if (!needle) return 0;
  let n = 0;
  let k = hay.indexOf(needle);
  while (k !== -1) {
    n++;
    k = hay.indexOf(needle, k + 1);
  }
  return n;
}

/**
 * Positions [i, j] where a[i] and b[j] have the same key and the same text,
 * in order (a longest common subsequence). These are the leaves the caller
 * left as they were.
 */
function unchangedPairs(a, b) {
  const same = (x, y) => x.key === y.key && x.local === y.local;
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = same(a[i], b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (same(a[i], b[j])) {
      out.push([i, j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return out;
}

/**
 * Split the changed range into segments of leaves the caller changed, added,
 * or removed. Leaves the caller left as they were are not in any segment, so
 * an owner edit in one of them is kept even when it sits between two changed
 * leaves. A segment whose leaves keep their keys one to one is split further,
 * one segment per leaf. Each segment: { b, n, before, after } where before and
 * after are the unchanged base leaves next to it (or null).
 */
function changedSegments(bMid, nMid) {
  const pairs = unchangedPairs(bMid, nMid);
  const segments = [];
  let pb = 0;
  let pn = 0;
  let prev = null;
  for (const [ai, aj] of [...pairs, [bMid.length, nMid.length]]) {
    const b = bMid.slice(pb, ai);
    const n = nMid.slice(pn, aj);
    const after = ai < bMid.length ? bMid[ai] : null;
    if (b.length || n.length) {
      if (b.length === n.length && b.every((l, k) => l.key === n[k].key)) {
        for (let k = 0; k < b.length; k++) segments.push({ b: [b[k]], n: [n[k]], before: k === 0 ? prev : b[k - 1], after: k === b.length - 1 ? after : b[k + 1] });
      } else {
        segments.push({ b, n, before: prev, after });
      }
    }
    prev = after;
    pb = ai + 1;
    pn = aj + 1;
  }
  return segments;
}

function sectionName(key) {
  return key.split('|')[1].replace(/#\d+$/, '') || '(top of the page)';
}

/** A fresh leaf carried along unchanged: its Notion lines as they are. */
function rawLeaf(leaf) {
  return { text: fromNotion(leaf.lines.join('\n')).markdown, raw: leaf.lines };
}

/**
 * Build PATCH /v1/pages/{id}/markdown operations that turn the page into
 * `next`, starting from a fresh read.
 *
 *   fresh   the page's Notion Markdown, just read (GET .../markdown)
 *   base    the local body the caller started from (optional). When given,
 *           sections the owner changed in Notion since then are kept; a
 *           section changed both by the owner and by the caller is a conflict.
 *           Only the sections the caller changed are rewritten, so an owner
 *           edit in a section between two changed sections is kept too.
 *   next    the local body the caller wants
 *
 * Returns { type: 'none' } when nothing changes,
 *   { type: 'update_content', ops: [{ old_str, new_str }], changed: [keys] },
 *   or { type: 'replace_content', new_str } when the page is empty or no
 *   unique old text can be found (then the new page keeps every section the
 *   caller did not change as it is in Notion).
 * Throws ToolkitError INVALID with details.conflicts on a conflict.
 * Child page and database lines inside a replaced range are kept in new_str.
 */
export function planUpdate({ fresh, base, next }) {
  const F = notionLeaves(fresh);
  const N = localLeaves(next);
  const freshText = String(fresh ?? '');
  if (!freshText.trim() || !F.length) {
    const body = toNotion(next);
    return body.trim() ? { type: 'replace_content', new_str: body, changed: N.map((l) => l.key) } : { type: 'none' };
  }
  const B = base === undefined || base === null ? F.map((l) => ({ key: l.key, local: l.local })) : localLeaves(base);

  // What the caller changed, relative to its base.
  const { p, s } = commonEnds(B, N);
  let bStart = p;
  let bEnd = B.length - s;
  let nStart = p;
  let nEnd = N.length - s;
  if (bStart === bEnd && nStart === nEnd) return { type: 'none' };
  if (bStart === bEnd) {
    // Pure insertion: take the leaf before it (or after it) along, so there is old text to match.
    if (bStart > 0) {
      bStart--;
      nStart--;
    } else {
      bEnd++;
      nEnd++;
    }
  }

  const fIndex = new Map(F.map((l, k) => [l.key, k]));
  const segments = changedSegments(B.slice(bStart, bEnd), N.slice(nStart, nEnd));
  const conflicts = [];
  const groups = [];
  for (const seg of segments) {
    // Every base leaf the caller changed must still be in the fresh page, unchanged, in one run.
    const fPos = [];
    let broken = false;
    for (const leaf of seg.b) {
      const fk = fIndex.get(leaf.key);
      const wanted = seg.n.find((l) => l.key === leaf.key);
      if (fk === undefined) {
        // Removed in Notion. Not a conflict when the caller removes it too.
        if (wanted) {
          conflicts.push({ section: sectionName(leaf.key), problem: 'was removed or renamed in Notion since it was read.' });
          broken = true;
        }
        continue;
      }
      if (F[fk].local !== leaf.local && (!wanted || wanted.local !== F[fk].local)) {
        conflicts.push({ section: sectionName(leaf.key), problem: 'was changed in Notion since it was read, and this update changes it too.' });
        broken = true;
      }
      fPos.push(fk);
    }
    if (broken) continue;
    for (let k = 1; k < fPos.length; k++) {
      if (fPos[k] !== fPos[k - 1] + 1) {
        conflicts.push({ section: sectionName(seg.b[k].key), problem: 'has new sections next to it in Notion.' });
        broken = true;
        break;
      }
    }
    if (broken) continue;
    if (fPos.length) {
      groups.push({ fFrom: fPos[0], fTo: fPos[fPos.length - 1] + 1, n: seg.n });
      continue;
    }
    if (!seg.n.length) continue;
    // Only new leaves: put them next to an unchanged neighbor, carried along as it is in Notion.
    const fb = seg.before ? fIndex.get(seg.before.key) : undefined;
    const fa = seg.after ? fIndex.get(seg.after.key) : undefined;
    if (fb !== undefined) groups.push({ fFrom: fb, fTo: fb + 1, n: [rawLeaf(F[fb]), ...seg.n] });
    else if (fa !== undefined) groups.push({ fFrom: fa, fTo: fa + 1, n: [...seg.n, rawLeaf(F[fa])] });
    else conflicts.push({ section: sectionName(seg.n[0].key), problem: 'is new, and the sections next to it were removed in Notion since it was read.' });
  }
  groups.sort((a, b) => a.fFrom - b.fFrom);
  if (!conflicts.length) {
    for (let k = 1; k < groups.length; k++) {
      if (groups[k].fFrom < groups[k - 1].fTo) {
        conflicts.push({ section: sectionName(F[groups[k].fFrom].key), problem: 'was moved in Notion since it was read.' });
        break;
      }
    }
  }
  if (conflicts.length) {
    throw new ToolkitError(EXIT.INVALID, `The page was changed in Notion while this update was prepared: ${conflicts.map((c) => `"${c.section}" ${c.problem}`).join(' ')} Read it again and redo the change.`, { conflicts });
  }
  // A group whose fresh text already is what the caller wants needs no operation.
  const live = groups.filter((g) => {
    const have = F.slice(g.fFrom, g.fTo).map((l) => l.local).join('\n');
    const want = g.n.map((l) => (l.raw ? normalizeLocal(l.text) : l.local)).join('\n');
    return have !== want;
  });
  if (!live.length) return { type: 'none' };

  const ops = [];
  const changed = [];
  let limit = 0; // an operation's old text must not reach into the previous one
  for (const g of live) {
    let from = g.fFrom;
    let extra = [];
    for (;;) {
      const op = buildOp(F.slice(from, g.fTo), [...extra, ...g.n]);
      if (op && countOccurrences(freshText, op.old_str) === 1) {
        ops.push(op);
        changed.push(...g.n.filter((l) => l.key).map((l) => l.key));
        break;
      }
      if (from <= limit) {
        return { type: 'replace_content', new_str: mergedPage(F, live), changed: live.flatMap((x) => x.n.filter((l) => l.key).map((l) => l.key)) };
      }
      from--;
      extra = [rawLeaf(F[from]), ...extra];
    }
    limit = g.fTo;
  }
  return { type: 'update_content', ops, changed };
}

/** The whole page with each group's leaves replaced; every other leaf stays as it is in Notion. */
function mergedPage(F, groups) {
  const parts = [];
  let k = 0;
  for (const g of groups) {
    for (; k < g.fFrom; k++) parts.push(F[k].lines.join('\n'));
    const kept = F.slice(g.fFrom, g.fTo).flatMap((l) => l.lines.filter((line) => CHILD_RE.test(line.trim())));
    parts.push(...g.n.map((l) => (l.raw ? l.raw.filter((line) => !CHILD_RE.test(line.trim())).join('\n') : toNotion(l.text))), ...kept);
    k = g.fTo;
  }
  for (; k < F.length; k++) parts.push(F[k].lines.join('\n'));
  return parts.filter((t) => t !== '').join('\n');
}

function buildOp(fLeaves, nLeaves) {
  const oldLines = fLeaves.flatMap((l) => l.lines);
  // Child page lines at the end of the range stay outside the replaced text.
  let end = oldLines.length;
  while (end > 0 && (CHILD_RE.test(oldLines[end - 1].trim()) || !oldLines[end - 1].trim())) end--;
  const kept = oldLines.slice(0, end);
  if (!kept.length) return null;
  const inner = kept.filter((l) => CHILD_RE.test(l.trim()));
  const newParts = nLeaves.map((l) => (l.raw ? l.raw.filter((line) => !CHILD_RE.test(line.trim())).join('\n') : toNotion(l.text)));
  const newStr = [...newParts.filter((t) => t !== ''), ...inner].join('\n');
  return { old_str: kept.join('\n'), new_str: newStr };
}

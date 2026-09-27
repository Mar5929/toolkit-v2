// YAML frontmatter for Markdown files, limited to the part of YAML the
// toolkit's records use.
//
// parse(text) -> { data, body, hasFrontmatter }
// stringify(data, body) -> text
// update(text, patch) -> text   (set keys; a key set to undefined is removed)
//
// Supported YAML: `key: value` scalars, "double" and 'single' quoted strings,
// inline lists [a, b] and maps {a: b}, block lists (`- item`), nested maps by
// indentation, block text (`|` and `>`), and # comments. Plain values are read
// as strings, except null (~, null, or nothing), true, false, and numbers that
// print back exactly (so 001 and 2026-09-26 stay strings).
//
// Key order is kept. stringify writes keys in the order of `data`, quoting a
// value only when it needs quotes. For a data object that came from parse(),
// every key whose value did not change is written back exactly as it was read,
// including comment lines above it, so an unchanged file round-trips byte for
// byte. Comments are never part of `data`.
//
// Two more things are kept for a data object that came from parse():
// - A changed text value keeps the quotes the old value had: a key written
//   `waiting_on: "none"` is written `waiting_on: "owner"` after a change.
// - A nested map one level deep (`metadata:` with `  type: project` under it)
//   keeps every unchanged inner line, its indentation, its comments, and the
//   order of its keys; only the inner keys that changed are written again.
//
// stringify(data, body, { quoteKeys: ['waiting_on'] }) always writes the
// text value of those top-level keys in double quotes when the line is
// written again (an unchanged line is still kept as it was).
//
// update() also takes a dotted key for one level of nesting:
// update(text, { 'metadata.type': 'feedback' }) changes only that inner line.

import { EXIT, ToolkitError } from './output.mjs';

const STYLE = new WeakMap();
const INLINE_LIST_WIDTH = 100;

// ---------------------------------------------------------------- parse

export function parse(text) {
  let src = typeof text === 'string' ? text : text == null ? '' : String(text);
  if (src.charCodeAt(0) === 0xfeff) src = src.slice(1);
  const open = /^---[ \t]*(\r?\n)/.exec(src);
  if (!open) return { data: {}, body: src, hasFrontmatter: false };
  const eol = open[1];
  const closeRe = /^(---|\.\.\.)([ \t]*)(\r?\n|$)/gm;
  closeRe.lastIndex = open[0].length;
  const close = closeRe.exec(src);
  if (!close) return { data: {}, body: src, hasFrontmatter: false };

  const yamlText = src.slice(open[0].length, close.index);
  const body = src.slice(close.index + close[0].length);
  const { data, meta } = parseYaml(yamlText, 2);
  meta.eol = eol;
  meta.open = open[0].slice(0, open[0].length - eol.length);
  meta.closeText = close[1] + close[2];
  meta.closeHadEol = close[3] !== '';
  STYLE.set(data, meta);
  return { data, body, hasFrontmatter: true };
}

function syntaxError(line, what) {
  return new ToolkitError(EXIT.INVALID, `Frontmatter line ${line.no} ${what}: ${line.orig.trim()}`, { line: line.no });
}

function incomplete(line) {
  const err = syntaxError(line, 'has a [list] or {map} that is not closed');
  err.incomplete = true;
  return err;
}

function expandLeadingTabs(raw) {
  return raw.replace(/^[ \t]+/, (m) => m.replace(/\t/g, '  '));
}

function indentOf(raw) {
  return raw.length - raw.replace(/^ +/, '').length;
}

function isBlankOrComment(raw) {
  return /^\s*(#.*)?$/.test(raw);
}

function nextContent(state, from) {
  for (let k = from; k < state.lines.length; k++) {
    if (!isBlankOrComment(state.lines[k].raw)) return k;
  }
  return -1;
}

function parseYaml(yamlText, firstLineNo) {
  const rawLines = yamlText.split(/\r?\n/);
  if (rawLines.length && rawLines[rawLines.length - 1] === '') rawLines.pop();
  const lines = rawLines.map((orig, idx) => ({ raw: expandLeadingTabs(orig), orig, no: firstLineNo + idx }));
  const state = { lines, i: 0 };
  const data = {};
  const meta = { keys: new Map(), trailing: [] };
  let leading = [];

  while (state.i < lines.length) {
    const line = lines[state.i];
    if (isBlankOrComment(line.raw)) {
      leading.push(line.orig);
      state.i++;
      continue;
    }
    if (indentOf(line.raw) !== 0) throw syntaxError(line, 'is indented but does not belong to a key above it');
    const startIdx = state.i;
    const { key, value } = parseMapEntry(state, 0);
    assignKey(data, key, value, line);
    const entryLines = lines.slice(startIdx, state.i);
    const saved = {
      value: cloneValue(value),
      leading,
      lines: entryLines.map((l) => l.orig),
      quote: quoteStyle(entryLines),
    };
    if (isPlainObject(value)) {
      const nested = nestedStyle(entryLines, value);
      if (nested) saved.nested = nested;
    }
    meta.keys.set(key, saved);
    leading = [];
  }
  meta.trailing = leading;
  return { data, meta };
}

/**
 * The quote character of a one-line `key: "value"` or `key: 'value'` entry
 * ('"' or "'"), or null for a plain value or a value on several lines.
 */
function quoteStyle(entryLines) {
  if (entryLines.length !== 1) return null;
  const raw = entryLines[0].raw;
  const m = /^[ \t]*(?:"(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^:]*?)[ \t]*:[ \t]+(["'])/.exec(raw);
  return m ? m[1] : null;
}

/**
 * How a block map one level deep was written, so an inner change keeps the
 * other inner lines: { header, indent, entries: Map(innerKey -> { value, leading,
 * lines, quote }), trailing }. Null when the value was written inline
 * (`key: {a: b}`) or the inner lines cannot be matched to the inner keys.
 */
function nestedStyle(entryLines, value) {
  if (entryLines.length < 2) return null;
  const header = entryLines[0];
  if (!/:[ \t]*(?:#.*)?$/.test(header.raw)) return null; // `key: {inline}` is rewritten as a whole
  const rest = entryLines.slice(1);
  const firstContent = rest.find((l) => !isBlankOrComment(l.raw));
  if (!firstContent) return null;
  const indent = indentOf(firstContent.raw);
  if (indent <= 0) return null;
  const keys = Object.keys(value);
  const entries = new Map();
  let leading = [];
  let current = null;
  let k = 0;
  for (const l of rest) {
    if (isBlankOrComment(l.raw)) {
      leading.push(l.orig);
      continue;
    }
    const ind = indentOf(l.raw);
    if (ind === indent) {
      const content = l.raw.slice(ind);
      if (content === '-' || content.startsWith('- ')) return null;
      let innerKey;
      try {
        innerKey = splitKey(content, l).key;
      } catch {
        return null;
      }
      if (innerKey !== keys[k]) return null; // a repeated key or an order the parser changed
      // Blank or comment lines between two inner keys belong to the next key.
      current ={ value: cloneValue(value[innerKey]), leading, lines: [l.orig], quote: quoteStyle([l]) };
      entries.set(innerKey, current);
      leading = [];
      k++;
      continue;
    }
    if (!current || ind < indent) return null;
    // A deeper line continues the current inner key; comments seen just before it belong to it too.
    current.lines.push(...leading, l.orig);
    current.quote = null;
    leading = [];
  }
  if (k !== keys.length) return null;
  return { header: header.orig, indent, entries, trailing: leading };
}

function assignKey(obj, key, value, line) {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    throw syntaxError(line, `uses the key "${key}", which is not allowed`);
  }
  obj[key] = value;
}

function splitKey(content, line) {
  if (content[0] === '"' || content[0] === "'") {
    const end = scanQuoted(content, 0);
    if (end < 0) throw syntaxError(line, 'has a key with no closing quote');
    const key = unquote(content.slice(0, end));
    const after = content.slice(end);
    const m = /^[ \t]*:(?=[ \t]|$)/.exec(after);
    if (!m) throw syntaxError(line, 'is not in the form "key: value"');
    return { key, rest: after.slice(m[0].length) };
  }
  const idx = content.search(/:(?=[ \t]|$)/);
  if (idx <= 0) throw syntaxError(line, 'is not in the form "key: value"');
  const key = content.slice(0, idx).trim();
  if (key === '-' || key.startsWith('- ')) throw syntaxError(line, 'is a list item where a key was expected');
  return { key, rest: content.slice(idx + 1) };
}

function looksLikeMapEntry(text) {
  if (text[0] === '"' || text[0] === "'") {
    const end = scanQuoted(text, 0);
    return end > 0 && /^[ \t]*:(?=[ \t]|$)/.test(text.slice(end));
  }
  if (text[0] === '[' || text[0] === '{') return false;
  return text.search(/:(?=[ \t]|$)/) > 0;
}

function parseMapEntry(state, indent) {
  const line = state.lines[state.i];
  const { key, rest } = splitKey(line.raw.slice(indent), line);
  state.i++;
  const value = parseValue(state, stripComment(rest).trim(), indent, line, true);
  return { key, value };
}

function parseMap(state, indent) {
  const obj = {};
  for (;;) {
    const j = nextContent(state, state.i);
    if (j === -1) break;
    const line = state.lines[j];
    const ind = indentOf(line.raw);
    if (ind < indent) break;
    if (ind > indent) throw syntaxError(line, 'is indented more than the lines above it');
    const content = line.raw.slice(ind);
    if (content === '-' || content.startsWith('- ')) break;
    state.i = j;
    const { key, value } = parseMapEntry(state, indent);
    assignKey(obj, key, value, line);
  }
  return obj;
}

function parseList(state, indent) {
  const arr = [];
  for (;;) {
    const j = nextContent(state, state.i);
    if (j === -1) break;
    const line = state.lines[j];
    const ind = indentOf(line.raw);
    if (ind < indent) break;
    if (ind > indent) throw syntaxError(line, 'is indented more than the list items above it');
    const content = line.raw.slice(ind);
    if (!(content === '-' || content.startsWith('- '))) break;
    state.i = j;
    const after = content === '-' ? '' : content.slice(2);
    const itemText = after.trimStart();
    const itemIndent = indent + 2 + (after.length - itemText.length);
    if (itemText === '' || itemText.startsWith('#')) {
      state.i++;
      arr.push(parseValue(state, '', indent, line, false));
      continue;
    }
    if (itemText === '-' || itemText.startsWith('- ')) {
      line.raw = ' '.repeat(itemIndent) + itemText;
      arr.push(parseList(state, itemIndent));
      continue;
    }
    if (looksLikeMapEntry(itemText)) {
      line.raw = ' '.repeat(itemIndent) + itemText;
      arr.push(parseMap(state, itemIndent));
      continue;
    }
    state.i++;
    arr.push(parseValue(state, stripComment(itemText).trim(), indent, line, false));
  }
  return arr;
}

function parseValue(state, v, ownerIndent, line, isMapValue) {
  if (v === '') {
    const j = nextContent(state, state.i);
    if (j !== -1) {
      const next = state.lines[j];
      const ind = indentOf(next.raw);
      const content = next.raw.slice(ind);
      const isItem = content === '-' || content.startsWith('- ');
      if (ind > ownerIndent) {
        state.i = j;
        return isItem ? parseList(state, ind) : parseMap(state, ind);
      }
      if (isMapValue && ind === ownerIndent && isItem) {
        state.i = j;
        return parseList(state, ind);
      }
    }
    return null;
  }

  if (/^[|>](?:[+-]?[1-9]?|[1-9][+-])$/.test(v)) return parseBlockScalar(state, v, ownerIndent);

  if (v[0] === '"' || v[0] === "'") {
    let text = v;
    const pieces = [v];
    while (scanQuoted(text, 0) < 0) {
      if (state.i >= state.lines.length) throw syntaxError(line, 'has a quoted value with no closing quote');
      const next = state.lines[state.i];
      // A line back at the key's indentation that looks like "key: value" starts
      // the next key; the quote above it was never closed.
      if (!isBlankOrComment(next.raw) && indentOf(next.raw) <= ownerIndent && looksLikeMapEntry(next.raw.trim())) {
        throw syntaxError(line, 'has a quoted value with no closing quote');
      }
      pieces.push(state.lines[state.i++].raw.trim());
      text = foldPieces(pieces);
    }
    const end = scanQuoted(text, 0);
    const tail = stripComment(text.slice(end)).trim();
    if (tail) throw syntaxError(line, 'has text after a quoted value');
    return unquote(text.slice(0, end));
  }

  if (v[0] === '[' || v[0] === '{') {
    let text = v;
    for (;;) {
      try {
        const { value, end } = parseFlow(text, 0, line);
        if (stripComment(text.slice(end)).trim()) throw syntaxError(line, 'has text after a [list] or {map}');
        return value;
      } catch (err) {
        const next = state.lines[state.i];
        if (err.incomplete && next && !/^\s*$/.test(next.raw) && indentOf(next.raw) > ownerIndent) {
          text += ` ${stripComment(next.raw.trim()).trim()}`;
          state.i++;
          continue;
        }
        throw err;
      }
    }
  }

  // Plain value, possibly continued on more-indented lines.
  let text = v;
  while (state.i < state.lines.length) {
    const next = state.lines[state.i];
    if (isBlankOrComment(next.raw) || indentOf(next.raw) <= ownerIndent) break;
    text += ` ${stripComment(next.raw.trim()).trim()}`;
    state.i++;
  }
  return scalar(text);
}

function foldPieces(pieces) {
  let out = pieces[0];
  let prevEmpty = false;
  for (let k = 1; k < pieces.length; k++) {
    const p = pieces[k];
    if (p === '') {
      out += '\n';
      prevEmpty = true;
    } else {
      out += prevEmpty ? p : ` ${p}`;
      prevEmpty = false;
    }
  }
  return out;
}

function parseBlockScalar(state, header, ownerIndent) {
  const style = header[0];
  const chomp = header.includes('-') ? 'strip' : header.includes('+') ? 'keep' : 'clip';
  const digit = /[1-9]/.exec(header);
  let blockIndent = digit ? ownerIndent + Number(digit[0]) : null;
  const collected = [];
  while (state.i < state.lines.length) {
    const l = state.lines[state.i];
    if (/^\s*$/.test(l.raw)) {
      collected.push('');
      state.i++;
      continue;
    }
    const ind = indentOf(l.raw);
    if (ind <= ownerIndent) break;
    if (blockIndent === null) blockIndent = ind;
    if (ind < blockIndent) break;
    collected.push(l.raw.slice(blockIndent));
    state.i++;
  }
  let trailingBlank = 0;
  while (collected.length && collected[collected.length - 1] === '') {
    collected.pop();
    trailingBlank++;
  }
  // Leave trailing blank lines to be read again as separators.
  state.i -= trailingBlank;

  let text;
  if (style === '|') {
    text = collected.join('\n');
  } else {
    text = '';
    let prevEmpty = true;
    collected.forEach((l, idx) => {
      if (l === '') {
        text += '\n';
        prevEmpty = true;
        return;
      }
      if (idx === 0 || prevEmpty) text += l;
      else if (/^\s/.test(l) || /^\s/.test(collected[idx - 1])) text += `\n${l}`;
      else text += ` ${l}`;
      prevEmpty = false;
    });
  }
  if (!collected.length) return chomp === 'keep' ? '\n'.repeat(trailingBlank) : '';
  if (chomp === 'strip') return text;
  if (chomp === 'clip') return `${text}\n`;
  return `${text}\n${'\n'.repeat(trailingBlank)}`;
}

function skipWs(s, pos) {
  while (pos < s.length && (s[pos] === ' ' || s[pos] === '\t')) pos++;
  return pos;
}

function parseFlow(s, pos, line) {
  pos = skipWs(s, pos);
  if (pos >= s.length) throw incomplete(line);
  const ch = s[pos];
  if (ch === '[') {
    const arr = [];
    pos++;
    for (;;) {
      pos = skipWs(s, pos);
      if (pos >= s.length) throw incomplete(line);
      if (s[pos] === ']') return { value: arr, end: pos + 1 };
      const item = parseFlowNode(s, pos, line, ',]');
      arr.push(item.value);
      pos = skipWs(s, item.end);
      if (pos >= s.length) throw incomplete(line);
      if (s[pos] === ',') {
        pos++;
        continue;
      }
      if (s[pos] === ']') return { value: arr, end: pos + 1 };
      throw syntaxError(line, `has an unexpected "${s[pos]}" in a [list]`);
    }
  }
  if (ch === '{') {
    const obj = {};
    pos++;
    for (;;) {
      pos = skipWs(s, pos);
      if (pos >= s.length) throw incomplete(line);
      if (s[pos] === '}') return { value: obj, end: pos + 1 };
      let key;
      if (s[pos] === '"' || s[pos] === "'") {
        const e = scanQuoted(s, pos);
        if (e < 0) throw incomplete(line);
        key = unquote(s.slice(pos, e));
        pos = e;
      } else {
        let k = pos;
        while (k < s.length && s[k] !== ',' && s[k] !== '}' && !(s[k] === ':' && (k + 1 >= s.length || ' \t,}'.includes(s[k + 1])))) k++;
        key = s.slice(pos, k).trim();
        pos = k;
      }
      pos = skipWs(s, pos);
      let value = null;
      if (s[pos] === ':') {
        const item = parseFlowNode(s, pos + 1, line, ',}');
        value = item.value;
        pos = item.end;
      }
      assignKey(obj, key, value, line);
      pos = skipWs(s, pos);
      if (pos >= s.length) throw incomplete(line);
      if (s[pos] === ',') {
        pos++;
        continue;
      }
      if (s[pos] === '}') return { value: obj, end: pos + 1 };
      throw syntaxError(line, `has an unexpected "${s[pos]}" in a {map}`);
    }
  }
  return parseFlowNode(s, pos, line, ',]}');
}

function parseFlowNode(s, pos, line, stops) {
  pos = skipWs(s, pos);
  if (pos >= s.length) return { value: null, end: pos };
  const ch = s[pos];
  if (ch === '[' || ch === '{') return parseFlow(s, pos, line);
  if (ch === '"' || ch === "'") {
    const e = scanQuoted(s, pos);
    if (e < 0) throw incomplete(line);
    return { value: unquote(s.slice(pos, e)), end: e };
  }
  let k = pos;
  while (k < s.length && !stops.includes(s[k])) k++;
  return { value: scalar(s.slice(pos, k).trim()), end: k };
}

/** Index just past the closing quote of the quoted string starting at pos, or -1. */
function scanQuoted(s, pos) {
  const q = s[pos];
  let k = pos + 1;
  if (q === '"') {
    while (k < s.length) {
      if (s[k] === '\\') k += 2;
      else if (s[k] === '"') return k + 1;
      else k++;
    }
    return -1;
  }
  while (k < s.length) {
    if (s[k] === "'") {
      if (s[k + 1] === "'") k += 2;
      else return k + 1;
    } else k++;
  }
  return -1;
}

const ESCAPES = {
  n: '\n', t: '\t', r: '\r', 0: '\0', '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f',
  v: '\v', a: '\x07', e: '\x1b', ' ': ' ', N: '\u0085', _: '\u00a0', L: '\u2028', P: '\u2029', '\t': '\t',
};

function unquote(q) {
  if (q[0] === "'") return q.slice(1, -1).replace(/''/g, "'");
  const inner = q.slice(1, -1);
  return inner.replace(/\\(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|[\s\S])/g, (m, e) => {
    if (e.length > 1) return String.fromCodePoint(parseInt(e.slice(1), 16));
    return Object.prototype.hasOwnProperty.call(ESCAPES, e) ? ESCAPES[e] : e;
  });
}

/** Remove a trailing `# comment` that sits outside quotes. */
function stripComment(s) {
  let quote = null;
  let prevSignificant = '';
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (quote === '"') {
      if (c === '\\') k++;
      else if (c === '"') quote = null;
      continue;
    }
    if (quote === "'") {
      if (c === "'") {
        if (s[k + 1] === "'") k++;
        else quote = null;
      }
      continue;
    }
    if ((c === '"' || c === "'") && (prevSignificant === '' || '[{,:'.includes(prevSignificant))) {
      quote = c;
      continue;
    }
    if (c === '#' && (k === 0 || /\s/.test(s[k - 1]))) return s.slice(0, k);
    if (!/\s/.test(c)) prevSignificant = c;
  }
  return s;
}

function scalar(t) {
  if (t === '' || t === '~' || /^(?:null|Null|NULL)$/.test(t)) return null;
  if (/^(?:true|True|TRUE)$/.test(t)) return true;
  if (/^(?:false|False|FALSE)$/.test(t)) return false;
  if (/^-?\d+(?:\.\d+)?$/.test(t) && String(Number(t)) === t) return Number(t);
  return t;
}

function cloneValue(v) {
  return v === null || typeof v !== 'object' ? v : structuredClone(v);
}

// ---------------------------------------------------------------- stringify

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  }
  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
  }
  if (isPlainObject(a)) {
    if (!isPlainObject(b)) return false;
    const ka = Object.keys(a).filter((k) => a[k] !== undefined);
    const kb = Object.keys(b).filter((k) => b[k] !== undefined);
    return ka.length === kb.length && ka.every((k, i) => k === kb[i] && deepEqual(a[k], b[k]));
  }
  return Number.isNaN(a) && Number.isNaN(b);
}

const RESERVED_WORDS = /^(?:null|Null|NULL|~|true|True|TRUE|false|False|FALSE|yes|Yes|YES|no|No|NO|on|On|ON|off|Off|OFF)$/;

function looksNumeric(s) {
  return /^[-+]?(?:\.\d+|\d[\d_]*(?:\.\d*)?)(?:[eE][-+]?\d+)?$/.test(s)
    || /^0x[0-9a-fA-F]+$/.test(s)
    || /^0o[0-7]+$/.test(s)
    || /^[-+]?\.(?:inf|Inf|INF)$/.test(s)
    || /^\.(?:nan|NaN|NAN)$/.test(s);
}

/** True when a string must be quoted to be read back as the same string. */
export function needsQuotes(s, inFlow = false) {
  if (s === '') return true;
  if (s !== s.trim()) return true;
  if (/[\x00-\x1f\x7f\u0085\u2028\u2029\ufeff]/.test(s)) return true;
  if (/^[[\]{}#&*!|>'"%@`,]/.test(s)) return true;
  if (/^[-?:](?:\s|$)/.test(s)) return true;
  if (/:(?:\s|$)/.test(s)) return true;
  if (/\s#/.test(s)) return true;
  if (inFlow && /[,[\]{}]/.test(s)) return true;
  if (/^(?:---|\.\.\.)/.test(s)) return true;
  if (RESERVED_WORDS.test(s)) return true;
  if (looksNumeric(s)) return true;
  return false;
}

function formatScalar(v, inFlow = false) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : JSON.stringify(String(v));
  if (typeof v === 'bigint') return String(v);
  if (v instanceof Date) return v.toISOString();
  const s = String(v);
  return needsQuotes(s, inFlow) ? JSON.stringify(s) : s;
}

function formatKey(key) {
  const k = String(key);
  if (k === '' || k !== k.trim() || /[\x00-\x1f\x7f]/.test(k) || /^[-?:,[\]{}#&*!|>'"%@`]/.test(k) || /:(?:\s|$)/.test(k) || /\s#/.test(k)) {
    return JSON.stringify(k);
  }
  return k;
}

function isScalarValue(v) {
  return v === null || v instanceof Date || typeof v !== 'object';
}

function formatEntry(key, value, indent) {
  const pad = ' '.repeat(indent);
  const k = formatKey(key);
  if (value === undefined) return [];
  if (value === null) return [`${pad}${k}:`];
  if (Array.isArray(value)) {
    if (value.length === 0) return [`${pad}${k}: []`];
    if (value.every(isScalarValue)) {
      const inline = `[${value.map((v) => formatScalar(v, true)).join(', ')}]`;
      if (pad.length + k.length + 2 + inline.length <= INLINE_LIST_WIDTH) return [`${pad}${k}: ${inline}`];
    }
    return [`${pad}${k}:`, ...value.flatMap((item) => formatItem(item, indent + 2))];
  }
  if (isPlainObject(value)) {
    const keys = Object.keys(value).filter((x) => value[x] !== undefined);
    if (!keys.length) return [`${pad}${k}: {}`];
    return [`${pad}${k}:`, ...keys.flatMap((x) => formatEntry(x, value[x], indent + 2))];
  }
  return [`${pad}${k}: ${formatScalar(value)}`];
}

function formatItem(item, indent) {
  const pad = ' '.repeat(indent);
  if (item === null || item === undefined) return [`${pad}-`];
  if (Array.isArray(item)) {
    if (item.length === 0) return [`${pad}- []`];
    if (item.every(isScalarValue)) return [`${pad}- [${item.map((v) => formatScalar(v, true)).join(', ')}]`];
    const nested = item.flatMap((x) => formatItem(x, indent + 2));
    nested[0] = `${pad}- ${nested[0].slice(indent + 2)}`;
    return nested;
  }
  if (isPlainObject(item)) {
    const keys = Object.keys(item).filter((x) => item[x] !== undefined);
    if (!keys.length) return [`${pad}- {}`];
    const nested = keys.flatMap((x) => formatEntry(x, item[x], indent + 2));
    nested[0] = `${pad}- ${nested[0].slice(indent + 2)}`;
    return nested;
  }
  return [`${pad}- ${formatScalar(item)}`];
}

/** A text value in the given quotes: '"' (JSON-style escapes) or "'" (quotes doubled). */
function quoted(s, quote) {
  if (quote === "'" && !/[\n\r]/.test(s) && !/[\x00-\x1f\x7f]/.test(s)) return `'${s.replace(/'/g, "''")}'`;
  return JSON.stringify(s);
}

/** One `key: value` line for a changed scalar, keeping the quote style when there is one. */
function formatScalarEntry(key, value, indent, quote) {
  if (quote && typeof value === 'string') return [`${' '.repeat(indent)}${formatKey(key)}: ${quoted(value, quote)}`];
  return formatEntry(key, value, indent);
}

/** Lines for a changed nested map, keeping every unchanged inner line as it was read. */
function formatNested(key, value, saved) {
  const nested = saved.nested;
  const out = [nested.header];
  const innerKeys = Object.keys(value).filter((x) => value[x] !== undefined);
  for (const inner of innerKeys) {
    const v = value[inner];
    const old = nested.entries.get(inner);
    if (old) {
      out.push(...old.leading);
      if (deepEqual(old.value, v)) out.push(...old.lines);
      else out.push(...formatScalarEntry(inner, v, nested.indent, old.quote));
    } else {
      out.push(...formatEntry(inner, v, nested.indent));
    }
  }
  out.push(...nested.trailing);
  return out;
}

/**
 * Build a Markdown file from frontmatter data and a body.
 * With no keys (and data that did not come from parse()), returns the body alone.
 * opts.quoteKeys: top-level keys whose text value is always written in double
 * quotes when its line is written again.
 */
export function stringify(data, body = '', opts = {}) {
  const text = body == null ? '' : String(body);
  if (data == null) return text;
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new ToolkitError(EXIT.INVALID, 'Frontmatter data must be an object of keys and values.');
  }
  const meta = STYLE.get(data);
  const keys = Object.keys(data).filter((k) => data[k] !== undefined);
  if (!keys.length && !meta) return text;
  const alwaysQuote = new Set((opts && opts.quoteKeys) || []);

  const eol = meta ? meta.eol : '\n';
  const lines = [];
  for (const key of keys) {
    const value = data[key];
    const saved = meta && meta.keys.get(key);
    if (saved) lines.push(...saved.leading);
    if (saved && deepEqual(saved.value, value)) lines.push(...saved.lines);
    else if (saved && saved.nested && isPlainObject(value) && Object.keys(value).some((x) => value[x] !== undefined)) {
      lines.push(...formatNested(key, value, saved));
    } else {
      const quote = alwaysQuote.has(key) ? '"' : (saved ? saved.quote : null);
      lines.push(...formatScalarEntry(key, value, 0, quote));
    }
  }
  if (meta) lines.push(...meta.trailing);

  const open = meta ? meta.open : '---';
  const closeText = meta ? meta.closeText : '---';
  const closeEol = !meta || meta.closeHadEol || text !== '' ? eol : '';
  return `${open}${eol}${lines.map((l) => l + eol).join('')}${closeText}${closeEol}${text}`;
}

/**
 * Change some frontmatter keys of a Markdown text and return the new text.
 * A key set to undefined is removed. New keys are added at the end.
 */
export function update(text, patch = {}, opts = {}) {
  const { data, body, hasFrontmatter } = parse(text);
  const bad = (k) => k === '__proto__' || k === 'constructor' || k === 'prototype';
  for (const [key, value] of Object.entries(patch)) {
    if (bad(key)) throw new ToolkitError(EXIT.INVALID, `The frontmatter key "${key}" is not allowed.`);
    const dot = key.indexOf('.');
    if (dot > 0 && !Object.prototype.hasOwnProperty.call(data, key)) {
      // One level of nesting: 'metadata.type' changes only that inner key.
      const outer = key.slice(0, dot);
      const inner = key.slice(dot + 1);
      if (bad(outer) || bad(inner)) throw new ToolkitError(EXIT.INVALID, `The frontmatter key "${key}" is not allowed.`);
      const current = data[outer];
      const obj = isPlainObject(current) ? { ...current } : {};
      if (value === undefined) delete obj[inner];
      else obj[inner] = value;
      if (Object.keys(obj).length) data[outer] = obj;
      else if (isPlainObject(current)) delete data[outer];
      continue;
    }
    if (value === undefined) delete data[key];
    else data[key] = value;
  }
  if (!hasFrontmatter && !Object.keys(data).length) return body;
  return stringify(data, body, opts);
}

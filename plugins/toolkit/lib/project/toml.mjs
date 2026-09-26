// A small reader for the part of TOML the toolkit touches, and the
// `merge-toml` install mode (templates/TEMPLATE-LANGUAGE.md, "merge-toml").
//
// The toolkit reads two TOML files: the project's .codex/config.toml (plugin
// switches) and Codex's own ~/.codex/config.toml (trusted folders, hook trust,
// installed plugins). It never needs the full language, so this reader keeps
// every line as it is and only understands table headers ([a."b"] and
// [[a.b]]), `key = value` lines, comments, and blank lines. A value that spans
// several lines (an array or a triple-quoted string) is kept as one entry.
//
// parseToml(text)           -> { lines, entries }
// tomlGet(text, path)       -> the value at a key path such as
//                              ['projects', '/Users/me/app', 'trust_level'], or undefined
// tomlTables(text)          -> every table header as a key path
// mergeToml(target, source) -> { text, changed, conflicts, added, replaced }

const BARE = /^[A-Za-z0-9_-]+$/;

/** Split a dotted key such as plugins."a@b".enabled into its parts. Returns null when it cannot be read. */
export function parseKeyPath(text) {
  const parts = [];
  let i = 0;
  const s = String(text).trim();
  if (!s) return null;
  while (i < s.length) {
    while (s[i] === ' ' || s[i] === '\t') i++;
    if (s[i] === '"') {
      let j = i + 1;
      let out = '';
      while (j < s.length && s[j] !== '"') {
        if (s[j] === '\\' && j + 1 < s.length) {
          const next = s[j + 1];
          out += next === 'n' ? '\n' : next === 't' ? '\t' : next;
          j += 2;
        } else {
          out += s[j];
          j++;
        }
      }
      if (s[j] !== '"') return null;
      parts.push(out);
      i = j + 1;
    } else if (s[i] === "'") {
      const j = s.indexOf("'", i + 1);
      if (j === -1) return null;
      parts.push(s.slice(i + 1, j));
      i = j + 1;
    } else {
      let j = i;
      while (j < s.length && /[A-Za-z0-9_-]/.test(s[j])) j++;
      if (j === i) return null;
      parts.push(s.slice(i, j));
      i = j;
    }
    while (s[i] === ' ' || s[i] === '\t') i++;
    if (i >= s.length) break;
    if (s[i] !== '.') return null;
    i++;
  }
  return parts;
}

/** Write a key path back as TOML: bare parts stay bare, others are quoted. */
export function formatKeyPath(parts) {
  return parts.map((p) => (BARE.test(p) ? p : JSON.stringify(p))).join('.');
}

/** The index of the `=` that ends the key on a key line, or -1. Quotes in the key are skipped. */
function equalsIndex(line) {
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === '\\' && quote === '"') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    else if (c === '=') return i;
    else if (c === '#') return -1;
  }
  return -1;
}

/** Remove a trailing comment from a value, leaving strings alone. */
function stripComment(value) {
  let quote = null;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (quote) {
      if (c === '\\' && quote === '"') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    else if (c === '#') return value.slice(0, i).trimEnd();
  }
  return value.trimEnd();
}

/** True when the brackets and braces in a value are balanced (strings skipped). */
function balanced(text) {
  let depth = 0;
  let quote = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === '\\' && quote === '"') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    else if (c === '#') {
      const nl = text.indexOf('\n', i);
      if (nl === -1) break;
      i = nl;
    } else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') depth--;
  }
  return depth <= 0;
}

/** Read a simple TOML value: strings, booleans, numbers; arrays and inline tables as parsed objects when simple. */
export function parseValue(raw) {
  const v = stripComment(String(raw).trim());
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^[+-]?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v.startsWith('"""') || v.startsWith("'''")) {
    const q = v.slice(0, 3);
    return v.endsWith(q) && v.length >= 6 ? v.slice(3, -3).replace(/^\n/, '') : v;
  }
  if (v.startsWith('"')) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1);
    }
  }
  if (v.startsWith("'")) return v.endsWith("'") ? v.slice(1, -1) : v;
  if (v.startsWith('{')) return parseInlineTable(v);
  if (v.startsWith('[')) return parseInlineArray(v);
  return v;
}

function splitTopLevel(inner) {
  const items = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (quote) {
      if (c === '\\' && quote === '"') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') depth--;
    else if (c === ',' && depth === 0) {
      items.push(inner.slice(start, i));
      start = i + 1;
    }
  }
  items.push(inner.slice(start));
  return items.map((s) => s.replace(/#[^\n]*/g, '').trim()).filter((s) => s !== '');
}

function parseInlineTable(text) {
  const inner = text.trim().replace(/^\{/, '').replace(/\}$/, '');
  const out = {};
  for (const item of splitTopLevel(inner)) {
    const eq = equalsIndex(item);
    if (eq === -1) continue;
    const key = parseKeyPath(item.slice(0, eq));
    if (!key) continue;
    let cur = out;
    for (let i = 0; i < key.length - 1; i++) {
      if (!cur[key[i]] || typeof cur[key[i]] !== 'object') cur[key[i]] = {};
      cur = cur[key[i]];
    }
    cur[key[key.length - 1]] = parseValue(item.slice(eq + 1));
  }
  return out;
}

function parseInlineArray(text) {
  const inner = text.trim().replace(/^\[/, '').replace(/\]$/, '');
  return splitTopLevel(inner).map(parseValue);
}

/**
 * Read a TOML text into line entries.
 * entries: { kind: 'header'|'key'|'comment'|'blank'|'other', start, end (line indexes, inclusive),
 *            table (key path of the table the line is in), keyPath, raw, valueRaw, arrayTable }
 */
export function parseToml(text) {
  const lines = String(text ?? '').split('\n');
  const entries = [];
  let table = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (t === '') {
      entries.push({ kind: 'blank', start: i, end: i, table });
      continue;
    }
    if (t.startsWith('#')) {
      entries.push({ kind: 'comment', start: i, end: i, table });
      continue;
    }
    const header = /^\[(\[?)\s*(.+?)\s*(\]?)\]\s*(#.*)?$/.exec(t);
    if (header && (header[1] === header[3])) {
      const keyPath = parseKeyPath(header[2]);
      if (keyPath) {
        table = keyPath;
        entries.push({ kind: 'header', start: i, end: i, table, keyPath, arrayTable: header[1] === '[', raw: line });
        continue;
      }
    }
    const eq = equalsIndex(line);
    if (eq > 0) {
      const keyPath = parseKeyPath(line.slice(0, eq));
      if (keyPath) {
        let valueRaw = line.slice(eq + 1);
        let end = i;
        const opener = valueRaw.trim();
        if (opener.startsWith('"""') || opener.startsWith("'''")) {
          const q = opener.slice(0, 3);
          if (!(opener.length >= 6 && opener.endsWith(q))) {
            while (end + 1 < lines.length) {
              end++;
              valueRaw += `\n${lines[end]}`;
              if (lines[end].includes(q)) break;
            }
          }
        } else if ((opener.startsWith('[') || opener.startsWith('{')) && !balanced(valueRaw)) {
          while (end + 1 < lines.length && !balanced(valueRaw)) {
            end++;
            valueRaw += `\n${lines[end]}`;
          }
        }
        entries.push({ kind: 'key', start: i, end, table, keyPath, valueRaw, raw: lines.slice(i, end + 1).join('\n') });
        i = end;
        continue;
      }
    }
    entries.push({ kind: 'other', start: i, end: i, table });
  }
  return { lines, entries };
}

function samePath(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

function startsWith(path, prefix) {
  return prefix.length <= path.length && prefix.every((x, i) => x === path[i]);
}

/** The value at a key path, or undefined. Inline tables along the way are looked into. */
export function tomlGet(text, wanted) {
  const { entries } = parseToml(text);
  let found;
  for (const e of entries) {
    if (e.kind !== 'key') continue;
    const full = [...e.table, ...e.keyPath];
    if (samePath(full, wanted)) found = parseValue(e.valueRaw);
    else if (startsWith(wanted, full) && e.valueRaw.trim().startsWith('{')) {
      let cur = parseValue(e.valueRaw);
      for (const part of wanted.slice(full.length)) cur = cur && typeof cur === 'object' ? cur[part] : undefined;
      if (cur !== undefined) found = cur;
    }
  }
  return found;
}

/** Every table header in the file, as key paths (array tables included once each). */
export function tomlTables(text) {
  return parseToml(text).entries.filter((e) => e.kind === 'header').map((e) => e.keyPath);
}

/** Every key path defined in the file (table path plus key path). */
export function tomlKeys(text) {
  return parseToml(text).entries.filter((e) => e.kind === 'key').map((e) => [...e.table, ...e.keyPath]);
}

/** The tables of a merge source: [{ keyPath, headerRaw, comments: [lines], keys: [{ keyPath, raw }] }]. */
function sourceTables(sourceText) {
  const { lines, entries } = parseToml(sourceText);
  const tables = [];
  let current = null;
  for (let n = 0; n < entries.length; n++) {
    const e = entries[n];
    if (e.kind === 'header') {
      const comments = [];
      for (let j = e.start - 1; j >= 0 && lines[j].trim().startsWith('#'); j--) comments.unshift(lines[j]);
      current = { keyPath: e.keyPath, headerRaw: e.raw.trim(), comments, keys: [], arrayTable: e.arrayTable };
      tables.push(current);
    } else if (e.kind === 'key' && current) {
      current.keys.push({ keyPath: e.keyPath, raw: e.raw.trim() });
    }
  }
  return tables;
}

/**
 * The `merge-toml` install mode.
 * target: the current file text, or null when the file is missing.
 * Returns { text, changed, conflicts: [message], added: [description], replaced: [description] }.
 * On a conflict the text is the target, unchanged.
 */
export function mergeToml(target, source) {
  const src = String(source);
  if (target === null || target === undefined) {
    return { text: src.endsWith('\n') ? src : `${src}\n`, changed: true, conflicts: [], added: ['the whole file'], replaced: [] };
  }
  const tables = sourceTables(src);
  const keyEntries = parseToml(target).entries.filter((e) => e.kind === 'key');
  const conflicts = [];
  for (const t of tables) {
    for (const k of t.keys) {
      const want = [...t.keyPath, ...k.keyPath];
      for (const e of keyEntries) {
        const full = [...e.table, ...e.keyPath];
        const direct = samePath(e.table, t.keyPath) && samePath(e.keyPath, k.keyPath);
        if (direct) continue;
        // A dotted key or an inline table that names the same setting, or that
        // defines the source's table in another way, makes the file ambiguous.
        const clash = startsWith(want, full)
          || startsWith(full, want)
          || (startsWith(full, t.keyPath) && !samePath(e.table, t.keyPath));
        if (clash) {
          conflicts.push(`${formatKeyPath(want)} is already set another way (line ${e.start + 1}: ${e.raw.split('\n')[0].trim()})`);
        }
      }
    }
  }
  if (conflicts.length) return { text: target, changed: false, conflicts: [...new Set(conflicts)], added: [], replaced: [] };

  const lines = target.replace(/\n+$/, '').split('\n');
  if (lines.length === 1 && lines[0] === '') lines.length = 0;
  const added = [];
  const replaced = [];
  for (const t of tables) {
    const reparsed = parseToml(lines.join('\n'));
    const header = reparsed.entries.find((e) => e.kind === 'header' && !e.arrayTable === !t.arrayTable && samePath(e.keyPath, t.keyPath));
    if (!header) {
      lines.push('', ...t.comments, t.headerRaw, ...t.keys.map((k) => k.raw));
      added.push(`[${formatKeyPath(t.keyPath)}]`);
      continue;
    }
    for (const k of t.keys) {
      const now = parseToml(lines.join('\n'));
      const idx = now.entries.findIndex((e) => e.kind === 'header' && e.start === header.start);
      let lastKeyEnd = header.start;
      let existing = null;
      for (let n = idx + 1; n < now.entries.length; n++) {
        const e = now.entries[n];
        if (e.kind === 'header') break;
        if (e.kind === 'key') {
          lastKeyEnd = e.end;
          if (samePath(e.keyPath, k.keyPath)) existing = e;
        }
      }
      if (existing) {
        const current = lines.slice(existing.start, existing.end + 1).join('\n').trim();
        if (current !== k.raw) {
          lines.splice(existing.start, existing.end - existing.start + 1, k.raw);
          replaced.push(`${formatKeyPath([...t.keyPath, ...k.keyPath])}`);
        }
      } else {
        lines.splice(lastKeyEnd + 1, 0, k.raw);
        added.push(`${formatKeyPath([...t.keyPath, ...k.keyPath])}`);
      }
    }
  }
  const text = `${lines.join('\n')}\n`;
  return { text, changed: text !== target, conflicts: [], added, replaced };
}

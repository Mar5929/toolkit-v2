// The template language (templates/TEMPLATE-LANGUAGE.md): tokens, conditional
// blocks, the generated rules span in AGENTS.md, and the text that the
// `installed` hash of AGENTS.md is taken over.
//
// renderTemplate(text, config, { file, today })   tokens and blocks; throws INVALID naming the file and line
// buildSpan(rules)                                 the lines between the span markers
// fillSpan(text, body)                             AGENTS.md with its span replaced
// hashText(target, text)                           the text hashed for `installed`
// readRules(root)                                  the project's .claude/rules/*.md as [{ name, text }]

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { parse as parseFrontmatter } from '../core/frontmatter.mjs';

export const TOKENS = Object.freeze(['project.name', 'project.key', 'project.owner', 'tracker.type', 'tracker.idPrefix', 'memory.type', 'hindsight.bank', 'today']);

export const CONDITIONS = Object.freeze({
  salesforce: (c) => Boolean(c.salesforce && c.salesforce.enabled),
  'not salesforce': (c) => !(c.salesforce && c.salesforce.enabled),
  'tracker=local': (c) => trackerType(c) === 'local',
  'tracker=notion': (c) => trackerType(c) === 'notion',
  'tracker=github': (c) => trackerType(c) === 'github',
  'tracker=jira': (c) => trackerType(c) === 'jira',
  'memory=builtin': (c) => memoryType(c) === 'builtin',
  'memory=hindsight': (c) => memoryType(c) === 'hindsight',
  'memory=notion': (c) => memoryType(c) === 'notion',
});

/** Which setting each condition and token reads (for "Setup changes"). */
export const CONDITION_KEYS = Object.freeze({
  salesforce: 'salesforce.enabled',
  'not salesforce': 'salesforce.enabled',
  'tracker=local': 'tracker.type',
  'tracker=notion': 'tracker.type',
  'tracker=github': 'tracker.type',
  'tracker=jira': 'tracker.type',
  'memory=builtin': 'memory.type',
  'memory=hindsight': 'memory.type',
  'memory=notion': 'memory.type',
});

export const SPAN_START = '<!-- toolkit:rules:start -->';
export const SPAN_END = '<!-- toolkit:rules:end -->';
export const ALWAYS_ON_INTRO = 'Always on. Claude Code loads these at session start. Codex: read each one at session start.';
export const SCOPED_INTRO = 'Path-scoped. Claude Code loads each one when it reads a matching file. Codex: open the rule before working on a matching path.';

function trackerType(c) {
  return String((c.tracker && c.tracker.type) || 'local');
}

function memoryType(c) {
  return String((c.memory && c.memory.type) || 'builtin');
}

/** The value of each token for a project. */
export function tokenValues(config, today) {
  const c = config || {};
  return {
    'project.name': String((c.project && c.project.name) || ''),
    'project.key': String((c.project && c.project.key) || ''),
    'project.owner': String((c.project && c.project.owner) || ''),
    'tracker.type': trackerType(c),
    'tracker.idPrefix': String((c.tracker && c.tracker.idPrefix) || 'WI'),
    'memory.type': memoryType(c),
    // The Hindsight bank init chose (it can be <key>-2 when <key> belongs to another project).
    'hindsight.bank': String((c.hindsight && c.hindsight.bank) || (c.project && c.project.key) || ''),
    today: String(today || ''),
  };
}

const MARKER_IF = /^<!-- if (.+?) -->$/;
const MARKER_ENDIF = /^<!-- endif -->$/;
const TOKEN_RE = /\{\{([^{}]*)\}\}/g;

function templateError(file, line, message) {
  const where = line ? `${file}, line ${line}` : file;
  return new ToolkitError(EXIT.INVALID, `The template ${where} ${message}. Nothing was written.`, {
    file,
    line: line || null,
    fix: 'Fix the template in the toolkit plugin, then run the command again.',
  });
}

/**
 * Render a template file. Steps (TEMPLATE-LANGUAGE "Order of processing"):
 * split into lines, resolve blocks and drop marker lines, replace tokens,
 * collapse runs of blank lines, end with exactly one line ending.
 */
export function renderTemplate(text, config, { file = 'template', today = '' } = {}) {
  const src = String(text);
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const lines = src.split(/\r?\n/);
  const values = tokenValues(config, today);
  const out = [];
  let open = null;
  let keep = true;
  lines.forEach((line, i) => {
    const t = line.trim();
    const mIf = MARKER_IF.exec(t);
    if (mIf) {
      if (open) throw templateError(file, i + 1, `opens a block inside the block "${open.name}" that starts on line ${open.line}`);
      const cond = CONDITIONS[mIf[1]];
      if (!cond) throw templateError(file, i + 1, `has an unknown condition "${mIf[1]}"`);
      open = { name: mIf[1], line: i + 1 };
      keep = cond(config || {});
      return;
    }
    if (MARKER_ENDIF.test(t)) {
      if (!open) throw templateError(file, i + 1, 'has an endif with no open block');
      open = null;
      keep = true;
      return;
    }
    if (!keep) return;
    const replaced = line.replace(TOKEN_RE, (all, name) => {
      if (!Object.prototype.hasOwnProperty.call(values, name)) throw templateError(file, i + 1, `has an unknown token ${all}`);
      return values[name];
    });
    out.push(replaced);
  });
  if (open) throw templateError(file, open.line, `has a block "${open.name}" that is never closed`);
  const collapsed = [];
  for (const l of out) {
    const blank = /^[ \t]*$/.test(l);
    if (blank && collapsed.length && /^[ \t]*$/.test(collapsed[collapsed.length - 1])) continue;
    collapsed.push(l);
  }
  while (collapsed.length && /^[ \t]*$/.test(collapsed[collapsed.length - 1])) collapsed.pop();
  return `${collapsed.join(eol)}${eol}`;
}

/** True when a text has at least one setup marker line (<!-- if ... --> or <!-- endif -->). */
export function hasMarkers(text) {
  return String(text).split('\n').some((l) => {
    const t = l.trim();
    return MARKER_IF.test(t) || MARKER_ENDIF.test(t);
  });
}

/**
 * Resolve the setup markers in a model file and nothing else: the marker lines
 * are dropped, a block is kept when its condition holds and dropped when it
 * does not, and every other byte stays as it is (no tokens, no blank-line
 * changes, the same line endings). The errors are those of renderTemplate.
 */
export function renderMarkers(text, config, { file = 'template' } = {}) {
  const lines = String(text).split('\n');
  const out = [];
  let open = null;
  let keep = true;
  lines.forEach((line, i) => {
    const t = line.trim();
    const mIf = MARKER_IF.exec(t);
    if (mIf) {
      if (open) throw templateError(file, i + 1, `opens a block inside the block "${open.name}" that starts on line ${open.line}`);
      const cond = CONDITIONS[mIf[1]];
      if (!cond) throw templateError(file, i + 1, `has an unknown condition "${mIf[1]}"`);
      open = { name: mIf[1], line: i + 1 };
      keep = cond(config || {});
      return;
    }
    if (MARKER_ENDIF.test(t)) {
      if (!open) throw templateError(file, i + 1, 'has an endif with no open block');
      open = null;
      keep = true;
      return;
    }
    if (keep) out.push(line);
  });
  if (open) throw templateError(file, open.line, `has a block "${open.name}" that is never closed`);
  return out.join('\n');
}

/** The settings a template reads: token names and condition settings. */
export function keysReadBy(text) {
  const keys = new Set();
  for (const m of String(text).matchAll(TOKEN_RE)) if (TOKENS.includes(m[1]) && m[1] !== 'today') keys.add(m[1]);
  for (const line of String(text).split(/\r?\n/)) {
    const m = MARKER_IF.exec(line.trim());
    if (m && CONDITION_KEYS[m[1]]) keys.add(CONDITION_KEYS[m[1]]);
  }
  return keys;
}

// ------------------------------------------------------------------ the rules span

/** Line indexes of the two markers, or null when the file does not have both in order. */
export function spanLines(text) {
  const lines = String(text).split('\n');
  const start = lines.findIndex((l) => l.trim() === SPAN_START);
  const end = lines.findIndex((l, i) => i > start && l.trim() === SPAN_END);
  if (start === -1 || end === -1) return null;
  return { lines, start, end };
}

export function hasSpan(text) {
  return spanLines(text) !== null;
}

/** The text between the markers, or null. */
export function spanBody(text) {
  const s = spanLines(text);
  if (!s) return null;
  return s.lines.slice(s.start + 1, s.end).join('\n');
}

/** Replace the lines between the markers with `body`. Text without both markers is returned unchanged. */
export function fillSpan(text, body) {
  const s = spanLines(text);
  if (!s) return text;
  const inner = body === '' ? [] : String(body).split('\n');
  return [...s.lines.slice(0, s.start + 1), ...inner, ...s.lines.slice(s.end)].join('\n');
}

/** The text the `installed` hash is taken over: AGENTS.md without the span lines (markers kept). */
export function hashText(target, text) {
  if (text === null || text === undefined) return text;
  if (target !== 'AGENTS.md') return text;
  const s = spanLines(text);
  if (!s) return text;
  return [...s.lines.slice(0, s.start + 1), ...s.lines.slice(s.end)].join('\n');
}

/** The first "# " heading of a Markdown body, or null. */
function firstHeading(body) {
  const m = /^# (.+?)\s*$/m.exec(body);
  return m ? m[1] : null;
}

/** Facts about one rule file: { name, scoped, paths, purpose }. */
export function describeRule(name, text) {
  let data = {};
  let body = String(text);
  try {
    const parsed = parseFrontmatter(text);
    data = parsed.data || {};
    body = parsed.body;
  } catch {
    // A rule whose frontmatter cannot be read is listed as always on.
  }
  // Claude Code reads `paths` as a YAML list or a comma-separated string
  // (ai-external-knowledge/claude-code/memory.md, "Rule frontmatter reference").
  let paths = null;
  if (Array.isArray(data.paths)) paths = data.paths.map(String);
  else if (typeof data.paths === 'string' && data.paths.trim()) paths = data.paths.split(',').map((p) => p.trim()).filter(Boolean);
  return {
    name,
    scoped: Boolean(paths),
    paths: paths || [],
    purpose: firstHeading(body) || name.replace(/\.md$/, ''),
  };
}

/** Plain character order, as TEMPLATE-LANGUAGE asks. */
function byName(a, b) {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/**
 * The lines between the span markers, built from rule files [{ name, text }].
 * No trailing newline.
 */
export function buildSpan(rules) {
  const described = [...rules].sort(byName).map((r) => describeRule(r.name, r.text));
  const always = described.filter((r) => !r.scoped);
  const scoped = described.filter((r) => r.scoped);
  const parts = [];
  if (always.length) {
    parts.push(ALWAYS_ON_INTRO, ...always.map((r) => `- \`.claude/rules/${r.name}\`: ${r.purpose}`));
  }
  if (scoped.length) {
    if (parts.length) parts.push('');
    parts.push(SCOPED_INTRO, '', '| Paths | Rule |', '| --- | --- |');
    for (const r of scoped) parts.push(`| ${r.paths.map((p) => `\`${p}\``).join(', ')} | \`.claude/rules/${r.name}\` |`);
  }
  return parts.join('\n');
}

/** The project's rule files: every *.md directly in .claude/rules/, as [{ name, text }]. */
export function readRules(root) {
  const dir = path.join(root, '.claude', 'rules');
  let names = [];
  try {
    names = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => (e.isFile() || e.isSymbolicLink()) && e.name.endsWith('.md')).map((e) => e.name);
  } catch {
    return [];
  }
  const out = [];
  for (const name of names) {
    try {
      out.push({ name, text: fs.readFileSync(path.join(dir, name), 'utf8') });
    } catch {
      // Unreadable: left out.
    }
  }
  return out.sort(byName);
}

/** The always-on rules of a project, as [{ name, purpose }] (for the Codex briefing). */
export function alwaysOnRules(root) {
  return readRules(root).map((r) => describeRule(r.name, r.text)).filter((r) => !r.scoped);
}

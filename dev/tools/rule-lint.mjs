// Checks that rule files (.claude/rules/*.md) follow Claude Code's guidance
// for rules. The checklist and the page each check comes from are in
// dev/research/rules-best-practices.md, Part 1 (R8 to R24); the Claude Code
// facts are in ai-external-knowledge/claude-code/memory.md ("Organize rules
// with .claude/rules/", "Path-specific rules", "Rule frontmatter reference",
// "Write effective instructions"). Mike, 2026-09-29: every rule is written to
// that guidance, and a checker enforces the format.
//
// Used only by dev/tools/check-rules.mjs. dev/ is not shipped, and nothing
// under plugins/ may import this file. It was copied from the retired
// program's lib/project/rule-lint.mjs and lib/project/render.mjs, with a
// small frontmatter reader in place of lib/core/frontmatter.mjs.
//
// parseRule(name, text)          the frontmatter, paths, heading, and instruction lines of one rule
// lintRule(rule)                 findings for one rule: frontmatter, globs, heading, instructions, size, procedures
// lintText(rule)                 warnings for one rule's wording: a line or paragraph too long, emphasis words
// namedSkills(rule)              the skills a rule names ("the `x` skill")
// lintRuleSet(rules)             findings across rules: the same instruction twice, or two that contradict
// globProblems(pattern)          why a paths pattern is invalid, or null
// expandBraces(pattern)          a pattern's brace groups expanded
// globToRegExp(pattern)          a paths pattern as a regular expression over project-relative paths
// ruleSize(rule)                 { bytes, lines, entries } of a rule file
// FOLDERS_MADE_LATER, firstFolder folders a rule's paths may name before a project has them
// readRules(root)                a folder's .claude/rules/*.md as [{ name, text }]
// buildSpan(rules)               the AGENTS.md rules list the rule files give
// hasSpan(text), spanBody(text)  whether AGENTS.md has the rules list markers, and the text between them
//
// A finding: { rule, line, check, severity: 'error' | 'warning', message, fix }.
// dev/tools/check-rules.mjs fails on any error.

import fs from 'node:fs';
import path from 'node:path';

/**
 * The frontmatter of a Markdown file, limited to the YAML a rule uses:
 * `key: value` (plain, "double", or 'single' quoted), `key: [a, "b"]`, and
 * `key:` followed by `  - item` lines. Blank lines and # comments are
 * skipped. Any other line throws, so the rule is reported as not parsing.
 * Returns { data, body }.
 */
function parseFrontmatter(text) {
  const lines = String(text).split('\n');
  if (!/^---[ \t]*$/.test(lines[0] || '')) return { data: {}, body: String(text) };
  const close = lines.findIndex((l, i) => i > 0 && /^(---|\.\.\.)[ \t]*$/.test(l));
  if (close === -1) return { data: {}, body: String(text) };
  const scalar = (raw) => {
    const v = raw.trim();
    if (/^"(?:[^"\\]|\\.)*"$/.test(v)) return JSON.parse(v);
    if (/^'(?:[^']|'')*'$/.test(v)) return v.slice(1, -1).replace(/''/g, "'");
    if (/^["']/.test(v)) throw new Error(`unclosed quote in ${v}`);
    return v === '' || v === '~' || v === 'null' ? null : v;
  };
  const data = {};
  let listKey = null;
  for (let i = 1; i < close; i += 1) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const item = /^\s+-\s+(.*)$/.exec(line) || /^-\s+(.*)$/.exec(line);
    if (item && listKey) {
      data[listKey].push(scalar(item[1]));
      continue;
    }
    const kv = /^([A-Za-z_][\w-]*):(?:\s+(.*))?$/.exec(line);
    if (!kv) throw new Error(`line ${i + 1} is not "key: value" or "  - item": ${line.trim()}`);
    const value = (kv[2] || '').trim();
    listKey = null;
    if (value === '') {
      data[kv[1]] = [];
      listKey = kv[1];
    } else if (value.startsWith('[')) {
      if (!value.endsWith(']')) throw new Error(`unclosed "[" on line ${i + 1}`);
      const inner = value.slice(1, -1).trim();
      data[kv[1]] = inner ? (inner.match(/"(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^,]+/g) || []).map(scalar) : [];
    } else data[kv[1]] = scalar(value);
  }
  return { data, body: lines.slice(close + 1).join('\n') };
}

/**
 * The numbers the checks use.
 * - alwaysOnBytes: an always-on rule is sent with every request, so it stays
 *   under 4 KB (dev/research/rules-best-practices.md, 2.5 finding 2, for
 *   owner-preferences.md; the same number for every always-on rule).
 *   Proposed, not approved: dev/model-changes.md, "Rules best practices: needs
 *   your yes", item 11. Until Mike answers, a rule over it is a warning, never
 *   a failure, so no agent cuts his words to pass a check.
 * - alwaysOnLines: "target under 200 lines per CLAUDE.md file"
 *   (claude-code/memory.md, "Write effective instructions", Size). Claude
 *   Code's own number, so a rule over it is an error.
 * - ownerEntries: instruction lines in owner-preferences.md (the guide, 2.5
 *   finding 2). Proposed with alwaysOnBytes (item 11), so also a warning.
 * - textChars: one list item or paragraph at most this long, the same cap
 *   the retired `toolkit rule add` put on one instruction (the guide, 2.8).
 * - paragraphLines: a paragraph wrapped over more lines than this is hard to
 *   scan (the guide, 2.8; memory.md "Structure": "Use markdown headers and
 *   bullets").
 * - procedureSteps: a numbered list this long is a procedure, which belongs in
 *   a skill (memory.md, "When to add to CLAUDE.md": "If an entry is a
 *   multi-step procedure ... move it to a skill").
 * - braceBudget: "a rule's whole paths list shares one budget of 1,000
 *   expanded patterns" (memory.md, "Path-specific rules").
 */
export const RULE_LIMITS = Object.freeze({
  alwaysOnBytes: 4096,
  alwaysOnLines: 200,
  ownerEntries: 50,
  textChars: 400,
  paragraphLines: 3,
  procedureSteps: 5,
  braceBudget: 1000,
});

/**
 * Folders the model does not hold but a project has later, so a rule's
 * `paths` may name them before they exist. Each entry says why.
 */
export const FOLDERS_MADE_LATER = Object.freeze({
  'force-app': 'Salesforce source; sfdx-project.json names it as the package directory, and a retrieve or `sf project generate` creates it',
  engagement: 'the client-work folder of older Salesforce projects, which keep it in place of delivery/ (project-file-locations.md)',
});

/** The first folder a paths pattern names before any wildcard, or null. */
export function firstFolder(pattern) {
  const first = String(pattern).split('/')[0];
  return /[*?[{]/.test(first) ? null : first;
}

const FENCE_RE = /^\s{0,3}(`{3,}|~{3,})/;
const HEADING_RE = /^(#{1,6})[ \t]+(.*?\S)[ \t]*#*[ \t]*$/;
const LIST_RE = /^(\s*)(?:([-*+])|(\d+)[.)])[ \t]+(.*\S)\s*$/;
const TABLE_RE = /^\s*\|/;
const OWNER_TRAILER_RE = /\s*\((\d{4}-\d{2}-\d{2}), [^()]*\)\s*$/;

/** Words that make a sentence an instruction when it is not a list item. */
const DIRECTIVE_RE = /\b(never|always|must|do not|don't|only|should|need to|needs to|required|requires|instead)\b/i;
const IMPERATIVE_START = new Set([
  'add', 'answer', 'apply', 'ask', 'bring', 'call', 'change', 'check', 'cite', 'commit', 'compare', 'confirm', 'create', 'cut',
  'decide', 'delete', 'deploy', 'edit', 'end', 'fetch', 'fill', 'find', 'follow', 'give', 'hand', 'handle', 'keep', 'land', 'lead',
  'leave', 'list', 'mark', 'move', 'name', 'offer', 'open', 'prepare', 'publish', 'put', 'read', 'record', 'remove', 'rename', 'reply',
  'report', 'review', 'run', 'save', 'say', 'search', 'send', 'set', 'show', 'skip', 'stage', 'start', 'state', 'stop', 'take', 'tell',
  'update', 'use', 'verify', 'wait', 'write', 'when', 'before', 'after', 'if',
]);
/** Words that make an instruction vague when nothing concrete is named (memory.md "Specificity": "Format code properly"). */
const VAGUE_RE = /\b(properly|correctly|appropriately|appropriate|as needed|if needed|when needed|where needed|when necessary|if necessary|be careful|carefully|good|nice|clean|best practices?|as usual|reasonable|sensible|etc)\b/i;
/** Something concrete a reader can check: code, a quote, a number, or a path. */
const ANCHOR_RE = /`[^`]+`|"[^"]+"|“[^”]+”|\d|[\w-]+\/[\w./*-]*|\b[\w-]+\.(?:md|json|js|mjs|cjs|py|ts|xml|csv|toml|yml|yaml)\b/;

const STOP = new Set(['a', 'an', 'the', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'it', 'its', 'is', 'are', 'be', 'with', 'by', 'at', 'as',
  'this', 'that', 'these', 'those', 'from', 'you', 'your', 'every', 'each', 'any', 'all', 'one', 'there', 'then', 'so', 'than', 'into', 'their', 'his', 'her']);
const POLARITY = new Set(['never', 'always', 'do', 'not', "don't", 'dont', 'must', 'avoid', 'no']);
const NEGATIVE_RE = /\b(never|do not|don't|dont|must not|avoid)\b/;

// ------------------------------------------------------------------ globs

/**
 * A paths pattern with its brace groups expanded: "src/*.{ts,tsx}" is two
 * patterns. Nested groups expand too. A group with no comma stays as it is.
 */
export function expandBraces(pattern) {
  const s = String(pattern);
  let depth = 0;
  let open = -1;
  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];
    if (c === '\\') { i += 1; continue; }
    if (c === '{') {
      if (depth === 0) open = i;
      depth += 1;
    } else if (c === '}' && depth > 0) {
      depth -= 1;
      if (depth === 0) {
        const inner = s.slice(open + 1, i);
        const parts = splitTop(inner);
        if (parts.length < 2) continue;
        const head = s.slice(0, open);
        const tail = s.slice(i + 1);
        const out = [];
        for (const p of parts) for (const e of expandBraces(`${head}${p}${tail}`)) out.push(e);
        return out;
      }
    }
  }
  return [s];
}

function splitTop(inner) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (let i = 0; i < inner.length; i += 1) {
    const c = inner[i];
    if (c === '\\') { cur += c + (inner[i + 1] || ''); i += 1; continue; }
    if (c === '{') depth += 1;
    if (c === '}') depth -= 1;
    if (c === ',' && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += c;
  }
  parts.push(cur);
  return parts;
}

/** Why a paths pattern cannot work, or null. */
export function globProblems(pattern) {
  const p = String(pattern ?? '');
  if (!p.trim()) return 'is empty';
  if (p !== p.trim()) return 'has spaces at its start or end';
  if (p.startsWith('/') || p.startsWith('./')) return 'starts with "/" or "./"; patterns are relative to the project root, so write it without that start';
  if (p.includes('\\') && !/\\[[\]{}*?]/.test(p)) return 'uses a backslash; paths use "/"';
  // A "[" that cannot be read as a bracket expression makes the pattern match nothing (memory.md, "Path-specific rules").
  for (let i = 0; i < p.length; i += 1) {
    if (p[i] === '\\') { i += 1; continue; }
    if (p[i] === '[') {
      const close = p.indexOf(']', i + 2);
      if (close === -1 || p.slice(i + 1, close).includes('/')) return 'has a "[" with no closing "]", so it matches nothing; write a literal "[" as "\\["';
      i = close;
    }
  }
  let depth = 0;
  for (let i = 0; i < p.length; i += 1) {
    if (p[i] === '\\') { i += 1; continue; }
    if (p[i] === '{') depth += 1;
    if (p[i] === '}') depth -= 1;
    if (depth < 0) return 'has a "}" with no "{" before it';
  }
  if (depth !== 0) return 'has a "{" with no closing "}"';
  return null;
}

/**
 * A paths pattern as a regular expression over project-relative paths with
 * "/": "**" is any number of whole folders (none included), "*" any text
 * inside one name, "?" one character, "[...]" one character of a set.
 * Brace groups must be expanded first (expandBraces).
 */
export function globToRegExp(pattern) {
  const parts = String(pattern).split('/');
  let re = '';
  parts.forEach((part, i) => {
    const last = i === parts.length - 1;
    if (part === '**') {
      re += last ? '.*' : '(?:[^/]+/)*';
      return;
    }
    let seg = '';
    for (let j = 0; j < part.length; j += 1) {
      const c = part[j];
      if (c === '\\' && j + 1 < part.length) { seg += escapeRe(part[j + 1]); j += 1; continue; }
      if (c === '*') { seg += '[^/]*'; continue; }
      if (c === '?') { seg += '[^/]'; continue; }
      if (c === '[') {
        const close = part.indexOf(']', j + 2);
        if (close !== -1) {
          let body = part.slice(j + 1, close);
          if (body.startsWith('!')) body = `^${body.slice(1)}`;
          seg += `[${body.replace(/\\/g, '\\\\')}]`;
          j = close;
          continue;
        }
      }
      seg += escapeRe(c);
    }
    re += seg;
    if (!last) re += '/';
  });
  return new RegExp(`^${re}$`);
}

function escapeRe(c) {
  return c.replace(/[.+^${}()|[\]\\*?]/g, '\\$&');
}

/** True when a paths pattern (with braces) matches a project-relative path. */
export function globMatches(pattern, rel) {
  return expandBraces(pattern).some((p) => globToRegExp(p).test(rel));
}

// ------------------------------------------------------------------ one rule

/** The paths a rule's frontmatter data gives: an array, or null when it has no paths field. Claude Code also accepts a comma-separated string. */
export function pathsOf(data) {
  if (!data || !Object.prototype.hasOwnProperty.call(data, 'paths')) return null;
  const v = data.paths;
  if (Array.isArray(v)) return v.map((x) => String(x ?? ''));
  if (typeof v === 'string') return v.split(',').map((x) => x.trim()).filter(Boolean);
  return [];
}

/**
 * The parts of one rule file:
 * { name, text, frontmatter: { present, error, data, lines }, paths, pathsForm, scoped,
 *   heading, headingLine, body lines [{ n, text }], instructions [{ line, text, kind }], numberedRuns [{ line, count }] }
 */
export function parseRule(name, text) {
  const src = String(text ?? '').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const all = src.split('\n');
  const fm = { present: false, error: null, data: {}, lines: 0 };
  let bodyStart = 0;
  if (/^---[ \t]*$/.test(all[0] || '')) {
    const close = all.findIndex((l, i) => i > 0 && /^(---|\.\.\.)[ \t]*$/.test(l));
    if (close !== -1) {
      fm.present = true;
      fm.lines = close + 1;
      bodyStart = close + 1;
      try {
        fm.data = parseFrontmatter(src).data || {};
      } catch (err) {
        fm.error = String(err && err.message ? err.message : err);
        fm.data = {};
      }
    }
  }
  const paths = fm.error ? null : pathsOf(fm.data);
  const pathsForm = !fm.present || fm.error || !Object.prototype.hasOwnProperty.call(fm.data, 'paths') ? null : Array.isArray(fm.data.paths) ? 'list' : typeof fm.data.paths === 'string' ? 'string' : 'other';
  const body = all.slice(bodyStart).map((t, i) => ({ n: bodyStart + i + 1, text: t }));

  let heading = null;
  let headingLine = null;
  const firstText = body.find((l) => l.text.trim() !== '');
  if (firstText) {
    const h = HEADING_RE.exec(firstText.text);
    if (h && h[1] === '#') {
      heading = h[2];
      headingLine = firstText.n;
    }
  }

  const instructions = [];
  const numberedRuns = [];
  let fence = false;
  let comment = false;
  let para = [];
  let item = null;
  let run = null;
  const flushPara = () => {
    if (!para.length) return;
    const joined = para.map((l) => l.text.trim()).join(' ');
    for (const sentence of splitSentences(joined)) {
      if (isDirective(sentence)) instructions.push({ line: para[0].n, text: sentence, kind: 'sentence' });
    }
    para = [];
  };
  const flushItem = () => {
    if (!item) return;
    instructions.push({ line: item.n, text: item.text, kind: item.numbered ? 'step' : 'item' });
    item = null;
  };
  const endRun = () => {
    if (run && run.count >= 2) numberedRuns.push(run);
    run = null;
  };
  for (const l of body) {
    const t = l.text;
    if (comment) {
      if (t.includes('-->')) comment = false;
      continue;
    }
    if (FENCE_RE.test(t)) {
      flushPara();
      flushItem();
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (/^\s*<!--/.test(t)) {
      flushPara();
      flushItem();
      if (!t.includes('-->')) comment = true;
      continue;
    }
    if (!t.trim()) {
      flushPara();
      flushItem();
      continue;
    }
    if (HEADING_RE.test(t)) {
      flushPara();
      flushItem();
      endRun();
      continue;
    }
    if (TABLE_RE.test(t)) {
      flushPara();
      flushItem();
      continue;
    }
    const li = LIST_RE.exec(t);
    if (li) {
      flushPara();
      flushItem();
      const numbered = Boolean(li[3]);
      item = { n: l.n, text: li[4], numbered };
      if (numbered && !li[1]) {
        if (run) run.count += 1;
        else run = { line: l.n, count: 1 };
      } else if (!li[1]) {
        endRun();
      }
      continue;
    }
    if (item && /^\s+\S/.test(t)) {
      item.text += ` ${t.trim()}`;
      continue;
    }
    flushItem();
    endRun();
    para.push(l);
  }
  flushPara();
  flushItem();
  endRun();

  return {
    name,
    text: src,
    frontmatter: fm,
    paths,
    pathsForm,
    scoped: Array.isArray(paths) && paths.length > 0,
    heading,
    headingLine,
    body,
    instructions,
    numberedRuns,
  };
}

function splitSentences(text) {
  return String(text).split(/(?<=[.!?])\s+(?=[A-Z`"(“])/).map((s) => s.trim()).filter(Boolean);
}

function isDirective(sentence) {
  const s = sentence.replace(/^[*_`"“(]+/, '');
  if (DIRECTIVE_RE.test(s)) return true;
  const first = (s.split(/[\s,:;]+/)[0] || '').toLowerCase();
  return IMPERATIVE_START.has(first);
}

/** True when an instruction names nothing concrete and uses a vague word ("properly", "as needed", "be careful"). */
export function isVague(text) {
  const t = String(text).replace(OWNER_TRAILER_RE, '');
  return VAGUE_RE.test(t) && !ANCHOR_RE.test(t);
}

/** { bytes, lines, entries }: the file size, its line count, and its list-item instructions. */
export function ruleSize(rule) {
  const bytes = Buffer.byteLength(rule.text, 'utf8');
  const lines = rule.text.split('\n').length - (rule.text.endsWith('\n') ? 1 : 0);
  const entries = rule.instructions.filter((i) => i.kind !== 'sentence').length;
  return { bytes, lines, entries };
}

function f(rule, line, check, severity, message, fix) {
  return { rule: rule.name, line: line || null, check, severity, message, fix: fix || null };
}

/**
 * Findings for one rule. opts: { ownerFile: true for owner-preferences.md
 * (its instruction count is checked), limits }.
 */
export function lintRule(rule, opts = {}) {
  const limits = { ...RULE_LIMITS, ...(opts.limits || {}) };
  const out = [];
  const fm = rule.frontmatter;
  // Frontmatter (R13): paths is the only field Claude Code reads.
  if (fm.present) {
    if (fm.error) {
      out.push(f(rule, 1, 'frontmatter', 'error', `The frontmatter does not parse (${fm.error}). Claude Code then ignores it and loads the rule in every session, as if it had no paths.`, 'Fix the YAML: a "paths:" line, then one "  - \\"pattern\\"" line per pattern.'));
    } else {
      const keys = Object.keys(fm.data);
      const other = keys.filter((k) => k !== 'paths');
      if (other.length) out.push(f(rule, 1, 'frontmatter', 'error', `The frontmatter has ${other.map((k) => `"${k}"`).join(', ')}. Claude Code reads only "paths" from a rule and ignores every other field.`, 'Remove the other fields. A rule that applies to every file has no frontmatter at all.'));
      if (!keys.includes('paths')) {
        out.push(f(rule, 1, 'frontmatter', 'error', 'The frontmatter has no "paths" field, so it does nothing.', 'Remove the frontmatter, or add "paths:" with the patterns the rule applies to.'));
      } else if (rule.pathsForm === 'other' || !rule.paths || !rule.paths.length) {
        out.push(f(rule, 1, 'frontmatter', 'error', '"paths" is empty or is not a list of patterns.', 'Give one pattern per list line under "paths:", or remove the frontmatter when the rule applies to every file.'));
      } else if (rule.pathsForm === 'string') {
        out.push(f(rule, 1, 'frontmatter', 'warning', '"paths" is one comma-separated string. Claude Code accepts it, but a list is clearer and the same form as every other rule.', 'Write "paths:" and one "  - \\"pattern\\"" line per pattern.'));
      }
    }
  }
  // Globs (R13): valid patterns, within the brace budget.
  if (rule.paths && rule.paths.length) {
    let expanded = 0;
    for (const p of rule.paths) {
      const why = globProblems(p);
      if (why) out.push(f(rule, 1, 'glob', 'error', `The paths pattern "${p}" ${why}.`, null));
      else expanded += /\{/.test(p) ? expandBraces(p).length : 0;
    }
    if (expanded > limits.braceBudget) out.push(f(rule, 1, 'glob', 'error', `The brace groups in "paths" expand to ${expanded} patterns. Claude Code allows ${limits.braceBudget}; past that a pattern is used unexpanded and matches no file.`, 'Use fewer brace groups, or split the rule.'));
  }
  // Heading (R10).
  if (!rule.heading) {
    out.push(f(rule, rule.body.length ? rule.body[0].n : 1, 'heading', 'error', 'The rule does not start with a "# " heading that names its topic. The AGENTS.md rules list shows that heading to Codex.', 'Put a "# <topic in plain words>" line first (after any frontmatter).'));
  }
  // Instructions (R1, R19).
  if (!rule.instructions.length) {
    out.push(f(rule, rule.headingLine, 'instruction', 'error', 'The rule has no instruction: no list item and no sentence that tells the agent what to do.', 'Write each instruction as one bullet, in the imperative, naming the command, file, or skill.'));
  } else if (rule.instructions.every((i) => isVague(i.text))) {
    out.push(f(rule, rule.instructions[0].line, 'instruction', 'error', 'Every instruction in the rule is vague (for example "properly", "as needed", "be careful") and names nothing that can be checked.', 'Say exactly what to do: "Run `npm test` before committing", not "Test your changes".'));
  }
  // Procedures (R2).
  for (const r of rule.numberedRuns) {
    if (r.count >= limits.procedureSteps) {
      out.push(f(rule, r.line, 'procedure', 'error', `The rule holds a numbered procedure of ${r.count} steps. A rule loads in every session; a multi-step procedure belongs in a skill, which loads only when it is needed.`, 'Move the steps into a skill (a toolkit skill or a project skill in .claude/skills/) and leave one line in the rule that says when to open it.'));
    }
  }
  // Size (R17): an always-on rule is sent with every request. The line limit
  // is Claude Code's (an error); the byte and instruction limits are proposed
  // numbers (RULE_LIMITS), so they are warnings.
  if (!rule.scoped) {
    const size = ruleSize(rule);
    const shorter = 'Cut what the agent does without being told, move a procedure to a skill, or move an instruction about certain files to a rule with paths. A change to the owner\'s own words needs his yes.';
    if (size.lines > limits.alwaysOnLines) {
      out.push(f(rule, null, 'size', 'error', `The rule loads in every session and is ${size.lines} lines, over Claude Code's target of ${limits.alwaysOnLines}.`, shorter));
    }
    if (size.bytes > limits.alwaysOnBytes) {
      out.push(f(rule, null, 'size', 'warning', `The rule loads in every session and is ${size.bytes} bytes, over the limit of ${limits.alwaysOnBytes}.`, shorter));
    }
    if (opts.ownerFile && size.entries > limits.ownerEntries) {
      out.push(f(rule, null, 'size', 'warning', `The rule has ${size.entries} instructions, over the limit of ${limits.ownerEntries}.`, 'Merge instructions that say the same thing, and move a procedure to a skill (managing-project-memory proposes these when it tidies memory). A change to the owner\'s own words needs his yes.'));
    }
  }
  return out;
}

const EMPHASIS_RE = /\b(IMPORTANT|CRITICAL|YOU MUST|MUST|NEVER|ALWAYS)\b|\*\*[^*\s][^*]*\*\*|__[^_\s][^_]*__/;

/**
 * Warnings about one rule's wording (dev/research/rules-best-practices.md,
 * 2.8): a list item or paragraph over RULE_LIMITS.textChars characters, a
 * paragraph wrapped over more than RULE_LIMITS.paragraphLines lines, and
 * emphasis ("IMPORTANT", "NEVER" in capitals, bold), which R22 leaves out:
 * a specific instruction does not need it. Code blocks, code spans, tables,
 * comments, and frontmatter are not checked. Every finding is a warning.
 */
export function lintText(rule, opts = {}) {
  const limits = { ...RULE_LIMITS, ...(opts.limits || {}) };
  const out = [];
  let fence = false;
  let comment = false;
  let block = null;
  const flush = () => {
    if (!block) return;
    const text = block.lines.map((l) => l.trim()).join(' ');
    const what = block.item ? 'list item' : 'paragraph';
    if (text.length > limits.textChars) {
      out.push(f(rule, block.n, 'length', 'warning', `A ${what} is ${text.length} characters, over ${limits.textChars}. A long ${what} holds several instructions, and the reader may miss one.`, block.item ? 'Split it: one instruction per bullet, with its example or reason as its own sentence or bullet.' : 'Split it into bullets, one instruction each.'));
    } else if (!block.item && block.lines.length > limits.paragraphLines) {
      out.push(f(rule, block.n, 'length', 'warning', `A paragraph runs ${block.lines.length} lines, over ${limits.paragraphLines}.`, 'Split it into bullets, one instruction each.'));
    }
    block = null;
  };
  for (const l of rule.body) {
    const t = l.text;
    if (comment) {
      if (t.includes('-->')) comment = false;
      continue;
    }
    if (FENCE_RE.test(t)) {
      flush();
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (/^\s*<!--/.test(t)) {
      flush();
      if (!t.includes('-->')) comment = true;
      continue;
    }
    if (!t.trim() || HEADING_RE.test(t) || TABLE_RE.test(t)) {
      flush();
      continue;
    }
    const plain = t.replace(/`[^`]*`/g, '');
    const emphasis = EMPHASIS_RE.exec(plain);
    if (emphasis) {
      out.push(f(rule, l.n, 'emphasis', 'warning', `The rule uses emphasis (${emphasis[0]}). A specific instruction needs none, and emphasis in every rule stops meaning anything.`, 'Write the instruction in plain words. Keep a capital word only when it is a name, such as `README.md` or UAT.'));
    }
    if (LIST_RE.test(t)) {
      flush();
      block = { n: l.n, item: true, lines: [t.replace(LIST_RE, '$4')] };
      continue;
    }
    if (block && (block.item ? /^\s+\S/.test(t) : true)) {
      block.lines.push(t);
      continue;
    }
    flush();
    block = { n: l.n, item: false, lines: [t] };
  }
  flush();
  return out;
}

/** The skills a rule names, as "the `name` skill" or "`name` skill": [{ name, line }]. */
export function namedSkills(rule) {
  const out = [];
  for (const l of rule.body) {
    for (const m of l.text.matchAll(/`([a-z0-9][a-z0-9:-]*)`\s+skills?\b/g)) out.push({ name: m[1], line: l.n });
  }
  return out;
}

// ------------------------------------------------------------------ across rules

/** The words of an instruction that carry its meaning, without its polarity words and its date and source. */
export function instructionWords(text) {
  const t = String(text).replace(OWNER_TRAILER_RE, '').toLowerCase()
    .replace(/[`*_"“”‘’]/g, ' ').replace(/[^a-z0-9'./-]+/g, ' ').replace(/[./-]+(\s|$)/g, ' ');
  return t.split(/\s+/).filter((w) => w && !STOP.has(w));
}

function normalized(text) {
  return instructionWords(text).join(' ');
}

function negative(text) {
  return NEGATIVE_RE.test(String(text).toLowerCase().replace(/[`*_]/g, ''));
}

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  let both = 0;
  for (const w of A) if (B.has(w)) both += 1;
  const union = A.size + B.size - both;
  return union ? both / union : 0;
}

const NEGATIVE_AT_RE = /\b(never|do not|don't|dont|must not|avoid)\b/gi;
const JOIN_WORDS = new Set(['or', 'and', 'nor', 'a', 'an', 'the']);
const TURN_WORDS = /\b(without|unless|except|until|instead|before|after|if|when)\b/i;

/**
 * The commands a line forbids: a code span that comes right after never, do
 * not, or avoid, with at most two words between them ("Never `git add -A`",
 * "Do not run `git push --force`", and each span of "Never `a b`, `c d`, or
 * `e f`"). A span after "without", "unless", or a later clause is not
 * forbidden ("Never deploy without a clean `permsets.py preflight`"). Only a
 * command with words ("git add -A") or a flag ("--no-verify") counts; one
 * word (`main`) is too common to compare.
 */
function forbiddenCode(text) {
  const out = [];
  for (const sentence of splitSentences(text)) {
    const spans = [...sentence.matchAll(/`([^`]+)`/g)];
    for (const neg of sentence.matchAll(NEGATIVE_AT_RE)) {
      const from = neg.index + neg[0].length;
      for (const m of spans) {
        if (m.index < from) continue;
        const code = m[1].trim();
        if (!(/\s/.test(code) || (/^-/.test(code) && code.length >= 3))) continue;
        const between = sentence.slice(from, m.index).replace(/`[^`]*`/g, ' ');
        if (TURN_WORDS.test(between)) break;
        const words = between.replace(/[^A-Za-z']+/g, ' ').trim().split(/\s+/).filter((w) => w && !JOIN_WORDS.has(w.toLowerCase()));
        if (words.length <= 2 && !out.includes(code)) out.push(code);
      }
    }
  }
  return out;
}

/** True when a line names a command, with or without backticks, as whole words (case counts: -A is not -a). */
function mentions(text, code) {
  const t = String(text).replace(/`/g, '');
  for (let i = t.indexOf(code); i !== -1; i = t.indexOf(code, i + 1)) {
    const before = i === 0 ? '' : t[i - 1];
    const after = t[i + code.length] || '';
    if (!/[\w-]/.test(before) && !/\w/.test(after)) return true;
  }
  return false;
}

/**
 * Findings across a set of parsed rules (R23, R24): the same instruction in
 * two places, or two instructions about the same thing where one says do and
 * the other says never. Within one file only the owner's rule files are
 * compared line by line (an "Always X" in one section and a "Never X" in
 * another); the model's own rules are compared file against file.
 *
 * Two kinds of contradiction:
 * - an error: nearly the same words, one with never and one without;
 * - a warning: one line forbids a command in a code span ("Never `git add -A`")
 *   and another names that command with no never ("Stage every file with git
 *   add -A"). The wording can differ, so this is a question for the reader,
 *   not a certainty.
 *
 * opts.withinFile: rule names whose lines are also compared with each other.
 * opts.listItemsOnly: rule names compared by their list items only, not by
 *   sentences in paragraphs. The owner-preferences files: their purpose line
 *   under the title is the toolkit's fixed text, nearly the same in the
 *   project and machine files, and nobody can change it.
 */
export function lintRuleSet(rules, opts = {}) {
  const within = new Set(opts.withinFile || []);
  const itemsOnly = new Set(opts.listItemsOnly || []);
  const items = [];
  for (const r of rules) {
    for (const i of r.instructions) {
      if (itemsOnly.has(r.name) && i.kind === 'sentence') continue;
      const words = instructionWords(i.text);
      if (words.length < 3) continue;
      const core = words.filter((w) => !POLARITY.has(w));
      items.push({ rule: r.name, line: i.line, text: i.text, norm: normalized(i.text), core, neg: negative(i.text), forbidden: forbiddenCode(i.text) });
    }
  }
  const out = [];
  for (let a = 0; a < items.length; a += 1) {
    for (let b = a + 1; b < items.length; b += 1) {
      const x = items[a];
      const y = items[b];
      if (x.rule === y.rule && !within.has(x.rule)) continue;
      const where = x.rule === y.rule ? `${x.rule} line ${x.line} and line ${y.line}` : `${x.rule} line ${x.line} and ${y.rule} line ${y.line}`;
      const sim = jaccard(x.core, y.core);
      const small = Math.min(new Set(x.core).size, new Set(y.core).size);
      if (x.neg !== y.neg && small >= 3 && sim >= 0.75) {
        out.push({ rule: y.rule, line: y.line, check: 'conflict', severity: 'error', message: `${where} may contradict each other: "${clip(x.text)}" and "${clip(y.text)}". When two rules contradict, Claude may follow either one.`, fix: 'Keep one instruction and remove or reword the other; ask the owner which one holds when it is his instruction.', other: { rule: x.rule, line: x.line } });
      } else if (x.neg === y.neg && (x.norm === y.norm || (small >= 5 && sim >= 0.85))) {
        out.push({ rule: y.rule, line: y.line, check: 'duplicate', severity: 'error', message: `${where} say the same thing: "${clip(y.text)}". A second copy costs context in every session, and the two drift apart when one is changed.`, fix: 'State the instruction in one place and remove the other copy.', other: { rule: x.rule, line: x.line } });
      } else if (x.neg !== y.neg) {
        const [no, yes] = x.neg ? [x, y] : [y, x];
        const code = no.forbidden.find((c) => mentions(yes.text, c));
        if (code) {
          out.push({ rule: y.rule, line: y.line, check: 'conflict', severity: 'warning', message: `${where} may contradict each other: "${clip(no.text)}" forbids \`${code}\`, and "${clip(yes.text)}" names it without a "never" or "do not". When two rules contradict, Claude may follow either one.`, fix: 'Read both lines. If one allows what the other forbids, keep one and remove or reword the other; ask the owner which one holds when it is his instruction.', other: { rule: x.rule, line: x.line } });
        }
      }
    }
  }
  return out;
}

/** An instruction for a message: one line, without an owner line's date and source, at most 120 characters. */
function clip(s) {
  const t = String(s).replace(OWNER_TRAILER_RE, '').replace(/\s+/g, ' ').trim();
  return t.length > 120 ? `${t.slice(0, 117)}...` : t;
}

// ------------------------------------------------------------------ the AGENTS.md rules list
// Copied from the retired program's lib/project/render.mjs. The project-setup
// skill writes the same list by hand (references/setup-copy.md).

export const SPAN_START = '<!-- toolkit:rules:start -->';
export const SPAN_END = '<!-- toolkit:rules:end -->';
const ALWAYS_ON_INTRO = 'Always on. Claude Code loads these at session start. Codex: read each one at session start.';
const SCOPED_INTRO = 'Path-scoped. Claude Code loads each one when it reads a matching file. Codex: open the rule before working on a matching path.';

/** Line indexes of the two markers, or null when the file does not have both in order. */
function spanLines(text) {
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

/** Facts about one rule file: { name, scoped, paths, purpose }. */
function describeRule(name, text) {
  let data = {};
  let body = String(text);
  try {
    const parsed = parseFrontmatter(text);
    data = parsed.data || {};
    body = parsed.body;
  } catch {
    // A rule whose frontmatter cannot be read is listed as always on.
  }
  const paths = pathsOf(data);
  const m = /^# (.+?)\s*$/m.exec(body);
  return {
    name,
    scoped: Boolean(paths && paths.length),
    paths: paths || [],
    purpose: m ? m[1] : name.replace(/\.md$/, ''),
  };
}

/** Plain character order. */
function byName(a, b) {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/** The lines between the span markers, built from rule files [{ name, text }]. No trailing newline. */
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

/** A folder's rule files: every *.md directly in .claude/rules/, as [{ name, text }]. */
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

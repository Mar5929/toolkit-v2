#!/usr/bin/env node
// check-skills.mjs: checks every skill and agent file in toolkit-v2.
//
// Usage: node dev/tools/check-skills.mjs [--json] [--quiet] [--grammar]
//   --quiet    hide files with no findings
//   --grammar  print the commands and flags read from ARCHITECTURE.md section 5, then stop
//
// For every SKILL.md in plugins/*/skills/ (and the Salesforce scaffold's
// project-local skills under plugins/*/scaffold/*/skills/):
//   - frontmatter has only `name` and `description`, and parses as YAML
//     scalars Claude Code and Codex both read;
//   - `name` equals the folder name;
//   - `description` is at most 300 characters and identical to the
//     description in dev/SKILL-INDEX.md section 1, and the skill sits in the
//     plugin that table names;
//   - no syntax Codex leaves as literal text: `when_to_use`, !`command`,
//     ```! blocks, $ARGUMENTS, $0-$9, ${CLAUDE_*};
//   - the numbered steps end within the first 40 lines;
//   - the voice line from plugins/work/shared/recording-owner-answers.md is present
//     (required in the work, memory, and toolkit plugins; a warning elsewhere);
//   - work-plugin skills that brief agents carry the Codex agent fallback line
//     from plugins/work/shared/helpers.md;
//   - every `toolkit ...` command stands on its own line. A code span that
//     holds only a command's name (for example `toolkit decision add`) for a
//     command that needs arguments is a mention in a sentence, not a command
//     to run, so it may sit inside a sentence.
// For every Markdown file in skill folders, plugins/*/references/, and
// plugins/*/agents/: every `toolkit ...` command (inline code or a code-block
// line) uses a command and flags listed in dev/ARCHITECTURE.md section 5.
// When section 5 lacks a command or flag that the toolkit CLI's own help
// lists (plugins/toolkit/lib/commands/*.mjs), the failure says so: section 5
// needs the line added, and the command itself works.
// A prose line that starts with `toolkit <command>` outside backticks is a
// warning: the check reads commands only from code, so it cannot check that
// line. A command written in the middle of a sentence without backticks is
// not found at all.
// For every agent file in plugins/*/agents/: name equals the file name,
// `model: opus`, and the tools match dev/SKILL-INDEX.md section 4.
//
// For every skill folder (plugin skills and the scaffold's project skills),
// the file rules from dev/research/skill-writing-guide.md Part 5:
//   - links: every file a SKILL.md or a reference names (a Markdown link
//     outside code, or a path that starts with references/, assets/, or
//     scripts/) exists in the skill folder, and no link or path leaves the
//     skill folder with ../ (R1, R4);
//   - one level deep: SKILL.md itself names every file in references/,
//     assets/, and scripts/. A file that only another reference names is two
//     levels deep; a file nothing names is never opened (R1, R6);
//   - contents: a reference over 100 lines (not counting the generated-file
//     header line) has a "## Contents" heading as its first section (R3);
//   - generated copies: every copy listed in dev/tools/shared-references/
//     exists and equals its source, and no unlisted copy is left. This calls
//     syncSkillReferences() from dev/tools/sync-skill-references.mjs, so both
//     tools apply the same rules (B12). A finding on a generated copy names
//     the source to edit.
// Toolkit commands in a generated copy are checked once, in its source under
// plugins/*/shared/ or plugins/*/agents/; the copy equals the source.
//
// Exit code 0 when there are no failures, 1 when there is at least one.
// Node 20+, no dependencies.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { syncSkillReferences, headerSource } from './sync-skill-references.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ARGS = new Set(process.argv.slice(2));
const JSON_OUT = ARGS.has('--json');
const QUIET = ARGS.has('--quiet');
const GRAMMAR_ONLY = ARGS.has('--grammar');

const REQUIRED_VOICE_PLUGINS = new Set(['work', 'memory', 'toolkit']);
const ALLOWED_SKILL_KEYS = new Set(['name', 'description']);
const ALLOWED_AGENT_KEYS = new Set(['name', 'description', 'tools', 'model', 'isolation']);
const GLOBAL_FLAGS = new Set(['--json']);
const MAX_DESCRIPTION = 300;
const STEPS_LINE_LIMIT = 40;
const CONTENTS_LINE_LIMIT = 100;
// Skill subfolders whose files SKILL.md must name directly. agents/ is left
// out: agents/openai.yaml is Codex's settings file for the skill, not a
// file the agent reads.
const LINKED_SUBFOLDERS = ['references', 'assets', 'scripts'];
const KNOWN_TOOLS = ['Read', 'Glob', 'Grep', 'Edit', 'MultiEdit', 'Write', 'Bash', 'WebSearch', 'WebFetch'];
const AGENT_NAMES_FOR_FALLBACK = [
  'requirements-analyst', 'researcher', 'design-architect', 'design-critic', 'builder', 'acceptance-checker',
];

// Skills with a recorded reason to differ. Their findings are reported as
// notes, not failures.
const SALESFORCE_OVERLAY = {
  reason: 'project-local Salesforce overlay skill: body adapted from the model\'s copy, with a new description (SKILL-INDEX section 3); the step-placement and voice-line rules are for plugin skills',
  downgrade: new Set(['steps', 'voice']),
};
const EXCEPTIONS = {
  'sf-architect-solutioning': {
    reason: 'GOAL.md: body and references ported byte for byte; only the description was rewritten, which Mike approved on 2026-09-27, so the description rules apply in full',
    downgrade: new Set(['steps', 'voice', 'own-line', 'contents']),
  },
  'sf-deploy-check': SALESFORCE_OVERLAY,
  'sf-component-tracker': SALESFORCE_OVERLAY,
  'sf-data-change': SALESFORCE_OVERLAY,
};

// ---------------------------------------------------------------- utilities

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function rel(abs) {
  return path.relative(ROOT, abs);
}

function listDir(abs) {
  try {
    return fs.readdirSync(abs, { withFileTypes: true });
  } catch {
    return [];
  }
}

function walk(abs, predicate, out = []) {
  for (const entry of listDir(abs)) {
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      walk(full, predicate, out);
    } else if (predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

/** The text of a `## <prefix>` section, up to the next `## ` heading. */
function section(text, headingPrefix) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`## ${headingPrefix}`));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^## /.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join('\n');
}

/** Split a Markdown table row into trimmed cells (leading and trailing pipes dropped). */
function tableCells(line) {
  const cells = line.split('|').map((c) => c.trim());
  if (cells[0] === '') cells.shift();
  if (cells[cells.length - 1] === '') cells.pop();
  return cells;
}

function stripTicks(s) {
  return s.replace(/`/g, '').trim();
}

// ------------------------------------------------------ YAML frontmatter

/**
 * Parse the frontmatter block. Supports the scalar forms skills use: plain,
 * single-quoted, double-quoted, and folded or literal block scalars.
 * Returns { ok, keys: Map, errors: [], endLine } where endLine is the
 * 1-based line of the closing `---`.
 */
function parseFrontmatter(text) {
  const lines = text.split('\n');
  const result = { ok: false, keys: new Map(), errors: [], warnings: [], endLine: 0 };
  if (lines[0] !== '---') {
    result.errors.push('the first line is not `---`, so neither host reads the frontmatter');
    return result;
  }
  const close = lines.indexOf('---', 1);
  if (close === -1) {
    result.errors.push('no closing `---` for the frontmatter');
    return result;
  }
  result.endLine = close + 1;
  const body = lines.slice(1, close);
  for (let i = 0; i < body.length; i += 1) {
    const line = body[i];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):(?:\s+(.*))?$/);
    if (!m) {
      if (/^\s/.test(line)) continue; // continuation of a block value, handled below
      result.errors.push(`frontmatter line ${i + 2} is not "key: value": ${line}`);
      continue;
    }
    const key = m[1];
    const raw = (m[2] ?? '').trimEnd();
    let value;
    if (raw === '' || raw === '|' || raw === '>' || /^[|>][-+]?$/.test(raw)) {
      const block = [];
      let j = i + 1;
      while (j < body.length && (/^\s/.test(body[j]) || body[j] === '')) {
        block.push(body[j].trim());
        j += 1;
      }
      i = j - 1;
      if (raw.startsWith('|')) value = block.join('\n').trim();
      else if (raw.startsWith('>')) value = block.filter(Boolean).join(' ').trim();
      else value = block.join(' ').trim();
      if (raw !== '') result.warnings.push(`"${key}" uses a block scalar (${raw}); valid YAML, but a one-line quoted value is safer for skill listings`);
    } else if (raw.startsWith("'")) {
      if (!/^'(?:[^']|'')*'$/.test(raw)) {
        result.errors.push(`"${key}" single-quoted value is not closed on its line`);
        value = raw;
      } else {
        value = raw.slice(1, -1).replace(/''/g, "'");
      }
    } else if (raw.startsWith('"')) {
      if (!/^"(?:[^"\\]|\\.)*"$/.test(raw)) {
        result.errors.push(`"${key}" double-quoted value is not closed on its line`);
        value = raw;
      } else {
        value = raw.slice(1, -1).replace(/\\(.)/g, (_, c) => ({ n: '\n', t: '\t' }[c] ?? c));
      }
    } else {
      value = raw;
      if (/:\s/.test(raw) || /\s#/.test(raw) || /^[[\]{}>|*&!%@`?,-]\s?/.test(raw)) {
        result.errors.push(`"${key}" is a plain YAML value containing ": ", " #", or a leading indicator; quote it or YAML parsers reject it`);
      }
    }
    if (result.keys.has(key)) result.errors.push(`"${key}" appears twice`);
    result.keys.set(key, value);
  }
  result.ok = result.errors.length === 0;
  return result;
}

// ------------------------------------------- ARCHITECTURE section 5 grammar

function tokenDepth(token) {
  let d = 0;
  for (const ch of token) {
    if (ch === '(' || ch === '[' || ch === '<') d += 1;
    else if (ch === ')' || ch === ']' || ch === '>') d -= 1;
  }
  return d;
}

const LITERAL = /^[a-z][a-z0-9-]*$/;
const CHOICE_WORD = /^[a-z][a-z0-9-]*(\|[a-z][a-z0-9-]*)+$/;

function flagsIn(text) {
  return new Set((text.match(/--[a-z][a-z0-9-]*/g) || []));
}

/** Build the command grammar from the section 5 code block. */
function parseGrammar(architecture) {
  const sec = section(architecture, '5.');
  if (!sec) throw new Error('dev/ARCHITECTURE.md has no "## 5." section');
  const fence = sec.match(/```[a-z]*\n([\s\S]*?)```/);
  if (!fence) throw new Error('dev/ARCHITECTURE.md section 5 has no code block');
  return parseGrammarLines(fence[1].split('\n'), 'dev/ARCHITECTURE.md section 5');
}

/**
 * True when a usage part (the tokens after the command's name) has a token
 * outside square brackets: a required argument, flag, or choice.
 */
function needsArguments(tokens) {
  let square = 0;
  for (const t of tokens) {
    if (square === 0 && !t.startsWith('[')) return true;
    for (const ch of t) {
      if (ch === '[') square += 1;
      else if (ch === ']') square -= 1;
    }
  }
  return false;
}

/** Build a grammar from usage lines that start with `toolkit`. */
function parseGrammarLines(lines, source) {
  const commands = new Map();
  const add = (pathWords, flags, choices, required) => {
    const key = pathWords.join(' ');
    const existing = commands.get(key);
    if (existing) {
      for (const f of flags) existing.flags.add(f);
      if (choices) existing.choices = new Set([...(existing.choices || []), ...choices]);
      existing.requiresArgs = existing.requiresArgs && required;
      return existing;
    }
    const entry = { path: pathWords, flags: new Set(flags), choices: choices ? new Set(choices) : null, requiresArgs: required, source };
    commands.set(key, entry);
    return entry;
  };
  const sourceLines = [];
  for (const rawLine of lines) {
    const line = rawLine.trim().split(/\s{2,}/)[0].trim();
    if (!/^toolkit(\s|$)/.test(line)) continue;
    sourceLines.push(line);
    const tokens = line.split(/\s+/).slice(1);
    const parts = [[]];
    let depth = 0;
    for (const t of tokens) {
      if (t === '|' && depth === 0) {
        parts.push([]);
        continue;
      }
      parts[parts.length - 1].push(t);
      depth += tokenDepth(t);
    }
    let prev = null;
    for (const part of parts) {
      if (part.length === 0) continue;
      const first = part[0];
      if (prev && /^[-([]/.test(first)) {
        for (const f of flagsIn(part.join(' '))) prev.flags.add(f);
        continue;
      }
      const literals = [];
      let choices = null;
      for (const t of part) {
        if (LITERAL.test(t)) literals.push(t);
        else if (CHOICE_WORD.test(t)) {
          choices = t.split('|');
          break;
        } else break;
      }
      const required = Boolean(choices) || needsArguments(part.slice(literals.length));
      const pathWords = prev ? prev.path.slice(0, -1).concat(literals) : literals;
      prev = add(pathWords, flagsIn(part.join(' ')), choices, required);
    }
  }
  return { commands: [...commands.values()], sourceLines };
}

/**
 * The grammar the toolkit CLI itself documents: the usage lines in the help
 * text of every plugins/toolkit/lib/commands/*.mjs file. A command file does
 * no work when imported (lib/cli.mjs says so), so importing it is safe.
 * Returns { commands, sourceLines, problems }.
 */
async function parseCliGrammar() {
  const dir = path.join(ROOT, 'plugins', 'toolkit', 'lib', 'commands');
  const lines = [];
  const sources = [];
  const problems = [];
  for (const entry of listDir(dir)) {
    if (!entry.isFile() || !entry.name.endsWith('.mjs') || entry.name.endsWith('.test.mjs')) continue;
    const file = path.join(dir, entry.name);
    let help;
    try {
      const mod = await import(pathToFileURL(file).href);
      help = typeof mod.help === 'function' ? mod.help() : mod.help;
    } catch (err) {
      problems.push(`${rel(file)} could not be read for its usage lines: ${err.message}`);
      continue;
    }
    if (typeof help !== 'string') continue;
    // Join continuation lines (they start with "[", "(", or "--") to the usage line above.
    const joined = [];
    for (const raw of help.split('\n')) {
      const t = raw.trim();
      if (/^toolkit\s/.test(t)) joined.push(t);
      else if (joined.length && /^(\[|\(|--)/.test(t) && /^\s{4,}/.test(raw)) joined[joined.length - 1] += ` ${t}`;
    }
    for (const l of joined) {
      lines.push(l);
      sources.push(rel(file));
    }
  }
  const commands = new Map();
  lines.forEach((l, i) => {
    for (const c of parseGrammarLines([l], sources[i]).commands) {
      const key = c.path.join(' ');
      const existing = commands.get(key);
      if (existing) {
        for (const f of c.flags) existing.flags.add(f);
        if (c.choices) existing.choices = new Set([...(existing.choices || []), ...c.choices]);
      } else commands.set(key, c);
    }
  });
  return { commands: [...commands.values()], sourceLines: lines, problems };
}

// ----------------------------------------------------- command extraction

function shellTokens(s) {
  const tokens = [];
  let cur = '';
  let quote = null;
  let quoted = false;
  for (const ch of s) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      quoted = true;
    } else if (/\s/.test(ch)) {
      if (cur || quoted) tokens.push(cur);
      cur = '';
      quoted = false;
    } else {
      cur += ch;
    }
  }
  if (cur || quoted) tokens.push(cur);
  return tokens;
}

/**
 * Every `toolkit ...` command in a Markdown file: code-block lines and inline
 * code spans. Frontmatter is skipped. Also lists prose lines that start with
 * `toolkit <group>` outside backticks, which the check cannot validate.
 * Returns { commands, oddTicks, plain }.
 */
function extractCommands(text, skipUntilLine = 0, groups = new Set()) {
  const commands = [];
  const oddTicks = [];
  const plain = [];
  const lines = text.split('\n');
  let fenceChar = null;
  lines.forEach((raw, idx) => {
    const lineNo = idx + 1;
    if (lineNo <= skipUntilLine) return;
    const t = raw.trim();
    const fm = t.match(/^(`{3,}|~{3,})/);
    if (fm) {
      if (!fenceChar) fenceChar = fm[1][0];
      else if (t[0] === fenceChar && /^(`{3,}|~{3,})\s*$/.test(t)) fenceChar = null;
      return;
    }
    if (fenceChar) {
      if (/^toolkit(\s|$)/.test(t)) commands.push({ cmd: t, line: lineNo, inline: false, ownLine: true });
      return;
    }
    const ticks = (raw.match(/`/g) || []).length;
    if (ticks % 2 === 1) oddTicks.push(lineNo);
    for (const m of raw.matchAll(/`([^`]+)`/g)) {
      const span = m[1].trim();
      if (!/^toolkit\s/.test(span)) continue;
      const bare = t.replace(/^(?:[-*+]|\d+\.)\s+/, '').trim();
      commands.push({ cmd: span, line: lineNo, inline: true, ownLine: bare === m[0] });
    }
    const prose = t.replace(/^(?:[-*+>]|\d+\.)\s+/, '').replace(/`[^`]*`/g, '').trim();
    const start = prose.match(/^toolkit\s+([a-z][a-z0-9-]*)/);
    if (start && groups.has(start[1])) plain.push({ line: lineNo, text: prose.slice(0, 60) });
  });
  return { commands, oddTicks, plain };
}

function isPlaceholder(tok) {
  return /^<.*>$/.test(tok) || /^\[.*\]$/.test(tok);
}

/**
 * Check one command against one grammar. Returns { kind, errors, entry } where
 * kind is 'command' (a full command), 'mention' (only the name of a command
 * that needs arguments, such as `toolkit decision add` inside a sentence),
 * 'group' (a mention of a command group such as `toolkit work`), or 'bare'
 * (`toolkit` alone). Each error is { what, detail }.
 */
function validateCommandIn(cmd, grammar) {
  let toks = shellTokens(cmd).slice(1);
  while (toks.length && toks[toks.length - 1] === '...') toks = toks.slice(0, -1);
  if (toks.length === 0) return { kind: 'bare', errors: [] };
  let best = null;
  for (const c of grammar.commands) {
    if (c.path.length <= toks.length && c.path.every((w, i) => toks[i] === w)) {
      if (!best || c.path.length > best.path.length) best = c;
    }
  }
  if (!best) {
    const groupRef = grammar.commands.some((c) => toks.length < c.path.length && toks.every((w, i) => c.path[i] === w));
    if (groupRef) return { kind: 'group', errors: [] };
    return { kind: 'command', errors: [{ what: `the command "toolkit ${toks.slice(0, 2).join(' ')}"`, detail: '' }] };
  }
  const errors = [];
  const name = `"toolkit ${best.path.join(' ')}"`;
  const rest = toks.slice(best.path.length);
  if (rest.length === 0 && best.requiresArgs) return { kind: 'mention', errors: [], entry: best };
  if (best.choices) {
    const next = rest[0];
    const choices = [...best.choices].join(', ');
    if (!next) errors.push({ what: `${name} with no subcommand`, detail: `it needs one of: ${choices}` });
    else if (!isPlaceholder(next) && !next.split('|').every((w) => best.choices.has(w))) {
      errors.push({ what: `the subcommand "${next}" of ${name}`, detail: `known: ${choices}` });
    }
  }
  for (const tok of rest) {
    const clean = tok.replace(/^[[(]+/, '').replace(/[\])]+$/, '');
    if (!clean.startsWith('--')) continue;
    for (const piece of clean.split('|')) {
      const flag = piece.split('=')[0];
      if (!flag.startsWith('--')) continue;
      if (!best.flags.has(flag) && !GLOBAL_FLAGS.has(flag)) {
        errors.push({ what: `the flag ${flag} for ${name}`, detail: `allowed: ${[...best.flags].join(' ') || 'none'}` });
      }
    }
  }
  return { kind: 'command', errors, entry: best };
}

/**
 * Check one command against ARCHITECTURE.md section 5, then, when section 5
 * rejects it, against the CLI's own usage lines. A command the CLI accepts
 * but section 5 lacks is still a failure, counted in `gapCount`, so the fix
 * is clear: add the line to section 5. Returns { kind, errors (strings),
 * gap, gapCount }.
 */
function validateCommand(cmd, grammar, cliGrammar) {
  const v = validateCommandIn(cmd, grammar);
  if (v.kind === 'bare' || v.kind === 'mention') return { kind: v.kind, errors: [] };
  if (v.kind === 'command' && v.errors.length === 0) return { kind: 'command', errors: [] };
  const c = cliGrammar ? validateCommandIn(cmd, cliGrammar) : null;
  if (c && c.kind === 'mention' && v.kind === 'command') return { kind: 'mention', errors: [] };
  if (v.kind === 'group') return { kind: 'group', errors: [] };
  if (c && c.kind === 'command' && c.entry) {
    // The CLI knows this command. What section 5 lacks but the CLI accepts is
    // a gap in section 5; what the CLI rejects too is a plain error.
    const src = c.entry.source || 'the CLI';
    const cliWhats = new Set(c.errors.map((e) => e.what));
    const errors = [];
    let gapCount = 0;
    for (const e of v.errors) {
      if (cliWhats.has(e.what)) continue;
      errors.push(`${e.what} is not in ARCHITECTURE.md section 5, but the CLI has it (${src}): add it to section 5`);
      gapCount += 1;
    }
    for (const e of c.errors) errors.push(`${e.what} is not in ARCHITECTURE.md section 5 or in the CLI's own help${e.detail ? ` (${e.detail})` : ''}`);
    return { kind: 'command', gap: gapCount > 0, gapCount, errors };
  }
  return {
    kind: 'command',
    errors: v.errors.map((e) => `${e.what} is not in ARCHITECTURE.md section 5 or in the CLI's own help${e.detail ? ` (${e.detail})` : ''}`),
  };
}

// --------------------------------------------------------- SKILL-INDEX

function parseSkillIndex(indexText) {
  const sec = section(indexText, '1.');
  if (!sec) throw new Error('dev/SKILL-INDEX.md has no "## 1." section');
  const skills = new Map();
  for (const line of sec.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = tableCells(line);
    if (cells.length < 6 || !/^\d+$/.test(cells[0])) continue;
    const name = stripTicks(cells[2]);
    skills.set(name, {
      number: Number(cells[0]),
      plugin: cells[1],
      description: cells[3],
      chars: Number(cells[4]),
    });
  }
  const agents = new Map();
  const agentSec = section(indexText, '4.');
  if (agentSec) {
    for (const line of agentSec.split('\n')) {
      if (!line.startsWith('|')) continue;
      const cells = tableCells(line);
      if (cells.length < 7 || !/^`[a-z-]+`$/.test(cells[0])) continue;
      const name = stripTicks(cells[0]);
      const toolsText = cells[3];
      const tools = new Set(KNOWN_TOOLS.filter((t) => new RegExp(`\\b${t}\\b`).test(toolsText)));
      agents.set(name, { plugin: cells[1], tools, isolation: /isolation:\s*worktree/.test(toolsText) ? 'worktree' : null });
    }
  }
  return { skills, agents };
}

// ------------------------------------------------- skill folder file rules

/** Number of lines, counted as `wc -l` would for a file that ends with a newline. */
function lineCount(text) {
  if (!text) return 0;
  const n = text.split('\n').length;
  return text.endsWith('\n') ? n - 1 : n;
}

/** Line number (1-based) of the first line after a YAML frontmatter block; 1 when there is none. */
function bodyStart(lines) {
  if (lines[0] !== '---') return 1;
  const close = lines.indexOf('---', 1);
  return close > 0 ? close + 2 : 1;
}

const PATH_PREFIX = /^(?:\.\/)?(?:\.\.\/|references\/|assets\/|scripts\/)/;
const PROSE_PATH = /(?<![\w./<{-])(?:references|assets|scripts)\/[A-Za-z0-9_./-]*[A-Za-z0-9_-]\.[A-Za-z0-9]+/g;

/** A path is a placeholder or an outside address, not a file to find. */
function skipPath(p) {
  return !p || /[<>{}*$]/.test(p) || /^[a-z][a-z0-9+.-]*:/i.test(p) || p.startsWith('#') || p.startsWith('/') || p.startsWith('~');
}

/**
 * The file paths a Markdown file names: Markdown link targets outside code,
 * code spans that hold a path starting with references/, assets/, scripts/,
 * or ../, and the same paths written in prose. Fenced code blocks are
 * skipped: they hold commands and examples, not links. Each item is
 * { path, line }.
 */
function namedPaths(text) {
  const out = [];
  const lines = text.split('\n');
  let fence = null;
  for (let i = bodyStart(lines) - 1; i < lines.length; i += 1) {
    const raw = lines[i];
    const t = raw.trim();
    const fm = t.match(/^(`{3,}|~{3,})/);
    if (fm) {
      if (!fence) fence = fm[1][0];
      else if (t[0] === fence && /^(`{3,}|~{3,})\s*$/.test(t)) fence = null;
      continue;
    }
    if (fence) continue;
    const spans = [];
    const prose = raw.replace(/`([^`]+)`/g, (m, s) => {
      spans.push(s.trim());
      return ' '.repeat(m.length);
    });
    for (const m of prose.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
      const p = m[1].replace(/[#?].*$/, '');
      if (!skipPath(m[1]) && p) out.push({ path: p, line: i + 1 });
    }
    for (const s of spans) {
      const first = s.split(/\s+/)[0].replace(/[,;:.)]+$/, '');
      if (PATH_PREFIX.test(first) && !skipPath(first)) out.push({ path: first.replace(/[#?].*$/, ''), line: i + 1 });
    }
    for (const m of prose.matchAll(PROSE_PATH)) {
      if (!skipPath(m[0])) out.push({ path: m[0], line: i + 1 });
    }
  }
  return out;
}

/** Every file under a skill's references/, assets/, and scripts/ folders, as skill-relative paths. */
function skillFolderFiles(skillDir) {
  const out = [];
  for (const sub of LINKED_SUBFOLDERS) {
    const dir = path.join(skillDir, sub);
    for (const f of walk(dir, (p) => !path.basename(p).startsWith('.'))) {
      out.push(path.relative(skillDir, f).split(path.sep).join('/'));
    }
  }
  return out.sort();
}

/**
 * Resolve a named path. The Agent Skills specification resolves paths from
 * the skill folder; a Markdown link in a reference may also be relative to
 * that reference. Returns { inside, exists, rel } with rel relative to the
 * skill folder.
 */
function resolveNamed(skillDir, fromFile, p) {
  const tries = [path.resolve(skillDir, p)];
  const fromDir = path.dirname(fromFile);
  if (fromDir !== skillDir) tries.push(path.resolve(fromDir, p));
  let first = null;
  for (const full of tries) {
    const r = path.relative(skillDir, full);
    const inside = r !== '' && !r.startsWith('..') && !path.isAbsolute(r);
    const hit = { inside, exists: fs.existsSync(full), rel: r.split(path.sep).join('/') };
    if (!first) first = hit;
    if (hit.inside && hit.exists) return hit;
  }
  return first;
}

/** True when the first section heading after the title is a contents list. */
function contentsFirst(text) {
  const lines = text.split('\n');
  let fence = null;
  for (let i = bodyStart(lines) - 1; i < lines.length; i += 1) {
    const t = lines[i].trim();
    const fm = t.match(/^(`{3,}|~{3,})/);
    if (fm) {
      if (!fence) fence = fm[1][0];
      else if (t[0] === fence && /^(`{3,}|~{3,})\s*$/.test(t)) fence = null;
      continue;
    }
    if (fence) continue;
    const h = t.match(/^(#{2,6})\s+(.+?)\s*#*$/);
    if (h) return /^(?:table of )?contents$/i.test(h[2].replace(/[*_`]/g, '').trim());
  }
  return false;
}

// ------------------------------------------------------------- the checks

function lastStepLine(text) {
  const lines = text.split('\n');
  const first = lines.findIndex((l) => /^1\.\s/.test(l));
  if (first === -1) return { first: -1, last: -1 };
  let last = first;
  for (let i = first + 1; i < lines.length; i += 1) {
    const l = lines[i];
    if (/^\d+\.\s/.test(l) || /^\s+\S/.test(l)) {
      last = i;
      continue;
    }
    if (l.trim() === '') continue;
    break;
  }
  return { first: first + 1, last: last + 1 };
}

async function main() {
  const architecture = read('dev/ARCHITECTURE.md');
  const indexText = read('dev/SKILL-INDEX.md');
  const grammar = parseGrammar(architecture);
  const cliGrammar = await parseCliGrammar();
  if (GRAMMAR_ONLY) {
    const show = (g) => {
      for (const c of g.commands) {
        const choices = c.choices ? ` <${[...c.choices].join('|')}>` : '';
        console.log(`toolkit ${c.path.join(' ')}${choices}  ${[...c.flags].join(' ')}`.trimEnd());
      }
    };
    console.log('ARCHITECTURE.md section 5:');
    show(grammar);
    console.log(`${grammar.commands.length} commands; every command also accepts ${[...GLOBAL_FLAGS].join(' ')}`);
    console.log('');
    console.log("The CLI's own help (plugins/toolkit/lib/commands/*.mjs):");
    show(cliGrammar);
    console.log(`${cliGrammar.commands.length} commands`);
    for (const p of cliGrammar.problems) console.log(`warn  ${p}`);
    return;
  }
  const groups = new Set([...grammar.commands, ...cliGrammar.commands].map((c) => c.path[0]));
  const index = parseSkillIndex(indexText);

  // The quoted lines come from the work plugin's shared sources; the older
  // plugins/work/references/ files are read only while they still exist.
  const VOICE_SOURCE = ['plugins/work/shared/recording-owner-answers.md', 'plugins/work/references/conventions.md'].find(exists) || 'plugins/work/shared/recording-owner-answers.md';
  const FALLBACK_SOURCE = ['plugins/work/shared/helpers.md', 'plugins/work/references/helpers.md'].find(exists) || 'plugins/work/shared/helpers.md';
  const conventions = exists(VOICE_SOURCE) ? read(VOICE_SOURCE) : '';
  const helpers = exists(FALLBACK_SOURCE) ? read(FALLBACK_SOURCE) : '';
  const voiceLine = (conventions.match(/^> (Voice: .+)$/m) || [])[1] || null;
  const fallbackFull = (helpers.match(/^> (Codex: this plugin's agents .+)$/m) || [])[1] || null;
  const fallbackPrefix = fallbackFull ? fallbackFull.split('. ').slice(0, 2).join('. ') : null;

  const report = { files: [], failures: 0, warnings: 0, notes: 0, commandsChecked: 0, sectionFiveGaps: 0, skillFolderFiles: 0, copiesChecked: 0 };
  const results = new Map();
  const fileResult = (file) => {
    if (results.has(file)) return results.get(file);
    const r = { file, fail: [], warn: [], note: [] };
    results.set(file, r);
    report.files.push(r);
    return r;
  };

  // Every SKILL.md: plugin skills, then scaffold copies.
  const pluginsDir = path.join(ROOT, 'plugins');
  const skillFiles = [];
  for (const plugin of listDir(pluginsDir).filter((d) => d.isDirectory())) {
    const skillsDir = path.join(pluginsDir, plugin.name, 'skills');
    for (const skill of listDir(skillsDir).filter((d) => d.isDirectory())) {
      const file = path.join(skillsDir, skill.name, 'SKILL.md');
      if (fs.existsSync(file)) skillFiles.push({ file, plugin: plugin.name, folder: skill.name, scaffold: false });
    }
    const scaffoldDir = path.join(pluginsDir, plugin.name, 'scaffold');
    for (const file of walk(scaffoldDir, (f) => path.basename(f) === 'SKILL.md')) {
      // Scaffold copies: the model copy's .claude/skills/<name>/ and
      // .agents/skills/<name>/ in scaffold/model/, which init installs as they are.
      if (!/[/\\](?:\.(?:claude|agents)[/\\])?skills[/\\][^/\\]+[/\\]SKILL\.md$/.test(file)) continue;
      skillFiles.push({ file, plugin: plugin.name, folder: path.basename(path.dirname(file)), scaffold: true });
    }
  }

  const seen = new Set();
  for (const s of skillFiles) {
    const text = fs.readFileSync(s.file, 'utf8');
    const r = fileResult(rel(s.file));
    const exception = EXCEPTIONS[s.folder];
    const flag = (kind, msg) => {
      if (exception && exception.downgrade.has(kind)) r.note.push(`${msg} [exception: ${exception.reason}]`);
      else r.fail.push(msg);
    };

    const fm = parseFrontmatter(text);
    for (const e of fm.errors) flag('frontmatter', e);
    for (const w of fm.warnings) r.warn.push(w);
    const extra = [...fm.keys.keys()].filter((k) => !ALLOWED_SKILL_KEYS.has(k));
    if (extra.length) flag('frontmatter-keys', `frontmatter has keys other than name and description: ${extra.join(', ')}`);
    const name = fm.keys.get('name');
    const description = fm.keys.get('description');
    if (!name) flag('name', 'no `name` in the frontmatter (Codex requires it)');
    else {
      if (name !== s.folder) flag('name', `name "${name}" does not equal the folder "${s.folder}"`);
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) flag('name', `name "${name}" is not lowercase words joined by hyphens, at most 64 characters`);
    }
    if (!description) flag('description', 'no `description` in the frontmatter');
    else {
      if (description.length > MAX_DESCRIPTION) flag('description-length', `description is ${description.length} characters (limit ${MAX_DESCRIPTION})`);
      const entry = index.skills.get(s.folder);
      if (!entry) flag('description-index', `"${s.folder}" is not in dev/SKILL-INDEX.md section 1`);
      else {
        seen.add(s.folder);
        if (entry.description !== description) {
          let at = 0;
          while (at < description.length && description[at] === entry.description[at]) at += 1;
          flag('description-index', `description differs from dev/SKILL-INDEX.md at character ${at + 1}: file has "${description.slice(at, at + 40)}", index has "${entry.description.slice(at, at + 40)}"`);
        }
        if (entry.chars !== entry.description.length) r.warn.push(`SKILL-INDEX "Chars" column says ${entry.chars}, the description is ${entry.description.length} characters`);
        const indexPlugin = entry.plugin.toLowerCase();
        if (s.scaffold) {
          if (!indexPlugin.startsWith('project-local')) flag('plugin', `SKILL-INDEX puts "${s.folder}" in plugin "${entry.plugin}", but this copy is in the scaffold`);
        } else if (indexPlugin.split(/[\s(]/)[0] !== s.plugin) {
          flag('plugin', `SKILL-INDEX puts "${s.folder}" in plugin "${entry.plugin}", but the file is in plugins/${s.plugin}`);
        }
      }
    }

    // Forbidden syntax.
    const forbidden = [
      [/when_to_use/, '`when_to_use` (Claude-only frontmatter)'],
      [/!`/, '!`command` (dynamic context injection; Codex leaves it as literal text)'],
      [/^\s*```!/m, '```! block (dynamic context injection)'],
      [/\$ARGUMENTS/, '$ARGUMENTS'],
      [/\$[0-9]/, '$0-$9 (Claude Code replaces it with a skill argument)'],
      [/\$\{CLAUDE_[A-Z_]*\}/, '${CLAUDE_*} variable'],
    ];
    for (const [re, label] of forbidden) {
      const m = text.match(re);
      if (m) {
        const lineNo = text.slice(0, m.index).split('\n').length;
        flag('forbidden', `forbidden syntax on line ${lineNo}: ${label}`);
      }
    }

    // Steps in the first 40 lines.
    const steps = lastStepLine(text);
    if (steps.first === -1) flag('steps', 'no numbered steps ("1. ...") found');
    else if (steps.last > STEPS_LINE_LIMIT) flag('steps', `the numbered steps run from line ${steps.first} to line ${steps.last}; they must end by line ${STEPS_LINE_LIMIT}`);

    // Voice line.
    if (voiceLine) {
      if (!text.includes(voiceLine)) {
        if (REQUIRED_VOICE_PLUGINS.has(s.plugin) && !s.scaffold) flag('voice', `the voice line from ${VOICE_SOURCE} is missing or changed`);
        else if (!(exception && exception.downgrade.has('voice'))) r.warn.push(`the voice line from ${VOICE_SOURCE} is not present`);
      } else {
        const lineNo = text.slice(0, text.indexOf(voiceLine)).split('\n').length;
        if (lineNo > STEPS_LINE_LIMIT) r.warn.push(`the voice line is on line ${lineNo}, after the first ${STEPS_LINE_LIMIT} lines`);
      }
    }

    // Codex agent fallback for work-plugin skills that brief agents.
    if (fallbackPrefix && s.plugin === 'work' && !s.scaffold) {
      const usesAgents = AGENT_NAMES_FOR_FALLBACK.some((a) => text.includes(`\`${a}\``));
      if (usesAgents && !text.includes(fallbackPrefix)) flag('fallback', `briefs agents but lacks the Codex agent fallback line from ${FALLBACK_SOURCE}`);
    }

    // Commands: own line, and valid.
    const { commands, oddTicks, plain } = extractCommands(text, fm.endLine, groups);
    for (const c of commands) {
      const v = validateCommand(c.cmd, grammar, cliGrammar);
      if (v.kind !== 'command') continue;
      report.commandsChecked += 1;
      if (!c.ownLine) flag('own-line', `line ${c.line}: toolkit command is not on its own line: \`${c.cmd}\``);
      report.sectionFiveGaps += v.gapCount || 0;
      for (const e of v.errors) flag('command', `line ${c.line}: ${e}`);
    }
    for (const n of oddTicks) r.warn.push(`line ${n}: odd number of backticks (inline code may be broken across lines)`);
    for (const p of plain) r.warn.push(`line ${p.line}: a toolkit command outside backticks is not checked: "${p.text}"`);
  }

  // Skill folders: links, one level deep, contents lists (skill-writing-guide R1 to R4, R6).
  for (const s of skillFiles) {
    const skillDir = path.dirname(s.file);
    const exception = EXCEPTIONS[s.folder];
    const flagIn = (r, kind, msg) => {
      if (exception && exception.downgrade.has(kind)) r.note.push(`${msg} [exception: ${exception.reason}]`);
      else r.fail.push(msg);
    };
    const skillText = fs.readFileSync(s.file, 'utf8');
    const files = skillFolderFiles(skillDir);
    report.skillFolderFiles += files.length;
    const namedBy = new Map(); // skill-relative path -> the skill-relative files that name it

    for (const from of ['SKILL.md', ...files.filter((f) => f.endsWith('.md'))]) {
      const fromAbs = path.join(skillDir, from);
      const text = from === 'SKILL.md' ? skillText : fs.readFileSync(fromAbs, 'utf8');
      const generatedFrom = from === 'SKILL.md' ? null : headerSource(text);
      const r = fileResult(rel(fromAbs));
      const fix = generatedFrom ? ` Edit the source ${generatedFrom}, then run node dev/tools/sync-skill-references.mjs.` : '';
      const reported = new Set();
      for (const n of namedPaths(text)) {
        const hit = resolveNamed(skillDir, fromAbs, n.path);
        if (!hit.inside) {
          if (!reported.has(`out:${n.path}`)) flagIn(r, 'links', `line ${n.line}: "${n.path}" leaves the skill folder; a skill may read only files inside its own folder (R1, R4).${fix}`);
          reported.add(`out:${n.path}`);
          continue;
        }
        if (!hit.exists) {
          if (!reported.has(`missing:${n.path}`)) flagIn(r, 'links', `line ${n.line}: "${n.path}" does not exist in ${rel(skillDir)}.${fix}`);
          reported.add(`missing:${n.path}`);
          continue;
        }
        if (!namedBy.has(hit.rel)) namedBy.set(hit.rel, new Set());
        namedBy.get(hit.rel).add(from);
      }

      // A reference over 100 lines starts with a contents list.
      if (from.startsWith('references/') && from.endsWith('.md')) {
        const lines = lineCount(text) - (generatedFrom ? 1 : 0);
        if (lines > CONTENTS_LINE_LIMIT && !contentsFirst(text)) {
          flagIn(r, 'contents', `${lines} lines and no "## Contents" list as its first section; a reference over ${CONTENTS_LINE_LIMIT} lines needs one (R3).${fix}`);
        }
      }
    }

    // One level deep: SKILL.md itself names every file.
    for (const f of files) {
      const by = namedBy.get(f);
      if (by && by.has('SKILL.md')) continue;
      const r = fileResult(rel(path.join(skillDir, f)));
      const others = by ? [...by].sort() : [];
      if (others.length) flagIn(r, 'depth', `more than one level deep: SKILL.md does not link it; only ${others.join(', ')} does. Link it from SKILL.md with when to open it (R1, R2).`);
      else flagIn(r, 'depth', 'nothing links it: SKILL.md must link every file in references/, assets/, and scripts/, with when to open it (R1, R2, R6).');
    }
  }

  // Generated copies: the same check as node dev/tools/sync-skill-references.mjs --check.
  const sync = syncSkillReferences({ check: true });
  report.copiesChecked = sync.copies.length;
  for (const p of sync.problems) fileResult(p.file).fail.push(`${p.message} Run node dev/tools/sync-skill-references.mjs.`);

  // Index entries with no SKILL.md yet.
  const missing = [...index.skills.keys()].filter((n) => !seen.has(n));
  if (missing.length) {
    const r = fileResult('dev/SKILL-INDEX.md');
    for (const n of missing) r.note.push(`"${n}" (${index.skills.get(n).plugin}) has no SKILL.md yet`);
  }

  // Other Markdown in skill folders and shared sources: commands only. A
  // generated copy of a shared/ or agents/ source is checked in its source
  // (the copy check above makes sure the two are equal).
  const extraMarkdown = [];
  for (const plugin of listDir(pluginsDir).filter((d) => d.isDirectory())) {
    const base = path.join(pluginsDir, plugin.name);
    for (const sub of ['skills', 'shared', 'references']) {
      for (const f of walk(path.join(base, sub), (p) => p.endsWith('.md') && path.basename(p) !== 'SKILL.md')) extraMarkdown.push(f);
    }
  }
  for (const f of extraMarkdown) {
    const text = fs.readFileSync(f, 'utf8');
    const copyOf = headerSource(text);
    if (copyOf && /^plugins\/[^/]+\/(?:shared|agents)\//.test(copyOf)) continue;
    const { commands, oddTicks, plain } = extractCommands(text, 0, groups);
    const r = fileResult(rel(f));
    for (const c of commands) {
      const v = validateCommand(c.cmd, grammar, cliGrammar);
      if (v.kind !== 'command') continue;
      report.commandsChecked += 1;
      report.sectionFiveGaps += v.gapCount || 0;
      for (const e of v.errors) r.fail.push(`line ${c.line}: ${e}`);
    }
    for (const n of oddTicks) r.warn.push(`line ${n}: odd number of backticks (inline code may be broken across lines)`);
    for (const p of plain) r.warn.push(`line ${p.line}: a toolkit command outside backticks is not checked: "${p.text}"`);
    for (const [re, label] of [[/!`/, '!`command`'], [/\$\{CLAUDE_[A-Z_]*\}/, '${CLAUDE_*} variable']]) {
      const m = text.match(re);
      if (m) r.warn.push(`line ${text.slice(0, m.index).split('\n').length}: ${label} (Codex leaves it as literal text)`);
    }
  }

  // Agents.
  const seenAgents = new Set();
  for (const plugin of listDir(pluginsDir).filter((d) => d.isDirectory())) {
    const agentsDir = path.join(pluginsDir, plugin.name, 'agents');
    for (const entry of listDir(agentsDir)) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      const file = path.join(agentsDir, entry.name);
      const text = fs.readFileSync(file, 'utf8');
      const r = fileResult(rel(file));
      const stem = entry.name.slice(0, -3);
      const fm = parseFrontmatter(text);
      for (const e of fm.errors) r.fail.push(e);
      for (const w of fm.warnings) r.warn.push(w);
      const extra = [...fm.keys.keys()].filter((k) => !ALLOWED_AGENT_KEYS.has(k));
      if (extra.length) r.warn.push(`frontmatter has other keys: ${extra.join(', ')}`);
      if (fm.keys.get('name') !== stem) r.fail.push(`name "${fm.keys.get('name')}" does not equal the file name "${stem}"`);
      if (!fm.keys.get('description')) r.fail.push('no `description`');
      if (fm.keys.get('model') !== 'opus') r.fail.push(`model is "${fm.keys.get('model')}", must be "opus"`);
      const spec = index.agents.get(stem);
      if (!spec) r.warn.push(`"${stem}" is not in dev/SKILL-INDEX.md section 4`);
      else {
        seenAgents.add(stem);
        if (stripTicks(spec.plugin) !== plugin.name) r.fail.push(`SKILL-INDEX puts "${stem}" in plugin "${spec.plugin}"`);
        const tools = new Set(String(fm.keys.get('tools') || '').split(',').map((t) => t.trim()).filter(Boolean));
        const want = [...spec.tools].sort().join(', ');
        const have = [...tools].sort().join(', ');
        if (want !== have) r.fail.push(`tools are "${have}", SKILL-INDEX section 4 says "${want}"`);
        if (spec.isolation && fm.keys.get('isolation') !== spec.isolation) r.fail.push(`needs "isolation: ${spec.isolation}"`);
        if (!spec.isolation && fm.keys.get('isolation')) r.fail.push('has "isolation" but SKILL-INDEX section 4 does not give it one');
      }
      if (!/crediting an AI/i.test(text)) r.warn.push('no "never add a line crediting an AI" writing rule');
      if (!/^## Writing/m.test(text)) r.warn.push('no "## Writing" section with its own Plain English rules');
      const { commands, plain } = extractCommands(text, fm.endLine, groups);
      for (const c of commands) {
        const v = validateCommand(c.cmd, grammar, cliGrammar);
        if (v.kind !== 'command') continue;
        report.commandsChecked += 1;
        report.sectionFiveGaps += v.gapCount || 0;
        for (const e of v.errors) r.fail.push(`line ${c.line}: ${e}`);
      }
      for (const p of plain) r.warn.push(`line ${p.line}: a toolkit command outside backticks is not checked: "${p.text}"`);
    }
  }
  const missingAgents = [...index.agents.keys()].filter((n) => !seenAgents.has(n));
  if (missingAgents.length) {
    const r = fileResult('dev/SKILL-INDEX.md (agents)');
    for (const n of missingAgents) r.note.push(`agent "${n}" (${index.agents.get(n).plugin}) has no file yet`);
  }

  for (const r of report.files) {
    report.failures += r.fail.length;
    report.warnings += r.warn.length;
    report.notes += r.note.length;
  }
  const skillCount = skillFiles.length;
  const agentCount = seenAgents.size;
  if (cliGrammar.problems.length) {
    const r = fileResult('plugins/toolkit/lib/commands');
    for (const p of cliGrammar.problems) r.warn.push(p);
    report.warnings += cliGrammar.problems.length;
  }
  const gaps = report.sectionFiveGaps ? ` (${report.sectionFiveGaps} of them are commands or flags the CLI has and ARCHITECTURE.md section 5 does not list)` : '';
  const summary = `check-skills: ${skillCount} SKILL.md files, ${report.skillFolderFiles} files in their references/, assets/, and scripts/ folders (${report.copiesChecked} of them generated copies), ${agentCount} agent files, ${report.commandsChecked} toolkit commands checked against ${grammar.commands.length} commands in ARCHITECTURE.md section 5 and ${cliGrammar.commands.length} in the CLI's own help; ${report.failures} failures${gaps}, ${report.warnings} warnings, ${report.notes} notes`;

  if (JSON_OUT) {
    process.stdout.write(`${JSON.stringify({ ...report, summary }, null, 2)}\n`);
  } else {
    for (const r of report.files) {
      if (!r.fail.length && !r.warn.length && !r.note.length) {
        if (!QUIET) console.log(`ok    ${r.file}`);
        continue;
      }
      const head = r.fail.length ? 'FAIL ' : r.warn.length ? 'warn ' : 'note ';
      console.log(`${head} ${r.file}`);
      for (const m of r.fail) console.log(`        FAIL  ${m}`);
      for (const m of r.warn) console.log(`        warn  ${m}`);
      for (const m of r.note) console.log(`        note  ${m}`);
    }
    console.log(summary);
  }
  process.exitCode = report.failures ? 1 : 0;
}

main().catch((err) => {
  console.error(`check-skills: ${err.stack || err.message}`);
  process.exitCode = 1;
});

// The owner's standing instructions, kept as rules (Mike, 2026-09-29,
// dev/GOAL.md "Rules, skills, and memory each hold one kind of thing"):
// what the agent must do every time ("from now on", "always", "never", a
// preference about how the agent works, a correction) goes in a rule file,
// never in memory.
//
// Two places:
//   project   .claude/rules/owner-preferences.md in the project (always on:
//             no `paths` frontmatter). Claude Code loads it at session start;
//             the AGENTS.md rules list names it, so Codex reads it too.
//   machine   owner-preferences.md in the Claude Code user rules folder
//             (~/.claude/rules/, or $CLAUDE_CONFIG_DIR/rules/), for every
//             project on this computer. Claude Code loads it in every project;
//             Codex reads it only in Toolkit V2 projects, through the briefing.
//
// The file follows Claude Code's guidance for rules (Mike, 2026-09-29, "Rules
// follow Claude Code best practices"; lib/project/rule-lint.mjs): a "# "
// title, a one-line purpose, and one "## " section per area (Replies,
// Testing, Git, ...). Each instruction is one list line, specific enough to
// check, that ends with its date and where it came from:
//
//   - Lead every status reply with the answer. (2026-09-29, Mike Rihm in chat)
//
// No frontmatter: the file applies to every file in every session, so it
// loads at session start and again after compaction. It is sent with every
// request, so a change that takes it past RULE_LIMITS (4 KB or 50
// instructions) prints a warning, and toolkit doctor shows a note.
//
// Lines the toolkit did not write are kept as they are. Every change holds a
// lock on the rules folder and is read back before it is reported.
//
// readRuleDoc(scope, opts)          { file, exists, doc }
// parseRuleDoc(text)                { lead: [lines], sections: [{ heading, lines }] }
// entriesOf(section)                [{ n, text, date, source, line }]
// changeRules(scope, opts, fn)      read, change, write, read back, under the lock
// refreshAgentsSpan(root)           the AGENTS.md rules list rebuilt from .claude/rules/

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { atomicWrite, ensureDir } from '../core/fsx.mjs';
import { withLock } from '../core/lock.mjs';
import { claudeHome } from './hosts.mjs';
import { buildSpan, fillSpan, hasSpan, readRules, spanBody } from './render.mjs';
import { RULE_LIMITS, isVague, lintRuleSet, parseRule, ruleSize } from './rule-lint.mjs';

export const RULE_FILE_NAME = 'owner-preferences.md';
export const PROJECT_RULE_PATH = `.claude/rules/${RULE_FILE_NAME}`;
const LOCK_NAME = '.owner-preferences.lock';
const TEXT_MAX = 400;
const HEADING_MAX = 80;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** An instruction line: "- <text> (<YYYY-MM-DD>, <source>)". */
const ENTRY_RE = /^- (.*\S)\s+\((\d{4}-\d{2}-\d{2}), (.+)\)\s*$/;
const SECTION_RE = /^##(?!#)[ \t]+(.*?\S)[ \t]*$/;

export const PROJECT_TITLE = 'Owner Preferences';
export const MACHINE_TITLE = 'Owner Preferences for Every Project';

// The purpose line under the title: one line, which starts with what the file
// is for. plugins/memory/shared/owner-preferences-template.md starts with the
// same title and line (dev/tools/check-skills.mjs compares them), so change
// both together.
const PROJECT_LEAD = 'How the owner wants the agent to work in this project. Follow every line, every session. Each line ends with the date and where the instruction came from. Change this file only with `toolkit rule add` or `toolkit rule update`, after the owner says so.';
const MACHINE_LEAD = 'How the owner wants the agent to work in every project on this computer. Follow every line, every session. Each line ends with the date and where the instruction came from. Change this file only with `toolkit rule add --machine` or `toolkit rule update --machine`, after the owner says so.';

/** The rules folder and file for a scope. opts: { root, env }. */
export function ruleLocation(scope, { root, env = process.env } = {}) {
  if (scope === 'machine') {
    const dir = path.join(claudeHome(env), 'rules');
    return { scope, dir, file: path.join(dir, RULE_FILE_NAME), shown: `${env.CLAUDE_CONFIG_DIR ? '$CLAUDE_CONFIG_DIR' : '~/.claude'}/rules/${RULE_FILE_NAME}` };
  }
  if (!root) throw new ToolkitError(EXIT.ERROR, 'The project folder is needed for a project rule.');
  const dir = path.join(root, '.claude', 'rules');
  return { scope: 'project', dir, file: path.join(dir, RULE_FILE_NAME), shown: PROJECT_RULE_PATH };
}

/** The text of a new rule file for a scope. */
export function newRuleText(scope) {
  return scope === 'machine' ? `# ${MACHINE_TITLE}\n\n${MACHINE_LEAD}\n` : `# ${PROJECT_TITLE}\n\n${PROJECT_LEAD}\n`;
}

/** { lead: [lines before the first "## "], sections: [{ heading, lines }] } (lines without the heading line). */
export function parseRuleDoc(text) {
  const lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n');
  const lead = [];
  const sections = [];
  let fence = false;
  for (const line of lines) {
    if (/^\s{0,3}(`{3,}|~{3,})/.test(line)) fence = !fence;
    const h = !fence && SECTION_RE.exec(line);
    if (h) {
      sections.push({ heading: h[1].trim(), lines: [] });
      continue;
    }
    if (sections.length) sections[sections.length - 1].lines.push(line);
    else lead.push(line);
  }
  return { lead, sections };
}

function trimBlank(lines) {
  let a = 0;
  let b = lines.length;
  while (a < b && !lines[a].trim()) a++;
  while (b > a && !lines[b - 1].trim()) b--;
  return lines.slice(a, b);
}

/** The document as text: the lead, then each section, with one blank line between blocks. */
export function serializeRuleDoc(doc) {
  const parts = [trimBlank(doc.lead).join('\n')];
  for (const s of doc.sections) {
    parts.push(`## ${s.heading}`);
    const body = trimBlank(s.lines);
    if (body.length) parts.push(body.join('\n'));
  }
  return `${parts.filter((p) => p !== '').join('\n\n')}\n`;
}

/** The instructions of one section, numbered from 1: [{ n, text, date, source, line }] (line: index in section.lines). */
export function entriesOf(section) {
  const out = [];
  (section.lines || []).forEach((line, i) => {
    const m = ENTRY_RE.exec(line);
    if (m) out.push({ n: out.length + 1, text: m[1].trim(), date: m[2], source: m[3].trim(), line: i });
    else if (/^- \S/.test(line)) out.push({ n: out.length + 1, text: line.slice(2).trim(), date: null, source: null, line: i });
  });
  return out;
}

/** How headings and instructions are compared: case, spacing, and closing punctuation do not count. */
export function sameWords(a, b) {
  const n = (s) => String(s ?? '').normalize('NFKC').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  return n(a) !== '' && n(a) === n(b);
}

export function findSection(doc, heading) {
  return doc.sections.find((s) => sameWords(s.heading, heading)) || null;
}

/** A section heading given with --section: one line, plain words, at most 80 characters. */
export function assertArea(heading) {
  const h = String(heading ?? '').replace(/\s+/g, ' ').trim().replace(/^#+\s*/, '');
  if (!h) throw new ToolkitError(EXIT.INVALID, "Give the area with --section, for example --section 'Replies'.");
  if (h.length > HEADING_MAX) throw new ToolkitError(EXIT.INVALID, `The section heading is ${h.length} characters; keep it under ${HEADING_MAX}.`);
  return h;
}

/** An instruction given with --text: one line, at most 400 characters, no secret. */
export function assertInstruction(text, secretKind = null) {
  const t = String(text ?? '').replace(/\s+/g, ' ').trim().replace(/^[-*]\s+/, '');
  if (!t) throw new ToolkitError(EXIT.INVALID, "Give the instruction with --text, for example --text 'Lead every status reply with the answer.'");
  if (t.length > TEXT_MAX) throw new ToolkitError(EXIT.INVALID, `The instruction is ${t.length} characters; keep one rule line under ${TEXT_MAX}. Split it into two instructions.`);
  const kind = secretKind ? secretKind(t) : null;
  if (kind) throw new ToolkitError(EXIT.INVALID, `The instruction looks like it holds ${kind}, so it was not saved. Secrets never go in a rule file. Name where the secret is kept instead.`);
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

/** The source given with --source: one line, without parentheses at its ends. */
export function assertSource(source) {
  const s = String(source ?? '').replace(/\s+/g, ' ').trim().replace(/^\(+|\)+$/g, '').trim();
  if (!s) throw new ToolkitError(EXIT.INVALID, "Give where the instruction came from with --source, for example --source 'Mike Rihm in chat'.");
  if (s.length > 160) throw new ToolkitError(EXIT.INVALID, `The source is ${s.length} characters; keep it under 160.`);
  return s;
}

export function entryLine({ text, date, source }) {
  return `- ${text} (${date}, ${source})`;
}

/** Read a scope's rule file: { file, dir, shown, exists, text, doc }. */
export function readRuleDoc(scope, opts = {}) {
  const loc = ruleLocation(scope, opts);
  let text = null;
  try {
    text = fs.readFileSync(loc.file, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') throw new ToolkitError(EXIT.ERROR, `${loc.file} could not be read: ${err.message}`, { path: loc.file });
  }
  return { ...loc, exists: text !== null, text, doc: parseRuleDoc(text === null ? newRuleText(scope) : text) };
}

/** Add one instruction to a section (made when missing). Refuses the same instruction twice in the section. */
export function addEntry(doc, heading, entry) {
  let section = findSection(doc, heading);
  let createdSection = false;
  if (!section) {
    section = { heading, lines: [] };
    doc.sections.push(section);
    createdSection = true;
  }
  const same = entriesOf(section).find((e) => sameWords(e.text, entry.text));
  if (same) {
    throw new ToolkitError(EXIT.INVALID, `The section "${section.heading}" already has this instruction (line ${same.n}${same.date ? `, ${same.date}` : ''}). Nothing was changed.`, {
      section: section.heading,
      entry: same.n,
      fix: `To change it, run toolkit rule update --section ${shellWord(section.heading)} --entry ${same.n} --text '<new words>' --source '<where>'.`,
    });
  }
  const body = trimBlank(section.lines);
  const lastEntry = [...body.keys()].reverse().find((i) => /^- \S/.test(body[i]));
  const line = entryLine(entry);
  if (lastEntry === undefined) body.push(...(body.length ? ['', line] : [line]));
  else body.splice(lastEntry + 1, 0, line);
  section.lines = body;
  return { section: section.heading, n: entriesOf(section).length, createdSection, line };
}

/**
 * Change or remove one instruction of a section, found by its number (entry)
 * or by words it holds (match, which must find exactly one).
 */
export function updateEntry(doc, heading, { entry, match, text, date, source, remove = false }) {
  const section = findSection(doc, heading);
  if (!section) {
    throw new ToolkitError(EXIT.INVALID, `There is no section "${heading}". Sections: ${doc.sections.map((s) => s.heading).join(', ') || 'none'}.`, {
      sections: doc.sections.map((s) => s.heading),
      fix: 'Run toolkit rule list to see the sections and their numbered instructions.',
    });
  }
  const list = entriesOf(section);
  let found = null;
  if (entry !== undefined && entry !== null) {
    const n = Number(entry);
    found = Number.isInteger(n) ? list.find((e) => e.n === n) : null;
    if (!found) throw new ToolkitError(EXIT.INVALID, `The section "${section.heading}" has no instruction ${entry}. It has ${list.length}.`, { fix: 'Run toolkit rule list to see the numbers.' });
  } else if (match) {
    const words = String(match).toLowerCase().replace(/\s+/g, ' ').trim();
    const hits = list.filter((e) => e.text.toLowerCase().replace(/\s+/g, ' ').includes(words));
    if (hits.length !== 1) {
      throw new ToolkitError(EXIT.INVALID, `--match "${match}" found ${hits.length} instructions in "${section.heading}"; it must find one.`, {
        matches: hits.map((e) => ({ n: e.n, text: e.text })),
        fix: 'Give the number with --entry <n> (toolkit rule list shows it).',
      });
    }
    [found] = hits;
  } else {
    throw new ToolkitError(EXIT.INVALID, 'Say which instruction to change: --entry <n> or --match <words>.');
  }
  const previous = section.lines[found.line];
  if (remove) {
    section.lines.splice(found.line, 1);
    if (!entriesOf(section).length && !trimBlank(section.lines).length) doc.sections = doc.sections.filter((s) => s !== section);
    return { section: section.heading, n: found.n, removed: true, previous };
  }
  const line = entryLine({ text, date, source });
  if (list.some((e) => e.n !== found.n && sameWords(e.text, text))) {
    throw new ToolkitError(EXIT.INVALID, `The section "${section.heading}" already has this instruction on another line. Nothing was changed.`);
  }
  section.lines[found.line] = line;
  return { section: section.heading, n: found.n, removed: false, previous, line };
}

function shellWord(s) {
  return /^[A-Za-z0-9_./-]+$/.test(s) ? s : `'${String(s).replace(/'/g, '’')}'`;
}

/**
 * Read a scope's rule file, change it with fn(doc) (which returns a result),
 * write it, and read it back, holding the lock on the rules folder the whole
 * time. A read-back that differs throws "saved but not verified" (exit 1).
 * Returns { ...result, file, shown, created }.
 */
export async function changeRules(scope, opts, fn) {
  const loc = ruleLocation(scope, opts);
  ensureDir(loc.dir);
  return withLock(loc.dir, async () => {
    const read = readRuleDoc(scope, opts);
    const result = await fn(read.doc);
    const text = serializeRuleDoc(read.doc);
    atomicWrite(loc.file, text);
    const back = fs.readFileSync(loc.file, 'utf8');
    if (back !== text) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${loc.file} does not read back as written.`, { path: loc.file });
    }
    return { ...result, file: loc.file, shown: loc.shown, created: !read.exists, text };
  }, { name: LOCK_NAME, waitMs: 8000 });
}

/**
 * Rebuild the rules list in a project's AGENTS.md (between the
 * toolkit:rules markers) from the files in .claude/rules/, so Codex lists a
 * new rule file. Returns { updated, reason }. The installed hash of AGENTS.md
 * leaves the list out, so this never makes the file look changed by hand.
 */
export function refreshAgentsSpan(root) {
  const file = path.join(root, 'AGENTS.md');
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return { updated: false, reason: 'AGENTS.md is missing' };
  }
  if (!hasSpan(text)) return { updated: false, reason: 'AGENTS.md has no toolkit rules list (run toolkit sync)' };
  const want = buildSpan(readRules(root));
  if (spanBody(text) === want) return { updated: false, reason: 'already listed' };
  atomicWrite(file, fillSpan(text, want));
  return { updated: true, reason: null };
}

/**
 * The commit line a command prints after it changed the project rules. why:
 * why the change may be committed ("the owner asked for this change"). On the
 * first rule the AGENTS.md rules list changes too: two files are more than the
 * one-file exception in the project's shared-repository-work.md rule, so the
 * line says so (verifier, 2026-09-29).
 */
export function commitLine(agentsUpdated, why) {
  if (!agentsUpdated) {
    return `Commit ${PROJECT_RULE_PATH} by name: ${why}. It is one changed file, which the one-file exception in shared-repository-work.md allows where you are.`;
  }
  return `Commit ${PROJECT_RULE_PATH} and AGENTS.md by name, in one commit: ${why}. This first rule changed two files (the AGENTS.md rules list now names the rule file, for Codex), which is more than the one-file exception in shared-repository-work.md: in your own worktree, commit them there; in the shared primary checkout, ask the owner before you commit them.`;
}

/** The dated instruction lines of a scope for a listing: [{ section, entries }]. */
export function listRules(scope, opts = {}) {
  const read = readRuleDoc(scope, opts);
  return {
    file: read.file,
    shown: read.shown,
    exists: read.exists,
    sections: read.exists ? read.doc.sections.map((s) => ({ heading: s.heading, entries: entriesOf(s) })) : [],
  };
}

/** True for a YYYY-MM-DD date. */
export function isDate(value) {
  return DATE_RE.test(String(value ?? ''));
}

/**
 * Warnings for a rule file after a change (R17, R19, R23, R24 in
 * dev/research/rules-best-practices.md): the file is over RULE_LIMITS, the
 * new instruction names nothing to check, or it repeats or contradicts
 * another line of this file, of the other scope's file, of the project's
 * other rules, or of the project's AGENTS.md. They never stop the change:
 * the owner's words are kept as he gave them.
 * opts: { shown: this file's name, text: its new text, line: the new or
 * changed instruction line, others: [{ shown, text, owner }] (owner: true for
 * the other scope's owner-preferences.md, whose purpose line is not compared,
 * like this file's) }. Returns [{ kind, message }].
 */
export function ruleChangeWarnings({ shown, text, line = null, others = [] }) {
  const out = [];
  const rule = parseRule(shown, text);
  const size = ruleSize(rule);
  if (size.bytes > RULE_LIMITS.alwaysOnBytes || size.entries > RULE_LIMITS.ownerEntries) {
    out.push({
      kind: 'size',
      message: `${shown} is now ${size.bytes} bytes with ${size.entries} instructions, over the limit of ${RULE_LIMITS.alwaysOnBytes} bytes or ${RULE_LIMITS.ownerEntries} instructions for a rule that loads in every session. Offer the owner a tidy (the memory-tidy skill): merge lines that say the same thing, and move a procedure to a skill.`,
    });
  }
  if (!line) return out;
  const entryText = line.replace(/^- /, '');
  if (isVague(entryText)) {
    out.push({ kind: 'vague', message: `The instruction names nothing that can be checked ("${entryText.replace(/\s*\(\d{4}-\d{2}-\d{2}, [^()]*\)\s*$/, '')}"). Ask the owner for the exact behavior, then change it with toolkit rule update.` });
  }
  const lineNo = text.split('\n').indexOf(line) + 1;
  const given = others.filter((o) => o && o.text);
  const parsed = [rule, ...given.map((o) => parseRule(o.shown, o.text))];
  const owners = [shown, ...given.filter((o) => o.owner).map((o) => o.shown)];
  const findings = lintRuleSet(parsed, { withinFile: [shown], listItemsOnly: owners })
    .filter((f) => (f.rule === shown && f.line === lineNo) || (f.other && f.other.rule === shown && f.other.line === lineNo));
  for (const f of findings) out.push({ kind: f.check, message: `${f.message} ${f.fix}` });
  return out;
}

/** The meaning words of a section heading, singular: "Reply style" -> ["reply", "style"]. */
function headingWords(heading) {
  const stop = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'for', 'to', 'in', 'on', 'with', 'about', 'general']);
  return String(heading ?? '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/)
    .filter((w) => w && !stop.has(w))
    .map((w) => w.replace(/ies$/, 'y').replace(/ing$/, '').replace(/(?<=[^s])s$/, ''))
    .filter((w) => w.length >= 3);
}

/**
 * The other sections whose headings share a word with this one ("Reply
 * style" and "Replies"), so a new area does not split one that exists
 * (dev/research/rules-best-practices.md, 2.5 finding 6).
 */
export function similarSections(doc, heading) {
  const mine = new Set(headingWords(heading));
  if (!mine.size) return [];
  return doc.sections
    .filter((s) => !sameWords(s.heading, heading))
    .filter((s) => headingWords(s.heading).some((w) => mine.has(w)))
    .map((s) => s.heading);
}

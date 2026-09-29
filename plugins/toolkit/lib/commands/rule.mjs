// toolkit rule add | update | list: the owner's standing instructions, kept as
// rules (Mike, 2026-09-29, dev/GOAL.md "Rules, skills, and memory each hold
// one kind of thing"). lib/project/owner-rules.mjs holds the file format.
//
// A project rule goes in .claude/rules/owner-preferences.md, one "## " section
// per area, each instruction dated with its source; the AGENTS.md rules list
// is rebuilt so Codex reads the file too. --machine writes the same file in
// the Claude Code user rules folder (~/.claude/rules/) for every project; the
// hosts ask the owner before it runs (ASK_FIRST_COMMANDS in lib/cli.mjs), so
// --machine must come right after "add" or "update".
//
// The owner's own words are the approval. When the hooks recorded that his
// message this turn has no keep phrase, no other words asking for a save, and
// does not answer a question about memory or rules (lib/hooks/turn-facts.mjs),
// a project `rule add` saves a rule proposal in memory instead (toolkit memory
// approve turns it into the rule on his yes), and `rule update` is refused.

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { requireProject } from '../core/config.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { todayFor } from '../project/manifest.mjs';
import { readRules } from '../project/render.mjs';
import {
  PROJECT_RULE_PATH, RULE_FILE_NAME, addEntry, assertArea, assertInstruction, assertSource, changeRules, commitLine, entriesOf, findSection, isDate, listRules, parseRuleDoc,
  readRuleDoc, refreshAgentsSpan, ruleChangeWarnings, ruleLocation, similarSections, updateEntry,
} from '../project/owner-rules.mjs';
import { secretKind } from '../memory/contract.mjs';
import { readTurnFacts, passingRemark } from '../hooks/turn-facts.mjs';

export const summary = "The owner's standing instructions: add, change, or list the rules in .claude/rules/owner-preferences.md (--machine: every project).";

const USAGE = `Usage:
  toolkit rule add [--machine] --section <area> --text <instruction> --source <who said it, where> [--date <YYYY-MM-DD>]
  toolkit rule update [--machine] --section <area> (--entry <n> | --match <words>)
                      (--text <instruction> --source <who said it, where> | --remove)
  toolkit rule list [--machine | --project]

An instruction the owner gives for how the agent works ("from now on", "always",
"never", a preference, a correction) is a rule, not memory. add writes it as one
line in its area's "## " section of .claude/rules/owner-preferences.md (made on
first use), ending with the date and its source; the AGENTS.md rules list is
rebuilt so Codex reads the file. The output's Commit line says what to commit, and where.
After an add it prints the file's sections and the lines of the section it wrote.
A warning (the change is still made) says when the file is over 4 KB or 50
instructions, the line names nothing to check, it repeats or contradicts a line
of either owner-preferences.md, another project rule, or AGENTS.md, or a new
section's heading shares a word with one that exists.
--machine writes ~/.claude/rules/owner-preferences.md (or $CLAUDE_CONFIG_DIR/rules/)
for every project on this computer. Claude Code and Codex ask the owner before
it runs, and only when --machine comes right after "add" or "update".
update changes (or, with --remove, takes out) one instruction, found by its number
in the section (--entry; toolkit rule list shows it) or by words it holds (--match).
The owner's words are the approval: when the hooks recorded no keep phrase and no
other save words in his message this turn, and no answer to a question about
memory or rules, a project add is saved as a rule proposal in memory instead
(his yes: toolkit memory approve <key> --by <name>), and update is refused.
Every change holds a lock on the rules folder and is read back.
Exit codes: 0 ok, 1 error, 2 refused (a rule of this command), 4 not a toolkit project.`;

export function help() {
  return USAGE;
}

const SPEC = {
  string: ['section', 'text', 'source', 'date', 'entry', 'match', 'host'],
  boolean: ['machine', 'project', 'remove', 'json'],
};

function one(flags, name) {
  const v = flags[name];
  if (Array.isArray(v)) throw new ToolkitError(EXIT.INVALID, `--${name} was given more than once.`);
  if (v === true) throw new ToolkitError(EXIT.INVALID, `--${name} needs a value.`);
  return v === undefined || v === null ? undefined : String(v);
}

function quote(s) {
  return `'${String(s).replace(/'/g, '’')}'`;
}

/** --machine anywhere but right after the command word is refused: the hosts ask the owner only for that form. */
function machinePlacement(sub, rest) {
  const at = rest.indexOf('--machine');
  if (at > 0) {
    throw new ToolkitError(EXIT.INVALID, `toolkit rule ${sub} was not run: --machine must come right after "${sub}" (toolkit rule ${sub} --machine ...). Claude Code and Codex ask the owner before a change for every project only in that form.`, {
      fix: `Run it as toolkit rule ${sub} --machine --section '<area>' ...`,
    });
  }
  return at === 0;
}

export async function run(argv, ctx) {
  const [sub, ...rest] = argv;
  if (!sub || sub === 'help') {
    out(ctx, USAGE, { ok: true, usage: USAGE });
    return EXIT.OK;
  }
  if (!['add', 'update', 'list'].includes(sub)) {
    throw new ToolkitError(EXIT.INVALID, `Unknown rule command "${sub}". Commands: add, update, list.`, { fix: 'Run toolkit help rule.' });
  }
  const machine = sub === 'list' ? rest.includes('--machine') : machinePlacement(sub, rest);
  const { _, flags } = parseArgs(rest, SPEC);
  if (_.length) throw new ToolkitError(EXIT.INVALID, `toolkit rule ${sub} takes no words outside flags (got "${_.join(' ')}"). Put the instruction in --text.`);
  // --machine=true, or --machine in another place: the hosts' ask-first rules would not match it.
  if (sub !== 'list' && flags.machine !== undefined && !machine) {
    throw new ToolkitError(EXIT.INVALID, `toolkit rule ${sub} was not run: write --machine alone, right after "${sub}" (toolkit rule ${sub} --machine ...).`);
  }
  if (sub === 'list') return list(ctx, flags);
  const project = machine ? tryProject(ctx.cwd) : requireProject(ctx.cwd);
  const scope = machine ? 'machine' : 'project';
  const opts = { root: project ? project.root : null, env: ctx.env };
  const section = assertArea(one(flags, 'section'));
  const date = one(flags, 'date') ?? todayFor(ctx.env);
  if (!isDate(date)) throw new ToolkitError(EXIT.INVALID, `--date ${date} is not a date. Write it as YYYY-MM-DD.`);
  const facts = project ? readTurnFacts(project, ctx.env) : null;
  const remark = !machine && passingRemark(facts);
  if (sub === 'add') {
    const text = assertInstruction(one(flags, 'text'), secretKind);
    const source = assertSource(one(flags, 'source'));
    if (remark) return proposeInstead(ctx, project, { section, text, source });
    const res = await changeRules(scope, opts, (doc) => addEntry(doc, section, { text, date, source }));
    const span = scope === 'project' ? refreshAgentsSpan(project.root) : { updated: false };
    const where = scope === 'project' ? PROJECT_RULE_PATH : res.file;
    const lines = [
      `Added to ${where}${res.created ? ' (new file)' : ''}, section "${res.section}"${res.createdSection ? ' (new section)' : ''}, as instruction ${res.n}: ${text}`,
    ];
    if (scope === 'project') {
      lines.push(span.updated ? 'The AGENTS.md rules list now names the file, so Codex reads it too.' : `AGENTS.md: ${span.reason}.`);
      lines.push(commitLine(span.updated, 'the owner asked for this change himself'));
    } else {
      lines.push('Claude Code loads it in every project at session start; Codex reads it only in Toolkit V2 projects, through the session briefing.');
    }
    lines.push('Other open sessions see it after their next start or compaction.');
    lines.push(`Undo: toolkit rule update${machine ? ' --machine' : ''} --section ${quote(res.section)} --entry ${res.n} --remove`);
    const others = comparedFiles(scope, opts);
    const context = contextLines(scope, res, others);
    lines.push(...context.lines);
    const warnings = changeWarnings(scope, opts, res, res.line, others);
    for (const w of warnings) lines.push(`Warning: ${w.message}`);
    const reply = `Added to ${scope === 'project' ? 'the project rules' : 'your rules for every project'}: ${text} Say 'undo that' to take it out.`;
    lines.push(`Reply line for the owner, word for word (memory-save): ${reply}`);
    out(ctx, lines, {
      ok: true, action: 'rule-add', scope, file: res.file, section: res.section, entry: res.n, text, date, source,
      created: res.created, createdSection: res.createdSection, agentsUpdated: span.updated, replyLine: reply, warnings,
      sections: context.sections, sectionEntries: context.sectionEntries, otherSections: context.otherSections,
    });
    return EXIT.OK;
  }
  // update
  if (remark) {
    throw new ToolkitError(EXIT.INVALID, 'The rule was not changed: the owner\'s message this turn does not ask for it (the hooks recorded no keep phrase, no other save words, and no answer to a question about memory or rules). Ask him first, then run this command in the turn he answers.', {
      fix: 'Ask the owner: "Change the project rule to: <new words>?"',
    });
  }
  const remove = flags.remove === true;
  const entry = one(flags, 'entry');
  const match = one(flags, 'match');
  let text;
  let source;
  if (!remove) {
    text = assertInstruction(one(flags, 'text'), secretKind);
    source = assertSource(one(flags, 'source'));
  } else if (flags.text !== undefined) {
    throw new ToolkitError(EXIT.INVALID, '--remove takes no --text.');
  }
  const loc = ruleLocation(scope, opts);
  const res = await changeRules(scope, opts, (doc) => updateEntry(doc, section, { entry, match, text, date, source, remove }));
  const span = scope === 'project' ? refreshAgentsSpan(project.root) : { updated: false };
  const where = scope === 'project' ? PROJECT_RULE_PATH : loc.file;
  const lines = [remove
    ? `Removed instruction ${res.n} from ${where}, section "${res.section}". It said: ${res.previous.replace(/^- /, '')}`
    : `Changed instruction ${res.n} in ${where}, section "${res.section}", to: ${text}`];
  lines.push(`Before: ${res.previous}`);
  const warnings = changeWarnings(scope, opts, res, remove ? null : res.line, remove ? [] : comparedFiles(scope, opts));
  for (const w of warnings) lines.push(`Warning: ${w.message}`);
  if (scope === 'project') lines.push(commitLine(span.updated, 'the owner asked for this change'));
  out(ctx, lines, { ok: true, action: remove ? 'rule-remove' : 'rule-update', scope, file: res.file, section: res.section, entry: res.n, previous: res.previous, text: text ?? null, agentsUpdated: span.updated, warnings });
  return EXIT.OK;
}

/**
 * The files a changed instruction is compared with (audit 2.5 finding 1 in
 * dev/research/rules-best-practices.md): the other scope's
 * owner-preferences.md, and in a project its other .claude/rules/*.md files
 * and its AGENTS.md, which also load in every session.
 */
function comparedFiles(scope, opts) {
  const others = [];
  const other = scope === 'project' ? 'machine' : 'project';
  if (other === 'machine' || opts.root) {
    try {
      const doc = readRuleDoc(other, opts);
      if (doc.exists) others.push({ shown: other === 'project' ? PROJECT_RULE_PATH : doc.shown, text: doc.text, owner: true, doc: doc.doc });
    } catch {
      // The other file cannot be read: its own commands report that.
    }
  }
  if (opts.root) {
    for (const r of readRules(opts.root)) {
      if (r.name !== RULE_FILE_NAME) others.push({ shown: `.claude/rules/${r.name}`, text: r.text });
    }
    try {
      others.push({ shown: 'AGENTS.md', text: fs.readFileSync(path.join(opts.root, 'AGENTS.md'), 'utf8') });
    } catch {
      // No AGENTS.md: nothing to compare.
    }
  }
  return others;
}

/**
 * The warnings after a change (lib/project/owner-rules.mjs,
 * ruleChangeWarnings): the file is over the size limit for a rule that loads
 * in every session, the instruction names nothing to check, or it repeats or
 * contradicts a line of this file, of the other scope's file, of another
 * project rule, or of AGENTS.md. After an add that made a new section, also
 * a warning when an existing section's heading shares a word with it.
 */
function changeWarnings(scope, opts, res, line, others) {
  const shown = scope === 'project' ? PROJECT_RULE_PATH : res.shown;
  const out = [];
  try {
    out.push(...ruleChangeWarnings({ shown, text: res.text, line, others }));
  } catch {
    // The file was written and read back; a failed comparison only loses warnings.
  }
  if (res.createdSection) {
    const close = similarSections(parseRuleDoc(res.text), res.section);
    if (close.length) {
      out.push({
        kind: 'section',
        message: `The new section "${res.section}" shares a word with ${close.map((h) => `"${h}"`).join(', ')}. If it is the same area, move the line there: toolkit rule update${scope === 'machine' ? ' --machine' : ''} --section ${quote(res.section)} --entry ${res.n} --remove, then toolkit rule add${scope === 'machine' ? ' --machine' : ''} --section ${quote(close[0])} with the same --text and --source.`,
      });
    }
  }
  return out;
}

/**
 * What the file holds after an add, so the agent can compare the new line
 * with the lines already there, including ones that say the same or the
 * opposite in other words (audit 2.5 findings 1 and 6).
 */
function contextLines(scope, res, others) {
  const doc = parseRuleDoc(res.text);
  const where = scope === 'project' ? PROJECT_RULE_PATH : res.shown;
  const sections = doc.sections.map((s) => ({ heading: s.heading, entries: entriesOf(s).length }));
  const section = findSection(doc, res.section);
  const sectionEntries = section ? entriesOf(section).map((e) => ({ n: e.n, text: e.text })) : [];
  const other = others.find((o) => o.owner);
  const otherSections = other ? { file: other.shown, sections: other.doc.sections.map((s) => s.heading) } : null;
  const lines = [`Sections in ${where}: ${sections.map((s) => `${s.heading} (${s.entries})`).join(', ')}.`];
  if (otherSections) lines.push(`Sections in ${otherSections.file}: ${otherSections.sections.join(', ') || 'none'}.`);
  lines.push(`Instructions in "${res.section}" now:`);
  for (const e of sectionEntries) lines.push(`  ${e.n}. ${e.text}`);
  lines.push('Compare the new line with these lines and with the other rules this session has loaded. If one already says it, change that line with toolkit rule update and remove the new one. If one says the opposite, ask the owner which one holds.');
  return { lines, sections, sectionEntries, otherSections };
}

function tryProject(cwd) {
  try {
    return requireProject(cwd);
  } catch {
    return null;
  }
}

async function list(ctx, flags) {
  const project = tryProject(ctx.cwd);
  const scopes = flags.machine === true ? ['machine'] : flags.project === true || !project ? (project ? ['project'] : ['machine']) : ['project', 'machine'];
  const lines = [];
  const data = {};
  for (const scope of scopes) {
    const r = listRules(scope, { root: project ? project.root : null, env: ctx.env });
    data[scope] = r;
    const name = scope === 'project' ? PROJECT_RULE_PATH : r.file;
    if (!r.exists) {
      lines.push(`${name}: none yet.`);
      continue;
    }
    lines.push(`${name}:`);
    if (!r.sections.length) lines.push('  (no sections)');
    for (const s of r.sections) {
      lines.push(`  ## ${s.heading}`);
      for (const e of s.entries) lines.push(`    ${e.n}. ${e.text}${e.date ? ` (${e.date}, ${e.source})` : ''}`);
      if (!s.entries.length) lines.push('    (no instructions)');
    }
  }
  out(ctx, lines, { ok: true, action: 'rule-list', ...data });
  return EXIT.OK;
}

/**
 * A project rule add in a turn whose message holds no request to keep
 * anything: saved as a rule proposal (toolkit memory save --proposal
 * --rule-section), through the same command the Stop hook uses.
 */
async function proposeInstead(ctx, project, { section, text, source }) {
  const { main } = await import('../cli.mjs');
  const { proposalName } = await import('../hooks/proposal.mjs');
  let stdout = '';
  let stderr = '';
  const sink = (fn) => ({ write: (s) => { fn(String(s)); return true; } });
  const date = todayFor(ctx.env);
  const body = [
    `# ${text.replace(/[.!?]$/, '')}`,
    '',
    `**Remember:** ${text}`,
    '',
    `**How to apply:** Not a rule until the owner approves it.`,
    '',
    `**Evidence and limits:** On ${date} the agent ran toolkit rule add for this (source given: ${source}), but the owner's message that turn held no request to keep anything, so the toolkit saved it as a rule proposal.`,
    '',
  ].join('\n');
  const args = ['memory', 'save', '--type', 'user', '--name', `rule-${proposalName(text, 'user')}`.slice(0, 60).replace(/-+$/, ''), '--description', text.length > 150 ? `${text.slice(0, 147)}...` : text,
    '--body', body, '--source', source, '--rule-section', section, '--proposal', '--json'];
  const code = await main(args, { cwd: ctx.cwd, env: ctx.env, stdout: sink((x) => { stdout += x; }), stderr: sink((x) => { stderr += x; }), stdin: '' });
  let json = null;
  try {
    json = JSON.parse(stdout);
  } catch {
    json = null;
  }
  if (code !== 0 || !json || !json.key) {
    const why = (json && json.error && json.error.message) || stderr.replace(/^Error:\s*/, '').split('\n')[0] || `exit ${code}`;
    throw new ToolkitError(code === 2 ? EXIT.INVALID : EXIT.ERROR, `The rule was not added, and it could not be saved as a rule proposal either: ${why}`, {
      fix: 'Ask the owner: "Add to the project rules: <instruction>?"',
    });
  }
  const lines = [
    `Not added to ${PROJECT_RULE_PATH}: the hooks recorded no keep phrase, no other save words, and no answer to a question about memory or rules in the owner's message this turn, so it was saved as a rule proposal in memory: ${json.key}.`,
    `Ask him: "Add to the project rules: ${text.replace(/[.!?]$/, '')}?" His yes: toolkit memory approve ${json.key} --by <name>. His no: toolkit memory reject ${json.key}.`,
  ];
  out(ctx, lines, { ok: true, action: 'rule-proposal', proposal: true, key: json.key, section, text, source });
  return EXIT.OK;
}

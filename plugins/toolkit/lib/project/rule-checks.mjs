// The toolkit doctor check of a project's rule files (Mike, 2026-09-29,
// dev/GOAL.md "Rules follow Claude Code best practices": a checker enforces
// the format). The same checks as dev/tools/check-rules.mjs, from
// lib/project/rule-lint.mjs, run over the project's .claude/rules/*.md and
// the owner-preferences.md for every project (~/.claude/rules/), which also
// loads in every session.
//
// ruleFindings(project, { env }) -> [{ id, area: 'rules', severity, message, fix }]
//
// Severity. A warning (doctor exits 1) only where Claude Code does something
// the owner did not mean: frontmatter it cannot read, so the rule loads
// everywhere; a paths pattern that can never match; two lines with nearly the
// same words where one says never. Everything else is a note: an always-on
// rule over the size limit (owner-preferences.md included), a repeated line,
// a line that forbids a command another line names (a possible
// contradiction, lintRuleSet), a missing heading or instruction, a procedure
// that belongs in a skill, and a pattern that matches no file in the project
// yet. The wording checks (lintText) are for the model only
// (dev/tools/check-rules.mjs): a project gets the model's text as it is.

import fs from 'node:fs';
import path from 'node:path';
import { readRules } from './render.mjs';
import { RULE_FILE_NAME, readRuleDoc } from './owner-rules.mjs';
import { FOLDERS_MADE_LATER, firstFolder, globMatches, globProblems, lintRule, lintRuleSet, parseRule } from './rule-lint.mjs';

const SKIP_DIRS = new Set(['.git', 'node_modules', '__pycache__', '.sfdx', '.sf', '.venv', 'venv', 'dist', 'build', 'out']);
const MAX_FILES = 20000;

const IDS = {
  frontmatter: 'rule-frontmatter',
  glob: 'rule-glob',
  heading: 'rule-heading',
  instruction: 'rule-instruction',
  procedure: 'rule-procedure',
  size: 'rule-size',
  conflict: 'rule-conflict',
  duplicate: 'rule-duplicate',
};
const WARN = new Set(['frontmatter', 'glob', 'conflict']);

/** Project-relative paths of the project's files, at most MAX_FILES. */
function projectFiles(root) {
  const out = [];
  const visit = (dir, rel) => {
    if (out.length >= MAX_FILES) return;
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (out.length >= MAX_FILES) return;
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name)) visit(path.join(dir, e.name), r);
      } else if (e.isFile()) out.push(r);
    }
  };
  visit(root, '');
  return out;
}

export function ruleFindings(project, { env = process.env } = {}) {
  const findings = [];
  const shownName = (name) => `.claude/rules/${name}`;
  const rules = readRules(project.root).map((r) => parseRule(shownName(r.name), r.text));
  let machine = null;
  try {
    const doc = readRuleDoc('machine', { env });
    if (doc.exists) machine = parseRule(doc.shown, doc.text);
  } catch {
    machine = null;
  }
  const push = (x) => {
    const severity = x.severity === 'error' && WARN.has(x.check) ? 'warning' : 'note';
    findings.push({ id: IDS[x.check] || `rule-${x.check}`, area: 'rules', severity, message: `${x.rule}${x.line ? `, line ${x.line}` : ''}: ${x.message}`, fix: x.fix });
  };
  for (const rule of rules) for (const x of lintRule(rule, { ownerFile: rule.name === shownName(RULE_FILE_NAME) })) push(x);
  if (machine) for (const x of lintRule(machine, { ownerFile: true })) push(x);

  // A pattern that matches no file yet: a note, since the project may create the files later.
  let files = null;
  for (const rule of rules) {
    for (const p of rule.paths || []) {
      if (globProblems(p)) continue;
      const folder = firstFolder(p);
      if (folder && FOLDERS_MADE_LATER[folder]) continue;
      if (!files) files = projectFiles(project.root);
      if (files.length >= MAX_FILES || files.some((f) => globMatches(p, f))) continue;
      findings.push({
        id: 'rule-glob-unmatched', area: 'rules', severity: 'note',
        message: `${rule.name}: the paths pattern "${p}" matches no file in the project yet, so Claude Code never loads this rule.`,
        fix: 'Check the pattern for a typo. Patterns are relative to the project root; "**/" matches any folder depth.',
      });
    }
  }

  // Repeated or contradicting lines: across the project rules, and within and
  // against the owner's rule files. The owner's files are compared by their
  // instruction lines only: the purpose line under each title is the
  // toolkit's fixed text (PROJECT_LEAD and MACHINE_LEAD in owner-rules.mjs),
  // nearly the same in both files, and not the owner's to change.
  // A finding between an owner file and a model rule is shown on the owner
  // file: the owner's line is the one to ask him about, and the model rule is
  // not changed to fit it.
  const owners = [shownName(RULE_FILE_NAME), ...(machine ? [machine.name] : [])];
  for (const x of lintRuleSet(machine ? [...rules, machine] : rules, { withinFile: owners, listItemsOnly: owners })) {
    const onOwner = x.other && owners.includes(x.other.rule) && !owners.includes(x.rule);
    push(onOwner ? { ...x, rule: x.other.rule, line: x.other.line, other: { rule: x.rule, line: x.line } } : x);
  }
  return findings;
}

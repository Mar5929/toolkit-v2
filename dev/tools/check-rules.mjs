// Checks the model's rule files against Claude Code's guidance for rules
// (Mike, 2026-09-29: "Make sure the rules are written using Claude Code best
// practices"; dev/GOAL.md, "Rules follow Claude Code best practices": a
// checker enforces the format). The checklist and its sources:
// dev/research/rules-best-practices.md, Part 1.
//
//   node dev/tools/check-rules.mjs                 check plugins/toolkit/scaffold/model/.claude/rules/
//   node dev/tools/check-rules.mjs --dir <folder>  check another project folder (for example the model
//                                                  branch folder before an import)
//
// It fails (exit 1) when a rule:
//   - has frontmatter that does not parse, holds a field other than `paths`,
//     or has an invalid `paths` pattern (an unclosed "[" or "{", a leading
//     "/", more than 1,000 patterns after brace expansion);
//   - has a `paths` pattern that matches no file in the folder, unless the
//     pattern is under a folder a project creates later (FOLDERS_MADE_LATER in
//     plugins/toolkit/lib/project/rule-lint.mjs);
//   - does not start with a "# " heading, or has no instruction, or only vague
//     ones ("properly", "as needed") that name nothing to check;
//   - holds a numbered procedure of 5 or more steps (move it to a skill);
//   - loads in every session (no `paths`) and is over 200 lines;
//   - repeats an instruction in another rule, or says never where another
//     rule says do in nearly the same words.
// It also fails when the AGENTS.md rules list is not the one the toolkit
// builds from the rule files, and when the owner-preferences.md format that
// `toolkit rule add` writes would itself fail these checks.
//
// It warns, and does not fail, when a rule:
//   - loads in every session and is over 4,096 bytes. The number is a
//     proposal waiting for Mike's yes (dev/model-changes.md, "Rules best
//     practices: needs your yes", item 11). Never cut Mike's words to meet it;
//     a change to his words needs his yes;
//   - has a list item or paragraph over 400 characters, or a paragraph over
//     three lines, or emphasis ("IMPORTANT", "NEVER" in capitals, bold)
//     (dev/research/rules-best-practices.md, 2.8);
//   - names a skill ("the `x` skill") that no V2 plugin and no project skill
//     in the folder holds, unless it says what to do when that skill "is not
//     installed";
//   - forbids a command in a code span ("Never `git add -A`") that another
//     rule names without a never: a possible contradiction for a person to
//     read.
// Not checked: that every file path a rule names exists. Most are files a
// project or a tool makes later (`tools/kb/out/`, `.claude/rules/owner-preferences.md`,
// `delivery/data/...`), so the check would need a hand-kept list of them.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FOLDERS_MADE_LATER, RULE_LIMITS, firstFolder, globMatches, globProblems, lintRule, lintRuleSet, lintText, namedSkills, parseRule, ruleSize,
} from '../../plugins/toolkit/lib/project/rule-lint.mjs';
import { buildSpan, hasSpan, readRules, spanBody } from '../../plugins/toolkit/lib/project/render.mjs';
import { addEntry, newRuleText, parseRuleDoc, serializeRuleDoc, RULE_FILE_NAME } from '../../plugins/toolkit/lib/project/owner-rules.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const DEFAULT_DIR = path.join(REPO, 'plugins', 'toolkit', 'scaffold', 'model');

const SKIP_DIRS = new Set(['.git', 'node_modules', '__pycache__', '.sfdx', '.sf']);

function parseArgs(argv) {
  const out = { dir: DEFAULT_DIR };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dir') {
      out.dir = argv[i + 1];
      i += 1;
      if (!out.dir) fail('--dir needs a folder.');
    } else if (a.startsWith('--dir=')) out.dir = a.slice('--dir='.length);
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node dev/tools/check-rules.mjs [--dir <project folder>]');
      process.exit(0);
    } else fail(`Unknown option ${a}.`);
  }
  out.dir = path.resolve(out.dir);
  return out;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

/** Every file under a folder, as relative paths with "/". */
function listFiles(root) {
  const out = [];
  const visit = (dir, rel) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory() && SKIP_DIRS.has(e.name)) continue;
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) visit(path.join(dir, e.name), r);
      else if (e.isFile()) out.push(r);
    }
  };
  visit(root, '');
  return out.filter((f) => f !== '.import.json');
}

/** The skill names a rule may name: every V2 plugin's skills and the folder's own project skills. */
function knownSkills(dir) {
  const names = new Set();
  const add = (parent) => {
    try {
      for (const e of fs.readdirSync(parent, { withFileTypes: true })) if (e.isDirectory()) names.add(e.name);
    } catch {
      // No such folder.
    }
  };
  const plugins = path.join(REPO, 'plugins');
  for (const p of fs.readdirSync(plugins, { withFileTypes: true })) if (p.isDirectory()) add(path.join(plugins, p.name, 'skills'));
  add(path.join(dir, '.claude', 'skills'));
  add(path.join(dir, '.agents', 'skills'));
  return names;
}

/** A folder as a path inside this repository, or in full when it is outside. */
function shown(dir) {
  const rel = path.relative(REPO, dir);
  return rel && !rel.startsWith('..') ? rel : dir;
}

function main() {
  const { dir } = parseArgs(process.argv.slice(2));
  const rulesDir = path.join(dir, '.claude', 'rules');
  if (!fs.existsSync(rulesDir)) fail(`${rulesDir} does not exist.`);
  const files = listFiles(dir);
  const raw = readRules(dir);
  if (!raw.length) fail(`${rulesDir} holds no rule files.`);
  const rules = raw.map((r) => parseRule(r.name, r.text));
  const findings = [];

  const skills = knownSkills(dir);
  for (const rule of rules) {
    findings.push(...lintRule(rule, { ownerFile: rule.name === RULE_FILE_NAME }));
    findings.push(...lintText(rule));
    for (const s of namedSkills(rule)) {
      // A skill the project may not have is fine when the rule says what to do without it ("when `humanizer` is not installed").
      if (skills.has(s.name) || rule.text.includes(`\`${s.name}\` is not installed`)) continue;
      findings.push({ rule: rule.name, line: s.line, check: 'skill', severity: 'warning', message: `The rule names the \`${s.name}\` skill, which no V2 plugin and no project skill in ${shown(dir)} holds, and does not say what to do when it is not installed.`, fix: 'Name a skill that exists, or add what to do when it is not installed.' });
    }
    // A pattern must match a file the project has, or name a folder it makes later.
    for (const p of rule.paths || []) {
      if (globProblems(p) || files.some((f) => globMatches(p, f))) continue;
      const folder = firstFolder(p);
      if (folder && FOLDERS_MADE_LATER[folder]) continue;
      findings.push({ rule: rule.name, line: 1, check: 'glob', severity: 'error', message: `The paths pattern "${p}" matches no file in ${shown(dir)}, so the rule never loads.`, fix: `Fix the pattern, or add its folder to FOLDERS_MADE_LATER in plugins/toolkit/lib/project/rule-lint.mjs with the reason a project creates it later.` });
    }
  }
  findings.push(...lintRuleSet(rules, { listItemsOnly: [RULE_FILE_NAME] }));

  // The AGENTS.md rules list is the toolkit's own (R26).
  const agentsFile = path.join(dir, 'AGENTS.md');
  if (fs.existsSync(agentsFile)) {
    const agents = fs.readFileSync(agentsFile, 'utf8');
    if (hasSpan(agents) && spanBody(agents) !== buildSpan(raw)) {
      findings.push({ rule: 'AGENTS.md', line: null, check: 'rules-list', severity: 'error', message: 'The rules list in AGENTS.md is not the list the toolkit builds from the rule files (a heading, a paths list, or a file changed).', fix: 'Rebuild the list between the toolkit:rules markers with buildSpan(readRules(<folder>)) from plugins/toolkit/lib/project/render.mjs, in the model, then import again.' });
    }
  }

  // The owner-preferences.md format `toolkit rule add` writes passes the same checks.
  const sample = parseRuleDoc(newRuleText('project'));
  addEntry(sample, 'Replies', { text: 'Lead every status reply with the answer.', date: '2026-09-29', source: 'check-rules sample' });
  addEntry(sample, 'Testing', { text: 'Run `npm test` before you say a change works.', date: '2026-09-29', source: 'check-rules sample' });
  const sampleRule = parseRule(RULE_FILE_NAME, serializeRuleDoc(sample));
  for (const x of [...lintRule(sampleRule, { ownerFile: true }), ...lintText(sampleRule)]) {
    findings.push({ ...x, rule: `${RULE_FILE_NAME} (the format toolkit rule add writes)` });
  }

  const errors = findings.filter((x) => x.severity === 'error');
  const warnings = findings.filter((x) => x.severity !== 'error');
  const always = rules.filter((r) => !r.scoped);
  const alwaysBytes = always.reduce((n, r) => n + ruleSize(r).bytes, 0);
  const largest = [...always].sort((a, b) => ruleSize(b).bytes - ruleSize(a).bytes)[0];
  console.log(`check-rules: ${rules.length} rules in ${shown(rulesDir)}: ${always.length} always on (${alwaysBytes} bytes in all; largest ${largest ? `${largest.name}, ${ruleSize(largest).bytes} bytes` : 'none'}; proposed limit ${RULE_LIMITS.alwaysOnBytes} bytes each, a warning until Mike says yes), ${rules.length - always.length} path-scoped.`);
  for (const x of [...errors, ...warnings]) {
    console.log(`${x.severity === 'error' ? 'Error' : 'Warning'}: ${x.rule}${x.line ? `, line ${x.line}` : ''}: ${x.message}${x.fix ? ` Fix: ${x.fix}` : ''}`);
  }
  if (errors.length) {
    console.log(`check-rules: ${errors.length} error${errors.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`);
    process.exit(1);
  }
  console.log(`check-rules: passed${warnings.length ? ` with ${warnings.length} warning${warnings.length === 1 ? '' : 's'}` : ''}.`);
  if (warnings.length) console.log('Warnings do not fail the run. A fix that changes what a model rule means, or rewrites wording Mike approved (session-handoff.md is his), waits for his yes; the open questions are in dev/model-changes.md, "Rules best practices: needs your yes".');
}

main();

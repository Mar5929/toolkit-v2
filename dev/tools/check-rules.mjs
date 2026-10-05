// Checks the model's rule files (the rules in the setup folders under
// plugins/toolkit/skills/project-setup/assets/) against Claude Code's guidance for rules
// (Mike, 2026-09-29: "Make sure the rules are written using Claude Code best
// practices"; dev/GOAL.md, "Rules follow Claude Code best practices": a
// checker enforces the format). The checklist and its sources:
// dev/research/rules-best-practices.md, Part 1.
//
//   node dev/tools/check-rules.mjs                 check the rules of every setup folder, put together
//                                                  in a scratch folder as one project that has every choice
//   node dev/tools/check-rules.mjs --dir <folder>  check another project folder (for example a set-up project)
//
// It fails (exit 1) when a rule:
//   - has frontmatter that does not parse, holds a field other than `paths`,
//     or has an invalid `paths` pattern (an unclosed "[" or "{", a leading
//     "/", more than 1,000 patterns after brace expansion);
//   - has a `paths` pattern that matches no file in the folder, unless the
//     pattern is under a folder a project creates later (FOLDERS_MADE_LATER in
//     dev/tools/rule-lint.mjs);
//   - does not start with a "# " heading, or has no instruction, or only vague
//     ones ("properly", "as needed") that name nothing to check;
//   - holds a numbered procedure of 5 or more steps (move it to a skill);
//   - loads in every session (no `paths`) and is over 200 lines;
//   - repeats an instruction in another rule, or says never where another
//     rule says do in nearly the same words.
// It also fails when the AGENTS.md rules list is not the one the rule files
// give, and when the owner-preferences.md template that project-setup copies
// into a project (assets/owner-preferences.md) would itself fail these checks.
//
// It warns, and does not fail, when a rule:
//   - loads in every session and is over 4,096 bytes. The number is a
//     proposal waiting for Mike's yes (dev/model-changes.md, "Rules best
//     practices: needs your yes", item 11). Never cut Mike's words to meet it;
//     a change to his words needs his yes;
//   - has a list item or paragraph over 400 characters, or a paragraph over
//     three lines, or emphasis ("IMPORTANT", "NEVER" in capitals, bold)
//     (dev/research/rules-best-practices.md, 2.8);
//   - names a skill ("the `x` skill") that project-setup does not ship and no
//     project skill in the folder holds, unless it says what to do when that skill "is not
//     installed";
//   - forbids a command in a code span ("Never `git add -A`") that another
//     rule names without a never: a possible contradiction for a person to
//     read.
// It also prints, as information and never as a warning, how many bytes load in every
// session in three setups (the rules without `paths` plus AGENTS.md, with the setup markers
// resolved and the rules each setup leaves out removed). No ceiling for that total is set:
// it waits for Mike's answer (dev/reviews/best-practices-review.md, question 9).
// Not checked: that every file path a rule names exists. Most are files a
// project or a tool makes later (`tools/kb/out/`, `.claude/rules/owner-preferences.md`,
// `delivery/migrations/...`), so the check would need a hand-kept list of them.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FOLDERS_MADE_LATER, RULE_LIMITS, buildSpan, firstFolder, globMatches, globProblems, hasSpan, lintRule, lintRuleSet, lintText, namedSkills, parseRule, readRules, ruleSize, spanBody,
} from './rule-lint.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const SETUP = path.join(REPO, 'plugins', 'toolkit', 'skills', 'project-setup');
const ASSETS = path.join(SETUP, 'assets');
/** The setup folders: project files at the paths a project has them (setup-copy.md, "Folders the choices add"). */
const PROJECT_FOLDERS = ['every-project', 'work-local', 'work-notion', 'work-github', 'memory-local', 'memory-notion', 'memory-process', 'notion-tools', 'salesforce', 'soul'];
/** The owner's rule file. Its lines are the owner's own, so they are compared by list item only. */
const RULE_FILE_NAME = 'owner-preferences.md';
/** The owner-preferences.md template project-setup copies into a project's .claude/rules/. */
const OWNER_TEMPLATE = path.join(ASSETS, RULE_FILE_NAME);

const SKIP_DIRS = new Set(['.git', 'node_modules', '__pycache__', '.sfdx', '.sf']);

/** Put every setup folder into one scratch folder: a project with every choice (the folders that alternate overwrite each other's skills only). */
let mergedDir = null;
function mergedModel() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-rules-'));
  mergedDir = dir;
  process.on('exit', () => fs.rmSync(dir, { recursive: true, force: true }));
  for (const folder of PROJECT_FOLDERS) {
    fs.cpSync(path.join(ASSETS, folder), dir, { recursive: true, filter: (src) => path.basename(src) !== '.agents' });
  }
  return dir;
}

function parseArgs(argv) {
  const out = { dir: null };
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
  out.dir = out.dir ? path.resolve(out.dir) : mergedModel();
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

/** The skill names a rule may name: project-setup, every skill it ships, and the folder's own project skills. */
function knownSkills(dir) {
  const names = new Set();
  const add = (parent) => {
    try {
      for (const e of fs.readdirSync(parent, { withFileTypes: true })) if (e.isDirectory()) names.add(e.name);
    } catch {
      // No such folder.
    }
  };
  add(path.join(REPO, 'plugins', 'toolkit', 'skills'));
  for (const folder of PROJECT_FOLDERS) add(path.join(ASSETS, folder, '.claude', 'skills'));
  add(path.join(dir, '.claude', 'skills'));
  add(path.join(dir, '.agents', 'skills'));
  return names;
}

/** A folder as a path inside this repository, or in full when it is outside. */
function shown(dir) {
  if (mergedDir && dir.startsWith(mergedDir)) return `the setup folders (put together)${dir.slice(mergedDir.length)}`;
  const rel = path.relative(REPO, dir);
  return rel && !rel.startsWith('..') ? rel : dir;
}

/** The setups whose always-on size is printed. */
const SETUPS = [
  { name: 'local work and memory, no Salesforce', tracker: 'local', memory: 'local', salesforce: false },
  { name: 'Notion work and memory, no Salesforce', tracker: 'notion', memory: 'notion', salesforce: false },
  { name: 'local work, Hindsight memory, Salesforce', tracker: 'local', memory: 'hindsight', salesforce: true },
];

/** Keep the blocks whose setup marker holds and delete every marker line (project-setup/references/setup-copy.md, "Setup markers"). */
function resolveMarkers(text, setup) {
  const holds = (condition) => {
    if (condition === 'salesforce') return setup.salesforce;
    if (condition === 'not salesforce') return !setup.salesforce;
    return condition.split(' or ').some((part) => {
      const m = part.trim().match(/^(tracker|memory)=(\w+)$/);
      return m ? setup[m[1]] === m[2] : false;
    });
  };
  const out = [];
  let keep = true;
  for (const line of text.split('\n')) {
    const t = line.trim();
    const open = t.match(/^<!-- if (.+) -->$/);
    if (open) keep = holds(open[1]);
    else if (t === '<!-- endif -->') keep = true;
    else if (keep) out.push(line);
  }
  return out.join('\n').replace(/<!-- Project setup fill-in guide[\s\S]*?-->\n?/, '');
}

/** The rules a project without Salesforce does not get: every rule in the salesforce folder. */
function salesforceRuleNames() {
  const dir = path.join(ASSETS, 'salesforce', '.claude', 'rules');
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n.endsWith('.md')) : [];
}

/** Bytes that load in every session in each setup: always-on rules plus AGENTS.md, and the owner-preferences.md template. */
function setupTotals(dir, raw, rules) {
  const salesforce = new Set(salesforceRuleNames());
  const agentsFile = path.join(dir, 'AGENTS.md');
  const agents = fs.existsSync(agentsFile) ? fs.readFileSync(agentsFile, 'utf8') : '';
  const ownerTemplate = fs.existsSync(OWNER_TEMPLATE) ? Buffer.byteLength(fs.readFileSync(OWNER_TEMPLATE, 'utf8')) : 0;
  return SETUPS.map((setup) => {
    let bytes = Buffer.byteLength(resolveMarkers(agents, setup)) + ownerTemplate;
    for (const r of raw) {
      const parsed = rules.find((x) => x.name === r.name);
      if (!parsed || parsed.scoped) continue;
      if (!setup.salesforce && salesforce.has(r.name)) continue;
      if (setup.tracker !== 'local' && r.name === 'work-item-folders.md') continue;
      bytes += Buffer.byteLength(resolveMarkers(r.text, setup));
    }
    return { name: setup.name, bytes };
  });
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
      findings.push({ rule: rule.name, line: s.line, check: 'skill', severity: 'warning', message: `The rule names the \`${s.name}\` skill, which project-setup does not ship and no project skill in ${shown(dir)} holds, and does not say what to do when it is not installed.`, fix: 'Name a skill that exists, or add what to do when it is not installed.' });
    }
    // A pattern must match a file the project has, or name a folder it makes later.
    for (const p of rule.paths || []) {
      if (globProblems(p) || files.some((f) => globMatches(p, f))) continue;
      const folder = firstFolder(p);
      if (folder && FOLDERS_MADE_LATER[folder]) continue;
      findings.push({ rule: rule.name, line: 1, check: 'glob', severity: 'error', message: `The paths pattern "${p}" matches no file in ${shown(dir)}, so the rule never loads.`, fix: `Fix the pattern, or add its folder to FOLDERS_MADE_LATER in dev/tools/rule-lint.mjs with the reason a project creates it later.` });
    }
  }
  findings.push(...lintRuleSet(rules, { listItemsOnly: [RULE_FILE_NAME] }));

  // The AGENTS.md rules list matches the rule files (R26).
  const agentsFile = path.join(dir, 'AGENTS.md');
  if (fs.existsSync(agentsFile)) {
    const agents = fs.readFileSync(agentsFile, 'utf8');
    if (hasSpan(agents) && spanBody(agents) !== buildSpan(raw)) {
      findings.push({ rule: 'AGENTS.md', line: null, check: 'rules-list', severity: 'error', message: 'The rules list in AGENTS.md is not the list the rule files give (a heading, a paths list, or a file changed).', fix: 'On the model branch, rewrite the list between the toolkit:rules markers to match buildSpan(readRules(<folder>)) in dev/tools/rule-lint.mjs, then refresh the model copy.' });
    }
  }

  // The owner-preferences.md template project-setup copies passes the same
  // checks once it holds instructions: two sample lines in its layout are
  // added under their areas before it is checked.
  if (!fs.existsSync(OWNER_TEMPLATE)) {
    findings.push({ rule: RULE_FILE_NAME, line: null, check: 'owner-template', severity: 'error', message: `${shown(OWNER_TEMPLATE)} does not exist.`, fix: 'Restore the template project-setup copies into a project.' });
  } else {
    const template = fs.readFileSync(OWNER_TEMPLATE, 'utf8').replace(/\s*$/, '\n');
    const sample = `${template}\n## Replies\n\n- Lead every status reply with the answer. (2026-09-29, check-rules sample, in chat)\n\n## Testing\n\n- Run \`npm test\` before you say a change works. (2026-09-29, check-rules sample, in chat)\n`;
    const sampleRule = parseRule(RULE_FILE_NAME, sample);
    for (const x of [...lintRule(sampleRule, { ownerFile: true }), ...lintText(sampleRule)]) {
      findings.push({ ...x, rule: `${shown(OWNER_TEMPLATE)} (with two sample lines)` });
    }
  }

  const errors = findings.filter((x) => x.severity === 'error');
  const warnings = findings.filter((x) => x.severity !== 'error');
  const always = rules.filter((r) => !r.scoped);
  const alwaysBytes = always.reduce((n, r) => n + ruleSize(r).bytes, 0);
  const largest = [...always].sort((a, b) => ruleSize(b).bytes - ruleSize(a).bytes)[0];
  console.log(`check-rules: ${rules.length} rules in ${shown(rulesDir)}: ${always.length} always on (${alwaysBytes} bytes in all; largest ${largest ? `${largest.name}, ${ruleSize(largest).bytes} bytes` : 'none'}; proposed limit ${RULE_LIMITS.alwaysOnBytes} bytes each, a warning until Mike says yes), ${rules.length - always.length} path-scoped.`);
  console.log(`check-rules: bytes that load in every session (always-on rules plus AGENTS.md, setup markers resolved): ${setupTotals(dir, raw, rules).map((t) => `${t.name}, ${t.bytes}`).join('; ')}. No ceiling is set for this total yet; it waits for Mike's answer.`);
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

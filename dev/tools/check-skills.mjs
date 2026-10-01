#!/usr/bin/env node
// check-skills.mjs: checks the skills that project-setup copies into projects. Dev only, not shipped.
//
// Usage: node dev/tools/check-skills.mjs [--model <folder>]
//   --model <folder>  read the model's skills and templates from this folder instead of
//                     plugins/toolkit/skills/project-setup/assets/model, for example the model
//                     branch worktree before the copy is refreshed.
//
// For project-setup and every SKILL.md under it, plus the model's .claude/skills/ (its
// .agents/skills/ is skipped: a second copy that onboarding never copies):
//   - the frontmatter holds only name and description, and name equals the folder name;
//   - the description is single-quoted on one line, under 400 characters, starts with a
//     third-person verb, has a ", so" why clause, then a "Use when" clause ("Use whenever",
//     "Use only when", "Use before", and "Use first, before <skill>, when" count too);
//     every "; use <skill>" names a skill that exists (a shared skill may say "; use the work
//     track skill", since each project has a different one);
//   - the description and folder match dev/SKILL-INDEX.md word for word;
//   - no when_to_use, $ARGUMENTS, !`command`, or ${CLAUDE_*}: Codex shows them as text;
//   - SKILL.md links every file in the skill folder (a link to a folder covers what is in it),
//     every link resolves, and no link leaves the folder with ../;
//   - a Markdown file in references/ or examples/ over 100 lines has "## Contents" as its first
//     section;
//   - no file names a command of the retired toolkit program;
//   - a file whose first line names a dev/build-shared/ source equals that source after the
//     first line;
//   - a skill asset copied from the model (MODEL_COPIES) equals the model's file;
//   - the lists that setup-copy.md, skills-hooks-settings.md, and interview.md keep by hand match
//     the model and the skill folders: the Salesforce list, the files that hold setup markers,
//     the shared skills, each set's skills, and the skill counts;
//   - the Next action forms kept by hand in three places say the same: the Working, Waiting,
//     Finished, and "Never name a work track ..." lines of dev/build-shared/work-item-format.md
//     and the model's .claude/rules/keep-work-item-current.md, and the Next action prompt of
//     notion-work-track's assets/work-item-page.md and the model's WORK-ITEM.md.
// Findings on the model's own skills are warnings: changing them is a model change that needs
// Mike's yes (AGENTS.md). So is a missing contents list in sf-architect-solutioning, whose body
// is Mike's text: a change there needs his yes. The run fails (exit 1) on any error.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SETUP = path.join(ROOT, 'plugins/toolkit/skills/project-setup');
const INDEX = path.join(ROOT, 'dev/SKILL-INDEX.md');
const argv = process.argv.slice(2);
const MODEL = argv.includes('--model') ? path.resolve(argv[argv.indexOf('--model') + 1] || '.') : path.join(SETUP, 'assets/model');
const HAS_MODEL = fs.existsSync(path.join(MODEL, 'AGENTS.md'));

// Its body and references are Mike's text. The description was rewritten on 2026-09-27, and the
// body was reworded on 2026-09-30, both with his yes (review answers B48 and C12 to C26). The
// contents rule is a warning for it.
const MIKES_BODY = new Set(['sf-architect-solutioning']);
const MAX_DESCRIPTION = 400;
const CONTENTS_OVER = 100;
const VERB = /^[A-Z][a-z]+(?:-[a-z]+)?s\b/;
const WHY = /,\s+so\s/;
const USE = /\bUse (?:when(?:ever)?|only when|before|first, before [a-z0-9-]+, when)\b/;
const LITERAL = [[/\$ARGUMENTS\b/, '$ARGUMENTS'], [/!`/, '!`command`'], [/\$\{CLAUDE_/, '${CLAUDE_*}']];
const TOOLKIT_COMMAND = /\btoolkit (?:brief|config|decision|doctor|export|handoff-backup|hindsight|hook|import|index|init|machine-setup|memory|notion|rule|sync|version|work)\b|\bbin\/toolkit\b/;
const TEXT_FILE = /\.(?:md|mjs|cjs|js|json|toml|ya?ml|rules|txt|csv|sh)$/;
const PATH_SPAN = /^(?:\.\/)?(?:references|assets|examples|scripts|agents)\/\S*$/;
// Skill assets that are copies of model files: path under project-setup/assets -> path in the model.
const MODEL_COPIES = {
  '.shared-skills/solution-design/assets/DESIGN.md': 'work-items/work-item-template/DESIGN.md',
  '.skill-sets/github-work/github-work-track/assets/WORK-ITEM.md': 'work-items/work-item-template/WORK-ITEM.md',
};

const findings = [];
const notes = [];
const shown = (p) => (p.startsWith(ROOT + path.sep) ? path.relative(ROOT, p) : p);
const report = (level, file, message) => findings.push({ level, file: shown(file), message });
const read = (p) => fs.readFileSync(p, 'utf8');
const posix = (p) => p.split(path.sep).join('/');
const inside = (child, parent) => child === parent || child.startsWith(parent + path.sep);

/** Every file under a folder, dot folders included; .git and .DS_Store left out. */
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === '.DS_Store') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Lines outside fenced code blocks, as { text, n } with 1-based line numbers. */
function proseLines(text) {
  const out = [];
  let fence = null;
  text.split('\n').forEach((line, i) => {
    const m = line.trim().match(/^(`{3,}|~{3,})/);
    if (m) fence = fence ? (line.trim().startsWith(fence) ? null : fence) : m[1];
    else if (!fence) out.push({ text: line, n: i + 1 });
  });
  return out;
}

/** Link targets and path-like code spans in a Markdown file: { path, n, span, table }. */
function namedPaths(text) {
  const lines = text.split('\n');
  const prose = new Set(proseLines(text).map((l) => l.n));
  const blanked = lines.map((l, i) => (prose.has(i + 1) ? l : '')).join('\n');
  const isTable = (n) => lines[n - 1].trimStart().startsWith('|');
  const out = [];
  // A code span may run over two lines, but never over a blank line.
  const stripped = blanked.replace(/`((?:[^`\n]|\n(?![ \t]*\n))+)`/g, (m, s, at) => {
    const first = s.trim().split(/\s+/)[0];
    const n = blanked.slice(0, at).split('\n').length;
    if (PATH_SPAN.test(first) || first.startsWith('../')) out.push({ path: first, n, span: true, table: isTable(n) });
    return m.replace(/[^\n]/g, ' ');
  });
  stripped.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) out.push({ path: m[1], n: i + 1, span: false, table: isTable(i + 1) });
  });
  return out.filter((x) => !/[<>{}*$]/.test(x.path) && !/^[a-z][a-z0-9+.-]*:/i.test(x.path) && !/^[#/~]/.test(x.path))
    .map((x) => ({ ...x, path: x.path.replace(/[#?].*$/, '').replace(/^\.\//, '') }));
}

/** Parse SKILL.md frontmatter: { raw: Map of key to raw value, close } or null, with an error reported. */
function frontmatter(file, text, level) {
  const lines = text.split('\n');
  const close = lines.indexOf('---', 1);
  if (lines[0] !== '---' || close === -1) return report(level, file, 'no frontmatter between two `---` lines'), null;
  const raw = new Map();
  for (const line of lines.slice(1, close)) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s?(.*)$/);
    if (!m) { report(level, file, `frontmatter line is not "key: value" on one line: ${line}`); continue; }
    if (!['name', 'description'].includes(m[1])) report(level, file, `frontmatter key "${m[1]}": only name and description are allowed`);
    raw.set(m[1], m[2]);
  }
  return { raw, close };
}

// ------------------------------------------------------------------ the index

const index = new Map();
for (const [i, line] of read(INDEX).split('\n').entries()) {
  const m = line.match(/^\|\s*`([a-z0-9-]+)`\s*\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|\s*$/);
  if (!m) continue;
  if (index.has(m[1])) report('error', INDEX, `line ${i + 1}: ${m[1]} is listed twice`);
  index.set(m[1], { folder: m[2], description: m[3], line: i + 1 });
}
const indexDir = (folder) => (folder.startsWith('assets/model/') ? path.join(MODEL, folder.slice('assets/model/'.length)) : path.join(SETUP, folder));

// ------------------------------------------------------------------ find the skills

const setupSkillDirs = walk(SETUP).filter((f) => path.basename(f) === 'SKILL.md' && !inside(f, path.join(SETUP, 'assets/model'))).map(path.dirname);
const modelSkillDirs = walk(path.join(MODEL, '.claude/skills')).filter((f) => path.basename(f) === 'SKILL.md').map(path.dirname);
const skills = [...setupSkillDirs.map((dir) => ({ dir, model: false })), ...modelSkillDirs.map((dir) => ({ dir, model: true }))];
const allDirs = skills.map((s) => s.dir);
const names = new Set([...skills.map((s) => path.basename(s.dir)), ...index.keys()]);
if (!HAS_MODEL) notes.push(`The model copy ${shown(MODEL)} is not there yet: the model's skills, its template copies, and links into assets/model/ were not checked.`);

// ------------------------------------------------------------------ check each skill

for (const { dir, model } of skills) {
  const level = model ? 'warning' : 'error';
  const skillFile = path.join(dir, 'SKILL.md');
  const text = read(skillFile);
  const folderName = path.basename(dir);
  const fm = frontmatter(skillFile, text, level);
  let description = null;
  if (fm) {
    const name = fm.raw.get('name');
    if (name !== folderName) report(level, skillFile, `name is "${name}", but the folder is "${folderName}"`);
    const rawDescription = fm.raw.get('description') ?? '';
    const quoted = rawDescription.match(/^'((?:[^']|'')*)'$/);
    if (!quoted) report(level, skillFile, 'the description is not one single-quoted line');
    description = quoted ? quoted[1].replace(/''/g, "'") : rawDescription;
    if (description.length >= MAX_DESCRIPTION) report(level, skillFile, `the description is ${description.length} characters; it must be under ${MAX_DESCRIPTION}`);
    if (!VERB.test(description)) report(level, skillFile, `the description must start with a third-person verb that says what the skill does ("Saves", "Reports"); it starts "${description.slice(0, 30)}"`);
    const why = description.search(WHY);
    const use = description.search(USE);
    if (use === -1) report(level, skillFile, 'the description has no "Use when" clause');
    if (why === -1) report(level, skillFile, 'the description has no ", so ..." clause saying why to use it');
    else if (use !== -1 && why > use) report(level, skillFile, 'the ", so ..." clause must come before "Use when"');
    for (const m of description.matchAll(/; use (?!the work track skill\b)([a-z][a-z0-9-]*)/g)) if (!names.has(m[1])) report(level, skillFile, `the description sends the agent to "${m[1]}", which is no skill`);
  }
  for (const [re, label] of LITERAL) if (re.test(text)) report(level, skillFile, `uses ${label}, which Codex shows as literal text`);

  // The index: every skill has a row, with this folder and this description word for word.
  const row = index.get(folderName);
  if (!row) report('error', INDEX, `${folderName} has no row (folder ${shown(dir)})`);
  else {
    if (path.resolve(indexDir(row.folder)) !== dir) report('error', INDEX, `line ${row.line}: ${folderName} is in ${shown(dir)}, not ${row.folder}`);
    if (description !== null && row.description !== description) report('error', INDEX, `line ${row.line}: the description of ${folderName} differs from its SKILL.md`);
  }

  // The skill's own files: nested skills and the model copy are checked on their own.
  const own = walk(dir).filter((f) => !allDirs.some((d) => d !== dir && inside(f, d) && inside(d, dir)) && !(dir === SETUP && inside(f, path.join(SETUP, 'assets/model'))));
  // A bare `assets/` or `references/` in a sentence names the folder, not what is in it.
  const linked = namedPaths(text).map((x) => x.path.replace(/\/$/, '')).filter((l) => l.includes('/'));
  for (const f of own) {
    const rel = posix(path.relative(dir, f));
    if (rel !== 'SKILL.md' && !linked.some((l) => rel === l || rel.startsWith(`${l}/`))) report(level, f, 'SKILL.md does not link this file, so the agent never opens it; add it to the References table');
  }
  for (const f of own.filter((x) => x.endsWith('.md'))) {
    const body = read(f);
    for (const x of namedPaths(body)) {
      if (x.path.startsWith('../')) { report(level, f, `line ${x.n}: ${x.path} leaves the skill folder`); continue; }
      if (x.span && !(f === skillFile && x.table)) continue; // prose code spans may name project paths
      if (x.path.startsWith('assets/model/') && !HAS_MODEL && dir === SETUP) continue;
      const target = x.path.startsWith('assets/model/') && dir === SETUP ? path.join(MODEL, x.path.slice('assets/model/'.length)) : path.join(dir, x.path);
      if (!fs.existsSync(target) && !fs.existsSync(path.join(path.dirname(f), x.path))) report(level, f, `line ${x.n}: ${x.path} does not exist`);
    }
    const rel = posix(path.relative(dir, f));
    const lines = body.split('\n').length - (body.endsWith('\n') ? 1 : 0);
    if (/^(references|examples)\//.test(rel) && lines > CONTENTS_OVER) {
      const heading = proseLines(body).find((l) => /^#{2,6}\s/.test(l.text));
      if (!heading || !/^#{2,6}\s+(?:Table of )?Contents\s*$/i.test(heading.text)) report(MIKES_BODY.has(folderName) ? 'warning' : level, f, `${lines} lines: a reference over ${CONTENTS_OVER} lines starts with a "## Contents" section`);
    }
  }
  for (const f of own.filter((x) => TEXT_FILE.test(x))) {
    const lines = read(f).split('\n');
    const hits = lines.flatMap((line, i) => (TOOLKIT_COMMAND.test(line) ? [i + 1] : []));
    if (hits.length) report(level, f, `names a command of the retired toolkit program on line${hits.length > 1 ? 's' : ''} ${hits.join(', ')}: ${lines[hits[0] - 1].trim().slice(0, 80)}`);
    const source = lines[0].match(/dev\/build-shared\/([\w./-]+\.md)/);
    if (!source) continue;
    const src = path.join(ROOT, 'dev/build-shared', source[1]);
    if (!fs.existsSync(src)) report('error', f, `its first line names ${shown(src)}, which does not exist`);
    else if (read(src).split('\n').slice(1).join('\n') !== lines.slice(1).join('\n')) report('error', f, `differs from its source ${shown(src)}; edit the source, then copy it over this file`);
  }
}

// ------------------------------------------------------------------ index rows, model copies

for (const [name, row] of index) {
  const dir = indexDir(row.folder);
  if (row.folder.startsWith('assets/model/') && !HAS_MODEL) continue;
  if (!fs.existsSync(path.join(dir, 'SKILL.md'))) report('error', INDEX, `line ${row.line}: ${name} has no SKILL.md in ${row.folder}`);
}
if (HAS_MODEL) {
  for (const [copy, original] of Object.entries(MODEL_COPIES)) {
    const a = path.join(SETUP, 'assets', copy);
    const b = path.join(MODEL, original);
    if (!fs.existsSync(a) || !fs.existsSync(b)) report('error', a, `this copy or its model file ${shown(b)} is missing`);
    else if (read(a) !== read(b)) report('error', a, `differs from the model's ${original}; copy the model's file over it`);
  }
  // The Next action prompt is written by hand in two places; they must match.
  const pageFile = path.join(SETUP, 'assets/.skill-sets/notion-work/notion-work-track/assets/work-item-page.md');
  const templateFile = path.join(MODEL, 'work-items/work-item-template/WORK-ITEM.md');
  const prompt = (text) => text.replace(/\\/g, '').match(/\*\*Next action:\*\* (.*?)(?:<br>|\n|$)/)?.[1];
  if (!fs.existsSync(pageFile) || !fs.existsSync(templateFile)) report('error', pageFile, `this file or ${shown(templateFile)} is missing, so the Next action prompts were not compared`);
  else {
    const page = prompt(read(pageFile));
    const template = prompt(read(templateFile));
    if (!page || !template) report('error', page ? templateFile : pageFile, 'has no "**Next action:**" prompt');
    else if (page !== template) report('error', pageFile, `its Next action prompt (backslashes removed) differs from the model's WORK-ITEM.md: "${page}" against "${template}"`);
  }
}

// ------------------------------------------------------------------ setup lists kept by hand

if (HAS_MODEL) {
  // Files the model holds that every project gets. A model file in neither these lists nor the
  // Salesforce list of setup-copy.md fails the run, so a person decides where it belongs.
  const EVERY_PROJECT_TOP = ['.agents', '.claude', '.gitignore', 'AGENTS.md', 'CLAUDE.md', 'PROJECT-ROADMAP.md', 'PROJECT.md', 'README.md', 'SOUL.md', 'ai-external-knowledge', 'memory', 'requirements', 'system-guide', 'tests', 'work-items'];
  const EVERY_PROJECT_RULES = ['ai-external-knowledge.md', 'cite-recalled-knowledge.md', 'humanize-outbound-text.md', 'keep-work-item-current.md', 'memory-review-and-save.md', 'plain-english-artifacts.md', 'publish-project-documents.md', 'session-handoff.md', 'shared-repository-work.md', 'work-item-folders.md'];
  const copyFile = path.join(SETUP, 'references/setup-copy.md');
  const hooksFile = path.join(SETUP, 'references/skills-hooks-settings.md');
  const interviewFile = path.join(SETUP, 'references/interview.md');
  const copyText = read(copyFile);
  const hooksText = read(hooksFile);
  let modelSf = 0;
  const ticks = (text) => [...text.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]);
  const dirs = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort() : []);
  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

  // The Salesforce list: the bullets under "The Salesforce list", up to the first line that is not a bullet or its continuation.
  const at = copyText.indexOf('The Salesforce list (only a Salesforce project keeps these):');
  const listLines = [];
  if (at !== -1) for (const line of copyText.slice(at).split('\n').slice(1)) {
    if (line.trim() === '' && !listLines.length) continue;
    if (line.startsWith('- ') || line.startsWith('  ')) listLines.push(line);
    else break;
  }
  if (!listLines.length) report('error', copyFile, 'has no "The Salesforce list" bullets in the expected shape; update this check when the list changes');
  else {
    const named = ticks(listLines.join('\n')).filter((t) => !t.includes('*'));
    const rules = named.filter((t) => /^[\w-]+\.md$/.test(t));
    const paths = named.filter((t) => !rules.includes(t));
    for (const t of paths) if (!fs.existsSync(path.join(MODEL, t))) report('error', copyFile, `its Salesforce list names ${t}, which the model does not have`);
    for (const t of rules) if (!fs.existsSync(path.join(MODEL, '.claude/rules', t))) report('error', copyFile, `its Salesforce list names the rule ${t}, which the model does not have`);
    const salesforceTop = new Set(paths.map((t) => t.split('/')[0]));
    for (const name of fs.readdirSync(MODEL)) if (!EVERY_PROJECT_TOP.includes(name) && !salesforceTop.has(name)) report('error', copyFile, `the model has the top-level path ${name}, which is in neither the Salesforce list nor the every-project list in dev/tools/check-skills.mjs: decide which, then update the list`);
    const ruleDir = path.join(MODEL, '.claude/rules');
    if (fs.existsSync(ruleDir)) for (const name of fs.readdirSync(ruleDir)) if (!rules.includes(name) && !EVERY_PROJECT_RULES.includes(name)) report('error', copyFile, `the model has the rule ${name}, which is in neither the Salesforce list nor the every-project list in dev/tools/check-skills.mjs: decide which, then update the list`);
    const modelSkills = dirs(path.join(MODEL, '.claude/skills'));
    for (const name of modelSkills) if (!name.startsWith('sf-')) report('error', copyFile, `the model has the skill ${name}, but the Salesforce list takes only sf-* folders and every other skill is copied from this skill's assets/`);
    const row = hooksText.split('\n').find((l) => l.startsWith('| Salesforce |')) ?? '';
    const rowSkills = ticks(row).filter((t) => t.startsWith('sf-') && t !== 'sf-architect-solutioning').sort();
    if (!same(rowSkills, modelSkills.filter((n) => n.startsWith('sf-')))) report('error', hooksFile, `its Salesforce row names ${rowSkills.join(', ') || 'no model skills'}, but the model has ${modelSkills.join(', ')}`);
    modelSf = modelSkills.filter((n) => n.startsWith('sf-')).length;
  }

  // The files that hold setup markers.
  const markerPara = copyText.split(/\n\s*\n/).find((p) => p.startsWith('These are the files that hold markers'));
  const modelMarked = walk(MODEL).filter((f) => fs.lstatSync(f).isFile() && read(f).includes('<!-- if ')).map((f) => posix(path.relative(MODEL, f))).sort();
  if (!markerPara) report('error', copyFile, 'has no paragraph starting "These are the files that hold markers"');
  else {
    const named = ticks(markerPara.split('; the grep')[0]).sort();
    if (!same(named, modelMarked)) report('error', copyFile, `its list of files that hold setup markers is ${named.join(', ')}, but the model's files are ${modelMarked.join(', ')}`);
  }

  // The shared skills, each set's skills, and the counts.
  const shared = hooksText.replace(/\s+/g, ' ').match(/The shared skills are the same in every project \((\d+)\): ([^.]*)\./);
  const sharedDirs = dirs(path.join(SETUP, 'assets/.shared-skills'));
  if (!shared) report('error', hooksFile, 'has no "The shared skills are the same in every project (N): ..." sentence in the expected shape');
  else {
    const named = ticks(shared[2]).sort();
    if (Number(shared[1]) !== named.length || !same(named, sharedDirs)) report('error', hooksFile, `it lists ${shared[1]} shared skills (${named.length} names), but assets/.shared-skills holds ${sharedDirs.length}: ${sharedDirs.join(', ')}`);
  }
  const setCounts = {};
  for (const line of hooksText.split('\n')) {
    const m = line.startsWith('|') ? line.match(/assets\/\.skill-sets\/([\w-]+)\/\./) : null;
    if (!m) continue;
    const named = ticks(line.split('|')[3] ?? '').sort();
    const actual = dirs(path.join(SETUP, 'assets/.skill-sets', m[1]));
    if (!same(named, actual)) report('error', hooksFile, `its row for ${m[1]} names ${named.join(', ')}, but the folder holds ${actual.join(', ')}`);
    setCounts[m[1]] = actual.length;
  }
  const interview = read(interviewFile).replace(/\s+/g, ' ').match(/(\d+) shared, plus (\d+) for the work tracking set, plus (\d+) for local or Notion memory \(none for Hindsight\), plus (\d+) for Salesforce/);
  if (!interview) report('error', interviewFile, 'has no "N shared, plus N for the work tracking set, ..." sentence in the expected shape');
  else {
    const want = [sharedDirs.length, Math.max(...['local-work', 'notion-work', 'github-work'].map((k) => setCounts[k] ?? 0)), Math.max(...['local-memory', 'notion-memory'].map((k) => setCounts[k] ?? 0)), 1 + modelSf];
    if (interview.slice(1).map(Number).join() !== want.join()) report('error', interviewFile, `its skill counts are ${interview.slice(1).join(', ')}, but the folders give ${want.join(', ')}`);
  }
}

// ------------------------------------------------------------------ report

const errors = findings.filter((x) => x.level === 'error');
const warnings = findings.filter((x) => x.level === 'warning');
console.log(`check-skills: ${skills.length} skills checked (${setupSkillDirs.length} in project-setup, ${modelSkillDirs.length} from the model), ${index.size} rows in dev/SKILL-INDEX.md.`);
for (const x of [...errors, ...warnings]) console.log(`${x.level === 'error' ? 'Error' : 'Warning'}: ${x.file}: ${x.message}`);
for (const n of notes) console.log(`Note: ${n}`);
if (warnings.length) console.log('Warnings do not fail the run. They are on the model\'s own skills and on sf-architect-solutioning\'s body, which are Mike\'s text: a change there needs his yes.');
console.log(`check-skills: ${errors.length ? 'failed' : 'passed'}, ${errors.length} error${errors.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`);
process.exit(errors.length ? 1 : 0);

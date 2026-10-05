#!/usr/bin/env node
// check-skills.mjs: checks the skills that project-setup copies into projects. Dev only, not shipped.
//
// Usage: node dev/tools/check-skills.mjs
//
// The setup folders (every-project, work-local, salesforce, and the others, in
// plugins/toolkit/skills/project-setup/assets/) hold project files at the paths a project
// has them. A file the owner's choices alternate (work-local, work-notion, work-github;
// memory-local, memory-notion) may sit at the same path in each of those folders; every
// other path is in exactly one folder.
//
// For project-setup and every SKILL.md under it, the plugin's other skills beside
// project-setup (the tool list), plus the Salesforce folder's .claude/skills/ (the model's own
// project skills; every-project/.agents/skills is a link that onboarding never copies):
//   - the frontmatter holds only name and description, and name equals the folder name;
//   - the name is lowercase letters, digits, and hyphens, at most 64 characters, and holds
//     neither "anthropic" nor "claude";
//   - the description is single-quoted on one line, under 500 characters, starts with a
//     third-person verb that says what the skill does, and has a sentence that starts with
//     "Use" saying when to use it; every "; use <skill>" names a skill that exists;
//   - the SKILL.md body (after the frontmatter) is under 500 lines;
//   - the description and folder match dev/SKILL-INDEX.md word for word (the three work
//     tracking sets each hold a skill named using-work-tracker, so a name may have one row
//     per folder);
//   - no when_to_use, $ARGUMENTS, !`command`, or ${CLAUDE_*}: Codex shows them as text;
//   - SKILL.md links every file in the skill folder (a link to a folder covers what is in it),
//     every link resolves, and no link leaves the folder with ../;
//   - a Markdown file in references/ or examples/ over 100 lines has "## Contents" as its first
//     section;
//   - no file names a command of the retired toolkit program;
//   - a file whose first line names a dev/build-shared/ source equals that source after the
//     first line;
//   - a skill asset copied from a project file (MODEL_COPIES) equals that file;
//   - no project path is in two setup folders, except the alternatives named above;
//   - the lists that setup-copy.md, skills-hooks-settings.md, and interview.md keep by hand match
//     the setup folders: the Salesforce list and the salesforce folder, the files that hold setup
//     markers, the shared skills, the skills each choice's folders hold (a row may name several
//     folders, such as memory-process and memory-local), every folder with skills named by a row,
//     and the skill counts;
//   - the Next action prompt kept by hand in project-setup's references/notion-build/
//     work-item-page.md (the Notion work item template's text) says the same as the work item
//     template's WORK-ITEM.md.
// Findings on the model's own skills (the sf-* skills) are warnings: changing them is a model change that needs
// Mike's yes (AGENTS.md). The run fails (exit 1) on any error.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SETUP = path.join(ROOT, 'plugins/toolkit/skills/project-setup');
const INDEX = path.join(ROOT, 'dev/SKILL-INDEX.md');
const ASSETS = path.join(SETUP, 'assets');
// The folders that hold files at the paths a project has them. The first is copied for every project.
const PROJECT_FOLDERS = ['every-project', 'work-local', 'work-notion', 'work-github', 'memory-local', 'memory-notion', 'memory-process', 'notion-tools', 'salesforce', 'soul'];
// Folders for choices that exclude each other: they may hold a file at the same path.
const ALTERNATIVES = [['work-local', 'work-notion', 'work-github'], ['memory-local', 'memory-notion']];
const EVERY = path.join(ASSETS, 'every-project');
const SALESFORCE = path.join(ASSETS, 'salesforce');
const SALESFORCE_SKILLS = path.join(SALESFORCE, '.claude/skills');

const MAX_DESCRIPTION = 500;
const MAX_BODY_LINES = 500;
const MAX_NAME = 64;
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTENTS_OVER = 100;
const VERB = /^[A-Z][a-z]+(?:-[a-z]+)?s\b/;
const USE = /(?:^|[.!?]\s+)Use\b/;
const LITERAL = [[/\$ARGUMENTS\b/, '$ARGUMENTS'], [/!`/, '!`command`'], [/\$\{CLAUDE_/, '${CLAUDE_*}']];
const TOOLKIT_COMMAND = /\btoolkit (?:brief|config|decision|doctor|export|handoff-backup|hindsight|hook|import|index|init|machine-setup|memory|notion|rule|sync|version|work)\b|\bbin\/toolkit\b/;
const TEXT_FILE = /\.(?:md|mjs|cjs|js|json|toml|ya?ml|rules|txt|csv|sh)$/;
const PATH_SPAN = /^(?:\.\/)?(?:references|assets|examples|scripts|agents)\/\S*$/;
// Skill assets that are copies of project files: path under project-setup/assets -> the project path of the file.
const SHARED = 'every-project/.claude/skills';
const MODEL_COPIES = {
  [`${SHARED}/running-work-item-lifecycle/assets/work-item-template.md`]: 'work-items/work-item-template/WORK-ITEM.md',
  [`${SHARED}/running-work-item-lifecycle/assets/design-template.md`]: 'work-items/work-item-template/DESIGN.md',
  [`${SHARED}/filing-project-records/assets/DOMAIN-MAP.md`]: 'project-wide-records/templates/DOMAIN-MAP.md',
  [`${SHARED}/filing-project-records/assets/PROJECT-QUESTION.md`]: 'project-wide-records/templates/PROJECT-QUESTION.md',
  [`${SHARED}/filing-project-records/assets/PERSON.md`]: 'project-wide-records/templates/PERSON.md',
  [`${SHARED}/filing-project-records/assets/TARGET-ARCHITECTURE.md`]: 'project-wide-records/templates/TARGET-ARCHITECTURE.md',
  [`${SHARED}/filing-project-records/assets/INTAKE-RECEIPT.md`]: 'project-wide-records/templates/INTAKE-RECEIPT.md',
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

// Rows are keyed by folder: the three work tracking folders each hold a skill named using-work-tracker.
const indexDir = (folder) => path.join(SETUP, folder);
const index = new Map();
for (const [i, line] of read(INDEX).split('\n').entries()) {
  const m = line.match(/^\|\s*`([a-z0-9-]+)`\s*\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|\s*$/);
  if (!m) continue;
  const dir = path.resolve(indexDir(m[2]));
  if (index.has(dir)) report('error', INDEX, `line ${i + 1}: ${m[2]} is listed twice`);
  index.set(dir, { name: m[1], folder: m[2], description: m[3], line: i + 1 });
}
const indexNames = new Set([...index.values()].map((row) => row.name));

// ------------------------------------------------------------------ find the skills

const setupSkillDirs = walk(SETUP).filter((f) => path.basename(f) === 'SKILL.md' && !inside(f, SALESFORCE)).map(path.dirname);
const modelSkillDirs = walk(SALESFORCE_SKILLS).filter((f) => path.basename(f) === 'SKILL.md').map(path.dirname);
// The plugin's own skills beside project-setup (the tool list): on in every folder, never copied into a project.
const pluginSkillDirs = walk(path.dirname(SETUP)).filter((f) => path.basename(f) === 'SKILL.md' && !inside(f, SETUP)).map(path.dirname);
const skills = [...setupSkillDirs.map((dir) => ({ dir, model: false })), ...pluginSkillDirs.map((dir) => ({ dir, model: false })), ...modelSkillDirs.map((dir) => ({ dir, model: true }))];
const allDirs = skills.map((s) => s.dir);
const names = new Set([...skills.map((s) => path.basename(s.dir)), ...indexNames]);
const projectRoots = PROJECT_FOLDERS.map((f) => path.join(ASSETS, f));
for (const root of projectRoots) if (!fs.existsSync(root)) report('error', root, 'this setup folder is missing');

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
    if (!NAME.test(name ?? '') || name.length > MAX_NAME) report(level, skillFile, `name "${name}" must be lowercase letters, digits, and single hyphens, at most ${MAX_NAME} characters`);
    if (/anthropic|claude/.test(name ?? '')) report(level, skillFile, `name "${name}" must not contain "anthropic" or "claude"`);
    const rawDescription = fm.raw.get('description') ?? '';
    const quoted = rawDescription.match(/^'((?:[^']|'')*)'$/);
    if (!quoted) report(level, skillFile, 'the description is not one single-quoted line');
    description = quoted ? quoted[1].replace(/''/g, "'") : rawDescription;
    if (description.length >= MAX_DESCRIPTION) report(level, skillFile, `the description is ${description.length} characters; it must be under ${MAX_DESCRIPTION}`);
    if (!VERB.test(description)) report(level, skillFile, `the description must start with a third-person verb that says what the skill does ("Saves", "Reports"); it starts "${description.slice(0, 30)}"`);
    if (!USE.test(description)) report(level, skillFile, 'the description has no sentence starting with "Use" that says when to use the skill');
    for (const m of description.matchAll(/; use ([a-z][a-z0-9-]*)/g)) if (!names.has(m[1])) report(level, skillFile, `the description sends the agent to "${m[1]}", which is no skill`);
    const bodyLines = text.split('\n').length - 1 - fm.close - (text.endsWith('\n') ? 1 : 0);
    if (bodyLines >= MAX_BODY_LINES) report(level, skillFile, `the body is ${bodyLines} lines; it must be under ${MAX_BODY_LINES}: move details into references/`);
  }
  for (const [re, label] of LITERAL) if (re.test(text)) report(level, skillFile, `uses ${label}, which Codex shows as literal text`);

  // The index: every skill has a row for its folder, with its name and its description word for word.
  const row = index.get(path.resolve(dir));
  if (!row) report('error', INDEX, `${folderName} has no row for its folder ${shown(dir)}`);
  else {
    if (row.name !== folderName) report('error', INDEX, `line ${row.line}: the row for ${row.folder} names ${row.name}, but the skill there is ${folderName}`);
    if (description !== null && row.description !== description) report('error', INDEX, `line ${row.line}: the description of ${folderName} (${row.folder}) differs from its SKILL.md`);
  }

  // The skill's own files: nested skills and the setup folders are checked on their own.
  const own = walk(dir).filter((f) => !allDirs.some((d) => d !== dir && inside(f, d) && inside(d, dir)) && !(dir === SETUP && projectRoots.some((r) => inside(f, r))));
  // A bare `assets/` or `references/` in a sentence names the folder, not what is in it.
  const linked = namedPaths(text).map((x) => x.path.replace(/\/$/, '')).filter((l) => l.includes('/'));
  if (dir === SETUP) for (const folder of PROJECT_FOLDERS) if (!linked.includes(`assets/${folder}`)) report('error', skillFile, `the References table does not link assets/${folder}/, so the agent never opens it`);
  for (const f of own) {
    const rel = posix(path.relative(dir, f));
    if (rel !== 'SKILL.md' && !linked.some((l) => rel === l || rel.startsWith(`${l}/`))) report(level, f, 'SKILL.md does not link this file, so the agent never opens it; add it to the References table');
  }
  for (const f of own.filter((x) => x.endsWith('.md'))) {
    const body = read(f);
    for (const x of namedPaths(body)) {
      if (x.path.startsWith('../')) { report(level, f, `line ${x.n}: ${x.path} leaves the skill folder`); continue; }
      if (x.span && !(f === skillFile && x.table)) continue; // prose code spans may name project paths
      const target = path.join(dir, x.path);
      if (!fs.existsSync(target) && !fs.existsSync(path.join(path.dirname(f), x.path))) report(level, f, `line ${x.n}: ${x.path} does not exist`);
    }
    const rel = posix(path.relative(dir, f));
    const lines = body.split('\n').length - (body.endsWith('\n') ? 1 : 0);
    if (/^(references|examples)\//.test(rel) && lines > CONTENTS_OVER) {
      const heading = proseLines(body).find((l) => /^#{2,6}\s/.test(l.text));
      if (!heading || !/^#{2,6}\s+(?:Table of )?Contents\s*$/i.test(heading.text)) report(level, f, `${lines} lines: a reference over ${CONTENTS_OVER} lines starts with a "## Contents" section`);
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

// ------------------------------------------------------------------ index rows, project files in the setup folders

for (const [dir, row] of index) {
  if (!fs.existsSync(path.join(dir, 'SKILL.md'))) report('error', INDEX, `line ${row.line}: ${row.name} has no SKILL.md in ${row.folder}`);
}
const folderOf = (rel) => PROJECT_FOLDERS.filter((f) => fs.existsSync(path.join(ASSETS, f, rel)));
// Every project path is in one setup folder, except a file the choices alternate.
const holders = new Map();
for (const folder of PROJECT_FOLDERS) {
  const root = path.join(ASSETS, folder);
  for (const f of walk(root)) {
    const rel = posix(path.relative(root, f));
    holders.set(rel, [...(holders.get(rel) ?? []), folder]);
  }
}
for (const [rel, folders] of holders) {
  if (folders.length > 1 && !ALTERNATIVES.some((group) => folders.every((f) => group.includes(f)))) report('error', ASSETS, `the project path ${rel} is in ${folders.join(' and ')}: a project path is in one setup folder, unless the choices exclude each other`);
}
{
  for (const [copy, original] of Object.entries(MODEL_COPIES)) {
    const a = path.join(SETUP, 'assets', copy);
    const homes = folderOf(original);
    const b = homes.length ? path.join(ASSETS, homes[0], original) : null;
    if (!fs.existsSync(a) || !b) report('error', a, `this copy or its project file ${original} is missing`);
    else if (read(a) !== read(b)) report('error', a, `differs from the project file ${shown(b)}; copy that file over it`);
  }
  // The Next action prompt is written by hand in two places; they must match.
  const pageFile = path.join(SETUP, 'references/notion-build/work-item-page.md');
  const templateFile = path.join(ASSETS, 'work-local/work-items/work-item-template/WORK-ITEM.md');
  const prompt = (text) => text.replace(/\\/g, '').match(/\*\*Next action:\*\* (.*?)(?:<br>|\n|$)/)?.[1];
  if (!fs.existsSync(pageFile) || !fs.existsSync(templateFile)) report('error', pageFile, `this file or ${shown(templateFile)} is missing, so the Next action prompts were not compared`);
  else {
    const page = prompt(read(pageFile));
    const template = prompt(read(templateFile));
    if (!page || !template) report('error', page ? templateFile : pageFile, 'has no "**Next action:**" prompt');
    else if (page !== template) report('error', pageFile, `its Next action prompt (backslashes removed) differs from the work item template's WORK-ITEM.md: "${page}" against "${template}"`);
  }
}

// ------------------------------------------------------------------ setup lists kept by hand

{
  const copyFile = path.join(SETUP, 'references/setup-copy.md');
  const hooksFile = path.join(SETUP, 'references/skills-hooks-settings.md');
  const interviewFile = path.join(SETUP, 'references/interview.md');
  const copyText = read(copyFile);
  const hooksText = read(hooksFile);
  let modelSf = 0;
  const ticks = (text) => [...text.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]);
  const dirs = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort() : []);
  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  const skillsOf = (folder) => dirs(path.join(ASSETS, folder, '.claude/skills'));

  // The Salesforce list: the bullets under "The Salesforce list", up to the first line that is not a bullet or its continuation.
  const at = copyText.indexOf('The Salesforce list (');
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
    for (const t of paths) if (!fs.existsSync(path.join(SALESFORCE, t))) report('error', copyFile, `its Salesforce list names ${t}, which the salesforce folder does not have`);
    for (const t of rules) if (!fs.existsSync(path.join(SALESFORCE, '.claude/rules', t))) report('error', copyFile, `its Salesforce list names the rule ${t}, which the salesforce folder does not have`);
    const salesforceTop = new Set(paths.map((t) => t.split('/')[0]));
    for (const name of fs.readdirSync(SALESFORCE)) if (!salesforceTop.has(name)) report('error', copyFile, `the salesforce folder has the top-level path ${name}, which the Salesforce list does not name: add it to the list`);
    for (const name of fs.readdirSync(EVERY)) if (name !== '.claude' && salesforceTop.has(name)) report('error', copyFile, `every-project has the top-level path ${name}, which the Salesforce list gives to the salesforce folder`);
    const ruleDir = path.join(SALESFORCE, '.claude/rules');
    if (fs.existsSync(ruleDir)) for (const name of fs.readdirSync(ruleDir)) if (!rules.includes(name)) report('error', copyFile, `the salesforce folder has the rule ${name}, which the Salesforce list does not name: add it to the list`);
    const hookDir = path.join(SALESFORCE, '.claude/hooks');
    if (fs.existsSync(hookDir)) for (const name of fs.readdirSync(hookDir)) if (!paths.includes(`.claude/hooks/${name}`)) report('error', copyFile, `the salesforce folder has the hook ${name}, which the Salesforce list does not name: add it to the list`);
    const everySf = skillsOf('every-project').filter((n) => n.startsWith('sf-'));
    if (everySf.length) report('error', copyFile, `every-project has the Salesforce skills ${everySf.join(', ')}: they belong in the salesforce folder`);
    const sfSkills = skillsOf('salesforce');
    for (const name of sfSkills) if (!name.startsWith('sf-')) report('error', copyFile, `the salesforce folder has the skill ${name}, but the Salesforce list takes only sf-* folders`);
    const row = hooksText.split('\n').find((l) => l.startsWith('| Salesforce |')) ?? '';
    const rowSkills = ticks(row).filter((t) => t.startsWith('sf-')).sort();
    if (!same(rowSkills, sfSkills.filter((n) => n.startsWith('sf-')))) report('error', hooksFile, `its Salesforce row names ${rowSkills.join(', ') || 'no Salesforce skills'}, but the salesforce folder has ${sfSkills.join(', ')}`);
    modelSf = sfSkills.filter((n) => n.startsWith('sf-')).length;
  }

  // The files that hold setup markers.
  const markerPara = copyText.split(/\n\s*\n/).find((p) => p.startsWith('These are the files that hold markers'));
  const modelMarked = [...new Set(projectRoots.flatMap((root) => walk(root).filter((f) => fs.lstatSync(f).isFile() && read(f).includes('<!-- if ')).map((f) => posix(path.relative(root, f)))))].sort();
  if (!markerPara) report('error', copyFile, 'has no paragraph starting "These are the files that hold markers"');
  else {
    const named = ticks(markerPara.split('; the grep')[0]).sort();
    if (!same(named, modelMarked)) report('error', copyFile, `its list of files that hold setup markers is ${named.join(', ')}, but the setup folders' files are ${modelMarked.join(', ')}`);
  }

  // The shared skills, each folder's skills, and the counts.
  const shared = hooksText.replace(/\s+/g, ' ').match(/The shared skills are the same in every project \((\d+)\): ([^.]*)\./);
  const sharedDirs = skillsOf('every-project');
  if (!shared) report('error', hooksFile, 'has no "The shared skills are the same in every project (N): ..." sentence in the expected shape');
  else {
    const named = ticks(shared[2]).sort();
    if (Number(shared[1]) !== named.length || !same(named, sharedDirs)) report('error', hooksFile, `it lists ${shared[1]} shared skills (${named.length} names), but assets/every-project/.claude/skills holds ${sharedDirs.length}: ${sharedDirs.join(', ')}`);
  }
  // Each row of the choices table names one or more folders; its Skills cell names what they hold.
  const rowFolders = new Set();
  for (const line of hooksText.split('\n')) {
    const cells = line.split('|');
    const folders = line.startsWith('|') ? [...new Set([...(cells[2] ?? '').matchAll(/assets\/([\w-]+)\//g)].map((m) => m[1]))] : [];
    if (!folders.length) continue;
    folders.forEach((f) => rowFolders.add(f));
    const named = ticks(cells[3] ?? '').filter((t) => !t.includes('.')).sort();
    const actual = folders.flatMap((f) => skillsOf(f)).sort();
    if (!same(named, actual)) report('error', hooksFile, `its row for ${folders.join(' and ')} names ${named.join(', ')}, but the folders hold ${actual.join(', ')}`);
  }
  for (const folder of PROJECT_FOLDERS.filter((f) => f !== 'every-project')) if (skillsOf(folder).length && !rowFolders.has(folder)) report('error', hooksFile, `no row of its choices table names assets/${folder}/, so its skills are never listed`);
  const interview = read(interviewFile).replace(/\s+/g, ' ').match(/(\d+) shared, plus (\d+) for the work tracking set, plus (\d+) for local or Notion memory \(none for Hindsight\), plus (\d+) for Notion work items or memory \(`using-notion-cli`, once\), plus (\d+) for Salesforce/);
  if (!interview) report('error', interviewFile, 'has no "N shared, plus N for the work tracking set, ..." sentence in the expected shape');
  else {
    const count = (folder) => skillsOf(folder).length;
    const want = [sharedDirs.length, Math.max(...['work-local', 'work-notion', 'work-github'].map(count)), count('memory-process') + Math.max(...['memory-local', 'memory-notion'].map(count)), count('notion-tools'), modelSf];
    if (interview.slice(1).map(Number).join() !== want.join()) report('error', interviewFile, `its skill counts are ${interview.slice(1).join(', ')}, but the folders give ${want.join(', ')}`);
  }
}

// ------------------------------------------------------------------ report

const errors = findings.filter((x) => x.level === 'error');
const warnings = findings.filter((x) => x.level === 'warning');
console.log(`check-skills: ${skills.length} skills checked (${setupSkillDirs.length} in project-setup, ${pluginSkillDirs.length} beside it in the plugin, ${modelSkillDirs.length} from the salesforce folder), ${index.size} rows in dev/SKILL-INDEX.md.`);
for (const x of [...errors, ...warnings]) console.log(`${x.level === 'error' ? 'Error' : 'Warning'}: ${x.file}: ${x.message}`);
for (const n of notes) console.log(`Note: ${n}`);
if (warnings.length) console.log('Warnings do not fail the run. They are on the model\'s own skills, which are Mike\'s text: a change there needs his yes.');
console.log(`check-skills: ${errors.length ? 'failed' : 'passed'}, ${errors.length} error${errors.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`);
process.exit(errors.length ? 1 : 0);

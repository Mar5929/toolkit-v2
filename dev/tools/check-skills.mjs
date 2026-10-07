#!/usr/bin/env node
// check-skills.mjs: checks the skills that project-setup copies into projects. Dev only, not shipped.
//
// Usage: node dev/tools/check-skills.mjs
//
// The setup folders (every-project, work-local, salesforce, and the others, in
// plugins/toolkit/skills/project-setup/assets/) hold project files at the paths a project
// has them. The list of setup folders is read from the table "Folders the choices add" in
// project-setup's references/setup-copy.md, the table the agent acts on, plus every-project.
// Each work choice adds files inside managing-work-items; each local or Notion memory choice
// adds files inside managing-project-memory. Their common SKILL.md files come from
// every-project and memory-process. Every other project path is in exactly one folder.
//
// For project-setup and every SKILL.md under it, the plugin's other skill beside
// project-setup (writing-harness-files), plus the Salesforce
// folder's .claude/skills/ (the model's own project skills; every-project/.agents/skills is a
// link that onboarding never copies):
//   - the frontmatter holds only name and description, and name equals the folder name;
//   - the name is lowercase letters, digits, and hyphens, at most 64 characters, and holds
//     neither "anthropic" nor "claude";
//   - the description is single-quoted on one line, under 500 characters, starts with a
//     third-person verb that says what the skill does, and has a sentence that starts with
//     "Use" saying when to use it; every "; use <skill>" names a skill that exists;
//   - the SKILL.md body (after the frontmatter) is under 500 lines;
//   - the description and folder match dev/SKILL-INDEX.md word for word (the three work
//     tracking folders each hold a skill named using-work-tracker, so a name may have one row
//     per folder);
//   - no when_to_use, $ARGUMENTS, !`command`, or ${CLAUDE_*}: Codex shows them as text;
//   - SKILL.md links every file in the skill folder (a link to a folder covers what is in it),
//     every link resolves, and no link leaves the folder with ../;
//   - a Markdown file in references/ or examples/ over 100 lines has "## Contents" as its first
//     section, except a copy of a rule (RULE_COPIES), which must equal the rule;
//   - no file names a command of the retired toolkit program; the hook commands in every setup
//     folder's .claude/hooks/ are checked the same way;
//   - a file whose first line names a dev/build-shared/ source equals that source after the
//     first line;
//   - a skill asset copied from a project file (MODEL_COPIES) equals that file;
//   - a skill file that is an exact copy of a project rule (RULE_COPIES) is one comment line that
//     names the rule, a blank line, and then the rule's whole text: today the writing rule in
//     writing-harness-files/references/writing-rule.md;
//   - every folder under assets/ except settings/ is every-project or a folder that a row of
//     the setup-copy.md table names, and every folder the table names exists;
//   - a folder is in one row of that table, except notion-tools and memory-process, which two
//     choices share; and each word of such a folder's name (work-local: "work", "local") is in
//     its row's Choice cell, so two folders swapped between rows fail;
//   - the skillOverrides list in this repository's .claude/settings.json sets every project
//     skill name to "off" and names nothing else;
//   - the list of the kinds of harness file in writing-harness-files/SKILL.md is, word for word,
//     in the repository AGENTS.md (twice) and README.md; each kind is in that skill's description;
//     and each kind has a "## " section in its references/checklist.md;
//   - the Salesforce entries that setup-copy.md tells setup to take out of a project's
//     .claude/settings.json are the Salesforce entries every-project/.claude/settings.json holds:
//     each sf or sfdx permission rule, and each hook command under tools/ or named guard-*;
//   - no project path is in two setup folders, except the two storage skills named above;
//   - no file under assets/ holds a setup marker ("<!-- if " or "<!-- endif"): a choice decides
//     which files a project gets, never which lines inside a file;
//   - the lists that skills-hooks-settings.md and interview.md keep by hand match the setup
//     folders: the shared skills, the skills of each choice (each row of the skills table is
//     matched by its Choice cell to the row of the setup-copy.md table, and names exactly the
//     skills that row's folders hold), a skills row for every choice whose folders hold skills,
//     and the skill counts; every-project holds no sf-* skill and the salesforce folder holds
//     no other;
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
const COPY_FILE = path.join(SETUP, 'references/setup-copy.md');
const REPO_SETTINGS = path.join(ROOT, '.claude/settings.json');
// The one folder under assets/ that holds no project files: the settings snippets.
const NOT_PROJECT_FOLDERS = ['settings'];
// The table the agent acts on: each choice and the folders setup copies for it (setup-copy.md, "Folders the choices add").
const CHOICE_ROWS = [];
{
  const section = fs.readFileSync(COPY_FILE, 'utf8').split(/^## /m).find((s) => s.startsWith('Folders the choices add')) ?? '';
  for (const line of section.split('\n')) {
    const cells = line.startsWith('|') ? line.split('|').map((c) => c.trim()) : [];
    if (cells.length < 4 || cells[1] === 'Choice' || /^-+$/.test(cells[1])) continue;
    CHOICE_ROWS.push({ choice: cells[1], folders: [...cells[2].matchAll(/`([\w-]+)`/g)].map((m) => m[1]) });
  }
}
// The two folders that two choices share. Every other folder is in one row of the table.
const SHARED_FOLDERS = ['notion-tools', 'memory-process'];
// The folders that hold files at the paths a project has them. The first is copied for every project.
const PROJECT_FOLDERS = ['every-project', ...new Set(CHOICE_ROWS.flatMap((row) => row.folders))];
// The merged skill folders have common files and one selected set of storage references.
const ALTERNATIVES = [
  { folders: ['every-project', 'work-local', 'work-notion', 'work-github'], under: '.claude/skills/managing-work-items/' },
  { folders: ['memory-process', 'memory-local', 'memory-notion'], under: '.claude/skills/managing-project-memory/' },
];
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
  [`${SHARED}/managing-work-items/assets/work-item-template.md`]: 'work-items/work-item-template/WORK-ITEM.md',
  [`${SHARED}/managing-work-items/assets/design-template.md`]: 'work-items/work-item-template/DESIGN.md',
};

// Skill files that are exact copies of a project rule: path from the repository root -> the rule it copies.
// A plugin skill reads only files in its own folder, so it holds the rule's text itself. The rule is the source.
const RULE_COPIES = {
  'plugins/toolkit/skills/writing-harness-files/references/writing-rule.md': 'plugins/toolkit/skills/project-setup/assets/every-project/.claude/rules/document-clarity-standard.md',
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

// Rows are keyed by folder. Choice folders contribute references to the shared skills.
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
// The plugin's own skills beside project-setup (today only writing-harness-files): on in every folder, never copied into a project.
const pluginSkillDirs = walk(path.dirname(SETUP)).filter((f) => path.basename(f) === 'SKILL.md' && !inside(f, SETUP)).map(path.dirname);
const skills = [...setupSkillDirs.map((dir) => ({ dir, model: false })), ...pluginSkillDirs.map((dir) => ({ dir, model: false })), ...modelSkillDirs.map((dir) => ({ dir, model: true }))];
const allDirs = skills.map((s) => s.dir);
const names = new Set([...skills.map((s) => path.basename(s.dir)), ...indexNames]);
const projectRoots = PROJECT_FOLDERS.map((f) => path.join(ASSETS, f));
if (!CHOICE_ROWS.length) report('error', COPY_FILE, 'has no table under "## Folders the choices add" in the expected shape (| Choice | Folders to copy |); update this check when the table changes');
for (const root of projectRoots) if (!fs.existsSync(root)) report('error', COPY_FILE, `its table "Folders the choices add" names ${path.basename(root)}, but ${shown(root)} does not exist`);
for (const folder of new Set(CHOICE_ROWS.flatMap((row) => row.folders))) {
  const rows = CHOICE_ROWS.filter((row) => row.folders.includes(folder)).map((row) => `"${row.choice}"`);
  if (folder === 'every-project') report('error', COPY_FILE, `its table "Folders the choices add" names every-project in the row ${rows.join(' and ')}: that folder is copied for every project, before the table`);
  else if (rows.length > 1 && !SHARED_FOLDERS.includes(folder)) report('error', COPY_FILE, `its table "Folders the choices add" names ${folder} in the rows ${rows.join(' and ')}: a setup folder belongs to one choice; only ${SHARED_FOLDERS.join(' and ')} are in two rows`);
}
// A setup folder is named for its choice, so a folder written into the wrong row is found by its name.
for (const row of CHOICE_ROWS) {
  for (const folder of row.folders.filter((f) => !SHARED_FOLDERS.includes(f))) {
    const missing = folder.split('-').filter((word) => !row.choice.toLowerCase().includes(word));
    if (missing.length) report('error', COPY_FILE, `its table "Folders the choices add" gives the choice "${row.choice}" the folder ${folder}, but "${missing.join('", "')}" is not in that choice's name: a setup folder is named for its choice, so this folder is in the wrong row`);
  }
}
for (const e of fs.readdirSync(ASSETS, { withFileTypes: true })) {
  if (e.isDirectory() && !NOT_PROJECT_FOLDERS.includes(e.name) && !PROJECT_FOLDERS.includes(e.name)) report('error', path.join(ASSETS, e.name), 'no row of the table "Folders the choices add" in setup-copy.md names this folder, so setup never copies it and no check covers its files: add it to a row');
}

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
      if (x.path.startsWith('../') && !inside(path.resolve(path.dirname(f), x.path), dir)) { report(level, f, `line ${x.n}: ${x.path} leaves the skill folder`); continue; }
      if (x.span && !(f === skillFile && x.table)) continue; // prose code spans may name project paths
      const target = path.join(dir, x.path);
      const installed = ALTERNATIVES.some((group) => inside(f, path.join(ASSETS, group.folders[0], group.under.replace(/\/$/, ''))) && group.folders.slice(1).every((folder) => fs.existsSync(path.join(ASSETS, folder, group.under, x.path))));
      if (!fs.existsSync(target) && !fs.existsSync(path.join(path.dirname(f), x.path)) && !installed) report(level, f, `line ${x.n}: ${x.path} does not exist`);
    }
    const rel = posix(path.relative(dir, f));
    const lines = body.split('\n').length - (body.endsWith('\n') ? 1 : 0);
    // A copy of a rule must equal the rule, so it cannot start with a Contents list: it is exempt.
    const ruleCopy = Object.keys(RULE_COPIES).includes(posix(path.relative(ROOT, f)));
    if (/^(references|examples)\//.test(rel) && lines > CONTENTS_OVER && !ruleCopy) {
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

// ------------------------------------------------------------------ the hook commands

// A hook command runs in every session of a project, so it must not call the retired program either.
for (const folder of PROJECT_FOLDERS) {
  for (const f of walk(path.join(ASSETS, folder, '.claude/hooks')).filter((x) => TEXT_FILE.test(x))) {
    const lines = read(f).split('\n');
    const hits = lines.flatMap((line, i) => (TOOLKIT_COMMAND.test(line) ? [i + 1] : []));
    if (hits.length) report('error', f, `names a command of the retired toolkit program on line${hits.length > 1 ? 's' : ''} ${hits.join(', ')}: ${lines[hits[0] - 1].trim().slice(0, 80)}`);
  }
}

// ------------------------------------------------------------------ index rows, project files in the setup folders

for (const [dir, row] of index) {
  if (!fs.existsSync(path.join(dir, 'SKILL.md'))) report('error', INDEX, `line ${row.line}: ${row.name} has no SKILL.md in ${row.folder}`);
}
const folderOf = (rel) => PROJECT_FOLDERS.filter((f) => fs.existsSync(path.join(ASSETS, f, rel)));
// Every project path is in one setup folder, except the files of the two storage skills.
const holders = new Map();
for (const folder of PROJECT_FOLDERS) {
  const root = path.join(ASSETS, folder);
  for (const f of walk(root)) {
    const rel = posix(path.relative(root, f));
    holders.set(rel, [...(holders.get(rel) ?? []), folder]);
  }
}
for (const [rel, folders] of holders) {
  if (folders.length > 1 && !ALTERNATIVES.some((group) => rel.startsWith(group.under) && folders.every((f) => group.folders.includes(f)))) report('error', ASSETS, `the project path ${rel} is in ${folders.join(' and ')}: a project path is in one setup folder unless the files are parts of managing-work-items or managing-project-memory`);
}
// Choice folders contain only fragments of the merged skills, without their own SKILL.md.
// Check those files directly; the SKILL.md loop above cannot see them.
for (const [folder, skill, anchor] of [
  ...['work-local', 'work-notion', 'work-github'].map((folder) => [folder, 'managing-work-items', 'references/work-tracker.md']),
  ...['memory-local', 'memory-notion'].map((folder) => [folder, 'managing-project-memory', 'references/memory-store.md']),
]) {
  const root = path.join(ASSETS, folder, '.claude/skills', skill);
  const entry = path.join(root, anchor);
  if (!fs.existsSync(entry)) { report('error', root, `the selected ${anchor} is missing`); continue; }
  const linked = namedPaths(read(entry)).filter((x) => !x.span).map((x) => posix(path.relative(root, path.resolve(path.dirname(entry), x.path))));
  for (const file of walk(root)) {
    const rel = posix(path.relative(root, file));
    if (file !== entry && !linked.some((link) => rel === link || rel.startsWith(`${link}/`))) report('error', file, `${anchor} does not link this selected reference or asset`);
    if (!TEXT_FILE.test(file)) continue;
    const body = read(file);
    const lines = body.split('\n');
    if (skill === 'managing-work-items' && /(?<!work-tracker-)\b(?:gh-commands|issue-layout|labels|field-mapping|folders-and-files|project-roadmap-and-tasks|database-layout|page-layout|searching)\.md\b/.test(body)) {
      report('error', file, 'names a work tracker reference by its old filename; use its work-tracker- filename');
    }
    const hits = lines.flatMap((line, i) => (TOOLKIT_COMMAND.test(line) ? [i + 1] : []));
    if (hits.length) report('error', file, `names a command of the retired toolkit program on line${hits.length > 1 ? 's' : ''} ${hits.join(', ')}`);
    const source = lines[0].match(/dev\/build-shared\/([\w./-]+\.md)/);
    if (source) {
      const shared = path.join(ROOT, 'dev/build-shared', source[1]);
      if (!fs.existsSync(shared) || read(shared).split('\n').slice(1).join('\n') !== lines.slice(1).join('\n')) report('error', file, `differs from its shared source ${shown(shared)}`);
    }
    if (file.endsWith('.md') && rel.startsWith('references/') && lines.length - (body.endsWith('\n') ? 1 : 0) > CONTENTS_OVER) {
      const heading = proseLines(body).find((line) => /^#{2,6}\s/.test(line.text));
      if (!heading || !/^#{2,6}\s+(?:Table of )?Contents\s*$/i.test(heading.text)) report('error', file, `a reference over ${CONTENTS_OVER} lines must start with a Contents section`);
    }
  }
}
if (/(?<!work-tracker-)\b(?:gh-commands|issue-layout|labels|project-roadmap-and-tasks|searching)\.md\b/.test(read(path.join(SETUP, 'references/github.md')))) {
  report('error', path.join(SETUP, 'references/github.md'), 'names a GitHub work tracker reference by its old filename');
}
// Read the skills as a project will receive them. The shared indexes refer to one selected
// work tracker and, for local or Notion memory, one selected memory store. Check every
// supported pairing so a link cannot work only with the choice used by its writer.
for (const work of ['work-local', 'work-notion', 'work-github']) {
  for (const memory of ['memory-local', 'memory-notion', 'memory-hindsight']) {
    const selected = ['every-project', work, ...(memory === 'memory-hindsight' ? [memory] : ['memory-process', memory])];
    const files = new Map();
    for (const folder of selected) {
      const root = path.join(ASSETS, folder);
      for (const file of walk(root)) files.set(posix(path.relative(root, file)), file);
    }
    for (const name of ['managing-work-items', ...(memory === 'memory-hindsight' ? [] : ['managing-project-memory'])]) {
      const skill = `.claude/skills/${name}`;
      if (!files.has(`${skill}/SKILL.md`)) report('error', ASSETS, `${work} with ${memory} has no ${name}/SKILL.md`);
      const anchor = `${skill}/references/${name === 'managing-work-items' ? 'work-tracker' : 'memory-store'}.md`;
      if (!files.has(anchor)) report('error', ASSETS, `${work} with ${memory} has no selected ${anchor}`);
      for (const [rel, file] of files) {
        if (!rel.startsWith(`${skill}/`) || !rel.endsWith('.md')) continue;
        for (const link of namedPaths(read(file)).filter((x) => !x.span)) {
          const fromFile = posix(path.normalize(path.join(path.dirname(rel), link.path)));
          const fromSkill = posix(path.normalize(path.join(skill, link.path)));
          if (!files.has(fromFile) && !files.has(fromSkill) && ![...files.keys()].some((key) => key.startsWith(`${fromFile}/`) || key.startsWith(`${fromSkill}/`))) {
            report('error', file, `line ${link.n}: ${link.path} is absent when setup selects ${work} and ${memory}`);
          }
        }
      }
    }
  }
}
// No file under assets/ holds a setup marker: a choice decides which files a project gets, never which lines.
for (const f of walk(ASSETS)) {
  if (!fs.lstatSync(f).isFile()) continue;
  const lines = read(f).split('\n');
  const hits = lines.flatMap((line, i) => (/<!-- (?:if |endif)/.test(line) ? [i + 1] : []));
  if (hits.length) report('error', f, `holds a setup marker on line${hits.length > 1 ? 's' : ''} ${hits.join(', ')}: put the text in a file only that choice gets, or write one sentence that is true for every choice`);
}
{
  for (const [copy, original] of Object.entries(MODEL_COPIES)) {
    const a = path.join(SETUP, 'assets', copy);
    const homes = folderOf(original);
    const b = homes.length ? path.join(ASSETS, homes[0], original) : null;
    if (!fs.existsSync(a) || !b) report('error', a, `this copy or its project file ${original} is missing`);
    else if (read(a) !== read(b)) report('error', a, `differs from the project file ${shown(b)}; copy that file over it`);
  }
  // A copy of a rule: its first line names the rule, its second line is blank, and the rest is the rule, whole.
  for (const [copy, rule] of Object.entries(RULE_COPIES)) {
    const a = path.join(ROOT, copy);
    const b = path.join(ROOT, rule);
    if (!fs.existsSync(a) || !fs.existsSync(b)) { report('error', a, `this copy or the rule it copies, ${rule}, is missing`); continue; }
    const [first, second, ...rest] = read(a).split('\n');
    if (!first.startsWith('<!--') || !first.includes(rule)) report('error', a, `its first line must be a comment that names the rule it copies, ${rule}`);
    if (second !== '' || rest.join('\n') !== read(b)) report('error', a, `differs from the rule ${rule}: edit the rule, then copy it over this file below its first line and one blank line`);
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
  const hooksFile = path.join(SETUP, 'references/skills-hooks-settings.md');
  const interviewFile = path.join(SETUP, 'references/interview.md');
  const hooksText = read(hooksFile);
  const ticks = (text) => [...text.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]);
  const dirs = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort() : []);
  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  const skillsOf = (folder) => dirs(path.join(ASSETS, folder, '.claude/skills')).filter((name) => fs.existsSync(path.join(ASSETS, folder, '.claude/skills', name, 'SKILL.md')));

  // The Salesforce skills are the model's own: every one is in the salesforce folder, and nothing else is.
  const everySf = skillsOf('every-project').filter((n) => n.startsWith('sf-'));
  if (everySf.length) report('error', EVERY, `every-project has the Salesforce skills ${everySf.join(', ')}: they belong in the salesforce folder`);
  const sfSkills = skillsOf('salesforce');
  for (const name of sfSkills) if (!name.startsWith('sf-')) report('error', SALESFORCE, `the salesforce folder has the skill ${name}, but only sf-* skills are the Salesforce folder's own`);

  // The shared skills.
  const shared = hooksText.replace(/\s+/g, ' ').match(/The shared skills are the same in every project \((\d+)\): ([^.]*)\./);
  const sharedDirs = skillsOf('every-project');
  if (!shared) report('error', hooksFile, 'has no "The shared skills are the same in every project (N): ..." sentence in the expected shape');
  else {
    const named = ticks(shared[2]).sort();
    if (Number(shared[1]) !== named.length || !same(named, sharedDirs)) report('error', hooksFile, `it lists ${shared[1]} shared skills (${named.length} names), but assets/every-project/.claude/skills holds ${sharedDirs.length}: ${sharedDirs.join(', ')}`);
  }

  // The skills table: | Choice | Skills |. Each row is matched by its Choice cell to the row of the table the agent
  // acts on (setup-copy.md, "Folders the choices add"), and names exactly the skills that row's folders hold.
  const skillRows = new Map();
  const tableAt = hooksText.split('\n').findIndex((l) => /^\|\s*Choice\s*\|\s*Skills\s*\|\s*$/.test(l));
  if (tableAt === -1) report('error', hooksFile, 'has no table with the header "| Choice | Skills |"');
  else for (const line of hooksText.split('\n').slice(tableAt + 2)) {
    if (!line.startsWith('|')) break;
    const cells = line.split('|').map((c) => c.trim());
    if (/assets\//.test(line)) report('error', hooksFile, `its skills row "${cells[1]}" names a folder in assets/: the choice-to-folders table is kept only in setup-copy.md`);
    skillRows.set(cells[1], ticks(cells[2] ?? '').filter((t) => !t.includes('.')).sort());
  }
  for (const [choice, named] of skillRows) {
    const row = CHOICE_ROWS.find((r) => r.choice === choice);
    if (!row) { report('error', hooksFile, `its skills row "${choice}" matches no row of the table "Folders the choices add" in setup-copy.md`); continue; }
    const actual = row.folders.flatMap((f) => skillsOf(f)).sort();
    if (!same(named, actual)) report('error', hooksFile, `its skills row "${choice}" names ${named.join(', ') || 'no skills'}, but the folders setup-copy.md gives that choice (${row.folders.join(', ')}) hold ${actual.join(', ') || 'no skills'}`);
  }
  if (tableAt !== -1) for (const row of CHOICE_ROWS) {
    if (row.folders.some((f) => skillsOf(f).length) && !skillRows.has(row.choice)) report('error', hooksFile, `its skills table has no row "${row.choice}", but the folders setup-copy.md gives that choice (${row.folders.join(', ')}) hold skills`);
  }

  // The skill counts in the plan the owner confirms.
  const interview = read(interviewFile).replace(/\s+/g, ' ').match(/(\d+) shared, plus (\d+) for local or Notion memory \(none for Hindsight\), plus (\d+) for Notion work items or memory \(`using-notion-cli`, once\), plus (\d+) for Salesforce/);
  if (!interview) report('error', interviewFile, 'has no "N shared, plus N for local or Notion memory, ..." sentence in the expected shape');
  else {
    const count = (folder) => skillsOf(folder).length;
    const want = [sharedDirs.length, count('memory-process'), count('notion-tools'), sfSkills.filter((n) => n.startsWith('sf-')).length];
    if (interview.slice(1).map(Number).join() !== want.join()) report('error', interviewFile, `its skill counts are ${interview.slice(1).join(', ')}, but the folders give ${want.join(', ')}`);
  }
}

// ------------------------------------------------------------------ this repository's skillOverrides

// A session on this repository loads a project skill once it reads a file in a setup folder, unless
// .claude/settings.json sets that skill's name to "off". The list is kept by hand, so compare it.
{
  const projectSkills = [...new Set([...setupSkillDirs.filter((dir) => dir !== SETUP), ...modelSkillDirs].map((dir) => path.basename(dir)))].sort();
  let overrides = null;
  try { overrides = JSON.parse(read(REPO_SETTINGS)).skillOverrides ?? {}; } catch (e) { report('error', REPO_SETTINGS, `cannot be read as JSON (${e.message}), so its skillOverrides list was not compared`); }
  if (overrides) {
    for (const name of projectSkills) if (overrides[name] !== 'off') report('error', REPO_SETTINGS, `skillOverrides does not set the project skill ${name} to "off": a session that reads a file under project-setup/assets/ would load it`);
    for (const name of Object.keys(overrides)) if (!projectSkills.includes(name)) report('error', REPO_SETTINGS, `skillOverrides names ${name}, which is no project skill under project-setup/assets/: remove it, or correct the name`);
  }
}

// ------------------------------------------------------------------ the kinds of harness file

// The list of the kinds of harness file is kept by hand in several places. The skill's SKILL.md
// holds the one list; every other place must agree with it.
{
  const skillDir = path.join(ROOT, 'plugins/toolkit/skills/writing-harness-files');
  const skillFile = path.join(skillDir, 'SKILL.md');
  const flat = (file) => read(file).replace(/\s+/g, ' ');
  const list = flat(skillFile).match(/It is one of these kinds: (a skill, .*?, or a [^.]+)\./)?.[1];
  if (!list) report('error', skillFile, 'has no sentence "It is one of these kinds: a skill, ..., or a ...": update this check when the sentence changes');
  else {
    for (const [file, times] of [[path.join(ROOT, 'AGENTS.md'), 2], [path.join(ROOT, 'README.md'), 1]]) {
      const found = flat(file).split(list).length - 1;
      if (found < times) report('error', file, `holds the list of the kinds of harness file ${found} time${found === 1 ? '' : 's'}, word for word as ${shown(skillFile)} gives it; it must hold it ${times === 1 ? 'once' : 'twice'}`);
    }
    // "a Codex `.rules` file" gives "Codex .rules file"; "an `AGENTS.md` or `CLAUDE.md`" gives "AGENTS.md or CLAUDE.md".
    const kinds = list.split(/, (?:or )?/).map((kind) => kind.replace(/^an? /, '').replace(/`/g, ''));
    const description = flat(skillFile).match(/description: '(.*?)' ---/)?.[1] ?? '';
    if (!description.includes('harness files') || !description.includes('Use before')) report('error', skillFile, 'its description must say what harness files it covers and when to use the skill');
    const sections = read(path.join(skillDir, 'references/checklist.md')).split('\n').filter((line) => line.startsWith('## ')).join('\n').toLowerCase();
    for (const kind of kinds) {
      if (!kind.split(' or ').every((part) => sections.includes(part.toLowerCase()))) report('error', path.join(skillDir, 'references/checklist.md'), `has no "## " section for the kind "${kind}"`);
    }
  }
}

// ------------------------------------------------------------------ the Salesforce entries setup takes out

// setup-copy.md lists by hand the Salesforce entries to delete from .claude/settings.json in a
// project that is not a Salesforce project. An entry the list lacks would stay in every project.
{
  const settingsFile = path.join(EVERY, '.claude/settings.json');
  const section = read(COPY_FILE).split(/^## /m).find((part) => part.startsWith('Salesforce entries in the settings file'));
  let settings = null;
  try { settings = JSON.parse(read(settingsFile)); } catch (e) { report('error', settingsFile, `cannot be read as JSON (${e.message})`); }
  if (!section) report('error', COPY_FILE, 'has no section "## Salesforce entries in the settings file"; update this check when the section is renamed');
  else if (settings) {
    const listed = new Set([...section.replace(/\s+/g, ' ').matchAll(/`([^`]+)`/g)].map((m) => m[1]));
    const rules = [...(settings.permissions?.deny ?? []), ...(settings.permissions?.ask ?? [])].filter((rule) => /^(?:Bash|PowerShell)\((?:sf|sfdx) /.test(rule));
    const commands = Object.values(settings.hooks ?? {}).flat().flatMap((group) => group.hooks ?? []).map((hook) => [hook.command, ...(hook.args ?? [])].join(' '))
      .flatMap((text) => text.match(/tools\/[\w./-]+|guard-[\w-]+\.cjs/g) ?? []);
    for (const entry of [...rules, ...commands]) if (!listed.has(entry)) report('error', COPY_FILE, `"Salesforce entries in the settings file" does not name ${entry}, which ${shown(settingsFile)} holds: setup would leave it in a project that is not a Salesforce project`);
    for (const entry of listed) if (/^(?:Bash|PowerShell)\((?:sf|sfdx) |^tools\/|^guard-/.test(entry) && ![...rules, ...commands].includes(entry)) report('error', COPY_FILE, `"Salesforce entries in the settings file" names ${entry}, which ${shown(settingsFile)} does not hold`);
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

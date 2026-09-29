#!/usr/bin/env node
// Copies shared text into the skill folders that need it.
//
//   node dev/tools/sync-skill-references.mjs                 write every copy, delete stale ones
//   node dev/tools/sync-skill-references.mjs --check         write nothing; exit 1 on any problem
//   node dev/tools/sync-skill-references.mjs --only work,memory   limit to skills in those plugins
//
// Why: a skill may read only files inside its own folder (Agent Skills
// specification, "File references"; Codex prefers files linked directly from
// SKILL.md). Text that several skills need has one source file, and this tool
// copies it into each skill's references/ or assets/ folder. Nobody edits a
// copy. dev/research/skill-audit.md section 5 is the design.
//
// dev/tools/check-skills.mjs imports syncSkillReferences() from this file and
// runs it with check: true, so both tools apply the same rules: a copy that
// is missing, differs from its source, or is no longer listed fails there too.
//
// The list of copies: dev/tools/shared-references.json, when it exists, and
// every dev/tools/shared-references/*.json. Each file holds
//   { "copies": [ { "source": "plugins/work/shared/approvals.md",
//                   "as": "references/approvals.md",           (optional)
//                   "skills": ["work/work-requirements", "git-workflows/merge-and-clean-up"] } ] }
// Without "as", the copy is references/<source file name>. One file per
// plugin keeps parallel edits apart: shared-references/work.json lists every
// copy that lands in a work skill.
//
// Allowed sources: plugins/*/shared/**, plugins/*/agents/*.md,
// plugins/toolkit/scaffold/model/** (the model copy; run
// dev/tools/import-model.mjs first), and plugins/toolkit/templates/** (the
// files the toolkit installs that the model does not hold, such as the Codex
// command rules). Allowed targets: plugins/*/skills/*/references/* and
// plugins/*/skills/*/assets/*, one level below the skill folder.
//
// Each copy is the source's bytes plus one header line that names the source.
// A Markdown, HTML, or XML copy gets the header as an HTML comment
// (<!-- Generated file. ... -->). A copy of a file whose comments start with
// # (HASH_COMMENT_EXTENSIONS: Codex .rules files, TOML, YAML, shell, Python)
// gets it as a # comment, because an HTML comment would break that file. Any
// other file type is refused: it has no comment the header could go in.
// When a Markdown source starts with a YAML frontmatter block (agent files,
// the model's templates), the header goes on the line after the closing ---,
// so the copy's frontmatter still parses. When a # source starts with a #!
// line, the header goes on the line after it. A file that carries the header
// but is no longer listed is deleted. A file without the header is never
// touched.
//
// After a run that changed files, raise the plugin's version in both
// manifests (and metadata.version in .claude-plugin/marketplace.json):
// Codex runs a copy filed under the version.
//
// Exit code 0 when everything is in step (or was written), 1 on any problem.
// Node 20+, no dependencies.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TOOL = 'dev/tools/sync-skill-references.mjs';
const MAIN_LIST = 'dev/tools/shared-references.json';
const LIST_DIR = 'dev/tools/shared-references';

export const HEADER_RE = /^(?:<!-- Generated file\. Source: (.+?)\. Edit the source, then run node dev\/tools\/sync-skill-references\.mjs\. -->|# Generated file\. Source: (.+?)\. Edit the source, then run node dev\/tools\/sync-skill-references\.mjs\.)$/;
const HTML_COMMENT_EXTENSIONS = new Set(['.md', '.markdown', '.html', '.xml']);
const HASH_COMMENT_EXTENSIONS = new Set(['.rules', '.toml', '.yaml', '.yml', '.sh', '.py']);
const headerText = (source) => `Generated file. Source: ${source}. Edit the source, then run node ${TOOL}.`;

/** The comment style a copy of this source gets: 'html', 'hash', or null (no comment syntax known). */
function commentStyle(source) {
  const ext = path.posix.extname(source).toLowerCase();
  if (HTML_COMMENT_EXTENSIONS.has(ext)) return 'html';
  if (HASH_COMMENT_EXTENSIONS.has(ext)) return 'hash';
  return null;
}

const SOURCE_OK = [
  /^plugins\/[^/]+\/shared\/.+/,
  /^plugins\/[^/]+\/agents\/[^/]+\.md$/,
  /^plugins\/toolkit\/scaffold\/model\/.+/,
  /^plugins\/toolkit\/templates\/.+/,
];
export const TARGET_OK = /^plugins\/[^/]+\/skills\/[^/]+\/(references|assets)\/[^/]+$/;

function parseArgs(argv) {
  const out = { check: false, only: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--check') out.check = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--only') out.only = new Set(String(argv[++i] || '').split(',').map((s) => s.trim()).filter(Boolean));
    else if (a.startsWith('--only=')) out.only = new Set(a.slice(7).split(',').map((s) => s.trim()).filter(Boolean));
    else throw new Error(`Unknown option: ${a}. Options: --check, --only <plugin,plugin>.`);
  }
  return out;
}

const rel = (abs) => path.relative(ROOT, abs).split(path.sep).join('/');
const abs = (r) => path.join(ROOT, ...r.split('/'));

/** A problem: the file it is about (a list file or a skill file) and the message. */
const problem = (file, message) => ({ file, message });

function readLists() {
  const files = [];
  if (fs.existsSync(abs(MAIN_LIST))) files.push(MAIN_LIST);
  if (fs.existsSync(abs(LIST_DIR))) {
    for (const name of fs.readdirSync(abs(LIST_DIR)).sort()) {
      if (name.endsWith('.json')) files.push(`${LIST_DIR}/${name}`);
    }
  }
  const entries = [];
  const problems = [];
  for (const file of files) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(abs(file), 'utf8'));
    } catch (err) {
      problems.push(problem(file, `${file}: not valid JSON (${err.message}).`));
      continue;
    }
    if (!data || !Array.isArray(data.copies)) {
      problems.push(problem(file, `${file}: needs a "copies" list.`));
      continue;
    }
    data.copies.forEach((c, k) => {
      const where = `${file} copies[${k}]`;
      if (!c || typeof c.source !== 'string' || !Array.isArray(c.skills) || !c.skills.length) {
        problems.push(problem(file, `${where}: needs "source" and a non-empty "skills" list.`));
        return;
      }
      entries.push({ ...c, list: file, where });
    });
  }
  return { files, entries, problems };
}

/** Every planned copy: { source, target, list }, one per target. */
function plan(entries, only) {
  const problems = [];
  const byTarget = new Map();
  for (const e of entries) {
    const source = e.source.replace(/^\.\//, '');
    if (!SOURCE_OK.some((re) => re.test(source))) {
      problems.push(problem(e.list, `${e.where}: source ${source} is not under plugins/*/shared/, plugins/*/agents/, plugins/toolkit/scaffold/model/, or plugins/toolkit/templates/.`));
      continue;
    }
    if (!commentStyle(source)) {
      problems.push(problem(e.list, `${e.where}: source ${source} has a file type with no comment syntax this tool knows (${[...HTML_COMMENT_EXTENSIONS, ...HASH_COMMENT_EXTENSIONS].join(', ')}), so the copy could not carry its "Generated file" header.`));
      continue;
    }
    const as = (e.as || `references/${path.posix.basename(source)}`).replace(/^\.\//, '');
    for (const skill of e.skills) {
      const m = /^([^/]+)\/([^/]+)$/.exec(String(skill));
      if (!m) {
        problems.push(problem(e.list, `${e.where}: skill "${skill}" must be <plugin>/<skill folder>.`));
        continue;
      }
      if (only && !only.has(m[1])) continue;
      const skillDir = `plugins/${m[1]}/skills/${m[2]}`;
      if (!fs.existsSync(abs(`${skillDir}/SKILL.md`))) {
        problems.push(problem(e.list, `${e.where}: ${skillDir}/SKILL.md does not exist.`));
        continue;
      }
      const target = `${skillDir}/${as}`;
      if (!TARGET_OK.test(target)) {
        problems.push(problem(e.list, `${e.where}: target ${target} is not directly in a skill's references/ or assets/ folder.`));
        continue;
      }
      const prev = byTarget.get(target);
      if (prev && prev.source !== source) {
        problems.push(problem(target, `${target} is listed twice with different sources: ${prev.source} (${prev.list}) and ${source} (${e.list}).`));
        continue;
      }
      byTarget.set(target, { source, target, list: e.list });
    }
  }
  return { copies: [...byTarget.values()], problems };
}

/** The copy's text: the source with the header line added. */
function render(sourceText, source) {
  const eol = sourceText.includes('\r\n') ? '\r\n' : '\n';
  if (commentStyle(source) === 'hash') {
    const line = `# ${headerText(source)}`;
    if (sourceText.startsWith('#!')) {
      const cut = sourceText.indexOf(eol);
      if (cut > 0) return `${sourceText.slice(0, cut + eol.length)}${line}${eol}${sourceText.slice(cut + eol.length)}`;
    }
    return `${line}${eol}${sourceText}`;
  }
  const line = `<!-- ${headerText(source)} -->`;
  if (sourceText.startsWith(`---${eol}`)) {
    const lines = sourceText.split(eol);
    const close = lines.indexOf('---', 1);
    if (close > 0) {
      lines.splice(close + 1, 0, line);
      return lines.join(eol);
    }
  }
  return `${line}${eol}${sourceText}`;
}

/** The source named by a file's header, or null when it has none. */
export function headerSource(text) {
  const lines = text.split(/\r?\n/);
  let start = 0;
  if (lines[0] === '---') {
    const close = lines.indexOf('---', 1);
    if (close > 0) start = close + 1;
  } else if (lines[0] && lines[0].startsWith('#!')) {
    start = 1;
  }
  const m = HEADER_RE.exec(lines[start] || '');
  return m ? (m[1] || m[2]) : null;
}

/** Every generated file now in a skill folder: target -> source. */
export function generatedFiles(only = null) {
  const out = new Map();
  const pluginsDir = abs('plugins');
  for (const plugin of fs.readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!plugin.isDirectory() || (only && !only.has(plugin.name))) continue;
    const skillsDir = path.join(pluginsDir, plugin.name, 'skills');
    if (!fs.existsSync(skillsDir)) continue;
    for (const skill of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!skill.isDirectory()) continue;
      for (const sub of ['references', 'assets']) {
        const dir = path.join(skillsDir, skill.name, sub);
        if (!fs.existsSync(dir)) continue;
        for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
          if (!f.isFile()) continue;
          const file = path.join(dir, f.name);
          const src = headerSource(fs.readFileSync(file, 'utf8'));
          if (src) out.set(rel(file), src);
        }
      }
    }
  }
  return out;
}

function pluginOf(target) {
  return target.split('/')[1];
}

/**
 * Plan every copy and compare it with what is on disk. With check: false it
 * also writes changed copies and deletes unlisted ones. Returns
 * { copies, written, deleted, problems }, where each problem is
 * { file, message } and file is the repository-relative path it is about.
 */
export function syncSkillReferences({ check = false, only = null } = {}) {
  const lists = readLists();
  const problems = [...lists.problems];
  if (!lists.files.length) problems.push(problem(LIST_DIR, `No list of copies: add ${MAIN_LIST} or a file in ${LIST_DIR}/.`));
  const planned = plan(lists.entries, only);
  problems.push(...planned.problems);

  const written = [];
  const deleted = [];
  const wanted = new Set();
  for (const c of planned.copies) {
    wanted.add(c.target);
    if (!fs.existsSync(abs(c.source))) {
      problems.push(problem(c.target, `${c.target}: its source ${c.source} does not exist (${c.list}).`));
      continue;
    }
    const want = render(fs.readFileSync(abs(c.source), 'utf8'), c.source);
    const have = fs.existsSync(abs(c.target)) ? fs.readFileSync(abs(c.target), 'utf8') : null;
    if (have === want) continue;
    if (have !== null && !headerSource(have)) {
      problems.push(problem(c.target, `${c.target} exists and is not a generated file (no header line), so it was left alone. Move its text into ${c.source} or remove it from the list.`));
      continue;
    }
    if (check) {
      problems.push(problem(c.target, have === null
        ? `${c.target} is missing (source ${c.source}).`
        : `${c.target} differs from its source ${c.source}.`));
      continue;
    }
    fs.mkdirSync(path.dirname(abs(c.target)), { recursive: true });
    fs.writeFileSync(abs(c.target), want);
    written.push(c.target);
  }

  for (const [target, source] of generatedFiles(only)) {
    if (wanted.has(target)) continue;
    if (check) {
      problems.push(problem(target, `${target} is a generated file (source ${source}) that no list names. Run the tool without --check to delete it.`));
      continue;
    }
    fs.unlinkSync(abs(target));
    deleted.push(target);
  }
  return { copies: planned.copies, written, deleted, problems };
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`sync-skill-references: ${err.message}`);
    process.exitCode = 1;
    return;
  }
  if (args.help) {
    console.log('Usage: node dev/tools/sync-skill-references.mjs [--check] [--only <plugin,plugin>]');
    return;
  }

  const { copies, written, deleted, problems } = syncSkillReferences({ check: args.check, only: args.only });
  for (const t of written) console.log(`wrote    ${t}`);
  for (const t of deleted) console.log(`deleted  ${t}`);
  const changedPlugins = [...new Set([...written, ...deleted].map(pluginOf))].sort();
  if (changedPlugins.length) {
    console.log(`Changed plugins: ${changedPlugins.join(', ')}. Raise each one's version in both manifests (and metadata.version in .claude-plugin/marketplace.json), because Codex runs a copy filed under the version.`);
  }
  for (const p of problems) console.log(`problem  ${p.message}`);
  const scope = args.only ? ` (plugins: ${[...args.only].join(', ')})` : '';
  console.log(`sync-skill-references${scope}: ${copies.length} copies listed, ${written.length} written, ${deleted.length} deleted, ${problems.length} problems${args.check ? ' (check only; nothing written)' : ''}.`);
  process.exitCode = problems.length ? 1 : 0;
}

// Run only as a command, not when check-skills.mjs imports this file.
function isMain() {
  if (!process.argv[1]) return false;
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}
if (isMain()) main();

// Work item records (WORK-ITEM.md and DESIGN.md in .work-items/) change only
// through `toolkit work` commands, except for body text, which the file edit
// tools may change (the PostToolUse hook checks those edits). Sample run b
// found an agent writing a whole WORK-ITEM.md with `cat > ... <<'EOF'`, with a
// hand-set `stage: 08-build`. These checks find, before the tool runs:
//
// - a shell command that writes a record or a generated file: a redirect
//   (> or >>), tee, sed -i or perl -i, cp, mv, or install onto it, or a script
//   (python, node, and the like) whose text names the record and writes files;
// - a file edit that changes a record's frontmatter, or creates a record.
//
// Reading a record from the shell (cat, sed -n, grep) is never refused.

import fs from 'node:fs';
import path from 'node:path';
import { splitCommands, stripPrefix } from './shell.mjs';
import { projectRelative, projectPath, isWorkItemFile, GENERATED, patchFiles } from './paths.mjs';
import { tryParseDoc } from '../work/model.mjs';

const RECORD_NAMES = new Set(['WORK-ITEM.md', 'DESIGN.md']);
const WRITE_MARKERS = /write_text|write_bytes|writeFileSync|writeFile\(|appendFileSync|\.write\(|open\([^)]*['"](?:w|a|r\+|w\+|a\+)b?['"]|>\s*\S*(?:WORK-ITEM|DESIGN)\.md/;

function base(word) {
  return String(word).split('/').pop();
}

/** True when a path names a work item record or design inside this project's .work-items/. */
export function isRecordPath(file, project) {
  if (!RECORD_NAMES.has(path.basename(file))) return false;
  return isWorkItemFile(projectPath(file, project), project);
}

/** A generated file's project-relative path, or null. */
function generatedRel(file, project) {
  const rel = projectRelative(projectPath(file, project), project);
  return rel && Object.prototype.hasOwnProperty.call(GENERATED, rel) ? rel : null;
}

/** The files a simple command writes: redirect targets, tee, sed -i, cp, mv, install targets. */
function writtenWords(words) {
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const redirect = /^(?:\d|&)?>>?\|?(.*)$/.exec(w);
    if (redirect) {
      if (redirect[1]) out.push(redirect[1]);
      else if (words[i + 1] !== undefined) out.push(words[i + 1]);
    }
  }
  const w = stripPrefix(words);
  if (!w.length) return out;
  const name = base(w[0]);
  const args = w.slice(1).filter((a) => !/^(?:\d|&)?>>?/.test(a));
  const plain = args.filter((a) => !a.startsWith('-'));
  if (name === 'tee') out.push(...plain);
  if ((name === 'sed' || name === 'gsed' || name === 'perl') && args.some((a) => /^-[a-zA-Z]*i/.test(a) || a.startsWith('--in-place'))) out.push(...plain);
  if (['cp', 'mv', 'install', 'rsync', 'ln'].includes(name) && plain.length >= 2) out.push(plain[plain.length - 1]);
  if (name === 'truncate' || name === 'touch') out.push(...plain);
  return out;
}

const SCRIPT_RUNNERS = new Set(['python', 'python3', 'node', 'ruby', 'perl', 'osascript', 'deno', 'bun']);

/**
 * What a shell command writes that only toolkit commands may write.
 * Returns { rel, kind: 'record'|'generated', how } for the first one, or null.
 */
export function shellRecordWrite(command, cwd, project) {
  const text = String(command || '');
  if (!/WORK-ITEM\.md|DESIGN\.md|DASHBOARD\.md|\.toolkit-state\.json|MEMORY\.md|INDEX\.md/.test(text)) return null;
  const at = (word) => path.resolve(cwd, word);
  for (const words of splitCommands(text)) {
    for (const target of writtenWords(words)) {
      const abs = at(target);
      if (isRecordPath(abs, project)) return { rel: projectRelative(projectPath(abs, project), project), kind: 'record', how: 'a shell write' };
      const gen = generatedRel(abs, project);
      if (gen) return { rel: gen, kind: 'generated', how: 'a shell write' };
    }
  }
  // A script (python, node, ...) whose text names a record and writes files.
  const runsScript = splitCommands(text).some((words) => {
    const w = stripPrefix(words);
    return w.length > 0 && SCRIPT_RUNNERS.has(base(w[0]).replace(/[0-9.]+$/, ''));
  });
  if (runsScript && WRITE_MARKERS.test(text)) {
    const m = /[^\s'"`()]*(?:WORK-ITEM|DESIGN)\.md/.exec(text);
    if (m) {
      const abs = at(m[0]);
      if (isRecordPath(abs, project) || /\.work-items/.test(text)) {
        return { rel: projectRelative(projectPath(abs, project), project) || m[0], kind: 'record', how: 'a script' };
      }
    }
  }
  return null;
}

function frontmatterOf(text) {
  const { doc } = tryParseDoc(String(text ?? ''));
  if (!doc || !doc.hasFrontmatter) return null;
  return doc.meta;
}

function sameMeta(a, b) {
  const norm = (m) => JSON.stringify(Object.keys(m || {}).sort().map((k) => [k, String(m[k] ?? '')]));
  return norm(a) === norm(b);
}

function readOrNull(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

function replaceOnce(text, oldString, newString, all) {
  if (typeof oldString !== 'string' || !oldString.length) return null;
  if (!text.includes(oldString)) return null;
  return all ? text.split(oldString).join(String(newString ?? '')) : text.replace(oldString, () => String(newString ?? ''));
}

/** The keys whose values differ between two frontmatter blocks. */
function changedKeys(before, after) {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  return [...keys].filter((k) => String((before || {})[k] ?? '') !== String((after || {})[k] ?? '')).sort();
}

const FRONTMATTER_LINE = /^[-+]\s*([a-z_]+):(?:\s|$)/;
const RECORD_KEYS = new Set(['id', 'title', 'type', 'stage', 'status', 'parent', 'waiting_on', 'priority', 'delivery', 'requirements_approved', 'design', 'result_approved', 'updated', 'work_item', 'approved']);

/**
 * A file edit that changes a record's frontmatter or creates a record.
 * Returns { rel, keys, created } or null.
 */
export function recordFrontmatterEdit(input, cwd, project) {
  const tool = input && input.tool_name;
  const ti = (input && input.tool_input) || {};
  const baseDir = (input && input.cwd) || cwd;
  if (typeof ti.file_path === 'string' && ['Write', 'Edit', 'MultiEdit'].includes(tool)) {
    const abs = path.resolve(baseDir, ti.file_path);
    if (!isRecordPath(abs, project)) return null;
    const rel = projectRelative(projectPath(abs, project), project);
    const current = readOrNull(projectPath(abs, project));
    if (current === null) return { rel, keys: [], created: true };
    let after = null;
    if (tool === 'Write') after = typeof ti.content === 'string' ? ti.content : null;
    else if (tool === 'Edit') after = replaceOnce(current, ti.old_string, ti.new_string, ti.replace_all === true);
    else if (tool === 'MultiEdit' && Array.isArray(ti.edits)) {
      after = current;
      for (const e of ti.edits) {
        const next = after === null ? null : replaceOnce(after, e && e.old_string, e && e.new_string, e && e.replace_all === true);
        if (next === null) {
          after = null;
          break;
        }
        after = next;
      }
    }
    if (after === null) return null; // The edit tool itself refuses an edit whose old text is not there.
    const before = frontmatterOf(current);
    const now = frontmatterOf(after);
    if (!before) return null;
    if (!now) return { rel, keys: ['(the frontmatter block)'], created: false };
    return sameMeta(before, now) ? null : { rel, keys: changedKeys(before, now), created: false };
  }
  // Codex apply_patch: the changed lines of each record's hunks.
  const patch = typeof ti.command === 'string' ? ti.command : typeof ti.patch === 'string' ? ti.patch : null;
  if (!patch || !(tool === 'apply_patch' || tool === 'Edit' || tool === 'Write')) return null;
  let current = null;
  let currentRel = null;
  const keys = new Set();
  for (const line of patch.split(/\r?\n/)) {
    const header = /^\*\*\* (Add File|Update File|Delete File|Move to):\s*(.+?)\s*$/.exec(line);
    if (header) {
      if (currentRel && keys.size) return { rel: currentRel, keys: [...keys].sort(), created: false };
      const abs = path.resolve(baseDir, header[2]);
      current = isRecordPath(abs, project) ? header[1] : null;
      currentRel = current ? projectRelative(projectPath(abs, project), project) : null;
      if (current === 'Add File') return { rel: currentRel, keys: [], created: true };
      if (current !== 'Update File') {
        current = null;
        currentRel = null;
      }
      continue;
    }
    if (!current) continue;
    if (line.startsWith('---') || line.startsWith('+++')) continue;
    const m = FRONTMATTER_LINE.exec(line);
    if (m && RECORD_KEYS.has(m[1])) keys.add(m[1]);
  }
  if (currentRel && keys.size) return { rel: currentRel, keys: [...keys].sort(), created: false };
  return null;
}

const READERS = new Set(['cat', 'less', 'more', 'head', 'tail', 'grep', 'egrep', 'fgrep', 'rg', 'wc', 'ls', 'stat', 'file', 'diff', 'bat', 'echo', 'printf', 'find', 'test', '[']);
const GIT_READS = new Set(['diff', 'show', 'log', 'status', 'blame', 'ls-files', 'check-ignore', 'rev-parse']);

/**
 * True when every simple command in a line only reads (cat, grep, sed without
 * -i, git diff, and the like) and nothing is redirected into a file, so the
 * post-tool hook has no record to check after it.
 */
export function onlyReads(command) {
  for (const words of splitCommands(command)) {
    if (writtenWords(words).some((t) => !/^\/dev\//.test(t))) return false;
    const w = stripPrefix(words);
    if (!w.length) continue;
    const name = base(w[0]);
    if (name === 'sed' || name === 'gsed') {
      if (w.slice(1).some((a) => /^-[a-zA-Z]*i/.test(a) || a.startsWith('--in-place'))) return false;
      continue;
    }
    if (name === 'git') {
      const sub = w.slice(1).find((a) => !a.startsWith('-'));
      if (!sub || !GIT_READS.has(sub)) return false;
      continue;
    }
    if (!READERS.has(name)) return false;
  }
  return true;
}

/** The files a patch names that are records (for the post-tool reminder). */
export function patchRecordFiles(patch, cwd, project) {
  return patchFiles(patch).filter((f) => isRecordPath(path.resolve(cwd, f.path), project));
}

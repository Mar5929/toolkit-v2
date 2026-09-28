// The local tracker's state file and the fast change check.
//
// .work-items/.toolkit-state.json is state, not a generated file (critique M3):
// it holds what a scan cannot rebuild, and `toolkit export` includes it.
//   {
//     "schema": 1,                       an older toolkit refuses to write a newer schema
//     "prefix": "WI",
//     "highWater": 12,                   the highest id number ever used; ids are never reused
//     "fingerprint": "<sha256>",         folder listing and record file times at the last write
//     "items": {
//       "WI-001": {
//         "path": "WI-001-login/WORK-ITEM.md",   relative to .work-items/, with forward slashes
//         "missing": false,                     true when the record was not found by the last scan
//         "hash": "<sha256 of the file>",
//         "written": { ...last values the toolkit wrote: title, stage, status, parent, ... }
//       }
//     },
//     "updated": "<ISO time>"
//   }
//
// checkChanged(root) is the cheap test the UserPromptSubmit hook and every
// `toolkit work` command run first: it lists folders and stats record files,
// and compares that with the fingerprint saved at the last write.

import fs from 'node:fs';
import path from 'node:path';
import { atomicWrite, sha256 } from '../core/fsx.mjs';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { run } from '../core/util.mjs';
import { mainCheckoutRoot } from '../core/config.mjs';
import { TEMPLATE_FOLDER } from './templates.mjs';

export const TRACKER_DIR = '.work-items';
export const STATE_FILE = '.toolkit-state.json';
export const STATE_SCHEMA = 1;
export const LOCK_NAME = '.lock';
export const DASHBOARD_FILE = 'DASHBOARD.md';
export const ARCHIVE_DIR = 'archive';
export const MAX_DEPTH = 12;

/** The tracker folder for a main checkout root. */
export function trackerDirFor(mainRoot) {
  return path.join(mainRoot, TRACKER_DIR);
}

/** True for a folder the scan never enters: the template folder, and names starting with "." or "_". */
export function isSkippedDir(name) {
  return name === TEMPLATE_FOLDER || name.startsWith('.') || name.startsWith('_');
}

/** True for a file the scan ignores: hidden files (state, lock, temp files) and the root DASHBOARD.md. */
export function isSkippedFile(name, relDir) {
  if (name.startsWith('.')) return true;
  return relDir === '' && name === DASHBOARD_FILE;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

/**
 * Walk the tracker folder.
 * @returns {{ dirs: Array<{ rel: string, names: string[] }>, files: Array<{ rel: string, abs: string, name: string, dirRel: string, mtimeMs: number, size: number, birthtimeMs: number }>, fingerprint: string, exists: boolean }}
 *   Only Markdown files are listed in `files`; every entry name counts toward the fingerprint.
 */
export function scanTree(trackerDir) {
  const dirs = [];
  const files = [];
  const lines = [];
  let exists = true;
  const visit = (abs, rel, depth) => {
    let entries;
    try {
      entries = fs.readdirSync(abs, { withFileTypes: true });
    } catch (err) {
      if (rel === '' && err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) {
        exists = false;
        return;
      }
      if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) return;
      throw err;
    }
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    const names = [];
    const subdirs = [];
    for (const e of entries) {
      if (e.isDirectory()) {
        if (isSkippedDir(e.name)) continue;
        names.push(`${e.name}/`);
        subdirs.push(e.name);
      } else {
        if (isSkippedFile(e.name, rel)) continue;
        names.push(e.name);
        if (e.name.toLowerCase().endsWith('.md') && (e.isFile() || e.isSymbolicLink())) {
          const fileAbs = path.join(abs, e.name);
          let st;
          try {
            st = fs.statSync(fileAbs);
          } catch {
            continue;
          }
          if (!st.isFile()) continue;
          const fileRel = rel ? `${rel}/${e.name}` : e.name;
          files.push({ rel: fileRel, abs: fileAbs, name: e.name, dirRel: rel, mtimeMs: st.mtimeMs, size: st.size, birthtimeMs: st.birthtimeMs || st.ctimeMs });
          lines.push(`F ${fileRel} ${st.mtimeMs} ${st.size}`);
        }
      }
    }
    dirs.push({ rel, names });
    lines.push(`D ${rel}: ${names.join('|')}`);
    if (depth >= MAX_DEPTH) return;
    for (const d of subdirs) visit(path.join(abs, d), rel ? `${rel}/${d}` : d, depth + 1);
  };
  visit(trackerDir, '', 0);
  lines.sort();
  return { dirs, files, fingerprint: exists ? sha256(lines.join('\n')) : null, exists };
}

export function emptyState(prefix = 'WI') {
  return { schema: STATE_SCHEMA, prefix, highWater: 0, fingerprint: null, items: {}, updated: null };
}

/**
 * Read the state file.
 * @returns {{ state: object, exists: boolean, newer: boolean }}
 *   newer is true when a newer toolkit wrote it; then nothing may be written.
 */
export function readState(trackerDir, prefix = 'WI') {
  const file = path.join(trackerDir, STATE_FILE);
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) return { state: emptyState(prefix), exists: false, newer: false };
    throw err;
  }
  let state;
  try {
    state = JSON.parse(text);
  } catch (err) {
    throw new ToolkitError(EXIT.ERROR, `The work-item state file ${file} is not valid JSON: ${err.message}`, {
      path: file,
      fix: 'Restore it from the last toolkit export. If there is none, move it aside and run toolkit work sync; the highest id ever used is then rebuilt from the items that still exist.',
    });
  }
  if (!state || typeof state !== 'object' || Array.isArray(state)) state = emptyState(prefix);
  if (!state.items || typeof state.items !== 'object') state.items = {};
  if (!Number.isInteger(state.highWater)) state.highWater = 0;
  const schema = Number.isInteger(state.schema) ? state.schema : STATE_SCHEMA;
  return { state, exists: true, newer: schema > STATE_SCHEMA };
}

/** The error for a state file that a newer toolkit wrote: nothing may be written. */
export function newerStateError(schema) {
  return new ToolkitError(EXIT.ERROR, `The work-item state file was written by a newer toolkit (schema ${schema}). This toolkit understands schema ${STATE_SCHEMA}, so it changed nothing.`, {
    schema,
    fix: 'Update the toolkit plugin, then run the command again.',
  });
}

/** Write the state file atomically. Refuses a state that a newer toolkit wrote. */
export function writeState(trackerDir, state) {
  if (Number.isInteger(state.schema) && state.schema > STATE_SCHEMA) throw newerStateError(state.schema);
  const out = { schema: STATE_SCHEMA, prefix: state.prefix, highWater: state.highWater, fingerprint: state.fingerprint, items: sortObject(state.items), updated: new Date().toISOString() };
  atomicWrite(path.join(trackerDir, STATE_FILE), `${JSON.stringify(out, null, 2)}\n`);
  return out;
}

function sortObject(obj) {
  return Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));
}

/**
 * The tracker folder the commands use for `root`, found as cheaply as possible:
 * - the .work-items folder itself: that folder;
 * - a main checkout root (its .git is a folder): <root>/.work-items, no Git call;
 * - a linked worktree root (its .git is a file) or any other folder: Git is
 *   asked for the main checkout, so a .work-items folder committed into a
 *   worktree by mistake is never read in place of the main one.
 */
export function resolveTrackerDir(root) {
  const direct = path.join(root, TRACKER_DIR);
  if (path.basename(root) === TRACKER_DIR && fs.existsSync(root)) return root;
  let dotGit = null;
  try {
    dotGit = fs.statSync(path.join(root, '.git'));
  } catch {
    dotGit = null;
  }
  if (dotGit && dotGit.isDirectory()) return direct;
  try {
    const main = mainCheckoutRoot(root);
    if (main) return path.join(main, TRACKER_DIR);
  } catch {
    // Not a project.
  }
  return direct;
}

/**
 * The fast change check. `root` is the main checkout root (fastest: no Git
 * call), the .work-items folder itself, or any folder inside the project,
 * including a linked worktree (Git is asked for the main checkout, the same
 * tracker LocalTracker uses).
 * @returns {{ changed: boolean, reason: string, trackerDir: string, exists: boolean }}
 */
export function checkChanged(root) {
  const trackerDir = resolveTrackerDir(path.resolve(root || process.cwd()));
  let stateText = null;
  try {
    stateText = fs.readFileSync(path.join(trackerDir, STATE_FILE), 'utf8');
  } catch {
    stateText = null;
  }
  const tree = scanTree(trackerDir);
  if (!tree.exists) return { changed: false, reason: 'There is no .work-items folder.', trackerDir, exists: false };
  if (stateText === null) {
    const hasRecords = tree.files.length > 0;
    return { changed: hasRecords, reason: hasRecords ? 'There is no state file yet.' : 'The tracker is empty.', trackerDir, exists: true };
  }
  let saved = null;
  try {
    saved = JSON.parse(stateText).fingerprint || null;
  } catch {
    saved = null;
  }
  if (saved === tree.fingerprint) return { changed: false, reason: 'Nothing changed since the last toolkit write.', trackerDir, exists: true };
  return { changed: true, reason: 'Files or folders under .work-items changed since the last toolkit write.', trackerDir, exists: true };
}

// ------------------------------------------------------------------ worktree branch -> item

/** The current Git branch name for a folder, or null (detached HEAD or not Git). */
export function currentBranch(cwd) {
  // symbolic-ref names the branch even before the first commit, where
  // `rev-parse --abbrev-ref HEAD` fails. It fails on a detached HEAD and
  // outside a repository: no branch.
  const res = run('git', ['symbolic-ref', '--quiet', '--short', 'HEAD'], { cwd, timeoutMs: 5000 });
  if (res.code !== 0) return null;
  const b = res.stdout.trim();
  return b || null;
}

/**
 * The work item a branch names: "wi-007-login" or any branch containing "WI-007"
 * (ARCHITECTURE 4.3 "Worktrees"). Returns the id as WI-007, or null.
 */
export function itemIdFromBranch(branch, prefix = 'WI') {
  if (!branch) return null;
  const p = String(prefix).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|[^A-Za-z0-9])${p}-(\\d+)(?![A-Za-z0-9])`, 'i');
  let m = re.exec(String(branch));
  // A project whose items are not WI-...: a branch named wi-001 still means
  // item 001, because the skills' examples use wi- (sample run c, round 3:
  // claude/wi-001-readme-brief was made for TV2-001). One project has one prefix.
  if (!m && String(prefix).toUpperCase() !== 'WI') m = /(?:^|[^A-Za-z0-9])wi-(\d+)(?![A-Za-z0-9])/i.exec(String(branch));
  if (!m) return null;
  return `${String(prefix).toUpperCase()}-${String(Number(m[1])).padStart(3, '0')}`;
}

/** The item this checkout's branch works on, or null. */
export function worktreeItem(cwd, prefix = 'WI') {
  const branch = currentBranch(cwd);
  return { branch, id: itemIdFromBranch(branch, prefix) };
}

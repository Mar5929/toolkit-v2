// The tracker driver interface, and the function that picks a driver from
// .toolkit.json `tracker.type`.
//
// Two drivers implement it: the local folder tracker (lib/work/local.mjs) and
// the Notion tracker (lib/notion/tracker.mjs). The `toolkit work` commands use
// only this interface, through lib/work/ops.mjs, so both trackers behave the
// same way: the same stages, statuses, gates, WORK-ITEM.md body, and DESIGN.md.
//
// ---------------------------------------------------------------------------
// Shapes
//
// @typedef {object} WorkMeta  The WORK-ITEM.md frontmatter as an object of strings,
//   in the ARCHITECTURE 4.2 order: id, title, type, stage, status, parent,
//   waiting_on, priority, delivery, requirements_approved, design,
//   result_approved, updated. (lifecycle.FIELD_ORDER; model.normalizeMeta.)
//
// @typedef {object} WorkRecord  What get() and list() return.
// @property {string} id        the id as WI-007 (model.canonicalId)
// @property {WorkMeta} meta
// @property {string} [body]    canonical local Markdown: the WORK-ITEM.md text after
//                              the frontmatter, starting with "# <id>: <title>".
//                              list() may leave it out when it is costly to read;
//                              callers then use get(id).
// @property {string} location  where a person finds it: a path such as
//                              ".work-items/WI-007-login/WORK-ITEM.md", or a Notion URL
// @property {string} [path]    local tracker only: the absolute file path
// @property {boolean} [archived]
// @property {string} [parent]  "none" or a parent id (the same as meta.parent when in step)
// @property {string[]} [children] sub-item ids
// @property {string} [group]   local tracker only: the group folder path
// @property {{ status: string, location: string } | null} [design]
//
// @typedef {object} DesignRecord
// @property {object} meta      DESIGN.md frontmatter: work_item, status (proposed |
//                              approved | superseded), approved (no | YYYY-MM-DD by <name>)
// @property {string} body      the DESIGN.md text after the frontmatter
// @property {string} location
//
// @typedef {object} SyncReport  What sync() returns. Every list may be empty.
// @property {boolean} changed
// @property {Array<{ id, kind, from, to, parentBefore, parentAfter, withParent? }>} moves
//   kind: moved | folder-renamed | file-renamed | returned (local), reparented (Notion)
// @property {Array<{ id, location, reason }>} adopted     records made by hand and taken in
// @property {Array<{ from, to, location, original }>} renumbered  a copy that reused an id got a new one
// @property {Array<{ id, field, from, to, note, question? }>} ownerEdits  hand edits that were kept
// @property {Array<{ id, code, question }>} [questions] gate questions for the owner
// @property {Array<{ id, field, from, to }>} [derived]  values the sync brought in step
// @property {Array<{ id, lastLocation }>} [missing]      items that disappeared
// @property {Array<{ severity: 'error'|'warning', message, id?, location?, code? }>} problems
//   code 'unreadable_record': a record or design whose frontmatter cannot be
//   read. Its item stays known (not missing, not adopted, its id kept) and the
//   file is left alone until it is fixed by hand.
//
// ---------------------------------------------------------------------------
// The interface. Every method is async.
//
// @typedef {object} TrackerDriver
// @property {'local'|'notion'} type
// @property {string} prefix                 the id prefix, for example "WI"
// @property {object} [capabilities]         { move, groups, archive, localFiles }
//
// @property {(opts?: { includeArchived?: boolean, includeBody?: boolean }) => Promise<WorkRecord[]>} list
//   Every item. Reads only.
//
// @property {(id: string) => Promise<WorkRecord|null>} get
//   One item with its body, or null when there is no such item. When the item
//   exists but cannot be read, throws a ToolkitError INVALID (exit 2) that
//   names where it is and why (details.unreadable = true).
//
// @property {(record: { meta: WorkMeta, body: string }, opts?: { group?: string }) => Promise<string>} create
//   Create an item and return its new id. The driver assigns the id (the caller's
//   meta.id is ignored), sets meta.id, and rewrites the first level-1 heading to
//   "# <id>: <title>" (model.setH1). meta.parent places the new item under that item.
//
// @property {(id: string, change: { meta?: object, body?: string, expectBody?: string, expectMeta?: object }) => Promise<WorkRecord>} update
//   Change an item. meta holds only the keys to set; keys left out keep their
//   value. body, when given, is the whole new body. expectBody (and optionally
//   expectMeta) is what the caller read: when the stored item differs, the driver
//   throws a ToolkitError whose details.conflict is true and saves nothing, so
//   the caller can read again and retry. The driver keeps edits it did not make
//   (Notion: builds update_content from a fresh read). Returns the record as read back.
//
// @property {(id: string) => Promise<DesignRecord|null>} getDesign
//   The item's design, or null when it has none.
//
// @property {(id: string, markdown: string, opts?: { create?: boolean }) => Promise<DesignRecord>} setDesign
//   Write the whole design (DESIGN.md text with frontmatter). Without create, a
//   missing design is an error. The driver forces work_item to this item. The
//   caller updates the item's own `design` field afterwards.
//
// @property {(opts?: { quick?: boolean }) => Promise<SyncReport>} sync
//   Rescan, adopt items made by hand, renumber duplicates, bring derived values
//   in step (status from stage, parent from location, the H1 from title,
//   "**Overall status:**" from requirements_approved, design from the design's
//   status), keep and report the owner's hand edits (ARCHITECTURE 4.2), and
//   report moves. quick: do nothing when a cheap check finds no change.
//
// Optional:
// @property {(fn: () => any) => Promise<any>} [transaction]  run fn with the tracker locked
// @property {(id: string, target: string) => Promise<object>} [move]
//   target: an item id, "root", "archive", or a group name. The local tracker
//   moves the folder; Notion changes the Parent item relation or the Archived box.
//   Returns { id, from, to, parentBefore, parentAfter, archived, nested, unchanged }.
// @property {() => string} [today]           YYYY-MM-DD used for dates (TOOLKIT_TODAY in tests)
// @property {() => string[]} [knownIds]      every id the tracker has seen, including missing ones
// @property {(name: string) => { text: string }} [template]  the WORK-ITEM.md or DESIGN.md template
// @property {() => object[]} [brokenRecords]  problems (code 'unreadable_record') for every
//   record or design that cannot be read now, whether or not a sync reported it before
// @property {(report: SyncReport) => void} [collectReports]  a report that later rescans
//   made inside a write add their findings to (the command's first quick-sync report)
//
// ---------------------------------------------------------------------------

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { LocalTracker } from './local.mjs';

const WORK_LIB = path.dirname(fileURLToPath(import.meta.url));
export const NOTION_DRIVER_PATH = path.join(WORK_LIB, '..', 'notion', 'tracker.mjs');
export const REQUIRED_METHODS = Object.freeze(['list', 'get', 'create', 'update', 'getDesign', 'setDesign', 'sync']);
export const TRACKER_TYPES = Object.freeze(['local', 'notion', 'github', 'jira']);

const TRACKER_NAMES = { github: 'GitHub Issues', jira: 'Jira', notion: 'Notion', local: 'local folders' };

const MARKETPLACE = 'toolkit-v2';

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

/** Compare two version folder names so the newest sorts first (1.10.0 before 1.9.0). */
function newerFirst(a, b) {
  const pa = a.split(/[.-]/);
  const pb = b.split(/[.-]/);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? '';
    const y = pb[i] ?? '';
    const nx = /^\d+$/.test(x) ? Number(x) : NaN;
    const ny = /^\d+$/.test(y) ? Number(y) : NaN;
    if (!Number.isNaN(nx) && !Number.isNaN(ny)) {
      if (nx !== ny) return ny - nx;
    } else if (x !== y) {
      return y < x ? -1 : 1;
    }
  }
  return 0;
}

/**
 * The version folders under a cached plugin folder (<cache>/<marketplace>/work/),
 * newest first, with `preferred` (the toolkit's own version) first when present.
 */
function versionFolders(dir, preferred) {
  let names;
  try {
    names = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return [];
  }
  names.sort(newerFirst);
  if (preferred && names.includes(preferred)) names = [preferred, ...names.filter((n) => n !== preferred)];
  return names.map((n) => path.join(dir, n));
}

/**
 * The folders where the work plugin may be, for a toolkit plugin folder `root`.
 * Repository and local-marketplace layout: <repo>/plugins/toolkit next to
 * <repo>/plugins/work. Cache layout (Claude Code and Codex):
 * <cache>/<marketplace>/toolkit/<version>/ next to <cache>/<marketplace>/work/<version>/.
 */
function workFoldersNextTo(root) {
  const out = [path.join(root, '..', 'work')];
  const parent = path.dirname(root);
  if (path.basename(parent) === 'toolkit') out.push(...versionFolders(path.join(parent, '..', 'work'), path.basename(root)));
  return out;
}

/**
 * The written instructions for a tracker the toolkit does not drive.
 * Returns { rel, path }: `rel` names the file plainly (the work plugin's
 * shared/tracker-<type>.md); `path` is the file found on this computer,
 * or null. It looks next to the toolkit plugin (repository or cache layout),
 * then in the Claude Code and Codex plugin caches. `selfRoot` (default: the
 * plugin folder this file is in) exists so tests can leave it out.
 */
export function trackerInstructionsPath(type, pluginRoot, { env = process.env, home, selfRoot = path.resolve(WORK_LIB, '..', '..') } = {}) {
  const file = path.join('shared', `tracker-${type}.md`);
  const rel = `the work plugin's shared/tracker-${type}.md`;
  const homeDir = home || env.HOME || os.homedir();
  const folders = [];
  if (pluginRoot) folders.push(...workFoldersNextTo(path.resolve(pluginRoot)));
  if (selfRoot) folders.push(...workFoldersNextTo(path.resolve(selfRoot)));
  const claudeHome = env.CLAUDE_CONFIG_DIR || path.join(homeDir, '.claude');
  const codexHome = env.CODEX_HOME || path.join(homeDir, '.codex');
  for (const base of [claudeHome, codexHome]) folders.push(...versionFolders(path.join(base, 'plugins', 'cache', MARKETPLACE, 'work')));
  const found = folders.map((dir) => path.join(dir, file)).find(isFile);
  return { rel, path: found ? path.resolve(found) : null };
}

/** The error `toolkit work` gives for a GitHub Issues or Jira project (exit 3). */
export function unsupportedTracker(type, pluginRoot, env = process.env) {
  const where = trackerInstructionsPath(type, pluginRoot, { env });
  const name = TRACKER_NAMES[type] || type;
  return new ToolkitError(
    EXIT.UNSUPPORTED,
    `This project tracks work in ${name}. toolkit work does not manage ${name}; follow the written instructions in ${where.path || where.rel}.`,
    { tracker: type, instructions: where.rel, path: where.path, fix: `Open ${where.path || where.rel} and follow it for this project's work items.` },
  );
}

function checkDriver(driver, source) {
  const missing = REQUIRED_METHODS.filter((m) => !driver || typeof driver[m] !== 'function');
  if (missing.length) {
    throw new ToolkitError(EXIT.ERROR, `The tracker driver in ${source} is missing ${missing.join(', ')}.`, { missing });
  }
  return driver;
}

async function importNotionDefault() {
  if (!fs.existsSync(NOTION_DRIVER_PATH)) {
    const err = new Error(`Cannot find module '${NOTION_DRIVER_PATH}'`);
    err.code = 'TOOLKIT_NOTION_MISSING';
    throw err;
  }
  return import(pathToFileURL(NOTION_DRIVER_PATH).href);
}

function isModuleMissing(err) {
  if (!err) return false;
  if (err.code === 'TOOLKIT_NOTION_MISSING') return true;
  if (err.code === 'ERR_MODULE_NOT_FOUND' || err.code === 'MODULE_NOT_FOUND') {
    // Only the driver file itself being absent counts; a missing file that the
    // driver imports is a real error and is shown as it is.
    const msg = String(err.message || '');
    const m = /Cannot find module '([^']+)'/.exec(msg);
    return !m || m[1] === NOTION_DRIVER_PATH || m[1] === pathToFileURL(NOTION_DRIVER_PATH).href;
  }
  return false;
}

/** Build a driver from whatever the Notion module exports. */
async function notionFromModule(mod, project, options) {
  const factory = mod.createTracker || mod.openTracker || mod.createNotionTracker;
  if (typeof factory === 'function') return factory(project, options);
  const Klass = mod.NotionTracker || (typeof mod.default === 'function' ? mod.default : null);
  if (Klass) {
    try {
      return new Klass(project, options);
    } catch (err) {
      if (err instanceof TypeError && /class constructor|not a constructor/i.test(err.message)) return Klass(project, options);
      throw err;
    }
  }
  if (mod.default && typeof mod.default === 'object') return mod.default;
  throw new ToolkitError(EXIT.ERROR, 'lib/notion/tracker.mjs exports no tracker (expected createTracker(project, options) or a NotionTracker class).');
}

/**
 * The tracker driver for a project.
 * @param {{ root: string, mainRoot: string, config: object }} project from requireProject()
 * @param {{ env?: object, cwd?: string, pluginRoot?: string, today?: string, importNotion?: () => Promise<object> }} [options]
 * @returns {Promise<TrackerDriver>}
 * @throws ToolkitError UNSUPPORTED (exit 3) for github and jira, or when the Notion driver is missing
 */
export async function openTracker(project, options = {}) {
  const type = String((project.config && project.config.tracker && project.config.tracker.type) || 'local').toLowerCase();
  if (type === 'local') return new LocalTracker(project, options);
  if (type === 'github' || type === 'jira') throw unsupportedTracker(type, options.pluginRoot, options.env || process.env);
  if (type === 'notion') {
    let mod;
    try {
      mod = await (options.importNotion || importNotionDefault)();
    } catch (err) {
      if (isModuleMissing(err)) {
        throw new ToolkitError(EXIT.UNSUPPORTED, 'This project tracks work in Notion, but the Notion tracker driver (lib/notion/tracker.mjs) is not installed with this toolkit.', {
          tracker: 'notion',
          fix: 'Update the toolkit plugin, then run toolkit doctor.',
        });
      }
      throw err;
    }
    const driver = await notionFromModule(mod, project, options);
    return checkDriver(driver, 'lib/notion/tracker.mjs');
  }
  throw new ToolkitError(EXIT.INVALID, `tracker.type "${type}" in .toolkit.json is not one of ${TRACKER_TYPES.join(', ')}.`, {
    fix: 'Set it with: toolkit config set tracker.type local',
  });
}

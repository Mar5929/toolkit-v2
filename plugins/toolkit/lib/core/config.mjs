// Finding the project and reading its .toolkit.json.
//
// findProjectRoot(cwd)   the Git top level of cwd; outside Git, the nearest
//                        folder at or above cwd that holds .toolkit.json; else null.
// mainCheckoutRoot(cwd)  inside a linked Git worktree, the main checkout (the
//                        folder that holds the shared .git); else the project root.
//                        Git-ignored data (.work-items/, .memory/) lives there.
// loadConfig(root)       the parsed .toolkit.json, or null when it is missing or
//                        does not say "toolkit": "toolkit-v2". Bad JSON throws.
// requireProject(cwd)    { root, mainRoot, config }, or throws NOT_PROJECT (exit 4).
// saveConfig(root, cfg)  writes .toolkit.json atomically.
// getPath(obj, 'a.b'), setPath(obj, 'a.b', value)

import fs from 'node:fs';
import path from 'node:path';
import { run } from './util.mjs';
import { atomicWrite, readText } from './fsx.mjs';
import { EXIT, ToolkitError } from './output.mjs';

export const CONFIG_FILE = '.toolkit.json';
export const TOOLKIT_MARK = 'toolkit-v2';

function real(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return path.resolve(p);
  }
}

/** An existing folder to start from: cwd itself, its folder if it is a file, or its nearest existing parent. */
function startDir(cwd) {
  let dir = path.resolve(cwd || process.cwd());
  while (!fs.existsSync(dir)) {
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  try {
    if (!fs.statSync(dir).isDirectory()) dir = path.dirname(dir);
  } catch {
    // Keep dir.
  }
  return dir;
}

function git(args, cwd) {
  const res = run('git', args, { cwd, timeoutMs: 10000 });
  return res.code === 0 ? res.stdout.replace(/\r?\n$/, '') : null;
}

/**
 * Git facts for a folder: { top, gitDir, commonDir } as absolute real paths,
 * or null outside a Git work tree.
 */
export function gitInfo(cwd) {
  const dir = startDir(cwd);
  let out = git(['rev-parse', '--path-format=absolute', '--show-toplevel', '--git-dir', '--git-common-dir'], dir);
  let resolveFrom = null;
  if (out === null) {
    // Git older than 2.31 has no --path-format; its relative answers are resolved here.
    out = git(['rev-parse', '--show-toplevel', '--git-dir', '--git-common-dir'], dir);
    resolveFrom = dir;
  }
  if (out === null) return null;
  const [top, gitDir, commonDir] = out.split(/\r?\n/);
  if (!top || !gitDir || !commonDir) return null;
  const abs = (p) => real(resolveFrom ? path.resolve(resolveFrom, p) : p);
  return { top: real(top), gitDir: abs(gitDir), commonDir: abs(commonDir) };
}

function findConfigUpwards(dir) {
  let cur = dir;
  for (;;) {
    if (fs.existsSync(path.join(cur, CONFIG_FILE))) return real(cur);
    const up = path.dirname(cur);
    if (up === cur) return null;
    cur = up;
  }
}

export function findProjectRoot(cwd) {
  const dir = startDir(cwd);
  const info = gitInfo(dir);
  if (info) return info.top;
  return findConfigUpwards(dir);
}

function mainRootFrom(info, root) {
  if (!info) return root;
  if (info.gitDir === info.commonDir) return root;
  if (path.basename(info.commonDir) === '.git') return real(path.dirname(info.commonDir));
  // A bare repository has no main checkout; the data stays with this worktree.
  return root;
}

export function mainCheckoutRoot(cwd) {
  const dir = startDir(cwd);
  const info = gitInfo(dir);
  const root = info ? info.top : findConfigUpwards(dir);
  return mainRootFrom(info, root);
}

export function loadConfig(root) {
  if (!root) return null;
  const file = path.join(root, CONFIG_FILE);
  let text;
  try {
    text = readText(file);
  } catch (err) {
    throw new ToolkitError(EXIT.INVALID, `${file} could not be read: ${err.message}`, { path: file });
  }
  if (text === null) return null;
  let config;
  try {
    config = JSON.parse(text);
  } catch (err) {
    throw new ToolkitError(EXIT.INVALID, `${file} is not valid JSON: ${err.message}`, {
      path: file,
      fix: 'Fix the JSON in .toolkit.json, then run toolkit doctor.',
    });
  }
  if (!config || typeof config !== 'object' || Array.isArray(config) || config.toolkit !== TOOLKIT_MARK) return null;
  return config;
}

function notProject(cwd, root) {
  const where = root || path.resolve(cwd || process.cwd());
  return new ToolkitError(
    EXIT.NOT_PROJECT,
    `${where} is not a Toolkit V2 project: there is no .toolkit.json with "toolkit": "toolkit-v2".`,
    { cwd: path.resolve(cwd || process.cwd()), root: root || null, fix: 'Run toolkit init in the project folder to set it up.' },
  );
}

export function requireProject(cwd) {
  const dir = startDir(cwd);
  const info = gitInfo(dir);
  const root = info ? info.top : findConfigUpwards(dir);
  if (!root) throw notProject(cwd, null);
  const mainRoot = mainRootFrom(info, root);
  let config = loadConfig(root);
  // A worktree on a branch made before the project was set up has no .toolkit.json of its own.
  if (!config && mainRoot !== root) config = loadConfig(mainRoot);
  if (!config) throw notProject(cwd, root);
  return { root, mainRoot, config };
}

export function saveConfig(root, config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new ToolkitError(EXIT.INVALID, 'The project settings must be a JSON object.');
  }
  if (config.toolkit !== TOOLKIT_MARK) {
    throw new ToolkitError(EXIT.INVALID, `The project settings must contain "toolkit": "${TOOLKIT_MARK}"; nothing was saved.`);
  }
  const file = path.join(root, CONFIG_FILE);
  atomicWrite(file, `${JSON.stringify(config, null, 2)}\n`);
  return file;
}

const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function splitKeyPath(key) {
  const parts = Array.isArray(key) ? key.map(String) : String(key ?? '').split('.');
  if (!parts.length || parts.some((p) => p === '')) {
    throw new ToolkitError(EXIT.INVALID, `"${Array.isArray(key) ? key.join('.') : key}" is not a valid setting name.`);
  }
  for (const p of parts) {
    if (UNSAFE_KEYS.has(p)) throw new ToolkitError(EXIT.INVALID, `"${p}" is not allowed in a setting name.`);
  }
  return parts;
}

/** The value at a dotted path such as "tracker.type", or undefined. */
export function getPath(obj, key) {
  let cur = obj;
  for (const part of splitKeyPath(key)) {
    if (cur === null || typeof cur !== 'object' || !Object.prototype.hasOwnProperty.call(cur, part)) return undefined;
    cur = cur[part];
  }
  return cur;
}

/** Set the value at a dotted path, creating objects on the way. Returns obj. */
export function setPath(obj, key, value) {
  const parts = splitKeyPath(key);
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const next = Object.prototype.hasOwnProperty.call(cur, part) ? cur[part] : undefined;
    if (next === null || typeof next !== 'object') {
      if (next !== undefined && next !== null) {
        throw new ToolkitError(EXIT.INVALID, `Cannot set ${parts.join('.')}: ${parts.slice(0, i + 1).join('.')} is not an object.`);
      }
      cur[part] = {};
    }
    cur = cur[part];
  }
  cur[parts[parts.length - 1]] = value;
  return obj;
}

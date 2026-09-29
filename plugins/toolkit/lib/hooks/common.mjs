// Shared parts of the hook handlers: finding a Toolkit V2 project from the
// hook's `cwd`, the record-check baseline, and quiet error logging.

import fs from 'node:fs';
import path from 'node:path';
import { gitInfo, requireProject } from '../core/config.mjs';
import { claudeHome } from '../project/hosts.mjs';

/** The owner's rule file (lib/project/owner-rules.mjs RULE_FILE_NAME). */
const RULE_FILE = 'owner-preferences.md';

/**
 * The Toolkit V2 project for a folder, or null. Every hook exits silently with
 * no output when this is null (ARCHITECTURE section 3): no .toolkit.json, a
 * .toolkit.json without "toolkit": "toolkit-v2", or one that cannot be read.
 */
export function findProject(cwd) {
  try {
    return requireProject(cwd);
  } catch {
    return null;
  }
}

export function trackerType(project) {
  return String((project.config.tracker && project.config.tracker.type) || 'local');
}

export function memoryType(project) {
  return String((project.config.memory && project.config.memory.type) || 'builtin');
}

function mtime(file) {
  try {
    return fs.statSync(file).mtimeMs;
  } catch {
    return null;
  }
}

/**
 * The modification times of the files a record changes, taken when a turn
 * starts. Stop compares them again: when one moved, something was recorded
 * this turn even if the PostToolUse hook did not see the command. The owner's
 * rule files count too (Mike, 2026-09-29: an instruction is recorded as a
 * rule): the project's .claude/rules/owner-preferences.md, and the one in the
 * Claude Code user rules folder for every project.
 */
export function recordBaseline(project, env = process.env) {
  const mainRoot = project.mainRoot || project.root;
  const info = gitInfo(mainRoot);
  const common = info ? path.join(info.commonDir, 'toolkit-v2') : null;
  let machineRules = null;
  try {
    machineRules = mtime(path.join(claudeHome(env || process.env), 'rules', RULE_FILE));
  } catch {
    machineRules = null;
  }
  return {
    memoryMeta: mtime(path.join(mainRoot, '.memory', '.toolkit-meta.json')),
    hindsightMeta: common ? mtime(path.join(common, 'hindsight-meta.json')) : null,
    memoryCache: common ? mtime(path.join(common, 'memory-cache.json')) : null,
    workState: mtime(path.join(mainRoot, '.work-items', '.toolkit-state.json')),
    decisions: mtime(path.join(project.root, 'DECISIONS.md')),
    projectRules: mtime(path.join(project.root, '.claude', 'rules', RULE_FILE)),
    machineRules,
  };
}

/** True when a file in the baseline changed since it was taken (a file made this turn counts). */
export function baselineMoved(project, baseline, env = process.env) {
  if (!baseline) return false;
  const now = recordBaseline(project, env);
  return Object.keys(now).some((k) => now[k] !== null && now[k] !== baseline[k]);
}

/** Write a hook error to <git common dir>/toolkit-v2/hook-errors.log (and stderr with TOOLKIT_DEBUG). Never throws. */
export function logHookError(event, err, { cwd, env = process.env } = {}) {
  const line = `${new Date().toISOString()} ${event}: ${(err && err.stack) || err}\n`;
  if (env.TOOLKIT_DEBUG) {
    try {
      process.stderr.write(line);
    } catch {
      // Nothing to do.
    }
  }
  try {
    const info = cwd ? gitInfo(cwd) : null;
    if (!info) return;
    const dir = path.join(info.commonDir, 'toolkit-v2');
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'hook-errors.log');
    try {
      if (fs.statSync(file).size > 256 * 1024) fs.renameSync(file, `${file}.1`);
    } catch {
      // New file.
    }
    fs.appendFileSync(file, line);
  } catch {
    // A hook error must never stop the session.
  }
}

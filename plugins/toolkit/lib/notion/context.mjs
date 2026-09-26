// Where the Notion layer keeps its settings and cache, and how it builds a
// client for one project.
//
// - Project settings: the "notion" block of .toolkit.json (committed). It
//   holds ids only: the root page, the Projects database, this project's page,
//   its Work Items and Memory databases, their property and view ids, and the
//   focus and glossary pages. No token: ntn keeps the sign-in in the keychain.
// - Machine settings: ~/.config/toolkit-v2/notion.json holds the root page and
//   the Projects database ids, so a new project on this computer finds them.
//   TOOLKIT_V2_CONFIG_DIR moves that folder (tests use it).
// - Cache (Git-ignored): <git common dir>/toolkit-v2/notion/ holds the scope
//   cache, the tracker state (the values the toolkit last wrote), and the
//   briefing cache. Outside Git it is <project>/.toolkit-cache/notion/.
//
// Ids in .toolkit.json are not trusted for the scope check: a write target is
// always checked by walking its parents (the answers are cached for a day).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { gitInfo } from '../core/config.mjs';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { NotionClient, fileScopeCache, normalizeId } from './client.mjs';

export const MACHINE_FILE = 'notion.json';

/** The folder of the machine settings. */
export function machineConfigDir(env = process.env) {
  if (env.TOOLKIT_V2_CONFIG_DIR) return env.TOOLKIT_V2_CONFIG_DIR;
  const home = env.HOME || os.homedir();
  return path.join(home, '.config', 'toolkit-v2');
}

export function readMachineConfig(env = process.env) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(machineConfigDir(env), MACHINE_FILE), 'utf8'));
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

export function writeMachineConfig(env, data) {
  const dir = machineConfigDir(env);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, MACHINE_FILE);
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`, { mode: 0o644 });
  fs.renameSync(tmp, file);
  return file;
}

/** The Git-ignored cache folder for a project. */
export function notionCacheDir(root) {
  const info = root ? gitInfo(root) : null;
  if (info && info.commonDir) return path.join(info.commonDir, 'toolkit-v2', 'notion');
  return path.join(root || process.cwd(), '.toolkit-cache', 'notion');
}

/** Read a JSON file from the cache folder; {} when missing. */
export function readCache(root, name) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(notionCacheDir(root), name), 'utf8'));
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

export function writeCache(root, name, data) {
  const dir = notionCacheDir(root);
  try {
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, name);
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`);
    fs.renameSync(tmp, file);
    return file;
  } catch {
    return null;
  }
}

/** The root page id for a project: the flag, then .toolkit.json, then the machine settings. */
export function resolveRootPageId({ flag, config, env = process.env } = {}) {
  const fromFlag = normalizeId(flag || '');
  if (fromFlag) return fromFlag;
  const fromConfig = normalizeId((config && config.notion && config.notion.rootPageId) || '');
  if (fromConfig) return fromConfig;
  return normalizeId(readMachineConfig(env).rootPageId || '') || null;
}

/**
 * A NotionClient for a project. opts: { config, root, env, runner, timeoutMs, deadlineMs, rootPageId, sleep }.
 * Throws INVALID when no root page is known.
 */
export function clientFor(opts = {}) {
  const { config = {}, root, env = process.env } = opts;
  const rootPageId = opts.rootPageId || resolveRootPageId({ config, env });
  if (!rootPageId) {
    throw new ToolkitError(EXIT.INVALID, 'No Notion root page is set for this project.', {
      fix: 'Run toolkit notion ensure-root --root-page <id of the AI Agent Second Brain page>.',
    });
  }
  const scopeCache = root && !opts.noCache ? fileScopeCache(path.join(notionCacheDir(root), 'scope.json')) : null;
  return new NotionClient({
    rootPageId,
    runner: opts.runner,
    env,
    timeoutMs: opts.timeoutMs,
    deadlineMs: opts.deadlineMs,
    sleep: opts.sleep,
    minIntervalMs: opts.minIntervalMs,
    scopeCache,
  });
}

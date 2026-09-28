// Facts about this computer's Claude Code and Codex setup that init, doctor,
// brief, and machine-setup read. Every path comes from the environment passed
// in, so tests can point HOME, CODEX_HOME, and TOOLKIT_V2_CONFIG_DIR at a
// temporary folder and never touch the real ones.
//
// Plugin enablement (ARCHITECTURE section 2): the Toolkit V2 plugins are turned
// on per project and every plugin from the older claude-toolkit marketplace is
// turned off in the same project, so the two sets never both load.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseToml, tomlGet } from './toml.mjs';

export const MARKETPLACE = 'toolkit-v2';
export const OLD_MARKETPLACE = 'claude-toolkit';

/** Every Toolkit V2 plugin. sf-architect-solutioning is on only in Salesforce projects. */
export const V2_PLUGINS = Object.freeze(['toolkit', 'work', 'memory', 'session-skills', 'git-workflows', 'sf-architect-solutioning']);
export const SALESFORCE_ONLY_PLUGINS = Object.freeze(['sf-architect-solutioning']);
/**
 * V2 plugins that stay on for every folder (Mike, 2026-09-28, decision 10):
 * the toolkit plugin holds only project-setup and hooks that do nothing
 * outside a Toolkit V2 project. The other V2 plugins are on only inside V2
 * projects.
 */
export const MACHINE_WIDE_PLUGINS = Object.freeze(['toolkit']);

export function homeDir(env = process.env) {
  return env.HOME || os.homedir();
}

/** ~/.claude, or CLAUDE_CONFIG_DIR when set. */
export function claudeHome(env = process.env) {
  return env.CLAUDE_CONFIG_DIR || path.join(homeDir(env), '.claude');
}

/** ~/.codex, or CODEX_HOME when set. */
export function codexHome(env = process.env) {
  return env.CODEX_HOME || path.join(homeDir(env), '.codex');
}

/** ~/.config/toolkit-v2, or TOOLKIT_V2_CONFIG_DIR when set (the same rule the Notion layer uses). */
export function toolkitConfigDir(env = process.env) {
  return env.TOOLKIT_V2_CONFIG_DIR || path.join(homeDir(env), '.config', 'toolkit-v2');
}

/** ~/.local/bin, or TOOLKIT_V2_BIN_DIR when set. */
export function wrapperDir(env = process.env) {
  return env.TOOLKIT_V2_BIN_DIR || path.join(homeDir(env), '.local', 'bin');
}

export function readJson(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

export function readTextOrNull(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

/** The user's Claude Code settings (~/.claude/settings.json), or {}. */
export function claudeUserSettings(env = process.env) {
  return readJson(path.join(claudeHome(env), 'settings.json')) || {};
}

/** The user's Codex config text (~/.codex/config.toml), or ''. */
export function codexUserConfig(env = process.env) {
  return readTextOrNull(path.join(codexHome(env), 'config.toml')) || '';
}

function oldPluginName(id) {
  const m = /^(.+)@claude-toolkit$/.exec(String(id));
  return m ? m[1] : null;
}

/**
 * Names of the claude-toolkit plugins this computer has for Claude Code: the
 * keys of ~/.claude/settings.json enabledPlugins that end in @claude-toolkit,
 * plus any listed in ~/.claude/plugins/installed_plugins.json.
 */
export function claudeOldPlugins(env = process.env) {
  const names = new Set();
  const settings = claudeUserSettings(env);
  for (const id of Object.keys((settings && settings.enabledPlugins) || {})) {
    const n = oldPluginName(id);
    if (n) names.add(n);
  }
  const installed = readJson(path.join(claudeHome(env), 'plugins', 'installed_plugins.json'));
  for (const id of Object.keys((installed && installed.plugins) || {})) {
    const n = oldPluginName(id);
    if (n) names.add(n);
  }
  return [...names].sort();
}

/** Names of the claude-toolkit plugins in ~/.codex/config.toml ([plugins."<name>@claude-toolkit"]). */
export function codexOldPlugins(env = process.env) {
  const names = new Set();
  const { entries } = parseToml(codexUserConfig(env));
  for (const e of entries) {
    const p = e.kind === 'header' ? e.keyPath : e.kind === 'key' ? [...e.table, ...e.keyPath] : null;
    if (!p || p[0] !== 'plugins' || p.length < 2) continue;
    const n = oldPluginName(p[1]);
    if (n) names.add(n);
  }
  return [...names].sort();
}

/** The V2 plugins a project needs, with the value each should have. */
export function wantedV2Plugins(config) {
  const sf = Boolean(config && config.salesforce && config.salesforce.enabled);
  const out = {};
  for (const name of V2_PLUGINS) out[`${name}@${MARKETPLACE}`] = SALESFORCE_ONLY_PLUGINS.includes(name) ? sf : true;
  return out;
}

/** Codex trust for a folder: 'trusted', another value, or null when the folder is not listed. */
export function codexTrust(folder, env = process.env) {
  const text = codexUserConfig(env);
  if (!text) return null;
  const candidates = new Set([folder]);
  try {
    candidates.add(fs.realpathSync(folder));
  } catch {
    // Keep the given path.
  }
  for (const p of candidates) {
    const v = tomlGet(text, ['projects', p, 'trust_level']);
    if (v !== undefined) return String(v);
  }
  return null;
}

/**
 * True when ~/.codex/config.toml turns a V2 plugin on for every folder
 * ([plugins."<name>@toolkit-v2"] enabled = true). Off, or not listed, is false.
 */
export function codexPluginOnEverywhere(name, env = process.env) {
  return tomlGet(codexUserConfig(env), ['plugins', `${name}@${MARKETPLACE}`, 'enabled']) === true;
}

/** Codex hook trust keys (the [hooks.state."..."] tables) that start with a prefix. */
export function codexHookTrustKeys(prefix, env = process.env) {
  const keys = [];
  for (const e of parseToml(codexUserConfig(env)).entries) {
    if (e.kind !== 'header') continue;
    if (e.keyPath[0] === 'hooks' && e.keyPath[1] === 'state' && e.keyPath.length >= 3 && String(e.keyPath[2]).startsWith(prefix)) keys.push(e.keyPath[2]);
  }
  return keys;
}

/** The installed copies of a V2 plugin: [{ host, version, path }]. */
export function installedPluginCopies(name, env = process.env) {
  const out = [];
  const installed = readJson(path.join(claudeHome(env), 'plugins', 'installed_plugins.json'));
  const rows = (installed && installed.plugins && installed.plugins[`${name}@${MARKETPLACE}`]) || [];
  for (const r of rows) out.push({ host: 'claude-code', version: r.version || null, path: r.installPath || null, scope: r.scope || null });
  const cacheDir = path.join(codexHome(env), 'plugins', 'cache', MARKETPLACE, name);
  try {
    for (const v of fs.readdirSync(cacheDir)) out.push({ host: 'codex', version: v, path: path.join(cacheDir, v) });
  } catch {
    // Not installed for Codex.
  }
  return out;
}

/** The toolkit-v2 marketplace source folder Claude Code knows, or null. */
export function claudeMarketplaceSource(env = process.env) {
  const known = readJson(path.join(claudeHome(env), 'plugins', 'known_marketplaces.json'));
  const entry = known && known[MARKETPLACE];
  if (!entry) return null;
  const loc = entry.installLocation || (entry.source && (entry.source.path || entry.source.directory)) || null;
  return loc || null;
}

/** The toolkit-v2 marketplace source folder Codex knows ([marketplaces.toolkit-v2] source in ~/.codex/config.toml), or null. */
export function codexMarketplaceSource(env = process.env) {
  const v = tomlGet(codexUserConfig(env), ['marketplaces', MARKETPLACE, 'source']);
  return typeof v === 'string' && v ? v : null;
}

/** Every toolkit-v2 marketplace source folder Claude Code or Codex knows, without repeats. */
export function marketplaceSources(env = process.env) {
  return [...new Set([claudeMarketplaceSource(env), codexMarketplaceSource(env)].filter(Boolean))];
}

/** Compare two versions such as 0.2.0 and 0.10.1: -1, 0, or 1. */
export function compareVersions(a, b) {
  const pa = String(a || '').split(/[.+-]/).map((x) => Number.parseInt(x, 10) || 0);
  const pb = String(b || '').split(/[.+-]/).map((x) => Number.parseInt(x, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d < 0 ? -1 : 1;
  }
  return 0;
}

/** The plugin's version from its manifest, or null. */
export function pluginVersion(pluginRoot) {
  const m = readJson(path.join(pluginRoot, '.claude-plugin', 'plugin.json')) || readJson(path.join(pluginRoot, '.codex-plugin', 'plugin.json'));
  return m && typeof m.version === 'string' ? m.version : null;
}

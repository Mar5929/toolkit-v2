// This computer's side of Toolkit V2 (ARCHITECTURE section 2, "Reaching the
// CLI"; critique P2; final review I1):
//
// - ~/.config/toolkit-v2/plugin-root names the installed toolkit plugin folder.
//   Only a real installed copy may be named there: the Claude Code or Codex
//   plugin cache for the toolkit-v2 marketplace, or the marketplace's source
//   folder that Claude Code or Codex has registered. A test copy loaded with
//   --plugin-dir, or any other folder, is never written there (final review
//   I1: a scratch copy with no scaffold/ broke toolkit init for a while).
//   The SessionStart hook refreshes it inside a Toolkit V2 project only. It
//   never replaces a newer version with an older one, and at the same version
//   it prefers a plugin cache copy over the source folder, which other
//   sessions edit (refreshPointer).
// - ~/.local/bin/toolkit is a small wrapper script (a regular file, not a
//   link) that reads the pointer and runs `node <root>/bin/toolkit`. Codex
//   needs it, because Codex puts no plugin folder on the PATH. It falls back
//   to the toolkit-v2 source folder when the pointer is missing or names a
//   folder without bin/toolkit and scaffold/CONDITIONS.json.
// - `toolkit machine-setup` writes both and checks node, git, ntn, ollama, and
//   Hindsight.
// - It also switches the Toolkit V2 plugins other than toolkit off for every
//   Codex folder: `codex plugin add` (after every install or version update)
//   writes enabled = true to ~/.codex/config.toml, which loads the plugin in
//   every Codex project, claude-toolkit ones included. A project set up by
//   toolkit init turns them on in its own .codex/config.toml (Codex setup run,
//   2026-09-26). The toolkit plugin itself stays on for every folder (Mike,
//   2026-09-28, decision 10).

import fs from 'node:fs';
import path from 'node:path';
import { atomicWrite, sha256 } from '../core/fsx.mjs';
import { run } from '../core/util.mjs';
import {
  claudeHome, claudeUserSettings, toolkitConfigDir, wrapperDir, marketplaceSources, pluginVersion, codexPluginOnEverywhere, codexHome, codexUserConfig,
  installedPluginCopies, compareVersions, MARKETPLACE, V2_PLUGINS, MACHINE_WIDE_PLUGINS,
} from './hosts.mjs';
import { mergeToml } from './toml.mjs';

export const POINTER_FILE = 'plugin-root';
export const WRAPPER_NAME = 'toolkit';
export const WRAPPER_MARK = '# Written by toolkit machine-setup (Toolkit V2).';
/** The file a complete toolkit plugin copy has besides bin/toolkit (init and sync cannot run without it). */
export const SCAFFOLD_MARK = path.join('scaffold', 'CONDITIONS.json');

export function pointerPath(env = process.env) {
  return path.join(toolkitConfigDir(env), POINTER_FILE);
}

export function wrapperPath(env = process.env) {
  return path.join(wrapperDir(env), WRAPPER_NAME);
}

/** The plugin folder the pointer names, or null. */
export function readPointer(env = process.env) {
  try {
    const v = fs.readFileSync(pointerPath(env), 'utf8').trim();
    return v || null;
  } catch {
    return null;
  }
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function real(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return path.resolve(p);
  }
}

/** True when a folder holds the toolkit command. */
export function isPluginRoot(dir) {
  return Boolean(dir) && isFile(path.join(dir, 'bin', 'toolkit'));
}

/** True when a folder holds the toolkit command and the scaffold conditions file, so init and sync can run from it. */
export function isCompleteRoot(dir) {
  return isPluginRoot(dir) && isFile(path.join(dir, SCAFFOLD_MARK));
}

/**
 * The plugin cache copies of the toolkit on this computer: every copy Claude
 * Code lists in installed_plugins.json for toolkit@toolkit-v2, and every
 * version folder in the Claude Code and Codex plugin caches
 * (<home>/plugins/cache/toolkit-v2/toolkit/<version>). Real paths.
 */
export function cacheRoots(env = process.env) {
  const out = new Set();
  for (const c of installedPluginCopies('toolkit', env)) if (c.path) out.add(real(c.path));
  const cacheParents = [
    path.join(claudeHome(env), 'plugins', 'cache', MARKETPLACE, 'toolkit'),
    path.join(codexHome(env), 'plugins', 'cache', MARKETPLACE, 'toolkit'),
  ];
  for (const parent of cacheParents) {
    try {
      for (const v of fs.readdirSync(parent)) out.add(real(path.join(parent, v)));
    } catch {
      // Not installed there.
    }
  }
  return [...out];
}

/** plugins/toolkit in each toolkit-v2 marketplace source folder Claude Code or Codex has registered. Real paths. */
export function sourceRoots(env = process.env) {
  return [...new Set(marketplaceSources(env).map((source) => real(path.join(source, 'plugins', 'toolkit'))))];
}

/**
 * The folders that count as an installed toolkit plugin on this computer:
 * the plugin cache copies (cacheRoots) and the registered marketplace source
 * folders (sourceRoots). Real paths.
 */
export function installedRoots(env = process.env) {
  return [...new Set([...cacheRoots(env), ...sourceRoots(env)])];
}

/** True when a folder is an installed toolkit plugin copy (installedRoots). */
export function isInstalledRoot(dir, env = process.env) {
  if (!dir) return false;
  return installedRoots(env).includes(real(dir));
}

/** True when a folder is a plugin cache copy, not a marketplace source folder. */
export function isCacheRoot(dir, env = process.env) {
  if (!dir) return false;
  return cacheRoots(env).includes(real(dir));
}

/**
 * The newest complete plugin cache copy whose version is `atLeast` or newer,
 * or null. Among copies of the same version, the first one found is used.
 */
export function newestCacheCopy(env = process.env, atLeast = null) {
  let best = null;
  for (const dir of cacheRoots(env)) {
    if (!isCompleteRoot(dir)) continue;
    const v = pluginVersion(dir);
    if (!v) continue;
    if (atLeast && compareVersions(v, atLeast) < 0) continue;
    if (!best || compareVersions(v, best.version) > 0) best = { dir, version: v };
  }
  return best ? best.dir : null;
}

/**
 * Point the pointer at a plugin folder. Only a complete, installed copy is
 * written (isCompleteRoot and isInstalledRoot). The rules (final review I1):
 *
 * - A plugin cache copy is preferred over the marketplace source folder. The
 *   source folder is the live working folder of the toolkit-v2 repository,
 *   which other sessions edit. Codex runs its skills and hooks from its cache
 *   copy. Claude Code runs them from the source folder itself, because it
 *   loads a plugin from a marketplace added as a local folder in place
 *   (ai-external-knowledge/claude-code/plugins-manifest-reference.md,
 *   "version"); so in Claude Code pluginRoot is the source folder. The
 *   toolkit command should still run a fixed, installed version, so when
 *   pluginRoot is the source folder and a cache copy of the same or a newer
 *   version exists, that cache copy is written instead. The source folder
 *   is written only when no such cache copy exists.
 * - A pointer that already names a complete, installed copy of a newer
 *   version is kept.
 * - At the same version, a pointer that names the source folder is replaced
 *   by a cache copy; a pointer that names a cache copy is kept, so it does
 *   not change back and forth between Claude Code and Codex.
 *
 * Never throws (a Codex sandbox may refuse the write).
 * Returns { changed, path, root, error, skipped, same } (root: the folder
 * written or kept; skipped: why nothing was written; same: the copy of the
 * same version the pointer keeps naming).
 */
export function refreshPointer(pluginRoot, env = process.env) {
  const file = pointerPath(env);
  try {
    if (!isCompleteRoot(pluginRoot)) return { changed: false, path: file, error: `${pluginRoot} has no bin/toolkit or no ${SCAFFOLD_MARK}` };
    if (!isInstalledRoot(pluginRoot, env)) {
      return { changed: false, path: file, skipped: `${pluginRoot} is not an installed copy of toolkit@${MARKETPLACE} (the Claude Code or Codex plugin cache, or the registered marketplace source folder)` };
    }
    let target = pluginRoot;
    if (!isCacheRoot(pluginRoot, env)) {
      const cached = newestCacheCopy(env, pluginVersion(pluginRoot));
      if (cached) target = cached;
    }
    const current = readPointer(env);
    if (current && real(current) === real(target)) return { changed: false, path: file, root: current };
    const order = current && isCompleteRoot(current) && isInstalledRoot(current, env) ? compareVersions(pluginVersion(current), pluginVersion(target)) : -1;
    if (order > 0) return { changed: false, path: file, root: current, skipped: `${current} is a newer version (${pluginVersion(current)}) than ${target} (${pluginVersion(target)})` };
    if (order === 0 && (isCacheRoot(current, env) || !isCacheRoot(target, env))) return { changed: false, path: file, root: current, same: current };
    atomicWrite(file, `${target}\n`);
    return { changed: true, path: file, root: target };
  } catch (err) {
    return { changed: false, path: file, error: err.message };
  }
}

/**
 * The folder the wrapper falls back to: the first complete marketplace source
 * folder, else this copy when it is an installed one, else null.
 */
export function fallbackRoot(pluginRoot, env = process.env) {
  for (const source of marketplaceSources(env)) {
    const candidate = path.join(source, 'plugins', 'toolkit');
    if (isCompleteRoot(candidate)) return candidate;
  }
  return pluginRoot && isCompleteRoot(pluginRoot) && isInstalledRoot(pluginRoot, env) ? pluginRoot : null;
}

function shellQuote(s) {
  return `'${String(s).replace(/'/g, "'\\''")}'`;
}

// Codex hook trust (final review M10). Codex keeps a trust entry with a hash
// for each plugin hook in ~/.codex/config.toml and skips a hook whose file
// changed since the owner trusted it. The toolkit cannot compute Codex's own
// hash, so the Codex SessionStart hook, which runs only while Codex trusts
// it, records the hash of the hooks/codex-hooks.json it ran from. Doctor then
// compares that with the hooks file of Codex's newest toolkit copy: a
// difference means the hooks changed since Codex last ran them, so the owner
// has to trust them again in /hooks.
export const HOOKS_SEEN_FILE = 'codex-hooks-seen.json';

export function hooksSeenPath(env = process.env) {
  return path.join(toolkitConfigDir(env), HOOKS_SEEN_FILE);
}

/** The sha256 of a plugin copy's hooks/codex-hooks.json, or null. */
export function codexHooksHash(pluginRoot) {
  try {
    return sha256(fs.readFileSync(path.join(pluginRoot, 'hooks', 'codex-hooks.json')));
  } catch {
    return null;
  }
}

/** Record that Codex ran the hooks of this plugin copy. Never throws. Returns { changed, error }. */
export function recordCodexHooksSeen(pluginRoot, env = process.env) {
  try {
    const hash = codexHooksHash(pluginRoot);
    if (!hash) return { changed: false };
    const file = hooksSeenPath(env);
    let prev = null;
    try {
      prev = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      prev = null;
    }
    if (prev && prev.hash === hash) return { changed: false };
    atomicWrite(file, `${JSON.stringify({ hash, version: pluginVersion(pluginRoot), at: new Date().toISOString() }, null, 2)}\n`);
    return { changed: true };
  } catch (err) {
    return { changed: false, error: err.message };
  }
}

/** What the Codex hook last recorded: { hash, version, at }, or null. */
export function readCodexHooksSeen(env = process.env) {
  try {
    const v = JSON.parse(fs.readFileSync(hooksSeenPath(env), 'utf8'));
    return v && typeof v === 'object' && typeof v.hash === 'string' ? v : null;
  } catch {
    return null;
  }
}

/** The wrapper script's text. */
export function wrapperScript(fallback) {
  return [
    '#!/bin/sh',
    WRAPPER_MARK,
    '# Runs the installed Toolkit V2 command. The plugin folder comes from',
    '# ~/.config/toolkit-v2/plugin-root, which the session-start hook refreshes',
    '# in Toolkit V2 projects. When that file is missing, or names a folder',
    '# without bin/toolkit and scaffold/CONDITIONS.json, it uses the folder',
    '# named on the fallback line.',
    'config_dir="${TOOLKIT_V2_CONFIG_DIR:-$HOME/.config/toolkit-v2}"',
    'root=""',
    'if [ -f "$config_dir/plugin-root" ]; then root=$(cat "$config_dir/plugin-root"); fi',
    `fallback=${shellQuote(fallback || '')}`,
    'if [ -z "$root" ] || [ ! -f "$root/bin/toolkit" ] || [ ! -f "$root/scaffold/CONDITIONS.json" ]; then root="$fallback"; fi',
    'if [ -z "$root" ] || [ ! -f "$root/bin/toolkit" ]; then',
    '  echo "toolkit: the Toolkit V2 plugin folder was not found. Start a Claude Code or Codex session in a Toolkit V2 project, or run toolkit machine-setup." >&2',
    '  exit 127',
    'fi',
    'exec node "$root/bin/toolkit" "$@"',
    '',
  ].join('\n');
}

/** Facts about the wrapper: { path, exists, ours, fallback }. */
export function wrapperState(env = process.env) {
  const file = wrapperPath(env);
  let text = null;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    text = null;
  }
  const fallback = text ? ((/^fallback='(.*)'$/m.exec(text) || [])[1] || null) : null;
  let executable = false;
  try {
    executable = Boolean(fs.statSync(file).mode & 0o111);
  } catch {
    executable = false;
  }
  return { path: file, exists: text !== null, ours: Boolean(text && text.includes(WRAPPER_MARK)), fallback, executable };
}

/** True when a folder is on the PATH. */
export function onPath(dir, env = process.env) {
  return String(env.PATH || '').split(path.delimiter).some((p) => p && path.resolve(p) === path.resolve(dir));
}

/** The first file named `name` in a PATH folder, or null. Nothing is run. */
export function which(name, env = process.env) {
  for (const dir of String(env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    const file = path.join(dir, name);
    try {
      if (fs.statSync(file).isFile()) return file;
    } catch {
      // Not in this folder.
    }
  }
  return null;
}

function version(cmd, args = ['--version'], env) {
  const res = run(cmd, args, { timeoutMs: 10000, env });
  if (res.code !== 0) return null;
  return (res.stdout || res.stderr).trim().split('\n')[0] || 'installed';
}

/**
 * Check the programs Toolkit V2 uses. Network checks have short timeouts.
 * Returns [{ name, ok, required, detail, fix }].
 */
export async function toolChecks({ env = process.env, fetch: fetchFn = globalThis.fetch, network = true } = {}) {
  const out = [];
  const node = process.versions.node;
  const major = Number(node.split('.')[0]);
  out.push({ name: 'node', ok: major >= 20, required: true, detail: `Node.js ${node}`, fix: major >= 20 ? null : 'Install Node.js 20 or newer (ask the owner first).' });
  const git = version('git', ['--version'], env);
  out.push({ name: 'git', ok: Boolean(git), required: true, detail: git || 'not found', fix: git ? null : 'Install Git (ask the owner first).' });
  const ntn = version(env.TOOLKIT_NTN_BIN || 'ntn', ['--version'], env);
  let ntnSigned = null;
  if (ntn && network) {
    const who = run(env.TOOLKIT_NTN_BIN || 'ntn', ['whoami'], { timeoutMs: 15000, env });
    ntnSigned = who.code === 0;
  }
  out.push({
    name: 'ntn',
    ok: Boolean(ntn) && ntnSigned !== false,
    required: false,
    detail: !ntn ? 'not found (needed only for a Notion tracker or Notion memory)' : ntnSigned === false ? `${ntn}, not signed in` : ntnSigned ? `${ntn}, signed in` : ntn,
    fix: !ntn ? 'Install it with npm install -g ntn (ask the owner first).' : ntnSigned === false ? 'The owner runs ntn login himself; it opens a browser sign-in.' : null,
  });
  const ollama = version('ollama', ['--version'], env);
  let ollamaUp = null;
  if (ollama && network && typeof fetchFn === 'function') {
    try {
      const res = await fetchFn('http://127.0.0.1:11434/api/version', { signal: AbortSignal.timeout(2000) });
      ollamaUp = res.ok;
    } catch {
      ollamaUp = false;
    }
  }
  out.push({
    name: 'ollama',
    ok: Boolean(ollama) && ollamaUp !== false,
    required: false,
    detail: !ollama ? 'not found (needed only for Hindsight memory)' : ollamaUp === false ? `${ollama}, not running` : ollamaUp ? `${ollama}, running` : ollama,
    fix: !ollama ? 'Install it with Homebrew (ask the owner first); the project-setup skill\'s references/installing-hindsight.md has the steps.' : ollamaUp === false ? 'Start it with brew services start ollama (ask the owner first).' : null,
  });
  // Found on the PATH without running it: starting hindsight-api would start a server.
  const hsBin = which('hindsight-api', env) || (env.HOME && fs.existsSync(path.join(env.HOME, '.local', 'bin', 'hindsight-api')) ? 'installed' : null);
  let hsUp = null;
  if (network && typeof fetchFn === 'function') {
    try {
      const res = await fetchFn('http://127.0.0.1:8888/health', { signal: AbortSignal.timeout(2000) });
      hsUp = res.ok;
    } catch {
      hsUp = false;
    }
  }
  out.push({
    name: 'hindsight',
    ok: hsUp !== false || !hsBin,
    required: false,
    detail: !hsBin && !hsUp ? 'not installed (needed only for Hindsight memory)' : hsUp ? 'the local server at 127.0.0.1:8888 is healthy' : hsUp === false ? 'installed, but the local server at 127.0.0.1:8888 does not answer' : 'installed',
    fix: hsBin && hsUp === false ? 'Check it with toolkit hindsight service status; start it after the owner\'s yes.' : !hsBin && !hsUp ? 'Only for Hindsight memory: the project-setup skill\'s references/installing-hindsight.md has the install steps (ask the owner first).' : null,
  });
  return out;
}

/**
 * What a new project needs in Codex. The toolkit plugin is on for every Codex
 * folder (decision 10), so "set up Toolkit V2 in this project" works in a new
 * folder; Codex asks once to run toolkit init outside its sandbox, because
 * the sandbox protects .codex/. The other V2 plugins turn on in the project's
 * own .codex/config.toml, which toolkit init writes. When the toolkit plugin
 * is still off for every folder, a new project is set up from a terminal or
 * from Claude Code first.
 */
export function codexSetupLines(env = process.env) {
  if (codexPluginOnEverywhere('toolkit', env)) {
    return ['Codex: the toolkit plugin is on for every folder, so "set up Toolkit V2 in this project" works in a new folder. Codex asks once to run toolkit init outside its sandbox.'];
  }
  return [
    'Codex: the toolkit plugin is not on for every folder yet, so the Toolkit V2 skills appear only in a project that toolkit init has set up. To start a new project from Codex, first run toolkit init in a terminal in the project folder (or say "set up this project" in Claude Code), for example:',
    "  toolkit init --name '<name>' --tracker local --memory builtin --hosts claude-code,codex",
    '  Then open Codex in the folder, trust it, and say "finish setting up Toolkit V2".',
  ];
}

/** True when the Codex plugin cache holds a copy of a V2 plugin. */
function codexHasPlugin(name, env) {
  try {
    return fs.readdirSync(path.join(codexHome(env), 'plugins', 'cache', MARKETPLACE, name)).length > 0;
  } catch {
    return false;
  }
}

/**
 * The Toolkit V2 plugin switches in ~/.codex/config.toml (decision 10): every
 * V2 plugin except toolkit gets enabled = false for every folder (codex plugin
 * add turns them on after every install or update), and toolkit gets
 * enabled = true when Codex has a copy of it. Only those plugin tables change;
 * every other line of the file is kept. Never throws.
 * Returns { path, changed: [plugin ids switched off], turnedOn: [plugin ids switched on], error }.
 */
export function codexSwitchesOff(env = process.env) {
  const file = path.join(codexHome(env), 'config.toml');
  const off = V2_PLUGINS.filter((name) => !MACHINE_WIDE_PLUGINS.includes(name) && codexPluginOnEverywhere(name, env)).map((name) => `${name}@${MARKETPLACE}`);
  const on = MACHINE_WIDE_PLUGINS.filter((name) => codexHasPlugin(name, env) && !codexPluginOnEverywhere(name, env)).map((name) => `${name}@${MARKETPLACE}`);
  if (!off.length && !on.length) return { path: file, changed: [], turnedOn: [] };
  try {
    const source = [
      ...off.map((id) => `[plugins."${id}"]\nenabled = false\n`),
      ...on.map((id) => `[plugins."${id}"]\nenabled = true\n`),
    ].join('\n');
    const merged = mergeToml(codexUserConfig(env), source);
    if (merged.conflicts.length) return { path: file, changed: [], turnedOn: [], error: merged.conflicts.join('; ') };
    atomicWrite(file, merged.text);
    const stillOn = off.filter((id) => codexPluginOnEverywhere(id.split('@')[0], env));
    const stillOff = on.filter((id) => !codexPluginOnEverywhere(id.split('@')[0], env));
    const changed = off.filter((id) => !stillOn.includes(id));
    const turnedOn = on.filter((id) => !stillOff.includes(id));
    if (stillOn.length || stillOff.length) {
      return { path: file, changed, turnedOn, error: [stillOn.length ? `${stillOn.join(', ')} still read as on after the write` : null, stillOff.length ? `${stillOff.join(', ')} still read as off after the write` : null].filter(Boolean).join('; ') };
    }
    return { path: file, changed, turnedOn };
  } catch (err) {
    return { path: file, changed: [], turnedOn: [], error: err.message };
  }
}

/**
 * Claude Code on this computer (decision 10): the toolkit plugin is on for
 * every folder in ~/.claude/settings.json. Claude Code's own command turns it
 * on, so this only reports. Returns a line, or null when Claude Code has no
 * toolkit-v2 install.
 */
export function claudeMachineWideLine(env = process.env) {
  const installed = installedPluginCopies('toolkit', env).some((c) => c.host === 'claude-code');
  if (!installed) return null;
  const enabled = (claudeUserSettings(env).enabledPlugins || {})[`toolkit@${MARKETPLACE}`];
  if (enabled === true) return `Claude Code: toolkit@${MARKETPLACE} is on for every folder.`;
  return `Claude Code: toolkit@${MARKETPLACE} is installed but not on for every folder, so "set up this project" works only after it is switched on. To switch it on for every folder: claude plugin enable toolkit@${MARKETPLACE} --scope user (ask the owner first). The other Toolkit V2 plugins stay off and turn on in each project.`;
}

/**
 * `toolkit machine-setup`: write the wrapper and the pointer, set the Toolkit
 * V2 plugin switches for every Codex folder, and check the programs. The
 * pointer and the wrapper's fallback name only an installed copy of the
 * toolkit (final review I1). Run from a test copy, it leaves the pointer
 * alone. When a toolkit-v2 marketplace is registered, it still writes the
 * wrapper (with the registered source folder as its fallback) and the Codex
 * plugin switches, because neither names the test copy.
 * Returns { pointer, wrapper, codex, tools, lines, problems }.
 */
export async function machineSetup({ env = process.env, pluginRoot, fetch: fetchFn, network = true } = {}) {
  const lines = [];
  const problems = [];
  const pointer = refreshPointer(pluginRoot, env);
  if (pointer.error) problems.push(`Could not write ${pointer.path}: ${pointer.error}.`);
  else if (pointer.skipped) {
    if (/newer version/.test(pointer.skipped)) lines.push(`${pointer.path} was left as it is: ${pointer.skipped}.`);
    else problems.push(`${pointer.path} was not changed: ${pointer.skipped}. Run toolkit machine-setup from an installed copy: node <toolkit-v2 folder>/plugins/toolkit/bin/toolkit machine-setup, after claude plugin marketplace add or codex plugin marketplace add registered that folder.`);
  } else lines.push(pointer.changed ? `Pointed ${pointer.path} at ${pointer.root}.` : `${pointer.path} already names ${pointer.root || pluginRoot}${pointer.same && real(pointer.same) !== real(pluginRoot) ? `, the same version as ${pluginRoot}` : ''}.`);

  const fallback = fallbackRoot(pluginRoot, env);
  const state = wrapperState(env);
  let wrapper = { path: state.path, written: false };
  if (state.exists && !state.ours) {
    problems.push(`${state.path} exists and was not written by toolkit machine-setup, so it was left alone.`);
    wrapper.skipped = true;
  } else if (!fallback) {
    problems.push(`The wrapper script ${state.path} was not written: no installed copy of toolkit@${MARKETPLACE} was found for its fallback folder. Add the marketplace first (claude plugin marketplace add or codex plugin marketplace add <toolkit-v2 folder>), then run this again.`);
    wrapper.skipped = true;
  } else {
    const text = wrapperScript(fallback);
    let current = null;
    try {
      current = fs.readFileSync(state.path, 'utf8');
    } catch {
      current = null;
    }
    try {
      if (current !== text) {
        atomicWrite(state.path, text);
        wrapper.written = true;
      }
      fs.chmodSync(state.path, 0o755);
      lines.push(wrapper.written ? `Wrote the wrapper script ${state.path} (fallback folder: ${fallback}).` : `The wrapper script ${state.path} is already up to date.`);
    } catch (err) {
      problems.push(`Could not write ${state.path}: ${err.message}.`);
    }
  }
  if (!onPath(path.dirname(state.path), env)) {
    problems.push(`${path.dirname(state.path)} is not on the PATH, so Codex cannot find the toolkit command. Add it to the PATH in the shell profile (ask the owner first).`);
  }
  const v = pluginVersion(pluginRoot);
  if (v) lines.push(`Toolkit plugin version: ${v} (${pluginRoot}).`);
  const codex = codexSwitchesOff(env);
  if (codex.error) problems.push(`Could not set the Toolkit V2 plugin switches for every Codex folder in ${codex.path}: ${codex.error}. Set enabled = false under each [plugins."<name>@toolkit-v2"] table except toolkit, and enabled = true under [plugins."toolkit@toolkit-v2"], by hand (ask the owner first).`);
  if (codex.changed.length) lines.push(`Switched off for every Codex folder in ${codex.path} (codex plugin add had turned ${codex.changed.length === 1 ? 'it' : 'them'} on): ${codex.changed.join(', ')}. Projects set up by toolkit init turn them on for themselves.`);
  if (codex.turnedOn && codex.turnedOn.length) lines.push(`Switched on for every Codex folder in ${codex.path}: ${codex.turnedOn.join(', ')}. It holds only project-setup and hooks that do nothing outside a Toolkit V2 project.`);
  lines.push(...codexSetupLines(env));
  const claudeLine = claudeMachineWideLine(env);
  if (claudeLine) lines.push(claudeLine);
  const tools = await toolChecks({ env, fetch: fetchFn, network });
  lines.push('Programs:');
  for (const t of tools) {
    lines.push(`  - ${t.name}: ${t.ok ? 'ok' : 'needs attention'}. ${t.detail}.${t.fix ? ` ${t.fix}` : ''}`);
    if (!t.ok && t.required) problems.push(`${t.name}: ${t.detail}. ${t.fix || ''}`.trim());
  }
  return { pointer, wrapper, codex, tools, lines, problems };
}

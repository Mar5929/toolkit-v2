// This computer's side of Toolkit V2 (ARCHITECTURE section 2, "Reaching the
// CLI"; critique P2):
//
// - ~/.config/toolkit-v2/plugin-root names the installed toolkit plugin folder.
//   Every SessionStart hook refreshes it from the folder the hook runs from.
// - ~/.local/bin/toolkit is a small wrapper script (a regular file, not a
//   link) that reads the pointer and runs `node <root>/bin/toolkit`. Codex
//   needs it, because Codex puts no plugin folder on the PATH. It falls back
//   to the toolkit-v2 source folder when the pointer is missing.
// - `toolkit machine-setup` writes both and checks node, git, ntn, ollama, and
//   Hindsight.

import fs from 'node:fs';
import path from 'node:path';
import { atomicWrite } from '../core/fsx.mjs';
import { run } from '../core/util.mjs';
import { toolkitConfigDir, wrapperDir, claudeMarketplaceSource, pluginVersion } from './hosts.mjs';

export const POINTER_FILE = 'plugin-root';
export const WRAPPER_NAME = 'toolkit';
export const WRAPPER_MARK = '# Written by toolkit machine-setup (Toolkit V2).';

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

/** True when a folder holds the toolkit command. */
export function isPluginRoot(dir) {
  try {
    return Boolean(dir) && fs.statSync(path.join(dir, 'bin', 'toolkit')).isFile();
  } catch {
    return false;
  }
}

/**
 * Point the pointer at a plugin folder when it names another one. Never throws
 * (a Codex sandbox may refuse the write). Returns { changed, path, error }.
 */
export function refreshPointer(pluginRoot, env = process.env) {
  const file = pointerPath(env);
  try {
    if (!isPluginRoot(pluginRoot)) return { changed: false, path: file, error: `${pluginRoot} has no bin/toolkit` };
    if (readPointer(env) === pluginRoot) return { changed: false, path: file };
    atomicWrite(file, `${pluginRoot}\n`);
    return { changed: true, path: file };
  } catch (err) {
    return { changed: false, path: file, error: err.message };
  }
}

/** The folder the wrapper falls back to: the toolkit-v2 source when this copy is a cached install. */
export function fallbackRoot(pluginRoot, env = process.env) {
  const cached = /[/\\]plugins[/\\]cache[/\\]/.test(pluginRoot) || /[/\\]\.codex[/\\]/.test(pluginRoot);
  if (!cached) return pluginRoot;
  const source = claudeMarketplaceSource(env);
  const candidate = source ? path.join(source, 'plugins', 'toolkit') : null;
  return candidate && isPluginRoot(candidate) ? candidate : pluginRoot;
}

function shellQuote(s) {
  return `'${String(s).replace(/'/g, "'\\''")}'`;
}

/** The wrapper script's text. */
export function wrapperScript(fallback) {
  return [
    '#!/bin/sh',
    WRAPPER_MARK,
    '# Runs the installed Toolkit V2 command. The plugin folder comes from',
    '# ~/.config/toolkit-v2/plugin-root, which every session-start hook refreshes.',
    '# When that file is missing, it uses the folder named on the fallback line.',
    'config_dir="${TOOLKIT_V2_CONFIG_DIR:-$HOME/.config/toolkit-v2}"',
    'root=""',
    'if [ -f "$config_dir/plugin-root" ]; then root=$(cat "$config_dir/plugin-root"); fi',
    `fallback=${shellQuote(fallback)}`,
    'if [ -z "$root" ] || [ ! -f "$root/bin/toolkit" ]; then root="$fallback"; fi',
    'if [ ! -f "$root/bin/toolkit" ]; then',
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
    fix: !ollama ? 'Install it with Homebrew (ask the owner first).' : ollamaUp === false ? 'Start it with brew services start ollama (ask the owner first).' : null,
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
    fix: hsBin && hsUp === false ? 'Check it with toolkit hindsight service status; start it after the owner\'s yes.' : null,
  });
  return out;
}

/**
 * `toolkit machine-setup`: write the wrapper and the pointer, and check the programs.
 * Returns { pointer, wrapper, tools, lines, problems }.
 */
export async function machineSetup({ env = process.env, pluginRoot, fetch: fetchFn, network = true } = {}) {
  const lines = [];
  const problems = [];
  const pointer = refreshPointer(pluginRoot, env);
  if (pointer.error) problems.push(`Could not write ${pointer.path}: ${pointer.error}.`);
  else lines.push(pointer.changed ? `Pointed ${pointer.path} at ${pluginRoot}.` : `${pointer.path} already names ${pluginRoot}.`);

  const fallback = fallbackRoot(pluginRoot, env);
  const state = wrapperState(env);
  const text = wrapperScript(fallback);
  let wrapper = { path: state.path, written: false };
  if (state.exists && !state.ours) {
    problems.push(`${state.path} exists and was not written by toolkit machine-setup, so it was left alone.`);
    wrapper.skipped = true;
  } else {
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
  const tools = await toolChecks({ env, fetch: fetchFn, network });
  lines.push('Programs:');
  for (const t of tools) {
    lines.push(`  - ${t.name}: ${t.ok ? 'ok' : 'needs attention'}. ${t.detail}.${t.fix ? ` ${t.fix}` : ''}`);
    if (!t.ok && t.required) problems.push(`${t.name}: ${t.detail}. ${t.fix || ''}`.trim());
  }
  return { pointer, wrapper, tools, lines, problems };
}

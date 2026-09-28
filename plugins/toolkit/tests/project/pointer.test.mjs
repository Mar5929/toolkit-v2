// The machine-wide plugin-root pointer (final review I1): only a real
// installed copy of the toolkit may be named in
// ~/.config/toolkit-v2/plugin-root: the Claude Code or Codex plugin cache for
// the toolkit-v2 marketplace, or the marketplace source folder one of them
// registered. A copy loaded with --plugin-dir from a scratch folder never is,
// a newer version is never replaced by an older one, the SessionStart hook
// changes nothing outside a Toolkit V2 project, and the wrapper falls back
// when the pointer names an incomplete copy.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { cleanup, initProject, makeHome, makeRepo, read, tempDir, testEnv, tk, PLUGIN_ROOT, MARKETPLACE_SOURCE } from './helpers.mjs';
import { fixture } from '../hooks/fixtures.mjs';
import {
  refreshPointer, isInstalledRoot, installedRoots, isCompleteRoot, readPointer, pointerPath, wrapperScript, fallbackRoot,
} from '../../lib/project/machine.mjs';
import { sessionStart } from '../../lib/hooks/session-start.mjs';

after(cleanup);

/** A copy of a plugin folder with only what the pointer checks: bin/toolkit, scaffold/CONDITIONS.json, and a manifest. */
function fakeCopy(dir, version, { scaffold = true } = {}) {
  fs.mkdirSync(path.join(dir, 'bin'), { recursive: true });
  fs.copyFileSync(path.join(PLUGIN_ROOT, 'bin', 'toolkit'), path.join(dir, 'bin', 'toolkit'));
  if (scaffold) {
    fs.mkdirSync(path.join(dir, 'scaffold'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'scaffold', 'CONDITIONS.json'), '{}\n');
  }
  fs.mkdirSync(path.join(dir, '.claude-plugin'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.claude-plugin', 'plugin.json'), `${JSON.stringify({ name: 'toolkit', version })}\n`);
  return dir;
}

function codexCache(home, version, opts) {
  return fakeCopy(path.join(home, '.codex', 'plugins', 'cache', 'toolkit-v2', 'toolkit', version), version, opts);
}

function claudeCache(home, version) {
  const dir = fakeCopy(path.join(home, '.claude', 'plugins', 'cache', 'toolkit-v2', 'toolkit', version), version);
  const file = path.join(home, '.claude', 'plugins', 'installed_plugins.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let data = { version: 2, plugins: {} };
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    // New file.
  }
  data.plugins['toolkit@toolkit-v2'] = [...(data.plugins['toolkit@toolkit-v2'] || []), { scope: 'user', installPath: dir, version }];
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  return dir;
}

test('installed copies: the Claude Code and Codex plugin caches and the registered source folder; a scratch copy is not one', () => {
  const home = makeHome();
  const env = testEnv(home);
  const codex = codexCache(home, '0.2.4');
  const claude = claudeCache(home, '0.2.5');
  const scratch = fakeCopy(path.join(tempDir('tk-scratch-'), 'plugins', 'toolkit'), '0.2.3');
  const roots = installedRoots(env);
  assert.ok(roots.includes(fs.realpathSync(codex)));
  assert.ok(roots.includes(fs.realpathSync(claude)));
  assert.ok(isInstalledRoot(PLUGIN_ROOT, env), 'the source folder registered as the toolkit-v2 marketplace');
  assert.equal(isInstalledRoot(scratch, env), false, 'a --plugin-dir test copy');
  const bare = testEnv(makeHome({ marketplace: false }));
  assert.equal(isInstalledRoot(PLUGIN_ROOT, bare), false, 'the source folder counts only when a host registered it');
});

test('refreshPointer writes only a complete installed copy, and never replaces a newer version with an older one', () => {
  const home = makeHome();
  const env = testEnv(home);
  const scratch = fakeCopy(path.join(tempDir('tk-scratch-'), 'plugins', 'toolkit'), '9.9.9');
  let res = refreshPointer(scratch, env);
  assert.equal(res.changed, false);
  assert.match(res.skipped, /is not an installed copy of toolkit@toolkit-v2/);
  assert.equal(readPointer(env), null, 'the scratch copy was not written');

  const incomplete = codexCache(home, '0.3.0', { scaffold: false });
  res = refreshPointer(incomplete, env);
  assert.match(res.error, /no scaffold\/CONDITIONS\.json/);
  assert.equal(readPointer(env), null);

  const newer = claudeCache(home, '0.2.6');
  const older = codexCache(home, '0.2.4');
  assert.equal(refreshPointer(newer, env).changed, true);
  assert.equal(readPointer(env), newer);
  res = refreshPointer(older, env);
  assert.equal(res.changed, false);
  assert.match(res.skipped, /is a newer version \(0\.2\.6\)/);
  assert.equal(readPointer(env), newer, 'the newer copy stays');

  // Another copy of the same version: the pointer stays, so it does not change back and forth.
  const twin = codexCache(home, '0.2.6');
  res = refreshPointer(twin, env);
  assert.equal(res.changed, false);
  assert.equal(res.same, newer);
  assert.equal(readPointer(env), newer);

  // A pointer to a scratch copy (written before this fix) is replaced by any installed copy.
  fs.writeFileSync(pointerPath(env), `${scratch}\n`);
  assert.equal(refreshPointer(older, env).changed, true);
  assert.equal(readPointer(env), older);
});

test('machine-setup from a scratch copy changes neither the pointer nor the wrapper', async () => {
  const home = makeHome({ marketplace: false });
  const env = testEnv(home, { PATH: `${path.join(home, '.local', 'bin')}${path.delimiter}${process.env.PATH}` });
  const res = await tk(home, ['machine-setup', '--offline'], { env });
  assert.equal(res.code, 1);
  assert.match(res.stdout, /plugin-root was not changed: .* is not an installed copy of toolkit@toolkit-v2/);
  assert.match(res.stdout, /was not written: no installed copy of toolkit@toolkit-v2 was found for its fallback folder/);
  assert.equal(readPointer(env), null);
  assert.equal(fs.existsSync(path.join(home, '.local', 'bin', 'toolkit')), false);
});

test('the SessionStart hook writes the pointer only inside a Toolkit V2 project, and only from an installed copy', async () => {
  const home = makeHome();
  const env = testEnv(home);
  const plain = makeRepo();
  const input = (cwd) => fixture('claude', 'session-start.startup', { CWD: cwd, SESSION: 'ptr-1' });
  // Outside a V2 project: nothing is written (decision 10: the toolkit plugin is on in every folder).
  assert.equal(await sessionStart(input(plain), { host: 'claude', env, pluginRoot: PLUGIN_ROOT, cwd: plain }), null);
  assert.equal(readPointer(env), null);

  const { root } = await initProject({ home });
  // A scratch copy loaded with --plugin-dir: the hook runs, the pointer is left alone.
  const scratch = fakeCopy(path.join(tempDir('tk-scratch-'), 'plugins', 'toolkit'), '0.2.3');
  await sessionStart(input(root), { host: 'claude', env, pluginRoot: scratch, cwd: root });
  assert.equal(readPointer(env), null);
  // The installed copy: written.
  const out = await sessionStart(input(root), { host: 'claude', env, pluginRoot: PLUGIN_ROOT, cwd: root });
  assert.ok(out && out.hookSpecificOutput.additionalContext);
  assert.equal(readPointer(env), PLUGIN_ROOT);
});

test('the wrapper uses its fallback folder when the pointer names a copy without scaffold/CONDITIONS.json', () => {
  const home = makeHome();
  const env = testEnv(home);
  assert.equal(fallbackRoot(PLUGIN_ROOT, env), path.join(MARKETPLACE_SOURCE, 'plugins', 'toolkit'));
  const dir = tempDir();
  const wrapper = path.join(dir, 'toolkit');
  fs.writeFileSync(wrapper, wrapperScript(fallbackRoot(PLUGIN_ROOT, env)), { mode: 0o755 });
  const broken = fakeCopy(path.join(tempDir('tk-scratch-'), 'plugins', 'toolkit'), '0.2.3', { scaffold: false });
  fs.writeFileSync(path.join(broken, 'bin', 'toolkit'), '#!/usr/bin/env node\nconsole.log("the broken copy ran");\n');
  assert.equal(isCompleteRoot(broken), false);
  fs.mkdirSync(env.TOOLKIT_V2_CONFIG_DIR, { recursive: true });
  fs.writeFileSync(pointerPath(env), `${broken}\n`);
  const res = spawnSync('/bin/sh', [wrapper, 'version'], { env, encoding: 'utf8' });
  assert.equal(res.status, 0, res.stderr);
  assert.doesNotMatch(res.stdout, /the broken copy ran/);
  assert.match(res.stdout.trim(), /^\d+\.\d+\.\d+$/);
  assert.match(read(wrapper), /\[ ! -f "\$root\/scaffold\/CONDITIONS\.json" \]/);
});

test('doctor warns when the pointer names a copy that is not installed, and names the pointer file in use', async () => {
  const { root, env } = await initProject({ extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  const scratch = fakeCopy(path.join(tempDir('tk-scratch-'), 'plugins', 'toolkit'), '0.2.3');
  fs.mkdirSync(env.TOOLKIT_V2_CONFIG_DIR, { recursive: true });
  fs.writeFileSync(pointerPath(env), `${scratch}\n`);
  const res = await tk(root, ['doctor', '--json'], { env });
  const f = res.json.findings.find((x) => x.id === 'plugin-pointer');
  assert.ok(f, JSON.stringify(res.json.findings.map((x) => x.id)));
  assert.ok(f.message.startsWith(`${pointerPath(env)} names ${scratch}, which is not an installed copy`), f.message);
  // A Claude Code-only project needs no pointer or wrapper (final review M4).
  const claudeOnly = await initProject({ hosts: 'claude-code', extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  const r2 = await tk(claudeOnly.root, ['doctor', '--json'], { env: claudeOnly.env });
  assert.ok(!r2.json.findings.some((x) => ['plugin-pointer', 'wrapper-missing'].includes(x.id)), JSON.stringify(r2.json.findings.map((x) => x.id)));
});

test('at the same version a plugin cache copy replaces the source folder in the pointer, and the source folder never replaces a cache copy', () => {
  // The source folder is the live toolkit-v2 working folder, which other
  // sessions edit; the skills and hooks run from a cache copy (verifier, I1).
  const source = tempDir('tk-source-');
  const sourceRoot = fakeCopy(path.join(source, 'plugins', 'toolkit'), '0.2.5');
  const home = makeHome({ marketplace: source });
  const env = testEnv(home);
  // No cache copy yet: the source folder may be named.
  assert.equal(refreshPointer(sourceRoot, env).changed, true);
  assert.equal(readPointer(env), sourceRoot);
  // A Codex 0.2.5 cache copy's SessionStart moves the pointer to the cache.
  const cache = codexCache(home, '0.2.5');
  let res = refreshPointer(cache, env);
  assert.equal(res.changed, true);
  assert.equal(readPointer(env), cache);
  // machine-setup from the source folder afterwards: the cache copy stays.
  res = refreshPointer(sourceRoot, env);
  assert.equal(res.changed, false);
  assert.equal(readPointer(env), cache);
  // A pointer left on the source folder: machine-setup from the source writes the cache copy instead.
  fs.writeFileSync(pointerPath(env), `${sourceRoot}\n`);
  res = refreshPointer(sourceRoot, env);
  assert.equal(res.changed, true);
  assert.equal(res.root, cache);
  assert.equal(readPointer(env), cache);
  // A cache copy of a newer version is also preferred over the source folder.
  const newer = claudeCache(home, '0.2.6');
  fs.writeFileSync(pointerPath(env), `${sourceRoot}\n`);
  assert.equal(refreshPointer(sourceRoot, env).root, newer);
  assert.equal(readPointer(env), newer);
  // The source folder wins only when no cache copy of its version or newer exists.
  const source2 = tempDir('tk-source-');
  const raised = fakeCopy(path.join(source2, 'plugins', 'toolkit'), '0.2.7');
  const home2 = makeHome({ marketplace: source2 });
  const env2 = testEnv(home2);
  const old = codexCache(home2, '0.2.6');
  assert.equal(refreshPointer(old, env2).changed, true);
  assert.equal(refreshPointer(raised, env2).changed, true);
  assert.equal(readPointer(env2), raised);
});

test('machine-setup run from the registered source folder names a cache copy of the same version in the pointer', async () => {
  const home = makeHome();
  const env = testEnv(home, { PATH: `${path.join(home, '.local', 'bin')}${path.delimiter}${process.env.PATH}` });
  const version = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json'), 'utf8')).version;
  const cache = codexCache(home, version);
  const res = await tk(home, ['machine-setup', '--offline'], { env });
  assert.match(res.stdout, new RegExp(`Pointed .*plugin-root at ${cache.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.`));
  assert.equal(readPointer(env), cache);
});

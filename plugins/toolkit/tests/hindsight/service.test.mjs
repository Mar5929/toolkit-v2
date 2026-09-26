// The launchd service logic, with a fake launchctl and a temporary plist path.
// These tests never run the real launchctl and never write to ~/Library.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createService, renderPlist, plistFolders, DEFAULT_TEMPLATE, LABEL, defaultPlistPath } from '../../lib/hindsight/service.mjs';
import { run } from '../../lib/core/util.mjs';
import { EXIT } from '../../lib/core/output.mjs';
import { cleanup, runToolkit, tempDir } from '../memory/helpers.mjs';

after(cleanup);

/** A fake launchctl that keeps its loaded state in memory; plutil runs for real when present. */
function fakeRunner({ loaded = false, running = true } = {}) {
  const state = { loaded, running, calls: [] };
  const runner = (cmd, args) => {
    if (cmd === 'plutil') {
      const res = run('plutil', args, { timeoutMs: 10000 });
      if (res.code === 127) return args[0] === '-lint' ? { code: 0, stdout: 'OK', stderr: '' } : { code: 1, stdout: '', stderr: 'no plutil' };
      return res;
    }
    assert.equal(cmd, 'launchctl', `unexpected program ${cmd}`);
    state.calls.push(args.join(' '));
    const [verb] = args;
    if (verb === 'print') {
      if (!state.loaded) return { code: 113, stdout: '', stderr: 'Could not find service' };
      return { code: 0, stdout: `gui/501/${LABEL} = {\n\tstate = ${state.running ? 'running' : 'not running'}\n${state.running ? '\tpid = 4242\n' : '\tlast exit code = 1\n'}}\n`, stderr: '' };
    }
    if (verb === 'bootstrap') {
      if (state.loaded) return { code: 5, stdout: '', stderr: 'Bootstrap failed: 5: Input/output error' };
      state.loaded = true;
      state.running = true;
      return { code: 0, stdout: '', stderr: '' };
    }
    if (verb === 'bootout') {
      if (!state.loaded) return { code: 3, stdout: '', stderr: 'No such process' };
      state.loaded = false;
      state.running = false;
      return { code: 0, stdout: '', stderr: '' };
    }
    if (verb === 'kickstart') {
      state.running = true;
      return { code: 0, stdout: '', stderr: '' };
    }
    return { code: 1, stdout: '', stderr: `unknown verb ${verb}` };
  };
  return { runner, state };
}

function setup(options) {
  const dir = tempDir('tk-svc-');
  const home = path.join(dir, 'home');
  fs.mkdirSync(home);
  const plistPath = path.join(dir, 'LaunchAgents', `${LABEL}.plist`);
  const fake = fakeRunner(options);
  const service = createService({ plistPath, home, uid: 501, runner: fake.runner, tmpDir: dir });
  return { dir, home, plistPath, fake, service };
}

test('the template has only the {{HOME}} token and renders to a valid plist', () => {
  const text = fs.readFileSync(DEFAULT_TEMPLATE, 'utf8');
  assert.deepEqual([...new Set(text.match(/\{\{[^}]*\}\}/g))], ['{{HOME}}']);
  const out = renderPlist(text, { HOME: '/Users/someone' });
  assert.doesNotMatch(out, /\{\{/);
  assert.match(out, /<string>\/Users\/someone\/\.local\/bin\/hindsight-api<\/string>/);
  assert.match(out, /<key>HINDSIGHT_API_HOST<\/key>\s*<string>127\.0\.0\.1<\/string>/);
  assert.match(out, /<key>HF_HUB_OFFLINE<\/key>\s*<string>1<\/string>/);
  assert.deepEqual(plistFolders(out).sort(), ['/Users/someone/.hindsight', '/Users/someone/.hindsight/logs']);
  assert.throws(() => renderPlist('{{HOME}} {{PORT}}', { HOME: '/x' }), (err) => err.code === EXIT.INVALID && /\{\{PORT\}\}/.test(err.message));
});

test('install on a fresh computer writes the plist, makes the folders, and loads it', async () => {
  const { home, plistPath, fake, service } = setup();
  const res = await service.install();
  assert.equal(res.action, 'installed');
  assert.equal(res.changed, true);
  assert.equal(res.loaded, true);
  const text = fs.readFileSync(plistPath, 'utf8');
  assert.match(text, new RegExp(`<string>${home}/.hindsight</string>`));
  assert.equal(fs.statSync(plistPath).mode & 0o777, 0o644);
  assert.ok(fs.existsSync(path.join(home, '.hindsight', 'logs')));
  assert.deepEqual(fake.state.calls, ['print gui/501/local.toolkit-v2.hindsight', `bootstrap gui/501 ${plistPath}`, 'print gui/501/local.toolkit-v2.hindsight']);
});

test('install again with the same plist already loaded changes nothing', async () => {
  const { plistPath, fake, service } = setup();
  await service.install();
  const before = fs.statSync(plistPath).mtimeMs;
  fake.state.calls.length = 0;
  const res = await service.install();
  assert.equal(res.action, 'none');
  assert.equal(res.changed, false);
  assert.match(res.message, /already installed with this plist and loaded/);
  assert.deepEqual(fake.state.calls, ['print gui/501/local.toolkit-v2.hindsight'], 'no bootout and no bootstrap');
  assert.equal(fs.statSync(plistPath).mtimeMs, before, 'the file was not rewritten');
});

test('install with the same plist but not loaded only loads it', async () => {
  const { fake, service } = setup();
  await service.install();
  fake.state.loaded = false;
  fake.state.calls.length = 0;
  const res = await service.install();
  assert.equal(res.action, 'loaded');
  assert.ok(fake.state.calls.some((c) => c.startsWith('bootstrap')));
  assert.ok(!fake.state.calls.some((c) => c.startsWith('bootout')));
});

test('install over a different plist unloads the old one first, then replaces and loads', async () => {
  const { plistPath, fake, service } = setup({ loaded: true });
  fs.mkdirSync(path.dirname(plistPath), { recursive: true });
  fs.writeFileSync(plistPath, '<?xml version="1.0" encoding="UTF-8"?>\n<plist version="1.0"><dict><key>Label</key><string>old</string></dict></plist>\n');
  const res = await service.install();
  assert.equal(res.action, 'replaced');
  const verbs = fake.state.calls.map((c) => c.split(' ')[0]);
  assert.ok(verbs.indexOf('bootout') !== -1 && verbs.indexOf('bootout') < verbs.lastIndexOf('bootstrap'), verbs.join(','));
  assert.match(fs.readFileSync(plistPath, 'utf8'), /local\.toolkit-v2\.hindsight/);
});

test('a plist that differs only in whitespace counts as the same', async () => {
  const { plistPath, fake, service } = setup();
  await service.install();
  fs.writeFileSync(plistPath, `${fs.readFileSync(plistPath, 'utf8').replace(/\n/g, '\r\n')}\n\n`);
  fake.state.calls.length = 0;
  const res = await service.install();
  assert.equal(res.action, 'none');
});

test('start, stop, and status', async () => {
  const { fake, service } = setup();
  await assert.rejects(service.start(), (err) => err.code === EXIT.ERROR && /not installed/.test(err.message));
  await service.install();
  let st = await service.status();
  assert.equal(st.installed, true);
  assert.equal(st.loaded, true);
  assert.equal(st.running, true);
  assert.equal(st.pid, 4242);
  assert.equal(st.sameAsTemplate, true);
  assert.equal((await service.start()).action, 'none');
  fake.state.running = false;
  assert.equal((await service.start()).action, 'started');
  assert.ok(fake.state.calls.includes('kickstart gui/501/local.toolkit-v2.hindsight'));
  const stopped = await service.stop();
  assert.equal(stopped.action, 'stopped');
  assert.equal(stopped.loaded, false);
  assert.equal((await service.stop()).action, 'none');
  st = await service.status();
  assert.equal(st.loaded, false);
  assert.equal((await service.start()).action, 'loaded');
});

test('the installed plist on this Mac matches the template, so install would change nothing (read only)', async (t) => {
  const real = defaultPlistPath();
  if (!fs.existsSync(real)) {
    t.skip(`${real} is not installed on this computer`);
    return;
  }
  // Reads the real file only; launchctl is the fake, so nothing is loaded or unloaded.
  const fake = fakeRunner({ loaded: true });
  const service = createService({ plistPath: real, home: os.homedir(), uid: 501, runner: fake.runner });
  const st = await service.status();
  assert.equal(st.sameAsTemplate, true);
  assert.deepEqual(fake.state.calls, ['print gui/501/local.toolkit-v2.hindsight']);
});

test('the service command uses TOOLKIT_LAUNCHCTL and TOOLKIT_HINDSIGHT_PLIST instead of the real ones', async () => {
  const dir = tempDir('tk-svc-cli-');
  const stateFile = path.join(dir, 'state.json');
  const logFile = path.join(dir, 'calls.log');
  const fake = path.join(dir, 'launchctl');
  fs.writeFileSync(fake, `#!/usr/bin/env node
const fs = require('fs');
const args = process.argv.slice(2);
fs.appendFileSync(${JSON.stringify(logFile)}, args.join(' ') + '\\n');
let s = { loaded: false };
try { s = JSON.parse(fs.readFileSync(${JSON.stringify(stateFile)}, 'utf8')); } catch {}
const save = () => fs.writeFileSync(${JSON.stringify(stateFile)}, JSON.stringify(s));
if (args[0] === 'print') { if (!s.loaded) process.exit(113); console.log('\\tstate = running\\n\\tpid = 99'); process.exit(0); }
if (args[0] === 'bootstrap') { if (s.loaded) process.exit(5); s.loaded = true; save(); process.exit(0); }
if (args[0] === 'bootout') { s.loaded = false; save(); process.exit(0); }
process.exit(0);
`);
  fs.chmodSync(fake, 0o755);
  const plist = path.join(dir, 'agents', `${LABEL}.plist`);
  const home = path.join(dir, 'home');
  const env = { ...process.env, TOOLKIT_LAUNCHCTL: fake, TOOLKIT_HINDSIGHT_PLIST: plist, TOOLKIT_HINDSIGHT_HOME: home };
  const first = await runToolkit(['hindsight', 'service', 'install', '--no-wait', '--json'], { cwd: dir, env });
  assert.equal(first.code, 0, first.stdout + first.stderr);
  assert.equal(first.json.action, 'installed');
  assert.ok(fs.existsSync(plist));
  assert.match(fs.readFileSync(plist, 'utf8'), new RegExp(`<string>${home}/.hindsight/logs/hindsight-api.log</string>`));
  assert.ok(fs.existsSync(path.join(home, '.hindsight', 'logs')));
  const second = await runToolkit(['hindsight', 'service', 'install', '--no-wait', '--json'], { cwd: dir, env });
  assert.equal(second.json.action, 'none');
  const calls = fs.readFileSync(logFile, 'utf8').trim().split('\n');
  assert.equal(calls.filter((c) => c.startsWith('bootstrap')).length, 1, calls.join('\n'));
  assert.ok(calls.every((c) => c.includes('local.toolkit-v2.hindsight') || c.startsWith('bootstrap gui/')), calls.join('\n'));
  const stop = await runToolkit(['hindsight', 'service', 'stop', '--json'], { cwd: dir, env });
  assert.equal(stop.json.action, 'stopped');
  const bad = await runToolkit(['hindsight', 'service', 'restart'], { cwd: dir, env });
  assert.equal(bad.code, 2);
});

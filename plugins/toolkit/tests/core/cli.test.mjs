import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { main, readVersion, listCommandGroups, detectHost, DEFAULT_VERSION, PLUGIN_ROOT } from '../../lib/cli.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN = path.resolve(HERE, '..', '..');
const BIN = path.join(PLUGIN, 'bin', 'toolkit');
const CORE_URL = (name) => pathToFileURL(path.join(PLUGIN, 'lib', 'core', name)).href;

function expectedVersion() {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(PLUGIN, '.claude-plugin', 'plugin.json'), 'utf8'));
    if (typeof manifest.version === 'string' && manifest.version.trim()) return manifest.version.trim();
  } catch {
    // No manifest yet.
  }
  return '0.1.0';
}

const made = [];
after(() => {
  for (const dir of made) fs.rmSync(dir, { recursive: true, force: true });
});

function tempDir(prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  made.push(dir);
  return dir;
}

function sink() {
  const s = { text: '', write(chunk) { s.text += chunk; return true; } };
  return s;
}

function runBin(args, { input, env } = {}) {
  return spawnSync(BIN, args, { encoding: 'utf8', input, env: env || { ...process.env, TOOLKIT_DEBUG: '' } });
}

// A temporary commands folder with a few test commands.
function commandsFixture() {
  const dir = tempDir('toolkit-cli-');
  fs.writeFileSync(path.join(dir, 'echo.mjs'), `
import { out } from ${JSON.stringify(CORE_URL('output.mjs'))};
export const summary = 'Print what it was given.';
export const help = 'toolkit echo [words] [--stdin]';
export async function run(argv, ctx) {
  const input = argv.includes('--stdin') ? await ctx.stdin() : null;
  out(ctx, 'echo ' + argv.join(' '), { argv, cwd: ctx.cwd, json: ctx.json, host: ctx.host, input, hasEnv: typeof ctx.env === 'object' });
}
`);
  fs.writeFileSync(path.join(dir, 'boom.mjs'), `
import { ToolkitError, EXIT } from ${JSON.stringify(CORE_URL('output.mjs'))};
export const summary = 'Always fails.';
export async function run(argv) {
  if (argv[0] === 'invalid') throw new ToolkitError(EXIT.INVALID, 'That stage does not exist.', { fix: 'Use 01 to 14.' });
  if (argv[0] === 'return') return 3;
  if (argv[0] === 'plain') throw new Error('unexpected failure');
  return 0;
}
`);
  fs.writeFileSync(path.join(dir, 'broken.mjs'), 'export const summary = "Broken"; this is not javascript');
  fs.writeFileSync(path.join(dir, 'norun.mjs'), 'export const summary = "No run function";');
  fs.writeFileSync(path.join(dir, 'Bad_Name.mjs'), 'export async function run() {}');
  fs.writeFileSync(path.join(dir, 'skip.test.mjs'), 'export async function run() {}');
  fs.writeFileSync(path.join(dir, 'notes.txt'), 'not a command');
  return dir;
}

async function call(argv, overrides = {}) {
  const stdout = sink();
  const stderr = sink();
  const code = await main(argv, { stdout, stderr, env: {}, ...overrides });
  return { code, stdout: stdout.text, stderr: stderr.text };
}

test('bin/toolkit version prints the plugin version', () => {
  const res = runBin(['version']);
  assert.equal(res.status, 0, res.stderr);
  assert.equal(res.stdout, `${expectedVersion()}\n`);
  assert.equal(res.stderr, '');
  assert.equal(readVersion(), expectedVersion());
});

test('bin/toolkit is executable and starts with a node shebang', () => {
  const mode = fs.statSync(BIN).mode;
  assert.ok(mode & 0o111, 'executable bit set');
  assert.ok(fs.readFileSync(BIN, 'utf8').startsWith('#!/usr/bin/env node\n'));
});

test('readVersion falls back to 0.1.0 without a manifest, and reads one when present', () => {
  const dir = tempDir('toolkit-version-');
  assert.equal(readVersion(dir), DEFAULT_VERSION);
  assert.equal(DEFAULT_VERSION, '0.1.0');
  fs.mkdirSync(path.join(dir, '.claude-plugin'));
  fs.writeFileSync(path.join(dir, '.claude-plugin', 'plugin.json'), '{ not json');
  assert.equal(readVersion(dir), '0.1.0');
  fs.writeFileSync(path.join(dir, '.claude-plugin', 'plugin.json'), JSON.stringify({ name: 'toolkit', version: '2.3.4' }));
  assert.equal(readVersion(dir), '2.3.4');
  assert.equal(PLUGIN_ROOT, PLUGIN);
});

test('bin/toolkit --json version, --version, and -v', () => {
  const res = runBin(['--json', 'version']);
  assert.equal(res.status, 0);
  assert.deepEqual(JSON.parse(res.stdout), { version: expectedVersion() });
  assert.equal(runBin(['version', '--json']).stdout.trim().startsWith('{'), true);
  assert.equal(runBin(['--version']).stdout, `${expectedVersion()}\n`);
  assert.equal(runBin(['-v']).stdout, `${expectedVersion()}\n`);
});

test('bin/toolkit with no arguments or help lists the commands', () => {
  for (const args of [[], ['help'], ['--help'], ['-h']]) {
    const res = runBin(args);
    assert.equal(res.status, 0, args.join(' '));
    assert.match(res.stdout, /^Usage: toolkit <command>/);
    assert.match(res.stdout, /\n {2}help +List the commands/);
    assert.match(res.stdout, /\n {2}version +Print the toolkit version/);
    for (const group of listCommandGroups()) assert.match(res.stdout, new RegExp(`\\n  ${group} `));
  }
});

test('bin/toolkit with an unknown command exits 1 and lists the commands', () => {
  const res = runBin(['frobnicate']);
  assert.equal(res.status, 1);
  assert.equal(res.stdout, '');
  const groups = ['help', 'version', ...listCommandGroups()].sort();
  assert.match(res.stderr, new RegExp(`Unknown command "frobnicate"\\. Commands: ${groups.join(', ')}\\.`));

  const json = runBin(['frobnicate', '--json']);
  assert.equal(json.status, 1);
  const body = JSON.parse(json.stdout);
  assert.equal(body.ok, false);
  assert.equal(body.error.code, 1);
  assert.deepEqual(body.error.details.commands, groups);
});

test('dispatch: run(argv, ctx) gets the arguments after the group and a full ctx', async () => {
  const commandsDir = commandsFixture();
  const cwd = tempDir('toolkit-cwd-');
  const res = await call(['echo', 'sub', '--flag', 'value'], { commandsDir, cwd });
  assert.equal(res.code, 0);
  assert.equal(res.stdout, 'echo sub --flag value\n');

  const json = await call(['--json', 'echo', 'sub', '--host', 'codex'], { commandsDir, cwd });
  assert.equal(json.code, 0);
  assert.deepEqual(JSON.parse(json.stdout), {
    argv: ['sub', '--host', 'codex'],
    cwd,
    json: true,
    host: 'codex',
    input: null,
    hasEnv: true,
  });

  const host = await call(['echo', '--host=claude-code', '--json'], { commandsDir });
  assert.equal(JSON.parse(host.stdout).host, 'claude');
});

test('dispatch: stdin is read on request', async () => {
  const commandsDir = commandsFixture();
  const res = await call(['echo', '--stdin', '--json'], { commandsDir, stdin: '{"hook_event_name":"Stop"}' });
  assert.equal(JSON.parse(res.stdout).input, '{"hook_event_name":"Stop"}');

  // Through a real process with piped input.
  const script = `const { main } = await import(${JSON.stringify(pathToFileURL(path.join(PLUGIN, 'lib', 'cli.mjs')).href)});
process.exitCode = await main(['echo', '--stdin', '--json'], { commandsDir: ${JSON.stringify(commandsDir)} });`;
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', script], { input: 'piped input', encoding: 'utf8' });
  assert.equal(child.status, 0, child.stderr);
  assert.equal(JSON.parse(child.stdout).input, 'piped input');
});

test('ctx.stdin with timeoutMs returns what arrived when the input is left open', async () => {
  const commandsDir = tempDir('toolkit-cli-');
  fs.writeFileSync(path.join(commandsDir, 'partial.mjs'), `
export const summary = 'Reads stdin with a time limit.';
export async function run(argv, ctx) {
  const text = await ctx.stdin({ timeoutMs: 300 });
  ctx.stdout.write(JSON.stringify({ text }));
}
`);
  const script = `const { main } = await import(${JSON.stringify(pathToFileURL(path.join(PLUGIN, 'lib', 'cli.mjs')).href)});
process.exitCode = await main(['partial'], { commandsDir: ${JSON.stringify(commandsDir)} });`;
  const { spawn } = await import('node:child_process');
  const child = spawn(process.execPath, ['--input-type=module', '-e', script], { stdio: ['pipe', 'pipe', 'pipe'] });
  let stdout = '';
  child.stdout.on('data', (c) => { stdout += c; });
  child.stdin.write('{"partial":');
  const started = Date.now();
  const code = await new Promise((resolve) => child.on('close', resolve));
  child.stdin.destroy();
  assert.equal(code, 0);
  assert.deepEqual(JSON.parse(stdout), { text: '{"partial":' });
  assert.ok(Date.now() - started < 5000, 'the process ends without waiting for the input to close');
});

test('ctx.stdin helpers: json(), async iteration, and caching', async () => {
  const commandsDir = tempDir('toolkit-cli-');
  fs.writeFileSync(path.join(commandsDir, 'reader.mjs'), `
export const summary = 'Reads stdin.';
export async function run(argv, ctx) {
  const parsed = await ctx.stdin.json();
  let joined = '';
  for await (const chunk of ctx.stdin) joined += chunk;
  const again = await ctx.stdin.text();
  ctx.stdout.write(JSON.stringify({ parsed, joined, again, stream: ctx.stdin.stream === null }));
}
`);
  const res = await call(['reader'], { commandsDir, stdin: '{"a":1}' });
  assert.deepEqual(JSON.parse(res.stdout), { parsed: { a: 1 }, joined: '{"a":1}', again: '{"a":1}', stream: true });
  const empty = await call(['reader'], { commandsDir, stdin: '' });
  assert.equal(JSON.parse(empty.stdout).parsed, null);
  const bad = await call(['reader'], { commandsDir, stdin: 'not json' });
  assert.equal(bad.code, 2);
  assert.match(bad.stderr, /not valid JSON/);
});

test('dispatch: exit codes from thrown errors and returned numbers', async () => {
  const commandsDir = commandsFixture();
  const invalid = await call(['boom', 'invalid'], { commandsDir });
  assert.equal(invalid.code, 2);
  assert.equal(invalid.stderr, 'Error: That stage does not exist.\nFix: Use 01 to 14.\n');

  const invalidJson = await call(['boom', 'invalid', '--json'], { commandsDir });
  assert.equal(invalidJson.code, 2);
  assert.equal(JSON.parse(invalidJson.stdout).error.message, 'That stage does not exist.');

  assert.equal((await call(['boom', 'return'], { commandsDir })).code, 3);
  assert.equal((await call(['boom'], { commandsDir })).code, 0);

  const plain = await call(['boom', 'plain'], { commandsDir });
  assert.equal(plain.code, 1);
  assert.equal(plain.stderr, 'Unexpected error: unexpected failure\n');
});

test('dispatch: broken command files are reported, not treated as unknown', async () => {
  const commandsDir = commandsFixture();
  const broken = await call(['broken'], { commandsDir });
  assert.equal(broken.code, 1);
  assert.match(broken.stderr, /The command file for "broken" could not be loaded/);
  const norun = await call(['norun'], { commandsDir });
  assert.equal(norun.code, 1);
  assert.match(norun.stderr, /does not export a run function/);
});

test('dispatch: names that are not command files are unknown', async () => {
  const commandsDir = commandsFixture();
  for (const name of ['../boom', 'Bad_Name', 'skip.test', 'notes', 'ECHO', '--weird']) {
    const res = await call([name], { commandsDir });
    assert.equal(res.code, 1, name);
    assert.match(res.stderr, /Unknown command/, name);
  }
  assert.deepEqual(listCommandGroups(commandsDir), ['boom', 'broken', 'echo', 'norun']);
  assert.deepEqual(listCommandGroups(path.join(commandsDir, 'missing')), []);
});

test('help lists summaries and shows one command', async () => {
  const commandsDir = commandsFixture();
  const all = await call(['help'], { commandsDir });
  assert.equal(all.code, 0);
  assert.match(all.stdout, /\n {2}echo +Print what it was given\.\n/);
  assert.match(all.stdout, /\n {2}broken +\(could not load: /);

  const one = await call(['help', 'echo'], { commandsDir });
  assert.equal(one.stdout, 'toolkit echo: Print what it was given.\n\ntoolkit echo [words] [--stdin]\n');
  const flag = await call(['echo', '--help'], { commandsDir });
  assert.equal(flag.stdout, one.stdout);
  const builtin = await call(['help', 'version'], { commandsDir });
  assert.equal(builtin.stdout, 'toolkit version: Print the toolkit version.\n');
  const missing = await call(['help', 'nothing'], { commandsDir });
  assert.equal(missing.code, 1);

  const json = await call(['help', '--json'], { commandsDir });
  const names = JSON.parse(json.stdout).commands.map((c) => c.name);
  assert.deepEqual(names, ['boom', 'broken', 'echo', 'help', 'norun', 'version']);
});

test('detectHost reads the environment; --host wins', async () => {
  assert.equal(detectHost({}), null);
  assert.equal(detectHost({ CLAUDECODE: '1' }), 'claude');
  assert.equal(detectHost({ CLAUDE_PLUGIN_ROOT: '/x' }), 'claude');
  assert.equal(detectHost({ PLUGIN_ROOT: '/x', CLAUDE_PLUGIN_ROOT: '/x' }), 'codex');
  const commandsDir = commandsFixture();
  const res = await call(['echo', '--json', '--host', 'claude'], { commandsDir, env: { PLUGIN_ROOT: '/x' } });
  assert.equal(JSON.parse(res.stdout).host, 'claude');
  const fromEnv = await call(['echo', '--json'], { commandsDir, env: { PLUGIN_ROOT: '/x' } });
  assert.equal(JSON.parse(fromEnv.stdout).host, 'codex');
});

test('lib/cli.mjs also runs when started directly', () => {
  const res = spawnSync(process.execPath, [path.join(PLUGIN, 'lib', 'cli.mjs'), 'version'], { encoding: 'utf8' });
  assert.equal(res.status, 0);
  assert.equal(res.stdout, `${expectedVersion()}\n`);
});

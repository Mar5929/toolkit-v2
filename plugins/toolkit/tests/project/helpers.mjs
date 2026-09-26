// Shared helpers for the project and hook tests: temporary Git repositories, a
// temporary home folder (so the real ~/.claude, ~/.codex, and
// ~/.config/toolkit-v2 are never read or written), and ways to run `toolkit`
// in this process or as a real child process.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { main } from '../../lib/cli.mjs';

export const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const BIN = path.join(PLUGIN_ROOT, 'bin', 'toolkit');
export const TODAY = '2026-09-26';

const made = [];

export function tempDir(prefix = 'tk-proj-') {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), prefix)));
  made.push(dir);
  return dir;
}

export function cleanup() {
  while (made.length) {
    const d = made.pop();
    try {
      fs.rmSync(d, { recursive: true, force: true });
    } catch {
      // Leave it.
    }
  }
}

const GIT_ENV = {
  GIT_AUTHOR_NAME: 'Test',
  GIT_AUTHOR_EMAIL: 'test@example.invalid',
  GIT_COMMITTER_NAME: 'Test',
  GIT_COMMITTER_EMAIL: 'test@example.invalid',
  GIT_CONFIG_NOSYSTEM: '1',
};

export function git(cwd, args) {
  const res = spawnSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, ...GIT_ENV } });
  if (res.status !== 0) throw new Error(`git ${args.join(' ')} failed in ${cwd}: ${res.stderr}`);
  return res.stdout.trim();
}

/**
 * A home folder for one test: ~/.claude/settings.json with some claude-toolkit
 * plugins turned on, and ~/.codex/config.toml with others, like Mike's machine.
 */
export function makeHome({ claudeOld = ['second-brain', 'protocol-guard'], codexOld = ['work-tracker', 'extra-thing'], trust = [], hookTrust = [] } = {}) {
  const home = tempDir('tk-home-');
  fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
  const enabled = { 'superpowers@claude-plugins-official': true };
  for (const n of claudeOld) enabled[`${n}@claude-toolkit`] = true;
  fs.writeFileSync(path.join(home, '.claude', 'settings.json'), `${JSON.stringify({ enabledPlugins: enabled, outputStyle: 'Plain English' }, null, 2)}\n`);
  fs.mkdirSync(path.join(home, '.codex'), { recursive: true });
  const lines = ['model = "gpt-test"', ''];
  for (const p of trust) lines.push(`[projects."${p}"]`, 'trust_level = "trusted"', '');
  for (const n of codexOld) lines.push(`[plugins."${n}@claude-toolkit"]`, 'enabled = true', '');
  if (hookTrust.length) {
    lines.push('[hooks.state]', '');
    for (const k of hookTrust) lines.push(`[hooks.state."${k}"]`, 'trusted_hash = "sha256:0000"', '');
  }
  fs.writeFileSync(path.join(home, '.codex', 'config.toml'), `${lines.join('\n')}\n`);
  return home;
}

/** The environment for a test: temporary home, config folder, fixed date, and no plugin data folders. */
export function testEnv(home, extra = {}) {
  const env = {
    ...process.env,
    ...GIT_ENV,
    HOME: home,
    CODEX_HOME: path.join(home, '.codex'),
    CLAUDE_CONFIG_DIR: path.join(home, '.claude'),
    TOOLKIT_V2_CONFIG_DIR: path.join(home, '.config', 'toolkit-v2'),
    TOOLKIT_V2_BIN_DIR: path.join(home, '.local', 'bin'),
    TOOLKIT_TODAY: TODAY,
    ...extra,
  };
  for (const k of ['CLAUDE_PLUGIN_DATA', 'PLUGIN_DATA', 'CLAUDE_PLUGIN_ROOT', 'PLUGIN_ROOT', 'TOOLKIT_DEBUG', 'DISABLE_TELEMETRY', 'DISABLE_GROWTHBOOK', 'DO_NOT_TRACK', 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', 'CLAUDE_CODE_USE_BEDROCK', 'CLAUDE_CODE_USE_VERTEX']) {
    if (!(k in extra)) delete env[k];
  }
  return env;
}

/** A new empty Git repository. */
export function makeRepo(name = 'project') {
  const dir = path.join(tempDir(), name);
  fs.mkdirSync(dir);
  git(dir, ['init', '-q', '-b', 'main']);
  git(dir, ['config', 'commit.gpgsign', 'false']);
  git(dir, ['config', 'user.name', 'Mike']);
  return fs.realpathSync(dir);
}

function sink() {
  let text = '';
  return { write: (s) => { text += s; return true; }, get text() { return text; } };
}

/** Run toolkit in this process. Returns { code, stdout, stderr, json }. */
export async function tk(cwd, args, { env, stdin } = {}) {
  const stdout = sink();
  const stderr = sink();
  const code = await main(args, { cwd, env, stdout, stderr, stdin: stdin === undefined ? '' : stdin });
  let json = null;
  if (args.includes('--json') || (args[0] === 'hook' && stdout.text.trim())) {
    try {
      json = JSON.parse(stdout.text);
    } catch {
      json = null;
    }
  }
  return { code, stdout: stdout.text, stderr: stderr.text, json };
}

/** Run toolkit as a child process (the way the hosts run hooks). */
export function tkProcess(cwd, args, { env, input = '' } = {}) {
  const res = spawnSync(process.execPath, [BIN, ...args], { cwd, env, input, encoding: 'utf8', timeout: 60000 });
  return { code: res.status, stdout: res.stdout, stderr: res.stderr };
}

/** Run toolkit as a child process without waiting (for concurrency tests). */
export function tkSpawn(cwd, args, { env, input = '' } = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [BIN, ...args], { cwd, env });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
    child.stdin.end(input);
  });
}

export function read(p) {
  return fs.readFileSync(p, 'utf8');
}

export function sha(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/** Every file under a folder (relative paths, sorted), .git left out. */
export function listFiles(dir) {
  const out = [];
  const visit = (d, rel) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === '.git') continue;
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) visit(path.join(d, e.name), r);
      else out.push(r);
    }
  };
  visit(dir, '');
  return out.sort();
}

/** File contents and modes under a folder, for "nothing changed" checks. */
export function snapshot(dir) {
  const out = {};
  for (const f of listFiles(dir)) {
    const st = fs.statSync(path.join(dir, f));
    out[f] = `${sha(fs.readFileSync(path.join(dir, f)))} ${st.mode & 0o777}`;
  }
  return out;
}

/** Init a project with the CLI and return { root, env, home, res }. */
export async function initProject({ tracker = 'local', memory = 'builtin', salesforce = false, hosts, name = 'Acme CRM', key, home, extraArgs = [], env: extraEnv = {} } = {}) {
  const root = makeRepo();
  const h = home || makeHome();
  const env = testEnv(h, extraEnv);
  const args = ['init', '--name', name, '--tracker', tracker, '--memory', memory, '--owner', 'Mike', ...extraArgs];
  if (key) args.push('--key', key);
  if (salesforce) args.push('--salesforce');
  if (hosts) args.push('--hosts', hosts);
  const res = await tk(root, args, { env });
  return { root, env, home: h, res };
}

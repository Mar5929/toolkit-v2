// Shared test helpers for the memory tests: temporary Git projects with a
// .toolkit.json, linked worktrees, and a way to run `toolkit` in-process or as
// a real process.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { main } from '../../lib/cli.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const PLUGIN = path.resolve(HERE, '..', '..');
export const BIN = path.join(PLUGIN, 'bin', 'toolkit');

const made = [];

/** Remove every temporary folder made so far. Call from after(). */
export function cleanup() {
  while (made.length) fs.rmSync(made.pop(), { recursive: true, force: true });
}

export function tempDir(prefix = 'tk-mem-') {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), prefix)));
  made.push(dir);
  return dir;
}

function git(cwd, args) {
  const res = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Test',
      GIT_AUTHOR_EMAIL: 'test@example.invalid',
      GIT_COMMITTER_NAME: 'Test',
      GIT_COMMITTER_EMAIL: 'test@example.invalid',
      GIT_CONFIG_NOSYSTEM: '1',
    },
  });
  if (res.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${res.stderr}`);
  return res.stdout.trim();
}

/**
 * A temporary Git project with .toolkit.json, one commit, and .memory/ ignored.
 * Returns { root, config }.
 */
export function makeProject({ memory = { type: 'builtin' }, hindsight, key = 'test-project', extra = {} } = {}) {
  const root = path.join(tempDir(), 'project');
  fs.mkdirSync(root);
  git(root, ['init', '-q', '-b', 'main']);
  git(root, ['config', 'commit.gpgsign', 'false']);
  const config = {
    toolkit: 'toolkit-v2',
    schema: 1,
    project: { name: 'Test project', key, owner: 'Mike' },
    tracker: { type: 'local', idPrefix: 'WI' },
    memory,
    hindsight: hindsight || {},
    ...extra,
  };
  fs.writeFileSync(path.join(root, '.toolkit.json'), `${JSON.stringify(config, null, 2)}\n`);
  fs.writeFileSync(path.join(root, '.gitignore'), '.memory/\n.work-items/\n');
  git(root, ['add', '.toolkit.json', '.gitignore']);
  git(root, ['commit', '-q', '-m', 'init']);
  return { root, config };
}

/** Add a linked worktree next to the project. Returns its folder. */
export function addWorktree(root, name = 'feature') {
  const dir = path.join(path.dirname(root), `wt-${name}`);
  git(root, ['worktree', 'add', '-q', dir, '-b', name]);
  return fs.realpathSync(dir);
}

function sink() {
  const s = { text: '', write(chunk) { s.text += chunk; return true; } };
  return s;
}

/** Run toolkit in this process. Returns { code, stdout, stderr, json }. */
export async function runToolkit(args, { cwd, stdin = '', env } = {}) {
  const stdout = sink();
  const stderr = sink();
  const code = await main(args, { cwd, stdin, stdout, stderr, env: env || { ...process.env, TOOLKIT_DEBUG: '1' } });
  let json = null;
  if (args.includes('--json')) {
    try {
      json = JSON.parse(stdout.text);
    } catch {
      json = null;
    }
  }
  return { code, stdout: stdout.text, stderr: stderr.text, json };
}

/** Run bin/toolkit as its own process. Resolves { code, stdout, stderr }. */
export function spawnToolkit(args, { cwd, input = '' } = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [BIN, ...args], { cwd, env: { ...process.env } });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
    child.stdin.end(input);
  });
}

/** A valid record body for tests. */
export function body(point = 'Deploy only on Tuesday mornings.') {
  return `# Test record\n\n**Remember:** ${point}\n\n**Why:** It came up in a test.\n`;
}

// Shared helpers for the work-engine tests: temporary Git projects and a way
// to run `toolkit` in-process or as a separate process.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { main } from '../../lib/cli.mjs';

export const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const BIN = path.join(PLUGIN_ROOT, 'bin', 'toolkit');
export const TODAY = '2026-09-26';

const made = [];

export function git(dir, args) {
  const res = spawnSync('git', args, { cwd: dir, encoding: 'utf8' });
  if (res.status !== 0) throw new Error(`git ${args.join(' ')} failed in ${dir}: ${res.stderr}`);
  return res.stdout.trim();
}

/**
 * A fresh Git repository set up as a Toolkit V2 project.
 * @param {{ tracker?: string, prefix?: string, owner?: string, commit?: boolean }} [opts]
 */
export function makeProject({ tracker = 'local', prefix = 'WI', owner = 'Mike', commit = false } = {}) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tk-work-')));
  made.push(dir);
  git(dir, ['init', '-q', '-b', 'main']);
  fs.writeFileSync(path.join(dir, '.gitignore'), '/.work-items/\n/.memory/\n');
  const config = {
    toolkit: 'toolkit-v2',
    schema: 1,
    project: { name: 'Test project', key: 'test-project', owner },
    tracker: { type: tracker, idPrefix: prefix },
    memory: { type: 'builtin', approval: 'onboarding' },
    salesforce: { enabled: false },
    hosts: ['claude-code', 'codex'],
    notion: {},
    hindsight: {},
    installed: {},
  };
  fs.writeFileSync(path.join(dir, '.toolkit.json'), `${JSON.stringify(config, null, 2)}\n`);
  if (commit) {
    git(dir, ['add', '.gitignore', '.toolkit.json']);
    git(dir, ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-q', '-m', 'Set up the test project']);
  }
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

function sink() {
  let text = '';
  return { write: (s) => { text += s; return true; }, get text() { return text; } };
}

/** Run toolkit in this process. Returns { code, stdout, stderr, json }. */
export async function tk(cwd, args, { env = {}, stdin } = {}) {
  const stdout = sink();
  const stderr = sink();
  const code = await main(args, {
    cwd,
    env: { ...process.env, TOOLKIT_TODAY: TODAY, ...env },
    stdout,
    stderr,
    stdin: stdin === undefined ? '' : stdin,
  });
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

/** Run toolkit as a separate Node process (async). */
export function tkProcess(cwd, args, { env = {} } = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [BIN, ...args], { cwd, env: { ...process.env, TOOLKIT_TODAY: TODAY, ...env } });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

export function trackerDir(dir) {
  return path.join(dir, '.work-items');
}

export function readState(dir) {
  return JSON.parse(fs.readFileSync(path.join(trackerDir(dir), '.toolkit-state.json'), 'utf8'));
}

/** Absolute path of an item's record, from `toolkit work show <id> --path`. */
export async function recordPath(dir, id) {
  const r = await tk(dir, ['work', 'show', id, '--path']);
  if (r.code !== 0) throw new Error(`show --path ${id} failed: ${r.stderr}`);
  return r.stdout.trim();
}

export async function readRecord(dir, id) {
  return fs.readFileSync(await recordPath(dir, id), 'utf8');
}

/** Create an item and return its id. */
export async function newItem(dir, title, extra = []) {
  const r = await tk(dir, ['work', 'new', '--title', title, ...extra, '--json']);
  if (r.code !== 0) throw new Error(`work new failed: ${r.stdout} ${r.stderr}`);
  return r.json.id;
}

/** Replace text in a file (a hand edit). */
export function editFile(file, from, to) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(from)) throw new Error(`"${from}" not found in ${file}`);
  fs.writeFileSync(file, text.replace(from, to));
}

/**
 * Record the owner's requirements approval the way the skills do: the Agreed
 * goal is written first (toolkit work approve --requirements refuses while it
 * is still the template text), then the approval.
 */
export async function approveRequirements(dir, id, { by = 'Mike', goal = 'The owner agreed this goal.' } = {}) {
  const g = await tk(dir, ['work', 'edit', id, '--section', 'Agreed goal', '--text', goal]);
  if (g.code !== 0) throw new Error(`edit Agreed goal failed: ${g.stdout} ${g.stderr}`);
  return tk(dir, ['work', 'approve', id, '--requirements', '--by', by]);
}

/**
 * Write a chosen design into "## Selected design" of an item's DESIGN.md, the
 * way solution-design does before it asks for the approval: toolkit work
 * approve --design refuses a design whose Selected design is still the
 * template prompt (sample run confirm-a).
 */
export async function fillSelectedDesign(dir, id, text = 'Option A: one small command, as the owner chose.') {
  const d = await tk(dir, ['work', 'design', id, '--json']);
  const file = d.json && d.json.path;
  if (!file) throw new Error(`no design file for ${id}`);
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(/^<Before an option is chosen[^\n]*>$/m, text);
  fs.writeFileSync(file, after);
  return file;
}

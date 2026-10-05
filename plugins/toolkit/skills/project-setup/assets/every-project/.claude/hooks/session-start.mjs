#!/usr/bin/env node
// SessionStart hook for Claude Code and Codex: prints Current State; with local memory it also
// prints the pointer table, memory/MEMORY.md. It writes no file. Any error prints one line. It
// always exits 0.
// Usage: node session-start.mjs --memory local|notion|hindsight [--page <Current state page id>]
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const COMPACTED = 'Context was just compacted. Before you answer the next message, re-read the'
  + ' active work item with using-work-tracker, then PROJECT.md, SOUL.md if the project'
  + ' has one, and .claude/rules/owner-preferences.md. In Codex, also re-read every file in'
  + ' .claude/rules/ that has no paths line at its top.';
const arg = (name, i = process.argv.indexOf(`--${name}`)) => i > 1 && process.argv[i + 1];
const memory = arg('memory') || 'local';
const attempt = (read) => { try { return read() || ''; } catch { return ''; } };
const input = attempt(() => JSON.parse(readFileSync(0, 'utf8')));
const opts = { cwd: input.cwd || process.cwd(), encoding: 'utf8', stdio: 'pipe', timeout: 15000 };
const out = input.source === 'compact' ? [COMPACTED] : [];
const where = memory === 'notion' ? 'the Current state page, with using-memory-store'
  : 'memory/CURRENT_STATE.md in the main checkout';
try {
  // Current State. memory/ is kept out of Git, so it is only in the main checkout.
  const git = execFileSync('git', ['rev-parse', '--git-common-dir'], opts).trim();
  const dir = join(dirname(resolve(opts.cwd, git)), 'memory');
  const read = (file) => attempt(() => readFileSync(join(dir, file), 'utf8'));
  const page = () => execFileSync('ntn', ['api', `v1/pages/${arg('page')}/markdown`], opts);
  const state = String(memory === 'notion' ? attempt(() => JSON.parse(page()).markdown)
    : read('CURRENT_STATE.md')).trim();
  if (state) out.push('Current State:', state);
  else if (memory === 'notion') out.push('The Notion Current state page could not be read here.'
    + ' Read it with the using-memory-store skill.');
  else out.push(`memory/CURRENT_STATE.md is missing or empty in ${dirname(dir)}.`);
  // A prune request when Current State is 40 lines or more (the limit is under 40), or 7 days old.
  const lines = state.split('\n').length;
  const updated = state.match(/Last updated:\W*(\d{4}-\d{2}-\d{2})/i)?.[1];
  const days = Math.floor((Date.now() - Date.parse(updated)) / 864e5) || 0;
  const prune = memory === 'hindsight' ? 'a direct edit, as .claude/rules/hindsight-memory.md says'
    : 'the curating-project-memory skill';
  const size = lines >= 40 ? `${lines} lines (limit: under 40)` : `${days} days old`;
  if (lines >= 40 || days > 7) out.push(`Current State is ${size}. Prune it with ${prune}.`);
  // Local memory: the pointer table, printed as it is. Only using-memory-store writes it.
  const pointers = memory === 'local' && read('MEMORY.md').trim();
  if (pointers) out.push('', 'Memory pointers (memory/MEMORY.md):', pointers);
} catch (error) {
  const why = String(error.message).split('\n')[0];
  out.push(`The session-start hook stopped early (${why}). Read Current State yourself: ${where}.`);
}
// Hosts cut hook output at 10,000 characters, so a long table is cut here, between two lines.
const text = out.join('\n');
const rest = memory === 'notion' ? where : 'the files in memory/ in the main checkout';
const cut = text.length > 9500 && `${text.slice(0, text.lastIndexOf('\n', 9400))}\n[Cut short to`
  + ` fit the hook limit. Read the rest yourself: ${rest}.]`;
process.stdout.write(`${cut || text}\n`);

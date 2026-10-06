#!/usr/bin/env node
// SessionStart hook for Claude Code and Codex: prints Current State; with local memory it also
// rebuilds memory/MEMORY.md and prints one line per memory file. An error prints one line; exit 0.
// Usage: node session-start.mjs --memory local|notion|hindsight [--page <Current state page id>]
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const COMPACTED = 'Context was just compacted. Before you answer the next message, re-read the'
  + ' active work item with using-work-tracker, then do "Every session" in the root AGENTS.md'
  + ' again.';
const NEW_INDEX = '<!-- Generated file: the session-start hook rebuilds this index from each'
  + " memory file's name and description, grouped by prefix. Do not edit it by hand. -->\n\n"
  + '# Memory index\n\n## User\n\n## Other memory views\n\n- [Current state](CURRENT_STATE.md)\n';
process.stdout.on('error', () => {}); // A reader that closed the output is no error.
const arg = (name, i = process.argv.indexOf(`--${name}`)) => i > 1 && process.argv[i + 1];
const memory = arg('memory') || 'local';
const attempt = (read) => { try { return read() || ''; } catch { return ''; } };
const input = attempt(() => JSON.parse(readFileSync(0, 'utf8')));
const opts = { cwd: input.cwd || process.cwd(), encoding: 'utf8', stdio: 'pipe', timeout: 15000 };
const out = input.source === 'compact' ? [COMPACTED] : [];
const where = memory === 'notion' ? 'the Current state page, with using-memory-store'
  : 'memory/CURRENT_STATE.md in the main checkout';
try {
  // memory/ is kept out of Git, so it is only in the main checkout. No Git: the session's folder.
  const git = attempt(() => execFileSync('git', ['rev-parse', '--git-common-dir'], opts).trim());
  const dir = join(git ? dirname(resolve(opts.cwd, git)) : opts.cwd, 'memory');
  const read = (file) => attempt(() => readFileSync(join(dir, file), 'utf8'));
  const page = () => execFileSync('ntn', ['api', `v1/pages/${arg('page')}/markdown`], opts);
  const state = String(memory === 'notion' ? attempt(() => JSON.parse(page()).markdown)
    : read('CURRENT_STATE.md')).trim();
  if (state) out.push('Current State:', state);
  else if (memory === 'notion') out.push('The Notion Current state page could not be read here.'
    + ' Read it with the using-memory-store skill.');
  else out.push(`memory/CURRENT_STATE.md is missing or empty in ${dirname(dir)}.`);
  // A prune request when Current State is 40 lines or more, over 1,600 characters (only a page
  // with a date is measured: a new one holds prompts), or last updated over 7 days ago.
  const lines = state.split('\n').length;
  const updated = state.match(/Last updated:\W*(\d{4}-\d{2}-\d{2})/i)?.[1];
  const days = Math.floor((Date.now() - Date.parse(updated)) / 864e5) || 0;
  const prune = memory === 'hindsight' ? 'a direct edit, as .claude/rules/hindsight-memory.md says'
    : 'the curating-project-memory skill';
  const size = lines >= 40 ? `${lines} lines (limit: under 40)` : updated && state.length > 1600
    ? `${state.length} characters (limit: 1,600)` : days > 7 && `${days} days old`;
  if (size) out.push(`Current State is ${size}. Prune it with ${prune}.`);
  // Local memory: rebuild the index, one line per current memory file.
  if (memory === 'local' && attempt(() => readdirSync(dir).length)) {
    const lists = { user: '', project: '', reference: '', event: '' };
    for (const file of readdirSync(dir).sort()) {
      const type = file.match(/^(user|project|reference|event)_.+\.md$/)?.[1];
      const front = type && read(file).match(/^---\r?\n(.*?)\r?\n---/s)?.[1];
      const field = (key) => (front.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'))?.[1] ?? '')
        .trim().replace(/^(["'])(.*)\1$/, '$2');
      if (!front || /^(template|retired|superseded|withdrawn)$/i.test(field('status'))) continue;
      lists[type] += `- [[${file.slice(0, -3)}]]: ${field('description')}\n`;
    }
    const sections = Object.entries(lists).map(([type, text]) => (
      `## ${type[0].toUpperCase()}${type.slice(1)}\n\n${text}`)).join('\n');
    const old = read('MEMORY.md');
    const base = /\n## User\n[\s\S]*\n## Other memory views/.test(old) ? old : NEW_INDEX;
    const index = base.replace(/## User\n[\s\S]*?(?=## Other memory views)/, () => `${sections}\n`);
    // Write only a changed index. A sandbox may block the write. Print it without link marks.
    attempt(() => index !== old && writeFileSync(join(dir, 'MEMORY.md'), index));
    const shown = Object.values(lists).join('').replace(/\[\[(.+?)\]\]/g, '$1').trim()
      .replace(/^(.{74}).+$/gm, '$1') || 'No memory files yet.';
    out.push('', 'Memory index (files in memory/; open one before you rely on it):', shown);
  }
} catch (error) {
  const why = String(error.message).split('\n')[0];
  out.push(`The session-start hook stopped early (${why}). Read Current State yourself: ${where}.`);
}
// Codex shows about 4,000 characters of hook output, so a long index is cut here, between lines.
const [text, rest] = [out.join('\n'), memory === 'local' ? 'memory/MEMORY.md' : where];
const cut = text.length > 3990 && `${text.slice(0, text.lastIndexOf('\n', 3900))}\n[Cut short to`
  + ` fit the hook limit. Read the rest yourself: ${rest}.]`;
process.stdout.write(`${cut || text}\n`);

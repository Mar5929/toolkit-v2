#!/usr/bin/env node
// SessionStart hook for Claude Code and Codex: prints Current State; with local memory it also
// rebuilds and prints memory/MEMORY.md. Any error prints one line. It always exits 0.
// Usage: node session-start.mjs --memory local|notion|hindsight [--page <Current state page id>]
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const COMPACTED = 'Context was just compacted. Before you answer the next message, re-read the'
  + ' active work item with tracking-work-items, then PROJECT.md, SOUL.md if the project'
  + ' has one, and .claude/rules/owner-preferences.md. In Codex, also re-read each always-on rule'
  + ' listed under Rules in AGENTS.md.';
const NEW_INDEX = '<!-- Generated file: the session-start hook rebuilds this index from each'
  + " memory file's title, description, and updated date, grouped by prefix. Do not edit it by"
  + ' hand. -->\n\n# Memory index\n\n## User\n\n## Other memory views\n\n'
  + '- [Current state](CURRENT_STATE.md)\n- [Memory criteria](memory-criteria.md)\n'
  + '- [Terminology glossary](terminology-glossary.md)\n';
const arg = (name, i = process.argv.indexOf(`--${name}`)) => i > 1 && process.argv[i + 1];
const memory = arg('memory') || 'local';
const attempt = (read) => { try { return read() || ''; } catch { return ''; } };
const input = attempt(() => JSON.parse(readFileSync(0, 'utf8')));
const opts = { cwd: input.cwd || process.cwd(), encoding: 'utf8', stdio: 'pipe', timeout: 15000 };
const out = input.source === 'compact' ? [COMPACTED] : [];
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
    + ' Read it with the notion-memory-find skill.');
  else out.push(`memory/CURRENT_STATE.md is missing or empty in ${dirname(dir)}.`);
  // A prune request when Current State is 40 lines or more (the limit is under 40), or 7 days old.
  const lines = state.split('\n').length;
  const updated = state.match(/Last updated:\W*(\d{4}-\d{2}-\d{2})/i)?.[1];
  const days = Math.floor((Date.now() - Date.parse(updated)) / 864e5) || 0;
  const refine = ['local', 'notion'].includes(memory) ? `the ${memory}-memory-refine skill`
    : 'a direct edit, as the memory rule says';
  const size = lines >= 40 ? `${lines} lines (limit: under 40)` : `${days} days old`;
  if (lines >= 40 || days > 7) out.push(`Current State is ${size}. Prune it with ${refine}.`);
  // Local memory: rebuild the index, one line per active memory file, keeping the model's text.
  if (memory === 'local') {
    const lists = { user: '', project: '', reference: '', event: '', decision: '' };
    for (const file of readdirSync(dir).sort()) {
      const type = file.match(/^(user|project|reference|event|decision)_.+\.md$/)?.[1];
      const [, front, body] = (type && read(file).match(/^---\r?\n(.*?)\r?\n---(.*)/s)) || [];
      const field = (key) => (front.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'))?.[1] ?? '')
        .trim().replace(/^(["'])(.*)\1$/, '$2');
      if (!front || /^(template|retired|superseded|withdrawn)$/i.test(field('status'))) continue;
      const title = body.match(/^# (.+)$/m)?.[1].trim() || field('name') || file.slice(0, -3);
      const date = field('updated') && ` (updated ${field('updated')})`;
      lists[type] += `- [${title}](${file}): ${field('description')}${date}\n`;
    }
    const heading = (type) => `## ${type[0].toUpperCase()}${type.slice(1)}\n\n`;
    const sections = Object.entries(lists).map(([type, text]) => heading(type) + text).join('\n');
    const old = read('MEMORY.md');
    const base = /\n## User\n[\s\S]*\n## Other memory views/.test(old) ? old : NEW_INDEX;
    const index = base.replace(/## User\n[\s\S]*?(?=## Other memory views)/, () => `${sections}\n`);
    // Write only a changed index. A sandbox may block the write; the index is still printed.
    attempt(() => index !== old && writeFileSync(join(dir, 'MEMORY.md'), index));
    out.push('', 'Memory index (memory/MEMORY.md):', index.trim());
  }
} catch (error) {
  const where = memory === 'notion' ? 'the Current state page, with the notion-memory-find skill'
    : 'memory/CURRENT_STATE.md in the main checkout';
  const why = String(error.message).split('\n')[0];
  out.push(`The session-start hook stopped early (${why}). Read Current State yourself: ${where}.`);
}
// Hosts cut hook output at 10,000 characters, so a long index is cut here, between two lines.
const text = out.join('\n');
const cut = text.length > 9500 && `${text.slice(0, text.lastIndexOf('\n', 9400))}\n[Cut short to`
  + ' fit the hook limit. Read memory/MEMORY.md for the rest.]';
process.stdout.write(`${cut || text}\n`);

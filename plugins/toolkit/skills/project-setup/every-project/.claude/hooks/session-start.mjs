#!/usr/bin/env node
// SessionStart hook for Claude Code and Codex: prints Current State; with local memory it also
// rebuilds memory/MEMORY.md and prints one line per memory file. With Hindsight memory the project
// has no Current State, so only the line after a compaction is printed. An error prints one line;
// exit 0.
// Usage: node session-start.mjs --memory local|notion|hindsight [--page <Current state page id>]
import { execFileSync, execSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const COMPACTED = 'Context was just compacted. Before you answer the next message, re-read the'
  + ' active work item with managing-work-items, then do "Every session" in the root AGENTS.md'
  + ' again.';
const NEW_INDEX = '<!-- Generated file: the session-start hook rebuilds this index from each'
  + " memory file's title, description, and updated date. Do not edit it by hand. -->\n\n"
  + '# Memory index\n\n## User\n\n## Other memory views\n\n- [Current state](CURRENT_STATE.md)\n';
process.stdout.on('error', () => {}); // A reader that closed the output is no error.
const arg = (name, i = process.argv.indexOf(`--${name}`)) => i > 1 && process.argv[i + 1];
const memory = arg('memory') || 'local';
const attempt = (read) => { try { return read() || ''; } catch { return ''; } };
const input = attempt(() => JSON.parse(readFileSync(0, 'utf8')));
const opts = { cwd: input.cwd || process.cwd(), encoding: 'utf8', stdio: 'pipe', timeout: 15000 };
const out = input.source === 'compact' ? [COMPACTED] : [];
const where = memory === 'notion' ? 'the Current state page, with managing-project-memory'
  : 'memory/CURRENT_STATE.md in the main checkout';
if (memory !== 'hindsight') try {
  // memory/ is kept out of Git, so it is only in the main checkout. No Git: the session's folder.
  const git = attempt(() => execFileSync('git', ['rev-parse', '--git-common-dir'], opts).trim());
  const dir = join(git ? dirname(resolve(opts.cwd, git)) : opts.cwd, 'memory');
  const read = (file) => attempt(() => readFileSync(join(dir, file), 'utf8'));
  const page = () => execSync(`ntn api v1/pages/${arg('page')}/markdown`, opts);
  const state = String(memory === 'notion' ? attempt(() => JSON.parse(page()).markdown)
    : read('CURRENT_STATE.md')).trim();
  // Keep relevance review with the agent; length and age alone do not prove staleness.
  if (state) out.push('Review Current State with managing-project-memory; retain what the'
    + ' next session needs and remove lines that are no longer true.');
  if (state) out.push("The project's Current State:", state);
  else if (memory === 'notion') out.push('The Notion Current state page could not be read here.'
    + ' Read it with the managing-project-memory skill.');
  else out.push(`memory/CURRENT_STATE.md is missing or empty in ${dirname(dir)}.`);
  // Local memory: rebuild the index, one line per current memory file.
  if (memory === 'local' && attempt(() => readdirSync(dir).length)) {
    const lists = { user: '', project: '', reference: '', event: '' };
    for (const file of readdirSync(dir).sort()) {
      const type = file.match(/^(user|project|reference|event)_.+\.md$/)?.[1];
      const [, front, body] = (type && read(file).match(/^---\r?\n(.*?)\r?\n---(.*)/s)) || [];
      const field = (key) => (front.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'))?.[1] ?? '')
        .trim().replace(/^(["'])(.*)\1$/, '$2');
      if (!front || /^(template|retired|superseded|withdrawn)$/i.test(field('status'))) continue;
      const title = body.match(/^# (.+)$/m)?.[1].trim() || field('name') || file.slice(0, -3);
      const date = field('updated') && ` (updated ${field('updated')})`;
      lists[type] += `- [${title}](${file}): ${field('description')}${date}\n`;
    }
    const sections = Object.entries(lists).map(([type, text]) => (
      `## ${type[0].toUpperCase()}${type.slice(1)}\n\n${text}`)).join('\n');
    const old = read('MEMORY.md');
    const base = /\n## User\n[\s\S]*\n## Other memory views/.test(old) ? old : NEW_INDEX;
    const index = base.replace(/## User\n[\s\S]*?(?=## Other memory views)/, () => `${sections}\n`);
    // Write only a changed index. A sandbox may block the write; the lines are still printed.
    attempt(() => index !== old && writeFileSync(join(dir, 'MEMORY.md'), index));
    out.push('', 'Memory index (files in memory/; open one before you rely on it):',
      Object.values(lists).join('').trim() || 'No memory files yet.');
  }
} catch (error) {
  out.push(`The session-start hook stopped early (${String(error.message).split('\n')[0]}). Read`
    + ` the project's Current State yourself: ${where}.`);
}
// Claude Code caps hook output at 10,000 characters. Codex limits it by tokens (about 2,500, or
// the entry's additionalContextLimit). So longer output is cut here, between two lines.
const [text, rest] = [out.join('\n'), memory === 'local' ? `memory/MEMORY.md and ${where}` : where];
const cut = text.length > 9500 && `${text.slice(0, text.lastIndexOf('\n', 9400))}\n[Cut short to`
  + ` fit the hook limit. Read the rest yourself: ${rest}.]`;
if (text) process.stdout.write(`${cut || text}\n`);

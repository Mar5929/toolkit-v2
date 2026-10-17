#!/usr/bin/env node
// SessionStart hook for both hosts. The installed choice supplies startup context.
import { readFileSync } from 'node:fs';

process.stdout.on('error', () => {});
const out = [];
let readMore = 'the startup records named in the root AGENTS.md';
try {
  let input = {};
  try { input = JSON.parse(readFileSync(0, 'utf8')); } catch { /* Manual invocation has no input. */ }
  if (input.source === 'compact') out.push('Context was just compacted. Before you answer the next message,'
    + ' re-read the active work item with managing-work-items, then do "At session start" in the root AGENTS.md again.');
  const { default: startup } = await import('./session-start-choice.mjs');
  const context = await startup({ ...input, cwd: input.cwd || process.cwd() });
  if (context.text) out.push(context.text);
  if (context.readMore) readMore = context.readMore;
} catch (error) {
  out.push(`The session-start hook stopped early (${String(error.message).split('\n')[0]}).`
    + ' Follow the startup procedure in the root AGENTS.md to read the project records.');
}
// Stay inside Claude Code's output allowance; the choice names where the complete records live.
const text = out.join('\n');
const cut = text.length > 9500 && `${text.slice(0, text.lastIndexOf('\n', 9400))}\n`
  + `[Cut short to fit the hook limit. Read the rest yourself: ${readMore}.]`;
if (text) process.stdout.write(`${cut || text}\n`);

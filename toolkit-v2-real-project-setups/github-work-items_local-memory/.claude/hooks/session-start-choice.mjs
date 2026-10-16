import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const NEW_INDEX = '<!-- Generated file: the session-start hook rebuilds this index from each'
  + " memory file's title, description, and updated date. Do not edit it by hand. -->\n\n"
  + '# Memory index\n\n## User\n\n## Other memory views\n\n- [Current state](CURRENT_STATE.md)\n';
const attempt = (read) => { try { return read() || ''; } catch { return ''; } };

export default function ({ cwd }) {
  const opts = { cwd, encoding: 'utf8', stdio: 'pipe', timeout: 15000 };
  const out = [];
  // memory/ is kept out of Git, so it is only in the main checkout. No Git: the session's folder.
  const git = attempt(() => execFileSync('git', ['rev-parse', '--git-common-dir'], opts).trim());
  const dir = join(git ? dirname(resolve(opts.cwd, git)) : opts.cwd, 'memory');
  const read = (file) => attempt(() => readFileSync(join(dir, file), 'utf8'));
  const state = read('CURRENT_STATE.md').trim();
  if (state) out.push('Review Current State with managing-project-memory; retain what the'
    + ' next session needs and remove lines that are no longer true.',
    "The project's Current State:", state);
  else out.push(`memory/CURRENT_STATE.md is missing or empty in ${dirname(dir)}.`);
  // Local memory: rebuild the index, one line per current memory file.
  if (attempt(() => readdirSync(dir).length)) {
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
  return { text: out.join('\n'), readMore: 'memory/MEMORY.md and memory/CURRENT_STATE.md in the main checkout' };
}

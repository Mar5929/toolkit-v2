// Hook fixes from the round 2 sample runs: a Codex note when a toolkit command
// is joined to other commands or run from a script (runs a to d), and the
// plural form of the PostToolUse line for two directly edited records (run b).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, read, tk } from '../project/helpers.mjs';
import { fixture } from './fixtures.mjs';
import { chainedToolkitNote } from '../../lib/hooks/pre-tool.mjs';

after(cleanup);

let seq = 0;
function vars(root, extra = {}) {
  seq += 1;
  return { CWD: root, SESSION: `r2-sess-${seq}`, TURN: `r2-turn-${seq}`, ...extra };
}

async function hook(root, env, host, event, input) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(input) });
  return { code: res.code, raw: res.stdout, out: res.stdout.trim() ? JSON.parse(res.stdout) : null };
}

test('chainedToolkitNote finds a toolkit command joined to others, in a heredoc, or in a script', () => {
  const chained = [
    'toolkit work lifecycle && toolkit work list',
    'cd /tmp/p && toolkit work list',
    'git status --short && toolkit work validate TSRC-001',
    "cat ...conventions.md; toolkit work decisions; toolkit work show TSRC-002",
    "cat > /tmp/wi001-starting-request.txt <<'EOF'\nhello\nEOF\ntoolkit work edit WI-001 --section \"Starting request\" --set-file /tmp/wi001-starting-request.txt",
    'toolkit work show WI-001 --json | jq .item',
    "toolkit work edit WI-001 --section Notes --set-file - <<'EOF'\ntext\nEOF",
    "python3 -c \"import subprocess; subprocess.run(['toolkit', 'work', 'edit', 'WI-001'])\"",
    'for s in A B; do toolkit work edit WI-001 --section "$s" --set-file x; done',
  ];
  for (const cmd of chained) assert.ok(chainedToolkitNote(cmd), cmd);
  for (const cmd of ['toolkit work list', 'toolkit work edit WI-001 --section "Agreed goal" --text "Greets people; by name."', 'git status && git log -1', 'ls -la', 'grep -n "toolkit work" AGENTS.md', 'cat ~/.codex/plugins/cache/toolkit-v2/work/0.2.2/references/conventions.md']) {
    assert.equal(chainedToolkitNote(cmd), null, cmd);
  }
});

test('in Codex, PreToolUse adds a note (never a refusal) for a chained toolkit command; a refusal still wins; Claude Code gets nothing', async () => {
  const { root, env } = await initProject();
  const chained = await hook(root, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.bash', vars(root, { COMMAND: 'toolkit work decisions && toolkit work show WI-001' })));
  assert.equal(chained.code, 0);
  assert.equal(chained.out.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.equal(chained.out.hookSpecificOutput.permissionDecision, undefined, 'a note, not a decision');
  assert.match(chained.out.hookSpecificOutput.additionalContext, /Run each toolkit command alone, as its own command/);
  const alone = await hook(root, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.bash', vars(root, { COMMAND: 'toolkit work list' })));
  assert.equal(alone.raw, '');
  const claude = await hook(root, env, 'claude', 'pre-tool', fixture('claude', 'pre-tool.bash', vars(root, { COMMAND: 'toolkit work decisions && toolkit work show WI-001' })));
  assert.equal(claude.raw, '', 'Claude Code runs the toolkit the same way in a chain');
  const denied = await hook(root, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.bash', vars(root, { COMMAND: 'git add -A && toolkit work list' })));
  assert.equal(denied.out.hookSpecificOutput.permissionDecision, 'deny');
});

test('the PostToolUse line for two records edited directly in one patch uses the plural', async () => {
  const { root, env } = await initProject();
  const files = [];
  for (const title of ['Login page', 'Logout page']) {
    const r = await tk(root, ['work', 'new', '--title', title, '--json'], { env });
    const id = JSON.parse(r.stdout).id;
    const file = (await tk(root, ['work', 'show', id, '--path'], { env })).stdout.trim();
    fs.writeFileSync(file, read(file).replace('**Blockers:** <Blocking decision or dependency, or “None.”>', '**Blockers:** None.'));
    files.push(path.relative(root, file));
  }
  const patch = `*** Begin Patch\n${files.map((rel) => `*** Update File: ${rel}\n@@\n-**Blockers:** <Blocking decision or dependency, or “None.”>\n+**Blockers:** None.\n`).join('')}*** End Patch`;
  const r = await hook(root, env, 'codex', 'post-tool', fixture('codex', 'post-tool.apply-patch', vars(root, { PATCH: patch, REL: files[0] })));
  assert.match(r.out.hookSpecificOutput.additionalContext, /^WI-001 and WI-002 were edited directly and pass validation\./);
});

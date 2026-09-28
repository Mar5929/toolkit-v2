// Hook fixes from the follow-up pass of 2026-09-28:
// - sample run confirm-a 5: the PostToolUse reminder that toolkit work edit is
//   the way to change a record's text comes once per record file in a
//   session, not once per session.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, read, tk } from '../project/helpers.mjs';
import { fixture } from './fixtures.mjs';

after(cleanup);

async function hook(root, env, host, event, input) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(input) });
  return { code: res.code, out: res.stdout.trim() ? JSON.parse(res.stdout) : null, raw: res.stdout };
}

const GUIDE = '**Blockers:** <Blocking decision or dependency, or “None.”>';

for (const host of ['claude', 'codex']) {
  test(`${host}: the direct-edit reminder comes once for each record file in a session`, async () => {
    const { root, env } = await initProject();
    const files = [];
    for (const title of ['Login page', 'Logout page']) {
      const r = await tk(root, ['work', 'new', '--title', title, '--json'], { env });
      const id = JSON.parse(r.stdout).id;
      files.push({ id, file: (await tk(root, ['work', 'show', id, '--path'], { env })).stdout.trim() });
    }
    const edit = async ({ file }, n) => {
      const before = read(file);
      const after = before.includes(GUIDE) ? before.replace(GUIDE, '**Blockers:** None.') : before.replace(/\*\*Blockers:\*\* None\.( \(\d+\))?/, `**Blockers:** None. (${n})`);
      fs.writeFileSync(file, after);
      const rel = path.relative(root, file);
      const input = host === 'claude'
        ? fixture('claude', 'post-tool.edit', { CWD: root, SESSION: `once-${host}`, FILE: file, OLD: 'a', NEW: 'b' })
        : fixture('codex', 'post-tool.apply-patch', { CWD: root, SESSION: `once-${host}`, REL: rel, PATCH: `*** Begin Patch\n*** Update File: ${rel}\n@@\n-a\n+b\n*** End Patch` });
      return hook(root, env, host, 'post-tool', input);
    };
    const first = await edit(files[0], 1);
    assert.match(first.out.hookSpecificOutput.additionalContext, new RegExp(`^${files[0].id} was edited directly and passes validation\\.`));
    const again = await edit(files[0], 2);
    assert.ok(!again.out || !/edited directly/.test(again.out.hookSpecificOutput.additionalContext || ''), 'the same file is not reminded twice');
    const other = await edit(files[1], 3);
    assert.match(other.out.hookSpecificOutput.additionalContext, new RegExp(`^${files[1].id} was edited directly and passes validation\\.`), 'another file gets its own reminder');
  });
}

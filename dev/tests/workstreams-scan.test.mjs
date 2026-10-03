// Runs the workstreams plugin's scan script on made-up chat files in a scratch
// folder, with the real /bin/sh, find, grep, and awk.

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import { SCAN, WRITES } from '../../plugins/workstreams/hooks/scan.mjs'

const KEY = '-Users-me-my-project'
const PAGE_A = '11111111-2222-3333-4444-555555555555'
const PAGE_B = '99999999-2222-3333-4444-555555555555'
const IDS = [PAGE_A, PAGE_A.replaceAll('-', ''), PAGE_B, PAGE_B.replaceAll('-', '')].join('|')

const title = name => JSON.stringify({ type: 'custom-title', customTitle: name })
const line = (type, at, command) =>
  JSON.stringify({
    type,
    timestamp: at,
    message: { content: [{ type: 'tool_use', name: 'Bash', input: { command } }] },
  })

const scan = (home, key = KEY) => {
  const out = execFileSync('/bin/sh', ['-c', SCAN, 'sh', key, IDS], {
    env: { PATH: '/usr/bin:/bin', HOME: '/nowhere', CLAUDE_CONFIG_DIR: home },
    encoding: 'utf8',
  })
  const [titles, writes] = out.split(`${WRITES}\n`)

  return { titles: titles.trim().split('\n'), writes: writes.trim().split('\n').filter(Boolean) }
}

const project = files => {
  const home = mkdtempSync(join(tmpdir(), 'workstreams-scan-'))

  for (const [path, lines] of Object.entries(files)) {
    const file = join(home, 'projects', path)
    mkdirSync(join(file, '..'), { recursive: true })
    writeFileSync(file, `${lines.join('\n')}\n`)
  }

  return home
}

test('workstreams scan: lists chat names and the changes to each item page', () => {
  const home = project({
    [`${KEY}/aaa.jsonl`]: [
      title('Old name'),
      title('Main Orchestrator'),
      // A change to page A that only names page B, as a link.
      line(
        'assistant',
        '2026-10-02T10:00:00Z',
        `ntn api v1/pages/${PAGE_A} -X PATCH -d '{"relation":[{"id":"${PAGE_B}"}]}'`,
      ),
      // A read of page B: not a change.
      line('assistant', '2026-10-02T11:00:00Z', `ntn api v1/pages/${PAGE_B}`),
      // The result of a command, not the agent's own line.
      line('user', '2026-10-02T12:00:00Z', `v1/pages/${PAGE_B} -X PATCH`),
    ],
    // A helper agent of chat aaa, with the page id written without dashes.
    [`${KEY}/aaa/subagents/agent-1.jsonl`]: [
      line(
        'assistant',
        '2026-10-03T09:00:00Z',
        `ntn api v1/blocks/${PAGE_A.replaceAll('-', '')}/children -X PATCH -d @body.json`,
      ),
    ],
    // A chat that ran in a worktree of the same project.
    [`${KEY}--claude-worktrees-fix/bbb.jsonl`]: [
      title('TKV-3 move-over'),
      line('assistant', '2026-10-03T12:00:00Z', `ntn api v1/pages/${PAGE_B}/markdown -X PATCH -d @e.json`),
    ],
    // Another project whose name starts the same way.
    [`${KEY}-review/ccc.jsonl`]: [
      title('Other project'),
      line('assistant', '2026-10-03T13:00:00Z', `ntn api v1/pages/${PAGE_A} -X PATCH`),
    ],
  })

  try {
    const { titles, writes } = scan(home)

    assert.equal(titles.length, 3)
    assert.ok(titles.some(row => row.startsWith(`./${KEY}/aaa.jsonl:`) && row.includes('Main Orchestrator')))
    assert.ok(titles.some(row => row.includes('TKV-3 move-over')))
    assert.ok(!titles.some(row => row.includes('Other project')))
    assert.deepEqual(writes.sort(), [
      `./${KEY}--claude-worktrees-fix/bbb.jsonl\t2026-10-03T12:00:00Z\t${PAGE_B}`,
      `./${KEY}/aaa.jsonl\t2026-10-02T10:00:00Z\t${PAGE_A}`,
      `./${KEY}/aaa/subagents/agent-1.jsonl\t2026-10-03T09:00:00Z\t${PAGE_A.replaceAll('-', '')}`,
    ])
  } finally {
    rmSync(home, { recursive: true, force: true })
  }
})

test('workstreams scan: prints only the separator when no chat is saved', () => {
  const home = project({})

  try {
    assert.deepEqual(scan(home), { titles: [''], writes: [] })
    assert.deepEqual(scan(join(home, 'missing')), { titles: [''], writes: [] })
  } finally {
    rmSync(home, { recursive: true, force: true })
  }
})

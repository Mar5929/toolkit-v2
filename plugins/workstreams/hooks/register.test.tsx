import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

import type { Chat, Stream } from '../types'

const NOW = 1_800_000_000_000
const MINUTE = 60 * 1000
const SHARED = '/Users/me/.claude/workstreams/-Users-me-my-project'
const PANE = {
  plugin: 'workstreams',
  component: 'Pane',
  requestId: 'workstreams',
  props: {
    title: 'Workstreams',
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
  },
} as const

const stream = (name: string, status: Stream['status'], next: string, at = NOW): Stream => ({
  name,
  status,
  next,
  at,
})

// Another chat's saved record, and the name Claude Code holds for that chat.
const chatFiles = (id: string, title: string, chat: Partial<Chat>) => ({
  [`${SHARED}/${id}.json`]: JSON.stringify({
    id,
    dir: '-Users-me-my-project',
    name: '',
    state: 'stopped',
    asked: '',
    at: NOW,
    helpers: [],
    streams: [],
    ...chat,
  }),
  [`/Users/me/.claude/projects/-Users-me-my-project/${id}/custom-title.json`]:
    JSON.stringify({ customTitle: title }),
})

// A chat with id "here", and a disk held in memory.
const world = (
  on: On,
  files: Record<string, string> = {},
  { root = '/Users/me/my.project', env = { HOME: '/Users/me' } as Record<string, string> } = {},
) => {
  const disk = new Map(Object.entries(files))
  mock.env(on, env)
  mock.clock(on, { now: NOW })
  on('session.id', async () => ({ value: 'here' }))
  on('session.root', async () => ({ value: root }))
  on('ui.open', async () => ({ value: { isPlaced: true } }))
  on('ui.panes', async () => ({
    value: [{ id: 'workstreams', title: 'Workstreams', isShown: true, isFocused: false }],
  }))
  on('fs.write', async (_, e) => {
    disk.set(e.path, e.text)

    return { value: undefined }
  })
  on('fs.read', async (_, e) =>
    disk.has(e.path) ? { value: disk.get(e.path) } : { deny: 'No such file.' },
  )
  on('fs.list', async (_, e) => ({
    value: [...disk.keys()]
      .filter(path => path.startsWith(`${e.path}/`))
      .map(path => ({
        name: path.slice(`${e.path}/`.length),
        kind: 'file',
        size: 1,
        mtimeMs: NOW,
        isLink: false,
      })),
  }))

  return disk
}

const saved = (disk: Map<string, string>, path = `${SHARED}/here.json`): Chat =>
  JSON.parse(disk.get(path) ?? '{}')

test('shows each piece of work as a card with its chat, on each surface', async ($, on) => {
  const disk = world(on, {
    ...chatFiles('here', 'Panel work', {}),
    ...chatFiles('aaa', 'Main Orchestrator', {
      at: NOW - 4 * MINUTE,
      asked: 'Should I land this?',
      helpers: ['agent-1', 'agent-2'],
      streams: [stream('Fix login (TKV-7)', 'needs_owner', 'Mike approves the merge.')],
    }),
  })

  const answer = await $.tool.call({
    tool: 'mcp__workstreams__report',
    name: 'Build panel',
    status: 'in_progress',
    next: 'Write the tests.',
  })
  expect(answer.result).toBe('Saved: Build panel.')
  expect(saved(disk).streams).toMatchObject([{ name: 'Build panel', status: 'in_progress' }])

  await $.command.run({ command: 'streams' })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ text: /^Workstreams \(2\)$/ })).toBeDefined()
    // What needs the owner comes first.
    const labels = await ui.findAll({ type: 'Text', text: /^ (NEEDS YOU|IN PROGRESS) $/ })
    expect(labels.map(one => one.text)).toEqual([' NEEDS YOU ', ' IN PROGRESS '])
    expect(await ui.find({ text: /^Chat: Main Orchestrator · stopped 4 min ago$/ })).toBeDefined()
    expect(await ui.find({ text: /^Next: Mike approves the merge\.$/ })).toBeDefined()
    expect(await ui.find({ text: /^Chat: Panel work \(this chat\) · stopped just now$/ })).toBeDefined()
    // The chat named Main Orchestrator is the first chat.
    const names = await ui.findAll({
      type: 'Text',
      text: /^(Main Orchestrator|Panel work \(this chat\))$/,
    })
    expect(names.map(one => one.text)).toEqual(['Main Orchestrator', 'Panel work (this chat)'])
    expect(await ui.find({ text: /^You: Should I land this\?$/ })).toBeDefined()
    expect(await ui.find({ text: /^Helper agents running: 2$/ })).toBeDefined()
    await ui.unmount()
  }
})

test('says so when no chat has reported', async ($, on) => {
  world(on)

  await $.command.run({ command: 'streams' })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })

  expect(await ui.find({ text: /No chat has reported a piece of work yet/ })).toBeDefined()
})

test('shows one card for work two chats report, and lists finished work', async ($, on) => {
  world(on, {
    ...chatFiles('aaa', 'Main Orchestrator', {
      streams: [stream('Fix login', 'in_progress', 'Old step.', NOW - MINUTE)],
    }),
    ...chatFiles('bbb', 'Login chat', {
      streams: [
        stream('fix login', 'blocked', 'Waiting on the API key.'),
        stream('Rename files', 'done', ''),
      ],
    }),
  })

  await $.command.run({ command: 'streams' })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })

  expect(await ui.find({ text: /^Workstreams \(1\)$/ })).toBeDefined()
  // The newest report gives the status and the next step.
  expect(await ui.find({ text: /^ BLOCKED $/ })).toBeDefined()
  expect(await ui.find({ text: /^Next: Waiting on the API key\.$/ })).toBeDefined()
  expect(await ui.findAll({ type: 'Text', text: /^Chat: / })).toHaveLength(2)
  expect(await ui.find({ text: /^✓ Rename files · Login chat$/ })).toBeDefined()
})

test('follows what the chat is doing', async ($, on) => {
  const disk = world(on)
  const seen: string[] = []
  on('prompt.submit', async (_, e) => ({ text: e.text }))
  on('turn.start', async (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', async (_, e) => ({ text: e.answer }))
  on('tool.call', async () => {
    seen.push(saved(disk).state)

    return { result: 'answered' }
  })

  await $.prompt.submit({ text: 'Fix the login bug', wait: false, origin: { kind: 'composer' } })
  await $.prompt.submit({ text: 'A task finished.', wait: false, origin: { kind: 'task-notification' } })
  expect(saved(disk)).toMatchObject({ asked: 'Fix the login bug', name: 'Fix the login bug' })

  await $.turn.start({ text: 'Fix the login bug', turnId: 't1' })
  expect(saved(disk).state).toBe('working')

  await $.tool.call({ tool: 'AskUserQuestion', questions: [] })
  expect(seen).toEqual(['asking'])
  expect(saved(disk).state).toBe('working')

  await $.turn.complete({
    turnId: 't1',
    answer: 'Done.',
    durationMs: 1,
    isAborted: false,
    reason: 'answer',
  })
  expect(saved(disk).state).toBe('stopped')
})

test('keeps the reported work of a chat that is opened again', async ($, on) => {
  const disk = world(on, {
    ...chatFiles('here', 'Panel work', {
      streams: [stream('Build panel', 'in_progress', 'Write the tests.')],
    }),
  })
  on('turn.start', async (_, e) => ({ turnId: e.turnId }))

  // The reopened chat holds no record of its own yet.
  await $.turn.start({ text: 'Carry on', turnId: 't1' })

  expect(saved(disk)).toMatchObject({
    state: 'working',
    streams: [{ name: 'Build panel', status: 'in_progress' }],
  })
})

test('counts the helper agents and takes no report from one', async ($, on) => {
  const disk = world(on)
  on('agent.spawn', async () => ({ model: 'm', agentId: 'agent-1' }))
  on('turn.start', async (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', async (_, e) => ({ text: e.answer }))

  await $.turn.start({ text: 'Go', turnId: 't1' })
  await $.agent.spawn({ prompt: 'Read the docs.', description: 'Read the docs' })
  expect(saved(disk)).toMatchObject({ state: 'working', helpers: ['agent-1'] })

  const answer = await $.tool.call({
    tool: 'mcp__workstreams__report',
    agentId: 'agent-1',
    name: 'A helper step',
    status: 'in_progress',
    next: '',
  })
  expect(answer.result).toContain('Not saved')

  await $.turn.complete({
    turnId: 't2',
    agentId: 'agent-1',
    answer: 'Read.',
    durationMs: 1,
    isAborted: false,
    reason: 'answer',
  })
  // The helper ended; the chat itself is still working.
  expect(saved(disk)).toMatchObject({ state: 'working', helpers: [], streams: [] })
})

test('tells each chat once to report its work', async ($, on) => {
  world(on)
  on('prompt.context', async (_, e) => ({ blocks: e.blocks }))

  const made = await $.prompt.context({ blocks: [{ name: 'currentDate', text: 'today' }] })

  expect(made.blocks.map(block => block.name)).toEqual(['currentDate', 'workstreams'])
  expect(made.blocks[1]?.text).toContain('mcp__workstreams__report')
})

test('counts a chat in a worktree as part of the project', async ($, on) => {
  const disk = world(on, {}, { root: '/Users/me/my.project/.claude/worktrees/fix-1' })

  await $.tool.call({ tool: 'mcp__workstreams__report', name: 'Fix', status: 'done', next: '' })

  expect(saved(disk).dir).toBe('-Users-me-my-project--claude-worktrees-fix-1')
})

test('saves under the Windows home folder', async ($, on) => {
  const disk = world(on, {}, {
    root: 'C:\\Users\\me\\proj',
    env: { USERPROFILE: 'C:\\Users\\me' },
  })

  await $.tool.call({ tool: 'mcp__workstreams__report', name: 'Fix', status: 'odd', next: 'Go.' })

  // This test runs on a Mac, where a path starting "C:" is not a full path,
  // so the test's disk sees it with the current folder in front.
  const path = [...disk.keys()][0] ?? ''
  expect(path.endsWith('C:\\Users\\me/.claude/workstreams/C--Users-me-proj/here.json')).toBe(true)
  // A status the tool does not know counts as in progress.
  expect(saved(disk, path).streams).toMatchObject([{ name: 'Fix', status: 'in_progress' }])
})

test('uses the folder Claude Code keeps the chat in, once it is known', async ($, on) => {
  const disk = world(on)
  on('classic.UserPromptSubmit', async () => ({}))

  await $.classic.UserPromptSubmit({
    prompt: 'Hello',
    transcript_path: '/Users/me/.claude/projects/-Users-me-other/here.jsonl',
  })
  await $.tool.call({ tool: 'mcp__workstreams__report', name: 'Fix', status: 'done', next: '' })

  expect(disk.has('/Users/me/.claude/workstreams/-Users-me-other/here.json')).toBe(true)
})

test('dismisses a piece of work until it is reported again', async ($, on) => {
  const report = (status: Stream['status'], at: number) =>
    chatFiles('aaa', 'Main Orchestrator', {
      streams: [stream('Fix login', status, 'Mike approves.', at)],
    })
  const disk = world(on, report('needs_owner', NOW - MINUTE))

  await $.command.run({ command: 'streams' })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /^Fix login$/ })).toBeDefined()

    await ui.press({ key: 'dismiss-work-0' })
    expect(await ui.find({ type: 'Text', text: /^Fix login$/ })).toBeUndefined()
    // The chat's own card stays.
    expect(await ui.find({ type: 'Text', text: /^Main Orchestrator$/ })).toBeDefined()
    expect(JSON.parse(disk.get(`${SHARED}/_dismissed.json`) ?? '{}')).toMatchObject({
      streams: { 'fix login': NOW },
    })

    // The chat reports the work again: its card is back.
    for (const [path, text] of Object.entries(report('blocked', NOW + MINUTE))) {
      disk.set(path, text)
    }

    await ui.press({ key: 'refresh' })
    expect(await ui.find({ type: 'Text', text: /^Fix login$/ })).toBeDefined()

    // Put the disk back for the next surface.
    disk.delete(`${SHARED}/_dismissed.json`)
    for (const [path, text] of Object.entries(report('needs_owner', NOW - MINUTE))) {
      disk.set(path, text)
    }

    await ui.press({ key: 'refresh' })
    await ui.unmount()
  }
})

test('dismisses a chat and its work until the owner writes to it again', async ($, on) => {
  const old = (at: number, active: number) =>
    chatFiles('aaa', 'Old chat', {
      at,
      active,
      streams: [stream('Old work', 'in_progress', 'Next.', NOW - MINUTE)],
    })
  const disk = world(on, {
    ...old(NOW - MINUTE, NOW - MINUTE),
    ...chatFiles('bbb', 'Live chat', {
      active: NOW,
      streams: [stream('Live work', 'in_progress', 'Next.')],
    }),
  })
  const put = (files: Record<string, string>) => {
    for (const [path, text] of Object.entries(files)) {
      disk.set(path, text)
    }
  }

  await $.command.run({ command: 'streams' })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })

  // The newest chat is first, so the old chat is the second card.
  await ui.press({ key: 'dismiss-chat-1' })
  expect(await ui.find({ type: 'Text', text: /^Old chat$/ })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: /^Old work$/ })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: /^Live work$/ })).toBeDefined()

  // The chat closing saves its record again: it stays dismissed.
  put(old(NOW + MINUTE, NOW - MINUTE))
  await ui.press({ key: 'refresh' })
  expect(await ui.find({ type: 'Text', text: /^Old chat$/ })).toBeUndefined()

  // The owner writes to the chat again: it is back, with its work.
  put(old(NOW + MINUTE, NOW + MINUTE))
  await ui.press({ key: 'refresh' })
  expect(await ui.find({ type: 'Text', text: /^Old chat$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^Old work$/ })).toBeDefined()
})

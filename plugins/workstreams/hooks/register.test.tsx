import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

const SOURCE = 'b22b381d-a176-8301-a22c-0766e27d8dc9'
const PAGE_7 = '11111111-2222-3333-4444-555555555555'
const PAGE_3 = '33333333-2222-3333-4444-555555555555'
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

const page = (number: number, title: string, status: string, waiting: string) => ({
  id: number === 7 ? PAGE_7 : number === 3 ? PAGE_3 : `page-${number}`,
  properties: {
    ID: { unique_id: { prefix: 'TKV', number } },
    'Work item': { title: [{ plain_text: title }] },
    Status: { status: { name: status } },
    'Waiting on': { select: { name: waiting } },
  },
})

const output = (stdout: string, exitCode = 0) => ({
  value: {
    exitCode,
    stdout,
    stderr: '',
    isStdoutTruncated: false,
    isStderrTruncated: false,
  },
})

const MAC = {
  root: '/Users/me/my.project',
  shell: '/bin/sh',
  // The toolkit repository's own form, in AGENTS.md.
  read: (path: string) =>
    path.endsWith('AGENTS.md') ? `Work Items data source\n\`${SOURCE}\`.` : '',
}

// A project that names the data source and whose Notion holds four items.
// `scan` is what the scan of the saved chats prints. Only `shell` runs it.
const project = (on: On, scan = '==writes==\n', { root, shell, read } = MAC) => {
  const ran: string[][] = []
  mock.env(on, {})
  mock.clock(on)
  on('session.id', async () => ({ value: 'here' }))
  on('ui.open', async () => ({ value: { isPlaced: true } }))
  on('session.root', async () => ({ value: root }))
  on('fs.read', async (_, e) => ({ value: read(e.path) }))
  on('process.run', async (_, e) => {
    ran.push([...e.argv])

    if (e.argv[2]?.includes('==writes==')) {
      return e.argv[0] === shell ? output(scan) : output('', 127)
    }

    return output(
      JSON.stringify({
        results: [
          page(7, 'Fix the tracker', 'In Progress', 'owner'),
          page(3, 'Move old projects', 'Not Started', 'agent'),
          page(9, 'Prompt hook', 'Done', 'none'),
          page(6, 'Dropped idea', 'Cancelled', 'none'),
        ],
      }),
    )
  })

  return ran
}

const named = (chat: string, name: string) =>
  `./p/${chat}.jsonl:${JSON.stringify({ type: 'custom-title', customTitle: name })}`

test('lists work items by status on each surface', async ($, on) => {
  const ran = project(on)

  // The command returns at once; the panel fills in as the reads finish.
  await $.command.run({ command: 'streams' })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ text: /Needs you \(1\)/ })).toBeDefined()
    expect(await ui.find({ text: /^TKV-7 · In progress$/ })).toBeDefined()
    expect(await ui.find({ text: /^Fix the tracker$/ })).toBeDefined()
    expect(await ui.find({ text: /Not started \(1\)/ })).toBeDefined()
    expect(await ui.find({ text: /Done \(1\)/ })).toBeDefined()
    expect(await ui.find({ text: /Dropped idea/ })).toBeUndefined()
    await ui.unmount()
  }

  expect(ran[0]).toContain(`v1/data_sources/${SOURCE}/query`)
  // The scan gets the project's folder name and the open items' page ids.
  expect(ran[1]?.[4]).toBe('-Users-me-my-project')
  expect(ran[1]?.[5]).toContain(PAGE_7)
})

test('says so when the project names no Notion work items', async ($, on) => {
  on('ui.open', async () => ({ value: { isPlaced: true } }))
  on('session.root', async () => ({ value: '/project' }))
  on('fs.read', async () => ({ value: 'No ids here.' }))

  await $.command.run({ command: 'streams' })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })

  expect(await ui.find({ text: /No Notion work items/ })).toBeDefined()
})

test('names the chat that last changed each item', async ($, on) => {
  project(
    on,
    [
      named('aaa', 'Old name'),
      named('aaa', 'Main Orchestrator'),
      named('here', 'Panel work'),
      '==writes==',
      `./p/aaa.jsonl\t2026-10-02T10:00:00Z\t${PAGE_7}`,
      `./p/here/subagents/agent-1.jsonl\t2026-10-03T10:00:00Z\t${PAGE_7.replaceAll('-', '')}`,
      `./p/aaa.jsonl\t2026-10-03T09:00:00Z\t${PAGE_3}`,
      '',
    ].join('\n'),
  )

  await $.command.run({ command: 'streams' })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ text: /^TKV-7 · In progress$/ })).toBeDefined()
    expect(await ui.find({ text: /^ this chat $/ })).toBeDefined()
    expect(await ui.find({ text: /^ Main Orchestrator $/ })).toBeDefined()
    await ui.unmount()
  }
})

test('puts a chat named after an item ahead of the last change', async ($, on) => {
  project(
    on,
    [
      named('aaa', 'Main Orchestrator'),
      named('bbb', 'TKV-3 move-over'),
      named('ccc', 'TKV-31 other work'),
      '==writes==',
      `./p/aaa.jsonl\t2026-10-03T09:00:00Z\t${PAGE_3}`,
      '',
    ].join('\n'),
  )

  await $.command.run({ command: 'streams' })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })

  expect(await ui.find({ text: /^ TKV-3 move-over $/ })).toBeDefined()
  expect(await ui.find({ text: /Main Orchestrator/ })).toBeUndefined()
})

test('reads a set-up project on Windows', async ($, on) => {
  const ran = project(
    on,
    [
      named('aaa', 'Main Orchestrator'),
      '==writes==',
      `./p/aaa.jsonl\t2026-10-03T09:00:00Z\t${PAGE_3}`,
      '',
    ].join('\r\n'),
    {
      root: 'C:\\Users\\me\\my project',
      shell: 'C:\\Program Files\\Git\\bin\\sh.exe',
      // The form project setup writes into PROJECT.md's Notion block.
      read: path =>
        path.endsWith('PROJECT.md')
          ? `### Notion\n- Work Items: database 0123, data source ${SOURCE}\n`
          : '',
    },
  )

  await $.command.run({ command: 'streams' })
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })

  expect(await ui.find({ text: /^ Main Orchestrator $/ })).toBeDefined()
  expect(ran[0]).toContain(`v1/data_sources/${SOURCE}/query`)
  expect(ran.at(-1)?.[0]).toBe('C:\\Program Files\\Git\\bin\\sh.exe')
  expect(ran.at(-1)?.[4]).toBe('C--Users-me-my-project')
})

test('reads a chat in a worktree under the main project', async ($, on) => {
  const ran = project(on, '==writes==\n', {
    ...MAC,
    root: '/Users/me/my.project/.claude/worktrees/fix-1',
  })

  await $.command.run({ command: 'streams' })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })

  expect(await ui.find({ text: /Needs you \(1\)/ })).toBeDefined()
  expect(ran.at(-1)?.[4]).toBe('-Users-me-my-project')
})

test('says so when Notion cannot be read, and when the chats cannot', async ($, on) => {
  let isNotionUp = false
  mock.env(on, {})
  mock.clock(on)
  on('session.id', async () => ({ value: 'here' }))
  on('ui.open', async () => ({ value: { isPlaced: true } }))
  on('session.root', async () => ({ value: MAC.root }))
  on('fs.read', async (_, e) => ({ value: MAC.read(e.path) }))
  on('process.run', async (_, e) =>
    isNotionUp && e.argv[1] === 'api'
      ? output(JSON.stringify({ results: [page(7, 'Fix the tracker', 'In Progress', 'owner')] }))
      : output('', 1),
  )

  await $.command.run({ command: 'streams' })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ text: /Could not read Notion/ })).toBeDefined()

  isNotionUp = true
  await ui.press({ key: 'refresh' })
  expect(await ui.find({ text: /Could not read the saved chats/ })).toBeDefined()
  expect(await ui.find({ text: /^Fix the tracker$/ })).toBeDefined()
})

test('lists a helper agent while it runs', async ($, on) => {
  project(on)
  on('agent.spawn', async () => ({ model: 'm', agentId: 'agent-1' }))
  on('turn.complete', async () => ({}))

  await $.agent.spawn({ prompt: 'Read the docs.', description: 'Read the docs' })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ text: /Helpers running \(1\)/ })).toBeDefined()
  expect(await ui.find({ text: /Read the docs/ })).toBeDefined()
})

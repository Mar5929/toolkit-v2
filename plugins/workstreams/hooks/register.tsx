import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Board, Item } from '../types'
import { SCAN, WRITES } from './scan.mjs'

const PANE = 'workstreams'
const TITLE = 'Workstreams'
const DONE_SHOWN = 5
// Notion gives 100 items at a time: read at most this many times.
const MAX_READS = 10
// A program this computer lacks fails at once. A failure slower than this
// (in milliseconds) is a program that ran, so no other one is tried.
const MISSING_WITHIN = 5000

const board = atom({ plugin: 'workstreams', key: 'board' } as const, {
  items: [],
  note: '',
})
const helpers = atom({ plugin: 'workstreams', key: 'helpers' } as const, [])

// A set-up project names its Work Items data source in PROJECT.md's Notion
// block: "- Work Items: database <id>, data source <id>". The toolkit's own
// repository names it in AGENTS.md: "Work Items data source `<id>`".
const SOURCE_ID =
  /Work Items(?::[^\n]*?,)?\s+data source\s*`?([0-9a-f]{8}-?(?:[0-9a-f]{4}-?){3}[0-9a-f]{12})/i
const NTN = [
  'ntn',
  '/opt/homebrew/bin/ntn',
  '/usr/local/bin/ntn',
  'ntn.cmd',
  'ntn.exe',
]
// On Windows the search tools come with Git for Windows.
const WINDOWS_SH = [
  'C:\\Program Files\\Git\\bin\\sh.exe',
  'C:\\Program Files\\Git\\usr\\bin\\sh.exe',
]
const QUERY = {
  filter: {
    and: [
      { property: 'Archived', checkbox: { equals: false } },
      { property: 'Work item', title: { is_not_empty: true } },
    ],
  },
  sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
  page_size: 100,
}

// Open items, in the order the panel lists them.
const GROUPS = [
  ['In Progress', 'In progress'],
  ['Preparing', 'Preparing'],
  ['Blocked', 'Blocked'],
  ['Not Started', 'Not started'],
] as const

const label = (status: string) =>
  GROUPS.find(([name]) => name === status)?.[1] ?? status

const isOpen = (item: Item) =>
  item.status !== 'Done' && item.status !== 'Cancelled'

// Claude Code saves each chat under a folder named after the project's path;
// a chat in a worktree gets the same name plus "--claude-worktrees-<name>".
const projectKey = (root: string) =>
  root.replace(/[^A-Za-z0-9-]/g, '-').replace(/--claude-worktrees-.*$/, '')

// "./<project>/<chat id>.jsonl", or a helper's file under "./<project>/<chat id>/".
const chatOf = (path: string) => path.split('/')[2]?.replace('.jsonl', '') ?? ''

const findSource = async ($: EngineInterface, root: string) => {
  for (const file of ['PROJECT.md', 'AGENTS.md']) {
    try {
      const id = SOURCE_ID.exec(await $.fs.read(`${root}/${file}`))?.[1]

      if (id) {
        return id
      }
    } catch {
      // The file is missing: try the next one.
    }
  }

  return undefined
}

// Runs the first of `programs` this computer has and gives back what it
// printed. Gives back nothing when none ran, or when the one that ran failed.
const runFirst = async (
  $: EngineInterface,
  programs: readonly string[],
  args: readonly string[],
) => {
  for (const program of programs) {
    const started = await $.clock.now()
    let exitCode = 1

    try {
      const ran = await $.process.run([program, ...args], { stdin: '' })

      if (ran.exitCode === 0) {
        return ran.stdout
      }

      exitCode = ran.exitCode
    } catch {
      // The program is missing, or it ran out of time.
    }

    if (exitCode !== 0 && (await $.clock.now()) - started > MISSING_WITHIN) {
      return undefined
    }
  }

  return undefined
}

// Reads every unarchived work item, 100 at a time.
const query = async ($: EngineInterface, source: string) => {
  const pages: unknown[] = []
  let cursor: string | undefined

  for (let reads = 0; reads < MAX_READS; reads += 1) {
    const body = JSON.stringify(cursor ? { ...QUERY, start_cursor: cursor } : QUERY)
    const text = await runFirst($, NTN, [
      'api',
      `v1/data_sources/${source}/query`,
      '-d',
      body,
    ])

    try {
      const answer = JSON.parse(text ?? '')
      pages.push(...answer.results)

      if (!answer.has_more) {
        return pages
      }

      cursor = answer.next_cursor
    } catch {
      return undefined
    }
  }

  return pages
}

const toItems = (results: unknown[]): Item[] | undefined => {
  try {
    return results.map((page: any) => {
      const props = page.properties
      const id = props.ID?.unique_id ?? {}

      return {
        id: id.prefix ? `${id.prefix}-${id.number}` : `${id.number ?? '?'}`,
        number: id.number ?? 0,
        pageId: page.id ?? '',
        title: props['Work item'].title.map((t: any) => t.plain_text).join(''),
        status: props.Status?.status?.name ?? 'Not Started',
        needsYou: props['Waiting on']?.select?.name === 'owner',
        chat: '',
      }
    })
  } catch {
    return undefined
  }
}

// Runs the scan with the first shell that works on this computer.
const scan = async ($: EngineInterface, key: string, pageIds: string) => {
  const named = await $.env.get('CLAUDE_CODE_GIT_BASH_PATH')
  const shells = ['/bin/sh', ...(named ? [named] : []), ...WINDOWS_SH, 'sh']

  const stdout = await runFirst($, shells, ['-c', SCAN, 'sh', key, pageIds])

  if (!stdout?.includes(WRITES)) {
    throw new Error('No shell ran the scan.')
  }

  return stdout
}

// Names the chat each open item belongs to: a chat whose name holds the
// item's ID, else the chat that last changed the item's Notion page.
const withChats = async ($: EngineInterface, root: string, items: Item[]) => {
  const open = items.filter(item => isOpen(item) && item.pageId !== '')

  if (open.length === 0) {
    return items
  }

  const pageIds = open.flatMap(item => [
    item.pageId,
    item.pageId.replaceAll('-', ''),
  ])
  const stdout = await scan($, projectKey(root), pageIds.join('|'))
  // Git for Windows may end lines with a carriage return.
  const [titleLines = '', writeLines = ''] = stdout
    .replaceAll('\r', '')
    .split(`${WRITES}\n`)
  const here = await $.session.id()
  const names = new Map<string, string>()

  for (const line of titleLines.split('\n')) {
    const at = line.indexOf(':{')

    try {
      const { customTitle } = JSON.parse(line.slice(at + 1))
      names.set(chatOf(line.slice(0, at)), customTitle)
    } catch {
      // Not a name record: skip the line.
    }
  }

  const nameOf = (chat: string) =>
    chat === here ? 'this chat' : names.get(chat) || 'Unnamed chat'
  const last = new Map<string, { chat: string; at: string }>()

  for (const line of writeLines.split('\n')) {
    const [path, at, pageId] = line.split('\t')
    const bare = pageId?.replaceAll('-', '')
    const item = open.find(one => one.pageId.replaceAll('-', '') === bare)

    if (path && at && item && at > (last.get(item.id)?.at ?? '')) {
      last.set(item.id, { chat: chatOf(path), at })
    }
  }

  return items.map(item => {
    const hasId = new RegExp(`(^|[^A-Za-z0-9])${item.id}(?![0-9])`)
    const named = [...names].filter(([, name]) => hasId.test(name ?? ''))
    const chat =
      named.length > 0
        ? named.map(([chat]) => nameOf(chat)).join(', ')
        : last.has(item.id)
          ? nameOf(last.get(item.id)!.chat)
          : ''

    return isOpen(item) ? { ...item, chat } : item
  })
}

// Reads the work items again. The scan of the saved chats takes a few
// seconds, so it runs only when asked for; otherwise the names are kept.
const load = async ($: EngineInterface, findChats: boolean) => {
  const set = (next: Partial<Board>) =>
    update($, board, now => ({ ...now, ...next }))

  await set({ note: 'Loading…' })
  const root = await $.session.root()
  const source = await findSource($, root)

  if (!source) {
    return set({ items: [], note: 'No Notion work items set for this project.' })
  }

  const results = await query($, source)
  const items = results === undefined ? undefined : toItems(results)

  if (!items) {
    return set({ note: 'Could not read Notion. Check: ntn whoami' })
  }

  const before = (await read($, board)).items
  const kept = items.map(item => ({
    ...item,
    chat: before.find(one => one.id === item.id)?.chat ?? '',
  }))

  if (!findChats) {
    return set({ items: kept, note: '' })
  }

  await set({ items: kept, note: 'Finding chats…' })

  try {
    return await set({ items: await withChats($, root, items), note: '' })
  } catch {
    return set({ note: 'Could not read the saved chats.' })
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'streams',
      description: 'Show the work items and running helper agents in a pane',
      // Opens at once, also while the agent is working.
      immediate: true,
    })

    return next(e)
  })

  on('command.run', { command: 'streams' }, async $ => {
    await $.ui.open({ id: PANE, title: TITLE })
    // The panel opens now and fills in as the reads finish.
    void load($, true).catch(() => {})

    return {}
  })

  on('agent.spawn', async ($, e, next) => {
    const ran = await next(e)
    const id = ran.agentId

    if (id) {
      await update($, helpers, list =>
        [...list, { id, name: e.description }].slice(-50),
      )
    }

    return ran
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId !== undefined) {
      await update($, helpers, list => list.filter(one => one.id !== e.agentId))

      return next(e)
    }

    const done = await next(e)
    const panes = await $.ui.panes()

    // The agent may have changed work items this turn: read them again.
    if (panes.some(pane => pane.id === PANE && pane.isShown)) {
      void load($, false).catch(() => {})
    }

    return done
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const { items, note } = await read($, board)
    const running = await read($, helpers)
    const byNumber = [...items].sort((a, b) => a.number - b.number)
    const needsYou = byNumber.filter(item => isOpen(item) && item.needsYou)
    const done = items.filter(item => item.status === 'Done')

    const group = (title: string, list: Item[], showStatus = false) =>
      list.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>
            {title} ({list.length})
          </Text>
          {list.map(item => (
            <Box>
              <Box flexShrink={0} width={2}>
                <Text>•</Text>
              </Box>
              <Box flexDirection="column" flexShrink={1}>
                <Text wrap="wrap">{item.title}</Text>
                <Text dimColor wrap="wrap">
                  {[item.id, showStatus && label(item.status)]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
                {item.chat !== '' && (
                  <Box>
                    <Text bold color="white" backgroundColor="blue">
                      {` ${item.chat} `}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )

    return (
      <Box flexDirection="column" paddingX={1}>
        <Box>
          <Button key="refresh" label="Refresh" onPress={() => load($, true)} />
          {note !== '' && <Text dimColor> {note}</Text>}
        </Box>
        {group('Needs you', needsYou, true)}
        {GROUPS.map(([status, title]) =>
          group(
            title,
            byNumber.filter(item => item.status === status && !item.needsYou),
          ),
        )}
        {group('Done', done.slice(0, DONE_SHOWN))}
        {running.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            <Text bold>Helpers running ({running.length})</Text>
            {running.map(one => (
              <Text wrap="truncate-end">· {one.name}</Text>
            ))}
          </Box>
        )}
      </Box>
    )
  })
}

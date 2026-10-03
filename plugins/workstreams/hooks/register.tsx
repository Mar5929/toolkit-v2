import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Chat, ChatState, Stream, StreamStatus } from '../types'

const PANE = 'workstreams'
const TITLE = 'Workstreams'
const ORCHESTRATOR = /^main orchestrator$/i
const MINUTE = 60 * 1000
const DAY = 24 * 60 * MINUTE
// A chat that has not changed for this long is left out.
const KEEP = 7 * DAY
const MAX_CHATS = 40
const MAX_STREAMS = 20
const DONE_SHOWN = 5
// How often an open panel reads the chats again, in milliseconds.
const REFRESH = 10 * 1000

const STATUSES: readonly StreamStatus[] = [
  'needs_owner',
  'blocked',
  'in_progress',
  'done',
]
// The label and color of each status and state that gets a colored label.
const LOOK: Record<string, readonly [string, string]> = {
  needs_owner: ['NEEDS YOU', 'magenta'],
  blocked: ['BLOCKED', 'red'],
  in_progress: ['IN PROGRESS', 'blue'],
  asking: ['ASKING YOU', 'magenta'],
  working: ['WORKING', 'green'],
}
const STATE_ORDER: readonly ChatState[] = ['asking', 'working', 'stopped']
// A prompt of one of these kinds is the owner's own message.
const OWNER = ['composer', 'bridge', 'sdk']

// What every chat reads once, at its start.
const INSTRUCTION =
  'Workstream panel: the owner follows his significant pieces of work across his chats in a ' +
  'side panel. A piece of work counts when it is a work item, or a large task the owner asked ' +
  'for and is following. Call mcp__workstreams__report (load it with ToolSearch first if it is ' +
  'deferred) when you start one, when its status changes, before you stop to wait for the ' +
  'owner, and when it is done. Do not report the steps inside a piece of work, questions, or ' +
  'small chores. Helper agents do not report. Give a short name (with the work item ID when ' +
  'there is one), the status, and the next step in one short sentence. Report each piece of ' +
  'work separately. Do not mention the report in your reply.'

const board = atom({ plugin: 'workstreams', key: 'board' } as const, {
  chats: [],
  note: '',
  here: '',
  at: 0,
})
const mine = atom({ plugin: 'workstreams', key: 'mine' } as const, {
  id: '',
  dir: '',
  name: '',
  state: 'stopped',
  asked: '',
  at: 0,
  helpers: [],
  streams: [],
})

// The name of this chat's folder under Claude Code's "projects" folder, once
// a settings hook event has named the chat's file.
let transcriptDir = ''

// Claude Code names a chat's folder after the project's path.
const keyOf = (path: string) => path.replace(/[^A-Za-z0-9-]/g, '-')

// A chat in a worktree has the project's name plus "--claude-worktrees-<name>".
const projectOf = (dir: string) => dir.replace(/--claude-worktrees-.*$/, '')

const clip = (value: unknown, length: number) =>
  typeof value === 'string' ? value.trim().slice(0, length) : ''

const isSame = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

// True for a saved record this version can use.
const isChat = (value: any): value is Chat =>
  typeof value?.id === 'string' &&
  Array.isArray(value.streams) &&
  Array.isArray(value.helpers)

const ago = (ms: number) => {
  const minutes = Math.floor(ms / MINUTE)

  if (minutes < 1) {
    return 'just now'
  }

  if (minutes < 60) {
    return `${minutes} min ago`
  }

  return minutes < 60 * 24
    ? `${Math.floor(minutes / 60)} h ago`
    : `${Math.floor(minutes / (60 * 24))} d ago`
}

const configDir = async ($: EngineInterface) => {
  const named = await $.env.get('CLAUDE_CONFIG_DIR')
  const home = (await $.env.get('HOME')) ?? (await $.env.get('USERPROFILE'))

  return named || `${home ?? ''}/.claude`
}

const chatDir = async ($: EngineInterface) =>
  transcriptDir || keyOf(await $.session.root())

// Changes this chat's record and saves it where the project's other chats
// read it: one file per chat, so no chat writes over another.
const change = async ($: EngineInterface, apply: (chat: Chat) => Chat) => {
  try {
    const id = await $.session.id()
    const dir = await chatDir($)
    const at = await $.clock.now()
    const file = `${await configDir($)}/workstreams/${projectOf(dir)}/${id}.json`

    // A chat that was reopened starts with an empty record: take up the saved
    // one first, so its reported work is kept.
    if ((await read($, mine)).id !== id) {
      const kept = await $.fs.read(file).then(JSON.parse, () => undefined)

      if (isChat(kept)) {
        await update($, mine, () => kept)
      }
    }

    await update($, mine, now => ({ ...apply(now), id, dir, at }))
    await $.fs.write(file, JSON.stringify(await read($, mine)))
  } catch {
    // A record that was not saved never holds up the chat.
  }
}

// The name the owner sees in the sidebar. It is read each time, so a renamed
// chat shows its new name.
const nameOf = async ($: EngineInterface, config: string, chat: Chat) => {
  try {
    const file = `${config}/projects/${chat.dir}/${chat.id}/custom-title.json`
    const { customTitle } = JSON.parse(await $.fs.read(file))

    if (typeof customTitle === 'string' && customTitle !== '') {
      return customTitle
    }
  } catch {
    // Claude Code holds no name for this chat.
  }

  return chat.name || 'Unnamed chat'
}

// Reads the record of every chat in this project.
const load = async ($: EngineInterface) => {
  try {
    const config = await configDir($)
    const folder = `${config}/workstreams/${projectOf(await chatDir($))}`
    const at = await $.clock.now()
    const here = await $.session.id()
    const files = await $.fs.list(folder).catch(() => [])
    const recent = files
      .filter(file => file.name.endsWith('.json') && at - file.mtimeMs < KEEP)
      .sort((a, b) => b.mtimeMs - a.mtimeMs)
      .slice(0, MAX_CHATS)
    const chats: Chat[] = []

    for (const file of recent) {
      try {
        const chat = JSON.parse(await $.fs.read(`${folder}/${file.name}`))

        if (isChat(chat)) {
          chats.push({ ...chat, name: await nameOf($, config, chat) })
        }
      } catch {
        // A file that cannot be read is left out.
      }
    }

    await update($, board, () => ({ chats, note: '', here, at }))
  } catch {
    await update($, board, now => ({ ...now, note: 'Could not read the chats.' }))
  }
}

const loadIfShown = async ($: EngineInterface) => {
  const panes = await $.ui.panes()

  if (panes.some(pane => pane.id === PANE && pane.isShown)) {
    await load($)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // The tool comes first: the instruction every chat reads names it.
    await $.tool.register({
      name: 'report',
      description:
        'Reports one significant piece of work this chat is doing (a work item, or a large task ' +
        'the owner asked for and is following) to the workstream panel the owner reads. Call it ' +
        'when the work starts, when its status changes, before stopping to wait for the owner, ' +
        'and when it is done. Not for the steps inside it or for small chores.',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'A short name. Use the same name each time for the same work.',
          },
          status: {
            type: 'string',
            enum: STATUSES,
            description:
              'in_progress: the agent is on it. needs_owner: it waits on the owner. ' +
              'blocked: it waits on something else. done: it is finished.',
          },
          next: {
            type: 'string',
            description: 'The next step and who does it, in one short sentence.',
          },
        },
        required: ['name', 'status', 'next'],
      },
    })
    $.clock.every(REFRESH, () => {
      void loadIfShown($).catch(() => {})
    })
    // Another plugin may hold the name: the reports still work without it.
    await $.command
      .register({
        name: 'streams',
        description: 'Show the workstreams and chats of this project in a pane',
        // Opens at once, also while the agent is working.
        immediate: true,
      })
      .catch(() => {})

    return next(e)
  })

  // The chat is closing: it no longer works on anything.
  on('session.end', async ($, e, next) => {
    await change($, chat => ({ ...chat, state: 'stopped', helpers: [] }))

    return next(e)
  })

  on('prompt.context', async ($, e, next) => {
    const made = await next(e)

    return {
      ...made,
      blocks: [...made.blocks, { name: 'workstreams', text: INSTRUCTION }],
    }
  })

  on('classic.UserPromptSubmit', ($, e, next) => {
    // ".../projects/<the chat's folder>/<chat id>.jsonl"
    transcriptDir = e.transcript_path?.split(/[\\/]/).at(-2) ?? transcriptDir

    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    const said = e.text.trim()

    if (said !== '' && !said.startsWith('/') && OWNER.includes(e.origin?.kind ?? '')) {
      await change($, chat => ({
        ...chat,
        asked: said.slice(0, 120),
        name: chat.name || said.slice(0, 40),
      }))
    }

    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    await change($, chat => ({ ...chat, state: 'working' }))

    return next(e)
  })

  // The question box is open: the chat waits on the owner.
  on('tool.call', { tool: 'AskUserQuestion' }, async ($, e, next) => {
    await change($, chat => ({ ...chat, state: 'asking' }))

    try {
      return await next(e)
    } finally {
      // An interrupted question has already ended the turn: leave that state.
      await change($, chat =>
        chat.state === 'asking' ? { ...chat, state: 'working' } : chat,
      )
    }
  })

  on('tool.call', { tool: 'mcp__workstreams__report' }, async ($, e) => {
    const name = clip(e.name, 80)

    if (e.agentId !== undefined) {
      return { result: 'Not saved: only the main chat reports, not a helper agent.' }
    }

    if (name === '') {
      return { result: 'Not saved: give the piece of work a name.' }
    }

    const at = await $.clock.now()
    const stream: Stream = {
      name,
      status: STATUSES.find(status => status === e.status) ?? 'in_progress',
      next: clip(e.next, 200),
      at,
    }
    await change($, chat => ({
      ...chat,
      streams: [
        ...chat.streams.filter(
          one =>
            !isSame(one.name, name) &&
            !(one.status === 'done' && at - one.at > DAY),
        ),
        stream,
      ].slice(-MAX_STREAMS),
    }))
    void loadIfShown($).catch(() => {})

    return { result: `Saved: ${name}.` }
  })

  on('agent.spawn', async ($, e, next) => {
    const ran = await next(e)
    const id = ran.agentId

    if (id) {
      await change($, chat => ({
        ...chat,
        helpers: [...chat.helpers, id].slice(-50),
      }))
    }

    return ran
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId !== undefined) {
      await change($, chat => ({
        ...chat,
        helpers: chat.helpers.filter(id => id !== e.agentId),
      }))

      return next(e)
    }

    await change($, chat => ({ ...chat, state: 'stopped' }))
    void loadIfShown($).catch(() => {})

    return next(e)
  })

  on('command.run', { command: 'streams' }, async $ => {
    await $.ui.open({ id: PANE, title: TITLE })
    // The panel opens now and fills in as the reads finish.
    void load($).catch(() => {})

    return {}
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const { chats, note, here, at } = await read($, board)
    const shownName = (chat: Chat) =>
      chat.id === here ? `${chat.name} (this chat)` : chat.name

    // One entry per piece of work: the newest report, and every chat on it.
    const works = new Map<string, { stream: Stream; chats: Chat[] }>()

    for (const chat of chats) {
      for (const stream of chat.streams) {
        const key = stream.name.toLowerCase()
        const held = works.get(key)

        works.set(key, {
          stream: held && held.stream.at > stream.at ? held.stream : stream,
          chats: [...(held?.chats ?? []), chat],
        })
      }
    }

    const all = [...works.values()].sort(
      (a, b) =>
        STATUSES.indexOf(a.stream.status) - STATUSES.indexOf(b.stream.status) ||
        b.stream.at - a.stream.at,
    )
    const open = all.filter(work => work.stream.status !== 'done')
    const done = all
      .filter(work => work.stream.status === 'done' && at - work.stream.at < DAY)
      .slice(0, DONE_SHOWN)
    const active = chats
      .filter(
        chat =>
          at - chat.at < DAY ||
          chat.streams.some(stream => stream.status !== 'done'),
      )
      .sort(
        (a, b) =>
          Number(ORCHESTRATOR.test(b.name)) - Number(ORCHESTRATOR.test(a.name)) ||
          STATE_ORDER.indexOf(a.state) - STATE_ORDER.indexOf(b.state) ||
          b.at - a.at,
      )

    const label = (kind: string) =>
      LOOK[kind] && (
        <Box>
          <Text bold color="white" backgroundColor={LOOK[kind][1]}>
            {` ${LOOK[kind][0]} `}
          </Text>
        </Box>
      )
    const stateOf = (chat: Chat) =>
      chat.state === 'stopped' ? `stopped ${ago(at - chat.at)}` : chat.state
    const heading = (text: string) => (
      <Box marginTop={1}>
        <Text bold>{text}</Text>
      </Box>
    )

    return (
      <Box flexDirection="column" paddingX={1}>
        <Box>
          <Button key="refresh" label="Refresh" onPress={() => load($)} />
          {note !== '' && <Text dimColor> {note}</Text>}
        </Box>

        {heading(`Workstreams (${open.length})`)}
        {open.length === 0 && (
          <Text dimColor wrap="wrap">
            No chat has reported a piece of work yet. A chat reports after its
            next message.
          </Text>
        )}
        {open.map(work => (
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor={LOOK[work.stream.status]?.[1]}
            paddingX={1}
            marginTop={1}
          >
            <Text bold wrap="wrap">
              {work.stream.name}
            </Text>
            {label(work.stream.status)}
            {work.chats.map(chat => (
              <Text wrap="wrap">
                Chat: {shownName(chat)} · {stateOf(chat)}
              </Text>
            ))}
            {work.stream.next !== '' && (
              <Text wrap="wrap">Next: {work.stream.next}</Text>
            )}
          </Box>
        ))}

        {heading(`Chats (${active.length})`)}
        {active.map(chat => (
          <Box
            flexDirection="column"
            borderStyle="round"
            borderDimColor={chat.state === 'stopped'}
            borderColor={LOOK[chat.state]?.[1]}
            paddingX={1}
            marginTop={1}
          >
            <Text bold wrap="wrap">
              {shownName(chat)}
            </Text>
            {label(chat.state) || <Text dimColor>Stopped {ago(at - chat.at)}</Text>}
            {chat.asked !== '' && (
              <Text dimColor wrap="wrap">
                You: {chat.asked}
              </Text>
            )}
            {chat.helpers.length > 0 && (
              <Text dimColor>Helper agents running: {chat.helpers.length}</Text>
            )}
          </Box>
        ))}

        {done.length > 0 && heading(`Done today (${done.length})`)}
        {done.map(work => (
          <Text dimColor wrap="wrap">
            ✓ {work.stream.name} · {work.chats.map(shownName).join(', ')}
          </Text>
        ))}
      </Box>
    )
  })
}

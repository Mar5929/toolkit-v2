import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Chat, ChatState, Marks, Stream, StreamStatus } from '../types'

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
// The project's file of the owner's Done and Dismiss presses, beside the
// chats' files.
const MARKS_FILE = '_dismissed.json'

const STATUSES: readonly StreamStatus[] = [
  'needs_owner',
  'blocked',
  'in_progress',
  'done',
]
// The label and color of each status and state that gets a colored label.
const LOOK: Record<string, readonly [string, string]> = {
  needs_owner: ['Needs you', 'magenta'],
  blocked: ['Blocked', 'red'],
  in_progress: ['In progress', 'blue'],
  asking: ['Asking you', 'magenta'],
  working: ['Working', 'green'],
}
// The width of the About, Status, and Next labels beside a piece of work.
const LABEL_WIDTH = 8
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
  'small chores. Helper agents do not report. The owner switches between many chats and needs ' +
  'reminding what each piece of work is, so write for him: the name is a subject line of 8 ' +
  'words or fewer saying what he asked for, in his own plain words; "about" is one or two ' +
  'plain sentences, 30 words or fewer, saying what he asked for and why it matters to him. ' +
  'Use no ticket numbers, file names, or technical terms in either. Keep the same name for ' +
  'the whole life of the work. Give the status, and the next step and who does it in one ' +
  'short sentence. Report each piece of work separately. Do not mention the report in your ' +
  'reply.'

const board = atom({ plugin: 'workstreams', key: 'board' } as const, {
  chats: [],
  marks: { done: {}, folded: {}, streams: {}, chats: {} },
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

// The project's file of the owner's marks; empty when there is none yet.
const readMarks = async ($: EngineInterface, folder: string): Promise<Marks> => {
  const kept = await $.fs
    .read(`${folder}/${MARKS_FILE}`)
    .then(JSON.parse, () => undefined)

  return {
    done: { ...kept?.done },
    folded: { ...kept?.folded },
    streams: { ...kept?.streams },
    chats: { ...kept?.chats },
  }
}

// Reads the record of every chat in this project.
const load = async ($: EngineInterface) => {
  try {
    const config = await configDir($)
    const folder = `${config}/workstreams/${projectOf(await chatDir($))}`
    const at = await $.clock.now()
    const here = await $.session.id()
    const marks = await readMarks($, folder)
    const files = await $.fs.list(folder).catch(() => [])
    const recent = files
      .filter(
        file =>
          file.name.endsWith('.json') &&
          file.name !== MARKS_FILE &&
          at - file.mtimeMs < KEEP,
      )
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

    await update($, board, () => ({ chats, marks, note: '', here, at }))
  } catch {
    await update($, board, now => ({ ...now, note: 'Could not read the chats.' }))
  }
}

// Saves the owner's press for every chat's panel. "done" moves a piece of
// work, by its name, to the finished list. "streams" hides a piece of work,
// and "chats" hides a chat, by its id. A mark on a piece of work holds until
// the work is reported again; one on a chat, until the owner writes to it.
// "folded" folds a chat's card, by its id; a second press unfolds it.
const mark = async ($: EngineInterface, kind: keyof Marks, key: string) => {
  try {
    const config = await configDir($)
    const folder = `${config}/workstreams/${projectOf(await chatDir($))}`
    const marks = await readMarks($, folder)
    const isUnfold = kind === 'folded' && (marks.folded[key] ?? 0) > 0
    marks[kind][key] = isUnfold ? 0 : await $.clock.now()
    await $.fs.write(`${folder}/${MARKS_FILE}`, JSON.stringify(marks))
  } catch {
    // The card stays; the owner can press again.
  }

  await load($)
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
            description:
              'A subject line of 8 words or fewer: what the owner asked for, in his own plain ' +
              'words. No ticket numbers, file names, or technical terms. Use the same name ' +
              'each time for the same work.',
          },
          about: {
            type: 'string',
            description:
              'One or two plain sentences, 30 words or fewer: what the owner asked for and ' +
              'why it matters to him. No ticket numbers or file names. Send it when the work ' +
              'starts; the first one is kept.',
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
      const active = await $.clock.now()
      await change($, chat => ({
        ...chat,
        asked: said.slice(0, 120),
        name: chat.name || said.slice(0, 40),
        active,
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
    const about = clip(e.about, 300)
    await change($, chat => ({
      ...chat,
      active: at,
      streams: [
        ...chat.streams.filter(
          one =>
            !isSame(one.name, name) &&
            !(one.status === 'done' && at - one.at > DAY),
        ),
        {
          name,
          // The reminder of what the work is stays as first written.
          about: chat.streams.find(one => isSame(one.name, name))?.about || about,
          status: STATUSES.find(status => status === e.status) ?? 'in_progress',
          next: clip(e.next, 200),
          at,
        },
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
    const { chats: saved, marks, note, here, at } = await read($, board)
    const shownName = (chat: Chat) =>
      chat.id === here ? `${chat.name} (this chat)` : chat.name
    // A dismissed chat stays out until the owner writes to it, or it reports
    // work, again. Its pieces of work go with it.
    const chats = saved.filter(
      chat => (marks.chats[chat.id] ?? 0) < (chat.active ?? chat.at),
    )
    const keyOfWork = (stream: Stream) => stream.name.toLowerCase()
    // The newest report of each piece of work, from any chat.
    const newest = new Map<string, number>()

    for (const chat of chats) {
      for (const stream of chat.streams) {
        const key = keyOfWork(stream)
        newest.set(key, Math.max(newest.get(key) ?? 0, stream.at))
      }
    }

    // The owner's Done or Dismiss holds until the work is reported again.
    const isMarked = (kind: 'done' | 'streams', stream: Stream) => {
      const key = keyOfWork(stream)

      return (marks[kind][key] ?? 0) >= (newest.get(key) ?? 0)
    }
    const openOf = (chat: Chat) =>
      chat.streams
        .filter(
          stream =>
            stream.status !== 'done' &&
            !isMarked('done', stream) &&
            !isMarked('streams', stream),
        )
        .sort(
          (a, b) =>
            STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status) || b.at - a.at,
        )
    const needsOwner = (chat: Chat) =>
      chat.state === 'asking' ||
      openOf(chat).some(stream => stream.status === 'needs_owner')

    // Finished in the last day: a chat reported it done, or the owner pressed
    // Done. One line per piece of work, with every chat that had it.
    const done = new Map<string, { name: string; at: number; chats: string[] }>()

    for (const chat of chats) {
      for (const stream of chat.streams) {
        const key = keyOfWork(stream)
        const when = isMarked('done', stream)
          ? (marks.done[key] ?? 0)
          : stream.status === 'done'
            ? stream.at
            : 0

        if (when > 0 && at - when < DAY && !isMarked('streams', stream)) {
          const held = done.get(key)

          done.set(key, {
            name: stream.name,
            at: Math.max(held?.at ?? 0, when),
            chats: [...(held?.chats ?? []), shownName(chat)],
          })
        }
      }
    }

    const finished = [...done.values()]
      .sort((a, b) => b.at - a.at)
      .slice(0, DONE_SHOWN)
    // A chat named Main Orchestrator is first, then the chats that need the
    // owner, then the working ones, then the newest.
    const active = chats
      .filter(chat => at - chat.at < DAY || openOf(chat).length > 0)
      .sort(
        (a, b) =>
          Number(ORCHESTRATOR.test(b.name)) - Number(ORCHESTRATOR.test(a.name)) ||
          Number(needsOwner(b)) - Number(needsOwner(a)) ||
          STATE_ORDER.indexOf(a.state) - STATE_ORDER.indexOf(b.state) ||
          b.at - a.at,
      )
    const total = active.reduce((sum, chat) => sum + openOf(chat).length, 0)

    const chip = (kind: string) =>
      LOOK[kind] && (
        <Text bold color="white" backgroundColor={LOOK[kind][1]}>
          {` ${LOOK[kind][0]} `}
        </Text>
      )
    // One labelled line of a piece of work: a grey label, then its value.
    const line = (name: string, value: unknown) => (
      <Box>
        <Box flexShrink={0} width={LABEL_WIDTH}>
          <Text dimColor>{name}</Text>
        </Box>
        <Box flexShrink={1}>{value}</Box>
      </Box>
    )
    const count = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

    return (
      <Box flexDirection="column" paddingX={1}>
        <Box justifyContent="space-between">
          <Text dimColor>
            {count(active.length, 'chat')} · {count(total, 'workstream')}
          </Text>
          <Button key="refresh" label="Refresh" onPress={() => load($)} />
        </Box>
        {note !== '' && <Text dimColor>{note}</Text>}
        {active.length === 0 && (
          <Text dimColor wrap="wrap">
            No chat in this project has reported yet. A chat shows here after
            its next message.
          </Text>
        )}

        {active.map((chat, chatIndex) => {
          const open = openOf(chat)
          const isFolded = (marks.folded[chat.id] ?? 0) > 0
          const waiting = open.filter(stream => stream.status === 'needs_owner').length

          return (
            <Box
              flexDirection="column"
              borderStyle="round"
              borderDimColor={chat.state === 'stopped' && !needsOwner(chat)}
              borderColor={needsOwner(chat) ? LOOK.asking[1] : LOOK[chat.state]?.[1]}
              paddingX={1}
              marginTop={1}
            >
              <Box justifyContent="space-between">
                <Text dimColor>Chat</Text>
                <Button
                  key={`dismiss-chat-${chatIndex}`}
                  label="Dismiss chat"
                  dimColor
                  onPress={() => mark($, 'chats', chat.id)}
                />
              </Box>
              <Text bold wrap="wrap">
                {shownName(chat)}
              </Text>
              <Box>
                {chip(chat.state) || <Text dimColor>Stopped {ago(at - chat.at)}</Text>}
              </Box>
              {chat.asked !== '' && (
                <Text dimColor wrap="wrap">
                  You said: {chat.asked}
                </Text>
              )}
              {chat.helpers.length > 0 && (
                <Text dimColor>Helper agents running: {chat.helpers.length}</Text>
              )}

              {open.length > 0 && (
                <Box marginTop={1} columnGap={1}>
                  <Button
                    key={`fold-${chatIndex}`}
                    label={isFolded ? 'Expand' : 'Collapse'}
                    dimColor
                    onPress={() => mark($, 'folded', chat.id)}
                  />
                  <Text dimColor>
                    Workstreams ({open.length})
                    {isFolded && waiting > 0
                      ? ` · ${waiting} ${waiting === 1 ? 'needs' : 'need'} you`
                      : ''}
                  </Text>
                </Box>
              )}
              {!isFolded &&
                open.map((stream, index) => (
                  <Box flexDirection="column" marginTop={1} paddingLeft={2}>
                    <Text bold wrap="wrap">
                      {stream.name}
                    </Text>
                    {stream.about && line('About', <Text wrap="wrap">{stream.about}</Text>)}
                    {line('Status', chip(stream.status))}
                    {stream.next !== '' &&
                      line('Next', <Text wrap="wrap">{stream.next}</Text>)}
                    <Box columnGap={1}>
                      <Button
                        key={`done-${chatIndex}-${index}`}
                        label="Mark done"
                        onPress={() => mark($, 'done', keyOfWork(stream))}
                      />
                      <Button
                        key={`dismiss-${chatIndex}-${index}`}
                        label="Hide"
                        dimColor
                        onPress={() => mark($, 'streams', keyOfWork(stream))}
                      />
                    </Box>
                  </Box>
                ))}
            </Box>
          )
        })}

        {finished.length > 0 && (
          <Box marginTop={1}>
            <Text dimColor>Done today ({finished.length})</Text>
          </Box>
        )}
        {finished.map(work => (
          <Text dimColor wrap="wrap">
            ✓ {work.name} · {work.chats.join(', ')}
          </Text>
        ))}
      </Box>
    )
  })
}

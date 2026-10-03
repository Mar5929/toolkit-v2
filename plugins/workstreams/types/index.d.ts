// What a chat's agent reports about one piece of work.
export type Stream = {
  name: string
  status: StreamStatus
  next: string
  // When it was last reported, in milliseconds.
  at: number
}

export type StreamStatus = 'in_progress' | 'blocked' | 'needs_owner' | 'done'

// What the plugin sees a chat doing, at no token cost.
export type ChatState = 'working' | 'asking' | 'stopped'

// One chat's record. Each chat writes its own to a file all chats can read.
export type Chat = {
  id: string
  // The chat's folder under Claude Code's "projects" folder.
  dir: string
  // Used only when Claude Code holds no name for the chat.
  name: string
  state: ChatState
  // The start of the owner's last message to the chat.
  asked: string
  at: number
  // When the owner last wrote to the chat, or the chat last reported work.
  // A dismissed chat shows again only after this moves on.
  active?: number
  // The ids of the helper agents running now.
  helpers: string[]
  streams: Stream[]
}

// The cards the owner dismissed, and when: pieces of work by their name in
// lower case, and chats by their id. One file for the project holds it.
export type Hidden = {
  streams: Record<string, number>
  chats: Record<string, number>
}

// What the panel draws: the project's chats as last read, the dismissed
// cards, the id of the chat the panel is in, and when the read happened.
export type Board = {
  chats: Chat[]
  hidden: Hidden
  note: string
  here: string
  at: number
}

declare module 'claude-code' {
  interface PluginState {
    workstreams: { board: Board; mine: Chat }
  }
}

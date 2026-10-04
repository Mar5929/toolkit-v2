// What a chat's agent reports about one piece of work.
export type Stream = {
  name: string
  // One or two plain sentences: what the owner asked for and why.
  about?: string
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

// What the owner pressed in the panel, and when. A piece of work is named in
// lower case; a chat is named by its id. One file for the project holds it.
export type Marks = {
  // Pieces of work the owner marked Done.
  done: Record<string, number>
  // Chats whose card the owner folded; 0 when unfolded again.
  folded: Record<string, number>
  // Pieces of work the owner dismissed.
  streams: Record<string, number>
  // Chats the owner dismissed.
  chats: Record<string, number>
}

// What the panel draws: the project's chats as last read, the owner's marks,
// the id of the chat the panel is in, and when the read happened.
export type Board = {
  chats: Chat[]
  marks: Marks
  note: string
  here: string
  at: number
}

declare module 'claude-code' {
  interface PluginState {
    workstreams: { board: Board; mine: Chat }
  }
}

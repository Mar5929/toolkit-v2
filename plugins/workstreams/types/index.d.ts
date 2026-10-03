export type Item = {
  id: string
  number: number
  pageId: string
  title: string
  status: string
  needsYou: boolean
  // The chat the item belongs to; '' when none.
  chat: string
}

export type Board = { items: Item[]; note: string }

export type Helper = { id: string; name: string }

declare module 'claude-code' {
  interface PluginState {
    workstreams: { board: Board; helpers: Helper[] }
  }
}

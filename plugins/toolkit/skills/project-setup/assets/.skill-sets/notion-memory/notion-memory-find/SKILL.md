---
name: notion-memory-find
description: 'Searches this project''s Notion memory, Current state, and memories linked to work items, and cites each source, so each answer comes from what was agreed. Use when the owner asks what was decided or recorded before, or why, such as "what did we decide", "do we know", or "search Notion for it". Not for planning or design; use managing-work-items. Only for projects with Notion memory.'
---

# Notion memory: find

This project keeps its memory in Notion, in Lore's layout. Every lookup of what was recorded goes through the queries here. It reads only; saves go through notion-memory-save, clean-ups through notion-memory-refine.

## Steps

1. Read the ids from `PROJECT.md`, section "Toolkit settings", Notion block. Before any `ntn` call, see `references/notion-access.md` (sign-in; in Codex, run each `ntn` call alone, outside the sandbox).
2. Pick the query in `references/queries.md`. Where one work item stands: `tracking-work-items`.
3. Read the records fresh in this turn, including their bodies, and answer with the facts, cited (`.claude/rules/cite-recalled-knowledge.md`).

## Rules

- Leave out superseded and deprecated records unless the owner asks for history. Say when a record is proposed (not yet accepted), or when its Last verified is "unknown" or more than six months old.
- Nothing found: say "I don't know; nothing recorded covers that." Never guess.

## Gotchas

- End every `ntn api` call with `< /dev/null`, or it can wait on standard input until it times out (`references/ntn-basics.md`, "One call").
- The API's search matches page titles only. Search Title, Synopsis, and Record Key with query filters, then read bodies.
- An item's own decisions are in its Questions and Answers, not memory; memory holds only project-wide decisions.
- A row with no Record Key was not made by the toolkit: leave it out of the answer and tell the owner it exists.

## References

| File | Open it when |
| --- | --- |
| [references/queries.md](references/queries.md) | Every lookup: the exact query for each need. |
| [references/record-mapping.md](references/record-mapping.md) | Reading a column right: keys, statuses, kinds, work item links. |
| [references/ntn-basics.md](references/ntn-basics.md) | How to write an `ntn api` call, read properties and page text, and page through results. |
| [references/notion-access.md](references/notion-access.md) | Signing in, a page cannot be found, running in Codex, or any call fails. |

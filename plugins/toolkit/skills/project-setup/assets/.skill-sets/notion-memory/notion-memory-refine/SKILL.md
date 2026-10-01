---
name: notion-memory-refine
description: 'Reviews all this project''s Notion memory: merges duplicates, retires stale records, fixes work item links, prunes Current state, and proposes proven lessons as rules or skills, so memory stays small and true. Use when the owner says "refine memory" or "clean up memory", or the session-start hook says so. Not for fixing one memory; use notion-memory-save. Only for projects with Notion memory.'
---

# Notion memory: refine

This project keeps its memory in Notion, in Lore's layout. Refining changes many records, so it plans first and asks. Single saves and corrections go through notion-memory-save.

## Steps

1. Read the ids from `PROJECT.md`, section "Toolkit settings", Notion block. Before any `ntn` call, see `references/notion-access.md` (sign-in; in Codex, run each `ntn` call alone, outside the sandbox).
2. **Current state first** (`references/current-state.md` and `references/refine.md`, "Current state"): remove every line that is no longer true and tell the owner what went.
3. **List every record** (`references/refine.md`) and find: duplicates, records to supersede or retire, proposals waiting, broken or missing links to work items, stale records, lessons that should be rules, rows without a Record Key, and owner rules that repeat, contradict, or are already enforced.
4. **Show the plan**: one line per change with its reason. Wait for the owner's yes.
5. **Make the changes** he approved (`references/refine.md`), reading each record fresh first and back after.
6. **Report** in one short list, with each record's title and link.

## Rules

- Only removing Current state lines that are no longer true skips the plan.
- Never delete a record: supersede it, retire it (Status deprecated), or leave it for the owner to delete himself.
- Never rename or remove a Lore database, column, or option (`references/record-mapping.md`).
- An `event_` record is never merged into a concept.
- The owner's edits in Notion win.

## Gotchas

- End every `ntn api` call with `< /dev/null`, or it can wait on standard input until it times out (`references/ntn-basics.md`, "One call").
- Sending a relation value replaces the whole list: read it, change it, send it all back.

## References

| File | Open it when |
| --- | --- |
| [references/refine.md](references/refine.md) | Every refine: listing records, each kind of change, writing a project skill, the report. |
| [references/current-state.md](references/current-state.md) | Cleaning the Current state page. |
| [references/record-mapping.md](references/record-mapping.md) | Columns, statuses, kinds, and work item links. |
| [references/ntn-basics.md](references/ntn-basics.md) | How to write an `ntn api` call, read properties and page text, and edit page text. |
| [references/notion-access.md](references/notion-access.md) | Signing in, a page cannot be found, running in Codex, or any call fails. |

---
name: using-memory-store
description: 'Reads and writes Current State and the list of pointers as two local files in the memory folder, so every skill stores memory the same way. Use when Current State or a pointer must be read, added, changed, or removed, such as "what does memory point to". Not for deciding what a line says or what to keep; use curating-project-memory. Only for projects with local memory.'
---

# Using the memory store (local files)

This skill holds the storage: where Current State and the pointers are kept, and how to read and change them. It never decides what a line says: the skill that calls it does. `memory/AGENTS.md`, in the main checkout, gives the form of Current State and of a pointer, their limits, and what must stay true. Read that file in this turn before you write.

## Where memory is kept

| File | Holds | Written by |
| --- | --- | --- |
| `memory/CURRENT_STATE.md` | Current State | This skill only |
| `memory/MEMORY.md` | The pointers: one table, one row per pointer | This skill only |

- Both files are in the main checkout only (root `AGENTS.md`, "Project map").
- The session-start hook prints both files at the start of a session. After any change in this session, read the file again; do not use what the hook printed.
- The project folder is an Obsidian vault, so the owner reads and edits both files by hand.

## Every time

1. Find the main checkout: `MAIN="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"`. Each shell command starts fresh, so begin every command that uses `$MAIN` with that line and a `;`. It prints nothing when the project is not a Git repository: then set `MAIN` to the folder that holds the root `AGENTS.md`. Never run a command with an empty `MAIN`.
2. Read the whole file in this turn, right before you change it.
3. Change only the lines that change. Never rewrite the whole file.
4. Read the file back, and check that the change is there and nothing else changed. A failed write, or a read-back that differs: report it to the calling skill as not saved.

## Current State

- Replace a changed line. Never add a second line beside the old one.
- Keep each part in the form `memory/AGENTS.md` gives, an empty part included.
- Set the "Last updated:" line in the same edit. The session-start hook reads the date after "Last updated:", written as `YYYY-MM-DD`, to tell when the file is old.
- The file is missing: do not create it. Tell the owner, and suggest "check the setup" with `project-setup`.

## A pointer

One row of the table in `MEMORY.md`, in the form `memory/AGENTS.md` gives under "The form of a pointer". An example:

```text
| The decision on which workspace a request belongs to | DEC-004 | DECISIONS.md | 2026-10-05 | 2026-10-05 |
```

- **Find.** One record's pointer: `grep -nE '\| *DEC-004 *\|' "$MAIN/memory/MEMORY.md"`. By subject: `grep -niE 'workspace|request' "$MAIN/memory/MEMORY.md"`.
- **Add.** First check that no row has the ID, and that the record exists: a DEC in `DECISIONS.md`, an SRC in `sources/README.md`, a rule ID in `system/`, a work item with `using-work-tracker`. Then add the row as the last row of the table, with today's date in both date cells.
- **Link.** A file in the repository: its path from the project folder. A local work item: `[[WI-031]]`, which keeps working when the item's folder moves. A work item in Notion or GitHub: its web address.
- **Change.** Edit the row in place, with the date change `memory/AGENTS.md` asks for.
- **Remove.** Delete the row.

## Gotchas

- A `|` inside a cell breaks the table. Write the cell without one.
- In Codex, the sandbox can block a session in a worktree from writing to the main checkout. The write then asks for approval or fails: ask the owner to approve it. Never write memory into the worktree.

## Hand-offs

| For | Use |
| --- | --- |
| What to keep, what a pointer names, a line under "Waiting on the owner", and pruning | `curating-project-memory` |
| What a work item's line under Now says | `running-work-item-lifecycle` |
| What "Next session starts with" says | `handoff` |

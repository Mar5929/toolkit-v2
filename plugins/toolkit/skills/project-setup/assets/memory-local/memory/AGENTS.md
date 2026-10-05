# memory/: where work stopped, and pointers

This folder is the project's memory. It holds two things: where work stopped, and pointers to records. A pointer is an ID and a link. Memory never restates a fact: the fact is in the record the pointer names.

## Files

| File | What it is |
| --- | --- |
| `CURRENT_STATE.md` | What is in progress, what waits on the owner, and where the next session starts. The session-start hook prints it. |
| `MEMORY.md` | The pointers: one table, one row per pointer. `using-memory-store` writes it. The session-start hook prints it and never changes it. |

## The form of Current State

| Part | What it holds | Limit |
| --- | --- | --- |
| Last updated | The date, the source, and the person or agent. | One line |
| Now | One line per work item that has left Backlog and is not Done or Cancelled: its ID and a few words on what it is for. | 5 lines |
| Waiting on the owner | A decision or action only the owner can take that has no work item, or a save question the owner has not answered: who needs it and when to check again. An Open decision is named by its DEC-###. | 5 lines |
| Next session starts with | The work item's ID, what to read, and the next action. | 3 lines |

- Keep the whole file under 40 lines. Write "None" in an empty part.
- A line names a record by its ID. Never copy a work item's own Current state into it.
- Remove a line when it stops being true.

## The form of a pointer

One row of the table in `MEMORY.md`:

| Column | What it holds |
| --- | --- |
| What it points to | A few words that say what a later session will look for. |
| ID | The ID of the record that holds the fact: a DEC-###, an SRC-###, a rule ID such as SEC-04, or a work item ID. |
| Link | The path or the link to that record. |
| Created | The date the row was added, as YYYY-MM-DD. |
| Last changed | The date the row last changed, as YYYY-MM-DD. |

A pointer has no status. A record gets one pointer. When the record it names is replaced, change the pointer. When the record is gone, or no later session needs it, remove the pointer.

## What never goes in memory

`curating-project-memory` lists what never goes in memory. The root `AGENTS.md`, "Where information goes", gives the home of each.

## What must stay true

- Set "Last changed" to today in the same edit as any change to a row. Never change "Created".
- Every pointer names a record that exists. Check the ID before you save.
- From a worktree, read and change memory in the main checkout. Never copy it into the worktree, and never `git add` a file from this folder.
- `.claude/rules/memory-review-and-save.md` says when memory is reviewed, and what a yes or a no from the owner means for a save.
- `.claude/hooks/validate-records.mjs` checks Current State after each edit. Fix what it reports.

## Which skill to use

| Change | Use |
| --- | --- |
| Keep, correct, or forget a pointer; clean up memory; a standing instruction from the owner; which skill decides each line of Current State | `curating-project-memory` |
| Every read and every write of the two files | `using-memory-store` |

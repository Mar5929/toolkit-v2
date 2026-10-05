# memory/: where work stopped, and pointers

This folder is the project's memory. It holds two things: where work stopped, and pointers to records. A pointer is an ID and a link. Memory never restates a fact: the fact lives in the record the pointer names.

## Files

| File | What it is |
| --- | --- |
| `CURRENT_STATE.md` | What is in progress, what waits on the owner, and where the next session starts. The session-start hook prints it. |
| `MEMORY.md` | The list of pointers. The session-start hook writes it at every session start. Never edit it. |
| A pointer entry | One pointer, kept as `using-memory-store` says. |

## The form of Current State

| Part | What it holds | Limit |
| --- | --- | --- |
| Last updated | The date, the source, and the person or agent. | One line |
| Now | One line per active work item: its ID and a few words on what it is for. | 5 lines |
| Waiting on the owner | A decision or action only the owner can take that has no work item, or a save question the owner has not answered: who needs it and when to check again. An Open decision is named by its DEC-###. | 5 lines |
| Next session starts with | The work item's ID, what to read, and the next action. | 3 lines |

- Keep the whole file under 40 lines. Write "None" in an empty part.
- A line names a record by its ID. Never copy a work item's own Current state into it.
- Remove a line when it stops being true.

## The form of a pointer entry

| Field | What it holds |
| --- | --- |
| What it points to | A few words that say what a later session will look for. |
| ID | The ID of the record that holds the fact: a DEC-###, an SRC-###, a rule ID such as SEC-04, or a work item ID. |
| Link | The path or the link to that record. |
| Created | The date the entry was made, as YYYY-MM-DD. |
| Last changed | The date the entry last changed, as YYYY-MM-DD. |

A pointer entry has no status. When the record it names is replaced, change the pointer. When the record is gone, or no later session needs it, remove the pointer.

## What never goes in memory

| This | Goes here instead |
| --- | --- |
| A decision | `DECISIONS.md`, or the work item's Questions and Answers |
| A fact or rule about the system | `system/` |
| A project term | `system/glossary.md` |
| A lesson that is not proven yet | The work item's Notes |
| Where one work item stands | That item's Current state |
| The owner's instruction for how the agent works | `.claude/rules/owner-preferences.md` |
| A secret, a key, or an email address | Nowhere in memory |

## What must stay true

- Every pointer entry carries both dates. Set "Last changed" to today in the same edit as any change.
- Every pointer entry names a record that exists. Check the ID before you save.
- From a worktree, read and change memory in the main checkout. Never copy it into the worktree, and never `git add` a file from this folder.
- A save the owner said no to is kept nowhere: not here, and not in another record.

## Which skill to use

| Change | Use |
| --- | --- |
| Keep, correct, or forget a pointer; clean up memory; a standing instruction from the owner | `curating-project-memory` |
| The line for an active work item under Now | `running-work-item-lifecycle` |
| "Next session starts with", when a session ends | `handoff` |
| The read or the write itself, for all of the above | `using-memory-store` |

# memory/: what a later session needs and no other file holds

This folder is the project's local memory. It holds the project's Current State, and one memory record per subject for what no other project file holds. A memory record is one file in this folder. This guide says what each file here is, what never goes in memory, and which skill makes each change.

The folder is opened in Obsidian with the rest of the project. Git ignores the folder, so it exists only in the main checkout on this computer. The main checkout is the project's main folder: the first path that `git worktree list` prints.

## Files

| File | What it is |
| --- | --- |
| `CURRENT_STATE.md` | The project's Current State: where the project stands now, in five parts. The session-start hook prints it. |
| `MEMORY.md` | The index, with one line per current memory record. The session-start hook rebuilds it and prints it. Never edit it by hand. |
| `project_topic_template.md` | The template for a memory record. Copy it. Never write a memory record into the template itself. |
| `user_<name>.md` | Facts about the owner or another person that matter to the work, such as who is away and who covers. |
| `project_<name>.md` | One subject or area of the project or the client that fits no other file. Also a claim that nobody checked yet, and a lesson that is not proven yet. |
| `reference_<name>.md` | Where to find one thing that is hard to find again, such as a shared spreadsheet, and why to open it. |
| `event_<name>.md` | One thing that happened, or one recurring job with a row per run. |

## What never goes in memory

- A fact that the root `AGENTS.md`, section "Where information goes", keeps in a place outside memory never goes in this folder. `curating-project-memory` sends such a fact to that place.
- A memory record may name a record outside memory by its ID. The memory record never repeats what that record says.
- A secret, a key, or an email address never goes in a memory record.

## What must stay true

- `.claude/rules/memory-review-and-save.md` says when memory is reviewed, and what a yes or a no from the owner means for a save.
- `.claude/hooks/validate-records.mjs` checks the work item IDs in the project's Current State after each edit. Correct what it reports.

## Which skill to use

| Change | Use |
| --- | --- |
| Keep, correct, forget, or find something | `curating-project-memory` |
| What each part of the project's Current State holds, and its limits | `curating-project-memory` |
| Clean up memory | `curating-project-memory` |
| A standing instruction from the owner | `curating-project-memory` |
| Every read and every write of a file in this folder: the form of a memory record, its header fields, and the searches | `using-memory-store` |
| A work item's line under "Now" in `CURRENT_STATE.md` | `running-work-item-lifecycle` decides the line |

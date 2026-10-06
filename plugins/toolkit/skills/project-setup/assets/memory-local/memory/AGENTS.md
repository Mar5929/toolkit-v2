# memory/: what a later session needs and no other file holds

This folder is the project's local memory, kept by concept and opened in Obsidian with the rest of the project. Git ignores it, so it exists only in the main checkout on this computer. It holds Current State, and one file per concept for what no other project file holds.

## Files

| File | What it is |
| --- | --- |
| `CURRENT_STATE.md` | Where the project stands now: the active threads of work, what is coming up, who owes what, the standing jobs and shared files, and where the next session starts. The session-start hook prints it. |
| `MEMORY.md` | The index: one line per current memory file. The session-start hook rebuilds and prints it. Never edit it by hand. |
| `project_topic_template.md` | The blank form for a memory file. Copy it; never write a memory into it. |
| `user_<name>.md` | Facts about the owner or another person that matter to the work, such as who is away and who covers. |
| `project_<name>.md` | One concept or area of the project or the client that fits no other file; a claim nobody checked yet; a lesson not proven yet. |
| `reference_<name>.md` | Where to find one thing that is hard to find again, such as a shared spreadsheet, and why to open it. |
| `event_<name>.md` | One thing that happened, or one recurring job with a row per run. |

## What never goes in memory

A decision more than one work item needs (`DECISIONS.md`), a project term (`system/glossary.md`), how the system works or must work (`system/`, `reference/current-system/`), a to-do (a project task or a work item), an original (`sources/`), an instruction for the agent (`.claude/rules/owner-preferences.md`), a secret, a key, or an email address. The root `AGENTS.md`, "Where information goes", gives the home of each. A memory file may point to such a record by its ID. It never repeats it.

## What must stay true

- Every memory file carries the date it was created and the date it last changed. A fact that is true only for a while also carries a "check or remove by" date.
- From a worktree, read and change memory in the main checkout. Never copy it into the worktree, and never `git add` a file from this folder.
- The owner edits these files by hand. Read a file fresh before you change it, and ask before you fix a file the owner changed.
- `.claude/rules/memory-review-and-save.md` says when memory is reviewed, and what a yes or a no from the owner means for a save.
- `.claude/hooks/validate-records.mjs` checks the work item IDs in Current State after each edit. Fix what it reports.

## Which skill to use

| Change | Use |
| --- | --- |
| Keep, correct, forget, or find something; what each part of Current State holds, and its limits; clean up memory; a standing instruction from the owner | `curating-project-memory` |
| Every read and every write of a file in this folder: the form of a memory file, its header fields, and the searches | `using-memory-store` |
| A work item's line under Now in `CURRENT_STATE.md` | `running-work-item-lifecycle` decides it |

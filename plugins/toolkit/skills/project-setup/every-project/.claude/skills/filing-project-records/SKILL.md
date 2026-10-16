---
name: filing-project-records
description: 'Files received sources and records shared decisions and system rules in the places this project keeps them. Use when the project receives a source, a shared decision needs recording, or an approved fact about the system changes, including what a closing work item keeps for the project. Work-item-only records belong to managing-work-items.'
---

# Filing project records

File the sources the project receives and the project's shared decisions and system rules. The root `AGENTS.md`, "Where information goes", says what each record covers and where it lives. Anything only one work item needs belongs to `managing-work-items`.

## Which filing step to do

Open only the file in the matching row. When one message needs several steps, do them in table order.

| What happened | Open |
| --- | --- |
| The project was given a source: a transcript, meeting note, email, client document, screenshot, or export | `references/file-source.md` |
| A decision was made or a question raised that more than one work item needs, or a recorded one changed status | `references/record-decision.md` |
| An approved fact about the system changed: a rule, a term, an integration document, or a diagram | `references/update-system-doc.md` |

The memory choice supplies every file but `file-source.md`, because it decides where shared records live. When a row's file is missing, this project keeps no such record: follow the root `AGENTS.md`, "Where information goes".

## Always

- Read how the record must be written in the same turn you write it: `sources/AGENTS.md` for a source; the step's reference names the place for a decision or rule.
- Re-read a file right before changing it. The owner edits these by hand, and another session may have committed.
- Search before adding. When a record already covers the subject, change it; never two records for one subject.
- A record in the repository is saved when its change is on the default branch through `publish-docs`. Save right after writing: an ID is reserved only once its save is there. If `publish-docs` finds another session took the same ID, take the next one, change it in the record (and the source's file name), and save again.
- When this session isn't in the main checkout, read and write records only in the save worktree that `publish-docs` makes from the default branch: do its steps 1 to 3 if none exists, and continue from its step 4 to save. Your own branch can lack records the default branch holds.

## Writing a record's ID in a work item

A work item holds the record's ID, never a copy of its text: a decision or rule goes on Related items, an SRC ID under Notes, Sources. Write an ID once the step's reference reports the save is confirmed. Each step says whether it writes the ID itself with `managing-work-items` or hands it back to the `managing-work-items` step that asked.

If the save is blocked, tell the owner what waits, and have `managing-project-memory` record the wait.

For a work item that must follow a record that already exists, make no new record: add the work item's ID to the record, as the step's reference says, save, then write the record's ID in the work item.

## Finish

Read back each file you changed and each ID you wrote. When another skill asked for the step, give it each new ID and what `publish-docs` reported about the main checkout.

## Work that another skill does

| For | Use |
| --- | --- |
| Committing every change this skill makes | `publish-docs` |
| Reading a work item, writing an ID in it, anything one work item alone needs, and closing a work item | `managing-work-items` |
| The project's current state, a recorded wait, where to find a record, and a fact that fits no record here | `managing-project-memory` |
| A captured outside page, or how the system works today | `wiki/reference/AGENTS.md` |

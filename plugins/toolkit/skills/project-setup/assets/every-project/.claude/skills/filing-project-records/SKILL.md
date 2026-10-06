---
name: filing-project-records
description: 'Files the project''s lasting records, each with an ID, so later work finds them: every original the project receives, in sources/; a decision or open question more than one work item needs, in DECISIONS.md; a change to a document that describes the system, in system/. Use when the owner hands over an original, such as a transcript, a decision affects more than one work item, or a system document must be updated. Not for a decision only one item needs; use running-work-item-lifecycle.'
---

# Filing project records

This skill files the project's lasting records and gives each one an ID, so that later work on any work item can find it.

- **An original** is a document or message that the project received from someone and keeps unchanged, for example a meeting transcript, an email, a client document, a screenshot, or an export. File every original in `sources/`, whether one work item uses it, several do, or none does yet. A filed original is called a source, and its ID has the form SRC-###.
- **A decision, an open question, or a rule** is filed with this skill only when more than one work item needs it.
  - A decision or an open question goes in `DECISIONS.md`, as an entry whose ID has the form DEC-###.
  - A rule is a numbered statement of how the system must work. It goes in a document in `system/`, and its ID is a rule ID, such as SEC-04.
  - The root `AGENTS.md`, section "Where information goes", gives the filing test, which decides whether more than one work item needs something. It also lists the home of each kind of information. A home is the one file or folder where that kind of information is kept. Apply that test first.
- **A decision or a requirement that only one work item needs** is not filed with this skill. It stays in that work item: use `running-work-item-lifecycle`.

## Steps

Find what happened in the table, and open only the file for that step. When one message needs more than one step, do the steps in the order of the table.

| What happened | Step | Open |
| --- | --- | --- |
| An original arrived, such as a transcript, a meeting note, an email, a client document, a screenshot, or an export | File a source | [references/file-source.md](references/file-source.md) |
| A decision was made, or a question was raised, that more than one work item needs; the status of an entry in `DECISIONS.md` changes; or the closing step of a work item moves up a lesson about the system or the project | Record a decision | [references/record-decision.md](references/record-decision.md) |
| An approved fact about the system changes: a rule, a term, an integration document, or a diagram; or a closing work item delivered a rule | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |

The closing step is the step of `running-work-item-lifecycle` that closes a work item as Done or Cancelled. A lesson moves up when the owner says yes, at that step, to filing it for the whole project. A work item delivered a rule when it built what the rule states.

## Every time

- The form of each kind of record is given in its home, not in this skill: the comment at the top of `DECISIONS.md`, `sources/AGENTS.md`, and `system/AGENTS.md`. Read that form in this turn, before you write the record.
- When this session works in its own worktree and not in the main checkout, read and write `DECISIONS.md`, `sources/`, and `system/` only in the save worktree. The main checkout is the first path that `git worktree list` prints. The save worktree is the temporary folder that `publish-docs` makes from the default branch. Do not use the copies in your own worktree, because your branch can lack records that the default branch holds.
  - When no save worktree exists yet, do steps 1 to 3 of `publish-docs` before you read or write a record.
  - Where a step in this skill says to save, continue from step 4 of `publish-docs`.
- Read the file you will change fresh, right before the change. The owner edits these files by hand, and another session may have published a change.
- Search before you add a record. When a record already covers the subject, change that record. Never add a copy of it.
- An ID is yours only when the save that uses it is on the default branch. Save right after you write the record.
  - When `publish-docs` finds that another session's save took the same ID, take the next ID. Change the ID in your record, and in the file name when the record is an original. Then save again.
- A pointer is a record's ID, written in a work item that needs the record. Never copy the record's text into the work item. Only this skill writes these pointers, and it writes them with `using-work-tracker`. The work item template gives the place for each pointer:
  - A DEC ID or a rule ID goes on the work item's Related items line.
  - An SRC ID goes on a line under Notes, Sources, which is the Sources part of the work item's Notes.
- The time to write a pointer depends on where this project keeps its work items.
  - When work items are in Notion or GitHub, write the pointer once the save is on the default branch.
  - When work items are local files, write the pointer only after `publish-docs` reports that the main checkout holds the save. The record check looks the ID up there. The record check is the command `.claude/hooks/validate-records.mjs`.
  - When work items are local files and `publish-docs` reports that the main checkout does not hold the save, write no pointer yet.
    - Hand one line for "Waiting on" in Current State to `curating-project-memory`. Current State is the project's one page of what is true now, and "Waiting on" is its part for who owes what. The line holds the record's ID, each work item that needs the pointer, and what `publish-docs` named as blocking the update of the main checkout.
    - Tell the owner the same three things.
    - When the main checkout's files hold the record, write each pointer, and hand the removal of that line to `curating-project-memory`.
    - With Hindsight memory, follow `.claude/rules/hindsight-memory.md` in place of that skill.
- When a work item must follow a record that already exists, make no new record. Such a record is a rule in `system/`, an entry in `DECISIONS.md`, or a source. Add the work item's ID to the record's Affects line or "Used by" cell, where the record has one. Save. Then write the pointer in the work item.
- When another skill asked for the step, give that skill two things when the save is done: each new ID, and what `publish-docs` reported about the main checkout.
- Read each changed file and each pointer back after you write it. When a save fails, start your reply with "Not saved" and name the write that failed.

## Hand-offs

| For | Use |
| --- | --- |
| The commit of every change this skill makes | `publish-docs` |
| The pointer in a work item, and reading an item | `using-work-tracker` |
| Anything one work item alone needs; a requirement that a new decision changes; the closing step that says what an item delivered | `running-work-item-lifecycle` |
| A line under "Waiting on" in Current State; a memory record that says where to find a record, when the owner asks for one; a fact that fits no record here | `curating-project-memory`. With Hindsight memory, follow `.claude/rules/hindsight-memory.md` instead. |
| A captured outside page, or a record of the system as it is today | `reference/AGENTS.md` |

---
name: filing-project-records
description: 'Files the project''s lasting records, each with an ID, so later work finds them: every original the project receives, in sources/; a decision or open question more than one work item needs, in DECISIONS.md; an approved change to a system/ document. Use when the owner hands over an original, such as a transcript, a decision affects more than one work item, or a closing item changed the system. Not for a decision only one item needs; use running-work-item-lifecycle.'
---

# Filing project records

This skill files the project's lasting records.

- An original is always filed here, in `sources/`, whether one work item uses it, several do, or none does yet.
- A decision, an open question, or a rule is filed here only when more than one work item needs it. The filing test, and the home of each kind of information, are in the root `AGENTS.md`, "Where information goes". Apply that test first. A decision or a requirement that only one work item needs stays in that item: use `running-work-item-lifecycle`.

## Steps

Open the one file for the step. One message can need more than one step: do them in the order of the table.

| What happened | Step | Open |
| --- | --- | --- |
| An original arrived, such as a transcript, a meeting note, an email, a client document, a screenshot, or an export | File a source | [references/file-source.md](references/file-source.md) |
| A decision was made, or a question was raised, that more than one work item needs; the status of an entry in `DECISIONS.md` changes; or the closing step of a work item moves up a lesson about the system or the project | Record a decision | [references/record-decision.md](references/record-decision.md) |
| An approved fact about the system changes: a rule, a term, an integration document, or a diagram; or a closing work item delivered a rule | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |

## Every time

- The form of each record is in its home, never in this skill: the comment at the top of `DECISIONS.md`, `sources/AGENTS.md`, and `system/AGENTS.md`. Read the home's form in this turn before you write.
- A session whose folder is not the main checkout reads and writes `DECISIONS.md`, `sources/`, and `system/` only in the save worktree that `publish-docs` makes from the default branch, never in its own worktree: its own branch can lack records the default branch holds. When no save worktree is there, do steps 1 to 3 of `publish-docs` before you read or write a record. Where a step says to save, go on from step 4 of `publish-docs`.
- Read the file you will change fresh, right before the change. The owner edits these files by hand, and another session may have published a change.
- Search before you add. A record that already covers the subject is changed, never copied.
- An ID is yours only when its save is on the default branch. Save right after you write the record. When `publish-docs` finds that another session's save took the same ID, take the next ID, change it in your record and in the file name of an original, then save again.
- When to write a pointer to the record:
  - Work items in Notion or GitHub: once the save is on the default branch.
  - Local work items: only after `publish-docs` reports that the main checkout holds the save. The record check looks the ID up there.
  - Local work items, and `publish-docs` reports that the main checkout does not hold the save: write no pointer. Hand one line for "Waiting on the owner" in Current State to `curating-project-memory` (Hindsight memory: `.claude/rules/hindsight-memory.md`): the ID, each work item that needs the pointer, and what `publish-docs` named as blocking the update. Tell the owner the same. When the main checkout's files hold the record, write each pointer, and hand the removal of that line to the same skill.
- A pointer in a work item is the record's ID, in the place the work item template gives it: a DEC ID or a rule ID on the item's Related items line, an SRC ID on a line under Notes, Sources. Never copy the record's text into the item. Only this skill writes these pointers, with `using-work-tracker`.
- When another skill asked for the step, give it each new ID when the save is done, and what `publish-docs` reported about the main checkout.
- Read each changed file and each pointer back. A save that failed: start the reply with "Not saved", and name the write.

## Hand-offs

| For | Use |
| --- | --- |
| The commit of every change this skill makes | `publish-docs` |
| The pointer in a work item, and reading an item | `using-work-tracker` |
| Anything one work item alone needs; a requirement that a new decision changes; the closing step that says what an item delivered | `running-work-item-lifecycle` |
| A pointer in memory, when the owner asked for one; a line under "Waiting on the owner" in Current State | `curating-project-memory` (Hindsight memory: `.claude/rules/hindsight-memory.md`) |
| A captured outside page, or a record of the system as it is today | `reference/AGENTS.md` |

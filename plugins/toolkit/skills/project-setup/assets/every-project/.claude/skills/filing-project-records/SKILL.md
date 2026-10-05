---
name: filing-project-records
description: 'Files what more than one work item needs: records a decision or open question in DECISIONS.md, files an original in sources/, and applies an approved change to a system/ document, each with its ID and a pointer in the work item. Use when a decision or question reaches past one item ("we decided", "let''s go with"), the owner hands over a transcript or document, or a closing item changed the system. Not for one item''s own requirements or decisions; use running-work-item-lifecycle.'
---

# Filing project records

This skill files what more than one work item needs. The filing test, and the home of each kind of information, are in the root `AGENTS.md`, "Where information goes". Apply that test first. What only one work item needs stays in that item: use `running-work-item-lifecycle`.

## Steps

Open the one file for the step. One message can need more than one step: do them in the order of the table.

| What happened | Step | Open |
| --- | --- | --- |
| An original arrived: a transcript, a meeting note, an email, a client document, a screenshot, an export | File a source | [references/file-source.md](references/file-source.md) |
| A decision was made, or a question was raised, that more than one work item needs; the status of an entry in `DECISIONS.md` changes; or the closing step of a work item moves up a lesson about the system or the project | Record a decision | [references/record-decision.md](references/record-decision.md) |
| An approved fact about the system changes: a rule, a term, an integration, a diagram; or a closing work item delivered a rule | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |

## Every time

- The form of each record is in its home, never in this skill: the comment at the top of `DECISIONS.md`, `sources/AGENTS.md`, and `system/AGENTS.md`. Read the home's form in this turn before you write.
- Read the file you will change fresh, right before the change. The owner edits these files by hand, and another session may have published a change.
- Search before you add. A record that already covers the subject is changed, never copied.
- An ID is yours only when its save is on the default branch. Save right after you write the record, and write a pointer only after the save. When `publish-docs` finds that another session's save took the same ID, take the next ID, change it in your record and in the file name of an original, then save again.
- A pointer in a work item is the record's ID, in the place the work item form gives it: a DEC ID or a rule ID on the item's Related items line, an SRC ID on a line under Notes, Sources. Never copy the record's text into the item. Write every pointer with `using-work-tracker`.
- When another skill asked for the step, give it each new ID when the save is done.
- Read each changed file and each pointer back. A save that failed: start the reply with "Not saved", and name the write.

## Hand-offs

| For | Use |
| --- | --- |
| The commit of every change this skill makes | `publish-docs` |
| The pointer in a work item, and reading an item | `using-work-tracker` |
| Anything one work item alone needs; a requirement that a new decision changes; the closing step that says what an item delivered | `running-work-item-lifecycle` |
| A pointer in memory, when the owner asked to remember the record | `curating-project-memory` (Hindsight memory: `.claude/rules/hindsight-memory.md`) |
| A captured outside page, or a record of the system as it is today | `reference/AGENTS.md` |

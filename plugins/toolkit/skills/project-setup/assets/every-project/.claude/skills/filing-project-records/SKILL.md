---
name: filing-project-records
description: 'Files sources the project receives in sources/, decisions and open questions that more than one work item needs in DECISIONS.md, and changes to documents about system rules in system/. Each record gets an ID so later work can find it. Use when the owner gives the project a source, a shared decision or question needs recording, or a system document needs updating. For a decision that only one work item needs, use managing-work-items.'
---

# Filing project records

Use this skill to file records that later work may need. File the three kinds of record as follows:

1. Save every source the project receives from someone else in `sources/`, unchanged, with an ID like SRC-001. Sources include meeting transcripts, emails, client documents, and screenshots. File a source even when only one work item uses it, or none does yet.
2. Record decisions and open questions that more than one work item needs in `DECISIONS.md`. Give each entry an ID like DEC-001.
3. Record rules about how the system must work that more than one work item needs in a document in `system/`. Give each rule an ID like SEC-04.

If only one work item needs a decision or a requirement, do not save it here. It stays in that work item: use `managing-work-items`.

Before you save a decision, an open question, or a rule, check that more than one work item needs it. The root `AGENTS.md`, section "Where information goes", gives the test for that, and lists where every kind of information is kept.

In this skill, a record is one saved source, one entry in `DECISIONS.md`, or one rule in `system/`. To save a record is to commit the change to the default branch with `publish-docs`.

## Which filing step to do

Find what happened in the table, and open only the file in that row. When one message needs more than one step, do the steps in the order of the table.

| What happened | Step | Open |
| --- | --- | --- |
| The project was given a source, such as a transcript, a meeting note, an email, a client document, a screenshot, or an export | File a source | [references/file-source.md](references/file-source.md) |
| A decision was made, or a question was raised, that more than one work item needs | Record a decision | [references/record-decision.md](references/record-decision.md) |
| The status of an entry in `DECISIONS.md` changes | Record a decision | [references/record-decision.md](references/record-decision.md) |
| `managing-work-items` is closing a work item, and the owner agreed to keep, for the whole project, a lesson from it about the system or the project | Record a decision | [references/record-decision.md](references/record-decision.md) |
| An approved fact about the system changes: a rule, a term, an integration document, or a diagram | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |
| `managing-work-items` is closing a work item, and the work item built what a rule says | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |

The rest of this file applies to all three steps.

## Before you write a record

- Read how the record must be written, in the same turn in which you write it. This skill does not show the form of a record. The place where the record is kept shows it:
  - for a decision or an open question, the comment at the top of `DECISIONS.md`;
  - for a source, `sources/AGENTS.md`;
  - for a rule or anything else in `system/`, `system/AGENTS.md`.
- Read the file you will change again, right before you change it. The owner edits these files by hand, and another session may have committed a change.
- Search before you add a record. When a record already covers the subject, change that record. Never add a second record for the same subject.

## When this session works in its own worktree

A worktree is a separate folder with its own branch. The main checkout is the project's main folder: the first path that `git worktree list` prints.

When this session's folder is not the main checkout, read and write `DECISIONS.md`, `sources/`, and `system/` only in the save worktree. The save worktree is the folder that `publish-docs` makes from the default branch. Never read or write them in the session's own worktree, because its branch can lack records that the default branch holds.

- When no save worktree exists yet, do steps 1 to 3 of `publish-docs` before you read or write a record.
- Where a step in this skill says to save, continue from step 4 of `publish-docs`.

## Saving a record

- Save right after you write the record. The record's ID is yours only when its save is on the default branch.
- When `publish-docs` finds that another session's save took the same ID, take the next ID. Change the ID in your record, and in the file name when the record is a source. Then save again.

## Writing a record's ID in a work item

A work item that needs a record holds the record's ID, and never a copy of the record's text. An ID goes into a work item only after this skill has saved the record, or has saved the work item's ID on a record that already exists. Each step of this skill says who writes the ID: the step writes it with `managing-work-items`, or the step gives it to the step of `managing-work-items` that asked for the record, and that step writes it.

### Where the ID goes

The work item template gives the place for each ID:

- A DEC ID or a rule ID goes on the work item's Related items line.
- An SRC ID goes on a line under Notes, Sources.

### When to write the ID

The time depends on where the project keeps its work items.

- When work items are in Notion or GitHub, write the ID once the save is on the default branch.
- When work items are local files, write the ID only after `publish-docs` reports that the main checkout holds the save. The command that checks the records, `.claude/hooks/validate-records.mjs`, looks the ID up there.
- When work items are local files and `publish-docs` reports that the main checkout does not hold the save, write no ID in the work item. Do this in its place:
  - Give `managing-project-memory` one line for "Waiting on" in the project's Current State. The project's Current State is the project's one short page of what is true now, and "Waiting on" is one of its parts. The line holds the record's ID, each work item that needs the ID, and what `publish-docs` named as blocking the update.
  - Tell the owner the same.
  - When the main checkout's files hold the record, write the ID in each work item, and ask `managing-project-memory` to remove that line.
  - In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in place of `managing-project-memory`.

### A work item that must follow a record that already exists

The record can be a rule in `system/`, an entry in `DECISIONS.md`, or a source. Make no new record. Do these three things in this order:

1. Add the work item's ID to the record's Affects line or "Used by" cell, where the record has one. An entry in `DECISIONS.md` has an Affects line, and a row in `sources/README.md` has a "Used by" cell.
2. Save.
3. Write the record's ID in the work item.

## Check what you wrote, and report

- Read back each file you changed and each ID you wrote in a work item.
- When a save fails, start your reply with "Not saved", and name the write that failed.
- When another skill asked for the step, give that skill each new ID when the save is done, and tell it what `publish-docs` reported about the main checkout.

## Work that another skill does

| For | Use |
| --- | --- |
| The commit of every change this skill makes | `publish-docs` |
| Writing a record's ID in a work item, and reading a work item | `managing-work-items` |
| Anything that one work item alone needs; a requirement that a new decision changes; the closing of a work item, which says what the work item built | `managing-work-items` |
| A line under "Waiting on" in the project's Current State; a memory record that says where to find a record, when the owner asks for one; a fact that fits no record here | `managing-project-memory`. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in its place. |
| A captured outside page, or a record of the system as it is today | `reference/AGENTS.md` |

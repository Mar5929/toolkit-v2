---
name: filing-project-records
description: 'Files received sources and records shared decisions and system rules in the places this project keeps them. Use when the project receives a source, a shared decision needs recording, or an approved fact about the system changes. Work-item-only records belong to managing-work-items.'
---

# Filing project records

Use this skill to file records that later work may need:

1. Save every source the project receives from someone else in `sources/`, unchanged, with an ID like SRC-001. Sources include meeting transcripts, emails, client documents, and screenshots. File a source even when only one work item uses it, or none does yet.
2. Record decisions and open questions that more than one work item needs. `references/record-decision.md` says where this project keeps them.
3. Record rules about how the system must work that more than one work item needs. `references/update-system-doc.md` says where this project keeps them.

If only one work item needs a decision or a requirement, do not save it here. It stays in that work item: use `managing-work-items`.

Before you save a decision, an open question, or a rule, check that more than one work item needs it. The root `AGENTS.md`, section "Where information goes", gives the test for that, and lists where every kind of information is kept.

In this skill, a record is one saved source, or one decision or rule that this skill keeps. A record in the repository is saved when its change is committed to the default branch with `publish-docs`. The rest of this file applies to records in the repository; a reference that keeps its records elsewhere says how it saves them.

## Which filing step to do

Find what happened in the table, and open only the file in that row. When one message needs more than one step, do the steps in the order of the table.

| What happened | Step | Open |
| --- | --- | --- |
| The project was given a source, such as a transcript, a meeting note, an email, a client document, a screenshot, or an export | File a source | [references/file-source.md](references/file-source.md) |
| A decision was made, or a question was raised, that more than one work item needs | Record a decision | [references/record-decision.md](references/record-decision.md) |
| The status of a recorded decision or open question changes | Record a decision | [references/record-decision.md](references/record-decision.md) |
| `managing-work-items` is closing a work item, and the owner agreed to keep, for the whole project, a lesson from it about the system or the project | Record a decision | [references/record-decision.md](references/record-decision.md) |
| An approved fact about the system changes: a rule, a term, an integration document, or a diagram | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |
| `managing-work-items` is closing a work item, and the work item built what a rule says | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |

The rest of this file applies to all three steps.

## Before you write a record

- Read how the record must be written, in the same turn in which you write it. This skill does not show the form of a record. For a source, `sources/AGENTS.md` shows it. For a decision or a rule, the reference of its step names the place that shows it.
- Read the file you will change again, right before you change it. The owner edits these files by hand, and another session may have committed a change.
- Search before you add a record. When a record already covers the subject, change that record. Never add a second record for the same subject.

## When this session works in its own worktree

A worktree is a separate folder with its own branch. The main checkout is the project's main folder: the first path that `git worktree list` prints.

When this session's folder is not the main checkout, read and write the project's records in the repository only in the save worktree. The save worktree is the folder that `publish-docs` makes from the default branch. Never read or write them in the session's own worktree, because its branch can lack records that the default branch holds.

- When no save worktree exists yet, do steps 1 to 3 of `publish-docs` before you read or write a record.
- Where a step in this skill says to save, continue from step 4 of `publish-docs`.

## Saving a record

- Save right after you write the record. The record's ID is yours only when its save is on the default branch.
- When `publish-docs` finds that another session's save took the same ID, take the next ID. Change the ID in your record, and in the file name when the record is a source. Then save again.

## Writing a record's ID in a work item

A work item that needs a record holds the record's ID, and never a copy of the record's text. An ID goes into a work item only after this skill has saved the record, or has saved the work item's ID on a record that already exists. Each step of this skill says who writes the ID: the step writes it with `managing-work-items`, or the step gives it to the step of `managing-work-items` that asked for the record, and that step writes it.

### Where the ID goes

The work item template gives the place for each ID:

- The ID or link of a decision or a rule goes on the work item's Related items line.
- An SRC ID goes on a line under Notes, Sources.

### When to write the ID

`managing-work-items/references/work-tracker.md`, section "Writing a record's ID in a work item", says when the ID may be written. When it says to wait, write no ID in the work item. Do this in its place:

- Record the wait as `managing-work-items/references/project-memory-steps.md`, section "Recording a wait", says. Name the record's ID, each work item that needs the ID, and what `publish-docs` named as blocking the update.
- Tell the owner the same.
- When the record may be written, write the ID in each work item, and remove the recorded wait.

### A work item that must follow a record that already exists

The record can be a rule, a decision, or a source. Make no new record. Do these three things in this order:

1. Add the work item's ID to the record's Affects line or "Used by" cell, where the record has one. A row in `sources/INDEX.md` has a "Used by" cell; the reference of a decision or a rule says where it lists the work items it affects.
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
| The project's current state; a memory record that says where to find a record, when the owner asks for one; a fact that fits no record here | Project memory, as the root `AGENTS.md` says |
| A captured outside page, or a record of the system as it is today | `wiki/reference/AGENTS.md` |

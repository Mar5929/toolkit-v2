# Project memory steps for managing-work-items: local memory

This file holds the steps of `managing-work-items` that depend on where this project keeps its memory. This project keeps memory in local files in `memory/`, with `managing-project-memory`. It keeps shared decisions in `DECISIONS.md` and the approved description of the system in `wiki/product-wiki/`. `references/closing.md` and `references/lifecycle-rules.md` say when to open each section.

## Filling the Moved up line

Follow [repository-record-closing.md](repository-record-closing.md) to file the records and fill this line.

## Reviewing a closing lesson

Search and read relevant memory with `managing-project-memory`.

## Keeping a closing lesson

For an approved standing instruction, give the lesson to `managing-project-memory`, which writes it in `.claude/rules/owner-preferences.md`. For a lesson kept as not proven, give that skill its unproven status, work item ID, and dates seen.

## When a work item closes

Update the project's Current State, which is the project's one short page of what is true now, with `managing-project-memory`.

- Remove the work item's line under Now.
- Ask `managing-project-memory` to remove the rest: each line under "Coming up" or "Waiting on" that is about this work item, and a "Next session starts with" line that names it. The reference file on the project's Current State in that skill, section "Removing what is no longer true", gives the steps.

## Keeping active work current

The project's Current State holds one line for an active work item.

- Decide the line in this skill, in the form that the project's memory gives for a line under Now. Now is one of the parts of the project's Current State.
- Add, change, or remove the line with `managing-project-memory`.
- In the same write, or in the turn in which the session starts work on a work item whose line is already there, make "Next session starts with" name the work item: its ID and "read its Current state".

## Recording a wait for a record or a decision

Use this section when something the project needs is waiting, such as a record's ID that cannot be written in a work item yet, or an Open entry in `DECISIONS.md` that no work item waits on.

- Give `managing-project-memory` one line for "Waiting on" in the project's Current State. The project's Current State is the project's one short page of what is true now, and "Waiting on" is one of its parts. The line names what waits, each work item it affects, and who or what it waits on.
- When the wait ends, ask `managing-project-memory` to remove the line.

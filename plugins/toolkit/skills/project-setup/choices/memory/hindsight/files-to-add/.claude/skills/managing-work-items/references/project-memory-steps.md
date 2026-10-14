# Project memory steps for managing-work-items: Hindsight memory

This file holds the steps of `managing-work-items` that depend on where this project keeps its memory. This project keeps lasting memory in its Hindsight bank, under `.claude/rules/hindsight-memory.md`, and keeps current work in the work tracker and project records. It keeps shared decisions in `DECISIONS.md` and the approved description of the system in `wiki/product-wiki/`. `references/closing.md` and `references/lifecycle-rules.md` say when to open each section.

## Filling the Moved up line

Follow [repository-record-closing.md](repository-record-closing.md) to file the records and fill this line.

## Reviewing a closing lesson

Search and read relevant memory under `.claude/rules/hindsight-memory.md`.

## Keeping a closing lesson

Write an approved standing instruction in `owner-preferences.md` or its applicable rule, preserving approval, source, and date. Hindsight may keep qualifying history or a pointer under its rule. For a lesson kept as not proven, preserve its unproven status, work item, and dates under that rule; keep lessons that do not qualify for lasting memory in the work item.

## When a work item closes

Keep the closed item and any remaining follow-up current in the tracker, and review lasting knowledge under `.claude/rules/hindsight-memory.md`.

## Keeping active work current

Keep active work and next actions in the work tracker. Follow `.claude/rules/hindsight-memory.md` for lasting knowledge.

## Recording a wait for a record or a decision

Use this section when something the project needs is waiting, such as a record's ID that cannot be written in a work item yet, or an Open entry in `DECISIONS.md` that no work item waits on.

- For a record's ID, use `managing-work-items` to write a blocker note in the affected work items explaining the pending publication and next action. Leave authoritative record-link fields unchanged until the main checkout holds the save.
- For anything else, use the tracker for any follow-up task, and `.claude/rules/hindsight-memory.md` for qualifying lasting knowledge.
- When the wait ends, remove the note or close the task.

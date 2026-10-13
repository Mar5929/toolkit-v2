# Project memory steps for managing-work-items: Notion memory

This file holds the steps of `managing-work-items` that depend on where this project keeps its memory. This project keeps memory, shared decisions, system documentation, and project terms in its Notion Project Wiki. Coding agents capture changes in Wiki Inbox with `managing-project-memory`, and the librarian (`maintaining-notion-wiki`) files them. `references/closing.md` and `references/lifecycle-rules.md` say when to open each section.

## Filling the Moved up line

- Review the work item's decisions, finalized design, verified implementation evidence, changed terms and useful lessons. Use `managing-project-memory` to check existing records and capture supported reusable outcomes with their sources and approval evidence.
- Read back each capture. Capture and filing need no separate promotion approval. New decisions, changed requirements and harness instructions still require their applicable approvals.
- Fill Moved up with the verified capture links and their actual processing state, or write "Nothing: <the reason>." Name filed destinations only when filing has been verified. Add a Recent History row recording the capture check.
- Continue closure after verified capture; routine librarian filing may finish later. Use an on-demand pass when subsequent work needs reconciled information.
- On the short path for a small work item, verify the captures before you ask the closing question.

## When a work item closes

The librarian owns Current state updates. Capture the closure checkpoint with `managing-project-memory`. When closure changes the project's focus or resumption context, capture that checkpoint instead of editing Current state directly.

## Active work

Capture a checkpoint with `managing-project-memory` when active work or resumption context changes. `managing-project-memory` verifies the capture and the librarian reconciles Current state. Do not write the derived page directly.

## Recording a wait

Use this section when something the project needs is waiting, such as a record's ID that cannot be written in a work item yet.

- Capture a "Waiting on" checkpoint with `managing-project-memory`. It names what waits, each work item it affects, and who or what it waits on. The librarian reconciles Current state.
- When the wait ends, capture that too.

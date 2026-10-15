---
name: managing-project-memory
description: 'Finds project knowledge in the Notion Project Wiki and captures changes in Wiki Inbox. Use for remembered context, corrections, forgetting, work-item outcomes, and handoff checkpoints. Other skills call it when work starts, changes, or closes. Filing is done by maintaining-notion-wiki; work items belong to managing-work-items.'
---

# Managing project memory (Notion)

Coding agents read the Project Wiki and capture changes in Wiki Inbox. The librarian (`maintaining-notion-wiki`) files captures into their destinations, so agents never edit the wiki pages directly. IDs are under "Notion memory" in `PROJECT.md`; use `using-notion-cli` for every call.

## Always

- Capture in the turn the change happens. A capture records what changed; it doesn't make it true or approve it, and existing approval rules still apply.
- Search existing records and pending captures before capturing, and link rather than repeat.
- Every capture carries its sources, dates, uncertainty, affected work items, and any approval evidence.
- Never capture secrets or anything that could compromise security.
- A saved capture is not filed. Say "captured, pending filing" until the librarian has filed it.

## Reading

1. Pick the destination in `references/wiki-destinations.md` and search it within this project. Read whole matching records, with their status, dates, and replacement links.
2. When recent work matters, also read pending captures and current work items.
3. Verify changeable claims before relying on them. Before saying nothing is recorded, search the other destinations and linked work items.
4. If work needs reconciled information now, run `maintaining-notion-wiki` on demand.

## When another skill reports work

The librarian owns Current state, so every report becomes a capture:

- **Work starts, or its next step or wait changes:** capture a checkpoint (the item, its focus, what it waits on, and where to resume) when it changes the project's focus.
- **Something waits on a record or decision no item holds:** capture a "Waiting on" checkpoint naming what waits, the items affected, and on whom; capture again when it ends.
- **An item closes:** capture a closure checkpoint only. The item's reusable outcomes are filed through `filing-project-records` while it closes, so do not capture them again.
- **A handoff:** capture the session's focus and resume point, and list pending capture links in the handoff prompt as not yet filed. Ask for an on-demand librarian pass if the next task needs reconciled documentation, without waiting for it.

## Corrections and forgetting

Capture the correction, then run `maintaining-notion-wiki` on demand and verify the result before reporting it done. When forgetting, never copy the forgotten content into another record or note.

## Where to look

| When you need to… | Read |
| --- | --- |
| Know which destination holds what, and how to read it | `references/wiki-destinations.md` |
| Capture a change, or check what's captured but not yet filed | `references/wiki-inbox.md` |

---
name: managing-project-memory
description: 'Finds project knowledge in the Notion Project Wiki, keeps the Current state page current, and captures other changes in Wiki Inbox. Use for remembered context, corrections, forgetting, events and recurring-job runs, work-item outcomes, and handoffs. Other skills call it when work starts, changes, or closes. Filing is done by maintaining-notion-wiki; work items belong to managing-work-items.'
---

# Managing project memory (Notion)

Coding agents read the Project Wiki, keep the Current state page current, and capture other changes in Wiki Inbox. The librarian (`maintaining-notion-wiki`) files captures into Long-Term Memory, Terminology Glossary, and Product Wiki, so agents never edit those directly. IDs are under "Notion memory" in `PROJECT.md`; use `using-notion-cli` for every call.

When work needs reconciled information now, start an on-demand librarian run as the project context page's "On-demand invocation" says. Never run the librarian's steps yourself, because the librarian is the only writer to those destinations.

## Always

- Capture in the turn the change happens. A capture records what changed; it doesn't make it true or approve it, and existing approval rules still apply.
- Every capture carries its sources, dates, uncertainty, affected work items, and any approval evidence.
- Never capture secrets or anything that could compromise security.
- A saved capture is not filed. Say "captured, pending filing" until the librarian has filed it.

## Reading

1. Pick the destination in `references/wiki-destinations.md` and search it within this project. Read whole matching records, with their status, dates, and replacement links.
2. When knowledge captured but not yet filed matters, also read pending captures.
3. Verify changeable claims before relying on them. Before saying nothing is recorded, search the other destinations and linked work items.

## When another skill reports work

Update Current state as `references/current-state.md` says. Also:

- **An item closes:** capture each lesson `closing.md` sends here, with its item, the dates it was seen, and whether it is proven. The item's decisions, rules, and terms are filed through `filing-project-records`, so do not capture them again.
- **Something happened, or a recurring job ran:** capture it for Long-Term Memory with its date, what happened, the result, and where the output is. Skip it when a work item, task, commit, or filed record already shows it.
- **A handoff:** list pending capture links in the handoff prompt as not yet filed. If the next task needs reconciled documentation, start an on-demand librarian run without waiting for it.

## Corrections and forgetting

Capture the correction, then start an on-demand librarian run and verify the result before reporting it done. When forgetting, never copy the forgotten content into another record or note.

## Where to look

| When you need to… | Read |
| --- | --- |
| Know which destination holds what, and how to read it | `references/wiki-destinations.md` |
| Keep Current state current | `references/current-state.md` |
| Capture a change, or check what's captured but not yet filed | `references/wiki-inbox.md` |

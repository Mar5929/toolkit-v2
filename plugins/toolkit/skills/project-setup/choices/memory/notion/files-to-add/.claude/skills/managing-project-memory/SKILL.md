---
name: managing-project-memory
description: 'Finds Notion project knowledge and captures useful changes in Wiki Inbox. Use for remembered context, wiki updates, corrections, work-item outcomes or handoff. Librarian filing uses maintaining-notion-wiki; work tracking uses managing-work-items.'
---

# Managing Notion project memory

Keep useful project knowledge discoverable. Coding agents read the Project Wiki and capture changes in Wiki Inbox; `maintaining-notion-wiki` reconciles destinations. For on-demand filing, use the configured Librarian schedule invocation and published Librarian processing skill link; coordinate with any active run.

## Read project knowledge

1. Read the Notion memory identifiers in `PROJECT.md`. Choose the destination below and open its reference.
2. Search that destination within this project. Read matching records and relevant sources, including status, dates and replacement links.
3. When recent work matters, read relevant pending inbox captures and current work items. Use `maintaining-notion-wiki` on demand when work needs reconciled information.
4. Verify changeable claims against current evidence. Before saying nothing is recorded, search the other relevant destinations and linked work items.

## Capture changes

1. Keep the work item and its evidence current. Capture useful new context, corrections and reusable outcomes during work, closure and handoff, using [Wiki Inbox](references/wiki-inbox.md).
2. Link existing documentation or captures instead of repeating them. Include sources, dates, uncertainty and existing approval evidence. Capture and filing need no separate approval. A capture does not establish truth or approve its content; new decisions, requirements, and harness changes retain their applicable approval rules.
3. Read the capture back. Work may close after capture is verified; mark publication complete only after the librarian verifies filing.
4. For an explicit correction or forgetting request, run `maintaining-notion-wiki` on demand and verify the requested result before reporting completion.

Exclude secrets and information whose storage could compromise system, product or project security. Ordinary contact details may qualify. Existing approval rules govern new decisions and harness changes; wiki filing grants no new authority.

## Destination references

| Reference | Open it when |
| --- | --- |
| [Wiki Inbox](references/wiki-inbox.md) | You capture a change or check recent information not yet filed. |
| [Current state](references/current-state.md) | You need priorities, blockers or resumption context. |
| [Long-Term Memory](references/long-term-memory.md) | You need lasting context, non-product decisions or lessons. |
| [Terminology Glossary](references/terminology-glossary.md) | You need established meanings, aliases or naming history. |
| [Product Wiki](references/product-wiki.md) | You need finalized behavior, architecture or product decisions. |

`managing-work-items` owns active requirements, working designs, tasks and approvals. `filing-project-records` owns source filing and routes finalized project records to their configured home.

---
name: tracking-work-items
description: 'Stores and finds work items in the project''s Notion databases for managing-work-items, so every read and save lands in the right property or page section. Use when looking up or saving a work item, phase, task, question, comment, or file, such as "show me WI-31" or "add a task to phase 2". Only for projects that track work in Notion.'
---

# Tracking work items in Notion

This project keeps its work items in Notion. This skill says where each thing is stored in Notion and how to read and save it. It never decides what to save or when.

## Where things are stored

- Each project has three databases: **Work Items**, **Phases**, **Tasks**. `references/database-layout.md` shows how the project looks in Notion and lists every property.
- A **phase** is a row of Phases, never a work item. A **task** is a row of Tasks, linked to its item and its phase.
- A sub-item is a work item whose "Parent item" names the item above it.
- Every item's page is made from the Work Items database's default template, the work item template. `references/page-layout.md` lists its sections. Five are text: Overview, Recent History, Requirements, Questions and Answers, Notes. Four are live views of other databases: Roadmap, Sub-items, Tasks, Linked memory.
- The Solution Design page is a child page of the item.
- The ids of the databases and pages are in `PROJECT.md`, section "Toolkit settings", Notion block. Never search the workspace for them.

## Steps for any look-up or save

1. Read the ids from `PROJECT.md`. Before your first Notion read or write in a session, whatever tool you use, open `using-notion-cli`.
2. Read what you will look at or change, fresh in this turn. The owner edits in Notion, so never answer from an earlier read.
3. Make the change with the section named in the Files table below.
4. Read the changed page or row back. Notion saves all of an `update_content` call or none of it, so a call it refused changed nothing.

## Create an item

1. Count the levels by following "Parent item" up from the parent. When the parent is already the third level, stop: the work becomes a task, as `managing-work-items` says.
2. Create the page from the default template, with the properties `managing-work-items` gave you (`references/database-layout.md`, "Creating an item").
3. Wait until the template's content is there (`using-notion-cli`, "Waiting for a template").
4. Fill the text with one `update_content` call (`references/page-layout.md`, "Filling a new item").
5. Copy Next action into the Next action property.
6. When the item has a parent, add a Recent History row on the parent's page: "Sub-item WI-32 created: <title>."

## Gotchas

- Never replace a work item page's whole text (for example with `replace_content`): the views in it block it, and it would rewrite the owner's edits.
- Notion lists the work item template as a row of Work Items, with an empty title and usually ID 1. Leave out rows with an empty title in every Work Items query, except "Cards with no title" in `references/searching.md`.
- Leave out archived items unless the owner asks for them.
- The Roadmap, Sub-items, and Tasks sections of a page are views, shown in the page text only as `<database …>` lines. Read their rows with the tree queries in `references/searching.md`.
- Attach an uploaded file within one hour of uploading it. After that the upload expires.
- Never delete a page, row, phase, or task. Take it out of view instead: set a phase to Cancelled, or tick an item's Archived. When the owner wants it deleted, ask him to delete it himself in Notion.
- Never add work to a template: the three project templates in the owner's Projects database, or the Work Items database's work item template. Every copy takes it along.
- When the owner drags a card on the Board, only its Status changes, so State and Status no longer match.

## Hand-offs

| For | Use |
| --- | --- |
| Deciding what to save and when | `managing-work-items` |
| A State and Status that no longer match | `managing-work-items` |
| Every Notion read or write: sign-in, Codex, the shape of each call, and errors | `using-notion-cli` |
| Moving work items to another tracker | `project-setup` |
| Restoring a missing database template | `project-setup` |

## Files

| File | Open it when |
| --- | --- |
| [references/database-layout.md](references/database-layout.md) | Checking what a property holds, or creating or changing an item's properties, phases, tasks, links, tags, or files. |
| [references/page-layout.md](references/page-layout.md) | Changing an item's text: Current state, Recent History, Questions and Answers, or the Solution Design page; or adding a comment. |
| [references/searching.md](references/searching.md) | Finding or reading items: one item, the board, what waits on the owner, a parent's tree, a search, a saved source file, cards with no title. |
| [assets/schema/01-work-items-database.json](assets/schema/01-work-items-database.json), [02-phases-database.json](assets/schema/02-phases-database.json), [03-tasks-database.json](assets/schema/03-tasks-database.json) | Creating the databases, or adding a missing property. |
| [assets/schema/04-work-items-relations.json](assets/schema/04-work-items-relations.json), [05-phases-relations.json](assets/schema/05-phases-relations.json), [06-tasks-relations.json](assets/schema/06-tasks-relations.json), [07-work-items-rollup.json](assets/schema/07-work-items-rollup.json), [07b-work-items-phase-column.json](assets/schema/07b-work-items-phase-column.json) | Creating the relations, or adding a missing one. |
| [assets/schema/10-view-board.json](assets/schema/10-view-board.json), [11-view-by-state.json](assets/schema/11-view-by-state.json), [12-view-all-items.json](assets/schema/12-view-all-items.json), [13-view-roadmap.json](assets/schema/13-view-roadmap.json), [14-view-waiting-on-owner.json](assets/schema/14-view-waiting-on-owner.json), [15-view-phases-by-item.json](assets/schema/15-view-phases-by-item.json), [16-view-open-tasks.json](assets/schema/16-view-open-tasks.json), [17-view-top-level.json](assets/schema/17-view-top-level.json) | Creating the database views, or adding a missing one. |
| [assets/schema/20-item-view-phases.json](assets/schema/20-item-view-phases.json), [21-item-view-sub-items.json](assets/schema/21-item-view-sub-items.json), [22-item-view-tasks.json](assets/schema/22-item-view-tasks.json), [23-item-view-linked-memory.json](assets/schema/23-item-view-linked-memory.json) | Creating the views inside the work item template. |

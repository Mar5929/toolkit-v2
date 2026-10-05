---
name: using-memory-store
description: 'Reads and writes Current State and pointers in Notion, on the Current state page and in the Memories database of Lore''s layout, so every skill stores memory the same way. Use when Current State or a pointer must be read, added, changed, or removed, for example a line that another skill hands over, or "what does memory point to". Not for deciding what a line says or what to keep; use curating-project-memory. Only for projects with Notion memory.'
---

# Using the memory store (Notion)

This skill holds the storage: where Current State and the pointers are kept in Notion, and how to read and change them. It never decides what a line says: the skill that calls it does.

## Where memory is kept

- **Current state** is one page beside the Memory page: `references/current-state-page.md` gives its form and how to change it.
- **A pointer** is one page of the **Memories** database. Its Title says what it points to, its Record Key is the ID of the record it names, and its Synopsis is the link. `references/database-layout.md` gives every column.
- Memories is one of five databases on the project's Memory page: **Projects**, **Topics**, **Memories**, **Entities**, **Facts**. They are Lore's databases (Lore is Notion's open-source memory tool), and Lore finds them and their columns by their exact names. **Projects** holds one row naming this project, and every pointer links to it. **Topics**, **Entities**, and **Facts** are not written.
- The **Terminology glossary** page beside the Memory page is not written. A project term goes in `system/glossary.md`, with `filing-project-records`.
- The ids of the databases and pages are in `PROJECT.md`, section "Toolkit settings", Notion block. Never search the workspace for them.
- Lore's own saving and hooks stay off. Lore is not installed or run.

## Steps for any read or write

1. Read the ids from `PROJECT.md`. Before your first Notion read or write in a session, whatever tool you use, open `using-notion-cli`.
2. Read what you will change, fresh in this turn. The owner edits in Notion, so never answer from an earlier read.
3. Make the change with the file named in References below.
4. Read the page back and check every change is there. A change that is not there is not saved: report it to the calling skill as not saved. Give the caller each page's title and link: the `url` in the page's answer.

## Rules

- Never rename or remove a Lore database, column, or option, or the Memory page. Add only.
- Removing a pointer moves its page to Notion's trash (`references/writing-pages.md`, "Removing a pointer").

## Gotchas

- Record Key is the toolkit's own column, and Lore finds nothing by it. Always fill Keywords with the same ID too.
- A page of Memories that holds a fact, a decision, or a lesson, or has no Record Key, was written before memory held pointers only, or by hand. Leave it as it is and tell the calling skill it exists: `curating-project-memory` decides what happens to it.

## Hand-offs

| For | Use |
| --- | --- |
| What to keep, what a pointer names, a line under "Waiting on the owner", and pruning | `curating-project-memory` |
| What a work item's line under Now says | `running-work-item-lifecycle` |
| What "Next session starts with" says | `handoff` |
| Every Notion read or write: sign-in, Codex, the shape of every call, and errors | `using-notion-cli` |
| Finding a work item's page id | `using-work-tracker` |

## References

| File | Open it when |
| --- | --- |
| [references/current-state-page.md](references/current-state-page.md) | Reading or changing the Current state page. |
| [references/writing-pages.md](references/writing-pages.md) | Adding, changing, or removing a pointer, or linking one to a work item. |
| [references/searching.md](references/searching.md) | Finding a pointer by its ID, by subject, or by work item, or listing every pointer. |
| [references/database-layout.md](references/database-layout.md) | Checking which column holds which part of a pointer, or what a column of the five databases is. |
| [references/views-and-layout.md](references/views-and-layout.md) | Checking the views, the column order, or the page layout of the databases, or sending a schema file to create or add to them. |
| [assets/current-state.md](assets/current-state.md) | Building the Current state page's starting text. |
| [assets/terminology-glossary.md](assets/terminology-glossary.md) | `project-setup` builds the Terminology glossary page from it. Nothing else uses it. |
| [assets/schema/01-projects-database.json](assets/schema/01-projects-database.json), [02-topics-database.json](assets/schema/02-topics-database.json), [03-memories-database.json](assets/schema/03-memories-database.json), [04-entities-database.json](assets/schema/04-entities-database.json), [05-facts-database.json](assets/schema/05-facts-database.json) | Creating the five databases. |
| [assets/schema/06-memories-lore-self-relations.json](assets/schema/06-memories-lore-self-relations.json), [07-memories-toolkit-columns.json](assets/schema/07-memories-toolkit-columns.json), [08-memories-type-tags.json](assets/schema/08-memories-type-tags.json) | Adding Lore's own relations, the toolkit's columns, or the five type tags to Memories, or adding a missing one. |
| [assets/schema/09-memories-work-items-relation.json](assets/schema/09-memories-work-items-relation.json), [09-facts-work-items-relation.json](assets/schema/09-facts-work-items-relation.json), [09-entities-work-items-relation.json](assets/schema/09-entities-work-items-relation.json) | Linking the databases to Work Items, when work items are in Notion. |
| [assets/schema/10-view-index.json](assets/schema/10-view-index.json), [11-view-decisions.json](assets/schema/11-view-decisions.json), [12-view-by-work-item.json](assets/schema/12-view-by-work-item.json), [12-view-by-work-item-ids.json](assets/schema/12-view-by-work-item-ids.json), [13-view-retired.json](assets/schema/13-view-retired.json) | Creating the Memories views, or adding a missing one. |

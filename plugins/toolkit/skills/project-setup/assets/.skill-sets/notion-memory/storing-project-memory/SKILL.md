---
name: storing-project-memory
description: 'Stores and finds this project''s memory in Notion, in Lore''s five databases and the Current state page, for managing-project-memory, so every memory lands in the right column and page section. Use when a memory or the Current state must be read, saved, changed, searched, linked to a work item, merged, or deleted, or when the glossary is edited. Not for deciding what to keep or when to ask; use managing-project-memory. Only for projects with Notion memory.'
---

# Storing project memory in Notion

This project keeps its memory in Notion. This skill says where each thing is stored in Notion and how to read and save it. It never decides what is worth keeping or when to ask the owner.

## Where memory is stored

- Memory is five databases on the project's Memory page: **Projects**, **Topics**, **Memories**, **Entities**, **Facts**. They are Lore's databases (Lore is Notion's open-source memory tool). Lore finds them and their columns by their exact names. `references/database-layout.md` shows how the project looks in Notion and lists every column.
- One page of **Memories** holds one concept; its page body is the memory. An episode (`event_`) and a project-wide decision (`decision_`) each get their own page.
- A page's key is `<prefix>_<slug>`, such as `project_deploys`. It is in the Record Key column, and pages are found by it.
- **Projects** holds one row naming this project, and every page links to it. **Topics** is not used. **Entities** and **Facts** are used only when the owner wants a thing found on its own.
- Two pages sit beside the Memory page: **Current state** (`references/current-state-page.md`) and the **Terminology glossary**.
- A page names its work items in the Work item IDs column, and also in the Work items relation when the work items are in Notion too.
- The ids of the databases and pages are in `PROJECT.md`, section "Toolkit settings", Notion block. Never search the workspace for them.
- Lore's own saving and hooks stay off. Lore is not installed or run.

## Steps for any look-up or save

1. Read the ids from `PROJECT.md`. Before your first `ntn` call of the session, follow `using-notion-cli`.
2. Read what you will look at or change, fresh in this turn. The owner edits in Notion, so never answer from an earlier read.
3. Make the change with the file named in Files below.
4. Read the page back and check every change is there. A change that is not there is not saved: say so. Give the caller each page's title and link: the `url` in the page's answer.

## Rules

- Never rename or remove a Lore database, column, or option, or the Memory page. Add only.
- Deleting moves the page to Notion's trash (`references/writing-pages.md`, "Deleting a page").

## Gotchas

- Record Key is the toolkit's own column, and Lore finds nothing by it. Always fill Keywords with the same key too.
- The page body has no `# Title` line: the title is the Title column.
- A row with no Record Key was not made by the toolkit. Searches leave it out, and a listing shows it as "(no key)". Tell the owner it exists. He can give it a Record Key, ask for its content to be saved as a page, or leave it.

## Hand-offs

| For | Use |
| --- | --- |
| Deciding what to save and when, and what each Current state section holds | `managing-project-memory` |
| Every `ntn` call: sign-in, Codex, the shape of every call, and errors | `using-notion-cli` |
| Finding a work item's page id | `tracking-work-items` |

## Files

| File | Open it when |
| --- | --- |
| [references/database-layout.md](references/database-layout.md) | Checking which column holds which part of a memory, what a status or a work item link means, or how the page body is laid out. |
| [references/writing-pages.md](references/writing-pages.md) | Saving: a new concept page, a new section, a lesson, a decision page, a correction, a replacement, a proposal, retiring, bringing back, deleting, linking to work items, merging two concepts, or a glossary row. |
| [references/searching.md](references/searching.md) | Finding or reading memory: a page by its key, by subject, by work item, by status, the project-wide decisions, the open proposals, every page, or the glossary. |
| [references/current-state-page.md](references/current-state-page.md) | Reading or changing the Current state page. |
| [references/views-and-layout.md](references/views-and-layout.md) | Checking the views, the column order, or the page layout of the databases, or sending a schema file to create or add to them. |
| [assets/concept-record.md](assets/concept-record.md) | The body of a new concept page, or a new section. |
| [assets/decision-record.md](assets/decision-record.md) | The body of a new decision page. |
| [assets/current-state.md](assets/current-state.md) | Building the Current state page's starting text. |
| [assets/terminology-glossary.md](assets/terminology-glossary.md) | Building the Terminology glossary page's starting text. |
| [assets/schema/01-projects-database.json](assets/schema/01-projects-database.json), [02-topics-database.json](assets/schema/02-topics-database.json), [03-memories-database.json](assets/schema/03-memories-database.json), [04-entities-database.json](assets/schema/04-entities-database.json), [05-facts-database.json](assets/schema/05-facts-database.json) | Creating the five databases. |
| [assets/schema/06-memories-lore-self-relations.json](assets/schema/06-memories-lore-self-relations.json), [07-memories-toolkit-columns.json](assets/schema/07-memories-toolkit-columns.json), [08-memories-type-tags.json](assets/schema/08-memories-type-tags.json) | Adding Lore's own relations, the toolkit's columns, or the five type tags to Memories, or adding a missing one. |
| [assets/schema/09-memories-work-items-relation.json](assets/schema/09-memories-work-items-relation.json), [09-facts-work-items-relation.json](assets/schema/09-facts-work-items-relation.json), [09-entities-work-items-relation.json](assets/schema/09-entities-work-items-relation.json) | Linking the databases to Work Items, when work items are in Notion. |
| [assets/schema/10-view-index.json](assets/schema/10-view-index.json), [11-view-decisions.json](assets/schema/11-view-decisions.json), [12-view-by-work-item.json](assets/schema/12-view-by-work-item.json), [12-view-by-work-item-ids.json](assets/schema/12-view-by-work-item-ids.json), [13-view-retired.json](assets/schema/13-view-retired.json) | Creating the Memories views, or adding a missing one. |

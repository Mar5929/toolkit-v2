# Memory storage (Notion)

Use these storage instructions to read, save, find, and change a memory record or the project's Current State. This project keeps both in Notion. The goal is that every memory record is saved in the right column and the right section of its page. A save is done only when you have read the page back and the change is there.

Two names are used in every file of these storage instructions:

- A memory record is what memory holds about one subject, such as the client's plans or one meeting. Here it is one page of the **Memories** database.
- The project's Current State is the project's one short page of what is true now. Here it is the Notion page named **Current state**.

These storage instructions cover how to store memory. Open `references/memory-process.md` to decide what is worth keeping and when to ask the owner.

## Contents

- Where memory is kept
- Steps for every read and every save
- Rules
- Mistakes to avoid
- Work that another skill does
- References

## Where memory is kept

- Memory is five databases on the project's Memory page: **Projects**, **Topics**, **Memories**, **Entities**, **Facts**. They are Lore's databases. Lore is Notion's open-source memory tool, and it finds the databases and their columns by their exact names. `references/database-layout.md` shows how the project looks in Notion and lists every column.
- One page of **Memories** holds one subject, and the body of the page is the memory record's text.
  - One thing that happened gets its own `event_` page.
  - One recurring job gets its own `event_` page, with a row per run.
- A page's key is `<prefix>_<slug>`, such as `project_client_plans`. The prefix is the type of the memory record: `user`, `project`, `reference`, or `event`. The key is in the Record Key column, and pages are found by it.
- **Projects** holds one row that names this project, and every page links to that row. **Topics** is not used. **Entities** and **Facts** are used only when the owner wants a thing found on its own.
- The **Current state** page sits beside the Memory page. `references/current-state-page.md` says how to read and change it.
- Never write the **Terminology glossary** page beside the Memory page, or a page of Memories with the `decision` tag. Never read either of them for a term or a decision. A project term is in `system/glossary.md`, and a decision is in `DECISIONS.md`.
- Nothing shows the memory pages at the start of a session. Only the Current state page is printed. `managing-project-memory` says when to search.
- A page names its work items in the Work item IDs column. When the work items are in Notion too, the page also names them in the Work items relation.
- The ids of the databases and pages are in `PROJECT.md`, section "Toolkit settings": the nested bullets under the fixed line "Notion memory". Never search the workspace for them.
- Lore's own saving and hooks stay off. Lore is not installed or run.

`managing-project-memory` calls a memory record current, replaced, or retired. When you read or set a status, open `references/database-layout.md`, section "Status". It gives the option of the Status column that a page stores for each of those three words.

## Steps for every read and every save

1. Read the ids from `PROJECT.md`. Before your first Notion read or write in a session, whatever tool you use, open `using-notion-cli`.
2. In this turn, read again what you will look at or change. The owner edits in Notion, so never answer from an earlier read.
3. Make the change the way the matching reference file says. The References table at the end of this file names the file for each job.
4. Read the page back.
   - Check that every change is there. A change that is not there is not saved. Report it as not saved to the procedure that asked for it.
   - Give the procedure that asked each page's title and link. The link is the `url` in the page's answer.

## Rules

- Never rename or remove a Lore database, column, or option, or the Memory page. You may only add to them.
- Deleting a page moves it to Notion's trash. `references/writing-pages.md`, section "Deleting a page", gives the call, and says how a deleted page is brought back.

## Mistakes to avoid

- Record Key is the toolkit's own column, and Lore finds nothing by it. Always fill Keywords with the same key too.
- The page body has no `# Title` line. The title is the Title column.
- A row with no Record Key was not made by the toolkit. Searches leave it out, and a listing shows it as "(no key)". Tell the owner that the row exists. The owner can give it a Record Key, ask for its content to be saved as a page, or leave it.

## Work that another skill does

| For | Use |
| --- | --- |
| Deciding what to save, when to save it, and when to ask the owner; what each part of the project's Current State holds, and its limits | `managing-project-memory` |
| What a work item's line says under Now, which is a part of the project's Current State | `managing-work-items` |
| Every Notion read or write: sign-in, Codex, the shape of every call, and errors | `using-notion-cli` |
| Finding a work item's page id | `managing-work-items` |

## References

| File | Open it when |
| --- | --- |
| [references/database-layout.md](database-layout.md) | You need to check which column holds which part of a memory record, what a status or a work item link means, or how the page body is laid out. |
| [references/writing-pages.md](writing-pages.md) | You save something: a new page for a subject, a new section, a lesson, a run of a recurring job, a correction, a replacement, retiring, bringing back, deleting, linking to work items, or merging two pages about one subject. |
| [references/searching.md](searching.md) | You need to find or read memory: a page by its key, by subject, by work item, by status, or by date, or every page. |
| [references/current-state-page.md](current-state-page.md) | You read or change the Current state page. |
| [assets/concept-record.md](../assets/concept-record.md) | You write the body of a new page for a subject, or a new section. |
| [assets/current-state.md](../assets/current-state.md) | You build the Current state page's starting text. |

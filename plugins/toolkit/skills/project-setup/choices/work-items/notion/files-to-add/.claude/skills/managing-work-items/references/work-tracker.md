# Work items kept in Notion

Use this reference to read, create, change, and find work items in a project that keeps its work items in Notion. The goal is to read and write each work item consistently with the lifecycle rules.

This reference says where a work item is kept in Notion and how to save to it. The lifecycle rules decide what happens next: what to save and when, a work item's State, and each approval. A work item's State is the step the work is in, and its Status is the short summary of the State. `using-notion-cli` says how to run each Notion call.

## Where the work items are kept

- Each project has one page in the owner's Notion. The page holds three databases: **Work Items**, **Phases**, and **Tasks**.
- The ids of the page and the databases are in `PROJECT.md`, section "Toolkit settings". They are the nested bullets under the line "Notion work items". Take every id from there, and never search the workspace for a database.
- A work item is a row of Work Items, and the row has its own page. Notion makes the page from the default template of the Work Items database, which this reference calls the work item template.
- A work item's design is its Solution Design page, which is a child page of the work item's page.
- Work items can be nested. A top-level item is a work item with no parent, at level 1. A sub-item is a work item inside another work item, at level 2 or level 3. The "Parent item" property of a sub-item names the work item above it. `references/lifecycle-rules.md`, section "Levels", says what each level holds.
- A phase is a row of Phases, never a work item. There are two kinds of phase:
  - A top-level item has phases of its own, with IDs such as `P1`. Each one is linked to its work item.
  - A project phase has an ID such as `P01`, and it is linked to no work item. The "Phase" property of a top-level item holds its project phase.
- A task is a row of Tasks. There are three kinds of task:
  - A top-level item's task is linked to its work item and to its phase.
  - A sub-item's task is linked to its work item only, because a sub-item has no phases.
  - A project task is linked to neither a work item nor a phase.
- The project page shows the project's phases, its top-level items by project phase, and its project tasks.
- `managing-work-items` calls the list of the open work items the board. In Notion, the owner sees that list in the views of Work Items. A card is one work item as such a view shows it.

## The owner's Notion describes a work item

The owner built the databases, their views, the work item template, and the Solution Design page inside that template in the Notion app. The owner changes them there. This skill does not describe them, so read them from Notion.

- To learn what a work item's page holds, read the page. A work item's page can have other sections than `assets/work-item-template.md`, and then the page is right.
- To learn the properties of a database and their options, read the database. [work-tracker-commands.md](work-tracker-commands.md) gives the call.
- Never build or rebuild a template, a database, a view, or a property through a Notion call. When one is missing, tell the owner. The owner makes it or restores it in the Notion app.
- Never rename or remove a property, a view, or a section of a template.
- Never add work to a template. The templates are the "Project" template in the owner's Projects database, and the work item template. Every copy that Notion makes from a template takes along what the template holds.

## Steps for every read and every save

1. Read the ids from `PROJECT.md`. Before your first Notion read or write in a session, open `using-notion-cli`, whatever tool you use. That skill says how to sign in, how to run a call, and what to do when a call fails.
2. In this turn, read again what you will look at or change. Never answer from an earlier read, because the owner edits in Notion, and the owner's edit is the one to keep.
3. Open [work-tracker-page-updates.md](work-tracker-page-updates.md) for creation, page updates, designs, phases, tasks, and sub-items. Use [work-tracker-commands.md](work-tracker-commands.md) for the matching API call.
4. Read the changed page or row back, and check that it says what you wrote. When a save failed, or reads back differently, report it as `references/lifecycle-rules.md`, section "Rules that apply in every State", says. That section gives the words your reply must start with.

Two rules apply to every read and every save:

- Never delete a page, a row, a phase, or a task. Take it out of view instead: set a phase or a task to Cancelled, or tick a work item's Archived box. When the owner wants it deleted, ask the owner to delete it in Notion.
- Leave out archived work items unless the owner asks for them.

## Procedures and API calls

| File | Open it when |
| --- | --- |
| [work-tracker-page-updates.md](work-tracker-page-updates.md) | You create or update work-item content, a design, phases, tasks, or sub-items; it gives their procedures and exact field values. |
| [work-tracker-commands.md](work-tracker-commands.md) | You need the API call for creation, updates, queries, or comments. |
| [work-tracker-known-problems.md](work-tracker-known-problems.md) | A call fails, a record is missing or malformed, or the owner changed the record by hand. |

## Related work

| For | Use |
| --- | --- |
| Deciding what happens next: what to save and when, a State, or an approval | Follow `references/lifecycle-rules.md` in this skill. |
| Every Notion read or write: sign-in, Codex, the form of each call, and errors | `using-notion-cli` |
| A source that the work item was given. A source is anything the project was given by someone else, such as a transcript or a client document. | `filing-project-records`, step "file a source" |
| Moving the work items to another place where work items can be kept, such as local files or GitHub Issues | `project-setup` |

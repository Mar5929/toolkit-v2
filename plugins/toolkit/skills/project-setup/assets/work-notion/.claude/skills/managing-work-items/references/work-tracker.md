# Work items kept in Notion

Use this reference to read, create, save, and find work items in a project that keeps its work items in Notion. The goal is to read and write each work item consistently with the lifecycle rules.

This reference only gives the steps for reading and saving. The lifecycle rules decide what happens next: what to save or when, a work item's State, and each approval. A work item's State is the step the work is in, and its Status is the short summary of the State.

This reference says where each part of a work item is stored in Notion. `using-notion-cli` says how to run each Notion call.

## Where the work items are kept

- Each project has three databases in Notion: **Work Items**, **Phases**, and **Tasks**. `references/work-tracker-database-layout.md` shows how the project looks in Notion and lists every property of the three databases.
- Work items can be nested. A top-level item is a work item with no parent, at level 1. A sub-item is a work item inside another work item, at level 2 or level 3. The "Parent item" property of a sub-item names the work item above it. `references/lifecycle-rules.md`, section "Levels", says what each level holds.
- A **phase** is a row of Phases, never a work item. There are two kinds of phase:
  - A top-level item has phases of its own, which group its tasks and its level-2 sub-items. Such a phase has an ID such as `P1`, and it is linked to its work item.
  - A project phase has an ID such as `P01`, and it is linked to no work item. A project phase groups top-level items. The "Phase" property of a top-level item holds its project phase.
- A **task** is a row of Tasks. There are three kinds of task:
  - A top-level item's task is linked to its work item and to its phase.
  - A sub-item's task is linked to its work item only, because a sub-item has no phases.
  - A project task is a task that belongs to no work item. It is linked to neither a work item nor a phase.
- The project page shows the project's phases, its top-level items by project phase, and its project tasks. `references/work-tracker-database-layout.md`, section "The project's phases and tasks", says how to read and change them.
- Every work item has its own page. The page is made from the default template of the Work Items database, which this reference calls the work item template. `references/work-tracker-page-layout.md` lists the sections of the page.
  - Six sections are text: Overview, Recent History, Requirements, Questions and Answers, Notes, and Linked Github PRs.
  - Four sections are views, which show the rows of another database as they are now: Roadmap, Sub-items, Tasks, and Linked memory.
- The Solution Design page is a child page of the work item's page.
- The ids of the databases and pages are in `PROJECT.md`, section "Toolkit settings". They are the nested bullets under the fixed line "Notion work items". Never search the workspace for them.

## Steps for every read and every save

1. Read the ids from `PROJECT.md`. Before your first Notion read or write in a session, open `using-notion-cli`, whatever tool you use. That skill says how to sign in, how to run a call, and what to do when a call fails.
2. In this turn, read again what you will look at or change. Never answer from an earlier read, because the owner edits in Notion, and the owner's edit is the one to keep.
3. Make the change with the file that the References table below names for it.
4. Read the changed page or row back, and check that it says what you wrote. When a save failed, or reads back differently, report it as `references/lifecycle-rules.md`, section "Rules that apply in every State", says. That section gives the words your reply must start with.
   - An `update_content` call is the call that changes the text of a page. Notion saves all of an `update_content` call or none of it, so a call that Notion refused changed nothing.

## Create a work item

1. Count the levels by following "Parent item" up from the parent. When the parent is already at the third level, stop. The work becomes a task, as `managing-work-items` says.
2. Create the page from the default template, with the properties that `managing-work-items` gave you. `references/work-tracker-database-layout.md`, section "Creating a work item", gives the call.
3. Wait until the template's content is on the page. `using-notion-cli`, section "Waiting for a template", says how to check.
4. Fill the text with one `update_content` call. `references/work-tracker-page-layout.md`, section "Filling a new work item", says what to replace, what to delete, and what to keep.
5. Copy the Next action line of the work item's Current state into the Next action property. The work item's Current state is the five lines in the Overview that say where the work item stands.
6. When the work item has a parent, add a Recent History row on the parent's page: "Sub-item WI-32 created: <title>."

## Mistakes to avoid

- Never replace the whole text of a work item's page, for example with `replace_content`. The views in the page block that call, and the call would overwrite the owner's edits.
- Leave out the rows with an empty title in every Work Items query. The one exception is the query "Cards with no title" in `references/work-tracker-searching.md`. Notion lists the work item template as a row of Work Items, with an empty title and usually ID 1.
- Leave out archived work items unless the owner asks for them.
- Read the rows of the Roadmap, Sub-items, and Tasks sections with the queries under "A parent's full tree" in `references/work-tracker-searching.md`. Those three sections of a page are views, and the page text shows each view only as a `<database …>` line.
- Never delete a page, a row, a phase, or a task. Take it out of view instead: set a phase to Cancelled, or tick a work item's Archived box. When the owner wants it deleted, ask the owner to delete it in Notion.
- Never add work to a template. The templates are the "Project" template in the owner's Projects database, and the work item template of the Work Items database. Every copy that is made from a template takes along what the template holds.
- When the owner drags a card on the Board, only the work item's Status changes, so its State and its Status no longer match. The Board is a view of Work Items in Notion, and a card is one work item as the Board shows it. The table below names the skill that handles a State and a Status that no longer match.

## Related work

| For | Use |
| --- | --- |
| Deciding what happens next: what to save and when, a State, or an approval | Follow `references/lifecycle-rules.md` in this skill. |
| A State and a Status that no longer match | Follow `references/lifecycle-rules.md` in this skill. |
| Every Notion read or write: sign-in, Codex, the form of each call, and errors | `using-notion-cli` |
| A source that the work item was given. A source is anything the project was given by someone else, such as a transcript or a client document. | `filing-project-records`, step "file a source" |
| Moving the work items to another place where work items can be kept, such as local files or GitHub Issues | `project-setup` |
| Rebuilding a missing database template | `project-setup` |

## References

| File | Open it when |
| --- | --- |
| [references/work-tracker-database-layout.md](work-tracker-database-layout.md) | You check what a property holds; you create or change a work item's properties, phases, tasks, links, or tags; a work item changes level; or you read or change the project's phases and tasks. |
| [references/work-tracker-page-layout.md](work-tracker-page-layout.md) | You change a work item's text: the work item's Current state, Moved up, Recent History, Requirements, Questions and Answers, a Notes line, a pull request link, or the Solution Design page; or you add a comment. |
| [references/work-tracker-searching.md](work-tracker-searching.md) | You find or read work items: one work item, the board (the list of the open work items), what waits on the owner, a parent's full tree, the project's phases and tasks, a search, or cards with no title. |
| [assets/schema/01-work-items-database.json](../assets/schema/01-work-items-database.json), [02-phases-database.json](../assets/schema/02-phases-database.json), [03-tasks-database.json](../assets/schema/03-tasks-database.json) | You create the databases, or add a missing property. |
| [assets/schema/04-work-items-relations.json](../assets/schema/04-work-items-relations.json), [05-phases-relations.json](../assets/schema/05-phases-relations.json), [06-tasks-relations.json](../assets/schema/06-tasks-relations.json), [07-work-items-rollup.json](../assets/schema/07-work-items-rollup.json), [07b-work-items-phase-column.json](../assets/schema/07b-work-items-phase-column.json), [07c-phases-phase-type.json](../assets/schema/07c-phases-phase-type.json), [07d-tasks-task-type.json](../assets/schema/07d-tasks-task-type.json) | You create the relations and the columns made from them, or add a missing one. |
| [assets/schema/10-view-board.json](../assets/schema/10-view-board.json), [11-view-by-state.json](../assets/schema/11-view-by-state.json), [12-view-all-items.json](../assets/schema/12-view-all-items.json), [13-view-roadmap.json](../assets/schema/13-view-roadmap.json), [14-view-waiting-on-owner.json](../assets/schema/14-view-waiting-on-owner.json), [15-view-phases-by-item.json](../assets/schema/15-view-phases-by-item.json), [16-view-open-tasks.json](../assets/schema/16-view-open-tasks.json), [17-view-top-level.json](../assets/schema/17-view-top-level.json), [18-view-by-project-phase.json](../assets/schema/18-view-by-project-phase.json), [19-view-project-phases.json](../assets/schema/19-view-project-phases.json), [19b-view-project-tasks.json](../assets/schema/19b-view-project-tasks.json) | You create the database views, or add a missing one. |
| [assets/schema/20-item-view-phases.json](../assets/schema/20-item-view-phases.json), [21-item-view-sub-items.json](../assets/schema/21-item-view-sub-items.json), [22-item-view-tasks.json](../assets/schema/22-item-view-tasks.json), [23-item-view-linked-memory.json](../assets/schema/23-item-view-linked-memory.json) | You create the views inside the work item template. |

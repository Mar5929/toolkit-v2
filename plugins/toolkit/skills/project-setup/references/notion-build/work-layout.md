# The Notion work tracking layout: views, property order, and page layout

This file lists the views of a Notion project's databases, and the property order and page layout. Open it to check a project, to bring a project up to date, or to rebuild a damaged template. Its job is done when the views, the property order, and the page layout of the project or the template are as this file lists them.

Two other places hold the rest of the layout:

- The `assets/schema/` files of the Notion `using-work-tracker` skill hold every property and relation. That skill's `database-layout.md` lists them and shows how a project looks.
- `work-item-page.md` in this folder holds the page text.

Never rename or remove anything listed here or in those files.

## Contents

- Views of the databases
- Property order and page layout
- The request bodies in assets

The layout has no assignee, points, effort, dates, or time tracking (the owner's decision). A task's Who does it says agent or owner. A project task, which is a task that belongs to no work item, may name another person who owes it.

## Views of the databases

Every view has a set order (the owner's decision).

In the table, a top-level item is a work item with no parent, and a sub-item is a work item inside another work item. A project phase groups work items, and a work item's own phases group its tasks.

| Database | View | Type | Grouping, filter, and order |
| --- | --- | --- | --- |
| Work Items | By project phase | board | It shows the work items with no parent. The columns are by Phase column, which is each work item's project phase, in plan order, with "No phase" for a work item not placed yet. Empty columns are hidden. The cards are ordered by Priority, then ID. Archived work items are hidden. The cards show ID, Status, State, Waiting on, and Next action. It is the first tab. |
| Work Items | Board | board | The columns are by Status, in status order (Not Started to Cancelled). The cards are ordered by Priority, then ID. Archived work items are hidden. The cards show ID, State, Waiting on, Priority, Parent item, and Next action. They show no created or edited time. |
| Work Items | All items | table | Sub-items are nested under their parent. The rows are ordered by ID. Archived work items are hidden. |
| Work Items | By state | board | The columns are by State, in option order, and empty columns are hidden. It shows open work items only. The cards are ordered by Priority, then ID. |
| Work Items | Roadmap | table | It shows the work items that have a parent, grouped by Parent item. The rows are ordered by Phase order, then ID. It shows no dates. |
| Work Items | Waiting on the owner | table | It shows the open work items where Waiting on = owner. The rows are ordered by Priority, then ID. |
| Work Items | Top-level items | table | It shows the work items with no parent. The rows are ordered by Priority, then ID. It shows Blocked by and Blocking, which are the order between top-level items. |
| Phases | Project phases | table | It shows the project's own phases, where Phase type is Project. The rows are ordered by Order. Its Sub-items column lists each phase's top-level items. It is the first tab. |
| Phases | By item | table | The rows are grouped by Work item and ordered by Order. |
| Phases | All phases | table | The rows are ordered by Order, and the view shows the Phase type column. It is the database's first view, renamed. It is a later tab. |
| Tasks | Project tasks | table | It shows the project's own tasks, where Task type is Project. The rows are ordered by Order. It is the first tab. |
| Tasks | Open tasks | table | It shows the tasks whose Status is Not Started or In Progress. The rows are grouped by Work item and ordered by Order. |
| Tasks | All tasks | table | The rows are ordered by Order, and the view shows the Task type column. It is the database's first view, renamed. It is a later tab. |

The project page shows each database on its first tab. So Phases shows only the project's roadmap, and Tasks shows only the project's own tasks. A work item's phases and tasks show on that work item's page, and "All phases" and "All tasks" list everything. Work Items opens on "By project phase", which shows the top-level items under the project's phases. "Board" is the next tab, and it shows every work item. These are the owner's decisions (2026-10-02 and 2026-10-03).

Every table view shows its columns in the order of "Property order and page layout".

Each Work Items view's filter holds `{"property":"title","title":{"is_not_empty":true}}`, because Notion also lists the work item template as a row of Work Items, with an empty title.

Through the API, a board's column order can only be `manual`, `ascending`, or `descending`. On a status or select, `ascending` follows its option order. Never use `manual` in a view made by API, because with no stored order Notion shows the columns alphabetically.

## Property order and page layout

The owner approved this grouping (2026-09-30). It sets the order in every table view (by API) and the page layout of each database (in the Notion app).

| Database | Heading (pinned at the top) | Sections, in order | Hidden |
| --- | --- | --- | --- |
| Work Items | ID, Status, State, Waiting on, Priority | Plan: Parent item, Sub-items, Phase, Phases, Tasks, Blocked by, Blocking, Related · About: Next action, Type, Tags · Approvals: Requirements approved, Design, Design approved, Result approved, Delivery · Links and files: Memories, Facts, Entities, Files | Phase order, Phase name, Phase column, Archived |
| Phases | Phase ID, Phase type, Order, Status | Plan: Outcome, Exit result · Links: Work item, Sub-items, Tasks | none |
| Tasks | Task ID, Task type, Status, Who does it, Order | Work: Work, Deliverable, Done when · Links: Work item, Phase, Depends on | none |

- **Table views** list the properties in this order: the heading, then the sections, then the hidden ones. Each property has `"visible": true` or `false`.
  - A view that shows only some columns keeps those columns on and the rest off, in this order.
  - The public API cannot set or read the order of properties on a page. It returns properties in alphabetical order, and the reference describes only "names, types, and settings" (https://developers.notion.com/reference/property-object).
  - A view's column order and visibility are its `configuration.properties` (https://developers.notion.com/reference/view).
- **Page layout** is set only in the Notion app, once per database of a template (https://www.notion.com/help/layouts). The clicks are: open any page of the database → "…" → Customize layout → pin the heading properties (up to 15) → "Add section" for each section, named as above, and drag its properties in → the eye icon off for each hidden property → Apply to all pages.
  - Notion says: "Every page in your database will have the same layout, and new pages you create will also have that layout."
  - A copy of the template keeps the layout (tested 2026-09-30).
  - A property added after the layout is set shows in a visible section. When a property is added, give the owner the clicks right away to move it to its section in the table above, or to hide it when the table lists it under Hidden.
- Board cards are set in the view. "Views of the databases" says what each board's cards show.

## The request bodies in assets

`assets/schema/` holds the exact bodies, in the order they are sent, and `work-setup.md` says how to send them:

| File | Sends |
| --- | --- |
| `01-work-items-database.json`, `02-phases-database.json`, `03-tasks-database.json` | `POST v1/databases`: each database with its own properties. The ID has no prefix in a template. Each project sets its own prefix after the copy. |
| `04-work-items-relations.json`, `05-phases-relations.json`, `06-tasks-relations.json` | `PATCH v1/data_sources/<id>`: the relations, once all three databases exist. |
| `07-work-items-rollup.json`, then `07b-work-items-phase-column.json` | `PATCH v1/data_sources/<id>`: Phase order and Phase name, once Phase exists. Then Phase column, which reads them. |
| `07c-phases-phase-type.json`, `07d-tasks-task-type.json` | `PATCH v1/data_sources/<id>` on Phases and on Tasks: Phase type and Task type. Both are formulas that read Work item, so they can never disagree with it. |
| `10-view-board.json` to `19b-view-project-tasks.json` | `POST v1/views`. File 12 is sent as `PATCH v1/views/<default view id>`, which renames the database's first view. |
| `20-item-view-phases.json` to `23-item-view-linked-memory.json` | `POST v1/views` with `create_database`: the views inside the work item template. |

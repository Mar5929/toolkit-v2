# The Notion work tracking layout: views, property order, and page layout

Purpose: the views of a Notion project's databases, and the property order
and page layout. The Notion `tracking-work-items` skill's `assets/schema/`
files hold every property and relation (its `database-layout.md` lists
them and shows how a project looks), and `work-item-page.md` in this folder
holds the page text. Use this to check a project, bring one up to date, or
rebuild a damaged template. Never rename or remove anything listed here or
in those files.

## Contents

- Views of the databases
- Property order and page layout
- The request bodies in assets

No assignee, points, effort, dates, or time tracking (the owner's decision); a task's Who does it says only agent or owner.

## Views of the databases

Every view has a set order (the owner's decision).

| Database | View | Type | Grouping, filter, and order |
| --- | --- | --- | --- |
| Work Items | Board | board | Columns by Status, in status order (Not Started to Cancelled); cards by Priority, then ID; archived hidden. Cards show ID, State, Waiting on, Priority, Parent item, Next action. No created or edited time. |
| Work Items | All items | table | Sub-items nested under their parent; by ID; archived hidden. |
| Work Items | By state | board | Columns by State, in option order, empty columns hidden; open items only; cards by Priority, then ID. |
| Work Items | Roadmap | table | Items that have a parent, grouped by Parent item; rows by Phase order, then ID. No dates. |
| Work Items | Waiting on Mike | table | Waiting on = owner, open items; by Priority, then ID. |
| Work Items | Top-level items | table | Items with no parent; by Priority, then ID; shows Blocked by and Blocking, the order between top-level items. |
| Phases | By item | table | Grouped by Work item; by Order. |
| Phases | All phases | table | By Order (the database's first view, renamed). |
| Tasks | Open tasks | table | Not done; grouped by Work item; by Order. |
| Tasks | All tasks | table | By Order (the database's first view, renamed). |

Every table view shows its columns in the order of "Property order and
page layout".

Each Work Items view's filter holds
`{"property":"title","title":{"is_not_empty":true}}`: Notion also lists
the work item template as a row of Work Items, with an empty title.

A board's column order can only be `manual`, `ascending`, or `descending`
through the API; `ascending` on a status or select follows its option
order. Never use `manual` in a view made by API: with no stored order,
Notion shows the columns alphabetically.

## Property order and page layout

The owner approved this grouping (2026-09-30). It sets the order in every
table view (by API) and the page layout of each database (in the Notion
app).

| Database | Heading (pinned at the top) | Sections, in order | Hidden |
| --- | --- | --- | --- |
| Work Items | ID, Status, State, Waiting on, Priority | Plan: Parent item, Sub-items, Phase, Phases, Tasks, Blocked by, Blocking, Related · About: Next action, Type, Tags · Approvals: Requirements approved, Design, Design approved, Result approved, Delivery · Links and files: Memories, Facts, Entities, Files | Phase order, Phase name, Phase column, Archived |
| Phases | Phase ID, Order, Status | Plan: Outcome, Exit result · Links: Work item, Sub-items, Tasks | none |
| Tasks | Task ID, Status, Who does it, Done, Order | Work: Work, Deliverable, Done when · Links: Work item, Phase, Depends on | none |

- **Table views** list the properties in the order heading, then sections,
  then hidden, each with `"visible": true` or `false`. A view that shows
  only some columns keeps those columns on and the rest off, in this order.
  The public API cannot set or read the order of properties on a page: it
  returns properties in alphabetical order, and the reference describes
  only "names, types, and settings"
  (https://developers.notion.com/reference/property-object). A view's column
  order and visibility are its `configuration.properties`
  (https://developers.notion.com/reference/view).
- **Page layout** is set only in the Notion app, once per database of a
  template (https://www.notion.com/help/layouts): open any page of the
  database → "…" → Customize layout → pin the heading properties (up to 15)
  → "Add section" for each section, named as above, and drag its
  properties in → the eye icon off for each hidden property → Apply to all
  pages. "Every page in your database will have the same layout, and new
  pages you create will also have that layout." A copy of the template
  keeps the layout (tested 2026-09-30). A property added after the layout
  is set shows in a visible section. Right away, give the owner the clicks
  to move it to its section in the table above, or to hide it when the
  table lists it under Hidden.
- Board cards are set in the view: see "Views of the databases".

## The request bodies in assets

`assets/schema/` holds the exact bodies, in the order they are sent
(`work-setup.md` says how):

| File | Sends |
| --- | --- |
| `01-work-items-database.json`, `02-phases-database.json`, `03-tasks-database.json` | `POST v1/databases`: each database with its own properties. The ID has no prefix in a template; each project sets its own after the copy. |
| `04-work-items-relations.json`, `05-phases-relations.json`, `06-tasks-relations.json` | `PATCH v1/data_sources/<id>`: the relations, once all three exist. |
| `07-work-items-rollup.json`, then `07b-work-items-phase-column.json` | `PATCH v1/data_sources/<id>`: Phase order and Phase name, once Phase exists; then Phase column, which reads them. |
| `10-view-board.json` to `17-view-top-level.json` | `POST v1/views` (12 is sent as `PATCH v1/views/<default view id>`, renaming the database's first view). |
| `20-item-view-phases.json` to `23-item-view-linked-memory.json` | `POST v1/views` with `create_database`: the views inside the work item template. |

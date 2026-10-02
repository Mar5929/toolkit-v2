# The memory views, column order, and page layout

The views of the memory databases, the order of their columns, the page layout, and the schema files that build them. The `project-setup` skill uses this to build, check, and update a project's memory. Saving and finding memory never need it. The columns are in `database-layout.md`.

## Contents

- Views
- Property order and page layout
- The schema files

## Views

| Database | View | Grouping, filter, and order |
| --- | --- | --- |
| Memories | Index | Status accepted or proposed; by Record Key. |
| Memories | Decisions | Kind = decision, not deprecated; newest first. Project-wide decisions only: an item's own decisions live in its Questions and Answers. |
| Memories | By work item | Grouped by Work items (or by Work item IDs when work items are not in Notion); newest first. |
| Memories | Retired | Status superseded or deprecated; newest first. |

## Property order and page layout

The owner approved this grouping (2026-09-30). Hiding a property removes nothing: Lore still finds every column by its name.

| Database | Heading (pinned) | Sections, in order | Hidden |
| --- | --- | --- | --- |
| Memories | Record Key, Kind, Status, Saved | About: Synopsis, Tags, Source note, Last verified, Authorization · Links: Work items, Work item IDs, Project, Topic, Supersedes, Superseded by · Decision: Decided At, Alternatives, Consequences | every other column: Task State, Blocked By, Entity, Topic Key, Revision Count, Compare Notes, Promotion Source Key, Review By, Done At, Last Referenced At, Author, Agent, Keywords, Expires On, Session, Scope Kind, Scope Key, Audience, Lifetime, Expires At, Pinned, Pinned Priority, Mutability, Source, Affects, Compared With, Other fields |
| Facts | Subject, Predicate, Object | Confidence, Valid From, Valid Until, Work items, Project, Source | every other column |
| Entities | Name, Kind | Description, Aliases, Work items, Project, Source | none |
| Topics | Name | Description, Project | none |
| Projects | Name, Type, Status | Path, Description | none |

Table views list the columns in this order, with the hidden ones `"visible": false`.

The page layout is set only in the Notion app, once per database of a template (https://www.notion.com/help/layouts). Open any page of the database, choose "…" then Customize layout, and pin the heading properties (up to 15; the page title, such as Subject or Name, is always at the top). Choose "Add section" for each named section, and drag its properties in. Turn the eye icon off for each hidden property, then choose Apply to all pages. "Every page in your database will have the same layout, and new pages you create will also have that layout." A copy of the template keeps the layout (tested 2026-09-30).

A property added after the layout is set appears in a visible section. Right away, ask the owner to move it into its section from the table above, or to hide it when the table's Hidden column covers it. For any other property, ask him which section it goes in.

## The schema files

`assets/schema/` holds the exact bodies, in the order they are sent:

| File | Sends |
| --- | --- |
| `01-projects-database.json` to `05-facts-database.json` | `POST v1/databases`, in this order: each relation needs the database it points at. |
| `06-memories-lore-self-relations.json` | Lore's Supersedes, Affects, and Compared With on Memories. |
| `07-memories-toolkit-columns.json` | The toolkit's columns on Memories. |
| `08-memories-type-tags.json` | The five Tags options. It is a list, not a body: send them with every existing option (its `note` says how). |
| `09-memories-work-items-relation.json`, `09-facts-work-items-relation.json`, `09-entities-work-items-relation.json` | The Work items relations, one per database. Only with work items in Notion. |
| `10-view-index.json` to `13-view-retired.json` | The views. 10 renames the first view of Memories. 12-view-by-work-item-ids.json replaces 12-view-by-work-item.json when work items are not in Notion. |

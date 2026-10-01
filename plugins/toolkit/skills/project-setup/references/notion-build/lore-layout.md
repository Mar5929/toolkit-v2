# Lore's layout: the memory databases and every column

Purpose: the exact databases and columns a project's Notion memory keeps.
Lore (Notion's open-source AI memory, https://github.com/makenotion/lore)
finds its databases and columns by these exact names, so never rename or
remove any of them. The toolkit adds columns; it never changes Lore's.

## Contents

- Where memory lives
- Rules that keep Lore's layout working
- Lore's databases and columns
- The columns the toolkit adds
- Links to work items
- Views
- Property order and page layout
- The request bodies

## Where memory lives

Under the project page:

| Page or database | What it holds |
| --- | --- |
| Memory (page) | Lore's five databases, directly on it: Projects, Topics, Memories, Entities, Facts. |
| Current state (page) | Now, Waiting on the owner, Untracked to-dos, Next session starts with. |
| Terminology glossary (page) | Terms whose meaning matters, one row each. |

Every memory record is one row (page) of **Memories**: one row per concept,
its page body the record's body. The Projects database holds one row naming
this project; every record links to it.

## Rules that keep Lore's layout working

- Never rename or remove a database, a column, an option, or the "Memory"
  page. Add only.
- Lore's own saving and hooks stay off; Lore is not installed or run. Every
  save goes through the notion-memory-save skill and the owner's yes.
- A row with no Record Key (made by hand, or by Lore's own tools) is not a
  toolkit record: finds leave it out; tell the owner.
- Lore promises to add columns, never rename or remove them.

## Lore's databases and columns

Copied from Lore 1.0.0, commit `6e741b1bb91a36b47213f4d3af5bbdfaa2f2081d` (the "default@1.0.0" profile).

### Projects

| Property | Type | Options or target |
| --- | --- | --- |
| Name | title |  |
| Type | select | project, person, agent |
| Path | rich-text |  |
| Status | select | active, archived |
| Description | rich-text |  |

### Topics

| Property | Type | Options or target |
| --- | --- | --- |
| Name | title |  |
| Project | relation | Projects (two-way) |
| Description | rich-text |  |

### Memories

| Property | Type | Options or target |
| --- | --- | --- |
| Title | title |  |
| Project | relation | Projects (one-way) |
| Topic | relation | Topics (one-way) |
| Source | select | conversation, autosave_learning, file, manual, agent_diary, digest |
| Kind | select | note, decision, incident, runbook, postmortem, policy, state, operational, task, procedure |
| Task State | select | open, in-progress, blocked, done, cancelled |
| Blocked By | rich-text |  |
| Entity | rich-text |  |
| Status | select | informational, proposed, accepted, superseded, deprecated, rejected |
| Topic Key | rich-text |  |
| Revision Count | number | number |
| Compare Notes | rich-text |  |
| Promotion Source Key | rich-text |  |
| Review By | date |  |
| Done At | date |  |
| Decided At | date |  |
| Last Referenced At | date |  |
| Alternatives | rich-text |  |
| Consequences | rich-text |  |
| Author | rich-text |  |
| Agent | rich-text |  |
| Tags | multi-select | android, api, architecture, audit, backend, bug, build, ci, code-review, concurrency, config, convention, data-model, db, decision-context, dependency, deployment, docs, error-handling, frontend, gotcha, incident, infrastructure, investigation, ios, migration, observability, onboarding, performance, policy, postmortem, refactor, runbook, security, testing, tooling, ui, ux, web, workflow |
| Keywords | rich-text |  |
| Synopsis | rich-text |  |
| Expires On | rich-text |  |
| Session | rich-text |  |
| Scope Kind | select | team, project, user, agent, role, session, run, environment, global |
| Scope Key | rich-text |  |
| Audience | rich-text |  |
| Lifetime | select | persistent, expires, session-only, until-task-closed, until-decision-superseded |
| Expires At | date |  |
| Pinned | checkbox |  |
| Pinned Priority | number | number |
| Mutability | select | mutable, read-only |
| Supersedes | relation | Memories (one-way) |
| Affects | relation | Memories (one-way) |
| Compared With | relation | Memories (one-way) |

### Entities

| Property | Type | Options or target |
| --- | --- | --- |
| Name | title |  |
| Aliases | rich-text |  |
| Kind | select | class, function, file, workflow, pr, task-id, person, system |
| Description | rich-text |  |
| Project | relation | Projects (two-way) |
| Source | relation | Memories (one-way) |

### Facts

| Property | Type | Options or target |
| --- | --- | --- |
| Subject | title |  |
| Predicate | select | is_a, has_a, related_to, uses, depends_on, created_by, owned_by, replaces, extends, conflicts_with, needs_action, waiting_on, blocked_by, decided_by, supersedes_decision, informs, mentions |
| Object | rich-text |  |
| Project | relation | Projects (one-way) |
| Valid From | date |  |
| Valid Until | date |  |
| Observed At | date |  |
| Invalidated At | date |  |
| Invalidated By | relation | Memories (one-way) |
| Review By | date |  |
| Source | relation | Memories (one-way) |
| Confidence | select | certain, likely, speculative |
| Confidence Score | number | number |
| Last Referenced At | date |  |
| DedupKey | rich-text |  |
| SubjectKey | rich-text |  |
| SubjectEntity | relation | Entities (one-way) |
| ObjectEntity | relation | Entities (one-way) |
| Scope Kind | select | team, project, user, agent, role, session, run, environment, global |
| Scope Key | rich-text |  |
| Audience | rich-text |  |
| Lifetime | select | persistent, expires, session-only, until-task-closed, until-decision-superseded |
| Expires At | date |  |

Lore's schema is covered by Lore's MIT license (Copyright (c) 2026 Notion
Labs, Inc.).

## The columns the toolkit adds

On Memories only:

| Column | Type | Holds |
| --- | --- | --- |
| Record Key | text | The record's key, `<prefix>_<slug>` (`project_billing`, `decision_login_methods`). Records are found by it. |
| Superseded by | text | The key of the record that replaced this one. |
| Source note | text | Who or what said it, with a date. |
| Saved | date | The date of the last change. |
| Last verified | text | `YYYY-MM-DD`, or `unknown`. |
| Authorization | text | What allowed the save: `Approved by Mike on 2026-09-30`. |
| Work item IDs | text | The work item IDs the record relates to (`IML-3, IML-5`), and their links when the work items are not in this Notion workspace. |
| Other fields | text | Any other field of the record, as JSON. |

Tags also gets five options beside Lore's own: user, project, reference,
event, decision (the record's prefix).

## Links to work items

Only when the project's work items are also in Notion: a two-way relation
from each of Memories, Facts, and Entities to Work Items.

| Database | Column | Other side, on Work Items |
| --- | --- | --- |
| Memories | Work items | Memories |
| Facts | Work items | Facts |
| Entities | Work items | Entities |

A link is optional: a record need not belong to a work item. The "Work item
IDs" text column is filled in every setup, so a record names its items even
without the relation.

## Views

| Database | View | Grouping, filter, and order |
| --- | --- | --- |
| Memories | Index | Status accepted or proposed; by Record Key. |
| Memories | Decisions | Kind = decision, not deprecated; newest first. Project-wide decisions only (an item's own decisions live in its Questions and Answers). |
| Memories | By work item | Grouped by Work items (or by "Work item IDs" when work items are not in Notion); newest first. |
| Memories | Retired | Status superseded or deprecated; newest first. |

## Property order and page layout

The owner approved this grouping (2026-09-30). Hiding a property removes
nothing: Lore still finds every column by its name.

| Database | Heading (pinned) | Sections, in order | Hidden |
| --- | --- | --- | --- |
| Memories | Record Key, Kind, Status, Saved | About: Synopsis, Tags, Source note, Last verified, Authorization · Links: Work items, Work item IDs, Project, Topic, Supersedes, Superseded by · Decision: Decided At, Alternatives, Consequences | every other column: Task State, Blocked By, Entity, Topic Key, Revision Count, Compare Notes, Promotion Source Key, Review By, Done At, Last Referenced At, Author, Agent, Keywords, Expires On, Session, Scope Kind, Scope Key, Audience, Lifetime, Expires At, Pinned, Pinned Priority, Mutability, Source, Affects, Compared With, Other fields |
| Facts | Subject, Predicate, Object | Confidence, Valid From, Valid Until, Work items, Project, Source | every other column |
| Entities | Name, Kind | Description, Aliases, Work items, Project, Source | none |
| Topics | Name | Description, Project | none |
| Projects | Name, Type, Status | Path, Description | none |

Table views list the columns in this order (hidden ones `"visible": false`).

The page layout is set only in the Notion app, once per database of a
template (https://www.notion.com/help/layouts): open any page of the
database → "…" → Customize layout → pin the heading properties (up to 15;
the page title, such as Subject or Name, is always at the top) → "Add
section" for each named section, and drag its properties in → the eye
icon off for each hidden property → Apply to all pages. "Every page in
your database will have the same layout, and new pages you create will
also have that layout." A copy of the template keeps the layout (tested
2026-09-30). A property added after the layout is set appears in a visible
section. Right away, ask the owner to move it into its section from the
table above, or to hide it when the table's Hidden column covers it; for any
other property, ask him which section it goes in.

## The request bodies

`lore/`, in the order they are sent (setup.md):

| File | Sends |
| --- | --- |
| `01-projects-database.json` … `05-facts-database.json` | `POST v1/databases`, in this order (each relation needs the database it points at). |
| `06-memories-lore-self-relations.json` | Lore's Supersedes, Affects, Compared With on Memories. |
| `07-memories-toolkit-columns.json` | The toolkit's columns on Memories. |
| `08-memories-type-tags.json` | The five Tags options: a list, not a body; send them with every existing option (setup.md). |
| `09-memories-work-items-relation.json`, `09-facts-work-items-relation.json`, `09-entities-work-items-relation.json` | The Work items relations, one per database (only with work items in Notion). |
| `10-view-index.json` … `13-view-retired.json` | The views (10 renames the first view; `12-view-by-work-item-ids.json` replaces 12 without work items in Notion). |

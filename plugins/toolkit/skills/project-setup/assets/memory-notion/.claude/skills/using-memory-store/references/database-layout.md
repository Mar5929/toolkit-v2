# The Notion memory databases

How a project's memory looks in Notion, which column holds which part of a pointer, and every column of the five databases with its options. The bodies that create the databases are in `assets/schema/`. The views and page layout are in `views-and-layout.md`.

## Contents

- How memory looks in Notion
- Where each part of a pointer goes
- Links to work items
- Memories columns
- Projects columns
- Topics columns
- Entities columns
- Facts columns
- The columns the toolkit adds
- What is not written

## How memory looks in Notion

```text
<Project name>                   the project page, a row of the owner's Projects database (title column "Project")
├── Memory                       page: holds Lore's five databases
│   ├── Projects                 Lore's database (title column "Name"): one row, this project
│   ├── Topics                   not written
│   ├── Memories                 one page per pointer
│   ├── Entities                 not written
│   └── Facts                    not written
├── Current state                page (current-state-page.md)
└── Terminology glossary         page: not written
```

The owner's Projects database and Lore's Projects database are different databases. Every pointer links to the project's row in Lore's.

## Where each part of a pointer goes

One page of Memories is one pointer. A record gets one pointer.

| Part of a pointer | Memories column | Example |
| --- | --- | --- |
| What it points to | Title | The decision on which workspace a request belongs to |
| The ID of the record that holds the fact | Record Key, and Keywords | `DEC-004` |
| The link to that record | Synopsis | `DECISIONS.md` |
| The date it was created | The page's own created time, which Notion sets (`created_time` in the page's answer) | 2026-10-05 |
| The date it last changed | Saved | 2026-10-05 |
| The work item, when the record is one | Work item IDs (text), and the Work items relation when work items are in Notion | WI-31 |

Always set too: Tags `reference`, Kind `note`, Status `accepted`, Source `manual`, Author the owner's name, Agent `Claude Code` or `Codex`, and Project (the project's row in Lore's Projects database, whose id is in `PROJECT.md`). The page has no body. Every other column stays empty.

## Links to work items

- A pointer to a work item names it in Work item IDs, as text: `WI-31`.
- When the project's work items are in Notion too, also set the Work items relation to the item's page id. The item's page then shows the pointer under "Linked memory", and its Memories property lists it.
- The text and the relation name the same item. When they differ and the work items are in Notion, change the text to match the relation.

## Memories columns

Copied from Lore 1.0.0, commit `6e741b1bb91a36b47213f4d3af5bbdfaa2f2081d` (the "default@1.0.0" profile).

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

## Projects columns

| Property | Type | Options or target |
| --- | --- | --- |
| Name | title |  |
| Type | select | project, person, agent |
| Path | rich-text |  |
| Status | select | active, archived |
| Description | rich-text |  |

## Topics columns

| Property | Type | Options or target |
| --- | --- | --- |
| Name | title |  |
| Project | relation | Projects (two-way) |
| Description | rich-text |  |

## Entities columns

| Property | Type | Options or target |
| --- | --- | --- |
| Name | title |  |
| Aliases | rich-text |  |
| Kind | select | class, function, file, workflow, pr, task-id, person, system |
| Description | rich-text |  |
| Project | relation | Projects (two-way) |
| Source | relation | Memories (one-way) |

## Facts columns

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

Lore's schema is covered by Lore's MIT license (Copyright (c) 2026 Notion Labs, Inc.).

## The columns the toolkit adds

On Memories only:

| Column | Type | Holds |
| --- | --- | --- |
| Record Key | text | The ID of the record the pointer names (`DEC-004`, `SRC-012`, `SEC-04`, `WI-31`). Pointers are found by it. |
| Saved | date | The date of the last change. |
| Work item IDs | text | The ID of the work item the pointer names. |
| Superseded by, Source note, Last verified, Authorization, Other fields | text | Not written. |

Tags also gets five options beside Lore's own: user, project, reference, event, decision. A pointer's tag is `reference`. The other four are not written.

With work items in Notion, a two-way relation joins Work Items to each of Memories, Facts, and Entities:

| Database | Column | Other side, on Work Items |
| --- | --- | --- |
| Memories | Work items | Memories |
| Facts | Work items | Facts |
| Entities | Work items | Entities |

## What is not written

Memory holds pointers only, so these parts of the layout stay as they are and get no new content:

- the Topics, Entities, and Facts databases;
- the Terminology glossary page;
- on Memories: a page body, Kind `decision`, a Status other than `accepted`, the columns Decided At, Alternatives, Consequences, and Supersedes, and the toolkit columns marked "Not written" above.

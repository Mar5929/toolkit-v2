# The Notion memory databases

How a project's memory looks in Notion, every column of its five databases with its options, and which part of a memory goes in which column. The bodies that create the databases are in `assets/schema/`. The views and page layout are in `views-and-layout.md`.

## Contents

- How memory looks in Notion
- Where each part of a memory goes
- Status
- The page body
- Links to work items
- Memories columns
- Projects columns
- Topics columns
- Entities columns
- Facts columns
- The columns the toolkit adds
- Facts and Entities

## How memory looks in Notion

```text
<Project name>                   the project page, a row of the owner's Projects database (title column "Project")
├── Memory                       page: holds Lore's five databases
│   ├── Projects                 Lore's database (title column "Name"): one row, this project
│   ├── Topics                   not used
│   ├── Memories                 one page per concept; the page body is the memory
│   ├── Entities                 only when the owner wants a named thing found on its own
│   └── Facts                    only when the owner wants one dated statement found on its own
├── Current state                page (current-state-page.md)
└── Terminology glossary         page: one table of terms
```

The owner's Projects database and Lore's Projects database are different databases. Every memory page links to the project's row in Lore's.

## Where each part of a memory goes

One page of Memories is one concept, one episode (an `event_` page), or one project-wide decision (a `decision_` page).

| Part of a memory | Memories column | Example |
| --- | --- | --- |
| Key `<prefix>_<slug>` | Record Key, and Keywords | `project_deploys` |
| Title | Title | Deploys |
| One-line summary | Synopsis | How deploys work: the window, the release branch, the checks |
| Prefix | Tags: one of user, project, reference, event, decision | project |
| Date of the last change | Saved | 2026-09-30 |
| Status | Status (see "Status") | accepted |
| Who or what said it | Source note | Mike, 2026-09-30, kickoff call |
| Last checked against its source | Last verified: `YYYY-MM-DD`, or `unknown` | 2026-09-30 |
| What allowed the save | Authorization: `Approved by <owner> on <date>`, `Trusted grant, <date>`, or `Proposed by the agent on <date>; not approved` | Approved by Mike on 2026-09-30 |
| Work item IDs | Work item IDs (text), and the Work items relation when work items are in Notion | IML-3 |
| The page it replaced, and the page that replaced it | Supersedes (relation), and Superseded by (the key as text) | |
| Anything else | Other fields, as JSON | |

Always set too: Kind (`note`, or `decision` for a decision page), Source `manual`, Author the owner's name, Agent `Claude Code` or `Codex`, and Project (the project's row in Lore's Projects database, whose id is in `PROJECT.md`). Lore's other columns stay empty.

A decision page also sets Decided At, the date it was decided. It fills Alternatives with one line only when the owner named the options, and Consequences with one line only when he named the effects.

## Status

| Memory status | Status column |
| --- | --- |
| current | accepted |
| proposed, needs review | proposed |
| replaced by another page | superseded |
| retired | deprecated |
| withdrawn (a decision the owner withdrew, with no replacement) | deprecated |

A Status the owner changed by hand counts: "deprecated" reads as retired, and "proposed" as needing review. Lore's other options, informational and rejected, are not used.

## The page body

The body is the memory without a title line (Notion keeps the title in the Title column). Write it as Notion Markdown.

- **A concept page:** one `## <Sub-topic>` section for each fact or group of facts, labeled as `assets/concept-record.md` shows, and a last section `## Gotchas and lessons` ("None yet." at first).
- **A decision page:** four sections, `## Decision`, `## How to apply it`, `## Where it was decided`, and `## Gotchas and lessons` (`assets/decision-record.md`). "Where it was decided" names the work item and the Q-ID of its Questions and Answers row: "Decided in IML-3, Q-04, on 2026-09-30, by Mike."
- **A lesson:** a `### <lesson>` heading under `## Gotchas and lessons`, then a `**Seen:**` line giving the date, and the session or work item, of each time it came up. A lesson that became a rule or a skill gets a `**Promoted:** <date>, to <where>` line and stays as history.
- **A retired page:** a last section `## Retired` with the date and the owner's words as the reason.
- **Size:** a concept page holds about 20 sections or 300 lines at most. A bigger one is two concepts.

## Links to work items

- Every page that relates to a work item names it in Work item IDs, as text: `IML-3` or `IML-3, IML-5`.
- When the project's work items are in Notion too, also set the Work items relation to their page ids. The item's page then shows the memory under "Linked memory", and its Memories property lists it.
- When the work items are elsewhere (local files, GitHub, Jira), add each item's link after its ID in Work item IDs when it has one: `#3 https://github.com/<owner>/<repo>/issues/3`.
- The text and the relation name the same items. When they differ and the work items are in Notion, change the text to match the relation.
- A link is optional: a page about the whole project links to nothing.

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
| Record Key | text | The page's key, `<prefix>_<slug>` (`project_billing`, `decision_login_methods`). Pages are found by it. |
| Superseded by | text | The key of the page that replaced this one. |
| Source note | text | Who or what said it, with a date. |
| Saved | date | The date of the last change. |
| Last verified | text | `YYYY-MM-DD`, or `unknown`. |
| Authorization | text | What allowed the save. |
| Work item IDs | text | The IDs of the work items the page relates to, and their links when the work items are not in this Notion workspace. |
| Other fields | text | Any other field of the memory, as JSON. |

Tags also gets five options beside Lore's own: user, project, reference, event, decision. The page's prefix is its tag.

With work items in Notion, a two-way relation joins Work Items to each of Memories, Facts, and Entities:

| Database | Column | Other side, on Work Items |
| --- | --- | --- |
| Memories | Work items | Memories |
| Facts | Work items | Facts |
| Entities | Work items | Entities |

## Facts and Entities

Entities are named things (a system, a person, a file). Facts are one dated statement ("billing uses Stripe"). The toolkit keeps memory in Memories pages. Add an Entity or a Fact only when the owner wants that thing found on its own. Each links to work items the same way, through its own Work items column.

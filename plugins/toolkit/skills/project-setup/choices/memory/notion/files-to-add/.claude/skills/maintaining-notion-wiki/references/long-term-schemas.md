# Long-Term Memory collection schemas

This reference records the owner's template fields inspected on October 11, 2026. Inspect each installed project's live schema before using it. Names and types below are a reference, not authorization to add fields or options. Verify relations against the configured project and data source identifiers in `PROJECT.md`.

## Projects

| Property | Type | Options or relationship |
| --- | --- | --- |
| Description | text |  |
| Name | title |  |
| Path | text |  |
| Related to Entities (Project) | relation | Entities |
| Related to Topics (Project) | relation | Topics |
| Status | select | active, archived |
| Type | select | project, person, agent |

## Topics

| Property | Type | Options or relationship |
| --- | --- | --- |
| Description | text |  |
| Name | title |  |
| Project | relation | Projects |

## Memories

| Property | Type | Options or relationship |
| --- | --- | --- |
| Affects | relation | Memories |
| Agent | text |  |
| Alternatives | text |  |
| Audience | text |  |
| Author | text |  |
| Authorization | text |  |
| Blocked By | text |  |
| Compare Notes | text |  |
| Compared With | relation | Memories |
| Consequences | text |  |
| Decided At | date |  |
| Done At | date |  |
| Entity | text |  |
| Expires At | date |  |
| Expires On | text |  |
| Keywords | text |  |
| Kind | select | note, decision, incident, runbook, postmortem, policy, state, operational, task, procedure |
| Last Referenced At | date |  |
| Last verified | text |  |
| Lifetime | select | persistent, expires, session-only, until-task-closed, until-decision-superseded |
| Mutability | select | mutable, read-only |
| Other fields | text |  |
| Pinned | checkbox |  |
| Pinned Priority | number |  |
| Project | relation | Projects |
| Promotion Source Key | text |  |
| Record Key | text |  |
| Review By | date |  |
| Revision Count | number |  |
| Saved | date |  |
| Scope Key | text |  |
| Scope Kind | select | team, project, user, agent, role, session, run, environment, global |
| Session | text |  |
| Source | select | conversation, autosave_learning, file, manual, agent_diary, digest |
| Source note | text |  |
| Status | select | informational, proposed, accepted, superseded, deprecated, rejected |
| Superseded by | text |  |
| Supersedes | relation | Memories |
| Synopsis | text |  |
| Tags | multi_select | android, api, architecture, audit, backend, bug, build, ci, code-review, concurrency, config, convention, data-model, db, decision-context, dependency, deployment, docs, error-handling, frontend, gotcha, incident, infrastructure, investigation, ios, migration, observability, onboarding, performance, policy, postmortem, refactor, runbook, security, testing, tooling, ui, ux, web, workflow, user, project, reference, event, decision |
| Task State | select | open, in-progress, blocked, done, cancelled |
| Title | title |  |
| Topic | relation | Topics |
| Topic Key | text |  |
| Work item IDs | text |  |
| Work items | relation | Work Items; verify this project’s tracker target |

## Entities

| Property | Type | Options or relationship |
| --- | --- | --- |
| Aliases | text |  |
| Description | text |  |
| Kind | select | class, function, file, workflow, pr, task-id, person, system |
| Name | title |  |
| Project | relation | Projects |
| Source | relation | Memories |
| Work items | relation | Work Items; verify this project’s tracker target |

## Facts

| Property | Type | Options or relationship |
| --- | --- | --- |
| Audience | text |  |
| Confidence | select | certain, likely, speculative |
| Confidence Score | number |  |
| DedupKey | text |  |
| Expires At | date |  |
| Invalidated At | date |  |
| Invalidated By | relation | Memories |
| Last Referenced At | date |  |
| Lifetime | select | persistent, expires, session-only, until-task-closed, until-decision-superseded |
| Object | text |  |
| ObjectEntity | relation | Entities |
| Observed At | date |  |
| Predicate | select | is_a, has_a, related_to, uses, depends_on, created_by, owned_by, replaces, extends, conflicts_with, needs_action, waiting_on, blocked_by, decided_by, supersedes_decision, informs, mentions |
| Project | relation | Projects |
| Review By | date |  |
| Scope Key | text |  |
| Scope Kind | select | team, project, user, agent, role, session, run, environment, global |
| Source | relation | Memories |
| Subject | title |  |
| SubjectEntity | relation | Entities |
| SubjectKey | text |  |
| Valid From | date |  |
| Valid Until | date |  |
| Work items | relation | Work Items; verify this project’s tracker target |

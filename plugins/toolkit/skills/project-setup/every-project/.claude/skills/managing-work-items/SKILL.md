---
name: managing-work-items
description: 'Finds and manages work items from idea to Done, keeping requirements, State, progress, and owner approvals current. Use when the owner asks about, starts, continues, changes, tests, ships, closes, or cancels a work item, or changes project phases or project tasks. For shared decisions, sources, and system rules, use filing-project-records.'
---

# Managing work items

Use this skill when a turn concerns a work item, a project phase, or a project task. The goal is to keep the work record accurate and follow the required steps and approvals from the first idea through Done or Cancelled.

Start with [the lifecycle rules](references/lifecycle-rules.md). They define the work item's State and Status, the four levels of work, the approval points, and the rules that apply in every State. Then open [the installed work tracker instructions](references/work-tracker.md) for every read and save. This project has only the local, Notion, or GitHub version that setup selected. Read the relevant procedure below for the work item's current State or the change requested.

If the owner asks only a question about a work item, read the current record and answer it. Do not advance the work item merely because you read it. If the item is unclear, use the root `AGENTS.md` identification order and ask when more than one item remains plausible.

Use `filing-project-records` for sources and the configured shared-record routes. Follow the memory choice in `PROJECT.md`: `managing-project-memory` handles local memory or Notion wiki retrieval and capture; `.claude/rules/hindsight-memory.md` handles Hindsight. Working questions and designs stay in their work items. Hindsight projects keep current work in the tracker and have no Current State page. The lifecycle rules say when each of these jobs applies.

## Work-item procedures

| File | Open it when |
| --- | --- |
| [references/lifecycle-rules.md](references/lifecycle-rules.md) | Every work-item turn. It gives the State map, levels, approval points, common safeguards, and the full reference list. |
| [references/work-tracker.md](references/work-tracker.md) | Every read or save of a work item, project phase, or project task. It gives the selected store's steps and links to its detailed instructions. |
| [references/refining-requirements.md](references/refining-requirements.md) | The item is in Refining Requirements, or a requirement changes in any State. |
| [references/designing.md](references/designing.md) | The item is in Designing. |
| [references/building.md](references/building.md) | The item is in Building, or the owner wants a team of helpers. |
| [references/team-arrangement.md](references/team-arrangement.md) | Building involves choosing or coordinating helpers or other chats. |
| [references/build-repository.md](references/build-repository.md) | Building needs a branch, worktree, Git writes, or permission handling. |
| [references/testing-loop.md](references/testing-loop.md) | The item is in the Testing Loop. |
| [references/closing.md](references/closing.md) | The item is in Reflecting, is being marked Done or Cancelled, or was closed by hand. |
| [references/deploying.md](references/deploying.md) | The item is in Deploying. |
| [references/salesforce-deploying.md](references/salesforce-deploying.md) | You deploy this item in a Salesforce project. |

## Templates and helper briefs

| File | Open it when |
| --- | --- |
| [assets/work-item-template.md](assets/work-item-template.md) | Local or GitHub: you create an item or need its field and section forms. Notion uses its database's default template. |
| [assets/design-template.md](assets/design-template.md) | Local or GitHub: you start a design. Notion uses the generated Solution Design page. |
| [references/requirements-analyst-brief.md](references/requirements-analyst-brief.md) | You start the helper that checks requirements. |
| [references/researcher-brief.md](references/researcher-brief.md) | You start a research helper. |
| [references/design-architect-brief.md](references/design-architect-brief.md) | You start a helper to write one design option. |
| [references/design-critic-brief.md](references/design-critic-brief.md) | You start a helper to check a design option. |
| [references/builder-brief.md](references/builder-brief.md) | You start a builder. |
| [references/acceptance-checker-brief.md](references/acceptance-checker-brief.md) | You start the separate checker in the Testing Loop. |

With Notion work items, setup also installs these references. Open them for the corresponding action; they are absent with other tracker choices.

| File | Open it when |
| --- | --- |
| [references/work-tracker-page-updates.md](references/work-tracker-page-updates.md) | You update a Notion work-item page. |
| [references/work-tracker-commands.md](references/work-tracker-commands.md) | You need the Notion tracker commands. |
| [references/work-tracker-known-problems.md](references/work-tracker-known-problems.md) | A Notion tracker read or write fails, or you need a documented workaround. |

Local and GitHub trackers install the supporting files below. Open only the files supplied by the selected tracker and needed for the current action.

| File | Tracker and when to open it |
| --- | --- |
| [references/work-tracker-folders-and-files.md](references/work-tracker-folders-and-files.md) | Local: you locate or create work-item folders and files. |
| [references/work-tracker-field-mapping.md](references/work-tracker-field-mapping.md) | Local: you fill or update the work item's fields. |
| [references/work-tracker-issue-layout.md](references/work-tracker-issue-layout.md) | GitHub: you create or update an issue's body. |
| [references/work-tracker-labels.md](references/work-tracker-labels.md) | GitHub: you map work-item fields to labels. |
| [references/work-tracker-gh-commands.md](references/work-tracker-gh-commands.md) | GitHub: you need issue, label, or sub-issue commands. |
| [references/work-tracker-project-roadmap-and-tasks.md](references/work-tracker-project-roadmap-and-tasks.md) | Local or GitHub: you maintain project phases or tasks outside a work item. |
| [references/work-tracker-searching.md](references/work-tracker-searching.md) | Local or GitHub: you find work items, recent changes, or project tasks. |

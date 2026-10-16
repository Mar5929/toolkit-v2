# Preview - Notion work items, Notion memory

<!-- Fill-in guide: replace <Project name> and every angle-bracket prompt with verified information in that exact field, row, or paragraph. Add a table row for each real system and each person. Keep stable project facts here, and keep active tasks where the work items are kept. Delete this guide when every prompt is filled. -->

## Purpose and intended outcome

- Purpose: `<Why this project exists.>`
- Intended outcome: A preview of a finished Toolkit V2 setup for this mix of choices.

## Scope and boundaries

- In scope: `<Business capabilities or systems this project owns.>`
- Outside scope: `<Important exclusions or adjacent owners.>`
- Constraints: the approved rules that cover several areas of the system are kept where [AGENTS.md](AGENTS.md), "Where information goes", says.

## Systems and environments

| System or org | Purpose | Environment | Source of truth | Access notes |
| --- | --- | --- | --- | --- |
| `<name>` | `<role>` | `<sandbox, production, etc.>` | `<verified location>` | `<how access is managed>` |

## People and ownership

| Role | Person or team | Responsibility | May decide | Source / last confirmed |
| --- | --- | --- | --- | --- |
| Owner | Mike Rihm | Makes the project's decisions | Every decision: requirements, designs, results, merges, and Done | Setup, 2026-10-16 |

Write one row for each person or team, with what they do and what they may decide. Write no biography and no contact details.

## Resources and project paths

- Source code: `<actual source path>`
- Tests: `<actual location of the tests>`. The commands that build, test, and deploy are in `AGENTS.md`, "Commands".

## Operating conventions

<Stable facts about how the client's business and this project's team work that are not rules of the system and not instructions for the agent, such as the month the fiscal year starts, the days a release may happen, or who must review a change. Give the source of each: who said it and the date, or an ID. A rule the system must follow goes where `AGENTS.md`, "Where information goes", says. An instruction for how the agent works goes in `.claude/rules/owner-preferences.md`. Write “None yet” if there are none.>

## Toolkit settings

<!-- Fill-in guide: the `project-setup` skill fills this section at setup and changes a value only when the owner changes a setup choice. The work and memory skills read these values, so keep every line and each label exactly as written. Each setup choice adds its own lines below these two. -->

- Tracker: `notion`
- Memory: `notion`
- Work item ID prefix: `<Work item ID prefix - picked and set in Notion at real setup>`
- Notion work items:
  - Project page: <Notion Project page URL - filled at real setup>
  - Work Items: database <Work Items database ID - filled at real setup>, data source <Work Items data source ID - filled at real setup>
  - Phases: database <Phases database ID - filled at real setup>, data source <Phases data source ID - filled at real setup>
  - Tasks: database <Tasks database ID - filled at real setup>, data source <Tasks data source ID - filled at real setup>
  - Projects database: data source <owner's Projects data source ID - filled at real setup>
- Notion memory:
  - Project Wiki page: <Project Wiki URL - filled at real setup>, page <Project Wiki page ID - filled at real setup>
  - Librarian processing skill: <Librarian processing skill URL - filled at real setup>, page <Librarian processing skill page ID - filled at real setup>
  - Librarian project context: <Librarian project context URL - filled at real setup>, page <Librarian project context page ID - filled at real setup>
  - Wiki Inbox: database <Wiki Inbox database ID - filled at real setup>, data source <Wiki Inbox data source ID - filled at real setup>
  - Current state page: <Current state page ID - filled at real setup>
  - Long-Term Memory page: <Long-Term Memory URL - filled at real setup>, page <Long-Term Memory page ID - filled at real setup>
  - Terminology Glossary: database <Terminology Glossary database ID - filled at real setup>, data source <Terminology Glossary data source ID - filled at real setup>
  - Product Wiki: database <Product Wiki database ID - filled at real setup>, data source <Product Wiki data source ID - filled at real setup>
  - Memories: database <Memories database ID - filled at real setup>, data source <Memories data source ID - filled at real setup>
  - Facts: database <Facts database ID - filled at real setup>, data source <Facts data source ID - filled at real setup>
  - Entities: database <Entities database ID - filled at real setup>, data source <Entities data source ID - filled at real setup>
  - Long-Term Memory Projects: database <Long-Term Memory Projects database ID - filled at real setup>, data source <Long-Term Memory Projects data source ID - filled at real setup>; this project's row <Long-Term Memory Projects row ID - filled at real setup>
  - Topics: database <Topics database ID - filled at real setup>, data source <Topics data source ID - filled at real setup>
  - Librarian schedule: <the scheduled job and when it runs - set up at real setup>

# Preview - Notion work items, Hindsight memory

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
| None | The owner named no systems at setup. | None | None | None |

## People and ownership

| Role | Person or team | Responsibility | May decide | Source / last confirmed |
| --- | --- | --- | --- | --- |
| Owner | Mike Rihm | Makes the project's decisions | Every decision: requirements, designs, results, merges, and Done | Setup, 2026-10-16 |

Write one row for each person or team, with what they do and what they may decide. Write no biography and no contact details.

## Resources and project paths

- Source code: `<actual source path>`
- Tests: `<actual location of the tests>`. The commands that build, test, and deploy are in `AGENTS.md`, "Commands".
- Notion command-line tool: `ntn`, signed in as the owner. The agent reaches the work items in Notion with it.
- Hindsight coding-agent add-on: `@vectorize-io/hindsight-coding-agents`. It connects Claude Code and Codex to the project's Hindsight bank.
- Humanizing resource: `<name of the humanizing skill or plugin and how to invoke it - recorded at real setup>`

## Operating conventions

<Stable facts about how the client's business and this project's team work that are not rules of the system and not instructions for the agent, such as the month the fiscal year starts, the days a release may happen, or who must review a change. Give the source of each: who said it and the date, or an ID. A rule the system must follow goes where `AGENTS.md`, "Where information goes", says. An instruction for how the agent works goes in `.claude/rules/owner-preferences.md`. Write “None yet” if there are none.>

## Toolkit settings

<!-- Fill-in guide: the `project-setup` skill fills this section at setup and changes a value only when the owner changes a setup choice. The work and memory skills read these values, so keep every line and each label exactly as written. Each setup choice adds its own lines below these two. -->

- Tracker: `notion`
- Memory: `hindsight`
- Work item ID prefix: `<PREFIX>`
- Notion work items:
  - Project page: <url>
  - Work Items: database <id>, data source <id>
  - Phases: database <id>, data source <id>
  - Tasks: database <id>, data source <id>
  - Projects database: data source <id>
- Hindsight bank: `<confirmed bank ID - filled at real setup>`
- Hindsight bank scope: `This project only, shared by the project's Claude Code and Codex sessions. No tag convention.`
- Hindsight server: `https://memory-api.mrihm-memory.com`
- Hindsight dashboard: `https://memory.mrihm-memory.com/banks/<confirmed bank ID - filled at real setup>`
- Hindsight package: `default`
- Hindsight template: `Toolkit coding-project instructions`
- Hindsight changes: `None.`
- Hindsight service: `<operator and runbook location, verified provider and model profile, capacity and retrieval profile, authentication-persistence check, and backup and recovery status - filled at real setup>`
- Hindsight setup: `Not done. Steps 1 and 5 to 8 of the Hindsight setup remain: check the server, the add-on, and the bank; install the add-on with capture off; configure the bank and apply the missions; verify protections and turn capture on; verify in a new session in each host. No add-on patches applied.`

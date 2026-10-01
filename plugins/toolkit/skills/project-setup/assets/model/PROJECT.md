# <Project name>

<!-- Fill-in guide: replace <Project name> and every angle-bracket prompt with verified information in that exact field, row, or paragraph. Add a table row for each real system and owner. Remove unused optional routes after the owner's setup choices; keep stable project facts here and active tasks in the chosen tracker. Delete this guide after setup. -->

## Purpose and intended outcome

<!-- if salesforce -->
- Purpose: `<Why this Salesforce project exists.>`
<!-- endif -->
<!-- if not salesforce -->
- Purpose: `<Why this project exists.>`
<!-- endif -->
- Intended outcome: `<What success means to the owner and users.>`

## Scope and boundaries

- In scope: `<Business capabilities or systems this project owns.>`
- Outside scope: `<Important exclusions or adjacent owners.>`
- Constraints: `<Approved security, delivery, or operating constraints with sources.>`

## Systems and environments

| System or org | Purpose | Environment | Source of truth | Access notes |
| --- | --- | --- | --- | --- |
| `<name>` | `<role>` | `<sandbox, production, etc.>` | `<verified location>` | `<how access is managed>` |

## People and ownership

| Role | Person or team | Responsibility | Source / last confirmed |
| --- | --- | --- | --- |
| `<role>` | `<name or unknown>` | `<decision or operating responsibility>` | `<source and date>` |

## Work and project records

- Work tracker: set under "Toolkit settings" below.
- Project roadmap: [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md)
- Decisions: every decision made while working an item is saved in its Questions and Answers first; a project-wide decision, after the owner's yes, also gets a memory record.
- Functional requirements: [requirements/](requirements/)
- Design home: `With its work item: local DESIGN.md or the external item's own record or attachments.`
- System Guide: `<enabled at system-guide/, or not used>`
<!-- if memory=local -->
- Local memory: `memory/` (local memory, flat and Git-ignored; the whole project folder opens as an Obsidian vault; the setup choice is under "Toolkit settings" below)
<!-- endif -->
<!-- if memory=hindsight -->
- Memory store: this project's bank on the owner's Hindsight server, and Current State in `memory/CURRENT_STATE.md` (the setup choice, the bank, the server address, and the dashboard link are under "Toolkit settings" below)
<!-- endif -->
<!-- if memory=notion -->
- Memory store: the memory databases on this project's Notion page, in Lore's layout (the setup choice is under "Toolkit settings" below)
<!-- endif -->

## Resources and project paths

<!-- if salesforce -->
- Salesforce source: `force-app/` or `<actual source path>`
- Project-wide deployment manifest: `delivery/deployment/full-project-deployment-template/package.xml` after the API version and members are verified. Keep it as the full project component inventory; ordinary deployments use narrower work-item packages.
- Work-item deployment manifests: `delivery/deployment/<work-item-id>-<short-name>/package.xml` when an item changes Salesforce metadata.
<!-- endif -->
- Tests and checks: `<actual commands and locations>`
- Outside references: `<source register or approved location>`

## Operating conventions

<Write only stable project-specific conventions here; link the source or governing rule. Write “None yet” if there are none.>

## Toolkit settings

<!-- Fill-in guide: the `project-setup` skill fills this section at setup and changes a value only when the owner changes a setup choice. The work and memory skills read these values, so keep each label exactly as written. -->

- Tracker: `<local, notion, github, or jira>`
- Memory: `<local, notion, or hindsight>`
<!-- if memory=local -->
- Memory approval: `<onboarding or trusted>`
<!-- endif -->
<!-- if memory=notion -->
- Memory approval: `<onboarding or trusted>`
<!-- endif -->
<!-- if tracker=local -->
- Work item ID prefix: `<WI>`
<!-- endif -->
<!-- if tracker=notion -->
- Work item ID prefix: `<WI>`
- Notion work items: `<links to the project's Notion page and its Work Items database>`
<!-- endif -->
<!-- if tracker=github -->
- GitHub repository: `<owner/name>`
<!-- endif -->
<!-- if tracker=jira -->
- Jira project: `<project key>`
- Jira status list: `<the Jira status used for each work item status: Backlog, Ready, In Progress, In Review, Done, Cancelled>`
<!-- endif -->
<!-- if memory=notion -->
- Notion memory: `<links to the project's memory page, its Lore databases (Projects, Topics, Memories, Entities, Facts), and the "Current state" page>`
<!-- endif -->
<!-- if memory=hindsight -->
- Hindsight bank: `<bank ID on the Hindsight server>`
- Hindsight server: `<API address of the Hindsight server>`
- Hindsight dashboard: `<link to this bank in the Hindsight dashboard>`
<!-- endif -->
<!-- if salesforce -->
- Salesforce org aliases: `<one line per org: alias, which org it is, and its purpose; mark production>`
<!-- endif -->

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

- Work tracker: `<one canonical service/project or local path>`
- Project roadmap: [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md)
- Project decisions: [DECISIONS.md](DECISIONS.md)
- Functional requirements: [requirements/](requirements/)
- Design home: `With its work item: local DESIGN.md or the external item's own record or attachments.`
- System Guide: `<Enabled at system-guide/ with .system-guide.json, or disabled>`
<!-- if memory=builtin -->
- Local memory: `.memory/` (built-in memory, flat, Git-ignored, and usable as an Obsidian vault; the setup choice is in `.toolkit.json`)
<!-- endif -->
<!-- if memory=hindsight -->
- Memory: this project's bank on the local Hindsight server (the setup choice is in `.toolkit.json`)
<!-- endif -->
<!-- if memory=notion -->
- Memory: the Memory database on this project's Notion page (the setup choice is in `.toolkit.json`)
<!-- endif -->
- Memory backup or sync: `<Owner-approved destination and restore procedure, outside this repository>`

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

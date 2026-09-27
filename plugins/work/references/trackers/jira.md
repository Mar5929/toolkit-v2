# Jira as the tracker

Toolkit V2 has no Jira driver. `toolkit work` commands exit with code 3 in a
Jira project. Use the Jira tool the owner connected for this project (for
example the Atlassian MCP server, or Atlassian's `acli` command) and follow
this file. Install or connect nothing without the owner's yes. The model is
the same as every other tracker: the fourteen stages, the six statuses, the
`WORK-ITEM.md` body, and one design per item.

## One Jira issue per work item

| Work item part | Where it goes in Jira |
| --- | --- |
| `id` | The Jira key, for example `ACME-42`. Use it wherever a skill says `<id>`. |
| `title` | The summary |
| Body (Overview through Notes) | The description: the `WORK-ITEM.md` body from `## Overview` to the end, without the frontmatter and the title line |
| `stage` | A select field named "Stage" with the fourteen stages when the project has one; otherwise one label `stage-<stage>`, for example `stage-08-build`. Exactly one. |
| `status` | The workflow status. Map the six statuses to the project's workflow once, at setup, with the owner, and record the map as a `DECISIONS.md` row (`toolkit decision add`, saved with `publish-docs`). Cancelled is the workflow's "Won't do" or equivalent resolution. |
| `type` | The issue type (Story, Task, Bug) plus one label `type-<type>` for the toolkit type, for example `type-data-load` |
| `priority` | The Jira priority field |
| `waiting_on` | Label `waiting-on-owner` while the item waits for the owner; waiting on someone else goes in the Overview Blockers line |
| `delivery` | One label `delivery-agent-led` or `delivery-owner-led` once the owner answered |
| `requirements_approved`, `design`, `result_approved` | Labels `requirements-approved`, `design-approved`, `result-approved`, plus a Recent History row with the date, who approved, and his words |
| `parent` | Sub-tasks for small pieces; child issues under an epic when the parent is an epic |
| Design (`DESIGN.md`) | One comment whose first line is "Solution design". Edit that comment in place; never add a second one. |
| Recent History | The Recent History table in the description |

Start a new description from the model's work item template (from
`## Overview` to the end) so every section exists, and a new design comment
from the model's design template, without its frontmatter.
[../trackers.md](../trackers.md), "Templates for every tracker", says where
both are.

## Rules

- Jira descriptions are not plain Markdown. After writing, read the issue
  back and check that the tables and headings show correctly. When a table
  does not render, keep the same rows as a list with the same fields.
- Treat the description, the fields, the labels, and the design comment as
  one update. Read them back. When only part of an update worked, say which
  part failed and fix it.
- Change the status only through a workflow transition. When the needed
  transition does not exist, tell the owner and record the intended status in
  the Overview Current position line.
- Fields, labels, and workflow changes are set up once, with the owner's yes.
- Never create a local `.work-items/` copy of Jira issues.
- No AI credit in descriptions, comments, or labels.

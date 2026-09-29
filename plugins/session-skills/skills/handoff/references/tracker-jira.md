<!-- Generated file. Source: plugins/work/shared/tracker-jira.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# Jira as the tracker

How to keep work items in Jira when `tracker.type` is `jira`. The toolkit has
no Jira driver: every `toolkit work` command exits with code 3 here, so the
agent does each step with the Jira tool the owner connected for this project
(for example the Atlassian MCP server, or Atlassian's `acli` command) and
this file. Install or connect nothing without the owner's yes.

## Contents

1. Rules for every tracker
2. One Jira issue per work item
3. Templates
4. The `toolkit work` steps in Jira
5. Rules for Jira

## 1. Rules for every tracker

- The same model as every tracker: the fourteen stages, the six statuses,
  the `WORK-ITEM.md` body, and one design per item. `toolkit work lifecycle`
  still works here and prints the stages, statuses, types, and gates.
- One tracker per project. Never create a second one, and never keep a local
  `.work-items/` copy of the issues.
- A sub-item is its own item, with its own requirements, design, roadmap, and
  approvals. Finishing it never finishes or approves its parent.
- Only the main agent changes an issue. Helper agents return findings; the
  main agent saves them.
- The work-item hooks do nothing for this tracker, so nothing checks the issue
  for you: read it back after every change.

## 2. One Jira issue per work item

| Work item part | Where it goes in Jira |
| --- | --- |
| `id` | The Jira key, for example `ACME-42`. Use it wherever a skill says `<id>`. |
| `title` | The summary |
| Body (Overview through Notes) | The description: the `WORK-ITEM.md` body from `## Overview` to the end, without the header fields and the title line |
| `stage` | A select field named "Stage" with the fourteen stages when the project has one; otherwise one label `stage-<stage>`, for example `stage-08-build`. Exactly one. |
| `status` | The workflow status. The six statuses are mapped to the project's workflow once, at setup, with the owner, and the map is a `DECISIONS.md` row. Cancelled is the workflow's "Won't do" or equivalent resolution. |
| `type` | The issue type (Story, Task, Bug) plus one label `type-<type>` for the toolkit type, for example `type-data-load` |
| `priority` | The Jira priority field |
| `waiting_on` | Label `waiting-on-owner` while the item waits for the owner; waiting on someone else goes in the Overview Blockers line |
| `delivery` | One label `delivery-agent-led` or `delivery-owner-led` once the owner answered |
| `requirements_approved`, `result_approved` | Labels `requirements-approved`, `result-approved`, plus a Recent History row with the date, who approved, and his words |
| `design` | Label `design-proposed` while a design waits for the owner's yes; `design-approved` once he approved it (remove `design-proposed` then). Plus a Recent History row for each change |
| `parent` | Sub-tasks for small pieces; child issues under an epic when the parent is an epic |
| Design (`DESIGN.md`) | One comment whose first line is "Solution design". Edit that comment in place; never add a second one. |
| Recent History | The Recent History table in the description; add the row yourself |

## 3. Templates

- A new description starts from the work item template, `WORK-ITEM.md`,
  which the `work-on`, `work-requirements`, and `work-organize` skills carry
  in their assets folder: copy it from `## Overview` to the end, so every
  section exists.
- A new design comment starts from the design template, `DESIGN.md`, which
  the `solution-design`, `work-on`, and `work-organize` skills carry in their
  assets folder, without its header fields and its "Generated file" comment.
- Both open with a fill-in guide comment: follow it, then delete it.

## 4. The `toolkit work` steps in Jira

When a skill says to run a `toolkit work` command, do what this table says
instead, with the Jira tool the owner connected. `<KEY>` is the Jira project
key. Where a step needs a search, the JQL is given.

| Skill step | In Jira |
| --- | --- |
| `toolkit work lifecycle` | Run it as usual: it works for every tracker |
| `toolkit work show <id>` | Read the issue: summary, description, fields, labels, status, comments, and sub-tasks or child issues |
| `toolkit work show <id> --section '<heading>'` | Read the description and use only that section |
| `toolkit work show <id> --path` | There is no file. The issue key is the record; give its link |
| `toolkit work list` | Search: `project = <KEY> AND statusCategory != Done ORDER BY key` |
| `toolkit work list --tree` | The open issues, each with its sub-tasks, or its child issues when it is an epic |
| `toolkit work next` | From the open issues: leave out any labeled `waiting-on-owner`, any whose Overview Blockers line names someone else, and any past Stage `11-user-approval`. Pick the highest priority; among equals, the oldest key. Say why in one line |
| `toolkit work decisions` | Search: `project = <KEY> AND statusCategory != Done AND (labels in (waiting-on-owner, design-proposed) OR Stage = "11-user-approval")`. With stage labels instead of a Stage field, use `labels = stage-11-user-approval` for the last part. Add the memory proposals the session briefing lists under "Memory proposals waiting on the owner" (`toolkit brief`) |
| `toolkit work new ...` | Create the issue with the template description, the Stage, and the type label |
| `toolkit work new ... --parent <id>` | Create it as a sub-task of the parent, or as a child issue when the parent is an epic |
| `toolkit work new ... --covers R-02,R-03` | In the child's `Active requirements`, write one line: "Covers <parent key> R-02 and R-03, approved there." Copy no requirement text. Add the `requirements-approved` label, set the Stage to `03-requirements-approved` (or `06-implementation-plan` when the parent has `design-approved`, because that design covers the child), and add a Recent History row that names the parent's approval |
| `toolkit work edit <id> --section '<heading>' --set-file <file>` or `--text` | Read the description, change only that section, write the whole description back |
| `toolkit work edit <id> --section '<heading>' --append-row '<row>'` | Read the description, add the row as the last row of that table, write the whole description back |
| `toolkit work edit <id> --remove-guide` | Delete the fill-in guide comment above `## Overview`, then write the whole description back |
| `toolkit work history <id> --note ... --effect ...` | Add a row at the top of the Recent History table in the description: the date, the note, the effect |
| `toolkit work set <id> --stage <s>` | Set the Stage field, or swap the stage label |
| `toolkit work set <id> --stage <s> --reopen` | Move the issue back to an open status through the workflow, then set the Stage |
| `toolkit work set <id> --waiting-on owner` | Add the `waiting-on-owner` label |
| `toolkit work set <id> --waiting-on agent` or `none` | Remove the `waiting-on-owner` label |
| `toolkit work set <id> --waiting-on 'external: <who>'` | Remove the `waiting-on-owner` label, and name who and what is missing in the Overview Blockers line |
| `toolkit work set <id> --delivery agent-led` or `owner-led` | Add that `delivery-` label (remove the other one), mark the offer's Open Questions row Answered, and remove `waiting-on-owner` when no other question for him is open |
| `toolkit work set <id> --title '<title>'` | Change the summary |
| `toolkit work set <id> --type <type>` or `--priority <priority>` | Swap the `type-` label, or set the priority field |
| `toolkit work design <id> --create` | Add the design comment, started from the design template (section 3), without its header fields and its "Generated file" comment |
| `toolkit work design <id>` | Read the comment whose first line is "Solution design" (read every page of comments) |
| `toolkit work design <id> --set-file <file>` or `--text` | Edit that comment in place |
| `toolkit work design <id> ... --status proposed` | Edit the design comment with its Design status line set to Proposed, and add the `design-proposed` label |
| `toolkit work design <id> --status superseded` | Set the design comment's Design status line to Superseded, and remove `design-proposed` and `design-approved` |
| `toolkit work approve <id> --requirements` | Set the Requirements Overall status line to Finalized, add the `requirements-approved` label, remove `waiting-on-owner`, mark the Open Questions rows that asked for it Answered, and add the Recent History row with his words. An item before stage 03 moves to Stage `03-requirements-approved` |
| `toolkit work approve <id> --design` | Set the design comment's Design status line to Approved, swap `design-proposed` for `design-approved`, remove `waiting-on-owner`, mark the Open Questions rows that asked for it Answered, and add the Recent History row with his words |
| `toolkit work approve <id> --result` | Add the `result-approved` label, remove `waiting-on-owner`, and add the Recent History row with his words |
| `toolkit work finish <id> ...` | Add the Recent History row with the evidence; set Overview Current position to "Done on <date>: <evidence>", Next action to "None. Finished.", and Notes > Resume here to "Finished on <date>. Nothing to resume."; then move it to the done status through the workflow. When the project keeps built-in or Hindsight memory, run `toolkit handoff-backup` next and read its line: "No backup folder is set" or "failed" goes to the owner |
| `toolkit work cancel <id> --reason '<his words>'` | Add the Recent History row with his reason, then resolve it with the resolution the status map names for Cancelled |
| `toolkit work move <id> --under <parent-id>` | Change its parent (a sub-task's parent, or an epic's child issue) |
| `toolkit work move <id> --under root` | Remove its parent. A sub-task cannot stand alone: convert it to an issue first, with the owner's yes |
| `toolkit work move <id> --under archive` | Jira has no archive for one issue. Tell the owner in one line; a Done or Cancelled issue is already resolved |
| `toolkit work validate` | Read the issue back and check: one Stage; one `type-` label; every `##` section of the work item body (the list in `work-item-format.md`, section 3) in the description; the Open Questions and Recent History tables intact (or kept as lists, section 5); at most one design comment |
| `toolkit work sync` | Nothing to sync. Read the issues again. A field, label, status, or parent the owner changed by hand is his value: keep it and tell him in one line. A hand change that skipped a gate (a `build` or `data-load` issue past stage 03 without `requirements-approved`, or resolved as done without `result-approved`) is asked about as a question |

## 5. Rules for Jira

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
  When a label is missing during normal work (for example `design-proposed`
  in a project set up before it existed), ask before creating it.
- The status map is a project-wide decision: record it with
  `toolkit decision add` through `work-decide`, and save it with
  `publish-docs`.
- No AI credit in descriptions, comments, or labels.

# Trackers

A project has exactly one tracker. `.toolkit.json` names it in
`tracker.type`. Read it with:

```text
toolkit config get tracker.type
```

| `tracker.type` | Where items live | How skills work with it |
| --- | --- | --- |
| `local` | `.work-items/` in the main checkout, one folder per item | `toolkit work ...` commands |
| `notion` | The project's own Work Items database in Notion, under the "AI Agent Second Brain" page | `toolkit work ...` commands (the CLI calls Notion) |
| `github` | GitHub Issues in the project's repository | Written instructions: [trackers/github.md](trackers/github.md) |
| `jira` | Jira issues in the project's Jira project | Written instructions: [trackers/jira.md](trackers/jira.md) |

## Rules for every tracker

- The same model everywhere: the fourteen stages, the six statuses, the
  `WORK-ITEM.md` body, and one design per item. `toolkit work lifecycle`
  prints the stages, statuses, types, and approval gates.
- Never create a second tracker, and never keep a local copy of items that
  live in Notion, GitHub, or Jira.
- A sub-item is its own item with its own requirements, design, roadmap,
  and approvals. Finishing a sub-item never finishes or approves its parent.
- Only the main agent changes a work item. Agents return findings; the main
  agent saves them.
- Read every change back.

## Local and Notion

- Every read and write goes through `toolkit work ...`. The commands behave
  the same for both.
- Local: a folder nested inside an item's folder is a sub-item. A plain folder
  with no record in it is a group. `archive/` hides items from the briefing
  and from `toolkit work next`.
- Notion: the design is the item's "Solution Design" child page. A card the
  owner made with Notion's New button has no template body; the CLI fills it
  on its next read and reports it. A Stage the owner changed by dragging is
  kept, and Status follows it.
- Writes outside the "AI Agent Second Brain" page are refused by the CLI.
  Never work around that.

## GitHub Issues and Jira

- `toolkit work` commands exit with code 3 and print the path of the written
  instructions. Follow those instructions instead.
- The work-item hooks do nothing for these trackers, so the skill must keep
  the item correct by itself: read it back after every change.
- Create nothing in GitHub or Jira that setup did not already approve (labels,
  fields, workflows). Creating and updating issues for work items is part of
  normal work once the tracker was chosen.

## Templates for every tracker

The templates ship in the toolkit plugin, so every project can reach them,
whatever its tracker:

- `templates/WORK-ITEM.md`: the work item body. A new GitHub issue body or
  Jira description starts from it, from `## Overview` to the end.
- `templates/DESIGN.md`: the design. A new design comment starts from it.

The file `~/.config/toolkit-v2/plugin-root` holds the path of the toolkit
plugin's folder (every session start refreshes it). The templates are inside
that folder. A local project also has copies in
`.work-items/work-item-template/`, which the CLI uses by itself.

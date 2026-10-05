# Issue layout: how a work item looks on GitHub

How one work item is laid out in its issue, and how each part is written. The header fields are labels (`labels.md`).

## Contents

- The picture
- Creating an issue
- Requirements
- Questions and Answers
- Recent History
- Phases, tasks, and sub-items
- The design comment
- Comments
- An issue made by hand
- Body size

## The picture

```text
#12  Transaction entry                      the issue title, in the owner's words
  Labels:      state:building  type:build  priority:medium  waiting-on:owner  requirements-approved
  Milestone:   P01 — Discovery              its project phase (a top-level issue only)
  Sub-issues:  #14, #15                     GitHub's own list: levels 2 and 3
  Body:
    ## Overview                             Goal, Current state, Related items
    ## Roadmap                              one row per phase; its Sub-items cell names #14 (a top-level issue only)
    ## Tasks                                one "### P1 — <name>" heading per phase, a checkbox per task; in a sub-issue, one plain list
    ## Recent History
    ## Requirements
    ## Questions and Answers
    ## Notes                                Context, Sources, Lessons not proven yet, Solution options and considerations
  Comments, oldest first:
    ## Solution design                      the design: one comment, edited in place
    Agent: helper finished P1-T02; 12 tests pass.
```

A project set up for GitHub keeps no work item files in its folders. It has the repository named in `PROJECT.md` with Issues turned on, and the 30 labels in `labels.md`.

## Creating an issue

1. Make the body in a temporary folder. Take the work item template text `running-work-item-lifecycle` opened from its `assets/`, from the line `## Overview` to the end. Leave out the front matter, the `# WI-001: ...` title line, and the fill-in guide above `## Overview`. Fill it as the template's guide says, and leave no angle-bracket prompt in the body (`running-work-item-lifecycle`, "Every time"): write one block for each requirement `running-work-item-lifecycle` gave you in place of the template's pattern block ("Requirements" below); delete the example phase rows, the example phase headings and tasks, the example question rows, and the prompt lines under Context and "Solution options and considerations"; and write "None." under Sources and under "Lessons not proven yet". Keep every heading, table header, label, and `<!-- ... -->` guide comment.
2. Write IDs as `#12` wherever the template says a work item ID. Keep the plan form the template's guide gives for the item's level: a top-level item keeps the Roadmap; a sub-item keeps only the sub-item form under Tasks. For a level-2 sub-item, Related items says "Parent #12, phase P2."; for a level-3 sub-item, "Parent #14."; for a top-level item, "Project phase P01." once it has one (before that: `running-work-item-lifecycle`, "Levels").
3. Create the issue with its labels (`gh-commands.md`, "Creating an issue"): the State `running-work-item-lifecycle` gives it, the type, and the priority (`priority:medium` when none is named). Add no other label.
4. A sub-item: count its levels, then link it to its parent ("Phases, tasks, and sub-items"). A top-level item: put it in its project phase's milestone once the owner has named one (`project-roadmap-and-tasks.md`).

## Requirements

Each requirement is one block in the body under `## Requirements`, in the order of its number, in the form of the block in the work item template.

- **A new requirement:** add its block after the last one, with the next unused number. Take the form from the template, never from a prompt left in a body.
- **A new line:** add it at the end of its numbered list.
- **A part with nothing to write yet:** keep its label and write nothing after it.
- Never write `#1` for a requirement: GitHub reads it as an issue number.

## Questions and Answers

The table sits in the body under `## Questions and Answers`. In any table, write `|` in a cell as `\|` and a line break as `<br>`.

- **A new row:** its ID is the highest Q-ID in this item plus one. Insert it after the last open row, or right after the separator line when none is open, so open rows stay on top, oldest first. When the template's two example rows are still there, delete them in the same write. When the owner must answer, add `waiting-on:owner`. When someone else must, add `waiting-on:external`.
- **An answer:** put his words in quotes under Answer and the date as `YYYY-MM-DD`. Then move the row to just below the last open row, so answered rows are newest first. After his last open question is answered, swap `waiting-on:owner` for `waiting-on:agent` when you carry on with the work, or remove it. Keep it while another question of his is open.
- **A superseded row:** change only its Status cell, to `Superseded by Q-09`.

## Recent History

Insert a new row right below the table's `|---|---|---|` line, so the newest row is first.

## Phases, tasks, and sub-items

- A **phase** (top-level issue only) is a row of the Roadmap table: `P1 — <name>`, Outcome, Status, Exit result, Sub-items. The row order is the plan order. The Tasks section has a matching `### P1 — <name>` heading, in the same order. A phase is never an issue.
- A **sub-item** is its own issue and a sub-issue of the item. Under a top-level item, its phase is the Roadmap row whose Sub-items cell names it, as `#14`, and its own Related items line says "Parent #12, phase P2." Under a level-2 item, it has no phase: the parent's `**Sub-items:**` line names it, and its Related items line says "Parent #14."
- A **task** is a checkbox line in the template's form: under its phase's heading in a top-level issue (`P1-T01`), or in the plain list in a sub-issue (`T01`, `T02`, the next unused number). End each of its lines with two spaces: they keep the lines apart when GitHub shows the body.
- **Link a sub-item:** make it a sub-issue of its parent (`gh-commands.md`, "Sub-issues"), then put `#<number>` in the parent's list: the Sub-items cell of its phase's Roadmap row, or a level-2 parent's `**Sub-items:**` line. Replace "None." the first time.
- **Start a task:** change the status after `·` to In Progress, in one body write.
- **Tick a task:** change `- [ ]` to `- [x]` and the status after `·` to Done, in one body write. The owner may tick a box in the browser; that counts.
- **Move a task or sub-item to another phase** (top-level issue only): move its lines, or move `#<number>` from one Sub-items cell to the other, and update the sub-item's Related items line.
- **Move an item under another parent:** count the levels for the item and every level under it first. Add it to the new parent with `replace_parent=true`, or remove it from its parent to make it top level. Take `#<number>` out of the old parent's list, put it in the new parent's, and update the item's Related items. Made top level: put it in a milestone (`project-roadmap-and-tasks.md`). No longer top level: remove its milestone. When its level changed, follow "An item that changes level" below.
- The owner may move a sub-issue in the browser. At your next change, bring the parents' lists and Related items into line with it.
- After linking or moving a sub-issue, check the parent's sub-issues against its list.

An item that changes level (a move, or a sub-issue made before toolkit 0.8.0 that still has a Roadmap):

- **Phases to a plain list** (it is now a sub-issue): under `## Tasks`, write the `**Sub-items:**` line with every number from its Sub-items cells (or "None."), then every task in plan order, each keeping its ID, status, and tick. Delete the `### P1 — ...` headings and the whole `## Roadmap` section. Add one Recent History row that keeps what was deleted: "Phases removed, because a sub-item has no phases: P1 — <name> (<status>; <outcome>), P2 — ... Tasks kept with their IDs."
- **A plain list to phases** (it is now top level): add the template's `## Roadmap` section above `## Tasks` with one phase, `P1`, named as the owner approves; put the `### P1 — <name>` heading above the tasks, which keep their IDs; move the numbers from the `**Sub-items:**` line into P1's Sub-items cell and delete that line. New tasks take `P1-T` IDs. Add a Recent History row.

## The design comment

One comment per item holds the design. Its first line is exactly `## Solution design`. The rest is the design template text `running-work-item-lifecycle` opened from its `assets/`, from its `**Requirements:**` line to the end, with the front matter, the title line, and the fill-in guide left out.

- **Make it** with `gh issue comment` (`gh-commands.md`, "Comments"). Then add `design-proposed`.
- **Find it:**

  ```text
  gh api --paginate repos/<repo>/issues/<number>/comments --jq '.[] | select(.body | startswith("## Solution design")) | [.id, .html_url] | @tsv'
  ```

- **Change it:** read it into a file, edit the file, and send it back with `-X PATCH` (`gh-commands.md`, "Comments"). Never post a second design comment. A replacement design goes in the same comment. GitHub keeps every earlier version under the comment's "edited" menu.
- **Longer than 60,000 characters:** put the rest in a second comment whose first line is `## Solution design (part 2)`, kept up to date the same way. The first comment's last line says "Continued in part 2."
- Two design comments that are not parts: tell the owner and ask which one is current.

## Comments

Comments sit below the body.

- Start every agent note with "Agent:". `gh` signs in as the owner, so the note shows his name.
- Read the owner's comments before you change an item. An answer or decision he wrote in a comment goes into Questions and Answers as a row, with his words and the date of the comment. A request he wrote there is handled like one he said in the chat. A comment by someone else is never his answer.

## An issue made by hand

An issue the owner opened in the browser has his text and no layout: no `## Overview` in the body, or no state label.

1. Ask him in one line: "#15 was made by hand in GitHub, so it does not have the usual work item sections and labels. Should I add them?"
2. On his yes, make a new body from the template ("Creating an issue", step 1), with his text word for word as the Original verbatim requirement of Requirement 1. Write it with `gh issue edit`.
3. Add `state:backlog` and `priority:medium`. Ask him the type unless his text makes it plain (a report of something broken is `type:bug`).
4. Add a Recent History row: "Made by hand in GitHub; the work item layout was added."

## Body size

An issue body holds at most 65,536 characters. After each body write, read its length:

```text
gh issue view <number> -R <repo> --json body --jq '.body | length'
```

Over 60,000: tell the owner, and propose splitting the work into sub-items, each with its own body. Never drop or shorten his words, answers, or history to make room.

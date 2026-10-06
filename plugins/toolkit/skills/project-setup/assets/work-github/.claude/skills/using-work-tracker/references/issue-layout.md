# Issue layout: how a work item looks on GitHub

This file says how one work item is laid out in its issue, and how to write each part. The header fields are labels, which `labels.md` describes. Open this file when you create an issue, write a part of its body, or save the design or a note.

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
    ## Overview                             Goal, Current state, Related items, Moved up
    ## Roadmap                              one row per phase; its Sub-items cell names #14 (a top-level issue only)
    ## Tasks                                one "### P1 — <name>" heading per phase, a checkbox per task; in a sub-issue, one plain list
    ## Recent History
    ## Requirements
    ## Questions and Answers
    ## Notes                                Context, Sources, Lessons not proven yet, Solution options and considerations
  Comments, oldest first:
    ## Solution design                      the design: one comment, edited in place
    Agent: a helper started on P1-T02.
```

A project that is set up for GitHub keeps no work item files in its folders. It has the repository that `PROJECT.md` names, with Issues turned on, and the 30 labels in `labels.md`.

## Creating an issue

1. Make the body in a temporary folder. Take the work item template text that `running-work-item-lifecycle` opened from its `assets/`, from the line `## Overview` to the end.
   - Leave out the front matter, the `# WI-001: ...` title line, and the fill-in guide above `## Overview`.
   - Fill the body as the template's guide says, and leave no angle-bracket prompt in the body. A prompt is text in angle brackets that says what to write there. `running-work-item-lifecycle`, section "Rules that apply in every State", gives the rule about prompts.
   - Write one block for each requirement that `running-work-item-lifecycle` gave you, in place of the template's example requirement block. "Requirements" below gives the form.
   - Delete the example phase rows, the example phase headings and tasks, the example question rows, and the prompt lines under Context and under "Solution options and considerations".
   - Write "None." under Sources and under "Lessons not proven yet".
   - Leave the **Moved up** line under `## Overview` empty after its label. `running-work-item-lifecycle` fills it when it closes the work item, with a change to the body, before the issue is closed.
   - Keep every heading, table header, label, and `<!-- ... -->` guide comment.
2. Write IDs as `#12` wherever the template says a work item ID. Keep the form of the plan that the template's guide gives for the work item's level: a top-level item keeps the Roadmap, and a sub-item keeps only the sub-item form under Tasks. Write the Related items line for the work item's level:
   - For a level-2 sub-item, Related items says "Parent #12, phase P2."
   - For a level-3 sub-item, Related items says "Parent #14."
   - For a top-level item, Related items says "Project phase P01." once the work item has a project phase. Before that, `running-work-item-lifecycle`, section "Levels", says what to do.
3. Create the issue with its labels: the State that `running-work-item-lifecycle` gives it, the type, and the priority. Use `priority:medium` when no priority is named. Add no other label. `gh-commands.md`, section "Creating an issue", gives the command.
4. Link the issue to what it belongs to:
   - For a sub-item, count its levels, and then link it to its parent, as "Phases, tasks, and sub-items" below says.
   - For a top-level item, put it in the milestone of its project phase once the owner has named a project phase. `project-roadmap-and-tasks.md` gives the command.

## Requirements

Each requirement is one block in the body under `## Requirements`, in the order of its number. The block has the form of the requirement block in the work item template.

- **A new requirement.** Add its block after the last block, with the next unused number. Take the form from the template, never from a prompt that was left in a body.
- **A new line.** Add the line at the end of its numbered list.
- **A part with nothing to write yet.** Keep the part's label, and write nothing after the label.
- Never write `#1` for a requirement, because GitHub reads `#1` as an issue number.

## Questions and Answers

The table is in the body under `## Questions and Answers`. In any table, write `|` in a cell as `\|`, and write a line break as `<br>`.

- **A new row.** Its ID is the highest Q-ID in this work item plus one. Insert the row after the last open row. When no row is open, insert it right after the separator line. Open rows then stay on top, oldest first.
  - When the template's two example rows are still there, delete them in the same change to the body.
  - When the owner must answer, add `waiting-on:owner`. When someone else must answer, add `waiting-on:external`.
- **An answer.** Put the owner's words in quotation marks under Answer, and write the date as `YYYY-MM-DD`. Then move the row to just below the last open row, so that answered rows are newest first.
  - After the owner's last open question is answered, swap `waiting-on:owner` for `waiting-on:agent` when you continue the work, or remove `waiting-on:owner`.
  - Keep `waiting-on:owner` while another question for the owner is open.
- **A superseded row.** Change only the row's Status cell, to `Superseded by Q-09`.

## Recent History

Insert a new row right after the table's `|---|---|---|` line, so that the newest row is first.

## Phases, tasks, and sub-items

- A **phase** belongs to a top-level issue only. It is a row of the Roadmap table: `P1 — <name>`, Outcome, Status, Exit result, Sub-items. The order of the rows is the plan order. The Tasks section has a matching `### P1 — <name>` heading for each phase, in the same order. A phase is never an issue.
- A **sub-item** is an issue of its own, and it is a sub-issue of the work item above it.
  - Under a top-level item, its phase is the Roadmap row whose Sub-items cell names it, as `#14`. Its own Related items line says "Parent #12, phase P2."
  - Under a level-2 sub-item, it has no phase. The parent's `**Sub-items:**` line names it, and its own Related items line says "Parent #14."
- A **task** is a checkbox line in the template's form. In a top-level issue, the task is under its phase's heading, and its ID has the form `P1-T01`. In a sub-issue, the task is in the plain list, and its ID is `T01`, `T02`, and so on, with the next unused number. End each of the task's lines with two spaces, which keep the lines apart when GitHub shows the body.

How to change them:

- **Link a sub-item.** Make it a sub-issue of its parent, with the calls in `gh-commands.md`, section "Sub-issues". Then put `#<number>` in the parent's list: the Sub-items cell of its phase's Roadmap row, or the `**Sub-items:**` line of a level-2 parent. Replace "None." the first time. Add a Recent History row on the parent: "Sub-item #14 created: <title>."
- **Start a task.** Change the status after `·` to In Progress, in one change to the body.
- **Tick a task.** Change `- [ ]` to `- [x]`, and change the status after `·` to Done, in one change to the body. The owner may tick a box in the browser, and that tick counts.
- **Move a task or a sub-item to another phase** (in a top-level issue only). Move the task's lines, or move `#<number>` from one Sub-items cell to the other. For a sub-item, also update the sub-item's Related items line.
- **Move a work item under another parent.**
  - First count the levels, for the work item and for every level under it.
  - Add the work item to the new parent with `replace_parent=true`, or remove it from its parent to make it top-level.
  - Take `#<number>` out of the old parent's list, and put it in the new parent's list.
  - Update the work item's Related items line.
  - When the work item is now top-level, put it in a milestone, as `project-roadmap-and-tasks.md` says.
  - When the work item is no longer top-level, remove its milestone.
  - When its level changed, follow "A work item that changes level" below.
- The owner may move a sub-issue in the browser. At your next change, make the parents' lists and the Related items lines agree with what the owner did.
- After you link or move a sub-issue, check the parent's sub-issues against its list.

### A work item that changes level

Use this part in two cases: a move puts a work item at another level, or a sub-issue that was made before toolkit 0.8.0 still has a Roadmap.

- **Phases to a plain list** (the work item is now a sub-issue). Do these four things:
  1. Under `## Tasks`, write the `**Sub-items:**` line with every number from the work item's Sub-items cells, or "None.".
  2. After that line, write every task in plan order. Each task keeps its ID, its status, and its tick.
  3. Delete the `### P1 — ...` headings and the whole `## Roadmap` section.
  4. Add one Recent History row that keeps what was deleted: "Phases removed, because a sub-item has no phases: P1 — <name> (<status>; <outcome>), P2 — ... Tasks kept with their IDs."
- **A plain list to phases** (the work item is now top-level). Do these four things:
  1. Add the template's `## Roadmap` section above `## Tasks`, with one phase, `P1`, named as the owner approves.
  2. Put the `### P1 — <name>` heading above the tasks. The tasks keep their IDs.
  3. Move the numbers from the `**Sub-items:**` line into P1's Sub-items cell, and delete that line.
  4. Add a Recent History row.

  New tasks take `P1-T` IDs.

## The design comment

One comment for each work item holds the design. Its first line is exactly `## Solution design`. The rest is the design template text that `running-work-item-lifecycle` opened from its `assets/`, from its `**Requirements:**` line to the end. Leave out the front matter, the title line, and the fill-in guide.

- **Make it** with `gh issue comment`. `gh-commands.md`, section "Comments", gives the command. Then add `design-proposed`.
- **Find it** with this command:

  ```text
  gh api --paginate repos/<repo>/issues/<number>/comments --jq '.[] | select(.body | startswith("## Solution design")) | [.id, .html_url] | @tsv'
  ```

- **Change it.** Read the comment into a file, edit the file, and send it back with `-X PATCH`. `gh-commands.md`, section "Comments", gives the commands.
  - Never post a second design comment. A replacement design goes in the same comment.
  - GitHub keeps every earlier version under the comment's "edited" menu.
- **A design longer than 60,000 characters.** Put the rest in a second comment whose first line is `## Solution design (part 2)`, and keep it up to date the same way. The last line of the first comment says "Continued in part 2."
- **Two design comments that are not parts.** Tell the owner, and ask which one is current.

## Comments

Comments are below the body.

- Start every note of the agent's with "Agent:". `gh` signs in as the owner, so the note shows the owner's name.
- Read the owner's comments before you change a work item.
  - An answer or a decision that the owner wrote in a comment goes into Questions and Answers as a row, with the owner's words and the date of the comment.
  - A request that the owner wrote in a comment is handled like a request that the owner made in the session.
  - A comment by someone else is never the owner's answer.

## An issue made by hand

An issue that the owner opened in the browser has the owner's text and no layout: it has no `## Overview` in the body, or no state label.

1. Ask the owner in one line: "#15 was made by hand in GitHub, so it does not have the usual work item sections and labels. Should I add them?"
2. After the owner's yes, make a new body from the template, as step 1 of "Creating an issue" says. Put the owner's text in it, word for word, as the Original verbatim requirement of Requirement 1. Write the body with `gh issue edit`.
3. Add `state:backlog` and `priority:medium`. Ask the owner the type, unless the owner's text makes the type plain. For example, a report of something broken is `type:bug`.
4. Add a Recent History row: "Made by hand in GitHub; the work item layout was added."

## Body size

An issue body holds at most 65,536 characters. After each change to the body, read its length:

```text
gh issue view <number> -R <repo> --json body --jq '.body | length'
```

When the length is over 60,000, tell the owner, and propose splitting the work into sub-items, each with its own body. Never drop or shorten the owner's words, answers, or history to make room.

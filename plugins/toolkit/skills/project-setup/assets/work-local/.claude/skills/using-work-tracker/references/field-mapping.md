# Where each work item field goes (local files)

## Contents

- Front matter fields
- Overview
- Roadmap and Tasks
- Recent History
- Requirements
- Questions and Answers
- Notes
- The design file
- A new item's starting values

## Front matter fields

The front matter is the block between the two `---` lines at the top of `<ID>.md`: one line per field, in the template's order. Keep every field, and any extra field the owner or Obsidian added. Add no new field. The owner may edit any of them in Obsidian's Properties panel (see the hand-change check in `folders-and-files.md`).

| Field | What goes in it |
| --- | --- |
| `id` | The ID, `WI-031`, with three digits. It never changes. |
| `title` | The title in the owner's words. Double quotes when it holds a colon or a `#`, or starts with a quote or a bracket: `title: "Login: single sign-on"`. |
| `type` | One value from the template's list. |
| `state` | The State, spelled as `running-work-item-lifecycle` spells it: `Refining Requirements`, `Testing Loop`. |
| `status` | The Status that goes with that State (the table in `running-work-item-lifecycle`). Set `state`, `status`, and `updated` in one edit. |
| `parent` | The parent's ID as plain text, or `none`. Never a link, so the searches can read it. |
| `waiting_on` | Always in double quotes: `"owner"`, `"agent"`, `"external: bank API team"`, `"none"`. |
| `priority` | `urgent`, `high`, `medium`, or `low`. |
| `delivery` | `agent-led`, `owner-led`, or `not-offered`. |
| `requirements_approved`, `result_approved` | `YYYY-MM-DD by <name>`, or `no`. The name is the owner's name as `PROJECT.md` gives it. |
| `design` | `proposed`, `approved`, `superseded`, or `none`. The design file holds no status of its own. |
| `updated` | Today, `YYYY-MM-DD`, in every edit. |

## Overview

- **Goal**, **Related items**, and **Moved up** are single paragraphs under `## Overview`. Name other items in them as `[[WI-031]]`, never by folder path.
- The five lines under `### Current state` are the Current state: **Where it stands**, **Next action**, **Waiting on**, **Blockers**, **Last updated**. Edit each line in place.

## Roadmap and Tasks

A top-level item (`parent: none`) has a Roadmap and its tasks under phase headings. A sub-item has no Roadmap: its tasks are one plain list (the template's sub-item form).

- A **phase** (top-level item only) is one row of the Roadmap table, in plan order. It has a phase ID (`P1`, `P2`), an Outcome, a Status (Not Started, In Progress, Done, Cancelled), an Exit result, and a Sub-items cell.
- Each phase has a matching `### P2 — <name>` heading under Tasks, with the same ID and name, in the same order as the rows.
- A **task** is a checkbox block: under its phase heading in a top-level item (`P2-T01`), or in the plain list in a sub-item (`T01`). Every line of the block except the last ends with two spaces, which Markdown reads as a line break:

  ```markdown
  - [ ] **P2-T01 — Save a transaction** · Not Started  
    **Work:** Save amount, date, and category from the form.  
    **Deliverable:** The save step and its test.  
    **Done when:** The test saves a transaction and reads it back.  
    **Who does it:** agent  
    **Depends on:** None.
  ```

- A **sub-item** is its own item, in a folder inside this item's folder. Its parent lists it once, as `[[WI-033]]`: a top-level parent in the Sub-items cell of one of its phases; a level-2 parent in its `**Sub-items:**` line under Tasks, with no phase. This file and `folders-and-files.md` call either one the parent's sub-item list.
- A new phase or task ID is one more than the highest ever used, cancelled ones included. A moved task or phase keeps its ID: `P2-T03` stays `P2-T03` under P3.

Adding:

- **A phase:** add a row where it belongs in the order, and its `### P3 — <name>` heading at the same place in Tasks. When the template's example rows and headings (`P1 — <Phase 1 name>`) are still there, the first real phase replaces them. A row looks like this:

  ```markdown
  | P3 — Monthly report | A report of spending by category | Not Started | The report matches the test data | None. |
  ```

- **A task:** in a top-level item, add the block under its phase heading, after that phase's last task; its ID is the phase ID plus its number in that phase: `P2-T04`. In a sub-item, add it at the end of the list; its ID is `T` plus its number in the item: `T05`. "Depends on" names task IDs, a phase ("P1 completion."), or "None.".
- **A sub-item:** after making it (`folders-and-files.md`, "Creating an item's folder and ID"), add `[[WI-033]]` to the parent's sub-item list (replace "None."; separate several with commas), add a Recent History row on the parent ("Sub-item [[WI-033]] created: <title>."), and set the parent's `updated:`.
- **A new item's plan form:** as the template's guide comments under Roadmap and Tasks say for the item's level.

Changing:

- **Merge two phases:** move the second phase's tasks and sub-items to the first. Set the second row's Status to Cancelled and its Exit result to "Merged into P1". Its heading stays, with the line "Merged into P1." under it.
- **Drop a phase:** move or cancel each of its tasks and sub-items first. Then set its Status to Cancelled and its Exit result to "Dropped: <reason>".
- Only the template's example rows, headings, and tasks are deleted. A cancelled real one stays, with its history. The one exception is "An item that changes level", below.
- Read the plan back after a change. The rows and headings must list the same IDs in the same order:

  ```bash
  grep -nE '^\| *P[0-9]+ —|^### P[0-9]+ —' "<item file>"
  ```

An item that changes level (a move, or an item made before toolkit 0.8.0 whose sub-items still have phases):

- **Phases to a plain list** (the item is now a sub-item): under `## Tasks`, write the `**Sub-items:**` line with every ID from its Sub-items cells (or "None."), then every task block in plan order, each keeping its ID, status, and ticks. Delete the `### P1 — ...` headings and the whole `## Roadmap` section. Add one Recent History row that keeps what was deleted: "Phases removed, because a sub-item has no phases: P1 — <name> (<status>; <outcome>), P2 — ... Tasks kept with their IDs."
- **A plain list to phases** (the item is now top-level): add the template's `## Roadmap` section above `## Tasks` with one phase, `P1`, named as the owner approves; put the `### P1 — <name>` heading above the task blocks, which keep their IDs; move the IDs from the `**Sub-items:**` line into P1's Sub-items cell and delete that line. New tasks take `P1-T` IDs. Add a Recent History row.

A task's writes:

- **Starting:** change `· Not Started` to `· In Progress`.
- **Ticking:** `- [ ]` becomes `- [x]`, and the status becomes `· Done`.
- **Cancelling:** the box stays empty, the status becomes `· Cancelled`, and the reason follows it: `· Cancelled: moved to [[WI-033]]`.

## Recent History

Insert a new row right after the table's separator line, so the newest row is first. When the template's placeholder row (`| <YYYY-MM-DD> | ...`) is still there, the first real row replaces it.

## Requirements

Each requirement is one block under `## Requirements`, in the order of its number, in the form of the block in `work-items/work-item-template/WORK-ITEM.md`.

- **A new requirement:** add its block after the last one, with the next unused number. Take the form from the template, never from a prompt left in an item.
- **A new line:** add it at the end of its numbered list.
- **A part with nothing to write yet:** keep its label and write nothing after it.

## Questions and Answers

- **A new row:** its ID is the highest Q-ID in this item plus one. Insert it after the last open row, or right after the separator line when none is open, so open rows stay on top, oldest first.
- **An answer:** put his words in quotes under Answer and the date as `YYYY-MM-DD`. Then move the row to just below the last open row, so answered rows are newest first.
- **A superseded row:** change only its Status cell, to `Superseded by Q-09`.

## Notes

A line under Sources or "Lessons not proven yet" has the form of the template's example line. The first real line replaces "None.", or the example line when it is still there:

`- SRC-012: kickoff meeting transcript, 2026-09-30. Taken from it: R-01, Q-02.`

## The design file

- One design per item: `DESIGN.md` beside `<ID>.md`. Make it only when none exists, by copying the project's template:

  ```bash
  cp "$MAIN/work-items/work-item-template/DESIGN.md" "<item folder>/DESIGN.md"
  ```

  The project's template is missing: stop and tell the owner.
- In the new `DESIGN.md`: set `work_item: WI-032`, replace `WI-001` in the heading with the ID, and set the `**Requirements:**` line to `[[WI-032]]`.
- A sub-item built from its parent's approved design gets no `DESIGN.md`.
- Never link to a design as `[[DESIGN]]`: every item's design has that name. Name it "the design of WI-032".

## A new item's starting values

After the folder and file exist (`folders-and-files.md`, "Creating an item's folder and ID"):

- **Front matter:** the ID, the title in the owner's words, the `type`, `state`, and `status` that `running-work-item-lifecycle` gave, `parent` (the parent's ID or `none`), the starting values the template's fill-in guide names, and `updated` today.
- **Overview:** the heading `# WI-032: <title>`, the Goal when `running-work-item-lifecycle` gave one (a Backlog item has none yet: keep the label and write nothing after it), and the Current state lines: Where it stands "Created on `YYYY-MM-DD`; not started.", Next action in one of the template's forms, Waiting on "Nothing.", Blockers "None.", Last updated today. Related items as the template's prompt says, with the parent as `[[WI-012]]`. Moved up keeps its label and nothing after it.
- **Requirements:** one block for each requirement `running-work-item-lifecycle` gave you, in place of the template's pattern block.
- **Recent History:** "Created from the owner's request.", in place of the placeholder row.
- **Every other angle-bracket prompt is deleted.** Delete the example phase rows, the example phase headings and tasks, and the example question rows. In a sub-item, delete the whole `## Roadmap` section and write `**Sub-items:** None.`; in a top-level item, delete the sub-item form with its `<!-- Sub-item form ... -->` comment. Under Notes, write "None." under Sources and under "Lessons not proven yet", and delete the prompt lines under Context and "Solution options and considerations". Keep every heading, table header, label, and `<!-- ... -->` guide comment, except the comment that starts "Fill-in guide for a new work item": delete it.
- **Check** that no prompt is left:

  ```bash
  grep -nE '<[^!>][^>]*>' "<item file>"
  ```

  A line it prints that holds a template prompt is not finished. `<br>` and angle brackets in real content (code such as `Map<Id, Account>`) are fine.
- A sub-item is also linked from its parent's sub-item list (see "Roadmap and Tasks"). A top-level item is also listed under its project phase (`project-roadmap-and-tasks.md`).

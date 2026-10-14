# Where each work item field goes (local files)

This file says where each part of a work item goes in its file, `<ID>.md`, and how to write each part: the front matter fields, each section, the phases and tasks, and the design file. Open it when you create or change anything inside a work item.

## Contents

- Front matter fields
- Overview
- Roadmap and Tasks
- Recent History
- Requirements
- Questions and Answers
- Notes
- The design file
- A new work item's starting values

## Front matter fields

The front matter is the block between the two `---` lines at the top of `<ID>.md`. It holds one line for each field, in the template's order. `work-items/AGENTS.md` calls these fields the header fields.

- Keep every field, and keep any extra field that the owner or Obsidian added.
- Add no new field.
- The owner may edit any field in Obsidian's Properties panel. `work-tracker-folders-and-files.md`, section "The check for changes made by hand", says what to do when the owner changed a field.

| Field | What goes in it |
| --- | --- |
| `id` | The ID, `WI-031`, with three digits. It never changes. |
| `title` | The title in the owner's words. Put the title in double quotes when it holds a colon or a `#`, or when it starts with a quote or a bracket: `title: "Login: single sign-on"`. |
| `status` | The Status that goes with that State. The table in `managing-work-items` gives it. Set `state`, `status`, and `updated` in one edit. |
| `parent` | The parent's ID as plain text, or `none`. Never write a link here, because the searches must be able to read the ID. |
| `waiting_on` | Always in double quotes: `"owner"`, `"agent"`, `"external: bank API team"`, `"none"`. |
| `requirements_approved`, `result_approved` | `YYYY-MM-DD by <name>`, or `no`. The name is the owner's name as `PROJECT.md` gives it. |
| `updated` | Today's date, as `YYYY-MM-DD`, in every edit. |

## Overview

- **Goal**, **Related items**, and **Moved up** are single paragraphs under `## Overview`. Name other work items in them as `[[WI-031]]`, never by folder path.
- The five lines under `### Current state` are the work item's Current state: **Where it stands**, **Next action**, **Waiting on**, **Blockers**, and **Last updated**. Edit each line in place.

## Roadmap and Tasks

A top-level item (`parent: none`) uses a Roadmap when phases help plan or track its outcomes. Its tasks then sit under phase headings. An item without phases uses the template's plain-list form, including its Sub-items line. Sub-items have no phases.

- A **phase** belongs to a top-level item only. It is one row of the Roadmap table, and the rows are in plan order. The row has a phase ID (`P1`, `P2`), an Outcome, a Status (Not Started, In Progress, Done, Cancelled), an Exit result, and a Sub-items cell.
- Each phase has a matching `### P2 — <name>` heading under Tasks, with the same ID and name. The headings are in the same order as the rows.
- A **task** is a checkbox block. A new task under a phase heading gets an ID such as `P2-T01`. A new task in a plain list gets an ID such as `T01`. Existing task IDs stay unchanged when grouping changes. Every line of the block except the last ends with two spaces, which Markdown reads as a line break:

  ```markdown
  - [ ] **P2-T01 — Save a transaction** · Not Started  
    **Work:** Save amount, date, and category from the form.  
    **Deliverable:** The save step and its test.  
    **Done when:** The test saves a transaction and reads it back.  
    **Who does it:** agent  
    **Depends on:** None.
  ```

- A **sub-item** is a work item of its own, in a folder inside this work item's folder. Its parent lists it once, as `[[WI-033]]`. Where the parent lists it depends on whether the parent uses phases:
  - A parent with phases lists it in the Sub-items cell of one of its phases.
  - A parent without phases lists it in its `**Sub-items:**` line under Tasks, with no phase.

  This file and `work-tracker-folders-and-files.md` call either place the parent's list of sub-items.
- A new phase ID or task ID is one more than the highest ID ever used, cancelled ones included.
- A task or a phase that moves keeps its ID: `P2-T03` stays `P2-T03` under P3.

### Adding

- **A phase.** Add a row where the phase belongs in the order, and add its `### P3 — <name>` heading at the same place in Tasks. When the template's example rows and headings (`P1 — <Phase 1 name>`) are still there, the first real phase replaces them. A row looks like this:

  ```markdown
  | P3 — Monthly report | A report of spending by category | Not Started | The report matches the test data | None. |
  ```

- **A new task under a phase.** Add the block under its phase heading, after that phase's last task. Its ID is the phase ID plus its number in that phase, for example `P2-T04`.
- **A new task in a plain list.** Add the block at the end of the list. Its ID is `T` plus its number in the work item, for example `T05`.
- In both kinds of task, "Depends on" names task IDs, a phase ("P1 completion."), or "None.".
- **A sub-item.** First make the sub-item. `work-tracker-folders-and-files.md`, section "Creating a work item's folder and ID", gives the steps. Then do each of these:
  - Add `[[WI-033]]` to the parent's list of sub-items. Replace "None." when it is there, and separate several IDs with commas.
  - Record the new sub-item's ID, title, and creator in the parent's Recent History.
  - Set the parent's `updated:`.
- **The form of a new work item's plan.** Follow the template's guide comments under Roadmap and Tasks for the work item's level and whether it uses phases.

### Changing

- **Merge two phases.** Move the second phase's tasks and sub-items to the first phase. Set the second row's Status to Cancelled and its Exit result to "Merged into P1". The second phase's heading stays, with the line "Merged into P1." under it.
- **Drop a phase.** First move or cancel each of its tasks and sub-items. Then set its Status to Cancelled and its Exit result to "Dropped: <reason>".
- Delete only the template's example rows, example headings, and example tasks. A real row, heading, or task that is cancelled stays, with its history. The one exception is "A work item that changes level or plan grouping", below.
- The plan rows and headings must list the same IDs in the same order:

  ```bash
  grep -nE '^\| *P[0-9]+ —|^### P[0-9]+ —' "<item file>"
  ```

### A work item that changes level or plan grouping

Use this part when a move puts a work item at another level or an approved plan changes between phases and a plain list. Moving an item to the top level does not require phases.

- **Phases to a plain list.** Do these four things:
  1. Under `## Tasks`, write the `**Sub-items:**` line with every ID from the work item's Sub-items cells, or "None.".
  2. After that line, write every task block in plan order. Each task block keeps its ID, its status, and its tick.
  3. Preserve the removed phases' IDs, names, statuses, outcomes, exit results, and sub-items in Recent History. Record why the layout changed, who authorized it, and that the tasks retain their IDs.
  4. Remove phase references from each sub-item's Related items line. Delete the phase headings and the whole `## Roadmap` section.
- **A plain list to phases** (a top-level item whose plan now benefits from phases). Do these four things:
  1. Add the template's `## Roadmap` section above `## Tasks`, with the approved phases, using the next unused phase IDs.
  2. Put the matching phase headings above their task blocks. The task blocks keep their IDs.
  3. Move the IDs from the `**Sub-items:**` line into the matching phases' Sub-items cells, and delete that line. Update each sub-item's Related items line with its phase.
  4. Add a Recent History row.

  New tasks under phases take IDs for those phases. A plain list that stays plain keeps its task and sub-item layout.

### A task's writes

- **Starting.** Change `· Not Started` to `· In Progress`.
- **Ticking.** Change `- [ ]` to `- [x]`, and change the status to `· Done`.
- **Cancelling.** The box stays empty. Change the status to `· Cancelled`, and write the reason after it: `· Cancelled: moved to [[WI-033]]`.

## Recent History

Insert a new row right after the table's separator line, so that the newest row is first. When the template's placeholder row (`| <YYYY-MM-DD> | ...`) is still there, the first real row replaces it.

## Requirements

Follow [the common editing rules](editing-a-work-item.md), section "Requirements", using `work-items/work-item-template/WORK-ITEM.md`.

## Questions and Answers

Follow [the common editing rules](editing-a-work-item.md), section "Questions and Answers".

## Notes

A line under Sources or under "Lessons not proven yet" has the form of the template's example line. The first real line replaces "None.", or it replaces the example line when the example line is still there. For example:

`- SRC-012: kickoff meeting transcript, 2026-09-30. Taken from it: R-01, Q-02.`

## The design file

- A work item has at most one design, in the file `DESIGN.md` beside `<ID>.md`. Make the file only when none exists, by copying the project's template:

  ```bash
  cp "$MAIN/work-items/work-item-template/DESIGN.md" "<item folder>/DESIGN.md"
  ```

  When the project's template is missing, stop and tell the owner.
- In the new `DESIGN.md`, set `work_item: WI-032`, replace `WI-001` in the heading with the ID, and set the `**Requirements:**` line to `[[WI-032]]`.
- A sub-item that is built from its parent's approved design gets no `DESIGN.md`.
- Never link to a design as `[[DESIGN]]`, because every work item's design has that file name. Name it "the design of WI-032".

## A new work item's starting values

Fill these values after the folder and the file exist. `work-tracker-folders-and-files.md`, section "Creating a work item's folder and ID", says how to make them.

- **Front matter.** Set the ID, the title in the owner's words, the `type`, `state`, and `status` that `managing-work-items` gave, `parent` (the parent's ID or `none`), the starting values that the template's fill-in guide names, and `updated` to today.
- **Overview.**
  - The heading is `# WI-032: <title>`.
  - Write the Goal when `managing-work-items` gave one. A Backlog work item has no Goal yet: keep the label and write nothing after it.
  - Write the lines of the work item's Current state. Where it stands is "Created on `YYYY-MM-DD`; not started.". Next action is in one of the template's forms. Waiting on is "Nothing.". Blockers is "None.". Last updated is today.
  - Write Related items as the template's prompt says, with the parent as `[[WI-012]]`.
  - Moved up keeps its label and nothing after it.
- **Requirements.** Write one block for each requirement that `managing-work-items` gave you, in place of the template's example requirement block.
- **Recent History.** Replace the placeholder row with the creation date, the owner's request, and who created the item.
- **Every other angle-bracket prompt is deleted.**
  - Delete the example phase rows, the example phase headings and tasks, and the example question rows.
  - In an item without phases, delete the example `## Roadmap` section, and write `**Sub-items:** None.`.
  - In a top-level item that uses phases, delete the plain-list form with its `<!-- Plain-list form ... -->` comment.
  - Under Notes, write "None." under Sources and under "Lessons not proven yet". Delete the prompt lines under Context and under "Solution options and considerations".
  - Keep every heading, table header, label, and `<!-- ... -->` guide comment. The one exception is the comment that starts "Fill-in guide for a new work item": delete that comment.
- **Check** that no prompt is left:

  ```bash
  grep -nE '<[^!>][^>]*>' "<item file>"
  ```

  A line that the command prints is not finished when it holds a template prompt. `<br>` is fine, and so are angle brackets in real content, for example code such as `Map<Id, Account>`.
- A sub-item is also linked from its parent's list of sub-items, as "Roadmap and Tasks" above says. A top-level item is also listed under its project phase, as `work-tracker-project-roadmap-and-tasks.md` says.

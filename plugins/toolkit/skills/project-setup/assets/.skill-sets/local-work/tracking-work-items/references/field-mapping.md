# Where each work item field goes (local files)

## Contents

- Front matter fields
- Overview: Current state
- Roadmap and Tasks
- Recent History
- Requirements
- Questions and Answers
- Notes and Sources
- Approvals
- Done, Cancelled, Blocked, and reopened
- The design file
- A new item's starting values

## Front matter fields

The front matter is the block between the two `---` lines at the top of `<ID>.md`: one line per field, in the template's order. Keep every field, and any extra field the owner or Obsidian added. Add no new field. The owner may edit any of them in Obsidian's Properties panel (see the hand-change check in `folders-and-files.md`).

| Field | What goes in it |
| --- | --- |
| `id` | The ID, `WI-031`, with three digits. It never changes. |
| `title` | The title in the owner's words. Double quotes when it holds a colon or a `#`, or starts with a quote or a bracket: `title: "Login: single sign-on"`. |
| `type` | One value from the template's list. |
| `state` | The State, spelled as `managing-work-items` spells it: `Refining Requirements`, `Testing Loop`. |
| `status` | The Status that goes with that State (the table in `managing-work-items`). Set `state`, `status`, and `updated` in one edit. |
| `parent` | The parent's ID as plain text, or `none`. Never a link, so the searches can read it. |
| `waiting_on` | Always in double quotes: `"owner"`, `"agent"`, `"external: bank API team"`, `"none"`. |
| `priority` | `urgent`, `high`, `medium`, or `low`. |
| `delivery` | `agent-led`, `owner-led`, or `not-offered`. |
| `requirements_approved`, `result_approved` | `YYYY-MM-DD by <name>`, or `no`. The name is the owner's name as `PROJECT.md` gives it: `requirements_approved: 2026-09-30 by Mike Rihm`. |
| `design` | `proposed`, `approved`, `superseded`, or `none`. |
| `updated` | Today, `YYYY-MM-DD`, in every edit. |

## Overview: Current state

- **Goal** and **Related items** are single paragraphs under `## Overview`. Related items names other items as `[[WI-031]]`, never by folder path.
- The five lines under `### Current state` are the Current state: **Where it stands**, **Next action**, **Waiting on**, **Blockers**, **Last updated**. Edit each line in place. Never add a line, a date list, or a log to it; history goes in Recent History.

## Roadmap and Tasks

A top-level item (`parent: none`) has a Roadmap and its tasks under phase headings. A sub-item has no Roadmap: its tasks are one plain list (the template's sub-item form). `managing-work-items`, "Levels", says why.

- A **phase** (top-level item only) is one row of the Roadmap table, in plan order. It has a stable phase ID (`P1`, `P2`), an Outcome, a Status (Not Started, In Progress, Done, Cancelled), an Exit result, and a Sub-items cell. A phase is never a work item.
- Each phase has a matching `### P2 — <name>` heading under Tasks, with the same ID and name, in the same order as the rows.
- A **task** is a checkbox block, with a stable task ID: under its phase heading in a top-level item (`P2-T01`), or in the plain list in a sub-item (`T01`). Every line of the block except the last ends with two spaces, which Markdown reads as a line break:

  ```markdown
  - [ ] **P2-T01 — Save a transaction** · Not Started  
    **Work:** Save amount, date, and category from the form.  
    **Deliverable:** The save step and its test.  
    **Done when:** The test saves a transaction and reads it back.  
    **Who does it:** agent  
    **Depends on:** None.
  ```

- A **sub-item** is its own item, in a folder inside this item's folder. Its parent lists it once, as `[[WI-033]]`: a top-level parent in the Sub-items cell of one of its phases; a level-2 parent in its `**Sub-items:**` line under Tasks, with no phase. This file and `folders-and-files.md` call either one the parent's sub-item list.
- Phase and task IDs are never reused, even when a cancelled one had a lower number. A moved task or phase keeps its ID: `P2-T03` stays `P2-T03` under P3.

Adding:

- **A phase:** add a row where it belongs in the order, with the next unused number for this item, and its `### P3 — <name>` heading at the same place in Tasks. When the template's example rows and headings (`P1 — <Phase 1 name>`) are still there, the first real phase replaces them. A row looks like this:

  ```markdown
  | P3 — Monthly report | A report of spending by category | Not Started | The report matches the test data | None. |
  ```

- **A task:** in a top-level item, add the block under its phase heading, after that phase's last task; its ID is the phase ID plus the next unused number in that phase: `P2-T04`. In a sub-item, add it at the end of the list; its ID is `T` plus the next unused number in the item: `T05`. "Depends on" names task IDs, a phase ("P1 completion."), or "None.".
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
- **Ticking:** `- [ ]` becomes `- [x]`, the status becomes `· Done`, and the evidence goes at the end of the "Done when" line: `Met 2026-09-30: test passes (commit 4f2a9c1).` When the owner says it is done, the evidence is `Met <date>: the owner said so ("<his words>").`
- **Cancelling:** the box stays empty, the status becomes `· Cancelled`, and the reason follows it: `· Cancelled: moved to [[WI-033]]`.

## Recent History

The table under `## Recent History` has three columns: Date, Change or decision, Effect on the work. Add rows newest first: insert the row right after the separator line. When the template's placeholder row (`| <YYYY-MM-DD> | ...`) is still there, the first real row replaces it. For a decision, name its Q-ID instead of repeating it. The template's comment says which changes get a row.

```markdown
| 2026-09-30 | Q-02 answered: Face ID only. | R-03 updated; next action is Q-03. |
```

## Requirements

Each requirement is one block under `## Requirements`, in the order of its number. `managing-work-items` says what goes in each part. A block looks like this:

```markdown
### Requirement 1: Save a transaction

- **Original verbatim requirement:** "I want to type in what I spent and have it saved."
- **Goal:** A person can record one expense in a few seconds.

**Functional, Process, Logic, Schema, etc. Requirements**

1. The form takes an amount, a date, and a category.
2. Saving with no amount shows "Enter an amount" and saves nothing.

**Acceptance Criteria:**

1. A saved transaction shows in the list with the same amount, date, and category.
2. Saving with no amount leaves the list unchanged.
```

- **A new requirement:** add its block after the last one, with the next unused number. Take the form from the block above, never from a prompt left in an item.
- **A new line:** add it at the end of its numbered list.
- **A part with nothing to write yet:** keep its label and write nothing after it.
- **A dropped requirement:** keep its block and add the Q-ID to its heading: `### Requirement 3: Export to PDF (dropped, Q-12)`.
- `R-01` in a question row, a task, or the design means "Requirement 1".
- An item made before toolkit 0.8.1 has the older layout (`### Starting request`, `### Agreed goal`, `#### R-01 — <title>` blocks of labeled lines, `### Acceptance`). Read and change it in the layout it has. Rewrite it into this layout only when the owner asks.

## Questions and Answers

The table sits under `## Questions and Answers` in the item's main file, for example `work-items/WI-031-transaction-entry/WI-031.md`.

Columns, in order: ID, Question, Answer, Date answered, Decision?, Affects, Status, Decision needed from.

- **A new row:** its ID is the highest Q-ID in this item plus one. Insert it after the last open row, or right after the separator line when none is open, so open rows stay on top, oldest first.
- **An answer:** put his words in quotes under Answer, the date as `YYYY-MM-DD`, Decision? `yes` or `no`, and Status `Answered`. Then move the row to just below the last open row, so answered rows are newest first.
- **A superseded row:** change only its Status, to `Superseded by Q-09`. Never edit its other cells.
- `waiting_on` is in the front matter at the top of the file: `waiting_on: "owner"` while a question of his is open, otherwise `"agent"` or `"none"`.

Answering Q-04, before:

```markdown
| Q-04 | Which fields must every transaction have? Recommended: amount, date, category, because reports group by all three. |  |  |  | R-01 | Open | owner |
```

After:

```markdown
| Q-04 | Which fields must every transaction have? Recommended: amount, date, category, because reports group by all three. | "Amount, date, category. Notes are optional." | 2026-10-01 | yes | R-01 | Answered | owner |
```

## Notes and Sources

- Copy each source file into the item's `references/` folder and keep its name. Text the owner pasted is saved as `YYYY-MM-DD-<short-name>.md`, exactly as pasted. Never edit a source after saving it.
- In a Salesforce project a client file stays in `delivery/`; the Sources line names its `delivery/` path.
- Add one line under Notes, "Sources", for each source (the first one replaces "None.", or the template's example line when it is still there):
  `` - `references/2026-09-30-kickoff-transcript.md`: kickoff meeting transcript, 2026-09-30. Taken from it: R-01, Q-02. ``

## Approvals

| Approval | What to write |
| --- | --- |
| Design | `design: approved` in `<ID>.md`; in `DESIGN.md`, `status: approved`, `approved: "2026-09-30 by Mike Rihm"`, and its "Design status" and "Design approval" lines |
| Result | `result_approved: 2026-09-30 by Mike Rihm` |

## Done, Cancelled, Blocked, and reopened

- **Done.** `state: Done`, `status: Done`, `waiting_on: "none"`, and the Current state lines and Recent History row as `managing-work-items` gives them.
- **Cancelled.** `state: Cancelled`, `status: Cancelled`, `waiting_on: "none"`, and the Current state lines and Recent History row as `managing-work-items` gives them.
- **Blocked.** `state: Blocked`, `status: Blocked`, `waiting_on` set to who can clear it, the Current state lines Waiting on and Blockers filled, and a Recent History row.
- **Reopened, or no longer blocked.** Set `state` and `status` together, and add a Recent History row saying why.

## The design file

- One design per item: `DESIGN.md` beside `<ID>.md`. Make it only when none exists, by copying the project's template:

  ```bash
  cp "$MAIN/work-items/work-item-template/DESIGN.md" "<item folder>/DESIGN.md"
  ```

  The project's template is missing: stop and tell the owner.
- In the new `DESIGN.md`: `work_item: WI-032`, `status: proposed`, `approved: "no"`; replace `WI-001` in the heading with the ID; set the `**Requirements:**` line to `[[WI-032]]`. Then set `design: proposed` in `<ID>.md`.
- A sub-item built from its parent's approved design gets no `DESIGN.md`. Its Related items line says "Built from the design of [[WI-012]]."
- Never link to a design as `[[DESIGN]]`: every item's design has that name. Name it "the design of WI-032".

## A new item's starting values

After the folder and file exist (`folders-and-files.md`, "Creating an item's folder and ID"):

- **Front matter:** the ID, the title in the owner's words, a `type` from the template's list, `state` and `status` for the item's first State, `parent` the parent's ID or `none`, `waiting_on: "none"`, `priority: medium`, `delivery: not-offered`, both approvals `no`, `design: none`, and `updated` today.
- **Overview:** the heading `# WI-032: <title>`, the Goal, and the Current state lines: Where it stands "Created on `YYYY-MM-DD`; not started.", Next action in one of the template's forms, Waiting on "Nothing.", Blockers "None.", Last updated today. Related items: the parent as `[[WI-012]]`; for a top-level item, its project phase ("Project phase P01.") once it has one; or "None.".
- **Requirements:** one block for each requirement `managing-work-items` gave you, in place of the template's pattern block ("Requirements" above).
- **Recent History:** "Created from the owner's request.", in place of the placeholder row.
- **Every other angle-bracket prompt is deleted,** so none is left in the item (`managing-work-items`, "Every time"). Delete the example phase rows, the example phase headings and tasks, and the example question rows. In a sub-item, delete the whole `## Roadmap` section and write `**Sub-items:** None.`; in a top-level item, delete the sub-item form. Under Notes, delete the prompt lines under Context and "Solution options and considerations", and write "None." under Sources. Keep every heading, table header, label, and `<!-- ... -->` guide comment, except the comment that starts "Fill-in guide for a new work item": delete it.
- **Check** that no prompt is left:

  ```bash
  grep -nE '<[^!>][^>]*>' "<item file>"
  ```

  A line it prints that holds a template prompt is not finished. `<br>` and angle brackets in real content (code such as `Map<Id, Account>`) are fine.
- A sub-item is also linked from its parent's sub-item list (see "Roadmap and Tasks"). A top-level item is also listed under its project phase (`project-roadmap-and-tasks.md`).

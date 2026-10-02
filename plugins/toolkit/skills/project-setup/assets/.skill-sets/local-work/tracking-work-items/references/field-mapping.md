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

- A **phase** is one row of the Roadmap table, in plan order. It has a stable phase ID (`P1`, `P2`), an Outcome, a Status (Not Started, In Progress, Done, Cancelled), an Exit result, and a Sub-items cell. A phase is never a work item.
- Each phase has a matching `### P2 — <name>` heading under Tasks, with the same ID and name, in the same order as the rows.
- A **task** is a checkbox block under its phase heading, with a stable task ID (`P2-T01`). Every line of the block except the last ends with two spaces, which Markdown reads as a line break:

  ```markdown
  - [ ] **P2-T01 — Save a transaction** · Not Started  
    **Work:** Save amount, date, and category from the form.  
    **Deliverable:** The save step and its test.  
    **Done when:** The test saves a transaction and reads it back.  
    **Depends on:** None.
  ```

- A **sub-item** is its own item, in a folder inside this item's folder. Its ID sits in the Sub-items cell of the phase it delivers, as `[[WI-033]]`. A sub-item sits in one phase only, and that phase is one of this item's own.
- Phase and task IDs are never reused, even when a cancelled one had a lower number. A moved task or phase keeps its ID: `P2-T03` stays `P2-T03` under P3.

Adding:

- **A phase:** add a row where it belongs in the order, with the next unused number for this item, and its `### P3 — <name>` heading at the same place in Tasks. The first real phase replaces the template's example rows and headings (`P1 — <Phase 1 name>`).
- **A task:** add the block under its phase heading, after that phase's last task. Its ID is the phase ID plus the next unused number in that phase: `P2-T04`. "Depends on" names task IDs, a phase ("P1 completion."), or "None.".
- **A sub-item:** after making it (`folders-and-files.md`, "Creating an item's folder and ID"), add `[[WI-033]]` to the Sub-items cell of the phase it delivers (replace "None."; separate several with commas), add a Recent History row on the parent ("Sub-item [[WI-033]] created: <title>."), and set the parent's `updated:`.

Changing:

- **Merge two phases:** move the second phase's tasks and sub-items to the first. Set the second row's Status to Cancelled and its Exit result to "Merged into P1". Its heading stays, with the line "Merged into P1." under it.
- **Drop a phase:** move or cancel each of its tasks and sub-items first. Then set its Status to Cancelled and its Exit result to "Dropped: <reason>".
- Only the template's example rows, headings, and tasks are deleted. A cancelled real one stays, with its history.
- Read the plan back after a change. The rows and headings must list the same IDs in the same order:

  ```bash
  grep -nE '^\| *P[0-9]+ —|^### P[0-9]+ —' "<item file>"
  ```

A task's writes:

- **Starting:** change `· Not Started` to `· In Progress`.
- **Ticking:** `- [ ]` becomes `- [x]`, the status becomes `· Done`, and the evidence goes at the end of the "Done when" line: `Met 2026-09-30: test passes (commit 4f2a9c1).` When the owner says it is done, the evidence is `Met <date>: the owner said so ("<his words>").`
- **Cancelling:** the box stays empty, the status becomes `· Cancelled`, and the reason follows it: `· Cancelled: moved to [[WI-033]]`.

## Recent History

The table under `## Recent History` has three columns: Date, Change or decision, Effect on the work. Add rows newest first: insert the row right after the separator line. The first real row replaces the template's placeholder row (`| <YYYY-MM-DD> | ...`). For a decision, name its Q-ID instead of repeating it. The template's comment says which changes get a row.

```markdown
| 2026-09-30 | Q-02 answered: Face ID only. | R-03 updated; next action is Q-03. |
```

## Requirements

- `**Overall status:**` under `## Requirements` is `Refining` or `Finalized`.
- The Starting request and the Agreed goal are paragraphs under their headings.
- Each requirement is a `#### R-01 — <title>` block of labeled lines. Its `**Status:**` is `Refining`, `Finalized`, or `Superseded`. A superseded requirement stays, with the reason and the Q-ID in its Decision record line.

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
- Add one line under Notes, "Sources", for each source (replace the template's example line the first time):
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
- **Overview:** the heading `# WI-032: <title>`, the Goal, and the Current state lines: Where it stands "Created on `YYYY-MM-DD`; not started.", Next action in one of the template's forms, Waiting on "Nothing.", Blockers "None.", Last updated today. Related items: the parent as `[[WI-012]]`, or "None.".
- **Requirements and Recent History:** the Starting request in the owner's words, and, replacing the placeholder row, "Created from the owner's request."
- Leave the other prompts to be filled as the work goes. Delete the comment that starts "Fill-in guide for a new work item" once no angle-bracket prompt is left in the item.
- A sub-item is also linked from its parent (see "Roadmap and Tasks").

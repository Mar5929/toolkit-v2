# Planning in local files: phases, tasks, and sub-items

Purpose: how an item's plan is kept in `<ID>.md`, and how it changes
midway. Each change is a small edit, never a rewrite.

## How a plan is stored

- A **phase** is one row of the Roadmap table, in plan order. Each has a
  stable phase ID (`P1`, `P2`), an Outcome, a Status (Not Started, In
  Progress, Done, Cancelled), an Exit result, and a Sub-items cell. A phase
  is never a work item.
- Each phase has a matching `### P2 — <name>` heading in Tasks, with the
  same ID and name, in the same order as the rows.
- A **task** is a checkbox block under its phase heading, with a stable
  task ID (`P2-T01`). Every line of the block except the last ends with two
  spaces, which Markdown reads as a line break:

  ```markdown
  - [ ] **P2-T01 — Save a transaction** · Not Started  
    **Work:** Save amount, date, and category from the form.  
    **Deliverable:** The save step and its test.  
    **Done when:** The test saves a transaction and reads it back.  
    **Depends on:** None.
  ```

- A **sub-item** is its own item, in a folder nested inside this item's
  folder. Its ID sits in the Sub-items cell of the phase it delivers, as
  `[[WI-033]]`. A sub-item sits in one phase only, and the phase must be
  one of this item's own.
- Put most tasks on the lowest-level items. A parent gets a task only for
  work that none of its sub-items holds.
- Phase and task IDs are never reused, even when a cancelled one had a
  lower number.

## Adding phases, tasks, and sub-items

- A phase: add a row where it belongs in the order, with the next unused
  number for this item, and its `### P3 — <name>` heading at the same place
  in Tasks. The first real phase replaces the template's example rows and
  headings (`P1 — <Phase 1 name>`).
- A task: add the block under its phase heading, after that phase's last
  task. Its ID is the phase ID plus the next unused number in that phase:
  `P2-T04`. "Depends on" names task IDs, a phase ("P1 completion."), or
  "None.".
- A sub-item: make it with "A new work item" in `items.md`, with its
  folder inside this item's folder, then add `[[WI-033]]` to the Sub-items
  cell of the phase it delivers (replace "None."; separate several with
  commas).

## Changing the plan

- Merge two phases: move the second phase's tasks and sub-items to the
  first. Set the second row's Status to Cancelled and its Exit result to
  "Merged into P1". Its heading stays, with the line "Merged into P1."
  under it.
- Drop a phase: ask the owner whether each of its tasks and sub-items
  moves or is cancelled, and do that first. Then set its Status to
  Cancelled and its Exit result to "Dropped: <reason>".
- A phase is Done when all its tasks are Done or Cancelled, its sub-items
  are Done or Cancelled, and its exit result was checked.
- A moved task or phase keeps its ID: `P2-T03` stays `P2-T03` under P3.
- Ask the owner first when a change drops or merges work he approved, or
  changes what he will get. Save his answer as a Questions and Answers row.
- Never delete a real row, heading, or task; only the template's examples
  are deleted. Cancelled ones keep the history.
- The owner may edit the plan himself in Obsidian. His change is the plan
  now: never change it back, and record it with a Recent History row at
  your next change.

## Starting, ticking, and cancelling a task

- Starting: change `· Not Started` to `· In Progress`.
- Ticking, only when its "Done when" check is met: `- [ ]` becomes
  `- [x]`, the status becomes `· Done`, and the evidence goes at the end of
  the "Done when" line: `Met 2026-09-30: test passes (commit 4f2a9c1).`
- The owner's own words ("mark task 3 done") meet the check: tick it, with
  `Met <date>: the owner said so ("<his words>").` as the evidence.
- Cancelling: the box stays empty, the status becomes `· Cancelled`, and
  the reason follows it: `· Cancelled: moved to [[WI-033]]`.

## After any plan change

- Add a Recent History row on the item: what changed in the plan and why,
  with the Q-ID when an answer caused it: "Plan changed (Q-07): P3 Check
  the import added before P2; [[WI-035]] and P2-T03 moved to P3."
- Rewrite the item's Current state in place, so Where it stands, Next
  action, and Last updated are true after the plan change.
- Read the plan back and check the rows and headings list the same IDs in
  the same order:

  ```bash
  grep -nE '^\| *P[0-9]+ —|^### P[0-9]+ —' "<item file>"
  ```

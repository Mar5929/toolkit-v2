# Planning on GitHub: phases, sub-issues, and tasks

Purpose: how an item's plan is kept in its issue, and how the plan changes
when the work changes. Plans change midway: phases are added, dropped,
merged, and reordered, and sub-items and tasks move between them. Each is a
small edit of the body, never a rewrite.

## Contents

- How a plan is stored
- Adding phases
- Adding sub-items to a phase
- Adding tasks
- Changing the plan
- Ticking a task
- After any plan change

## How a plan is stored

- A **phase** is a row of the body's Roadmap table: `P1 — <name>`,
  Outcome, Status (Not Started, In Progress, Done, Cancelled), Exit result,
  and Sub-items. The row order is the plan order. A phase is never a work
  item.
- A **sub-item** is its own issue, a GitHub sub-issue of the item. Its
  phase is the Roadmap row whose Sub-items cell names it. Its own Overview
  "Related items" line says "Parent #12, phase P2."
- A **task** is a checkbox line under its phase's `### P1 — <name>`
  heading in the body's Tasks section: `P1-T01 — <name>`, a status, Work,
  Deliverable, Done when, and Depends on, in the template's form.
- Put a task on the lowest-level item that does the work. A parent holds
  only tasks for work that none of its sub-items covers.
- Phase and task IDs never change and are never reused. A new one takes
  the next free number for this item, even when a cancelled one had a
  lower number.

## Adding phases

Add a Roadmap row where the phase belongs in the plan, and a matching
`### P3 — <name>` heading in Tasks, in the same order.

## Adding sub-items to a phase

1. Make the sub-item (`items.md`, "A new work item", with the level check).
2. Put `#<number>` in the Sub-items cell of its phase's Roadmap row on the
   parent. Replace "None." the first time.
3. The phase must belong to the parent. Never name a phase of another item.

## Adding tasks

Under the phase's heading, in the template's form:

```markdown
- [ ] **P3-T01 — Map the bank file columns** · Not Started  
  **Work:** Match each column of the sample file to a transaction field.  
  **Deliverable:** A column map in the item's Notes.  
  **Done when:** Every required field has a column, or a question row.  
  **Depends on:** None.
```

Keep the two spaces at the end of each line: they keep the lines apart
when GitHub shows the body.

## Changing the plan

- Reorder phases: move the Roadmap rows and their Tasks headings (with
  their tasks) together. IDs stay.
- Move a sub-item to another phase: move `#<number>` from one Sub-items
  cell to the other, and update the sub-item's Related items line.
- Move a task to another phase: move its lines under the other phase's
  heading. Its ID stays (P2-T03 may sit under P3).
- Merge two phases: move the second phase's sub-items and tasks to the
  first; set the second to Cancelled with Exit result "Merged into P1".
- Drop a phase: first ask the owner whether to move or cancel its
  sub-items and tasks. Then Status Cancelled, Exit result "Dropped:
  <reason>".
- A phase is done: Status Done, when its tasks are done and its exit result
  was checked.
- Never delete a phase row, a task, or a sub-issue. Cancelled rows keep the
  history.
- Ask the owner first when a change drops or merges work he approved.
- The owner may edit the body or tick a box in the browser. His change is
  the plan now.

## Ticking a task

Only when its "Done when" check is met: change `- [ ]` to `- [x]` and the
status after `·` to Done, in one body write. The owner may tick a box in
the browser; that counts.

The owner's own words ("mark task 3 done") meet the check too: tick it,
with his words and the date as the evidence on the "Done when" line.

## After any plan change

- Add a Recent History row: what changed in the plan and why, with the
  Q-ID when an answer caused it.
- Rewrite the item's Current state in place, so all five lines are true
  and "Last updated" has today's date.
- Read the Roadmap back and check the order, and the parent's sub-issues
  (`gh-basics.md`, "Sub-issues") against its Sub-items cells.

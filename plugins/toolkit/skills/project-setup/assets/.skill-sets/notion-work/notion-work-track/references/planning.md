# Planning in Notion: phases, sub-items, and tasks

Purpose: how an item's plan is kept as records, and how the plan changes
when the work changes. Plans change midway: phases are added, dropped,
merged, and reordered, and sub-items and tasks move between them. Each of
those is a small change to a record, never a rewrite.

## Contents

- How a plan is stored
- Adding phases
- Adding sub-items to a phase
- Adding tasks
- Changing the plan
- Ticking a task
- After any plan change

## How a plan is stored

- A **phase** is a row of Phases linked to its item ("Work item"). It has a
  stable Phase ID (P1, P2, …), an Order, a Status, an Outcome, and an Exit
  result. A phase is not a work item.
- A **sub-item** is a work item whose "Parent item" is the item and whose
  "Phase" is one of the item's phases.
- A **task** is a row of Tasks linked to its item ("Work item") and a phase
  ("Phase"), with a stable Task ID (`P1-T01`), an Order inside the phase,
  and a Done box (a task has no other status).
- The item's page shows all three live: Roadmap (its phases), Sub-items (a
  board by phase), Tasks (grouped by phase). Nothing to copy into text.
- Most tasks sit on the lowest-level items. A parent item holds a task
  only for work that none of its sub-items covers.

## Adding phases

One row each. Order is the phase's place; Phase ID is the next unused
number for this item (never reuse a cancelled one's ID):

```bash
ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"{{PHASES_DS}}"},
  "properties":{"Phase":{"title":[{"text":{"content":"Build the form"}}]},
  "Phase ID":{"rich_text":[{"text":{"content":"P2"}}]},
  "Order":{"number":2},
  "Status":{"select":{"name":"Not Started"}},
  "Outcome":{"rich_text":[{"text":{"content":"The form saves new sign-ups."}}]},
  "Exit result":{"rich_text":[{"text":{"content":"A test sign-up is saved."}}]},
  "Work item":{"relation":[{"id":"<item-page-id>"}]}}}' < /dev/null | jq -r .id
```

List an item's phases in order:

```bash
ntn api v1/data_sources/{{PHASES_DS}}/query -d '{"filter":{"property":"Work item","relation":{"contains":"<item-page-id>"}},"sorts":[{"property":"Order","direction":"ascending"}]}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Phase ID"].rich_text[0].plain_text)\t\(.properties.Phase.title[0].plain_text)\t\(.properties.Status.select.name)"'
```

## Adding sub-items to a phase

Make the sub-item (items.md, "A new work item") with "Parent item" and
"Phase" set. The phase must be one of the parent's own phases: check its
"Work item" is the parent before you set it. To put an existing sub-item in
a phase, set its "Phase":

```bash
ntn api v1/pages/<sub-item-page-id> -X PATCH -d '{"properties":{"Phase":{"relation":[{"id":"<phase-page-id>"}]}}}' < /dev/null
```

## Adding tasks

```bash
ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"{{TASKS_DS}}"},
  "properties":{"Task":{"title":[{"text":{"content":"List the required fields"}}]},
  "Task ID":{"rich_text":[{"text":{"content":"P1-T01"}}]},
  "Order":{"number":1},
  "Work":{"rich_text":[{"text":{"content":"List the fields with the owner."}}]},
  "Deliverable":{"rich_text":[{"text":{"content":"The field list."}}]},
  "Done when":{"rich_text":[{"text":{"content":"The owner approves the list."}}]},
  "Work item":{"relation":[{"id":"<item-page-id>"}]},
  "Phase":{"relation":[{"id":"<phase-page-id>"}]}}}' < /dev/null | jq -r .id
```

"Depends on" links a task to the tasks it waits for (their page ids).

## Changing the plan

| Change | What to do |
| --- | --- |
| Add a phase | A new row with the next Phase ID and the Order where it belongs; renumber the Order of the phases after it (Order only, never Phase ID). |
| Reorder phases | Change only Order on the phases that move. |
| Move a sub-item to another phase | Set its "Phase" to the other phase. |
| Move a task to another phase | Set its "Phase"; set its Order in the new phase. Its Task ID stays. |
| Merge two phases | Ask the owner first when either phase holds work he approved. Then move the second phase's sub-items and tasks to the first, and set the second to Cancelled with Exit result "Merged into P1". |
| Drop a phase | Status Cancelled, Exit result "Dropped: <reason>". Move or cancel its sub-items and tasks first; ask the owner which. |
| Split a phase | Add the new phase, then move the sub-items and tasks that belong to it. |
| A phase is done | Status Done, when its tasks are done, its sub-items are Done or Cancelled, and its exit result was checked. |

Never delete a phase, sub-item, or task: cancelled rows keep the history.
The owner may drag a card to another phase column on the item's Sub-items
board, or edit a row in Notion; his change is the plan now.

## Ticking a task

Only when its "Done when" check is met:

```bash
ntn api v1/pages/<task-page-id> -X PATCH -d '{"properties":{"Done":{"checkbox":true}}}' < /dev/null
```

The owner's own words ("mark task 3 done") meet the check: tick it, and add
a Recent History row on the item with his words and the date.

## After any plan change

- Add a Recent History row on the item: what changed in the plan and why
  (a Q-ID when an answer caused it).
- Rewrite the item's Current state in place so every line is true, and
  set Last updated to today and who changed it. Copy a changed Next
  action into the Next action property in the same step.
- Read the Roadmap back (the phase list above) and check the order.

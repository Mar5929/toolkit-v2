# Searching: the queries

This file gives the exact calls that read work items, phases, and tasks from the Work Items, Phases, and Tasks databases. They include the calls that read the project's own phases and tasks. The calls only read. Open it when you find or read work items.

## Contents

- Rules for every query
- One work item
- The board
- What waits on the owner
- A parent's full tree
- The project's phases and tasks
- Search
- Pages without the template
- Cards with no title

## Rules for every query

- Replace `{{WORK_ITEMS_DS}}`, `{{PHASES_DS}}`, and `{{TASKS_DS}}` with the ids in `PROJECT.md`.
- Every query leaves out archived work items unless the owner asks for them.
- Every Work Items query except "Cards with no title" also needs `{"property":"Work item","title":{"is_not_empty":true}}` in its filter, so that the work item template is never reported. When the filter has other conditions, put this one inside `"and"` with them.

## One work item

Find a work item by its number, never by its title. The number is the part of the ID after the prefix: for `WI-31`, the number is 31.

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"and":[{"property":"ID","unique_id":{"equals":31}},{"property":"Work item","title":{"is_not_empty":true}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
```

- When the query returns no result, the work item may be in the trash or outside this project. Tell the owner, and never make a second work item with the same title.
- Otherwise, read the work item's properties and its text, starting with the work item's Current state in the Overview. `using-notion-cli`, sections "Reading properties" and "Reading and changing page text", give the calls.

## The board

The board is the list of the open work items, with the Status, State, Waiting on, and Next action of each:

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{
  "filter":{"and":[{"property":"Archived","checkbox":{"equals":false}},
    {"property":"Work item","title":{"is_not_empty":true}},
    {"property":"Status","status":{"does_not_equal":"Done"}},
    {"property":"Status","status":{"does_not_equal":"Cancelled"}}]},
  "sorts":[{"property":"Priority","direction":"ascending"},{"property":"ID","direction":"ascending"}],
  "page_size":100}' < /dev/null | jq -r '.results[] | [
    "\(.properties.ID.unique_id.prefix)-\(.properties.ID.unique_id.number)",
    (.properties.Status.status.name // ""),
    (.properties.State.select.name // ""),
    (.properties["Waiting on"].select.name // ""),
    (.properties["Work item"].title | map(.plain_text) | join("")),
    (.properties["Next action"].rich_text | map(.plain_text) | join(""))] | @tsv'
```

- Add the work items that are Done or Cancelled only when asked. To add them, remove the two Status filters.
- Then run "Cards with no title", below, and report each card that it returns as a problem in the project's records.

## What waits on the owner

For each open work item, or for the work items that the owner named, read the page text. Take the Questions and Answers rows whose Status is Open and whose "Decision needed from" is owner.

Report in this order: first what waits on the owner (the work item's ID, the Q-ID, and what the question blocks), then what is in progress, then your next step.

## A parent's full tree

A tree has three levels at most.

```bash
# its sub-items, in phase order
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"property":"Parent item","relation":{"contains":"<page-id>"}},"sorts":[{"property":"Phase order","direction":"ascending"},{"property":"ID","direction":"ascending"}]}' < /dev/null
# its phases, in order
ntn api v1/data_sources/{{PHASES_DS}}/query -d '{"filter":{"property":"Work item","relation":{"contains":"<page-id>"}},"sorts":[{"property":"Order","direction":"ascending"}]}' < /dev/null
# its open tasks, in order
ntn api v1/data_sources/{{TASKS_DS}}/query -d '{"filter":{"and":[{"property":"Work item","relation":{"contains":"<page-id>"}},{"property":"Status","status":{"does_not_equal":"Done"}},{"property":"Status","status":{"does_not_equal":"Cancelled"}}]},"sorts":[{"property":"Order","direction":"ascending"}]}' < /dev/null
```

- Repeat the first query for each sub-item, to reach the third level.
- Under a top-level item, a sub-item with no phase goes last, under "No phase".
- A sub-item has no phases. For a sub-item, the second query returns nothing, or it returns only the phases that were set to Cancelled when the sub-item changed level. A sub-item's tasks are one list, in Order.
- When there is a fourth level, tell the owner which work item is at level 4.

This query lists a work item's phases, each with its Phase ID, its name, and its Status:

```bash
ntn api v1/data_sources/{{PHASES_DS}}/query -d '{"filter":{"property":"Work item","relation":{"contains":"<item-page-id>"}},"sorts":[{"property":"Order","direction":"ascending"}]}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Phase ID"].rich_text[0].plain_text)\t\(.properties.Phase.title[0].plain_text)\t\(.properties.Status.select.name)"'
```

## The project's phases and tasks

```bash
# the project's phases, in order
ntn api v1/data_sources/{{PHASES_DS}}/query -d '{"filter":{"property":"Work item","relation":{"is_empty":true}},"sorts":[{"property":"Order","direction":"ascending"}]}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Phase ID"].rich_text[0].plain_text // "")\t\(.properties.Phase.title[0].plain_text // "")\t\(.properties.Status.select.name // "")"'
# the top-level items, with the project phase each sits under
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"and":[{"property":"Parent item","relation":{"is_empty":true}},{"property":"Archived","checkbox":{"equals":false}},{"property":"Work item","title":{"is_not_empty":true}}]},"sorts":[{"property":"Phase order","direction":"ascending"},{"property":"ID","direction":"ascending"}],"page_size":100}' < /dev/null | jq -r '.results[] | "\(.properties.ID.unique_id.prefix)-\(.properties.ID.unique_id.number)\t\(.properties["Phase column"].formula.string // "")\t\(.properties["Work item"].title | map(.plain_text) | join(""))"'
# the open project tasks, in order
ntn api v1/data_sources/{{TASKS_DS}}/query -d '{"filter":{"and":[{"property":"Work item","relation":{"is_empty":true}},{"property":"Phase","relation":{"is_empty":true}},{"property":"Status","status":{"does_not_equal":"Done"}},{"property":"Status","status":{"does_not_equal":"Cancelled"}}]},"sorts":[{"property":"Order","direction":"ascending"}]}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Task ID"].rich_text[0].plain_text // "")\t\(.properties.Task.title[0].plain_text // "")\t\(.properties.Status.status.name // "")\t\(.properties["Who does it"].select.name // "")"'
```

A top-level item whose Phase column says "No phase" is under no project phase yet.

## Search

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"and":[{"property":"Work item","title":{"contains":"login"}},{"property":"Work item","title":{"is_not_empty":true}}]}}' < /dev/null
```

`v1/search` matches page titles only, not page text. To find words inside the text, first narrow the work items by title, tag, type, parent, or status. Then read the page text of each candidate, and look for the words.

## Pages without the template

A work item has fewer than five blocks when the owner made it with "Empty" in the New menu, or when it was made before the project had a default template. This call counts the blocks:

```bash
ntn api v1/blocks/<page-id>/children < /dev/null | jq '.results | length'
```

Tell the owner that the work item has no template sections, and offer to add them. `work-tracker-database-layout.md`, section "A card the owner made by hand", says how to add them.

## Cards with no title

A card that the owner made and gave no title is hidden from every Work Items view that the toolkit made. The first call below lists the cards with no title. The second call lists the templates. Drop the ids that the second call returns from the first list, because the work item template is one of them.

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"and":[{"property":"Work item","title":{"is_empty":true}},{"property":"Archived","checkbox":{"equals":false}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties.ID.unique_id.prefix)-\(.properties.ID.unique_id.number)\t\(.url)"'
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/templates < /dev/null | jq -r '.templates[].id'
```

Report each card that remains, in the form "A card with no title, IML-6: <link>", and ask the owner to name it or archive it.

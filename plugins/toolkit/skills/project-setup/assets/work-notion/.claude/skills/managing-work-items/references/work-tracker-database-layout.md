# The Notion databases

This file shows how a project looks in Notion, lists every property of its three databases with its options, says where each work item field goes, and gives the calls that save to the databases. Open it when you check what a property holds, or when you create or change a work item's properties, phases, tasks, links, or tags.

The databases come from the owner's "Project" template in Notion. Never rename or remove a property that this file lists.

## Contents

- How a project looks in Notion
- Where each work item field goes
- Work Items properties
- Phases properties
- Tasks properties
- Creating a work item
- Setting State and Status
- Phases and tasks
- A work item that changes level
- The project's phases and tasks
- Links and tags
- Moving a work item under another parent
- A card the owner made by hand

## How a project looks in Notion

```text
Projects database (the owner's; its title column is "Project")
└── <Project name>                     one row: the project page
    ├── Work Items                     database; its default template is the work item template, with an empty title
    │   └── WI-31 Log a transaction    one row: a work item, with its own page
    │       └── WI-31: Log a transaction — solution design    child page, once a design exists
    ├── Phases                         database; one row per phase: the project's phases (P01) and each top-level item's (P1)
    ├── Tasks                          database; one row per task: the project's tasks and each item's
    └── Memory, Current state, Terminology glossary    only with memory in Notion
```

`work-tracker-page-layout.md` lists the sections of a work item's page.

## Where each work item field goes

| Field in the work item template | Where it goes in Notion |
| --- | --- |
| `id` | ID. Notion shows the prefix and the number without padding: `WI-31`, not `WI-031`. |
| `title` | Work item, which is the title property. |
| `type`, `priority`, `delivery`, `design` | The properties with the same names. |
| `state`, `status` | State and Status. |
| `parent` | Parent item. |
| `waiting_on` | Waiting on: `owner`, `agent`, `external`, or `none`. For `external`, the "Waiting on" line of the work item's Current state says who. |
| `requirements_approved`, `result_approved` | Requirements approved, Result approved. |
| (the design approval) | Design approved. The work item template has no field for it. |
| `updated` | No property. The "Last updated" line of the work item's Current state holds it. |
| Goal, Current state, Related items, Moved up, Recent History, Requirements, Questions and Answers, Notes | The page text, which `work-tracker-page-layout.md` describes. The page calls the goal "Goals", and it is a numbered list. |
| Next action (a line of the work item's Current state) | The page text, and a copy in the Next action property. |
| Phases and their Roadmap | Rows of Phases. |
| Tasks | Rows of Tasks. |

## Work Items properties

| Property | Type | Holds |
| --- | --- | --- |
| Work item | Title | The work item's title. |
| ID | Unique ID | A project's own prefix, set after the copy. A template has none. |
| Status | Status | Not Started, Preparing, In Progress, Blocked, Done, Cancelled. |
| State | Select | Backlog, Refining Requirements, Designing, Building, Testing Loop, Reflecting, Deploying, Blocked, Done, Cancelled. The order of the options is the order of the board's columns. |
| Waiting on | Select | owner, agent, external, none. |
| Type | Select | discovery, solution-design, build, data-load, repository-maintenance, research, task, bug, enhancement. |
| Priority | Select | urgent, high, medium, low. |
| Tags | Multi-select | Free labels. |
| Next action | Text | A copy of the "Next action" line of the work item's Current state, so that a board card shows it. |
| Requirements approved, Design approved, Result approved | Text | `YYYY-MM-DD by <name>`, or `no`. |
| Design | Select | none, proposed, approved, superseded. |
| Delivery | Select | not-offered, agent-led, owner-led. |
| Files | Files | Files that the owner attached. The agent adds none. |
| Archived | Checkbox | Hides the work item from the boards. |
| Parent item | Relation to Work Items | Two-way. The other side is Sub-items. |
| Blocked by | Relation to Work Items | Two-way. The other side is Blocking. This work item cannot finish until the other work item is Done. |
| Related | Relation to Work Items | One-way. Connected work items, in no order. |
| Phase | Relation to Phases | The phase that this work item is under. For a top-level item, it is its project phase. For a level-2 sub-item, it is one of its parent's phases. It is empty for a level-3 sub-item. |
| Phases, Tasks | Relations | Filled from the other side. |
| Phase order, Phase name | Rollups of Phase | Phase order is only for sorting views, and Phase name is only for the Phase column. |
| Phase column | Formula | The work item's phase with its place in the plan ("02 · Build the form"), so that boards show phases in plan order. |

When the project's memory is in Notion too, the memory setup adds the Memories, Facts, and Entities relations.

A change to the Status options replaces the whole list. Always send every option, each with its group. An option that is left out is deleted.

## Phases properties

| Property | Type | Holds |
| --- | --- | --- |
| Phase | Title | The phase's name. |
| Phase ID | Text | `P1`, `P2`, ... for a work item's phases; `P01`, `P02`, ... for the project's phases. It never changes. |
| Order | Number | The phase's place in the plan. Reordering changes only this property. |
| Status | Select | Not Started, In Progress, Done, Cancelled. |
| Outcome | Text | What the phase establishes. |
| Exit result | Text | The evidence that the phase is complete. |
| Phase type | Formula | `Project` when Work item is empty, otherwise `Work item`. It fills itself. Never set it. |
| Work item | Relation to Work Items | The top-level item whose plan the phase belongs to. It is empty for a project phase. A sub-item is linked only to phases that were set to Cancelled when the sub-item changed level. The other side is Phases. |
| Sub-items, Tasks | Relations | Filled from the other side. For a project phase, Sub-items lists its top-level items. |

## Tasks properties

| Property | Type | Holds |
| --- | --- | --- |
| Task | Title | The task's name. |
| Task ID | Text | `P1-T01` in a top-level item, `T01` in a sub-item, `PT-01` for a project task. It never changes. |
| Status | Status | Not Started, In Progress, Done, Cancelled. A task is open while its Status is Not Started or In Progress. Views and searches filter on it. |
| Order | Number | The order inside the phase, or inside a plain list. A plain list is a sub-item's tasks, or the project tasks. |
| Work | Text | The action to take. |
| Deliverable | Text | The file, decision, or other result. |
| Done when | Text | The observable completion check. |
| Who does it | Select | agent or owner. A project task may hold the name of another person who owes the task, with the party, such as `Sarah Chen (client)`. Write that name as the option, and Notion adds it. |
| Task type | Formula | `Project` when Work item is empty, otherwise `Work item`. It fills itself. Never set it. |
| Work item | Relation to Work Items | The work item that the task belongs to. It is empty for a project task. The other side is Tasks. |
| Phase | Relation to Phases | The task's phase, for a top-level item's task. It is empty for a sub-item's task and for a project task. The other side is Tasks. |
| Depends on | Relation to Tasks | The tasks that this task waits for. |

## Creating a work item

The body below creates a work item. Replace each `{{…}}` with the id in `PROJECT.md`.

- State and Status are the values that `managing-work-items` gave you.
- Type is the value that `managing-work-items` chose from the `type` list of its work item template. The Type row of "Work Items properties" holds the same options.
- The other values are the defaults for a new work item. Use another value only when `managing-work-items` says so.

```json
{"parent": {"type": "data_source_id", "data_source_id": "{{WORK_ITEMS_DS}}"},
 "properties": {
   "Work item": {"title": [{"text": {"content": "<Title>"}}]},
   "Status": {"status": {"name": "<status>"}},
   "State": {"select": {"name": "<state>"}},
   "Type": {"select": {"name": "<type>"}},
   "Priority": {"select": {"name": "medium"}},
   "Waiting on": {"select": {"name": "none"}},
   "Requirements approved": {"rich_text": [{"text": {"content": "no"}}]},
   "Design": {"select": {"name": "none"}},
   "Design approved": {"rich_text": [{"text": {"content": "no"}}]},
   "Result approved": {"rich_text": [{"text": {"content": "no"}}]},
   "Delivery": {"select": {"name": "not-offered"}},
   "Parent item": {"relation": [{"id": "<parent-page-id>"}]},
   "Phase": {"relation": [{"id": "<phase-page-id>"}]}},
 "template": {"type": "default"}}
```

- For a top-level item, leave out "Parent item". Its "Phase" is its project phase, which "The project's phases and tasks" below describes. Leave "Phase" out until the owner has named a project phase.
- For a level-2 sub-item, "Phase" is one of its parent's phases, which is a row whose "Work item" is that parent.
- For a level-3 sub-item, leave out "Phase".
- Send the body with `ntn api v1/pages -d @new.json < /dev/null`. The answer holds the page `id`, its `url`, and the new ID (`.properties.ID.unique_id`: prefix and number).
- When Notion refuses because the database has no default template, tell the owner. The owner sets the default template in the Notion app.

## Setting State and Status

Set both in one call. The State table of `managing-work-items` gives the Status for each State.

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"State":{"select":{"name":"Building"}},"Status":{"status":{"name":"In Progress"}}}}' < /dev/null
```

Set Waiting on the same way, with `{"Waiting on":{"select":{"name":"owner"}}}`. Waiting on is `owner` while a question for the owner is open. It is `external` for a question to someone else. Otherwise it is `agent` or `none`.

## Phases and tasks

Only a top-level item has phases. A level-2 sub-item is in a phase when its "Phase" is one of its parent's phases. A sub-item's tasks have no "Phase": they are one plain list, in Order. The work item's page shows the phases, sub-items, and tasks as they are now, so there is nothing to copy into its text.

### Add a phase to a top-level item

Order is the phase's place in the plan. Phase ID is one more than the highest Phase ID that this work item ever used, cancelled phases included.

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

### Add a task

"Depends on" takes the page ids of the tasks that the new task waits for. For a sub-item's task, leave out "Phase". The Task ID of a sub-item's task is `T` and the next unused number in the work item, for example `T05`.

```bash
ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"{{TASKS_DS}}"},
  "properties":{"Task":{"title":[{"text":{"content":"List the required fields"}}]},
  "Task ID":{"rich_text":[{"text":{"content":"P1-T01"}}]},
  "Order":{"number":1},
  "Status":{"status":{"name":"Not Started"}},
  "Work":{"rich_text":[{"text":{"content":"List the fields with the owner."}}]},
  "Deliverable":{"rich_text":[{"text":{"content":"The field list."}}]},
  "Done when":{"rich_text":[{"text":{"content":"The owner approves the list."}}]},
  "Who does it":{"select":{"name":"agent"}},
  "Work item":{"relation":[{"id":"<item-page-id>"}]},
  "Phase":{"relation":[{"id":"<phase-page-id>"}]}}}' < /dev/null | jq -r .id
```

### Start, finish, or cancel a task

Start a task:

```bash
ntn api v1/pages/<task-page-id> -X PATCH -d '{"properties":{"Status":{"status":{"name":"In Progress"}}}}' < /dev/null
```

Finish a task. `managing-work-items` calls this ticking the task:

```bash
ntn api v1/pages/<task-page-id> -X PATCH -d '{"properties":{"Status":{"status":{"name":"Done"}}}}' < /dev/null
```

Cancel a task. Set its Status to Cancelled, and start its title with "Cancelled: ":

```bash
ntn api v1/pages/<task-page-id> -X PATCH -d '{"properties":{"Status":{"status":{"name":"Cancelled"}},"Task":{"title":[{"text":{"content":"Cancelled: List the required fields"}}]}}}' < /dev/null
```

### Put an existing sub-item in a phase

Set the sub-item's "Phase". First check that the phase's "Work item" is the parent.

```bash
ntn api v1/pages/<sub-item-page-id> -X PATCH -d '{"properties":{"Phase":{"relation":[{"id":"<phase-page-id>"}]}}}' < /dev/null
```

### Change the plan

A change to the plan is a change to rows:

| Change | What to do |
| --- | --- |
| Add a phase | Add a new row with the next Phase ID and the Order where the phase belongs. Renumber the Order of the phases after it. Change only Order, never Phase ID. |
| Reorder phases | Change only Order, on the phases that move. |
| Move a sub-item to another phase | Set its "Phase". |
| Move a task to another phase | Set its "Phase", and its Order in the new phase. Its Task ID stays. |
| Merge two phases | Move the second phase's sub-items and tasks to the first phase. Set the second phase to Cancelled, with Exit result "Merged into P1". |
| Drop a phase | First move or cancel its sub-items and tasks. Then set its Status to Cancelled and its Exit result to "Dropped: <reason>". |
| Split a phase | Add the new phase, and then move the sub-items and tasks that belong to it. |
| A phase is done | Set its Status to Done. |

After a change to the plan, list the work item's phases and check the order. `work-tracker-searching.md`, section "A parent's full tree", gives the query.

### A task with an empty Status, and a Tasks database from before toolkit 0.8.0

A task that was made by hand can have an empty Status. Set its Status to Not Started.

A Tasks database that still has a "Done" checkbox, or a Status of type select, was set up before toolkit 0.8.0.

- Tell the owner that "update the toolkit" converts the database.
- Until the database is converted, send and read the Tasks Status with the type that the database has. Write `"select"` in place of `"status"`, in the calls in this file and in `work-tracker-searching.md`.
- Until the database is converted, tick Done, where it exists, exactly when Status is Done or Cancelled.

## A work item that changes level

Use this section in two cases: a move puts a work item at another level, or a work item that was made before toolkit 0.8.0 is a sub-item that still has phases.

- **Phases to a plain list** (the work item is now a sub-item). Do these six things:
  1. Read the work item's phases and tasks. `work-tracker-searching.md`, section "A parent's full tree", gives the queries.
  2. Give its tasks new Orders 1, 2, 3, ... in plan order. Plan order is phase Order first, and then task Order.
  3. Empty each task's "Phase", with `{"Phase":{"relation":[]}}`. Each task keeps its Task ID and its Status.
  4. Empty "Phase" on each of its sub-items.
  5. Set each of its phases to Cancelled, with Exit result "Removed: a sub-item has no phases. Its tasks are now one plain list."
  6. Add one Recent History row on the work item that names each phase removed.
- **A plain list to phases** (the work item is now top-level). Do these three things:
  1. Add phase `P1`, named as the owner approves, and set it as "Phase" on each of the work item's tasks and sub-items. The tasks keep their IDs. New tasks take `P1-T` IDs.
  2. Set the work item's own "Phase" to the project phase that the owner names.
  3. Add a Recent History row.

## The project's phases and tasks

- A project phase is a row of Phases whose "Work item" is empty and whose Phase ID has two digits (`P01`). Its Phase type shows `Project`.
- A project task is a row of Tasks whose "Work item" and "Phase" are both empty, with a Task ID like `PT-01`. Its Task type shows `Project`.
- A row with an empty "Work item" and another ID was made by hand. Ask the owner whether the row belongs to the project or to a work item.
- The project page shows the project's phases and tasks in three views: the Phases view "Project phases", the Tasks view "Project tasks", and the Work Items board "By project phase".
- `work-tracker-searching.md`, section "The project's phases and tasks", gives the queries that read them.

### Add a project phase

Phase ID is the next unused project number. Order is the phase's place among the project phases.

```bash
ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"{{PHASES_DS}}"},
  "properties":{"Phase":{"title":[{"text":{"content":"Discovery"}}]},
  "Phase ID":{"rich_text":[{"text":{"content":"P01"}}]},
  "Order":{"number":1},
  "Status":{"select":{"name":"Not Started"}},
  "Outcome":{"rich_text":[{"text":{"content":"The project's scope is agreed."}}]},
  "Exit result":{"rich_text":[{"text":{"content":"The owner approves the scope."}}]}}}' < /dev/null | jq -r .id
```

### Put a top-level item in a project phase, or move it

- Use the same "Phase" call as for a sub-item, under "Put an existing sub-item in a phase" above.
- First check that the phase's "Work item" is empty and that its Phase ID has two digits.
- Write the project phase in the work item's Related items line too: "Project phase P01."

### Merge, drop, or reorder project phases

Follow the same table as for a work item's phases, under "Change the plan" above, with top-level items in place of sub-items.

### Add a project task

Use the same call as for a task, without "Work item" and "Phase". Its Task ID is `PT-` and the next unused number, for example `PT-04`. Its Order is its place in the list. Starting, finishing, and cancelling a project task are the same calls as for any task.

## Links and tags

**Links.** Send the whole list of page ids for the property:

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Blocked by":{"relation":[{"id":"<other-page-id>"}]}}}' < /dev/null
```

- "Blocked by" fills "Blocking" on the other work item. "Related" is one-way.
- Never link a work item to itself.
- Also write the IDs of the linked work items in the Overview's "Related items" line, so that the page text lists every link.

**Tags.** Send the whole list. A new name becomes a new option, and a name cannot hold a comma. Reuse the exact spelling of an option that exists:

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}} < /dev/null | jq -r '.properties.Tags.multi_select.options[].name'
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Tags":{"multi_select":[{"name":"ios"},{"name":"payments"}]}}}' < /dev/null
```

## Moving a work item under another parent

1. Count the levels for the work item and for every level under it, as step 1 of "Create a work item" in `references/work-tracker.md` says.
2. Set "Parent item" to the new parent, or empty it to make the work item top-level. Then set "Phase":
   - Under a top-level parent, set it to the parent's phase that `managing-work-items` gives, or ask the owner which phase.
   - Under a level-2 parent, empty it.
   - At the top level, set it to the project phase that the owner names.
   - Never keep a phase of the old parent.
3. When the work item's level changed, follow "A work item that changes level".
4. Add Recent History rows on the work item, on the old parent, and on the new parent.

When the owner changed "Parent item" by hand, add the same Recent History rows at your next change.

## A card the owner made by hand

A card that the owner made with "New" or "+ New page" gets the sections of the work item template by itself. Its other properties are empty unless the template holds a value, so its State is empty.

1. Give such a card State Backlog and Status Not Started, and the other defaults of "Creating a work item".
2. Add a Recent History row: "Made in Notion by hand." In the same call, delete the template's note and every prompt that the owner left unfilled, and keep everything that the owner wrote. `work-tracker-page-layout.md`, section "Filling a new work item", says how.
3. A page that was made with "Empty" in the New menu, or made before the project had a default template, has an empty body (fewer than five blocks). Give it the default template. Its properties are kept.
   - Read the id of the template with `is_default` true. `using-notion-cli`, section "Database templates", gives the call.
   - Apply the template with the call below, and then wait for the content. `using-notion-cli`, section "Waiting for a template", says how to wait.

   ```bash
   ntn api v1/pages/<page-id> -X PATCH -d '{"template":{"type":"template_id","template_id":"<default-template-id>"}}' < /dev/null
   ```

   Its Recent History row is: "Made in Notion by hand; the template was filled in."

A card with an empty title is hidden from every Work Items view and from every query except "Cards with no title" in `work-tracker-searching.md`. Name it or archive it only after the owner says which of the two the owner wants and, to name it, what the title is.

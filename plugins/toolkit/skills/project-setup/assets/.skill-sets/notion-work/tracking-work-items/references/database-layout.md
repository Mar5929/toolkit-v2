# The Notion databases

How a project looks in Notion, every property of its three databases with its options, where each work item field goes, and how to save to them. The bodies that create the databases are in `assets/schema/`. Never rename or remove a property listed here.

## Contents

- How a project looks in Notion
- Where each work item field goes
- Work Items properties
- Phases properties
- Tasks properties
- Creating an item
- Setting State and Status
- Phases and tasks
- Links, tags, and files
- Moving an item under another parent
- A card the owner made by hand

## How a project looks in Notion

```text
Projects database (the owner's; its title column is "Project")
└── <Project name>                     one row: the project page
    ├── Work Items                     database; its default template is the work item template, with an empty title
    │   └── WI-31 Log a transaction    one row: a work item, with its own page
    │       └── WI-31: Log a transaction — solution design    child page, once a design exists
    ├── Phases                         database; one row per phase of an item's plan
    ├── Tasks                          database; one row per task
    └── Memory, Current state, Terminology glossary    only with memory in Notion
```

The sections of a work item's page are in `page-layout.md`.

## Where each work item field goes

| Field in the work item template | Where it goes in Notion |
| --- | --- |
| `id` | ID. Notion shows the prefix and the number without padding: `WI-31`, not `WI-031`. |
| `title` | Work item (the title). |
| `type`, `priority`, `delivery`, `design` | The properties with the same names. |
| `state`, `status` | State and Status. |
| `parent` | Parent item. |
| `waiting_on` | Waiting on: `owner`, `agent`, `external`, or `none`. For `external`, the Current state "Waiting on" line says who. |
| `requirements_approved`, `result_approved` | Requirements approved, Result approved. |
| (the design approval) | Design approved. The model's work item file has no field for it. |
| `updated` | No property. The Current state "Last updated" line holds it. |
| Goal, Current state, Related items, Recent History, Requirements, Questions and Answers, Notes | The page text (`page-layout.md`). |
| Next action (a Current state line) | The page text, and a copy in the Next action property. |
| Phases and their Roadmap | Rows of Phases. |
| Tasks | Rows of Tasks. |
| Source files | Files, and a line in the page's Notes, Sources. |

## Work Items properties

| Property | Type | Holds |
| --- | --- | --- |
| Work item | Title | The item's title. |
| ID | Unique ID | A project's own prefix, set after the copy. A template has none. |
| Status | Status | Not Started, Preparing, In Progress, Blocked, Done, Cancelled. |
| State | Select | Backlog, Refining Requirements, Designing, Building, Testing Loop, Reflecting, Deploying, Blocked, Done, Cancelled. The option order is the board column order. |
| Waiting on | Select | owner, agent, external, none. |
| Type | Select | discovery, solution-design, build, data-load, repository-maintenance, research, task, bug, enhancement. |
| Priority | Select | urgent, high, medium, low. |
| Tags | Multi-select | Free labels. |
| Next action | Text | A copy of the Current state "Next action" line, so a board card shows it. |
| Requirements approved, Design approved, Result approved | Text | `YYYY-MM-DD by <name>`, or `no`. |
| Design | Select | none, proposed, approved, superseded. |
| Delivery | Select | not-offered, agent-led, owner-led. |
| Files | Files | Source files and attachments. |
| Archived | Checkbox | Hides the item from the boards. |
| Parent item | Relation to Work Items | Two-way. The other side is Sub-items. |
| Blocked by | Relation to Work Items | Two-way. The other side is Blocking. This item cannot finish until the other item is Done. |
| Related | Relation to Work Items | One-way. Connected items, no order. |
| Phase | Relation to Phases | The phase of the parent that this item belongs to. |
| Phases, Tasks | Relations | Filled from the other side. |
| Phase order, Phase name | Rollups of Phase | Phase order is only for sorting views, and Phase name only for the Phase column. |
| Phase column | Formula | The item's phase with its place in the plan ("02 · Build the form"), so boards show phases in plan order. |

With memory in Notion, the memory setup adds the Memories, Facts, and Entities relations.

Changing the Status options replaces the whole list: always send every option, each with its group. An option left out is deleted.

## Phases properties

| Property | Type | Holds |
| --- | --- | --- |
| Phase | Title | The phase's name. |
| Phase ID | Text | P1, P2, ... Stable: never reused or renumbered. |
| Order | Number | The phase's place in the plan. Reordering changes only this. |
| Status | Select | Not Started, In Progress, Done, Cancelled. |
| Outcome | Text | What the phase establishes. |
| Exit result | Text | The evidence that the phase is complete. |
| Work item | Relation to Work Items | The item whose plan it is. The other side is Phases. |
| Sub-items, Tasks | Relations | Filled from the other side. |

## Tasks properties

| Property | Type | Holds |
| --- | --- | --- |
| Task | Title | The task's name. |
| Task ID | Text | `P1-T01` form. Stable: never reused or renumbered. |
| Done | Checkbox | Ticked when the task is done or cancelled. A task has no other status. |
| Order | Number | The order inside the phase. |
| Work | Text | The action to take. |
| Deliverable | Text | The file, decision, or other result. |
| Done when | Text | The observable completion check. |
| Work item | Relation to Work Items | The item it belongs to. The other side is Tasks. |
| Phase | Relation to Phases | Its phase. The other side is Tasks. |
| Depends on | Relation to Tasks | The tasks it waits for. |

## Creating an item

Replace `{{…}}` with the ids in `PROJECT.md`. State and Status are the values `managing-work-items` gave you. The other values are the defaults for a new item; use another value only when `managing-work-items` says so.

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

- Leave out "Parent item" and "Phase" for a top-level item.
- Use only a phase whose "Work item" is that parent.
- Send it with `ntn api v1/pages -d @new.json < /dev/null`. The answer holds the page `id`, its `url`, and the new ID (`.properties.ID.unique_id`: prefix and number).
- When Notion refuses because the database has no default template, tell the owner. The project-setup skill restores the templates.

## Setting State and Status

Set both in one call. The Status for each State is in the State table of `managing-work-items`.

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"State":{"select":{"name":"Building"}},"Status":{"status":{"name":"In Progress"}}}}' < /dev/null
```

Waiting on is set the same way, with `{"Waiting on":{"select":{"name":"owner"}}}`. It is `owner` while a question of his is open, `external` for a question to someone else, and otherwise `agent` or `none`.

## Phases and tasks

A sub-item is in a phase when its "Phase" is one of its parent's phases. The item's page shows the phases, sub-items, and tasks live, so there is nothing to copy into its text.

Add a phase. Order is its place; Phase ID is the next unused number for this item, and a cancelled phase's ID is never reused:

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

Add a task. "Depends on" takes the page ids of the tasks it waits for:

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

Tick a task:

```bash
ntn api v1/pages/<task-page-id> -X PATCH -d '{"properties":{"Done":{"checkbox":true}}}' < /dev/null
```

Cancel a task. It has no Cancelled status, so tick Done and start its title with "Cancelled: ":

```bash
ntn api v1/pages/<task-page-id> -X PATCH -d '{"properties":{"Done":{"checkbox":true},"Task":{"title":[{"text":{"content":"Cancelled: List the required fields"}}]}}}' < /dev/null
```

Put an existing sub-item in a phase by setting its "Phase". Check first that the phase's "Work item" is the parent:

```bash
ntn api v1/pages/<sub-item-page-id> -X PATCH -d '{"properties":{"Phase":{"relation":[{"id":"<phase-page-id>"}]}}}' < /dev/null
```

Changing the plan is a change to rows:

| Change | What to do |
| --- | --- |
| Add a phase | A new row with the next Phase ID and the Order where it belongs. Renumber the Order of the phases after it (Order only, never Phase ID). |
| Reorder phases | Change only Order on the phases that move. |
| Move a sub-item to another phase | Set its "Phase". |
| Move a task to another phase | Set its "Phase" and its Order in the new phase. Its Task ID stays. |
| Merge two phases | Move the second phase's sub-items and tasks to the first. Set the second to Cancelled with Exit result "Merged into P1". |
| Drop a phase | Move or cancel its sub-items and tasks first. Then set Status Cancelled and Exit result "Dropped: <reason>". |
| Split a phase | Add the new phase, then move the sub-items and tasks that belong to it. |
| A phase is done | Set Status Done. |

After a plan change, list the item's phases (`searching.md`, "A parent's full tree") and check the order.

## Links, tags, and files

Links. Send the whole list of page ids for the property:

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Blocked by":{"relation":[{"id":"<other-page-id>"}]}}}' < /dev/null
```

- "Blocked by" fills "Blocking" on the other item. "Related" is one-way.
- Never link an item to itself.
- Also write the linked items' IDs in the Overview's "Related items" line, so the page text lists every link.

Tags. Send the whole list. A new name becomes a new option, and a name cannot hold a comma. Reuse an existing option's exact spelling:

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}} < /dev/null | jq -r '.properties.Tags.multi_select.options[].name'
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Tags":{"multi_select":[{"name":"ios"},{"name":"payments"}]}}}' < /dev/null
```

Files. A meeting transcript, document, or other source goes in the Files property, with one line in the page's Notes, Sources.

1. Upload the file. The limit is 20 MB; for a bigger file, tell the owner it is too big to upload this way. Text the owner pasted is written first to a scratch folder outside the project, named `YYYY-MM-DD-<short-name>.md` (`using-notion-cli`, "Sending a body"). Remove the scratch folder once the Files property is saved and read back.

   ```bash
   ntn files create --filename "<name>" --content-type "<type>" --json < "<path>" | jq -r '.id, .status'
   ```

   The status must be `uploaded`. Use the file's real type, such as `text/plain`, `text/markdown`, `application/pdf`, `image/png`, or `image/jpeg`. Notion refuses a type it does not support.
2. Read the files already there, then send the whole list with the new file last. A file already there is kept by sending it back as it came:

   ```bash
   ntn api v1/pages/<page-id> < /dev/null | jq -c '.properties.Files.files'
   ```

   ```json
   {"properties": {"Files": {"files": [
     {"type": "file", "name": "kickoff-notes.txt", "file": {"url": "<url exactly as read>"}},
     {"type": "file_upload", "name": "interview-2.txt", "file_upload": {"id": "<upload id>"}}
   ]}}}
   ```

3. Add its line under Sources, with an `update_content` call. The first time, replace the template's example line. Example: `- interview-2.txt — second owner interview; the three login methods (R-03).`

## Moving an item under another parent

1. Count the levels for the item and every level under it, as in step 1 of "Create an item" in `SKILL.md`.
2. Set "Parent item" to the new parent. Set "Phase" to the new parent's phase that `managing-work-items` gives, or ask the owner which one. Never keep a phase of the old parent.
3. Add Recent History rows on the item, the old parent, and the new parent.

When the owner changed "Parent item" by hand, add the same history rows on your next change.

## A card the owner made by hand

A card made with "New" or "+ New page" gets the work item template's sections by itself. Its other properties are empty unless the template holds a value, so its State is empty.

1. Give such a card State Backlog and Status Not Started, and the other defaults of "Creating an item".
2. Add a Recent History row: "Made in Notion by hand."
3. A page made with "Empty" in the New menu, or made before the project had a default template, has an empty body (fewer than five blocks). Give it the default template; its properties are kept. Read the id of the template with `is_default` true (`using-notion-cli`, "Database templates"), then wait for the content (`using-notion-cli`, "Waiting for a template"):

   ```bash
   ntn api v1/pages/<page-id> -X PATCH -d '{"template":{"type":"template_id","template_id":"<default-template-id>"}}' < /dev/null
   ```

   Its history row is: "Made in Notion by hand; the template was filled in."

A card with an empty title is hidden from every Work Items view and query except "Cards with no title" in `searching.md`. Name it or archive it only after the owner says which of the two he wants and, to name it, what the title is.

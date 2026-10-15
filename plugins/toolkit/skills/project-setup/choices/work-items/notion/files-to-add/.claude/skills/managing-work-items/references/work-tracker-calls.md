# Work item calls in Notion

`using-notion-cli` gives the general call form. These calls are specific to this project's work item databases. Replace each `<…-data-source-id>` with the ID in `PROJECT.md`.

Every Work Items query needs `{"property":"Work item","title":{"is_not_empty":true}}` in its filter, because Notion lists the work item template as an untitled row. A query that lists items also needs `{"property":"Archived","checkbox":{"equals":false}}` unless the owner asks for archived ones. Combine them with `"and"`.

## Calls

**A database's properties, types, and options:**

```bash
ntn api v1/data_sources/<data-source-id> < /dev/null | jq -r '.properties | to_entries[] | "\(.key)\t\(.value.type)\t\((.value.select // .value.status // .value.multi_select // {}).options // [] | map(.name) | join(", "))"'
```

**Create a work item.** `"template": {"type": "default"}` is required; without it the page is empty. Send with `ntn api v1/pages -d @new.json < /dev/null`. The answer holds the page `id`, `url`, and new ID in `.properties.ID.unique_id`. These are the defaults for a new item. Leave out Parent item for a top-level item.

```json
{"parent": {"type": "data_source_id", "data_source_id": "<work-items-data-source-id>"},
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

After creating: wait for the template to fill (`using-notion-cli`), put the ID in the Solution Design page's title, fill the page, and for a sub-item add a Recent History row on the parent.

**Set State and Status, or any property:**

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"State":{"select":{"name":"Building"}},"Status":{"status":{"name":"In Progress"}}}}' < /dev/null
```

**Title the Solution Design page:**

```bash
ntn api v1/pages/<design-page-id> -X PATCH -d '{"properties":{"title":{"title":[{"text":{"content":"Solution Design - WI-31"}}]}}}' < /dev/null
```

The `<page …>` line in the item's text holds the design page's address; its last 32 characters are the ID. To create a missing one, POST to `v1/pages` with `"parent": {"type": "page_id", "page_id": "<item-page-id>"}`, the title as above, and the text in `"markdown"`.

**Give the default template to a page with no sections** (get its ID from the templates call in `using-notion-cli`):

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"template":{"type":"template_id","template_id":"<default-template-id>"}}' < /dev/null
```

**Add a phase.** A project phase leaves out Work item and uses a two-digit ID like `P01`.

```bash
ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<phases-data-source-id>"},
  "properties":{"Phase":{"title":[{"text":{"content":"Build the form"}}]},
  "Phase ID":{"rich_text":[{"text":{"content":"P2"}}]},
  "Order":{"number":2},
  "Status":{"select":{"name":"Not Started"}},
  "Outcome":{"rich_text":[{"text":{"content":"The form saves new sign-ups."}}]},
  "Exit result":{"rich_text":[{"text":{"content":"A test sign-up is saved."}}]},
  "Work item":{"relation":[{"id":"<item-page-id>"}]}}}' < /dev/null | jq -r .id
```

**Add a task.** Leave out Phase in a plain list; leave out Work item and Phase for a project task. Depends on takes the page IDs of the tasks it waits for. Start a task by setting Status to In Progress, and finish it with Done.

```bash
ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<tasks-data-source-id>"},
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

**Find one item by its number** (never by title). For `WI-31` the number is 31; check the returned prefix matches.

```bash
ntn api v1/data_sources/<work-items-data-source-id>/query -d '{"filter":{"and":[{"property":"ID","unique_id":{"equals":31}},{"property":"Work item","title":{"is_not_empty":true}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
```

**The board:** open items sorted by Priority, then ID. Report each one's Status, State, Waiting on, and Next action, then any untitled cards (below).

```json
{"filter": {"and": [
   {"property": "Archived", "checkbox": {"equals": false}},
   {"property": "Work item", "title": {"is_not_empty": true}},
   {"property": "Status", "status": {"does_not_equal": "Done"}},
   {"property": "Status", "status": {"does_not_equal": "Cancelled"}}]},
 "sorts": [{"property": "Priority", "direction": "ascending"}, {"property": "ID", "direction": "ascending"}],
 "page_size": 100}
```

**What waits on the owner:** read the text of each open item and collect open Q&A rows whose "Decision needed from" is the owner. Report those first, then what's in progress, then your next step.

**An item's sub-items, phases, and open tasks** (one filter each, on Work Items, Phases, and Tasks; sort sub-items by Phase order then ID, the rest by Order; repeat the first for each sub-item to reach level 3):

```json
{"property": "Parent item", "relation": {"contains": "<page-id>"}}
{"property": "Work item", "relation": {"contains": "<page-id>"}}
{"and": [{"property": "Work item", "relation": {"contains": "<page-id>"}}, {"property": "Status", "status": {"does_not_equal": "Done"}}, {"property": "Status", "status": {"does_not_equal": "Cancelled"}}]}
```

**Project phases and tasks:** filter Phases and Tasks on `{"property": "Work item", "relation": {"is_empty": true}}`. Top-level items filter on an empty Parent item; their Phase column shows the project phase.

**Comments:** add one, or read an item's comments oldest first.

```bash
ntn api v1/comments -d '{"parent":{"page_id":"<page-id>"},"markdown":"Agent: a helper started on **P1-T02**."}' < /dev/null | jq -r .id
ntn api v1/comments block_id==<page-id> < /dev/null | jq -r '.results[] | "\(.created_time)\t\(.display_name.resolved_name // "")\t\(.rich_text | map(.plain_text) | join(""))"'
```

## Known problems

| What you see | What to do |
| --- | --- |
| An untitled card | It's hidden from views. Query for an empty title with Archived false, drop the template IDs (from the templates call), and ask the owner whether to name or archive each one. |
| A hand-made card with an empty State | Set the creation defaults (State Backlog, Status Not Started, and so on) and note it in Recent History. |
| A page with no sections | Tell the owner, offer to add them, apply the default template once, and wait for it to fill. |
| Create refused: no default template | Tell the owner; only the Notion app can set one. |
| An item not found by its number | It may be in the trash or another project. Tell the owner; never make a second item with the same title. |
| State and Status don't match | The owner dragged the card, which changes only Status. Ask which State it's in, with a recommendation. |
| A Phases call fails on Status | Phases Status is a `select`, not a `status`. |
| A task with an empty Status, or a phase or task with an empty Work item and a non-project ID | Hand-made. Set Not Started, or ask whether the row belongs to the project or an item. |
| An item at a fourth level | Tell the owner which one. |
| A view, child page, or unknown block line was lost in an edit | Stop and tell the owner which one; those can't be restored as text. |

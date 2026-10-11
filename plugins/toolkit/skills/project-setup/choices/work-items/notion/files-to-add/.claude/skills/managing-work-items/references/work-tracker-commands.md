# Notion work-tracker API calls

Use these calls for the action selected in `work-tracker.md` and `work-tracker-page-updates.md`. Read `using-notion-cli` before the first call in a session. Take IDs from `PROJECT.md`, inspect the live schema, and verify each write. [work-tracker-known-problems.md](work-tracker-known-problems.md) covers recovery.

## Commands

`using-notion-cli` gives the form of a call, a query, and a change to page text. The calls below are the ones that are particular to work items. Replace each `<…-data-source-id>` with the data source id in `PROJECT.md`.

Every query on Work Items needs `{"property":"Work item","title":{"is_not_empty":true}}` in its filter, so that the work item template is never reported. The one exception is the query for cards with no title, in [work-tracker-known-problems.md](work-tracker-known-problems.md). A query that lists work items also needs `{"property":"Archived","checkbox":{"equals":false}}`, unless the owner asks for archived work items. Put these conditions inside `"and"` with the other conditions.

**The properties of a database, with each one's type and options:**

```bash
ntn api v1/data_sources/<data-source-id> < /dev/null | jq -r '.properties | to_entries[] | "\(.key)\t\(.value.type)\t\((.value.select // .value.status // .value.multi_select // {}).options // [] | map(.name) | join(", "))"'
```

**Create a work item.** The API requires `"template": {"type": "default"}` in the create request; omitting it creates an empty page even when Notion has a default template. This is part of creation, not a separate template application. Send this body with `ntn api v1/pages -d @new.json < /dev/null`. The answer holds the page `id`, its `url`, and the new ID (`.properties.ID.unique_id`: prefix and number).

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

The values shown are the defaults for a new work item. Use another value only when `managing-work-items` says so. Leave out "Parent item" for a top-level item, and set "Phase" as [work-tracker-page-updates.md](work-tracker-page-updates.md), section "Phases, tasks, and sub-items", says.

**Set State and Status, or another property:**

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"State":{"select":{"name":"Building"}},"Status":{"status":{"name":"In Progress"}}}}' < /dev/null
```

**Set the title of the Solution Design page:**

```bash
ntn api v1/pages/<design-page-id> -X PATCH -d '{"properties":{"title":{"title":[{"text":{"content":"Solution Design - WI-31"}}]}}}' < /dev/null
```

**Make a Solution Design page for a work item that has none.** Send `ntn api v1/pages -d @design.json < /dev/null`. The body `design.json` has three parts: `"parent": {"type": "page_id", "page_id": "<item-page-id>"}`, the title in `"properties"` as in the call above, and the text in `"markdown"`.

**Give the default template to a work item's page that has no sections.** `using-notion-cli`, section "Database templates", gives the call that prints the id of the default template.

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"template":{"type":"template_id","template_id":"<default-template-id>"}}' < /dev/null
```

**Add a phase.** For a project phase, leave out "Work item", and give it a Phase ID with two digits, such as `P01`.

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

**Add a task.** For a task in a work item without phases, leave out "Phase" and use the plain-list Task ID form. For a project task, leave out "Work item" and "Phase". "Depends on" takes the page ids of the tasks that the new task waits for.

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

To start a task, set its Status to In Progress. To finish it, set its Status to Done. `managing-work-items` calls this ticking the task.

**Find one work item by its number.** Find a work item by its number, never by its title. For `WI-31`, the number is 31.

```bash
ntn api v1/data_sources/<work-items-data-source-id>/query -d '{"filter":{"and":[{"property":"ID","unique_id":{"equals":31}},{"property":"Work item","title":{"is_not_empty":true}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
```

**The board.** Send this body to `v1/data_sources/<work-items-data-source-id>/query`. It lists the open work items, sorted by Priority and then by ID. Report the Status, State, Waiting on, and Next action of each. Add the work items that are Done or Cancelled only when asked. Then list the cards with no title, as [work-tracker-known-problems.md](work-tracker-known-problems.md) says, and report each one.

```json
{"filter": {"and": [
   {"property": "Archived", "checkbox": {"equals": false}},
   {"property": "Work item", "title": {"is_not_empty": true}},
   {"property": "Status", "status": {"does_not_equal": "Done"}},
   {"property": "Status", "status": {"does_not_equal": "Cancelled"}}]},
 "sorts": [{"property": "Priority", "direction": "ascending"}, {"property": "ID", "direction": "ascending"}],
 "page_size": 100}
```

**What waits on the owner.** Read the page text of each open work item, or of the work items that the owner named. Take the Questions and Answers rows whose Status is Open and whose "Decision needed from" is owner. Report first what waits on the owner, with the work item's ID, the Q-ID, and what the question blocks. Then report what is in progress, and then your next step.

**A work item's sub-items, phases, and open tasks.** Each line is the filter of one query: on Work Items, on Phases, and on Tasks. Sort the sub-items by "Phase order" and then by ID, and sort the phases and the tasks by Order. Repeat the first query for each sub-item to reach the third level.

```json
{"property": "Parent item", "relation": {"contains": "<page-id>"}}
{"property": "Work item", "relation": {"contains": "<page-id>"}}
{"and": [{"property": "Work item", "relation": {"contains": "<page-id>"}}, {"property": "Status", "status": {"does_not_equal": "Done"}}, {"property": "Status", "status": {"does_not_equal": "Cancelled"}}]}
```

**The project's phases and tasks.** A project phase and a project task have an empty "Work item". The filter on Phases and on Tasks is `{"property": "Work item", "relation": {"is_empty": true}}`. For the top-level items, the filter on Work Items is `{"property": "Parent item", "relation": {"is_empty": true}}`, and the "Phase column" property shows each item's project phase.

**Comments.** The first call adds a comment, and the second call reads a work item's comments, oldest first, including the owner's.

```bash
ntn api v1/comments -d '{"parent":{"page_id":"<page-id>"},"markdown":"Agent: a helper started on **P1-T02**."}' < /dev/null | jq -r .id
ntn api v1/comments block_id==<page-id> < /dev/null | jq -r '.results[] | "\(.created_time)\t\(.display_name.resolved_name // "")\t\(.rich_text | map(.plain_text) | join(""))"'
```

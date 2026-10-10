# Work items kept in Notion

Use this reference to read, create, change, and find work items in a project that keeps its work items in Notion. The goal is to read and write each work item consistently with the lifecycle rules.

This reference says where a work item is kept in Notion and how to save to it. The lifecycle rules decide what happens next: what to save and when, a work item's State, and each approval. A work item's State is the step the work is in, and its Status is the short summary of the State. `using-notion-cli` says how to run each Notion call.

## Contents

- Where the work items are kept
- The owner's Notion describes a work item
- Steps for every read and every save
- Create a work item
- Fill and change a work item's page
- The Solution Design page
- Phases, tasks, and sub-items
- Exact names and values
- Commands
- Related work
- Known problems

## Where the work items are kept

- Each project has one page in the owner's Notion. The page holds three databases: **Work Items**, **Phases**, and **Tasks**.
- The ids of the page and the databases are in `PROJECT.md`, section "Toolkit settings". They are the nested bullets under the line "Notion work items". Take every id from there, and never search the workspace for a database.
- A work item is a row of Work Items, and the row has its own page. Notion makes the page from the default template of the Work Items database, which this reference calls the work item template.
- A work item's design is its Solution Design page, which is a child page of the work item's page.
- Work items can be nested. A top-level item is a work item with no parent, at level 1. A sub-item is a work item inside another work item, at level 2 or level 3. The "Parent item" property of a sub-item names the work item above it. `references/lifecycle-rules.md`, section "Levels", says what each level holds.
- A phase is a row of Phases, never a work item. There are two kinds of phase:
  - A top-level item has phases of its own, with IDs such as `P1`. Each one is linked to its work item.
  - A project phase has an ID such as `P01`, and it is linked to no work item. The "Phase" property of a top-level item holds its project phase.
- A task is a row of Tasks. There are three kinds of task:
  - A top-level item's task is linked to its work item and to its phase.
  - A sub-item's task is linked to its work item only, because a sub-item has no phases.
  - A project task is linked to neither a work item nor a phase.
- The project page shows the project's phases, its top-level items by project phase, and its project tasks.
- `managing-work-items` calls the list of the open work items the board. In Notion, the owner sees that list in the views of Work Items. A card is one work item as such a view shows it.

## The owner's Notion describes a work item

The owner built the databases, their views, the work item template, and the Solution Design page inside that template in the Notion app. The owner changes them there. This skill does not describe them, so read them from Notion.

- To learn what a work item's page holds, read the page. A work item's page can have other sections than `assets/work-item-template.md`, and then the page is right.
- To learn the properties of a database and their options, read the database. "Commands" gives the call.
- Never build or rebuild a template, a database, a view, or a property through a Notion call. When one is missing, tell the owner. The owner makes it or restores it in the Notion app.
- Never rename or remove a property, a view, or a section of a template.
- Never add work to a template. The templates are the "Project" template in the owner's Projects database, and the work item template. Every copy that Notion makes from a template takes along what the template holds.

## Steps for every read and every save

1. Read the ids from `PROJECT.md`. Before your first Notion read or write in a session, open `using-notion-cli`, whatever tool you use. That skill says how to sign in, how to run a call, and what to do when a call fails.
2. In this turn, read again what you will look at or change. Never answer from an earlier read, because the owner edits in Notion, and the owner's edit is the one to keep.
3. Make the change as the sections below say.
4. Read the changed page or row back, and check that it says what you wrote. When a save failed, or reads back differently, report it as `references/lifecycle-rules.md`, section "Rules that apply in every State", says. That section gives the words your reply must start with.

Two rules apply to every read and every save:

- Never delete a page, a row, a phase, or a task. Take it out of view instead: set a phase or a task to Cancelled, or tick a work item's Archived box. When the owner wants it deleted, ask the owner to delete it in Notion.
- Leave out archived work items unless the owner asks for them.

## Create a work item

1. Count the levels by following "Parent item" up from the parent. When the parent is already at the third level, stop. The work becomes a task, as `managing-work-items` says.
2. Create the row with the default template and the properties that `managing-work-items` gave you. "Commands" gives the call. Notion builds the page from the work item template. Write none of the template's sections yourself.
3. Wait until the template's content is on the page. `using-notion-cli`, section "Waiting for a template", says how to check.
4. Put the work item's ID in the title of its Solution Design page, as "The Solution Design page" says.
5. Fill the page, as the next section says.
6. When the work item has a parent, add a Recent History row on the parent's page: "Sub-item WI-32 created: <title>."

## Fill and change a work item's page

The lifecycle decides what is saved. The page decides where it goes and what form it takes. So follow the page that you read.

- **Prompts.** Text in angle brackets is a prompt that says what to write in that place. The page text shows a prompt as `\<…\>`. `references/lifecycle-rules.md`, section "Text in angle brackets", says what to do with a prompt.
  - Fill a new work item with one change that leaves no prompt on the work item's page. Delete the note at the top of the page in the same change, because the note only says what a prompt is.
  - Then read the page text, and check that no line holds `\<`. Real content may hold it, for example code such as `Map\<Id, Account\>`.
  - A card that the owner made by hand holds the same note and the same prompts. The first time you change such a card, do the same, and keep everything that the owner wrote.
- **The owner's guide lines.** A line under a heading that says how the section is kept, such as the order of its rows, is the owner's guide for that section. Follow it, and keep it on the page.
- **Lines that are not text.** A `<database …>` line is a view, which shows the rows of a database. To change what a view shows, change the rows. A `<page …>` line is a child page. An `<unknown …>` line is a block that only the Notion app can change. Never change or remove one of these lines.
- **A line that the page does not have.** When a step of the lifecycle needs a line or a heading that the page does not have, add it where the lifecycle says, in the form of the lines around it. For example, `references/closing.md` fills a "Moved up" line in the Overview. Match a heading by its words, at the level the page uses.
- **Small, exact changes.** Change the text with exact replacements, built from a read that you just made. `using-notion-cli`, section "Reading and changing page text", gives the calls. Never replace the whole text of a page. A new row, a new requirement, or a new line takes the form of the ones already in its section.
- **The work item's Current state.** Rewrite its five lines in place, with one replacement of the whole block as you read it.
- **Lines that also have a property.** Next action and Summary each have a property with the same name, which a view of Work Items shows on the card. When you write one of these lines, write the same text in its property.
- **Questions.** A new question gets the highest Q-ID on the page plus one. Set the Waiting on property to who the open questions wait on.
- **Recent History.** Add a new row as the first row under the header row, so that the newest row is first.
- **Links to other work items.** Set the link in its property, and also write the linked work item's ID in the Overview's "Related items" line, so that the page text lists every link. Never link a work item to itself.
- **Pull requests.** Record a pull request under the heading "Linked Github PRs", as a plain link on its own line: `[<repository>#<number>: <title>](<pull request address>)`. Write `<repository>` as the GitHub account and the repository name, for example `acme/expenses`. When the page has no such heading, put the link under "Related items". The "Embed Github" block under that heading belongs to the owner, because only the Notion app can fill it.
- **Comments.** Start each comment with "Agent:". Every comment that the agent writes shows the owner's name, because the agent signs in as the owner.

## The Solution Design page

Each work item has one Solution Design page. The work item template holds the page, so Notion makes it with the work item. The page already has the design's sections and prompts.

- When you create a work item, put its ID in the page's title in place of the prompt, for example "Solution Design - WI-31". "Commands" gives the call. The `<page …>` line in the work item's page text holds the page's address, and the last 32 characters of the address are its id.
- When `references/designing.md` says to create the design, write the design on this page. Never make a second design page.
- Fill this page as you fill a work item's page: the lifecycle decides what is saved, and the page decides where it goes and what form it takes. The note at its top says when its prompts are removed.
- A work item has no Solution Design page when the project's work item template is older and has none. Then do these three things:
  1. Make the page as a child page of the work item's page, with the text of `assets/design-template.md` written as Notion markdown. Leave out the template's front matter and its `<!-- … -->` guide comments. "Commands" gives the call.
  2. Read the page back, and check its title and its text.
  3. Tell the owner that the project's work item template has no Solution Design page, so that the owner can add one in the Notion app.
- The design page may have its own subpages. They stay under it.
- When the owner approves the design, also set the Design approved property to `YYYY-MM-DD by <name>`.

## Phases, tasks, and sub-items

Phases and tasks are rows, so a change to the plan is a change to rows. The work item's page shows them in views, and nothing is copied into its text. `references/lifecycle-rules.md`, section "Levels", says which level has phases and what each ID looks like.

- **Order.** The Order property is a phase's place in the plan, or a task's place in its phase or its plain list. To reorder, change only Order.
- **IDs.** A Phase ID or a Task ID never changes, also when the phase or the task moves. A new Phase ID is one more than the highest that the work item, or the project, ever used, cancelled ones included. A new Task ID takes the next unused number in its phase or its plain list.
- **Which "Phase" a row gets.**
  - A top-level item's "Phase" is its project phase. Leave it out until the owner has named one. Write the project phase in the item's "Related items" line too: "Project phase P01."
  - A level-2 sub-item's "Phase" is one of its parent's phases: the one that `managing-work-items` gives, or the one that the owner names when you ask. First check that the phase's "Work item" is the parent.
  - A level-3 sub-item has no "Phase". A sub-item's task has none either.
- **Dropping or merging a phase.** First move or cancel its sub-items and its tasks. Then set its Status to Cancelled, and write what happened in its Exit result: "Merged into P1", or "Dropped: <reason>".
- **Cancelling a task.** Set its Status to Cancelled, and start its title with "Cancelled: ".
- **Moving a work item under another parent.** Count the levels first, as step 1 of "Create a work item" says, for the work item and for every level under it. Set "Parent item" to the new parent, or empty it to make the work item top-level. Then set "Phase" as the list above says, and never keep a phase of the old parent. Add Recent History rows on the work item, on the old parent, and on the new parent. When the owner changed "Parent item" by hand, add the same rows at your next change.
- **A work item that is now a sub-item.** A sub-item has no phases. Give its tasks the Orders 1, 2, 3, and so on, in plan order, and empty each task's "Phase". Empty "Phase" on each of its sub-items. Set each of its phases to Cancelled, with the Exit result "Removed: a sub-item has no phases. Its tasks are now one plain list." Add one Recent History row that names each phase removed.
- **A work item that is now top-level.** Add phase `P1`, named as the owner approves, and set it as "Phase" on each of the work item's tasks and sub-items. Set the work item's own "Phase" to the project phase that the owner names. Add a Recent History row.
- **After a change to the plan.** List the work item's phases, and check their order.

## Exact names and values

Notion holds the full list of properties, with their types and options. This table gives the names and the values that the lifecycle writes. The last column gives the type that a call names for the property, and its values.

| Field in the lifecycle | Property in Work Items | Type and values |
| --- | --- | --- |
| `title` | Work item | `title` |
| `id` | ID | Notion sets it. It shows the prefix and the number without padding: `WI-31`, not `WI-031`. |
| `state` | State | `select`: Backlog, Refining Requirements, Designing, Building, Testing Loop, Reflecting, Deploying, Blocked, Done, Cancelled |
| `status` | Status | `status`: Not Started, Preparing, In Progress, Blocked, Done, Cancelled |
| `waiting_on` | Waiting on | `select`: owner, agent, external, none. For `external`, the "Waiting on" line of the work item's Current state says who. |
| `type`, `priority`, `delivery`, `design` | Type, Priority, Delivery, Design | `select`, with the values that `assets/work-item-template.md` lists for the field |
| `requirements_approved`, the design approval, `result_approved` | Requirements approved, Design approved, Result approved | `rich_text`: `YYYY-MM-DD by <name>`, or `no` |
| `parent` | Parent item | `relation`, to one work item |
| The work item's phase | Phase | `relation`, to one row of Phases |
| The Next action line of the work item's Current state | Next action | `rich_text`, a copy of the line |
| The Summary line of the Overview | Summary | `rich_text`, a copy of the line |
| `updated` | none | The "Last updated" line of the work item's Current state holds it. |
| none | Archived | `checkbox`. It hides the work item from the views of Work Items. |
| none | Tags | `multi_select`. Reuse the exact spelling of an option that exists. A new name becomes a new option, and a name cannot hold a comma. |

- Set State and Status in one call. The State table of `managing-work-items` gives the Status for each State.
- The "Blocked by" relation fills "Blocking" on the other work item. The "Related" relation is one-way.
- The Files property holds files that the owner attached. The agent adds none.
- In Phases, Status is a `select`. In Work Items and in Tasks, Status is a `status`. In Phases and in Tasks, the options are Not Started, In Progress, Done, and Cancelled.
- In Tasks, "Who does it" is `agent` or `owner`. A project task may hold the name of another person who owes the task, with the party, such as `Sarah Chen (client)`. Write that name as the option, and Notion adds it.

## Commands

`using-notion-cli` gives the form of a call, a query, and a change to page text. The calls below are the ones that are particular to work items. Replace each `<…-data-source-id>` with the data source id in `PROJECT.md`.

Every query on Work Items needs `{"property":"Work item","title":{"is_not_empty":true}}` in its filter, so that the work item template is never reported. The one exception is the query for cards with no title, under "Known problems". A query that lists work items also needs `{"property":"Archived","checkbox":{"equals":false}}`, unless the owner asks for archived work items. Put these conditions inside `"and"` with the other conditions.

**The properties of a database, with each one's type and options:**

```bash
ntn api v1/data_sources/<data-source-id> < /dev/null | jq -r '.properties | to_entries[] | "\(.key)\t\(.value.type)\t\((.value.select // .value.status // .value.multi_select // {}).options // [] | map(.name) | join(", "))"'
```

**Create a work item.** Send this body with `ntn api v1/pages -d @new.json < /dev/null`. The answer holds the page `id`, its `url`, and the new ID (`.properties.ID.unique_id`: prefix and number).

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

The values shown are the defaults for a new work item. Use another value only when `managing-work-items` says so. Leave out "Parent item" for a top-level item, and set "Phase" as "Phases, tasks, and sub-items" says.

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

**Add a task.** For a sub-item's task, leave out "Phase". For a project task, leave out "Work item" and "Phase". "Depends on" takes the page ids of the tasks that the new task waits for.

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

**The board.** Send this body to `v1/data_sources/<work-items-data-source-id>/query`. It lists the open work items, sorted by Priority and then by ID. Report the Status, State, Waiting on, and Next action of each. Add the work items that are Done or Cancelled only when asked. Then list the cards with no title, as "Known problems" says, and report each one.

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

## Related work

| For | Use |
| --- | --- |
| Deciding what happens next: what to save and when, a State, or an approval | Follow `references/lifecycle-rules.md` in this skill. |
| Every Notion read or write: sign-in, Codex, the form of each call, and errors | `using-notion-cli` |
| A source that the work item was given. A source is anything the project was given by someone else, such as a transcript or a client document. | `filing-project-records`, step "file a source" |
| Moving the work items to another place where work items can be kept, such as local files or GitHub Issues | `project-setup` |

## Known problems

Each line names something that went wrong, and what to do.

- **The work item template showed up as a work item.** Notion lists the template as a row of Work Items, with an empty title. Put `{"property":"Work item","title":{"is_not_empty":true}}` in the filter of every Work Items query.
- **A card had no title.** A card that the owner made and gave no title is hidden from the Work Items views. To list such cards, query Work Items for an empty title with Archived false. Then drop the ids that `ntn api v1/data_sources/<work-items-data-source-id>/templates < /dev/null | jq -r '.templates[].id'` prints, because the work item template is one of them. Report each card that remains, in the form "A card with no title, IML-6: <link>", and ask the owner to name it or archive it.
- **A card that the owner made by hand had an empty State.** A card made with "New" gets the template's sections, and its properties are empty. Give it State Backlog, Status Not Started, and the other defaults in the call that creates a work item, under "Commands". Add the Recent History row "Made in Notion by hand."
- **A work item's page had no sections.** The owner made it with "Empty" in the New menu, or it was made before the project had a default template. Tell the owner, and offer to add the sections. To add them, give the page the default template once, with the call under "Commands", and wait for the content. `using-notion-cli`, section "Waiting for a template", says how to wait. The page's properties are kept. Its Recent History row is "Made in Notion by hand; the template was filled in."
- **Notion refused to create a work item because the Work Items database has no default template.** Tell the owner. Only the Notion app can set the default template.
- **A work item could not be found by its number.** The work item may be in the trash or outside this project. Tell the owner, and never make a second work item with the same title.
- **A change that deleted lines also removed a line next to them.** To delete lines, send them in `old_str` together with one neighbouring line that stays, and send only that neighbouring line as `new_str`. After the call, read the page again and compare it with the text that you read before. Write a lost heading or paragraph again from the earlier text. When a `<database …>`, `<page …>`, or `<unknown …>` line is lost, stop and tell the owner which line, because such a line cannot be put back as text.
- **A read or a write of the page text answered `truncated: true`.** The "Embed Github" block causes this answer, and the answer names the block's id in `unknown_block_ids`. When `unknown_block_ids` holds only that block's id, the answer needs no action.
- **A work item's State and Status did not match.** When the owner drags a card to another column in a view, only the Status changes. `references/lifecycle-rules.md`, section "Read the work item before you act", says what to ask the owner.
- **A search found nothing for words that are in a page's text.** `v1/search` matches page titles only. First narrow the work items by title, tag, type, parent, or status. Then read the page text of each candidate.
- **A call to Phases failed on Status.** In Phases, Status is a `select`, and the call sent a `status`. Send Status as a `select`.
- **A task had an empty Status.** The task was made by hand. Set its Status to Not Started.
- **A phase or a task had an empty "Work item" and an ID that is not a project ID.** The row was made by hand. Ask the owner whether the row belongs to the project or to a work item.
- **A work item was at a fourth level.** Tell the owner which work item is at level 4.

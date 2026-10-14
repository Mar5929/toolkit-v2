# Creating and updating Notion work records

Use this reference to create or update a work item, its Solution Design page, phases, tasks, or sub-items. First read `work-tracker.md` for fresh reads, owner templates, and verification. The lifecycle determines what changes; the live Notion page determines its form. [work-tracker-commands.md](work-tracker-commands.md) supplies the API calls.

## Create a work item

1. Count the levels by following "Parent item" up from the parent. When the parent is already at the third level, stop. The work becomes a task, as `managing-work-items` says.
2. Create the row using its database's default template and fill the applicable properties from the live schema and `managing-work-items`. [work-tracker-commands.md](work-tracker-commands.md) gives the call. Notion builds the page from the work item template as part of creation; do not apply it again or reconstruct its sections.
3. Wait until the template's content is on the page. `using-notion-cli/references/ntn-commands.md`, section "Waiting for a template", says how to check.
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
- **Small, exact changes.** Change the text with exact replacements, built from a read that you just made. `using-notion-cli/references/ntn-commands.md`, section "Reading and changing page text", gives the calls. Never replace the whole text of a page. A new row, a new requirement, or a new line takes the form of the ones already in its section.
- **The work item's Current state.** Rewrite its five lines in place, with one replacement of the whole block as you read it.
- **Lines that also have a property.** Next action and Summary each have a property with the same name, which a view of Work Items shows on the card. When you write one of these lines, write the same text in its property.
- **Questions.** A new question gets the highest Q-ID on the page plus one. Set the Waiting on property to who the open questions wait on.
- **Recent History.** Add a new row as the first row under the header row, so that the newest row is first.
- **Links to other work items.** Set the link in its property, and also write the linked work item's ID in the Overview's "Related items" line, so that the page text lists every link. Never link a work item to itself.
- **Pull requests.** Record a pull request under the heading "Linked Github PRs", as a plain link on its own line: `[<repository>#<number>: <title>](<pull request address>)`. Write `<repository>` as the GitHub account and the repository name, for example `acme/expenses`. When the page has no such heading, put the link under "Related items". The "Embed Github" block under that heading belongs to the owner, because only the Notion app can fill it.
- **Comments.** Start each comment with "Agent:". Every comment that the agent writes shows the owner's name, because the agent signs in as the owner.

## The Solution Design page

Each work item has one Solution Design page. The work item template holds the page, so Notion makes it with the work item. The page already has the design's sections and prompts.

- When you create a work item, put its ID in the page's title in place of the prompt, for example "Solution Design - WI-31". [work-tracker-commands.md](work-tracker-commands.md) gives the call. The `<page …>` line in the work item's page text holds the page's address, and the last 32 characters of the address are its id.
- When `references/designing.md` says to create the design, write the design on this page. Never make a second design page.
- Fill this page as you fill a work item's page: the lifecycle decides what is saved, and the page decides where it goes and what form it takes. The note at its top says when its prompts are removed.
- A work item has no Solution Design page when the project's work item template is older and has none. Then do these three things:
  1. Make the page as a child page of the work item's page, with the text of `assets/design-template.md` written as Notion markdown. Leave out the template's front matter and its `<!-- … -->` guide comments. [work-tracker-commands.md](work-tracker-commands.md) gives the call.
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
  - A level-2 sub-item's "Phase" is one of its parent's phases when the parent uses phases. First check that the phase's "Work item" is the parent. When the parent has a plain plan, leave the sub-item's "Phase" empty.
  - A level-3 sub-item has no "Phase". A sub-item's task has none either.
- **Dropping or merging a phase.** First move or cancel its sub-items and its tasks. Then set its Status to Cancelled, and write what happened in its Exit result: "Merged into P1", or "Dropped: <reason>".
- **Cancelling a task.** Set its Status to Cancelled, and start its title with "Cancelled: ".
- **Moving a work item under another parent.** Count the levels first, as step 1 of "Create a work item" says, for the work item and for every level under it. Set "Parent item" to the new parent, or empty it to make the work item top-level. Then set "Phase" as the list above says, and never keep a phase of the old parent. Add Recent History rows on the work item, on the old parent, and on the new parent. When the owner changed "Parent item" by hand, add the same rows at your next change.
- **Changing between phases and a plain task list.** When adding phases, assign tasks and sub-items to the applicable phases and set their Order within each phase. When removing phase grouping, flatten tasks in the existing plan order into one ordered list and clear the tasks’ and sub-items’ "Phase" relations. Retain stable IDs and phase records; mark removed phases Cancelled and add the conversion reason to their Exit result without discarding existing outcomes. Record the change in Recent History. The top-level work item’s own "Phase" still refers to its project phase.
- **A work item that is now a sub-item.** Convert its plan to a plain task list using the grouping procedure above, because sub-items have no phases.
- **A work item that is now top-level.** Use phases when they help organize its plan; otherwise retain a plain list. Apply the grouping procedure when changing the plan, and set the work item’s own "Phase" to the project phase that the owner names. Add a Recent History row.
- **After a change to the plan.** List its phases and tasks, and check their order and relations against the resulting plan.

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

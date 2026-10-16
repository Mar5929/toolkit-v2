# Work items in Notion

Work items live in this project's own Notion databases: Work Items, Phases, and Tasks. Their page and data source IDs are in `PROJECT.md`, under "Notion work items". Use this project's copies, never workspace-wide or template databases. Use `using-notion-cli` for how to run any call; the calls specific to work items are in `work-tracker-calls.md`.

## What lives where

| Thing | Where |
| --- | --- |
| Work item | A Work Items row created with the default template. Notion adds its page and Solution Design child page. |
| Sub-item | A Work Items row linked through Parent item. |
| Project phase | A Phases row with an empty Work item. Top-level items link to it through Phase. |
| Item phase | A Phases row linked to its work item. |
| Task | A Tasks row linked to its work item, and to its phase if it has one. |
| Project task | A Tasks row with Work item and Phase both empty. |
| Design | The item's Solution Design child page, titled "Solution Design - WI-31". |

Notion IDs are unpadded: `WI-31`, not `WI-031`. Creating a row through a view doesn't set its ownership, so set relations explicitly and check them.

## The owner owns the structure

The owner built the databases, views, and templates in the Notion app. Read them from Notion: the live page and schema win over `assets/work-item-template.md`.

- Never create, rebuild, rename, or remove a database, view, property, template, or template section. If one is missing, tell the owner.
- Never add work to a template.
- Never delete a page or row. Cancel a phase or task instead (a cancelled task's title starts "Cancelled: "), or tick a work item's Archived box. Skip archived items unless the owner asks.

## Reading and writing

- Change page text with small, exact replacements from a fresh read; never replace a whole page. New rows and lines follow the form of their neighbors.
- Fill a new item's prompts in one change and delete the note at the top, then check no `\<` remains (real content like `Map\<Id, Account\>` is fine). A card the owner made by hand gets the same treatment the first time you touch it, keeping what they wrote.
- Keep the owner's guide lines under headings. Never touch `<unknown>` lines.
- If the lifecycle needs a line the page lacks, such as Kept for the project, add it in the form of the lines around it.
- Rewrite the Current state's five lines in one replacement. Next action and Summary also have properties of the same name; write both.
- A new question gets the highest Q-ID on the page plus one. Keep the Waiting on property in step with the open questions.
- Add Recent History rows first, under the header row.
- Link another item by setting the relation and writing its ID in Related items. Never link an item to itself.
- Record pull requests under "Linked Github PRs" as `[owner/repo#14: title](url)`, or under Related items if that heading is missing. The Embed Github block is the owner's.
- Start comments with "Agent:". They show the owner's name, because the agent signs in as the owner.
- Fill every applicable property from the live schema.

## Properties the lifecycle writes

| Lifecycle field | Property | Type and values |
| --- | --- | --- |
| `id` | ID | Set by Notion. |
| `waiting_on` | Waiting on | select: owner, agent, external, none |
| The three approvals | Requirements approved, Design approved, Result approved | rich_text: `YYYY-MM-DD by <name>`, or `no` |
| Next action line | Next action | rich_text, a copy of the line |
| Summary line | Summary | rich_text, a copy of the line |
| (none) | Archived | checkbox; hides the item from views |
| (none) | Tags | multi_select; reuse existing spellings, no commas |

- Set State and Status in one call.
- Status is a `select` in Phases but a `status` in Work Items and Tasks. Phases and Tasks use Not Started, In Progress, Done, and Cancelled.
- "Who does it" is `agent`, `owner`, or another person with their party ("Sarah Chen (client)").
- "Blocked by" fills "Blocking" on the other item; "Related" is one-way. Files belong to the owner.

## Plans

- Phases and tasks are rows. Reorder by changing Order only. IDs never change. A new Phase ID is one more than the highest ever used, cancelled ones included; a new Task ID is the next unused in its phase or list.
- A top-level item's Phase is its project phase, once the owner names it; also write it in Related items. A level-2 sub-item's Phase is one of its parent's phases (check that phase belongs to the parent), or empty if the parent has none. Level-3 sub-items and sub-item tasks have no Phase.
- To move an item: check the depth below it, set Parent item, reset Phase for the new parent, and add Recent History on the item and both parents.
- Switching between phases and a plain list keeps order and IDs. Removed phases become Cancelled, with the reason in Exit result.
- After any plan change, list the phases and tasks and check their order and relations.

## Designs

Write the design on the Solution Design page, and never make a second. If the Solution Design page is missing, tell the owner. When the design is approved, also set Design approved.

## Other notes

- A helper opens an item by ID: query its ID number (`work-tracker-calls.md`), then read its page and Solution Design page. If it can't reach Notion, give it freshly read text.

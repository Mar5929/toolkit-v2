# Notion before the rebuild: "AI Agent Second Brain" (after the restore)

Recorded on 2026-09-27 at 10:19 EDT (14:19 UTC). This is the state after the
restore and before any rebuild step. Every value below came from read-only
`ntn api` calls (ntn 0.23.10, bot "Notion CLI" in the "Personal" workspace).
The raw responses are in the session scratch folder `notion-restored/`.

## What the restore changed

On 2026-09-26 at 22:41 UTC Mike's own Notion account archived the root page.
The page, the "Project workspace" template page, and the "Claude Toolkit" row
then read back with `is_archived: true`. Mike chose "restore and rebuild it".
The lead agent sent `PATCH /v1/pages/3e7b381d-a176-803f-a48f-e838ee648e67`
with `is_archived: false` on 2026-09-27 at 14:17 UTC.

After the restore:

| Page | `is_archived` | `in_trash` | Last edited | Last edited by |
| --- | --- | --- | --- | --- |
| Root page "AI Agent Second Brain" | false | false | 2026-09-27T14:17Z | the "Notion CLI" bot (`3e7b381d-a176-812c-b0b2-00274d3be8cc`), the restore |
| "Project workspace" template page | false | false | 2026-09-26T14:57Z | Michael Rihm (`c6a55ad3-a5d5-48b2-a633-9847fe5b58be`) |
| "Claude Toolkit" row | false | false | 2026-09-26T15:01Z | Michael Rihm |

Restoring the root page also cleared the flag on the two pages under it; their
edit times did not change. Nothing else changed: the three page bodies, the
Projects schema, both Projects views, and both old knowledge base databases
are exactly as recorded before the archive (compared byte for byte with the
raw responses from 2026-09-27 00:40 UTC).

## Root page

| Field | Value |
| --- | --- |
| Title | AI Agent Second Brain |
| Id | `3e7b381d-a176-803f-a48f-e838ee648e67` |
| Link | https://app.notion.com/p/AI-Agent-Second-Brain-3e7b381da176803fa48fe838ee648e67 |
| Icon | 🧠 |
| Parent | the workspace (a private page) |
| Created | 2026-09-26T14:48Z by Michael Rihm |

Top-level blocks, in order (no child pages):

| # | Block id | Type |
| --- | --- | --- |
| 1 | `2d19bbb3-0a2a-4294-a4f2-5b7381920f34` | callout |
| 2 | `e4db62e9-5fba-4a64-b42c-413e85a129ee` | heading_2 |
| 3 | `7bafe630-7c7e-43e9-b0b8-9ca126e6e634` | numbered_list_item |
| 4 | `62c780d4-82df-4e37-a15e-efd386578315` | numbered_list_item |
| 5 | `d9a28554-26aa-4fbb-a2ee-c1886918c0f4` | numbered_list_item |
| 6 | `3de07aad-d582-46c3-9c1d-6bc8068042f6` | numbered_list_item |
| 7 | `a54e5220-0c21-4be4-8037-e17f4f46fc67` | column_list (two columns, one callout each) |
| 8 | `b015cb43-8816-44fb-831b-d7a6b02cf759` | divider |
| 9 | `3901f052-2c56-4603-ad56-7f5924655925` | child_database "Projects" |

Body as Notion returns it (`GET /v1/pages/{id}/markdown`, not truncated):

````text
<callout icon="🤖" color="blue_bg">
	A project-centered knowledge system for an AI agent. Start with a project, then capture the facts, decisions, research, prompts, and lessons the agent should reuse.
</callout>
## How to use this template
1. Create a project from the default **Project workspace** template.
2. Each new project receives its own independent knowledge base inside the project page.
3. Create one knowledge page per meaningful topic or concept—for example, **Team members** or **Account data model**.
4. Keep each topic page current as understanding evolves; use sections within the page for related facts, decisions, examples, and sources.
<columns>
	<column ratio="50">
		<callout icon="🎯" color="purple_bg">
			**Projects**
			The top-level map of active outcomes. Every project created from the template includes its own workspace and knowledge base.
		</callout>
	</column>
	<column ratio="50">
		<callout icon="📚" color="green_bg">
			**Knowledge Base**
			A separate, self-contained topic library duplicated inside each new project. Each record is one durable concept, not one granular fact.
		</callout>
	</column>
</columns>
---
<database url="https://app.notion.com/p/3901f0522c564603ad567f5924655925" inline="true" icon="🎯" data-source-url="collection://212cab42-22e0-4682-9fe1-a697a028331a">Projects</database>
````

## Projects database

| Field | Value |
| --- | --- |
| Database id | `3901f052-2c56-4603-ad56-7f5924655925` |
| Data source id | `212cab42-22e0-4682-9fe1-a697a028331a` |
| Link | https://app.notion.com/p/3901f0522c564603ad567f5924655925 |
| Inline | yes, on the root page |

Schema (8 properties; none of the toolkit's registry properties yet):

| Property | Id | Type | Options |
| --- | --- | --- | --- |
| `Created` | `%5CNfC` | created_time |  |
| `Desired Outcome` | `M%60u%3B` | rich_text | description "The measurable result this project should produce." |
| `Last Updated` | `ZnB%5C` | last_edited_time |  |
| `Owner` | `S%5EUv` | people |  |
| `Priority` | `Xx%7DR` | select | Critical, High, Medium, Low |
| `Project` | `title` | title |  |
| `Status` | `%5BHDY` | status | Backlog, Planned (To-do); Active, Blocked (In progress); Complete, Archived (Complete) |
| `Target Date` | `pZlP` | date |  |

Views:

| View | Id | Type | Settings |
| --- | --- | --- | --- |
| Active Projects | `971341ae-c9e8-48b1-9859-06b6d7a9248a` | board | grouped by Status; cards show Project, Desired Outcome, Priority, Owner, Target Date; no filter, no sort |
| All Projects | `8c1f6b71-1374-449a-8adf-1dc841ad3296` | table | columns Project, Status, Priority, Owner, Target Date, Last Updated, Created, Desired Outcome, and a leftover property id `eizm` with no name; sorted by Priority, then Last Updated (newest first) |

Templates: one, "Project workspace" (`a239742c-4f8c-4e35-b105-51d153ed0cf7`),
the default.

Rows: one.

| Project | Page id | Status | Priority | Owner |
| --- | --- | --- | --- | --- |
| Claude Toolkit | `3e7b381d-a176-80b0-9916-f83abe0926d7` | Backlog | Medium | Michael Rihm |

## "Project workspace" template page

| Field | Value |
| --- | --- |
| Id | `a239742c-4f8c-4e35-b105-51d153ed0cf7` |
| Link | https://app.notion.com/p/Project-workspace-a239742c4f8c4e35b10551d153ed0cf7 |
| Icon | 🧩 |
| Parent | the Projects data source (a database template) |

21 blocks: callout, the "Project brief", "Agent context", and "Key decisions
and open questions" sections, a divider, the "Project knowledge base" heading
and paragraph, then the inline database "Project Knowledge Base".

````text
<callout icon="🧭" color="blue_bg">
	Use this page as the complete workspace for one project. Its knowledge base is independent and travels with the project template.
</callout>
## Project brief
### Outcome
State the concrete result this project should achieve.
### Success criteria
- [ ] Define a measurable completion condition
- [ ] Identify the primary user or stakeholder
- [ ] Record the key constraint
## Agent context
### Operating instructions
Document how the AI agent should behave on this project, including tone, boundaries, preferred sources, and approval requirements.
### Current state
Summarize what is true now, what has already happened, and what remains unresolved.
### Next actions
- [ ] Add the next concrete action
## Key decisions and open questions
Keep a short working list here. Move durable context into the relevant topic page in the project knowledge base.
---
## Project knowledge base
Create one page per meaningful topic or concept, such as **Team members**, **Account data model**, or **Release process**. Group related facts, decisions, examples, and sources within that page rather than creating a page for every individual memory.
<database url="https://app.notion.com/p/a4c3176c93c9437497323be802b83d2b" inline="true" icon="📚" data-source-url="collection://0e038b12-2a52-4114-a580-2d49781a32c8">Project Knowledge Base</database>
````

## "Claude Toolkit" row

| Field | Value |
| --- | --- |
| Page id | `3e7b381d-a176-80b0-9916-f83abe0926d7` |
| Link | https://app.notion.com/p/Claude-Toolkit-3e7b381da17680b09916f83abe0926d7 |
| Properties | Status Backlog, Priority Medium, Owner Michael Rihm, Target Date and Desired Outcome empty |

Its body is the template text above, with its own "Project Knowledge Base"
database (`295b381d-a176-8364-98c9-01fbfe7525b3`) and one empty paragraph at
the end.

## The two old "Project Knowledge Base" databases

Both are empty. Both have the same 10 properties: Topic (title), Category,
Confidence, Created, Last Updated, Orientation, Primary Source, Review Date,
Status, Tags.

| Where | Database id | Data source id | Rows | Views | Template |
| --- | --- | --- | --- | --- | --- |
| On the template page | `a4c3176c-93c9-4374-9732-3be802b83d2b` | `0e038b12-2a52-4114-a580-2d49781a32c8` | 0 | All Topics (table), Needs Review (list), Active Topics (gallery) | "Topic page" `7ab3449c-c33b-4514-a46c-c8e7a0c8caee` |
| On the Claude Toolkit row | `295b381d-a176-8364-98c9-01fbfe7525b3` | `d41b381d-a176-8370-9fae-076b3899345c` | 0 | All Topics (table), Needs Review (list), Active Topics (gallery) | "Topic page" `1b6b381d-a176-82fb-830e-815f396aae43` |

Links: https://app.notion.com/p/a4c3176c93c9437497323be802b83d2b and
https://app.notion.com/p/295b381da176836498c901fbfe7525b3.

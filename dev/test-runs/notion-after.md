# Notion after the rebuild: "AI Agent Second Brain"

Run on 2026-09-27 from 10:19 to 10:27 EDT (14:19 to 14:27 UTC), after Mike's
page was restored. The state before the run is in `notion-before.md`.
Nothing was deleted or moved to the trash. The old material was moved to a
child page, "Old structure (safe to delete)".

Tools: `ntn` 0.23.10 (bot "Notion CLI"), the `toolkit` command from this
repository, `TOOLKIT_V2_CONFIG_DIR`, `CLAUDE_CONFIG_DIR`, and `CODEX_HOME`
pointed at scratch folders. Raw responses are in the session scratch folders
`notion-restored/`, `notion-rebuild/`, and `notion-after/`; command output is
in `runs/notion-showcase-*.txt`.

## Links

| What | Link |
| --- | --- |
| Root page "AI Agent Second Brain" | https://app.notion.com/p/AI-Agent-Second-Brain-3e7b381da176803fa48fe838ee648e67 |
| Projects database | https://app.notion.com/p/3901f0522c564603ad567f5924655925 |
| "Project workspace" template page | https://app.notion.com/p/Project-workspace-a239742c4f8c4e35b10551d153ed0cf7 |
| "Claude Toolkit" row (left in place) | https://app.notion.com/p/Claude-Toolkit-3e7b381da17680b09916f83abe0926d7 |
| Sample project page "Toolkit V2 sample (safe to delete)" | https://app.notion.com/p/Toolkit-V2-sample-safe-to-delete-3e8b381da1768187ba43fc29765ac2b2 |
| Its Work Items database | https://app.notion.com/p/dcfb7e22186c4cbf8bb47914599c27ab |
| Work Items, Board view | https://app.notion.com/p/dcfb7e22186c4cbf8bb47914599c27ab?v=3e8b381da17681628834000cb0e6ee6e |
| Work Items, All items view (table with sub-items) | https://app.notion.com/p/dcfb7e22186c4cbf8bb47914599c27ab?v=d115eaf3b03b40e8a47f4f40f599e87b |
| Its Memory database | https://app.notion.com/p/bc72ab3e63f94cef8dc815397957e811 |
| Memory, Index view | https://app.notion.com/p/bc72ab3e63f94cef8dc815397957e811?v=f9c7a849ad094edbbe5a2c277b8661f3 |
| Memory, Retired view | https://app.notion.com/p/bc72ab3e63f94cef8dc815397957e811?v=3e8b381da176819f9770000c821873b0 |
| Current focus page | https://app.notion.com/p/Current-focus-3e8b381da1768107b08fcc6ae98858a9 |
| Terminology glossary page | https://app.notion.com/p/Terminology-glossary-3e8b381da17681028f17c0114a00b3fc |
| Work item TVS-001 | https://app.notion.com/p/Add-a-sign-up-form-to-the-sample-app-3e8b381da17681ec9131c31b060353bc |
| Sub-item TVS-002 | https://app.notion.com/p/Check-the-email-address-before-saving-it-3e8b381da176819b8a8dc9061a68afc5 |
| TVS-001 solution design page | https://app.notion.com/p/TVS-001-Add-a-sign-up-form-to-the-sample-app-solution-design-3e8b381da17681b9b28bd9edebe29797 |
| Memory record `project_signup_storage` | https://app.notion.com/p/project_signup_storage-3e8b381da17681238b21f64c89b10c5e |
| "Old structure (safe to delete)" page | https://app.notion.com/p/Old-structure-safe-to-delete-3e8b381da17681d0babfc3eb5448e111 |
| Old "Project Knowledge Base" from the template (0 rows) | https://app.notion.com/p/a4c3176c93c9437497323be802b83d2b |
| Old "Project Knowledge Base" from Claude Toolkit (0 rows) | https://app.notion.com/p/295b381da176836498c901fbfe7525b3 |

## The new structure

Read back with `ntn api` at 14:25 UTC.

```text
AI Agent Second Brain (root page, private)
├── intro callout, "How to use this page" (5 steps), two callouts, one line about the old page
├── Projects (inline database, same block 3901f052-2c56-4603-ad56-7f5924655925)
│   ├── Project workspace (database template, rewritten)
│   ├── Claude Toolkit (row, left in place)
│   └── Toolkit V2 sample (safe to delete) (row, Key toolkit-v2-sample)
│       ├── Work Items (inline database, IDs TVS-1, TVS-2 ...)
│       │   ├── TVS-1 Add a sign-up form to the sample app
│       │   │   └── TVS-001: Add a sign-up form to the sample app — solution design (child page)
│       │   └── TVS-2 Check the email address before saving it (Parent item: TVS-1)
│       ├── Memory (inline database)
│       │   └── project_signup_storage
│       ├── Current focus (page)
│       └── Terminology glossary (page)
└── Old structure (safe to delete) (page)
    ├── copy of the old root page text
    ├── copy of the old "Project workspace" template text
    ├── Project Knowledge Base (moved from the template, 0 rows)
    └── Project Knowledge Base (moved from the Claude Toolkit row, 0 rows)
```

The Projects database has two rows: "Claude Toolkit" and the sample. No
"Toolkit V2 sample run c" rows are in it; run (c) writes to the private test
area's own Projects database (its `notion.json` names root page
`3e7b381d-a176-81ad-ad1c-eb0f8ab22d09`).

## Step by step

### 1. Before record

`notion-before.md` was overwritten with the state after the restore. The page
bodies, the Projects schema and views, and both old knowledge base databases
were byte for byte the same as before the archive; only the archive flags had
changed.

### 2. ensure-root on the real root page

```text
$ toolkit notion ensure-root --root-page 3e7b381d-a176-803f-a48f-e838ee648e67 \
    --projects-database 3901f052-2c56-4603-ad56-7f5924655925 --check
The Projects database under the root page is in place: https://app.notion.com/p/3901f0522c564603ad567f5924655925
Problems:
  - The property "Key" is missing.
  ... (the 9 registry properties)
exit 1

$ toolkit notion ensure-root --root-page 3e7b381d-a176-803f-a48f-e838ee648e67 \
    --projects-database 3901f052-2c56-4603-ad56-7f5924655925
The Projects database under the root page is in place: https://app.notion.com/p/3901f0522c564603ad567f5924655925
Added:
  - Key
  - Repository
  - Local path
  - Tracker
  - Memory system
  - Salesforce
  - Work items data source
  - Memory data source
  - Set up on
Saved the root page and Projects ids for this computer in <scratch>/runs/notion-showcase-config/notion.json.
exit 0
```

The Projects database now has 17 properties: the 8 it had, plus Key, Local
path, Repository, Tracker (notion, local, github, jira), Memory system
(notion, builtin, hindsight), Salesforce, Work items data source, Memory data
source, and Set up on. No property, option, or view was removed or renamed.

### 3. "Old structure (safe to delete)"

- Created the page under the root with `POST /v1/pages` (id
  `3e8b381d-a176-81d0-babf-c3eb5448e111`). It holds a short note, a copy of
  the old root page text, and a copy of the old template text. Text blocks
  cannot be moved through the API, so they were copied; the headings of the
  copies were moved down one level so they sit under "Old root page text" and
  "Old "Project workspace" template text".
- Moved both old "Project Knowledge Base" databases into it with
  `PATCH /v1/databases/{id}` and `parent: { type: page_id, page_id: <Old
  structure page> }`. Both calls succeeded through the API, so the Notion MCP
  move tool was not needed. Read back: both databases have the new parent,
  `in_trash: false`, their 3 views each, and 0 rows. The template page and the
  Claude Toolkit row no longer have a child database.
- Added one line above the two databases: the first came from the template,
  the second from the Claude Toolkit row. Both keep their name "Project
  Knowledge Base".

### 4. "Project workspace" template

The template page had no child page or database after step 3, so its body was
replaced with `replace_content`. What Notion returns now:

````text
<callout icon="🧭" color="blue_bg">
	The toolkit builds this project's Work Items and Memory databases on this page. To set it up, open the project's folder in Claude Code or Codex and say "set up this project". That runs the project-setup skill.
</callout>
## Before you run setup
1. Fill in **Key** with the project's short name in lower case with dashes, for example `sample-app`. Give the same key when setup asks for it.
2. The toolkit finds this row by its Key. A row with no Key is not found, and setup adds a second row for the same project.
3. You do not have to make the row first. If you start in the project folder, setup adds the row itself.
## Project brief
### Outcome
One sentence: the result this project should produce.
### Success criteria
- [ ] One measurable sign that the project is done
## Agent context
The agent's instructions for this project are in the project's `AGENTS.md` file. What is happening now is in the project's current focus: the Current focus page below, when memory is in Notion. Do not copy them here, so each fact has one home.
---
## Work items and memory
Setup adds these below this line. When work items are tracked in Notion: the Work Items database, with a Board view by stage and an All items table with sub-items. When memory is in Notion: the Memory database and the Current focus and Terminology glossary pages.
````

The Key steps are there because `ensure-project` finds an existing row only by
the id stored in `.toolkit.json` or by its Key. A row made with the New button
has neither. The short Project brief stays, because the outcome and success
criteria are useful to read in Notion. The old "Agent context" sections
(operating instructions, current state, next actions) became one line that
points to `AGENTS.md` and the Current focus page, because keeping them in
Notion too would give each fact two homes.

### 5. Root page text

Blocks 1 to 8 were replaced with one `update_content` edit built from a fresh
read. The Projects database block (`3901f052-2c56-4603-ad56-7f5924655925`)
and the new child page were not part of the edit and are unchanged. What
Notion returns now:

````text
<callout icon="🤖" color="blue_bg">
	This page holds every project that an AI agent runs for Mike. Each project is one row in the Projects database below. The toolkit builds what is inside each project's page and keeps it up to date. It reads and writes Notion through the Notion command-line tool, `ntn`.
</callout>
## How to use this page
1. **Add a project.** Open the project's folder in Claude Code or Codex and say "set up this project". The project-setup skill adds the project's row to the Projects database and builds what the project uses inside the row's page. It also fills in the row's Key, Tracker, Memory system, Local path, and the ids of the project's databases.
2. **Work items.** Each project page has its own Work Items database. The Board view is grouped by Stage and has one column for each of the 14 stages, from 01-discovery to 14-spec-update. The All items view is a table that shows each sub-item under its parent item. Each item's page body uses the `WORK-ITEM.md` format. An item's solution design is a child page under the item, in the `DESIGN.md` format. Its title ends with "solution design", for example "TVS-001: Add a sign-up form to the sample app — solution design".
3. **Memory.** Each project page has its own Memory database, plus a Current focus page and a Terminology glossary page.
4. **Nothing is shared across projects.** Every project has its own Work Items and Memory databases. No database holds the items or memory of two projects.
5. **Edits by hand.** You can edit, drag, and add items in Notion. The agent reads your changes the next time it syncs.
<columns>
	<column ratio="50">
		<callout icon="🎯" color="purple_bg">
			**Projects**
			One row per project. A row's page holds that project's Work Items database, Memory database, Current focus page, and Terminology glossary page.
		</callout>
	</column>
	<column ratio="50">
		<callout icon="🗂️" color="green_bg">
			**Inside a project page**
			Work Items: a Board view by stage and an All items table with sub-items. Memory: one record per fact, decision, or lesson, with an Index view and a Retired view.
		</callout>
	</column>
</columns>
The page "Old structure (safe to delete)" at the bottom holds a copy of this page's old text, the old "Project workspace" template text, and the two old, empty "Project Knowledge Base" databases.
---
<database url="https://app.notion.com/p/3901f0522c564603ad567f5924655925" inline="true" icon="🎯" data-source-url="collection://212cab42-22e0-4682-9fe1-a697a028331a">Projects</database>
<page url="https://app.notion.com/p/3e8b381da17681d0babfc3eb5448e111">Old structure (safe to delete)</page>
````

### 6. "Claude Toolkit" row: left in place

The row, its properties (Status Backlog, Priority Medium, Owner Michael Rihm),
and its body text are unchanged. Only its empty "Project Knowledge Base"
database moved to the Old structure page. Its body still has the old template
text, including the "Project knowledge base" heading, which now has no
database under it. Its Key is empty, so the toolkit does not treat it as a
Toolkit V2 project until Mike fills in Key and runs setup in that project.

### 7. Sample project "Toolkit V2 sample (safe to delete)"

Scratch folder `<scratch>/runs/notion-showcase`: `git init`, one empty commit
("Start the sample project"), then:

```text
$ toolkit init --name "Toolkit V2 sample (safe to delete)" --key toolkit-v2-sample \
    --owner "Mike Rihm" --tracker notion --memory notion
Toolkit V2 sample (safe to delete) (toolkit-v2-sample), owner Mike Rihm. Work items: the Notion Work Items database (ids like TVS-001). Memory: the Notion Memory database. Salesforce: no. Hosts: Claude Code and Codex.
Added 26 files: ...
Notion lets only one database in a workspace use an ID prefix, and WI is already used, so this project's work items are TVS-1, TVS-2 in Notion (TVS-001 in the toolkit). tracker.idPrefix in .toolkit.json is now TVS.
Notion project page: https://app.notion.com/p/Toolkit-V2-sample-safe-to-delete-3e8b381da1768187ba43fc29765ac2b2
Wrote .toolkit.json last.
(17 seconds)

$ toolkit work new --title "Add a sign-up form to the sample app" --type build --priority medium \
    --request "Visitors can sign up with their email address, and the sample app keeps the list of sign-ups."
Created TVS-001: Add a sign-up form to the sample app (01 Discovery, Backlog) at https://app.notion.com/p/Add-a-sign-up-form-to-the-sample-app-3e8b381da17681ec9131c31b060353bc.

$ toolkit work new --title "Check the email address before saving it" --type task --priority medium \
    --parent TVS-001 --request "The form refuses an email address without an @ sign and says why."
Created TVS-002: Check the email address before saving it (01 Discovery, Backlog, sub-item of TVS-001) at https://app.notion.com/p/Check-the-email-address-before-saving-it-3e8b381da176819b8a8dc9061a68afc5.

$ toolkit work design TVS-001 --create
Created the design of TVS-001 (proposed) at https://app.notion.com/p/TVS-001-Add-a-sign-up-form-to-the-sample-app-solution-design-3e8b381da17681b9b28bd9edebe29797.

$ toolkit work edit TVS-001 --section Overview --set-file overview.md
Saved "Overview" in TVS-001.

$ toolkit memory save --type project --name signup_storage --description "Where the sample app keeps its sign-ups" \
    --body-file memory-body.md --source "Toolkit V2 Notion showcase, 2026-09-27" \
    --authorization "Sample record made for the Notion showcase run on 2026-09-27; not a real decision"
Saved to memory: project_signup_storage (updated).
Where: the Notion Memory database (https://app.notion.com/p/bc72ab3e63f94cef8dc815397957e811)

$ toolkit notion ensure-project --check     -> Everything was already in place. exit 0
$ toolkit notion ensure-project             -> Everything was already in place. exit 0 (.toolkit.json unchanged)
```

The Overview of TVS-001 was filled so the showcase has one section with real
text; the other sections keep the template's prompts. The memory record was
first saved with `--approved-by "Mike Rihm"`, then saved again at once with
the authorization text above, because Mike did not approve that sample record
himself.

**ID prefix.** No code change was needed. `ensure-project` tries the
configured prefix (`WI`) first; Notion refused it (`409`, prefix in use by the
test area's "Toolkit V2 test" database), so it took the next candidate from
the key `toolkit-v2-sample`: `TVS` (`prefixCandidates` in
`plugins/toolkit/lib/notion/ensure.mjs`, tested in
`plugins/toolkit/tests/notion/ensure.test.mjs`). It said so and wrote
`"tracker": { "type": "notion", "idPrefix": "TVS" }` to `.toolkit.json`.
`node --test "plugins/toolkit/tests/notion/*.test.mjs"`: 126 of 126 passed.

### 8. Read-back

**Sample project row** (Projects): Key `toolkit-v2-sample`, Tracker `notion`,
Memory system `notion`, Salesforce off, Local path the scratch folder, Work
items data source `230a87f5-c73e-4faf-b34d-e73c1a426cad`, Memory data source
`55fb4ce7-b559-44fe-a4c8-ad35829d3f83`, Set up on 2026-09-27. Status is empty.
Its page body: one callout, then the Work Items database, the Memory
database, the Current focus page, and the Terminology glossary page.

**Work Items database** (`dcfb7e22-186c-4cbf-8bb4-7914599c27ab`, data source
`230a87f5-c73e-4faf-b34d-e73c1a426cad`, inline on the project page), 21
properties:

| Property | Type | Options |
| --- | --- | --- |
| Work item | title |  |
| ID | unique_id | prefix `TVS` |
| Stage | select | 01-discovery, 02-refinement, 03-requirements-approved, 04-solution-design, 05-breakdown, 06-implementation-plan, 07-tracking-setup, 08-build, 09-testing, 10-bug-fixing, 11-user-approval, 12-pr-and-push, 13-deployment, 14-spec-update |
| Status | status | Backlog, Ready, In Progress, In Review, Done, Cancelled |
| Type | select | discovery, solution-design, build, data-load, repository-maintenance, research, task, bug, enhancement |
| Priority | select | urgent, high, medium, low |
| Delivery | select | agent-led, owner-led, not-offered |
| Design | select | proposed, approved, superseded, none |
| Parent item / Sub-items | relation (two-way, to itself) |  |
| Blocked by / Blocking | relation (two-way, to itself) |  |
| Waiting on, Next action, Requirements approved, Design approved, Result approved | text |  |
| Open owner questions | number |  |
| Updated | date |  |
| Archived | checkbox |  |
| Last edited | last edited time |  |

| View | Type | Settings |
| --- | --- | --- |
| Board | board | grouped by Stage, ascending, empty groups shown (14 columns); hides Done, Cancelled, and Archived items |
| All items | table | sub-items on (`subtasks.property_id` = Parent item, `display_mode: show`, `filter_scope: parents_and_subitems`); hides Archived items; sorted by ID |

| Row | ID | Stage | Status | Parent item | Sub-items | Design |
| --- | --- | --- | --- | --- | --- | --- |
| Add a sign-up form to the sample app | TVS-1 | 01-discovery | Backlog | none | TVS-2 | proposed |
| Check the email address before saving it | TVS-2 | 01-discovery | Backlog | TVS-1 | none | none |

`toolkit work list --tree`:

```text
TVS-001  Add a sign-up form to the sample app  (01 Discovery, Backlog)
  TVS-002  Check the email address before saving it  (01 Discovery, Backlog)
```

**TVS-001 page body**: the `WORK-ITEM.md` sections in order (Overview,
Roadmap, Tasks, Recent History, Open Questions, Requirements, Notes), 52
blocks, then the solution design child page. `toolkit work show TVS-001`
converts it back to the `WORK-ITEM.md` file with its frontmatter (`id:
TVS-001`, `type: build`, `stage: 01-discovery`, `design: proposed`, ...) and
Recent History rows "Created.", "Sub-item TVS-002 created", and "Design
created (proposed)".

**Solution design page**: title "TVS-001: Add a sign-up form to the sample
app — solution design", a child page of TVS-001, 79 blocks in the
`DESIGN.md` format, starting with "Requirements: TVS-001, Design status:
Draft, Last updated: 2026-09-27, Design approval: Pending".

**Memory database** (`bc72ab3e-63f9-4cef-8dc8-15397957e811`, data source
`55fb4ce7-b559-44fe-a4c8-ad35829d3f83`): properties Key (title), Name, Type
(user, feedback, project, reference, event), Status (current, needs-review,
retired), Description, Source, Last verified, Approved by, Superseded by,
Other fields, Saved, Last edited. Views: Index (hides retired) and Retired.
One row, `project_signup_storage`; `toolkit memory get` returns it in the
model's topic format with the exact text that was saved.

**Current focus** and **Terminology glossary**: child pages of the project
page, filled from the model's `CURRENT_FOCUS.md` (the four sections Now,
Waiting on the owner, Untracked to-dos, Next session starts with) and
`terminology-glossary.md` (the term table and "Naming changes and aliases").

## Things Mike may notice

- **The sample row has no Status.** `ensure-project` fills the registry
  properties but not Status, so on the "Active Projects" board the sample sits
  under "No Status".
- **The "All Projects" view does not show the new columns.** ensure-root adds
  the 9 properties to the database but not to the view. They show on each
  row's page. Adding Key to the view would help when Mike fills it in by hand.
- **Links on file names.** In the Notion app, `WORK-ITEM.md` in the item and
  design text shows as a link to `http://WORK-ITEM.md` (Notion makes these
  itself; the toolkit removes them when it reads the page).
- **Not looked at in the Notion app yet:** the Board columns (01 to 14) and the
  sub-item nesting in "All items" were checked through the API only.
- **The sample row's Local path** points to a scratch folder that is removed
  when this session's scratch space is cleaned up.
- **Cleanup.** Safe to delete when Mike is done looking: the "Toolkit V2 sample
  (safe to delete)" row (with its Work Items and Memory databases and pages)
  and the "Old structure (safe to delete)" page. The private test area page
  still holds the `WI` prefix (see `notion-test-area.json`).

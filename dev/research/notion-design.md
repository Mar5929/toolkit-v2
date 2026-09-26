# Research brief: the Notion side of Toolkit V2

Researcher brief for the architect and builders. Written 2026-09-26. Nothing in
Notion was created or changed while writing it. Every Notion fact below came
from a read-only call made that day, unless it is marked **Not tested** or
**Inferred**.

Readers have not seen the sources. Every ID, property name, command, and JSON
body needed to build the Notion tracker and Notion memory is in this file.

---

## 0. The short version

1. **`ntn` can do the whole build through `ntn api`.** The public API now
   supports all of it: creating databases with a full schema, status options
   with groups, self-relations, auto-numbered IDs, board and table **views**,
   page bodies written and read as Markdown, targeted body edits, applying a
   template to a page, moving pages, and trashing things. The MCP tools are
   not needed for any required step (section 4).
2. **Two things the API cannot do.** It cannot create a *database template*
   (an entry in the Notion "New" dropdown). It cannot create *automations*.
   Only the Notion app can do either. Nothing in the design depends on them
   (section 5).
3. **Recommended way to give each project its own databases:** a toolkit
   script (`notion ensure-project`) builds and repairs each project's Work
   Items and Memory databases, views, relations, and pages by API calls. The
   script can be run again at any time. It checks what exists and adds what is
   missing. Copying a template page is a possible second path, but it runs in
   the background, cannot be verified in the same call, and its handling of
   relations is not proven (section 6).
4. **Evidence that Notion's own template copy works in the app:** the existing
   "Claude Toolkit" project row was made from the "Project workspace" template
   in the Notion app. Notion gave it its own copy of the inline knowledge-base
   database, with all three views and its own copy of the "Topic page"
   template (section 2.4).
5. **Sub-items are two linked properties on the same database:** `Parent item`
   and `Sub-item`. They are a two-way relation from the database to itself.
   That is exactly how the Notion app stores sub-items. This was checked on an
   existing database in the workspace that has the app's sub-items feature
   turned on. Nested display is a setting on a **table** view
   (`configuration.subtasks.property_id`). Board views have no sub-item
   setting, so on the board every item, parent or child, is its own card
   (section 7).
6. **The work-item body is written as Markdown.** The body is written with
   `POST /v1/pages` (`markdown` field). The Solution Design subpage is a child
   page created the same way, with the work item as its parent. Both bodies
   are rendered from the toolkit's own `WORK-ITEM.md` and `DESIGN.md` template
   files, so the local tracker and Notion use one template source. The Markdown
   needs a small conversion: pipe tables become `<table>`, `<placeholders>` are
   escaped, and hard line breaks become `<br>` (section 10).
7. **Work item IDs come from a Notion `unique_id` property with prefix `WI`.**
   Notion assigns the number, so two agents can never take the same number.
   Notion displays it as `WI-14`, not `WI-014` (open question Q3).
8. **Store the IDs in a small committed JSON file in the repo.** It holds the
   page, database, data source, view, and property IDs for the project. Notion
   IDs never change when Mike moves or renames a page, database, or property,
   so the file stays valid through his edits. The file holds no secret; the
   login token stays in the macOS keychain, managed by `ntn` (section 12).
9. **Today's Notion content is nearly empty.** The Projects database has one
   row ("Claude Toolkit"). Both knowledge-base databases have 0 rows. So the
   rebuild loses no data. Trashing the old knowledge-base databases still
   needs Mike's yes (section 15).
10. **Status conflict to settle.** The model `WORK-ITEM.md` status hint is
    `Backlog | In Progress | Blocked | Done`. The current tracker's six
    statuses are `Backlog, Ready, In Progress, In Review, Done, Cancelled`, and
    "Blocked" is derived from blockers. This brief proposes the six statuses
    plus a separate `Blocked` checkbox (open question Q1).

---

## 1. Sources read and commands run

Files read (all read-only):

- `/Users/michaelrihm/Documents/Projects/toolkit-v2/dev/GOAL.md` and `dev/PROGRESS.md`.
- Model project `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project/`:
  `.work-items/work-item-template/WORK-ITEM.md`, `.work-items/work-item-template/DESIGN.md`,
  `.memory/AGENTS.md`, `.memory/CURRENT_FOCUS.md`, `.memory/MEMORY.md`,
  `.memory/memory-criteria.md`, `.memory/project_topic_template.md`,
  `.memory/terminology-glossary.md`, `.toolkit-memory.json`, `AGENTS.md`,
  `PROJECT.md`, `.claude/settings.json`, `.codex/hooks.json`, `.gitignore`,
  `.claude/rules/work-item-stages.md`, `.claude/rules/memory-curator-dispatch.md`,
  `.claude/agents/memory-curator.md`, `.claude/hooks/memory_trigger.py`,
  `scripts/memory.py` (validation rules and commands).
- Current toolkit `/Users/michaelrihm/Documents/Projects/claude-toolkit/plugins/work-tracker/skills/work/`:
  `references/lifecycle.md`, `references/record-format.md`, `scripts/lib/tracker.mjs`
  (constants `STATUSES`, `PRIORITIES`, `TYPES`, `STAGES`, `RELATIONSHIPS`).
- Sibling brief `/Users/michaelrihm/Documents/Projects/toolkit-v2/dev/research/work-process.md`
  (sections 3, 4, 14, 15, 16.4) so the Notion schema matches the same process.
- Official Notion developer docs, fetched as Markdown on 2026-09-26:
  `creating-pages-from-templates`, `working-with-markdown-content`,
  `enhanced-markdown`, `working-with-views`, `preparing-for-users`,
  `update-data-source-properties`, `request-limits`, `workspace-block-limits`,
  the CLI pages `cli/get-started/overview` and `cli/guides/data-sources`,
  plus the endpoint docs and OpenAPI fragments printed by `ntn api <path> --docs`
  and `--spec`.
- Notion MCP resources `notion://docs/enhanced-markdown-spec` and
  `notion://docs/view-dsl-spec`, and the MCP tool schemas for `notion-fetch`,
  `notion-create-database`, `notion-create-view`, `notion-update-view`,
  `notion-create-pages`, `notion-update-page`, `notion-update-data-source`,
  `notion-duplicate-page`, `notion-query-data-sources`, `notion-get-async-task`.

Read-only Notion calls made: `ntn whoami`, `ntn doctor`, `ntn api ls`,
`ntn api v1/users/me`, `ntn pages get` (root page, template page, project
row, topic template), `ntn datasources resolve`, `ntn datasources query`,
`ntn api v1/data_sources/<id>`, `ntn api v1/data_sources/<id>/templates`,
`ntn api v1/views database_id==<id>`, `ntn api v1/views/<id>`,
`ntn api v1/databases/<id>`, `ntn api v1/blocks/<id>/children`,
`ntn api v1/search` (read-only search of data sources), and MCP `notion-fetch`
on the Projects data source.

---

## 2. What exists in Notion today (2026-09-26)

### 2.1 Identity and access

| Item | Value |
| --- | --- |
| `ntn` version | `0.23.10` (installed at `/opt/homebrew/bin/ntn`; `ntn doctor` reports it is the latest) |
| Workspace | "Personal", ID `e71d21b2-dd2c-4d2a-81ba-4cec2ca093bd` |
| Bot user used by `ntn` | "Notion CLI", ID `3e7b381d-a176-812c-b0b2-00274d3be8cc`, owner Michael Rihm (user ID `c6a55ad3-a5d5-48b2-a633-9847fe5b58be`) |
| Token storage | macOS keychain ("saved credentials for Personal"); `ntn doctor` shows 7 checks passed, including "Public API access" |
| API version | The OpenAPI spec lists only `2026-03-11` as the `Notion-Version` value |
| What the bot can see | The whole workspace, not only the Second Brain page. A read-only search returned 39 data sources, most of them unrelated personal databases. **Scripts must restrict writes to pages under the Second Brain root** (section 14). |
| Speed | About 0.5 seconds per `ntn` call (`ntn pages get`, `ntn datasources query`), measured with `time` |

### 2.2 The root page

- Title "AI Agent Second Brain", icon 🧠, page ID
  `3e7b381d-a176-803f-a48f-e838ee648e67`, URL
  `https://app.notion.com/p/AI-Agent-Second-Brain-3e7b381da176803fa48fe838ee648e67`.
- Parent: the workspace itself (`{"type":"workspace","workspace":true}`), so it
  sits in Mike's private section.
- Body blocks in order: a blue callout ("A project-centered knowledge system
  for an AI agent..."), heading "How to use this template", four numbered
  steps, a two-column block with two callouts ("Projects" and "Knowledge
  Base"), a divider, and the inline Projects database.

### 2.3 The Projects database

- Database ID `3901f052-2c56-4603-ad56-7f5924655925` (inline on the root page).
  One data source, ID `212cab42-22e0-4682-9fe1-a697a028331a`, title "Projects",
  icon 🎯.
- Properties (exact names, types, and options):

| Property | Type | Options or notes |
| --- | --- | --- |
| `Project` | title | |
| `Status` | status | To-do group: `Backlog`, `Planned`. In progress group: `Active`, `Blocked`. Complete group: `Complete`, `Archived` |
| `Priority` | select | `Critical` (red), `High` (orange), `Medium` (yellow), `Low` (gray) |
| `Owner` | people | the MCP shows a limit of one person |
| `Target Date` | date | |
| `Desired Outcome` | rich_text | description: "The measurable result this project should produce." |
| `Created` | created_time | |
| `Last Updated` | last_edited_time | |

- Views: "Active Projects" (board, grouped by `Status` option, view ID
  `971341ae-c9e8-48b1-9859-06b6d7a9248a`) and "All Projects" (table, sorted by
  Priority ascending then Last Updated descending, view ID
  `8c1f6b71-1374-449a-8adf-1dc841ad3296`). The table view lists a property ID
  `eizm` that has no name, which is left over from a deleted property. It is
  harmless.
- Templates: one, "Project workspace", ID `a239742c-4f8c-4e35-b105-51d153ed0cf7`,
  and it is the default (`is_default: true`).
- Rows: one, "Claude Toolkit", page ID `3e7b381d-a176-80b0-9916-f83abe0926d7`,
  Status `Backlog`, Priority `Medium`, Owner Michael Rihm. Its body is the
  unchanged template text.

### 2.4 The "Project workspace" template and what copying it did

The template page body has: a callout, "Project brief" (Outcome, Success
criteria), "Agent context" (Operating instructions, Current state, Next
actions), "Key decisions and open questions", a divider, "Project knowledge
base" text, and an inline database "Project Knowledge Base":

- Database `a4c3176c-93c9-4374-9732-3be802b83d2b`, data source
  `0e038b12-2a52-4114-a580-2d49781a32c8`, 0 rows.
- Properties: `Topic` (title), `Category` (select: People & Teams, Data &
  Models, Product & Domain, Systems & Integrations, Processes & Playbooks,
  Decisions & Rationale, Research & References, Prompts & Agent Behavior),
  `Confidence` (select High/Medium/Low), `Status` (status: Draft, Active,
  Needs Review, Archived), `Orientation` (rich_text), `Primary Source` (url),
  `Review Date` (date), `Tags` (multi_select, no options), `Created`,
  `Last Updated`.
- Views: "All Topics" (table), "Needs Review" (list), "Active Topics" (gallery).
- Its own default template "Topic page", ID `7ab3449c-c33b-4514-a46c-c8e7a0c8caee`
  (sections: Overview, Current understanding, Key details, Decisions and
  rationale, Examples, Open questions, Sources, Agent guidance).

The "Claude Toolkit" row was created from this template **in the Notion app**.
It got its own separate copy of the whole inline database:

- New database `295b381d-a176-8364-98c9-01fbfe7525b3`, new data source
  `d41b381d-a176-8370-9fae-076b3899345c`, parent = the Claude Toolkit page.
- The same 10 properties, the same three views (new view IDs
  `d40b381d-a176-82ce-b61d-884de0272e4e`, `fd7b381d-a176-8243-8f69-087d72d36a31`,
  `83cb381d-a176-82f6-955a-08c78a2b021f`), and its own copy of the "Topic page"
  template (new ID `1b6b381d-a176-82fb-830e-815f396aae43`, default).
- 0 rows.

What this proves: in the app, copying a template page copies each inline
database inside it, including its schema, views, and database templates. It
does **not** prove how self-relations or relations between two copied
databases are handled, because this database has no relations.

### 2.5 How the Notion app stores sub-items (checked on another database)

One unrelated database elsewhere in the workspace has the app's "Sub-items"
feature turned on. Its schema has two relation properties that point to the
database itself:

```json
"Parent item": {"id": "bMYn", "type": "relation",
  "relation": {"data_source_id": "<same data source>", "type": "dual_property",
               "dual_property": {"synced_property_id": "Asmu", "synced_property_name": "Sub-item"}}},
"Sub-item":    {"id": "Asmu", "type": "relation",
  "relation": {"data_source_id": "<same data source>", "type": "dual_property",
               "dual_property": {"synced_property_id": "bMYn", "synced_property_name": "Parent item"}}}
```

Its only view is a table whose `configuration.subtasks` is `null`, which the
docs describe as "defaults (which may show subtasks)".

---

## 3. What the `ntn` CLI does

### 3.1 Commands

| Command | What it does | Use in the toolkit |
| --- | --- | --- |
| `ntn whoami` | Prints bot ID, name, email, workspace ID, workspace name | Setup check |
| `ntn doctor` | Seven health checks, including token and Public API access | Setup check and troubleshooting |
| `ntn login` / `ntn logout` | Browser sign-in | Mike runs `ntn login` himself (GOAL.md) |
| `ntn auth token` | Prints the current token | Do not use in scripts or logs. The token must never be printed into a transcript. |
| `ntn pages get <id> [--json]` | Page as Markdown, with properties printed as YAML frontmatter first. `--json` returns `{"markdown": {markdown, truncated, unknown_block_ids}, "page": <page object>}`, so one call gives both properties and body. | Read a work item, a memory topic, or current focus |
| `ntn pages create [--parent page:<id> or database:<id> or data-source:<id>] [--content MD or stdin]` | New page from Markdown. Frontmatter `title` sets the title. **Other frontmatter properties are ignored.** | Only for plain child pages. Use `ntn api v1/pages` for database rows, because rows need properties. |
| `ntn pages edit <id> [--content MD or stdin] [--allow-deleting-content]` | **Replaces the whole page body.** It refuses to remove child pages or databases unless `--allow-deleting-content` is given. | Avoid for routine edits: it would drop the Solution Design subpage unless its `<page>` tag is kept, and it rebuilds every block. Never pass `--allow-deleting-content` from a script. |
| `ntn pages trash <id>` | Moves a page to the trash | Only with Mike's explicit approval |
| `ntn datasources query <id or URL> [--limit N] [--start-cursor C] [--filter JSON] [--filter-file F] [-s "<prop> asc"] [--json]` | Lists rows. **Default limit is 25**, so scripts must page through with `--start-cursor` or use `ntn api` directly. | Board and list reads |
| `ntn datasources resolve <database-id>` | Database ID to data source ID(s) | Setup |
| `ntn api <path> [inputs] [-X METHOD] [-d JSON or @file or @-]` | Any public API endpoint, with the token added | **All schema, view, property, and targeted-edit work** |
| `ntn api ls` | Lists the 64 supported endpoints | Reference |
| `ntn api <path> -X <METHOD> --spec` / `--docs` | Prints the OpenAPI fragment or official docs for one endpoint | Reference |
| `ntn files ...` | File uploads | Not needed |
| `ntn workers ...`, `ntn notion-as-code ...` | Notion Workers; alpha and not public | Not needed |

### 3.2 Gotchas found while testing

- **Quote bracketed inline inputs in zsh.** `ntn api v1/search filter[property]=object`
  failed with `zsh: no matches found`. Always quote them, or better, pass the
  body with `-d @body.json` or `-d '<json>'`.
- **Errors:** exit code `5`; a one-line message on stderr such as
  `error: Public API request failed (404 Not Found object_not_found): ...`;
  nothing on stdout. Success prints compact JSON on stdout. Scripts must check
  the exit code and parse stderr for the HTTP status and error code.
- **Docs lookup bug:** `ntn api v1/data_sources -X POST --docs` prints the
  **deprecated** "Create a database" page. Use `--spec` for that endpoint, or
  the web page `https://developers.notion.com/reference/create-a-data-source`.
- **Two methods on one path** need `-X`, for example
  `ntn api v1/pages/<id>/markdown -X GET --docs`.
- **Retries:** it is not known whether `ntn api` retries a 429 by itself. The
  toolkit wrapper must handle 429 and 529 (section 14).
- **Hooks and PATH:** `ntn` lives in `/opt/homebrew/bin`. A hook started from
  the desktop app may not have that on `PATH`. Scripts should find `ntn` with
  `command -v ntn`, then fall back to `/opt/homebrew/bin/ntn`, and allow an
  override variable such as `TOOLKIT_NTN_BIN`.
- **Version pin:** set `NOTION_API_VERSION=2026-03-11` (or pass
  `--notion-version 2026-03-11`) so a Notion API release cannot change
  behavior under the toolkit.

---

## 4. What the public API (through `ntn api`) can do

Checked against the OpenAPI fragments printed by `ntn api ... --spec` for
version `2026-03-11`, and the official docs.

| Need | Endpoint | Supported | Notes |
| --- | --- | --- | --- |
| Create a database with a full schema, inline on a page | `POST /v1/databases` | Yes | Body: `parent {type: page_id, page_id}`, `title`, `description`, `is_inline`, `icon`, `initial_data_source {properties}`. Creates the database, its first data source, and **one default table view**. The parent can be a page that is itself a database row. |
| Typed databases | `POST /v1/databases` `database_type` | Yes | `tasks`, `projects`, `skills` give Notion's fixed schemas. Not useful here; our schemas are custom. |
| Add or change properties later | `PATCH /v1/data_sources/{id}` `properties` | Yes | Setting a property to `null` removes it. A `{"name": ...}` value renames it. Schema limit about 50 KB. |
| Status property with our own options and groups | `status.options[] {name, color, description, group}` | Yes | `group` must be one of `To-do`, `In progress`, `Complete`. Group names themselves and option order can only be changed in the app. |
| Select options with colors and descriptions | `select.options[] {name, color, description}` | Yes | Up to 100 options |
| Self-relation for sub-items | `relation {data_source_id: <self>, type: dual_property, dual_property: {synced_property_name}}` | Yes | Must be added with PATCH after the database exists, because the data source ID is not known before. |
| Auto-numbered ID | `unique_id {prefix: "WI"}` | Yes | Read-only on pages. Filterable (`"unique_id": {"equals": 14}` uses the number filter). |
| Formula property | `formula {expression}` | Yes | Optional (for example a derived-status formula) |
| Views: board, table, list, calendar, timeline, gallery, form, chart, map, dashboard | `POST /v1/views`, `PATCH /v1/views/{id}`, `GET /v1/views?database_id=`, `DELETE /v1/views/{id}` | Yes | Board `configuration.group_by` is required. Group by `select` or `status`. Group sort `manual`, `ascending`, `descending`. `hide_empty_groups`. `properties[]` controls which properties show on cards. `filter`, `sorts`, `position` (`start`, `end`, `after_view`). |
| Sub-item nesting in a view | Table view `configuration.subtasks {property_id, display_mode, filter_scope, toggle_column_id}` | Yes, table only | `display_mode`: `show`, `hidden`, `flattened`, `disabled`. `filter_scope`: `parents`, `parents_and_subitems`, `subitems`. The docs' feature table lists `subtasks` for Table only. |
| Create a page (database row) with properties and a Markdown body | `POST /v1/pages` with `parent {type: data_source_id}`, `properties`, `markdown` | Yes | `markdown` cannot be combined with `children` or `template`. `allow_async: true` is available for very large bodies. Response is the new page. |
| Create a child page (the Solution Design subpage) | `POST /v1/pages` with `parent {type: page_id}` | Yes | `position` can be `page_start`, `page_end`, or `after_block`. |
| Read a page as Markdown | `GET /v1/pages/{id}/markdown` | Yes | Returns `markdown`, `truncated`, `unknown_block_ids`. Truncation starts only at about 20,000 blocks. |
| Targeted edit of a page body | `PATCH /v1/pages/{id}/markdown` with `type: update_content`, `update_content.content_updates[] {old_str, new_str, replace_all_matches}` | Yes | Fails with `validation_error` when `old_str` is not found or matches twice. That failure is useful: it catches the case where Mike changed that text since the agent read it. |
| Replace a whole page body | Same endpoint, `type: replace_content`, `replace_content.new_str` | Yes | Refuses to delete child pages or databases unless `allow_deleting_content: true`. |
| Update properties | `PATCH /v1/pages/{id}` `properties` | Yes | Also `icon`, `cover`, `in_trash`, `is_archived`, `is_locked`, `template`, `erase_content`. Formula, rollup, unique_id, created and edited times are read-only. |
| Apply a template to a new or existing page | `POST /v1/pages` or `PATCH /v1/pages/{id}` with `template {type: default or template_id, template_id, timezone}` | Yes | Runs **in the background after the call returns**. The page is blank at first. There is no job-status endpoint; the docs say to poll the block children with a timeout and never re-apply automatically. `template_id` may be **any page** the bot can read, not only a database template. |
| List a data source's templates | `GET /v1/data_sources/{id}/templates` | Yes | Returns `id`, `name`, `is_default` |
| **Create a database template** | none | **No** | No endpoint and no field. Only the Notion app can make a page a database template. |
| **Create an automation** | none | **No** | Not in `ntn api ls`. |
| **Duplicate a page** | none | **No** | The REST API has no duplicate endpoint. The MCP has `notion-duplicate-page` (runs in the background). |
| Move a page | `POST /v1/pages/{id}/move` | Yes | Target: a page or a data source. Databases cannot be moved with this endpoint, but `PATCH /v1/databases/{id}` accepts `parent` to move a database. |
| Trash or restore | `PATCH /v1/pages/{id}` `in_trash`; `PATCH /v1/databases/{id}` `in_trash`; `ntn pages trash` | Yes | Destructive. Needs Mike's yes. |
| Query rows | `POST /v1/data_sources/{id}/query` | Yes | Filters for title, rich_text, number, checkbox, select, multi_select, status, date, people, files, url, email, phone, relation, created/edited by and time, formula, **unique_id**, rollup, verification. Sorts. `filter_properties` to return fewer columns. Max 10,000 rows. Without a filter it returns "non-archived pages". |
| Search | `POST /v1/search` | Yes | Title search. Not needed when IDs are stored. |
| Comments | `GET/POST /v1/comments` | Yes | Optional, for example to read Mike's comments on a work item. |

### 4.1 Request and size limits

- Rate: 180 requests per minute per connection on non-Business plans (average
  3 per second), plus a shared workspace limit. Over the limit returns 429
  `rate_limited` with `Retry-After` in seconds (at most 60 for the connection
  limit). 529 `service_overload` is retried the same way. Retry 500/502/503/504
  only for GET or DELETE.
- Payload: at most 1,000 block elements and 500 KB per request. Rich text
  `text.content` at most 2,000 characters per text object. Arrays at most 100
  items. URLs at most 2,000 characters.
- Workspace block limit: only Free workspaces with **more than one member**
  are limited (1,000 lifetime blocks). Paid workspaces and single-member Free
  workspaces are unlimited. Mike's "Personal" workspace is assumed to be
  single-member (open question Q9). When blocked, creates return HTTP 403
  `restricted_resource`.

---

## 5. What needs the MCP tools or the Notion app instead

| Need | ntn / REST | Notion MCP | Notion app only | Recommendation |
| --- | --- | --- | --- | --- |
| Board view grouped by Stage | Yes (`POST /v1/views`) | Yes (`notion-create-view`, DSL `GROUP BY "Stage"`) | | Use `ntn api`. |
| Sub-item nesting in a view | Yes (table `subtasks`) | **No.** The MCP view DSL has no sub-item directive. | | Use `ntn api`. |
| Schema with self-relations | Yes | Yes (SQL DDL `RELATION('<ds>', DUAL 'Sub-item' 'sub_item')`) | | Use `ntn api`. |
| Database templates in the "New" dropdown | No | No (`notion-create-pages` takes a `template_id` to apply, but cannot mark a page as a template) | Yes | Not required. See section 6.4. |
| Automations (for example "when Stage changes, set Status") | No | No | Yes | Not required. The agent keeps Status in step (section 8.2). |
| Duplicate a page with its databases | No | Yes (`notion-duplicate-page`, background job) | Yes | Not the main path (section 6). |
| Turning on the app's "Sub-items" menu setting | Unclear | Unclear | Yes | Test whether the API relation plus table `subtasks` setting is enough (test T3). |

Why not rely on the MCP: the Notion MCP connection in this session is a
claude.ai connector. A plain Claude Code CLI session, a Codex session, or a
hook script may not have it. `ntn` is a normal command that any agent or hook
can run. The MCP remains a fallback for an agent reading Notion by hand.

---

## 6. How to give every project its own databases

The REST API cannot copy a page, so each project's structure has to be built
by the toolkit or copied by Notion's template feature.

### 6.1 Option A (recommended): a script builds and repairs each project

A toolkit script, for example `scripts/notion.mjs ensure-project`, makes a
project's Notion structure match the toolkit's specification. It creates only
what is missing, so running it twice changes nothing the second time. It is
also the repair tool.

Steps, in order:

1. **Preflight.** Run `ntn doctor` (or `ntn api v1/users/me`). Read
   `second_brain.root_page_id` and `projects_data_source_id` from the config
   (section 12). Confirm the root page exists and is not in the trash.
2. **Find or create the project row.** Use the stored `project.page_id` if it
   exists and is readable. Otherwise query the Projects data source for a row
   whose `Key` equals the project key, or whose `Repository` equals the git
   remote URL. Otherwise create the row:
   `POST /v1/pages` with `parent {type: data_source_id, data_source_id: <projects ds>}`,
   the properties, and the project-page Markdown (section 10.5), with no
   template.
3. **Find or create the Work Items database** (only when the tracker is
   Notion). Look for the stored ID. Otherwise list the project page's children
   (`GET /v1/blocks/<page>/children`) and find a `child_database` whose title
   is `Work Items`. Otherwise `POST /v1/databases` with the schema in section
   8.2 and `is_inline: true`.
4. **Add the self-relations** with one `PATCH /v1/data_sources/<ws ds>`
   (section 8.2). Skip any that already exist.
5. **Re-read the schema** (`GET /v1/data_sources/<ws ds>`) and record every
   property ID. Views and later writes use IDs, not names.
6. **Views.** `GET /v1/views?database_id=<db>`. Rename and configure the
   default table view as "All items" with sub-item nesting. Create the
   "Board" view at `position {type: start}` and the "Done" view (section 9).
7. **Memory** (only when memory is Notion): the same steps for the Memory
   database (section 8.3), then create the three memory pages as children of
   the project page (section 8.4).
8. **Write the IDs back.** Put the data source IDs into the project row's
   `Work items data source` and `Memory data source` properties. Write the
   repo config file (section 12).
9. **Verify.** Read everything back. Compare each property's type and each
   option list with the specification. Confirm each view's type and group-by
   property. Report any difference in plain words. Never report success
   without this readback.

Why this is recommended:

- Every call returns a result right away, so the script can verify its own
  work. Template copies run in the background with no status endpoint.
- The specification lives in the toolkit repo as data, not as a hand-built
  page in Notion that could drift.
- The same script repairs damage: a deleted view, a deleted select option, a
  missing relation, or a project Mike created by hand in Notion.
- It runs the same way from Claude Code, Codex, and hooks.

Cost: about 15 to 25 API calls per new project, which takes a few seconds and
is well under the rate limit.

### 6.2 Option B (not recommended as the main path): copy a master template

Put the Work Items database, the Memory database, and the memory pages inside
the Projects database's default template ("Project workspace"). Create each
project with `POST /v1/pages` and `template {type: "default"}`. Notion copies
everything in the background, the same way it did for the "Claude Toolkit"
row (section 2.4).

Reasons it is second:

- The copy is asynchronous. The script must poll block children with a
  timeout, and must not re-apply the template if the copy is partial.
- **Not tested:** whether a copied `Parent item`/`Sub-item` self-relation
  points at the new copy or at the template's database. The same question
  applies to a relation between the Work Items and Memory databases.
- Changing the master template means editing a hidden template page. Existing
  projects do not get the change; a repair script is still needed.

Option B stays useful for one case: when Mike clicks **New** in the Projects
database in the Notion app. Section 6.4 covers that case.

### 6.3 Work item pages: build the body from the toolkit's own template

For each new work item the script makes two calls:

1. `POST /v1/pages` into the project's Work Items data source, with the
   properties and the converted `WORK-ITEM.md` body (sections 8.2 and 10.1).
2. `POST /v1/pages` with `parent {type: page_id, page_id: <new work item>}`,
   title `WI-<n>: <title> — solution design`, and the converted `DESIGN.md`
   body (section 10.2).

Then it sets the work item's `Design` property to the subpage URL and reads
both pages back.

Using the same template files as the local tracker keeps one source of truth.
Applying a Notion template (`template_id`) would also work, because any
readable page can be the template, but it is asynchronous and the copy of a
nested child page is **Not tested** (test T11).

### 6.4 When Mike creates something by hand in the Notion app

- **A project row made with the Projects "New" button.** The toolkit's
  `ensure-project` adopts it: it finds the page, adds the missing databases
  and pages, and writes the config. Recommendation: replace the body of the
  current "Project workspace" template with a short callout ("Run the
  toolkit's project setup to add Work Items and Memory") so a hand-made
  project does not get the old knowledge base. This is an edit to a template
  page, which the API allows because a template is a page.
- **A work item card made with the board's "New" button.** It has a title and
  an empty body, because the per-project databases have no database template
  (the API cannot make one). The work skill treats an empty body as "adopt
  this item": it fills the body from `WORK-ITEM.md`, creates the Solution
  Design subpage, and sets Stage `01-discovery` and Status `Backlog` if they
  are empty. This matches the goal: the agent notices what Mike did and
  carries on.
- **Optional, app only:** if Mike wants the "New" button itself to fill the
  template, he can add a database template once per Work Items database in
  the app. That does not scale per project unless Option B is used, so it is
  left as a later choice (open question Q6).

---

## 7. Sub-items

- **Storage:** two relation properties on the Work Items data source that
  point to the same data source, created as one two-way (`dual_property`)
  relation. Use Notion's own names, `Parent item` and `Sub-item`, so they match
  what the app creates when its sub-items feature is turned on (section 2.5).
- **One parent at most.** The API relation config has no limit field. The
  script must refuse to set more than one `Parent item`.
- **Creating a sub-item:** a normal work item row with
  `"Parent item": {"relation": [{"id": "<parent page id>"}]}`. Notion fills
  the parent's `Sub-item` list automatically.
- **Nesting on screen:** only table views can nest. The "All items" table
  view gets
  `"subtasks": {"property_id": "<Parent item property ID>", "display_mode": "show", "filter_scope": "parents_and_subitems", "toggle_column_id": "title"}`.
  **Not tested:** whether `property_id` must name `Parent item` or `Sub-item`
  (test T3).
- **Board:** every item, parent or child, is its own card in its own Stage
  column. Show `Parent item` on the card so Mike can see the link. This fits
  the lifecycle rule that a child has its own stage, status, requirements, and
  approvals, and that finishing a child does not finish its parent.
- **Sub-items are rows, not child pages.** The only child page inside a work
  item is its Solution Design page. The local tracker's "folder nesting" has no
  Notion counterpart; in Notion the relation is the relationship. This matches
  `lifecycle.md`: "Link it through the tracker's parent-child relationship.
  Folder nesting alone is not that relationship."

---

## 8. Proposed schemas

Property names below are exact. The script stores the property **IDs** after
creation and uses them in every later call, so a rename by Mike in the app
does not break anything (section 13). Every property gets a `description`,
which shows in the app when Mike hovers over the column name.

### 8.1 Projects (keep the existing database; add properties)

Keep all eight existing properties and both views. Add:

| Property | Type | Options / purpose |
| --- | --- | --- |
| `Key` | rich_text | Short project slug, for example `toolkit-v2`. Used to find the row. |
| `Repository` | url | Git remote URL, when there is one |
| `Local path` | rich_text | For example `/Users/michaelrihm/Documents/Projects/toolkit-v2` |
| `Tracker` | select | `notion`, `local`, `github`, `jira` |
| `Memory system` | select | `notion`, `local`, `hindsight` |
| `Salesforce` | checkbox | Set by project init |
| `Work items data source` | rich_text | The project's Work Items data source ID. Lets any agent find the database without the repo file. |
| `Memory data source` | rich_text | The project's Memory data source ID |
| `Set up on` | date | Last successful `ensure-project` |

PATCH body:

```json
{"properties": {
  "Key": {"rich_text": {}, "description": "Short project slug used by the toolkit."},
  "Repository": {"url": {}},
  "Local path": {"rich_text": {}},
  "Tracker": {"select": {"options": [
    {"name": "notion", "color": "blue"}, {"name": "local", "color": "gray"},
    {"name": "github", "color": "purple"}, {"name": "jira", "color": "orange"}]}},
  "Memory system": {"select": {"options": [
    {"name": "notion", "color": "blue"}, {"name": "local", "color": "gray"},
    {"name": "hindsight", "color": "green"}]}},
  "Salesforce": {"checkbox": {}},
  "Work items data source": {"rich_text": {}},
  "Memory data source": {"rich_text": {}},
  "Set up on": {"date": {}}
}}
```

A project that uses the local tracker or local memory still gets a Projects
row, as a registry entry. Its Work Items or Memory database is created only
when that system is Notion (open question Q5). This avoids two trackers for
one project, which `lifecycle.md` forbids ("Keep one canonical item. Never
create a second tracker.").

### 8.2 Work Items (one per project)

Database title `Work Items`, icon 🗂️ (any plain icon is fine), inline on the
project page.

Mapping from the model `WORK-ITEM.md` frontmatter:

| `WORK-ITEM.md` field | Notion property | Type |
| --- | --- | --- |
| `id` (`WI-001`) | `ID` | unique_id, prefix `WI` (displays `WI-1`) |
| `title` | `Work item` | title |
| `type` | `Type` | select |
| `status` | `Status` | status |
| `stage` | `Stage` | select |
| `active_phase` (`P1`) | `Active phase` | rich_text |
| `requirements_status` (`refining`) | `Requirements` | select |
| `design` (link) | `Design` | url (points to the Solution Design subpage) |
| *(Overview "Related items" and the tracker's `parent`/`children`)* | `Parent item` / `Sub-item` | two-way self-relation |
| *(tracker `depends_on`/`blocks`)* | `Blocked by` / `Blocking` | two-way self-relation |
| *(tracker `related_to`)* | `Related to` | one-way self-relation |
| *(tracker `priority`)* | `Priority` | select |
| *(requirements approval: who and when)* | `Requirements approved by`, `Requirements approved on` | rich_text, date |
| *(completion approval)* | `Completed on`, `Completion approved by` | date, rich_text |
| *(active branch)* | `Branch` | rich_text |
| *(archive folder in the local tracker)* | `Archived` | checkbox |
| *(derived "blocked")* | `Blocked` | checkbox |

Why these extra fields: the lifecycle requires a **recorded** approval before
`build` or `data-load` work, and "A stage label alone does not establish
approval". Properties make that check a single read for a hook. The body's
Requirements section keeps the full decision record.

Create body (`POST /v1/databases`):

```json
{
  "parent": {"type": "page_id", "page_id": "<project page id>"},
  "title": [{"type": "text", "text": {"content": "Work Items"}}],
  "is_inline": true,
  "icon": {"type": "emoji", "emoji": "🗂️"},
  "initial_data_source": {"properties": {
    "Work item": {"title": {}},
    "ID": {"unique_id": {"prefix": "WI"}},
    "Stage": {"select": {"options": [
      {"name": "01-discovery", "color": "gray", "description": "Working out what the owner wants."},
      {"name": "02-refinement", "color": "gray", "description": "Turning that into requirements."},
      {"name": "03-requirements-approved", "color": "blue", "description": "The owner approved the requirements."},
      {"name": "04-solution-design", "color": "purple", "description": "Deciding how it gets built."},
      {"name": "05-breakdown", "color": "purple", "description": "Splitting work that is too large."},
      {"name": "06-implementation-plan", "color": "purple", "description": "Ordering the build steps."},
      {"name": "07-tracking-setup", "color": "purple", "description": "Creating build tracking when needed."},
      {"name": "08-build", "color": "orange", "description": "Producing the requested change."},
      {"name": "09-testing", "color": "yellow", "description": "Checking it against the requirements."},
      {"name": "10-bug-fixing", "color": "red", "description": "Fixing what testing found."},
      {"name": "11-user-approval", "color": "pink", "description": "The owner reviews the result."},
      {"name": "12-pr-and-push", "color": "green", "description": "Repository work is in a pushed pull request."},
      {"name": "13-deployment", "color": "green", "description": "The result is put where it belongs."},
      {"name": "14-spec-update", "color": "green", "description": "Lasting specifications match the result."}]}},
    "Status": {"status": {"options": [
      {"name": "Backlog", "color": "gray", "group": "To-do"},
      {"name": "Ready", "color": "blue", "group": "To-do"},
      {"name": "In Progress", "color": "yellow", "group": "In progress"},
      {"name": "In Review", "color": "purple", "group": "In progress"},
      {"name": "Done", "color": "green", "group": "Complete"},
      {"name": "Cancelled", "color": "brown", "group": "Complete"}]}},
    "Type": {"select": {"options": [
      {"name": "discovery"}, {"name": "solution-design"}, {"name": "build"},
      {"name": "data-load"}, {"name": "repository-maintenance"}, {"name": "research"},
      {"name": "task"}, {"name": "bug"}, {"name": "enhancement"}]}},
    "Priority": {"select": {"options": [
      {"name": "urgent", "color": "red"}, {"name": "high", "color": "orange"},
      {"name": "medium", "color": "yellow"}, {"name": "low", "color": "gray"}]}},
    "Requirements": {"select": {"options": [
      {"name": "refining", "color": "yellow"}, {"name": "finalized", "color": "green"}]}},
    "Requirements approved by": {"rich_text": {}},
    "Requirements approved on": {"date": {}},
    "Active phase": {"rich_text": {}},
    "Blocked": {"checkbox": {}},
    "Design": {"url": {}},
    "Branch": {"rich_text": {}},
    "Archived": {"checkbox": {}},
    "Completed on": {"date": {}},
    "Completion approved by": {"rich_text": {}},
    "Created": {"created_time": {}},
    "Last edited": {"last_edited_time": {}}
  }}
}
```

Stage and status values are copied exactly from `tracker.mjs` (`STAGES`,
`STATUSES`, `TYPES`, `PRIORITIES`) and `lifecycle.md`. Stage descriptions are
the "What it covers" text from `lifecycle.md`.

Self-relations, added right after (`PATCH /v1/data_sources/<work items ds>`):

```json
{"properties": {
  "Parent item": {"relation": {"data_source_id": "<work items ds>", "type": "dual_property",
                               "dual_property": {"synced_property_name": "Sub-item"}}},
  "Blocked by":  {"relation": {"data_source_id": "<work items ds>", "type": "dual_property",
                               "dual_property": {"synced_property_name": "Blocking"}}},
  "Related to":  {"relation": {"data_source_id": "<work items ds>", "type": "single_property",
                               "single_property": {}}}
}}
```

**Not tested:** that one `dual_property` entry creates both sides with the
given synced name on a self-relation (test T2). The MCP's own example for a
self-relation declares both sides explicitly, with names and IDs:
`RELATION('ds', DUAL 'Children' 'children')` and `RELATION('ds', DUAL 'Parent' 'parent')`.

#### 8.2.1 Status follows Stage

`work-process.md` section 3 records the tracker's rule: stages `01`-`02` mean
`Backlog`, `03` means `Ready`, `04`-`11` mean `In Progress`, `12`-`14` mean
`In Review`. `Done` and `Cancelled` are set only by an approved finish or a
cancellation, never by a stage.

If Mike drags a card to another Stage column, Notion changes only `Stage`.
Notion cannot keep `Status` in step without an app-only automation. So the
toolkit does it: whenever it reads a work item whose Status is not `Done` or
`Cancelled`, it computes the status from Stage and fixes Status if they
differ. It records one Recent History line only when the stage move was
meaningful. Optional: a formula property `Stage status` that shows the derived
value on cards, so a mismatch is visible to Mike.

### 8.3 Memory (one per project)

Mapping from the `.memory/` topic file frontmatter (`project_topic_template.md`
and the checks in `scripts/memory.py`):

| `.memory` field | Rule in `memory.py` | Notion property | Type |
| --- | --- | --- | --- |
| filename `<type>_<topic>.md` | `^(user\|feedback\|project\|reference\|event)_[a-z0-9]+(?:_[a-z0-9]+)*\.md$` | `Type` plus `Slug` | select, rich_text |
| `name` | lowercase kebab-case slug, unique | `Slug` | rich_text |
| *(`# <Topic title>` heading)* | | `Topic` | title |
| `description` | at most 105 characters, no `[` or `]` | `Description` | rich_text |
| `metadata.type` | must equal the filename prefix | `Type` | select: `user`, `feedback`, `project`, `reference`, `event` |
| `status` | `current`, `needs-review`, `superseded`; `archived` only in archive | `Status` | select: `current`, `needs-review`, `superseded`, `archived` |
| `source` | required | `Source` | rich_text |
| `last_verified` | required, `YYYY-MM-DD` or `unknown` | `Last verified` | date (empty means unknown) |
| `authorization` | required; names the approved card or the trusted grant | `Authorization` | rich_text |
| `supersedes` | | `Supersedes` / `Superseded by` | two-way self-relation |

`Status` is a `select`, not a Notion `status` property, so the values stay the
exact lowercase words the local runtime uses.

Create body:

```json
{
  "parent": {"type": "page_id", "page_id": "<project page id>"},
  "title": [{"type": "text", "text": {"content": "Memory"}}],
  "is_inline": true,
  "icon": {"type": "emoji", "emoji": "🧠"},
  "initial_data_source": {"properties": {
    "Topic": {"title": {}},
    "Slug": {"rich_text": {}, "description": "Lowercase kebab-case name, unique in this project."},
    "Type": {"select": {"options": [
      {"name": "user", "color": "blue"}, {"name": "feedback", "color": "orange"},
      {"name": "project", "color": "purple"}, {"name": "reference", "color": "gray"},
      {"name": "event", "color": "green"}]}},
    "Description": {"rich_text": {}, "description": "One plain line, at most 105 characters. Shown in the index."},
    "Status": {"select": {"options": [
      {"name": "current", "color": "green"}, {"name": "needs-review", "color": "yellow"},
      {"name": "superseded", "color": "gray"}, {"name": "archived", "color": "brown"}]}},
    "Source": {"rich_text": {}},
    "Last verified": {"date": {}},
    "Authorization": {"rich_text": {}},
    "Created": {"created_time": {}},
    "Last edited": {"last_edited_time": {}}
  }}
}
```

Then add `"Supersedes": {"relation": {"data_source_id": "<memory ds>", "type": "dual_property", "dual_property": {"synced_property_name": "Superseded by"}}}`.
Optional: `"Work items": {"relation": {"data_source_id": "<work items ds>", "type": "single_property", "single_property": {}}}`
for the template's "Related" line. It is one-way so the Work Items database
does not grow an extra column.

The generated `MEMORY.md` index has no Notion file. The Memory database's
"Index" view is the index (section 9). A hook that needs a compact index runs
one query with `filter_properties` for `Topic`, `Slug`, `Type`, `Description`,
`Status`.

### 8.4 The three memory pages

`.memory/` also has three "views" that are not topics. In Notion they become
child pages of the project page, next to the Memory database:

| Local file | Notion page title | Body |
| --- | --- | --- |
| `CURRENT_FOCUS.md` | `Current focus` | Same headings as the file. The script keeps it under 50 lines, the same limit as `memory.py` (`MAX_FOCUS_LINES = 50`). |
| `memory-criteria.md` | `Memory criteria` | The frontmatter (`mode`, `trusted_by`, `trusted_on`, `trusted_scope`, `backup_destination`, `backup_restore_tested_on`) goes in a fenced `yaml` code block as the **first block**, so one parser reads both stores. The rest of the file follows. Code blocks are stored literally, so the YAML survives a round trip. |
| `terminology-glossary.md` | `Terminology glossary` | The table as a Notion `<table>` |

`backup_destination` has no meaning in Notion (Notion keeps page history).
The Notion variant should say so in that field instead of leaving `none`.

---

## 9. Views

All views are created with `POST /v1/views` and need `database_id`,
`data_source_id`, `name`, `type`, and for boards `configuration.group_by`.
Property IDs come from step 5 of section 6.1.

Work Items:

| View | Type | Settings |
| --- | --- | --- |
| `Board` (first tab) | board | `group_by {type: "select", property_id: <Stage>, sort: {type: "ascending"}, hide_empty_groups: false}`. Filter: Status is not `Done` and not `Cancelled`, and `Archived` is unchecked. Card properties: `ID`, `Type`, `Status`, `Priority`, `Parent item`, `Blocked`. `card_layout: "list"`. Position `{type: "start"}`. |
| `All items` | table | The default view made with the database, renamed with `PATCH /v1/views/<id>`. `subtasks {property_id: <Parent item>, display_mode: "show", filter_scope: "parents_and_subitems", toggle_column_id: "title"}`. Filter: `Archived` unchecked. Sort: `ID` ascending. |
| `Done` | table | Filter: Status is `Done` or `Cancelled`, or `Archived` is checked. Sort: `Last edited` descending. |

Ascending group sort orders the columns `01-discovery` to `14-spec-update`
because of the two-digit prefix. Items with no Stage appear in a "No Stage"
column. With `hide_empty_groups: false` all 14 stage columns always show; that
is wide, so Mike may want it `true` (open question Q7).

Example board body:

```json
{
  "database_id": "<work items db>", "data_source_id": "<work items ds>",
  "name": "Board", "type": "board", "position": {"type": "start"},
  "configuration": {"type": "board",
    "group_by": {"type": "select", "property_id": "<Stage id>", "sort": {"type": "ascending"}, "hide_empty_groups": false},
    "card_layout": "list",
    "properties": [{"property_id": "<ID id>", "visible": true}, {"property_id": "<Type id>", "visible": true},
                   {"property_id": "<Status id>", "visible": true}, {"property_id": "<Parent item id>", "visible": true}]},
  "filter": {"and": [
    {"property": "Status", "status": {"does_not_equal": "Done"}},
    {"property": "Status", "status": {"does_not_equal": "Cancelled"}},
    {"property": "Archived", "checkbox": {"equals": false}}]}
}
```

Memory:

| View | Type | Settings |
| --- | --- | --- |
| `Index` | table | Group by `Type` (select), group sort `manual` so the order stays user, feedback, project, reference, event (the order `memory.py` writes). Filter: Status is not `archived`. Columns: `Topic`, `Description`, `Status`, `Last verified`. |
| `Needs review` | list | Filter: Status is `needs-review` |
| `Archive` | table | Filter: Status is `archived` or `superseded` |

Projects: keep "Active Projects" (board by Status) and "All Projects"
(table). Add the new columns to "All Projects".

Optional later: a `dashboard` view on the root page with one widget per
project's Work Items board (`POST /v1/views` with `view_id` of the dashboard).
This gives Mike one screen across projects without a shared database.

---

## 10. Page bodies and the Markdown conversion

### 10.1 Work item body

Source: the toolkit's copy of `.work-items/work-item-template/WORK-ITEM.md`
(after the model review). Conversion:

1. Take the YAML frontmatter off and turn it into properties (section 8.2).
2. Drop the first heading `# WI-001: <Work item title>`. The page title and
   the `ID` property already show both.
3. Keep `## Overview`, `## Roadmap`, `## Tasks`, `## Recent History`,
   `## Open Questions`, `## Requirements`, `## Notes` and the `###` and `####`
   headings under them. Notion supports heading levels 1 to 4.
4. **Pipe tables to `<table>`.** Notion's documented table syntax is
   `<table header-row="true"><tr><td>...</td></tr></table>`. Pipe tables are
   not documented as input (test T5). Table cells may hold only rich text.
5. **Escape placeholders.** Notion Markdown treats `<` and `>` as tag
   brackets. `<Work item title>` must become `\<Work item title\>`. The
   characters Notion's spec lists for escaping are: backslash, `*`, `~`,
   backtick, `$`, `[`, `]`, `<`, `>`, `{`, `}`, `|`, `^`. Escape them only
   where they are meant as literal text; link syntax `[text](url)`, bold
   `**text**`, and inline code must stay unescaped.
6. **Hard line breaks.** The Tasks section ends lines with two spaces and
   indents the next line (`**Work:** ...`). Notion ignores ordinary line
   breaks and uses tabs for child blocks. Convert each line break inside one
   task to `<br>`, so each task stays one to-do block (test T7).
7. Checkbox items `- [ ]` become Notion to-do blocks.
8. Leave the Solution Design `<page>` block where Notion puts it (at the end
   of the page). Every later body edit must keep that tag.

The agent can read the Notion Markdown back directly. A script that needs one
section finds it by its `##` heading.

Editing rules:

- Use `update_content` (search and replace) for all routine edits: a new
  Recent History row, a changed "Next action" line, a task status. If Mike
  changed the same text since the read, the `old_str` no longer matches and
  Notion refuses the edit; the agent then re-reads and tries again.
- Use `replace_content` only when creating or repairing a body. It rebuilds
  every block, so comments attached to blocks can be lost (**Inferred**).
- Notion has no revision check on page writes. Compare `last_edited_time`
  just before a write as a weaker check. Per `record-format.md`: "when
  revisions are unavailable, do not claim atomic conflict protection."

### 10.2 Solution Design subpage

Source: `.work-items/work-item-template/DESIGN.md`.

- Title: `WI-<n>: <title> — solution design`, which mirrors the template's H1
  `# WI-001: <Work item title> — solution design`.
- Drop the H1 from the body.
- `Requirements: [WORK-ITEM.md](WORK-ITEM.md)` becomes
  `Requirements: <mention-page url="<work item page URL>"/>`.
- Keep `Status: proposed` and `Date:` as the first lines. Optional: a
  `Design status` select on the work item (`proposed`, `approved`) if hooks need
  it.
- The same escaping and table rules as 10.1. The HTML comments in the
  template (`<!-- ... -->`) are removed.
- Created at the same time as the work item, the same as the local template
  folder, which holds both files.

### 10.3 Memory topic body

Source: `.memory/project_topic_template.md`. The frontmatter becomes
properties. `# <Topic title>` is dropped; it is the title. The body keeps the
five bold lines: **Remember**, **Why**, **How to apply**, **Evidence and
limits**, **Related**. The closing HTML comment is removed.

### 10.4 Size

A filled work item is small compared with the limits (1,000 blocks and
500 KB per request). If a request fails with the "too large" validation error,
the docs say to split the content, for example by moving Recent History to a
child page.

### 10.5 Project page body

A short navigation page. It does not repeat `PROJECT.md` or
`CURRENT_FOCUS.md`, so there is one owner for each fact. Plain wording per the
project's `plain-english-artifacts.md` rule:

```
<callout icon="🧭" color="blue_bg">
	This page holds this project's work items and memory. Agents update it through the toolkit. Repository: <local path or URL>.
</callout>
## Work items
(Work Items database, added by the script)
## Memory
(Current focus, Memory criteria, Terminology glossary pages, then the Memory database)
```

`POST /v1/databases` has no position setting and adds the database at the end
of the page. So the script builds the page in order: create the page with the
callout and the `## Work items` heading; create the Work Items database; append
`## Memory` with `PATCH .../markdown` `insert_content` at `position {type: "end"}`;
create the three pages; create the Memory database.

---

## 11. How the work commands map to Notion calls

This is for the builder of the Notion tracker adapter. Command names are the
current tracker's (`work-process.md` section 16.4).

| Command | Notion calls |
| --- | --- |
| `work add` | `POST /v1/pages` (row + body) → `GET` to read `ID` → `POST /v1/pages` (Solution Design) → `PATCH` `Design` url |
| `work status` / `work next` | `POST /v1/data_sources/<ds>/query` with filter on Status and `Archived`, sorts, all pages |
| `work update --stage` | `PATCH /v1/pages/<id>` `Stage` and derived `Status` → `update_content` to add a Recent History row |
| `work link --type children` | `PATCH /v1/pages/<child>` `Parent item: [{id: <parent>}]` |
| `work link --type depends_on` | `PATCH` `Blocked by` |
| `work requirements --finalize` | `PATCH` `Requirements: finalized`, `Requirements approved by`, `Requirements approved on`, and Status `Ready` if the stage allows → `update_content` in the Requirements section |
| `work finish` | Only after Mike's approval: `PATCH` `Status: Done`, `Completed on`, `Completion approved by` → Recent History row |
| `work archive` / `unarchive` | `PATCH` `Archived` checkbox. It is not a status change, the same as the local archive folder. |
| `work active` | Stays local: a Git-ignored state file maps branch to Notion page ID and `WI-<n>`. Notion has no "active item" idea. |
| `work validate` | `ensure-project --check` (schema, views, relations) plus per-item checks: Stage vs Status, one parent at most, Solution Design child page present |
| `work finish` event outbox (`EVENTS.ndjson`) | Stays local |

Every write is followed by a read-back, as `lifecycle.md` requires ("A
successful command is not proof").

---

## 12. Where the repo stores the Notion IDs

Recommendation: one JSON file at the repo root, next to the model's
`.toolkit-memory.json`, named `.toolkit-notion.json`. (The architect may fold
it into a single toolkit config file; the content is what matters.)

- **Committed to Git.** It holds IDs only. An ID is useless without the login
  token, which stays in the keychain. Committing it means every clone and
  worktree finds the same Notion records. Exception: a client repository,
  where Mike may not want his personal Notion IDs; then the file is
  Git-ignored and rebuilt from the Projects database by `Key` or
  `Repository` (open question Q4).
- **Property IDs are stored too.** Notion keeps a property's ID when Mike
  renames it in the app, so calls that use IDs keep working.
- **Only the systems in use appear.** `work_items` only when the tracker is
  Notion; `memory` only when memory is Notion.

Example (root and Projects IDs are real; the rest are placeholders):

```json
{
  "schema": 1,
  "notion_version": "2026-03-11",
  "workspace": {"id": "e71d21b2-dd2c-4d2a-81ba-4cec2ca093bd", "name": "Personal"},
  "second_brain": {
    "root_page_id": "3e7b381d-a176-803f-a48f-e838ee648e67",
    "projects_database_id": "3901f052-2c56-4603-ad56-7f5924655925",
    "projects_data_source_id": "212cab42-22e0-4682-9fe1-a697a028331a"
  },
  "project": {
    "key": "sample-app",
    "page_id": "<project page id>",
    "url": "https://app.notion.com/p/<id>"
  },
  "work_items": {
    "database_id": "<id>",
    "data_source_id": "<id>",
    "id_prefix": "WI",
    "properties": {
      "title": "title", "id": "<prop id>", "stage": "<prop id>", "status": "<prop id>",
      "type": "<prop id>", "priority": "<prop id>", "requirements": "<prop id>",
      "requirements_approved_by": "<prop id>", "requirements_approved_on": "<prop id>",
      "active_phase": "<prop id>", "blocked": "<prop id>", "design": "<prop id>",
      "branch": "<prop id>", "archived": "<prop id>", "completed_on": "<prop id>",
      "completion_approved_by": "<prop id>", "parent_item": "<prop id>", "sub_item": "<prop id>",
      "blocked_by": "<prop id>", "blocking": "<prop id>", "related_to": "<prop id>"
    },
    "views": {"board": "<view id>", "all_items": "<view id>", "done": "<view id>"}
  },
  "memory": {
    "database_id": "<id>",
    "data_source_id": "<id>",
    "properties": {"title": "title", "slug": "<prop id>", "type": "<prop id>", "description": "<prop id>",
                   "status": "<prop id>", "source": "<prop id>", "last_verified": "<prop id>",
                   "authorization": "<prop id>", "supersedes": "<prop id>", "superseded_by": "<prop id>"},
    "views": {"index": "<view id>", "needs_review": "<view id>", "archive": "<view id>"},
    "pages": {"current_focus": "<page id>", "criteria": "<page id>", "glossary": "<page id>"}
  },
  "verified_at": "2026-09-26T00:00:00Z"
}
```

Local-only state (Git-ignored), for example `.toolkit/state/notion-active.json`:
the active work item per branch, and a cached copy of the current focus page
for the session-start hook when Notion is unreachable.

Memory selection: the model's `.toolkit-memory.json` currently reads
`{"schema": 2, "memory": "second-brain-v2", "location": ".memory", "activeWriter": "memory-curator"}`.
For Notion memory it would read `"memory": "notion"` and point at the Notion
config.

---

## 13. When Mike moves or renames things in Notion

Notion IDs do not change when things move or are renamed, so most of Mike's
edits need no repair. What the toolkit checks, and when:

| Mike's action | What happens | What the toolkit does |
| --- | --- | --- |
| Renames a work item, database, view, property, or page | IDs stay the same | Nothing. Always look up by ID, never by title. |
| Drags a card to another Stage column | `Stage` changes, `Status` does not | Recompute Status on the next read (8.2.1) |
| Changes `Parent item` on a card | The relation changes | Re-read relations on every read; never cache them |
| Moves a work item page out of the Work Items database | The page's `parent` is no longer the data source | On read, compare `parent.data_source_id`; tell Mike and ask whether it is still tracked |
| Moves the Work Items database to another page | The database `parent` changes | `ensure-project --check` compares the database parent with the project page and reports it |
| Deletes a select option (for example a stage) | The option is gone from the schema | `ensure-project` adds missing options back. It never removes options Mike added. |
| Deletes a view | The view is gone | `ensure-project` recreates it. It does not overwrite a view Mike changed, unless asked. |
| Deletes the Solution Design page | The child page is gone | The work skill notices the `Design` URL no longer resolves (it is in the trash) and asks Mike before making a new one |
| Trashes a work item | `in_trash: true` | Treat it as gone; never restore it without asking |
| Creates a card or a project by hand | Empty body | Adopt it (section 6.4) |

---

## 14. Safety rules for every Notion script

- **Scope.** The bot can read and write the whole workspace, including
  unrelated personal pages. Before any write, the script confirms the target
  is under the Second Brain root: a page whose parent chain reaches
  `root_page_id`, a row in a data source recorded in the config, or the root
  itself. Anything else is refused.
- **No deletes without Mike.** Trashing a page or database, `erase_content`,
  `allow_deleting_content`, and removing properties or options all need
  Mike's explicit yes, the same as the global rules. `ensure-project` only
  adds.
- **Rate limits.** One request queue. On 429 or 529, wait for `Retry-After`,
  then back off exponentially with jitter, up to 5 retries. Retry 5xx only on
  GET and DELETE. Never retry a 429 with `public_api_request_blocked`.
- **Writes that return 503** must be checked (read back) before a retry, so
  the same row is not created twice.
- **Tokens.** Never print or log the token. Never put it in the config file.
- **Hooks fail open.** A hook that cannot reach Notion (offline, expired
  login) prints one short line, for example "Notion unreachable; showing the
  last saved current focus", and exits 0 so the session continues. Each call
  takes about 0.5 seconds, so a session-start hook with 2 or 3 calls fits in
  its 10-second timeout.
- **Codex sandbox (Inferred from general Codex knowledge; not checked
  against captured docs):** Codex's default `workspace-write` sandbox turns
  off network access, and it may block the macOS keychain. `ntn` needs both.
  The Codex test run must check this (test T13). Possible fixes: allow
  network in the Codex config for this project, or use `NOTION_KEYRING=0`
  (file-based login at `~/.config/notion/auth.json`), which means Mike logs in
  again.

---

## 15. Rebuilding the current "AI Agent Second Brain" page

The rebuild changes Mike's Notion content, so each step is done only after
Mike approves the plan. Nothing here has been done.

1. **Root page body.** Replace the "How to use this template" text and the two
   callouts with a short plain description: the Projects database lists every
   project; each project page holds its own Work Items and Memory databases;
   agents set these up with the toolkit. Keep the inline Projects database
   block. Use `update_content` so the database block is untouched.
2. **Projects schema.** Add the properties in section 8.1. Add them to the
   "All Projects" view.
3. **"Project workspace" template** (`a239742c-4f8c-4e35-b105-51d153ed0cf7`).
   Replace its body with the short "run the toolkit's project setup" callout
   (section 6.4). This removes its "Project Knowledge Base" database
   (`a4c3176c-93c9-4374-9732-3be802b83d2b`, 0 rows), which needs
   `allow_deleting_content` and **Mike's yes**.
4. **"Claude Toolkit" row** (`3e7b381d-a176-80b0-9916-f83abe0926d7`). Decide
   with Mike: keep it and run `ensure-project` on it, or leave it alone because
   `claude-toolkit` is not a Toolkit V2 project (open question Q8). Its empty
   knowledge base (`295b381d-a176-8364-98c9-01fbfe7525b3`, 0 rows) would be
   trashed only with **Mike's yes**.
5. **Sandbox first.** Run the tests in section 16 inside a throwaway test
   project row (for example "Toolkit V2 sandbox"), then trash it with Mike's
   yes.
6. **Sample projects** for finish item 9 ("Notion tracker + Notion memory")
   are created by `ensure-project`, and their IDs are saved in each sample
   repo's config file.

---

## 16. Tests to run before building on these assumptions

Run each in the sandbox project and record the real output in
`dev/test-runs/`.

| Test | Question | Pass condition |
| --- | --- | --- |
| T1 | Does `POST /v1/databases` with our `status.options` and `group` values create exactly those six options in the right groups, with no extra default options? | `GET` data source shows six options in `To-do`, `In progress`, `Complete` |
| T2 | Does one `dual_property` self-relation with `synced_property_name: "Sub-item"` create both `Parent item` and `Sub-item`? | Both properties exist and point at each other |
| T3 | Which property ID must `subtasks.property_id` name (`Parent item` or `Sub-item`) for the table to nest correctly? Does the app's sub-items menu then show as on? | A child row appears under its parent with a toggle in the app |
| T4 | Board grouped by Stage select, ascending: are the columns in `01`...`14` order, and do the card properties show? | Screenshot or `GET /v1/views/<id>` plus a look in the app |
| T5 | Are pipe tables in `markdown` turned into table blocks, or kept as text? | Read back with `GET .../markdown`: `<table>` means supported |
| T6 | Are unescaped `<Placeholder>` strings lost? Are escaped ones kept? | Read-back text matches |
| T7 | How do two-space hard breaks and indented lines in the Tasks section come out? Does the `<br>` version keep each task as one to-do block? | Read-back matches the intended shape |
| T8 | Does `ntn pages edit` (replace) on a work item without its `<page>` tag refuse to delete the Solution Design page? | Error listing the child page |
| T9 | Does `update_content` fail when `old_str` was changed by someone else? | `validation_error` |
| T10 | What does a new row's `ID` look like, and does a `unique_id` filter find it? | `unique_id: {prefix: "WI", number: 1}`; filter returns the row |
| T11 | Does `template {type: "template_id"}` pointing at a page with a child page copy the child page too? How long does it take? | Only needed if Option B or template-based items are chosen |
| T12 | In the app, when the Projects template contains Work Items with a self-relation and Memory with a relation to Work Items, do the copies point at the new databases? | Only needed if Option B is chosen |
| T13 | Do `ntn` calls work from a Codex session in this project (network and keychain)? | `ntn api v1/users/me` succeeds from Codex |
| T14 | Does `ntn api` retry 429 by itself? | Observe with a burst of reads; the wrapper must handle it either way |
| T15 | What does `PATCH /v1/pages/{id}` `is_archived: true` do to a database row (hidden from views, or trashed)? | Decides whether the `Archived` checkbox is needed |

---

## 17. Open questions

- **Q1 (Mike or architect): statuses.** Use the tracker's six statuses
  (`Backlog, Ready, In Progress, In Review, Done, Cancelled`) plus a `Blocked`
  checkbox, or the model template's `Backlog | In Progress | Blocked | Done`?
  This brief assumes the six plus the checkbox. The same answer must apply to
  every tracker.
- **Q2 (architect): stage-to-status sync.** Is it acceptable that Status is
  corrected by the agent on its next read after Mike drags a card, rather than
  by a Notion automation (which only the app can create)?
- **Q3 (Mike): ID display.** Notion shows `WI-14`, the local tracker writes
  `WI-014`. Accept the Notion form for Notion projects, or add a formula
  property that shows the padded form?
- **Q4 (Mike): config in Git.** Commit `.toolkit-notion.json` (recommended),
  or keep it out of Git in client repositories?
- **Q5 (Mike): partial use.** When a project uses Notion for only one of
  tracker or memory, create only that database (recommended), or always both?
- **Q6 (Mike): the "New" button.** Is it enough that the agent fills in a card
  Mike creates by hand, or does Mike want the Notion "New" button to fill the
  template itself? The second needs a database template made in the app for
  every project, or the template-copy path (Option B).
- **Q7 (Mike): board width.** Show all 14 stage columns always
  (`hide_empty_groups: false`), or only stages that have items?
- **Q8 (Mike): the existing "Claude Toolkit" row.** Adopt it into the new
  structure, leave it, or remove it?
- **Q9 (Mike): workspace plan.** Is "Personal" a single-member workspace (no
  block limit), or does it have other members?
- **Q10 (architect): memory pages vs rows.** This brief puts Current focus,
  Memory criteria, and the Terminology glossary as child pages of the project
  page, not as rows in the Memory database, because they are not topics and
  `memory.py` treats them separately. Confirm.
- **Q11 (architect): session-start with Notion memory.** Read the current
  focus page from Notion at every session start (about 0.5 seconds per call),
  or read a local cached copy that the curator refreshes after each write, with
  a Notion read as the fallback?
- **Q12 (test): sub-item display setting.** Results of T2 and T3 decide
  whether nested sub-items can be fully set up by API, or whether Mike must
  turn on "Sub-items" once per database in the app.

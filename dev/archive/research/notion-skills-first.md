# Notion work tracking and Notion memory, skills first

Written 2026-09-29 by the Notion work tracker session, for the architecture
the main session is writing after Mike's direction change ("skills and timely
hooks, no custom program") and his corrections the same day (one skill set
per storage option, each with its own hooks, onboarding brings in only the
chosen sets; `dev/GOAL.md`). This is the Notion part only: the data model,
the templates, the links from memory to work items, the views, the two
Notion skill sets, and their hooks. Built on 2026-09-30 (overnight build):
the skill folders are in
`plugins/toolkit/skills/project-setup/assets/skill-sets/notion-work/` and
`notion-memory/`, and the live checks are in
`dev/test-runs/notion-skill-sets.md`, which wins where this design file
differs. Items marked **To test** were open when this was written.

## 1. What Mike asked for (this session, 2026-09-29)

- Projects at the top; every work item belongs to one project.
- Up to three levels: parent, child, grandchild. Never called an epic.
- A phase groups child items under a parent. A phase is not a work item.
  Plans change: phases are added, dropped, merged, and reordered.
- Tasks, phases, and sub-items are real linked records, shown as live
  sections on the work item page, not text copied from `WORK-ITEM.md`.
  The rest of the page follows `WORK-ITEM.md`.
- Views: a Kanban board grouped by Status (columns in status order, cards
  sorted), a board by Stage, a table, and a roadmap with no dates.
- Columns: status, stage, tags, parent and child links, links between items,
  and files. No assignee, points, effort, or time tracking.
- Page properties in a sensible order.
- Agent notes are Notion comments, apart from the body.
- One Solution Design page per item from `DESIGN.md`; it may have subpages.
- Memories, facts, entities, and decisions can link to work items (not
  required), so each work item shows them and they can be grouped by item.
- No synced blocks. Keep it simple; use Notion's own features.

## 2. Data model

Three databases per project for work, plus Lore's memory databases when the
project keeps memory in Notion. All are inside the project's page.

### Work Items (one row per work item)

Properties, in the order they show on the page:

| Property | Type | Notes |
| --- | --- | --- |
| Work item | title | |
| ID | unique ID | Prefix set per project (Notion allows one database per prefix). |
| Status | status | Backlog, Ready, In Progress, In Review, Done, Cancelled, in that order. |
| Stage | select | `01-discovery` to `14-spec-update`, in order. Status follows stage. |
| Waiting on | select | owner, agent, external, none. Who, for external, goes in the Overview Blockers line. |
| Type | select | The lifecycle types. |
| Priority | select | urgent, high, medium, low, in that order. |
| Parent item / Sub-items | relation to itself, two-way | At most three levels. |
| Phase | relation to Phases, one row | The parent's phase this item belongs to. Empty for a top-level item. |
| Phase order | rollup of Phase → Order | Only for sorting views. |
| Tasks | relation from Tasks, two-way | |
| Blocked by / Blocking | relation to itself, two-way | The roadmap's order between items. |
| Related | relation to itself, one-way | Linked but not blocking. |
| Tags | multi-select | Free labels. |
| Files | files | Attachments. |
| Memories, Facts, Entities | relations from Lore's databases, two-way | Only when memory is in Notion (section 4). |
| Next action | text | The Overview "Next action" line, so a board card shows it. |
| Requirements approved, Design approved, Result approved | text | "YYYY-MM-DD by <name>", or "no". Approvals stay on the work item. |
| Design | select | proposed, approved, superseded, none. |
| Delivery | select | agent-led, owner-led, not-offered. |
| Archived | checkbox | Hidden from the boards. |

Dropped from today's database: Updated (Notion's own last edited time is
enough) and Open owner questions (the Questions and Answers section lists
unanswered questions first, so no count is needed). **To test:** whether Notion shows properties in the order
they were created. The API cannot reorder them; the Notion app can.

### Phases (one row per phase of a parent's plan)

| Property | Type | Notes |
| --- | --- | --- |
| Phase | title | The phase name, for example "Build the form". |
| Phase ID | text | P1, P2, ... Stable: an ID is never reused or renumbered. |
| Order | number | The phase's place in the plan. Reordering changes only this. |
| Work item | relation to Work Items | The parent item whose plan this is. |
| Status | select | Not Started, In Progress, Done, Cancelled. A dropped phase is Cancelled, not deleted. |
| Outcome | text | What the phase establishes. |
| Exit result | text | The evidence that it is complete. |
| Sub-items | relation from Work Items → Phase, two-way | |
| Tasks | relation from Tasks → Phase, two-way | |

A single item with no sub-items still has phases, holding only tasks.
Merging two phases: move their sub-items and tasks to one phase, and set the
other to Cancelled with "Merged into P3" in Exit result.

### Tasks (one row per checklist task)

| Property | Type | Notes |
| --- | --- | --- |
| Task | title | |
| Task ID | text | P1-T01 form, stable. |
| Done | checkbox | Ticked only when "Done when" is met. |
| Status | select | Not Started, In Progress, Done. |
| Work item | relation to Work Items | |
| Phase | relation to Phases | |
| Order | number | Order inside the phase. |
| Work, Deliverable, Done when | text | The template's task fields. |
| Depends on | relation to Tasks, one-way | |

Tasks sit mostly on the lowest-level items, as Mike said, but any item may
have them.

## 3. The templates

### "Project workspace" (a template in the Projects database)

Today's "Project workspace" template holds setup instructions. It becomes
the real thing: a project page with the brief at the top (Outcome, Success
criteria), then the Work Items, Phases, and Tasks databases with their views,
and, in the version with memory, Lore's Memory page with its databases and
the relations of section 4. Two templates, as Mike suggested:

- "Project: work tracking" (Work Items, Phases, Tasks).
- "Project: work tracking and memory" (the same, plus Lore's memory).

A new project is made with the Projects database's New button, or by an
agent duplicating the template page with the Notion connector.
**To test:** that duplicating the page gives the copy its own databases with
the relations between them pointing at the copies, not the template's.

### "Work item" (a template in the Work Items database)

The page, top to bottom:

1. The properties (section 2).
2. **Overview**: Goal, Current position, Next action, Blockers, Related
   items, as in `WORK-ITEM.md` (text).
3. **Roadmap**: a view of Phases where Work item is this page, sorted by
   Order, showing Status, Outcome, Exit result, and Sub-items.
4. **Sub-items**: a board of Work Items where Parent item is this page,
   one column per phase (grouped by Phase, sorted by Phase order), cards
   sorted by Priority, then ID.
5. **Tasks**: a list of Tasks where Work item is this page, grouped by
   Phase, sorted by Order, with the Done box shown.
6. **Recent History**, **Requirements**: text, as in `WORK-ITEM.md`.
7. **Questions and Answers**: a toggle heading (collapsible, as Mike asked)
   holding the table from the approved `WORK-ITEM.md` change: each question
   the agent asks, Mike's answer in his words, the date, and whether it
   decides something. Unanswered rows first. Every decision made while
   working the item is saved here right away. The Overview "Next action"
   names the next open question.
8. **Notes**: text, as in `WORK-ITEM.md`, with a **Sources** list: one line
   per source file attached in the Files property (a meeting transcript or
   document), saying what it is and what was taken from it.
9. **Linked memory**: a view of Memories where Work items contains this
   page, grouped by Kind. Only when memory is also in Notion. It shows
   project-wide decisions and memories that link back to this item; the
   item's own decisions are in its Questions and Answers.
10. **Solution design**: a child page from `DESIGN.md`, titled
    "<ID>: <title> — solution design". It may have its own subpages.

Section order follows the approved `WORK-ITEM.md` order (Overview,
Roadmap, Tasks, Recent History, Requirements, Questions and Answers,
Notes); Sub-items sits with the Roadmap, and Linked memory and Solution
design come last.

Built and checked (2026-09-30): the work item template is a plain page
("Work item template") under the project page, holding the four views
filtered to itself. A work item made with `template_id` set to that page
gets the views filtered to the new item: no Notion database template and no
click in the Notion app are needed.

## 4. Links from memory to work items

Additive only; no Lore property is renamed or removed (`lore-schema.mjs`).
Each link is optional: a memory need not belong to a work item.

| On Lore's database | New column | Other side, on Work Items |
| --- | --- | --- |
| Memories | Work items | Memories |
| Facts | Work items | Facts |
| Entities | Work items | Entities |

- Decisions (Mike, interview, 2026-09-29): a decision made while working an
  item is saved in the item's Questions and Answers. Only a decision that
  matters beyond the item (project-wide or architectural) also becomes a
  Memories row with Kind "decision" (one of Lore's Kind options): one
  sentence plus how to apply it, linked back to the item.
- The agent sets the link when it saves the record (`notion-memory-save`).
- Mixed setups are allowed (`dev/GOAL.md`, "Mixed setups are allowed"):
  onboarding brings in one work tracking set and one memory set separately,
  and the sets do not need to know about each other. Mike's usual choice is
  Notion for both ("I would probably do Notion for both", 2026-09-29).
- Every memory stores the work item's ID, in every setup. The two-way
  relation above exists only when both are in Notion. Local memory with
  Notion work items also stores the item's Notion page link (clickable from
  Obsidian). Notion memory with local, GitHub, or Jira work items stores the
  ID as text, plus the item's web address when it has one (a GitHub issue or
  Jira ticket).

## 5. Views, all with a set order

| Database | View | Type | Grouping and order |
| --- | --- | --- | --- |
| Work Items | Board | board | By Status, columns in status order (Backlog to Cancelled); cards by Priority, then ID; archived hidden. |
| Work Items | By stage | board | By Stage, 01 to 14; open items only; cards by Priority, then ID. |
| Work Items | All items | table | Sub-items nested under parents; by ID. |
| Work Items | Roadmap | table | Grouped by Parent item; rows by Phase order, then ID. No dates. |
| Work Items | Waiting on Mike | table | Waiting on = owner; by Priority. |
| Phases | By item | table | Grouped by Work item; by Order. |
| Tasks | Open tasks | table | Not done; grouped by Work item; by Order. |
| Memories | Decisions | table | Kind = decision (project-wide decisions only); newest first. |
| Memories | By work item | table | Grouped by Work items. |

Facts checked live today (2026-09-29): the API can group a board by status
option and a text property, a table by a relation, and can put a filtered
view of a database inside any page. Setting an order for status columns is a
"manual" sort that follows the status options' order, and the options are
stored in the right order (the on-screen order still needs one look in the
app).

## 6. The Notion skill sets

Onboarding brings in the work set when work is tracked in Notion and the
memory set when memory is in Notion, each on its own (section 4). Each
skill's description says it is for projects that keep that thing in Notion,
so it never competes with the local or GitHub set of the same job
(Hindsight gets no toolkit skills; it uses its own tools). The shared rules (stages, statuses, approval gates, what goes
in memory, citing sources) are not in these skills; they are the same in
every project.

A skill is a folder, not one `SKILL.md` file (Mike, 2026-09-29). Each
Notion skill folder holds:

- `SKILL.md`: the description and the step-by-step procedure, with a
  References table saying when to open each file.
- `references/notion-access.md`: how to reach Notion. `ntn` (Notion's
  official CLI) signs in as Mike with `ntn login` in a browser, through the
  "Notion CLI" connection; the token stays in the macOS keychain. A page is
  reachable only when it is shared with that connection. In Codex, `ntn`
  must run outside the sandbox, because the sandbox blocks the keychain.
  The Notion connector (MCP) signs in through claude.ai and may be missing
  in Codex or a plain terminal session, so `ntn` is the path that always
  works.
- `references/` files with the exact `ntn api` calls for each step (and
  the connector's equivalent), the property list with types and allowed
  values, the view list, and the failure cases (not signed in, page not
  shared, rate limit).
- `assets/`: the templates (the work item page layout, `DESIGN.md`, the
  project page brief) and example records.
- Links to the official pages each step relies on (Notion's API reference
  for the endpoints, and Claude Code's and Codex's skill and hook pages in
  `ai-external-knowledge/`).

The project's Notion page and database links come from `PROJECT.md`.

### Notion work tracking set

| Skill | Purpose |
| --- | --- |
| `notion-work-track` | Create and change work items in Notion: make an item from the template, set its fields, move its stage and status, write its page sections, add phases and tasks, move sub-items and tasks between phases, reorder, merge, or drop phases, tick tasks, add and fill Questions and Answers rows (used by the shared work-refine skill), add comments, attach source files and list them under Sources, and set tags and links. |
| `notion-work-find` | Find work in Notion: an item and its page, the board summary, what waits on Mike, what is next, and a parent's full tree of sub-items, phases, and open tasks for the chat that runs it. |

Setting up a project's Notion workspace is a step in onboarding, with the
calls in `notion-work-track`'s references (and `notion-memory-save`'s for
the memory part), not a skill of its own. In order:

1. Sign in first: `ntn login` (Mike, in a browser). Nothing can be created
   before it.
2. The first time only: the templates exist in Mike's workspace, built
   from the definition below by API (no click in the Notion app).
3. Pick the template for the choice: work only, memory only, or both.
4. Pick the Work Items ID prefix. Notion allows one database per prefix in
   a workspace, so onboarding proposes one from the project key and checks
   it is free.
5. Copy the template and record the links in `PROJECT.md`'s Toolkit
   settings: the project page, each database, the "Current state" page, and
   the ID prefix.

The definition of every database, property (type, allowed values, order),
relation, view (grouping, sorting, filter), and page template is written in
the skills' references, not only in Mike's workspace. Two uses: rebuilding a
deleted or damaged template, and bringing an existing project up to date.
Lore's full property list moves into the `notion-memory-*` references too,
because the `toolkit` program's `lore-schema.mjs` is removed and Lore finds
its databases and columns by exact name. Never rename or remove a Lore
property.

"Bring this project's Notion workspace up to the current template" is a
step in `notion-work-track` (and `notion-memory-save` for Lore's databases),
run by onboarding's "update the toolkit". Copying newer skill files changes
nothing in Notion, so this step compares the project's databases with the
definition and adds what is missing: properties, options, relations, and
views. It never removes or renames anything, and it reports what it added.

The shared work skills (requirements, solution design, work-on, check,
finish, decide, organize) say "the item's phases" and "the item's tasks",
never "the Tasks section", and use the chosen set for every read and write.

### Notion memory set

| Skill | Purpose |
| --- | --- |
| `notion-memory-save` | Save a memory, fact, entity, or decision in Lore's layout in Notion, with the approval step, and link it to the work items it relates to (optional). |
| `notion-memory-find` | Find what is remembered in Notion, including by work item ("the decisions for WI-003"), and cite each source. |
| `notion-memory-refine` | Refine Notion memory: merge, supersede, retire, fix broken work item links, and clean old entries out of the "Current state" page. (Mike named the memory skill memory-refine, 2026-09-29.) |

What goes in memory, the record format, and the citing rules are the shared
memory rules (the main session's part). This set holds only how to store
and find them in Lore's layout.

### Hooks each set brings

The same moments as the local sets, in the Notion versions:

| Moment | Set | What it does |
| --- | --- | --- |
| Session starts | memory | Loads the current state from the Notion "Current state" page (renamed from "Current focus", Mike 2026-09-29; one `ntn` read of the page named in `PROJECT.md`). |
| Session starts | work | Adds one line pointing to `notion-work-find` for where work stands. No Notion read, so the start stays fast. |
| End of the agent's reply | memory | Checks once for a decision or fact to save (`notion-memory-save`). |
| End of the agent's reply | work | Checks once for a work item that changed and was not updated (`notion-work-track`). |

If the Notion read at session start fails (no sign-in, no network), the
hook says so in one line and the session goes on.

## 7. What changes from today's build

- The code on branch `worktree-notion-work-tracker` (phases copied from
  text, views and columns built by the `toolkit` program) is not used. It
  stays only as a record of what Notion's API can do. The sample projects
  "Toolkit V2 sample (safe to delete)" and "Notion tracker sample (safe to
  delete)" show the old text-based model; they are deleted only with
  Mike's yes. The new templates replace today's "Project workspace" page.
- Approval gates (requirements, design, and result approvals) become
  shared rules. Done (Mike, 2026-09-29): Mike can mark an item Done
  himself, in Notion or by telling the agent; the agent never sets Done on
  its own, it asks him first and records his answer as the result approval.
  Notion cannot stop a property change, so this is a rule, not a lock.

## 8. To test before building

1. Properties show on the page in the order they were created.
2. Duplicating the project template gives the copy its own databases, with
   relations and filtered views pointing at the copies.
3. A database template's "this page" filters work for Roadmap, Sub-items,
   Tasks, and Linked memory in each new work item.
4. The status board's columns show in status order in the app.
5. A rollup of Phase → Order can sort the Sub-items board and the Roadmap.
6. The Notion connector's availability in Codex, and the `ntn` calls each
   skill needs.
7. The session-start hook's `ntn` read in Codex: the Codex sandbox blocks
   the keychain, so the hook command must run outside it, or the one-line
   failure is accepted.
8. Bringing an existing project up to date after the template gains a
   property and a view: both are added, nothing else changes.

Tests run in the private Notion test area, or as a "safe to delete" sample
under AI Agent Second Brain only with Mike's yes.

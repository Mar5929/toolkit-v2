# Setting up and updating a project's Notion work tracking

Purpose: the Notion steps onboarding runs for a new project, the one-time
build of the templates, bringing an older project up to the current
template, and rebuilding a damaged template. `database-layout.md` and the
`assets/schema/` files are in the Notion `tracking-work-items` skill,
`assets/.skill-sets/notion-work/tracking-work-items/` in this skill.
`ntn-commands.md` is in the `using-notion-cli` skill,
`assets/.skill-sets/notion-tools/using-notion-cli/references/` in this skill;
running `ntn` in Codex is in that skill's `SKILL.md`. The other files named
here are in this folder.

## Contents

- Where the templates live
- A new project
- Recording the links in PROJECT.md
- Bringing a project up to the current template
- From Stage to State
- Building the templates (first time, or a damaged one)
- Checks after any of these

## Where the templates live

The templates are Notion database templates
(https://www.notion.com/help/database-templates), so a page the owner makes
with "New" in Notion is the same as one the agent makes. The owner's
Projects database holds three:

| Projects database template | Use when |
| --- | --- |
| "Project: work and memory" (the default) | Work items and memory both in Notion (the owner's usual choice). |
| "Project: work only" | Work items in Notion, memory local or in Hindsight. |
| "Project: memory only" | Memory in Notion, work items local or on GitHub (`setup.md`). |

Inside "Project: work and memory" and "Project: work only", the Work Items
database has one template, set as its default: the work item template. Its
title is empty, so the title the owner types on a card is kept. Every
project made from these templates has this template, still set as the
default.

List a database's templates (`ntn-commands.md`, "Database templates"):

```bash
ntn api v1/data_sources/<projects-data-source-id>/templates < /dev/null | jq -r '.templates[] | "\(.id)\t\(.is_default)\t\(.name)"'
```

If the Projects database lacks any of the three, build the missing ones
first ("Building the templates" below; ask for the clicks in its step 1
only for the templates that are missing). Never add real work to a template: a copy
takes everything on the template with it.

## A new project

Before anything: the owner has signed in (`ntn login`) and shared, with
the "Notion CLI" connection, the top-level Notion page his projects go
under (`ntn-commands.md`, "Access and sign-in").

1. **Pick the template** from the table above, from the owner's two setup
   answers, and take its id from the templates list. Then check it is
   current: find the template's Work Items database (list the template
   page's children, as in step 4 below), list that database's templates,
   and read the default one
   (`ntn api v1/pages/<id>/markdown < /dev/null | jq -r .markdown`).
   Compare its Overview and Notes with `work-item-page.md`. When
   it lacks a section, bring the templates up to date first ("Bringing a
   project up to the current template", steps 4 and 5), after the owner's
   yes, then copy.
2. **Pick the ID prefix.** Propose one from the project name (two to four
   capital letters, for example "IML" for "iOS money log") and ask the
   owner. Notion allows each prefix in only one database of the workspace;
   if setting it fails with a conflict, propose another.
3. **Make the project page from the template**, as a row of the owner's
   Projects database (title property "Project"):

   ```bash
   ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<projects-data-source-id>"},
     "properties":{"Project":{"title":[{"text":{"content":"<Project name>"}}]}},
     "template":{"type":"template_id","template_id":"<projects-template-id>"}}' < /dev/null | jq -r '.id, .url'
   ```

   The templates live in the Projects database, so every project is a row
   of it. If the owner has no Projects database, stop, tell him a Notion
   project needs a Projects database, and ask him to make one in Notion.
4. **Wait** until the copy is filled (`ntn-commands.md`, "Waiting for a
   template"): the page lists Work Items, Phases, and Tasks (plus
   Memory, Current state, and Terminology glossary with memory).

   ```bash
   ntn api v1/blocks/<project-page-id>/children page_size==100 < /dev/null | jq -r '.results[] | select(.type=="child_database" or .type=="child_page") | [.type, .id, (.child_database.title // .child_page.title)] | @tsv'
   ```
5. **Read each database's data source id:**

   ```bash
   ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
   ```
6. **Set the ID prefix.** A copy starts with none:

   ```bash
   ntn api v1/data_sources/<work-items-data-source-id> -X PATCH -d '{"properties":{"ID":{"unique_id":{"prefix":"<PREFIX>"}}}}' < /dev/null | jq -c '.properties.ID.unique_id'
   ```
7. With memory in Notion, run "A new project" in `setup.md` (the Lore
   project row and the Current state page link).
8. **Record the links** in `PROJECT.md` (next section) and read them back.

## Recording the links in PROJECT.md

`PROJECT.md`, section "Toolkit settings", gets a "Notion" block the skills
read every time:

```markdown
### Notion
- Project page: <url>
- ID prefix: <PREFIX>
- Work Items: database <id>, data source <id>
- Phases: database <id>, data source <id>
- Tasks: database <id>, data source <id>
- Projects database: data source <id>
```

`setup.md` adds the memory lines (Memory
page, each Lore database, Current state, Terminology glossary, Lore project
row).

## Bringing a project up to the current template

Onboarding's "update the toolkit" runs this. Copying newer skill files
changes nothing in Notion, so compare the project with the `assets/schema/`
files and `work-layout.md` and add only what is missing. Never remove, rename, or retype anything; the
owner may have added his own columns and views, and they stay.

1. **Properties.** For each database, list what it has:

   ```bash
   ntn api v1/data_sources/<data-source-id> < /dev/null | jq -r '.properties | to_entries[] | "\(.key)\t\(.value.type)"'
   ```

   For each property in the `assets/schema/` files (01 to 03) that is
   missing, send its spec from the matching file, alone:

   ```bash
   ntn api v1/data_sources/<data-source-id> -X PATCH -d '{"properties":{"<Name>": <spec from the asset>}}' < /dev/null
   ```

   A property with the right name but another type: leave it and tell the
   owner. A select or status missing an option: add the option to a select
   by sending all existing options plus the new one; a status option can
   only be added in the Notion app (tell the owner). A project with a
   Stage property: "From Stage to State" below, after this step.
2. **Relations and the rollup**, the same way, from files 04 to 07b.
3. **Views.** List their ids, then read each one's name, one call per id:

   ```bash
   ntn api v1/views database_id==<database-id> < /dev/null | jq -r '.results[].id'
   ntn api v1/views/<view-id> < /dev/null | jq -r '.name'
   ```

   Create each missing view from its asset (fill the placeholders first).
   Each view named Board, By state, All items, Roadmap, Waiting on Mike, or
   Top-level items (files 10, 11, 12, 13, 14, and 17) whose filter lacks
   `{"property":"title","title":{"is_not_empty":true}}` gets it: read the
   view's filter (`ntn api v1/views/<id> < /dev/null | jq -c .filter`), then
   send `PATCH v1/views/<id>` with only `filter`:
   `{"and":[<its conditions>,{"property":"title","title":{"is_not_empty":true}}]}`,
   where <its conditions> are the items of its "and" list, or its one
   condition. Its grouping and sub-items stay. Leave the owner's own views
   as they are.
   A table view whose columns are out of the order in `work-layout.md` gets
   the column order (template build, step 7). The API cannot read
   the page layout: when the owner says a project's pages show properties
   in the wrong order or the wrong sections, give him the layout clicks in
   `work-layout.md`, "Property order and page layout".
   "All phases" and "All tasks" have no asset; when one is missing, send
   `{"database_id":"<id>","data_source_id":"<id>","name":"All phases","type":"table","sorts":[{"property":"Order","direction":"ascending"}]}`
   (or "All tasks") as `POST v1/views`.
4. **The work item template**: the default template of the project's Work
   Items database (its id from the templates list). A project made from the
   older template pages has a plain "Work item template" page and no
   database template. For that project: ask the owner for the clicks in
   "Building the templates", step 9, in the project's Work Items database;
   then fill the new template as the opening paragraph of "Building the
   templates" and its steps 9 and 10 say (text, then views). Tell the owner
   the plain page is no longer used and he may delete it. Then compare the
   template's sections with `work-item-page.md` and add a missing
   section or view the same way the template build does. Items made
   earlier keep their pages; add a missing section to one only when you
   next change that item.
5. **The project templates** in the Projects database. Its data source id
   is on the "Projects database" line of the Notion block in `PROJECT.md`.
   When the block has none (an older project), read it from the project
   page's parent (`ntn api v1/pages/<project-page-id> < /dev/null | jq -r .parent.data_source_id`),
   add the line `- Projects database: data source <id>`, and remove the
   block's "Work item template page" and "Templates page" lines. When the
   parent is a page, ask the owner which Projects database holds the
   templates. Then bring the three templates up to date the same way, so
   new projects start current.
6. Tell the owner in one short list what was added, and to which project.

## From Stage to State

A project set up before toolkit 0.6.0 has a Stage property and the Status
options Backlog, Ready, In Progress, In Review, Done, and Cancelled. Run
this after step 1 above has added the State property.

1. Add the Status options Not Started (To-do), Preparing (In progress), and
   Blocked (In progress) to the project's Work Items database in one
   change (for example one `PATCH v1/data_sources/<work-items-data-source-id>`
   call). Changing the Status options replaces the whole list, so send every
   option the database has now plus the new ones, each with its group
   (`database-layout.md`).
2. Set each work item's State and Status as `update.md`, "Work items from
   Stage to State", says (`database-layout.md`, "Setting State and
   Status").
3. In each work item template (step 4 above, and the two project templates
   that track work), replace the Next action prompt with the one in
   `work-item-page.md`, with one `update_content` call.
4. Step 3 above adds the "By state" view. The Stage property, the "By
   stage" view, and the Status options Backlog, Ready, and In Review stay:
   never remove them. Tell the owner he may delete them himself in Notion
   once no item uses them.

## Building the templates (first time, or a damaged one)

The API cannot make a database template or set the default one
(https://developers.notion.com/guides/data-apis/creating-pages-from-templates),
so the owner makes each one empty with a few clicks, and the agent fills
it. Never fill a template with `template_id`: that turns it into a row
that shows on the owner's boards. Keep the ids you get in a file in a scratch
folder (`ntn-commands.md`, "Sending a body", says how to make
one; never in the project); the bodies need them. Remove the folder when
the templates are built.

1. Ask the owner for these clicks in his Projects database, and wait until
   he says they are done: the arrow beside "New" → "+ New template" → title
   "Project: work and memory" → close it. The same for "Project: work only"
   and "Project: memory only". Then the arrow beside "New" → "…" beside
   "Project: work and memory" → "Set as default" → "All views". Read the three ids from
   the templates list. Write the text into each (the page is empty, so
   `replace_content` is safe here):
   `ntn api v1/pages/<template-id>/markdown -X PATCH -d @body.json < /dev/null`
   with `{"type":"replace_content","replace_content":{"new_str":"<text of project-page.md>"}}`
   (for "Project: memory only", `project-page-memory-only.md`). The steps below use the
   template's id as `{{PROJECT_PAGE_ID}}`.
2. The three databases, in order, from `assets/schema/01…03`, with
   `{{PROJECT_PAGE_ID}}` the new page. The ID property has no prefix in a
   template (the asset says `null`); each project sets its own after the
   copy.
3. Their data source ids (`jq '.data_sources[0].id'` on each answer).
4. The relations and rollup: files 04, 05, 06, then 07, then 07b.
5. Property ids for each database (`ntn-commands.md`, "Filling a body from an
   asset").
6. Views: files 10, 11, 13, 14, 17, 15, 16 as `POST v1/views`. Then rename each
   database's first view: Work Items' to "All items" with the body of 12
   (send only `name`, `filter`, `sorts`, `configuration` as
   `PATCH v1/views/<id>`), Phases' to "All phases", Tasks' to "All tasks"
   (sorted by Order).
7. Column order: for each table view (All items, Roadmap, Waiting on Mike,
   Top-level items, By item, All phases, Open tasks, All tasks), send
   `PATCH v1/views/<id>` with only
   `{"configuration":{"type":"table","properties":[…]}}`: every property of
   the database in the order of `work-layout.md`, "Property order and page
   layout", each `{"property_id":"<id>","visible":true|false}`. "All phases"
   and "All tasks" show every property except the hidden ones; the other
   views keep their own columns on. Grouping and nested sub-items are kept.
   With memory, run this step after step 8, once the Memories, Facts, and
   Entities columns exist on Work Items.
8. With memory: `setup.md`, "Building
   the memory part of a template" (its Memory page, Lore's databases, their links to Work Items, Current state,
   Terminology glossary).
9. The work item template. Ask the owner for these clicks in the
   Work Items database of the project template you are building, and wait until he says they are done:
   the arrow beside "New" → "+ New template" → leave the title empty →
   close it; then the arrow beside "New" → "…" beside the new template
   (it shows as "New page") → "Set as default" → "All views". The title
   must stay empty: a template's title is put in front of every title the
   owner types on a card. Read its id: the template with `is_default`
   true in the Work Items templates list. Write `work-item-page.md`
   into it with `replace_content` (the page is empty), without its "Linked
   memory" section when there is no memory in Notion.
10. Its views: read its blocks, and for each of Roadmap, Sub-items, Tasks
    (and Linked memory) take the id of the paragraph just under the heading
    as `{{AFTER_BLOCK_ID}}`, `{{ITEM_PAGE_ID}}` the work item template's id, and send
    files 20 to 23 as `POST v1/views`. Each answer's `parent.database_id` is
    a new linked database, titled "Untitled"; name it:

    ```bash
    ntn api v1/databases/<new-database-id> -X PATCH -d '{"title":[{"type":"text","text":{"content":"Phases"}}]}' < /dev/null
    ```

    (Sub-items, Tasks, Linked memory for the others.)
11. Check the template (next section). Then the page layout of Work Items,
    Phases, and Tasks, which only the Notion app can set, once per
    template (every copy keeps it): ask the owner to set it, give him the
    clicks from `work-layout.md`, "Property order and page layout", one
    database at a time, and wait until he says it is done. Never set the
    page layout yourself unless the owner names the Notion page as his
    private test area and says you may use his signed-in Chrome. Tell the
    owner the template's link.

## Checks after any of these

- `ntn api v1/pages/<page-id>/markdown < /dev/null | jq -r .markdown` on
  the work item template shows four `<database …>` lines (three without
  memory), one under each section heading, and its title is empty.
- No row of the Projects database is a template. List the rows
  (`ntn api v1/data_sources/<projects-data-source-id>/query -d '{"page_size":100}' < /dev/null | jq -r '.results[].id'`;
  `ntn-commands.md`, "Finding rows") and the templates
  (`ntn api v1/data_sources/<projects-data-source-id>/templates < /dev/null | jq -r '.templates[].id'`).
  No row may have a template's id: a template that comes back as a row
  shows as a card on the owner's board.
- Only after building or rebuilding the templates, and only after the
  owner's yes (never for a new project): make a throwaway project from the
  template (named "… (safe to delete)"), make one item in it
  (`database-layout.md`, "Creating an item"), and check the item's page shows its own views. Never
  test inside a template: a copy would take the test item with it.
- A new project: the project page lists Work Items, Phases, and Tasks
  (plus Memory, Current state, and Terminology glossary with memory in
  Notion); its Work Items templates list shows one template with
  `is_default` true; the ID property shows the project's prefix; and the
  relations check below.
- Each database's relations point at the same project's databases:
  `ntn api v1/data_sources/<id> < /dev/null | jq '.properties | map_values(select(.type=="relation") | .relation.data_source_id)'`.

# Setting up and updating a Notion project and its work tracking

Purpose: the Notion steps onboarding runs for every new Notion project,
adding work items or memory to a Notion project later, the one-time build
of the template, bringing an older project up to the current template, and
rebuilding a damaged template. `database-layout.md` and the
`assets/schema/` files are in the Notion `tracking-work-items` skill,
`assets/.skill-sets/notion-work/tracking-work-items/` in this skill.
`ntn-commands.md` is in the `using-notion-cli` skill,
`assets/.skill-sets/notion-tools/using-notion-cli/references/` in this skill;
running `ntn` in Codex is in that skill's `SKILL.md`. The other files named
here are in this folder.

## Contents

- Where the templates live
- A new project
- Removing the part a project keeps elsewhere
- Recording the links in PROJECT.md
- Adding work items or memory later
- Bringing a project up to the current template
- From Stage to State
- Building the templates (first time, or a damaged one)
- Checks after any of these

## Where the templates live

The templates are Notion database templates
(https://www.notion.com/help/database-templates), so a page the owner makes
with "New" in Notion is the same as one the agent makes. The owner's
Projects database holds one, "Project", set as its default. It holds both
parts: the work items part (Work Items, Phases, Tasks) and the memory part
(Memory, Current state, Terminology glossary). Every project is made from
it, then has the part it keeps elsewhere removed.

Inside "Project", the Work Items database has one template, set as its
default: the work item template. Its title is empty, so the title the
owner types on a card is kept, and the boards' empty-title filter hides
it. Every project made from
"Project" has this template, still set as the default.

List a database's templates (`ntn-commands.md`, "Database templates"):

```bash
ntn api v1/data_sources/<projects-data-source-id>/templates < /dev/null | jq -r '.templates[] | "\(.id)\t\(.is_default)\t\(.name)"'
```

The list also shows templates that are in Notion's trash. Before you use
one, check `ntn api v1/pages/<template-id> < /dev/null | jq .in_trash` is
`false`. A template in the trash cannot be used, and New makes blank
cards while the work item template is there. Never restore a template
through the API (`in_trash` false): Notion's documentation does not say it
comes back as a template, and on 2026-10-02 one restored that way did not
give the owner a working template. Ask the owner to restore it from Trash
in the Notion app, then run "Checks after any of these". When a check
fails, build a new one ("Building the templates": steps 1 to 13 for
"Project", steps 11 to 13 for the work item template).

If the Projects database has no "Project", not even in the trash, build
it first ("Building the templates" below). Never add real work to a template: a copy takes
everything on the template with it.

## A new project

Before anything: the owner has signed in (`ntn login`) and shared, with
the "Notion CLI" connection, the top-level Notion page his projects go
under (`ntn-commands.md`, "Access and sign-in").

1. **Take the template's id:** "Project" in the templates list, not in
   the trash ("Where the templates live"). With work items in Notion, check
   it is current: find its Work Items database (list the template page's
   children, as in step 4 below), list that database's templates, and read
   the default one
   (`ntn api v1/pages/<id>/markdown < /dev/null | jq -r .markdown`).
   Compare its Overview and Notes with `work-item-page.md`. When it lacks a
   section, bring the template up to date first ("Bringing a project up to
   the current template", steps 4 and 5), after the owner's yes, then copy.
2. **Pick the ID prefix** (work items in Notion). Propose one from the
   project name (two to four capital letters, for example "IML" for "iOS
   money log") and ask the owner. Notion allows each prefix in only one
   database of the workspace; if setting it fails with a conflict, propose
   another.
3. **Make the project page from the template**, as a row of the owner's
   Projects database (title property "Project"):

   ```bash
   ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<projects-data-source-id>"},
     "properties":{"Project":{"title":[{"text":{"content":"<Project name>"}}]}},
     "template":{"type":"template_id","template_id":"<projects-template-id>"}}' < /dev/null | jq -r '.id, .url'
   ```

   The template lives in the Projects database, so every project is a row
   of it. If the owner has no Projects database, stop, tell him a Notion
   project needs a Projects database, and ask him to make one in Notion.
4. **Wait** until the copy is filled (`ntn-commands.md`, "Waiting for a
   template"): the page lists Memory, Current state, Terminology glossary,
   Work Items, Phases, and Tasks.

   ```bash
   ntn api v1/blocks/<project-page-id>/children page_size==100 < /dev/null | jq -r '.results[] | select(.type=="child_database" or .type=="child_page") | [.type, .id, (.child_database.title // .child_page.title)] | @tsv'
   ```
5. **Read each database's data source id**, for Work Items, Phases, and
   Tasks, and for Memories, Facts, and Entities on the Memory page
   (`setup.md`, "A new project", step 1):

   ```bash
   ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
   ```
6. **Remove the part this project keeps elsewhere** (next section). Skip
   this step when work items and memory are both in Notion.
7. **Set the ID prefix** (work items in Notion). A copy starts with none:

   ```bash
   ntn api v1/data_sources/<work-items-data-source-id> -X PATCH -d '{"properties":{"ID":{"unique_id":{"prefix":"<PREFIX>"}}}}' < /dev/null | jq -c '.properties.ID.unique_id'
   ```
8. With memory in Notion, run `setup.md`, "A new project", steps 2 and 4
   (the Lore project row and the Current state page).
9. **Fill the project row.** In Notion, fill every field of the project's
   row that the setup answers cover (such as Tracker, Memory system, Local
   path, Repository, Salesforce, and Set up on), and ask the owner, in one
   question, only for the ones only he knows (such as Priority and Target
   Date). "Key" holds the project's work item ID prefix, wherever its work
items are (for example TKV, or WI for local work items).
   "Work items data source" and "Memory data source" hold the data source
   ids of this project's Work Items and Memories databases, when they are
   in Notion. `finishing.md` fills Desired Outcome.
10. **Record the links** in `PROJECT.md` ("Recording the links in
    PROJECT.md" below, with the memory lines in `setup.md`) and read them
    back.

## Removing the part a project keeps elsewhere

Run this only on a page, or databases, copied from the template in this
run, before anything is saved in them. List the page's blocks with their ids:

```bash
ntn api v1/blocks/<page-id>/children page_size==100 < /dev/null | jq -r '.results[] | [.type, .id, (.child_database.title // .child_page.title // ((.[.type].rich_text // []) | map(.plain_text) | join("")))] | @tsv'
```

Remove a block with `ntn api v1/blocks/<block-id> -X DELETE < /dev/null`.
It goes to Notion's trash; a page or database goes with everything in it.

**Memory kept locally or in Hindsight:**

1. On the project page, remove the "Project Memory" heading and the
   Memory, Current state, and Terminology glossary pages.
2. Remove the Work Items columns that linked to them:
   `PATCH v1/data_sources/<work-items-data-source-id>` with
   `{"properties":{"Memories":null,"Facts":null,"Entities":null}}`.
3. In the project's work item template (the default template of its Work
   Items database), remove the "Linked memory" heading, the paragraph under
   it, and the view under that.

**Work items kept locally or on GitHub:**

1. On the project page, remove the "Work" heading, the paragraph under it,
   and the Work Items, Phases, and Tasks databases.
2. Remove the memory columns that linked to them:
   `{"properties":{"Work items":null}}` as
   `PATCH v1/data_sources/<id>` on each of Memories, Facts, and Entities.
3. The Memories view "By work item" grouped by that column. Remove it
   (`ntn api v1/views/<view-id> -X DELETE < /dev/null`; the view ids as in
   "Bringing a project up to the current template", step 3), then create
   `12-view-by-work-item-ids.json` as `POST v1/views`, without its `note`
   key, and give it the column order (`setup.md`, "Building the memory part
   of a template", step 7).

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

Without work items in Notion, leave out the ID prefix, Work Items, Phases,
and Tasks lines. `setup.md` adds the memory lines (Memory page, each Lore
database, Current state, Terminology glossary, Lore project row).

## Adding work items or memory later

`update.md`, "Changing a setup choice", runs this when a project has work
items or memory in Notion and adds the other one. Notion can move a page
(`ntn api v1/pages/<page-id>/move -d '{"parent":{"type":"page_id","page_id":"<new-parent-id>"}}' < /dev/null`),
but not a database. So the three memory pages move, and the work databases
stay on the page that holds them. A moved page keeps its id.

**Memory into Notion** (the project page holds the work items):

1. Make a temporary row from "Project" ("A new project", steps 3 and 4),
   titled "<Project name> (temporary, safe to delete)".
2. Add a "Project Memory" heading at the end of the project page
   (`PATCH v1/blocks/<project-page-id>/children` with one `heading_1`
   block), then move the temporary page's Memory, Current state, and
   Terminology glossary pages to the project page.
3. Move the temporary row to the trash
   (`PATCH v1/pages/<id>` with `{"in_trash":true}`).
4. Run `setup.md`, "A new project".
5. The moved Memories, Facts, and Entities still link to the temporary
   Work Items: remove their "Work items" column and the Memories view "By
   work item" ("Removing the part a project keeps elsewhere", work items,
   steps 2 and 3, without creating the new view).
6. Run `setup.md`, "Bringing memory up to the current layout", step 3,
   and fill the row's memory fields ("A new project", step 9).

**Work items into Notion** (the project page holds the memory):

1. Make a new project page from "Project" ("A new project", steps 1 to
   7), and run step 6 for the memory part although memory is also in
   Notion.
2. Copy the old page's Project brief text into the new page with one
   `update_content` call.
3. Add a "Project Memory" heading at the end of the new page, then move
   the old page's Memory, Current state, and Terminology glossary pages to
   it.
4. Run `setup.md`, "Bringing memory up to the current layout", step 3.
5. Copy the old row's field values into the new row, then fill its work
   fields ("A new project", step 9). Change the Project page line and add
   the work lines in `PROJECT.md`'s Notion block.
6. The old row now holds only its brief: move it to the trash after the
   owner's yes.

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

   After adding the Tasks Status property, set each task's Status from Done
   (`database-layout.md`, "Phases and tasks").

   A property with the right name but another type: leave it and tell the
   owner. A select or status missing an option: send every option it has
   now plus the new one (`database-layout.md`). A project with a
   Stage property: "From Stage to State" below, after this step.
2. **Relations and the rollup**, the same way, from files 04 to 07b.
3. **Views.** List their ids, then read each one's name, one call per id:

   ```bash
   ntn api v1/views database_id==<database-id> < /dev/null | jq -r '.results[].id'
   ntn api v1/views/<view-id> < /dev/null | jq -r '.name'
   ```

   Create each missing view from its asset (fill the placeholders first).
   Each view named Board, By state, All items, Roadmap, Waiting on Mike,
   Top-level items, or By project phase (files 10 to 14, 17, and 18) whose
   filter lacks
   `{"property":"title","title":{"is_not_empty":true}}` gets it: read the
   view's filter (`ntn api v1/views/<id> < /dev/null | jq -c .filter`), then
   send `PATCH v1/views/<id>` with only `filter`:
   `{"and":[<its conditions>,{"property":"title","title":{"is_not_empty":true}}]}`,
   where <its conditions> are the items of its "and" list, or its one
   condition. Its grouping and sub-items stay. Leave the owner's own views
   as they are.
   A table view whose columns are out of the order in `work-layout.md` gets
   the column order (template build, step 10). When a view made from an asset
   hides a column that the asset now shows, show that column in the same
   `PATCH v1/views/<id>`. The API cannot read
   the page layout: when the owner says a project's pages show properties
   in the wrong order or the wrong sections, give him the layout clicks in
   `work-layout.md`, "Property order and page layout".
   "All phases" and "All tasks" have no asset; when one is missing, send
   `{"database_id":"<id>","data_source_id":"<id>","name":"All phases","type":"table","sorts":[{"property":"Order","direction":"ascending"}]}`
   (or "All tasks") as `POST v1/views`.
   Then the project page's text: when the paragraph under its `# Work`
   heading differs from `project-page.md`, replace that paragraph with one
   `update_content` call.
4. **The work item template**: the default template of the project's Work
   Items database (its id from the templates list). A project made from the
   older template pages has a plain "Work item template" page and no
   database template. For that project: ask the owner for the clicks in
   "Building the templates", step 11, in the project's Work Items database;
   then fill the new template as the opening paragraph of "Building the
   templates" and its steps 11 and 12 say (text, then views). Tell the owner
   the plain page is no longer used and he may delete it. Then compare the
   template's sections with `work-item-page.md` and add a missing
   section or view the same way the template build does; skip "Linked
   memory" in a project without Notion memory. Replace, with one
   `update_content` call, each guide paragraph under Roadmap, Sub-items,
   and Tasks, and the Related items prompt, that differs from
   `work-item-page.md`; the owner's own text elsewhere stays. Do the same for the
   columns of the template's Tasks view (file 22). Items made earlier keep
   their own Tasks view; turn its new columns on only when you next change
   that item. Items made
   earlier keep their pages; add a missing section to one only when you
   next change that item.
5. **The "Project" template** in the Projects database. Its data source id
   is on the "Projects database" line of the Notion block in `PROJECT.md`.
   When the block has none (an older project), read it from the project
   page's parent (`ntn api v1/pages/<project-page-id> < /dev/null | jq -r .parent.data_source_id`),
   add the line `- Projects database: data source <id>`, and remove the
   block's "Work item template page" and "Templates page" lines. When the
   parent is a page, ask the owner which Projects database holds the
   template. Then bring "Project" up to date the same way, its memory part
   too (`setup.md`, "Bringing memory up to the current layout"), so new
   projects start current.
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
3. In each work item template (step 4 above, and the one in "Project"),
   replace the Next action prompt with the one in
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
   "Project" → close it. Then the arrow beside "New" → "…" beside
   "Project" → "Set as default" → "All views". Read its id from the
   templates list (not in the trash). Write the lines of `project-page.md`
   above `# Work` into it (the page is empty, so `replace_content` is safe here):
   `ntn api v1/pages/<template-id>/markdown -X PATCH -d @body.json < /dev/null`
   with `{"type":"replace_content","replace_content":{"new_str":"<those lines>"}}`.
   The steps below use the template's id as `{{PROJECT_PAGE_ID}}`. Pages
   and databases made under it go at the end of the page, so this order
   puts each under its heading.
2. `setup.md`, "Building the memory part of a template", steps 1 to 4:
   the Memory page with Lore's databases, Current state, and Terminology
   glossary.
3. The last two lines of `project-page.md` (the `# Work` heading and its
   paragraph) at the end of the page:
   `{"type":"insert_content","insert_content":{"content":"<those lines>"}}`
   on the same markdown call.
4. The three databases, in order, from `assets/schema/01…03`, with
   `{{PROJECT_PAGE_ID}}` the template. The ID property has no prefix in a
   template (the asset says `null`); each project sets its own after the
   copy.
5. Their data source ids (`jq '.data_sources[0].id'` on each answer).
6. The relations and rollup: files 04, 05, 06, then 07, then 07b.
7. Property ids for each database (`ntn-commands.md`, "Filling a body from an
   asset").
8. Views: files 10, 11, 13, 14, 17, 15, 16 as `POST v1/views`. Then rename each
   database's first view: Work Items' to "All items" with the body of 12
   (send only `name`, `filter`, `sorts`, `configuration` as
   `PATCH v1/views/<id>`), Phases' to "All phases", Tasks' to "All tasks"
   (sorted by Order). Then files 18, 19, and 19b, in that order: 19 and
   19b go first in their databases, so the project page shows the
   project's phases and tasks.
9. `setup.md`, "Building the memory part of a template", steps 5 to 7:
   the links between the memory databases and Work Items, the Memories
   views, and their column order.
10. Column order: for each table view (All items, Roadmap, Waiting on Mike,
    Top-level items, Project phases, By item, All phases, Project tasks,
    Open tasks, All tasks), send
    `PATCH v1/views/<id>` with only
    `{"configuration":{"type":"table","properties":[…]}}`: every property of
    the database in the order of `work-layout.md`, "Property order and page
    layout", each `{"property_id":"<id>","visible":true|false}`. "All phases"
    and "All tasks" show every property except the hidden ones; the other
    views keep their own columns on. Grouping and nested sub-items are kept.
11. The work item template. Ask the owner for these clicks in the
    Work Items database of "Project", and wait until he says they are done:
    the arrow beside "New" → "+ New template" → leave the title empty →
    close it; then the arrow beside "New" → "…" beside the new template
    (it shows as "New page") → "Set as default" → "All views". The title
    must stay empty: a template's title is put in front of every title the
    owner types on a card. Read its id: the template in the Work Items
    templates list with `is_default` true and not in the trash. When its
    page is empty, write `work-item-page.md` into it with
    `replace_content`; when this rebuilds a damaged template, tell the
    owner that sections he added himself in the Notion app are not in the
    file, so he adds them again. When the owner already pasted his text
    into it, write nothing: compare its section headings with
    `work-item-page.md` and tell him which are missing.
12. Its views. First, the owner may have pasted views in from another
    page; each keeps a filter that names that page. For each
    `<database …>` line in the template's text, read its view's filter
    (`ntn api v1/views database_id==<id> < /dev/null`, then
    `ntn api v1/views/<view-id> < /dev/null | jq .filter`). When the
    filter names a page other than this template, delete that view's block
    (`ntn api v1/blocks/<id> -X DELETE < /dev/null`, with the block id from
    the template's children list, as in "Removing the part a project keeps
    elsewhere"). These are views
    inside the template, never the Work Items, Phases, or Tasks databases.
    Then read its blocks, and for each of Roadmap, Sub-items, Tasks,
    and Linked memory take the id of the paragraph just under the heading
    as `{{AFTER_BLOCK_ID}}`, `{{ITEM_PAGE_ID}}` the work item template's id, and send
    files 20 to 23 as `POST v1/views`. Each answer's `parent.database_id` is
    a new linked database, titled "Untitled"; name it:

    ```bash
    ntn api v1/databases/<new-database-id> -X PATCH -d '{"title":[{"type":"text","text":{"content":"Phases"}}]}' < /dev/null
    ```

    (Sub-items, Tasks, Linked memory for the others.)
13. Check the template (next section). Then the page layout of Work Items,
    Phases, and Tasks, which only the Notion app can set, once per
    template (every copy keeps it): ask the owner to set it, give him the
    clicks from `work-layout.md`, "Property order and page layout", one
    database at a time, and wait until he says it is done. Never set the
    page layout yourself unless the owner names the Notion page as his
    private test area and says you may use his signed-in Chrome. Tell the
    owner the template's link.

## Checks after any of these

- `ntn api v1/pages/<page-id>/markdown < /dev/null | jq -r .markdown` on
  the work item template shows four `<database …>` lines (three in a
  project without Notion memory), one under each section heading, and its
  title is empty.
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
- A new project: the project page lists only the parts it keeps in
  Notion (Work Items, Phases, and Tasks; Memory, Current state, and
  Terminology glossary); with work items, its Work Items templates list
  shows one template with `is_default` true, the ID property shows the
  project's prefix, and the relations check below passes.
- Each database's relations point at the same project's databases:
  `ntn api v1/data_sources/<id> < /dev/null | jq '.properties | map_values(select(.type=="relation") | .relation.data_source_id)'`.

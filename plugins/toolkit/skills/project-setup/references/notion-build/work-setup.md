# Setting up and updating a Notion project and its work tracking

Purpose: the Notion steps onboarding runs for every new Notion project,
adding work items or memory to a Notion project later, the one-time build
of the template, bringing an older project up to the current template, and
rebuilding a damaged template. `database-layout.md` and the
`assets/schema/` files are in the Notion `using-work-tracker` skill,
`assets/work-notion/.claude/skills/using-work-tracker/` in this skill.
`ntn-commands.md` is in the `using-notion-cli` skill,
`assets/notion-tools/.claude/skills/using-notion-cli/references/` in this skill;
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
- From the Done checkbox to Status
- Building the templates (first time, or a damaged one)
- Checks after any of these

## Where the templates live

The templates are Notion database templates
(https://www.notion.com/help/database-templates), so a page the owner makes
with "New" in Notion is the same as one the agent makes. The owner's
Projects database holds one, "Project", set as its default. It holds both
parts: the work items part (Work Items, Phases, Tasks) and the memory part
(Memory and Current state; a template built before the one-home layout,
which keeps decisions, system rules, terms, and originals as files in the
repository, also holds a Terminology glossary page, which nothing writes). Every
project is made from it, then has the part it keeps elsewhere removed.

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

Bring "Project" up to the current toolkit layout (the `assets/schema/`
files, `work-layout.md`, `project-page.md`, and `work-item-page.md`) at
every update ("Bringing a project up to the current template", step 5)
and before every copy ("A new project", step 1), so a new project never
starts behind the toolkit.

If the Projects database has no "Project", not even in the trash, build
it first ("Building the templates" below). Never add real work to a template: a copy takes
everything on the template with it.

## A new project

Before anything: the owner has signed in (`ntn login`) and shared, with
the "Notion CLI" connection, the top-level Notion page his projects go
under (`ntn-commands.md`, "Access and sign-in").

1. **Take the template's id:** "Project" in the templates list, not in
   the trash ("Where the templates live"). With work items in Notion, check
   it is current, reading only: find its Work Items, Phases, and Tasks
   databases (list the template page's children, as in step 4 below).
   Compare each database's properties, relations, and views with the
   `assets/schema/` files and `work-layout.md`, as "Bringing a project up
   to the current template", steps 1 to 3, does. Then list the Work Items
   database's templates, read the default one
   (`ntn api v1/pages/<id>/markdown < /dev/null | jq -r .markdown`), and
   compare its sections and guide paragraphs with `work-item-page.md`,
   the template page's text with `project-page.md`, and the headings of
   its "Current state" page with `assets/current-state.md` (`setup.md`).
   When anything is
   missing or differs, bring the template up to date first, after the
   owner's yes: "Bringing a project up to the current template", steps 1
   to 4, run on "Project", and its memory part (`setup.md`, "Bringing
   memory up to the current layout"). Step 4 there says which parts of
   the work item template are the owner's and are never changed. Then
   copy.
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
   template"): the page lists Memory, Current state, Work Items, Phases,
   and Tasks, and Terminology glossary when the template has that page.

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
   Memory and Current state pages, and the Terminology glossary page when
   the template has one.
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

`PROJECT.md`, section "Toolkit settings", has two fixed lines for Notion:
"Notion work items" and "Notion memory". The skills read the ids from them
every time. Write the ids as nested bullets under the label line, in place
of its prompt. Never add a line or a heading of your own to the section.

With work items in Notion:

```markdown
- Work item ID prefix: `<PREFIX>`
- Notion work items:
  - Project page: <url>
  - Work Items: database <id>, data source <id>
  - Phases: database <id>, data source <id>
  - Tasks: database <id>, data source <id>
  - Projects database: data source <id>
```

`setup.md` gives the bullets of "Notion memory". With memory in Notion and
work items elsewhere, "Notion work items" holds `not used`, and the
"Project page" and "Projects database" bullets are the first two under
"Notion memory".

A project set up earlier holds these ids under a `### Notion` heading at
the end of the section. In an update, show the owner the section before
and after, and after his yes move each line under its fixed line as a
nested bullet, put the "ID prefix" value on the "Work item ID prefix" line,
and remove the heading.

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
   block), then move the temporary page's Memory and Current state pages
   to the project page. A Terminology glossary page stays on the temporary
   page.
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
   the old page's Memory and Current state pages to it, and its
   Terminology glossary page when it has one.
4. Run `setup.md`, "Bringing memory up to the current layout", step 3.
5. Copy the old row's field values into the new row, then fill its work
   fields ("A new project", step 9). Change the "Project page" bullet and
   add the work bullets in `PROJECT.md` ("Recording the links in
   PROJECT.md").
6. The old row now holds only its brief: move it to the trash after the
   owner's yes.

## Bringing a project up to the current template

Onboarding's "update the toolkit" runs this. Copying newer skill files
changes nothing in Notion, so compare the project with the `assets/schema/`
files and `work-layout.md` and add only what is missing. Never remove, rename, or retype anything; the
owner may have added his own columns and views, and they stay. The only
exceptions are the Tasks "Done" checkbox and the type of the Tasks Status
("From the Done checkbox to Status" below): the agent makes both changes
through the API, after the owner's yes.

1. **Properties.** For each database, list what it has:

   ```bash
   ntn api v1/data_sources/<data-source-id> < /dev/null | jq -r '.properties | to_entries[] | "\(.key)\t\(.value.type)"'
   ```

   Files 01 to 03 are bodies that create a whole database, so they are
   never sent here. For each property in them that is missing, take that
   one property's spec out of the file's `initial_data_source.properties`
   and send it alone:

   ```bash
   ntn api v1/data_sources/<data-source-id> -X PATCH -d '{"properties":{"<Name>": <that property's spec from the file>}}' < /dev/null
   ```

   A Tasks database with a "Done" checkbox, or a Status that is missing
   or of type select: "From the Done checkbox to Status" below, after
   this step. When Status is missing, add it first, from file 03.

   Any other property with the right name but another type: leave it and
   tell the owner. A select or status missing an option: send every option it has
   now plus the new one (`database-layout.md`). A project with a
   Stage property: "From Stage to State" below, after this step.
2. **Relations, the rollup, and the columns made from them**, from files
   04 to 07d. Each of these files is already a whole body with its
   `properties` wrapper: never take a spec out of it and wrap it again.
   Fill the placeholders in a copy and send the copy as it is
   (`PATCH v1/data_sources/<data-source-id>` with `-d @<copy>`). Send a
   file only when a property in it is missing. When the database already
   has some of the file's properties, remove those from the copy first,
   so only the missing ones are sent.
3. **Views.** List their ids, then read each one's name, one call per id:

   ```bash
   ntn api v1/views database_id==<database-id> < /dev/null | jq -r '.results[].id'
   ntn api v1/views/<view-id> < /dev/null | jq -r '.name'
   ```

   Create each missing view from its asset (fill the placeholders first),
   in file order (10 to 19b).
   A Work Items view named "Waiting on Mike" is the earlier name of
   "Waiting on the owner": it is not missing. Rename it with
   `PATCH v1/views/<id>` and `{"name":"Waiting on the owner"}`.
   Each view named Board, By state, All items, Roadmap, Waiting on the
   owner,
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
   "By project phase", "Project phases", and "Project tasks" are the
   first tabs of Work Items, Phases, and Tasks, so the project page shows
   the top-level items under the project's phases, the project's roadmap,
   and its own tasks (`work-layout.md`). Each of the three goes first when
   it is the last view made in its database, as the file order makes it.
   When one is not first (it existed already, or a missing "Board", "By
   item", or "Open tasks" was made after it): the API cannot move
   a view (https://developers.notion.com/reference/update-a-view takes
   only `name`, `filter`, `sorts`, `quick_filters`, and `configuration`),
   so give the owner the click (drag its tab to the left end, on the
   project page) and wait until he says it is done.
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
   template with `work-item-page.md`, section by section. Match a section
   by the words of its heading, whatever its heading level.
   - **A missing section or view:** add it the same way the template build
     does, with its heading at the level the template's other sections
     have. Skip "Linked memory" in a project without Notion memory. Never
     add "Linked Github PRs" here: it comes only with the owner's yes to
     the Requirements layout, below.
   - **The toolkit's own guide text:** replace, with one `update_content`
     call, each guide paragraph under Roadmap, Sub-items, Tasks, Questions
     and Answers, and Linked memory, and the Related items prompt, that
     differs from `work-item-page.md`.
   - **The parts the one-home layout added**, each with one
     `update_content` call when the template lacks it: the `**Moved up:**`
     line, as the line after `**Related items:**` in the Current state
     toggle; the "Lessons not proven yet" heading and its prompt line,
     under Notes after Sources; and the Sources prompt line in the form
     `<SRC-###>: ...`, in place of a Sources prompt line that names a file.
     Skip a part the owner removed and says he does not want.
   - **The Requirements layout from before toolkit 0.8.1** (the section
     holds the line `**Overall status:**`): ask the owner whether new
     items of this project should get the current layout. After his yes,
     replace everything from the line under the Requirements heading to
     the line above the "Questions and Answers" heading with the same
     lines of `work-item-page.md`, add the note at the top (the
     callout that starts "If you are an agent creating or changing this
     page") as the first block, and add the "Linked Github PRs" heading
     and its prompt line at the end of the page, in one `update_content`
     call. Write the `Requirement` heading one level below the template's
     section headings. The embed under "Linked Github PRs" is the owner's
     to add (template build, step 11). Before his yes, and after a no, add
     none of the three.
   - **Everything else is the owner's and is never changed:** the level of
     each heading, the note at the top (its words, or that he removed it),
     a Requirements section in any other form, the "Linked Github PRs"
     section and its embed (or that it is missing), and any text he
     added. The owner edits this template himself in Notion, and his
     version wins over `work-item-page.md`. When one of these parts differs from the file,
     change nothing and tell him in one line what differs.

   Do the same for the
   columns of the template's Tasks view (file 22). Items made earlier keep
   their own Tasks view; turn its new columns on only when you next change
   that item. Items made
   earlier keep their pages, and their Requirements section is never
   rewritten (`earlier-versions.md`, "The Requirements layout (toolkit
   0.8.1)"); add
   a missing section to one, and replace its
   Tasks guide paragraph, only when you next change that item.
5. **The "Project" template** in the Projects database. Its data source id
   is on the "Projects database" bullet in `PROJECT.md`, "Toolkit
   settings". When there is none (an older project), read it from the
   project page's parent (`ntn api v1/pages/<project-page-id> < /dev/null | jq -r .parent.data_source_id`),
   add the bullet `- Projects database: data source <id>`, and remove the
   "Work item template page" and "Templates page" lines. When the
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
2. Set each work item's State and Status as `earlier-versions.md`, "Work
   items from Stage to State", says (`database-layout.md`, "Setting State and
   Status").
3. In each work item template (step 4 above, and the one in "Project"),
   replace the Next action prompt with the one in
   `work-item-page.md`, with one `update_content` call.
4. Step 3 above adds the "By state" view. The Stage property, the "By
   stage" view, and the Status options Backlog, Ready, and In Review stay:
   never remove them. Tell the owner he may delete them himself in Notion
   once no item uses them.

## From the Done checkbox to Status

A project set up before toolkit 0.8.0 has a "Done" checkbox on Tasks and a
Tasks Status of type select, or no Tasks Status. Since 0.8.0 a task has one field for this:
Status, of Notion's status type (the owner's decision, 2026-10-03). Run
this on the project's Tasks database, and on the Tasks database of
"Project". These steps retype one property and remove one, so show the
owner the steps first and act only after his yes.

1. Read what the database has:

   ```bash
   ntn api v1/data_sources/<tasks-data-source-id> < /dev/null | jq -c '.properties | {Status: .Status.type, Done: (.Done.type // "none")}'
   ```

   Status `status` and Done `none`: it is current; run only the check in
   step 6.
2. While Done still exists, make each task's Status agree with it. Set a
   Status from Done like this: not ticked, Not Started; ticked, Done, or
   Cancelled when its title starts with "Cancelled: ". When Status was
   added in this run, set every task's Status this way and ask nothing.
   Otherwise set only the tasks that have no Status, list for the owner
   each task whose Status disagrees with Done (ticked but Not Started or
   In Progress; not ticked but Done or Cancelled), and ask which is right.
   Then save every task's page id and Status in a file in a scratch
   folder (`ntn-commands.md`, "Sending a body"). Save there also the
   name and filter of every view of the Tasks database (the view ids as
   in "Bringing a project up to the current template", step 3, then
   `ntn api v1/views/<view-id> < /dev/null | jq -c '{id, name, filter}'`
   for each).
3. Status of type select: change its type yourself, with one call. The
   owner clicks nothing; his yes to these steps covers it. Take the
   `Status` spec out of `03-tasks-database.json`
   (`initial_data_source.properties.Status`) and send it alone:

   ```bash
   ntn api v1/data_sources/<tasks-data-source-id> -X PATCH -d '{"properties":{"Status": <the Status spec from 03-tasks-database.json>}}' < /dev/null | jq -c '.properties.Status | {id, type}'
   ```

   The answer must show type `status`. When Notion refuses the call,
   or accepts it but the type is not `status`: stop, tell the owner what
   it answered, and change nothing more. Notion's pages do not promise
   that a type change keeps the values
   (https://developers.notion.com/reference/update-data-source-properties:
   "Changing a type can make existing values unreadable in the new
   type"), so the list from step 2 is the way back.
4. Read Status again. Each option must be in its group: Not Started in
   To-do, In Progress in In progress, Done and Cancelled in Complete. When
   one is not, send the whole list from `03-tasks-database.json`, each
   option with its group (`database-layout.md`), and read it back. When a
   group still differs, give the owner the click: in "Edit property", drag
   the option into its group. Then read every task's Status and compare
   it with the list from step 2. Set each one that differs or is empty
   back to its saved Status.
5. Put the view filters back. A type change can clear the filter of a
   view, so do this after step 3, never before. Read the filter of every
   Tasks view again and compare it with the one saved in step 2. For each
   view whose filter changed, send the saved filter back with
   `PATCH v1/views/<id>` and only `{"filter": <the saved filter>}`; where
   the saved filter tests Status as `select`, write `status` in its
   place. Read it back. A filter Notion refuses, or one that still
   differs: tell the owner the view's name and its saved filter, and
   leave that view as it is.
   Then set the filter of the Tasks view "Open tasks", whatever it held.
   File `16-view-open-tasks.json` is a whole view body, so take only its
   `filter` object out of it, with `{{T_STATUS}}` the id of Status as
   read after step 3, and send `PATCH v1/views/<id>` with only
   `{"filter": <that object>}`. Then remove the checkbox:
   `PATCH v1/data_sources/<tasks-data-source-id>` with
   `{"properties":{"Done":null}}`.
6. Check: the call in step 1 shows Status `status` and
   Done `none`, and "Open tasks" lists only tasks that are Not Started or
   In Progress. When either fails, tell the owner what you see and stop;
   do not repeat step 5.

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
   the Memory page with Lore's databases, and Current state.
3. The last two lines of `project-page.md` (the `# Work` heading and its
   paragraph) at the end of the page:
   `{"type":"insert_content","insert_content":{"content":"<those lines>"}}`
   on the same markdown call.
4. The three databases, in order, from `assets/schema/01…03`, with
   `{{PROJECT_PAGE_ID}}` the template. The ID property has no prefix in a
   template (the asset says `null`); each project sets its own after the
   copy.
5. Their data source ids (`jq '.data_sources[0].id'` on each answer).
6. The relations and rollup: files 04, 05, 06, then 07, then 07b, then
   07c and 07d.
7. Property ids for each database (`ntn-commands.md`, "Filling a body from an
   asset").
8. Views: files 10, 11, 13, 14, 17, 15, 16 as `POST v1/views`. Then rename each
   database's first view: Work Items' to "All items" with the body of 12
   (send only `name`, `filter`, `sorts`, `configuration` as
   `PATCH v1/views/<id>`), Phases' to "All phases", Tasks' to "All tasks"
   (sorted by Order). Then files 18, 19, and 19b, in that order: each
   goes first in its database, so the project page shows the top-level
   items under the project's phases, the project's phases, and the
   project's tasks.
9. `setup.md`, "Building the memory part of a template", steps 5 to 7:
   the links between the memory databases and Work Items, the Memories
   views, and their column order.
10. Column order: for each table view (All items, Roadmap, Waiting on the owner,
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
    The file leaves out one block the API cannot write: the "Embed
    Github" block under "Linked Github PRs". Ask the owner to add it by
    hand in the Notion app, under that section's prompt line, and wait
    until he says it is done or says he does not want it. In an item, the
    agent adds each pull request as a plain link under the heading (the
    Notion `using-work-tracker` skill, `page-layout.md`, "Pull request
    links").
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
  Notion (Work Items, Phases, and Tasks; Memory and Current state); with
  work items, its Work Items templates list
  shows one template with `is_default` true, the ID property shows the
  project's prefix, and the relations check below passes.
- Each database's relations point at the same project's databases:
  `ntn api v1/data_sources/<id> < /dev/null | jq '.properties | map_values(select(.type=="relation") | .relation.data_source_id)'`.

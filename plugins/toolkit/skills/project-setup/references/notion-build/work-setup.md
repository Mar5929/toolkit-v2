# Setting up and updating a Notion project and its work tracking

This file gives the Notion steps for a project that keeps its work items or its memory in Notion. Open it for one of five jobs: setting up a new Notion project, adding work items or memory to a Notion project later, bringing an older project up to the current template, building the templates for the first time, or rebuilding a damaged template. A job is done when its steps are finished and the checks in "Checks after any of these" pass.

This file names files that are kept in three places:

- `database-layout.md` and the `assets/schema/` files are in the Notion `using-work-tracker` skill, which is in `assets/work-notion/.claude/skills/using-work-tracker/` in this skill.
- `ntn-commands.md` is in the `using-notion-cli` skill, in `assets/notion-tools/.claude/skills/using-notion-cli/references/` in this skill. That skill's `SKILL.md` says how to run `ntn` in Codex.
- The other reference files named here are in this folder (`setup.md`, `work-layout.md`, `project-page.md`, and `work-item-page.md`) or in this skill's `references/` folder (`update.md`, `finishing.md`, and `earlier-versions.md`).

## Contents

- Where the templates are kept
- A new project
- Removing the part a project keeps elsewhere
- Recording the links in PROJECT.md
- Adding work items or memory later
- Bringing a project up to the current template
- From Stage to State
- From the Done checkbox to Status
- Building the templates (first time, or a damaged one)
- Checks after any of these

## Where the templates are kept

The templates are Notion database templates (https://www.notion.com/help/database-templates). So a page that the owner makes with "New" in Notion is the same as a page that the agent makes.

The owner's Projects database holds one template, named "Project", which is set as the default template of that database. Every project is made from "Project". After a project is made, the agent removes the part that the project keeps elsewhere. "Project" holds both parts:

- The work items part is the Work Items, Phases, and Tasks databases.
- The memory part is the Memory page and the "Current state" page.
  - A template built before the current folder layout also holds a Terminology glossary page, which nothing writes. The current folder layout keeps decisions, system rules, terms, and sources as files in the repository. A source is anything the project was given by someone else.

Inside "Project", the Work Items database has one template, the work item template, which is set as the default template of that database. The title of the work item template is empty. So the title that the owner types on a card is kept, and the boards' empty-title filter hides the template. Every project made from "Project" has the work item template, still set as the default.

To list the templates of a database, run the command below. `ntn-commands.md`, "Database templates", explains this call and the default template.

```bash
ntn api v1/data_sources/<projects-data-source-id>/templates < /dev/null | jq -r '.templates[] | "\(.id)\t\(.is_default)\t\(.name)"'
```

The list also shows templates that are in Notion's trash. A template in the trash cannot be used, and "New" makes blank cards while the work item template is in the trash. Before you use a template, check that `ntn api v1/pages/<template-id> < /dev/null | jq .in_trash` is `false`.

Never restore a template through the API (`in_trash` false). Notion's documentation does not say that a template restored through the API comes back as a template, and on 2026-10-02 one restored that way did not give the owner a working template.

When a template is in the trash, ask the owner to restore it from Trash in the Notion app, then run "Checks after any of these". When a check fails, build a new template with "Building the templates": steps 1 to 13 for "Project", and steps 11 to 13 for the work item template.

Bring "Project" up to the current toolkit layout at every update and before every copy, so that a new project never starts with an older layout than the toolkit's. The current toolkit layout is what these files hold: the `assets/schema/` files, `work-layout.md`, `project-page.md`, and `work-item-page.md`.

- At an update, "Bringing a project up to the current template", step 5, brings "Project" up to date.
- Before a copy, "A new project", step 1, brings "Project" up to date.

When the Projects database has no "Project", not even in the trash, build it first with "Building the templates" below.

Never add real work to a template, because a copy takes everything on the template with it.

## A new project

Before the first step, two things must be true. The owner has signed in with `ntn login`. The owner has also shared the top-level Notion page that the owner's projects go under with the "Notion CLI" connection. `ntn-commands.md`, "Access and sign-in", says how the owner does both, and what an error means when a page is not shared.

1. **Take the template's id.** Take the id of "Project" from the templates list, and check that the template is not in the trash. "Where the templates are kept" gives the list command and the trash check.
   - When work items are in Notion, check that the template is current. This check only reads.
     - Find the template's Work Items, Phases, and Tasks databases by listing the template page's children, as in step 4 below.
     - Compare each database's properties, relations, and views with the `assets/schema/` files and `work-layout.md`, as "Bringing a project up to the current template", steps 1 to 3, does.
     - List the Work Items database's templates, and read the default one with `ntn api v1/pages/<id>/markdown < /dev/null | jq -r .markdown`. Compare its sections and guide paragraphs with `work-item-page.md`.
     - Compare the template page's text with `project-page.md`.
     - Compare the headings of the template's "Current state" page with `assets/current-state.md`. `setup.md` says where that file is kept.
   - When anything is missing or differs, bring the template up to date first, after the owner's yes. Run "Bringing a project up to the current template", steps 1 to 4, on "Project". Bring its memory part up to date with `setup.md`, "Bringing memory up to the current layout". Step 4 of "Bringing a project up to the current template" says which parts of the work item template are the owner's and are never changed.
   - Then make the copy, with the steps below.
2. **Pick the ID prefix.** Do this step when work items are in Notion. Propose a prefix from the project name, and ask the owner. A prefix is two to four capital letters, for example "IML" for "iOS money log". Notion allows each prefix in only one database of the workspace. When setting the prefix fails with a conflict, propose another prefix.
3. **Make the project page from the template**, as a row of the owner's Projects database. The title property of that database is "Project".

   ```bash
   ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<projects-data-source-id>"},
     "properties":{"Project":{"title":[{"text":{"content":"<Project name>"}}]}},
     "template":{"type":"template_id","template_id":"<projects-template-id>"}}' < /dev/null | jq -r '.id, .url'
   ```

   The template is kept in the Projects database, so every project is a row of that database. When the owner has no Projects database, stop, tell the owner that a Notion project needs a Projects database, and ask the owner to make one in Notion.
4. **Wait** until the copy is filled. The copy is filled when the project page lists the Memory page, the "Current state" page, and the Work Items, Phases, and Tasks databases, and also the Terminology glossary page when the template has that page. `ntn-commands.md`, "Waiting for a template", says how often to check and when to stop waiting. This command lists what the page holds:

   ```bash
   ntn api v1/blocks/<project-page-id>/children page_size==100 < /dev/null | jq -r '.results[] | select(.type=="child_database" or .type=="child_page") | [.type, .id, (.child_database.title // .child_page.title)] | @tsv'
   ```
5. **Read each database's data source id.** Read it for Work Items, Phases, and Tasks, and for Memories, Facts, and Entities on the Memory page. `setup.md`, "A new project", step 1, shows how to find the databases on the Memory page.

   ```bash
   ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
   ```
6. **Remove the part this project keeps elsewhere**, as the next section says. Skip this step when work items and memory are both in Notion.
7. **Set the ID prefix.** Do this step when work items are in Notion. A copy starts with no prefix.

   ```bash
   ntn api v1/data_sources/<work-items-data-source-id> -X PATCH -d '{"properties":{"ID":{"unique_id":{"prefix":"<PREFIX>"}}}}' < /dev/null | jq -c '.properties.ID.unique_id'
   ```
8. When memory is in Notion, run `setup.md`, "A new project", steps 2 and 4. Step 2 there makes the Lore project row, and step 4 there fills the "Current state" page. Lore is the name of the layout that Notion memory uses.
9. **Fill the project row.** In Notion, fill every field of the project's row that the setup answers cover, such as Tracker, Memory system, Local path, Repository, Salesforce, and Set up on. Ask the owner, in one question, only for the fields that only the owner knows, such as Priority and Target Date.
   - "Key" holds the project's work item ID prefix, wherever the project's work items are kept, for example TKV, or WI for local work items.
   - "Work items data source" and "Memory data source" hold the data source ids of this project's Work Items and Memories databases, when those databases are in Notion.
   - `finishing.md`, "Fill the prompts", fills Desired Outcome at the end of setup, with the sentence the owner gives for the project's outcome.
10. **Record the links** in `PROJECT.md` and read them back. "Recording the links in PROJECT.md" below gives the lines for work items, and `setup.md` gives the memory lines.

## Removing the part a project keeps elsewhere

Run this section only on a page, or on databases, copied from the template in this run, before anything is saved in them.

To list the page's blocks with their ids, run this command:

```bash
ntn api v1/blocks/<page-id>/children page_size==100 < /dev/null | jq -r '.results[] | [.type, .id, (.child_database.title // .child_page.title // ((.[.type].rich_text // []) | map(.plain_text) | join("")))] | @tsv'
```

To remove a block, run `ntn api v1/blocks/<block-id> -X DELETE < /dev/null`. The block goes to Notion's trash. A page or a database goes to the trash with everything in it.

**Memory kept locally or in Hindsight.** When the project keeps its memory locally or in Hindsight, do these three steps:

1. On the project page, remove the "Project Memory" heading, the Memory page, and the "Current state" page. Also remove the Terminology glossary page when the template has one.
2. Remove the Work Items columns that linked to the memory databases. Send `PATCH v1/data_sources/<work-items-data-source-id>` with `{"properties":{"Memories":null,"Facts":null,"Entities":null}}`.
3. In the project's work item template, which is the default template of the project's Work Items database, remove the "Linked memory" heading, the paragraph under that heading, and the view under that paragraph.

**Work items kept locally or on GitHub.** When the project keeps its work items locally or on GitHub, do these three steps:

1. On the project page, remove the "Work" heading, the paragraph under that heading, and the Work Items, Phases, and Tasks databases.
2. Remove the memory columns that linked to the work databases. Send `{"properties":{"Work items":null}}` as `PATCH v1/data_sources/<id>` on each of Memories, Facts, and Entities.
3. Replace the Memories view "By work item", because that view grouped by the column removed in step 2.
   - Remove the view with `ntn api v1/views/<view-id> -X DELETE < /dev/null`. "Bringing a project up to the current template", step 3, shows how to list the view ids.
   - Then create `12-view-by-work-item-ids.json` as `POST v1/views`, without its `note` key.
   - Then give the new view the column order, as `setup.md`, "Building the memory part of a template", step 7, says.

## Recording the links in PROJECT.md

`PROJECT.md`, section "Toolkit settings", has two fixed lines for Notion: "Notion work items" and "Notion memory". The skills read the ids from those two lines every time. Write the ids as nested bullets under the label line, in place of its prompt. Never add a line or a heading of your own to the section.

When work items are in Notion, write these lines:

```markdown
- Work item ID prefix: `<PREFIX>`
- Notion work items:
  - Project page: <url>
  - Work Items: database <id>, data source <id>
  - Phases: database <id>, data source <id>
  - Tasks: database <id>, data source <id>
  - Projects database: data source <id>
```

`setup.md`, "Recording the links in PROJECT.md", gives the bullets of "Notion memory". When memory is in Notion and work items are kept elsewhere, "Notion work items" holds `not used`, and the "Project page" and "Projects database" bullets are the first two bullets under "Notion memory".

A project set up earlier holds these ids under a `### Notion` heading at the end of the section. In an update of such a project, show the owner the section before and after. After the owner's yes, make three changes:

- Move each line under its fixed line, as a nested bullet.
- Put the "ID prefix" value on the "Work item ID prefix" line.
- Remove the `### Notion` heading.

## Adding work items or memory later

`update.md`, "Changing a setup choice", runs this section when a project has work items or memory in Notion and adds the other one.

Notion can move a page, but it cannot move a database. So the three memory pages move, and the work databases stay on the page that holds them. A moved page keeps its id. This command moves a page: `ntn api v1/pages/<page-id>/move -d '{"parent":{"type":"page_id","page_id":"<new-parent-id>"}}' < /dev/null`

**Memory into Notion.** Use these steps when the project page holds the work items.

1. Make a temporary row from "Project", as "A new project", steps 3 and 4, says. Title it "<Project name> (temporary, safe to delete)".
2. Add a "Project Memory" heading at the end of the project page, by sending `PATCH v1/blocks/<project-page-id>/children` with one `heading_1` block. Then move the temporary page's Memory page and "Current state" page to the project page. A Terminology glossary page stays on the temporary page.
3. Move the temporary row to the trash, with `PATCH v1/pages/<id>` and `{"in_trash":true}`.
4. Run `setup.md`, "A new project". Its four steps find the memory databases, name the project in Lore's Projects database, record the links, and fill the "Current state" page.
5. The moved Memories, Facts, and Entities databases still link to the temporary Work Items database. Remove their "Work items" column and the Memories view "By work item", as "Removing the part a project keeps elsewhere" says for work items in steps 2 and 3. Do not create the new view.
6. Run `setup.md`, "Bringing memory up to the current layout", step 3, which links the memory databases to this project's Work Items database and adds "Linked memory" to the work item template. Then fill the memory fields of the project's row, as "A new project", step 9, says.

**Work items into Notion.** Use these steps when the project page holds the memory.

1. Make a new project page from "Project", as "A new project", steps 1 to 7, says. Run step 6 for the memory part, although memory is also in Notion.
2. Copy the old page's Project brief text into the new page with one `update_content` call.
3. Add a "Project Memory" heading at the end of the new page. Then move the old page's Memory page and "Current state" page to the new page, and also its Terminology glossary page when the old page has one.
4. Run `setup.md`, "Bringing memory up to the current layout", step 3, which links the memory databases to this project's Work Items database and adds "Linked memory" to the work item template.
5. Copy the old row's field values into the new row. Then fill the work fields of the new row, as "A new project", step 9, says. In `PROJECT.md`, change the "Project page" bullet and add the work bullets, as "Recording the links in PROJECT.md" says.
6. The old row now holds only its brief. Move the old row to the trash after the owner's yes.

## Bringing a project up to the current template

The job "update the toolkit" runs this section. Copying newer skill files changes nothing in Notion. So compare the project with the `assets/schema/` files and `work-layout.md`, and add only what is missing.

Never remove or rename anything, and never change the type of anything. The owner may have added columns and views of the owner's own, and they stay.

The only exceptions are the Tasks "Done" checkbox and the type of the Tasks Status, which "From the Done checkbox to Status" below covers. The agent makes both changes through the API, after the owner's yes.

1. **Properties.** For each database, list the properties it has:

   ```bash
   ntn api v1/data_sources/<data-source-id> < /dev/null | jq -r '.properties | to_entries[] | "\(.key)\t\(.value.type)"'
   ```

   Files 01 to 03 are bodies that create a whole database, so never send one of them here. For each property in those files that the database lacks, take that one property's spec out of the file's `initial_data_source.properties` and send it alone:

   ```bash
   ntn api v1/data_sources/<data-source-id> -X PATCH -d '{"properties":{"<Name>": <that property's spec from the file>}}' < /dev/null
   ```

   - When a Tasks database has a "Done" checkbox, or a Status that is missing or of type select, run "From the Done checkbox to Status" below, after this step. When Status is missing, add it first, from file 03.
   - When any other property has the right name but another type, leave the property as it is and tell the owner.
   - When a select or status property lacks an option, send every option the property has now plus the new one. `database-layout.md` lists the options of each property.
   - When the project has a Stage property, run "From Stage to State" below, after this step.
2. **Relations, the rollup, and the columns made from them.** These come from files 04 to 07d. Each of these files is already a whole body with its `properties` wrapper, so never take a spec out of such a file and wrap it again.
   - Fill the placeholders in a copy of the file, and send the copy as it is, with `PATCH v1/data_sources/<data-source-id>` and `-d @<copy>`.
   - Send a file only when a property in it is missing.
   - When the database already has some of the file's properties, remove those properties from the copy first, so that only the missing ones are sent.
3. **Views.** List the view ids of each database, then read the name of each view, with one call per id:

   ```bash
   ntn api v1/views database_id==<database-id> < /dev/null | jq -r '.results[].id'
   ntn api v1/views/<view-id> < /dev/null | jq -r '.name'
   ```

   - Create each missing view from its file in `assets/schema/`, in file order (10 to 19b). Fill the placeholders in the file first.
   - A Work Items view named "Waiting on Mike" has the earlier name of "Waiting on the owner", so that view is not missing. Rename it with `PATCH v1/views/<id>` and `{"name":"Waiting on the owner"}`.
   - Each view named Board, By state, All items, Roadmap, Waiting on the owner, Top-level items, or By project phase (files 10 to 14, 17, and 18) must hold `{"property":"title","title":{"is_not_empty":true}}` in its filter.
     - When the filter of one of these views lacks that condition, read the view's filter with `ntn api v1/views/<id> < /dev/null | jq -c .filter`. Then send `PATCH v1/views/<id>` with only `filter`: `{"and":[<its conditions>,{"property":"title","title":{"is_not_empty":true}}]}`. Here <its conditions> are the items of the filter's "and" list, or the filter's one condition.
     - The view's grouping and sub-items stay. A sub-item is a work item inside another work item.
     - Leave the owner's own views as they are.
   - When the columns of a table view are out of the order in `work-layout.md`, give the view the column order, as "Building the templates", step 10, says. When a view made from a file in `assets/schema/` hides a column that the file now shows, show that column in the same `PATCH v1/views/<id>`.
   - The API cannot read the page layout. When the owner says that a project's pages show properties in the wrong order or in the wrong sections, give the owner the layout clicks in `work-layout.md`, "Property order and page layout".
   - "All phases" and "All tasks" have no file in `assets/schema/`. When "All phases" is missing, send `{"database_id":"<id>","data_source_id":"<id>","name":"All phases","type":"table","sorts":[{"property":"Order","direction":"ascending"}]}` as `POST v1/views`. When "All tasks" is missing, send the same body with the name "All tasks".
   - "By project phase", "Project phases", and "Project tasks" are the first tabs of Work Items, Phases, and Tasks. So the project page shows the top-level items under the project's phases, the project's roadmap, and the project's own tasks. A top-level item is a work item that has no parent work item. `work-layout.md`, "Views of the databases", describes each view and says what the project page shows.
     - Each of the three views goes first when it is the last view made in its database, and the file order makes it the last.
     - One of the three is not first when it existed already, or when a missing "Board", "By item", or "Open tasks" view was made after it. The API cannot move a view: https://developers.notion.com/reference/update-a-view takes only `name`, `filter`, `sorts`, `quick_filters`, and `configuration`. So give the owner the click, which is to drag the view's tab to the left end, on the project page. Wait until the owner says it is done.
   - Then check the project page's text. When the paragraph under its `# Work` heading differs from `project-page.md`, replace that paragraph with one `update_content` call.
4. **The work item template.** This template is the default template of the project's Work Items database. Read its id from the templates list.

   A project made from the older template pages has a plain "Work item template" page and no database template. For that project, do these three things first:

   - Ask the owner for the clicks in "Building the templates", step 11, in the project's Work Items database.
   - Then fill the new template as the opening of "Building the templates" and its steps 11 and 12 say: first the text, then the views.
   - Tell the owner that the plain page is no longer used and that the owner may delete it.

   Then compare the template with `work-item-page.md`, section by section. Match a section by the words of its heading, whatever its heading level.

   - **A missing section or view.** Add it the same way "Building the templates" does, with its heading at the level that the template's other sections have.
     - Skip "Linked memory" in a project without Notion memory.
     - Never add "Linked Github PRs" here. That section comes only with the owner's yes to the Requirements layout, below.
   - **The toolkit's own guide text.** Replace, with one `update_content` call, each of these that differs from `work-item-page.md`: each guide paragraph under Roadmap, Sub-items, Tasks, Questions and Answers, and Linked memory, and the Related items prompt.
   - **The parts the current folder layout added.** Add each of these three parts with one `update_content` call, when the template lacks it. Skip a part that the owner removed and says the owner does not want.
     - The `**Moved up:**` line, as the line after `**Related items:**` in the Current state toggle of the work item template.
     - The "Lessons not proven yet" heading and its prompt line, under Notes after Sources.
     - The Sources prompt line in the form `<SRC-###>: ...`, in place of a Sources prompt line that names a file.
   - **The Requirements layout from before toolkit 0.8.1.** A template has this layout when its Requirements section holds the line `**Overall status:**`. Ask the owner whether new work items of this project should get the current layout.
     - After the owner's yes, make these three changes in one `update_content` call:
       - Replace everything from the line under the Requirements heading to the line above the "Questions and Answers" heading with the same lines of `work-item-page.md`.
       - Add the note at the top as the first block. The note is the callout that starts "If you are an agent creating or changing this page".
       - Add the "Linked Github PRs" heading and its prompt line at the end of the page.
     - Write the `Requirement` heading one level below the template's section headings.
     - The embed under "Linked Github PRs" is the owner's to add, as "Building the templates", step 11, says.
     - Before the owner's yes, and after a no, add none of the three.
   - **Everything else is the owner's and is never changed.** That covers the level of each heading, the note at the top (its words, or that the owner removed it), a Requirements section in any other form, the "Linked Github PRs" section and its embed (or that it is missing), and any text the owner added.
     - The owner edits this template in Notion, and where the template and `work-item-page.md` differ in one of these parts, the owner's version is used.
     - When one of these parts differs from the file, change nothing and tell the owner in one line what differs.

   Do the same for the columns of the template's Tasks view, with file 22.

   These rules hold for work items made earlier:

   - A work item made earlier keeps its own Tasks view. Turn the new columns of that view on only when you next change that work item.
   - A work item made earlier keeps its page, and its Requirements section is never rewritten. `earlier-versions.md`, "The Requirements layout (toolkit 0.8.1)", gives the rule for existing work items and says when one moves to the current layout.
   - Add a missing section to such a work item, and replace its Tasks guide paragraph, only when you next change that work item.
5. **The "Project" template** in the Projects database. Its data source id is on the "Projects database" bullet in `PROJECT.md`, "Toolkit settings".
   - When `PROJECT.md` has no such bullet (an older project), read the id from the project page's parent with `ntn api v1/pages/<project-page-id> < /dev/null | jq -r .parent.data_source_id`. Then add the bullet `- Projects database: data source <id>`, and remove the "Work item template page" and "Templates page" lines.
   - When the parent is a page, ask the owner which Projects database holds the template.
   - Then bring "Project" up to date the same way, with steps 1 to 4 above. Bring its memory part up to date too, with `setup.md`, "Bringing memory up to the current layout". Do both so that new projects start current.
6. Tell the owner in one short list what was added, and to which project.

## From Stage to State

A project set up before toolkit 0.6.0 has a Stage property and the Status options Backlog, Ready, In Progress, In Review, Done, and Cancelled. Run this section after step 1 of "Bringing a project up to the current template" has added the State property.

1. Add the Status options Not Started (To-do), Preparing (In progress), and Blocked (In progress) to the project's Work Items database in one change, for example one `PATCH v1/data_sources/<work-items-data-source-id>` call. The name in brackets is the group of the option. Changing the Status options replaces the whole list. So send every option the database has now plus the new ones, each with its group. `database-layout.md` lists the Status options and gives this rule for changing them.
2. Set each work item's State and Status as `earlier-versions.md`, "Work items from Stage to State", says. That section gives the State for each old Stage. `database-layout.md`, "Setting State and Status", gives the call that sets both.
3. In each work item template, replace the Next action prompt with the one in `work-item-page.md`, with one `update_content` call. The work item templates are the project's own (step 4 of "Bringing a project up to the current template") and the one in "Project".
4. Step 3 of "Bringing a project up to the current template" adds the "By state" view. The Stage property, the "By stage" view, and the Status options Backlog, Ready, and In Review stay. Never remove them. Tell the owner that the owner may delete them in Notion once no work item uses them.

## From the Done checkbox to Status

A project set up before toolkit 0.8.0 has a "Done" checkbox on Tasks, and either a Tasks Status of type select or no Tasks Status. Since 0.8.0 a task has one field for this: Status, of Notion's status type (the owner's decision, 2026-10-03).

Run this section on the project's Tasks database, and on the Tasks database of "Project". These steps change the type of one property and remove one property, so show the owner the steps first and act only after the owner's yes.

1. Read what the database has:

   ```bash
   ntn api v1/data_sources/<tasks-data-source-id> < /dev/null | jq -c '.properties | {Status: .Status.type, Done: (.Done.type // "none")}'
   ```

   When the answer shows Status `status` and Done `none`, the database is current. Run only the check in step 6.
2. While Done still exists, make each task's Status agree with it.
   - Set a Status from Done like this. A task that is not ticked gets Not Started. A ticked task gets Done, or Cancelled when its title starts with "Cancelled: ".
   - When Status was added in this run, set every task's Status this way and ask nothing.
   - Otherwise, set only the tasks that have no Status. List for the owner each task whose Status disagrees with Done, and ask which is right. A Status disagrees with Done when the task is ticked but Not Started or In Progress, or not ticked but Done or Cancelled.
   - Then save every task's page id and Status in a file in a temporary folder. `ntn-commands.md`, "Sending a body", says where to make that folder.
   - Save in that folder also the name and filter of every view of the Tasks database. List the view ids as in "Bringing a project up to the current template", step 3. Then run `ntn api v1/views/<view-id> < /dev/null | jq -c '{id, name, filter}'` for each view.
3. When Status is of type select, change its type yourself, with one call. The owner clicks nothing, because the owner's yes to these steps covers the change. Take the `Status` spec out of `03-tasks-database.json` (`initial_data_source.properties.Status`) and send it alone:

   ```bash
   ntn api v1/data_sources/<tasks-data-source-id> -X PATCH -d '{"properties":{"Status": <the Status spec from 03-tasks-database.json>}}' < /dev/null | jq -c '.properties.Status | {id, type}'
   ```

   The answer must show type `status`. When Notion refuses the call, or accepts it but the type is not `status`, stop, tell the owner what Notion answered, and change nothing more. Notion's pages do not promise that a type change keeps the values (https://developers.notion.com/reference/update-data-source-properties: "Changing a type can make existing values unreadable in the new type"). So the list saved in step 2 is what you use to put the values back.
4. Read Status again. Each option must be in its group: Not Started in To-do, In Progress in In progress, Done and Cancelled in Complete.
   - When an option is not in its group, send the whole list from `03-tasks-database.json`, each option with its group, and read it back. `database-layout.md` says that a change to the Status options always sends the whole list, each option with its group.
   - When a group still differs, give the owner the click: in "Edit property", drag the option into its group.
   - Then read every task's Status and compare it with the list from step 2. Set each Status that differs or is empty back to its saved Status.
5. Put the view filters back. A type change can clear the filter of a view, so do this step after step 3, never before.
   - Read the filter of every Tasks view again, and compare it with the filter saved in step 2.
   - For each view whose filter changed, send the saved filter back with `PATCH v1/views/<id>` and only `{"filter": <the saved filter>}`. Where the saved filter tests Status as `select`, write `status` in its place. Read the filter back.
   - When Notion refuses a filter, or a filter still differs, tell the owner the view's name and its saved filter, and leave that view as it is.
   - Then set the filter of the Tasks view "Open tasks", whatever it held. File `16-view-open-tasks.json` is a whole view body, so take only its `filter` object out of it, with `{{T_STATUS}}` the id of Status as read after step 3. Send `PATCH v1/views/<id>` with only `{"filter": <that object>}`.
   - Then remove the checkbox. Send `PATCH v1/data_sources/<tasks-data-source-id>` with `{"properties":{"Done":null}}`.
6. Check two things: the call in step 1 shows Status `status` and Done `none`, and "Open tasks" lists only tasks that are Not Started or In Progress. When either check fails, tell the owner what you see and stop. Do not repeat step 5.

## Building the templates (first time, or a damaged one)

The API cannot make a database template or set the default one (https://developers.notion.com/guides/data-apis/creating-pages-from-templates). So the owner makes each template empty with a few clicks, and the agent fills it.

Never fill a template with `template_id`, because that turns the template into a row that shows on the owner's boards.

Keep the ids you get in a file in a temporary folder, never in the project, because the bodies need the ids. `ntn-commands.md`, "Sending a body", says how to make the folder. Remove the folder when the templates are built.

1. Ask the owner for these clicks in the owner's Projects database, and wait until the owner says they are done: the arrow beside "New" → "+ New template" → title "Project" → close it. Then the arrow beside "New" → "…" beside "Project" → "Set as default" → "All views".
   - Read the template's id from the templates list, and check that the template is not in the trash.
   - Write the lines of `project-page.md` above `# Work` into the template. The page is empty, so `replace_content` is safe here. Send `ntn api v1/pages/<template-id>/markdown -X PATCH -d @body.json < /dev/null` with `{"type":"replace_content","replace_content":{"new_str":"<those lines>"}}`.
   - The steps below use the template's id as `{{PROJECT_PAGE_ID}}`. Pages and databases made under the template go at the end of the page, so the order of the steps below puts each one under its heading.
2. Run `setup.md`, "Building the memory part of a template", steps 1 to 4. Those steps make the Memory page with Lore's databases, and the "Current state" page.
3. Add the last two lines of `project-page.md` (the `# Work` heading and its paragraph) at the end of the page. Send `{"type":"insert_content","insert_content":{"content":"<those lines>"}}` on the same markdown call as in step 1.
4. Make the three databases, in order, from `assets/schema/01…03`, with the template's id as `{{PROJECT_PAGE_ID}}`. The ID property has no prefix in a template (the file says `null`). Each project sets its own prefix after the copy.
5. Read the data source ids of the three databases, with `jq '.data_sources[0].id'` on each answer.
6. Send the relations and the rollup: files 04, 05, 06, then 07, then 07b, then 07c and 07d.
7. Read the property ids of each database. `ntn-commands.md`, "Filling a body from an asset", gives the command that lists them and says how to fill the placeholders of a file.
8. Make the views.
   - Send files 10, 11, 13, 14, 17, 15, 16 as `POST v1/views`.
   - Then rename the first view of each database. Rename the first view of Work Items to "All items" with the body of 12, sending only `name`, `filter`, `sorts`, `configuration` as `PATCH v1/views/<id>`. Rename the first view of Phases to "All phases", and the first view of Tasks to "All tasks" (sorted by Order).
   - Then send files 18, 19, and 19b, in that order. Each of these three views goes first in its database. So the project page shows the top-level items under the project's phases, the project's phases, and the project's tasks.
9. Run `setup.md`, "Building the memory part of a template", steps 5 to 7. Those steps make the links between the memory databases and Work Items, the Memories views, and their column order.
10. Set the column order. For each table view (All items, Roadmap, Waiting on the owner, Top-level items, Project phases, By item, All phases, Project tasks, Open tasks, All tasks), send `PATCH v1/views/<id>` with only `{"configuration":{"type":"table","properties":[…]}}`.
    - The list holds every property of the database in the order of `work-layout.md`, "Property order and page layout", each as `{"property_id":"<id>","visible":true|false}`.
    - "All phases" and "All tasks" show every property except the hidden ones. The other views keep their own columns on.
    - Grouping and nested sub-items are kept.
11. Make the work item template. Ask the owner for these clicks in the Work Items database of "Project", and wait until the owner says they are done: the arrow beside "New" → "+ New template" → leave the title empty → close it; then the arrow beside "New" → "…" beside the new template (it shows as "New page") → "Set as default" → "All views".
    - The title must stay empty, because a template's title is put in front of every title the owner types on a card.
    - Read the template's id. It is the template in the Work Items templates list with `is_default` true and not in the trash.
    - When the template's page is empty, write `work-item-page.md` into it with `replace_content`. When this step rebuilds a damaged template, tell the owner that sections the owner added in the Notion app are not in the file, so the owner adds them again.
    - When the owner already pasted the owner's own text into the template, write nothing. Compare the template's section headings with `work-item-page.md`, and tell the owner which are missing.
    - The file leaves out one block that the API cannot write: the "Embed Github" block under "Linked Github PRs". Ask the owner to add it by hand in the Notion app, under that section's prompt line. Wait until the owner says it is done, or says the owner does not want it.
    - In a work item, the agent adds each pull request as a plain link under the heading. `page-layout.md`, "Pull request links", in the Notion `using-work-tracker` skill, gives the form of that link.
12. Make the views of the work item template.
    - First, the owner may have pasted views in from another page, and each such view keeps a filter that names that page. For each `<database …>` line in the template's text, read its view's filter with `ntn api v1/views database_id==<id> < /dev/null`, then `ntn api v1/views/<view-id> < /dev/null | jq .filter`.
    - When the filter names a page other than this template, delete that view's block with `ntn api v1/blocks/<id> -X DELETE < /dev/null`. Take the block id from the template's children list, as in "Removing the part a project keeps elsewhere". These are views inside the template, never the Work Items, Phases, or Tasks databases.
    - Then read the template's blocks. For each of Roadmap, Sub-items, Tasks, and Linked memory, take the id of the paragraph just under the heading as `{{AFTER_BLOCK_ID}}`, use the work item template's id as `{{ITEM_PAGE_ID}}`, and send files 20 to 23 as `POST v1/views`.

    Each answer's `parent.database_id` is a new linked database, titled "Untitled". Name it with this command:

    ```bash
    ntn api v1/databases/<new-database-id> -X PATCH -d '{"title":[{"type":"text","text":{"content":"Phases"}}]}' < /dev/null
    ```

    Use the names Sub-items, Tasks, and Linked memory for the others.
13. Check the template, as the next section says. Then have the page layout of Work Items, Phases, and Tasks set. Only the Notion app can set the page layout, and it is set once per template, because every copy keeps it.
    - Ask the owner to set the page layout. Give the owner the clicks from `work-layout.md`, "Property order and page layout", one database at a time, and wait until the owner says it is done.
    - Never set the page layout yourself unless the owner names the Notion page as the owner's private test area and says you may use the owner's signed-in Chrome.
    - Tell the owner the template's link.

## Checks after any of these

- `ntn api v1/pages/<page-id>/markdown < /dev/null | jq -r .markdown` on the work item template must show four `<database …>` lines, one under each section heading, and the template's title must be empty. In a project without Notion memory, it shows three lines.
- No row of the Projects database is a template.
  - List the rows with `ntn api v1/data_sources/<projects-data-source-id>/query -d '{"page_size":100}' < /dev/null | jq -r '.results[].id'`. `ntn-commands.md`, "Finding rows", says how to read the rest when one answer does not hold every row.
  - List the templates with `ntn api v1/data_sources/<projects-data-source-id>/templates < /dev/null | jq -r '.templates[].id'`.
  - No row may have a template's id, because a template that comes back as a row shows as a card on the owner's board.
- Only after building or rebuilding the templates, and only after the owner's yes, test the template in a throwaway project. Never run this test for a new project.
  - Make a throwaway project from the template, named "… (safe to delete)".
  - Make one work item in it, as `database-layout.md`, "Creating an item", says, and check that the work item's page shows its own views.
  - Never test inside a template, because a copy would take the test work item with it.
- For a new project, the project page lists only the parts the project keeps in Notion: Work Items, Phases, and Tasks; Memory and "Current state". When the project keeps work items in Notion, its Work Items templates list shows one template with `is_default` true, the ID property shows the project's prefix, and the relations check below passes.
- Each database's relations point at the same project's databases. Check with `ntn api v1/data_sources/<id> < /dev/null | jq '.properties | map_values(select(.type=="relation") | .relation.data_source_id)'`.

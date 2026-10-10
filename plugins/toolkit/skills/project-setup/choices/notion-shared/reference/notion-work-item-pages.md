# Setting up a Notion project and its work tracking

This file gives the Notion steps for a project that keeps its work items or its memory in Notion. Open it for one of two jobs: setting up a new Notion project, or adding work items or memory to a Notion project later. A job is done when its steps are finished and the checks in "Checks after any of these" pass.

Every Notion project is a copy of the owner's "Project" template. The template is the owner's. Setup copies it and never changes it, and the toolkit does not build it.

This file names files that are kept in three places:

- `work-tracker-database-layout.md` is added to `managing-work-items` by the Notion work choice. Its source is `choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/` in this skill.
- `ntn-commands.md` is in the `using-notion-cli` skill, in `choices/notion-shared/files-to-add/.claude/skills/using-notion-cli/references/` in this skill. That skill's `SKILL.md` says how to run `ntn` in Codex.
- The other reference files named here are in this folder (`choices/notion-shared/reference/notion-memory-pages.md`) or in this skill's `references/` folder (`reference/update.md` and `reference/finishing.md`).

## Contents

- Where the templates are kept
- A new project
- Removing the part a project keeps elsewhere
- Recording the links in PROJECT.md
- Adding work items or memory later
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

When a template is in the trash, ask the owner to restore it from Trash in the Notion app, then run "Checks after any of these".

When the Projects database has no "Project", not even in the trash, do what `choices/notion-shared/notion-setup.md`, "The owner's yes before anything is made", says.

Never add real work to a template, because a copy takes everything on the template with it.

## A new project

Before the first step, two things must be true. The owner has signed in with `ntn login`. The owner has also shared the top-level Notion page that the owner's projects go under with the "Notion CLI" connection. `ntn-commands.md`, "Access and sign-in", says how the owner does both, and what an error means when a page is not shared.

1. **Take the template's id.** Take the id of "Project" from the templates list, and check that the template is not in the trash. "Where the templates are kept" gives the list command and the trash check.
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
5. **Read each database's data source id.** Read it for Work Items, Phases, and Tasks, and for Memories, Facts, and Entities on the Memory page. `choices/notion-shared/reference/notion-memory-pages.md`, "A new project", step 1, shows how to find the databases on the Memory page.

   ```bash
   ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
   ```
6. **Remove the part this project keeps elsewhere**, as the next section says. Skip this step when work items and memory are both in Notion.
7. **Set the ID prefix.** Do this step when work items are in Notion. A copy starts with no prefix.

   ```bash
   ntn api v1/data_sources/<work-items-data-source-id> -X PATCH -d '{"properties":{"ID":{"unique_id":{"prefix":"<PREFIX>"}}}}' < /dev/null | jq -c '.properties.ID.unique_id'
   ```
8. When memory is in Notion, run `choices/notion-shared/reference/notion-memory-pages.md`, "A new project", steps 2 and 4. Step 2 there makes the Lore project row, and step 4 there fills the "Current state" page. Lore is the name of the layout that Notion memory uses.
9. **Fill the project row.** In Notion, fill every field of the project's row that the setup answers cover, such as Tracker, Memory system, Local path, Repository, Salesforce, and Set up on. Ask the owner, in one question, only for the fields that only the owner knows, such as Priority and Target Date.
   - "Key" holds the project's work item ID prefix, wherever the project's work items are kept, for example TKV, or WI for local work items.
   - "Work items data source" and "Memory data source" hold the data source ids of this project's Work Items and Memories databases, when those databases are in Notion.
   - `reference/finishing.md`, "Fill the prompts", fills Desired Outcome at the end of setup, with the sentence the owner gives for the project's outcome.
10. **Record the links** in `PROJECT.md` and read them back. "Recording the links in PROJECT.md" below gives the lines for work items, and `choices/notion-shared/reference/notion-memory-pages.md` gives the memory lines.

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
3. Remove the Memories view "By work item", because that view grouped by the column removed in step 2. List the views with `ntn api v1/views database_id==<memories-database-id> < /dev/null | jq -r '.results[].id'`, read a view's name with `ntn api v1/views/<view-id> < /dev/null | jq -r '.name'`, and remove the view with `ntn api v1/views/<view-id> -X DELETE < /dev/null`.

## Recording the links in PROJECT.md

The Notion choices add two lines to `PROJECT.md`, section "Toolkit settings": "Notion work items" when work items are in Notion, and "Notion memory" when memory is in Notion. The skills read the ids from those lines every time, so write each label exactly as shown. Write the ids as nested bullets under the label line. Add no heading to the section.

When work items are in Notion, add these lines below the Memory line:

```markdown
- Work item ID prefix: `<PREFIX>`
- Notion work items:
  - Project page: <url>
  - Work Items: database <id>, data source <id>
  - Phases: database <id>, data source <id>
  - Tasks: database <id>, data source <id>
  - Projects database: data source <id>
```

`choices/notion-shared/reference/notion-memory-pages.md`, "Recording the links in PROJECT.md", gives the bullets of "Notion memory". When memory is in Notion and work items are kept elsewhere, the section has no "Notion work items" line, and the "Project page" and "Projects database" bullets are the first two bullets under "Notion memory".

## Adding work items or memory later

`reference/update.md`, "Changing a setup choice", runs this section when a project has work items or memory in Notion and adds the other one.

Notion can move a page, but it cannot move a database. So the three memory pages move, and the work databases stay on the page that holds them. A moved page keeps its id. This command moves a page: `ntn api v1/pages/<page-id>/move -d '{"parent":{"type":"page_id","page_id":"<new-parent-id>"}}' < /dev/null`

**Memory into Notion.** Use these steps when the project page holds the work items.

1. Make a temporary row from "Project", as "A new project", steps 1, 3, and 4, says. Title it "<Project name> (temporary, safe to delete)".
2. Add a "Project Memory" heading at the end of the project page, by sending `PATCH v1/blocks/<project-page-id>/children` with one `heading_1` block. Then move the temporary page's Memory page and "Current state" page to the project page. A Terminology glossary page stays on the temporary page.
3. Move the temporary row to the trash, with `PATCH v1/pages/<id>` and `{"in_trash":true}`.
4. Run `choices/notion-shared/reference/notion-memory-pages.md`, "A new project". Its four steps find the memory databases, name the project in Lore's Projects database, record the links, and fill the "Current state" page.
5. The moved Memories, Facts, and Entities databases still link to the temporary Work Items database. Remove their "Work items" column and the Memories view "By work item", as "Removing the part a project keeps elsewhere" says for work items in steps 2 and 3.
6. The memory databases now have no link to this project's work items. Add a "Work items" relation to each of Memories, Facts, and Entities, which points at this project's Work Items database. Send `PATCH v1/data_sources/<id>` with `{"properties":{"Work items":{"relation":{"data_source_id":"<work-items-data-source-id>","type":"dual_property","dual_property":{"synced_property_name":"<Memories, Facts, or Entities>"}}}}}`. The saving of memory uses that relation to link a record to a work item. This project's work item template has no "Linked memory" section. Tell the owner, who can add one in the Notion app. Then fill the memory fields of the project's row, as "A new project", step 9, says.

**Work items into Notion.** Use these steps when the project page holds the memory.

1. Make a new project page from "Project", as "A new project", steps 1 to 7, says. Run step 6 for the memory part, although memory is also in Notion.
2. Copy the old page's Project brief text into the new page with one `update_content` call.
3. Add a "Project Memory" heading at the end of the new page. Then move the old page's Memory page and "Current state" page to the new page, and also its Terminology glossary page when the old page has one.
4. The moved memory databases have no "Work items" relation, because setup removed it when the project kept only its memory in Notion. Add a "Work items" relation to each of Memories, Facts, and Entities, which points at this project's Work Items database. Send `PATCH v1/data_sources/<id>` with `{"properties":{"Work items":{"relation":{"data_source_id":"<work-items-data-source-id>","type":"dual_property","dual_property":{"synced_property_name":"<Memories, Facts, or Entities>"}}}}}`. The saving of memory uses that relation to link a record to a work item. This project's work item template has no "Linked memory" section. Tell the owner, who can add one in the Notion app.
5. Copy the old row's field values into the new row. Then fill the work fields of the new row, as "A new project", step 9, says. In `PROJECT.md`, change the "Project page" bullet and add the work bullets, as "Recording the links in PROJECT.md" says.
6. The old row now holds only its brief. Move the old row to the trash after the owner's yes.

## Checks after any of these

- No row of the Projects database is a template.
  - List the rows with `ntn api v1/data_sources/<projects-data-source-id>/query -d '{"page_size":100}' < /dev/null | jq -r '.results[].id'`. `ntn-commands.md`, "Finding rows", says how to read the rest when one answer does not hold every row.
  - List the templates with `ntn api v1/data_sources/<projects-data-source-id>/templates < /dev/null | jq -r '.templates[].id'`.
  - No row may have a template's id, because a template that comes back as a row shows as a card on the owner's board.
- For a new project, the project page lists only the parts the project keeps in Notion: Work Items, Phases, and Tasks; Memory and "Current state". When the project keeps work items in Notion, its Work Items templates list shows one template with `is_default` true, the ID property shows the project's prefix, and the relations check below passes.
- Each database's relations point at the same project's databases. Check with `ntn api v1/data_sources/<id> < /dev/null | jq '.properties | map_values(select(.type=="relation") | .relation.data_source_id)'`.

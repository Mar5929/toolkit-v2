# Setting up and updating a project's Notion memory

This file gives the Notion steps for a project's memory: the memory steps of setting up a new project, bringing an older project's memory up to the current layout, and building the memory part of a template. Open it when `work-setup.md` or `notion.md` sends you to one of its sections. Its job is done when the project's memory in Notion, or the memory part of the template, has everything the current layout has. For a project, `PROJECT.md` must also hold the ids of the memory pages and databases.

Some of the files named here are in other folders of this skill:

- `database-layout.md`, `views-and-layout.md`, `current-state-page.md`, and the `assets/` files are in the Notion `using-memory-store` skill, which is `assets/memory-notion/.claude/skills/using-memory-store/` in this skill.
- `ntn-commands.md` is in the `using-notion-cli` skill, in `assets/notion-tools/.claude/skills/using-notion-cli/references/` in this skill. That skill's `SKILL.md` says how to run `ntn` in Codex.
- `notion.md`, `finishing.md`, `earlier-versions.md`, and `one-home-layout.md` are in this skill's `references/` folder.

The other files named here are in this folder.

## Contents

- A new project
- Recording the links in PROJECT.md
- Bringing memory up to the current layout
- Building the memory part of a template

## A new project

Before anything else, two things must be true: the owner has signed in (`ntn login`), and the owner has shared the owner's Notion root page, which is the page that holds the owner's projects, with the "Notion CLI" connection. `ntn-commands.md`, "Access and sign-in", says how the sign-in works and how the owner shares a page.

`work-setup.md`, "A new project", makes the project page from the Projects database template "Project". That section runs the four steps below at these points:

- step 1 below at its step 5;
- steps 2 and 4 below at its step 8;
- step 3 below at its step 10.

Adding memory to a Notion project later runs all four steps.

1. **Find the memory databases** on the Memory page, and each one's data source:

   ```bash
   ntn api v1/blocks/<memory-page-id>/children < /dev/null | jq -r '.results[] | select(.type=="child_database") | [.id, .child_database.title] | @tsv'
   ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
   ```
2. **Name the project in Lore's Projects database**, with the command below. Lore is the name of the Notion memory layout. Every memory record links to this row.

   ```bash
   ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<lore-projects-data-source-id>"},
     "properties":{"Name":{"title":[{"text":{"content":"<Project name>"}}]},
       "Type":{"select":{"name":"project"}},"Status":{"select":{"name":"active"}},
       "Path":{"rich_text":[{"text":{"content":"<project folder>"}}]}}}' < /dev/null | jq -r .id
   ```
3. **Record the links** in `PROJECT.md`, as the next section says, and read them back.
4. **Fill the Current state page** with the project's first lines. The Current state page is the Notion page that holds the project's Current State, which is the project's one short page of what is true now.
   - `current-state-page.md`, "Changing it", says how to change the page.
   - `finishing.md`, "The project's Current State", says what the first lines are.

## Recording the links in PROJECT.md

In `PROJECT.md`, section "Toolkit settings", write the nested bullets below under the fixed "Notion memory" line, in place of the prompt. `work-setup.md`, "Recording the links in PROJECT.md", says where the "Project page" and "Projects database" bullets go.

```markdown
- Notion memory:
  - Memory page: <id>
  - Memories: database <id>, data source <id>
  - Facts: database <id>, data source <id>
  - Entities: database <id>, data source <id>
  - Lore Projects: data source <id>; this project's row <id>
  - Topics: data source <id>
  - Current state page: <id>
```

## Bringing memory up to the current layout

An update of the toolkit ("update the toolkit") runs this section. Compare the project with `database-layout.md` and `views-and-layout.md`, and add only what is missing. Never remove, rename, or retype anything, except the one view in step 3, the one heading in step 5, and the one page in step 6 after the owner's yes.

1. For each of Lore's databases and the toolkit's columns, list what the data source has (`ntn api v1/data_sources/<id> < /dev/null | jq -r '.properties | keys[]'`) and add each missing column alone, from its file in `assets/schema/`.
2. When a select lacks an option (for example a Tags type), read the options (`ntn api v1/data_sources/<memories-ds> < /dev/null | jq -c '.properties.Tags.multi_select.options'`) and send all of them plus the missing ones: `{"properties":{"Tags":{"multi_select":{"options":[<every option as read>, {"name":"decision","color":"orange"}]}}}}`. The five type options are listed in `08-memories-type-tags.json`, which is a list and not a request body.
3. When work items are now in Notion and there is no "Work items" relation yet, do these three things:
   - Send `09-memories-work-items-relation.json`, `09-facts-work-items-relation.json`, and `09-entities-work-items-relation.json` to their data sources.
   - Replace a Memories view "By work item" that was made from `12-view-by-work-item-ids.json` (that view is grouped by the Work item IDs column): remove it, then create the view from `12-view-by-work-item.json`.
   - In the work item template, which is the Work Items database's default template, add the "Linked memory" heading and its paragraph from `work-item-page.md` after the Notes section, and before "Linked Github PRs" when the template has it. Give the heading the level that the template's other sections have. Then add its view from file 23 only, as `work-setup.md`, "Building the templates", step 12, shows.
4. Add each missing view from its file in `assets/schema/`.
5. Check the "Current state" page for the two earlier forms below.
   - A page set up before toolkit 0.8.0 has an "Untracked to-dos" heading, which `assets/current-state.md` no longer has.
     - In the "Project" template, the heading holds only its prompt line. Remove the heading and its prompt line with one `update_content` call.
     - In a project, `earlier-versions.md`, "The levels structure (toolkit 0.8.0)", step 6, moves its lines first.
   - A page set up before the current folder layout has the heading "Waiting on the owner" and no "Coming up" or "Standing jobs and shared files". The current folder layout keeps decisions, system rules, terms, and sources as files in the repository.
     - Bring the page to the headings of `assets/current-state.md`, and keep every line, as `one-home-layout.md`, "The project's Current State in the earlier form", says.
     - In the "Project" template, replace the page's text with `assets/current-state.md`.
6. A project or a "Project" template that was set up before the current folder layout has a "Terminology glossary" page beside the Memory page. Memory no longer writes that page: a project term is a row of `system/glossary.md`. Every other memory page stays as it is. `one-home-layout.md` moves only the decision pages, to `DECISIONS.md`.
   - In a project, `one-home-layout.md` moves the page's rows first. After the rows are read back in `system/glossary.md`, ask the owner whether to move the page to Notion's trash (`PATCH v1/pages/<id>` with `{"in_trash":true}`). The page stays until the owner says yes. Then remove the "Terminology glossary page" line from "Toolkit settings" in `PROJECT.md`.
   - In the "Project" template, the page holds only its prompt rows. Ask the same question, so that new projects start without the page.
7. Tell the owner in one short list what was added and what was removed.

## Building the memory part of a template

The template build in `work-setup.md` uses this section. That build runs steps 1 to 4 below, then builds the work databases, then runs steps 5 to 7 below. "The template page" below is the Projects database template "Project".

1. Under the template page, make a page titled "Memory" with `POST v1/pages`, with `memory-page.md` as `"markdown"`.
2. Make Lore's databases, in order, from `assets/schema/01…05`. Put the Memory page's id in place of `{{MEMORY_PAGE_ID}}`, and put the id of the data source made before it in place of each relation's `{{…_DS}}`.
3. Then send 06 (Lore's own Memories relations) and 07 (the toolkit's columns) to Memories, and then the Tags options from 08. Step 2 of "Bringing memory up to the current layout" shows the body for the Tags options.
4. Under the template page, make a "Current state" page from `assets/current-state.md`.
5. Send the three 09 files, each as `PATCH v1/data_sources/<id>` to its own database.
6. Read the property ids of Memories, as `ntn-commands.md`, "Filling a body from an asset", shows. Then make the views:
   - Rename the first view with 10. Send only its `name`, `filter`, `sorts`, and `configuration` as `PATCH v1/views/<first view id>`.
   - Create 11, `12-view-by-work-item.json`, and 13 as `POST v1/views`.
7. Set the column order, and then ask the owner for the page layout.
   - For the column order, each table view of Memories (Index, Decisions, By work item, Retired) and the first view of Facts, Entities, Topics, and Projects gets `{"configuration":{"type":"table","properties":[…]}}` as `PATCH v1/views/<id>`. The body lists every property in the order of `views-and-layout.md`, "Property order and page layout", with the hidden ones `false`.
   - Only the Notion app can set the page layout of Memories, Facts, Entities, and Projects. It is set once per template, and every copy keeps it. Ask the owner to set it, give the owner the clicks from `views-and-layout.md`, "Property order and page layout", one database at a time, and wait until the owner says it is done.
   - Never set the page layout yourself unless the owner names the Notion page as the owner's private test area and says you may use the owner's signed-in Chrome.

# Setting up and updating a project's Notion memory

Purpose: the memory steps of onboarding, bringing an older project's
memory up to the current layout, and building the memory part of a
template. `database-layout.md`, `views-and-layout.md`,
`current-state-page.md`, and the `assets/` files are in the Notion
`storing-project-memory` skill,
`assets/.skill-sets/notion-memory/storing-project-memory/` in this skill.
`ntn-commands.md` is in the `using-notion-cli` skill,
`assets/.skill-sets/notion-tools/using-notion-cli/references/` in this skill;
running `ntn` in Codex is in that skill's `SKILL.md`. The other files named
here are in this folder.

## Contents

- A new project
- Recording the links in PROJECT.md
- Bringing memory up to the current layout
- Building the memory part of a template

## A new project

Before anything: the owner has signed in (`ntn login`) and shared his
Notion root page, the page that holds his projects, with the "Notion CLI"
connection (`ntn-commands.md`, "Access and sign-in").

The project page is made from the Projects database template "Project" by
`work-setup.md`, "A new project", which runs step 1 below at its step 5,
steps 2 and 4 at its step 8, and step 3 at its step 10. Adding memory to a
Notion project later runs all four.

1. **Find the memory databases** on the Memory page, and each one's data
   source:

   ```bash
   ntn api v1/blocks/<memory-page-id>/children < /dev/null | jq -r '.results[] | select(.type=="child_database") | [.id, .child_database.title] | @tsv'
   ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
   ```
2. **Name the project in Lore's Projects database** (every record links to
   this row):

   ```bash
   ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<lore-projects-data-source-id>"},
     "properties":{"Name":{"title":[{"text":{"content":"<Project name>"}}]},
       "Type":{"select":{"name":"project"}},"Status":{"select":{"name":"active"}},
       "Path":{"rich_text":[{"text":{"content":"<project folder>"}}]}}}' < /dev/null | jq -r .id
   ```
3. **Record the links** in `PROJECT.md` (next section) and read them back.
4. **Fill the Current state page** with the project's first lines
   (`current-state-page.md`, "Changing it"; `references/finishing.md` in
   this skill says what they are).

## Recording the links in PROJECT.md

`PROJECT.md`, section "Toolkit settings", gets these lines in its
`### Notion` block:

```markdown
- Memory page: <id>
- Memories: database <id>, data source <id>
- Facts: database <id>, data source <id>
- Entities: database <id>, data source <id>
- Lore Projects: data source <id>; this project's row <id>
- Topics: data source <id>
- Current state page: <id>
- Terminology glossary page: <id>
```

## Bringing memory up to the current layout

Onboarding's "update the toolkit" runs this. Compare the project with
`database-layout.md` and `views-and-layout.md`, and add only what is
missing; never remove, rename, or retype anything, except the one view in
step 3 and the one heading in step 5.

1. For each of Lore's databases and the toolkit's columns, list what the
   data source has
   (`ntn api v1/data_sources/<id> < /dev/null | jq -r '.properties | keys[]'`)
   and add each missing column alone, from its file in `assets/schema/`.
2. A select missing an option (for example a Tags type): read the options
   (`ntn api v1/data_sources/<memories-ds> < /dev/null | jq -c '.properties.Tags.multi_select.options'`)
   and send all of them plus the missing ones:
   `{"properties":{"Tags":{"multi_select":{"options":[<every option as read>, {"name":"decision","color":"orange"}]}}}}`.
   The five type options are listed in `08-memories-type-tags.json` (a list,
   not a request body).
3. Work items now in Notion but no "Work items" relation yet: send
   `09-memories-work-items-relation.json`, `09-facts-work-items-relation.json`,
   and `09-entities-work-items-relation.json` to their data sources. A
   Memories view "By work item" made from `12-view-by-work-item-ids.json`
   (grouped by the Work item IDs column) is replaced: remove it, then
   create `12-view-by-work-item.json`. In the work item template, the Work
   Items database's default template, add the "Linked memory" heading and
   its paragraph from `work-item-page.md` after the Notes section, then its
   view from file 23 only (`work-setup.md`, "Building the templates", step
   12).
4. Views: add a missing view from its file in `assets/schema/`.
5. The "Current state" page: a page set up before toolkit 0.8.0 has an
   "Untracked to-dos" heading, which `assets/current-state.md` no longer
   has. In the "Project" template the heading holds only its prompt line:
   remove both with one `update_content` call. In a project, `update.md`,
   "The levels structure (toolkit 0.8.0)", step 6, moves its lines first.
6. Tell the owner in one short list what was added.

## Building the memory part of a template

Used by the template build in `work-setup.md`, which runs steps 1 to 4,
then builds the work databases, then runs steps 5 to 7. "The template
page" below is the Projects database template "Project".

1. Under the template page, `POST v1/pages` a page titled "Memory" with
   `memory-page.md` as `"markdown"`.
2. Lore's databases, in order, from `assets/schema/01…05` with
   `{{MEMORY_PAGE_ID}}` the Memory page and each relation's
   `{{…_DS}}` the data source made before it.
3. Then 06 (Lore's own Memories relations) and 07 (the toolkit's columns)
   on Memories; the Tags options from 08 (step 2 of the update above shows
   the body).
4. Under the template page, a "Current state" page from
   `assets/current-state.md` and a "Terminology glossary" page from
   `assets/terminology-glossary.md`.
5. The three 09 files, each as `PATCH v1/data_sources/<id>` to its own
   database.
6. Property ids of Memories (`ntn-commands.md`, "Filling a body from an
   asset"), then the views: rename the
   first view with 10 (send only its `name`, `filter`, `sorts`, and
   `configuration` as `PATCH v1/views/<first view id>`), and create 11,
   `12-view-by-work-item.json`, and 13 as `POST v1/views`.
7. Column order: each table view of Memories (Index, Decisions, By work
   item, Retired) and the first view of Facts, Entities, Topics, and
   Projects gets `{"configuration":{"type":"table","properties":[…]}}` as
   `PATCH v1/views/<id>`: every property in the order of
   `views-and-layout.md`, "Property order and page layout", hidden ones
   `false`. Then the page
   layout of Memories, Facts, Entities, and Projects, which only the Notion
   app can set, once per template (every copy keeps it): ask the owner to
   set it, give him the clicks from `views-and-layout.md`, "Property order and
   page layout", one database at a time, and wait until he says it is
   done. Never set the page layout yourself unless the owner names the
   Notion page as his private test area and says you may use his signed-in
   Chrome.

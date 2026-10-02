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

1. **Which template.** Work and memory both in Notion: onboarding uses the
   Projects database template "Project: work and memory" (`work-setup.md`
   makes the project page; continue at step 3). Memory only (work items local or on GitHub): use the template
   "Project: memory only", as a row of the owner's own Projects database
   (`<projects-data-source-id>`, title column `Project`; not Lore's
   Projects database on a Memory page, whose title column is `Name`):

   ```bash
   ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<projects-data-source-id>"},
     "properties":{"Project":{"title":[{"text":{"content":"<Project name>"}}]}},
     "template":{"type":"template_id","template_id":"<memory-only-template-id>"}}' < /dev/null | jq -r '.id, .url'
   ```

   Find the template's id in the Projects database's templates list
   (`ntn-commands.md`, "Database templates"). The templates live in the
   Projects database; if the owner has no Projects database, stop and ask
   him to make one in Notion; if the templates list has no "Project: memory
   only", build the templates first (`work-setup.md`, "Building the
   templates").
2. **Wait** until the copy is filled: the project page lists Memory,
   Current state, and Terminology glossary (`ntn-commands.md`, "Waiting for
   a template").
3. **Find the memory databases** on the Memory page, and each one's data
   source:

   ```bash
   ntn api v1/blocks/<memory-page-id>/children < /dev/null | jq -r '.results[] | select(.type=="child_database") | [.id, .child_database.title] | @tsv'
   ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
   ```
4. **Name the project in Lore's Projects database** (every record links to
   this row):

   ```bash
   ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<lore-projects-data-source-id>"},
     "properties":{"Name":{"title":[{"text":{"content":"<Project name>"}}]},
       "Type":{"select":{"name":"project"}},"Status":{"select":{"name":"active"}},
       "Path":{"rich_text":[{"text":{"content":"<project folder>"}}]}}}' < /dev/null | jq -r .id
   ```
5. **Record the links** in `PROJECT.md` (next section) and read them back.
6. **Fill the Current state page** with the project's first lines
   (`current-state-page.md`, "Changing it"; `references/finishing.md` in
   this skill says what they are).

## Recording the links in PROJECT.md

`PROJECT.md`, section "Toolkit settings", gets these lines in its
`### Notion` block (in a memory-only project, add the `### Notion` heading
first):

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

(With a memory-only template, also `- Project page: <url>` and
`- Projects database: data source <id>`.)

## Bringing memory up to the current layout

Onboarding's "update the toolkit" runs this. Compare the project with
`database-layout.md` and `views-and-layout.md`, and add only what is
missing; never remove, rename, or retype anything.

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
   and `09-entities-work-items-relation.json` to their data sources, and add
   a "Linked memory" view to the work item template, the Work Items
   database's default template (`work-setup.md`).
4. Views: add a missing view from its file in `assets/schema/`.
5. Tell the owner in one short list what was added.

## Building the memory part of a template

Used by the template build in `work-setup.md` (and for
the Projects database template "Project: memory only", made the same way
with `project-page-memory-only.md` as its page text). "The template
page" below is the Projects database template being built: "Project: work
and memory" when `work-setup.md` calls this, or
"Project: memory only" when it is built on its own.

1. Under the template page, `POST v1/pages` a page titled "Memory" with
   `memory-page.md` as `"markdown"`.
2. Lore's databases, in order, from `assets/schema/01…05` with
   `{{MEMORY_PAGE_ID}}` the Memory page and each relation's
   `{{…_DS}}` the data source made before it.
3. Then 06 (Lore's own Memories relations) and 07 (the toolkit's columns)
   on Memories; the Tags options from 08 (step 2 of the update above shows
   the body).
4. With work items in the same template: the three 09 files, each as
   `PATCH v1/data_sources/<id>` to its own database.
5. Property ids of Memories (`ntn-commands.md`, "Filling a body from an
   asset"), then the views: rename the
   first view with 10 (send only its `name`, `filter`, `sorts`, and
   `configuration` as `PATCH v1/views/<first view id>`), and create 11, 12
   (or `12-view-by-work-item-ids.json` without work items), and 13 as
   `POST v1/views`.
6. Column order: each table view of Memories (Index, Decisions, By work
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
7. Under the template page, a "Current state" page from
   `assets/current-state.md` and a "Terminology glossary" page from
   `assets/terminology-glossary.md`.

# Setting up a project's Notion memory

This file gives the Notion steps for the memory of a new project. Open it when `choices/notion-shared/reference/notion-work-item-pages.md` or `choices/notion-shared/notion-setup.md` sends you to one of its sections. Its job is done when `PROJECT.md` holds the ids of the memory pages and databases, the project is named in Lore's Projects database, and the Current state page holds the project's first lines.

Some of the files named here are in other folders of this skill:

- `current-state-page.md` is added to `managing-project-memory` by the Notion memory choice. Its source is `choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/` in this skill.
- `ntn-commands.md` is in the `using-notion-cli` skill, in `choices/notion-shared/files-to-add/.claude/skills/using-notion-cli/references/` in this skill. That skill's `SKILL.md` says how to run `ntn` in Codex.
- `choices/notion-shared/notion-setup.md` and `reference/finishing.md` are in this skill's `references/` folder.

## Contents

- A new project
- Recording the links in PROJECT.md

## A new project

Before anything else, two things must be true: the owner has signed in (`ntn login`), and the owner has shared the owner's Notion root page, which is the page that holds the owner's projects, with the "Notion CLI" connection. `ntn-commands.md`, "Access and sign-in", says how the sign-in works and how the owner shares a page.

`choices/notion-shared/reference/notion-work-item-pages.md`, "A new project", makes the project page from the Projects database template "Project". That section runs the four steps below at these points:

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
   - `reference/finishing.md`, "The project's Current State", says what the first lines are.

## Recording the links in PROJECT.md

In `PROJECT.md`, section "Toolkit settings", add the "Notion memory" line at the end of the section, with the nested bullets below. `choices/notion-shared/reference/notion-work-item-pages.md`, "Recording the links in PROJECT.md", says where the "Project page" and "Projects database" bullets go.

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

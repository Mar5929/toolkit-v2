# Setting up a project's Notion Project Wiki

Use this file to connect the Project Wiki copied from the owner's Project template. Setup is done when the project's destinations and relations are verified, its links are recorded, and Current state reflects the setup answers.

## A new project

1. Find Project Wiki under the new project page. Traverse its children to find Wiki Inbox, Current state, Long-Term Memory, Terminology Glossary and Product Wiki. Traverse Long-Term Memory to find Memories, Facts, Entities, Projects and Topics. Use the project's copies, not the template's descendant IDs.
2. Read each database and its data sources. Inspect the live properties, relations and available templates before writing. `managing-project-memory` supplies the destination references. The librarian is `maintaining-notion-wiki`, which files captures into the wiki.
3. Check that copied relations point to this project's collections, including relations among the long-term collections and Product Wiki's self-relation. When work items are in Notion, check their memory relations too. Identify template or other-project targets and repair them within the approved setup scope before writing records. Never change the owner's source template.
4. Find this project's row in the copied Lore Projects collection. Lore names the Long-Term Memory layout; its Projects collection is separate from the owner's Projects database. Reuse a matching row; otherwise create one using its live schema and the confirmed project name and local path. Verify the row before linking records to it.
5. Record the links below and read them back. Confirm that the configured connection can read every destination and write Wiki Inbox. The Notion memory setup file then publishes the librarian and initializes Current state.

For traversal, pagination, schema reads and verified writes, use `using-notion-cli`. Its shipped source is [files-to-add/.claude/skills/using-notion-cli/SKILL.md](../files-to-add/.claude/skills/using-notion-cli/SKILL.md). If a required destination or property is missing, report the difference and agree the fix with the owner before continuing that part of setup.

## Recording the links in PROJECT.md

Add these nested bullets under `Notion memory` in `PROJECT.md`, section `Toolkit settings`. Record each page's URL and ID, and each database's ID and data source ID. Keep these labels so later sessions can find the configured destinations.

```markdown
- Notion memory:
  - Project Wiki page: <url>, page <id>
  - Librarian processing skill: <url>, page <id>
  - Librarian project context: <url>, page <id>
  - Wiki Inbox: database <id>, data source <id>
  - Current state page: <id>
  - Long-Term Memory page: <url>, page <id>
  - Terminology Glossary: database <id>, data source <id>
  - Product Wiki: database <id>, data source <id>
  - Memories: database <id>, data source <id>
  - Facts: database <id>, data source <id>
  - Entities: database <id>, data source <id>
  - Lore Projects: database <id>, data source <id>; this project's row <id>
  - Topics: database <id>, data source <id>
  - Librarian schedule: <confirmed scheduler, cadence, timezone, access and run reference; or pending setup>
```

[notion-project-pages.md](notion-project-pages.md), "Recording the links in PROJECT.md", gives the Project page and Projects database bullets. Record any agreed differences in destination names or schemas alongside their configured links. Scheduler selection and access checks belong to [choices/memory/notion/notion-memory-setup.md](../../memory/notion/notion-memory-setup.md).

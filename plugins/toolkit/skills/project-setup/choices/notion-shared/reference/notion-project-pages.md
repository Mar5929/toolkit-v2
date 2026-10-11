# Making a project's pages in Notion

This file gives the Notion steps for a project that keeps its work items or its memory in Notion. Open it for one of two jobs: setting up a new Notion project, or adding work items or memory to a Notion project later. A job is done when its steps are finished and the checks in "Checks after any of these" pass. Step 4 of [notion-setup.md](../notion-setup.md) uses "A new project", and the closing lines of that file name "Adding work items or memory later" and "Checks after any of these".

Every Notion project is a copy of the owner's "Project" template. The template is the owner's. Setup copies it and never changes it, and the toolkit does not build it.

This file names files that are kept in two places:

- `ntn-commands.md` is in the `using-notion-cli` skill. Its source in this skill is [choices/notion-shared/files-to-add/.claude/skills/using-notion-cli/references/ntn-commands.md](../files-to-add/.claude/skills/using-notion-cli/references/ntn-commands.md). That skill's `SKILL.md` says how to run `ntn` in Codex.
- The other reference files named here are in this folder ([notion-memory-pages.md](notion-memory-pages.md)) or in this skill's `reference/` folder ([reference/update.md](../../../reference/update.md) and [reference/finishing.md](../../../reference/finishing.md)).

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
- The memory part is Project Wiki. It holds Wiki Inbox, Current state, Long-Term Memory, Terminology Glossary and Product Wiki. Long-Term Memory contains the Lore collections.

Inside "Project", the Work Items database has one template, the work item template, which is set as the default template of that database. The title of the work item template is empty. So the title that the owner types on a card is kept, and the boards' empty-title filter hides the template. Every project made from "Project" has the work item template, still set as the default.

To list the templates of a database, run the command below. `ntn-commands.md`, "Database templates", explains this call and the default template.

```bash
ntn api v1/data_sources/<projects-data-source-id>/templates < /dev/null | jq -r '.templates[] | "\(.id)\t\(.is_default)\t\(.name)"'
```

The list also shows templates that are in Notion's trash. A template in the trash cannot be used, and "New" makes blank cards while the work item template is in the trash. Before you use a template, check that `ntn api v1/pages/<template-id> < /dev/null | jq .in_trash` is `false`.

Never restore a template through the API (`in_trash` false). Notion's documentation does not say that a template restored through the API comes back as a template, and on 2026-10-02 one restored that way did not give the owner a working template.

When a template is in the trash, ask the owner to restore it from Trash in the Notion app, then run "Checks after any of these".

When the Projects database has no "Project", not even in the trash, do what [what-setup-may-do-in-the-owners-notion.md](what-setup-may-do-in-the-owners-notion.md), "The owner's yes before anything is made", says.

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
4. **Wait** until the copy is filled. The copy is filled when the project page lists Project Wiki and the Work Items, Phases, and Tasks databases, and the required descendants of Project Wiki have appeared. [notion-memory-pages.md](notion-memory-pages.md), "A new project", names those descendants. `ntn-commands.md`, "Waiting for a template", says how often to check and when to stop waiting. This command lists what the page holds:

   ```bash
   ntn api v1/blocks/<project-page-id>/children page_size==100 < /dev/null | jq -r '.results[] | select(.type=="child_database" or .type=="child_page") | [.type, .id, (.child_database.title // .child_page.title)] | @tsv'
   ```
5. **Read each database's data source id.** Read it for Work Items, Phases and Tasks. When memory is in Notion, [notion-memory-pages.md](notion-memory-pages.md), "A new project", finds and verifies all Project Wiki destinations.

   ```bash
   ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
   ```
6. **Remove the part this project keeps elsewhere**, as the next section says. Skip this step when work items and memory are both in Notion.
7. **Set the ID prefix.** Do this step when work items are in Notion. A copy starts with no prefix.

   ```bash
   ntn api v1/data_sources/<work-items-data-source-id> -X PATCH -d '{"properties":{"ID":{"unique_id":{"prefix":"<PREFIX>"}}}}' < /dev/null | jq -c '.properties.ID.unique_id'
   ```
8. When memory is in Notion, run [notion-memory-pages.md](notion-memory-pages.md), "A new project". That procedure verifies the copied wiki, connects its Lore project row and records how Current state is initialized at the finish of setup.
9. **Fill the project row.** In Notion, fill every field of the project's row that the setup answers cover, such as Tracker, Memory system, Local path, Repository, Salesforce, and Set up on. Ask the owner, in one question, only for the fields that only the owner knows, such as Priority and Target Date.
   - "Key" holds the project's work item ID prefix, wherever the project's work items are kept, for example IML, or WI for local work items.
   - "Work items data source" holds this project's Work Items data source ID. "Memory data source" holds its Wiki Inbox data source ID, because Wiki Inbox is the capture destination. Verify the project row's live property types before filling them.
   - Desired Outcome is filled at the end of setup, with the sentence the owner gives for the project's outcome. The step for the project's outcome in [choices/work-items/notion/notion-work-items-setup.md](../../work-items/notion/notion-work-items-setup.md) and in [choices/memory/notion/notion-memory-setup.md](../../memory/notion/notion-memory-setup.md) fills it, and [reference/finishing.md](../../../reference/finishing.md), "Fill the prompts", gives the rules for the sentence.
10. **Record the links** in `PROJECT.md` and read them back. "Recording the links in PROJECT.md" below gives the lines for work items, and [notion-memory-pages.md](notion-memory-pages.md) gives the memory lines.

## Removing the part a project keeps elsewhere

Run this section only on a page, or on databases, copied from the template in this run, before anything is saved in them.

To list the page's blocks with their ids, run this command:

```bash
ntn api v1/blocks/<page-id>/children page_size==100 < /dev/null | jq -r '.results[] | [.type, .id, (.child_database.title // .child_page.title // ((.[.type].rich_text // []) | map(.plain_text) | join("")))] | @tsv'
```

To remove a block, run `ntn api v1/blocks/<block-id> -X DELETE < /dev/null`. The block goes to Notion's trash. A page or a database goes to the trash with everything in it.

**When memory is local or in Hindsight,** remove the copied Project Wiki and its associated heading. Inspect Work Items and its template, and remove relations or views that point into that discarded copy. Keep this project's local documentation procedure.

**When work items are local or on GitHub,** remove the copied Work Items, Phases and Tasks databases and their associated headings. Inspect the wiki's live relations and views, and remove those that depend on the discarded work databases. Wiki records can link to the configured tracker through source links instead.

Verify that the retained pages, database properties and views have no references to the discarded copies. Apply these changes only to empty copies made during this setup.

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

[notion-memory-pages.md](notion-memory-pages.md), "Recording the links in PROJECT.md", gives the bullets of "Notion memory". When memory is in Notion and work items are kept elsewhere, the section has no "Notion work items" line, and the "Project page" and "Projects database" bullets are the first two bullets under "Notion memory".

## Adding work items or memory later

[reference/update.md](../../../reference/update.md), "Changing a setup choice", runs this section when a project has work items or memory in Notion and adds the other one.

For any existing project, propose a review and migration batch.

Use [reference/update.md](../../../reference/update.md), "Changing a setup choice", for the batch approval and preservation procedure. Inspect the existing project and current template before proposing the changes. Reuse the project's working destinations where possible, and verify any new copies and relation targets before recording their IDs. Preserve original records and the current routing until the agreed destinations have been verified.

## Checks after any of these

- No row of the Projects database is a template.
  - List the rows with `ntn api v1/data_sources/<projects-data-source-id>/query -d '{"page_size":100}' < /dev/null | jq -r '.results[].id'`. `ntn-commands.md`, "Finding rows", says how to read the rest when one answer does not hold every row.
  - List the templates with `ntn api v1/data_sources/<projects-data-source-id>/templates < /dev/null | jq -r '.templates[].id'`.
  - No row may have a template's id, because a template that comes back as a row shows as a card on the owner's board.
- For a new project, the project page lists only the parts the project keeps in Notion: Work Items, Phases and Tasks; Project Wiki and its required destinations. When the project keeps work items in Notion, its Work Items templates list shows one template with `is_default` true, the ID property shows the project's prefix, and the relations check below passes.
- When memory is in Notion, every configured wiki destination is readable, Wiki Inbox is writable, and its processing statuses are available. Current state can be read by the session-start hook. The librarian schedule is confirmed or explicitly recorded as pending.
- Each database's relations point at the same project's databases. Check with `ntn api v1/data_sources/<id> < /dev/null | jq '.properties | map_values(select(.type=="relation") | .relation.data_source_id)'`.
- Recorded descendant IDs belong to the copied project, not the owner's template. Read `PROJECT.md` back and compare each recorded ID with the destination inspected.

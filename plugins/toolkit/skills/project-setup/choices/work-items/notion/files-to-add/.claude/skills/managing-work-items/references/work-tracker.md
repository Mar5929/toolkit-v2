# Work items kept in Notion

Use this reference to read, create, change, and find work items in a project that keeps its work items in Notion. The goal is to read and write each work item consistently with the lifecycle rules.

This reference says where a work item is kept in Notion and how to save to it. The lifecycle rules decide what happens next: what to save and when, a work item's State, and each approval. `using-notion-cli` says how to run each Notion call.

## Where work belongs

Each project has its own Work Items, Phases and Tasks databases. Read their configured page and data source IDs from `PROJECT.md`, under Notion work items; use this project's copies rather than workspace-wide or template databases.

- A work item tracks a change or outcome through its requirements, design, approvals and delivery. Create it in Work Items with the database's default template. Notion supplies its page and Solution Design child page.
- A project phase organizes the project's roadmap. Its Work item relation is empty; top-level work items link to it through Phase.
- A work-item phase organizes that item's roadmap and links to the owning work item. Use phases when they help organize the work; otherwise keep a plain task and sub-item plan. Follow the lifecycle's Levels rules.
- A work-item task is a step toward one item's goal when a separate sub-work item is unnecessary. Link it to that work item and, when applicable, its phase.
- A project task tracks operational or administrative work outside a work item. Leave Work item and Phase empty. Product or architecture changes use work items rather than bypassing their lifecycle as administrative tasks.
- A sub-work item links to its parent through Parent item. Preserve the three-level work-item limit and the lifecycle's phase and task ID rules.

The project's board is its Work Items views. The project page shows its roadmap, top-level work items and project tasks; an item's views show its own plan. Set the owning relations explicitly and verify their targets, because creating a row through a view does not establish ownership.

## The owner's Notion describes a work item

The owner built the databases, their views, the work item template, and the Solution Design page inside that template in the Notion app. The owner changes them there. This skill does not describe them, so read them from Notion.

- To learn what a work item's page holds, read the page. A work item's page can have other sections than `assets/work-item-template.md`, and then the page is right.
- To learn the properties of a database and their options, read the database. [work-tracker-commands.md](work-tracker-commands.md) gives the call.
- Never build or rebuild a template, a database, a view, or a property through a Notion call. When one is missing, tell the owner. The owner makes it or restores it in the Notion app.
- Never rename or remove a property, a view, or a section of a template.
- Never add work to a template. The templates are the "Project" template in the owner's Projects database, and the work item template. Every copy that Notion makes from a template takes along what the template holds.

## Properties and record content

Read the live database schema and the generated page before filling a record. Fill and keep current every applicable editable property supported by the request, evidence or lifecycle defaults, including ownership relations, State, Status, Summary, Next action and Waiting on. Preserve system-managed properties and unrelated owner values. Record unknown owner decisions as open questions; never invent approvals, dates or assignees to fill a field.

Follow the generated template's prompts and retain its guide lines. Use relevant sections and preserve its child pages and views. The template owns the page structure; the skill owns the operational procedure.

## Steps for every read and every save

1. Read the ids from `PROJECT.md`. Before your first Notion read or write in a session, open `using-notion-cli`, whatever tool you use. That skill says how to sign in, how to run a call, and what to do when a call fails.
2. In this turn, read again what you will look at or change. Never answer from an earlier read, because the owner edits in Notion, and the owner's edit is the one to keep.
3. Open [work-tracker-page-updates.md](work-tracker-page-updates.md) for creation, page updates, designs, phases, tasks, and sub-items. Use [work-tracker-commands.md](work-tracker-commands.md) for the matching API call.
4. Read the changed page or row back, and check that it says what you wrote. When a save failed, or reads back differently, report it as `references/lifecycle-rules.md`, section "Rules that apply in every State", says. That section gives the words your reply must start with.

These rules apply to every read and every save:

- Never delete a page, a row, a phase, or a task. Take it out of view instead: set a phase or a task to Cancelled, or tick a work item's Archived box. When the owner wants it deleted, ask the owner to delete it in Notion.
- Leave out archived work items unless the owner asks for them.

## Procedures and API calls

| File | Open it when |
| --- | --- |
| [work-tracker-page-updates.md](work-tracker-page-updates.md) | You create or update work-item content, a design, phases, tasks, or sub-items; it gives their procedures and exact field values. |
| [work-tracker-commands.md](work-tracker-commands.md) | You need the API call for creation, updates, queries, or comments. |
| [work-tracker-known-problems.md](work-tracker-known-problems.md) | A call fails, a record is missing or malformed, or the owner changed the record by hand. |

## Writing a record's ID in a work item

Write the ID of a record that `filing-project-records` saved once the save is on the default branch. Work items are not kept in the main checkout, so no wait is recorded for the main checkout. A source's line under Notes, Sources may also hold the web address of the file on the default branch.

## The templates for a work item and its design

Notion makes a work item from the database's default template, with its Solution Design page, so `assets/work-item-template.md` is not used. `assets/design-template.md` is used only to make a missing Solution Design page. A work item's design is its Solution Design page. When the page is missing, [work-tracker-page-updates.md](work-tracker-page-updates.md), section "The Solution Design page", says what to do.

## How a helper opens a work item by ID

Read `PROJECT.md` for the Work Items data source ID and the installed `using-notion-cli` access procedure. Query the numeric part of the work-item ID, using the confirmed prefix:

```bash
ntn api v1/data_sources/<work-items-data-source-id>/query -d '{"filter":{"and":[{"property":"ID","unique_id":{"equals":31}},{"property":"Work item","title":{"is_not_empty":true}},{"property":"Archived","checkbox":{"equals":false}}]}}' < /dev/null
```

Use the matched page ID to read its properties and text:

```bash
ntn api v1/pages/<page-id> < /dev/null
ntn api v1/pages/<page-id>/markdown < /dev/null
```

Read the Solution Design child page named in that text in the same way. When the helper lacks access, give it freshly read text and properties and have it name that evidence in its report.

## Related work

| For | Use |
| --- | --- |
| Deciding what happens next: what to save and when, a State, or an approval | Follow `references/lifecycle-rules.md` in this skill. |
| Every Notion read or write: sign-in, Codex, the form of each call, and errors | `using-notion-cli` |
| Moving the work items to another place where work items can be kept, such as local files or GitHub Issues | `project-setup` |

---
name: notion-work-track
description: 'Finds, creates, and changes work items in Notion: lookups, fields, phases, tasks, questions, sub-items, comments, and files, so each read and write matches the tracker. Use when finding or changing an item, such as "show me WI-31" or "add a task to phase 2". Not for closing or cancelling; use work-finish. Only for projects that track work in Notion.'
---

# Notion work tracking: find, create, and change

This project tracks its work in Notion. Every lookup, create, or change of
a work item, phase, or task goes through the steps here. The work skills
decide what to change; this skill says how it is stored and found.

## How a work item is stored in Notion

- Each project has three databases: **Work Items**, **Phases**, **Tasks**.
- A work item has at most **three levels**: parent, child, grandchild.
  Work smaller than an item is a task, never a fourth level. Never call
  the top level an epic.
- A **phase** groups a parent's sub-items and tasks. It is a row of Phases,
  never a work item. Plans change by changing rows: add, reorder (Order),
  merge, drop (Cancelled), move items between phases (their "Phase").
- A **task** is a row of Tasks, mostly on the lowest-level items.
- Every item's page is made from the **work item template**, the default
  template of the Work Items database: Overview (Goal, the Current state
  block, Related items), Roadmap, Sub-items (board by phase), Tasks, Recent
  History, Requirements, Questions and Answers (a toggle heading), Notes
  (with Sources), Linked memory, and a Solution Design child page. The four
  views on the page are live; the rest is text.
- **Approvals stay on the item**: Requirements approved, Design approved,
  Result approved (`YYYY-MM-DD by <name>`), with the owner's words in
  Questions and Answers.
- Ids live in `PROJECT.md`, section "Toolkit settings", Notion block.

## Steps for any lookup or change

1. Read the ids from `PROJECT.md`. In Codex, run each `ntn` command alone
   with escalated permissions (`references/notion-access.md`, "In Codex").
   Check `ntn whoami` works; if it still fails, the owner signs in
   (`references/notion-access.md`).
2. Read what you will look at or change, fresh in this turn
   (`references/ntn-basics.md`; the lookups are in `references/queries.md`).
   Never answer from an earlier read: the owner edits in Notion.
3. Make the change with the steps in the matching reference (References
   below).
4. Read the changed page or row back and check the change is saved. If it
   is not, tell the owner "Not saved" and give the fix.
5. Rewrite the item's Current state (the five lines under the Overview's
   "Current state" heading) in place, so every line is true and "Last
   updated" has today's date; never add to it. Copy Next action into the
   Next action property in the same step. Add a Recent History row when
   `references/items.md`, "Recent History rows", says to.

## Rules

- Never set Done on your own: ask the owner first and record his words.
  He may set Done himself in Notion; that counts.
- The chat that runs the item makes every change. Helper agents report back
  and never edit work items.
- Never delete a page, row, phase, or task. Cancel or archive it instead,
  as `references/items.md` and `references/planning.md` say. When the owner
  wants it deleted, ask him to delete it himself in Notion.
- Moving work items to another tracker: use the project-setup skill.
- The owner's edits in Notion win. Never undo a change he made by hand.
- Never add work to a template: the three project templates in the owner's
  Projects database, or a Work Items database's work item template.

## Gotchas

- End every `ntn api` call with `< /dev/null`, or it can wait on standard
  input until it times out. If one still hangs, stop only that call; never
  `pkill` or `killall` (`references/ntn-basics.md`, "One call").
- `old_str` in a text edit must match the page text exactly, as read:
  prompts come back as `\<…\>`, table cells one `<td>` per line. In JSON,
  each backslash is doubled.
- Never use `replace_content` on a work item page: the views in it block it,
  and it would rewrite the owner's edits.
- A page made from a template gets its content only after the create call
  returns. Wait until the content is there (`references/ntn-basics.md`,
  "Waiting for a template to finish") before editing, and never apply a
  template twice.
- In a project, Notion lists the work item template as a row of Work
  Items, with an empty title and usually ID 1. Leave out rows with an empty
  title in every Work Items query, except "Cards with no title" in
  `references/queries.md`.
- Leave out archived items unless the owner asks for them.
- Query results come in pages of 100: follow `next_cursor` when `has_more`
  is true. Relations come back as page ids: read the page to get its ID and
  title. The Roadmap, Sub-items, and Tasks sections on a page are views,
  shown in the page text only as `<database …>` lines: read their rows with
  the tree queries.
- Sending a relation, Files, or Tags value replaces the whole list: read the
  current list first and send it back with your change.
- Attach an uploaded file within one hour of uploading it; after that the
  upload expires.
- A 404 means the page is not shared with the "Notion CLI" connection or
  its id is wrong, not that the page is gone (`references/notion-access.md`,
  "When a call fails").

## References

| File | Open it when |
| --- | --- |
| [references/notion-access.md](references/notion-access.md) | Signing in, a page cannot be found, running in Codex, or any call fails. |
| [references/ntn-basics.md](references/ntn-basics.md) | Before your first call in a session: how to write an `ntn api` call, read properties, edit page text, and fill asset bodies. |
| [references/queries.md](references/queries.md) | Finding or reading items: one item, the board, open questions, a parent's tree, a search, a saved file, cards with no title. |
| [references/items.md](references/items.md) | Creating or changing a work item, its text, approvals, or its design page. |
| [references/planning.md](references/planning.md) | Phases, sub-items, tasks, and changing the plan. |
| [references/notes-files-links.md](references/notes-files-links.md) | Comments, source files, tags, and links between items. |
| [references/workspace.md](references/workspace.md) | Checking what a project should hold, the views, or the property order and page layout. |
| [references/setup.md](references/setup.md) | Onboarding a project, updating it to the current template, or rebuilding a template. |
| [assets/work-item-page.md](assets/work-item-page.md) | The work item page text (rebuilding the template, or checking a section). |
| [assets/design-page.md](assets/design-page.md) | Making an item's Solution Design page. |
| [assets/project-page.md](assets/project-page.md) | The project page text (building a template). |
| [assets/schema/01-work-items-database.json](assets/schema/01-work-items-database.json), [02-phases-database.json](assets/schema/02-phases-database.json), [03-tasks-database.json](assets/schema/03-tasks-database.json) | Building a template, or adding a missing property. |
| [assets/schema/04-work-items-relations.json](assets/schema/04-work-items-relations.json), [05-phases-relations.json](assets/schema/05-phases-relations.json), [06-tasks-relations.json](assets/schema/06-tasks-relations.json), [07-work-items-rollup.json](assets/schema/07-work-items-rollup.json), [07b-work-items-phase-column.json](assets/schema/07b-work-items-phase-column.json) | Building a template, or adding a missing relation. |
| [assets/schema/10-view-board.json](assets/schema/10-view-board.json), [11-view-by-stage.json](assets/schema/11-view-by-stage.json), [12-view-all-items.json](assets/schema/12-view-all-items.json), [13-view-roadmap.json](assets/schema/13-view-roadmap.json), [14-view-waiting-on-owner.json](assets/schema/14-view-waiting-on-owner.json), [15-view-phases-by-item.json](assets/schema/15-view-phases-by-item.json), [16-view-open-tasks.json](assets/schema/16-view-open-tasks.json), [17-view-top-level.json](assets/schema/17-view-top-level.json) | Building a template, or adding a missing database view. |
| [assets/schema/20-item-view-phases.json](assets/schema/20-item-view-phases.json), [21-item-view-sub-items.json](assets/schema/21-item-view-sub-items.json), [22-item-view-tasks.json](assets/schema/22-item-view-tasks.json), [23-item-view-linked-memory.json](assets/schema/23-item-view-linked-memory.json) | Building the work item template's views. |

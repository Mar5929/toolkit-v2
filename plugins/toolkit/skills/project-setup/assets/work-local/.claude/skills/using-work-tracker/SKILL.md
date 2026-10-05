---
name: using-work-tracker
description: 'Saves, finds, and changes work items as local files in the work-items folder, so running-work-item-lifecycle reads and writes every item the same way. Use when an item must be read, created, saved, searched, nested, or moved, such as "show me WI-031" or "put WI-007 under WI-003". Not for deciding an item''s plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work locally.'
---

# The work tracker: local files

This skill holds the storage: where each part of a work item is saved in local files, and how to find it again. It never decides what to save, a State, or an approval.

`work-items/AGENTS.md`, in the main checkout, says what each file and folder is, the form of a work item's ID, and what must stay true in the folder. Read it before your first change.

- A top-level item's phases and tasks are in its file, under Roadmap and Tasks. A sub-item has no phases: its tasks are one plain list in its file (`references/field-mapping.md`).
- The project's own phases are in `PROJECT-ROADMAP.md`, and its project tasks in `work-items/PROJECT-TASKS.md` (`references/project-roadmap-and-tasks.md`).

## Every time

1. Find the main checkout. `work-items/` is only there, even when this session runs in a worktree: `MAIN="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"`. Each shell command starts fresh, so begin every command that uses `$MAIN` with that line and a `;`, in the same command. It prints nothing when the project is not a Git repository: then set `MAIN` to the project folder, the one that holds `AGENTS.md`. Never run a command with an empty `MAIN`. No `work-items/` folder there: stop and tell the owner the setup is incomplete.
2. Find the item's file by its `id:` line (`references/searching.md`). Read the whole file in this turn, and again right before you change it: the owner edits and moves items by hand.
3. Run the hand-change check (`references/folders-and-files.md`) at the first lookup of a session, before a move or a new sub-item, and whenever an item is not where you read it before, an ID has two files or none, or an item's folder, `parent:`, and its parent's sub-item list disagree. Tell the owner each finding in one line, record it, and continue.
4. Make the change with the matching reference (References below). Change only the lines that change, keep every other line, heading, and bold label as the template has it, and set `updated:` to today. Never rewrite the whole file. Name other items as `[[WI-031]]` in an item's text, never by folder path; `parent:` stays a plain ID.
5. Read the file back and check every change was saved. Report a save that failed, or that reads back differently, as `running-work-item-lifecycle`, "Every time", says.

## Gotchas

- When a host blocks a write outside the session's worktree (for example the Codex sandbox, which asks for approval or fails with a sandbox error), ask the owner to approve it.
- Every lookup except the word search skips `DESIGN.md` files and `work-item-template/`. Never drop those flags. Leave out `archive/` unless the owner asks for archived items.
- An edit must match the old text exactly, table spacing included. When it fails, read the file again: the owner may have changed it.
- A `|` inside a table cell ends the cell: write `\|`. A table cell holds one line: join lines with `<br>`. Write `[[WI-031]]`, never `[[WI-031|a name]]`, in a table.
- Values may lose their quotes when the owner edits them in Obsidian's Properties panel (`waiting_on: owner`). The commands match both.
- The owner's "WI-31" is `WI-031`.
- An item the owner made by hand can still hold the template's example rows and tasks: never count them as real.
- In zsh, a `*` pattern that matches nothing stops the whole command. Use the `grep -r` commands as written.

## Hand-offs

| For | Use |
| --- | --- |
| Deciding what to save and when, a State, or an approval | `running-work-item-lifecycle` |
| A State and Status that no longer match | `running-work-item-lifecycle` |
| An original the item received | `filing-project-records`, step "file a source" |
| Moving the items to another tracker | `project-setup` |
| An incomplete setup, or a missing template | `project-setup` ("check the setup") |

## References

| File | Open it when |
| --- | --- |
| [references/field-mapping.md](references/field-mapping.md) | Creating or changing anything inside an item: a front matter field, a section, a phase or task, a Questions and Answers row, a Recent History row, a sub-item link, or the design file. |
| [references/folders-and-files.md](references/folders-and-files.md) | Making an item's folder and ID; the hand-change check; moving, nesting, grouping, archiving, or renaming items; hand-made items; duplicate IDs; Obsidian links. |
| [references/searching.md](references/searching.md) | Finding or reading items: one item, the board, open questions, a parent's tree, a search by word or field, and the three hand-change checks. |
| [references/project-roadmap-and-tasks.md](references/project-roadmap-and-tasks.md) | Reading or changing the project's phases, putting a top-level item in a project phase, or reading or changing a project task. |

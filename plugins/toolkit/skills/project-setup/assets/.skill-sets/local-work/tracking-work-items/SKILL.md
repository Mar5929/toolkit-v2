---
name: tracking-work-items
description: 'Saves, finds, and changes work items as local files in the work-items folder, so managing-work-items reads and writes every item the same way. Use when an item must be read, created, saved, searched, nested, moved, or given a source file, such as "show me WI-031" or "put WI-007 under WI-003". Not for deciding States or approvals; use managing-work-items. Only for projects that track work locally.'
---

# Tracking work items (local files)

This skill holds the storage: where each part of a work item is saved in local files, and how to find it again. `managing-work-items` decides what to save and when, and hands every read and save to this skill. This skill never decides a State or an approval.

## Where items live

- Each item is a folder under `work-items/` in the main checkout, holding the item's file named by its ID (`WI-031.md`). `references/folders-and-files.md` starts with a picture of the whole folder.
- An item is identified by the `id:` line in its front matter. Find it by `id:`, never by path: the owner moves and renames folders by hand.
- `work-items/work-item-template/` is the blank form, not an item. Copy it into the item's own folder; never write an item's text into it.
- To move the items to another tracker, use the project-setup skill.

## Every time

1. Find the main checkout. `work-items/` lives only there, even when this session runs in a worktree: `MAIN="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"`. Each shell command starts fresh, so begin every command that uses `$MAIN` with that line and a `;`, in the same command. It prints nothing when the project is not a Git repository: then set `MAIN` to the project folder, the one that holds `AGENTS.md`. Never run a command with an empty `MAIN`. No `work-items/` folder there: stop and tell the owner the setup is incomplete (the project-setup skill, "check the setup").
2. Find the item's file by its `id:` line (`references/searching.md`). Read the whole file in this turn, and again right before you change it: the owner edits and moves items by hand.
3. Run the hand-change check (`references/folders-and-files.md`) at the first lookup of a session, before a move or a new sub-item, and whenever an item is not where you read it before, an ID has two files or none, or an item's folder, `parent:`, and its parent's Sub-items cell disagree. Tell the owner each finding in one line, record it, and carry on.
4. Make the change with the matching reference (Files below). Edit with the file edit tool: change only the lines that change, keep every other line, heading, and bold label as the template has it, and set `updated:` to today. Name other items as `[[WI-031]]` in an item's text, never by folder path; `parent:` stays a plain ID.
5. Read the file back and check every change was saved. A failed edit is "Not saved", as `managing-work-items` says. The edits worked but the read-back differs: start the reply with "Saved but not verified" and say what differs.

## Gotchas

- Items live only in the main checkout, the first path `git worktree list` prints. From a worktree, change the item there; never copy it into a worktree. Never `git add` anything under `work-items/`, not even with `-f`.
- Every lookup except the word search skips `references/` folders (source files may hold their own `id:` lines), `DESIGN.md` files (their `status:` is the design's), and `work-item-template/`. Never drop those flags. Leave out `archive/` unless the owner asks for archived items.
- An edit must match the old text exactly, table spacing included. When it fails, read the file again: the owner may have changed it. Never rewrite a whole item file.
- A `|` inside a table cell ends the cell: write `\|`. A table cell holds one line: join lines with `<br>`. Write `[[WI-031]]`, never `[[WI-031|a name]]`, in a table.
- Values may lose their quotes when the owner edits them in Obsidian's Properties panel (`waiting_on: owner`). The commands match both.
- IDs have three digits: the owner's "WI-31" is `WI-031`.
- The template's example rows and tasks hold angle-bracket prompts (`<Specific unanswered question>`, `<Phase 1 name>`). They are prompts: replace them with real rows, and never count them as real.
- In Codex, the sandbox can block a session in a worktree from writing outside it. The write to the main checkout then asks for approval or fails with a sandbox error: ask the owner to approve it. Never write the item into the worktree instead.
- In zsh, a `*` pattern that matches nothing stops the whole command. Use the `grep -r` commands as written.

## Files

| File | Open it when |
| --- | --- |
| [references/field-mapping.md](references/field-mapping.md) | Creating or changing anything inside an item: a front matter field, a section, a phase or task, a Questions and Answers row, a Recent History row, an approval, Done, Cancelled, Blocked, a sub-item link, the design file, or a source file. |
| [references/folders-and-files.md](references/folders-and-files.md) | Seeing how the folder looks; making an item's folder and ID; the hand-change check; moving, nesting, grouping, archiving, or renaming items; hand-made items; duplicate IDs; Obsidian links. |
| [references/searching.md](references/searching.md) | Finding or reading items: one item, the board, open questions, a parent's tree, a search by word or field, and the three hand-change checks. |

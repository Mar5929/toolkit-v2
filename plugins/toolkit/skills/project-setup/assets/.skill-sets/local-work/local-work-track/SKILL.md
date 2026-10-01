---
name: local-work-track
description: 'Finds, creates, and changes work items in work-items/ folders: lookups, fields, phases, tasks, questions, sub-items, and moves, so each read and write matches the files. Use when finding or changing an item, such as "show me WI-031" or "add a task to phase 2". Not for closing or cancelling; use work-finish. Only for projects that track work locally.'
---

# Local work tracking: find, create, and change

This project tracks its work in local folders under `work-items/`. Every
lookup, create, or change of a work item goes through the steps here. The
work skills decide what to change; this skill
says how it is stored and found.

## Steps for any lookup or change

1. Find the main checkout. `work-items/` lives only there, even when this
   session runs in a worktree:
   `MAIN="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"`.
   Each shell command starts fresh, so begin every command that uses
   `$MAIN` with that line and a `;`, in the same command. It prints nothing
   when the project is not a Git repository: then set `MAIN` to the project
   folder, the one that holds `AGENTS.md`. Never run a command with an
   empty `MAIN`. No `work-items/` folder there: stop and tell the owner the
   setup is incomplete (the project-setup skill, "check the setup").
2. Find the item's file by its `id:` line (`references/lookups.md`). Read
   the whole file in this turn, and again right before you change it. Never
   report a status you did not read in this turn: the owner edits and
   moves items by hand.
3. Run the hand-change check (`references/folders.md`) at the first lookup
   of a session, before a move or a new sub-item, and whenever an item is
   not where you read it before, an ID has two files or none, or an item's
   folder, `parent:`, and its parent's Sub-items cell disagree. Tell the
   owner each finding in one line, record it, and carry on. For a finding
   that needs the owner, ask him instead, one question at a time, with
   your recommendation.
4. Make the change with the steps in the matching reference (References
   below). Edit with the file edit tool: change only the lines that change,
   keep every other line, heading, and bold label as the template has it,
   and set `updated:` to today. Name other items as `[[WI-031]]`, never by
   folder path.
5. Rewrite the item's Current state (the five lines under `### Current
   state`) in place, so every line is true and "Last updated" has today's
   date; never add to it. Add a Recent History row when the template's
   Recent History comment says to.
6. Read the file back and check every change was saved. An edit failed:
   start the reply with "Not saved" and say what was not saved and where it
   belongs. The edits worked but the read-back differs: start the reply
   with "Saved but not verified" and say what differs.
7. When the change makes a line of the project's Current State untrue (an
   item Done, a question answered), fix that line with the memory save
   skill `AGENTS.md` names. In a Hindsight project, edit
   `memory/CURRENT_STATE.md` directly, as the memory rule says.

## Rules

- Never set `status: Done` on your own. Ask the owner first and record his
  words. He may set Done himself; that counts.
- Three levels at most. Work smaller than an item is a task.
- Never delete an item folder, or a real row, phase, or task. Cancel it
  instead (a changed answer supersedes its row), archive an item when the
  owner asks, or ask him to delete it himself.
- Moving work items to another tracker: use the project-setup skill.
- Move, nest, group, rename, or archive items only when the owner asks. His
  own changes by hand win: never undo them.
- Never write an item's text into `work-items/work-item-template/`: copy
  the template into the item's own folder first.
- The chat that runs the item makes every change. Helper agents report back
  and never edit work items.

## Gotchas

- Items live only in the main checkout, the first path `git worktree list`
  prints. From a worktree, change the item there; never copy it into a
  worktree. Never `git add` anything under `work-items/`, not even with
  `-f`.
- Every lookup except the word search skips `references/` folders (source
  files may hold their own `id:` lines), `DESIGN.md` files (their `status:`
  is the design's), and `work-item-template/`. Never drop those flags.
  Leave out `archive/` unless the owner asks for archived items.
- An edit must match the old text exactly, table spacing included. When it
  fails, read the file again: the owner may have changed it. Never rewrite
  a whole item file.
- A `|` inside a table cell ends the cell: write `\|`. A table cell holds
  one line: join lines with `<br>`. Write `[[WI-031]]`, never
  `[[WI-031|a name]]`, in a table.
- Values may lose their quotes when the owner edits them in Obsidian's
  Properties panel (`waiting_on: owner`). The commands match both.
- IDs have three digits: the owner's "WI-31" is `WI-031`.
- The template's example rows and tasks hold angle-bracket prompts
  (`<Specific unanswered question>`, `<Phase 1 name>`). They are prompts:
  replace them with real rows, and never count them as real.
- In Codex, the sandbox can block a session in a worktree from writing
  outside it. The write to the main checkout then asks for approval or
  fails with a sandbox error: ask the owner to approve it. Never write the
  item into the worktree instead.
- In zsh, a `*` pattern that matches nothing stops the whole command. Use
  the `grep -r` commands as written.

## References

| File | Open it when |
| --- | --- |
| [references/lookups.md](references/lookups.md) | Finding or reading items: one item, the board, open questions, a parent's tree, a search. |
| [references/items.md](references/items.md) | Creating an item, or changing its fields, sections, Questions and Answers, approvals, Done, design file, or sources. |
| [references/planning.md](references/planning.md) | Phases, tasks, sub-items, and changing the plan. |
| [references/folders.md](references/folders.md) | The hand-change check; moving, nesting, grouping, archiving, or renaming items; hand-made items; duplicate IDs; Obsidian links. |

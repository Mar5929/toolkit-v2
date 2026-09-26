---
name: work-organize
description: 'Splits work items into sub-items, nests, groups, and moves them, and reconciles folders or cards the owner moved or renamed by hand. Use when the owner says "split this", "break it down", "it''s too big", "put X under Y", "I moved some folders around", or the briefing reports moved or missing items.'
---

# Work organize

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md` and `../../references/trackers.md`. Cases and examples: `references/moves.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`.

## Steps

1. Rescan the tracker and read the tree. Read the report: moved, renamed, nested or un-nested, missing, duplicate id, record with no id, adopted copies of the template.
   `toolkit work sync`
   `toolkit work list --tree`
2. Say what the CLI already adapted (paths, parent from location, Status from a dragged Notion Stage) in one line each ("WI-7 is now a sub-item of WI-3"), and what needs the owner's intent.
3. List side effects: a sub-item under a Done or Cancelled parent; a Roadmap phase listing a child that moved away; a `build` sub-item without approved requirements.
4. A missing item: ask whether it was removed on purpose (then cancel it with his words) or moved outside the tracker (ask where; move it back only after a yes). A copied folder with a duplicate id: the CLI renumbered the newer copy; confirm which one is the original.
   `toolkit work cancel <id> --reason "<owner's words>"`
5. Notion: a Stage the owner changed by dragging is kept. A card dragged to Done is not an approval: ask, and on a yes open `work-finish`.
6. Split (stage 05): propose the sub-items (title, what each delivers, which `R-xx` it covers), ask once, then create each one under the parent. Each child links the parent's `R-xx` ids and copies none. List the child ids in the parent's Roadmap Sub-items column.
   `toolkit work set <id> --stage 05-breakdown`
   `toolkit work new --title "<title>" --type <type> --parent <id>`
   `toolkit work edit <id> --section Roadmap --set-file <file>`
7. Nest, group, move, or archive on request. Before moving a folder, say how many nested items move with it.
   `toolkit work move <id> --under <parent-id>`
   `toolkit work move <id> --under <group>`
   `toolkit work move <id> --under archive`
   `toolkit work move <id> --under root`
8. Never move, regroup, cancel, archive, or restore on the agent's own initiative. Finish with validation, a short tree of what changed, and a history note on each item whose parent changed.
   `toolkit work validate`
   `toolkit work history <id> --note "Moved under <parent-id> at the owner's request"`

## Rules

- A folder nested inside an item's folder is a sub-item; its parent follows its location. A plain folder with no record in it is a group and changes no parent. A sub-item cannot also sit in a group.
- `archive/` is a reserved group. Items there are hidden from the briefing and from the recommended next item. Archiving is not cancelling.
- Identity is the record's `id`, never the folder name. Renaming a folder or file keeps the item.
- Ids are never reused. When two records share an id, the one the CLI already knew keeps it and the newcomer gets the next free id.
- A record whose title is still `<Work item title>` is an unused template copy and is skipped.
- Never hand-edit `.work-items/DASHBOARD.md` or `.work-items/.toolkit-state.json`. The sync command in step 1 rebuilds them.
- Splitting keeps each child whole: its own requirements, design, roadmap, and approvals. Finishing a child never finishes or approves the parent.
- The owner's hand changes win. The CLI keeps them and reports them. Ask about a hand change only when it skipped a gate.

## Tracker notes

- Notion: nesting is the Parent item and Sub-items relation. Moving a card between groups on the board changes its Stage, not its parent.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Use sub-issues or sub-tasks as `../../references/trackers.md` says. There is no folder layout to reconcile.

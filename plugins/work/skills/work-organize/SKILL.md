---
name: work-organize
description: 'Splits work items into sub-items, nests or moves them, and reconciles item folders or Notion cards the owner moved, renamed, or deleted himself. Use when the owner says "break it down" or "put X under Y", says he moved folders or cards, or the briefing reports moved or missing items.'
---

# Work organize

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: the work plugin's `references/conventions.md` and `references/trackers.md`, two folders above this skill's folder (`../../references/`). Cases and examples: this skill's `references/moves.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Run each `toolkit` command alone, on its own line, in both hosts: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). Text (conventions, "Text in a command"): one-line values (`--note`, `--effect`, `--append-row`, `--title`) go in single quotes, with an apostrophe written `'\''`, because double quotes run backticks and `$(...)`; section and design text goes on standard input in Claude Code (`<file>` is `-`, followed by a quoted heredoc, `<<'EOF'`), and in Codex in `--text '<text>'` or a file in a new `mktemp -d` folder, deleted right after the command. Never change a record with a script. Ask the owner in the reply text, never through a question tool. No remote (`git remote` prints nothing): never run `git fetch`, and never report a fetch refusal as a blocker.

## Steps

1. Rescan the tracker and read the tree. Read the report: moved, renamed, nested or un-nested, missing, duplicate id, record with no id, adopted copies of the template.
   `toolkit work sync`
   `toolkit work list --tree`
2. Say what the CLI already adapted (paths, a renamed folder, parent from location, Status from a dragged Notion Stage) in one line each ("WI-7 is now a sub-item of WI-3"), and what needs the owner's intent. The CLI already wrote a history row on each item the owner moved or renamed, and on the parents it left and joined; add a note only for his reason.
3. List side effects: a sub-item under a Done or Cancelled parent; a Roadmap phase listing a child that moved away; a `build` sub-item without approved requirements.
4. A missing item: ask whether it was removed on purpose (then cancel it with his words) or moved outside the tracker (ask where; move it back only after a yes). A copied folder with a duplicate id: the CLI renumbered the newer copy; confirm which one is the original.
   `toolkit work cancel <id> --reason '<his words>'`
5. Notion: a Stage the owner changed by dragging is kept. A card dragged to Done is not an approval: ask, and on a yes open `work-finish`.
6. Split (stage 05): propose the sub-items (title, what each delivers, which `R-xx` it covers), ask once, then create each one under the parent. A split never removes, renumbers, or rewrites the parent's `R-xx`: they stay in the parent, with their approval. A child that delivers approved parent requirements is made with `--covers`: it links them, copies no text, and inherits the parent's requirements approval, so the owner is never asked to approve the same requirement twice. A parent design the owner approved covers its children too: a `--covers` child of such a parent starts at planning (06), and its history row names that design; it gets no new design. Only a child that needs new behavior gets its own `R-xx` and its own approval. List the child ids in the parent's Roadmap Sub-items column. A child of an agent-led parent gets the same delivery value (`work-delegate` step 1). A split usually renames the parent: say the new title to the owner in one line before the title command below.
   `toolkit work set <id> --stage 05-breakdown`
   `toolkit work set <id> --title '<new title>'`
   `toolkit work new --title '<title>' --type <type> --parent <id> --covers R-02,R-03`
   `toolkit work new --title '<title>' --type <type> --parent <id>`
   `toolkit work edit <id> --section Roadmap --set-file <file>`
7. Nest, group, move, or archive on request. Before moving a folder, say how many nested items move with it.
   `toolkit work move <id> --under <parent-id>`
   `toolkit work move <id> --under <group>`
   `toolkit work move <id> --under archive`
   `toolkit work move <id> --under root`
8. Never move, regroup, cancel, archive, or restore on the agent's own initiative. Finish with validation and a short tree of what changed. `toolkit work move` writes the history rows on the item and on both parents; add a note only for the owner's reason. When a split or a move changed an item's next step, update the current focus (`../../references/conventions.md`, "The current focus"). End the reply with the one question for the owner, or the exact words that continue ("Say 'keep going' and I'll plan WI-008."), never with a plain statement of the next step.
   `toolkit work validate`
   `toolkit work history <id> --note 'Moved at the owner'\''s request: <his words>'`

## Rules

- A folder nested inside an item's folder is a sub-item; its parent follows its location. A plain folder with no record in it is a group and changes no parent. A sub-item cannot also sit in a group.
- `archive/` is a reserved group. Items there are hidden from the briefing and from the recommended next item. Archiving is not cancelling.
- Identity is the record's `id`, never the folder name. Renaming a folder or file keeps the item.
- Ids are never reused. When two records share an id, the one the CLI already knew keeps it and the newcomer gets the next free id.
- A record whose title is still `<Work item title>` is an unused template copy and is skipped.
- Never hand-edit `.work-items/DASHBOARD.md` or `.work-items/.toolkit-state.json`. The sync command in step 1 rebuilds them.
- Splitting keeps each child whole: its own roadmap and tasks, and its own result approval. Requirements and a design the owner already approved for the parent are linked and inherited, never copied or asked for again. Finishing a child never finishes or approves the parent.
- The owner's hand changes win. The CLI keeps them and reports them. Ask about a hand change only when it skipped a gate.

## Tracker notes

- Notion: nesting is the Parent item and Sub-items relation. Moving a card between groups on the board changes its Stage, not its parent.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Use sub-issues or sub-tasks as `../../references/trackers.md` says. There is no folder layout to reconcile.

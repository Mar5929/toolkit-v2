---
name: work-organize
description: 'Splits work items into sub-items, nests or moves them, and reconciles item folders or Notion cards the owner moved, renamed, or deleted himself. Use when the owner says "break it down" or "put X under Y", says he moved folders or cards, or the briefing reports moved or missing items.'
---

# Work organize

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Explains what the owner changed in the tracker, asks only where his intent is unclear, and splits or moves items when he asks; it never moves anything on its own. Track these steps with the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

## Steps

1. Rescan the tracker, then read the tree and the report: moved, renamed, nested or un-nested, archived, missing, duplicate id, adopted.
   `toolkit work sync`
   `toolkit work list --tree`
2. Say each report line to the owner, one line each, before other work (`references/moves.md`, section 1). The CLI already wrote the history rows.
3. Ask about each case that needs his intent, one at a time, with your recommendation: a missing or trashed item, a duplicate id, a sub-item under a finished parent, an item marked Done by hand, a skipped gate (`references/moves.md`, section 2).
   `toolkit work cancel <id> --reason '<his words>'`
4. Split (stage 05): propose the sub-items, ask once, then create each child with `--covers` for the parent requirements it delivers, and update the parent's Roadmap, with the checklist in `references/moves.md`, section 3.
   `toolkit work set <id> --stage 05-breakdown`
   `toolkit work new --title '<title>' --type <type> --parent <id> --covers R-02,R-03`
   `toolkit work edit <id> --section Roadmap --set-file <file>`
5. Nest, group, move, archive, or restore only when the owner asks. First say how many nested items move with it (`references/moves.md`, section 4).
   `toolkit work move <id> --under <target>`
6. Validate, show a short tree of what changed, and add a history note only for the owner's reason.
   `toolkit work validate`
   `toolkit work history <id> --note 'Moved because the owner asked: <his words>'`
7. Update the current focus when a split or a move changed an item's next step (`references/current-focus.md`). End with the one question for the owner, or the exact words that continue ("Say 'keep going' and I'll plan WI-008.").

## Gotchas

- Run each `toolkit` command alone: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). One-line values go in single quotes, never double quotes; an apostrophe inside them is `'\''` in Claude Code and ’ (U+2019) in Codex, or reword the text. Section text goes on standard input (`--set-file -`) in Claude Code, and in `--text '<text>'` or a `mktemp -d` file in Codex (`references/toolkit-commands.md`, "Text in a command").
- Never move, regroup, cancel, archive, or restore on your own initiative. The owner's hand changes win: never undo one.
- An item marked Done by hand (a Notion card set to Done) is not an approval. Ask whether he approves the result; on a yes open `work-finish`.
- A split never removes, renumbers, or rewrites the parent's `R-xx`. A `--covers` child inherits the parent's requirements approval, and an approved parent design, so he is never asked to approve the same thing twice.
- Archiving hides an item; it is not a cancel.
- Identity is the record's `id`, never the folder name. Ids are never reused.
- A record whose title is still `<Work item title>` is an unused template copy and is skipped.
- Never hand-edit `.work-items/DASHBOARD.md` or `.work-items/.toolkit-state.json`: the sync rebuilds them.
- Notion: dragging a card between board columns changes its Stage, not its parent. There are no group folders; `--under` takes an item id, `root`, or `archive` (`references/tracker-notion.md`).
- GitHub Issues or Jira: `toolkit work` exits with code 3. Use sub-issues or sub-tasks (`references/tracker-github.md` or `references/tracker-jira.md`); there is no folder layout to reconcile.

## References

| File | Open it when |
| --- | --- |
| [references/moves.md](references/moves.md) | Every step: report lines, cases that need the owner, the split checklist, moves |
| [references/tracker-local.md](references/tracker-local.md) | `tracker.type` is `local`: what the sync does by itself, groups, `archive/` |
| [references/tracker-notion.md](references/tracker-notion.md) | `tracker.type` is `notion`: cards the owner made, dragged, archived, or trashed |
| [references/approvals.md](references/approvals.md) | A hand change skipped a gate; sub-items and approvals (section 10) |
| [references/work-item-format.md](references/work-item-format.md) | Before editing the Roadmap or any section |
| [references/recording-owner-answers.md](references/recording-owner-answers.md) | The owner answers; history notes; a failed save |
| [references/current-focus.md](references/current-focus.md) | Step 7: an item's next step changed |
| [references/toolkit-commands.md](references/toolkit-commands.md) | Before a command that carries text, and on any exit code other than 0 |
| [references/tracker-github.md](references/tracker-github.md) | A `toolkit work` command exits 3 in a GitHub Issues project |
| [references/tracker-jira.md](references/tracker-jira.md) | A `toolkit work` command exits 3 in a Jira project |
| [assets/WORK-ITEM.md](assets/WORK-ITEM.md) | GitHub or Jira: the body of a new child issue |

# Moves, renames, and splits: cases

Detail for `work-organize`. The CLI adapts to the owner's hand changes;
this skill explains them and asks only where his intent is unclear.

## What the CLI handles by itself

`toolkit work sync` (also run by every `toolkit work` command, by the
SessionStart hook, and by the UserPromptSubmit hook) rescans `.work-items/`
and:

- follows a folder or file the owner moved or renamed (identity is the
  record's frontmatter `id`);
- sets `parent` from the new location when a folder was nested inside
  another item's folder, or moved out of one;
- adopts a record that has no id (a copy of the template with a real title):
  gives it the next free id and reports it;
- renumbers the newer of two records that share an id, and reports both;
- skips `work-item-template/`, folders whose names start with `_` or `.`, and
  records whose title is still `<Work item title>`;
- writes one Recent History row on each item the owner moved or renamed
  ("Moved by hand: <old path> -> <new path>", "Folder renamed by hand: ..."),
  and on the parents a sub-item left and joined ("Sub-item WI-7 moved out by
  hand", "Sub-item WI-7 moved here by hand"); `toolkit work move` writes the
  same rows for a move it makes;
- rebuilds `.work-items/DASHBOARD.md`;
- in Notion, reads a dragged Stage and sets Status to match, fills a card
  made with the New button with the template body, and reads a changed
  Parent item as the owner's edit, with a "Parent changed in Notion by hand"
  row on the item and a row on each parent. The session briefing only reads:
  it reports the change, and the next `toolkit work` command writes the rows.

Every one of these is reported: in the session briefing under "Changes found in the tracker", and by the next `toolkit work` command. Say each one to the owner in one line before other work.

## Cases that need the owner

| What the report shows | What to ask or do |
| --- | --- |
| An item is missing (its record is gone) | "WI-9 is gone from the tracker. Did you remove it on purpose, or move it somewhere else?" On purpose: cancel it with his words. Moved: ask where, and move it back only after a yes. |
| A copied folder had a duplicate id | "The copy of WI-4 is now WI-18. Which one is the original?" If he names the copy, ask whether to swap the titles or cancel one. |
| A sub-item sits under a Done or Cancelled parent | Ask whether the sub-item still belongs there, or should move to the top level or another parent. |
| A parent's Roadmap lists a child that moved away | Offer to update the parent's Roadmap Sub-items column. |
| A `build` or `data-load` sub-item has no approved requirements | Say it cannot be built until its requirements are approved; offer `work-requirements`. |
| A Notion card was dragged to Done | Say a card in Done is not an approval. Ask whether he approves the result; on a yes open `work-finish`. |
| A hand change skipped a gate (build item moved past stage 03 without approval) | Ask about it as a question. Never undo it. |
| A record fails validation after a hand edit | Name the problem and the fix; fix it only with his yes. |

## Splitting an item (stage 05)

1. Propose the sub-items in one message: for each, a title, what it delivers,
   and which of the parent's `R-xx` it covers. Say which phase of the
   parent's Roadmap each one delivers.
2. Ask once: "Shall I split WI-12 into these three sub-items?"
3. On a yes, create each child under the parent. A child that delivers the
   parent's approved requirements names them:
   `toolkit work new --title "<title>" --type <type> --parent <id> --covers R-02,R-03`.
   It links them ("Covers WI-12 R-02, WI-12 R-03"), copies none of their
   text, and inherits the parent's requirements approval: it starts at
   `03-requirements-approved` (or at `06-implementation-plan` when the
   parent's design is approved), and the owner is not asked again. A child
   with no approved parent requirement to cover is made without `--covers`.
4. The parent keeps every `R-xx` as it is: never move, renumber, or rewrite
   an approved requirement into a child, and never ask the owner to approve
   the same requirement again. When a child needs new behavior, it gets its
   own `R-xx` blocks and its own approval.
5. A design the owner approved for the parent covers the children built from
   it. A `--covers` child of such a parent starts at planning (stage 06), and
   its first history row names the parent's design; `toolkit work show` says
   "Design: none of its own; WI-12's design is approved". It gets its own
   design only when it needs a choice the parent's design did not make.
6. Update the parent's Roadmap Sub-items column with the child ids.
7. The CLI writes the history rows for creating each child, on the child and
   on the parent. When the split renames the parent, say the new title to the
   owner in one line first.

## Moving and grouping

- `--under <parent-id>` makes the item a sub-item of that item.
- `--under <group>` puts it in a plain group folder (created when missing).
- `--under archive` hides it from the briefing and the recommended next item.
  Archive only on the owner's request, and normally only Done or Cancelled
  items.
- `--under root` moves it back to the top level of `.work-items/`.
- A move carries every nested item with it. Say the count before moving.
- Restoring from `archive/` is a move to `root` or a parent, on request.

## Things the agent never does here

- Move, regroup, cancel, archive, or restore without the owner asking.
- Delete a work item folder or record. Cancelling keeps the record.
- Reuse an id.

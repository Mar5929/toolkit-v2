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
- rebuilds `.work-items/DASHBOARD.md`;
- in Notion, reads a dragged Stage and sets Status to match, fills a card
  made with the New button with the template body, and reads a changed
  Parent item as the owner's edit.

Every one of these is reported. Say each one to the owner in one line.

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
3. On a yes, create each child under the parent with
   `toolkit work new --title "<title>" --type <type> --parent <id>`.
4. Each child's Requirements section links the parent's `R-xx` ids ("Covers
   WI-12 R-02 and R-03") and copies none of their text. When a child needs
   its own detail, it gets its own `R-xx` blocks and its own approval.
5. Update the parent's Roadmap Sub-items column with the child ids.
6. Add a history note on the parent and on each child.

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

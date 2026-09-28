# Moves, splits, and hand changes: cases

What to ask or do for each change the tracker reports, how to split an item
into sub-items, and how to move or archive items on request. What the CLI
already does by itself is in `tracker-local.md` and `tracker-notion.md`.

## Contents

1. Reporting what the CLI already adapted
2. Cases that need the owner
3. Splitting an item (stage 05)
4. Moving, grouping, and archiving
5. Things never done here

## 1. Reporting what the CLI already adapted

Each report line is written to be said to the owner as it is. Say each one
in the reply, one line each, before other work. Do not guess at a cause the
line does not name. The CLI already wrote the history rows; add a note only
for the owner's reason.

| The line starts with | Example | Add |
| --- | --- | --- |
| `Moved:` | "Moved: WI-007 from WI-003-csv/WI-007-export to WI-007-export (moved by hand). It is now a top-level item. It was a sub-item of WI-003." | Nothing, unless a side effect in section 2 applies |
| `Renamed folder:` | "Renamed folder: WI-002's folder was renamed by hand from wi-002-help to help-option; the item itself is the same. It is still a top-level item." | Nothing |
| `Re-parented:` | "Re-parented: WI-009 was put under WI-004 in Notion by hand. Its parent is now WI-004. It was a top-level item." | Nothing, unless a side effect in section 2 applies |
| `Archived:` | "Archived: WI-005 was archived in Notion by hand (its Archived box was ticked), so it is hidden from the board and the briefing." | "It is not cancelled." when the item was not finished |
| `Changed by hand:` | "Changed by hand: WI-006 stage "04-solution-design" -> "08-build"." | The question the CLI printed, when the change skipped a gate |
| `Renamed file:` | "Renamed file: WI-004 is now ... (was WORK-ITEM.md), in the same folder." | Nothing |
| `Found again:` | "Found again: WI-009 was missing and is back, now in WI-009-help." | Nothing |
| `Unarchived:` | "Unarchived: WI-005 was taken out of the archive in Notion by hand (its Archived box was cleared)." | Nothing |
| `Adopted:` | "Adopted: WI-011 at ..." | Nothing |
| `Renumbered a copy:` | "Renumbered a copy: ... The copy is now WI-018." | The question in section 2 |
| `Missing:` | "Missing: WI-009 (Help page) was at ... and is no longer found." | The question in section 2 |
| `Question for the owner:` | The CLI's question about a skipped gate | Ask it as it is, with your recommendation |
| `In step:` | "In step: WI-002 parent "none" -> "WI-001"." | Nothing. The CLI brought a value that follows from another one in line with it (here the parent, from the folder's new place) |
| `Warning:` or `Problem:` | A record that fails a check after a hand edit | Name the problem and the fix; fix it only with his yes (section 2) |

## 2. Cases that need the owner

| What the report shows | What to ask or do |
| --- | --- |
| An item is missing (its record is gone) | "WI-9 is gone from the tracker. Did you remove it on purpose, or move it somewhere else?" On purpose: cancel it with his words. Moved: ask where, and move it back only after a yes. |
| A Notion card was moved to the Notion trash | "WI-9 is in the Notion trash. Did you mean to remove it?" On purpose: cancel it with his words, and it stays in the trash. By mistake: he restores it in Notion (Trash, in the sidebar); the next sync finds it. |
| A copied folder had a duplicate id | "The copy of WI-4 is now WI-18. Which one is the original?" If he names the copy, ask whether to swap the titles or cancel one. |
| A sub-item sits under a Done or Cancelled parent | Ask whether it still belongs there, or should move to the top level or another parent. |
| A parent's Roadmap lists a child that moved away | Offer to update the parent's Roadmap Sub-items column. |
| A `build` or `data-load` sub-item has no approved requirements | Say it cannot be built until its requirements are approved; offer `work-requirements`. |
| An item marked Done by hand (a card set to Done in Notion) with no result approval | Say Done in the tracker is not an approval. Ask whether he approves the result; on a yes open `work-finish`. |
| A hand change skipped a gate (a build item moved past stage 03 without approval) | Ask the question the CLI printed. Never undo the change. |
| A record fails validation after a hand edit | Name the problem and the fix; fix it only with his yes. |

Cancel a missing item only with his words:

```text
toolkit work cancel <id> --reason '<his words>'
```

## 3. Splitting an item (stage 05)

Run these in order.

- [ ] Set the split stage.
      `toolkit work set <id> --stage 05-breakdown`
- [ ] Propose the sub-items in one message: for each, a title, what it
      delivers, which of the parent's `R-xx` it covers, and which phase of
      the parent's Roadmap it delivers.
- [ ] Ask once: "Shall I split WI-12 into these three sub-items?"
- [ ] On a yes, create each child under the parent. A child that delivers
      approved parent requirements names them with `--covers`: it links them,
      copies none of their text, and inherits the parent's requirements
      approval. A child with no approved parent requirement to cover is made
      without `--covers`.
      `toolkit work new --title '<title>' --type <type> --parent <id> --covers R-02,R-03`
      `toolkit work new --title '<title>' --type <type> --parent <id>`
- [ ] Read each creation line. "inherits that requirements approval" means
      the child starts at `03-requirements-approved`; "<parent>'s approved
      design covers it" means it starts at planning (stage 06) with no design
      of its own; "Delivery: ... as recorded for <parent>" means the delivery
      choice was copied.
- [ ] Update the parent's Roadmap Sub-items column with the child ids.
      `toolkit work edit <id> --section Roadmap --set-file <file>`
- [ ] When the split changes the parent's title, say the new title to the
      owner in one line first.
      `toolkit work set <id> --title '<new title>'`
- [ ] Check the tree and the records.
      `toolkit work list --tree`
      `toolkit work validate`

Rules for a split:

- The parent keeps every `R-xx` as it is. Never move, renumber, or rewrite an
  approved requirement into a child, and never ask the owner to approve the
  same requirement again.
- A child that needs new behavior gets its own `R-xx` blocks and its own
  approval through `work-requirements`.
- A child gets its own design only when it needs a choice the parent's design
  did not make.
- Each child keeps its own roadmap, tasks, and result approval. Finishing a
  child never finishes or approves the parent.
- The CLI writes the history rows for creating each child, on the child and
  on the parent.

## 4. Moving, grouping, and archiving

Only when the owner asks. Say how many nested items move with it before
moving.

| He asks | Command |
| --- | --- |
| "Put WI-7 under WI-3" | `toolkit work move WI-7 --under WI-3` |
| "Group the billing items" (local tracker only) | `toolkit work move <id> --under billing` (the group folder is created when missing) |
| "Archive WI-5" | `toolkit work move WI-5 --under archive` |
| "Take WI-7 back to the top level" or "restore WI-5 from the archive" | `toolkit work move <id> --under root` |

- Archive normally only Done or Cancelled items. Archiving hides an item; it
  is not a cancel.
- In Notion there are no group folders: `--under` takes an item id, `root`,
  or `archive` (which ticks the Archived box).
- `toolkit work move` writes the history rows on the item and on both
  parents. Add a note only for the owner's reason:
  `toolkit work history <id> --note 'Moved because the owner asked: <his words>'`

## 5. Things never done here

- Move, regroup, cancel, archive, or restore without the owner asking.
- Delete a work item folder, a record, or a Notion page. Cancelling keeps the
  record.
- Reuse an id.
- Hand-edit `DASHBOARD.md` or `.toolkit-state.json`.

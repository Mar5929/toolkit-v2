# Item folders: hand changes, moves, and links

Purpose: how to notice what the owner changed by hand, how to move, nest,
group, archive, and rename items when he asks, and how items link in
Obsidian.

## Contents

- The hand-change check
- What each finding means
- Findings that need the owner
- Moving an item under another parent, or to the top level
- Groups
- Archive
- Renaming a folder or a file
- A hand-made item
- Two items with one ID
- Links and Obsidian

## The hand-change check

The owner may move, rename, nest, copy, or delete item folders and files in
Finder or Obsidian, and edit fields in Obsidian's Properties panel. His
change wins: never undo it, and never move a folder back on your own. Run
these three commands:

```bash
grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^(id|parent):' "$MAIN/work-items"
grep -rhE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^id:' "$MAIN/work-items" | sed -E 's/^id: *"?([^" ]*)"? *$/\1/' | sort | uniq -d
grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^title: *"?<Work item title>' "$MAIN/work-items"; find "$MAIN/work-items" -name 'WORK-ITEM.md' -not -path '*/work-item-template/*'
```

1. The first lists every item's file, ID, and `parent:`. For each item,
   compare its parent by folders (the nearest folder above it that holds an
   item file; `none` at the top of `work-items/`, in a group, or at the top
   of `archive/`), its `parent:` line, the Sub-items cells of both parents
   (`grep -nE '^\| *P[0-9]+ —' "<parent file>"`), its file name
   (`<ID>.md`), and its level (three item folders above it is a fourth
   level).
2. The second prints each ID that two files share.
3. The third prints template copies the owner made by hand.

Also check that each ID you are about to use exists. An ID no file holds
is missing.

## What each finding means

Folders win over `parent:`. Tell the owner each finding in one line, then
record it:

| What you see | What to do |
| --- | --- |
| The folders say parent X, `parent:` says Y or `none`, and X's Sub-items cells do not list it | The owner moved the folder. Set `parent: X`, move the item from Y's Sub-items cell to the cell of the phase of X it serves (name the phase), and add "Moved by hand" rows on the item, X, and Y |
| The item sits at the top level or in a group, and `parent:` names an item | `parent: none`, remove it from the old parent's Sub-items cell, rows on both |
| The item sits in `archive/` with no Recent History row saying so | A row "Archived by hand"; the status stays |
| The file name is not `<ID>.md` | Still the item. Tell him `[[WI-031]]` links no longer reach it, and offer to rename it back |
| A template copy with a real title | A hand-made item ("A hand-made item") |
| A template copy with the template's title | An unused copy. Tell him and ask whether to fill it in |
| `stage`, `status`, `waiting_on`, an approval field, or `design` differs from the Current state and the latest Recent History row | His value wins; a row "Changed by hand: <field> <old> to <new>" |
| `status: Done` with no Done row in Questions and Answers | It counts; a row "Marked Done by the owner by hand on `YYYY-MM-DD`" |
| A task ticked, or rows or tasks moved between phases | His plan now; a Recent History row |

Only the folder name changed: nothing to fix. After a move, make `parent:`
match the folder the item sits in and each parent's Sub-items cells list
exactly its sub-items, with a Recent History row on each parent whose list
changed.

## Findings that need the owner

Ask one at a time, with your recommendation, and save the question and his
answer as a Questions and Answers row on the item.

- `parent:` changed but the folder did not, and the old parent's Sub-items
  cells still list it: move the folder under the new parent? Recommend yes.
- Two files with one ID: which is the original? Then give the copy the next
  free ID ("Two items with one ID").
- A missing item: did he remove it on purpose, or move it? On purpose:
  remove the lines that name it (the parent's Sub-items cell), record his
  words on the parent, and fix the project's Current State lines that name
  it with the memory save skill `AGENTS.md` names (a Hindsight project: edit
  `memory/CURRENT_STATE.md` directly). Moved: ask where.
- Four levels deep: move it up, or turn it into tasks? Recommend moving it
  up.
- A sub-item under a Done or Cancelled parent: keep it there, or move it to
  the top level?
- A hand change that skipped an approval (a `build` item past stage `03`
  with no requirements approval): keep the change, ask for the approval,
  and build nothing that needs it until he answers.

## Moving an item under another parent, or to the top level

Only when the owner asks ("put WI-007 under WI-003", "take WI-007 back to
the top level").

1. **Level check.** The deepest item moving, with its sub-items, must end at
   level 3 at most (level 1 is the top). A move that would make a fourth
   level: say so, and recommend another parent or turning the deepest items
   into tasks.
2. **Move the folder** with `mv`, with its sub-items inside it. Check the
   target has no folder of the same name first.
3. **Fields.** `parent:` becomes the new parent's ID, or `none`. Set
   `updated:`.
4. **Roadmaps.** Remove its `[[WI-007]]` from the old parent's Sub-items
   cell ("None." when the cell is empty). Add it to the new parent's cell
   for the phase the owner names. When he names none, ask which phase, with
   your recommendation (a Questions and Answers row).
5. **Recent History** on the item, the old parent, and the new parent, with
   the owner's words or Q-ID: "Moved under [[WI-003]] at the owner's
   request (Q-05)."
6. **Read back.** The item is found by its ID at the new path, and its
   sub-items are found under it.

## Groups

- The owner may group items in a plain folder ("put the security items in a
  folder called security"). Make the folder and `mv` the items into it.
- A group holds top-level items. It changes no parent and no field. Add a
  Recent History row on each item moved: "Moved to the security group at
  the owner's request."
- Never start a group's name with an ID, and never make a group on your
  own.

## Archive

- Only when the owner asks ("archive WI-012", "archive the finished
  items"): `mv` the item folder into `work-items/archive/` (`mkdir -p` it
  when missing).
- Archiving is not cancelling: the status stays. Add a Recent History row:
  "Archived at the owner's request."
- An item moves to the archive with its sub-items. A sub-item archived on
  its own leaves its parent: say so in one line first; then set
  `parent: none`, remove it from the parent's Sub-items cell, and add a
  Recent History row on both.
- The board leaves `archive/` out. Archived IDs still count for the next
  ID.
- To bring an item back, move its folder out of `archive/` to the place
  the owner names (the top of `work-items/` when he names none; under a
  parent, also follow "Moving an item under another parent"), and add a
  Recent History row.

## Renaming a folder or a file

- The folder name may change; nothing points at it. Rename a folder only
  when the owner asks, with `mv` inside the same parent folder.
- The item file keeps the name `<ID>.md`, because `[[WI-031]]` finds the
  file by its name. Never rename an item file yourself, except to give a
  hand-made item or a renumbered copy the name `<ID>.md`.

## A hand-made item

- A copy with a real title (its `title:` is not `<Work item title>`): give
  it the next ID ("A new work item" in `items.md`, steps 2, 3, and 5), set
  `id:` and the heading, rename its file to `<ID>.md`, fill any empty field
  with the new-item value, and add a Recent History row: "Made by hand by
  the owner; given the ID WI-034." Keep his folder name. Tell him in one
  line.
- A file named `WORK-ITEM.md` outside the template is always a hand copy.

## Two items with one ID

- A duplicate you just made yourself while creating an item: renumber your
  own without asking ("A new work item", step 5).
- Any other duplicate (usually a copied folder): ask the owner which is the
  original. After his answer, give the copy the next free ID: `id:`, the
  heading, the file name `<ID>.md`, and the folder name when it starts with
  the old ID. Add a Recent History row on both items.

## Links and Obsidian

- The whole project folder is the Obsidian vault. `[[WI-031]]` links to
  the file `WI-031.md`, wherever its folder sits.
- Name other work items as `[[WI-031]]` in Related items, the Sub-items
  cells, Recent History, and the design's Requirements line. `parent:` in
  the front matter stays a plain ID.
- Memories link to items with `work_items: ["[[WI-031]]"]`, so the item's
  Backlinks panel in Obsidian lists them. This skill never edits memory.
- Examples written in backticks are not links. Write real links without
  backticks.

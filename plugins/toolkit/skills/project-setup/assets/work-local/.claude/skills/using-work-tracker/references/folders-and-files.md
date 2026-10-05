# Item folders, IDs, and hand changes (local files)

## Contents

- The work-items folder
- Creating an item's folder and ID
- The hand-change check
- Findings that need the owner
- Moving an item under another parent, or to the top level
- Groups
- Archive
- Renaming a folder or a file
- A hand-made item
- Two items with one ID
- Links and Obsidian

## The work-items folder

`work-items/AGENTS.md` lists the files and folders. Two things it does not say:

- Level 1 is an item at the top of `work-items/`, in a group, or at the top of `archive/`. Each item folder nested inside another is one level deeper.
- The nesting, the sub-item's `parent:` line, and its parent's sub-item list say the same thing: WI-003 holds `parent: WI-002`, and the Sub-items cell of the phase of WI-002 that it delivers names `[[WI-003]]`. WI-004 holds `parent: WI-003`, and the `**Sub-items:**` line of WI-003 names `[[WI-004]]` (`field-mapping.md`, "Roadmap and Tasks").

## Creating an item's folder and ID

Fill the item's fields afterwards with `field-mapping.md`, "A new item's starting values".

1. **Level check** (a sub-item only). Read the parent's `parent:`, then the `parent:` of the item it names (the grandparent). When the grandparent has a parent, the parent is at level 3: make no sub-item.
2. **The prefix.** Read it from `PROJECT.md`:

   ```bash
   sed -nE 's/^- Work item ID prefix: `([^`]*)`.*/\1/p' "$MAIN/PROJECT.md"
   ```

   Empty or still `<WI>`: stop and tell the owner the setup is incomplete.
3. **The next ID.** Replace `WI` with the prefix:

   ```bash
   grep -rhE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^id: *"?WI-[0-9]+"? *$' "$MAIN/work-items" | sed -E 's/.*-([0-9]+)"? *$/\1/' | sort -n | tail -1
   ```

   It prints `031`: the new ID is `WI-032` (`printf '%s-%03d\n' WI 32`). It prints nothing: the first ID is `WI-001`.
4. **Make the folder first**, with a plain `mkdir` (never `-p`), so it fails when the folder already exists. The slug is two to four lowercase words from the title, joined by hyphens. A top-level item goes in `"$MAIN/work-items/WI-032-transaction-entry"`, an item in a group the owner named in `"$MAIN/work-items/<group>/WI-032-transaction-entry"`, and a sub-item inside the parent's folder.
5. **Check for a duplicate** right after:

   ```bash
   find "$MAIN/work-items" -type d -name 'WI-032-*' -not -path '*/work-item-template/*'
   grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^id: *"?WI-032"? *$' "$MAIN/work-items"
   ```

   The first must print only your folder, and the second nothing. Anything else: another session took the number, so your item is the later one. Take the next free number, rename your still-empty folder with `mv`, and check again.
6. **Copy the template** into the folder:

   ```bash
   cp "$MAIN/work-items/work-item-template/WORK-ITEM.md" "<item folder>/WI-032.md"
   ```

   The project's template is missing: stop and tell the owner (the project-setup skill restores it).
7. After the fields are filled, run the `grep` from step 5 again: it prints exactly one file, your `WI-032.md`.

## The hand-change check

The owner may move, rename, nest, copy, or delete item folders and files in Finder or Obsidian, and edit fields in Obsidian's Properties panel. His change wins: never undo it, and never move a folder back on your own. Run the three checks in `searching.md`, "Check for hand changes":

1. The first lists every item's file, ID, and `parent:`. For each item, compare its parent by folders (the nearest folder above it that holds an item file; `none` at the top of `work-items/`, in a group, or at the top of `archive/`), its `parent:` line, the sub-item lists of both parents (`grep -nE '^\| *P[0-9]+ —|^\*\*Sub-items:\*\*' "<parent file>"`), its file name (`<ID>.md`), and its level (three item folders above it is a fourth level).
2. The second prints each ID that two files share.
3. The third prints template copies the owner made by hand.

Also check that each ID you are about to use exists. An ID no file holds is missing.

Folders win over `parent:`. Tell the owner each finding in one line, then record it:

- **The folders say parent X, `parent:` says Y or `none`, and X's sub-item list does not name it:** the owner moved the folder. Set `parent: X`, move the item from Y's sub-item list to X's (when X is top-level, to the cell of the phase of X it serves; name the phase), and add "Moved by hand" rows on the item, X, and Y. When its level changed, also follow `field-mapping.md`, "An item that changes level".
- **The item sits at the top level or in a group, and `parent:` names an item:** set `parent: none`, remove it from the old parent's sub-item list, and add rows on both. It is now top-level: follow `field-mapping.md`, "An item that changes level", and ask the owner which project phase it goes under.
- **The item sits in `archive/` with no Recent History row saying so:** add a row "Archived by hand". The `state` stays.
- **The file name is not `<ID>.md`:** it is still the item. Tell him `[[WI-031]]` links no longer reach it, and offer to rename it back.
- **A template copy with a real title:** a hand-made item ("A hand-made item").
- **A template copy with the template's title:** an unused copy. Tell him and ask whether to fill it in.
- **`state`, `status`, `waiting_on`, an approval field, or `design` differs from the Current state and the latest Recent History row:** his value wins. Add a row "Changed by hand: <field> <old> to <new>". When `state` and `status` no longer match each other, `running-work-item-lifecycle` says what to do.
- **A task ticked, or rows or tasks moved between phases:** that is his plan now. Add a Recent History row.

Only the folder name changed: nothing to fix. After a move, make `parent:` match the folder the item sits in and each parent's sub-item list names exactly its sub-items, with a Recent History row on each parent whose list changed.

## Findings that need the owner

Ask one at a time, with your recommendation, and save the question and his answer as a Questions and Answers row on the item.

- `parent:` changed but the folder did not, and the old parent's sub-item list still names it: move the folder under the new parent? Recommend yes.
- Two files with one ID: which is the original? Then give the copy the next free ID ("Two items with one ID").
- A missing item: did he remove it on purpose, or move it? On purpose: remove the lines that name it (the parent's sub-item list), and record his words on the parent. Moved: ask where.
- Four levels deep: move it up, or turn it into tasks? Recommend moving it up.
- A sub-item under a Done or Cancelled parent: keep it there, or move it to the top level?

## Moving an item under another parent, or to the top level

Only when the owner asks.

1. **Level check.** The deepest item moving, with its sub-items, must end at level 3 at most (level 1 is the top). A move that would make a fourth level: say so, and recommend another parent or turning the deepest items into tasks.
2. **Move the folder** with `mv`, with its sub-items inside it. Check the target has no folder of the same name first.
3. **Fields.** `parent:` becomes the new parent's ID, or `none`. Set `updated:`.
4. **Sub-item lists and the roadmap.** Remove its `[[WI-007]]` from the old parent's sub-item list ("None." when the list is empty). Add it to the new parent's list: under a top-level parent, in the cell of the phase the owner names; when he names none, ask which phase, with your recommendation (a Questions and Answers row). Moved to the top level: list it under a project phase (`project-roadmap-and-tasks.md`). Moved from the top level: remove it from its project phase. When its level changed, follow `field-mapping.md`, "An item that changes level".
5. **Recent History** on the item, the old parent, and the new parent, with the owner's words or Q-ID: "Moved under [[WI-003]] at the owner's request (Q-05)."
6. **Read back.** The item is found by its ID at the new path, and its sub-items are found under it.

## Groups

- The owner may group items in a plain folder. Make the folder and `mv` the items into it.
- A group holds top-level items. It changes no parent and no field. Add a Recent History row on each item moved: "Moved to the security group at the owner's request."
- Never start a group's name with an ID, and never make a group on your own.

## Archive

- Only when the owner asks: `mv` the item folder into `work-items/archive/` (`mkdir -p` it when missing).
- Archiving is not cancelling: the `state` stays. Add a Recent History row: "Archived at the owner's request."
- An item moves to the archive with its sub-items. A sub-item archived on its own leaves its parent: say so in one line first; then set `parent: none`, remove it from the parent's sub-item list, and add a Recent History row on both.
- The board leaves `archive/` out. Archived IDs still count for the next ID.
- To bring an item back, move its folder out of `archive/` to the place the owner names (the top of `work-items/` when he names none; under a parent, also follow "Moving an item under another parent"), and add a Recent History row.

## Renaming a folder or a file

- The folder name may change; nothing points at it. Rename a folder only when the owner asks, with `mv` inside the same parent folder.
- The item file keeps the name `<ID>.md`, because `[[WI-031]]` finds the file by its name. Never rename an item file yourself, except to give a hand-made item or a renumbered copy the name `<ID>.md`.

## A hand-made item

- A copy with a real title (its `title:` is not `<Work item title>`): give it the next ID ("Creating an item's folder and ID", steps 2 and 3), set `id:` and the heading, rename its file to `<ID>.md`, fill any empty field with the new-item value and delete every template prompt he left unfilled (`field-mapping.md`, "A new item's starting values"), keeping everything he wrote, and add a Recent History row: "Made by hand by the owner; given the ID WI-034." Keep his folder name. Tell him in one line.
- A file named `WORK-ITEM.md` outside the template is always a hand copy.

## Two items with one ID

- A duplicate you just made yourself while creating an item: renumber your own without asking ("Creating an item's folder and ID", step 5).
- Any other duplicate (usually a copied folder): ask the owner which is the original. After his answer, give the copy the next free ID: `id:`, the heading, the file name `<ID>.md`, and the folder name when it starts with the old ID. Add a Recent History row on both items.

## Links and Obsidian

- The whole project folder is the Obsidian vault. `[[WI-031]]` links to the file `WI-031.md`, wherever its folder sits.
- Examples written in backticks are not links. Write real links without backticks.

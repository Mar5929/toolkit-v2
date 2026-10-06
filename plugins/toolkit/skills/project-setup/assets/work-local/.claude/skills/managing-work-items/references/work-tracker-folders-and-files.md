# Work item folders, IDs, and changes made by hand (local files)

This file says how to make a work item's folder and ID, how to check for changes that the owner made by hand, and how to move, group, archive, and rename work items. Open it for any of those jobs.

## Contents

- The work-items folder
- Creating a work item's folder and ID
- The check for changes made by hand
- Findings that need the owner
- Moving a work item under another parent, or to the top level
- Groups
- Archive
- Renaming a folder or a file
- A work item that the owner made by hand
- Two work items with one ID
- Links and Obsidian

## The work-items folder

`work-items/AGENTS.md` lists the files and folders in `work-items/`. This section adds two things that `work-items/AGENTS.md` does not say.

- **Levels.** A work item is at level 1 when its folder is at the top of `work-items/`, in a group, or at the top of `archive/`. Each work item folder that is nested inside another work item folder is one level deeper.
- **Three things say the same.** The nesting of the folders, the sub-item's `parent:` line, and its parent's list of sub-items say the same thing. For example:
  - WI-003 holds `parent: WI-002`, and the Sub-items cell of the phase of WI-002 that WI-003 delivers names `[[WI-003]]`.
  - WI-004 holds `parent: WI-003`, and the `**Sub-items:**` line of WI-003 names `[[WI-004]]`.

  `field-mapping.md`, section "Roadmap and Tasks", says where a parent's list of sub-items is.

## Creating a work item's folder and ID

These steps make the folder and the file of a new work item. Afterwards, fill the work item's fields as `field-mapping.md`, section "A new work item's starting values", says.

1. **Level check** (for a sub-item only). Read the parent's `parent:` line. Then read the `parent:` line of the work item that it names, which is the grandparent. When the grandparent has a parent, the parent is at level 3: make no sub-item.
2. **The prefix.** Read it from `PROJECT.md`:

   ```bash
   sed -nE 's/^- Work item ID prefix: `([^`]*)`.*/\1/p' "$MAIN/PROJECT.md"
   ```

   When the command prints nothing, `not used`, or still `<WI>`, stop and tell the owner that the setup is incomplete.
3. **The next ID.** In this command, replace `WI` with the prefix:

   ```bash
   grep -rhE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^id: *"?WI-[0-9]+"? *$' "$MAIN/work-items" | sed -E 's/.*-([0-9]+)"? *$/\1/' | sort -n | tail -1
   ```

   When the command prints `031`, the new ID is `WI-032` (`printf '%s-%03d\n' WI 32`). When the command prints nothing, the first ID is `WI-001`.
4. **Make the folder first.** Use a plain `mkdir`, never with `-p`, so that the command fails when the folder already exists. The slug is the part of the folder name after the ID. It is two to four lowercase words from the title, joined by hyphens.
   - A top-level item goes in `"$MAIN/work-items/WI-032-transaction-entry"`.
   - A work item in a group that the owner named goes in `"$MAIN/work-items/<group>/WI-032-transaction-entry"`.
   - A sub-item goes inside the parent's folder.
5. **Check for a duplicate** right after you make the folder:

   ```bash
   find "$MAIN/work-items" -type d -name 'WI-032-*' -not -path '*/work-item-template/*'
   grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^id: *"?WI-032"? *$' "$MAIN/work-items"
   ```

   The first command must print only your folder, and the second command must print nothing. When either command prints anything else, another session took the number, so your work item is the later one. Take the next free number, rename your folder, which is still empty, with `mv`, and check again.
6. **Copy the template** into the folder:

   ```bash
   cp "$MAIN/work-items/work-item-template/WORK-ITEM.md" "<item folder>/WI-032.md"
   ```

   When the project's template is missing, stop and tell the owner. `project-setup` restores the template.
7. After the fields are filled, run the `grep` command from step 5 again. It must print exactly one file, your `WI-032.md`.

## The check for changes made by hand

The owner may move, rename, nest, copy, or delete work item folders and files in Finder or Obsidian, and may edit fields in Obsidian's Properties panel. The owner's change is the one to keep. Never undo it, and never move a folder back on your own.

Run the three commands in `searching.md`, section "The commands of the check for changes made by hand":

1. The first command lists every work item's file, ID, and `parent:` line. For each work item, compare these five things:
   - its parent by folders. That parent is the nearest folder above the work item that holds a work item file. It is `none` for a work item at the top of `work-items/`, in a group, or at the top of `archive/`;
   - its `parent:` line;
   - the lists of sub-items of both parents, which this command prints: `grep -nE '^\| *P[0-9]+ —|^\*\*Sub-items:\*\*' "<parent file>"`;
   - its file name, which is `<ID>.md`;
   - its level. Three work item folders above a work item make it a fourth level.
2. The second command prints each ID that two files share.
3. The third command prints the template copies that the owner made by hand.

Also check that each ID you are about to use exists. An ID that no file holds is missing.

When the folders and the `parent:` line disagree, use the folders. Tell the owner each finding in one line, and then record the finding as this list says:

- **The folders say that the parent is X, `parent:` says Y or `none`, and X's list of sub-items does not name the work item.** The owner moved the folder.
  - Set `parent: X`.
  - Move the work item from Y's list of sub-items to X's list. When X is top-level, move it to the cell of the phase of X that it serves, and name the phase.
  - Add "Moved by hand" rows on the work item, on X, and on Y.
  - When the work item's level changed, also follow `field-mapping.md`, section "A work item that changes level".
- **The work item is at the top level or in a group, and `parent:` names a work item.**
  - Set `parent: none`.
  - Remove the work item from the old parent's list of sub-items.
  - Add rows on both work items.
  - The work item is now top-level. Follow `field-mapping.md`, section "A work item that changes level", and ask the owner which project phase the work item goes under.
- **The work item is in `archive/`, and no Recent History row says so.** Add a row "Archived by hand". The `state` stays.
- **The file name is not `<ID>.md`.** The file is still the work item. Tell the owner that `[[WI-031]]` links no longer reach it, and offer to rename it back.
- **A template copy has a real title.** It is a work item that the owner made by hand. Follow "A work item that the owner made by hand", below.
- **A template copy has the template's title.** It is an unused copy. Tell the owner, and ask whether to fill it in.
- **`state`, `status`, `waiting_on`, an approval field, or `design` differs from the work item's Current state and from the latest Recent History row.** The owner's value is the one to keep. Add a row "Changed by hand: <field> <old> to <new>". When `state` and `status` no longer match each other, `managing-work-items` says what to do.
- **A task is ticked, or rows or tasks were moved between phases.** That is the owner's plan now. Add a Recent History row.

When only the folder name changed, there is nothing to fix.

After a move, make two things true: `parent:` matches the folder that the work item is in, and each parent's list of sub-items names exactly its sub-items. Add a Recent History row on each parent whose list changed.

## Findings that need the owner

Ask about one finding at a time, with your recommendation. Save the question and the owner's answer as a Questions and Answers row on the work item.

- **`parent:` changed but the folder did not, and the old parent's list of sub-items still names the work item.** Ask whether to move the folder under the new parent. Recommend yes.
- **Two files have one ID.** Ask which file is the original. Then give the copy the next free ID, as "Two work items with one ID" says.
- **A work item is missing.** Ask whether the owner removed it on purpose, or moved it.
  - When the owner removed it on purpose, remove the lines that name it, which are in the parent's list of sub-items, and record the owner's words on the parent.
  - When the owner moved it, ask where.
- **A work item is four levels deep.** Ask whether to move it up, or to turn it into tasks. Recommend moving it up.
- **A sub-item is under a parent that is Done or Cancelled.** Ask whether to keep it there, or to move it to the top level.

## Moving a work item under another parent, or to the top level

Move a work item only when the owner asks.

1. **Level check.** The deepest work item that moves, with its sub-items, must end at level 3 at most. Level 1 is the top. When a move would make a fourth level, say so, and recommend another parent, or recommend turning the deepest work items into tasks.
2. **Move the folder** with `mv`, with its sub-items inside it. First check that the target has no folder of the same name.
3. **Fields.** Set `parent:` to the new parent's ID, or to `none`. Set `updated:`.
4. **Lists of sub-items and the roadmap.**
   - Remove the work item's `[[WI-007]]` from the old parent's list of sub-items. Write "None." when the list is then empty.
   - Add it to the new parent's list. Under a top-level parent, put it in the cell of the phase that the owner names. When the owner names no phase, ask which phase, with your recommendation, and save the question as a Questions and Answers row.
   - When the work item moved to the top level, list it under a project phase, as `project-roadmap-and-tasks.md` says.
   - When the work item moved from the top level, remove it from its project phase.
   - When the work item's level changed, follow `field-mapping.md`, section "A work item that changes level".
5. **Recent History.** Add a row on the work item, on the old parent, and on the new parent, with the owner's words or the Q-ID: "Moved under [[WI-003]] at the owner's request (Q-05)."
6. **Read back.** The work item is found by its ID at the new path, and its sub-items are found under it.

## Groups

- The owner may group work items in a plain folder. Make the folder, and `mv` the work items into it.
- A group holds top-level items. It changes no parent and no field.
- Add a Recent History row on each work item that moved: "Moved to the security group at the owner's request."
- Never start a group's name with an ID.
- Never make a group on your own.

## Archive

- Archive a work item only when the owner asks. `mv` the work item's folder into `work-items/archive/`. When `archive/` is missing, make it with `mkdir -p`.
- Archiving is not cancelling: the `state` stays. Add a Recent History row: "Archived at the owner's request."
- A work item moves to the archive with its sub-items.
- A sub-item that is archived on its own leaves its parent. Say so in one line first. Then set `parent: none`, remove the sub-item from the parent's list of sub-items, and add a Recent History row on both.
- The board, which is the list of open work items, leaves `archive/` out. Archived IDs still count for the next ID.
- To bring a work item back, move its folder out of `archive/` to the place that the owner names, and add a Recent History row.
  - When the owner names no place, move it to the top of `work-items/`.
  - When the owner names a parent, also follow "Moving a work item under another parent, or to the top level".

## Renaming a folder or a file

- The folder name may change, because nothing points at it. Rename a folder only when the owner asks, with `mv` inside the same parent folder.
- The work item's file keeps the name `<ID>.md`, because `[[WI-031]]` finds the file by its name. Never rename a work item's file yourself. The one exception is to give the name `<ID>.md` to a work item that the owner made by hand, or to a renumbered copy.

## A work item that the owner made by hand

- A copy of the template with a real title is a work item that the owner made by hand. A title is real when `title:` is not `<Work item title>`. Do these things:
  - Give it the next ID, with steps 2 and 3 of "Creating a work item's folder and ID".
  - Set `id:` and the heading, and rename its file to `<ID>.md`.
  - Fill any empty field with the value that a new work item gets, and delete every template prompt that the owner left unfilled. A prompt is text in angle brackets that says what to write there. `field-mapping.md`, section "A new work item's starting values", gives the values. Keep everything that the owner wrote.
  - Add a Recent History row: "Made by hand by the owner; given the ID WI-034."
  - Keep the owner's folder name.
  - Tell the owner in one line.
- A file named `WORK-ITEM.md` outside the template is always a copy that the owner made by hand.

## Two work items with one ID

- When you just made the duplicate yourself while creating a work item, renumber your own work item without asking, as step 5 of "Creating a work item's folder and ID" says.
- For any other duplicate, which is usually a copied folder, ask the owner which is the original. After the owner's answer, give the copy the next free ID: change `id:`, the heading, the file name `<ID>.md`, and the folder name when it starts with the old ID. Add a Recent History row on both work items.

## Links and Obsidian

- The whole project folder is the Obsidian vault. `[[WI-031]]` links to the file `WI-031.md`, wherever its folder is. The link works with Obsidian's **Use `[[Wikilinks]]`** setting off, which the project's `README.md` asks for.
- Examples written in backticks are not links. Write real links without backticks.

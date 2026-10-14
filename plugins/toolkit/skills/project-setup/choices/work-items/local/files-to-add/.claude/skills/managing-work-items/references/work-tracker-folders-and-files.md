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
  - WI-003 holds `parent: WI-002`, and WI-002's list of sub-items names `[[WI-003]]`, in a phase cell when WI-002 uses phases or on its Sub-items line otherwise.
  - WI-004 holds `parent: WI-003`, and the `**Sub-items:**` line of WI-003 names `[[WI-004]]`.

  `work-tracker-field-mapping.md`, section "Roadmap and Tasks", says where a parent's list of sub-items is.

## Creating a work item's folder and ID

These steps make the folder and the file of a new work item. Afterwards, fill the work item's fields as `work-tracker-field-mapping.md`, section "A new work item's starting values", says.

1. **Level.** A new sub-item belongs inside its parent's folder and must fit the three-level hierarchy.
2. **Prefix.** Use the work-item ID prefix recorded under Toolkit settings in `PROJECT.md`.
3. **ID.** Use the highest existing numeric ID plus one, formatted with three digits. Include archived items and exclude templates. The first ID is `<prefix>-001`.
4. **Folder.** Use `<ID>-<short-slug>`, with lowercase title words joined by hyphens. Top-level items belong directly in `work-items/` or an existing group; sub-items belong in the parent's folder.
5. **Concurrent creation.** Another session may allocate the same number. If it does, give your new item the next free ID without changing the existing item.
6. **Template.** Copy `work-items/work-item-template/WORK-ITEM.md` to `<ID>.md` inside the new folder, then fill it using `work-tracker-field-mapping.md`. Setup supplies a missing template; do not substitute a different record layout.
7. **Identity.** Keep the item's ID, filename and links consistent. A routine folder rename does not change its ID.

## The check for changes made by hand

The owner may move, rename, nest, copy, or delete work item folders and files in Finder or Obsidian, and may edit fields in Obsidian's Properties panel. The owner's change is the one to keep. Never undo it, and never move a folder back on your own.

For affected items, compare the folder nesting, `parent:` fields, parent sub-item lists and IDs. The nearest enclosing work-item folder is the parent; ordinary group folders do not add a level. Identify duplicate IDs or unfilled template copies when they account for the inconsistency.

When the folders and the `parent:` line disagree, use the folders. Tell the owner each finding, and then record the finding as this list says:

- When the folder's parent changed, update `parent:` and both parents' lists of sub-items to match the folders. Record "Moved by hand" on the item and each affected parent. When the level changed, follow `work-tracker-field-mapping.md`, section "A work item that changes level or plan grouping". A work item moved to the top level needs its owner's project phase.
- **The work item is in `archive/`, and no Recent History row says so.** Record the manual archive and who made it in Recent History. The `state` stays.
- **The file name is not `<ID>.md`.** The file is still the work item. Tell the owner that `[[WI-031]]` links no longer reach it, and offer to rename it back.
- **A template copy has a real title.** It is a work item that the owner made by hand. Follow "A work item that the owner made by hand", below.
- **A template copy has the template's title.** It is an unused copy. Tell the owner, and ask whether to fill it in.
- **`state`, `status`, `waiting_on`, an approval field, or `design` differs from the work item's Current state and from the latest Recent History row.** The owner's value is the one to keep. Record who changed the field by hand, its old and new values, and the reason when known. When `state` and `status` no longer match each other, `managing-work-items` says what to do.
- **A task is ticked, or rows or tasks were moved between phases.** That is the owner's plan now. Add a Recent History row.

When only the folder name changed, there is nothing to fix.

After a move, make two things true: `parent:` matches the folder that the work item is in, and each parent's list of sub-items names exactly its sub-items. Add a Recent History row on each parent whose list changed.

## Findings that need the owner

Resolve inconsistencies from the owner's direction and the available records. When identity or the intended plan remains uncertain, record the question and the owner's answer in the work item.

- **`parent:` changed but the folder did not, and the old parent's list of sub-items still names the work item.** Ask whether to move the folder under the new parent. Recommend yes.
- **Two files have one ID.** Ask which file is the original. Then give the copy the next free ID, as "Two work items with one ID" says.
- **A work item is missing.** Ask whether the owner removed it on purpose, or moved it.
  - When the owner removed it on purpose, remove the lines that name it, which are in the parent's list of sub-items, and record the owner's words on the parent.
  - When the owner moved it, ask where.
- **A work item is four levels deep.** Ask whether to move it up, or to turn it into tasks. Recommend moving it up.
- **A sub-item is under a parent that is Done or Cancelled.** Ask whether to keep it there, or to move it to the top level.

## Moving a work item under another parent, or to the top level

Organize work items to reflect the owner's current plan. Routine moves may preserve the agreed scope and approvals; a move that changes the plan needs the owner's decision.

1. **Level check.** The deepest work item that moves, with its sub-items, must end at level 3 at most. Level 1 is the top. When a move would make a fourth level, say so, and recommend another parent, or recommend turning the deepest work items into tasks.
2. **Move the folder** with `mv`, with its sub-items inside it. First check that the target has no folder of the same name.
3. **Fields.** Set `parent:` to the new parent's ID, or to `none`. Set `updated:`.
4. **Lists of sub-items and the roadmap.**
   - Remove the work item's `[[WI-007]]` from the old parent's list of sub-items. Write "None." when the list is then empty.
   - Add it to the new parent's list. When the parent uses phases, put it in the cell of the phase that the owner names. When the owner names no phase, ask which phase, with your recommendation, and save the question as a Questions and Answers row. When the parent has no phases, use its Sub-items line.
   - When the work item moved to the top level, list it under a project phase, as `work-tracker-project-roadmap-and-tasks.md` says.
   - When the work item moved from the top level, remove it from its project phase.
   - When the work item's level changed, follow `work-tracker-field-mapping.md`, section "A work item that changes level or plan grouping".
5. **Recent History.** Add a row on the work item, on the old parent, and on the new parent, that names the old and new parent and records why the move was made and cites the owner's direction when applicable.
6. **Read back.** The work item is found by its ID at the new path, and its sub-items are found under it.

## Groups

- The owner may group work items in a plain folder. Make the folder, and `mv` the work items into it.
- A group holds top-level items. It changes no parent and no field.
- Record each work item's old and new group and the reason for the change in Recent History, including the owner's direction when applicable.
- Never start a group's name with an ID.
- Keep grouping consistent with the owner's plan; grouping does not change scope or approvals.

## Archive

- Archive a work item only when the owner asks. `mv` the work item's folder into `work-items/archive/`. When `archive/` is missing, make it with `mkdir -p`.
- Archiving is not cancelling: the `state` stays. Record the archive and the owner's authorization in Recent History.
- A work item moves to the archive with its sub-items.
- A sub-item that is archived on its own leaves its parent. Say so first. Then set `parent: none`, remove the sub-item from the parent's list of sub-items, and add a Recent History row on both.
- The board, which is the list of open work items, leaves `archive/` out. Archived IDs still count for the next ID.
- To bring a work item back, move its folder out of `archive/` to the place that the owner names, and add a Recent History row.
  - When the owner names no place, move it to the top of `work-items/`.
  - When the owner names a parent, also follow "Moving a work item under another parent, or to the top level".

## Renaming a folder or a file

- The folder name may change, because nothing points at it. A routine folder rename stays inside the same parent and preserves the work item's identity.
- The work item's file keeps the name `<ID>.md`, because `[[WI-031]]` finds the file by its name. Never rename a work item's file yourself. The one exception is to give the name `<ID>.md` to a work item that the owner made by hand, or to a renumbered copy.

## A work item that the owner made by hand

- A copy of the template with a real title is a work item that the owner made by hand. A title is real when `title:` is not `<Work item title>`. Do these things:
  - Give it the next ID, with steps 2 and 3 of "Creating a work item's folder and ID".
  - Set `id:` and the heading, and rename its file to `<ID>.md`.
  - Fill any empty field with the value that a new work item gets, and delete every template prompt that the owner left unfilled. `work-tracker-field-mapping.md`, section "A new work item's starting values", gives the values. Keep everything that the owner wrote.
  - Record that the owner made the item by hand and which ID you assigned in Recent History.
  - Keep the owner's folder name.
  - Tell the owner.
- A file named `WORK-ITEM.md` outside the template is always a copy that the owner made by hand.

## Two work items with one ID

- When you just made the duplicate yourself while creating a work item, renumber your own work item without asking, as step 5 of "Creating a work item's folder and ID" says.
- For any other duplicate, which is usually a copied folder, ask the owner which is the original. After the owner's answer, give the copy the next free ID: change `id:`, the heading, the file name `<ID>.md`, and the folder name when it starts with the old ID. Add a Recent History row on both work items.

## Links and Obsidian

- The whole project folder is the Obsidian vault. `[[WI-031]]` links to the file `WI-031.md`, wherever its folder is. The link works with Obsidian's **Use `[[Wikilinks]]`** setting off, which the project's `README.md` asks for.
- Examples written in backticks are not links. Write real links without backticks.

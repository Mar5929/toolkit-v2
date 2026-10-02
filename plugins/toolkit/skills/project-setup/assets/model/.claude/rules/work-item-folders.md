# Local Work-Item Folders

This project tracks work in local folders under `work-items/`: Git-ignored, in the main checkout, and shared by every worktree. From a git worktree, the main checkout is the first path `git worktree list` prints.

Find, create, change, and move items with the `tracking-work-items` skill, which also covers sub-items, groups, and `archive/`.

## Finding and creating items

- An item is a folder, `work-items/<ID>-<short-slug>/`, holding `<ID>.md` (for example `WI-031.md`), `DESIGN.md` when a design exists, and a `references/` folder for source files such as meeting transcripts and documents (in a Salesforce project, a client file stays in `delivery/` and the Sources list names its path).
- Only the item's main file is named by the bare ID. Never give another file in the project that name (a test plan is `<ID>-test-plan.md`), so links such as `[[WI-031]]` have one target.
- The front matter `id:` (for example `WI-031`) is the item's identity. Find an item by its `id:` field, never by its path; the folder name and location may change.
- Keep the file name `<ID>.md` when you create or move an item, so links such as `[[WI-031]]` keep working. If the owner renames the file, still find the item by its `id:`.
- `work-items/work-item-template/` is the form, not an item. A new item's `<ID>.md` is a copy of its `WORK-ITEM.md`; only the template carries that name.
- The next ID is the highest `id:` anywhere under `work-items/`, `archive/` included and the template left out, plus one. With no items yet, the first ID is the prefix from `PROJECT.md` "Toolkit settings" plus `-001`. IDs are never reused.
- Create the new item's folder, `work-items/<ID>-<short-slug>/`, first. Then check every folder under `work-items/` at any depth (sub-items are nested, and `archive/` is a subfolder), the template left out, for another folder whose name starts with `<ID>-` or another item with the same `id:`.
- If a duplicate appears, the later item takes the next free number. Treat your own new item as the later one: renumber it and check again. Never renumber an item you did not just create.

## When the owner moves folders

- The owner may move, rename, nest, or group item folders by hand. Find each item again by its `id:`, report what moved, and continue.
- When two items share an `id:`, or an item named in Current State, the roadmap, or another item cannot be found, tell the owner and fix it with the `tracking-work-items` skill.
- Never move, group, archive, or rename items on your own initiative. When the owner asks, use the `tracking-work-items` skill.

## Editing items

- Change front matter fields (state, status, parent, waiting on, approvals) and body sections with the `tracking-work-items` skill.
- Keep any other files the owner put in an item folder.

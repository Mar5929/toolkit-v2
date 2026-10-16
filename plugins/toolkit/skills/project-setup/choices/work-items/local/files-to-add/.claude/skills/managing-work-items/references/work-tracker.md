# Work tracker (local files)

Work items live in `work-items/` as one folder per item. The lifecycle decides what to save and when; this file only says where and how.

## Layout

- `work-items/<short name>/<ID>.md` is the item. The folder takes the item's short name (`building.md`). `DESIGN.md` in the same folder is its design. Sub-items are folders inside their parent's folder.
- New items and designs are copied from `work-items/work-item-template/`. The template shows every field and section; keep its headings and bold labels.
- The ID prefix is in `PROJECT.md`, "Toolkit settings". IDs are three digits: "WI-31" means `WI-031`.
- Project phases are in `PROJECT-ROADMAP.md`; project tasks are in `work-items/PROJECT-TASKS.md`.
- `archive/` holds archived items.

## Rules

- `work-items/` exists only in the main checkout. From a worktree, read and write there; never copy items into the worktree and never `git add` them. If it's missing, tell the owner the setup is incomplete.
- The `id:` line is the item's identity, never its path. The owner moves, renames, and nests folders by hand: find items by ID, tell the owner what moved, and carry on.
- Change only the lines that change, and set `updated:` to today.
- Never move, group, archive, or rename an item unless the owner asks.
- Link other items as `[[WI-031|<item name>]]`; `parent:` stays a plain ID.
- In tables, escape `|` as `\|` and join lines with `<br>`.
- `PROJECT-ROADMAP.md` is tracked in Git: read it from the default branch and change it only through `publish-docs`.
- If an ID has two files, or none, tell the owner before creating anything.
- Record a pull request by naming it in the item's Related items and in Recent History.
- A helper opens an item by ID: find the folder whose `<ID>.md` has that `id:` line, and read it and its `DESIGN.md`. If the helper can't reach the main checkout, give it freshly read text.

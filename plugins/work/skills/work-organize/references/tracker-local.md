<!-- Generated file. Source: plugins/work/shared/tracker-local.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# The local tracker (`.work-items/`)

How work items are stored when `tracker.type` is `local`, what the CLI does
by itself, and what the agent must never do to the folder.

## Contents

1. Where the items live
2. An item is its id, not its path
3. Sub-items, groups, and the archive
4. What the tracker ignores
5. Generated and state files
6. What `toolkit work sync` does by itself
7. Worktrees and the item
8. Editing a record
9. Backup and restore

## 1. Where the items live

- `.work-items/` sits in the project's main checkout. It is Git-ignored and
  shared by every worktree, so every session sees the same items.
- Never commit `.work-items/`. Git does not back it up; the toolkit's
  automatic backup does (section 9).
- `toolkit config get tracker.type` prints `local` for this tracker.
- The project's own rule for this tracker is
  `.claude/rules/work-item-folders.md`.

## 2. An item is its id, not its path

- An item is a folder that holds `WORK-ITEM.md`, and `DESIGN.md` once it has
  a design. The frontmatter `id` (for example `WI-001`) is its identity. The
  folder name and the file name may change.
- Refer to items by id everywhere, never by path.
- Find an item's files only with:
  `toolkit work show <id> --path`
- Create items only with `toolkit work new`. It takes the next id under a
  lock, so parallel sessions never pick the same one. Ids are never reused.

## 3. Sub-items, groups, and the archive

- A record inside another item's folder is that item's sub-item. Its
  `parent` follows its location.
- A plain folder with no record in it is a group. A group changes no parent.
  A sub-item cannot also sit in a group.
- `archive/` is a reserved group. Items there are hidden from the briefing,
  the dashboard, and `toolkit work next`. Archiving is not cancelling.
- Move items only when the owner asks:
  `toolkit work move <id> --under <parent-id>`
  `toolkit work move <id> --under <group>`
  `toolkit work move <id> --under archive`
  `toolkit work move <id> --under root`
- A move carries every nested item with it.

## 4. What the tracker ignores

- `work-item-template/` (the template the CLI copies);
- any folder whose name starts with `_` or `.`;
- any record whose title is still `<Work item title>` (an unused template
  copy).

## 5. Generated and state files

- `.work-items/DASHBOARD.md`: the board as a file, rebuilt by every
  `toolkit work` write and by `toolkit work sync`.
- `.work-items/.toolkit-state.json`: the id-to-path map and the highest id
  used.

Never edit either by hand or from the shell. The pre-tool hook refuses it.
"Show the board" means: summarize `DASHBOARD.md`.

## 6. What `toolkit work sync` does by itself

The session-start hook, the prompt hook, and every `toolkit work` command run
a sync. It rescans `.work-items/` and:

- follows a folder or file the owner moved or renamed, by the record's `id`;
- sets `parent` from the new location when a folder was nested inside another
  item's folder, or moved out of one;
- adopts a record with no id (a template copy with a real title): gives it
  the next free id and reports it;
- renumbers the newer of two records that share an id, and reports both;
- writes one Recent History row on each item the owner moved or renamed
  ("Moved by hand: <old path> -> <new path>", "Folder renamed by hand: ..."),
  and on the parents a sub-item left and joined ("Sub-item WI-7 moved out by
  hand", "Sub-item WI-7 moved here by hand");
- rebuilds `DASHBOARD.md`.

Every change is reported: in the session briefing under "Changes found in the
tracker", and by the next `toolkit work` command. Tell the owner each one in
one line before other work. Open `work-organize` for anything the report
calls missing or duplicated.

## 7. Worktrees and the item

- An item's code work happens in its own worktree
  `.claude/worktrees/<prefix>-<number>-<slug>` on branch
  `claude/<prefix>-<number>-<slug>`. `<prefix>` is the item's id prefix in
  lower case: `wi` for `WI-007`, `tv2` for `TV2-007`.
- `toolkit work show <id>` prints the exact branch and folder to use.
- The briefing and `toolkit work next` tie a worktree to its item by the id in
  the branch name. A branch named `wi-001-...` is not linked to `TV2-001`.
- From a worktree, `toolkit work` still reads the main checkout's
  `.work-items/`.

## 8. Editing a record

- Prefer `toolkit work edit <id> --section '<heading>'`.
- Body text may also be changed with the file edit tool; the post-tool hook
  checks the record after each edit and reports problems.
- Header fields change only through `toolkit work set`, `approve`, `design`,
  `move`, `finish`, and `cancel`. A file edit that changes them is refused.
- Keep any other files the owner put in an item folder.

## 9. Backup and restore

- The owner's backup folder is the `backup.dir` setting. Setup asks for it.
  `toolkit config get backup.dir`
- With it set, these back up `.work-items/` and `.memory/` (and Hindsight
  memory) to `<backup.dir>/<project key>-<YYYY-MM-DD>/` by themselves, and
  each prints one line about it:
  - `toolkit work finish`;
  - `toolkit handoff-backup`, the last step of the `handoff` skill;
  - the session start, when the last backup on this computer is more than a
    day old (`.work-items/` and `.memory/` only).
- Read that line. "Backed up ..." is done. "No backup folder is set ..."
  means: ask the owner for a folder outside the project, then
  `toolkit config set backup.dir <folder>` (`none` when he wants no backup).
  A line with "failed" or "Tell the owner" goes to him as it is; the work
  itself is saved.
- `toolkit export --to <folder>` is the backup by hand, to a new folder
  outside the project.
- `toolkit doctor` warns when no backup folder is set, when it cannot be
  reached, and when the last backup is more than a day old. When the owner
  chose `none`, it only notes a last export more than 7 days old.
- A restore runs only when the owner asks. Before it, back up the current
  state to a new folder, so the restore can be undone. Then a dry run, then
  the real run after his yes. Both hosts ask the owner to allow every
  `toolkit import` command, the dry run too, so tell him the prompt is
  coming.
  `toolkit import --from <folder> --dry-run`
  `toolkit import --from <folder>`
- A file that differs is a conflict, and then nothing is written unless
  `--replace` is given. Use `--replace` only after the owner's yes to the
  exact files the dry run named.
- The full restore order, with memory and a new computer, is in the
  `project-setup` skill. Open it when the owner asks for a restore.

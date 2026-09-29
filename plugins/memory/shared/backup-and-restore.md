# Backing up and restoring memory and the local tracker

Purpose: what each backup covers, where backups go, when they run by
themselves, and the exact dry-run-first sequence for a restore.

## Contents

- What lives only on this computer
- The backup folder
- Automatic backups
- Backing up by hand
- Before a restore
- Restore the project folders
- Restore memory from a memory export
- A new computer or a fresh clone
- Gotchas

## What lives only on this computer

| Part | Why it needs a backup |
| --- | --- |
| `.work-items/` (a local tracker) | Git ignores it |
| `.memory/` (built-in memory) | Git ignores it |
| Hindsight memory | It is in the local Hindsight server's bank |
| Notion tracker, Notion memory | Nothing: Notion keeps them |

A fresh clone or a new computer has none of the first three until they are
restored. Never treat an empty tracker or an empty memory index there as
"nothing was ever saved": restore first.

A project with both its work items and its memory in Notion needs no backup
folder (the owner's decision of 2026-09-28). Notion keeps each page's history
and keeps deleted pages in its trash. Setup does not ask for a folder, the
automatic backup copies nothing, and `toolkit doctor` gives no backup
warning. Say that in one line when the owner asks about backups.

## The backup folder

- The owner chooses one folder outside the project, for example
  `~/Backups/toolkit`, a synced folder, or an external drive. Setup asks for
  it. It is the `backup.dir` setting in `.toolkit.json`:

  ```text
  toolkit config get backup.dir
  ```

- Not set: ask the owner once, then save his answer. Give a full path
  (starting with `/` or `~/`); the command refuses a folder inside the
  project. "none" records that he wants no backup folder.

  ```text
  toolkit config set backup.dir <folder>
  ```

- Each day's automatic backup goes to its own folder, so an older day is
  still there when a later one is wrong:

  ```text
  <backup.dir>/<project key>-<YYYY-MM-DD>/
    work-items/          a copy of .work-items/ (a local tracker)
    memory/              a copy of .memory/ (built-in memory), without Obsidian's .obsidian/ folder
    memory-export/       a memory export (Hindsight memory)
    toolkit-export.json  what was copied, from where, and when
  ```

- A second backup on the same day replaces that day's `work-items/`,
  `memory/`, and `memory-export/` with the state at that moment. Nothing is
  merged.
- One exception keeps a good backup: when today's folder already holds more
  files in `work-items/` or `memory/` than the project has now (a fresh
  clone, or the project on a new computer), the backup goes to a new folder,
  `<project key>-<YYYY-MM-DD>-<HHMMSS>`, and today's earlier folder is kept as
  it was. The backup line says so.
- A second clone of the project with the same project key writes
  `<project key>-<YYYY-MM-DD>-<8 letters>` instead, so the two clones never
  write over each other.
- The toolkit never deletes an old day folder. Removing old ones is the
  owner's choice.

## Automatic backups

With `backup.dir` set, three things back up the parts above to today's
folder by themselves, and each prints one line saying what it copied:

- `toolkit work finish`;
- `toolkit handoff-backup`, the handoff's last step;
- the session start, when the last backup on this computer is more than a
  day old or there is none yet. It copies `.work-items/` and `.memory/`
  only, not Hindsight memory.

A failed backup never undoes the work; tell the owner the line it printed
(for example the external drive is not connected).

`toolkit doctor` warns when no backup folder is set, when the folder cannot
be reached, and when the last backup is more than a day old. When the owner
chose "none", it only notes backups older than 7 days. A project with both
its work items and its memory in Notion gets no backup warning.

## Backing up by hand

- With `backup.dir` set, one command backs up every part except Notion
  memory to today's folder. Use it at the end of a memory tidy and when the
  owner asks for a backup:

  ```text
  toolkit handoff-backup
  ```

- Before a change that may need undoing (a restore, the changes in a memory
  tidy, a switch of memory backend), back up to a new folder, never to
  today's folder. Name it with the date and time, for example
  `<backup.dir>/<project key>-before-restore-<YYYY-MM-DD-HHMM>`. With no
  backup folder set, use `~/Backups/<project key>-before-restore-<YYYY-MM-DD-HHMM>`.
  Run the command for each part the project has, in the order of the table
  below: `toolkit export` refuses a folder that already holds other files.

| Command | Run it when the project keeps | Copies |
| --- | --- | --- |
| `toolkit export --to <new folder>` | A local tracker or built-in memory | `.work-items/` into `work-items/` and `.memory/` into `memory/`, for the parts this project uses |
| `toolkit memory export --to <new folder>/memory-export` | Hindsight or Notion memory | Every memory record (retired ones too), the current focus, and the glossary, as Markdown in the `.memory/` layout. It works for built-in memory too |

Each target folder must be outside the project. An export into the folder of
an earlier export of the same kind replaces it, so give a new folder.

`toolkit memory status` shows the last memory export as "Last export"
(built-in and Hindsight).

## Before a restore

Restore only when the owner asks. Then, in this order:

1. Find the folder to restore from. Read the `toolkit-export.json` in each
   candidate day folder (or `toolkit-memory-export.json` in a memory
   export): `exportedAt` says when, `from` says which project folder it was
   copied from, and `parts` (in a memory export, `records`) says how many
   files it holds. Pick the newest folder made before the problem, with
   files in the part you need. A part with 0 files is not a copy of the lost
   state.
2. Back up the current state to a new folder ("Backing up by hand" above),
   so the restore can be undone. Never with `toolkit handoff-backup`: it
   writes today's folder, so when the restore comes from today's folder, it
   replaces that backup with the state you are about to undo.
3. Until the restore is done, run neither `toolkit handoff-backup` nor
   `toolkit work finish`. Each replaces today's folder.
4. Tell the owner that the host asks him to allow each import command, the
   dry run too (Claude Code asks for `toolkit import` and
   `toolkit memory import`; Codex has a prompt rule for each). In Codex, run
   each import alone with `sandbox_permissions` set to `require_escalated`
   and a one-line reason: the approval alone keeps it inside the sandbox,
   where it cannot write the main checkout from a worktree or reach
   Hindsight.

## Restore the project folders

For `.work-items/` and `.memory/`, from a day's folder or any `toolkit export`
folder.

- [ ] "Before a restore" is done.
- [ ] Dry run. It lists what would change and every conflict:

      ```text
      toolkit import --from <day folder> --dry-run
      ```

- [ ] A dry run that finds conflicts exits with code 2 and prints "Error:
      The export and this project both have different versions of ..., so
      nothing was imported: <files>". For a dry run that is the answer, not
      a failure: the files it names are the conflicts.
- [ ] Show the owner what would change, the conflicts, and the backup's
      date, and ask once.
- [ ] After his yes:

      ```text
      toolkit import --from <day folder>
      ```

- [ ] A file that differs from the backup is a conflict, and then nothing is
      written. Show him each conflict. Only after his yes to overwrite them:

      ```text
      toolkit import --from <day folder> --replace
      ```

- [ ] Conflicts only in `.memory/.obsidian/` (for example `workspace.json`):
      those are Obsidian's own window and settings files, which Obsidian
      rewrites while it is open. They are not memory. Do not use `--replace`
      for them: it would also put back the backup's older Obsidian settings.
      Restore memory with `toolkit memory import --from <day folder>/memory`
      ("Restore memory from a memory export" below; it reads only records,
      the focus, and the glossary), and a local tracker with the same
      `toolkit import` plus `--only work-items` (next item).
- [ ] To restore only one part, add `--only memory` or `--only work-items`
      to the import.
- [ ] Files that are only in the project are never deleted. The dashboard
      and the memory index are rebuilt afterwards.
- [ ] Check: `toolkit doctor`.

## Restore memory from a memory export

For Hindsight memory (`<day folder>/memory-export`), a built-in copy
(`<day folder>/memory`), or any folder made by `toolkit memory export`, into
any backend.

- [ ] "Before a restore" is done.
- [ ] Dry run. It lists the records it would save, whether the focus and the
      glossary would be replaced, and each file that breaks a rule:

      ```text
      toolkit memory import --from <folder> --dry-run
      ```

- [ ] The dry run exits with code 2 when it would skip any file, and lists
      each one under "Skipped <N>:". For a dry run that is the answer, not a
      failure: show him the skipped files.
- [ ] Show the owner the list and the backup's date, and ask once.
- [ ] After his yes:

      ```text
      toolkit memory import --from <folder>
      ```

- [ ] A record in the backup replaces the record with the same key. Records
      that are only in memory stay. The command lists skipped files and exits
      with code 2 when it skipped any.
- [ ] Check:

      ```text
      toolkit memory status
      toolkit doctor
      ```

The same import moves memory into another backend; the `project-setup` skill
holds the order of steps for switching backends.

## A new computer or a fresh clone

1. The `project-setup` skill installs the toolkit and runs its checks first.
2. The owner copies the backup folder to the new computer, or connects the
   drive. `backup.dir` comes with the project's `.toolkit.json`.
3. The first session in the project on the new computer backs up by itself,
   because this computer has no backup yet. So today's folder may already
   hold this computer's empty folders: its `toolkit-export.json` shows 0
   files in those parts, and an `exportedAt` after the move. Restore from
   the newest folder the old computer wrote ("Before a restore", step 1). If
   the old computer's last backup was made today too, this session's backup
   replaced it: use the day before, and tell the owner what may be missing.
4. A local tracker or built-in memory: restore the project folders from that
   folder.
5. Hindsight memory: after the bank exists, restore memory from
   `<that folder>/memory-export`.
6. A Notion tracker and Notion memory: nothing to restore.
7. `toolkit doctor` in the project.

## Gotchas

- `toolkit handoff-backup`, `toolkit work finish`, and the session-start
  backup all write today's folder, and a second one on the same day
  replaces it. Before a restore or a tidy, back up to a new folder with the
  export commands.
- An export into the folder of an earlier export replaces that export. Give
  a new folder.
- Both import commands ask the owner, the dry run too, in both hosts.
- Backups leave out `.memory/.obsidian/`, Obsidian's own window state. An
  older backup made before this may hold it; a conflict only in `.obsidian/`
  files is Obsidian's state, not memory.
- A deleted record stays in older backups: the day folders and every memory
  export made before the delete. When the owner deletes a secret or an email
  address, tell him those copies still hold it, and that he removes them
  himself.

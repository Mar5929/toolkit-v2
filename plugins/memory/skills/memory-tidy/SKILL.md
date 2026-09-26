---
name: memory-tidy
description: 'Reviews the whole project memory: merges duplicates, retires stale or contradicted facts, trims the current focus, and backs memory up. Use when the owner says "clean up memory" or "tidy memory", says memory seems wrong or out of date, or the toolkit doctor flags memory problems.'
---

# Memory tidy

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Record format: `../memory-save/references/record-format.md`. Approval rules: `memory-save` step 3 (the only written copy). Put each `toolkit` command on its own line; write `--body-file` and `--set-file` files in a temporary folder outside the repository.

## Steps

1. Check the setup and the backend, then list every record.
   `toolkit doctor`
   `toolkit memory status`
   `toolkit memory list`
2. Find duplicates, contradictions, stale records (replaced by a later decision, or not checked for a long time), records that copy work-item status, and a current focus over 50 lines.
   `toolkit memory get <key>`
   `toolkit memory focus`
3. Show one numbered list of proposed changes (merge, retire, correct, trim), each with its reason.
4. Ask once for the whole list. Apply the approval rules in `memory-save` step 3 to every change on it; for a delete, quote his words.
5. Apply the approved changes: save the merged or corrected record (`--supersedes` retires the record it replaces), retire a duplicate that is not saved again, and trim the focus.
   `toolkit memory save --type <type> --name <slug> --description "<one line>" --body-file <file> --supersedes <old-key> --approved-by <owner>`
   `toolkit memory retire <key> --superseded-by <new-key>`
   `toolkit memory delete <key> --owner-approved`
   `toolkit memory focus --set-file <file>`
6. Back up memory (any backend) to the owner's backup folder, and, for a local tracker, the tracker too; say when the last backup was made. Restore only on his request, after a dry run.
   `toolkit memory export --to <backup-folder>/memory`
   `toolkit export --to <backup-folder>/project`
   `toolkit memory import --from <backup-folder>/memory --dry-run`
   `toolkit memory import --from <backup-folder>/memory`
7. Report what changed by key and how to undo it.
   `toolkit memory restore <key>`

## What to look for

- **Duplicates:** two records with the same meaning. Keep the clearer one, merge anything the other adds, and retire the other with `--superseded-by`.
- **Contradictions:** two current records that cannot both be true. Ask which is right; never pick one by date alone.
- **Stale:** a record a later decision replaced, or one whose `last_verified` is old and whose subject has changed. Retire it, or mark it for review by saving it again after checking.
- **Wrong home:** a record that holds work-item status, next steps, or undelivered requirements. Move the meaning to the work item and retire the record.
- **Focus over 50 lines:** trim finished items from Now, move to-dos that became work items to Now as ids, and keep one entry in "Next session starts with".
- **Built-in index out of date** (doctor says so): rebuild it.
  `toolkit memory reindex`

## Backups

- The backup folder is the owner's choice, outside the project folder (for example a folder in his Documents that his computer backs up). Ask once and save the answer as a `reference` record with `memory-save`.
- The memory export copies every record (retired ones too), the current focus, and the glossary to Markdown files. It works for built-in, Hindsight, and Notion memory. The memory status command in step 1 shows its date as "Last export".
- The project export (`toolkit export`) copies the Git-ignored `.work-items/` and `.memory/` folders only. It is the tracker backup for a local tracker; it does not reach Hindsight or Notion memory. A Notion tracker needs no local backup.
- Doctor warns when the last export is older than 7 days.
- Restoring replaces records with the same key. Show what the backup holds and its date (the dry run lists it), and restore only after his yes. A tracker restore, also only after his yes:
  `toolkit import --from <backup-folder>/project`

## Rules

- Never hand-edit `.memory/` files, including `.memory/MEMORY.md`. The hooks refuse it.
- Retire before delete. A retired record can be restored; a deleted one cannot.
- Change nothing that the owner did not approve on the list.

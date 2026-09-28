---
name: memory-tidy
description: 'Reviews the project''s whole memory (.memory/, Hindsight, or Notion): merges duplicates, retires stale or contradicted records, trims the current focus, and backs it up. Use when the owner says "clean up memory" or "tidy memory", thinks memory is wrong or out of date, or toolkit doctor flags memory.'
---

# Memory tidy

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Record format: `../memory-save/references/record-format.md`. Approval rules: `memory-save` step 3 (the only written copy). Run each `toolkit` command alone, on its own line, in both hosts: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, which blocks Hindsight and Notion). Text: one-line values go in single quotes, with an apostrophe written `'\''`, because double quotes run backticks and `$(...)`. A record body or the focus: in Claude Code pass it on standard input (`<file>` is `-`, followed by a quoted heredoc, `<<'EOF'`); in Codex give it in single quotes (`--body '<text>'`, `--text '<text>'`), or write a file with the file edit tool in a new folder made with `mktemp -d`, run the command alone, and delete the file and the folder right after. Never use a fixed name such as `/tmp/focus.md`. Ask the owner in the reply text.

## Steps

1. Check the setup and the backend, then list every record.
   `toolkit doctor`
   `toolkit memory status`
   `toolkit memory list`
2. Find duplicates, contradictions, stale records (replaced by a later decision, or not checked for a long time), records that copy work-item status or break the memory criteria, file names whose prefix does not match `metadata.type`, proposals the owner has not answered (marked as proposals in the list), and a current focus over 50 lines or missing its `# Current focus` title or "Last updated" line.
   `toolkit memory get <key> --json`
   `toolkit memory focus --json`
3. Show one numbered list of proposed changes (merge, retire, correct, trim), each with its reason.
4. Ask once for the whole list. Apply the approval rules in `memory-save` step 3 to every change on it; for a delete, quote his words.
5. Apply the approved changes: save the merged or corrected record, retire a duplicate that is not saved again, rename a record whose file name prefix does not match its content or `metadata.type` (the new key sets the type), and trim the focus. A correction in place saves the same key again with `--expect <version>`, the `version` field from step 2's `--json` read (the first 12 characters are enough). A merged record under a new key uses `--supersedes <old-key>`, which retires the record it replaces. A save that exits with code 2 saved nothing: it lists the same-key or similar records; read them and use the form that fits, as `memory-save` step 2 says. The CLI repairs links in other notes and names each note it changed; check that report.
   `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --expect <version> --approved-by <owner>`
   `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --supersedes <old-key> --approved-by <owner>`
   `toolkit memory retire <key> --superseded-by <new-key>`
   `toolkit memory rename <key> --to <new-key>`
   `toolkit memory delete <key> --owner-approved`
   `toolkit memory focus --set-file <file> --expect <version>`
   A proposal on the list: the owner's yes approves it, his no rejects it.
   `toolkit memory approve <key> --by <owner>`
   `toolkit memory reject <key>`
6. Back up memory (any backend) to the owner's backup folder, and, for a local tracker, the tracker too; say when the last backup was made. Restore only on his request, after a dry run.
   `toolkit memory export --to <backup-folder>/memory`
   `toolkit export --to <backup-folder>/project`
   `toolkit memory import --from <backup-folder>/memory --dry-run`
   `toolkit memory import --from <backup-folder>/memory`
7. Report what changed by key and how to undo it. End the reply with the one question for the owner, or the exact words that continue.
   `toolkit memory restore <key>`

## What to look for

- **Duplicates:** two records with the same meaning. Keep the clearer one, merge anything the other adds, and retire the other with `--superseded-by`. Links to the retired record are repaired by the CLI; no note may keep pointing at it.
- **Contradictions:** two current records that cannot both be true. Ask which is right; never pick one by date alone.
- **Stale:** a record a later decision replaced, or one whose `last_verified` is old and whose subject has changed. Retire it, or mark it for review by saving it again after checking.
- **Wrong home:** a record that holds work-item status, next steps, or undelivered requirements. Move the meaning to the work item and retire the record.
- **Focus over 50 lines:** trim finished items from Now, move to-dos that became work items to Now as ids, keep one entry in "Next session starts with", and update "Last updated". Never drop an unresolved owner to-do only to meet the limit.
- **Broken links:** a Related memories link whose target no longer exists. Point it at the record that replaced it, or remove it, and save the note again.
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

- Never hand-edit `.memory/` files; change them only with `toolkit memory` commands. The hooks refuse hand edits of `.memory/MEMORY.md`.
- Retire before delete. A retired record can be restored; a deleted one cannot.
- Change nothing that the owner did not approve on the list.

# Production Data Changes

- Agents never write data to production by CLI, API, anonymous Apex, or any wrapping tool. The owner runs the change.
- Sandbox data writes and anonymous Apex need the owner's yes for that change in the same chat. Approval does not carry to another change, session, or org.
- Reads, including SOQL, export, and describe, are allowed in every org.
- For a production data change, open the `sf-data-change` skill (`.claude/skills/sf-data-change/SKILL.md`) before replying. Prepare the exact load file, backup file, numbered load steps, success check, and undo steps for the owner. A general suggestion to update records is not a complete handoff.

## Keep the files with the data change

- Backups go in `delivery/data/production-backups/prod-backup-<MMDDYYYY>-<slug>/`. Load files go in `delivery/data/data-loads/<change-slug>-<MMDDYYYY>/`. In a project that already uses `engagement/`, use `engagement/data/` instead.
- Keep the exact backup or load files in the relevant local event folder. Record the org, population, file paths, counts, operation, success check, and undo steps in the chosen work item and the owner handoff. No extra event README or seed record is required.
- Never commit load or backup files, including `*.csv`, `*.xlsx`, and `*.xls` in these folders. They may contain record IDs and personal information. Keep each tree's `.gitignore`.
- Follow the `sf-data-change` skill for the folder layout and handoff fields.

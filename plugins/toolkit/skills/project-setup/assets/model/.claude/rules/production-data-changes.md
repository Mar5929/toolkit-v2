# Production Data Changes

Which data commands an agent may run in which org: `salesforce-org-safety.md`.

- Agents never write data to production by CLI, API, anonymous Apex, or any wrapping tool. The owner runs the change.
- For a production data change, open the `sf-data-change` skill (`.claude/skills/sf-data-change/SKILL.md`) before replying. Prepare the exact load file, backup file, numbered load steps, success check, and undo steps for the owner. A general suggestion to update records is not a complete handoff.
- A yes for a sandbox data write or anonymous Apex covers that one change in that chat. It does not carry to another change, session, or org.
- Backups go in `delivery/data/production-backups/prod-backup-<MMDDYYYY>-<slug>/`. Load files go in `delivery/data/data-loads/<change-slug>-<MMDDYYYY>/`. In a project that already uses `engagement/`, use `engagement/data/` instead.
- Never commit load or backup files, including `*.csv`, `*.xlsx`, and `*.xls` in these folders. They may contain record IDs and personal information. Keep each tree's `.gitignore`.

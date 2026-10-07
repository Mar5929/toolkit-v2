# Production Data Changes

Which data commands an agent may run in which org: `salesforce-org-safety.md`.

- Agents never write data to production by CLI, API, anonymous Apex, or any wrapping tool. The owner runs the change.
- For a production data change, open the `sf-data-change` skill (`.claude/skills/sf-data-change/SKILL.md`) before replying. Prepare the exact load file, backup file, numbered load steps, success check, and undo steps for the owner. A general suggestion to update records is not a complete handoff.
- A yes for a sandbox data write or anonymous Apex covers that one change in that chat. It does not carry to another change, session, or org. The one exception is while the owner has turned these questions off: then follow `salesforce-org-safety.md`, section "The owner's yes for a sandbox change".
- Backups go in `delivery/migrations/production-backups/prod-backup-<MMDDYYYY>-<slug>/`. Load files go in `delivery/migrations/data-loads/<change-slug>-<MMDDYYYY>/`.

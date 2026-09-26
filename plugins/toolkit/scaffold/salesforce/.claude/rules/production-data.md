---
paths:
  - "delivery/data/**"
  - "engagement/data/**"
---
# Production Data Files

- Backups go in `delivery/data/production-backups/prod-backup-<MMDDYYYY>-<slug>/`. Load files go in `delivery/data/data-loads/<change-slug>-<MMDDYYYY>/`.
- Keep the exact backup or load files in the relevant local event folder. Record the org, population, file paths, counts, operation, success check, and undo steps in the chosen work item and the owner handoff. No extra event README or seed record is required.
- Never commit `*.csv`, `*.xlsx`, or `*.xls` here. Keep each tree's `.gitignore`.
- Layout and handoff fields: the `sf-data-change` skill.

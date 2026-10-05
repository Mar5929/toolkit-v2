---
paths:
  - "delivery/**"
---

# Salesforce Records in delivery/

`delivery/AGENTS.md` gives the folders, the form of each record, and the Status values. This rule adds what only a Salesforce project has.

- Setup copied these into `delivery/`: `deployments/component-tracker.csv`, `deployments/full-project-deployment-template/`, `deployments/work-item-deployment-template/`, `releases/release-cutover-template/`, `migrations/area-template/`, `migrations/data-loads/`, and `migrations/production-backups/`.
- Start a deployment folder, a release folder, or a migration area by copying its template folder. Never write a record into a template.
- The Status of a step in `manual-steps.md` is Not started, In progress, Done, or Skipped.
- Which skill to use: `.claude/rules/component-tracker.md` and `.claude/rules/record-deployment-steps.md` for the component tracker, a package file, and manual deploy steps; `.claude/rules/production-data-changes.md` for a production data change, its load file, and its backup; `.claude/rules/check-deployment-contents.md` before a deploy to a shared org.

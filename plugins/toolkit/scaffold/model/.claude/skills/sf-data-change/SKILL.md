---
name: sf-data-change
description: 'Builds the owner''s package for a Salesforce production data change: load file, backup, numbered load steps, success check, and undo steps, filed under delivery/data/. Use when production records must be created, updated, upserted, or deleted, or a backup is needed first.'
---

# Salesforce data change handoff

No agent writes data to production. The owner runs the change. This skill produces what the owner needs to run it without going back and forth.

## Limits

| Operation | Production | Sandbox |
|---|---|---|
| Read (SOQL, export, describe) | Allowed | Allowed |
| Create, update, upsert, delete data | Never | Only after the owner says yes in the same chat |
| Anonymous Apex | Never | Only after the owner says yes in the same chat |

- A yes covers one change, in the chat where it was given. It does not carry to the next change, session, or org. Ask again.
- Not by CLI, API, anonymous Apex, or any tool that wraps them.

## Step 1: build the package

1. The load file. A CSV with the record `Id` plus every field the change sets, one row per record, ready to load as is. Never a fragment, a sample, or a description.
2. The backup file, when the change overwrites anything. The same records with their current values, so loading it back undoes the change. Label it as the undo file.
3. Numbered load steps. Name the tool (Data Loader, Import Wizard, Workbench, or what the owner uses), the operation (Insert, Update, Upsert, Delete), the object, the field mapping, the Insert-Null-Values setting, and the file's full path.
4. The success check. The expected row count, the success and error files the tool writes, and one query the owner runs afterwards to confirm it.
5. The undo steps. The exact steps to load the backup file back.

## Step 2: write the steps

- Use the real file path and the real values.
- "Map the fields appropriately" is not a step. Name each mapping.
- Write for someone who has not run this load before.
- Fill every target cell on an update, so a restore is complete and a load does not blank fields it should not.

## Step 3: file it

Use `delivery/data/`. An established `engagement/data/` project keeps that root. Keep actual data files local and ignored by Git.

```
delivery/data/
  production-backups/
    .gitignore
    prod-backup-<MMDDYYYY>-<slug>/
      <descriptive-name>.csv
  data-loads/
    .gitignore
    <change-slug>-<MMDDYYYY>/
      <load-file>.csv
```

- One folder per backup or load event. A multi-object change may put several files in the same event folder.
- The backup captures `Id` plus every field the change may overwrite, so it can be loaded back.
- Save the exact file that was loaded in the load event folder. Never leave the final copy loose in another folder.
- Never commit data files containing record IDs or PII. Keep both `.gitignore` files.
- Record the work item, date, org, objects and population, exact file paths and row counts, operation, mappings, settings, success check, and undo steps or backup pointer in the chosen work item and owner handoff. No separate event README or seed record is required.
- When starting a copied Git project, verify test `.csv` files under both trees are ignored, then remove the test files.

## Step 4: hand over

Give the owner the package in the reply: both file paths, which file is which, the numbered steps, the success check, and the undo steps. "You'll need to update those records" is not a handoff.

## Related rules

- `production-data-changes.md`: the always-loaded safety rule and folder layout for data changes.
- `salesforce-org-safety.md`: which commands are allowed against an org.
- `record-deployment-steps.md`: a pre-deploy snapshot for rollback is a manual step.

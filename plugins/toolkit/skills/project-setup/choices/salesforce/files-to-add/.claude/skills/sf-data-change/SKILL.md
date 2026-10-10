---
name: sf-data-change
description: 'Prepares the owner''s handoff for a Salesforce production data change: the load file, backup, numbered steps, success check, and undo steps. Use when the owner asks to load, import, update, or delete production records, including during a build. The owner runs the change.'
---

# Salesforce data change handoff

No agent writes data to production. The owner runs the change. This skill produces everything the owner needs to run the change without asking follow-up questions.

## Limits

| Operation | Production | Sandbox |
|---|---|---|
| Read (SOQL, export, describe) | Allowed | Allowed |
| Create, update, upsert, delete data | Never | As `.claude/rules/salesforce-agent-permissions.md` says |
| Anonymous Apex | Never | As `.claude/rules/salesforce-agent-permissions.md` says |

- `.claude/rules/salesforce-agent-permissions.md` holds the owner's choices for this project, and says how long a yes holds. A line there may differ from this table, and then that line wins.
- No agent writes production data by CLI, API, anonymous Apex, or any tool that wraps them.

## Step 1: build the handoff

1. The load file. A CSV with the record `Id` plus every field the change sets, one row per record, ready to load as is. Never a fragment, a sample, or a description.
2. The backup file, when the change updates, upserts, or deletes records. The same records with their current values, so loading it back undoes the change. Label it as the undo file.
3. Numbered load steps. Name the tool (Data Loader, Import Wizard, Workbench, or what the owner uses), the operation (Insert, Update, Upsert, Delete), the object, the field mapping, the Insert-Null-Values setting, and the file's full path.
4. The success check. The expected row count, the success and error files the tool writes, and one query the owner runs afterwards to confirm it.
5. The undo steps. The exact steps to load the backup file back. For an insert: the exact steps to delete the inserted records, using the IDs in the success file.

## Step 2: write the steps

- Use the real file path and the real values.
- "Map the fields appropriately" is not a step. Name each mapping.
- Write for someone who has not run this load before.
- Fill every target cell on an update, so a restore is complete and a load does not blank fields it should not.

## Step 3: file it

Use `delivery/migrations/`. Keep actual data files local and ignored by Git.

```
delivery/migrations/
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
- Record the work item, date, org, objects and population, exact file paths and row counts, operation, mappings, settings, success check, and undo steps (or the backup file's path) in the work item for this change and in the step 4 handoff. Write no separate README or other record for the event.
- Before the first data change in a project (no event folder under `delivery/migrations/data-loads/` yet), put a test `.csv` file in `delivery/migrations/production-backups/` and in `delivery/migrations/data-loads/`, check that `git status` lists neither, then delete both files.

## Step 4: hand over

Give the owner the handoff in the reply: both file paths, which file is which, the numbered steps, the success check, and the undo steps. "You'll need to update those records" is not a handoff.

## Hand-offs

| For | Use |
| --- | --- |
| A manual deploy step, such as a pre-deploy snapshot for rollback | `sf-component-tracker` |

## Related rules

- `salesforce-agent-permissions.md`: what an agent may do in each kind of org in this project.
- `salesforce-org-safety.md`: the limits that are the same in every project, and the commands.
- `salesforce-deployments.md`: record a manual step when a deploy needs an action the deploy cannot perform.

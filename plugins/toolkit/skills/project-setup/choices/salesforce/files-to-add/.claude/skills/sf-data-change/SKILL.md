---
name: sf-data-change
description: 'Prepares a Salesforce production data change: the load file, backup, numbered steps, success check, and undo steps. Use when the owner asks to load, import, update, or delete production records, including during a build. The owner runs the change unless the project''s Salesforce permissions allow the agent to.'
---

# Salesforce production data change

By default no agent writes data to production: the owner runs the change, and this skill produces everything the owner needs to run it without asking follow-up questions. When `.claude/rules/salesforce-agent-permissions.md` allows a production data change, prepare the same files, then run the change as that file says.

## Step 1: build the handoff

1. Prepare the complete load CSV, with one row per record and the fields and matching key that the chosen operation and tool require. Confirm the matching field for an upsert; new records do not require an existing Salesforce `Id`. Never hand over a fragment, a sample, or a description instead of the load file.
2. Before existing records change, back up their `Id` and the values needed for recovery. For an upsert, also record the matching keys and which records already exist. Label the backup with the recovery operation it supports; a backup alone does not establish that a deletion can be undone.
3. Write numbered load steps. Name the tool (Data Loader, Import Wizard, Workbench, or what the owner uses), the operation (Insert, Update, Upsert, Delete), the object, the matching field, each field mapping, the applicable null-value setting, and the file's full path.
4. Provide the expected row count, the success and error files the tool writes, and a query the owner runs afterwards to confirm the result. For an upsert, specify how to retain each successful record's `Id` and verify whether it was created or updated, so recovery can distinguish the two outcomes.
5. Write exact undo steps for each successful change, including a partially successful load. Restore prior values for updated records and delete newly created records using verified result IDs; a mixed upsert needs both. For a deletion, verify the supported recovery method and its limits before handing over the load. Explain any outcome that cannot be undone.

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
- The backup captures each existing record's `Id` and the values needed by the verified recovery method. Keep the input matching keys and result IDs with the load evidence so the owner can recover the records that actually changed.
- Save the exact file that was loaded in the load event folder. Never leave the final copy loose in another folder.
- Never commit data files containing record IDs or PII. Keep both `.gitignore` files.
- Record the work item, date, org, objects and population, exact file paths and row counts, operation, mappings, settings, success check, and undo steps (or the backup file's path) in the work item for this change and in the step 4 handoff. Write no separate README or other record for the event.
- Before the first data change in a project (no event folder under `delivery/migrations/data-loads/` yet), put a test `.csv` file in `delivery/migrations/production-backups/` and in `delivery/migrations/data-loads/`, check that `git status` lists neither, then delete both files.

## Step 4: hand over, or run it when allowed

When `.claude/rules/salesforce-agent-permissions.md` says Never for a production data change, give the owner the handoff in the reply: both file paths, which file is which, the numbered steps, the success check, and the undo steps. "You'll need to update those records" is not a handoff.

When that file allows the change, or says Ask first and the owner said yes:

1. Run the change with the matching `sf data` command from `.claude/rules/salesforce-org-safety.md`, "The commands", naming the production org with `-o`. Load the exact file from the load event folder.
2. Keep the success and error files with the load evidence, and run the success check yourself.
3. Record the result in the work item, with the details step 3 lists, and add a Recent History row that names the org, the file, the row counts, and the permission that allowed it.
4. Tell the owner the result, the paths of the backup and the load evidence, and the undo steps.

## Hand-offs

| For | Use |
| --- | --- |
| A manual deploy step, such as a pre-deploy snapshot for rollback | `sf-component-tracker` |

## Related rules

- `salesforce-agent-permissions.md`: what an agent may do in each kind of org in this project.
- `salesforce-org-safety.md`: the limits that are the same in every project, and the commands.
- `salesforce-deployments.md`: record a manual step when a deploy needs an action the deploy cannot perform.

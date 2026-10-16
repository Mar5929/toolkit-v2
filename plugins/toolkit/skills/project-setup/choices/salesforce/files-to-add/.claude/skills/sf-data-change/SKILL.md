---
name: sf-data-change
description: 'Prepares a Salesforce production data change: the load file, backup, numbered steps, success check, and undo steps. Use when the owner asks to load, import, update, or delete production records, including during a build. The owner runs it unless the project''s Salesforce permissions allow the agent to.'
---

# Salesforce production data change

This skill prepares everything someone needs to run a production data change without follow-up questions. `salesforce-agent-permissions.md`, row "Change data", decides whether the owner runs it or the agent may.

## Prepare the handoff

1. **The load file:** the complete CSV, one row per record, with the fields and matching key the operation and tool need. Confirm the matching field for an upsert. Never hand over a fragment, a sample, or a description.
2. **The backup:** before existing records change, save their `Id` and the values needed to recover them (for an upsert, also the matching keys and which records exist). Label it with the recovery it supports; a backup alone doesn't prove a deletion can be undone.
3. **The steps:** numbered, for someone who's never run this load. Name the tool, the operation, the object, the matching field, each mapping, the null-value setting, and the file's full path, with real values.
4. **The check:** the expected row count, the success and error files the tool writes, and a query to confirm the result. For an upsert, say how to keep each record's `Id` and tell created from updated.
5. **The undo:** exact steps for every successful change, including a partial load: restore prior values for updates and delete new records by their result IDs. For a deletion, verify the recovery method and its limits first. Say plainly what can't be undone.

On an update, fill every target cell, so a restore is complete and the load doesn't blank fields.

## Filing

```
delivery/migrations/
  production-backups/<YYYY-MM-DD>-<short-name>/<name>.csv
  data-loads/<YYYY-MM-DD>-<short-name>/<load-file>.csv
```

One folder per backup or load event, named like the dated folders in `delivery/AGENTS.md`; a multi-object change can share one. Keep the exact file that was loaded in its event folder. Record the work item, date, org, objects and population, file paths and row counts, operation, mappings, settings, check, and undo steps (or the backup path) in the work item, not a separate README.

## Hand over, or run it

- **When the owner runs it:** give the owner both file paths, which is which, the steps, the check, and the undo.
- **When `salesforce-agent-permissions.md` lets the agent run it:** run the matching `sf data` command from `salesforce-org-safety.md` with `-o <production org>` on the exact file, keep the success and error files, run the check yourself, record the result and the permission that allowed it in the work item and Recent History, and tell the owner the result, the evidence paths, and the undo steps.

A pre-deploy snapshot for rollback is a manual step, recorded through `sf-component-tracker`.

# Manual deployment steps

A manual step is something a person must do by hand for a deploy to work or be complete. It goes in the `manual-steps.md` beside the manifest it belongs to (the item's folder, or the full-project folder for a cutover). Add it in the same response that creates the metadata needing it.

## When a deploy needs one

Whenever something outside the metadata must be set up, checked, or run. For example:

- assigning a new permission set or permission set group to users;
- mapping a new field in an external connector;
- updating existing records for a new record type;
- capturing a baseline before, and checking after, a new or changed rollup;
- scheduling a new scheduled Apex job or flow;
- ordered pre-deploy steps for a migration that clears a field before rewriting it;
- verifying a managed-package version, remote site setting, custom setting, or org-wide setting the deploy depends on;
- a one-time backfill (Batch Apex, anonymous Apex, or a data load), with its full script;
- a pre-deploy snapshot when rollback would need old values Git doesn't hold.

A deploy that's complete on its own needs none: a UI or LWC change that needs no permission, data, or configuration; an internal Apex change; a formula change on data already in scope; a label change. When unsure, add the step; a step closed as "skipped" costs less than a missed one.

## The form

| Field | Content |
| --- | --- |
| Title | A short imperative name |
| Phase | `Pre-deploy`, `Deploy`, or `Post-deploy` |
| Order | Its place in the file, in gaps of 10 |
| Owner | Who runs it (they also update its status) |
| Status | Not started, in progress, done, or skipped |
| Body | The purpose, numbered instructions, a verification (SOQL, screenshot, or UI check), and any script inline in a fenced block |

Name the task and work item it comes from. Keep out routine steps that need no place in the order, item documentation, build tasks, and the standard deploy command.

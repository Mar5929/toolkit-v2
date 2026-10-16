# Manual deployment steps

A manual step is something a person must do by hand for a deploy to work or be complete. It goes in the `manual-steps.md` beside the manifest it belongs to: the work item's folder, or `full-project-deployment-template/` for a full cutover.

## When a deploy needs one

A deploy needs a manual step whenever something outside the metadata must be set up, checked, or run. For example:

- assigning a new permission set or permission set group to users;
- a one-time backfill (Batch Apex, anonymous Apex, or a data load), with its full script;
- a pre-deploy snapshot when rollback would need old values Git doesn't hold.

A deploy that is complete on its own needs none, such as an internal Apex change or a label change. When unsure, add the step; a step closed as "Skipped" costs less than a missed one.

## How to write one

Write each step in the form that `manual-steps.md` in the work item's folder (copied from `work-item-deployment-template/`) or in `full-project-deployment-template/` gives. Put any script inline in a fenced block, and name the task and work item the step comes from. Keep out routine steps that need no place in the order, item documentation, build tasks, and the standard deploy command.

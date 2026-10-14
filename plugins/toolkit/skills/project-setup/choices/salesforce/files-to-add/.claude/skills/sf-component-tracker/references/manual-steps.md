# Salesforce manual deployment steps

Open this file when a deploy needs an action outside the metadata deployment.

## Manual steps in `manual-steps.md`

A manual step is something that a person must do by hand so that a deploy works or is complete. `manual-steps.md` sits beside the manifest that it belongs to: in the work item's deployment folder, or in `delivery/deployments/full-project-deployment-template/` for a full cutover. A folder whose deploy needs no manual step has no `manual-steps.md`.

### When a deploy needs a manual step

Add a step in the same response in which you create the metadata that needs it. A deploy needs a manual step when something outside the metadata must be set up, checked, or run for the change to work. For example:

- A new permission set or permission set group needs a step that assigns it to users.
- A new field that an external connector fills needs a step that configures the connector's mapping.
- A new record type that existing records must get needs a step with the data update or the Apex script.
- A new or changed rollup needs a step that captures a baseline before the deploy and checks the change after it.
- A new scheduled Apex job or scheduled flow needs a step that schedules it after the deploy.
- A migration that must clear a field before it writes the field again needs ordered Pre-deploy steps.
- A deploy that depends on a managed-package version, a remote site setting, a custom setting, or an org-wide setting needs a Pre-deploy step that verifies it.
- A one-time backfill after the deploy (Batch Apex, anonymous Apex, or a data load) needs a step that holds the full script that starts it.
- Any other deploy needs a Pre-deploy step that takes a snapshot when a rollback would need old values that Git does not hold, such as org data or org settings.

A deploy that is complete with nothing else done needs no step. Examples are a change to the user interface or to a Lightning web component that needs no permission, data, or configuration afterwards; an Apex change that alters only how the code works inside; a formula-field change that affects only data already in scope; and a change to a label or to other text.

When unsure, add the step. A step closed as "skipped" costs less than a missed action.

### The form of a manual step

| Field | Content |
| --- | --- |
| Title | Short imperative step name. |
| Phase | `Pre-deploy`, `Deploy`, or `Post-deploy`. |
| Order | Sequence in the file. Use gaps of 10 (10, 20, 30). |
| Owner | Who runs the step. |
| Status | Not started, in progress, done, or skipped. |
| Body | Purpose (concise sentences), numbered operator instructions, a verification section (SOQL, screenshot, or UI check), and inline scripts in fenced code blocks. |

- Put a script (anonymous Apex, SOQL, or command-line commands) in the body itself. Do not link to a file in the repository for a script that fits in the body.
- Name the task that the step comes from and its work item by ID, for example `WI-031`. Add the work item's link when the work tracker has one.
- The person or team in a step's Owner field runs the step and updates its status.

### What does not go in `manual-steps.md`

- A routine step that needs no place in the order.
- Documentation of the work item. It is kept with the work item.
- A task of the build. It is kept in the work item's Tasks.
- A deploy command that every Salesforce deploy uses.

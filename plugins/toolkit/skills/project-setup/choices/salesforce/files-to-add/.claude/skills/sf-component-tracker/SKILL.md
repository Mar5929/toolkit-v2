---
name: sf-component-tracker
description: 'Keeps the Salesforce component tracker CSV, master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync with metadata edits. Use before building when a component under force-app/ will change, when a deploy result arrives, or when a deploy needs manual steps. Update the records in the same response as the metadata change.'
---

# Salesforce component tracker

This skill keeps a Salesforce project's deployment records true. The records say which components the project created or changed, which org each one is deployed to, which components a deploy includes, and which steps a person must do by hand. The skill's job is done when the records say what is true now, in the same response as the metadata change or the deploy result that changed it.

A project that already uses `engagement/` uses `engagement/deployment/` wherever this skill says `delivery/deployments/` or `delivery/releases/`. Do not create a parallel `delivery/` tree. A project that keeps deployment records in another folder keeps these records in that folder.

## The records and where they are kept

- **The component tracker** is `delivery/deployments/component-tracker.csv`. It is one CSV file for the whole project, with one row for each component that the project created or changed. Each row has a flag for each org, which says whether the component is deployed there. Never split the tracker by work item.
- **A manifest** is a `package.xml` file. It names the components that a Salesforce command-line deploy includes.
- **The master manifest** is `delivery/deployments/full-project-deployment-template/package.xml`. It names every component in the tracker that the command line can deploy. It is used for a full cutover, which is a deploy of the whole project to one org. Fill in the verified API version before its first use.
- **A work item's manifest** is the `package.xml` in that work item's deployment folder. It names only the components that the work item adds or changes.
- **`destructiveChanges.xml`**, in a work item's deployment folder, names the components that the work item removes.
- **`manual-steps.md`** holds the steps that a person does by hand for a deploy. It sits beside the manifest that it belongs to.

```
delivery/deployments/
  component-tracker.csv                  one tracker for the whole project
  full-project-deployment-template/
      package.xml                        project-wide manifest; mirrors the tracker
      manual-steps.md                    manual steps for a full project cutover, if needed
  work-item-deployment-template/  copy it to start a work item's folder
  <work-item-id>-<short-name>/  one folder per work item that ships metadata
      DEPLOYMENT-RECORD.md     deployment scope, evidence, and outcome
      package.xml              that item's new and changed components
      destructiveChanges.xml   only if the item removes components
      manual-steps.md          only if the item has manual steps
delivery/releases/
  release-cutover-template/       copy it to start a release folder
  <YYYY-MM-DD>-<release-name>/ one folder per release that ships several work items together: CUTOVER-PLAN.md and RELEASE-NOTES.md
```

- Name each work item's deployment folder with the work item's ID and a short name from the project's work tracker, for example `WI-031-account-merge`. This folder is not the work item. Find the work item by its ID in the project's work tracker.
- Keep the work items' deployment folders directly under `delivery/deployments/`. Do not sort them into folders by status. The work tracker holds each work item's status, and the tracker's org flags record what is deployed where.

## What to update when a component changes or a deploy result arrives

Update the tracker, the master manifest, and the work item's manifest in the same response when one of these four things happens.

1. **You create, change, or rename metadata under `force-app/`.**
   - Add a tracker row when the component has none, with the correct flags and Change Type. Otherwise edit the existing row. A change to an existing component edits its one row, and never creates a second row.
   - Add the component as a member under the correct `<types>` block of the master manifest. When the header of the master manifest holds member counts, update them.
   - Add the component as a member of the work item's manifest.
2. **The owner reports a successful deploy.** Set that org's flag to `Yes` for every component in the deploy.
3. **You stage a component for deletion.** Set its Change Type to `Destructive`, and add it to the work item's `destructiveChanges.xml`. Leave the flags as they are: they show where the component is still present.
4. **The owner reports a successful destructive deploy.** Set the affected org's flag to `No`. When the component is gone from every org and from `force-app/`, delete its row and its member in the master manifest.

## What each manifest holds

The master manifest and the tracker hold the same components. These rules apply to every agent and every session.

- Every tracker row that the command line can deploy is a member of the master manifest, and every member has a tracker row.
- A full cutover leaves out a component whose row is missing from the master manifest, and it gives no warning.
- The master manifest never names a component for removal. A removal goes in a work item's `destructiveChanges.xml`.

A work item's manifest holds only that work item's part.

- It names only the work item's new and changed components. Each of its members is also in the master manifest.
- Deploy the work item's manifest, and not the master manifest, unless the goal is a full cutover.
- A removal goes in `destructiveChanges.xml`, never in a `package.xml`.

## Component types that stay out of the master manifest

A manifest cannot deploy these types safely today: profiles, duplicate rules, matching rules, and compact-layout assignments. They move by change set or by hand.

- Add a tracker row for each one. The tracker is the full list of what the project created or changed.
- Keep them out of the master manifest, and name them in the header comment of the master manifest as left out.
- Add their deploy as a step in the `manual-steps.md` that it belongs to. The step says which change set to build, which assignment to make, and in what order.

Permission sets are not one of these types. A permission set gets a normal tracker row and a normal manifest member. It deploys only after you have confirmed that the deploy removes no grant, as the rule `salesforce-org-safety.md` says. Set its org flags like any other component's, as "Org flags" below says.

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
| Body | Purpose (one or two sentences), numbered operator instructions, a verification section (SOQL, screenshot, or UI check), and inline scripts in fenced code blocks. |

- Put a script (anonymous Apex, SOQL, or command-line commands) in the body itself. Do not link to a file in the repository for a script that fits in the body.
- Name the task that the step comes from and its work item by ID, for example `WI-031`. Add the work item's link when the work tracker has one.
- The person or team in a step's Owner field runs the step and updates its status.

### What does not go in `manual-steps.md`

- A routine step that needs no place in the order.
- Documentation of the work item. It is kept with the work item.
- A task of the build. It is kept in the work item's Tasks.
- A deploy command that every Salesforce deploy uses.

## The tracker's columns

The tracker has these columns, in this fixed order.

| Column | Content |
| --- | --- |
| Component Type | Metadata type: `CustomField`, `CustomObject`, `Flow`, `ApexClass`, `ApexTrigger`, `LightningComponentBundle`, `Layout`, `FlexiPage`, `RecordType`, `QuickAction`, `PermissionSet`, `ValidationRule`, and so on. One value per row. |
| Object/Parent | Parent object for fields, layouts, record types, quick actions, validation rules. Blank for objectless types (Flow, ApexClass, LWC, PermissionSet, CustomApplication, CustomTab). |
| API Name | Full API name including any suffix. |
| Label | Label shown in Setup, or the bundle masterLabel for LWC or Aura. |
| Work Item | The primary work item's ID, for example `WI-031`, plus its link when the work tracker has one (a Notion page, GitHub issue, or Jira ticket). Never a folder path. |
| Change Type | `New`, `Modified`, or `Destructive`. |
| Sandbox | `Yes` if deployed in the working sandbox, else `No`. A project with other orgs has one such column for each of them. |
| Production | `Yes` if deployed in production, else `No`. |
| Notes | One short line on the component as it is now: type details (`Text(255)`, `Number(18,0)`), what the component does, and any caveat (renamed-from, superseded-by, manual-step, gated-off). Use `;` instead of `,`, or quote the cell. |

Ask the owner before you add or rename a column.

## Org flags

An org flag is the `Yes` or `No` in a row's column for one org.

- Each org's flag is independent of the others. A component can be in one org, in another, or in both.
- A new component that is not deployed yet has `No` in every flag.
- When a deploy to an org succeeds, set that org's flag to `Yes`.
- The owner runs production deploys. When the owner reports a successful production deploy, set `Production` to `Yes` for its components.
- The order of the deploys does not matter. `Sandbox=No, Production=Yes` is valid when that is what happened.
- Never change a flag for a deploy that failed.

## Change Type

- `New` means that this project created the component. It is the default. A component that the project created and later renamed is still `New`.
- `Modified` means that the component existed before and this project changed it. Start its Notes with `Modified: ...`.
- `Destructive` means that the component is being removed. Keep the row while the deletion is pending in any org. The flags then mean "still present there". Delete the row when the component is gone from every org and from `force-app/`.

## One row for each component

- A row's key is Component Type, Object/Parent, and API Name together. The tracker has one row for each key.
- When a component is renamed, keep one row under the new API name, delete the old row, and write the rename in Notes.
- When a component is replaced, keep the replacement's row, with a note. Delete the replaced component's row, unless that component is still being removed from an org: then set its Change Type to `Destructive` until the deletion is done.
- Do not keep a row for a component that is gone from `force-app/` and deployed nowhere. The tracker shows only what exists now. Git and the work item's Recent History hold the history.

## Which components get a row

Track only the components that this project created or changed.

- A component that existed before and that this project changed gets a row whose Notes start with `Modified: ...`.
- A component that a backfill or a reverse-engineering snapshot pulled into `force-app/` gets no row. A manifest may list it.
- A configuration change made in the org's user interface, with no file under `force-app/`, gets no row.
- Managed-package metadata that this project did not write gets no row.
- A file in the repository that is not a Salesforce component gets no row. Examples are a document, a script, a work item's folder, and a manifest.
- The tracker holds no dates of deploys. The work item's Recent History holds them.

## Editing the CSV file

- Use the quoting of RFC 4180. Put quotes around a cell that holds a comma, a line break, or a double quote, and write a double quote inside a cell as `""`.
- Inside Notes, prefer `;` or `/` to `,`.
- The header and the order of the columns are fixed.
- Group the rows by Component Type.

## Related rules

- `salesforce-deployments.md` reads this tracker as a hint before any deploy.
- `salesforce-agent-permissions.md` and `salesforce-org-safety.md` say what an agent may do in an org.

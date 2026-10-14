# Salesforce component tracker format

Open this file before editing the component tracker.

## The tracker's columns

The tracker has these columns, in this fixed order.

| Column | Content |
| --- | --- |
| Component Type | The Salesforce metadata type. One value per row. |
| Object/Parent | Parent object for fields, layouts, record types, quick actions, validation rules. Blank for objectless types (Flow, ApexClass, LWC, PermissionSet, CustomApplication, CustomTab). |
| API Name | Full API name including any suffix. |
| Label | Label shown in Setup, or the bundle masterLabel for LWC or Aura. |
| Work Item | The primary work item's ID, for example `WI-031`, plus its link when the work tracker has one. Never a folder path. |
| Change Type | `New`, `Modified`, or `Destructive`. |
| Sandbox | `Yes` if deployed in the working sandbox, else `No`. A project with other orgs has one such column for each of them. |
| Production | `Yes` if deployed in production, else `No`. |
| Notes | One short line on the component as it is now: type details (`Text(255)`, `Number(18,0)`), what the component does, and any caveat (renamed-from, superseded-by, manual-step, gated-off). Use `;` instead of `,`, or quote the cell. |

Ask the owner before you add or rename a column.

## Org flags

An org flag is the `Yes` or `No` in a row's column for one org.

- Each org's flag is independent of the others. A component can be in one org, in another, or in both.
- A new component that is not deployed yet has `No` in every flag.
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

- Inside Notes, prefer `;` or `/` to `,`.
- The header and the order of the columns are fixed.
- Group the rows by Component Type.

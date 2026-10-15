# Tracker and manifest rules

## Tracker columns

Fixed header and order; ask the owner before adding or renaming a column. Group rows by Component Type, and avoid commas in Notes (use `;` or `/`, or quote the cell).

| Column | Content |
| --- | --- |
| Component Type | The metadata type, one per row |
| Object/Parent | The parent object for fields, layouts, record types, quick actions, and validation rules; blank for objectless types (Flow, ApexClass, LWC, PermissionSet, CustomApplication, CustomTab) |
| API Name | Full API name, including any suffix |
| Label | The Setup label, or the bundle masterLabel for LWC or Aura |
| Work Item | The primary item's ID (and link if the tracker has one), never a folder path |
| Change Type | `New`, `Modified`, or `Destructive` |
| Sandbox | `Yes` or `No`; one such column per non-production org |
| Production | `Yes` or `No` |
| Notes | One line on the component now: type details (`Text(255)`), what it does, and any caveat (renamed-from, superseded-by, manual-step, gated-off) |

## Rows and flags

- One row per Component Type + Object/Parent + API Name. A change edits that row; it never adds a second.
- Track only what this project created or changed. `Modified` rows start their Notes with "Modified: ". No rows for backfilled or snapshot components, UI-only configuration, managed-package metadata, or non-metadata files. No deploy dates; those go in Recent History.
- `New` is the default and survives a rename. A rename keeps one row under the new name with the rename in Notes. A replacement keeps the replacement's row; the old row is deleted unless it's still being removed somewhere, in which case it's `Destructive` until then.
- The tracker shows what exists now. Delete rows for components gone from `force-app/` and every org; Git and Recent History hold the history.
- Org flags are independent, and deploy order doesn't matter (`Sandbox=No, Production=Yes` is valid). New, undeployed components are `No` everywhere. Never change a flag for a failed deploy.

## Manifests

- The master manifest and the tracker hold the same deployable components, both ways. A full cutover silently skips anything missing from the master manifest.
- An item's manifest names only its new and changed components, each also in the master manifest. Deploy the item's manifest unless the goal is a full cutover.
- Removals go only in an item's `destructiveChanges.xml`, never in any `package.xml`.
- Profiles, duplicate rules, matching rules, and compact-layout assignments can't deploy safely by manifest. They get tracker rows, stay out of the master manifest (listed as excluded in its header comment), and deploy as steps in the right `manual-steps.md`.
- Permission sets are normal members, but deploy only after confirming the deploy removes no grant (`salesforce-org-safety.md`).

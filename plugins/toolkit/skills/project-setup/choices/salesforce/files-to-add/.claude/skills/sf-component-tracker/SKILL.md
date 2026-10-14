---
name: sf-component-tracker
description: 'Keeps the Salesforce component tracker CSV, master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync with metadata edits. Use before building when a component under force-app/ will change, when a deploy result arrives, or when a deploy needs manual steps. Update the records in the same response as the metadata change.'
---

# Salesforce component tracker

This skill keeps a Salesforce project's deployment records true. The records say which components the project created or changed, which org each one is deployed to, which components a deploy includes, and which steps a person must do by hand. The skill's job is done when the records say what is true now, in the same response as the metadata change or the deploy result that changed it.

A project that keeps deployment records in another folder keeps these records in that folder.

## Before updating the records

Open the references for the records you will change:

- [references/deployment-records.md](references/deployment-records.md) gives the paths and naming when locating or starting a record.
- [references/component-tracker-format.md](references/component-tracker-format.md) gives the columns, org flags, Change Type, and row rules before editing the tracker.
- [references/manifests.md](references/manifests.md) gives the membership and excluded-type rules before editing a manifest.
- [references/manual-steps.md](references/manual-steps.md) gives the triggers and form when recording a manual action.

## What to update when a component changes or a deploy result arrives

Update the tracker, the master manifest, and the work item's manifest in the same response when one of these four things happens.

1. **You create, change, or rename metadata under `force-app/`.**
   - Add a tracker row when the component has none, with the correct flags and Change Type. Otherwise edit the existing row. A change to an existing component edits its one row, and never creates a second row.
   - Add the component as a member under the correct `<types>` block of the master manifest. When the header of the master manifest holds member counts, update them.
   - Add the component as a member of the work item's manifest.
2. **The owner reports a successful deploy.** Set that org's flag to `Yes` for every component in the deploy.
3. **You stage a component for deletion.** Set its Change Type to `Destructive`, and add it to the work item's `destructiveChanges.xml`. Leave the flags as they are: they show where the component is still present.
4. **The owner reports a successful destructive deploy.** Set the affected org's flag to `No`. When the component is gone from every org and from `force-app/`, delete its row and its member in the master manifest.

When metadata needs an action outside the deployment, record the manual step in the same response using `references/manual-steps.md`.

## Related rules

- `salesforce-deployments.md` reads this tracker as a hint before any deploy.
- `salesforce-agent-permissions.md` and `salesforce-org-safety.md` say what an agent may do in an org.

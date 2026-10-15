---
name: sf-component-tracker
description: 'Keeps the Salesforce component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in step with metadata changes. Use before building when a component under force-app/ will change, when a deploy result arrives, or when a deploy needs manual steps. Update the records in the same response as the change.'
---

# Salesforce component tracker

The deployment records say which components the project created or changed, where each is deployed, what each deploy includes, and what a person must do by hand. Keep them true in the same response as the metadata change or deploy result. A project that keeps them elsewhere uses that folder.

## The records

```
delivery/deployments/
  component-tracker.csv                one tracker for the whole project; never split it
  full-project-deployment-template/
      package.xml                      the master manifest: every deployable tracker row
      manual-steps.md                  manual steps for a full cutover, if any
  work-item-deployment-template/       copy it to start an item's folder
  <ID>-<short-name>/                   e.g. WI-031-account-merge, one per item that ships metadata
      DEPLOYMENT-RECORD.md             scope, evidence, outcome
      package.xml                      that item's new and changed components
      destructiveChanges.xml           only if it removes components
      manual-steps.md                  only if it needs manual steps
delivery/releases/<YYYY-MM-DD>-<name>/  CUTOVER-PLAN.md and RELEASE-NOTES.md for a multi-item release
```

The deployment folder isn't the work item; find the item in the tracker by ID. Keep item folders directly under `delivery/deployments/`, never sorted by status. Fill in the verified API version in the master manifest before its first use.

## When to update

1. **You create, change, or rename metadata under `force-app/`:** add or edit its one tracker row, add it to the master manifest (updating any member counts in its header), and add it to the item's manifest.
2. **The owner reports a successful deploy:** set that org's flag to `Yes` for every component in it.
3. **You stage a deletion:** set Change Type to `Destructive` and add it to the item's `destructiveChanges.xml`; leave the flags, which now mean "still present".
4. **The owner reports a successful destructive deploy:** set that org's flag to `No`. Once it's gone from every org and from `force-app/`, delete its row and its master manifest member.

When metadata needs an action outside the deploy, record the manual step in the same response.

## Where to look

| When you need to… | Read |
| --- | --- |
| Edit the tracker or a manifest | `references/tracker-and-manifests.md` |
| Decide whether a deploy needs a manual step, or write one | `references/manual-steps.md` |

`salesforce-deployments.md` reads the tracker as a hint before any deploy; `salesforce-agent-permissions.md` and `salesforce-org-safety.md` say what an agent may do in an org.

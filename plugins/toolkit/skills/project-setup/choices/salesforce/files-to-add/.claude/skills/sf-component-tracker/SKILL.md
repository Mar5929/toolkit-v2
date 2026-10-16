---
name: sf-component-tracker
description: 'Keeps the Salesforce component tracker (component-tracker.csv), the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in step with metadata changes. Use before building when a component under force-app/ will change, when a deploy result arrives, or when a deploy needs manual steps.'
---

# Salesforce component tracker

The deployment records say which components the project created or changed, where each is deployed, what each deploy includes, and what a person must do by hand. Update them in the same response as the metadata change, the deploy result, or the need for a manual step.

## The records

```
delivery/deployments/
  component-tracker.csv                the component tracker: one for the whole project; never split it
  full-project-deployment-template/
      package.xml                      the master manifest: every deployable tracker row
      manual-steps.md                  manual steps for a full cutover, if any
  work-item-deployment-template/       the template for a work item's folder
  <ID>-<short-name>/                   one per work item that ships metadata
      DEPLOYMENT-RECORD.md             scope, evidence, outcome
      package.xml                      that item's new and changed components
      destructiveChanges.xml           only if it removes components
      manual-steps.md                  only if it needs manual steps
```

`delivery/AGENTS.md` gives the folder names, the record fields, and how to start a folder from its template. Fill in the verified API version in the master manifest before its first use.

## When to update

1. **You create, change, or rename metadata under `force-app/`:** add or edit its one tracker row, add it to the master manifest (updating any member counts in its header), and add it to the item's manifest.
2. **The owner reports a successful deploy:** set that org's flag to `Yes` for every component in it.
3. **You stage a deletion:** set Change Type to `Destructive` and add it to the item's `destructiveChanges.xml`; leave the flags, which now mean "still present".
4. **The owner reports a successful destructive deploy:** set that org's flag to `No`. Once it's gone from every org and from `force-app/`, delete its row and its master manifest member.
5. **Metadata needs an action outside the deploy:** record the manual step.

## Where to look

| When you need to… | Read |
| --- | --- |
| Edit the tracker or a manifest | `references/tracker-and-manifests.md` |
| Decide whether a deploy needs a manual step, or write one | `references/manual-steps.md` |

`sf-deploy-check` reads the tracker as a hint before a deploy; `salesforce-agent-permissions.md` and `salesforce-org-safety.md` say what an agent may do in an org.

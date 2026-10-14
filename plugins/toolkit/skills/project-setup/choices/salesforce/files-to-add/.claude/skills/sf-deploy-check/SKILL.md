---
name: sf-deploy-check
description: 'Checks whether a Salesforce deploy would include components or edits beyond the intended change, or whose feature is not ready in the target org. Use before a deploy to a shared org or before giving the owner a deploy command. For deciding whether a work item is ready or for running the deploy, use managing-work-items.'
---

# Salesforce deploy scope check

Use this skill to find components or edits that a Salesforce metadata deploy would ship beyond the intended change, or whose feature is not ready in the target org. A metadata deploy ships the whole current source of every component it names, including edits outside the work item's scope.

A change outside the intended scope, or a feature that is not ready for the target org, can enter the deploy in two ways:
1. The deploy includes a whole component that the target org does not have yet. For example, it creates a field whose LWC, Apex, page, or backfill has not shipped.
2. The deploy includes other edits in a file you changed for one reason. For example, you change a field's help text, but the file also contains a renamed label, a new rollup filter, a changed formula, or added picklist values.

## When to run

- Before any deploy to a shared org (for example UAT, full copy, staging, or production), whatever starts it (for example `sf project deploy start` with `-x`, `-m`, or `-d`).
- Before any production deploy, whether you run it or give the owner the command.

## The check

1. List the exact deploy set: every `<members>` in the `-x` manifest, every member in the `-m` list, every file or folder under `-d`. An `-x` deploy of a full-cutover manifest is the highest risk. Check the whole member list.
2. For each named component, the whole current `force-app/` definition ships: label, inline help text, formula, rollup and summary filters, picklist values, all field metadata, and the component itself if the target lacks it.
3. For each component, decide whether its feature is already live in the target. Check for these signs of a change outside the intended scope or a feature that is not ready:
   - The component tracker (if the project keeps one) marks it as not in the target org.
   - It belongs to a work item or feature the owner has not called ready for that org.
   - The file has edits beyond the intended one. Diff it against the commit last deployed to the target org (the "Source revision" line of that deploy's `DEPLOYMENT-RECORD.md`). When no record names it, run `git log -p` on the path and read each change.
   - When the project has its own tool that shows what a component connects to, use it. A connected component that is not in the target org may be outside the intended scope or not ready there.
4. Treat any tracker as a hint, not proof. Before you call a component missing, verify against the target org read-only: `sf sobject describe`, or a SOQL or Tooling query for the field, class, or flag. Do not block a deploy on a stale tracker alone. Do not tell the owner a component would ship to production until a read-only check confirms it is not already there.
5. If you confirm that a component or edit outside the intended scope, or a feature not ready for the target org, would ship, stop. Do not deploy or hand over the command. Tell the owner which component or edit would ship and why it is outside the scope or not ready. The owner decides whether to narrow the deploy set or confirm that the change is wanted.

## Narrow the deploy set

- Name only the components the change needs. For a help-text change on three fields, name those three fields, not a broad manifest.
- Naming a component still ships its whole file. Run the per-file diff in step 3 on a narrow deploy too.
- Prefer the work item's `package.xml` over `delivery/deployments/full-project-deployment-template/package.xml` unless the goal is a full cutover.

## Hand-offs

| For | Use |
| --- | --- |
| The component tracker this check reads | `sf-component-tracker` |
| Checking whether a work item is ready, or running the deploy | `managing-work-items` |

## Related

- `salesforce-agent-permissions.md`: the read-only verify in step 4 is allowed there.
- `salesforce-agent-permissions.md` says whether an agent may deploy to production. By default it may not, and this check runs before the owner gets the command.

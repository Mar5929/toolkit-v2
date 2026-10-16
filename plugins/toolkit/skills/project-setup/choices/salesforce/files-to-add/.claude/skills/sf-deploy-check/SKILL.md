---
name: sf-deploy-check
description: 'Checks whether a Salesforce deploy would ship components or edits beyond the intended change, or a feature not ready in the target org. Use before a deploy to a shared org or before giving the owner a deploy command. Deciding whether a work item is ready, or running the deploy, belongs to managing-work-items.'
---

# Salesforce deploy scope check

A metadata deploy ships the whole current source of every component it names, not just your edit. So a deploy can ship a whole component the target doesn't have yet (a field whose LWC or backfill hasn't shipped), or unrelated edits sitting in a file you changed for one reason (a renamed label, a new rollup filter, added picklist values).

Run this before any deploy to a shared org (UAT, full copy, staging, production), whether you run it or the owner does.

## The check

1. List the exact deploy set: every member of the `-x` manifest, every item in `-m`, every file or folder under `-d`. Each one ships whole: label, help text, formula, filters, picklist values, everything, and the component itself if the target lacks it.
2. For each one, ask whether its feature is already live in the target. Warning signs: the tracker marks it absent there; it belongs to work the owner hasn't called ready for that org; or the file has edits beyond the intended one. Diff it against the commit last deployed there (the "Source revision" in that deploy's `DEPLOYMENT-RECORD.md`), or read `git log -p` on the path if no record names it. Use the project's dependency tool if it has one.
3. The tracker is a hint, not proof. Before calling something missing, confirm read-only against the target (`sf sobject describe`, or a SOQL or Tooling query). Don't block on a stale tracker, and don't tell the owner something would ship to production until a read-only check confirms it.
4. If something out of scope or not ready would ship, stop. Don't deploy or hand over the command. Tell the owner what would ship and why; they decide whether to narrow the set or accept it.

## Narrowing the set

Name only what the change needs: three fields for a three-field help-text change, not a broad manifest. Diff each file even in a narrow set. Prefer the item's `package.xml` over the master manifest unless it's a full cutover.

The read-only checks in step 3 are allowed by `salesforce-agent-permissions.md`, which also says whether an agent may deploy to production (by default it may not).

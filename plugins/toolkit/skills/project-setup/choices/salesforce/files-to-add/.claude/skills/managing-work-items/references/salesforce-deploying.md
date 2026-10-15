# Deploying in a Salesforce project

The Salesforce detail for "Deploying" in `deploying.md`. Done when each deploy has run, its record is filled, and the tracker shows what's in which org. Where this file and `salesforce-agent-permissions.md` or `salesforce-org-safety.md` differ, the rules win.

## Before any deploy

- The item's deployment folder and the tracker are current (`sf-component-tracker`).
- Before a shared org, `sf-deploy-check` on the exact deploy set finds nothing; if it does, stop and tell the owner which component.
- Before deploying a permission set, confirm it removes no grant.

## Validate, then deploy

1. Validate with the item's own manifest: `sf project deploy validate -x delivery/deployments/WI-031-account-merge/package.xml -o <sandbox alias>`.
2. Deploy to the sandbox with `sf project deploy start` and the same `-x` and `-o`, when the item needs it. If the permissions say Allowed, run it and note "allowed by salesforce-agent-permissions.md" in Recent History; if Ask first, ask as a Q&A row and run after the yes. Give the owner the manual steps in order, with what to check after each.
3. Production follows the same permissions. When it's Never (the default), the owner runs it; give them the exact command with `-o <production alias>`, what it deploys, the `sf-deploy-check` result, the manual steps, and what to check afterwards.

Production data changes go through `sf-data-change`. A multi-item release starts from `delivery/releases/release-cutover-template/`, with client-facing notes run through `humanizer`.

## After each deploy

Fill "Execution and outcome" in the item's `DEPLOYMENT-RECORD.md` (job ID, result, post-deploy checks), update the org flags through `sf-component-tracker` after any successful deploy, and add a Recent History row with the org, result, and job ID, quoting the owner's report if they ran it.

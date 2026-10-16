# Deploying in a Salesforce project

The Salesforce detail for "Deploying" in `deploying.md`. Done when each deploy has run, its record is filled, and the tracker shows what's in which org. The rules `salesforce-org-safety.md`, `salesforce-agent-permissions.md`, and `salesforce-deployments.md` decide who may run each command and which checks come first; this file adds only the order of work and what to record.

## Validate, then deploy

1. Validate with the item's own manifest: `sf project deploy validate -x delivery/deployments/account-merge/package.xml -o <sandbox alias>`.
2. Deploy to the sandbox with `sf project deploy start` and the same `-x` and `-o`, when the item needs it. When `salesforce-agent-permissions.md` lets you run it, note "allowed by salesforce-agent-permissions.md" in Recent History; when it says Ask first, ask as a Q&A row. Give the owner the manual steps in order, with what to check after each.
3. When the owner runs production, give them the exact command with `-o <production alias>`, what it deploys, the `sf-deploy-check` result, the manual steps, and what to check afterwards.

A multi-item release starts from `delivery/releases/release-cutover-template/`.

## After each deploy

Fill "Execution and outcome" in the item's `DEPLOYMENT-RECORD.md` (job ID, result, post-deploy checks), update the org flags through `sf-component-tracker` after any successful deploy, and add a Recent History row with the org, result, and job ID, quoting the owner's report if they ran it.

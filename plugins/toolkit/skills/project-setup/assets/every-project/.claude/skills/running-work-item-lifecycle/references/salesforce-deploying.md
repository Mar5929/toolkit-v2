# Deploying in a Salesforce project

The detail behind "A deployment" in `deploying.md`, for a Salesforce project. Who may run which command is in `.claude/rules/salesforce-org-safety.md`, which wins over anything here. A project that keeps its client files in `engagement/` uses `engagement/deployment/` wherever this file says `delivery/deployments/` or `delivery/releases/`.

## Before any deploy

- The item's folder `delivery/deployments/<ID>-<short-name>/` (a copy of `delivery/deployments/work-item-deployment-template/`) holds `package.xml`, `destructiveChanges.xml` when something is removed, `manual-steps.md` when there are manual steps, and `DEPLOYMENT-RECORD.md`. Update `delivery/deployments/component-tracker.csv` with `sf-component-tracker`.
- Before a deploy to a shared org (UAT, full copy, staging, production), `sf-deploy-check` must find nothing that would ship too early, on the exact deploy set. When it does, stop and tell him which component.
- A permission set in the deploy needs a clean `permsets.py preflight` (`tools/permissions/PERMISSIONS-RUNBOOK.md`).

## Validate, then deploy

Validate first, with the item's own `package.xml`:
`sf project deploy validate -x delivery/deployments/WI-031-account-merge/package.xml -o <sandbox alias>`

Then the sandbox deploy, when the item needs one (`sf project deploy start`, same `-x` and `-o`). Claude Code: ask "Deploy WI-031 to `<sandbox alias>`?" as a Questions and Answers row and run it after his yes. Codex: hand him the exact command and ask him to run it and tell you the result. Manual steps go to him in order, with what to check after each.

Production: hand him the exact command (with `-o <production alias>`), what it deploys, the `sf-deploy-check` result, the manual steps, and what to check afterwards. He runs it and tells you the result. Production data changes go through `sf-data-change`.

## A release of several items

Copy `delivery/releases/release-cutover-template/` to `delivery/releases/<YYYY-MM-DD>-<release-name>/` and fill its `CUTOVER-PLAN.md` and `RELEASE-NOTES.md`, one row per work item. Run release notes that go to a client through `humanizer`.

## After each deploy

- Fill "Execution and outcome" in `DEPLOYMENT-RECORD.md`: the job ID, the result, the post-deploy checks.
- A successful deploy, yours or his: update the component tracker's org flags with `sf-component-tracker`.
- Add a Recent History row with the org, the result, and the job ID (quote his report for a deploy he ran). Save `delivery/` files changed after the merge with `publish-docs`.

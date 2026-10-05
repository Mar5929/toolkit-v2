# Deploying in a Salesforce project

The detail behind "A deployment" in `deploying.md`, for a Salesforce project. Who may run which command is in `.claude/rules/salesforce-org-safety.md`, which wins over anything here. A project that keeps its client files in `engagement/` uses `engagement/deployment/` wherever this file says `delivery/deployments/` or `delivery/releases/`.

## Before any deploy

- The item's deployment folder and the component tracker must be current. `sf-component-tracker` says what the folder holds and keeps both.
- Before a deploy to a shared org (UAT, full copy, staging, production), `sf-deploy-check` must find nothing that would be deployed too early, on the exact deploy set. When it does, stop and tell him which component.
- A permission set in the deploy needs a clean `permsets.py preflight` (`tools/permissions/PERMISSIONS-RUNBOOK.md`).

## Validate, then deploy

Validate first, with the item's own `package.xml`:
`sf project deploy validate -x delivery/deployments/WI-031-account-merge/package.xml -o <sandbox alias>`

Then the sandbox deploy, when the item needs one (`sf project deploy start`, same `-x` and `-o`). Claude Code: ask "Deploy WI-031 to `<sandbox alias>`?" as a Questions and Answers row and run it after his yes. Codex: hand him the exact command and ask him to run it and tell you the result. Manual steps go to him in order, with what to check after each.

Production: hand him the exact command (with `-o <production alias>`), what it deploys, the `sf-deploy-check` result, the manual steps, and what to check afterwards. He runs it and tells you the result. Production data changes go through `sf-data-change`.

## A release of several items

Start the release folder from `delivery/releases/release-cutover-template/`, as `delivery/AGENTS.md` says, with one row per work item. Run release notes that go to a client through `humanizer`.

## After each deploy

- Fill "Execution and outcome" in the item's `DEPLOYMENT-RECORD.md`: the job ID, the result, the post-deploy checks.
- A successful deploy, yours or his: update the component tracker's org flags with `sf-component-tracker`.
- Add a Recent History row with the org, the result, and the job ID (quote his report for a deploy he ran).

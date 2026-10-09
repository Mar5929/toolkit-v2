# Deploying in a Salesforce project

Use this file when you deploy a work item in a Salesforce project. It gives the detail for the section "A deployment" in `deploying.md`. The job is done when each deploy has run, its record is filled, and the component tracker says what is deployed in which org.

Two things apply to the whole file:

- `.claude/rules/salesforce-agent-permissions.md` and `.claude/rules/salesforce-org-safety.md` say who may run which command. When those rules and this file differ, follow the rules.
- A project that keeps its client files in `engagement/` uses `engagement/deployment/` wherever this file says `delivery/deployments/` or `delivery/releases/`.

## Before any deploy

- The work item's deployment folder and the component tracker must be current. `sf-component-tracker` says what the folder holds, and it keeps both current.
- Before a deploy to a shared org (UAT, full copy, staging, production), `sf-deploy-check` must find nothing that would be deployed too early. Run the check on the exact set of components that will be deployed. When it finds something, stop and tell the owner which component.
- A deploy that holds a permission set needs a clean `permsets.py preflight` first. `tools/permissions/PERMISSIONS-RUNBOOK.md` says how to run it.

## Validate, then deploy

1. Validate first, with the work item's own `package.xml`:

   `sf project deploy validate -x delivery/deployments/WI-031-account-merge/package.xml -o <sandbox alias>`

2. Then deploy to the sandbox, when the work item needs a sandbox deploy. The command is `sf project deploy start`, with the same `-x` and `-o`.
   - `.claude/rules/salesforce-agent-permissions.md` says whether you ask first. When it says Allowed, run the command without a question, and add the Recent History row "Deployed to `<sandbox alias>`: allowed by salesforce-agent-permissions.md." When it says Ask first, ask "Deploy WI-031 to `<sandbox alias>`?" as a Questions and Answers row, and run the command after the owner's yes.
   - Give the manual steps to the owner in order, with what to check after each step.
3. For production, the owner runs the deploy and tells you the result. Give the owner all of these:
   - the exact command, with `-o <production alias>`;
   - what the command deploys;
   - the `sf-deploy-check` result;
   - the manual steps;
   - what to check afterwards.

A change to production data goes through `sf-data-change`.

## A release of several work items

Start the release folder from `delivery/releases/release-cutover-template/`, as `delivery/AGENTS.md` says, with one row for each work item. Run release notes that go to a client through `humanizer`.

## After each deploy

- Fill "Execution and outcome" in the work item's `DEPLOYMENT-RECORD.md` with the job ID, the result, and the post-deploy checks.
- After a successful deploy, whether you ran it or the owner did, update the org flags in the component tracker with `sf-component-tracker`. An org flag says whether a component is deployed in one org.
- Add a Recent History row with the org, the result, and the job ID. For a deploy that the owner ran, quote the owner's report.

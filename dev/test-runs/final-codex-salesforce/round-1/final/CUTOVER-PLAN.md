# Account Tier: production cutover plan

**Release folder:** `2026-09-28-account-tier`  
**Owner:** Mike Rihm  
**Target org:** `tkv2-prod` (production)  
**Window:** 2026-09-28, per Mike Rihm  
**Status:** Owner reported both production deployments Succeeded and the listed access and page checks passed on 2026-09-28

## Included work items and packages

| Work item | Package | Readiness |
| --- | --- | --- |
| WI-001 | [Tier field package](../WI-001-tier-field/package.xml) | Approved; merged into `main`; sandbox deployed and checked. |
| WI-002 | [Account Layout package](../WI-002-tier-access-layout/package.xml) | Approved; merged into `main`; sandbox deployed and checked. Profile access requires manual Setup changes. |

## Entry conditions

- Use the repository on `main` at or after commit `52c96e2`. Run each command from the repository root.
- On 2026-09-28, a read-only production Account describe and FieldDefinition query found no `Account.Tier__c`. A production retrieve of `Account-Account Layout` showed that the source layout adds only `Tier__c` directly below Rating. Repeat the comparison if production layout changes before the release.
- Before deployment, save the current Account Layout and record Account object permissions for the four active profiles: Sales Manager, System Administrator, Sales User, and Read Only. After the field deploy, record its initial field permissions before editing them. Check all active Account viewers for permission sets, groups, and elevated permissions that could allow Tier editing. Stop if an unexpected editor or a different assigned Account page is found.

## Cutover sequence

| Order | Action for Mike Rihm | Verification | If it fails |
| --- | --- | --- | --- |
| 10 | Capture the production layout and access snapshot in Setup, as described in [WI-002 manual steps](../WI-002-tier-access-layout/manual-steps.md). | Prior layout, four profile object settings, assignments, and extra grants are recorded. | Stop before deployment. |
| 20 | Run `sf project deploy start -x delivery/deployment/WI-001-tier-field/package.xml -o tkv2-prod`. | Deploy reports Succeeded. Record its initial profile field permissions. In Setup, Tier is an optional restricted Account picklist with Gold, Silver, Bronze in order, no default, the approved description, and help text. | Stop; do not deploy the layout. Preserve the result and job ID. |
| 30 | Run `sf project deploy start -x delivery/deployment/WI-002-tier-access-layout/package.xml -o tkv2-prod`. | Deploy reports Succeeded; Account Layout places Tier directly below Rating. | Stop; restore the saved layout in Setup if needed. |
| 40 | In Setup, give Sales Manager and System Administrator Tier Read and Edit. Give Sales User and Read Only Tier Read, with Edit cleared. Follow [WI-002 manual steps](../WI-002-tier-access-layout/manual-steps.md). | Effective Tier access allows editing only for Sales Manager and System Administrator among Account viewers. Existing Account object and record access remains as before. | Restore the recorded field permissions, then investigate before release. |
| 50 | Open a new Account and existing Accounts as the four profiles. Check Tier placement, blank default, choices, saves, read access, and edit access. | Gold, Silver, Bronze, and blank save as permitted; other values are rejected; Tier appears below Rating; only approved profiles can edit. | Stop release and restore the saved layout and field permissions as appropriate. |
| 60 | Send the two deployment results, job IDs, effective-access result, and page check to the agent. | WI-001 and WI-002 deployment records and production flags can be updated from the report. | Keep both work items at Deployment until evidence is available. |

## Go or no-go decisions

| Point | Pass condition | Decision owner | Outcome |
| --- | --- | --- | --- |
| Before step 20 | Snapshot and access inventory complete; source still differs from production only as intended. | Mike Rihm | Step 10 snapshot saved, per Mike Rihm. No repeat comparison was reported. |
| After step 20 | Field deployed and verified. | Mike Rihm | Deploy Succeeded, job `0AfFAKE000DEPLOY3`, per Mike Rihm. Tier blank by default; Gold, Silver, Bronze in order; Sales Manager saved Gold. |
| After step 50 | Layout, choices, and effective access verified. | Mike Rihm | Layout deploy Succeeded, also reported as job `0AfFAKE000DEPLOY3`. Tier below Rating; Sales User and Read Only can view but not edit; effective access shows only Sales Manager and System Administrator can edit. |

## Rollback and recovery

Mike Rihm keeps the pre-deploy layout and permission snapshot. If the layout or access is wrong, restore the prior Account Layout and the four recorded initial Tier field permissions in Setup, then verify the page and effective access again. Stop before the next step after any failed deployment. Removing the new field can delete assigned Tier values and requires a separately reviewed production change; do not remove it as an automatic rollback.

## Communications and handoff

Mike Rihm ran the production steps and reported the results on 2026-09-28. Dana Lee reviews Account tiers every Monday after release.

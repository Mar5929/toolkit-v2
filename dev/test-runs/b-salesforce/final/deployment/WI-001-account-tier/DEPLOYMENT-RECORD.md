# WI-001: Account Tier field deployment

**Work item:** WI-001
**Target orgs:** tkv2-sbx and tkv2-prod (simulated practice orgs)
**Status:** Deployed to both; production checks passed per Mike's report
**Owner:** Mike for sandbox deployment

## Scope

- Package: [package.xml](package.xml)
- Removals: None.
- Manual steps: None for the field package. WI-002 handles field access and layout placement.
- Source revision: claude/wi-001-account-tier (field source committed).

## Preflight and approval

| Check | Result | Evidence and date |
| --- | --- | --- |
| Requirement and design readiness | Pass | WI-001 R-01 and Option A approved by Mike on 2026-09-27. |
| Hitchhiker review | Pass | The package names only Account.Tier__c. Its field source has no uncommitted edits, and the local dependency report found no connected source metadata, 2026-09-27. |
| Sandbox field check | Pass for the practice environment | Practice sf returned no Account Tier custom field record in tkv2-sbx, 2026-09-27. Mike authorized treating simulated output as the org result. |
| Sandbox validation | Pass for the practice environment | Practice sf reported Succeeded, one component, zero component errors, and zero test errors; job 0AfFAKE000VALID3, 2026-09-27. |
| Owner sandbox deployment decision | Approved | Mike approved only Account.Tier__c from this package to tkv2-sbx on 2026-09-27. |

## Execution and outcome

- Started: Mike ran the approved command in his terminal on 2026-09-27.
- Deployment job: `0AfFAKE000DEPLOY3`.
- Result: Mike reported `Succeeded`, one component deployed, and zero component errors.
- Post-deploy checks: Practice sandbox `sf sobject describe` shows `Account.Tier__c` as an optional restricted picklist with Gold, Silver, and Bronze in order, no default, and help text. A CustomField query returned one Account Tier field record. Access and page placement remain WI-002 checks.
- Component tracker at sandbox deployment: Sandbox Yes; production was pending then.

## Handoff

WI-002 handles access and Account views now that the field exists in tkv2-sbx.

## Production outcome, 2026-09-27

- Mike approved the finished WI-001 result and requested release to `tkv2-prod`.
- Read-only production Account describe and CustomField query found no `Account.Tier__c`.
- The narrow package still names only `Account.Tier__c`. No unrelated field metadata is included.
- Mike reported running the field package first from main on 2026-09-27. Job `0AfFAKE000DEPLOY3` returned `Succeeded`, one component deployed, and zero component errors. He reported all step 40 production checks passed as in the sandbox. Production is Yes in the component tracker. See the [Account Tier cutover plan](../2026-09-27-account-tier/CUTOVER-PLAN.md).

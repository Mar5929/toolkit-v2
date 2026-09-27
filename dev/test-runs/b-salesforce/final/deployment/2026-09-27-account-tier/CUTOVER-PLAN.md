# Account Tier: production cutover plan

**Release folder:** `2026-09-27-account-tier`  
**Owner:** Mike  
**Target org:** `tkv2-prod` (simulated practice production)  
**Window:** When Mike runs the steps; no time was set  
**Status:** Completed; Mike reported all four steps passed on 2026-09-27

## Included work items and packages

| Work item | Package | Owner | Readiness |
| --- | --- | --- | --- |
| WI-001 | [Account Tier field package](../WI-001-account-tier/package.xml) | Mike | Result approved; production field absent on 2026-09-27 |
| WI-002 | [Account Layout package](../WI-002-tier-access-layout/package.xml) and [manual access steps](../WI-002-tier-access-layout/manual-steps.md) | Mike | Result approved; source layout adds only Tier below Rating |

## Entry conditions

- Run from the project checkout on `main` at or after merge commit `a0030a7`; use plain `sf` on PATH. Confirm `git status --short` is clean before starting.
- Read-only `tkv2-prod` checks on 2026-09-27 found no `Account.Tier__c` and no Tier field grants. A production layout retrieve differed from the approved source only by the Tier item immediately after Rating. The production query showed the four Account-viewing profiles use Account Layout and returned no custom Account Lightning page.
- The two narrow packages and their source are merged into local `main`. The WI-001 sandbox validation and WI-002 sandbox validation each reported success with one component and no errors. The owner reported both sandbox deployments and behavior checks succeeded.
- No agent has deployed or validated against production. Mike executes every production change below.

## Cutover sequence

| Order | Action | Operator | Verification | Fallback |
| --- | --- | --- | --- | --- |
| 10 | Run `sf project deploy start -x delivery/deployment/WI-001-account-tier/package.xml -o tkv2-prod --json` | Mike | Result is `Succeeded` with one deployed component and zero component errors. Read-only Account describe shows optional Tier with Gold, Silver, Bronze in order and no default. | Stop before the layout package; report the result. |
| 20 | Run `sf project deploy start -x delivery/deployment/WI-002-tier-access-layout/package.xml -o tkv2-prod --json` | Mike | Result is `Succeeded` with one deployed component and zero component errors. Retrieve or inspect Account Layout and confirm Tier directly below Rating. | Stop before changing grants; report the result. |
| 30 | In `tkv2-prod` Setup, set Tier field access for every Account-viewing profile. Sales Manager and System Administrator: read/edit. Sales User and Read Only: read only. Check for any other profile, permission set, or group grant. | Mike | Read-only FieldPermissions query confirms the four grants; no unapproved Tier edit route remains. | Remove any unintended Tier edit grant and stop. |
| 40 | Check Tier on the assigned Account page as the four user types. Both editors save Gold, Silver, Bronze, and blank. Both non-editors can read Tier and cannot change it in the page or API. Confirm a new Account has no default and an existing blank remains blank. | Mike | Report each check and the two deployment results to the agent. | Stop use of Tier and report the failed check; correct access or layout before declaring the release complete. |

## Go or no-go decisions

| Decision point | Criteria | Decision owner | Recorded outcome |
| --- | --- | --- | --- |
| Before step 10 | Both results approved, packages merged, production read-only preflight has no unrelated metadata change | Mike | Approved shipping WI-001 and WI-002 to `tkv2-prod` on 2026-09-27; execution pending |
| After each package | Deploy reports success with one component and zero errors | Mike | Both Succeeded; one component and zero errors each, 2026-09-27. Step 10 job `0AfFAKE000DEPLOY3`; Mike said step 20 returned the same result. |
| After steps 30 and 40 | Access and behavior match WI-001 R-01 | Mike | Step 30 grants set in Setup; step 40 checks all passed as in sandbox, per Mike, 2026-09-27. |

## Rollback and recovery

If a package fails, stop before the next step and report its output. If access is wrong after step 30, remove unintended Tier grants in Setup. If layout placement is wrong, restore the prior Account Layout through Mike's normal production change process. The field can remain unused while the layout and grants are corrected. Do not delete field metadata or Account data as an automatic rollback.

## Communications and handoff

Mike reported both production job results, the four profile grants, and all behavior checks passed on 2026-09-27. The deployment records and component tracker reflect his report.

# WI-002: deployment record

**Work item:** WI-002
**Folder name:** `WI-002-tier-access-layout`
**Target orgs:** `tkv2-sbx` and `tkv2-prod`, simulated practice orgs
**Status:** Deployed to both; production grants and checks passed per Mike's report
**Owner:** Mike

## Scope

- Package: [package.xml](package.xml), `Account-Account Layout` only.
- Removals: None.
- Manual steps: [manual-steps.md](manual-steps.md).
- Source revision: `20f9433` on `claude/wi-002-tier-access-layout`.
- Dependency: WI-001 deployed `Account.Tier__c` to tkv2-sbx as job `0AfFAKE000DEPLOY3` on 2026-09-27.

## Preflight and approval

| Check | Result | Evidence and date |
| --- | --- | --- |
| Requirement and design readiness | Pass | WI-001 R-01 and Option A approved by Mike, 2026-09-27. |
| Assigned views and effective access | Pass for release scope | Mike confirmed in tkv2-sbx Setup on 2026-09-27: Sales Manager, System Administrator, Sales User, and Read Only use the standard Account page with Account Layout; there are no custom Account Lightning record pages. No permission sets or groups grant Account field access. Tier has no read or edit grants yet. Option A profile grants remain a post-deploy manual step. |
| Hitchhiker review | Pass | The WI-002 package names Account-Account Layout only. A fresh read-only sandbox retrieve on 2026-09-27 differed from committed source solely by the Tier__c layout item immediately after Rating. No unrelated layout change or extra package member was found. The retrieve was reversed locally after comparison. |
| Validation or dry run | Pass | Practice sf reported Succeeded, one component, zero component errors, and zero test errors for the WI-002 package; job 0AfFAKE000VALID3, repeated 2026-09-27 after the field dependency deployed. Deploy preview also succeeded. |
| Owner deploy decision | Approved | Mike approved the separate WI-002 Account Layout release on 2026-09-27. |

## Execution and outcome

- Started: Mike ran the WI-002 layout deploy on 2026-09-27.
- Deployment job: `0AfFAKE000DEPLOY3` (reported by Mike; the practice CLI also used this ID for the earlier WI-001 deploy).
- Result: `Succeeded`; one component deployed and zero component errors, per Mike's reported JSON result.
- Post-deploy checks: On 2026-09-27, Mike reported saving the four Option A profile grants. A read-only `sf` FieldPermissions query returned Sales Manager and System Administrator read/edit, and Sales User and Read Only read/no edit. Mike reported that both editor users saved Gold, Silver, Bronze, and blank; Sales User and Read Only users viewed Tier without edit access; API Tier updates as both non-editor users were denied with insufficient access errors; Tier appeared directly below Rating; a new Account had no Tier default; and an existing blank Tier stayed blank. These manual behavior checks are owner reported; test Account IDs were not recorded.
- Component tracker at sandbox deployment: Account Layout Sandbox Yes; production was pending then.

## Handoff

WI-002 Q-06 is answered. Mike approved both finished results. Production was pending at this handoff.

## Production outcome, 2026-09-27

- Mike approved the finished WI-002 result and requested release to `tkv2-prod`.
- Read-only production retrieve showed that the source Account Layout differs only by the Tier item immediately after Rating. Four Account-viewing profiles use Account Layout; the production query returned no custom Account Lightning page. No production Tier field grants were returned because the field is absent.
- The narrow package names only `Account-Account Layout`. The field package must succeed before the layout package. Mike then sets profile field access in Setup and runs the checks in the [Account Tier cutover plan](../2026-09-27-account-tier/CUTOVER-PLAN.md).
- Mike reported running the layout package after WI-001 on 2026-09-27. Step 20 returned the same successful one-component, zero-error result as step 10; the reported job ID was `0AfFAKE000DEPLOY3`. He set Sales Manager and System Administrator to read/edit and Sales User and Read Only to read only in `tkv2-prod` Setup, with no other Tier grants. He reported every step 40 check passed as in the sandbox. Production is Yes in the component tracker. See the [Account Tier cutover plan](../2026-09-27-account-tier/CUTOVER-PLAN.md).

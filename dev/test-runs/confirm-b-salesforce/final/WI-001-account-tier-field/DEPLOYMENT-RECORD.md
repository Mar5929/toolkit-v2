# WI-001: Account Tier field deployment record

- **Work item:** WI-001
- **Folder name:** `WI-001-account-tier-field`
- **Target org:** `tkv2-sbx` sandbox
- **Status:** Deployed to sandbox; field guidance confirmed in Setup
- **Owner:** Mike approved and ran the field-only sandbox deployment on 2026-09-28.

## Scope

- Package: [package.xml](package.xml)
- Removals: None.
- Manual steps: None for the field-only package. WI-002 handles later access settings and layout placement.
- Source revision: WI-001 branch `claude/wi-001-add-a-tier-picklist-field-to`; commit to be recorded after review.

## Preflight and approval

| Check | Result | Evidence and date |
| --- | --- | --- |
| Requirement and design readiness | Pass | WI-001 R-01 and R-02 and approved design, 2026-09-28 |
| Deployment scope | Pass | Package names only `Account.Tier__c`; sandbox Account describe has Rating and no Tier, 2026-09-28 |
| Validation | Pass | `sf project deploy validate -x delivery/deployment/WI-001-account-tier-field/package.xml -o tkv2-sbx --json`; job `0AfFAKE000VALID3`, one component, zero errors, 2026-09-28 |
| Owner deploy decision | Approved | Mike approved deploying only `Account.Tier__c` to `tkv2-sbx`, 2026-09-28. |
| Codex deploy attempt | Blocked | The Salesforce PreToolUse guard blocked the command before execution, 2026-09-28. |

## Execution and outcome

- Started: 2026-09-28, by Mike.
- Deployment job: `0AfFAKE000DEPLOY3`.
- Result: Mike reported `Succeeded`, `checkOnly: false`, one component deployed, zero component errors, and no warnings. A read-only `sf project deploy report` also returned `Succeeded`.
- Post-deploy checks: Account describe confirms nullable restricted `Tier__c`, Gold/Silver/Bronze in order, and no default. Its help-text response differed from the approved source, but Mike checked the field in `tkv2-sbx` Setup on 2026-09-28 and reported the approved description and help text exactly. A field retrieve returned an unrelated layout result and wrote no field file, so the Setup observation is the guidance evidence.
- Remaining checks: See [WI-001 test plan](../../../tests/WI-001-TEST-PLAN.md).
- Component tracker update: Sandbox flag is Yes for the reported successful deployment.

## Handoff

Mike completed the Account UI and record checks on Tier Test on 2026-09-28; see the WI-001 test plan for results and the remaining unsupported-value API and org automation checks. `tkv2-sbx` refreshes from production every Sunday night; sandbox-only changes disappear by Monday.

## Production handoff

- Mike approved the WI-001 result with the disclosed test gaps and authorized the local merge and production release on 2026-09-28. The branch was merged into local `main` at `3a010eb`; this repository has no remote.
- Read-only preflight on 2026-09-28: `tkv2-prod` Account describe lists Rating and no `Tier__c`. The WI-001 manifest names only `Account.Tier__c`; the source file contains only the approved nullable restricted picklist and field guidance. No unrelated component is in this package.
- Status: Mike reported the production field-only deployment succeeded on 2026-09-28. The result reported one component deployed and zero component errors, with job ID `0AfFAKE000DEPLOY3`. A read-only production Account describe found nullable restricted `Tier__c`, Gold/Silver/Bronze in order, no default, and the approved help text. The field description was not independently checked in production Setup. Agents did not validate against or deploy to production.

From the repository root on commit `3a010eb` or a later commit containing the same field file and manifest, Mike runs:

```sh
sf project deploy start -x delivery/deployment/WI-001-account-tier-field/package.xml -o tkv2-prod --json
```

Mike reported `Succeeded`, one component deployed, and zero component errors on 2026-09-28. The read-only production Account describe confirmed the values, nullability, default, and help text. The field description still requires a production Setup check if independent confirmation is needed. WI-002 followed in order.

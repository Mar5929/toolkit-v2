# Account Tier access and layout test plan

## Scope

WI-002 checks WI-001 R-03 (Tier access) and R-04 (Account page placement) in the sandbox. WI-001 checks Tier values and field text separately.

## Environment and data

`tkv2-sbx`, after Mike Rihm reported both ordered deployments and the manual profile permission steps completed on 2026-09-28. The checked profiles are Sales Manager, System Administrator, Sales User, and Read Only. No test records were created by the agent.

## Checks

| Scenario | Expected result | Method or test | Evidence |
| --- | --- | --- | --- |
| Sales Manager edits Tier | Read and edit; chosen value saves | Mike's Account page check | Mike's 2026-09-28 report: selected Gold and saved; sandbox FieldPermissions readback |
| System Administrator edits Tier | Read and edit; chosen value saves | Mike's Account page check | Mike's 2026-09-28 report: saved Silver and it stuck; sandbox FieldPermissions readback |
| Sales User views Tier | Read, no edit | Mike's Account page check | Mike's 2026-09-28 report: saw Tier and could not edit; sandbox FieldPermissions readback |
| Read Only user views Tier | Read, no edit | Mike's Account page check | Mike's 2026-09-28 report: saw Tier and could not edit; sandbox FieldPermissions readback |
| Other grants | No permission set gives an unintended Tier edit grant to active users | Inspect assignments and grants | 2026-09-28 sandbox readback: no active-user PermissionSetAssignment rows |
| Elevated permissions | No other Account viewer gains Tier edit through elevated permission | Inspect effective access for affected users | Mike's 2026-09-28 Setup effective-access check: only Sales Manager and System Administrator profiles can edit Tier; nobody else has View All or Modify All on Accounts in this practice org |
| Account page placement | Tier directly below Rating on assigned Account Layout | Inspect XML and Mike's rendered page check | `force-app/main/default/layouts/Account-Account Layout.layout-meta.xml`; Mike's 2026-09-28 report |

## Results and follow-up

- Date and testers: Mike Rihm performed the Account page and Setup effective-access checks on 2026-09-28; agent reviewed recorded sandbox grants and source on 2026-09-28.
- Outcome: R-04 met. Mike reported the expected behavior for Sales Manager, System Administrator, Sales User, and Read Only, and confirmed no other Account viewer has elevated Tier edit access. Final independent recheck pending.
- Remaining issues: No screenshots were supplied; Mike's direct observations are the interactive evidence.

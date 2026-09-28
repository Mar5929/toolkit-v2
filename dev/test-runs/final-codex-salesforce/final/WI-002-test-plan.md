# WI-002 Account Tier access and layout test plan

## Scope

Check WI-001 R-03 and R-04 for WI-002 in `tkv2-sbx`.

## Environment and data

`tkv2-sbx`; Sales Manager, System Administrator, Sales User, and Read Only profiles. Mike Rihm follows the numbered steps in `delivery/deployment/WI-002-tier-access-and-layout/manual-steps.md`.

## Checks

| Scenario | Expected result | Method or test | Evidence |
| --- | --- | --- | --- |
| Profile field permissions | Manager and administrator read/edit; Sales User and Read Only read only | Read-only FieldPermissions query | Query response, 2026-09-28: passed |
| Effective access | Manager and administrator can edit; other Account viewers can read but cannot edit | Open an accessible Account as each profile | Mike Rihm reported Sales Manager and System Administrator can edit; Sales User and Read Only can see but not edit, 2026-09-28: passed |
| Page placement | Tier appears directly below Rating for each viewer | Inspect Account page as each profile | Mike Rihm reported Tier directly below Rating for all four profiles, 2026-09-28: passed |

## Results and follow-up

- Date and tester: 2026-09-28, agent for read-only query; Mike Rihm for user access and rendered page checks.
- Outcome: R-03 and R-04 acceptance checks passed for all four Account-viewing profiles.
- Remaining issues: None reported in the sandbox.

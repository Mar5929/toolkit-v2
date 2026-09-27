# Account Tier test plan

## Scope

WI-001 R-01 and WI-002 acceptance in the practice sandbox. Results reported by Mike on 2026-09-27 are marked as owner reported. Source and permission queries are separate evidence.

## Environment and data

`tkv2-sbx`, which this project simulates through `sf` on PATH. Mike used Accounts available to the Sales Manager, System Administrator, Sales User, and Read Only test users. Test Account IDs and exact tested values were not recorded.

## Checks

| Scenario | Expected result | Method or test | Evidence |
| --- | --- | --- | --- |
| Tier field metadata | Optional picklist; Gold, Silver, Bronze in order; no default; description and help text | Review field XML and prior read-only sandbox describe | WI-001 P1-T02 evidence and field XML; passed |
| Sales Manager saves Gold, Silver, Bronze, and blank | Each save succeeds | Owner manual record checks | Mike's 2026-09-27 report in WI-002 Q-04; passed as reported |
| System Administrator saves Gold, Silver, Bronze, and blank | Each save succeeds | Owner manual record checks | Mike's 2026-09-27 report in WI-002 Q-06; passed as reported |
| Sales User reads Tier and cannot edit it in the record interface | Value readable; edit unavailable or denied | Owner manual record check | Mike's 2026-09-27 report in WI-002 Q-04; passed as reported |
| Read Only user reads Tier and cannot edit it | Value readable; edit unavailable or denied | Owner manual record check | Mike's 2026-09-27 report in WI-002 Q-05; passed as reported |
| Sales User API update of Tier | Insufficient access denial | Owner API check | Mike's 2026-09-27 report in WI-002 Q-05; passed as reported |
| Read Only user API update of Tier | Insufficient access denial | Owner API check | Mike's 2026-09-27 report in WI-002 Q-06; passed as reported |
| Profile field permissions | Sales Manager and System Administrator read/edit; Sales User and Read Only read/no edit; no other grants | Read-only `sf` FieldPermissions query and owner Setup inventory | WI-002 P1-T01 and Q-04; passed for the four reported profiles and reported absence of permission-set grants |
| Tier appears directly below Rating for every affected Account view | Correct placement | Owner manual view check and assignment inventory | WI-002 P1-T01, P2-T01, Q-04; passed as reported for the shared standard page and Account Layout |
| New Account Tier default | Blank | Owner manual creation check | Mike's 2026-09-27 report in WI-002 Q-04; passed as reported |
| Existing Account with blank Tier | Remains blank | Owner manual record check | Mike's 2026-09-27 report in WI-002 Q-05; passed as reported |

## Results and follow-up

- Date and tester: Mike reported the record and API checks on 2026-09-27; source and read-only query checks are recorded in WI-001 and WI-002.
- Outcome: All listed checks passed using the evidence stated above. The record and API behavior results are owner reported; test Account IDs and exact values tested per Account were not recorded.
- Remaining issues: None in the approved R-01 and selected Option A checks.

# Account Tier field test plan

## Scope

WI-001 checks R-01 (Tier values and optional field behavior) and R-02 (description and help text) in the sandbox. WI-002 checks access and page placement separately.

## Environment and data

`tkv2-sbx` after Mike Rihm reported the field deployment succeeded on 2026-09-28. Mike used Sales Manager and System Administrator Accounts. The agent created no test records.

## Checks

| Scenario | Expected result | Method or test | Evidence |
| --- | --- | --- | --- |
| New Account | Tier starts blank with no value preselected | Open a new Account as an authorized editor | Mike's 2026-09-28 page report; source metadata has no default |
| Picklist order | Gold, Silver, Bronze in that order | Inspect the choices on an Account | Mike's 2026-09-28 page report; source metadata has that order and `sorted=false` |
| Save Gold | Gold persists after save | Sales Manager page check | Mike's 2026-09-28 report |
| Save Silver | Silver persists after save | System Administrator page check | Mike's 2026-09-28 report |
| Save Bronze and blank | Each persists after save | Sales Manager page checks | Mike's 2026-09-28 report |
| Reject another value | Restricted picklist rejects Platinum through the API | Authorized API request | Mike's 2026-09-28 report |
| Field description | Description exists in Setup | Inspect field definition | Mike's 2026-09-28 report; source metadata |
| Help text | Help text appears on hover | Inspect Account page | Mike's 2026-09-28 report; source metadata |

## Results and follow-up

- Date and tester: Mike Rihm reported the page and API checks, including the new Account state and choice order, on 2026-09-28; the agent and independent checker inspected source metadata on 2026-09-28.
- Outcome: All R-01 and R-02 scenarios have owner-reported sandbox evidence and matching source metadata. Final independent recheck pending.
- Remaining issues: None reported.

# WI-001 Account Tier field test plan

## Scope

Check WI-001 R-01 and R-02 in `tkv2-sbx`. WI-002 checks access and page placement.

## Environment and data

`tkv2-sbx`; Mike Rihm uses a Sales Manager account for record changes. The numbered steps are in `delivery/deployment/WI-002-tier-access-and-layout/manual-steps.md` on the WI-002 branch.

## Checks

| Scenario | Expected result | Method or test | Evidence |
| --- | --- | --- | --- |
| Field definition | Optional restricted picklist; Gold, Silver, Bronze in order; no default | `sf sobject describe -s Account -o tkv2-sbx --json` | Describe response, 2026-09-28: passed |
| Description and help text | Both match the approved design | Inspect Account → Fields & Relationships → Tier in Setup | Mike Rihm reported both exact source strings in Setup, 2026-09-28: passed |
| New Account | Tier starts blank | Create a sandbox Account as Sales Manager | Mike Rihm reported Tier blank on creation, 2026-09-28: passed |
| Set and clear Tier | Each value saves; Tier can be cleared | Edit a sandbox Account as Sales Manager | Mike Rihm reported Gold, Silver, Bronze saved in order and Tier cleared, 2026-09-28: passed |

## Results and follow-up

- Date and tester: 2026-09-28, agent for read-only describe; Mike Rihm for Setup and Account checks.
- Outcome: R-01 and R-02 acceptance checks passed. Setup showed description "Sales team's ranking tier for an Account." and help text "Select Gold, Silver, or Bronze to rank this Account. Leave blank if no Tier has been assigned."
- Remaining issues: The describe response differed from source; the owner confirmed the Setup text matches source. No acceptance gap remains.

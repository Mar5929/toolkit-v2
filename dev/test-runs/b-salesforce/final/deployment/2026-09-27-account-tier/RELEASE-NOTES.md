# Account Tier: production release notes

**Release date:** 2026-09-27
**Environment:** `tkv2-prod` (simulated practice production)  
**Status:** Deployed; checks passed per Mike's report
**Cutover plan:** [CUTOVER-PLAN.md](CUTOVER-PLAN.md)

## Changes delivered

| Work item | User-visible change | Evidence |
| --- | --- | --- |
| WI-001 | Optional Account Tier picklist with Gold, Silver, Bronze and no default | Approved WI-001 result; [field deployment record](../WI-001-account-tier/DEPLOYMENT-RECORD.md) |
| WI-002 | Tier appears below Rating on Account Layout; approved viewers can read it and approved editors can change it | Approved WI-002 result; [layout and access deployment record](../WI-002-tier-access-layout/DEPLOYMENT-RECORD.md) |

## Operational changes

Mike sets Tier profile field grants in production Setup after both packages deploy. No profile XML is deployed.

## Known limitations and follow-ups

No known follow-up from the reported cutover. Mike reported all production checks passed as they did in the sandbox; test Account IDs were not recorded.

## Verification and ownership

Mike reported that both one-component production deploys succeeded with zero component errors. He set the four approved Tier profile grants in `tkv2-prod` Setup, found no other grants, and reported every cutover check passed. Mike owns the production change.

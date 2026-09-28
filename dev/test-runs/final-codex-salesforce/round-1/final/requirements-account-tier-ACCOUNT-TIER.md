# Account Tier

## Purpose and scope

The Acme sales team assigns a Tier to Accounts in Salesforce. Tier assignment is sufficient for this release; no Tier-sorted list view or report is included.

## Functional behavior

### R-01 — Assign Account Tiers

- On an Account, Tier offers Gold, Silver, and Bronze in that order.
- Tier is optional and blank by default. An authorized editor can save a listed value or leave it blank.
- Source: WI-001, approved by Mike Rihm on 2026-09-28.

### R-02 — Explain the Tier field

- The Tier field has a description in Setup and help text on the Account page.
- Source: WI-001, approved by Mike Rihm on 2026-09-28.

### R-03 — Control who can edit Tier

- Sales Manager and System Administrator can read and edit Tier. Other people who can see an Account can read Tier but cannot edit it.
- Tier access does not grant access to Accounts a person otherwise cannot see.
- Source: WI-001 R-03, delivered by WI-002; approved by Mike Rihm on 2026-09-28.

### R-04 — Show Tier on the Account page

- Tier appears directly below Rating on the Account Layout.
- Source: WI-001 R-04, delivered by WI-002; approved by Mike Rihm on 2026-09-28.

## Acceptance evidence

On 2026-09-28, Mike Rihm reported both production deployments Succeeded. In production, he saw Tier below Rating, blank by default, with Gold, Silver, Bronze in order. A Sales Manager saved Gold; a Sales User and a Read Only user could see Tier but could not edit it. Setup effective access showed only Sales Manager and System Administrator could edit. Earlier sandbox checks covered the description, help text, Bronze and blank saves, and rejection of an unlisted value. See the [cutover plan](../../delivery/deployment/2026-09-28-account-tier/CUTOVER-PLAN.md) and the WI-001 and WI-002 deployment records.

## Change history

- 2026-09-28 — WI-001 and WI-002 delivered Account Tier field, access, and page placement, approved by Mike Rihm.

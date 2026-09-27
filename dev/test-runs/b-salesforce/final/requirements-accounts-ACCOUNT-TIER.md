# Account Tier

## Purpose and scope

Account Tier lets the Acme sales team rank Accounts. This behavior was delivered to `tkv2-prod` on 2026-09-27 under WI-001 and WI-002.

## Functional behavior

### R-01 — Account ranking

- Trigger or context: An Account is viewed or edited.
- Required behavior: Tier is an optional restricted picklist with Gold, Silver, and Bronze in that order. Gold is highest. Tier has no default.
- Conditions and exceptions: Existing Accounts may have a blank Tier. A new Account starts with Tier blank. A user who can view an Account can read Tier. Only Sales Manager profile users and system administrators can edit Tier.
- User outcome: Tier appears directly below Rating on Account Layout. The field has a description and help text.
- Source: WI-001 R-01, approved by Mike on 2026-09-27; WI-002 delivered access and placement.
- Delivery status and evidence: Mike reported both production packages succeeded and all cutover checks passed on 2026-09-27. See the [cutover plan](../../delivery/deployment/2026-09-27-account-tier/CUTOVER-PLAN.md).

## Data and access rules

Tier does not require a value and does not change existing blank Accounts. Sales Manager and System Administrator profiles have read/edit; Sales User and Read Only profiles have read only. Mike reported no other Tier grants in `tkv2-prod` Setup. Account object and record access remain governed by their existing settings.

## Integrations and dependencies

Tier uses `Account.Tier__c`, Account Layout, and manually configured profile field permissions. No connector or data load is part of WI-001 or WI-002.

## Acceptance evidence

Mike reported that both editors saved Gold, Silver, Bronze, and blank; both non-editor types could read Tier but could not change it in the page or API; Tier appeared below Rating; a new Account had no default; and an existing blank remained blank. He reported the same checks passed in production on 2026-09-27. Test Account IDs were not recorded.

## Change history

- 2026-09-27 — Account Tier delivered and approved under WI-001 and WI-002; production cutover reported complete by Mike.

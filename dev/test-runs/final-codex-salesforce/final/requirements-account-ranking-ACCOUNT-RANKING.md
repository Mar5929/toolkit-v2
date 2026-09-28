# Account ranking

## Purpose and scope

The Acme sales team ranks Accounts with the Tier field. WI-001 delivered the field; WI-002 delivered access and page placement. Both were approved by Mike Rihm on 2026-09-28.

## Functional behavior

### AR-01 — Tier values

- Trigger or context: A user views or edits an Account.
- Required behavior: Tier offers Gold, Silver, and Bronze in that order.
- Conditions and exceptions: Tier is optional, starts blank, and can be cleared.
- User or system outcome: An authorized editor can save a Tier value or leave it blank.
- Source: WI-001 R-01.
- Delivery status and evidence: Delivered. Mike Rihm reported successful production deployments and checks on 2026-09-28.

### AR-02 — Field guidance

- Trigger or context: A user opens Tier field guidance in Setup or on the Account page.
- Required behavior: Tier has a description and help text.
- Conditions and exceptions: None.
- User or system outcome: The field provides guidance about the ranking choices and leaving Tier blank.
- Source: WI-001 R-02.
- Delivery status and evidence: Delivered. Mike Rihm checked the description and help text in the sandbox before approving the result on 2026-09-28.

### AR-03 — Tier access

- Trigger or context: A user accesses an Account.
- Required behavior: Sales Manager and System Administrator can read and edit Tier. Other users who can see the Account can read Tier without editing it.
- Conditions and exceptions: Tier does not grant Account access.
- User or system outcome: Managers and administrators can change Tier; other Account viewers can see it.
- Source: WI-001 R-03, delivered by WI-002.
- Delivery status and evidence: Delivered. Mike Rihm reported applying profile settings in production and passing access checks on 2026-09-28.

### AR-04 — Tier placement

- Trigger or context: An Account viewer opens the Account page.
- Required behavior: Tier appears directly below Rating.
- Conditions and exceptions: None.
- User or system outcome: All four Account-viewing profiles see Tier below Rating.
- Source: WI-001 R-04, delivered by WI-002.
- Delivery status and evidence: Delivered. Mike Rihm reported passing production page checks for all four profiles on 2026-09-28.

## Data and access rules

Tier is the optional `Account.Tier__c` picklist. Profile field permissions implement AR-03. The Account Layout implements AR-04.

## Integrations and dependencies

No integration is part of WI-001 or WI-002.

## Acceptance evidence

Mike Rihm reported both ordered production deploys Succeeded on 2026-09-28, each with job ID `0AfFAKE000DEPLOY3`. He reported that a Sales Manager saved Gold; Sales User and Read Only could see Tier but could not edit it; and Tier appeared below Rating for Sales Manager, System Administrator, Sales User, and Read Only.

## Change history

- 2026-09-28 — Account Tier field, access, and placement delivered — WI-001 and WI-002.

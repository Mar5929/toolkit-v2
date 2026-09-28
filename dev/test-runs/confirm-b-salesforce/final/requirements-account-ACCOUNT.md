# Account

## Purpose and scope

The Acme sales team uses Account Tier to rank Accounts manually. This requirement covers Account Layout. Other Account layouts and automatic ranking are outside its scope.

## Functional behavior

### R-01 — Manual Account Tier

- Trigger or context: An authorized user creates or edits an Account.
- Required behavior: Tier offers Gold, Silver, and Bronze in that order, with Gold highest. Users set it by hand.
- Conditions and exceptions: Tier may be blank and has no default. The system does not rank Accounts automatically.
- User or system outcome: The chosen value or blank value is saved on the Account.
- Source: WI-001 R-01, approved by Mike on 2026-09-28.
- Delivery status and evidence: Delivered to `tkv2-prod` on 2026-09-28. Mike reported the field deploy succeeded. A read-only production Account describe confirmed the restricted picklist, value order, nullability, and no default. Sandbox record checks are in [WI-001 test plan](../../tests/WI-001-TEST-PLAN.md).

### R-02 — Field guidance

- Trigger or context: A user views Tier or its field settings.
- Required behavior: Tier has a description and help text. The help text says: “Set by hand. Gold is the highest tier, then Silver, then Bronze.”
- Conditions and exceptions: None.
- User or system outcome: The help text explains the manual setting and tier order.
- Source: WI-001 R-02, approved by Mike on 2026-09-28.
- Delivery status and evidence: The [field source](../../force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml) contains the approved description and help text. A read-only production Account describe confirmed the help text. The production description was not independently checked in Setup.

### R-03 — Tier access

- Trigger or context: A user who can access an Account views or edits it.
- Required behavior: Account viewers can read Tier. Sales Manager and System Administrator profile users can edit Tier; Sales User and Read Only profile users can read it without editing.
- Conditions and exceptions: Existing Account object and record access still governs which Accounts a user can see.
- User or system outcome: Tier is visible to the four Account-reading profiles, with editing limited as stated.
- Source: WI-001 R-03, delivered by WI-002; approved by Mike on 2026-09-28.
- Delivery status and evidence: Mike reported saving these grants in `tkv2-prod` Setup and confirming the resulting access on 2026-09-28. The detailed before-and-after Account record-access comparison and exhaustive effective-permission audit were not run; see [WI-002 test plan](../../tests/WI-002-TEST-PLAN.md).

### R-04 — Account Layout placement

- Trigger or context: A user opens an Account assigned Account Layout.
- Required behavior: Tier appears directly below Rating on Account Layout.
- Conditions and exceptions: Other layouts are outside this requirement.
- User or system outcome: Tier is visible below Rating on the Account page, subject to field access.
- Source: WI-001 R-04, delivered by WI-002; approved by Mike on 2026-09-28.
- Delivery status and evidence: Mike reported the production layout deploy succeeded and saw Tier directly below Rating on 2026-09-28.

## Data and access rules

Tier is a nullable, restricted Account picklist. Gold is highest, followed by Silver and Bronze. The four-profile access rules are in R-03. Account object and record access remains governed by existing settings.

## Integrations and dependencies

No automatic ranking or integration is part of WI-001 or WI-002. Full org automation inspection was not run.

## Acceptance evidence

Mike approved both tested results with disclosed gaps on 2026-09-28. He reported both production deploys succeeded, the four-profile access matched, and Tier sat directly below Rating. The [WI-001 deployment record](../../delivery/deployment/WI-001-account-tier-field/DEPLOYMENT-RECORD.md) and [WI-002 deployment record](../../delivery/deployment/WI-002-tier-access-and-layout/DEPLOYMENT-RECORD.md) hold the production outcomes. Unsupported-value API rejection remains unrun.

## Change history

- 2026-09-28 — Account Tier, its guidance, access, and Account Layout placement delivered under WI-001 and WI-002; approved by Mike.

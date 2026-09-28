# Account

## What this area does today

In `tkv2-prod` on 2026-09-28, Account has a manually set Tier picklist with Gold, Silver, and Bronze. Mike reported Tier directly below Rating on Account Layout and confirmed the four-profile field access.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| Account.Tier__c | Stores the manual Account ranking | [Field source](../force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml) | Read-only production Account describe on 2026-09-28 |
| Account-Account Layout | Displays Tier below Rating | [Layout source](../force-app/main/default/layouts/Account-Account%20Layout.layout-meta.xml) | Mike's production page check on 2026-09-28 |
| Four profile field grants | Controls Tier read and edit access | [WI-002 manual steps](../delivery/deployment/WI-002-tier-access-and-layout/manual-steps.md) | Mike's production Setup and access report on 2026-09-28 |

## Data and flow

An authorized user selects Gold, Silver, Bronze, or blank on an Account. The field has no default. No automatic ranking is part of this change.

## Operational behavior

Sales Manager and System Administrator profile users can read and edit Tier. Sales User and Read Only profile users can read it. Existing Account object and record access determines which Accounts users can open. The field access was set in production Setup and is outside the layout-only deployment package.

## Known gaps and uncertainty

The production field description was not independently checked in Setup. Unsupported-value API rejection, full org automation inspection, detailed before-and-after Account record-access comparison, and exhaustive effective-permission audit were not run. The WI-002 production job ID was not separately supplied.

## Last verified

- Date and environment: 2026-09-28, `tkv2-prod`.
- Sources: Production Account describe; Mike's deployment, Setup, access, and layout report; WI-001 and WI-002 deployment records.
- Maintainer: Acme CRM project owner and agents.

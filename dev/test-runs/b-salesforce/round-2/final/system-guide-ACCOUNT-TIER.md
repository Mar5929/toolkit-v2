# Account Tier

## What this area does today

Account Tier is a production Account field used to rank customer accounts. Mike reported the field and layout production deploys succeeded on 2026-09-27 and saw Tier on the Account page as a Sales Manager.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| `Account.Tier__c` | Optional restricted picklist: Gold, Silver, Bronze; no default | `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml` | Source and Mike's production deploy report, 2026-09-27 |
| `Account-Account Layout` | Displays Tier below Rating in Account Information | `force-app/main/default/layouts/Account-Account Layout.layout-meta.xml` | Source and Mike's Sales Manager page check, 2026-09-27 |
| Account profile field access | Sales Manager and System Administrator read/edit; Sales User and Read Only read only | `delivery/deployment/WI-002-tier-access-layout/manual-steps.md` | Mike reported completing production steps; sandbox role checks, 2026-09-27 |

## Data and flow

A permitted editor can select a Tier on an Account. Tier can remain blank. Account record access controls which Accounts a user can see.

## Operational behavior

Profile field access is maintained manually in Salesforce Setup. The WI-001 field package must be deployed before the WI-002 layout package. Neither package deploys profiles.

## Known gaps and uncertainty

Mike confirmed the Sales Manager production page display. Separate production checks for system administrator editing, other profiles' read-only access, and effective permission-set grants were not reported. Check these in the org before relying on production access details.

## Last verified

- Date and environment: 2026-09-27, production, based on Mike's deploy and page report; source and sandbox checks are recorded in WI-001 and WI-002.
- Sources: `force-app/` metadata and `delivery/deployment/` records.
- Maintainer: Acme CRM project owner.

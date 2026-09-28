# Account Tier

## What this area does today

In production `tkv2-prod`, Accounts have an optional Tier picklist. Mike Rihm reported the field and layout deployments succeeded and checked the page and access in Setup on 2026-09-28.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| `Account.Tier__c` | Restricted picklist with Gold, Silver, Bronze and no default. | `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml` | Source metadata and Mike Rihm’s production report, 2026-09-28. |
| `Account-Account Layout` | Places Tier directly below Rating. | `force-app/main/default/layouts/Account-Account Layout.layout-meta.xml` | Source metadata and Mike Rihm’s production page check, 2026-09-28. |
| Profile field permissions | Sales Manager and System Administrator edit; Sales User and Read Only read. | Salesforce Setup; [WI-002 manual steps](../delivery/deployment/WI-002-tier-access-layout/manual-steps.md) | Mike Rihm’s production Setup and effective-access report, 2026-09-28. |

## Data and flow

An authorized Account editor selects Tier or leaves it blank and saves the Account. The field has a description in Setup and help text on the page.

## Operational behavior

Tier field permissions were set in production Setup after deployment. Mike Rihm reported effective access allows editing only for Sales Manager and System Administrator. Dana Lee reviews Account tiers every Monday.

## Known gaps and uncertainty

The agent did not independently read back production metadata or permissions after deployment. The production report did not separately cover a System Administrator save, Bronze or blank save, help text, or rejection of an unlisted value; those behaviors were checked earlier in the sandbox.

## Last verified

- Date and environment: 2026-09-28, `tkv2-prod`, owner report.
- Sources: WI-001 and WI-002 deployment records and [cutover plan](../delivery/deployment/2026-09-28-account-tier/CUTOVER-PLAN.md).
- Maintainer: Acme CRM project owner.

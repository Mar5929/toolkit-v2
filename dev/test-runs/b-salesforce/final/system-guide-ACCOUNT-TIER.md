# Account Tier

## What this area does today

In `tkv2-prod`, Account Tier is an optional restricted picklist used to rank Accounts. Mike reported the field and layout deployed and the production checks passed on 2026-09-27.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| `Account.Tier__c` | Stores Gold, Silver, Bronze, or blank; no default | `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml` | WI-001 field package succeeded, one component and zero errors, per Mike. |
| `Account-Account Layout` | Places Tier directly below Rating | `force-app/main/default/layouts/Account-Account Layout.layout-meta.xml` | WI-002 layout package succeeded, one component and zero errors, per Mike. |
| Profile field permissions | Sales Manager and System Administrator read/edit; Sales User and Read Only read only | `tkv2-prod` Setup; [WI-002 manual steps](../delivery/deployment/WI-002-tier-access-layout/manual-steps.md) | Mike reported the four grants and no others. Profile XML was not deployed. |

## Data and flow

Users with Account access read Tier on Account Layout. Sales Manager and System Administrator users may set or clear it. The field has no default, and existing blanks remain blank. The delivered business rules are in [Account Tier requirements](../requirements/accounts/ACCOUNT-TIER.md).

## Operational behavior

The four Account-viewing profiles use the standard Account page with Account Layout, per Mike's Setup confirmation during the sandbox checks. No custom Account Lightning record page or permission set/group grant for Account fields was reported. The WI-001 package deploys the field; the WI-002 package deploys the layout; profile grants are set manually in Setup.

## Known gaps and uncertainty

Production behavior and grants were reported by Mike after the cutover. This closeout did not run an independent production query or record test. Test Account IDs were not recorded.

## Last verified

- Date and environment: 2026-09-27, `tkv2-prod` (simulated practice production), from Mike's cutover report.
- Sources: [cutover plan](../delivery/deployment/2026-09-27-account-tier/CUTOVER-PLAN.md), WI-001, WI-002, and the metadata paths above.
- Maintainer: Acme CRM project owner.

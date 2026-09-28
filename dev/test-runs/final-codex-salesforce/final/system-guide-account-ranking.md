# Account ranking

## What this area does today

In `tkv2-prod`, Account Tier provides Gold, Silver, and Bronze ranking values. Mike Rihm reported the production deployments and page checks passed on 2026-09-28.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| `Account.Tier__c` | Optional restricted picklist with no default | `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml` | WI-001 source; owner-reported production deploy and checks, 2026-09-28 |
| `Account-Account Layout` | Places Tier directly below Rating | `force-app/main/default/layouts/Account-Account Layout.layout-meta.xml` | WI-002 source; owner-reported production check for four profiles, 2026-09-28 |
| Account-viewing profiles | Set Tier field read and edit access | Production Setup; `delivery/deployment/WI-002-tier-access-and-layout/manual-steps.md` | Owner-reported production settings and access checks, 2026-09-28 |

## Data and flow

An Account starts with Tier blank. A user with edit access can set Gold, Silver, or Bronze and save the Account. Account viewers with read access see the saved value.

## Operational behavior

Sales Manager and System Administrator profiles have Tier Read and Edit. Sales User and Read Only have Tier Read without Edit. All four profiles use Account Layout. The owner reported no Lightning record pages or permission set grants for Tier before the production layout deploy.

## Known gaps and uncertainty

The two production deploys were reported with the same job ID, so that ID alone does not identify each package. The owner reported both as Succeeded and reported that production checks passed.

## Last verified

- Date and environment: 2026-09-28, `tkv2-prod`.
- Sources: Mike Rihm's production deploy and check report; WI-001 and WI-002 source and deployment records.
- Maintainer: Acme CRM project owner.

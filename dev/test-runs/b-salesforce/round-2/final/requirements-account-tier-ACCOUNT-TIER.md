# Account Tier

## Purpose and scope

The Acme sales team uses Account Tier to rank customer accounts. WI-001 approved the field and behavior; WI-002 delivered profile access and main Account layout placement. Account record access still controls which records each user can see.

## Functional behavior

### AT-01 — Rank an Account by Tier

- An Account can have a blank Tier. There is no default value.
- The available values are Gold, Silver, and Bronze, in that order.
- The field has a description and help text.
- Source: WI-001 R-01, approved by Mike on 2026-09-27.
- Delivery: Mike reported the WI-001 production field deploy succeeded on 2026-09-27. Sandbox blank, save, reload, and clear checks passed.

### AT-02 — Control Tier access

- Sales Manager profile users and system administrators can read and edit Tier on Accounts they can edit.
- Other users who can view an Account can read Tier but cannot edit it.
- Account record access remains unchanged.
- Source: WI-001 R-02, delivered through WI-002; approved by Mike on 2026-09-27.
- Delivery: Mike reported completing production profile access steps on 2026-09-27. Sandbox role checks passed. Separate production effective-access checks were not reported.

### AT-03 — Show Tier on the main Account page

- Tier appears on the main Account page layout for users who can view the Account.
- Source: WI-001 R-03, delivered through WI-002; approved by Mike on 2026-09-27.
- Delivery: Mike reported the WI-002 production layout deploy succeeded and saw Tier on the Account page as a Sales Manager on 2026-09-27.

## Data and access rules

Tier is the optional `Account.Tier__c` restricted picklist. Profile field access is set manually in production; profile metadata is excluded from the CLI deployment packages.

## Integrations and dependencies

No integration or report placement was included in WI-001 or WI-002. The WI-002 layout depends on the WI-001 field.

## Acceptance evidence

WI-001 and WI-002 record the approved requirements, sandbox checks, and Mike's production report. Production deployment records are in `delivery/deployment/WI-001-account-tier/` and `delivery/deployment/WI-002-tier-access-layout/`.

## Change history

- 2026-09-27 — WI-001 and WI-002 delivered to production and accepted by Mike.

# WI-002 manual deployment steps

## Set Account Tier field access

| Field | Value |
| --- | --- |
| Phase | Post-deploy, after the WI-001 field deployment and before the WI-002 layout deployment |
| Order | 10 |
| Owner | Mike |
| Status | Done in `tkv2-sbx` on 2026-09-28; Mike reported saving it, and the four profile grants were verified by read-only query |

**Purpose:** Make Account Tier visible to the four profiles that can read Account. Only Sales Manager and System Administrator may edit Tier. WI-001 R-03 and WI-002 P2-T02 define this change.

1. In `tkv2-sbx` Setup, open Object Manager → Account → Fields & Relationships → Tier → Set Field-Level Security.
2. Set **Visible** for Sales Manager, System Administrator, Sales User, and Read Only.
3. Set **Read-Only** for Sales User and Read Only. Leave **Read-Only** off for Sales Manager and System Administrator.
4. Save. Do not change other field permissions, Account object permissions, or record access.

**Verification:** Check Tier visibility and editability for a representative user in each profile. Confirm Sales Manager and System Administrator can edit Tier, while Sales User and Read Only can see it but cannot edit it. Check that no permission set or permission set group grants Tier edit access. Record the result in [WI-002 test plan](../../../tests/WI-002-TEST-PLAN.md).

## Set Account Tier field access in production

| Field | Value |
| --- | --- |
| Phase | Post-deploy, after the WI-001 production field deployment and before the WI-002 production layout deployment |
| Order | 20 |
| Owner | Mike |
| Status | Done in `tkv2-prod` on 2026-09-28; Mike reported saving the four profile grants and confirming the resulting access |

**Purpose:** Give Account viewers Tier read access in production while restricting Tier edits to Sales Manager and System Administrator. A read-only production query on 2026-09-28 found Account read access on exactly these four profiles; no Tier field-permission grants existed because Tier was absent.

1. In `tkv2-prod` Setup, open Object Manager → Account → Fields & Relationships → Tier → Set Field-Level Security.
2. Set **Visible** for Sales Manager, System Administrator, Sales User, and Read Only.
3. Set **Read-Only** for Sales User and Read Only. Leave **Read-Only** off for Sales Manager and System Administrator.
4. Save. Do not change other field permissions, Account object permissions, or record access.

**Verification:** Confirm the four Tier grants: Sales Manager and System Administrator can read and edit; Sales User and Read Only can read but cannot edit. Check that no permission set or permission set group grants Tier edit access. After the WI-002 layout deploy, check a representative Account as each profile and confirm Tier appears directly below Rating. Report the result for the WI-002 record.

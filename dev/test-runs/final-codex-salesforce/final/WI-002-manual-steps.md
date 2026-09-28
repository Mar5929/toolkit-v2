# WI-002: manual deployment steps

These steps apply in each target org after WI-001 has deployed `Account.Tier__c`. Mike Rihm runs org changes. WI-002 uses the approved Option A profile access design; profiles stay out of the CLI package.

## Pre-deploy

### Check Account viewers and page assignments

- **Order:** 10
- **Owner:** Mike Rihm
- **Status:** Done in `tkv2-sbx` and `tkv2-prod`, reported by Mike Rihm on 2026-09-28.
- **Purpose:** Include every Account-viewing profile and active Account page in the target org before placing Tier or setting field access. This is WI-002 P1-T01 and P2-T01.

1. In Setup, list profiles with Account Read access and note each profile's Account page layout assignment.
2. Check active Account Lightning record page assignments. If a page uses Dynamic Forms to place fields, pause this release so the WI-002 source and package can include Tier directly below Rating on that page. The current package contains only the existing `Account-Account Layout` layout.
3. Check permission sets and permission set groups for an existing grant to `Account.Tier__c`, especially Edit access for a user outside the Sales Manager and System Administrator profiles. Resolve any conflicting grant before acceptance.

**Verify:** Record every Account-viewing profile, its layout and active record page, and any Tier field grant. In `tkv2-sbx` on 2026-09-28, the read-only inventory found Sales Manager, System Administrator, Sales User, and Read Only with Account Read, all assigned `Account Layout`; no FlexiPage or PermissionSet records were returned. Repeat in the target org before each release.

## Post-deploy

### Set Tier access on Account-viewing profiles

- **Order:** 20
- **Owner:** Mike Rihm
- **Status:** Done in `tkv2-sbx` and `tkv2-prod`, reported by Mike Rihm on 2026-09-28. Production checks included a Sales Manager save and Sales User and Read Only visibility without edit access.
- **Purpose:** Apply WI-001 R-03 after the field exists in the org. Profile permissions are manual under the approved design.

1. In Setup, open each Account-viewing profile, then Object Settings → Accounts → Field Permissions for Tier.
2. Set **Read** and **Edit** for Sales Manager and System Administrator.
3. Set **Read** without **Edit** for Sales User, Read Only, and every other profile with Account Read access.
4. Save each profile. Do not add Account object or record access as part of this change.

**Verify:** Using a user with each profile, check that a Sales Manager and system administrator can edit and clear Tier on an Account they can access. Check that every other Account viewer can see Tier but cannot edit it. Check that a user without Account access still cannot see the Account. Confirm no permission set adds Tier Edit for a non-manager.

### Check Tier position on the Account page

- **Order:** 30
- **Owner:** Mike Rihm
- **Status:** Done in `tkv2-sbx` and `tkv2-prod`, reported by Mike Rihm on 2026-09-28. The production page check covered all four profiles.
- **Purpose:** Confirm WI-001 R-04 on the page each viewer sees.

1. Open an Account as a user from each Account-viewing profile.
2. Confirm Tier appears directly below Rating in the same Account Information column.
3. If an active Dynamic Forms record page controls these fields, pause acceptance and update WI-002 source and its package before release, then repeat the check.

**Verify:** Each Account-viewing profile sees Tier directly below Rating on its active Account page.

## Final sandbox checks

1. In Setup, open Account → Fields & Relationships → Tier. Confirm the description and help text. The 2026-09-28 sandbox check showed both matched the committed field source, despite a different describe response.
2. As a Sales Manager, create an Account with Tier blank. Set Gold, Silver, then Bronze on an Account, save each value, and clear Tier. Confirm the choices appear in that order.
3. On an Account each profile can access, confirm Sales Manager and System Administrator can edit Tier. Confirm Sales User and Read Only can see Tier but cannot edit it.
4. As each of the four profiles, confirm Tier appears directly below Rating on the Account page. Report any difference with the profile name.

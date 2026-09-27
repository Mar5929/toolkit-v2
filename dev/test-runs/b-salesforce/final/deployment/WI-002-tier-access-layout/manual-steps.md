# WI-002: Account Tier access and view checks

## Pre-deploy

### Confirm Account view assignments and field grants

- **Order:** 10
- **Owner:** Mike
- **Status:** Done, 2026-09-27
- **Related work item:** WI-002
- **Purpose:** Confirm which Account pages users receive and whether any permission set grants Tier edit access outside the approved profiles.

1. In `tkv2-sbx` Setup, review Account page layout assignments and active Account Lightning record pages for Sales Manager, System Administrator, Sales User, and Read Only profiles. Record any other Account-viewing profiles or assigned pages.
2. Review field permissions for `Account.Tier__c` on every Account-viewing profile, permission set, and permission set group after the field is deployed. Identify every route to field edit access.
3. If an assigned page uses Dynamic Forms or does not use `Account Layout`, stop and update WI-002 before deploying the layout package.

**Verify:** Mike confirmed in tkv2-sbx Setup on 2026-09-27 that Sales Manager, System Administrator, Sales User, and Read Only all use the standard Account page with Account Layout. There are no custom Account Lightning record pages, and no permission sets or groups grant Account field access. Tier has no read or edit grants yet. The intended post-deploy matrix is: Sales Manager and System Administrator read/edit; Sales User and Read Only read/no edit. Actual access remains to be configured and tested.

## Post-deploy

### Set Tier field access in Setup

- **Order:** 20
- **Owner:** Mike
- **Status:** Done, 2026-09-27; Setup grants confirmed by read-only query and behavior checks reported by Mike
- **Related work item:** WI-002
- **Purpose:** Profile field permissions are configured in Setup, not deployed from profile XML.

1. In `tkv2-sbx` Setup, give `Account.Tier__c` read access to every profile whose users can view Accounts.
2. Give field edit access only to Sales Manager and System Administrator profiles. Remove any Tier edit grant from other profiles, permission sets, or permission set groups.
3. Preserve existing Account object and record access. Do not give Account access just to expose Tier.

**Verify:** Mike reported saving four profile grants in Setup on 2026-09-27. A read-only `sf` FieldPermissions query returned Sales Manager and System Administrator read/edit, and Sales User and Read Only read/no edit. Mike reported that both editor users saved Gold, Silver, Bronze, and blank; Sales User and Read Only users saw Tier without edit access; and API Tier updates as both non-editor users were denied with insufficient access errors. Test Account IDs were not recorded.

### Check Tier values and page placement

- **Order:** 30
- **Owner:** Mike
- **Status:** Done, 2026-09-27; Mike reported all listed checks passed
- **Related work item:** WI-002
- **Purpose:** Confirm R-01 in the actual assigned Account views.

1. Check that Tier appears directly below Rating in every affected assigned view.
2. As Sales Manager and System Administrator users, save Gold, Silver, Bronze, and blank on test Accounts they can edit. Check the value order and that a new Account has no Tier default.
3. As each distinct non-manager Account-viewer access combination, confirm Tier is readable and an attempted edit is denied in both the record interface and API.

**Verify:** Mike reported that Tier appears directly below Rating on the shared Account page; both Sales Manager and System Administrator users saved Gold, Silver, Bronze, and blank; Sales User and Read Only users saw Tier without edit access; API Tier updates as both non-editor users were denied with insufficient access errors; a new Account had no Tier default; and an existing blank Tier stayed blank. The `sf` Account describe also returned the three active choices in order and no default. See WI-002 Q-04 through Q-06.

## Production cutover

### Set Tier field access in production Setup

- **Order:** 30, after both production packages succeed
- **Owner:** Mike
- **Status:** Done, 2026-09-27; Mike reported the production Setup grants and all cutover checks passed
- **Related work item:** WI-002
- **Purpose:** Profile field permissions are configured in Setup, not deployed from profile XML.

1. In `tkv2-prod` Setup, give `Account.Tier__c` read access to every profile whose users can view Accounts.
2. Give Tier edit access only to Sales Manager and System Administrator. Remove any Tier edit grant from other profiles, permission sets, or permission set groups.
3. Preserve existing Account object and record access. Record the four resulting profile grants.

**Verify:** Mike reported Sales Manager and System Administrator read/edit, Sales User and Read Only read only, and no other Tier grants in `tkv2-prod`. He reported every step 40 record and API check passed as in the sandbox. This production evidence is owner reported; no agent production query was run.

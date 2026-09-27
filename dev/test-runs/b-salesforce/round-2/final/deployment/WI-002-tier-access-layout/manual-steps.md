# WI-002: Account Tier access

## Set Account Tier field access on profiles

**Phase:** Post-deploy  
**Order:** 10  
**Owner:** Salesforce administrator  
**Status:** Done; Mike reported completing the production profile access steps on 2026-09-27
**Originating task:** WI-002 P2-T01

**Purpose:** Set field-level security after `Account.Tier__c` is deployed. Profiles are excluded from CLI deployment by the project rules.

1. In Setup, open each profile's Object Settings for Account and edit field permissions for `Tier__c`.
2. Set **Read** and **Edit** for `Sales Manager` and `System Administrator`.
3. Set **Read** and clear **Edit** for `Sales User` and `Read Only`.
4. Check any other Account-viewing profile in the org. Set **Read** and clear **Edit** unless it is a system administrator or Sales Manager profile. Do not grant Account object or record access as part of this change.
5. Inspect assigned permission sets, permission set groups, and any broad override permissions for users outside the two editing profiles. Resolve any effective edit access before accepting WI-002.

**Verification:** Check field access and the Account page as a Sales Manager, system administrator, and another Account viewer. The first two can edit and clear Tier on Accounts they can edit; the other viewer can read Tier but cannot edit it. Confirm that users without Account record access still cannot see the Account.

Mike reported setting the four named profiles as instructed. He checked that Sales Manager and System Administrator users can edit and clear Tier, Sales User and Read Only users can see it but cannot edit it, and a user without Account record access cannot open that Account. A sandbox FieldPermissions query returned the intended read and edit settings for all four profiles, and PermissionSetAssignment returned no records. These results are recorded in the WI-001 test plan.

Mike also reported seeing Tier on the production Account page as a Sales Manager. Separate production checks for other profiles and effective permission-set grants were not reported.

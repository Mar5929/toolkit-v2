# WI-002: Account Tier layout and access

## Scope

The WI-002 package contains only `Layout:Account-Account Layout`. It adds `Tier__c` below Rating in the Account Information section. The source was retrieved from `tkv2-sbx` on 2026-09-27 before editing, and the existing items and System Information section remain intact.

The layout depends on `Account.Tier__c` from WI-001. Deploy the WI-001 field before this layout. Profile field access is a separate manual step in `manual-steps.md`.

## Checks

- `sf project retrieve start --metadata 'Layout:Account-Account Layout' --target-org tkv2-sbx --json` returned the layout source.
- `sf project deploy validate -x delivery/deployment/WI-002-tier-access-layout/package.xml -o tkv2-sbx --json` reported success, check only, job `0AfFAKE000VALID2`. It reported one component.
- Validation of the project manifest containing both the field and layout also reported success under the same job ID and reported one component. This count does not establish that both components were checked.
- The source dependency graph found one layout reference to `Account.Tier__c`. It does not establish live org behavior.

## Production outcome

On 2026-09-27, Mike reported that he ran the WI-002 layout production deploy against corrected `tkv2-prod` after WI-001 and that it succeeded. He also completed the production profile access steps in `manual-steps.md` and saw Tier on the Account page as a Sales Manager. The production deploy and profile changes were run by Mike; no deployment job ID was supplied. He did not report separate production checks for system administrator editing, read-only users, or effective grants from permission sets.

## Sandbox outcome

Mike reported both sandbox deploys succeeded. He checked that Sales Manager and System Administrator users could edit and clear Tier, Sales User and Read Only users could see it but not edit it, and a user without Account record access could not open that Account. A sandbox FieldPermissions query returned the intended read and edit settings for all four profiles, and PermissionSetAssignment returned no records. The CLI field describe confirmed the intended values, optional setting, and no default. WI-001 records Mike's blank and value-save checks.

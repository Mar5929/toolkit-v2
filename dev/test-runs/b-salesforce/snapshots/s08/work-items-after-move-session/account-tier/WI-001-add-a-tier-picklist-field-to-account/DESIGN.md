---
work_item: WI-001
status: approved
approved: "2026-09-27 by Mike"
---

# WI-001: Add a Tier picklist field to Account — solution design

**Requirements:** WI-001, R-01, approved by Mike on 2026-09-27  
**Design status:** Approved  
**Requirements checked:** WI-001 requirements, 2026-09-27  
**Last updated:** 2026-09-27  
**Design approval:** Approved by Mike on 2026-09-27

## What this design solves

The sales team needs to rank Accounts with an optional Tier field. Gold, Silver, and Bronze must appear in that order, with Gold highest and no default. Every Account viewer must be able to read Tier. Only Sales Manager profile users and system administrators may edit it. Tier must appear directly below Rating on Account Layout and have a description and help text. This design covers the field, access, layout, and verification. It does not change existing Account data.

## Requirements and design readiness

The approved requirement is ready for design. The independent requirements analyst found no material gap on 2026-09-27. The sandbox's full Account layout and access configuration still need a read-only inventory before implementation.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Account ranking | Finalized, Mike, 2026-09-27 | Options A and B; Option B has a stated condition | No requirements decision. Verify org configuration before build. |

## What exists today

The repository declares `force-app` and source API 62.0 in `sfdx-project.json`, but `force-app` does not exist yet. A read-only sandbox check on 2026-09-27 confirmed `tkv2-sbx` is connected at API 62.0 and a Tooling API query returned `Account Layout`. A query for `Account.Tier__c` returned no CustomField record, but the current field and full layout metadata were not retrieved. Rating's exact position, assigned Lightning pages, Dynamic Forms, profiles, and effective field access remain unverified. The build must inspect the org before creating or replacing any component.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Use Salesforce built-in features and show two options. | Mike, 2026-09-27, confirmed | Both options use standard field, layout, and access controls. |
| Constraint | Do not deploy profile metadata from source. | Project permissions-source-control rule, confirmed | Profile field access needs recorded Setup steps and verification. |
| Constraint | Agents never deploy to or change production. Sandbox deployment needs Mike's approval. | AGENTS.md and Salesforce org safety rule, confirmed | Production release is an owner handoff. |
| Assumption | `Account Layout` governs the relevant record detail view. | Not verified | Inventory all assignments and Dynamic Forms before build; stop for scope correction if placement cannot be met. |

## Design options

### Option A — Profile field permissions

#### Approach

Inspect sandbox `Account.Tier__c` first. If it exists, reuse or adjust it; otherwise create the optional picklist. Use Salesforce field-level security to grant read access to every Account viewer and edit access only to the Sales Manager and System Administrator profiles. Configure profile permissions in Setup. Do not deploy profile XML. Put Tier directly below Rating on `Account Layout` and verify the actual assigned view for every affected Account viewer. If existing layout or Dynamic Forms assignments prevent that placement within the approved scope, stop for a scope correction.

This uses the approved built-in approach. The requirements describe a complete result for the named field, access rule, and layout. The build still needs an inventory of the sandbox field, actual profiles, permission sets, permission set groups, every affected Account layout and Lightning page assignment, Dynamic Forms, and `Account Layout` metadata before making changes.

#### End-to-end behavior

An Account viewer opens an Account record and sees Tier directly below Rating in the actual assigned view. Tier may be blank on existing and new Accounts. The viewer can read the selected value and help text. A user with the Sales Manager or System Administrator profile can select Gold, Silver, or Bronze, save, and clear the field when the user also has Account and record edit access. Other Account viewers can read but cannot edit through the record interface or API. Check every affected layout and page assignment, including Dynamic Forms.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 — Account ranking | New or changed `Account.Tier__c` picklist with Gold, Silver, Bronze in that order; no default and not required. New or changed description and help text. Changed assigned Account views as needed within approved scope. Reused profile field-level security, configured in Setup. Audit all field grants. | The field stores the ranking and allows blank values. Gold is highest. Field-level security grants read to all Account viewers and restricts edit to the two approved profiles when no other grant adds edit. Every affected assigned view must show Tier directly below Rating. | Inspect field metadata. Inventory every affected layout, Lightning page, and Dynamic Forms assignment and confirm placement in each actual view. Build an effective-access matrix for every affected profile and permission-set or group combination, including multiple grants; verify read and edit for each combination. Save all three values and blank as Sales Manager and System Administrator users. Confirm denied record-interface and API edits for every non-manager combination. |

#### Technical shape

**Components and files**

- New or changed after sandbox inspection: `Account.Tier__c` custom field metadata in `force-app`, using the existing `sfdx-project.json` API version 62.0. Set label `Tier`, type Picklist, active values Gold, Silver, Bronze in that order, no default, and `required=false`.
- New field description: `Ranks an Account as Gold, Silver, or Bronze for sales prioritization. Gold is highest.`
- New field help text: `Select Gold, Silver, or Bronze to rank this Account. Gold is highest. Leave blank if the Account has not been ranked.`
- Changed: `Account Layout` metadata, with Tier immediately below Rating in the same layout column. Retrieve the full layout first; preserve its other fields and sections. Inventory every affected Account layout and Lightning page assignment, including Dynamic Forms. If other assigned views need changes, confirm approved scope before editing them.
- Reused: Salesforce profile field-level security, configured in Setup for the profiles found by the access inventory. No profile XML is included in the deploy package.
- New: work-item package manifest containing only the field and approved view metadata changes. New manual access configuration and verification steps in the work item's deployment instructions.

**Data and state**

- `Tier__c` is an optional single-select value on each Account. The ordered values are Gold, Silver, Bronze. Gold is highest. No automation fills blank values. Existing Accounts remain blank until a permitted user sets a value.
- Do not migrate or alter existing Account records.

**Access and security**

- Inventory profiles of all users who can view Account, including users whose Account access comes from a permission set. Give each such profile read access to `Account.Tier__c` in Setup. Give field edit access only on the Sales Manager and System Administrator profiles.
- Inspect all permission sets and permission set groups assigned to Account viewers for `Tier__c` edit grants. Remove or avoid any grant that would let another profile's user edit the field. Salesforce permissions can add together; a read-only profile setting does not cancel an edit grant from a permission set.
- Verify the real profile names and assignments before configuration. Enumerate every distinct effective profile, permission-set, and permission-set-group combination among Account viewers, including users with multiple grants. Verify effective field read and edit for each combination. Do not assume layout visibility enforces editing rights.

**Integrations**

- No integration or automation is requested. Existing API clients can read the field only if their Salesforce user has Account and field read access. An update needs Account and field edit access.

**Operations**

- Deploy only the field and layout metadata through the work-item package to the sandbox. Configure profile field permissions in Setup after the field exists. Record the exact profile settings and permission-set audit as manual release steps for the owner; agents do not deploy to or change production.
- If a new profile or permission set later grants Account access, an administrator must check `Tier__c` read access and ensure edit remains restricted. Profile Setup changes are not captured by this package.

#### Tradeoffs and risks

| Tradeoff or risk | Effect and response |
| --- | --- |
| Profile field permissions are manual and absent from source control. | The release needs recorded Setup steps and access verification in each target org. Recheck after profile or permission changes. |
| Permission sets and permission set groups grant permissions cumulatively. | An edit grant outside the Sales Manager or System Administrator profiles would break R-01. Audit grants before and after configuration, then test a non-manager Account viewer. |
| The exact position of Rating in `Account Layout` is not yet verified. | Retrieve the layout and place Tier immediately after Rating in the same column. Review the metadata diff and rendered record so other layout content is preserved. |
| Account viewers may have different layout assignments or Dynamic Forms pages. | Inventory every affected assignment and verify Tier directly below Rating in each actual view. If approved scope cannot achieve this, stop for a scope correction. |
| The repository has no `force-app` source today; sandbox field existence is unresolved. | Inspect the sandbox first. Reuse or adjust `Tier__c` if present, or add it if absent. Keep the package narrow. |

#### Build order

1. Inspect sandbox `Account.Tier__c` existence; inventory Account-viewing profiles, effective permission combinations, every affected Account layout and Lightning page assignment, Dynamic Forms, and `Account Layout` metadata. Depends on sandbox read access. Complete when field status, the access matrix, view assignments, and Rating's exact position are recorded. Stop for scope correction if approved changes cannot give every affected viewer the required placement.
2. Add or adjust `Account.Tier__c` custom field metadata with the approved values, order, optional setting, no default, description, and help text. Depends on step 1. Complete when metadata review shows every setting without a duplicate field.
3. Add Tier directly below Rating on `Account Layout` and each other approved assigned view that needs it; create a narrow work-item package manifest. Depends on steps 1 and 2. Complete when diffs preserve unrelated content and every affected view can show the required placement.
4. Validate and deploy the narrow package to the sandbox using the sandbox alias from `.toolkit.json`. Depends on step 3. Complete when Salesforce accepts the metadata and the field appears on the intended layout. Do not target production.
5. Configure profile field permissions in sandbox Setup: read for all Account-viewing profiles, edit only for Sales Manager and System Administrator. Audit permission sets and groups for unwanted edit grants. Depends on step 4. Complete when the access matrix matches the approved rule.
6. Test saving Gold, Silver, Bronze, and blank as Sales Manager and System Administrator. Verify effective read and edit for every affected profile and permission-set or group combination, including denied API edits for each non-manager combination. Check Tier below Rating in every actual assigned Account view. Depends on step 5. Complete when R-01 is observed for the full affected set.
7. Prepare the owner's production release instructions with the narrow package, manual profile settings, permission-set audit, and verification steps. Depends on step 6. Complete when the owner has reviewable commands and steps. Production deployment and configuration are owner actions.

### Option B — Dedicated edit permission set

#### Approach

Inspect sandbox `Account.Tier__c` first. Reuse or adjust it if present; otherwise create the optional picklist. Give all Account viewers field read access. Give field edit access through a new `Account_Tier_Edit` permission set assigned only to active users with the Sales Manager profile. Keep field edit access on the System Administrator profile. Put Tier directly below Rating in every affected assigned Account view. Use Salesforce Setup to manage profile field permissions; do not deploy profile XML.

The requirements describe a complete result for the field, access rule, and layout. Before building, inventory the sandbox field, Account-viewing profiles, effective permission combinations, Sales Manager users, every affected layout and Lightning page assignment, Dynamic Forms, and `Account Layout`. If approved view changes cannot show Tier below Rating to every affected viewer, stop for scope correction. Manual permission-set assignments cannot guarantee the strict profile-tied rule between a profile change and the assignment update. Option B is conditional and inferior to Option A unless a dependable assignment mechanism is available and verified in the target org. Salesforce documents User Access Policies as a possible built-in mechanism for granting and removing permission sets on user create or update using profile criteria, but target-org availability and the exact grant and removal behavior are unverified. Do not select Option B on an assumed automation.

#### End-to-end behavior

An Account viewer opens an Account record and reads Tier directly below Rating in the actual assigned view. Tier can be blank. An active Sales Manager profile user who has Account edit and record access receives `Account_Tier_Edit` and can select Gold, Silver, or Bronze, save, or clear the value. A System Administrator with Account edit access can do the same through profile field edit access. Other Account viewers can read Tier but cannot edit it through the record interface or an API update. Every affected assigned layout and Dynamic Forms page must show the placement. A profile change requires an assignment change; manual processing leaves a period in which access may be wrong. Do not claim R-01 is met until the target org's assignment mechanism and profile transitions have been tested.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 — Account ranking | New or changed `Account.Tier__c` picklist with Gold, Silver, Bronze in order; no default and not required. New or changed description and help text. Changed assigned Account views within approved scope. New `Account_Tier_Edit` permission set. Reused profile field-level security for baseline read and System Administrator edit. Audit all grants and assignments. | The field stores the ranking, including blank; Gold is highest. Baseline field read covers Account viewers. The permission set gives Sales Manager users field edit only while correctly assigned; System Administrator profile retains edit. Manual assignment alone cannot guarantee the profile-tied rule after a profile change, so this option remains conditional until a dependable mechanism is verified. Every affected view must show Tier below Rating. | Inspect field metadata. Inventory all affected layout, Lightning page, and Dynamic Forms assignments and confirm actual placement. Build an effective-access matrix for every affected profile and permission-set or group combination; verify read and edit for each, including users with multiple grants. Compare assignees with active Sales Manager users and test profile entry and exit, including prompt removal. Save all values and blank as Sales Manager and System Administrator users. Confirm denied record-interface and API edits for every non-manager combination. |

#### Technical shape

**Components and files**

- New or changed after sandbox inspection: `Account.Tier__c` custom field metadata in `force-app`, using the existing `sfdx-project.json` API version 62.0. Set label `Tier`, type Picklist, active values Gold, Silver, Bronze in that order, no default, and `required=false`.
- New field description: `Ranks an Account as Gold, Silver, or Bronze for sales prioritization. Gold is highest.`
- New field help text: `Select Gold, Silver, or Bronze to rank this Account. Gold is highest. Leave blank if the Account has not been ranked.`
- New: `Account_Tier_Edit` permission set metadata with `Account.Tier__c` field read and edit permissions. It grants no Account object or record access by itself.
- Changed: `Account Layout` metadata, with Tier immediately below Rating in the same layout column. Retrieve the full layout and preserve its other fields and sections. Inventory every affected Account layout and Lightning page assignment, including Dynamic Forms. Confirm approved scope before changing other assigned views.
- Reused: profile field-level security in Salesforce Setup for baseline field read and System Administrator field edit. No profile XML goes in the deploy package.
- New: work-item package manifest containing only the field, permission set, and approved view metadata changes. New manual profile configuration, assignment, audit, and verification steps in the work item's deployment instructions. A User Access Policy is a possible conditional addition only after target-org capability and behavior are verified.

**Data and state**

- `Tier__c` is an optional single-select value on each Account. The ordered values are Gold, Silver, Bronze. Gold is highest. No automation fills blank values. Existing Accounts remain blank until a permitted user sets a value.
- Permission-set assignments are org data. The package installs `Account_Tier_Edit` but does not assign it to users. Manual assignments may diverge from profile membership after a user update.

**Access and security**

- Inventory profiles of all users who can view Account, including users whose Account access comes from a permission set. Give each such profile read access to `Account.Tier__c` in Setup. Keep field edit off those profiles except System Administrator.
- Set `Account.Tier__c` read and edit permissions on `Account_Tier_Edit`. Assign it only to active users whose current profile is Sales Manager. Audit assignments against the current active Sales Manager user list at release and after every membership change. Remove assignments when a user leaves the profile; add one when an active user joins. Manual review does not enforce the rule during the interval between a profile change and assignment update. Salesforce's documented User Access Policies may grant and remove permission sets on user create or update using profile criteria in supported editions. Verify availability, exact criteria, actions, ordering, and profile-entry and profile-exit behavior in this target org before treating that as a dependable mechanism.
- Audit all other permission sets, permission set groups, and profiles for `Tier__c` edit grants. Remove or avoid grants that would let another profile's user edit. Salesforce permissions add together; a read-only profile setting does not cancel another edit grant.
- Field edit access does not replace Account object edit permission or record-level access. Use test Accounts that the Sales Manager and System Administrator users can edit. Verify real profile names and user assignments. Enumerate and test every distinct effective profile, permission-set, and permission-set-group combination among Account viewers, including users with multiple grants.

**Integrations**

- No integration or automation is requested. API clients can read the field only if their Salesforce user has Account and field read access. An update needs Account and field edit access plus record access.

**Operations**

- Deploy the field, permission set, and approved view metadata through the work-item package to the sandbox. Configure profile field permissions in Setup after the field exists. Assign `Account_Tier_Edit` to active Sales Manager users and test a dependable profile-tied assignment process. Record profiles, assignments, the effective-access matrix, and manual release steps for the owner. Agents do not deploy to or change production.
- Review assignments whenever users join or leave the Sales Manager profile. Recheck baseline read and unwanted edit grants when a profile or permission set changes Account access. This option has ongoing assignment work.

#### Tradeoffs and risks

| Tradeoff or risk | Effect and response |
| --- | --- |
| Manual `Account_Tier_Edit` assignments do not follow profile membership at the moment it changes. | A missed addition blocks an approved user; a missed removal leaves an unwanted edit grant. Option B is conditional and not recommended on manual assignments alone. Verify a supported, configured User Access Policy or another dependable mechanism in the target org and test both profile entry and exit before selecting it. |
| Profile baseline read and System Administrator edit settings are manual and absent from source control. | Record Setup steps and verify them in each target org. The metadata package alone does not complete access configuration. |
| Permissions from profiles and permission sets add together. | Another edit grant could break R-01. Audit every route to field edit access, then test a non-manager Account viewer. |
| The exact position of Rating in `Account Layout` is not yet verified. | Retrieve the layout, insert Tier immediately after Rating in the same column, and review the diff and rendered record. |
| Account viewers may have different layout assignments or Dynamic Forms pages. | Inventory every affected assignment and verify Tier directly below Rating in each actual view. Stop for scope correction if approved changes cannot achieve this. |
| The repository has no `force-app` source today; sandbox field existence is unresolved. | Inspect sandbox `Tier__c` first. Reuse or adjust it if present, or add it if absent. |

#### Build order

1. Inspect sandbox `Account.Tier__c` existence; inventory Account-viewing profiles, every effective permission combination, Sales Manager users, all affected Account layout and Lightning page assignments, Dynamic Forms, and `Account Layout`. Check User Access Policy availability and existing policies. Depends on sandbox read access. Complete when field status, access matrix, assignments, and Rating's actual position are recorded. Stop for scope correction if approved view changes cannot give every affected viewer the required placement.
2. Add or adjust `Account.Tier__c` custom field metadata with the approved values, order, optional setting, no default, description, and help text. Depends on step 1. Complete when metadata review shows every field setting without a duplicate field.
3. Add `Account_Tier_Edit` permission set metadata with field read and edit for `Account.Tier__c`, and no added Account object access. Depends on step 2. Complete when permission-set metadata contains only the intended permissions.
4. Add Tier directly below Rating on `Account Layout` and each other approved assigned view that needs it; create a narrow work-item package manifest. Depends on steps 1 to 3. Complete when diffs preserve unrelated content and every affected view can show the required placement.
5. Validate and deploy the narrow package to the sandbox using its alias from `.toolkit.json`. Depends on step 4. Complete when Salesforce accepts the metadata and the field appears on the intended layout. Do not target production.
6. Configure baseline field read on every Account-viewing profile and field edit on the System Administrator profile in sandbox Setup. Keep edit off other profiles. Assign `Account_Tier_Edit` only to active Sales Manager profile users. Audit all edit grants. If User Access Policies are available, configure profile-based grant and removal actions for the permission set and verify their action order and triggers; otherwise mark Option B unable to guarantee R-01 and do not recommend it. Depends on step 5. Complete only when assignments and effective grants match the approved rule and the target-org mechanism is verified.
7. Test saving Gold, Silver, Bronze, and blank as Sales Manager and System Administrator users. Verify read and edit for every affected profile and permission-set or group combination, including denied API edits for every non-manager combination. Test profile entry and exit and confirm the permission-set grant and removal take effect as needed. Check Tier below Rating in every actual assigned Account view. Depends on step 6. Complete only when R-01 is observed for the full affected set and assignment transitions.
8. Prepare the owner's production release instructions with the narrow package, manual profile settings, tested assignment mechanism, permission audit, and verification steps. Depends on step 7. Complete when the owner has reviewable commands and steps. Production deployment and configuration are owner actions.

## Option comparison

| Criterion | Option A: profile field permissions | Option B: dedicated edit permission set | Evidence or uncertainty |
| --- | --- | --- | --- |
| Tie edit access to Sales Manager profile | Direct profile setting; changes with profile membership | Requires assignment to follow profile entry and exit | Salesforce permissions are cumulative; target-org User Access Policy behavior is unverified. |
| Source-controlled access metadata | Field and layout only; profile access is manual | Field, layout, and permission set; assignments and baseline profile access are manual or policy-managed | Project prohibits profile XML deployment. |
| Ongoing work | Recheck access when profiles or grants change | Also maintain or verify permission-set assignments | Option B has more operating work. |
| Requirement fit | Recommended, subject to org inventory and checks | Conditional until a dependable assignment mechanism is proven | Both must verify each affected page and effective access combination. |

## Recommendation and owner decision

**Recommendation:** Option A. Profile field permissions directly express the approved profile-based edit rule and avoid the assignment gap in Option B. The cost is manual Setup and verification in each org.  
**Owner decision:** Option A, approved by Mike on 2026-09-27.  
**Reason for decision:** Mike's words: “Go with option A, approved.”

## Selected design

Option A — Profile field permissions. Build the `Account.Tier__c` field first. Deliver profile field access and Account page placement in a sub-item under WI-001 after the field exists. The sub-item follows the same approved R-01 and Option A design; the split changes build order, not the required end result.

## Build and verification plan

The selected option's Build order becomes the implementation plan after Mike chooses. Both options require a read-only sandbox inventory first, a narrow field and layout change, access configuration, tests for Gold, Silver, Bronze and blank, every relevant viewer and editor permission combination, and actual page placement. No sandbox deployment or data write is authorized by design approval alone.

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| R-01 and two built-in options | WI-001 requirements and Open Questions | 2026-09-27 | Owner decision | Recorded approval and Mike's answer. |
| Field security controls access; layout controls placement | https://help.salesforce.com/s/articleView?id=platform.managing_page_layouts_and_field-level_security.htm&language=en_US&type=5 | 2026-09-27 | Official documentation | Opened Salesforce Help page. |
| Profiles and permission sets grant permissions cumulatively | https://help.salesforce.com/s/articleView?id=sf.permissions_about_users_access.htm&language=en_US&type=5 | 2026-09-27 | Official documentation | Opened Salesforce Help page. |
| Permission sets are a supported field-permission mechanism | https://help.salesforce.com/s/articleView?id=platform.perm_sets_best_practices.htm&language=en_US&type=5 | 2026-09-27 | Official documentation | Researcher checked Salesforce Help. |
| User Access Policies may assign and revoke permission sets | https://help.salesforce.com/s/articleView?id=platform.perm_user_access_policies.htm&language=en_US&type=5 | 2026-09-27 | Official documentation | Design research; target-org behavior remains unverified. |
| Repository has no Account source metadata | `sfdx-project.json` and repository file search | 2026-09-27 | Project evidence | Read file and searched repository. |
| Sandbox connection, API 62.0, and Account Layout name | `sf org display -o tkv2-sbx` and Tooling Layout query | 2026-09-27 | Org observation | Read-only CLI output in this session; no stored receipt. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Gold is first, so make it the default. | Gold is highest, but no value is selected by default and blank remains valid. |
| R-01 | A layout read-only setting enforces the edit rule. | Use field permissions for access; keep the layout field editable where authorized users need to edit. |
| R-01 | One test user proves access for all viewers. | Inventory and verify every affected profile and permission combination. |
| R-01 | `Account Layout` placement proves every Account viewer sees it. | Check assigned layouts and Dynamic Forms for each affected viewer; verify actual placement. |
| Option B | Manual permission-set assignments always follow profile changes. | They can lag; select B only after the target org passes profile entry and exit tests with a dependable mechanism. |

## Notes

### Open design questions

None. Mike's design choice is requested below and is not a separate work-item Open Question.

### Design changes during the interview

| Date | Answer or decision | Section updated | Source and approval state |
| --- | --- | --- | --- |
| 2026-09-27 | Use built-in features and show two options; approve the listed review team. | Constraints and design options | Mike, approved way of working; design itself pending. |

### Current position and next step

Mike approved Option A on 2026-09-27. The field is built first; a sub-item handles access and page layout. The build starts with a read-only sandbox inventory and pauses for scope correction if the actual pages or permissions prevent R-01.

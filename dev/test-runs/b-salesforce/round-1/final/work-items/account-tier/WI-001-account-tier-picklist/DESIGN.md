---
work_item: WI-001
status: approved
approved: 2026-09-26 by Mike
---
# WI-001: Account Tier picklist — solution design

**Requirements:** WI-001  
**Design status:** Approved  
**Requirements checked:** WI-001 Requirements, approved by Mike on 2026-09-26  
**Last updated:** 2026-09-26  
**Design approval:** Approved by Mike on 2026-09-26

## What this design solves

Account viewers need to see an optional Tier value on an Account. Users with the Sales Manager profile and administrators need to set Gold, Silver, or Bronze. Other Account viewers must have read-only access. This design covers the field, its access, page placement, and verification. It does not change Account record sharing or existing Account object permissions.

## Requirements and design readiness

The approved requirements are ready for design. A read-only requirements review found two checks for implementation: identify every Account-viewer access path, including Account access from permission sets or groups, and identify the org's administrator users from actual active users and their profiles or administrative grants. The sandbox CLI currently returns no profile, user, or Account describe data, so those inventories are not verified yet.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Account Tier values and access | Finalized | Options A and B define values, field access, placement, and persona checks | Verify the actual Account-viewer and administrator groups in the sandbox. |
| R-02 — Field guidance | Finalized | Both options add description and help text | None. |

## What exists today

The local draft `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml` has the three restricted values and no default. It lacks `required`, `description`, and `inlineHelpText`. The draft `delivery/deployment/WI-001-account-tier/manual-steps.md` says to grant the sales team read and edit access, which conflicts with R-01. The project and package manifest still use the placeholder API version `XX.0`. No sandbox deployment or user access check is recorded.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Use Salesforce field-level security for Tier read and edit access. | Salesforce documentation, checked 2026-09-26 | Page placement alone cannot enforce R-01. |
| Constraint | Never deploy a profile from source. | `.claude/rules/permissions-source-control.md` | Option A uses documented Setup steps for profile field permissions. |
| Constraint | Mike approves the design and any sandbox deployment. | `AGENTS.md` and org safety rules | This proposal does not authorize metadata edits or deployment. |
| Assumption | Existing Account record and object access remain unchanged. | R-01, proposed interpretation | Tier access cannot grant access to an otherwise inaccessible Account. |
| Open verification | The sandbox's actual API version and access inventory are unavailable from current CLI output. | `sf org display`, `sf data query`, and `sf sobject describe`, 2026-09-26 | Verify before final source version, access steps, or sandbox validation. |

## Design options

### Option A — Field permissions on existing profiles

#### Approach

Inventory active users who can view Accounts, including access from profiles, permission sets, and groups. Give Tier read access through each such user's profile, or another existing grant that reaches that user. Give Tier edit access only to the Sales Manager profile and the verified administrator users. The administrator uses Setup to apply those field permissions; no profile file is deployed. Add Tier to each Account layout or Dynamic Forms page used by those viewers. Keep the field definition and deployment inventory in source control.

#### End-to-end behavior

1. A user who can see an Account opens its record and sees Tier, including when Tier is blank.
2. A Sales Manager profile user or administrator with Account record edit access can choose Gold, Silver, or Bronze and save.
3. Another Account viewer sees Tier but cannot change it. A user without Account access gains no Account access from this change.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Change the draft `Account.Tier__c` field; configure Tier field permissions for the inventoried profiles; place Tier on applicable Account pages. | Restricted values, optional field, and profile-based field access match the approved rule. | Check blank save, each value, effective read/edit access for every Account-viewer profile, and representative user sessions. |
| R-02 | Add `description` and `inlineHelpText` to `Account.Tier__c` using the approved R-02 wording. | Administrators and users receive the approved explanation. | Inspect deployed field details and help text. |

#### Technical shape

- **Components and files:** Change `Tier__c.field-meta.xml`; update `component-tracker.csv`, both package manifests, and WI-001 manual steps. Record the exact existing profiles and Account pages in the manual steps after a real sandbox inventory.
- **Data and state:** One Account picklist with `required=false`, Gold, Silver, Bronze, and no default. No backfill. Existing Accounts remain blank until an authorized editor sets Tier.
- **Access and security:** For every active user with effective Account read access, trace the profile, permission sets, and groups that grant it, then ensure effective Tier read access. Set Tier edit access for the Sales Manager profile and verified administrator users only. Identify admins from active-user profile and administrative grants; if this does not identify an unambiguous group, return to Mike before changing security. Review all permission sets and groups for unintended Tier edit access. Do not add Account object permissions. A layout must show Tier and must not mark it read-only for intended editors.
- **Integrations:** No new integration. Existing integrations that use other user permissions must be included in the access review if they can view Accounts.
- **Operations:** Admins repeat the profile and page checks in each target org. A future new Account-viewer profile needs Tier read access; a future Sales Manager profile user inherits the profile's Tier edit grant.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| A profile or page is missed. | That Account viewer cannot see Tier on the record. | Inventory active Account viewers, including permission set and group access, and page assignments before release; check each effective grant and page. |
| Another permission set grants Tier edit. | A non-manager can edit Tier. | Review effective user grants and remove unintended Tier edit grants before acceptance. |
| Manual org configuration differs from source. | Sandbox and production access may diverge. | Record exact steps and verification in the WI-001 deployment folder for Mike. |

#### Build order

1. Verify sandbox API version and inventory active Account viewers, their profiles and permission grants, administrator identities, existing Tier grants, and Account page assignments. Record the evidence. If the inventory changes the recommended approach, revise this proposed design and ask Mike again.
2. After design approval, correct the field XML and deployment inventory. Run local format and inventory checks.
3. Validate the work-item manifest against the sandbox. After Mike approves that sandbox deployment, deploy, apply Option A's manual access and page steps, and test each persona.
4. Present the checked result to Mike for result approval. Prepare a production handoff only after the deployment contents check.

### Option B — Field permission sets with managed assignments

#### Approach

Create a Tier read permission set for every Account viewer and a Tier edit permission set assigned only to Sales Manager profile users and administrators where needed. Keep assignments aligned with profile membership. Place Tier on the relevant Account pages. This follows Salesforce's general preference for permission sets but adds ongoing assignment work to preserve the approved profile rule.

#### End-to-end behavior

1. An Account viewer assigned the Tier read permission set sees Tier on the Account page.
2. A Sales Manager profile user or administrator assigned the Tier edit grant can change Tier when they can edit that Account.
3. Other Account viewers remain read-only. New users need the correct assignment before this behavior holds.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | `Account.Tier__c`, narrow Tier permission sets, assignments, and page placement. | The grants can represent read for viewers and edit for managers/admins if assignment coverage is maintained. | Reconcile assignments to active users and test the same personas as Option A. |
| R-02 | Add `description` and `inlineHelpText` to `Account.Tier__c` using the approved R-02 wording. | The field carries the approved guidance. | Inspect deployed field details and help text. |

#### Technical shape

- **Components and files:** Field XML, deployment inventory, new narrow permission set metadata, and manual assignment and page steps.
- **Data and state:** Same optional Account field and values as Option A.
- **Access and security:** Permission sets add Tier read or edit only. They do not add Account object permissions. Assignment coverage must exactly track Account viewers and Sales Manager profile users.
- **Integrations:** No new integration.
- **Operations:** Admins maintain assignments when users change profiles or join; permission set source must pass the project's fetch, check, and preflight rules before deployment.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| New or changed users lack the right assignment. | They may not see Tier or may retain Tier edit access after leaving Sales Manager. | Reconcile assignments whenever profile membership changes. |
| New permission sets expand deployment scope. | More components require review and preflight. | Fetch and preflight permission sets and inspect the exact deployment contents. |

#### Build order

1. Inventory existing profiles, permission sets, users, and pages; verify the API version.
2. Create narrow field permission sets and correct the field XML and manifests after design approval.
3. Validate, obtain Mike's sandbox deployment approval, deploy, assign sets, and verify users and pages.
4. Present evidence to Mike for result approval and prepare the production handoff.

## Option comparison

| Criterion | Option A | Option B | Evidence or uncertainty |
| --- | --- | --- | --- |
| Match to Sales Manager profile rule | Direct profile field grant | Requires maintained assignments | Approved R-01 names the profile. |
| Ongoing work | Update profile field access when profiles change | Maintain read and edit assignments for users | Salesforce permission sets are additive. |
| Source coverage | Field source plus manual profile steps | Field and permission set source plus manual assignments | Project prohibits profile deployment. |
| Current org fit | Needs profile and page inventory | Needs user, profile, set, and page inventory | Sandbox CLI did not return the inventory. |

## Recommendation and owner decision

**Recommendation:** Option A. It directly follows the approved Sales Manager profile rule and avoids ongoing assignment matching. Its cost is documented manual field permission and page setup in each org.  
**Owner decision:** Mike chose Option A on 2026-09-26.  
**Reason for decision:** Mike chose the profile field permissions approach. The exact grants remain subject to the sandbox access inventory.

## Selected design

Option A: keep `Account.Tier__c` as an optional, restricted Gold/Silver/Bronze picklist with no default, and add the approved description and help text. Configure field permissions on existing profiles through Setup after inventorying effective Account access; only Sales Manager profile users and verified administrators may edit Tier. Check every applicable Account page and effective grant. Do not deploy profile metadata. WI-001 will be split into field metadata and access setup sub-items.

## Build and verification plan

### Technical sequence

1. Inventory the sandbox API version, Account viewers, profiles, permission grants, administrators, and Account pages.
2. Correct the field XML and deployment inventory in the field metadata sub-item.
3. Record and apply the manual profile field permissions and page setup in the access setup sub-item after the necessary sandbox deployment approval.
4. Validate and check the resulting field behavior and effective access against R-01 and R-02, then present the result to Mike.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | Field metadata and sandbox create/edit checks | Blank allowed, no default, only Gold/Silver/Bronze offered | WI-001 history and deployment record |
| R-01 | Access inventory, effective grants, and user checks | Every Account viewer can see Tier; only Sales Manager profile users and admins can edit it when they can edit the Account | WI-001 deployment record |
| R-01 | Applicable Account page review | Tier appears on each applicable record page | WI-001 deployment record |
| R-02 | Field details and help text review | Description and help text match the approved behavior | WI-001 deployment record |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| Tier access requires field permissions; layouts serve page presentation. | https://developer.salesforce.com/files/accessibility/data_security/data_security_fields/index.html | 2026-09-26 | Official documentation | Opened and reviewed. |
| Profiles and permission sets can grant field access; permission sets add access. | https://developer.salesforce.com/workshops/admin-security-workshop/identity-and-access/2-security-hierarchy | 2026-09-26 | Official documentation | Opened and reviewed. |
| Permission set deployment does not assign it to users. | https://developer.salesforce.com/docs/platform/multiframework/guide/mfw-manage.html | 2026-09-26 | Official documentation | Opened and reviewed. |
| Mike approved optional Tier, no default, all Account viewers read, Sales Manager/admin edit, and field guidance. | WI-001 Requirements | 2026-09-26 | Owner decision | Work item records approval. |
| Profile files cannot be deployed from this project. | `.claude/rules/permissions-source-control.md` | 2026-09-26 | Project rule | Read this session. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Give the whole sales team Tier edit access. | Give edit only to Sales Manager profile users and admins; check all other Account viewers remain read-only. |
| R-01 | Test one viewer and assume everyone can see Tier. | Inventory every active Account viewer, including those granted Account access by permission sets or groups, and each page assignment; then test representative users and effective grants. |
| R-01 | Tier edit access alone lets a manager edit every Account. | Existing Account object and record access remain in force. |
| R-01 | Add Tier to one page and assume every Account viewer sees it. | Check every applicable layout or Dynamic Forms page. |

## Notes

### Open design questions

| Question | Affects | Decision needed from | Status | Next step |
| --- | --- | --- | --- | --- |
| Which option should WI-001 use? Recommendation: Option A. | Access design and build order | Mike | Answered, 2026-09-26: Option A | Split work and proceed with inventory. |
| Which active users can view Accounts, by what profile, permission set, or group, and which users are administrators? Which Account pages apply? | Exact manual steps and test coverage | Agent | Open | Obtain a real read-only inventory before finalizing build details. |
| What API version does the sandbox support? | Source and manifests | Agent | Open | Obtain a real org or official release response before validation. |

### Current position and next step

Mike chose Option A on 2026-09-26. Exact access steps depend on a real sandbox inventory. If the inventory changes the approach or leaves administrator identity unclear, return to Mike with a revised proposal before editing security. Verify the API version before finalizing metadata and validation.

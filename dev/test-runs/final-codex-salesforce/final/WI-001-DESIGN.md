---
work_item: WI-001
status: approved
approved: "2026-09-28 by Mike Rihm"
---

# WI-001: Add a Tier picklist field to Account — solution design

**Requirements:** WI-001, R-01 through R-04  
**Design status:** Approved  
**Requirements checked:** WI-001 approved 2026-09-28; independent review 2026-09-28  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike Rihm on 2026-09-28

## What this design solves

Sales Managers and system administrators assign Gold, Silver, or Bronze to an Account. Other people who can see that Account can read its Tier below Rating. New Accounts start with no Tier. Account ranking reports and changes to record access are outside WI-001.

## Requirements and design readiness

The approved requirements are ready to design. An independent requirements review found no material gap.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Account Tier ranking | Finalized | Both options add Account.Tier__c with ordered values and no default | None |
| R-02 — Field guidance | Finalized | Both options set description and help text | None |
| R-03 — Tier access | Finalized | Option A sets profile field permissions; Option B uses permission sets | Choose option |
| R-04 — Tier placement | Finalized | Both options insert Tier__c immediately after Rating in the same layout column | None |

## What exists today

The sandbox Account describe response lists Rating and no Tier__c. It lists only the Master record type. A read-only Layout query found one Account layout, `Account-Account Layout`. Its retrieved XML puts Rating in the second column of Account Information. A read-only Profile query lists Sales Manager, System Administrator, Sales User, and Read Only. No PermissionSet or FlexiPage records were returned by read-only queries. The repository has no `force-app/` source yet. These are sandbox observations, not proof of which record page each viewer sees or of production configuration. Extend the existing Account layout because it already holds Rating in the required column and no replacement is needed for R-04.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | The owner approved optional Gold, Silver, Bronze, profile-based edit access, and placement below Rating. | WI-001, approved 2026-09-28 | Both options must preserve these results. |
| Constraint | Profiles are excluded from source deployment. | `.claude/rules/permissions-source-control.md`, confirmed | Option A needs manual profile configuration in each org. |
| Constraint | Agents do not deploy to or change data in production. Sandbox deployment needs the owner's approval and execution in Codex. | `.claude/rules/salesforce-org-safety.md`, confirmed | Release steps must be handed to the owner. |
| Assumption | The sandbox's single Account layout and four profiles cover the intended viewers. | Sandbox queries, 2026-09-28; check again in each target org | Additional layouts or profiles must be included before release. |
| Constraint | Use Salesforce built-in field, layout, and field permission controls. | Design approach, proposed | No Flow, Apex, or custom UI is needed. |
| Assumption | The active Account record page shows the page layout through Record Detail. | Not yet observed; check during build | If Dynamic Forms controls field positions, update the active record page too. |

## Design options

### Option A — Profile field access in each org

#### Approach

Deploy the Account picklist field and the changed Account layout from source. Set Tier field permissions for each Account-viewing profile in Salesforce Setup after deployment. Sales Manager and System Administrator get read and edit; other Account-viewing profiles get read only. This ties the rule to the profile of current and future users. The profile permissions are recorded as manual deployment steps because this project excludes profile deployment. Verify the active Account record page for every viewer group and update its Dynamic Forms field placement if it does not use the layout.

#### End-to-end behavior

1. A Sales Manager or system administrator opens an Account and sees Tier directly below Rating.
2. That user selects Gold, Silver, or Bronze, or clears Tier, then saves. A new Account starts blank.
3. Another Account viewer sees the saved Tier but cannot edit it. A user without Account access does not gain access.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New `Account.Tier__c` picklist | Ordered values; no default; not required | Create blank Account; set each value; clear and save |
| R-02 | New field description and help text | Both are in the field definition | Inspect field metadata and Setup |
| R-03 | Changed profile field permissions in each org | Manager/admin edit; other viewers read only; Account record access stays separate | Check effective access and attempt edit as each persona |
| R-04 | Changed `Account-Account Layout`; active Account record page if needed | Tier follows Rating in the same rendered column | Inspect layout metadata and the page each viewer group sees |

#### Technical shape

- **Components and files:** New `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml`; changed `force-app/main/default/layouts/Account-Account Layout.layout-meta.xml`; an active Account record page only if it uses Dynamic Forms; manual profile steps in the WI-001 deployment folder. No profile files in source.
- **Data and state:** Single restricted Account picklist, Gold, Silver, Bronze in that order; optional; no default; no data migration. Description: "Sales team's ranking tier for an Account." Help text: "Select Gold, Silver, or Bronze to rank this Account. Leave blank if no Tier has been assigned."
- **Access and security:** Field permissions are read/edit for Sales Manager and System Administrator, read only for other profiles with Account visibility. Check other permission sets for any grant that would also permit Tier edits. Existing Account object and record permissions remain the boundary.
- **Integrations:** None changed.
- **Operations:** The owner applies and verifies manual profile settings in each target org. Recheck if profiles or Account layouts change.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Profile settings are manual in each org | A missed step hides Tier or gives wrong edit access | Numbered steps and effective-access checks for every Account-viewing profile |
| Another permission set could grant edit access | A non-manager could edit Tier | Inspect effective permissions and any grant for Tier before acceptance and release |
| A target org has more Account layouts or profiles | Some viewers may not see Tier or may get wrong access | Inventory the target org and extend the release steps before deploy |
| The active Account record page uses Dynamic Forms | Layout XML alone does not place Tier on that page | Inspect the rendered page and its assignment; add Tier below Rating on the active record page if needed |

#### Build order

1. Create the field with values, description, help text, and no default; inspect metadata.
2. Add Tier immediately below Rating in the Account layout; inspect layout metadata and active Account record page assignments. Add Dynamic Forms placement where needed.
3. Prepare manual profile steps and verify effective access in sandbox after approved deployment.
4. Run acceptance checks for blank, all values, edit rights, read rights, and placement.

### Option B — Permission sets assigned by user

#### Approach

Deploy the same field and Account layout. Create Tier read and Tier edit permission sets in the sandbox after the owner's approval, fetch and verify them with `permsets.py fetch`, then add those verified files to source. Assign Tier read to every Account viewer and Tier edit only to users whose profiles are Sales Manager or System Administrator. New users need assignments, and changing a user's profile requires an assignment review. This follows Salesforce's recommendation to manage field permissions with permission sets but adds ongoing user administration. Verify the active Account record page and update Dynamic Forms placement if needed.

#### End-to-end behavior

1. An administrator assigns the Tier read permission set to every Account viewer, then assigns Tier edit to each Sales Manager and system administrator.
2. A manager or administrator sets or clears Tier on an Account. A newly created Account starts blank.
3. Other Account viewers see Tier without edit access; access to Account records still depends on existing permissions.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New `Account.Tier__c` picklist | Ordered values; optional; no default | Create blank Account; set each value; clear and save |
| R-02 | New field description and help text | Both are in field metadata | Inspect field metadata and Setup |
| R-03 | New Tier read and edit permission sets and assignments | Assigned managers/admins edit; other assigned viewers read | Compare assignments to profiles; check effective access and attempt edit |
| R-04 | Changed `Account-Account Layout`; active Account record page if needed | Tier follows Rating in the same rendered column | Inspect layout metadata and the page each viewer group sees |

#### Technical shape

- **Components and files:** The same field and layout as Option A, including any needed Dynamic Forms page; new `Account_Tier_Read` and `Account_Tier_Edit` permission sets fetched from the sandbox with `permsets.py fetch`; assignment steps in the deployment folder.
- **Data and state:** Same Tier values as Option A; no default; Tier may be blank. Permission set assignments are per-user org records.
- **Access and security:** Read set grants Tier read; edit set grants Tier read/edit. Neither should add Account record access. Confirm Account object edit rights separately for editors. Existing grants must be audited, as permissions can combine.
- **Integrations:** None changed.
- **Operations:** Assign both sets for new and moved users according to their profile. An assignment audit is needed whenever a user's profile changes. Fetch and preflight permission sets under the project's permission-source rule before edits or deployment.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Assignments can fall behind profile changes | A manager lacks edit or a former manager retains it | Document and check assignment changes whenever a profile changes |
| Permission sets add deployment and review work | More metadata and preflight checks | Follow `tools/permissions/PERMISSIONS-RUNBOOK.md` |
| A non-manager has another edit grant | Tier remains editable despite intended assignments | Audit effective access and remove the conflicting grant with owner approval |

#### Build order

1. Create the field and Account layout change; inspect both.
2. With the owner's approval, create the two permission sets in the sandbox, fetch them with `permsets.py fetch`, and verify their files under the permission-source rule.
3. Prepare assignment steps and apply them in sandbox after approved deployment.
4. Run the same acceptance checks as Option A, including a changed-profile assignment check.

## Option comparison

| Criterion | Option A | Option B | Evidence or uncertainty |
| --- | --- | --- | --- |
| Current and future users with the named profiles | Profile settings apply with the profile | Assignments must be maintained per user | Salesforce field access guidance; user administration process is not recorded |
| Source control | Field and layout in source; profile settings manual | Field, layout, and permission sets in source; assignments manual | Project excludes profile deployment |
| Deployment work | Fewer components, manual checks per profile | More components and permission preflight, manual assignments | Project permission-source rule |

## Recommendation and owner decision

**Recommendation:** Option A. It follows the owner's profile-based rule for future users without relying on individual assignments. Its cost is manual profile configuration and verification in each org.  
**Owner decision:** Mike Rihm approved Option A in chat on 2026-09-28 and directed that access and page layout be a sub-item under WI-001.  
**Reason for decision:** The owner gave no reason for the option choice.

## Selected design

Option A is selected. WI-001 builds the Account Tier field for R-01 and R-02. Its child builds access and page placement for R-03 and R-04. The child inherits this design approval and has its own result approval.

### End-to-end flow

1. The Account Tier field offers Gold, Silver, and Bronze in that order, with no default and no required value.
2. The child places Tier directly below Rating and configures profile field access in each org.
3. A Sales Manager or system administrator can edit Tier on an Account they can access. Another Account viewer can read it but cannot edit it.

### Components and responsibilities

WI-001 owns `Account.Tier__c` field metadata, its description and help text, and the field package and checks. The child owns the Account layout, any required Dynamic Forms placement, manual profile steps, and access and placement checks. Neither item changes Account record access.

### Data, access, and integration details

Use the optional restricted Account picklist with Gold, Silver, and Bronze in that order, no default, and the description and help text stated in Option A. The child grants Tier read and edit to Sales Manager and System Administrator profiles, and read only to other Account-viewing profiles. Profile configuration is manual in each org; profiles are not deployed from source. Check for other permission sets that might grant edit access. No integration or data migration is planned.

### Edge cases and failure behavior

Tier can be cleared and a new Account starts blank. If another grant lets a non-manager edit Tier, resolve it before accepting the child's access result. If an active Account record page uses Dynamic Forms, the child must put Tier directly below Rating on that page. Inventory additional profiles and layouts in each target org before release.

### Release and ongoing operation

The owner runs any sandbox deployment after approving that deploy. Agents do not deploy to or change data in production. WI-001 releases the field first; the child then releases page placement and carries manual profile steps. Verify the field, access, and rendered placement after the relevant release steps.

## Diagrams

No diagram is needed for one field, its access settings, and its page placement.

## Build and verification plan

### Technical sequence

1. Build WI-001's field metadata, narrow package, and checks for R-01 and R-02.
2. Build the child's Account layout or Dynamic Forms change and its manual profile steps for R-03 and R-04.
3. Validate each narrow package in the sandbox. Request approval before handing the owner any sandbox deployment command.
4. After the owner deploys and completes manual steps, check the field, effective access, and rendered placement against the four requirements. Record separate result approvals for parent and child.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | Inspect field and exercise create, set, clear | Gold, Silver, Bronze in order; no default; Tier may be blank | WI-001 test plan |
| R-02 | Inspect field metadata and Setup | Description and help text present | WI-001 test plan |
| R-03 | Check effective field access and attempt edits as manager, admin, and other viewer | Only manager and admin can edit; Account visibility unchanged | WI-001 test plan |
| R-04 | Inspect layout XML, active record page assignments, and each viewer group's Account page | Tier directly below Rating on the rendered page | WI-001 test plan |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| Gold, Silver, Bronze; optional; access and placement | WI-001 approved requirements | 2026-09-28 | Owner decision | Work item approval recorded |
| The sandbox has Rating, one Account layout, four named profiles, and no Tier | `sf sobject describe`, Layout/Profile/PermissionSet queries, and retrieved layout in `tkv2-sbx` | 2026-09-28 | Project evidence | Read-only commands this session |
| Field permissions control read/edit beyond the layout | https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields | 2026-09-28 | Official documentation | Opened current Salesforce Trailhead page |
| Permission sets add access to profile settings | https://developer.salesforce.com/workshops/admin-security-workshop/identity-and-access/2-security-hierarchy | 2026-09-28 | Official documentation | Opened current Salesforce developer page |
| Picklist values can be ordered and a default is optional | https://trailhead.salesforce.com/en/modules/picklist_admin/units/picklist_admin_start | 2026-09-28 | Official documentation | Opened current Salesforce Trailhead page |
| Account layouts and record pages arrange fields | https://trailhead.salesforce.com/content/learn/projects/customize-a-salesforce-object/create-account-page-layouts | 2026-09-28 | Official documentation | Opened current Salesforce Trailhead page |
| Dynamic Forms can control field placement instead of the page layout | https://help.salesforce.com/s/articleView?id=platform.lightning_pages_or_page_layouts_when_to_choose.htm&language=en_US&type=5 | 2026-09-28 | Official documentation | Independently checked by design critic; verify active pages during build |
| Profiles must not be deployed from source in this project | `.claude/rules/permissions-source-control.md` | 2026-09-28 | Project rule | Read this session |
| Metadata version | `sfdx-project.json` and `sf org display -o tkv2-sbx` | 2026-09-28 | Project evidence | Both report API version 62.0; live Salesforce atlas TOC unavailable |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Make Gold the default because it is first | No default; new Account starts blank |
| R-01 | Sort values alphabetically | Preserve Gold, Silver, Bronze order |
| R-03 | Make Tier editable by all Account editors | Only Sales Manager and system administrators edit Tier; check effective access |
| R-03 | Grant Account record access through Tier permissions | Tier does not change Account object or record access |
| R-04 | Put Tier beside Rating in the next column | Insert Tier after Rating in the same layout column |
| R-04 | Assume layout XML proves placement on every active record page | Inspect each viewer group's rendered page; if Dynamic Forms is active, place Tier after Rating there |
| Option B | Assume profile membership automatically assigns permission sets | Assign and audit permission sets for each user and every profile change |

## Notes

### Open design questions

None. Option A is selected.

### Design changes during the interview

On 2026-09-28, the owner approved Option A and directed that access and page layout be delivered by a child under WI-001. The split assigns R-03 and R-04 to that child while WI-001 builds the field for R-01 and R-02.

### Current position and next step

Option A covers R-01 through R-04. Create the child for R-03 and R-04, then plan the field and child builds separately.

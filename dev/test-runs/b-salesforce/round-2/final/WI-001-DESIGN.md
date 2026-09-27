---
work_item: WI-001
status: approved
approved: 2026-09-27 by Mike
---

# WI-001: Add Account Tier picklist — solution design

**Requirements:** WI-001, R-01 through R-03  
**Design status:** Approved  
**Requirements checked:** WI-001 Requirements, approved by Mike 2026-09-27  
**Last updated:** 2026-09-27  
**Design approval:** Approved by Mike on 2026-09-27

## What this design solves

Sales users need to rank Accounts as Gold, Silver, or Bronze. This design adds an optional Account Tier field, limits who can edit it, and shows it on the main Account page layout. Reports, automation, and other layouts are outside WI-001.

## Requirements and design readiness

The approved requirements are ready for design. The effective access rule means permission sets and override permissions must be checked as well as profiles. The actual layout assignment must be verified before implementation.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Rank accounts by Tier | Finalized | Option A field definition | Verify API name is free |
| R-02 — Control who can edit Tier | Finalized | Option A field access and audit | Verify effective grants |
| R-03 — Show Tier on main Account page layout | Finalized | Option A layout placement | Verify assignment and page mechanism |

## What exists today

The sandbox Account describe result lists no Tier field and one Master record type. A Tooling API query lists one `Account Layout`. The project and sandbox report API version 62.0. There is no `force-app` source yet. A metadata retrieve returned success without files. Queries intended for layout assignments and permission sets returned Profile rows that did not match the requested columns. These results do not establish the layout assignment or effective user access. The complete layout and Lightning page configuration remain unverified.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Gold, Silver, Bronze in order; optional; no default | WI-001 R-01, approved | Three values, no blank value, required false |
| Constraint | Only Sales Manager profile users and system administrators may edit; other Account viewers read | WI-001 R-02, approved | Check effective access, including additive grants and overrides |
| Constraint | Main Account page layout only | WI-001 R-03, approved | Identify assigned layout before editing |
| Constraint | Never CLI-deploy a profile; permission-set edits require fresh fetch and preflight | Project rules | Document profile access as manual steps; use permission-set procedure if needed |
| Constraint | Sandbox deployment needs separate owner approval; no agent production deployment | Project rules | Prepare package and validation before any deployment |
| Assumption | `Account.Tier__c` is available and `Account Layout` is the main assigned layout | Unverified | Confirm before build; revise design if false |

## Design options

### Option A — Salesforce Account picklist and field access

#### Approach

Create `Account.Tier__c` as a restricted, single-select picklist with Gold, Silver, and Bronze in that order. Leave it optional with no default. Add description and help text. Place it on the verified main Account layout. Configure field-level security for reading and editing, then audit permission sets and override permissions for effective access.

#### End-to-end behavior

1. A user who can view an Account opens its main page and sees Tier, including a blank value.
2. A Sales Manager profile user or system administrator who can edit the Account selects Gold, Silver, Bronze, or blank and saves.
3. Another Account viewer sees Tier but cannot edit it. Account object and record access continue to determine which Accounts each user can view.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New `Account.Tier__c`; three ordered values; required false; no default; description “Sales priority tier assigned to an account.”; help text “Select Gold, Silver, or Bronze to show this account’s sales priority. Leave blank if no tier has been assigned.” | Stores one value or null and documents its purpose | Inspect source and user interface; save a new Account blank, each value, and blank again |
| R-02 | Field-level security settings, existing Account access, and audit of permission sets, groups, and override permissions | Gives permitted users edit access while other Account viewers have read access | Check effective access for both editor populations, other viewers, and a user without Account record access |
| R-03 | Change the verified main Account layout only | Puts Tier on the requested page | Inspect layout assignment and page; compare other layouts |

#### Technical shape

- **Components and files:** Add `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml`; change the verified main layout file under `force-app/main/default/layouts/`. Prepare WI-001 deployment manifest and manual profile access steps through `sf-component-tracker`. If a permission set needs change, follow `tools/permissions/permsets.py` fetch and preflight.
- **Data and state:** Tier is Gold, Silver, Bronze, or null. Existing Accounts remain blank. No backfill.
- **Access and security:** Visible and editable for permitted profiles; visible and read-only for other Account viewers. Audit additive grants and override permissions. Field access never grants Account record access.
- **Integrations:** None requested.
- **Operations:** Record changes and access checks. Reverse layout and access settings if needed; deleting a populated field requires a separate decision.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Additive permission grant allows an excluded user to edit | Unverified; fails R-02 | Audit effective grants and resolve any conflict before acceptance |
| The returned layout is not assigned, or Dynamic Forms controls display | Unverified; field may not appear | Verify assignment and page configuration before editing |
| `Tier__c` already exists outside the describe result | Unverified; source could collide | Recheck target metadata before build |
| Profile access requires manual configuration | Certain under project rule; affects release steps | Document exact settings and verify them in sandbox |

#### Build order

1. Verify the field name, assigned main layout and page mechanism, profiles, permission sets, groups, and overrides.
2. Add field source and edit only the verified layout; create the narrow manifest and review its contents.
3. Prepare profile access steps and resolve any additive grants. Request separate owner approval before sandbox deployment.
4. Apply the authorized sandbox change, run acceptance checks, and present evidence for owner result approval.

## Recommendation and owner decision

**Recommendation:** Option A uses Salesforce’s built-in field, layout, and access controls. Its main cost is the effective-access audit and manual profile setup.  
**Owner decision:** Mike approved Option A and the proposed field text on 2026-09-27. Access and page layout delivery will be a sub-item under WI-001.  
**Reason for decision:** Mike chose Option A; the field text is acceptable.

## Selected design

Option A, approved by Mike on 2026-09-27. WI-001 delivers the field; a sub-item delivers access and page layout.

### End-to-end flow

Option A describes the approved user flow.

### Components and responsibilities

| Component or file | New, changed, or reused | Responsibility | Requirement IDs |
| --- | --- | --- | --- |
| `Account.Tier__c` | Proposed new | Store optional Tier and guidance | R-01 |
| Verified main Account layout | Proposed changed | Show Tier | R-03 |
| Profile access and effective-grant inventory | Proposed changed and reviewed | Restrict editing | R-02 |
| WI-001 manifest and manual steps | Proposed new | Isolate and document release | R-01 to R-03 |

### Data, access, and integration details

Option A defines the approved data and access model. No integration is proposed.

### Edge cases and failure behavior

| Situation | Expected behavior | How it will be checked |
| --- | --- | --- |
| New Account has no Tier | Save succeeds with null Tier | Create and reload |
| Permitted editor clears Tier | Save succeeds with null Tier | Clear and reload |
| Other viewer attempts editing | Tier cannot be edited | User and effective-permission checks |
| User lacks Account access | Account and Tier remain inaccessible | Existing sharing check |
| Page uses another layout or Dynamic Forms | Pause layout edit until page mechanism is known | Inspect before build |

### Release and ongoing operation

Approved order: field and verified page metadata, manual profile settings, effective-access check. There is no data migration. Record sandbox results and hand production steps to the owner.

## Diagrams

No diagram is needed for this single-field change.

## Build and verification plan

### Technical sequence

1. Record verified metadata, layout assignment, page configuration, and effective access in WI-001.
2. Build field and layout source at project API version 62.0; prepare narrow manifest and check deployment contents.
3. Prepare profile access steps; request separate owner authorization before sandbox deployment.
4. Check R-01 through R-03 in sandbox and record evidence.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 — blank and values | Create blank Account; save Gold, Silver, Bronze, then blank | Saves succeed; order and no default correct | WI-001 test record |
| R-01 — guidance | Inspect source and user interface | Description and help text present | Field source and WI-001 |
| R-02 — allowed editors | Check administrator and Sales Manager users who can edit Account | Both can set and clear Tier | WI-001 access matrix |
| R-02 — other viewers | Check other profiles and additive grants | Tier readable, not editable | WI-001 access matrix |
| R-03 | Inspect assigned main layout and page | Tier visible; no other layout changed | WI-001 layout evidence |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| R-01 to R-03 | WI-001 WORK-ITEM.md | 2026-09-27 | Owner decision | Requirements approval recorded |
| Picklist values, default, guidance, and page placement | https://help.salesforce.com/s/articleView?id=sf.fields_creating_picklists.htm&language=en_US&type=5 | 2026-09-27 | Official documentation | Read this session; sandbox check pending |
| Field visibility and read-only settings | https://help.salesforce.com/s/articleView?id=modifying_field_access_settings.htm&language=en_US&type=5 | 2026-09-27 | Official documentation | Researcher checked |
| Field access versus layout | https://help.salesforce.com/s/articleView?id=platform.managing_page_layouts_and_field-level_security.htm&language=en_US&type=5 | 2026-09-27 | Official documentation | Researcher checked |
| Additive permissions and override permissions | https://help.salesforce.com/s/articleView?id=sfdo.ac_security_permission_sets.htm&language=en_US&type=5 and https://help.salesforce.com/s/articleView?id=platform.customize_fieldaccess.htm&language=en_US&type=5 | 2026-09-27 | Official documentation | Researcher and main agent checked; actual grants unverified |
| Sandbox Account and layout observations | `sf sobject describe`, `sf data query`, `sf project retrieve start`; `sfdx-project.json` | 2026-09-27 | Project and sandbox evidence | Read-only CLI; retrieval and assignment limitations stated above |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Add a “Blank” choice or default Bronze | Null is allowed; exactly three values and no default |
| R-02 | Profile read-only settings alone prove the restriction | Audit effective permission sets, groups, and overrides |
| R-02 | Grant Account access to everyone so Tier can be read | Existing Account access remains in force |
| R-03 | Change every layout | Change only the verified main layout |
| What exists today | Treat returned Profile rows as verified assignment or permission-set inventory | Those queries established neither |
| Recommendation | Treat the approved approach as a pending choice | Mike approved Option A on 2026-09-27 |

## Notes

### Open design questions

| Question | Affects | Decision needed from | Status | Next step |
| --- | --- | --- | --- | --- |
| Which layout and page mechanism serve the main Account page? | R-03 | Agent verification | Open | Inspect before build |
| Which effective grants affect Tier? | R-02 | Agent verification | Open | Inventory before build |
| Is `Account.Tier__c` unused? | R-01 | Agent verification | Open | Check target metadata |
| Does Mike approve Option A and the proposed field text? | Design | owner | Answered 2026-09-27 | Mike approved Option A and the field text |

### Design changes during the interview

| Date | Answer or decision | Section updated | Source and approval state |
| --- | --- | --- | --- |
| 2026-09-27 | Initial built-in design proposed | All sections | WI-001 requirements |
| 2026-09-27 | Mike approved Option A and the proposed field text; access and layout become a sub-item | Recommendation and selected design | Owner approval |

### Current position and next step

Requirements and Option A are approved. The access and page layout work will be delivered by a sub-item under WI-001. Before building, verify effective access and the assigned layout; revise the design if the actual configuration changes the component scope.

---
work_item: WI-001
status: approved
approved: "2026-09-28 by Mike Rihm"
---

# WI-001: Add a Tier picklist field to Account — solution design

**Requirements:** WI-001  
**Design status:** Approved  
**Requirements checked:** WI-001 requirements approved 2026-09-28; independent requirements check 2026-09-28  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike Rihm on 2026-09-28

## What this design solves

The Acme sales team needs to assign Gold, Silver, or Bronze to an Account so it can rank that Account. The field must remain optional, show who can edit it, and appear below Rating. This item ends with Tier assignment; it does not add a sorted list view or report.

## Requirements and design readiness

The owner approved R-01 through R-04 on 2026-09-28. A separate requirements analyst found no material gap. Exact field text is a design choice and is proposed below.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Assign Account Tiers | Finalized | Option A: `Account.Tier__c` | None |
| R-02 — Explain the Tier field | Finalized | Option A: field description and help text | None |
| R-03 — Control who can edit Tier | Finalized | Option A: profile field permissions and effective access check | Target org inventory is a design gate before build |
| R-04 — Show Tier on the Account page layout | Finalized | Option A: Account Layout change | Assigned page check is a design gate before build |

## What exists today

On 2026-09-28, the `tkv2-sbx` Account describe showed Rating and no Tier field. The sandbox has Sales Manager, System Administrator, Sales User, and Read Only profiles, and a layout query returned one Account Layout. These reads do not establish all effective permissions or the rendered Lightning page. No `force-app/` source directory exists yet. Both the sandbox org display and `sfdx-project.json` report API version 62.0.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Tier is optional, has no default, and offers Gold, Silver, Bronze in that order | WI-001 R-01; approved 2026-09-28 | No required rule, automatic value, or ranking report |
| Constraint | Sales Manager and system administrators edit; other Account viewers read only | WI-001 R-03; approved 2026-09-28 | Check effective field access for every affected user group |
| Constraint | Profile files are excluded and must not be deployed by CLI | `.claude/rules/permissions-source-control.md`; project rule | Profile field permissions need numbered manual release steps |
| Constraint | Codex hands sandbox and production deploy commands to the owner | `.claude/rules/salesforce-org-safety.md`; project rule | The owner executes any deployment |
| Design choice | Use Salesforce configuration, without custom code | WI-001 Notes > Decisions and context; agent approach, 2026-09-28 | One focused option is proposed |
| Assumption | Existing Account Layout is the page layout that users see | Sandbox layout query only; unverified | Confirm assignments before build; revise the design and seek approval again if false |

## Design options

### Option A — Account Tier with profile field permissions

#### Approach

Create one optional, restricted Account picklist, `Tier__c`, with values Gold, Silver, Bronze in that order and no default. Give it a description and help text, then put it directly below Rating on the existing Account Layout. Set field permissions so Sales Manager and System Administrator can read and edit Tier, while every other Account viewer can read it only. Before building, inventory effective access from profiles, permission sets, permission set groups, and elevated system permissions, and check the assigned Account record page. This option proceeds only when those checks confirm that the stated field permissions and Account Layout change cover the actual users and page. Otherwise, revise the design and seek owner approval again.

#### End-to-end behavior

1. A Sales Manager or System Administrator opens an Account they can edit and chooses Gold, Silver, Bronze, or blank for Tier. The field appears directly below Rating on Account Layout.
2. Salesforce saves the chosen value on the Account. A new Account starts with no Tier selected. The picklist presents Gold, Silver, Bronze in that order.
3. Another person who can see that Account sees Tier but cannot change it. A person without Account access gains no access from this change. If the final permission inventory finds an additional edit grant, resolve that grant and repeat the access checks before release.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New restricted `Account.Tier__c` picklist with local values Gold, Silver, Bronze in order; optional and no default | Stores one approved rank or blank on each Account and rejects other values | As an authorized editor, confirm a new Account starts blank; inspect order; save and reload each value and blank; check that an invalid API value is rejected |
| R-02 | Field description: `Ranks this Account as Gold, Silver, or Bronze for the Acme sales team.` Help text: `Choose Gold, Silver, or Bronze to rank this Account. Leave blank if no tier is assigned.` | Explains purpose and optional use | Inspect field definition and help text on Account page |
| R-03 | Profile field permissions and effective access audit for every Account viewer, including people whose Account access comes from a permission set | Approved profiles edit; other Account viewers read only | Test Sales Manager, System Administrator, and other Account viewers; inspect effective grants before building and after release |
| R-04 | Changed Account Layout, with `Tier__c` directly below `Rating` in the same column, after confirming it controls the assigned Account page | Places Tier where approved | Confirm page and layout assignment before building; inspect rendered field order after release |

#### Technical shape

- **Components and files:** Add `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml`. Retrieve Account Layout and make a narrow change to its layout item order. Use the WI-001 deployment package for the field and layout. Profile metadata stays out of source and CLI deployment. Numbered manual field-permission steps cover every verified profile.
- **Data and state:** `Tier__c` is a restricted, single-select picklist with local values whose labels and API values are exactly `Gold`, `Silver`, `Bronze`; the active order is that sequence. Do not sort alphabetically or set a default. The field is optional. Existing Accounts remain blank until assigned. No backfill, list view, or report is in scope.
- **Access and security:** Before building, inventory every user group that can read Accounts, including users whose Account access comes from a permission set. Set Tier Read and Edit for Sales Manager and System Administrator profiles; give Tier Read without Edit to other Account viewers through their profiles or existing applicable permission sets. Do not grant Account object or record access. Audit permission sets, groups, and elevated permissions for extra Tier edit rights. Keep the layout item editable so approved editors are not blocked by the layout. Test effective access for representative users. If an unintended grant cannot be safely narrowed, stop the build and seek a revised design approval.
- **Integrations:** None added. Include Account integrations and automation users in the effective permission inventory.
- **Operations:** Record the prior Account Layout and field permissions for rollback. Recheck permissions when new profiles or permission sets are introduced. If Tier has stored values, deleting the field would remove the feature and require a data recovery decision.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| A permission set or elevated permission may give another profile Tier edit access | Unknown until the target org is checked; would violate R-03 | Audit effective permissions before build; seek revised design approval if a conflicting grant needs a different solution |
| Field creation may set unexpected access | Possible; users could edit Tier outside the approved profiles | Review every applicable profile and permission set after creation and test representative users |
| Account Layout deploy replaces that metadata component | Possible unrelated layout change could ship | Retrieve just before editing, compare the full diff, and run the project deployment contents check |
| A different assigned layout or Dynamic Forms page may control the visible Account page | Unknown from the current read; Tier may not appear below Rating | Inspect actual assignments before build; seek revised design approval if Account Layout alone does not control placement |

#### Build order

1. Before building, inventory target org Account fields, actual page and layout assignments, every Account viewer, and effective field-permission grants. Preserve the current layout and permission settings. Stop and revise the design for owner approval if Tier already exists, a conflicting edit grant needs a different solution, or Account Layout alone will not show Tier below Rating.
2. Create `Tier__c` with exact values and order, restricted value setting, optional setting, no default, description, and help text. Check field metadata against R-01 and R-02.
3. Retrieve and minimally edit Account Layout so Tier is directly below Rating. Inspect the full layout diff and rendered Account page.
4. Prepare the WI-001 deployment package and numbered manual profile steps. After the owner runs the sandbox deployment, check effective access for the two editor profiles and at least one other Account-reading profile.
5. Run R-01 through R-04 acceptance checks in the sandbox and record evidence. Repeat the target org inventory and layout comparison before any later release. The owner runs production changes.

## Recommendation and owner decision

**Recommendation:** Approve Option A for the configuration stated here, with its before-build inventory gate. It meets the four approved requirements with one field, one layout edit, and manual profile permissions when the actual Account page and effective grants match this design. Any different page or conflicting grant requires a revised design and another owner approval before building.  
**Owner decision:** Mike Rihm approved Option A on 2026-09-28 in this chat: “Yes, I approve Option A. Then split it: make the access and page layout part its own sub-item under WI-001, so WI-001 is just the field itself.”  
**Reason for decision:** Mike did not state a reason for choosing Option A. He directed that access and page layout be a separate sub-item.

## Selected design

### End-to-end flow

WI-001 creates the field. WI-002 configures access and page placement after checking effective grants and assigned pages. The owner runs sandbox and production deployments; each item is checked against the requirements it delivers.

### Components and responsibilities

Create the optional, restricted `Account.Tier__c` picklist with Gold, Silver, Bronze in that order, no default, and the description and help text in Option A. This direct work covers R-01 and R-02.

A sub-item under WI-001 covers R-03 and R-04. It inventories effective field access and assigned Account pages before metadata changes, then handles field permissions and places Tier directly below Rating where the verified page configuration requires it. Profile changes remain manual. If the inventory requires a different solution, revise the design and seek Mike’s approval before building that part.

### Data, access, and integration details

Existing Accounts keep a blank Tier until assigned. WI-002 checks all effective field grants, including permission sets and integration users. No Account object or record access is added, and no integration is introduced.

### Edge cases and failure behavior

Blank Tier is valid; values outside Gold, Silver, Bronze are rejected. If an assigned page or effective grant conflicts with Option A, stop metadata work and seek approval of a revised design.

### Release and ongoing operation

Keep field and layout packages with their respective work items. Record prior layout and access settings, and provide numbered manual profile steps. Recheck effective access when permissions change.

## Diagrams

The build order and responsibility split are stated in Selected design; no diagram is needed.

## Build and verification plan

### Technical sequence

Run Option A’s first inventory step before any metadata change. The access and page layout sub-item records the exact layout name, assigned page, Account-viewer access matrix, and effective permissions. Revise the design for another owner approval if the verified page or access does not match Option A. WI-001 builds only the field; the child handles access, layout, and its own deployment record. Verify the combined result against R-01 through R-04.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | Create and update an Account as an authorized editor; inspect picklist, reload, and submit an invalid value through an authorized API test | Blank is allowed and is the new-record state; Gold, Silver, Bronze appear in order and each value saves; an invalid value is rejected | WI-001 test plan and check history |
| R-02 | Inspect field definition and displayed help | Description and proposed help text are present | WI-001 test plan and check history |
| R-03 | Inspect effective field access; test approved editor profiles and another Account viewer | Approved editor profiles can edit, other Account viewers can only read, and no new Account access is granted | WI-001 test plan and check history |
| R-04 | Open Account pages for assigned users | Tier is directly below Rating on Account Layout | WI-001 test plan and check history |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| R-01 through R-04 are approved | WI-001 `WORK-ITEM.md` | 2026-09-28 | Owner decision | Read approval and requirements |
| Custom picklists can have specific values, a restricted value set, and an optional default | [Salesforce Trailhead: Guide to Creating Custom Picklists](https://trailhead.salesforce.com/en/modules/picklist_admin/units/picklist_admin_start) | 2026-09-28 | Official documentation | Opened source |
| Field permissions control visibility and editability beyond page layout display | [Salesforce Trailhead: Control Access to Fields](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields) | 2026-09-28 | Official documentation | Opened source |
| Salesforce access has object, field, and record layers; permissions may be additive | [Salesforce Architects: Trust](https://architect.salesforce.com/docs/architect/well-architected/guide/trust.html) | 2026-09-28 | Official documentation | Opened source |
| Profile metadata is excluded from source and CLI deployment | `.claude/rules/permissions-source-control.md` | 2026-09-28 | Project rule | Read rule |
| Sandbox has Rating but no Tier, four named profiles, one Account Layout, and API version 62.0 | `sf sobject describe`, `sf data query`, `sf org display`, `sfdx-project.json` | 2026-09-28 | Project evidence | Read-only commands and file read |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Make Tier required or use Gold as a default | Keep it optional with no default; verify a new Account starts blank |
| R-01 | Alphabetize values or add a ranking report | Keep Gold, Silver, Bronze in that order; assignment alone completes WI-001 |
| R-01 | Leave the picklist unrestricted because the screen shows only three values | Restrict the value set so API and automation cannot save another Tier value |
| R-03 | Set Tier read-only on Account Layout for everyone | Keep the layout item editable; use effective field permissions to restrict editors |
| R-03 | Configure only the four profiles seen in the sandbox or only users whose profile grants Account access | Inventory every Account viewer and additive grant, including Account access from permission sets |
| R-03 | Resolve an unexpected edit grant during release without revisiting the design | Stop before building; revise the design and seek owner approval if the grant needs a different solution |
| R-04 | Put Tier beside Rating or assume Account Layout controls a Dynamic Forms page | Verify the assigned page before building; revise the design and seek owner approval if Account Layout alone cannot provide the placement |

## Notes

### Open design questions

None. The target org effective-access and assigned-page inventory is a design gate before building. A finding that changes the stated components or access solution requires a revised design and owner approval.

### Design changes during the interview

None yet.

### Current position and next step

Mike Rihm approved Option A and asked for a split. Record the design approval, create the R-03/R-04 child, and run its effective-access and assigned-page gate before any metadata change.

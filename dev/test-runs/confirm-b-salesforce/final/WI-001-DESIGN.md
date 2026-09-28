---
work_item: WI-001
status: approved
approved: "2026-09-28 by Mike"
---

# WI-001: Account Tier — solution design

**Requirements:** WI-001  
**Design status:** Approved  
**Requirements checked:** WI-001 requirements, approved by Mike on 2026-09-28  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike on 2026-09-28

## What this design solves

Account users need a manually maintained Tier that shows the relative importance of an account. WI-001 adds the field first. WI-002 then places it on Account Layout and sets field access so Account viewers can read it while only Sales Manager and System Administrator profile users can edit it. The design does not change record access or automate Tier assignment.

## Requirements and design readiness

The four approved requirements are ready for design. Effective field access needs an audit of all profiles, permission sets, and permission set groups before configuration and verification; this is an implementation check, not a new owner choice.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Account Tier values and manual entry | Approved 2026-09-28 | Option A, field definition and acceptance checks | None |
| R-02 — Description and help text | Approved 2026-09-28 | Option A, approved wording and acceptance checks | None |
| R-03 — Read and edit access | Approved 2026-09-28 | Option A, access configuration and effective-access audit | None; audit required during build |
| R-04 — Account Layout placement | Approved 2026-09-28 | Option A, layout change and acceptance checks | None |

## What exists today

The connected sandbox is `tkv2-sbx` at API 62.0. An Account describe showed Rating and no Tier field; Account has one Master record type. An org query found Sales Manager, System Administrator, Sales User, and Read Only profiles and a layout named Account Layout. The project has no `force-app` source yet. The full metadata names, current layout XML, effective field grants, and existing object or record access have not yet been inspected. Those are build prerequisites, not assumptions about the org.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | The owner approved R-01 through R-04 and both final field texts on 2026-09-28. | WI-001 owner decisions | Build must match the values, texts, access, and layout position. |
| Constraint | Salesforce permissions are additive. | [Salesforce security hierarchy](https://developer.salesforce.com/workshops/admin-security-workshop/identity-and-access/2-security-hierarchy), checked in this session | Audit every applicable field grant; a restrictive profile setting alone cannot remove edit access granted elsewhere. |
| Constraint | Profile metadata retrieval can vary; permission sets are the preferred access component in source control. | [Salesforce source tracking guidance](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-source-tracking-source-tracking-profiles.html), checked in this session | No profile metadata is deployed by CLI. The profile access settings are configured and verified directly in the sandbox after separate owner approval for Salesforce Setup writes. |
| Constraint | Sandbox deployment and Salesforce Setup writes each need the owner's approval; production actions are excluded. | Project Salesforce safety rule, confirmed | Prepare source and validation first; present each org change for approval before execution. |
| Assumption | The retrieved Account Layout is the layout used for the intended Account users. | Layout query confirms its existence; assignment unverified | Verify assignments before acceptance; report an unmet requirement if a relevant user uses another layout. |

## Design options

### Option A — Metadata field and layout, direct profile access settings

#### Approach

Add `Account.Tier__c` as a restricted custom picklist with exactly three active values: Gold, Silver, and Bronze in that order. Use proposed wording for the field description and help text, with no default and no automation. Add Tier immediately after Rating in the field section of the retrieved Account Layout metadata. First verify the direct Salesforce Setup path for controlling field access on the relevant profiles. If that path works, configure profile field access after separate approval for the Setup changes, then audit permission set grants so effective access meets R-03. Do not deploy profile metadata.

#### End-to-end behavior

1. An Account user opens a record they can already access and sees Tier directly below Rating on Account Layout.
2. A user with the Sales Manager or System Administrator profile can choose Gold, Silver, Bronze, or blank and save. Other Account viewers can see the field and its value but cannot change it.
3. Saving a blank value leaves the field empty. No rule, flow, or trigger populates or changes Tier as part of this design.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New restricted `Account.Tier__c` custom picklist, exactly three active values Gold, Silver, Bronze in that order; not required; no default; no automation | Supports manual selection and clearing while rejecting other API values | Inspect field metadata; save each value and blank as an authorized user; attempt an out-of-list API value; inspect automation references |
| R-02 | Proposed description: `Manually assigned account importance tier.` Proposed help text: `Set by hand. Gold is the highest tier, then Silver, then Bronze.` | Gives admins a short purpose statement and users clear selection guidance; final wording is part of the design choice | Confirm wording with owner at design choice; retrieve and inspect field metadata; view help text in Account UI |
| R-03 | Field-level access on applicable profiles in Setup, subject to a verified control path and separate approval; audit permission sets, groups, and assignments; existing Account object and record access reused | All users who can see an Account can read Tier; only Sales Manager and System Administrator profile users can edit | Capture a prechange object and record access baseline; compare every applicable field grant and assignment; exercise Account UI as representative profiles; compare object and record access after the change |
| R-04 | Change only Account Layout metadata to place Tier immediately below Rating | Tier appears at the required point on the named layout | Inspect retrieved layout XML and Account UI as a user assigned Account Layout |

#### Technical shape

- **Components and files:** Create the Salesforce DX project structure if the repository lacks it. Add `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml`. Retrieve the actual Account Layout metadata name and edit its file under `force-app/main/default/layouts/`; do not infer the filename from the display label. Create a narrow WI-001 manifest containing only the new field and the named layout. Add manual access settings and checks to the work item's deployment steps; there is no profile metadata deploy.
- **Data and state:** `Account.Tier__c` is a nullable restricted picklist with exactly three active values, Gold, Silver, and Bronze in that order, and no default. Existing Accounts remain blank. No migration, backfill, validation rule, or automation is proposed. The proposed description is `Manually assigned account importance tier.` and the proposed help text is `Set by hand. Gold is the highest tier, then Silver, then Bronze.` Record the owner's final wording at the design choice.
- **Access and security:** Preserve current Account object and record permissions, taking a representative prechange baseline for comparison. Before relying on manual security changes, verify that Salesforce Setup exposes a direct, usable field-level access control path for the relevant profiles. Give read access to every profile whose users can see Accounts. Give edit access only to Sales Manager and System Administrator profiles. Inspect profiles, permission sets, permission set groups, and their user assignments before and after the change. If any grant conflicts with R-03, stop and bring the specific conflict to the owner; this design does not authorize changing unrelated grants. Test effective access, because Salesforce permissions are additive.
- **Integrations:** None. No API, flow, trigger, or external system is added. Existing integrations that access Account remain subject to their current record and field permissions.
- **Operations:** The sales team maintains Tier by hand. Keep the field and layout in the work-item package, retain a record of manual security settings, and provide a rollback plan that removes the layout placement and field after assessing any entered Tier values. Obtain separate owner approvals for sandbox deployment and Salesforce Setup writes; no production action is in this work item.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| A permission set or group grants Tier edit to a user outside the two allowed profiles. | Possible; R-03 would fail. | Audit assignments and effective permissions after field creation; stop and ask the owner how to resolve a conflicting grant. |
| The direct Setup path does not allow the intended profile field-access settings. | Unverified; R-03 could not be built as proposed. | Verify the control path before implementation. If unavailable, return the design for revision and owner choice. |
| Another Account layout is assigned to intended users. | Unverified; some users might not see the required placement. | Verify layout assignments before build and test the assigned layout. R-04 names Account Layout only; report any broader placement need as a requirement change. |
| Manual profile settings are outside source control. | Certain; a later org change could drift. | Record settings and an audit procedure in deployment steps, and verify them after deployment. Do not deploy profile XML. |
| Users enter Tier before a rollback. | Possible; field deletion could lose data. | Export or otherwise preserve populated Tier values before any rollback that deletes the field. |

#### Build order

1. Inspect the existing Salesforce project configuration, Account Layout metadata name and assignments, all Account-visible profiles, field permission grants and assignments, and current object and record access. Verify the direct Setup control path for profile field access. Bring any conflict or unavailable control path to the owner.
2. After the owner chooses the design and confirms field wording, create the narrow field and layout metadata, retaining the rest of the retrieved layout unchanged. Review the package contents and validate in the sandbox without deployment.
3. After owner approval for sandbox deployment, deploy only the WI-001 package. Obtain separate owner approval for Setup writes, then configure the approved profile field access. Recheck all effective grants and assignments.
4. Verify values, clearing, rejection of an out-of-list API value, final field text, UI placement, read and edit access, and unchanged Account object and record access; record evidence in the WI-001 test plan.

## Recommendation and owner decision

**Recommendation:** Option A. It keeps the field and layout reviewable in source while avoiding the known variability of profile metadata deployment. The owner should confirm the proposed description and help text when choosing the design. The main operating cost is keeping the manual field access settings documented and checked.  
**Owner decision:** Mike approved Option A, the proposed description and help text, and the scope on 2026-09-28. He directed that the field go first, with access and Account Layout in WI-002.  
**Reason for decision:** Mike's approval and sequencing request. The technical reasons for Option A remain in the recommendation.

## Selected design

### End-to-end flow

WI-001 adds the nullable, manually set Account Tier field with Gold, Silver, and Bronze in that order. WI-002 follows with effective field access and Account Layout placement. Each item has its own checks and owner review.

### Components and responsibilities

WI-001 owns `Account.Tier__c`, its field-only package, and R-01 and R-02 checks. WI-002 owns Account Layout metadata, direct Setup access settings and audit, and R-03 and R-04 checks. The approved parent requirements remain in WI-001.

### Data, access, and integration details

Tier has no default, can be blank, and has exactly three active restricted values: Gold, Silver, Bronze. Its description is `Manually assigned account importance tier.` Its help text is `Set by hand. Gold is the highest tier, then Silver, then Bronze.` No migration, backfill, automation, or integration is added. WI-002 gives Tier read access to Account viewers and edit access only to Sales Manager and System Administrator profile users, subject to an effective-grants audit.

### Edge cases and failure behavior

An unsupported Tier value must be rejected. If the direct Setup access path fails, a conflicting grant exists, or relevant users are assigned another layout, record the specific finding for owner review before changing unrelated security or layout components.

### Release and ongoing operation

Prepare and validate the field-only WI-001 package first. A sandbox deployment needs its own owner approval. WI-002 then prepares its own layout package and manual access steps. A later sandbox deployment and direct Setup writes each need separate owner approval. The sales team maintains Tier by hand.

## Diagrams

No diagram is needed; the field, layout, and access checks are described directly above.

## Build and verification plan

### Technical sequence

1. Retrieve or inspect the Account layout, its assignment, project configuration, all field grants and permission set assignments, and a representative baseline of Account object and record access. Verify the direct Setup control path for profile field access. Record actual metadata names and any conflicts.
2. Once the owner chooses the design and final field wording, create the restricted field and edit only the named layout. Prepare the narrow manifest and deployment steps. Review the package contents and run a sandbox validation without applying changes.
3. Once the owner approves deployment to the sandbox, deploy the package. Obtain separate approval for Setup writes, then set profile field permissions and audit effective access from all grant sources and assignments. Stop for an owner decision if a conflicting grant exists.
4. Run the acceptance checks and save results in the WI-001 test plan. Seek separate owner acceptance of the finished result.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | Inspect field metadata; edit an accessible Account as an authorized user; submit an out-of-list value through the API | Exactly Gold, Silver, Bronze are active and appear in order; field accepts each and blank; an out-of-list API value is rejected; new and existing Accounts start blank; no automation touches Tier | WI-001 test plan and retrieved metadata |
| R-02 | Compare field metadata and Account page help against the wording confirmed with the owner at design choice | Description and help text match their separately approved wording | WI-001 test plan and design decision |
| R-03 | Verify the direct Setup control path; inventory profiles, permission sets, groups, and assignments; compare prechange and postchange Account object and record access; test representative users for each Account-visible profile and relevant assignment | Every user who can see an Account can read Tier; only Sales Manager and System Administrator profile users can edit; existing Account object and record access remains | WI-001 test plan, baseline, and access audit |
| R-04 | Inspect layout metadata and view Account Layout as an assigned user | Tier is directly below Rating on Account Layout and no other layout was changed | WI-001 test plan and layout diff |
| Deployment scope | Review manifest and validation result | Only Tier field and Account Layout are in the metadata package; no profiles or unrelated components | WI-001 deployment record |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| R-01 through R-04 are approved by Mike; help text sentence is proposed wording | WI-001 approved requirements and design review | 2026-09-28 | Owner decision for requirements; proposal for wording | Requirements analyst reported ready; wording awaits design choice |
| Account currently has Rating and no Tier, one Master record type | Sandbox `tkv2-sbx` Account describe | 2026-09-28 | Project evidence | Org describe reported in this session |
| Sales Manager, System Administrator, Sales User, Read Only profiles and Account Layout exist | Sandbox profile and layout queries | 2026-09-28 | Project evidence | Org query results reported in this session |
| Salesforce permissions are additive | [Salesforce security hierarchy](https://developer.salesforce.com/workshops/admin-security-workshop/identity-and-access/2-security-hierarchy) | 2026-09-28 | Official documentation | Checked in this session |
| Profile metadata retrieval varies; permission sets are recommended for source control | [Salesforce source tracking and profiles](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-source-tracking-source-tracking-profiles.html) | 2026-09-28 | Official documentation | Checked in this session |
| Manifest-scoped retrieve and deploy are supported | [Salesforce development with non-source-tracked orgs](https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-develop-any-org.html) | 2026-09-28 | Official documentation | Checked in this session |
| Sandbox deployment and Salesforce Setup writes each require owner approval; production action is excluded | Project Salesforce safety rule | 2026-09-28 | Project constraint | Supplied for this design |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Make Gold the default or require Tier. | Tier is nullable, has no default, and can be cleared after selection. |
| R-01 | Allow extra picklist values through the API or add Tier assignment automation. | Use a restricted local Account picklist with exactly three active values; reject out-of-list API values; no automation is part of this design. |
| R-02 | Put the proposed help sentence in both settings and call it owner-approved. | The proposed help text guides users; the proposed description states the field's purpose. Confirm both with the owner at design choice. |
| R-03 | Hide Tier from Sales User or Read Only users, or use page read-only settings alone. | Every Account viewer needs field read access; field-level permissions govern editing, and effective grants must be audited. |
| R-03 | Set Sales Manager edit and assume all others are denied. | Permission sets and groups can add edit access; check every applicable path and assignment. Stop for an owner decision before changing a conflicting grant. |
| R-03 | Assume the direct Setup profile control path works, deploy profile XML, or change sharing. | Verify that control path before building; use it only after separate Setup approval; preserve and compare Account object and record access. |
| R-04 | Add Tier to all Account layouts or merely put it somewhere near Rating. | Edit Account Layout only; Tier is directly below Rating. |
| Deployment | Treat sandbox approval as permission for Setup writes too. | Obtain separate owner approvals for the sandbox deployment and direct Setup changes. |

## Notes

### Open design questions

No design question remains. Build checks may expose a conflict in layout assignment, additive permissions, or the direct Setup control path; record a specific work-item question if so, without silently changing the approved requirements.

### Design changes during the interview

| Date | Answer or decision | Section updated | Source and approval state |
| --- | --- | --- | --- |
| 2026-09-28 | Requirements R-01 through R-04 approved; design proposed | Requirements and design readiness | WI-001 owner decision for requirements only; design approval pending |

### Current position and next step

Mike approved Option A and both field texts on 2026-09-28. He split delivery: WI-001 field first, then WI-002 access and Account Layout. Begin WI-001 with read-only field and dependency inspection, then prepare its field-only package. Sandbox deployment and Setup writes each require separate owner approval.

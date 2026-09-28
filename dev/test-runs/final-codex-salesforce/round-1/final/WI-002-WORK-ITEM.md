---
id: WI-002
title: Configure Account Tier access and page layout
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: agent-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: none
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-002: Configure Account Tier access and page layout

## Overview

**Goal:** Give Account viewers the approved Tier access and show Tier directly below Rating on the assigned Account page.

**Current position:** Done on 2026-09-28. Owner reported production layout deployment Succeeded, job 0AfFAKE000DEPLOY3; Tier below Rating; planned profile permissions set in Setup; Sales User and Read Only view without edit; effective access permits only Sales Manager and System Administrator to edit. Release records committed on main at 0f57d07.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 delivered the Tier field. Its approved design covers this item.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Verify org access and page | Confirm effective access and assigned Account page. | Done | Four Account-viewing profiles and Account Layout assignment recorded; Option A fits the inventoried page. | None. |
| P2 — Configure access and layout | Set field permissions and show Tier directly below Rating. | Done | Owner-reported Sales Manager and Sales User behavior and page order, plus four profile grants in sandbox readback. | None. |

## Tasks

### P1 — Verify org access and page

- [x] **P1-T01 — Inventory effective access** · Done  
  **Work:** Identify Account viewers and field permissions from profiles, permission sets, groups, and elevated grants.  
  **Deliverable:** Access matrix in Decisions and context, from sandbox SOQL on 2026-09-28.  
  **Done when:** Four active user profiles and Account grants identified; no permission set assignments or groups returned; elevated profile fields were unavailable and require post-deploy verification.  
  **Depends on:** None.
- [x] **P1-T02 — Verify assigned page** · Done  
  **Work:** Identify the assigned Account record page and layout for affected users.  
  **Deliverable:** ProfileLayout and FlexiPage query results plus retrieved Account Layout in the WI-002 branch.  
  **Done when:** All four profiles use Account Layout; no Account RecordPage returned; Rating is last in the second column, so Option A can place Tier directly below it.  
  **Depends on:** None.

### P2 — Configure access and layout

- [x] **P2-T01 — Prepare access and layout changes** · Done  
  **Work:** Update the verified Account Layout and prepare numbered manual profile permission steps.  
  **Deliverable:** WI-002 deployment package and manual steps, committed as 4a7eea0 and combined with WI-001 as 118c6bf.  
  **Done when:** The package contains only Account-Account Layout; XML check shows Tier immediately below Rating and manual permission steps are reviewable.  
  **Depends on:** P1 completion and WI-001 field metadata.
- [x] **P2-T02 — Check R-03 and R-04** · Done  
  **Work:** Check effective permissions and rendered field order after the owner runs the sandbox changes.  
  **Deliverable:** Mike Rihm's 2026-09-28 Account page and behavior report, plus sandbox FieldPermissions readback.  
  **Done when:** Sales Manager saved Gold, Sales User could read but not edit, Tier appeared directly below Rating, and readback confirmed the other two profile grants.  
  **Depends on:** P2-T01 and owner-run sandbox deployment and manual steps.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Owner reported production layout deployment Succeeded, job 0AfFAKE000DEPLOY3; Tier below Rating; planned profile permissions set in Setup; Sales User and Read Only view without edit; effective access permits only Sales Manager and System Administrator to edit. Release records committed on main at 0f57d07. |
| 2026-09-28 | Production deployment and Setup result recorded from Mike Rihm; requirements, system guide, and release records committed on main at 0f57d07. | WI-002 is ready to finish. |
| 2026-09-28 | Set stage 13 Deployment -> 14 Specification update (status In Review). | Continue with work-decide. |
| 2026-09-28 | Owner said: "Both production deploys said Succeeded (job 0AfFAKE000DEPLOY3 for each). In production Setup I set the Tier permissions as planned, and my checks passed: Tier is below Rating, blank by default, Gold, Silver, Bronze in order; a Sales Manager saved Gold; a Sales User and a Read Only user can see Tier but can’t edit it; effective access shows only Sales Manager and System Administrator can edit." | WI-002 production layout and manual access steps succeeded by owner report; continue closeout. |
| 2026-09-28 | Production preflight on 2026-09-28: retrieved Account Layout differs from the source only by Tier__c directly below Rating; production has the four expected profiles. The narrow layout package contains only Account-Account Layout. Owner-run steps are in the Account Tier cutover plan committed as c4690fa. | Await Mike Rihm production deploy, manual field permissions, and checks; production flag remains No. |
| 2026-09-28 | Set stage 12 Pull request and push -> 13 Deployment (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner approved merging both branches into main on 2026-09-28. No remote: WI-002 merged locally into main at 52c96e2. | No pull request; production deployment remains owner-run. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: Yes, I approve the WI-002 result. | Result approved; work-finish continues. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-03 and R-04 against b43155d; evidence: tests/WI-002-TEST-PLAN.md, Account Layout source, owner-reported sandbox checks, prior grant readback, and independent checker; gaps: direct sandbox checks were not repeated by the checker. | Ready for separate WI-002 result approval. |
| 2026-09-28 | Owner said: "In Setup I checked effective access for Tier: only the Sales Manager and System Administrator profiles can edit it; nobody else has View All or Modify All on Accounts in this practice org." | Q-04 answered; recheck R-03 final acceptance. |
| 2026-09-28 | Checked R-03 and R-04 against the updated owner report, profile-grant readback, and layout source; independent checker found R-04 met and R-03 partly met. | WI-002 test plan records all four profile observations; elevated access still needs review. |
| 2026-09-28 | Owner said: "as a System Administrator I saved Silver on an Account and it stuck, and as a Read Only user I can see Tier but the field is not editable." | Q-03 behavior checks supplied by direct owner report; screenshots were not supplied. Recheck R-03. |
| 2026-09-28 | Checked R-03 and R-04 at b7ae92c with an independent checker; layout adjacency passed, R-04 met, and R-03 partly met. Corrected the stale deployment records at fb6531d. System Administrator and Read Only page behavior remains unobserved; elevated permission fields were unavailable in the sandbox query. | Q-03 waits on owner screenshots before separate result approval. |
| 2026-09-28 | Set stage 10 Bug fixing -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 09 Testing -> 10 Bug fixing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Owner said: "All three checks passed this afternoon: Tier shows right below Rating, a Sales Manager could pick Gold and save, a Sales User can see Tier but cannot edit it, and the field has its description in Setup." | Q-02 answered; complete WI-002 R-03/R-04 and WI-001 R-01/R-02 checks. |
| 2026-09-28 | Deployment records and component tracker were updated after the owner-reported sandbox success; Git staging was refused by Codex approval policy. | Documentation edits remain in the WI-002 worktree for an interactive commit; Q-02 awaits afternoon visual and edit checks. |
| 2026-09-28 | Sandbox readback confirmed four Tier profile grants, no active-user permission set assignments, and Account Layout assigned to all four profiles. | P2-T02 is in progress; rendered placement and real edit behavior still need checks. |
| 2026-09-28 | Owner said: "Yes. I ran both sandbox deploys from the WI-002 worktree; both said Succeeded. I did the pre-deploy snapshot, then set the Tier field permissions in Setup: Sales Manager and System Administrator can read and edit, Sales User and Read Only can only read. No permission set gives anyone else edit." | Q-01 answered; inspect sandbox metadata, permissions, and Account page behavior. |
| 2026-09-28 | Inventoried sandbox access and assigned Account Layout; built and committed Tier placement and manual profile steps; merged WI-001 field dependency. | Option A gate passed; owner decision on ordered sandbox changes is Q-01; R-03/R-04 checks follow deployment. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-add-a-tier-picklist-field-to-account/WI-002-configure-account-tier-access-and-page/WORK-ITEM.md -> .work-items/account-tier/WI-001-tier-field/WI-002-tier-access-and-layout/WORK-ITEM.md. | Same item; the toolkit uses the new path. It moved along with its parent WI-001's folder and is still its sub-item. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-03, WI-001 R-04. | Requirements approval inherited from WI-001 (2026-09-28 by Mike Rihm); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Will you run the ordered WI-001 and WI-002 deployments to tkv2-sbx and the WI-002 manual profile steps after reviewing the packages? Answer: Yes. Mike Rihm reported both sandbox deploys Succeeded, completed the pre-deploy snapshot, and set the four profile Tier permissions in Setup on 2026-09-28. | P2-T02 and WI-001 behavior checks | Answered | owner |
| Q-02 | This afternoon, will you check a new and saved Account as Sales Manager and Sales User, confirm Tier appears directly below Rating, and confirm the Tier description in Setup? Answer: Mike Rihm reported on 2026-09-28 that the checks passed: Tier appeared directly below Rating; a Sales Manager selected Gold and saved; a Sales User saw Tier but could not edit it; and the Tier description was present in Setup. | P2-T02 and WI-001 R-01/R-02 checks | Answered | owner |
| Q-03 | Can you send Account page screenshots showing a System Administrator saving Tier and a Read Only user seeing Tier without edit access? Answer: Mike Rihm reported on 2026-09-28 that a System Administrator saved Silver and it stuck, and a Read Only user saw Tier without edit access. No screenshots were supplied; direct owner observation is the evidence. | R-03 final acceptance | Answered | owner |
| Q-04 | Can you confirm that no active Account viewer outside Sales Manager or System Administrator has an elevated permission that allows Tier edit, using Setup effective access or an equivalent check? Answer: Mike Rihm reported on 2026-09-28 that Setup effective access for Tier showed only Sales Manager and System Administrator profiles can edit it, and nobody else has View All or Modify All on Accounts in the practice org. | R-03 final acceptance | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Mike Rihm approved Option A and asked: make the access and page layout part its own sub-item under WI-001, so WI-001 is just the field itself.

### Agreed goal

Covers WI-001 R-03, WI-001 R-04. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-03, WI-001 R-04. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. A Sales Manager and a system administrator can edit Tier, while other people who can see an Account can read Tier but cannot edit it (WI-001 R-03).
2. Tier appears directly below Rating on the assigned Account page layout (WI-001 R-04).
3. The owner reviews this sub-item result separately.

## Notes

### Decisions and context

Mike Rihm approved WI-001 Option A and requested this split on 2026-09-28. WI-002 inherits the approved WI-001 requirements R-03 and R-04 and its approved design. Profile metadata is excluded from CLI deployment; manual permission steps are required. WI-001 directly builds only the field.

Sandbox inventory on 2026-09-28 (tkv2-sbx, read-only): Account has Rating and no Tier__c. Four active users represent Sales Manager, System Administrator, Sales User, and Read Only. Account object permissions grant Read to all four profiles; Edit to the first three and no Edit to Read Only. PermissionSetAssignment and PermissionSetGroup queries returned no rows. FieldPermissions returned no Account.Tier__c grant because the field does not exist yet. The Profile and PermissionSet query responses did not expose elevated system-permission fields, so post-deploy effective-access checks remain required. ProfileLayout assigned Account Layout to all four profiles, with no Account record type assignment. FlexiPage RecordPage query returned no rows. The retrieved Account Layout has Rating last in the second column of Account Information, allowing Tier directly below Rating in that column. Evidence: sandbox SOQL and Layout retrieve in the WI-002 branch.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

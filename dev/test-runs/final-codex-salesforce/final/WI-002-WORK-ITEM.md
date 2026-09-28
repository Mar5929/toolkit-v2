---
id: WI-002
title: Set Account Tier access and page layout
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: none
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-002: Set Account Tier access and page layout

## Overview

**Goal:** Give Account viewers the approved Tier access and show Tier directly below Rating on their Account page.

**Current position:** Done on 2026-09-28. Owner reported WI-002 production deploy Succeeded, manual Tier profile permissions applied, and all four profile page checks passed; Sales User and Read Only could see but not edit Tier. Delivered requirements and system guide committed on local main at b28c640.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 supplies Account.Tier__c and deployed first.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Account page placement | Tier is placed below Rating for Account viewers | Done | Layout and any active record page show the approved placement | None. |
| P2 — Tier field access | Manager and administrator edit; other Account viewers read | Done | Manual profile steps and effective-access checks meet R-03 | None. |

## Tasks

### P1 — Account page placement

- [x] **P1-T01 — Confirm active Account pages** · Done  
  **Work:** Check layout and record page assignments for Account viewer groups.  
  **Deliverable:** Page inventory.  
  **Done when:** Every relevant active page is identified.  
  **Depends on:** WI-001 field definition.
- [x] **P1-T02 — Place Tier below Rating** · Done  
  **Work:** Change the Account layout and any active Dynamic Forms page that controls field placement. Layout source and sandbox deploy are complete; rendered page checks remain.  
  **Deliverable:** Layout or page metadata and narrow WI-002 package.  
  **Done when:** Source and rendered page checks meet WI-001 R-04.  
  **Depends on:** P1-T01.

### P2 — Tier field access

- [x] **P2-T01 — Prepare profile access steps** · Done  
  **Work:** Check existing effective grants and document manual profile settings for Option A.  
  **Deliverable:** WI-002 manual deployment steps.  
  **Done when:** Steps cover every Account-viewing profile and WI-001 R-03.  
  **Depends on:** WI-001 field definition.
- [x] **P2-T02 — Check effective access** · Done  
  **Work:** After the owner applies the settings, check manager, administrator, and other viewer access.  
  **Deliverable:** WI-002 test evidence.  
  **Done when:** WI-001 R-03 acceptance checks pass.  
  **Depends on:** P2-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Owner reported WI-002 production deploy Succeeded, manual Tier profile permissions applied, and all four profile page checks passed; Sales User and Read Only could see but not edit Tier. Delivered requirements and system guide committed on local main at b28c640. |
| 2026-09-28 | Set stage 13 Deployment -> 14 Specification update (status In Review); waiting on agent. | Continue with work-finish. |
| 2026-09-28 | Owner said: Both production deploys said Succeeded (job 0AfFAKE000DEPLOY3 for each). Before the second one I checked production: the four profiles are all on Account Layout, there are no Lightning record pages, and no permission set grants Tier. After it, I set the Tier permissions in production Setup as planned, and my checks passed: Tier is below Rating for all four profiles, blank by default, Gold, Silver, Bronze in order; a Sales Manager saved Gold; a Sales User and a Read Only user can see Tier but cannot edit it. Close both items out. I approve the git commands for the closeout. | WI-002 production deploy and manual profile steps reported complete; production checks passed; closeout authorized. |
| 2026-09-28 | Owner said: Ship it: merge both branches into main and get both packages to production. I approve the git commands for the merge. | Both local merges authorized; production layout deployment and manual profile steps handed to the owner for execution. |
| 2026-09-28 | Set stage 12 Pull request and push -> 13 Deployment (status In Review); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | No remote: merged locally into main at e8c3087. | No pull request; production deployment and manual profile steps remain for the owner. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: Yes, I approve the WI-002 result. | Result approved; work-finish continues. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress). | Continue with work-decide. |
| 2026-09-28 | Checked R-03 and R-04; evidence: read-only FieldPermissions query and Mike Rihm’s 2026-09-28 user access and rendered page checks for all four profiles; gaps: no acceptance gap reported; no independent agent checker ran. | WI-002 is ready for separate result approval. |
| 2026-09-28 | Owner said: Sales Manager and System Administrator can edit Tier; Sales User and Read Only can see it but not edit it. All four profiles see Tier directly below Rating. | R-03 and R-04 sandbox acceptance checks passed; result approval remains separate. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-decide. |
| 2026-09-28 | Sandbox FieldPermissions query returned edit grants for Sales Manager and System Administrator and read-only grants for Sales User and Read Only. | Configuration matches reported settings; user-level access and page checks remain. |
| 2026-09-28 | Owner said: "Then I set the Tier field permissions in Setup: Sales Manager and System Administrator can read and edit, Sales User and Read Only can only read." | Manual profile settings reported complete; effective-access checks remain. |
| 2026-09-28 | Owner said: "Both sandbox deploys said Succeeded (job 0AfFAKE000DEPLOY3 each)." | WI-002 sandbox deploy reported successful; access and placement checks continue. |
| 2026-09-28 | Set waiting on owner. | Approved sandbox layout deploy and manual profile steps handed to Mike Rihm; await execution and result. |
| 2026-09-28 | Owner said: "Yes, I approve deploying WI-001, then WI-002 to tkv2-sbx, and then I’ll do the manual profile steps." | WI-002 sandbox layout deployment is approved after WI-001; owner will apply manual profile steps afterward. |
| 2026-09-28 | Pre-deploy review found only the intended Account layout component. The retrieved sandbox layout differs by the Tier placement; profile and page assignments were checked read-only. | WI-002 waits for the ordered sandbox deployment decision recorded in WI-001 Q-03. |
| 2026-09-28 | Built Account layout and manual profile access steps in commit a0bb6ee; sandbox validation succeeded with one component and no errors. Sandbox inventory found one assigned layout and four Account-viewing profiles. | Continue with work-on. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-add-a-tier-picklist-field-to-account/WI-002-set-account-tier-access-and-page-layout/WORK-ITEM.md -> .work-items/account-tier/WI-001-tier-field/WI-002-tier-access-and-layout/WORK-ITEM.md. | Same item; the toolkit uses the new path. It moved along with its parent WI-001's folder and is still its sub-item. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-03, WI-001 R-04. | Requirements approval inherited from WI-001 (2026-09-28 by Mike Rihm); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Approval for the ordered sandbox deployment and profile steps is requested in WI-001 Q-03; does that approval include WI-002? Answer: Yes, Mike Rihm approved deploying WI-001, then WI-002 to tkv2-sbx, and will apply the manual profile steps afterward on 2026-09-28. | Sandbox release of R-03 and R-04 | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

The owner said on 2026-09-28: "Then split it: make the access and page layout part its own sub-item under WI-001, so WI-001 is just the field itself."

### Agreed goal

Covers WI-001 R-03, WI-001 R-04. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-03, WI-001 R-04. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. A Sales Manager and a system administrator can edit Tier on Accounts they can access; another Account viewer can read Tier but cannot edit it.
2. Tier appears directly below Rating on the Account page layout used by Account viewers.
3. The owner reviews the access and placement result separately from WI-001.

## Notes

### Decisions and context

- WI-001 R-03 and R-04 and its Option A design were approved by Mike Rihm on 2026-09-28. Profile field access is configured manually in each org; profiles are excluded from source deployment.
- Read-only sandbox checks on 2026-09-28 found one Account layout assigned to Sales Manager, System Administrator, Sales User, and Read Only. All four profiles have Account Read. No FlexiPage or PermissionSet records were returned. The target org must be inventoried again before each release.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

Option A is approved. If a target org has an active Dynamic Forms page, add Tier directly below Rating on that page and include its metadata in the WI-002 package before release.

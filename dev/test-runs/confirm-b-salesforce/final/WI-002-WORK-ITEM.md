---
id: WI-002
title: Set Account Tier access and place it below Rating on Account Layout
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: agent-led
requirements_approved: "2026-09-28 by Mike"
design: none
result_approved: "2026-09-28 by Mike"
updated: 2026-09-28
---

# WI-002: Set Account Tier access and place it below Rating on Account Layout

## Overview

**Goal:** Give Account viewers read access to Tier, limit editing to Sales Manager and System Administrator profile users, and place Tier directly below Rating on Account Layout.

**Current position:** Done on 2026-09-28. Mike reported saving the four-profile Tier field access in tkv2-prod Setup, a successful one-component layout deploy with zero component errors, Tier directly below Rating, and matching access on 2026-09-28; local main commit d9b30e2 records the baseline.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Child of WI-001; delivers R-03 and R-04. The detailed before-and-after Account record-access comparison and exhaustive effective-permission audit were not run under the approved result gaps.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Access and layout baseline | Existing grants and Account Layout configuration are known | Done | Actual layout assignment and effective access paths were recorded | None |
| P2 — Tier access and placement | Approved R-03 and R-04 behavior is implemented and checked | Done | Mike reported production field access and layout deployment succeeded, Tier below Rating, and the four-profile access matches on 2026-09-28 | None |

## Tasks

### P1 — Access and layout baseline

- [x] **P1-T01 — Inspect layout and access** · Complete  
  **Work:** Inspect Account Layout metadata, assignments, Account-visible profiles, permission sets, groups, and user assignments under the approved design.  
  **Deliverable:** Layout and effective-access baseline, including the verified Setup control path.  
  **Done when:** The baseline identified the layout and relevant grant paths; conflicts were recorded.  
  **Depends on:** WI-001 field availability.

### P2 — Tier access and placement

- [x] **P2-T01 — Prepare Account Layout change** · Complete  
  **Work:** Place Tier directly below Rating in Account Layout and prepare a layout-only WI-002 package.  
  **Deliverable:** Reviewed layout diff, manifest, component tracker entries, and deployment steps.  
  **Done when:** Sandbox validation succeeded without unrelated components.  
  **Depends on:** P1-T01.
- [x] **P2-T02 — Configure and check access** · Complete with approved audit gaps  
  **Work:** Set field access through production Setup and check resulting grants.  
  **Deliverable:** Access settings and R-03 check results.  
  **Done when:** Mike reported saving visible grants for four profiles, editable only for Sales Manager and System Administrator, and confirmed access in production on 2026-09-28. Detailed before-and-after Account record-access comparison and exhaustive effective-permission audit were not run under the approved result gaps.  
  **Depends on:** P1-T01 and deployed Tier field.
- [x] **P2-T03 — Check layout result** · Complete  
  **Work:** Check Tier placement on Account Layout as an assigned user and record R-04 evidence.  
  **Deliverable:** Tested WI-002 layout result in its test plan and production deployment record.  
  **Done when:** Mike reported Tier directly below Rating in production on 2026-09-28.  
  **Depends on:** P2-T01 and approved deployments.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike); marked Done by Mike. | Evidence: Mike reported saving the four-profile Tier field access in tkv2-prod Setup, a successful one-component layout deploy with zero component errors, Tier directly below Rating, and matching access on 2026-09-28; local main commit d9b30e2 records the baseline. |
| 2026-09-28 | Set stage 13 Deployment -> 14 Specification update (status In Review). | Continue with work-decide. |
| 2026-09-28 | Owner words: I ran both production deploys from main. Step 2: I set the Tier field-level security in tkv2-prod Setup (visible to Sales Manager, System Administrator, Sales User, and Read Only; editable only by Sales Manager and System Administrator). Step 3: the same, Succeeded, one component, zero errors. In production Tier sits directly below Rating and the access matches. Close both items out. | Production access and layout are reported delivered; deployment record, tracker, requirements, and system guide were updated. |
| 2026-09-28 | Production preflight on 2026-09-28 found only the Tier row absent from Account Layout, and found the four named Account-reading profiles. The production Setup step and narrow layout deploy command were committed to main at f1ee63f. Mike approved the release. | Await Mike production Setup, layout deployment, and verification reports; no production validation or deploy was run by the agent. |
| 2026-09-28 | Set stage 12 Pull request and push -> 13 Deployment (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main at 3a010eb after merging current main into the WI-002 branch; Mike approved the merge in chat. | WI-002 layout source and deployment records reached main; production deployment remains owner-run. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner words: Approved: I approve the WI-001 result and the WI-002 result, with those gaps. Ship it: merge both branches into main (I approve the git commands for that) and get both packages to production, tkv2-prod. | WI-002 result approved with disclosed gaps; local merge authorized; production deployment must be handed to Mike. |
| 2026-09-28 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Presented R-03/R-04 result for owner review: all four Account-reading profiles have matching Tier grants; Mike reported the corresponding UI permissions and Tier below Rating; the layout retrieve matches source. A detailed before-and-after record-access comparison was not run. | Result approval is Mike’s next decision; no merge or production deployment is authorized by this review. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-03/R-04 against Mike’s four-profile Tier Test report, read-only FieldPermissions and ObjectPermissions queries, and retrieved Account Layout; evidence: WI-002 test plan on commit ca53ed3 and corrected deployment record on commit 9fa0955; gap: detailed before-and-after record-access and exhaustive effective-permission audits were not recorded. | Representative access and layout results are recorded; testing remains open for the disclosed access-audit limits. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Owner words: I made a test Account called Tier Test in tkv2-sbx and checked it as a user of each of the four profiles. Tier starts blank with no default. Gold, Silver, Bronze, and blank all save. The help text shows: Set by hand. Gold is the highest tier, then Silver, then Bronze. Tier sits directly below Rating on the Account page. Sales Manager and System Administrator users can edit Tier; Sales User and Read Only users see it but cannot edit it. I deleted the test Account afterwards. | Q-06 answered; use Mike’s observed UI results for R-01 through R-04 testing. |
| 2026-09-28 | Owner words: I ran the WI-002 layout deploy from its worktree. It printed: {"status":0,"result":{"id":"0AfFAKE000DEPLOY3","status":"Succeeded","success":true,"checkOnly":false,"done":true,"numberComponentsDeployed":1,"numberComponentErrors":0},"warnings":[]}. | Owner-reported layout-only sandbox deployment succeeded; verify the retrieved layout and access before completing R-03/R-04 checks. |
| 2026-09-28 | Final predeploy retrieve differed from source only by Tier directly below Rating, and preview succeeded. Codex Salesforce guard blocked the approved sandbox deploy command before a job started. | Mike must run the exact WI-002 layout-only deploy command and share its result; layout and user checks remain. |
| 2026-09-28 | Owner words: Yes, I approve deploying that package to tkv2-sbx. Then show me that memory preference. | The layout-only WI-002 package is approved for tkv2-sbx deployment; run the final scope check, deploy, and verify. |
| 2026-09-28 | Owner words: Done. I saved the field-level security in tkv2-sbx Setup exactly like that. | The approved four-profile Setup change is reported saved; audit effective Tier grants before seeking layout deployment approval. |
| 2026-09-28 | Owner words: Yes, I approve that exact field-access change in tkv2-sbx. | The four-profile Account.Tier__c Setup change is approved in tkv2-sbx; configure it and audit effective access before seeking separate layout deployment approval. |
| 2026-09-28 | Mike checked Setup and found no Tier grants on the four Account-reading profiles or permission sets/groups. Read-only ObjectPermissions confirms Account read for those profiles. A fresh Account Layout retrieve differs from the proposed source only by Tier below Rating; the layout-only package validated successfully. | Access and deployment scope are ready for owner review; the exact four-profile Setup change is recorded in manual steps. |
| 2026-09-28 | Owner words: For access: none of the four profiles has any access to Tier yet, and no permission sets or permission set groups grant Tier. | Effective Tier access baseline is known for the four Account Layout profiles; prepare the exact R-03 Setup change for separate owner approval. |
| 2026-09-28 | After the WI-001 sandbox deployment, retrieved and inspected actual Account Layout XML. Prepared Tier placement directly below Rating and a layout-only package; sandbox check-only validation reported success for one component. Read-only field-permission and assignment queries returned no records, so effective access is still unverified. | Layout source is ready for review; verify effective field access and obtain separate approvals before any Setup write or layout deployment. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Created WI-002 worktree. Read-only sandbox query found Account Layout assigned to Sales Manager, System Administrator, Sales User, and Read Only profiles. Layout retrieve reported success and a file path, but no file was written; Tier is not in the sandbox yet. | Actual layout XML and effective Tier access remain unverified; repeat retrieve and audit after WI-001 deployment before editing layout or access. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-add-a-tier-picklist-field-to-account-so/WI-002-set-account-tier-access-and-place-it/WORK-ITEM.md -> .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account-so/WI-002-tier-access-and-layout/WORK-ITEM.md. | Same item; the toolkit uses the new path. It moved along with its parent WI-001's folder and is still its sub-item. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-03, WI-001 R-04. | Requirements approval inherited from WI-001 (2026-09-28 by Mike); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | What Account Tier field-level access does Setup show for Sales Manager, System Administrator, Sales User, Read Only, and any permission sets or groups assigned to Account users? Answer: None of the four profiles has access to Tier; no permission sets or permission set groups grant Tier. Mike checked tkv2-sbx Setup on 2026-09-28. | P1-T01; R-03 | Answered | owner |
| Q-02 | Does Mike approve setting Account.Tier__c Visible for Sales Manager, System Administrator, Sales User, and Read Only in tkv2-sbx, with edit access only for Sales Manager and System Administrator, using the exact WI-002 manual step? Answer: Yes. Mike approved that exact field-access change in tkv2-sbx on 2026-09-28. | P2-T02; R-03 | Answered | owner |
| Q-03 | Has Mike completed and saved the approved four-profile Account.Tier__c field-access Setup step in tkv2-sbx? Answer: Yes. Mike reported on 2026-09-28: Done. I saved the field-level security in tkv2-sbx Setup exactly like that. | P2-T02; R-03 | Answered | owner |
| Q-04 | Does Mike approve deploying the validated layout-only WI-002 package containing Account-Account Layout to tkv2-sbx? Answer: Yes. Mike approved deploying that package to tkv2-sbx on 2026-09-28. This adds Tier directly below Rating on Account Layout and affects its assigned users; no profile or permission set is in the package. | P2-T03; R-04 | Answered | owner |
| Q-05 | Will Mike run the approved layout-only deploy command in the WI-002 worktree and share its result? Answer: Yes. Mike reported a successful one-component deploy on 2026-09-28. A fresh read-only retrieve confirmed the intended layout is in tkv2-sbx. | P2-T03; R-04 | Answered | owner |
| Q-06 | Will Mike create a disposable Account in tkv2-sbx and run the remaining Account Tier UI checks? Answer: Yes. Mike reported on 2026-09-28 that Tier Test started blank; Gold, Silver, Bronze, and blank all saved; the approved help text appeared; Tier was directly below Rating; Sales Manager and System Administrator could edit; Sales User and Read Only could see but not edit. Mike deleted the test Account afterwards. | P2-T02; P2-T03; R-03; R-04; WI-001 R-01/R-02 | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** The approved requirement text and approval stay in WI-001.

### Starting request

Mike asked on 2026-09-28: “Then split it: make the access and page layout part its own sub-item under WI-001, so the field itself can go first.”

### Agreed goal

Deliver WI-001 R-03 and R-04 after the Tier field is available. Their approved text remains in WI-001.

### Active requirements

- Covers WI-001 R-03 and R-04. The requirement text and Mike’s 2026-09-28 approval stay in WI-001.

### Acceptance

This item is accepted when R-03 and R-04 pass their checks in WI-001, the result is recorded, and Mike approves the child result.

## Notes

### Decisions and context

- Mike approved Option A, including the description and help text, on 2026-09-28 and requested this split. WI-002 inherits WI-001 R-03 and R-04 and the approved design; it has no separate design approval to seek.
- The field itself goes first in WI-001. Existing Account object and record access must remain unchanged.
- Mike approved the exact four-profile Account.Tier__c Setup change in tkv2-sbx on 2026-09-28.
- Mike approved the layout-only WI-002 package deployment to tkv2-sbx on 2026-09-28. The Codex Salesforce guard blocked the agent deploy command and instructed an owner-run command.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

- Follow WI-001’s approved Option A for access and layout. Record any conflict in effective permissions before changing an unrelated grant.

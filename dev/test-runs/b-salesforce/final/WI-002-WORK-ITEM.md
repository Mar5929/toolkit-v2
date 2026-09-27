---
id: WI-002
title: Configure Account Tier access and page layout
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: "2026-09-27 by Mike"
design: none
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-002: Configure Account Tier access and page layout

## Overview

**Goal:** Give Account viewers the approved Tier access and show Tier directly below Rating on Account Layout.

**Current position:** Mike reported both production packages Succeeded, the four approved Tier profile grants set with no other grants, and all cutover checks passed on 2026-09-27. Closeout records and delivered behavior are on local main at 6aa2c47.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-001 owns R-01, the approved Option A, and the field package that must deploy first.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Access and view inventory | Actual Account field access and assigned views are known | Done | Mike Setup confirmation and read-only sandbox queries establish the four profile assignments and Tier grants. | None. |
| P2 — Access and layout configuration | Tier is readable to Account viewers, editable only to approved profiles, and below Rating | Done | Mike reported the R-01 access, save, denial, blank, and placement checks passed on 2026-09-27; independent review found R-01 met. | None. |

## Tasks

### P1 — Access and view inventory

- [x] **P1-T01 — Inventory access and Account views** · Done
  **Work:** Read Account-viewing profiles, permission sets and groups, assigned Account layouts and Lightning pages, Dynamic Forms, and Rating placement (WI-001 R-01; Option A build order step 1).
  **Deliverable:** Effective-access matrix and assigned-view inventory.
  **Done when:** Every affected access combination and view is recorded, with any scope gap raised before editing.
  **Depends on:** WI-001 P1 completion.
  **Evidence:** Sandbox ProfileLayout returned Account Layout for Sales Manager, System Administrator, Sales User, and Read Only; ObjectPermissions returned Account read for all four. Mike confirmed on 2026-09-27 that all four use the standard Account page with Account Layout, no custom Account Lightning record pages are active, and no permission sets or groups grant Account field access. The retrieved Account Layout has Rating in Account Information, second column. The four Tier grants were later saved in Setup and confirmed by sf.

### P2 — Access and layout configuration

- [x] **P2-T01 — Place Tier below Rating** · Source built, validated, and released to tkv2-sbx
  **Work:** Change Account Layout and any other approved assigned view needed for WI-001 R-01, preserving unrelated metadata.
  **Deliverable:** Narrow layout metadata and WI-002 manifest.
  **Done when:** Diffs show Tier directly below Rating in every affected approved view.
  **Depends on:** P1-T01.
  **Evidence:** The committed Account Layout XML has Tier immediately after Rating in the same column. A fresh read-only sandbox retrieve differed solely by that Tier item. All four profiles use this layout and the standard page. WI-002 package names only Account Layout; sandbox preview and validate succeeded, job 0AfFAKE000VALID3, one component and no errors. Source is committed at 20f9433. Mike reported the layout deploy Succeeded on 2026-09-27 as job 0AfFAKE000DEPLOY3, one component and zero errors. On 2026-09-27, Mike reported seeing Tier directly below Rating on the Account page.
- [x] **P2-T02 — Configure and verify field access** · Reported behavior checks passed
  **Work:** Deploy WI-002 layout after separate owner approval; configure profile field permissions in sandbox Setup under Option A; audit other grants; check read/edit behavior and actual page placement.
  **Deliverable:** Sandbox layout release, manual Setup record, access matrix, and R-01 verification results.
  **Done when:** Every affected viewer can read Tier; only Sales Manager and System Administrator profile users can edit it; placement checks pass.
  **Depends on:** P2-T01 and a separately approved sandbox deployment.
  **Evidence:** Mike reported the separately approved WI-002 layout deploy succeeded on 2026-09-27 as job 0AfFAKE000DEPLOY3. Mike reported saving four grants in Setup. Read-only sf FieldPermissions returned Sales Manager and System Administrator read/edit, Sales User and Read Only read/no edit. Mike reported Sales Manager and System Administrator saves of Gold, Silver, Bronze, and blank; Sales User and Read Only see Tier but cannot edit it in the record interface; API Tier updates as both non-manager users were denied with insufficient access errors; Tier is directly below Rating; new Accounts have no Tier default; and an existing blank Tier stayed blank. See WI-002 Q-04 through Q-06 and the WI-002 test plan.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Mike reported WI-002 production layout deploy Succeeded with one component and zero errors, the four approved Tier grants with no others, and every cutover check passed as in sandbox on 2026-09-27; closeout commit 6aa2c47 is on local main. |
| 2026-09-27 | Set stage 13 Deployment -> 14 Specification update (status In Review); waiting on agent. | Production cutover reported complete; delivered behavior baselined in requirements and system guide at 6aa2c47. |
| 2026-09-27 | Mike reported on 2026-09-27 that production cutover step 20 Succeeded with one component and zero errors, matching the reported step 10 result. He set Sales Manager and System Administrator Tier read/edit, Sales User and Read Only read only, and no other grants in tkv2-prod Setup. He reported every step 40 check passed as in sandbox. Owner's words: Close both items out. I approve the git commands for the closeout. | Account Layout is marked Production Yes; manual steps, deployment record, and delivered behavior are committed on local main at 6aa2c47. |
| 2026-09-27 | Production read-only layout retrieve differed from source only by Tier below Rating. The one-component layout package, manual grant steps, and cutover plan are on local main at 3f0defd. No production deploy or grant change ran. | After the field deploy succeeds, Mike runs the layout package, sets grants, checks behavior, and reports results. Now waiting on the owner. |
| 2026-09-27 | Set stage 12 Pull request and push -> 13 Deployment (status In Review). | Continue with work-finish. |
| 2026-09-27 | No remote: merged locally into main at a0030a7 after resolving the component-tracker CSV conflict. Production handoff remains; no production deployment ran. | Continue with work-finish production handoff. |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Owner's words: Approved: I approve the WI-001 result and the WI-002 result. Ship it: merge both branches into main (I approve the git commands for that) and get both packages to production, tkv2-prod. | Continue with work-finish. Now waiting on the agent. |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked: WI-002 acceptance and inherited WI-001 R-01 against approved Option A, four-profile matrix, shared Account Layout, field/layout XML, and Mike reported record and API checks through Q-06; independent checker found R-01 met at WI-001 ba9a489 and WI-002 895d1c2 plus corrected deployment records committed at c4b0b1c. Local XML assertions and git diff --check passed. Gaps: manual checks are owner reported and test Account IDs were not recorded; no project-wide test command is verified. | Ready for Mike result approval; production release instructions follow approval. |
| 2026-09-27 | Owner words: Both passed. As System Administrator I saved each of Gold, Silver, and Bronze, then cleared it to blank and saved. And an API update of Tier as the Read Only user was denied with an insufficient access error. | Q-06 answered; complete WI-002 and WI-001 finished-result checks. Now waiting on the agent. |
| 2026-09-27 | Independent finished-result check at WI-001 ba9a489 and WI-002 f577956: R-01 partly met. Mike reported all Q-05 checks passed, but System Administrator saves of Gold, Silver, Bronze, and blank and Read Only API edit denial remain unreported (Q-06). Read-only XML parsing and git diff --check passed. Stale deployment records were corrected in the WI-002 worktree. | Continue with work-check. Now waiting on the owner. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Owner's words: All four passed: as System Administrator I saved Tier; as a Read Only user I can see Tier but can't edit it; an API update of Tier as a Sales User was denied with an insufficient access error; and an existing Account with no Tier stayed blank. | Continue with work-decide. Now waiting on the agent. |
| 2026-09-27 | Mike reported on 2026-09-27 that he saved Account.Tier__c grants in tkv2-sbx Setup: Sales Manager and System Administrator read/edit; Sales User and Read Only read only. He reported Sales Manager can save Gold, Silver, Bronze, and blank; Sales User sees Tier but cannot edit it; Tier appears directly below Rating; and a new Account has no Tier default. Read-only sf FieldPermissions returned exactly those four grants. | Q-04 answered. Q-05 tracks System Administrator and Read Only record checks, non-manager API edit denial, and an existing blank Account check before acceptance. |
| 2026-09-27 | Owner reported: I ran the WI-002 layout deploy. Result: {"status":0,"result":{"id":"0AfFAKE000DEPLOY3","status":"Succeeded","success":true,"numberComponentsDeployed":1,"numberComponentErrors":0}}. The layout Sandbox tracker flag and deployment record were updated. No Setup session is available to this agent for the approved profile grants. | WI-002 layout released; Mike must save Option A profile field permissions in tkv2-sbx Setup and report R-01 behavior checks. |
| 2026-09-27 | Mike approved the WI-002 Account Layout release to tkv2-sbx on 2026-09-27. Fresh preview succeeded, but the Codex Salesforce guard prevented the release command; no WI-002 org change occurred. | Owner must run the exact sandbox release command in a terminal, then report the job result; WI-002 remains unreleased. Now waiting on the owner. |
| 2026-09-27 | Owner's words: Yes, I approve deploying the WI-002 Account Layout package to tkv2-sbx. | The separate sandbox layout deployment is approved; proceed with the package preflight and deploy. Now waiting on the agent. |
| 2026-09-27 | Owner's words: In tkv2-sbx there are no custom Lightning record pages for Account; all four profiles use the standard page with Account Layout. No permission sets or permission set groups grant anything on Account fields. Tier has no read or edit grants yet, since setting them is WI-002's job under option A. Keep going. | P1-T01 assignment and access inventory is resolved; prepare the WI-002 layout release and Option A profile grants. Now waiting on the owner. |
| 2026-09-27 | Sandbox queries established Account Layout assignment for the four returned profiles, but could not establish active Lightning page assignments or effective Tier grants. Requested Setup evidence from Mike before deciding the WI-002 release scope. | WI-002 waits on owner evidence for P1-T01 pre-deploy inventory. |
| 2026-09-27 | Mike reported WI-001 field deployment Succeeded as job 0AfFAKE000DEPLOY3; read-only sandbox describe confirmed Account.Tier__c. ProfileLayout query now shows Account Layout for Sales Manager, System Administrator, Sales User, and Read Only profiles. ObjectPermissions shows Account read for all four. Tier FieldPermissions query returned no rows and PermissionSet query lacks requested fields, so effective field grants and Lightning page assignments remain unverified. | WI-002 field dependency is resolved; pre-deploy access and view inventory remains open. Now waiting on the owner. |
| 2026-09-27 | Mike approved the WI-001 field release, but the Codex Salesforce guard blocked execution, so Tier remains absent from the practice sandbox. The practice sf script returns only profile names or generic layout rows for permission and assignment queries; it cannot establish effective access or assigned Account views. WI-002 remains unready for a layout release until the field lands and those details are supplied. | Continue with work-on. Now waiting on the agent. |
| 2026-09-27 | Practice sf returned Account Layout with Rating in the second column. The access and assignment queries did not return the requested permission or assignment fields. WI-002 layout source and a narrow package now place Tier directly below Rating; the practice CLI validated the package successfully as job 0AfFAKE000VALID3. | Layout build can be reviewed; effective access and assigned views remain unverified before deploy and acceptance. |
| 2026-09-27 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-27 | Folder renamed by hand: .work-items/WI-001-add-a-tier-picklist-field-to-account/WI-002-configure-account-tier-access-and-page/WORK-ITEM.md -> .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account/WI-002-tier-access-and-layout/WORK-ITEM.md. | Same item; the toolkit uses the new path. Its parent WI-001 moved too. |
| 2026-09-27 | Owner's words: Then split it: make the access and page layout part its own sub-item under WI-001, so the field itself can go first. | WI-002 follows the WI-001 field build and inherits approved R-01 and Option A. |
| 2026-09-27 | Created as a sub-item of WI-001. It delivers WI-001 R-01. | Requirements approval inherited from WI-001 (2026-09-27 by Mike); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. Now waiting on the agent. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | In tkv2-sbx Setup, which Account Lightning record pages are active for the four Account-viewing profiles, and what Tier read/edit grants exist on their profiles, permission sets, and permission set groups? Answer from Mike, 2026-09-27: No custom Account Lightning record pages; Sales Manager, System Administrator, Sales User, and Read Only use the standard page with Account Layout. No permission sets or permission set groups grant Account field access. Tier has no read or edit grants yet; configure these under approved Option A in WI-002. | P1-T01 inventory and WI-002 release scope | Answered 2026-09-27 by Mike | owner |
| Q-02 | Do you approve deploying the WI-002 Account Layout package to tkv2-sbx as a separate sandbox release? It adds Tier immediately below Rating; Option A profile grants follow in Setup. Answer from Mike, 2026-09-27: Yes, I approve deploying the WI-002 Account Layout package to tkv2-sbx. | P2-T02 sandbox release | Answered 2026-09-27 by Mike | owner |
| Q-03 | Run the approved WI-002 Account Layout release command from the WI-002 worktree in a terminal and report its job result. Answer from Mike, 2026-09-27: I ran the WI-002 layout deploy. Result: {"status":0,"result":{"id":"0AfFAKE000DEPLOY3","status":"Succeeded","success":true,"numberComponentsDeployed":1,"numberComponentErrors":0}}. | P2-T02 sandbox release and R-01 checks | Answered 2026-09-27 by Mike | owner |
| Q-04 | Set the four Tier profile grants in tkv2-sbx Setup and report the R-01 checks. Mike reported on 2026-09-27 that Sales Manager and System Administrator have read/edit; Sales User and Read Only have read/no edit. sf confirmed the four saved grants. Mike reported Sales Manager value and blank saves, Sales User read/no edit, Tier below Rating, and no default on a new Account. Remaining checks are in Q-05. | P2-T02 profile configuration and partial R-01 checks | Answered 2026-09-27 by Mike | owner |
| Q-05 | Complete the remaining R-01 checks in tkv2-sbx: System Administrator save; Read Only user reads Tier and cannot edit; non-manager API edit is denied; an existing Account with blank Tier remains blank. Mike reported all four passed on 2026-09-27: as System Administrator he saved Tier; as Read Only he could see Tier but could not edit; a Sales User API Tier update was denied with an insufficient access error; and an existing Account with no Tier stayed blank. | P2-T02 and WI-001 R-01 acceptance | Answered 2026-09-27 by Mike | owner |
| Q-06 | Did a System Administrator save each of Gold, Silver, Bronze, and blank, and was a Read Only user API Tier update denied? Answer from Mike, 2026-09-27: Both passed. As System Administrator I saved each of Gold, Silver, and Bronze, then cleared it to blank and saved. An API update of Tier as the Read Only user was denied with an insufficient access error. | WI-001 R-01 acceptance and selected Option A checks | Answered 2026-09-27 by Mike | owner |

## Requirements

<!-- Starting request records what was asked; Agreed goal records the outcome the owner accepted. Under Active requirements, create one R-ID subsection per explicit behavior. Fill every labeled field under each R-ID. Keep an item Refining until its required behavior and acceptance check are clear and owner approval is recorded; mark Superseded only with a replacement link. Put solution ideas in the final Notes subsection, not here. -->

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Mike requested on 2026-09-27: Then split it: make the access and page layout part its own sub-item under WI-001, so the field itself can go first.

### Agreed goal

Covers WI-001 R-01. The requirement text and its approval (2026-09-27 by Mike) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-01. The requirement text and its approval (2026-09-27 by Mike) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. Every user who can view an Account can read Tier; only Sales Manager profile users and system administrators can edit it.
2. Tier appears directly below Rating on Account Layout and every affected assigned Account view is checked.
3. Effective field access and record-interface and API behavior are checked for the affected user combinations; Mike reviews the result. See WI-001 R-01 for the approved full acceptance check.

## Notes

### Decisions and context

- Mike approved Option A, profile field permissions, on 2026-09-27. WI-002 inherits WI-001 R-01 and design approval.
- Acme CRM and its org aliases are practice environments. Plain sf on PATH intentionally simulates org results; Mike authorized using its output as org evidence on 2026-09-27.
- WI-001 field and WI-002 Account Layout were reported deployed to tkv2-sbx. Account Layout source places Tier immediately after Rating in Account Information, second column. Profile field access was set manually in Setup; profile XML was not deployed.
- Mike confirmed on 2026-09-27 that Sales Manager, System Administrator, Sales User, and Read Only all use the standard Account page with Account Layout. There are no custom Account Lightning record pages, and no permission sets or groups granting Account field access.
- Mike reported saving Tier profile grants on 2026-09-27. Read-only sf FieldPermissions returned Sales Manager and System Administrator read/edit; Sales User and Read Only read/no edit. Mike reported all required value, blank, record access, API denial, page placement, and blank preservation checks passed; see Q-04 through Q-06 and the WI-002 test plan.
- The WI-002 package contains only Account Layout. A fresh sandbox retrieve before deployment differed from committed source only by the Tier item after Rating. Preview and validation succeeded; no unrelated layout change was found. Mike reported the successful one-component layout deployment on 2026-09-27.

### Resume here

Finished on 2026-09-27. Nothing to resume.

### Solution options and considerations

Option A remains approved. If actual behavior differs from the confirmed grants or assignments, record the gap and request a scope decision.

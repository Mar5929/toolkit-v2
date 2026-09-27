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
requirements_approved: 2026-09-27 by Mike
design: none
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-002: Configure Account Tier access and page layout

## Overview

**Goal:** Configure Account Tier field access and show Tier on the main Account page layout.

**Current position:** Done. Mike reported successful production layout deploy and profile steps, and saw Tier on the Account page as a Sales Manager. Closeout is committed on local main at 8e29ac1.

**Next action:** Done. No next action.

**Blockers:** None. This repository has no remote, so local commit 8e29ac1 has not been pushed.

**Related items:** Parent WI-001 owns R-01 through R-03 and the Tier field.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Verify access and layout | Exact main Account layout, page mechanism, and effective grants are known. | Not Started | Evidence identifies target components and any access conflicts. | None |
| P2 — Configure and check | Tier is placed on the main layout and field access meets R-02. | Not Started | Sandbox acceptance checks for R-02 and R-03 are recorded for owner review. | None |

## Tasks

### P1 — Verify access and layout

- [x] **P1-T01 — Identify main Account page** · Done  
  **Work:** Verify the assigned main Account layout and whether a Lightning page or Dynamic Forms controls Tier display.  
  **Deliverable:** Layout assignment and page mechanism evidence.  
  **Done when:** The exact page component to change is known.  
  **Depends on:** None.
- [x] **P1-T02 — Audit effective access** · Done  
  **Work:** Inspect relevant profiles, permission sets, groups, and override permissions for Account Tier editing.  
  **Deliverable:** Access matrix for Sales Manager, system administrator, and other Account viewers.  
  **Done when:** Additive grants and access conflicts are identified.  
  **Depends on:** None.

### P2 — Configure and check

- [x] **P2-T01 — Prepare layout and access change** · Done  
  **Work:** Add Tier to the verified main layout, document manual profile access steps, and resolve any additive grant conflicts under the approved design.  
  **Deliverable:** Layout metadata, WI-002 manifest, and manual steps.  
  **Done when:** Deployment contents and effective access plan meet R-02 and R-03.  
  **Depends on:** P1-T01, P1-T02, and WI-001 field source.
- [x] **P2-T02 — Check access and layout** · Done  
  **Work:** After separate sandbox deployment approval, verify editor and viewer behavior and Tier placement.  
  **Deliverable:** R-02/R-03 sandbox evidence for owner review.  
  **Done when:** R-02 and R-03 acceptance checks are recorded.  
  **Depends on:** P2-T01 and separate sandbox deployment approval.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Mike reported successful WI-002 production layout deploy after WI-001, completed profile access steps, and Tier visible on the Account page as a Sales Manager; sandbox access checks passed; closeout commit 8e29ac1 is on local main. |
| 2026-09-27 | Set stage 13 Deployment -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Set waiting on agent. | Continue with work-finish. |
| 2026-09-27 | Owner reported successful production deploy after WI-001, completed production profile access steps, and Tier visible on the Account page for a Sales Manager; owner asked to mark WI-002 Done. |  |
| 2026-09-27 | Mike corrected tkv2-prod after it had pointed to the sandbox, and confirmed Tier__c absent in production. Fresh read-only production layout retrieve differs from source only by Tier__c. Agent production deploy remains denied by the project guard; Mike must run WI-001 first, then WI-002 and manual profile access. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Merged WI-002 into local main at 9970961 after resolving the component tracker conflict. Production layout retrieve differs from source only by Tier__c; production Account describe and FieldPermissions show Tier and intended profile grants. No production deploy performed; owner receives a layout-only command. |  |
| 2026-09-27 | Set stage 12 Pull request and push -> 13 Deployment (status In Review). | Continue with work-finish. |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Set waiting on agent. | Continue with work-finish. |
| 2026-09-27 | Owner's words: And I approve the WI-002 result. |  |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked: Mike's four-profile and record-access results, sandbox FieldPermissions and PermissionSetAssignment queries, and main Account layout evidence; R-02 and R-03 met on available evidence. Independent checker found no metadata defect. |  |
| 2026-09-27 | Set waiting on agent. | Continue with work-check. |
| 2026-09-27 | Owner's words: Sales Manager and System Administrator users can edit and clear Tier, a Read Only user sees Tier but cannot edit it, and a user without access to an Account still cannot open it. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Mike reported successful WI-001 and WI-002 sandbox deploys, four profile access settings, and a Sales User check where Tier is visible but not editable. R-03 is supported; R-02 still needs Sales Manager, administrator, other-viewer, and effective-grant checks. |  |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Fresh sandbox layout retrieve matched source except the Tier item. Permission set group and assignment queries returned no records. Codex org guard blocked the authorized field write before execution; no metadata changed. |  |
| 2026-09-27 | Committed retrieved Account Layout with Tier, WI-002 narrow package, tracker and master manifest as 844e376 on claude/wi-002-tier-access-layout. Worktree clean; no origin remote is configured, so the commit remains local. |  |
| 2026-09-27 | Owner's words: I fixed my sandbox login, so the retrieve of Account Layout works now. Retrieve it again and finish the layout change. You still have my OK for the git commands on the WI-001 and WI-002 branches. |  |
| 2026-09-27 | Mike said the sandbox login was fixed. The next read-only retrieve returned Account Layout. Added Tier below Rating while retaining existing layout content; prepared the WI-002 package. Validation reported success, but effective access and live page visibility remain unverified. |  |
| 2026-09-27 | Set waiting on agent. | Continue with work-on. |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Set stage 06 Implementation plan -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Mike confirmed on 2026-09-27: Account Layout is the only Account page layout, every profile uses it, and no permission set gives anyone access to Account fields. A read-only sandbox retrieve of Layout:Account-Account Layout reported success but returned no source file; layout contents still need verification before editing. |  |
| 2026-09-27 | Owner moved WI-002 under the account-tier folder and renamed its folder. Sandbox queries found one Account Layout, no FlexiPage or permission set group records, and four profiles; these results do not establish layout assignment or effective Tier grants. |  |
| 2026-09-27 | Set delivery agent-led. | Continue with work-on. |
| 2026-09-27 | Set waiting on agent. | Continue with work-on. |
| 2026-09-27 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-27 | Created under WI-001 at Mike's request to deliver R-02 and R-03. WI-001's approved Option A design covers this sub-item; no new design choice is needed. |  |
| 2026-09-27 | Created as a sub-item of WI-001. It delivers WI-001 R-02, WI-001 R-03. | Requirements approval inherited from WI-001 (2026-09-27 by Mike); the owner is not asked again. Starts at 03 Requirements approved. Continue with solution-design. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| None | No owner decision is open. The agent must verify the assigned layout and effective access before implementation. | WI-001 R-02, R-03 | Agent verification | agent |
| Q-01 | Can you provide the current Account Layout metadata XML, or a read-only route that returns it? The sandbox retrieve reported success but produced no file. | WI-001 R-03; safe edit of existing layout | Answered 2026-09-27: Mike fixed the sandbox login; the next retrieve returned the XML. | owner |
| Q-02 | Can you check Tier as Sales Manager, System Administrator, and Read Only users on Accounts they can view, and confirm a user without Account record access still cannot open that Account? | R-02 effective-user acceptance check | Answered 2026-09-27: Mike checked that Sales Manager and System Administrator users can edit and clear Tier; a Read Only user sees Tier but cannot edit it; a user without access to an Account cannot open it. | owner |
| Q-03 | After the WI-001 field deploy succeeds, can you run the WI-002 layout package against corrected tkv2-prod, complete production profile access, and report the deploy and page checks? | WI-002 production deployment | Answered 2026-09-27: Mike reported layout deploy success, completed production profile steps, and saw Tier on the Account page as a Sales Manager. Other production role checks were not reported. | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** This sub-item inherits approval of WI-001 R-02 and R-03, recorded on 2026-09-27 by Mike. Their text stays in WI-001.

### Starting request

Mike asked: “This is getting big, so split it: make the access and page layout part its own sub-item under WI-001.”

### Agreed goal

Deliver Account Tier access and main Account page layout placement under WI-001. This item covers WI-001 R-02 and R-03; their requirement text and approval remain in WI-001.

### Active requirements

- Covers WI-001 R-02 and R-03. The requirement text and approval (2026-09-27 by Mike) stay in WI-001.

### Acceptance

This work item can be accepted when WI-001 R-02 and R-03 pass their acceptance checks, the effective access audit is recorded, and Mike reviews WI-002's result.

## Notes

### Decisions and context

- Mike approved Option A and the field text for WI-001 on 2026-09-27. Its approved DESIGN.md covers this sub-item; no new behavior or design choice was introduced by the split.
- The parent supplies Account.Tier__c. This sub-item owns field access, the verified main Account layout, effective-grant audit, and related release steps.
- Profiles are not deployed by CLI under project rules. Document exact manual profile access steps; any permission-set change follows the fresh fetch and preflight procedure.
- On 2026-09-27, a Tooling API query found one Account layout named `Account Layout`; FlexiPage and PermissionSetGroup queries returned no records. A Profile query listed Sales Manager, System Administrator, Sales User, and Read Only. The PermissionSet query returned those same records as Profile rows rather than the requested PermissionSet fields. These results do not prove the main layout assignment, page mechanism, or effective field grants.

### Resume here

The current Account Layout was retrieved, and Tier was added below Rating. The WI-002 narrow manifest and manual profile access steps are prepared on its branch. Queries of PermissionSet, PermissionSetGroup, and FieldPermissions did not establish effective user access. Verify access with real users after the field and manual profile settings are applied. Sandbox deployment needs a separate yes.

### Solution options and considerations

The selected approach is Option A in WI-001's approved DESIGN.md. No separate design option is pending for WI-002.

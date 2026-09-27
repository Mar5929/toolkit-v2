---
id: WI-002
title: Configure Account Tier access and page layout
type: build
stage: 06-implementation-plan
status: In Progress
parent: WI-001
waiting_on: "agent"
priority: medium
delivery: not-offered
requirements_approved: "2026-09-27 by Mike"
design: none
result_approved: "no"
updated: 2026-09-27
---

# WI-002: Configure Account Tier access and page layout

## Overview

**Goal:** Give Account viewers the approved Tier access and show Tier directly below Rating on Account Layout.

**Current position:** Created as a sub-item of WI-001. It inherits approved R-01 and Option A. No access or layout changes have been made.

**Next action:** After the Tier field is built, inventory sandbox access and assigned Account views, then plan the profile settings and layout metadata change.

**Blockers:** Account.Tier__c must exist before access and layout can be completed.

**Related items:** Parent WI-001 (R-01). Design: WI-001 approved Option A.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Access and view inventory | Actual Account field access and assigned views are known | Not Started | Access matrix, layout assignments, and Rating placement recorded | None. |
| P2 — Access and layout configuration | Tier is readable to Account viewers, editable only to approved profiles, and below Rating | Not Started | R-01 access and placement checks pass in each affected view | None. |

## Tasks

### P1 — Access and view inventory

- [ ] **P1-T01 — Inventory access and Account views** · Not Started  
  **Work:** After Account.Tier__c exists, read Account-viewing profiles, permission sets and groups, assigned Account layouts and Lightning pages, Dynamic Forms, and Rating placement (WI-001 R-01; Option A build order step 1).  
  **Deliverable:** Effective-access matrix and assigned-view inventory.  
  **Done when:** Every affected access combination and view is recorded, with any scope gap raised before editing.  
  **Depends on:** WI-001 P1 completion.

### P2 — Access and layout configuration

- [ ] **P2-T01 — Place Tier below Rating** · Not Started  
  **Work:** Change Account Layout and any other approved assigned view needed for WI-001 R-01, preserving unrelated metadata.  
  **Deliverable:** Narrow layout metadata and WI-002 manifest.  
  **Done when:** Diffs show Tier directly below Rating in every affected approved view.  
  **Depends on:** P1-T01.
- [ ] **P2-T02 — Configure and verify field access** · Not Started  
  **Work:** Configure profile field permissions in sandbox Setup under Option A, audit other grants, and check real read and edit behavior plus actual page placement.  
  **Deliverable:** Manual release steps, access matrix, and R-01 verification results.  
  **Done when:** Every affected viewer can read Tier; only Sales Manager and System Administrator profile users can edit it; placement checks pass.  
  **Depends on:** P2-T01 and a separately approved sandbox deployment.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Folder renamed by hand: .work-items/WI-001-add-a-tier-picklist-field-to-account/WI-002-configure-account-tier-access-and-page/WORK-ITEM.md -> .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account/WI-002-tier-access-and-layout/WORK-ITEM.md. | Same item; the toolkit uses the new path. Its parent WI-001 moved too. |
| 2026-09-27 | Owner's words: Then split it: make the access and page layout part its own sub-item under WI-001, so the field itself can go first. | WI-002 follows the WI-001 field build and inherits approved R-01 and Option A. |
| 2026-09-27 | Created as a sub-item of WI-001. It delivers WI-001 R-01. | Requirements approval inherited from WI-001 (2026-09-27 by Mike); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. Now waiting on the agent. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

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

<!-- Keep useful context here without duplicating the requirements or task list. Update Resume here before a session ends. Solution options and considerations stays last and contains proposals only. -->

### Decisions and context

- Mike approved Option A, profile field permissions, on 2026-09-27. WI-002 inherits the approved WI-001 design and R-01.
- WI-001 builds the Tier field first. This item then handles profile field access and Account page placement. Do not deploy profile XML.

### Resume here

Wait for WI-001 to build Account.Tier__c. Then inventory effective field grants and assigned Account layouts and Lightning pages. Follow approved Option A for profile access and Tier placement below Rating; verify all affected views and user combinations.

### Solution options and considerations

Approved approach: WI-001 Option A, profile field permissions. Inventory the org before making access or layout changes. If assigned views or effective grants prevent WI-001 R-01 within the approved scope, record the gap and request a scope decision.

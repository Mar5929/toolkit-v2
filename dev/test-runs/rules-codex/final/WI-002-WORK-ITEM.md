---
id: WI-002
title: Add the --cents option
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-29 by Mike Rihm"
design: none
result_approved: "2026-09-29 by Mike Rihm"
updated: 2026-09-29
---

# WI-002: Add the --cents option

## Overview

**Goal:** Add an optional --cents output line with the total due as whole cents.

**Current position:** Done on 2026-09-29. Owner approved the cents result; eight integrated tests passed; main contains 0dda9ab and delivered documents at d935d1c.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 supplies the fee and dollar total; this item delivered WI-001 R-03.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Optional cents output | The command prints total due in whole cents only when --cents is supplied. | Done | R-03 acceptance checks and existing dollar tests pass. | None. |

## Tasks

### P1 — Optional cents output

- [x] **P1-T01 — Add the --cents output** · Done  
  **Work:** Accept one trailing --cents flag and print totalCents as a second line (WI-001 R-03; approved Option A design, Selected design).  
  **Deliverable:** Updated bin/feecalc.js and tests/wi-002.test.js.  
  **Done when:** Exact 200/10 and 1/2 cents results pass, normal output remains one line, and invalid flag positions fail without stdout.  
  **Depends on:** WI-001 dollar command on commit 3b2bc38.
- [x] **P1-T02 — Verify the extension** · Done  
  **Work:** Run WI-002 checks and the existing WI-001 suite; record the results in tests/WI-002-TEST-PLAN.md.  
  **Deliverable:** Test plan with observed results.  
  **Done when:** All checks pass on the WI-002 branch and the committed output matches R-03.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-29 | Finished. Result approved earlier (2026-09-29 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Owner approved the cents result; eight integrated tests passed; main contains 0dda9ab and delivered documents at d935d1c. |
| 2026-09-29 | Delivered requirements, system guide, and roadmap committed on main at d935d1c; merged branch and clean worktree removed. | WI-002 is ready for Done. |
| 2026-09-29 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-29 | Deployment stage skipped: the deliverable is a local Node.js command, and no deployment target is recorded. | Proceed to the delivered requirements baseline. |
| 2026-09-29 | No remote: merged locally into main. | No pull request; no deployment. |
| 2026-09-29 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-29 | Owner said: Ship it: WI-001 and WI-002. There is no remote, so merge both into main here, then finish WI-002 and WI-001, and clean up their worktrees and branches. I approve the Git commands for that. | Local merge and cleanup of WI-002 authorized. |
| 2026-09-29 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-29 | Owner said: I ran it in the WI-002 worktree and it printed what I expected. I approve the WI-002 result. No merge yet. | Result approved; leave WI-002 unmerged until separate authorization. |
| 2026-09-29 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-29 | Checked: WI-001 R-03 and dollar regression on d1c7d8a; acceptance-checker: R-03 met, ready for owner review, no defects; evidence: tests/WI-002-TEST-PLAN.md and eight passing tests; gaps: owner result approval pending. | Request WI-002 result approval; branch remains unmerged. |
| 2026-09-29 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-29 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-29 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-29 | Separate design skipped: WI-002 inherits the approved Option A design from WI-001. | Continue with work-on. |
| 2026-09-29 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-29 | Delivery owner-led (recorded on WI-001). | WI-001's delivery covers this sub-item. |
| 2026-09-29 | Folder renamed by hand: .work-items/WI-001-build-the-late-fee-command/WI-002-add-the-cents-option/WORK-ITEM.md -> .work-items/WI-001-build-the-late-fee-command/WI-002-cents-for-billing-api/WORK-ITEM.md. | Same item; the toolkit uses the new path. |
| 2026-09-29 | Created as a sub-item of WI-001. It delivers WI-001 R-03. | Requirements approval inherited from WI-001 (2026-09-29 by Mike Rihm); the owner is not asked again. Starts at 03 Requirements approved. Continue with solution-design. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

None open.

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Mike Rihm asked on 2026-09-29: Before you build, split the --cents option out into its own sub-item under WI-001, so WI-001 is only the dollar fee and total. The original request asks the option to add a second line with the total due in whole cents for the billing API.

### Agreed goal

Covers WI-001 R-03. The requirement text and its approval (2026-09-29 by Mike Rihm) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-03. The requirement text and its approval (2026-09-29 by Mike Rihm) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. Running node bin/feecalc.js 200 --days 10 --cents prints the dollar line followed by exactly "Total due in cents: 20500" (WI-001 R-03).
2. Running node bin/feecalc.js 1 --days 2 --cents prints a total due of $1.01 and a cents line of 101 (WI-001 R-03).
3. Running without --cents continues to print only the dollar line.
4. The owner approves this sub-item result separately.

## Notes

### Decisions and context

- Mike Rihm assigned the optional cents output to this sub-item on 2026-09-29 and approved Option A for the parent design. WI-002 inherits the approved R-03 requirement and uses the parent design.

### Resume here

Finished on 2026-09-29. Nothing to resume.

### Solution options and considerations

The approved Option A design in WI-001 specifies how this child adds the optional cents line. No separate solution choice is open.

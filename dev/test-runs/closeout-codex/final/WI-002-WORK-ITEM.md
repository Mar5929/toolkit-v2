---
id: WI-002
title: Add the --split option
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

# WI-002: Add the --split option

## Overview

**Goal:** Add --split so the command prints each person’s share of the rounded total.

**Current position:** Done on 2026-09-28. Mike approved the split result; four command tests passed on local main at 421fcb7; requirements and system guide committed at 9dbf3c8.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 (R-02). Design: WI-001’s approved design.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Split output | The command prints each person’s share when --split is supplied | Done | R-02 split and invalid-count checks pass | None. |

## Tasks

### P1 — Split output

- [x] **P1-T01 — Validate and calculate the split** · Done  
  **Work:** Add a positive whole-number --split count and round each share upward from rounded Total cents (WI-001 R-02; Option A).  
  **Deliverable:** Split calculation in `bin/tipcalc.js`.  
  **Done when:** Splits of three and seven yield $20.00 and $8.58; invalid counts produce an error without a result.  
  **Depends on:** WI-001 P1.
- [x] **P1-T02 — Check the split output** · Done  
  **Work:** Extend process-level command checks for R-02 and run them.  
  **Deliverable:** Recorded R-02 test results.  
  **Done when:** Every approved R-02 example and invalid-count case passes.  
  **Depends on:** P1-T01.

Evidence: commit f1471a4; node --test tests/tipcalc.test.js passed 4 tests on 2026-09-28, including both R-02 shares and zero, negative, fractional, and malformed counts.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Mike approved the split result; four command tests passed on local main at 421fcb7; requirements and system guide committed at 9dbf3c8. |
| 2026-09-28 | No deployment applies: this local terminal command is delivered on main. | Requirements and system guide committed locally as 9dbf3c8. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner said: Ship it: WI-001 and WI-002. The whole tip command works the way I asked. There is no remote, so merge both into main here, then finish WI-002 and WI-001, and clean up their worktrees and branches. I approve the Git commands for that. | Owner authorized local merge, closeout, and cleanup; result approval was already recorded. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I ran the split in the WI-002 worktree and it printed what I expected. I approve the WI-002 result. No merge yet. | WI-002 result approved; branch remains unmerged. |
| 2026-09-28 | Owner said: "No, keep the approved rounding. Each share rounds up, and whoever paid keeps the extra few cents." | Confirmed WI-001 R-02 and Option A without a calculation or output change; recorded that the payer keeps any rounded-share excess. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked: WI-001 R-02 against commit 421fcb7; acceptance-checker: R-02 met on exact head with no defects; evidence: tests/WI-002-TEST-PLAN.md, four passing process tests, and direct split and invalid-count checks; gaps: owner review remains | Ready to show the WI-002 result for owner approval. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-build-the-plain-tip-and-total-command/WI-002-add-the-split-option/WORK-ITEM.md -> .work-items/WI-001-build-the-plain-tip-and-total-command/WI-002-split-between-friends/WORK-ITEM.md. | Same item; the toolkit uses the new path. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from WI-001 (2026-09-28 by Mike Rihm); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Owner, 2026-09-28: “Before you build, split the --split option out into its own sub-item under WI-001, so WI-001 is the plain tip and total and the sub-item is the split.”

### Agreed goal

Covers WI-001 R-02. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-02. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. With a $50 bill, 20% tip, and `--split 3`, the second line is exactly `Each person pays: $20.00` (WI-001 R-02).
2. With the same bill and tip and `--split 7`, the second line is exactly `Each person pays: $8.58` (WI-001 R-02).
3. Zero, negative, fractional, and malformed split counts produce an error instead of a share (WI-001 R-02).
4. Mike Rihm reviews this sub-item’s tested result.

## Notes

### Decisions and context

- WI-001 R-02 and the Option A design govern this sub-item. The owner approved both on 2026-09-28.
- The parent’s requirement text remains in WI-001, as required for a split.
- Owner clarification, 2026-09-28: Keep the approved rule that every share rounds up to the next cent. The person who paid the bill keeps any amount collected above the rounded Total. For a $60.00 total split seven ways, seven shares of $8.58 collect $60.06, so the payer keeps $0.06. This clarifies the settlement between friends; the command still prints the single per-person share required by R-02.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

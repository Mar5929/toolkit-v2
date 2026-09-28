TFR2-002: Add the --tip option
Location: https://app.notion.com/p/Add-the-tip-option-3e9b381da17681329539cd4b097626cf
Stage: Done | Waiting on: none | Continue with: nothing (finished)
Parent: TFR2-001 | Sub-items: none | Design: none of its own; TFR2-001's design is approved (https://app.notion.com/p/TFR2-001-Build-the-tip-split-bill-command-solution-design-3e9b381da1768133a4fbecd575748cc7). Read it with: toolkit work design TFR2-001

---
id: TFR2-002
title: Add the --tip option
type: build
stage: 14-spec-update
status: Done
parent: TFR2-001
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: none
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---
# TFR2-002: Add the --tip option

## Overview

**Goal:** Let a person choose a nonnegative tip percentage with `--tip` and see the resulting equal share.

**Current position:** Done on 2026-09-28. Approved result merged into main at 56c44fe; integrated node:test suite passed 5 tests; delivered requirements and system guide committed at 6b1c812.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Delivered TFR2-001 R-02 under its approved Option A design. Its delivered local worktree and branch were removed with the owner’s authorization.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Optional tip | The command accepts a valid `--tip` value and replaces the default 18% (TFR2-001 R-02). | Done | The `--tip 20` and `--tip 0` examples and invalid-tip tests pass. | None. |

## Tasks

### P1 — Optional tip

- [x] **P1-T01 — Add optional tip parsing** · Done  
  **Work:** Add `--tip <percent>` parsing, exact decimal percentage handling, and validation to the parent command (TFR2-001 R-02; design Technical sequence step 2).  
  **Deliverable:** Updated `bin/tip-split.js`.  
  **Done when:** `node bin/tip-split.js 84.50 3 --tip 20` prints `Each person pays $33.80`; invalid tips print the usage line and exit 1.  
  **Depends on:** TFR2-001 P1-T01.
- [x] **P1-T02 — Test optional tips** · Done  
  **Work:** Add `node:test` cases for custom, zero, fractional, large, scientific, missing, and invalid tips (TFR2-001 R-02; design Acceptance checks).  
  **Deliverable:** Updated `tests/tip-split.test.js` and recorded results.  
  **Done when:** The full suite passes; `node bin/tip-split.js 0.01 2 --tip 0` prints `Each person pays $0.01`.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Owner authorized removal of both delivered item worktrees and local branches; TFR2-002 was clean and merged into main before removal. | No local item worktree or branch remains; TFR2-002 stays Done. |
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Approved result merged into main at 56c44fe; integrated node:test suite passed 5 tests; delivered requirements and system guide committed at 6b1c812. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | Stage 13 skipped: this local command needs no deployment. | Continue stage 14 delivered behavior documentation. |
| 2026-09-28 | No remote: merged locally into main at 56c44fe. | No pull request; no deployment. Five tests passed on the integrated head; continue delivered requirements and system guide updates. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I tried it: --tip 20 gives $33.80 and a bad tip gives the usage line. I approve the TFR2-002 result. Leave the memory note for later. | Result approved; work-finish continues. Owner directly checked the 20% example and bad tip. Memory proposal remains pending. |
| 2026-09-28 | Parent changed in Notion by hand: top level -> TFR2-001. | It is a sub-item of TFR2-001 now. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-02 optional tip command at 339892d: 5 tests passed; direct 20% and zero-tip examples printed $33.80 and $0.01. Evidence: `tests/TFR2-002-TEST-PLAN.md`. No independent agent check; no gaps found. | Optional tip result is ready for separate owner approval; branches remain unmerged. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set delivery owner-led. | Part of the TFR2-001 goal; owner chose to have this agent build both results without a team. |
| 2026-09-28 | Parent changed in Notion by hand: TFR2-001 -> top level. | It is a top-level item now. |
| 2026-09-28 | Created as a sub-item of TFR2-001. It delivers TFR2-001 R-02. | Requirements approval inherited from TFR2-001 (2026-09-28 by Mike Rihm); the owner is not asked again. TFR2-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

The owner asked on 2026-09-28 to split the `--tip` part into its own sub-item under TFR2-001 so he can review it on its own.

### Agreed goal

Covers TFR2-001 R-02. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in TFR2-001; this item copies none of it.

### Active requirements

- Covers TFR2-001 R-02. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in TFR2-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. `node bin/tip-split.js 84.50 3 --tip 20` prints `Each person pays $33.80`.
2. `node bin/tip-split.js 0.01 2 --tip 0` prints `Each person pays $0.01`, checking the R-01 half-cent rule with the optional flag.
3. Missing or invalid tip values print `Usage: node bin/tip-split.js <bill> <people> [--tip <percent>]` and exit 1.
4. The owner reviews and approves this sub-item’s tested result separately.

## Notes

### Decisions and context

- The owner asked on 2026-09-28 for the `--tip` part to have its own sub-item and result review.
- TFR2-001 R-02 and the parent Option A design are approved; this sub-item inherits both.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

Follow the approved Option A design on TFR2-001.

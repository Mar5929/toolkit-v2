---
id: WI-002
title: Add the --split option
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: high
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: none
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-002: Add the --split option

## Overview

**Goal:** Add `--split` to the tip command and print the amount each person pays.

**Current position:** Done on 2026-09-28. Owner accepted split behavior on 2026-09-28; node --test passed 9 tests on main; code merged at a6d571c and documentation committed at 09432ce.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 (R-02, R-03); approved Option A design.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Split option | The command validates --split and prints a per-person amount. | Done | R-02 and split cases of R-03 pass checks alongside the plain command checks. | None. |

## Tasks

### P1 — Split option

- [x] **P1-T01 — Build split parsing and output** · Done  
  **Work:** Add --split validation and the rounded-up share to bin/tipcalc.js (WI-001 R-02 and split cases of R-03; approved design Technical sequence step 2).  
  **Deliverable:** Optional second output line and corrective split errors.  
  **Done when:** The even, uneven, half-cent, and single-person examples print correct shares; invalid split counts exit 1 with a correction.  
  **Depends on:** WI-001 P1 completion.
- [x] **P1-T02 — Check full command** · Done  
  **Work:** Add node:test process checks for WI-001 R-02 and split cases of R-03, then run all command checks.  
  **Deliverable:** Updated tests/tipcalc.test.js and a passing full test run.  
  **Done when:** Split examples and invalid split cases pass with node --test, alongside the plain command checks.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Set priority high. | Continue with nothing (finished). |
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Owner accepted split behavior on 2026-09-28; node --test passed 9 tests on main; code merged at a6d571c and documentation committed at 09432ce. |
| 2026-09-28 | Delivered requirements and system guide were committed on local main at 09432ce; WI-002 branch and worktree were removed. | Specification baseline saved; cleanup complete. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main at a6d571c. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner said: Ship it: WI-001 and WI-002. The whole tip command works the way I asked. There is no remote, so merge them into main here, then finish WI-002 and WI-001 and clean up the worktrees and branches. | Local merge and cleanup approved. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I ran it in the WI-002 worktree and it printed what I expected. I approve the WI-002 result. No merge yet. | Result approved; work-finish continues. Both branches remain unmerged. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Corrected the earlier claim that owner-led delivery excluded independent checking. An independent checker reviewed WI-001 R-01 through R-03 on WI-002 commit a6d571c; node --test passed 9 of 9, an independent CLI matrix passed 18 of 18, and git diff --check passed; no defects found. | Independent check complete; owner result review remains pending. Both branches remain unmerged. |
| 2026-09-28 | Set stage 11 User approval -> 09 Testing (status In Progress); waiting on agent. | Continue with work-check. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked WI-001 R-02 and split cases of R-03 against commit 3c46996; evidence: tests/WI-002-TEST-PLAN.md, three direct command outputs, and node --test (9 passed); gaps: no independent checker ran because the owner chose no agent team. | Result approval requested; branches remain unmerged. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Delivery owner-led (recorded on WI-001). | WI-001's delivery covers this sub-item. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-build-the-tip-command-with-split-option/WI-002-add-the-split-option/WORK-ITEM.md -> .work-items/cli/WI-001-tip-command/split-option/WORK-ITEM.md. | Same item; the toolkit uses the new path. It moved along with its parent WI-001's folder and is still its sub-item. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-02, WI-001 R-03. | Requirements approval inherited from WI-001 (2026-09-28 by Mike Rihm); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | <Specific unanswered question> | R-01, P1-T02 | Open | <owner, or another person or role> |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

The owner asked to split the --split option into its own sub-item under WI-001, so the plain tip and total can be built and checked first.

### Agreed goal

Covers WI-001 R-02, WI-001 R-03. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-02, WI-001 R-03. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. `node bin/tipcalc.js 50 --percent 20 --split 3` prints the tip and total line followed by `Each person pays: $20.00`.
2. A $10 bill at 0 percent split among 3 prints $3.34 per person, and the half-cent tip case split among 2 prints $0.03 per person.
3. Missing, zero, fractional, and malformed split counts print a corrective error and exit with code 1.
4. The full command checks pass and the owner reviews the completed split behavior.

## Notes

Checked with a real Venmo request on 2026-09-28.

### Decisions and context

- <Useful decision or context that is not itself a requirement.>

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

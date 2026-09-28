TFR-002: Add the --weeks flag to days-until
Location: https://app.notion.com/p/Add-the-weeks-flag-to-days-until-3e9b381da176815bb55ccfff40995905
Stage: Done | Waiting on: none | Continue with: nothing (finished)
Parent: TFR-001 | Sub-items: none | Design: none of its own; TFR-001's design is approved (https://app.notion.com/p/TFR-001-Build-the-days-until-command-with-a-weeks-flag-solution-design-3e9b381da17681859546d90fe3e13254). Read it with: toolkit work design TFR-001

---
id: TFR-002
title: Add the --weeks flag to days-until
type: build
stage: 14-spec-update
status: Done
parent: TFR-001
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: none
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---
# TFR-002: Add the --weeks flag to days-until

## Overview

**Goal:** Add --weeks to the days-until command so it shows whole weeks and leftover days in either flag position.

**Current position:** Done on 2026-09-28. Approved weeks result on main at 9666d71; eight node:test checks and direct CLI checks passed; requirements baseline committed at b085699.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** TFR-001 holds the approved requirements and design and delivered the base command.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Weeks display | Add --weeks before or after the date and format whole weeks and leftover days. | Done | TFR-001 R-02 and weeks-mode R-03 passed eight tests and direct CLI checks; commits e604d44 and af7015d. | None. |

## Tasks

### P1 — Weeks display

- [x] **P1-T01 — Add flag parsing and weeks formatting** · Done  
  **Work:** Extend the base command with --weeks in either argument position, whole weeks and leftover days, singular wording, zero-unit omission, and ago for past dates (TFR-001 R-02, R-03; approved design Build order step 2).  
  **Deliverable:** Extended command and weeks-mode tests.  
  **Done when:** Eight node:test checks passed; direct CLI returned 2 weeks and 3 days in both flag orders and code 1 for an impossible date.  
  **Depends on:** TFR-001 P1-T02.
- [x] **P1-T02 — Commit the weeks flag** · Done  
  **Work:** Review and commit the weeks change on the TFR-002 branch.  
  **Deliverable:** Commit e604d44 on claude/tfr-002-add-the-weeks-flag-to-days.  
  **Done when:** The full staged diff was reviewed and commit e604d44 is present on the TFR-002 branch.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Approved weeks result on main at 9666d71; eight node:test checks and direct CLI checks passed; requirements baseline committed at b085699. |
| 2026-09-28 | Delivered behavior recorded in `requirements/days-until/DAYS-UNTIL.md`; roadmap and project command updated at b085699. TFR-002 worktree and branch removed after their merge. | Ready to mark Done; main contains the approved result and its requirements baseline. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | Stage 13 skipped: this command runs locally; no deployment destination is configured. | Continue to the requirements baseline. |
| 2026-09-28 | No remote: merged locally into main at 9666d71 after updating from TFR-001; eight tests and a direct CLI check passed. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I ran it in the TFR-002 worktree: --weeks 2026-10-15 printed "2 weeks and 3 days" both ways round, and 2026-09-11 printed "2 weeks and 3 days ago". I approve the TFR-002 result. | Owner tested both flag positions and the past-date wording; TFR-002 result approved, pending approval command. |
| 2026-09-28 | Parent changed in Notion by hand: top level -> TFR-001. | It is a sub-item of TFR-001 now. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked TFR-001 R-02 and weeks-mode R-03 against commit e604d44; evidence: `tests/TFR-002-TEST-PLAN.md` at af7015d, eight passing node:test checks, and direct CLI checks; gaps: none. No independent agent check ran. | Separate TFR-002 result approval is needed before finishing; merge remains unauthorized. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set delivery owner-led. | Same days-until goal as TFR-001. Owner chose owner-led delivery and no agent team for the base command and --weeks work. |
| 2026-09-28 | Parent changed in Notion by hand: TFR-001 -> top level. | It is a top-level item now. |
| 2026-09-28 | Created as a sub-item of TFR-001. It delivers TFR-001 R-02, TFR-001 R-03. | Requirements approval inherited from TFR-001 (2026-09-28 by Mike Rihm); the owner is not asked again. TFR-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

None open.

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Owner said: "Before you build, split the --weeks part into its own sub-item under TFR-001 so I can review it on its own."

### Agreed goal

Covers TFR-001 R-02, TFR-001 R-03. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in TFR-001; this item copies none of it.

### Active requirements

- Covers TFR-001 R-02, TFR-001 R-03. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in TFR-001; this item copies none of it.

### Acceptance

This sub-item can be accepted when:

1. With --weeks before or after the date, a date 17 days away prints 2 weeks and 3 days; a date 17 days in the past prints 2 weeks and 3 days ago (TFR-001 R-02).
2. With --weeks, one day and one week use singular units; zero units are omitted; today prints 0 days (TFR-001 R-02).
3. Invalid-date and usage errors exit with code 1 in weeks mode (TFR-001 R-03).
4. The owner approves the tested --weeks result separately from the parent result.

## Notes

### Decisions and context

- Mike Rihm chose owner-led delivery on 2026-09-28 for the days-until goal. TFR-002 received its own result review.
- Mike Rihm authorized the local merge after TFR-001 on 2026-09-28. TFR-002 reached main at 9666d71, and its branch and worktree were removed.
- TFR-002 is a sub-item of TFR-001. TFR-001 holds the approved R-02 and R-03 text and the approved Option A design.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

None. TFR-001 holds the approved design for this sub-item.

---
id: WI-002
title: Document greet flags in the README
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

# WI-002: Document greet flags in the README

## Overview

**Goal:** Document every greet command-line flag in README.md with a short command and output example, as required by WI-001 R-02.

**Current position:** Done on 2026-09-28. README examples independently checked; npm test passed 6 of 6 on main; code and documentation committed through 8f16538.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 (R-02). WI-001 approved Option A covers this item.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — README examples | README.md explains every flag with a short command and output example. | Done | The documented commands match the implemented CLI output. | None. |
| P2 — Independent check | The README result is checked separately from WI-001. | Done | R-02 acceptance is checked and the result is presented to Mike for approval. | None. |

## Tasks

### P1 — README examples

- [x] **P1-T01 — Document each flag** · Done  
  **Work:** List every implemented greet flag in README.md with a short command and output example.  
  **Deliverable:** Updated README.md.  
  **Done when:** Each flag, including --times, has an example that matches actual command output.  
  **Depends on:** WI-001 command behavior.

### P2 — Independent check

- [x] **P2-T01 — Check README examples** · Done  
  **Work:** Run the documented commands and compare their output with README.md.  
  **Deliverable:** Recorded R-02 check result.  
  **Done when:** Every example matches actual output and Mike can review this sub-item on its own.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: README examples independently checked; npm test passed 6 of 6 on main; code and documentation committed through 8f16538. |
| 2026-09-28 | Requirements baseline committed on local main at 8f16538. | WI-001 R-02 is recorded in requirements/greet/GREET.md; no deployment applies. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-decide. |
| 2026-09-28 | No remote: merged locally into main. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-decide. |
| 2026-09-28 | Owner said: Yes, merge it locally into main; there is no remote. I approve the merge and the git commands you need, and you can close both items out when they are done. | Local merge of this branch into main approved; finish both items after delivery. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I approve the WI-002 README result. | Result approved; work-finish continues. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-02 at 17d584a: README commands matched output, npm test 6 passed, 0 failed; independent checker found R-02 met and no defects; evidence tests/WI-002-TEST-PLAN.md; gaps none. | WI-002 README result ready for separate owner approval. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Moved by hand with its parent WI-001: .work-items/WI-001-add-a-times-flag-to-greet/WI-002-document-greet-flags-in-the-readme/WORK-ITEM.md -> .work-items/WI-001-times-flag/WI-002-document-greet-flags-in-the-readme/WORK-ITEM.md. | Same item; the toolkit uses the new path. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from WI-001 (2026-09-28 by Mike Rihm); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Mike asked to put the README documentation part of WI-001 into its own sub-item so it can be built and checked on its own (2026-09-28).

### Agreed goal

Covers WI-001 R-02. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-02. The requirement text and its approval (2026-09-28 by Mike Rihm) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. README.md lists every implemented greet command-line flag, including --times, with a short command and output example for each.
2. The documented commands are run and their output matches the README examples.
3. Mike reviews and approves the README result separately from WI-001.

## Notes

### Decisions and context

Mike approved Option A for WI-001 on 2026-09-28 and asked for README documentation to be built and checked separately. WI-001 R-02 and its approval remain in the parent item.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

Use WI-001 approved Option A; no additional design choice is needed.

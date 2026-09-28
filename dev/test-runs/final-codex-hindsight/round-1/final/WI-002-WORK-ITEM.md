---
id: WI-002
title: Document --shout in README
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike"
design: none
result_approved: "2026-09-28 by Mike"
updated: 2026-09-28
---

# WI-002: Document --shout in README

## Overview

**Goal:** Document --shout in README.md so a reader can understand and run it.

**Current position:** Done on 2026-09-28. README example printed HELLO, MIKE!; npm test passed 5 of 5; code and documentation are on local main in commits d961e1e and 8fc70ea.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 delivers R-01 and owns the approved R-02 requirement. WI-002 delivered the README documentation.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Document and verify | README explains --shout and shows a working command | Done | README command prints the documented output; R-02 checked separately | None. |

## Tasks

### P1 — Document and verify

- [x] **P1-T01 — Write README flag guidance** · Done  
  **Work:** Explain --shout and add a usable command with its expected output to README.md.  
  **Deliverable:** Updated README.md.  
  **Done when:** The README states what the flag does and shows a full command and output.  
  **Depends on:** WI-001 CLI behavior.
- [x] **P1-T02 — Check documented example** · Done  
  **Work:** Run the exact command in README.md and compare its output with the documented result.  
  **Deliverable:** R-02 verification recorded in WI-002 history.  
  **Done when:** The command runs and prints the documented uppercase greeting.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike); marked Done by Mike. | Evidence: README example printed HELLO, MIKE!; npm test passed 5 of 5; code and documentation are on local main in commits d961e1e and 8fc70ea. |
| 2026-09-28 | Delivered README behavior saved in the requirements baseline on local main in commit 8fc70ea. | Specification baseline complete; finish WI-002. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main as part of the combined branch. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I approve the WI-001 CLI result and I approve the WI-002 README result. And yes to that memory proposal about working directly on small changes: keep it. | WI-002 README result approved; work-finish continues. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-02 on commit d961e1e: README explains --shout, its position, and default name; its exact command node bin/greet.mjs --shout Mike printed HELLO, MIKE!; npm test passed 5 of 5 on the combined branch. No independent agent check ran because Mike requested no helpers. Gaps: none found. | README result ready for Mike’s separate approval. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Delivery owner-led (recorded on WI-001). | WI-001's delivery covers this sub-item. |
| 2026-09-28 | Moved by hand: .work-items/WI-001-add-shout-flag-to-greet-cli/WI-002-document-shout-in-readme/WORK-ITEM.md -> .work-items/WI-001-add-shout-flag-to-greet-cli/docs/WI-002-readme/WORK-ITEM.md. | Its parent stays WI-001. Group: docs. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from WI-001 (2026-09-28 by Mike); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

## Requirements

**Overall status:** Finalized  
**Finalization rule:** WI-002 covers approved WI-001 R-02; its requirement and Mike’s 2026-09-28 approval remain in WI-001.

### Starting request

Mike asked to put the README documentation part into its own sub-item so it can be built and checked on its own.

### Agreed goal

Document --shout in README.md as required by WI-001 R-02. The requirement text and approval remain in WI-001.

### Active requirements

- Covers WI-001 R-02. No new behavior or requirement is added.

### Acceptance

This work item can be accepted when:

1. README.md explains what --shout does.
2. README.md shows a complete command a reader can run and the uppercase greeting it prints.
3. The exact documented command has been run successfully and its output checked.
4. Mike reviews this sub-item’s checked result separately.

## Notes

### Decisions and context

- Mike asked on 2026-09-28 for the README work to be built and checked on its own.
- WI-001 Option A design covers the CLI behavior and this README change.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

- Use the command and expected output specified by the approved Option A design.

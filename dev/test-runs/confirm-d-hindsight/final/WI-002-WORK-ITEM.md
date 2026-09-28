---
id: WI-002
title: Document the --shout flag in README
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

# WI-002: Document the --shout flag in README

## Overview

**Goal:** Document --shout in README.md with a working command and output example, fulfilling WI-001 R-02.

**Current position:** Done on 2026-09-28. README on local main at 9c30dd9 documents --shout; its exact example printed HELLO, MIKE!; npm test passed 7 of 7; delivered rule committed at f2d8a08.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 (R-02). Design: WI-001 approved Option A. WI-001 delivered the CLI behavior; WI-002 delivered the README documentation.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Document flag | README.md explains --shout and shows a command/output example. | Done | README.md contains both. | None. |
| P2 — Check documentation | The example matches the built CLI and R-02. | Done | Example command produces the shown output; Mike reviews the child result. | None. |

## Tasks

### P1 — Document flag

- [x] **P1-T01 — Write README example** · Done  
  **Work:** Describe --shout and add a command/output example.  
  **Deliverable:** README.md.  
  **Done when:** The README tells a reader how to run the flag and what output to expect.  
  **Depends on:** WI-001 P1-T01.

### P2 — Check documentation

- [x] **P2-T01 — Verify example** · Done  
  **Work:** Run the exact command shown in README.md and compare stdout with the example.  
  **Deliverable:** Check evidence in WI-002.  
  **Done when:** The output matches, R-02 is checked, and the child result is ready for owner approval.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike); marked Done by Mike. | Evidence: README on local main at 9c30dd9 documents --shout; its exact example printed HELLO, MIKE!; npm test passed 7 of 7; delivered rule committed at f2d8a08. |
| 2026-09-28 | Delivered rule recorded in requirements/greeting/GREETING.md on main at f2d8a08. | Specification update complete; no remote or deployment. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main at 9c30dd9 through WI-001. | README documentation reached main; its example printed HELLO, MIKE! and npm test passed 7 of 7. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner's words: I approve the WI-002 README result. | WI-002 result approved; continue delivery and parent acceptance. |
| 2026-09-28 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked README.md on branch claude/wi-002-document-the-shout-flag-in at commit 9c30dd9: node bin/greet.mjs --shout Mike printed HELLO, MIKE! as documented; npm test passed 7 of 7; git diff --check passed. WI-001 R-02 met. No known gaps. No independent checker ran at Mike’s request for no helper agents. | Continue with work-check. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Delivery owner-led (recorded on WI-001). | WI-001's delivery covers this sub-item. |
| 2026-09-28 | Moved by hand: .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/WI-002-document-the-shout-flag-in-readme/WORK-ITEM.md -> .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/docs/WI-002-readme/WORK-ITEM.md. | Its parent stays WI-001. Group: docs. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from WI-001 (2026-09-28 by Mike); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

## Requirements

**Overall status:** Finalized  
**Finalization rule:** WI-001 R-02 and its approval govern this child; they are not copied or approved again.

### Starting request

Mike asked: "put the README documentation part into its own sub-item, so it can be built and checked on its own."

### Agreed goal

Deliver WI-001 R-02 as an independent child item. The requirement text and Mike's 2026-09-28 approval remain in WI-001.

### Active requirements

- Covers WI-001 R-02. See the parent for the approved behavior and acceptance check.

### Acceptance

This child can be accepted when README.md describes --shout, includes a working example, the exact shown command prints the shown output, and Mike approves this child's finished result.

## Notes

### Decisions and context

- Mike requested that README documentation be built and checked on its own. WI-001 R-02 and the approved Option A design cover this child.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

No additional design choice is needed; use WI-001's approved Option A.

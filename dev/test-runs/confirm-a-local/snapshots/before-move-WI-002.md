---
id: WI-002
title: Add --lines line count
type: build
stage: 06-implementation-plan
status: In Progress
parent: WI-001
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike"
design: none
result_approved: "no"
updated: 2026-09-28
---

# WI-002: Add --lines line count

## Overview

**Goal:** Mike can use --lines with tally to print the line count of a text file.

**Current position:** Created under WI-001 to deliver its approved R-02. The approved WI-001 design covers this item.

**Next action:** The agent plans WI-002, then builds it after the WI-001 word-count command is available.

**Blockers:** Depends on WI-001 P1 code.

**Related items:** Parent WI-001; covers its R-02 and uses its approved design.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Line count flag | --lines prints the line count instead of the word count | Not Started | R-02 and argument/error checks pass | None. |

## Tasks

### P1 — Line count flag

- [ ] **P1-T01 — Add line mode** · Not Started  
  **Work:** Extend bin/tally.js to parse --lines before the path and count lines (WI-001 R-02; Option A build order step 2).  
  **Deliverable:** The --lines mode.  
  **Done when:** Blank, trailing-break, final nonempty, CRLF, and empty-file counts match the design.  
  **Depends on:** WI-001 P1.
- [ ] **P1-T02 — Check line mode** · Not Started  
  **Work:** Extend tests/tally.test.js with R-02 and invalid flag checks (Option A build order step 3).  
  **Deliverable:** Automated line-mode checks.  
  **Done when:** node --test passes and a manual --lines command prints the expected count.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from WI-001 (2026-09-28 by Mike); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Approval is inherited from WI-001 for R-02.

### Starting request

Mike asked to keep word count in WI-001 and make the --lines flag its own sub-item under it.

### Agreed goal

WI-002 delivers WI-001 R-02. The requirement text and its 2026-09-28 approval by Mike stay in WI-001.

### Active requirements

- Covers WI-001 R-02. Read the approved behavior and acceptance check there.

### Acceptance

This work item can be accepted when:

1. The --lines command passes WI-001 R-02 acceptance checks, including blank lines, trailing breaks, final lines without breaks, and empty files.
2. The command rejects invalid flag use and reports file errors as Option A specifies.
3. Mike reviews the tested WI-002 result.

## Notes

### Decisions and context

- Mike requested this split on 2026-09-28. WI-002 inherits approval for WI-001 R-02 and the approved Option A design.
- Build after WI-001 P1 is available; use its code as the starting point.

### Resume here

Plan complete. After WI-001 P1 is built, create the WI-002 worktree from the WI-001 code and build P1 here.

### Solution options and considerations

- Follow the approved Option A in WI-001.

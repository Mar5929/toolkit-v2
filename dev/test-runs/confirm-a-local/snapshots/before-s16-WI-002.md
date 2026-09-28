---
id: WI-002
title: Add --lines line count
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

# WI-002: Add --lines line count

## Overview

**Goal:** Mike can use --lines with tally to print the line count of a text file.

**Current position:** Done on 2026-09-28. WI-002 line mode reached local main at ff3721a; all nine node:test checks passed after merging main into its branch; Mike approved the observed 4, 2, and 0 examples; delivered requirements and system guide are on main at f86ba9c.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001; WI-002 delivered its R-02 with the approved design.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Line count flag | --lines prints the line count instead of the word count | Done | R-02 and argument/error checks passed in commit 2627347 | None. |

## Tasks

### P1 — Line count flag

- [x] **P1-T01 — Add line mode** · Done  
  **Work:** Extend bin/tally.js to parse --lines before the path and count lines (WI-001 R-02; Option A build order step 2).  
  **Deliverable:** The --lines mode.  
  **Done when:** Blank, trailing-break, final nonempty, CRLF, and empty-file counts match the design.  
  **Depends on:** WI-001 P1.
- [x] **P1-T02 — Check line mode** · Done  
  **Work:** Extend tests/tally.test.js with R-02 and invalid flag checks (Option A build order step 3).  
  **Deliverable:** Automated line-mode checks.  
  **Done when:** node --test passes and a manual --lines command prints the expected count.  
  **Depends on:** P1-T01.

Evidence: commit 2627347; node --test passed 9 checks; direct --lines command printed 77, matching wc -l.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike); marked Done by Mike. | Evidence: WI-002 line mode reached local main at ff3721a; all nine node:test checks passed after merging main into its branch; Mike approved the observed 4, 2, and 0 examples; delivered requirements and system guide are on main at f86ba9c. |
| 2026-09-28 | Delivered behavior recorded in requirements/tally/TALLY.md and system-guide/tally.md; project phase recorded in PROJECT-ROADMAP.md. No remote: documents committed locally on main at f86ba9c. | Specification update complete for WI-002. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main. | WI-002 code and test plan reached main at ff3721a after merging main into its branch; all nine node:test checks passed; no pull request or deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner words: Ship it: WI-001 and WI-002. There is no remote and I do not want a GitHub repo, so merge them into main locally. I approve that merge and the git commands Codex asks for to do it. Then mark both done and clean up their worktrees and branches. | Local merge, finish, and cleanup authorized for WI-001 and WI-002. |
| 2026-09-28 | Owner words: Not yet on the merge. For WI-002, in its worktree --lines printed 4 for a four-line file, 2 for a file with one and two line breaks, and 0 for an empty file. I approve the WI-002 result. | Mike confirmed three line-count examples and approved the WI-002 result. Continue with work-finish; merge remains a separate decision. |
| 2026-09-28 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Mike said his only tally machine is a Mac mini running Node 22. | Use that machine and Node version when reviewing the --lines result; Node 22 compatibility is not established by the checks recorded so far. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked WI-002 R-02 at 36cb2a2: nine automated checks passed, direct line count printed 77 matching wc -l, and independent acceptance review found no defects. No known gaps; owner review and merge not run. | Request Mike result approval for WI-002; merge remains separate. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Line mode built and committed as 2627347; nine node:test checks pass and a direct line count matched wc -l. | Proceed to acceptance checking and owner review; do not merge yet. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-build-tally-word-count-cli/WI-002-add-lines-line-count/WORK-ITEM.md -> .work-items/counting/WI-001-word-count/lines-flag/WORK-ITEM.md. | Same item; the toolkit uses the new path. It moved along with its parent WI-001's folder and is still its sub-item. |
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
- Mike approved the WI-002 result on 2026-09-28 after running the three line-count examples in its worktree. He said not yet on the merge.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

- Follow the approved Option A in WI-001.

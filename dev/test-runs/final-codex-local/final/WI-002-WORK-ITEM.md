---
id: WI-002
title: Build basic slug command
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

# WI-002: Build basic slug command

## Overview

**Goal:** Build the title-to-slug command for WI-001 R-01.

**Current position:** Done on 2026-09-28. Commit d6f9221 on local main; R-01 CLI checks passed, Mike ran command cases and approved the result; delivered documentation committed as 0d3a6d9.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 (R-01). WI-003 extends this command.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
| --- | --- | --- | --- | --- |
| P1 — Basic command | A title becomes a slug | Done | WI-001 R-01 command cases passed | None. |

## Tasks

### P1 — Basic command

- [x] **P1-T01 — Implement title conversion** · Done  
  **Work:** Add `bin/slug.js` using WI-001 R-01 and the approved design end-to-end flow.  
  **Deliverable:** A command that converts titles and reports empty-content errors.  
  **Done when:** Hello World!, Café, and punctuation-only inputs have the expected stdout, stderr, and exit code.  
  **Depends on:** None.
- [x] **P1-T02 — Check the command** · Done  
  **Work:** Add CLI checks with built-in `node:test` and run them.  
  **Deliverable:** `tests/slug.test.js` and a recorded test result.  
  **Done when:** Automated R-01 acceptance cases pass.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Commit d6f9221 on local main; R-01 CLI checks passed, Mike ran command cases and approved the result; delivered documentation committed as 0d3a6d9. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main as d6f9221. | No pull request or deployment; requirements and system guide committed as 0d3a6d9. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner said: Ship it: WI-002 and WI-003. There is no remote, so merge them into main here, then finish WI-002, WI-003, and WI-001 and clean up the branches and worktrees. I approve the Git commands for that. | Merge and local cleanup authorized; WI-002 reached main at d6f9221. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I ran it in the WI-002 worktree: "Hello World!" printed hello-world, "Café au lait" printed cafe-au-lait, and "!!!" gave an error. I approve the WI-002 result. | Result approved; work-finish continues. The owner also confirmed three command cases in the WI-002 worktree. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked commit d6f9221: node --test tests/slug.test.js passed 4 of 4; independent checker verified R-01 CLI cases and found no defects. | Ready for Mike to review the WI-002 result; branch remains unmerged. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Moved by hand with its parent WI-001: .work-items/WI-001-build-slug-command-with-max-option/WI-002-build-basic-slug-command/WORK-ITEM.md -> .work-items/slug-cli/WI-001-slug/WI-002-build-basic-slug-command/WORK-ITEM.md. | Same item; the toolkit uses the new path. |
| 2026-09-28 | Planned R-01 command work; Git worktree creation was rejected by automatic approval review because AskForApproval is set to Never. | Waiting for Mike to approve or run the exact worktree command in an interactive session before build. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-01. | Requirements approval inherited from WI-001 (2026-09-28 by Mike Rihm); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
| --- | --- | --- | --- | --- |

None open.

## Requirements

**Overall status:** Finalized

### Starting request

Mike asked to split the basic slug command and the `--max` option into separate sub-items before building.

### Agreed goal

Covers WI-001 R-01. The requirement text and approval (2026-09-28 by Mike Rihm) stay in WI-001.

### Active requirements

- Covers WI-001 R-01.

### Acceptance

This work item can be accepted when:

1. `node bin/slug.js "Hello World!"` prints `hello-world` and a newline.
2. `Café` prints `cafe` and a newline.
3. Punctuation-only input prints an error and exits with code 1.
4. Mike reviews the WI-002 result.

## Notes

### Decisions and context

Mike approved Option A for WI-001 on 2026-09-28 and directed this split. WI-001 holds the approved design and R-01.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

Option A was approved in WI-001. This child uses the one-file command design.

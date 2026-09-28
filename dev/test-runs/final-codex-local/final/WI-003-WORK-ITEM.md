---
id: WI-003
title: Add max length option to slug command
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

# WI-003: Add max length option to slug command

## Overview

**Goal:** Add `--max` to the slug command for WI-001 R-02.

**Current position:** Done on 2026-09-28. Commit 4d20885 on local main; seven CLI checks passed, Mike ran max option cases and approved the result; delivered documentation committed as 0d3a6d9.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 (R-02). Builds on WI-002.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
| --- | --- | --- | --- | --- |
| P1 — Maximum length | The existing command accepts `--max` | Done | WI-001 R-02 command cases passed; R-01 regression cases passed | None. |

## Tasks

### P1 — Maximum length

- [x] **P1-T01 — Implement max argument** · Done  
  **Work:** Extend `bin/slug.js` with WI-001 R-02 using the approved design end-to-end flow.  
  **Deliverable:** A command that validates `--max`, limits length, and removes a trailing hyphen.  
  **Done when:** Valid and invalid R-02 cases have the expected stdout, stderr, and exit code.  
  **Depends on:** WI-002 basic command.
- [x] **P1-T02 — Check max behavior** · Done  
  **Work:** Extend the CLI checks with built-in `node:test` and run them.  
  **Deliverable:** Automated R-02 checks and a recorded test result.  
  **Done when:** R-02 cases pass and R-01 cases still pass.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Commit 4d20885 on local main; seven CLI checks passed, Mike ran max option cases and approved the result; delivered documentation committed as 0d3a6d9. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main as 4d20885. | No pull request or deployment; requirements and system guide committed as 0d3a6d9. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner said: Ship it: WI-002 and WI-003. There is no remote, so merge them into main here, then finish WI-002, WI-003, and WI-001 and clean up the branches and worktrees. I approve the Git commands for that. | Merge and local cleanup authorized; WI-003 reached main at 4d20885. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: In the WI-003 worktree, --max 5 and --max 6 both printed hello, and --max 0 and --max abc gave errors. I approve the WI-003 result. Still no merge yet. | Result approved; work-finish continues. No merge authorized. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked commit 4d20885: node --test tests/slug.test.js passed 7 of 7; independent checker verified R-02 and R-01 regression CLI cases and found no defects. | Ready for Mike to review the WI-003 result; branch remains unmerged. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-build-slug-command-with-max-option/WI-003-add-max-length-option-to-slug-command/WORK-ITEM.md -> .work-items/slug-cli/WI-001-slug/max-option/WORK-ITEM.md. | Same item; the toolkit uses the new path. It moved along with its parent WI-001's folder and is still its sub-item. |
| 2026-09-28 | Created as a sub-item of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from WI-001 (2026-09-28 by Mike Rihm); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
| --- | --- | --- | --- | --- |

None open.

## Requirements

**Overall status:** Finalized

### Starting request

Mike asked to split the basic slug command and the `--max` option into separate sub-items before building.

### Agreed goal

Covers WI-001 R-02. The requirement text and approval (2026-09-28 by Mike Rihm) stay in WI-001.

### Active requirements

- Covers WI-001 R-02.

### Acceptance

This work item can be accepted when:

1. `--max 5` with Hello World prints `hello`.
2. `--max 6` with Hello World prints `hello` after removing the trailing hyphen.
3. Missing, zero, negative, and non-whole max values each print an error and exit with code 1.
4. Mike reviews the WI-003 result.

## Notes

### Decisions and context

Mike approved Option A for WI-001 on 2026-09-28 and directed this split. WI-001 holds the approved design and R-02.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

Option A was approved in WI-001. This child extends the one-file command design.

Shipped to my blog on 2026-09-28.

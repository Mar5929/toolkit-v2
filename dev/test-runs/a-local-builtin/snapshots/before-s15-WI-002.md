---
id: WI-002
title: Add a --version flag to the greet CLI
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: "2026-09-27 by Mike"
design: none
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-002: Add a --version flag to the greet CLI

## Overview

**Goal:** Add `--version` to the greet CLI, reading `0.1.0` from `package.json` as approved in Option A.

**Current position:** Version flag delivered at commit `ce657c1` on `main`. Mike approved the result on 2026-09-27. The full five-test suite passed on `main`. Delivered behavior is recorded in `requirements/greet-cli.md` at commit `be8468b`.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 owns R-02 and its approved design; WI-002 delivered R-02.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Version flag | `--version` reads `0.1.0` from `package.json` and takes precedence over a name. | Done | All three R-02 command outputs were exact; the five-test suite passed on main; Mike approved the result on 2026-09-27. | None |

## Tasks

### P1 — Version flag

- [x] **P1-T01 — Add the version source and flag** · Done  
  **Work:** Add `package.json` with version `0.1.0` and update `bin/greet.js` to print that version when any argument is exactly `--version` (WI-001 R-02; approved design Option A).  
  **Deliverable:** Version metadata and flag behavior.  
  **Done when:** The three approved R-02 commands print only `0.1.0\n`.  
  **Depends on:** WI-001 P1-T01.
- [x] **P1-T02 — Test version precedence** · Done  
  **Work:** Add `node:test` cases for `--version` alone and with a name in either order.  
  **Deliverable:** Version CLI tests.  
  **Done when:** `node --test tests/greet.test.js` passes with exact standard output, exit status, and empty standard error checks.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Commit ce657c1 reached main; node --test tests/greet.test.js passed 5/5 on main on 2026-09-27; Mike approved the three version command results; delivered behavior documented at be8468b. |
| 2026-09-27 | Delivered version behavior recorded in requirements/greet-cli.md at be8468b on main. | Specification update completed locally; no remote or deployment. |
| 2026-09-27 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Owner's words: 'Ship it: WI-001 and WI-002. There is no remote and I do not want a GitHub repo, so merge them into main locally. I approve that merge and the git commands Codex asks for to do it. Then mark both done and clean up their worktrees and branches.' No remote: merged locally into main at ce657c1. | WI-002 is on main; no pull request or deployment. |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Owner's words: 'Not yet on the merge. For WI-002, in its worktree node bin/greet.js --version printed 0.1.0, and with Mike before or after --version it printed 0.1.0 too. I approve the WI-002 result.' | WI-002 result approved by Mike; merge remains unapproved. |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked R-02 at ce657c1: all three version commands produced exact stdout, empty stderr, and exit 0; both greetings still passed; node --test tests/greet.test.js passed 5/5. Independent checker found no defects. | WI-002 is ready for Mike to review its result. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-27 | Folder renamed by hand: .work-items/WI-001-add-a-version-flag-to-the-greet-cli/WI-002-add-a-version-flag-to-the-greet-cli/WORK-ITEM.md -> .work-items/cli/WI-001-basic-greet-cli/version-flag/WORK-ITEM.md. | Same item; the toolkit uses the new path. Its parent WI-001 moved too. |
| 2026-09-27 | Created as a sub-item of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from WI-001 (2026-09-27 by Mike); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

None open.

## Requirements

<!-- Starting request records what was asked; Agreed goal records the outcome the owner accepted. Under Active requirements, create one R-ID subsection per explicit behavior. Fill every labeled field under each R-ID. Keep an item Refining until its required behavior and acceptance check are clear and owner approval is recorded; mark Superseded only with a replacement link. Put solution ideas in the final Notes subsection, not here. -->

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Make the --version flag its own sub-item under WI-001. Use Option A: read version 0.1.0 from package.json.

### Agreed goal

Covers WI-001 R-02. The requirement text and its approval (2026-09-27 by Mike) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-02. The requirement text and its approval (2026-09-27 by Mike) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when WI-001 R-02's three commands each print only `0.1.0\n`, the automated checks pass, and Mike reviews the tested result.

## Notes

### Decisions and context

- Mike chose Option A on 2026-09-27. The version number comes from `package.json`.
- This sub-item delivers WI-001 R-02 and inherits its approved requirements and design.
- Mike authorized Git worktree, add, and commit commands for both items on 2026-09-27, but did not authorize a merge.
- Mike approved the WI-002 result on 2026-09-27 after seeing `0.1.0` from `node bin/greet.js --version` and with Mike before or after `--version` in the WI-002 worktree.

### Resume here

Finished on 2026-09-27. Nothing to resume.

### Solution options and considerations

- Option A is approved in WI-001 DESIGN.md.

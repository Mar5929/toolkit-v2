---
id: WI-003
title: Add --version flag to greet CLI
type: build
stage: 14-spec-update
status: Done
parent: WI-002
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: 2026-09-27 by Mike
design: none
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-003: Add --version flag to greet CLI

## Overview

**Goal:** Add the `--version` flag to the greet command, covering WI-002 R-02.

**Current position:** Delivered on local `main` in commit `3cf4d87`. The approved version commands and both greeting regressions passed; `node --test` passed all 4 tests on `main`. Mike approved the result and the local merge on 2026-09-27. The worktree and branch were removed.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-002 supplies the command and owns approved R-02.

## Roadmap

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Add and verify version output | The command reads `package.json` for its version. | Planned | Both approved version commands print `0.1.0` with a newline, and tests pass. | None |

## Tasks

### P1 — Add and verify version output

- [x] **P1-T01 — Add the version source and flag** · Done  
  **Work:** Add `package.json` with version `0.1.0`. Update `bin/greet.js` to read its version relative to the script and check all arguments for `--version` before greeting.  
  **Deliverable:** Version output from the greet command.  
  **Done when:** Both approved version commands print `0.1.0` with a newline.  
  **Depends on:** WI-002 P1-T01.  
  **Evidence:** Commit `3cf4d87`; both version commands printed the approved line.
- [x] **P1-T02 — Verify version behavior** · Done  
  **Work:** Add process-level `node:test` checks for the flag alone and with a name.  
  **Deliverable:** Passing R-02 tests.  
  **Done when:** `node --test` passes and both approved version commands have been checked.  
  **Depends on:** P1-T01.  
  **Evidence:** `node --test` passed 4 tests on commit `3cf4d87`; both version commands passed.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Commit 3cf4d87 reached local main; both approved version commands and node --test (4 passing tests) passed on main; delivered project documents reached main in 9e544f6; worktree and branch removed. |
| 2026-09-27 | Merged locally into main as commit 3cf4d87; all 4 node --test checks passed on main. Delivered requirements and system guide in 9e544f6. Removed WI-003 worktree and branch; no remote exists. |  |
| 2026-09-27 | Set stage 11 User approval -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Owner's words: 'Ship it: WI-002 and WI-003. There is no remote and I do not want a GitHub repo, so merge them into main locally. I approve that merge and the git commands Codex asks for to do it. Then mark both done and clean up their worktrees and branches.' Local merge and cleanup approved on 2026-09-27. |  |
| 2026-09-27 | Owner's words: 'Not yet on the merge. First WI-003: in its worktree, node bin/greet.js --version printed 0.1.0, and node bin/greet.js Mike --version printed 0.1.0 too. I approve the WI-003 result.' Result approved; merge remains unapproved. |  |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked R-02 at 3cf4d87: both exact version outputs and greeting regressions passed, node --test passed 4 tests with 0 failures, and an independent checker found no defects or unrun checks. |  |
| 2026-09-27 | Mike authorized Git worktree add, add, and commit for the work branches, with no merge yet. Built R-02 on commit 3cf4d87; all 4 node:test checks and direct commands passed. Independent acceptance review is in progress. |  |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Set stage 06 Implementation plan -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set waiting on agent. | Continue with work-on. |
| 2026-09-27 | Set waiting on external: Git write permission. | Waits on Git write permission. |
| 2026-09-27 | Set waiting on agent. | Continue with work-on. |
| 2026-09-27 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-27 | Mike requested a separate --version sub-item under WI-002 and chose Option A on 2026-09-27. WI-003 covers approved WI-002 R-02 and uses the approved parent design. |  |
| 2026-09-27 | Created as a sub-item of WI-002. It delivers WI-002 R-02. | Requirements approval inherited from WI-002 (2026-09-27 by Mike); the owner is not asked again. Starts at 03 Requirements approved. Continue with solution-design. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Which version source should the CLI use? Mike chose Option A, reading `package.json` at runtime, on 2026-09-27. | WI-002 R-02, P1-T01 | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** The owner approved WI-002 R-02 on 2026-09-27. This item covers that requirement without copying its text or asking for another approval.

### Starting request

Mike asked: “Keep the basic greeting in WI-002 and make the --version flag its own sub-item under it.”

### Agreed goal

Add `--version` to the greet command. This item covers WI-002 R-02; its text and approval stay in WI-002.

### Active requirements

- Covers WI-002 R-02, approved by Mike on 2026-09-27. See the parent requirement for behavior, boundaries, and acceptance checks.

### Acceptance

This item can be accepted when the two WI-002 R-02 command examples print `0.1.0` followed by a newline, automated tests pass, and Mike reviews the result.

## Notes

### Decisions and context

- Mike chose Option A on 2026-09-27: read the version from `package.json` at runtime.
- The approved WI-002 design covers this sub-item; no new behavior or design approval was needed.
- Project memory records a preference for plain Node.js, no npm packages, and `node:test`.
- Mike approved the local merge into `main` on 2026-09-27.

### Resume here

WI-003 reached local `main` in commit `3cf4d87` on 2026-09-27. Both version commands and all 4 tests passed on `main`; its worktree and branch were removed. The delivered requirements and system guide reached `main` in `9e544f6`. No Git remote is configured.

### Solution options and considerations

- Option A, selected by Mike: `package.json` is the single version source.

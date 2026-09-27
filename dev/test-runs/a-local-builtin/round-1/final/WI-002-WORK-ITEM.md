---
id: WI-002
title: Add --version flag
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: "2026-09-27 by Mike"
design: approved
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-002: Add --version flag

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Add `--version` to the greet CLI as a separate sub-item of WI-001.

**Current position:** Version commit `41fbaab` is on main after greeting commit `78bbe1e`. `node --test` passed all three checks after the merge. The delivered behavior is recorded in `requirements/greeting/GREETING.md` and `system-guide/GREETING.md`.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 covers basic greetings. This item corresponds to the original WI-001 R-02.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Add version flag | The CLI prints the package version for --version. | Complete | The retained code printed 0.1.0 on 2026-09-27; Mike approved the WI-002 result. | None. |
| P2 — Verify version flag | A test and direct run check the exact version output. | Complete | The version test and direct run passed on 2026-09-27; Mike approved the WI-002 result. | None. |

## Tasks

### P1 — Add version flag

- [x] **P1-T01 — Add version output** · Built  
  **Work:** Read the version from `package.json` for `--version` alone.  
  **Deliverable:** Version handling in `bin/greet.js` and the declared version in `package.json`.  
  **Done when:** `node bin/greet.js --version` prints only `0.1.0` and exits successfully.  
  **Depends on:** WI-001 greeting CLI.

### P2 — Verify version flag

- [x] **P2-T01 — Check version output** · Checked  
  **Work:** Run the version command and an automated check against the declared package version.  
  **Deliverable:** Version check in `tests/greet.test.js`.  
  **Done when:** The test and direct run produce the approved initial value and match `package.json`.  
  **Depends on:** P1-T01.

## Recent History

<!-- Add one row for each material decision or progress change, newest first. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog); waiting on owner. | Own requirements approval is needed after Mike requested this sub-item. |
| 2026-09-27 | Created under WI-001 at Mike's request. This item owns the original WI-001 R-02 and retains Mike's 0.1.0 and Option A decisions; its own approvals remain outstanding. |  |
| 2026-09-27 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design updated. | The owner approves it before building starts. |
| 2026-09-27 | Rechecked the retained version implementation on 2026-09-27: node --test passed 3 tests overall (1 for WI-002); direct --version run printed 0.1.0 and exited successfully. Created a separate WI-002 test plan. Requirements, design, and result approvals remain with Mike. |  |
| 2026-09-27 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-27 | Owner's words: Approved: I approve the WI-002 requirement as written. |  |
| 2026-09-27 | Set waiting on owner. |  |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-27 | Owner's words: I approve the WI-002 design, option A. Keep going. |  |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Set stage 03 Requirements approved -> 08 Build (status In Progress). | Resume the retained Option A implementation after separate WI-002 design approval. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Design updated (status approved). | The design can be built. |
| 2026-09-27 | Checked approved Option A: node --test passed 3 tests (1 for WI-002); direct --version run produced 0.1.0 and a newline; package.json declares 0.1.0. No test failures. Code remains uncommitted in the WI-001 worktree. |  |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Continue with work-decide. |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Owner's words: I ran node bin/greet.js --version in the worktree and it printed 0.1.0. I approve the WI-002 result. |  |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Mike explicitly approved the local merge of WI-001 and WI-002 on 2026-09-27. node --test passed all 3 tests, including the version check. Git staging was denied while creating .git/worktrees/wi-001-greet-cli/index.lock, so WI-002 remains uncommitted and unmerged. |  |
| 2026-09-27 | Mike approved commits and a local merge with no remote or GitHub repository. Version commit 41fbaab followed greeting commit 78bbe1e and both fast-forwarded into main; moving directly to the delivered specifications because no pull request applies. |  |
| 2026-09-27 | Set stage 11 User approval -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Version commit 41fbaab and documentation commit 85f4206 are on main; node --test passed 3 checks with 0 failures; node bin/greet.js --version printed 0.1.0; Mike approved the result and local merge. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Use `0.1.0` as the initial package version, and print `0.1.0` for `--version`? | R-01 | Answered 2026-09-27: Yes; Mike chose `0.1.0` and exact version output for the original WI-001 R-02. | owner |
| Q-02 | Which source should --version use: package.json (Option A) or a value in the CLI (Option B)? | Design for R-01 | Answered 2026-09-27: Option A (`package.json`), chosen by Mike for the original WI-001 design. | owner |
| Q-03 | Approve this separated WI-002 requirement, copied without behavior changes from the previously approved WI-001 R-02? | R-01 | Answered 2026-09-27: Mike said, "Approved: I approve the WI-002 requirement as written." | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mike approved WI-002 R-01 on 2026-09-27 with the words, "Approved: I approve the WI-002 requirement as written."

### Starting request

Mike asked to make the --version flag its own sub-item under WI-001, leaving the basic greeting in WI-001.

### Agreed goal

Add a `--version` flag to the greeting CLI that prints its initial version.

### Active requirements

#### R-01 — Show the tool version (moved from WI-001 R-02)

**Status:** Finalized  
**Applies to:** A person running the CLI with `--version`.  
**Required behavior:** The initial version is `0.1.0`. The CLI prints only `0.1.0` and a newline, then exits successfully.  
**Boundaries and exceptions:** This behavior applies when `--version` is the sole argument.  
**Acceptance check:** `node bin/greet.js --version` prints exactly `0.1.0` and a newline, exits successfully, and matches the declared package version.  
**Decision record:** Owner, 2026-09-27: "yes, start at version 0.1.0 and print just 0.1.0 for --version." Previously approved as WI-001 R-02 by Mike on 2026-09-27. Mike approved it for WI-002 on 2026-09-27: "Approved: I approve the WI-002 requirement as written."  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. `--version` prints exactly `0.1.0` and exits successfully.
2. The output matches the version declared in `package.json`, confirmed by an automated check and direct run.
3. Mike reviews this result separately from the basic greeting in WI-001.

## Notes

### Decisions and context

- Mike asked on 2026-09-27 to separate --version from the greeting before approving either result.
- Mike approved Option A for WI-002 on 2026-09-27: read the version from `package.json`. WI-002's approved DESIGN.md records the approach.
- The version code and test were written before this sub-item was created; the item records that history without treating it as a new approval.
- Mike approved the WI-002 result on 2026-09-27 after running the version command and seeing `0.1.0`.

### Resume here

WI-002 version flag is delivered on main in commit `41fbaab`. Mike approved the result and the local merge. The delivered requirements and system guide are on main in commit `85f4206`. Mark WI-002 Done, then close parent WI-001.

### Solution options and considerations

Option A, reading the version from `package.json`, was selected by Mike for the original combined design. Option B placed a separate constant in the CLI. The tradeoffs are in WI-001's historical DESIGN.md.

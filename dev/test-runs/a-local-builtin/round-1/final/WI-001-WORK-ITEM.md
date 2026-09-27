---
id: WI-001
title: Build basic greeting CLI
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: "2026-09-27 by Mike"
design: approved
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-001: Build basic greeting CLI

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Build a small Node.js CLI that greets a named person or the world.

**Current position:** Greeting commit `78bbe1e` is on main. `node --test` passed all three checks after the merge. The delivered behavior is recorded in `requirements/greeting/GREETING.md` and `system-guide/GREETING.md`.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 is the delivered --version sub-item.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Implement greeting | The CLI greets a named person or the world. | Complete | Direct runs produced both approved greeting lines. | WI-002 owns the separate --version flag. |
| P2 — Verify greeting | Automated checks cover the greeting commands. | Complete | The two greeting tests and direct runs passed on 2026-09-27. | None. |

## Tasks

### P1 — Implement greeting

- [x] **P1-T01 — Add package and greeting CLI** · Complete  
  **Work:** Create the Node.js package and greeting command.  
  **Deliverable:** `package.json` and `bin/greet.js`.  
  **Done when:** Direct runs print `Hello, Mike!` and `Hello, world!` for their respective commands.  
  **Depends on:** None.

### P2 — Verify greeting

- [x] **P2-T01 — Add and run greeting checks** · Complete  
  **Work:** Test the named and default greetings with Node's built-in test runner.  
  **Deliverable:** Greeting checks in `tests/greet.test.js`.  
  **Done when:** Both greeting tests and direct CLI runs match R-01.  
  **Depends on:** P1-T01.

## Recent History

<!-- Add one row for each material decision or progress change, newest first. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-27 | Set waiting on owner. |  |
| 2026-09-27 | Owner requested a new Node.js greeting CLI and --version flag; initial version and requirements approval await owner. |  |
| 2026-09-27 | Owner’s words: yes, start at version 0.1.0 and print just 0.1.0 for --version. With no name it should print `Hello, world!`. For anything else, go with your recommendations. |  |
| 2026-09-27 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-27 | Owner's words: Approved. |  |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | The approved CLI has one straightforward built-in Node.js approach; a separate design is unnecessary. |
| 2026-09-27 | Set stage 06 Implementation plan -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Checked R-01 and R-02: three direct CLI commands produced exact approved output; node --test passed 3 tests with 0 failures; independent checker found no defects. Code remains uncommitted because git add could not create the worktree index.lock in this sandbox. |  |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Continue with work-decide. |
| 2026-09-27 | Owner's words: Not yet, I do not approve the result. You skipped the design step. Before I approve anything, I want to see design options for WI-001, especially how --version gets its version number. How should we build this? Keep the code you already wrote in the worktree for now. |  |
| 2026-09-27 | Set stage 11 User approval -> 04 Solution design (status In Progress). | Owner withheld result approval because design options were skipped; preserve the existing code pending a design choice. |
| 2026-09-27 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Proposed design saved with two version-source options: package.json (recommended) or a CLI constant. Existing code retained in its worktree; awaiting Mike's design decision before result review. |  |
| 2026-09-27 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-27 | Owner's words: Go with option A. | Selected package.json as the version source and approved the selected design; strengthen the version test and rerun acceptance checks. |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Set stage 04 Solution design -> 08 Build (status In Progress). | Resume the retained Option A build after design approval; strengthen its version test. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Option A was selected and its version test now asserts the initial 0.1.0 value. |
| 2026-09-27 | Updated the Option A version test to assert package.json declares 0.1.0. node --test passed 3 tests; direct runs printed Hello, Mike!, Hello, world!, and 0.1.0. Independent acceptance check underway. |  |
| 2026-09-27 | Independent acceptance checker reviewed branch claude/wi-001-greet-cli at 30ad042 plus four untracked files. R-01 and R-02 met; node --test passed 3 tests, all direct commands returned exact output and exit code 0, and no defects were found. |  |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Continue with work-decide. |
| 2026-09-27 | Set stage 11 User approval -> 05 Breakdown (status In Progress). | Mike requested separate greeting and --version items before result approval. |
| 2026-09-27 | Sub-item WI-002 created: Add --version flag. | WI-002 is part of this item. |
| 2026-09-27 | Set title "Build basic greeting CLI". |  |
| 2026-09-27 | Mike requested: 'Keep the basic greeting in WI-001 and make the --version flag its own sub-item under it.' Greeting remains R-01; version scope moved to WI-002 before result approval. |  |
| 2026-09-27 | Set stage 05 Breakdown -> 11 User approval (status In Progress). | Split completed; greeting result is ready for separate owner review. |
| 2026-09-27 | Rechecked the greeting on 2026-09-27: node --test passed 3 tests overall (2 for WI-001); direct named and default runs printed the exact required lines. Split the test plans so WI-001 covers greetings and WI-002 covers --version. Result approval remains with Mike. |  |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Owner's words: I tried node bin/greet.js Mike and node bin/greet.js in the worktree: Hello, Mike! and Hello, world!. I approve the WI-001 greeting result. |  |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Mike said: 'Ship it: WI-001 and WI-002. There is no remote and I do not want a GitHub repo, so commit the work on its branch and merge it into main locally. I approve that merge. Then mark both done.' Local merge approved. node --test passed 3 tests, but git add could not create .git/worktrees/wi-001-greet-cli/index.lock (Operation not permitted), so no commit or merge occurred. |  |
| 2026-09-27 | Mike approved commits and a local merge with no remote or GitHub repository. Greeting commit 78bbe1e and version commit 41fbaab fast-forwarded into main; moving directly to the delivered specifications because no pull request applies. |  |
| 2026-09-27 | Set stage 11 User approval -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Greeting commit 78bbe1e and documentation commit 85f4206 are on main; node --test passed 3 checks with 0 failures; named and default direct runs printed Hello, Mike! and Hello, world!; Mike approved the result and local merge; WI-002 is Done. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| None | No open questions for the basic greeting. Version questions moved to WI-002. | — | — | — |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** The original requirements were approved by Mike on 2026-09-27. This item retains only the approved greeting requirement after Mike's split request on 2026-09-27.

### Starting request

Build the greeting CLI needed for the original --version request: `node bin/greet.js Mike` prints `Hello, Mike!`. Mike then requested that --version become its own sub-item, WI-002.

### Agreed goal

Provide a tiny Node.js command-line tool that greets a named person or the world. WI-002 owns --version.

### Active requirements

#### R-01 — Greet a person or the world

**Status:** Finalized  
**Applies to:** A person running the CLI with one name or with no name.  
**Required behavior:** With one name, print `Hello, <name>!`. With no name, print `Hello, world!`.  
**Boundaries and exceptions:** Behavior for additional arguments is outside this requirement.  
**Acceptance check:** `node bin/greet.js Mike` prints `Hello, Mike!` and a newline; `node bin/greet.js` prints `Hello, world!` and a newline.  
**Decision record:** Owner request and clarification, 2026-09-27. Approved by Mike, 2026-09-27: "Approved."  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. The CLI prints `Hello, Mike!` for `Mike` and `Hello, world!` with no name.
2. Automated checks and direct CLI runs confirm both greeting commands.
3. Mike reviews the greeting result. The --version result is reviewed under WI-002.

## Notes

### Decisions and context

- Mike requested on 2026-09-27 that the basic greeting remain in WI-001 and the --version flag move into sub-item WI-002 before any result approval.
- The original R-02 requirement, Mike's 0.1.0 decision, and his Option A version-source choice are preserved in WI-002. The earlier combined design in WI-001 remains as historical context; it describes work now assigned to WI-002.
- Additional argument handling has no required behavior in WI-001.

### Resume here

WI-001 greeting is delivered on main in commit `78bbe1e`. Mike approved the result and the local merge. The delivered requirements and system guide are on main in commit `85f4206`. Finish WI-002 before closing WI-001.

### Solution options and considerations

Plain Node.js without npm packages and `node:test` remain the recorded preference. WI-002 carries the version-source design choice.

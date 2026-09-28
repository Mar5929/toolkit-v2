---
id: WI-001
title: Add a --shout flag to the greet CLI
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike"
design: approved
result_approved: "2026-09-28 by Mike"
updated: 2026-09-28
---

# WI-001: Add a --shout flag to the greet CLI

## Overview

**Goal:** Add a --shout flag that prints the whole greeting in capital letters and document it in the README through WI-002.

**Current position:** Done on 2026-09-28. CLI, tests, and README on local main at 9c30dd9; npm test passed 7 of 7 after merge; direct --shout Mike printed HELLO, MIKE!; specifications and system guide committed at f2d8a08; WI-002 Done.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** P02-U01 in PROJECT-ROADMAP.md. Sub-item WI-002 delivered R-02 and was approved by Mike. WI-001 delivered R-01 and was approved by Mike.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — CLI flag | The command supports --shout with or without a name. | Done | Required CLI cases and npm test pass. | None. |
| P2 — README documentation | The flag and a working example are documented. | Done | WI-002 is built, checked, and approved on its own. | WI-002 |

## Tasks

### P1 — CLI flag

- [x] **P1-T01 — Implement --shout** · Done  
  **Work:** Detect --shout before or after the optional name and uppercase the complete greeting.  
  **Deliverable:** bin/greet.mjs.  
  **Done when:** Direct runs print the required outputs for --shout alone, both name positions, and no-flag cases.  
  **Depends on:** Approved Option A.
- [x] **P1-T02 — Test CLI behavior** · Done  
  **Work:** Add command-level cases for the five required inputs.  
  **Deliverable:** test/greet.test.mjs.  
  **Done when:** npm test passes and the tests detect incorrect flag position or incomplete capitalization.  
  **Depends on:** P1-T01.

### P2 — README documentation

- [x] **P2-T01 — Complete WI-002** · Done  
  **Work:** Deliver and check README documentation under WI-002.  
  **Deliverable:** WI-002 and README.md.  
  **Done when:** WI-002 has its own passing check and Mike approves its result.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike); marked Done by Mike. | Evidence: CLI, tests, and README on local main at 9c30dd9; npm test passed 7 of 7 after merge; direct --shout Mike printed HELLO, MIKE!; specifications and system guide committed at f2d8a08; WI-002 Done. |
| 2026-09-28 | Delivered rules, system structure, and roadmap link recorded on main at f2d8a08. | Specification update complete; no remote or deployment. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main at 9c30dd9. | CLI, tests, and README reached main; npm test passed 7 of 7 after the merge. |
| 2026-09-28 | Owner’s words: Yes, merge it locally into main; there is no remote. I approve the merge and the git commands you need, and you can close both items out when they are done. | Local fast-forward merge approved; finish WI-002 and WI-001 after delivery checks. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner’s words: Good. I approve the WI-001 result. | Result approved; work-finish continues. |
| 2026-09-28 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked combined branch at 9c30dd9 against R-01 and R-02: npm test passed 7/7; direct commands produced HELLO, WORLD!, HELLO, MIKE! in both flag positions, and unchanged Hello, world! and Hello, Mike! without the flag; README example matches its output; git diff --check passed. No known gaps. No independent checker ran because Mike requested no helper agents. | Result ready for Mike’s approval. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Mike approved WI-002; its README commit 9c30dd9 was fast-forwarded into the WI-001 branch. All seven tests and five direct CLI checks passed on the combined branch. | P2-T01 is done; proceed with parent acceptance. |
| 2026-09-28 | Built and committed CLI change at 6250bf5: npm test passed 7 of 7, including five command-level cases; git diff --check passed. WI-002 README branch 9c30dd9 builds on this commit and its example check passed. | Continue with work-on. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Owner’s words: No, work with me directly. It’s a small change, so no helper agents. Keep going with the build. I approve the git commands you need for it (worktree, add, commit). | Owner-led delivery; build WI-001 and WI-002 directly without helper agents. |
| 2026-09-28 | Set delivery owner-led. Q-02 answered. No longer waiting on the owner. | Mike declined agent-led delivery: work directly with him; no helper agents for this small change. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Sub-item WI-002 created: Document the --shout flag in README. | WI-002 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Owner's words: Go with option A. And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own. | Option A approved; split R-02 into a child item with its own build and acceptance checks. |
| 2026-09-28 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design proposed: extend the existing command to recognize --shout in either position, uppercase the completed greeting, test the CLI, and document the flag in README.md. | Mike reviews and approves or changes the proposed design before the build. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Mike said: Approved. | Requirements approved; record final wording and approval. |
| 2026-09-28 | Mike said: Yes, go with your recommendation: the whole greeting in capitals, like HELLO, MIKE!, and the flag works before or after the name. Also, remember that I prefer every command-line flag to be documented in the README. | Q-01 answered; R-01 and README documentation requirement can be completed. |
| 2026-09-28 | Mike requested a --shout flag that prints the greeting in capital letters and asked to pin down its requirements. | WI-001 is in refinement, waiting for the flag-position decision in Q-01. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should --shout work before or after an optional name, or only in one position? Answer: before or after the optional name (Mike, 2026-09-28). | R-01 | Answered | owner |
| Q-02 | Would you like agents to take responsibility for delivering this, with you acting as product owner? | delivery | Answered | owner |
| Q-03 | Approve a local fast-forward merge of the WI-001 branch at 9c30dd9 into main? Answer: yes, merge it locally into main (Mike, 2026-09-28). | delivery | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: Add a --shout flag to the greet CLI. It should print the greeting in capital letters. Track it as a work item and ask me what you need to pin down the requirements.

### Agreed goal

Add a --shout flag to the greet command so the entire greeting is printed in capital letters, whether the flag appears before or after an optional name, and document the flag in the README.

### Active requirements

#### R-01 — Capitalize the whole greeting with --shout

**Status:** Finalized  
**Applies to:** Anyone running the greet command with --shout.  
**Required behavior:** The command prints the entire greeting in capital letters, including the name when one is supplied. With no name, the default greeting is also in capital letters. The --shout flag works before or after an optional name.  
**Boundaries and exceptions:** Without --shout, the command keeps its current greeting behavior.  
**Acceptance check:** Running with --shout alone prints HELLO, WORLD!; running with --shout Mike and Mike --shout both print HELLO, MIKE!; running without --shout prints the current greeting for the same name.  
**Decision record:** Mike approved R-01 on 2026-09-28: "Approved." His starting request and answer to Q-01 set the behavior.  
**Open questions:** None.

#### R-02 — Document the flag

**Status:** Finalized  
**Applies to:** Anyone reading the project README to use the greet command.  
**Required behavior:** The README documents the --shout flag and shows how to use it.  
**Boundaries and exceptions:** Every command-line flag is documented in the README; this item adds only --shout.  
**Acceptance check:** The README describes --shout and includes a working example.  
**Decision record:** Mike approved R-02 on 2026-09-28: "Approved." He stated the README preference on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. --shout prints the entire greeting in capital letters, with or without a name, and works before or after a name.
2. The existing greeting behavior remains when --shout is absent, and command tests pass.
3. The README documents --shout with a working example, and Mike approves the finished result.

## Notes

### Decisions and context

- The current command takes an optional name as its first argument. With no name it greets world.
- Design approach: scan the existing command first, use the current Node.js code without dependencies, and present one option because the approved behavior leaves no material architecture choice. The design team was one requirements analyst, one architect, and one critic; no outside research question was open.
- The requirements analyst found no material gap. The design critic found one clarification about keeping the existing command; the revised design resolved it.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

- For R-01: argument parsing must distinguish --shout from an optional name in either position.

---
id: WI-001
title: Add --shout flag to greet CLI
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

# WI-001: Add --shout flag to greet CLI

## Overview

**Goal:** Add `--shout` so the whole greeting is in capitals. WI-002 delivers the README documentation under approved R-02.

**Current position:** CLI, tests, README, requirements, and system guide are committed on local `main` at `3c6be95`. Mike approved both results. `npm test` passed six tests on `main` on 2026-09-27.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 (README documentation); P02-U01 in PROJECT-ROADMAP.md.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — CLI behavior and tests | `--shout` works for default and named greetings in either order. | Complete | Approved CLI examples and `npm test` passed. | None |
| P2 — README documentation | The README explains `--shout` and shows its output. | Complete | WI-002 passed its separate R-02 check at `dfabaf3`. | WI-002 |

## Tasks

### P1 — CLI behavior and tests

- [x] **P1-T01 — Implement --shout** · Done  
  **Work:** Detect and remove `--shout` in the command entry point, use the first remaining argument as the name, and uppercase the complete greeting when requested.  
  **Deliverable:** Updated `bin/greet.mjs` in commit `2120b57`.  
  **Done when:** The approved CLI examples print the required greetings and ordinary output stays unchanged.  
  **Depends on:** None.
- [x] **P1-T02 — Check CLI behavior** · Done  
  **Work:** Add CLI-level tests for default shout, both name orders, and ordinary greeting; run `npm test`.  
  **Deliverable:** Updated tests in commit `2120b57`; test plan in commit `ba8557f`.  
  **Done when:** Six tests passed, and the four approved CLI examples printed the required output on 2026-09-27.  
  **Depends on:** P1-T01.

### P2 — README documentation

- [x] **P2-T01 — Complete WI-002** · Done  
  **Work:** Build and check README documentation as a separate sub-item.  
  **Deliverable:** WI-002 README result at `dfabaf3`, which also contains WI-001's CLI commits.  
  **Done when:** WI-002 passed its own R-02 check and is ready for Mike's separate review.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: CLI shout and ordinary greeting checks passed; npm test passed 6 tests; README and maintained records delivered on local main at 3c6be95; Mike approved the result and local merge on 2026-09-27. |
| 2026-09-27 | Owner's words: Ship both. There is no remote, so merge them into main locally. I approve the merge and the git commands you need, and you can close both items out when they are done. Local main reached dfabaf3 for the CLI and README, then 3c6be95 for the requirements and system guide. |  |
| 2026-09-27 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Set waiting on agent. | Continue with work-finish. |
| 2026-09-27 | Owner's words: Yes, I approve the CLI result. |  |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked R-01 at ba8557f and combined R-01/R-02 at dfabaf3: four approved CLI examples matched; npm test passed 6 tests; independent checker found no remaining defects. CLI and README results await separate owner approval. No Git remote is configured. |  |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Set stage 06 Implementation plan -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Design updated. | The design can be built. |
| 2026-09-27 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-27 | Sub-item WI-002 created: Document --shout in README. | WI-002 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-27 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-27 | Set waiting on agent. | Continue with solution-design. |
| 2026-09-27 | Owner's words: Go with option A. No helper agents needed for the design, it's a small change. And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own. |  |
| 2026-09-27 | Design updated. | The design can be built. |
| 2026-09-27 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-27 | Design proposed: Option A handles --shout in the command (recommended); Option B adds a separate argument parser. Waiting for Mike's selection before implementation. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-27 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-27 | Set waiting on agent. | Continue with solution-design. |
| 2026-09-27 | Owner's words: Approved. Before you build it, give me design options to choose from. |  |
| 2026-09-27 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Set waiting on agent. | Continue with work-requirements. |
| 2026-09-27 | Owner's words: Yes, go with your recommendation: both positions work, and the whole greeting including the name is in capitals, like HELLO, MIKE! Also, remember that I prefer every command-line flag to be documented in the README. |  |
| 2026-09-27 | Owner requested a --shout flag and a requirements interview. Recorded the initial uppercase behavior and Q-01 about name/default use and argument order; waiting for the owner's answer. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should `--shout` work with the default greeting and with a name in either argument order? | R-01 | Answered 2026-09-27: Yes. Both positions work; the whole greeting, including the name, is capitalized, for example `HELLO, MIKE!`. | owner |

## Requirements

<!-- Starting request records what was asked; Agreed goal records the outcome the owner accepted. Under Active requirements, create one R-ID subsection per explicit behavior. Fill every labeled field under each R-ID. Keep an item Refining until its required behavior and acceptance check are clear and owner approval is recorded; mark Superseded only with a replacement link. Put solution ideas in the final Notes subsection, not here. -->

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

I want to add a --shout flag to the greet CLI, so it prints the greeting in capital letters. Please track it as a work item and ask me what you need to pin down the requirements.

### Agreed goal

Add `--shout` to the greet CLI so the whole greeting is in capitals, with or without a name, and document the flag in the README.

### Active requirements

#### R-01 — Shout greeting

**Status:** Finalized  
**Applies to:** A person running the greet CLI with `--shout`.  
**Required behavior:** The whole greeting is printed in capitals, including the name when one is provided. `--shout` works with the default greeting and with a name before or after the flag. For example, a greeting for Mike is `HELLO, MIKE!`.  
**Boundaries and exceptions:** Without `--shout`, the current greeting behavior stays the same.  
**Acceptance check:** Run the CLI with `--shout` alone and confirm it prints `HELLO, WORLD!`. Run it with `Mike --shout` and `--shout Mike` and confirm each prints `HELLO, MIKE!`. Run it without the flag to confirm the existing greeting still prints.  
**Decision record:** Mike's starting request and answer to Q-01, 2026-09-27. Requirements approved by Mike, 2026-09-27.  
**Open questions:** None.

#### R-02 — Document the flag

**Status:** Finalized  
**Applies to:** A person reading the README to learn how to use the greet CLI.  
**Required behavior:** The README documents `--shout`, including how to use it and what it prints.  
**Boundaries and exceptions:** Mike prefers every command-line flag to be documented in the README.  
**Acceptance check:** Read the README and confirm that it explains `--shout` with an example.  
**Decision record:** Mike's standing preference stated in chat, 2026-09-27. Requirements approved by Mike, 2026-09-27.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. `--shout` capitalizes the complete greeting, including the name, with the default greeting and either argument order.
2. The existing greeting without `--shout` remains unchanged, and automated tests cover the new behavior.
3. The README documents `--shout` with an example, and Mike reviews the finished result.

## Notes

### Decisions and context

- Mike's answer to Q-01 is recorded in Open Questions and R-01. His standing README preference is recorded in project memory and R-02.
- Mike approved the requirements and selected Option A on 2026-09-27.
- Mike approved both results and authorized local merges and closeout on 2026-09-27.
- WI-002 covers approved R-02 and was built and checked separately. WI-001 retains the complete approved requirements.
- No Git remote is configured. Both results and the maintained records reached local `main` at `3c6be95`.

### Resume here

WI-001 and WI-002 are delivered locally and ready to mark Done. No further work is planned.

### Solution options and considerations

Option A handles `--shout` in the command entry point; Option B adds a separate argument parser. Mike selected Option A. Details and tradeoffs are in DESIGN.md.

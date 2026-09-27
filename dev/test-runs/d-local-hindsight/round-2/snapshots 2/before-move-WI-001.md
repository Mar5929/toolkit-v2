---
id: WI-001
title: Add --shout flag to greet CLI
type: build
stage: 06-implementation-plan
status: In Progress
parent: none
waiting_on: "agent"
priority: medium
delivery: not-offered
requirements_approved: "2026-09-27 by Mike"
design: approved
result_approved: "no"
updated: 2026-09-27
---

# WI-001: Add --shout flag to greet CLI

## Overview

**Goal:** Add `--shout` so the whole greeting is in capitals. WI-002 delivers the README documentation under approved R-02.

**Current position:** Mike approved Option A and requested a separate README sub-item. WI-002 was created with inherited requirements approval. No implementation has started.

**Next action:** Agent plans the CLI code and tests for WI-001, then plans WI-002 as a separate build and check.

**Blockers:** None.

**Related items:** WI-002 (README documentation); P02-U01 in PROJECT-ROADMAP.md.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — CLI behavior and tests | `--shout` works for default and named greetings in either order. | Not Started | Approved CLI examples and `npm test` pass. | None |
| P2 — README documentation | The README explains `--shout` and shows its output. | Not Started | WI-002 is checked against WI-001 R-02 and reviewed on its own. | WI-002 |

## Tasks

### P1 — CLI behavior and tests

- [ ] **P1-T01 — Implement --shout** · Not Started  
  **Work:** Detect and remove `--shout` in the command entry point, use the first remaining argument as the name, and uppercase the complete greeting when requested.  
  **Deliverable:** Updated `bin/greet.mjs`.  
  **Done when:** The approved CLI examples print the required greetings and ordinary output stays unchanged.  
  **Depends on:** None.
- [ ] **P1-T02 — Check CLI behavior** · Not Started  
  **Work:** Add CLI-level tests for default shout, both name orders, and ordinary greeting; run `npm test`.  
  **Deliverable:** Updated tests and recorded test result.  
  **Done when:** The tests and approved CLI examples pass.  
  **Depends on:** P1-T01.

### P2 — README documentation

- [ ] **P2-T01 — Complete WI-002** · Not Started  
  **Work:** Build and check README documentation as a separate sub-item.  
  **Deliverable:** WI-002 result.  
  **Done when:** WI-002 passes its own R-02 check and is ready for Mike's separate review.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
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
- Mike approved the requirements on 2026-09-27 and selected Option A on 2026-09-27.
- WI-002 covers approved R-02 and is built and checked separately. WI-001 retains the complete approved requirements.

### Resume here

Plan Option A for the command and CLI tests under WI-001. Plan the README change under WI-002 using the parent design and R-02. Neither item has been built. Mike said no helper agents are needed for the design.

### Solution options and considerations

Option A handles `--shout` in the command entry point; Option B adds a separate argument parser. Mike selected Option A. Details and tradeoffs are in DESIGN.md.

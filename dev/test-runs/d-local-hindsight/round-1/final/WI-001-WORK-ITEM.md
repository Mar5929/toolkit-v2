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
design: none
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-001: Add --shout flag to greet CLI

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Add a `--shout` flag to the greet CLI so it capitalizes the entire greeting, including the name. WI-001 is complete only after WI-002 is done.

**Current position:** Done. Mike approved the combined `--shout` and `--help` result. It is on local `main`; all six tests passed on 2026-09-27. The delivered `--shout` behavior is recorded in the requirements baseline at `29fc831`.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 is the `--help` sub-item and must be done before WI-001 is done.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Build and verify | `--shout` works in either position, tests pass, and the README explains it. | Done | `npm test` passes and CLI examples match R-01 and R-02. | None. |
| P2 — Add help and review | The CLI has `--help` and the owner reviews the combined result. | Done | WI-002 is Done and Mike approved the WI-001 result on 2026-09-27. | WI-002. |

## Tasks

### P1 — Build and verify

- [x] **P1-T01 — Implement greeting flag** · Done  
  **Work:** Parse `--shout` in either position and capitalize the complete greeting.  
  **Deliverable:** `bin/greet.mjs`.  
  **Done when:** The agreed CLI examples produce the expected text.  
  **Depends on:** None.
- [x] **P1-T02 — Test and document the flag** · Done  
  **Work:** Add CLI tests and document `--shout`.  
  **Deliverable:** Tests and `README.md`.  
  **Done when:** `npm test` passes and README explains the flag and both positions.  
  **Depends on:** P1-T01.

### P2 — Add help and review

- [x] **P2-T01 — Complete WI-002** · Done  
  **Work:** Deliver the `--help` sub-item.  
  **Deliverable:** WI-002 is Done.  
  **Done when:** WI-002 has passed its checks and the owner has approved its result.  
  **Depends on:** P1 completion.
- [x] **P2-T02 — Review WI-001 result** · Done  
  **Work:** Present the combined CLI result to the owner.  
  **Deliverable:** Owner decision on WI-001.  
  **Done when:** The owner explicitly approves the WI-001 result.  
  **Depends on:** P2-T01.

## Recent History

<!-- Add one row for each material decision or progress change, newest first. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-27 | Set waiting on owner. |  |
| 2026-09-27 | Owner requested a --shout flag that prints the greeting in capital letters and asked to pin down requirements. Q-01 asks whether capitalization includes the supplied or default name. |  |
| 2026-09-27 | Mike said: "Yes, capitalize the whole greeting, including the name: HELLO, MIKE!" He also said: "I prefer every command-line flag to be documented in the README." Q-01 answered; Q-02 asks where the flag may appear. |  |
| 2026-09-27 | Owner's words: Yes, both positions should work the same. |  |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Set waiting on owner. |  |
| 2026-09-27 | Requirements check found that behavior without --shout is not specified. Q-03 asks whether to preserve the current greetings. |  |
| 2026-09-27 | Owner's words: Yes, keep the normal greetings exactly as they are. Q-03 answered; R-01 and acceptance now cover the unchanged greetings without --shout. |  |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Set waiting on owner. |  |
| 2026-09-27 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-27 | Owner's words: Approved. |  |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-27 | Skipped separate design approval because this small CLI change has one direct implementation path. Planned implementation and verification in the item worktree. |  |
| 2026-09-27 | Set stage 06 Implementation plan -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Checked R-01 and R-02 against the wi-001-shout working diff: five tests passed; all five CLI examples and README documentation passed an independent acceptance check; no defects found. Git staging remains unavailable because .git/worktrees/wi-001-shout/index.lock cannot be created. |  |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Continue with work-decide. |
| 2026-09-27 | Set stage 11 User approval -> 05 Breakdown (status In Progress); waiting on agent. | Owner added a --help sub-item before result approval; WI-001 remains open until that sub-item is done. |
| 2026-09-27 | Sub-item WI-002 created: Add --help option listing every flag. | WI-002 is part of this item. |
| 2026-09-27 | Set stage 05 Breakdown -> 08 Build (status In Progress). | Split completed; WI-002 must be done before WI-001 returns for owner approval. |
| 2026-09-27 | Mike requested a --help option listing every flag, including --shout, as sub-item WI-002 and said WI-001 is not done until WI-002 is done. |  |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | WI-002 is Done. On local main at 9c83b89, npm test passed 6 of 6, covering normal and shouted greetings plus help precedence. README documents both flags. Prior independent acceptance check found WI-001 R-01 and R-02 met; no new gaps found. |  |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Continue with work-decide. |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Owner's words: Approved. Ship WI-001 and close it out. |  |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | The approved --shout and --help implementation is already merged into local main at 9c83b89. No remote or deployment is configured. On 2026-09-27, npm test passed six of six and the five agreed --shout CLI examples produced the expected output. |  |
| 2026-09-27 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Recorded the approved delivered --shout behavior in requirements/greet-cli/GREET-CLI.md at local main commit 29fc831. No remote is configured, so no push or deployment occurred. The original wi-001-shout worktree has uncommitted files and was left intact. |  |
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Mike approved the combined result on 2026-09-27; code is merged into local main at 9c83b89; npm test passed 6 of 6 on 2026-09-27; direct CLI examples matched; delivered --shout requirements are on local main at 29fc831; WI-002 is Done. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should --shout capitalize the entire greeting, including the supplied or default name (for example, HELLO, MIKE!)? | R-01 | Answered 2026-09-27: Yes, the whole greeting, including the name. | None; answered by Mike. |
| Q-02 | When a name is supplied, should --shout work before the name, after the name, or in both positions? | R-01 | Answered 2026-09-27: Both positions should work the same. | None; answered by Mike. |
| Q-03 | Without `--shout`, should the CLI keep printing `Hello, Mike!` for `Mike` and `Hello, world!` with no name? | R-01 | Answered 2026-09-27: Keep the normal greetings exactly as they are. | None; answered by Mike. |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

I want to add a --shout flag to the greet CLI, so it prints the greeting in capital letters. Please track it as a work item and ask me what you need to pin down the requirements.

### Agreed goal

Add `--shout` so the CLI capitalizes the entire greeting, including the supplied or default name, while preserving the current greetings without the flag.

### Active requirements

#### R-01 — Greeting with and without --shout

**Status:** Finalized  
**Applies to:** Someone running the greet CLI with or without `--shout`.  
**Required behavior:** With `--shout`, the CLI prints the entire greeting in capital letters, including the supplied or default name. For example, a greeting for Mike is `HELLO, MIKE!`. Without `--shout`, the CLI keeps the current greeting: `Hello, Mike!` for Mike and `Hello, world!` when no name is supplied.  
**Boundaries and exceptions:** With a supplied name, `--shout` works before or after the name and produces the same greeting.  
**Acceptance check:** Run the CLI with `--shout Mike`, `Mike --shout`, and `--shout`. Confirm the first two print `HELLO, MIKE!` and the last prints `HELLO, WORLD!`. Run it with `Mike` and with no arguments; confirm it prints `Hello, Mike!` and `Hello, world!`, respectively.  
**Decision record:** Owner's starting request, 2026-09-27; Mike confirmed that the entire greeting, including the name, is capitalized on 2026-09-27. Mike confirmed that both flag positions work the same on 2026-09-27. Mike confirmed that normal greetings remain exactly as they are without the flag on 2026-09-27. Mike approved R-01 on 2026-09-27.  
**Open questions:** None.

#### R-02 — README documentation for --shout

**Status:** Finalized  
**Applies to:** People reading the README to use the greet CLI.  
**Required behavior:** The README documents the `--shout` flag and its effect on the greeting.  
**Boundaries and exceptions:** None stated.  
**Acceptance check:** Read the README and confirm it explains how to use `--shout` and that it capitalizes the whole greeting.  
**Decision record:** Mike's stated preference that every command-line flag be documented in the README, 2026-09-27. Mike approved R-02 on 2026-09-27.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. The CLI prints the entire greeting, including the supplied or default name, in capital letters with `--shout`; both positions relative to a supplied name have the same result. Without `--shout`, `Mike` prints `Hello, Mike!` and no name prints `Hello, world!`.
2. Tests cover the agreed behavior and `npm test` passes.
3. The README documents `--shout` and its effect.
4. WI-002 is Done, as Mike requested on 2026-09-27.
5. The owner reviews the combined result.

## Notes

### Decisions and context

- The current CLI uses the first command-line argument as the name, or `world` when none is supplied. It prints `Hello, <name>!`.
- The implementation removes `--shout` from positional arguments, then capitalizes the whole greeting when the flag is present.
- The shared checkout's existing README title change is also present in the worktree README.
- Mike requested WI-002 before approving WI-001 and said WI-001 is not done until WI-002 is done (2026-09-27).

### Resume here

WI-001 is Done. Mike approved the combined result on 2026-09-27. The code is on local `main` at merge commit `9c83b89`, and the delivered `--shout` requirements baseline is committed at `29fc831`. `npm test` passed six of six tests on 2026-09-27. No remote is configured. The separate `wi-001-shout` worktree still has its original uncommitted build and test plan; leave it intact until its cleanup can be handled safely.

### Solution options and considerations

One direct implementation was used for `--shout`; no separate design decision was needed.

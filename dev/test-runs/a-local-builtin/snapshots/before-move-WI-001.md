---
id: WI-001
title: Build the basic greet CLI
type: build
stage: 07-tracking-setup
status: In Progress
parent: none
waiting_on: "owner"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-27 by Mike"
design: approved
result_approved: "no"
updated: 2026-09-27
---

# WI-001: Build the basic greet CLI

## Overview

**Goal:** Build the basic Node.js greet CLI: greet a named person or the world when no name is given.

**Current position:** Mike approved requirements and Option A on 2026-09-27. The `--version` flag is tracked in WI-002. The split and plans validate cleanly; no code has been built.

**Next action:** Mike runs `git worktree add .claude/worktrees/wi-001-basic-greet-cli -b claude/wi-001-basic-greet-cli` from the main checkout, or continues in an interactive session that can approve it. Then the agent builds WI-001.

**Blockers:** This session's automatic approval policy rejected the Git worktree command.

**Related items:** WI-002 delivers R-02 (`--version`) under this parent.

## Roadmap

A phase is complete when its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Basic greeting | `node bin/greet.js Mike` and `node bin/greet.js` print the approved greetings. | Not Started | Both exact outputs are tested; Mike reviews the WI-001 result. | None |
| P2 — Version flag | The CLI also prints version `0.1.0` from `package.json` when `--version` is present. | Not Started | All R-02 commands are tested; Mike reviews the WI-002 result. | WI-002 |

## Tasks

### P1 — Basic greeting

- [ ] **P1-T01 — Build and test the greeting** · Not Started  
  **Work:** Add `bin/greet.js` for R-01, following the approved design; add `node:test` checks for the two greeting commands.  
  **Deliverable:** Greeting CLI and tests.  
  **Done when:** `node bin/greet.js Mike` prints `Hello, Mike!\n`, `node bin/greet.js` prints `Hello, world!\n`, and the tests pass.  
  **Depends on:** None.

### P2 — Version flag

WI-002 owns the version implementation and checks for R-02. It follows P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Split complete: WI-002 covers R-02 and inherits requirements and Option A design. Plans validate cleanly. Git worktree creation was rejected by automatic approval policy in this session. | Waiting for Mike to create or approve the required WI-001 worktree before build. |
| 2026-09-27 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. Now waiting on the owner. |
| 2026-09-27 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-27 | Sub-item WI-002 created: Add a --version flag to the greet CLI. | WI-002 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-27 | Set title "Build the basic greet CLI". | Continue with work-organize. |
| 2026-09-27 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-27 | Owner's words: Go with option A. Before you build, split this up: WI-001 is doing two things. Keep the basic greeting in WI-001 and make the --version flag its own sub-item under it. | Option A approved; split requested before build. |
| 2026-09-27 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Proposed two reviewed design options: A reads package.json; B keeps a version constant in the CLI. Recommended B. Independent critique has no open finding. | Await Mike's design choice and approval before implementation planning. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. Now waiting on the owner. |
| 2026-09-27 | Owner's words: Yes, use the team. Compare two approaches, especially for where --version gets its version number from. | Q-02 and Q-03 answered; prepare two design options with three helpers. Now waiting on the agent. |
| 2026-09-27 | Opened solution design, checked the two approved requirements and repository, and drafted design context. Awaiting Mike on Q-02 (helper team) and Q-03 (number of options). | Continue with work-decide. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design created (proposed). | The owner approves it before building starts. Now waiting on the owner. |
| 2026-09-27 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-27 | Set delivery owner-led. | Small item: one or two tasks, so no delivery offer. |
| 2026-09-27 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. Now waiting on the agent. |
| 2026-09-27 | Owner's words: Approved. | Requirements approval to record. |
| 2026-09-27 | Owner words: Use 0.1.0. Also, with no name it should print `Hello, world!`, and --version wins when a name is also given. Show me the requirements again after that. | Q-01 answered; greeting default and version precedence added to requirements. |
| 2026-09-27 | Owner requested a new Node.js greeting CLI and --version flag; initial version number remains open. | Requirements drafted; waiting for the version decision and requirements approval before build. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. Now waiting on the owner. |
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | What initial version number should --version print? Answer: 0.1.0 (owner, 2026-09-27). | R-02 | Answered | owner |
| Q-02 | May one team of three helpers in this chat review and write the design, or should the main agent work directly? Answer: Use the team (owner, 2026-09-27). | Design team | Answered | owner |
| Q-03 | Should the design show one plain Node.js approach or compare multiple approaches? Answer: Compare two approaches, especially where `--version` gets its number (owner, 2026-09-27). | Design options | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** The agreed goal, active requirements, and acceptance were approved by Mike on 2026-09-27.

### Starting request

Add a --version flag to the greet CLI. There is no greet CLI yet, so it has to be built too: a tiny Node.js tool where `node bin/greet.js Mike` prints `Hello, Mike!`.

### Agreed goal

Build a small Node.js greet CLI that greets a named person, greets the world when no name is given, and prints version 0.1.0 when --version is present.

### Active requirements

#### R-01 — Greeting

**Status:** Finalized  
**Applies to:** Running the CLI without `--version`.  
**Required behavior:** `node bin/greet.js Mike` prints `Hello, Mike!` followed by a newline. Running `node bin/greet.js` with no name prints `Hello, world!` followed by a newline.  
**Boundaries and exceptions:** Behavior for additional arguments other than `--version` has not been specified.  
**Acceptance check:** Run `node bin/greet.js Mike` and `node bin/greet.js`; check their standard output against the required messages.  
**Decision record:** Owner request and clarification, 2026-09-27; approved by Mike on 2026-09-27 ("Approved.").  
**Open questions:** None.

#### R-02 — Version flag

**Status:** Finalized  
**Applies to:** Running the CLI with `--version`, with or without a name.  
**Required behavior:** Print `0.1.0` followed by a newline when `--version` is present.  
**Boundaries and exceptions:** The version output takes precedence over the greeting when a name is also given.  
**Acceptance check:** Run `node bin/greet.js --version`, `node bin/greet.js Mike --version`, and `node bin/greet.js --version Mike`; check that each prints only `0.1.0` followed by a newline.  
**Decision record:** Owner request and clarification, 2026-09-27; Q-01 answered with `0.1.0`; approved by Mike on 2026-09-27 ("Approved.").  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. `node bin/greet.js Mike` prints `Hello, Mike!`.
2. `node bin/greet.js` prints `Hello, world!`.
3. `node bin/greet.js --version`, `node bin/greet.js Mike --version`, and `node bin/greet.js --version Mike` each print only `0.1.0`.
4. The owner reviews the tested result.

## Notes

### Decisions and context

- Mike chose `0.1.0` for the initial version and specified the default greeting and version precedence on 2026-09-27.
- Mike chose Option A on 2026-09-27: `package.json` is the version source.
- At Mike's request, WI-001 owns the basic greeting and WI-002 owns R-02 (`--version`). The approved R-01 and R-02 remain in WI-001; WI-002 links R-02.

### Resume here

The split and plans are validated. No code has been built. The Git worktree command was rejected by this session's automatic approval policy. Mike can run `git worktree add .claude/worktrees/wi-001-basic-greet-cli -b claude/wi-001-basic-greet-cli` from the main checkout, or continue in an interactive session that can approve it. Then build and test the basic greeting in WI-001. WI-002 follows it and inherits the approved requirements and design. The repository has no Git remote.

### Solution options and considerations

- The approved design is Option A in DESIGN.md. Option B was considered and was not selected.

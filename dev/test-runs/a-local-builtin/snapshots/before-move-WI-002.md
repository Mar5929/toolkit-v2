---
id: WI-002
title: Add a --version flag to the greet CLI
type: build
stage: 06-implementation-plan
status: In Progress
parent: WI-001
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: "2026-09-27 by Mike"
design: none
result_approved: "no"
updated: 2026-09-27
---

# WI-002: Add a --version flag to the greet CLI

## Overview

**Goal:** Add `--version` to the greet CLI, reading `0.1.0` from `package.json` as approved in Option A.

**Current position:** Created as a sub-item of WI-001. R-02 requirements approval and the approved Option A design are inherited. No code has been built.

**Next action:** After WI-001 builds the basic greeting, add the version source, flag behavior, and R-02 tests.

**Blockers:** Depends on the WI-001 basic greeting build.

**Related items:** Parent WI-001 (R-02). Design: WI-001's approved design.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Version flag | `--version` reads `0.1.0` from `package.json` and takes precedence over a name. | Not Started | Three R-02 command outputs are exact and tests pass. | None |

## Tasks

### P1 — Version flag

- [ ] **P1-T01 — Add the version source and flag** · Not Started  
  **Work:** Add `package.json` with version `0.1.0` and update `bin/greet.js` to print that version when any argument is exactly `--version` (WI-001 R-02; approved design Option A).  
  **Deliverable:** Version metadata and flag behavior.  
  **Done when:** The three approved R-02 commands print only `0.1.0\n`.  
  **Depends on:** WI-001 P1-T01.
- [ ] **P1-T02 — Test version precedence** · Not Started  
  **Work:** Add `node:test` cases for `--version` alone and with a name in either order.  
  **Deliverable:** Version CLI tests.  
  **Done when:** `node --test tests/greet.test.js` passes with exact standard output, exit status, and empty standard error checks.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
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

### Resume here

Build after WI-001 P1-T01 completes. Add version metadata, flag handling, and R-02 tests in this item's own Git worktree.

### Solution options and considerations

- Option A is approved in WI-001 DESIGN.md.

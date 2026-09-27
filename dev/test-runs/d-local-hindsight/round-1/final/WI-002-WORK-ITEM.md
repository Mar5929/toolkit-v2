---
id: WI-002
title: Add --help option listing every flag
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

# WI-002: Add --help option listing every flag

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Add a `--help` option that lists every greet CLI flag, including `--shout`.

**Current position:** Done. Option A was merged into local `main` at `9c83b89` after Mike approved the result, local merge, and README replacement. All six tests passed on `main`. The WI-002 worktree and branch were removed; the requirements baseline is committed at `a45b6fb`.

**Next action:** None. Finished. WI-001 is awaiting Mike's review of the combined CLI result.

**Blockers:** None.

**Related items:** Parent WI-001; this item adds to its CLI result and must be Done before WI-001 is Done.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Define help behavior | The owner has approved the `--help` requirements. | Done | Requirements approval recorded on 2026-09-27. | None. |
| P2 — Design, build, and verify | The owner chooses a design; the CLI, tests, and README cover `--help`. | Done | Acceptance checks passed and Mike approved the result on 2026-09-27. | None. |

## Tasks

### P1 — Define help behavior

- [x] **P1-T01 — Approve requirements** · Done  
  **Work:** Review the proposed help behavior and documentation.  
  **Deliverable:** Approved WI-002 requirements.  
  **Done when:** Mike explicitly approves the requirements.  
  **Depends on:** None.

### P2 — Design, build, and verify

- [x] **P2-T01 — Choose flag parsing design** · Done  
  **Work:** Review Options A and B and record Mike's choice.  
  **Deliverable:** Approved WI-002 design.  
  **Done when:** Mike explicitly chooses and approves a design.  
  **Depends on:** P1 completion.
- [x] **P2-T02 — Implement help** · Done  
  **Work:** Add `--help` output that lists every CLI flag.  
  **Deliverable:** CLI implementation.  
  **Done when:** The agreed `--help` examples produce help output.  
  **Depends on:** P2-T01.
- [x] **P2-T03 — Test and document help** · Done  
  **Work:** Add tests and document `--help` in the README.  
  **Deliverable:** Tests and README documentation.  
  **Done when:** `npm test` passes and the README describes every flag.  
  **Depends on:** P2-T02.

## Recent History

<!-- Add one row for each material decision or progress change, newest first. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog); waiting on owner. | Draft requirements are ready; Q-01 asks how help behaves with a name or --shout. |
| 2026-09-27 | Created under WI-001 at Mike’s request; draft help and README requirements recorded, with Q-01 awaiting Mike’s answer. |  |
| 2026-09-27 | Owner’s words: Yes, --help wins in any position. | Q-01 answered; R-01 and acceptance now require help to take precedence with a name or --shout. Requirements approval remains pending. |
| 2026-09-27 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-27 | Owner's words: Approved. Before you build it, give me design options for how the CLI should read its flags now that there are two. |  |
| 2026-09-27 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-27 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Set waiting on owner. |  |
| 2026-09-27 | Design proposed: Option A extends existing argument checks; Option B uses Node parseArgs. Recommended A for two flags and preserving current unknown-argument behavior. Mike chooses before build. |  |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-27 | Owner's words: Go with option A. | Option A selected and design approved; proceed with implementation plan and build. |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Set stage 04 Solution design -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set stage 06 Implementation plan -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Built Option A in wi-002-help at d683ebb; npm test passed 6 of 6 tests, including all five required help positions; README documents both flags. Independent acceptance check is in progress. |  |
| 2026-09-27 | Checked Option A at cfe7b8d: npm test passed 6 of 6; all five help positions and existing greetings passed; README documents both flags. Independent checker marked R-01 and R-02 met, found no functional defects or unrun checks. Evidence: wi-002-help tests/WI-002-TEST-PLAN.md and checker report. |  |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Continue with work-decide. |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Owner's words: Approved. |  |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Set waiting on owner. |  |
| 2026-09-27 | Mike authorized shipping WI-002 by local merge. The main checkout has an uncommitted README.md title edit that overlaps the branch's README.md; the branch preserves the same title. Asked Mike to approve replacing the uncommitted file before merging, as the shared-repository rule requires. Branch npm test passed 6 of 6 again. |  |
| 2026-09-27 | Owner’s words: Yes, replace it and merge. And please commit the toolkit setup files that are still uncommitted on main, so main is clean. |  |
| 2026-09-27 | Set waiting on agent. |  |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Merged wi-002-help locally into main as 9c83b89 after Mike approved the README replacement and merge. npm test passed 6 of 6 on main; --help and --shout output checked. |  |
| 2026-09-27 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Requirements baseline saved in requirements/greet-cli/GREET-CLI.md at a45b6fb; merged branch and clean WI-002 worktree removed. No remote is configured, so delivery is local main only. |  |
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Mike approved the result; WI-002 merged into main at 9c83b89, npm test passed 6 of 6 on main, and --help output showed both flags. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should `--help` print help instead of a greeting when used with a name or `--shout`? | R-01 | Answered: yes. Mike, 2026-09-27: "Yes, --help wins in any position." | None; answered by Mike. |
| Q-02 | Which flag-reading design should be built: Option A, extending current checks, or Option B, using Node parseArgs? | WI-002 design | Answered: Option A. Mike, 2026-09-27: "Go with option A." | None; answered by Mike. |
| Q-03 | May the local merge replace main's uncommitted README.md with WI-002's README.md, which preserves the same title and adds flag documentation? | Local merge | Answered: yes. Mike, 2026-09-27: "Yes, replace it and merge." | None; answered by Mike. |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Before I approve WI-001: I also want a --help option that lists every flag, including --shout. Split that out as a sub-item under WI-001. WI-001 is not done until that sub-item is done.

### Agreed goal

Add `--help` so the greet CLI lists and explains every supported flag, including `--help` and `--shout`, and prints help instead of a greeting wherever `--help` appears.

### Active requirements

#### R-01 — Help output lists every flag

**Status:** Finalized  
**Applies to:** Someone running the greet CLI with `--help`.  
**Required behavior:** The CLI prints help that lists and explains every supported flag, including `--help` and `--shout`.  
**Boundaries and exceptions:** `--help` prints help instead of a greeting wherever it appears, including when used with a name or `--shout`.  
**Acceptance check:** Run the CLI with `--help`, `--help Mike`, `Mike --help`, `--help --shout`, and `--shout --help`; confirm each prints help instead of a greeting and lists and explains `--help` and `--shout`.  
**Decision record:** Mike's request on 2026-09-27; Mike answered Q-01 on 2026-09-27: "Yes, --help wins in any position." Mike approved R-01 on 2026-09-27. Covers the new behavior requested for parent WI-001; the parent's R-01 and R-02 remain unchanged.  
**Open questions:** None.

#### R-02 — README documents the help flag

**Status:** Finalized  
**Applies to:** People reading the README to use the greet CLI.  
**Required behavior:** The README documents `--help` and its effect, along with `--shout`.  
**Boundaries and exceptions:** None identified.  
**Acceptance check:** Read the README and confirm it explains how to use `--help` and `--shout`.  
**Decision record:** Mike's standing preference on 2026-09-27 that every command-line flag be documented in the README. Mike approved R-02 on 2026-09-27.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. `--help` lists and explains every supported flag, including `--help` and `--shout`.
2. `--help` prints help instead of a greeting wherever it appears, including with a name or `--shout`; tests cover this behavior, and `npm test` passes.
3. The README documents `--help` and `--shout`.
4. Mike reviews the result.

## Notes

### Decisions and context

- WI-001 already has a built and tested `--shout` implementation in the `wi-001-shout` worktree.
- Mike requested this child before approving WI-001 and made its completion a condition of finishing WI-001 on 2026-09-27.
- Mike decided on 2026-09-27 that `--help` wins in any position, including with a name or `--shout`.
- Mike approved WI-002 requirements on 2026-09-27 and asked for design options before the build. The options compare minimal changes to the current argument checks with Node's built-in `parseArgs`.
- Mike approved the WI-002 result on 2026-09-27 and requested a local merge into `main` to ship it. There is no GitHub remote.

### Resume here

WI-002 is Done. Mike approved the result and local merge, including replacing the overlapping README.md edit. The build was merged into local `main` at `9c83b89`; the requirements baseline is committed at `a45b6fb`. `npm test` passed all six tests on `main`. An independent checker found R-01 and R-02 met, no functional defects, and no checks left unrun. The WI-002 worktree and branch were removed. WI-001 awaits owner review of the combined result. The separate WI-001 worktree still has its original uncommitted build and must be left alone until cleanup is safe.

### Solution options and considerations

- Option A extends the existing argument checks. Option B uses Node's built-in `parseArgs` with both supported Boolean flags and positional names.

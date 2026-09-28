---
id: WI-001
title: Add a --times flag to greet
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: approved
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-001: Add a --times flag to greet

## Overview

**Goal:** Let greet print the same greeting N times, one per line, when --times N is given, while keeping the optional name and one-greeting default.

**Current position:** Done on 2026-09-28. Times flag independently checked; npm test passed 6 of 6 on main; WI-002 is Done; code and documentation committed through 8f16538.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Sub-item WI-002 delivered the README examples for R-02 and is complete.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Command behavior | greet accepts --times N and prints validated repeated greetings. | Done | Command tests pass for valid and invalid inputs in R-01. | None. |
| P2 — README documentation | Every greet flag has a short command and output example. | Done | WI-002 builds and checks README.md against R-02. | WI-002 |

## Tasks

### P1 — Command behavior

- [x] **P1-T01 — Parse and print repeated greetings** · Done  
  **Work:** Implement R-01 in bin/greet.mjs using the approved design's Technical sequence step 1.  
  **Deliverable:** Argument validation and one greeting per output line.  
  **Done when:** Manual valid and invalid commands match R-01.  
  **Depends on:** None.
- [x] **P1-T02 — Test command behavior** · Done  
  **Work:** Add process-level tests for R-01 using the approved design's Technical sequence step 2.  
  **Deliverable:** Command tests for valid and invalid input.  
  **Done when:** npm test passes with exact output and failure checks.  
  **Depends on:** P1-T01.

### P2 — README documentation

- [x] **P2-T01 — Check WI-002 result** · Done  
  **Work:** Confirm WI-002 completed the R-02 examples and independent check.  
  **Deliverable:** Parent record of the sub-item result.  
  **Done when:** WI-002's README examples are checked against the command.  
  **Depends on:** P1-T02.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Times flag independently checked; npm test passed 6 of 6 on main; WI-002 is Done; code and documentation committed through 8f16538. |
| 2026-09-28 | Requirements and system guide committed on local main at 8f16538. | Delivered R-01 and R-02 are recorded; no deployment applies. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-decide. |
| 2026-09-28 | No remote: merged locally into main. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-decide. |
| 2026-09-28 | Owner said: Yes, merge it locally into main; there is no remote. I approve the merge and the git commands you need, and you can close both items out when they are done. | Local merge of the WI-002 branch into main approved; finish WI-001 and WI-002 after delivery. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I approve the WI-001 command result. | Result approved; work-finish continues. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-01 at fe07ccb: npm test 6 passed, 0 failed; direct CLI checks 11 passed; independent checker found R-01 met and no defects; evidence tests/WI-001-TEST-PLAN.md; gaps none. | WI-001 command result ready for separate owner approval. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-add-a-times-flag-to-greet/WORK-ITEM.md -> .work-items/WI-001-times-flag/WORK-ITEM.md. | Same item; the toolkit uses the new path. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Sub-item WI-002 created: Document greet flags in the README. | WI-002 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Design approved by Mike Rihm. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design updated. | The owner approves it before building starts. |
| 2026-09-28 | Owner said: "Go with option A. And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own." | Approve Option A and make R-02 a separate sub-item with its own build and result check. |
| 2026-09-28 | Design proposed: Option A parses --times in the existing command and adds CLI tests and README examples; recommend Option A. | Owner design approval is next; independent critique findings on safe integers and invalid-input test assertions were incorporated. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Set delivery owner-led. | Small item: implementation and README documentation, with checks included, so no delivery offer. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Approved." | Requirements approved. |
| 2026-09-28 | Owner said: "Yes to both checks: --times 1.5 is an error, and --times 3 with no name prints three Hello, world! lines." | Q-06 answered; add the no-name acceptance check. |
| 2026-09-28 | Owner said: "Yes to both checks: --times 1.5 is an error, and --times 3 with no name prints three Hello, world! lines." | Q-05 answered; add the fractional-value acceptance check. |
| 2026-09-28 | Spec check found that acceptance does not explicitly cover a fractional --times value or --times with no name. | Q-05 and Q-06 await owner confirmation before requirements approval. |
| 2026-09-28 | Owner said: "Both positions, yes." | Q-04 answered; R-01 and acceptance include both argument orders. |
| 2026-09-28 | Spec check found that R-01 does not state where the optional name may appear relative to --times N. | Q-04 awaits the owner before requirements approval. |
| 2026-09-28 | Owner said: "Yes, go with your recommendation: no greeting and a failure exit status." | Q-03 answered; R-01 and acceptance can be finalized for review. |
| 2026-09-28 | Owner said: "Yes, positive whole numbers only, and a clear error for anything else." | Q-02 answered; R-01 now requires positive whole numbers and a clear error for every other value. |
| 2026-09-28 | Owner said: "Yes: the same greeting N times, one per line, and keep the optional name and the one-greeting default." | Q-01 answered; define the repeated output requirement and continue refinement. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should --times N print the same greeting N times, one per line, while preserving the optional name and current one-greeting default? Answer: Yes: the same greeting N times, one per line, and keep the optional name and the one-greeting default. Mike Rihm, 2026-09-28. | Agreed goal, R-01 | Answered | owner |
| Q-02 | Should --times accept only positive whole numbers, and show an error for zero, negative, missing, or non-number values? Answer: Yes, positive whole numbers only, and a clear error for anything else. Mike Rihm, 2026-09-28. | R-01 | Answered | owner |
| Q-03 | For an invalid --times value, should greet print no greeting and exit with a failure status after showing the error? Answer: Yes, no greeting and a failure exit status. Mike Rihm, 2026-09-28. | R-01 | Answered | owner |
| Q-04 | Should the optional name work both before and after --times N, as in greet Mike --times 3 and greet --times 3 Mike? Answer: Both positions, yes. Mike Rihm, 2026-09-28. | R-01 | Answered | owner |
| Q-05 | Should the acceptance check explicitly test a fractional value such as --times 1.5 for an error, no greeting, and failure status? Answer: Yes, --times 1.5 is an error. Mike Rihm, 2026-09-28. | R-01 | Answered | owner |
| Q-06 | Should the acceptance check explicitly test greet --times 3 without a name for three Hello, world! lines? Answer: Yes, --times 3 with no name prints three Hello, world! lines. Mike Rihm, 2026-09-28. | R-01 | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: add a --times flag to greet so it prints the greeting a given number of times. Track it as a work item and ask me what you need to pin down the requirements.

### Agreed goal

Let greet print the same greeting N times, one per line, when --times N is given, while keeping the optional name and the current one-greeting default.

### Active requirements

#### R-01 — Repeat the greeting

**Status:** Finalized  
**Applies to:** People running greet with or without --times N and an optional name.  
**Required behavior:** With --times N, print the same greeting N times, one per line. The optional name still determines whom to greet, whether it appears before or after --times N. With no name, greet world. Without --times, print one greeting as today. Accept N only when it is a positive whole number. For any other value, show a clear error, print no greeting, and exit with a failure status.  
**Boundaries and exceptions:** Zero, negative, fractional, missing, and non-number values are invalid.  
**Acceptance check:** Run greet Mike --times 3 and greet --times 3 Mike; each prints three identical greeting lines for Mike. Run greet --times 3 with no name; it prints three Hello, world! lines. Run it without --times; see one greeting line. Run it with zero, a negative number, --times 1.5, a missing value, and a non-number value; see a clear error, no greeting, and a failure exit status for each.  
**Decision record:** Mike Rihm, 2026-09-28, answers to Q-01 through Q-06; requirements approved by Mike Rihm, 2026-09-28.  
**Open questions:** None.

#### R-02 — Explain flags in the README

**Status:** Finalized  
**Applies to:** People reading the command documentation.  
**Required behavior:** List every command-line flag, including --times, in the README with a short example for each.  
**Boundaries and exceptions:** None identified.  
**Acceptance check:** The README lists --times and shows a short command and its output; each other command-line flag, if any, also has a short example.  
**Decision record:** Mike Rihm, 2026-09-28, stated README preference; requirements approved by Mike Rihm, 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. --times N prints the same greeting N times, one per line, with the optional name before or after the flag and its value, when N is a positive whole number.
2. greet --times 3 with no name prints three Hello, world! lines.
3. Without --times, greet still prints one greeting.
4. Zero, negative, fractional (including --times 1.5), missing, and non-number values for --times each produce a clear error, no greeting, and a failure exit status.
5. The README lists --times with a short example, along with any other flags.
6. Mike reviews the tested result.

## Notes

### Decisions and context

- The current command accepts an optional name and prints one greeting. It has no flags yet.
- Design approach, 2026-09-28: inspect the current command first, use its existing Node.js code and built-in argument handling, and present one option because the requirements leave no material product choice. Small item with no delivery team.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

None yet.

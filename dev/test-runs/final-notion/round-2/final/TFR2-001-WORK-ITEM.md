TFR2-001: Build the tip-split bill command
Location: https://app.notion.com/p/Build-the-tip-split-bill-command-3e9b381da17681e8a739cde47e080e24
Stage: Done | Waiting on: none | Continue with: nothing (finished)
Parent: none | Sub-items: TFR2-002 | Design: approved (https://app.notion.com/p/TFR2-001-Build-the-tip-split-bill-command-solution-design-3e9b381da1768133a4fbecd575748cc7)

---
id: TFR2-001
title: Build the tip-split bill command
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
# TFR2-001: Build the tip-split bill command

## Overview

**Goal:** Split a restaurant bill equally with an 18% default tip and an optional tip percentage.

**Current position:** Done on 2026-09-28. Approved default and optional tip results merged into main at 56c44fe; 5 node:test checks passed on main; delivered documents committed at 6b1c812; TFR2-002 is Done.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** TFR2-002 delivered R-02, passed its separate result review, and is Done. Both delivered local item worktrees and branches were removed with the owner’s authorization.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Default tip command | The command splits a bill with the 18% default tip (R-01). | Done | The default example and invalid bill or people checks pass. | None. |
| P2 — Optional tip | The command accepts `--tip <percent>` (R-02). | Done | TFR2-002 custom-tip and invalid-tip checks passed, including the R-01 half-cent example using `--tip 0`; its result was approved separately and merged into main. | TFR2-002 |

## Tasks

### P1 — Default tip command

- [x] **P1-T01 — Add the default command** · Done  
  **Work:** Build bill and people validation, the 18% calculation, half-cent-up rounding, and output formatting (R-01; design Technical sequence step 1).  
  **Deliverable:** `bin/tip-split.js` with the default path.  
  **Done when:** `node bin/tip-split.js 84.50 3` prints `Each person pays $33.24`; invalid bill and people values print the usage line and exit 1.  
  **Depends on:** None.
- [x] **P1-T02 — Test the default path** · Done  
  **Work:** Add `node:test` cases for the default result and invalid bill and people values (R-01; design Acceptance checks).  
  **Deliverable:** `tests/tip-split.test.js` with default-path tests.  
  **Done when:** `node --test tests/tip-split.test.js` passes the default-path cases.  
  **Depends on:** P1-T01.

### P2 — Optional tip

- [x] **P2-T01 — Check the combined command** · Done  
  **Work:** After TFR2-002 adds `--tip`, run the full command tests and the R-01 half-cent example using `--tip 0` (design Technical sequence step 3).  
  **Deliverable:** Recorded test results on TFR2-001; TFR2-002 keeps its own result evidence.  
  **Done when:** The full test suite passes and `node bin/tip-split.js 0.01 2 --tip 0` prints `Each person pays $0.01`.  
  **Depends on:** P1-T02 and TFR2-002 build.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Owner said: "Yes, remove both." Both delivered item worktrees and local branches were removed after verifying they were clean and merged into main. | No local item worktree or branch remains; TFR2-001 stays Done. |
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Approved default and optional tip results merged into main at 56c44fe; 5 node:test checks passed on main; delivered documents committed at 6b1c812; TFR2-002 is Done. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | Stage 13 skipped: this local command needs no deployment. | Continue stage 14 delivered behavior documentation. |
| 2026-09-28 | No remote: merged locally into main at ff39be4. | No pull request; no deployment. Continue delivered requirements and system guide updates after TFR2-002 merge. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner said: "Yes, I authorize merging both approved branches into main, TFR2-001 first. Then finish both items." | Q-05 answered; merge TFR2-001 then TFR2-002 locally into main and finish both items. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I ran it myself: 84.50 3 prints $33.24 and bad input prints the usage line. I approve the TFR2-001 result. | Result approved; work-finish continues. Owner directly checked the default example and bad input. |
| 2026-09-28 | Sub-item TFR2-002 moved here in Notion by hand (it was a top-level item). | TFR2-002 is part of this item now. |
| 2026-09-28 | Changed by hand: title from "Build the tip-split command" to "Build the tip-split bill command". | The title was changed by hand. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-01 default command at ff39be4: 3 tests passed; direct $84.50 example printed $33.24. Combined TFR2-002 branch at 339892d: 5 tests passed and zero-tip half-cent example printed $0.01. Evidence: `tests/TFR2-001-TEST-PLAN.md`. No independent agent check; no gaps found. | Default command result is ready for separate owner approval; branches remain unmerged. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Owner said: "No agent team for this one. Keep it owner-led: build it yourself and show me each result. Go ahead and build both. I approve the git commands you need for worktrees, branches, and commits, but no merge yet." | Build both items with this agent, present each result separately, and leave both unmerged. |
| 2026-09-28 | Set delivery owner-led. Q-04 answered. No longer waiting on the owner. | Continue with work-on. |
| 2026-09-28 | Sub-item TFR2-002 moved out in Notion by hand. | TFR2-002 is a top-level item now. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Sub-item TFR2-002 created: Add the --tip option. | TFR2-002 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Design approved by Mike Rihm. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design updated. | The owner approves it before building starts. |
| 2026-09-28 | Design updated. | The owner approves it before building starts. |
| 2026-09-28 | Owner said: "I approve Option A. Also split the --tip part into its own sub-item under TFR2-001, so I can review it on its own." | Design Option A approved; create a separate R-02 sub-item for owner review. |
| 2026-09-28 | Design proposed: one Node.js command with exact decimal arithmetic; Option A recommended. | Owner chooses whether to approve Option A before implementation planning. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Q-03: yes, round an exact half cent up. With that change I approve the requirements again." | Q-03 answered; revise R-01 and Acceptance, then record renewed requirements approval. |
| 2026-09-28 | Design readiness check found that R-01 does not specify rounding for exact half-cent shares; Q-03 opened. | Refine R-01 with the owner and seek approval of revised requirements before continuing design. |
| 2026-09-28 | Set stage 04 Solution design -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Approved." | Requirements approved. |
| 2026-09-28 | Owner said: "Q-02 on TFR2-001: yes, use the ranges you proposed." | Q-02 answered; update R-01 and R-02, then complete requirements review. |
| 2026-09-28 | Owner said: "About Q-01 on TFR2-001: yes, that behavior. Print a short usage line, `Usage: node bin/tip-split.js <bill> <people> [--tip <percent>]`, and exit with code 1." | Q-01 answered; update invalid input requirements, then check the complete requirements. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | What should the command do when the bill amount, person count, or tip percentage is missing or invalid? Answer: Print `Usage: node bin/tip-split.js <bill> <people> [--tip <percent>]` and exit with code 1. Owner, 2026-09-28. | R-01, R-02 | Answered | owner |
| Q-02 | Which numeric bill and tip values are valid? Answer: A bill of $0 or more with at most two decimal places; a tip of 0% or more with no upper limit. Reject negative or nonnumeric values and fractional cents. Owner, 2026-09-28. | R-01, R-02 | Answered | owner |
| Q-03 | When the calculated share is exactly half a cent, should the command round up to the next cent? Answer: Yes, round an exact half cent up. Owner, 2026-09-28. | R-01 | Answered | owner |
| Q-04 | Would you like agents to take responsibility for delivering this, with you acting as product owner? | delivery for TFR2-001 and TFR2-002 | Answered | owner |
| Q-05 | May we merge the approved TFR2-001 and TFR2-002 branches locally into main, keeping both test plans and the combined command? Answer: Yes, merge TFR2-001 first, then TFR2-002, and finish both. Owner, 2026-09-28. | delivery of TFR2-001 and TFR2-002 | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: build the tip-split command. `node bin/tip-split.js 84.50 3` should print how much each person pays with an 18% tip added, like `Each person pays $33.24`. Also add a --tip flag to change the tip percent, for example `--tip 20`.

### Agreed goal

A person can enter a restaurant bill and the number of people, optionally choose a tip percentage, and see the amount each person pays with tip included.

### Active requirements

#### R-01 — Split the bill with the default tip

**Status:** Finalized  
**Applies to:** A person running the command with a bill amount and a number of people.  
**Required behavior:** Add an 18% tip to the bill, divide the total equally by the number of people, round the amount per person to the nearest cent, with an exact half cent rounded up, and print it as dollars and cents.  
**Boundaries and exceptions:** The bill amount is in dollars and must be $0 or more with at most two decimal places. The person count is a positive whole number. Reject negative or nonnumeric bill amounts and fractional cents. When the bill amount or person count is missing or invalid, print `Usage: node bin/tip-split.js <bill> <people> [--tip <percent>]` and exit with code 1.  
**Acceptance check:** A bill of $84.50 split among 3 people prints `Each person pays $33.24`. A bill of $0.01 split among 2 people with `--tip 0` prints `Each person pays $0.01`. Missing or invalid bill amount or person count prints the usage line and exits with code 1.  
**Decision record:** Owner starting request, 2026-09-28. Owner answer to Q-01, 2026-09-28. Owner answer to Q-02, 2026-09-28. Owner approved the earlier wording, 2026-09-28. Was: round the amount per person to the nearest cent, with exact half-cent rounding unspecified. Owner answer to Q-03, 2026-09-28: round an exact half cent up. Revised wording approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-02 — Choose the tip percentage

**Status:** Finalized  
**Applies to:** A person who supplies the optional `--tip` flag with a percentage.  
**Required behavior:** Use the supplied percentage in place of 18% and print the resulting amount per person in the same format.  
**Boundaries and exceptions:** The tip percentage must be numeric and 0% or more, with no upper limit. When the tip percentage is missing after `--tip`, negative, or nonnumeric, print `Usage: node bin/tip-split.js <bill> <people> [--tip <percent>]` and exit with code 1.  
**Acceptance check:** A bill of $84.50 split among 3 people with `--tip 20` prints `Each person pays $33.80`. Missing or invalid tip percentage prints the usage line and exits with code 1.  
**Decision record:** Owner starting request, 2026-09-28. Owner answer to Q-01, 2026-09-28. Owner answer to Q-02, 2026-09-28. Owner approval, 2026-09-28. Requirements reapproved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. The command prints `Each person pays $33.24` for a bill of $84.50 split among 3 people with the default 18% tip.
2. The command prints `Each person pays $33.80` for the same bill and people with `--tip 20`.
3. The command prints `Each person pays $0.01` for a bill of $0.01 split among 2 people with `--tip 0`.
4. A missing or invalid bill amount, person count, or tip percentage prints `Usage: node bin/tip-split.js <bill> <people> [--tip <percent>]` and exits with code 1.
5. The owner reviews the tested result.

## Notes

### Decisions and context

- Option A was approved by Mike Rihm on 2026-09-28.
- TFR2-002 covers R-02 and had its own result review, as the owner requested on 2026-09-28. It is a sub-item of TFR2-001 in Notion.
- Design process: scan the repository and requirements first; use Node.js built-ins; present one option because the requirements leave no material product choice in the implementation.
- Design review team: one requirements analyst, one design architect, and one design critic. No research question needed a separate researcher.
- Owner-led delivery for both items: Mike Rihm chose on 2026-09-28 to have this agent build both without a team and show each result. He approved the local merges on 2026-09-28. Both reached main.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

Option A is approved. Its details are in the Solution Design subpage.

---
id: WI-001
title: Build the late fee command
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-29 by Mike Rihm"
design: approved
result_approved: "2026-09-29 by Mike Rihm"
updated: 2026-09-29
---

# WI-001: Build the late fee command

## Overview

**Goal:** Provide a late fee command that reports the fee and total due in dollars.

**Current position:** Done on 2026-09-29. Owner approved the dollar result; five integrated dollar tests passed, child WI-002 is Done, and main contains the feature and documents at d935d1c.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 delivered R-03, reached main, and is Done.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Dollar fee and total | The command prints the late fee and total due in dollars. | Done | R-01 and R-02 acceptance checks pass. | None. |
| P2 — Cents extension | WI-002 adds the optional cents line after the dollar command. | Done | WI-002 passed its R-03 acceptance checks and reached main. | WI-002 |

## Tasks

### P1 — Dollar fee and total

- [x] **P1-T01 — Build the dollar command** · Done  
  **Work:** Implement the approved Option A argument validation, exact fee calculation, dollar formatting, and error path for R-01 and R-02.  
  **Deliverable:** bin/feecalc.js.  
  **Done when:** The specified 200/10 and 1/2 outputs are exact, and invalid input exits unsuccessfully with empty stdout.  
  **Depends on:** None.
- [x] **P1-T02 — Verify the command** · Done  
  **Work:** Add a WI-001 test plan and run checks for rounding, valid spellings, large integers, and malformed arguments from the design Build and verification plan.  
  **Deliverable:** The WI-001 test plan, executable checks, and recorded results.  
  **Done when:** Every WI-001 acceptance check passes on the item branch and the result is ready for independent review.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-29 | Finished. Result approved earlier (2026-09-29 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Owner approved the dollar result; five integrated dollar tests passed, child WI-002 is Done, and main contains the feature and documents at d935d1c. |
| 2026-09-29 | Delivered requirements, system guide, and roadmap committed on main at d935d1c; merged branch and clean worktree removed. | WI-001 is ready for Done after WI-002 closes. |
| 2026-09-29 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-29 | Deployment stage skipped: the deliverable is a local Node.js command, and no deployment target is recorded. | Proceed to the delivered requirements baseline. |
| 2026-09-29 | No remote: merged locally into main. | No pull request; no deployment. |
| 2026-09-29 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-29 | Owner said: Ship it: WI-001 and WI-002. There is no remote, so merge both into main here, then finish WI-002 and WI-001, and clean up their worktrees and branches. I approve the Git commands for that. | Local merge and cleanup of WI-001 authorized. |
| 2026-09-29 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-29 | Owner said: I ran it in the WI-001 worktree and it printed what I expected. I approve the WI-001 result. No merge yet. | Result approved; leave the WI-001 branch unmerged. |
| 2026-09-29 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-29 | Checked: R-01 and R-02 against commit 3b2bc38; acceptance-checker: R-01 and R-02 met, ready for owner review; evidence: node --test tests/wi-001.test.js passed 5 of 5, tests/WI-001-TEST-PLAN.md, direct CLI checks, clean branch diff; gaps: owner result approval pending | Dollar command is ready for owner result approval; merge remains withheld. |
| 2026-09-29 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-29 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-29 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-29 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-29 | Owner said: "No agent team for this one, I'll lead it myself. Keep going and build WI-001, the dollar fee and total. I approve the Git commands you need for it (worktree, branch, commits), but do not merge anything yet." | Owner-led delivery recorded; build the dollar command on its own branch and leave it unmerged. |
| 2026-09-29 | Set delivery owner-led. Q-05 answered. No longer waiting on the owner. | Continue with work-organize. |
| 2026-09-29 | Design approved by Mike Rihm. | The design can be built. No longer waiting on the owner. |
| 2026-09-29 | Design updated. | The owner approves it before building starts. |
| 2026-09-29 | Sub-item WI-002 created: Add the --cents option. | WI-002 delivers R-03. Those requirements stay here, unchanged and approved. |
| 2026-09-29 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-decide. |
| 2026-09-29 | Owner said: I approve Option A. Before you build, split the --cents option out into its own sub-item under WI-001, so WI-001 is only the dollar fee and total. | Option A approved with R-03 assigned to a child; WI-001 implementation covers R-01 and R-02. |
| 2026-09-29 | Design proposed: Option A is a Node.js command using exact integer-cent arithmetic; independent design critique found no remaining material issue. | Mike chooses and approves the design before implementation. |
| 2026-09-29 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-29 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-29 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-29 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-29 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-29 | Owner said: I approve the WI-001 requirements. | Requirements approved. |
| 2026-09-29 | Owner said: "Yes, the total due is the invoice amount plus the rounded fee." | Q-04 answered; R-01 and R-03 can specify the rounding order. Requirements review continues. |
| 2026-09-29 | Owner said: "Yes, I agree: an error on standard error and a failing exit, with no total printed." | Q-03 answered; R-01 and R-02 specify missing and invalid input behavior. Q-04 still needs an owner answer. |
| 2026-09-29 | Owner said: "Yes, I agree with that input rule." | Q-02 answered; R-01 can specify valid amounts and day counts. Q-03 and Q-04 still need owner answers. |
| 2026-09-29 | Independent requirements check found unsettled input limits, invalid-input behavior, and the rounding order. | Q-02 to Q-04 opened; work-requirements continues after owner answers. |
| 2026-09-29 | Owner said: "Yes, round the fee and the total to the nearest cent, with half a cent rounded up, like you said." | Q-01 answered; R-01 and R-03 can state the rounding rule. |
| 2026-09-29 | Drafted R-01 to R-03 from the owner request; no implementation started. | Q-01 rounding answer and explicit requirements approval remain before implementation. |
| 2026-09-29 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-29 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Answered 2026-09-29 by Mike Rihm: round the fee and the total to the nearest cent, with half a cent rounded up. | R-01, R-03 | Answered | owner |
| Q-02 | Answered 2026-09-29 by Mike Rihm: invoice amounts of $0 or more with at most two decimal places, and whole numbers of days of 0 or more. | R-01 | Answered | owner |
| Q-03 | Answered 2026-09-29 by Mike Rihm: a missing or invalid input produces a clear error on standard error, a failing exit, and no total printed. | R-01, R-02 | Answered | owner |
| Q-04 | Answered 2026-09-29 by Mike Rihm: the total due is the invoice amount plus the rounded fee. | R-01, R-03 | Answered | owner |
| Q-05 | Would you like agents to take responsibility for delivering this, with you acting as product owner? Recommended: yes, because WI-001 now has a separate WI-002 extension and each result needs its own checks. | delivery | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

I want the late fee command built. When I run node bin/feecalc.js 200 --days 10 it should print "Late fee: $5.00  Total due: $205.00". The fee is 0.25% of the invoice amount for each day late. I also want a --cents option that adds a second line with the total due in whole cents, like "Total due in cents: 20500", because that is what our billing API takes. Do not build anything until I approve the requirements.

### Agreed goal

Provide a command that calculates a 0.25% daily late fee on an invoice and prints the late fee and total due in dollars. WI-002 delivers the separately requested --cents option under R-03.

### Active requirements

#### R-01 — Calculate the late fee

**Status:** Finalized  
**Applies to:** An overdue invoice amount and the number of days late supplied to the command.  
**Required behavior:** Calculate the late fee as 0.25% of the original invoice amount for each day late. Round the fee to the nearest cent, with half a cent rounded up. The total due is the invoice amount plus that rounded fee.  
**Boundaries and exceptions:** Valid invoice amounts are $0 or more with at most two decimal places. Valid day counts are whole numbers of 0 or more. Missing or invalid inputs do not produce a calculated total.  
**Acceptance check:** For an invoice amount of $200 and 10 days late, the fee is $5.00 and the total due is $205.00. For an invoice amount of $1 and 2 days late, the half-cent fee rounds up to $0.01 and the total due is $1.01. A missing or invalid amount or day count produces no calculated total.  
**Decision record:** Mike Rihm, 2026-09-29, starting request, rounding answer, input rule answer, missing or invalid input answer, total due answer, and approval of WI-001 requirements.  
**Open questions:** None.

#### R-02 — Print the dollar amounts

**Status:** Finalized  
**Applies to:** A command run with an invoice amount and the days-late option.  
**Required behavior:** For valid input, print one line containing the late fee and total due in dollars, each with two decimal places. For missing or invalid input, print a clear error to standard error, exit unsuccessfully, and print no total.  
**Boundaries and exceptions:** No second line is requested unless the cents option is supplied.  
**Acceptance check:** For an invoice amount of $200 and 10 days late, the first line is exactly "Late fee: $5.00  Total due: $205.00". A run with a missing or invalid input prints a clear error on standard error, exits unsuccessfully, and prints no total.  
**Decision record:** Mike Rihm, 2026-09-29, starting request, missing or invalid input answer, and approval of WI-001 requirements.  
**Open questions:** None.

#### R-03 — Print total due in cents on request

**Status:** Finalized  
**Applies to:** A command run with the cents option.  
**Required behavior:** Add a second line with the total due as a whole number of cents for the billing API.  
**Boundaries and exceptions:** The cents value must represent the invoice amount plus the rounded fee, matching the total due shown in dollars.  
**Acceptance check:** For an invoice amount of $200 and 10 days late, the cents option adds the line "Total due in cents: 20500" after the dollar line. For an invoice amount of $1 and 2 days late, it adds "Total due in cents: 101".  
**Decision record:** Mike Rihm, 2026-09-29, starting request, rounding answer, total due answer, and approval of WI-001 requirements.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. Running node bin/feecalc.js 200 --days 10 prints exactly "Late fee: $5.00  Total due: $205.00" (R-01, R-02).
2. Running the command with a missing or invalid input prints a clear error on standard error, exits unsuccessfully, and prints no total (R-01, R-02).
3. The dollar command correctly rounds a half-cent fee up once and adds the rounded fee to the invoice amount (R-01).
4. The owner approves the dollar command result. WI-002 has separate acceptance for the optional --cents output (R-03).

## Notes

### Decisions and context

- Mike Rihm approved R-01 to R-03 on 2026-09-29.
- Mike Rihm approved Option A on 2026-09-29 and instructed that --cents become sub-item WI-002 before any build. WI-001 directly builds only R-01 and R-02; WI-002 covers R-03 and has separate acceptance.
- Design approach: use built-in Node.js features and exact integer-cent arithmetic. The approved design records the split.
- The earlier design review passed independent critique before this scope split. No implementation had started.
- **Owner-led delivery (WI-001 goal: dollar fee and total):** Mike Rihm declined an agent team on 2026-09-29. This chat builds WI-001 without helpers. Git worktree, branch, and commits are approved for WI-001; merge is withheld pending owner approval.

### Resume here

Finished on 2026-09-29. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, not approved requirements or design decisions.

- **For R-01:** Parse the amount into integer cents and calculate with exact integer arithmetic so accepted large values keep the correct cents.
- **For R-02 and R-03:** Use one Node.js command file and print the cents line only when requested.

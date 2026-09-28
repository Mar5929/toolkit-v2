---
id: WI-001
title: Build the tip command with split option
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

# WI-001: Build the tip command with split option

## Overview

**Goal:** Build a terminal tip command that shows the tip, total, and optional per-person payment.

**Current position:** Done on 2026-09-28. Owner accepted the whole tip command on 2026-09-28; node --test passed 9 tests on main; WI-001 and WI-002 code merged at a6d571c and documentation committed at 09432ce.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 delivered --split and is complete. Both item branches were merged into main and removed.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Plain tip and total | Build the command for bill and percentage input. | Done | R-01 and bill and percentage cases of R-03 pass checks; plain output was reviewed before split work started. | None. |
| P2 — Split option | Add the per-person amount after the plain command is checked. | Done | WI-002 passed R-02 and split cases of R-03; owner accepted the whole command. | WI-002 |

## Tasks

### P1 — Plain tip and total

- [x] **P1-T01 — Build plain tip command** · Done  
  **Work:** Add bill and percentage parsing, validation, exact cent calculation, and output in bin/tipcalc.js (R-01 and bill and percentage cases of R-03; design Build and verification plan step 1).  
  **Deliverable:** A Node command that prints tip and total or a corrective error.  
  **Done when:** Required plain examples print the specified values; missing and invalid bill or percentage exits 1 with a corrective error.  
  **Depends on:** None.
- [x] **P1-T02 — Check plain command** · Done  
  **Work:** Add node:test process checks for R-01 and bill and percentage cases of R-03, then run the checks and inspect the plain output (design Acceptance checks).  
  **Deliverable:** tests/tipcalc.test.js and a passing check run.  
  **Done when:** The plain examples and invalid input checks pass with node --test.  
  **Depends on:** P1-T01.

### P2 — Split option

WI-002 owns the tasks for this phase after P1 is checked.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Owner accepted the whole tip command on 2026-09-28; node --test passed 9 tests on main; WI-001 and WI-002 code merged at a6d571c and documentation committed at 09432ce. |
| 2026-09-28 | Delivered requirements, system guide, and project roadmap were committed on local main at 09432ce; WI-001 branch and worktree were removed. | Specification baseline saved; cleanup complete. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main at fdc5485; WI-002 then extended main at a6d571c. | No pull request; no deployment. |
| 2026-09-28 | Set stage 08 Build -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). |
| 2026-09-28 | Owner said: Ship it: WI-001 and WI-002. The whole tip command works the way I asked. There is no remote, so merge them into main here, then finish WI-002 and WI-001 and clean up the worktrees and branches. | WI-001 result and both local merges approved. |
| 2026-09-28 | P1 plain tip and total built and checked on branch claude/wi-001-build-the-tip-command-with at commit fdc5485; six Node tests passed; no independent check ran. | P1 complete and unmerged. WI-002 split option is next when the owner asks to continue. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Owner said: "No agent team, I’ll lead it myself. Keep going and build the plain tip and total for WI-001. I approve the Git commands you need for that (worktree add, add, commit), but do not merge anything yet." | Owner-led delivery recorded; build P1 on its own branch and leave it unmerged. |
| 2026-09-28 | Set delivery owner-led. Q-04 answered. No longer waiting on the owner. | Mike Rihm declined an agent team on 2026-09-28 and will lead delivery himself; Codex builds WI-001 P1 as requested. |
| 2026-09-28 | Moved by hand: .work-items/WI-001-build-the-tip-command-with-split-option/WORK-ITEM.md -> .work-items/cli/WI-001-tip-command/WORK-ITEM.md. | It is still a top-level item. Group: cli. |
| 2026-09-28 | Sub-item WI-002 created: Add the --split option. | WI-002 delivers R-02, R-03. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Design approved by Mike Rihm. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design updated. | The owner approves it before building starts. |
| 2026-09-28 | Owner said: I approve Option A. Before you build, split the --split option out into its own sub-item under WI-001, so the plain tip and total can be built and checked first. | Option A approved with plain tip and total first; split will be a child item. |
| 2026-09-28 | Design proposed: Option A, one Node command with exact cent arithmetic and built-in node:test checks; recommended after an independent design critique. | Owner decides whether to approve Option A before build planning. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: I approve the WI-001 requirements. | Requirements approved. |
| 2026-09-28 | Independent requirements check found no blocking gaps in R-01 through R-03. | Ask the owner to approve the requirements before design or build. |
| 2026-09-28 | Owner said: "Yes, that is the rule: bills of zero or more with at most two decimal places, percentages from 0 to 100, and split counts that are whole numbers of 1 or more. Missing or invalid input prints an error that says how to fix it and exits with code 1." | Q-03 answered; update R-01, R-02, and acceptance checks before requirements approval. |
| 2026-09-28 | Requirements check found valid input ranges and malformed input behavior unspecified. | Ask owner for the input rules before requirements approval. |
| 2026-09-28 | Owner said: "Yes, round the tip to the nearest cent with a half cent rounded up, like you said." | Q-02 answered; R-01 and R-02 specify tip rounding before calculating the total and any share. |
| 2026-09-28 | Owner said: "Yes, that’s the goal. For --split, print a second line like \"Each person pays: $20.00\". When the total doesn’t divide evenly, round each share up to the next cent so nobody is short." | Agreed goal confirmed; R-02 split format and rounding settled. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | What exact text should the split example print after the tip and total? | R-02 | Answered 2026-09-28: second line is "Each person pays: $20.00"; round each share up to the next cent when the total does not divide evenly. | owner |
| Q-02 | How should a tip with a fraction of a cent be rounded? | R-01, R-02 | Answered 2026-09-28: round the tip to the nearest cent, with a half cent rounded up. | owner |
| Q-03 | Which bill amounts, percentages, and split counts are valid, and what should happen for missing or malformed input? | R-01, R-02 | Answered 2026-09-28: bills of zero or more with at most two decimal places; percentages from 0 to 100; split counts whole numbers of 1 or more; missing or invalid input prints an error that says how to fix it and exits with code 1. | owner |
| Q-04 | Would you like agents to take responsibility for delivering this, with you acting as product owner? | delivery | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

I want the tip command built. When I run node bin/tipcalc.js 50 --percent 20 it should print "Tip: $10.00  Total: $60.00". I also want a --split option: node bin/tipcalc.js 50 --percent 20 --split 3 should also print what each person pays. Do not build anything until I approve the requirements.

### Agreed goal

Build a terminal tip command that shows the tip and total for a bill, and optionally shows the amount each person pays when the total is split.

### Active requirements

#### R-01 — Show tip and total

**Status:** Finalized  
**Applies to:** A person running the tip command with a bill amount and --percent.  
**Required behavior:** Calculate the tip from the bill amount and percentage. Round the tip to the nearest cent, with a half cent rounded up. Add the rounded tip to the bill amount for the total. Show the tip and total with two decimal places. For a bill of $50 and --percent 20, show exactly "Tip: $10.00  Total: $60.00".  
**Boundaries and exceptions:** A bill must be zero or more and have at most two decimal places. A percentage must be from 0 to 100, inclusive. Missing or invalid input follows R-03.  
**Acceptance check:** A $50 bill at 20 percent prints exactly "Tip: $10.00  Total: $60.00". A $0.05 bill at 10 percent shows a $0.01 tip and $0.06 total. A $0 bill at 0 percent shows a $0.00 tip and total.  
**Decision record:** Owner starting request and follow-ups on rounding and input rules, 2026-09-28. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-02 — Show a share when splitting

**Status:** Finalized  
**Applies to:** A person adding --split to a tip command.  
**Required behavior:** Print a second line in the form "Each person pays: $20.00". Divide the total, including the rounded tip from R-01, by the number of people; when it does not divide evenly, round each share up to the next cent so the combined shares cover the total.  
**Boundaries and exceptions:** A split count must be a whole number of 1 or more. Each share has two decimal places. Missing or invalid input follows R-03.  
**Acceptance check:** A $50 bill at 20 percent with --split 3 prints "Tip: $10.00  Total: $60.00" followed by "Each person pays: $20.00". A $10 bill at 0 percent with --split 3 shows "Each person pays: $3.34". A $0.05 bill at 10 percent with --split 2 shows a $0.01 tip, a $0.06 total, and $0.03 per person.  
**Decision record:** Owner starting request and follow-ups on split format, rounding, and input rules, 2026-09-28. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-03 — Explain invalid input

**Status:** Finalized  
**Applies to:** A person who omits or enters an invalid bill amount, percentage, or split count.  
**Required behavior:** Print an error that says how to correct the missing or invalid input, then exit with code 1.  
**Boundaries and exceptions:** Valid bills are zero or more with at most two decimal places. Valid percentages are from 0 to 100, inclusive. Valid split counts are whole numbers of 1 or more.  
**Acceptance check:** Omit each required input in turn and enter a negative bill, a bill with three decimal places, a percentage outside 0 to 100, and a zero or fractional split count. Each case prints an error that identifies the invalid input and its valid range or form, and exits with code 1.  
**Decision record:** Owner answer to Q-03, 2026-09-28. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. node bin/tipcalc.js 50 --percent 20 prints exactly "Tip: $10.00  Total: $60.00" (R-01).
2. node bin/tipcalc.js 50 --percent 20 --split 3 prints "Tip: $10.00  Total: $60.00" on the first line and "Each person pays: $20.00" on the second (R-02).
3. A $0.05 bill at 10 percent produces a $0.01 tip and a $0.06 total; split among 2 people, each pays $0.03 (R-01, R-02).
4. A $10 bill at 0 percent split among 3 people prints "Each person pays: $3.34" (R-02).
5. A $0 bill at 0 percent prints a $0.00 tip and total; a percentage of 100 is accepted; a split count of 1 is accepted (R-01, R-02).
6. Missing bill, percentage, or split count, and a negative bill, a bill with three decimal places, a percentage outside 0 to 100, or a zero or fractional split count each print an error that explains the valid input and exit with code 1 (R-03).
7. The owner reviews the completed command.

## Notes

### Decisions and context

- 2026-09-28: The approved requirements are detailed, so inspect the repository first. Use Node built-in mechanisms and one design option for this small command. The earlier independent requirements check found no blocking gaps. A separate design critic reviews the proposed option.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

---
id: WI-001
title: Build the plain tip and total command
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

# WI-001: Build the plain tip and total command

## Overview

**Goal:** Deliver the plain terminal command for tip and total; track the optional split in WI-002.

**Current position:** Done on 2026-09-28. Mike approved the full tip command; four command tests passed on local main at 421fcb7; WI-002 is Done; requirements and system guide committed at 9dbf3c8.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 delivered the --split option (R-02) and is Done.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Plain tip and total | The command prints the rounded tip and total | Done | R-01 command and error checks pass | None. |
| P2 — Split option | The command also prints each person’s rounded-up share when requested | Done | WI-002 passed its R-02 checks, received its own result approval, and is Done | WI-002 |

## Tasks

### P1 — Plain tip and total

- [x] **P1-T01 — Parse command inputs** · Done  
  **Work:** Add bill and percentage argument validation using the approved Option A design (R-01).  
  **Deliverable:** `bin/tipcalc.js` input parsing and errors.  
  **Done when:** The sample command is accepted and invalid bill, percentage, or argument syntax exits nonzero with no result output.  
  **Depends on:** None.
- [x] **P1-T02 — Calculate and print Tip and Total** · Done  
  **Work:** Use exact decimal arithmetic and half-up cent rounding, then print the R-01 line.  
  **Deliverable:** R-01 calculation and output in `bin/tipcalc.js`.  
  **Done when:** The three exact R-01 examples and zero inputs produce the approved output.  
  **Depends on:** P1-T01.
- [x] **P1-T03 — Check the plain command** · Done  
  **Work:** Add process-level R-01 checks in `tests/tipcalc.test.js` and run them.  
  **Deliverable:** Recorded R-01 test results.  
  **Done when:** Every R-01 acceptance check passes, including invalid inputs.  
  **Depends on:** P1-T02.

### P2 — Split option

WI-002 delivers this phase after P1. Its tasks and result approval stay in WI-002.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Mike approved the full tip command; four command tests passed on local main at 421fcb7; WI-002 is Done; requirements and system guide committed at 9dbf3c8. |
| 2026-09-28 | No deployment applies: this local terminal command is delivered on main. | Requirements and system guide committed locally as 9dbf3c8. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner said: Ship it: WI-001 and WI-002. The whole tip command works the way I asked. There is no remote, so merge both into main here, then finish WI-002 and WI-001, and clean up their worktrees and branches. I approve the Git commands for that. | Owner authorized local merge, closeout, and cleanup; result approval was already recorded. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I ran it in the WI-001 worktree and it printed what I expected. I approve the WI-001 result. No merge yet. | WI-001 result approved; branch remains unmerged. |
| 2026-09-28 | Checked: R-01 against commit 8f746be; acceptance-checker: R-01 met on exact commit with no defects; evidence: tests/WI-001-TEST-PLAN.md, 2 passing Node tests, direct examples and invalid-input checks; gaps: R-02 belongs to WI-002 | WI-001 result ready for owner review. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked: R-01 against commit 8f746be; acceptance-checker: none, owner requested no agent team; evidence: tests/WI-001-TEST-PLAN.md, 2 Node tests passed with 0 failures, and the direct $50 command printed the required line; gaps: WI-002 split checks remain separate. | P1 result ready for owner review; no merge authorized. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Owner said: "No agent team for this one, I’ll lead it myself. Keep going and build the plain tip and total for WI-001. I approve the Git commands you need for that (worktree, branch, commits), but do not merge anything yet." | Git worktree and commit writes authorized for WI-001; agent builds P1 without merging. |
| 2026-09-28 | Recorded Option A approval; created WI-002 for R-02; planned both items. Git worktree creation was rejected because AskForApproval is Never. | No code was built; Q-05 waits for the worktree and branch before P1 can start. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress); waiting on owner. | Waits for the owner's answer to Q-05 (work-decide) before the step it blocks. |
| 2026-09-28 | Design text changed after approval. | The text of the approved design changed. Tell the owner what changed; ask him to approve it again when the change is more than a correction. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Folder renamed for the new title: .work-items/WI-001-build-the-tip-command/ -> .work-items/WI-001-build-the-plain-tip-and-total-command/. | Same item; the toolkit uses the new path. |
| 2026-09-28 | Set title "Build the plain tip and total command" (was "Build the tip command"). | Continue with work-organize. |
| 2026-09-28 | Sub-item WI-002 created: Add the --split option. | WI-002 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Design approved by Mike Rihm. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design updated. | The owner approves it before building starts. |
| 2026-09-28 | Owner said: I approve Option A. Before you build, split the --split option out into its own sub-item under WI-001, so WI-001 is the plain tip and total and the sub-item is the split. | Approve Option A; create a child for R-02 before building R-01. |
| 2026-09-28 | Design proposed: Option A uses one Node command with exact decimal arithmetic; the independent design critic found R-01 and R-02 satisfied after fixes. | Owner design approval is the next gate before the build. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Set delivery owner-led. | Small item: one terminal command with two approved requirements, so no delivery offer. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: I approve the WI-001 requirements. | Requirements approved. |
| 2026-09-28 | Owner said: "Remember that the split part of tipcalc is for my Friday dinners with friends: every week we split one restaurant bill between 3 to 8 people." | Saved the usual split use case with WI-001; requirements approval remains the next action. |
| 2026-09-28 | Independent requirements check found no material gaps after Q-04 was answered. | Requirements are ready for owner approval before design or build. |
| 2026-09-28 | Owner said: "Yes, I agree: round Total the same way as Tip." | Q-04 answered; update R-01, R-02, and acceptance, then check the requirements. |
| 2026-09-28 | Requirements check found that Total rounding is undefined for a bill with a fractional cent. | Resolve Q-04 before requirements approval. |
| 2026-09-28 | Owner said: "Yes, I agree with that input rule." | Q-03 answered; update R-01 and R-02, then check the requirements. |
| 2026-09-28 | Owner said: "Yes, round the tip to the nearest cent, with a half cent rounded up, like you said." | Q-02 answered; update R-01 so Total adds the rounded tip, then ask Q-03. |
| 2026-09-28 | Requirements check found that fractional-cent tip rounding and invalid-input behavior remain undefined. | Resolve these questions before requesting requirements approval. |
| 2026-09-28 | Owner said: "Yes, that is the goal. For --split, print a second line like "Each person pays: $20.00". When the total does not divide evenly, round each share up to the next cent so nobody is short." | Goal confirmed; Q-01 answered; update R-02 and check requirements. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | How should the per-person share appear in the output, and how should a share that is not an exact cent be rounded? Answer: Print a second line like `Each person pays: $20.00`; round each share up to the next cent. Owner, 2026-09-28. | R-02 | Answered | owner |
| Q-02 | How should a tip with a fractional cent be rounded, and should Total use that rounded tip? Answer: Round Tip to the nearest cent, with a half cent rounded up; add that rounded tip to the bill for Total. Owner, 2026-09-28. | R-01 | Answered | owner |
| Q-03 | Which bill amounts, tip percentages, and split counts are valid, and what happens for invalid values? Answer: Accept nonnegative bill amounts and tip percentages, require a positive whole-number split count, and reject invalid values with an error. Owner, 2026-09-28. | R-01, R-02 | Answered | owner |
| Q-04 | How should Total be rounded when an accepted bill has a fractional cent, such as 10.005? Answer: Round Total to the nearest cent, with a half cent rounded up, matching Tip. Owner, 2026-09-28. | R-01, R-02 | Answered | owner |
| Q-05 | Create WI-001’s code worktree with the exact git worktree add command in an interactive terminal or a Codex session that can approve Git writes, then tell the agent to continue. Answer: Owner approved the needed Git commands for WI-001, including worktree, branch, and commits, and directed the agent to build P1 without merging. Owner, 2026-09-28. | P1 tracking setup | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

I want the tip command built. When I run node bin/tipcalc.js 50 --percent 20 it should print "Tip: $10.00  Total: $60.00". I also want a --split option that divides the total between friends, like --split 3. Do not build anything until I approve the requirements.

### Agreed goal

Provide a terminal tip command that reports the tip and total for a restaurant bill and, when requested, shows each person’s share of the total.

### Active requirements

#### R-01 — Show tip and total

**Status:** Finalized  
**Applies to:** A person running the tip command with a bill amount and a tip percentage.  
**Required behavior:** Calculate the tip from the bill amount and percentage. Round the tip to the nearest cent, with a half cent rounded up. Add the rounded tip to the bill, then round Total to the nearest cent, with a half cent rounded up. Print the tip and total as dollar amounts with two decimal places on one line, with two spaces between them.  
**Boundaries and exceptions:** Accept nonnegative bill amounts and tip percentages. Reject invalid values with an error.  
**Acceptance check:** Run `node bin/tipcalc.js 50 --percent 20`; the output is exactly `Tip: $10.00  Total: $60.00`. Run `node bin/tipcalc.js 10.05 --percent 10`; the output is exactly `Tip: $1.01  Total: $11.06`. Run `node bin/tipcalc.js 10.005 --percent 0`; the output is exactly `Tip: $0.00  Total: $10.01`. Negative or malformed bill amounts and tip percentages produce an error instead of a tip and total.  
**Decision record:** Owner request, 2026-09-28. Owner clarified tip rounding and use of rounded tip in Total, 2026-09-28. Owner accepted the input rule, 2026-09-28. Owner clarified Total rounding, 2026-09-28. Approved by Mike Rihm on 2026-09-28: “I approve the WI-001 requirements.”  
**Open questions:** None.

#### R-02 — Divide the total between friends

**Status:** Finalized  
**Applies to:** A person who includes `--split` and a split count with the bill amount and tip percentage.  
**Required behavior:** Divide the rounded Total by the split count. Print the tip and total on the first line, then print each share on a second line in the form `Each person pays: $20.00`. Round each share up to the next cent when the division is not exact to a cent.  
**Boundaries and exceptions:** Require a positive whole-number split count; reject invalid values with an error. Each displayed share must cover at least one equal share of the total; the sum of displayed shares may exceed the total by the rounding difference.  
**Acceptance check:** With a $50 bill, 20% tip, and `--split 3`, the second line is `Each person pays: $20.00`. With the same bill and tip and `--split 7`, the second line is `Each person pays: $8.58`. A zero, negative, fractional, or malformed split count produces an error instead of a share.  
**Decision record:** Owner request, 2026-09-28. Owner clarified display and rounding, 2026-09-28. Owner accepted the input rule, 2026-09-28. Owner clarified Total rounding, 2026-09-28. Approved by Mike Rihm on 2026-09-28: “I approve the WI-001 requirements.”  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. With a bill of $50 and a 20% tip, the command prints exactly `Tip: $10.00  Total: $60.00` (R-01).
2. With a bill of $10.05 and a 10% tip, the command rounds the half-cent tip up and prints exactly `Tip: $1.01  Total: $11.06` (R-01).
3. With a bill of $10.005 and a 0% tip, the command rounds Total to the nearest cent, with a half cent rounded up, and prints exactly `Tip: $0.00  Total: $10.01` (R-01).
4. With `--split 3` on the $50 bill, it prints `Each person pays: $20.00` on a second line (R-02).
5. With `--split 7` on the $50 bill, it prints `Each person pays: $8.58` on a second line, rounding the share up to the next cent (R-02).
6. A zero bill and a zero tip percentage are accepted (R-01).
7. A negative or malformed bill amount or tip percentage produces an error rather than a calculated tip and total (R-01).
8. A zero, negative, fractional, or malformed split count produces an error rather than a share (R-02).
9. The owner reviews the tested result.

## Notes

### Decisions and context

- The owner confirmed the goal and settled Q-01 on 2026-09-28.
- The independent requirements check found Q-02 and Q-03 on 2026-09-28.
- The split feature is for the owner’s Friday dinners with friends. They split one restaurant bill each week among 3 to 8 people. Owner, 2026-09-28. This describes the use case; the owner did not ask to change the valid split-count rule.
- Design approach, 2026-09-28: scan the repository and use built-in Node facilities first. One option fits the small command. Independent requirements analyst and design critic review the proposal; the main agent records the design.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- The implementation should calculate money and upward share rounding without a floating point cent error.

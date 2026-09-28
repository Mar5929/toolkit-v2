TFR-001: Build the days-until command
Location: https://app.notion.com/p/Build-the-days-until-command-3e9b381da17681b7b7ccea07b01d5850
Stage: Done | Waiting on: none | Continue with: nothing (finished)
Parent: none | Sub-items: TFR-002 | Design: approved (https://app.notion.com/p/TFR-001-Build-the-days-until-command-with-a-weeks-flag-solution-design-3e9b381da17681859546d90fe3e13254)

---
id: TFR-001
title: Build the days-until command
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
# TFR-001: Build the days-until command

## Overview

**Goal:** A person enters a date and sees the time remaining in days or, with --weeks, in weeks and days.

**Current position:** Done on 2026-09-28. Approved base result on main at 48e56d4 and Done TFR-002 at 9666d71; combined eight node:test checks and direct CLI checks passed; requirements baseline committed at b085699.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** TFR-002 delivered --weeks (R-02 and the weeks-mode part of R-03) and is Done.

## Roadmap

A phase is complete when its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Base days-until command | Accept a valid date, count local calendar days, print signed day wording, and reject invalid default-mode input. | Done | R-01 and the default-mode part of R-03 passed five tests and direct CLI checks; commit 568ff86 reached main through 48e56d4. | None. |
| P2 — Weeks display | Add --weeks in either argument position and keep input errors correct in weeks mode. | Done | R-02 and the weeks-mode part of R-03 passed eight tests and direct CLI checks; Mike Rihm approved the TFR-002 result on 2026-09-28; commit 9666d71 reached main. | TFR-002 |

## Tasks

### P1 — Base days-until command

- [x] **P1-T01 — Add date validation and calendar-day calculation** · Done  
  **Work:** Add the command, strict YYYY-MM-DD validation, local calendar-day calculation, signed day formatting, and default-mode errors (R-01, R-03; approved design Build order step 1).  
  **Deliverable:** bin/days-until.js and base tests.  
  **Done when:** Five node:test checks passed, including fixed dates, daylight saving, invalid-date, and usage cases; direct CLI checks returned 1 day and the expected exit-1 errors.  
  **Depends on:** None.
- [x] **P1-T02 — Commit the base command** · Done  
  **Work:** Review and commit the base command and its tests on the TFR-001 branch.  
  **Deliverable:** Commit 568ff86 on claude/tfr-001-build-the-days-until-command.  
  **Done when:** The full staged diff was reviewed and commit 568ff86 is present on the TFR-001 branch.  
  **Depends on:** P1-T01.

### P2 — Weeks display

TFR-002 owns this phase and its build tasks.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Approved base result on main at 48e56d4 and Done TFR-002 at 9666d71; combined eight node:test checks and direct CLI checks passed; requirements baseline committed at b085699. |
| 2026-09-28 | Delivered behavior recorded in `requirements/days-until/DAYS-UNTIL.md`; roadmap and project command updated at b085699. Both worktrees and branches removed after their merges. TFR-002 is Done. | Ready to mark Done; main contains both approved results and the requirements baseline. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | Stage 13 skipped: this command runs locally; no deployment destination is configured. | Continue to the requirements baseline. |
| 2026-09-28 | No remote: merged locally into main at 48e56d4. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner said: Yes, I authorize both local merges into main in that order. Ship it: then mark both items done and clean up the worktrees and branches. | Q-08 answered: merge TFR-001, then TFR-002 locally into main; finish both items and remove their branches and worktrees. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I ran it in the TFR-001 worktree: 2026-12-25 printed "88 days", yesterday printed "-1 day", and 2026-02-30 gave the invalid date error. I approve the TFR-001 result. | Result approved; work-finish continues. The local merges still need separate authorization. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Sub-item TFR-002 moved here in Notion by hand (it was a top-level item). | TFR-002 is part of this item now. |
| 2026-09-28 | Changed by hand: title from "Build the days-until command with a --weeks flag" to "Build the days-until command". | The title was changed by hand. |
| 2026-09-28 | Checked base R-01 and default-mode R-03 against commit 568ff86; evidence: `tests/TFR-001-TEST-PLAN.md` at 48e56d4, five passing node:test checks, and direct CLI checks; gaps: none in base scope. No independent agent check ran. | Base result is ready for owner review after the separate TFR-002 result review; merge remains unauthorized. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Owner said: "No agent team for this one. Keep it owner-led: you build it and bring me the results. Go ahead and build. I approve the git commands you need for the build (worktree add, add, commit), but no merge yet." | Owner-led build may proceed; commit the base command and weeks work separately, then present results without merging. |
| 2026-09-28 | Set delivery owner-led. Q-07 answered. No longer waiting on the owner. | Owner chose owner-led delivery for TFR-001 and TFR-002, with no agent team. Build and commit are authorized; merge is not authorized. |
| 2026-09-28 | Sub-item TFR-002 moved out in Notion by hand. | TFR-002 is a top-level item now. |
| 2026-09-28 | Design text changed after approval. | The text of the approved design changed. Tell the owner what changed; ask him to approve it again when the change is more than a correction. |
| 2026-09-28 | Design text changed after approval. | The text of the approved design changed. Tell the owner what changed; ask him to approve it again when the change is more than a correction. |
| 2026-09-28 | Sub-item TFR-002 created: Add the --weeks flag to days-until. | TFR-002 delivers R-02, R-03. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Design approved by Mike Rihm. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design updated. | The owner approves it before building starts. |
| 2026-09-28 | Owner said: "I approve Option A, with that default wording ("1 day", "-1 day"). Before you build, split the --weeks part into its own sub-item under TFR-001 so I can review it on its own." | Design approved; create a separate --weeks sub-item before implementation. |
| 2026-09-28 | Design proposed: Option A, one Node.js command with local calendar-day arithmetic; recommended for R-01 through R-03. | Owner review and design approval needed before implementation. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Approved." | Requirements approved; finalize R-01 through R-03 and record the approval. |
| 2026-09-28 | Independent requirements check found no material behavior gap, ambiguity, or misplaced build detail. | Requirements are ready for owner approval; build remains blocked until approval is recorded. |
| 2026-09-28 | Owner said: "Both positions. For the wording: use 1 week and 1 day for one, leave out a part that is 0 (so 3 days or 2 weeks), and for today print 0 days." | Q-05 and Q-06 answered; R-02, R-03, and Acceptance need the final wording before requirements approval. |
| 2026-09-28 | Independent requirements check found that the position of --weeks and wording for 0 or 1 week or day are unspecified. | Q-05 and Q-06 need owner answers before requirements approval. |
| 2026-09-28 | Owner said: "Yes, same for an unknown flag or an extra argument." | Q-04 answered; R-03 and Acceptance can now be completed for requirements approval. |
| 2026-09-28 | Independent requirements check found that the requested command invocation should be explicit in Acceptance and that behavior for unknown flags and extra arguments is undecided. | Acceptance now names the invocation; Q-04 needs the owner answer before requirements approval. |
| 2026-09-28 | Owner said: "Yes, use "ago" for past dates with --weeks. And if the date is missing or not written as YYYY-MM-DD, print a short usage line and exit with code 1." | Q-02 and Q-03 answered; update R-02, R-03, and Acceptance before requirements approval. |
| 2026-09-28 | Independent requirements check found that past-date week output and missing or malformed date behavior need explicit rules. | Q-02 and Q-03 must be answered before requirements approval. |
| 2026-09-28 | Owner said: "Yes to local calendar days: today is 0, tomorrow is 1, and past dates are negative. With --weeks, print it like "2 weeks and 3 days". A date that is not a real date should print a clear error and exit with code 1." | Q-01 answered; update day counting, week formatting, and invalid-date requirements before approval. |
| 2026-09-28 | Drafted requirements for day and week output; Q-01 asks how to count today and past dates. | Owner answer and requirements approval needed before the build. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should the command count local calendar days, with today as 0, tomorrow as 1, and past dates as negative? Answer: yes, confirmed by Mike Rihm on 2026-09-28. | R-01, R-02 | Answered | owner |
| Q-02 | How should --weeks display a past date so the negative value is clear? Answer: use ago, confirmed by Mike Rihm on 2026-09-28. | R-02 | Answered | owner |
| Q-03 | Should a missing date or text outside YYYY-MM-DD also print a clear error and exit with code 1? Answer: print a short usage line and exit with code 1, confirmed by Mike Rihm on 2026-09-28. | R-03 | Answered | owner |
| Q-04 | Should an unknown flag or an extra argument print the short usage line and exit with code 1? Answer: yes, confirmed by Mike Rihm on 2026-09-28. | R-03 | Answered | owner |
| Q-05 | Should --weeks work before the date, after it, or in both positions? Answer: both positions, confirmed by Mike Rihm on 2026-09-28. | R-02, R-03 | Answered | owner |
| Q-06 | With --weeks, should 1 use singular week or day, and what should today print? Answer: use 1 week and 1 day for one; omit a unit with a zero count; print 0 days for today, confirmed by Mike Rihm on 2026-09-28. | R-02 | Answered | owner |
| Q-07 | Would you like agents to take responsibility for delivering this, with you acting as product owner? | delivery | Answered | owner |
| Q-08 | May I merge the approved TFR-001 base branch and TFR-002 --weeks branch locally into main, in that order? Answer: yes, confirmed by Mike Rihm on 2026-09-28. | TFR-001 and TFR-002 delivery | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: build the days-until command. `node bin/days-until.js 2026-12-25` should print how many days are left until that date. Also add a --weeks flag that shows the answer as weeks and days.

### Agreed goal

A person can enter a calendar date in the days-until command and see the remaining time in days, or in weeks and days with --weeks.

### Active requirements

#### R-01 — Count local calendar days

**Status:** Finalized  
**Applies to:** A person who enters a date in the command.  
**Required behavior:** Accept a date written as YYYY-MM-DD and print the number of local calendar days from today to that date. Today is 0, tomorrow is 1, and past dates are negative.  
**Boundaries and exceptions:** Count calendar dates in the local time zone, regardless of the time of day. Invalid dates follow R-03.  
**Acceptance check:** With the local date fixed, dates for today, tomorrow, and yesterday print 0, 1, and -1 respectively.  
**Decision record:** Owner request and Q-01 answer, 2026-09-28. Approved by Mike Rihm on 2026-09-28: "Approved."  
**Open questions:** None.

#### R-02 — Show weeks and days

**Status:** Finalized  
**Applies to:** A person who supplies --weeks before or after a date.  
**Required behavior:** Show the magnitude of the R-01 day count as whole weeks and leftover days. Use singular week or day for a count of 1 and plural weeks or days for other nonzero counts. Omit a unit whose count is 0, so the output can be 3 days, 2 weeks, or 2 weeks and 3 days. Print 0 days for today. For a past date, add ago after the weeks and days.  
**Boundaries and exceptions:** Both argument orders are valid. Today has no ago suffix. Invalid input follows R-03.  
**Acceptance check:** With the local date fixed, --weeks before and after a date 17 days away print 2 weeks and 3 days. A date 17 days in the past prints 2 weeks and 3 days ago. Dates 1, 3, 7, and 14 days away print 1 day, 3 days, 1 week, and 2 weeks respectively. Today prints 0 days.  
**Decision record:** Owner request and formatting answer, 2026-09-28; Q-02, Q-05, and Q-06 answers, 2026-09-28. Approved by Mike Rihm on 2026-09-28: "Approved."  
**Open questions:** None.

#### R-03 — Reject invalid input

**Status:** Finalized  
**Applies to:** A person who enters an impossible date, omits or malforms the date, supplies an unknown flag, or adds an extra argument.  
**Required behavior:** An impossible calendar date prints a clear error and exits with code 1. A missing or malformed date, unknown flag, or extra argument prints a short usage line and exits with code 1.  
**Boundaries and exceptions:** This applies with and without --weeks; --weeks is valid either before or after the date.  
**Acceptance check:** An impossible date such as 2026-02-30 prints an error that identifies the invalid date and exits with code 1 in both modes. A missing date, a date outside YYYY-MM-DD, an unknown flag, and an extra argument each print a short usage line and exit with code 1.  
**Decision record:** Owner answer and Q-03 answer, 2026-09-28; Q-04 and Q-05 answers, 2026-09-28. Approved by Mike Rihm on 2026-09-28: "Approved."  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. Running node bin/days-until.js with a YYYY-MM-DD date prints the local calendar day difference: today is 0, tomorrow is 1, and yesterday is -1 (R-01).
2. With --weeks before or after the date, a date 17 days away prints 2 weeks and 3 days, and a date 17 days in the past prints 2 weeks and 3 days ago (R-02).
3. With --weeks, 1 day and 1 week use singular units; 3 days and 2 weeks omit a zero unit; today prints 0 days (R-02).
4. An impossible date such as 2026-02-30 prints a clear error and exits with code 1, with and without --weeks (R-03).
5. A missing date, a date outside YYYY-MM-DD, an unknown flag, or an extra argument prints a short usage line and exits with code 1 (R-03).
6. The owner approves the tested result.

## Notes

### Decisions and context

- Mike Rihm chose owner-led delivery on 2026-09-28. TFR-001 and TFR-002 were reviewed and approved separately.
- Mike Rihm authorized local merges into main on 2026-09-28, TFR-001 first and TFR-002 second. Both merges and branch cleanup are complete.
- The approved Option A design remains with TFR-001.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

None. The approved Option A design is retained with this item.

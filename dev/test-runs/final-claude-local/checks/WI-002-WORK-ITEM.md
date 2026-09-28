---
id: WI-002
title: Leave out empty words and drop spaces at the ends of each word
type: bug
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: none
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-002: Leave out empty words and drop spaces at the ends of each word

## Overview

**Goal:** Leave out empty words and drop whitespace at the ends of each word, so `node greet.js "" Sam` and `node greet.js " Sam"` print "Hello, Sam!".

**Current position:** Done on 2026-09-28. Merged locally into main at d9f5709; node --test on main 17 pass, 0 fail; node greet.js "" Sam prints Hello, Sam!; docs at d34c02e.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001, merged into main together with this item.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Clean up words before greeting | Empty words are left out and whitespace at word ends is dropped | Done | `node --test`: 17 pass, 0 fail (11 WI-002 checks and the 6 WI-001 tests), commit d9f5709 | None. |

## Tasks

### P1 — Clean up words before greeting

- [x] **P1-T01 — Trim each word and drop empty ones** · Done  
  **Work:** Change `greeting()` in `greet.js` so it trims whitespace from each word, leaves out words that end up empty, and joins the rest with one space (R-01, R-02). Add a test for every R-01 and R-02 acceptance check to `tests/greet.test.js`.  
  **Deliverable:** `greet.js` and `tests/greet.test.js`, committed on branch claude/wi-002-handle-an-empty-word-among (commit d9f5709).  
  **Done when:** `node --test` passes with the new tests and the 6 WI-001 tests, and each R-01 and R-02 check run by hand prints the expected line. Evidence: `node --test` reported 17 pass, 0 fail; by hand, all 9 R-01 and R-02 checks printed the exact expected bytes with one line break.  
  **Depends on:** None.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Merged locally into main at d9f5709; node --test on main 17 pass, 0 fail; node greet.js "" Sam prints Hello, Sam!; docs at d34c02e. |
| 2026-09-28 | Requirements baseline saved: requirements/greeting/GREETING.md and system-guide/greeting.md, commit d34c02e on main (no remote: committed locally). | Done checklist next. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | Requirements and system guide files written and staged in save workspace final-claude-local-r1-docsave-2f932b49. Not committed yet: publish is blocked by folder permissions. | Next: publish the docs save; then stage 14 and finish. |
| 2026-09-28 | Stage 13 Deployment skipped: greet runs from the repository; nothing is deployed beyond main. | Requirements baseline next. |
| 2026-09-28 | No remote: merged locally into main (fast-forward to d9f5709). node --test on main: 17 pass, 0 fail. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: WI-002's result is approved. Ship it; merging locally into main is fine, you have my OK. | Result approved; local merge into main approved; work-finish continues. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked: R-01, R-02, and acceptance items 1 to 3 at commit d9f5709; evidence: node --test 17 pass 0 fail, independent acceptance-checker verdict Met for both, exact output bytes confirmed, WI-001 checks still pass; gaps: tab and line-break cases checked by automated tests only, not typed by hand; acceptance item 4 is the owner run. | Result approval asked next. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Skipped a separate design: one clear way to build. greeting() trims whitespace from each word, drops words left empty, and joins the rest with one space; Hello, world! when none remain. | Planning (stage 06) continues in work-on. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Yes, approved. Build it." | Requirements approved. |
| 2026-09-28 | Set title "Leave out empty words and drop spaces at the ends of each word" (was "Handle an empty word among several names"). | Owner yes to Q-04 item 1 |
| 2026-09-28 | Owner said: "Yes to all six, with any whitespace for number 3." | Q-04 answered: goal and title widened to cover R-02, WI-001 R-01 gets a narrowing note, any whitespace counts as a space, spaces inside a word defined, R-02 checks completed, all-empty check added. Requirements approval next. |
| 2026-09-28 | Spec check returned 6 findings; asked the owner as Q-04. | Continue with work-decide. |
| 2026-09-28 | Owner said: "For Q-03: nothing further." | Requirements interview complete; the spec check runs next, then requirements approval. |
| 2026-09-28 | Owner said: "Yes to Q-02." | R-02 added (Refining); it narrows WI-001 R-01 on spaces inside a quoted name. Acceptance written. Q-03 asked next. |
| 2026-09-28 | Owner said: "Yes to Q-01." Goal confirmed. | Agreed goal and R-01 saved (Refining). Q-02 asked next. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-build-the-greet-command/WI-002-handle-an-empty-word-among-several-names/WORK-ITEM.md -> .work-items/WI-001-build-the-greet-command/WI-002-empty-word-gap/WORK-ITEM.md. | Same item; the toolkit uses the new path. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Confirm the goal: when one of several words after the command is empty or only spaces, it is left out, so `node greet.js "" Sam` prints "Hello, Sam!" with one space. Recommended: yes. | Agreed goal, R-01 | Answered 2026-09-28: yes (owner) | owner |
| Q-02 | A word with spaces at its start or end (for example `node greet.js " Sam"`) also prints two spaces today ("Hello,  Sam!"). Should spaces at the start and end of each word be dropped, while spaces between letters stay as typed? Recommended: yes. | R-02, WI-001 R-01 | Answered 2026-09-28: yes (owner) | owner |
| Q-03 | What have we not touched that could change this item? Recommended: nothing further; the spec check comes next. | All | Answered 2026-09-28: nothing further (owner) | owner |
| Q-04 | Spec check found 6 items (goal wording to include R-02; note in WI-001 R-01; what counts as a space; spaces inside a word; R-02 checks missing line break and exit; no check for several empty words). Answer each by number. Recommended: yes to all, with any whitespace counting as a space. | Agreed goal, R-01, R-02, WI-001 R-01 | Answered 2026-09-28: yes to all six, any whitespace for number 3 (owner) | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Split out from WI-001 before result approval, at the owner's request. The checker found that node greet.js "" Sam prints two spaces (Hello,  Sam!). The WI-001 requirements do not cover an empty word among several words.

### Agreed goal

When one of several words after the greet command is empty or only whitespace, it is left out of the greeting. Whitespace at the start and end of every word is dropped. So `node greet.js "" Sam` and `node greet.js " Sam"` both print "Hello, Sam!" with one space.

### Active requirements

#### R-01 — Leave out empty words among several names

**Status:** Finalized  
**Applies to:** Anyone who runs the greet command with several words after it, when at least one of those words is empty or only whitespace and at least one is not.  
**Required behavior:** Each word that is empty or only whitespace is left out. Whitespace means any whitespace character: spaces, tabs, and line breaks. The remaining words are joined in order with one space between each pair, as WI-001 R-01 requires. Examples: `node greet.js "" Sam` prints "Hello, Sam!"; `node greet.js Sam "" Lee` prints "Hello, Sam Lee!"; `node greet.js "   " Sam` prints "Hello, Sam!".  
**Boundaries and exceptions:** When every word is empty or only whitespace, the command prints "Hello, world!" (WI-001 R-02).  
**Acceptance check:** Run `node greet.js "" Sam`, `node greet.js Sam ""`, and `node greet.js "   " Sam`; each prints exactly "Hello, Sam!" followed by one line break, and exits with success. Run `node greet.js Sam "" Lee`; it prints exactly "Hello, Sam Lee!" followed by one line break, and exits with success. Run `node greet.js "" "   "`; it prints exactly "Hello, world!" followed by one line break, and exits with success.  
**Decision record:** Owner, 2026-09-28: answer to Q-01 (goal confirmed). Owner, 2026-09-28: answer to Q-04 (any whitespace counts; all-empty check added). Earlier wording: "empty or only spaces". Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-02 — Drop whitespace at the start and end of each word

**Status:** Finalized  
**Applies to:** Anyone who runs the greet command with a word that has whitespace at its start or end.  
**Required behavior:** Whitespace (spaces, tabs, and line breaks) at the start and end of each word is dropped before the words are joined. Spaces inside a word, between its first and last non-whitespace characters, are printed as typed. Examples: `node greet.js " Sam"` prints "Hello, Sam!"; `node greet.js "Sam " Lee` prints "Hello, Sam Lee!"; `node greet.js "Sam  Lee"` prints "Hello, Sam  Lee!" with the two spaces as typed.  
**Boundaries and exceptions:** This narrows WI-001 R-01, which says spaces inside a single quoted name are printed as typed: after this item, that holds only for spaces between the word's first and last non-whitespace characters.  
**Acceptance check:** Run `node greet.js " Sam"` and `node greet.js "Sam "`; each prints exactly "Hello, Sam!" followed by one line break, and exits with success. Run `node greet.js "Sam " Lee`; it prints exactly "Hello, Sam Lee!" followed by one line break, and exits with success. Run `node greet.js "Sam  Lee"`; it prints exactly "Hello, Sam  Lee!" with two spaces, followed by one line break, and exits with success.  
**Decision record:** Owner, 2026-09-28: answer to Q-02. Owner, 2026-09-28: answer to Q-04 (any whitespace counts; spaces inside a word defined; checks completed). Earlier wording: "Spaces between letters inside one word are printed as typed." Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. An empty or whitespace-only word among other words is left out of the greeting (R-01).
2. Whitespace at the start and end of each word is dropped, and spaces inside a word stay as typed (R-02).
3. Every acceptance check in R-01 and R-02 prints the exact line with one line break and exits with success, and the WI-001 R-01 and R-02 checks still pass.
4. The owner has run the command and approved the result.

## Notes

### Decisions and context

- <Useful decision or context that is not itself a requirement.>

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

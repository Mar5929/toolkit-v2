---
id: WI-001
title: Build the greet command
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: none
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-001: Build the greet command

## Overview

**Goal:** A small command that greets the name given to it, or prints "Hello, world!" when no name is given.

**Current position:** Done on 2026-09-28. Merged locally into main with WI-002 (d9f5709 contains 10140e6); node --test on main 17 pass, 0 fail; docs at d34c02e.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 (sub-item, Done): leaves out empty words and drops whitespace at the ends of each word; merged into main together with this item.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Greet command | `node greet.js` greets a name or the world | Done | 6 automated acceptance tests pass, and each check run by hand printed the expected line | WI-002 (follow-up: an empty word among several names prints two spaces; not covered by this item's requirements). |

## Tasks

### P1 — Greet command

- [x] **P1-T01 — Write greet.js and its tests** · Done  
  **Work:** Add `greet.js` at the project root and an automated test that runs it for every R-01 and R-02 acceptance check (R-01, R-02).  
  **Deliverable:** `greet.js` and `tests/greet.test.js`, committed on the item branch (commit 10140e6).  
  **Done when:** `node --test` passes and each acceptance check run by hand prints the expected line. Evidence: `node --test` reported 6 pass, 0 fail; by hand, Sam, Sam Lee, no name, empty, and spaces-only printed the expected lines.  
  **Depends on:** None.
- [x] **P1-T02 — Record the test command** · Done  
  **Work:** Fill the "Build, test, or deploy" row under Commands in `AGENTS.md` with the verified run and test commands.  
  **Deliverable:** The updated `AGENTS.md` rows, committed on the item branch (commit 10140e6).  
  **Done when:** The row names commands that were run and passed in P1-T01. Evidence: `node greet.js` and `node --test` both run in P1-T01.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Merged locally into main with WI-002 (d9f5709 contains 10140e6); node --test on main 17 pass, 0 fail; docs at d34c02e. |
| 2026-09-28 | Requirements baseline saved: requirements/greeting/GREETING.md and system-guide/greeting.md, commit d34c02e on main (no remote: committed locally). | Done checklist next. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | Requirements and system guide files written and staged in save workspace final-claude-local-r1-docsave-2f932b49 (requirements/greeting/GREETING.md, system-guide/greeting.md). Not committed: the publish step must run from that folder, which is outside this session's allowed folders. | Next: owner runs publish (or allows the folder); then stage 14, finish WI-002, then WI-001. |
| 2026-09-28 | Stage 13 Deployment skipped: greet runs from the repository; nothing is deployed beyond main. | Requirements baseline next. |
| 2026-09-28 | No remote: merged locally into main with WI-002 (fast-forward to d9f5709, which contains 10140e6). Owner OK for the merge on 2026-09-28. node --test on main: 17 pass, 0 fail. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Added a pointer to WI-002 R-02 in R-01 Boundaries (owner yes to WI-002 Q-04, 2026-09-28). | Reference only. The WI-001 behavior and its approvals are unchanged; WI-002 carries the change. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: "Yes, WI-001's result is approved, but keep WI-001 open until WI-002 is done." | Result approved. WI-001 stays open until WI-002 is done; work-finish runs after that. |
| 2026-09-28 | Owner asked to split the checker gap (node greet.js "" Sam prints two spaces) into its own sub-item before approving: now WI-002. | WI-001 stays at 11 User approval. WI-002 must be finished, cancelled, or moved before WI-001 can close. |
| 2026-09-28 | Sub-item WI-002 created: Handle an empty word among several names. | WI-002 is part of this item. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked: R-01 and R-02 and acceptance items 1 to 3 at commit 10140e6; evidence: node --test 6 pass 0 fail, independent acceptance-checker verdict Met for both, exact output bytes confirmed; gaps: node greet.js "" Sam prints two spaces (Hello,  Sam!), a case the requirements do not cover; acceptance item 4 is the owner run. | Result approval asked next. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Skipped a separate design: one clear way to build. greet.js reads the words after the command, joins them with one space, and prints Hello, <name>! or Hello, world! when the name is missing or blank. Tested with the Node built-in test runner. | Planning (stage 06) continues in work-on. |
| 2026-09-28 | Set delivery owner-led. | Small item: one or two tasks, so no delivery offer. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Yes, the requirements are approved." | Requirements approved. |
| 2026-09-28 | Owner said: "Yes. For the other two, go with your recommendations." Accepted all three spec check fixes. | R-01, R-02, and Acceptance updated; requirements approval asked next. |
| 2026-09-28 | Owner said: "Yes, full name." Confirmed the goal and answered Q-01. | Agreed goal saved; R-01 greets the full name. Spec check next, then requirements approval. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | When someone types more than one word after the command (for example `node greet.js Sam Lee`), should it greet the full name ("Hello, Sam Lee!") or only the first word? Recommended: the full name. | R-01 | Answered 2026-09-28: the full name (owner) | owner |
| Q-02 | Spec check: if someone runs the command with an empty or blank name (for example `node greet.js ""`), should it print "Hello, world!"? Recommended: yes, treat it as no name. | R-02 | Answered 2026-09-28: yes (owner) | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: build the greet command. `node greet.js Sam` should print "Hello, Sam!", and with no name it prints "Hello, world!". Track it as a work item and do it properly.

### Agreed goal

A small command that greets the name given to it, or prints "Hello, world!" when no name is given.

### Active requirements

#### R-01 — Greet the person named

**Status:** Finalized  
**Applies to:** Anyone who runs the greet command with a name after it.  
**Required behavior:** The command prints "Hello, <name>!" using the name given. When several words are given after the command, they are joined in order with one space between each pair. Spaces inside a single quoted name are printed as typed. Examples: `node greet.js Sam` prints "Hello, Sam!"; `node greet.js Sam Lee` prints "Hello, Sam Lee!".  
**Boundaries and exceptions:** A name that is empty or only spaces counts as no name (R-02). Narrowed by WI-002 R-02: whitespace at the start and end of each word is dropped.  
**Acceptance check:** Run `node greet.js Sam`; it prints exactly "Hello, Sam!" followed by one line break, and exits with success. Run `node greet.js Sam Lee`; it prints exactly "Hello, Sam Lee!" followed by one line break, and exits with success.  
**Decision record:** Owner, 2026-09-28, starting request. Several words use the full name: owner answer to Q-01, 2026-09-28. Joining and spacing wording: spec check fix accepted by the owner, 2026-09-28. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-02 — Greet the world when no name is given

**Status:** Finalized  
**Applies to:** Anyone who runs the greet command with nothing after it, or with a name that is empty or only spaces.  
**Required behavior:** The command prints "Hello, world!".  
**Boundaries and exceptions:** None identified.  
**Acceptance check:** Run `node greet.js`; it prints exactly "Hello, world!" followed by one line break, and exits with success. Run `node greet.js ""` and `node greet.js "   "`; each prints the same.  
**Decision record:** Owner, 2026-09-28, starting request. Empty or blank name counts as no name: owner answer to Q-02, 2026-09-28. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. `node greet.js Sam` prints "Hello, Sam!" and `node greet.js Sam Lee` prints "Hello, Sam Lee!" (R-01).
2. `node greet.js`, `node greet.js ""`, and `node greet.js "   "` each print "Hello, world!" (R-02).
3. Each output is the greeting followed by one line break, and the command exits with success.
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

---
id: WI-001
title: Add a --shout flag to the greet CLI
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-27 by Mike"
design: approved
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-001: Add a --shout flag to the greet CLI

## Overview

**Goal:** Add a --shout flag that prints the greeting in capital letters, with README documentation delivered by WI-002.

**Current position:** Built and checked on claude/wi-001-shout at f794cc6. R-01 and R-02 meet their acceptance checks; npm test passed 5 tests. WI-002 received its separate check.

**Next action:** None. Finished.

**Blockers:** Local merge to main needs Mike's approval. The repository has no remote, so a pull request is unavailable.

**Related items:** Child WI-002 (R-02).

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Implement --shout | The CLI meets R-01 with exact-output tests. | Done | Required CLI invocations and npm test pass (5 tests, commit b96f56b). | None |
| P2 — Document --shout | The README meets R-02. | Done | WI-002 is built and checked (commit f794cc6); Mike approved its result on 2026-09-27. | WI-002 |

## Tasks

### P1 — Implement --shout

- [x] **P1-T01 — Parse and print --shout** · Done  
  **Work:** Detect --shout before or after the name, then uppercase the complete greeting (R-01, approved design Technical sequence step 1).  
  **Deliverable:** Updated bin/greet.mjs.  
  **Done when:** The three shout invocations print the required exact output.  
  **Depends on:** None.  
  **Evidence:** Exact-output CLI tests passed with npm test; commit b96f56b.
- [x] **P1-T02 — Test CLI output** · Done  
  **Work:** Add exact-output CLI tests for both flag positions, flag alone, and calls without the flag (R-01, approved design Technical sequence step 2).  
  **Deliverable:** Updated test/greet.test.mjs.  
  **Done when:** npm test passes and covers every R-01 acceptance invocation.  
  **Depends on:** P1-T01.  
  **Evidence:** npm test passed all 5 tests; commit b96f56b.

### P2 — Document --shout

WI-002 owns the README task and its separate check (R-02).

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: npm test passed 5 tests on local main, covering both flag positions, default shout, and unchanged normal output; commits b96f56b, f794cc6, and 5c6adf9 reached main; WI-002 is Done. |
| 2026-09-27 | Delivered requirements/greeting/AREA.md and system-guide/greeting.md to local main at 5c6adf9. | Delivered behavior and verified structure are recorded; no remote publication was possible. |
| 2026-09-27 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | No remote: merged locally into main. | No pull request; no deployment. |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Owner's words: Ship both and merge to main. There is no remote, so merge locally. I approve the merge and the git commands you need, and you can close both items out when they are done. | Local merge to main and closing both items are approved. |
| 2026-09-27 | Owner's words: Good. I approve both results, the CLI and the README. | Continue with work-finish. Now waiting on the agent. |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked R-01 and R-02 on claude/wi-001-shout at f794cc6: npm test passed 5 tests, covering both flag positions, default shout, and unchanged normal output; README examples produced their documented output; git diff --check passed; no known gaps. No independent checker ran because Mike requested no helper agents. | Built result is ready for Mike's review; WI-002 has its own result approval. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-27 | Owner's words: No, work with me directly. It's a small change, so no helper agents. Keep going with the build. I approve the git commands you need for it (worktree, add, commit). | Owner-led delivery; the main agent builds directly without helpers. Git worktree, add, and commit are authorized for this change. Now waiting on the agent. |
| 2026-09-27 | Set delivery owner-led. | Continue with work-decide. |
| 2026-09-27 | Design updated (status approved). | The design can be built. Now waiting on the owner. |
| 2026-09-27 | Sub-item WI-002 created: Document --shout in the README. | WI-002 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-27 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-27 | Owner's words: Go with option A. And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own. | Option A approved; create a separate README child for R-02. |
| 2026-09-27 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-27 | Design proposed: parse --shout in the existing CLI, capitalize the full greeting, add CLI tests, and document the flag; Option A recommended. | Waiting for Mike's design decision. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. Now waiting on the owner. |
| 2026-09-27 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-27 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-27 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. Now waiting on the agent. |
| 2026-09-27 | Owner's words: Approved. | Requirements approved. |
| 2026-09-27 | Owner's words: Yes, go with your recommendation: the whole greeting in capitals, like HELLO, MIKE!, and the flag works before or after the name. Also, remember that I prefer every command-line flag to be documented in the README. | Q-01 answered; requirements can specify capitalization, flag position, and README documentation. |
| 2026-09-27 | Owner requested a --shout flag that prints the greeting in capital letters and asked to pin down requirements. | Created the build item and opened Q-01 about which greetings the flag affects. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. Now waiting on the owner. |
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should --shout uppercase the entire greeting for both a supplied name and the default world greeting, while calls without the flag stay unchanged? | R-01 | Answered: yes, including flag before or after the name (Mike, 2026-09-27) | owner |
| Q-02 | Would you like agents to take responsibility for delivering this, with you acting as product owner? | delivery | Answered: no helper agents; work directly with Mike (2026-09-27) | owner |

## Requirements

<!-- Starting request records what was asked; Agreed goal records the outcome the owner accepted. Under Active requirements, create one R-ID subsection per explicit behavior. Fill every labeled field under each R-ID. Keep an item Refining until its required behavior and acceptance check are clear and owner approval is recorded; mark Superseded only with a replacement link. Put solution ideas in the final Notes subsection, not here. -->

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: Add a --shout flag to the greet CLI. It should print the greeting in capital letters. Track it as a work item and ask me what you need to pin down the requirements.

### Agreed goal

Add a --shout flag to the greet CLI that prints the entire greeting in capital letters for a supplied name or the default world greeting, with the flag before or after the name; document the flag in the README.

### Active requirements

#### R-01 — Shout greeting

**Status:** Finalized  
**Applies to:** The greet CLI when --shout is present.  
**Required behavior:** Print the entire greeting in capital letters. With Mike, print HELLO, MIKE!; with no name, print HELLO, WORLD!. Accept --shout before or after the name.  
**Boundaries and exceptions:** Without --shout, retain the existing greeting behavior for a supplied name and for the default world greeting.  
**Acceptance check:** Running the CLI with --shout Mike and Mike --shout prints HELLO, MIKE!; running it with --shout alone prints HELLO, WORLD!; calls without the flag still print Hello, Mike! or Hello, world!.  
**Decision record:** Mike answered Q-01 and specified flag placement in chat on 2026-09-27. Mike approved these requirements on 2026-09-27.  
**Open questions:** None.

#### R-02 — Flag documentation

**Status:** Finalized  
**Applies to:** The README for the greet CLI.  
**Required behavior:** Document --shout and show how to use it.  
**Boundaries and exceptions:** None identified.  
**Acceptance check:** The README names --shout and shows an invocation with its output.  
**Decision record:** Mike stated in chat on 2026-09-27 that he prefers every command-line flag documented in the README. Mike approved these requirements on 2026-09-27.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. --shout capitalizes the entire greeting for a supplied name and for the default world greeting, with the flag before or after the name.
2. Calls without --shout retain their current output, and automated CLI checks cover these cases.
3. The README documents --shout with an example, and Mike reviews the finished result.

## Notes

### Decisions and context

- Existing behavior: a supplied name prints Hello, <name>!; no name prints Hello, world! The CLI currently reads the first argument as the name.
- Mike chose Option A on 2026-09-27: parse --shout in the existing CLI, uppercase the full greeting, and add CLI tests.
- Mike requested that README documentation be built and checked separately as WI-002.

### Resume here

Finished on 2026-09-27. Nothing to resume.

### Solution options and considerations

None recorded.

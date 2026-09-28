---
id: WI-001
title: Add --shout flag to greet CLI
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike"
design: approved
result_approved: "2026-09-28 by Mike"
updated: 2026-09-28
---

# WI-001: Add --shout flag to greet CLI

## Overview

**Goal:** Add --shout to the greet CLI so it prints the whole greeting in uppercase letters.

**Current position:** Done on 2026-09-28. Shout CLI and README changes are on local main in commit d961e1e; npm test passed 5 of 5; node bin/greet.mjs --shout Mike printed HELLO, MIKE!; requirements and system guide are in commit 8fc70ea.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 delivered and checked the README documentation for R-02.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — CLI behavior | --shout prints uppercase named and default greetings in either flag position | Done | R-01 checks and npm test pass | None. |
| P2 — README documentation | Readers can use --shout from the README example | Done | WI-002 builds and checks R-02 independently | WI-002 |

## Tasks

### P1 — CLI behavior

- [x] **P1-T01 — Implement --shout** · Done  
  **Work:** Parse the flag before or after a name and uppercase the completed greeting.  
  **Deliverable:** bin/greet.mjs change.  
  **Done when:** Named and default shout commands print the exact R-01 outputs and normal output remains unchanged.  
  **Depends on:** Approved Option A design.
- [x] **P1-T02 — Test CLI behavior** · Done  
  **Work:** Add CLI checks for flag positions, default shout, and unchanged normal greetings.  
  **Deliverable:** test/greet.test.mjs change.  
  **Done when:** npm test passes and the required CLI commands print the expected output.  
  **Depends on:** P1-T01.

### P2 — README documentation

- [x] **P2-T01 — Complete WI-002 build and check** · Done  
  **Work:** Build and check README documentation under WI-002.  
  **Deliverable:** WI-002 result and its separate check.  
  **Done when:** WI-002 has passed its R-02 check; Mike reviews its result at the separate approval gate.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike); marked Done by Mike. | Evidence: Shout CLI and README changes are on local main in commit d961e1e; npm test passed 5 of 5; node bin/greet.mjs --shout Mike printed HELLO, MIKE!; requirements and system guide are in commit 8fc70ea. |
| 2026-09-28 | Delivered requirements and system guide saved on local main in commit 8fc70ea. | Specification baseline complete; finish WI-001 after WI-002 closes. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner said: "Yes, merge it locally into main; there is no remote. I approve the merge and the git commands you need, and you can close both items out when they are done." | Local merge of the combined branch approved; work-finish continues for WI-001 and WI-002. |
| 2026-09-28 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I approve the WI-001 CLI result and I approve the WI-002 README result. And yes to that memory proposal about working directly on small changes: keep it. | WI-001 CLI result approved; work-finish continues. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-01 on commit 819bda7 and the combined WI-002 branch d961e1e: npm test passed 5 of 5; --shout Mike, Mike --shout, and --shout printed the approved uppercase outputs; normal CLI output stayed unchanged. R-02 was checked separately under WI-002. No independent agent check ran because Mike requested no helpers. Gaps: none found. | CLI result ready for Mike’s separate approval. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Owner said: “No, work with me directly. It’s a small change, so no helper agents. Keep going with the build of both items. I approve the git commands you need for it (worktree, add, commit).” | Direct build of WI-001 and WI-002 without helper agents; Git worktree, add, and commit authorized. |
| 2026-09-28 | Set delivery owner-led. Q-02 answered. No longer waiting on the owner. | Continue with work-organize. |
| 2026-09-28 | Design text changed after approval. | The text of the approved design changed. Tell the owner what changed; ask him to approve it again when the change is more than a correction. |
| 2026-09-28 | Sub-item WI-002 created: Document --shout in README. | WI-002 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design updated. | The owner approves it before building starts. |
| 2026-09-28 | Owner said: "Go with option A. And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own." | Option A selected; README documentation will become a separate sub-item covering R-02. |
| 2026-09-28 | Design proposed: Option A extends the current Node.js CLI to support --shout and documents the flag in README.md; independent critique found no remaining gap. | Mike reviews and approves or changes the proposed design before build planning. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Approved." | Requirements approved. |
| 2026-09-28 | Owner said: "Yes, go with your recommendation: the whole greeting in capitals, like HELLO, MIKE!, and the flag works before or after the name. Also, remember that I prefer every command-line flag to be documented in the README." | Q-01 answered; R-01 must cover named and default greetings and flag position; add README documentation requirement. |
| 2026-09-28 | Owner requested --shout to print the greeting in capital letters and asked to clarify requirements. | R-01 is refining; Mike needs to answer Q-01 about named and default greetings. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should --shout uppercase the whole greeting for both a supplied name and the default greeting? | R-01 | Answered 2026-09-28: Yes, the whole greeting in capitals for both. | owner |
| Q-02 | Would you like agents to take responsibility for delivering this, with you acting as product owner? | delivery | Answered | owner |
| Q-03 | May I merge the approved WI-001 and WI-002 changes from claude/wi-002-document-shout-in-readme into local main? | merge | Answered 2026-09-28: Mike approved the local merge into main. | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: add a --shout flag to the greet CLI. It should print the greeting in capital letters. Track it as a work item and ask me what you need to pin down the requirements.

### Agreed goal

Add --shout to the greet CLI so it prints the whole greeting in capital letters for named and default greetings, accepts the flag before or after the name, and is documented in the README.

### Active requirements

#### R-01 — Shout greeting

**Status:** Finalized  
**Applies to:** Someone using the greet CLI with --shout, with a supplied name or with the default greeting.  
**Required behavior:** The CLI prints the whole greeting in uppercase letters when --shout is present. The flag works before or after a supplied name.  
**Boundaries and exceptions:** With no supplied name, the default greeting is also uppercase.  
**Acceptance check:** Run the CLI with --shout before a name, after a name, and without a name. Each output is the entire greeting in capitals, including HELLO, MIKE! for Mike.  
**Decision record:** Mike requested uppercase output on 2026-09-28, clarified named and default greetings and flag position on 2026-09-28, and approved this requirement on 2026-09-28.  
**Open questions:** None.

#### R-02 — Document the flag

**Status:** Finalized  
**Applies to:** Someone reading the CLI documentation.  
**Required behavior:** The README documents --shout as a command-line flag, including what it does and how to use it.  
**Boundaries and exceptions:** This follows Mike’s preference that every command-line flag be documented in the README.  
**Acceptance check:** The README describes --shout and shows a usable command.  
**Decision record:** Mike stated the standing documentation preference on 2026-09-28 and approved this requirement on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. --shout prints the whole greeting in uppercase for both a supplied name and the default greeting (R-01).
2. --shout works before or after a supplied name (R-01).
3. The README documents --shout and shows how to use it (R-02).
4. Mike reviews the tested result.

## Notes

### Decisions and context

- Mike approved Option A on 2026-09-28.
- Mike asked for README documentation to be built and checked separately. WI-002 covers R-02; WI-001 keeps both approved requirements.
- Mike chose direct work on 2026-09-28: “No, work with me directly. It’s a small change, so no helper agents. Keep going with the build of both items.” Delivery is owner-led, with this agent doing the build directly and no helpers. He approved Git commands needed for the worktree, add, and commit. Result approval and merge remain separate decisions.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

- The approved Option A design uses the current Node.js CLI, an exact --shout argument scan, and uppercase conversion of the completed greeting.

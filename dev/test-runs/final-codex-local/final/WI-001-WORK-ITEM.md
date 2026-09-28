---
id: WI-001
title: Build slug command with max option
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

# WI-001: Build slug command with max option

## Overview

**Goal:** Turn typed blog titles into URL-friendly slugs, with an optional maximum length.

**Current position:** Done on 2026-09-28. WI-002 and WI-003 are Done on local main; seven CLI checks passed; requirements and system guide committed as 0d3a6d9.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 delivered R-01. WI-003 delivered R-02.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
| --- | --- | --- | --- | --- |
| P1 — Basic slug | Convert a title to a slug | Done | WI-002 R-01 checks passed; Mike approved the result; commit d6f9221 reached local main | WI-002 |
| P2 — Maximum length | Limit the slug with `--max` | Done | WI-003 R-02 and R-01 checks passed; Mike approved the result; commit 4d20885 reached local main | WI-003 |

## Tasks

### P1 — Basic slug

WI-002 owns the implementation and checks for R-01.

### P2 — Maximum length

WI-003 owns the implementation and checks for R-02 after WI-002 delivers the command.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved by Mike Rihm: "Ship it: WI-002 and WI-003. There is no remote, so merge them into main here, then finish WI-002, WI-003, and WI-001 and clean up the branches and worktrees. I approve the Git commands for that." | Evidence: WI-002 and WI-003 are Done on local main; seven CLI checks passed; requirements and system guide committed as 0d3a6d9. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: WI-002 and WI-003 merged locally into main as d6f9221 and 4d20885. | No pull request or deployment; delivered documentation committed as 0d3a6d9. |
| 2026-09-28 | Set stage 05 Breakdown -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Implementation and checks were completed in WI-002 and WI-003; both approved sub-items are Done. | Parent can proceed directly from breakdown to local delivery and specification update. |
| 2026-09-28 | Owner said: Ship it: WI-002 and WI-003. There is no remote, so merge them into main here, then finish WI-002, WI-003, and WI-001 and clean up the branches and worktrees. I approve the Git commands for that. | Approved finishing WI-001 after its two delivered sub-items; local merges and cleanup authorized. |
| 2026-09-28 | Moved by hand: .work-items/WI-001-build-slug-command-with-max-option/WORK-ITEM.md -> .work-items/slug-cli/WI-001-slug/WORK-ITEM.md. | It is still a top-level item. Group: slug-cli. |
| 2026-09-28 | Sub-item WI-003 created: Add max length option to slug command. | WI-003 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Sub-item WI-002 created: Build basic slug command. | WI-002 delivers R-01. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Design approved by Mike Rihm. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design updated. | The owner approves it before building starts. |
| 2026-09-28 | Owner said: I approve Option A. Before you build, split the --max option out into its own sub-item under WI-001, so the basic slug and the --max limit are tracked separately. | Select Option A and split implementation into basic slug and max sub-items before building. |
| 2026-09-28 | Proposed two slug command designs; recommended the single-file command. | Waiting for Mike to choose and approve the design before build planning. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Set delivery owner-led. | Small item: one or two tasks, so no delivery offer. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Approved." | Requirements approved. |
| 2026-09-28 | Owner said: "Yes, an invalid --max value should print an error and exit with code 1." | Q-02 answered; R-02 and acceptance checks updated before requirements approval. |
| 2026-09-28 | Owner said: "Yes, that is the --max behavior I want. Two more things: accented letters like é should become a plain e, and if the title has no letters or numbers at all, the command should print an error and exit with code 1." | R-01 and R-02 need updated acceptance checks; requirements remain in refinement. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should --max count characters including hyphens, cut at the limit, and remove any trailing hyphen? Answer: Yes. Mike confirmed on 2026-09-28 that hyphens count, the slug is cut at the limit, and a trailing hyphen is removed. | R-02 | Answered | owner |
| Q-02 | What should the command do when --max is missing a value, zero, negative, or not a whole number? Answer: Print an error and exit with code 1 for an invalid --max value. Mike confirmed on 2026-09-28. | R-02 | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

I want the slug command built. When I run node bin/slug.js "Hello World!" it should print hello-world. I also want a --max option that keeps the slug short, for example --max 20.

### Agreed goal

Mike can turn a typed blog title into a URL-friendly slug with a Node.js command and optionally limit its length.

### Active requirements

#### R-01 — Turn a title into a slug

**Status:** Finalized  
**Applies to:** Mike, when he enters a title in the command.  
**Required behavior:** The command prints a lowercase, URL-friendly slug made from the title. Spaces between words become hyphens; punctuation such as a trailing exclamation mark is removed. Accented letters such as é become their plain-letter equivalents, such as e.  
**Boundaries and exceptions:** If the title has no letters or numbers at all, the command prints an error and exits with code 1.  
**Acceptance check:** Enter Hello World! as the title; the command prints hello-world followed by a newline. Enter Café; it prints cafe followed by a newline. Enter a title containing only punctuation; it prints an error and exits with code 1.  
**Decision record:** Mike requested title conversion on 2026-09-28 and added accent conversion and the empty-content error on 2026-09-28. Mike approved this requirement on 2026-09-28.  
**Open questions:** None.

#### R-02 — Limit slug length

**Status:** Finalized  
**Applies to:** Mike, when he supplies the --max option.  
**Required behavior:** The command limits the printed slug to the requested maximum number of characters. Hyphens count toward the limit. If the slug exceeds the limit, the command cuts it at that character and removes a trailing hyphen from the result.  
**Boundaries and exceptions:** If --max has no value, is zero or negative, or is not a whole number, the command prints an error and exits with code 1.  
**Acceptance check:** Supply --max 5 with Hello World; the command prints hello. Supply --max 6 with Hello World; it still prints hello after removing the trailing hyphen. Supply --max without a value, with zero, with a negative number, and with a non-whole number; each prints an error and exits with code 1.  
**Decision record:** Mike requested --max on 2026-09-28, confirmed the character-count and trailing-hyphen rules on 2026-09-28, and confirmed the invalid-value error on 2026-09-28. Mike approved this requirement on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. The command turns Hello World! into hello-world and Café into cafe (R-01).
2. A title with no letters or numbers prints an error and exits with code 1 (R-01).
3. The --max option counts hyphens, cuts the slug at the limit, and removes a trailing hyphen (R-02).
4. A missing, zero, negative, or non-whole-number --max value prints an error and exits with code 1 (R-02).
5. Mike reviews the result.

## Notes

### Decisions and context

- Mike approved Option A on 2026-09-28. The command uses one source file, `bin/slug.js`, with built-in Node.js tests.
- Mike directed the split before building. WI-002 covers R-01; WI-003 covers R-02. Both inherit the approved requirements and design.
- Delivery is owner-led.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

Option A was approved. See the WI-001 design for the selected approach.

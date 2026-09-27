---
id: WI-002
title: Document --shout in README
type: task
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: 2026-09-27 by Mike
design: none
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-002: Document --shout in README

## Overview

**Goal:** Document `--shout` in `README.md` with usage and output examples, covering WI-001 R-02.

**Current position:** README, CLI, tests, requirements, and system guide are committed on local `main` at `3c6be95`. Mike approved the README result. Its three examples matched the CLI, and `npm test` passed six tests on 2026-09-27.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001 (R-02 and approved Option A design).

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — README documentation | Readers can see how to use `--shout` and what it prints. | Complete | README includes usage and output examples matching WI-001 R-02. | None |
| P2 — Documentation check | The README result is reviewed separately from the CLI code. | Complete | README passed R-02 on the combined branch at `dfabaf3`; ready for Mike's review. | None |

## Tasks

### P1 — README documentation

- [x] **P1-T01 — Document the flag** · Done  
  **Work:** Add `--shout` usage and output examples to `README.md`.  
  **Deliverable:** Updated README in commit `02a907a`.  
  **Done when:** The README explains `--shout` and shows the uppercase greeting it prints.  
  **Depends on:** None.

### P2 — Documentation check

- [x] **P2-T01 — Check the README** · Done  
  **Work:** Read the README against WI-001 R-02 and compare its examples with the implemented command.  
  **Deliverable:** Test plan at `dfabaf3` and independent check of the combined branch.  
  **Done when:** All three usage and output examples matched the CLI; `npm test` passed 6 tests, and the result is ready for Mike's separate review.  
  **Depends on:** P1-T01 and the WI-001 CLI implementation.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: README examples matched the CLI; npm test passed 6 tests; delivered on local main at 3c6be95; Mike approved the result and local merge on 2026-09-27. |
| 2026-09-27 | Owner's words: Ship both. There is no remote, so merge them into main locally. I approve the merge and the git commands you need, and you can close both items out when they are done. README reached local main at dfabaf3; the requirements and system guide reached main at 3c6be95. |  |
| 2026-09-27 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Set waiting on agent. | Continue with work-finish. |
| 2026-09-27 | Owner's words: Yes, I approve the README result. Also, WI-002's WORK-ITEM.md still has that long fill-in guide comment at the top. Please just delete it from the file. |  |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked R-02 at dfabaf3: three README examples matched the CLI in the combined branch; npm test passed 6 tests; independent checker found no remaining defects. README result awaits separate owner approval. No Git remote is configured. |  |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Set stage 06 Implementation plan -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set waiting on agent. | Continue with work-on. |
| 2026-09-27 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-27 | Mike requested a separate README sub-item. WI-002 covers WI-001 R-02 and uses the parent Option A design approved on 2026-09-27; it needs its own build, check, and result approval. |  |
| 2026-09-27 | Created as a sub-item of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from WI-001 (2026-09-27 by Mike); the owner is not asked again. Starts at 03 Requirements approved. Continue with solution-design. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| — | None. | — | — | — |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** The parent requirement and its approval are inherited; WI-001 remains the source of truth.

### Starting request

Put the README documentation part into its own sub-item, so it can be built and checked on its own.

### Agreed goal

Covers WI-001 R-02. The requirement text and its approval (2026-09-27 by Mike) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-02. The requirement text and its approval (2026-09-27 by Mike) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. The README documents `--shout`, including how to use it and what it prints, as WI-001 R-02 requires.
2. The README includes an example and it has been checked against the CLI output.
3. Mike reviews this finished documentation result separately.

## Notes

### Decisions and context

- Mike requested this separate sub-item on 2026-09-27. It covers WI-001 R-02 and inherits the parent's requirements approval and Option A design.
- Mike approved the README result and authorized local merge and closeout on 2026-09-27.

### Resume here

WI-002 is delivered on local `main` at `3c6be95` and ready to mark Done. No further work is planned.

### Solution options and considerations

The approved parent design called for usage and output examples in `README.md`; they are built and checked.

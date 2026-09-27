---
id: WI-002
title: Document --shout in README
type: task
stage: 06-implementation-plan
status: In Progress
parent: WI-001
waiting_on: "agent"
priority: medium
delivery: not-offered
requirements_approved: 2026-09-27 by Mike
design: none
result_approved: "no"
updated: 2026-09-27
---

# WI-002: Document --shout in README

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Document `--shout` in `README.md` with usage and output examples, covering WI-001 R-02.

**Current position:** Created as a sub-item of WI-001 with inherited requirements approval. The parent design is approved; no README edit has started.

**Next action:** Agent plans and builds the README change, then checks it against WI-001 R-02 on its own.

**Blockers:** None.

**Related items:** Parent WI-001 (R-02 and approved Option A design).

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — README documentation | Readers can see how to use `--shout` and what it prints. | Not Started | README text includes a usage and output example matching WI-001 R-02. | None |
| P2 — Documentation check | The README result is reviewed separately from the CLI code. | Not Started | The README passes the R-02 acceptance check and is ready for Mike's result approval. | None |

## Tasks

### P1 — README documentation

- [ ] **P1-T01 — Document the flag** · Not Started  
  **Work:** Add `--shout` usage and output examples to `README.md`.  
  **Deliverable:** Updated README.  
  **Done when:** The README explains `--shout` and shows the uppercase greeting it prints.  
  **Depends on:** None.

### P2 — Documentation check

- [ ] **P2-T01 — Check the README** · Not Started  
  **Work:** Read the README against WI-001 R-02 and compare its examples with the implemented command.  
  **Deliverable:** Recorded check result for WI-002.  
  **Done when:** The usage and output examples are accurate and Mike can review this result on its own.  
  **Depends on:** P1-T01 and the WI-001 CLI implementation.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
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

### Resume here

Use the approved parent design to plan and update `README.md`. Check the documentation against WI-001 R-02 separately. No README edit has started.

### Solution options and considerations

The approved parent design calls for a usage and output example in `README.md`.

---
id: WI-002
title: Document --shout in the README
type: task
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: "2026-09-27 by Mike"
design: none
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-002: Document --shout in the README

## Overview

**Goal:** Document --shout in the README with an invocation and its output.

**Current position:** Built and checked in commit f794cc6 on claude/wi-002-readme, then included in WI-001's feature branch. Both README examples produced their documented output. npm test passed 5 tests.

**Next action:** None. Finished.

**Blockers:** Local merge to main needs Mike's approval. The repository has no remote.

**Related items:** Parent WI-001 (R-02). Design: WI-001's approved design.

## Roadmap

A phase is complete when its task is complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — README documentation | The README names --shout and shows its output. | Done | Both README examples match checked CLI invocations; commit f794cc6. | None |

## Tasks

### P1 — README documentation

- [x] **P1-T01 — Write --shout example** · Done  
  **Work:** Add --shout usage and an invocation with its output to README.md.  
  **Deliverable:** Updated README.md.  
  **Done when:** The example uses the implemented CLI behavior and shows its exact output.  
  **Depends on:** WI-001 R-01 CLI output.  
  **Evidence:** The documented invocations produced HELLO, MIKE! and HELLO, WORLD!; commit f794cc6.
- [x] **P1-T02 — Check documentation** · Done  
  **Work:** Check README.md against WI-001 R-02 and run its example.  
  **Deliverable:** Recorded check result for WI-002.  
  **Done when:** The README names --shout, shows an invocation and output, and the invocation produces that output.  
  **Depends on:** P1-T01.  
  **Evidence:** README reviewed against R-02; both documented invocations ran with exact output; npm test passed 5 tests.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: README examples produced HELLO, MIKE! and HELLO, WORLD!; npm test passed 5 tests on main; commits f794cc6 and 5c6adf9 reached local main. |
| 2026-09-27 | Delivered requirements/greeting/AREA.md and system-guide/greeting.md to local main at 5c6adf9. | Delivered behavior and verified structure are recorded; no remote publication was possible. |
| 2026-09-27 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | No remote: merged locally into main. | No pull request; no deployment. |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Owner's words: Ship both and merge to main. There is no remote, so merge locally. I approve the merge and the git commands you need, and you can close both items out when they are done. | Local merge to main and closing both items are approved. |
| 2026-09-27 | Owner's words: Good. I approve both results, the CLI and the README. Also add this line to WI-002's Decisions and context: 'Mike checked the README examples himself.' Just edit the file directly. | Continue with work-finish. Now waiting on the agent. |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked WI-001 R-02: README names --shout and shows invocations with exact output; both examples ran as documented; npm test passed 5 tests; commit f794cc6; no known gaps. No independent checker ran because Mike requested no helper agents. | Ready for Mike's result review. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-27 | Moved by hand: .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/WI-002-document-shout-in-the-readme/WORK-ITEM.md -> .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/docs/WI-002-readme/WORK-ITEM.md. | Its parent stays WI-001. Group: docs. |
| 2026-09-27 | Owner's words: And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own. | WI-002 has its own build task and acceptance check for WI-001 R-02. |
| 2026-09-27 | Created as a sub-item of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from WI-001 (2026-09-27 by Mike); the owner is not asked again. WI-001's approved design covers it, so it needs no design of its own. Starts at 06 Implementation plan. Continue with work-on. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

## Requirements

<!-- Starting request records what was asked; Agreed goal records the outcome the owner accepted. Under Active requirements, create one R-ID subsection per explicit behavior. Fill every labeled field under each R-ID. Keep an item Refining until its required behavior and acceptance check are clear and owner approval is recorded; mark Superseded only with a replacement link. Put solution ideas in the final Notes subsection, not here. -->

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Mike asked to put the README documentation part of WI-001 into its own sub-item, so it can be built and checked on its own.

### Agreed goal

Covers WI-001 R-02. The requirement text and its approval (2026-09-27 by Mike) stay in WI-001; this item copies none of it.

### Active requirements

- Covers WI-001 R-02. The requirement text and its approval (2026-09-27 by Mike) stay in WI-001; this item copies none of it.

### Acceptance

This work item can be accepted when:

1. README.md names --shout and shows an invocation with its output, as required by WI-001 R-02.
2. The invocation is run and produces the documented output.
3. WI-002 receives its own result check and Mike reviews its finished result.

## Notes

<!-- Keep useful context here without duplicating the requirements or task list. Update Resume here before a session ends. Solution options and considerations stays last and contains proposals only. -->

### Decisions and context

- Mike requested this separate sub-item on 2026-09-27.
- WI-001 R-02 and its 2026-09-27 approval remain in the parent; this item inherits them.
- WI-001 Option A covers this documentation work.
- Mike checked the README examples himself.

### Resume here

Finished on 2026-09-27. Nothing to resume.

### Solution options and considerations

Use the invocation and exact output defined by WI-001 R-02 and its approved Option A. No separate design decision is needed.

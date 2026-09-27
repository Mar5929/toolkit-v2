---
id: WI-001
title: <Work item title>
type: <discovery | solution-design | build | data-load | repository-maintenance | research | task | bug | enhancement>
stage: <01-discovery ... 14-spec-update>
status: <Backlog | Ready | In Progress | In Review | Done | Cancelled>
parent: <WI-id | none>
waiting_on: "<owner | agent | external: who | none>"
priority: <urgent | high | medium | low>
delivery: <agent-led | owner-led | not-offered>
requirements_approved: <YYYY-MM-DD by <name> | no>
design: <proposed | approved | superseded | none>
result_approved: <YYYY-MM-DD by <name> | no>
updated: <YYYY-MM-DD>
---

# WI-001: <Work item title>

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

<!-- Enter the current summary directly after each bold label below. Keep this section current; detailed tasks and decisions belong in their sections further down. -->

**Goal:** <The outcome this work item is meant to achieve.>

**Current position:** <What has been completed and where work stands now.>

**Next action:** <The next specific action and its owner.>

**Blockers:** <Blocking decision or dependency, or “None.”>

**Related items:** <Roadmap unit, parent and related work item IDs (never folder paths), design, or external links.>

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

<!-- Replace each example row with a real phase. Keep its phase ID identical to the matching Tasks heading. Add one row per phase; set Status from actual progress, not from this example. List the phase's sub-item IDs under Sub-items, or write “None.” -->

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — <Phase 1 name> | <What this phase establishes> | In Progress | <Evidence that P1 is complete> | <WI-ids or “None.”> |
| P2 — <Phase 2 name> | <What this phase delivers> | Not Started | <Evidence that P2 is complete> | <WI-ids or “None.”> |

## Tasks

<!-- Under each phase heading, add that phase's tasks only. Replace P1-T01 and similar example IDs with stable real IDs. Put the action after Work, its output after Deliverable, the completion proof after Done when, and real prerequisites after Depends on. Change the checkbox only when the completion proof is met. -->

### P1 — <Phase 1 name>

- [ ] **P1-T01 — <Task 1 name>** · In Progress  
  **Work:** <The action to take.>  
  **Deliverable:** <The file, decision, or other result.>  
  **Done when:** <The observable completion check.>  
  **Depends on:** <Task ID or “None.”>
- [ ] **P1-T02 — <Task 2 name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The expected result.>  
  **Done when:** <The observable completion check.>  
  **Depends on:** P1-T01.

### P2 — <Phase 2 name>

- [ ] **P2-T01 — <Task 1 name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The expected result.>  
  **Done when:** <The observable completion check.>  
  **Depends on:** P1 completion.

## Recent History

<!-- Add one row for each material decision or progress change, newest first. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| <YYYY-MM-DD> | <What happened> | <What changed or what happens next> |

## Open Questions

<!-- Add one row per unanswered decision, using a stable Q-ID. Write the exact question, affected requirement/task IDs, current status, and who can answer: `owner` for the project owner, or another person or role. Resolve or remove example rows as decisions are recorded; do not hide an open decision only in Notes. -->

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | <Specific unanswered question> | R-01, P1-T02 | Open | <owner, or another person or role> |

## Requirements

<!-- Starting request records what was asked; Agreed goal records the outcome the owner accepted. Under Active requirements, create one R-ID subsection per explicit behavior. Fill every labeled field under each R-ID. Keep an item Refining until its required behavior and acceptance check are clear and owner approval is recorded; mark Superseded only with a replacement link. Put solution ideas in the final Notes subsection, not here. -->

**Overall status:** Refining  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

<The owner’s original request, in their words or a faithful short summary.>

### Agreed goal

<The outcome the owner has agreed this work item should deliver.>

### Active requirements

#### R-01 — <Required outcome>

**Status:** <Refining | Finalized | Superseded>  
**Applies to:** <Who or what is affected, and when this requirement applies.>  
**Required behavior:** <Exactly what must happen or be true.>  
**Boundaries and exceptions:** <Where the requirement does not apply, or “None identified.”>  
**Acceptance check:** <What someone can observe to confirm this requirement is met.>  
**Decision record:** <Source of the requirement; if Finalized, who approved it and when. If Superseded, link to its replacement.>  
**Open questions:** <Question IDs or “None.”>

#### R-02 — <Required outcome>

**Status:** <Refining | Finalized | Superseded>  
**Applies to:** <Who or what is affected, and when.>  
**Required behavior:** <Exactly what must happen or be true.>  
**Boundaries and exceptions:** <Exceptions or “None identified.”>  
**Acceptance check:** <Observable proof.>  
**Decision record:** <Source and approval details.>  
**Open questions:** <Question IDs or “None.”>

### Acceptance

This work item can be accepted when:

1. <Overall result that must be delivered.>
2. <How the completed result will be checked.>
3. <Any required documentation, handoff, or owner review.>

## Notes

<!-- Keep useful context here without duplicating the requirements or task list. Update Resume here before a session ends. Solution options and considerations stays last and contains proposals only. -->

### Decisions and context

- <Useful decision or context that is not itself a requirement.>

### Resume here

<Where the next person or session should pick up.>

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

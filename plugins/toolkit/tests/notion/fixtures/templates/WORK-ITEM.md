---
id: WI-001
title: <Work item title>
type: <discovery | solution-design | build | data-load | repository-maintenance | research | task | bug | enhancement>
stage: <01-discovery ... 14-spec-update>
status: <Backlog | Ready | In Progress | In Review | Done | Cancelled>
parent: <WI-id | none>
waiting_on: <owner | agent | external: who | none>
priority: <urgent | high | medium | low>
delivery: <agent-led | owner-led | not-offered>
requirements_approved: <YYYY-MM-DD by <name> | no>
design: <proposed | approved | superseded | none>
result_approved: <YYYY-MM-DD by <name> | no>
updated: <YYYY-MM-DD>
---

# WI-001: <Work item title>

## Overview

**Goal:** <The outcome this work item is meant to achieve.>

**Current position:** <What has been completed and where work stands now.>

**Next action:** <The next specific action and its owner.>

**Blockers:** <Blocking decision or dependency, or “None.”>

**Related items:** <Roadmap unit, parent and related work item IDs (never folder paths), or external links.>

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked. List each phase's sub-items by work item ID, or “None.”

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — <Phase 1 name> | <What this phase establishes> | In Progress | <Evidence that P1 is complete> | <WI-ids or “None.”> |
| P2 — <Phase 2 name> | <What this phase delivers> | Not Started | <Evidence that P2 is complete> | <WI-ids or “None.”> |

## Tasks

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

| Date | Change or decision | Effect on the work |
|---|---|---|
| <YYYY-MM-DD> | <What happened> | <What changed or what happens next> |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | <Specific unanswered question> | R-01, P1-T02 | Open | <owner, or another person or role> |

## Requirements

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

### Decisions and context

- <Useful decision or context that is not itself a requirement.>

### Resume here

<Where the next person or session should pick up.>

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

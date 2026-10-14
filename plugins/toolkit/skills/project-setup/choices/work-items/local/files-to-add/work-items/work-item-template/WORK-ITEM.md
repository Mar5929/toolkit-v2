---
id: WI-001
title: <Work item title>
type: <discovery | solution-design | build | data-load | repository-maintenance | research | task | bug | enhancement>
state: <Backlog | Refining Requirements | Designing | Building | Testing Loop | Reflecting | Deploying | Blocked | Done | Cancelled>
status: <Not Started | Preparing | In Progress | Blocked | Done | Cancelled>
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

<!-- Create the item with `managing-work-items`, which assigns its ID and state/status values. Start with `waiting_on: "none"`, `priority: medium`, `delivery: not-offered`, both approvals `no`, and `design: none`. Set a sub-item's `parent` to its parent ID. Replace prompts with real values, remove unused examples and comments, and keep the required headings and labels. -->

## Overview

<!-- Write after each bold label. Update Goal and Related items when their contents change. Update Current state after each step. Fill Moved up during closure. Keep tasks, decisions, and history in their own sections. -->

**Goal:** <The outcome this work item is meant to achieve.>

### Current state

<!-- Keep these fields concise and sufficient for the owner or a new session to resume. Rewrite them in place after each step and at handoff. Add history to Recent History, not here. -->

**Where it stands:** <What is done and where work stands now.>

**Next action:** <One of three forms. Working: “<Who>: <the exact next step, one sentence>.” Example: “Agent: write two design options for the permission set groups.” Waiting: “Waiting on the owner: Q-07 (<the question in a few words>). After the owner's answer: <step>.” Example: “Waiting on the owner: Q-07 (merge or move the 15 personas). After the owner's answer: finish R-04.” Finished or cancelled: “None. Finished.” or, for a cancelled item, “None. Cancelled.”>

**Waiting on:** <Who the item waits on and for what, matching `waiting_on`, for example “The owner: Q-07.”; or “Nothing.”>

**Blockers:** <What blocks the item and who can clear it, and, for a Blocked item, the State it left; or “None.”>

**Last updated:** <YYYY-MM-DD, and who: the owner or the agent.>

**Related items:** <For a top-level item, “Project phase P01.”, or “No project phase yet.”; for a sub-item, its parent's ID, and “Built from the design of”, then the parent's ID, when it has no design of its own. Related work item IDs (never folder paths) and external links. Each shared decision or rule this item must follow, by its ID or link; say so beside a link to a record that still waits to be filed in its final place.>

**Moved up:** <Leave empty until the closing step of `managing-work-items`; the item cannot become Done or Cancelled while it is empty. Then name each shared decision, system rule, and project term that this item added or changed, by its ID or link, with what happened. Say so beside a link to a record that still waits to be filed in its final place, and name its final place only after the filing is verified. When there are none, write “Nothing:”, then the reason.>

## Roadmap

<!-- A top-level item (`parent: none`) uses a Roadmap only when phases help plan or track its outcomes. A new item without phases and every sub-item omit this Roadmap section and use the plain-list form at the end of Tasks. -->

A phase is complete when its tasks are complete, its sub-items are Done or Cancelled, and its exit result has been checked.

<!-- Use real phases and progress. Match phase IDs to the Tasks headings. List each phase's sub-item IDs, or write “None.”. -->

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — <Phase 1 name> | <What this phase establishes> | In Progress | <Evidence that P1 is complete> | <WI-ids or “None.”> |
| P2 — <Phase 2 name> | <What this phase delivers> | Not Started | <Evidence that P2 is complete> | <WI-ids or “None.”> |

## Tasks

<!-- Group tasks under their phases, or use the plain list when there are no phases. Remove the unused form. Keep stable task IDs. Fill each task's action, output, completion proof, responsible party, and prerequisites. Set Who does it to `owner` for owner-only steps. Check a task only when its completion proof is met. -->

### P1 — <Phase 1 name>

- [ ] **P1-T01 — <Task 1 name>** · In Progress  
  **Work:** <The action to take.>  
  **Deliverable:** <The file, decision, or other result.>  
  **Done when:** <The observable completion check.>  
  **Who does it:** <agent | owner>  
  **Depends on:** <Task ID or “None.”>
- [ ] **P1-T02 — <Task 2 name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The expected result.>  
  **Done when:** <The observable completion check.>  
  **Who does it:** <agent | owner>  
  **Depends on:** P1-T01.

### P2 — <Phase 2 name>

- [ ] **P2-T01 — <Task 1 name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The expected result.>  
  **Done when:** <The observable completion check.>  
  **Who does it:** <agent | owner>  
  **Depends on:** P1 completion.

<!-- Plain-list form: an item without phases lists its tasks here. New tasks use T01, T02, and so on; existing tasks keep their IDs. The Sub-items line lists its own sub-items. -->

**Sub-items:** <A top-level item without phases: the IDs of its level-2 sub-items, or “None.” A level-2 sub-item: the IDs of its level-3 sub-items, or “None.” A level-3 sub-item: “None.”>

- [ ] **T01 — <Task 1 name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The expected result.>  
  **Done when:** <The observable completion check.>  
  **Who does it:** <agent | owner>  
  **Depends on:** <Task ID or “None.”>

## Recent History

<!-- Add dated rows, newest first, for state, waiting, blocker, or next-action changes whose reason is not otherwise clear; answers, approvals, rejections, decisions, checker reports, plan changes, owner edits, and finished results. Say what changed, who made or authorized it, why, and its effect or next action. Link decisions by Q-ID rather than repeating their answers. Remove the placeholder row when adding real history. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| <YYYY-MM-DD> | <What happened; for a decision, its Q-ID> | <What changed or what happens next> |

## Requirements

<!-- Keep a block for each requirement, numbered in the order added, with IDs such as R-01 elsewhere. Preserve the requester's exact words and identify the speaker and source (SRC-### for filed sources). State scope and checkable behavior in Functional Requirements and observable checks in Acceptance Criteria. Keep dropped blocks marked “(dropped, Q-ID)” and never reuse IDs. Record approval in `requirements_approved` and Questions and Answers. Put solution proposals in Notes. -->

### Requirement <number>: <short name>

- **Original verbatim requirement:** <i.e. from the user, stakeholder, etc.>
- **Goal:** <What this requirement achieves>

**Functional Requirements**

1. <One line each: system behavior, process steps, business rules, and data model>
2. <Requirement 2>
3. <etc…>

**Acceptance Criteria:**

1. <Acceptance Criteria 1>
2. <Acceptance Criteria 2>
3. <etc…>

## Questions and Answers

<!-- Record each question with a stable Q-ID, its exact wording, affected requirement/task IDs, and who may answer. Include your recommendation and reason when offered. Save every decision here, including decisions made without a preceding question. Preserve the speaker's words and decision date; for sourced answers, include the speaker, SRC ID, and supporting passage or timestamp. Sourced decisions must pass `filing-project-records/references/record-decision.md` authority and evidence checks and do not replace owner lifecycle approvals. After an answer, mark the row Answered, set Decision? when applicable, and update the affected goal, requirement, or task. Record a bulk approval in a row for each matter covered, with the reason shown (“reason shown: none” when absent). File shared decisions through `filing-project-records` and append the record ID or link, identifying pending filing. Retain the original answer and evidence. Keep open questions first and replace the example rows. -->

| ID | Question | Answer | Date answered | Decision? | Affects | Status | Decision needed from |
|---|---|---|---|---|---|---|---|
| Q-02 | <Specific unanswered question> |  |  |  | R-01, P1-T02 | Open | <owner, or another person or role> |
| Q-01 | <Question answered by an authorized speaker> | <The answer in the speaker's words, with source evidence when applicable> | <YYYY-MM-DD> | <yes or no> | R-01 | Answered | <owner, or another person or role> |

## Notes

<!-- Keep useful context here without duplicating the requirements, the task list, Questions and Answers, or the Overview's Current state, which says where to pick up. Solution options and considerations stays last and contains proposals only. -->

### Context

- <Useful context that is not a requirement or a decision. Decisions are Questions and Answers rows.>

### Sources

<!-- File originals in `sources/` first. List their SRC-### IDs here and cite those IDs wherever their content is used. Keep the originals in `sources/`. Write “None.” when there are no sources. -->

- <SRC-###>: <What it is, for example “kickoff meeting transcript, YYYY-MM-DD.”> Taken from it: <The requirement, question, or task IDs it informed.>

### Lessons not proven yet

<!-- List useful lessons that are not proven yet, with where they were seen. At closure, ask the owner whether to move up or drop each lesson and record the outcome. Write “None.” when there are none. -->

- <The lesson, and where it was seen: a task ID, a commit, or a date.>

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

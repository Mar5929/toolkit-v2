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

<!-- Fill-in guide for a new work item: create it with `using-work-tracker`, which sets the real ID in the front matter and the heading. In the front matter, keep one value from each list; the status follows from the state, as `running-work-item-lifecycle` says. A new item starts with `waiting_on: "none"`, `priority: medium`, `delivery: not-offered`, both approvals `no`, and `design: none`. A sub-item's `parent` names the item above it. Text in angle brackets tells you what to write in that same field, cell, or paragraph: replace it with real content, or delete it when there is nothing to write yet, so no angle-bracket prompt is left in the item. Keep the headings and field labels. Delete each example phase, task, question, and requirement the item does not have yet. Delete this guide when you create the item. -->

## Overview

<!-- Enter the text directly after each bold label below. Goal and Related items change only when the item's aim or links change; Current state changes after every step; Moved up stays empty until the item is closed. Detailed tasks belong in Tasks, decisions in Questions and Answers, and what happened in Recent History, further down. -->

**Goal:** <The outcome this work item is meant to achieve.>

### Current state

<!-- Fill-in guide for Current state: the five lines under this heading say where the item stands right now, so a new session or the owner can pick up from them alone. Rewrite these lines in place after each step (a task finished, a question asked or answered, a state or `waiting_on` change, a pause, the end of a session); never add a line, a date list, or a log to them. History goes to Recent History as a new row. Keep each line to one or two sentences. -->

**Where it stands:** <What is done and where work stands now.>

**Next action:** <One of three forms. Working: “<Who>: <the exact next step, one sentence>.” Example: “Agent: write two design options for the permission set groups.” Waiting: “Waiting on the owner: Q-07 (<the question in a few words>). After his answer: <step>.” Example: “Waiting on the owner: Q-07 (merge or move the 15 personas). After his answer: finish R-04.” Finished or cancelled: “None. Finished.” or, for a cancelled item, “None. Cancelled.”>

**Waiting on:** <Who the item waits on and for what, matching `waiting_on`, for example “The owner: Q-07.”; or “Nothing.”>

**Blockers:** <What blocks the item and who can clear it, and, for a Blocked item, the State it left; or “None.”>

**Last updated:** <YYYY-MM-DD, and who: the owner or the agent.>

**Related items:** <For a top-level item, “Project phase P01.”, or “No project phase yet.”; for a sub-item, its parent's ID, and “Built from the design of”, then the parent's ID, when it has no design of its own. Related work item IDs (never folder paths) and external links. Each decision in `DECISIONS.md` and each rule in `system/` that this item must follow, by ID, for example “DEC-014, SEC-04”.>

**Moved up:** <Leave empty until the closing step of `running-work-item-lifecycle`; the item cannot become Done or Cancelled while it is empty. Then: each entry in `DECISIONS.md` and each rule in `system/` that this item added or changed, by ID, with what happened, for example “DEC-014 recorded. SEC-04 added and Built. DAT-02 changed.”; or “Nothing:”, then the reason.>

## Roadmap

<!-- Only a top-level item (`parent: none`) has a Roadmap, with at least one phase. A sub-item has no phases: delete this whole Roadmap section, and use the sub-item form at the end of Tasks. -->

A phase is complete when its tasks are complete, its sub-items are Done or Cancelled, and its exit result has been checked.

<!-- Replace each example row with a real phase. Keep its phase ID identical to the matching Tasks heading. Add one row per phase; set Status from actual progress, not from this example. List the phase's sub-item IDs under Sub-items, or write “None.” -->

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — <Phase 1 name> | <What this phase establishes> | In Progress | <Evidence that P1 is complete> | <WI-ids or “None.”> |
| P2 — <Phase 2 name> | <What this phase delivers> | Not Started | <Evidence that P2 is complete> | <WI-ids or “None.”> |

## Tasks

<!-- A top-level item: under each phase heading, add that phase's tasks only, and delete the sub-item form at the end of this section. A sub-item: delete the phase headings and their tasks, and keep only the sub-item form. Replace P1-T01, T01, and similar example IDs with stable real IDs. Put the action after Work, its output after Deliverable, the completion proof after Done when, `agent` or `owner` after Who does it (`owner` for a step only the owner can take, such as a production deploy, a sign-in, or a check he must make himself), and real prerequisites after Depends on. Change the checkbox only when the completion proof is met. -->

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

<!-- Sub-item form: a sub-item's tasks in one plain list, numbered T01, T02, and so on, after the line that lists its own sub-items. -->

**Sub-items:** <A level-2 sub-item: the IDs of its level-3 sub-items, or “None.” A level-3 sub-item: “None.”>

- [ ] **T01 — <Task 1 name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The expected result.>  
  **Done when:** <The observable completion check.>  
  **Who does it:** <agent | owner>  
  **Depends on:** <Task ID or “None.”>

## Recent History

<!-- Add one row, newest first, for each of these changes: a state, `waiting_on`, blocker, or next action change for a reason a later reader could not see; an answer, approval, rejection, or decision; the independent checker's report; a plan change; a change the owner made by hand; a finished result. This table is the item's history; the Overview's Current state says only where the item stands now. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. For a decision, name its Q-ID (for example “Q-04 answered”) instead of repeating it; the decision itself is the row in Questions and Answers. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| <YYYY-MM-DD> | <What happened; for a decision, its Q-ID> | <What changed or what happens next> |

## Requirements

<!-- Every requirement follows the structure below: one block per requirement, numbered 1, 2, 3 in the order they are added. After Original verbatim requirement, put the words of the owner, or of the stakeholder or source that asked for it, word for word, never reworded; when they are not the owner's words in this chat, name who said them and where (a source by its SRC-###). In each numbered list, write one line per thing that must be true, exact enough to check. Who or what a requirement applies to, and where it does not apply, are lines of its Functional Requirements. Each Acceptance Criteria line is one thing someone can observe. A dropped requirement keeps its block, with " (dropped, Q-ID)" added to its heading; a number is never reused. Everywhere else, name a requirement in the short form R-01, which means Requirement 1. Approval is recorded in `requirements_approved` and in Questions and Answers, not here. Put solution ideas in the final Notes subsection, not here. -->

### Requirement <number>: <short name>

- **Original verbatim requirement:** <i.e. from the user, stakeholder, etc.>
- **Goal:** <What this requirement achieves, in one sentence>

**Functional Requirements**

1. <One line each: system behavior, process steps, business rules, and data model>
2. <Requirement 2>
3. <etc…>

**Acceptance Criteria:**

1. <Acceptance Criteria 1>
2. <Acceptance Criteria 2>
3. <etc…>

## Questions and Answers

<!-- Add a row for every question you ask about this item, with a stable Q-ID. Write the exact question, then “Recommended: <answer>, because <reason>.” when you recommend one; the requirement and task IDs it affects; and who can answer: `owner` for the project owner, or another person or role. The moment the owner answers, put his words in Answer and the date in Date answered, set Status to Answered, and update the goal, requirement, or task the answer affects. Set Decision? to yes when the answer decides something. The item's decisions are these rows: save every decision made while working this item here, with the owner's words and the date; when he decides something without being asked, add a row for the question it settles. A bulk “yes to all” is saved as one row per thing it covered, each with the reason the owner was shown (“reason shown: none” when there was none). A decision more than one work item needs is an entry in `DECISIONS.md`: the row that raised it keeps his words and ends “Filed as DEC-###.” Keep unanswered rows first, so a new session resumes at the first open question. Do not hide an open question only in Notes. Replace the example rows with real ones. -->

| ID | Question | Answer | Date answered | Decision? | Affects | Status | Decision needed from |
|---|---|---|---|---|---|---|---|
| Q-02 | <Specific unanswered question> |  |  |  | R-01, P1-T02 | Open | <owner, or another person or role> |
| Q-01 | <Question the owner has answered> | <The owner's answer, in his words> | <YYYY-MM-DD> | <yes or no> | R-01 | Answered | <owner, or another person or role> |

## Notes

<!-- Keep useful context here without duplicating the requirements, the task list, Questions and Answers, or the Overview's Current state, which says where to pick up. Solution options and considerations stays last and contains proposals only. -->

### Context

- <Useful context that is not a requirement or a decision. Decisions are Questions and Answers rows.>

### Sources

<!-- One line per original this item used. The original is filed in `sources/` first; this line holds its SRC-### ID, never the original or a copy of its text. Wherever the item uses something drawn from a source, name its SRC-###. Write “None.” when the item has no sources. -->

- <SRC-###>: <What it is, for example “kickoff meeting transcript, YYYY-MM-DD.”> Taken from it: <The requirement, question, or task IDs it informed.>

### Lessons not proven yet

<!-- One line per thing the work taught that a later work item may need and that is not proven yet, for example a platform limit met once or an approach that failed. The closing step asks the owner whether each one moves up or is dropped, and writes the outcome at the end of its line. Write “None.” when there are none. -->

- <The lesson, and where it was seen: a task ID, a commit, or a date.>

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

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

<!-- Fill-in guide for a new work item: create it with `tracking-work-items`, which saves this file under the item's ID and sets the real ID in front matter and heading. `tracking-work-items` makes the design when a design starts. `WORK-ITEM.md` is the name of this template only. Find an item by its `id:` field, never by its path; the owner may move or rename item folders by hand. Save source files, such as meeting transcripts and documents (in a Salesforce project, a client file stays in `delivery/` and the Sources list names its path), with `tracking-work-items`, and list each one under Notes, Sources. A sub-item's `parent` names the item above it. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `tracking-work-items`; the status follows from the state, as `managing-work-items` says. A blocked item has state and status Blocked, `waiting_on` set, and its Current state Waiting on and Blockers lines filled. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

<!-- Enter the text directly after each bold label below. Goal and Related items change only when the item's aim or links change; Current state changes after every step. Detailed tasks belong in Tasks, decisions in Questions and Answers, and what happened in Recent History, further down. -->

**Goal:** <The outcome this work item is meant to achieve.>

### Current state

<!-- Fill-in guide for Current state: the five lines under this heading say where the item stands right now, so a new session or the owner can pick up from them alone. Rewrite these lines in place after each step (a task finished, a question asked or answered, a state or `waiting_on` change, a pause, the end of a session); never add a line, a date list, or a log to them. History goes to Recent History as a new row. Keep each line to one or two sentences. -->

**Where it stands:** <What is done and where work stands now.>

**Next action:** <One of three forms. Working: “<Who>: <the exact next step, one sentence>.” Example: “Agent: write two design options for the permission set groups.” Waiting: “Waiting on Mike: Q-07 (<the question in a few words>). After his answer: <step>.” Example: “Waiting on Mike: Q-07 (merge or move the 15 personas). After his answer: finish R-04.” Finished or cancelled: “None. Finished.” or, for a cancelled item, “None. Cancelled.”>

**Waiting on:** <Who the item waits on and for what, matching `waiting_on`, for example “Mike: Q-07.”; or “Nothing.”>

**Blockers:** <Blocking decision or dependency, or “None.”>

**Last updated:** <YYYY-MM-DD, and who: the owner or the agent.>

**Related items:** <The `PROJECT-ROADMAP.md` work unit (for example P01-U01), parent and related work item IDs (never folder paths), design, or external links. Memories that name this item: Obsidian's Backlinks panel for a local item; an agent finds them with the memory find skill by this ID.>

## Roadmap

A phase is complete when its tasks are complete, its sub-items are Done or Cancelled, and its exit result has been checked.

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

<!-- Add one row, newest first, for each of these changes: a state, `waiting_on`, blocker, or next action change for a reason a later reader could not see; an answer, approval, rejection, or decision; the independent checker's report; a plan change; a change the owner made by hand; a finished result. This table is the item's history; the Overview's Current state says only where the item stands now. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. For a decision, name its Q-ID (for example “Q-04 answered”) instead of repeating it; the decision itself is the row in Questions and Answers. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| <YYYY-MM-DD> | <What happened; for a decision, its Q-ID> | <What changed or what happens next> |

## Requirements

<!-- Starting request records what was asked; Agreed goal records the outcome the owner accepted. Under Active requirements, create one R-ID subsection per explicit behavior. Fill every labeled field under each R-ID. Keep a requirement Refining until its required behavior and acceptance check are clear and owner approval is recorded. Mark a dropped or replaced requirement Superseded, with the reason and the Q-ID in its Decision record, and a link to its replacement when there is one. Put solution ideas in the final Notes subsection, not here. -->

**Overall status:** Refining  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

<The owner’s original request, in his words.>

### Agreed goal

<The outcome the owner has agreed this work item should deliver.>

### Active requirements

#### R-01 — <Required outcome>

**Status:** <Refining | Finalized | Superseded>  
**Applies to:** <Who or what is affected, and when this requirement applies.>  
**Required behavior:** <Exactly what must happen or be true.>  
**Boundaries and exceptions:** <Where the requirement does not apply, or “None identified.”>  
**Acceptance check:** <What someone can observe to confirm this requirement is met.>  
**Decision record:** <Source of the requirement; if Finalized, who approved it and when; if an answer changed it, that Q-ID. If Superseded, the reason, the Q-ID of the answer that dropped or replaced it, and a link to its replacement when there is one.>  
**Open questions:** <Question IDs or “None.”>

#### R-02 — <Required outcome>

**Status:** <Refining | Finalized | Superseded>  
**Applies to:** <Who or what is affected, and when.>  
**Required behavior:** <Exactly what must happen or be true.>  
**Boundaries and exceptions:** <Exceptions or “None identified.”>  
**Acceptance check:** <Observable proof.>  
**Decision record:** <Source and approval details, or the Q-ID that changed it.>  
**Open questions:** <Question IDs or “None.”>

### Acceptance

This work item can be accepted when:

1. <Overall result that must be delivered.>
2. <How the completed result will be checked.>
3. <Any required documentation, handoff, or owner review.>

## Questions and Answers

<!-- Add a row for every question you ask about this item, with a stable Q-ID. Write the exact question, the requirement and task IDs it affects, and who can answer: `owner` for the project owner, or another person or role. The moment the owner answers, put his words in Answer and the date in Date answered, set Status to Answered, and update the goal, requirement, or task the answer affects. Set Decision? to yes when the answer decides something. The item's decisions are these rows: save every decision made while working this item here, with the owner's words and the date; when he decides something without being asked, add a row for the question it settles. A bulk “yes to all” is saved as one row per thing it covered, each with the reason the owner was shown (“reason shown: none” when there was none). A decision that matters beyond this item (will a later work item, or an agent working on something else, need to follow this?) is also offered for project memory: ask the owner “This looks project-wide. Save it to memory too?” and, on his yes, save it with the memory save skill, with a link back to this item that names the Q-ID. Keep unanswered rows first, so a new session resumes at the first open question. Do not hide an open question only in Notes. Replace the example rows with real ones. -->

| ID | Question | Answer | Date answered | Decision? | Affects | Status | Decision needed from |
|---|---|---|---|---|---|---|---|
| Q-02 | <Specific unanswered question> |  |  |  | R-01, P1-T02 | Open | <owner, or another person or role> |
| Q-01 | <Question the owner has answered> | <The owner's answer, in his words> | <YYYY-MM-DD> | <yes or no> | R-01 | Answered | <owner, or another person or role> |

## Notes

<!-- Keep useful context here without duplicating the requirements, the task list, Questions and Answers, or the Overview's Current state, which says where to pick up. Solution options and considerations stays last and contains proposals only. -->

### Context

- <Useful context that is not a requirement or a decision. Decisions are Questions and Answers rows.>

### Sources

<!-- One line per source: a file saved with the item (`tracking-work-items` says how), or a project file named by its path (a Salesforce client file stays in `delivery/`): what it is and what was taken from it. Wherever the item uses something drawn from a source, name that source. Write “None.” when the item has no sources. -->

- <File name>: <What it is, for example “kickoff meeting transcript, YYYY-MM-DD.”> Taken from it: <The requirement, question, or task IDs it informed.>

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

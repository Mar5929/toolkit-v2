# Running a work item's lifecycle

Use this reference to take one work item from an idea to Done. The goal is that the work item always says truly where the work stands, and that no step that needs the owner's yes happens without it.

This reference says what each State means, how work is divided into levels, what to do in each State, and when to stop for the owner's yes. Two neighbouring jobs belong to other skills:

- **Reading and saving a work item.** For every read and every save, use the installed `references/work-tracker.md`, which says where this project keeps its work items.
- **Writing shared records.** `filing-project-records` writes sources, and the decisions, open questions, system rules, and project terms that more than one work item needs. Never write those records with this skill. Write the ID or link of one of those records into a work item only when `filing-project-records` has saved the record and given you the ID or link. When that step says the record still waits to be filed in its final place, say so beside the ID or link. The root `AGENTS.md`, section "Where information goes", gives the test for what belongs in a shared record, and says where this project keeps each kind. Active questions and designs for one work item stay in that work item.
  - When a work item must follow a rule or a decision that already exists, give the ID or link of the rule or decision and the work item to `filing-project-records`. It writes the ID or link into the work item.

## Contents

- Status and State
- Levels
- When to stop for the owner's yes
- A small work item
- Rules that apply in every State
- Work that another skill does

## Status and State

Every work item has a Status and a State. The State says where the work is. The Status follows from the State, so set the State and set the Status with it.

| Status | State | Open this file | Move on when |
| --- | --- | --- | --- |
| Not Started | Backlog | none (see "Backlog" below) | the owner asks to start it |
| Preparing | Refining Requirements | `references/refining-requirements.md` | the owner approves the requirements |
| In Progress | Designing | `references/designing.md` | the owner picks a design |
| In Progress | Building | `references/building.md` | every task is done, with proof |
| In Progress | Testing Loop | `references/testing-loop.md` | a separate checker passes it and the owner approves the result |
| In Progress | Reflecting | `references/closing.md` | the checklist in that file is done |
| In Progress | Deploying | `references/deploying.md` | it is merged and deployed |
| Blocked | Blocked | none (see "Blocked" below) | the blocker is cleared |
| Done | Done | none | |
| Cancelled | Cancelled | none | |

A work item moves to the next State only when "Move on when" is true for the State it is in. After Deploying, continue with `references/closing.md`, section "Marking Done".

The checker in the Testing Loop row is the separate agent that tests the finished result.

### Backlog

A work item stays in Backlog until the owner asks to start it.

- Add the idea in the owner's words, as the Original verbatim requirement of Requirement 1.
- Do not start the interview until the owner asks to start the work item. The interview is the set of questions that Refining Requirements asks the owner, one at a time.
- Write a Next action that names the first step for when the owner starts the work item, for example "Agent: when the owner starts this work item, agree its goal with the owner."

### Designing or Building after the requirements

Any work item can go through Designing, even a bug. When you ask the owner to approve the requirements, recommend the next State:

- Recommend Designing when two ways to build the work item differ in what the owner would see, pay for, or have to maintain, or when a mistake in the change would be costly to undo.
- Otherwise, recommend Building.

### A work item that has sub-items

A sub-item is a work item inside another work item, which is its parent. A parent work item stays in Building until every one of its sub-items is Done or Cancelled. Then the parent goes through the Testing Loop as a whole.

### Blocked

- A work item is Blocked when it is stuck on something outside the work, such as missing access, another team, or a piece that must be finished first.
- A work item that waits for the owner's answer is not Blocked.
- Set `waiting_on` to who can clear the blocker.
- When the blocker is cleared, return the work item to the State that its Blockers line names.

### Done and Cancelled

Set a work item to Done or Cancelled only when the owner says so, and only through `references/closing.md`, which gives the steps for closing a work item. A work item that the owner closed by hand goes through that file too.

## Levels

Every project divides its work into the same four levels, wherever it keeps its work items. A top-level work item is a work item with no parent, and a sub-item is a work item inside another work item. `references/work-tracker.md` says where each part is saved.

| Level | Its phases | What it holds |
| --- | --- | --- |
| The project | Project phases `P01`, `P02`, and so on. They are the project's roadmap. | Its top-level work items, each under exactly one project phase. Its project tasks, in one plain list with no phases. |
| Top-level work item (level 1) | Optional phases `P1`, `P2`, and so on, when grouping by outcomes helps plan or track the work. They are the work item's roadmap. | Its tasks and its level-2 sub-items, under phases when it uses them, or in a plain list. |
| Level-2 sub-item | None | One plain task list, and its level-3 sub-items. |
| Level-3 sub-item | None | One plain task list. |

- Never add a fourth level. Make the work a task instead.
- No ID is ever reused. This rule holds for the ID of a work item, a phase, a task, a requirement, and a question.
- When it is unclear whether something is a project task, a new work item, a sub-item, or a task in a work item, ask the owner one short question with your recommendation. Save nothing until the owner answers.

### Phases

A project phase (`P01`) and a work item's phase (`P1`) are different things. A project phase groups top-level work items. A work item's phase groups that work item's tasks and its level-2 sub-items. A phase is never a work item.

- During Refining Requirements, use work-item phases when they help plan or track distinct outcomes. Otherwise, use a plain task list. A level-2 sub-item of a top-level parent without phases has no phase.
- A top-level work item goes under a project phase when the owner places it, and at the latest when it leaves Backlog. When the owner has named no project phase by then, ask which one, with your recommendation.
- The project's phases change only with the owner's yes. Propose new project phases, or a change to them, as one question, with a one-line reason for each new phase and for each change.
- When a project has no phases yet, propose them the first time a work item leaves Backlog.
- When the first work item of a project phase leaves Backlog, set that project phase In Progress.
- When the last open work item in a project phase becomes Done or Cancelled, ask the owner in your next reply whether the project phase is Done.
- A project whose owner has no planned order of work has one project phase, `P01 — Ongoing support`. A project that handles a client's requests as they come in is an example.
  - Propose that phase when the project has no phases yet.
  - While it is the project's only phase, put every top-level work item under it without asking the owner which phase.
  - Never ask whether it is Done. It stays In Progress until the owner says that the support has ended.

### Tasks

- Every task belongs to exactly one place: the project, or one work item.
- A task in a work item is a step toward that work item's goal. Triage work outside the approved goal as a separate Backlog work item. When a defect prevents the approved user flow from working, record the defect and the fix needed to meet the approved requirements in this item. If the fix changes those requirements or an owner decision, get the required approval through Refining Requirements before building it.
- A task ID has one of three forms:
  - `P1-T01` for a new task under a work-item phase: the phase, then the task's number.
  - `T01` for a new task in a plain list, in a top-level item or a sub-item.
  - `PT-01` for a project task.
- Existing task and phase IDs stay unchanged when plan grouping changes.

### Project tasks

A project task is an administrative task that belongs to no work item. These two things are also project tasks:

- a to-do that the owner names or asks you to keep, such as "we need to prepare for Wednesday's call";
- an action item from a meeting or a message that belongs to no work item.

Save a project task in the turn it comes up, with no question to the owner. Fill its lines as follows:

- Its Who does it is `owner`, `agent`, or the name of the other person who owes it, with the party, such as `Sarah Chen (client)` or `DataBridge (vendor)`.
- Its Work line says what is owed and to whom.
- Its Done when holds the date it is due, when a date was named.
- When the project task comes from a source that the owner gave, such as a transcript, file that source first, with no question to the owner. Use `filing-project-records`, step "file a source". Then name the source's SRC ID in the Work line.

Work a project task the way you work a task in a work item: set it In Progress before you start it, and tick it only when its Done when check is met.

Whenever you report what waits on the owner or what other people owe, name each open project task with who does it.

## When to stop for the owner's yes

Stop and ask the owner before each of these six steps. Record the owner's authorization and what it covers. An explicit instruction or an earlier approval for the same scope counts; ask only for an approval that is still missing. Authorization for one step does not authorize another step or a changed result.

When approval is missing, ask a clear question that names what the owner is approving. Choose wording that fits the situation; example questions are not required phrases. Record the question and the owner’s answer with their scope.

1. Approving the requirements, at the end of Refining Requirements.
2. Choosing the design, at the end of Designing.
3. Approving the finished result, at the end of the Testing Loop, after the separate checker has tested it.
4. Each merge into the default branch, in Deploying.
   - A merge that the owner's standing merge instruction in `.claude/rules/owner-preferences.md` covers needs no new yes from the owner. `references/deploying.md`, section "What a merge into the default branch needs", says when the instruction covers a merge.
   - A merge that a helper makes into the work item's own branch needs no yes from the owner. `references/starting-a-helper.md` gives the helper procedure.
5. Each deploy to an environment that other people use, such as a test or staging environment. A production deploy is the owner's to run unless a project rule allows the agent to run it.
   - A deploy that a rule of the project allows without a question needs no new yes from the owner.
6. Marking the work item Done.

A small work item has fewer stops. "A small work item" below says which stops stay.

## A small work item

A small work item is a top-level work item whose whole job you can play back to the owner in one reply, and that you can build and check without an interview, without Designing, and without sub-items. Adding one line to an email template is an example of a small work item. Making one list of records for the owner to load is another.

A small work item takes the short path, unless the owner asks for the full process. The short path is the six steps below. The full path is the process that this skill gives for every other work item.

The goal of the short path is to take a small work item to Done with fewer stops for the owner's yes. It asks one question before the work starts, in place of the interview. It asks one question when the result is ready, where the full path asks three.

Every rule of this skill that the six steps do not change applies to a small work item as it is written. Stops 4 and 5 of "When to stop for the owner's yes" stay: each merge into the default branch, and each deploy to an environment that other people use.

Use your judgment to decide from the owner's request whether the work item is small, before you create it. "Designing or Building after the requirements" above says when a work item needs Designing. The owner's words win over your decision.

1. Create the work item, as `references/refining-requirements.md`, steps 1 and 2, say. Then write what the interview would have written:
   - the goal, in the Overview;
   - for each requirement, its Goal, at least one line of Functional Requirements, and at least one line of Acceptance Criteria that a tester could check;
   - a plain task list, with phases only when they help plan or track the work.
2. Play the request back to the owner in one reply. This reply takes the place of steps 3 to 11 of `references/refining-requirements.md`.
   - Say the goal in concise sentences, what you will hand over, and how you will check it.
   - Name anything you are unsure of.
   - Name the project phase that the work item goes under. When the project has no phases yet, name the phases that you propose, as "Phases" above says.
   - Explain that this small work item takes the short path, skipping the interview and combining result approval and closure in one question at the end.
   - Ask the owner to confirm the request as you described it.

   Add that question as a Questions and Answers row, and set `waiting_on` to the owner, before the reply ends.
3. Record the owner's answer in that row, with the owner's words and the date.
   - After a yes, set `requirements_approved` to `YYYY-MM-DD by <name>`, add the Recent History row "Small item: short path.", and move the work item to Building. The yes approves the requirements and the project phase, as the reply gave them.
   - After a correction, change the work item, and play the request back again in the same form.
4. Build the tasks, as `references/building.md` says. When every task is done, move the work item to the Testing Loop.
5. Check the result, as `references/testing-loop.md`, section "A small work item", says. That section says when the separate checker runs, and what takes its place when it does not run.
6. Ask one closing question, and close the work item after the owner's yes, as `references/closing.md`, section "Closing a small work item", says. That section gives what the question must cover. The owner's yes approves the result, and it is also the yes to mark the work item Done.

When the owner changes or adds a requirement and the work item is still small, record the change as `references/refining-requirements.md`, step 7, says. In place of the approval question of that step, and of the requirements analyst helper that the full path starts after such a change, play the change back in the form of step 2.

A work item on the short path stops being small when the work turns out to need what the short path leaves out: an interview to settle the requirements, Designing, or sub-items. Then move it to the full path:

- Tell the owner in one line.
- Add the Recent History row "Short path ended: full path from <State>.", with the State that the work item is in when it leaves the short path.
- Set `delivery` to `not-offered`, unless a Questions and Answers row whose Affects column says `delivery` holds the owner's answer.
- Continue with the file for that State. A work item that needs a design moves to Designing, also from Building. The owner's approval of the requirements still counts.

## Rules that apply in every State

These rules apply every time you work on a work item, in every State.

### Read the work item before you act

Read the work item again with `references/work-tracker.md` before you act. When the owner changed the work item by hand, keep the owner's change.

The one exception is a State and a Status that no longer match the table in "Status and State". Tell the owner in one line, ask which State the work item is in, with your recommendation, and then set both.

### Save after each step

Save after each step, and not at the end.

When a save fails or cannot be verified, follow [reporting a save](reporting-a-save.md).

### Keep the whole work item true

While you work on a work item, keep the whole work item true, and not only its Current state. Keep these true as well: the status of each task and who does it, the status of each of the work item's phases, and every field you have information for.

- Save the owner's requirements and corrections before you go on. Save them in the work item, or in the work item's design when they change the design.
- When the work item waits on the owner, write Next action in the form that the work item template, `assets/work-item-template.md`, gives for a work item that waits, with the first open question.
- When Next action disagrees with the work item's fields, the fields are right. Rewrite Next action to match the work item's status, its State, its `waiting_on`, its approvals, and its ticked tasks.
- A work item keeps its requirements approval when it moves to a later State.
- Before you end work that is not finished, rewrite the work item's Current state so that its Next action names the exact next step.

### A work item that waits for a shared open question

A shared open question is an open question that more than one work item needs, kept where the root `AGENTS.md`, section "Where information goes", says. A work item that cannot continue until a shared open question is answered waits on the owner.

- Set `waiting_on` to the owner.
- Write Next action in the form that the work item template, `assets/work-item-template.md`, gives for a work item that waits. Put the ID or link of the shared open question in place of the Q-ID, which is the ID of a question in the work item. Never copy the question into a second shared record.
- When the question is decided, continue from the work item's State.

### Active work in the project's memory

When work on a work item starts, when its next step or what it waits on changes, and when it closes, follow `references/project-memory-steps.md`, section "Keeping active work current". The project's memory choice supplies that file.

### Never delete a part of a work item

Never delete a requirement, a question row, or a phase record. Mark it dropped, superseded, or cancelled. When a work item changes level or plan grouping, use the tracker's conversion procedure to preserve each phase record in Recent History before removing its layout.

### A work item from an older template

A work item that was made from an older template keeps its layout. Read it as it is. When a step needs a field of the current template, add that field. Move the work item to the current layout only when the owner asks.

### Text in angle brackets

Text in angle brackets is a prompt, and never content. The templates hold prompts, such as `<What happened>`, that say what to write in that place.

- No work item that you created or changed keeps a prompt. Replace each prompt with real content, or delete it and keep its heading or label.
- Delete, whole, an example row, an example task, or an example requirement block that is made only of prompts.
- Real content may hold angle brackets, for example code such as `Map<Id, Account>`.
- A design keeps its prompts until it is approved. `references/designing.md` says when they are removed.

### How the rule to evaluate the owner's request applies in a work item

The rule `.claude/rules/evaluate-the-owners-request.md` asks you to state the goal and to check a request against the whole project before you act. In a work item, follow the rule through the steps of this skill, and do each check once. The reply that agrees the goal with the owner is the rule's statement of the goal. Raise what the rule asks you to raise as a question or as a design option, in the form that the step gives.

## Work that another skill does

This table names where to read or save each kind of record and which skill handles each neighbouring job.

| For | Use |
| --- | --- |
| Every read and every save of a work item, a project phase, or a project task | Follow `references/work-tracker.md` in this skill. |
| A decision or an open question that more than one work item needs | `filing-project-records`, step "record a decision" |
| A source that the owner gives: a transcript, a document, a file, or pasted text | `filing-project-records`, step "file a source" |
| A system rule to add, change, retire, or mark Built, or a project term | `filing-project-records`, step "update a system document" |
| Writing the work item in the project's current state; removing what is no longer true from it when a work item closes; a date or a deadline; a lesson to keep or to search for | Project memory, as the root `AGENTS.md` says |
| An instruction for how the agent works | `.claude/rules/owner-preferences.md`, with the steps that "Project memory" in the root `AGENTS.md` names |
| Merging a pull request | `merge-and-clean-up` |
| Committing a change to documents only | `publish-docs` |
| Pull request text, and release notes that go to a client | `humanizer`, as the root `AGENTS.md`, "How to write text that goes to another person or is client/customer facing", says |

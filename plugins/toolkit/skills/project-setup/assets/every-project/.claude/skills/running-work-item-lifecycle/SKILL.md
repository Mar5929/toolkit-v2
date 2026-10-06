---
name: running-work-item-lifecycle
description: 'Runs one work item from idea to Done through requirements, design, build, testing, deployment, and closing, keeping the work item current and stopping for the owner''s yes before each step that needs one. Use when the owner asks to plan, change, build, test, deploy, close, or cancel a work item, or asks whether one is ready for its next step, such as "is WI-12 ready to test". Not for filing a source, or a decision or rule more than one work item needs; use filing-project-records.'
---

# Running a work item's lifecycle

Use this skill to take one work item from an idea to Done. The goal is that the work item always says truly where the work stands, and that no step that needs the owner's yes happens without it.

This skill says what each State means, how work is divided into levels, what to do in each State, and when to stop for the owner's yes. Two neighbouring jobs belong to other skills:

- **Reading and saving a work item.** For every read and every save, use `using-work-tracker`, which knows where this project keeps its work items.
- **Writing `DECISIONS.md`, `system/`, or `sources/`.** `filing-project-records` writes those three places, and it also writes the ID of one of their records into a work item. Never write those three places, or such an ID, with this skill. The root `AGENTS.md`, section "Where information goes", gives the test for what belongs in those three places.
  - When a work item must follow a rule or a decision that already exists, give the ID of the rule or decision and the work item to `filing-project-records`. It writes the ID into the work item.

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
- Write a Next action that names the first step for when the owner starts the work item, for example "Agent: when the owner starts this item, agree its goal with him."

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

Every project divides its work into the same four levels, wherever it keeps its work items. A top-level work item is a work item with no parent, and a sub-item is a work item inside another work item. `using-work-tracker` says where each part is saved.

| Level | Its phases | What it holds |
| --- | --- | --- |
| The project | Project phases `P01`, `P02`, and so on. They are the project's roadmap. | Its top-level work items, each under exactly one project phase. Its project tasks, in one plain list with no phases. |
| Top-level work item (level 1) | Its own phases `P1`, `P2`, and so on. They are the work item's roadmap. It has at least one phase, even when it is small. | Its tasks and its level-2 sub-items, each under one of its phases. |
| Level-2 sub-item | None | One plain task list, and its level-3 sub-items. |
| Level-3 sub-item | None | One plain task list. |

- Never add a fourth level. Make the work a task instead.
- No ID is ever reused. This rule holds for the ID of a work item, a phase, a task, a requirement, and a question.
- When it is unclear whether something is a project task, a new work item, a sub-item, or a task in a work item, ask the owner one short question with your recommendation. Save nothing until the owner answers.

### Phases

A project phase (`P01`) and a work item's phase (`P1`) are different things. A project phase groups top-level work items. A work item's phase groups that work item's tasks and its level-2 sub-items. A phase is never a work item.

- A top-level work item gets its own phases in Refining Requirements.
- A top-level work item goes under a project phase when the owner places it, and at the latest when it leaves Backlog. When the owner has named no project phase by then, ask which one, with your recommendation.
- The project's phases change only with the owner's yes. Propose new project phases, or a change to them, as one question, with a one-line reason for each new phase and for each change.
- When a project has no phases yet, propose them the first time a work item leaves Backlog.
- When the first work item of a project phase leaves Backlog, set that project phase In Progress.
- When the last open work item in a project phase becomes Done or Cancelled, ask the owner in your next reply whether the project phase is Done.

### Tasks

- Every task belongs to exactly one place: the project, or one work item.
- A task in a work item is a step toward that work item's goal. Work that the goal does not need is a new Backlog work item, and never a task in this work item. This rule holds even for a small fix found along the way.
- A task ID has one of three forms:
  - `P1-T01` in a top-level work item: the work item's phase, then the task's number.
  - `T01` in a sub-item.
  - `PT-01` for a project task.

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

Stop and ask the owner before each of these six steps. Record the owner's yes only when the owner answers the question you asked.

1. Approving the requirements, at the end of Refining Requirements.
2. Choosing the design, at the end of Designing.
3. Approving the finished result, at the end of the Testing Loop, after the separate checker has tested it.
4. Each merge into the default branch, in Deploying.
   - A merge that the owner's standing merge permission in `.claude/rules/owner-preferences.md` covers needs no new yes from the owner.
   - A merge that a helper makes into the work item's own branch needs no yes from the owner. "Starting a helper" below says what a helper is.
5. Each deploy to an environment that other people use, such as a test or staging environment. A production deploy is the owner's to run.
6. Marking the work item Done.

## Every time

These rules apply every time you work on a work item, in every State.

### Read the work item before you act

Read the work item again with `using-work-tracker` before you act. When the owner changed the work item by hand, keep the owner's change.

The one exception is a State and a Status that no longer match the table in "Status and State". Tell the owner in one line, ask which State the work item is in, with your recommendation, and then set both.

### Save after each step

Save after each step, and not at the end.

- When a save fails, start the reply with "Not saved".
- When a save worked but reads back differently, start the reply with "Saved but not verified" and say what differs.

### A work item that waits for an answer in `DECISIONS.md`

A work item that cannot continue until an Open entry in `DECISIONS.md` is answered waits on the owner.

- Set `waiting_on` to the owner.
- Write Next action in the form that the work item template, `assets/work-item-template.md`, gives for a work item that waits. Put the DEC ID, which is the ID of the entry in `DECISIONS.md`, in place of the Q-ID, which is the ID of a question in the work item.
- When the entry is Decided, continue from the work item's State.

### The work item's line in the project's Current State

The project's Current State is the project's one short page of what is true now. It holds one line for a work item from the time the work item leaves Backlog until it is Done or Cancelled.

- Decide the line in this skill, in the form that the project's memory gives for a line under Now. Now is one of the parts of the project's Current State.
- Add, change, or remove the line as the table in "Work that another skill does" says.
- In the same write, make "Next session starts with" name the work item: its ID and "read its Current state". A work item's Current state is the five lines at the top of the work item that say where it stands.

### Never delete a part of a work item

Never delete a requirement, a question row, or a phase. Mark it dropped, superseded, or cancelled.

### A work item from an older template

A work item that was made from an older template keeps its layout. Read it as it is. When a step needs a field of the current template, add that field. Move the work item to the current layout only when the owner asks.

### Text in angle brackets

Text in angle brackets is a prompt, and never content. The templates hold prompts, such as `<What happened>`, that say what to write in that place.

- No work item that you created or changed keeps a prompt. Replace each prompt with real content, or delete it and keep its heading or label.
- Delete, whole, an example row, an example task, or an example requirement block that is made only of prompts.
- Real content may hold angle brackets, for example code such as `Map<Id, Account>`.
- A design keeps its prompts until it is approved. `references/designing.md` says when they are removed.

## Starting a helper

A helper is a separate agent that the main agent starts for one job. Start every helper as a new agent that does not see this session. Never start a helper as a fork, which is a helper that starts with a copy of this session.

- In Claude Code, use the Agent tool, with `subagent_type` set to `general-purpose` and `model` set to `opus`.
- In Codex, use the `spawn_agent` tool with `fork_turns` set to `none`. Wait for the helper's report with `wait_agent`.
- The message to the helper is everything under "Brief for the helper" in the helper's brief file, word for word, and then the list of inputs from that file, filled in. The References table below lists the brief file of each helper. The helper sees nothing else.

## Work that another skill does

This table names the skill for each job that this skill does not do itself.

| For | Use |
| --- | --- |
| Every read and every save of a work item, a project phase, or a project task | `using-work-tracker` |
| A decision or an open question that more than one work item needs | `filing-project-records`, step "record a decision" |
| A source that the owner gives: a transcript, a document, a file, or pasted text | `filing-project-records`, step "file a source" |
| A rule in `system/` to add, change, retire, or mark Built | `filing-project-records`, step "update a system document" |
| Writing the work item's line in the project's Current State | `using-memory-store`. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in its place. |
| Removing the other lines of the project's Current State that are no longer true, when a work item closes; a date or a deadline; a lesson to keep or to search for; an instruction for how the agent works | `curating-project-memory`. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in its place. |
| Merging a pull request | `merge-and-clean-up` |
| Committing a change to documents only | `publish-docs` |
| A Salesforce platform question | Salesforce's skills |
| Salesforce: updating the component tracker | `sf-component-tracker` |
| Salesforce: checking a deploy to a shared org | `sf-deploy-check` |
| Salesforce: a production data change | `sf-data-change` |
| Pull request text, and Salesforce release notes that go to a client | `humanizer`, as `.claude/rules/humanize-outbound-text.md` says |

## References

| File | Open it when |
| --- | --- |
| [references/refining-requirements.md](references/refining-requirements.md) | The work item is in Refining Requirements, or a requirement changes in any State. |
| [references/designing.md](references/designing.md) | The work item is in Designing. |
| [references/building.md](references/building.md) | The work item is in Building, or the owner wants a team of helper agents. |
| [references/testing-loop.md](references/testing-loop.md) | The work item is in the Testing Loop. |
| [references/closing.md](references/closing.md) | The work item is in Reflecting, is being marked Done or Cancelled, or was closed by the owner by hand. |
| [references/deploying.md](references/deploying.md) | The work item is in Deploying. |
| [references/salesforce-deploying.md](references/salesforce-deploying.md) | You deploy in a Salesforce project. |
| [references/requirements-analyst-brief.md](references/requirements-analyst-brief.md) | You start the helper that checks that the requirements are complete. |
| [references/researcher-brief.md](references/researcher-brief.md) | You start a helper to look up a fact for planning or design. |
| [references/design-architect-brief.md](references/design-architect-brief.md) | You start a helper to write one design option. |
| [references/design-critic-brief.md](references/design-critic-brief.md) | You start a helper to check a design against every requirement. |
| [references/builder-brief.md](references/builder-brief.md) | You start a helper to build one sub-item. |
| [references/acceptance-checker-brief.md](references/acceptance-checker-brief.md) | You start the separate checker in the Testing Loop. |
| [assets/work-item-template.md](assets/work-item-template.md) | You create a work item, or check what a field or a section should hold. |
| [assets/design-template.md](assets/design-template.md) | You start a design. |

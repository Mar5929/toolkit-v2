---
name: managing-work-items
description: 'Runs every work item in this project from idea to Done: refining requirements by interview, designing, building, the testing loop, reflecting, and deploying, and stops for the owner''s OK at each approval point. Use this whenever the owner mentions a work item, a feature, a bug, a plan, requirements, a design, a build, testing, or shipping, even if he does not name this skill.'
---

# Managing work items

This skill holds the process: what each state means, how work is split into levels, what to do in each state, and when to stop for the owner's OK. It never says where items are saved. For every read and every save, use `tracking-work-items`.

## Status and State

Every item has a Status and a State. The State says where the work is. The Status follows from the State, so set the State and the Status with it.

| Status | State | Open this file | Move on when |
| --- | --- | --- | --- |
| Not Started | Backlog | none (below) | the owner asks to start it |
| Preparing | Refining Requirements | `references/refining-requirements.md` | the owner approves the requirements |
| In Progress | Designing | `references/designing.md` | the owner picks a design |
| In Progress | Building | `references/building.md` | every task is done, with proof |
| In Progress | Testing Loop | `references/testing-loop.md` | a separate checker passes it and the owner approves the result |
| In Progress | Reflecting | `references/reflecting.md` | its checklist is done |
| In Progress | Deploying | `references/deploying.md` | it is merged and deployed, and the owner marks it Done |
| Blocked | Blocked | none (below) | the blocker is cleared |
| Done | Done | none | |
| Cancelled | Cancelled | none | |

- An item moves to the next State only when "Move on when" is true for the State it is in.
- Any item, a bug included, can go through Designing. When asking him to approve the requirements, recommend the next State: Designing when there is more than one sensible way to build it or the change is risky, otherwise Building.
- A parent item stays in Building until every sub-item is Done or Cancelled. Then it goes through the Testing Loop as a whole.
- An item with nothing to merge or deploy (research, a decision, a document) goes from Reflecting straight to asking him to mark it Done.
- **Backlog:** add the idea in his words, as the Original verbatim requirement of Requirement 1, and do not start the interview until he asks to start it. Its Next action is in the template's Working form and names the first step for when he starts it, for example "Agent: write the requirements from the owner's description and ask for his OK."
- **Blocked:** stuck on something outside the work, such as missing access, another team, or a piece that must be finished first. Waiting for the owner's answer is not Blocked. Write what it waits on, who can clear it, and the State it left, in the Current state's Blockers line. When it is cleared, return to that State.
- **Done and Cancelled:** only on his word. Cancelling keeps the item and every record in it.

## Levels

Every project holds its work in the same four levels, whatever its tracker. `tracking-work-items` says where each part is saved.

| Level | Its phases | What it holds |
| --- | --- | --- |
| The project | Project phases `P01`, `P02`, and so on: the project's roadmap | Its top-level items, each under exactly one project phase. Its project tasks: administrative tasks that belong to no work item, in one plain list with no phases. |
| Top-level item (level 1) | Its own phases `P1`, `P2`, and so on: the item's roadmap. At least one phase, even for a small item | Its tasks and its level-2 sub-items, each under one of its phases. |
| Level-2 sub-item | None | One plain task list, and its level-3 sub-items. |
| Level-3 sub-item | None | One plain task list. |

- A project phase (`P01`) and an item's phase (`P1`) are different things. A project phase groups top-level items. An item's phase groups that item's tasks and level-2 sub-items. A phase is never a work item.
- Every task belongs to exactly one place: the project, or one work item. A task in an item is a step toward that item's goal. Work the goal does not need, even a small fix found along the way, is a new Backlog work item, never a task here. A project task is administrative work for the project as a whole, for example renewing a domain or inviting a collaborator.
- Task IDs: `P1-T01` in a top-level item (its phase, then its number), `T01` in a sub-item, and `PT-01` for a project task. IDs are never reused.
- Work a project task like an item's task: set it In Progress before you start it, and tick it only when its Done when check is met. An open project task whose Who does it is `owner` waits on the owner: name it whenever you report what waits on him.
- Never add a fourth level; make it a task instead.
- When it is unclear whether something is a project task, a new work item, a sub-item, or a task in an item, ask the owner one short question with your recommendation, and save nothing until he answers.
- A top-level item gets its phases in Refining Requirements. It goes under a project phase when the owner places it, and at the latest when it leaves Backlog; when he has named none by then, ask which, with your recommendation. Until it has one, its Related items line says "No project phase yet."
- The project's phases change only with his yes. Propose new phases, or a change to them, as one question, each with a one-line reason. A project with no phases yet: propose them the first time an item leaves Backlog.
- Set a project phase In Progress when its first item leaves Backlog. When the last open item in it becomes Done or Cancelled, ask him in your next reply whether the phase is Done.

## The owner's OK

Stop and ask the owner before each of these. Record his OK only when he answers the question you asked.

1. Approving the requirements, at the end of Refining Requirements.
2. Choosing the design, at the end of Designing.
3. Approving the finished result, at the end of the Testing Loop, after the separate checker has tested it.
4. Each merge into the main branch, in Deploying, unless his standing merge permission in `.claude/rules/owner-preferences.md` covers it. A helper agent's merge into the item's own branch needs no OK.
5. Each deploy to an environment other people use, such as a test or staging environment. A production deploy is his to run.
6. Marking the item Done.

## Every time

- Read the item fresh with `tracking-work-items` before you act. When the owner changed it by hand, his change wins, except a State and Status that no longer match the table: tell him in one line, ask which State it is with your recommendation, then set both.
- Save after each step, not at the end, then read the item back. When a save fails, start the reply with "Not saved".
- After each step, rewrite the item's Current state in place, as the template says.
- The project's Current State lists under "Now" every item that has left Backlog and is not Done or Cancelled: add the item's line when it leaves Backlog ("Hand-offs", "Updating the project's Current State").
- Never delete a requirement, a question row, or a phase. Mark it dropped, superseded, or cancelled.
- **Text in angle brackets is an instruction, never content.** A work item template holds prompts in angle brackets (`<What happened>`) that say what to write there. Whenever you create or change an item, replace each prompt with real content, or delete it when there is nothing to write yet, so no item you have touched holds one. Delete only the prompt and keep its heading or label: a requirement's Goal with nothing to write yet stays as its label line alone, and is filled when the requirement is refined. An example row, task, or requirement block made only of prompts goes whole. Delete any note for the agent that the template holds, as `tracking-work-items` says. Write the next requirement, row, or task in the form `tracking-work-items` gives, never by copying a prompt left on a page. The rule covers only the template's own prompts: real content may hold angle brackets (code such as `Map<Id, Account>`). The template itself keeps its prompts, and the design keeps its own until it is approved (`references/designing.md`).

## Starting a helper

Start every helper as a new helper that does not see this conversation. Never a fork.

- Claude Code: the Agent tool, `subagent_type` set to `general-purpose` and `model` set to `opus`.
- Codex: the `spawn_agent` tool with `fork_turns` set to `none`. Wait for its report with `wait_agent`.
- The message: everything under "Brief for the helper" in the helper's file, word for word, then the job block, filled in. The helper sees nothing else.

## Hand-offs

| For | Use |
| --- | --- |
| Every read and every save of a work item, a project phase, or a project task | `tracking-work-items` |
| Searching what the project already decided | `managing-project-memory` (Hindsight: `AGENTS.md`, "Project memory") |
| Saving a decision that matters beyond this item | `managing-project-memory` (Hindsight: `AGENTS.md`, "Project memory") |
| Updating the project's Current State | edit `memory/CURRENT_STATE.md` when the project has that file, otherwise `managing-project-memory` |
| Merging a pull request | `merge-and-clean-up` |
| Saving a change to documents only | `publish-docs` |
| A Salesforce platform question | Salesforce's skills |
| Salesforce: updating the component tracker | `sf-component-tracker` |
| Salesforce: checking a deploy to a shared org | `sf-deploy-check` |
| Salesforce: a production data change | `sf-data-change` |
| Pull request text, and Salesforce release notes that go to a client | `humanizer` (`.claude/rules/humanize-outbound-text.md`) |

## Files

| File | Open it when |
| --- | --- |
| [references/refining-requirements.md](references/refining-requirements.md) | The item is in Refining Requirements, or a requirement changes in any State. |
| [references/designing.md](references/designing.md) | The item is in Designing. |
| [references/building.md](references/building.md) | The item is in Building, or the owner wants a team of helper agents. |
| [references/testing-loop.md](references/testing-loop.md) | The item is in the Testing Loop. |
| [references/reflecting.md](references/reflecting.md) | The item is in Reflecting. |
| [references/deploying.md](references/deploying.md) | The item is in Deploying, or is being marked Done or Cancelled. |
| [references/salesforce-deploying.md](references/salesforce-deploying.md) | Deploying in a Salesforce project. |
| [references/requirements-analyst-brief.md](references/requirements-analyst-brief.md) | Starting the helper that checks the requirements are complete. |
| [references/researcher-brief.md](references/researcher-brief.md) | Starting a helper to look up a fact for planning or design. |
| [references/design-architect-brief.md](references/design-architect-brief.md) | Starting a helper to write one design option. |
| [references/design-critic-brief.md](references/design-critic-brief.md) | Starting a helper to check a design against every requirement. |
| [references/builder-brief.md](references/builder-brief.md) | Starting a helper to build one sub-item. |
| [references/acceptance-checker-brief.md](references/acceptance-checker-brief.md) | Starting the separate checker in the Testing Loop. |
| [assets/work-item-template.md](assets/work-item-template.md) | Creating an item, or checking what a field or section should hold. |
| [assets/design-template.md](assets/design-template.md) | Starting a design. |

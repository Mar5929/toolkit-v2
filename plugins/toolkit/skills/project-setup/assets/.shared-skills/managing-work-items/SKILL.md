---
name: managing-work-items
description: 'Runs every work item in this project from idea to Done: refining requirements by interview, designing, building, the testing loop, reflecting, and deploying, and stops for the owner''s OK at each approval point. Use this whenever the owner mentions a work item, a feature, a bug, a plan, requirements, a design, a build, testing, or shipping, even if he does not name this skill.'
---

# Managing work items

This skill holds the process: what each state means, what to do in it, and when to stop for the owner's OK. It never says where items are saved. For every read and every save, use `tracking-work-items`.

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
- **Backlog:** add the idea in his words and do not start the interview until he asks to start it.
- **Blocked:** stuck on something outside the work, such as missing access, another team, or a piece that must be finished first. Waiting for the owner's answer is not Blocked. Write what it waits on and who can clear it. When it is cleared, return to the State it was in.
- **Done and Cancelled:** only on his word. Cancelling keeps the item and every record in it.

## The owner's OK

Stop and ask the owner before each of these. Record his OK only when he answers the question you asked.

1. Approving the requirements, at the end of Refining Requirements.
2. Choosing the design, at the end of Designing.
3. Approving the finished result, at the end of the Testing Loop, after the separate checker has tested it.
4. Each merge into the main branch, in Deploying, unless his standing merge permission in `.claude/rules/owner-preferences.md` covers it. A helper agent's merge into the item's own branch needs no OK.
5. Marking the item Done.

## Every time

- Read the item fresh with `tracking-work-items` before you act. When the owner changed it by hand, his change wins.
- Save after each step, not at the end, then read the item back. When a save fails, start the reply with "Not saved".
- After each step, rewrite the item's Current state in place, as the template says.
- Never delete a requirement, a question row, or a phase. Mark it superseded or cancelled.
- Levels: an item can stand alone or have sub-items, up to three levels (item → sub-item → sub-item). Any item can break its work into a checklist of tasks, grouped by phase. Never add a fourth level; make it a task instead.

## Hand-offs

| For | Use |
| --- | --- |
| Every read and every save of a work item | `tracking-work-items` |
| Searching what the project already decided, and saving a decision that matters beyond this item | `managing-project-memory` |
| A merge | `managing-git-changes` |
| A Salesforce platform question | `sf-architect-solutioning` |

## Files

| File | Open it when |
| --- | --- |
| [references/refining-requirements.md](references/refining-requirements.md) | The item is in Refining Requirements, or a requirement changes in any State. |
| [references/designing.md](references/designing.md) | The item is in Designing. |
| [references/building.md](references/building.md) | The item is in Building, or the owner wants a team of helper agents. |
| [references/testing-loop.md](references/testing-loop.md) | The item is in the Testing Loop. |
| [references/reflecting.md](references/reflecting.md) | The item is in Reflecting. |
| [references/deploying.md](references/deploying.md) | The item is in Deploying. |
| [references/salesforce-deploying.md](references/salesforce-deploying.md) | Deploying in a Salesforce project. |
| [references/requirements-analyst-brief.md](references/requirements-analyst-brief.md) | Starting the helper that checks the requirements are complete. |
| [references/researcher-brief.md](references/researcher-brief.md) | Starting a helper to look up a fact for planning or design. |
| [references/design-architect-brief.md](references/design-architect-brief.md) | Starting a helper to write one design option. |
| [references/design-critic-brief.md](references/design-critic-brief.md) | Starting a helper to check a design against every requirement. |
| [references/builder-brief.md](references/builder-brief.md) | Starting a helper to build one sub-item. |
| [references/acceptance-checker-brief.md](references/acceptance-checker-brief.md) | Starting the separate checker in the Testing Loop. |
| [assets/work-item-template.md](assets/work-item-template.md) | Creating an item, or checking what a field or section should hold. |
| [assets/design-template.md](assets/design-template.md) | Starting a design. |

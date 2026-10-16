---
name: managing-work-items
description: 'Manages work items from idea to Done: requirements, State, progress, and owner approvals. Use when the owner asks about, starts, continues, changes, tests, ships, closes, or cancels a work item, or changes project phases or project tasks. For shared decisions, sources, and system rules, use filing-project-records.'
---

# Managing work items

Keep every work item true to where the work stands, and never take a step that needs the owner's yes without it.

## Always

- To find the work item a turn is about, check in this order and stop at the first check that finds one: the work item the owner names, the one this branch or session is working on, and the one the work tracker or the project's current state shows in progress. Ask the owner only when a check finds two.
- Read the work item before you act on it. The owner edits work items by hand, and their edits win.
- Save after each step, not at the end. A new session must be able to resume from the work item alone.
- Never delete a requirement, question, or phase. Mark it dropped, superseded, or cancelled.
- Helpers start fresh, never forked (Claude Code: the Agent tool, general-purpose; Codex: spawn_agent with fork_turns none, then wait_agent), and get only their brief.

## Where to look

| When you need to… | Read |
| --- | --- |
| Know the States, the approvals, or the short path for a small item | `references/lifecycle.md` |
| Organize items, sub-items, phases, or tasks | `references/work-levels.md` |
| Report where the project stands, what waits on the owner, or which work item to start next | `references/project-status.md` |
| Refine requirements, change one, or work from a source | `references/refining-requirements.md` |
| Design: options, research, the critic, and the owner's choice | `references/designing.md` |
| Build: tasks, the item's branch and worktree, who builds, and running builders | `references/building.md` |
| Choose one team in this chat or a Main Orchestrator across chats, after the owner authorizes agent delivery | `references/team-arrangement.md` |
| Test: the acceptance checker and the owner's approval of the result | `references/testing-loop.md` |
| Reflect, record what the project keeps, mark Done, close a small item, cancel, or handle an item closed by hand | `references/closing.md` |
| Open a pull request, merge, or deploy | `references/deploying.md` |
| Read, create, find, or save a work item | `references/work-tracker.md` |
| Start a helper | Its brief: `references/requirements-analyst-brief.md`, `researcher-brief.md`, `design-architect-brief.md`, `design-critic-brief.md`, `builder-brief.md`, or `acceptance-checker-brief.md`. The current State's procedure says which. |
| Note that work on an item started, its next step or wait changed, or it closed | The `managing-project-memory` skill |

Shared decisions, sources, and system rules belong to `filing-project-records`, not this skill.

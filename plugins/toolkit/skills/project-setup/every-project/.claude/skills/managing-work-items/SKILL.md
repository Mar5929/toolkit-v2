---
name: managing-work-items
description: 'Manages work items from idea to Done: requirements, State, progress, and owner approvals. Use when the owner asks about, starts, continues, changes, tests, ships, closes, or cancels a work item, or changes project phases or project tasks. For shared decisions, sources, and system rules, use filing-project-records.'
---

# Managing work items

Keep every work item true to where the work stands, and never take a step that needs the owner's yes without it.

## Always

- Read the work item before you act on it. The owner edits work items by hand, and their edits win.
- Save after each step, not at the end. A new session must be able to resume from the work item alone.
- Keep State, Status, tasks, `waiting_on`, and Next action current.
- When you interview the owner, save each question and answer to the work item as it happens.
- Never delete a requirement, question, or phase. Mark it dropped, superseded, or cancelled.
- Helpers start fresh, never forked (Claude Code: the Agent tool, general-purpose; Codex: spawn_agent with fork_turns none, then wait_agent), and get only their brief from the matching `references/*-brief.md`.

## Where to look

| When you need to… | Read |
| --- | --- |
| Know the States, the approvals, or the short path | `references/lifecycle.md` |
| Organize items, sub-items, phases, or tasks | `references/work-levels.md` |
| Refine requirements, or change one | `references/refining-requirements.md` |
| Design, build, test, close, or deploy | The file `lifecycle.md` names for that State |
| Read, create, find, or save a work item | `references/work-tracker.md` |
| Note that work on an item started, its next step or wait changed, or it closed | The `managing-project-memory` skill |
| Start a helper | Its brief in `references/` |

Shared decisions, sources, and system rules belong to `filing-project-records`, not this skill.

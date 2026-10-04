# Prompt for the next session: Notion work tracker

Mike's request of 2026-09-29, organized from a voice note. Run it in a new
Claude Code session opened in the toolkit-v2 folder, after the current goal
in `dev/GOAL.md` is met.

```text
Goal: refine Toolkit V2's Notion work tracker into a lightweight alternative to Linear, Jira, or GitHub Issues in my personal Notion. An AI agent keeps it up to date; I make the decisions.

Start from what exists; do not build a second tracker:
- Code: plugins/toolkit/lib/notion/ (Notion tracker driver, ensure-root, ensure-project).
- Design notes: dev/archive/research/notion-design.md; what was built on my page: dev/test-runs/notion-after.md.
- Templates: plugins/toolkit/scaffold/model/.work-items/work-item-template/WORK-ITEM.md (work item body) and DESIGN.md (solution design).
- Statuses and stages: run `toolkit work lifecycle`. Keep them.
- My decisions: dev/GOAL.md. Current state: dev/PROGRESS.md. Follow AGENTS.md.

What I want:
1. Structure
   - Projects at the top. Every work item belongs to exactly one project; items never span projects.
   - Up to three levels of work items: a parent item, child items, and grandchild items. Most items will not use all three. Do not call the top level an "epic".
   - Tasks are a Notion checklist inside a work item's body, mainly in the lowest-level items.
2. Views: a Kanban board, a table, and a roadmap view built from the links between items.
3. Properties: status (the toolkit's list), tags, parent/child links, links to related items (for the roadmap), and file attachments. No assignee (everything is mine), no points, no effort, no time tracking.
4. Body and design
   - Each item's body follows the WORK-ITEM.md template: overview, goal, who asked and why, roadmap with phases, tasks per phase, and so on. The agent must keep every part of the body current.
   - Each work item has one Solution Design page from the DESIGN.md template. It may have its own subpages.
5. Agent notes: the agent can add comments and notes to an item, separate from the body.
6. Phases
   - A phase groups child items under a parent. A phase is not a work item itself.
   - Plans change midway: phases get added, dropped, merged, or reordered. Moving items between phases and updating the roadmap must be easy for the agent.
7. How I work with agents: one chat is the main orchestrator for a parent item or a single item. It runs subagents or a team, which map to child items or tasks. The orchestrator keeps every status current, including the items and tasks its subagents work on.
8. Keep it simple. Consider synced blocks or any other Notion feature only if it clearly helps the orchestrator; do not over-engineer.

How to proceed:
- Play back your understanding first.
- Then propose the data model, with a recommendation and its tradeoffs. Answer especially: how to model phases vs. child items; one work-items database per project (today's toolkit design) or one shared database with a Project link; how the roadmap view works; how comments and files are used.
- Ask me one question at a time, only where the decision is mine.
- Build it only after I approve the design: in my personal Notion through the ntn CLI, update the toolkit's Notion driver and its tests, then test it live with a sample project.
```

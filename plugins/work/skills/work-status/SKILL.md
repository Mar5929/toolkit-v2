---
name: work-status
description: 'Answers "where are we", "what''s next", and "catch me up": shows active work items, their progress and blockers, the recommended next step, and how many decisions wait on the owner. Use when the owner asks for project status, progress on one item, or what comes next. Changes nothing.'
---

# Work status

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md`. This skill only reads. It never changes an item, memory, or a file.

## Steps

1. Use the session briefing if this conversation already has it and nothing changed since. Otherwise run:
   `toolkit brief`
2. The owner named an item or an area: answer about that item only. Say where it stands in plain words, what is done and what is left in its Roadmap, its blockers, and its next action.
   `toolkit work show <id>`
3. The whole project: read the tree, the recommended next item, the decisions waiting on the owner, and the current focus.
   `toolkit work list --tree`
   `toolkit work next`
   `toolkit work decisions`
   `toolkit memory focus`
4. Answer in this order: how many decisions wait on the owner (one line each), what is in progress, the recommended next item and why, what was done recently, and anything moved or broken.
5. Show every stage in plain words with the item id ("WI-012 is in testing"). The plain labels come from:
   `toolkit work lifecycle`
6. For each problem, name the skill that fixes it without running it: moved or missing items, `work-organize`; setup warnings, `project-setup`; decisions, `work-decide`. "Show the board": with the local tracker, summarize `.work-items/DASHBOARD.md`; with Notion, give the link to the project's Work Items board from the Notion ids in the configuration.
   `toolkit config get notion`
7. Change nothing. End with one thing the owner can say next, for example "Say 'what do you need from me' to go through the 2 decisions."

## How to answer

- Lead with the answer, not with how you found it.
- Decisions first, because only the owner can unblock them. Give the count and one line each: the item id, what is being decided, and how long it has waited when the record shows it.
- One line per item in progress: id, title, plain stage, what is left, and who it waits on.
- The recommended next item comes from the briefing or the `next` command. Say why in one line.
- Recently done: items finished since the last session, when the record shows it. Skip it when there are none.
- Keep the whole answer short. The owner can ask about one item for detail.

## Tracker notes

- GitHub Issues or Jira: the `toolkit work` commands exit with code 3. Read the items with the tracker's own tool (`../../references/trackers.md`) and answer in the same order.
- An item in `archive/` is hidden from the briefing and from the recommended next item. Mention archived items only when the owner asks.
- Nothing is tracked yet: say so in one line and offer `work-on` for the first piece of work.

## Not this skill

- "What did we do in this chat": `session-summary`.
- "What do you need from me": `work-decide`, which walks through each decision.
- "What did we decide about X": `memory-find`.

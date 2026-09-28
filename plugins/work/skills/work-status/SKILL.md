---
name: work-status
description: 'Reports where the project''s work items stand: progress, blockers, the next item, and decisions waiting on the owner. Use whenever the owner asks about project or item status, even one item, for example "where are we", "what''s next", or "is X done yet". Not for a chat recap; use session-summary.'
---

# Work status

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Reports where the work stands. This skill only reads: apart from the CLI's own sync (the history rows it writes for the owner's hand moves), it never changes an item, memory, or a file.

## Steps

1. Use the project briefing when this conversation has it and nothing changed since. Otherwise run it.
   `toolkit brief`
2. The owner named an item or an area: answer about that item only. Where it stands in plain words, what is done and left in its Roadmap, its blockers, and its next action.
   `toolkit work show <id>`
3. The whole project: read the tree, the recommended next item, the decisions waiting on the owner, and the current focus.
   `toolkit work list --tree`
   `toolkit work next`
   `toolkit work decisions`
   `toolkit memory focus`
4. Answer in the order and shape in "How to answer" below. Say every stage in plain words with the item id ("WI-012 is in testing"); the labels come from the lifecycle.
   `toolkit work lifecycle`
5. For each problem, name the skill that fixes it, without running it: moved or missing items, `work-organize`; setup warnings, `project-setup`; decisions, `work-decide`.
6. "Show the board": local tracker, summarize `.work-items/DASHBOARD.md`; Notion, give the Work Items link (`references/tracker-notion.md`, "The board link").
   `toolkit config get notion.workItems.url`
7. End with one thing the owner can say next, for example "Say 'what do you need from me' to go through the 2 decisions."

## Gotchas

- Run each `toolkit` command alone: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails; `references/toolkit-commands.md`).
- "Agent to-do" lines in the decisions list are the agent's own steps, not decisions. Count and show only the decisions.
- Archived items are hidden from the briefing and the recommended next item. Mention them only when the owner asks.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Read the issues with the tracker's own tool (`references/tracker-github.md` or `references/tracker-jira.md`, section "The `toolkit work` steps") and answer in the same order.
- Nothing is tracked yet: say so in one line and offer `work-on` for the first piece of work.

## How to answer

- Lead with the answer, not with how you found it.
- Decisions first, because only the owner can unblock them: the count, then one line each with the item id, what is being decided, and how long it has waited when the record shows it.
- One line per item in progress: id, title, plain stage, what is left, and who it waits on.
- The recommended next item and why, in one line.
- Recently done: items finished since the last session, when the record shows it. Skip it when there are none.
- Anything moved or broken, with the skill that fixes it.
- Keep it short. The owner can ask about one item for detail.

Example:

```markdown
2 decisions wait on you:
- WI-012: approve the CSV export result (waiting since 2026-09-26).
- WI-015: choose design A (built-in report) or B (custom page).

In progress:
- WI-014 "Nightly sync", in build (stage 08): P2 of 3 left; waiting on nobody.

Next: WI-016 "Login page copy", because it blocks the release and needs no decision.

Say "what do you need from me" to go through the 2 decisions.
```

## Not this skill

- "What did we do in this chat": `session-summary`.
- "What do you need from me": `work-decide`, which walks through each decision.
- "What did we decide about X": `memory-find`.

## References

| File | Open it when |
| --- | --- |
| [references/tracker-local.md](references/tracker-local.md) | `tracker.type` is `local`: the dashboard, archived items, hand moves |
| [references/tracker-notion.md](references/tracker-notion.md) | `tracker.type` is `notion`: the board link, cards the owner changed |
| [references/tracker-github.md](references/tracker-github.md) | A `toolkit work` command exits 3 in a GitHub Issues project |
| [references/tracker-jira.md](references/tracker-jira.md) | A `toolkit work` command exits 3 in a Jira project |
| [references/work-item-format.md](references/work-item-format.md) | Reading an item's sections: what each one holds |
| [references/recording-owner-answers.md](references/recording-owner-answers.md) | Stage wording and how to end the reply |
| [references/toolkit-commands.md](references/toolkit-commands.md) | Any `toolkit` command exits with a code other than 0 |

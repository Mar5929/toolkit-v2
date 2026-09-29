---
name: work-decide
description: 'Takes the owner through the decisions his work items wait on, each with a recommendation, and records his answers. Use when he asks "what do you need from me", answers a waiting decision ("go with option B"), or states a project-wide decision.'
---

# Work decide

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Walks the owner through what waits on him, one decision at a time, and records each answer where it belongs. Track these steps with the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

## Steps

1. Build the queue. The command lists each decision once: requirements waiting for approval, proposed designs, results at stage 11, Open Questions rows the owner decides, and memory proposals. Its "Agent to-do" lines are not decisions. A delivery offer belongs to `work-delegate`: open it after his other decisions.
   `toolkit work decisions`
2. He gave an answer without being asked ("approved", "go with B"): match it to exactly one waiting decision; when two could match, ask which, naming both. A bare "yes", "ok", or "looks good" with no question asked is not an answer (`references/approvals.md`, section 1).
3. Otherwise start with the count and one short line for every waiting decision, memory proposals included ("3 decisions wait on you: the WI-004 design, the WI-006 result, and a memory proposal about deploy days."). Then take them one at a time, the one blocking the most work first: what is decided, the choices, your recommendation and its main reason, and what happens after each answer. One decision per message, in the reply text.
4. An approval: read the item, then run that gate's checklist in `references/approvals.md` (requirements: section 2; design: section 3; result: section 4). A result with no independent acceptance check since its last build (the command prints a note): open `work-check` first, which runs it whoever built the change.
   `toolkit work show <id>`
5. An Open Questions answer: save his words first, rewrite that row with the answer, the date, and Answered, then set `waiting_on` back (`references/recording-owner-answers.md`, sections 4 and 5).
   `toolkit work history <id> --note 'Owner said: <quote>' --effect '<what the answer changes>'`
   `toolkit work edit <id> --section 'Open Questions' --set-file <file>`
   `toolkit work set <id> --waiting-on agent`
6. A memory proposal: show its one line, and when it names a concept, the concept it would join. Recommend a yes only with evidence from this project (what he said, what happened, and when); with none, ask without a recommendation. Yes: approve it (a proposal for a concept is then added to it as a section). A proposal that names no concept: name the concept it goes in with `--concept`, an existing one of its type or a new key named for its subject, never for the fact (`references/proposals.md`, "Recording the owner's answer"). No: reject it, and never propose the same fact again.
   `toolkit memory list --type <type>`
   `toolkit memory approve <key> --by <owner>`
   `toolkit memory approve <key> --by <owner> --concept <type>_<subject> --title '<Concept title>' --description '<one-line summary of the concept>'`
   `toolkit memory reject <key>`
7. A decision for the whole project: add the row inside the `publish-docs` save workspace, in the order in `references/decisions-log.md`.
   `toolkit decision add --decision '<decision>' --why '<why>' --by <owner>`
8. A "no" or a change: record it as the answer, move the item back (for example to refinement), and open the skill that redoes the work.
   `toolkit work set <id> --stage 02-refinement`
9. Lead with "Not saved" if any write failed. Update the current focus when an answer changed an item's next step (`references/current-focus.md`). After each recorded answer, list the decisions again and name what still waits on him, memory proposals included, by name ("One decision still waits: the memory proposal about Ghost slugs."). A decision an earlier reply said you would take next is taken next. Empty queue: say so and offer `work-on` for unblocked items. End with the next decision's question or the exact words that continue.
   `toolkit work decisions`

## Gotchas

- Run each `toolkit` command alone: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). One-line values go in single quotes, never double quotes; an apostrophe inside them is `'\''` in Claude Code and ’ (U+2019) in Codex, or reword the text. Section text goes on standard input (`--set-file -`) in Claude Code, and in `--text '<text>'` or a `mktemp -d` file in Codex (`references/toolkit-commands.md`, "Text in a command").
- Every decision carries a recommendation, even when it is the only one in the queue. A bare question is not enough. The one exception is a memory proposal with no evidence from this project (step 6).
- Ask in the reply text, never through a question tool.
- The approve command marks the Open Questions rows that asked for it Answered and prints "Marked Q-xx Answered". Never edit those rows again by hand.
- `waiting_on`: `agent` when the agent continues, `none` when nothing waits, `owner` while another of his questions on that item is still open. The approve command sets `none` by itself.
- A memory proposal is not a fact until he approves it. Do not rely on it.
- An approval never covers merge, deployment, spending, or publishing.
- After a result approval, the item continues with `work-finish`. Open it when he wants it shipped now.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Build the queue from the labels in `references/tracker-github.md` or `references/tracker-jira.md`, and remove the waiting-on-owner label after each approval or last answer.

## Example decision message

```markdown
WI-015 needs your choice of design.

- Option A: use the built-in report page. Ready in about a day; the layout is fixed.
- Option B: a custom page. About a week; any layout you want.

I recommend A, because every requirement is met without custom code.
After A: I plan the build. After B: I plan a longer build and ask you about the layout.

Do you approve Option A?
```

## References

| File | Open it when |
| --- | --- |
| [references/approvals.md](references/approvals.md) | Step 4: the checklist for each gate; step 2: what counts as an answer |
| [references/decisions-log.md](references/decisions-log.md) | Step 7: a project-wide decision, `DECISIONS.md`, replacing a decision |
| [references/proposals.md](references/proposals.md) | Step 6: a memory proposal |
| [references/recording-owner-answers.md](references/recording-owner-answers.md) | Step 5: where an answer goes, history notes, `waiting_on`, a failed save |
| [references/work-item-format.md](references/work-item-format.md) | Before rewriting a section or an Open Questions row |
| [references/current-focus.md](references/current-focus.md) | Step 9: an answer changed an item's next step |
| [references/toolkit-commands.md](references/toolkit-commands.md) | Before a command that carries text, and on any exit code other than 0 |
| [references/tracker-local.md](references/tracker-local.md) | `tracker.type` is `local` |
| [references/tracker-notion.md](references/tracker-notion.md) | `tracker.type` is `notion` |
| [references/tracker-github.md](references/tracker-github.md) | A `toolkit work` command exits 3 in a GitHub Issues project |
| [references/tracker-jira.md](references/tracker-jira.md) | A `toolkit work` command exits 3 in a Jira project |

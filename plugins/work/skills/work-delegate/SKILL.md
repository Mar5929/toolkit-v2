---
name: work-delegate
description: 'Hands a work item''s goal to a team of agents with the owner as product owner: makes the delivery offer, records his choice, and runs the team. Use whenever the owner hands a goal over ("you drive", "take it from here"), even a named item, or work-on starts a large goal with no delivery choice.'
---

# Work delegate

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
The only skill that makes the agent-led delivery offer and records the answer; after a yes it runs the team through the skill that owns each stage. Track these steps with the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

## Steps

1. Look for a delivery choice that covers this goal: the item's `delivery` value, its Notes > Decisions and context, and its parent's choice. A sub-item makes no offer. A quick question, a small edit, or a small item (one or two tasks, no sub-items) gets no offer: record owner-led with the reason and go on (`references/agent-led-delivery.md`, section 1).
   `toolkit work show <id> --section 'Decisions and context'`
   `toolkit work set <id> --delivery owner-led --note 'Small item: one or two tasks, so no delivery offer.'`
2. No choice recorded: add the offer as an Open Questions row, set the item waiting on the owner, and give your recommendation with its main reason in one line before the question (for example "I recommend yes: the item has three phases that helpers can build side by side."). Then ask exactly this as the last line of the reply: "Would you like agents to take responsibility for delivering this, with you acting as product owner?" "You drive" in his own words is already the answer.
   `toolkit work edit <id> --section 'Open Questions' --append-row '| <next Q-id> | Would you like agents to take responsibility for delivering this, with you acting as product owner? | delivery | Open | owner |'`
   `toolkit work set <id> --waiting-on owner`
3. Yes: ask the team question. Where the host lets this chat list, read, and message other chats and offer new chats to the owner: "Do you want one team inside this chat, or do you want me to rename this chat to Main Orchestrator and coordinate other chats that each have their own team?" On any other host, say the multi-chat arrangement is not available here and ask: "Shall I run one team of helpers inside this chat?"
4. Main Orchestrator chosen: also ask "Do you want me to archive sessions after their task is fully complete, everything is merged and shipped, and you approved?"
5. Record the choice, the goal it covers, who said it, the date, the team arrangement, the archive answer, and the limits in Notes > Decisions and context; set the delivery value; hand the item back to the agent unless another of his questions is open; add one history note; read it back (`references/agent-led-delivery.md`, section 3).
   `toolkit work edit <id> --section 'Decisions and context' --set-file <file>`
   `toolkit work set <id> --delivery agent-led`
   `toolkit work set <id> --waiting-on agent`
   `toolkit work history <id> --note 'Agent-led delivery accepted by <owner>: <his words>'`
6. No, or a later revoke: record it the same way, and set `waiting_on` to `agent` when the agent still works on the item. Do not offer again for this goal unless it grows a lot or the owner asks.
   `toolkit work set <id> --delivery owner-led`
   `toolkit work set <id> --waiting-on agent`
7. Run the team through the skill that owns each stage (`references/agent-led-delivery.md`, section 4; `references/team-arrangements.md`). The main agent plans, briefs the helpers, gives one writer per path, and is the only writer of the work item.
   `toolkit work list --tree`
8. Stop at every owner gate: set the item waiting on him and ask through the skill that owns the gate. Keep working on what the answer does not block.
   `toolkit work set <id> --waiting-on owner`
9. Archive a chat only when its task is complete, merged and shipped, its report is saved, the owner approved it, and he said yes to archiving. Never delete a chat.
10. End every reply with the one question (the offer, the team question, or the next gate) or the exact words that continue ("Say 'go' and the team starts on P1.").

## Gotchas

- Run each `toolkit` command alone: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). One-line values go in single quotes, never double quotes; an apostrophe inside them is `'\''` in Claude Code and ’ (U+2019) in Codex, or reword the text. Section text goes on standard input (`--set-file -`) in Claude Code, and in `--text '<text>'` or a `mktemp -d` file in Codex (`references/toolkit-commands.md`, "Text in a command").
- The offer and the team questions are asked word for word, in the reply text, never through a question tool.
- The `--delivery` command marks the offer's Open Questions row Answered and prints "Marked Q-xx Answered". Never edit that row by hand. When no other question for him is open, it also sets `waiting_on` to `none` ("It is no longer waiting on the owner"). Set `agent` right after it when the agent continues (steps 5 and 6); keep `owner` while another of his questions on the item is open.
- A sub-item is part of its parent's goal: creating it under the parent copies the parent's delivery value. Set it only when it is missing or differs, with a note naming the parent.
- The choice belongs to the named goal only. It does not carry over to another goal, a new item, or an unrelated sub-item.
- Acceptance alone starts no helpers; the team arrangement answer does. A no to the team question means no helpers.
- Delegation never widens merge, deployment, spending, or publishing. Every approval gate still applies, and approvals already given still count.
- Missing tracker access is not a missing decision. Keep an unsaved choice in the handoff and save it when access returns.
- A recorded lead or chat id is coordination information, not proof that an agent is still running.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Record the choice in the issue's Notes and a delivery label (`references/tracker-github.md` or `references/tracker-jira.md`).

## Agents

- `builder` (`references/agent-builder.md`), `researcher` (`references/agent-researcher.md`), and `acceptance-checker` (`references/agent-acceptance-checker.md`), briefed by the stage skill that uses them. Brief and size them as `references/helpers.md` and `references/team-roles.md` say. In Codex the main agent first makes each builder's worktree (`references/helpers.md`, section 2, "Codex builders"; Git writes: `references/git-rules.md`).
- Codex: this plugin's agents do not load there. Give the full text of this skill's `references/agent-<name>.md`, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. With no worker, do the work yourself and say that no independent check ran.

## References

| File | Open it when |
| --- | --- |
| [references/agent-led-delivery.md](references/agent-led-delivery.md) | Steps 1 to 7: when to offer, the exact questions, how to record the answers, what an acceptance allows |
| [references/team-arrangements.md](references/team-arrangements.md) | Steps 3, 7, and 9: what each team arrangement means, starting chats, archiving; also when resuming a goal with a recorded arrangement |
| [references/approvals.md](references/approvals.md) | Step 8: every owner gate still applies |
| [references/helpers.md](references/helpers.md) | Before starting any agent |
| [references/team-roles.md](references/team-roles.md) | Sizing the team |
| [references/agent-builder.md](references/agent-builder.md), [references/agent-researcher.md](references/agent-researcher.md), [references/agent-acceptance-checker.md](references/agent-acceptance-checker.md) | Codex only: the text to give the worker |
| [references/recording-owner-answers.md](references/recording-owner-answers.md) | The owner answers; history notes; `waiting_on`; a failed save |
| [references/work-item-format.md](references/work-item-format.md) | Before editing Decisions and context or Open Questions |
| [references/toolkit-commands.md](references/toolkit-commands.md) | Before a command that carries text, and on any exit code other than 0 |
| [references/git-rules.md](references/git-rules.md) | Codex: making a builder's worktree, and every Git write |
| [references/tracker-notion.md](references/tracker-notion.md) | `tracker.type` is `notion`, or a command prints a Notion error |
| [references/tracker-github.md](references/tracker-github.md) | A `toolkit work` command exits 3 in a GitHub Issues project |
| [references/tracker-jira.md](references/tracker-jira.md) | A `toolkit work` command exits 3 in a Jira project |

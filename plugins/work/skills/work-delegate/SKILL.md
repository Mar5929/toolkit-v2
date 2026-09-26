---
name: work-delegate
description: 'Hands a goal to agents with the owner as product owner: makes the agent-led delivery offer, asks how the team is arranged, records the choice, and runs the team. Use when the owner says "you drive", "run with it", "take it from here", or "use a team of agents", or work-on starts a big goal.'
---

# Work delegate

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md` and `../../references/helpers.md`. Full method: `references/agent-led-delivery.md` and `references/team-arrangements.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`.

## Steps

1. Look for a delivery choice that covers this goal: the item's `delivery` value and its Notes > Decisions and context. A quick question or small edit gets no offer.
   `toolkit work show <id> --section "Decisions and context"`
2. No choice recorded: ask exactly "Would you like agents to take responsibility for delivering this, with you acting as product owner?" If the owner already said it in his own words ("you drive"), that is the answer; do not ask again.
3. Yes: ask about the team. Where this chat can list, read, and message other chats (today, the Claude Code desktop app): "Do you want one team inside this chat, or do you want me to rename this chat to Main Orchestrator and coordinate other chats that each have their own team?" On any other host, say the multi-chat arrangement is not available here and ask: "Shall I run one team of helpers inside this chat?" After the Main Orchestrator choice only: "Do you want me to archive sessions after their task is fully complete, everything is merged and shipped, and you approved?"
4. Record the choice, the goal it covers, who said it, the date, the team arrangement, the archive answer, and the limits (delegation never includes merge, deployment, spending, or publishing beyond what was given) in Notes > Decisions and context. Set the delivery value, add one history note, and read it back.
   `toolkit work edit <id> --section "Decisions and context" --set-file <file>`
   `toolkit work set <id> --delivery agent-led`
   `toolkit work history <id> --note "Agent-led delivery accepted by <owner>: <his words>"`
   `toolkit work show <id> --section "Decisions and context"`
5. No, or a later revoke: record it the same way; do not offer again for this goal unless it grows a lot or the owner asks.
   `toolkit work set <id> --delivery owner-led`
6. Run the team through the skill that handles each stage: the main agent plans, briefs `builder`, `researcher`, and `acceptance-checker` agents with their role files, gives one writer per path, and is the only writer of the work item.
   `toolkit work list --tree`
7. Stop at every owner gate: set the item waiting on the owner, ask the question through the skill that asks it (that skill sets it back to the agent after his answer), and keep working on anything the answer does not block.
   `toolkit work set <id> --waiting-on owner`
8. Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker. With no worker, say no helpers ran and do the work directly.
9. Archive a chat only when its task is complete, merged and shipped, the report is saved, and the owner approved. Never delete a chat.

## What each answer allows

- **Accepted:** agents drive discovery, interviews, requirements, research, design, the authorized build, checks, and delivery for this goal, across sessions. The owner supplies product direction, settles tradeoffs, and approves results.
- **Team arrangement chosen:** authorizes focused, bounded helper agents for this goal only.
- **No to the team question:** no helpers; the main agent does the work itself.
- **Declined or revoked:** normal help and record upkeep continue. No offer again for this goal unless it grows a lot or the owner asks.
- Nothing here widens other limits: no merge, deployment, spending, or publishing beyond what was given. Existing approvals still count.

## Rules

- The choice belongs to the named goal. It does not carry over to another goal, a new item, or an unrelated sub-item.
- Missing tracker access is not a missing decision. Keep a choice you could not save in the handoff and save it when access returns.
- A failed save: lead with "Not saved". A write whose read-back failed: "Saved but not verified".
- A recorded lead or chat id is coordination information. It is not proof that an agent is still running.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Record the choice in the issue body's Notes and a `delivery` label, as `../../references/trackers.md` says.

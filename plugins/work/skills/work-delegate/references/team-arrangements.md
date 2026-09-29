# Team arrangements

What each answer to the team-arrangement question means, and the archive
answer that follows the Main Orchestrator arrangement. `agent-led-delivery.md`
owns the questions, when they are asked, and where the answers are recorded.

## One team inside this chat

- This chat's main agent is the lead. It plans the work, splits it, briefs
  helper agents, judges and checks what they return, makes the calls, keeps
  the work item current, and reports to the owner.
- Helper agents do the heavy work: reading long files, searching, building,
  drafting, and running checks. The work plugin's agents are `researcher`,
  `builder`, `acceptance-checker`, `requirements-analyst`, `design-architect`,
  and `design-critic`.
- One writer per path at a time. A checker never edits what it checks. It
  returns its findings to the lead.
- The lead reads the work item again right before committing, because the
  owner may have changed it during the build.
- The owner's choice of an arrangement authorizes focused, bounded helper
  agents for that goal only, within every other existing limit. Where the
  owner answered no and no other helper authority exists, the main agent
  builds the work itself. It still starts one `acceptance-checker` before it
  asks for the result approval (`helpers.md` in this folder, section 6).
- On a host that cannot support the multi-chat arrangement below, the owner is
  asked only whether to run this one team. A yes chooses it.

## Main Orchestrator with other chats

- Rename this chat to "Main Orchestrator" using the host's chat-title feature.
  If the agent cannot rename it, ask the owner to rename it.
- Run one chat per responsibility, for example one build item, one review, one
  sync. Each chat has its own lead and its own helpers, arranged as in "One
  team inside this chat".
- The Main Orchestrator coordinates the chats, checks their results, owns the
  work tracker, owns shared files such as shared version numbers and indexes,
  owns merges, and reports to the owner in plain product-owner language. It
  does not do a chat's work for it.
- Each chat lead plans, briefs, judges, and checks. Its helper agents do the
  heavy reading, building, drafting, and check runs. One writer per path at a
  time. Checkers never edit.
- Chats report to the Main Orchestrator by message and also save their reports
  to files through the project's documentation route (`publish-docs`). A
  report that exists only in a chat transcript is lost with the chat.
- Live status (chat ids, chat states, and next actions) belongs in the work
  item, not in a plan or design file. A recorded chat id is coordination
  information. It is not proof the chat is still running.

## Archiving finished chats

- This applies only when the owner answered yes to the archive question in
  `agent-led-delivery.md`.
- With a yes, the Main Orchestrator archives a team chat only when all four of
  these are true: its task is complete; its work is merged and shipped; its
  report is saved to a file; and the owner approved the result.
- Archive only. Never delete a chat. An archived chat can be restored.
- With a no, leave chats as they are.

## Starting a chat

What the host must let the Main Orchestrator do, and what to check in the
tools this session has. Hosts change; never assume a tool exists.

- A new chat starts from a task button the owner clicks. The Main Orchestrator
  cannot create a chat silently. When the button offers to start the chat in
  its own worktree, use that, so the chat gets its own folder.
- A new chat may copy the Main Orchestrator's model. Set the lead's model on
  purpose.
- The Main Orchestrator can message chats and read their transcripts through
  the host's session tools. It cannot approve their permission prompts. The
  list of chats it can see may be limited to recent ones: record each chat's
  id in the work item when the chat starts, so it can be found later.
- A chat will not let a message from another chat lift a limit set in its own
  starting prompt. So put every permission the chat will need in its starting
  prompt, including permission to save its own report to a file. Include only
  permissions the owner or the project has already given.
- Open every starting prompt with the project's working principles as the
  owner stated them, including building what the requirements ask and no
  more, and with the lead-and-helper split.

## Models

- Every Claude Code helper agent runs on Opus. The agent files set
  `model: opus`; pass `model: opus` on every call as well, so the choice is
  visible.
- The most capable available model leads: the lead of a single-chat team, the
  Main Orchestrator, and each chat lead.
- In Codex, use a model the host offers; an economical model for reading and
  searching, the most capable one for difficult judgment.

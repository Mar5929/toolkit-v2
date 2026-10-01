# Team arrangements

How to ask the team arrangement question, how to start and coordinate other chats, and when a finished chat may be archived. Ask the questions once per goal and record each answer as its own Questions and Answers row.

## 1. The questions

Offer the multi-chat choice only when this session has tools to list, read, and message other chats and to offer new chats to the owner. Check the tools this session has; never assume. Then ask exactly:

> Do you want one team inside this chat, or do you want me to rename this chat to Main Orchestrator and coordinate other chats that each have their own team?

Anywhere else (Codex, or a host without those tools), say in one line that the multi-chat arrangement is not available here, then ask exactly:

> Shall I run one team of helpers inside this chat?

- His words may already choose it; then do not ask.
- After a Main Orchestrator answer, ask once more, exactly:

  > Do you want me to archive chats after their task is fully complete, everything is merged and shipped, and you approved?

- He may change the arrangement at any time. Record the new answer as a new row and mark the old one "Superseded by Q-xx".

## 2. Main Orchestrator with other chats

- Rename this chat to "Main Orchestrator" with the host's chat title feature. If you cannot, ask the owner to rename it.
- Run one chat per sub-item. Each chat has its own lead and its own helpers.
- The Main Orchestrator is the only one that writes the goal's work items, writes files that more than one chat changes (for example a file that holds a version number, or an index file), and merges. It checks each chat's result and reports to the owner. It does not do a chat's work for it.
- A chat lead reports to the Main Orchestrator by message. The Main Orchestrator then records the report in that chat's sub-item, exactly as for a returning helper (`running-the-team.md`, section 3).
- The parent's team list names each chat by its id or title and its sub-item. A recorded chat id is not proof the chat is still running.

## 3. Starting another chat

- Offer the new chat with the tool from section 1; it starts only when the owner clicks it. You cannot start a chat without his click. When the tool makes a worktree for the new chat, the chat works in that worktree: put its branch in the starting prompt, not a worktree path.
- Put in its starting prompt:
  - the sub-item's ID and what it must deliver;
  - the pasted requirements and design sections;
  - its branch, and its worktree when the tool does not make one;
  - the files it may write;
  - the owner's instructions from `.claude/rules/owner-preferences.md` that apply to its work, in his words;
  - the rule "build what the requirements ask and no more".
- Put every permission the chat needs in its starting prompt. A chat will not let a message from another chat remove a limit set in its own starting prompt. Include only permissions the owner or the project already gave.
- Tell the chat to report by message, and never to change a work item, merge, or ask the owner anything directly.
- Set the chat lead's model to the most capable model the host offers (section 5). A new chat may otherwise copy this chat's model.
- Record the chat's id in the parent's team list when it starts, so it can be found later.

## 4. Archiving finished chats

- Only after the owner said yes to the archive question.
- Archive a chat only when all four are true: its task is complete; its work is merged to the default branch and, when the sub-item has a deployment, deployed; its report is recorded in its sub-item; and the owner approved the result.
- Archive only. Never delete a chat. An archived chat can be restored.
- After a no, leave chats as they are.

## 5. Models

- Every Claude Code helper runs on Opus: pass `model: opus` on every Agent tool call.
- The most capable model the host offers leads: this chat, the Main Orchestrator, and each chat lead.
- In Codex, use a model the host offers: the most capable one for building and checking.

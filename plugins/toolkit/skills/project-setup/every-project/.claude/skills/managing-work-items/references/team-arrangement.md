# Choosing and coordinating the team

Use this reference when Building needs the procedures below. Follow the approved requirements and the owner's recorded authorization.

## The team arrangement

The team arrangement says whether one session runs the team, or one session coordinates other sessions that each have a team. After the owner authorizes agent delivery, settle the arrangement for the goal. When the owner already chose an arrangement or asked for a team inside this chat, record that choice and proceed without asking again. Record each answer as its own Questions and Answers row.

- When the arrangement has not been chosen and this session has tools to list, read, and message other sessions and to offer new sessions, ask the owner to choose between one team inside this chat and a Main Orchestrator coordinating other chats with their own teams. Check that the tools are there. Never assume it.
- When the arrangement has not been chosen and those tools are unavailable, say that coordinating other chats is not available in this session. Then ask whether to run one team of helpers inside this chat.
- After the owner chooses the Main Orchestrator, ask whether to archive chats after their tasks are complete, their work is merged and shipped, and the owner approved the results, unless that authorization is already recorded.
- The owner may change the arrangement at any time. Record the new answer as a new row, and mark the old row "Superseded by Q-xx".

### One team inside this session

This session leads, and it starts the helpers.

### Main Orchestrator with other sessions

The Main Orchestrator is the session that coordinates the other sessions.

- Rename this session "Main Orchestrator" with the tool that sets a session's title. When you cannot, ask the owner to rename it.
- Run one session for each sub-item. Each of those sessions has its own main agent and its own helpers.
- The Main Orchestrator is the only session that does these three things:
  - It changes the goal's work items.
  - It writes a file that more than one session changes, such as a file that holds a version number, or an index file.
  - It merges.
- The Main Orchestrator checks the result of each session and reports to the owner. It does not do a session's work for it.
- The main agent of each other session reports by message. The Main Orchestrator records that report as it records the report of a returning helper, which `building.md`, section "When a helper returns", describes.
- Offer a new session with the tool that offers a new session. Use the available tool's creation process after the owner authorizes the new session.
- When the tool makes a worktree for the new session, put the branch in the starting prompt, and not a worktree path.
- The starting prompt of a new session holds all of these:
  - the sub-item's ID and what the sub-item must deliver;
  - the pasted requirements and design sections;
  - the new session's branch, and its worktree when the tool does not make one;
  - the files the new session may write;
  - the owner's instructions from `.claude/rules/owner-preferences.md` that apply to its work, in the owner's words;
  - every permission the session needs, and only permissions that the owner or the project already gave. A session will not let a message from another session remove a limit that its own starting prompt set;
  - the rule "build what the requirements ask and no more";
  - that the session reports by message, and never changes a work item, merges, or asks the owner anything directly.
- Record the id of each session in the parent's team list when the session starts. A recorded id is not proof that the session is still running.
- Archive a session only after the owner said yes to the archive question, and only when all four of these are true:
  1. Its task is complete.
  2. Its work is merged to the default branch and, when the sub-item has a deployment, deployed.
  3. Its report is recorded in its sub-item.
  4. The owner approved the result.
- Archive only, and never delete. An archived session can be restored.
- After the owner's no to the archive question, leave the sessions as they are.

### The model for these sessions

For this session, the Main Orchestrator and other sessions, honor the project’s model preference; otherwise choose a suitable available model for the task. Check the model a new session inherits and set it when needed.

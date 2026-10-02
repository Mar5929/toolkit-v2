# Review and Save Project Memory

This rule applies to the main agent. The project's one memory store is the system named under "Memory" in `PROJECT.md`, "Toolkit settings"; with local memory it is the `memory/` folder. Claude's native auto-memory and the `claude-toolkit` Second Brain plugin are off in this project. The session-start hook shows Current State in Claude Code and Codex.

In the rules and `AGENTS.md`, "the memory save skill" means `local-memory-save` or `notion-memory-save`, whichever the project has; the memory find and memory refine skills follow the same pattern.

## When to review memory

- Review memory after an explicit remember or forget request, a correction, a standing preference, a meaningful decision or discovery, a significant fix or episode, a change of people, tools, or references, a focus shift, a finished work item, and a handoff.
- A hook reminder is not a save decision. The prompt hook flags keep and decision phrases, such as "remember", "from now on", and "we decided". Do not save on every hook reminder or every turn. A review can end with nothing saved.

## Where it goes

- Decide the home first, with the memory criteria (local memory: `memory/memory-criteria.md`; Notion memory: `notion-memory-save` and its references, which say which record each kind of memory goes to) and the "Where information goes" table in `AGENTS.md`.
- Every decision made while working an item is saved in its Questions and Answers first (`keep-work-item-current.md`); a project-wide decision also gets a memory record: the decision in one sentence, how to apply it, and a link back to the work item naming the Q-ID. In local memory that record is a `decision_<short-name>.md` file.
- A decision made with no work item goes where the "Where information goes" table in `AGENTS.md` says.
- The owner's instructions for how the agent works go to `.claude/rules/owner-preferences.md`, never to memory.
- A small memory pointer may route future sessions to a hard-to-find record, without copying its body.

## How to save

- Save and correct memory, and act on "forget that", only through the memory save skill, which holds the approval policy.
- Merge, retire, and prune stale memory only through the memory refine skill.
- The approval mode (onboarding or trusted) is the "Memory approval" line in `PROJECT.md`, "Toolkit settings"; when that line is missing or still shows its prompt, use the memory save skill's default. Only an explicit owner instruction changes it.
- When the owner changes the mode, change that line with the `project-setup` skill; never record the mode in `.claude/rules/owner-preferences.md`.
- A yes approves only the operation and meaning shown. Silence approves nothing.
- An unanswered save question stays a proposal: do not rely on it.
- Add one line for an unanswered save question to Current State under "Waiting on the owner". Remove it when he approves or rejects the save.
- If the owner says a proposed item should not be memory, withdraw it. When his feedback gives a general selection rule, write it to `.claude/rules/owner-preferences.md` and check later candidates against it. Do not restate the rejected fact in Current State or another topic.
- A change to Current State only, or glossary maintenance the owner already authorized, is saved without a lasting-memory question.
- Remove a line from Current State the moment it stops being true. The memory refine skill prunes the rest.
- Group several independent signals into one save. Never run two writes to the same memory record at once.
- Before you say a save worked, read it back from where it was saved. Then tell the owner briefly what was kept or what needs his decision.
<!-- if memory=hindsight -->

## Hindsight projects

This section applies when the "Memory" line in `PROJECT.md`, "Toolkit settings", is `hindsight`. Hindsight runs as its coding-agent add-on is designed: it saves each session and brings back what is relevant by itself. `AGENTS.md`, "Project memory", says what counts as project memory.

- Where a rule, `AGENTS.md`, or a skill names the memory save or find skill, or Hindsight's `retain` or `recall` tool, use the add-on's tools for saving and searching.
- Never print `~/.hindsight/coding-agent.json` or its `.hindsight-backup` copy: they hold the API key. To list the Hindsight project folders: `jq -r '.mapPathToBank // {} | to_entries[] | "\(.key) \(.value)"' ~/.hindsight/coding-agent.json`.
- The add-on cannot delete a memory. For "forget that", say which memory is wrong and ask the owner to remove it on the bank's page in the dashboard. Never say a memory is deleted when it is not.
- Current State is the local file `memory/CURRENT_STATE.md`, kept out of Hindsight. Remove stale lines at each handoff and whenever the session-start hook says the file is too long or too old. Keep it within its limits: Now 5, Waiting on the owner 5, Untracked to-dos 7, Next session starts with 3, and under 40 lines in all.
<!-- endif -->

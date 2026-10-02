# Review and Save Project Memory

This rule applies to the main agent. The project's one memory store is the system named under "Memory" in `PROJECT.md`, "Toolkit settings". Claude's native auto-memory and the `claude-toolkit` Second Brain plugin are off in this project.

In the rules and `AGENTS.md`, "the memory save skill" and "the memory find skill" mean `managing-project-memory` in a project with local or Notion memory.

## When to review memory

- Review memory after an explicit remember or forget request, a correction, a standing preference, a meaningful decision or discovery, a significant fix or episode, a change of people, tools, or references, a focus shift, a finished work item, and a handoff.
- A hook reminder is not a save decision. Do not save on every hook reminder or every turn. A review can end with nothing saved.

## What never goes in memory

- The owner's instructions for how the agent works go to `.claude/rules/owner-preferences.md`, never to memory.
- A save the owner said no to is kept nowhere else: not in Current State, another memory, or a list of pending saves.

## Approval

- Save, correct, forget, and tidy memory only through the memory save skill, which holds the approval policy.
- The approval mode (onboarding or trusted) is the "Memory approval" line in `PROJECT.md`, "Toolkit settings". Only an explicit owner instruction changes it.
- A yes approves only the change and meaning shown. Silence approves nothing.
- An unanswered save question stays a proposal: do not rely on it.
<!-- if memory=hindsight -->

## Hindsight projects

This section applies when the "Memory" line in `PROJECT.md`, "Toolkit settings", is `hindsight`. Hindsight runs as its coding-agent add-on is designed: it saves each session and brings back what is relevant by itself. `AGENTS.md`, "Project memory", says what counts as project memory.

- Where a rule, `AGENTS.md`, or a skill names the memory save or find skill, or Hindsight's `retain` or `recall` tool, use the add-on's tools for saving and searching.
- Never print `~/.hindsight/coding-agent.json` or its `.hindsight-backup` copy: they hold the API key. To list the Hindsight project folders: `jq -r '.mapPathToBank // {} | to_entries[] | "\(.key) \(.value)"' ~/.hindsight/coding-agent.json`.
- The add-on cannot delete a memory. For "forget that", say which memory is wrong and ask the owner to remove it on the bank's page in the dashboard. Never say a memory is deleted when it is not.
- Current State is the local file `memory/CURRENT_STATE.md`, kept out of Hindsight. Remove stale lines at each handoff and whenever the session-start hook says the file is too long or too old. Keep it within its limits: Now 5, Waiting on the owner 5, Untracked to-dos 7, Next session starts with 3, and under 40 lines in all.
<!-- endif -->

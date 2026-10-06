# Review and Save Project Memory

This rule applies to the main agent. The project's one memory store is the system named under "Memory" in `PROJECT.md`, "Toolkit settings". Never save project memory in a host's own memory feature (Claude Code's auto-memory, Codex Memories) or another plugin's.

## When to review memory

- Review memory after an explicit remember or forget request, a correction, a meaningful discovery, a significant fix or episode, a change of people, tools, or references, a focus shift, a finished work item, and a handoff.
- Review it also when the owner reports what another person said (for example the client, a developer, or a vendor), when a job ran, and when a dated event was set or its date passed.
- A review also checks that every line of Current State is still true.
- A hook reminder is not a save decision. Do not save on every hook reminder or every turn. A review can end with nothing saved.

## What never goes in memory

- The owner's instructions for how the agent works go to `.claude/rules/owner-preferences.md`, never to memory.
- A decision, a project term, a fact about the system, a to-do, and an original each have a home outside memory. When a review finds one that is not filed yet, file it where `AGENTS.md`, "Where information goes", says.
- A save the owner said no to is kept nowhere else: not in Current State, another memory, or a list of pending saves.

## Approval

- Save, correct, forget, and tidy memory only through `curating-project-memory`, which holds the approval policy. Hindsight memory: `.claude/rules/hindsight-memory.md`.
- The approval mode (onboarding or trusted) is the "Memory approval" line in `PROJECT.md`, "Toolkit settings". Only an explicit owner instruction changes it.
- A yes approves only the change and meaning shown. Silence approves nothing.
- An unanswered save question stays a proposal: do not rely on it.

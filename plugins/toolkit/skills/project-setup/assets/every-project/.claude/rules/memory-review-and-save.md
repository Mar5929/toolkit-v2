# Review and Save Project Memory

This rule applies to the main agent. It says when to review project memory, what never goes in memory, and what the owner's yes covers. To review memory is to decide whether anything should be saved, corrected, or forgotten.

The project keeps its memory in one system: the one named on the "Memory" line in `PROJECT.md`, section "Toolkit settings". Never save project memory in the memory feature of Claude Code (auto-memory) or of Codex (Codex Memories), or in the memory of another plugin.

## When to review memory

- Review memory after each of these: an explicit request to remember or forget, a correction, a meaningful discovery, a significant fix or episode, a change of people, tools, or references, a focus shift, a finished work item, and a handoff.
- Review memory also when the owner reports what another person said, for example the client, a developer, or a vendor.
- Review memory also when a job ran, and when a dated event was set or its date passed.
- In every review, also check that every line of the project's Current State is still true.
- A reminder that a hook prints is not a decision to save. Do not save on every hook reminder or on every turn.
- A review can end with nothing saved.

## What never goes in memory

- Write the owner's instructions for how the agent works in `.claude/rules/owner-preferences.md`, never in memory.
- Never save in memory a fact that `AGENTS.md`, section "Where information goes", keeps in a place outside memory. When a review finds such a fact that is not filed yet, file it in that place.
- When the owner said no to a save, keep that save nowhere else: not in the project's Current State, not in another memory record, and not in a list of pending saves.

## The owner's yes

- Save, correct, forget, and clean up memory only with `curating-project-memory`, which says when a save needs the owner's yes. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in its place.
- The "Memory approval" line in `PROJECT.md`, section "Toolkit settings", holds the value `onboarding` or `trusted`. Only an explicit instruction from the owner changes that value.
- The owner's yes covers only the change and the meaning that you showed. Silence is never a yes.
- A question about a save that the owner has not answered stays a proposal. Do not rely on what the proposal says.

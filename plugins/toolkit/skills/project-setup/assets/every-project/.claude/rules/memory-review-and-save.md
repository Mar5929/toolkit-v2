# Review and Save Project Memory

This rule applies to the main agent. It says when to review project memory, what never goes in memory, and which skill changes memory. To review memory is to decide whether anything should be saved, corrected, or forgotten.

The project keeps its memory in one system: the one named on the "Memory" line in `PROJECT.md`, section "Toolkit settings". Never save project memory in the memory feature of Claude Code (auto-memory) or of Codex (Codex Memories), or in the memory of another plugin.

## When to review memory

- Review memory in every turn in which something changes what is true, or in which something happened or you gave a result that a later session would need. `AGENTS.md`, sections "Your job as the agent" and "Where information goes", say what to do.
- In every review, also check that every line of the project's Current State is still true.
- A reminder that a hook prints is not a decision to save. Do not save on every hook reminder or on every turn.
- A review can end with nothing saved.

## What never goes in memory

- Write the owner's instructions for how the agent works in `.claude/rules/owner-preferences.md`, never in memory.
- Never save in memory a fact that `AGENTS.md`, section "Where information goes", keeps in a place outside memory. When a review finds such a fact that is not filed yet, file it in that place.
- When the owner told you to forget something or not to keep it, keep it nowhere else: not in the project's Current State and not in another memory record.

## The owner's yes

- Save, correct, forget, and clean up memory only with `managing-project-memory`. That skill makes a save without asking, and it says which changes need the owner's yes first. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in its place.
- When a change needs the owner's yes, the yes covers only the change and the meaning that you showed. Silence is never a yes.

# Review and Save Project Memory

This rule applies to the main agent.

## When to review memory

- Review memory after the owner asks to remember or forget something, after a correction to something memory holds, when a record a pointer names is moved, replaced, or removed, when the work in progress changes, when a work item is finished, and at a handoff.
- A review checks two things: every line of Current State is still true, and every pointer names a record that exists and was not replaced. Correct what it finds with `curating-project-memory`, "Current State" and "Clean up memory". Hindsight memory: `.claude/rules/hindsight-memory.md`.
- When a review finds a decision, a fact about the system, a term, or a lesson that is not filed yet, file it where `AGENTS.md`, "Where information goes", says.
- A review can end with nothing saved.

## Approval

- A yes approves only the change and meaning shown. Silence approves nothing.
- An unanswered save question stays a proposal: do not rely on it.
- A save the owner said no to is kept nowhere else: not in Current State, another memory entry, or a list of pending saves.

---
name: managing-project-memory
description: 'Keeps project memory true and small: saves facts, lessons, decisions, glossary terms, and Current State; corrects, retires, or deletes what is wrong; writes "from now on" instructions to the project rules; finds what was recorded before; tidies all memory. Use whenever the owner says "remember this", "forget that", "from now on", "what did we decide", or "clean up memory", or a hook says to review memory, even if he does not name this skill. Not for a handoff; use handoff.'
---

# Managing project memory

This skill holds the process: what is worth keeping, when to ask the owner, and how to decide. It never says where memory is kept. For every read and every write, use `storing-project-memory`.

## How memory is kept

- Memory is stored by concept, like a wiki. One record covers one concept or area, such as billing or the deploy process. A new fact joins its concept's record, which grows and is corrected over time. A new record is only for a new concept. Never make one record per fact.
- `references/memory-criteria.md` says what is worth keeping.
- A memory is current, proposed (the owner has not approved it), replaced by another, retired, or withdrawn (a decision he withdrew). `storing-project-memory` says how each is marked. Never answer from a memory that is not current as if it were.

## Out of date, or no longer needed

When a memory is out of date, retire it or mark it replaced, so its history stays. When a memory is no longer needed, or was saved by mistake, delete it after the owner's yes, or when he asks.

Never say a memory is deleted when it is not.

## Approval

- When the "Memory approval" line in `PROJECT.md` is missing or still shows its prompt, use `onboarding`.
- His own request to keep, change, or forget something, or his yes to your question, is the approval. Act at once.
- `onboarding`: anything you inferred gets one question first: "Save to memory: <one-line summary>?". Save after his yes.
- `trusted`: a fact you inferred and can name a source for is saved without asking, and reported in one line, unless it is on the list below. A fact with no source gets the `onboarding` question.
- In both modes, ask first for:
  - an instruction you inferred: "Add to the project rules: <one line>?";
  - a glossary term you inferred;
  - a project-wide decision: "This looks project-wide. Save it to memory too?";
  - anything about a named person, or personal details, that he did not ask you to remember;
  - more than five records at once;
  - retiring or deleting a memory he did not ask you to forget;
  - a change to this policy.
- No question in either mode: a lesson (report it in one line), a change to Current State alone, and glossary upkeep he already authorized.
- A question he leaves unanswered stays a proposal: `references/saving.md`, "Proposals".
- When he changes the mode, change the line with the `project-setup` skill, never in `.claude/rules/owner-preferences.md`.

## Every time

- Read a record fresh before you change it, and read it back after. Never run two writes to the same record at once.
- His own edits win. Ask before you fix a record he changed by hand.

## Files

| File | Open it when |
| --- | --- |
| [references/saving.md](references/saving.md) | Keeping, correcting, or forgetting anything: a fact, a lesson, a decision, a glossary term, a "from now on" instruction, a proposal, or a delete. |
| [references/finding.md](references/finding.md) | The owner asks what was recorded or decided before, or why, or you need a remembered fact. |
| [references/tidying.md](references/tidying.md) | Reviewing or cleaning up all memory. |
| [references/current-state.md](references/current-state.md) | Reading, changing, or pruning Current State. |
| [references/memory-criteria.md](references/memory-criteria.md) | Deciding whether something is worth keeping, and which kind of record it is. |

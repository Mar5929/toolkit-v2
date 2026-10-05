# Saving to memory

How to keep, correct, and forget. The approval policy and the rules for retiring and deleting are in `SKILL.md`.

## Contents

- Decide the home
- Find the concept first
- Write the change
- A lesson
- A project-wide decision
- Correcting a fact
- "Forget that", retiring, and deleting
- Proposals: a save the owner has not answered
- The owner's instructions
- The glossary
- Reply lines

## Decide the home

Test it with `references/memory-criteria.md` and the "Where information goes" table in the project's `AGENTS.md`. Nothing qualifies: save nothing. A hook reminder is only a hint.

## Find the concept first

Search before every save. Search the fact's words, their synonyms, and the glossary's aliases, and read each likely record whole. Then:

- The same fact is already there: save nothing, and say where.
- A section says something different: it is a correction.
- A concept of the right kind covers the subject: add a section to it.
- None covers it: make a new concept record.
- Two concepts fit: pick the one a future session would open first, and link the other as a related memory.

## Write the change

- **A section in an existing concept.** Add the fact as its own section, above the concept's lessons. Update the concept's one-line summary when it now covers more, update its date, and add each related work item, keeping every one already there.
- **A new concept.** Name it for the concept, not for one fact. Use the kind that fits (user, project, reference, event, or decision). An event is one episode per record. Give it a first section and an empty lessons section.
- Each section says what to remember, why it matters, how to apply it, and where it came from with its date and what is uncertain.
- Record what allowed the save: "Approved by <owner> on <date>", "Trusted grant, <date>", or "Proposed by the agent on <date>; not approved".
- Group several independent signals into one save.
- Read it back. Update Current State when the save changes it (`references/current-state.md`).

## A lesson

A lesson is something you learned that is not proven yet. It goes under its concept, in "Gotchas and lessons", as one entry: what happened and what to do, with a Seen line that lists the date, and the session or work item, of each time it came up. The first lesson replaces "None yet." The same lesson again adds a date to its Seen line and never gets a second entry.

An instruction the owner gives is never a lesson: it is a rule at once. A lesson that has come up in two or more sessions is offered as a rule or a skill (`references/tidying.md`, "Lessons that should become rules or skills").

## A project-wide decision

The test is in `references/memory-criteria.md`, "Decisions". The work item's Questions and Answers row already holds the decision; leave it as it is. Ask "This looks project-wide. Save it to memory too?"

After his yes:

1. Search the decision records for one on the same subject. If this decision changes it, see "Correcting a fact".
2. Make a decision record with three parts: the decision in one sentence, how to apply it, and where it was decided (the work item's ID and the Q-ID, such as WI-031 Q-04). Never copy the reasoning; it stays in the work item.
3. A decision made with no work item: write the conversation and its date as where it was decided, and name the Current State line it concerns, if there is one.

His no: save nothing, and do not offer it again. No answer: make no proposal record. Add the line described under "Proposals".

## Correcting a fact

- Replace the text of its section, with the new source and date, and set its last-verified date to today. The old wording does not stay beside it. Keep the old text in your reply so "undo that" can put it back.
- Search the other records, Current State, and the glossary for the old value, and correct each.
- A whole concept replaced: make the new record, say it replaces the old one, mark the old one replaced, and point every link to the old one at the new one.
- A decision that changes: the work item gets a new row first (`managing-work-items`). After his yes, make a new decision record that replaces the old one, and mark the old one replaced. A decision he withdraws with no replacement is marked withdrawn.

## "Forget that", retiring, and deleting

- Right after a save, "forget that" undoes it: remove the section you added, put back the old wording of a section you changed, or delete the record you made.
- About one older section: remove it, and quote the removed text in your reply so he can say "undo that".
- About a whole concept: retire it, with his words as the reason. Links to it from other records get " (retired)" after the link. "Bring it back" reverses all of it.
- Delete cases: a record he says to delete, a proposal he said no to, and a record that holds a secret or an email address (ask first). In the reply, say whether it can be brought back (`storing-project-memory` says).
- A secret or an email address found in memory: remove that text at once, and tell him.

## Proposals: a save the owner has not answered

When his next message does not answer "Save to memory: <one line>?", keep the save as a proposal so it is not lost. A project-wide decision and an inferred rule are never kept as proposal records: each gets only its line in step 2.

1. Save it where it would live, marked proposed (`storing-project-memory` says how).
2. Add one line under "Waiting on the owner" in Current State: "Save to memory? <one line> (proposal in <title>, asked <date>)". For a decision or a rule, the line is "Save to memory? Decision WI-031 Q-04: <one line>" or "Add to the project rules? <one line>". Several open proposals share one line naming each. Remove each as he answers, and the line when none is left.
3. His yes: remove the marks, mark the memory current, and record "Approved by <owner> on <date>".
4. His no: remove the proposal. A general rule he gives about what to keep goes to the project rules under "Memory", and later candidates are checked against it.

## The owner's instructions

An instruction for how the agent works, a preference, or a correction of it is a rule, never memory. His own words are the approval.

1. Read `.claude/rules/owner-preferences.md` fresh. A bullet already says it: add nothing, and say so. A bullet says the opposite: replace it with his new words and name the old line in the reply. Otherwise add one bullet in his words under the `## ` area it is about (Replies, Questions, Testing, Git, Work items, Memory, or General), ending with `(<YYYY-MM-DD>, <owner name>, in chat)`. One instruction per bullet. A change or removal he asks for changes or removes that bullet.
2. When his words say every project: add the bullet to `~/.claude/rules/owner-preferences.md` for Claude Code and to `~/.codex/AGENTS.md` for Codex instead. Ask "This project or all projects?" only when his words leave it unclear.
3. An instruction you inferred: ask first: "Add to the project rules: <one line>?". Unanswered: one line under "Waiting on the owner" (step 2 of "Proposals").

## The glossary

A term whose meaning matters gets one entry in the glossary. The meaning comes from the owner or an authoritative project source. His own definition is the approval. A term you inferred needs a question first.

- A word two systems use differently gets two entries.
- A renamed term: change its entry and add an alias line, "<old term> → <new term>; <reason>; <source>, <date>."
- A term no longer used: set its status to "Retired, <date>".

## Reply lines

One line per save, naming the record by its title and where it is kept (`storing-project-memory` gives the path or link). Then the next step: the question still waiting for the owner or, when none is waiting, the exact words that continue ("Say 'keep going' and I'll <next action>.").

- A new record: "Saved to memory: <title>. Say 'forget that' to undo."
- A new section: "Saved to memory: <section heading> (in <title>). Say 'forget that' to undo."
- A correction: "Updated in memory: <title>. It said: "<old text>". Say 'undo that' to put it back."
- A decision: "Saved to memory: <title> (decision), linked to WI-031. Say 'forget that' to undo."
- A lesson: "Noted a lesson in memory: <heading> (in <title>). Say 'forget that' to undo."
- A rule: "Added to the project rules (<area>): <instruction>. Say 'forget that' to undo."
- A proposal: "Not saved yet. Save to memory: <one line>?"
- A retire: "Retired from memory: <title>. Say 'bring it back' to restore it."
- A delete: "Deleted from memory, as you said: '<his words>'." Then whether it can be brought back.
- A failed save: "Not saved: <reason>." Keep the text, give the fix, and try the save again as soon as the fix is made, in this session.

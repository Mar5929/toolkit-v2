---
name: curating-project-memory
description: 'Decides what project memory keeps, so no fact is kept twice: sends a fact to its home, adds or removes a pointer to a record, writes a standing instruction to the owner''s preferences file, and prunes Current State. Use whenever the owner asks to keep, correct, or forget something or gives a standing instruction, such as "remember this" or "from now on", or a hook reminder names this skill. Not for a handoff; use handoff.'
---

# Curating project memory

Memory holds two things: Current State, which says where work stopped, and pointers. A pointer is the ID of a record and a link to it. Memory never holds the fact itself.

This skill holds the process. `using-memory-store` makes every read and every write of memory, and gives the form of Current State and of a pointer.

Never put in memory: a fact, a decision, a term, a lesson, where a work item stands, an instruction for the agent, a secret, a key, or an email address.

## "Remember this"

1. Find the fact's home with the filing test and the table in the root `AGENTS.md`, "Where information goes". When a hook reminder brought you here and nothing in the message has a home, save nothing.
2. Put the fact in its home, through the skill the root `AGENTS.md` names for that home ("Project map", column "When you change it"). The owner's request to remember a fact is the owner's yes to write it there.
   - The home already holds it: add nothing, and say where it is.
   - Two homes fit, or none: ask the owner one question, with your recommendation.
3. Decide on a pointer. Add one, through `using-memory-store`, only when both are true:
   - the record has an ID (a DEC, an SRC, a rule ID, or a work item ID);
   - the owner asked for a pointer in memory, or work on other items will need the record and no open work item names its ID.
4. Tell the owner in one line where the fact is now, with its ID, and whether memory got a pointer.

A record with no ID gets no pointer: a line in `PROJECT.md`, or a glossary term. Every session can find those in their file.

## "Forget that"

- A pointer: remove it. The record it names stays.
- A line of Current State: remove it.
- The fact itself: it is in its home, not in memory. Say where it is, and change it there through the skill the root `AGENTS.md` names for that home. A decision is never deleted: `filing-project-records` supersedes or withdraws it.
- Said right after a save made here: undo that save.
- Never say something is removed when it is not.

## "From now on": the owner's instructions

An instruction for how the agent works, a preference, or a correction of one is a rule, never memory. The owner's own words are the approval. A line the owner dictates for a preferences file is written with the steps below alone; `writing-harness-files` is for every other change to a rule file.

1. Choose the file from the row for the owner's preference in the root `AGENTS.md`, "Where information goes": this project, or every project. Ask "This project or all projects?" only when the owner's words leave it unclear.
2. Read the file fresh. The comment at the top of `.claude/rules/owner-preferences.md` gives the layout of a line; use the same layout in a file that has no such comment.
   - A line already says it: add nothing, and say so.
   - A line says the opposite: replace it with the owner's new words, and name the old line in your reply.
   - Otherwise: add one line in the owner's words. One instruction per line.
3. An instruction you worked out yourself: ask first, "Add to the project rules: <one line>?" No answer in the owner's next message: put that question as one line under "Waiting on the owner" in Current State, and remove the line when the owner answers.
4. A lesson that the closing step of `running-work-item-lifecycle` moves up as a rule, with the owner's yes, is written the same way. Its line ends with the work item's ID in place of "in chat".

## Current State

Each line has one skill that decides what it says:

| Line | Decided by |
| --- | --- |
| A work item's line under Now | `running-work-item-lifecycle` |
| "Next session starts with" | `handoff` |
| A line under "Waiting on the owner", such as an Open decision that no work item waits on, and pruning | This skill |

Prune when a hook says Current State is too long or too old, when a work item closes, and before "Clean up memory":

1. Read Current State, and the status of every work item it names with `using-work-tracker`.
2. Remove each line that is no longer true, with no plan: a Done or Cancelled item under Now; a question the owner answered, or an Open decision that is now Decided or Withdrawn; a "Next session starts with" line that names a closed item. Cut a line that copies an item's status or next step down to the item's ID and a few words.
3. Set "Last updated". Tell the owner what was removed.
4. A part still over its limit holds only true lines. Ask the owner which to cut; cut a true line only after the owner's yes.

## "Clean up memory"

Write one numbered plan, each line with its reason, and change nothing until the owner says yes. Two changes need no plan: pruning Current State, and removing a secret, a key, or an email address at once.

Put on the plan:

- A pointer whose record is gone: remove it.
- A pointer to a record that was replaced, such as a Superseded decision or a corrected source: point it at the replacement.
- Two pointers to one record: keep one.
- An entry that holds a fact, not a pointer: move the fact to its home ("Remember this", steps 1 and 2), then replace the entry with a pointer or remove it.
- In `.claude/rules/owner-preferences.md`: a line that repeats or contradicts another line, another rule file, or a line of the root `AGENTS.md`. A contradiction is a question for the owner. Never remove a line only because it is old.

Report one short list of what changed, then the questions still open.

## Every time

- Read fresh before a change and read back after it. Never run two writes to memory at once.
- The owner's own edits win. Ask before you change an entry the owner wrote by hand.
- A failed write: start the reply with "Not saved", keep the text, and give the fix.

## Hand-offs

| For | Use |
| --- | --- |
| Every read and every write of memory | `using-memory-store` |
| A decision, an original, or a fact about the system that more than one work item needs | `filing-project-records` |
| Anything one work item needs, and a lesson that is not proven yet | `running-work-item-lifecycle` |
| Reading a work item | `using-work-tracker` |
| A handoff | `handoff` |

# Saving to local memory: the steps

The file format is in `record-format.md`; the approval policy is in `SKILL.md`.

## Contents

- Find the concept first
- Adding a section to a concept
- A new concept file
- A lesson
- A project-wide decision
- Correcting a fact
- "Forget that", retiring, and deleting
- Proposals: a save the owner has not answered
- The owner's instructions: owner-preferences
- The glossary
- Current State
- Reply lines

## Find the concept first

Search before every save. List each file's summary and status, search the fact's words, their synonyms, and the glossary's aliases, and read each likely file whole. Then:

- The same fact is already there: save nothing and say where.
- A section says something different: it is a correction.
- A concept of the right prefix covers the subject: add a section to it.
- None covers it: a new concept file.
- Two concepts fit: pick the one a future session would open first, and link the other under **Related memories**.

## Adding a section to a concept

1. Read the file fresh. Add `## <Sub-topic>` with its six labels just above `## Gotchas and lessons`, or under the heading it belongs to.
2. Set `updated` to today. Change `description` when the concept now covers more. Add each related work item to `work_items`, keeping every entry already there.

## A new concept file

1. Copy the project's `memory/project_topic_template.md` to `memory/<prefix>_<name>.md` (an episode: `event_<name>.md`, `metadata.type: event`, one episode per file).
2. Fill the front matter and the first section. Keep `## Gotchas and lessons` last, with "None yet."
3. Remove the fill-in guide comment and the final template comment.

## A lesson

Under the concept it is about, in `## Gotchas and lessons` (`record-format.md`, "Gotchas and lessons"). Replace "None yet." with the first lesson. The same lesson again adds a date to its Seen line, not a second heading. When it has come up in two or more sessions, offer to make it a rule or a skill (`local-memory-refine` does the change).

## A project-wide decision

Only after his yes to "This looks project-wide. Save it to memory too?". The work item's Questions and Answers row already holds the decision; leave it as it is.

1. Search `memory/decision_*.md` for one on the same subject. If this decision changes it, see "Correcting a fact".
2. Copy `memory/decision_template.md` to `memory/decision_<short-name>.md` and fill it. "Where it was decided": the item and the Q-ID, such as `[[WI-031]] Q-04`; for Notion or GitHub, the ID, the Q-ID, and its web address. Never copy the reasoning.

His no: save nothing and do not offer it again. No answer: add one line under "Waiting on the owner" in Current State ("Save to memory? Decision WI-031 Q-04: <one line>") and remove it when he answers.

## Correcting a fact

- Replace the text of its section, with the new source and date on **Evidence and limits**. The old wording does not stay beside it. Set `updated` and `last_verified` to today. Keep the old text in your reply so "undo that" can put it back.
- Search the other files (concepts, Current State, the glossary) for the old value and correct each one.
- A whole concept replaced: make the new file with `supersedes: <old name>`, mark the old one superseded (`record-format.md`, "Proposals, superseded, and retired text"), and point links to the old file at the new one.
- A decision that changes: the work item gets a new row first (`tracking-work-items`). After his yes, a new decision file with `supersedes:`, and the old one becomes `superseded`. A decision he withdraws with no replacement becomes `withdrawn`.

## "Forget that", retiring, and deleting

- Right after a save, "forget that" undoes it: remove the section you added, put back the old wording of a section you changed, or delete the file you made.
- About one older section: remove it, and quote the removed text in your reply so he can say "undo that".
- About a whole concept: retire it (`record-format.md`, "Proposals, superseded, and retired text"), with his words as the reason. Links to it from other files get " (retired)" after the link. "Bring it back" reverses all of it.
- Delete a file only in these cases: the file you just made, when he says "forget that" right after the save; a proposal file he said no to; a file his own words say to delete ("delete it", "remove it for good"); a file that holds a secret or an email address, after his yes. For the last two, say in the reply that it cannot be undone: `memory/` is not in Git and has no backup.
- A secret or an email address found in memory: remove that text at once, and tell him.

## Proposals: a save the owner has not answered

When his next message does not answer "Save to memory: <one line>?", keep the save as a proposal so it is not lost.

1. Save it where it would live, marked (`record-format.md`, "Proposals, superseded, and retired text"): a new concept as a new file with `status: needs-review` and `authorization: Proposed by the agent on <date>; not approved`; a fact for an existing concept as a new section whose first line is `**Proposal, not approved yet:** asked on <date>. Do not rely on this until the owner says yes.`
2. Add one line under "Waiting on the owner" in Current State: `Save to memory? <one line> (proposal in memory/<file>, asked <date>)`. Several open proposals share one line naming each file. Remove each from the line as he answers, and the line when none is left.
3. His yes: remove the marks, set `status: current` and `authorization: Approved by <owner> on <date>` (a section: add "Approved by <owner> on <date>." to its **Evidence and limits** line).
4. His no: remove the section or delete the proposal file, and save the rejected fact nowhere else. A general rule he gives about what to keep goes to `.claude/rules/owner-preferences.md` under "Memory".

## The owner's instructions: owner-preferences

An instruction for how the agent works, a preference, or a correction of it is a rule, never memory. His own words are the approval.

1. Read `.claude/rules/owner-preferences.md` fresh. A bullet already says it: add nothing, and say so. A bullet says the opposite: replace it with his new words and name the old line in the reply. Otherwise add one bullet in his words under the `## ` area it is about (Replies, Questions, Testing, Git, Work items, Memory, or General), ending with `(<YYYY-MM-DD>, <owner name>, in chat)`. One instruction per bullet. A change or removal he asks for changes or removes that bullet.
2. When his words say every project: add the bullet to `~/.claude/rules/owner-preferences.md` for Claude Code and to `~/.codex/AGENTS.md` for Codex instead. Ask "This project or all projects?" only when his words leave it unclear.
3. An instruction you inferred: ask first: "Add to the project rules: <one line>?". Unanswered: one line under "Waiting on the owner" in Current State.

## The glossary

A term whose meaning matters gets one row in `memory/terminology-glossary.md`. The meaning comes from the owner or an authoritative project source. His own definition is the approval; a term you inferred needs a question first. A word two systems use differently gets two rows. A renamed term: change its row and add `- <old> → <new>; <reason>; <source>, <date>.` under "Naming changes and aliases". A term no longer used: Status `Retired, <date>`. The first real term: remove the fill-in guide comment and the example row.

## Current State

`memory/CURRENT_STATE.md` carries its own format and limits. Read it fresh. When a line changes, replace that line; never add one beside the old one. Set "Last updated:" (the date, the source, and who changed it).

- An owner to-do with no work item goes under "Untracked to-dos"; offer him a work item for it. A to-do with a set time ("at 9 tomorrow") does not go in Current State: tell him it needs a reminder at that time, and offer to set one with the host's scheduled task tool when there is one.
- A change to Current State alone needs no memory question.

## Reply lines

One line per save, with the file's title, then the next step: the question still waiting for the owner or, when none is waiting, the exact words that continue ("Say 'keep going' and I'll <next action>.").

- A new file: "Saved to memory: <title> (`memory/<file>`). Say 'forget that' to undo."
- A new section: "Saved to memory: <section heading> (in <title>, `memory/<file>`). Say 'forget that' to undo."
- A correction: "Updated in memory: <title>. It said: "<old text>". Say 'undo that' to put it back."
- A decision: "Saved to memory: <title> (decision), linked to WI-031. Say 'forget that' to undo."
- A lesson: "Noted a lesson in memory: <heading> (in <title>). Say 'forget that' to undo."
- A rule: "Added to the project rules (<area>): <instruction>. Say 'forget that' to undo."
- A proposal: "Not saved yet. Save to memory: <one line>?"
- A retire: "Retired from memory: <title>. Say 'bring it back' to restore it."
- A delete: "Deleted from memory, as you said: '<his words>'. This cannot be undone."
- A failed save: "Not saved: <reason>." Keep the text, give the fix, and try the save again as soon as the fix is made, in this session.

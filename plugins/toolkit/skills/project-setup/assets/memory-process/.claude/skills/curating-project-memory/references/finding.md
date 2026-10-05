# Finding what memory holds

Finding only reads. A wrong or old fact is fixed through `references/saving.md`.

## Where to look, in order

1. **Memory.** Records about the subject first, then the project-wide decision records, then the records linked to the work item the question is about. Search by the subject's words and their synonyms, and by the work item's ID as a whole ID (WI-031 must not find WI-0310).
2. **The work item.** When memory points to an item, or the question is about one: its Questions and Answers hold that item's own decisions, and its requirements hold what was agreed (`using-work-tracker`). Memory holds only project-wide decisions.
3. Current State says what is happening now, never what was decided. It is shown at the start of a session; to read it again, use `using-memory-store`.

## Reading what you found

Read each hit whole, in this turn, and check its state:

- Current: it is a fact.
- A proposed record, a proposed section, and an entry under "Gotchas and lessons" are not facts. Leave them out unless he asks, and say what they are when you mention one.
- Replaced: answer from the record that replaces it.
- Retired or withdrawn: history. Leave it out unless he asks for history.

Before you act on a remembered claim about something that changes (a vendor, a process, a person's role), check its date and its source. Say so when it was last verified more than six months ago, or never.

## Answering

- Cite each source you use, as `.claude/rules/cite-recalled-knowledge.md` says.
- Nothing covers it: say "I don't know; nothing recorded covers that." Never guess.

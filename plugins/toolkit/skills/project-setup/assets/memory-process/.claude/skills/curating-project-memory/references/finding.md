# Finding what memory holds

Finding only reads. A wrong or old fact is fixed through `references/saving.md`.

## Where to look, in order

1. **The record that is the fact's home.** A decision: `DECISIONS.md`, then `system/`, then the work item. A term: `system/glossary.md`. A person's role: `PROJECT.md`. An original: `sources/README.md`. The root `AGENTS.md`, "Where information goes", names the home of each kind.
2. **Memory.** Records about the subject first, then the records linked to the work item the question is about. Search by the subject's words and their synonyms, and by the work item's ID as a whole ID (WI-031 must not find WI-0310). `using-memory-store` gives the search.
3. **The work item.** When memory points to an item, or the question is about one: its Questions and Answers hold that item's own decisions, and its requirements hold what was agreed (`using-work-tracker`).
4. Current State says what is happening now, never what was decided. It is shown at the start of a session; to read it again, use `using-memory-store`.

A search of the project's files does not always reach the work items and memory. Search each with its own skill before you say nothing is recorded.

## What happened, and when

For a question about what was done or what changed in a period, such as "what did we do yesterday", read all of these for the dates asked, then answer in date order:

- the event records, and the Runs table of each recurring job;
- the Recent History of each work item that changed (`using-work-tracker`), and the project tasks;
- the sources filed in those days (`sources/README.md`, by date);
- the commits: `git log --since=<date> --all --date=short`;
- the dated lines of Current State.

## Reading what you found

Read each hit whole, in this turn, and check its state:

- Current: it is a fact.
- A proposed record, a proposed section, an unchecked claim, and an entry under "Gotchas and lessons" are not facts. Say what each is when you mention one.
- Replaced: answer from the record that replaces it.
- Retired: history. Leave it out unless he asks for history.
- Past its "check or remove by" date: say so, and check it before you act on it.

Before you act on a remembered claim about something that changes (a vendor, a process, a person's role), check its date and its source. Say so when its last check is older than `references/tidying.md`, "Stale records", allows, or it was never checked.

## Answering

- Cite each source you use, as `.claude/rules/cite-recalled-knowledge.md` says.
- Nothing covers it: say "I don't know; nothing recorded covers that." Never guess.

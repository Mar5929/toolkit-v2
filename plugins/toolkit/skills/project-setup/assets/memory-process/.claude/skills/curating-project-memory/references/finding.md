# Finding what memory holds

Use this file when the owner asks what was recorded or what happened before, or when you need a remembered fact. The goal is an answer that is based on what is recorded, with its source named, and never on a guess.

Finding only reads. When you find a fact that is wrong or old, correct it with `references/saving.md`.

## Where to look, in order

1. **The place where that kind of fact is kept.** The root `AGENTS.md`, section "Where information goes", names the place for each kind of information. Four examples:
   - For a decision, read `DECISIONS.md`, then `system/`, then the work item.
   - For a term, read `system/glossary.md`.
   - For a person's role, read `PROJECT.md`.
   - For a source, read `sources/README.md`.
2. **Memory.** Read the memory records about the subject first. Then read the memory records that are linked to the work item the question is about. `using-memory-store` gives the search.
   - Search by the subject's words and their synonyms.
   - Search by the work item's ID as a whole ID: a search for WI-031 must not find WI-0310.
3. **The work item.** Read the work item when a memory record names one, or when the question is about one. Read it with `using-work-tracker`. Its Questions and Answers hold that work item's own decisions, and its requirements hold what was agreed.
4. **The project's Current State.** It says what is happening now, and never what was decided. A session shows it at its start. To read it again, use `using-memory-store`.

A search of the project's files does not always reach the work items and memory. Before you say that nothing is recorded, search the work items with `using-work-tracker` and memory with `using-memory-store`.

## What happened, and when

For a question about what was done or what changed in a period, such as "what did we do yesterday", read all of these for the dates asked. Then answer in date order.

- The event records, and the Runs table of each recurring job.
- The Recent History of each work item that changed, with `using-work-tracker`, and the project tasks.
- The sources filed in those days. `sources/README.md` lists them by date.
- The commits: `git log --since=<date> --all --date=short`.
- The dated lines of the project's Current State.

## Reading what you found

Read each hit whole, in this turn, and check its status:

- Current: it is a fact.
- Proposed: a proposed memory record and a proposed section are not facts.
- An unchecked claim and an entry under "Gotchas and lessons" are not facts either.
- Replaced: answer from the memory record that replaces it.
- Retired: it is history. Leave it out unless the owner asks for history.
- Past its "check or remove by" date: say so, and check it before you act on it.

When you mention a proposed memory record, a proposed section, an unchecked claim, or a lesson, say what it is.

Some remembered claims are about something that changes, such as a vendor, a process, or a person's role. Before you act on such a claim, check its date and its source. Tell the owner when the claim was never checked, or when its last check is older than `references/tidying.md`, section "Stale records", allows.

## Answering

- Cite each source you use, as `.claude/rules/cite-recalled-knowledge.md` says.
- When nothing covers the question, say "I don't know; nothing recorded covers that." Never guess.

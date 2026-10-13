# Finding what memory holds

Use this file when the owner asks what was recorded or what happened before, or when you need a remembered fact. The goal is an answer that is based on what is recorded, with its source named, and never on a guess.

Finding only reads. When you find a fact that is wrong or old, correct it with `references/saving.md`.

## Where to look, in order

1. **The place where that kind of fact is kept.** The root `AGENTS.md`, section "Where information goes", names the place for each kind of information. Four examples:
   - For a decision, read `DECISIONS.md`, then `wiki/product-wiki/`, then the work item.
   - For a term, read `wiki/product-wiki/glossary.md`.
   - For a person's role, read `PROJECT.md`.
   - For a source, read `sources/INDEX.md`.
2. **Memory.** Read the memory records about the subject first. Then read the memory records that are linked to the work item the question is about. `references/memory-store.md` gives the search.
   - Search by the subject's words and their synonyms.
   - Search by the work item's ID as a whole ID: a search for WI-031 must not find WI-0310.
3. **The work item.** Read the work item when a memory record names one, or when the question is about one. Read it with `managing-work-items`. Its Questions and Answers hold that work item's own decisions, and its requirements hold what was agreed.
4. **The project's Current State.** It says what is happening now, and never what was decided. A session shows it at its start. To read it again, use `references/memory-store.md`.

A search of the project's files does not always reach the work items and memory. Before you say that nothing is recorded, search the work items with `managing-work-items` and memory with `references/memory-store.md`.

## What happened, and when

For a question about what was done or what changed in a period, such as "what did we do yesterday", read all of these for the dates asked. Then answer in date order.

- The event records, and the Runs table of each recurring job.
- The Recent History of each work item that changed, with `managing-work-items`, and the project tasks.
- The sources filed in those days. `sources/INDEX.md` lists them by date.
- The commits: `git log --since=<date> --all --date=short`.
- The dated lines of the project's Current State.

## Reading what you found

Read each relevant record whole, in this turn, and check its source, evidence, uncertainty, and status. Use memory as context, and verify changeable claims against the current authoritative record or system before acting:

- Current: the record remains in use. Its status does not establish that every claim in it is true.
- Replaced: answer from the memory record that replaces it.
- Retired: it is history. Leave it out unless the owner asks for history.
- Past its "check or remove by" date: say so, and check it before you act on it.

An unchecked claim and an entry under "Gotchas and lessons" are not facts, whatever the status of their memory record. When you mention one, say what it is.

Some remembered claims are about something that changes, such as a vendor, a process, or a person's role. Before you act on such a claim, check its date and its source. Use the review and verification policy in `references/tidying.md`, section "Stale records", and disclose uncertainty that matters to the answer or action.

## Answering

- Cite each source you use.
- When nothing covers the question, say "I don't know; nothing recorded covers that." Never guess.

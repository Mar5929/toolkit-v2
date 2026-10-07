# Decisions

<!-- Keep this guide.

What goes here: every decision and open question that more than one work item needs. A decision only one work item needs stays in that work item's Questions and Answers.

Rules for an entry:
- Add or change an entry with `filing-project-records`, step "record a decision".
- One entry per decision or question. Add a new entry at the end of the file.
- The ID is DEC- and three digits. The first entry is DEC-001. The next ID is the highest ID in this file plus one. Never reuse an ID. An entry keeps its ID for as long as the file exists.
- Status is one of four words:
  - Open: a question that waits for an answer. Decided says "not yet".
  - Decided: the person named in Decided gave the answer on that date.
  - Superseded: a later decision replaced this one. "Replaces or replaced by" names it.
  - Withdrawn: dropped, with no replacement. Why says the reason.
- An entry becomes Decided only on the answer of a person who may decide it: the owner, or the person `PROJECT.md` names for that kind of decision.
- Never delete an entry. Never change the Decision text of a Decided entry: add a new entry, and set the old one to Superseded.
- Name work items, rules, and sources by ID (WI-031, SEC-04, SRC-012). Never copy their text here.
- Each work item under Affects of an Open or Decided entry names the DEC ID on its Related items line.
- `.claude/hooks/validate-records.mjs` checks the entries after each edit and before each commit. Fix what it reports.

Entry form:

## DEC-001: <short title>

- Status: <Open, Decided, Superseded, or Withdrawn>
- Raised: <YYYY-MM-DD>, <who raised it>
- Decided: <YYYY-MM-DD>, <who decided>; or "not yet"
- Decision: <the decision in one or two sentences; for an Open entry, the exact question>
- Why: <the reason for the decision, or why the question matters>
- Affects: <work item IDs and rule IDs, or "none yet">
- Replaces or replaced by: <"replaces DEC-###", "replaced by DEC-###", or "none">
- Sources: <SRC-### for each source it is based on, or "none">
-->

## DEC-001: Oldest iOS version the app supports

- Status: Decided
- Raised: 2026-09-28, the agent, in WI-033 (Q-02)
- Decided: 2026-09-28, Mike
- Decision: The app supports iOS 17 and newer.
- Why: Every beta tester has a recent phone, and one oldest version for the whole app keeps the screens and the chart on the same tools.
- Affects: WI-031, WI-033
- Replaces or replaced by: none
- Sources: none

## DEC-002: Testers outside the United States

- Status: Open
- Raised: 2026-09-29, Bea Hollis
- Decided: not yet
- Decision: Do people who live outside the United States join the first beta?
- Why: A tester in another country needs another currency, and the first version may support US dollars only.
- Affects: WI-031
- Replaces or replaced by: none
- Sources: SRC-001

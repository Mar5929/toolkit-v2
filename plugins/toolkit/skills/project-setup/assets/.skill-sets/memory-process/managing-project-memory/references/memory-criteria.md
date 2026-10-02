# Memory criteria

What is worth keeping in lasting memory in this project. Rules in `.claude/rules/owner-preferences.md` override this page.

## Default test for lasting memory

Save a concept when it concerns this project, has a credible source, would matter in a future session, would be costly or unreliable to reconstruct, and has no better maintained owner. Prefer updating an existing concept: a new fact goes under a heading of the concept it belongs to, and a new record is only for a new concept. A lesson the agent learned and has not proven yet goes under the concept's "Gotchas and lessons" heading; when it recurs or the owner confirms it, the agent proposes it as a rule or a skill. A short pointer to an authoritative record can qualify when future sessions would otherwise miss that record.

| Kind | Usually worth retaining | Route or reject instead |
| --- | --- | --- |
| user | Relevant role, responsibility, or fact about the owner he stated | Personal judgments, irrelevant biography, private details, a working preference or correction (a rule in `.claude/rules/owner-preferences.md`) |
| project | Durable project constraint, rationale (why a part of the project exists or how it is used), the main parts of the system and where they are, or proven costly fix | A decision (its work item's Questions and Answers; a project-wide one also a decision record, below), code summary, schema copy, active ticket status, accepted requirement or design body, an instruction for how the agent works (a rule) |
| reference | Hard-to-rediscover route to a source, system, dashboard, or outside decision document, with why to open it | Entire outside page or a path already obvious in `PROJECT.md` or the project map |
| event | Significant project episode, one per record: what was done, what resulted, and where the output lives | Routine edit, tool call, raw error, daily progress log |
| decision | A decision that matters beyond its work item, one per record: the decision in one sentence, how to apply it, and a link back to the work item naming the Q-ID of its Questions and Answers row | A decision only its own work item needs (that item's Questions and Answers only), the full reasoning (it stays in the work item), an instruction for how the agent works (a rule) |

## Decisions

Every decision made while working an item is saved in its Questions and Answers first, with the owner's words and the date; a decision made with no work item goes where the "Where information goes" table in the root `AGENTS.md` says. A decision also becomes a decision record only when it matters beyond the item. The test: "Will a later work item, or an agent working on something else, need to follow this?" Project-wide and architectural decisions pass; choices that affect only the item do not.

## Never save as lasting memory

- Secrets, credentials, sensitive personal data, transcripts, scratch reasoning, raw logs, dropped guesses, or unsupported claims.
- A fact the same change already places in the authoritative file, unless a small route to that file is genuinely needed.
- Live status, pending approval, unshipped requirements, procedure steps, code restatements, or a current-system explanation that the code/System Guide owns.
- A rejected candidate under a new name or wider wording. A rejection stands until the owner changes it.

# Memory criteria

This file is the project-specific selection policy: what is worth keeping in lasting memory. The approval policy, including onboarding and trusted mode, is in the memory save skill, which saves memory. An instruction for how the agent works (a working preference, a correction, "from now on", "always", "never") is not memory: the memory save skill writes it to `.claude/rules/owner-preferences.md`. When the owner corrects what is worth saving, write the correction there as a general rule, without copying the rejected memory. Those rules override this page.

## Default test for lasting memory

Save a topic when it concerns this project, has a credible source, would matter in a future session, would be costly or unreliable to reconstruct, and has no better maintained owner. Prefer updating an existing topic: a new fact goes under a heading in the topic file for its concept, and a new file is only for a new concept. A lesson the agent learned and has not proven yet goes under the concept's "Gotchas and lessons" heading; when it recurs or the owner confirms it, the agent proposes it as a rule or a skill. A short pointer to an authoritative record can qualify when future sessions would otherwise miss that record.

| Type and filename | Usually worth retaining | Route or reject instead |
| --- | --- | --- |
| `user_<topic>.md` | Relevant role, responsibility, or fact about the owner he stated | Personal judgments, irrelevant biography, private details, a working preference or correction (a rule in `.claude/rules/owner-preferences.md`) |
| `project_<topic>.md` | Durable project constraint, rationale (why a part of the project exists or how it is used), the main parts of the system and where they are, or proven costly fix | A decision (its work item's Questions and Answers; a project-wide one also a `decision_` record, below), code summary, schema copy, active ticket status, accepted requirement or design body, an instruction for how the agent works (a rule) |
| `reference_<topic>.md` | Hard-to-rediscover route to a source, system, dashboard, or outside decision document, with why to open it | Entire outside page or a path already obvious in `PROJECT.md` or the project map |
| `event_<topic>.md` | Significant project episode, one per file: what was done, what resulted, and where the output lives | Routine edit, tool call, raw error, daily progress log |
| `decision_<short-name>.md` | A decision that matters beyond its work item, one per file: the decision in one sentence, how to apply it, and a link back to the work item naming the Q-ID of its Questions and Answers row | A decision only its own work item needs (that item's Questions and Answers only), the full reasoning (it stays in the work item), an instruction for how the agent works (a rule) |

## Decisions

Every decision made while working an item is saved in its Questions and Answers first, with the owner's words and the date; a decision made with no work item goes where the "Where information goes" table in the root `AGENTS.md` says. A decision also becomes a `decision_` record only when it matters beyond the item. The test: "Will a later work item, or an agent working on something else, need to follow this?" Project-wide and architectural decisions pass; choices that affect only the item do not.

## Working context is different

`CURRENT_STATE.md` holds what is happening now: one line per active work item ID, what waits on the owner with no work item, untracked to-dos, and where the next session starts. It can change often. Keep a work item's detailed tasks and status in that item, and where it stands in the item's own Current state. Remove a line the moment it stops being true, and keep each section within its line limit. Do not turn every open task into lasting memory. Do not discard an unresolved owner to-do merely to shorten the file; offer the owner a work item for it instead.

## Never save as lasting memory

- Secrets, credentials, sensitive personal data, transcripts, scratch reasoning, raw logs, dropped guesses, or unsupported claims.
- A fact the same change already places in the authoritative file, unless a small route to that file is genuinely needed.
- Live status, pending approval, unshipped requirements, procedure steps, code restatements, or a current-system explanation that the code/System Guide owns.
- A rejected candidate under a new name or wider wording. A rejection stands until the owner changes it.

## Where this folder lives

This folder is Git-ignored, so it exists only in the main checkout on this computer. Every linked worktree uses the one `memory/` folder in the main checkout (the first path in `git worktree list`). A fresh clone or another computer has no memory here, so the agent does not treat an empty index as evidence that no memory exists; it tells the owner instead.

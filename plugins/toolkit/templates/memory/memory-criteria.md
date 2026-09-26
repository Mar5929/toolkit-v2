# Memory criteria

What is worth keeping in this project's memory. The `memory-save` skill holds
the approval policy; `.toolkit.json` `memory.approval` says which mode is on.
This file is not edited. When the owner corrects what is worth saving, save his
correction as a `feedback` record with `memory-save`, as a general rule,
without copying the rejected memory. Those records override this page.

## The test

Save a record when it concerns this project, has a credible source, would
matter in a future session, would be costly or unreliable to reconstruct, and
has no better home. Prefer updating an existing record. A short pointer to an
authoritative record can qualify when future sessions would otherwise miss it.

| Type (key prefix) | Usually worth keeping | Send elsewhere or reject |
| --- | --- | --- |
| `user_` | A role, responsibility, working preference, or communication need the owner stated | Personal judgments, unrelated biography, private details |
| `feedback_` | A standing correction to how the agent works; a confirmed selection lesson | One-off irritation; an instruction already in `AGENTS.md` or a rule |
| `project_` | A lasting constraint, rationale, technical landmark, or costly fix | Decisions for the whole project (`DECISIONS.md`); code summaries; work-item status; requirement or design text |
| `reference_` | A hard-to-find route to a source, system, dashboard, or record, and why to open it | A whole outside page (`ai-external-knowledge/`); a path already in `AGENTS.md` or `PROJECT.md` |
| `event_` | A significant episode: what was done, what resulted, where the output lives | Routine edits, tool calls, raw errors, daily progress |

## Working context is different

The current focus holds what is happening now: active work item IDs, what waits
on the owner with no work item, untracked to-dos, and where the next session
starts. It changes often and is not lasting memory. Never drop an unresolved
owner to-do just to shorten it.

## Never save

- Secrets, credentials, email addresses, sensitive personal data, transcripts,
  scratch reasoning, raw logs, dropped guesses, or unsupported claims.
- Work-item status, pending approvals, unshipped requirements, procedure steps,
  or anything another file already owns, unless a short pointer is needed.
- A rejected candidate under a new name or wider wording. A rejection stands
  until the owner changes it.

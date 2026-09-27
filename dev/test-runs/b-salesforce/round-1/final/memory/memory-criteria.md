# Memory criteria

This file is the project-specific selection policy: what is worth keeping in lasting memory. The approval policy, including onboarding and trusted mode, is in the `memory-save` skill, which saves with `toolkit memory save`. When the owner corrects what is worth saving, save the correction as a `feedback` memory with `memory-save`, as a general rule, without copying the rejected memory. Those `feedback` memories override this page.

## Default test for lasting memory

Save a topic when it concerns this project, has a credible source, would matter in a future session, would be costly or unreliable to reconstruct, and has no better maintained owner. Prefer updating an existing topic. A short pointer to an authoritative record can qualify when future sessions would otherwise miss that record.

| Type and filename | Usually worth retaining | Route or reject instead |
| --- | --- | --- |
| `user_<topic>.md` | Relevant role, responsibility, working preference, or communication need the owner stated | Personal judgments, irrelevant biography, private details |
| `feedback_<topic>.md` | Repeated or standing correction to how the agent should work; confirmed selection lesson | One-off irritation, a rejected fact restated as policy, an instruction already in `AGENTS.md` |
| `project_<topic>.md` | Durable project constraint, rationale, technical landmark, or proven costly fix | A decision for the whole project (`DECISIONS.md`), code summary, schema copy, active ticket status, accepted requirement or design body |
| `reference_<topic>.md` | Hard-to-rediscover route to a source, system, dashboard, or decision record, with why to open it | Entire outside page or a path already obvious in `PROJECT.md` or the project map |
| `event_<topic>.md` | Significant project episode: what was done, what resulted, and where the output lives | Routine edit, tool call, raw error, daily progress log |

## Working context is different

`CURRENT_FOCUS.md` holds what is happening now: active work item IDs, what waits on the owner with no work item, untracked to-dos, and where the next session starts. It can change often. Keep a work item's detailed tasks and status in that item. Do not turn every open task into lasting memory. Do not discard an unresolved owner to-do merely to shorten the file.

## Never save as lasting memory

- Secrets, credentials, sensitive personal data, transcripts, scratch reasoning, raw logs, dropped guesses, or unsupported claims.
- A fact the same change already places in the authoritative file, unless a small route to that file is genuinely needed.
- Live status, pending approval, unshipped requirements, procedure steps, code restatements, or a current-system explanation that the code/System Guide owns.
- A rejected candidate under a new name or wider wording. A rejection stands until the owner changes it.

## Backup

This folder is Git-ignored. Back it up with `toolkit memory export --to <folder outside this project>` and restore a fresh clone with `toolkit memory import --from <that folder>`. Linked worktrees resolve to one vault in the main checkout. A fresh clone or machine needs its memory restored before the agent treats an empty index as evidence that no memory exists.

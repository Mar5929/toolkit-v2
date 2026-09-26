# Memory records, current focus, and glossary

Detail for `memory-save`, `memory-find`, and `memory-tidy`. The approval
policy is not here; it is written only in `memory-save` step 3.

## What belongs in memory

Save a record when all of these hold: it concerns this project or its owner;
it has a credible source; it will matter in a later session; it is costly to
work out again; and no better home owns it.

| Type | Usually worth saving | Send elsewhere instead |
| --- | --- | --- |
| `user` | The owner's lasting preferences, working style, and constraints ("explain things simply", "no Docker") | Personal details the owner did not ask to keep |
| `feedback` | A correction or a standing instruction to the agent ("never force-push", "use tabs") | A rule for every agent in this repository: propose a rule-file change |
| `project` | Facts about the project that outlive one work item (why the billing module is split, which org is the source of truth) | The state of a work item: it stays in the item |
| `reference` | Hard-to-find pointers (where the API keys are managed, which dashboard shows errors, the backup folder) | Secrets themselves |
| `event` | One episode that will matter later, at most one per work item (a costly fix, a surprising platform limit) | A session transcript or a list of what was done |

Never save:

- secrets, tokens, passwords, or API keys;
- email addresses or other personal contact details;
- work-item status, next steps, or blockers (the tracker owns them);
- requirements that are not delivered yet (the work item owns them);
- restatements of code;
- a candidate the owner declined, reworded.

## Keys and fields

- `--name` takes the slug: lowercase words joined by hyphens, short and
  specific, for example `no-force-push`.
- The key is `<type>_<slug>` with every hyphen in the slug turned into an
  underscore: `--type feedback --name no-force-push` makes the key
  `feedback_no_force_push`. Use the key with `get`, `retire`, `restore`,
  `delete`, `--supersedes`, and `--superseded-by`; the CLI rejects the
  hyphen form there. `toolkit memory save` prints the key it made.
- The description is one line, under 100 characters: what a future session
  would search for.
- The CLI writes the frontmatter (`name`, `type`, `description`, `status`,
  `superseded_by`, `source`, `saved`, `last_verified`). Never write it by
  hand.
- Status: `current`, `needs-review`, or `retired`. A replaced record is
  retired with `superseded_by` pointing to its replacement.

## Body file for `toolkit memory save`

The file holds the Markdown body only, without frontmatter:

```markdown
# No force-push

**Remember:** Never force-push to any branch in this repository.

**Why:** The owner lost a day of work to a force-push on 2026-09-12.

**How to apply:** Use a merge or a new commit instead. If a push is rejected, pull first.

**Evidence and limits:** Source: the owner, in chat, 2026-09-26. Applies to every branch, including work-item branches.

**Related:** feedback_merge_only_by_pull_request
```

- Dates are absolute (`2026-09-26`), never "today" or "last week".
- The source line says who or what the fact came from and when.
- Related lists other memory keys, decision ids (`D-4`), or work item ids.

## Current focus

`toolkit memory focus` prints it; `--set-file` replaces it. Four sections, in
this order, under 50 lines in total:

```markdown
# Current focus

## Now

- WI-012 CSV export
- WI-015 Large exports (sub-item of WI-012)

## Waiting on the owner

- Pick a hosting provider before the first deploy (no work item yet)

## Untracked to-dos

- Email the client about the October demo

## Next session starts with

- Continue WI-012 at P1-T02; the endpoint test is failing on empty reports.
```

- Now: work item ids and titles only, never their status. The tracker holds
  the status.
- Waiting on the owner: only things with no work item. Work items that wait
  on him are listed by `toolkit work decisions`.
- Untracked to-dos: personal to-dos with no work item. When one becomes a
  work item, replace it with the id under Now.
- Next session starts with: one entry, replaced at each handoff.

## Glossary

`toolkit memory glossary` prints it; `--set-file` replaces it. One table:

```markdown
| Term | System or context | Meaning here | Distinction or alias | Source | Status / last checked |
|---|---|---|---|---|---|
| Account | Salesforce | A customer company | Not a login account | Owner, 2026-09-26 | Current, 2026-09-26 |
```

Then a "Naming changes and aliases" list, one line each: the old term, the
preferred term, the reason, the source, and the date.

## Backends

- Built-in: `.memory/` in the main checkout, Git-ignored, shared by every
  worktree. `.memory/MEMORY.md` is generated; never edit it by hand.
- Hindsight: the local server at `127.0.0.1:8888`, one bank per project.
  `toolkit memory find <query> --reflect` asks the local model for a combined
  answer.
- Notion: the project's Memory database; focus and glossary are pages under
  the project page.
- Every backend uses the same commands. Only the CLI writes memory.

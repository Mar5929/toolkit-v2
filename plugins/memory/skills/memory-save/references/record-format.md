# Memory records, current focus, and glossary

Detail for `memory-save`, `memory-find`, and `memory-tidy`. The approval
policy is not here; it is written only in `memory-save` step 3.

The formats are the model project's `.memory/` formats: the topic template
(`project_topic_template.md`), `CURRENT_FOCUS.md`, `MEMORY.md`,
`memory-criteria.md`, and `terminology-glossary.md`. With built-in memory the
project has its own copies in `.memory/`; its `AGENTS.md` there is the folder's
rule. Every backend (built-in, Hindsight, Notion) keeps the same fields and
the same body. Only the `toolkit memory` commands write memory.

## What belongs in memory

With built-in memory, `.memory/memory-criteria.md` is the project's selection
policy. Read it before choosing. `feedback` memories about what is worth
saving override it. With Hindsight or Notion memory there is no
`.memory/` folder, so the policy is the text below, copied word for word from
the model's `.memory/memory-criteria.md` (its "Default test for lasting
memory" and "Never save as lasting memory" sections). Where a project's own
`memory-criteria.md` differs from this copy, the project's file wins.

Save a topic when it concerns this project, has a credible source, would matter in a future session, would be costly or unreliable to reconstruct, and has no better maintained owner. Prefer updating an existing topic. A short pointer to an authoritative record can qualify when future sessions would otherwise miss that record.

| Type and filename | Usually worth retaining | Route or reject instead |
| --- | --- | --- |
| `user_<topic>.md` | Relevant role, responsibility, working preference, or communication need the owner stated | Personal judgments, irrelevant biography, private details |
| `feedback_<topic>.md` | Repeated or standing correction to how the agent should work; confirmed selection lesson | One-off irritation, a rejected fact restated as policy, an instruction already in `AGENTS.md` |
| `project_<topic>.md` | Durable project constraint, rationale, technical landmark, or proven costly fix | A decision for the whole project (`DECISIONS.md`), code summary, schema copy, active ticket status, accepted requirement or design body |
| `reference_<topic>.md` | Hard-to-rediscover route to a source, system, dashboard, or decision record, with why to open it | Entire outside page or a path already obvious in `PROJECT.md` or the project map |
| `event_<topic>.md` | Significant project episode: what was done, what resulted, and where the output lives | Routine edit, tool call, raw error, daily progress log |

Never save as lasting memory:

- Secrets, credentials, sensitive personal data, transcripts, scratch reasoning, raw logs, dropped guesses, or unsupported claims.
- A fact the same change already places in the authoritative file, unless a small route to that file is genuinely needed.
- Live status, pending approval, unshipped requirements, procedure steps, code restatements, or a current-system explanation that the code/System Guide owns.
- A rejected candidate under a new name or wider wording. A rejection stands until the owner changes it.

The `memory-save` skill adds one limit of its own in every backend: never
store email addresses.

## Keys and file names

- `--name` takes the topic slug: lowercase words joined by hyphens, short and
  specific, for example `no-force-push`.
- The key is `<type>_<slug>` with every hyphen in the slug turned into an
  underscore: `--type feedback --name no-force-push` makes the key
  `feedback_no_force_push`. `toolkit memory save` prints the key it made.
- The key is also the file name without `.md` (`feedback_no_force_push.md`)
  and the frontmatter `name`. The file name prefix and `metadata.type` always
  agree.
- Always write a key with underscores: with `get`, `retire`, `restore`,
  `delete`, `--supersedes`, and `--superseded-by`, and in a link. The CLI also
  finds a record from the hyphen form, but it stores and prints only the
  underscore key, and a link is text that must name the real file.
- The description is one line, under 100 characters: what a future session
  would search for.

## Frontmatter

The CLI writes the frontmatter from the command's flags. Never write it by
hand. A saved topic starts like this:

```yaml
---
name: feedback_no_force_push
description: Never force-push to any branch; use a merge or a new commit
metadata:
  type: feedback
status: current
source: The owner, in chat, 2026-09-26
last_verified: 2026-09-26
authorization: Approved by Mike on 2026-09-26
supersedes: none
---
```

| Field | What it holds | Set by |
| --- | --- | --- |
| `name` | The key, the same as the file name without `.md` | `--type` and `--name` |
| `description` | One line a future session would search for | `--description` |
| `metadata.type` | `user`, `feedback`, `project`, `reference`, or `event` | `--type` |
| `status` | `current` or `needs-review` for a live record. `needs-review` also marks a proposal: a record saved with `--proposal` because the owner did not answer "Save to memory?" (its `authorization` says "Proposed by the agent on <date>"). The agent does not rely on a `needs-review` record until it is checked or approved. A retired record is stored as `superseded` (another record replaced it) or `archived` (no replacement). The value `template` marks only the seed template. | `--status`, `--proposal`, `retire`, `restore`, `approve` |
| `source` | The person, conversation, or document the fact came from, with an absolute date | the `--source` flag |
| `last_verified` | The date the fact was last checked, or `unknown` | the `--last-verified` flag |
| `authorization` | What authorized the save: "Approved by <name> on <date>" for the owner's request or his yes, or "Trusted grant" for a routine save in trusted mode | `--approved-by` writes the first; a save with no approver in trusted mode writes the second; the `--authorization` flag sets other words |
| `supersedes` | The key this record replaces, or `none` | `--supersedes` |

Any other frontmatter field, written by a host, an import, or the CLI itself,
is kept when the record is saved again. Saving the same type and slug again,
with `--expect <version>` (the `version` field of
`toolkit memory get <key> --json`; the first 12 characters are enough),
updates that record and keeps fields that are not given again. The text form
of `toolkit memory get` shows no version.

## Body

The body for `toolkit memory save` (`--body-file -` on standard input in
Claude Code, `--body '<text>'` or a file in Codex) holds the Markdown body
only, without frontmatter. It uses the model template's labels, in bold, each
starting its own paragraph, in this order. Never write them as `## Remember`
headings:

```markdown
# No force-push

**Remember:** Never force-push to any branch in this repository.

**Why:** The owner lost a day of work to a force-push on 2026-09-12.

**How to apply:** Use a merge or a new commit instead. If a push is rejected, pull first.

**Evidence and limits:** The owner, in chat, 2026-09-26. Applies to every branch, including work-item branches.

**Related memories:** [merge only by pull request](feedback_merge_only_by_pull_request.md)

**Authoritative records:** `DECISIONS.md` D-4; WI-012.
```

- Dates are absolute (`2026-09-26`), never "today" or "last week".
- **Why** is the owner's reason in his words, or "Not stated by the owner."
  when he gave none. Never write a reason the agent inferred: a later answer
  would present it as his.
- Keep uncertainty explicit under Evidence and limits.
- Write "None." after a label that has nothing. Do not invent a related note
  or record to fill it.

## Links between memories

Built-in memory is one flat folder that the owner can open as an Obsidian
vault. Notes link to each other the Obsidian way, with relative Markdown
links:

- Link a related note by its file name, for example
  `[merge only by pull request](feedback_merge_only_by_pull_request.md)`.
  Use Markdown links, not `[[wikilinks]]`.
- Link only when the relationship helps a future session find it, and check
  that the target exists (`toolkit memory get <key>`). Obsidian shows the
  backlink on the linked note, so a reverse link is optional.
- Anything outside memory (work item ids, `DECISIONS.md` rows, files in
  `requirements/` or `system-guide/`, tracker links) goes under Authoritative
  records as a plain reference, not a vault link.
- Write the same links in every backend. The body text is the same
  everywhere.

The CLI keeps links working. When a record is renamed (with
`toolkit memory rename <key> --to <new-key>`, or by a save under a new name
with `--supersedes`), merged, retired, or deleted, the CLI repairs every link
to it in the other notes, the current focus, and the glossary, and names each
note it changed:

- renamed, merged, or superseded: the link points at the new note;
- archived (retired with no replacement): the link text stays, followed by
  "(archived)", and the note moves to `.memory/archive/`;
- deleted: the link text stays, without the link.

Read that report. A link must never point at a former location.
`toolkit memory status` lists any link whose target does not exist; correct
that note with `toolkit memory save`.

## Proposals

An unanswered "Save to memory?" is not dropped. `memory-save` saves it with
`--proposal` and no approver: status `needs-review`, authorization "Proposed
by the agent on <date>". `toolkit work decisions` and the session briefing
list it among the decisions for the owner, and `work-decide` asks him:

- yes: `toolkit memory approve <key> --by <owner>` makes it `current`, with
  him as the approver;
- no: `toolkit memory reject <key>` deletes the proposal. A rejection stands:
  never propose the same fact again under other words.

Until then it is not a fact. `toolkit memory find` leaves it out unless
`--proposals` is given, and `memory-find` says it is unapproved. A proposal
never replaces a record the owner approved.

## Duplicates

`toolkit memory save` checks for a record with the same key, or with a very
similar description or text. When it finds one or more, it saves nothing,
exits with code 2, and lists them by key with the reason. Read each one
(`toolkit memory get <key> --json`), then:

- the same fact: save that record's type and slug again with
  `--expect <version>`, where the version is the `version` field of that
  read (the first 12 characters are enough), which updates it. When the
  listed record has the same key, the command's fix line already gives the
  version;
- a newer fact that replaces it: save with `--supersedes <old-key>`;
- a different fact: say why in one line, then save again with
  `--allow-similar`.

## Replacing, retiring, and merging

- Correct or merge in place where possible: save the existing key again,
  with `--expect <version>` from `toolkit memory get <key> --json`. Without
  `--expect`, a save of an existing key exits with code 2 and saves nothing.
- A better name for the same record, or a file name whose prefix does not
  match `metadata.type`: rename it. The new key sets the new type and name.
  The record keeps its content; links to it and `supersedes` entries that name
  it are repaired.

  ```text
  toolkit memory rename <key> --to <new-key>
  ```

- Replacing a record under a new key: save the new record with
  `--supersedes <old-key>`. The old record is stored as `superseded`, and its
  body starts with a line naming the record that replaced it, so it never
  reads as currently true.
- A duplicate that is not saved again is retired and points at the record
  that replaces it:

  ```text
  toolkit memory retire <key> --superseded-by <new-key>
  ```

- Retiring with no replacement archives the record: it is stored as
  `archived` and moves to `.memory/archive/` in built-in memory.
- Retire before delete. A retired record can be restored; a deleted one
  cannot. `toolkit memory list --status retired` lists superseded and
  archived records.

## The index

With built-in memory, `.memory/MEMORY.md` is generated in the model's layout:
its title and short paragraph, one line per topic under the headings User,
Feedback, Project, Reference, and Event, then "Other memory views" (current
focus, memory criteria, glossary). Each line is a link to the file and its
description, for example
`- [feedback_no_force_push.md](feedback_no_force_push.md) — Never force-push to any branch`.

- A current record has no mark after its line.
- A record marked for review ends with "[needs-review]".
- A superseded record stays listed and ends with "[superseded]", so the index
  never presents an obsolete claim as current. Its body also starts with a
  line naming the record that replaced it.
- An archived record leaves the index; its file moves to `.memory/archive/`.

`toolkit memory save`, `retire`, `restore`, `rename`, and `delete` rebuild it;
`toolkit memory reindex` rebuilds it after any other change. Never edit it by
hand; the hooks refuse it. Open a topic before relying on its index line.

## Current focus

`toolkit memory focus` prints it; `--set-file` replaces it (standard input,
`--set-file -`, in Claude Code; `--text '<text>'` or a `mktemp -d` file in
Codex). Read it with `--json` for its version and save with
`--expect <version>`, so another session's change is never lost. The model's
format: the `# Current focus` title line, a "Last updated" line, and four
sections in this order, under 50 lines in total. Always write the title and
the "Last updated" line (the command adds them with today's date when they
are missing, but write them yourself so the source and author are right):

```markdown
# Current focus

Last updated: 2026-09-26, handoff, agent

## Now

- WI-012 CSV export
- WI-015 Large exports (sub-item of WI-012)

## Waiting on the owner

- Pick a hosting provider before the first deploy (no work item yet); check again 2026-10-01.

## Untracked to-dos

- Email the client about the October demo.

## Next session starts with

- Continue WI-012 from its Resume here; the endpoint test fails on empty reports.
```

- Last updated: the date, the source, and who wrote it (a person or the
  agent). Change it on every save.
- Now: the current outcome or area, with work item ids and titles only,
  never their status. The tracker holds the status.
- Waiting on the owner: a decision or action only the owner can take that
  has no work item, who needs it, and when to check again. Work items that
  wait on him are listed by `toolkit work decisions`. A setup step (trust the
  hooks in Codex, sign in to Notion) stays only while `toolkit doctor` still
  reports it; drop it at the next focus save after doctor stops reporting it.
- Untracked to-dos: owner requests with no work item. When one becomes a work
  item, replace it with the id under Now.
- Next session starts with: where to resume, what to read, and the next
  action. One entry, replaced at each handoff.
- Write "None." in an empty section. Keep the file under 50 lines by
  replacing stale lines, not by appending, and never drop an unresolved owner
  to-do only to meet the limit.

## Glossary

`toolkit memory glossary` prints it; `--set-file` replaces it. The model's
format keeps its title and its short paragraph, then one table:

```markdown
| Term | System or context | Meaning here | Distinction or alias | Source | Status / last checked |
| --- | --- | --- | --- | --- | --- |
| Account | Salesforce | A customer company | Not a login account | Owner, 2026-09-26 | Current, 2026-09-26 |
```

Then the section "Naming changes and aliases": one line each, the old term,
an arrow, the preferred term, the reason, the source, and the date. Use only
real, sourced terms. A word two systems use differently gets two rows. Never
invent a definition.

## Backends

- Built-in: `.memory/` in the main checkout, Git-ignored, shared by every
  worktree. Back it up with `toolkit memory export --to <folder>` to a folder
  outside the project.
- Hindsight: the local server at `127.0.0.1:8888`, one bank per project.
  `toolkit memory find <query> --reflect` asks the local model for a combined
  answer.
- Notion: the project's Memory page, in the layout of Lore (Notion's
  open-source AI memory): the records are rows of the Memories database on
  that page, beside Lore's Projects, Topics, Entities, and Facts databases.
  The current focus and the glossary are pages under the project page.
- Every backend uses the same commands. Only the CLI writes memory.

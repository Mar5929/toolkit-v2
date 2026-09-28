# Memory record format

Purpose: the exact shape of one memory record (type, key, description,
frontmatter, and body), the same in built-in, Hindsight, and Notion memory.

## Contents

- Types
- Keys and file names
- The description
- Frontmatter
- Body
- Links between records
- What never goes in a record
- Passing the body to the command
- Checklist before a save

The formats are the model project's: the topic template
(`.memory/project_topic_template.md`), `MEMORY.md`, `CURRENT_FOCUS.md`,
`memory-criteria.md`, and `terminology-glossary.md`. Only `toolkit memory`
commands write memory. They write the frontmatter from the flags; you write
the one-line description and the body.

## Types

| Type | Holds | Example key |
| --- | --- | --- |
| `user` | A role, responsibility, working preference, or communication need the owner stated | `user_plain_replies` |
| `feedback` | A standing correction to how the agent works, or a lesson about what to save | `feedback_no_force_push` |
| `project` | A lasting project constraint, reason, technical landmark, or costly fix | `project_deploy_window` |
| `reference` | A hard-to-find route to a source, system, dashboard, or record, with why to open it | `reference_backup_folder` |
| `event` | A significant project episode: what was done, the result, and where the output lives | `event_moved_off_heroku` |

A type that does not match the content is fixed with
`toolkit memory rename <key> --to <new-key>`, never by saving a second record.

## Keys and file names

- `--name` is the slug: lower-case words joined by hyphens, short and
  specific, for example `no-force-push`. The CLI refuses a slug over 60
  characters; it never cuts one.
- The key is `<type>_<slug>` with every hyphen turned into an underscore:
  `--type feedback --name no-force-push` makes `feedback_no_force_push`.
  `toolkit memory save` prints the key it made.
- In built-in memory the key is also the file name without `.md` and the
  frontmatter `name`. The file name prefix and `metadata.type` always agree.
- Write a key with underscores everywhere: in `get`, `retire`, `restore`,
  `delete`, `--supersedes`, `--superseded-by`, and in a link. The CLI also
  finds a key typed with hyphens, but a link is text and must name the real
  file.

## The description

One line that a future session would search for. Aim for under 100
characters; the CLI refuses more than 150 and refuses more than one line.

- Good: `Never force-push to any branch; use a merge or a new commit`
- Too vague: `Git preference`

## Frontmatter

The CLI writes it. Never write it by hand. A saved record starts like this:

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

| Field | Holds | Set by |
| --- | --- | --- |
| `name` | The key | `--type` and `--name` |
| `description` | The one-line description | `--description` |
| `metadata.type` | `user`, `feedback`, `project`, `reference`, or `event` | `--type` |
| `status` | `current`; `needs-review` (also every proposal); `superseded` or `archived` for a retired record; `template` only on the seed template | `--proposal`, `retire`, `restore`, `approve` |
| `source` | Who or what said it, with an absolute date | `--source` |
| `last_verified` | The date the fact was last checked, or `unknown` | `--last-verified` |
| `authorization` | "Approved by <name> on <date>", "Trusted grant", or "Proposed by the agent on <date>" | `--approved-by`, trusted mode, `--proposal` |
| `supersedes` | The keys this record replaced, or `none` | `--supersedes` |

A save of an existing key keeps every field the command does not give again,
including fields another tool added. The CLI calls `superseded` and
`archived` together "retired" (`toolkit memory list --status retired`).

## Body

The body starts with a `# <Title>` line, then six labels, in this order, each
in bold at the start of its own paragraph. Never write a label as a heading
such as `## Remember`.

```markdown
# No force-push

**Remember:** Never force-push to any branch in this repository.

**Why:** The owner lost a day of work to a force-push on 2026-09-12.

**How to apply:** Use a merge or a new commit instead. If a push is rejected, pull first.

**Evidence and limits:** The owner, in chat, 2026-09-26. Applies to every branch, including work-item branches.

**Related memories:** [merge only by pull request](feedback_merge_only_by_pull_request.md)

**Authoritative records:** `DECISIONS.md` D-4; WI-012.
```

- **Remember:** one lasting point, or a few closely related facts, with scope
  and date where they matter.
- **Why:** the owner's reason in his own words, or exactly "Not stated by the
  owner." Never a reason the agent inferred: a later answer would present it
  as his. This is deliberately narrower than the model's topic template,
  whose prompt asks why losing the context would change future work. The
  rule came from the fixes after the sample runs.
- **How to apply:** what a future agent checks or does with it.
- **Evidence and limits:** the source with an absolute date (`2026-09-26`,
  never "today" or "last week"), and any doubt or limit.
- Write "None." after a label that has nothing. Never invent a related record
  to fill it.

## Links between records

- Link a related record with a relative Markdown link to its file name:
  `[deploy window](project_deploy_window.md)`. Never a `[[wikilink]]`.
- Link only when it helps a future session find the record, and check the
  target exists first (`toolkit memory get <key>`).
- Things outside memory (work item ids, `DECISIONS.md` rows, files in
  `requirements/` or `system-guide/`, tracker addresses) go under
  **Authoritative records** as plain text, not as links.
- Write the same links in every backend. The body text is the same
  everywhere, so a move between backends keeps them.
- The CLI repairs links to a record that is renamed, superseded, archived,
  or deleted, and names each record it changed. Read that report.

## What never goes in a record

- Secrets, passwords, keys, or email addresses. The CLI refuses the common
  shapes of a secret (an API key, a token, a private key, a password written
  out) in the description, the source, and the body, and an email address in
  `--source` and in the authorization. It does not catch every secret, or an
  email address in the body; those are the agent's job. When the owner wants
  a secret remembered, save where it is kept, never the secret: "The staging
  key is in 1Password under Staging".
- Work-item status, next steps, or unshipped requirements. The tracker owns
  them.
- A copy of a record that has a better home (a requirement, a design, a
  `DECISIONS.md` row). A short pointer under **Authoritative records** is
  allowed when a future session would otherwise miss that record.
- A fact the owner rejected, under the same or new words.

## Passing the body to the command

- Claude Code: pass it on standard input. Give `--body-file -`, then a quoted
  heredoc, then the body, then a line holding only `EOF`:

  ```text
  toolkit memory save --type feedback --name no-force-push --description 'Never force-push to any branch; use a merge or a new commit' --body-file - --source 'The owner, in chat, 2026-09-26' --approved-by Mike <<'EOF'
  ```

- Codex: give the body in single quotes with `--body '<text>'`. Newlines
  inside the quotes are kept. Write an apostrophe as ’ (the curly
  apostrophe, U+2019), or reword the text. Never `'\''` in Codex: the
  project's command rule does not match that form, so the command runs
  inside the sandbox, and the tool call can drop the backslash. For a long
  body, write a file with the file edit tool in a new folder made with
  `mktemp -d`, run the command alone with `--body-file <that file>`, then
  delete the file and the folder.
- One-line values (`--description`, `--source`) go in single quotes in both
  hosts. An apostrophe in them: Claude Code writes `'\''`; Codex writes ’ or
  rewords.
- Never write the file and run the command in one shell command, and never
  use a fixed name such as `/tmp/memory.md`.

## Checklist before a save

- [ ] The type matches the content (table above).
- [ ] The slug is short and specific; the key is not already in use for
      another fact.
- [ ] The description is one line a future session would search for.
- [ ] The body has the `# Title` line and all six bold labels, in order.
- [ ] **Why** holds the owner's words or "Not stated by the owner."
- [ ] Every date is absolute.
- [ ] Every link under **Related memories** points at a record that exists.
- [ ] No secret, email address, or work-item status.

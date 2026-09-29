<!-- Generated file. Source: plugins/memory/shared/record-format.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# Memory record format

Purpose: the exact shape of one memory record (type, key, description,
frontmatter, and body), the same in built-in, Hindsight, and Notion memory.

## Contents

- One record per concept
- Instructions are rules, not memory
- Types
- Keys and file names
- The description
- Frontmatter
- Body
- Gotchas and lessons
- Links between records
- What never goes in a record
- Passing the body to the command
- Checklist before a save

The formats are the model project's: the topic template
(`.memory/project_topic_template.md`), `MEMORY.md`, `CURRENT_FOCUS.md`,
`memory-criteria.md`, and `terminology-glossary.md`. Only `toolkit memory`
commands write memory. They write the frontmatter from the flags; you write
the one-line description and the body.

## One record per concept

Memory keeps one record per concept or area, not one per fact (the owner's
decision of 2026-09-28). A concept is a subject a future session would look
up as a whole: the billing setup, the deploy process, the owner's role.
Examples: `project_billing`, `project_deploys`, `user_profile`,
`reference_dashboards`.

- Each fact, or group of closely related facts, is one `## <Sub-topic>`
  section inside its concept, with the labels in "Body" below.
- A new fact goes into the concept it belongs to, as a new section or under
  an existing heading. A new record is only for a new concept.
- An `event_` record holds one episode. Events stay their own records.
- There are no starter concepts. A concept is created the first time a fact
  about it is saved.
- The top of every record gives its title (the `# ` line), a one-line summary
  (`description`), and the date of its last change (`updated`). The index and
  `toolkit memory list` show those three.
- A record written before this change holds one fact with no `##` section.
  It stays valid. `toolkit memory tidy --plan` proposes merging such records
  into concepts (the `memory-tidy` skill).
- Every concept ends with a `## Gotchas and lessons` section ("Gotchas and
  lessons" below). The CLI adds it, with "None yet.", to each new concept.

## Instructions are rules, not memory

Rules, skills, and memory each hold one kind of thing (the owner's decision
of 2026-09-29):

- An instruction the agent follows every time (a preference about how work
  is done, a correction, "from now on", "always", "never") is a rule:
  `.claude/rules/owner-preferences.md`, written with `toolkit rule add`
  (`~/.claude/rules/` with `--machine` when it is for every project).
- A procedure that proved itself is a skill (`.claude/skills/<name>/`).
- Memory holds facts and know-how the agent has not proven yet.

The `feedback_` type is retired. `toolkit memory save` refuses a new
`feedback_` record or fact and prints the `toolkit rule add` command. An
older `feedback_` record is still read; `memory-tidy` moves its instructions
to the rules and its facts to concepts, after the owner's yes.

## Types

| Type | Holds | Example concept key |
| --- | --- | --- |
| `user` | Roles, responsibilities, and facts about the owner he stated (not how he wants the agent to work: that is a rule) | `user_profile` |
| `project` | Lasting project constraints, reasons (why a part exists, how it is used), technical landmarks, or costly fixes, one area per concept | `project_billing`, `project_deploys` |
| `reference` | Hard-to-find routes to sources, systems, dashboards, or records, with why to open each | `reference_dashboards` |
| `event` | One significant project episode: what was done, the result, and where the output lives | `event_moved_off_heroku` |

Every section of a concept has the concept's type: a `project` fact goes
into a `project_` concept.

A type that does not match the content is fixed with
`toolkit memory rename <key> --to <new-key>`, never by saving a second record.

## Keys and file names

- `--name` is the slug: lower-case words joined by hyphens, naming the
  concept, for example `deploys` or `billing`. The CLI refuses a slug
  over 60 characters; it never cuts one.
- The key is `<type>_<slug>` with every hyphen turned into an underscore:
  `--type project --name deploy-window` makes `project_deploy_window`.
  `toolkit memory save` prints the key it made.
- In built-in memory the key is also the file name without `.md` and the
  frontmatter `name`. The file name prefix and `metadata.type` always agree.
- Write a key with underscores everywhere: in `get`, `retire`, `restore`,
  `delete`, `--supersedes`, `--superseded-by`, and in a link. The CLI also
  finds a key typed with hyphens, but a link is text and must name the real
  file.

## The description

The concept's one-line summary: what a future session finds in it. Aim for
under 100 characters; the CLI refuses more than 150 and refuses more than one
line. Change it with `--description` when a new section changes what the
concept covers.

- Good: `How deploys work: the window, the release branch, the checks`
- Too vague: `Deploy notes`

For an event, it is the one-line summary of the episode. For a proposal, it
is the one-line fact the owner is asked about.

## Frontmatter

The CLI writes it. Never write it by hand. A saved record starts like this:

```yaml
---
name: project_deploys
description: "How deploys work: the window, the release branch, the checks"
updated: 2026-09-28
metadata:
  type: project
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
| `description` | The concept's one-line summary | `--description` |
| `updated` | The date of the last change. Every save sets it; a link repair keeps it | The CLI |
| `metadata.type` | `user`, `project`, `reference`, or `event` (an older record may say `feedback`) | `--type` |
| `status` | `current`; `needs-review` (also every proposal); `superseded` or `archived` for a retired record; `template` only on the seed template | `--proposal`, `retire`, `restore`, `approve` |
| `source` | Who or what said it, with an absolute date | `--source` |
| `last_verified` | The date the fact was last checked, or `unknown` | `--last-verified` |
| `authorization` | The approval of the concept: "Approved by <name> on <date>", "Trusted grant", "No approval recorded", or "Proposed by the agent on <date>". A section save never changes it (see below) | `--approved-by`, trusted mode, `--proposal` when the record is made, or saved whole |
| `supersedes` | The keys this record replaced (including records merged into it), or `none` | `--supersedes`, `merge` |
| `concept`, `section` | A proposal only: the concept and heading its fact goes to on the owner's yes | `--concept` with `--proposal` |
| `rule_section`, `rule_scope` | A rule proposal only: the section of `.claude/rules/owner-preferences.md` it goes to on the owner's yes | `--rule-section` with `--proposal` |

A save of an existing key keeps every field the command does not give again,
including fields another tool added. The CLI calls `superseded` and
`archived` together "retired" (`toolkit memory list --status retired`).

Each fact's approval: the concept's `authorization` line covers every
section that has no approval of its own. A section save (`--concept`),
`merge`, `split`, and `approve` never rewrite that line. When a fact's
approval differs from it, the CLI adds it to the end of that section's
**Evidence and limits** line, the way `--source` is recorded: "Approved by
Mike on 2026-09-28." or "Saved on 2026-09-28 with no approval recorded."
Replacing the section with the owner's approval takes the "no approval
recorded" words out.

## Body

The body starts with a `# <Title>` line: the concept's title. Then one
`## <Sub-topic>` section per fact or group of closely related facts. Each
section holds six labels, in this order, each in bold at the start of its own
paragraph. Never write a label as a heading such as `## Remember`; a `##`
heading names a sub-topic.

```markdown
# Deploys

## Deploy window

**Remember:** Deploys go out on Tuesdays after 6 pm Eastern.

**Why:** The owner said traffic is lowest then.

**How to apply:** Plan release steps for Tuesday evening. Ask before any other time.

**Evidence and limits:** The owner, in chat, 2026-09-26. Applies to production only.

**Related memories:** [billing](project_billing.md)

**Authoritative records:** `DECISIONS.md` D-4; WI-012.

## Release branch

**Remember:** Releases are cut from the `release` branch, never from `main`.

**Why:** Not stated by the owner.

**How to apply:** Merge `main` into `release` before a deploy.

**Evidence and limits:** The owner, in chat, 2026-09-28.

**Related memories:** None.

**Authoritative records:** None.

## Gotchas and lessons

### The deploy check needs the VPN

The deploy check fails with a timeout when the VPN is off. Turn it on first.

**Seen:** 2026-09-27 (WI-012 build); 2026-09-29 (WI-014 build)
```

- The heading names the sub-topic in a few words ("Force-push", "Deploy
  window"), never a label word. Use `###` for a heading inside a section.
- **Remember:** one lasting point, or a few closely related facts, with scope
  and date where they matter.
- **Why:** the owner's reason in his own words, or exactly "Not stated by the
  owner." Never a reason the agent inferred: a later answer would present it
  as his. This is deliberately narrower than the model's topic template,
  whose prompt asks why losing the context would change future work. The
  rule came from the fixes after the sample runs.
- **How to apply:** what a future agent checks or does with it.
- **Evidence and limits:** the source with an absolute date (`2026-09-26`,
  never "today" or "last week"), and any doubt or limit. Each section keeps
  its own, so where each fact came from stays clear.
- Write "None." after a label that has nothing. Never invent a related record
  to fill it.
- An event record has the same labels under its title, with or without a
  `##` section.

## Gotchas and lessons

The last section of every concept. It holds lessons the agent learned while
working that are not proven yet: what happened and what to do, one `###`
heading each, with a Seen line that gives the date (and the session or work
item) of each time it came up.

- Record one with `toolkit memory save --concept <key> --lesson '<heading>'`
  and the text in `--body`. The same heading again is the same lesson seen
  again: the CLI adds today's date to its Seen line.
- A lesson needs no approval: nothing relies on it as a rule.
- A lesson proves itself when it comes up in two or more sessions, when a
  lesson like it is in another concept, or when the owner confirms it
  ("**Owner confirmed:** <date>"). Then the agent proposes it as a rule or a
  skill with `toolkit memory promote`; after the owner's yes the lesson gets a
  line "**Promoted:** <date>, to <where>." and stays as its history.
- An instruction the owner gives is never a lesson: it is a rule at once.

## Links between records

- Link a related record with a relative Markdown link to its file name:
  `[billing](project_billing.md)`. To point at one section, add `#` and the
  heading with each space written `%20`:
  `[deploy window](project_deploys.md#Deploy%20window)`. Obsidian opens that
  section. Never a `[[wikilink]]`.
- Link only when it helps a future session find the record, and check the
  target exists first (`toolkit memory get <key>`).
- Things outside memory (work item ids, `DECISIONS.md` rows, files in
  `requirements/` or `system-guide/`, tracker addresses) go under
  **Authoritative records** as plain text, not as links.
- Write the same links in every backend. The body text is the same
  everywhere, so a move between backends keeps them. In Notion the page shows
  a link to another record as a link to its page (a page mention when the
  link text is that record's title); a link to a section stays a file link.
  Reading it back gives the file link again.
- The CLI repairs links to a record that is renamed, superseded, archived,
  deleted, merged into a concept (the link then goes to its section), or
  whose sections move to another concept (`split`), and names each record it
  changed. Read that report.

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
  toolkit memory save --concept project_deploys --section 'Deploy window' --body-file - --source 'The owner, in chat, 2026-09-26' --approved-by Mike <<'EOF'
  ```

- For one section (`--concept ... --section ...`) the text is that section
  only: the labels, with no `# ` title and no `##` heading of its own.

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

- [ ] The fact goes into the concept it belongs to; a new record only for
      a new concept. The concepts of a type: `toolkit memory list --type <type>`.
- [ ] The type matches the content (table above), and the concept's type.
- [ ] The section heading names the sub-topic in a few words.
- [ ] A new concept's slug names the concept, not one fact.
- [ ] The description is the concept's one-line summary (a proposal: the fact).
- [ ] Each section has all six bold labels, in order; a new concept also
      has its `# Title` line.
- [ ] **Why** holds the owner's words or "Not stated by the owner."
- [ ] Every date is absolute.
- [ ] Every link under **Related memories** points at a record that exists.
- [ ] No secret, email address, or work-item status.

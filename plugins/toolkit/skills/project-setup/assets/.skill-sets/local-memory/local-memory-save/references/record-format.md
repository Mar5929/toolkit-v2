<!-- Shared text from the Toolkit V2 repository (dev/build-shared/local-memory/record-format.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Local memory file format

How to mark a memory file as proposed, superseded, retired, or withdrawn. The project's own seeds, `memory/project_topic_template.md` and `memory/decision_template.md`, hold the file shape, and `memory/AGENTS.md` holds the rules for the folder.

## File names and size

- File name: `<prefix>_<name>.md`, lower-case words joined by underscores, naming the concept, not one fact. At most 60 characters before `.md`.
- Split a concept that grows too large (about 20 sections or 300 lines) into two concepts, with `local-memory-refine`.

## Status

| Status | Meaning | In the generated index |
| --- | --- | --- |
| `current` | In use. | Listed |
| `needs-review` | A new file the owner has not approved yet. Never rely on it. | Listed; its description starts "Proposal, not approved yet:" |
| `superseded` | Replaced by another file, named in its first body line. | Left out |
| `retired` | No longer true, and nothing replaces it. | Left out |
| `withdrawn` | Decision files only: the owner withdrew the decision. | Left out |
| `template` | The two seeds only. | Left out |

A decision file is only ever `current`, `superseded`, or `withdrawn`. An unanswered "Save it to memory too?" is a Current State line, never a `needs-review` decision file.

## Proposals, superseded, and retired text

Mark what is not current in three places: the status, the description, and the body. Then the index and a reader both see it.

| Case | Status | Description starts | Body |
| --- | --- | --- | --- |
| A new file the owner has not approved | `needs-review` | `Proposal, not approved yet:` | Normal body |
| A new section in an existing concept, not approved | File unchanged | File unchanged | The section's first line: `**Proposal, not approved yet:** asked on <date>. Do not rely on this until the owner says yes.` |
| Replaced by another file | `superseded` | `Superseded by <file>:` | First line under the title: `**Superseded by:** [<title>](<file>.md) on <date>.` |
| No longer true, nothing replaces it | `retired` | `Retired <date>:` | First line under the title: `**Retired:** <date>. <reason, in the owner's words when he gave one>` |
| A decision the owner withdrew | `withdrawn` | `Withdrawn <date>:` | First line under the title: `**Withdrawn:** <date>. <his words>` |

- A superseded, retired, or withdrawn file keeps its body as history. Never answer from it as if it were current.
- A section that is no longer true inside a current concept is corrected in place, or removed. It is never left reading as current.

## Links between memories

- Link another memory file with a relative Markdown link to its file name: `[billing](project_billing.md)`.
- Link one section with `#` and the heading, each space written `%20`: `[deploy window](project_deploys.md#Deploy%20window)`.
- Name records outside `memory/` (requirements, designs, other files) by path or web address under **Authoritative records**.

## Gotchas and lessons

The last section of every concept holds lessons the agent learned and has not proven yet.

- One `###` heading per lesson: what happened and what to do.
- **Seen:** the date, and the session or work item, of each time it came up. The same lesson again adds a date to its Seen line. **Owner confirmed:** `<date>` when he confirms it.
- A lesson has proved itself when it came up in two or more sessions, a lesson like it is in another concept, or the owner confirmed it. Then `local-memory-refine` proposes it as a rule or a skill. After his yes the lesson gets **Promoted:** `<date>, to <where>` and stays as its history.
- An instruction the owner gives is never a lesson: it is a rule at once.

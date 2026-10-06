# Memory file format (local files)

The blank form holds the file shape: `memory/project_topic_template.md`. Open it when you make a file (`folders-and-files.md`, "Making a file from the blank form"). This file holds what the blank form does not say: what each field means, the statuses, the marks, and the links.

## Contents

- Header fields
- Status
- Marks for what is not current
- Body layout
- Links between memories
- Links to work items
- Gotchas and lessons
- The Runs table
- A file is right when

## Header fields

| Field | Holds |
| --- | --- |
| `name` | The file name without `.md`. |
| `description` | One short line that states what the file holds, with its dates: the fact itself, not only its subject. The index prints it whole. |
| `created` | The date the file was made, `YYYY-MM-DD`. Never change it. |
| `updated` | The date of the last change, `YYYY-MM-DD`. Set it to today on every change. |
| `check_by` | The date to check or remove the file, `YYYY-MM-DD`, for a fact that is true only for a while; otherwise `none`. A single section with its own date carries a `**Check or remove by:**` line. |
| `metadata.type` | The file's prefix: `user`, `project`, `reference`, or `event`. |
| `status` | One of the values under "Status". |
| `source` | The person, conversation, or document the fact came from, with its absolute date. |
| `last_verified` | The date the fact was last checked against its source, or `unknown`. |
| `authorization` | `Approved by <owner> on <date>`, `Trusted grant, <date>`, or `Proposed by the agent on <date>; not approved`. An event or a run the agent logged: `Logged by the agent on <date>`. |
| `work_items` | One entry for each related work item (see "Links to work items"), or `[]` when none applies. |
| `supersedes` | The file name this file replaces, or `none`. |

Keep any other field a host or an import wrote. A file made before `created` and `check_by` existed gets them at its next change: `created` from the oldest date the file shows, and `check_by: none`.

## Status

| Status | Meaning | In the index |
| --- | --- | --- |
| `current` | In use. | Listed. |
| `needs-review` | A new file the owner has not approved. Never rely on it. | Listed, with a description that starts "Proposal:". |
| `superseded` | Replaced by another file, named in its first body line. | Left out. |
| `retired` | No longer true, and nothing replaces it. | Left out. |
| `template` | The blank form only. | Left out. |

## Marks for what is not current

Mark a file in three places: its status, its description, and its body. Then the index and a reader both see it.

| Case | Status | Description starts | Body |
| --- | --- | --- | --- |
| A new file the owner has not approved | `needs-review` | `Proposal:` | First line under the title: `**Proposal, not approved yet:** asked on <date>. Do not rely on this until the owner says yes.` |
| A new section in a current file, not approved | File unchanged. | File unchanged. | The section's first line: `**Proposal, not approved yet:** asked on <date>. Do not rely on this until the owner says yes.` |
| Replaced by another file | `superseded` | `Superseded by <file>:` | First line under the title: `**Superseded by:** [<title>](<file>.md) on <date>.` |
| No longer true, nothing replaces it | `retired` | `Retired <date>:` | First line under the title: `**Retired:** <date>. <reason, in the owner's words when he gave one>` |
| A `feedback_` file whose content moved to the rules and concepts, or a `decision_` file whose decision moved to `DECISIONS.md` | `superseded` | `Moved on <date>:` | First line under the title: `**Superseded by:** <where it moved, with the DEC ID for a decision>, on <date>.` |

- A superseded or retired file keeps its body as history.
- A proposal the owner approved: remove each mark. For a file, set `status: current` and `authorization: Approved by <owner> on <date>`, and take the proposal word off the description. For a section, remove its proposal line and add "Approved by <owner> on <date>." to its **Evidence and limits** line.
- A replacing file sets `supersedes:` to the file it replaces.

## Body layout

- One `# ` title comes first, under the header. The index shows it.
- Each sub-topic is a `##` section holding six bold labels, in this order:

| Label | Holds |
| --- | --- |
| `**Remember:**` | The durable point, or a few closely related facts, with its scope and date. For an event: the date, who took part, what happened, and the result. |
| `**Why:**` | What losing it would change or cost. |
| `**How to apply:**` | What a future session checks or does with it. |
| `**Evidence and limits:**` | The exact source, any uncertainty, and when it was last checked. An unchecked claim says "Not checked." here, with who said it and what would check it. |
| `**Related memories:**` | Links to other memory files that help retrieval, or `None.` |
| `**Authoritative records:**` | The path, ID, or web address of a record outside `memory/` (a DEC, an SRC, a work item's ID, a project task's ID, a file), or `None.` For an event: where its output is. |

- A section that is true only for a while adds a seventh line: `**Check or remove by:** YYYY-MM-DD`.
- The last section is `## Gotchas and lessons`.

## Links between memories

- Link another memory file with a relative Markdown link to its file name: `[client plans](project_client_plans.md)`.
- Link one section with `#` and its heading, each space written `%20`: `[deploy window](project_deploys.md#Deploy%20window)`.
- A link to a retired file is followed by " (retired)". A link to a superseded file points at the file that replaces it.
- Name a record outside `memory/` by path, ID, or web address, under **Authoritative records**.
- Examples in this skill sit in backticks, which Obsidian does not count as links. Write a real link without backticks.

## Links to work items

An entry holds the item's ID first, written exactly as the tracker shows it, plus a link when the item has one.

| Work items are | `work_items` entry | In the body |
| --- | --- | --- |
| Local files | `"[[WI-031]]"` | `[[WI-031]]`, or `[[WI-031]] Q-04` for one question |
| In Notion | `"WI-31 https://www.notion.so/<page>"` | The ID, and the web address when a reader needs it |
| In GitHub | `"#12 https://github.com/<owner>/<repo>/issues/12"` | `#12`, and the web address when a reader needs it |

- Obsidian reads a link in a property only as `[[WI-031]]`, so a local item uses that form there. A local item's file keeps its ID name when its folder moves, so the link keeps working.
- Obsidian lists each work item's memories in its backlinks panel. A reverse link in the item is not needed.
- Name the item's ID under **Authoritative records** too.

## Gotchas and lessons

The last section of every concept holds lessons the agent learned and has not proved yet. With none, it holds "None yet.".

- One `###` heading for each lesson, with what happened and what to do.
- **Seen:** each time it came up: the date, and the session or work item.
- **Owner confirmed:** `<date>`, added when he confirms the lesson.
- **Promoted:** `<date>, to <where>`, added when the lesson became a rule, a skill, or a decision. The lesson stays as history.

```markdown
### The deploy check needs the VPN

A deploy check run off the VPN fails with a timeout. Connect first.

**Seen:** 2026-09-12 (WI-014); 2026-09-30 (WI-031).
```

## The Runs table

An `event_` file for a recurring job has a first section that says what the job is, when it runs, who runs it, and its steps, then a section `## Runs` above `## Gotchas and lessons`. It holds one table, one row per run, newest first:

```markdown
## Runs

| Date | Who ran it | What ran | Result | Problems and fix |
| --- | --- | --- | --- | --- |
| 2026-10-05 | agent | Weekly account load, file accounts-2026-10-05.csv | 1,204 rows loaded, 3 rejected | 3 rows had no region; the client corrected them and they loaded on the second run |
```

- Insert a new row right after the table's separator line, and set `updated`.
- A `|` inside a cell ends the cell: write `\|`.
- Never change an older row, except to add a fix found later to its last cell, with the date.

## A file is right when

- It sits at the top level of `memory/`, named `<prefix>_<name>.md`.
- The header reads as YAML and holds every field, with `name` and `metadata.type` matching the file name, and `created`, `updated`, and `check_by` filled.
- No angle-bracket prompt, fill-in guide comment, or template comment is left.
- The `work_items` entries and the body labels follow the Gotchas in `SKILL.md`.
- `## Gotchas and lessons` is the last section.
- A file that is not current carries all three marks.

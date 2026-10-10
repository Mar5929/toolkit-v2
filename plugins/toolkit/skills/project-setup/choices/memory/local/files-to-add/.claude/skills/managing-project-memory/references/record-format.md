# Memory file format (local files)

This file says how a memory file is written: what each header field holds, the statuses, how to mark a memory record that is not current, the body, the links, the lessons, and the Runs table. Open it when you write or check a memory file. A file is written correctly when it passes the list under "A file is right when".

The template `memory/project_topic_template.md` shows the shape of a file. Open the template when you make a file; `folders-and-files.md`, section "Making a file from the template", gives the steps. This file holds what the template does not say.

## Contents

- Header fields
- Status
- Marks for what is not current
- Body layout
- Links between memory files
- Links to work items
- Gotchas and lessons
- The Runs table
- A file is right when

## Header fields

The header is the block of fields between the two `---` lines at the top of the file.

| Field | Holds |
| --- | --- |
| `name` | The file name without `.md`. |
| `description` | One line that states what the file holds, with its dates. It states the fact itself, not only the subject of the fact. `managing-project-memory` gives the length of the line. The index prints the whole line. |
| `created` | The date the file was made, as `YYYY-MM-DD`. Never change it. |
| `updated` | The date of the last change, as `YYYY-MM-DD`. Set it to today on every change. |
| `check_by` | The date on which to check or remove the file, as `YYYY-MM-DD`, when the fact is true only for a while. Otherwise `none`. |
| `metadata.type` | The file's prefix: `user`, `project`, `reference`, or `event`. |
| `status` | One of the values under "Status". |
| `source` | The person, conversation, or document that the fact came from, with its absolute date. |
| `last_verified` | The date the fact was last checked against its source, or `unknown`. |
| `authorization` | What allowed the save, in one of the two forms under this table. |
| `work_items` | One entry for each related work item, in the form that "Links to work items" gives, or `[]` when no work item applies. |
| `supersedes` | The name of the file that this file replaces, or `none`. |

- `check_by` is for the whole file. When a single section has its own date, that section carries a `**Check or remove by:**` line.
- `authorization` has one of these forms:
  - `Approved by <owner> on <date>`, for a save that the owner asked for or said yes to.
  - `Logged by the agent on <date>`, for every other save.
- Keep any other field that Claude Code, Codex, or an import wrote.
- A file that was made before the fields `created` and `check_by` existed gets both at its next change. Set `created` to the oldest date that the file shows, and set `check_by: none`.

## Status

The first column is the value of the `status` field. The second column is the word that `managing-project-memory` uses for that status.

| `status` | Word in `managing-project-memory` | Meaning | In the index |
| --- | --- | --- | --- |
| `current` | current | The file is in use. | Listed. |
| `superseded` | replaced | Another file replaced this file. The first line of this file's body names that file. | Left out. |
| `retired` | retired | The file is no longer used for answers, and it is kept only as history. Nothing replaces it. | Left out. |
| `template` | (none) | Only the template has this value. | Left out. |

## Marks for what is not current

Mark a file in three places: its status, its description, and its body. Then the index and a reader both see that the file is not current.

Find the case in the first column. The other three columns give what to write in each place.

| Case | Status | Description starts | Body |
| --- | --- | --- | --- |
| Another file replaced this file | `superseded` | `Superseded by <file>:` | First line under the title: `**Superseded by:** [<title>](<file>.md) on <date>.` |
| The file is no longer used for answers, and nothing replaces it | `retired` | `Retired <date>:` | First line under the title: `**Retired:** <date>. <reason, in the owner's words when the owner gave one>` |
| A `feedback_` file whose content moved to the rules and to the memory records of its subjects, or a `decision_` file whose decision moved to `DECISIONS.md` | `superseded` | `Moved on <date>:` | First line under the title: `**Superseded by:** <where it moved, with the DEC ID for a decision>, on <date>.` |

- A file with the status `superseded` or `retired` keeps its body as history.
- In a file that replaces another file, set `supersedes:` to the name of the file it replaces.

## Body layout

- One `# ` title comes first, under the header. The index shows the title.
- Each sub-topic is a `##` section. A section holds six body labels, written in bold, in this order:

| Label | Holds |
| --- | --- |
| `**Remember:**` | The durable point, or a few closely related facts, with its scope and date. For an event, it holds the date, who took part, what happened, and the result. |
| `**Why:**` | What losing this point would change or cost. |
| `**How to apply:**` | What a future session checks or does with this point. |
| `**Evidence and limits:**` | The exact source, any uncertainty, and when the point was last checked. For a claim that nobody checked, write "Not checked." here, with who said it and what would check it. |
| `**Related memories:**` | Links to other memory files that help retrieval, or `None.` |
| `**Authoritative records:**` | The path, ID, or web address of a record outside `memory/` (a DEC, an SRC, a work item's ID, a project task's ID, a file), or `None.` For an event, it holds where the event's output is. |

- In a section that is true only for a while, add a seventh line: `**Check or remove by:** YYYY-MM-DD`.
- The last section is `## Gotchas and lessons`.

## Links between memory files

- Link another memory file with a relative Markdown link to its file name, as in `[client plans](project_client_plans.md)`.
- Link one section with `#` and its heading, with each space written as `%20`, as in `[deploy window](project_deploys.md#Deploy%20window)`.
- After a link to a retired file, write " (retired)".
- When a file has the status `superseded`, link to the file that replaces it instead.
- Name a record outside `memory/` by its path, ID, or web address, under **Authoritative records**.
- The examples in this skill sit in backticks, and Obsidian does not count text in backticks as a link. Write a real link without backticks.

## Links to work items

An entry in `work_items` holds the work item's ID first, written exactly as it is shown where the work items are kept. A link follows the ID when the work item has one.

| Work items are | `work_items` entry | In the body |
| --- | --- | --- |
| Local files | `"[[WI-031]]"` | `[[WI-031]]`, or `[[WI-031]] Q-04` for one question |
| In Notion | `"WI-31 https://www.notion.so/<page>"` | The ID, and the web address when a reader needs it |
| In GitHub | `"#12 https://github.com/<owner>/<repo>/issues/12"` | `#12`, and the web address when a reader needs it |

- Obsidian reads a link in a header field only in the form `[[WI-031]]`. So a work item that is a local file uses that form in `work_items`. The file of such a work item keeps its ID as its name when its folder moves, so the link keeps working.
- Obsidian lists the memory files that link to a work item in the work item's backlinks panel. A link from the work item back to the memory file is not needed.
- Name the work item's ID under **Authoritative records** too.

## Gotchas and lessons

The last section of every file for a subject has the heading `## Gotchas and lessons`. It holds the lessons that the agent learned and has not proven yet. When the file has no lesson, the section holds "None yet.".

A lesson is written like this:

- One `###` heading for each lesson, with what happened and what to do under it.
- A `**Seen:**` line that names each time the lesson came up: the date, and the session or work item.
- Add a line `**Owner confirmed:** <date>` when the owner confirms the lesson.
- Add a line `**Promoted:** <date>, to <where>` when the lesson became a rule, a skill, or a decision. The lesson stays in the file as history.

```markdown
### The deploy check needs the VPN

A deploy check run off the VPN fails with a timeout. Connect first.

**Seen:** 2026-09-12 (WI-014); 2026-09-30 (WI-031).
```

## The Runs table

An `event_` file for a recurring job has a first section that says what the job is, when it runs, who runs it, and its steps. After that section comes a section `## Runs`, above `## Gotchas and lessons`. The `## Runs` section holds one table, with one row per run, newest first.

```markdown
## Runs

| Date | Who ran it | What ran | Result | Problems and fix |
| --- | --- | --- | --- | --- |
| 2026-10-05 | agent | Weekly account load, file accounts-2026-10-05.csv | 1,204 rows loaded, 3 rejected | 3 rows had no region; the client corrected them and they loaded on the second run |
```

- Insert a new row right after the table's separator line, and set `updated`.
- A `|` inside a cell ends the cell. Write `\|` in its place.
- Never change an older row. The one exception is a fix that was found later: add it to the row's last cell, with the date.

## A file is right when

- It sits at the top level of `memory/`, and its name has the form `<prefix>_<name>.md`.
- The header reads as YAML and holds every field. `name` and `metadata.type` match the file name. `created`, `updated`, and `check_by` are filled.
- No prompt in angle brackets, fill-in guide comment, or template comment is left.
- The `work_items` entries and the body labels are written the way `references/memory-store.md`, section "Mistakes to avoid", says.
- `## Gotchas and lessons` is the last section.
- A file that is not current carries all three marks.

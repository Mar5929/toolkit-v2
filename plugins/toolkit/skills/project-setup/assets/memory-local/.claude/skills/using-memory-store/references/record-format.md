# Memory file format (local files)

The seeds hold the file shape: `memory/project_topic_template.md` for a concept, and `memory/decision_template.md` for a decision. Open the seed when you make a file (`folders-and-files.md`, "Making a file from a seed"). This file holds what the seeds do not say: what each field means, the statuses, the marks, and the links.

## Contents

- Header fields
- Status
- Marks for what is not current
- Body layout
- Links between memories
- Links to work items
- Gotchas and lessons
- Decision files
- The glossary
- A file is right when

## Header fields

| Field | Holds |
| --- | --- |
| `name` | The file name without `.md`. |
| `description` | One short line saying what a future session would look here to remember. The index prints it whole. |
| `updated` | The date of the last change, `YYYY-MM-DD`. Set it to today on every change. |
| `metadata.type` | The file's prefix: `user`, `project`, `reference`, `event`, or `decision`. |
| `status` | One of the values under "Status". |
| `source` | The person, conversation, or document the fact came from, with its absolute date. |
| `last_verified` | The date the fact was last checked against its source, or `unknown`. |
| `authorization` | `Approved by <owner> on <date>`, `Trusted grant, <date>`, or `Proposed by the agent on <date>; not approved`. |
| `work_items` | One entry for each related work item (see "Links to work items"), or `[]` when none applies. |
| `supersedes` | The file name this file replaces, or `none`. |

Keep any other field a host or an import wrote. A decision file has other fields (see "Decision files").

## Status

| Status | Meaning | In the index |
| --- | --- | --- |
| `current` | In use. | Listed. |
| `needs-review` | A new file the owner has not approved. Never rely on it. | Listed, with a description that starts "Proposal, not approved yet:". |
| `superseded` | Replaced by another file, named in its first body line. | Left out. |
| `retired` | No longer true, and nothing replaces it. | Left out. |
| `withdrawn` | Decision files only: the owner withdrew the decision. | Left out. |
| `template` | The two seeds only. | Left out. |

A decision file is only ever `current`, `superseded`, or `withdrawn`.

## Marks for what is not current

Mark a file in three places: its status, its description, and its body. Then the index and a reader both see it.

| Case | Status | Description starts | Body |
| --- | --- | --- | --- |
| A new file the owner has not approved | `needs-review` | `Proposal, not approved yet:` | Normal body. |
| A new section in a current file, not approved | File unchanged. | File unchanged. | The section's first line: `**Proposal, not approved yet:** asked on <date>. Do not rely on this until the owner says yes.` |
| Replaced by another file | `superseded` | `Superseded by <file>:` | First line under the title: `**Superseded by:** [<title>](<file>.md) on <date>.` |
| No longer true, nothing replaces it | `retired` | `Retired <date>:` | First line under the title: `**Retired:** <date>. <reason, in the owner's words when he gave one>` |
| A decision the owner withdrew | `withdrawn` | `Withdrawn <date>:` | First line under the title: `**Withdrawn:** <date>. <his words>` |
| A `feedback_` file whose content moved to the rules and concepts | `superseded` | `Moved to the rules and concepts on <date>:` | First line under the title: `**Superseded by:** the rules and concepts, on <date>.` |

- A superseded, retired, or withdrawn file keeps its body as history.
- A proposal the owner approved: remove each mark. For a file, set `status: current` and `authorization: Approved by <owner> on <date>`, and take the proposal words off the description. For a section, add "Approved by <owner> on <date>." to its **Evidence and limits** line.
- A replacing file sets `supersedes:` to the file it replaces.

## Body layout

- One `# ` title comes first, under the header. The index shows it.
- Each sub-topic is a `##` section holding six bold labels, in this order:

| Label | Holds |
| --- | --- |
| `**Remember:**` | The durable point, or a few closely related facts, with its scope and date. |
| `**Why:**` | What losing it would change or cost. |
| `**How to apply:**` | What a future session checks or does with it. |
| `**Evidence and limits:**` | The exact source, any uncertainty, and when it was last checked. |
| `**Related memories:**` | Links to other memory files that help retrieval, or `None.` |
| `**Authoritative records:**` | The path or web address of a record outside `memory/` (a requirement, a design, a work item's ID), or `None.` |

- The last section is `## Gotchas and lessons`.

## Links between memories

- Link another memory file with a relative Markdown link to its file name: `[billing](project_billing.md)`.
- Link one section with `#` and its heading, each space written `%20`: `[deploy window](project_deploys.md#Deploy%20window)`.
- A link to a retired file is followed by " (retired)". A link to a superseded file points at the file that replaces it.
- Name a record outside `memory/` by path or web address, under **Authoritative records**.
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
- **Promoted:** `<date>, to <where>`, added when the lesson became a rule or a skill. The lesson stays as history.

```markdown
### The deploy check needs the VPN

A deploy check run off the VPN fails with a timeout. Connect first.

**Seen:** 2026-09-12 (WI-014); 2026-09-30 (WI-031).
```

## Decision files

A `decision_<short-name>.md` file holds one decision, copied from `decision_template.md`.

- Header fields: `name`, `description` (the decision in one short line), `updated`, `metadata.type: decision`, `status`, `decided_on` (the date of the owner's answer), `decided_by`, `work_items`, and `supersedes`. It has no `source`, `last_verified`, or `authorization`.
- Body, three bold labels: `**Decision:**` (one sentence), `**How to apply:**`, and `**Where it was decided:**`.
- Where it was decided names the item and the Q-ID of its Questions and Answers row, such as `[[WI-031]] Q-04`. For an item in Notion or GitHub, it holds the ID, the Q-ID, and the web address. For a decision made with no work item, it holds the conversation and its date, such as `conversation, 2026-09-30`, and `work_items` is `[]`.

## The glossary

`memory/terminology-glossary.md` is one table, with one row for each term, and a section below it.

- Columns: Term, System or context, Meaning here, Distinction or alias, Source, Status / last checked.
- A retired term's last cell reads `Retired, <date>`.
- The section "Naming changes and aliases" holds one bullet for each change: `- <old term> → <preferred term>; <reason>; <source>, <date>.`
- The first real term replaces the fill-in guide comment and the example row.

## A file is right when

- It sits at the top level of `memory/`, named `<prefix>_<name>.md`.
- The header reads as YAML and holds every field for its kind, with `name` and `metadata.type` matching the file name.
- No angle-bracket prompt, fill-in guide comment, or template comment is left.
- The `work_items` entries and the body labels follow the Gotchas in `SKILL.md`.
- In a concept file, `## Gotchas and lessons` is the last section.
- A file that is not current carries all three marks.

<!-- Generated file. Source: plugins/work/shared/work-item-format.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# Work item and design format

What a work item and its design hold, their exact section names, and how to
change them with `toolkit work` commands without losing text.

## Contents

1. Where the record and the design live
2. Header fields
3. Sections of `WORK-ITEM.md`
4. Sections of `DESIGN.md`
5. Finding an item's file
6. Changing one section
7. Adding a table row
8. Editing a record directly
9. Titles
10. Generated files
11. Examples

## 1. Where the record and the design live

Every tracker uses the same body and the same design shape. Only the place
differs.

| Tracker | Work item | Design |
| --- | --- | --- |
| Local | `WORK-ITEM.md` in the item's folder under `.work-items/` | `DESIGN.md` beside it |
| Notion | The item's page in the project's Work Items database | The item's "Solution Design" child page |
| GitHub Issues | The issue body | One issue comment whose first line is `## Solution design` |
| Jira | The issue description | One comment whose first line is "Solution design" |

An item has one design home. Never make a separate design folder or a second
design file.

## 2. Header fields

The header (frontmatter locally, properties in Notion) holds these fields.
Only `toolkit work` commands change them.

| Field | Values | Changed by |
| --- | --- | --- |
| `id` | `WI-001` (the project's prefix and a number) | `toolkit work new`; never reused |
| `title` | The owner's words for the request | `toolkit work set <id> --title` |
| `type` | `discovery`, `solution-design`, `build`, `data-load`, `repository-maintenance`, `research`, `task`, `bug`, `enhancement`, or another lower-case word | `toolkit work set <id> --type` |
| `stage` | `01-discovery` to `14-spec-update` | `toolkit work set <id> --stage`, `approve`, `finish`, `cancel` |
| `status` | Backlog, Ready, In Progress, In Review, Done, Cancelled | Follows the stage; Done and Cancelled only through `finish` and `cancel` |
| `parent` | An item id or `none` | `toolkit work new --parent`, `toolkit work move` |
| `waiting_on` | `owner`, `agent`, `external: <who>`, `none` | `toolkit work set <id> --waiting-on` |
| `priority` | `urgent`, `high`, `medium`, `low` | `toolkit work set <id> --priority` |
| `delivery` | `agent-led`, `owner-led`, `not-offered` | `toolkit work set <id> --delivery` |
| `requirements_approved` | `YYYY-MM-DD by <name>` or `no` | `toolkit work approve <id> --requirements` |
| `design` | `proposed`, `approved`, `superseded`, `none` | `toolkit work design`, `toolkit work approve <id> --design` |
| `result_approved` | `YYYY-MM-DD by <name>` or `no` | `toolkit work approve <id> --result`, `toolkit work finish --quote` |
| `updated` | `YYYY-MM-DD` | Every `toolkit work` write |

`toolkit work lifecycle` prints the stage labels, the statuses, and the types.
Blocked is not a status: an item that cannot move has `waiting_on` set and its
Overview Blockers line filled.

## 3. Sections of `WORK-ITEM.md`

These are the headings `--section` takes. A `###` subsection can be named on
its own, for example `--section 'Agreed goal'`.

| Heading | What it holds |
| --- | --- |
| `Overview` | Goal, Current position, Next action (and who owns it), Blockers, Related items (ids, never paths) |
| `Roadmap` | The phase table: Phase (`P1 — <name>`), Outcome, Status, Exit result, Sub-items |
| `Tasks` | One `### P1 — <name>` heading per phase, with checkbox tasks `P1-T01` (Work, Deliverable, Done when, Depends on) |
| `Recent History` | Dated rows: Date, Change or decision, Effect on the work (newest first) |
| `Open Questions` | Rows: ID (`Q-01`), Question, Affects, Status, Decision needed from (`owner` for the owner) |
| `Requirements` | Overall status and Finalization rule, then the subsections below |
| `Starting request` | The owner's own words for the request |
| `Agreed goal` | The outcome the owner agreed the item delivers |
| `Active requirements` | One `#### R-01 — <name>` block per requirement |
| `Acceptance` | The numbered list of what makes the whole item acceptable |
| `Notes` | The subsections below |
| `Decisions and context` | Context the next session needs that is not a requirement |
| `Resume here` | Where the next session picks up |
| `Solution options and considerations` | Build ideas, linked to an `R-xx`; never requirements |

The `R-xx` block fields are Status (Refining, Finalized, Superseded), Applies
to, Required behavior, Boundaries and exceptions, Acceptance check, Decision
record, and Open questions. Each field starts its own line.

In the local and Notion trackers, the requirements approval command sets the
Requirements "Overall status" line: never write that line by hand there.
GitHub Issues and Jira have no approve command, so after the owner's yes the
agent writes Finalized there itself (`tracker-github.md` or `tracker-jira.md`,
"The `toolkit work` steps").

## 4. Sections of `DESIGN.md`

The CLI writes the design's header fields: `work_item`, `status` (`proposed`,
`approved`, `superseded`), and `approved`.

| Heading | What it holds |
| --- | --- |
| Header lines | Requirements (the item id), Design status, Requirements checked, Last updated, Design approval |
| `What this design solves` | Who uses the result, what they need, what must be true afterward, and what is left to another item |
| `Requirements and design readiness` | One row per `R-xx`: its status in the item, the design coverage, the remaining decision or gap |
| `What exists today` | Verified current behavior and files, or "nothing exists yet" |
| `Constraints and assumptions` | One row each, with source, status, and effect on the design |
| `Design options` | `### Option A — <name>` (then B, C), each with Approach, End-to-end behavior, Requirement coverage, Technical shape, Tradeoffs and risks, Build order |
| `Option comparison` | Only with more than one option |
| `Recommendation and owner decision` | Recommendation, Owner decision, Reason for decision |
| `Selected design` | After the owner chooses: End-to-end flow; Components and responsibilities; Data, access, and integration details; Edge cases and failure behavior; Release and ongoing operation |
| `Diagrams` | Mermaid diagrams, each with a heading and a one-sentence explanation |
| `Build and verification plan` | Technical sequence, and Acceptance checks (one row per requirement) |
| `Sources and decisions that affect the build` | Claim or decision, source, date, evidence type, how it was checked |
| `Where a builder could misread this design` | Requirement or section, plausible wrong reading, intended reading |
| `Notes` | Open design questions, Design changes during the interview, Current position and next step |

Keep every heading exactly as the template has it, including the dash in
`Option A — <name>`. In the local and Notion trackers, never write "Approved"
in the Design status line: a save replaces that line with the stored status,
and only `toolkit work approve <id> --design --by <owner>` approves a design.
GitHub Issues and Jira have no approve command, so after the owner's yes the
agent writes Approved there itself (`tracker-github.md` or `tracker-jira.md`).

## 5. Finding an item's file

Never build a path by hand. The owner may have moved or renamed the folder.

```text
toolkit work show <id> --path
```

`toolkit work show <id>` also prints the item's stage, who it waits on, the
skill that continues it, its parent and sub-items, its design (or the
parent's approved design it inherits), and the worktree branch and folder to
use.

## 6. Changing one section

1. Read the section. The output is the whole section as it stands.
   `toolkit work show <id> --section '<heading>'`
2. Change only what needs to change. Keep the rest word for word.
3. Leave out the section's fill-in guide comment (`<!-- ... -->`) once the
   section holds real content.
4. Write the whole section back. `<file>` is `-` in Claude Code, with the text
   on standard input; in Codex use `--text '<text>'` or a file in a new
   `mktemp -d` folder (`toolkit-commands.md`, "Text in a command").
   `toolkit work edit <id> --section '<heading>' --set-file <file>`
5. Read it back. An exit code of `0` is not proof by itself.
   `toolkit work show <id> --section '<heading>'`

To remove the template's fill-in guide above Overview:

```text
toolkit work edit <id> --remove-guide
```

## 7. Adding a table row

Add one row to Open Questions or Recent History with `--append-row` and the
full Markdown row in single quotes.

A new question takes the next free `Q-` number: read the Open Questions
section first and add one to the highest number there (`Q-01` when there is
none). "Decision needed from" is `owner` for the owner, or a person or role.
When you asked it with a recommendation, the Question cell holds both:
the question, then "Recommended: <answer>, because <reason>."

```text
toolkit work show <id> --section 'Open Questions'
toolkit work edit <id> --section 'Open Questions' --append-row '| Q-03 | Should the export include archived rows? | R-02 | Open | owner |'
```

A history row is added with its own command, which writes the date:

```text
toolkit work history <id> --note '<what happened>' --effect '<what it changes>'
```

To answer a question, rewrite its row in the whole Open Questions section:
the answer, the date, and status Answered. An approve command or a
`--delivery` answer marks the rows that asked for it Answered by itself and
prints "Marked Q-xx Answered"; do not edit those rows again.

## 8. Editing a record directly

- Prefer `toolkit work edit`. It works in every tracker the CLI drives and
  keeps the CLI's record of what it wrote.
- A local record's body text may also be changed with the file edit tool. The
  post-tool hook checks the record after the edit.
- Never change the header fields with a file edit, and never create a record
  with one. The pre-tool hook refuses both, because they would skip the
  approval gates.
- Never write a record from the shell: no `cat >`, `tee`, `sed -i`, `cp`, and
  no Python or Node script. The hook refuses it, so it only wastes a step.
- A Notion item changes only through `toolkit work` commands. Never write its
  page with another Notion tool.

## 9. Titles

- A new item's title uses the owner's own words for the request. When you
  shorten them, say the title in one line in the reply ("I started WI-003,
  'Write a short project brief'.").
- To retitle an item, say the new title to the owner in one line first. Never
  retitle quietly.
  `toolkit work set <id> --title '<new title>'`

## 10. Generated files

Never edit these by hand or from the shell. The hooks refuse it.

- `.work-items/DASHBOARD.md`: rebuilt by every `toolkit work` write and by
  `toolkit work sync`.
- `.work-items/.toolkit-state.json`: the id-to-path map and the highest id
  used.

## 11. Examples

An Open Questions row for a content question the owner must answer:

```markdown
| Q-01 | What should the project brief cover: goals only, or goals, users, and scope? Recommended: goals, users, and scope, because the build needs all three. | P1-T01 | Open | owner |
```

A history note that records an owner's answer and says what it changes:

```text
toolkit work history WI-012 --note 'Owner said: "keep archived rows out of the export"' --effect 'R-02 updated; requirements approval asked again.'
```

A section edit in Claude Code: the command, then the text, then a line holding
only `EOF`, all in one shell command:

```text
toolkit work edit WI-012 --section 'Agreed goal' --set-file - <<'EOF'
Anyone on the team can export the monthly report as a CSV file that opens in Excel.
EOF
```

The same edit in Codex:

```text
toolkit work edit WI-012 --section 'Agreed goal' --text 'Anyone on the team can export the monthly report as a CSV file that opens in Excel.'
```

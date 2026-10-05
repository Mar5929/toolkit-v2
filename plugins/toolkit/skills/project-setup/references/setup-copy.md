# Building the setup copy

Purpose: make the project's finished files in a scratch folder first: the
setup folder every project gets, plus the setup folders for the owner's
choices, with the name and "Toolkit settings" filled.
`skills-hooks-settings.md` adds to it next, and
`placing-files.md` puts it into the project.

## Contents

- Make the scratch folder
- Folders the choices add
- Never copied
- The project name and "Toolkit settings"
- Salesforce entries in the settings file
- The owner-preferences rule
- Check the setup copy

## Make the scratch folder

Claude Code: when your system prompt names a session scratchpad, make a
folder for this setup inside it. Otherwise, and in Codex, run:

```text
mktemp -d
```

It prints a new folder's path. This file calls it `<copy>`. Write the real
path into every later command: shell variables do not last from one command
to the next. Never save the path in a file.

Copy the setup folder every project gets into it, hidden files included:

```text
cp -R <skill folder>/assets/every-project/. <copy>/
```

`<skill folder>` is the folder that holds this skill's `SKILL.md`.

## Folders the choices add

This table is the only list of which setup folders a choice copies. Copy
each folder in the row of each choice the owner made into `<copy>`, hidden
files included:

```text
cp -R <skill folder>/assets/<folder>/. <copy>/
```

| Choice | Folders to copy |
| --- | --- |
| Work items local | `work-local` |
| Work items in Notion | `work-notion` and `notion-tools` |
| Work items in GitHub Issues | `work-github` |
| Memory local | `memory-process` and `memory-local` |
| Memory in Notion | `memory-process`, `memory-notion`, and `notion-tools` |
| Memory in Hindsight | `memory-hindsight`, and the one file below |
| Salesforce | `salesforce` |
| SOUL.md kept | `soul` |

- With work items and memory both in Notion, copy `notion-tools` once.
- With Hindsight memory, also copy one file of `memory-local`, and nothing
  else from that folder:

```text
mkdir -p <copy>/memory
cp <skill folder>/assets/memory-local/memory/CURRENT_STATE.md <copy>/memory/
```

Every file is copied whole. A choice decides which files a project gets,
never which lines inside a file. Change only what the three sections after
"Never copied" name; every other line of every file stays as copied.

## Never copied

The setup folders hold project files. Three kinds of file can be in the
copy that no project gets. Remove the ones present, in `<copy>` only. Check
that each path starts with the scratch folder before you run it.

```text
rm -rf <copy>/.agents <copy>/tools/kb/out <copy>/tools/kb/_freshness_stamp.json <copy>/tools/kb/_drift_pending.md
find <copy> \( -name __pycache__ -o -name .DS_Store -o -name '*.pyc' -o -name '*.log' -o -name '_prev-*.json' \) -prune -exec rm -rf {} +
```

- `.agents`: the `.agents/skills` in `every-project` is a link to its
  `.claude/skills` folder. `placing-files.md` in this folder makes the
  project's own link after the copy.
- The paths in `tools/kb/`, `_prev-*.json`, `__pycache__`, and `*.pyc`:
  files the Salesforce tools write when they were run inside the toolkit's
  own `salesforce` folder.
- `.DS_Store` and `*.log`: files macOS and a local run leave in a folder.

## The project name and "Toolkit settings"

- Replace `<Project name>` with the project's name on heading lines only
  (lines that start with one to six `#` and a space) of `AGENTS.md`,
  `README.md`, and `PROJECT.md`. The fill-in guide comments that name
  `<Project name>` stay as they are until finishing.
- In `PROJECT.md`, "People and ownership", replace the example row (the
  line that starts with ``| `<role>` |``), keeping the header and separator
  rows, with
  `| Owner | <name from question 1> | Makes the project's decisions | Every decision: requirements, designs, results, merges, and Done | Setup, <YYYY-MM-DD> |`.
  The work skills read the owner's name from this row. The fourth cell,
  "May decide", says which decisions a person may make.
- Leave every example ID in the copied files (`WI-31`, `WI-031`,
  `[[WI-031]]`, `DEC-001`, `SRC-###`, `SEC-04`) as it is, whatever prefix
  the owner chose. The skills read the real prefix from "Toolkit settings".
- Fill every line of `PROJECT.md`, section "Toolkit settings", writing each
  value inside the backticks in place of the prompt, for example
  ``- Tracker: `local` ``. The section has the same 11 lines in every
  project. Keep every line and every label exactly as written: the skills
  read these lines. A line for a choice the owner did not make gets the
  value `not used`, for example ``- Hindsight bank: `not used` ``.

| Line | Value |
| --- | --- |
| Tracker | `local`, `notion`, or `github` |
| Memory | `local`, `notion`, or `hindsight` |
| Memory approval | Local or Notion memory: `onboarding`. Hindsight memory: `not used`. |
| Work item ID prefix | Local work items: the prefix he confirmed, for example `WI`. Work items in Notion: leave the prompt for the Notion step. GitHub Issues: `not used`. |
| Notion work items | Work items in Notion: leave the prompt for the Notion step, which writes nested bullets under the label line. Otherwise `not used`. |
| GitHub repository | Work items in GitHub Issues: leave the prompt for the GitHub step. Otherwise `not used`. |
| Notion memory | Memory in Notion: leave the prompt for the Notion step, which writes nested bullets under the label line. Otherwise `not used`. |
| Hindsight bank, Hindsight server, Hindsight dashboard | Memory in Hindsight: leave the three prompts for the Hindsight step. Otherwise `not used` on each line. |
| Salesforce org aliases | A Salesforce project: written as `salesforce.md` in this folder shows: the label line, then one nested bullet per org (alias, which org it is, its purpose; mark production). The backtick rule above does not apply to that form. Otherwise `not used`. |

The service steps (`notion.md`, `github.md`, and `hindsight-on-vps.md` in
this folder) fill the prompts left for them. Keep the section's own fill-in
guide comment: later sessions read it.

## Salesforce entries in the settings file

`.claude/settings.json` is a machine settings file every project gets, and
it holds Salesforce entries. In a project that is not a Salesforce project,
take those entries out of `<copy>/.claude/settings.json`. A Salesforce
project keeps them.

- Delete the `Stop` hook group whose command runs
  `tools/kb/graph_freshness_hook.py`, and the `Stop` key when nothing is
  left in it.
- Delete the two `PreToolUse` handlers that run `guard-protected-orgs.cjs`
  and `guard-permission-set-deploy.cjs`, then their group and the
  `PreToolUse` key when nothing is left.
- Delete from `permissions.deny`: `Bash(sf project delete source *)`,
  `Bash(sfdx force:source:delete *)`, `Bash(sf org delete *)`.
- Delete from `permissions.ask`: `Bash(sf project deploy start *)`,
  `Bash(sf data create *)`, `Bash(sf data update *)`,
  `Bash(sf data delete *)`, `Bash(sf data import *)`,
  `Bash(sf data upsert *)`, `Bash(sf apex run *)`.
- Keep every other entry: the Git deny and ask rules, `attribution`,
  `autoMemoryEnabled`, `enabledPlugins`, `outputStyle`, and
  `skillListingBudgetFraction`.

`.gitignore` is copied whole in every project. Its lines for Salesforce
tools ignore nothing in a project that has none of those files.

## The owner-preferences rule

Every project gets `.claude/rules/owner-preferences.md`, whatever its memory
choice, so the owner's "from now on" instructions are kept in one file that
both hosts read. It starts with only the title, the lead paragraph, and a
layout note. Its starting text is `assets/owner-preferences.md`, outside
`every-project`, because it is the owner's own file from the first
instruction on: setup and "update the toolkit" copy it only into a project
that has none, and never compare or replace it afterwards.

```text
cp <skill folder>/assets/owner-preferences.md <copy>/.claude/rules/owner-preferences.md
```

Then add each instruction he gave during the interview, as `finishing.md`
in this folder says ("Instructions he gives during setup").

## Check the setup copy

Each of these only reads.

- `grep -n '<Project name>' <copy>/AGENTS.md <copy>/README.md <copy>/PROJECT.md`
  shows only fill-in guide comment lines, never a heading.
- `command grep -c -E '^- (Tracker|Memory|Memory approval|Work item ID prefix|Notion work items|GitHub repository|Notion memory|Hindsight bank|Hindsight server|Hindsight dashboard|Salesforce org aliases):' <copy>/PROJECT.md`
  prints 11 (`command grep` runs the system grep; in Claude Code, plain
  grep skips the folders the copied `.gitignore` names).
- `jq empty <copy>/.claude/settings.json` prints nothing (the JSON is
  valid).
- `ls -A <skill folder>/assets/every-project`, the same for each folder
  you copied, and `ls -A <copy>`: the last list holds every name of the
  other lists except `.agents`, plus `memory` with Hindsight memory, and no
  other name.
- `test -x <copy>/.githooks/pre-commit && echo executable` prints
  `executable`.
- `find <copy> -name AGENTS.md -not -path '*/.claude/*'` lists the root
  file and one in each of `system/`, `sources/`, `delivery/`, and
  `reference/`, plus `work-items/` with local work items and `memory/` with
  local memory. Each has a `CLAUDE.md` beside it that holds only the line
  `@AGENTS.md`.

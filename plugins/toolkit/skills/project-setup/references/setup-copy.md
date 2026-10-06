# Building the setup copy

This file builds the setup copy. The setup copy is the project's finished files, built in a temporary folder before anything is put into the project. Open this file at step 4 of "New project" in `SKILL.md`, and at section 1 of an update (`update.md`, "1. Build a new setup copy"). The job is done when the temporary folder holds the setup folder every project gets and the setup folders for the owner's choices, with the project's name and "Toolkit settings" filled in.

A setup folder is a folder in this skill's `assets/` that holds project files at the paths a project has them. One setup folder, `every-project`, goes to every project. Each choice of the owner adds one or more.

Two other files do the next two steps. `skills-hooks-settings.md` adds the settings to the setup copy, and `placing-files.md` puts the setup copy into the project.

## Contents

- Make the temporary folder
- Folders the choices add
- Never copied
- The project name and "Toolkit settings"
- Salesforce entries in the settings file
- The owner-preferences rule
- Check the setup copy

## Make the temporary folder

Make one temporary folder for this setup. How you make it depends on where you run:

- In Claude Code, when your system prompt names a session scratchpad, make a folder for this setup inside the session scratchpad.
- In Claude Code when the system prompt names no session scratchpad, and in Codex, run this command, which prints the path of a new folder:

```text
mktemp -d
```

This file calls the temporary folder `<copy>`. Write the real path in place of `<copy>` in every later command, because shell variables do not last from one command to the next. Never save the path in a file.

Copy the setup folder that every project gets into `<copy>`, hidden files included:

```text
cp -R <skill folder>/assets/every-project/. <copy>/
```

`<skill folder>` is the folder that holds this skill's `SKILL.md`.

## Folders the choices add

This table is the only list of which setup folders a choice copies. For each choice the owner made, copy each folder in the row of that choice into `<copy>`, hidden files included:

```text
cp -R <skill folder>/assets/<folder>/. <copy>/
```

Copy `every-project` first, then each chosen folder. A work choice adds its `references/work-tracker.md` and supporting files inside the `managing-work-items` skill that `every-project` already supplied. Local or Notion memory adds its `references/memory-store.md` and supporting files inside the `managing-project-memory` skill that `memory-process` supplied. Copy a chosen folder into the existing paths; it adds files to those skill folders. Only one work choice and one memory choice are copied, so the finished project has one version of each selected reference and no storage skill of its own.

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

Two rows have a special case:

- When work items and memory are both in Notion, copy `notion-tools` once.
- When memory is in Hindsight, also copy one file of `memory-local`, and nothing else from that folder:

```text
mkdir -p <copy>/memory
cp <skill folder>/assets/memory-local/memory/CURRENT_STATE.md <copy>/memory/
```

Every file is copied whole. A choice decides which files a project gets, never which lines inside a file. Change only what the three sections after "Never copied" name: the project name and "Toolkit settings", the Salesforce entries in the settings file, and the owner-preferences rule. Every other line of every file stays as it was copied.

## Never copied

Remove from `<copy>` the files that no project gets. The setup folders hold project files, but three kinds of file that no project gets can also be in the setup copy. Remove the ones that are present, in `<copy>` only. Before you run each command, check that each path in it starts with the temporary folder.

```text
rm -rf <copy>/.agents <copy>/tools/kb/out <copy>/tools/kb/_freshness_stamp.json <copy>/tools/kb/_drift_pending.md
find <copy> \( -name __pycache__ -o -name .DS_Store -o -name '*.pyc' -o -name '*.log' -o -name '_prev-*.json' \) -prune -exec rm -rf {} +
```

The three kinds of file are these:

- `.agents`: the `.agents/skills` in `every-project` is a link to the `.claude/skills` folder of `every-project`. `placing-files.md`, "4. The .agents/skills link", makes the project's own link after the copy.
- The paths in `tools/kb/`, `_prev-*.json`, `__pycache__`, and `*.pyc`: the Salesforce tools write these files when they are run inside the toolkit's own `salesforce` folder.
- `.DS_Store` and `*.log`: macOS and a local run leave these files in a folder.

## The project name and "Toolkit settings"

Make these four changes in the copied files.

- Replace `<Project name>` with the project's name in `AGENTS.md`, `README.md`, and `PROJECT.md`, on heading lines only. A heading line starts with one to six `#` and a space. The fill-in guide comments that name `<Project name>` stay as they are until finishing. `finishing.md`, "Fill the prompts", says when a fill-in guide comment is deleted.
- In `PROJECT.md`, "People and ownership", replace the example row with the owner's row below. The example row is the line that starts with ``| `<role>` |``. Keep the header row and the separator row.

  `| Owner | <name from question 1> | Makes the project's decisions | Every decision: requirements, designs, results, merges, and Done | Setup, <YYYY-MM-DD> |`

  - `<name from question 1>` is the owner's name, from the answer to question 1 of `interview.md`.
  - The work skills read the owner's name from this row.
  - The fourth cell, "May decide", says which decisions a person may make.
- Leave every example ID in the copied files as it is, whatever prefix the owner chose. The example IDs are `WI-31`, `WI-031`, `[[WI-031]]`, `DEC-001`, `SRC-###`, and `SEC-04`. The skills read the real prefix from "Toolkit settings".
- Fill every line of `PROJECT.md`, section "Toolkit settings". The table below gives the value for each line.
  - Write each value inside the backticks, in place of the prompt, for example ``- Tracker: `local` ``.
  - The section has the same 11 lines in every project. Keep every line and every label exactly as written, because the skills read these lines.
  - On a line for a choice the owner did not make, write the value `not used`, for example ``- Hindsight bank: `not used` ``.

| Line | Value |
| --- | --- |
| Tracker | `local`, `notion`, or `github` |
| Memory | `local`, `notion`, or `hindsight` |
| Memory approval | With local or Notion memory, write `onboarding`. Only the owner changes it to `trusted`. With Hindsight memory, write `not used`. |
| Work item ID prefix | With local work items, write the prefix the owner confirmed, for example `WI`. With work items in Notion, leave the prompt for the Notion step. With GitHub Issues, write `not used`. |
| Notion work items | With work items in Notion, leave the prompt for the Notion step, which writes nested bullets under the label line. Otherwise write `not used`. |
| GitHub repository | With work items in GitHub Issues, leave the prompt for the GitHub step. Otherwise write `not used`. |
| Notion memory | With memory in Notion, leave the prompt for the Notion step, which writes nested bullets under the label line. Otherwise write `not used`. |
| Hindsight bank, Hindsight server, Hindsight dashboard | With memory in Hindsight, leave the three prompts for the Hindsight step. Otherwise write `not used` on each line. |
| Salesforce org aliases | In a Salesforce project, write the line in the form that `salesforce.md`, "The org aliases", shows: the label line, then one nested bullet per org (alias, which org it is, its purpose; mark production). The rule above about writing the value inside the backticks does not apply to that form. Otherwise write `not used`. |

The steps that set up each service fill the prompts that are left for them: `notion.md` for Notion, `github.md` for GitHub Issues, and `hindsight-on-vps.md` for Hindsight.

Keep the fill-in guide comment of the "Toolkit settings" section itself, because later sessions read it.

## Salesforce entries in the settings file

In a project that is not a Salesforce project, take the Salesforce entries out of `<copy>/.claude/settings.json`. A Salesforce project keeps them. `.claude/settings.json` is the settings file of Claude Code. Every project gets it, and it holds Salesforce entries.

- Delete the `Stop` hook group whose command runs `tools/kb/graph_freshness_hook.py`. Delete the `Stop` key too when nothing is left in it.
- Delete the two `PreToolUse` handlers that run `guard-protected-orgs.cjs` and `guard-permission-set-deploy.cjs`. Then delete their group and the `PreToolUse` key when nothing is left.
- Delete these entries from `permissions.deny`: `Bash(sf project delete source *)`, `Bash(sfdx force:source:delete *)`, `Bash(sf org delete *)`.
- Delete these entries from `permissions.ask`: `Bash(sf project deploy start *)`, `Bash(sf data create *)`, `Bash(sf data update *)`, `Bash(sf data delete *)`, `Bash(sf data import *)`, `Bash(sf data upsert *)`, `Bash(sf apex run *)`.
- Keep every other entry: the Git deny and ask rules, `attribution`, `autoMemoryEnabled`, `enabledPlugins`, `outputStyle`, and `skillListingBudgetFraction`.

`.gitignore` is copied whole in every project. Its lines for Salesforce tools ignore nothing in a project that has none of those files.

## The owner-preferences rule

Every project gets `.claude/rules/owner-preferences.md`, whatever its memory choice. The file keeps the owner's "from now on" instructions in one file that both Claude Code and Codex read. It starts with only the title, the lead paragraph, and a layout note.

Copy its starting text into the setup copy:

```text
cp <skill folder>/assets/owner-preferences.md <copy>/.claude/rules/owner-preferences.md
```

Then add each instruction the owner gave during the interview. `finishing.md`, "Instructions the owner gives during setup", says what counts as an instruction and how to write its line.

The starting text is `assets/owner-preferences.md`, which is outside `every-project`. The reason is that the file is the owner's own file from the first instruction on. So setup and "update the toolkit" copy it only into a project that has none, and never compare or replace it afterwards.

## Check the setup copy

Run each check below. Each of these commands only reads.

- `grep -n '<Project name>' <copy>/AGENTS.md <copy>/README.md <copy>/PROJECT.md` shows only fill-in guide comment lines, and never a heading.
- `command grep -c -E '^- (Tracker|Memory|Memory approval|Work item ID prefix|Notion work items|GitHub repository|Notion memory|Hindsight bank|Hindsight server|Hindsight dashboard|Salesforce org aliases):' <copy>/PROJECT.md` prints 11. `command grep` runs the system grep. In Claude Code, plain grep skips the folders that the copied `.gitignore` names.
- `jq empty <copy>/.claude/settings.json` prints nothing, which means that the JSON is valid.
- Run `ls -A <skill folder>/assets/every-project`, the same command for each folder you copied, and `ls -A <copy>`. The last list holds every name of the other lists except `.agents`, plus `memory` with Hindsight memory, and no other name.
- `test -x <copy>/.githooks/pre-commit && echo executable` prints `executable`.
- `find <copy> -name AGENTS.md -not -path '*/.claude/*'` lists the root file and one file in each of `system/`, `sources/`, `delivery/`, and `reference/`. With local work items it also lists one in `work-items/`, and with local memory it also lists one in `memory/`. Each of these files has a `CLAUDE.md` beside it that holds only the line `@AGENTS.md`.

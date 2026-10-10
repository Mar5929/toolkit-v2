# Building the setup copy

This file builds the setup copy. The setup copy is the files that the project would get from the toolkit today, built in a temporary folder, so that they can be compared with the project's own files. Open this file in an update or a check of the setup, at [reference/update.md](update.md), "1. Build a new setup copy". The job is done when the temporary folder holds the setup folder every project gets and the setup folders for the project's choices, with the project's name and "Toolkit settings" filled in.

A setup of a new project or of an existing project builds no setup copy. It copies the folders straight into the project, as [SKILL.md](../SKILL.md), Steps 3 and 5, say.

A setup folder is a folder in this skill that holds project files at the paths a project has them: `every-project/`, and each `files-to-add/` folder under `choices/`. The setup folder `every-project/` goes to every project. Each choice of the owner adds one or more.

The setup file of each choice gives, in a step or in the file that a step names, the lines that the choice adds to a file of the full layout: the settings files, "Toolkit settings" in `PROJECT.md`, `AGENTS.md`, and `.gitignore`. Make those changes in the setup copy too. [SKILL.md](../SKILL.md), Step 5, names the setup file of each choice.

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
cp -R <skill folder>/every-project/. <copy>/
```

`<skill folder>` is the folder that holds this skill's `SKILL.md`.

## Folders the choices add

The setup file of each choice names the setup folders that the choice adds, and [SKILL.md](../SKILL.md), Step 5, names the setup file of each choice. For each choice that the project's "Toolkit settings" records, copy each of its folders into `<copy>`, hidden files included:

```text
cp -R <skill folder>/<folder>/. <copy>/
```

Copy `every-project` first, then each chosen folder. A chosen folder adds files inside skill folders that an earlier folder supplied, so copy it into the existing paths.

When work items and memory are both in Notion, copy `choices/notion-shared/files-to-add` once.

Every file is copied whole. Change in the copy only what the setup files of the project's choices and the sections after "Never copied" name. Every other line of every file stays as it was copied.

## Never copied

Remove from `<copy>` the files that no project gets. The setup folders hold project files, but two kinds of file that no project gets can also be in the setup copy. Remove the ones that are present, in `<copy>` only. Before you run each command, check that each path in it starts with the temporary folder.

```text
rm -rf <copy>/.agents
find <copy> \( -name .DS_Store -o -name '*.log' \) -exec rm -f {} +
```

The two kinds of file are these:

- `.agents`: the `.agents/skills` in `every-project` is a link to the `.claude/skills` folder of `every-project`. The project has its own link, and [reference/placing-files.md](placing-files.md), "The .agents/skills link", says how it is made.
- `.DS_Store` and `*.log`: macOS and a local run leave these files in a folder.

## The project name and "Toolkit settings"

Make these four changes in the copied files. Take each value from the project's own `PROJECT.md`.

- Replace `<Project name>` with the project's name in `AGENTS.md`, `README.md`, and `PROJECT.md`, on heading lines only. A heading line starts with one to six `#` and a space. The fill-in guide comments that name `<Project name>` stay as they are until finishing. [reference/finishing.md](finishing.md), "Fill the prompts", says when a fill-in guide comment is deleted.
- In `PROJECT.md`, "People and ownership", replace the example row with the owner's row below. The example row is the line that starts with ``| `<role>` |``. Keep the header row and the separator row.

  `| Owner | <name from question 1> | Makes the project's decisions | Every decision: requirements, designs, results, merges, and Done | Setup, <YYYY-MM-DD> |`

  - `<name from question 1>` is the owner's name, which is the answer to question 1 in [SKILL.md](../SKILL.md), Step 4.
  - The work skills read the owner's name from this row.
  - The fourth cell, "May decide", says which decisions a person may make.
- Leave every example ID in the copied files as it is, whatever prefix the owner chose. The example IDs are `WI-31`, `WI-031`, `[[WI-031]]`, `DEC-001`, `SRC-###`, and `SEC-04`. The skills read the real prefix from "Toolkit settings".
- Give `PROJECT.md`, section "Toolkit settings", the Tracker and Memory values and the lines of each choice, each with the value that the project's own line holds. [SKILL.md](../SKILL.md), "The lines of "Toolkit settings"", says how the section is built.

## Salesforce entries in the settings file

`.claude/settings.json` is the settings file of Claude Code. Every project gets it from `every-project/`, and that file holds no Salesforce entry.

- In a Salesforce project, add the Salesforce entries to `permissions.deny`, as the steps on the refuse list in the Salesforce setup file, [choices/salesforce/salesforce-setup.md](../choices/salesforce/salesforce-setup.md), say.
- Keep every other entry as it was copied.

## The owner-preferences rule

Every project gets `.claude/rules/owner-preferences.md`, whatever its memory choice. The file keeps the owner's "from now on" instructions in one file that both Claude Code and Codex read. It starts with only the title, the lead paragraph, and a layout note.

The file comes with `every-project/`. [reference/finishing.md](finishing.md), "Instructions the owner gives during setup", says what counts as an instruction and how to write its line.

The file is the owner's own file from the first instruction on. So setup and "update the toolkit" copy it only into a project that has none, and never compare or replace it afterwards.

A Salesforce project has a second file of this kind, `.claude/rules/salesforce-agent-permissions.md`. It comes with the folder `choices/salesforce/files-to-add` and holds the owner's choices about what an agent may do in each kind of org, with the toolkit's defaults. "Update the toolkit" copies the file only into a Salesforce project that has none, and never compares or replaces it afterwards.

## Check the setup copy

Run each check below. Each of these commands only reads.

- `grep -n '<Project name>' <copy>/AGENTS.md <copy>/README.md <copy>/PROJECT.md` shows only fill-in guide comment lines, and never a heading.
- `command grep -c -E '^- (Tracker|Memory):' <copy>/PROJECT.md` prints 2, and the section holds the lines of each of the project's choices. `command grep` runs the system grep. In Claude Code, plain grep skips the folders that the copied `.gitignore` names.
- `jq empty <copy>/.claude/settings.json` prints nothing, which means that the JSON is valid.
- Run `ls -A <skill folder>/every-project`, the same command for each folder you copied, and `ls -A <copy>`. The last list holds every name of the other lists except `.agents`, and no other name.
- `find <copy> -name AGENTS.md -not -path '*/.claude/*'` lists the root file and one file in each of `system/`, `sources/`, `delivery/`, and `reference/`. With local work items it also lists one in `work-items/`, and with local memory it also lists one in `memory/`. Each of these files has a `CLAUDE.md` beside it that holds only the line `@AGENTS.md`.

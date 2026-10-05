# Building the setup copy

Purpose: make the project's finished files in a scratch folder first: the
folder every project gets, plus the folder for each of the owner's choices,
with the name and "Toolkit settings" filled.
`skills-hooks-settings.md` adds to it next, and
`placing-files.md` puts it into the project.

## Contents

- Make the scratch folder
- Folders the choices add
- Never copied
- Every file is copied whole
- The project name and "Toolkit settings"
- Salesforce entries in shared files
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

Copy the folder every project gets into it, hidden files included:

```text
cp -R <skill folder>/assets/every-project/. <copy>/
```

`<skill folder>` is the folder that holds this skill's `SKILL.md`. Never
change anything inside `assets/`: it is the source for every project.

## Folders the choices add

Each folder in `assets/` holds files at the paths a project has them.
Copy the folder for each choice into `<copy>`, hidden files included:

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

- With work items and memory both in Notion, copy `notion-tools` once. It
  holds `using-notion-cli` and the rule `.claude/rules/notion-records.md`.
- `work-local` also holds `work-items/` and `PROJECT-ROADMAP.md`. With work
  items in Notion or GitHub, the project has neither: its phases live there
  instead.
- `memory-local` holds `memory/`. With Notion memory the project has no
  `memory/`.
- `memory-hindsight` holds the rule `.claude/rules/hindsight-memory.md`.
  With Hindsight memory the project's `memory/` has only
  `CURRENT_STATE.md`, with no `AGENTS.md` and no `CLAUDE.md`:

```text
mkdir -p <copy>/memory
cp <skill folder>/assets/memory-local/memory/CURRENT_STATE.md <copy>/memory/
```

The Salesforce list (the `salesforce` folder holds all of these):

- `sfdx-project.json`, `.forceignore`
- `tools/` (`tools/kb/` and `tools/permissions/`)
- the Salesforce templates inside the delivery folder, which every project
  has: `delivery/deployments/component-tracker.csv`,
  `delivery/deployments/full-project-deployment-template/`,
  `delivery/deployments/work-item-deployment-template/`,
  `delivery/releases/release-cutover-template/`,
  `delivery/migrations/area-template/`, `delivery/migrations/data-loads/`,
  `delivery/migrations/production-backups/`
- `.claude/protected-orgs.json`, `.claude/hooks/guard-protected-orgs.cjs`,
  `.claude/hooks/guard-permission-set-deploy.cjs`
- every `sf-*` folder in `.claude/skills/`
- `.codex/hooks.json`, which holds only the two Salesforce guards
- ten rules in `.claude/rules/`: `check-deployment-contents.md`,
  `component-tracker.md`, `confirm-salesforce-changes.md`,
  `dependency-graph.md`, `permissions-source-control.md`,
  `production-data-changes.md`, `project-file-locations.md`,
  `record-deployment-steps.md`, `salesforce-org-safety.md`,
  `salesforce-project.md`

`.gitignore` keeps its `/work-items/`, `/memory/`, and `.obsidian/` lines in
every project.

## Never copied

These are local to one person or one computer, or were never meant to ship.
Remove the ones present, in `<copy>` only. Check that each path starts with
the scratch folder before you run it.

```text
rm -rf <copy>/.git <copy>/.agents <copy>/.vscode <copy>/.sfdx <copy>/.sf <copy>/.localdevserver <copy>/.obsidian <copy>/memory/.obsidian <copy>/.claude/worktrees <copy>/.claude/.permset-preflight <copy>/.claude/settings.local.json <copy>/CLAUDE.local.md <copy>/.import.json <copy>/tools/kb/out <copy>/tools/kb/_freshness_stamp.json <copy>/tools/kb/_drift_pending.md
find <copy> \( -name __pycache__ -o -name .DS_Store -o -name '*.pyc' -o -name '*.log' -o -name '_prev-*.json' \) -prune -exec rm -rf {} +
```

The `.agents/skills` in `every-project/` is a link to its `.claude/skills`
folder. It is removed here with the rest of `.agents`, and `placing-files.md`
in this folder makes the project's own link after the copy.

## Every file is copied whole

These are the files that hold markers: none. A choice decides which files a
project gets, never which lines inside a file, so no file holds a line for
setup to keep or delete. Copy every file whole, and change only the name and
the values the next section lists. Every other line reads the same in every
project.

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
- Leave every example ID in the model's text (`WI-31`, `WI-031`,
  `[[WI-031]]`) as the model has it, whatever prefix the owner chose. The
  skills read the real prefix from "Toolkit settings".
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
| Memory approval | Local or Notion memory: `onboarding`. Only the owner changes it to `trusted`. Hindsight memory: `not used`. |
| Work item ID prefix | Local work items: the prefix he confirmed, for example `WI`. Work items in Notion: leave the prompt for the Notion step. GitHub Issues: `not used`. |
| Notion work items | Work items in Notion: leave the prompt for the Notion step. Otherwise `not used`. |
| GitHub repository | Work items in GitHub Issues: leave the prompt for the GitHub step. Otherwise `not used`. |
| Notion memory | Memory in Notion: leave the prompt for the Notion step. Otherwise `not used`. |
| Hindsight bank, Hindsight server, Hindsight dashboard | Memory in Hindsight: leave the three prompts for the Hindsight step. Otherwise `not used` on each line. |
| Salesforce org aliases | A Salesforce project: written as `salesforce.md` in this folder shows: the label line, then one nested bullet per org (alias, which org it is, its purpose; mark production). The backtick rule above does not apply to that form. Otherwise `not used`. |

The service steps (`notion.md`, `github.md`, and `hindsight-on-vps.md` in
this folder) fill the prompts left for them. Keep the section's own fill-in
guide comment: later sessions read it.

## Salesforce entries in shared files

In a project that is not a Salesforce project, also take the Salesforce
entries out of two files every project gets. A Salesforce project keeps
them.

`<copy>/.claude/settings.json`:

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

`<copy>/.gitignore`: delete the lines `.sfdx/`, `.sf/`, `.localdevserver/`,
`.claude/.permset-preflight/`, `tools/kb/out/`,
`tools/kb/_freshness_stamp.json`, `tools/kb/_drift_pending.md`, and
`tools/kb/_prev-*.json`. Keep `__pycache__/` and `*.pyc`: they are general.

## The owner-preferences rule

Every project gets `.claude/rules/owner-preferences.md`, whatever its memory
choice, so the owner's "from now on" instructions are kept in one file that
both hosts read. It starts with only the title, the lead paragraph, and a
layout note:

```text
cp <skill folder>/assets/owner-preferences.md <copy>/.claude/rules/owner-preferences.md
```

Then add each instruction he gave during the interview, as `finishing.md`
in this folder says ("Instructions he gives during setup").

## Check the setup copy

Each of these only reads: `command grep -rn -e '<!-- if ' -e '<!-- endif' <copy>`
prints nothing (`command grep` runs the system grep; in Claude Code, plain
grep skips the folders the copied `.gitignore` names);
`grep -n '<Project name>' <copy>/AGENTS.md <copy>/README.md <copy>/PROJECT.md`
shows only fill-in guide comment lines, never a heading;
`command grep -c -E '^- (Tracker|Memory|Memory approval|Work item ID prefix|Notion work items|GitHub repository|Notion memory|Hindsight bank|Hindsight server|Hindsight dashboard|Salesforce org aliases):' <copy>/PROJECT.md`
prints 11;
`jq empty <copy>/.claude/settings.json` prints nothing (the JSON is valid);
`find <copy> -maxdepth 2 -not -path '*/.claude/*' | sort` shows no
folder for an option the owner did not choose; and
`find <copy> -name AGENTS.md -not -path '*/.claude/*'` lists the root file
and one file per folder that has its own guide, each with a `CLAUDE.md`
beside it that holds only the line `@AGENTS.md`.

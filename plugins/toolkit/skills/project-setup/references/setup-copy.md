# Building the setup copy

Purpose: make the project's finished files in a scratch folder first: the
folder every project gets, plus the folder for each of the owner's choices,
with the setup markers resolved, the name and "Toolkit settings" filled, and
the rules list written. `skills-hooks-settings.md` adds to it next, and
`placing-files.md` puts it into the project.

## Contents

- Make the scratch folder
- Folders the choices add
- Never copied
- Setup markers
- The project name and "Toolkit settings"
- Salesforce entries in shared files
- The owner-preferences rule
- The rules list in AGENTS.md
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
| Memory in Hindsight | nothing, except the one file below |
| Salesforce | `salesforce` |
| SOUL.md kept | `soul` |

- With work items and memory both in Notion, copy `notion-tools` once.
- `work-local` also holds `work-items/`,
  `.claude/rules/work-item-folders.md`, and `PROJECT-ROADMAP.md`. With work
  items in Notion or GitHub, the project has none of them: its phases live
  there instead.
- `memory-local` holds `memory/`. With Notion memory the project has no
  `memory/`. With Hindsight memory it has only `memory/CURRENT_STATE.md`:

```text
mkdir -p <copy>/memory
cp <skill folder>/assets/memory-local/memory/CURRENT_STATE.md <copy>/memory/
```

The Salesforce list (the `salesforce` folder holds all of these):

- `sfdx-project.json`, `.forceignore`
- `delivery/` and `tools/` (`tools/kb/` and `tools/permissions/`)
- `.claude/protected-orgs.json`, `.claude/hooks/guard-protected-orgs.cjs`,
  `.claude/hooks/guard-permission-set-deploy.cjs`
- every `sf-*` folder in `.claude/skills/`
- `.codex/hooks.json`, which holds only the two Salesforce guards
- nine rules in `.claude/rules/`: `check-deployment-contents.md`,
  `component-tracker.md`, `confirm-salesforce-changes.md`,
  `dependency-graph.md`, `permissions-source-control.md`,
  `production-data-changes.md`, `project-file-locations.md`,
  `record-deployment-steps.md`, `salesforce-org-safety.md`

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

## Setup markers

Find the files that hold markers:

```text
command grep -rln -e '<!-- if ' <copy>
```

`command grep` runs the system grep. In Claude Code, plain grep skips the
folders the copied `.gitignore` names (`memory/`, `work-items/`).

These are the files that hold markers: `AGENTS.md`, `README.md`,
`PROJECT.md`, and `.claude/rules/memory-review-and-save.md`; the grep above
gives the current list. A marker line is a line whose text, without spaces
at either end, is exactly one of these:

| Opening marker | Keep the block when |
| --- | --- |
| `<!-- if salesforce -->` | Salesforce is yes |
| `<!-- if not salesforce -->` | Salesforce is no |
| `<!-- if tracker=local -->`, `tracker=notion`, `tracker=github`, `tracker=jira` | work items are in that tracker (`jira` never, until Jira is built) |
| `<!-- if memory=local -->`, `memory=notion`, `memory=hindsight` | memory is in that system |
| `<!-- if tracker=local or memory=local -->` | work items are local, memory is local, or both |
| `<!-- if tracker=notion or memory=notion -->` | work items are in Notion, memory is in Notion, or both |

Every block ends with the line `<!-- endif -->`.

- Keep a block whose condition holds. Delete a block whose condition does
  not hold, from its opening marker line to its `<!-- endif -->` line.
- Delete every marker line, in kept blocks too.
- Change nothing else. Other lines, blank lines, and other HTML comments
  (the fill-in guides) stay exactly as the model has them.
- Blocks never nest. An opening marker inside an open block, an
  `<!-- endif -->` with no open block, a block still open at the end of the
  file, or a condition not in the table: stop and tell the owner that the
  model has an error, naming the file and line.

## The project name and "Toolkit settings"

- Replace `<Project name>` with the project's name on heading lines only
  (lines that start with one to six `#` and a space) of `AGENTS.md`,
  `README.md`, and `PROJECT.md`. The fill-in guide comments that name
  `<Project name>` stay as they are until finishing.
- In `PROJECT.md`, "People and ownership", replace the example row (the
  line that starts with ``| `<role>` |``), keeping the header and separator
  rows, with
  `| Owner | <name from question 1> | Makes the project's decisions: requirements, designs, results, merges, and Done | Setup, <YYYY-MM-DD> |`.
  The work skills read the owner's name from this row.
- Leave every example ID in the model's text (`WI-31`, `WI-031`,
  `[[WI-031]]`) as the model has it, whatever prefix the owner chose. The
  skills read the real prefix from "Toolkit settings".
- Fill these lines of `PROJECT.md`, section "Toolkit settings", writing each
  value inside the backticks in place of the prompt, for example
  ``- Tracker: `local` ``. Keep every label exactly as written: the skills
  read these lines.

| Line | Value |
| --- | --- |
| Tracker | `local`, `notion`, or `github` |
| Memory | `local`, `notion`, or `hindsight` |
| Memory approval (local or Notion memory) | `onboarding`. Only the owner changes it to `trusted`. |
| Work item ID prefix (local work items) | The prefix he confirmed, for example `WI` |
| Salesforce org aliases | Written as `salesforce.md` in this folder shows: the label line, then one nested bullet per org (alias, which org it is, its purpose; mark production). The backtick rule above does not apply to this line. |

The Notion links and prefix, the GitHub repository, and the Hindsight bank,
server, and dashboard lines are filled by the service steps (`notion.md`,
`github.md`, and `hindsight-on-vps.md` in this folder). Leave their
prompts until then. Keep the section's own fill-in guide comment: later
sessions read it.

## Salesforce entries in shared files

In a project that is not a Salesforce project, also take the Salesforce
entries out of three files every project gets. A Salesforce project keeps
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

`<copy>/.claude/rules/publish-project-documents.md`: delete these two lines
from its `paths:` list, so the rules list names no Salesforce path:

```text
  - "tools/permissions/PERMISSIONS-RUNBOOK.md"
  - "delivery/**"
```

## The owner-preferences rule

Every project gets `.claude/rules/owner-preferences.md`, whatever its memory
choice, so the owner's "from now on" instructions are kept in one file that
both hosts read. It starts with only the title, the lead paragraph, and a
layout note:

```text
cp <skill folder>/assets/owner-preferences.md <copy>/.claude/rules/owner-preferences.md
```

Then add each instruction he gave during the interview, as `finishing.md`
in this folder says ("Instructions he gives during setup"). Do both before
the rules list below, so the list names the file.

## The rules list in AGENTS.md

`AGENTS.md` holds one list that setup writes, between the lines
`<!-- toolkit:rules:start -->` and `<!-- toolkit:rules:end -->`. Replace
only the lines between them; keep both marker lines. Build it from the rule
files now in `<copy>/.claude/rules/`, sorted by file name:

- A rule whose frontmatter has `paths:` is path-scoped. Every other rule is
  always on.
- Its purpose is the text of its first `# ` heading.

These list what you need, without changing anything:

```text
grep -m1 '^# ' <copy>/.claude/rules/*.md
grep -l '^paths:' <copy>/.claude/rules/*.md
```

The exact form:

```text
<!-- toolkit:rules:start -->
Always on. Claude Code loads these at session start. Codex: read each one at session start.
- `.claude/rules/cite-recalled-knowledge.md`: Cite Recalled Knowledge
- `.claude/rules/humanize-outbound-text.md`: Humanize Anything Sent to Another Person

Path-scoped. Claude Code loads each one when it reads a matching file. Codex: open the rule before working on a matching path.

| Paths | Rule |
| --- | --- |
| `ai-external-knowledge/**` | `.claude/rules/ai-external-knowledge.md` |
<!-- toolkit:rules:end -->
```

- In the table, wrap each path pattern in backticks and join them with
  `, `, in the order the rule lists them.
- With no path-scoped rules, leave out the second paragraph and the table.
  With no always-on rules, leave out the first paragraph and its list.
- Build it from the files, never from this example or from the list the
  model's `AGENTS.md` already holds (that one is for a Salesforce project
  with local work items).

## Check the setup copy

Each of these only reads: `command grep -rn -e '<!-- if ' -e '<!-- endif' <copy>`
prints nothing; `grep -n '<Project name>' <copy>/AGENTS.md <copy>/README.md <copy>/PROJECT.md`
shows only fill-in guide comment lines, never a heading;
`jq empty <copy>/.claude/settings.json` prints nothing (the JSON is valid);
and `find <copy> -maxdepth 2 -not -path '*/.claude/*' | sort` shows no
folder for an option the owner did not choose.

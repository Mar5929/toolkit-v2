# Updating a project ("update the toolkit")

Use this file when the owner says "update the toolkit" in a project that is already set up with Toolkit V2, and when the owner asks to change a setup choice, such as where memory is kept. An update brings the project up to the toolkit that is installed on this computer. When the update is done, all of these are true:

- The project has the newer skills and hook commands.
- The project's settings files are merged with the newer settings.
- The project's files hold the toolkit's newer text, wherever the owner said yes to it.
- The command that checks the records, `.claude/hooks/validate-records.mjs`, is turned on.
- In a project that uses Notion, Notion is brought up to the current template.

Two parts of an update are in their own files:

- `earlier-versions.md` holds the changes from toolkit 0.6.0, 0.8.0, and 0.8.1, for a project that was set up before one of those versions. Section 5 says when to open it.
- `one-home-layout.md` holds the steps for a project that was set up before the current folder layout: how to find the old layout, the plan the owner approves, where each old file or record goes, and the order of the moves. Sections 2 and 6 say when to open it.

This file uses five names:

- The **setup copy** is the project's finished files, built in a temporary folder before anything is put into the project. The commands write its path as `<copy>`.
- A **setup folder** is a folder in this skill's `assets/` folder that holds project files at the paths a project has them.
- The **main checkout** is the project's main folder: the first path that `git worktree list` prints. The commands write its path as `<main checkout>`.
- A **worktree** is a separate folder with its own branch. The commands write `<worktree>` for the worktree that you make under "Before you start".
- The **current folder layout** is the layout in which information the whole project needs is kept in five places, as files in the repository: `DECISIONS.md`, `system/`, `sources/`, `delivery/`, and `reference/`.

## Contents

- Before you start
- 1. Build a new setup copy
- 2. See what differs
- 3. What to do with each kind of file
  - Special cases for the rows of the table
  - Whether a difference is the owner's edit
  - Updating AGENTS.md
  - Turning on validate-records.mjs and the pre-commit file
- 4. What the toolkit no longer ships
  - The settings file of a Hindsight bank
  - Retired skills
  - Renamed skills
  - Files dropped from a skill
  - Removed rules
  - The renamed rule
  - Old hook entries
  - The questions before a sandbox change
  - The owner's choices for Salesforce orgs
  - The Memory approval line and saves that waited for the owner's yes
  - Old Hindsight entries
  - Files from the retired toolkit program
  - An old pre-commit Git hook
- 5. Services
- 6. A project set up before the current folder layout
- 7. Checks and report
- Changing a setup choice
  - Where work items or memory are kept

## Before you start

- Read the project's choices in `PROJECT.md`, section "Toolkit settings": Tracker, Memory, the ID prefix, the links, and the Hindsight bank. Never change a choice unless the owner asks. "Changing a setup choice", at the end of this file, gives the steps for that.
  - The project is a Salesforce project when the "Salesforce org aliases" line holds a value other than `not used`.
  - In a project that was set up before the current folder layout, the section holds only the lines of the project's own choices. In such a project, the project is a Salesforce project when the "Salesforce org aliases" line is present.
  - The choice "SOUL.md kept" applies when the file is present.
- Take the new files from this skill's `assets/` folder, in the toolkit plugin that is installed on this computer.
  - When the owner says that the toolkit itself changed, but this skill's `assets/` folder does not have the change the owner names, ask the owner before you update the plugin, because updating the plugin changes the owner's computer.
  - In Claude Code, the commands are `claude plugin marketplace update toolkit-v2`, then `claude plugin update toolkit@toolkit-v2`.
  - In Codex, the command is `codex plugin add toolkit@toolkit-v2`.
  - Then the owner starts a new session, which is a new chat with the agent.
- Before you change any file, make your own worktree and branch, as the project's `.claude/rules/shared-repository-work.md` says, because other sessions may be working in the main checkout. The command is `git -C <main checkout> worktree add .claude/worktrees/toolkit-update-<YYYY-MM-DD> -b claude/toolkit-update-<YYYY-MM-DD>`, where `<main checkout>` is the first path that `git worktree list` prints.
  - Run sections 2 to 4 in your worktree, with `rsync` and `diff` pointed at the worktree in place of `./`.
  - Run the service steps (section 5) from your worktree too, so that a file they change, such as `.mcp.json`, `.codex/config.toml`, or `PROJECT.md`, is committed on your branch.
  - Checking the setup changes nothing and needs no worktree.
- Git ignores `memory/` and `work-items/`, so these two folders are not in the worktree.
  - Compare them in the main checkout (section 2).
  - Change them in the main checkout, and only after the branch was merged (section 7, step 5). A work item or a memory record must never name a record that is not on the default branch.
  - Only one change is made in the main checkout earlier: a fix for a finding of `validate-records.mjs` (section 3, "Turning on validate-records.mjs and the pre-commit file").

## 1. Build a new setup copy

Build the setup copy exactly as for a new project, for the choices that `PROJECT.md` records, in a new temporary folder. Follow two files, in this order:

1. `setup-copy.md` gives the steps for making the temporary folder and copying the setup folders into it.
2. `skills-hooks-settings.md` gives the steps for adding the settings to the setup copy and for checking its skills and hook commands.

While you build the setup copy, do the following:

- Fill the project name and "Toolkit settings" from the project's own `PROJECT.md`.
- With memory in Notion, also replace `{{CURRENT_STATE_PAGE_ID}}` in the copy's `.claude/settings.json` and `.codex/hooks.json` with the id on the "Current state page" bullet under "Notion memory" in `PROJECT.md`. In a project that was set up earlier, that bullet is under a `### Notion` heading. The "Current state page" is the Notion page that holds the project's Current State, which is the project's one short page of what is true now.

## 2. See what differs

Compare the setup copy with the project. Run these commands:

```text
rsync -rcni --exclude /memory/ --exclude /work-items/ <copy>/ <worktree>/
rsync -rcni <copy>/memory/ <main checkout>/memory/
rsync -rcni <copy>/work-items/ <main checkout>/work-items/
```

- Run the second command and the third command only when the setup copy has that folder.
- Each command writes nothing.
- In the output, `>f+++++++` is a file the project lacks. Any other `>f` line is a file that differs.
- Read each difference with `diff -u <file> <copy>/<file>`.

Then run "Find the old layout" in `one-home-layout.md`. Its commands show whether the project still has the layout from before the current folder layout. Only `one-home-layout.md` handles what "Find the old layout" finds, so leave what it finds out of sections 3 and 4. Four rows of the table in "Find the old layout" are the exception, and the last paragraph of that section says which four.

## 3. What to do with each kind of file

For each file that differs, and each file the project lacks, find its kind in the table below and do what the row says.

Show the owner every file that needs the owner's answer in one numbered table, with one line per file and the reason on that line, and ask once. Carry out what the owner says yes to. The rest of this file calls that table "the numbered table".

When "Find the old layout" found the old layout, show the plan of `one-home-layout.md` in the same message, above the numbered table, and ask once for both.

Most rows have special cases. They are listed under the table, in "Special cases for the rows of the table", by the name of the row. Read the special cases of a row before you act on that row.

| Kind | Files | What to do |
| --- | --- | --- |
| Toolkit skills | each folder in `<copy>/.claude/skills/` | Replace the project's folder with the new folder, one skill at a time: `rsync -a --delete <copy>/.claude/skills/<name>/ .claude/skills/<name>/` |
| Hook commands | `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`, `validate-records.mjs` | Replace each file after the owner's yes: `cp <copy>/.claude/hooks/<file> .claude/hooks/<file>` |
| Settings | `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge each file with the rules in `skills-hooks-settings.md`. |
| Missing files | every `>f+++++++` line | List the missing files, then copy them into the project. |
| Ignore files | `.gitignore`, `.ignore` | Add each line of the setup copy's file that the project's file lacks, at the end after one blank line. Ask no question. The change only adds lines, and the owner's request to update the toolkit is the owner's yes to it. |
| `AGENTS.md` | the root file | Follow "Updating AGENTS.md" below. |
| `PROJECT.md`, "Toolkit settings" | | Make the section hold the 10 lines of the setup copy's section, with the same labels, in the same order. |
| Files that hold the owner's facts | the rest of `PROJECT.md`; `README.md`, `SOUL.md`, `PROJECT-ROADMAP.md`, `DECISIONS.md`, each document in `system/`, `sources/README.md`, `reference/outside-docs/INDEX.md` | Never overwrite one of these files. Name only the toolkit's changes (a new section, a changed heading, a changed guide comment), and make them after the owner's yes. |
| Rules in `.claude/rules/` | | Show the owner what differs. |
| Other toolkit files | the `AGENTS.md` of each folder (`system/AGENTS.md`, `sources/AGENTS.md`, `delivery/AGENTS.md`, `reference/AGENTS.md`, `work-items/AGENTS.md`, `memory/AGENTS.md`), the templates, the output style, `.githooks/pre-commit`, the Salesforce guards and `tools/` | Say in one line what changed, and whether the file holds an edit of the owner's. Take the toolkit's version after the owner's yes. |
| The owner's own records | work items and `work-items/PROJECT-TASKS.md`; the entries of `DECISIONS.md`; the rules and terms in `system/`; the sources in `sources/`; the records in `delivery/` and `reference/`; `memory/CURRENT_STATE.md` and every memory record in `memory/`; `.claude/rules/owner-preferences.md`; `.claude/rules/salesforce-agent-permissions.md`; the owner's own skills and rules | Never compare or change one of these. |

### Special cases for the rows of the table

- **Toolkit skills.** The command deletes every file in the project's folder that the new folder lacks. So before you run the command for a skill, list each file inside the project's folder that the new folder lacks, and ask the owner about those files.
- **Hook commands.**
  - Codex trusts the hook entry in `.codex/hooks.json`, not the file that the entry runs, so a replaced command file is not reviewed again. For that reason, put each replaced `.mjs` file in the numbered table, with one plain line that says what its diff changes, and copy the file only after the owner's yes.
  - A project that lacks `validate-records.mjs` gets the file through the "Missing files" row. The settings entries that run `validate-records.mjs` wait for "Turning on validate-records.mjs and the pre-commit file" below.
- **Settings.** `skills-hooks-settings.md`, "Merge rules", gives the merge rules in full. All of the following apply:
  - Add what is missing.
  - Ask before you change a value.
  - Replace the toolkit's own hook handlers. Do not add a second copy of one.
  - Delete no other entry.
  - Leave out the entries that run `validate-records.mjs` until "Turning on validate-records.mjs and the pre-commit file" below says to add them.
  - A changed Codex hook must be trusted again in `/hooks`. Tell the owner.
- **Missing files.** Copy the missing files in two parts.
  - Copy into the worktree with `rsync -rlt --ignore-existing --exclude /memory/ --exclude /work-items/ <copy>/ <worktree>/`. Do not use `-a`, because `-a` would give the project folder the temporary folder's private permissions.
  - Copy into the main checkout after the branch was merged (section 7, step 5), and only when the setup copy has the folder. The commands are `rsync -rlt --ignore-existing <copy>/memory/ <main checkout>/memory/` and `rsync -rlt --ignore-existing <copy>/work-items/ <main checkout>/work-items/`.
- **`PROJECT.md`, "Toolkit settings".**
  - Add each line that the project's section lacks, with the value `not used`.
  - Keep the value of every line that stays. Section 4, "The Memory approval line and saves that waited for the owner's yes", names the one line that goes.
  - When the section has a `### Notion` heading with ids under it, move the ids under the two fixed Notion lines, "Notion work items" and "Notion memory", as `notion-build/work-setup.md`, "Recording the links in PROJECT.md", says. That section shows the form of the "Notion work items" line, and says which file shows the form of the "Notion memory" line.
  - Show the owner the section before and after.
- **Rules in `.claude/rules/`.** "Whether a difference is the owner's edit" below says whether a rule holds an edit of the owner's.
  - When a rule holds no edit of the owner's, recommend the toolkit's version.
  - When a rule holds an edit of the owner's, the edit stays unless the owner says to take the toolkit's version.
  - In `hindsight-memory.md`, the lines under "What this project saves in Hindsight" are the owner's choices. Keep the project's lines in every update.
  - A project with no `owner-preferences.md` gets the setup copy's file through the "Missing files" row. A project that has `owner-preferences.md` follows the row "The owner's own records". The same holds for `salesforce-agent-permissions.md` in a Salesforce project.
- **Other toolkit files.** "Whether a difference is the owner's edit" below says whether a file holds an edit of the owner's. When a file holds no edit of the owner's, recommend the toolkit's version.
- **The owner's own records.**
  - A memory record is each file in `memory/` whose name starts `user_`, `project_`, `reference_`, or `event_`. The one exception is `project_topic_template.md`: it is a template, and the "Other toolkit files" row covers it.
  - `memory/MEMORY.md` is the generated index. The session-start hook rebuilds it, so do not compare it either.
  - `.claude/rules/salesforce-agent-permissions.md` holds the owner's choices about what an agent may do in each kind of Salesforce org. A Salesforce project that has no such file gets the setup copy's file through the "Missing files" row. Section 4, "The owner's choices for Salesforce orgs", then moves the project's earlier choices into it.

### Whether a difference is the owner's edit

A file that differs from the setup copy differs for one of two reasons, or for both: the owner edited the file, or the toolkit changed the file after the project got it. Git history shows which reason applies. For a file that Git tracks, run these commands:

```text
git log --format='%h %ad %s' --date=short -- <file>
git show --stat --format= <commit>
git status --short -- <file>
```

- The first command lists the commits that changed the file.
- A commit is the toolkit's when both of these are true: the second command also lists a file under `.claude/skills/` for that commit, and the commit's message names the setup, a move-over, or a toolkit update. Each of those three jobs commits skills together with the other toolkit files.
  - The owner may also change a rule and a skill in one commit of the owner's own. When the message does not show which of the two the commit is, ask the owner.
- When all of a file's commits are the toolkit's, and the third command does not list the file, the file holds no edit of the owner's. Say so on the file's line of the numbered table, and recommend the toolkit's version.
- When a file has any other commit, or the third command lists the file, the file holds an edit of the owner's. Show the difference. The owner's edit stays unless the owner says to take the toolkit's version.
- A file that Git does not track (in `work-items/` or `memory/`) has no history. Show the difference and ask.

### Updating AGENTS.md

The root `AGENTS.md` reads the same in every project, except for two prompts that the owner filled: the outcome sentence and the "Build, test, or deploy" row. The owner may also have added lines. List the `## ` headings of both files:

```text
grep -n '^## ' AGENTS.md
grep -n '^## ' <copy>/AGENTS.md
```

Then compare the two lists. One of two cases applies.

- **Every heading of the setup copy's file is in the project's file, in the same order.** Sections that the owner added do not matter for this comparison. Name each toolkit change in plain words (for example "a changed row in the Project map"). After the owner's yes, add, change, or remove only those lines, and keep the owner's lines.
- **A heading of the setup copy's file is missing from the project's file, or the order differs.** This is the case when the toolkit moved, renamed, or added a section. Every project that was set up before the current folder layout is this case. Changing named lines cannot give the project the new layout, so build a new file:
  1. Start from `<copy>/AGENTS.md`, which already has the project's name.
  2. Replace its outcome prompt and its "Build, test, or deploy" row with the project's current ones, and delete its fill-in guide comment.
  3. Find the lines that the owner added or changed with `diff -u AGENTS.md <copy>/AGENTS.md`. Then decide for each of those lines:
     - Drop a line that only repeats what the new file already says about the toolkit (a skill line, a line of a rules list between two `toolkit:rules` marker lines, a line about a setup choice).
     - Carry over a line that holds a fact, a command, or an instruction of the owner's own, into the section where it fits. A whole section that the owner added goes in right after "Commands".
     - When you cannot tell whether to drop a line or carry it over, carry the line over and mark it in the list in step 5.
  4. Run `wc -lc <copy>/AGENTS.md`. The limits are at most 200 lines and at most 24,576 bytes. When the owner's added lines put the file over either limit, say so in the list in step 5, and recommend which of those lines to move, and where. Cut no line of the owner's without the owner's yes.
  5. Show the owner the whole new file, and under it one short list: each line you carried over, and each of the owner's lines you dropped, with the reason. Write nothing until the owner says yes. After the owner's yes, write the new file as `AGENTS.md` in your worktree.

### Turning on validate-records.mjs and the pre-commit file

`validate-records.mjs` checks the form of the project's records. It runs after each file edit in Claude Code and in Codex, when the agent stops in Claude Code, and, through `.githooks/pre-commit`, before each commit. A finding that nobody fixes is reported again at the end of every Claude Code turn. So in a project whose `.claude/settings.json` holds no entry that runs `validate-records.mjs`, the records pass the check first, and the entries that run `validate-records.mjs` go in last. In such a project, do these five steps in order:

1. Make every other change of sections 3 to 6 in the worktree. By this step, the "Missing files" row has copied `.claude/hooks/validate-records.mjs` and `.githooks/pre-commit`.
2. Run the check from the worktree:

   ```text
   node .claude/hooks/validate-records.mjs --all < /dev/null
   ```

   - The command reads the records Git tracks (`DECISIONS.md`, `system/`, `sources/`, and the `AGENTS.md` of each folder) in the worktree, and it reads `work-items/` and `memory/` in the main checkout.
   - The command looks up an ID that a work item names in the main checkout's records, not in the worktree's records.
   - The command only reads.
   - The command prints one line per finding: the file, what is wrong, and what to do.
3. Fix each finding, then run the check again, until it prints nothing.
   - When a finding is in a file Git tracks, fix it in the worktree.
   - When a finding is in `work-items/` or `memory/`, fix it in the main checkout now, with `references/work-tracker.md` in the setup copy's `managing-work-items` skill or `references/memory-store.md` in its `managing-project-memory` skill. Write nothing there that names a record made on your branch.
   - When a finding is an `AGENTS.md` in `memory/` or `work-items/` with no `CLAUDE.md` beside it, copy that one file, the `CLAUDE.md`, from the setup copy.
   - When the fix for a finding is the owner's decision, for example two work items with one ID, ask the owner.
4. Only then add the entries that run `validate-records.mjs` to the worktree's `.claude/settings.json` (a `PostToolUse` group and a `Stop` group) and `.codex/hooks.json` (a `PostToolUse` group). Take the entries from the settings snippets, which are the small files in this skill's `assets/settings/` folder that setup merges into a project's settings files. Add them with the merge rules in `skills-hooks-settings.md`, "Merge rules".
5. Set up the pre-commit file as `placing-files.md`, "5. The pre-commit check", says. That section gives the steps that make Git run `.githooks/pre-commit` before each commit.
   - Before you do that section, remove an old `pre-commit` Git hook that section 4 of this file lists, after the owner's yes.
   - Every other hook in the Git hooks folder stays. When one is left, "5. The pre-commit check" changes nothing and tells the owner.

When the project's settings already hold the entries that run `validate-records.mjs`, run step 2 and report what it prints with the final checks, and do step 5.

The entry in `.codex/hooks.json` is new, and the `description` there changed, so Codex asks the owner to trust the project's hooks again in `/hooks`. Say so in the report.

## 4. What the toolkit no longer ships

Each part of this section is about one thing that an earlier setup put into a project and that the toolkit no longer ships. Each part says how to recognise the thing and what to do with it.

### The settings file of a Hindsight bank

A Hindsight project set up before toolkit 0.9.28 holds `.claude/hindsight-bank-settings.json`, with the owner's choices for the project's bank. The choices are now kept in plain words in the rule `.claude/rules/hindsight-memory.md`, section "What this project saves in Hindsight". Show the owner what the file holds and what the new rule would say, and ask which the owner wants. After the owner's yes, write the owner's choices into that section, and remove the file.

### Retired skills

A retired skill is a folder in `.claude/skills/` that is not in the setup copy and that an earlier Toolkit V2 setup put there. List it, check whether the owner edited it, and remove it only after the owner's yes. The current merge retires `running-work-item-lifecycle`, `using-work-tracker`, `curating-project-memory`, and `using-memory-store`; their instructions now live inside `managing-work-items` or `managing-project-memory`. A project with Hindsight memory has no Toolkit memory skill.

- When a folder in `.claude/skills/` that is not in the setup copy is the owner's own project skill, or you are not sure, leave it and ask.
- Toolkit 0.6.0 retired `work-refine`, `solution-design`, `work-delegate`, `work-check`, `work-finish`, `local-work-track`, `notion-work-track`, and `github-work-track`. `running-work-item-lifecycle` and `using-work-tracker` replace them.
- Toolkit 0.7.0 retired `local-memory-save`, `local-memory-find`, `local-memory-refine`, `notion-memory-save`, `notion-memory-find`, and `notion-memory-refine`. `curating-project-memory` and `using-memory-store` replace them, and a project with work items or memory in Notion also gets `using-notion-cli`.
- Toolkit 0.9.3 retired `explain-simply`. No skill replaces it.

### Renamed skills

Five skills were renamed in an earlier version. This table records that history; the current merged names are described below.

| Old folder | New folder |
| --- | --- |
| `managing-work-items` | `running-work-item-lifecycle` |
| `tracking-work-items` | `using-work-tracker` |
| `managing-project-wide-records` | `filing-project-records` |
| `managing-project-memory` | `curating-project-memory` |
| `storing-project-memory` | `using-memory-store` |

A project from that earlier version may hold a folder in the "Old folder" column. In the current version, `managing-work-items` and `managing-project-memory` are the names of the merged skills. When one of those folder names is already present, compare its files and replace the toolkit files after the owner's yes; keep the folder. For any other old folder, check for the owner's edits before removal. A project must not keep the old process or storage skill beside its merged replacement.

| Folder in a project set up before this merge | Current home |
| --- | --- |
| `running-work-item-lifecycle` | `managing-work-items` |
| `using-work-tracker` | The selected `references/work-tracker.md` and supporting files inside `managing-work-items` |
| `curating-project-memory` | `managing-project-memory` for local or Notion memory |
| `using-memory-store` | The selected `references/memory-store.md` and supporting files inside `managing-project-memory` |

Before replacing a merged skill, inspect both old folders and their files. Use section 3, "Whether a difference is the owner's edit", to identify each owner edit, and put each one in the numbered table. Carry an edit into the new skill only after the owner chooses where it belongs. After the owner's yes, install the merged skill and remove the old folders in the same change. Hindsight projects keep their existing Hindsight rule and add-on.

- A project holds only the skills for its own choices, so it renames only the skills it has.
- When a rule or a skill of the owner's own names an old skill, list it, and change the name after the owner's yes.
- The rename changed the text of one Codex hook entry in `.codex/hooks.json`, so Codex asks the owner to trust the project's hooks again in `/hooks`. Say so in the report.

### Files dropped from a skill

The toolkit dropped files from two skills. The "Toolkit skills" row in section 3 lists such a file with the files that the new folder lacks. When you ask the owner about the file, give the reason that this part states for it.

- Toolkit 0.8.6 dropped `agents/openai.yaml` from `merge-and-clean-up`. The reason is that the file held only what the Codex app showed for the skill: a display name, a short description, and a starter prompt.
- The current folder layout dropped `assets/terminology-glossary.md` and `assets/decision-record.md` from the Notion `using-memory-store`. The reason is that setup no longer builds a glossary page, a project term is a row of `system/glossary.md`, and a decision that more than one work item needs is an entry in `DECISIONS.md`. Remove these two files with the rest of the old folder.

The local `memory/` folder lost two files for the reason that the second bullet gives: `decision_template.md` and `terminology-glossary.md`. `one-home-layout.md` moves what a project wrote in those two files.

### Removed rules

A removed rule is a rule in `.claude/rules/` that the new setup copy lacks and that an earlier Toolkit V2 setup put there. List it, and remove it only after the owner's yes.

- The current folder layout removed two rules: `work-item-folders.md` (`work-items/AGENTS.md` holds what it said) and `ai-external-knowledge.md` (`reference/AGENTS.md` holds what it said).
- `hindsight-memory.md` is such a rule in a project whose memory is not Hindsight.
- A Salesforce project may hold two rules that the toolkit no longer ships: `production-data-changes.md` (the `sf-data-change` skill holds its steps) and `confirm-salesforce-changes.md` (its list is in `salesforce-agent-permissions.md`, "Confirm with the owner first"). "The owner's choices for Salesforce orgs" below says what to do before you remove them.
- When the owner wrote a line in the rule, put that line in its new place before you remove the file. `move-over.md`, "3. Sort everything the project holds", has a table under the label "Where the owner's lines from an old toolkit file go" that gives the new place for each kind of line.

### The renamed rule

The writing rule has had four file names. The first was `plain-english-artifacts.md`. A project set up from the rewrite branch may hold `write-for-the-reader.md`. Version 0.9.1 used `write-documents-in-plain-english.md`. The current name is `document-clarity-standard.md`. The rule covers documents and the words inside artifacts. A project keeps only the current file.

Find an old file with `ls .claude/rules/plain-english-artifacts.md .claude/rules/write-for-the-reader.md .claude/rules/write-documents-in-plain-english.md 2>/dev/null`. The "Missing files" row in section 3 adds the new file. For each old file the project holds, decide whether the old file holds an edit of the owner's, as section 3, "Whether a difference is the owner's edit", says.

- When the old file holds no edit of the owner's, list the old file and the new file in the numbered table. After the owner's yes, remove the old file with `git rm` in the same change that adds the new file.
- When the old file holds an edit of the owner's, show the owner the lines the owner changed before you replace the file. `git log -p -- .claude/rules/<old file name>` shows them in each commit that is the owner's, and `git diff -- .claude/rules/<old file name>` shows an edit the owner has not committed. A comparison of `plain-english-artifacts.md` with the new rule would show every line, because the whole text changed. Ask the owner whether those lines go into the new rule. Add the lines the owner names to the new file, and only then remove the old file. The owner's file stays until the owner answers.
- When a rule or a skill of the owner's own, or a rule from the toolkit that holds an edit of the owner's, names an old writing rule, list it, and change the name after the owner's yes.

### Old hook entries

A project may still hold two old hook entries:

- an old end-of-reply check, which is a `Stop` hook of type `prompt` in `.claude/settings.json`;
- an older Codex helper-reminder handler with the matcher `^(spawn_agent|wait_agent)$`.

List each one the project holds. After the owner's yes, remove it and any group or event that it leaves empty. The snippet's handler replaces the Codex one.

The `description` in `.codex/hooks.json` may hold an earlier text of the toolkit. That text is the sentence that starts "Toolkit V2 hooks for this project in Codex:". Replace that sentence with the snippet's text, and keep every other sentence of the `description`. Do not add the snippet's text after the earlier one.

Leave the `Stop` hook that runs `tools/kb/graph_freshness_hook.py`. It comes from the `salesforce` setup folder.

### The questions before a sandbox change

A Salesforce project may still ask the owner before each change to a sandbox in two places that the toolkit no longer uses: seven `permissions.ask` entries in `.claude/settings.json`, and `"sandboxAction": "ask"` in `.claude/protected-orgs.json`. The rule `.claude/rules/salesforce-agent-permissions.md` now says when the agent asks.

Tell the owner that in one line. After the owner's yes, make these two changes:

- In `.claude/settings.json`, remove these entries from `permissions.ask`: `Bash(sf project deploy start *)`, `Bash(sf data create *)`, `Bash(sf data update *)`, `Bash(sf data delete *)`, `Bash(sf data import *)`, `Bash(sf data upsert *)`, `Bash(sf apex run *)`. Claude Code asks for each of them whatever the rule says.
- In `.claude/protected-orgs.json`, set `"sandboxAction"` to `"allow"`. Change no other value of that file: the lists `alwaysProtect` and `neverProtect` are the owner's.

The guard still blocks production and an org that it cannot classify.

### The owner's choices for Salesforce orgs

A Salesforce project that has no `.claude/rules/salesforce-agent-permissions.md` keeps the owner's choices about what an agent may do in an org in three places. They now go in that one file, which the "Missing files" row in section 3 adds with the toolkit's defaults. Tell the owner in one line that a deploy and a deploy validation on a sandbox or scratch org now run with no question by default. Then move the project's own choices into the new file, after the owner's yes to the numbered table:

- **The line "Sandbox questions: off" in the project's Current State.** When the line is there, the owner turned off the questions before a sandbox data change and before anonymous Apex on a sandbox. In the new file, set "Change data" and "Run anonymous Apex" to Allowed in the column for a sandbox or scratch org, and add the date and the name from the old line in each cell. Ask the owner whether a deploy with a destructive changes file and a profile deploy on a sandbox also stay allowed, because the old line allowed both and the new defaults do not. Then remove the line from the project's Current State.
- **An edit of the owner's in `confirm-salesforce-changes.md` or in `production-data-changes.md`.** Section 3, "Whether a difference is the owner's edit", says how to find one. Put each line that the owner changed or added under "Only in this project" in the new file, or in the list "Confirm with the owner first" when it belongs there. Then remove the two rules, as "Removed rules" above says.
- **An edit of the owner's in `salesforce-org-safety.md`.** The rule now holds only the limits that are the same in every project. Show the owner the edit, and put a line that only this project needs under "Only in this project" in the new file. Then take the toolkit's version of the rule, after the owner's yes.

### The Memory approval line and saves that waited for the owner's yes

An earlier version of the toolkit asked the owner before some saves to memory. It held a line "Memory approval" in `PROJECT.md`, section "Toolkit settings". It kept a save that waited for the owner's yes as a proposal. The toolkit no longer uses the line, and it no longer keeps proposals.

- Remove the "Memory approval" line from "Toolkit settings".
- Look for proposals in a project with local or Notion memory. A proposal is one of these:
  - a file in `memory/` whose header holds `status: needs-review`;
  - a page of the Notion Memories database with the Status "proposed";
  - a section of a file or a page whose first line starts `**Proposal, not approved yet:**`.

  With local memory, `command grep -rnE '^status: *"?needs-review|Proposal, not approved yet:' <main checkout>/memory` lists them. With Notion memory, the query under "Every page" in `references/searching.md` of the memory skill prints the status of each page; read the body of each page for the section line.
- List each proposal in the numbered table, and ask the owner whether to keep it. Make each change with `managing-project-memory`.
  - When the owner keeps a proposal, make it current. Set the status of the file to `current`, or the Status of the page to "accepted". Remove "Proposal:" or "Proposal, not approved yet:" from the start of its one-line summary, and remove the line that starts `**Proposal, not approved yet:**`. Record "Approved by <owner> on <date>" as what allowed the save. For a proposal that is a section, leave the status as it is, and add "Approved by <owner> on <date>." to the section's "Evidence and limits" line.
  - When the owner drops a proposal, remove the section, or delete the file or the page.
- After the owner answers about a proposal, remove its line under "Waiting on" in the project's Current State. That line starts "Owner: save to memory?". When such a line names no proposal, put its question in the numbered table, and remove the line after the owner answers. A line that starts "Owner: add to the project rules?" stays until the owner answers it.

### Old Hindsight entries

A `hindsight` entry in `.mcp.json`, or a `[mcp_servers.hindsight]` table in `.codex/config.toml`, shows that the project was set up for the old Hindsight server on the Mac. List it, and tell the owner that this project's memory is on that old server, and that the toolkit has no step for moving memory between servers. When the owner says to use the VPS from now on, set the project up as `hindsight-on-vps.md` says, and remove the old entries after the owner's yes.

### Files from the retired toolkit program

The retired `toolkit` program left these files in a project: `.toolkit.json`, `.codex/rules/toolkit.rules`, and `.toolkit-cache/`. List them, and delete them only after the owner's yes.

- A `DECISIONS.md` that the retired program wrote is the owner's record. `one-home-layout.md` carries it over.
- Records in old `.work-items/` or `.memory/` folders are the owner's. Never delete them.
  - Leave alone a folder that `PROJECT.md` names as old records kept as history.
  - For any other such folder, ask the owner whether to carry its records over, as `move-over.md`, "6. Carry over the old records", says. That section gives the steps for carrying old records over.

### An old pre-commit Git hook

Look for a `pre-commit` Git hook of this copy of the repository whose text names `check-knowledge`. `ls "$(git rev-parse --git-path hooks)"` lists the Git hooks of this copy. The older claude-toolkit installed that hook, and it stops commits once its tools are gone. List it, and remove it only after the owner's yes.

## 5. Services

Do each line that fits the project. Each line names the section that holds the steps.

- For a Notion project, follow `notion.md`, "Updating a Notion project". That section says which Notion steps bring the project up to the current template.
- For a Hindsight project, do the check under "Check a Hindsight project, or connect a new computer" in `hindsight-on-vps.md`. Fix each failure only after the owner's yes. Name the server the project uses in the report.
- For a GitHub Issues project, follow `github.md`, "Bringing a project up to date". Add missing labels only after the owner's yes.
- For local work items that were set up before toolkit 0.6.0, follow `earlier-versions.md`, "Work items from Stage to State". Such work items have a `stage:` line.
- For every project that was set up before toolkit 0.8.0, follow `earlier-versions.md`, "The levels structure (toolkit 0.8.0)". Do it after the service step for the place where the project keeps its work items.
- For every project that was set up before toolkit 0.8.1, follow `earlier-versions.md`, "The Requirements layout (toolkit 0.8.1)".

## 6. A project set up before the current folder layout

When "Find the old layout" (section 2) found anything, follow `one-home-layout.md`, after sections 3 to 5. That file holds the plan the owner approves, where each old file or record goes, and the order of the moves.

## 7. Checks and report

Do these in order.

1. **`validate-records.mjs`.** Follow section 3, "Turning on validate-records.mjs and the pre-commit file".
2. **The final checks.** Run the final checks in `finishing.md`, "Final checks", from your worktree.
   - The checks on `memory/` and `work-items/` wait for step 5.
   - The temporary folder stays until step 6.
   - Also run the two settings checks in `skills-hooks-settings.md`, "Check", on the worktree's own settings files: each of the toolkit's hook handlers is there once, and the `description` in `.codex/hooks.json` contains the snippet's text.
3. **Report.** Report what was replaced, merged, added, moved, and left as the owner's. Then name the owner's steps:
   - trust the hooks again in Codex `/hooks`, only when an entry or the `description` in `.codex/hooks.json` changed;
   - start a new session.
4. **Commit and merge.** End with the commit offer in `finishing.md`, "The commit offer", made in your worktree. After the commit, merge the branch only after the owner's yes. Before the merge, whether it is by pull request or by `git merge`, do the merge-safety check in the project's `.claude/rules/shared-repository-work.md`. Merge the branch by pull request, or, when the project has no remote, by `git merge --ff-only <branch>` from the main checkout.
5. **In the main checkout, after the branch was merged**, make every change to `memory/` and `work-items/`:
   - the missing files (section 3);
   - each difference in those two folders that the owner said yes to;
   - the changes of `earlier-versions.md`;
   - step 8 of `one-home-layout.md`, when that file ran.

   Then run the final checks on these two folders, and run `validate-records.mjs` again (`node .claude/hooks/validate-records.mjs --all < /dev/null`). The expected result is that it prints nothing.
6. Remove the worktree and the branch, then the temporary folder.

## Changing a setup choice

Change a setup choice only when the owner asks, for example "move memory to Notion". A setup choice is where work items are kept or where memory is kept.

### Where work items or memory are kept

A choice decides which files a project has, never which lines inside a file. So a changed choice does three things: it adds the files of the new choice's setup folders, it removes the files of the old choice's setup folders, and it changes lines of "Toolkit settings". No other line of `AGENTS.md`, `README.md`, `PROJECT.md`, or a rule changes.

1. Tell the owner what changes and what cannot move (for example Notion page history and comments), and get the owner's yes.
2. Make your own worktree and branch, as "Before you start" says. In the worktree, change `PROJECT.md`, "Toolkit settings":
   - Change the Tracker or Memory line.
   - Write `not used` on each line that only the old choice used.
   - Write the new choice's lines as `setup-copy.md`, "The project name and "Toolkit settings"", says. That section gives the value of each line.
3. Build a new setup copy for the new choices and compare, as sections 1 and 2 say.
   - Add each file the project lacks, as the "Missing files" row says, except the affected merged skill folder. Keep that skill and its selected store reference in the old form until the records have moved in step 5. Install the affected skill folder from the setup copy in step 6.
   - Keep the old choice's installed instructions until the records move in step 5. Read the old `references/work-tracker.md` or `references/memory-store.md` before the change. In a project from before the merge, read `using-work-tracker` or `using-memory-store` instead. Read the new choice's selected reference in the setup copy to learn how to create and read back its records. Do not install the new choice's reference over the old one yet.
   - A new memory choice also replaces the toolkit's hook handlers in `.claude/settings.json` and `.codex/hooks.json` with the new choice's snippets (`skills-hooks-settings.md`, "Merge rules"). The owner trusts the changed Codex hooks again in `/hooks`.
4. Run the service step for the new choice (`notion.md`, `github.md`, or `hindsight-on-vps.md`).
   - When the project already has work items or memory in Notion and adds the other one, make no second project page. Follow `notion-build/work-setup.md`, "Adding work items or memory later".
   - When memory moved out of Hindsight, after the owner's yes also remove the project's folder from the settings of Hindsight's coding-agent add-on, so that the add-on is switched off there.
5. Move the records one at a time, with a preview of each record and the owner's yes, and read each record back in its new place. Delete nothing from the place where the work items were kept before, or from the old memory system.
   - When the records go into Hindsight, the add-on's tools load only in the next session. So save each record through the server's API, with the record's ID as the ID of the saved document, and read the record back with a search after the save has finished.
6. After the records are moved and the owner says yes to the list, install the new choice's merged skill folder from the setup copy and remove the old choice's files. Check for owner edits before replacing or removing a skill file. The selected `references/work-tracker.md` or `references/memory-store.md` then contains the new choice's instructions. Remove a retired storage-skill folder only after checking it for owner edits and getting the owner's yes.
   - The list is every file of the old choice's setup folders that no setup folder of the new choices holds. `(cd <skill folder>/assets/<folder> && find . -type f)` prints a folder's files, and `setup-copy.md`, "Folders the choices add", names the folders of each choice. `<skill folder>` is the folder that holds this skill's `SKILL.md`.
   - Memory that moved to Hindsight keeps `memory/CURRENT_STATE.md`.
   - A file in `work-items/` or `memory/` that is not in a setup folder is the owner's record. It stays until the owner says what to do with it.

# Updating a project ("update the toolkit")

Use this file when the owner says "update the toolkit" in a project that is already set up with Toolkit V2, and when the owner asks to change a setup choice, such as where memory is kept. An update brings the project up to the toolkit that is installed on this computer. When the update is done, all of these are true:

- The project has the newer skills and hook commands.
- The project's settings files are merged with the newer settings.
- The project's files hold the toolkit's newer text, wherever the owner said yes to it.

A project that differs from the toolkit on purpose is not a fault. An update shows the owner what differs and changes only what the owner says yes to.

This file uses four names:

- The **setup copy** is the project's finished files, built in a temporary folder before anything is put into the project. The commands write its path as `<copy>`.
- A **setup folder** is a folder in this skill's `assets/` folder that holds project files at the paths a project has them.
- The **main checkout** is the project's main folder: the first path that `git worktree list` prints. The commands write its path as `<main checkout>`.
- A **worktree** is a separate folder with its own branch. The commands write `<worktree>` for the worktree that you make under "Before you start".

## Contents

- Before you start
- 1. Build a new setup copy
- 2. See what differs
- 3. What to do with each kind of file
  - Special cases for the rows of the table
  - Whether a difference is the owner's edit
  - Updating AGENTS.md
- 4. What the toolkit no longer ships
- 5. Services
- 6. Checks and report
- Changing a setup choice
  - Where work items or memory are kept

## Before you start

- Read the project's choices in `PROJECT.md`, section "Toolkit settings": Tracker, Memory, the ID prefix, the links, and the Hindsight bank. Never change a choice unless the owner asks. "Changing a setup choice", at the end of this file, gives the steps for that.
  - The project is a Salesforce project when the "Salesforce org aliases" line holds a value other than `not used`.
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
  - Change them in the main checkout, and only after the branch was merged (section 6, step 4). A work item or a memory record must never name a record that is not on the default branch.

## 1. Build a new setup copy

Build the setup copy exactly as for a new project, for the choices that `PROJECT.md` records, in a new temporary folder. Follow two files, in this order:

1. `setup-copy.md` gives the steps for making the temporary folder and copying the setup folders into it.
2. `skills-hooks-settings.md` gives the steps for adding the settings to the setup copy and for checking its skills and hook commands.

While you build the setup copy, do the following:

- Fill the project name and "Toolkit settings" from the project's own `PROJECT.md`.
- With memory in Notion, also replace `{{CURRENT_STATE_PAGE_ID}}` in the copy's `.claude/settings.json` and `.codex/hooks.json` with the id on the "Current state page" bullet under "Notion memory" in `PROJECT.md`. The "Current state page" is the Notion page that holds the project's Current State, which is the project's one short page of what is true now.

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

## 3. What to do with each kind of file

For each file that differs, and each file the project lacks, find its kind in the table below and do what the row says.

Show the owner every file that needs the owner's answer in one numbered table, with one line per file and the reason on that line, and ask once. Carry out what the owner says yes to. The rest of this file calls that table "the numbered table".

Most rows have special cases. They are listed under the table, in "Special cases for the rows of the table", by the name of the row. Read the special cases of a row before you act on that row.

| Kind | Files | What to do |
| --- | --- | --- |
| Toolkit skills | each folder in `<copy>/.claude/skills/` | Replace the project's folder with the new folder, one skill at a time: `rsync -a --delete <copy>/.claude/skills/<name>/ .claude/skills/<name>/` |
| Hook commands | `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs` | Replace each file after the owner's yes: `cp <copy>/.claude/hooks/<file> .claude/hooks/<file>` |
| Settings | `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge each file with the rules in `skills-hooks-settings.md`. |
| Missing files | every `>f+++++++` line | List the missing files, then copy them into the project. |
| Ignore files | `.gitignore`, `.ignore` | Add each line of the setup copy's file that the project's file lacks, at the end after one blank line. Ask no question. The change only adds lines, and the owner's request to update the toolkit is the owner's yes to it. |
| `AGENTS.md` | the root file | Follow "Updating AGENTS.md" below. |
| `PROJECT.md`, "Toolkit settings" | | Make the section hold the 10 lines of the setup copy's section, with the same labels, in the same order. |
| Files that hold the owner's facts | the rest of `PROJECT.md`; `README.md`, `SOUL.md`, `PROJECT-ROADMAP.md`, `DECISIONS.md`, each document in `system/`, `sources/README.md`, `reference/outside-docs/INDEX.md` | Never overwrite one of these files. Name only the toolkit's changes (a new section, a changed heading, a changed guide comment), and make them after the owner's yes. |
| Rules in `.claude/rules/` | | Show the owner what differs. |
| Other toolkit files | the `AGENTS.md` of each folder (`system/AGENTS.md`, `sources/AGENTS.md`, `delivery/AGENTS.md`, `reference/AGENTS.md`, `work-items/AGENTS.md`, `memory/AGENTS.md`), the templates, and the output style | Say in one line what changed, and whether the file holds an edit of the owner's. Take the toolkit's version after the owner's yes. |
| The owner's own records | work items and `work-items/PROJECT-TASKS.md`; the entries of `DECISIONS.md`; the rules and terms in `system/`; the sources in `sources/`; the records in `delivery/` and `reference/`; `memory/CURRENT_STATE.md` and every memory record in `memory/`; `.claude/rules/owner-preferences.md`; `.claude/rules/salesforce-agent-permissions.md`; the owner's own skills and rules | Never compare or change one of these. |

### Special cases for the rows of the table

- **Toolkit skills.** The command deletes every file in the project's folder that the new folder lacks. So before you run the command for a skill, list each file inside the project's folder that the new folder lacks, and ask the owner about those files.
- **Hook commands.**
  - Codex trusts the hook entry in `.codex/hooks.json`, not the file that the entry runs, so a replaced command file is not reviewed again. For that reason, put each replaced `.mjs` file in the numbered table, with one plain line that says what its diff changes, and copy the file only after the owner's yes.
- **Settings.** `skills-hooks-settings.md`, "Merge rules", gives the merge rules in full. All of the following apply:
  - Add what is missing.
  - Ask before you change a value.
  - Replace the toolkit's own hook handlers. Do not add a second copy of one.
  - Delete no other entry.
  - A changed Codex hook must be trusted again in `/hooks`. Tell the owner.
- **Missing files.** Copy the missing files in two parts.
  - Copy into the worktree with `rsync -rlt --ignore-existing --exclude /memory/ --exclude /work-items/ <copy>/ <worktree>/`. Do not use `-a`, because `-a` would give the project folder the temporary folder's private permissions.
  - Copy into the main checkout after the branch was merged (section 6, step 4), and only when the setup copy has the folder. The commands are `rsync -rlt --ignore-existing <copy>/memory/ <main checkout>/memory/` and `rsync -rlt --ignore-existing <copy>/work-items/ <main checkout>/work-items/`.
- **`PROJECT.md`, "Toolkit settings".**
  - Add each line that the project's section lacks, with the value `not used`.
  - Keep the value of every line that stays. A line that the setup copy's section no longer has is handled as section 4 says.
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
  - `.claude/rules/salesforce-agent-permissions.md` holds the owner's choices about what an agent may do in each kind of Salesforce org. A Salesforce project that has no such file gets the setup copy's file through the "Missing files" row.

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
- **A heading of the setup copy's file is missing from the project's file, or the order differs.** This is the case when the toolkit moved, renamed, or added a section. Changing named lines cannot give the project the new layout, so build a new file:
  1. Start from `<copy>/AGENTS.md`, which already has the project's name.
  2. Replace its outcome prompt and its "Build, test, or deploy" row with the project's current ones, and delete its fill-in guide comment.
  3. Find the lines that the owner added or changed with `diff -u AGENTS.md <copy>/AGENTS.md`. Then decide for each of those lines:
     - Drop a line that only repeats what the new file already says about the toolkit (a skill line, a line of a rules list between two `toolkit:rules` marker lines, a line about a setup choice).
     - Carry over a line that holds a fact, a command, or an instruction of the owner's own, into the section where it fits. A whole section that the owner added goes in right after "Commands".
     - When you cannot tell whether to drop a line or carry it over, carry the line over and mark it in the list in step 5.
  4. Run `wc -lc <copy>/AGENTS.md`. The limits are at most 200 lines and at most 24,576 bytes. When the owner's added lines put the file over either limit, say so in the list in step 5, and recommend which of those lines to move, and where. Cut no line of the owner's without the owner's yes.
  5. Show the owner the whole new file, and under it one short list: each line you carried over, and each of the owner's lines you dropped, with the reason. Write nothing until the owner says yes. After the owner's yes, write the new file as `AGENTS.md` in your worktree.

## 4. What the toolkit no longer ships

A project may hold something that an earlier setup put there and that the new setup copy does not have. Examples are a skill folder, a rule, a hook command with its entry in a settings file, a settings file of the toolkit's own, a line of "Toolkit settings" in `PROJECT.md`, and a Git hook in this copy's Git hooks folder with the Git setting `core.hooksPath` that points to it. The comparison in section 2 lists only what the setup copy holds, so look for these yourself.

- List each one in the numbered table, with one line that says what it is. Remove it only after the owner's yes.
- A skill, a rule, or a hook that the owner added is the owner's. When you cannot tell whether a thing came from the toolkit or from the owner, leave it and ask.
- When the thing holds a choice or a line of the owner's, show it to the owner, and put it in the place that holds such a choice now before you remove the old one. For example, a choice about what an agent may do in a Salesforce org goes in `.claude/rules/salesforce-agent-permissions.md`, and an instruction for how the agent works goes in `.claude/rules/owner-preferences.md`.
- Remove a hook command and its entry in the settings files in the same change, with any group or event that the entry leaves empty.
- When a rule or a skill of the owner's own names a file that is removed or renamed, list it, and change the name after the owner's yes.
- This section never removes a record. A work item, a memory record, a decision, a source, and any file in a folder of older records, such as `.work-items/` or `.memory/`, is the owner's, and it stays.

## 5. Services

Do each line that fits the project. Each line names the section that holds the steps.

- For a Notion project, follow `notion.md`, "Updating a Notion project". An update changes nothing in Notion.
- For a Hindsight project, do the check under "Check a Hindsight project, or connect a new computer" in `hindsight-on-vps.md`. Fix each failure only after the owner's yes. Name the server the project uses in the report.
- For a GitHub Issues project, follow `github.md`, "Bringing a project up to date". Add missing labels only after the owner's yes.
- For a Salesforce project, write the entries for each production org as `salesforce.md`, "The refuse list for production", says, before section 4 removes a guard that an earlier setup put there. `tools/kb/`, `tools/permissions/`, and the rules `dependency-graph.md` and `permissions-source-control.md` are the project's own, and they stay.

## 6. Checks and report

Do these in order.

1. **The final checks.** Run the final checks in `finishing.md`, "Final checks", from your worktree. The temporary folder stays until step 5.
2. **Report.** Report what was replaced, merged, added, removed, and left as the owner's. Then name the owner's steps:
   - trust the hooks again in Codex `/hooks`, only when an entry or the `description` in `.codex/hooks.json` changed;
   - start a new session.
3. **Commit and merge.** End with the commit offer in `finishing.md`, "The commit offer", made in your worktree. After the commit, merge the branch only after the owner's yes. Before the merge, whether it is by pull request or by `git merge`, do the merge-safety check in the project's `.claude/rules/shared-repository-work.md`. Merge the branch by pull request, or, when the project has no remote, by `git merge --ff-only <branch>` from the main checkout.
4. **In the main checkout, after the branch was merged**, make every change to `memory/` and `work-items/`: the missing files (section 3), and each difference in those two folders that the owner said yes to.
5. Remove the worktree and the branch, then the temporary folder.

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
   - Keep the old choice's installed instructions until the records move in step 5. Read the old `references/work-tracker.md` or `references/memory-store.md` before the change. Read the new choice's selected reference in the setup copy to learn how to create and read back its records. Do not install the new choice's reference over the old one yet.
   - A new memory choice also replaces the toolkit's hook handlers in `.claude/settings.json` and `.codex/hooks.json` with the new choice's snippets (`skills-hooks-settings.md`, "Merge rules"). The owner trusts the changed Codex hooks again in `/hooks`.
4. Run the service step for the new choice (`notion.md`, `github.md`, or `hindsight-on-vps.md`).
   - When the project already has work items or memory in Notion and adds the other one, make no second project page. Follow `notion-build/work-setup.md`, "Adding work items or memory later".
   - When memory moved out of Hindsight, after the owner's yes also remove the project's folder from the settings of Hindsight's coding-agent add-on, so that the add-on is switched off there.
5. Move the records one at a time, with a preview of each record and the owner's yes, and read each record back in its new place. Delete nothing from the place where the work items were kept before, or from the old memory system.
   - When the records go into Hindsight, the add-on's tools load only in the next session. So save each record through the server's API, with the record's ID as the ID of the saved document, and read the record back with a search after the save has finished.
6. After the records are moved and the owner says yes to the list, install the new choice's merged skill folder from the setup copy and remove the old choice's files. Check for owner edits before replacing or removing a skill file. The selected `references/work-tracker.md` or `references/memory-store.md` then contains the new choice's instructions.
   - The list is every file of the old choice's setup folders that no setup folder of the new choices holds. `(cd <skill folder>/assets/<folder> && find . -type f)` prints a folder's files, and `setup-copy.md`, "Folders the choices add", names the folders of each choice. `<skill folder>` is the folder that holds this skill's `SKILL.md`.
   - Memory that moved to Hindsight keeps `memory/CURRENT_STATE.md`.
   - A file in `work-items/` or `memory/` that is not in a setup folder is the owner's record. It stays until the owner says what to do with it.

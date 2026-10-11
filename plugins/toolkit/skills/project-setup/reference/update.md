# Updating a project ("update the toolkit")

Use this file when the owner says "update the toolkit" in a project that is already set up with Toolkit V2, and when the owner asks to change a setup choice, such as where memory is kept. An update brings the project up to the toolkit that is installed on this computer. When the update is done, all of these are true:

- The project has the newer skills and hook commands.
- The project's settings files are merged with the newer settings.
- The project's files hold the toolkit's newer text, wherever the owner said yes to it.

A project that differs from the toolkit on purpose is not a fault. An update shows the owner what differs and changes only what the owner says yes to.

This file uses four names:

- The **setup copy** is the project's finished files, built in a temporary folder before anything is put into the project. The commands write its path as `<copy>`.
- A **setup folder** is a folder in this skill that holds project files at the paths a project has them: `every-project/`, and each `files-to-add/` folder under `choices/`.
- The **main checkout** is the project's main folder: the first path that `git worktree list` prints. The commands write its path as `<main checkout>`.
- A **worktree** is a separate folder with its own branch. The commands write `<worktree>` for the worktree that you make under "Before you start".

## Contents

- Before you start
- 1. Build a new setup copy
- 2. See what differs
- 3. What to do with each kind of file
  - Whether a difference is the owner's edit
  - Updating AGENTS.md
- 4. What the toolkit no longer ships
- 5. Services
- 6. Checks and report
- Changing a setup choice
  - Where work items or memory are kept

## Before you start

When an existing Notion project needs migration to Project Wiki, use the reviewed batch procedure in "Changing a setup choice" before installing the new operational files. Prepare new files in the setup copy, and preserve the installed skills, record routes and settings until the approved destinations and moved records are verified. Then resume the update. This applies even when Memory remains `notion`.

- Read the project's choices in `PROJECT.md`, section "Toolkit settings": Tracker, Memory, the ID prefix, the links, and the Hindsight bank. Never change a choice unless the owner asks. "Changing a setup choice", at the end of this file, gives the steps for that.
  - The project is a Salesforce project when "Toolkit settings" has a "Salesforce org aliases" line.
  - A project whose owner deleted `SOUL.md` does not get it back.
- Take the new files from this skill's setup folders, in the toolkit plugin that is installed on this computer.
  - When the owner says that the toolkit itself changed, but this skill's setup folders do not have the change the owner names, ask the owner before you update the plugin, because updating the plugin changes the owner's computer.
  - In Claude Code, the commands are `claude plugin marketplace update toolkit-v2`, then `claude plugin update toolkit@toolkit-v2`.
  - In Codex, the command is `codex plugin add toolkit@toolkit-v2`.
  - Then the owner starts a new session, which is a new chat with the agent.
- Before you change any file, make your own worktree and branch, as the project's `.claude/rules/shared-repository-work.md` says, because other sessions may be working in the main checkout. The command is `git -C <main checkout> worktree add .claude/worktrees/toolkit-update-<YYYY-MM-DD> -b claude/toolkit-update-<YYYY-MM-DD>`, where `<main checkout>` is the first path that `git worktree list` prints.
  - Run sections 2 to 4 in your worktree, with `rsync` and `diff` pointed at the worktree in place of `./`.
  - Run the service steps (section 5) from your worktree too, so that a file they change, such as `.mcp.json`, `.codex/config.toml`, or `PROJECT.md`, is committed on your branch.
  - Checking the setup needs no worktree. It inspects and reports, with the generated-index and missing-template maintenance in [reference/finishing.md](finishing.md), "The final checks in "check the setup"".
- Git ignores `memory/` and `work-items/`, so these two folders are not in the worktree.
  - Compare them in the main checkout (section 2).
  - Change them in the main checkout, and only after the branch was merged (section 6, step 4). A work item or a memory record must never name a record that is not on the default branch.

## 1. Build a new setup copy

Build the setup copy for the choices that `PROJECT.md` records, in a new temporary folder. Follow two files, in this order:

1. [reference/setup-copy.md](setup-copy.md) gives the steps for making the temporary folder and copying the setup folders into it.
2. [reference/skills-hooks-settings.md](skills-hooks-settings.md) gives what must be true of the skills, the hook commands, and the settings. The setup file of each choice gives, in a step or in the file that a step names, the settings lines that the choice changes.

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

For each different or missing file, use the section for its kind below. Show every change that needs the owner's answer in one numbered table, with one row per file and its reason, and ask once. This file calls that table "the numbered table". For changes that require approval, carry out only what the owner approves. The sections below also identify changes the update request already authorizes.

### Toolkit skills

For each toolkit skill in `<copy>/.claude/skills/`, replace the project's folder with the new folder:

```text
rsync -a --delete <copy>/.claude/skills/<name>/ .claude/skills/<name>/
```

Before running the command, list each file in the project's skill folder that the new folder lacks, and ask the owner about those files. The command deletes them. The owner's own skills are records protected under "The owner's own records" below.

### Hook commands

For `session-start.mjs`, `prompt-reminder.mjs`, and `codex-after-commit.mjs`, put each changed command in the numbered table with a plain description of its diff. Copy it only after the owner's yes:

```text
cp <copy>/.claude/hooks/<file> .claude/hooks/<file>
```

Codex trusts the entry in `.codex/hooks.json`, not the command file it runs. A replacement `.mjs` file is not reviewed again, so the owner reviews the command change here.

### Settings files

Merge `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, and `.mcp.json` as [reference/skills-hooks-settings.md](skills-hooks-settings.md), "Merge rules", says. Add missing entries, ask before changing a value, replace the toolkit's own hook handlers without keeping a second copy, and delete no unrelated entry. Tell the owner when a changed Codex hook must be trusted again in `/hooks`.

### Missing files

List missing toolkit files, then copy them in two parts. An owner's record is never a missing toolkit file.

- Copy into the worktree with `rsync -rlt --ignore-existing --exclude /memory/ --exclude /work-items/ <copy>/ <worktree>/`. Use `-rlt` rather than `-a`, because `-a` would give the project folder the temporary folder's private permissions.
- After the branch is merged (section 6, step 4), copy each ignored folder that the setup copy holds into the main checkout. The commands are `rsync -rlt --ignore-existing <copy>/memory/ <main checkout>/memory/` and `rsync -rlt --ignore-existing <copy>/work-items/ <main checkout>/work-items/`.

A missing `owner-preferences.md`, or `salesforce-agent-permissions.md` in a Salesforce project, gets its setup copy once. An existing one is the owner's record and is never compared or replaced.

### Ignore files

For `.gitignore` and `.ignore`, add each line the project's file lacks, at the end after one blank line. Ask no question: the change only adds lines, and the request to update the toolkit authorizes it.

### AGENTS.md

For the root file, follow "Updating AGENTS.md" below.

### PROJECT.md, "Toolkit settings"

Add each line the section lacks, keeping the setup copy's labels. Keep the value of every line that stays. Handle a line the setup copy no longer has under section 4. Show the owner the section before and after.

### Files that hold the owner's facts

Never overwrite the rest of `PROJECT.md`, `README.md`, `SOUL.md`, `PROJECT-ROADMAP.md`, `DECISIONS.md`, documents in `system/`, `sources/INDEX.md`, or `reference/outside-docs/INDEX.md`. Name only the toolkit's structural changes, such as a new section, changed heading, or changed guide comment. Make those changes after the owner's yes, keeping the facts and records.

### Rules and other toolkit files

For rules in `.claude/rules/`, show what differs. For each folder's `AGENTS.md`, the templates, and the output style, describe the change and whether it includes an owner's edit. The folder guides are `system/AGENTS.md`, `sources/AGENTS.md`, `delivery/AGENTS.md`, `reference/AGENTS.md`, `work-items/AGENTS.md`, and `memory/AGENTS.md`.

Use "Whether a difference is the owner's edit" below to check ownership. Recommend the toolkit's version when there is no owner's edit. Keep an owner's edit unless the owner approves replacing it. Take a changed toolkit file only after the owner's yes.

### The owner's own records

Never compare or change the following during an update:

- work items and `work-items/PROJECT-TASKS.md`;
- entries of `DECISIONS.md`, rules and terms in `system/`, sources in `sources/`, and records in `delivery/` and `reference/`;
- `memory/CURRENT_STATE.md` and every memory record whose name starts `user_`, `project_`, `reference_`, or `event_`;
- `.claude/rules/owner-preferences.md` and `.claude/rules/salesforce-agent-permissions.md`;
- the owner's own skills and rules.

`memory/project_topic_template.md` is a template, so "Rules and other toolkit files" covers it. `memory/MEMORY.md` is a generated index that the session-start hook rebuilds; do not compare it either.

### Whether a difference is the owner's edit

A file that differs from the setup copy differs for one of two reasons, or for both: the owner edited the file, or the toolkit changed the file after the project got it. Git history shows which reason applies. For a file that Git tracks, run these commands:

```text
git log --format='%h %ad %s' --date=short -- <file>
git show --stat --format= <commit>
git status --short -- <file>
```

- The first command lists the commits that changed the file.
- A commit is the toolkit's when both of these are true: the second command also lists a file under `.claude/skills/` for that commit, and the commit's message names the setup or a toolkit update. Each of those two jobs commits skills together with the other toolkit files.
  - The owner may also change a rule and a skill in one commit of the owner's own. When the message does not show which of the two the commit is, ask the owner.
- When all of a file's commits are the toolkit's, and the third command does not list the file, the file holds no edit of the owner's. Say so on the file's line of the numbered table, and recommend the toolkit's version.
- When a file has any other commit, or the third command lists the file, the file holds an edit of the owner's. Show the difference. The owner's edit stays unless the owner says to take the toolkit's version.
- A file that Git does not track (in `work-items/` or `memory/`) has no history. Show the difference and ask.

### Updating AGENTS.md

The root `AGENTS.md` reads the same in every project, except for two prompts that the owner filled, which are the outcome sentence and the "Build, test, or deploy" row, and the lines that the setup files of the project's choices add. The owner may also have added lines. List the `## ` headings of both files:

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
     - Drop a line that only repeats what the new file already says about the toolkit (a skill line, a line about a setup choice).
     - Carry over a line that holds a fact, a command, or an instruction of the owner's own, into the section where it fits. A whole section that the owner added goes in right after "Commands".
     - When you cannot tell whether to drop a line or carry it over, carry the line over and mark it in the list in step 5.
  4. Check that `AGENTS.md` holds only what every session needs and fits within the host's instruction budget, including other loaded instruction files. For Codex, check the configured `project_doc_max_bytes` (32 KiB by default). When instructions risk being cut off, say so in step 5 and recommend what to move and where. Cut no line of the owner's without the owner's yes.
  5. Show the owner the whole new file, and under it one short list: each line you carried over, and each of the owner's lines you dropped, with the reason. Write nothing until the owner says yes. After the owner's yes, write the new file as `AGENTS.md` in your worktree.

## 4. What the toolkit no longer ships

A project may hold something that an earlier setup put there and that the new setup copy does not have. Examples are a skill folder, a rule, a hook command with its entry in a settings file, a settings file of the toolkit's own, a line of "Toolkit settings" in `PROJECT.md`, and a Git hook in this copy's Git hooks folder with the Git setting `core.hooksPath` that points to it. The comparison in section 2 lists only what the setup copy holds, so look for these yourself.

- List each one in the numbered table, with one line that says what it is. Remove it only after the owner's yes.
- A skill, a rule, or a hook that the owner added is the owner's. When you cannot tell whether a thing came from the toolkit or from the owner, leave it and ask.
- When the thing holds a choice or a line of the owner's, show it to the owner, and put it in the place that holds such a choice now before you remove the old one. For example, a choice about what an agent may do in a Salesforce org goes in `.claude/rules/salesforce-agent-permissions.md`, and an instruction for how the agent works goes in `.claude/rules/owner-preferences.md`.
- Remove a hook command and its entry in the settings files in the same change, with any group or event that the entry leaves empty.
- When a rule or a skill of the owner's own names a file that is removed or renamed, list it, and change the name after the owner's yes.
- This section never removes a record. A work item, a memory record, a decision, a source, and any file in a folder of older records is the owner's, and it stays.

## 5. Services

Do each line that fits the project. Each line names the section that holds the steps.

- For a Notion project, follow what the shared Notion setup file, [choices/notion-shared/notion-setup.md](../choices/notion-shared/notion-setup.md), says for "update the toolkit". An update changes Notion only within an approved migration batch or another explicit owner instruction.
- For a Hindsight project, follow what [choices/memory/hindsight/hindsight-setup.md](../choices/memory/hindsight/hindsight-setup.md) says for an update. Name the server the project uses in the report.
- For a GitHub Issues project, follow what [choices/work-items/github/github-work-items-setup.md](../choices/work-items/github/github-work-items-setup.md) says for "update the toolkit". Add missing labels only after the owner's yes.
- For a Salesforce project, write the entries for each production org as the step on the refuse list for production in [choices/salesforce/salesforce-setup.md](../choices/salesforce/salesforce-setup.md) says, before section 4 removes anything that refuses a change to production. `tools/kb/`, `tools/permissions/`, and the rules `dependency-graph.md` and `permissions-source-control.md` are the project's own, and they stay.

## 6. Checks and report

Do these in order.

1. **The final checks.** Run the final checks in [reference/finishing.md](finishing.md), "Final checks", from your worktree. The temporary folder stays until step 5.
2. **Report.** Report what was replaced, merged, added, removed, and left as the owner's. Then name the owner's steps:
   - trust the hooks again in Codex `/hooks`, only when an entry or the `description` in `.codex/hooks.json` changed;
   - start a new session.
3. **Commit and merge.** End with the commit offer in [reference/finishing.md](finishing.md), "The commit offer", made in your worktree. After the commit, merge the branch only after the owner's yes. Before the merge, whether it is by pull request or by `git merge`, do the merge-safety check in the project's `.claude/rules/shared-repository-work.md`. Merge the branch by pull request, or, when the project has no remote, by `git merge --ff-only <branch>` from the main checkout.
4. **In the main checkout, after the branch was merged**, make every change to `memory/` and `work-items/`: the missing files (section 3), and each difference in those two folders that the owner said yes to.
5. Remove the worktree and the branch, then the temporary folder.

## Changing a setup choice

Change a setup choice only when the owner asks, for example "move memory to Notion". A setup choice is where work items are kept or where memory is kept.

### Where work items or memory are kept

A changed choice does four things: it adds the files of the new choice's setup folders, it removes the files of the old choice's setup folders, it changes lines of "Toolkit settings", and it changes the lines that a choice adds to a file the project already has. No other line of `AGENTS.md`, `README.md`, `PROJECT.md`, or a rule changes.

1. Tell the owner what changes and what cannot move (for example Notion page history and comments), and get the owner's yes.
2. Make your own worktree and branch, as "Before you start" says. Plan these changes for the setup copy; apply them to the project only after verification in step 6:
   - Change the Tracker or Memory line.
   - Remove each line that only the old choice used.
   - Write the new choice's lines as the setup file of the new choice says, and as [SKILL.md](../SKILL.md), "The lines of "Toolkit settings"", says for every line.
   - Take out the lines that the old choice's setup file adds to a file the project already has, such as rows in `AGENTS.md`, entries in the settings files, and lines in `.gitignore`. Put in the lines that the new choice's setup file adds.
3. Build and compare the setup copy for the agreed choices using sections 1 and 2, including the planned settings and routing changes from step 2. Keep the installed configuration unchanged until step 6.
   - Add unrelated missing files as "Missing files" says. Keep affected operational files, including new skills, in the setup copy until the records have moved in step 5. Install them in step 6.
   - Keep the old choice's installed instructions until the records move in step 5. Read the old tracker reference or memory skill and its installed store instructions before the change. Read the new choice’s entry skill and applicable references in the setup copy to learn how to create and read back its records. Do not install the new instructions over the old ones yet.
   - Prepare the new memory choice’s hook handlers in the setup copy’s `.claude/settings.json` and `.codex/hooks.json` ([reference/skills-hooks-settings.md](skills-hooks-settings.md), "What a choice changes in the settings" and "Merge rules"). After step 6 applies the change, the owner trusts the changed Codex hooks again in `/hooks`.
4. Do what the setup file of the new choice gives for outside the project folder. [SKILL.md](../SKILL.md), Step 5, names the setup file of each choice.
   - When the project already has work items or memory in Notion and adds the other one, make no second project page. The shared Notion setup file, [choices/notion-shared/notion-setup.md](../choices/notion-shared/notion-setup.md), says, in a step or in the file that a step names, how a Notion project adds work items or memory later.
   - When memory moved out of Hindsight, after the owner's yes also remove the project's folder from the settings of Hindsight's coding-agent add-on, so that the add-on is switched off there.
5. Preview the named records to move, their destination and any information that cannot transfer. One owner approval may cover that reviewed batch and its confirmed destination. Reuse that approval for the listed moves; ask again before changing the scope or destination. Preserve the originals and read every moved record back in its new place. Record which moves were verified or failed, so a later session can resume without creating duplicates.
   - When the records go into Hindsight, the add-on's tools load only in the next session. So save each record through the server's API, with the record's ID as the ID of the saved document, and read the record back with a search after the save has finished.
6. After the records are moved and the owner says yes to the list, apply the prepared project settings, guide routes and hook changes, install the new choice’s merged skill folder from the setup copy, and remove the old choice’s files. Check for owner edits before replacing or removing a skill file. The installed tracker reference or memory entry skill then routes to the new choice’s instructions.
   - The list is every file of the old choice's setup folders that no setup folder of the new choices holds. `(cd <skill folder>/<folder> && find . -type f)` prints a folder's files, and the setup file of each choice names its folders. [SKILL.md](../SKILL.md), Step 5, names the setup file of each choice. `<skill folder>` is the folder that holds this skill's `SKILL.md`.
   - A Hindsight project has no Current State. When memory moved to Hindsight, `memory/CURRENT_STATE.md` is on the list. Its lines are the owner's record, so show them in the migration preview and confirm where the still-current information will go before the file is removed. Reuse the batch approval when it already covers that mapping. Where the work stands is kept in the place where work items are kept.
   - A file in `work-items/` or `memory/` that is not in a setup folder is the owner's record. It stays until the owner says what to do with it.

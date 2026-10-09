---
name: project-setup
description: 'Sets up, checks, updates, or moves a project onto Toolkit V2. It also changes the project''s work or memory choice, adds SOUL.md, opens the Hindsight dashboard, or connects Hindsight on a new computer. Use for requests such as "set up this project", "check the setup", or "update the toolkit". For new commits from Git, use pull-latest. The older claude-toolkit uses project-sync.'
---

# Project setup

Use this skill for every Toolkit V2 setup job in a project. It does four kinds of job:

- It sets up Toolkit V2 in a new project.
- It checks a project that already has Toolkit V2, or updates it to the toolkit installed on this computer.
- It moves a project that was set up another way onto Toolkit V2.
- It makes one setup change in a project that is set up: where work items or memory are kept, `SOUL.md`, the Hindsight dashboard, or Hindsight on a new computer.

The goal is that every project runs the same files. When a setup, an update, or a move is done, the project holds the files for the owner's choices, and the final checks have run, with each failure fixed or reported. In every job, nothing is made outside the project folder without the owner's yes. The owner is the person the agent works for, who makes the project's decisions.

Two neighbouring jobs belong to other skills:

- A Git pull is the job of `pull-latest`.
- The older claude-toolkit has its own skills, `project-init` and `project-sync`. This skill never runs the older claude-toolkit.

The user dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the user means rather than the literal wording, and ask one short question when a message is unclear or could mean two things.

## How setup works

There is no setup program. You copy and edit the files yourself, from this skill's `assets/` folder. This skill's folder is the folder that holds this `SKILL.md`. Claude Code and Codex each show its path when they load the skill.

This skill and its reference files use three names throughout:

- **"Toolkit settings"** is the section of the project's `PROJECT.md` that records the owner's setup choices, for example where work items are kept.
- A **setup folder** is a folder in `assets/` that holds project files at the paths a project has them. One setup folder, `every-project`, is for every project, and one or more setup folders are for each choice. [references/setup-copy.md](references/setup-copy.md) has the one table of choices and setup folders.
- The **setup copy** is the project's finished files, built in a temporary folder before anything is put into the project.

## Which setup job to do

The folder decides which job this is: a new project, a project that is already on Toolkit V2, or a project to move over. The words the owner used do not decide it. When the owner says "toolkit v2" and nothing else, bring this folder onto Toolkit V2 with the job that fits the folder.

Before your first question in a setup, an update, a check, or a move, say in one line which job it is.

Check the first case below before the others, because a setup that stopped part way also has a filled "Toolkit settings" section.

### A setup that stopped part way

Setup stopped part way when `PROJECT.md`, "Toolkit settings", is filled and at least one of these is true:

- A line for a service still shows its prompt. With Notion, the lines to look at are "Work item ID prefix", "Notion work items", and "Notion memory". With GitHub Issues, the line is "GitHub repository". With Hindsight, the line is "Hindsight bank".
- `{{CURRENT_STATE_PAGE_ID}}` is still in `.claude/settings.json` or `.codex/hooks.json`.
- The project's Current State still has its fill-in guide. The project's Current State is the project's one short page of what is true now.

Say in one line that setup stopped part way. Take the owner's choices from "Toolkit settings". Then continue at step 7 of "New project", and after it do step 8.

### A project that is set up

The project is set up when `PROJECT.md` has a filled "Toolkit settings" section and setup did not stop part way. What you do depends on what the owner asks for.

- **Update the toolkit.** Follow [references/update.md](references/update.md), which gives every step of an update. An update is also the job when the owner says only "toolkit v2".
- **Check the setup.** Do these three things in this order:
  1. Build a new setup copy and compare it with the project, as `references/update.md`, sections 1 and 2, say.
  2. Run the final checks in [references/finishing.md](references/finishing.md), "Final checks", and fix none that fail.
  3. Report each difference and each failed check, with the fix you recommend.

  A check of the setup changes nothing in the project, with two exceptions:
  - Put back a toolkit file that is missing in `work-items/` or `memory/`, as `references/finishing.md`, "Final checks", says.
  - The session-start check may rebuild `memory/MEMORY.md`, which is a generated file.
- **An update or a check in a project set up before the current folder layout.** Say that the project has the earlier layout, and list what [references/one-home-layout.md](references/one-home-layout.md) would move. The current folder layout keeps information the whole project needs in five places, as files in the repository: `DECISIONS.md`, `system/`, `sources/`, `delivery/`, and `reference/`.
- **Change a setup choice.** A setup choice is where work items are kept or where memory is kept. Follow `references/update.md`, "Changing a setup choice".

### Hindsight: the dashboard, the bank's settings, or a new computer

This case fits when the owner asks to open a project's Hindsight dashboard. It also fits when the owner asks to change a setting of the project's Hindsight bank, or to build observations in it. It also fits when a Hindsight project is set up but this computer lacks its key or the add-on, which happens on a new computer. Follow [references/hindsight-on-vps.md](references/hindsight-on-vps.md), "Open the dashboard", "The bank's settings", or "A new computer".

### SOUL.md in a project that is set up

When the owner asks to set up `SOUL.md` in a project that is set up, do these three things:

1. When the project has no `SOUL.md`, copy `assets/soul/SOUL.md` into the project.
2. Fill it with the owner's own words, as `references/finishing.md`, "SOUL.md", says.
3. Offer to commit it.

### A folder with an earlier setup: move it over

The folder has an earlier setup when it has no filled "Toolkit settings" section and its main checkout holds any of these: `AGENTS.md`, `CLAUDE.md`, `.work-items/`, `.toolkit.json`, or a file in `.claude/`, `.codex/`, or `.agents/` other than `.claude/settings.local.json` and `.claude/worktrees/`. The main checkout is the project's main folder: the first path that `git worktree list` prints.

An earlier setup is one of three things: the older claude-toolkit, the retired `toolkit` program, or agent files made by hand. One hand-written `AGENTS.md` is enough to make it an earlier setup. Move the project over, as [references/move-over.md](references/move-over.md) says.

One case asks the owner first. The folder holds files of the older claude-toolkit, and the owner asked to update the toolkit or to check the setup without naming Toolkit V2.

- Before any setup question, ask whether the owner means the older toolkit, whose skill is `project-sync`, or moving this project to Toolkit V2.
- Recommend the older toolkit, because the folder holds its files and no Toolkit V2 settings.
- When the owner means the older toolkit, stop, and say that `project-sync` is the skill for it.
- When the owner means Toolkit V2, move the project over.

### Anything else: a new project

When no case above fits, the project is new. Do the eight steps of "New project" below.

- Put the eight steps in the plan tool. In Claude Code the plan tool is the task list, and in Codex it is `update_plan`. When the one you work in has no plan tool, continue without one.
- Record each answer the owner gives as a checked line, for example `- [x] Work items: local`, because a later turn may start without this skill loaded.

## New project

1. **Look, then interview.** Check the folder first. Then ask one question per message, each with a recommendation: the name and the owner, where work items are kept, where memory is kept, Salesforce, and `SOUL.md`. [references/interview.md](references/interview.md) gives the checks to run before you ask, and the five questions with their recommendations.
2. **Show the plan and wait for the owner's yes.** Name every thing that will be made outside this folder. `references/interview.md`, "The plan to confirm", says what the plan holds.
3. **Ask for the sign-ins that the choices need now**, so the owner can do them while you copy the files: `ntn login` for Notion, and `gh auth login` for GitHub. [references/notion.md](references/notion.md) and [references/github.md](references/github.md) say how to check each sign-in.
4. **Build the setup copy** in a temporary folder: the `every-project` setup folder and the setup folders for the owner's choices, with the project's name and "Toolkit settings" filled. [references/setup-copy.md](references/setup-copy.md) gives the commands.
5. **Add the settings** to the setup copy, and check its skills and hook commands. [references/skills-hooks-settings.md](references/skills-hooks-settings.md) lists the skills and the settings snippets for each choice.
6. **Put the setup copy into the project**, make the `.agents/skills` link, and turn on the check that runs before each commit. Never replace a file the project already has without showing the difference and asking. [references/placing-files.md](references/placing-files.md) gives the steps.
7. **Set up each service**, once its sign-in is done: the Notion pages, the GitHub repository and labels, the Hindsight bank and Hindsight's coding-agent add-on, and the Salesforce facts. Each service has its own file: `references/notion.md`, `references/github.md`, `references/hindsight-on-vps.md`, and [references/salesforce.md](references/salesforce.md).
   - For a Salesforce project, also check that Salesforce's own skills are installed, and ask the owner what to have on or off. `references/salesforce.md` starts with this check and this question. Setup never installs them.
8. **Finish.** Fill the prompts in the copied files with facts the owner confirms, write the project's Current State, run the final checks, name the owner's own steps, report, and offer the commit. `references/finishing.md` gives each of these parts.

## Mistakes to avoid

These are the mistakes that are easy to make during setup, each with the rule that prevents it.

### Questions to the owner

- Ask each question in the reply text, never through a question tool. In `codex exec` the question box is never shown, and the turn ends with no answer.
- Never answer a question for the owner, even when the owner does not reply.
- The project's one-sentence outcome is the owner's answer. It is never a sentence worked out from the code.

### When something fails

- Stop, say what failed, and say what the owner must approve or run.
- Never change an answer the owner gave, about work items, memory, or Salesforce, to get past a failure.
- Never get past a failure by setting the project up in some other folder and copying it over. The setup copy in a temporary folder, in steps 4 to 6, is the normal way.

### Where setup runs

- Set up a new project in its main checkout, never from a worktree, even when a machine-wide rule asks for a worktree. A worktree is a separate folder with its own branch. The reason is that `memory/` and `work-items/`, which Git ignores, must be kept in the main checkout.
- Only an update (`references/update.md`) and a move-over (`references/move-over.md`) use a worktree.

### Outside the project folder

- Make nothing outside the project folder without the owner's yes: no Notion page, no GitHub repository or label, no Hindsight bank, and no install. The plan the owner approved covers only what it named.
- Only two other kinds of file are written outside the project folder:
  - The temporary folders: the one that `references/setup-copy.md`, "Make the temporary folder", makes for the setup copy, and a folder for a Notion body.
  - The Hindsight add-on's files and settings, after the owner's yes, as `references/hindsight-on-vps.md`, "4. The add-on" and "Apply the settings", say.
- Never save a path, a file list, or a diff in a file.
- Remove each temporary folder once its step is done, and the setup copy after the final checks, so that nothing from setup is left in `/tmp`, `$TMPDIR`, or the session scratchpad.

### In Codex

The Codex sandbox refuses to create `.codex/` and `.agents/`, keeps `.git/` read-only, and blocks the network.

- Run each of these commands alone, with `sandbox_permissions` set to `require_escalated` and a one-line reason:
  - each command that writes `.codex/`, `.agents/`, or `.git/`, or a file in the home folder outside the project (`~/.hindsight/`, `~/.claude/`, `~/.codex/`);
  - each Git write;
  - each `ntn`, `gh`, `curl`, `npx`, `open`, and `sf` call.
- Keep a `| jq` filter in the same command as the call it filters. Never join two such commands.
- When a command is refused without asking, as in `codex exec`, show the owner the exact command to run in a terminal, and wait.
- Never drop the Codex files to get past a refusal.

### What setup never does

- Never change anything in this skill's `assets/` folder, because it is the source for every project.
- Never write a script into a project. The only code a project runs is the four hook commands, the `.githooks/pre-commit` file that runs one of them, and, in a Salesforce project, the code of the `salesforce` setup folder: the two guards, the graph Stop hook, and the scripts in `tools/`.
- Never make setup a work item.
- Jira is not offered yet.
- A Hindsight project gets no memory skill from the toolkit. Hindsight's coding-agent add-on brings its own skill and tools, and the project's rule `.claude/rules/hindsight-memory.md` says what the project keeps where.

## References

| File | Open it when |
| --- | --- |
| [references/interview.md](references/interview.md) | Steps 1 and 2: you need the checks to run before asking, the five questions with their recommendations, and the plan the owner confirms. |
| [references/setup-copy.md](references/setup-copy.md) | Step 4, and section 1 of an update: you need the temporary folder, the one table of choices and setup folders, what is never copied, the project's name and "Toolkit settings", the Salesforce entries in the settings file, the owner-preferences rule, and the checks of the setup copy. |
| [references/skills-hooks-settings.md](references/skills-hooks-settings.md) | Step 5: you need the skills each choice adds, the four hook commands, the settings snippets and how to merge them, and how the older plugins are turned off. |
| [references/placing-files.md](references/placing-files.md) | Step 6: you need the steps for copying into the project, the files it already has, the `.agents/skills` link, and the pre-commit check (`core.hooksPath`). An update and a move-over follow the same pre-commit check. |
| [references/notion.md](references/notion.md) | Work items or memory are in Notion: you need the sign-in, the owner's yes, which Notion setup file to follow, and the links. |
| [references/notion-build/work-setup.md](references/notion-build/work-setup.md) | Work items or memory are in Notion: you need the steps of a new project, how to remove the part kept elsewhere, the links in `PROJECT.md`, how to add work items or memory later, how to bring a project up to the current template, the move from Stage to State, how to build the template, and the checks. |
| [references/notion-build/work-layout.md](references/notion-build/work-layout.md) | Work items are in Notion: you need the database views, the property order and page layout, and the request bodies. |
| [references/notion-build/setup.md](references/notion-build/setup.md) | Memory is in Notion: you need the memory steps of a new project, the links in `PROJECT.md`, how to bring memory up to date, and how to build the memory part of a template. Lore's databases, columns, views, and request files are in the Notion files added to `managing-project-memory` from `assets/memory-notion/.claude/skills/`. |
| [references/notion-build/project-page.md](references/notion-build/project-page.md), [references/notion-build/work-item-page.md](references/notion-build/work-item-page.md), [references/notion-build/memory-page.md](references/notion-build/memory-page.md) | You build the Notion template: these three files hold the text of the project page, of the work item template, and of the Memory page. |
| [references/github.md](references/github.md) | Work items are in GitHub Issues: you need the sign-in, the repository, the labels, how to bring a project up to date, and the checks. |
| [references/hindsight-on-vps.md](references/hindsight-on-vps.md) | Memory is in Hindsight: you need what runs on the VPS and what an agent never does there, the access key, the bank, the coding-agent add-on, the settings the owner chooses for a bank, the save-and-search check, how to open the dashboard, how to check a Hindsight project, and the steps for a new computer. |
| [references/salesforce.md](references/salesforce.md) | The project is a Salesforce project: you need the check of Salesforce's skills and the question to the owner about them, the org aliases, and the API version. |
| [references/finishing.md](references/finishing.md) | Step 8: you need the prompts in the copied files, `SOUL.md`, the project's Current State, the final checks, the owner's steps, the report, and the commit offer. |
| [references/update.md](references/update.md) | The owner asks to update the toolkit, to check the setup, or to change a setup choice: you need the new setup copy, what to do with each kind of file that differs, whether a difference is the owner's edit, how to turn on the command that checks the records, `validate-records.mjs`, what the toolkit no longer ships, the services, the checks, and the report. |
| [references/one-home-layout.md](references/one-home-layout.md) | An update or a check finds a project set up before the current folder layout: you need how to find the old layout, the plan table, where each old file or record goes, and the order of the moves. |
| [references/earlier-versions.md](references/earlier-versions.md) | An update finds a project set up before toolkit 0.6.0, 0.8.0, or 0.8.1: you need the move of work items from Stage to State, the levels structure, and the Requirements layout. |
| [references/move-over.md](references/move-over.md) | You move a project that was set up another way onto Toolkit V2: you need which earlier setup it is, the owner's choices, how to read the project, how to sort what it holds, the list and its template, the order of the changes after the owner's yes, how to carry over old records, and how to finish. |
| [references/old-toolkit-pieces.md](references/old-toolkit-pieces.md) | A move-over, steps 2, 3, and 6: you need the old toolkit's plugins, rules, hook commands, tools, and knowledge files with what Toolkit V2 has in their place, the old records, and how an old work item and old memory map to the Toolkit V2 form. |
| `assets/every-project/` | Step 4: this is the setup folder every project gets. Copy it first into the temporary folder. |
| `assets/work-local/`, `assets/work-notion/`, `assets/work-github/` | Step 4: these are the setup folders of the work tracking choice. |
| `assets/memory-local/`, `assets/memory-notion/`, `assets/memory-process/`, `assets/memory-hindsight/` | Step 4: these are the setup folders of the memory choice. |
| `assets/notion-tools/` | Step 4: this is the setup folder for work items or memory in Notion. |
| `assets/salesforce/` | Step 4: this is the setup folder of a Salesforce project. |
| `assets/soul/` | Step 4: this is the setup folder that holds `SOUL.md`. |
| `assets/owner-preferences.md` | Step 4: this is the starting `.claude/rules/owner-preferences.md` that every project gets. |
| `assets/settings/` | Step 5: these are the settings snippets for each choice. |

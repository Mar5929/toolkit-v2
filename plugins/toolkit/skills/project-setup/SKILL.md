---
name: project-setup
description: 'Sets up Toolkit V2 in a new project or in an existing one, and checks or updates a project that already has it. It also changes where a project keeps work items or memory, opens the Hindsight dashboard, or connects Hindsight on a new computer. Use for requests such as "set up this project", "add the toolkit to this project", "check the setup", or "update the toolkit". For new commits from Git, use pull-latest.'
---

# Project setup

This file is the guide for setting up Toolkit V2 in a project. It holds the steps you go through and the questions you ask the owner, in order. Where a step needs more detail, it names the file to open. The owner is the person you work for, who makes the project's decisions.

Setup is done when all of these are true:

- the project holds the full layout, which is everything every project gets;
- each answer of the owner has added its part;
- every answer is written in its place;
- the checks of Step 6 have run, and the owner knows which steps are left for the owner.

There is no setup program. You copy and edit the files yourself. This guide gives the owner's procedure, the questions, and what must be true at the end.

## The folders of this skill

This skill's folder is the folder that holds this `SKILL.md`. Claude Code and Codex each show its path when they load the skill. Every path in this skill starts from that folder.

- `every-project/` is the full layout: every folder, file, rule, skill, and setting that every project gets, at the paths a project has them. Nothing in it belongs to one answer.
- `choices/` has one folder for each answer that adds something to the project. A project gets an answer's part only when the owner gives that answer. Every answer folder has the same shape, and it holds only the parts that its answer needs:
  - one setup file. It opens with one or two sentences that say when you follow the file and what its steps do. After that, it holds only the list of steps you go through, in order. A step holds its whole instruction, or it names the file under `reference/` that holds its detail;
  - `reference/`, which holds the detail that does not fit in a step: how the toolkit sets the answer up by default, the exact text and lines that the answer adds to a file the project already has, the values and commands, and the known problems. Each file covers one subject;
  - `files-to-add/`, when the answer adds files to the project. The files are at the paths a project has them.
- A part that two answers share is kept once, in a folder of its own with the same shape. `choices/notion-shared/` holds what Notion work items and Notion memory share. `choices/memory/shared-by-local-and-notion/` holds the memory skill that local memory and Notion memory both bring.
- `reference/` holds the detail for the steps that belong to no single answer.

## Rules for every step

- Never answer a question for the owner, even when the owner does not reply.
- Never write a fact that the owner did not confirm.
- Make nothing outside the project folder without the owner's yes. Examples are a Notion page, a GitHub repository or label, a Hindsight memory bank, and an install on the owner's computer. A yes covers only what it named.
- Never replace or delete a file that the project already has without showing the owner the difference and asking.
- A project may differ from the toolkit. When the owner wants something set up another way in this project, set it up that way.
- The owner dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the owner means, and ask one short question when a message is unclear or could mean two things.

## Step 1: The owner starts setup

The owner said "set up this project" or named this skill.

- Put Steps 2 to 6 in the plan tool. In Claude Code the plan tool is the task list, and in Codex it is `update_plan`. When the one you work in has no plan tool, continue without one.
- Record each answer the owner gives as a checked line there, for example `- [x] Work items: local`, because a later turn may start without this skill loaded.

## Step 2: Look at the folder

Before you ask anything, learn what the folder already holds. You need it for two things: to say which situation this is, and to offer what the folder already shows as an answer in Step 4.

Say in one line which of these situations this is.

| What the folder holds | What it is | Where you go next |
| --- | --- | --- |
| Nothing, or only the project's own code and documents. A `.claude/settings.local.json` and a `.claude/worktrees/` folder are Claude Code's own and count as nothing. | A new project | Step 3 |
| Agent files that the toolkit did not put there, such as an `AGENTS.md`, a `CLAUDE.md`, rules, skills, or hooks | An existing project that is adopting the toolkit | "An existing project" below |
| A `PROJECT.md` whose "Toolkit settings" section is filled | A project that already has Toolkit V2 | "A project that already has the toolkit" below |
| A `PROJECT.md` from the full layout whose "Toolkit settings" section is not complete, or another sign under "Known problems" that setup stopped part way | A setup that stopped part way | Say so. Read the answers that are already written, and continue at the first question that has no answer. |

"Toolkit settings" is the section of the project's `PROJECT.md` that records the owner's setup choices. A prompt is text in angle brackets that says which fact to write in its place.

These facts about the folder give you answers to offer:

- `git config user.name` prints a name to offer as the owner.
- `git remote -v` shows whether the code is on GitHub.
- `sfdx-project.json` in the folder means that this is a Salesforce project.
- The files in the folder show the language, the framework, and the systems the project touches.

Toolkit V2 is set up at the root of a Git repository, in its main checkout. "Known problems" says why, and what to do when the folder is something else.

## Step 3: Copy the full layout

Copy `every-project/` into the project, hidden files included. Add each file that the project does not have. For a file that the project already has with different content, show the owner the difference and ask.

[reference/placing-files.md](reference/placing-files.md) gives a copy command that never replaces a file, what to do with each kind of file the project already has, and the link `.agents/skills` that lets Codex read the same skills as Claude Code.

## Step 4: Ask the questions

Ask one question per message, in the order of the table. Give each question a recommendation and the reason for it. Where the folder already shows an answer, say what you found, and the owner confirms or corrects it.

Write each answer in its place as soon as the owner gives it. During setup, write a record straight into the project folder, in the form that the guide of its folder gives. Make no worktree and no pull request for it, even where a project skill says to save a record that way: nothing is committed yet, and the setup commit in Step 6 saves every record.

| Order | Question | What to offer or recommend | Where the answer goes |
| --- | --- | --- | --- |
| 1 | What is the project called, and who is the owner? | The folder's name, and the name that `git config user.name` prints | The headings of `AGENTS.md`, `README.md`, and `PROJECT.md`, and the owner's row in `PROJECT.md` |
| 2 | What is this project for, in one sentence? | A sentence from what the folder shows, as a suggestion | The outcome line at the top of `AGENTS.md`, the one-sentence line under the title of `README.md`, and "Intended outcome" in `PROJECT.md` |
| 3 | Who else is involved, and who may decide what? | The people the folder names | One row for each person in "People and ownership" in `PROJECT.md` |
| 4 | Which systems does the project touch, and which of them are production? | The systems the folder shows | One row for each system in "Systems and environments" in `PROJECT.md` |
| 5 | Where are work items kept? | Local files | The "Tracker" line of "Toolkit settings", and Step 5 |
| 6 | Where is memory kept? Then: is Claude Code's own memory on in this project? | Local files, or Notion when work items are in Notion. Claude Code's own memory: off. | The "Memory" line of "Toolkit settings", `autoMemoryEnabled` in `.claude/settings.json`, and Step 5 |
| 7 | Is this a Salesforce project? | Yes when the folder holds `sfdx-project.json`, otherwise no | Step 5 |
| 8 | Which outside tools and services does this project use? | The ones that the folder and the earlier answers show | One line for each under "Resources and project paths" in `PROJECT.md` |
| 9 | What may the agent do without asking? | The toolkit's default, which "Question 9" below names | `.claude/rules/owner-preferences.md` |
| 10 | How should the agent work with the owner on this project? | The `SOUL.md` that the full layout brought | `SOUL.md` |
| 11 | Is there material to start from? | None | `sources/` |
| 12 | Where does the project stand? | None | The roadmap, in the place where work items are kept. With local or Notion memory, also the project's Current State |

The project's Current State is the project's one short page of what is true now. A project with local or Notion memory has one. A Hindsight project has none: where the work stands is in the place where work items are kept.

### What to know for a question

**Question 1.** Replace `<Project name>` on the heading lines of the three files. In `PROJECT.md`, "People and ownership", put this row in place of the example row, because the work skills read the owner's name from it:

`| Owner | <owner's name> | Makes the project's decisions | Every decision: requirements, designs, results, merges, and Done | Setup, <YYYY-MM-DD> |`

**Question 2.** The sentence is the owner's answer. A sentence that you worked out from the code is only a suggestion, and nothing is written until the owner answers.

**Question 4.** Every project is asked this question, because the answer is the base for the project's safety rules: what an agent may change, and where.

**Question 5.** The three choices:

| Choice | "Tracker" value | Good when | What to know |
| --- | --- | --- | --- |
| Local files | `local` | The project is a solo project on one computer. | Work items are files in `work-items/`, which Git ignores, so they exist only on this computer. They need no sign-in and work offline. The whole project folder opens as an Obsidian vault. |
| Notion | `notion` | The owner wants the board on a phone or on the web. | It needs the Notion command-line tool `ntn`, signed in. |
| GitHub Issues | `github` | The code is already kept on GitHub. | It needs the GitHub command-line tool `gh`, signed in, and a GitHub repository. A work item's ID is its issue number, such as `#12`. |

**Question 6.** The three choices:

| Choice | "Memory" value | Good when | What to know |
| --- | --- | --- | --- |
| Local files | `local` | Most projects. | Memory is Markdown files in `memory/`, which Git ignores, so it exists only on this computer. It is private and needs no server. |
| Notion | `notion` | Work items are in Notion, or the owner reads memory on a phone. | Work and memory then sit together and link to each other. It needs `ntn`, signed in. |
| Hindsight | `hindsight` | Search by meaning across the saved records matters. | Memory is in a memory bank on the owner's own Hindsight server. A memory bank is one project's store of memory on that server. The project has no `memory/` folder and no Current State. |

Any mix of the work items choice and the memory choice works, for example work items in Notion with local memory. With every choice, the project's decisions, terms, sources, and the description of its system are files in the repository, and they are never memory.

After the owner has said where memory is kept, ask about Claude Code's own memory. Claude Code can keep notes of its own in a folder on the owner's computer and load them into every session. The toolkit turns that off, so that the project's memory is kept in one place. Say so, and ask: "Do you want Claude Code's own memory on in this project?"

**Question 8.** After the owner's answer, check that each tool is installed and signed in on this computer, and tell the owner what is missing.

**Question 9.** The toolkit's default is in three places of the project: "Ask the owner first" in `AGENTS.md`, "Committing and merging" in `.claude/rules/shared-repository-work.md`, and the Git commands that `.claude/settings.json` refuses or asks about. Tell the owner the default in a few plain lines. Examples to ask about are a push, a merge, a deploy, and sending a message. Write each thing the owner wants different as one line in `.claude/rules/owner-preferences.md`. [reference/finishing.md](reference/finishing.md), "Instructions the owner gives during setup", gives the form of a line.

**Question 10.** Every project has `SOUL.md`. Fill it with the owner's own words, show the owner the text, and change it until the owner says yes.

**Question 11.** File each document, link, and note that the owner gives as a source, in the form that the project's `sources/AGENTS.md` gives. Read the material before you ask question 12.

**Question 12.** Work with the owner until you understand the whole roadmap: the phases of the project, what each phase is for, what is already done, which phase the project is in now, and what comes next. A project that is just starting has a roadmap too, even when it holds only the first phase or two. The work starts from the roadmap. Step 6 says where to write it.

### Each choice has questions of its own

The answers to questions 5, 6, and 7 pick a choice. The questions after that are about how the owner wants that choice set up in this project.

The questions are steps of the choice's setup file. Open that file as soon as the owner gives the answer. The table in Step 5 names it, and Step 5 says how you go through its steps and when the choice is set up. For every choice, the steps have you do these things, in the order that the setup file gives:

- Tell the owner, in a few plain lines, how the toolkit sets the choice up when the owner changes nothing.
- Ask: "This is how the toolkit sets up `<choice>` by default. Is this what you want?"
- After a no, ask what the owner wants to be different.
- Ask the choice's other questions.

## Step 5: Each answer adds its part

Each answer to questions 5, 6, and 7 has a folder under `choices/`, and that folder has one setup file. When the owner gives the answer, open its setup file and go through its steps in the order the file lists them. A step holds its whole instruction, or it names the file under that folder's `reference/` that holds its detail.

| Answer | Setup file |
| --- | --- |
| Work items: local files | [choices/work-items/local/local-work-items-setup.md](choices/work-items/local/local-work-items-setup.md) |
| Work items: Notion | [choices/work-items/notion/notion-work-items-setup.md](choices/work-items/notion/notion-work-items-setup.md) |
| Work items: GitHub Issues | [choices/work-items/github/github-work-items-setup.md](choices/work-items/github/github-work-items-setup.md) |
| Memory: local files | [choices/memory/local/local-memory-setup.md](choices/memory/local/local-memory-setup.md) |
| Memory: Notion | [choices/memory/notion/notion-memory-setup.md](choices/memory/notion/notion-memory-setup.md) |
| Memory: Hindsight | [choices/memory/hindsight/hindsight-setup.md](choices/memory/hindsight/hindsight-setup.md) |
| Salesforce: yes | [choices/salesforce/salesforce-setup.md](choices/salesforce/salesforce-setup.md) |

The steps of a setup file are done at three moments. A step that names no moment is done right after the answer. A step that waits for a later moment says which one.

1. **Right after the answer, before the next question,** ask the choice's own questions, and add what the setup file says the choice adds to the project:
   - the files. Copy each `files-to-add/` folder that the setup file names into the project, the way Step 3 copies the full layout;
   - the lines that it adds to a file the project already has: the settings files, "Toolkit settings" in `PROJECT.md`, `AGENTS.md`, and `.gitignore`. A line whose value is not known yet, such as the id of a Notion page, is added when the value is known.

   When a choice needs a sign-in, ask for it at this moment too, so that the owner can sign in while the interview goes on. The step for the sign-in says how to check it.
2. **When the choice's sign-in is done and the owner has given the answers that the setup file needs,** set up what the choice needs outside the project folder, after the owner's yes. The Notion steps, for example, need the answers to questions 5, 6, and 7.
3. **When setup finishes, in Step 6,** do what the choice needs at the finish, such as its part of the roadmap, of the project's Current State, of the final checks, and of the owner's steps.

Add the files of one work items choice and of one memory choice only. Each of those choices puts a file with the same name inside a skill, so a project with two of them would have the wrong one.

### The lines of "Toolkit settings"

"Toolkit settings" is the section of `PROJECT.md` that records the owner's setup choices. The project's skills read its lines.

- The full layout brings two lines, which every project has: Tracker and Memory.
- Each choice adds its own lines. Its setup file gives them, in a step or in the file that a step names. A project has no line for a choice that the owner did not make.
- Keep every label as it is written there. Write each value inside backticks, for example ``- Tracker: `local` ``. The same text says so when one of its lines has another form.
- Keep the section's fill-in guide comment, because later sessions read it.

## Step 6: Finish

[reference/finishing.md](reference/finishing.md) gives the detail of each part.

1. Check that every answer of the interview is written in its place. The table in Step 4 gives the place for each answer.
2. Write the roadmap from question 12 in the place where work items are kept.
3. With local or Notion memory, write the first lines of the project's Current State. They say where the project stands, from question 12. A Hindsight project has no Current State: where the work stands is in the place where work items are kept.
4. Check that the setup works: the settings files are valid, the session-start command prints the project's Current State when the project has one, and each service that the owner chose answers.
5. Tell the owner the steps that only the owner can do, such as signing in to a service or trusting the project folder in Codex.
6. Report what was set up, what was made outside the project folder, and what is still open.
7. Offer to commit the setup files.

## An existing project

An existing project already has agent files of its own. Read what the project holds first. [reference/existing-project.md](reference/existing-project.md) says what to look for, how the branch works with the folders that Git ignores, and which problems are known.

Then ask the owner one question:

> Do you want everything moved to the toolkit's structure, or do you want to pick and choose?

- **Everything.** Continue at Step 3. Apply the full layout to what is there, and ask about each file of the owner's that the layout would change.
- **Pick and choose.** Work out with the owner which parts of the toolkit this project takes. The toolkit gives no instruction for each possible case. Use your judgment, and ask the owner.

Three rules hold in both cases:

- Never replace or delete a file of the owner's without showing the difference and asking.
- Never delete an old record, such as an old work item or old memory.
- Make the changes on a branch, so that everything can be undone.

## A project that already has the toolkit

What you do depends on what the owner asks for.

- **Update the toolkit.** Follow [reference/update.md](reference/update.md). An update is also the job when the owner says only "toolkit v2".
- **Check the setup.** Compare the project with the toolkit as [reference/update.md](reference/update.md), sections 1 and 2, say. Then run the checks in [reference/finishing.md](reference/finishing.md), "Final checks". Change nothing, with the two exceptions that section gives, and report each difference and each failed check with the fix that you recommend.
- **Change where work items or memory are kept.** Follow [reference/update.md](reference/update.md), "Changing a setup choice".
- **Hindsight: the dashboard, the bank's settings, or a new computer.** Follow the Hindsight setup file, [choices/memory/hindsight/hindsight-setup.md](choices/memory/hindsight/hindsight-setup.md).

## Known problems

**The folder**

- **The folder is not a Git repository, or it sits inside another repository.** The hook commands and the skills find `.claude/hooks/`, `work-items/`, and `memory/` from the root of the Git repository. With no repository, offer `git init`. Inside another repository, recommend setting up the root of that repository, and recommend `git init` in this folder only when this folder is its own project.
- **The session runs in a linked worktree.** A linked worktree is a separate folder with its own branch. The main checkout is the project's main folder, the first path that `git worktree list` prints. Git ignores `memory/` and `work-items/`, so they exist only in the main checkout, and the setup commit belongs on the default branch. Set up a new project in the main checkout, even when a rule for the whole computer asks for a worktree.
- **The project has its own folder named `system/`, `sources/`, `delivery/`, or `reference/`.** The full layout puts a guide, `AGENTS.md`, into each of these folders, and that guide would describe the owner's files there as the project's records. Ask the owner before you copy anything into that folder.
- **Setup stopped part way.** These are the signs: the Tracker or the Memory line of "Toolkit settings" still holds its prompt, one of those lines names a choice whose own lines are missing from the section, `{{CURRENT_STATE_PAGE_ID}}` is still in `.claude/settings.json` or `.codex/hooks.json`, or the project's Current State, in a project that has one, still has its fill-in guide.

**Questions and failures**

- **A question tool shows no question.** In `codex exec` the question box is never shown, and the turn ends with no answer. Ask each question in the reply text.
- **Something fails.** Stop, say what failed, and say what the owner must approve or run. Never change an answer of the owner's, and never set the project up in another folder and copy it over, to get past a failure.
- **The owner asks for Jira.** Jira is not offered yet. Say so, and recommend one of the three choices.

**In Codex**

The Codex sandbox refuses to create `.codex/` and `.agents/`, keeps `.git/` read-only, and blocks the network.

- Run each of these commands alone, with `sandbox_permissions` set to `require_escalated` and a one-line reason:
  - each command that writes `.codex/`, `.agents/`, or `.git/`, or a file in the home folder outside the project (`~/.hindsight/`, `~/.claude/`, `~/.codex/`);
  - each Git write;
  - each `ntn`, `gh`, `curl`, `npx`, `open`, and `sf` call.
- Keep a `| jq` filter in the same command as the call it filters. Never join two such commands.
- When a command is refused without asking, as in `codex exec`, show the owner the exact command to run in a terminal, and wait.
- Never leave out the Codex files to get past a refusal.

## What setup never does

- **It never changes this skill's own folders.** `every-project/` and `choices/` are the source for every project.
- **It never writes a script into a project.** The only code that a project gets from the toolkit is the three hook commands.
- **It never becomes a work item.** No work item is made for setup or for a step of it.
- **It never leaves temporary files.** When you need a temporary folder, remove it once its step is done. Save no path, file list, or diff in a file of the project.

## Files

The table lists the files of `reference/`, the setup file of each answer, and the folders that are copied into a project. Each setup file names the files under its own `reference/` folder that hold the detail of its steps, so the table does not list them.

| File | Open it when |
| --- | --- |
| [reference/placing-files.md](reference/placing-files.md) | Steps 3 and 5: you copy `every-project/` or a `files-to-add/` folder into the project, the project already has one of the files, or you make the `.agents/skills` link. |
| [reference/skills-hooks-settings.md](reference/skills-hooks-settings.md) | Whenever a settings file changes: you need the skills and the three hook commands every project has, the settings every project gets, and the rules for a settings file that already exists. |
| [reference/finishing.md](reference/finishing.md) | Step 6: you need the places an answer is written, the form of a line in `owner-preferences.md`, the project's Current State, the final checks, the owner's steps, the report, and the commit offer. |
| [reference/existing-project.md](reference/existing-project.md) | The folder already has agent files that the toolkit did not put there: you need what to look for, how the branch works with the folders that Git ignores, and the known problems. |
| [reference/update.md](reference/update.md) | The owner asks to update the toolkit, to check the setup, or to change a setup choice. |
| [reference/setup-copy.md](reference/setup-copy.md) | An update or a check: you build the setup copy, which is the files the project would get today, in a temporary folder. |
| [choices/work-items/local/local-work-items-setup.md](choices/work-items/local/local-work-items-setup.md) | The owner keeps work items in local files. |
| [choices/work-items/notion/notion-work-items-setup.md](choices/work-items/notion/notion-work-items-setup.md) | The owner keeps work items in Notion. |
| [choices/work-items/github/github-work-items-setup.md](choices/work-items/github/github-work-items-setup.md) | The owner keeps work items in GitHub Issues. |
| [choices/memory/local/local-memory-setup.md](choices/memory/local/local-memory-setup.md) | The owner keeps memory in local files. |
| [choices/memory/notion/notion-memory-setup.md](choices/memory/notion/notion-memory-setup.md) | The owner keeps memory in Notion. |
| [choices/memory/hindsight/hindsight-setup.md](choices/memory/hindsight/hindsight-setup.md) | The owner keeps memory in Hindsight. |
| [choices/salesforce/salesforce-setup.md](choices/salesforce/salesforce-setup.md) | The project is a Salesforce project. |
| [choices/notion-shared/notion-setup.md](choices/notion-shared/notion-setup.md) | One of the two Notion setup files sends you here for the steps that the two Notion answers share. |
| `every-project/` | Step 3: the full layout. |
| The `files-to-add/` folders under `choices/` | Step 5: the files that an answer adds. Each setup file names its folders. |

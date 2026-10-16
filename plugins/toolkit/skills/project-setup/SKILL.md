---
name: project-setup
description: 'Sets up, checks, or updates Toolkit V2 so a project has the files, skills, and settings for the owner''s chosen work tracker and memory system. Use for "set up this project", "add the toolkit", "check the setup", "update the toolkit", or changing a setup choice. Also handles the Hindsight dashboard and connection on a new computer. For new commits from Git, use pull-latest.'
---

# Project setup

Set up Toolkit V2 by copying its project files, interviewing the owner, and adding the parts their choices need. The owner is the person you work for, who makes the project's decisions. Follow the steps in order and open the supporting files when a step needs them.

Setup is done when all of these are true:

- the project holds the full layout, which is everything every project gets;
- each answer of the owner has added its part;
- every answer is written in its place;
- the final checks have run, and the owner knows which steps are left for the owner.

There is no setup program. You copy and edit the files yourself. This guide gives the owner's procedure, the questions, and what must be true at the end.

## Where setup finds its files

Paths start from the folder that holds this `SKILL.md`. Both hosts show that path when they load the skill.

- `every-project/` holds the files every project gets, at their project paths.
- Each folder in `choices/` has a setup file for an owner's choice, `reference/` for setup detail, and `files-to-add/` when that choice adds project files.
- `choices/notion-shared/` supplies the shared Notion setup. Local and Hindsight memory also copy `choices/memory/repository-records/`, which holds `DECISIONS.md` and `wiki/product-wiki/`. Copy each chosen part once.
- This skill's `reference/` holds the copy, interview, finishing, update, and diagnostic procedures. Read them at the steps that name them; copy only the project files.

## Rules for every step

- Never answer a question for the owner, even when the owner does not reply.
- Never write a fact that the owner did not confirm.
- Make or change nothing outside the project folder without the owner's yes. Examples are a Notion page, a GitHub repository or label, a Hindsight memory bank, an install on the owner's computer, and a change to a file in the owner's home folder, such as a file under `~/.claude` or `~/.codex`. A yes covers only what it named.
- Never replace or delete a file that the project already has without showing the owner the difference and asking.
- A project may differ from the toolkit. When the owner wants something set up another way in this project, set it up that way.
- The owner dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the owner means, and ask one short question when a message is unclear or could mean two things.

## Step 1: The owner starts setup

The owner said "set up this project" or named this skill.

Put Steps 2 to 6 in your plan, and record each answer the owner gives there as a checked line, for example `- [x] Work items: local`, because a later turn may start without this skill loaded. The files that each answer is written into are the lasting record.

## Step 2: Look at the folder

Before you ask anything, learn what the folder already holds. You need it for two things: to say which situation this is, and to offer what the folder already shows as an answer in Step 4.

Say in one line which of these situations this is.

| What the folder holds | What it is | Where you go next |
| --- | --- | --- |
| Nothing, or only the project's own code and documents. A `.claude/settings.local.json` and a `.claude/worktrees/` folder are Claude Code's own and count as nothing. | A new project | Step 3 |
| Agent files that the toolkit did not put there, such as an `AGENTS.md`, a `CLAUDE.md`, rules, skills, or hooks | An existing project that is adopting the toolkit | "An existing project" below |
| A `PROJECT.md` whose "Toolkit settings" section is filled | A project that already has Toolkit V2 | "A project that already has the toolkit" below |
| A `PROJECT.md` from the full layout whose "Toolkit settings" section is not complete, or another sign in [reference/setup-problems.md](reference/setup-problems.md) that setup stopped part way | A setup that stopped part way | Say so. Read the answers that are already written, and continue at the first question that has no answer. |

"Toolkit settings" is the section of the project's `PROJECT.md` that records the owner's setup choices. A prompt is text in angle brackets that says which fact to write in its place.

These facts about the folder give you answers to offer:

- `git config user.name` prints a name to offer as the owner.
- `git remote -v` shows whether the code is on GitHub.
- `sfdx-project.json` in the folder means that this is a Salesforce project.
- The files in the folder show the language, the framework, and the systems the project touches.

When the project had work before setup, such as code, commits, documents, or earlier agent sessions, ask the owner whether you may read the project's past Claude Code and Codex sessions, and whether there is anywhere else to look. What you find gives you more answers to offer. [reference/context-from-past-work.md](reference/context-from-past-work.md) gives the steps.

Toolkit V2 is set up at the root of a Git repository, in its main checkout. [reference/setup-problems.md](reference/setup-problems.md), "Project folder problems", explains how to handle another folder.

## Step 3: Copy the full layout

Copy `every-project/` into the project, hidden files included. Add each file that the project does not have. For a file that the project already has with different content, show the owner the difference and ask. Records that the project already has stay where they are unless the owner approves a move.

[reference/placing-files.md](reference/placing-files.md) says how to copy without replacing a file, what to do with each kind of file the project already has, and how to make the link `.agents/skills` that lets Codex read the same skills as Claude Code. [reference/skills-hooks-settings.md](reference/skills-hooks-settings.md) lists the skills, hook commands, and settings every project has, and gives the merge rules for a settings file that already exists; open it whenever a settings file changes.

## Step 4: Ask the questions

Ask one question per message, in the order of the table. Give each question a recommendation and the reason for it. When the folder or past work already shows the answers to several questions, show those answers together, and ask the owner to confirm or correct them in one reply. Ask each remaining question by itself.

Write each answer in its place as soon as the owner gives it. During setup, write a record straight into the project folder, in the form that the guide of its folder gives. Make no worktree and no pull request for it, even where a project skill says to save a record that way: nothing is committed yet, and the setup commit saves every record.

| Order | Question | What to offer or recommend | Where the answer goes |
| --- | --- | --- | --- |
| 1 | What is the project called, and who is the owner? | The folder's name, and the name that `git config user.name` prints | The headings of `AGENTS.md`, `README.md`, and `PROJECT.md`, and the owner's row in `PROJECT.md` |
| 2 | What is this project for, in one sentence? | A sentence from what the folder shows, as a suggestion | The outcome line at the top of `AGENTS.md`, the one-sentence line under the title of `README.md`, and "Intended outcome" in `PROJECT.md` |
| 3 | Who else is involved, and who may decide what? | The people the folder names | One row for each person in "People and ownership" in `PROJECT.md` |
| 4 | Which systems does the project touch, and which of them are production? | The systems the folder shows | One row for each system in "Systems and environments" in `PROJECT.md` |
| 5 | Where are work items kept? | The option that fits this project | The "Tracker" line of "Toolkit settings", and Step 5 |
| 6 | Where is memory kept? Then: is Claude Code's own memory on in this project? | The option that fits this project. Claude Code's own memory: off. | The "Memory" line of "Toolkit settings", `autoMemoryEnabled` in `.claude/settings.json`, and Step 5 |
| 7 | Is this a Salesforce project? | Yes when the folder holds `sfdx-project.json`, otherwise no | Step 5 |
| 8 | Which outside tools and services does this project use? | The ones that the folder and the earlier answers show | One line for each under "Resources and project paths" in `PROJECT.md` |
| 9 | How should the agent work with the owner on this project? | Help the owner set up `SOUL.md` in the owner's own words | `SOUL.md` |
| 10 | Is there material to start from? | None. When Step 2 read past work, the facts that no answer has used yet | `sources/`, and each confirmed fact from past work in the place the project's `AGENTS.md` gives for it |
| 11 | Where does the project stand? | None | The roadmap, in the place where work items are kept. With local or Notion memory, also the project's Current State |

The selected memory choice gives the startup records to initialize from question 11.

Read [reference/setup-interview.md](reference/setup-interview.md) before asking the questions. It gives the exact owner row, the work tracker and memory choices, and what to do with each answer.

### Each choice has questions of its own

The answers to questions 5, 6, and 7 pick a choice. The questions after that are about how the owner wants that choice set up in this project.

The questions are steps of the choice's setup file. Open that file as soon as the owner gives the answer. The table in Step 5 names it. For every choice, the steps have you do these things, in the order that the setup file gives:

- Tell the owner, in a few plain lines, how the toolkit sets the choice up when the owner changes nothing. The choice's default reference holds those lines.
- Ask whether the owner wants those defaults or changes for this project.
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

Follow each choice's setup file for the timing of its questions, file copying, settings, external setup, and finishing checks. Write a configured identifier when its verified value is known. Begin any required sign-in during the interview; wait for that access and the owner's required answers and authorization before dependent external steps.

These routes hold for every choice, so the setup files do not repeat them:

- Copy a choice's `files-to-add/` folders as [reference/placing-files.md](reference/placing-files.md) says.
- Run a choice's checks as [reference/finishing.md](reference/finishing.md), "Final checks", says, and fix what a failed check found.
- Tell the owner each step that only the owner does as [reference/finishing.md](reference/finishing.md), "The owner's steps", says, and list what is left in the report that the same file gives.
- In "check the setup", "update the toolkit", and a change of where work items or memory are kept, the choice's "what it adds" reference gives the folders, lines, and settings that the choice adds, and its setup file gives its checks. [reference/update.md](reference/update.md) says how each of those jobs works.

When a sign-in is still not done when setup finishes, the steps that wait for it stay open. Name each one in the report, with the owner's step that it waits for.

Add the files of one work items choice and of one memory choice only. Each of those choices puts a file with the same name inside a skill, so a project with two of them would have the wrong one.

### The lines of "Toolkit settings"

The project's skills read the exact labels in "Toolkit settings".

- The full layout brings two lines, which every project has: Tracker and Memory.
- Each choice adds its own lines. Its setup file gives them, in a step or in the file that a step names. A project has no line for a choice that the owner did not make.
- Keep every label as it is written there. Write each value inside backticks, for example ``- Tracker: `local` ``. The setup file says so when one of its lines has another form.
- Keep the section's fill-in guide comment, because later sessions read it.

## Step 6: Finish

Follow [reference/finishing.md](reference/finishing.md). Setup is finished when every answer is written in the place the table in Step 4 gives, the roadmap is written, the memory choice's startup records are written, the final checks have run, the owner knows the steps that only the owner can do, and the reply ends with the report and the offer to commit the setup files.

## An existing project

An existing project already has agent files of its own. Read what the project holds first. [reference/existing-project.md](reference/existing-project.md) says what to look for, how the branch works with the folders that Git ignores, and which problems are known.

Ask whether the owner wants to adopt the full toolkit structure or choose which parts to adopt.

- **Everything.** Continue at Step 3. Apply the full layout to what is there, and ask about each file of the owner's that the layout would change.
- **Pick and choose.** Work out with the owner which parts of the toolkit this project takes. The toolkit gives no instruction for each possible case. Use your judgment, and ask the owner.

Three rules hold in both cases:

- Never replace or delete a file of the owner's without showing the difference and asking.
- Never delete an old record, such as an old work item or old memory.
- Make the changes on a branch, so that everything can be undone.

## A project that already has the toolkit

What you do depends on what the owner asks for.

- **Update the toolkit.** Scan for differences and updates, show the owner what they would change, and ask what to adopt in this project. Follow [reference/update.md](reference/update.md). An update is also the job when the owner says only "toolkit v2".
- **Check the setup.** Compare the project with the toolkit using [reference/update.md](reference/update.md), "Read the project’s setup" and "Scan for toolkit differences and updates". Then run the checks in [reference/finishing.md](reference/finishing.md), "Final checks". Change nothing, with the two exceptions that section gives, and report each difference and each failed check with the fix that you recommend.
- **Change where work items or memory are kept.** Follow [reference/update.md](reference/update.md), "Changing a setup choice".
- **Hindsight: the dashboard, the bank's settings, or a new computer.** Follow the Hindsight setup file, [choices/memory/hindsight/hindsight-setup.md](choices/memory/hindsight/hindsight-setup.md).

## Known problems

Read [reference/setup-problems.md](reference/setup-problems.md) when the project folder is not the main repository checkout, setup stopped part way, a question tool supplies no answer, or an operation fails. Its "Host permissions" section applies when session permissions block a required command.

## What setup never does

- **It never changes this skill's own folders.** `every-project/` and `choices/` are the source for every project.
- **It writes no code of its own into a project.** The only code that a project gets is what the toolkit ships: the three hook commands and the memory choice's startup module.
- **It never becomes a work item.** No work item is made for setup or for a step of it.
- **It never leaves temporary files.** When you need a temporary folder, remove it once its step is done. Save no path, file list, or diff in a file of the project.

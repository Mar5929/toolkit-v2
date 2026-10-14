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
- the checks of Step 6 have run, and the owner knows which steps are left for the owner.

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

- Put Steps 2 to 6 in the plan tool. In Claude Code the plan tool is the task list, and in Codex it is `update_plan`. When the one you work in has no plan tool, continue without one.
- Record each answer the owner gives as a checked line there, for example `- [x] Work items: local`, because a later turn may start without this skill loaded. The checked lines help a later turn; the files that each answer is written into are the lasting record.

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

Copy `every-project/` into the project, hidden files included. Add each file that the project does not have. In a project that already has records, hold back the folders that moving those records would fill. Agree the move with the owner after question 6, because the memory choice decides where some records belong; [reference/local-wiki-layout.md](reference/local-wiki-layout.md) says how. Copy into those folders only after the move. For a file that the project already has with different content, show the owner the difference and ask.

[reference/placing-files.md](reference/placing-files.md) gives a copy command that never replaces a file, what to do with each kind of file the project already has, and the link `.agents/skills` that lets Codex read the same skills as Claude Code.

## Step 4: Ask the questions

Ask one question per message, in the order of the table. Give each question a recommendation and the reason for it. When the folder or past work already shows the answers to several questions, show those answers together, and ask the owner to confirm or correct them in one reply. Ask each remaining question by itself.

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
| 9 | How should the agent work with the owner on this project? | The `SOUL.md` that the full layout brought | `SOUL.md` |
| 10 | Is there material to start from? | None. When Step 2 read past work, the facts that no answer has used yet | `sources/`, and each confirmed fact from past work in the place the project's `AGENTS.md` gives for it |
| 11 | Where does the project stand? | None | The roadmap, in the place where work items are kept. With local or Notion memory, also the project's Current State |

The project's Current State is the project's one short page of what is true now. A project with local or Notion memory has one. A Hindsight project has none: where the work stands is in the place where work items are kept.

Read [reference/setup-interview.md](reference/setup-interview.md) before asking the questions. It gives the exact owner row, the work tracker and memory choices, and what to do with each answer.

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

Follow each choice's setup file for the timing of its questions, file copying, settings, external setup, and finishing checks. Add its files and lines as it directs, using Step 3's copy procedure. Write a configured identifier when its verified value is known. Begin any required sign-in during the interview; wait for that access and the owner's required answers and authorization before dependent external steps.

When a sign-in is still not done when setup finishes, the steps that wait for it stay open. Name each one in the report, with the owner's step that it waits for.

Add the files of one work items choice and of one memory choice only. Each of those choices puts a file with the same name inside a skill, so a project with two of them would have the wrong one.

### The lines of "Toolkit settings"

"Toolkit settings" is the section of `PROJECT.md` that records the owner's setup choices. The project's skills read its lines.

- The full layout brings two lines, which every project has: Tracker and Memory.
- Each choice adds its own lines. Its setup file gives them, in a step or in the file that a step names. A project has no line for a choice that the owner did not make.
- Keep every label as it is written there. Write each value inside backticks, for example ``- Tracker: `local` ``. The setup file says so when one of its lines has another form.
- Keep the section's fill-in guide comment, because later sessions read it.

## Step 6: Finish

[reference/finishing.md](reference/finishing.md) gives the detail of each part.

1. Check that every answer of the interview is written in its place. The table in Step 4 gives the place for each answer.
2. Write the roadmap from question 11 in the place where work items are kept.
3. With local or Notion memory, write the first lines of the project's Current State. They say where the project stands, from question 11. A Hindsight project has no Current State: where the work stands is in the place where work items are kept.
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

Read [reference/setup-problems.md](reference/setup-problems.md) when the project folder is not the main repository checkout, setup stopped part way, a question tool supplies no answer, or an operation fails. Its "Host permissions" section applies when session permissions block a required command.

## What setup never does

- **It never changes this skill's own folders.** `every-project/` and `choices/` are the source for every project.
- **It never writes a script into a project.** The only code that a project gets from the toolkit is the three hook commands and their choice-owned startup resources.
- **It never becomes a work item.** No work item is made for setup or for a step of it.
- **It never leaves temporary files.** When you need a temporary folder, remove it once its step is done. Save no path, file list, or diff in a file of the project.

## Files

The table lists the files of `reference/`, the setup file of each answer, and the folders that are copied into a project. Each setup file names the files under its own `reference/` folder that hold the detail of its steps, so the table does not list them.

| File | Open it when |
| --- | --- |
| [reference/setup-interview.md](reference/setup-interview.md) | Step 4: you need choice comparisons, the owner row, or the actions for an interview answer. |
| [reference/setup-problems.md](reference/setup-problems.md) | Step 2 or a failed operation: you need folder checks, recovery, or the host permission process. |
| [reference/placing-files.md](reference/placing-files.md) | Steps 3 and 5: you copy `every-project/` or a `files-to-add/` folder into the project, the project already has one of the files, or you make the `.agents/skills` link. |
| [reference/skills-hooks-settings.md](reference/skills-hooks-settings.md) | Whenever a settings file changes: you need the skills and the three hook commands every project has, the settings every project gets, and the rules for a settings file that already exists. |
| [reference/project-store-summary.md](reference/project-store-summary.md) | Setup completion or a verified store migration: write the root guide summary from this project's actual record destinations. |
| [reference/finishing.md](reference/finishing.md) | Step 6: you need the places an answer is written, the form of a line in `owner-preferences.md`, the project's Current State, the final checks, the owner's steps, the report, and the commit offer. |
| [reference/context-from-past-work.md](reference/context-from-past-work.md) | Step 2 and question 10: the project had work before setup, and you read its past sessions or other material to offer answers and fill the project's files. |
| [reference/existing-project.md](reference/existing-project.md) | The folder already has agent files that the toolkit did not put there: you need what to look for, how the branch works with the folders that Git ignores, and the known problems. |
| [reference/local-wiki-layout.md](reference/local-wiki-layout.md) | Before copying or comparing new wiki paths in an existing project: review and verify owner-approved record moves; a setup check reports only. |
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

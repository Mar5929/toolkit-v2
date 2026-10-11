# TKV-64 setup content review

## Scope and reasons

The owner authorized a content review after restructuring. Changes are setup instructions read by both hosts; Hindsight onboarding and production safety were excluded. No commit or external write was made.

- project-setup/SKILL.md keeps the interview sequence, answer destinations, choice routing, constraints, and outcomes. Question-specific details moved intact into reference/setup-interview.md; folder recovery moved into reference/setup-problems.md. Removed folder-authoring prescriptions from runtime guidance; preserved the module shape and copy boundary. Description puts the purpose and primary request triggers first.
- setup-problems.md replaces a universal Codex sandbox assumption with active-session permissions. A refused operation still blocks dependent work; required Codex files are retained. Authorized repair may continue without changing owner decisions or moving setup to another folder.
- reference/update.md combines file-kind rules with their exceptions in the same section. Every old ownership category and command is retained.
- finishing.md gives one check scope with the same generated-index and missing-template restoration exceptions. Setup-copy cleanup now occurs after the last use rather than before update's ignored-folder steps.
- placing-files.md, finishing.md and local choice setup checks use git ls-files to prove local records are untracked; git status could silently pass for clean tracked files.
- settings and Notion-memory diagnostics route to current host permissions.

## Protected outcomes retained

- [x] One question per message, original question sequence and recommendations, all answer destinations.
- [x] Confirm owner facts; external operations and replacement/deletion need scoped approval.
- [x] Main-checkout onboarding, new/existing/partial/completed setup routing, owner records retained.
- [x] One work tracker + one memory module; shared Notion and shared memory copied once.
- [x] Local and Notion Current State; Hindsight no memory folder or Current State.
- [x] Tool sign-in, roadmap, sources, owner preference provenance, SOUL review.
- [x] Owner records and owner-owned rules never compared or replaced during updates.
- [x] Hook handlers replaced rather than duplicated; hooks and command removal together; Codex trust and owner review.
- [x] Worktree updates and ignored-folder changes in main checkout after merge.
- [x] Existing AGENTS owner content preserved with approval; numeric caps retained pending owner answer.
- [x] Store migration keeps old instructions until records move; per-record approvals and source preservation retained.
- [x] All production and named-client-org protections retained; Hindsight module unchanged.

## Deliberate changes to execution guidance

Universal sandbox/escalation assumptions were demonstrably false for this host. Permission handling now follows active session settings. Cleanup ordering and privacy verification now actually achieve their stated outcomes. These are corrections, not deletions of owner protections.

## Unresolved owner questions

Fixed AGENTS caps, per-record migration approval, two-to-four-letter Notion prefix, setup-not-a-work-item rule, and destination-approval granularity remain unchanged.

## Vocabulary and cited headings

No shared vocabulary was renamed. 'The folders of this skill' became 'Where setup finds its files' (no external citations found). The 'Known problems' entry heading remains as routing. Interview Question 9 has a descriptive heading at its new location. Update's old table and 'Special cases for the rows of the table' become combined file-category subsections; the main numbered section headings remain.

## Official evidence

Read live on 2026-10-10: https://code.claude.com/docs/en/skills, https://learn.chatgpt.com/docs/build-skills, https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices, https://learn.chatgpt.com/docs/agent-configuration/agents-md, https://code.claude.com/docs/en/memory. Runtime entry + conditional supporting references are supported.

## Validation

All local Markdown targets in edited files exist. Independent cross-review and whole-repository validation belong to the coordinator.

## Original requirement inventories

For independent review, the following exact original file bodies preserve every rule, limit, number, command, field, heading, and routing pointer. New reference bodies come from sections of the original entry; inspect the diff plus those destinations together.

### plugins/toolkit/skills/project-setup/SKILL.md

```markdown
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
- A part that two answers share is kept once, in a folder of its own, which holds only the parts it needs. `choices/notion-shared/` holds what Notion work items and Notion memory share. `choices/memory/shared-by-local-and-notion/` holds the memory skill that local memory and Notion memory both bring.
- `reference/` holds the detail for the steps that belong to no single answer.

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

The steps of a setup file are done at three moments. Most steps are done right after the answer. A step that waits for a later moment says which one.

1. **Right after the answer, before the next question,** ask the choice's own questions, and add what the setup file says the choice adds to the project:
   - the files. Copy each `files-to-add/` folder that the setup file names into the project, the way Step 3 copies the full layout;
   - the lines that it adds to a file the project already has: the settings files, "Toolkit settings" in `PROJECT.md`, `AGENTS.md`, and `.gitignore`. A line whose value is not known yet, such as the id of a Notion page, is added when the value is known.

   When a choice needs a sign-in, ask for it at this moment too, so that the owner can sign in while the interview goes on. The step for the sign-in says how to check it.
2. **When the choice's sign-in is done and the owner has given the answers that the setup file needs,** set up what the choice needs outside the project folder, after the owner's yes. The Notion steps, for example, need the answers to questions 5, 6, and 7.
3. **When setup finishes, in Step 6,** do what the choice needs at the finish, such as its part of the roadmap, of the project's Current State, of the final checks, and of the owner's steps.

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
```

### plugins/toolkit/skills/project-setup/reference/update.md

```markdown
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
  - Checking the setup changes nothing and needs no worktree.
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

For each file that differs, and each file the project lacks, find its kind in the table below and do what the row says.

Show the owner every file that needs the owner's answer in one numbered table, with one line per file and the reason on that line, and ask once. Carry out what the owner says yes to. The rest of this file calls that table "the numbered table".

Most rows have special cases. They are listed under the table, in "Special cases for the rows of the table", by the name of the row. Read the special cases of a row before you act on that row.

| Kind | Files | What to do |
| --- | --- | --- |
| Toolkit skills | each folder in `<copy>/.claude/skills/` | Replace the project's folder with the new folder, one skill at a time: `rsync -a --delete <copy>/.claude/skills/<name>/ .claude/skills/<name>/` |
| Hook commands | `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs` | Replace each file after the owner's yes: `cp <copy>/.claude/hooks/<file> .claude/hooks/<file>` |
| Settings | `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge each file with the rules in [reference/skills-hooks-settings.md](skills-hooks-settings.md), "Merge rules". |
| Missing files | every `>f+++++++` line | List the missing files, then copy them into the project. |
| Ignore files | `.gitignore`, `.ignore` | Add each line of the setup copy's file that the project's file lacks, at the end after one blank line. Ask no question. The change only adds lines, and the owner's request to update the toolkit is the owner's yes to it. |
| `AGENTS.md` | the root file | Follow "Updating AGENTS.md" below. |
| `PROJECT.md`, "Toolkit settings" | | Make the section hold the lines of the setup copy's section, with the same labels. |
| Files that hold the owner's facts | the rest of `PROJECT.md`; `README.md`, `SOUL.md`, `PROJECT-ROADMAP.md`, `DECISIONS.md`, each document in `system/`, `sources/INDEX.md`, `reference/outside-docs/INDEX.md` | Never overwrite one of these files. Name only the toolkit's changes (a new section, a changed heading, a changed guide comment), and make them after the owner's yes. |
| Rules in `.claude/rules/` | | Show the owner what differs. |
| Other toolkit files | the `AGENTS.md` of each folder (`system/AGENTS.md`, `sources/AGENTS.md`, `delivery/AGENTS.md`, `reference/AGENTS.md`, `work-items/AGENTS.md`, `memory/AGENTS.md`), the templates, and the output style | Say in one line what changed, and whether the file holds an edit of the owner's. Take the toolkit's version after the owner's yes. |
| The owner's own records | work items and `work-items/PROJECT-TASKS.md`; the entries of `DECISIONS.md`; the rules and terms in `system/`; the sources in `sources/`; the records in `delivery/` and `reference/`; `memory/CURRENT_STATE.md` and every memory record in `memory/`; `.claude/rules/owner-preferences.md`; `.claude/rules/salesforce-agent-permissions.md`; the owner's own skills and rules | Never compare or change one of these. |

### Special cases for the rows of the table

- **Toolkit skills.** The command deletes every file in the project's folder that the new folder lacks. So before you run the command for a skill, list each file inside the project's folder that the new folder lacks, and ask the owner about those files.
- **Hook commands.**
  - Codex trusts the hook entry in `.codex/hooks.json`, not the file that the entry runs, so a replaced command file is not reviewed again. For that reason, put each replaced `.mjs` file in the numbered table, with one plain line that says what its diff changes, and copy the file only after the owner's yes.
- **Settings.** [reference/skills-hooks-settings.md](skills-hooks-settings.md), "Merge rules", gives the merge rules in full. All of the following apply:
  - Add what is missing.
  - Ask before you change a value.
  - Replace the toolkit's own hook handlers. Do not add a second copy of one.
  - Delete no other entry.
  - A changed Codex hook must be trusted again in `/hooks`. Tell the owner.
- **Missing files.** Copy the missing files in two parts.
  - Copy into the worktree with `rsync -rlt --ignore-existing --exclude /memory/ --exclude /work-items/ <copy>/ <worktree>/`. Do not use `-a`, because `-a` would give the project folder the temporary folder's private permissions.
  - Copy into the main checkout after the branch was merged (section 6, step 4), and only when the setup copy has the folder. The commands are `rsync -rlt --ignore-existing <copy>/memory/ <main checkout>/memory/` and `rsync -rlt --ignore-existing <copy>/work-items/ <main checkout>/work-items/`.
- **`PROJECT.md`, "Toolkit settings".**
  - Add each line of the setup copy's section that the project's section lacks.
  - Keep the value of every line that stays. A line that the setup copy's section no longer has is handled as section 4 says.
  - Show the owner the section before and after.
- **Rules in `.claude/rules/`.** "Whether a difference is the owner's edit" below says whether a rule holds an edit of the owner's.
  - When a rule holds no edit of the owner's, recommend the toolkit's version.
  - When a rule holds an edit of the owner's, the edit stays unless the owner says to take the toolkit's version.
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
  4. Run `wc -lc <copy>/AGENTS.md`. The limits are at most 200 lines and at most 24,576 bytes. When the owner's added lines put the file over either limit, say so in the list in step 5, and recommend which of those lines to move, and where. Cut no line of the owner's without the owner's yes.
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

- For a Notion project, follow what the shared Notion setup file, [choices/notion-shared/notion-setup.md](../choices/notion-shared/notion-setup.md), says for "update the toolkit". An update changes nothing in Notion.
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
2. Make your own worktree and branch, as "Before you start" says. In the worktree, change `PROJECT.md`, "Toolkit settings":
   - Change the Tracker or Memory line.
   - Remove each line that only the old choice used.
   - Write the new choice's lines as the setup file of the new choice says, and as [SKILL.md](../SKILL.md), "The lines of "Toolkit settings"", says for every line.
   - Take out the lines that the old choice's setup file adds to a file the project already has, such as rows in `AGENTS.md`, entries in the settings files, and lines in `.gitignore`. Put in the lines that the new choice's setup file adds.
3. Build a new setup copy for the new choices and compare, as sections 1 and 2 say.
   - Add each file the project lacks, as the "Missing files" row says, except the affected merged skill folder. Keep that skill and its selected store reference as the old choice has them until the records have moved in step 5. Install the affected skill folder from the setup copy in step 6.
   - Keep the old choice's installed instructions until the records move in step 5. Read the old `references/work-tracker.md` or `references/memory-store.md` before the change. Read the new choice's selected reference in the setup copy to learn how to create and read back its records. Do not install the new choice's reference over the old one yet.
   - A new memory choice also replaces the toolkit's hook handlers in `.claude/settings.json` and `.codex/hooks.json` with the handlers of the new choice ([reference/skills-hooks-settings.md](skills-hooks-settings.md), "What a choice changes in the settings" and "Merge rules"). The owner trusts the changed Codex hooks again in `/hooks`.
4. Do what the setup file of the new choice gives for outside the project folder. [SKILL.md](../SKILL.md), Step 5, names the setup file of each choice.
   - When the project already has work items or memory in Notion and adds the other one, make no second project page. The shared Notion setup file, [choices/notion-shared/notion-setup.md](../choices/notion-shared/notion-setup.md), says, in a step or in the file that a step names, how a Notion project adds work items or memory later.
   - When memory moved out of Hindsight, after the owner's yes also remove the project's folder from the settings of Hindsight's coding-agent add-on, so that the add-on is switched off there.
5. Move the records one at a time, with a preview of each record and the owner's yes, and read each record back in its new place. Delete nothing from the place where the work items were kept before, or from the old memory system.
   - When the records go into Hindsight, the add-on's tools load only in the next session. So save each record through the server's API, with the record's ID as the ID of the saved document, and read the record back with a search after the save has finished.
6. After the records are moved and the owner says yes to the list, install the new choice's merged skill folder from the setup copy and remove the old choice's files. Check for owner edits before replacing or removing a skill file. The selected `references/work-tracker.md` or `references/memory-store.md` then contains the new choice's instructions.
   - The list is every file of the old choice's setup folders that no setup folder of the new choices holds. `(cd <skill folder>/<folder> && find . -type f)` prints a folder's files, and the setup file of each choice names its folders. [SKILL.md](../SKILL.md), Step 5, names the setup file of each choice. `<skill folder>` is the folder that holds this skill's `SKILL.md`.
   - A Hindsight project has no Current State. When memory moved to Hindsight, `memory/CURRENT_STATE.md` is on the list. Its lines are the owner's record, so show them to the owner, and ask where each line that is still true goes, before the file is removed. Where the work stands is kept in the place where work items are kept.
   - A file in `work-items/` or `memory/` that is not in a setup folder is the owner's record. It stays until the owner says what to do with it.
```

### plugins/toolkit/skills/project-setup/reference/finishing.md

```markdown
# Finishing setup

This file is the last step of a setup: Step 6 in [SKILL.md](../SKILL.md). Open it when the owner has answered the questions and each answer has added its part. Its job is done when all of these are true:

- every answer of the interview is written in its place, and the prompts in the project's files hold facts that the owner confirmed;
- the roadmap is written, and with local or Notion memory the first lines of the project's Current State are written too;
- the final checks have run;
- the owner has been told the steps that only the owner does;
- the reply ends with the report and the commit offer.

Other jobs of this skill use single sections of this file. For example, "check the setup" runs "Final checks" without fixing anything.

## Contents

- Fill the prompts
- Instructions the owner gives during setup
- SOUL.md
- The roadmap
- The project's Current State
- Final checks
  - The checks
  - After the checks
  - The final checks in "check the setup"
- The owner's steps
- The report
- The commit offer
  - After the owner's yes
  - After the commit

## Fill the prompts

The files that setup copied into the project hold prompts. A prompt is text in angle brackets (`<angle bracket>`) that says which fact to write in its place. Each of those files starts with a fill-in guide comment, which says how to fill the file.

Fill a prompt only with a fact that the owner confirmed. Three rules apply to every part below:

- Never invent a fact to fill a prompt.
- Setup is never a work item. Never create a work item for a setup step.
- Never add a made-up question to finish setup.

Go through these parts:

1. **The project's outcome**, from question 2. The sentence is the owner's answer. It is never a sentence worked out from the code, the tests, or the README. It goes in every one of these places:
   - the outcome line of `AGENTS.md`, which is the line under the title that starts with the prompt `<One sentence describing this project and its outcome.>`;
   - the one-sentence line under the title of `README.md`;
   - "Intended outcome" in `PROJECT.md`;
   - each further place that a step of a choice's setup file names for the finish of setup.

   When the owner gave no sentence, leave the outcome prompts, and list them in the report.
2. **The other answers.** Check each answer against the table in [SKILL.md](../SKILL.md), Step 4, which gives the place for each one.
3. **The "Build, test, or deploy" row** under "Commands" in `AGENTS.md`. Fill it when the owner gave the commands during the interview. Otherwise leave the prompt, and list it in the report with what the repository shows as a suggestion, for example `npm test`.
4. **The other prompts of `PROJECT.md` and `README.md`.** Follow the fill-in guide of each file.
   - Fill a prompt only with a fact that the owner gave or confirmed in this session. A fact that a file in the repository shows is a suggestion: offer it to the owner, and write it after the owner's yes.
   - The "In scope" and "Outside scope" lines in `PROJECT.md` describe the product. They never describe setup choices or toolkit files.
   - A file keeps its fill-in guide comment for as long as the file holds a prompt. Delete the guide when the last prompt is filled.
5. **`DECISIONS.md` and the documents in `system/`** hold no prompt. Write into them only a decision or a rule that the owner confirmed, in the form that the guide of each gives.
6. **The fill-in guide comments.** Delete each fill-in guide comment when its own text says to delete it. Keep the guide comment inside "Toolkit settings", because later sessions read it.

## Instructions the owner gives during setup

When the owner gives an instruction for how the agent works, add the instruction to `.claude/rules/owner-preferences.md`. The owner's answers to question 9 are such instructions. Two more examples are "don't touch my real Notion pages" and "ask me before you push". In a Salesforce project, an instruction about what an agent may do in an org goes in `.claude/rules/salesforce-agent-permissions.md`, as the step on the org aliases in the Salesforce setup file, [choices/salesforce/salesforce-setup.md](../choices/salesforce/salesforce-setup.md), says.

- Write the instruction as one list line in the owner's words.
- Put the line under an area that the file's layout comment names. Use General when no area fits.
- End the line with `(<YYYY-MM-DD>, <owner name>, in chat)`.
- Say in the report that the instruction was saved.
- Write nothing else in `owner-preferences.md` during setup.

A setup answer is not an instruction. These answers never go in `owner-preferences.md`: whether the owner uses Claude Code, Codex, or both; where work items and memory are kept; the project name; and the outcome.

`owner-preferences.md` is the owner's own file from the first instruction on. In a Salesforce project, `salesforce-agent-permissions.md` is too.

## SOUL.md

`SOUL.md` is the owner's own description of how the agent should work with the owner and the project team. Every project gets the file.

- Fill each prompt with the owner's own words, from question 10, and show the owner the text.
- Delete the file's fill-in guide after the owner's yes to the text.
- When the owner wants no `SOUL.md` in this project, delete the file.

## The roadmap

The roadmap is the project's phases: what each phase is for, which phases are done, which phase the project is in now, and what comes next. Write it from the owner's answers to question 12, in the place where the project keeps its work items.

The setup file of the work items choice says where the roadmap is kept, in its step for the finish of setup. Write it straight into that place, as [SKILL.md](../SKILL.md), Step 4, says for every record of a setup.

Write only what the owner confirmed. Show the owner the roadmap after you wrote it.

## The project's Current State

The project's Current State is the project's one short page of what is true now. A project with local or Notion memory has one, and setup writes its first lines. The setup file of the memory choice says where it is kept.

A Hindsight project has no Current State and no `memory/` folder. Where the work stands is in the place where work items are kept, so the rest of this section does not apply to a Hindsight project. For a Hindsight project, write each of the owner's steps that is still open as a project task, with the project's `managing-work-items` skill, so that a later session finds it. Use the words that the "Waiting on" line below gives, and name each step in the report too.

Keep the five headings and their line limits. The list below says what to write on the "Last updated" line and under each of the five headings:

- Last updated: the date, "setup", and "agent".
- Now: the work that is going on now, from question 12, or "None."
- Coming up: each dated event or deadline that the owner named, or "None."
- Waiting on: one line for each of the owner's steps that is still open. "The owner's steps" below lists the steps. Each line starts with "Owner:" and ends with "Setup step; remove this line when it is done."
- Standing jobs and shared files: "None."
- Next session starts with: the next step on the roadmap, from question 12.

Then delete the file's fill-in guide comment, as the comment says.

## Final checks

Run each check alone, from the project folder. Each check only reads. The checks show that setup worked. They do not test whether the project matches the toolkit: a project that holds more than setup gave it, such as a skill or a rule of its own, is as it should be.

### The checks

1. **The settings files are valid.** Run `jq empty .claude/settings.json`, and the same command for `.codex/hooks.json`, and for `.mcp.json` when present. The command prints nothing when a file is valid JSON.
2. **The session-start command runs.** With local or Notion memory, `node .claude/hooks/session-start.mjs --memory <memory> </dev/null` must print the project's Current State. `<memory>` is the value of the Memory line in "Toolkit settings": `local` or `notion`. The setup file of the memory choice gives the full command when the choice adds to it. A Hindsight project has no Current State, so this check does not apply to it. The Hindsight setup file, [choices/memory/hindsight/hindsight-setup.md](../choices/memory/hindsight/hindsight-setup.md), gives the checks of that choice.
3. **Codex reads the same skills as Claude Code.** `ls -la .agents` must show `skills -> ../.claude/skills`.
4. **"Toolkit settings" is complete.** The Tracker and the Memory line of `PROJECT.md`, "Toolkit settings", each name a choice, and the section holds the lines that the setup file of each of the owner's choices adds. A line may still lack its value only when the value waits on the owner. "People and ownership" in `PROJECT.md` must name the owner.
5. **Git does not track `work-items/` or `memory/`.** `git status --short` must list nothing under `work-items/` or `memory/`.
6. **Each choice.** For each choice of the owner, do the checks that its setup file gives.

### After the checks

- When a check fails, fix what the check found, then run the check again.
- Report each check that you cannot make pass, with what it printed.
- In an update or a check, remove the temporary folder that holds the setup copy after the checks: `rm -rf <copy>`. The setup copy is the files the project would get today, built in a temporary folder, as [reference/setup-copy.md](setup-copy.md) says.

### The final checks in "check the setup"

"Check the setup" is one of the jobs in [SKILL.md](../SKILL.md), "A project that already has the toolkit". In that job, fix nothing. Report each failed check with the fix that you recommend.

With local memory, the session-start hook command may rebuild the generated index `memory/MEMORY.md`. That index is the one file a check may change.

"Check the setup" puts one kind of file back: a toolkit file that is missing from `work-items/` or `memory/`. Git does not track `work-items/` and `memory/`, so a toolkit file that was deleted there cannot be brought back from Git.

When one of the files listed below is missing in the main checkout, copy it from the setup copy with `cp -n <copy>/<file> <main checkout>/<file>`, and name the file in the report. The `-n` option never replaces a file. The main checkout is the project's main folder, the first path that `git worktree list` prints.

- With local work items, the files are `work-items/AGENTS.md`, `work-items/CLAUDE.md`, `work-items/work-item-template/WORK-ITEM.md`, and `work-items/work-item-template/DESIGN.md`.
- With local memory, the files are `memory/AGENTS.md`, `memory/CLAUDE.md`, and `memory/project_topic_template.md`.

## The owner's steps

The table lists the steps that the owner does in every project. The setup file of each choice names the steps that its choice adds, such as a sign-in. Say each step plainly, with the reason for it, and wait where a later step needs it. Never do one of these steps for the owner.

| Step | Why | Needed when |
| --- | --- | --- |
| Trust the project folder in Codex. | Until the folder is trusted, Codex ignores the project's `.codex/config.toml` and `.codex/hooks.json`. Trust is tied to the folder path, so it is needed again after a move. | Always, the first time the owner opens the project in Codex |
| Trust the hooks in Codex: type `/hooks` and trust them. | Codex skips a hook until it is trusted, and again after any change to its entry in `.codex/hooks.json`. A change to a `.mjs` file that the hook runs is not reviewed again. | Always. Again after "update the toolkit" changes an entry in `.codex/hooks.json`. |
| Open the project folder as an Obsidian vault. | The owner can then browse the project's records, and local work items and memory, with their links. The project's `README.md` says how. | Optional |
| Start a new session in each of Claude Code and Codex. | The skills, hooks, and settings load at session start. | Always |
| Say yes to committing the setup files. | New worktree sessions (the Claude desktop app, the Codex app) see only committed files. A worktree is a separate folder with its own branch. | Always |

## The report

Give the owner a short, plain report. It has these parts, in this order:

1. **What was set up.** Say where work items and memory are kept, whether the project is a Salesforce project, how many skills it has, the three hook commands, where the roadmap is, and each line that was added to `owner-preferences.md`, in the owner's words.
2. **What was made outside the project folder.** Name the Notion pages, the GitHub repository and labels, the Hindsight bank, and the add-on's changes in `~/.claude`, `~/.codex`, and `~/.hindsight`.
3. **What was skipped**, and why.
4. **What the owner must do**, each step with the reason for it.
5. **The final checks.** Say that all passed, or name each check that did not pass, with its fix.
6. **The prompts that are left**, grouped by file, each with the fact it needs in a few words.
   - Find them with `grep -n '<[A-Za-z][^>]*>' AGENTS.md README.md PROJECT.md | grep -v '<!--'`. Run the same `grep` on each further file that the setup file of a choice names.
   - Then skip the lines where the angle brackets are part of a file name or a path pattern, and not a prompt: `<ID>.md`, `<ID>-<short-slug>/`, `<ID>-test-plan.md`, and `<release>-test-plan.md`.
7. **The last line** is the commit offer, which the next section gives.

## The commit offer

The setup files are not committed yet, and the first merge of a work item needs them committed. So the reply ends with an offer to commit them.

Say in one line why the commit matters now. The reason is this: sessions that start in their own worktree (the Claude desktop app, the Codex app) see only committed files. Until this commit, those sessions get no `AGENTS.md`, skills, or hooks. When the app starts worktrees from the remote, they get none until this commit is also pushed.

The reply's last line is:

> Setup files are not committed. Commit them now?

### After the owner's yes

In a new project, the setup commit is made on the default branch, with no worktree and no pull request. In an existing project, it is made on the branch that holds the changes, and that branch is merged only after the owner's yes. Do these steps in order:

1. Stage each file that setup wrote or changed, by name, and the `.agents/skills` link.
   - List the candidates with `git status --short --untracked-files=all`. Plain `git status --short` shows a new folder, and not the files in it.
   - A file that the owner already had, and that setup did not write or change, stays unstaged. An example is the owner's own code that Git does not track yet.
2. Read what is staged.
   - Read `git diff --cached --name-status`. It must list no file under `work-items/` or `memory/`.
   - Read `git diff --cached --stat` for the files that setup copied in.
   - Read `git diff --cached -- <file>` for each file that the project had before setup and that setup merged or changed (`.gitignore`, settings files).
   - `git diff --cached --check` may list template lines that end with two spaces. Those lines are Markdown line breaks, so leave them.
3. Commit with a plain message and no AI credit, for example `git commit -m 'Set up Toolkit V2'`.
4. Push only after the owner's yes.

### After the commit

In a new project, ask about a push next, as its own question, when both of these are true: the project has the remote `origin`, and `git ls-remote --heads origin <default>` prints nothing. An example is a repository that setup just created. `<default>` is the default branch, usually `main`. The question is:

> Push <default> to <owner>/<repo>? The first pull request needs <default> on GitHub.

After the owner's yes, run `git push -u origin <default>`.

After the commit, and the push when it was asked, end the reply with the next step on the roadmap, and ask the owner whether to start it.
```

### plugins/toolkit/skills/project-setup/reference/placing-files.md

```markdown
# Putting the toolkit's files into the project

Use this file to copy a folder of this skill into the project. Open it at Step 3 of [SKILL.md](../SKILL.md) for the full layout, `every-project/`, and at Step 5 for each `files-to-add/` folder of a choice.

The job is done when three things are true: the project has every file of the folder, except a file that the owner chose to keep as it was; no file that the project already had was replaced without the owner's answer; and `.agents/skills` is a link to `.claude/skills`.

`<source>` stands for the folder you copy, with the path of this skill's folder in front of it. Run every command from the project folder.

## See what would change

This command writes nothing.

```text
rsync -rcni --exclude .DS_Store --exclude '*.log' <source>/ ./
```

- A line that starts with `>f+++++++` names a file that the project does not have yet.
- Any other line that starts with `>f` names a file that the project has, with different content.

## Copy the files the project does not have

```text
rsync -rlt --ignore-existing --exclude .DS_Store --exclude '*.log' <source>/ ./
```

This command writes only missing files and never replaces a file that the project has. In a new, empty folder it is the whole copy. It uses `-rlt` because `-a` would also give the project's files the permissions of this skill's folder.

## Files the project already has

For each file that differs, read the difference:

```text
diff -u <file> <source>/<file>
```

| File | What to do |
| --- | --- |
| `.gitignore`, `.ignore` | Add each line of the toolkit's file that the project's file lacks, at the end after one blank line. This change only adds lines, so no question is needed. |
| `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge the toolkit's entries into the project's file. [reference/skills-hooks-settings.md](skills-hooks-settings.md), "Merge rules", gives the rules for the merge. Ask the owner before you change any value that the project already has. |
| `CLAUDE.md` with more than the line `@AGENTS.md` | Keep the project's file. Ask the owner whether to add the line `@AGENTS.md` at its top, because while a `CLAUDE.md` exists, Claude Code reads `AGENTS.md` only through that line. |
| `AGENTS.md` (a project that had its own) | Keep the project's file. Show the owner what the toolkit's version adds. After the owner's yes, add the sections of the toolkit's version, and keep the owner's text. |
| Every other file, such as `README.md`, a rule, or a template | Say in one line what differs, and recommend one of three choices: keep the owner's file, take the toolkit's file, or merge the two. The owner's file stays until the owner chooses. |

The file `.ignore`, in the first row, makes the search tools that skip what `.gitignore` names read `work-items/` and `memory/`. Those tools are ripgrep and the search tools of Claude Code.

Show every file that needs the owner's answer in one numbered table, with one row per file, and ask once. Carry out each row as the owner answers it.

## The .agents/skills link

Codex reads a project's skills from `.agents/skills`, and Claude Code reads them from `.claude/skills`. The project keeps one copy of the skills, so `.agents/skills` is a link to `.claude/skills`. The full layout holds that link, and the copy command above brings it. When the project has no link after the copy, make it:

```text
mkdir -p .agents
ln -s ../.claude/skills .agents/skills
```

When `.agents/skills` is already a real folder, compare the two folders first:

```text
diff -r .agents/skills .claude/skills
```

- When the command prints no difference, or only lines that start with "Only in .claude/skills", every file in `.agents/skills` is also in `.claude/skills`. Tell the owner, and after the owner's yes remove the folder and make the link.
- When the command prints anything else, ask the owner. The folder may hold the owner's own Codex skills. After the owner's yes, move each of those skills into `.claude/skills/` first.

Git stores the link as a link. When the link cannot be made, tell the owner. Never put copied folders in its place.

## Checks after the copy

- `ls -la .agents` shows `skills -> ../.claude/skills`, and `ls .agents/skills` shows the skills.
- `git status --short` lists the new files, and nothing under `work-items/` or `memory/`, because Git ignores both.
```

### plugins/toolkit/skills/project-setup/reference/skills-hooks-settings.md

```markdown
# Skills, hook commands, and settings

This file says which skills, hook commands, and settings every project has, and how a settings file that already exists is merged. Open it whenever a settings file changes, and whenever another file sends you to "Merge rules". The setup file of a choice gives, in a step or in the file that a step names, the lines that the choice changes in the settings.

The job is done when the settings files hold what the owner's choices need, every entry that the owner had is still there, and everything under "What must be true when the settings are done" holds.

In a setup, change the project's own settings files. In an update or a check of the setup, the files are built in a temporary folder first, and [reference/setup-copy.md](setup-copy.md) says how that folder is made.

## Contents

- Skills
- Hook commands
- The settings every project gets
- What a choice changes in the settings
- Merge rules
- What must be true when the settings are done
- Known problems

## Skills

Every skill is in `.claude/skills/`, one folder per skill. Claude Code reads that folder. Codex reads `.agents/skills`, which is a link to that folder.

The shared skills are the same in every project: `managing-work-items`, `filing-project-records`, `handoff`, `braindump`, `shaping-a-prompt`, `session-summary`, `filechanges`, `pull-latest`, `reset-to-remote`, `merge-and-clean-up`, `publish-docs`. `every-project/` holds them.

A choice may add a skill, or files inside a skill that the project already has. The setup file of each choice says what it adds.

## Hook commands

A hook command is a command that Claude Code or Codex runs by itself at a fixed moment, for example at session start. Every project has three, in `.claude/hooks/`: `session-start.mjs`, `prompt-reminder.mjs`, and `codex-after-commit.mjs`. `every-project/` holds them. Both Claude Code and Codex run the three commands from `.claude/hooks/`.

`prompt-reminder.mjs` runs on every message. It prints one line that tells the agent to check the project's skills, then a memory reminder when the message has a phrase such as "remember this", and then the whole text of the rule `.claude/rules/evaluate-the-owners-request.md`. It reads that rule file each time it runs, so the project's rule file is the only place where the rule's text is kept.

## The settings every project gets

`every-project/` holds three complete settings files. A project gets all three, whether or not the owner uses Codex today.

| File | Who reads it | What it holds |
| --- | --- | --- |
| `.claude/settings.json` | Claude Code | No AI credit on a commit or a pull request. Claude Code's own memory off. The Plain English output style. The Git commands that are refused or asked about. The hooks: session start, every message, after a commit, and after a helper agent returned. More room for the list of skills. |
| `.codex/hooks.json` | Codex | The same hooks, written the way Codex reads them: session start, every message, after a commit, and when a helper agent started or returned. |
| `.codex/config.toml` | Codex | `max_context_tokens = 10000` under `[skills]`. |

A helper agent is a separate agent that a session starts for one job.

As the files are copied, memory is set to local: the session-start line ends with the word `local`. The next section says what another choice changes.

Never change the command or the text of one of the toolkit's hooks, because they are written to match the three hook commands.

## What a choice changes in the settings

The setup file of each choice gives, in a step or in the file that a step names, the lines that the choice changes in `.claude/settings.json` and `.codex/hooks.json`. Work items in local files, Notion, or GitHub Issues, and memory in local files, change nothing.

The owner's answer about Claude Code's own memory is one line in `.claude/settings.json`: `"autoMemoryEnabled"` is `false` when the owner wants it off, which is the default, and `true` when the owner wants it on.

## Merge rules

These rules apply every time the toolkit's settings meet a settings file that already exists: in a project that had its own settings file before setup, in an update, and when the memory choice changes.

- **Add what is missing.** Add each entry and each plain value (text, a number, true or false) that the file does not have.
- **Never delete any other entry.** Apart from the toolkit's own hook handlers, which the rule on replacing them lists below, every entry stays: the permission rules, the Git deny and ask rules, the entries of `permissions.deny` for a production Salesforce org, and the hooks that the owner added.
- **Ask before you change a value.** When a file that the project already had holds a plain value that differs from the toolkit's value, ask the owner. In a file that the copy just brought, take the toolkit's value.
- **Replace the toolkit's own hook handlers. Never keep an old one beside a new one.** A hook handler is one entry in a settings file that says what a hook runs. The toolkit's own hook handlers are:
  - a handler whose `args` or `command` names `session-start.mjs`, `prompt-reminder.mjs`, or `codex-after-commit.mjs`;
  - the `echo` handler in the `PostToolUse` group whose matcher is `Agent`;
  - the `echo` handler in the `.codex/hooks.json` `PostToolUse` group whose matcher is `^(collaboration)?(spawn_agent|wait_agent)$`.
- **Show the owner a handler before you replace it.** When the file already has the toolkit's own hook handlers, as in an update or after a changed memory choice, show the owner the old and the new handlers. Then remove the old ones, and any group or event they leave empty, and put in the new ones.
- **Leave a handler that is already right.** When the file's handler and the toolkit's handler are the same, apart from a page id that was written in place of `{{CURRENT_STATE_PAGE_ID}}`, change nothing and ask nothing. The handler keeps its page id.
- **When you cannot tell whether an entry is the toolkit's, ask the owner.**

## What must be true when the settings are done

- `.claude/skills` holds the shared skills listed above and the skills that the setup files of the owner's choices name, each with a `SKILL.md`. It holds no skill of a choice the owner did not make. A skill of the owner's own may be there too.
- `.claude/settings.json` and `.codex/hooks.json` are valid JSON.
- Every hook command that the settings name is in `.claude/hooks/`.
- Each of the toolkit's own hook handlers is in each settings file once, apart from a handler that the setup file of one of the owner's choices takes out.
- The session-start line, where the project has one, names the owner's memory choice in both files.
- `.claude/settings.json` has no `Stop` hook of type `prompt`, and the Codex helper reminder has only the matcher `^(collaboration)?(spawn_agent|wait_agent)$`.
- `.codex/config.toml` has each table once, and `[skills]` holds `max_context_tokens = 10000`.
- The `description` in `.codex/hooks.json` contains the description text of the toolkit's file.

## Known problems

- **`.codex/hooks.json` accepts only `description` and `hooks` at the top level.** Put nothing else there.
  - In a file that the project already had, a `description` that does not contain the toolkit's text keeps the text it has. Add the toolkit's text after it, with one space between them.
  - One sentence is the exception. A sentence that starts "Toolkit V2 hooks for this project in Codex:" is the toolkit's own earlier text, so replace that sentence with the toolkit's text. Put that change in the numbered table that the owner sees. [reference/placing-files.md](placing-files.md), "Files the project already has", and [reference/update.md](update.md), "3. What to do with each kind of file", say how to show that table.
- **A settings file writes a key another way than the toolkit does.** Another way is a dotted key such as `plugins."x@y".enabled = false`, or an inline table. Leave the file as it is and ask the owner.
- **A settings file holds an entry of the toolkit's that the toolkit no longer ships.** [reference/update.md](update.md), "4. What the toolkit no longer ships", says what to do with it.
- **Codex cuts every skill description short.** Codex does this when the list of skills passes its limit, which is 2% of the model's context window by default. The Toolkit skills then lose their "Use when" and "Not for" parts. `max_context_tokens = 10000` under `[skills]` prevents this. That value is the largest that Codex accepts there, and it is more than the 2% default for a model with a context window under 500,000 tokens.
- **A changed Codex hook entry does not run.** Codex skips a hook until the owner trusts it in `/hooks`, and again after any change to its entry in `.codex/hooks.json`. Tell the owner.
- **Codex refuses to create `.codex/`.** [SKILL.md](../SKILL.md), "Known problems", says under "In Codex" how to run such a command.
```

### plugins/toolkit/skills/project-setup/choices/work-items/local/local-work-items-setup.md

```markdown
# Work items in local files

Follow these steps when the owner answers "local files" to question 5 of the guide, [SKILL.md](../../../SKILL.md). The job is done when `work-items/` and `PROJECT-ROADMAP.md` are in the project, `PROJECT.md` records the choice and the ID prefix, and the roadmap holds the project's phases.

## Steps

Do steps 1 to 4 right after the answer, before the next question of the guide. Do steps 5 to 7 when setup finishes, in Step 6 of the guide. This choice needs no sign-in and makes nothing outside the project folder.

1. **Tell the owner how the toolkit sets up work items in local files by default, and ask whether that is what the owner wants.** [reference/local-work-items-default.md](reference/local-work-items-default.md) holds the default. [SKILL.md](../../../SKILL.md), "Each choice has questions of its own", gives the words of the question and what to ask after a no.
2. **Ask the owner about the ID prefix.** Say that IDs look like `WI-001`, and ask whether to keep the prefix `WI`.
3. **Copy the choice's files into the project.** The folder `choices/work-items/local/files-to-add/` holds them at the paths a project has them. [reference/what-local-work-items-add-to-a-project.md](reference/what-local-work-items-add-to-a-project.md) lists them, and [reference/placing-files.md](../../../reference/placing-files.md) gives the copy command and what to do with a file that the project already has.
4. **Write the choice's lines in `PROJECT.md` and `AGENTS.md`.** [reference/what-local-work-items-add-to-a-project.md](reference/what-local-work-items-add-to-a-project.md) gives each line and the place where it goes.
5. **Write the project's outcome and the roadmap in `PROJECT-ROADMAP.md`.** Write the owner's sentence from question 2 under "Project outcome", and write the project's phases from question 12 as the file's fill-in guide says. [reference/finishing.md](../../../reference/finishing.md), "Fill the prompts" and "The roadmap", give the rules for both.
6. **Check that Git does not track the work items.** `git status --short` lists nothing under `work-items/`. [reference/finishing.md](../../../reference/finishing.md), "Final checks", says how to run a check and what to do when one fails.
7. **Search `PROJECT-ROADMAP.md` for the prompts that are left.** It is one of the files to search for the report. [reference/finishing.md](../../../reference/finishing.md), "The report", gives the search command.

When a step does not work as expected, open [reference/local-work-items-known-problems.md](reference/local-work-items-known-problems.md).

"Check the setup", "update the toolkit", and a change of where work items are kept use the same steps: steps 3 and 4 give the folder and the lines that this choice adds, and step 6 gives its check. [reference/update.md](../../../reference/update.md) says how each of those jobs works.
```

### plugins/toolkit/skills/project-setup/choices/memory/local/local-memory-setup.md

```markdown
# Memory in local files

Follow these steps when the owner answers "local files" to question 6 of the guide, [SKILL.md](../../../SKILL.md). The job is done when `memory/` and the skill `managing-project-memory` are in the project, `PROJECT.md` records the choice, and the session-start command prints the project's Current State, which is the project's one short page of what is true now.

## Steps

Do steps 1 to 4 right after the answer, before the next question of the guide. Do steps 5 and 6 when setup finishes, in Step 6 of the guide. This choice has no question beyond the one about the default, needs no sign-in, and makes nothing outside the project folder.

1. **Tell the owner how the toolkit sets up memory in local files by default, and ask whether that is what the owner wants.** [reference/local-memory-default.md](reference/local-memory-default.md) holds the default. [SKILL.md](../../../SKILL.md), "Each choice has questions of its own", gives the words of the question and what to ask after a no.
2. **Copy the skill `managing-project-memory` into the project.** The folder `choices/memory/shared-by-local-and-notion/files-to-add/` holds the skill at the path a project has it. Copy this folder first. [reference/placing-files.md](../../../reference/placing-files.md) gives the copy command and what to do with a file that the project already has.
3. **After the skill is copied, copy this choice's own files into the project.** The folder `choices/memory/local/files-to-add/` holds them at the paths a project has them: four files inside that skill, and the folder `memory/`. Copy this folder the same way. [reference/what-local-memory-adds-to-a-project.md](reference/what-local-memory-adds-to-a-project.md) lists what the two folders add.
4. **Write the choice's lines in `PROJECT.md` and `AGENTS.md`.** [reference/what-local-memory-adds-to-a-project.md](reference/what-local-memory-adds-to-a-project.md) gives each line and the place where it goes.
5. **Write the first lines of the project's Current State in `memory/CURRENT_STATE.md`.** [reference/finishing.md](../../../reference/finishing.md), "The project's Current State", says what to write under each heading.
6. **Check that the session-start command prints the project's Current State, and that Git does not track memory.** `node .claude/hooks/session-start.mjs --memory local </dev/null` prints the Current State, and `git status --short` lists nothing under `memory/`. [reference/finishing.md](../../../reference/finishing.md), "Final checks", says how to run a check and what to do when one fails.

When a step does not work as expected, open [reference/local-memory-known-problems.md](reference/local-memory-known-problems.md).

"Check the setup", "update the toolkit", and a change of where memory is kept use the same steps: steps 2 to 4 give the folders and the lines that this choice adds, and step 6 gives its checks. [reference/update.md](../../../reference/update.md) says how each of those jobs works.
```

### plugins/toolkit/skills/project-setup/choices/memory/notion/reference/notion-memory-known-problems.md

```markdown
# Known problems with Notion memory

This file holds what is known to go wrong when memory in Notion is set up. Open it when a step of [notion-memory-setup.md](../notion-memory-setup.md) does not work as expected. Each line names a problem, and what to do.

- **`{{CURRENT_STATE_PAGE_ID}}` is still in a settings file at the finish.** The page's id was not put in. `grep -n '{{' .claude/settings.json .codex/hooks.json` shows where.
- **In Codex, the session-start check prints "could not be read here".** That text comes from the Codex sandbox, which blocks the network, and it is not a setup failure. Run the command escalated, as [SKILL.md](../../../../SKILL.md), "Known problems", says under "In Codex".
- **The owner trusted the Codex hooks before the page's id was put in.** A changed hook must be trusted again. Tell the owner.
```

## Additional independent-review corrections

Finishing's opening and update's Before you start now consistently state the check's maintenance exceptions. Update distinguishes operations needing approval from additive operations already authorized by an update request. Privacy verification combines git ls-files with git check-ignore of existing chosen local template/state paths, so no sample records are created.

## Unchanged ancillary files read and reviewed

Salesforce runtime: sf-component-tracker/SKILL.md retains complete tracker/manifest/manual-step synchronization, org flag evidence, stable CSV schema, rename/removal rules, and owner column approval. sf-data-change/SKILL.md retains production handoff, exact load + backup + success + undo, private event files and no PII commit. sf-deploy-check/SKILL.md retains exact deploy set, whole-component scope, deployed-revision comparison, read-only org verification, and owner decision on out-of-scope shipment. managing-work-items/references/salesforce-deploying.md retains validate/deploy/handoff and deployment records, flags, and history.

Salesforce setup read: salesforce-setup.md, salesforce-api-version.md, salesforce-default.md, salesforce-known-problems.md, salesforce-org-aliases.md, salesforce-own-skills.md, salesforce-refuse-list.md, salesforce-steps-left-for-the-owner.md, what-salesforce-adds-to-a-project.md. They retain named-client org isolation, version placeholders/current-version sourcing, owner overrides, install/telemetry/auto-deploy questions, refuse-list bounds and visibility, Current-State/Hindsight differences, exact root additions.

Notion shared setup read: notion-setup.md, notion-project-pages.md, notion-memory-pages.md, notion-sign-in.md, updating-a-notion-project.md, what-setup-may-do-in-the-owners-notion.md, where-the-notion-project-page-goes.md, where-the-notion-links-and-ids-go.md. They retain owner's Project template, scoped external authorization, owner-private login, mixed-store pruning of fresh copies only, page/db IDs, relations when adding a store later, template trash recovery, read-back checks, and no Notion writes during ordinary update.

Work-item and memory choice setup entry files read for local/Notion/GitHub/Hindsight. Their required sequence and record destinations survive; only local privacy checks and Notion active-permission diagnosis were changed. Hindsight onboarding and its effective package/mission configuration remain excluded because TKV-60 is in progress. Runtime memory/tracker references are reviewed by the workflow agent.

## Additional ancillary questions retained

- sf-component-tracker's master-manifest/tracker equality and permission for untracked snapshot components in 'a manifest' need an explicit scope distinction. No rule changed.
- Its exclusion of profiles, duplicate/matching rules and compact-layout assignments is phrased as a present-day platform fact; no new technical or owner evidence was used to relax it.
- sf-data-change permission-table override and universal production prohibition disagree. Resolving production execution policy requires owner clarification and is outside this edit.

## Setup-only choice reference coverage

The following non-Hindsight setup references were read in full. Their default explanations, exact additions/settings, auth privacy, chosen repository/schema, restore boundaries, and update ownership are preserved. Repetition was not removed where its intended restriction remains uncertain.

- plugins/toolkit/skills/project-setup/choices/work-items/github/reference/github-repository-for-work-items.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/github/reference/github-sign-in.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/github/reference/github-work-items-checks.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/github/reference/github-work-items-default.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/github/reference/updating-a-project-with-github-work-items.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/github/reference/what-github-work-items-add-to-a-project.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/local/reference/local-work-items-default.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/local/reference/local-work-items-known-problems.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/local/reference/what-local-work-items-add-to-a-project.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/notion/reference/notion-work-items-default.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/work-items/notion/reference/what-notion-work-items-add-to-a-project.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/memory/local/reference/local-memory-default.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/memory/local/reference/local-memory-known-problems.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/memory/local/reference/what-local-memory-adds-to-a-project.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/memory/notion/reference/notion-memory-default.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/memory/notion/reference/notion-memory-known-problems.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/memory/notion/reference/what-notion-memory-adds-to-a-project.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/notion-shared/reference/notion-memory-pages.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/notion-shared/reference/notion-project-pages.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/notion-shared/reference/notion-sign-in.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/notion-shared/reference/updating-a-notion-project.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/notion-shared/reference/what-setup-may-do-in-the-owners-notion.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/notion-shared/reference/where-the-notion-links-and-ids-go.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/notion-shared/reference/where-the-notion-project-page-goes.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/salesforce/reference/salesforce-api-version.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/salesforce/reference/salesforce-default.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/salesforce/reference/salesforce-known-problems.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/salesforce/reference/salesforce-org-aliases.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/salesforce/reference/salesforce-own-skills.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/salesforce/reference/salesforce-refuse-list.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/salesforce/reference/salesforce-steps-left-for-the-owner.md — reviewed; unchanged except Notion-memory permission diagnosis.
- plugins/toolkit/skills/project-setup/choices/salesforce/reference/what-salesforce-adds-to-a-project.md — reviewed; unchanged except Notion-memory permission diagnosis.

GitHub sign-in currently hardcodes brew install gh. That is a platform assumption (Windows installations need another mechanism), not a privacy requirement. Recommend platform-appropriate official installation if GitHub branch is revised; no new install permission is introduced. The existing sign-in remains owner-private.

## Notion CLI runtime review and permission correction

Read using-notion-cli/SKILL.md and its full references/ntn-commands.md. Corrected universal escalation in entry, access notes, and 401 diagnosis to follow active session permissions. Preserved serial ntn commands with their jq filter, no batching with writes, no session sandbox-mode bypass, owner-private login and shared-page diagnosis, stdin closure, whole-list relation updates, pagination, template exclusions, precise current-read text replacement, table-newline safeguard, atomic replacement/read-back, and temporary body cleanup. The first access check uses ntn whoami rather than requesting a fresh secret. API sizes and retry/template wait counts remain unchanged pending broad count review.

## Missing-parent restoration verification

Fresh-reader finding resolved: finishing now creates a missing parent folder with mkdir -p before cp -n restores a missing guide/template. Verified actual commands in a temporary folder with surviving work-item records and no template directory: restored WORK-ITEM.md and DESIGN.md; repeated cp -n preserved a modified existing template (macOS returns 1 when it skips that target); owner work-item remained byte-identical. TemporaryDirectory removed scratch. Instructions call cp only for files established as missing, so the skipped existing-target exit does not affect normal restoration. No real project record written.

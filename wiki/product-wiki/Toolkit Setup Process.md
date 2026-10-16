# Toolkit V2 setup process

This page gives an overview of what happens from the moment the owner says "set up this project" until the project is ready to work in, and the reasons setup is designed this way. The owner is the person the agent works for. The agent is Claude Code or Codex.

The steps, the questions, and the rules that hold during setup are in the `project-setup` skill, [SKILL.md](../../plugins/toolkit/skills/project-setup/SKILL.md), and the reference files it opens. That skill is the one authoritative place for them, so this page does not repeat them.

## Overview

1. Every project starts with the same full layout: the same folders, files, rules, skills, templates, and settings that every Toolkit V2 project has.
2. The agent then interviews the owner, one question at a time.
3. Each answer adds its part to the project: folders, lines in a file, additional skills, extra rules, or something outside the project folder after the owner's yes.
4. The agent finishes by checking the setup and telling the owner which steps only the owner can do.

The same skill also checks the setup of a project that already has the toolkit, updates it to the current toolkit, and adapts the toolkit to an existing project that already has agent files of its own.

## Why setup is designed this way

### The agent gets guidelines, not a script

There is no setup program. The skill gives the owner's procedure, the questions to ask, and what must be true at the end, and the agent copies and edits the files itself. A program would check for one exact shape and stop a project that differs from it. A project may add to the toolkit or change it, and that is not an error. The agent stays free to use its judgment in each case, as [[Toolkit Guiding Design Principles]], principle 8, says.

### Every project gets the same layout first

The full layout, the folder `every-project/`, is what the shared skills and rules rely on. Copying it first means every project has the same records, places, and skills, whatever the owner answers later. The answers only add to it.

### Each answer has its own folder

Each answer that picks a choice, such as where work items are kept, has its own folder under `choices/`. The folder holds everything that answer needs and nothing else. A project then reads only the text for the choices it made, and the shared text names no choice, as [[Toolkit Guiding Design Principles]], principles 5 and 6, say.

Every choice folder has the same shape. The local work items folder, `choices/work-items/local/`, is the model for it:

- one setup file, which holds the list of steps for that choice, in order;
- `reference/`, which holds the detail the steps need, one subject per file;
- `files-to-add/`, when the choice adds files to the project, at the paths a project has them.

A part that two choices share is kept once, in a folder of its own. `choices/notion-shared/` holds what Notion work items and Notion memory share. `choices/memory/repository-records/` holds `DECISIONS.md` and `wiki/product-wiki/`, which local and Hindsight memory share.

### Each choice has a default that the owner can change

For each choice, the toolkit has a default: how it sets the choice up when the owner changes nothing. The agent tells the owner the default in a few plain lines and asks whether the owner wants it or changes for this project. The owner gets a tested starting point, and a project can still differ where it needs to.

### The agent offers answers and never gives them

The agent reads the folder, and with the owner's yes the project's past sessions, before it asks anything. It offers what it finds as answers, so the owner confirms or corrects them instead of typing them again. The owner still gives every answer, because a fact the owner did not confirm would mislead every later session.

### The work starts from the roadmap

The last question asks where the project stands: its phases, what each phase is for, what is done, and what comes next. The work starts from the roadmap, so the agent writes it during setup. A project that is just starting has a roadmap too, even when it holds only the first phase or two.

### Nothing outside the project folder changes without the owner's yes

Setup can make a Notion page, a GitHub repository or labels, or a Hindsight memory bank, and can install tools on the owner's computer. Those affect the owner's own accounts and other projects, so the owner approves each one by name.

## One answer worked through: memory in Hindsight

When the owner answers "Hindsight" to where memory is kept, the agent follows the Hindsight setup file, `choices/memory/hindsight/hindsight-setup.md`. [What the Hindsight choice adds to a project](../../plugins/toolkit/skills/project-setup/choices/memory/hindsight/reference/what-hindsight-adds-to-a-project.md) lists what setup installs:

- the skill `managing-project-memory`, which the other skills call for every memory step, and the rule `.claude/rules/hindsight-memory.md`, which loads in every session;
- the decision and system records from `choices/memory/repository-records/`, with their rows in the root `AGENTS.md`;
- the "Project memory" section of the root `AGENTS.md`, which names the bank and says to use `managing-project-memory` for all memory work;
- the startup module `.claude/hooks/session-start-choice.mjs`, which adds nothing at session start because Hindsight's add-on supplies the startup memory, and the reminder text `.claude/hooks/prompt-memory-reminder.md`, which names `managing-project-memory`;
- the Hindsight lines in `PROJECT.md`, "Toolkit settings": the bank, its scope, the server, the dashboard, the package, the template, the owner's changes, the service, and the setup status;
- outside the project folder, after the owner's yes: the memory bank on the owner's Hindsight server, and Hindsight's add-on for Claude Code and Codex on this computer.

A Hindsight project has no `memory/` folder and no Current State. Where the work stands is in the work tracker and the project records. [[Hindsight Decisions and Evidence]] records the reasons behind the Hindsight settings and add-on patches.

## Not decided yet

1. **One definition of memory.** Mike's three criteria say what counts as memory, whatever the place it is kept. The proposal is to put them in the `AGENTS.md` that every project gets, and to let the Hindsight choice add only the sentence that names Hindsight and the bank.

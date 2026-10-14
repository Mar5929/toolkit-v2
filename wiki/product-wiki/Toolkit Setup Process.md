# Toolkit V2 setup process

This file describes, in plain English, what happens from the moment the owner says "set up this project" until the project is ready to work in. The owner is the person the agent works for. The agent is Claude Code or Codex.

## Overview

1. Every project starts with the same full layout: the same folders, files, rules, skills, templates, and settings that are used by any toolkitV2 project.
2. The agent then begins the setup interview process and asks the owner questions.
3. Each answer adds something to the project: folders, a few lines in a file, additional skills, extra rules, etc.
4. The agent is given guidelines and the questions to ask. It is not given a script to run.

## The process, step by step

### Step 1: The owner starts setup

The owner says "set up this project", or names the `project-setup` skill. The agent opens that skill. The skill holds the steps below.

### Step 2: The agent looks at the folder

Before it asks anything, the agent looks at what the folder already holds. It works out which of three situations this is, and says which one in one line.

| What the folder holds                                                                                      | What it is                                       | Where the agent goes next                      |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| Nothing, or only the project's own code and documents                                                      | A new project                                    | Step 3                                         |
| Agent files that the toolkit did not put there, such as an `AGENTS.md`, rules, or skills                    | An existing project that is adopting the toolkit | "An existing project" below                    |
| A project that already has Toolkit V2                                                                      | A project to update or check                     | "A project that already has the toolkit" below |

When the project had work before setup, the agent also asks whether it may read the project's past Claude Code and Codex sessions, and anywhere else the owner names. It uses what it finds to offer answers to the questions in Step 4.

### Step 3: The agent copies the full layout

The agent copies one folder, `every-project/`, into the project. That folder holds everything that every project gets, whatever the owner answers later:

- the project's folders and starting files, such as `SOUL.md`, `AGENTS.md`, `PROJECT.md`, `sources/`, `delivery/`, and `wiki/reference/`. `DECISIONS.md` and `wiki/product-wiki/` come with local or Hindsight memory;
- the rules every project follows;
- the skills every project has;
- the settings files, with every setting that is the same in every project;
- the small commands that run by themselves, such as the one that prints the project's Current State when a session starts.

The agent never replaces a file that the project already has. When the project already holds a file with the same name, the agent shows the owner how the two differ and asks. When the project already has records, the agent holds back the folders those records would move into, agrees the move with the owner after the memory question, and copies into those folders only after the move.

### Step 4: The agent asks the questions

The agent asks one question at a time, each with a recommendation and the reason for it. It uses what it found in the folder in Step 2: where the folder or past work already shows the answers to several questions, the agent shows them together, and the owner confirms or corrects them in one reply.

| Order | Question                                                                                             | The answers                                                                                | Where the answer goes                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | What is the project called, and who is the owner?                                                    | The owner's words                                                                          | The headings of `AGENTS.md`, `README.md`, and `PROJECT.md`, and the owner's row in `PROJECT.md`                                          |
| 2     | What is this project for, in one sentence?                                                           | The owner's words                                                                          | The top of `AGENTS.md` and `README.md`, and "Intended outcome" in `PROJECT.md`                                                           |
| 3     | Who else is involved, and who may decide what?                                                       | Each person, what the person does, and what the person may decide                          | "People and ownership" in `PROJECT.md`                                                                                                   |
| 4     | Which systems does the project touch, and which of them are production?                              | Each system, what it is for, and whether it is production                                  | "Systems and environments" in `PROJECT.md`. Every project is asked this, and it is the base for the safety rules.                        |
| 5     | Where are work items kept?                                                                           | Local files, Notion, or GitHub Issues                                                      | "Toolkit settings" in `PROJECT.md`, and that choice's folder under `choices/`                                                            |
| 6     | Where is memory kept?                                                                                | Local files, Notion, or Hindsight                                                          | "Toolkit settings" in `PROJECT.md`, and that choice's folder under `choices/`                                                            |
| 7     | Is this a Salesforce project?                                                                        | Yes or no                                                                                  | With a yes, the project gets what the toolkit offers for Salesforce work: extra rules, skills, and templates, from `choices/salesforce/` |
| 8     | Which outside tools and services does this project use?                                              | The owner's list                                                                           | `PROJECT.md`. The agent then checks that each one is installed and signed in on this computer, and tells the owner what is missing.      |
| 9     | How should the agent work with the owner on this project? (`SOUL.md`)                                | The owner's words, starting from the default `SOUL.md`                                     | `SOUL.md`                                                                                                                                |
| 10    | Is there material to start from? Examples are documents, an existing system, and old notes.          | The owner's files and links                                                                | `sources/`. The agent reads the material before question 11. When Step 2 read past work, the agent also files each fact from it that the owner confirms in the project's records.                                                                             |
| 11    | Where does the project stand?                                                                        | The project's phases, what is done, which phase the project is in now, and what comes next | The roadmap, in the place where work items are kept. With local or Notion memory, also the project's Current State                       |

**Question 11 is about the whole roadmap.** The agent asks where the project stands, and it works with the owner until it understands the full roadmap: the phases of the project, what each phase is for, what is already done, and where the project is now. A project that is just starting has a roadmap too, even when it is only the first phase or two. The work starts from the roadmap.

**Each answer leads to more questions about that answer.** The first question only picks the choice. The questions that follow are about how the owner wants that choice set up in this project.

- For each choice, the toolkit has a default: how the toolkit sets that choice up when the owner changes nothing. The default is written in the reference file of that choice.
- The agent reads that reference file, tells the owner the default in a few plain lines, and asks whether the owner wants those defaults or changes for this project.
- When the owner says yes, the agent sets the choice up that way.
- When the owner says no, the agent asks what the owner wants to be different, and sets it up that way for this project.

Two examples:

- The owner answers "Notion" to where work items are kept. The agent then asks the questions about Notion, such as which Notion page the project's pages go under.
- The owner answers "Hindsight" to where memory is kept. The agent then shows how the toolkit offers Hindsight by default, and asks whether that is what the owner wants for this project.
- After the owner has said where memory is kept, the agent asks about Claude Code's own memory. Claude Code can keep notes of its own, in a folder on the owner's computer, and load them into every session. The toolkit turns that off by default, so that the project's memory is kept in one place. The agent explains that default and asks whether the owner wants Claude Code's own memory enabled for this project.

The agent also checks that a humanizing skill or plugin is installed and available in each host the project uses. It reuses a suitable installed resource or agrees one with the owner, installs it within the approved scope, and records its name and invocation in `PROJECT.md`, "Resources and project paths". The resource does not have to be named `humanizer`.

### Step 5: Each answer adds its part

Each answer has its own folder inside the skill, under `choices/`. The folder for an answer holds everything that answer needs, and nothing else.

Every answer folder has the same shape. The Hindsight folder, `choices/memory/hindsight/`, is the model for it.

- **One setup file.** It opens with one or two sentences that say when the agent follows the file and what its steps do. After that, it holds only the list of steps the agent goes through, in order: what to look at, what to tell and ask the owner, what to write into the project, what to make outside the project folder after the owner's yes, and what to check. Each step names the file under `reference/` that holds its detail.
- **`reference/`.** The detail that the steps need: how the toolkit sets the choice up by default, the exact text and lines the choice adds to a file the project already has, the values and commands, and the known problems. Each file covers one subject, and its name says the subject.
- **`files-to-add/`**, when the answer adds files to the project. It holds the skills, rules, files, and templates as the full files, at the paths a project has them.

A folder holds only the parts that its answer needs.

A part that two answers share is kept once, in a folder of its own, which holds only the parts it needs. `choices/notion-shared/` holds what Notion work items and Notion memory share. Local memory and Notion memory each supply their own `managing-project-memory` skill, because their steps differ.

When the owner gives an answer, the agent opens that answer's setup file and goes through its steps: it asks the questions, puts the skills and files where the steps say, and sets up whatever the choice needs outside the project folder.

Nothing is made outside the project folder without the owner's yes. Examples are a Notion page, GitHub labels, a Hindsight memory bank, and an install on the owner's computer.

### Step 6: The agent finishes

1. It checks that every answer of the interview is written in its place. The table in Step 4 gives the place for each answer.
2. It writes the roadmap from question 11 in the place where work items are kept.
3. With local memory, it writes the first lines of Current State from question 11. With Notion memory, it initializes Current state through the librarian and verifies the wiki destinations, retrieval/capture skills, the librarian skill published inside Project Wiki with verified project context and schemas, and the supported scheduler chosen with the owner. A Hindsight project keeps current work in its tracker and project records.
4. It checks that the setup works: the settings files are valid, the session-start command prints the Current State when the project has one, and each service the owner chose answers.
5. It tells the owner the steps that only the owner can do, such as signing in to a service or trusting the project folder in Codex.
6. It reports what was set up, what was made outside the folder, and what is still open. It also tells the owner that any instruction for how the agent works can be given at any time, and that the agent saves it in `owner-preferences.md`.
7. It offers to commit the setup files.

## One answer worked through: memory in Hindsight

1. The agent asks where memory is kept, and the owner answers "Hindsight".
2. The agent opens the folder `choices/memory/hindsight/`. Its interview says how the toolkit offers Hindsight by default, what to ask, and what to be aware of. For example: whether this project gets its own memory bank, which settings the bank gets, that the owner enters the API key in the owner's own terminal and the agent never sees it, and that Hindsight's add-on cannot delete a memory.
3. The agent tells the owner the default in a few plain lines and asks: "This is how the toolkit sets up Hindsight by default. Is this what you want?" The owner says yes or no. On a no, the agent asks what should be different. Then it asks the other questions, one at a time.
4. The agent adds the Hindsight text to the "Project memory" section of the project's `AGENTS.md`, as the setup file in that folder says. The text is Mike's, with the bank's name filled in:

   > You (the agent) use hindsight for memory recall, storage, and insights in this project. You (the agent) are responsible for saving this type of information to the `<bank>` hindsight memory bank:
   >
   > Persistent project memory criteria (1 AND 2 AND 3):
   >
   > 1. Lasting project-specific facts, decisions, lessons, events, and constraints that not already owned by another memory file (we don't want duplicates).
   > 2. It has lasting significance: losing it would cost a later agent real time or understanding.
   > 3. It comes from the owner, or from work done together with the owner.

5. The agent writes `hindsight` on the memory line of the settings.
6. After the owner's yes, the agent makes the memory bank and connects this project to it.

## An existing project

An existing project already has agent files of its own. The agent asks one question:

> Do you want everything moved to the toolkit's structure, or do you want to pick and choose?

- **Everything.** The agent continues at Step 3. It applies the full layout to what is there, and asks about each file of the owner's that the layout would change.
- **Pick and choose.** The owner and the agent work out together which parts of the toolkit the project takes. The toolkit gives no instruction for each possible case. The agent uses its judgment and asks the owner.

Three rules hold in both cases:

- The agent never replaces or deletes a file of the owner's without showing the difference and asking.
- The agent never deletes an old record, such as an old work item or old memory.
- The agent makes the changes on a branch, so that everything can be undone.

## A project that already has the toolkit

When the owner says "update the toolkit", the agent scans the project against the current toolkit for its recorded choices. The agent explains the differences and updates and asks what the owner wants to adopt. It applies only the selected changes, preserves project records and customizations, and checks the adopted setup. Files the toolkit no longer ships are included in the review; they are not removed automatically.

When the owner says "check the setup", the agent checks and reports without adopting updates or moving records. A difference the owner chose to retain is not a setup failure.

## Rules that hold in every step

- The agent stays free to use its judgment. The toolkit states the owner's procedures, the questions to ask, and what must be true at the end. It does not give a command for each move.
- A fact that the agent cannot know by itself is written down, in the folder of the choice it belongs to.
- A project may differ from the toolkit. The owner may add to it or change it, and that is not an error.
- The agent never answers a question for the owner.
- The agent never writes a fact that the owner did not confirm.

## Where each step finds its files

`SKILL.md` is the one guide. It holds the sequence the agent goes through and the questions it asks, in order. It branches off to another file only where a step needs more detail.

```
project-setup/
├── SKILL.md              the one guide: Steps 1 to 6 and the questions
├── reference/            branches that belong to no choice: an existing
│                         project, and a project that already has the toolkit
├── every-project/        Step 3: the full layout
└── choices/              Step 5: one folder for each answer
    ├── work-items/
    │   ├── local/
    │   ├── notion/
    │   └── github/
    ├── memory/
    │   ├── local/
    │   ├── notion/
    │   ├── hindsight/
    │   └── repository-records/           what local and Hindsight memory share
    ├── notion-shared/                    what the two Notion answers share
    └── salesforce/
```

A folder for an answer has the shape that Step 5 gives:

- one setup file, which is the branch the guide points to for that answer. It holds one or two sentences of overview and then only the list of steps;
- `reference/`, which holds the detail that the steps need;
- `files-to-add/`, when the answer adds files to the project. The agent puts those files into the project's layout.

## Not decided yet

1. **One definition of memory.** Mike's three criteria say what counts as memory, whatever the place it is kept. The proposal is to put them in the `AGENTS.md` that every project gets, and to let the Hindsight choice add only the sentence that names Hindsight and the bank.
2. **The text of the default `SOUL.md`.** A default needs real text: how Mike wants an agent to work with him in any project. That text is Mike's to give or to approve.

## Root project guide

After setup verifies the selected stores, root `AGENTS.md` names this repository’s work tracker and memory store in a short paragraph. Each choice supplies its sentence. Notion choices include this project’s Project page and, for memory, Project Wiki link. Skills hold the procedures; `PROJECT.md` holds connection details. Setup checks and updates keep the paragraph consistent with the current record homes.

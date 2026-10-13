# Toolkit V2 structure

This page says what a project holds once Toolkit V2 is set up in it. It starts with what every project gets. Then it goes module by module and says what each module adds. A module is the part of the toolkit that one answer in the setup interview adds. [[Toolkit Setup Process]] says how setup puts these parts into a project.

## Every project

Every project gets the same layout, whatever the owner answers in the interview. The layout is one folder in the toolkit, `every-project/`, and setup copies it into the project.

```
<project>/
├── AGENTS.md              the agent's guide to this project
├── CLAUDE.md              one line that makes Claude Code read AGENTS.md
├── PROJECT.md             the stable facts about the project
├── SOUL.md                how the agent works with the owner
├── DECISIONS.md           decisions and open questions
├── README.md              the project's one README
├── .gitignore, .ignore    what Git and the search tools skip
│
├── wiki/                  maintained product documentation and reference
│   ├── product-wiki/      what the system is and how it works (living SOT)
│   └── reference/         material to look things up in
├── sources/               what the project received from someone
├── delivery/              what the project hands over or ships
├── tests/                 the test plan template
│
├── .claude/               the rules, skills, hook commands, output style, and settings
│   ├── rules/
│   ├── skills/
│   ├── hooks/
│   ├── output-styles/
│   └── settings.json
├── .codex/                the same hooks and switches, for Codex
│   ├── hooks.json
│   └── config.toml
└── .agents/skills         a link to .claude/skills, so Codex reads the same skills
```

### The files at the root of the project

| File | What it holds |
| --- | --- |
| `AGENTS.md` | The instructions every session reads first. Setup fills a short paragraph naming this repository’s chosen work tracker and memory store, including its Notion project link when either choice uses Notion. Its sections: the agent's job, what to do in every session, the map of the project, where each kind of information goes, what to ask the owner first, how to write a question to the owner, which skill does which job, the project's commands, and how to write replies. |
| `CLAUDE.md` | The one line `@AGENTS.md`. Claude Code reads `AGENTS.md` through it. Each folder below that has its own `AGENTS.md` has this file beside it. |
| `PROJECT.md` | The facts that stay true: what the project is for, what is in and out of scope, the systems and environments, the people and what each may decide, where the records are, the project's paths, and the "Toolkit settings" section, which records the owner's answers from setup. |
| `SOUL.md` | How the owner wants the agent to work with the owner and the team. It starts as the toolkit's default, and the interview fits it to the project. |
| `DECISIONS.md` | Each decision that more than one piece of work needs, with an ID, and each open question. |
| `README.md` | The project's one README. It is at the root, and no other folder has one. |
| `.gitignore`, `.ignore` | `.gitignore` keeps `work-items/` and `memory/` out of Git. `.ignore` lets the search tools read those two folders all the same. |

### The folders for the project's records

| Folder       | What it holds                                                                                                                                                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wiki/product-wiki/`    | The description of the system the project builds or changes: `architecture.md`, `data-model.md`, `automation.md`, `security-model.md`, `constraints.md`, `glossary.md`, `integrations/` (one file per integration, from a template, listed in its `INDEX.md`), and `diagrams/`. |
| `sources/`   | Every document or message the project receives from someone, kept unchanged. `INDEX.md` lists them, one row per source.                                                                                                                                              |
| `delivery/`  | What the project hands over or ships: `releases/`, `deployments/`, `migrations/`, and `client-handoffs/`.                                                                                                                                             |
| `wiki/reference/` | Material to look things up in: `current-system/` for the system as it is before the project changes it, and `ai-external-knowledge/` for knowledge captured from outside the project, such as vendor documentation or architecture best practices, which the agent reads to ground itself in a topic, listed in its `INDEX.md`.                                                                       |
| `tests/`     | The test plan template.                                                                                                                                                                                                                               |

Each of `wiki/product-wiki/`, `sources/`, `delivery/`, and `wiki/reference/` has its own `AGENTS.md`, which says what belongs in that folder and how a record there is written.

### The rules every project gets

A rule is a short file that Claude Code loads in every session. `AGENTS.md` tells Codex which rules to read.

| Rule                             | What it tells the agent                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `evaluate-the-owners-request.md` | Work out the goal behind a request and the best solution for the whole project before acting.                 |
| `document-clarity-standard.md`   | How to write a document so that a reader new to the project understands it after one read.                    |
| `shared-repository-work.md`      | How to work in a repository that other sessions also edit: branches, worktrees, and the check before a merge. |
| `owner-preferences.md`           | The owner's "from now on" instructions for this project. It is the owner's own file from the first day.       |

### The skills every project gets

A skill is a folder of instructions that the agent opens when a job needs it.

| Skill                    | What it is for                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `managing-work-items`    | The whole life of a work item, from idea to Done: requirements, design, building, testing, deploying, and closing. |
| `filing-project-records` | Filing a source, a decision, or a change to a system document in its place, with an ID.                            |
| `handoff`                | Ending a session: update the records and write a prompt for the next session.                                      |
| `braindump`              | Play back the owner's loose ideas and wait for a yes before starting.                                              |
| `session-summary`        | A table of what the owner asked in this session and what came of it.                                               |
| `publish-docs`           | Save an approved edit to project documents on the default branch.                                                  |
| `pull-latest`            | Bring in new commits from the remote and keep local work.                                                          |
| `reset-to-remote`        | Make the local repository match the remote, after showing a plan.                                                  |
| `merge-and-clean-up`     | Merge one approved pull request and remove its branch and worktree.                                                |

### The hook commands every project gets

A hook command runs by itself at a fixed moment. Claude Code and Codex both run the same three, from `.claude/hooks/`.

| Command | When it runs | What it does |
| --- | --- | --- |
| `session-start.mjs` | A session starts | Prints the project's Current State, when the project has one. |
| `prompt-reminder.mjs` | Every message | Reminds the agent to check the project's skills, and prints the rule `evaluate-the-owners-request.md`. |
| `codex-after-commit.mjs` | After a `git commit` | Reminds the agent to update the work item. |

A fourth hook has no file of its own: after a helper agent runs, a reminder to update the work item that the helper worked on.

### The output style every project gets

`.claude/output-styles/plain-english.md` says how replies to the owner are written.

### The settings every project gets

`.claude/settings.json`, `.codex/hooks.json`, and `.codex/config.toml` hold what is the same in every project:

- no AI credit on a commit or a pull request;
- Claude Code's own memory off, unless the owner turns it on in the interview;
- the Plain English output style;
- the four hooks above;
- more room for the list of skills.

## What a module can add

A module holds only the parts its choice needs. These are the kinds of thing a module can add.

| Kind | Example |
| --- | --- |
| Questions for the owner | "This is how the toolkit sets up Hindsight by default. Is this what you want?" |
| A skill, or files inside a skill the project already has | The Notion module adds its files inside `managing-work-items`. |
| A rule | The Salesforce module adds `salesforce-org-safety.md`. |
| Files, folders, and templates | Local work items add the folder `work-items/`. |
| Text in `AGENTS.md` | The Hindsight module adds its text at the top. |
| Lines in the settings | The Salesforce module adds six forbidden commands. |
| Lines in `PROJECT.md`, "Toolkit settings" | The GitHub module writes the repository's name. |
| Something outside the project folder, after the owner's yes | The Notion module makes the project's pages in Notion. |
| A step that only the owner can do | Sign in to a service. |

## Module: where work items are kept

Every project already has the skill `managing-work-items`, which holds the process. This module adds how one place stores a work item. The owner picks one of three.

### Local files

| Kind | What it adds |
| --- | --- |
| Questions | The prefix of a work item's ID, such as `WI`. |
| Files and folders | `PROJECT-ROADMAP.md` at the root: the project's phases. `work-items/`: its `AGENTS.md`, `PROJECT-TASKS.md` for tasks that belong to no work item, and `work-item-template/` with `WORK-ITEM.md` and `DESIGN.md`. |
| Files inside `managing-work-items` | Five: how a work item is stored as a folder (`work-tracker.md`), the folders and files, how each field is written, the roadmap and the project's tasks, and how to search. |
| `PROJECT.md` | Tracker: `local`, and the ID prefix. |
| Outside the project folder | Nothing. Git ignores `work-items/`, so the work items are on this computer only. |

### Notion

| Kind | What it adds |
| --- | --- |
| Questions | Where in Notion the project's page goes, and the prefix of a work item's ID. |
| Files inside `managing-work-items` | Four references: work placement and properties, record updates, API calls, and recovery. Each project owns its Work Items, Phases and Tasks databases; phases organize project or work-item roadmaps, and tasks belong to a work item or project administration. The layout of a work item's page is the owner's template in Notion, and no file describes it. |
| Skill and rule | `using-notion-cli`, which says how to run the Notion command-line tool, and the rule `notion-records.md`. The Notion memory module adds the same two, and a project gets them once. |
| `PROJECT.md` | Tracker: `notion`, the ID prefix, and the links and IDs of the project's Notion page and its Work Items, Phases, and Tasks databases. |
| Outside the project folder | The project's pages in Notion, made as a copy of the owner's "Project" template. The project's phases are kept in the Phases database. |
| The owner's own steps | Sign the Notion command-line tool in, and share the root page with it. |

### GitHub Issues

| Kind | What it adds |
| --- | --- |
| Questions | Which repository holds the issues, and whether to create it when there is none. |
| Files inside `managing-work-items` | Six: how a work item is stored as an issue (`work-tracker.md`), the layout of an issue, the labels, the commands, the roadmap and the project's tasks, and how to search. |
| `PROJECT.md` | Tracker: `github`, and the repository. |
| Outside the project folder | The labels in the repository, and the repository itself when the owner asks for one. The project's phases are kept as milestones in the repository. |
| The owner's own steps | Sign the GitHub command-line tool in. |

## Module: where memory is kept

Memory preserves useful context without duplicating records owned elsewhere. The owner picks one of three; the Notion choice also provides the project’s curated wiki documentation. With local files or Notion, the project has a Current State, the project's one short page of what is true now. A Hindsight project has none: where the work stands is in the place where work items are kept.

With each of the three, the agent also asks whether the owner wants Claude Code's own memory on in the project. Claude Code's own memory is a folder of notes on the owner's computer that Claude Code loads into every session. The toolkit's default is off, so that the project's memory is kept in one place. The answer is one line in `.claude/settings.json`.

### Local files

| Kind | What it adds |
| --- | --- |
| Skill | `managing-project-memory`: the process (what counts as memory, saving, finding, tidying, the Current State), and four files on how memory is stored as local files. |
| Files and folders | `memory/`: its `AGENTS.md`, `CURRENT_STATE.md`, `MEMORY.md` (an index that the session-start hook rebuilds), and a template for one memory file. |
| Settings | The word `local` on the session-start line. |
| `PROJECT.md` | Memory: `local`. |
| Outside the project folder | Nothing. Git ignores `memory/`, so memory is on this computer only. |

### Notion

The Project Wiki in the owner's Project template supplies one Wiki Inbox and four curated destinations. Coding agents read relevant wiki records and capture useful information; the librarian reconciles and files it.

| Kind | What it adds |
| --- | --- |
| Questions | Confirm the Project template and project placement, then choose a supported daily scheduler with the owner. |
| Skills | `managing-project-memory`: short retrieval and capture steps with focused destination references. `maintaining-notion-wiki`: librarian steps with references for schemas, filing, metadata and recovery. |
| Skill and rule | `using-notion-cli` and `notion-records.md`, once, as for Notion work items. |
| Settings | The word `notion` on the session-start line and the Current state page ID. Startup directs the agent to check relevant pending captures for freshness. |
| Published librarian skill | Every Project Wiki holds a short Librarian processing skill entry, linked procedure and schema references, and verified project context and connections. The selected cloud or local librarian starts from its entry link. |
| `PROJECT.md` | Memory: `notion`; configured Project Wiki, published librarian and context links, inbox, destination and data-source identifiers; librarian schedule and open setup steps. |
| Outside the project folder | The owner's existing Project Wiki model, copied with the Project template: Wiki Inbox, Current state, Long-Term Memory, Terminology Glossary and Product Wiki. |
| The owner's own steps | Sign in, grant the selected tools access and confirm the scheduler during setup. |

Current state is short-term working context derived from current work records. Long-Term Memory holds qualifying lasting context and non-product decisions or lessons. Terminology Glossary owns finalized terms. Product Wiki owns finalized living product documentation, architecture and product decisions; documentation approval and implementation status remain separate.

Working designs stay in the work item's Solution Design. Finalized outcomes are captured automatically and filed under existing approval evidence. Later changes use another work item and update existing wiki records. Work items can close after verified capture; pending filing is recorded honestly. This Notion model replaces equivalent local system documents, glossary and decision ledger rather than maintaining duplicate authoritative bodies.

For any existing project, propose a review and migration batch.

### Hindsight

| Kind | What it adds |
| --- | --- |
| Questions | Confirm the bank's stable identity and who shares its memory. Offer one bank for the project and the deliberate-save default package, then ask what the owner wants different. Explain service readiness, recommended model and capacity settings with their evidence limits, and the checks that must pass. Broader sharing and changes affecting the shared service are explicit owner choices. |
| Text in `AGENTS.md` | At the top: that the agent uses Hindsight for this project's memory, the bank's name, and the three criteria for what the agent saves. With the package where the agent saves on purpose, also the lines on how the agent writes a record. |
| Files and folders | The rule `.claude/rules/hindsight-memory.md`. A Hindsight project has no `memory/` folder and no Current State. |
| Settings | The word `hindsight` on the session-start line, and one more word on the every-message line. |
| `PROJECT.md` | Memory: `hindsight`, the stable bank ID and sharing scope, the server's address, the dashboard link, the package, the template, the owner's changes, service operator and verified profile, and open setup steps. |
| Outside the project folder | The memory bank on the owner's Hindsight server, and Hindsight's own add-on for Claude Code and Codex on this computer. The add-on brings its own skill and tools, so the toolkit adds no memory skill. |
| What the agent must be aware of | The owner enters the API key in the owner's own terminal, and the agent never sees it. The add-on cannot delete a memory. |
| The owner's own steps | Enter the API key, sign in to the dashboard, and trust the add-on's hooks in Codex. |

## Module: Salesforce

The owner answers yes to "Is this a Salesforce project?". The module adds what the toolkit offers for Salesforce work.

| Kind | What it adds |
| --- | --- |
| Questions | Which sandbox the agents may deploy to. Which org is production. Whether the toolkit's defaults for what an agent may do in each kind of org are what the owner wants. The API version, when it cannot be read. Which of Salesforce's own skills to have on. |
| Rules | Three. `salesforce-org-safety.md`: the limits that are the same in every project, such as no deploy and no data change in production. `salesforce-agent-permissions.md`: the owner's choices for this project, starting from the toolkit's defaults. `salesforce-deployments.md`: when to update the list of changed components, when to write down a manual deployment step, when to check what a deploy includes, and how the Salesforce templates in `delivery/` are used. |
| Text in `AGENTS.md` | Two lines: use Salesforce's own skills for Salesforce work, and this project's rules and its three `sf-*` skills win over them. The "Which skill" and "Commands" tables get their Salesforce rows. |
| Skills | `sf-component-tracker`: keeps the list of changed components and the deployment files in step with the metadata. `sf-deploy-check`: checks that a deploy holds only the intended change. `sf-data-change`: prepares the owner's handoff for a change to production data. |
| Files and templates | `sfdx-project.json` and `.forceignore` at the root. In `delivery/deployments/`: `component-tracker.csv`, a template for a deployment of the full project, and a template for the deployment of one work item. In `delivery/migrations/`: a template for one area of data (the area, the field mapping, the transformation rules), and the folders `data-loads/` and `production-backups/`. In `delivery/releases/`: a template with a cutover plan and release notes. |
| Settings | Six forbidden commands that delete source or an org, and one entry for each production org the owner names, so that Claude Code refuses a command that changes it. |
| `PROJECT.md` | The org aliases: one line per org, with what the org is for, and production marked. |
| Outside the project folder | Nothing is made. The agent checks that Salesforce's own skills are installed, and tells the owner when they are not. |
| The owner's own steps | Install Salesforce's own skills, and connect the project's orgs. |

## Parts that two modules share

| Part | Which modules bring it |
| --- | --- |
| `using-notion-cli` and the rule `notion-records.md` | Notion work items and Notion memory |


A project that picks both modules of a row gets the part once.

## Interview answers that add no module

These answers are written into a file that every project already has. [[Toolkit Setup Process]], Step 4, gives the file for each.

- The project's name and the owner
- What the project is for
- The people, and who may decide what
- The systems the project touches, and which are production
- The outside tools and services the project uses
- What the agent may do without asking
- How the agent works with the owner (`SOUL.md`)
- The material to start from
- Where the project stands: the roadmap and its phases

## Not decided yet

1. **One definition of memory.** Mike's three criteria say what counts as memory, whatever the place it is kept. The proposal is to put them in the `AGENTS.md` that every project gets, and to let the Hindsight module add only the sentence that names Hindsight and the bank.
2. **A rule file in a Hindsight project.** The proposal is that the Hindsight module adds only its text in `AGENTS.md` and the few facts the agent must be aware of, and no rule file of its own.
3. **Other modules.** Mike has named ClickUp and Jira as possible places to keep work items. Neither is a module.

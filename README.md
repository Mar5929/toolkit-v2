# Toolkit V2

Toolkit V2 sets up a project folder so the agent can run the project for you
in Claude Code or Codex. You make the decisions and steer. The agent does the
work, tracks it, and remembers what matters.

It is written instructions plus three small hooks. There is no program to
install, run, or keep working (your decision of 2026-09-29).

## The parts

- **Your model project** (`toolkit-v2-model-project`) is the source of every
  file a new project gets: `AGENTS.md` (the project manual the agent reads),
  `PROJECT.md`, `PROJECT-ROADMAP.md`, the rules, and the templates. The
  toolkit keeps an exact copy of it.
- **Skills** are written instructions, one per job. The agent picks one from
  what you say, by reading each skill's short description.
- **Rules** are instructions the agent always follows, such as "ask before
  deploying". They come from your model.
- **Hooks** are small commands Claude Code and Codex run by themselves at set
  moments, for example when a session starts.

## One plugin, one skill

The toolkit is one plugin, `toolkit`, with one skill, `project-setup`. It is
switched on for every folder, so "set up this project" works anywhere. It has
no hooks, so it does nothing in your other projects.

Setup copies everything a project needs into the project itself. That way the
project works the same in Claude Code, the Codex app, and the Codex extension
in your code editor, which loads no plugins.

## Set up a project

Open Claude Code or Codex in the project folder and say **"set up this
project"**. The agent asks one question at a time and recommends an answer:

- the project's name and owner;
- where work items live: local folders (read them in Obsidian), Notion, or
  GitHub Issues (Jira is for later);
- where memory lives: local files (read them in Obsidian), Notion, or
  Hindsight;
- whether it is a Salesforce project;
- whether you want a `SOUL.md`.

Any mix works, for example work items in Notion and memory in local files.

It shows you the plan and waits for your yes. Then it copies your model's
files, the skills for your answers, the hooks, and the settings into the
project. It asks you to sign in where needed (`ntn login` for Notion,
`gh auth login` for GitHub), then sets up the Notion pages, the GitHub labels,
or the Hindsight memory bank. It finishes by running its checks and offering
to commit.

Start a new session afterwards, so the new files load. In Codex, also trust
the project folder and its hooks (`/hooks`).

Later, say **"check the setup"** to see what differs (it changes nothing), or
**"update the toolkit"** to bring a project up to date. It shows every change
first and never overwrites a file you changed without asking.

## Skills every project gets (13)

| Skill | What it does | You might say |
| --- | --- | --- |
| `work-refine` | Turns a rough idea, meeting notes, and documents into agreed requirements and a roadmap. It asks one question at a time and saves each answer at once. | "help me plan this", "what am I missing" |
| `solution-design` | Gives you design options for how to build an item, with a recommendation. | "how should we build it" |
| `work-delegate` | Hands a work item to a team of helper agents, with you as the product owner. | "you drive", "take it from here" |
| `work-check` | Has an independent checker test the result, then asks you to approve it. | "is it ready", "test it" |
| `work-finish` | Ships and closes an approved item, or cancels one. It asks you before marking it Done. | "ship it", "mark it done" |
| `handoff` | Saves where things stand and writes a checked prompt for a new session. | "write a handoff" |
| `braindump` | Plays back a loose brain dump in simple words before any work starts. | "here's a brain dump" |
| `explain-simply` | Explains the last answer again as short, plain bullets. | "explain it like I'm five" |
| `session-summary` | Shows what you asked for in this chat and where each request landed. | "recap this chat" |
| `pull-latest` | Brings your copy of the code up to date, safely. | "get the latest" |
| `reset-to-remote` | Makes your copy an exact match of the remote copy. It deletes local changes, so it runs only when you clearly ask. | "wipe local" |
| `merge-and-clean-up` | Merges an approved pull request and removes only its branches. | "merge and clean up" |
| `publish-docs` | Saves an agreed document change straight to the main branch. | "publish the docs" |

## Skills for your choices

Each project gets one work tracking set and one memory set:

| Your choice | Skills it adds |
| --- | --- |
| Work items in local folders | `local-work-track` (finds, creates, and changes items) |
| Work items in Notion | `notion-work-track` |
| Work items in GitHub Issues | `github-work-track` |
| Memory in local files | `local-memory-save`, `local-memory-find`, `local-memory-refine` (cleans up) |
| Memory in Notion | `notion-memory-save`, `notion-memory-find`, `notion-memory-refine` |
| Memory in Hindsight | None. The agent uses Hindsight's own save and search tools. |
| Salesforce | `sf-architect-solutioning`, `sf-deploy-check`, `sf-component-tracker`, `sf-data-change` |

A project ends up with 17 skills, or 21 in a Salesforce project (14 or 18 with
Hindsight memory). Building, and saying where the work stands, need no skill:
the project's `AGENTS.md` says how. `dev/SKILL-INDEX.md` lists every skill with its exact
description.

## The hooks

| When | What happens |
| --- | --- |
| A session starts, resumes, or its context is compacted | The agent is shown Current State: a short list of what is happening now and what waits on you. With local memory, the hook first rebuilds the memory index, `memory/MEMORY.md`. When Current State is too long or older than 7 days, it asks the agent to clean it up. |
| You say something worth keeping ("remember this", "from now on", "we decided", and similar) | A one-line reminder names the memory save skill. The skill decides whether anything is saved, and asks you first. |
| After a commit | A reminder to update the work item's history and status, and Current State if it changed. |
| A helper agent starts or reports back | A reminder to update that helper's work item. |

There is no hook for marking work Done. The agent asks you first, and
records your words and the date.

## How work and memory fit together

- Every work item goes through the same stages and statuses, wherever it is
  stored.
- Each work item has a Questions and Answers table. Your answer is saved the
  moment you give it, and unanswered questions stay at the top, so a new
  session picks up at the first open one.
- Every decision is saved in its work item first. When a decision matters
  beyond that item, the agent asks "This looks project-wide. Save it to
  memory too?"
- An independent checker agent tests the work before you are asked to
  approve it. Only you mark an item Done.
- "From now on" instructions become a line in the project's
  `.claude/rules/owner-preferences.md`.
- When the agent uses something it recalled, it says where it came from and
  ends with a short Sources list.
- You can move files by hand. The agent finds work items by their ID, notices
  the move, and carries on.

## When you change your model project

In this folder, ask an agent to **"refresh the model copy"**. It copies your
model into the toolkit, runs the checks, and raises the toolkit's version
number. Then say **"update the toolkit"** in each project that should get the
change.

Right now the copy comes from
`/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`,
the folder with the changes you approved. After you merge those changes into
your model, the copy comes from your model folder.

## Install on this Mac (one time)

Each of these changes your own setup, so an agent asks you before it runs
them.

```bash
claude plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2
claude plugin install toolkit@toolkit-v2
claude plugin enable toolkit@toolkit-v2 --scope user
codex plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2
codex plugin add toolkit@toolkit-v2
```

After a change to the toolkit, the version number goes up, and these bring
the new version in:

```bash
claude plugin marketplace update toolkit-v2
claude plugin update toolkit@toolkit-v2
codex plugin add toolkit@toolkit-v2
```

Start a new session in each app afterwards.

## What only you can do

The agent never does these for you. It tells you when each one is needed.

- **Sign in**: `ntn login` for Notion, `gh auth login` for GitHub, in a
  terminal.
- **Trust the project in Codex**: trust the folder the first time you open
  it, then trust its hooks with `/hooks`. Do it again after the hooks change.
- **Approve the Hindsight server** when Claude Code asks, in a Hindsight
  project.
- **Say yes or no** to anything outside the project folder or that cannot be
  undone: new Notion pages, a GitHub repository or labels, a Hindsight
  memory bank, an install, a production deploy, or a production data load.
- **Mark work Done**, or tell the agent it may.

## Where things are

- `plugins/toolkit/`: the plugin. Its `skills/project-setup/assets/` folder
  holds the model copy, every skill, the hooks, and the settings.
- `dev/`: the goal, progress, design, research, checks, and test runs. It is
  not installed anywhere.
- `ai-external-knowledge/`: saved copies of the official Claude Code, Codex,
  and Agent Skills documentation, used to build the skills and hooks. It is
  not installed anywhere.
- `AGENTS.md`: instructions for agents working on Toolkit V2 itself.

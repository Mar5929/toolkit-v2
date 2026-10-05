# Toolkit V2

Toolkit V2 sets up a project folder so the agent can run the project for you
in Claude Code or Codex. You make the decisions and steer. The agent does the
work, tracks it, and remembers what matters.

It is written instructions plus three small hooks. There is no program to
install, run, or keep working (your decision of 2026-09-29). The one
exception is the workstream panel for Claude Code (your decision of
2026-10-03), described below.

## The parts

- **The starter project inside the toolkit** is the source of every project
  file: `AGENTS.md` (the project manual the agent reads), `PROJECT.md`,
  `DECISIONS.md`, the folders `system/`, `sources/`, `delivery/`, and
  `reference/`, the rules, and the templates. It is one folder for what every
  project gets (`every-project`) and one folder for each choice you make
  (work items in local folders, Notion, or GitHub Issues; memory in local
  files, Notion, or Hindsight; Salesforce; `SOUL.md`), all under
  `plugins/toolkit/skills/project-setup/assets/`. A choice decides which
  files a project gets, never which lines inside a file.
- **Skills** are written instructions, one per job. The agent picks one from
  what you say, by reading each skill's short description.
- **Rules** are instructions the agent always follows, such as "ask before
  deploying". They come from the starter project.
- **Hooks** are small commands Claude Code and Codex run by themselves at set
  moments, for example when a session starts.

## The main plugin and its two skills

The toolkit's main plugin is `toolkit`. Its main skill is `project-setup`. The
plugin is switched on for every folder, so "toolkit v2" or "set up this project"
works anywhere. It has
no hooks, so it does nothing in your other projects.

Its second skill, `choosing-outside-tools`, is your tool list. It holds one
row for each kind of job you use an outside tool for, such as explainer
videos: the tool you chose, where it comes from, how to set it up, and your
choices for it. The toolkit does not ship those tools. When you ask for a job
on the list, the agent uses your tool. When the tool is not on that computer,
the agent says so and sets it up only after your yes. To add a tool, say "add
this to my tool list" in a chat opened in this repository.

Setup copies everything a project needs into the project itself. That way the
project works the same in Claude Code, the Codex app, and the Codex extension
in your code editor, which loads no plugins.

## The workstream panel

A second plugin, `workstreams`, adds a side panel to Claude Code. Type
`/streams` in any project folder. It shows the Claude chats you have going in
that project and what each one is working on. It needs no Notion.

- **One card per chat.** A small "Chat" label sits above the chat's name.
  The card shows whether the chat is working, asking you a question, or
  stopped, your last message to it, and how many helper agents it runs. A
  chat named "Main Orchestrator" is listed first, then the chats that need
  you.
- **Its workstreams are inside the card**, under a "Workstreams" label and
  indented. Each one has a name and three labelled lines, always in this
  order: About, Status, Next.
  - The name is a short subject line in your own plain words.
  - About is one or two plain sentences on what you asked for and why. It is
    there to remind you what the work is, and it stays as first written.
  - Status is a colored label: Needs you, Blocked, or In progress.
  - Next is the next step and who does it.
- **Collapse.** Press Collapse on a card to fold away its workstreams. The
  folded card still says how many there are and how many need you. Press
  Expand to open it again.
- **Mark done.** Press it on a workstream when it is finished. It moves to
  the "Done today" list. A chat's agent can also report a workstream as done.
- **Hide.** Press it on a workstream to hide it without calling it done.
  Press "Dismiss chat" after you archive a chat, because the panel is not
  told about that. What you press applies in every chat's panel.
- A workstream comes back if a chat reports it again. A chat comes back if
  you write to it again.
- **Done today.** The work finished in the last day.
- Each chat's agent reports its own work with a small tool the plugin gives
  it. That costs a few tokens per report, plus one short instruction at the
  start of each chat. Opening and refreshing the panel costs none.
- The agent reports only a significant piece of work: a work item, or a
  large task you asked for and are following. It does not report the steps
  inside one, a quick question, or a small chore. A chat with nothing to
  report still shows as a chat. One chat can show several pieces of work.
- A chat renamed in the sidebar shows its new name in the panel.
- A chat appears after its next message once the plugin is installed. A chat
  in a worktree under the project's `.claude/worktrees/` folder counts as
  the same project.
- It is built for the Claude Code terminal and the desktop app, on Mac and
  Windows. So far it has run in the desktop app and the terminal on Mac,
  never on Windows. It does not work in Codex.

Install it once per computer:

```bash
claude plugin install workstreams@toolkit-v2
```

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
Whatever you choose, every project gets the same five places, as files in the
project folder, for what lasts longer than one work item:

- `DECISIONS.md`: every decision and open question that more than one work
  item needs.
- `system/`: the approved description of the system, as numbered rules.
- `sources/`: the originals the project received, such as meeting notes and
  client documents.
- `delivery/`: each release, deployment, data migration, and client handoff.
- `reference/`: outside documentation, and the record of the system as it is
  today.

It shows you the plan and waits for your yes. Then it copies the starter
project's files, the skills for your answers, the hooks, and the settings
into the project. It asks you to sign in where needed (`ntn login` for Notion,
`gh auth login` for GitHub), then sets up the Notion pages, the GitHub labels,
or the Hindsight memory bank. It finishes by running its checks and offering
to commit.

Hindsight memory lives on your Hindsight server on the Hostinger VPS
(`https://memory-api.mrihm-memory.com`), one memory bank per project.
Nothing of Hindsight is installed on your Mac except Hindsight's
coding-agent add-on, which saves each session to the project's bank in
Claude Code and Codex. Setup shows you every change the add-on makes to
your Claude Code and Codex settings before it installs it. Setup then opens
the bank in the dashboard, `https://memory.mrihm-memory.com`.

Start a new session afterwards, so the new files load. In Codex, also trust
the project folder and its hooks (`/hooks`).

Later, say **"check the setup"** to see what differs (it changes nothing), or
**"update the toolkit"** to bring a project up to date. It shows every change
first and never overwrites a file you changed without asking.

## Say "toolkit v2" in any project

Say **"toolkit v2"** in a project folder and the agent works out which of
three cases the folder is, and tells you in one line:

- **A new project** (no agent files yet): it runs the setup above.
- **A project already on Toolkit V2**: it runs "update the toolkit".
- **A project set up with the older claude-toolkit, or by hand**: it moves
  the project over.

The move-over first asks the same setup questions, with answers suggested
from what the project already has. Then it reads the project and shows you
one list:

- **Delete**: old toolkit pieces that Toolkit V2 replaces or does not need.
- **Add**: the new Toolkit V2 files.
- **Update**: things you have that change, such as `AGENTS.md`, the
  settings, and your old work items and memory.
- **Kept untouched**: your code, your client files, and your own rules,
  skills, and hooks.
- **Your call**: anything it will not guess, each with a recommendation.

Every line has a one-line reason. Nothing changes until you say yes, and
nothing of yours is deleted. Your old work items and memory stay where they
are; the ones still in use are carried over into the Toolkit V2 form, and
you see the first one before the rest are done. The changes are made on the
agent's own branch and reach your main branch only after your yes.

## Skills every project gets (10)

| Skill | What it does | You might say |
| --- | --- | --- |
| `running-work-item-lifecycle` | Runs each work item from idea to Done. It works out the requirements with you one question at a time, then designs, builds, has an independent checker test the result, tidies up, and merges or deploys. It stops for your OK on the requirements, the design, the result, each merge, and Done. It saves and looks up items with `using-work-tracker`. | "help me plan this", "how should we build it", "is it ready", "ship it" |
| `filing-project-records` | Files what more than one work item needs: it records a decision in `DECISIONS.md`, files an original in `sources/`, and updates a document in `system/`. | "This decision affects several items", "file this meeting transcript" |
| `handoff` | Saves where things stand and writes a checked prompt for a new session. | "write a handoff" |
| `braindump` | Plays back a loose brain dump in simple words before any work starts. | "here's a brain dump" |
| `explain-simply` | Explains the last answer again as short, plain bullets. | "explain it like I'm five" |
| `session-summary` | Shows what you asked for in this chat and where each request landed. | "recap this chat" |
| `pull-latest` | Brings your copy of the code up to date, safely. | "get the latest" |
| `reset-to-remote` | Makes your copy an exact match of the remote copy. It deletes local changes, so it runs only when you clearly ask. | "wipe local" |
| `merge-and-clean-up` | Merges an approved pull request and removes only its branches. | "merge and clean up" |
| `publish-docs` | Saves an agreed document change straight to the main branch. | "publish the docs" |

## Skills for your choices

Each project gets the skills for where its work items and memory live:

| Your choice | Skills it adds |
| --- | --- |
| Work items in local folders | `using-work-tracker` (saves, finds, and changes items in the `work-items/` folder) |
| Work items in Notion | `using-work-tracker` (the Notion version), `using-notion-cli` (how to run Notion's command-line tool, `ntn`) |
| Work items in GitHub Issues | `using-work-tracker` (the GitHub version) |
| Memory in local files | `curating-project-memory` (keeps memory to where work stopped plus pointers to records, and writes your "from now on" instructions to the rules), `using-memory-store` (stores Current State and the pointers as files in `memory/`) |
| Memory in Notion | `curating-project-memory`, `using-memory-store` (the Notion version), `using-notion-cli` |
| Memory in Hindsight | None. Hindsight's coding-agent add-on saves each session to the project's bank, and the agent uses its save and search tools. |
| Salesforce | `sf-deploy-check`, `sf-component-tracker`, `sf-data-change`; Salesforce's own skills (`forcedotcom/sf-skills`) are installed by you, and setup checks for them |

Local memory holds where work stopped, and pointers: an ID and a link to the
record that holds the fact. It never holds a second copy of a fact. What
Notion memory and Hindsight store has not changed; that is a separate decision
for you. `using-notion-cli` comes once, even with work items and memory both
in Notion.

A project ends up with 12 skills, or 13 when work items or memory are in
Notion. With Hindsight memory it has 10, or 11 with work items in Notion. A
Salesforce project has 3 more, plus Salesforce's own skills. Saying where the work stands needs no skill: the
project's `AGENTS.md` says how. `dev/SKILL-INDEX.md` lists every skill with its exact
description.

## The hooks

| When | What happens |
| --- | --- |
| A session starts, resumes, or its context is compacted | The agent is shown Current State: a short list of what is happening now and what waits on you. With local memory, the hook first rebuilds the memory index, `memory/MEMORY.md`. When Current State is too long or older than 7 days, it asks the agent to clean it up. |
| You send any message | The agent is told to check the project's skills and use every one that fits, before it answers. |
| You say something worth keeping ("remember this", "from now on", "we decided", and similar) | A second one-line reminder names `curating-project-memory` (with Hindsight, the add-on's tools). The skill decides whether anything is saved, and asks you first. |
| After a commit | A reminder to update the work item's history and status, and Current State if it changed. |
| A helper agent starts or reports back | A reminder to update that helper's work item. |

There is no hook for marking work Done. The agent asks you first, and
records your words and the date.

## How work and memory fit together

- Every work item goes through the same States and statuses, wherever it is
  stored.
- Each work item has a Questions and Answers table. Your answer is saved the
  moment you give it, and unanswered questions stay at the top, so a new
  session picks up at the first open one.
- A decision only one work item needs is saved in that item. A decision or
  open question more than one work item needs goes in `DECISIONS.md`, and
  each item holds a one-line pointer to it.
- An item becomes Done or Cancelled only after its closing step recorded
  whether it changed `system/` or `DECISIONS.md`.
- An independent checker agent tests the work before you are asked to
  approve it. Only you mark an item Done.
- "From now on" instructions become a line in the project's
  `.claude/rules/owner-preferences.md`.
- A pointer in local memory is changed when the record it names is
  replaced, and removed when the record is gone or no later session needs
  it.
- When the agent uses something it recalled, it says where it came from and
  ends with a short Sources list.
- You can move files by hand. The agent finds work items by their ID, notices
  the move, and carries on.

## When you change the starter project

The starter project lives in this repository, in the folders under
`plugins/toolkit/skills/project-setup/assets/`. In this folder, ask an agent
to change a file there. It runs the checks and raises the toolkit's version
number. Then say **"update the toolkit"** in each project that should get the
change.

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

With Hindsight memory, the memory itself stays on your VPS, so nothing is
copied to a new Mac and there is no backup step. On a new Mac, say **"update
the toolkit"** in each Hindsight project. The agent names the server the
project uses and what this Mac is missing. After your yes, you enter the API
key yourself in Terminal, and the agent installs Hindsight's coding-agent
add-on with the same settings.

## What only you can do

The agent never does these for you. It tells you when each one is needed.

- **Sign in**: `ntn login` for Notion, `gh auth login` for GitHub, in a
  terminal.
- **Trust the project in Codex**: trust the folder the first time you open
  it, then trust its hooks with `/hooks`. Do it again after the hooks change.
- **Enter the Hindsight API key** in Terminal, with the two lines the agent
  gives you. Never paste it into the chat.
- **Sign in to the Hindsight dashboard** with its own access key, which is
  not the API key.
- **Say yes or no** to anything outside the project folder or that cannot be
  undone: new Notion pages, a GitHub repository or labels, a Hindsight
  memory bank, the Hindsight add-on's changes to your Claude Code and Codex
  settings, an install, a production deploy, or a production data load.
- **Mark work Done**, or tell the agent it may.

## Where things are

- `plugins/toolkit/`: the main plugin. Its `skills/project-setup/assets/`
  folder holds the starter project: `every-project/` (the files, skills, and
  hooks every project gets), one folder for each choice, and `settings/`.
- `plugins/workstreams/`: the workstream panel.
- `dev/`: the goal, progress, design, research, checks, and test runs. It is
  not installed anywhere.
- `ai-external-knowledge/`: saved copies of the official Claude Code, Codex,
  and Agent Skills documentation, used to build the skills and hooks. It is
  not installed anywhere.
- `AGENTS.md`: instructions for agents working on Toolkit V2 itself.

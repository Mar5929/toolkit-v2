# Toolkit V2

Toolkit V2 is a set of plugins for Claude Code and Codex. It sets up a project
folder so the agent can run the project for you. You make the decisions and
steer. The agent does the work, tracks it, and remembers what matters.

It has three parts:

- **Scaffold.** The folders and template files every project starts with, such
  as `AGENTS.md` (the project manual the agent reads), `requirements/`, and the
  work item template. The scaffold is an exact copy of your model project
  (`toolkit-v2-model-project`). Change the model, and new projects follow it.
- **Skills.** Written instructions the agent picks from, one per job. There are
  22 skills in every project and 4 more in Salesforce projects.
- **The `toolkit` command and hooks.** `toolkit` is a small program that keeps
  work items and memory in order. Hooks are steps Claude Code and Codex run by
  themselves at set moments. For example, every session starts with a short
  briefing on where the project stands.

Toolkit V2 is separate from your current toolkit (`claude-toolkit`). Installing
it changes nothing in your current projects.

## Plugins and skills

In Claude Code you can start a skill by typing `/<skill>`. In Codex you type
`$<skill>`. You rarely need to: the agent picks the skill from what you say.

Each skill has a short description that tells the agent what the skill does
and when to use it. The descriptions follow the official Claude Code and Codex
guidance, saved in `ai-external-knowledge/`. In the latest test, the agent
picked the right skill first for 74 of 76 test messages in Claude Code and 72
of 76 in Codex (`dev/test-runs/skill-routing-r3.md`).

| Plugin | Skill | What it does | You might say |
| --- | --- | --- | --- |
| `toolkit` | `project-setup` | Sets up Toolkit V2 in a project, or checks, updates, and repairs it. | "set up this project", "check the setup", "update the toolkit" |
| `work` | `work-on` | Starts, continues, or logs a piece of work, and builds it. | "build this", "keep going" |
| `work` | `work-status` | Shows what is in progress, what is blocked, and what comes next. Changes nothing. | "where are we", "what's next" |
| `work` | `work-decide` | Walks you through each decision waiting on you, one at a time. | "what do you need from me" |
| `work` | `work-requirements` | Asks you questions one at a time and writes down what the work must do. | "grill me", "check the spec" |
| `work` | `solution-design` | Works out how to build it and gives you design options to approve. | "how should we build this" |
| `work` | `work-organize` | Splits big work into sub-items, moves items, and notices folders you moved by hand. | "break it down", "put X under Y", "I moved some folders around" |
| `work` | `work-check` | Tests the finished work against every requirement, fixes what fails, and shows you the result. | "is it ready", "test it" |
| `work` | `work-finish` | Ships and closes a work item after you approve it, or cancels it. | "ship it", "mark it done" |
| `work` | `work-delegate` | Hands a goal to a team of agents, with you as the product owner. | "you drive", "take it from here" |
| `memory` | `memory-save` | Saves, corrects, or forgets one lasting fact. | "remember this", "from now on" |
| `memory` | `memory-find` | Finds what the project already knows and says where it came from. | "what did we decide", "do you remember" |
| `memory` | `memory-tidy` | Cleans up memory: merges duplicates, retires old facts, makes a backup. | "clean up memory" |
| `session-skills` | `handoff` | Writes a checked prompt a new session can start from. | "write a handoff", "I'm stopping for today" |
| `session-skills` | `session-summary` | Shows what you asked for in this chat and where each request landed. | "recap this chat" |
| `session-skills` | `braindump` | Plays back a loose brain dump in simple words before any work starts. | "here's a brain dump" |
| `session-skills` | `explain-simply` | Explains the last answer again as short, plain bullets. | "explain it like I'm five" |
| `session-skills` | `unslop` | Rewrites text so it no longer sounds machine-written. | "unslop this" |
| `git-workflows` | `pull-latest` | Brings your copy of the code up to date, safely. | "get the latest" |
| `git-workflows` | `reset-to-remote` | Makes your copy an exact match of the remote copy (for example on GitHub). It deletes local changes, so it runs only when you clearly ask. | "wipe local", "fresh start from remote" |
| `git-workflows` | `merge-and-clean-up` | Merges a pull request and removes only its branches and worktree. | "merge and clean up" |
| `git-workflows` | `publish-docs` | Saves an agreed document change straight to the main branch. The agent uses it after editing documents. | (agent use) |
| `sf-architect-solutioning` | `sf-architect-solutioning` | Answers Salesforce platform questions and plans Salesforce solutions, checking each fact against official Salesforce documentation. Salesforce projects only. | "Flow or Apex", "which Flow type" |
| (copied into Salesforce projects) | `sf-deploy-check` | Finds components that would ship with a deploy before they are ready. | (agent use) |
| (copied into Salesforce projects) | `sf-component-tracker` | Keeps the component tracker and `package.xml` files in step with the metadata. | (agent use) |
| (copied into Salesforce projects) | `sf-data-change` | Builds your package for a production data change: load file, backup, steps, and undo steps. | "load this file into production" |

Helper agents: the `work` plugin has six (`requirements-analyst`, `researcher`,
`design-architect`, `design-critic`, `builder`, `acceptance-checker`), and
`session-skills` has one (`handoff-verifier`). All of them run on Opus. Codex
plugins cannot carry agents, so in Codex the skill hands the agent's written
role to a Codex worker instead.

## Install on this Mac (one time)

A marketplace is a list of plugins. This folder is the `toolkit-v2`
marketplace. You add it once, then install its six plugins.

Both Claude Code and Codex run their own copy of each plugin, filed under its
version number. They do not read this folder directly, so a change here
reaches them only after the version goes up and the plugin is updated (see
"After a change in this folder" below).

### Claude Code

```bash
claude plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2
claude plugin install toolkit@toolkit-v2
claude plugin install work@toolkit-v2
claude plugin install memory@toolkit-v2
claude plugin install session-skills@toolkit-v2
claude plugin install git-workflows@toolkit-v2
claude plugin install sf-architect-solutioning@toolkit-v2
claude plugin enable toolkit@toolkit-v2 --scope user
```

The plugins install switched off, and that is on purpose. The last line
switches one of them, `toolkit`, on for every folder. It holds only the
`project-setup` skill and hooks that do nothing outside a Toolkit V2 project,
so "set up this project" works in any folder. The other five stay off: your
current toolkit has plugins with the same names (`session-skills`,
`git-workflows`, `sf-architect-solutioning`). Each Toolkit V2 project switches
the other Toolkit V2 plugins on, and the old ones off, in its own settings.
The two sets never load in the same project.

To check: `claude plugin list` shows `toolkit` as enabled and the other five
as disabled.

### Codex

```bash
codex plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2
codex plugin add toolkit@toolkit-v2
codex plugin add work@toolkit-v2
codex plugin add memory@toolkit-v2
codex plugin add session-skills@toolkit-v2
codex plugin add git-workflows@toolkit-v2
codex plugin add sf-architect-solutioning@toolkit-v2
node /Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit/bin/toolkit machine-setup
```

`codex plugin add` switches each plugin on for every folder. The last line,
`toolkit machine-setup`, puts that right and sets up the `toolkit` command for
Codex and your terminal:

- it switches the other five Toolkit V2 plugins off for every folder in
  `~/.codex/config.toml` and leaves `toolkit` on, and keeps every other line
  of that file;
- it writes `~/.local/bin/toolkit`, a small script that runs the installed
  toolkit, and `~/.config/toolkit-v2/plugin-root`, which names that installed
  copy. It names the copy Codex or Claude Code made at install time, not this
  folder, because other agent sessions edit this folder while they work. This
  folder is named only when neither host has a copy of the same or a newer
  version;
- it checks Node.js, Git, `ntn`, Ollama, and the Hindsight server.

Each project's own `.codex/config.toml` switches on the plugins it needs. Codex
reads a project's settings only after you trust the project folder, which Codex
asks about the first time you open it.

To check: `codex plugin list` shows the six plugins, and `toolkit version`
in a terminal prints the toolkit's version.

### After a change in this folder

Every change that should reach Claude Code or Codex raises `version` in the
plugin's two manifests (`.claude-plugin/plugin.json` and
`.codex-plugin/plugin.json`, the same number in both). Then:

```bash
claude plugin marketplace update toolkit-v2
claude plugin update <plugin>@toolkit-v2
codex plugin add <plugin>@toolkit-v2
toolkit machine-setup
```

Start a new session in each host afterwards. `toolkit machine-setup` runs last
because `codex plugin add` switches the plugin on for every folder again.

## Set up a project

Do this once per project. The folder must be a Git repository; if it is not,
setup offers to run `git init` for you.

1. Start Claude Code in the project folder and say **"set up this project"**.
2. Answer the questions. The agent asks one at a time and recommends an answer
   each time:
   - the project name;
   - where to track work: local folders, Notion, GitHub Issues, or Jira;
   - where to keep memory: the built-in `.memory/` folder, local Hindsight, or
     Notion;
   - whether it is a Salesforce project;
   - a backup folder outside the project, for example `~/Backups/toolkit`.
     Work items and built-in memory are not in Git, so they exist only on this
     Mac. The toolkit copies them to that folder by itself every time a work
     item is finished, at every handoff, and at the start of a session when a
     day has passed without a copy. It makes one folder per project per day,
     named like `acme-crm-2026-09-28`, and never deletes an old one; delete
     old day folders yourself when you no longer want them. A second copy
     (clone) of the same project gets its own day folder, with 8 extra
     letters at the end of its name, so the two never write over each other.
3. Start a new session when setup finishes, so Claude Code loads the new
   settings and the Plain English style.

Setup copies your model project's files into the folder, byte for byte. It
leaves out the parts you did not choose: `.work-items/` unless you track work
in local folders, `.memory/` unless you use built-in memory, and the
Salesforce files unless it is a Salesforce project. It keeps only the parts of
`AGENTS.md`, `README.md`, and `PROJECT.md` that match your answers, puts the
project name in their headings, lists the project's rules in `AGENTS.md`, adds
the settings for both Claude Code and Codex, and switches on the right
plugins. After that the project also works in Codex: open Codex in the folder,
trust the folder, and trust the hooks (see below).

To check or repair a project later, say **"check the setup"**.

### Notion memory

When a project keeps memory in Notion, its row in the Projects database gets a
page named "Memory". That page holds the five databases of Lore, Notion's
open-source memory system for AI agents (github.com/makenotion/lore):
Projects, Topics, Memories, Entities, and Facts. Each saved memory is one row
in Memories. The "Current focus" and "Terminology glossary" pages stay under
the project row, as before.

The agent still saves with the `toolkit memory` commands and still asks you
before it saves. Lore itself is not installed, its automatic saving and hooks
stay off, and there is no new sign-in. If you install Lore later, its tools can
read the same rows.

A project set up before this change has a single "Memory" database, and it
keeps working until `toolkit notion ensure-project` runs for that project.
That command copies each record into the new layout, reads each one back, and
renames the old database "Old memory database (safe to delete)". Nothing is
deleted. You can delete that old database yourself once you are happy.

### Starting a new project from Codex

The `toolkit` plugin is on for every Codex folder, so you can also open Codex
in a new folder and say **"set up Toolkit V2 in this project"**. Codex's
sandbox protects the `.codex/` folder, so Codex asks you once to run
`toolkit init` outside the sandbox. Or run `toolkit init` in a terminal in the
project folder first, then open Codex there, trust the folder, and say
**"finish setting up Toolkit V2"**:

```bash
toolkit init --name "Acme CRM" --tracker local --memory builtin --hosts claude-code,codex --backup-dir ~/Backups/toolkit
```

Add `--salesforce` for a Salesforce project and `--decline SOUL.md` if you do
not want a `SOUL.md`. `--backup-dir none` records that you want no backup
folder.

In Codex, Git commands that change the repository (`git add`, `git commit`,
`git worktree add`, `git merge`, `git push`, `git branch -d`) need your
approval each time: Codex's sandbox keeps `.git/` read-only, and the project's
`.codex/rules/toolkit.rules` makes Codex ask you before each one. The agent
asks for each one with escalated permissions, so the command you approve runs
outside the sandbox; an approval without escalation still runs inside it and
fails. When Codex runs with approvals turned off, it refuses these commands
without asking, and the agent shows you the exact command to run in a terminal.

## When you change your model project

Your model project is where every project file comes from. The toolkit keeps
its own copy of it in `plugins/toolkit/scaffold/model/`. The copy does not
follow your edits by itself, so after you change the model:

1. Commit your change in the model project, so the copy records which version
   it came from. (Uncommitted edits are copied too; the copy notes that they
   were not committed.)
2. In this folder, ask an agent to **"refresh the scaffold from my model"**.
   It runs `node dev/tools/import-model.mjs`, which copies the model again,
   then runs the checks. One of them sets up a test project for every mix of
   answers (24 in all) and compares each one with your model, file by file.
3. If the copy stops with a message about `CONDITIONS.json`, your change
   touched a file that installs only in some projects. For example, you
   renamed a Salesforce rule. `plugins/toolkit/scaffold/CONDITIONS.json` is
   the list of those files, and the agent updates it to match.
4. The agent raises the toolkit's version number, so Claude Code and Codex
   pick up the new copy after the update commands in "After a change in this
   folder".
5. In each existing project, say **"update the toolkit"**. The agent shows what
   would change first. It never overwrites a file you changed in that project.

Right now the toolkit copies from
`/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`,
the folder that holds the 23 changes you approved. After you merge those
changes into your model (`dev/model-changes.md` has the steps), the copy
switches to your own model folder.

## What you must do yourself

The agent never does these for you. It tells you when each one is needed.

- **`ntn login`**: signs the Notion command-line tool into your Notion account.
  It opens a browser sign-in. Needed only when the project uses Notion for work
  items or memory.
- **Trust the hooks in Codex**: open Codex in the project, type `/hooks`, and
  trust the Toolkit V2 hooks. Codex skips plugin hooks until you do. Do it again
  after the hooks change or after you move the project folder.
- **Trust the project folder in Codex**: Codex asks the first time you open it.
  Without it, Codex ignores the project's settings.
- **Say yes or no to anything that cannot be undone or costs money**: a new
  GitHub repository, a production deploy, a production data load, starting the
  Hindsight background service, and Notion pages outside the "AI Agent Second
  Brain" page.
- **Approve the toolkit commands that ask first.** In every Toolkit V2 project,
  Claude Code and Codex ask you before these run: `toolkit machine-setup`
  (changes this Mac's Codex settings and the `toolkit` command),
  `toolkit memory delete` (a memory is gone for good), `toolkit import` and
  `toolkit memory import` (they can replace work items or memory from a
  backup), and `toolkit hindsight service install` or `start` (a background
  service). Every other `toolkit` command runs without asking. In Codex, the
  agent asks for these to run outside Codex's sandbox when it asks you;
  approved inside the sandbox, they fail. The toolkit refuses these commands
  when an option such as `--json` is typed before the command words
  (`toolkit --json memory delete ...`), because the ask-first rules would not
  catch that form.

## Where things are

- `plugins/`: the six plugins. This is everything Claude Code and Codex install.
- `plugins/toolkit/scaffold/model/`: the copy of your model project that
  setup installs. Nobody edits it by hand.
- `plugins/toolkit/scaffold/CONDITIONS.json`: which model files install only
  for some answers (local work items, built-in memory, Salesforce, or one of
  Claude Code and Codex).
- `dev/tools/import-model.mjs`: the tool that copies your model project into
  the toolkit.
- `ai-external-knowledge/`: saved copies of the official Claude Code, Codex,
  and Agent Skills documentation, used to build the skills and hooks.
  `INDEX.md` lists what is there. It is not installed anywhere.
- `dev/`: the goal, the build plan, research, and test runs. It is not
  installed anywhere.
- `AGENTS.md`: instructions for agents working on Toolkit V2 itself.

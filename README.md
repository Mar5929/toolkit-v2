# Toolkit V2

Toolkit V2 sets up a project folder so the agent can run the project for you
in Claude Code or Codex. You make the decisions and steer. The agent does the
work, tracks it, and remembers what matters.

It is written instructions plus four small hooks. There is no program to
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

Its second skill, `writing-harness-files`, is for harness files: the files
that tell Claude Code or Codex how to behave. A harness file is a skill, a
rule, an `AGENTS.md` or `CLAUDE.md`, a hook, a settings file, a Codex
`.rules` file, an output style, a plugin manifest or marketplace file, a
mod, a subagent definition, or a helper-agent brief. Before an agent writes
or changes one, in any project, the skill has it read the current official
documentation page for that kind of file, follow a short checklist, and
have a second agent review the change (your decision of 2026-10-05). The
skill first sends the agent to the agents and skills that Claude Code
provides for the job, and to the official page addresses when none is
available, and always for Codex.

All the writing rules are in one place (your decision of 2026-10-06): the
rule `document-clarity-standard.md`, which every project gets. It
says that a file opens with what it is for and its goal, says things in
plain words in place of made-up project words, and uses whole sentences.
The skill holds an exact copy of that rule, so that it also works in a
folder where the toolkit was never set up. A check fails when the copy and
the rule differ.

Setup copies everything a project needs into the project itself. That way the
project works the same in Claude Code, the Codex app, and the Codex extension
in your code editor, which loads no plugins.

## Your tool list

Your tool list is the file `OUTSIDE-TOOLS.md` in this repository. It holds one
row for each kind of job you use an outside tool for, such as explainer
videos: the tool you chose, where it comes from, how to set it up, and your
choices for it. The toolkit does not ship those tools. The file is not a
skill, so the agent reads it only in a chat opened in this repository, and
setup never copies it into a project. To add a tool, say "add this to my tool
list" in a chat opened in this repository.

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
- `sources/`: the sources the project received, such as meeting notes and
  client documents.
- `delivery/`: each release, deployment, data migration, and client handoff.
- `reference/`: outside documentation, and the record of the system as it is
  today.

Every project also has `working-files/`, which Git does not track. It holds
the files the agent exports, downloads, or makes while it works, such as an
export of records or a draft, in one folder per work item. The agent
deletes a file there only when you ask.

It shows you the plan and waits for your yes. Then it copies the starter
project's files, the skills for your answers, the hooks, and the settings
into the project. It turns on a check of the project's records that runs
before each commit (a Git setting in that copy of the project; when the
project already has a Git hook of its own, or its own hooks folder, setup
changes nothing there and tells you). It asks you to sign in where needed (`ntn login` for Notion,
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

Hindsight on the VPS turns each saved session into memories with a model at
OpenAI (`gpt-5.6-terra`), through your ChatGPT subscription. So the text of
each save goes to OpenAI, and that work uses the same ChatGPT usage
allowance as your own Codex sessions. Hindsight writes every memory in
English.

Setup asks you about seven settings of the project's memory bank, in one
message, each with a default: whether Hindsight builds observations
(statements it puts together from several saved memories; on by default,
built after every save), whether every
session is saved, how much detail a save keeps (short by default), a
filter that tells Hindsight what to leave out of a saved session (by
default the live status of work, and anything true only for the moment),
what the agent is shown on
the first message of a session, how much of the Git history is saved, and
whether the code is surveyed. Say "defaults" to keep them all. The answers
are kept in the project, in `.claude/hindsight-bank-settings.json`, so
every computer uses the same ones. To change one later, tell the agent.

Start a new session afterwards, so the new files load. In Codex, also trust
the project folder and its hooks (`/hooks`).

Later, say **"check the setup"** to see what differs (it changes nothing,
except that it puts back a toolkit guide or template that is missing from
`work-items/` or `memory/`), or
**"update the toolkit"** to bring a project up to date. It shows every change
first and never overwrites a file you changed without asking. The check
before each commit is a setting of one copy of the project: in a new copy,
or on another computer, "check the setup" says it is off and "update the
toolkit" turns it on.

A project set up before the five places above existed keeps the same facts
elsewhere: shared questions, requirements, a system guide, decision records
and a glossary in memory, and sources stored inside work items. Every
other memory record stays where it is. "Update the toolkit"
finds them and shows you one table: each old location, what is in it,
where it goes, and what is removed afterwards. Nothing moves until you say
yes, and nothing is removed before what it held is read back in its new
place.

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
| `managing-work-items` | Finds each work item in the tracker you chose and takes it from idea to Done. It works out the requirements with you one question at a time, then designs, builds, has an independent checker test the result, tidies up, and merges or deploys. It stops for your OK on the requirements, the design, the result, each merge, and Done. | "help me plan this", "how should we build it", "is it ready", "ship it" |
| `filing-project-records` | Files what more than one work item needs: it records a decision in `DECISIONS.md`, files a source in `sources/`, and updates a document in `system/`. | "This decision affects several items", "file this meeting transcript" |
| `handoff` | Saves where things stand and writes a checked prompt for a new session. | "write a handoff" |
| `braindump` | Plays back a loose brain dump in simple words before any work starts. | "here's a brain dump" |
| `session-summary` | Shows what you asked for in this chat and where each request landed. | "recap this chat" |
| `filechanges` | Lists the files the agent changed in its last set of changes, each with a link that opens it and one short sentence on what changed. | `/filechanges` (in Codex, `$filechanges`), "what files did you change?" |
| `pull-latest` | Brings your copy of the code up to date, safely. | "get the latest" |
| `reset-to-remote` | Makes your copy an exact match of the remote copy. It deletes local changes, so it runs only when you clearly ask. | "wipe local" |
| `merge-and-clean-up` | Merges an approved pull request and removes only its branches. | "merge and clean up" |
| `publish-docs` | Saves an agreed document change straight to the main branch. | "publish the docs" |

## Skills for your choices

Each project gets one work skill. Setup copies into it only the reference files for the work tracker you chose. Local and Notion memory add one memory skill; setup copies into it only the reference files for the memory store you chose.

| Your choice | What setup adds |
| --- | --- |
| Work items in local folders | Local tracking references inside `managing-work-items`, plus `work-items/` and `PROJECT-ROADMAP.md` |
| Work items in Notion | Notion tracking references inside `managing-work-items`, plus `using-notion-cli` |
| Work items in GitHub Issues | GitHub tracking references inside `managing-work-items` |
| Memory in local files | `managing-project-memory` with local storage references, plus `memory/` |
| Memory in Notion | `managing-project-memory` with Notion storage references, plus `using-notion-cli` |
| Memory in Hindsight | No Toolkit memory skill (your decision of 2026-10-05). Hindsight's coding-agent add-on saves each session to the project's bank and brings its own skill and tools. One project rule says what the project still keeps in its own files. |
| Salesforce | `sf-deploy-check`, `sf-component-tracker`, `sf-data-change`; Salesforce's own skills (`forcedotcom/sf-skills`) are installed by you, and setup checks for them |

`using-notion-cli` is installed once when either choice uses Notion. Each selected reference has the same file name in every project, such as `references/work-tracker.md` or `references/memory-store.md`. A project receives only one version of each file. The skills do not contain local-versus-Notion setup conditions.

Memory is the design you built from the Davis memory system, brought back on
2026-10-05. It holds Current State (what is in progress, what is coming up,
who owes what, the standing jobs and shared files, and where the next session
starts) and one record per concept, in four kinds: facts about people
(`user_`), facts about the project or the client that fit no other file
(`project_`), where to find something (`reference_`), and what happened or a
job that ran (`event_`). Every record carries the date it was created, the
date it last changed, and, when it is true only for a while, a date to check
or remove it. Memory no longer holds decisions, terms, or how the system
works: those are in `DECISIONS.md` and `system/`. Notion memory stores the
same kinds in Lore's layout. `using-notion-cli` comes once, even with work
items and memory both in Notion.

A project with local or Notion memory has 11 skills, or 12 when work items
or memory are in Notion. With Hindsight memory it has 10, or 11 when work
items are in Notion. A Salesforce project adds three Toolkit Salesforce skills;
the owner also installs Salesforce's own skills.
When you ask where the work stands, the project's `AGENTS.md` routes the
agent to the work and memory skills for the records it reads.
`dev/SKILL-INDEX.md` lists every skill with its exact
description.

## The hooks

| When | What happens |
| --- | --- |
| A session starts, resumes, or its context is compacted | The agent is shown Current State: a short list of what is happening now and what waits on you. With local memory, it is also shown the memory index: one line per memory record, which the hook rebuilds in `memory/MEMORY.md`. When Current State is too long or older than 7 days, it asks the agent to clean it up. |
| You send any message | The agent is told to check the project's skills and use every one that fits, before it answers. It is also shown the whole text of the rule `.claude/rules/evaluate-the-owners-request.md` again. The hook reads that file each time, so a change to that one file changes what the agent is shown. |
| You say something worth keeping ("remember this", "from now on", "we decided", and similar) | A second one-line reminder names `managing-project-memory` (with Hindsight, the project rule `.claude/rules/hindsight-memory.md`). The skill decides whether anything is saved and where. The agent saves it without asking you first, and tells you in one line what it saved. |
| After a commit | A reminder to update the work item's history and status, and Current State if it changed. |
| A helper agent starts or reports back | A reminder to update that helper's work item. |
| The agent edits a file | The record check runs: 15 checks on the form of `DECISIONS.md`, `system/`, `sources/`, and local work items, such as an ID used twice or a rule marked approved with no decision behind it. The agent is told what is wrong and fixes it. |
| The agent finishes a turn (Claude Code only) | The record check runs on every record. A problem nobody fixed is reported again. |
| Before each commit | The record check runs again, and a commit that breaks a record or changes a filed source is stopped. |

The record check is the fourth hook command (your yes of 2026-10-05). It
only reads. It checks the form of a record, never whether what it says is
right.

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
- A small work item takes a short path. The agent judges from your request
  whether the work is small: a job it can play back to you in one reply and
  build without an interview, a design, or a split into parts. The agent
  plays the goal back to you, and your yes approves the requirements.
  Your yes to one question at the end approves the result and marks the
  item Done. For a small work item, the checker runs only when the result
  changes production, changes an environment other people use, gives a
  number, a list of records, or a finding to someone outside the project,
  or builds or changes what a rule in `system/` says.
- A project with no planned phases, such as ongoing support for a client,
  gets one phase, "Ongoing support", that stays open.
- "From now on" instructions become a line in the project's
  `.claude/rules/owner-preferences.md`.
- Before it acts on a request, the agent slows down and works out the goal
  behind it. When the request changes how something works, it tells you in
  one line what it thinks the goal is. It looks at what the system is for
  and at the whole process of the people who use it, and not only at the
  part you named. It tells you first when it sees a better way, a case you
  did not cover, or something the request would break, and what would have
  to change to get to the best way. When there is more than one reasonable
  way, it shows you each option with what it gains and what it costs, and
  you choose. The rule
  `.claude/rules/evaluate-the-owners-request.md` says so, and every project
  gets it. A hook shows the agent this rule again on every message you
  send. The line the hook prints above the rule says that a line in your
  `owner-preferences.md` wins where it says otherwise.
- An action item from a meeting is saved as a project task with who owes
  it: you, the agent, or a named other person, such as the client or a
  vendor.
- The agent keeps the project's records without being asked. When something
  changes what is true, it puts each new fact where it belongs, corrects
  every record the change made wrong, and tells you in one line what it
  saved. It asks you only when it cannot tell which of two things is true,
  or before a step on the "Ask the owner first" list in the project's
  `AGENTS.md`.
- A fact that fits no other file, such as who is away or what the client
  plans, is a memory record. A fact that is true only for a while is
  checked or removed on its date.
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
copied to a new Mac. The VPS has weekly automatic backups at Hostinger, and
the toolkit adds no backup step of its own. On a new Mac, say **"update
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
- **Look after the Hindsight server**: its backups, its updates, and its
  sign-in to ChatGPT. When a save fails because that sign-in stopped
  working, the agent tells you, and you sign Hindsight in again on the VPS.
- **Say yes or no** to anything outside the project folder or that cannot be
  undone: new Notion pages, a GitHub repository or labels, a Hindsight
  memory bank, the Hindsight add-on's changes to your Claude Code and Codex
  settings, an install, a production deploy, or a production data load.
- **Mark work Done**, or tell the agent it may.

## Where things are

- `OUTSIDE-TOOLS.md`: your tool list ("Your tool list" above).
- `plugins/toolkit/`: the main plugin, with its two skills in `skills/`.
  The `skills/project-setup/assets/` folder holds the starter project:
  `every-project/` (the files, skills, and hooks every project gets), one
  or more folders for each choice, and `settings/`.
- `plugins/workstreams/`: the workstream panel.
- `reference/how-the-owner-works-with-agents.md`: what you ask agents to do
  in your real projects, in your own words, one section per project. It is
  not installed anywhere.
- `reference/davis-memory-system.md`: how memory is kept in your Davis
  project: its files, hooks, and rule, and the 32 kinds of event that start
  its memory helper. It is not installed anywhere.
- `dev/`: the goal, progress, design, research, checks, and test runs. It is
  not installed anywhere.
- `ai-external-knowledge/`: saved copies of the official Claude Code, Codex,
  and Agent Skills documentation, used to build the skills and hooks. It is
  not installed anywhere.
- `AGENTS.md`: instructions for agents working on Toolkit V2 itself.

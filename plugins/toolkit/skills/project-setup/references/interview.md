# The setup interview

Purpose: what to check before asking, the five questions for a new project
with their recommendations, and the plan the owner says yes to before any
file is written.

Ask one question per message, in this order, each with a recommendation and
its main reason. When the folder already answers a question, confirm it in
one line instead.

## Contents

- Look before asking
- Question 1: the name and the owner
- Question 2: where work items live
- Question 3: where memory lives
- Question 4: Salesforce
- Question 5: SOUL.md
- The plan to confirm

## Look before asking

Run each command alone. None of them changes anything.

| Check | Command | What it tells you |
| --- | --- | --- |
| A Git repository | `git rev-parse --show-toplevel` | No repository: the hooks and skills need Git. Offer `git init`; if he says no, stop and say why. It prints a folder other than this one (compare `pwd -P`): this folder sits inside another repository. Stop: Toolkit V2 is set up at a repository's root, because the hooks and skills find `.claude/hooks/`, `work-items/`, and `memory/` from the Git root. Recommend setting up the root, or `git init` here only when this folder is its own project. |
| A linked worktree | `git worktree list --porcelain` (its first line, `worktree <path>`, is the main checkout), compared with `git rev-parse --show-toplevel` | They differ: this session runs in a linked worktree. Stop before copying anything. Setup must run in the main checkout, `<path>`, because `memory/` and `work-items/` are Git-ignored and live only there, and the setup commit must land on the default branch. Ask him to start the setup session in that folder. |
| The owner's name | `git config user.name` | The name to suggest in question 1. |
| A GitHub remote | `git remote -v` | Name it when you ask question 2. |
| Code already here | `ls -a` | Name the language and framework you see. |
| Salesforce | `sfdx-project.json` present | Confirm Salesforce in one line instead of asking question 4. |
| An earlier setup | `PROJECT.md` with a filled "Toolkit settings" section | Already set up: go back to SKILL.md, "Pick the path". |
| The retired program | `.toolkit.json` present | Stop and tell the owner (SKILL.md, "Pick the path"). |
| An older claude-toolkit setup | `knowledge/`, `.memory/`, `.work-items/`, files in `.claude/rules/`, or a `CLAUDE.md` with more than `@AGENTS.md` | Tell him what you found. Toolkit V2 adds its own files and turns the older toolkit's plugins off in this project. It never moves or deletes the old files; ask before touching them. |

## Question 1: the name and the owner

Suggest the project's name and, as the owner, the name from
`git config user.name`. The name goes into the headings of `AGENTS.md`,
`README.md`, and `PROJECT.md`. The owner is the person named in `PROJECT.md`
who makes the project's decisions.

## Question 2: where work items live

Recommend local folders with Obsidian: the fastest, they work offline, and
they need no sign-in.

| Choice | "Tracker" value | Good when | What to know |
| --- | --- | --- | --- |
| Local folders with Obsidian | `local` | A solo project on one computer | Items live in `work-items/`, which Git ignores, so they exist only on this computer. The whole project folder opens as an Obsidian vault. |
| Notion | `notion` | He wants the board on his phone or the web | Needs `ntn` signed in. The project's pages are made from the "Project" template in his Notion Projects database. |
| GitHub Issues | `github` | The code already lives on GitHub | Needs `gh` signed in and a GitHub repository. Labels are created once, after his yes. An item's ID is its issue number, such as `#12`. |

Jira is not offered: it is not built yet (the owner deferred it). If he
asks for Jira, say so and recommend one of the three above.

With local folders, confirm the ID prefix in one line (IDs look like
`WI-001`; keep `WI`?). With Notion, the Notion setup proposes the prefix
later (`notion.md` in this folder), because Notion allows each prefix in
only one database of a workspace.

## Question 3: where memory lives

Recommend local memory with Obsidian: it is private, fast, and needs no
server.

- When work items are in Notion, recommend Notion memory instead, so work
  and memory sit together, link to each other, and he can read both on his
  phone.
- Offer Hindsight by name, for search by meaning across many memories. It
  is the owner's Hindsight server on his VPS; nothing is installed on this
  Mac except Hindsight's coding-agent add-on.
- When he picks Hindsight, explain that setup in plain words from
  `hindsight-on-vps.md` in this folder ("What runs where"), then ask whether
  to create a separate memory bank for this project (or use the one this
  project already has); recommend yes. A no: ask question 3 again.

| Choice | "Memory" value | Good when | What to know |
| --- | --- | --- | --- |
| Local with Obsidian | `local` | Most projects | Files in `memory/`, which Git ignores, on this computer only. With local work items, memories link items as `[[WI-031]]`. |
| Notion, in Lore's layout | `notion` | Work items are in Notion, or he reads memory on his phone | A Memory page holding Lore's databases, plus "Current state" and "Terminology glossary" pages. Needs `ntn` signed in. |
| Hindsight | `hindsight` | Many memories, and search by meaning matters | His Hindsight server on the VPS, one memory bank per project, never Hindsight Cloud. Hindsight's coding-agent add-on, installed once on this computer, saves each session to the bank. No memory skills: the agent uses the add-on's tools. Current State is the local file `memory/CURRENT_STATE.md`. |

Any mix of work tracking and memory works, for example Notion work items
with local memory.

## Question 4: Salesforce

Skip the question when `sfdx-project.json` answered it. Otherwise recommend
no when the file is absent. A yes adds the Salesforce rules and skills, the
org guards, and the `delivery/` folder. Setup then checks that Salesforce's
own skills are installed (`salesforce.md` in this folder).

For a Salesforce project, ask for the org aliases, one question per
message. Show the aliases on this computer first with `sf org list` (it
only reads).

1. The sandbox the agents may deploy to for testing. Recommend an alias
   only when its name matches this project or the owner said it is this
   project's. When none of the listed orgs is for this project, recommend
   "none yet" (`salesforce.md` in this folder, "The org aliases"). In
   Codex, he runs those deploys himself.
2. Production. Agents never deploy there or change its data; the guards
   block it and hand him the command instead.

The API version comes after the plan, in step 7, as its own question when it
cannot be read (`salesforce.md` in this folder, "The API version").

## Question 5: SOUL.md

`SOUL.md` is a short page on how he likes the agent to work with him.
Recommend not now.

- Yes: keep it in the setup copy and fill it with his words while finishing
  (`finishing.md` in this folder).
- No: leave it out of the setup copy.

## The plan to confirm

After the answers, say in a few lines what will happen, and wait for his
yes. Start with his answers in one short line: the name and the owner,
where work items live (with the ID prefix for local folders; with Notion it
is asked later), where memory lives, Salesforce (and the org aliases), and
`SOUL.md`. Say that you will copy the model project's files for his choices
into this folder, add the skills and the 3 small hook commands (give the
skill count), and turn the older claude-toolkit plugins off for this
project only. Name every thing that will be created outside the project
folder:

| Choice | Say |
| --- | --- |
| Notion (work, memory, or both) | "make this project's pages in your Notion from the Project template in your Projects database" (and, when it does not exist yet, ask about building it separately: `notion.md` in this folder) |
| GitHub Issues | "create the work item labels in <owner>/<repository> that it does not have yet (up to 30: each item's State, type, priority, who it waits on, who builds it, and your approvals; its other labels stay as they are)", and "create the private repository <owner>/<name>; after the setup commit I'll ask before I push the default branch to it" when there is none yet |
| Hindsight | "create the memory bank <bank> on your Hindsight server (or use this project's own bank), and install Hindsight's coding-agent add-on for Claude Code and Codex, or add this project to it; that changes files in `~/.claude`, `~/.codex`, and `~/.hindsight`, and I'll show you each change before I make it" |
| Local work and local memory | "nothing outside this folder" |

Skill counts: 9 shared, plus 1 for the work tracking set, plus 2 for local
or Notion memory (none for Hindsight), plus 1 for Notion work items or
memory (`using-notion-cli`, once), plus 3 for Salesforce.

His yes covers exactly what the plan names. Anything else created outside
the folder later needs its own yes.

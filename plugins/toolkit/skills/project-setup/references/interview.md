# The setup interview

This file is the interview for a new project. It gives the checks to run before the first question, the five questions with the answer to recommend for each, and the plan that the owner says yes to. Open it at steps 1 and 2 of "New project" in `SKILL.md`. The interview is done when the owner has answered the five questions and has said yes to the plan. No file is written before that yes.

Ask one question per message, in the order of this file. Give each question a recommendation and the main reason for it. When the folder already answers a question, confirm the answer in one line and do not ask the question.

## Contents

- Look before asking
- Question 1: the name and the owner
- Question 2: where work items are kept
- Question 3: where memory is kept
- Question 4: Salesforce
- Question 5: SOUL.md
- The plan to confirm

## Look before asking

Run every check in the table before you ask the first question. Run each command alone. None of the commands changes anything.

| Check | Command, or what to look for | What it tells you |
| --- | --- | --- |
| A Git repository | `git rev-parse --show-toplevel`, compared with `pwd -P` | It tells you whether this folder is a Git repository, and whether this folder is the root of that repository. When there is no repository, or the command prints a folder other than this one, do what the list for this check under the table says. |
| A linked worktree | `git worktree list --porcelain`, compared with `git rev-parse --show-toplevel` | It tells you whether this session runs in the main checkout. The main checkout is the project's main folder, and it is the first line of the first command: `worktree <path>`. When `<path>` and the folder that the second command prints differ, this session runs in a linked worktree, which is a separate folder with its own branch. In that case, do what the list for this check under the table says. |
| The owner's name | `git config user.name` | It prints the name to suggest as the owner in question 1. |
| A GitHub remote | `git remote -v` | When it prints a GitHub remote, name that remote when you ask question 2. |
| Code already here | `ls -a` | Name the language and the framework that you see. |
| Salesforce | Look for `sfdx-project.json`. | When the file is present, confirm Salesforce in one line and do not ask question 4. |
| An earlier setup | Look in `PROJECT.md` for a filled "Toolkit settings" section. | When the section is filled, the project is already set up. Go back to `SKILL.md`, "Which setup job to do", which says what to do with a project that is already set up. |
| An earlier setup that is not Toolkit V2 | Look for any file that `SKILL.md`, "Which setup job to do", lists as a sign of an earlier setup to move over, such as `AGENTS.md`, `.work-items/`, or `.toolkit.json`. | When one of those files is there, this is not a new project. Go back to `SKILL.md`, "Which setup job to do", which names the file to follow for a move. |
| A folder of the project's own with a name setup uses | `ls system sources delivery reference` | It tells you whether one of these four folders already holds a file. A folder that is missing gives an error line, and that error line is the result you want. Go on only when none of the four folders lists a file. When one of them lists a file, do what the list for this check under the table says. |

For the check "A Git repository", do one of these things:

- When there is no repository, offer `git init`, because the hooks and skills need Git. If the owner says no, stop and say why.
- When the command prints a folder other than this one, this folder sits inside another repository. Stop. Toolkit V2 is set up at the root of a repository, because the hooks and skills find `.claude/hooks/`, `work-items/`, and `memory/` from the Git root. Recommend setting up the root. Recommend `git init` in this folder only when this folder is its own project.

For the check "A linked worktree", do these things when this session runs in a linked worktree:

- Stop before you copy anything. Setup must run in the main checkout, `<path>`, for two reasons. `memory/` and `work-items/` are Git-ignored and are kept only there. The setup commit must also be on the default branch.
- Ask the owner to start the setup session in that folder.

For the check "A folder of the project's own with a name setup uses", do these things when one of the four folders lists a file:

- Stop, and copy nothing. Setup would put the folder's `AGENTS.md` into that folder. The command that checks the records, `.claude/hooks/validate-records.mjs`, would then read every file in `system/` and `sources/` as a record, and it would stop the setup commit and every later commit to those files.
- Name the folder and how many files it holds, and ask the owner: "This project already has `<folder>/`. Rename it, or move its files, before setup?"
- Go on only when none of the four folders lists a file.

## Question 1: the name and the owner

Suggest the project's name. As the owner, suggest the name that `git config user.name` printed.

- The project's name goes into the headings of `AGENTS.md`, `README.md`, and `PROJECT.md`.
- The owner is the person named in `PROJECT.md` who makes the project's decisions.

## Question 2: where work items are kept

Recommend local folders with Obsidian, because they are the fastest, they work offline, and they need no sign-in.

| Choice | "Tracker" value | Good when | What to know |
| --- | --- | --- | --- |
| Local folders with Obsidian | `local` | The project is a solo project on one computer. | Work items are kept in `work-items/`, which Git ignores, so they exist only on this computer. The whole project folder opens as an Obsidian vault. |
| Notion | `notion` | The owner wants the board on a phone or on the web. | This choice needs `ntn` signed in. The project's pages are made from the "Project" template in the owner's Notion Projects database. |
| GitHub Issues | `github` | The code is already kept on GitHub. | This choice needs `gh` signed in and a GitHub repository. Setup creates the labels once, after the owner's yes. A work item's ID is its issue number, such as `#12`. |

Jira is not offered, because it is not built yet (the owner deferred it). If the owner asks for Jira, say so and recommend one of the three choices above.

The ID prefix of the work items depends on the choice:

- When the owner chooses local folders, confirm the ID prefix in one line: say that IDs look like `WI-001`, and ask whether to keep `WI`.
- When the owner chooses Notion, the Notion setup proposes the prefix later, because Notion allows each prefix in only one database of a workspace. `notion.md` says how the Notion setup proposes the prefix.

## Question 3: where memory is kept

Recommend local memory with Obsidian, because it is private, fast, and needs no server.

- When work items are in Notion, recommend Notion memory in place of local memory. Work and memory then sit together and link to each other, and the owner can read both on a phone.
- Offer Hindsight by name, for search by meaning across past sessions. Hindsight here is the owner's Hindsight server on the owner's VPS. Nothing is installed on this Mac except Hindsight's coding-agent add-on.
- When the owner picks Hindsight, do two things in this order:
  1. Explain that setup in plain words. Take the facts from `hindsight-on-vps.md`, "What runs where", which lists what runs on the server and what runs on this computer.
  2. Ask whether to create a separate memory bank for this project (or to use the one this project already has), and recommend yes. A memory bank is one project's store of memory on the Hindsight server. When the owner says no, ask question 3 again.

Memory holds two things. The first is where the project stands now. That part is called the project's Current State: the project's one short page of what is true now. The second is what no other project file holds: facts about people and the client, where to find things, and what happened. Decisions, terms, sources, and the description of the system are never memory. With every choice, they are files in the repository.

| Choice | "Memory" value | Good when | What to know |
| --- | --- | --- | --- |
| Local with Obsidian | `local` | Most projects. | Memory is Markdown files in `memory/`, which Git ignores. The files are on this computer only. They are the project's Current State, and one file per subject. The session-start hook shows the project's Current State and one line per file. |
| Notion, in Lore's layout | `notion` | Work items are in Notion, or the owner reads memory on a phone. | Memory is a "Current state" page, and a Memory page that holds Lore's databases, where each subject is a page. A session is shown only the "Current state" page at its start, and it searches the pages when it needs them. This choice needs `ntn` signed in. |
| Hindsight | `hindsight` | Search by meaning across past sessions matters. | Memory is on the owner's Hindsight server on the VPS, with one memory bank per project, and never on Hindsight Cloud. Hindsight's coding-agent add-on, installed once on this computer, saves each session to the bank. The project gets no memory skills: the agent uses the add-on's tools. The project's Current State is the local file `memory/CURRENT_STATE.md`. |

Lore's layout, in the second row, is the set of Notion databases that Notion memory uses.

Any mix of the work tracking choice and the memory choice works, for example work items in Notion with local memory.

## Question 4: Salesforce

When `sfdx-project.json` answered this question, skip the question. When the file is absent, ask the question and recommend no.

When the answer is yes, the project gets the Salesforce rules and skills, the org guards, `tools/`, and the Salesforce templates inside `delivery/`. Setup then checks that Salesforce's own skills are installed. `salesforce.md`, "Salesforce's skills", says how to check and what to tell the owner when they are not installed.

For a Salesforce project, ask for the org aliases, one question per message. Before the first of these questions, show the aliases on this computer with `sf org list`, which only reads.

1. Ask for the sandbox that the agents may deploy to for testing.
   - Recommend an alias only when its name matches this project or the owner said it is this project's.
   - When none of the listed orgs is for this project, recommend "none yet". `salesforce.md`, "The org aliases", says what to write in that case and how the aliases are written in `PROJECT.md`.
   - In Codex, the owner, and not the agent, runs those deploys.
2. Ask for production. Agents never deploy to production or change its data. The guards block both and give the owner the command to run.

The API version comes after the plan, in step 7 of "New project" in `SKILL.md`. It is a question of its own when the version cannot be read. `salesforce.md`, "The API version", says how to read the version and what to ask when it cannot be read.

## Question 5: SOUL.md

`SOUL.md` is a short page about how the owner likes the agent to work with the owner. Recommend not now.

- When the owner says yes, the setup copy gets `SOUL.md`, and you fill it with the owner's words while finishing. The setup copy is the project's finished files, built in a temporary folder before anything is put into the project. `finishing.md`, "SOUL.md", says how to fill the page.
- When the owner says no, the setup copy has no `SOUL.md`.

## The plan to confirm

After the owner has answered the questions, say in a few lines what will happen, and wait for the owner's yes. The plan holds these parts:

- Start with the owner's answers in one short line: the name and the owner, where work items are kept (with the ID prefix for local folders; with Notion the prefix is asked later), where memory is kept, Salesforce (and the org aliases), and `SOUL.md`.
- Say that you will copy the project files for the owner's choices into this folder, with the skills and the 4 small hook commands, for both Claude Code and Codex (setup writes `.codex/` in every project, with no question). Give the skill count. The end of this section says how to count the skills.
- Say that you will turn on the check of the project's records before each commit (the Git setting `core.hooksPath`, in this copy of the repository).
- Say that you will turn the older claude-toolkit plugins off for this project only.
- Say that every project gets `DECISIONS.md`, `system/`, `sources/`, `delivery/`, and `reference/` as files in this folder, whatever the owner chose.
- Name every thing that will be created outside the project folder. The table gives the words to say for each choice.

| Choice | Say |
| --- | --- |
| Notion (work, memory, or both) | "make this project's pages in your Notion from the Project template in your Projects database" |
| GitHub Issues | "create the work item labels in <owner>/<repository> that it does not have yet (up to 30: each item's State, type, priority, who it waits on, who builds it, and your approvals; its other labels stay as they are)" |
| GitHub Issues, when there is no GitHub repository yet | Also say "create the private repository <owner>/<name>; after the setup commit I'll ask before I push the default branch to it" |
| Hindsight | "create the memory bank <bank> on your Hindsight server (or use this project's own bank), and install Hindsight's coding-agent add-on for Claude Code and Codex, or add this project to it; that changes files in `~/.claude`, `~/.codex`, and `~/.hindsight`, and I'll show you each change before I make it" |
| Local work and local memory | "nothing outside this folder" |

For the row "Notion (work, memory, or both)": when the Project template does not exist yet, ask about building it as a separate question. `notion.md`, "The owner's yes before anything is made", gives the words of that question.

To give the skill count, add the numbers that apply to the owner's choices: 10 shared, plus 1 for the work tracking choice, plus 2 for local or Notion memory (none for Hindsight), plus 1 for Notion work items or memory (`using-notion-cli`, once), plus 3 for Salesforce.

The owner's yes covers exactly what the plan names. Anything else that is created outside the folder later needs its own yes.

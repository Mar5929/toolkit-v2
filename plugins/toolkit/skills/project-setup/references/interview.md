# The setup interview

Purpose: what to check before asking, and the exact wording of the six setup
questions for a new project, each with its recommendation.

## Contents

- Rules for every question
- Look before asking
- Question 1: the project name
- Question 2: where work is tracked
- Question 3: where memory lives
- Question 4: Salesforce
- Question 5: SOUL.md
- Question 6: the backup folder
- After the answers

## Rules for every question

- One question per message, in the reply text, never through a question tool.
- Each question carries a recommendation and its main reason, so the owner
  can answer "yes" and move on.
- Ask in the order below. A question the repository already answers is
  confirmed in one line instead of asked.
- Record each answer on its checklist line in the plan tool as soon as it is
  given, for example `- [x] tracker: local`. A later turn may start without
  this skill loaded, and the plan tool keeps the answers until init runs.

## Look before asking

Check these first, without asking:

- Is this folder a Git repository? (`git rev-parse --show-toplevel`.) No
  repository: say so and offer `git init`. Toolkit V2 finds the project, the
  tracker, and memory through Git.
- Is the repository empty, or does it already hold code? Name the language
  and framework you see.
- `sfdx-project.json` present: this is a Salesforce project. Confirm it in one
  line instead of asking question 4.
- `.toolkit.json` present with `"toolkit": "toolkit-v2"`: this is a repair,
  not a new setup (`repair-and-update.md` in this folder).
- Files from an older toolkit setup (for example a `knowledge/` folder, or a
  `CLAUDE.md` with more than the line `@AGENTS.md`): tell the owner what you
  found. Toolkit V2 adds its own files and turns the older toolkit's plugins
  off for this project. It does not move or delete the old files. Ask before
  touching them. A file the project already has is kept, never overwritten.
- The owner name: `git config user.name`.
- `ntn whoami` (only for Notion): signed in or not. In Codex, run it outside
  the sandbox (`wiring-notion.md` in this folder, step 1); inside it, the
  check fails even when the owner is signed in.
- `toolkit hindsight health`: the local server answers or not. Run it
  before the memory question, so the question offers Hindsight only when it
  answers (Question 3).

## Question 1: the project name

Confirm the name, key, id prefix, and owner in one line:

> I'll call this project "Acme CRM" (short key `acme-crm`, work item ids `WI-001`, `WI-002`, owner Mike). Is that right?

- The key is the name in lower case, with words joined by hyphens. It names
  the Hindsight memory bank and appears in the Notion page title.
- The id prefix is `WI` unless the owner wants another (for example `ACME`).
  Another prefix is set right after init, before any item exists.

## Question 2: where work is tracked

> Where should work items live? I recommend local folders on this computer: they are the fastest, work offline, and need nothing else set up. Choose Notion if you want to see and change the board on your phone or the web. GitHub Issues and Jira are possible, but the toolkit only gives written instructions for them.

| Choice | `--tracker` | Good when | What to know |
| --- | --- | --- | --- |
| Local folders | `local` | A solo project on one computer | Items live in `.work-items/`, which Git ignores. They stay on this computer and are backed up to the backup folder (question 6). |
| Notion | `notion` | The owner wants the board on his phone or the web | Needs `ntn` signed in. Each project gets its own Work Items database under the "AI Agent Second Brain" page. |
| GitHub Issues | `github` | The code and the team already live in GitHub | No driver: agents follow written instructions with `gh`. Labels are created once, with a yes. |
| Jira | `jira` | A client requires Jira | No driver: agents follow written instructions with the Jira tool the owner connects. |

## Question 3: where memory lives

> Where should the project's memory live? I recommend the built-in `.memory/` folder: it is private, fast, and needs no server.

Offer Hindsight by name only when `toolkit hindsight health` answered (Look
before asking): "Hindsight is running on this Mac; choose it if you want
search by meaning across many memories." When it did not answer, say that
Hindsight would need to be installed first, and that the install downloads
about 13 GB (`installing-hindsight.md` in this folder).

When the tracker is Notion, recommend Notion instead: "I recommend Notion, so
work and memory sit together and you can read both on your phone."

| Choice | `--memory` | Good when | What to know |
| --- | --- | --- | --- |
| Built-in `.memory/` | `builtin` | Most projects | Files in the main checkout, Git-ignored, on this computer only. Backed up to the owner's backup folder. |
| Local Hindsight | `hindsight` | Many memories, and search by meaning matters | The local server at `127.0.0.1:8888` must be running (a background service on this Mac). One memory bank per project. Never Hindsight Cloud. |
| Notion | `notion` | The tracker is Notion, or the owner reads memory on his phone | The project's Memory page in Notion, in the layout of Lore (Notion's open-source AI memory): the records are rows of its Memories database. Needs `ntn` signed in. |

## Question 4: Salesforce

Skip the yes-or-no question when `sfdx-project.json` answered it; confirm in
one line instead.

> Is this a Salesforce project? I recommend no, because I found no `sfdx-project.json`. A yes adds the Salesforce rules, the deploy and data-change skills, the protected-org guards, and the `delivery/` folder.

For a Salesforce project, ask for the org aliases, one question at a time.
Show the aliases on this computer first (`sf org list`, a read-only command):

> Which org alias is the sandbox the agents may deploy to for testing (in Codex you run those deploys yourself)? I see `acme-uat` and `acme-dev`; I recommend `acme-uat`.

> Which org alias is production? Agents never deploy there or change its data; the guards block it and hand you the command instead. I see `acme-prod`.

## Question 5: SOUL.md

> Do you want a SOUL.md that tells the agent how you like to work? I recommend skipping it for now; you can add it later.

A no goes to init as `--decline SOUL.md`, so the file is never installed and
no later sync brings it back. A yes: fill it with his words after init
(`finishing-setup.md` in this folder).

## Question 6: the backup folder

`.work-items/` (local tracker), `.memory/` (built-in memory), and Hindsight
memory exist only on this computer. Ask where their automatic backups go:

> Where should backups of the work items and memory go? I recommend `~/Backups/toolkit`: one folder outside every project, which your computer's own backup already covers. Each project gets its own dated folder inside it.

- The answer goes to init as `--backup-dir <folder>`: a full path starting
  with `/` or `~/`, outside the project. Init refuses a folder inside it.
- "No backups" goes to init as `--backup-dir none`.
- With a Notion tracker and Notion memory, nothing lives only on this
  computer: skip this question.

With the folder set, `toolkit work finish` and every handoff back up by
themselves.

## After the answers

Say what will happen in three or four lines, then run init:

> I'll now copy the model scaffold and apply your answers: the project's folders and files from the model project, AGENTS.md with only the parts for your choices, the rules, and the settings; turn on the Toolkit V2 plugins for this project only (and turn the older toolkit's plugins off here); set up local folders for work and built-in memory. Nothing outside this folder changes.

Adjust the last part to the answers (for example "build the Notion Work Items
database under your AI Agent Second Brain page"). Running init, and what it
installs: `running-init.md` in this folder.

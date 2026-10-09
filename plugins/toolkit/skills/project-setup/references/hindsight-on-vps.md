# Hindsight on the VPS

Use this file for a project whose memory is kept in Hindsight. It says how the owner's Hindsight is set up, what must be true when a project is set up for it, and which defaults to offer the owner. Open it to set up a Hindsight project, to check one, to connect a new computer, to open a project's dashboard, or when a knowledge page of the bank failed to build.

The file gives no commands. Work each command out from Hindsight's documentation at `https://hindsight.vectorize.io`, and from the add-on's own skill, `hindsight-coding-agent`, once the add-on is installed in Claude Code. Show the owner each change outside the project folder before you make it.

## How the owner's Hindsight is set up

- Hindsight runs on the owner's own server, a VPS. The API is `https://memory-api.mrihm-memory.com`, and the dashboard is `https://memory.mrihm-memory.com`. A bank's page in the dashboard is `https://memory.mrihm-memory.com/banks/<bank ID>`.
- Each project has one bank. A bank is one project's memory store on the server. Its ID is on the "Hindsight bank" line of `PROJECT.md`, section "Toolkit settings".
- Hindsight does its model work with a model at OpenAI, through the owner's ChatGPT subscription. So the text of each save goes to OpenAI, and that work uses the owner's ChatGPT usage allowance. Hindsight writes every memory in English.
- On this computer, Hindsight's coding-agent add-on (`@vectorize-io/hindsight-coding-agents`) connects Claude Code and Codex to the bank. This file calls it the add-on. The add-on is installed once per computer. Its settings are in `~/.hindsight/coding-agent.json`, and the same file holds the API key.
- By the server's own setting, Hindsight builds observations only on request. An observation is a statement that Hindsight forms from several saved records. A bank builds observations after every save only when the bank's own settings turn that on.
- The add-on brings its own skill and its own tools for searching and saving. A Hindsight project gets no memory skill from the toolkit. The project's rule `.claude/rules/hindsight-memory.md` says what the agent saves.
- The project's Current State stays in the local file `memory/CURRENT_STATE.md`. The project's Current State is the project's one short page of what is true now.
- The server is the owner's. Reach it only through the API address. When the server is down or slow, or reports a failure that only a change on the server can fix, stop and tell the owner what you saw.

## Projects with their own review of saved knowledge

Four of the owner's projects have an approved review, in Notion and Lore, of knowledge before it is saved: Entrevest, Diligence Ready, CentraView, and Robin. When the project is one of them, tell the owner so before the owner picks Hindsight, and give the owner the link to those projects' rules for saved knowledge: `https://app.notion.com/p/3e8a27b433e481c3bb83e05a5002c105`. Create no bank until the owner says yes.

## What must be true when setup is done

Go through this list in order. For each line, check whether it is already true, and do only what is missing.

1. The server answers at `/health`, and the API key is in the add-on's settings file. The owner enters the key in the owner's own Terminal window, never in the session. Give the owner a command that asks for the key without showing it and writes it to that file together with the server's address.
2. The owner has said which defaults to keep ("The defaults, and the one question to the owner" below).
3. The project has its own bank on the server. Before you create a bank, list the banks, and ask the owner about a bank that already has the ID you would use. Create the bank with its name and nothing else.
4. The three Hindsight lines of `PROJECT.md`, section "Toolkit settings", hold the bank's ID, the API address, and the link to the bank's page.
5. The add-on is installed for Claude Code and Codex, and its settings name the owner's server. The add-on is switched on only in the folders that its settings list, and it maps the project's main checkout to the bank. The main checkout is the first path that `git worktree list` prints. The owner's choices for the bank are in the add-on's settings, under the bank's ID.
6. The bank on the server shows the owner's choices.
7. The setup's test text comes back in a search of the bank. Save one short test text once: at the first setup, or in the next session when the bank was not prepared at setup. In every later check, only search for it, and save nothing.
8. The project's rule `.claude/rules/hindsight-memory.md`, section "What this project saves in Hindsight", says what the owner chose.

Three steps are the owner's, and the report at the end of setup names them: to trust the add-on's hooks in Codex with `/hooks`, to start a new session, and to sign in to the dashboard, which asks for its own access key.

## The defaults, and the one question to the owner

These are the owner's defaults for a new bank. Show them to the owner in one message, in plain words, and ask: "Do you want these defaults?" Change only what the owner names. A project may differ from the defaults in any way the owner asks for.

- **Nothing is saved by itself.** The add-on does not save sessions. The agent saves a record on purpose, as the project's rule `hindsight-memory.md` says.
- **A record is stored as it was written.** The add-on's setting for the detail of a save is `verbatim`. With the add-on's own default, Hindsight splits one record into several short memories.
- **The Git history is not imported, and the code is not surveyed.** An agent can read both itself.
- **Observations are on, and Hindsight builds them after every save.**

Every other setting stays as the add-on ships it, unless the owner asks for a change.

When the owner wants the add-on to save sessions by itself in a project, add the owner's filter paragraph below to the end of the add-on's instruction for saving a session, in the bank, after the words `OWNER FILTER FOR THIS PROJECT:`. Without the paragraph, the bank fills with the live status of work. With `verbatim`, the model picks no facts, so the paragraph leaves nothing out. So also ask the owner about the detail of a save.

```text
extract NO fact for (1) the live status of work — what was merged, pushed, committed, opened, closed, released, or removed, and what is waiting on a review or a reply — because Git and the work items already hold it; (2) anything true only for the moment, such as a next step, work in progress, or who is handling something right now; (3) a summary of what the assistant reported, found, or listed, unless the user then DECIDED something from it, and then record only the decision with its reason. When a conversation holds only such content, extract nothing at all. Keep: decisions with their reason, rules and conventions that were set, and problems with how they were resolved.
```

## Mistakes to avoid

- Never open or show `~/.hindsight/coding-agent.json` whole, and never print the API key. Read the file with a command that leaves the key out, such as `jq 'del(.. | .apiToken?)'`. The key opens every bank on the server, so read and write only this project's bank.
- Name the owner's server in every install and in the add-on's settings. With no server named, the add-on sends saves to Hindsight Cloud. Never use Hindsight Cloud, and never install Hindsight or a model for it on this computer.
- Put the bank's own settings into the add-on's settings before, or in the same step as, the entry that switches the add-on on for the folder. The add-on prepares a bank when its job first runs for the folder, at the start of a session there, with the settings that it finds at that moment. When the bank is not prepared by the end of setup, name lines 6 and 7 of the list above as open in the report, and check them in the next session.
- Write no instruction for the model into a new bank, and send a setting to the server only after the add-on has prepared the bank. The add-on writes its own instructions, which Hindsight calls missions, only into a bank that holds none. When it prepares a bank, it can also turn observations on, whatever the owner chose.
- Install the add-on only for Claude Code and Codex. Never have it import past sessions unless the owner asks.
- Never add a `hindsight` server to the project's `.mcp.json` or `.codex/config.toml`. A project server with that name replaces the add-on's server in that project.
- Change a setting of a bank, build observations, or rebuild a knowledge page only when the owner asks. Each one uses the owner's ChatGPT allowance.

## Knowledge pages

A knowledge page is a summary page that Hindsight writes from the bank's records. The add-on shows the pages to the agent at the start of a session. The model writes each page, and the owner's server gives a page a limited time to be written. When the server is busy with other model work, a page can run out of time, and its build fails. After a failed build, Hindsight does not build that page again by itself.

So when the bank reports that a page's last build failed, tell the owner. After the owner's yes, rebuild each page whose build failed, one at a time, and wait for each build to finish before you start the next. When builds keep failing, the time limit on the server is too short for the owner's model. Raising that limit is the owner's step on the server.

## Check a Hindsight project, or connect a new computer

For "check the setup", for "update the toolkit", and on a new computer, go through "What must be true when setup is done", and report each line that is not true. In "check the setup", fix nothing. In an update and on a new computer, fix a line only after the owner's yes.

The memory stays on the server, so nothing is copied to a new computer. The owner enters the key there, and the add-on gets the project's folder and the bank's settings again.

Also look at the bank's knowledge pages, as "Knowledge pages" above says.

## Open the dashboard

Read the link from the "Hindsight dashboard" line of `PROJECT.md`, and open it for the owner. Tell the owner that the dashboard asks for its own access key, which is not the API key, and that signing in is the owner's step.

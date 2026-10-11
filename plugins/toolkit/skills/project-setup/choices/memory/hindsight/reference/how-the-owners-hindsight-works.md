# How the owner's Hindsight works

Read this file before you set up a project's Hindsight bank, or when you need to know where Hindsight runs and how an agent reaches it. `hindsight-setup.md`, one folder up, gives the steps.

## Where it runs

- Hindsight runs on the owner's own server, a VPS. The API is `https://memory-api.mrihm-memory.com`.
- The dashboard is `https://memory.mrihm-memory.com`. A bank's page in the dashboard is `https://memory.mrihm-memory.com/banks/<bank ID>`. The dashboard asks for its own access key, which is not the API key.
- Each project has one bank. A bank is one project's memory store on the server. The memory stays on the server, so nothing is copied when the owner works on another computer.
- Hindsight does its model work with a model at OpenAI, through the owner's ChatGPT subscription. So the text of each save goes to OpenAI, and that work uses the owner's ChatGPT usage allowance.

The add-on's API credential connects the agent to Hindsight. Hindsight's provider login lets the service process memory through OpenAI. These are separate connections. Use [the recommended service settings](hindsight-server-settings.md) to check persistent, service-only Codex authentication, operation models, capacity, and backup ownership. Shared-service administration affects other projects; a project's bank interview does not authorize unrelated service changes.

## How an agent reaches it

- On this computer, Hindsight's coding-agent add-on (`@vectorize-io/hindsight-coding-agents`) connects Claude Code and Codex to the bank. The toolkit's files call it the add-on.
- The add-on's settings are in `~/.hindsight/coding-agent.json`. The same file holds the API key.
- The add-on brings its own skill, `hindsight-coding-agent`, and its own tools for searching and saving. So a Hindsight project gets no memory skill from the toolkit.
- The toolkit's files give no commands. Work each command out from Hindsight's documentation at `https://hindsight.vectorize.io`, and from the add-on's skill once the add-on is installed.

## What Hindsight does with what it is sent

- Hindsight turns a save into facts. A fact is one short statement.
- Hindsight forms observations from the facts. An observation is a statement that Hindsight forms from several facts.
- Hindsight writes knowledge pages. A knowledge page is a summary page on one subject, such as the project's components or its key decisions.
- At the start of a session, the add-on gives the agent a short summary of what the bank holds about the owner's message. After that, the agent searches the bank with the add-on's tools.
- Hindsight is a record of the past. The project's own files, the work items, and Git say what is true now.

Generated summaries, observations, and knowledge pages can omit details or repeat mistaken or superseded claims. They supply evidence for the agent to verify, and do not establish current status or permission. [Memory-flow verification](hindsight-verification.md) checks processing and actual host behavior separately from content accuracy.

## Rules that hold in every step

- Never open or show `~/.hindsight/coding-agent.json` whole, and never print the API key. Read the file with a command that leaves the key out, such as `jq 'del(.. | .apiToken?)'`. The key opens every bank on the server, so read and write only this project's bank.
- Name the owner's server in every install and in the add-on's settings. With no server named, the add-on sends saves to Hindsight Cloud.
- Write `optInOnly` into the add-on's settings before the add-on is installed. Until it is there, the add-on saves the sessions of every folder on the computer.
- Never add a server named `hindsight` to the project's `.mcp.json` or `.codex/config.toml`. A project server with that name replaces the add-on's server in that project.
- Change a bank, build observations, or rebuild a knowledge page only when the owner asks. Each one uses the owner's ChatGPT allowance.

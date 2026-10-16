# The owner's Hindsight connection and the project's bank

Use this to confirm how agents reach the owner's Hindsight server and which bank the project uses. Setup is done with this part when each intended host reaches one recorded, stable bank ID that the owner confirmed. [hindsight-setup.md](../hindsight-setup.md) gives the order of the setup steps.

## Rules that hold in every step

- Never open or show `~/.hindsight/coding-agent.json` whole, and never print the API key. Read the file with a command that leaves the key out, such as `jq 'del(.. | .apiToken?)'`. The key opens every bank on the server, so read and write only this project's bank.
- Name the owner's server in every install and in the add-on's settings. With no server named, the add-on sends saves to Hindsight Cloud.
- Write `optInOnly` into the add-on's settings before the add-on is installed. Until it is there, the add-on saves the sessions of every folder on the computer.
- Never add a server named `hindsight` to the project's `.mcp.json` or `.codex/config.toml`. A project server with that name replaces the add-on's server in that project.
- Change a bank, build observations, or rebuild a knowledge page only when the owner asks. Each one uses the owner's ChatGPT allowance.

## Where Hindsight runs

- Hindsight runs on the owner's own server, a VPS. The API is `https://memory-api.mrihm-memory.com`.
- The dashboard is `https://memory.mrihm-memory.com`. A bank's page in the dashboard is `https://memory.mrihm-memory.com/banks/<bank ID>`. The dashboard asks for its own access key, which is not the API key.
- A bank is one memory store on the server. The memory stays on the server, so nothing is copied when the owner works on another computer.
- Hindsight does its model work with a model at OpenAI, through the owner's ChatGPT subscription. So the text of each save goes to OpenAI, and that work uses the owner's ChatGPT usage allowance.

The add-on's API key connects the agent to Hindsight. Hindsight's own provider login lets the service process memory through OpenAI. These are separate connections, so a healthy API does not prove that processing works. [The service settings](hindsight-server-settings.md) cover the provider login and the rest of the shared service.

## How an agent reaches it

- Hindsight's coding-agent add-on (`@vectorize-io/hindsight-coding-agents`) connects Claude Code and Codex to the bank. The toolkit's files call it the add-on.
- The add-on's settings are in `~/.hindsight/coding-agent.json`. The same file holds the API key.
- The add-on brings its own skill, `hindsight-coding-agent`, and its own tools for searching and saving. Hindsight's documentation is at `https://hindsight.vectorize.io`.

## What Hindsight does with what it is sent

- Hindsight turns a save into facts. A fact is one short statement.
- Hindsight forms observations from the facts. An observation is a statement that Hindsight forms from several facts.
- Hindsight writes knowledge pages. A knowledge page is a summary page on one subject, such as the project's components or its key decisions.
- At the start of a session, the add-on gives the agent a short summary of what the bank holds about the owner's message. After that, the agent searches the bank with the add-on's tools.
- Hindsight is a record of the past. The project's own files, the work items, and Git say what is true now. Generated summaries, observations, and pages can omit details or repeat mistaken or superseded claims.

## Choose the bank

Offer one bank for the project, shared by the project's Claude Code and Codex sessions. A normal memory query searches one bank, so knowledge stored in another bank does not follow the project.

When the owner wants knowledge shared beyond the project, agree which projects, agents, and people may use it before offering a shared bank. Keep distinct customer, access, and untrusted-content boundaries in separate banks. Record the agreed scope. A bank separates stored knowledge; check the service's access controls separately.

Use tags for useful distinctions within an approved bank. Tags select information for a query but do not restrict access. Check the installed tools' tag-filter behavior before relying on it, including whether untagged records are included. Preserve the add-on's source, harness, and knowledge tags.

Choose the boundary by what knowledge the owner wants shared. Do not split or merge banks to fix slowness.

## Keep the bank ID stable

Read the bank ID recorded in `PROJECT.md` before configuring a host, and use it for every session, host, and checkout of this project. Update the computer's `mapPathToBank` entries when the project moves or is connected on another computer, and keep the recorded bank ID. Check that linked worktrees resolve to it. Never derive the bank from a session ID.

Before a write can create a bank, confirm that the resolved ID is the bank the owner intends. When retrieval is empty or the bank is missing, inspect routing, filters, and the existing records before proposing a new bank.

Routing to a different bank changes where future reads and writes go; it does not move the old records. A split, merge, or change of bank is separate migration work. Show the source, destination, sharing effects, treatment of existing records, and verification, and apply it only with the owner's approval. Keep the old records until their handling is approved and verified.

## Record and check the result

Record the bank ID, what its memory covers, who or what shares it, and any approved tag convention under `PROJECT.md`'s "Toolkit settings", as [what Hindsight adds to a project](what-hindsight-adds-to-a-project.md) lists. Read back the effective route from each intended host and from a representative checkout, including a linked worktree when the project uses one.

## Sources for bank choices

Read the current documentation when configuring routing or filters, and check support in the installed server and add-on.

| Source | What it establishes |
| --- | --- |
| [Hindsight bank-strategy article](https://hindsight.vectorize.io/blog/2026/07/16/bank-strategy-agent-memory) | Banks set recall boundaries; tags organize information within a bank. Session-scoped or unstable bank IDs fragment memory. |
| [Memory-banks API](https://hindsight.vectorize.io/developer/api/memory-banks) | Banks are separate stores. Writes create missing banks; reads of a missing bank return `404`. |
| [Coding Agents bank resolution](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/README.md#bank-resolution) | `mapPathToBank` takes precedence, its longest matching prefix wins, and linked worktrees inherit their main checkout's mapping. |
| [Recall tag filters](https://hindsight.vectorize.io/developer/api/recall#tags) | Non-empty `any` and `all` filters include untagged records. Strict modes exclude them for a non-empty filter; an empty tag list ordinarily means no filter. |
| [Reflect tag filters](https://hindsight.vectorize.io/developer/api/reflect#tags) | Filtering also applies to reflection. Untagged directives remain global even with strict tag filtering. |

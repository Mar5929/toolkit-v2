# Hindsight

Purpose: what setup does when memory lives in Hindsight: the project's
memory bank on the local server, the limit on its tools, the MCP entries
both hosts use, and the settings line.

A Hindsight project has no memory skills. The agent uses Hindsight's own
`retain`, `recall`, and `reflect` tools on the project's bank, tags each
memory `wi:<ID>` for its work items, and keeps Current State in the local
file `memory/CURRENT_STATE.md`. The model's memory rule
(`.claude/rules/memory-review-and-save.md`, "Hindsight projects") says how.

## Contents

- The server
- Choose and create the bank
- Limit the bank's tools
- Connect Claude Code and Codex
- The settings line
- Check
- Gotchas

## The server

Hindsight runs only on this Mac, at `http://127.0.0.1:8888`: never in
Hindsight Cloud, never in Docker.

```text
curl -s -m 2 http://127.0.0.1:8888/health
```

- `"status":"healthy"`: go on.
- No answer: check the background service with
  `launchctl print gui/$(id -u)/local.toolkit-v2.hindsight`.

  - It prints the service: it is installed but stopped. Ask the owner, then
    `launchctl kickstart -k gui/$(id -u)/local.toolkit-v2.hindsight`, and
    check health again after about 10 seconds.
  - It says it could not find the service: it is not installed.
    `installing-hindsight.md` in this folder.
- Hindsight saves and summarizes with the local model `gpt-oss:20b` through
  Ollama. When Ollama is not running, tell the owner; it runs as a Homebrew
  service. After his yes, run `brew services start ollama`, or he runs it
  himself.

In Codex, the name check and creation in "Choose and create the bank" are
one escalated command: its two `curl` calls run together.

## Choose and create the bank

One bank per project. The bank id is stored once, in `PROJECT.md`, and never
worked out again from the folder name: the owner may move or rename the
folder.

1. Pick the id: the project name in lower case, words joined by hyphens,
   starting with a letter, for example `acme-crm`. Only letters, digits, and
   hyphens; never `/`, which breaks the MCP address.
2. Check the name is free and create the bank in one command, so the
   creation runs only when the name is free:

   ```text
   code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8888/v1/default/banks/<bank>/config); echo "$code"; [ "$code" = 404 ] && curl -s -X PUT http://127.0.0.1:8888/v1/default/banks/<bank> -H 'Content-Type: application/json' -d '{"reflect_mission":"Memory for the <Project name> project.","retain_mission":"Keep project-wide decisions, lasting project facts, references, and lessons for <Project name>. Ignore chit-chat, live status, secrets, and personal data."}'
   ```

   Run it as one command. `404` followed by the new bank's details means
   the name was free and the bank now exists. When it prints `200`, another
   project has the name and nothing was created: add `-2`, `-3`, and so on,
   and run it again. Any other number: nothing was created; check the
   server ("The server"). Never send the PUT on its own, and never reuse
   another project's bank.

## Limit the bank's tools

The agent gets no delete tools: the owner removes a memory himself, in
Hindsight's own interface. Set the bank's tool list:

```text
curl -s -X PATCH http://127.0.0.1:8888/v1/default/banks/<bank>/config -H 'Content-Type: application/json' -d '{"updates":{"mcp_enabled_tools":["retain","sync_retain","recall","reflect","list_memories","get_memory","list_tags","list_documents","get_document","list_operations","get_operation","get_bank"]}}'
```

The body must wrap the fields in `"updates"`. The list leaves out every
`delete_`, `clear_`, `invalidate_`, and `update_` tool, and the mental
model, directive, and knowledge page tools. It can only narrow the server's
own list, never widen it.

## Connect Claude Code and Codex

Both hosts use the single-bank address `http://127.0.0.1:8888/mcp/<bank>/`.
Tools reached there cannot touch another project's bank.

Claude Code: `.mcp.json` at the project root. When the file exists, add the
`hindsight` entry under its `mcpServers`.

```json
{
  "mcpServers": {
    "hindsight": {
      "type": "http",
      "url": "http://127.0.0.1:8888/mcp/<bank>/",
      "timeout": 300000
    }
  }
}
```

Codex: add this table to `.codex/config.toml` (in Codex, with escalated
permissions):

```toml
[mcp_servers.hindsight]
url = "http://127.0.0.1:8888/mcp/<bank>/"
tool_timeout_sec = 300
startup_timeout_sec = 20
enabled_tools = ["retain", "sync_retain", "recall", "reflect", "list_memories", "get_memory", "list_tags", "list_documents", "get_document", "list_operations", "get_operation", "get_bank"]
```

- Saving and answering take 10 to 30 seconds with the local model, and
  longer when the model is not loaded yet: the long timeouts allow for that.
- Never run `codex mcp add` or `claude mcp add --scope user`: both write the
  owner's machine-wide settings and would send every project to one bank.

## The settings line

Fill this line in `PROJECT.md`, section "Toolkit settings":

```text
- Hindsight bank: `<bank>`
```

Current State is `memory/CURRENT_STATE.md`, which the setup copy kept from
the model. It is never stored in Hindsight.

## Check

```text
curl -s http://127.0.0.1:8888/v1/default/banks/<bank>/config | jq '.overrides.mcp_enabled_tools'
jq '.mcpServers.hindsight.url' .mcp.json
grep -A4 'mcp_servers.hindsight' .codex/config.toml
```

- The first lists the tools above.
- The other two name this project's bank.
- One `recall` call answers (an empty result is fine). This check waits for
  the owner's next session, because the hosts load the `hindsight` server
  at session start: list it in the report under what was skipped, as not
  checked yet. Never `retain` a test memory: memory is saved only on the
  owner's own words.

## Gotchas

- Never install Hindsight's `hindsight-coding-agents` add-on or its
  `hindsight-memory` plugin. They default to Hindsight Cloud, change the
  owner's machine-wide settings, and save whole chat transcripts without
  asking.
- Never run `hindsight-local-mcp`: it starts a second, separate database.
- `retain` is asynchronous; `sync_retain` waits until the memory is stored.

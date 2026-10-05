# Hindsight on the VPS

Purpose: memory in Hindsight. What runs where, what an agent never does on
the server, the access key, setting up a project's bank and Hindsight's
coding-agent add-on, the save-and-search check, opening the dashboard,
checking a Hindsight project, and a new computer.

## Contents

- What runs where
- The server is the owner's
- The access key
- Set up a project
  - 1. The server and the key
  - 2. The bank
  - 3. The settings lines
  - 4. The add-on
  - 5. Save and search
  - 6. Open the dashboard
- Open the dashboard
- Check a Hindsight project
- A new computer
- A project on the old Mac server
- Gotchas

## What runs where

On the server:

- The owner's Hostinger VPS runs four services with Docker Compose, from
  one folder, `/opt/hindsight`: the database (PostgreSQL), Ollama with its
  model, Hindsight, and Caddy. Ollama on the VPS turns saved text into
  memories. Never install Hindsight or Ollama on this Mac, never use
  Hindsight Cloud, and never ask for an OpenAI key.
- DNS sends two addresses to the VPS. Caddy accepts HTTPS for both and
  passes each one to Hindsight: the API address and the dashboard address.
- Only ports 22, 80, and 443 of the VPS are open. The ports of the
  database, of Ollama, and of Hindsight itself are not public.
- The API is `https://memory-api.mrihm-memory.com`. Every call except
  `/health` needs the API key, sent as `Authorization: Bearer <key>`.
- The dashboard is `https://memory.mrihm-memory.com`. It asks for its own
  access key, separate from the API key, and the owner signs in himself. A
  bank's page is `https://memory.mrihm-memory.com/banks/<URL-encoded bank ID>`.
- One memory bank per project. Its ID is on the "Hindsight bank" line of
  `PROJECT.md`, "Toolkit settings".
- The server has observations turned off (`GET /version` shows
  `"observations":false`).
- The memory lives only on the VPS. The VPS has weekly automatic backups at
  Hostinger. The toolkit adds no backup step, and nothing of the memory is
  copied to this Mac.

On this computer:

- Hindsight's coding-agent add-on (`@vectorize-io/hindsight-coding-agents`)
  connects Claude Code and Codex to the bank. It is installed once per
  computer: three hooks in `~/.claude/settings.json` and three in
  `~/.codex/hooks.json`, a user-level MCP server named `hindsight` in each
  host, its own skill `hindsight-coding-agent` in `~/.claude/skills/`, its
  program in `~/.hindsight/coding-agents/` (it updates itself once a day),
  and its settings in `~/.hindsight/coding-agent.json`.
- The add-on gives the agent eight tools: they search and read the bank's
  knowledge pages and memory, save a document or the plan of new work into
  the bank, and report the add-on's own state. Its skill and the guide it
  shows the agent at session start say when to use each tool; the toolkit
  repeats neither.
- The settings map each Hindsight project's folder to its bank
  (`mapPathToBank`) and switch the add-on off in every other folder
  (`optInOnly` with `optInPaths`).
- In a mapped folder the add-on works by itself:
  - it saves the session to the bank at the end of every turn;
  - at session start it shows the agent the bank's knowledge pages and the
    guide to its tools, and on the first message of a session it adds a
    short summary from memory;
  - it fills a new bank from the Git history, and keeps five knowledge
    pages in the bank up to date;
  - it surveys the code with the host's own command line on a new bank and
    again every 20 commits (Claude Code: model haiku, at most US$2 a
    survey).
- When the add-on recalls memories, it asks only for observations unless
  told otherwise, and the server makes none. So its settings ask for the
  `world` and `experience` types. Its bank template turns observations on
  for a bank, so its settings also set
  `defaultBankConfig.enable_observations` to `false`.
- Current State stays in the local file `memory/CURRENT_STATE.md`.

## The server is the owner's

- An agent never signs in to the VPS, never runs a command on it, and never
  changes its files, its DNS records, or its firewall. Everything in this
  file reaches the server only through the API address.
- When the server needs work (it is down, slow, out of space, or needs a
  newer Hindsight), stop and tell the owner what you saw. The work is his.
- Never run `docker compose down -v` on the server, and never give the
  owner that command: `-v` deletes the volumes that hold the database and
  the model.
- Bringing back a backup is the owner's step in Hostinger.

## The access key

The key lives in the `apiToken` field of `~/.hindsight/coding-agent.json`,
the add-on's settings file, readable only by the owner (permissions 600).
The add-on's hooks and MCP server read that file however the host was
started. The Claude desktop app and the Codex app may not read shell
startup files such as `~/.zshrc`, so a key kept only there can be missing
in them. The commands in this file read the key from the same file. The
file is outside every repository.

The owner enters it himself, in his own Terminal window, never in the chat.
Give him these two lines (zsh, the Mac's default shell); the second one
asks for the key and shows nothing while he types or pastes it. It writes
the server address with the key: with no server named, the add-on sends
saves, with this key, to Hindsight Cloud.

```text
mkdir -p ~/.hindsight; [ -s ~/.hindsight/coding-agent.json ] || echo '{}' > ~/.hindsight/coding-agent.json
read -rs "HS_KEY?Hindsight API key: " && echo && HS_KEY="$HS_KEY" jq '.apiToken = env.HS_KEY | .serverMode = "self-hosted" | .apiUrl = "https://memory-api.mrihm-memory.com" | .optInOnly = true' ~/.hindsight/coding-agent.json > ~/.hindsight/coding-agent.json.new && chmod 600 ~/.hindsight/coding-agent.json.new && mv ~/.hindsight/coding-agent.json.new ~/.hindsight/coding-agent.json; unset HS_KEY
```

Check that it is there; this prints only `true` or `false`:

```text
jq '(.apiToken // "") | length > 0' ~/.hindsight/coding-agent.json
```

Fallback, only when he does not want the key in that file: first give him
the first line and the second line with everything about the key taken out
(the `read` part, `HS_KEY`, and `.apiToken = env.HS_KEY |`), so the file
names the VPS. Only after that does he add
`export HINDSIGHT_API_TOKEN='<key>'` to `~/.zshenv` himself. The add-on reads
that variable when the file has no `apiToken`, but only in hosts started
from a shell that read it. In the commands below, use `$HINDSIGHT_API_TOKEN`
in place of `$(jq -r .apiToken ~/.hindsight/coding-agent.json)`.

## Set up a project

Run each command alone. Codex: `SKILL.md`, Gotchas.

`<auth>` below stands for
`-H "Authorization: Bearer $(jq -r .apiToken ~/.hindsight/coding-agent.json)"`.
Write it out in full in each command, exactly so, and never the key itself.
`<main checkout>` is the first path `git worktree list` prints.

### 1. The server and the key

```text
curl -s -m 10 https://memory-api.mrihm-memory.com/health
```

- `"status":"healthy"`: go on.
- Anything else: stop. The VPS is down or cannot be reached, and only the
  owner can fix it. Never offer a server on this Mac instead.

Then check the key ("The access key"). `false`, or no such file: give him
the two lines and wait; check again after he says it is done.

### 2. The bank

1. Look for this project's own bank in both places: the "Hindsight bank"
   line of `PROJECT.md` when it holds a bank ID (a setup that stopped, or a
   changed memory choice), and the add-on's map. The line holds no ID when
   it holds its prompt or `not used`:

   ```text
   jq -r --arg p '<main checkout>' '.mapPathToBank[$p] // empty' ~/.hindsight/coding-agent.json
   ```

   Both hold an ID and they differ: show both, each with its fact count and
   last write (the list in step 3), and ask which one is this project's
   bank.

2. Neither has one: pick an ID from the project name, in lower case, words
   joined by hyphens, starting with a letter, only letters, digits, and
   hyphens, at most 63 characters, for example `acme-crm`.
3. List the banks whose ID or name contains it:

   ```text
   curl -s -m 20 <auth> 'https://memory-api.mrihm-memory.com/v1/default/banks?q=<bank>&limit=100' | jq -c '.detail // [.banks[] | {bank_id, name, fact_count, last_write_at}]'
   ```

   Also list with `q=coding-agent::<name of the main checkout's folder>`: an
   add-on that ran here before this setup saved the folder to a bank with
   that ID. When one shows, ask whether it is this project's bank before
   you create one.

   | It prints | Do |
   | --- | --- |
   | "Authentication failed" | The key is wrong: he enters it again ("The access key"). |
   | The exact ID, which step 1 found | Use it. |
   | The exact ID, which step 1 did not find | Show him its name, fact count, and last write, and ask whether it is this project's bank. Yes: use it. No: add `-2`, `-3`, and so on, and list again. |
   | No exact ID, but step 1 found one | That bank was deleted. Tell him; create it again only after his yes. |
   | No exact ID | Create it (step 4). |

   Check a bank with this list, never with
   `GET /v1/default/banks/<bank>/config`: older servers answer `200` there
   for a deleted bank.
4. Create it. Leave any `'` out of the project name in the body:

   ```text
   curl -s -m 30 -X PUT <auth> -H 'Content-Type: application/json' https://memory-api.mrihm-memory.com/v1/default/banks/<bank> -d '{"name":"<Project name>","reflect_mission":"Memory for the <Project name> project.","retain_mission":"Keep project-wide decisions, lasting project facts, references, and lessons for <Project name>. Ignore chit-chat, live status, secrets, and personal data."}' | jq -c '{bank_id, name}'
   ```

   A `PUT` to an existing ID changes that bank's name and missions: send it
   only for an ID the list showed free. Then run the list again; the ID must
   be in it.

### 3. The settings lines

Fill these lines in `PROJECT.md`, "Toolkit settings":

```text
- Hindsight bank: `<bank>`
- Hindsight server: `https://memory-api.mrihm-memory.com`
- Hindsight dashboard: `https://memory.mrihm-memory.com/banks/<bank>`
```

An ID with a character other than a letter, digit, or hyphen is encoded in
the link: `jq -rn --arg b '<bank>' '$b|@uri'`.

### 4. The add-on

1. Look. Each of these only reads:

   ```text
   command -v node npx
   jq 'del(.. | .apiToken?)' ~/.hindsight/coding-agent.json
   grep -c 'coding-agents' ~/.claude/settings.json ~/.codex/hooks.json
   claude mcp get hindsight | grep -E '^[[:space:]]*(Scope|Type|Command|Args):'
   grep -A3 '^\[mcp_servers.hindsight\]' ~/.codex/config.toml | grep -E '^(command|args) ='
   jq -r '.plugins // {} | keys[] | select(startswith("hindsight-memory@"))' ~/.claude/plugins/installed_plugins.json
   ls -d ~/.hindsight/codex
   grep -c '.hindsight/codex/' ~/.codex/hooks.json
   ```

   - No `node` or `npx`: stop. Installing Node is the owner's step.
   - An older Hindsight integration (a `hindsight-memory@...` plugin in
     Claude Code, or the old Codex one: `~/.hindsight/codex/` or hooks that
     name it): it would save every session a second time, into another
     bank. Show it to him. After his yes, remove it:
     `claude plugin uninstall <name>`, and the old Codex handlers in
     `~/.codex/hooks.json`, shown to him first.
   - The add-on is installed when each hooks file counts 3 or more and both
     MCP entries run `mcp-server.js` from `coding-agents`.
2. Show him exactly what will change, and ask:
   - `~/.hindsight/coding-agent.json`: the settings below, with this
     project's folder and bank.
   - Only when the add-on is not installed yet: the files and entries in
     "What runs where" (hooks, MCP servers, its skill, its program). The
     installer keeps a copy of each file it changes the first time, as
     `<file>.hindsight-backup`. Codex runs hooks only with its hooks
     feature on, under `[features]` in `~/.codex/config.toml`. The
     installer adds that section when the file has none. The key is
     `hooks`; the older key `codex_hooks`, which the add-on's own
     documentation names, still works.
3. After his yes, write the settings first, so the installer never falls
   back to Hindsight Cloud:

   ```text
   jq --arg p '<main checkout>' --arg b '<bank>' '.serverMode = "self-hosted" | .apiUrl = "https://memory-api.mrihm-memory.com" | .optInOnly = true | .optInPaths = ((.optInPaths // []) + [$p] | unique) | .mapPathToBank = ((.mapPathToBank // {}) + {($p): $b}) | .recallOptions = ((.recallOptions // {}) + {types: ["world", "experience"]}) | .defaultBankConfig = ((.defaultBankConfig // {}) + {enable_observations: false})' ~/.hindsight/coding-agent.json > ~/.hindsight/coding-agent.json.new && chmod 600 ~/.hindsight/coding-agent.json.new && mv ~/.hindsight/coding-agent.json.new ~/.hindsight/coding-agent.json
   ```

4. Not installed yet: install it for both hosts (for one host, name only
   that one):

   ```text
   npx -y @vectorize-io/hindsight-coding-agents install claude-code codex --server self-hosted --api-url https://memory-api.mrihm-memory.com
   ```

   When it prints that a line must be added under an existing
   `[features]` section, add the line it names to `~/.codex/config.toml`
   after his yes.
5. Check:
   - `jq 'del(.. | .apiToken?)' ~/.hindsight/coding-agent.json` shows
     `serverMode` `self-hosted`, the API address, `optInOnly` `true`, the
     main checkout in `optInPaths`, the main checkout mapped to the bank in
     `mapPathToBank`, `recallOptions.types` `["world","experience"]`, and
     `defaultBankConfig.enable_observations` `false`.
   - The look in step 1 now finds the add-on installed.
   - The project has no `hindsight` server of its own: `.mcp.json` has no
     `mcpServers.hindsight`, and `.codex/config.toml` has no
     `[mcp_servers.hindsight]`.
6. His steps: in Codex, trust the add-on's hooks with `/hooks`; start a new
   session in each host, because both load hooks and MCP servers at session
   start.

### 5. Save and search

This proves the server, the key, and the bank. The fixed `document_id`
makes a second run replace the first save:

```text
curl -s -m 30 -X POST <auth> -H 'Content-Type: application/json' https://memory-api.mrihm-memory.com/v1/default/banks/<bank>/memories -d '{"items":[{"content":"Toolkit V2 set up the <Project name> project on <YYYY-MM-DD>. Its memory is the Hindsight bank <bank>.","context":"Toolkit V2 setup check","document_id":"toolkit-setup-check"}],"async":true}' | jq -r '.operation_id // .detail'
```

Ollama on the VPS then extracts the memories. Check about every 20 seconds
until it prints `completed`; `failed`: stop and report.

```text
curl -s -m 20 <auth> https://memory-api.mrihm-memory.com/v1/default/banks/<bank>/operations/<operation id> | jq -r .status
```

Then search:

```text
curl -s -m 60 -X POST <auth> -H 'Content-Type: application/json' https://memory-api.mrihm-memory.com/v1/default/banks/<bank>/memories/recall -d '{"query":"Which Hindsight bank holds the memory of the <Project name> project?","types":["world","experience"],"budget":"low"}' | jq -c '[.results[] | {type, text}]'
```

It passes when a result names the bank. An empty list: report it.

### 6. Open the dashboard

Open the bank's page for him, as "Open the dashboard" below says.

## Open the dashboard

After setup, and whenever the owner asks:

1. Read the link from the "Hindsight dashboard" line of `PROJECT.md`. For
   another project he names, read that project's `PROJECT.md`; the add-on's
   map lists each Hindsight project folder on this computer:
   `jq -r '.mapPathToBank // {} | to_entries[] | "\(.key) \(.value)"' ~/.hindsight/coding-agent.json`.
   A `PROJECT.md` whose bank line holds an ID and whose dashboard line is
   missing or holds `not used`: build the link from the bank, as "What runs
   where" shows.
2. `open '<link>'`.
3. Tell him that the dashboard asks for its own access key, not the API
   key, and that he signs in himself; it then shows the bank. Never add
   `?view=` to the link: the sign-in page drops it.

## Check a Hindsight project

For "check the setup" and "update the toolkit". Each check only reads. In
"check the setup", fix nothing; in an update, fix each failure only after
his yes.

- Name the server the project uses: the "Hindsight server" line of
  `PROJECT.md`, or "A project on the old Mac server" when it is one.
- The checks in "1. The server and the key".
- The bank on the "Hindsight bank" line is in the list in "2. The bank",
  step 3.
- The three `PROJECT.md` lines in "3. The settings lines" each hold their
  value, not a prompt and not `not used`.
- The project has `.claude/rules/hindsight-memory.md`, and `memory/` in the
  main checkout holds only `CURRENT_STATE.md`.
- "4. The add-on", steps 1 and 5.
- In a session that has the add-on's tools, `hindsight_diagnose` shows the
  bank as `bank_id`, the API address as `api_url`, and `api_token_in_use`
  `true`. A session without the tools: list this check as not done yet.
- A failure that comes from this computer (no key, no add-on, the folder
  missing from the map): "A new computer".

## A new computer

The memory stays on the VPS, so nothing is copied. On the new computer, for
the Hindsight projects there:

1. Node and `jq` are installed (`command -v node npx jq`); installing them
   is the owner's step.
2. He enters the API key ("The access key").
3. Read the bank from each project's `PROJECT.md`, and follow "4. The add-on"
   with that project's folder on this computer and that bank. Install the
   add-on once; for each other project only write the settings.
4. Run "Check a Hindsight project" in each project. His steps: trust the
   add-on's hooks in Codex `/hooks`, start a new session, and sign in to the
   dashboard in his browser.

## A project on the old Mac server

A project set up before the VPS has "Memory" set to `hindsight` in
`PROJECT.md` and a "Hindsight server" line that is missing, holds
`not used`, or holds an address on this computer; or its `.mcp.json` or
`.codex/config.toml` names `http://127.0.0.1:8888`. Its
memory is on a Hindsight server on that Mac, not on the VPS. Tell the
owner; this skill has no step for moving memory between servers. When he
says to use the VPS from now on, set the project up as in "Set up a
project", and remove its old `hindsight` entries from `.mcp.json` and
`.codex/config.toml` after his yes.

## Gotchas

- Never open or show `~/.hindsight/coding-agent.json` or its
  `.hindsight-backup` copy whole, with any tool (for example `cat`,
  `jq .`, or a file read tool): they hold the API key. Never print the key
  (for example with `curl -v`, `set -x`, `env`, or `printenv`), and never
  show a command line with the key written in it. Read the settings with
  `jq 'del(.. | .apiToken?)'`, which removes every `apiToken`, also the ones
  under `paths`, `banks`, and `harnesses`. Show an MCP entry only as step
  4.1 does: an older entry can hold the key in its headers or `env`.
- After a key change, offer to delete
  `~/.hindsight/coding-agent.json.hindsight-backup`, and delete it only
  after his yes.
- Never ask him to type a key into the chat. When he pastes one there,
  tell him it was seen in the chat and recommend that he change it on the
  server.
- With no server named in its settings, the add-on uses Hindsight Cloud.
  Write the settings before `npx ... install`, and always pass
  `--server self-hosted --api-url https://memory-api.mrihm-memory.com`.
- Install the add-on only for `claude-code` and `codex`, never `all`. Never
  pass `--import-conversations` unless he asks: it reads every past session
  of the project again and costs model use.
- A save to a bank ID the server does not have makes a new bank without
  asking. Copy the ID from `PROJECT.md`; never type it again from memory.
- The add-on finds a project by its folder path. After the owner moves or
  renames the folder, change it in `mapPathToBank` and `optInPaths`, after
  his yes; until then the add-on does nothing there.
- Never add a `hindsight` server to a project's `.mcp.json` or
  `.codex/config.toml`: a project server with that name replaces the
  add-on's in that project.

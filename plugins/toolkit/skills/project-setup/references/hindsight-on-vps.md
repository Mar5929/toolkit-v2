# Hindsight on the VPS

Use this file for a project whose memory is kept in Hindsight. Hindsight runs on the owner's own server, a VPS at Hostinger, and each project has one bank there. A bank is one project's memory store on the Hindsight server. Open this file to set up a Hindsight project, to open a project's dashboard, to check a Hindsight project, or to connect a new computer. The file also says what runs where, what an agent never does on the server, and how the access key is handled.

The setup of a project is done when its bank is on the server, the three Hindsight lines of `PROJECT.md` are filled, Hindsight's coding-agent add-on on this computer maps the project's folder to the bank, the save-and-search check passes, and the bank has the settings that the owner chose.

## Contents

- What runs where
- The server is the owner's
- The access key
- Set up a project
  - Projects with their own review of saved knowledge
  - 1. The server and the key
  - 2. The bank
  - 3. The settings lines
  - 4. The add-on
  - 5. Save and search
  - 6. Open the dashboard
  - 7. The bank's settings
- The bank's settings
  - Ask the owner
  - Apply the settings
  - Change a setting later
  - Build observations when the owner asks
- Open the dashboard
- Check a Hindsight project
- A new computer
- A project on the old Mac server
- Mistakes to avoid

## What runs where

These facts are about the server:

- The owner's Hostinger VPS runs three services with Docker Compose, from one folder, `/opt/hindsight`: the database (PostgreSQL), Hindsight, and Caddy.
  - Hindsight uses a language model at OpenAI, `gpt-5.6-terra`, for all of its model work. That work includes turning saved text into memories and answering a question from memory (a reflect). With the choice `"reflect"` of the setting "Summary on the first message", the summary that the add-on adds on the first message of a session is a reflect. The model does not run on the VPS.
  - Hindsight reaches that model through the owner's ChatGPT subscription. It signs in with a Codex sign-in of its own, which is kept only on the VPS. Hindsight's documentation describes this kind of sign-in as for personal development use.
  - So the text of each save goes to OpenAI to be turned into memories, and for a reflect the question and the memories go there too. This work uses the usage allowance of the owner's ChatGPT subscription. The owner's own Codex sessions use the same allowance.
  - The models that Hindsight searches the memories with run on the VPS.
  - Never install Hindsight on this Mac, never install a model for it there (for example with Ollama), never use Hindsight Cloud, and never ask for an OpenAI key.
- DNS sends two addresses to the VPS: the API address and the dashboard address. Caddy accepts HTTPS for both and passes each one to Hindsight.
- Only ports 22, 80, and 443 of the VPS are open. The ports of the database and of Hindsight itself are not public.
- The API is `https://memory-api.mrihm-memory.com`. Every call except `/health` needs the API key, sent as `Authorization: Bearer <key>`.
- The dashboard is `https://memory.mrihm-memory.com`. The dashboard asks for its own access key, which is separate from the API key, and signing in is the owner's step. A bank's page is `https://memory.mrihm-memory.com/banks/<URL-encoded bank ID>`.
- Each project has one memory bank. The bank's ID is on the "Hindsight bank" line of `PROJECT.md`, section "Toolkit settings".
- Hindsight writes every memory and every answer in English, also when the saved text or the question is in another language. It keeps names as they are.
  - The setting covers every bank, and no bank can change it.
  - The setting is an instruction to the model, not a check. So when a save held text in another language, read the memories it made before you rely on them.
- By the server's own setting, Hindsight builds observations only on request. A bank's own settings can change that for the bank. An observation is a statement that Hindsight builds from several saved memories, and consolidation is the job that builds them.
  - Automatic consolidation is off for the whole server. So a save starts a consolidation only in a bank whose own settings turn automatic consolidation on.
  - In every other bank that has observations on, Hindsight consolidates only after a `POST /v1/default/banks/<bank>/consolidate`. Consolidation also uses the ChatGPT allowance.
- The memory is kept only on the VPS. The VPS has weekly automatic backups at Hostinger. The toolkit adds no backup step, and nothing of the memory is copied to this Mac.

These facts are about this computer:

- Hindsight's coding-agent add-on (`@vectorize-io/hindsight-coding-agents`) connects Claude Code and Codex to the bank. This file calls it the add-on. The add-on is installed once per computer, and the installation has these parts:
  - three hooks in `~/.claude/settings.json` and three in `~/.codex/hooks.json`;
  - a user-level MCP server named `hindsight` in Claude Code and one in Codex;
  - its own skill, `hindsight-coding-agent`, in `~/.claude/skills/`;
  - its program in `~/.hindsight/coding-agents/`, which updates itself once a day;
  - its settings in `~/.hindsight/coding-agent.json`.
- The add-on gives the agent eight tools. The tools search and read the bank's knowledge pages and memory, save a document or the plan of new work into the bank, and report the add-on's own state. The add-on's skill, and the guide that the add-on shows the agent at session start, say when to use each tool. The toolkit repeats neither.
- The add-on's settings map each Hindsight project's folder to its bank (`mapPathToBank`) and switch the add-on off in every other folder (`optInOnly` with `optInPaths`).
- In a mapped folder the add-on works by itself:
  - It saves the session to the bank at the end of every turn.
  - At session start, it shows the agent the bank's knowledge pages and the guide to its tools. On the first message of a session, it adds a short summary from memory.
  - It fills a new bank from the Git history, and it keeps five knowledge pages in the bank up to date.
  - It surveys the code with the command line of Claude Code or Codex, on a new bank and again every 20 commits. In Claude Code, a survey uses the model haiku and costs at most US$2.
- The owner chooses six settings for each bank, such as whether Hindsight builds observations for it. "The bank's settings" lists them. Setup writes the owner's choices to the server and into the add-on's settings, under the bank's ID.
- The add-on's settings also hold two values for a bank that has no choices of its own yet:
  - They set `defaultBankConfig.enable_observations` to `false`, because the add-on's bank template would otherwise turn observations on for the bank. With that setting at `false`, Hindsight consolidates nothing in the bank, by itself or on request.
  - They ask for the `world` and `experience` types when the add-on recalls memories, because the add-on asks only for observations unless told otherwise.
- The project's Current State stays in the local file `memory/CURRENT_STATE.md`. The project's Current State is the project's one short page of what is true now.

## The server is the owner's

- An agent never signs in to the VPS, never runs a command on it, and never changes its files, its DNS records, or its firewall. Everything in this file reaches the server only through the API address.
- When the server needs work (it is down, slow, out of space, or needs a newer Hindsight), stop and tell the owner what you saw. The work is the owner's.
- When a save or a reflect fails with `refresh_token_reused`, Hindsight's Codex sign-in on the VPS has stopped working. The health check and a search still pass then. Stop and tell the owner that Hindsight needs a new Codex sign-in in its own folder on the VPS (`/opt/hindsight/codex-auth`), and a restart after it. Both are the owner's steps.
- Never copy a Codex sign-in file (`auth.json`) from this computer to the VPS, or from the VPS to this computer. The sign-in on the VPS belongs to Hindsight alone.
- When a save or a reflect fails because the ChatGPT allowance is used up, stop and tell the owner.
- Never run `docker compose down -v` on the server, and never give the owner that command, because `-v` deletes the volumes, and one of them holds the database.
- Bringing back a backup is the owner's step in Hostinger.

## The access key

The API key is kept in the `apiToken` field of `~/.hindsight/coding-agent.json`, which is the add-on's settings file. Only the owner can read that file (permissions 600), and the file is outside every repository.

- The API key opens every bank on the server. A bank ID in an address chooses the bank, and it does not limit what the key can reach. So read, write, and delete only in this project's bank, unless the owner names another bank.
- The add-on's hooks and MCP server read that file however Claude Code or Codex was started. The Claude desktop app and the Codex app may not read shell startup files such as `~/.zshrc`, so a key kept only in such a file can be missing in those apps.
- The commands in this file read the key from the same file.

The owner enters the key, in the owner's own Terminal window, and never in the session with the agent. Give the owner these two lines, which are written for zsh, the Mac's default shell.

- The second line asks for the key and shows nothing while the owner types or pastes it.
- The second line writes the server address with the key, because with no server named, the add-on sends saves, with this key, to Hindsight Cloud.

```text
mkdir -p ~/.hindsight; [ -s ~/.hindsight/coding-agent.json ] || echo '{}' > ~/.hindsight/coding-agent.json
read -rs "HS_KEY?Hindsight API key: " && echo && HS_KEY="$HS_KEY" jq '.apiToken = env.HS_KEY | .serverMode = "self-hosted" | .apiUrl = "https://memory-api.mrihm-memory.com" | .optInOnly = true' ~/.hindsight/coding-agent.json > ~/.hindsight/coding-agent.json.new && chmod 600 ~/.hindsight/coding-agent.json.new && mv ~/.hindsight/coding-agent.json.new ~/.hindsight/coding-agent.json; unset HS_KEY
```

Then check that the key is there. This command prints only `true` or `false`:

```text
jq '(.apiToken // "") | length > 0' ~/.hindsight/coding-agent.json
```

Use the fallback below only when the owner does not want the key in that file.

- First give the owner the first line, and the second line with everything about the key taken out (the `read` part, `HS_KEY`, and `.apiToken = env.HS_KEY |`), so that the file names the VPS.
- Only after that does the owner add `export HINDSIGHT_API_TOKEN='<key>'` to `~/.zshenv`. The owner adds it, not the agent.
- The add-on reads that variable when the file has no `apiToken`, but only in Claude Code or Codex started from a shell that read it.
- In the commands below, use `$HINDSIGHT_API_TOKEN` in place of `$(jq -r .apiToken ~/.hindsight/coding-agent.json)`.

## Set up a project

Run each command alone. When the session runs in Codex, follow `SKILL.md`, "Mistakes to avoid": it says how to run a command that the Codex sandbox refuses, such as a network call or a write to a file in the home folder.

In the commands below, `<auth>` stands for `-H "Authorization: Bearer $(jq -r .apiToken ~/.hindsight/coding-agent.json)"`. Write it out in full in each command, exactly so, and never write the key itself. `<main checkout>` stands for the main checkout, which is the project's main folder: the first path that `git worktree list` prints.

### Projects with their own review of saved knowledge

Four of the owner's projects have an approved review, in Notion and Lore, of knowledge before it is saved: Entrevest, Diligence Ready, CentraView, and Robin. The add-on saves every session to the bank without a review, so setting one of them up here would save knowledge without that review.

When the project's name is one of the four, or the owner says that the project is one of them, stop before "1. The server and the key". Create no bank, and add no folder to the add-on's settings.

1. Tell the owner that this project has an approved review of saved knowledge, and that the add-on saves every session without it.
2. Give the owner the link to the Agent Contract, which is the Notion page that holds those projects' rules for saved knowledge: `https://app.notion.com/p/3e8a27b433e481c3bb83e05a5002c105`.
3. Tell the owner that three settings in "The bank's settings" each stop one thing that the add-on saves by itself for one bank: "Save every session" stops the saves at the end of a turn, "Git history" stops the saves from Git, and "Code survey" stops the survey.
4. Go on with "1. The server and the key" only after the owner says yes to a Hindsight bank for this project.

### 1. The server and the key

Check the server with this command:

```text
curl -s -m 10 https://memory-api.mrihm-memory.com/health
```

- When it prints `"status":"healthy"`, go on.
- When it prints anything else, stop. The VPS is down or cannot be reached, and only the owner can fix it. Never offer a server on this Mac instead.

Then check the key, with the command under "The access key". When that command prints `false`, or the file does not exist, give the owner the two lines from "The access key" and wait. Check again after the owner says it is done.

### 2. The bank

1. Look for this project's own bank in both places: the "Hindsight bank" line of `PROJECT.md` when it holds a bank ID (a setup that stopped, or a changed memory choice), and the add-on's map. The line holds no ID when it holds its prompt or `not used`. This command reads the add-on's map:

   ```text
   jq -r --arg p '<main checkout>' '.mapPathToBank[$p] // empty' ~/.hindsight/coding-agent.json
   ```

   When both places hold an ID and the two IDs differ, show both, each with its fact count and last write (the list in step 3), and ask the owner which one is this project's bank.

2. When neither place has an ID, pick an ID from the project name. Write it in lower case, with the words joined by hyphens. The ID starts with a letter, holds only letters, digits, and hyphens, and has at most 63 characters, for example `acme-crm`.
3. List the banks whose ID or name contains that ID:

   ```text
   curl -s -m 20 <auth> 'https://memory-api.mrihm-memory.com/v1/default/banks?q=<bank>&limit=100' | jq -c '.detail // [.banks[] | {bank_id, name, fact_count, last_write_at}]'
   ```

   Also list with `q=coding-agent::<name of the main checkout's folder>`, because an add-on that ran here before this setup saved the folder to a bank with that ID. When such a bank shows, ask the owner whether it is this project's bank before you create one.

   | It prints | Do |
   | --- | --- |
   | "Authentication failed" | The key is wrong. The owner enters it again, as "The access key" says. |
   | The exact ID, which step 1 found | Use it. |
   | The exact ID, which step 1 did not find | Show the owner its name, fact count, and last write, and ask whether it is this project's bank. When the owner says yes, use it. When the owner says no, add `-2`, `-3`, and so on, and list again. |
   | No exact ID, but step 1 found one | That bank was deleted. Tell the owner, and create it again only after the owner's yes. |
   | No exact ID | Create it (step 4). |

   Check a bank with this list, never with `GET /v1/default/banks/<bank>/config`, because older servers answer `200` there for a deleted bank.
4. Create the bank with this command. Leave any `'` out of the project name in the body:

   ```text
   curl -s -m 30 -X PUT <auth> -H 'Content-Type: application/json' https://memory-api.mrihm-memory.com/v1/default/banks/<bank> -d '{"name":"<Project name>","reflect_mission":"Memory for the <Project name> project.","retain_mission":"Keep project-wide decisions, lasting project facts, references, and lessons for <Project name>. Ignore chit-chat, live status, secrets, and personal data."}' | jq -c '{bank_id, name}'
   ```

   A `PUT` to an existing ID changes that bank's name and missions, so send it only for an ID that the list showed free. Then run the list again. The ID must be in it.

### 3. The settings lines

Fill these lines in `PROJECT.md`, section "Toolkit settings":

```text
- Hindsight bank: `<bank>`
- Hindsight server: `https://memory-api.mrihm-memory.com`
- Hindsight dashboard: `https://memory.mrihm-memory.com/banks/<bank>`
```

When an ID has a character other than a letter, digit, or hyphen, encode the ID in the link with this command: `jq -rn --arg b '<bank>' '$b|@uri'`.

### 4. The add-on

1. Look at what this computer has. Each of these commands only reads:

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

   - When there is no `node` or `npx`, stop. Installing Node is the owner's step.
   - When the commands show an older Hindsight integration, show it to the owner, because it would save every session a second time, into another bank. An older Hindsight integration is a `hindsight-memory@...` plugin in Claude Code, or the old Codex one: `~/.hindsight/codex/` or hooks that name it.
     - After the owner's yes, remove the plugin with `claude plugin uninstall <name>`.
     - After the owner's yes, remove the old Codex handlers in `~/.codex/hooks.json`. Show the handlers to the owner first.
   - The add-on is installed when each hooks file counts 3 or more and both MCP entries run `mcp-server.js` from `coding-agents`.
2. Show the owner exactly what will change, and ask:
   - In `~/.hindsight/coding-agent.json`, the settings below are written, with this project's folder and bank. "7. The bank's settings" adds the bank's own settings to the same file.
   - Only when the add-on is not installed yet, the installer adds the files and entries in "What runs where" (hooks, MCP servers, its skill, its program).
     - The installer keeps a copy of each file it changes the first time, as `<file>.hindsight-backup`.
     - Codex runs hooks only with its hooks feature on, under `[features]` in `~/.codex/config.toml`. The installer adds that section when the file has none. The key is `hooks`. The older key `codex_hooks`, which the add-on's own documentation names, still works.
3. After the owner's yes, write the settings first, so that the installer never falls back to Hindsight Cloud:

   ```text
   jq --arg p '<main checkout>' --arg b '<bank>' '.serverMode = "self-hosted" | .apiUrl = "https://memory-api.mrihm-memory.com" | .optInOnly = true | .optInPaths = ((.optInPaths // []) + [$p] | unique) | .mapPathToBank = ((.mapPathToBank // {}) + {($p): $b}) | .recallOptions = ((.recallOptions // {}) + {types: ["world", "experience"]}) | .defaultBankConfig = ((.defaultBankConfig // {}) + {enable_observations: false})' ~/.hindsight/coding-agent.json > ~/.hindsight/coding-agent.json.new && chmod 600 ~/.hindsight/coding-agent.json.new && mv ~/.hindsight/coding-agent.json.new ~/.hindsight/coding-agent.json
   ```

4. When the add-on is not installed yet, install it for Claude Code and Codex with this command. To install it for only one of them, name only that one:

   ```text
   npx -y @vectorize-io/hindsight-coding-agents install claude-code codex --server self-hosted --api-url https://memory-api.mrihm-memory.com
   ```

   When the installer prints that a line must be added under an existing `[features]` section, add the line it names to `~/.codex/config.toml` after the owner's yes.
5. Check these things:
   - `jq 'del(.. | .apiToken?)' ~/.hindsight/coding-agent.json` shows `serverMode` `self-hosted`, the API address, `optInOnly` `true`, the main checkout in `optInPaths`, the main checkout mapped to the bank in `mapPathToBank`, `recallOptions.types` `["world","experience"]`, and `defaultBankConfig.enable_observations` `false`.
   - The commands in step 1 now find the add-on installed.
   - The project has no `hindsight` server of its own: `.mcp.json` has no `mcpServers.hindsight`, and `.codex/config.toml` has no `[mcp_servers.hindsight]`.
6. The last steps are the owner's. In Codex, the owner trusts the add-on's hooks with `/hooks`. The owner starts a new session in Claude Code and in Codex, because both load hooks and MCP servers at session start.

### 5. Save and search

This step proves the server, the key, and the bank. Save a test text with the command below. The fixed `document_id` makes a second run replace the first save:

```text
curl -s -m 30 -X POST <auth> -H 'Content-Type: application/json' https://memory-api.mrihm-memory.com/v1/default/banks/<bank>/memories -d '{"items":[{"content":"Toolkit V2 set up the <Project name> project on <YYYY-MM-DD>. Its memory is the Hindsight bank <bank>.","context":"Toolkit V2 setup check","document_id":"toolkit-setup-check"}],"async":true}' | jq -r '.operation_id // .detail'
```

Hindsight then extracts the memories, with its model at OpenAI. Check with the command below about every 20 seconds, until it prints `completed`. When it prints `failed`, run the same command with `jq -r .error_message` in place of `jq -r .status`, then stop and report the reason. The server can print `completed` when part of the extraction failed, so the search below is the proof.

```text
curl -s -m 20 <auth> https://memory-api.mrihm-memory.com/v1/default/banks/<bank>/operations/<operation id> | jq -r .status
```

Then search:

```text
curl -s -m 60 -X POST <auth> -H 'Content-Type: application/json' https://memory-api.mrihm-memory.com/v1/default/banks/<bank>/memories/recall -d '{"query":"Which Hindsight bank holds the memory of the <Project name> project?","types":["world","experience"],"budget":"low"}' | jq -c '[.results[] | {type, text}]'
```

The check passes when a result names the bank. When the search prints an empty list, report it.

### 6. Open the dashboard

Open the bank's page for the owner, as "Open the dashboard" below says.

### 7. The bank's settings

Give the bank the settings that the owner chose in the interview, as "Apply the settings" below says. When the owner was not asked about them yet, ask first, as "Ask the owner" below says.

## The bank's settings

Each bank has six settings that the owner chooses for that bank alone. Setup asks about all six in one message. The project keeps the answers in `.claude/hindsight-bank-settings.json`, a file in the repository, so that every computer gives the bank the same settings.

The file has two parts. The `bank` part holds the settings that the server keeps for the bank. The `addOn` part holds the settings that the add-on keeps on each computer, under the bank's ID.

| Setting | Key in the file | Choices | What the choice changes |
| --- | --- | --- | --- |
| Observations | `bank.enable_observations`, `bank.enable_auto_consolidation`, and `addOn.recallOptions.types` | Off. On, built only when the owner asks. On, built after every save. | An observation is a statement that Hindsight builds from several saved memories. Building observations uses the ChatGPT allowance: once for each request, or after every save. |
| Save every session | `addOn.retainSessions` | `true` or `false` | With `false`, the add-on saves no session at the end of a turn. The bank then gets only the Git history, the code survey, and what the agent saves with the add-on's tools. |
| Detail of a save | `addOn.retainExtractionMode` | `"concise"`, `"verbose"`, `"verbatim"`, or `"chunks"` | `"verbose"` keeps more detail, and uses several times the model work of `"concise"` on every save. `"verbatim"` stores the text as it is, and uses the model only to find names and dates in it. `"chunks"` stores the text as it is and uses no model. |
| Summary on the first message | `addOn.autoInject` | `"reflect"`, `"pages"`, `"recall"`, or `"none"` | `"reflect"` asks the model for a summary in every session. `"pages"` adds the knowledge pages that match the message, and `"recall"` adds the memories that match it. Neither uses the model. `"none"` adds nothing. |
| Git history | `addOn.gitIngest` | `"message"`, `"full"`, or `"none"` | `"message"` saves the commit messages. `"full"` also saves the changes of every commit, and Hindsight uses the model on each one. `"none"` saves nothing from Git. |
| Code survey | `addOn.codebaseSurvey` | `true` or `false` | With `true`, the add-on surveys the code on a new bank and again every 20 commits. In Claude Code, a survey costs at most US$2. |

The file that setup copies holds the default of each setting: observations on and built after every save, every session saved, `"verbose"`, `"reflect"`, `"full"`, and the code survey on.

The choice for observations sets three values:

| Observations | `bank.enable_observations` | `bank.enable_auto_consolidation` | `addOn.recallOptions.types` |
| --- | --- | --- | --- |
| Off | `false` | `false` | `["world", "experience"]` |
| On, built only when the owner asks | `true` | `false` | `["observation", "world", "experience"]` |
| On, built after every save | `true` | `true` | `["observation", "world", "experience"]` |

### Ask the owner

Show the owner the six settings in one table. For each setting, give its name, its choices in plain words, what each choice costs, and the default. Then ask one question: "Say 'defaults', or name what to change." Recommend the defaults.

### Apply the settings

In the commands below, `<settings file>` stands for the path of the project's `.claude/hindsight-bank-settings.json` in the folder you work in.

1. Write the owner's answers into the file. Change only the values.
2. Send the `bank` part to the server. The answer must show both fields with the file's values. When it shows anything else, stop and report what it printed.

   ```text
   curl -s -m 30 -X PATCH <auth> -H 'Content-Type: application/json' https://memory-api.mrihm-memory.com/v1/default/banks/<bank>/config -d "$(jq -c '{updates: .bank}' '<settings file>')" | jq -c '.detail // (.overrides | {enable_observations, enable_auto_consolidation})'
   ```

3. Show the owner the `addOn` part, and say that it goes into `~/.hindsight/coding-agent.json`, under the bank's ID. After the owner's yes, write it:

   ```text
   jq --arg b '<bank>' --slurpfile s '<settings file>' '.banks = ((.banks // {}) + {($b): (((.banks // {})[$b] // {}) + $s[0].addOn)})' ~/.hindsight/coding-agent.json > ~/.hindsight/coding-agent.json.new && chmod 600 ~/.hindsight/coding-agent.json.new && mv ~/.hindsight/coding-agent.json.new ~/.hindsight/coding-agent.json
   ```

4. Check that the command below shows every key of the `addOn` part with the file's value:

   ```text
   jq --arg b '<bank>' '(.banks // {})[$b] | del(.. | .apiToken?)' ~/.hindsight/coding-agent.json
   ```

5. Tell the owner from when the new settings apply. The add-on's hooks read the settings each time they run, so they use the new settings from the owner's next message. The add-on's tools read the settings once, when a session starts, so they use the new settings from the next session.

On a second computer, do only steps 3 to 5, because the server already keeps the `bank` part.

### Change a setting later

When the owner asks to change a setting of the bank, do steps 1 to 5 of "Apply the settings" again with the new answer.

### Build observations when the owner asks

Do this only for a bank whose observations are on, and only when the owner asks. When `bank.enable_observations` in the project's settings file is `false`, send nothing, and tell the owner that observations are off for this bank. Otherwise, start the consolidation with this command:

```text
curl -s -m 30 -X POST <auth> -H 'Content-Type: application/json' https://memory-api.mrihm-memory.com/v1/default/banks/<bank>/consolidate -d '{}' | jq -r '.operation_id // .detail'
```

Then check the operation with the status command in "5. Save and search", until it prints `completed` or `failed`. Tell the owner the result. Hindsight can build no observation at all when the saved memories give it nothing to join.

## Open the dashboard

Do these steps after setup, and whenever the owner asks.

1. Read the link from the "Hindsight dashboard" line of `PROJECT.md`.
   - For another project that the owner names, read that project's `PROJECT.md`. The add-on's map lists each Hindsight project folder on this computer: `jq -r '.mapPathToBank // {} | to_entries[] | "\(.key) \(.value)"' ~/.hindsight/coding-agent.json`.
   - When a `PROJECT.md` has a bank line that holds an ID, and its dashboard line is missing or holds `not used`, build the link from the bank, as "What runs where" shows.
2. Run `open '<link>'`.
3. Tell the owner that the dashboard asks for its own access key, not the API key, and that signing in is the owner's step. The dashboard then shows the bank. Never add `?view=` to the link, because the sign-in page drops it.

## Check a Hindsight project

Use this section for "check the setup" and "update the toolkit". Each check only reads. In "check the setup", fix nothing. In an update, fix each failure only after the owner's yes.

- Name the server the project uses: the "Hindsight server" line of `PROJECT.md`, or "A project on the old Mac server" when it is one.
- Do the checks in "1. The server and the key".
- Check that the bank on the "Hindsight bank" line is in the list in "2. The bank", step 3.
- Check that the three `PROJECT.md` lines in "3. The settings lines" each hold their value, not a prompt and not `not used`.
- Check that the project has `.claude/rules/hindsight-memory.md`, and that `memory/` in the main checkout holds only `CURRENT_STATE.md`.
- Do steps 1 and 5 of "4. The add-on".
- Check the bank's settings:
  - The project has `.claude/hindsight-bank-settings.json`.
  - Step 4 of "Apply the settings" shows every key of the file's `addOn` part with the file's value. When that command prints `null`, this computer has no settings for the bank yet. When this update copied the file into the project, the owner was never asked: ask as "Ask the owner" says, and then apply the answers. When the project already had the file, do steps 3 to 5 of "Apply the settings" after the owner's yes.
  - The command below shows the two fields of the file's `bank` part with the file's values:

    ```text
    curl -s -m 20 <auth> https://memory-api.mrihm-memory.com/v1/default/banks/<bank>/config | jq -c '.detail // (.overrides | {enable_observations, enable_auto_consolidation})'
    ```
- In a session that has the add-on's tools, check that `hindsight_diagnose` shows the bank as `bank_id`, the API address as `api_url`, and `api_token_in_use` `true`. In a session without the tools, list this check as not done yet.
- When a failure comes from this computer (no key, no add-on, the folder missing from the map), follow "A new computer".

## A new computer

The memory stays on the VPS, so nothing is copied. On the new computer, do these steps for the Hindsight projects there:

1. Check that Node and `jq` are installed (`command -v node npx jq`). Installing them is the owner's step.
2. The owner enters the API key, as "The access key" says.
3. Read the bank from each project's `PROJECT.md`, and follow "4. The add-on" with that project's folder on this computer and that bank. Install the add-on once. For each other project, only write the settings. Then do steps 3 to 5 of "Apply the settings" in each project.
4. Run "Check a Hindsight project" in each project. Then three steps are the owner's: to trust the add-on's hooks in Codex `/hooks`, to start a new session, and to sign in to the dashboard in the owner's browser.

## A project on the old Mac server

A project set up before the VPS keeps its memory on a Hindsight server on that Mac, not on the VPS. Such a project shows one of these two signs:

- It has "Memory" set to `hindsight` in `PROJECT.md`, and a "Hindsight server" line that is missing, holds `not used`, or holds an address on this computer.
- Its `.mcp.json` or `.codex/config.toml` names `http://127.0.0.1:8888`.

Tell the owner. This skill has no step for moving memory between servers. When the owner says to use the VPS from now on, set the project up as in "Set up a project", and remove its old `hindsight` entries from `.mcp.json` and `.codex/config.toml` after the owner's yes.

## Mistakes to avoid

- Never open or show `~/.hindsight/coding-agent.json` or its `.hindsight-backup` copy whole, with any tool (for example `cat`, `jq .`, or a file read tool), because both hold the API key.
  - Never print the key (for example with `curl -v`, `set -x`, `env`, or `printenv`), and never show a command line with the key written in it.
  - Read the settings with `jq 'del(.. | .apiToken?)'`, which removes every `apiToken`, also the ones under `paths`, `banks`, and `harnesses`.
  - Show an MCP entry only as step 4.1 does, which is step 1 of "4. The add-on", because an older entry can hold the key in its headers or `env`.
- After a key change, offer to delete `~/.hindsight/coding-agent.json.hindsight-backup`, and delete it only after the owner's yes.
- Never ask the owner to type a key into the session. When the owner pastes a key there, tell the owner that it was seen in the session, and recommend that the owner change it on the server.
- Write the settings before `npx ... install`, and always pass `--server self-hosted --api-url https://memory-api.mrihm-memory.com`. With no server named in its settings, the add-on uses Hindsight Cloud.
- Install the add-on only for `claude-code` and `codex`, never `all`.
- Never pass `--import-conversations` unless the owner asks, because it reads every past session of the project again and costs model use.
- Copy a bank ID from `PROJECT.md`, and never type it again from memory. A save to a bank ID that the server does not have makes a new bank without asking.
- The add-on finds a project by its folder path. After the owner moves or renames the folder, change the path in `mapPathToBank` and `optInPaths`, after the owner's yes. Until then the add-on does nothing in that folder.
- Never add a `hindsight` server to a project's `.mcp.json` or `.codex/config.toml`, because a project server with that name replaces the add-on's in that project.
- Never add the server's MCP address for one bank (`https://memory-api.mrihm-memory.com/mcp/<bank>/`) to Claude Code or Codex for a toolkit project. The add-on already gives the agent the tools for the project's bank.
- Never send `POST .../consolidate`, and never change a setting of a bank, unless the owner asks. Consolidation uses the owner's ChatGPT allowance, and each setting is the owner's choice.
- Never change the bank's section in `~/.hindsight/coding-agent.json` alone. Change the project's `.claude/hindsight-bank-settings.json`, then apply it, so that every computer gets the same settings.

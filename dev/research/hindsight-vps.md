# Hindsight on the VPS: research (2026-10-01)

Read-only research done before the build. Part 1 maps the request onto Toolkit V2 as it was on branch claude/v2-build; part 2 holds the outside facts, with sources.

## Part 1: the toolkit before this change

### 0. Work already underway that must be kept

**skill-cut (branch `claude/skill-cut`, not committed):** 199 changed files. It is editing the setup skill now.
- Its `SKILL.md` is modified: 42 lines added, 86 removed. Hindsight lines touched:
  - the "Services set up: Notion, GitHub, Hindsight" checklist line is removed;
  - the paragraph about what `installing-hindsight.md` installs is shortened;
  - the "Approve the `hindsight` server" owner step is removed from `SKILL.md`.
- `hindsight.md`, `installing-hindsight.md`, the hook files and the settings snippets are not modified yet.
- Its plan is in `<skill-cut>/dev/archive/reviews/skill-cut-2026-10-01/proposals.md`, about lines 1455–1545. For Hindsight it plans to:
  - move the 53-line background-service file (plist) out of `installing-hindsight.md` into `assets/`;
  - keep the Hindsight health check before setup, the bank creation, the tool limit, the MCP entries, and the "never codex mcp add" rule;
  - remove the sentences about Hindsight saves from `prompt-reminder.mjs`.
- It also rewrites `dev/build-shared/decisions-and-memory.md` (a source text) and deletes its copies inside the skills. Many shared skills that mention Hindsight are changed.

**Stopped audit pass:** `.claude/worktrees/skill-audit-fixes`, branch `claude/skill-audit-fixes`, commit `aae3bfa`. Its commit message says "not reviewed, not for merging as is".
- In `hindsight.md` it changes tool names to the full `mcp__hindsight__retain` / `recall` / `sync_retain`.
- In `installing-hindsight.md` it removes 60 lines (the plist moves out).

**Other worktrees:**
- `/Users/michaelrihm/Documents/Projects/toolkit-v2-mike-edits` (branch `mike/v2-edits`) is clean.
- The main checkout is on `main` at `b1aca0f`. It still holds the old 0.3.1 program with its 6 plugins. Mike's Claude Code has all six `toolkit-v2` plugins switched off in `~/.claude/settings.json`.

### 1. Mike's decisions about Hindsight, and where this request conflicts

All from `<v2-build>/dev/GOAL.md`:

- **Settled decisions, 2026-09-26 (line 967):** "Hindsight: self-hosted only, never Hindsight Cloud. One local server on this Mac, one memory bank per project. No Docker… `uv tool install hindsight-api --python 3.12`; model `gpt-oss:20b` through Ollama."
  - Line 820 also says "Memory options: built-in `.memory/`, local Hindsight, or Notion."
  - **Conflict:** the VPS is not on this Mac. Self-hosted, no Cloud, and one bank per project all still hold.
- **Hindsight memory set, 2026-09-29 (lines 416–425):** no `hindsight-memory-save`, `-find` or `-refine` skills. Mike's words: "Hindsight has its own complete way." Also: "Hindsight's `hindsight-coding-agents` add-on is not used (Cloud by default, machine-wide settings, saves whole transcripts without asking)."
  - **Conflict:** a dashboard skill goes against "Hindsight memory has no toolkit skills" (`<v2-build>/AGENTS.md` line 274).
  - **Conflict:** reconciling with the coding-agent add-on goes against "not used".
  - It also goes against `hindsight.md`'s gotcha "Never install … `hindsight-coding-agents`".
  - And against the memory rule: "Never retain … transcripts" and "Save only on the owner's own keep words". The add-on saves the session back after every turn.
- **Hindsight research answered, 2026-09-29 (lines 426–433):** Current State stays a small local file, `memory/CURRENT_STATE.md`, kept out of Hindsight. This does not conflict.
- **Code limit, 2026-09-30 (lines 42–51; `AGENTS.md` lines 158–168):** "The only code a project runs is the three hook commands … A new command, or a new job for one, needs Mike's yes first, with its size in plain numbers."
  - **Conflict:** a "Toolkit command" to open the dashboard. `AGENTS.md` also says "No other script goes into a skill or a project."
- **Direction change, 2026-09-29 (line 110 on):** the `toolkit` program and its commands are retired.
  - **Mismatch:** the request names "toolkit memory commands", "repair", "doctor" and "backup". None of these exist in V2. V2 has only the setup skill's "check the setup" and "update the toolkit".
- **No backup:**
  - Topic 9, 2026-09-29 (lines 331–335): "no backup folder and no backup line".
  - Line 925: "we don't need a backup folder. That's too much bloat."
  - **Conflict:** with "update … backup … instructions". V2 has no backup to update.
- **Where skills live (draft 2 answers, 2026-09-29, lines 434–448; `AGENTS.md` "Machine-wide plugin"):** "Skills are copied into each project; only onboarding is a machine-wide plugin." The `toolkit` plugin "holds only `project-setup` and no hooks".
  - **Conflict:** a dashboard skill that can name another project needs to work across projects or live machine-wide. V2 has no list of projects on the machine. A bank ID is kept only in each project's `PROJECT.md`.
- **Model files are copies (`AGENTS.md` "Never edit the model copy by hand"):** "local Hindsight server" appears in:
  - `assets/model/AGENTS.md` line 133;
  - `assets/model/PROJECT.md` lines 45 and 95.
  - Changing them is a model change. It needs Mike's yes and goes on the model branch `toolkit-v2/approved-changes`, then is copied in.
- **Tests (`AGENTS.md` lines 274–289):** "Tests use only banks made for the test, never Mike's own." "Never write to … Hindsight banks."
  - **Conflict:** testing on the shared VPS means creating test banks on Mike's own server. That needs his yes. Deleting test data also needs his yes (GOAL line 104).
- **Skill audit follow-up, 2026-10-01 (lines 745–757):** the refactor keeps what skills do, and behavior changes wait for Mike.
  - These Hindsight changes are behavior changes. They overlap files the cut is editing now.

### 2. Every V2 file about Hindsight (v2-build)

**`references/hindsight.md` (163 lines)**
- Server: only `http://127.0.0.1:8888`, never Cloud or Docker. Health check is `curl …/health`. It checks the launchd service `local.toolkit-v2.hindsight` and Ollama.
- Bank naming (lines 53–74):
  - the project name in lower case, words joined by hyphens, starting with a letter;
  - only letters, digits and hyphens, never `/`;
  - one command checks `GET /v1/default/banks/<bank>/config`, and only a `404` result is followed by the `PUT` that creates the bank;
  - a `200` result adds `-2`, `-3` and so on;
  - "never reuse another project's bank". There is no step for reusing this project's own bank.
- Tool limit (lines 76–88): a `PATCH …/config` with `{"updates":{"mcp_enabled_tools":[retain, sync_retain, recall, reflect, list_memories, get_memory, list_tags, list_documents, get_document, list_operations, get_operation, get_bank]}}`.
- MCP setup (lines 90–127):
  - Claude Code: a `hindsight` entry in the project's `.mcp.json`, `type: http`, URL `http://127.0.0.1:8888/mcp/<bank>/`, timeout 300000.
  - Codex: a `[mcp_servers.hindsight]` table in `.codex/config.toml` with the same URL, `enabled_tools`, `tool_timeout_sec = 300`.
  - Never `codex mcp add` or `claude mcp add --scope user`.
- Bank ID storage (line 131): `PROJECT.md`, "Toolkit settings", the line `- Hindsight bank: \`<bank>\``.
- Check (lines 140–154): read the tool list back, then `jq` / `grep` the two MCP URLs. The `recall` check waits for the next session. It says "Never `retain` a test memory".
- Access keys: nothing. There is no authentication anywhere.

**`references/installing-hindsight.md` (178 lines):** a full install on the Mac:
- Homebrew Ollama and `gpt-oss:20b` (13 GB);
- `uv tool install hindsight-api`;
- a first start with the network on;
- a LaunchAgent plist at `~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist` with the local LLM settings.

**`references/interview.md`:**
- line 46: the check before setup is `curl -s -m 2 http://127.0.0.1:8888/health`;
- lines 84–90: Hindsight is offered only when the local check answers, otherwise an install is offered;
- line 96: the table row "The local server at `127.0.0.1:8888`, one memory bank per project";
- lines 141 and 149: the plan text "create the memory bank <bank> on your local Hindsight server".

**`references/setup-copy.md`:**
- line 66: removes everything in `memory/` except `CURRENT_STATE.md`;
- line 114: the `memory=hindsight` marker;
- lines 169–176: the bank line is filled by the service step.

**`references/skills-hooks-settings.md` lines 49, 59–60 and 79:** Hindsight adds no skills (17 or 21 skills), and lists the snippet names.

**`references/update.md`:**
- line 39: reads the Hindsight bank;
- line 59: runs service steps in the update worktree (for example `.mcp.json`);
- line 161: lists the retired rule `hindsight-memory.md`;
- lines 176–177: "Hindsight projects: read the bank's tool list back and compare the MCP entries with `hindsight.md`; fix only after his yes."

**`references/finishing.md`:**
- line 97: Current State;
- line 120: `memory/` holds only `CURRENT_STATE.md`;
- line 127: prompt reminder `--skill hindsight`;
- line 138: "Services, Hindsight: the checks in hindsight.md";
- line 161: owner step "Approve the `hindsight` server in Claude Code".

**"Check the setup":** setup skill `SKILL.md` lines 33–41. It builds a fresh copy, compares, and runs the final checks in `finishing.md` without fixing anything.

**Settings snippets:** `assets/settings/claude-settings-hooks.hindsight.json` and `codex-hooks.hindsight.json`. They only pass `--memory hindsight` and `--skill hindsight` to the hooks. They hold no MCP entries, no server address and no key.

**Hook commands:**
- `assets/hooks/session-start.mjs` in Hindsight mode reads only the local `memory/CURRENT_STATE.md`. It never contacts the server.
- `assets/hooks/prompt-reminder.mjs` lines 32–33 and 50 print one hint: "retain tool … direct edit of owner-preferences.md".
- Neither hook needs changing for a remote server.

**Model `AGENTS.md`:**
- lines 21–23 and 53–55: Current State;
- line 133: "Memory is this project's bank on the **local** Hindsight server (named in `PROJECT.md` …)";
- lines 188–191: when to use `retain` and `recall`, and "edit `memory/CURRENT_STATE.md` directly".

**Model memory rule:** `assets/model/.claude/rules/memory-review-and-save.md` lines 34–60, section "Hindsight projects":
- `retain`, `recall` and `reflect` on the bank;
- tags `wi:<ID>` with `tags_match: "any_strict"`;
- never retain transcripts or secrets;
- no delete: the owner removes a memory in "Hindsight's own interface", with no address given;
- prune Current State by hand.

**Model `PROJECT.md`:** line 45 ("bank on the local Hindsight server") and line 95 (`- Hindsight bank: \`<bank name on the local Hindsight server>\``). The `memory/CURRENT_STATE.md` template mentions Hindsight on lines 3, 75 and 78.

**Root `README.md`:**
- lines 41–42 and 52: setup creates "the Hindsight memory bank";
- line 93: no skills for Hindsight;
- lines 175–178: "Approve the Hindsight server", and his yes for a new bank;
- "Install on this Mac (one time)" (lines 143–165) covers plugin install commands only, nothing about Hindsight.

**Root `AGENTS.md`:**
- line 13: Hindsight "through its own MCP tools";
- line 200: shared skills say "Hindsight's retain and recall tools";
- line 274: "Hindsight memory has no toolkit skills";
- line 289: no writing to Hindsight banks in tests.

**Notes in `dev/`:**
- `dev/archive/research/hindsight.md` covers the local install. Section 14 lists things not to use. Line 59 lists the `hindsight-admin` commands (`backup`, `export-bank`, `import-bank`). Line 396 covers re-downloading models on a new machine.
- `dev/research/skills-first-architecture.md` line 141: MCP tools "on the project's bank at `127.0.0.1:8…`".
- New-computer and backup notes for V2: none. `dev/archive/model/final-review.md` covers backups and machine-setup, but only for the retired program.

### 3. What V2 has today for each item Mike lists

| Item | What V2 has |
| --- | --- |
| **Setup** | Yes, local only: `interview.md`, `hindsight.md`, `installing-hindsight.md`. Hindsight is offered only when `127.0.0.1:8888` answers. There is no remote address, no access key, no reuse of an existing bank, and no save-and-recall test (it is forbidden: "Never `retain` a test memory"). |
| **Repair** | No repair command. "Update the toolkit" (`update.md` step 5) compares the bank's tool list and MCP entries and fixes them after his yes. "Setup stopped part way" resumes at step 7. |
| **Doctor ("check the setup")** | `SKILL.md` lines 33–41 plus `finishing.md` final checks, which include `hindsight.md` "Check". All of it calls `127.0.0.1:8888`. |
| **Backup** | Nothing (by Mike's decision). |
| **New-computer instructions** | README "Install on this Mac" (plugins only), and `installing-hindsight.md` (installs a local server). Nothing for moving memory or for a VPS. |
| **Bank naming** | `hindsight.md` lines 53–74 (see section 2). The ID is stored in `PROJECT.md`. |
| **Dashboard** | Nothing. The memory rule says "Hindsight's own interface" with no address. |

### 4. The old installed copy (reference only)

- **Where it is:** `~/.claude/plugins/cache/toolkit-v2/toolkit/0.3.1` and `~/.codex/plugins/cache/toolkit-v2/toolkit/0.3.1`. The two copies are the same (`diff -rq` found no difference). The memory plugin 0.3.1 sits beside it in both. `~/.config/toolkit-v2/plugin-root` and `~/.local/bin/toolkit` no longer exist.
- **Bank naming:**
  - project key = `keyFromName(name)` = `slugify(name, 40)` (`lib/project/setup.mjs` lines 84–88; `lib/core/util.mjs` line 24);
  - bank ID = `hs.bank || bankIdFor(key)` (`lib/project/init.mjs` line 260);
  - `bankIdFor` (`lib/hindsight/bank.mjs` lines 67–73): lower case, any character outside `[a-z0-9-]` becomes a dash, `p-` in front when it does not start with a letter, at most 60 characters;
  - when the ID is taken, it tries `<id>-2` up to `-20` (`MAX_SUFFIX`, lines 42 and 133);
  - the allowed pattern is `^[a-z][a-z0-9-]{0,62}$` (`lib/hindsight/client.mjs` line 33);
  - each bank's `retain_mission` carries the line `toolkit-v2 project key: <key>` (`bank.mjs` lines 41 and 49). That is how it reused the same project's bank and avoided creating a second one.
- **Bank ID storage:**
  - `.toolkit.json` → `"hindsight": { "url": "http://127.0.0.1:8888", "bank": "<id>" }` (`lib/memory/hindsight.mjs` line 3; `init.mjs` line 263);
  - plus `<git common dir>/toolkit-v2/hindsight-meta.json` and a lock folder.
- **Memory commands:**
  - `toolkit memory save, find, get, list, approve, reject, retire, restore, rename, delete, merge, split, tidy, promote, focus, glossary, reindex, status, export, import` (`lib/commands/memory.mjs` line 190);
  - `toolkit hindsight ensure-bank | health | service install|status|start|stop` (`lib/commands/hindsight.mjs`);
  - plus `doctor` (`lib/project/checks.mjs` lines 709–723), `export`, `handoff-backup`, and `machine-setup` (`lib/project/machine.mjs` lines 385–399, a local health check only).
- **Where saves went:** it wrote no MCP entries into projects. Each bank's MCP tools were set to read-only (`READ_ONLY_MCP_TOOLS`, `bank.mjs` lines 28–30). Saves went through `toolkit memory save` over the server's web interface, with `retain_extraction_mode: chunks` and observations off.
- **Remote server:** refused. `assertLocalUrl` (`client.mjs` lines 83–104) rejects any host other than 127.x, localhost or ::1 with "Toolkit V2 uses only a local Hindsight server … never Hindsight Cloud." The client sent no `Authorization` header (0 matches).
- **Backup:** an automatic memory export to `<backup.dir>/<project key>-<date>/memory-export/` at work-finish and handoff. A new computer used `toolkit memory export --to`, then `toolkit memory import --from` (`memory/0.3.1/skills/memory-tidy/references/memory-hindsight.md` lines 110–125).
- **Checking a bank existed:** comments in the old code say that on server 0.10.1, `/config` returns `200` for a bank that was deleted. So it checked the bank list instead (`client.mjs` lines 11–12 and 237–243). V2's 404 check on `/config` does not allow for this.

### 5. Active work item

- **Issue #1 (TK-1, open, testing stage, waiting on owner).** Hindsight lines:
  - "Hindsight through its own tools";
  - the "GitHub + Hindsight" test scenario;
  - "Hindsight has no toolkit skills … tagged `wi:<ID>`";
  - "In Hindsight projects [Current State] stays a small local file";
  - "Test data to delete in Notion and Hindsight (needs the owner's yes)".
- **Issues #2–#10** do not mention Hindsight. No issue mentions the VPS, a dashboard or the coding-agent add-on.
- **`<v2-build>/dev/PROGRESS.md`:**
  - line 146: Claude Code onboarding passed with bank `tkv2-test-ios-github`;
  - line 181: the Claude Code re-run is blocked by a test-home sign-in;
  - lines 375–378 and 906: about 20 test banks plus `hindsight-v2-research` wait for Mike's yes to delete;
  - lines 576–587: the local install and LaunchAgent are done.
  - The "Now" section (2026-10-01, about 17:10) has nothing on Hindsight.

### 6. Test setup facts

**Test homes:**
- `~/.toolkit-v2-test-homes/claude`: `.claude.json` has an account entry, last modified Oct 1 15:11; `toolkit@toolkit-v2` 0.4.9 installed.
- `~/.toolkit-v2-test-homes/codex`: `auth.json` dated Sep 30; toolkit 0.4.9 in its cache.
- Whether either sign-in is still valid is unknown. I did not run `auth status`, because it can write to the home.

**Earlier Hindsight tests in `<v2-build>/dev/test-runs/`:**
- V2, Claude Code only: `v2-skills-first/cc-onboard-ios-github-hindsight/`. Run 2026-09-30, toolkit 0.4.3, passed. Bank `tkv2-test-ios-github`; project `~/.toolkit-v2-test-projects/claude/ios-money-github`. Its re-run 2 did not run because the test home was signed out.
- `v2-skills-first/cx-routing/` used bank `tkv2-test-routing-cx`. `cc-routing-setup/extracts/hindsight-recall-check.txt` has a recall check.
- There is no Codex Hindsight onboarding test in V2.
- Older runs from the retired program: `d-local-hindsight/`, `confirm-d-hindsight/`, `final-codex-hindsight/` (Codex, 2026-09-27 and 2026-09-28).

**Local server:** up. Healthy, version 0.10.1, LaunchAgent running. It holds 27 banks, all test banks: `acme-crm` up to `-17`, `greet-cli-*`, `proj-p6`, `tkv2-test-ios-github`, `tkv2-test-routing-cc`, `tkv2-test-routing-cx`. No real project under `~/Documents/Projects` uses Hindsight; only the model template mentions it.

**VPS API (`https://memory-api.mrihm-memory.com`):**
- `/health` is healthy; `/version` is 0.10.2 with observations off.
- `/v1/default/banks` without a key returns **401**, so an access key is needed.
- `GET /mcp/` returns `{}` with 200. On the local 0.10.1 server, the code returns that answer before any key check or bank lookup (`hindsight_api/api/mcp.py` lines 431–440). So my one probe of `/mcp/tkv2-probe/` very likely created nothing. The VPS runs 0.10.2, so this is not proven there.

**Dashboard (`https://memory.mrihm-memory.com`):**
- It is the "Hindsight Control Plane". Every page redirects to `/login`, which asks for an access key.
- Its script code builds bank links as `/banks/${encodeURIComponent(bankId)}`. Opening `/banks/<id>` without signing in redirects to `/login?returnTo=%2Fbanks%2F<id>`.
- So the link is very likely `https://memory.mrihm-memory.com/banks/<bank-id>`. It is not confirmed after sign-in; that needs Mike.
- The page text also mentions bank "Aliases": "Extra ids that also reach {bankId}". Whether the server supports aliases is unknown.

**Access keys:** `HINDSIGHT_API_KEY`, `HINDSIGHT_API_TOKEN`, `HINDSIGHT_TOKEN`, `HINDSIGHT_URL` and `HINDSIGHT_API_URL` are all unset in this shell.
- Claude Code `.mcp.json` can fill `url` and `headers` from environment variables (`${VAR}`): `/Users/michaelrihm/Documents/Projects/claude-toolkit/ai-external-knowledge/claude-code/mcp.md` lines 613–640.
- Codex supports `mcp_servers.<id>.bearer_token_env_var` and `env_http_headers`: `<v2-build>/ai-external-knowledge/codex/config-reference.md` lines 590–611.
- Where Mike keeps the key is unknown and his choice.

**Coding-agent add-on:** not installed.
- There is no `~/.hindsight/coding-agent.json`.
- No Hindsight entries are in `~/.claude/settings.json`, `~/.claude.json` or `~/.codex/hooks.json`.
- `~/.codex/config.toml` has one trusted-project entry for `/Users/michaelrihm/Documents/ChatGPT/Hindsight Hosted Local Server`, which is an empty Git repository with no commits.

**Coding-agent package (`@vectorize-io/hindsight-coding-agents` 0.8.0, from the public package listing):**
- Default bank ID: `coding-agent::{gitProject}`, one bank per repository shared by all agents. V2's rule allows only letters, digits and hyphens, so `::` breaks it.
- `mapPathToBank` maps a folder path to a bank (longest match wins; worktrees use their main checkout's bank). `optInOnly` with `optInPaths` keeps it off everywhere else.
- All settings live in one machine-wide file, `~/.hindsight/coding-agent.json`. The readme says there is "deliberately no repo-carried config file".
- Self-hosted mode: `--server self-hosted --api-url`, with `apiToken` or `HINDSIGHT_API_TOKEN` for the key.
- Claude Code install: 3 hooks in `~/.claude/settings.json` and a user-scope `claude mcp add`.
- Codex install: 3 hooks in `~/.codex/hooks.json` plus `[mcp_servers]` in `config.toml`.
- The Stop hook saves each session back to memory after every turn. Its tools are named `hindsight_*`.
- Claude Code warns when one server name is set in two scopes with different addresses (the `mcp.md` file above, line 295). V2's project-level server is also named `hindsight`.

### Steps that need Mike's input or a sign-in (known so far)

- Entering the VPS access key, and choosing where it is stored.
- Signing in to the dashboard to confirm the `/banks/<id>` page.
- His yes to:
  - create test banks on the shared VPS;
  - any model-file change;
  - a new command, if one is still wanted (with its size in lines);
  - each conflict listed in section 1.
- Approving the `hindsight` server in Claude Code, and trusting the project folder and its hooks in Codex.
- Possibly signing in again to the Claude Code test home.

## Part 2: outside facts

### Findings that change the build

- **Observations are turned off on the VPS.** `GET https://memory-api.mrihm-memory.com/version` shows `"observations":false`. The server code sets that value from its observation-consolidation setting (hindsight-api-slim/hindsight_api/api/http.py in the GitHub repo).
  - Both Hindsight integrations recall only the "observation" fact type by default. Claude Code plugin: `recallTypes: ["observation"]`. Unified package: `recallOptions` default `{"types":["observation"]}`.
  - On this server that default will probably return nothing. The build should set recall types to `world` and `experience`. I could not test recall without a key, so the effect is unconfirmed.
  - Sources: https://raw.githubusercontent.com/vectorize-io/hindsight/main/hindsight-integrations/claude-code/settings.json and the coding-agents README (item 5).
- **There are three Hindsight integrations, and their default banks differ.** They are item 5 below.
  - Running the old per-agent plugin and the new unified package together records every conversation twice. Hindsight's own code says so, and its session start prints a warning. Source: hindsight-integrations/coding-agents/src/core/legacy.ts.
- **Integration settings are machine-wide, never per project.** There is deliberately no config file inside a repository. A project's bank can only be set through a path map in a file in the home folder.
- **Dashboard sign-in is a separate secret from the API key.** The dashboard link redirects to a sign-in page. Mike must enter that access key himself. Whether it is the same value as the API key is unknown.

### 1. The VPS API (live, no key)

| Request | Result |
|---|---|
| `GET /health` | 200, `{"status":"healthy","database":"connected",...}` |
| `GET /version` | 200, `{"api_version":"0.10.2", features...}` |
| `GET /docs` | 200, Swagger page titled "Hindsight HTTP API" |
| `GET /openapi.json` | 200, version 0.10.2 |
| `GET /` and `GET /v1` | 404 |
| `GET /v1/default/banks` | **401** `{"detail":"Authentication failed: Invalid API key"}` |
| `GET /v1/default/banks/<id>/stats` and `/config` | **401**, same body |
| `GET /mcp`, `/mcp/`, `/mcp/<id>/` | 200 with body `{}` and no key |
| `GET /sse` | 404 |

- No request returned 403. The server runs behind Caddy and uvicorn.
- 0.10.2 is the newest GitHub release (published 2026-09-29): https://api.github.com/repos/vectorize-io/hindsight/releases/latest
- The unauthenticated 200 on the `/mcp` GET is unexplained. I did not send a POST, so I do not know whether MCP tool calls need a key. Hindsight's docs say a missing key gets 401: https://hindsight.vectorize.io/developer/mcp-server

### 2. API endpoints and key header

Source: the live `/openapi.json` plus https://hindsight.vectorize.io/developer/api/memory-banks. Paths below are relative to https://memory-api.mrihm-memory.com.

- **Key header:** `Authorization: Bearer <key>` (https://hindsight.vectorize.io/developer/configuration, `HINDSIGHT_API_TENANT_API_KEY`). The integration client sends exactly this (coding-agents and claude-code `client.py` in the repo).
- **List banks:** `GET /v1/default/banks?q=<substring>&limit=&offset=` returns `{banks:[{bank_id,name,fact_count,last_write_at,...}],total,limit,offset}`.
- **Check one bank:** `GET /v1/default/banks/{id}/config` (or `/stats`) returns 404 if the bank is missing. The docs say reads of a missing bank return 404 and only writes create banks. I could not test this live without a key.
- **Create a bank:** `PUT /v1/default/banks/{id}` with body `{}`, or `{"name":"...","reflect_mission":"...","retain_mission":"..."}`. It returns 200 with `{bank_id,name,disposition,mission}`.
  - **Creating an existing ID is safe.** It is an upsert, not an error. The server code calls `update_bank` with `create_if_missing=True`, and fields you do not send are left alone. This comes from code only; I did not write to the live server to test it.
- **Retain (save):** `POST /v1/default/banks/{id}/memories` with body:
  ```json
  {"items":[{"content":"...","context":"...","document_id":"...","tags":["..."],"timestamp":"ISO"}],"async":false,"operation_id":"<uuid, optional>"}
  ```
  - The response has `success`, `bank_id`, `items_count`, `async` and `operation_id`.
  - The same `document_id` replaces the earlier document, so a stable ID stops duplicate saves.
  - With `async:true`, poll `GET /v1/default/banks/{id}/operations/{operation_id}`. The status values are pending, processing, completed, failed, cancelled, not_found.
  - Retain waits for fact extraction, which runs on Ollama on the VPS. An async save plus polling is safer for a test.
- **Recall (search):** `POST /v1/default/banks/{id}/memories/recall` with body `{"query":"...","types":["world","experience"],"budget":"low|mid|high","max_tokens":4096,"tags":[],"tags_match":"any"}`. Only `query` is required. The response has `results[{id,text,type,...}]`.
- **Auto-create on write:** a retain to an unknown bank ID silently creates a new bank. A typo or a different naming pattern therefore makes a second bank. Source: the memory-banks docs page above.

### 3. MCP

Source: https://hindsight.vectorize.io/developer/mcp-server and hindsight-docs/docs/developer/mcp-server.md in the repo.

- **Remote address, single-bank (recommended):** `https://memory-api.mrihm-memory.com/mcp/<bank_id>/`. The bank is in the path. Tools have no bank argument.
- **Remote address, multi-bank:** `/mcp/` with an `X-Bank-Id` header, or a `bank_id` argument on each tool. It adds `list_banks`, `create_bank` and `get_bank_stats`.
- **Bank choice order:** URL path, then the `X-Bank-Id` header, then the server's `HINDSIGHT_MCP_BANK_ID`.
- **Key:** `Authorization: Bearer <key>`.
- **Claude Code `.mcp.json`:** `${VAR}` expansion works in `url` and `headers`. Entries need `"type":"http"`. Do not name the variable `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN`, because Claude Code blanks credential-looking names in remote headers. `HINDSIGHT_API_KEY` is fine.
  ```json
  {"mcpServers":{"hindsight":{"type":"http","url":"https://memory-api.mrihm-memory.com/mcp/<bank_id>/","headers":{"Authorization":"Bearer ${HINDSIGHT_API_KEY}"}}}}
  ```
  - A project `.mcp.json` server shows "Pending approval" until Mike approves it once in an interactive `claude` session.
  - Source: https://code.claude.com/docs/en/mcp (sections "Environment variable expansion" and "Project server approvals").
- **Codex `config.toml`:** the HTTP server options are `url` and `bearer_token_env_var`. Codex reads the token from that environment variable and sends it as `Authorization`.
  ```toml
  [mcp_servers.hindsight]
  url = "https://memory-api.mrihm-memory.com/mcp/<bank_id>/"
  bearer_token_env_var = "HINDSIGHT_API_KEY"
  ```
  - A project-level `.codex/config.toml` works for trusted projects only.
  - Sources: https://learn.chatgpt.com/docs/extend/mcp and https://learn.chatgpt.com/docs/config-file/config-reference. The repo capture has the reference at `ai-external-knowledge/codex/config-reference.md` (lines about `bearer_token_env_var`).
  - The repo has no captured MCP page for either host. I fetched the live pages instead.
- **Not verified:** whether the server accepts a bank ID containing `::` or `%3A` in the `/mcp/<id>/` path. Safest: use plain bank IDs of letters, digits and hyphens, or use the header.
- **Not verified:** whether the desktop apps pass shell environment variables to the host. Test it.

### 4. Dashboard bank address

- **From code (confirmed):** the bank page is `hindsight-control-plane/src/app/[locale]/banks/[bankId]/page.tsx`. The helper in `src/lib/bank-url.ts` builds the link as `/banks/${encodeURIComponent(bankId)}`.
  - The locale is never in the path (`localePrefix: "never"` in `src/i18n/routing.ts`).
  - Optional query: `?view=home|recall|reflect|data|documents|entities|knowledge|profile`.
  - The bank ID is read back with `decodeURIComponent` (`src/lib/bank-context.tsx`).
  - Source: https://github.com/vectorize-io/hindsight/tree/main/hindsight-control-plane
- **From the live site (confirmed):** the link shape to use is `https://memory.mrihm-memory.com/banks/<encoded bank id>`.
  - `GET /` returns 307 to `/login?returnTo=%2F`.
  - `GET /banks/zz-made-up-bank-id` returns 307 to `/login?returnTo=%2Fbanks%2Fzz-made-up-bank-id`.
  - A `::` bank (`/banks/coding-agent%3A%3Azz-made-up`) also returns 307 to the login page, with the encoded ID kept in `returnTo`.
  - **`?view=documents` is dropped** in the redirect, so a deep tab link loses its tab after sign-in.
  - `/login`, `/api/health` and `/api/version` return 200 without a key. `/api/version` reports `access_key_auth: true`.
- **Dashboard login:** it uses `HINDSIGHT_CP_ACCESS_KEY`, shown in https://hindsight.vectorize.io/developer/installation and https://github.com/vectorize-io/hindsight/issues/1148. It is separate from the API key.
- **Unknown:** what the dashboard shows for a bank that does not exist, since I cannot sign in.

### 5. Hindsight's coding-agent integrations

**A. Old Claude Code plugin `hindsight-memory` 0.7.5.** Install: `claude plugin marketplace add vectorize-io/hindsight`, then `claude plugin install hindsight-memory`.
- **Source:** https://github.com/vectorize-io/hindsight/tree/main/hindsight-integrations/claude-code
- **Settings:** `~/.hindsight/claude-code.json` plus environment variables. This is machine-wide with no project file.
- **Bank:** a single static bank `claude_code` by default. `HINDSIGHT_BANK_ID` or `bankId` changes it.
  - `dynamicBankId:true` gives `claude-code::<project>`. The project name is the git repository basename and is worktree-aware.
  - `directoryBankMap` (directory to bank) and `bankIdPrefix` exist.
- **Saving:** automatic. The Stop hook retains the whole session transcript every 10 turns (`retainEveryNTurns`). It also does auto-recall on every prompt. The README says tool calls are retained, but the shipped `settings.json` says `retainToolCalls:false`.
- **Self-hosted:** `hindsightApiUrl` plus `hindsightApiToken` (or `HINDSIGHT_API_URL` and `HINDSIGHT_API_TOKEN`). The default URL is empty, which starts a local daemon.
- **Off switches:** `autoRetain:false`, `autoRecall:false`, or `enableKnowledgeTools:false`.

**B. Old Codex integration (settings say 0.3.1).** Install: `curl -fsSL https://hindsight.vectorize.io/get-codex | bash`.
- **Source:** https://github.com/vectorize-io/hindsight/tree/main/hindsight-integrations/codex
- **Install:** scripts go in `~/.hindsight/codex/`, hooks in `~/.codex/hooks.json`, and `codex_hooks = true` in `config.toml`.
- **Settings:** `~/.hindsight/codex.json`, machine-wide.
- **Bank:** static `codex` by default. Dynamic gives `codex::<working-folder name>`. This is not worktree-aware and has no `directoryBankMap`.
- **Saving:** automatic on Stop, every 10 turns, with tool calls retained.
- **Self-hosted:** the same URL and token keys as A.
- **Off:** `autoRetain:false`.

**C. Unified package `@vectorize-io/hindsight-coding-agents` 0.8.0 (npm, published 2026-09-29).** It says it replaces A and B.
- **Source:** https://hindsight.vectorize.io/sdks/integrations/coding-agents (the README at hindsight-integrations/coding-agents/README.md in the repo).
- **Install:** `npx @vectorize-io/hindsight-coding-agents install claude-code` or `install codex`.
  - Claude Code gets three hooks in `~/.claude/settings.json` plus `claude mcp add` at user scope. That MCP server is a local node process, not the VPS `/mcp` address.
  - Codex gets hooks in `~/.codex/hooks.json` plus `[mcp_servers.hindsight]` in `config.toml`.
  - The installer backs up files it touches as `<file>.hindsight-backup`.
  - `--server self-hosted --api-url https://memory-api.mrihm-memory.com` skips the question. **The default if nothing is set is Hindsight Cloud**, so a run without a config would send transcripts there.
- **Settings:** one file, `~/.hindsight/coding-agent.json`.
  - Environment variables are only a fallback (`HINDSIGHT_API_URL`, `HINDSIGHT_API_TOKEN`). The file wins when it sets a value.
  - `HINDSIGHT_CONFIG` moves the file.
  - It states there is no per-repo config file on purpose.
- **Bank naming:** the default template is `coding-agent::{gitProject}`. Claude Code and Codex share one bank per repository.
  - A project can set its own bank. In order of priority: `mapPathToBank` (absolute path to bank ID; longest prefix wins and it overrides everything), then `bankId`, then `bankIdTemplate`.
  - `banks.<resolvedId>.bank` renames a bank. `paths.<prefix>` overrides the server and token per directory.
  - `optInOnly:true` plus `optInPaths` makes every other folder inert.
- **Saving:** automatic with no setup command.
  - Every Stop writes the session transcript (`retainSessions`, default true). Extraction is concise by default.
  - Session start also seeds from git history (`autoSeed`, `gitIngest:"message"`).
  - It runs a one-time codebase survey with the user's own CLI (`codebaseSurvey` true, `surveyModel` haiku, `surveyBudgetUsd` 2). This spends Claude or Codex usage, not an OpenAI key.
  - It injects a low-budget reflect on the first prompt (`autoInject:"reflect"`).
  - Knowledge pages refresh hourly.
- **Off switches:** `disabled:true`, `retainSessions:false`, `autoSeed:false`, `codebaseSurvey:false`, `gitIngest:"none"`, `autoInject:"none"`, `manageBankConfig:false`, `banks.<id>.disabled`. `uninstall all` removes only what install added.
- **Two writers, one bank, repeated memory:**
  - A and B plus C together write every transcript twice. Hindsight confirms this in `legacy.ts`.
  - A and B with defaults use `claude_code` and `codex`, and `dynamicBankId` gives `claude-code::x` and `codex::x`. C alone gives `coding-agent::x`. Each differs from any Toolkit V2 bank name, and a write to an unknown ID creates a bank silently.
  - C's hooks are installed machine-wide. They apply to every project unless `optInOnly` is on.
  - On a shared bank, the server's `document_id` upsert and its deduping of similar facts stop exact repeats. Toolkit saves and transcript write-back still mix raw transcripts with curated records in one bank unless `retainSessions:false`.

### 6. OpenAI key on the client

No client-side OpenAI key is needed. Confirmed from code and docs.
- **Code:** the unified package's `OPENAI_API_KEY` appears only in `core/daemon.ts` (lines 114 and 350), for local daemon mode. The config, bank, hook and client code has no OpenAI use.
- **Docs:**
  - The Claude Code plugin README says an external API means "No local LLM needed — the server handles fact extraction".
  - The plugin's `llmProvider` and `llmModel` settings are ignored for an external server.
  - Server-side Ollama is `HINDSIGHT_API_LLM_PROVIDER=ollama` with `HINDSIGHT_API_LLM_BASE_URL=http://localhost:11434/v1` and no key. Source: https://hindsight.vectorize.io/developer/models
- **Server side, unknown:** the VPS's embedding provider. The default is local SentenceTransformers with no key, but I cannot read the server's settings. `bank_llm_health:false` means the server's per-bank LLM probe is off.

### Unknown, and how I tried

- **MCP key requirement:** unknown. A key-free GET returned 200 `{}`, and I did not POST.
- **Live bank list, create, retain and recall:** not tested. Every `/v1` call needs a key, so these come from the OpenAPI file and the code.
- **Dashboard sign-in:** the access key's value and the session lifetime are unknown.
- **Local state:** `~/.hindsight` contained only a `logs` folder when I looked (read-only). No `claude-code.json`, `codex.json` or `coding-agent.json` was there.

### Steps that will need Mike

- Enter the API key himself, as `HINDSIGHT_API_KEY`.
- Sign in to the dashboard with its access key.
- Approve the project `.mcp.json` server in Claude Code once.
- Trust any changed hooks in Codex `/hooks`.
- Approve setup changes to `~/.claude` and `~/.codex`, if the unified package is used.

### Files read

- Scratch copies of the OpenAPI file and the GitHub sources, in `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-toolkit-v2/c5895307-8bd5-4391-b4b0-35e85e6820e1/scratchpad/`.
- Repo captures under `/Users/michaelrihm/Documents/Projects/toolkit-v2/.claude/worktrees/v2-build/ai-external-knowledge/codex/config-reference.md` and `.../claude-code/claude-directory.md`.

# Lore (makenotion/lore): research brief for Toolkit V2 Notion memory

Researched 2026-09-27. Source studied: `github.com/makenotion/lore` at commit
`6e741b1bb91a36b47213f4d3af5bbdfaa2f2081d` (2026-09-02, "Merge pull request
#965"), cloned with `git clone --depth 50`. Every path below is inside that
clone unless it starts with `plugins/` or `dev/` (those are Toolkit V2 paths).

Markers:

- **Verified**: run or checked on Mike's Mac on 2026-09-27.
- **Source**: read in Lore's code or its own docs at the commit above.
- **GitHub**: read from the live repository with `gh` (issues, pull requests).
- **Docs (Claude Code)**: the captured Claude Code pages in
  `claude-toolkit/ai-external-knowledge/claude-code/` (captured 2026-09-22).

Nothing in Mike's Notion workspace, the toolkit code, or any configuration was
changed for this brief. No Lore command was run against Notion.

---

## 1. Short answers

| Question | Answer |
| --- | --- |
| What Lore is | A Notion-backed memory system for AI assistants: an MCP server (9 tools), a CLI (`lore`), and hook commands for Claude Code and Codex. MIT license, by Notion Labs, Inc. (`package.json`, `LICENSE`). |
| Install | `npm install -g @notionhq/lore` gives the `lore` command. Node 20 or later. Version 1.0.0 is on npm (**Verified**: `npm view @notionhq/lore` returns 1.0.0, published 2026-08-04). `npx @notionhq/lore <command>` also works. Mike has Node 25.8.1 (**Verified**). |
| What it stores | Five Notion databases inside one "vault" page: Projects, Topics, Memories, Entities, Facts. A memory is a row in Memories; its text is the page body in Markdown (section 3). |
| Creates or expects | Both. `lore init <page-id>` creates the five databases inside a page and writes `.lore.yaml`. After that, every command expects all five as direct child databases of that page and stops if one is missing (`src/notion/setup.ts`). |
| Per-project memory | Yes, by giving each project its own vault page. The vault is chosen by `vault.pageId` in a `.lore.yaml` file per repository (found by searching upward from the working folder) or by the `LORE_CONFIG_ROOT` environment variable. Inside one vault, `projects:` in `.lore.yaml` maps folders to rows of the Projects database. |
| Auth | A Notion token from `NOTION_API_TOKEN` (a Personal Access Token from `notion.so/developers/tokens`), otherwise `~/.config/notion/auth.json` written by `ntn login` in file mode (`NOTION_KEYRING=0`). No OAuth flow. Mike's current `ntn` login is in the macOS Keychain, which Lore cannot read (**Verified**: no `auth.json` in `~/.config/notion/`). |
| Semantic search for Mike | Does not work with Lore's defaults. Its default search calls Notion's internal endpoint `POST /v1/tools/run`, which Notion support confirmed is not available to external users (**GitHub** issue #962). The fix is `LORE_USE_RUNTOOL=0` (or `features.runTool.enabled: false` in `.lore.yaml`), which falls back to Notion's public search. |
| Fits the toolkit contract | Partly. Lore has save, update, search, list, archive (to trash), status. It has no get-by-key, no version check on write, no retire-and-restore pair, no link repair, no current focus, no glossary, and its memory kinds are not the model's five types (section 7). |
| Recommendation | Option C: keep the toolkit's own Notion memory driver and its one command set, and change what it writes to Lore's vault layout and Memories columns, so Lore's own tools can read the same memories later. Keep Lore's autosave and wake-up hooks off. Details in section 8. |

---

## 2. Version, activity, and who maintains it

- Latest release: **1.0.0, 2026-08-04**, "Lore is now available publicly on
  npm as `@notionhq/lore`" (`CHANGELOG.md`). The Unreleased section is empty.
- Release pace: 0.9.0 and 0.10.0 on 2026-05-01, then 0.11.0 to 0.19.1 between
  2026-05-03 and 2026-06-19, then 1.0.0 on 2026-08-04 (`CHANGELOG.md`).
- Since the 1.0.0 release commit the main branch has only a few small changes:
  OMP host support and npm publishing in CI (2026-08-04), and a clearer 403
  message from an outside contributor (merged 2026-09-02) (`git log`).
- Repository: created 2026-04-15, 158 stars, 12 forks, 15 open issues and pull
  requests, last push 2026-09-08 (**GitHub**).
- Maintainer: 58 of the last 59 commits are by one person, Hesham Salman
  (GitHub `Iron-Ham`) (`git log`).
- Size: 501 TypeScript files, about 117,000 lines of non-test code under `src/`.
- Lore's own stability rules (`AGENTS.md`, "Non-Negotiables"): do not rename
  database properties; keep the five-database core schema; adding properties is
  allowed; do not remove MCP tools without deprecating first.

Open items that matter for Mike (**GitHub**):

- Issue #962: semantic search returns 403 for every external user (section 9).
- Pull request #966 (maintainer, open): when that 403 happens, hand the search
  to the host's official Notion MCP (`notion-ai-search`) instead.
- Pull request #964 (outside contributor, open): fall back to public search on
  that 403.
- Issue #968: the MCP server is stdio only; no HTTP transport.

---

## 3. What Lore stores and how

Source: `src/notion/schema.ts`, `src/notion/setup.ts`, `README.md` ("Data
Model").

### 3.1 The vault

A vault is one Notion page. Its direct child blocks must include five
databases. `lore init <page-id>` creates them in this order, because each
relation needs the database it points at (`AGENTS.md`, "Repo At A Glance"):

1. Projects
2. Topics (relation to Projects)
3. Memories (relations to Projects and Topics; three relations to itself are
   added right after creation)
4. Entities (relations to Projects and Memories)
5. Facts (relations to Projects, Memories, and Entities)

`lore init` with no page id creates a new workspace-level page named
`Lore Vault - <folder name>`. `lore migrate` adds missing properties to an
existing vault. When Lore loads, it lists the page's child blocks, matches the
databases by title, and, for any title it cannot find, identifies a renamed
database by its property names and types (`resolveVaultDatabases` in
`src/notion/setup.ts`). A database nested inside a toggle or a column is not
found, because only top-level child blocks are read.

### 3.2 Database properties

**Projects**: Name (title), Type (select: project, person, agent), Path (text),
Status (select: active, archived), Description (text).

**Topics**: Name (title), Project (two-way relation to Projects, many to many),
Description (text).

**Memories** (`MEMORY_PROPS`):

| Group | Properties |
| --- | --- |
| Identity | Title (title), Synopsis (text, 150 characters by default, 500 at most), Keywords (free text, indexed by Notion search), Tags (multi-select; the allowed values come from the active profile) |
| Classification | Kind (select: note, decision, incident, runbook, postmortem, policy, state, operational, task, procedure), Status (select: informational, proposed, accepted, superseded, deprecated, rejected), Source (select: conversation, autosave_learning, file, manual, agent_diary, digest) |
| Scope | Project (relation), Topic (relation), Scope Kind (select: team, project, user, agent, role, session, run, environment, global), Scope Key (text), Audience (text), Lifetime (select: persistent, expires, session-only, until-task-closed, until-decision-superseded), Expires At (date), Expires On (text) |
| Links | Supersedes, Affects, Compared With (relations to other Memories rows) |
| Authorship | Author (text), Agent (text), Session (text) |
| Revisions | Topic Key (text such as `decision/jwt-auth`), Revision Count (number), Compare Notes (text), Promotion Source Key (text) |
| Dates | Review By, Done At, Decided At, Last Referenced At (dates) |
| Decisions and tasks | Alternatives, Consequences, Blocked By, Entity (text), Task State (select: open, in-progress, blocked, done, cancelled) |
| Pinned context | Pinned (checkbox), Pinned Priority (number), Mutability (select: mutable, read-only) |

Fresh vaults no longer get the old `Confidence` and `Confidence Score` columns
on Memories (`CHANGELOG.md` 0.19.0).

**Entities**: Name (title), Aliases (one text cell, comma separated), Kind
(select from the profile: class, function, file, workflow, pr, task-id,
person, system), Description (text), Project (two-way relation), Source
(relation to Memories).

**Facts**: Subject (title), Predicate (select), Object, Project, Source
(relation to Memories), Confidence, Confidence Score, Valid From, Valid Until,
Observed At, Invalidated At, Invalidated By, Review By, Last Referenced At,
DedupKey, SubjectKey, SubjectEntity and ObjectEntity (relations to Entities).

### 3.3 Page body

- A memory's `content` is Markdown written as the page body with Notion's
  Markdown endpoints (`pages.updateMarkdown`, `pages.retrieveMarkdown`). The
  page is created with its properties first and the body is written second; if
  the body write fails, Lore moves the half-made page to the trash
  (`src/core/memory-create.ts`).
- Lore adds its own blocks to the body over time: `## Revision N (date)` for
  each save to an existing Topic Key, `## Re-keyed (date)`,
  `## Reviewed (date)` for inbox approvals, `## Promoted from <vault>`,
  `## Deprecated`, and one-line audit notes such as
  `> Pinned <date> by <author>: <reason>` (`src/core/memory-topic-key.ts`,
  `docs/mcp-tools.md`).
- Decisions are Memories rows with Kind `decision`; tasks are rows with Kind
  `task` (`docs/mcp-tools.md`).

### 3.4 How memories are saved, found, updated, and retired

| Step | What Lore does | Source |
| --- | --- | --- |
| Save | `lore-memory action='save'` creates a new row. With `topicKey` (only for decision, runbook, incident, postmortem, policy kinds) a save to an existing key appends a `## Revision N` block instead of creating a row. With `subject` and `replace: true` it keeps one `state` row per subject and appends revisions. Autosave notes get a duplicate check first. | `docs/memory-workflows.md`, `src/mcp/tools/memory/schema.ts` |
| Find | `lore-query action='search'` with `mode` contains, semantic (default), or hybrid. Contains mode filters the Memories database on Title and Keywords. Semantic mode uses the internal RunTool search, or Notion's public `search` endpoint when RunTool search is off. Results are title rows with short-lived handles such as `rs_…:m1`; `lore-memory action='expand'` fetches up to 20 bodies. | `docs/mcp-tools.md`, `src/core/memory-search.ts` |
| List | `lore-query action='recall'` with filters for project, topic, source, kind, status, up to 100 rows with a cursor. Default reads hide Status `proposed` and `rejected` rows, `agent_diary` and `digest` sources, and `task` and `operational` kinds. Superseded and deprecated rows still show. | `docs/mcp-tools.md`, `src/core/memory-review-state.ts` |
| Update | `lore-memory action='update'` changes title, body (replaced whole), tags, synopsis, status, kind, supersedes and affects relations, expiry, scope. | `src/mcp/tools/memory/schema.ts`, `src/core/memory-update.ts` |
| Retire | For decisions: `lore-decision action='supersede'` or `lore-memory action='compare' verdict='supersedes'`. For other memories: set Status `superseded` with `update`, or archive. | `docs/memory-workflows.md` |
| Archive | `lore-memory action='archive'` sets Notion's `archived: true`, which moves the page to the Notion trash (restorable by hand for 30 days). There is no MCP or CLI action to bring it back. | `src/core/memory.ts` |

---

## 4. Scoping: one store per project or one shared store

- **One vault per page.** Each vault is its own set of five databases.
  Nothing is shared between two vaults unless `.lore.yaml` names another vault
  under `upstreamVaults` (read-only) or `promotionTargets` (copy on request)
  (`README.md`, "Configuration"; `docs/topology.md`).
- **Choosing the vault.** Lore reads `vault.pageId` from `.lore.yaml`. It finds
  that file by searching upward from the working folder, or reads it from the
  folder named in `LORE_CONFIG_ROOT` (`src/config.ts` `findConfigFile`,
  `src/services.ts`). There is no command-line flag for the vault on the MCP
  server; `lore init <page-id>` writes it into `.lore.yaml`.
- **Projects inside a vault.** `projects:` in `.lore.yaml` maps sub-folders to
  names; the longest matching path wins, and a path of `.` matches everything
  (`src/core/context.ts`). The match is looked up by name or path in the vault's
  Projects database. Lore never creates a Projects row by itself outside its
  eval commands; with no `projects:` entry, memories are saved with no Project
  relation and reads cover the whole vault.
- **Scope on a row.** The `scope` input narrows who sees a row (user, agent,
  session, and so on), driven by environment variables such as
  `LORE_USER_NAME` (`docs/mcp-tools.md`, "Scope and lifetime").
- **Rule for `.lore.yaml`.** Lore's policy is that `.lore.yaml` is local only and
  never committed, even when it holds no secret (`README.md`; its own repository
  refuses a staged `.lore.yaml` with `tools/check-lore-config.mjs`). Any
  `auth.token` in the file is rejected.
- **For Toolkit V2.** Mike's decision (each project has its own Memory database
  under its own row, nothing shared) maps to one vault per project. The vault
  page can be a "Memory" page under the project's row, so the five Lore
  databases sit inside that page and the project row itself still shows only
  Work Items and Memory. A Git-ignored `.lore.yaml` is found by the upward
  search only from inside the main checkout; a worktree outside the main
  checkout folder needs `LORE_CONFIG_ROOT` pointing at the main checkout.

---

## 5. Authentication and what Mike must do

Source: `README.md`, `AGENTS.md` ("Authentication"), `src/config.ts`
`resolveAuth`, `src/auth/ntn.ts`, `src/auth/AGENTS.md`.

- Lore looks for a token in this order:
  1. `NOTION_API_TOKEN` environment variable. The intended value is a Personal
     Access Token (prefix `ntn_`) created at `notion.so/developers/tokens`.
  2. `~/.config/notion/auth.json`, the file `ntn login` writes when
     `NOTION_KEYRING=0` is set. `ntn` normally stores the token in the macOS
     Keychain, and Lore does not read the Keychain.
- Internal integration tokens (`secret_…`) are refused at start-up while any
  RunTool feature is on, and Lore's docs tell teams not to use them.
- There is no OAuth sign-in in Lore. `src/auth/oauth.ts` only maps environment
  names to API addresses and checks access to the vault page.
- `lore auth --login` and `lore install --ntn` can install `ntn` for you (a
  pinned release from `ntn.dev`, checked by SHA-256) and run `ntn login` with
  `NOTION_KEYRING=0`.
- Lore reads `auth.json` in a format that `ntn` does not document; Lore's own
  comment says so and tests against `ntn` 0.12.0 or later (`src/auth/ntn.ts`).
  Mike has `ntn` 0.23.10 (**Verified**).
- **Verified on this Mac:** `~/.config/notion/` holds `cache.json`,
  `config.json`, and `workspaces.json`, and no `auth.json`. `NOTION_API_TOKEN`
  is not set. So Lore cannot use Mike's current sign-in as it is.

What Mike must do himself, only if Lore's own CLI or MCP server is used (not
needed for option C's core path, which keeps using the toolkit's `ntn api`
calls):

- Either create a Personal Access Token at `notion.so/developers/tokens` and
  put it in his shell profile as `NOTION_API_TOKEN`,
- or run `NOTION_KEYRING=0 ntn login` in a terminal and sign in in the browser.
  Whether the Keychain sign-in the toolkit uses keeps working beside the file
  sign-in is not yet tested.

---

## 6. Interfaces

### 6.1 MCP server

`lore mcp` starts the server over stdio only (`src/mcp/server.ts` uses
`StdioServerTransport`). Every tool returns Markdown text; no tool declares a
structured output schema. Nine tools, each with an `action` input
(`docs/mcp-tools.md`, `src/mcp/tools/`):

| Tool | Actions | Main inputs |
| --- | --- | --- |
| `lore-context` | `status`, `wake-up`, `digest` | wake-up: `mode` (full, task-only), `projectName`, `limit`, `userQuery`, `governanceContext`, `includeExpired`, `debug`; digest: `period`, `since`, `until` |
| `lore-memory` | `save`, `update`, `archive`, `expand`, `search`, `history`, `suggest-topic-key`, `compare`, `approve`, `reject`, `promote` | save: `title`, `content`, `projectName(s)`, `topicName`, `source`, `kind`, `status`, `tags`, `keywords`, `synopsis`, `topicKey`, `subject`+`replace`, `scope`, `expiresAt`, `reviewBy`, `author`, `agent`, `session`; update: `memoryId` plus the fields to change, `supersedesIds`, `affectsIds`; archive: `memoryId`; expand: `ids` (up to 20) |
| `lore-query` | `recall`, `search`, `ask`, `audit` | recall: filters, `limit` up to 100, `startCursor`; search: `query`, `mode`, `strategy`, `tags`, `limit` up to 50, `explain`, `intent`; ask: `entity`, `asOf`, `includeHistory` |
| `lore-fact` | `create`, `invalidate`, `extend` | subject, predicate, object; a supporting memory (`sourceMemoryId`, or `agent` plus `session`) is required |
| `lore-decision` | `create`, `list`, `get`, `context`, `supersede`, `review` | statement, rationale, alternatives, consequences, `affects`, `reviewBy` |
| `lore-task` | `create`, `update`, `close`, `close-many`, `list`, `reconcile` | subject, description, state, blocker, due date |
| `lore-pinned` | `pin`, `unpin`, `update`, `list` | priority, audience, mutability |
| `lore-procedure` | `scan-candidates`, `propose`, `deprecate` | steps, at least two source memories |
| `lore-project` | `list`, `get` | status |

(`lore-memory action='search'` is in the input schema but not in
`docs/mcp-tools.md`.)

### 6.2 CLI

From `docs/cli.md`; `--json` exists on the commands marked (json).

- Setup and health: `lore init [page-id]`, `lore install`, `lore auth --login`
  and `--status`, `lore doctor` (read-only checks with one next action),
  `lore status`, `lore migrate`, `lore vault ensure-entities`.
- Memory: `lore search <query>` (json), `lore memory save <title>` with
  `--content` or `--content-file` (json), `lore memory update <memory-id>`
  (kind and expiry only) (json), `lore mine [path]` (index project files as
  memories), `lore inbox list|approve|reject|archive`, `lore pinned list`,
  `lore promote`.
- Knowledge: `lore decision create` (json), `lore ask <entity>` (json),
  `lore tasks list|create|update|close|close-many|reconcile`,
  `lore entities merge`, `lore conflicts scan`, `lore debt scan|create-tasks`,
  `lore procedures scan|propose|deprecate`, `lore digest`.
- Other: `lore profile list|show|validate|preview|install|set|migrate`,
  `lore costs summary|export`, `lore eval …`, `lore mcp`,
  `lore hooks wakeup|autosave|session-end`.
- There is no CLI command to get one memory, list memories, archive, or
  restore. Those exist only in the MCP server.

### 6.3 Hooks

`lore install` writes host configuration; by default it configures all four
hosts (Claude Code, Codex, Cursor, OMP) (`README.md`, step 3).

| Host | What `lore install` writes | Hooks |
| --- | --- | --- |
| Claude Code | `.mcp.json` (server `lore`, `LORE_CONFIG_ROOT` set) and hooks in `~/.claude/projects/<project path with / turned into ->/settings.json` (`src/cli/commands/claude-paths.ts`) | `Stop` runs `lore hooks autosave`; `UserPromptSubmit` runs `lore hooks wakeup` with `runOnce: true`; both with `timeout: 10000` (`src/cli/commands/install/claude.ts`) |
| Codex | `.codex/config.toml` (`[features] hooks = true`, `[mcp_servers.lore]` run through `bash -lc`) and `.codex/hooks.json` | `UserPromptSubmit` runs `LORE_AGENT_NAME=Codex lore hooks wakeup`; `Stop` runs `LORE_AGENT_NAME=Codex lore hooks autosave` with a 30 second timeout (`.codex/hooks.json` in the repo shows the shape). Codex loads project `.codex/` files only for trusted projects. |
| Cursor, OMP | MCP entry only | none |

Three problems with the Claude Code install, checked against **Docs (Claude
Code)**:

- `~/.claude/projects/<path>/settings.json` is not one of the settings files
  Claude Code reads. The documented files are `~/.claude/settings.json`,
  `.claude/settings.json`, `.claude/settings.local.json`, and managed settings
  (`settings.md`, "Settings files and who they affect"). Lore's Claude Code
  hooks may therefore never run. Not tested here.
- Lore writes `timeout: 10000` with the comment "Claude settings use hook
  timeouts in milliseconds". Claude Code reads `timeout` in seconds
  (`hooks.md`, common fields), so the limit would be about 2 hours 47 minutes.
- `runOnce` is not a documented hook field. The documented field is `once`, and
  it is honored only in skill frontmatter (`hooks.md`, common fields).

What each hook does (`docs/hooks.md`, `docs/hooks-autosave.md`,
`docs/hooks-wakeup.md`, `docs/hooks-background.md`):

- **Wake-up** (`lore hooks wakeup`, on the first prompt of a session): prints
  the latest project digest if one is less than 7 days old, recent memories,
  active facts, and memories ranked against the first prompt. It keeps a
  per-session marker in `$TMPDIR/lore-hook-state/` so it runs once. It does not
  list tasks.
- **Autosave** (`lore hooks autosave`, on Stop): answers `{}` at once, then,
  after every `saveInterval` user messages (default 5), starts a detached
  background agent that receives the transcript in its prompt and writes a
  session synopsis plus up to 5 single-fact `note` memories. The background
  agent is `claude -p --allowedTools <lore tools> --dangerously-skip-permissions
  --no-session-persistence --model sonnet`, or `codex exec` with a
  workspace-write sandbox for Codex. Saves go straight into default recall
  unless `hooks.proposeAutosaveLearnings: true`.
- **Auto-digest**: after autosave, a second detached process rebuilds the
  weekly project digest when it is stale.
- Switches: `hooks.autoSave`, `hooks.wakeUp`, `hooks.autoDigest`,
  `hooks.learningExtraction` in `.lore.yaml`; `LORE_AUTOSAVE=false`,
  `LORE_AUTO_DIGEST=false`, `LORE_DISABLE_LEARNING_EXTRACTION=1`.
- `hooks/autosave.sh`, `hooks/wakeup.sh`, and `hooks/session-end.sh` are kept
  only for installs made before 0.6.0; `session-end.sh` exits 0 and does
  nothing.

### 6.4 Profiles

Source: `docs/profiles.md`, `profiles/`.

- A profile sets the allowed Tags values, the Entity kinds, the fact predicates
  agents may write, extra Notion properties to add to the five databases, and
  the prompt texts used by autosave, digest, and the conflict judge.
- Built-in profiles: `default@1.0.0` (40 engineering tags such as
  `architecture`, `gotcha`, `runbook`), `support@1.0.0`, and
  `conversational@1.0.0` (captures personal preferences and routes them to the
  review inbox).
- A project can keep its own profile in
  `<config root>/.lore/profiles/local/<name>/<version>/`.
- Profiles can only add properties. Memory kinds and statuses are fixed in
  code and cannot be extended by a profile. Lore's write tools do not set the
  added properties; something else has to write them.

### 6.5 Evals

`evals/` and `docs/evals*.md` hold Lore's own measurements. The one that
matters here (`docs/evals-modelhard-campaign-20260529.md`): memories a person
seeded helped agents with a statistically significant result (McNemar
p = 0.0008, 27 tasks helped and 7 hurt out of 149 pairs), while memories the
autosave loop formed by itself did not (p = 0.50, 12 helped and 8 hurt). The
report says the second result "is structural, not a sample-size problem".

---

## 7. Fit with the Toolkit V2 memory contract and the model's formats

Toolkit sources: `plugins/toolkit/lib/memory/contract.mjs`,
`plugins/toolkit/lib/memory/notion.mjs`, `dev/ARCHITECTURE.md` sections 0 and 7.

### 7.1 Operations

| Toolkit operation | Closest Lore action | Match |
| --- | --- | --- |
| `save` (create or replace by key; `--expect absent` or a version; read back the exact text) | MCP `lore-memory save` creates a new row; `update` replaces the body of a row by page id. CLI `lore memory save` creates only. | Partial. No save by key, no version check, no exact read-back promise. A Topic Key upsert appends a revision block instead of replacing, and only for five kinds that do not include `note`. |
| `get <key>` | `lore-memory expand ids=[page id]` | Partial. Lore has no lookup by key; the toolkit would search Title or Keywords first and then expand. |
| `find <query>` | `lore-query search` (MCP), `lore search --json` (CLI) | Good, once RunTool search is off. With it off, "semantic" is Notion's public search over the workspace, filtered to the Memories database afterwards. |
| `find --reflect` | none | No match. `lore-context digest` gathers data for the agent to summarize; it is not an answer to a question. |
| `list [--type] [--status]` | `lore-query recall` | Partial. It filters by Lore kind and status, not by the model's five types. |
| `retire [--superseded-by]` | `update` with Status `superseded` plus `supersedesIds` on the replacement; `compare verdict=supersedes` works only for decisions | Partial. No link repair in other records. |
| `restore` | `update` Status back | Partial. An archived (trashed) row has no restore action. |
| `rename <key> --to <key>` | `update` title; Topic Key re-key for non-note kinds | Partial. No link repair. |
| `delete --owner-approved` | `lore-memory archive` (Notion trash) | Match. The toolkit's Notion driver also moves the page to the trash. |
| `focus` get and set | none. Nearest: a `state` row (`save subject=… replace=true`) or a pinned row (`lore-pinned`) | No match. |
| `glossary` get and set | none. Nearest: Entities (Name, Aliases, Description) or a pinned row | No match. |
| `reindex` | not needed (Notion is the index); `lore migrate` fixes the schema | Not applicable. |
| `status` | `lore-context status`, `lore status`, `lore doctor` | Match in purpose; different output. |
| `export` / `markExport` | none | No match. |

### 7.2 Formats

| Model format (ARCHITECTURE 0 and 7) | Lore equivalent | Match |
| --- | --- | --- |
| Five types: user, feedback, project, reference, event (`metadata.type`) | Kind has ten fixed values; none of them is these five, and profiles cannot add kinds | No match. The type has to live in Tags (a profile can add the five words) or an added property. |
| Status: current, needs-review, superseded, archived | informational or accepted, proposed, superseded, deprecated (or the trash) | Close. Lore's default reads hide `proposed`, so needs-review rows would be hidden from Lore clients; superseded and deprecated rows stay visible. |
| Key `<type>_<slug>` | no key column; Keywords (free text) or an added property can hold it | Partial. |
| `description` (one line, 150 characters) | Synopsis (150 characters by default) | Match. |
| `source` (who or what, with a date) | Source is a select of six fixed words | No match; needs an added property. |
| `last_verified`, `authorization` | none (`Last Referenced At` means "last read") | No match; needs added properties. |
| `supersedes` | Supersedes relation | Match. |
| Body labels: Remember, Why, How to apply, Evidence and limits, Related memories, Authoritative records | page body Markdown, free form | Match. Lore stores any Markdown. |
| Obsidian-style links between records, repaired on rename, merge, archive | none; Affects relation and `mentions` facts exist but nothing repairs links | No match. |
| Four-section `CURRENT_FOCUS.md` | none | No match. |
| Glossary | none (Entities are the closest idea) | No match. |
| Approval policy (onboarding card, trusted mode) | a proposed-memory inbox (`Status = proposed`, `lore inbox approve`) | Different mechanism. Lore's autosave writes without asking unless `proposeAutosaveLearnings` is on. |

Conclusion: Lore can hold the model's records as rows, but everything that
makes them the model's records (type, key, source, verification date,
authorization, links, focus, glossary) has to be written by the toolkit, not by
Lore.

---

## 8. Integration options

### Option A: the toolkit's Notion driver calls Lore

The `toolkit memory` commands, hooks, and skills stay the same; the Notion
driver hands storage to Lore.

Three ways to call it:

- **The `lore` CLI.** Too small: no get, list, archive, or restore commands
  (6.2).
- **The MCP server over stdio.** Complete, but every result is Markdown text
  meant for an agent, so the driver would parse prose (6.1). No HTTP transport.
- **Lore as a library** (`initServices`, `MemoryService` from
  `@notionhq/lore`, `src/index.ts`). Typed, but the toolkit has no npm
  dependencies today (`dev/ARCHITECTURE.md` section 5: "Node 20+, no
  dependencies"), so it would load a globally installed package by path.

Tradeoffs:

- Good: one command set stays; Lore handles Notion calls, rate limits, retries.
- Bad: the toolkit still does all the mapping in section 7 (type, key, source,
  focus, glossary, link repair, exact read-back), so little code goes away.
- Bad: a second Notion sign-in is required (PAT or file-mode `ntn`), because
  Lore cannot use the Keychain sign-in the toolkit uses.
- Bad: every memory command then depends on 117,000 lines of Lore plus its
  internal-endpoint code paths, which must be switched off for Mike.

### Option B: replace the toolkit's Notion memory with Lore's own tools

Projects that choose Notion memory get `lore install`, Lore's MCP tools, its
wake-up and autosave hooks, and a profile; the memory skills tell the agent to
call `lore-memory`, `lore-query`, and `lore-context`.

Tradeoffs:

- Good: the least toolkit code for Notion memory; Lore's extra features (ranked
  wake-up, weekly digests, facts, decisions, tasks, conflict scans) come with it.
- Bad: it breaks Mike's settled decision "one command set for built-in,
  Hindsight, and Notion" (`dev/GOAL.md`). Skills would need two sets of steps.
- Bad: it drops the model's formats: no five types, no topic YAML, no
  four-section current focus, no glossary, no link repair.
- Bad: Lore's decisions and tasks duplicate the toolkit's `DECISIONS.md` and
  work items. Two places would hold the same kind of record.
- Bad: autosave writes memories without the owner's approval, which is the
  opposite of the `onboarding` approval mode in `memory-save`, and Lore's own
  eval found no significant benefit from those autosaved memories (6.5).
- Bad: autosave runs an extra background `claude -p` with permissions skipped
  (or `codex exec`) every few messages, which costs plan usage.
- Bad: the Claude Code hook install writes to a file Claude Code does not read
  (6.3), and `lore install` edits `.codex/config.toml` and
  `.codex/hooks.json`, which the toolkit also writes.
- Bad: default semantic search fails for Mike until RunTool is switched off
  (section 9).

### Option C: keep the toolkit's driver, write in Lore's schema

The toolkit keeps its CLI, hooks, skills, approval policy, and model formats.
Its Notion memory driver writes each project's memory as a Lore vault, so
Lore's own tools can read the same rows if Mike turns them on later.

How it would work:

- Per project: a "Memory" page under the project's row in the Projects
  database. That page is the Lore vault and holds the five Lore databases with
  Lore's exact property names (section 3.2). The toolkit's builder
  (`toolkit notion ensure-project`, through `ntn api`) creates them from a
  pinned copy of Lore's schema at commit `6e741b1`, or the agent runs
  `lore init <memory-page-id>` once. One row in the vault's Projects database
  names the project.
- Record to row:

  | Toolkit field | Lore column |
  | --- | --- |
  | title line of the body | Title |
  | key (`feedback_deploy_window`) | Keywords, plus an added `Record Key` property |
  | `description` | Synopsis |
  | type | Tags value (`user`, `feedback`, `project`, `reference`, `event`); Kind is always `note` |
  | status | Status: current = `accepted`, needs-review = `proposed`, superseded = `superseded`, archived = `deprecated` |
  | `supersedes` | Supersedes relation |
  | `source`, `last_verified`, `authorization`, other keys | added properties (`Source note`, `Last verified`, `Authorization`, `Other fields`) |
  | body | page body, unchanged |
  | who saved | Author = owner name, Agent = Claude Code or Codex, Source = `manual` |

- Current focus and glossary: two rows in the same Memories database with Kind
  `state`, Topic Keys `state/current-focus` and `state/glossary`, Pinned on and
  Mutability `read-only`, so Lore's wake-up shows them. Lore's generic `update`
  refuses body changes on `state` rows and a read-only pin refuses `unpin`; a
  Lore `save` with the same subject would still append a `## Revision` block,
  which the toolkit's focus check would then report. (Alternative: keep them
  as child pages, which Lore clients do not see.)
- The added properties can be declared in a local Lore profile
  (`toolkit@1.0.0`) so `lore migrate` and `lore doctor` know them. Lore's drift
  check looks for properties and options Lore expects that the vault lacks
  (`src/core/vault.ts`); extra properties are expected to pass, and check 5 in
  section 10 confirms it.
- Lore's MCP server is optional and off by default. If Mike wants it later,
  it runs with `features.runTool.enabled: false` and all Lore hooks off, and
  `lore install` is never run against a toolkit project (the toolkit writes the
  host entries itself).

Tradeoffs:

- Good: every settled decision holds: one command set, model formats,
  approval policy, per-project storage, both hosts.
- Good: no new sign-in and no new install for the core path; the toolkit keeps
  using `ntn api` and its existing live-tested driver logic.
- Good: memories become readable by Lore's MCP tools, wake-up, digest, and
  search, and by any other Lore client, without moving data.
- Good: Lore promises not to rename or remove its database properties
  (`AGENTS.md`), which is what option C depends on.
- Bad: each project's Memory page holds five databases, and four of them
  (Projects, Topics, Entities, Facts) stay mostly empty unless Lore's own tools
  are used.
- Bad: the toolkit must track Lore's schema; a Lore release that adds required
  properties means a toolkit change (a check with `lore doctor` catches it).
- Bad: rows that Lore's own tools create (if Mike turns them on) are not in the
  model's format; the toolkit driver must list them as needing review, not
  fail on them.
- Bad: the toolkit's existing Notion Memory database layout changes, so the
  sample project's Memory database would be rebuilt (today it sits under the
  showcase row "Toolkit V2 sample (safe to delete)", `dev/PROGRESS.md`).

### Recommendation: option C

For a solo developer who wants the agent to run things, per-project memory,
both hosts, and as little duplication as possible, option C is the one that
applies Lore without breaking anything Mike already decided. It keeps one set
of memory commands for all three backends, keeps the model's formats and the
approval step, and adds nothing Mike has to sign in to. It makes the Notion
data Lore-shaped, so Lore's extra tools can be added later as a read-side
option instead of a second memory system.

Option B is the literal reading of "apply Lore", but it would replace the
model's memory formats, create a second home for decisions and tasks, save
memories without asking, and needs a separate sign-in; Lore's own evidence
says the autosave part does not help significantly.

If the only goal is working per-project memory in Notion, the current driver
already passes its live tests (`dev/research/notion-live-tests.md`: memory
save and get with exact text, find, retire, restore, stale version refused,
focus and glossary exact). Lore adds value only through its extra read tools,
which is why option C keeps them available rather than required.

---

## 9. Risks

| Risk | Detail | Handling |
| --- | --- | --- |
| Internal Notion endpoint | Semantic search, block edits, SQL filters, and aggregates default to `POST /v1/tools/run`, registered in Notion's server as undocumented and turned on by an internal feature flag (`src/notion/runtool/contract.md`). Notion support confirmed it is not available to external PAT or `ntn` users on any plan (**GitHub** issue #962, comment quoting Notion). Search then fails outright, and autosave note saves fail too, because their duplicate check uses search. | Set `LORE_USE_RUNTOOL=0` or `features.runTool.enabled: false` whenever Lore's own code runs. Not needed for option C's core path. |
| Sign-in | Lore reads only `NOTION_API_TOKEN` or a file-mode `auth.json` in an undocumented format. Mike's sign-in is in the Keychain. | Only matters if Lore's CLI or MCP is used (section 5). |
| Data sent elsewhere | No telemetry or analytics code was found (search for telemetry, analytics, Sentry, PostHog, Statsig, Mixpanel, Datadog in `src/`: none). Network calls: the Notion API; `ntn.dev` when Lore installs `ntn`; `api.github.com` only for `lore debt scan` pull-request markers; `huggingface.co` and `api.openai.com` only in `lore eval` commands. Autosave sends the session transcript to a background `claude -p` (Anthropic) or `codex exec` (OpenAI) run. Lore sends `User-Agent: lore/1.0.0` to Notion. The cost ledger is local and off by default. | Keep Lore's autosave off. |
| Background agent with permissions skipped | Autosave and digest start `claude -p --dangerously-skip-permissions --model sonnet`, limited to Lore's MCP tools by `--allowedTools`, and do not supervise it after start (`docs/hooks-background.md`). | Keep autosave and auto-digest off. |
| Claude Code hook install | Writes to a settings file Claude Code does not read, uses a timeout unit Claude Code does not use, and an undocumented `runOnce` field (6.3). | Never run `lore install` on a toolkit project; write host entries from the toolkit. |
| Overwriting toolkit files | `lore install` (all hosts by default) edits `.mcp.json`, `.codex/config.toml`, `.codex/hooks.json`, `.cursor/mcp.json`, `.omp/mcp.json`. | Same as above. |
| Clutter in Notion | Five databases per vault, and Lore adds audit and revision blocks to page bodies. | Put the vault in a "Memory" page under the project row. |
| Paid plan | Not needed for public-API paths. RunTool `query_data_sources` needs Enterprise with Notion AI for workflow bots (`contract.md`), which is moot once RunTool is off. | None. |
| Maintenance | One main maintainer; three commits since 1.0.0; the #962 search failure has been open since 2026-08-30 with two unmerged fixes. | Pin the schema to commit `6e741b1`; re-check before upgrading. |
| Rate limits | Notion allows about 3 requests per second per token; Lore paces calls on its side. Its wake-up makes several queries per session. | Toolkit hooks keep their 2-second budget and cache (ARCHITECTURE 6). |
| `.lore.yaml` | Must stay out of Git (Lore policy); found only by upward search or `LORE_CONFIG_ROOT`. | Git-ignore it; set `LORE_CONFIG_ROOT` for worktrees outside the main checkout. |
| License | MIT, Notion Labs, Inc. Copying the schema is allowed with the copyright notice. | Keep the notice beside any copied schema. |

---

## 10. Checks to run before building option C

These write only under the "Toolkit V2 sample (safe to delete)" project row.

1. Create a "Memory" page under that row and the five Lore databases in it
   (toolkit builder, or `lore init <page-id>` with a test token).
2. Run the toolkit memory live checks (save and get exact text, find, list,
   retire, restore, rename, delete, focus, glossary) against Lore's Memories
   database.
3. With `npm install -g @notionhq/lore`, a test token, a Git-ignored
   `.lore.yaml` with `features.runTool.enabled: false` and all hooks off: run
   `lore doctor`, `lore status`, and `lore search <word> --json`, and confirm the
   toolkit's rows are found.
4. Start `lore mcp` and call `lore-context action='wake-up'` and
   `lore-query action='recall'`; confirm the pinned focus and glossary rows
   show and the toolkit rows read correctly.
5. Confirm Lore's drift check does not complain about the added properties.
6. If Mike picks the file-mode `ntn` sign-in, confirm the toolkit's
   `ntn api` calls still work beside it.

---

## 11. Files read

Lore, commit `6e741b1bb91a36b47213f4d3af5bbdfaa2f2081d`:

- `README.md`, `AGENTS.md` (`CLAUDE.md` and every `src/*/CLAUDE.md` are links
  to the matching `AGENTS.md`), `CHANGELOG.md`, `package.json`, `LICENSE`,
  `.lore.example.yaml`, `.mcp.json`, `.codex/config.toml`, `.codex/hooks.json`,
  `.cursor/mcp.json`, `tsup.config.ts`
- `docs/mcp-tools.md`, `docs/cli.md`, `docs/hooks.md`,
  `docs/hooks-autosave.md`, `docs/hooks-wakeup.md`, `docs/hooks-background.md`,
  `docs/profiles.md`, `docs/memory-workflows.md`, `docs/evals.md`,
  `docs/evals-modelhard-campaign-20260529.md`
- `hooks/autosave.sh`, `hooks/wakeup.sh`, `hooks/session-end.sh`
- `profiles/default/profile.yaml`, `profiles/default/schema.yaml`,
  `profiles/default/taxonomy.yaml`
- `src/index.ts`, `src/config.ts`, `src/services.ts`, `src/feature-flags.ts`
- `src/notion/AGENTS.md`, `src/notion/schema.ts`, `src/notion/setup.ts`,
  `src/notion/client.ts`, `src/notion/runtool/README.md`,
  `src/notion/runtool/contract.md`, `src/notion/runtool/search.ts`,
  `src/notion/runtool/error-helpers.ts`
- `src/core/AGENTS.md`, `src/core/context.ts`, `src/core/project-context.ts`,
  `src/core/memory-search.ts`, `src/core/memory-topic-key.ts`,
  `src/core/memory-review-state.ts`, `src/core/memory.ts`,
  `src/core/memory-create.ts`, `src/core/memory-update.ts`, `src/core/vault.ts`
- `src/auth/AGENTS.md`, `src/auth/ntn.ts`
- `src/mcp/server.ts`, `src/mcp/helpers.ts`, `src/mcp/tools/memory/schema.ts`,
  `src/mcp/tools/query.ts`, `src/mcp/tools/context/schema.ts`
- `src/cli/commands/install/claude.ts`, `src/cli/commands/claude-paths.ts`,
  `src/cli/commands/init.ts`, `src/hooks/background.ts`, `src/hooks/config.ts`
- GitHub: issue #962 with comments, pull requests #964 and #966, issue #968,
  repository metadata.

---

## 12. Independent check (2026-09-27)

A second agent checked this brief against the Lore source at the same commit
(`6e741b1`, still the tip of `main` on GitHub on 2026-09-27) and ran Lore's own
test suite. Nothing was written to Mike's Notion workspace, the toolkit code,
or any configuration. No Notion token was read or used.

### 12.1 Lore's own test suite

- Ran `npm ci` and `npm test` in the clone with `HOME` set to an empty scratch
  folder, no `NOTION_API_TOKEN`, a `PATH` without `claude`, `codex`, or `ntn`,
  and `LORE_SKIP_GIT_HOOK_INSTALL=1`, so the tests could not read Mike's
  sign-ins or change his settings.
- `npm ci` installed 253 packages from `registry.npmjs.org` and built `dist/`.
- Result: **205 test files, 6,084 tests, all passed** (about 11 seconds, Node
  25.8.1). The tests use stubbed Notion clients; none call Notion.
- The first run had 12 failures, all in `src/eval/` (`skill-agent.test.ts`,
  `bench-tool.test.ts`, `bench-runner.test.ts`), all `listen EINVAL` on a Unix
  socket. Cause: the temporary folder given for that run had a path longer
  than macOS allows for a socket (104 bytes). With the normal macOS temporary
  folder, every test passed. This was the test setup, not a Lore defect.
- `npm audit` on Lore's lockfile: 14 advisories across all packages. 6 are in
  packages Lore ships with (`hono`, `@hono/node-server`, `body-parser`, `qs`,
  `fast-uri`, `ip-address`), all required by `@modelcontextprotocol/sdk` for
  its HTTP server features. Lore's MCP server uses stdio only, so that code is
  not used. The npm package has no lockfile of its own, so
  `npm install -g @notionhq/lore` resolves newer versions at install time.

### 12.2 Claims confirmed

Each item below was checked in the source, the captured Claude Code docs, or
on GitHub, and is correct as written in this brief.

- **Identity.** MIT, "Copyright (c) 2026 Notion Labs, Inc."; `@notionhq/lore`
  1.0.0 is `latest` on npm; Node 20 or later; 58 of the last 59 commits by
  Hesham Salman; repository created 2026-04-15, 158 stars, 12 forks, last push
  2026-09-08; release dates as in `CHANGELOG.md`; the stability rules in
  `AGENTS.md` "Non-Negotiables".
- **Storage.** Five databases created in the order given
  (`createVaultDatabases`, `src/notion/setup.ts`); all five are required
  (`REQUIRED_VAULT_DATABASE_KEYS`); only top-level `child_database` blocks of
  the vault page are read; a database with an unexpected title is matched by
  its properties. Projects, Topics, Memories, and Entities property names
  match `src/notion/schema.ts`. Synopsis is 150 characters by default and 500
  at most (`src/types/domain.ts`). Fresh vaults leave out Memories
  `Confidence` and `Confidence Score` (`CHANGELOG.md` 0.19.0).
- **Body writes.** Create writes the body with `pages.updateMarkdown`
  (`insert_content`) and moves a half-made page to the trash when that fails
  (`src/core/memory-create.ts`). Update replaces the whole body
  (`replace_content`, `src/core/memory-update.ts`). Archive sets
  `archived: true` (`src/core/memory.ts`).
- **Save rules.** A Topic Key is refused on kinds `note`, `task`, and
  `operational` (`src/mcp/tools/memory/save.ts`). `state` rows must be saved
  with `subject` and `replace: true`. `update` refuses body and project changes
  on `state` rows (`src/mcp/tools/memory/update.ts`). A read-only pinned row
  refuses `unpin` (`src/mcp/tools/pinned.ts`).
- **Default reads.** Status `proposed` and `rejected` are hidden
  (`src/core/memory-review-state.ts`). Default recall also hides `agent_diary`
  and `digest` sources and `task` and `operational` kinds
  (`docs/mcp-tools.md`).
- **Scoping.** `.lore.yaml` is found by upward search (`findConfigFile`,
  `src/config.ts`) or from `LORE_CONFIG_ROOT` (`src/services.ts`). `auth.token`
  in the file is refused. `upstreamVaults` and `promotionTargets` exist.
  `projects:` uses the longest matching path, and `.` matches everything
  (`src/core/context.ts`). Only eval code creates Projects rows (`src/eval/`).
  The repository's pre-commit hook runs `tools/check-lore-config.mjs --staged`.
- **Auth.** `NOTION_API_TOKEN` first, then `~/.config/notion/auth.json`
  (`resolveAuth`, `src/config.ts`); no Keychain read. `secret_` tokens are
  refused while any RunTool feature is on (`assertRunToolAuthSupported`,
  `src/services.ts`). `lore install --ntn` installs `ntn` v0.13.2 from
  `ntn.dev` with pinned SHA-256 checksums; minimum `ntn` is 0.12.0
  (`src/auth/ntn.ts`).
- **RunTool.** Every RunTool feature is on by default except batch creates
  (`src/feature-flags.ts`). `LORE_USE_RUNTOOL=0` or
  `features.runTool.enabled: false` turns off search, block edit, SQL filter,
  and aggregate, unless a sub-flag is set separately. Issue #962 is open; its
  2026-08-31 comment quotes Notion saying `POST /v1/tools/run` is not part of
  the public API for PAT or `ntn` users; its body confirms that autosave note
  saves fail while search fails. PRs #964 and #966 and issue #968 are open as
  described.
- **MCP server.** stdio only (`StdioServerTransport`, `src/mcp/server.ts`);
  nine tools registered; no tool declares an output schema.
- **CLI.** `lore memory` has only `save` and `update`. `lore install`
  configures all four hosts by default (`README.md`, step 3).
- **Claude Code install.** Hooks go to
  `~/.claude/projects/<path with / replaced by ->/settings.json`
  (`src/cli/commands/claude-paths.ts`) with `timeout: 10000` and
  `runOnce: true` (`src/cli/commands/install/claude.ts`). The captured Claude
  Code docs (captured 2026-09-22) say `timeout` is in seconds and `once` works
  only in skill frontmatter (`hooks.md`, common fields), and name only
  `~/.claude/settings.json`, `.claude/settings.json`,
  `.claude/settings.local.json`, and managed settings as settings files
  (`settings.md`). The three problems listed in 6.3 are real.
- **Codex install.** `.codex/config.toml` (`[features] hooks = true`, a
  `bash -lc` launcher) and `.codex/hooks.json` with a 30-second Stop timeout
  (`src/cli/commands/install/codex.ts`).
- **Hooks.** Autosave runs every 5 user messages (`DEFAULT_SAVE_INTERVAL`),
  saves at most 5 learnings per run (`PER_SPAWN_LEARNING_LIMIT`), and starts
  `claude -p --allowedTools <list> --dangerously-skip-permissions
  --no-session-persistence --model sonnet` (`src/hooks/config.ts`).
  `autoSave`, `wakeUp`, and `autoDigest` default on;
  `proposeAutosaveLearnings` defaults off. Wake-up skips tasks and loads a
  digest less than 7 days old (`docs/hooks-wakeup.md`).
- **Profiles.** Three built-in profiles at 1.0.0. The default profile has 40
  tags, 8 entity kinds, and 7 writable fact predicates. Profiles only add
  properties and cannot add memory kinds (`docs/profiles.md`, "Schema
  Contract").
- **Drift check.** The drift check and `lore migrate` only look for missing
  properties and select options, and never rename or remove anything
  (`src/core/vault.ts`; `migrateVaultSchema` in `src/notion/setup.ts`). Extra
  toolkit properties do not count as drift.
- **Telemetry.** None. The words "telemetry" and "Sentry" in `src/` appear
  only in comments. Outbound hosts: the Notion API; `ntn.dev` (ntn install);
  `api.github.com` (`lore debt scan`, which also sends `GITHUB_TOKEN` or
  `GH_TOKEN` when either is set); `huggingface.co` and `api.openai.com` in
  eval code; and a Git host named by the user for `lore profile install`.
  Lore sends `User-Agent: lore/1.0.0` (`src/notion/client.ts`) and paces
  calls at 3 per second (`src/notion/rate-limit.ts`).
- **Evals.** The numbers in 6.5 match
  `docs/evals-modelhard-campaign-20260529.md`.
- **Toolkit side.** `dev/ARCHITECTURE.md` section 5 says "Node 20+, no
  dependencies". `dev/GOAL.md` records one command set for built-in,
  Hindsight, and Notion. The current Notion driver moves a deleted page to the
  trash and scores `find` by keywords across record bodies
  (`plugins/toolkit/lib/memory/notion.mjs`).

### 12.3 Claims corrected

| Brief says | Source says | Evidence |
| --- | --- | --- |
| With RunTool search off, "semantic" search is Notion's public search, and Lore search is a "Good" match for `toolkit memory find` (sections 1 and 7.1). | Notion's public search endpoint matches page titles only. With RunTool off, Lore's `semantic` mode (the default, and the only mode the `lore search` CLI uses) is a workspace-wide title search, filtered to the Memories database afterwards. It does not read page bodies and is not semantic. | The Notion SDK in the clone documents the endpoint as "Search by title" (`node_modules/@notionhq/client/build/src/api-endpoints/search.d.ts`). The Lore maintainer wrote on issue #962 (2026-09-01) that the REST API "isn't equivalent" to AI search. `fetchSemanticPages` comment in `src/core/memory-search.ts`. |
| Contains mode filters Title and Keywords (3.4). | It matches Title, Keywords, or Synopsis. | `src/core/memory-search.ts`, the `or` filter near line 679. |
| Lore cannot use Mike's current sign-in as it is, so he needs a PAT or a file-mode `ntn login` (section 5). | Lore does not read the Keychain, as stated. But Mike's `ntn` 0.23.10 has `ntn auth token`, "Print the current authentication token", with `--plain` for piping. A launcher could set `NOTION_API_TOKEN` from it, so no second sign-in would be needed. Lore's comment in `src/auth/ntn.ts` says no such command would ship; that comment is out of date. Not tested here, because testing it reads a real credential. | `ntn auth --help` and `ntn auth token --help` on this Mac. |
| `NOTION_KEYRING=0 ntn login` is one of Mike's two sign-in choices (section 5). | Lore's README labels the `ntn` login path "Internal Notion engineer" and tells external users to use a Personal Access Token. `lore install --help` describes `--ntn` as "Use internal ntn login flow". | `README.md`, sections "Internal Notion engineer + shared vault" and "External operator + shared vault". |
| Pinned `state` rows for current focus and glossary would show in Lore's wake-up (section 8, option C). | Lore's wake-up hook never shows pinned rows. Only the MCP call `lore-context action='wake-up'` shows them, and then only the title, one meta line, and the synopsis; the body appears only with `expand: true`. | `src/hooks/helpers.ts` (`includePinnedBlocks: false`, comment "Hook never renders the Pinned Context section"); `renderPinnedBlock` in `src/mcp/tools/context/wake-up.ts`. |
| Lore's eval found that memories the autosave loop formed did not help significantly (6.5, option B). | The numbers are right, but the eval's `lore-full-loop` condition is an agent that forms a memory by inspecting the code before the fix. It is not the autosave hook reading real session transcripts. The report says the rule the agent needed was not in that code, calls this a limit of the eval design, and recommends a different design. It is weak evidence about the autosave hook itself. The report also counts 5 cases where the formed memory made the result worse than no memory. | `docs/evals-modelhard-campaign-20260529.md`: "TL;DR", "Method", "Why full-loop is structurally blocked", and next step 2. |
| Codex autosave runs `codex exec` with a workspace-write sandbox (6.3). | Correct, and the Codex command has no tool allow-list: `exec --sandbox workspace-write --skip-git-repo-check`. Lore's comment says the allow-list "must be configured out-of-band". | `CODEX_BACKGROUND_ARGS`, `src/hooks/config.ts`. |
| There is no CLI command to archive (6.2). | `lore inbox archive <memoryId>` exists, but only for rows with Status `proposed`. | `src/cli/commands/inbox.ts`. |
| Every tool returns Markdown text (6.1). | True except `lore-task action='close'`, which also returns `structuredContent`. No tool declares an output schema. | `src/mcp/tools/tasks.ts`, line 624. |
| `lore init` with no page id names the page `Lore Vault - <folder name>` (3.1). | The separator is an em dash: `Lore Vault — <folder name>`. | `defaultVaultTitle`, `src/cli/commands/init.ts`. |
| 501 TypeScript files, about 117,000 lines of non-test code (section 2). | The 501 `.ts` files under `src/` include 204 test files. Non-test code is 297 files and 116,913 lines. | `find src -name '*.ts'`. |
| Facts properties (3.2). | Facts also has Scope Kind, Scope Key, Audience, Lifetime, and Expires At. | `FACT_PROPS`, `src/notion/schema.ts`. |
| The source studied is commit `6e741b1`, and npm has 1.0.0 (header and section 1). | Both true, but they are not the same code. npm 1.0.0 was published 2026-08-04 19:22 UTC, after commit `22ce309` (OMP support) and before `b18edb1` (#963, clearer 403 message, 2026-09-01). The difference is error-message wording only. Found from publish and commit times; the npm tarball was not compared. | `npm view @notionhq/lore time`; `git log`. |

### 12.4 What the corrections change

- For Mike, Lore's own search is weaker than the toolkit's current
  `toolkit memory find` until Notion opens `/v1/tools/run` to external users or
  PR #966 lands. With RunTool on, search fails (#962). With it off, search
  matches titles only. The toolkit's driver already scores keywords across
  record bodies.
- The semantic search that works for Mike today is Notion's own hosted MCP
  tool `notion-ai-search`, which the Lore maintainer names as the right way to
  search (issue #962 comment, PR #966). It can search the toolkit's current
  Memory database without Lore.
- Option C's benefit is therefore smaller than section 8 says. It makes the
  rows readable by Lore's tools, but those tools do not give Mike better search
  today, and the Lore wake-up hook would not show focus or glossary.
- If Lore's CLI or MCP server is ever used, sign-in is easier than section 5
  says: `ntn auth token --plain` could supply the token (to be tested), or a
  Personal Access Token.

### 12.5 Recommendation from this check

The brief's direction holds: option C, where the toolkit's command, hooks,
approval step, and model formats stay; Lore's autosave and wake-up hooks stay
off; and `lore install` is never run on a toolkit project. This check changes
three parts of it:

1. Ask Mike what he wants from Lore before the Memory database is rebuilt.
   Semantic search, Notion's standard memory layout, and automatic saving each
   lead to a different build, and Lore does not provide the first one to
   external users today.
2. If he wants the Lore layout, build option C but keep current focus and
   glossary as the tested child pages, not pinned `state` rows, because Lore's
   wake-up hook does not show pinned rows.
3. Add to the section 10 checks: with RunTool off, confirm that
   `lore search <word> --json` finds a toolkit row only when the word is in the
   row's title, so the build notes state what Lore search does and does not do.

If Mike's goal is semantic search over memory in Notion, it is available now
through Notion's hosted MCP (`notion-ai-search`) against the current Memory
database, with no Lore install and no layout change.

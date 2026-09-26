# Research brief: project-init, its library, hooks-library, protocol-guard, sf-architect-solutioning

Researched 2026-09-26 from the current toolkit at
`/Users/michaelrihm/Documents/Projects/claude-toolkit` (project-init 0.84.2,
hooks-library 3.8.0, protocol-guard 0.3.0, sf-architect-solutioning 1.1.1,
marketplace 0.131.2) and the model project at
`/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`. Nothing was
changed in either place.

Paths below are relative to `claude-toolkit/plugins/` unless they start with
`/` or name the model project. "V1" means the current toolkit. "V2" means the
new toolkit at `/Users/michaelrihm/Documents/Projects/toolkit-v2`.

---

## 1. Summary for the architect

- project-init V1 is a 6-gate interview (plus Gate 0 orient and a wrap-up)
  that asks roughly 15 separate questions. V2's settled decision reduces the
  interview to three questions: tracker, memory, Salesforce or not. Most V1
  gates become either "always install" or "drop". Section 13 maps every V1 gate
  item to a suggested V2 disposition.
- The library ships **9 general rules** (7 always-on in practice, 1 conditional
  on local tracking, 1 conditional on the graphify code graph) and **10
  Salesforce rules**, plus **3 Salesforce skills**, **2 output styles**, **1
  library hook**, **3 templates**, **2 tools** (`permsets.py`, `kb/`), and **5
  guides**.
- The model project already contains **every** Salesforce rule, **every**
  general rule except `work-item-folders.md`, all three Salesforce skills (both
  `.claude/skills/` and `.agents/skills/` copies), the Plain English style
  (identical), both Salesforce guard hooks (identical), `tools/kb/` (identical),
  `tools/permissions/permsets.py` (identical), and a merged permissions block.
  Six rules, one skill, one hook, and two config/template files differ from the
  library; section 11 lists each difference.
- Many V1 texts still name V1 paths (`knowledge/`, `knowledge/prds/`,
  `prds/`, `PROJECT.md` external mode, `knowledge-save`, `docs/designs/`,
  `CLAUDE.md` pairs). The model already rewrote five rules for V2 paths. The
  rest must be rewritten before porting (section 12 and 13).
- The V1 instruction-file design (root and folder `AGENTS.md` plus a one-line
  `CLAUDE.md` `@AGENTS.md` next to each) conflicts with V2's "AGENTS.md only"
  decision. The model project still has four `CLAUDE.md` files, and its root
  `CLAUDE.md` is how `.memory/MEMORY.md` and `.memory/CURRENT_FOCUS.md` get
  loaded at startup. V2 must give those two files another startup route.
- hooks-library: the two Salesforce guards and the machine-wide
  no-AI-attribution guard still make sense in V2. `spec-check-reminder` and
  `style-handshake` are optional and need path/schema updates if kept.
- protocol-guard should not be ported as is. Every check but two is tied to the
  V1 `knowledge/` layout and V1 skill names, it uses the undocumented,
  early-access Claude Code "function hooks" API, and it runs in Claude Code
  only. The model README says the model does not enable V1 protocol checks.
- sf-architect-solutioning is fully self-contained (1 SKILL.md + 14 reference
  files, no absolute paths) and can be copied as is. Its only outside
  assumptions are tools (`WebFetch`, Playwright MCP), an optional `sf-develop`
  and `solution-design` skill, and a "(or CLAUDE.md in a project still in the
  old layout)" wording that is harmless.

---

## 2. Plugin manifests and marketplace entries

| Plugin | `.claude-plugin/plugin.json` | `.codex-plugin/plugin.json` | In Claude marketplace (`claude-toolkit/.claude-plugin/marketplace.json`) | In Codex marketplace (`claude-toolkit/.agents/plugins/marketplace.json`) |
| --- | --- | --- | --- | --- |
| `project-init` | yes, v0.84.2 | yes, v0.84.2, `"skills": "./skills/"`, full `interface` block | yes | yes |
| `hooks-library` | yes, v3.8.0 | yes, v3.8.0, minimal (no `skills`, no `interface`) | yes | **no** |
| `protocol-guard` | yes, v0.3.0 | **none** (by design) | yes | no |
| `sf-architect-solutioning` | yes, v1.1.1 | yes, v1.1.1, `"skills": "./skills/"`, `interface` block | yes | yes |

Codex marketplace entry shape (every entry is the same form):

```json
{ "name": "project-init",
  "source": { "source": "local", "path": "./plugins/project-init" },
  "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
  "category": "Productivity" }
```

Codex plugin manifest fields used by project-init and sf-architect-solutioning:
`name`, `version`, `description`, `author{name,email,url}`, `homepage`,
`repository`, `keywords`, `skills`, `interface{displayName, shortDescription,
longDescription, developerName, category, capabilities[], websiteURL,
defaultPrompt[], brandColor}`. The captured Codex docs
(`claude-toolkit/ai-external-knowledge/codex/`) hold only the AGENTS.md page,
so none of these Codex plugin, skill, or hook formats can be checked against a
captured document.

---

## 3. project-init: file list

```
project-init/
├── .claude-plugin/plugin.json
├── .codex-plugin/plugin.json
├── README.md
├── skills/
│   ├── project-init/SKILL.md            751 lines
│   │   └── references/                  8 files, never copied into a project
│   │       ├── setup-flow.md            gate checklist
│   │       ├── work-tracking-choice.md  Gate 1 tracker question
│   │       ├── work-items-structure.md  local-folder tracker setup
│   │       ├── thin-agents-md.md        how to write root AGENTS.md / CLAUDE.md
│   │       ├── root-file-examples.md    finished example pair
│   │       ├── folder-agents-md.md      per-folder AGENTS.md + CLAUDE.md
│   │       ├── salesforce-project-scaffold.md
│   │       └── toolkit-manual-delivery.md
│   ├── project-sync/SKILL.md            994 lines
│   ├── machine-sync/SKILL.md            299 lines
│   └── work-item-lifecycle/SKILL.md     124 lines
├── library/                             what lands in a project
│   ├── rules/general/    (README.md + 9 rules)
│   ├── rules/salesforce/ (README.md + 10 rules)
│   ├── skills/salesforce/{sf-component-tracker,sf-data-change,sf-deploy-check}/SKILL.md
│   ├── output-styles/{README.md, plain-english.md, terse.md}
│   ├── hooks/{README.md, toolkit-session-start.mjs}
│   ├── templates/{permissions-runbook.md, settings-permissions.json, toolkit-manual.md}
│   ├── tools/permsets.py
│   ├── tools/kb/          (README.md + 39 .py files: 24 top-level incl. 7 test_*.py, 15 in extractors/)
│   └── guides/{graphify-dependency-graph.md, mcp-best-practices.md,
│               salesforce-dependency-graph.md, salesforce-permissions-research.md,
│               salesforce-permissions-retrieval.md}
└── machine/                             what lands in ~/.claude/
    ├── README.md
    ├── rules/no-ai-attribution.md
    └── settings/required.json
```

The README says why `library/` lives inside the plugin: "a plugin ships only
the files inside its own folder, so a `library/` at the repository root would
disappear the moment the plugin is installed."

---

## 4. project-init skill: the full interview, gate by gate

Frontmatter `description` (verbatim start): "Walk the user through
initializing a NEW project, one gate at a time: scaffolding & folder
structure, guard hooks, the optional System Guide and packaged project
knowledge system, optional SOUL.md, AGENTS.md and CLAUDE.md, the local-folder
work-tracker, and optional standalone toolkit skills. Use when ... says things
like "initialize this project", "set up the scaffolding", "/project-init", or
"help me get this new repo going"."

How it runs: orient first; announce gate-by-gate plan; one gate at a time
(explain, recommend for the stack, ask, act only after confirm, summarize);
keep a live checklist; "Do not dump all the questions at once." Every gate is
optional and skippable.

Checklist from `references/setup-flow.md`:

```
[ ] Gate 0 - Orient: read the working dir; identify stack & project state
[ ] Gate 1 - Scaffolding, folder structure, and where work items are tracked
[ ] Gate 2 - Hooks (guards & automation)
[ ] Gate 3 - System Guide and project knowledge (two independent choices)
[ ] Gate 4 - Mechanical knowledge aids (optional impact analysis)
[ ] Gate 5 - Optional SOUL.md + root instructions + rules
[ ] Gate 6 - Optional toolkit skills  (offer the session-skills plugin)
[ ] Wrap-up - summarize, note follow-ups, port-back reminder
```

### Gate 0: Orient

Questions: Is this greenfield or does it already have code? What is the stack
(language, framework, app/library/service, mono/single)? If the project
already exists and mainly needs to catch up, switch to `project-sync`.

### Gate 1: Scaffolding, folders, tracker

1. Recommend a conventional layout for the stack (source, tests, config,
   `.gitignore`, README, license, editor/formatter, CI stub). Offer 1-2
   variants if there is a real choice. Create only what the owner approves.
2. Write each major folder's `<folder>/AGENTS.md` (10-20 lines) plus
   `<folder>/CLAUDE.md` holding only `@AGENTS.md`, at folder creation time.
   Skips: folders with a `README.md` index, everything under `.claude/`, the
   whole `knowledge/` tree (or `prds/` in external mode), folders another
   plugin creates, folders with obvious names. Record every skip.
3. **Tracker question, asked on its own** (`work-tracking-choice.md`):
   "Where do you track work items for this project?"
   1. A GitHub Projects board
   2. Linear
   3. Jira
   4. Local folders on this computer
   5. The BMAD method
   6. Somewhere else, or nothing yet

   Recommend GitHub Projects when the repo has a GitHub remote and nothing is
   in use; otherwise recommend what they already use. Answers 2/3 stand for
   any external tracker (Notion, Asana, Trello, spreadsheet): the toolkit
   creates nothing inside them, only asks the tracker name, which
   project/board, and how a refined ticket is marked. Answer 4 installs the
   `work-tracker` plugin and runs `work init` (creates Git-ignored
   `.work-items/`). Answer 5 runs `npx bmad-method install` only with a yes
   (BMAD v6, Node 20.12+, writes `_bmad/` and `_bmad-output/`), and names
   `_bmad-output/` as tracker. Answer 6 writes nothing but records the decline
   in root instructions so sync stops asking.
4. Offer `ai-external-knowledge/` at the root (every stack), empty with a
   short `README.md`.
5. Offer `docs/designs/` (every stack, only for trackers outside the repo):
   one build plan per work item, named `<work item id>-<short-slug>.md`,
   written once requirements are approved, **kept after delivery**. (The
   SKILL.md contradicts itself: once "with no `README.md`", later "with a
   short `README.md`".)
6. Salesforce/SFDX: offer the scaffold in `salesforce-project-scaffold.md`
   (section 8). Do not create `delivery/knowledge-base/` or
   `knowledge/system/` here.
7. Salesforce: after `.claude/rules/` exists, offer the Salesforce rules
   library (section 6). For each accepted rule that opens a skill, copy the
   skill folder twice, byte-identical, to `.claude/skills/<name>/` (Claude
   Code) and `.agents/skills/<name>/` (Codex). Never symlink ("Git on Windows
   checks symlinks out as plain files"). Library skills carry only `name` and
   `description` frontmatter.
8. Salesforce: if permission sets are tracked in Git, install the whole
   **permission set kit** (4 parts, section 7.4).
9. Salesforce: offer the **dependency graph kit** (4 parts, section 7.4);
   recommend it on an org merge or large org.

GitHub Projects board setup (answer 1 only), in order, stop at the first
failure: confirm GitHub remote; confirm `gh` signed in with project scope
(else show `gh auth refresh -s project` and wait); ask who owns the board
(org vs personal); check an existing board with that name; show exactly what
will be created and wait for yes; create board and link to repo; set statuses
exactly `Backlog`, `Refining`, `Ready`, `In progress`, `In review`, `Done`,
`Cancelled`; add the fourteen stage labels `01-discovery` ...
`14-spec-update`; report the link. Never rename or delete an existing status.

Stage labels (from `work-tracker/skills/work/references/lifecycle.md`, lines
122-135; `work-tracking-choice.md` wrongly says they are in
`work-item-stages.md`): `01-discovery`, `02-refinement`,
`03-requirements-approved`, `04-solution-design`, `05-breakdown`,
`06-implementation-plan`, `07-tracking-setup`, `08-build`, `09-testing`,
`10-bug-fixing`, `11-user-approval`, `12-pr-and-push`, `13-deployment`,
`14-spec-update`.

### Gate 2: Hooks

Question: "What needs guarding or automating?" Offered kinds: environment /
deployment guards, secret-leak guards, SessionStart orientation, format/lint.
For each: confirm exact trigger and action, write config and script, tell the
owner how to verify it fires. Specific offers:

- Every project using `session-skills`: `spec-check-reminder` from
  hooks-library (default ON there).
- Salesforce: install hooks-library, then follow
  `salesforce-prod-guard-hook.md` and `salesforce-permset-guard-hook.md`
  (copy the scripts into the project; afterwards the plugin is not needed).
  Permset guard only when the permission set rule was accepted in Gate 1.
- Salesforce with the dependency graph: wire
  `tools/kb/graph_freshness_hook.py` under `hooks.Stop`.
- Do not install the retired `memory-pr-hook` + `wrap-up-ritual.md`.

### Gate 3: System Guide and project knowledge (two separate questions)

- System Guide question: offer `system-guide@claude-toolkit`. Ask, per source:
  relative path, kind (`code` or `salesforce`), coverage (`complete` or
  `partial`). Normal path `knowledge/system/`. Preserve an existing guide; use
  `--adopt` only after the owner chooses it.
- Project knowledge question: offer `second-brain`. On yes, ask: "Memory:
  files in Git (second brain) or an external memory service (mem0 or
  Hindsight)?" (`files` default; `external` writes `.toolkit-memory.json`,
  moves context to `PROJECT.md`, manuals to `docs/`, PRDs to `prds/`, MCP
  server in `.mcp.json` with key in an env var, and prints a
  `[mcp_servers.<server>]` entry with `url` and `bearer_token_env_var` for
  `~/.codex/config.toml`). Never install the mem0 or Hindsight Claude Code
  plugin ("both save memory automatically, which bypasses owner approval").
- Framing questions for `knowledge/project.md`: what the project is, why it
  exists, what finished looks like, main workstreams and boundaries, who is
  involved, where active work is tracked.
- Registers `.claude/hooks/knowledge-session-start.mjs` (Claude SessionStart,
  fail-open) and the equivalent `.codex/hooks.json` route. Commits only
  `knowledge/.obsidian/app.json` (`alwaysUpdateLinks: true`,
  `newLinkFormat: "relative"`, `useMarkdownLinks: true`).
- Offers an initial `knowledge-save` pass. New projects start with no
  memories.

### Gate 4: Mechanical knowledge aids

Non-Salesforce only: offer the **graphify kit** (4 parts, section 7.4). A
project installs at most one graph (graphify or the Salesforce `kb/`). Do not
install retired v1 curators, drift hooks, or SHA pins.

### Gate 5: SOUL.md, AGENTS.md, rules folder

- Install the Toolkit operating manual (`library/templates/toolkit-manual.md`
  to `knowledge/toolkit-manual.md`, or `docs/toolkit-manual.md` in external
  mode) and the `toolkit-session-start.mjs` hook (SessionStart only) in every
  project, and write the Startup section into `AGENTS.md`.
- The fixed continuity line goes above the title of `AGENTS.md` in every
  project, verbatim, never reworded:

  > Always execute work with the context in mind that the user will likely continue work across multiple AI coding sessions where the session context is cleared and picked up again. You must assist the user in helping establish that continuity across sessions while not adding context that might pollute future agents and skew them. Information must be curated and intentional.

  Above it, only when `SOUL.md` exists and Gate 3 was declined: `Read SOUL.md
  first and follow it throughout this session.` (A second fixed line, the
  self-check "After you generate your response", was removed 2026-09-22.)
- SOUL question, verbatim: "Do you want to create a `SOUL.md` for this
  project? It defines who the agent is, how it communicates, its defaults, and
  what it should avoid." Write it with the owner; no fixed template; never
  overwrite an existing one.
- Walk `library/rules/general/README.md`: offer default-ON rules, conditional
  rules only when their condition holds; owner accepts, edits, or skips each;
  copy into `.claude/rules/`.
- One `AGENTS.md` line per rule that has `paths:` frontmatter (Codex has no
  `paths:` support).
- Conditional MCP rules from `mcp-best-practices.md` (Context7, Gmail, Google
  Calendar, Linear, Notion, Playwright), only for servers the project uses.
- Write `AGENTS.md` with the owner (section 5). `CLAUDE.md` is one line,
  `@AGENTS.md`. Never `AGENTS.override.md`, `AGENTS.local.md`, or an
  instruction file under `.agents/`.
- Add `.claude/RULES.md` as the rules index, never inside `.claude/rules/`
  ("every `.md` file there loads as a rule").
- Install and select the Plain English output style (default ON): copy to
  `.claude/output-styles/plain-english.md`, set `"outputStyle": "Plain
  English"` in committed `.claude/settings.json` (the value is the style's
  `name`, not the filename). Offer the same under `~/.claude/` machine-wide.
- Merge `library/templates/settings-permissions.json` into
  `permissions.deny` and `permissions.ask` (general always; salesforce in a
  Salesforce project). Add only missing rules.
- When project knowledge is installed: install `protocol-guard` and merge
  `"env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1" }` and
  `"enabledPlugins": { "protocol-guard@claude-toolkit": true }` into project
  settings (never user settings).

Note: SKILL.md Gate 5 still lists removed rules as default ON ("no em dashes
... ask before assuming; do the technical work yourself; one folder per work
item; show phase progress; treat the owner as non-technical"). Those files no
longer exist (section 6.3). Do not copy that paragraph.

### Gate 6: Optional standalone toolkit skills

- Offer the `work-tracker` plugin's `work` method for agent-led delivery (even
  with an external tracker). Run `work init` only for local tracking.
- Offer `session-skills` as one yes/no: `braindump`, `explain-simply`,
  `grill-me`, `handoff`, `session-summary`, `spec-check`, `track-tasks`,
  `unslop`, `work-guide`, `requirements-helper`, `solution-design`, plus the
  `delivery-researcher` and `delivery-reviewer` agents. Recommend `handoff`
  hardest. Never copy a `SKILL.md` into the project.
- Record installed, skipped, deferred so `project-sync` does not re-ask.

### Wrap-up

Summarize done vs skipped (including which folders got the AGENTS.md pair and
why others were skipped); confirm each configured quick-save folder appears
once in root `AGENTS.md`; list follow-ups; port-back reminder (improvements go
back to `claude-toolkit` by PR).

---

## 5. Root AGENTS.md shape in V1 (`thin-agents-md.md`, `root-file-examples.md`)

"A router and a map." Five questions only: what is this project; what is in
each folder and when to open it; what tools it runs on; where work is
tracked; which configured folders use quick saves. Aim about 400 words (source
cited: code.claude.com/docs/en/memory). Order:

1. The fixed continuity line (verbatim, above title).
2. Title and one line saying what the project is.
3. `Read .claude/rules first.`
4. `## Startup`. Files mode:
   ```
   - Read `SOUL.md`, `knowledge/project.md`, and `knowledge/memory/current.md`.
   - Check `knowledge/memory-inbox.md` for unfinished saves.
   - Read the three files again after resume, clear, or compaction.
   - Procedures live in skills. The manuals in `knowledge/` are reference: open a
     section when a task needs it.
   ```
   External mode: read `SOUL.md` and `PROJECT.md`; load working memory
   through the memory service in `.toolkit-memory.json` (tell the owner if its
   MCP server is not connected); list pending saves; repeat after resume,
   clear, compaction; manuals in `docs/` are reference.
5. `## Path-scoped rules`, intro "Claude Code loads these when a matching file
   is read. Codex: open the rule before working on a matching path." then one
   line per rule: `` - `knowledge/**`, `docs/**`, `**/README.md`: `.claude/rules/knowledge-direct-commit.md` ``.
   Plus, when System Guide is on, exactly: "When .system-guide.json is
   enabled, use the System Guide plugin's system-guide skill for questions or
   work about existing system structure, purpose, connections, or impact."
6. `## Codemap` table (`| Path | What is there, and when to open it |`), one
   row per folder including context sources (`ai-external-knowledge/`, PRDs,
   `docs/designs/`).
7. `## Tools` table (`| Tool | Use it for | Detail |`).
8. `## Quick saves` table (`| Path | How updates land | Instructions |`), rows
   only for configured systems: documentation route
   (`knowledge-direct-commit.md` + `publish-docs`), `knowledge/`, external
   `prds/` + `PROJECT.md`, `.work-items/` ("Update the existing shared,
   Git-ignored local tracker. Do not create a worktree, commit, or push for the
   tracker update.").
9. `## Where work is tracked`: tracker name and how an item is marked ready.

Never in it: a rule that already has a file; how to talk to the owner; a
multi-step procedure (that is a skill); anything findable in one command;
provenance/dates; current status or next action; what `knowledge/` contains.

The model project's root `AGENTS.md` follows this shape with V2 names:
`## Startup`, `## Path-scoped rules` (as a table), `## Project map`,
`## Tools`, `## Quick saves`, `## Where work is tracked`.

---

## 6. The rules library

Load mode: a rule file without frontmatter loads at every session start in
Claude Code. A rule with `paths:` frontmatter loads when the agent reads a
matching file (Claude Code 2.1.198+), not when it writes one. Codex reads
rules only because `AGENTS.md` says `Read .claude/rules first.` and lists the
path-scoped ones.

### 6.1 GENERAL rules (every project) - `library/rules/general/`

| File | Lines | Loads | Default | One-line purpose | V1-only names inside |
| --- | --- | --- | --- | --- | --- |
| `parallel-agent-sessions.md` | 21 | always | ON | Assume other sessions are live: run `git worktree list`, `git status`, `git fetch origin && git log --oneline -10` before the first edit; own worktree `git worktree add .claude/worktrees/<name> -b claude/<name>` for code/rules/skills/hooks/settings (one-file edit exception); never switch/reset/rebase/stash the primary checkout; stage by name, never `git add -A`/`.`/`commit -a`; never hand-edit generated files; claim sequential numbers first; land by PR with owner approval or a standing merge instruction; merge-safety check; remove worktree and branch after merge. | names `publish-docs` skill (git-workflows plugin) |
| `knowledge-direct-commit.md` | 17 | `paths:` `knowledge/**`, `prds/**`, `PROJECT.md`, `docs/**`, `**/README.md` | ON | Authorized documentation-only saves use a temporary worktree and publish straight to the default branch without a PR; rules/skills/hooks/prompts/settings/code always use a worktree and PR; saving a document does not approve it; stage by name; never force-push; verify the remote. Steps in `publish-docs`. | `knowledge/**`, `prds/**` |
| `offer-context-handoff.md` | 3 | always | ON | When the session is long and the next step is complex, offer the `handoff` skill; "It runs the `knowledge-save` review first". | `knowledge-save` |
| `plain-english-artifacts.md` | 81 | always | ON | Words inside any artifact (diagram, chart, dashboard, mockup, deck, published page, generated doc) follow the output style: write about the subject, a heading names what is under it, use the real name, no figurative language, no preamble, no cheering close. Decides words, never layout. Exists because output styles reach only the main chat. | none |
| `humanize-outbound-text.md` | 13 | always | ON | Text leaving the project for someone other than the owner (email, chat, support case, GitHub issue, PR description, client doc) goes through the `humanizer` skill, or `unslop` if absent; keep every fact, name, id, number, date. Not for chat to owner, work items, knowledge, code, commit messages. | none (needs a `humanizer` or `unslop` skill) |
| `work-item-stages.md` | 12 | always | ON | Tracker is source of truth; open the `work` skill before substantial work; save owner decisions in the item; `build`/`data-load` needs approved requirements (a later stage does not revoke it); ask how the team is arranged after agent-led delivery is accepted; Done only with owner approval; record the exact next step before stopping. Full policy in the `work` skill's `references/lifecycle.md`. | `work` skill name |
| `ai-external-knowledge.md` | 50 | `paths:` `ai-external-knowledge/**` | ON (with the folder) | Outside docs captured as Markdown go in `ai-external-knowledge/`, one folder per topic, each naming source URL and capture date; raw source only; project truth wins and the disagreement is said out loud; never edit a capture; nothing reads the folder unless pointed at; do not commit material without redistribution rights. | V1 says a per-topic `README.md` |
| `work-item-folders.md` | 47 | always | Listed as default ON, but applies **only with the local `work-tracker`** | Protect `.work-items/`: always `work add` (shared ID lock), `WORK-ITEM.md` for new items, never hand-edit `ITEM.yaml`/`STATUS.md`/`HISTORY.ndjson`/`ACTIVE.json`/`EVENTS.ndjson`, `DASHBOARD.md` is generated, never move items or invent groups without the owner, `archive/` location is the only archive record, never archive on your own initiative. | V1 `work` CLI commands |
| `dependency-graph.md` (graphify) | 65 | always (no frontmatter) | Conditional: only with the graphify kit | Answer "what calls this / what breaks" from `graphify affected/query/path/god-nodes/explain`, cite file and line; `graphify update .` when stale; `graphify hook install` once per clone; exactly one freshness mechanism; build with `--code-only` and `--no-label`; never commit `graphify-out/`; name the blind spot (runtime dispatch, reflection, config wiring). | none |

### 6.2 SALESFORCE-ONLY rules - `library/rules/salesforce/`

The library README's "default set for any Salesforce project" is the first four
rows below.

| File | Lines | Loads | Skill it opens | One-line purpose | V1-only names inside |
| --- | --- | --- | --- | --- | --- |
| `delivery-and-knowledge-boundary.md` | 8 | always | none | New projects use `delivery/`; an `engagement/` project keeps it (no rename, no parallel tree); where a rule says `delivery/`, use `engagement/` there; curated knowledge goes in the knowledge system, never `delivery/knowledge-base/`. | `knowledge/`, `prds/`, `.toolkit-memory.json` external |
| `salesforce-safety-guardrails.md` | 26 | always | none | Read-only against every org except listed sandbox actions. Allowed: data reads, metadata retrieve/describe, Apex tests and logs, `deploy validate`/`preview`/`report` to a sandbox, sandbox deploy and sandbox data writes / `sf apex run` after a yes in the same chat. Never: deploy or validate to production, production data writes or anonymous Apex, `sf project delete source`/`force:source:delete`, deleting an org, manifest-less `force:*` deploys, any change without explicit `-o <sandbox>`, CLI-deploying a profile, permission set deploy without clean `permsets.py preflight`, adding production to `neverProtect`, rewriting a blocked command or weakening a guard. Explains what `guard-protected-orgs.js` checks. | none |
| `salesforce-change-clarify.md` | 10 | always | none | Confirm intent and scope before object-model, security/access, integration, data-source-priority changes, or anything contradicting signed-off scope; state what changes, which components, what could break; wait. | none |
| `deploy-hitchhiker-check.md` | 7 | always | `sf-deploy-check` | Before any deploy to a shared/higher org, or handing over a production deploy command, run the hitch-hiker check; verify suspects read-only against the target; stop on a confirmed hitch-hiker. | none |
| `component-tracker.md` | 5 | always | `sf-component-tracker` | On authoring/modifying/renaming/deleting metadata under `force-app/`, in the same response update `delivery/deployment/component-tracker.csv`, `delivery/deployment/_master/package.xml`, and the work item's manifest folder; update org flags when the owner reports a landed deploy; never for a failed one. | none |
| `data-change-handoff.md` | 9 | always | `sf-data-change` | No agent writes production data by any route; sandbox writes need a same-chat yes; reads allowed; a yes covers one change; never commit load/backup files; open `sf-data-change` to hand over file, backup, steps, success check, undo. | none |
| `production-data.md` | 11 | `paths:` `delivery/data/**`, `engagement/data/**` | `sf-data-change` | Backups in `delivery/data/production-backups/prod-backup-<MMDDYYYY>-<slug>/`, loads in `delivery/data/data-loads/<change-slug>-<MMDDYYYY>/`; each subfolder gets a committed `README.md`; never commit `*.csv`/`*.xlsx`/`*.xls`. | per-event README (model removed it) |
| `deployment-runbook.md` | 10 | `paths:` `delivery/deployment/**`, `engagement/deployment/**` | `sf-component-tracker` | When metadata needs an action a deploy cannot perform, add a step to `manual-steps.md` in the work item's manifest folder in the same response; when unsure, add it. | none |
| `permissions-source-control.md` | 28 | `paths:` `force-app/**/permissionsets/**`, `force-app/**/permissionsetgroups/**`, `force-app/**/profiles/**` | none (tool `permsets.py`) | Permission set deploy replaces the whole component. Fetch only with `permsets.py fetch`, verify, fetch fresh before edit, `permsets.py preflight` before every deploy (receipt expires in 30 min, `--accept-removals` to remove on purpose), sandbox only, never `--ignore-conflicts`, keep `sourceApiVersion` equal to org, `check` then `tidy` before commit, re-add `RETRIEVE_BLIND_SPOTS` grants, recalculate permission set groups, never hand-merge conflicts, no `Activity.` field permissions, profiles excluded, never edit the guard hook. | none |
| `dependency-graph.md` (Salesforce) | 18 | `paths:` `force-app/**`, `tools/kb/**` | none (tool `tools/kb/`) | Answer impact questions from `python tools/kb/build_edges.py` + `python tools/kb/query_graph.py <Object.Field>` and cite; never claim "nothing writes this field" from the edge list alone; handle `tools/kb/_drift_pending.md` this session; update the written explanation after meaningful `force-app/` changes; never commit `tools/kb/out/`, `_freshness_stamp.json`, `_drift_pending.md`; only `pull_org_dependencies.py`, `build_org_catalog.py`, `compare_dependencies.py` may contact an org and only with `sf data query`; aliases in `tools/kb/org-aliases.json`; `GRAPH_FRESHNESS=0` disables the Stop hook. | `knowledge/`, `knowledge-save` |

A Salesforce project gets the Salesforce `dependency-graph.md`, never the
graphify one. Both land as `.claude/rules/dependency-graph.md`.

### 6.3 Rules removed on purpose (do not re-add without asking Mike)

From `library/rules/general/README.md`:

- 2026-08-31: `spec-before-you-build.md`, `track-open-topics.md`,
  `honest-verification.md`, `do-the-technical-work.md`,
  `keep-claudemd-current.md` (reason: the default set had grown to about 6,900
  words loaded every session).
- 2026-09-02 (removed by the owner): `recommend-the-best-solution.md`,
  `follow-the-output-style.md`, `ask-before-assuming.md`,
  `project-file-lifecycle.md`.
- Voice rules replaced by the output style: `writing-and-language.md`,
  `how-to-reply.md`, `treat-owner-as-non-technical.md`, `define-your-terms.md`.
  "Do not add a voice rule to this folder."
- Machine-wide rules removed 2026-09-02: `propose-the-best-solution.md`,
  `keep-design-out-of-requirements.md`.
- Retired machine rule 2026-08-31: `~/.claude/rules/activate-project-knowledge.md`.

Note: Mike's own `~/.claude/rules/` still carries some of these ideas
(`steer-to-the-goal.md`, `explain-for-a-middle-schooler.md`,
`quiet-while-working.md`) at the machine level. That is his personal setup,
not a toolkit rule.

### 6.4 MCP tool rules (conditional, `library/guides/mcp-best-practices.md`)

Sections: Context7, Gmail, Google Calendar, Linear, Notion, Playwright. Folded
into `AGENTS.md` or a rule only for servers the project connects. The Notion
section: search before creating (`notion-search`); fetch the parent before
adding; block formatting; prefer inline comments for review; read current
state before updating and use targeted property updates. Relevant to V2's
Notion tracker and Notion memory, though V2 plans to use the `ntn` CLI.

---

## 7. The rest of the library

### 7.1 Salesforce skills - `library/skills/salesforce/`

Installed with the rule that opens them, twice, byte-identical:
`.claude/skills/<name>/SKILL.md` and `.agents/skills/<name>/SKILL.md`.
Frontmatter is `name` + `description` only.

| Skill | Lines | Description (frontmatter, abridged) | Paths it assumes |
| --- | --- | --- | --- |
| `sf-component-tracker` | 181 | "Use when you author, modify, rename, or delete Salesforce metadata under force-app/, when the owner reports a deploy that landed or failed, or when a deploy needs manual pre- or post-deploy steps. Keeps the component tracker CSV, the master manifest, the per-work-item manifests, destructiveChanges.xml, and manual-steps.md in sync." | `delivery/deployment/component-tracker.csv`; `delivery/deployment/_master/{package.xml,manual-steps.md}`; `delivery/deployment/<work-item-id>/{package.xml,destructiveChanges.xml,manual-steps.md}` (flat, e.g. `WI-12-account-merge`); root `.work-items/`; `engagement/deployment/` fallback. CSV columns fixed, in order: `Component Type, Object/Parent, API Name, Label, Work Item, Change Type, Sandbox, Production, Notes`. Change Type `New`/`Modified`/`Destructive`. Types kept out of manifests: profiles, duplicate rules, matching rules, compact-layout assignments. |
| `sf-data-change` | 103 | "Use when Salesforce production data must be created, updated, upserted, or deleted, when a backup is needed before a data change, or when you create or edit files under delivery/data/ or engagement/data/. Produces the owner's handoff package (load file, backup file, numbered load steps, success check, undo steps) and files it in the production-backups and data-loads layout with the required README." | `delivery/data/production-backups/prod-backup-<MMDDYYYY>-<slug>/`, `delivery/data/data-loads/<change-slug>-<MMDDYYYY>/`, each tree with a `.gitignore` of exactly `*.csv`, `*.xlsx`, `*.xls`, `!.gitignore` plus a header comment. |
| `sf-deploy-check` | 45 | "Use when you are about to deploy Salesforce metadata to a shared or higher org (full-copy, staging, or production), or to hand the owner any production deploy command. Runs the hitch-hiker check that finds components or pending edits that would ship with the deploy before their feature is ready." | reads the component tracker if present; `python tools/kb/query_graph.py <Object.Field>` when `tools/kb/` exists; `_master/package.xml` vs work-item `package.xml`. |

### 7.2 Output styles - `library/output-styles/`

| File | `name` | Default | Frontmatter | Content summary |
| --- | --- | --- | --- | --- |
| `plain-english.md` | `Plain English` | ON (installed and selected by setup) | `name`, `description`, `keep-coding-instructions: true` | 4 sections: Answer directly; Make the reply easy to read (ordinary words, literal, no "not this, but that" contrasts); Report work accurately (exact status verbs written/built/tested/merged/installed/seen working; one bullet per work item); always say one line when the user lost something, an action cannot be undone, work is blocked on the user, or there is a cost. |
| `terse.md` | `Terse` | OFF | same fields | Short replies for scanning; takes the agent's role from `SOUL.md` and the user's role from `knowledge/project.md` (or `PROJECT.md`) "Who is involved"; default reader "product owner". |

Rules from the styles README: 50-line working ceiling per style (issue #102);
`keep-coding-instructions: true` unless the style is for non-engineering
work; the `outputStyle` value must equal the `name` field exactly, a mismatch
silently falls back to default. Output styles reach the main conversation and
forks only, never subagents or Codex. Captured docs also allow plugin-shipped
styles in a plugin's `output-styles/` folder, with frontmatter
`force-for-plugin: true` to apply automatically (`output-styles.md` line 106).

### 7.3 Templates - `library/templates/`

`settings-permissions.json` (merged into committed `.claude/settings.json`):

```json
"general": {
  "deny": ["Bash(git add -A)", "Bash(git add -A *)", "Bash(git add --all)",
    "Bash(git add --all *)", "Bash(git add .)", "Bash(git add . *)",
    "Bash(git commit -a *)", "Bash(git commit -am *)", "Bash(git commit --all *)",
    "Bash(git commit --no-verify *)", "Bash(git commit * --no-verify)",
    "Bash(git commit * --no-verify *)", "Bash(git commit -n *)",
    "Bash(git commit * -n)", "Bash(git commit * -n *)",
    "Bash(git push --force *)", "Bash(git push * --force)", "Bash(git push * --force *)",
    "Bash(git push -f *)", "Bash(git push * -f)", "Bash(git push * -f *)",
    "Bash(git push --force-with-lease*)", "Bash(git push * --force-with-lease*)"],
  "ask": ["Bash(git reset --hard *)", "Bash(git clean *)"] },
"salesforce": {
  "deny": ["Bash(sf project delete source *)", "Bash(sfdx force:source:delete *)",
    "Bash(sf org delete *)"],
  "ask": ["Bash(sf project deploy start *)", "Bash(sf data create *)",
    "Bash(sf data update *)", "Bash(sf data delete *)", "Bash(sf data import *)",
    "Bash(sf data upsert *)", "Bash(sf apex run *)"] }
```

Its `about` field: `ask` does not prompt in `bypassPermissions` mode, so the
owner's same-chat yes remains the real rule for those actions.

`permissions-runbook.md` (206 lines): the project's permission set operating
runbook. Placeholders `<SANDBOX>`, `<PACKAGE_DIR>`, a "Verified on this org"
section, and an HTML comment with fill-in steps and where it goes.

`toolkit-manual.md` (215 lines): "Toolkit Operating System manual". Starts with
`## Summary` and `## Summary for the external memory mode` (the hook prints one
of them, cut at 120 words). Other sections: How to use this manual; Roles;
Startup; Parts of a session; Project map; From a request to a checked result
(Establish the goal and position; Understand the system; Decide the change and
organize the work; Do and check the work; Deliver and record); Pause, resume,
and switch; Keep the project equipped (Propose a project lesson as a toolkit
change); Component owners. Heavily V1 (`knowledge-find`, `knowledge-save`,
protocol-guard, pre-commit knowledge check). The model replaced it with a 46-
line V2 `docs/toolkit-manual.md` (section 11.5).

### 7.4 Multi-part kits (install all parts or none)

| Kit | Part 1 tool | Part 2 ignore entries | Part 3 rule | Part 4 hook | Stack |
| --- | --- | --- | --- | --- | --- |
| Permission set kit (`guides/salesforce-permissions-retrieval.md`) | `library/tools/permsets.py` to `tools/permissions/permsets.py` (+ short `tools/permissions/README.md`). Python 3.10+, stdlib only. Subcommands `fetch`, `verify`, `check`, `tidy`, `preflight`; writes receipts to `.claude/.permset-preflight/<Name>.json`; `RETRIEVE_BLIND_SPOTS = ["ManagePackageLicenses"]`. Also `templates/permissions-runbook.md` as the runbook. | `.claude/.permset-preflight/` | `salesforce/permissions-source-control.md` | `guard-permission-set-deploy.js` (hooks-library) | Salesforce |
| Salesforce dependency graph (`guides/salesforce-dependency-graph.md`) | whole `library/tools/kb/` to `tools/kb/` (39 .py files: 24 top-level incl. 7 `test_*.py`, 15 in `extractors/`; stdlib only; never contacts an org to build) | `tools/kb/out/`, `tools/kb/_freshness_stamp.json`, `tools/kb/_drift_pending.md`, `tools/kb/_prev-*.json`, `__pycache__/`, `*.pyc` | `salesforce/dependency-graph.md` | `python "${CLAUDE_PROJECT_DIR}/tools/kb/graph_freshness_hook.py"` under `hooks.Stop`, timeout 60 | Salesforce |
| graphify (`guides/graphify-dependency-graph.md`) | `uv tool install graphifyy` (PyPI name has two y's; command `graphify`) | `graphify-out/` | `general/dependency-graph.md` | `graphify hook install` (Git post-commit and post-checkout hooks, never committed, run once per clone) | non-Salesforce |

Verify steps for the Salesforce graph: run the 7 test files
(`OK (skipped=N)` is a pass), `python tools/kb/build_edges.py` prints `PASS`
checks (empty `force-app/` stops with a "where it looked" message), and one
`query_graph.py <Object>.<Field>` returns writers, direct connections, impact
radius.

### 7.5 Library hook - `library/hooks/toolkit-session-start.mjs`

- Language: Node ESM (`.mjs`), no dependencies. Event: `SessionStart`,
  matcher `startup|resume|clear|compact`, timeout 10.
- Claude registration (in `.claude/settings.json`):
  `node "$CLAUDE_PROJECT_DIR/.claude/hooks/toolkit-session-start.mjs"`.
- Codex registration (in `.codex/hooks.json`):
  `node "$(git rev-parse --show-toplevel)/.claude/hooks/toolkit-session-start.mjs"`,
  plus `commandWindows` (PowerShell), `timeout: 10`,
  `additionalContextLimit: 1000`, `statusMessage: "Reading Toolkit orientation route"`.
- Output: a header line, the manual's `## Summary` (120-word cap, built-in
  default if missing), then gap lines: missing/empty/unreadable manual;
  missing root `AGENTS.md`; `CLAUDE.md` that is not exactly `@AGENTS.md`.
  Never prints the manual body; asks for no acknowledgment; always exits 0.
- Reads `.toolkit-memory.json` (V1 schema: `format: 1`, `memory: "external"`,
  `service` mem0|hindsight, `server` `[A-Za-z0-9_-]+`, non-empty `project`) to
  choose `knowledge/toolkit-manual.md` vs `docs/toolkit-manual.md`.
- V2 impact: its `CLAUDE.md` check contradicts "AGENTS.md only" and must go.
  The model already ships a rewritten version (section 11.3).

### 7.6 Guides - `library/guides/`

| Guide | Lines | Use |
| --- | --- | --- |
| `salesforce-dependency-graph.md` | 200 | Install/verify/use the `kb/` kit; "Known limits"; optional org cross-check. |
| `graphify-dependency-graph.md` | 154 | Install/use the graphify kit for non-Salesforce stacks. |
| `salesforce-permissions-retrieval.md` | 224 | End-to-end permission set process; install table; one-time retrieve proof; trap list. Profiles excluded by default. |
| `salesforce-permissions-research.md` | 323 | Evidence behind the permission process: live test, element reference, tracked CLI bugs, tooling landscape (checked 2026-07-29), rejected options, sources, re-check triggers. |
| `mcp-best-practices.md` | 112 | Per-MCP-server rules (section 6.4). |

The model's `docs/permissions-runbook.md` points to the two permission guides
inside "the Project Init plugin's `library/guides/`". If V2 does not ship
them, that pointer breaks. Recommendation: ship both guides with the V2
Salesforce package.

---

## 8. Salesforce scaffold (V1 `salesforce-project-scaffold.md`)

```
<project>/
├── sfdx-project.json
├── .gitignore
├── .forceignore
├── README.md
├── config/project-scratch-def.json
├── force-app/main/default/
├── manifest/package.xml
├── scripts/{apex/,soql/}
├── ai-external-knowledge/
├── delivery/
│   ├── project-overview/  architecture/  archive/  communications/
│   ├── deliverables/  deployment/  meeting-notes/  references/
│   └── data/{production-backups/, data-loads/}
├── .claude/{settings.json, rules/, hooks/, skills/, agents/}
└── .agents/skills/
```

Config defaults: `sourceApiVersion` = current Salesforce API version;
`namespace` empty; package dir `force-app` default; scratch edition
`Developer`. `.gitignore` covers `.sfdx/`, `.sf/`, `.localdevserver/`,
`*.log`, `.claude/worktrees/`. `.forceignore` excludes `package.xml`, LWC
config files, Jest tests. Existing `engagement/` projects keep that root.

Model differences: the model has no `config/`, `manifest/`,
`scripts/apex|soql`, or `delivery/architecture/` (its README says add
`manifest/` or `scripts/` when needed); it adds `requirements/`,
`PROJECT.md`, `PROJECT-ROADMAP.md`, `docs/system-guide/`, `tests/`, and
per-item `*-template/` folders; its `.forceignore` holds `**/jsconfig.json`
and `**/.eslintrc.json` only; its `sfdx-project.json` has no
`sourceApiVersion`. Empty model folders (`delivery/deliverables/`,
`delivery/meeting-notes/`, `force-app/`) need a `.gitkeep` or creation at init,
because Git does not track empty folders.

---

## 9. machine/, machine-sync, project-sync, work-item-lifecycle

### 9.1 machine/ (lands in `~/.claude/`)

| Piece | Lands at | Purpose |
| --- | --- | --- |
| `machine/rules/no-ai-attribution.md` | `~/.claude/rules/no-ai-attribution.md` | No AI credit on anything committed or pushed (trailers, "Generated with Claude Code", comments, headers, docs, author fields). |
| `machine/settings/required.json` | merged into `~/.claude/settings.json` | `{"attribution": {"commit": "", "pr": ""}}` |
| `no-ai-attribution-guard.mjs` (script in hooks-library) | `~/.claude/hooks/` + `PreToolUse` `Bash` entry with an absolute forward-slash path | Refuses publishing commands carrying AI credit. |

Test for membership: must hold in a repo never set up with the toolkit, and
must not already be in `library/`. These three are one item; partial install
is reported incomplete.

### 9.2 machine-sync skill

Steps: 1 refresh installed plugin (`/plugin marketplace update claude-toolkit`);
2 read `machine/README.md`; 3 resolve `~/.claude/` (honor
`CLAUDE_CONFIG_DIR`) and `~/.codex/`; 4 audit (Missing / Behind / Matches /
Conflicts), including inline copies in `~/.claude/CLAUDE.md`, both halves of a
hook (script and registration), and one retired rule
(`activate-project-knowledge.md` plus a marked block in `~/.codex/AGENTS.md`);
5 one numbered table, wait; 6 install approved items (merge settings key by
key, copy hooks, never symlink, absolute paths, never `$CLAUDE_PROJECT_DIR`);
7 prove (run the guard against a deny case and an allow case) and write
`~/.claude/toolkit-machine-sync.md`. Never sets
`CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` in user settings.

### 9.3 project-sync skill (994 lines)

Audit-then-fix sibling of project-init for existing projects. Step 1
inventory from the installed plugin; step 2 audit each item; step 3 one
report table; step 4 close approved gaps one at a time; step 5 write
`.claude/toolkit-sync.md` (toolkit version, date, set up, updated, declined,
System Guide state, moved instruction files). Status classes: present,
outdated, partial, missing, retired, declined, not applicable (System Guide:
on/off/needs repair). Notable audits: rule drift judged by points not words
(project ahead of toolkit = flag for port-back, never overwrite);
instruction-file pair; AGENTS.md health (size under 200 lines, duplication
with rules, communication section, procedures, changelog-style codemap,
missing tools section, fixed lines, context sources not in codemap, live
state); folder AGENTS.md files; skill copies byte-identical in both hosts;
`.claude/rules/README.md` must move to `.claude/RULES.md`; permissions rules;
retired hooks to remove (`work-item-stage-reminder`, `style-reminder`,
`writing-guard`, `explain-simply-reminder`, `memory-pr-hook` +
`wrap-up-ritual.md`, `plain-language.md` style). V2's GOAL does not name a
sync skill; see open questions.

### 9.4 work-item-lifecycle skill

Description: "Apply the project's file lifecycle to work-item information.
Use when creating, saving, moving, organizing, completing, closing, or
archiving work-item files, or when deciding where architecture, solution
designs, specifications, lasting decisions, implementation records,
presentation deliverables, or retired material belong. ... Do not use for a
status-only ticket update that changes no project files or lasting
information." Principle: "Each kind of project information gets one lasting
home and stays there. A closed work item is not a reason to archive something
that is still true." Routes a solution design to the item (local
`.work-items/`) or `docs/designs/<id>-<slug>.md` (external). Close
checklist: link current architecture/specs/decisions/implementation, keep
them in place, archive only retired material, close via tracker. Report as
Authority / Home / Why / Action / Links or gaps.

V2 impact: the model forbids `docs/designs/` ("Never create `docs/designs/`";
design stays with its item: local `DESIGN.md`, or the external item's record
or attachments, or in Notion a Solution Design subpage). This skill overlaps
with the V2 work-item orchestration skills and should be merged into them,
not ported separately.

---

## 10. How Codex adapters are written in V1

| Need | Claude Code | Codex |
| --- | --- | --- |
| Root instructions | `CLAUDE.md` = `@AGENTS.md` (V1). V2: `AGENTS.md` natively (Claude Code 2.1.277+). | `AGENTS.md` natively. No `@` import expansion; 32 KiB budget across the root-to-cwd chain; `AGENTS.override.md` hides `AGENTS.md`. |
| Rules | `.claude/rules/*.md` auto-loaded; `paths:` scoping | Not loaded. Reached only through `Read .claude/rules first.` in `AGENTS.md`, plus one `AGENTS.md` line per `paths:` rule. |
| Project skills | `.claude/skills/<name>/SKILL.md` | `.agents/skills/<name>/SKILL.md`, byte-identical copy, `name` + `description` frontmatter only, no symlinks. |
| Startup hooks | `.claude/settings.json` `hooks.SessionStart` | `.codex/hooks.json` `hooks.SessionStart`, same script path under `.claude/hooks/`, fields `command`, `commandWindows`, `timeout`, `additionalContextLimit`, `statusMessage`. |
| Guard hooks (PreToolUse) | `.claude/settings.json` | None registered in V1. project-sync calls "a rule Codex cannot see, backed by a hook that never runs for Codex" the worst state. |
| MCP servers | project `.mcp.json` | `~/.codex/config.toml` `[mcp_servers.<server>]` with `url` and `bearer_token_env_var`, printed for the owner (Codex reads no project MCP file). |
| Plugins | `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` | `.codex-plugin/plugin.json` + `.agents/plugins/marketplace.json` |
| Output style | `.claude/output-styles/` + `outputStyle` setting | None. Rules like `plain-english-artifacts.md` carry the writing guidance instead. |
| Function hooks (protocol-guard) | yes | none |

The model project already has `.agents/skills/` (3 SF skills) and
`.codex/hooks.json` (SessionStart only, command `node ".claude/hooks/toolkit-session-start.mjs"`
with a relative path, not the V1 `git rev-parse` form). No other Codex files.

---

## 11. Model project vs library: what is already there, missing, different

Model path: `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`.
The model is not a Git repository. `tests/__pycache__/` exists in it (a build
artifact; do not copy).

### 11.1 Rules in model `.claude/rules/` (18 files)

| Rule | Source | Status |
| --- | --- | --- |
| `parallel-agent-sessions.md` | general | identical |
| `plain-english-artifacts.md` | general | identical |
| `humanize-outbound-text.md` | general | identical |
| `work-item-stages.md` | general | identical |
| `ai-external-knowledge.md` | general | **differs**: per-topic `README.md` replaced by "`SOURCE-RECORD.md` naming the publisher, source URL, capture date, coverage, redistribution status, and captured pages. The root `INDEX.md` points to the topic folders." |
| `knowledge-direct-commit.md` | general | **differs**: `paths:` now `requirements/**`, `PROJECT-ROADMAP.md`, `PROJECT.md`, `docs/**`, `ai-external-knowledge/**`, `delivery/**`, `**/README.md` (dropped `knowledge/**`, `prds/**`); first bullet begins "In a copied Git repository, ..."; new last bullet "`.memory/` and `.work-items/` are local and Git-ignored. Their saves do not use this publication route." |
| `offer-context-handoff.md` | general | **differs**: `knowledge-save` replaced by "review `.memory/CURRENT_FOCUS.md` and `.memory/memory-criteria.md`; use the V2 curator only for authorized lasting memory." |
| `work-item-folders.md` | general | **missing** from the model (it applies only with the local tracker, which is a V2 option). |
| `dependency-graph.md` | salesforce | **differs**: the two `knowledge/`/`knowledge-save` sentences now say "When they are in `.memory/`, follow `.memory/AGENTS.md` and the V2 curator procedure." |
| `delivery-and-knowledge-boundary.md` | salesforce | **differs**: last bullet now "With Second Brain V2 selected, curated memory goes in the local `.memory/` folder. Accepted feature behavior goes in `requirements/`; the selected work tracker owns active requirements and progress. Never create `delivery/knowledge-base/`." |
| `production-data.md` | salesforce | **differs**: per-event committed `README.md` replaced by "Record the org, population, file paths, counts, operation, success check, and undo steps in the chosen work item and the owner handoff. No extra event README or seed record is required." |
| `salesforce-safety-guardrails.md` | salesforce | identical |
| `salesforce-change-clarify.md` | salesforce | identical |
| `deploy-hitchhiker-check.md` | salesforce | identical |
| `component-tracker.md` | salesforce | identical |
| `data-change-handoff.md` | salesforce | identical |
| `deployment-runbook.md` | salesforce | identical |
| `permissions-source-control.md` | salesforce | identical |
| `memory-curator-dispatch.md` | **model only** | Main-agent rule for the model's V2 memory: decide the destination first (routing table of focus/glossary/topic/tracker/requirements/design/System Guide/skill), onboarding approval card ("## Proposed memory saves" format), trusted mode only by explicit owner grant recorded in criteria frontmatter, dispatch `.claude/agents/memory-curator.md` in the background with a self-contained brief, confirm readback and `doctor`. Memory-specific; belongs to the memory research. |

Model `.claude/RULES.md` indexes all 18 and ends: "Changes here that differ
from the current Toolkit are model proposals tracked in issue #419."

### 11.2 Skills

| Skill | `.claude/skills/` | `.agents/skills/` | vs library |
| --- | --- | --- | --- |
| `sf-component-tracker` | present | present, identical to Claude copy | identical |
| `sf-deploy-check` | present | present, identical | identical |
| `sf-data-change` | present | present, identical | **differs**: description drops "with the required README"; Step 3 simplified (one folder per event; record details in the work item and handoff; no per-event README; test that `.csv` files are ignored); V1 "Step 4: write the folder README" and "First use in a project" sections removed; old Step 5 "hand over" is now Step 4. |

No general skills are copied into the model (session skills, work skills,
sf-architect-solutioning stay as plugins, per the model README).

### 11.3 Hooks and settings

Model `.claude/hooks/`:

| File | Source | Status |
| --- | --- | --- |
| `guard-protected-orgs.js` | hooks-library | identical |
| `guard-permission-set-deploy.js` | hooks-library | identical |
| `toolkit-session-start.mjs` | library/hooks | **differs**: rewritten short version. Reads only `docs/toolkit-manual.md` `## Summary` (120-word cap); gaps for missing manual, missing `AGENTS.md`, `CLAUDE.md` not equal to `@AGENTS.md\n@.memory/MEMORY.md\n@.memory/CURRENT_FOCUS.md`, and missing `.memory/memory-criteria.md` ("do not assume trusted mode"). No `.toolkit-memory.json` parsing, no exports, no try/catch around the whole run. |
| `memory_trigger.py` | model only | Python 3, `UserPromptSubmit`: regex-matches the prompt against `_memory_patterns.py` (remember/forget/correction/standing preference/people/focus/tool/reference/current-focus/lesson labels) and appends an event (session id, time, labels, prompt SHA-256, never the text) to `.memory/.runtime/trigger-events.jsonl`. Non-blocking. |
| `memory_audit.py` | model only | Python 3, `Stop`: diagnostic audit that counts curator dispatches (Agent/Task tool uses with `subagent_type` memory-curator) in the transcript against trigger events, writes `.memory/.runtime/memory-audit.jsonl`. Never blocks. |
| `_memory_patterns.py` | model only | shared regex list ("A match is a review hint, never write permission"). |

Model `.claude/protected-orgs.json` **differs** from
`hooks-library/templates/protected-orgs.json`: `"action": "deny"` (V1 default
`"ask"`) and a V2 `_comment` ("agents never deploy or validate against
production. The production guard hard-blocks recognized production; unknown
targets ask."). Other fields equal: `unknownOrgAction: "ask"`,
`sandboxAction: "ask"`, `confirmOrgDeleteAlways: true`, empty
`alwaysProtect`/`neverProtect`.

Model `.claude/settings.json`:
- `"autoMemoryEnabled": false`
- `"enabledPlugins": { "second-brain@claude-toolkit": false }`
- `hooks.UserPromptSubmit`: `python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/memory_trigger.py"` (timeout 5)
- `hooks.Stop`: `memory_audit.py` (timeout 5) and `tools/kb/graph_freshness_hook.py` (timeout 60)
- `hooks.SessionStart` (`startup|resume|clear|compact`): `toolkit-session-start.mjs` (timeout 10)
- `hooks.PreToolUse` (`Bash|PowerShell`): `guard-protected-orgs.js` (timeout 90) and `guard-permission-set-deploy.js` (timeout 30)
- `"outputStyle": "Plain English"`
- `permissions.deny` = general deny + salesforce deny; `permissions.ask` = general ask + salesforce ask (exactly the template lists).
- No protocol-guard keys, no `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS`.

Model `.codex/hooks.json`: SessionStart only, `toolkit-session-start.mjs`,
`additionalContextLimit: 1000`, `statusMessage: "Reading Toolkit orientation route"`.
The Salesforce guards and memory hooks are not registered for Codex.

Model `.toolkit-memory.json` uses a **different schema** from V1:
`{"schema": 2, "memory": "second-brain-v2", "location": ".memory", "activeWriter": "memory-curator"}`.
V1 readers (`toolkit-session-start.mjs`, `spec-check-reminder.mjs`,
protocol-guard `memory-config.mjs`) expect `format: 1` and treat anything else
as `files` mode. V2 needs one schema that also records the tracker and the
memory choice (builtin / hindsight / notion).

### 11.4 Output style

`.claude/output-styles/plain-english.md` is identical to the library. `terse.md`
is not in the model.

### 11.5 Tools, templates, other files

- `tools/kb/` identical to `library/tools/kb/` (every file).
- `tools/permissions/permsets.py` identical. `tools/permissions/README.md` is
  model-written (points to `../../docs/permissions-runbook.md`; notes the
  model has no connected org).
- `docs/permissions-runbook.md` = library template with the placement comment
  rewritten for V2 ("the runbook stays in `docs/`") and the evidence pointer
  changed to "the Project Init plugin's `library/guides/...`".
- `docs/toolkit-manual.md` (46 lines) replaces the 215-line V1 template:
  sections Summary; Selected systems (table: Work tracker, Memory, System
  Guide, Agent hosts); Start and continue work; Complete and hand off work;
  Second Brain V2 operation; Project-specific setup.
- `.gitignore` already has every kit entry: `.memory/`, `/.work-items/`,
  `.sfdx/`, `.sf/`, `.localdevserver/`, `.claude/worktrees/`, `*.log`,
  `__pycache__/`, `.claude/.permset-preflight/`, `tools/kb/out/`,
  `tools/kb/_freshness_stamp.json`, `tools/kb/_drift_pending.md`,
  `tools/kb/_prev-*.json`, `*.pyc`.
- `delivery/data/{data-loads,production-backups}/.gitignore` match the
  `sf-data-change` content (header comment, `*.csv`, `*.xlsx`, `*.xls`,
  `!.gitignore`).
- `delivery/deployment/component-tracker.csv` holds only the fixed header row.
- `.claude/agents/memory-curator.md` (model only; `model: opus`,
  `background: true`, tools Read/Write/Edit/Glob/Grep/Bash), `scripts/memory.py`
  (505 lines), `tests/test_memory_runtime.py`: memory system, out of scope here.
- Instruction files: root `AGENTS.md` + `CLAUDE.md`; scoped `docs/`,
  `requirements/`, `.memory/` each with `AGENTS.md` + one-line `CLAUDE.md`
  (`@AGENTS.md`). Root `CLAUDE.md` is three lines:
  `@AGENTS.md`, `@.memory/MEMORY.md`, `@.memory/CURRENT_FOCUS.md`.

### 11.6 Conflicts between the model and V2 settled decisions

1. **CLAUDE.md files.** V2 is "AGENTS.md only, no CLAUDE.md". The model has 4
   `CLAUDE.md` files, and the root one is the startup route for
   `.memory/MEMORY.md` and `.memory/CURRENT_FOCUS.md`. The model's session
   hook also flags a missing `CLAUDE.md` as a gap. V2 must drop all four,
   move the two memory reads to the `AGENTS.md` Startup section (it already
   says to read `.memory/CURRENT_FOCUS.md`) and/or have the SessionStart hook
   print them, and remove the `CLAUDE.md` check from the hook. Captured docs
   (`memory.md` "When AGENTS.md support is unavailable") list cases where
   Claude Code reads `CLAUDE.md` only: versions before 2.1.277, sessions that
   do not fetch feature flags (Bedrock, telemetry off), the first session
   after install/upgrade, and `disableAllHooks` / `allowManagedHooksOnly` / the
   built-in `agents-md` plugin disabled. Also: `InstructionsLoaded` hooks do
   not fire for an `AGENTS.md` read natively, and `/context` does not list it.
   A subdirectory `AGENTS.md` loads "when Claude opens a file there with the
   Read tool". The V2 SessionStart hook could warn when the Claude Code version
   is below 2.1.277.
2. **Memory config schema** (see 11.3).
3. **Hooks registered for Claude only.** The model registers the memory hooks
   and Salesforce guards only in `.claude/settings.json`. V2 finish item 6
   requires work-item and memory hooks seen running in Codex too.
4. **`docs/designs/`.** V1 creates it for external trackers; the model forbids
   it. V2 tracker packages must put the design with the item.

---

## 12. Stale or contradictory V1 text (do not copy into V2)

1. `references/work-tracking-choice.md` step 8 says the fourteen stage labels
   are in `library/rules/general/work-item-stages.md`. They are only in
   `work-tracker/skills/work/references/lifecycle.md`.
2. `references/root-file-examples.md` names `python3 tools/kb/build_graph.py`
   and a `kb-graph` MCP server. Neither exists; the tool is `build_edges.py` +
   `query_graph.py`, with no MCP server.
3. project-init SKILL.md Gate 1 says `docs/designs/` gets "no `README.md`" and
   later "a short `README.md`".
4. project-init SKILL.md Gate 5 lists removed rules as default ON (section 4).
5. `knowledge-direct-commit.md` is called "unscoped" in SKILL.md, setup-flow,
   and project-sync ("Remove legacy path-scoped frontmatter"), but the library
   file itself has `paths:` frontmatter and the general README calls it
   path-scoped.
6. `library/rules/general/README.md` lists `work-item-folders.md` under
   "Default ON" but the rule says it applies only to local tracking.
7. `offer-context-handoff.md`, `dependency-graph.md` (SF),
   `delivery-and-knowledge-boundary.md`, `terse.md`, `toolkit-manual.md`,
   `spec-check-reminder.mjs`, `toolkit-session-start.mjs` all name V1
   `knowledge/`, `prds/`, `PROJECT.md` external mode, `knowledge-save`, or
   `knowledge-find`.
8. sf-architect-solutioning says "(or CLAUDE.md in a project still in the old
   layout)" in 5 places and ends its template with "hand off to sf-develop",
   a skill that is not in the toolkit (the SKILL.md already says to use it
   "only if it is actually installed").
9. The Codex hook fields `commandWindows`, `additionalContextLimit`,
   `statusMessage` and the `.agents/skills/` location are used but not
   documented in the captured Codex docs (only `agents-md.md` is captured).

---

## 13. V2 disposition: suggestions for the architect

These are recommendations from this research, not settled decisions.

### 13.1 V1 gate items against the three V2 questions

| V1 item | V2 suggestion |
| --- | --- |
| Gate 0 orient | Keep, silent (detect empty vs existing, detect `sfdx-project.json` to pre-answer the Salesforce question). |
| Stack layout recommendation | Replace by copying the reviewed model scaffold (minus `.work-items/`, `.memory/`). |
| Folder `AGENTS.md` + `CLAUDE.md` pairs | Drop the `CLAUDE.md` half. Keep only the model's scoped `AGENTS.md` files (`docs/`, `requirements/`, `.memory/`). |
| Tracker question (6 answers) | Becomes V2 question 1 with 4 answers: local `.work-items/`, Notion, GitHub Issues, Jira. BMAD and Linear drop out. GitHub board setup steps and statuses/labels are reusable for the GitHub Issues template. |
| `ai-external-knowledge/` offer | Always install (model has it with `INDEX.md` and `topic-template/`). |
| `docs/designs/` offer | Drop (design lives with the item). |
| Salesforce scaffold, SF rules, SF skills | Install all when question 3 is yes. |
| Permission set kit, SF dependency graph kit | Install when Salesforce (the model already carries both kits); or ask one sub-question. Open question. |
| Gate 2 spec-check-reminder | Optional; ship only with `spec-check`, and update its PRD path to `requirements/`. |
| Gate 2 SF guards + freshness hook | Install when Salesforce. |
| Gate 3 System Guide | Not in the three V2 questions. Model has `docs/system-guide/AREA-TEMPLATE.md` and the `.system-guide.json` fallback line. Open question. |
| Gate 3 project knowledge / memory mode | Becomes V2 question 2: built-in `.memory/`, local Hindsight, Notion. |
| Gate 3 framing questions for `project.md` | Reuse for the model's `PROJECT.md` seed (purpose, outcome, scope, people, systems). |
| Gate 4 graphify | Non-Salesforce only; not in the three V2 questions. Open question. |
| Gate 5 toolkit manual + session hook | Always install, V2 versions (model `docs/toolkit-manual.md` and a V2 hook without the `CLAUDE.md` check). |
| Gate 5 continuity line | Always (model has it verbatim). |
| Gate 5 SOUL.md | Model ships a seed `SOUL.md` template. Keep as a seed, or ask. |
| Gate 5 general rules | Always install: `parallel-agent-sessions`, `knowledge-direct-commit` (V2 paths), `offer-context-handoff` (V2 text), `plain-english-artifacts`, `humanize-outbound-text`, `work-item-stages`, `ai-external-knowledge` (V2 text). Install `work-item-folders` only with the local tracker, rewritten for V2 `WORK-ITEM.md` records and nesting. |
| Gate 5 `.claude/RULES.md` | Keep (model has it). |
| Gate 5 path-scoped lines in `AGENTS.md` | Keep (Codex needs them). |
| Gate 5 MCP rules | Fold the Notion section into the Notion tracker/memory package if the MCP is used; otherwise drop. |
| Gate 5 Plain English style | Always install and select. `Terse`: optional. |
| Gate 5 permissions merge | Always general; Salesforce lists when Salesforce. |
| Gate 5 protocol-guard | Drop (see section 15). |
| Gate 6 session-skills / work method | Replaced by V2's ported session skills and orchestration skills (plugins, not copied). |
| machine-sync | No-AI-credit is a V2 rule. Decide whether V2 ships a machine setup skill or a user-scope plugin hook. Open question. |
| project-sync | Not in the V2 finish items. Open question. |
| work-item-lifecycle | Merge its principle into the V2 work-item skills. |

### 13.2 Port list, split

GENERAL (every V2 project):
`parallel-agent-sessions.md`, `knowledge-direct-commit.md` (model version),
`offer-context-handoff.md` (model version, adjusted per memory choice),
`plain-english-artifacts.md`, `humanize-outbound-text.md`,
`work-item-stages.md` (update wording for V2 work skills),
`ai-external-knowledge.md` (model version); conditional
`work-item-folders.md` (local tracker only, rewrite); conditional graphify
`dependency-graph.md` (non-Salesforce, only if graphify is offered);
`plain-english.md` style; general permissions lists; toolkit manual + session
hook (V2 versions).

SALESFORCE-ONLY:
all 10 Salesforce rules (use the model versions of
`delivery-and-knowledge-boundary.md`, `dependency-graph.md`,
`production-data.md`); `sf-component-tracker`, `sf-deploy-check`,
`sf-data-change` (model version) to both `.claude/skills/` and
`.agents/skills/`; `permsets.py` + runbook + both permission guides;
`tools/kb/` + freshness Stop hook; `guard-protected-orgs.js` +
`protected-orgs.json` (model uses `action: deny`);
`guard-permission-set-deploy.js`; Salesforce permissions lists;
`sf-architect-solutioning` plugin.

Memory-dependent wording: `offer-context-handoff.md`, SF
`dependency-graph.md`, `delivery-and-knowledge-boundary.md`, and
`knowledge-direct-commit.md` name `.memory/` in the model. For Hindsight or
Notion memory, init must write a variant naming that memory route instead.

---

## 14. hooks-library: each hook and its V2 fit

Plugin files: `hooks/` (5 scripts), `templates/protected-orgs.json`,
`salesforce-prod-guard-hook.md` (160 lines), `salesforce-permset-guard-hook.md`
(140 lines), `skills/hooks-library/SKILL.md` (installs/removes/verifies
`spec-check-reminder`; the SF guards follow their guides), `tests/` (3 files).
Scripts are copied into the project's `.claude/hooks/` (never pointed at the
plugin path: "plugin paths move when the marketplace updates").

| Hook | Event / matcher | Language | What it does | Blocks? | Config | Tests | V2 fit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `guard-protected-orgs.js` | `PreToolUse`, `Bash\|PowerShell` | Node CommonJS (`require`) | On a guarded `sf`/`sfdx` verb (deploy, deploy validate, data create/update/upsert/import/delete, `apex run`, `project delete source`, `org delete`), classifies the target org via `sf org list --json --skip-connection-status` (local auth store, no network) and returns `permissionDecision` `ask` or `deny` for production/unknown, `ask` for sandbox except silent `deploy validate`. Fast path: no subprocess for non-`sf` commands. Heavy-path errors ask; early errors allow. | ask/deny | `.claude/protected-orgs.json` (read relative to the script: `path.join(__dirname, '..', 'protected-orgs.json')`): `action`, `unknownOrgAction`, `sandboxAction`, `confirmOrgDeleteAlways`, `alwaysProtect`, `neverProtect` | `guard-protected-orgs.test.mjs`, 37 checks, fake `sf` on PATH | Keep for Salesforce. Model sets `action: deny`. |
| `guard-permission-set-deploy.js` | `PreToolUse`, `Bash\|PowerShell` | Node CommonJS | Denies an `sf project deploy start|quick|resume` / `sf deploy metadata` naming a permission set unless `.claude/.permset-preflight/<Name>.json` shows a clean or accepted preflight in the last 30 minutes. Fails open on its own errors. Needs `tools/permissions/permsets.py`, or every permset deploy is blocked forever. | deny | receipt dir | none in `tests/` | Keep for Salesforce. |
| `no-ai-attribution-guard.mjs` | `PreToolUse`, `Bash`, **machine-wide** (`~/.claude/settings.json`) | Node ESM | Refuses `git commit`, `git tag`, `git merge`, `git notes`, `gh pr create`, `gh pr edit`, `gh release create`, `gh issue create` whose text carries a line-anchored AI `Co-Authored-By` trailer, "Generated with Claude Code", Claude's no-reply email, or the Claude Code link. Human co-authors allowed. Fails open. | deny | optional `no-ai-attribution-guard.json` `{"enabled": true}` next to the script | `no-ai-attribution-guard-harness.mjs`, 43 checks | Keep; matches V2 "no AI credit". Captured plugin docs allow a user-scope plugin to ship this in `hooks/hooks.json` with `${CLAUDE_PLUGIN_ROOT}` instead of copying into `~/.claude/hooks/`. |
| `spec-check-reminder.mjs` | `PostToolUse`, `Edit\|Write\|NotebookEdit` | Node ESM | Once per session (state file in `os.tmpdir()/claude-spec-check-reminder/<session>`), at the first file edit, prints a reminder to run the `spec-check` skill if building from a spec ("a `knowledge/prds/` file or a ticket body"; `prds/` in V1 external mode). Never blocks. | no | reads `.toolkit-memory.json` (V1 schema) | none in `tests/` | Optional. If kept, change the path to `requirements/` and the work item, and the schema. It is active in the claude-toolkit repo itself. |
| `style-handshake.mjs` | `UserPromptSubmit` (exec form: `"command": "node", "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/style-handshake.mjs"]`) | Node ESM | On every user message (not child agents), resolves the selected output style from `.claude/settings.local.json`, `.claude/settings.json`, then user settings, finds the file-backed style, and adds context: read the whole style file with the Read tool silently, check the reply, do not mention it, start with the answer. Silent when no file-backed style. | no | none | `style-handshake.test.mjs` | Optional. Mike chose to keep it in V1 because style adherence weakens in long sessions. Costs one Read per message; Claude only. Open question. |

Retired from hooks-library (do not port): `work-item-stage-reminder` (issue
#270), `explain-simply-reminder` (issue #271), `style-reminder` and
`writing-guard` (August 2026). The README: "Voice is the output style's job.
Do not ship a fourth without the owner asking for it in his own words."

Porting notes:
- The two guards are CommonJS `.js`. In a project whose `package.json` has
  `"type": "module"`, Node would load them as ESM and fail (they fail open, so
  the guard would silently stop). Consider renaming to `.cjs` in V2.
- No hook in hooks-library is registered for Codex. If V2 wants the Salesforce
  guards in Codex, it needs Codex `PreToolUse` support, which the captured
  docs cannot confirm.

---

## 15. protocol-guard: what it enforces and V2 fit

Mechanism: a Claude Code **function hook** plugin. `hooks/hooks.json` =
`{"description": "...", "modules": ["./engine.ts"]}`; `engine.ts` (898 lines,
TypeScript, `import type { Register } from 'claude-code'`, exports
`register(on)`). Loads only with `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` in the
project's `.claude/settings.json` `env` and
`"enabledPlugins": {"protocol-guard@claude-toolkit": true}`. Helper modules:
`shell-reader.mjs` (316 lines, parses program/subcommand/file arguments,
drops heredoc bodies), `memory-config.mjs` (V1 `.toolkit-memory.json`
validator). List of checks is data: `protocols.default.json`, overridable by
`.claude/protocols.json` (`{"off": [...], "protocols": [...]}`). Tests:
`tests/engine.test.ts` (786 lines) + `tests/defaults.fixture.mjs`. Last tested
on Claude Code 2.1.280. Function hooks do not appear anywhere in the captured
Claude Code docs, and the README calls the API "early access and may change in
any release". No Codex support.

Decisions come from facts only (skill opened, file written, command run,
success), never a model call or reading the agent's words. Tool checks fail
closed (refuse); reply holds fail open. A held reply is dropped and the turn
continued once via the classic Stop channel.

| ID | Enforces | Trigger | Failure | Applies when | V2 fit |
| --- | --- | --- | --- | --- | --- |
| K4 | Knowledge files change only with `knowledge-save` open | writes to `knowledge/memory-inbox.md`, `knowledge/memory/`, `knowledge/prds/`, `knowledge/memory-self-improvement.md` | refuse | `knowledge/knowledge-manual.md` exists, files mode | V1 layout only. Idea reusable: refuse writes to `.memory/` unless the curator path is used. |
| CW | Working memory follows work-item changes | turn end after `gh issue` create/close, stage-label edit, `gh project item-edit`, GitHub issue tools, `work` command | hold reply once until `knowledge/memory/current.md` written | same | V1 path; idea maps to `.memory/CURRENT_FOCUS.md`. |
| K5 | Generated indexes not hand-edited | writes to `knowledge/memory/memory-index.md`, `knowledge/prds/prd-index.md`, `ai-external-knowledge/README.md` | refuse | same | Idea maps to `.memory/MEMORY.md` (rebuilt by `scripts/memory.py reindex`) and `ai-external-knowledge/INDEX.md` if generated. |
| K6 | Index rebuild + checker after a knowledge write | turn end after a K4 write | hold once until `build-knowledge-index.mjs` then `check-knowledge.mjs` exit 0 | same | V1 scripts; maps to `scripts/memory.py doctor`. |
| K7 | Save review before PR, close, merge | `gh pr create`, `gh issue close`, `gh pr merge`, `work finish`, GitHub MCP equivalents | refuse until `knowledge-save` opened this turn | files or external mode | V1 skill name. |
| P2 | Closing a work item goes through the `work` skill | `gh issue close`, `work finish`, `issue_write` state closed | refuse until `work` opened this turn | always | Generic idea, reusable in V2 work-item hooks. |
| P3 | Merge goes through `merge-and-clean-up` | `gh pr merge`, `merge_pull_request`, `enable_pr_auto_merge` | refuse until opened this session | always | Generic; depends on the git-workflows plugin. |
| K4X, CWX, K5X, K6X | External-mode (mem0/Hindsight via MCP) versions: memory-service write tools classed `memory-write` (mem0 `add_memory`, `update_memory`, `delete_memory`, `delete_all_memories`, `delete_entities`; Hindsight `retain`, `sync_retain`, `delete_document`, `clear_memories`, `update_memory`, `invalidate_memory`, `delete_bank`) and `prds/` writes; `toolkit_kind` field (`pending`, `working`) | as above | as above | V1 external mode | V2 Hindsight is local and chosen per project; the tool-class table is useful reference for V2 Hindsight hooks. |

Recommendation: do not port the plugin. Reuse its ideas (fact-based checks,
fail-open reply hold, `shell-reader.mjs` command parsing, the Hindsight tool
classification) inside V2's documented command hooks (`PreToolUse`,
`PostToolUse`, `Stop`, `SessionStart` in `.claude/settings.json` and
`.codex/hooks.json`, or a plugin `hooks/hooks.json`), which also run in Codex.
The model README: "This model does not copy plugin internals or enable V1
protocol checks for V2."

---

## 16. sf-architect-solutioning: port as is

Files (15 content files + manifests + README):

```
sf-architect-solutioning/
├── .claude-plugin/plugin.json      v1.1.1
├── .codex-plugin/plugin.json       v1.1.1, "skills": "./skills/", interface block
├── README.md
└── skills/sf-architect-solutioning/
    ├── SKILL.md                                    185 lines
    └── references/
        ├── architectural-patterns.md               269
        ├── doc-sources.md                          122
        ├── naming-conventions.md                   226
        ├── salesforce-well-architected.md          282
        ├── solution-plan-template.md               171 (sections 1-14)
        ├── solutioning-checklist.md                 53
        └── metadata/
            ├── approval-processes.md               252
            ├── custom-metadata-types.md            334
            ├── flows.md                            532
            ├── objects-fields.md                   568
            ├── page-layouts-record-types.md        224
            ├── permission-sets.md                  222
            ├── platform-events-other.md            201
            └── validation-rules.md                 179
```

Skill description (frontmatter): "Triggers when the user provides requirements
to architect and solution for Salesforce. Acts as a certified Salesforce
Technical Architect. Pushes back on vague requirements, clarifies, interviews
for more info, verifies platform facts against official Salesforce
documentation, and builds a solution plan before any code. Use when user says
"architect this", "solution this requirement", "design this feature", feeds
requirements, or asks how to build something in Salesforce. Do NOT use for
implementation or building; hand off to the project's available implementation
workflow. Do NOT use for non-Salesforce work."

Protocol: 5 phases (Intake, Project context, Verify, Design, Plan) with gates.
Core line: "No code without a plan. No plan without clear requirements. No
platform claim without a source."

Paths and dependencies it assumes (none absolute; all references are
relative `references/...` inside the skill folder):

- Reads the project's `AGENTS.md` (or `CLAUDE.md` in old layout) and
  `.claude/rules/` to find where requirements, decisions, designs, and
  work items live. If none are declared, asks the user. Never invents folders.
- Reads an optional `## Client Metadata Conventions` section in `AGENTS.md`
  (overrides Well-Architected defaults).
- Falls back to `sfdx-project.json` `sourceApiVersion` when docs are
  unreachable. (The model's `sfdx-project.json` has no `sourceApiVersion`.)
- Tools: `WebFetch` for developer.salesforce.com and architect.salesforce.com;
  the Playwright MCP browser (`browser_navigate`, `browser_snapshot`) for
  help.salesforce.com and release notes. Atlas guides are traversed via
  `https://developer.salesforce.com/docs/get_document/atlas.en-us.<guide-id>.meta`.
- Other skills: `solution-design` (session-skills) coordinates when present;
  `sf-develop` used "only if it is actually installed" (not in the toolkit).
- Template section 14 "Where This Gets Recorded" lists decision log, work
  item, component tracker, deployment checklist, discovered per project.

Port: copy the folder unchanged, add it to both V2 marketplaces. Optional
small edits (not required): drop the "(or CLAUDE.md ...)" phrases; change the
final template line "hand off to sf-develop" to "hand off to the project's
implementation workflow"; mention that the V2 design home is the work item's
`DESIGN.md` / Notion Solution Design subpage so Phase 2 finds it faster.

---

## 17. Open questions

1. System Guide, graphify, the permission set kit, and the Salesforce
   dependency graph are optional in V1 but are not among V2's three init
   questions. Install them always (model has the Salesforce kits and a
   `docs/system-guide/` template), ask sub-questions, or drop?
2. Does V2 keep a `project-sync` (audit an existing project) and a
   `machine-sync` (no-AI-credit rule, `attribution` settings, guard hook), or
   does the V2 plugin ship the attribution guard as a user-scope plugin hook?
3. Keep `style-handshake` (per-message style re-read, Claude only) and
   `spec-check-reminder`? Both depend on V1 names or on session-skills.
4. Is `terse.md` ported as an optional style? GOAL names only Plain English.
5. `SOUL.md`: seed template (model) or an init question (V1)?
6. Which Claude Code version floor does V2 require? AGENTS.md-only needs
   2.1.277+ and fails in Bedrock/telemetry-off/first-session cases. Should the
   V2 SessionStart hook warn?
7. Codex parity: the captured Codex docs cover only AGENTS.md. Before V2
   relies on `.codex/hooks.json` fields, Codex `PreToolUse`/`Stop` events, and
   `.agents/skills/`, capture the Codex hooks, skills, and plugin pages.
8. The production guard default: V1 `ask`, model `deny`. Confirm `deny` as the
   V2 default.
9. `work-item-folders.md` protects V1 `work` CLI files (`ITEM.yaml`,
   `ACTIVE.json`, `DASHBOARD.md`). What does the V2 local tracker keep, so the
   rule can be rewritten?
10. Memory-dependent rule wording (`offer-context-handoff.md`, SF
    `dependency-graph.md`, `delivery-and-knowledge-boundary.md`,
    `knowledge-direct-commit.md`) must vary by memory choice (built-in,
    Hindsight, Notion). One file with three variants, or one neutral wording
    that points to a memory skill?
11. Should the Salesforce guard scripts be renamed `.cjs` to survive a
    `"type": "module"` project `package.json`?

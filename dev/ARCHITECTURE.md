# Toolkit V2 architecture (revision 3)

The build plan. `dev/GOAL.md` holds Mike's decisions and wins over this file.
`dev/SKILL-INDEX.md` holds the skills and agents. Evidence: `dev/research/`.
Revision 2 folds in `research/critique-architecture.md` (B1-B4, I1-I20,
M1-M19) and `research/critique-platform.md` (P1-P23). Section 13 lists the calls
Claude made on Mike's behalf.

## 0. Revision 3: the model is the source of formats (overrides the rest)

Mike decided on 2026-09-26 evening (GOAL.md): the model project is the exact
source for the folder structure and every file template, instruction, rule,
`AGENTS.md`, `CLAUDE.md`, project hook, and agent a new project gets. The
toolkit supplies what the model does not hold: the plugin skills, the
`toolkit` command, and the plugin hooks, and these work with the model's
formats as they are. For memory, the toolkit's mechanisms are used with the
model's file formats. Where this section and later sections disagree, this
section wins.

- **Scaffold = a copy of the model.** `node dev/tools/import-model.mjs`
  copies the model's working tree into `plugins/toolkit/scaffold/model/`
  exactly (leaving out `.git`, every `.sfdx/`, `.vscode/`, and `__pycache__/`
  folder and `.DS_Store` file, the `exclude` patterns in
  `scaffold/CONDITIONS.json`, and every file the model's Git ignores and does
  not track), records the model's branch, commit, and whether it had
  uncommitted edits in `scaffold/model/.import.json`, and stops without
  copying when a rule in `CONDITIONS.json` no longer matches the model.
  `--check` compares the copy with the model. Re-run it whenever Mike changes
  the model. Until he merges `toolkit-v2/approved-changes`, it reads the
  approved worktree (`dev/model-changes.md`).
- **`scaffold/CONDITIONS.json`** is the only hand-kept file beside the copy:
  which paths install only for `tracker:local` (`.work-items/**`,
  `work-item-folders.md`), `memory:builtin` (`.memory/**`), `salesforce`, and
  each host; the generated files installed only when missing
  (`.memory/MEMORY.md`, `ai-external-knowledge/INDEX.md`); where init fills
  the project name (heading lines of `AGENTS.md`, `README.md`, `PROJECT.md`);
  and the Salesforce hooks, permission entries, and `.gitignore` lines a
  project without Salesforce leaves out. Everything else is copied byte for
  byte. The memory mechanism files are gone from the model itself (approved
  items 13 to 15), so nothing needs leaving out for them.
  `plugins/toolkit/templates/TEMPLATE-LANGUAGE.md` holds the full install
  rules.
- **Parity test.** `plugins/toolkit/tests/scaffold/parity.test.mjs` runs
  `toolkit init` for all 24 combinations and compares the result with the
  model: every difference must be explained by `CONDITIONS.json` or by files
  the toolkit adds (`.toolkit.json`, `.codex/config.toml`,
  `.codex/rules/toolkit.rules`, generated state and dashboard files).
- **Runtime reads the model's formats.** Work items use the model's
  `WORK-ITEM.md` and `DESIGN.md` frontmatter and sections as they are
  (section 4.2; approved items 9 to 12). New items and designs are made from
  the model's templates. Memory uses the model's topic template YAML (`name`,
  `description`, `metadata.type`, `status`, `source`, `last_verified`,
  `authorization`, `supersedes`, and any extra fields kept), the four-section
  `CURRENT_FOCUS.md` (approved item 13), the model's `MEMORY.md` index
  layout, the glossary, and memory criteria. A retired record is stored as
  `superseded` (replaced by another record) or `archived` (moved to
  `.memory/archive/`). Built-in memory keeps Obsidian-style relative Markdown
  links between notes and repairs them when a note is renamed, merged,
  superseded, archived, or deleted. Templates are read from the model copy
  in `scaffold/model/` through `lib/core/templates.mjs`, never from a second
  copy.
- **Approved changes are in the model.** The 23 changes Mike approved
  (GOAL.md) are applied on the model's branch `toolkit-v2/approved-changes`
  (`dev/model-changes.md`), and the copy is made from that branch. Other
  review ideas are items in the `dev/model-review.md` checklist. Nothing
  reaches projects until Mike approves it and it is in the model.

## 1. What Toolkit V2 is

Claude Code and Codex plugins that turn a project folder into an operating
system for one solo developer. The agent runs the project; Mike decides and
steers. Three layers:

1. **Scaffold**: folders and templates every project starts with (the reviewed
   model project), installed by `project-setup`.
2. **Orchestration**: 26 skills (22 outside Salesforce), one per job
   (`dev/SKILL-INDEX.md`). Skills hold judgment.
3. **Runtime**: one dependency-free Node command, `toolkit`, plus hooks. They
   hold what must happen the same way every time.

## 2. Repository layout

```text
toolkit-v2/
  AGENTS.md                         how to work on toolkit-v2 itself
  README.md                         for Mike: what it is, how to install and use
  .claude-plugin/marketplace.json   marketplace "toolkit-v2" (Claude Code)
  .agents/plugins/marketplace.json  marketplace "toolkit-v2" (Codex)
  plugins/
    toolkit/        runtime + project setup
      .claude-plugin/plugin.json, .codex-plugin/plugin.json
      bin/toolkit                   CommonJS shim: #!/usr/bin/env node, import('../lib/cli.mjs'); executable bit in Git
      lib/cli.mjs                   command dispatcher
      lib/core/                     config, paths, lock, fsx (atomic write), frontmatter, markdown, output, util
      lib/work/                     model (parse/serialize WORK-ITEM.md + DESIGN.md), lifecycle, local driver, state, dashboard, decisions
      lib/memory/                   contract, builtin driver, hindsight driver
      lib/notion/                   ntn client, markdown converter, ensure-root/ensure-project, tracker driver, memory driver
      lib/project/                  init, sync, doctor, brief, machine-setup, export, index
      lib/hooks/                    session-start, user-prompt, pre-tool, post-tool, stop; host adapters (claude, codex)
      hooks/hooks.json              Claude Code, exec form
      hooks/codex-hooks.json        Codex, shell strings; named by "hooks" in .codex-plugin/plugin.json
      templates/                    only what the model does not hold: toolkit settings entries, codex fragments, .gitignore lines, hindsight plist, TEMPLATE-LANGUAGE.md
      scaffold/model/               exact copy of the model project (dev/tools/import-model.mjs); never edited by hand
      scaffold/CONDITIONS.json      install conditions for the copy (section 0)
      skills/project-setup/
      tests/                        node:test suites + fixtures (recorded Claude and Codex hook inputs, Notion responses)
    work/           9 work skills, 6 agents, references/ (conventions, trackers, helpers, team-roles)
    memory/         3 memory skills
    session-skills/ 5 skills + handoff-verifier agent (ported)
    git-workflows/  4 skills (ported, V1 paths removed)
    sf-architect-solutioning/  ported, body unchanged
  dev/              goal, progress, architecture, skill index, research, test runs (not shipped)
```

Every plugin has `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`
with the same name and version; Codex marketplace entries carry
`policy.installation`, `policy.authentication`, `category`; the Codex manifest
has `"skills": "./skills/"` and an interface block (P17).

**Plugin enablement (B3, P14).** V2 plugins keep their names; their ids differ
by marketplace (`session-skills@toolkit-v2` vs `@claude-toolkit`). They are
turned on per project, never for the whole machine: init writes
`enabledPlugins` in `.claude/settings.json` (every `*@toolkit-v2` plugin the
project needs `true`, every `*@claude-toolkit` plugin `false`,
`sf-architect-solutioning@toolkit-v2` only for Salesforce) and the matching
`[plugins."<name>@toolkit-v2"] enabled = true` / `@claude-toolkit` `false`
entries in `.codex/config.toml`. `toolkit doctor` checks both.

**Reaching the CLI.**
- Hooks never rely on PATH (P1). Claude: `"command": "node", "args":
  ["${CLAUDE_PLUGIN_ROOT}/bin/toolkit", "hook", "<event>", "--host", "claude"]`.
  Codex: `node "$PLUGIN_ROOT/bin/toolkit" hook <event> --host codex`.
- Skills call `toolkit ...`. Claude Code puts the plugin's `bin/` on the Bash
  PATH. For Codex, `toolkit machine-setup` writes a small wrapper script (not a
  symlink) at `~/.local/bin/toolkit` that runs `node "<root>/bin/toolkit"`,
  reading `<root>` from `~/.config/toolkit-v2/plugin-root`; every SessionStart
  hook refreshes that pointer from `CLAUDE_PLUGIN_ROOT` / `PLUGIN_ROOT` (P2, I6).
  The wrapper falls back to the toolkit-v2 source folder when the pointer is
  missing. `doctor` compares the Claude and Codex copies' versions.
- The state file carries a schema number; an older CLI refuses to write a newer
  state (I6).

## 3. Project configuration: `.toolkit.json` (committed)

```json
{
  "toolkit": "toolkit-v2",
  "schema": 1,
  "project": { "name": "Acme CRM", "key": "acme-crm", "owner": "Mike" },
  "tracker": { "type": "local", "idPrefix": "WI" },
  "memory": { "type": "builtin", "approval": "onboarding" },
  "salesforce": { "enabled": false },
  "hosts": ["claude-code", "codex"],
  "notion": {},
  "hindsight": {},
  "installed": {}
}
```

- `tracker.type`: `local | notion | github | jira`. For `github` and `jira`,
  `toolkit work` commands print the path to the written instructions and exit 3;
  work-item hooks do nothing (M18).
- `memory.type`: `builtin | hindsight | notion`; `memory.approval`:
  `onboarding | trusted`. Changing it is a one-file direct edit through
  `toolkit config set` (M15).
- `notion`: page, database, data-source, view, and property ids from
  `toolkit notion ensure-project`.
- `hindsight`: `{ "url": "http://127.0.0.1:8888", "bank": "<key>" }`, chosen once.
- `salesforce`: `{ "enabled": true, "orgs": { "sandbox": "<alias>", "production": "<alias>" } }`.
- `installed`: path -> sha256 of every scaffold file as installed, so
  `toolkit sync` never overwrites a file Mike changed (M4). A file with no
  entry that is byte for byte the toolkit's version (left by a run that
  stopped before `.toolkit.json` was written) is recorded on the next init or
  sync, not treated as Mike's.
- `declined` (only when set): optional scaffold files the owner turned down,
  today only `SOUL.md`. Init leaves them out (`--decline SOUL.md`), sync never
  adds them back, and doctor does not report them missing. Changed with
  `toolkit config set declined SOUL.md` (or `none`).
- The key `"toolkit": "toolkit-v2"` marks a V2 project. Every V2 hook exits
  silently with no output when `.toolkit.json` is missing or lacks that key.
- The project root is found from the hook's stdin `cwd` (or the process cwd)
  with `git rev-parse --show-toplevel`; Git-ignored data (tracker, memory) is
  found in the main checkout through `git rev-parse --git-common-dir` (P20).
- `init` writes `.toolkit.json` last, after every step succeeded; every step is
  safe to run again (M9). It writes the files in `.codex/` and `.agents/`
  first, because the Codex sandbox refuses them: inside Codex, init stops
  before any other file is written and prints the exact command for the owner
  to run in a terminal. `toolkit config set` of a setup key saves the new value
  only after its sync worked.

## 4. Work items

### 4.1 One model, every tracker

Unchanged process (research/work-process.md 3-8): stages `01-discovery` ...
`14-spec-update`; statuses `Backlog, Ready, In Progress, In Review, Done,
Cancelled`; status derived from stage (01-02 Backlog, 03 Ready, 04-11 In
Progress, 12-14 In Review); stages may be skipped, repeated, revisited; Done and
Cancelled only by an intentional finish or cancel with the owner's approval;
`build` and `data-load` cannot pass stage 03 without recorded requirements
approval; design approval; result approval at stage 11; the delivery offer and
team questions with their exact wording (`work-delegate`).

`toolkit work lifecycle` prints the stage table with a plain label and the skill
that continues each stage, the statuses, the types, and the approval gates.
No skill repeats it.

### 4.2 `WORK-ITEM.md` frontmatter

```yaml
id: WI-001
title: <Work item title>
type: <discovery | solution-design | build | data-load | repository-maintenance | research | task | bug | enhancement>
stage: <01-discovery ... 14-spec-update>
status: <Backlog | Ready | In Progress | In Review | Done | Cancelled>
parent: <WI-id | none>
waiting_on: "<owner | agent | external: who | none>"
priority: <urgent | high | medium | low>
delivery: <agent-led | owner-led | not-offered>
requirements_approved: <YYYY-MM-DD by <name> | no>
design: <proposed | approved | superseded | none>
result_approved: <YYYY-MM-DD by <name> | no>
updated: <YYYY-MM-DD>
```

- Blocking is `waiting_on` plus the Overview Blockers line, never a status.
- `requirements_approved` replaces `requirements_status`; the body keeps
  `**Overall status:**`, kept in step by commands.
- `active_phase` is dropped (the Roadmap Status column shows it; `P1` clashed
  with the project roadmap's `P01`). Item phases stay `P1`, `P1-T01`.
- Body: "Related items" and Roadmap use IDs, never paths; Open Questions
  "Decision needed from" uses `owner` for Mike; the Roadmap table gains a
  "Sub-items" column.
- `waiting_on` is always written in double quotes, because the colon in
  `external: who` stops standard YAML readers.
- `DESIGN.md` gains frontmatter `work_item`, `status`, `approved` (written
  `"no"` in quotes), and says `**Requirements:** WI-001`.
- The model's `.work-items/work-item-template/` is the exact source of both
  files; this block copies its frontmatter.

**Owner edits win (I1).** Derived values (status from stage, parent from
location, H1 from title, Overall status from `requirements_approved`) are
written only by `toolkit work` commands and the SessionStart sync. The state
file keeps the last value it wrote. When a record's value differs from that, the
owner changed it: the CLI keeps it, records a Recent History row "Changed by
hand: ...", and reports it. A hand change that skips a gate (a build item moved
past 03 without approval, Done without `result_approved`) is kept and reported
as a question for the owner, never reverted.

### 4.3 Local tracker (`.work-items/`, Git-ignored, main checkout)

- An item is a folder holding a record `WORK-ITEM.md` (and `DESIGN.md` when a
  design exists). Default folder name `WI-001-<slug>`.
- **Identity is the frontmatter `id`.** Any `*.md` with frontmatter `id`
  matching `<prefix>-<n>` and no `work_item` key is a record. Renaming the
  folder or the file keeps the item. `DESIGN.md` is found by its `work_item`
  key.
- **Skipped:** `work-item-template/`, any folder whose name starts with `_` or
  `.`, and any record whose title is still `<Work item title>` (B2).
- **Duplicates:** when two records share an id, the one at the path the state
  file already knows keeps it; the newcomer gets the next free id, and both are
  reported. Ids are never reused: next id = max(state high-water, scan) + 1 (B1).
- **Nesting = parent.** A record inside another item's folder is its sub-item;
  `parent` follows location. Plain folders (no record) are groups and do not
  change parents. A sub-item cannot also sit in a group (M2). `archive/` is a
  reserved group: items there are hidden from the briefing and `work next`.
- **State:** `.work-items/.toolkit-state.json` holds schema, the id-to-path map,
  the high-water id, and last-written derived values. It is state, not
  generated; `toolkit export` includes it (M3). Paths are relative (I18).
- **Moves:** every `toolkit work` command and the UserPromptSubmit hook do a
  cheap rescan (mtime check, then full scan when changed) and report moves,
  renames, missing items, and duplicates (I3). Skills locate files only with
  `toolkit work show <id> --path`.
- **Dashboard:** `.work-items/DASHBOARD.md` regenerated after every change:
  waiting on the owner, in progress, ready, backlog, recently done, tree.
- **Lock (B1):** one lock file `.work-items/.lock` (and `.memory/.lock`) with
  pid + time; a lock older than 30 s whose pid is gone is taken over. Every
  write is temp file + rename. Tested with 5 concurrent `work new` processes.
- **Templates:** `.work-items/work-item-template/` is the project's copy; the
  CLI prefers it, else the plugin's `templates/`.
- **Worktrees (I4):** a branch named `wi-007-<slug>` (or containing `WI-007`)
  ties the worktree to that item; the briefing says so.

### 4.4 Notion tracker

Built by `toolkit notion ensure-project` with `ntn api` (research/notion-design.md):
each project row in the Projects database gets its own Work Items database
(Stage select with the 14 stages; Status with the six statuses; ID unique_id
with the project's prefix; Type; Priority; Waiting on; Delivery; Requirements
approved; Design; Result approved; Next action; Open owner questions (number);
Parent item / Sub-items self-relation; Blocked by / Blocking), a board view
grouped by Stage, a table view with sub-items nested, and its own Memory
database. Body = `WORK-ITEM.md` body; design = a "Solution Design" child page
from `DESIGN.md`, created by `toolkit work design --create`.

- Markdown both ways (I10): write converts pipe tables to `<table>`, escapes
  `<placeholders>`, and turns hard breaks into `<br>`; read converts Notion's
  Markdown back into the shared model. Edits use `PATCH .../markdown`
  `update_content` built from a fresh read, so Mike's concurrent edits are kept.
  Tests T5-T7 and T9 in notion-design.md run before the driver depends on them.
- Owner actions in Notion (I11): a card made with the New button (no ID body)
  is adopted on the next read (template body written, reported); re-parenting
  and trashing are read as owner edits (4.2). The API cannot create a database
  template, so the New button does not fill the template by itself; the agent
  fills it. Stage drags recompute Status on the next read.
- Writes outside the AI Agent Second Brain root page are refused.
- Unit tests use recorded responses; live tests use a "Toolkit V2 test"
  project row.

### 4.5 GitHub Issues and Jira

Written instructions in `plugins/work/references/trackers/`: issue body =
`WORK-ITEM.md` body, frontmatter = labels or native fields, sub-items =
sub-issues or sub-tasks, design = a comment titled "Solution design". No driver.

### 4.6 Project-wide decisions

`DECISIONS.md` at the project root, append-only table (ID, date, decision, why,
decided by, replaces). `toolkit decision add` assigns the next id under the
lock. Work-item decisions stay in the item.

## 5. The `toolkit` command

Node 20+, no dependencies. `--json` for machine output. Exit codes: 0 ok, 1
error, 2 validation failure, 3 not supported for this tracker/backend, 4 not a
toolkit project. Every write is read back; a failed read-back prints "saved but
not verified" and exits 1.

```text
toolkit version | help [command]
toolkit init --name <n> [--key <k>] --tracker <local|notion|github|jira> --memory <builtin|hindsight|notion> [--salesforce] [--owner <name>] [--dir <path>] [--hosts claude-code,codex] [--decline SOUL.md]
toolkit sync [--dry-run]                      add missing scaffold files; never overwrite a file whose hash changed
toolkit doctor [--json]                       every problem with its fix
toolkit brief [--host claude|codex]           the session briefing
toolkit machine-setup [--offline]             wrapper script, plugin-root pointer, checks for node, git, ntn, ollama, hindsight
toolkit config get [<key>] | set <key> <value>
toolkit export --to <dir> | import --from <dir> [--dry-run] [--replace]    .work-items/ and .memory/ backup (I17)
toolkit index knowledge [--check]             regenerate ai-external-knowledge/INDEX.md (I16)
toolkit decision add --decision <t> --why <t> --by <name> [--replaces D-n]

toolkit work lifecycle
toolkit work new --title <t> [--type <t>] [--parent <id> [--covers R-02,R-03]] [--stage <s>] [--priority <p>]
toolkit work list [--status <s>] [--waiting-on <w>] [--tree] [--all]
toolkit work show <id> [--section <heading>] [--path] [--json]
toolkit work edit <id> --section <heading> --set-file <f> | --text <t> | --append-row <text> | --label <name> --value <t> | --remove-guide
toolkit work set <id> [--stage] [--waiting-on] [--priority] [--type] [--delivery] [--title] [--note <why>]
toolkit work approve <id> --requirements|--design|--result --by <name>
toolkit work design <id> [--create] [--set-file <f> | --text <t>] [--status proposed|approved|superseded]
toolkit work history <id> --note <text> [--effect <text>]
toolkit work move <id> --under <id|group|archive|root>
toolkit work finish <id> --by <name> --evidence <text> [--quote <owner's words>] [--allow-open-sub-items]
toolkit work cancel <id> --reason <text>
toolkit work next
toolkit work decisions                        everything waiting on the owner
toolkit work sync                             rescan, adopt, renumber duplicates, derive values, dashboard, report moves
toolkit work validate [<id|file>]

toolkit memory save --type <t> --name <slug> --description <d> (--body <t> | --body-file <f>) [--source <text>] [--approved-by <who>] [--authorization <text>] [--supersedes <key>] [--status <s>] [--last-verified <YYYY-MM-DD|unknown>] [--expect <version|absent>]
toolkit memory find <query> [--reflect]
toolkit memory get <key> | list [--type] [--status]
toolkit memory retire <key> [--superseded-by <key>] | restore <key>
toolkit memory rename <key> --to <new-key>      new key (and type); links and supersedes entries in other notes follow
toolkit memory delete <key> --owner-approved
toolkit memory focus [--set-file <f> | --text <t>] [--expect <version>]
toolkit memory glossary [--set-file <f> | --text <t>] [--expect <version>]
toolkit memory export --to <dir> | import --from <dir> [--dry-run]
toolkit memory reindex
toolkit memory status                         last save time, counts, backend health

toolkit notion ensure-root | ensure-project [--project-name <n>]
toolkit hindsight ensure-bank | health | service install|status|start|stop

toolkit hook <session-start|user-prompt|pre-tool|post-tool|stop> --host <claude|codex>
```

## 6. Hooks

Entry: `toolkit hook <event> --host <claude|codex>`. Each reads JSON from stdin,
finds the project, and exits 0 with no output when it is not a V2 project. Every
hook has an explicit timeout (P19). Codex: regex matchers (`^Bash$`,
`^apply_patch$`), JSON-or-nothing on Stop, never `ask`/`continue`/`stopReason`/
`suppressOutput` from PreToolUse, `additionalContextLimit: 4000` (P5-P9). Tests
use recorded real inputs from both hosts.

| Event | Matcher | Does |
| --- | --- | --- |
| SessionStart | `startup\|resume\|clear\|compact\|fork` | Refreshes the plugin-root pointer; runs `work sync` (local); prints the briefing as `additionalContext`, about 6,000 characters max: this worktree's item, active items with their next skill, waiting on the owner, current focus, moves detected, setup warnings, a plain statement that `AGENTS.md` is the project manual. Codex adds the always-on rules list and the voice section. Notion and Hindsight read a Git-ignored cache (refreshed on every write) with 2-second timeouts and fail open (I9). The Notion check only reads the row properties to report the owner's moves; it writes nothing, and the next `toolkit work` command records the history rows (sample run c, round 2). |
| UserPromptSubmit | none | Records the turn in session state; cheap tracker rescan (reports moves); when the prompt contains an explicit keep phrase ("remember that/this", "from now on", "don't ever", "note that", "going forward", "keep in mind"; never "do you remember", "never mind", "always fails"), adds one factual line: "The owner stated something to keep; memory-save records it, or work-on if it is a task." (I14) |
| PreToolUse | Claude `Write\|Edit\|MultiEdit\|Bash`; Codex `^apply_patch$\|^Bash$` | Denies hand edits of generated files (`DASHBOARD.md`, `.toolkit-state.json`, `.memory/MEMORY.md`, `ai-external-knowledge/INDEX.md`) with the command to use; denies `git clean` with `-x`/`-X` in the main checkout (I17); denies `git add -A`, `git add .`, `git commit -a`, force pushes (the model's settings deny list, now in both hosts, P11). Codex only: adds a note (additionalContext, never a refusal) when a `toolkit` command is joined to other commands, sits in a heredoc, or runs from a script or loop, because it then runs inside the sandbox (sample runs, round 2). Salesforce projects: the protected-org and permission-set guards run here too, with every `ask` turned into `deny` in Codex (I8). |
| PostToolUse | Claude `Write\|Edit\|MultiEdit\|Bash`; Codex `^apply_patch$\|^Bash$` | Records `toolkit memory save` / work-item edits in session state. After a work-item record changes: validates only (never rewrites the file, I2) and returns `additionalContext` with any error or gate question; `decision: block` only for a gate violation. After a `.memory/` topic change: reindex under the lock. |
| Stop | none | Guarded by `stop_hook_active`. Blocks at most once per turn when this turn had a keep phrase and no memory save was recorded, or a work-item record changed this turn and fails validation. Reason text never contains the keep phrases (P8). Otherwise silent. |

Session state: `$CLAUDE_PLUGIN_DATA` or `$PLUGIN_DATA`, else
`<git-common-dir>/toolkit-v2/sessions/<session_id>.json` (B4).

## 7. Memory

- **Records:** the model's topic template (`.memory/project_topic_template.md`):
  frontmatter `name` (the file name without `.md`), `description` (one line),
  `metadata.type` (`user | feedback | project | reference | event`), `status`
  (`current | needs-review | superseded | archived`; the CLI calls the last
  two "retired"), `source`, `last_verified`, `authorization`, `supersedes`,
  and any extra keys kept. Key = `<type>_<slug>` (M1). Older toolkit records
  are still read; `toolkit memory reindex` rewrites them in the model format.
- **Current focus:** four sections: Now (work item IDs), Waiting on the owner
  (things with no work item), Untracked to-dos, Next session starts with. Under
  50 lines; never repeats the tracker.
- **Glossary:** `toolkit memory glossary`, one document per backend.
- **Built-in:** `.memory/` in the main checkout, Git-ignored, found from any
  worktree; `MEMORY.md` index generated; `.memory/AGENTS.md` says edit only
  through the CLI.
- **Hindsight:** the LaunchAgent `local.toolkit-v2.hindsight` (installed,
  127.0.0.1:8888, Ollama `gpt-oss:20b`, `HF_HUB_OFFLINE=1`); one bank per
  project; records retained with `chunks` extraction, document id = key, tags
  `type:<t>`, `status:<s>`; focus and glossary are documents; `find` uses recall
  with `tag_groups` excluding retired; `find --reflect` uses gpt-oss for a
  synthesized answer. No MCP registration: the CLI is the only writer (I12).
- **Notion:** the project's Memory database; focus and glossary are child pages
  of the project page.
- **Approval** (written once, in `memory-save`): `onboarding` (default) shows a
  one-line card and saves after a yes; an explicit owner instruction is itself
  the approval and is saved at once with a one-line notice; `trusted` saves
  routine facts the agent is sure of and reports them; people, personal
  details, deletes, and bulk changes always ask.
- **Writer:** the main agent through the CLI. No curator subagent.
- **Limit (M19):** Git-ignored tracker and built-in memory live on one computer;
  `toolkit export` is the backup; doctor warns when the last export is older
  than 7 days.

## 8. Skills

`dev/SKILL-INDEX.md` is the source for names, descriptions, steps, and agents.
Rules for every `SKILL.md`: `name` = folder; description under 300 characters,
third person, trigger words first; the steps in the first 40 lines; no
`when_to_use`, `!command`, `$ARGUMENTS`, `${CLAUDE_*}` (P21); `toolkit` commands
on their own line; the voice line and the Codex agent fallback from
`plugins/work/references/`. Agents carry their own Plain English rules and
`model: opus`.

## 9. Scaffold and host files

Section 0 overrides this section. The copy of the model in
`scaffold/model/`, installed as `scaffold/CONDITIONS.json` says. Composition
at init:

- Every model file, byte for byte, apart from the conditions in section 0.
- Tracker `local`: `.work-items/work-item-template/`. Memory `builtin`: `.memory/` seeds.
- `AGENTS.md` is the model's: only the blocks between setup markers that
  match the answers; the rules list between `<!-- toolkit:rules:start -->` and
  `<!-- toolkit:rules:end -->` is generated from the rules the project has and
  only that span is regenerated (M10). The model's one root `CLAUDE.md`
  (only `@AGENTS.md`) is installed for Claude Code; `doctor` accepts it and
  warns on a `CLAUDE.md` in a subfolder or one that does not import
  `AGENTS.md` (P10).
- Scoped `AGENTS.md` in `requirements/` (and `.memory/` for built-in memory);
  root `AGENTS.md` tells both hosts to read them before editing there. With
  the root `CLAUDE.md` present, Claude Code does not load them by itself.
- `.claude/rules/`: the general and Salesforce rules; always-on ones also
  listed in `AGENTS.md`.
- `.claude/settings.json`: the model's file, plus the toolkit's entries from
  `templates/settings/claude-toolkit.json`: `enabledPlugins` (section 2),
  `permissions.allow: ["Bash(toolkit *)"]`, `worktree.baseRef: "head"`,
  `autoMemoryEnabled: false`, and `outputStyle` only when the model names
  none. Without Salesforce, the guard and graph hooks and the `sf`/`sfdx`
  permission entries come out (`jsonRemove` in `CONDITIONS.json`).
- `.claude/output-styles/plain-english.md` (project copy, P12).
- `.codex/config.toml`: plugin enablement. `.codex/rules/toolkit.rules`:
  `prefix_rule(pattern=["toolkit"], decision="allow")` so the CLI runs outside
  the sandbox (network for Notion and Hindsight, main-checkout writes) (P3, I7).
  `.codex/hooks.json`: the model's file, which holds the Salesforce guards
  only, so it is not installed without Salesforce.
- Salesforce skills are project-local copies in `.claude/skills/` and
  `.agents/skills/`, both taken from the model (approved item 18: the two
  copies are identical); `doctor` checks they match.

## 10. Testing

- `node --test "plugins/toolkit/tests/**/*.test.mjs"` (Node 22+ refuses a folder argument): parser round trip on the model template,
  lifecycle, gates, owner edits, moves and renames, nesting, duplicates, the
  template folder, 5 concurrent `work new`, dashboard, decisions, every memory
  driver (Hindsight against the running server; Notion with recorded responses
  plus a live "Toolkit V2 test" row), hooks with recorded Claude and Codex
  inputs, init, sync, doctor, export.
- `claude plugin validate .` and on each plugin.
- Skill routing: should-trigger and should-not-trigger prompts from
  SKILL-INDEX section 5 in both hosts.
- Sample runs under `dev/test-runs/<run>/`, each a fresh Git repository:
  (a) local + built-in, (b) Salesforce + local + built-in (fake `sf` on PATH to
  prove guards), (c) Notion + Notion, (d) local + Hindsight (including one
  `find --reflect`). Each takes one item from 01 to Done with a sub-item and a
  folder or card moved by hand, in real `claude -p` and `codex exec` sessions.
- Claude isolation: `claude -p --setting-sources project,local --plugin-dir
  <toolkit-v2>/plugins/<each> --output-format stream-json --verbose`, asserting
  the init event lists only V2 plugins (P4).
- Codex: Mike's own Codex home with the `toolkit-v2` marketplace added and the
  plugins enabled only in test projects' `.codex/config.toml`;
  `codex exec --dangerously-bypass-hook-trust --sandbox workspace-write -C <dir>`
  for automated runs (P5, P22). An isolated `CODEX_HOME` needs Mike's sign-in,
  so it is not used unattended (P16).

## 11. Build order

0. `lib/core`, `bin/toolkit`, dispatcher, tests.
1. In parallel: scaffold + templates + model review; work engine; memory
   engine; Notion layer; work/memory/project skills and agents; ported plugins.
2. Hooks, init, sync, doctor, brief, machine-setup.
3. Manifests and marketplaces; validate.
4. Notion rebuild of the real page; sample runs; fixes; independent reviews; report.

## 12. Known limits

- The Notion New button does not fill the work-item template by itself (API
  limit); the agent fills new cards on its next read.
- In `chunks` mode Hindsight stores records exactly and does not call
  `gpt-oss:20b`; the model is used by `memory find --reflect`.
- Codex needs Mike to trust the V2 hooks once in `/hooks` for everyday use.
- Codex trust is tied to the folder path; moving a project folder turns it off
  until trusted again (doctor reports it, I18).

## 13. Calls Claude made for Mike to review

1. Six statuses; the model's `Blocked` becomes `waiting_on`.
2. Nesting a folder inside an item makes it a sub-item.
3. `active_phase` removed; `requirements_status` -> `requirements_approved`; new
   `parent`, `waiting_on`, `priority`, `delivery`, `design`, `result_approved`, `updated`.
4. Briefing hook in both hosts replaces `CLAUDE.md` imports.
5. `.toolkit.json` replaces `.toolkit-memory.json`.
6. No memory curator subagent; an explicit owner instruction is its own approval.
7. Current focus cut to four sections.
8. `DECISIONS.md` added.
9. `docs/toolkit-manual.md`, `.claude/RULES.md` cut; `AGENTS.md` is the manual.
10. System Guide routes removed.
11. Skill changes in SKILL-INDEX section 8 (grill-me, spec-check,
    requirements-helper, work-guide, track-tasks, project-init/project-sync
    merged or retired; `/grill-me` and similar commands go away).
12. `delivery/` installs only for Salesforce projects.
13. Salesforce kits install with every Salesforce project.
14. `LOAD-RECORD-TEMPLATE.md` and `BACKUP-RECORD-TEMPLATE.md` removed (issue 419 requirement 28).
15. Hindsight `chunks` extraction, no API key on the loopback-only server, no
    MCP connection.
16. Old Notion template and empty knowledge bases moved to an "Old structure"
    page, not deleted.
17. V2 plugins enabled per project; V1 plugins turned off in V2 projects.
18. git-workflows ported (the documentation rules depend on `publish-docs`).
19. The `sf-architect-solutioning` description is left unchanged (GOAL says
    "as is"); `solution-design` calls it as the Salesforce specialist. Changing
    only its description is Mike's call (SKILL-INDEX 9.1).
20. The superpowers plugin and the machine-wide no-AI-credit hook are left as
    Mike has them.

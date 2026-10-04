# Model project review (draft for `dev/archive/model/model-review.md`)

Written 2026-09-26 by a read-only research agent. Nothing in the model project,
`claude-toolkit`, or Notion was changed.

Reviewed:

- Every file in `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`
  (201 files; the `tools/kb/` Python code was skimmed, not audited line by line).
- The model's history note:
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-context/TEMPLATE-SOURCE-REVIEW.md`
  and `.../codex-second-brain-v2-handoff/toolkit-installed-project-file-map.md`.
- Captured Claude Code docs: `memory.md` (section "AGENTS.md", "Import additional
  files", "Path-specific rules", "Auto memory"), `hooks.md` (SessionStart,
  output caps), `sub-agents.md` ("What loads at startup", `background` field),
  `skills.md`, `statusline.md`, all under
  `/Users/michaelrihm/Documents/Projects/claude-toolkit/ai-external-knowledge/claude-code/`.
- Captured Codex docs: `/Users/michaelrihm/Documents/Projects/claude-toolkit/ai-external-knowledge/codex/agents-md.md`
  and that folder's `README.md`.
- Current toolkit sources for comparison: `plugins/project-init/skills/project-init/references/thin-agents-md.md`,
  `plugins/project-init/library/rules/general/README.md`,
  `plugins/work-tracker/skills/work/references/lifecycle.md` and `record-format.md`.

Point of view: Mike is a solo developer. The agent runs the project (tracks
work, keeps memory, files information in the right place, generates what can
be generated). Mike only makes decisions and steers.

Installed versions on this Mac (checked 2026-09-26): Claude Code `2.1.280`,
Codex CLI `0.157.0`. Claude Code reads `AGENTS.md` natively from `2.1.277`.
No `CLAUDE.md`, `CLAUDE.local.md`, or `.claude/CLAUDE.md` exists in
`/Users/michaelrihm/Documents/Projects` or any folder above it (only the
user-level `~/.claude/CLAUDE.md`, which does not block `AGENTS.md`).

---

## 1. Summary of findings

1. **The model has no place for the three things a decide-and-steer owner
   needs most:** a list of what is waiting on his decision, a project-wide
   decision log, and a status view he can glance at. Pending decisions are
   scattered across work-item Open Questions tables, requirement statuses,
   design statuses, and memory proposal cards that exist only in the chat.
2. **Dropping `CLAUDE.md` breaks four files in the model**, not just the
   imports: `scripts/memory.py doctor` reports an ERROR when
   `.memory/CLAUDE.md` is missing (line 321), the session-start hook warns on
   every session unless root `CLAUDE.md` has the exact three imports (lines
   35-37), and the memory test copies `CLAUDE.md` (line 27).
3. **`@path` imports work inside `AGENTS.md` in Claude Code (confirmed), but
   they are the wrong way to load current focus for Toolkit V2.** Codex shows
   an `@path` line as plain text. `.memory/` is Git-ignored, so the import finds
   nothing inside a linked Git worktree, which is where most agent sessions run.
   Imports cannot reach Notion or Hindsight memory. Recommended replacement: one
   SessionStart hook, registered for both Claude Code and Codex, that injects a
   "Project briefing" (see section 4).
4. **Root `AGENTS.md` is short enough (70 lines, 568 words, 4,152 bytes) but is
   missing its most useful section:** one table that says where each kind of
   information goes. That routing is instead spread across nine files.
5. **The same rules are written in many places.** The memory approval policy
   (onboarding mode, trusted mode, approval card, curator) appears in seven
   files. The "design lives with its work item, never `docs/designs/`" rule
   appears in six. The tracker-choice placeholder appears seven times. Each copy
   will drift.
6. **Salesforce material is mixed into general files.** Beyond the obvious
   Salesforce folders, general files carry Salesforce wording: the `AGENTS.md`
   title line, `README.md`, `PROJECT.md`, `tests/TEST-PLAN-TEMPLATE.md`, the
   `.gitignore`, and `.claude/settings.json`. Section 9 lists every item that
   must be installed only for a Salesforce project.
7. **Several files should be generated, not hand-written:** the master and
   per-work-item `package.xml` files (from `component-tracker.csv`), the
   `ai-external-knowledge/INDEX.md`, the path-scoped rules table in `AGENTS.md`,
   `.claude/RULES.md`, a local-tracker dashboard, and the session briefing.
8. **The `WORK-ITEM.md` frontmatter does not match the lifecycle.** Its status
   list is `Backlog | In Progress | Blocked | Done`; the lifecycle's statuses
   are `Backlog, Ready, In Progress, In Review, Done, Cancelled`. It has no
   `parent` field for sub-items, no field saying who the item is waiting on,
   and it states requirements status twice.
9. **"Phase" means two different things.** `PROJECT-ROADMAP.md` uses phases
   `P01`; `WORK-ITEM.md` uses phases `P1` and `active_phase: P1`. An agent can
   mix them up.
10. **The model still carries version labels and dead references** that will
    confuse agents in Toolkit V2: "Second Brain V2", "V1", "issue #419", the
    plugin id `second-brain@claude-toolkit`, and skills that are not in the port
    list (`publish-docs`, `humanizer`, `system-guide`, `work`).
11. **Things to cut from the scaffold:** `.sfdx/` (generated by the Salesforce
    VS Code extension), `tests/__pycache__/`, `.vscode/settings.json`,
    `docs/toolkit-manual.md`, `docs/AGENTS.md`, `.claude/RULES.md`, the
    `memory_audit.py` Stop hook, the model commentary in `README.md`, and the
    four `CLAUDE.md` files.
12. **A missing rule:** the current toolkit installs `work-item-folders.md`
    whenever the local tracker is chosen. The model uses the local tracker but
    does not include it.

---

## 2. What a solo decide-and-steer owner needs, and what the model gives

| Need | What the model has | Gap | Recommendation |
| --- | --- | --- | --- |
| Session-start briefing | `CLAUDE.md` imports `.memory/MEMORY.md` and `.memory/CURRENT_FOCUS.md`; hook `toolkit-session-start.mjs` prints the `## Summary` of `docs/toolkit-manual.md` (a paragraph telling the agent which files to read) | The hook output is instructions, not status. It does not name the active work item, its stage, or what waits on Mike. Imports fail in worktrees and in Codex. | Replace with a briefing hook (section 4). |
| "What needs my decision" queue | Open Questions table in each `WORK-ITEM.md` (column "Decision needed from"); requirement `Status: Refining`; design `Status: proposed`; memory cards held "in the conversation" with "no proposal inbox" (`memory-curator-dispatch.md` line 27) | Nothing collects them. A memory card left unanswered is lost when the session ends. | Add frontmatter field `waiting_on` to `WORK-ITEM.md`; the briefing lists every item with `waiting_on: owner`, every open question addressed to the owner, every design with `Status: proposed`, and every item at stage `11-user-approval`. |
| Project-wide decision log | Decisions are spread across 8 places (section 7, row 8). Project-wide decisions that belong to no work item have no home except a memory `project_` topic, and memory is Git-ignored or in a service. | No single list Mike can read. | Add root `DECISIONS.md` (template in section 6). Work-item decisions stay in the work item. |
| Status at a glance, outside a session | Nothing for the local tracker. Notion, GitHub, and Jira have native boards. | Local tracker has no view. | Generate `.work-items/DASHBOARD.md` (the current toolkit already has this idea: "DASHBOARD.md is generated and is never a source of truth", `work-item-folders.md`). Optional: a status line script showing active item and count of decisions waiting (`statusline.md`). |
| Status at a glance, inside a session | Nothing. | Mike must ask. | The briefing hook can also return a one-line `systemMessage` shown to Mike, for example `WI-004 at 08-build. 2 decisions waiting.` (`hooks.md`: `systemMessage` is "Warning message shown to the user"; verify how it renders). Optional `sessionTitle` from the active work item, so Mike can tell sessions apart. |
| Agent files information in the right place | Routing spread across 9 files (section 7, row 2) | The agent must read several files to decide where one fact goes. | One "Where information goes" table in root `AGENTS.md`. Other files link to it. |
| Agent generates what can be generated | Only `MEMORY.md` is generated (`scripts/memory.py reindex`). | Manifests, indexes, dashboards are hand-edited "in the same response". | Section 8. |
| One record of project settings | `.toolkit-memory.json` records memory only. Tracker, Salesforce, System Guide, hosts are prose placeholders in `README.md`, `PROJECT.md`, `AGENTS.md`, `docs/toolkit-manual.md`. | Hooks and skills cannot read prose reliably. | Replace `.toolkit-memory.json` with one `.toolkit.json` (section 6). |
| Survives Mike moving files | Links between records are file paths (`design: <Link to design>`, roadmap "Linked work item: <Link>"). | Moving a folder breaks links silently. | Refer to work items by ID everywhere. The briefing hook keeps an id-to-path map and reports moves (section 4). |

---

## 3. `AGENTS.md` only: what changes when `CLAUDE.md` is dropped

### 3.1 How each host reads instruction files (verified in the captured docs)

Claude Code (`memory.md`, section "AGENTS.md", captured 2026-09-22):

- Reads `AGENTS.md` directly when there is no `CLAUDE.md`, `.claude/CLAUDE.md`,
  or `CLAUDE.local.md` in the working directory or any folder above it. User
  `~/.claude/CLAUDE.md` and `.claude/rules/` do not count and still load.
- Needs v2.1.277 or later. Does **not** read `AGENTS.md` on Bedrock or other
  third-party providers, with telemetry disabled, in the **first session after
  an install or upgrade**, or when `disableAllHooks` / `allowManagedHooksOnly`
  is set or the built-in `agents-md` plugin is disabled.
- "Inside each `AGENTS.md`: `@path` imports are expanded." Imports resolve
  relative to the file that contains them, recurse up to four hops, and load at
  launch. Paths outside the working directory trigger an approval dialog.
- A subfolder's `AGENTS.md` loads when Claude opens a file in that folder with
  the Read tool, if that folder has no `CLAUDE.md` of its own.
- Not read: `AGENTS.local.md`, `AGENTS.override.md`, anything under `.agents/`.
- `AGENTS.md` read this way is **not listed** in `/memory` or `/context`, and
  `InstructionsLoaded` hooks **do not fire** for it. Proof it loaded is the
  line `no CLAUDE.md found; AGENTS.md loaded: <path>`.
- Custom subagents load `AGENTS.md` (and so its imports). The built-in Explore
  and Plan agents skip it (`sub-agents.md`, "What loads at startup").
- "Project-root CLAUDE.md survives compaction" is stated; the page does not say
  the same for a directly read `AGENTS.md`. Treat as unverified; test it.
- Block-level HTML comments are stripped from `CLAUDE.md`. The page does not say
  this for `AGENTS.md`, and Codex does not strip them. Do not leave template
  markers or maintainer comments in an installed `AGENTS.md`.
- Target size: under 200 lines.
- A `SessionStart` hook that prints `AGENTS.md` must be removed ("adds a second
  copy to the context").

Codex (`codex/agents-md.md` and `codex/README.md`):

- Reads `~/.codex/AGENTS.md`, then one `AGENTS.md` per folder from the project
  root **down to the current working directory**, once at startup. It does not
  load a subfolder's `AGENTS.md` later when a file there is opened. So
  `requirements/AGENTS.md`, `docs/AGENTS.md`, and `.memory/AGENTS.md` are never
  read by Codex unless the root file tells it to open them.
- **Expands no import syntax.** An `@path` line reaches the model as literal
  text.
- **Never reads `CLAUDE.md` or `.claude/rules/`.**
- Combined budget `project_doc_max_bytes` = 32 KiB, spent root first.

### 3.2 Every place in the model that depends on `CLAUDE.md`

| File | Line | What it does | Change |
| --- | --- | --- | --- |
| `CLAUDE.md` | 1-3 | `@AGENTS.md`, `@.memory/MEMORY.md`, `@.memory/CURRENT_FOCUS.md` | Delete file. |
| `.memory/CLAUDE.md`, `docs/CLAUDE.md`, `requirements/CLAUDE.md` | 1 | `@AGENTS.md` | Delete all three. |
| `scripts/memory.py` | 321-324 | `doctor` lists `CLAUDE.md` among required `.memory/` files and reports `ERROR: Missing .memory/CLAUDE.md` | Remove `"CLAUDE.md"` from the tuple. |
| `scripts/memory.py` | 395-401 | Warns if root `CLAUDE.md` lacks the three imports | Replace with a check that no `CLAUDE.md`, `.claude/CLAUDE.md`, or `CLAUDE.local.md` exists (they would stop Claude reading `AGENTS.md`), and that the briefing hook is registered. |
| `.claude/hooks/toolkit-session-start.mjs` | 35-37 | Warns every session unless root `CLAUDE.md` equals the three imports exactly | Replace the hook (section 4). |
| `tests/test_memory_runtime.py` | 27 | Copies `CLAUDE.md` into the test project | Remove; this test belongs in the toolkit repo anyway. |
| `README.md` | 48 | "trust and verify ... the root `CLAUDE.md` imports" | Cut with the rest of the model commentary. |
| `docs/toolkit-manual.md` | 34 | "Claude Code reads the root `CLAUDE.md` imports" | File is cut (section 5). |
| `.claude/rules/memory-curator-dispatch.md` | 3 | "`CLAUDE.md` imports the flat index and current focus at startup; Codex reads them through root `AGENTS.md`" | Rewrite; move body into the memory skill (section 5.3). |

Add a guard: the briefing hook (and the toolkit's doctor check) warns when any
of `CLAUDE.md`, `.claude/CLAUDE.md`, or `CLAUDE.local.md` appears in the project
or above it, because it silently turns off `AGENTS.md` for Claude Code. This
matters because Claude Code's own `/init` and `/import` commands create
`CLAUDE.md` files.

### 3.3 What replaces the `@.memory/MEMORY.md` and `@.memory/CURRENT_FOCUS.md` imports

Confirmed: Claude Code expands `@path` imports inside `AGENTS.md`
(`memory.md`, "Inside each `AGENTS.md`: `@path` imports are expanded"). So the
literal answer is "move the two import lines into `AGENTS.md`". That is not the
recommendation, for five reasons:

1. **Codex:** the line `@.memory/CURRENT_FOCUS.md` is plain text to Codex. It
   loads nothing.
2. **Worktrees:** `.memory/` is Git-ignored. A linked worktree (for example
   `.claude/worktrees/<name>`, or a Claude desktop session that starts in its
   own worktree) has no `.memory/` folder. The import resolves relative to the
   worktree's `AGENTS.md` and finds nothing. `scripts/memory.py doctor` already
   warns about this ("This linked worktree has a separate .memory folder").
   Mike's rules put almost all agent work in worktrees.
3. **Other memory systems:** with Notion or Hindsight memory there is no local
   file to import.
4. **Cost in every helper:** custom subagents load `AGENTS.md` and its imports.
   `MEMORY.md` may grow to 150 lines / 25,000 bytes (`memory.py`
   `MAX_INDEX_LINES`, `MAX_INDEX_BYTES`), and every helper agent would carry it.
5. **Sessions that skip `AGENTS.md`:** first session after an upgrade,
   third-party providers.

Recommendation:

- **Current focus:** injected by a SessionStart hook registered in
  `.claude/settings.json` and `.codex/hooks.json` (section 4). The hook finds the
  main checkout with `git rev-parse --git-common-dir`, so it works in every
  worktree, and reads the current focus from whichever memory system
  `.toolkit.json` names.
- **Memory index (`MEMORY.md`):** not loaded at startup. The briefing says how
  many memories exist and tells the agent to search memory through the memory
  skill before answering anything about past decisions, preferences, or
  history. Reason: the hook output cap is 10,000 characters (`hooks.md`: above
  that, Claude only gets a file path and a 2,000-character preview), which is
  smaller than the index budget of 25,000 bytes.
- **Fallback line in `AGENTS.md`:** "If your context has no 'Project briefing',
  run `<briefing command>` and read the output." This covers sessions where
  hooks do not run.

Alternative if the architect prefers imports: keep
`@.memory/CURRENT_FOCUS.md` in `AGENTS.md` for built-in memory only, and have
worktree creation symlink `.memory` from the main checkout. This still leaves
Codex and the service-based memory systems needing the hook, so it adds a
second mechanism without removing the first.

---

## 4. The session briefing hook (new; replaces `toolkit-session-start.mjs`)

Purpose: one mechanism, same in Claude Code and Codex, that gives the agent the
project's live state at the start of every session and after `/clear` or
compaction.

Registration:

- `.claude/settings.json`: `SessionStart`, matcher
  `startup|resume|clear|compact`, `type: "command"`. Only `command` and
  `mcp_tool` hooks are allowed on `SessionStart`, and `mcp_tool` hooks are
  skipped at launch (`hooks.md`), so use a command hook.
- `.codex/hooks.json`: `SessionStart`, same script. The model's file uses
  `commandWindows`, `additionalContextLimit: 1000`, and `statusMessage`. These
  fields cannot be checked against a captured Codex hooks page (none is
  captured). `1000` is too small for a briefing; capture the Codex hooks page
  and confirm the field names and limits before building.

Inputs (all local, so the hook stays fast; Claude's first reply waits for it):

- `.toolkit.json` for tracker type, memory type, Salesforce flag.
- Tracker state. Local tracker: scan `.work-items/**/WORK-ITEM.md` frontmatter
  in the main checkout. Notion, GitHub, Jira: read a small cache file that the
  tracker skill rewrites after every change (for example
  `.toolkit/state/tracker-cache.json`, Git-ignored), and print its timestamp so
  the agent knows when to refresh through the skill.
- Current focus from the memory system (built-in: main checkout
  `.memory/CURRENT_FOCUS.md`; Notion and Hindsight: a cached copy the memory
  skill writes).
- The last id-to-path map of work items, to detect moves.

Output (plain stdout or `hookSpecificOutput.additionalContext`, under 10,000
characters in total):

```text
Project briefing (<date time>, source: <local | cache from <time>>)
Active work items:
- WI-004 Account merge rules. Stage 08-build. Next: <next action>.
Waiting on the owner:
- WI-007: approve requirements (stage 02-refinement).
- WI-004 Q-03: <question>.
Blocked or waiting on others: <from current focus>
Current focus: <body of current focus, under 50 lines>
Moved since last session: WI-009 from .work-items/WI-009-x/ to .work-items/billing/WI-009-x/
Memory: <n> saved memories in <system>. Search memory before answering questions about past decisions or preferences.
Setup warnings: <CLAUDE.md found | placeholders left in AGENTS.md | memory backup not set>
```

Optional extras (Claude Code only): `systemMessage` with a one-line status for
Mike; `sessionTitle` set to the active work item when the session has no title
(`session_title` input field tells whether one is set).

---

## 5. Folder-by-folder and file-by-file verdicts

Verdict words: **keep** (install as is), **change** (install with the edits
listed), **cut** (do not install), **add** (new), **SF** (install only in a
Salesforce project), **cond** (install only when that option is chosen).

### 5.1 Root files

| Path | Verdict | Why and what to change |
| --- | --- | --- |
| `AGENTS.md` | change | Generated by project init from a template. Full evaluation in section 6.1, proposed outline in 6.2. |
| `CLAUDE.md` | cut | Mike decided `AGENTS.md` only. See section 3.2. |
| `README.md` | change | Lines 5, 41, 43-59 are commentary about the model itself (issue #419, "Project Init package in this model", V1/V2). Cut all of it. The "Project map" duplicates `AGENTS.md`; the "Toolkit setup" section duplicates `.toolkit.json`; the "Memory setup" steps are a procedure that belongs in the memory skill. Keep a short human README: title, 1-2 sentence purpose, how to run and test, link to `PROJECT.md`. Remove "Salesforce" from line 3 unless SF. |
| `PROJECT.md` | change | Keep sections Purpose, Scope, Systems and environments, People, Resources. Line 7 says "Why this Salesforce project exists": make generic. Section "Work and project records" (lines 28-36) duplicates `AGENTS.md` and `.toolkit.json` (tracker, design home, memory, System Guide): replace with one line "Toolkit settings: `.toolkit.json`; routing: `AGENTS.md`". Line 35 names "Second Brain V2": remove. "Operating conventions" (line 45-47) invites rules into a non-rule file: cut; conventions go in `.claude/rules/`. Add a link to `DECISIONS.md`. |
| `PROJECT-ROADMAP.md` | change | Keep outcome, phase table, open planning questions, planning changes. Cut the ASCII tree (lines 5-14); it explains the method and belongs in the planning skill. Change "Linked work item: <Link ...>" to "Work item: <WI-id>" so moves do not break it. Consider generating each unit's status from the tracker instead of hand-writing it. Rename to avoid the phase clash (section 7, row 15). |
| `SOUL.md` | cond | Optional per project. An empty template with placeholders, read at every startup (`AGENTS.md` line 13), wastes a read and invites the agent to treat placeholder text as instruction. Mike's working style is already in `~/.claude/rules/` for Claude. Create only when Mike asks for a project-specific persona; when present, `AGENTS.md` lists it in startup. |
| `.toolkit-memory.json` | change | Replace with `.toolkit.json` holding every setup choice (section 6.3). Hooks, skills, and doctor checks read it. |
| `.gitignore` | change | Split: general lines (`.memory/`, `/.work-items/`, `.claude/worktrees/`, `*.log`, `__pycache__/`, `*.pyc`, plus the new cache folder such as `.toolkit/state/`) and SF lines (`.sfdx/`, `.sf/`, `.localdevserver/`, `.claude/.permset-preflight/`, `tools/kb/out/`, `tools/kb/_freshness_stamp.json`, `tools/kb/_drift_pending.md`, `tools/kb/_prev-*.json`). |
| `.forceignore` | SF | Keep. Missing trailing newline. |
| `sfdx-project.json` | SF, change | Add `"sourceApiVersion": "<org API version>"`. `permissions-source-control.md` line 19 and the runbook both say to keep `sourceApiVersion` equal to the org's version, but the file has no such field. Consider `"name"` too. |
| `.vscode/settings.json` | cut | One personal editor setting (`xml.preferences.showSchemaDocumentationType`). Not project scaffolding. |
| `.sfdx/` (64 files) | cut | Generated by the Salesforce VS Code extension (indexes, typings, sObject stubs) and already Git-ignored. Never copy it. |
| `DECISIONS.md` | add | Project-wide decision log (template in section 6.4). |

### 5.2 `.claude/` and host folders

| Path | Verdict | Why and what to change |
| --- | --- | --- |
| `.claude/settings.json` | change | Split into a general part and an SF part that init merges. General: `autoMemoryEnabled: false` (one memory writer, also correct for Notion and Hindsight), `outputStyle: "Plain English"`, the git `deny` list, `SessionStart` briefing hook, and for built-in memory the `UserPromptSubmit` memory hook. SF: `sf` deny/ask entries, `PreToolUse` guard hooks, the `Stop` graph-freshness hook. Replace `"second-brain@claude-toolkit": false` (a V1 plugin id) with the V2 `enabledPlugins` entries this project needs (for example the Salesforce plugin only in SF projects). Remove the `memory_audit.py` Stop hook. |
| `.claude/RULES.md` | cut | Hand-written index of rules; line 17 cites issue #419. It duplicates the rules folder and `AGENTS.md`. If kept, generate it from rule frontmatter. |
| `.claude/rules/` | change | Per-rule verdicts in 5.3. |
| `.claude/hooks/toolkit-session-start.mjs` | cut, replace | Replace with the briefing hook (section 4). The current hook prints up to 120 words of `docs/toolkit-manual.md` `## Summary`, which is a list of files to read, not status, and fails the `CLAUDE.md` check. |
| `.claude/hooks/memory_trigger.py` | cond (built-in memory), change | Useful: flags "remember", "correction", "from now on" and similar prompts. Shorten the reminder (lines 45-52), drop "Second Brain V2", and name the memory skill instead of the dispatch rule. Its regex list is backend-neutral, so it could serve Notion and Hindsight too. |
| `.claude/hooks/_memory_patterns.py` | cond, keep | Pattern list for the trigger. |
| `.claude/hooks/memory_audit.py` | cut | Writes a diagnostic line to `.memory/.runtime/memory-audit.jsonl` on every Stop by scanning the whole transcript. Nobody reads it, and it grows with session length. |
| `.claude/hooks/guard-protected-orgs.js` | SF, keep | Production and unknown-org guard. |
| `.claude/hooks/guard-permission-set-deploy.js` | SF (permission kit), keep | Blocks unpreflighted permission set deploys. |
| `.claude/protected-orgs.json` | SF, change | `_comment` says "Second Brain V2 Salesforce model": reword. |
| `.claude/agents/memory-curator.md` | cond (built-in memory), change | Frontmatter fields `model: opus` and `background: true` are valid (`sub-agents.md`). Remove "Second Brain V2" from `description`. Its policy text duplicates `.memory/AGENTS.md` and `memory-criteria.md`; keep the procedure, point to the criteria file for policy. |
| `.claude/output-styles/plain-english.md` | keep | Ported as decided. |
| `.claude/skills/sf-component-tracker`, `sf-data-change`, `sf-deploy-check` | SF, change | Prefer shipping these in a Salesforce plugin enabled per project, instead of copying. If copied, see `.agents/` row. |
| `.agents/skills/sf-*` | SF, change | Byte-identical copies of `.claude/skills/sf-*` (checked with `diff`) for Codex. Two copies drift. Either install from a plugin for both hosts, or generate the `.agents/` copies from one source at init and have the doctor check compare them. |
| `.codex/hooks.json` | change | Point `SessionStart` at the briefing hook. Verify the field names (`commandWindows`, `additionalContextLimit`, `statusMessage`) against Codex's hooks documentation, which is not captured yet. |

### 5.3 `.claude/rules/` (18 files)

Always-on rules load in every Claude Code session. In this SF model they total
2,699 words; the general ones alone total 1,794 words. Codex reads none of them
unless `AGENTS.md` tells it to. The model's `AGENTS.md` line 9 says "Read
`.claude/rules` first", which makes Codex read all 18 files (about 3,900 words,
including the path-scoped ones) and makes Claude re-read files it already has.

| Rule | Loads | Words | Verdict | Why and what to change |
| --- | --- | --- | --- | --- |
| `memory-curator-dispatch.md` | always | 593 | change | Largest always-on rule, and its policy is repeated in six other files. Move the body into the memory skill. Keep a 3-5 line always-on trigger: when to use the memory skill, never write memory files directly, a regex reminder is not a decision. Write one per memory system, or make it backend-neutral. |
| `plain-english-artifacts.md` | always | 674 | keep | Ported general rule. Its examples are Salesforce role-hierarchy examples; acceptable, but a generic example would suit non-SF projects better. |
| `parallel-agent-sessions.md` | always | 221 | keep | Ported. Note: Mike's `~/.claude/rules/parallel-agent-sessions.md` loads too, so Claude sees two versions. Still needed for Codex and other machines. |
| `work-item-stages.md` | always | 133 | change | Replace "`work` skill" with the V2 tracker skill name. Add: set `waiting_on: owner` when a decision is needed. |
| `humanize-outbound-text.md` | always | 116 | change | Names the `humanizer` skill, which no toolkit plugin ships and is not installed on this Mac. Name `unslop` (ported with session skills). |
| `offer-context-handoff.md` | always | 57 | change | Names `.memory/CURRENT_FOCUS.md` and `.memory/memory-criteria.md` directly; make it memory-system neutral ("update current focus through the memory skill"). |
| `knowledge-direct-commit.md` | path | 154 | change | Depends on the `publish-docs` skill from `git-workflows`, which is not in the port list; port it or the rule points at nothing. Its name uses the V1 word "knowledge"; consider `docs-direct-publish.md`. Its paths include `delivery/**` (SF only) and should include `DECISIONS.md`. Line 21 names `.memory/` and `.work-items/`: keep. |
| `ai-external-knowledge.md` | path | 380 | keep | Path-scoped to `ai-external-knowledge/**`, so it loads only after a file there is read. The decision to capture docs happens earlier; the routing row in `AGENTS.md` covers that. |
| `work-item-folders.md` | — | — | add (cond: local tracker) | Present in the current toolkit's general library for local tracking; missing from the model. Covers groups, archive, and "never move an item without the owner's request". Update for V2: Mike may move folders and the agent adapts. |
| `component-tracker.md` | always | 60 | SF, change | Says to edit `_master/package.xml` and the work item manifest by hand in the same response. If manifests are generated (section 8), the rule becomes "edit `component-tracker.csv`, then run the generator". |
| `data-change-handoff.md` | always | 145 | SF, keep | |
| `delivery-and-knowledge-boundary.md` | always | 92 | SF, change | Line 8 names "Second Brain V2". The `engagement/` clause exists for older projects; a V2 init only creates new projects (open question 12). |
| `deploy-hitchhiker-check.md` | always | 96 | SF, keep | |
| `salesforce-change-clarify.md` | always | 103 | SF, change | Line 7 "Record the decision where the project keeps decisions" should say `DECISIONS.md`. |
| `salesforce-safety-guardrails.md` | always | 409 | SF, keep | |
| `dependency-graph.md` | path | 206 | SF (graph kit), change | Lines 10-11 say "correct the affected project notes" and "update the written explanation of that metadata" without naming where; name the home (requirements area, System Guide, or memory). |
| `deployment-runbook.md` | path | 55 | SF, keep | |
| `permissions-source-control.md` | path | 299 | SF (permission kit), keep | Depends on `sourceApiVersion` in `sfdx-project.json` (missing, see 5.1). |
| `production-data.md` | path | 87 | SF, change | Line 9 says "No extra event README or seed record is required", but the scaffold ships `LOAD-RECORD-TEMPLATE.md` and `BACKUP-RECORD-TEMPLATE.md`. Decide one way (open question 11). |

### 5.4 `.memory/` (built-in memory only; created by init, not copied)

GOAL.md says init copies everything except `.work-items/` and `.memory/`. So
these files must live as templates in the toolkit and be created by the memory
skill or init when built-in memory is chosen.

| Path | Verdict | Why and what to change |
| --- | --- | --- |
| `.memory/AGENTS.md` | change | 510 words; repeats the policy in `memory-criteria.md`, the curator agent, and the dispatch rule. Cut to about 5 lines: what the folder is, write only through the memory skill or `scripts/memory.py`, policy is in `memory-criteria.md`. Claude loads it when a file in `.memory/` is read; Codex needs the pointer from root. |
| `.memory/CLAUDE.md` | cut | Section 3.2. |
| `.memory/CURRENT_FOCUS.md` | change | Nine required headings, enforced by `memory.py` `FOCUS_HEADINGS` (lines 31-41), 50-line limit. Four sections duplicate other owners: "Priorities and tasks to complete" (tracker), "Recent decisions" (new `DECISIONS.md`), "Last 3 things touched" (derivable from Git and tracker dates), "Upcoming milestones" (roadmap). Proposed headings: `Focus`, `Owner to-dos without a work item`, `Waiting on others`, `Heads-up` (time-sensitive, with dates), `Next session starts here`. The briefing hook adds the tracker-derived parts. Update `FOCUS_HEADINGS` to match. |
| `.memory/MEMORY.md` | keep | Generated by `memory.py reindex`. Not loaded at startup (section 3.3). |
| `.memory/memory-criteria.md` | keep, change | The single owner of memory policy. Frontmatter `mode: onboarding` means every lasting save needs Mike's approval card; see open question 9. Table row `project_` says "otherwise-unowned decision": with `DECISIONS.md` added, project-wide decisions are owned there. |
| `.memory/project_topic_template.md` | change | Move into the toolkit's memory skill templates, since `.memory/` is not copied. |
| `.memory/terminology-glossary.md` | change | A glossary defines words used in requirements; it is project knowledge, not personal memory. In a Git-ignored folder it is lost on a new clone and invisible with Notion or Hindsight memory. Consider `docs/glossary.md` in Git (open question 14). |
| `scripts/memory.py` | cond, change | (a) Remove the `CLAUDE.md` checks (lines 321, 395-401). (b) Replace the `second-brain-v2` marker check (line 380) and the `second-brain@claude-toolkit` check (line 388) with `.toolkit.json` checks. (c) `ROOT = Path(__file__).resolve().parents[1]` and `VAULT = ROOT / ".memory"` point at the worktree, where `.memory/` does not exist; resolve the main checkout with `git rev-parse --git-common-dir`. (d) Consider shipping the script in the plugin instead of copying it into every project. |
| `tests/test_memory_runtime.py` | cut from scaffold | A test of toolkit code; belongs in the toolkit repo's tests, not in each project's `tests/`. |

### 5.5 `.work-items/` (local tracker only; created by the tracker skill, not copied)

`WORK-ITEM.md` (128 lines) and `DESIGN.md` (104 lines) are Mike's approved
formats (`TEMPLATE-SOURCE-REVIEW.md`: "Mike finalized the folder"). The body
sections stay. Proposed changes are to frontmatter and small duplications.

`WORK-ITEM.md` frontmatter today:

```yaml
id: WI-001
title: <Work item title>
type: <Work item type>
status: <Backlog | In Progress | Blocked | Done>
stage: <Current lifecycle stage>
active_phase: P1
requirements_status: refining
design: <Link to design, if one exists>
```

Proposed:

```yaml
id: WI-001                 # the item's identity; folder name and path may change
title: <Work item title>
type: <discovery | solution-design | build | data-load | repository-maintenance | research | task | bug | enhancement>
status: <Backlog | Ready | In Progress | In Review | Done | Cancelled>
stage: <01-discovery ... 14-spec-update>
waiting_on: <owner | agent | external: <who>>   # new; feeds "waiting on the owner"
parent: <WI-id or none>    # new; sub-items (Notion sub-item, GitHub sub-issue, Jira sub-task)
requirements_approved: <YYYY-MM-DD by <owner>, or no>
design: <DESIGN.md | link | none>
updated: <YYYY-MM-DD>      # new; lets the briefing show recent changes
```

Reasons:

- Status values: the lifecycle (`lifecycle.md` "Stages" table) uses `Backlog`,
  `Ready`, `In Progress`, `In Review`, `Done`, `Cancelled`. "Blocked" is not a
  status there; blocking is recorded as `waiting_on` plus the Blockers line.
- Type values: `lifecycle.md` "Work type and approval" lists
  `discovery, solution-design, build, data-load, repository-maintenance,
  research, task`, with `bug` and `enhancement` still valid. The approval gate
  depends on type (`build` and `data-load` need approved requirements), so the
  placeholder should list them.
- `requirements_status: refining` duplicates the body line
  `**Overall status:** Refining` (line 72). Keep one. Recommended: frontmatter
  `requirements_approved` (who and when), body keeps the per-requirement status.
- `active_phase: P1` collides with roadmap phases `P01`. Drop it, or rename the
  work-item level (open question 15).
- For external trackers the frontmatter maps to native fields, and the body must
  not repeat them (`record-format.md`: "reference them instead of duplicating
  editable values in the description").

`WORK-ITEM.md` body, small changes:

- Overview "Next action" (line 20) and Notes "Resume here" (lines 119-121) say
  the same thing. Keep "Next action" in Overview; cut "Resume here", or make it
  the one place and cut the other.
- Overview "Blockers" and the Open Questions table overlap; keep both but have
  Blockers reference question IDs.
- Roadmap table: add a "Sub-items" column so nested items are listed
  (`record-format.md` Roadmap: "linked child items").
- Open Questions column "Decision needed from": use the fixed value `owner` when
  it is Mike, so the briefing can collect it.
- "Related items" should use IDs, not paths.

`DESIGN.md` changes:

- Add frontmatter so trackers and the briefing can read it:
  `work_item: WI-001`, `status: <proposed | approved | superseded>`,
  `approved: <YYYY-MM-DD by <owner>, or no>`. Today it has only
  `Status: proposed` in body text and no approval record.
- `Requirements: [WORK-ITEM.md](WORK-ITEM.md)` works only for the local tracker;
  write `Requirements: WI-001`.
- Notes "Resume here" duplicates the work item's Next action; keep only in the
  work item.

New generated file: `.work-items/DASHBOARD.md` (status board for the local
tracker; never edited by hand).

### 5.6 `requirements/`

| Path | Verdict | Why and what to change |
| --- | --- | --- |
| `requirements/AGENTS.md` | keep, change | Useful, host-neutral scoped guide (Claude loads it on read; Codex through the root pointer). Say when to update: at stage `14-spec-update`, after delivery is confirmed. |
| `requirements/CLAUDE.md` | cut | Section 3.2. |
| `requirements/AREA-TEMPLATE.md` | keep | Clear. "Stable rule ID" should say the format (for example `ACC-01`). |
| `requirements/SYSTEM-DATA-MODEL.md` | change | Uses a different placeholder style (`[Details about ...]`) from every other file (`<...>`). Make it an area file built from `AREA-TEMPLATE.md`, or give it its own short template. |

### 5.7 `docs/`

| Path | Verdict | Why and what to change |
| --- | --- | --- |
| `docs/AGENTS.md` | cut | One paragraph of routing that belongs in the root routing table. It repeats the design-home rule a sixth time. |
| `docs/CLAUDE.md` | cut | Section 3.2. |
| `docs/toolkit-manual.md` | cut | 741 words. Its "Summary" duplicates `AGENTS.md` startup; "Start and continue work" and "Complete and hand off work" are procedures that belong in skills; "Second Brain V2 operation" duplicates the memory policy; "Selected systems" and "Project-specific setup" duplicate `.toolkit.json`. A per-project copy of a toolkit manual drifts from the toolkit. If a manual is wanted, keep it in the toolkit repo, not in each project. |
| `docs/permissions-runbook.md` | SF (permission kit), change | Lines 20-24 point to "the Project Init plugin's `library/guides/...`", a current-toolkit path. Point to the V2 plugin location. The HTML `TEMPLATE` comment (lines 6-16) is setup instructions; init should fill `<SANDBOX>` and `<PACKAGE_DIR>` and remove it. |
| `docs/system-guide/AREA-TEMPLATE.md` | cond | Belongs to the optional System Guide. The `system-guide` plugin is not in the port list. Drop from the default scaffold unless the System Guide is ported (open question 10). |
| `docs/glossary.md` | add (optional) | If the glossary moves to Git (5.4). |

After these changes a non-SF project may have no `docs/` folder at all until
something is written there. That is fine.

### 5.8 `ai-external-knowledge/`

| Path | Verdict | Why and what to change |
| --- | --- | --- |
| `ai-external-knowledge/INDEX.md` | change | Its example row lists `topic-template` as if it were a topic. Generate this index from each topic folder's source record, and skip template folders. |
| `ai-external-knowledge/topic-template/SOURCE-RECORD-TEMPLATE.md` | change | Three different files in the scaffold are named `SOURCE-RECORD-TEMPLATE.md` with different fields (here, `delivery/project-overview/brief-template/`, `delivery/references/source-template/`). Rename so each name is unique, for example `CAPTURE-RECORD-TEMPLATE.md`. The rule calls the real file `SOURCE-RECORD.md`; keep that name for real records. |
| `ai-external-knowledge/topic-template/PAGE-TEMPLATE.md` | keep | |

### 5.9 `delivery/` (SF only)

The whole tree is client-work structure for a Salesforce consulting project. A
solo developer building his own product does not need it.

| Path | Verdict | Why and what to change |
| --- | --- | --- |
| `delivery/project-overview/brief-template/BRIEF-TEMPLATE.md` | SF, keep | |
| `delivery/project-overview/brief-template/SOURCE-RECORD-TEMPLATE.md` | SF, change | Rename (duplicate file name, see 5.8). |
| `delivery/references/source-template/SOURCE-RECORD-TEMPLATE.md`, `SOURCE-NOTES-TEMPLATE.md` | SF, change | Rename the record file. Line 11 of the record uses a relative path `../../../ai-external-knowledge/` which breaks when the folder is copied to another depth; write the root path instead. |
| `delivery/communications/message-template/MESSAGE-TEMPLATE.md` | SF, keep | |
| `delivery/meeting-notes/`, `delivery/deliverables/` | SF, change | Empty folders. Git does not keep empty folders, so they vanish in a fresh clone. Either init creates them on demand, or they get a placeholder file (not a README). |
| `delivery/archive/item-template/ARCHIVE-RECORD-TEMPLATE.md` | SF, keep | |
| `delivery/data/area-template/*` (3 files) | SF, keep | `DATA-AREA-TEMPLATE.md` lists the other two by template name; after real use the names change, so say "the field mapping file" instead. |
| `delivery/data/data-loads/.gitignore`, `production-backups/.gitignore` | SF, keep | Protect data files with record IDs and personal data. |
| `delivery/data/data-loads/load-template/LOAD-RECORD-TEMPLATE.md`, `production-backups/backup-template/BACKUP-RECORD-TEMPLATE.md` | SF, change | Contradict `production-data.md` line 9 and `sf-data-change` step 3 ("No separate event README or seed record is required"). Decide (open question 11). Recommendation: keep the records; they are the handoff Mike reads while running Data Loader. Change the rule and skill to "write the record in the event folder and link it from the work item". |
| `delivery/deployment/component-tracker.csv` | SF, keep | The single source for manifests. |
| `delivery/deployment/_master/PACKAGE-XML-TEMPLATE.md` | SF, change | Replace with a generator (section 8). The skill says "Refresh member counts in its header", but the template header has no counts. |
| `delivery/deployment/_master/MASTER-DEPLOYMENT-TEMPLATE.md` | SF, keep | |
| `delivery/deployment/_master/MANUAL-STEPS-TEMPLATE.md` and `work-item-template/MANUAL-STEPS-TEMPLATE.md` | SF, change | Two templates with the same name and different fields; neither matches the step shape in `sf-component-tracker` "Step 4" (fields Title, Phase, Order with gaps of 10, Owner, Status, Body). Keep one template that matches the skill. |
| `delivery/deployment/work-item-template/` | SF, change | Folder name collides with `.work-items/work-item-template/`. Rename, for example `item-manifest-template/`. |
| `.../work-item-template/PACKAGE-XML-TEMPLATE.md`, `DESTRUCTIVE-CHANGES-TEMPLATE.md` | SF, change | Near-identical to the master template. Generate `package.xml` and `destructiveChanges.xml` from the CSV's Work Item and Change Type columns. |
| `.../work-item-template/DEPLOYMENT-RECORD-TEMPLATE.md` | SF, change or cut | Not in the skill's folder layout. "Validation and result" duplicates the work item. |
| `delivery/deployment/release-template/CUTOVER-PLAN-TEMPLATE.md`, `RELEASE-NOTES-TEMPLATE.md` | SF, keep | |

### 5.10 `tests/`, `scripts/`, `tools/`, `force-app/`

| Path | Verdict | Why and what to change |
| --- | --- | --- |
| `tests/TEST-PLAN-TEMPLATE.md` | change | A Markdown template inside the code-test folder, with Salesforce wording ("Verified org"). For general projects, testing lives in the work item (acceptance checks) and DESIGN (per-requirement "How to check it"). For SF, move to `delivery/deployment/release-template/`. |
| `tests/__pycache__/` | cut | Python bytecode left from a test run. |
| `tests/test_memory_runtime.py` | cut | See 5.4. |
| `scripts/memory.py` | cond | See 5.4. |
| `tools/kb/` (40 files incl. `README.md` and tests) | SF, cond (graph kit) | Metadata dependency graph. Init should ask. Consider shipping in the SF plugin. `README.md` is a tool manual, not a folder README; keep. |
| `tools/permissions/` (`permsets.py`, `README.md`) | SF, cond (permission kit) | Same. |
| `force-app/` | SF | Empty. Let `sf project generate` or the first retrieve create `main/default`. |

---

## 6. Root `AGENTS.md`

### 6.1 Evaluation of the model's `AGENTS.md`

Size: 70 lines, 568 words, 4,152 bytes. That is well under Claude Code's 200-line
target and Codex's 32 KiB budget. The problems are content and placement, not
length.

| Line(s) | Text | Problem | Fix |
| --- | --- | --- | --- |
| 1-5 | "Always execute work with the context in mind ..." | Mike's fixed wording from the current toolkit. It is vague; "not adding context that might pollute future agents" can make an agent hold back from saving things it should save. | Keep verbatim only if Mike confirms for V2 (open question 1). |
| 9 | `<One sentence describing this Salesforce project and its outcome.>` | Salesforce wording in the general template. | Generic sentence; add the owner-and-agent roles line. |
| 9 | "Read `.claude/rules` first." | Claude Code already loads the unscoped rules; Codex would read all 18 files including path-scoped ones. | List always-on rules by name with "Codex: read these at session start". |
| 13 | "Read `SOUL.md`, `PROJECT.md`, and `.memory/CURRENT_FOCUS.md`; repeat after resume, clear, or compaction." | Reads an empty `SOUL.md`; `PROJECT.md` is not needed every session; `CURRENT_FOCUS` is Git-ignored and absent in worktrees; Claude also imports it via `CLAUDE.md`, so it is loaded twice. | Replace with the briefing hook plus one fallback line. |
| 14 | "open the chosen item, the `work` skill, and the relevant `PROJECT-ROADMAP.md` phase" | `work` is the current toolkit's skill name. | Use the V2 tracker skill name. |
| 15 | "Use `.memory/MEMORY.md` ... Follow `.memory/AGENTS.md` before writes." | Assumes built-in memory. | Conditional memory block naming the memory skill. |
| 16 | "Open only the needed section of `docs/toolkit-manual.md`." | Manual is cut. | Remove. |
| 20-29 | Path-scoped rules table | Correct idea (the only route for Codex). It is hand-written and will drift from the rules' `paths:` frontmatter; it lists SF rules in the general template. | Generate from frontmatter at init; SF rows only for SF. |
| 31 | "When `.system-guide.json` is enabled ..." | That file does not exist in the model; the System Guide is not in the port list. | Include only when enabled. |
| 35-46 | Project map | Mixes routing rules into the map ("Never create `docs/designs/`" in line 39); shows both tracker options at once (`<external tracker>` or `.work-items/`); uses "V2" jargon (line 42); rows for folders that may not exist. | Map lists only folders that exist; routing moves to its own table. |
| 50-56 | Tools table | The one row every project needs, "Build, test, or deploy", is a placeholder at the bottom. | Put run and test commands first. |
| 58-64 | "Quick saves" | Jargon title; mixes publishing, memory, and tracker routes. | Fold into "Where information goes". |
| 66-70 | "Where work is tracked" | Good content, but "Select one" reads as an instruction to the agent to choose a tracker; placeholders only. | Fixed fields filled by init (6.2). |
| (missing) | — | No "Where information goes" table; no "What the owner decides" boundary; no work-item-ID rule for moved files; no memory system block; no decisions log pointer. | Add (6.2). |

Things that should never be in `AGENTS.md` (kept from the current toolkit's
`thin-agents-md.md`, still correct): a rule that already has a file in
`.claude/rules/`; how to talk to the owner (output style and user rules own
it); multi-step procedures (skills own them); current status or open work (the
tracker and briefing own them); unfilled `<placeholders>` (init must fill every
one, and the doctor check should fail if any remain).

### 6.2 Proposed `AGENTS.md` template

Project init writes this file from a template, keeping only the blocks that
match the owner's answers. Text in `<angle brackets>` is filled by init.
Blocks marked `[SF]`, `[local tracker]`, `[built-in memory]` and so on are kept
or removed by init; no markers or HTML comments remain in the installed file.
Estimated installed size: 80-110 lines, about 700-900 words.

```markdown
<Mike's continuity paragraph, verbatim, only if Mike keeps it for V2>

# <Project name>

<One sentence: what this project is and who uses it.>
<Owner name> owns this project and makes the decisions. The agent runs it:
keeps the tracker, memory, and records current, and does the technical work.

## Every session

- The session-start hook adds a "Project briefing" to your context: active work
  items, what is waiting on the owner, current focus, and setup warnings. If it
  is missing, run `<briefing command>` and read the output.
- Before substantial work, open the active work item with the `<tracker skill>` skill.
- Codex: at session start, also read the always-on rules listed under "Rules".

## What the owner decides

Ask the owner, and record the answer where it belongs, before you:
- approve requirements (build and data-load work cannot start without it);
- choose between design options;
- merge to the default branch, deploy, or do anything that cannot be undone;
- spend money, sign in, or change an account.
Do everything else yourself, record it, and report it in the final reply.
When you need a decision, add it to the work item's Open Questions with
"Decision needed from: owner" and set `waiting_on: owner`.

## Where information goes

| Information | Home |
| --- | --- |
| New request, idea, or bug | New work item, stage `01-discovery` |
| Requirements, questions, tasks, progress for one change | That work item |
| How a change is built | Its design: <DESIGN.md beside WORK-ITEM.md / the Solution Design subpage / ...> |
| Project-wide decision | `DECISIONS.md` |
| Agreed behavior, after delivery | `requirements/<area>.md` |
| Current focus, owner to-dos with no work item, next-session note | Current focus, through the `<memory skill>` skill |
| Lasting preference, correction, lesson, hard-to-find reference | Memory, through the `<memory skill>` skill only |
| Project terms | `<glossary path>` |
| Outside documentation you capture | `ai-external-knowledge/<topic>/` |
| How the agent should work | A rule in `.claude/rules/` or a skill, never memory |
[SF] | Client brief, source file, message, meeting note | `delivery/<category>/` |
[SF] | Data load or backup files | `delivery/data/` (never committed) |
[SF] | Deploy manifests and manual steps | `delivery/deployment/` |

Refer to work items by ID (`<PREFIX>-12`), never by folder path. The owner may
move or rename folders; find an item by the `id` in its record.

## Work tracking

- Tracker: <Local folders in `.work-items/` (Git-ignored, shared by all worktrees) | Notion: <database link> | GitHub Issues: <owner/repo> | Jira: <project key>>. It is the only tracker. Never copy items elsewhere.
- IDs: `<PREFIX>-<number>`. Sub-items: <nested item folders with `parent:` | Notion sub-items | GitHub sub-issues | Jira sub-tasks>.
- Stages `01-discovery` to `14-spec-update`, statuses, and approvals: the `<tracker skill>` skill.
- Requirements are approved only when the work item records the owner's approval with a date.
- Design home: <see table above>.

## Memory

- System: <built-in `.memory/` in the main checkout | Hindsight bank `<bank>` on this Mac | Notion Memory database <link>>.
- Read and write memory only through the `<memory skill>` skill. Search it before answering questions about past decisions, preferences, or history.
- What to save, and whether saves need the owner's approval: <`.memory/memory-criteria.md` / criteria page link>.

## Rules

Always on. Claude Code loads these; Codex: read them at session start.
- `.claude/rules/<name>.md`: <one-line purpose>
- ...

Path-scoped. Claude Code loads each when a matching file is read. Codex: open
the rule before working on a matching path.

| Paths | Rule |
| --- | --- |
| `<patterns from the rule's paths: frontmatter>` | `.claude/rules/<name>.md` |

## Project map

| Path | What is there, and when to open it |
| --- | --- |
| `PROJECT.md` | Purpose, scope, systems, people. Open for project context. |
| `PROJECT-ROADMAP.md` | Outcome and phases. Open when planning or ordering work. |
| `DECISIONS.md` | Project-wide decisions. Open before changing direction. |
| `requirements/` | Agreed behavior by area. Read its `AGENTS.md` before editing. |
| `<source folder>`, `tests/` | Code and tests. |
[only rows for folders that exist]

## Commands

| Task | Command |
| --- | --- |
| Run the app | `<verified command>` |
| Run the tests | `<verified command>` |
| Check the toolkit setup | `<doctor command>` |
[SF] | Validate against a sandbox | `sf project deploy validate -x <manifest> -o <sandbox alias>` |

[SF]
## Salesforce

- Orgs: working sandbox `<alias>`, production `<alias>`. Agents never deploy to,
  validate against, or write data in production; hand the owner the command or file.
- Org safety, deploys, data changes, and permission sets: see the Salesforce rules above.
```

Notes on this outline:

- It follows Claude Code's guidance (`memory.md`, "Write effective
  instructions"): concrete, headed, under 200 lines, procedures in skills,
  folder-specific rules in path-scoped rules.
- It works for Codex without imports: every file Codex must open is named in
  plain text.
- It does not duplicate the skill index. Both hosts list skill descriptions on
  their own; `AGENTS.md` names only the two or three orchestration skills that
  the routing text needs.
- The "Rules" section and the path table are generated at init from the rule
  files, and the doctor check compares them on every run.

### 6.3 Proposed `.toolkit.json` (replaces `.toolkit-memory.json`)

```json
{
  "schema": 1,
  "tracker": { "type": "local | notion | github | jira", "location": ".work-items | <Notion data source id> | <owner/repo> | <JIRA key>", "idPrefix": "WI" },
  "memory": { "type": "builtin | hindsight | notion", "location": ".memory | <bank id> | <Notion database id>" },
  "salesforce": { "enabled": false, "kits": ["permissions", "dependency-graph"], "orgs": { "sandbox": "<alias>", "production": "<alias>" } },
  "hosts": ["claude-code", "codex"]
}
```

Memory trust mode stays in `memory-criteria.md` (one owner for that fact).

### 6.4 Proposed `DECISIONS.md`

```markdown
# Decisions

Project-wide decisions. A decision about one work item stays in that item's
Recent History. Add new rows at the bottom; never rewrite an old row. To
change a decision, add a new row that says which one it replaces.

| ID | Date | Decision | Why | Decided by | Replaces |
| --- | --- | --- | --- | --- | --- |
| D-001 | <YYYY-MM-DD> | <What was decided> | <Reason in one line> | <owner> | <D-id or none> |
```

This mirrors how Toolkit V2 itself is being run: `dev/GOAL.md` holds the goal
and "Settled decisions", and every agent reads it first.

---

## 7. Duplication map

Each row is one fact or policy, where it is written today, and the proposed
single owner.

| # | Fact or policy | Written in today | Proposed owner |
| --- | --- | --- | --- |
| 1 | Memory approval policy (onboarding, trusted, card, curator, no inbox) | `.memory/AGENTS.md`, `.memory/memory-criteria.md`, `.claude/rules/memory-curator-dispatch.md`, `.claude/agents/memory-curator.md`, `docs/toolkit-manual.md` (lines 32-38), `README.md` (lines 43-51), `memory_trigger.py` reminder (lines 45-52) | `memory-criteria.md` for policy; memory skill for procedure |
| 2 | Where each kind of information goes | `AGENTS.md` map, `docs/AGENTS.md`, `.memory/AGENTS.md` line 9, `memory-curator-dispatch.md` line 7, `docs/toolkit-manual.md` lines 25-30, `delivery-and-knowledge-boundary.md`, `README.md` map, `ai-external-knowledge/INDEX.md` line 9, `requirements/AGENTS.md` | Root `AGENTS.md` "Where information goes" |
| 3 | Design lives with the work item, never `docs/designs/` | `AGENTS.md` line 39, `docs/AGENTS.md`, `README.md` line 41, `PROJECT.md` line 33, `docs/toolkit-manual.md` lines 22 and 42 | `AGENTS.md` routing row; tracker skill |
| 4 | Which tracker this project uses | `AGENTS.md` lines 39 and 68, `README.md` lines 23 and 34, `PROJECT.md` line 30, `docs/toolkit-manual.md` lines 13 and 42 | `.toolkit.json`; `AGENTS.md` shows it once |
| 5 | What to read at startup | `AGENTS.md` Startup, `CLAUDE.md` imports, `docs/toolkit-manual.md` Summary and "Start and continue work", `toolkit-session-start.mjs`, `.memory/AGENTS.md` line 7 | Briefing hook, plus one fallback line in `AGENTS.md` |
| 6 | Project map | `AGENTS.md`, `README.md` | `AGENTS.md` |
| 7 | Current state and next step | `CURRENT_FOCUS.md` (priorities, blockers, handoff, last 3 touched), `WORK-ITEM.md` Overview (current position, next action, blockers), `WORK-ITEM.md` Notes "Resume here", `DESIGN.md` Notes "Resume here", tracker status | Work item for item state; current focus only for things with no work item; briefing combines them |
| 8 | Decisions | `WORK-ITEM.md` Recent History and Notes "Decisions and context", requirement "Decision record", `DESIGN.md` Notes "Decisions", `CURRENT_FOCUS.md` "Recent decisions", memory `project_` topics, `PROJECT-ROADMAP.md` "Planning changes", requirement area "Change history" | Work item for item decisions; `DECISIONS.md` for project-wide ones |
| 9 | Requirements approval status | `WORK-ITEM.md` frontmatter `requirements_status` and body "Overall status" | Frontmatter `requirements_approved` |
| 10 | Salesforce skills | `.claude/skills/sf-*` and `.agents/skills/sf-*` (identical) | One source: plugin, or generated copy |
| 11 | Data event details | `production-data.md`, `sf-data-change` skill, load/backup record templates, work item | Decide (open question 11) |
| 12 | Manual deploy step shape | `sf-component-tracker` skill "Step 4", two `MANUAL-STEPS-TEMPLATE.md` files | One template matching the skill |
| 13 | `package.xml` shape | `_master/PACKAGE-XML-TEMPLATE.md`, `work-item-template/PACKAGE-XML-TEMPLATE.md`, `DESTRUCTIVE-CHANGES-TEMPLATE.md` | Generator script |
| 14 | Which memory system is used | `.toolkit-memory.json`, `PROJECT.md` line 35, `README.md` line 35, `docs/toolkit-manual.md` line 14 | `.toolkit.json` |
| 15 | "Phase" | `PROJECT-ROADMAP.md` (`P01`, project phases) and `WORK-ITEM.md` (`P1`, `active_phase`, work-item phases) | Two different names (open question 15) |
| 16 | Parallel-session rule | `~/.claude/rules/parallel-agent-sessions.md` (user) and `.claude/rules/parallel-agent-sessions.md` (project) | Both kept on purpose (Codex and other machines need the project copy); note the double load in Claude |

---

## 8. Files to generate instead of hand-writing

| File | Generated from | By | Notes |
| --- | --- | --- | --- |
| Session briefing (context text) | `.toolkit.json`, tracker records or cache, current focus, id-to-path map | Briefing hook | Section 4 |
| `.work-items/DASHBOARD.md` | `WORK-ITEM.md` frontmatter | Tracker skill after each change; also the briefing hook | Local tracker only; never edited by hand |
| `.memory/MEMORY.md` | Topic file frontmatter | `scripts/memory.py reindex` | Already generated |
| `AGENTS.md` "Rules" section and path table | Rule files and their `paths:` frontmatter | Project init; doctor compares | Keeps Codex routing in step with Claude |
| `.claude/RULES.md` (if kept) | Same | Same | Otherwise cut |
| `ai-external-knowledge/INDEX.md` | Each topic's `SOURCE-RECORD.md` | Capture skill or a small script | Skip template folders |
| `delivery/deployment/_master/package.xml` | `component-tracker.csv` rows that are CLI-deployable and not `Destructive` | SF script | Replaces the hand edit in `component-tracker.md` |
| `delivery/deployment/<WI>/package.xml` and `destructiveChanges.xml` | CSV rows whose Work Item is that ID, split by Change Type | Same script | |
| `.agents/skills/sf-*` (if copies are kept) | `.claude/skills/sf-*` | Project init; doctor compares | Or use a plugin for both hosts |
| Roadmap unit status lines (optional) | Tracker status of each linked work item | Tracker skill | Roadmap text stays hand-written |

---

## 9. Salesforce-only inventory (install only when the project is Salesforce)

Whole files and folders:

- `delivery/` (entire tree)
- `force-app/`, `sfdx-project.json`, `.forceignore`
- `docs/permissions-runbook.md`, `tools/permissions/` (permission kit; ask)
- `tools/kb/` (dependency-graph kit; ask)
- `.claude/hooks/guard-protected-orgs.js`, `.claude/protected-orgs.json`
- `.claude/hooks/guard-permission-set-deploy.js` (permission kit)
- `.claude/rules/`: `component-tracker.md`, `data-change-handoff.md`,
  `delivery-and-knowledge-boundary.md`, `deploy-hitchhiker-check.md`,
  `deployment-runbook.md`, `production-data.md`,
  `salesforce-change-clarify.md`, `salesforce-safety-guardrails.md`,
  `permissions-source-control.md` (permission kit), `dependency-graph.md`
  (SF variant; graph kit)
- Skills `sf-component-tracker`, `sf-data-change`, `sf-deploy-check`, and the
  ported `sf-architect-solutioning`

Lines inside general files:

- `.claude/settings.json`: `deny` entries `sf project delete source *`,
  `sfdx force:source:delete *`, `sf org delete *`; `ask` entries
  `sf project deploy start *`, `sf data create|update|delete|import|upsert *`,
  `sf apex run *`; `PreToolUse` guard hooks; `Stop` hook
  `tools/kb/graph_freshness_hook.py`
- `.gitignore`: `.sfdx/`, `.sf/`, `.localdevserver/`,
  `.claude/.permset-preflight/`, `tools/kb/*` entries
- `AGENTS.md`: the `[SF]` rows and the Salesforce section; path-scoped rows for
  `delivery/**`, `force-app/**`, `tools/kb/**`
- `knowledge-direct-commit.md` `paths`: `delivery/**`
- `README.md` line 3, `PROJECT.md` line 7 ("Salesforce project")
- `tests/TEST-PLAN-TEMPLATE.md` wording ("Verified org")
- `requirements/SYSTEM-DATA-MODEL.md` is generic enough to keep for all projects

Never in any scaffold: `.sfdx/`, `.vscode/settings.json`.

---

## 10. Stale names and references to fix everywhere

| Text | Where | Replace with |
| --- | --- | --- |
| "Second Brain V2", "V2 memory", "V1" | `PROJECT.md` 35, `README.md` 35/48/57, `AGENTS.md` 42/52/63, `protected-orgs.json` `_comment`, `memory_trigger.py` 2/46, `RULES.md` 7, `toolkit-session-start.mjs` 3/36/38, `memory-curator-dispatch.md` 3, `memory-curator.md` description, `delivery-and-knowledge-boundary.md` 8, `permissions-runbook.md` 13, `memory.py` 2/381/389, `docs/toolkit-manual.md` 14/32 | "built-in memory" or the V2 memory skill name. No version labels in installed files. |
| `"memory": "second-brain-v2"` | `.toolkit-memory.json`, `memory.py` 380 | `.toolkit.json` `memory.type: "builtin"` |
| `second-brain@claude-toolkit` | `.claude/settings.json` 4, `memory.py` 388 | V2 plugin ids |
| issue #419 | `README.md` 5/57, `RULES.md` 17 | Remove |
| `work` skill | `AGENTS.md` 14, `work-item-stages.md` 5/12 | V2 tracker skill |
| `publish-docs` skill | `AGENTS.md` 62, `knowledge-direct-commit.md` 19, `parallel-agent-sessions.md` 13 | Port `git-workflows/publish-docs` or change the rules |
| `humanizer` skill | `humanize-outbound-text.md` 4 | `unslop` |
| `system-guide` skill, `.system-guide.json` | `AGENTS.md` 31 | Remove unless ported |
| "Project Init plugin's `library/guides/...`" | `permissions-runbook.md` 20-24 and 203-204 | V2 plugin path |
| `handoff` skill | `offer-context-handoff.md` | Keep (ported with session skills) |

---

## 11. Open questions for Mike (decisions that are his)

1. Keep the fixed continuity paragraph ("Always execute work with the context
   in mind ...") at the top of every `AGENTS.md` in V2?
2. Current focus at session start: the briefing hook (recommended; works in
   worktrees, in Codex, and with Notion and Hindsight memory) or `@` imports in
   `AGENTS.md` (Claude only, main checkout only, built-in memory only)?
3. Add a project-wide `DECISIONS.md` in the repository, or keep project
   decisions in the chosen memory system?
4. Add the `waiting_on` field and a "waiting on the owner" list to the briefing?
5. Design home for GitHub Issues and Jira: the model forbids `docs/designs/`,
   but these trackers have no natural subpage for a long `DESIGN.md`. Options: a
   file in the repo named by work-item ID, an issue comment, or an attachment.
6. `SOUL.md`: create an empty one in every project, or only when asked?
7. Templates: keep the `*-template/` folders spread through the project tree (as
   curated), or keep all templates inside the toolkit and let skills create real
   files on demand? (Spread templates drift from the toolkit and can be mistaken
   for real records.)
8. Cut `docs/toolkit-manual.md` from projects?
9. New projects start memory in onboarding mode (every lasting save needs an
   approval card). Keep that, or start in trusted mode since the agent is meant
   to run the project?
10. System Guide: the plugin is not in the port list. Drop
    `docs/system-guide/` and the `AGENTS.md` line?
11. Salesforce data loads: a `LOAD-RECORD.md` / `BACKUP-RECORD.md` beside the
    data files (templates exist), or details only in the work item (the rule
    says this)?
12. Drop support for the older `engagement/` folder name, since V2 init only
    creates new projects?
13. Glossary: tracked in Git (`docs/glossary.md`) or kept in Git-ignored memory?
14. With Hindsight memory, where does the current focus note live (Hindsight is
    a recall store, not a document store)?
15. Naming: the work item's internal phases (`P1`) and the roadmap's phases
    (`P01`) share a name. Rename the work-item level (for example
    "milestones")?

## 12. Open questions for the architect (verify before building)

- Codex hooks: capture Codex's hooks documentation and confirm
  `.codex/hooks.json` field names (`commandWindows`, `additionalContextLimit`,
  `statusMessage`), the context size limit, and whether project hooks need
  trust approval.
- Codex skills: confirm Codex reads project skills from `.agents/skills/` and
  whether a Codex plugin can supply them instead of copies.
- Whether Claude Code re-injects a directly read `AGENTS.md` after `/compact`
  (the captured page states it only for project-root `CLAUDE.md`). Test in a
  sample run; the briefing hook's `compact` matcher is the safety net.
- Whether Claude Code loads a nested `AGENTS.md` inside a Git-ignored folder
  such as `.memory/`.
- How a `SessionStart` `systemMessage` renders in the Claude Code interface and
  the desktop app (documented as a "Warning message shown to the user").
- Ship `scripts/memory.py`, `tools/kb/`, and `tools/permissions/` inside
  plugins (called by path) or copy them into each project? Copies need a sync
  and a doctor comparison; plugin copies need both hosts to reach the plugin
  folder.
- Memory writes from a worktree: `memory.py` must resolve the main checkout's
  `.memory/` (`git rev-parse --git-common-dir`), the same way the local tracker
  already shares one `.work-items/` across worktrees.

## 13. Proposed scaffold after review

General project (every project):

```text
<project>/
  AGENTS.md                 generated by init from the template in 6.2
  README.md                 short, for humans
  PROJECT.md                identity, scope, systems, people, resources
  PROJECT-ROADMAP.md        outcome and phases; units reference work-item IDs
  DECISIONS.md              new; project-wide decision log
  SOUL.md                   only when the owner asks for one
  .toolkit.json             new; every setup choice
  .gitignore                general lines
  .claude/
    settings.json           general part (+ SF part when SF)
    rules/                  general rules (+ work-item-folders.md for local tracker)
    hooks/                  briefing hook (+ memory_trigger.py, _memory_patterns.py for built-in memory)
    agents/memory-curator.md   built-in memory only
    output-styles/plain-english.md
  .codex/hooks.json         briefing hook for Codex
  requirements/
    AGENTS.md
    AREA-TEMPLATE.md
    SYSTEM-DATA-MODEL.md
  ai-external-knowledge/
    INDEX.md                generated
    topic-template/PAGE-TEMPLATE.md, CAPTURE-RECORD-TEMPLATE.md
  scripts/memory.py         built-in memory only, unless shipped in a plugin
  tests/                    the project's own tests only
Created later, not copied:
  .memory/                  built-in memory; Git-ignored; created by init from toolkit templates
  .work-items/              local tracker; Git-ignored; created by the tracker skill; DASHBOARD.md generated
```

Salesforce overlay (added when the project is Salesforce): everything in
section 9, with the fixes in 5.9 and 5.10.

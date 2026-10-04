# Model project inventory

Research brief for Toolkit V2. Read on 2026-09-26.

- **What was read:** every file in `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project` except the generated `.sfdx/` folder and `__pycache__/` folders; `tools/kb/` and `tools/permissions/` are summarized per script. Also read: `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-context/TEMPLATE-SOURCE-REVIEW.md`, the folders `codex-second-brain-v2-handoff/` and `davis-memory-system-package/` (skimmed), GitHub issue 419 body (`gh issue view 419 --repo Mar5929/claude-toolkit`), and `toolkit-v2/dev/GOAL.md`.
- **Nothing was changed** in the model project, the model context folder, or `claude-toolkit`. The only commands run against the model were read-only: `python3 scripts/memory.py doctor` (run from `/tmp`; it only reads) and `node .claude/hooks/toolkit-session-start.mjs` (only reads).
- **The model is not a Git repository.** `git status` there returns "not a git repository". File dates below come from the file system.
- Section 12 holds the full text of the files the task asked to quote. Section 13 holds the full text of the memory seed files, because the memory system is ported.

---

## 1. What the model is, in plain words

The model project is a hand-curated example of what a brand-new **Salesforce** project should look like after Toolkit setup. Mike built it in issue 419 (`Mar5929/claude-toolkit`) as a blueprint: every folder shows its shape, and every file is a template with section headings and `<angle-bracket>` fill-in prompts. It contains no fictional project facts and no fake approvals.

It has five layers:

1. **Project records** (root `AGENTS.md`, `README.md`, `PROJECT.md`, `PROJECT-ROADMAP.md`, `SOUL.md`, `requirements/`, `docs/`, `ai-external-knowledge/`, `delivery/`).
2. **Work tracking** (`.work-items/work-item-template/WORK-ITEM.md` and `DESIGN.md`). This is the **only folder Mike has formally approved** (2026-09-25).
3. **Memory** ("Second Brain V2" prototype): `.memory/`, `.toolkit-memory.json`, `scripts/memory.py`, `tests/test_memory_runtime.py`, `.claude/agents/memory-curator.md`, `.claude/rules/memory-curator-dispatch.md`, and three Python hooks.
4. **Agent host wiring**: `.claude/settings.json`, `.claude/RULES.md`, 18 rules in `.claude/rules/`, the Plain English output style, a SessionStart orientation hook, `.codex/hooks.json`, and Salesforce skills copied to both `.claude/skills/` and `.agents/skills/`.
5. **Salesforce kit**: `sfdx-project.json`, `.forceignore`, empty `force-app/`, two guard hooks, `.claude/protected-orgs.json`, `docs/permissions-runbook.md`, `tools/permissions/`, `tools/kb/`, and the Salesforce parts of `delivery/`.

The model still carries four `CLAUDE.md` files. `GOAL.md` now says **`AGENTS.md` only, no `CLAUDE.md`**, so the reviewed scaffold must drop them and rewire everything that depends on them (section 10, item 1).

## 2. Counts at a glance

- 136 files, excluding `.sfdx/`, `.git`, and `__pycache__/`. 40 of them are in `tools/kb/` (39 Python files and its README).
- Three empty folders: `force-app/`, `delivery/deliverables/`, `delivery/meeting-notes/`. Git does not store empty folders, so an installer that copies from a Git repository loses them unless it creates them itself.
- Instruction files: 4 `AGENTS.md` (root, `requirements/`, `docs/`, `.memory/`) and 4 `CLAUDE.md` (the same four places).
- README files: only the root `README.md`, plus two tool operating manuals (`tools/kb/README.md`, `tools/permissions/README.md`). Mike chose this lean pattern on 2026-09-25.
- Rules: 18 files in `.claude/rules/`. 6 are path-scoped (they have a `paths:` frontmatter list). 12 load at every session start.
- Skills: 3 Salesforce skills (`sf-component-tracker`, `sf-data-change`, `sf-deploy-check`). Each exists twice, byte-identical, under `.claude/skills/` and `.agents/skills/`.
- Hooks registered in Claude settings: 6 commands across 4 events. Codex: 1 command on 1 event.
- Newest files: `requirements/SYSTEM-DATA-MODEL.md` (2026-09-26 10:59:45), `requirements/AREA-TEMPLATE.md` (10:59:42), root `AGENTS.md` (10:59:17), `README.md` (10:56:38).

## 3. Full folder tree

```text
toolkit-v2-model-project/
├── .agents/
│   └── skills/
│       ├── sf-component-tracker/
│       │   └── SKILL.md
│       ├── sf-data-change/
│       │   └── SKILL.md
│       └── sf-deploy-check/
│           └── SKILL.md
├── .claude/
│   ├── agents/
│   │   └── memory-curator.md
│   ├── hooks/
│   │   ├── _memory_patterns.py
│   │   ├── guard-permission-set-deploy.js
│   │   ├── guard-protected-orgs.js
│   │   ├── memory_audit.py
│   │   ├── memory_trigger.py
│   │   └── toolkit-session-start.mjs
│   ├── output-styles/
│   │   └── plain-english.md
│   ├── protected-orgs.json
│   ├── rules/
│   │   ├── ai-external-knowledge.md
│   │   ├── component-tracker.md
│   │   ├── data-change-handoff.md
│   │   ├── delivery-and-knowledge-boundary.md
│   │   ├── dependency-graph.md
│   │   ├── deploy-hitchhiker-check.md
│   │   ├── deployment-runbook.md
│   │   ├── humanize-outbound-text.md
│   │   ├── knowledge-direct-commit.md
│   │   ├── memory-curator-dispatch.md
│   │   ├── offer-context-handoff.md
│   │   ├── parallel-agent-sessions.md
│   │   ├── permissions-source-control.md
│   │   ├── plain-english-artifacts.md
│   │   ├── production-data.md
│   │   ├── salesforce-change-clarify.md
│   │   ├── salesforce-safety-guardrails.md
│   │   └── work-item-stages.md
│   ├── RULES.md
│   ├── settings.json
│   └── skills/
│       ├── sf-component-tracker/
│       │   └── SKILL.md
│       ├── sf-data-change/
│       │   └── SKILL.md
│       └── sf-deploy-check/
│           └── SKILL.md
├── .codex/
│   └── hooks.json
├── .forceignore
├── .gitignore
├── .memory/
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── CURRENT_FOCUS.md
│   ├── memory-criteria.md
│   ├── MEMORY.md
│   ├── project_topic_template.md
│   └── terminology-glossary.md
├── .sfdx/   (generated by Salesforce VS Code tools; Git-ignored; contents not listed)
├── .toolkit-memory.json
├── .vscode/
│   └── settings.json
├── .work-items/
│   └── work-item-template/
│       ├── DESIGN.md
│       └── WORK-ITEM.md
├── AGENTS.md
├── ai-external-knowledge/
│   ├── INDEX.md
│   └── topic-template/
│       ├── PAGE-TEMPLATE.md
│       └── SOURCE-RECORD-TEMPLATE.md
├── CLAUDE.md
├── delivery/
│   ├── archive/
│   │   └── item-template/
│   │       └── ARCHIVE-RECORD-TEMPLATE.md
│   ├── communications/
│   │   └── message-template/
│   │       └── MESSAGE-TEMPLATE.md
│   ├── data/
│   │   ├── area-template/
│   │   │   ├── DATA-AREA-TEMPLATE.md
│   │   │   ├── FIELD-MAPPING-TEMPLATE.md
│   │   │   └── TRANSFORMATION-RULES-TEMPLATE.md
│   │   ├── data-loads/
│   │   │   ├── .gitignore
│   │   │   └── load-template/
│   │   │       └── LOAD-RECORD-TEMPLATE.md
│   │   └── production-backups/
│   │       ├── .gitignore
│   │       └── backup-template/
│   │           └── BACKUP-RECORD-TEMPLATE.md
│   ├── deliverables/   (empty folder)
│   ├── deployment/
│   │   ├── _master/
│   │   │   ├── MANUAL-STEPS-TEMPLATE.md
│   │   │   ├── MASTER-DEPLOYMENT-TEMPLATE.md
│   │   │   └── PACKAGE-XML-TEMPLATE.md
│   │   ├── component-tracker.csv
│   │   ├── release-template/
│   │   │   ├── CUTOVER-PLAN-TEMPLATE.md
│   │   │   └── RELEASE-NOTES-TEMPLATE.md
│   │   └── work-item-template/
│   │       ├── DEPLOYMENT-RECORD-TEMPLATE.md
│   │       ├── DESTRUCTIVE-CHANGES-TEMPLATE.md
│   │       ├── MANUAL-STEPS-TEMPLATE.md
│   │       └── PACKAGE-XML-TEMPLATE.md
│   ├── meeting-notes/   (empty folder)
│   ├── project-overview/
│   │   └── brief-template/
│   │       ├── BRIEF-TEMPLATE.md
│   │       └── SOURCE-RECORD-TEMPLATE.md
│   └── references/
│       └── source-template/
│           ├── SOURCE-NOTES-TEMPLATE.md
│           └── SOURCE-RECORD-TEMPLATE.md
├── docs/
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── permissions-runbook.md
│   ├── system-guide/
│   │   └── AREA-TEMPLATE.md
│   └── toolkit-manual.md
├── force-app/   (empty folder)
├── PROJECT-ROADMAP.md
├── PROJECT.md
├── README.md
├── requirements/
│   ├── AGENTS.md
│   ├── AREA-TEMPLATE.md
│   ├── CLAUDE.md
│   └── SYSTEM-DATA-MODEL.md
├── scripts/
│   └── memory.py
├── sfdx-project.json
├── SOUL.md
├── tests/
│   ├── TEST-PLAN-TEMPLATE.md
│   └── test_memory_runtime.py
└── tools/
    ├── kb/
    │   ├── build_edges.py
    │   ├── build_org_catalog.py
    │   ├── classify_fields.py
    │   ├── compare_dependencies.py
    │   ├── diff_graph.py
    │   ├── edge_list.py
    │   ├── extract.py
    │   ├── extractors/
    │   │   ├── __init__.py
    │   │   ├── _kbpath.py
    │   │   ├── analytics.py
    │   │   ├── apex.py
    │   │   ├── automation.py
    │   │   ├── contracts.py
    │   │   ├── data.py
    │   │   ├── driver.py
    │   │   ├── flows.py
    │   │   ├── generic.py
    │   │   ├── interface.py
    │   │   ├── names.py
    │   │   ├── objects.py
    │   │   ├── security.py
    │   │   └── xmlutil.py
    │   ├── file_registry.py
    │   ├── graph.py
    │   ├── graph_freshness_hook.py
    │   ├── org_api.py
    │   ├── org_catalog.py
    │   ├── pull_org_dependencies.py
    │   ├── query_graph.py
    │   ├── README.md
    │   ├── reports.py
    │   ├── resolve.py
    │   ├── resolver.py
    │   ├── test_edge_list.py
    │   ├── test_extractors.py
    │   ├── test_file_registry.py
    │   ├── test_graph_tools.py
    │   ├── test_org_crosscheck.py
    │   ├── test_reports.py
    │   └── test_resolver.py
    └── permissions/
        ├── permsets.py
        └── README.md
```

Not shown: `tests/__pycache__/` and `tools/kb/__pycache__/` (Python byte-code, Git-ignored). `.sfdx/` holds `indexes/`, `tools/soqlMetadata/standardObjects/*.json`, and `typings/lwc/*.d.ts`, all generated by the Salesforce VS Code extension.

## 4. How the files point at each other

### 4.1 Session startup chain (as the model is wired today)

1. Claude Code reads root `CLAUDE.md`, which is exactly three lines: `@AGENTS.md`, `@.memory/MEMORY.md`, `@.memory/CURRENT_FOCUS.md`. So the root guide, the memory index, and the working-memory file are all loaded at every start.
2. Claude Code loads the 12 unscoped rules in `.claude/rules/` at start, and the 6 path-scoped rules when a matching file is read.
3. The `SessionStart` hook (`matcher: "startup|resume|clear|compact"`) runs `node "$CLAUDE_PROJECT_DIR/.claude/hooks/toolkit-session-start.mjs"`. It prints to stdout: the line `Toolkit orientation. Paths resolve from the project root.`, then the first 120 words of the `## Summary` section of `docs/toolkit-manual.md`, then warnings if the manual or root `AGENTS.md` is missing, if `CLAUDE.md` is not exactly the three import lines, or if `.memory/memory-criteria.md` is missing. It never writes. Real output today:
   > Toolkit orientation. Paths resolve from the project root.
   > Toolkit project. `AGENTS.md` names the tracker and routes each kind of information. Read `PROJECT.md`, the relevant roadmap phase, the active work item, and `.memory/CURRENT_FOCUS.md` before substantial work. ...
4. Codex reads root `AGENTS.md` natively. `.codex/hooks.json` runs the same orientation script at `SessionStart` with `additionalContextLimit: 1000`. Codex has no memory hooks in this model.
5. Root `AGENTS.md` tells every agent: read `.claude/rules` first; read `SOUL.md`, `PROJECT.md`, `.memory/CURRENT_FOCUS.md` at start and again after resume, clear, or compaction; before substantial work open the chosen work item, the `work` skill, and the relevant `PROJECT-ROADMAP.md` phase.

### 4.2 Who references whom (confirmed by text search)

| File | Referenced by |
| --- | --- |
| `AGENTS.md` (root) | all three scoped `CLAUDE.md`, root `CLAUDE.md`, `.memory/memory-criteria.md`, `.claude/agents/memory-curator.md`, `.claude/rules/memory-curator-dispatch.md`, `.claude/rules/dependency-graph.md`, `.claude/RULES.md`, `docs/toolkit-manual.md`, `README.md`, `toolkit-session-start.mjs`, `scripts/memory.py` |
| `CLAUDE.md` (root) | `toolkit-session-start.mjs` (checks exact content), `scripts/memory.py` (doctor checks imports), `tests/test_memory_runtime.py` (copies it), `.claude/rules/memory-curator-dispatch.md`, `docs/toolkit-manual.md`, `README.md` |
| `SOUL.md` | root `AGENTS.md` only |
| `PROJECT.md` | root `AGENTS.md`, `README.md`, `docs/toolkit-manual.md`, `.memory/memory-criteria.md`, `.claude/rules/knowledge-direct-commit.md` (path scope), `delivery/project-overview/brief-template/SOURCE-RECORD-TEMPLATE.md` |
| `PROJECT-ROADMAP.md` | root `AGENTS.md`, `README.md`, `PROJECT.md`, `.claude/rules/knowledge-direct-commit.md` (path scope) |
| `.work-items/work-item-template/WORK-ITEM.md` | `DESIGN.md` (link `[WORK-ITEM.md](WORK-ITEM.md)`); root `AGENTS.md`, `docs/AGENTS.md`, `docs/toolkit-manual.md`, `PROJECT-ROADMAP.md` name `WORK-ITEM.md` generically |
| `.work-items/work-item-template/DESIGN.md` | root `AGENTS.md`, `docs/AGENTS.md`, `docs/toolkit-manual.md`, `PROJECT.md`, `README.md` (all say "DESIGN.md beside WORK-ITEM.md") |
| `requirements/AGENTS.md` | root `AGENTS.md` ("read its `AGENTS.md` before editing"), `requirements/CLAUDE.md` |
| `requirements/AREA-TEMPLATE.md` | `requirements/AGENTS.md` ("following AREA-TEMPLATE.md") |
| `requirements/SYSTEM-DATA-MODEL.md` | **nothing** |
| `docs/AGENTS.md` | root `AGENTS.md`, `docs/CLAUDE.md` |
| `docs/toolkit-manual.md` | root `AGENTS.md`, `docs/AGENTS.md`, `toolkit-session-start.mjs` (reads its `## Summary`) |
| `docs/system-guide/AREA-TEMPLATE.md` | nothing by file name; `docs/AGENTS.md` says "Use `system-guide/`" and root `AGENTS.md` mentions `.system-guide.json` |
| `docs/permissions-runbook.md` | root `AGENTS.md`, `.claude/rules/permissions-source-control.md`, `tools/permissions/README.md` |
| `.memory/AGENTS.md` | root `AGENTS.md`, `.memory/CLAUDE.md`, `.claude/agents/memory-curator.md`, `.claude/rules/dependency-graph.md` |
| `.memory/CURRENT_FOCUS.md` | root `AGENTS.md`, root `CLAUDE.md`, `.memory/AGENTS.md`, `.memory/MEMORY.md`, `.memory/memory-criteria.md`, curator agent, dispatch rule, `offer-context-handoff.md`, `docs/toolkit-manual.md`, `README.md`, session-start hook, `scripts/memory.py` |
| `.memory/MEMORY.md` | root `AGENTS.md`, root `CLAUDE.md`, `.memory/AGENTS.md`, curator agent, `docs/toolkit-manual.md`, `README.md`, session-start hook (only inside its `CLAUDE.md` content check), `scripts/memory.py` (generates it), memory tests |
| `.memory/memory-criteria.md` | root `AGENTS.md`, `.memory/AGENTS.md`, `.memory/MEMORY.md`, curator agent, dispatch rule, `memory_trigger.py`, `offer-context-handoff.md`, session-start hook, `docs/toolkit-manual.md`, `README.md`, `scripts/memory.py`, memory tests |
| `.memory/project_topic_template.md` | `.memory/AGENTS.md`, curator agent, `scripts/memory.py` (doctor requires it) |
| `.memory/terminology-glossary.md` | `.memory/MEMORY.md`, curator agent, `scripts/memory.py` |
| `.toolkit-memory.json` | `PROJECT.md`, `README.md`, dispatch rule, `memory_trigger.py` (hook is off without it), `scripts/memory.py` (doctor), memory tests |
| `scripts/memory.py` | root `AGENTS.md`, `.memory/AGENTS.md`, `.memory/MEMORY.md`, `.memory/memory-criteria.md`, curator agent, dispatch rule, `docs/toolkit-manual.md`, `README.md`, memory tests |
| `.claude/agents/memory-curator.md` | dispatch rule, `README.md`, `memory_audit.py` (counts dispatches whose `subagent_type` ends with `memory-curator`) |
| `.claude/rules/memory-curator-dispatch.md` | `.memory/AGENTS.md`, `memory_trigger.py` (reminder text), `.claude/RULES.md`, `README.md` |
| `.claude/hooks/toolkit-session-start.mjs` | `.claude/settings.json`, `.codex/hooks.json` |
| `.claude/hooks/memory_trigger.py`, `memory_audit.py`, `_memory_patterns.py` | `.claude/settings.json` (first two), `tests/test_memory_runtime.py` (all three) |
| `.claude/hooks/guard-protected-orgs.js` | `.claude/settings.json`, `salesforce-safety-guardrails.md` |
| `.claude/hooks/guard-permission-set-deploy.js` | `.claude/settings.json`, `permissions-source-control.md`, `docs/permissions-runbook.md`, `tools/permissions/permsets.py` |
| `.claude/protected-orgs.json` | `guard-protected-orgs.js`, `salesforce-safety-guardrails.md` |
| `.claude/output-styles/plain-english.md` | `.claude/settings.json` (`"outputStyle": "Plain English"`), `plain-english-artifacts.md` ("Read the active style file") |
| `.claude/RULES.md` | `README.md` |
| `.claude/skills/sf-component-tracker/SKILL.md` | `component-tracker.md`, `deployment-runbook.md` |
| `.claude/skills/sf-data-change/SKILL.md` | `data-change-handoff.md`, `production-data.md` |
| `.claude/skills/sf-deploy-check/SKILL.md` | `deploy-hitchhiker-check.md`; root `AGENTS.md` tools table |
| `.agents/skills/*` | `README.md` ("copied under both `.claude/skills/` and `.agents/skills/`") |
| `.codex/hooks.json` | nothing |
| `ai-external-knowledge/INDEX.md` | `ai-external-knowledge.md` rule, `README.md` |
| `ai-external-knowledge/topic-template/PAGE-TEMPLATE.md` | `SOURCE-RECORD-TEMPLATE.md` in the same folder |
| `ai-external-knowledge/topic-template/SOURCE-RECORD-TEMPLATE.md` | `INDEX.md` (link) |
| `delivery/deployment/component-tracker.csv` | `sf-component-tracker` skill, `component-tracker.md` rule, `MASTER-DEPLOYMENT-TEMPLATE.md`, `PACKAGE-XML-TEMPLATE.md` (`_master/`) |
| `delivery/data/area-template/FIELD-MAPPING-TEMPLATE.md`, `TRANSFORMATION-RULES-TEMPLATE.md` | `DATA-AREA-TEMPLATE.md` |
| All other `delivery/**` templates | nothing by file name; root `AGENTS.md` routes `delivery/` by category |
| `tests/TEST-PLAN-TEMPLATE.md`, `tests/test_memory_runtime.py` | nothing |
| `tools/kb/README.md` | root `AGENTS.md`, `dependency-graph.md` rule, several `tools/kb/*.py` |
| `tools/kb/graph_freshness_hook.py` | `.claude/settings.json` (Stop hook), `tools/kb/README.md` |
| `tools/permissions/permsets.py` | root `AGENTS.md`, `permissions-source-control.md`, `salesforce-safety-guardrails.md`, `docs/permissions-runbook.md`, `tools/permissions/README.md`, `guard-permission-set-deploy.js` |
| `sfdx-project.json` | `tools/kb/*.py`, `tools/kb/README.md`, `permsets.py`, `permissions-source-control.md`, `docs/permissions-runbook.md` |
| `.forceignore` | `tools/kb/file_registry.py` |

### 4.3 Names the model uses that live outside the model

These are Toolkit plugins or skills the model assumes are installed. Toolkit V2 must supply each one, rename it, or remove the reference.

| Name used | Where | What it is in the current Toolkit |
| --- | --- | --- |
| `work` skill and its `references/lifecycle.md` | root `AGENTS.md`, `work-item-stages.md` | Work Tracker plugin. `lifecycle.md` holds the 14 stages `01-discovery` ... `14-spec-update`. |
| `publish-docs` skill | root `AGENTS.md`, `knowledge-direct-commit.md`, `parallel-agent-sessions.md` | git-workflows plugin |
| `handoff` skill | `offer-context-handoff.md` | session-skills plugin |
| `humanizer` skill, fallback `unslop` | `humanize-outbound-text.md` | `humanizer` is not in the Toolkit; `unslop` is in session-skills |
| `system-guide` skill, `.system-guide.json` | root `AGENTS.md` | System Guide plugin (not in GOAL.md's port list) |
| `second-brain@claude-toolkit` | `.claude/settings.json` (`enabledPlugins` set to `false`) | V1 Second Brain plugin, disabled for this project |
| Project Init `library/guides/salesforce-permissions-research.md` and `...-retrieval.md` | `docs/permissions-runbook.md` | project-init plugin library |
| `guides/salesforce-dependency-graph.md`, `rules/salesforce/dependency-graph.md` | `tools/kb/README.md` | project-init plugin library paths |

The 14 lifecycle stages and their statuses, from `claude-toolkit/plugins/work-tracker/skills/work/references/lifecycle.md` lines 122 to 135: `01-discovery` (Backlog), `02-refinement` (Backlog), `03-requirements-approved` (Ready), `04-solution-design`, `05-breakdown`, `06-implementation-plan`, `07-tracking-setup`, `08-build`, `09-testing`, `10-bug-fixing`, `11-user-approval` (all In Progress), `12-pr-and-push`, `13-deployment`, `14-spec-update` (all In Review).

---

## 5. Decisions already made about the model

Sources, newest authority first: `toolkit-v2/dev/GOAL.md` (Mike, 2026-09-26); issue 419 body (requirements 1 to 31, Recent History, approval ledger); `TEMPLATE-SOURCE-REVIEW.md` (2026-09-25). Where a later decision replaces an earlier one, the earlier one is marked **superseded**.

### 5.1 Decisions from GOAL.md (2026-09-26) that change the model

- **G1. `AGENTS.md` only, never `CLAUDE.md`.** Claude Code 2.1.277 and later read `AGENTS.md` natively (captured docs `memory.md`, section "AGENTS.md"). This supersedes issue 419 requirement 26's one-line `CLAUDE.md` adapters and the root `CLAUDE.md` memory imports.
- **G2. Project init copies the model scaffold except `.work-items/` and `.memory/`**, then interviews for: work tracker (local folders, Notion, GitHub Issues, Jira), memory (built-in `.memory/`, local Hindsight, Notion), and Salesforce or not. It then writes `AGENTS.md` and rule files to match.
- **G3. Salesforce pieces install only for Salesforce projects.**
- **G4. No README in every folder.** Follow Claude Code and Codex practice: hooks set up the documented way, rules path-scoped where that fits.
- **G5. Work items everywhere use the same stages, lifecycle, `WORK-ITEM.md` body, and `DESIGN.md`.** Nesting and sub-items are allowed. When Mike moves or renames work-item files or folders, the agent detects it and adapts.
- **G6. Port the model's memory system**, with a review for improvements.
- **G7. The model folder itself stays unchanged.** The reviewed version goes into the new repo's scaffold; findings go in `dev/archive/model/model-review.md`.
- **G8. Review lens:** a solo "vibe coder" where the agent runs the project and the human only decides and steers.

### 5.2 Decisions recorded in issue 419 (Mike, 2026-09-25 and 2026-09-26)

Scaffold shape:

- **D1. No `brainstorms/` folder** (req 13, 2026-09-25).
- **D2. Copyable seed-project approach** (req 14, 27, 2026-09-25): every file shows its complete section layout and fill-in guidance; no invented project facts; no fake approval states. Setup may interview the owner and adapt or remove unselected parts.
- **D3. Generic template names** such as `AREA-TEMPLATE.md` and `DESIGN-TEMPLATE.md`; the local work-item example sits in a folder named `work-item-template`, not `_template` and not a realistic ticket name (req 15).
- **D4. One root `PROJECT-ROADMAP.md`**, not a roadmap folder. Hierarchy: phase, then deliverable-sized work unit, then linked work item. The linked work item holds active requirements, open questions, detailed tasks, and execution history (req 11, 16). How the roadmap links to each tracker is still open (P1-T11).
- **D5. Keep handoff and research packages out of the seed** (req 17).
- **D6. `.work-items/` folder finalized and approved** on 2026-09-25 (req 24, P1-T08): `.work-items/work-item-template/` holding `WORK-ITEM.md` and `DESIGN.md`. This is the only approved folder. The approval is for the template, not proof that the live Work Tracker parser supports it.
- **D7. `WORK-ITEM.md` format approved** (req 22, 2026-09-25): YAML front matter; Overview; Roadmap; phase-linked Tasks; Recent History; Open Questions above Requirements; Requirements with Starting request, Agreed goal, explicit Active requirements, and Acceptance; then bottom Notes with "Solution options and considerations" last. Each active requirement has a stable ID, a status (Refining, Finalized, or Superseded), applicability, required behavior, boundaries, acceptance check, decision record, and linked open questions. Finalized needs recorded owner approval. External tracker native fields stay authoritative.
- **D8. `DESIGN.md` follows the current Toolkit solution-design template** (req 23, 2026-09-25): one design linked to its `WORK-ITEM.md`; explicit proposed/approved status; preparation in the design; one section per option with requirement-by-requirement coverage and build order; Notes last; Recommendation only for several options; replacement analysis only for an existing build.
- **D9. One design home: inside the work item** (req 29, 2026-09-26). Local item: `DESIGN.md` beside `WORK-ITEM.md`. External item: the design lives in that item's own record or attachments. Never install or route to `docs/designs/`. Keep the design with the item after delivery.
- **D10. Lean instruction and README pattern** (req 26, 2026-09-25): keep only the root `README.md` for people; root `AGENTS.md` for project-wide routing; scoped `AGENTS.md` only in `.memory/`, `requirements/`, and `docs/`. Do not add a README just because a folder exists. Move index, provenance, archive, deployment, and other metadata into clearly named template files. Do not create empty `.claude/`, `.codex/`, `manifest/`, or `scripts/` placeholders before those options are configured. The one-line `CLAUDE.md` part is **superseded by G1**.
- **D11. Root `AGENTS.md` is the candidate installed template** (req 30, 2026-09-26): copyable, stable sections and exact routing text; only project facts are fill-in fields. Project Init interviews, fills fields, removes unselected options, and installs it. Its exact wording is **not yet approved** (P1-T12 open).
- **D12. `delivery/` uses the current Toolkit Salesforce client-work categories** (req 18): one folder per real item or event; data areas are an area folder of files; an existing project keeps its established root such as `engagement/`.
- **D13. Removed seed folders** (req 28, 2026-09-26): the delivery architecture area, the meeting-note seed, the deliverable seed, the backup-record seed, and the load-record seed. Keep the parent folders `meeting-notes/`, `deliverables/`, `production-backups/`, `data-loads/`. Create real item or event folders only when needed. Do not require an event README. Client-provided architecture goes to `delivery/references/`; active designs go in the work item; backup and load operator details go in the chosen work item and the owner handoff. **Conflict on disk:** `delivery/data/data-loads/load-template/LOAD-RECORD-TEMPLATE.md` and `delivery/data/production-backups/backup-template/BACKUP-RECORD-TEMPLATE.md` still exist (last modified 2026-09-25 16:44, before the removal). See section 10, item 6.
- **D14. `ai-external-knowledge/`** (req 19): one folder per outside documentation topic; each topic folder has a source record (`SOURCE-RECORD-TEMPLATE.md`: source URL, capture date, coverage, links to captured pages); root `INDEX.md` points to topic folders; no README inside topic folders; client-provided material goes to `delivery/references/`.

Memory:

- **D15. Memory lives in an untracked (Git-ignored) `.memory/` folder** (req 8, 2026-09-25), chosen over Git-tracked files or a per-project choice. GOAL.md now makes this the "built-in" option beside local Hindsight and Notion.
- **D16. Davis-style flat layout** (req 2, 20): `MEMORY.md` index, `CURRENT_FOCUS.md`, and one topic per file with descriptive YAML. Generalize Davis; do not copy Davis content or defects. The final schema and write authority were still open in 419.
- **D17. Topic types `user`, `feedback`, `project`, `reference`, plus `event`** (Mike asked for `event_` filenames; issue 419 approval ledger note).
- **D18. Onboarding, then explicit trusted mode** (2026-09-25 history): during onboarding the agent shows a proposal card in the conversation and waits for approval; only the owner's explicit grant switches to trusted mode; no proposal inbox; a background curator writes; typed filenames and YAML.
- **D19. Glossary is important** and the curator may maintain it (req 4).
- **D20. The curator can archive, delete, consolidate, merge, and deduplicate**; the exact conditions and approvals were still open (req 9).
- **D21. Working view contents** (req 10): current focuses, tasks to complete, owner-mentioned to-dos, upcoming milestones, and other things to be aware of. Its boundary with the tracker was open.
- **D22. Keep V1 concepts**: provenance, corrections, supersession, lifecycle rules that stop stale information (req 3).

Still open in issue 419 (not decisions): requirements area as file or folder (P1-T05); System Guide area as file or folder, and its boundary with designs and client architecture (P1-T06); final memory schema, authority, backup and sync (P1-T07, P2); roadmap-to-tracker routing (P1-T11); root `AGENTS.md` wording (P1-T12); whether the permission-set and dependency-graph kits are optional; how init materializes a real `package.xml`; Salesforce source shape (`force-app/main/default`, `.forceignore`, `sourceApiVersion`); host loading of scoped guides. Issue 419's seven interview questions: curator autonomy; smallest topic schema; startup versus on-demand reading; minimum Toolkit changes for a first V2 trial; evidence needed to trust V2; roadmap-to-tracker relation; `.memory/` across several computers.

### 5.3 Decisions and priorities from TEMPLATE-SOURCE-REVIEW.md (2026-09-25)

- Source priority: (1) Mike's direct decisions; (2) current `claude-toolkit` behavior and scaffold rules; (3) the later Second Brain V2 handoff plan; (4) older local and homegrown plans, background only; (5) the Davis package as a working memory example, not a universal scaffold.
- Mike chose the flat Davis layout over the V2 plan's `long-term/` category folders with `index.md` and `current.md`.
- Mike wants one folder per client artifact item (instead of one file per meeting in the current scaffold).
- Host configuration folders are created only when a selected integration needs them.
- **Stale parts of this note:** it still lists `docs/designs/DESIGN-TEMPLATE.md`, `delivery/finalized-architecture-and-requirements/area-template/ARCHITECTURE-TEMPLATE.md`, and `.memory/TOPIC-TEMPLATE.md`. None of these exist now. D9 and D13 removed the first two; the topic template is now `.memory/project_topic_template.md`.

### 5.4 Background from the other context folders (not decisions)

- `codex-second-brain-v2-handoff/` (dated 2026-09-24): planning for a separate `plugins/second-brain-v2/` with skills `sb2-setup`, `sb2-find`, `sb2-save`, `sb2-review`; a `.memory/` layout with `current.md`, `index.md`, `long-term/{decisions,facts,lessons,insights,people,events}/`, `archive/`, `.runtime/`, `.obsidian/`; no proposal inbox; onboarding until explicit trust; a librarian agent; root `AGENTS.md` under about 200 lines; root `PROJECT.md`, `PROJECT-ROADMAP.md`, `requirements/`. Its `long-term/` folders and `docs/designs/` were **not** adopted by the model. Its design philosophy matches the model: "goals for judgment, templates for consistency, code for mechanical safety".
- `davis-memory-system-package/` (2026-09-25): spec (`IMPLEMENTATION-SPEC.md`, components C1 to C14) and Davis source copies for a flat memory folder, `CURRENT_FOCUS.md`, a background curator subagent, a `UserPromptSubmit` trigger hook, a `Stop` audit hook, and a dispatch rule. The model's memory prototype was rebuilt from this spec. The spec recommends Node hooks over Python (Windows `py -3` issue) and suggests `autoMemoryDirectory` instead of a junction; the model instead turns auto-memory off (`"autoMemoryEnabled": false`). Its acceptance tests (section 8) are a useful checklist: trigger fires on "From now on, never run X."; correction updates the existing file; focus stays under the line cap; hook errors never block; doctor flags broken includes and orphan index lines; two parallel curator dispatches both land. Do not copy `source/`; it names a real client.

---

## 6. File-by-file inventory

Kinds used below: **template** (a seed to be filled in), **instruction** (read by agents as guidance), **rule** (a `.claude/rules/` file), **skill**, **agent**, **hook**, **config**, **code**, **data**.

### 6.1 Root files

| Path | Kind | Purpose | Headings and fill-in guidance | Referenced by |
| --- | --- | --- | --- | --- |
| `AGENTS.md` | instruction (installed template) | Project-wide agent router. 70 lines. Full text in 12.1. | Preamble paragraph about session continuity; `# <Project name>: agent guide`; `## Startup`; `## Path-scoped rules` (table: Paths, Rule); `## Project map` (table: Place, What it holds and when to open it); `## Tools` (table: Need, Route); `## Quick saves` (table: Record, Route); `## Where work is tracked`. Fill-ins: `<Project name>`, `<One sentence describing this Salesforce project and its outcome.>`, `<external tracker>`, `<Verified project commands and target org; do not infer from this template.>`, `<External service/project and link, or local .work-items/>`, `<Chosen tracker's requirements approval route.>` | see 4.2 |
| `CLAUDE.md` | instruction (Claude adapter) | Loads root `AGENTS.md`, the memory index, and current focus into Claude at start. Full text in 12.2. **Conflicts with G1.** | Three `@` import lines | see 4.2 |
| `README.md` | instruction for people (template plus model notes) | Human onboarding page. 65 lines. Mixes installable template text with notes that only make sense in the model (issue #419 links, "The source Project Init package still describes V1 ..."). | `# <Project name>`; intro; `## Purpose` (`<Describe the business problem, intended users, and outcome in one or two paragraphs.>`); `## Start here` (3 numbered fill-ins: access and tools, correct Salesforce org, project checks); `## Project map` (table Need, Location); `## Toolkit setup` (Work tracker, Memory system, System Guide, Agent hosts, Delivery artifact root, Outside documentation); `## Memory setup in a copied project` (5 numbered steps: fill `CURRENT_FOCUS.md` and glossary, keep `MEMORY.md` empty; keep criteria in onboarding mode; configure backup with `python3 scripts/memory.py backup --to <path>` and `restore-backup --from <path>`; trust `.claude/settings.json`, curator, and `CLAUDE.md` imports; run `doctor`); `## Project Init package in this model` (model-only notes); `## Project checks and release` (Local validation, Deployment process, Environments) | nothing (it is the entry page) |
| `SOUL.md` | template (optional) | Owner-written working style for the agent. | `# <Owner-defined working style>`; note "Optional seed template. The owner writes or approves this file; do not infer a personal style from an empty template."; `## Role`, `## Communication`, `## Judgment and initiative`, `## Boundaries`, each one backticked `<...>` prompt | root `AGENTS.md` |
| `PROJECT.md` | template | Stable project identity. Full text in 12.3. | Purpose and intended outcome; Scope and boundaries; Systems and environments (table System or org, Purpose, Environment, Source of truth, Access notes); People and ownership (table Role, Person or team, Responsibility, Source / last confirmed); Work and project records (tracker, roadmap, requirements, design home, System Guide, local memory, memory backup); Resources and project paths; Operating conventions | see 4.2 |
| `PROJECT-ROADMAP.md` | template | Phases and deliverable-sized work units, each linked to its work item. Full text in 12.4. | Tree diagram; Project outcome; Phase overview table (Phase, Intended outcome, Exit condition, Depends on); `## P01 — <Phase name>` (Outcome, Exit condition, Dependencies); `### P01-U01 — <Deliverable-sized work unit>` (Deliverable, Done when, Depends on, Linked work item); Open project-level planning questions; Planning changes | see 4.2 |
| `.gitignore` | config | Ignores memory, local work items, Salesforce and tool output. | Lines: `.memory/`, `/.work-items/`, `.sfdx/`, `.sf/`, `.localdevserver/`, `.claude/worktrees/`, `*.log`, `__pycache__/`, `.claude/.permset-preflight/`, `tools/kb/out/`, `tools/kb/_freshness_stamp.json`, `tools/kb/_drift_pending.md`, `tools/kb/_prev-*.json`, `*.pyc` | 6 files mention `.gitignore` generally |
| `.toolkit-memory.json` | config | Declares which memory system the project uses. | `{"schema": 2, "memory": "second-brain-v2", "location": ".memory", "activeWriter": "memory-curator"}` | see 4.2 |
| `sfdx-project.json` | config (Salesforce) | Salesforce DX project file. | `{"packageDirectories": [{"path": "force-app", "default": true}], "namespace": ""}`. **No `sourceApiVersion`**, although `permissions-source-control.md` says to keep it equal to the org version. | `tools/kb`, `permsets.py`, permissions rule and runbook |
| `.forceignore` | config (Salesforce) | Files the Salesforce CLI skips. | Two lines: `**/jsconfig.json`, `**/.eslintrc.json` | `tools/kb/file_registry.py` |
| `.vscode/settings.json` | config (Salesforce editor) | `{"xml.preferences.showSchemaDocumentationType": "none"}` | one key | nothing |
| `force-app/` | folder (Salesforce) | Salesforce source root. Empty. | none | `sfdx-project.json` and Salesforce rules |

### 6.2 `.work-items/` (approved by Mike 2026-09-25; Git-ignored; not copied by init per G2)

| Path | Kind | Purpose | Headings | Referenced by |
| --- | --- | --- | --- | --- |
| `.work-items/work-item-template/WORK-ITEM.md` | template | The one record for a work item: status, plan, tasks, history, questions, requirements, notes. 128 lines. Full text in 12.5. | Front matter keys: `id` (`WI-001`), `title`, `type`, `status` (`<Backlog \| In Progress \| Blocked \| Done>`), `stage`, `active_phase` (`P1`), `requirements_status` (`refining`), `design`. Body: `# WI-001: <Work item title>`; `## Overview` (Goal, Current position, Next action, Blockers, Related items); `## Roadmap` (table Phase, Outcome, Status, Exit result); `## Tasks` (`### P1 — <Phase 1 name>`, task lines `- [ ] **P1-T01 — <Task 1 name>** · In Progress` with Work, Deliverable, Done when, Depends on); `## Recent History` (table Date, Change or decision, Effect on the work); `## Open Questions` (table ID, Question, Affects, Status, Decision needed from); `## Requirements` (Overall status, Finalization rule; `### Starting request`; `### Agreed goal`; `### Active requirements` with `#### R-01 — <Required outcome>` fields Status, Applies to, Required behavior, Boundaries and exceptions, Acceptance check, Decision record, Open questions; `### Acceptance`); `## Notes` (`### Decisions and context`, `### Resume here`, `### Solution options and considerations`) | see 4.2 |
| `.work-items/work-item-template/DESIGN.md` | template | Solution design for one work item. 104 lines. Full text in 12.6. | Header lines Status (`proposed`), Requirements link, Date; `## What this solves`; `## What exists today`; `## Design philosophy`; `## Preparation` (Requirements readiness, Way of working, Team, Constraints); `## Option A: <Short name>` (`### Summary`, `### How each requirement is met` with `#### R-01` Build or reuse / Why this satisfies it / How to check it, `### What the person experiences, start to finish`, `### Components and files touched` table, `### Order of work`, `### Risks and tradeoffs`, `### Sources` table Claim / Source / Date / Label / Verified how); HTML comment on adding Option B, C; `## Where a builder could misread the requirements` table; `## Recommendation` (only for several options); `## Should the existing build be replaced?` (only for an existing build); `## Notes` (Decisions, Still open, Resume here) | see 4.2 |

### 6.3 `requirements/`

| Path | Kind | Purpose | Headings | Referenced by |
| --- | --- | --- | --- | --- |
| `requirements/AGENTS.md` | instruction (scoped) | Rules for the delivered-behavior baseline: one file per business area; work item owns proposed changes. Full text in 12.7. | one paragraph | root `AGENTS.md`, `requirements/CLAUDE.md` |
| `requirements/CLAUDE.md` | instruction (Claude adapter) | `@AGENTS.md`. **Conflicts with G1.** | one line | nothing else |
| `requirements/AREA-TEMPLATE.md` | template | One functional area's accepted behavior. Full text in 12.8. | `# <Functional area>`; Purpose and scope; Functional behavior (`### <Stable rule ID> — <Behavior or rule name>` with Trigger or context, Required behavior, Conditions and exceptions, User or system outcome, Source, Delivery status and evidence); Data and access rules; Integrations and dependencies; Acceptance evidence; Change history | `requirements/AGENTS.md` |
| `requirements/SYSTEM-DATA-MODEL.md` | template | A single living document for finalized data-model requirements. Full text in 12.9. Newest file in the model; not listed in issue 419's approval ledger; not mentioned by any other file. Uses a `[square-bracket]` prompt, unlike the `<angle-bracket>` prompts everywhere else. | `# System Data Model` and one bracketed line | nothing |

### 6.4 `docs/`

| Path | Kind | Purpose | Headings | Referenced by |
| --- | --- | --- | --- | --- |
| `docs/AGENTS.md` | instruction (scoped) | Keeps designs with their work items (never `docs/designs/`), System Guide in `system-guide/`, client architecture in `delivery/references/`, `toolkit-manual.md` for selected Toolkit systems only. Full text in 12.10. | one paragraph | root `AGENTS.md`, `docs/CLAUDE.md` |
| `docs/CLAUDE.md` | instruction (Claude adapter) | `@AGENTS.md`. **Conflicts with G1.** | one line | nothing else |
| `docs/toolkit-manual.md` | instruction (installed manual) | How the Toolkit is used in this project. The hook prints its `## Summary`. 46 lines. | `# Toolkit use in this project`; `## Summary` (the text the session hook prints); `## Selected systems` (table System, Selected form, Authority: Work tracker, Memory, System Guide, Agent hosts); `## Start and continue work` (4 steps); `## Complete and hand off work` (4 bullets: roadmap vs work item, requirements at delivery, current focus updates, memory review then `doctor`); `## Second Brain V2 operation` (3 paragraphs: Claude uses `CLAUDE.md` imports, curator, hooks; native auto-memory and V1 disabled; Codex has no hook equivalent; onboarding card flow; trusted mode; flat store, prefixes, `archive/`, what `scripts/memory.py` does); `## Project-specific setup` (fill-ins: tracker and design home, source checks and release path, memory backup/sync, host selection, local exceptions) | root `AGENTS.md`, `docs/AGENTS.md`, session hook |
| `docs/system-guide/AREA-TEMPLATE.md` | template (optional System Guide) | Evidence-based description of one area of the current system. | `# <System area>`; What this area does today; Components and paths (table Component, Role, Location or reference, Evidence); Data and flow; Operational behavior; Known gaps and uncertainty; Last verified (Date and environment, Sources, Maintainer) | indirectly by `docs/AGENTS.md` |
| `docs/permissions-runbook.md` | instruction (Salesforce, optional permission-set kit) | Operating runbook for permission sets in Git. 204 lines. Contains an HTML "TEMPLATE" comment telling setup to replace `<SANDBOX>` and `<PACKAGE_DIR>`, fill "Verified on this org", and delete the comment. | Scope; The two facts everything else follows from; Verified on this org; What the Salesforce CLI will NOT tell you; Procedure 1: bring a permission set into git (`permsets.py fetch`); Procedure 2: hand-edit (hand-editing rules: readable before editable, formula fields never editable, `readable` false revokes nothing, never `Activity.`, View All Fields, required fields never appear); Procedure 3: deploy to a sandbox (preflight, 30-minute receipt, API version pair, narrow deploy, never `--ignore-conflicts`, recalculate permission set groups, update component tracker); Known retrieve blind spots (`ManagePackageLicenses`, forcedotcom/cli issue 2578); What "complete" cannot mean; Structural recommendation; Related | root `AGENTS.md`, permissions rule, `tools/permissions/README.md` |

### 6.5 Memory system (built-in `.memory/` option)

All `.memory/` files are Git-ignored. Full text of every `.memory/` file, the curator agent, and the dispatch rule is in section 13.

| Path | Kind | Purpose and key content | Referenced by |
| --- | --- | --- | --- |
| `.memory/AGENTS.md` | instruction (scoped) | How to read, route, curate, and authorize memory. Headings: `# Local project memory`; `## Read and route`; `## Curate`; `## Authority and completion`. Key limits: `CURRENT_FOCUS.md` under 50 lines; index rebuilt by `scripts/memory.py reindex`; five prefixes; read back and run `doctor` before reporting success; curator never edits requirements, work-item status, designs, deployments, or code. | see 4.2 |
| `.memory/CLAUDE.md` | instruction (Claude adapter) | `@AGENTS.md`. **Conflicts with G1**, and `scripts/memory.py doctor` reports an ERROR if it is missing. | `scripts/memory.py` |
| `.memory/CURRENT_FOCUS.md` | template (working memory) | Headings (all nine are required by `scripts/memory.py`): Current focuses; Priorities and tasks to complete; Owner-mentioned to-dos and open loops; Upcoming milestones; Recent decisions ("Keep at most three"); Blockers and waiting on; Things to be aware of; Last 3 things touched; Next-session handoff. Plus `Last updated:` line. Max 50 lines. | see 4.2 |
| `.memory/MEMORY.md` | generated index | Written only by `scripts/memory.py`. Sections `## User`, `## Feedback`, `## Project`, `## Reference`, `## Event`, `## Other memory views` (links to current focus, criteria, glossary). One line per topic: `- [file.md](file.md) — description [status]`. Limits: 150 lines, 25,000 bytes, 150 characters per line. File mode is 0600 (written by `mkstemp`). | see 4.2 |
| `.memory/memory-criteria.md` | template (policy with state) | Front matter: `mode: onboarding`, `trusted_by`, `trusted_on`, `trusted_scope`, `backup_destination`, `backup_restore_tested_on` (all `none`). Headings: Memory criteria and trust; Default test for lasting memory (table Type and filename, Usually worth retaining, Route or reject instead); Working context is different; Never save as lasting memory; Onboarding: review each lasting change; Trusted mode: routine curation; Backup and recovery; Learned selection guidance (table). | see 4.2 |
| `.memory/project_topic_template.md` | template (topic example) | Front matter: `name`, `description`, `metadata.type`, `status: template`, `source`, `last_verified`, `authorization`, `supersedes`. Body: `# <Topic title>`, **Remember**, **Why**, **How to apply**, **Evidence and limits**, **Related**, and an HTML comment on renaming to `<type>_<topic>.md`. | `.memory/AGENTS.md`, curator, `scripts/memory.py` (doctor requires the file) |
| `.memory/terminology-glossary.md` | template | Table Term, System or context, Meaning here, Distinction or alias, Source, Status / last checked; section "Naming changes and aliases". | `.memory/MEMORY.md`, curator, `scripts/memory.py` |
| `scripts/memory.py` | code (Python 3 standard library) | The only writer and checker. 505 lines. Details below. | see 4.2 |
| `tests/test_memory_runtime.py` | code (unittest) | 6 behavior tests on a temporary copy of the project. Details below. | nothing |
| `.claude/agents/memory-curator.md` | agent | Background curator subagent. Front matter: `name: memory-curator`, `description: Maintains the selected flat Second Brain V2 memory, current focus, and terminology after the main agent determines the owning record and authorization.`, `model: opus`, `tools: Read, Write, Edit, Glob, Grep, Bash`, `background: true`. Headings: Ownership and judgment; Authority; Procedure (5 steps using `scripts/memory.py hash`, `write --expect --authorization`, `replace-view`, `archive`, `restore`, `delete`, then read back and `doctor`). | dispatch rule, `README.md`, `memory_audit.py` |
| `.claude/rules/memory-curator-dispatch.md` | rule (unscoped) | Main-agent rule: decide the destination first; when to review; the onboarding card format (`## Proposed memory saves`, `### 1. <Short topic title>`, **Change**, **Summary** or **Affected content**, **Your decision**); trusted curation; dispatch and completion. | `.memory/AGENTS.md`, `memory_trigger.py`, `.claude/RULES.md`, `README.md` |
| `.claude/hooks/memory_trigger.py` | hook (`UserPromptSubmit`, timeout 5) | Does nothing unless `.toolkit-memory.json` exists. Matches the prompt against 11 regex labels from `_memory_patterns.py`. On a match: appends `{session_id, at, labels, prompt_sha256}` (no prompt text) to `.memory/.runtime/trigger-events.jsonl` (file mode 0600) and prints JSON `{"hookSpecificOutput": {"hookEventName": "UserPromptSubmit", "additionalContext": "Possible Second Brain V2 review signal: <labels>. ... No-op is valid."}}`. Any exception is swallowed so a prompt is never blocked. | settings, tests |
| `.claude/hooks/_memory_patterns.py` | code (hook helper) | 11 labels: `explicit-remember`, `explicit-forget`, `explicit-memory-change`, `correction`, `standing-preference`, `people-change`, `focus-change`, `tool-or-vendor-change`, `reference-change`, `current-focus`, `project-lesson`. Example: `\b(?:from now on\|going forward\|never (?:do\|use\|run\|edit)\|always (?:do\|use\|check\|ask))\b` gives `standing-preference`. | tests |
| `.claude/hooks/memory_audit.py` | hook (`Stop`, timeout 5) | Counts this session's signaled prompts and scans the transcript for `Agent`/`Task` tool calls whose `subagent_type` ends with `memory-curator`. Appends one line to `.memory/.runtime/memory-audit.jsonl` with `signaled_prompts`, `curator_dispatches`, and `review` (`"possible missed routing or approved card still awaiting answer"` or `"none"`). Never blocks. | settings, tests |

**`scripts/memory.py` commands:** `doctor`; `reindex`; `hash <name>`; `write <name> --from-file F --expect <sha256|absent> --authorization A`; `replace-view <CURRENT_FOCUS.md|memory-criteria.md|terminology-glossary.md> --from-file F --expect H [--authorization A]`; `archive <name> --expect H --reason R --authorization A`; `restore <name> --expect H --authorization A`; `delete <name> --expect H [--archived] --authorization A`; `backup --to <new path outside project>`; `restore-backup --from <path>`. Exit codes: 0 success, 1 doctor found errors, 2 operation refused.

**Rules the script enforces:**

- Topic filename must match `^(user|feedback|project|reference|event)_[a-z0-9]+(?:_[a-z0-9]+)*\.md$`; `*_template.md` files are excluded.
- Required front matter: `name` (lowercase kebab slug, unique), `description` (at most 105 characters, no `[` or `]`), `metadata.type` (must equal filename prefix), `status` (`current`, `needs-review`, `superseded`; `archived` only in `archive/`), `source`, `last_verified`, `authorization`. No field may contain `<`.
- Onboarding mode refuses `--authorization trusted` or empty. Trusted mode needs `trusted_by`, `trusted_on`, `trusted_scope`. A mode change through `replace-view` needs `--authorization`. Delete always needs an explicit authorization other than `trusted`.
- The `--authorization` value must appear inside the topic text.
- Every write takes a lock folder `.memory/.runtime/write.lock` (10-second wait), checks the expected hash, writes atomically (`mkstemp` then `os.replace`), and rebuilds `MEMORY.md`.
- Archive moves a topic to `.memory/archive/` with `status: archived` and an `**Archived <date>:** <reason>` line; it refuses if the topic still reads as live work (regex on "is open", "pending task", and similar). Restore brings it back as `needs-review`.
- `backup` refuses a destination inside the project. `restore-backup` refuses if `.memory/` already exists.
- `doctor` checks: the seven required `.memory/` files (including `CLAUDE.md`); stale lock; a linked Git worktree with its own `.memory/` (warning); mode validity; backup destination and restore test recorded (warnings); index equals generated index; archive statuses; focus size and nine headings; `.toolkit-memory.json` says `second-brain-v2` at `.memory` (ERROR otherwise); `.claude/settings.json` has `autoMemoryEnabled: false` (ERROR otherwise), V1 plugin disabled (warning), `UserPromptSubmit` and `Stop` hooks registered (warning); root `CLAUDE.md` holds the three imports (warning); placeholders left in `CURRENT_FOCUS.md` (warning).
- Current doctor result on the model: `Mode: onboarding; active topics: 0; errors: 0; warnings: 3` (backup not configured, restore not tested, seed placeholders).

**`tests/test_memory_runtime.py` tests:** `test_onboarding_write_index_stale_check_and_lifecycle`, `test_schema_rejects_wrong_type_and_doctor_finds_index_drift`, `test_prompt_hook_reminds_without_writing_memory`, `test_two_writers_keep_both_index_entries`, `test_owner_grant_enables_trusted_write_and_revocation`, `test_fresh_clone_restore_refuses_overwrite`. `setUp` copies `scripts/memory.py`, `.memory/`, `.toolkit-memory.json`, `CLAUDE.md`, `.claude/settings.json`, and the three hook files into a temporary folder, so it breaks if `CLAUDE.md` is removed.

### 6.6 `.claude/` (Claude Code host files)

| Path | Kind | Purpose | Referenced by |
| --- | --- | --- | --- |
| `.claude/RULES.md` | instruction (index, not auto-loaded) | Table of the rules and when each applies. Full text in 12.13. | `README.md` |
| `.claude/settings.json` | config | Turns off native auto-memory and V1 Second Brain; registers 6 hook commands; sets the output style; denies risky git and Salesforce commands; asks before others. Full text in 12.11. | see 4.2 |
| `.claude/protected-orgs.json` | config (Salesforce) | Policy for the production guard: `"action": "deny"`, `"unknownOrgAction": "ask"`, `"sandboxAction": "ask"`, `"confirmOrgDeleteAlways": true`, `"alwaysProtect": []`, `"neverProtect": []`, plus `_comment` and `_fields` explanations. | guard hook, safety rule |
| `.claude/output-styles/plain-english.md` | output style | Front matter `name: Plain English`, `description: Clear, direct replies in ordinary words that are easy to skim or scan, with the answer first and only the detail the user asked for.`, `keep-coding-instructions: true`. Headings: Answer directly; Make the reply easy to read; Report work accurately. Identical to `claude-toolkit/plugins/project-init/library/output-styles/plain-english.md`. | settings (`"outputStyle": "Plain English"`) |
| `.claude/agents/memory-curator.md` | agent | see 6.5 | see 6.5 |
| `.claude/hooks/toolkit-session-start.mjs` | hook (`SessionStart`, Claude and Codex) | see 4.1. 39 lines. Root is `CLAUDE_PROJECT_DIR` or two levels above the script. Plain stdout, not JSON. Much shorter than the library version (which handles an external memory mode and `knowledge/toolkit-manual.md`). | settings, `.codex/hooks.json` |
| `.claude/hooks/memory_trigger.py`, `memory_audit.py`, `_memory_patterns.py` | hooks | see 6.5 | see 6.5 |
| `.claude/hooks/guard-protected-orgs.js` | hook (Salesforce, `PreToolUse` on `Bash\|PowerShell`, timeout 90) | Node, 383 lines. Fast exit for any command without `sf`/`sfdx` or without a guarded verb. Guarded verbs: deploy start and validate, data create/update/upsert/import/delete, `apex run`, `project delete source`, `org delete`. Classifies the target org with `sf org list --json --skip-connection-status` (local auth store, no network). Returns `{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "ask"\|"deny", "permissionDecisionReason": ...}}`. On an internal error after a guarded verb is found, it asks. Its header comment still says the default is "ask" and "set in Gate 2 of project-init"; the model's config selects "deny". | settings, safety rule |
| `.claude/hooks/guard-permission-set-deploy.js` | hook (Salesforce, `PreToolUse`, timeout 30) | Node, 232 lines. Detects `sf project deploy start\|quick\|resume`, `sf deploy metadata`, `sfdx force:source:deploy`, `force:mdapi:deploy`, `force:source:push`. Finds permission sets named by `-m PermissionSet:Name`, `-d` file or folder, or `-x` manifest. Denies unless each has a receipt in `.claude/.permset-preflight/<Name>.json` younger than 30 minutes (written by `permsets.py preflight`). Fails open on its own errors. | settings, permissions rule and runbook, `permsets.py` |
| `.claude/skills/sf-component-tracker/SKILL.md` | skill (Salesforce) | 181 lines. `description: Use when you author, modify, rename, or delete Salesforce metadata under force-app/, when the owner reports a deploy that landed or failed, or when a deploy needs manual pre- or post-deploy steps. Keeps the component tracker CSV, the master manifest, the per-work-item manifests, destructiveChanges.xml, and manual-steps.md in sync.` Headings: Deployment folder (layout `delivery/deployment/component-tracker.csv`, `_master/package.xml`, `_master/manual-steps.md`, `<work-item-id>/package.xml`, `destructiveChanges.xml`, `manual-steps.md`); Step 1 to Step 4; Tracker schema (9 columns); Org flags; Change Type (`New`, `Modified`, `Destructive`); One row per component; Project-authored only; CSV editing; Not in the tracker; Related rules. Identical to the library copy. | `component-tracker.md`, `deployment-runbook.md` |
| `.claude/skills/sf-data-change/SKILL.md` | skill (Salesforce) | 68 lines. `description: Use when Salesforce production data must be created, updated, upserted, or deleted, when a backup is needed before a data change, or when you create or edit files under delivery/data/ or engagement/data/. Produces the owner's handoff package (load file, backup file, numbered load steps, success check, undo steps) and files it in the production-backups and data-loads layout.` Headings: Limits (table); Step 1: build the package; Step 2: write the steps; Step 3: file it (layout `production-backups/prod-backup-<MMDDYYYY>-<slug>/` and `data-loads/<change-slug>-<MMDDYYYY>/`); Step 4: hand over; Related rules. **Differs from the library copy:** no required event README; handoff details go in the chosen work item. | `data-change-handoff.md`, `production-data.md` |
| `.claude/skills/sf-deploy-check/SKILL.md` | skill (Salesforce) | 45 lines. `description: Use when you are about to deploy Salesforce metadata to a shared or higher org (full-copy, staging, or production), or to hand the owner any production deploy command. Runs the hitch-hiker check that finds components or pending edits that would ship with the deploy before their feature is ready.` Headings: When to run; The check (5 steps, ends with a read-only org check); Narrow the deploy set; Why the check ends with an org read; Related. Identical to the library copy. | `deploy-hitchhiker-check.md`, root `AGENTS.md` |

**The 18 rules in `.claude/rules/`.** "Scope" lists the `paths:` front matter. "vs library" compares with `claude-toolkit/plugins/project-init/library/rules/{general,salesforce}/`.

| Rule | Group | Scope | What it says (short) | vs library |
| --- | --- | --- | --- | --- |
| `ai-external-knowledge.md` | general | `ai-external-knowledge/**` | Outside docs go in `ai-external-knowledge/<topic>/` with a `SOURCE-RECORD.md`; root `INDEX.md`; raw source, never edited; nothing reads it unless pointed at; record URL and capture date; check redistribution rights. | changed: `SOURCE-RECORD.md` and `INDEX.md` instead of a topic `README.md` |
| `humanize-outbound-text.md` | general | always | Text leaving the project goes through the `humanizer` skill (fallback `unslop`); keep every fact; owner's voice. | identical |
| `knowledge-direct-commit.md` | general | `requirements/**`, `PROJECT-ROADMAP.md`, `PROJECT.md`, `docs/**`, `ai-external-knowledge/**`, `delivery/**`, `**/README.md` | Documentation-only saves use their own temporary worktree and publish straight to the default branch; rules, skills, hooks, settings, code use a worktree and pull request; `.memory/` and `.work-items/` are Git-ignored and skip this route; steps in `publish-docs`. | changed paths (library: `knowledge/**`, `prds/**`) and the last line |
| `offer-context-handoff.md` | general | always | In a long session before complex work, offer the `handoff` skill; review `CURRENT_FOCUS.md` and criteria first. | changed: V2 memory instead of `knowledge-save` |
| `parallel-agent-sessions.md` | general | always | Check worktrees, status, fetch before first edit; own worktree at `.claude/worktrees/<name>`; stage paths by name; never `git add -A`; merge by pull request with approval; merge-safety check. | identical |
| `plain-english-artifacts.md` | general | always | Words inside generated artifacts follow the output style; headings name content; real names, no figurative language; the Salesforce role-hierarchy heading table as the example. | identical |
| `work-item-stages.md` | general | always | Tracker is the source of truth; open the `work` skill before substantial work; `build` and `data-load` need approved requirements; ask team arrangement after agent-led delivery is accepted; Done only after owner approval; record next step; stages in `references/lifecycle.md`. | identical |
| `memory-curator-dispatch.md` | memory | always | see 6.5 and 13.8 | new in the model |
| `component-tracker.md` | Salesforce | always | Changing `force-app/` metadata: open `sf-component-tracker`; update `component-tracker.csv`, `_master/package.xml`, and the work item's manifest folder in the same response; flags only for landed deploys. | identical |
| `data-change-handoff.md` | Salesforce | always | No agent writes production data; sandbox writes need a yes in the same chat; never commit load or backup files; open `sf-data-change`. | identical |
| `delivery-and-knowledge-boundary.md` | Salesforce | always | New projects use `delivery/`; existing `engagement/` stays; with V2, memory in `.memory/`, accepted behavior in `requirements/`; never `delivery/knowledge-base/`. | changed: V2 routing |
| `dependency-graph.md` | Salesforce | `force-app/**`, `tools/kb/**` | Answer impact questions from `build_edges.py` and `query_graph.py`, cite it; never claim "nothing writes this field" from it alone; handle `_drift_pending.md`; never commit outputs; only three scripts may contact an org and only with `sf data query`; aliases in `tools/kb/org-aliases.json`; `GRAPH_FRESHNESS=0` disables the Stop hook. | changed: V2 curator instead of `knowledge-save` |
| `deploy-hitchhiker-check.md` | Salesforce | always | Before deploying to a shared or higher org, run `sf-deploy-check`; verify read-only; stop on a confirmed hitch-hiker. | identical |
| `deployment-runbook.md` | Salesforce | `delivery/deployment/**`, `engagement/deployment/**` | Add a `manual-steps.md` step when a deploy cannot do something; when unsure, add it. | identical |
| `permissions-source-control.md` | Salesforce | `force-app/**/permissionsets/**`, `force-app/**/permissionsetgroups/**`, `force-app/**/profiles/**` | 17 bullets: fetch with `permsets.py`, verify, preflight before every deploy, 30-minute receipt, `--accept-removals`, sandbox only, no `--ignore-conflicts`, keep `sourceApiVersion` equal, check then tidy, blind spots, recalculate groups, never hand-merge, never `Activity.`, profiles excluded, never edit the guard hook. | identical |
| `production-data.md` | Salesforce | `delivery/data/**`, `engagement/data/**` | Backup and load folder names; record details in the chosen work item and handoff; no event README; never commit `*.csv`, `*.xlsx`, `*.xls`. | changed: no committed README |
| `salesforce-change-clarify.md` | Salesforce | always | Confirm scope with the owner before object model, security, integrations, data-source priority, or scope-contradicting changes. | identical |
| `salesforce-safety-guardrails.md` | Salesforce | always | Allowed reads and sandbox actions (with a yes); never deploy or validate against production, never production data writes, never metadata or org deletes, always explicit `-o <sandbox>`, never CLI-deploy a profile, never weaken a guard. | identical |

Library rules **not** in the model: `general/work-item-folders.md` (protects local `.work-items/` and names Work Tracker commands `work add`, `work edit`), `general/dependency-graph.md` (a graphify code-graph rule for non-Salesforce code), and the `README.md` indexes of both library folders.

### 6.7 `.agents/` and `.codex/` (Codex host files)

| Path | Kind | Purpose |
| --- | --- | --- |
| `.agents/skills/sf-component-tracker/SKILL.md`, `sf-data-change/SKILL.md`, `sf-deploy-check/SKILL.md` | skill (Salesforce, Codex copy) | Byte-identical copies of the `.claude/skills/` files so Codex can find them. |
| `.codex/hooks.json` | config (Codex hooks) | One `SessionStart` hook (`matcher: "startup|resume|clear|compact"`) running `node ".claude/hooks/toolkit-session-start.mjs"`; `commandWindows` uses PowerShell; `timeout: 10`; `additionalContextLimit: 1000`; `statusMessage: "Reading Toolkit orientation route"`. Full text in 12.12. The command uses a relative path, so it depends on Codex starting in the project root; the `claude-toolkit` repo's own `.codex/hooks.json` instead finds the root with `git rev-parse --show-toplevel`. |

### 6.8 `ai-external-knowledge/` (outside documentation)

| Path | Kind | Headings and fields |
| --- | --- | --- |
| `ai-external-knowledge/INDEX.md` | template (index) | `# Outside documentation index`; intro; table Topic folder, Source and subject, Captured, When to consult it (one example row linking `topic-template/SOURCE-RECORD-TEMPLATE.md`); closing paragraph: captured material stays the source's writing; no client files, meeting notes, decisions, or agent instructions here. |
| `ai-external-knowledge/topic-template/SOURCE-RECORD-TEMPLATE.md` | template | `# <Documentation topic or source area>`; bullets Publisher, Original documentation home, Captured on, Version or publication date, Capture method, Coverage, Redistribution status, Refresh method; `## Pages` (table Page, Original URL, Captured file, Use); `## Project use`. |
| `ai-external-knowledge/topic-template/PAGE-TEMPLATE.md` | template | `# <Captured page title>`; bullets Source URL, Publisher, Captured on, Source publication/version, Capture note; `---`; body placeholder for the faithful copy. |

The rule says a real topic folder has `SOURCE-RECORD.md`; the template file is `SOURCE-RECORD-TEMPLATE.md`. No file states the general convention that `<NAME>-TEMPLATE.md` becomes `<NAME>.md` when used.

### 6.9 `delivery/` (Salesforce client-work artifacts)

No `AGENTS.md` or README. Root `AGENTS.md` routes it: "Client briefs, references, communications, meetings, data, deployment, deliverables, and archive; open the relevant category." Path-scoped rules: `knowledge-direct-commit.md` (all of `delivery/**`), `production-data.md` (`delivery/data/**`), `deployment-runbook.md` (`delivery/deployment/**`).

| Path | Kind | Headings and fields |
| --- | --- | --- |
| `delivery/project-overview/brief-template/BRIEF-TEMPLATE.md` | template | `# <Original project brief title>`; one paragraph: place the supplied brief here; keep a non-Markdown original and remove the placeholder. |
| `delivery/project-overview/brief-template/SOURCE-RECORD-TEMPLATE.md` | template | `# <Project brief or framing item>`; Supplied by, Received, Original artifact, Status, Related project record; closing line: record conclusions in `PROJECT.md`, roadmap, requirements, or tracker. |
| `delivery/references/source-template/SOURCE-RECORD-TEMPLATE.md` | template | `# <Client-provided source item>`; Supplied by, Received, Original file or link, Version and confidentiality, Purpose, Related work item or area, Status; closing line points public vendor docs to `../../../ai-external-knowledge/`. |
| `delivery/references/source-template/SOURCE-NOTES-TEMPLATE.md` | template | `# <Source item> — reading notes`; Coverage; Relevant excerpts or pointers; Questions and limits; Related project records. |
| `delivery/communications/message-template/MESSAGE-TEMPLATE.md` | template | `# <Original message subject>`; Participants, Date and channel, Original artifact, Related work item or decision; `## Message`; `## Attachments`; closing line. |
| `delivery/meeting-notes/` | empty folder | Seed removed by Mike 2026-09-26 (D13). |
| `delivery/deliverables/` | empty folder | Seed removed by Mike 2026-09-26 (D13). |
| `delivery/archive/item-template/ARCHIVE-RECORD-TEMPLATE.md` | template | `# <Archived artifact or item>`; Former location, Archived on, Reason, Replaced by, Scope and owner, Contents; warning not to treat it as current. |
| `delivery/data/area-template/DATA-AREA-TEMPLATE.md` | template | `# <Data area>`; Objects and source systems, Related requirements and work items, Mapping status, Last checked; `## Files` (lists the two sibling templates). |
| `delivery/data/area-template/FIELD-MAPPING-TEMPLATE.md` | template | `# <Data area> — field mapping`; table Source system/object/field, Target object/field, Meaning, Transformation, Required, Evidence; Scope and exclusions; Open mapping questions. |
| `delivery/data/area-template/TRANSFORMATION-RULES-TEMPLATE.md` | template | `# <Data area> — transformation rules`; Input and output; Rules (table Rule ID, Condition, Transformation, Exception, Verification); Data quality and reconciliation; Sources and approval. |
| `delivery/data/data-loads/.gitignore` | config | `*.csv`, `*.xlsx`, `*.xls` ignored; `!.gitignore`. |
| `delivery/data/data-loads/load-template/LOAD-RECORD-TEMPLATE.md` | template | `# <Load event>`; Change and target (Load date, Related work item and purpose, Target org, Operation and object, Operator); Exact load files (table); Field mappings and settings (table plus Insert-Null-Values, Pre-load backup); Numbered operator steps (4); Success check; Undo steps and limits. **Contradicts D13** (see 10.6). |
| `delivery/data/production-backups/.gitignore` | config | same as above |
| `delivery/data/production-backups/backup-template/BACKUP-RECORD-TEMPLATE.md` | template | `# <Backup event>`; Restore point and scope; Exact export files (table); Restore procedure (3 steps); Restore verification and limits. **Contradicts D13.** |
| `delivery/deployment/component-tracker.csv` | data (header only) | `Component Type,Object/Parent,API Name,Label,Work Item,Change Type,Sandbox,Production,Notes` |
| `delivery/deployment/_master/MASTER-DEPLOYMENT-TEMPLATE.md` | template | `# Full-cutover deployment`; Scope, Source of truth, package.xml, manual-steps.md, Exclusions, Last verified. |
| `delivery/deployment/_master/MANUAL-STEPS-TEMPLATE.md` | template | `# Full-cutover manual steps`; `## Pre-deploy` with `### Step <order>: <Imperative title>` (Owner, Status, Purpose, Instructions, Verification, Source); `## Deploy`; `## Post-deploy`. |
| `delivery/deployment/_master/PACKAGE-XML-TEMPLATE.md` | template | Explains the real `package.xml`; XML shape with `COMPONENT_API_NAME`, `METADATA_TYPE`, `PROJECT_API_VERSION`; Checks before use. The `sf-component-tracker` skill expects a real `_master/package.xml`, which the model does not contain. |
| `delivery/deployment/work-item-template/DEPLOYMENT-RECORD-TEMPLATE.md` | template | `# <Work item> deployment package`; Work item, Source change, Target orgs, package.xml, destructiveChanges.xml, manual-steps.md, Validation and result. |
| `delivery/deployment/work-item-template/PACKAGE-XML-TEMPLATE.md` | template | Work-item manifest shape and checks. |
| `delivery/deployment/work-item-template/DESTRUCTIVE-CHANGES-TEMPLATE.md` | template | `destructiveChanges.xml` shape and checks. |
| `delivery/deployment/work-item-template/MANUAL-STEPS-TEMPLATE.md` | template | `# <Work item> manual deployment steps`; Pre-deploy (Owner and status, Purpose, Instructions, Verification); Deploy; Post-deploy; Work-item link. |
| `delivery/deployment/release-template/CUTOVER-PLAN-TEMPLATE.md` | template | `# <Release> — cutover plan`; Scope and authority; Ordered steps (table Order, Action, Operator, Source package or procedure, Success check, Rollback); Go/no-go checks; Communications; Outcome and evidence. |
| `delivery/deployment/release-template/RELEASE-NOTES-TEMPLATE.md` | template | `# <Release> — notes`; Summary; Included work (table); Actions required; Known limits; Release record. |

### 6.10 `tests/`

| Path | Kind | Headings |
| --- | --- | --- |
| `tests/TEST-PLAN-TEMPLATE.md` | template | `# <Feature or release> test plan`; Scope; Environment and data ("Verified org or test environment"); Checks (table Scenario, Expected result, Method or test, Evidence); Results and follow-up (Date and tester, Outcome, Remaining issues). Referenced by nothing. |
| `tests/test_memory_runtime.py` | code | see 6.5 |

### 6.11 `tools/permissions/` and `tools/kb/` (Salesforce optional kits)

Both folders are byte-identical to `claude-toolkit/plugins/project-init/library/tools/` (`permsets.py` there sits directly in `tools/`). Both need only Python 3 standard library.

**`tools/permissions/`**

- `README.md` (tool manual, 5 lines): points to `docs/permissions-runbook.md`; says the model has no connected org.
- `permsets.py` (Python 3.10 or later): five subcommands. `verify` compares a local permission set with the org; `check` lints hand-edit mistakes; `tidy` rewrites in canonical order; `fetch` retrieves, verifies, tidies, and places files in the package folder (refuses on failed verify); `preflight` lists every grant a deploy would remove and exits non-zero unless `--accept-removals`. Read-only against orgs; never deploys. Calls the `sf` CLI. Finds the project root by walking up to `sfdx-project.json`. `RETRIEVE_BLIND_SPOTS = ["ManagePackageLicenses"]`. Writes preflight receipts to `.claude/.permset-preflight/<Name>.json` (Git-ignored) for the deploy guard.

**`tools/kb/`** (Salesforce metadata dependency graph, 39 Python files, about 16,600 lines)

- Purpose: read `force-app/` metadata files and record every connection (which flow reads which field, which Apex writes which object, which permission set grants what). Answers "where does this value come from?" and "what breaks if I change this?". Building never contacts an org.
- Org naming: each `packageDirectories` path in `sfdx-project.json` is an org named by its last path segment; CLI aliases can be mapped in `tools/kb/org-aliases.json` (not present) or `--alias org=target`.
- Outputs (Git-ignored) in `tools/kb/out/`: `edges-<org>.json`, `reverse-index-<org>.json`, `coverage-<org>.json`, `unresolved-<org>.json`, `reports-<org>.md`, plus `field-classification-<org>.json`. Sizes can exceed 200 MB per org.
- Scripts: `file_registry.py` (every file and its metadata type); `extractors/` (`__init__.py`, `_kbpath.py`, `interface.py`, `contracts.py`, `names.py`, `driver.py`, `generic.py`, `xmlutil.py`, and deep readers `analytics.py`, `apex.py`, `automation.py`, `data.py`, `flows.py`, `objects.py`, `security.py`); `extract.py` (runs extractors, coverage report, `--prove-gaps`, `--census`); `resolver.py` and `resolve.py` (reference strings to component ids); `edge_list.py` (finished edges and reverse index); `reports.py`; `build_edges.py` (the one build command, `--org`, `--check-only --prove-deterministic`); `graph.py` (shared streaming reader, org discovery); `query_graph.py` (impact queries, `--hops`, `--unresolved`, `--map`); `classify_fields.py`; `diff_graph.py`; `graph_freshness_hook.py` (Stop hook, see below); `org_api.py` (the only file that runs `sf`, always `sf data query`); `pull_org_dependencies.py`, `org_catalog.py`, `build_org_catalog.py`, `compare_dependencies.py` (optional read-only cross-check against `MetadataComponentDependency`, writing to `org-knowledge/dependency-crosscheck/`, which the README says to commit); `test_file_registry.py`, `test_extractors.py`, `test_resolver.py`, `test_edge_list.py`, `test_reports.py`, `test_graph_tools.py`, `test_org_crosscheck.py` (issue 419 reports 302 tests with expected skips).
- `graph_freshness_hook.py` is registered as a Claude `Stop` hook (timeout 60). It fingerprints `force-app/`; exits at once if nothing changed; rebuilds only changed orgs if an `out/` already exists; writes `tools/kb/_drift_pending.md` when connections moved; always exits 0; `GRAPH_FRESHNESS=0` turns it off. Its drift text still says "contradicts something recorded in `knowledge/memory/`", a V1 path.
- `README.md` sections: The dependency edge list ...; Where the org names come from; Build it first; Ask it questions; What this cannot tell you (8 limits); Checking it against the org's own answer; The automatic freshness check; How it is built, and how to check it; File map; Installing it in a project.

---

## 7. Which parts apply to which kind of project

This is what init needs to decide per interview answer (G2, G3). "Everyone" means every project.

| Part | Everyone | Salesforce only | Depends on tracker | Depends on memory |
| --- | --- | --- | --- | --- |
| Root `AGENTS.md` | yes, with Salesforce lines removed for others | Salesforce rows: path rules for `delivery/**`, `force-app/**`, `tools/kb/**`; codemap rows `delivery/`, `force-app/`, `tools/`; tools rows for impact, permission sets, `sf-deploy-check` | "Where work is tracked" and codemap tracker row | `.memory/` rows, "Check V2 memory", quick-save row |
| `README.md`, `SOUL.md`, `PROJECT.md`, `PROJECT-ROADMAP.md` | yes (strip Salesforce words such as "Salesforce project", "Salesforce source: `force-app/`", "Deployment manifests") | | tracker line in `PROJECT.md` | "Local memory" and backup lines in `PROJECT.md` |
| `requirements/` (AGENTS.md, AREA-TEMPLATE.md, SYSTEM-DATA-MODEL.md) | yes | | | |
| `docs/AGENTS.md`, `docs/toolkit-manual.md` | yes | `docs/permissions-runbook.md` | tracker row in the manual | "Second Brain V2 operation" section of the manual |
| `docs/system-guide/AREA-TEMPLATE.md` | optional System Guide (not in the port list) | | | |
| `ai-external-knowledge/` | yes | | | |
| `delivery/` | categories are client-work; today installed only by the Salesforce scaffold | `data/` and `deployment/` are Salesforce-specific | | |
| `tests/TEST-PLAN-TEMPLATE.md` | yes (wording mentions "org") | | | |
| `.gitignore` | `.claude/worktrees/`, `*.log`, `__pycache__/`, `*.pyc` | `.sfdx/`, `.sf/`, `.localdevserver/`, `.claude/.permset-preflight/`, `tools/kb/...` | `/.work-items/` (local only) | `.memory/` (built-in only) |
| `.claude/settings.json` | git deny list, `outputStyle`, `SessionStart` hook | `sf` deny and ask entries, the two `PreToolUse` guards, graph `Stop` hook | | `autoMemoryEnabled`, `enabledPlugins`, `UserPromptSubmit` and memory `Stop` hooks |
| General rules (7) | yes | | `work-item-stages.md` names the `work` skill | `offer-context-handoff.md` names `.memory/` files |
| Salesforce rules (10), 3 skills, 2 guards, `protected-orgs.json`, `sfdx-project.json`, `.forceignore`, `.vscode/settings.json`, `force-app/`, `tools/` | | yes | | |
| `memory-curator-dispatch.md`, curator agent, 3 memory hooks, `scripts/memory.py`, `tests/test_memory_runtime.py`, `.toolkit-memory.json`, `.memory/*` | | | | built-in `.memory/` option only |
| `.work-items/work-item-template/` | | | local tracker only, but its two templates are the body format for every tracker (G5) | |
| Output style `plain-english.md` | yes | | | |
| `.codex/hooks.json`, `.agents/skills/` | when Codex is a host | `.agents/skills/` holds Salesforce skills today | | |

---

## 8. What the model changed from the current Toolkit library

- Rules adapted to the V2 layout: `ai-external-knowledge.md`, `delivery-and-knowledge-boundary.md`, `dependency-graph.md`, `knowledge-direct-commit.md`, `offer-context-handoff.md`, `production-data.md` (diffs in 6.6).
- New: `memory-curator-dispatch.md`, the curator agent, three memory hooks, `scripts/memory.py`, memory tests, `.memory/`, `.toolkit-memory.json` schema 2.
- `sf-data-change` skill drops the required event README and sends handoff details to the chosen work item.
- `toolkit-session-start.mjs` rewritten much shorter; reads `docs/toolkit-manual.md` instead of `knowledge/toolkit-manual.md`; checks the three-line `CLAUDE.md`.
- Unchanged copies: `parallel-agent-sessions.md`, `plain-english-artifacts.md`, `humanize-outbound-text.md`, `work-item-stages.md`, 7 Salesforce rules, `sf-component-tracker`, `sf-deploy-check`, `plain-english.md`, `tools/kb/` (byte-identical to `project-init/library/tools/kb/`), `permsets.py` (identical to `project-init/library/tools/permsets.py`), and both guard hooks (identical to `claude-toolkit/plugins/hooks-library/hooks/guard-protected-orgs.js` and `guard-permission-set-deploy.js`).
- Not copied: `work-item-folders.md`, the general graphify `dependency-graph.md`, library `README.md` files, the `terse.md` output style.

---

## 9. Size and startup cost

Loaded at every Claude start today: root `AGENTS.md` (70 lines), `MEMORY.md` (24 lines empty; up to 150), `CURRENT_FOCUS.md` (41 lines as a seed; up to 50), 12 unscoped rules (234 lines, of which `plain-english-artifacts.md` is 81 and `memory-curator-dispatch.md` is 39), and the session hook output (about 120 words). For a non-Salesforce project, 6 of the 12 unscoped rules drop out (`component-tracker`, `data-change-handoff`, `delivery-and-knowledge-boundary`, `deploy-hitchhiker-check`, `salesforce-change-clarify`, `salesforce-safety-guardrails`); `memory-curator-dispatch` drops out when built-in memory is not chosen.

---

## 10. Inconsistencies, gaps, and conflicts to resolve in the review

1. **`CLAUDE.md` removal (G1) breaks five things.** (a) `toolkit-session-start.mjs` warns unless `CLAUDE.md` is exactly the three imports. (b) `scripts/memory.py doctor` reports an ERROR when `.memory/CLAUDE.md` is missing and a NOTE when root `CLAUDE.md` lacks the imports. (c) `tests/test_memory_runtime.py` `setUp` copies `CLAUDE.md` and fails without it. (d) `README.md` step 4, `docs/toolkit-manual.md` ("Claude Code reads the root `CLAUDE.md` imports"), and `memory-curator-dispatch.md` ("`CLAUDE.md` imports the flat index and current focus at startup") describe it. (e) The startup load of `MEMORY.md` and `CURRENT_FOCUS.md` disappears. The captured Claude Code docs (`ai-external-knowledge/claude-code/memory.md`, "When Claude Code reads AGENTS.md") say `@path` imports inside `AGENTS.md` are expanded, so `@.memory/MEMORY.md` lines could move into root `AGENTS.md` for Claude; Codex would see them as plain text and needs the "read these files" instruction instead. The same page says a subdirectory `AGENTS.md` loads when Claude reads a file in that folder, so the scoped guides need no adapter. It also says `AGENTS.md` loads only when no `CLAUDE.md` or `CLAUDE.local.md` exists in the working directory or above, and that some sessions (Bedrock, telemetry off, first session after upgrade) cannot read `AGENTS.md`.
2. **Init skips `.work-items/` and `.memory/` (G2), but those folders hold required templates.** The approved `WORK-ITEM.md` and `DESIGN.md`, and all memory seeds, must ship inside the plugin and be created when the matching option is chosen. For Notion, GitHub Issues, and Jira, the same two templates become the item body and design (G5).
3. **Memory option coupling.** `scripts/memory.py doctor` hard-codes `"memory": "second-brain-v2"` and `"location": ".memory"`, and requires `autoMemoryEnabled: false`. `memory_trigger.py` runs only when `.toolkit-memory.json` exists and always points at `.memory/` and the curator. Hindsight and Notion options need their own values in `.toolkit-memory.json` and their own routing text in `AGENTS.md`, the toolkit manual, `offer-context-handoff.md`, `dependency-graph.md`, and `delivery-and-knowledge-boundary.md`.
4. **No sub-item field.** `WORK-ITEM.md` front matter has no `parent` or `children` key; only the Overview line "Related items: <Roadmap, parent work item, design, or external links.>". G5 requires sub-items.
5. **Status and stage values do not match the lifecycle.** Front matter offers `status: <Backlog | In Progress | Blocked | Done>`; the lifecycle maps stages to Backlog, Ready, In Progress, In Review. `stage:` has no value list. `requirements_status: refining` is lowercase while the body says `Refining`. `type:` has no value list, although `work-item-stages.md` names `build` and `data-load` types.
6. **Load and backup record templates still exist** (`delivery/data/data-loads/load-template/LOAD-RECORD-TEMPLATE.md`, `delivery/data/production-backups/backup-template/BACKUP-RECORD-TEMPLATE.md`), while issue 419 req 28, its ledger ("no seed event record"), `README.md`, `production-data.md`, and the model's `sf-data-change` say there is no seed record. Either Mike kept them on purpose or the removal did not happen. GOAL.md says the scaffold must match the model's folders and file names, so this needs Mike's answer.
7. **`requirements/SYSTEM-DATA-MODEL.md` is unexplained.** It is the newest file, not listed in the issue 419 ledger, not referenced by `requirements/AGENTS.md` or root `AGENTS.md`, and uses a `[bracket]` prompt. It looks like Mike's own recent addition; the review should keep it and add routing for it.
8. **ID formats differ.** Roadmap uses `P01` and `P01-U01`; the work item uses `P1` and `P1-T01`. Work item ids are `WI-001` in the template and `WI-12-account-merge` in `sf-component-tracker`.
9. **System Guide is referenced but not ported.** Root `AGENTS.md` names `.system-guide.json` and the `system-guide` skill; `docs/system-guide/AREA-TEMPLATE.md` exists; GOAL.md's port list omits the System Guide plugin.
10. **External skills the model depends on** (4.3): `work`, `publish-docs`, `handoff`, `humanizer`/`unslop`, `system-guide`. The `humanizer` skill does not exist in the Toolkit.
11. **Template-to-real-file naming is implicit.** `SOURCE-RECORD-TEMPLATE.md` becomes `SOURCE-RECORD.md` (rule text); `MANUAL-STEPS-TEMPLATE.md` becomes `manual-steps.md`; `PACKAGE-XML-TEMPLATE.md` becomes `package.xml`; `DESTRUCTIVE-CHANGES-TEMPLATE.md` becomes `destructiveChanges.xml`. `DEPLOYMENT-RECORD-TEMPLATE.md`, `MASTER-DEPLOYMENT-TEMPLATE.md`, `DATA-AREA-TEMPLATE.md`, the `*-template/` folder names, and `AREA-TEMPLATE.md` have no stated target name.
12. **`component-tracker` expects real manifests** (`_master/package.xml`) but the model ships only Markdown explanations (issue 419 notes this).
13. **Empty folders** (`force-app/`, `delivery/deliverables/`, `delivery/meeting-notes/`) vanish in Git. The installer must create them.
14. **Model-only text in shippable files.** `README.md` has "Root AGENTS.md is the draft installed-project template for Project Init ... Issue #419 tracks ...", the whole "Project Init package in this model" section, and "A warning about remaining seed placeholders is expected in this model". `.claude/RULES.md` last line mentions issue #419. `delivery-and-knowledge-boundary.md` and others say "Second Brain V2".
15. **Stale V1 path** in `tools/kb/graph_freshness_hook.py` drift text: `knowledge/memory/`.
16. **`sfdx-project.json` has no `sourceApiVersion`** although the permissions rule and runbook rely on it.
17. **Guard comment mismatch:** `guard-protected-orgs.js` header says default `ask` (Gate 2 of project-init); model config uses `deny`.
18. **Codex hook path.** `.codex/hooks.json` uses a relative script path; the claude-toolkit repo's own Codex hook resolves the root with `git rev-parse --show-toplevel`. Codex also has no memory trigger or audit hook, so memory review in Codex depends only on instructions.
19. **`.claude/settings.json` names the old marketplace** (`second-brain@claude-toolkit`). A Toolkit V2 project will have a different marketplace name.
20. **Salesforce wording in general files** (see section 7) must be removed for non-Salesforce projects: `AGENTS.md` first line, `README.md` intro and "Start here" step 2, `PROJECT.md` Purpose and Resources, `TEST-PLAN-TEMPLATE.md` "Verified org".
21. **`docs/AGENTS.md` routes client architecture to `delivery/references/`**, which exists only in the Salesforce scaffold.
22. **`README.md` says Codex "can use the script directly"**, but no Codex skill or hook tells it to; only `AGENTS.md` text does.

---

## 11. Open questions

1. Keep or delete `LOAD-RECORD-TEMPLATE.md` and `BACKUP-RECORD-TEMPLATE.md` (item 10.6)?
2. What is `requirements/SYSTEM-DATA-MODEL.md` for, and should `requirements/AGENTS.md` route to it (item 10.7)?
3. Should `delivery/` install for non-Salesforce projects (its non-data, non-deployment categories are general client work)?
4. Is the System Guide (`docs/system-guide/`, `.system-guide.json`) part of Toolkit V2 or dropped?
5. Should `MEMORY.md` and `CURRENT_FOCUS.md` still load at every start once `CLAUDE.md` is gone (via `@` imports in `AGENTS.md`, a SessionStart hook, or a startup instruction)?
6. Which work-item front matter keys and values are fixed across trackers (`status`, `stage`, `type`, `parent`)?
7. Are the permission-set kit and the dependency-graph kit always installed for Salesforce projects, or asked about?
8. Which `README.md` text is template and which is model-only commentary to drop?

---

## 12. Full text of the requested files

### 12.1 Root `AGENTS.md`

````markdown
Always execute work with the context in mind that the user will likely
continue work across multiple AI coding sessions where the session context is
cleared and picked up again. You must assist the user in helping establish
that continuity across sessions while not adding context that might pollute
future agents and skew them. Information must be curated and intentional.

# <Project name>: agent guide

<One sentence describing this Salesforce project and its outcome.> Read `.claude/rules` first.

## Startup

- Read `SOUL.md`, `PROJECT.md`, and `.memory/CURRENT_FOCUS.md`; repeat after resume, clear, or compaction.
- Before substantial work, open the chosen item, the `work` skill, and the relevant `PROJECT-ROADMAP.md` phase.
- Use `.memory/MEMORY.md` to find context; read its topic and source. Follow `.memory/AGENTS.md` before writes.
- Open only the needed section of `docs/toolkit-manual.md`.

## Path-scoped rules

Claude Code loads these when matching files are read. Codex: open the matching rule before work.

| Paths | Rule |
| --- | --- |
| `PROJECT.md`, `PROJECT-ROADMAP.md`, `requirements/**`, `docs/**`, `delivery/**`, `ai-external-knowledge/**`, `**/README.md` | `.claude/rules/knowledge-direct-commit.md` |
| `ai-external-knowledge/**` | `.claude/rules/ai-external-knowledge.md` |
| `delivery/data/**` | `.claude/rules/production-data.md` |
| `delivery/deployment/**` | `.claude/rules/deployment-runbook.md` |
| `force-app/**/permissionsets/**`, `force-app/**/permissionsetgroups/**`, `force-app/**/profiles/**` | `.claude/rules/permissions-source-control.md` |
| `force-app/**`, `tools/kb/**` | `.claude/rules/dependency-graph.md` |

When `.system-guide.json` is enabled, use the System Guide plugin's `system-guide` skill for questions or work about existing system structure, purpose, connections, or impact.

## Project map

| Place | What it holds and when to open it |
| --- | --- |
| `PROJECT.md` | Purpose, scope, owners, systems, and tracker; open for project context. |
| `PROJECT-ROADMAP.md` | Phases and work units; open for sequencing. |
| `<external tracker>` or `.work-items/` | Active work and each item's design. Local: `DESIGN.md` beside `WORK-ITEM.md`; external: design in the item's record or attachments. Never create `docs/designs/`. |
| `requirements/` | Delivered functional behavior by area; read its `AGENTS.md` before editing. |
| `docs/` | Toolkit manual, runbooks, optional System Guide; read its `AGENTS.md` before editing. |
| `.memory/` | V2 focus, index, glossary, topics; read its `AGENTS.md` before editing. |
| `ai-external-knowledge/` | Captured outside sources by topic; open when needed. |
| `delivery/` | Client briefs, references, communications, meetings, data, deployment, deliverables, and archive; open the relevant category. |
| `force-app/`, `tests/` | Salesforce source and checks; open before changing behavior. |
| `tools/permissions/`, `tools/kb/` | Permission and impact tools; open for those tasks. |

## Tools

| Need | Route |
| --- | --- |
| Check V2 memory | `python3 scripts/memory.py doctor`; `.memory/AGENTS.md`. |
| Check Salesforce impact | `python3 tools/kb/build_edges.py`, then `query_graph.py`; `tools/kb/README.md`. |
| Check permission sets | `python3 tools/permissions/permsets.py`; `docs/permissions-runbook.md`. |
| Check a shared-org deploy | `sf-deploy-check` skill. |
| Build, test, or deploy | `<Verified project commands and target org; do not infer from this template.>` |

## Quick saves

| Record | Route |
| --- | --- |
| Authorized project documents | `.claude/rules/knowledge-direct-commit.md` and `publish-docs` in a Git project. |
| `.memory/` | V2 curator and `.memory/memory-criteria.md`; separate backup or sync. |
| Chosen work item | Update the tracker; local `.work-items/` stays Git-ignored. |

## Where work is tracked

- Tracker: `<External service/project and link, or local .work-items/>`. Select one; do not mirror items.
- Build readiness: `<Chosen tracker's requirements approval route.>` A saved draft is not approved.
- Keep each design with its item after delivery. The roadmap links to items; item detail stays in the tracker.
````

### 12.2 `CLAUDE.md` files (all four)

Root `CLAUDE.md`:

````markdown
@AGENTS.md
@.memory/MEMORY.md
@.memory/CURRENT_FOCUS.md
````

`requirements/CLAUDE.md`, `docs/CLAUDE.md`, and `.memory/CLAUDE.md` are each exactly this one line:

````markdown
@AGENTS.md
````

### 12.3 `PROJECT.md`

````markdown
# <Project name>

> Seed template. Fill this with stable project identity and verified references. Keep active tasks in the chosen tracker.

## Purpose and intended outcome

- Purpose: `<Why this Salesforce project exists.>`
- Intended outcome: `<What success means to the owner and users.>`

## Scope and boundaries

- In scope: `<Business capabilities or systems this project owns.>`
- Outside scope: `<Important exclusions or adjacent owners.>`
- Constraints: `<Approved security, delivery, or operating constraints with sources.>`

## Systems and environments

| System or org | Purpose | Environment | Source of truth | Access notes |
| --- | --- | --- | --- | --- |
| `<name>` | `<role>` | `<sandbox, production, etc.>` | `<verified location>` | `<how access is managed>` |

## People and ownership

| Role | Person or team | Responsibility | Source / last confirmed |
| --- | --- | --- | --- |
| `<role>` | `<name or unknown>` | `<decision or operating responsibility>` | `<source and date>` |

## Work and project records

- Work tracker: `<one canonical service/project or local path>`
- Project roadmap: [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md)
- Functional requirements: [requirements/](requirements/)
- Design home: `With its work item: local DESIGN.md or the external item's own record or attachments.`
- System Guide: `<configured path or disabled>`
- Local memory: `.memory/` (Second Brain V2, flat, Git-ignored; see `.toolkit-memory.json`)
- Memory backup or sync: `<Owner-approved destination and restore procedure, outside this repository>`

## Resources and project paths

- Salesforce source: `force-app/` or `<actual source path>`
- Deployment manifests: `<actual path when configured, or not configured>`
- Tests and checks: `<actual commands and locations>`
- Outside references: `<source register or approved location>`

## Operating conventions

`<Only project-specific conventions that are stable and not already owned by a skill or rule. Link to the authority.>`
````

### 12.4 `PROJECT-ROADMAP.md`

````markdown
# Project roadmap

Use this file for the project's phases and deliverable-sized work units. Link each unit to its work item when one exists. The work item holds its active requirements, open questions, detailed tasks, and execution history.

```text
PROJECT-ROADMAP.md
└── Phase
    └── Deliverable-sized work unit
        └── Linked work item
            ├── Active requirements
            ├── Open questions
            ├── Detailed tasks
            └── Execution history
```

## Project outcome

`<What completing this project should accomplish for its users or owner.>`

## Phase overview

| Phase | Intended outcome | Exit condition | Depends on |
| --- | --- | --- | --- |
| `P01 — <phase name>` | `<result>` | `<evidence needed to finish>` | `<earlier phase or none>` |

## P01 — <Phase name>

**Outcome:** `<Result larger than one work unit.>`  
**Exit condition:** `<Observable evidence that the phase is complete.>`  
**Dependencies:** `<Real prerequisites, or none known.>`

### P01-U01 — <Deliverable-sized work unit>

**Deliverable:** `<Specific output or change from this unit.>`  
**Done when:** `<Evidence for completing the unit.>`  
**Depends on:** `<Other unit or none.>`  
**Linked work item:** `<Link to the canonical issue or local WORK-ITEM.md when created.>`

The linked work item owns its active requirements, open questions, detailed tasks, approvals, and execution history. Summarize only project-level sequencing here.

## Open project-level planning questions

- `<Question about phase scope, order, dependencies, or milestones; identify who can answer it.>`

## Planning changes

- `<Date and source>: <Material approved change to project outcome, phase scope, or sequence.>`
````

### 12.5 `.work-items/work-item-template/WORK-ITEM.md`

````markdown
---
id: WI-001
title: <Work item title>
type: <Work item type>
status: <Backlog | In Progress | Blocked | Done>
stage: <Current lifecycle stage>
active_phase: P1
requirements_status: refining
design: <Link to design, if one exists>
---

# WI-001: <Work item title>

## Overview

**Goal:** <The outcome this work item is meant to achieve.>

**Current position:** <What has been completed and where work stands now.>

**Next action:** <The next specific action and its owner.>

**Blockers:** <Blocking decision or dependency, or “None.”>

**Related items:** <Roadmap, parent work item, design, or external links.>

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result |
|---|---|---|---|
| P1 — <Phase 1 name> | <What this phase establishes> | In Progress | <Evidence that P1 is complete> |
| P2 — <Phase 2 name> | <What this phase delivers> | Not Started | <Evidence that P2 is complete> |

## Tasks

### P1 — <Phase 1 name>

- [ ] **P1-T01 — <Task 1 name>** · In Progress  
  **Work:** <The action to take.>  
  **Deliverable:** <The file, decision, or other result.>  
  **Done when:** <The observable completion check.>  
  **Depends on:** <Task ID or “None.”>
- [ ] **P1-T02 — <Task 2 name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The expected result.>  
  **Done when:** <The observable completion check.>  
  **Depends on:** P1-T01.

### P2 — <Phase 2 name>

- [ ] **P2-T01 — <Task 1 name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The expected result.>  
  **Done when:** <The observable completion check.>  
  **Depends on:** P1 completion.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| <YYYY-MM-DD> | <What happened> | <What changed or what happens next> |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | <Specific unanswered question> | R-01, P1-T02 | Open | <Person or role> |

## Requirements

**Overall status:** Refining  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

<The owner’s original request, in their words or a faithful short summary.>

### Agreed goal

<The outcome the owner has agreed this work item should deliver.>

### Active requirements

#### R-01 — <Required outcome>

**Status:** <Refining | Finalized | Superseded>  
**Applies to:** <Who or what is affected, and when this requirement applies.>  
**Required behavior:** <Exactly what must happen or be true.>  
**Boundaries and exceptions:** <Where the requirement does not apply, or “None identified.”>  
**Acceptance check:** <What someone can observe to confirm this requirement is met.>  
**Decision record:** <Source of the requirement; if Finalized, who approved it and when. If Superseded, link to its replacement.>  
**Open questions:** <Question IDs or “None.”>

#### R-02 — <Required outcome>

**Status:** <Refining | Finalized | Superseded>  
**Applies to:** <Who or what is affected, and when.>  
**Required behavior:** <Exactly what must happen or be true.>  
**Boundaries and exceptions:** <Exceptions or “None identified.”>  
**Acceptance check:** <Observable proof.>  
**Decision record:** <Source and approval details.>  
**Open questions:** <Question IDs or “None.”>

### Acceptance

This work item can be accepted when:

1. <Overall result that must be delivered.>
2. <How the completed result will be checked.>
3. <Any required documentation, handoff, or owner review.>

## Notes

### Decisions and context

- <Useful decision or context that is not itself a requirement.>

### Resume here

<Where the next person or session should pick up.>

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>
````

### 12.6 `.work-items/work-item-template/DESIGN.md`

````markdown
# WI-001: <Work item title> — solution design

Status: proposed  
Requirements: [WORK-ITEM.md](WORK-ITEM.md)  
Date: <YYYY-MM-DD>

## What this solves

<Who uses the result, what they are trying to do, and what must be true when it is done. Link to the agreed goal rather than repeating every requirement.>

## What exists today

<For an existing build, describe verified current behavior in this area, link to the relevant files or configuration, and say where it falls short. For a new project, state that nothing exists yet.>

## Design philosophy

<State the owner’s chosen approach: use built-in mechanisms first when they meet the requirements, or explain the chosen specialized approach.>

## Preparation

- **Requirements readiness:** <Whether the requirements are ready to design from; remaining gaps or owner rulings; links to the corrected requirements. Do not use design text to fill a requirements gap.>
- **Way of working:** <Interview or scan first; how many options will be designed and what differs between them.>
- **Team:** <Agreed roles, models, scope, and expected returns, if helpers are used.>
- **Constraints:** <Applicable project, platform, timing, and approval boundaries.>

<Keep settled preparation here. Put unresolved discussion, decisions needing context, and the exact next action in Notes.>

## Option A: <Short name>

### Summary

<In three to five plain-language sentences, explain the proposed approach and why it fits the agreed goal.>

### How each requirement is met

#### R-01 — <Requirement heading from WORK-ITEM.md>

- **Build or reuse:** <Exact component, setting, or mechanism and whether it is new, changed, or reused.>
- **Why this satisfies it:** <Explain how the approach produces the required behavior.>
- **How to check it:** <Test or observation that proves this requirement works.>

#### R-02 — <Requirement heading from WORK-ITEM.md>

- **Build or reuse:** <Exact component, setting, or mechanism and whether it is new, changed, or reused.>
- **Why this satisfies it:** <Explain how the approach produces the required behavior.>
- **How to check it:** <Test or observation that proves this requirement works.>

### What the person experiences, start to finish

1. <First step in the experience.>
2. <Next step, including what happens if the action fails or cannot proceed.>
3. <Final result and what the person sees or receives.>

### Components and files touched

| Component or file | New, changed, or reused | What changes |
| --- | --- | --- |
| <Real component or file name> | <New / Changed / Reused> | <Specific responsibility or change> |

### Order of work

1. <First thing to build and why it comes first.>
2. <Next thing to build and how it depends on the first.>

### Risks and tradeoffs

- <Risk, how likely it is, what it would cost, and what reduces it.>
- <Tradeoff the owner should understand before choosing this option.>

### Sources

| Claim in this design | Source | Date | Label | Verified how |
| --- | --- | --- | --- | --- |
| <Claim that affects the design> | <Exact link or project path> | <YYYY-MM-DD> | <Official documentation / Project evidence / Community claim> | <How the claim was checked> |

<Use verified sources. A community claim is not treated as fact until checked against official documentation, project evidence, or a test.>

<!-- If the owner wants several options, add Option B, Option C, and so on as top-level sections, each with the same inner headings. Keep all options in this one design file. -->

## Where a builder could misread the requirements

| Requirement | Wrong reading | Intended reading, and what this design does |
| --- | --- | --- |
| R-01 | <Plausible but incorrect interpretation> | <Correct interpretation and the design choice that makes it clear> |

<!-- Include Recommendation only when there is more than one option. -->

## Recommendation

<If there is more than one option, state which one is recommended, why, and what the owner gives up by choosing it. Remove this section for a single-option design.>

<!-- Include this section only for an existing build. -->

## Should the existing build be replaced?

<Yes or no, and why. If yes, explain the cost of a rewrite and why extending the current build serves the requirements worse. Remove this section for a new project.>

## Notes

- **Decisions:** <Relevant choice, proposed or approved status, who decided and when if known, and source. Link to the settled design text.>
- **Still open:** <Unanswered questions, unresolved review findings, and remaining design-document tasks. For each, record who must answer or act, its status, what it affects, and the next step.>
- **Resume here:** <Exact section or question and the next action.>

<Update settled answers in the design above. Saving this draft does not approve the design or authorize implementation.>
````

### 12.7 `requirements/AGENTS.md`

````markdown
# Functional requirements

Keep one maintained file per durable business area, following AREA-TEMPLATE.md. Record agreed functional behavior and its conditions, exceptions, and source. The active work item owns proposed changes, open questions, detailed tasks, and execution history. Update the area file at the agreed lifecycle point after confirming what was delivered. Link a design or work item when it explains a requirement; do not copy their task history here.
````

### 12.8 `requirements/AREA-TEMPLATE.md`

````markdown
# <Functional area>

## Purpose and scope

<Describe the capability and users covered here. State meaningful exclusions and adjacent owners.>

## Functional behavior

### <Stable rule ID> — <Behavior or rule name>

- Trigger or context: <When this behavior applies.>
- Required behavior: <What the system must do in observable terms.>
- Conditions and exceptions: <When the behavior changes or does not apply.>
- User or system outcome: <What should be visible or produced.>
- Source: <Approved decision, work item, or other authoritative record.>
- Delivery status and evidence: <Current delivered behavior, or a clearly labeled approved future requirement, with linked validation.>

## Data and access rules

<Business-owned fields, definitions, access expectations, and privacy constraints that apply to this area. Link to shared definitions rather than duplicating them.>

## Integrations and dependencies

<Other capabilities or systems this area depends on, including the owning records.>

## Acceptance evidence

<How the behavior is confirmed, including important examples or tests. Link to evidence when available.>

## Change history

- <Date — approved change — source or linked work item.>
````

### 12.9 `requirements/SYSTEM-DATA-MODEL.md`

````markdown
# System Data Model

[Details about system data model design go here. This is a living document for finalized data model requirements]
````

### 12.10 `docs/AGENTS.md`

````markdown
# Project documentation

Keep a solution design with its work item: `DESIGN.md` beside a local `WORK-ITEM.md`, or the design in the external item's own record or attachments. Do not create a separate `docs/designs/` copy. Use `system-guide/` for an evidence-based explanation of the current system. Keep client-provided architecture material in `delivery/references/` and link to it from the work-item design or guide. Use `toolkit-manual.md` to document only the Toolkit systems selected for this project. Keep accepted functional behavior in `requirements/` and current tasks in the chosen tracker.
````

### 12.11 `.claude/settings.json`

````json
{
  "autoMemoryEnabled": false,
  "enabledPlugins": {
    "second-brain@claude-toolkit": false
  },
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/memory_trigger.py\"",
            "timeout": 5
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/memory_audit.py\"",
            "timeout": 5
          }
        ]
      },
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$CLAUDE_PROJECT_DIR/tools/kb/graph_freshness_hook.py\"",
            "timeout": 60
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/toolkit-session-start.mjs\"",
            "timeout": 10
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash|PowerShell",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/guard-protected-orgs.js\"",
            "timeout": 90
          },
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/guard-permission-set-deploy.js\"",
            "timeout": 30
          }
        ]
      }
    ]
  },
  "outputStyle": "Plain English",
  "permissions": {
    "deny": [
      "Bash(git add -A)",
      "Bash(git add -A *)",
      "Bash(git add --all)",
      "Bash(git add --all *)",
      "Bash(git add .)",
      "Bash(git add . *)",
      "Bash(git commit -a *)",
      "Bash(git commit -am *)",
      "Bash(git commit --all *)",
      "Bash(git commit --no-verify *)",
      "Bash(git commit * --no-verify)",
      "Bash(git commit * --no-verify *)",
      "Bash(git commit -n *)",
      "Bash(git commit * -n)",
      "Bash(git commit * -n *)",
      "Bash(git push --force *)",
      "Bash(git push * --force)",
      "Bash(git push * --force *)",
      "Bash(git push -f *)",
      "Bash(git push * -f)",
      "Bash(git push * -f *)",
      "Bash(git push --force-with-lease*)",
      "Bash(git push * --force-with-lease*)",
      "Bash(sf project delete source *)",
      "Bash(sfdx force:source:delete *)",
      "Bash(sf org delete *)"
    ],
    "ask": [
      "Bash(git reset --hard *)",
      "Bash(git clean *)",
      "Bash(sf project deploy start *)",
      "Bash(sf data create *)",
      "Bash(sf data update *)",
      "Bash(sf data delete *)",
      "Bash(sf data import *)",
      "Bash(sf data upsert *)",
      "Bash(sf apex run *)"
    ]
  }
}
````

### 12.12 `.codex/hooks.json`

````json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "node \".claude/hooks/toolkit-session-start.mjs\"",
            "commandWindows": "powershell.exe -NoProfile -Command \"node .claude/hooks/toolkit-session-start.mjs\"",
            "timeout": 10,
            "additionalContextLimit": 1000,
            "statusMessage": "Reading Toolkit orientation route"
          }
        ]
      }
    ]
  }
}
````

### 12.13 `.claude/RULES.md`

````markdown
# Project rules index

Claude Code loads unscoped files in `.claude/rules/` at session start and path-scoped files when matching content is read. Codex reaches the same rules through the pointers in root `AGENTS.md`. This index is outside the auto-loaded rules folder.

| Rule | When it applies |
| --- | --- |
| `memory-curator-dispatch.md` | V2 memory decisions, current focus, and curator handoff. |
| `parallel-agent-sessions.md`, `knowledge-direct-commit.md` | Work in a copied Git project and authorized documentation publication. The second rule is path-scoped. |
| `offer-context-handoff.md`, `work-item-stages.md` | Long sessions and active work. The chosen tracker remains an init decision. |
| `plain-english-artifacts.md`, `humanize-outbound-text.md` | Human-facing artifacts and outbound text. |
| `ai-external-knowledge.md` | Captured outside documentation; path-scoped to that folder. |
| `delivery-and-knowledge-boundary.md`, `salesforce-safety-guardrails.md`, `salesforce-change-clarify.md`, `deploy-hitchhiker-check.md` | Salesforce delivery and org safety. |
| `component-tracker.md`, `data-change-handoff.md` | Metadata or production data work. Open the paired local skill. |
| `production-data.md`, `deployment-runbook.md` | Files under `delivery/data/` or `delivery/deployment/`; path-scoped. |
| `permissions-source-control.md`, `dependency-graph.md` | Permission metadata or impact analysis; path-scoped and paired with the local tools and hooks. |

The source rules are in Project Init and Hooks Library. Changes here that differ from the current Toolkit are model proposals tracked in issue #419.
````

---

## 13. Full text of the memory system seed and instruction files

### 13.1 `.memory/AGENTS.md`

````markdown
# Local project memory

Keep future sessions oriented without turning every conversation into lasting memory. This folder is the selected Second Brain V2 store. Active topics stay flat; filenames and YAML types agree. Git ignores this folder, so setup must arrange an independent backup or sync.

## Read and route

- Read `CURRENT_FOCUS.md` at startup. Read `MEMORY.md` as a short index, then open relevant topics. Check dates, scope, and the current source before acting on a remembered claim.
- Read `memory-criteria.md` before selecting or changing memory. It names the current onboarding or trusted mode and the default eligibility rules. Use the terminology glossary for project language, including distinct meanings across systems.
- Keep current tasks and owner-mentioned to-dos in `CURRENT_FOCUS.md`, with links to the chosen tracker. Keep full tasks, status, requirements, history, and the work item's design together in that tracker; verified system behavior in the System Guide; procedures in instructions or skills; and raw outside sources in their source folders.

## Curate

- Use a coherent topic file such as `project_account_data_model.md`. Allowed prefixes and matching `metadata.type` values are `user`, `feedback`, `project`, `reference`, and `event`. `project_topic_template.md` is a seed, not a saved memory. Keep one related topic per file and aim for a quick read.
- Record source and date, status, scope, the durable point, why it matters, and how to apply it. Keep uncertainty explicit. Preserve extra YAML fields written by a host or imported record.
- Search for an existing topic before creating one. Correct, merge, or supersede in place where possible. Mark obsolete claims in both file text and index; do not leave an archived item reading as currently open.
- Rebuild `MEMORY.md` with `scripts/memory.py reindex` after a topic change. The index holds one short link per active topic, not the content itself. Keep it below the configured budget.
- Keep `CURRENT_FOCUS.md` under 50 lines by replacing stale sections, not appending. Do not remove an unresolved owner to-do solely to meet that limit.
- Keep the glossary broad through sourced real terms, aliases, and system-specific meanings. Do not invent definitions.

## Authority and completion

- In onboarding, propose substantive lasting-memory changes using the card in `.claude/rules/memory-curator-dispatch.md`. Write only after approval for the stated meaning and operation. An explicit request to remember or correct is authorization for that specific change.
- In trusted mode, routine saves, updates, and recoverable cleanup can proceed within the recorded grant. Ask before ambiguous, bulk, or irreversible deletion of unique content. Only the owner can change the mode.
- A rejected candidate is not saved to another memory, a criteria example, the glossary, or a pending queue. Record only the general selection lesson if the owner gave one.
- Prefer the dedicated curator as writer. Use the local script for lock-protected topic changes, index rebuild, archive, restore, and checks. If delegation is unavailable, the main agent follows the same steps. Never run parallel writers against the same topic.
- Read back changes and run `python3 scripts/memory.py doctor` before reporting success. The curator does not edit requirements, work-item status, designs, deployments, or source code.
````

### 13.2 `.memory/CURRENT_FOCUS.md`

````markdown
# Current focus

Last updated: `<YYYY-MM-DD, source, and person or agent>`

## Current focuses

- `<Current outcome or area; link the roadmap unit or active work item.>`

## Priorities and tasks to complete

- `<Immediate action, owner, and work-item link if one exists.>`

## Owner-mentioned to-dos and open loops

- `<An unresolved request without a ticket; add the ticket link when created.>`

## Upcoming milestones

- `<Absolute date or event, expected outcome, and source.>`

## Recent decisions

- `<Date and one-line decision; link its authoritative record. Keep at most three.>`

## Blockers and waiting on

- `<Blocker, who can resolve it, and when to check again.>`

## Things to be aware of

- `<Time-sensitive concern and source, or none known.>`

## Last 3 things touched

- `<Most recent meaningful artifact or work item, with date and link.>`
- `<Second most recent, or none yet.>`
- `<Third most recent, or none yet.>`

## Next-session handoff

- `<Where to resume, what to read, and the next concrete action.>`
````

### 13.3 `.memory/MEMORY.md` (generated)

````markdown
# Memory index

One short link per active topic. This file is generated by python3 scripts/memory.py reindex; open a topic before relying on it. Seed topic templates are excluded. In a new project, the sections stay empty until the curator saves real memories.

## User


## Feedback


## Project


## Reference


## Event


## Other memory views

- [Current focus](CURRENT_FOCUS.md)
- [Memory criteria](memory-criteria.md)
- [Terminology glossary](terminology-glossary.md)
````

### 13.4 `.memory/memory-criteria.md`

````markdown
---
mode: onboarding
trusted_by: none
trusted_on: none
trusted_scope: none
backup_destination: none
backup_restore_tested_on: none
---

# Memory criteria and trust

This file is the project-specific selection policy. The default mode is **onboarding**. Only the owner can explicitly authorize **trusted** mode; record who granted it, when, and its scope in the frontmatter. Silence, elapsed time, or several approved cards do not change mode. The agent may propose improvements to these criteria during onboarding. Record a correction here as a general rule without copying a rejected memory into this file.

## Default test for lasting memory

Save a topic when it concerns this project, has a credible source, would matter in a future session, would be costly or unreliable to reconstruct, and has no better maintained owner. Prefer updating an existing topic. A short pointer to an authoritative record can qualify when future sessions would otherwise miss that record.

| Type and filename | Usually worth retaining | Route or reject instead |
| --- | --- | --- |
| `user_<topic>.md` | Relevant role, responsibility, working preference, or communication need the owner stated | Personal judgments, irrelevant biography, private details |
| `feedback_<topic>.md` | Repeated or standing correction to how the agent should work; confirmed selection lesson | One-off irritation, a rejected fact restated as policy, an instruction already in `AGENTS.md` |
| `project_<topic>.md` | Durable project constraint, rationale, technical landmark, proven costly fix, or otherwise-unowned decision | Code summary, schema copy, active ticket status, accepted requirement or design body |
| `reference_<topic>.md` | Hard-to-rediscover route to a source, system, dashboard, or decision record, with why to open it | Entire outside page or a path already obvious in `PROJECT.md` or the project map |
| `event_<topic>.md` | Significant project episode: what was done, what resulted, and where the output lives | Routine edit, tool call, raw error, daily progress log |

## Working context is different

`CURRENT_FOCUS.md` holds current focuses, near-term priorities, owner-mentioned to-dos without tickets, milestones, blockers, concerns, recent decisions, and the next-session handoff. It can change often. Link a tracked work item and keep its detailed tasks/status there. Do not turn every open task into lasting memory. Do not discard an unresolved owner to-do merely to shorten the file.

## Never save as lasting memory

- Secrets, credentials, sensitive personal data, transcripts, scratch reasoning, raw logs, dropped guesses, or unsupported claims.
- A fact the same change already places in the authoritative file, unless a small route to that file is genuinely needed.
- Live status, pending approval, unshipped requirements, procedure steps, code restatements, or a current-system explanation that the code/System Guide owns.
- A rejected candidate under a new name or wider wording. A rejection stands until the owner changes it.

## Onboarding: review each lasting change

The main agent shows the exact operation and meaning in the current Toolkit card format: heading, **Change**, **Summary** or **Affected content**, and **Your decision**. No proposal inbox is created. The curator writes only after the owner approves that card or explicitly requests the same save/correction. Current-focus upkeep and faithful glossary updates from already-approved sources proceed without a lasting-memory card. An agent inference is never the owner's decision.

## Trusted mode: routine curation

When the owner explicitly grants it, the agent changes the frontmatter to `mode: trusted` and records the grant. Then the curator may create, update, merge, deduplicate, supersede, archive, and restore routine memory within that scope. Continue to check source and destination; a checkpoint may yield no memory. Ask before ambiguous or irreversible deletion, erasing unique history, or widening the grant. Revocation returns to onboarding immediately. Trusted mode never authorizes changes to requirements, work items, or designs.

## Backup and recovery

This folder is Git-ignored. During setup, record an independent backup or sync destination and the last tested restore date in the frontmatter. A one-time snapshot from `scripts/memory.py backup` does not create an ongoing schedule. Linked worktrees must resolve to one vault. A fresh clone or machine needs its memory restored before the agent treats an empty index as evidence that no memory exists.

## Learned selection guidance

| Date and source | General rule learned | Effect |
| --- | --- | --- |
| `<YYYY-MM-DD and owner correction>` | `<Rule about what counts or does not count, without repeating rejected content>` | `<How selection changes>` |
````

### 13.5 `.memory/project_topic_template.md`

````markdown
---
name: topic-template
description: What future sessions would look here to remember
metadata:
  type: project
status: template
source: <Person, conversation, or document with absolute date>
last_verified: <YYYY-MM-DD or unknown>
authorization: <Approved card or explicit request, or trusted grant>
supersedes: none
---

# <Topic title>

**Remember:** <One durable point or closely related set of facts. State scope and date where needed.>

**Why:** <Why losing this context would change future work or cost meaningful effort.>

**How to apply:** <What the future agent should check or do with this context.>

**Evidence and limits:** <Exact source link or citation; uncertainty and freshness check.>

**Related:** <Authoritative requirements, design, work item, or another memory, when relevant.>

<!-- Rename the copied file to <type>_<topic>.md and set metadata.type to the same prefix. Allowed types: user, feedback, project, reference, event. Remove this comment and replace status: template before saving. -->
````

### 13.6 `.memory/terminology-glossary.md`

````markdown
# Terminology glossary

Record terms whose meanings affect requirements, delivery, or collaboration. Verify definitions from the owner or an authoritative project source. A word used by two systems may need two rows. Update or retire entries when usage changes; never infer a definition from a similar word elsewhere.

| Term | System or context | Meaning here | Distinction or alias | Source | Status / last checked |
| --- | --- | --- | --- | --- | --- |
| <Term> | <System, team, or process> | <Concise verified meaning> | <How this differs from another use, if relevant> | <Decision or source link and date> | <Current or needs review; date> |

## Naming changes and aliases

- <Old term or alias> → <Preferred term in this context>; <reason, source, and date>.
````

### 13.7 `.claude/agents/memory-curator.md`

````markdown
---
name: memory-curator
description: Maintains the selected flat Second Brain V2 memory, current focus, and terminology after the main agent determines the owning record and authorization.
model: opus
tools: Read, Write, Edit, Glob, Grep, Bash
background: true
---

# Memory curator

You maintain only this project's `.memory/` store. Read `.memory/AGENTS.md`, `.memory/memory-criteria.md`, `.memory/MEMORY.md`, and affected topic files before editing. The main agent gives you a self-contained brief; do not assume you can see its conversation. A brief must state the owner's meaning, source/date, requested operation, and approval basis or trusted grant. If one is missing for a lasting-memory change, return a question and write nothing.

## Ownership and judgment

- `CURRENT_FOCUS.md`: current focus, immediate actions, untracked owner to-dos, milestones, recent decisions, blockers, concerns, last three meaningful things touched, and next-session handoff. Keep it under 50 lines by replacing stale sections. Do not lose unresolved owner to-dos.
- `MEMORY.md`: generated index. Every active topic appears once with a short hook; no full facts live here.
- Flat topic files: one coherent topic per `user_`, `feedback_`, `project_`, `reference_`, or `event_` file. The YAML `metadata.type` must match the filename prefix. Use `.memory/project_topic_template.md` for the format. Preserve extra imported YAML fields.
- `terminology-glossary.md`: sourced, system-scoped terms, aliases, and distinctions. A term can have different meanings in different systems.
- `memory-criteria.md`: explicit onboarding/trusted mode and general lessons from the owner's selection feedback. Do not restate rejected content or change trust mode without a direct owner instruction.
- `archive/`: historical topics removed from the active index. Do not leave their text implying they remain active.

Lasting memory should be durable, sourced, significant to future work, hard to reconstruct, and not already maintained in a better owner. A pointer to an authoritative record may qualify. Significant project episodes and costly fixes can qualify; routine commands, task progress, transcripts, code copies, requirements, design bodies, and speculative conclusions do not. A no-write result is valid.

You do not edit requirements, work-item status, the roadmap, technical designs, source code, deployment records, or outside documents. Tell the main agent where misrouted information belongs.

## Authority

- During onboarding, the main agent shows the Toolkit-style card for each substantive lasting change. Accept only the approved meaning/operation or the owner's explicit save/correction instruction. Do not turn a request to view a candidate into approval.
- In trusted mode, routine creation, updates, corrections, merge/deduplication, supersession, archive, and restore are within the recorded grant. Do not infer trusted mode from the passage of time.
- Deleting unique content always needs a specific owner instruction. Ask the main agent about ambiguous, bulk, irreversible, or conflicting changes.
- A correction saying something is not memory removes or corrects that topic and may refine a general criterion. Never hide the rejected content in another file.

## Procedure

1. Search the index, glossary, and likely topic files. Decide whether to update an existing topic, create a distinct topic, update only working context, route elsewhere, or do nothing. Preserve exact owner wording when requested and label uncertainty.
2. Prepare the full replacement topic in a temporary file outside `.memory/`. Include `name`, `description`, `metadata.type`, `status`, `source`, `last_verified`, and `authorization`. Keep the body brief: Remember, Why, How to apply, Evidence and limits, Related.
3. For topic writes, get the file hash with `python3 scripts/memory.py hash <filename>` and call `python3 scripts/memory.py write <filename> --from-file <prepared-file> --expect <hash-or-absent> --authorization <approved-source-or-trusted>`. The script serializes writers, checks stale edits, and rebuilds the index. A failed precondition means reopen and reconcile; never overwrite blindly.
4. Use `python3 scripts/memory.py replace-view` with a hash for current focus, glossary, or criteria. Use the script's `archive`, `restore`, or explicitly authorized `delete` commands for lifecycle work. Do not hand-edit the generated index.
5. Read back each changed file, run `python3 scripts/memory.py doctor`, and report paths and any unresolved routing or authority question to the main agent. Dispatch is not proof of a saved result.

When the host supports background agents, run without stopping the main work. If background work is unavailable, the main agent uses this same procedure in the foreground. Never launch two curators against the same topic at once. Do not commit or push this Git-ignored memory; a separate backup or sync must be configured during setup.
````

### 13.8 `.claude/rules/memory-curator-dispatch.md`

````markdown
# Memory curator dispatch

This rule applies to the main agent. The project uses Second Brain V2, selected in `.toolkit-memory.json`. `.memory/` is the single project memory store. Claude's native auto-memory and V1 Second Brain are disabled for this project. `CLAUDE.md` imports the flat index and current focus at startup; Codex reads them through root `AGENTS.md`. Do not treat a hook reminder as a save decision.

## Decide the destination first

Read `.memory/memory-criteria.md` and the likely owning record. Send current focuses, owner to-dos, and handoff context to `CURRENT_FOCUS.md`; sourced terminology to the glossary; qualifying otherwise-unowned durable context to a topic; active work to the chosen tracker; accepted delivered behavior to requirements; the technical approach to the design kept with its work item; verified current structure to the System Guide; and repeatable procedure to instructions or a skill. Raw external documentation stays in its source folder. A small memory pointer can route future sessions to a hard-to-find authority without copying its body.

Review on explicit remember/forget requests, corrections, standing preferences, meaningful decisions or discoveries, significant fixes or episodes, people/tool/reference changes, focus shifts, work-item completion, and handoffs. The `UserPromptSubmit` hook flags only possible signals. Do not spawn a curator from every regex match or every turn. A review can end with no memory.

## Onboarding card

Until `.memory/memory-criteria.md` says `mode: trusted` with an explicit owner grant, show each proposed substantive lasting-memory change in the conversation. Use the Toolkit's current shape, after the main answer:

---

## Proposed memory saves

### 1. <Short topic title>

**Change:** <Create, update, supersede, archive, restore, or delete; name the existing topic if affected.>

**Summary:** <The exact meaning to retain and its scope, in plain language.>

**Your decision:** Save this understanding? Approve, request changes, or decline.

For a removal or status-only change, use **Affected content** instead of Summary. A merge card names originals and replacement. A yes authorizes the shown operation and meaning only. Silence does not. An explicit owner request to remember, correct, or forget a specific thing is already authorization for that specific change. There is no proposal inbox; hold an unanswered card in the conversation and continue independent work.

If the owner says a proposed item should not be memory, withdraw it. Update only a general selection rule in `memory-criteria.md` if their feedback supplies one; do not restate the rejected fact in criteria, current focus, or another topic. Review similar candidates against that rule from then on.

## Trusted curation

Only an explicit owner grant changes mode. Record the grant person, date, and scope in the criteria frontmatter. In trusted mode, dispatch the curator for routine qualifying lifecycle work. The grant does not cover requirements or work-item changes, and it does not cover ambiguous deletion of unique history. If the owner revokes trust, change mode back to onboarding immediately.

## Dispatch and completion

Prefer the project `.claude/agents/memory-curator.md` agent in the background when the host supports it. Pass a self-contained brief: exact owner statement or approved card, source/date, operation, topic or likely file, related authority, and authorization. The curator searches before creating and uses `scripts/memory.py` for lock-protected writes. The main agent can continue useful work while it runs. If delegation is unavailable, use the same procedure in the foreground.

For a focus-only change or already-authorized glossary maintenance, dispatch without a lasting-memory card. Several independent signals can be grouped into one curator brief; do not run parallel writes against the same topic or index. Wait for the result before claiming a save succeeded. Confirm the readback and doctor result; tell the user briefly what was retained or what needs a decision.
````

### 13.9 `.toolkit-memory.json`

````json
{
  "schema": 2,
  "memory": "second-brain-v2",
  "location": ".memory",
  "activeWriter": "memory-curator"
}
````

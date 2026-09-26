# Model project review

Final review of the model project at
`/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`, written
2026-09-26. The model project itself was not changed. The reviewed version is
the scaffold that `project-setup` (through `toolkit init`) installs:
`plugins/toolkit/scaffold/` and `plugins/toolkit/templates/`, listed file by
file in `plugins/toolkit/scaffold/MANIFEST.json`.

Point of view: Mike is a solo developer. The agent runs the project: it tracks
work, keeps memory, files information in the right place, and generates what
can be generated. Mike makes decisions and steers.

Inputs: `dev/GOAL.md` (wins over everything), `dev/ARCHITECTURE.md` revision 2
(sections 2 to 9, and the calls in section 13), `dev/SKILL-INDEX.md` (skill
names, section 7.2), `dev/research/model-review-draft.md`, and
`dev/research/model-inventory.md`.

Verdict words used below:

- **keep**: installed with the same text.
- **change**: installed with the edits listed.
- **cut**: not installed.
- **add**: new; not in the model.

"Salesforce" in the "Installed when" column means the file installs only in a
Salesforce project. "Local tracker" and "built-in memory" mean the file
installs only when that option is chosen.

## 1. Summary

1. **One instruction file per folder, `AGENTS.md`, and no `CLAUDE.md`
   anywhere.** The model had four `CLAUDE.md` files. All four are cut. Claude
   Code 2.1.277 and later reads `AGENTS.md` itself; Codex always did.
2. **A session-start briefing replaces the `CLAUDE.md` imports and the old
   orientation hook.** The briefing is a plugin hook (not a project file), so
   it works in both hosts, in every worktree, and with every memory system.
3. **The owner's decisions have one place each.** Added: `DECISIONS.md` for
   decisions about the whole project, a `waiting_on` field on every work item,
   and a "What the owner decides" section in `AGENTS.md`.
4. **`AGENTS.md` is generated from a template.** It keeps only the blocks that
   match the setup answers, gains a "Where information goes" table, names the
   V2 skills, carries a "How to write replies" section for Codex and helper
   agents, and lists the rules from their own frontmatter. Installed size: 98
   to 120 lines.
5. **The memory system moved into the toolkit.** `scripts/memory.py`, the
   memory hooks, the curator agent, the dispatch rule, and the runtime test are
   cut. The `toolkit memory` command and the `memory-save`, `memory-find`, and
   `memory-tidy` skills replace them. `.memory/` gets four short seed files,
   and only when built-in memory is chosen.
6. **Work-item templates follow ARCHITECTURE 4.2.** New frontmatter fields,
   six statuses, IDs instead of paths, a Sub-items column. Every body section
   and its guidance text is kept.
7. **Salesforce material installs only in Salesforce projects.** Every
   Salesforce file sits in `scaffold/salesforce/`. General files carry no
   Salesforce wording. The role-hierarchy example in
   `plain-english-artifacts.md` was the last one; it is now a general example
   with the same structure (section 3.3).
8. **Stale names are gone.** No "Second Brain V2", "V1", issue 419, System
   Guide, `docs/toolkit-manual.md`, `.claude/RULES.md`, or current-toolkit
   plugin names in installed files, except where settings turn those plugins
   off on purpose.
9. **Generated files are marked as generated.** `AGENTS.md` rules span,
   `ai-external-knowledge/INDEX.md`, `.work-items/DASHBOARD.md`, and
   `.memory/MEMORY.md` are written by `toolkit` commands and never by hand.
   Init builds the dashboard and `MEMORY.md` as its last step.
   `.work-items/.toolkit-state.json` is state, not generated: it holds the
   highest ID ever used, which cannot be rebuilt.
10. **Files that did not belong in a scaffold are cut:** `.sfdx/` (64 files
    made by the Salesforce VS Code extension), `.vscode/settings.json`,
    `tests/__pycache__/`, and the model's commentary about itself in
    `README.md`.
11. **The owner's edits win, at setup and later.** A file the project already
    has is kept. An existing `AGENTS.md` is not overwritten: init writes the V2
    version next to it as a proposal, and `project-setup` merges it after the
    owner's yes. `toolkit sync` and `toolkit config set` update only files
    nobody changed since the toolkit wrote them; changed files are listed for
    the owner instead. The rules are in `plugins/toolkit/templates/TEMPLATE-LANGUAGE.md`.

## 2. What a decide-and-steer owner needs, and where V2 puts it

| Need | Model | V2 |
| --- | --- | --- |
| Session start: what is going on | `CLAUDE.md` imported focus files (Claude only, main checkout only). The hook printed a list of files to read. | The SessionStart briefing: this worktree's item, active items with the skill that continues each one, what waits on the owner, the current focus, moved items, setup warnings. `toolkit brief` if the hook did not run. |
| "What needs my decision" | Spread across Open Questions tables, requirement statuses, design statuses, memory cards held only in chat. | `waiting_on: owner` on the item, Open Questions "Decision needed from: owner", `toolkit work decisions`, and the `work-decide` skill. |
| Decisions for the whole project | No place except a memory topic. | `DECISIONS.md`, append-only, rows added by `toolkit decision add`. |
| Status outside a session | Nothing for the local tracker. | `.work-items/DASHBOARD.md`, generated. Notion has its board. |
| Where each fact goes | Spread across nine files. | One "Where information goes" table in `AGENTS.md`. |
| Setup choices | Prose placeholders in four files plus `.toolkit-memory.json`. | `.toolkit.json`, written by init. |
| Survives the owner moving files | Links were file paths. | Work items are found by the `id` in their frontmatter. Everything refers to IDs. |

## 3. Verdict for every folder and file

### 3.1 Root files

| Model path | Verdict | Installed when | Reason and edits |
| --- | --- | --- | --- |
| `AGENTS.md` | change | always | Generated from `templates/AGENTS.md.tmpl`. Section 4 has the evaluation and the template. In a repository that already has an `AGENTS.md`, init keeps it and writes the V2 version to `.toolkit-cache/AGENTS.proposed.md`; `project-setup` merges it after the owner's yes. |
| `CLAUDE.md` | cut | never | Mike's decision: `AGENTS.md` only. A `CLAUDE.md` would also stop Claude Code reading `AGENTS.md`. |
| `README.md` | change | always | Lines 5 and 41 to 59 described the model itself (issue 419, "Project Init package in this model", V1 and V2). Cut. The project map and toolkit setup copied `AGENTS.md` and `.toolkit.json`. Cut. Now a short README for people: purpose, how to run and test, links to `PROJECT.md`, the roadmap, `DECISIONS.md`, and `AGENTS.md`. No Salesforce wording. |
| `PROJECT.md` | change | always | Kept Purpose, Scope, Systems, People, Resources. "Why this Salesforce project exists" is now "Why this project exists". "Work and project records" copied tracker and memory choices and named "Second Brain V2": replaced by "Project records", a list of links (`.toolkit.json`, `AGENTS.md`, roadmap, `DECISIONS.md`, `requirements/`). "Operating conventions" is cut: conventions belong in `.claude/rules/`. The owner row is filled at setup. |
| `PROJECT-ROADMAP.md` | change | always | The ASCII tree explaining the method is cut. "Linked work item: `<Link ...>`" is now "Work item: `<Work item ID, when one exists.>`", so moving an item never breaks the roadmap. It names no ID format, because the format depends on the tracker (`WI-12`, `#12`, or a Jira key); `AGENTS.md` gives the format. Roadmap phases stay `P01`; work-item phases stay `P1` (ARCHITECTURE 4.2). |
| `SOUL.md` | cut | never | An empty persona template read at every startup cost a read and invited the agent to treat placeholder text as instruction. Mike's working style is already in his own Claude rules. Open question 2 in section 7. |
| `.toolkit-memory.json` | cut | never | Replaced by `.toolkit.json`, written by init with every setup choice (ARCHITECTURE section 3, call 5). |
| `.gitignore` | change | always, plus Salesforce lines | Split. General lines: `/.work-items/`, `/.memory/`, `/.toolkit-cache/` (new), `/.toolkit-decisions.lock` (new: the lock `toolkit decision add` holds while it writes, so a crashed command never leaves an untracked file), `.claude/worktrees/`, `*.log`, `__pycache__/`, `*.pyc`. Salesforce lines (appended only in Salesforce projects): `.sfdx/`, `.sf/`, `.localdevserver/`, `.claude/.permset-preflight/`, and the four `tools/kb/` outputs. Init appends, so an existing `.gitignore` keeps its lines. |
| `.forceignore` | change | Salesforce | Same two lines; the missing final newline is added. |
| `sfdx-project.json` | change | Salesforce | Adds `"name"` (the project key). `sourceApiVersion` is still not set: its value is the org's API version, which is not known at setup. The permission set runbook says to set it when the org is connected. |
| `.vscode/settings.json` | cut | never | One personal editor setting, not project scaffolding. |
| `.sfdx/` (64 files) | cut | never | Generated by the Salesforce VS Code extension and already Git-ignored. |
| (none) | add `DECISIONS.md` | always | Decisions for the whole project: an append-only table (ID, Date, Decision, Why, Decided by, Replaces). `toolkit decision add` gives each row the next ID under a lock (ARCHITECTURE 4.6, call 8). |

### 3.2 `.claude/`, `.agents/`, `.codex/`

| Model path | Verdict | Installed when | Reason and edits |
| --- | --- | --- | --- |
| `.claude/settings.json` | change | Claude Code, plus Salesforce part | Now two fragments init merges: `templates/settings/claude-base.json` (always) and `claude-salesforce.json` (Salesforce). Base: `outputStyle: "Plain English"`, `autoMemoryEnabled: false`, `worktree.baseRef: "head"`, `permissions.allow: ["Bash(toolkit *)"]`, the model's git deny and ask lists, and `enabledPlugins` with the five V2 plugins on and every `@claude-toolkit` plugin off. Salesforce: `sf-architect-solutioning@toolkit-v2` on, the `sf` deny and ask lists, the two guard hooks, and the graph Stop hook. Cut: the `memory_trigger.py`, `memory_audit.py`, and `toolkit-session-start.mjs` registrations (the toolkit plugin's own hooks do this work now) and `"second-brain@claude-toolkit": false` as the only plugin entry. Merged into an existing file at setup. Afterwards `toolkit sync` changes the file only while nobody has edited it, so a plugin the owner turned off stays off. |
| `.claude/RULES.md` | cut | never | A hand-written index of the rules that cited issue 419. `AGENTS.md` now lists the rules, generated from the rule files (call 9). |
| `.claude/hooks/toolkit-session-start.mjs` | cut | never | Printed a list of files to read and checked for `CLAUDE.md` imports. Replaced by the toolkit plugin's SessionStart briefing. |
| `.claude/hooks/memory_trigger.py`, `_memory_patterns.py` | cut | never | Replaced by the toolkit plugin's UserPromptSubmit hook, which works in both hosts and for every memory system. |
| `.claude/hooks/memory_audit.py` | cut | never | Wrote a diagnostic line on every Stop that nobody read. The toolkit Stop hook blocks once when the owner asked to remember something and nothing was saved. |
| `.claude/hooks/guard-protected-orgs.js` | change | Salesforce | Renamed `.cjs` (it uses `require`, and `.cjs` runs as CommonJS whatever the project's `package.json` says). New `--host codex` flag: Codex fails a hook that answers "ask" and then runs the command, so with the flag every "ask" becomes "deny" with a line telling the agent to hand the command to the owner. Header comment no longer cites project-init Gate 2. |
| `.claude/hooks/guard-permission-set-deploy.js` | change | Salesforce | Renamed `.cjs`. Looks for preflight receipts next to its own folder (`.claude/.permset-preflight/`) instead of relative to the working folder, so it works when a session starts in a subfolder. Accepts `--host codex` (it only ever denies, which both hosts support). |
| `.claude/protected-orgs.json` | change | Salesforce | The comment named "Second Brain V2" and said unknown orgs "ask". The guard code actually blocks unknown orgs when `action` is `deny`; both comments now say so. |
| `.claude/agents/memory-curator.md` | cut | never | ARCHITECTURE section 7 and call 6: the main agent writes memory through the CLI; no curator subagent. |
| `.claude/output-styles/plain-english.md` | keep | Claude Code | Installed from `templates/output-styles/plain-english.md`, a byte-for-byte copy of the current toolkit's file (same as the model's). |
| `.claude/skills/sf-*` (3) and `.agents/skills/sf-*` (3) | change | Salesforce | One source, `scaffold/salesforce/skills/<name>/SKILL.md`; init writes it to both `.claude/skills/` and `.agents/skills/`. Descriptions are the SKILL-INDEX texts. Section 3.10 lists the step edits. |
| `.claude/rules/` | change | see 3.3 | Per-rule verdicts in section 3.3. |
| `.codex/hooks.json` | change | Salesforce, Codex | Only the Salesforce guards now (`templates/codex/hooks-salesforce.json`), with matcher `^Bash$`, the path found through `git rev-parse --show-toplevel` (Codex may start in a subfolder), and `--host codex`. The model's SessionStart entry is replaced by the toolkit plugin's hooks. |
| (none) | add `.codex/config.toml` | Codex | Turns the V2 plugins on and the `@claude-toolkit` plugins off for this project in Codex (`templates/codex/config-base.toml`). An existing file is merged table by table: the V2 plugin tables are added, the `@claude-toolkit` plugins are switched off, and the project's other settings are kept. |
| (none) | add `.codex/rules/toolkit.rules` | Codex | Lets `toolkit` run outside the Codex sandbox without a prompt: it needs the network for Notion and Hindsight and writes the main checkout from worktrees. Checked with `codex execpolicy check`. |

"Claude Code" and "Codex" in the "Installed when" column mean the file
installs only when that host is listed in `.toolkit.json` `hosts` (both by
default). The Salesforce skills follow the same split: `.claude/skills/` for
Claude Code, `.agents/skills/` for Codex. Rules, guard scripts, and
`protected-orgs.json` install for both hosts, because Codex reads the rules
through `AGENTS.md` and its hooks run the same guard scripts.

### 3.3 `.claude/rules/`

All rules keep a correct `paths:` frontmatter where they had one. The list in
`AGENTS.md` is generated from these files.

| Rule | Loads | Verdict | Installed when | Reason and edits |
| --- | --- | --- | --- | --- |
| `ai-external-knowledge.md` | path | change | always | One added line: the index is generated by `toolkit index knowledge`; start a topic's `SOURCE-RECORD.md` from the template. |
| `humanize-outbound-text.md` | always | change | always | Named the `humanizer` skill, which V2 does not ship. Now names `unslop` only. "Project knowledge" is now "project memory". |
| `knowledge-direct-commit.md` | path | change | always | Paths add `DECISIONS.md`. `delivery/**` stays in its `paths:` in every project, because `publish-docs` accepts `delivery/`; it matches nothing outside Salesforce projects. The `.memory/` and `.work-items/` line now says their changes are never committed. |
| `offer-context-handoff.md` | always | change | always | Named `.memory/` files and the "V2 curator". Now: the `handoff` skill updates the work item and focus; lasting saves go through `memory-save`. |
| `parallel-agent-sessions.md` | always | change | always | Ported rule; names `publish-docs`, which V2 ports. One line changed: work item and decision IDs come only from `toolkit work new` and `toolkit decision add`, never numbered by hand. |
| `plain-english-artifacts.md` | always | change | always | Ported general rule. Its heading and naming examples came from a Salesforce design (role hierarchy, View All, permission set). They are now a general example with the same four headings and the same picture words: who can see and edit which projects in a team web app. Every other line is Mike's text, unchanged. |
| `work-item-stages.md` | always | change | always | "Open the `work` skill" is now "use `work-on`"; later answers go through `work-decide`; new line: a decision for the owner goes in Open Questions with `waiting_on` set to `owner` (`toolkit work set` with the local or Notion tracker, the tracker's label with GitHub or Jira); the stage reference is `toolkit work lifecycle`. |
| `memory-curator-dispatch.md` | always | cut | never | 593 words, the largest always-on rule, repeating a policy written in six other files. The approval policy now lives once in the `memory-save` skill; the triggers are the routing lines in `AGENTS.md` and the toolkit UserPromptSubmit hook. |
| (none) | always | add `work-item-folders.md` | local tracker | Rewritten for V2 (ARCHITECTURE 4.3): items found by frontmatter `id`; create with `toolkit work new`; the owner may move, rename, nest, or group folders and the agent adapts through `toolkit work sync` and `work-organize`; nesting makes a sub-item; `archive/` is hidden; ignored files, the generated dashboard, and the state file; never move items on the agent's own initiative. |
| `component-tracker.md` | always | change | Salesforce | Skill named without a `.claude/skills/...` path (Codex reads the `.agents/skills/` copy). Names the work item folder `delivery/deployment/<work item ID>/`. |
| `data-change-handoff.md` | always | change | Salesforce | Skill path removed, as above. |
| `delivery-and-knowledge-boundary.md` | always | change | Salesforce | "With Second Brain V2 selected, curated memory goes in `.memory/`" is now "lasting memory goes through `memory-save`". New line: `delivery/` documents follow `knowledge-direct-commit.md` and `publish-docs`; data files are never committed. `engagement/` support is kept for existing projects that `project-setup` may adopt. |
| `deploy-hitchhiker-check.md` | always | change | Salesforce | Skill path removed. |
| `salesforce-change-clarify.md` | always | change | Salesforce | "Record the decision where the project keeps decisions" is now `DECISIONS.md` with `toolkit decision add`. |
| `salesforce-safety-guardrails.md` | always | change | Salesforce | Enforcement paragraph names `guard-protected-orgs.cjs`, says production and unclassified orgs are blocked (matching the code with `action: deny`), and says Codex blocks where Claude Code asks. |
| `dependency-graph.md` | path | change | Salesforce | "Correct the affected project notes" did not say where. Now: the area files in `requirements/`, open work items, and memory records through `memory-save`. The "V2 curator procedure" lines are gone. |
| `deployment-runbook.md` | path | change | Salesforce | Skill path removed; names the one manual-steps template. |
| `permissions-source-control.md` | path | change | Salesforce | Guard renamed `.cjs`; the runbook pointer is now `docs/permissions-runbook.md` and `docs/salesforce-permissions-research.md`. |
| `production-data.md` | path | change | Salesforce | Skill path removed. It already said no event record file is needed; the load and backup record templates that contradicted it are cut (call 14). |

Not added: the current toolkit's general `dependency-graph.md` for the
graphify code graph. It is conditional on graphify being installed, and the
model did not include it.

### 3.4 `.memory/` (built-in memory only; created from `templates/memory/`)

GOAL.md says init does not copy the model's `.memory/`. Init installs these
seeds instead, only when built-in memory is chosen. With Notion memory,
`toolkit notion ensure-project` writes the same focus and glossary seeds into
the project's two Notion pages. With Hindsight memory, nothing writes the
seeds: the focus and the glossary start empty until the first
`toolkit memory focus --set-file` or `toolkit memory glossary --set-file`.

| Model path | Verdict | Reason and edits |
| --- | --- | --- |
| `.memory/AGENTS.md` | change | 510 words that repeated the policy in three other files. Now about 12 lines: what the folder is, write only through `toolkit memory`, where to look things up, which file is generated, and that `memory-criteria.md` is not edited. |
| `.memory/CLAUDE.md` | cut | No `CLAUDE.md` anywhere. |
| `.memory/CURRENT_FOCUS.md` | change | Nine sections cut to four (call 7): Now, Waiting on the owner, Untracked to-dos, Next session starts with. The dropped sections copied other homes: priorities (tracker), recent decisions (`DECISIONS.md`), milestones (roadmap), last three things touched (Git and the tracker). Seeded with real starting lines, not placeholders, because the briefing prints it. |
| `.memory/MEMORY.md` | change | Not a seed any more. `toolkit memory reindex` generates it. |
| `.memory/memory-criteria.md` | change | Shortened to one page. Kept: the test for what to save, the five types, working context versus memory, never-save list. The "Learned selection rules" table is cut: no `toolkit memory` command writes it, and `.memory/AGENTS.md` says never to edit memory files by hand. An owner correction to what is worth saving is now a `feedback` record, saved with `memory-save`, the same way in all three memory systems. Cut: the onboarding and trusted mode text and its frontmatter (the mode is `.toolkit.json` `memory.approval`; the policy is in `memory-save`), the backup frontmatter (`toolkit doctor` reports the last export age). The `project_` row no longer owns project decisions (`DECISIONS.md` does). |
| `.memory/project_topic_template.md` | change | Moved to `templates/memory/topic-template.md` and not installed: a file named `project_...` inside `.memory/` would look like a real record. Its frontmatter is the one `toolkit memory save` writes (`name` as a hyphenated slug, `type`, `description`, `status`, `superseded_by`, `source`, `saved`, `last_verified`, and `approved_by` when the owner approved); the five body sections are kept. No command reads it: it is a reference copy of one record. |
| `.memory/terminology-glossary.md` | change | The placeholder row is removed so an empty glossary holds no fake term; the table header and guidance are kept. Stays in the memory system (ARCHITECTURE section 7), edited with `toolkit memory glossary`. |
| `scripts/memory.py` | cut | Replaced by `toolkit memory` in the toolkit plugin. It also checked `CLAUDE.md` imports and a V1 plugin id, and wrote to the worktree's own `.memory/`. |
| `tests/test_memory_runtime.py` | cut | A test of toolkit code, not of the project. The toolkit's tests cover `toolkit memory`. |

### 3.5 `.work-items/` (local tracker only; created from `templates/`)

| Model path | Verdict | Reason and edits |
| --- | --- | --- |
| `work-item-template/WORK-ITEM.md` | change | Installed as `.work-items/work-item-template/WORK-ITEM.md` for the local tracker; the plugin copy `templates/WORK-ITEM.md` is the fallback and the Notion body. Frontmatter is exactly ARCHITECTURE 4.2 (`id`, `title`, `type`, `stage`, `status`, `parent`, `waiting_on`, `priority`, `delivery`, `requirements_approved`, `design`, `result_approved`, `updated`); `active_phase` and `requirements_status` are gone; `Blocked` is no longer a status. Body: "Related items" says IDs, never folder paths; the Roadmap table gains a "Sub-items" column (last), with no other change to the Roadmap text; Open Questions "Decision needed from" says `owner`. Every section and its guidance text is kept, including `**Overall status:**` and "Resume here". |
| `work-item-template/DESIGN.md` | change | Gains frontmatter `work_item: WI-001`, `status: proposed`, `approved: no`. "Requirements: [WORK-ITEM.md](WORK-ITEM.md)" is now "Requirements: WI-001". Every other line is kept. |
| (none) | generated `DASHBOARD.md` | Written by `toolkit work sync`, first at init. Never edited by hand. |
| (none) | state `.toolkit-state.json` | Kept by `toolkit work`: the ID-to-path map and the highest ID used. State, not generated (ARCHITECTURE 4.3); `toolkit export` includes it. Never edited by hand. |

### 3.6 `requirements/`

| Model path | Verdict | Installed when | Reason and edits |
| --- | --- | --- | --- |
| `requirements/AGENTS.md` | change | always | Names `SYSTEM-DATA-MODEL.md` as the data model area file; says when to update (stage `14-spec-update`, after the result is approved and delivered); refer to work items and decisions by ID; publish with `publish-docs`. |
| `requirements/CLAUDE.md` | cut | never | No `CLAUDE.md` anywhere. |
| `requirements/AREA-TEMPLATE.md` | change | always | "Stable rule ID" gives a format example (`ACC-01`); sources and change history cite decision and work item IDs. |
| `requirements/SYSTEM-DATA-MODEL.md` | change | always | Used a different placeholder style (`[...]`). Now one `<...>` placeholder saying what goes there and when it is updated. Routed in `requirements/AGENTS.md`. |

### 3.7 `docs/`

| Model path | Verdict | Installed when | Reason and edits |
| --- | --- | --- | --- |
| `docs/AGENTS.md` | cut | never | One paragraph of routing, now in the root table. It repeated the design-home rule a sixth time. |
| `docs/CLAUDE.md` | cut | never | No `CLAUDE.md` anywhere. |
| `docs/toolkit-manual.md` | cut | never | Call 9. It repeated `AGENTS.md`, the memory policy, and `.toolkit.json`, and a copy in every project would become different from the toolkit over time. |
| `docs/system-guide/AREA-TEMPLATE.md` | cut | never | Call 10: System Guide routes removed; its plugin is not ported. |
| `docs/permissions-runbook.md` | change | Salesforce | The HTML "TEMPLATE" setup comment and its "V2 model" note are replaced by two sentences saying where `<SANDBOX>` and `<PACKAGE_DIR>` come from. Pointers to the current toolkit's `library/guides/` are replaced by `docs/salesforce-permissions-research.md`. Guard renamed `.cjs`. |
| (none) | add `docs/salesforce-permissions-research.md` | Salesforce | The research the runbook cites, copied from the current toolkit's project-init library so the runbook's references resolve inside the project. One line changed: it names `docs/permissions-runbook.md` as the runbook. |

A project that is not Salesforce has no `docs/` folder until something is
written there.

### 3.8 `ai-external-knowledge/`

| Model path | Verdict | Reason and edits |
| --- | --- | --- |
| `INDEX.md` | change | Its example row listed `topic-template` as if it were a topic. Now an empty table with a line saying it is generated by `toolkit index knowledge` from each topic's `SOURCE-RECORD.md` and that `topic-template/` is not listed. |
| `topic-template/PAGE-TEMPLATE.md` | keep | |
| `topic-template/SOURCE-RECORD-TEMPLATE.md` | keep | The name matches the real record, `SOURCE-RECORD.md`. The two `delivery/` files with the same name were renamed instead (3.10). |

### 3.9 `tests/`, `scripts/`, `tools/`, `force-app/`

| Model path | Verdict | Installed when | Reason and edits |
| --- | --- | --- | --- |
| `tests/TEST-PLAN-TEMPLATE.md` | change | Salesforce | Moved to `delivery/deployment/release-template/TEST-PLAN-TEMPLATE.md`. For general projects, testing lives in the work item's acceptance checks and the design's "How to check it". Work items named by ID. |
| `tests/__pycache__/` | cut | never | Python bytecode left from a test run. |
| `tests/test_memory_runtime.py` | cut | never | See 3.4. |
| `scripts/memory.py` | cut | never | See 3.4. |
| `tools/kb/` (40 files) | keep, three changes | Salesforce | Call 13: Salesforce kits install with every Salesforce project. Code copied with one text change: the drift file `graph_freshness_hook.py` writes told the agent to check `knowledge/memory/`, a folder V2 does not have. It now says: an area file in `requirements/`, an open work item, or a memory record found with `memory-find`. Its test checks the new wording; all 302 tests pass in a freshly installed project. `README.md` "Installing it in a project" is rewritten: `toolkit init` installs the folder, the `.gitignore` lines, and the Claude Code Stop hook. Codex does not run that hook, so in a Codex session that changed `force-app/`, the agent runs `python3 tools/kb/graph_freshness_hook.py < /dev/null` before the session ends. Known leftover: code comments name the kit's own build item (WI-007) and its SPEC. They are the kit's history, not the project's; cleaning them is a separate task. |
| `tools/permissions/permsets.py` | change | Salesforce | One docstring names the guard `.cjs`. |
| `tools/permissions/README.md` | change | Salesforce | "Project Init's permission set checker" is now "the project's"; the "This model has no connected org" line is now the first-use instruction; names the guard file. |
| `force-app/` (empty) | keep | Salesforce | Git cannot carry an empty folder, so `MANIFEST.json` lists it under `directories` and init creates it. |

### 3.10 `delivery/` (Salesforce only)

| Model path | Verdict | Reason and edits |
| --- | --- | --- |
| `project-overview/brief-template/BRIEF-TEMPLATE.md` | keep | |
| `project-overview/brief-template/SOURCE-RECORD-TEMPLATE.md` | change | Renamed `BRIEF-SOURCE-RECORD-TEMPLATE.md` (three files shared one name). Related record is a `PROJECT.md` section or a work item ID. |
| `references/source-template/SOURCE-RECORD-TEMPLATE.md` | change | Renamed `CLIENT-SOURCE-RECORD-TEMPLATE.md`. The relative path `../../../ai-external-knowledge/` broke when the folder was copied to another depth; it now names `ai-external-knowledge/` at the project root. Related item is a work item ID or requirement area. |
| `references/source-template/SOURCE-NOTES-TEMPLATE.md` | change | Related records named by ID. |
| `communications/message-template/MESSAGE-TEMPLATE.md` | change | Related item is a work item ID or `DECISIONS.md` ID; confirmed decisions go to the work item or `DECISIONS.md`. |
| `meeting-notes/`, `deliverables/` (empty) | keep | Listed under `directories` in `MANIFEST.json`; init creates them. |
| `archive/item-template/ARCHIVE-RECORD-TEMPLATE.md` | keep | |
| `data/area-template/DATA-AREA-TEMPLATE.md` | change | Lists the other two files as "the field mapping file" and "the transformation rules file", since real files are renamed after use. Work items by ID. |
| `data/area-template/FIELD-MAPPING-TEMPLATE.md` | keep | |
| `data/area-template/TRANSFORMATION-RULES-TEMPLATE.md` | change | Work item by ID. |
| `data/data-loads/.gitignore`, `data/production-backups/.gitignore` | keep | Keep data files with record IDs and personal data out of Git. |
| `data/data-loads/load-template/LOAD-RECORD-TEMPLATE.md` | cut | Call 14 (issue 419 requirement 28). The details go in the work item, as `production-data.md` and `sf-data-change` already said. |
| `data/production-backups/backup-template/BACKUP-RECORD-TEMPLATE.md` | cut | Same reason. |
| `deployment/component-tracker.csv` | keep | The single source for manifests. |
| `deployment/_master/PACKAGE-XML-TEMPLATE.md` | change | Said the file is "generated"; the skill says it is kept by hand to match the tracker. Now says that. The header comment gains a member count, which the skill already told the agent to refresh. |
| `deployment/_master/MASTER-DEPLOYMENT-TEMPLATE.md` | change | Points to the one manual-steps template. |
| `deployment/_master/MANUAL-STEPS-TEMPLATE.md` | cut | Two manual-steps templates with different fields, and neither matched the step shape in `sf-component-tracker` Step 4. One template is kept (next rows). |
| `deployment/work-item-template/` | change | Renamed `item-manifest-template/`: the old name collided with `.work-items/work-item-template/`. |
| `.../MANUAL-STEPS-TEMPLATE.md` | change | Rewritten to the skill's step shape: Title, Phase, Order in gaps of 10, Owner, Status, Source, purpose, numbered instructions, verification, inline script. Used for item folders and `_master/`. |
| `.../PACKAGE-XML-TEMPLATE.md`, `.../DESTRUCTIVE-CHANGES-TEMPLATE.md` | change | Say where the real file goes (the work item's folder, named by its ID). |
| `.../DEPLOYMENT-RECORD-TEMPLATE.md` | cut | Not in the skill's folder layout, and its "Validation and result" copied the work item. |
| `deployment/release-template/CUTOVER-PLAN-TEMPLATE.md`, `RELEASE-NOTES-TEMPLATE.md` | change | Work items named by ID. |

Salesforce skills (`scaffold/salesforce/skills/`):

| Skill | Edits |
| --- | --- |
| `sf-deploy-check` | Description is the SKILL-INDEX text. A component's item counts as ready only when its result approval is recorded (`toolkit work show <id>`). Per-item manifests are in `delivery/deployment/<work item ID>/`. The last line said the production guard "asks"; with `action: deny` it blocks, so it now says the owner runs the production deploy after this check. |
| `sf-component-tracker` | Description is the SKILL-INDEX text. Item folders are named by ID only; the tracker's Work Item column holds the ID, never a link or path; the master manifest header count is refreshed; manual steps start from the one template. |
| `sf-data-change` | Description is the SKILL-INDEX text, in quotes so strict YAML parsers accept it. New Step 0: confirm a `data-load` work item with approved requirements exists (`toolkit work show <id>`), else open `work-on`. Step 3 names where the package details go: the item's "Notes > Decisions and context" section (`toolkit work edit`), a one-line history entry, then `toolkit work set <id> --waiting-on owner`. The model's "when starting a copied Git project" line is replaced by one `git check-ignore` check. |

## 4. `AGENTS.md`

### 4.1 Evaluation of the model's `AGENTS.md`

Size: 70 lines, 568 words, 4,152 bytes. That was short enough. The problems
were what it said and what it left out.

| Model line | Text | Problem | V2 |
| --- | --- | --- | --- |
| 1-5 | "Always execute work with the context in mind ..." | Mike's fixed paragraph. Vague: "not adding context that might pollute future agents" can make an agent hold back a save it should make. | Kept word for word at the top, as one paragraph. Open question 1. |
| 9 | "One sentence describing this Salesforce project" | Salesforce wording in the general file, and a placeholder init cannot fill. | The owner-and-agent roles line; purpose lives in `PROJECT.md`. No placeholder is left in the installed file. |
| 9 | "Read `.claude/rules` first." | Claude Code already loads the always-on rules. Codex would read all 18 files, path-scoped ones included. | Generated list of always-on rules (Codex reads them at start) and a path table. |
| 13 | "Read `SOUL.md`, `PROJECT.md`, and `.memory/CURRENT_FOCUS.md` ..." | Empty `SOUL.md`; `PROJECT.md` every session; the focus file is Git-ignored and absent in worktrees, and was also imported through `CLAUDE.md`. | The session briefing, plus "run `toolkit brief`" when it is missing. |
| 14 | "open ... the `work` skill" | Current-toolkit skill name. | `work-on`, `work-status`, `work-decide`, and the other routing lines from SKILL-INDEX 5.4. |
| 15 | "Use `.memory/MEMORY.md` ... Follow `.memory/AGENTS.md`" | Assumed built-in memory. | A Memory section with one block per memory system, and the three memory skills. |
| 16 | "Open only the needed section of `docs/toolkit-manual.md`." | The manual is cut. | Removed. |
| 20-29 | Path-scoped rules table | Hand-written, so it would stop matching the rules' own `paths:`; it listed Salesforce rules in every project. | Generated from each rule's `paths:` between `<!-- toolkit:rules:start -->` and `<!-- toolkit:rules:end -->`. |
| 31 | `.system-guide.json` line | System Guide is not ported. | Removed. |
| 35-46 | Project map | Mixed routing into the map, showed two trackers at once, used "V2", listed folders that may not exist. | The map lists only folders the project has; routing moved to "Where information goes". |
| 50-56 | Tools table | The one row every project needs ("Build, test, or deploy") was a placeholder at the bottom. | "Commands": `toolkit doctor` and a plain line saying the run and test commands are not recorded yet. |
| 58-64 | "Quick saves" | Unclear title; mixed publishing, memory, and tracker. | Folded into "Where information goes". |
| 66-70 | "Where work is tracked" | "Select one" read as an instruction to choose a tracker. | "Work tracking": one block per tracker, filled at setup. |
| (missing) | | No routing table, no owner-decision boundary, no rule to use IDs, no memory block, no decisions log, no reply style for Codex. | All added. |

Kept out of `AGENTS.md` on purpose: rule text that has its own file,
multi-step procedures (skills own them), current status (the briefing owns
it), and unfilled placeholders.

Two HTML comment lines stay in the installed file: the rules span markers.
`toolkit sync` needs them to regenerate only that span (ARCHITECTURE 9, M10).
Codex reads them as plain text; they cost two lines.

### 4.2 The new template

Source: `plugins/toolkit/templates/AGENTS.md.tmpl`. The template language
(tokens, conditional blocks, the generated span) is in
`plugins/toolkit/templates/TEMPLATE-LANGUAGE.md`. Installed size across all 24
combinations of tracker, memory, and Salesforce: 98 to 101 lines without
Salesforce, 117 to 120 lines with it (7,060 to 9,461 bytes), well under Codex's
32 KiB budget and Claude Code's 200-line guidance.

Each tracker block states its own ID format: `WI-12` style for the local and
Notion trackers (the prefix from `.toolkit.json`), `#12` for GitHub, and the
Jira key for Jira. It also says how to set `waiting_on`: `toolkit work`
commands for local and Notion, the labels in the written instructions for
GitHub and Jira. When the owner picks a prefix other than `WI`,
`toolkit config set tracker.idPrefix` renders `AGENTS.md` again, as long as
nobody has edited it yet.

```markdown
Always execute work with the context in mind that the user will likely continue work across multiple AI coding sessions where the session context is cleared and picked up again. You must assist the user in helping establish that continuity across sessions while not adding context that might pollute future agents and skew them. Information must be curated and intentional.

# {{project.name}}

{{project.owner}} owns this project and makes its decisions. The agent runs it: it keeps the work tracker, memory, and project records current, and it does the technical work. What the project is for: `PROJECT.md`.

## Every session

- The session-start hook adds a "Project briefing" to your context: this worktree's work item, active items with the skill that continues each one, what waits on the owner, the current focus, moved items, and setup warnings. If there is no briefing, run `toolkit brief` and read it.
- Anything to build, add, fix, or change, and "keep going": the `work-on` skill.
- "Where are we": `work-status`. "What do you need from me" and approvals: `work-decide`.
- "Remember", "from now on", "forget that": `memory-save`. "What did we decide": `memory-find`.
- Method skills from other plugins (brainstorming, plans, debugging) may run inside these, never instead of them.
<!-- if salesforce -->
- Design work goes through `solution-design`; it opens `sf-architect-solutioning` as its specialist.
- Salesforce org aliases are in `.toolkit.json` under `salesforce.orgs`. Agents never deploy to, validate against, or write data in production; hand the owner the command or the file.
<!-- endif -->
- Codex: at session start, read the always-on rules listed under "Rules". Before editing files in a folder that has its own `AGENTS.md`, read that file.

## What the owner decides

Ask the owner and record the answer before you:
- approve requirements (build and data-load work cannot pass stage `03` without it; requirements count as approved only when the item records the owner's approval with a date);
- choose or approve a design, approve a finished result, or mark work Done or Cancelled;
- merge to the default branch (unless `DECISIONS.md` records a standing merge instruction), deploy, or do anything that cannot be undone;
- spend money, sign in, or change an account.

Do everything else yourself, record it, and report it. When you need a decision, add it to the work item's Open Questions with "Decision needed from: owner" and set the item's `waiting_on` to `owner` ("Work tracking" says how).

## Where information goes

| Information | Home |
| --- | --- |
| New request, idea, or bug | A new work item at stage `01-discovery` (`work-on`) |
| Requirements, questions, tasks, progress, and history of one change | That work item |
<!-- if tracker=local -->
| How a change is built | `DESIGN.md` beside the item's `WORK-ITEM.md` (`toolkit work design`) |
<!-- endif -->
<!-- if tracker=notion -->
| How a change is built | The item's "Solution Design" subpage (`toolkit work design`) |
<!-- endif -->
<!-- if tracker=github -->
| How a change is built | A comment titled "Solution design" on the item's issue |
<!-- endif -->
<!-- if tracker=jira -->
| How a change is built | A comment titled "Solution design" on the item's Jira issue |
<!-- endif -->
| A decision for the whole project | `DECISIONS.md` (`work-decide`) |
| Agreed behavior, after delivery | The area's file in `requirements/`, at stage `14-spec-update` |
| What is in progress, owner to-dos with no work item, where the next session starts | The current focus (`memory-save`) |
| A lasting preference, correction, lesson, or hard-to-find reference | Memory (`memory-save`) |
| Project terms | The glossary (`memory-save`) |
| Outside documentation you capture | `ai-external-knowledge/`, one folder per topic |
| How agents should work in this project | A rule in `.claude/rules/` or a skill, with the owner's yes; never memory |
<!-- if salesforce -->
| Client brief, source file, message, or meeting note | `delivery/`, in the folder for that kind of file |
| Production data load and backup files | `delivery/data/` (never committed) |
| Deploy manifests and manual deploy steps | `delivery/deployment/` (`sf-component-tracker`) |
<!-- endif -->

## Work tracking

<!-- if tracker=local -->
- Tracker: local folders in `.work-items/`, Git-ignored, in the main checkout, shared by every worktree. `.claude/rules/work-item-folders.md` covers folders, moves, and generated files. A sub-item is an item folder nested inside its parent item's folder. It is the only tracker; never copy items into a second tracker or a local list.
- IDs look like `{{tracker.idPrefix}}-12`. Refer to work items by ID, never by folder path. The owner may move or rename item folders; find them by ID and continue. Change `waiting_on`, the stage, and other fields with `toolkit work` commands.
<!-- endif -->
<!-- if tracker=notion -->
- Tracker: the Work Items database on this project's page in Notion (ids in `.toolkit.json` under `notion`). Read and write it only with `toolkit work` commands. The owner may edit cards in Notion; the owner's edits win. Sub-items are Notion sub-items. It is the only tracker; never copy items into a second tracker or a local list.
- IDs look like `{{tracker.idPrefix}}-12` (the card's ID property). Refer to work items by ID, never by link. The owner may move or rename cards; find them by ID and continue. Change `waiting_on`, the stage, and other fields with `toolkit work` commands.
<!-- endif -->
<!-- if tracker=github -->
- Tracker: GitHub Issues. `toolkit work` commands do not write to GitHub; any of them prints the path to the written GitHub instructions. Follow those. Sub-items are GitHub sub-issues. It is the only tracker; never copy items into a second tracker or a local list.
- An item's ID is its issue number, written `#12`. Refer to work items by ID, never by link. Set `waiting_on`, the stage, and other fields with the labels the GitHub instructions name.
<!-- endif -->
<!-- if tracker=jira -->
- Tracker: Jira. `toolkit work` commands do not write to Jira; any of them prints the path to the written Jira instructions. Follow those. Sub-items are Jira sub-tasks. It is the only tracker; never copy items into a second tracker or a local list.
- An item's ID is its Jira key, for example `ACME-42`. Refer to work items by ID, never by link. Set `waiting_on`, the stage, and other fields as the Jira instructions say.
<!-- endif -->
- Stages `01-discovery` to `14-spec-update`, statuses, and approval gates: `toolkit work lifecycle`.

## Memory

<!-- if memory=builtin -->
- System: built-in memory in `.memory/`, Git-ignored, in the main checkout, shared by every worktree. What is worth saving: `.memory/memory-criteria.md`.
<!-- endif -->
<!-- if memory=hindsight -->
- System: the local Hindsight server on this computer, memory bank `{{project.key}}`. Never call Hindsight directly.
<!-- endif -->
<!-- if memory=notion -->
- System: the Memory database on this project's page in Notion.
<!-- endif -->
- Read and write memory only through the `memory-save`, `memory-find`, and `memory-tidy` skills, which run `toolkit memory` commands. Search memory before asking the owner to repeat something. When a save needs the owner's yes: the `memory-save` skill. Never store secrets, email addresses, or work-item status.

## Rules

<!-- toolkit:rules:start -->
(Filled by toolkit init from `.claude/rules/`.)
<!-- toolkit:rules:end -->

## Project map

| Path | What is there, and when to open it |
| --- | --- |
| `PROJECT.md` | Purpose, scope, systems, people. Open for project context. |
| `PROJECT-ROADMAP.md` | Outcome and phases (`P01`), each unit naming its work item ID. Open when planning. |
| `DECISIONS.md` | Decisions for the whole project. Open before changing direction. |
| `requirements/` | Agreed behavior by area. Read `requirements/AGENTS.md` before editing. |
| `ai-external-knowledge/` | Captured outside documentation; `INDEX.md` lists the topics. |
| `.toolkit.json` | Setup choices, such as the tracker and memory system. Change with `toolkit config set`. |
<!-- if tracker=local -->
| `.work-items/` | Work items. `DASHBOARD.md` there is a generated status board. |
<!-- endif -->
<!-- if memory=builtin -->
| `.memory/` | Project memory. Read `.memory/AGENTS.md` before working there. |
<!-- endif -->
<!-- if salesforce -->
| `force-app/` | Salesforce source (`sfdx-project.json`). |
| `delivery/` | Client briefs, references, communications, meeting notes, data, deployment, deliverables, archive. |
| `tools/kb/`, `tools/permissions/`, `docs/` | Metadata dependency graph and permission set checker (each has a `README.md`); the permission set runbook and research in `docs/`. |
<!-- endif -->

## Commands

| Task | Command |
| --- | --- |
| Check the toolkit setup | `toolkit doctor`; the `project-setup` skill fixes what it reports |
| Run the project, run its tests | Not recorded yet. Add the verified commands here. |
<!-- if salesforce -->
| Validate against the sandbox | `sf project deploy validate` with `-x` the item's manifest and `-o` the sandbox alias from `.toolkit.json` |
<!-- endif -->

## How to write replies

Claude Code applies the Plain English output style to chat. Codex and helper agents follow these lines instead.

- Start with the answer, result, or current status. Answer what was asked. Keep it short; add detail when asked.
- Use ordinary words. Explain an unfamiliar term the first time it matters. Use the exact name a system uses, the same way every time.
- Write literally: no metaphors, idioms, jokes, or picture words in place of the real name. State the point directly, without a "not this, but that" setup.
- Use paragraphs for a connected explanation, bullets for separate items or choices, and a heading only when it names what is under it.
- When asking for a decision, name the choice and the difference that matters, and recommend one.
- Use the exact status word: written, built, tested, merged, installed, or seen working. Say something works only when you saw it work.
- Leave out routine narration of process and helper activity. Give one direct line when the owner lost something, an action cannot be undone, work waits on the owner, or there is a cost.
```

## 5. Differences between the model project and what project-setup installs

Every row is one change a person would notice when comparing a fresh project
with the model. "SF" means Salesforce projects only.

| Model | Installed by project-setup | When | What is different |
| --- | --- | --- | --- |
| `CLAUDE.md`, `.memory/CLAUDE.md`, `docs/CLAUDE.md`, `requirements/CLAUDE.md` | nothing | never | Cut. `AGENTS.md` only. |
| `AGENTS.md` (hand-written, 70 lines) | `AGENTS.md` from `templates/AGENTS.md.tmpl` | always | Generated; new sections; V2 skill names; rules list generated; ID format per tracker; no placeholders left; 98 to 120 lines. An existing `AGENTS.md` is kept, and the V2 version is offered as a proposal. |
| `README.md` | `README.md` | always | Short human README; model commentary and duplicated sections cut. |
| `PROJECT.md` | `PROJECT.md` | always | Generic purpose line; "Project records" links replace tracker and memory prose; "Operating conventions" cut; owner row filled. |
| `PROJECT-ROADMAP.md` | `PROJECT-ROADMAP.md` | always | Method diagram cut; units name work item IDs, with no fixed ID format. |
| (none) | `DECISIONS.md` | always | New decision log. |
| `SOUL.md` | nothing | never | Cut from the default scaffold. |
| `.toolkit-memory.json` | `.toolkit.json` (written by init) | always | One file for every setup choice. |
| `.gitignore` | `.gitignore` | always; SF lines only in SF | Split; adds `/.toolkit-cache/` and `/.toolkit-decisions.lock`; appended to an existing file. |
| `.forceignore`, `sfdx-project.json`, `force-app/` | same | SF | Newline fixed; `name` added; empty `force-app/` created by init. |
| `.vscode/settings.json`, `.sfdx/` | nothing | never | Cut. |
| `.claude/settings.json` | `.claude/settings.json` (merged fragments) | Claude Code; SF part only in SF | V2 plugins on, `@claude-toolkit` plugins off; `worktree.baseRef: head`; `Bash(toolkit *)` allowed; memory and orientation hooks removed; SF guards and graph hook only in SF. |
| `.claude/RULES.md` | nothing | never | Cut; `AGENTS.md` lists rules. |
| `.claude/hooks/toolkit-session-start.mjs`, `memory_trigger.py`, `_memory_patterns.py`, `memory_audit.py` | nothing (toolkit plugin hooks) | never | Replaced by plugin hooks in both hosts. |
| `.claude/hooks/guard-*.js` | `.claude/hooks/guard-*.cjs` | SF | Renamed; Codex support; receipt path fixed. |
| `.claude/protected-orgs.json` | same | SF | Comment corrected. |
| `.claude/agents/memory-curator.md` | nothing | never | Cut. |
| `.claude/output-styles/plain-english.md` | same | Claude Code | Same text. |
| `.claude/skills/sf-*`, `.agents/skills/sf-*` | same paths, from one source | SF; `.claude/skills/` for Claude Code, `.agents/skills/` for Codex | New descriptions; ID and approval steps; the data-change package goes into the work item. |
| `.claude/rules/memory-curator-dispatch.md` | nothing | never | Cut; policy in `memory-save`. |
| `.claude/rules/` other 17 files | same names | general always; SF rules in SF | Edits listed in 3.3. `plain-english-artifacts.md` has a general example instead of the Salesforce one. |
| (none) | `.claude/rules/work-item-folders.md` | local tracker | New V2 rule. |
| `.codex/hooks.json` (SessionStart) | `.codex/hooks.json` (SF guards) | SF, Codex | Session hook moved to the plugin; guards added. |
| (none) | `.codex/config.toml`, `.codex/rules/toolkit.rules` | Codex | Plugin switches and the sandbox rule for `toolkit`. An existing `config.toml` is merged table by table. |
| `.memory/` (7 files) | `.memory/AGENTS.md`, `CURRENT_FOCUS.md`, `terminology-glossary.md`, `memory-criteria.md`; `MEMORY.md` generated at init | built-in memory | Shorter; four focus sections; no learned-rules table (corrections are `feedback` records); topic template kept in the plugin. |
| `.work-items/work-item-template/` | same path | local tracker | ARCHITECTURE 4.2 frontmatter and small body changes. |
| `requirements/` (4 files) | 3 files | always | `CLAUDE.md` cut; small edits. |
| `docs/AGENTS.md`, `toolkit-manual.md`, `system-guide/AREA-TEMPLATE.md` | nothing | never | Cut. |
| `docs/permissions-runbook.md` | same | SF | Setup comment and toolkit pointers replaced. |
| (none) | `docs/salesforce-permissions-research.md` | SF | Added so the runbook's references resolve. |
| `ai-external-knowledge/` (3 files) | same | always | `INDEX.md` becomes a generated file. |
| `delivery/` (23 files, 2 empty folders) | 20 files, 2 folders created by init | SF | Load and backup record templates and the deployment record cut; one manual-steps template; three renames; IDs instead of links. |
| `tests/TEST-PLAN-TEMPLATE.md` | `delivery/deployment/release-template/TEST-PLAN-TEMPLATE.md` | SF | Moved. |
| `tests/test_memory_runtime.py`, `tests/__pycache__/`, `scripts/memory.py` | nothing | never | Cut. |
| `tools/kb/`, `tools/permissions/` | same | SF | README install section, the drift file's instructions, and one guard name updated. |

## 6. What installs when

| Answer at setup | Files added |
| --- | --- |
| Every project | `AGENTS.md`, `README.md`, `PROJECT.md`, `PROJECT-ROADMAP.md`, `DECISIONS.md`, `.gitignore`, `.toolkit.json`, 7 general rules, `requirements/` (3 files), `ai-external-knowledge/` (3 files) |
| Host: Claude Code (default) | The output style, `.claude/settings.json` |
| Host: Codex (default) | `.codex/config.toml`, `.codex/rules/toolkit.rules` |
| Tracker: local folders | `.claude/rules/work-item-folders.md`, `.work-items/work-item-template/WORK-ITEM.md` and `DESIGN.md` |
| Tracker: Notion, GitHub Issues, Jira | No extra files. The plugin's templates and written instructions are used. |
| Memory: built-in | `.memory/AGENTS.md`, `CURRENT_FOCUS.md`, `terminology-glossary.md`, `memory-criteria.md`; init then generates `MEMORY.md` |
| Memory: Notion | No project files. `toolkit notion ensure-project` writes the focus and glossary seeds into Notion. |
| Memory: Hindsight | No project files. The focus and glossary start empty. |
| Salesforce | 10 Salesforce rules, 2 guards and their policy file, 3 skills (in `.claude/skills/` for Claude Code and `.agents/skills/` for Codex), `delivery/`, `docs/` (2), `tools/kb/`, `tools/permissions/`, `sfdx-project.json`, `.forceignore`, `force-app/`, the Salesforce settings fragment (Claude Code), `.codex/hooks.json` (Codex), and the Salesforce `.gitignore` lines |

`plugins/toolkit/scaffold/MANIFEST.json` is the exact list: 118 entries, each
with source, target, condition, host (when only one host needs it), mode, and
whether it is a template. `plugins/toolkit/templates/TEMPLATE-LANGUAGE.md`
defines every field and what init, sync, and `toolkit config set` do with it.

## 7. Calls made in this review, and open questions for Mike

Calls from ARCHITECTURE section 13 applied here: 1 (six statuses,
`waiting_on`), 2 (nesting makes a sub-item), 3 (frontmatter fields), 4
(briefing hook replaces `CLAUDE.md` imports), 5 (`.toolkit.json`), 6 (no
curator), 7 (four focus sections), 8 (`DECISIONS.md`), 9 (toolkit manual and
`RULES.md` cut), 10 (System Guide removed), 12 (`delivery/` only in
Salesforce), 13 (Salesforce kits in every Salesforce project), 14 (load and
backup record templates removed), 17 (V2 plugins on per project, V1 off).

Calls this review made that Mike may want to change:

1. **Continuity paragraph.** Kept word for word at the top of every
   `AGENTS.md`, because it is Mike's own text. Remove it for V2?
2. **`SOUL.md`.** Cut from the default scaffold. Keep an empty one in every
   project instead?
3. **Memory criteria.** `memory-criteria.md` installs only with built-in
   memory, and nobody edits it. In every memory system, an owner correction to
   what is worth saving becomes a `feedback` record. With Hindsight or Notion,
   the `memory-save` skill's own list of what belongs in memory applies.
4. **`sourceApiVersion`.** Left out of `sfdx-project.json` because the org's
   version is not known at setup.
5. **`plain-english-artifacts.md` examples.** The Salesforce role-hierarchy
   example is replaced by a general one with the same structure (who can see
   and edit which projects in a team web app), because general files carry no
   Salesforce wording. The rest of the rule is unchanged. Say if you want the
   original example back.
6. **`engagement/` folder support** in the Salesforce rules and skills. Kept,
   so an existing Salesforce project that uses `engagement/` can be adopted.
7. **Plain English style name.** The project copy and Mike's user-level
   style are both named "Plain English" with different text. Which one Claude
   Code applies is not documented; a sample run should check with
   `/output-style`.
8. **`tools/kb/` code comments** still name the kit's build item (WI-007) and
   its SPEC. Left unchanged; a cleanup is a separate task.
9. **Adopting a repository that already has an `AGENTS.md`.** Init keeps the
   file and writes the V2 version to `.toolkit-cache/AGENTS.proposed.md`;
   `project-setup` shows the difference and merges it after a yes. The other
   choice was to append the V2 sections automatically. That was not chosen
   because an older `AGENTS.md` usually names other skills and files, and one
   file would then hold two sets of instructions that disagree.
10. **Hindsight service settings.** The service template, copied from the
    Hindsight research as assigned, turns on Hindsight's MCP tools, including
    the write tools `retain` and `delete_document`. Toolkit V2 never connects
    to Hindsight through MCP; it uses the `toolkit` command. Narrowing the list
    to read-only tools would change both the template and the service already
    installed on this Mac.

## 8. Checks run on the scaffold

A `node:test` suite checks the scaffold:
`plugins/toolkit/tests/scaffold/render.test.mjs`. It runs the install engine
that `toolkit init` and `toolkit sync` use (`lib/project/manifest.mjs`), in
temporary folders, with no environment variables. `MANIFEST.json` is rebuilt
with `node dev/tools/build-manifest.mjs` (`--check` only compares). Last run
(2026-09-26): 31 tests, 31 passed.

- `MANIFEST.json` lists every file under `scaffold/` and `templates/`, every
  listed file exists, every condition, host, and mode is a known one, and a
  file is marked as a template exactly when it holds tokens or markers.
- Every `SKILL.md` and rule has frontmatter that PyYAML, a strict parser,
  accepts.
- All 24 combinations (4 trackers x 3 memory systems x Salesforce or not)
  install cleanly: no unreplaced tokens or markers, no `CLAUDE.md`, no stale
  names (Python and guard scripts included), no Salesforce wording outside
  Salesforce projects except the plugin switches in the two settings files,
  the right ID format for each tracker, `AGENTS.md` at 120 lines or fewer,
  valid JSON settings, valid TOML (`tomllib`), the required `.gitignore`
  lines, and every folder the `publish-docs` skill accepts (including
  `delivery/**`) in the paths of `knowledge-direct-commit.md`.
- A Claude-Code-only project gets no `.codex/` or `.agents/`, also after a
  sync; a Codex-only project gets no Claude Code settings, output style, or
  skills, but keeps the rules and the guard scripts; a `.toolkit.json` with no
  `hosts` gets both hosts.
- Adopting a repository: an existing `AGENTS.md` is kept and a proposal is
  written; an existing `.codex/config.toml` keeps its own settings, gains the V2
  tables, and still parses;
  a dotted-key conflict leaves the file alone and is reported; an existing
  `.gitignore` gains only the missing lines.
- Setup change: a new ID prefix renders `AGENTS.md` and
  `work-item-folders.md` again while nobody has edited them, and leaves an
  edited file alone and names it.
- Sync: a plugin the owner turned off and an `ask` rule he removed stay that
  way; a new rule updates the `AGENTS.md` span without marking the file as
  changed by the owner; an owner edit outside the span is kept.

Other checks:

- `tools/kb` tests in an installed copy, run with `PYTHONDONTWRITEBYTECODE=1`:
  302 run, OK (34 skipped). `node --check` passes on both guard scripts.
- The toolkit's own suites (core, memory, work, Notion, Hindsight client and
  service): 339 tests, 339 passed, after the `WORK-ITEM.md` change.
- An installed local-tracker, built-in-memory project with prefix `AC`:
  `toolkit work new` made `AC-001` from the project's template copy,
  `toolkit decision add` wrote `D-1` to `DECISIONS.md`, `toolkit memory
  status` was clean after `toolkit memory reindex`, and Git ignores
  `.work-items/`, `.memory/`, `.toolkit-cache/`, and `.toolkit-decisions.lock`.
- `WORK-ITEM.md` and `DESIGN.md` parse with the toolkit's frontmatter parser
  and write back byte for byte.
- `codex execpolicy check` on `toolkit.rules`: `toolkit work sync` is
  `allow`; `git status` matches no rule.
- `plutil -lint` passes on the Hindsight plist template with a home folder
  filled in; with Mike's home it equals the installed LaunchAgent byte for byte.
- The guards were run with a fake `sf` command: production deploy denied;
  sandbox deploy asks in Claude Code and is denied with the owner hand-off line
  in Codex; unknown org denied; non-`sf` commands pass silently; the permission
  set guard denies without a receipt and allows with a fresh one when started
  from a subfolder.

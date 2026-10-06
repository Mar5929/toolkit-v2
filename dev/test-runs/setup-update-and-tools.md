# Setup, update, and check tools: checks after the rewrite (TKV-24)

Date: 2026-10-05. Branch: `claude/one-home-setup`. Claude Code 2.1.289, Codex CLI 0.160.0, Node 25. Every command ran from the worktree root unless a row says otherwise. "Seen" means the command ran here and printed the result shown. "Read" means the text was followed by hand, with no live agent session.

`<setup>` is `plugins/toolkit/skills/project-setup/`, `<assets>` is `<setup>assets/`, and `<scratch>` is the session scratchpad folder `build-5b/` (temporary).

## 1. The seven checks

| Check | Result | Seen |
| --- | --- | --- |
| `claude plugin validate .` | Validation passed | Yes |
| `claude plugin validate ./plugins/toolkit` | Validation passed | Yes |
| `claude plugin validate ./plugins/workstreams` | Validation passed | Yes |
| `claude plugin test ./plugins/workstreams` | 14 pass, 0 fail | Yes |
| `node dev/tools/check-skills.mjs` | 23 skills checked (18 in project-setup, 2 beside it in the plugin, 3 from the salesforce folder), 23 rows, passed, 0 errors, 0 warnings | Yes |
| `node dev/tools/check-rules.mjs` | Passed with 2 warnings, the same two as before this work (`salesforce-org-safety.md` size, `session-handoff.md` paragraph length). The byte totals are unchanged: 27050, 27883, 37414 | Yes |
| `node --test 'dev/tests/*.test.mjs'` | 42 tests: 41 pass, 1 fail | Yes |

The one failing test is `session-start, local: with no memory files the index is the model MEMORY.md byte for byte`. It failed before this work too, and the builder of the hooks fixes it on another branch. No other check fails.

## 2. Each restored or tightened check, with a wrong case

Method: a scratch copy of `plugins/`, `dev/tools/`, `dev/build-shared/`, and `dev/SKILL-INDEX.md`; one change; `node dev/tools/check-skills.mjs` (or `check-rules.mjs`); then a fresh copy for the next case. The unchanged copy passes both tools with 0 errors. All seen.

| Check | Wrong case | Result |
| --- | --- | --- |
| The table the agent acts on is the one checked | In `setup-copy.md`, the row "Memory local" changed to name only `memory-local` | Fails: "its skills row "Memory local" names curating-project-memory, using-memory-store, but the folders setup-copy.md gives that choice (memory-local) hold using-memory-store" |
| The hook commands are checked for a command of the retired program | `// run: toolkit doctor` added to `every-project/.claude/hooks/session-start.mjs` | Fails: "names a command of the retired toolkit program on line 77" |
| Only the two storage skills' files may be in two folders | `PROJECT-ROADMAP.md` copied from `work-local/` into `work-notion/` (the old exception allowed this) | Fails: "the project path PROJECT-ROADMAP.md is in work-local and work-notion" |
| A folder under `<assets>` that no row names | `assets/work-jira/NOTE.md` added | Fails: "no row of the table "Folders the choices add" in setup-copy.md names this folder" |
| No file under `<assets>` holds a marker | `<!-- if salesforce -->` and `<!-- endif -->` added to `every-project/README.md` | Fails: "holds a setup marker on lines 37, 39" |
| `check-rules.mjs`: a choice folder with rules must be in `CHOICE_RULES` | `work-local/.claude/rules/test-rule.md` added | Fails: "The setup folder work-local holds rules, but CHOICE_RULES ... does not say which setups get them" |

Root `.gitignore`: files made at `<assets>/salesforce/tools/kb/out/x.json`, `_freshness_stamp.json`, `_drift_pending.md`, `_prev-1.json`, and `__pycache__/a.pyc` did not show in `git status --short`; they were then removed. `git ls-files -ci --exclude-standard` prints nothing, so no tracked file is hidden. Seen.

## 3. The new-project steps as shell commands

Method: `<scratch>/new-project.sh` runs the commands of `setup-copy.md`, `skills-hooks-settings.md` (the snippets merged with `jq`), and `placing-files.md` into an empty Git repository. No services were set up, so the lines left for the Notion, GitHub, and Hindsight steps keep their prompts. All seen.

For all three: 11 "Toolkit settings" lines; valid settings JSON; no marker; no heading with `<Project name>`; the top-level names of the setup copy equal the names of `every-project` and the copied folders; every folder guide has a `CLAUDE.md` holding `@AGENTS.md`; `.agents/skills -> ../.claude/skills`; `git status` lists nothing under `memory/` or `work-items/`.

| Choices | Top level of the project | Skills | Matches the layout in `DESIGN-SPEC.md`, section 3 |
| --- | --- | --- | --- |
| (a) local work, local memory, not Salesforce | `.agents .claude .codex .gitignore AGENTS.md CLAUDE.md DECISIONS.md PROJECT-ROADMAP.md PROJECT.md README.md delivery memory reference sources system tests work-items` | 13 | Yes. `memory/` holds `AGENTS.md CLAUDE.md CURRENT_STATE.md MEMORY.md`; `work-items/` holds `AGENTS.md CLAUDE.md PROJECT-TASKS.md work-item-template`; `delivery/` holds the four folders and no Salesforce template |
| (b) Notion work, Hindsight memory, Salesforce | `.agents .claude .codex .forceignore .gitignore AGENTS.md CLAUDE.md DECISIONS.md PROJECT.md README.md delivery memory reference sfdx-project.json sources system tests tools` | 15 (10 shared, `using-work-tracker`, `using-notion-cli`, 3 `sf-*`) | Yes. `memory/` holds only `CURRENT_STATE.md`; no `work-items/`, no `PROJECT-ROADMAP.md`; rules include `hindsight-memory.md`, `notion-records.md`, and the ten Salesforce rules; hooks include the two guards; `delivery/` holds the Salesforce templates |
| (c) GitHub work, Notion memory, `SOUL.md` | `.agents .claude .codex .gitignore AGENTS.md CLAUDE.md DECISIONS.md PROJECT.md README.md SOUL.md delivery reference sources system tests` | 14 | Yes. No `memory/`, no `work-items/`; rules include `notion-records.md` |

## 4. The update steps against one old-layout project

Method: `git archive origin/main plugins/toolkit | tar -x` into `<scratch>/old-src`; an old-layout project for local work, local memory, and Salesforce built from it by the old steps (the model copied, the marker blocks resolved, the shared skills and the three skill sets copied, the hook commands copied, "Toolkit settings" filled); one file added to each old location; one run of the old session-start hook, so `memory/MEMORY.md` is the generated index; one commit. Then every command of `update.md`, "Find the old layout", was run. Seen: every row of that table that applies to local files hit. The plan below was then written by following "Where each old piece goes". Read, not run by a live agent.

A script checked the plan: the project holds 66 files in the old locations, and each one falls under exactly one row below (0 with no row, 0 with two rows).

```text
Moving Acme Orders to the one-home layout

Nothing changes until you say yes. Nothing is removed before what it held is read back in its new place.

| # | Old location | What is in it | Where it goes | Removed afterwards |
| 1 | `project-wide-records/questions/` | 1 shared question, open (PQ-001, account owner after a merge) | `DECISIONS.md`: 1 Open entry, with a pointer in WI-001 and WI-002 | The file, with `git rm` |
| 2 | `project-wide-records/people/jane-doe.md` | 1 person, with what she may decide | `PROJECT.md`, "People and ownership": 1 row | The file |
| 6 | `requirements/order-management/ORDER-RULES.md` | 2 agreed requirements, approved in WI-001, Q-03 | `DECISIONS.md`: 1 Decided entry for that approval. `system/data-model.md` and `system/security-model.md`: 2 rules marked Approved with that entry | The file |
| 7 | `system-guide/order-management.md` | 2 verified statements, 2026-09-30, acme-dev | `system/data-model.md`: 1 rule marked Built (WI-001). `reference/current-system/order-management.md`: the statement with no known work item | The file |
| 8 | `ai-external-knowledge/` | 1 topic folder (2 files) and `INDEX.md` | `reference/outside-docs/salesforce-flow-limits/`; its row in `reference/outside-docs/INDEX.md` | Nothing: it is renamed. The old `INDEX.md` after its row is copied |
| 9 | `delivery/meeting-notes/`, `delivery/references/` | 2 client files (1 note, 1 PDF) | `sources/`: 2 originals with SRC numbers and rows. I ask before the PDF is committed | Nothing: they are renamed |
| 10 | `delivery/communications/`, `delivery/deliverables/` | 1 email sent, 1 deck sent | `delivery/client-handoffs/`: 2 handoff folders, each with a `HANDOFF.md` | Nothing: they are renamed |
| 11 | `delivery/deployment/` | 1 deployment record (WI-001), `component-tracker.csv` | `delivery/deployments/` | Nothing: they are renamed |
| 12 | `delivery/data/` | 1 data area (accounts), `data-loads/`, `production-backups/` | `delivery/migrations/` | Nothing: they are renamed |
| 14 | `memory/decision_pricing-model.md` | 1 decision, current, approved 2026-09-24, names WI-001 and WI-002 | `DECISIONS.md`: 1 Decided entry. `memory/MEMORY.md`: 1 pointer to it | The file. Git does not track it, so it cannot be brought back. |
| 15 | `memory/project_order-status-values.md` | 1 fact: the five order status values | `system/data-model.md`: 1 rule, marked Draft, with 1 Open entry in `DECISIONS.md` that asks whether it is approved | The file. Git does not track it, so it cannot be brought back. |
| 16 | `memory/terminology-glossary.md` | 1 term (Order), with its source | `system/glossary.md`: 1 row | The file. Git does not track it, so it cannot be brought back. |
| 17 | `work-items/WI-001-order-status/references/` | 1 original (kickoff transcript) | `sources/`: 1 original with an SRC number; the Sources line of WI-001 names it | The file and the empty folder. Git does not track them; the copy in `sources/` is tracked. |
| 18 | `work-items/WI-001-order-status/WI-001.md` | 1 open work item in the earlier form | The same item: the Moved up line, "Lessons not proven yet", Sources in the SRC form, 1 Recent History row | Nothing: it stays |
| 19 | `work-items/WI-002-order-export/WI-002.md` | 1 Done work item | The same item: only a pointer to the entry of row 1 and row 14 | Nothing: it stays |
| 20 | Toolkit files in the old locations | 35 files: `AGENTS.md`, templates, and `.gitkeep` files in `project-wide-records/`, `requirements/`, `system-guide/`, and the old `delivery/` folders; 2 memory templates; the generated `memory/MEMORY.md`; `work-items/work-item-template/references/` | No new home: they hold nothing of yours. `memory/MEMORY.md` becomes the table of pointers | All 35 |

Your call: I will not guess these
| # | Old location | What is in it | Question | Recommended |
| 3 | `project-wide-records/target-architecture/order-sync.md` | 1 target direction, not approved | Rules in `system/`, one `DECISIONS.md` entry, or kept as a source? | 1 Draft rule in `system/integrations/erp.md` with 1 Open entry, because several items will depend on it |
| 4 | `project-wide-records/intake/2026-09-20-kickoff-call.md` | 1 intake receipt for the kickoff notes | Fold it into the source's row, or keep the receipt as a source? | Fold it in: the notes are filed by row 9, and "Used by" gets WI-001 and the entry of row 1 |
| 5 | `project-wide-records/domains/order-management.md` | 1 domain map | Into a `system/` Overview, one entry, or kept as a source? | The Overview of `system/data-model.md` |
| 13 | `delivery/archive/WI-000-pilot/` | 1 archived deployment record | Where does it go? | `delivery/deployments/WI-000-pilot/`, because it is a deployment record |

Not moved: `memory/CURRENT_STATE.md` (your record), `memory/AGENTS.md`, `work-items/PROJECT-TASKS.md`, and the two work item templates (section 3 of the update handles them).
Could not check: nothing.

Shall I make these moves?
```

Section 3 and section 4 of the update handle what is not a record: the five renamed skill folders, the two removed rule files, the rules list in `AGENTS.md`, and "Toolkit settings" (5 lines found; 6 are added with `not used`).

## 5. The plugin in Codex and in Claude Code

```bash
export CODEX_HOME=<scratch>/codex/home
cd <scratch>/codex/empty
codex plugin marketplace add <worktree>      # Added marketplace `toolkit-v2`
codex plugin add toolkit@toolkit-v2          # Added plugin `toolkit`, version 0.8.16
codex debug prompt-input > prompt-input.json
grep -o 'toolkit:[a-z-]*' prompt-input.json | sort | uniq -c
```

Result, seen: exactly three entries from the plugin: `toolkit:choosing-outside-tools`, `toolkit:project-setup`, and `toolkit:writing-harness-files`. None of the 20 project skills is listed. The owner's `~/.codex` and `~/.toolkit-v2-test-homes/codex` were not used. `claude plugin validate ./plugins/toolkit` passes (section 1).

## 6. `skillOverrides` in the repository's settings

Page: `ai-external-knowledge/claude-code/skills.md`, "Load skills in monorepos and subdirectories" (a skill in a `.claude/skills/` folder below the session's folder loads once the agent reads or edits a file there) and "Override skill visibility from settings" (in project settings, an entry is matched against the skill's name; `"off"` hides it from Claude and from the `/` menu; plugin skills are not affected).

Method: the test sign-in, from the worktree root, one session per run:

```bash
CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude claude -p 'Use the Read tool to read the file plugins/toolkit/skills/project-setup/assets/every-project/README.md. After that, print the name of every skill you can invoke with the Skill tool right now, one name per line, exactly as listed to you, including any that were added after the read. Print nothing else.' --allowedTools Read --model sonnet
```

| Run | `.claude/settings.json` | Result | Seen |
| --- | --- | --- | --- |
| 1 | As before this work: `claudeMdExcludes` only | 56 names. The 10 shared project skills are in the list (`braindump` to `session-summary`) | Yes |
| 2 | With `skillOverrides`: the 17 project skill names set to `"off"` | 45 names. None of the 10 is in the list. `toolkit:project-setup` is still there | Yes |
| 3 | The same, reading one file in each of `work-local/`, `salesforce/`, `memory-local/`, and `notion-tools/` | 45 names. No project skill is in the list | Yes |

- Run 1 also printed one name that does not exist (`Notion:tasks:explain-simply`): the model's slip, not a skill.
- No run without the setting read the four folders of run 3, so for those seven names the test shows only that they are absent with the setting.
- The setting matches by name. A skill of the owner's own with one of the 17 names would be hidden in sessions on this repository too. None of his has such a name today.
- The three runs added no plugin, marketplace, or setting to the test sign-in. They left three session transcripts in its `projects/-Users-michaelrihm-Documents-Projects-toolkit-v2--claude-worktrees-one-home-setup/` folder, which did not exist before. Nothing was removed from the test sign-in.

## 7. The new skill, checked against the pages

Every address in `writing-harness-files/references/official-pages.md` was compared with the `SOURCE-RECORD.md` files.

| Address | Result |
| --- | --- |
| `code.claude.com/docs/en/plugins` and `.../plugins-reference` | Old addresses (`claude-code/SOURCE-RECORD.md`, Notes). Replaced by `.../plugins/overview` and `.../plugins/manifest-reference`; a row for the marketplace file added with `.../plugins/marketplace-reference` |
| `code.claude.com/docs/en/changelog` | In the record ("Release notes"), about 940 KB. The weekly page `.../whats-new` added beside it |
| `github.com/openai/codex/releases` | In no record. The record names the repository `github.com/openai/codex`. A `HEAD` request returned 200 on 2026-10-05. Kept |
| Mods | Not in the draft. A row added with `.../plugins/mods/overview` and `.../plugins/mods/reference` (`claude-code/mods/SOURCE-RECORD.md`) |
| Every other address | Each is in a record, as written |

Corrections to `references/checklist.md`:

| Draft | Correction | Page |
| --- | --- | --- |
| "Claude Code reads `CLAUDE.md`. Codex reads `AGENTS.md`." | Claude Code reads `AGENTS.md` by itself when no `CLAUDE.md` or `CLAUDE.local.md` is in the working folder or above it (2.1.277 or later) | `claude-code/memory.md`, "AGENTS.md" |
| A folder's `CLAUDE.md` loads "when it reads or changes a file there" | Kept, and the folder's `AGENTS.md` added: it loads by itself only on a read, and only when the folder has no `CLAUDE.md` | `claude-code/memory.md`, "When Claude Code reads AGENTS.md"; `claude-code/debug-your-config.md` |
| Codex "reads `.codex/hooks.json`" | A `hooks.json` file or `[hooks]` tables in `config.toml`, in `~/.codex/` and the project's `.codex/`; project hooks run only in a trusted project | `codex/hooks.md`, "Where Codex looks for hooks", "Review and trust hooks" |
| "A hooks file of its own wraps its events in a top-level `hooks` key" | Said of a plugin's hooks file | `claude-code/plugins-manifest-reference.md`, "hooks" |
| "The frontmatter of a skill that both products read holds only `name` and `description`" | Codex reads `name`, `description`, and `metadata.short-description`; a field only Claude Code reads does nothing in Codex | `codex/source-skills-parser.md`; `claude-code/skills.md`, "Frontmatter reference" |
| `name`: "lowercase letters, digits, and hyphens, 64 characters or fewer" | Added: no hyphen at the start or end, no two in a row, and neither "anthropic" nor "claude" | `anthropic-agent-skills/agentskills-specification.md`, "`name` field"; `skill-authoring-best-practices.md` |
| "Keep it well inside the length limit the specification gives" | The numbers added: 1,024 in the standard; Claude Code lists 1,536 characters per skill. Codex cuts from the end; Claude Code drops whole descriptions | `agentskills-specification.md`; `claude-code/skills.md`, "Skill descriptions are cut short"; `codex/source-skills-render.md` |
| A skill folder holds `references/`, `assets/`, and `examples/` | `examples/` removed: the standard names `scripts/`, `references/`, and `assets/` | `agentskills-specification.md`, "Directory structure" |
| "a project skill with the name of a built-in command replaces that command" | A personal or project skill; a bundled skill is replaced too | `claude-code/skills.md`, "Resolve skills that share a name" |
| A path-scoped rule "loads when the agent reads or changes a matching file" | "reads, writes, or edits"; and `paths` is the only field read | `claude-code/memory.md`, "Path-specific rules", "Rule frontmatter reference" |
| "A plugin name must not start with `claude-` or `anthropic-`" | Also `anthropics-` and `cc-plugin-` | `claude-code/plugins-manifest-reference.md`, "name" |
| "Raise the version with every shipped change" | The reason added: a set version pins the plugin until it changes | `claude-code/plugins-manifest-reference.md`, "version" |
| "Codex loads every `SKILL.md` under a plugin's `skills/` folder unless a folder above it has a name that starts with a dot" | No captured page says this. Rewritten as what the toolkit's own test saw, with "test it again before you rely on it" | None; `dev/test-runs/one-folder-per-choice.md` |
| "Change the narrowest scope that does the job: local, then project, then user" | The three files and which one wins | `claude-code/settings.md`, "Settings precedence" |
| Not in the draft | Added: Codex's 32 KiB limit; nested `.claude/skills/` loading; a section for mods; where each product keeps a subagent definition | `codex/agents-md.md`; `claude-code/skills.md`; `claude-code/plugins-components.md`; `claude-code/sub-agents.md`; `codex/subagents.md` |

The description is 464 characters. `SKILL.md` is 51 lines; `checklist.md` is 104 lines and starts with `## Contents`.

## 8. Corrections to the guides

| Guide | Was | Now | Page |
| --- | --- | --- | --- |
| `skill-writing-guide.md`, D4 | About 300 to 400 characters, a required ", so ..." clause, the tool fails over 400 | Under 500 (the repository rule and the tool); the standard allows 1,024; the tool tests no why clause | `agentskills-specification.md`, "`description` field"; `claude-code/skills.md`, "Frontmatter reference" |
| The same, D4 | "new projects set `skillListingBudgetFraction` to 0.02" | The default budget is 1%; the starter's settings file sets 0.03 | `claude-code/skills.md`, "Skill descriptions are cut short" |
| The same, H3 | `UserPromptSubmit` for an owner phrase | It also runs on a scheduled task or `/loop` turn, a background subagent's report, and a message from another session | `claude-code/hooks.md`, "UserPromptSubmit" |
| The same, H11 | "every change to `hooks/codex-hooks.json`" | A project's file is `.codex/hooks.json`; a plugin's would be `hooks/hooks.json` | `codex/hooks.md`, "Where Codex looks for hooks", "Plugin-bundled hooks" |
| The same, citations | Codex source at commit `21eb3551`, Codex 0.157.0 | Commit `7c2ce907`, Codex 0.160.0 | `codex/SOURCE-RECORD.md` |
| `rules-best-practices.md`, R12 | A path-scoped rule loads when Claude reads a matching file | Read, Write, or Edit | `claude-code/memory.md`, "Path-specific rules" |
| `platform-best-practices.md`, the Part 1 table | The same | The same | The same |
| `platform-best-practices.md`, the hook events table | `UserPromptSubmit` with no note | It also runs on turns the app starts itself | `claude-code/hooks.md`, "UserPromptSubmit" |

Each guide now says at its top which items were checked on 2026-10-05, and that nothing else in it was checked again that day.

## 9. Line counts

| File | Before | After |
| --- | --- | --- |
| `<setup>references/update.md` | 403 | 595 |
| `<setup>references/move-over.md` | 321 | 332 |
| `<setup>references/setup-copy.md` | 221 | 189 |
| `<setup>references/old-toolkit-pieces.md` | 264 | 276 |
| `<setup>SKILL.md` | 185 | 184 |

## 10. Not run

- No live agent session followed the new setup, update, or move-over text. Sections 3 and 4 are shell commands and a reading.
- The reviews by a separate agent (wording, overlap, best practices) and the routing test in both hosts. One description is new (`writing-harness-files`), so the routing test must run again.
- No Notion, GitHub, or Hindsight call was made. The Notion steps changed in this work (the links on the fixed lines of "Toolkit settings", the glossary page, the view name) were not run.
- `claudeMdExcludes` was not tested. In the session that did this work, which started in another worktree of this repository, the starter's root `CLAUDE.md` and eight of its rule files loaded when a file under `<assets>/every-project/` in this worktree was read.

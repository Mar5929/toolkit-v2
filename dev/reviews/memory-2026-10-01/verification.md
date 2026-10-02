# Memory rebuild: verification (2026-10-01)

Branch `claude/memory`. Line counts are `wc -l`. Paths are under `plugins/toolkit/skills/project-setup/assets/.skill-sets/`. MPM = `memory-process/managing-project-memory`, LOC = `local-memory/storing-project-memory`, NOT = `notion-memory/storing-project-memory`, CLI = `notion-tools/using-notion-cli`.

## Files and line counts

### managing-project-memory (process)

| File | Lines |
| --- | --- |
| `SKILL.md` | 53 |
| `references/current-state.md` | 38 |
| `references/finding.md` | 25 |
| `references/memory-criteria.md` | 34 |
| `references/saving.md` | 113 |
| `references/tidying.md` | 113 |

### storing-project-memory (local version)

| File | Lines |
| --- | --- |
| `SKILL.md` | 40 |
| `references/folders-and-files.md` | 63 |
| `references/record-format.md` | 144 |
| `references/searching.md` | 71 |

### storing-project-memory (Notion version)

| File | Lines |
| --- | --- |
| `SKILL.md` | 55 |
| `assets/concept-record.md` | 4 |
| `assets/current-state.md` | 9 |
| `assets/decision-record.md` | 9 |
| `assets/schema/01-projects-database.json` | 64 |
| `assets/schema/02-topics-database.json` | 36 |
| `assets/schema/03-memories-database.json` | 493 |
| `assets/schema/04-entities-database.json` | 84 |
| `assets/schema/05-facts-database.json` | 262 |
| `assets/schema/06-memories-lore-self-relations.json` | 25 |
| `assets/schema/07-memories-toolkit-columns.json` | 36 |
| `assets/schema/08-memories-type-tags.json` | 25 |
| `assets/schema/09-entities-work-items-relation.json` | 13 |
| `assets/schema/09-facts-work-items-relation.json` | 13 |
| `assets/schema/09-memories-work-items-relation.json` | 13 |
| `assets/schema/10-view-index.json` | 56 |
| `assets/schema/11-view-decisions.json` | 48 |
| `assets/schema/12-view-by-work-item-ids.json` | 42 |
| `assets/schema/12-view-by-work-item.json` | 40 |
| `assets/schema/13-view-retired.json` | 48 |
| `assets/terminology-glossary.md` | 7 |
| `references/current-state-page.md` | 27 |
| `references/database-layout.md` | 219 |
| `references/searching.md` | 91 |
| `references/views-and-layout.md` | 49 |
| `references/writing-pages.md` | 154 |

### using-notion-cli

| File | Lines |
| --- | --- |
| `SKILL.md` | 38 |
| `references/ntn-commands.md` | 162 |

## Rules

Result: 8 pass, 2 fail. Both failures have one cause: review items 1 and 2 (changes to Mike's model files) could not be applied. See "Open" below.

| # | Rule | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Each SKILL.md is under 500 lines | Pass | MPM 53, LOC 40, NOT 55, CLI 38. `check-skills.mjs`: passed, 0 errors. |
| 2 | A file over 100 lines starts with "## Contents" | Pass | Markdown files over 100 lines: MPM `references/saving.md` (113) and `references/tidying.md` (113), LOC `references/record-format.md` (144), NOT `references/database-layout.md` (219) and `references/writing-pages.md` (154), CLI `references/ntn-commands.md` (162). Each has `## Contents` at line 5, straight after its title and one-line purpose. The schema JSON files over 100 lines (`03-memories-database.json`, `05-facts-database.json`) are data, not documents. |
| 3 | References sit one level deep, every file is linked from SKILL.md, no link leaves the folder | Pass | Every file in the four folders is named in its SKILL.md "Files" table, including each `assets/` and `assets/schema/` file. No reference links to another reference as a required next step. No link starts with `../`. `check-skills.mjs` reports no missing, unlinked, or outside link. |
| 4 | Names are lowercase-hyphen, at most 64 characters, no reserved words | Pass | `managing-project-memory` (23), `storing-project-memory` (22, both versions), `using-notion-cli` (16). None holds "anthropic" or "claude". |
| 5 | Descriptions are third person, say what and when, and are under 500 characters | Pass | MPM 477 ("Keeps ... Use whenever ..."), LOC 387 ("Saves, finds ... Use when ... Only for projects with local memory."), NOT 458 ("Stores and finds ... Use when ... Only for projects with Notion memory."), CLI 462 ("Shows how ... Use before any ntn call ..."). Both storage descriptions now say "Not for deciding what to keep or when to ask; use managing-project-memory." The three descriptions match `dev/SKILL-INDEX.md` word for word (checked by `check-skills.mjs`). |
| 6 | No phrase tables | Pass | The only tables are Files tables, MPM `references/current-state.md` (sections and limits), MPM `references/memory-criteria.md` (kinds), LOC `record-format.md` (fields, statuses, marks, labels, links), NOT `database-layout.md` (Lore columns), and the CLI error table. None maps owner phrases to meanings. The "Yes to all" / "Yes except 3" sentences were removed from `tidying.md` (review item 20). |
| 7 | Each procedure is in one file | Fail | Repeats are left only in MPM `references/memory-criteria.md`: lines 21-23 ("Working context is different") repeat `references/current-state.md`, line 3 repeats the owner-instructions and rejected-save lines, and line 7 repeats the one-record-per-concept line in `SKILL.md` (review item 1, blocked). All other repeats found by the review were removed: the proposal mark text now sits once per storage version (LOC `record-format.md` marks table, NOT `writing-pages.md` "A proposal"); the missing-work-item rule only in `tidying.md` line 53; the reasoning-stays-in-the-work-item line only in `saving.md` line 55; the rejected-save, owner-instructions, and approval-mode lines only once; Current State format only in MPM `current-state.md`; Notion calls only in CLI. |
| 8 | No storage words in managing-project-memory | Fail | `SKILL.md`, `saving.md`, `finding.md`, `tidying.md`, and `current-state.md` name no tool, file, folder, database, or command; they say "`storing-project-memory` says". `references/memory-criteria.md` does name storage: file names `user_<topic>.md` to `decision_<short-name>.md` (lines 9-15), `CURRENT_STATE.md` (line 23), and "Where this folder lives" (lines 32-34). It is an exact copy of the model's `memory/memory-criteria.md` (review item 1, blocked). |
| 9 | No process rules in storing-project-memory | Pass | Both versions say where and how memory is stored. The process lines the review found were removed: NOT `SKILL.md` concept-per-record sentence cut to a storage statement, NOT "An item's own decisions" gotcha deleted, LOC "Adding a section to a concept" deleted, NOT "A work item's page id" section deleted. Matches left are storage formats (the `authorization` and `Promoted:` fields) and one local file line that names `memory-criteria.md` (folders-and-files.md lines 18, 43, 45; review item 1). |
| 10 | Every row of the plan's coverage table is present | Pass | See the table below. |

## Coverage table

| Flow | Present at |
| --- | --- |
| Find the concept first; add to it or make a new concept | MPM `references/saving.md`, "Find the concept first" and "Write the change" |
| Local header fields and status values | LOC `references/record-format.md`, "Header fields" and "Status" |
| Consistent layout and the templates (concept, decision, glossary, Current State) | LOC `record-format.md` "Body layout" with the model's `memory/project_topic_template.md`, `decision_template.md`, `terminology-glossary.md`, `CURRENT_STATE.md`; NOT `assets/concept-record.md`, `decision-record.md`, `terminology-glossary.md`, `current-state.md` |
| The index `MEMORY.md`: rebuilt by the start-of-session hook, never by hand | LOC `SKILL.md` "Where memory lives" and `folders-and-files.md` folder picture. MPM `tidying.md` line 24 hands "what in its layout is not a record (an index, a blank form)" to the storage skill. The old refine skill had no separate index check, so none was added. |
| Lessons with Seen dates | MPM `saving.md` "A lesson"; LOC `record-format.md` "Gotchas and lessons"; NOT `database-layout.md` "The page body" |
| Project-wide decisions | MPM `saving.md` "A project-wide decision"; LOC `record-format.md` "Decision files"; NOT `writing-pages.md` "A decision page" |
| Proposals waiting for his answer | MPM `saving.md` "Proposals"; `tidying.md` "Proposals waiting for the owner"; marks in LOC `record-format.md` and NOT `writing-pages.md` |
| Corrections (including the last-verified date, restored by review item 5) | MPM `saving.md` "Correcting a fact"; NOT `writing-pages.md` "Correcting a fact" |
| The glossary | MPM `saving.md` "The glossary"; LOC `record-format.md` "The glossary"; NOT `writing-pages.md` "A glossary row" |
| Instructions for how the agent works go to `.claude/rules/owner-preferences.md` | MPM `saving.md` "The owner's instructions" (once; the duplicate in "Decide the home" was removed) |
| Links to work items (`[[WI-031]]`, Obsidian backlinks) | LOC `record-format.md` "Links to work items"; NOT `database-layout.md` "Links to work items" |
| Approval modes (onboarding, trusted) | MPM `SKILL.md` "Approval" |
| Current State: sections, limits, updates | MPM `references/current-state.md`; LOC `SKILL.md`; NOT `references/current-state-page.md` |
| Tidying | MPM `references/tidying.md` |
| Retire, replace, delete (Mike's wording, once) | MPM `SKILL.md` line 18; Notion trash in NOT `writing-pages.md` "Deleting a page"; local `rm` in LOC `folders-and-files.md` |

## Open

- Review item 1 (local-only text in `memory-criteria.md`, and dropping the model's `memory/memory-criteria.md`) and item 2 (cutting the model's `memory/AGENTS.md`) change Mike's model files. The permission system refused every command in `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`, so nothing was changed there or in the copy under `assets/model/`. Rules 7 and 8 stay failed until Mike approves them. The steps, once he does:

  1. In the model's approved worktree: delete `memory/memory-criteria.md`; remove its line from `memory/MEMORY.md`, "Other memory views"; remove "what is worth saving (`memory-criteria.md`)," from `AGENTS.md` line 61; cut `memory/AGENTS.md` to its purpose line plus "Change and search this folder only through `managing-project-memory`; `managing-work-items` and `handoff` also edit `CURRENT_STATE.md`." Commit as Mike Rihm, by path.
  2. Make `references/memory-criteria.md` in MPM the skill's own file: first column names the kinds (user, project, reference, event, decision) with no file names; delete lines 21-23 and 32-34; remove its entry from `MODEL_COPIES` in `dev/tools/check-skills.mjs`.
  3. Remove the file from LOC `folders-and-files.md` (lines 18, 43, 45), the `--exclude=memory-criteria.md` flags and the mention in LOC `searching.md`, and the "Memory criteria" line in `hooks/session-start.mjs` (line 16). Drop `memory/memory-criteria.md` from `references/update.md` line 77, and add one line saying an existing project's copy is listed and removed only after his yes.
  4. rsync the model into `assets/model/`, run the checks, and raise the toolkit version.
- The routing check in both hosts (review item 21) was not run: it needs live Claude Code and Codex sessions.

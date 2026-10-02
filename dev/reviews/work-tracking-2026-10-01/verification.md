# Work tracking verification, 2026-10-01

Branch `claude/work-tracking`. Skill folders are under `plugins/toolkit/skills/project-setup/assets/`. Line counts are `wc -l` after the review fixes.

## Contents

- Files and line counts
- Rules
- Checks run
- Model changes that need Mike's yes

## Files and line counts

### managing-work-items (the process, the same in every project)

| File | Lines |
| --- | ---: |
| `SKILL.md` | 90 |
| `assets/design-template.md` | 185 |
| `assets/work-item-template.md` | 160 |
| `references/acceptance-checker-brief.md` | 58 |
| `references/builder-brief.md` | 64 |
| `references/building.md` | 166 |
| `references/deploying.md` | 86 |
| `references/design-architect-brief.md` | 58 |
| `references/design-critic-brief.md` | 57 |
| `references/designing.md` | 33 |
| `references/refining-requirements.md` | 73 |
| `references/reflecting.md` | 27 |
| `references/requirements-analyst-brief.md` | 46 |
| `references/researcher-brief.md` | 50 |
| `references/salesforce-deploying.md` | 28 |
| `references/testing-loop.md` | 37 |
| **Total (16 files)** | **1218** |

### tracking-work-items, local version

| File | Lines |
| --- | ---: |
| `SKILL.md` | 43 |
| `references/field-mapping.md` | 160 |
| `references/folders-and-files.md` | 173 |
| `references/searching.md` | 71 |
| **Total (4 files)** | **447** |

### tracking-work-items, Notion version

| File | Lines |
| --- | ---: |
| `SKILL.md` | 65 |
| `assets/schema/01-work-items-database.json` | 270 |
| `assets/schema/02-phases-database.json` | 66 |
| `assets/schema/03-tasks-database.json` | 52 |
| `assets/schema/04-work-items-relations.json` | 38 |
| `assets/schema/05-phases-relations.json` | 13 |
| `assets/schema/06-tasks-relations.json` | 29 |
| `assets/schema/07-work-items-rollup.json` | 20 |
| `assets/schema/07b-work-items-phase-column.json` | 10 |
| `assets/schema/10-view-board.json` | 73 |
| `assets/schema/11-view-by-state.json` | 80 |
| `assets/schema/12-view-all-items.json` | 70 |
| `assets/schema/13-view-roadmap.json` | 78 |
| `assets/schema/14-view-waiting-on-owner.json` | 78 |
| `assets/schema/15-view-phases-by-item.json` | 52 |
| `assets/schema/16-view-open-tasks.json` | 50 |
| `assets/schema/17-view-top-level.json` | 70 |
| `assets/schema/20-item-view-phases.json` | 60 |
| `assets/schema/21-item-view-sub-items.json` | 64 |
| `assets/schema/22-item-view-tasks.json` | 56 |
| `assets/schema/23-item-view-linked-memory.json` | 68 |
| `references/database-layout.md` | 278 |
| `references/ntn-commands.md` | 172 |
| `references/page-layout.md` | 115 |
| `references/searching.md` | 118 |
| **Total (25 files)** | **2045** |

### tracking-work-items, GitHub version

| File | Lines |
| --- | ---: |
| `SKILL.md` | 41 |
| `references/gh-commands.md` | 180 |
| `references/issue-layout.md` | 160 |
| `references/labels.md` | 100 |
| `references/searching.md` | 97 |
| **Total (5 files)** | **578** |

## Rules

Every rule is PASS. Where a rule has an exception, it is named in the evidence.

| Rule | Result | Evidence |
| --- | --- | --- |
| `SKILL.md` under 500 lines | PASS | `managing-work-items` 90 lines (86 after the front matter), local 43 (39), Notion 65 (61), GitHub 41 (37). `check-skills.mjs` fails a body of 500 lines or more and passed. |
| Files over 100 lines start with a contents list | PASS, with two named exceptions | Every Markdown reference over 100 lines has `## Contents` as its first section: `building.md` (166); local `field-mapping.md` (160) and `folders-and-files.md` (173); Notion `database-layout.md` (278), `ntn-commands.md` (172), `page-layout.md` (115), `searching.md` (118); GitHub `gh-commands.md` (180) and `issue-layout.md` (160). Checked by script and by `check-skills.mjs`. Exceptions: the two template copies in `managing-work-items/assets/` (160 and 185 lines) are exact copies of Mike's model templates, and `check-skills.mjs` fails when they differ from the model; the Notion `assets/schema/*.json` files are database definitions, not text Claude reads, and the Notion `SKILL.md` Files table lists each one. |
| References one level deep and all linked | PASS | A script found no file in any of the four folders that `SKILL.md` does not link, and no broken link. No reference holds a Markdown link to another file and none uses `../`. References name each other only in plain text ("`refining-requirements.md`, step 7"), and each named file is itself linked from `SKILL.md`. `check-skills.mjs` checks the same links. |
| Names lowercase with hyphens, 64 characters at most, no reserved words | PASS | `managing-work-items` and `tracking-work-items` are 19 characters each, lowercase letters and hyphens, with no "anthropic" or "claude". All three tracker versions use the name `tracking-work-items`. Enforced by `check-skills.mjs`. |
| Descriptions third person, what and when, under 500 characters | PASS | `managing-work-items` 381 characters, starts "Runs ...", ends with a "Use this whenever ..." sentence. Local 401 ("Saves ..."), Notion 338 ("Stores ..."), GitHub 346 ("Saves ..."), each with a "Use when ..." sentence. No description was changed in this round, and each still matches `dev/SKILL-INDEX.md` (checked by `check-skills.mjs`). |
| Forward slashes only | PASS | A script found no Windows path or backslash separator in any Markdown file. The only backslashes are regular-expression and Notion escapes inside commands (`\*\*Next action:\*\*` in local `searching.md` line 24 and GitHub `searching.md` line 39, and `\<...\>` prompts in the Notion files). |
| No phrase tables | PASS | A script listed all 33 tables in the four folders. None lists owner phrases and what they mean. They hold the State table, hand-offs, file lists, field and property mappings, and label lists. The only quoted first cells (3 rows in GitHub `gh-commands.md`, "What you see") are `gh` error messages, not owner phrases. |
| Each procedure in one file | PASS, with named repeats | A script compared every sentence of 6 or more words across files. This round it found and removed: the failed-deploy lines in `salesforce-deploying.md` (kept in `deploying.md`), the `ntn ... /markdown` command in Notion `searching.md` (kept in `ntn-commands.md`), six copies of "how to start a helper" (now one block in `SKILL.md`), the start rules the briefs repeated from `testing-loop.md`, `building.md`, `deploying.md`, and `designing.md` (the checker's two start lines and its host fallback, the builder's worktree command and Codex steps, the architect's option count, the critic's stop rule and dispute rule, the researcher's parallel start), the Done and Cancelled Current state wording and design-status mapping in the tracking files, the OK list in the model's `AGENTS.md` and rule file, and the three-level rule in the model template and rule. Repeats that stay on purpose: each helper brief repeats its own job-block field names, its "do not approve anything, start other helpers, or ask the owner anything" line, and its "Paste everything from here" marker, because a helper sees only its own brief; and one-line pointers ("handle it as `refining-requirements.md`, step 7, says"). The three tracker versions repeat each other's shape, but a project gets only one. |
| No storage words in `managing-work-items` | PASS | A search of `SKILL.md`, `references/`, and `assets/` for Notion, GitHub, Jira, Obsidian, `ntn`, `gh`, labels, properties, and `work-items/` finds only: "label" in `researcher-brief.md` meaning to name a finding's source type; and "front matter", "bold label", and "never folder paths" in the template copy, which describe the document or tell Claude to use IDs. This round removed "For a local item it creates `work-items/...`", "attach them ... in Notion, GitHub, or Jira" (twice), and the `references/<file name>` example from the template copy, and "Notion memory" from the Current State hand-off. |
| No State logic or templates in `tracking-work-items` | PASS | A search of all three versions for transition words ("Move on", "next State", "moves to", "set the State") and State names finds only the State and Status option lists (Notion `database-layout.md`, GitHub `labels.md`), the spelling of the `state` field, and example values. No tracking file says when to change a State or when to ask the owner for approval. Where a mismatch or a Done or Cancelled write needs a decision, the tracking file says "as `managing-work-items` gives them". No tracking file holds template text: each reads the template text `managing-work-items` opened, or copies the project's own `work-item-template/` form, and the Notion schema files are database definitions. |

## Checks run

| Check | Result |
| --- | --- |
| `claude plugin validate .` | passed |
| `claude plugin validate ./plugins/toolkit` | passed |
| `node dev/tools/check-skills.mjs` | passed, 0 errors, 13 warnings (all on `sf-architect-solutioning` references, which are Mike's text) |
| `node dev/tools/check-rules.mjs --dir plugins/toolkit/skills/project-setup/assets/model` | passed with 2 warnings (the 4 KB limit on `memory-review-and-save.md` and a long paragraph in `session-handoff.md`, both open questions for Mike before this round) |
| `node --test 'dev/tests/*.test.mjs'` | 30 tests, 30 pass, 0 fail |
| Model copy | A dry-run `rsync` before the model commits showed no differences from the model worktree. After the commits the copy was refreshed with the `rsync` in `AGENTS.md`, "Refresh the model copy", and `cmp` shows both template copies in `managing-work-items/assets/` are identical to the model's. |

## Model changes that need Mike's yes

Committed on `toolkit-v2/approved-changes` in `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved` as Mike Rihm, not pushed, then copied into `assets/model/`:

- `f61ccde`: `AGENTS.md` "What the owner decides" now points to `managing-work-items`, "The owner's OK", instead of repeating its list; the same file drops the design and source-file sentences from the Notion, GitHub, and Jira lines (they contradicted the GitHub skill and repeated storage facts); `.claude/rules/keep-work-item-current.md` drops the bullets `managing-work-items` already holds (the heading "Approvals and Done" is now "Approvals"); `.claude/rules/work-item-folders.md` drops the three-level line; `WORK-ITEM.md` drops the three-level sentences and the Done sentence, and names `tracking-work-items` for saving and for making the design.
- `a0c4bf2` and `75a9e3a`: the template's Sources guide and example line no longer name tracker tools or the `references/` folder.

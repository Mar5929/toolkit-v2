# Fix pass on the setup skill, the check tools, the harness skill, and the repository docs

Work item: TKV-24. Branch: `claude/one-home-fix-setup`. Date: 2026-10-05.
The list worked from: `dev/research/layout-audit/FIX-LIST.md`, "Builder B".
The reviews: `dev/reviews/2026-10-05-setup-skill-tools-and-docs-review.md`
(review 3) and findings 3, 20, 21, and 38 of
`dev/reviews/2026-10-05-project-skills-review.md` (review 2).

`<setup>` is `plugins/toolkit/skills/project-setup/`. `<assets>` is
`<setup>assets/`. `<scratch>` is the session scratchpad folder
`build-fix-b/`. Every run below was seen by the builder unless a line says
"not run".

## 1. The findings

### Review 3

| Finding | Status | What changed |
| --- | --- | --- |
| 1 | Fixed | `one-home-layout.md`: step 8 starts by moving the ignored data files with `mv` and checking `git status --short`; the two old `.gitignore` files are named under "Toolkit files"; "Find the old layout" has a row for the data files. |
| 2 | Fixed | `update.md`, "Whose edit a difference is": a file's Git history decides. `one-home-layout.md`, "Toolkit files", uses it for the old `delivery/` templates. |
| 3 | Fixed | `move-over.md` names `update.md`, "7. Checks and report", with its steps. |
| 4 | Fixed | `update.md`, "Before you start": one time for every change to `memory/` and `work-items/` (after the branch landed, section 7, step 5), with one named exception (a fix for a record check finding). Step 2 and the "Missing files" row write each `rsync` command in full. |
| 5 | Fixed | `one-home-layout.md`: step 8 lists the Questions and Answers rows and the lessons, and runs the old-path `grep` on `<main>/work-items` and `<main>/memory`; step 4 names `owner-preferences.md`. |
| 6 | Fixed | The `ai-external-knowledge/` row removes the old `INDEX.md` with `git rm` after its rows are read back. |
| 7 | Fixed | `update.md`, "Whose edit a difference is", with the three commands; the Rules row and the "Other toolkit files" row recommend the toolkit's version for a file with no edit of his. |
| 8 | Fixed | `work-items/PROJECT-TASKS.md` is in "His own records". |
| 9 | Fixed | The row holds the `ntn` query with the Files filter. |
| 10 | Fixed | A rule carried from `system-guide/` takes its Source from the decision found or recorded as the requirement row says; with none, it is Draft. |
| 11 | Fixed | `update.md` is split: `one-home-layout.md` (the old section 6) and `earlier-versions.md` (the three older version sections). Both are in the References table of `SKILL.md`, both have a `## Contents` list, and every reference to a moved section was changed (15 places in 6 files). |
| 12 | Not fixed: waits for the owner | The "Memory approval" line and every "11" stay. |
| 13 | Fixed | `setup-copy.md` no longer deletes lines from `.gitignore`; the file is copied whole. |
| 14 | Fixed | `check-skills.mjs` fails when `skillOverrides` and the project skill names differ (section 3). |
| 15 | Fixed (tested) | Section 7. The patterns did not need a change. |
| 16 | Fixed | The repository `AGENTS.md` has a Layout row for `<assets>/owner-preferences.md` that says why it sits apart; `setup-copy.md` says the same in one sentence. |
| 17 | Fixed | The `project-setup` description names the whole class and marks the phrases as examples; `dev/SKILL-INDEX.md` has the same words. The routing test must run again. |
| 18 | Fixed | The one-home layout is defined at first use in `SKILL.md`, `update.md`, `one-home-layout.md`, `notion-build/setup.md`, and `notion-build/work-setup.md`. |
| 19 | Not fixed: the last build step | The four version fields and `dev/PROGRESS.md` are not this builder's files. |
| 20 | Not fixed here: the other builder's file | The asset was deleted on the other builder's branch. `update.md`, section 4, now tells an update to remove it from an existing project. |
| 21 | Fixed | `git mv -f` in both `delivery/` rows. |
| 22 | Fixed | `one-home-layout.md`, "Old memory kinds and statuses". |
| 23 | Fixed in the setup text | The row says what the page is (the record of the system as observed on its "Last verified" date) and that it names what this project built. The folder guide's own sentence is the other builder's file (section 9). |
| 24 | Fixed | `check-skills.mjs`: a folder in two rows fails, and a folder whose name does not fit its row's choice fails, which catches two swapped folders (section 3). |
| 25 | Fixed | `AGENTS.md`, "Checks", says `CHOICE_RULES` is kept by hand and is a second copy of part of the table. |
| 26 | Fixed | "Never copied" lists only what can be in the copy, with the reason for each. |
| 27 | Fixed | `AGENTS.md`: "The starter project" heading, the "Which skill" table wording, the `ai-external-knowledge/` row with every folder, one list of harness file kinds. `check-skills.mjs`: "tracking folders". |
| 28 | Not fixed: review files are not edited | |
| 29 | Fixed | `DESIGN-SPEC.md`, section 9. |
| 30 | Not fixed: not this builder's to commit | The uncommitted `AGENTS.md` edit in the main checkout ("Challenge the current design", Mike, 2026-10-04) is another session's work. It must be carried when the branch lands. |
| 31 | Fixed | `finishing.md`: in "check the setup", an out-of-date `session-start.mjs` is not run (section 6, last run). |
| 32 | Fixed | The sentence is in one file; the four rows have a command. |
| 33 | Fixed | `finishing.md`, item 5 is its own item; `interview.md` has the two sentences on two lines. |
| 34 | Fixed in the check tool | `check-skills.mjs` compares the hand-kept list in `setup-copy.md` with the Salesforce entries in `every-project/.claude/settings.json` (section 3). A Salesforce-only settings snippet was not made: it changes the other builder's files. |

### Review 2

| Finding | Status | What changed |
| --- | --- | --- |
| 3 | Fixed | The `writing-harness-files` description ends "Not for a line the owner dictates for owner-preferences.md; use curating-project-memory." The body says the same, and what to do in a project with no such skill. |
| 20 | Fixed | One list of the kinds of harness file, the same words in `SKILL.md`, the repository `AGENTS.md` rule, and `README.md`, and the same kinds in the description. `official-pages.md` and `checklist.md` have the two missing kinds: a Codex `.rules` file and an output style. The "Codex has no such folder" sentence is corrected. |
| 21 | Fixed | Step 7 says what to do when the host cannot start a helper agent. |
| 38 | Fixed | The GitHub releases address and the "Claude Code does not read a root plugin.json" sentence are gone. |
| 35 | Open | The Codex Git paragraph kept by hand in six skill files. The shared-text check in `check-skills.mjs` compares whole files, so it cannot hold a shared paragraph. Not changed here. |

Also changed in `writing-harness-files`, from the owner's rules for this
text: the paragraph that explained why (review 2, finding 25) is one
instruction now, and "must not touch" is "must not change" (finding 24).

## 2. The seven checks, from the worktree root

| Command | Result |
| --- | --- |
| `claude plugin validate .` | `✔ Validation passed` |
| `claude plugin validate ./plugins/toolkit` | `✔ Validation passed` |
| `claude plugin validate ./plugins/workstreams` | `✔ Validation passed` |
| `claude plugin test ./plugins/workstreams` | `14 pass`, `0 fail` |
| `node dev/tools/check-skills.mjs` | `23 skills checked ... passed, 0 errors, 0 warnings.` |
| `node dev/tools/check-rules.mjs` | `passed with 2 warnings.` Both are on rule files this work did not change. |
| `node --test 'dev/tests/*.test.mjs'` | `tests 88`, `pass 88`, `fail 0` on this branch. The other builder's branch adds tests. |

Section 10 gives the same checks on this branch merged with the other
builder's work.

## 3. Each new or tightened check, with a wrong case

A scratch copy of `plugins/`, `dev/tools/`, `dev/build-shared/`,
`dev/SKILL-INDEX.md`, and `.claude/settings.json`, one copy per case, under
`<scratch>/checks/`. The right case is the unchanged copy: `passed, 0
errors`, exit code 0.

| Case | What was changed in the copy | Result |
| --- | --- | --- |
| 1 | `handoff` removed from `skillOverrides` | Failed, exit 1: "skillOverrides does not set the project skill handoff to "off"" |
| 2 | `managing-work-items` added to `skillOverrides` | Failed, exit 1: "skillOverrides names managing-work-items, which is no project skill" |
| 3 | `braindump` set to `"name-only"` | Failed, exit 1: the same message as case 1, for `braindump` |
| 4 | `work-local` and `work-github` swapped between their two rows of the table in `setup-copy.md` | Failed, exit 1: ""github" is not in that choice's name ... this folder is in the wrong row", and the same for "local" |
| 5 | `salesforce` added to the "SOUL.md kept" row | Failed, exit 1: "names salesforce in the rows "Salesforce" and "SOUL.md kept"" |
| 6 | `Bash(sf data upsert *)` removed from the list in `setup-copy.md` | Failed, exit 1: ""Salesforce entries in the settings file" does not name Bash(sf data upsert *)" |
| 7 | A handler that runs `guard-new-thing.cjs` added to `every-project/.claude/settings.json` | Failed, exit 1: "does not name guard-new-thing.cjs" |

Case 4 passed before the name check was added: each folder was still in one
row, and both folders hold a skill of the same name. The name check was
added for that reason.

## 4. A new project, built by the written steps as shell commands

Choices: local work items, local memory, Salesforce. The setup copy is
`<scratch>/new-copy`, the project `<scratch>/new-project`.

| Step | Result |
| --- | --- |
| `setup-copy.md`: copy `every-project`, `work-local`, `memory-process`, `memory-local`, `salesforce`; "Never copied"; the name; "Toolkit settings"; `owner-preferences.md` | The count command prints 11. `jq empty` prints nothing. `test -x <copy>/.githooks/pre-commit` prints `executable`. Seven folder guides, each with a one-line `CLAUDE.md`. |
| `skills-hooks-settings.md`: merge the snippets | 16 skills. Both JSON files valid. `validate-records.mjs` is named twice in `.claude/settings.json` and once in `.codex/hooks.json`. The `Stop` event holds two groups: the graph hook's and the record check's. |
| `placing-files.md`, 1 to 4, in a new Git repository | 173 missing files copied. The link is `skills -> ../.claude/skills`. |
| `placing-files.md`, "5. The pre-commit check" | `git config --get core.hooksPath` printed nothing, and the hooks folder held only `.sample` files, so `git config core.hooksPath .githooks` ran. The file is `-rwxr-xr-x` after `rsync -rlt`, and Git stores it as mode `100755`. |
| `node .claude/hooks/validate-records.mjs --all < /dev/null` on the fresh project | Printed nothing. Exit code 0. |
| The setup commit, with the pre-commit file on | Exit code 0. |
| A commit that files `sources/SRC-001-kickoff-notes.md` and its row | Exit code 0. |
| A commit that adds a line to that filed original | Stopped, exit code 1: "sources/SRC-001-kickoff-notes.md: this commit changes or deletes a filed original." `git log` shows two commits. |

A project that already has a hooks folder or a hook, walked through the
table of "5. The pre-commit check":

| Project | What the commands showed | What the step did | Changed |
| --- | --- | --- | --- |
| `core.hooksPath` is `.husky` | The first prints `.husky` | Nothing. The owner is told the folder, that the record check will not run before commits, and the one line he can add. | Nothing: the setting and the hook file are the same before and after |
| A real `.git/hooks/pre-commit` | The first prints nothing; the second lists `pre-commit` | The same | Nothing |
| No Git repository | Git says so | Skipped; the owner is told | Nothing |
| `core.hooksPath` is already `.githooks` | The first prints `.githooks` | Nothing | Nothing |

The offered line was then added by hand to the real `.git/hooks/pre-commit`
of the second project. His own hook still ran ("own hook ran"), two clean
commits passed, and a commit that changed a filed original was stopped.

## 5. The update steps on an old-layout project

The reviewer's trial case, built again: the starter of `origin/main` for
local work items, local memory, and Salesforce, committed as "Set up Toolkit
V2", then one file in every old location (76 old files in all), committed
as the owner's, with ignored data files in `delivery/data/data-loads/` and
`production-backups/`, ignored memory records of every kind, and three work
items (one Done with a `references/` folder, one in progress, one Cancelled
in `archive/`). Script: `<scratch>/build-old.sh`.

| Step | Result |
| --- | --- |
| The worktree, and the three compare commands of `update.md`, step 2 | 68 files missing and 40 that differ in the worktree; the `memory/` and `work-items/` compares ran against the main checkout. |
| Every command of "Find the old layout" | Each ran as written and found its old piece, including the two ignored data files and the three items with no Moved up line. |
| Every old file mapped to a row of "Where each old piece goes" or "Toolkit files" | 76 of 76 have a destination. None is left over. |
| "Whose edit a difference is" on the old `delivery/` templates | The three templates the toolkit changed (`DATA-AREA-TEMPLATE.md`, and `manual-steps.md` and `package.xml` of the full project template) differ from the setup copy and have only the setup commit: toolkit files. `component-tracker.csv` has the owner's commit: his, moved with `git mv -f`. |
| The same on the rules | 13 rules differ from the setup copy. All 13 have only the setup commit: no edit of his. |
| Sections 3 and 4 and steps 1 to 6 in the worktree, with the settings merged without the `validate-records.mjs` entries | `validate-records` is named 0 times in both settings files at this point. "Toolkit settings" holds 11 lines. |
| The record check from the worktree, before the entries go in | 3 findings, exit code 2: two closed work items with no Moved up line, and `memory/` with an `AGENTS.md` and no `CLAUDE.md`. |
| The fixes in the main checkout (the Moved up line in the two closed items; `memory/CLAUDE.md` from the setup copy), then the check again | Printed nothing. Exit code 0. |
| Only then: the `validate-records.mjs` entries, and "5. The pre-commit check" | Named twice in `.claude/settings.json` and once in `.codex/hooks.json`; each other hook command once. `core.hooksPath` set to `.githooks`. |
| The commit in the worktree, with the pre-commit file on, and the landing (`git merge --ff-only`) | Both exit code 0. Right after the landing, `git status --short` in the main checkout printed `?? delivery/data/`: the two data files were no longer ignored. |
| Step 8, first point: `mv` both data files to `delivery/migrations/`, `rmdir` the old folders | `git status --short` printed nothing. `git status --short --ignored` lists both files as ignored at the new paths. |
| The rest of step 8, and step 9 | Every command of "Find the old layout" finds nothing. `memory/` holds `AGENTS.md`, `CLAUDE.md`, `CURRENT_STATE.md`, and `MEMORY.md`. The record check in the main checkout prints nothing, exit code 0. `git status --short` lists no file. |

Not done in this walk: the glossary term and the target direction rule were
not written (the script says so), and no agent ran the steps. The walk was
shell commands and small scripts that write records in the forms the folder
guides give.

Two runs for "check the setup" on the old-layout project before the update:

- The setup copy's `validate-records.mjs`, run from the project folder,
  printed 5 findings and changed no file.
- The project's own, older `session-start.mjs` rewrote `memory/MEMORY.md`
  when it ran. `finishing.md` now says not to run it in "check the setup"
  when it differs from the setup copy's file.

## 6. Codex lists only the plugin's own skills

Method of `dev/test-runs/one-folder-per-choice.md`: a scratch `CODEX_HOME`
(`<scratch>/codex/home`) and an empty scratch folder; no sign-in and no
model call. Codex 0.160.0.

```bash
export CODEX_HOME=<scratch>/codex/home
cd <scratch>/codex/empty
codex plugin marketplace add <this worktree>   # Added marketplace `toolkit-v2`
codex plugin add toolkit@toolkit-v2            # Added plugin `toolkit`, version 0.8.16
codex debug prompt-input > prompt-input.json
```

The installed copy holds 23 `SKILL.md` files. The model's skill list has
three entries from the plugin: `toolkit:choosing-outside-tools`,
`toolkit:project-setup`, and `toolkit:writing-harness-files`. No project
skill is listed. The other five entries are Codex's own and `neon-postgres`
from `~/.agents/skills`. The installed copy keeps
`every-project/.githooks/pre-commit` executable, and holds the two new
reference files. The owner's `~/.codex` and `~/.toolkit-v2-test-homes/` were
not used.

## 7. `claudeMdExcludes` and `skillOverrides` in a worktree session

Sign-in: `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`. Claude Code
2.1.289. Each run is one `claude -p` session started in this worktree, which
sits under `.claude/worktrees/`, with `--allowedTools Read --model haiku
--output-format json`. After each run the session's record file was read
for entries of type `attachment`: `instructions` (the files loaded at the
start), `nested_memory` (a file loaded after a read), `dynamic_skill`, and
`skill_listing`. That shows what Claude Code put in front of the agent,
whatever the model answered.

| Run | `.claude/settings.json` | The session read | Loaded after the read |
| --- | --- | --- | --- |
| 1 | As committed | `<assets>/every-project/system/data-model.md` | Nothing. No `nested_memory` entry. |
| 2, the control | `claudeMdExcludes` emptied for this run, then restored | The same file | 12 starter files: `every-project/CLAUDE.md` and `AGENTS.md`, eight rules of `every-project/.claude/rules/`, and `every-project/system/CLAUDE.md` and `AGENTS.md`. |
| 3 | As committed | 11 files: one in `every-project/system/`, `sources/`, `delivery/`, and `reference/outside-docs/`, one in `work-local/work-items/`, `memory-local/memory/`, two in `salesforce/`, the rule in `notion-tools/` and in `memory-hindsight/`, and the `SKILL.md` of `handoff` | Nothing. The skill list stayed at the 45 names of the start, with no project skill. |
| 4, the control | `skillOverrides` emptied for this run, then restored | `<assets>/every-project/README.md` | A `dynamic_skill` entry for `every-project/.claude/skills`, and a second skill list that adds the 10 shared project skills. |

Result: the five patterns in `.claude/settings.json` keep every starter
`CLAUDE.md`, folder guide, and rule out of a session started in a worktree,
and the 17 `skillOverrides` entries keep the project skills out. The
patterns were not changed:

```json
"claudeMdExcludes": [
  "**/plugins/toolkit/skills/project-setup/assets/**",
  "**/plugins/toolkit/skills/project-setup/assets/*/.claude/rules/**",
  "**/plugins/toolkit/skills/project-setup/assets/memory-local/memory/**",
  "**/plugins/toolkit/skills/project-setup/assets/**/CLAUDE.md",
  "**/plugins/toolkit/skills/project-setup/assets/**/AGENTS.md"
]
```

The page sentences that explain it, in
`ai-external-knowledge/claude-code/memory.md`:

- "Claude also discovers `CLAUDE.md` and `CLAUDE.local.md` files in
  subdirectories under your current working directory. Instead of loading
  them at launch, they are included when Claude reads files in those
  subdirectories."
- "Patterns are matched against absolute file paths using glob syntax." A
  pattern that starts with `**/` therefore matches the same path below any
  checkout or worktree of this repository.

Not tested: a session started in one worktree that reads a file in another
worktree or in the main checkout. The settings file such a session uses is
the one in the folder it started in. A session started in the main checkout
uses the main checkout's file, which on `main` still holds the patterns for
the old `assets/model/` folder until this branch lands. That explains the
earlier record of starter files loading in a session that began elsewhere;
it was not confirmed by a run.

The four runs added four session records to the test sign-in, in
`projects/-Users-michaelrihm-Documents-Projects-toolkit-v2--claude-worktrees-one-home-fix-setup/`.
Nothing else was added, and nothing was removed.

## 8. The Hindsight setup file against the captured pages

`<setup>references/hindsight-on-vps.md`, checked against
`ai-external-knowledge/hindsight/` (captured 2026-10-05; add-on 0.8.0,
Hindsight 0.10.2) and the owner's guide,
`dev/research/hindsight-server-setup-guide.md`.

| What the file said | What the pages show | Now |
| --- | --- | --- |
| "There is no backup step." | The owner's guide: weekly automatic backups of the VPS at Hostinger. | "The VPS has weekly automatic backups at Hostinger. The toolkit adds no backup step." |
| The add-on's skill is in `~/.claude/skills/` and `~/.agents/skills/`. | `coding-agents-readme.md` names `~/.claude/skills/hindsight-coding-agent` for Claude Code, and no skill folder for Codex. | Only `~/.claude/skills/` is named. The add-on is not installed on this Mac, so the Codex place could not be looked at. |
| The add-on "adds memory at the start of a session". | The README: at session start it shows the knowledge pages and a guide to its tools; on the first message of a session it adds a short summary from memory. It also keeps five knowledge pages up to date. | Written so. |
| The installer adds `[features]` with `hooks = true`. | The Codex hooks page: the key is `hooks`, and `codex_hooks` is an older name that still works. The add-on's README names `codex_hooks`. | Both keys are named. Which one the installer writes was not seen. |
| Nothing on the server's parts, its ports, or what an agent may do there. | The owner's guide. | "What runs where" and a new section, "The server is the owner's". |

Unchanged and confirmed against `openapi.json` and the source files: the
API calls the file uses (`GET /v1/default/banks` with `q` and `limit`,
`PUT /v1/default/banks/<bank>`, `POST .../memories` with `items`,
`document_id`, and `async`, `GET .../operations/<id>`,
`POST .../memories/recall` with `types` and `budget`), the eight tools, and
the three fields of `hindsight_diagnose` that the check reads.

## 9. What the other builder's files must change

- `every-project/reference/AGENTS.md`, `every-project/system/AGENTS.md`,
  and the root map row for `reference/current-system/` say "before this
  project's changes". `DESIGN-SPEC.md`, decision 16, says "the record of
  the system as it is today", and an update carries the old system guide
  there, which describes what the project built. The sentence should say
  what was observed, on a date, in an environment (review 3, note 23).
- A Done or Cancelled work item with no filled Moved up line fails the
  record check. An update writes
  `Nothing: the item was closed before the closing step existed.` in such
  an item. `work-items/AGENTS.md` or the work item form may want to name
  that text.
- A Salesforce-only settings snippet (review 3, note 34) would move the
  Salesforce entries out of `every-project/.claude/settings.json`, and the
  hand-kept list in `setup-copy.md` could then go.

## 10. This branch merged with the other builder's work

The other builder's fix pass is on `claude/one-home-layout` (commit
`1133df7e`). In a scratch clone, `<scratch>/merge-trial`, this branch at
commit `47497062` was merged with it. No branch of the repository was
changed.

| Check | Result |
| --- | --- |
| `git merge origin/claude/one-home-layout` | No conflict. `dev/SKILL-INDEX.md` was merged by Git: the two branches change different rows. |
| `node dev/tools/check-skills.mjs` | `23 skills checked ... passed, 0 errors, 0 warnings.` |
| `node dev/tools/check-rules.mjs` | `passed with 2 warnings.` |
| `node --test 'dev/tests/*.test.mjs'` | `tests 98`, `pass 98`, `fail 0` |
| `claude plugin validate .` and `./plugins/toolkit` | `✔ Validation passed`, both |

Description lengths in the merged state, counted with a script that reads
each `description:` line:

| Project | Descriptions | Total characters |
| --- | --- | --- |
| Local work items, local memory, plus the three plugin skills | 16 | 6,459 |
| Salesforce, Notion work items, Notion memory, plus the three plugin skills | 20 | 7,987 |

Codex's list budget is 8,000 characters when it does not know the context
window, so the second project has 13 characters left. The two descriptions
changed here: `project-setup`, 382 to 474 characters, and
`writing-harness-files`, 464 to 465.

Correction, 2026-10-05 (second review, note 23). The totals above count the
descriptions only. Each line of Codex's list also holds the skill's name
and a short path, about 50 characters per skill
(`dev/research/skill-writing-guide.md`, "Line format"), so the second
project's list is about 9,000 characters, over the 8,000 that Codex uses
when it does not know the context window. That number is not the one that
applies in a project: setup writes `max_context_tokens = 10000` under
`[skills]` in `.codex/config.toml`, which is about 40,000 characters at 4
bytes per token. Inferred from the captured pages; not measured in a Codex
session.

## 11. Added after the other builder finished

The coordinator passed on these items from the other builder's work. Each
is in this branch.

| Item | Where |
| --- | --- |
| The Salesforce folder holds eleven rules (new: `salesforce-delivery.md`), and there is a new test file, `dev/tests/permission-set-guard.test.mjs` | The repository `AGENTS.md`, Layout table and "The starter project" |
| The `writing-harness-files` description within the Codex list budget | Section 10 |
| "Check the setup" puts back a missing `AGENTS.md` or `CLAUDE.md` in `work-items/` or `memory/`, and a missing work item template | `finishing.md`, "Final checks"; `SKILL.md`, "Pick the path" |
| "Update the toolkit" removes `assets/terminology-glossary.md` from the Notion `using-memory-store` of an existing project | `update.md`, section 4 |
| The starter `PROJECT.md` prompts that changed ("Tests", "Operating conventions") | `one-home-layout.md`: the topic record row and the `PROJECT.md` row. No other setup step names the changed prompts or the `README.md` heading. |
| Five changes the other builder made that no review asked for | `DESIGN-SPEC.md`, section 9, as "for the owner to confirm" |

## 12. Not run

- A live setup, check, or update session by an agent in Claude Code or
  Codex. The steps were walked as shell commands.
- The routing test in either host. Two descriptions changed:
  `project-setup` and `writing-harness-files`.
- The separate wording, overlap, and best-practices reviews.
- Any Notion, GitHub, Hindsight, or Salesforce org step.
- The update walk for a project with work items in Notion or GitHub.

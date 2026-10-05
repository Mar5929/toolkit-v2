# The starter project's structure and its instruction files

Date: 2026-10-05. Work item: TKV-24, build step 3 (first part). Branch:
`claude/one-home-layout`. Design: `dev/research/layout-audit/DESIGN-SPEC.md`.

What this step changed: the root `AGENTS.md` (no setup markers, no rules
list), `DECISIONS.md`, the new folders `system/`, `sources/`, `delivery/`,
and `reference/` with a folder `AGENTS.md` and `CLAUDE.md` each, the folder
guides for `work-items/` and `memory/`, three rule files that only one
choice gets, and the Salesforce delivery folders under their new names.

`<assets>` is `plugins/toolkit/skills/project-setup/assets`.

## 1. The seven checks

Run from the worktree root. Each was seen to pass.

| Command | Result |
| --- | --- |
| `claude plugin validate .` | Validation passed |
| `claude plugin validate ./plugins/toolkit` | Validation passed |
| `claude plugin validate ./plugins/workstreams` | Validation passed |
| `claude plugin test ./plugins/workstreams` | 14 pass, 0 fail |
| `node dev/tools/check-skills.mjs` | passed, 0 errors, 0 warnings (22 skills, 22 index rows) |
| `node dev/tools/check-rules.mjs` | passed with 2 warnings (22 rules: 17 always on, 5 path-scoped) |
| `node --test 'dev/tests/*.test.mjs'` | 42 pass, 0 fail |

The two `check-rules` warnings were there before this step:
`salesforce-org-safety.md` is over the proposed 4,096 bytes (4,200; one byte
more than before, from `deployments`), and `session-handoff.md` has a
573-character paragraph.

Changes to the checks, and why:

- `check-skills.mjs` and `check-rules.mjs`: `memory-hindsight` joined the
  list of setup folders.
- `check-skills.mjs`, the Salesforce list. Before, it failed when
  `every-project` had a top-level folder the list names. `delivery/` is now
  in every project, so the check is by path: `every-project` holds no path
  the list names, and inside a folder both have, the list names every file
  the `salesforce` folder adds. Two wrong cases were tried in a scratch copy
  of the repository and both failed the check as they should: an extra file
  in `salesforce/delivery/deployments/` that the list does not name, and a
  `tools/` folder in `every-project`.
- `check-skills.mjs`, template copies. The five assets of
  `filing-project-records` were compared with
  `project-wide-records/templates/`. That folder is gone from the starter,
  so the five comparisons were removed. They have no purpose until a later
  step rewrites the skill and its templates.
- `check-rules.mjs`, the rules list. The starter `AGENTS.md` has no rules
  list now, so the check that compares the list with the rule files no
  longer runs on the starter. It still runs with `--dir` on a project whose
  `AGENTS.md` holds the two marker lines. For the starter it has no purpose.
- `check-rules.mjs`, the size report. It now leaves the rule files of
  `memory-hindsight` and `notion-tools` out of a setup that does not get
  them, as it did for `salesforce` and `work-local`.

## 2. Three scratch projects built from the setup copy steps

Folder:
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-toolkit-v2/1796fa5c-042e-4ee4-9256-ed3db38c8742/scratchpad/build-3a/`.
`build.sh` there runs the steps of
`plugins/toolkit/skills/project-setup/references/setup-copy.md` as shell
commands; `verify.py` there checks the result.

The copy commands, for each build (`<copy>` is the build's folder):

```text
cp -R <assets>/every-project/. <copy>/

a) local work, local memory, not Salesforce
cp -R <assets>/work-local/. <copy>/
cp -R <assets>/memory-process/. <copy>/
cp -R <assets>/memory-local/. <copy>/

b) Notion work, Hindsight memory, Salesforce
cp -R <assets>/work-notion/. <copy>/
cp -R <assets>/notion-tools/. <copy>/
cp -R <assets>/memory-hindsight/. <copy>/
mkdir -p <copy>/memory
cp <assets>/memory-local/memory/CURRENT_STATE.md <copy>/memory/
cp -R <assets>/salesforce/. <copy>/

c) GitHub work, Notion memory, not Salesforce
cp -R <assets>/work-github/. <copy>/
cp -R <assets>/memory-process/. <copy>/
cp -R <assets>/memory-notion/. <copy>/
cp -R <assets>/notion-tools/. <copy>/
```

Then, for each: the "Never copied" removals; the setup markers resolved in
the files the grep finds; `<Project name>` replaced on heading lines; the
"Toolkit settings" values filled; for a project that is not Salesforce, the
Salesforce entries taken out of `.claude/settings.json` and `.gitignore`;
and `owner-preferences.md` copied into `.claude/rules/`.

Results. All three passed every line.

| Check | a | b | c |
| --- | --- | --- | --- |
| Files that held setup markers before they were resolved | `README.md`, `PROJECT.md`, `.claude/rules/memory-review-and-save.md` | the same | the same |
| `command grep -rn -e '<!-- if ' -e '<!-- endif' <copy>` prints nothing | yes | yes | yes |
| The root `AGENTS.md` holds no `<!-- if` line and no rules list | yes | yes | yes |
| `jq empty <copy>/.claude/settings.json` | valid | valid | valid |
| Folders with an `AGENTS.md` (outside `.claude/`) | root, `delivery`, `memory`, `reference`, `sources`, `system`, `work-items` | root, `delivery`, `reference`, `sources`, `system` | root, `delivery`, `reference`, `sources`, `system` |
| Each has a `CLAUDE.md` that is exactly `@AGENTS.md` and a line end | yes | yes | yes |
| Every location in the root file's map (47 names) exists, or its row is marked for a choice this copy does not have | yes | yes | yes |
| No file written in this step names `project-wide-records`, `requirements/`, `system-guide`, `ai-external-knowledge`, or an old skill name | yes | yes | yes |
| Rule files for a choice | `work-item-folders.md` | `hindsight-memory.md`, `notion-records.md`, the ten Salesforce rules | `notion-records.md` |
| `memory/` holds | the full folder, with `AGENTS.md` and `CLAUDE.md` | only `CURRENT_STATE.md` | no `memory/` |

Three map locations are absent from a copy for a reason the map or the
setup steps give:

- `.agents/skills` (all three): `placing-files.md` makes the link after the
  copy.
- `.codex/` (a and c): `skills-hooks-settings.md` makes it after the copy.
  Build b has it from the `salesforce` folder.
- `force-app/` (b): its row says it is made when the first metadata is added.

A row whose name has a form in it (`work-items/<ID>-<short-slug>/<ID>.md`)
was checked by its fixed part (`work-items/`).

The session-start hook was run in build a
(`node .claude/hooks/session-start.mjs --memory local`): it printed Current
State and the memory index, and it left `memory/AGENTS.md` and
`memory/CLAUDE.md` out of the index.

## 3. Line counts

| File | Lines | Bytes |
| --- | --- | --- |
| `AGENTS.md` (root; the same in all three builds) | 159 | 16,659 after the name is filled |
| `system/AGENTS.md` | 96 | 5,455 |
| `sources/AGENTS.md` | 49 | 2,682 |
| `delivery/AGENTS.md` | 75 | 4,931 |
| `reference/AGENTS.md` | 49 | 2,856 |
| `work-items/AGENTS.md` | 77 | 5,203 |
| `memory/AGENTS.md` | 64 | 3,359 |
| `.claude/rules/hindsight-memory.md` | 10 | 1,094 |
| `.claude/rules/notion-records.md` | 9 | 833 |
| `.claude/rules/salesforce-project.md` | 12 | 935 |
| `DECISIONS.md` | 35 | 1,965 |

The old root file was 251 lines and 24,320 bytes before setup removed the
unused blocks.

Bytes that load in every session (the root `AGENTS.md` plus the rules with
no `paths` line, `owner-preferences.md` included): build a 31,340; build b
40,333; build c 29,261.

## 4. Sessions that work on the toolkit do not load the starter's files

`.claude/settings.json` (`claudeMdExcludes`) gained two patterns:
`**/plugins/toolkit/skills/project-setup/assets/**/CLAUDE.md` and the same
for `AGENTS.md`.

Test: one `claude -p` session (Claude Code 2.1.289, Haiku) in the worktree,
with the test sign-in (`CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`).
The prompt asked it to read `<assets>/every-project/system/glossary.md` and
`<assets>/work-local/work-items/PROJECT-TASKS.md` with the Read tool. Both
folders hold a `CLAUDE.md` and an `AGENTS.md`.

Result, read from the session's record file
(`739beb5b-76fe-476e-80ce-62b6399c4a16.jsonl`): both Read calls ran; the
record holds no `nested_memory` entry and none of the text of either folder
guide. So the excludes hold for the new files.

For comparison: the session that made this change ran with the main
checkout's older excludes, which name `assets/model/`. In it, Claude Code did
attach `every-project/system/CLAUDE.md` when a file beside it was read.

## 5. Mentions that are left for the later steps

Counted with `grep -rn` under `plugins/`.

A removed folder (`project-wide-records`, `requirements/`, `system-guide`,
`ai-external-knowledge`): 53 lines in 25 files.

| Area | Files (lines) |
| --- | --- |
| Rules every project gets | `cite-recalled-knowledge.md` (1), `publish-project-documents.md` (1: its last bullet names `project-wide-records/AGENTS.md`) |
| `PROJECT.md`, `README.md` (starter) | `PROJECT.md` (4), `README.md` (2) |
| `filing-project-records` | `SKILL.md` (3), `assets/DOMAIN-MAP.md` (2), `assets/TARGET-ARCHITECTURE.md` (2), `examples/accounts-org-merge.md` (1), `references/placement-and-authority.md` (4), `references/record-lifecycle.md` (2), `references/source-intake.md` (2) |
| `handoff` | `SKILL.md` (2), `assets/handoff-prompt-template.md` (1), `references/handoff-verifier.md` (1) |
| `publish-docs` | `SKILL.md` (3, its description among them), `references/recovery.md` (1) |
| `running-work-item-lifecycle` | `references/designing.md` (1), `refining-requirements.md` (2), `reflecting.md` (2), `requirements-analyst-brief.md` (1) |
| Setup instructions | `references/update.md` (4), `references/move-over.md` (2), `references/old-toolkit-pieces.md` (7) |
| Settings snippets | `codex-plugins-off.toml` (1), `enabled-plugins-off.json` (1): the name of an older plugin, `system-guide@claude-toolkit`, not a folder |

The rule file `ai-external-knowledge.md` keeps its file name. Its paths and
text now name `reference/outside-docs/`. It says the same as
`reference/AGENTS.md`, so a later step can delete it.

An old delivery path: 6 lines in 6 files, all on purpose. Each names
`engagement/deployment/` or `engagement/data/`, the folders an older
Salesforce project keeps: `salesforce-deploying.md`,
`production-data-changes.md`, `project-file-locations.md`,
`record-deployment-steps.md`, `sf-component-tracker/SKILL.md`,
`sf-data-change/SKILL.md`. No `delivery/deployment/`, `delivery/data/`, or
removed delivery folder is named anywhere under `plugins/`.

A section of the old root file that no longer exists: 14 lines in 8 files.

| Pointer | Files (lines) |
| --- | --- |
| `AGENTS.md`, "Project memory" (now `.claude/rules/hindsight-memory.md`) | `handoff/SKILL.md` (2), `braindump/SKILL.md` (1), `filing-project-records/SKILL.md` (1), `running-work-item-lifecycle/SKILL.md` (2), `memory-review-and-save.md` (1) |
| The rules list in `AGENTS.md`, or `setup-copy.md`, "The rules list in AGENTS.md" (that section is removed) | `references/update.md` (5), `references/old-toolkit-pieces.md` (1), `curating-project-memory/references/tidying.md` (1) |

Outside `plugins/`: the repository `README.md` names
`project-wide-records/` on lines 17 and 112.

Also left, because the templates, the skills, and the older rule files are
a later step. The new root file and `work-items/AGENTS.md` say every
original goes in `sources/`, and these files still say otherwise:

- an item's `references/` folder: the work item template folder, the starter
  `README.md`, `work-item-folders.md`, and `using-work-tracker` (local:
  `SKILL.md` and three references);
- "a Salesforce client file stays in `delivery/`": eight files
  (`work-item-folders.md`, the work item template and its copy in
  `running-work-item-lifecycle`, `refining-requirements.md`,
  `field-mapping.md`, and three files of `filing-project-records`).

`work-item-folders.md` and `work-items/AGENTS.md` now state several of the
same rules. Audit 1 moves that rule's lines to the folder file, a check, or
the skill; trimming the rule is a later step.

# Rules and project files: no if-then blocks, one home per instruction

Date: 2026-10-05. Branch `claude/one-home-rules` (TKV-24), made from
`claude/one-home-layout` at `2fe33ca1`. Claude Code 2.1.289, Node 25.8.1.
Plugin version unchanged.

What this step changed: `PROJECT.md` and `README.md` in
`assets/every-project/`, the rule files under `assets/*/.claude/rules/`,
the marker and fill-in sections of `references/setup-copy.md`,
`dev/tools/check-rules.mjs`, `dev/tools/rule-lint.mjs`, and the repository
`README.md`. `<assets>` below is
`plugins/toolkit/skills/project-setup/assets/`.

Not done in this step: the separate wording, overlap, and best-practices
reviews (step 6 of the build), and a live session in either host. Every
result below was seen in this run unless it says "not run".

## 1. The seven checks (from the worktree root)

```bash
claude plugin validate .                      # Validation passed
claude plugin validate ./plugins/toolkit      # Validation passed
claude plugin validate ./plugins/workstreams  # Validation passed
claude plugin test ./plugins/workstreams      # 14 pass, 0 fail
node dev/tools/check-skills.mjs               # passed, 0 errors, 0 warnings (22 skills, 22 index rows)
node dev/tools/check-rules.mjs                # passed with 2 warnings
node --test 'dev/tests/*.test.mjs'            # 42 pass, 0 fail
```

`check-rules` printed: 20 rules, 16 always on (21,429 bytes in all), 4
path-scoped. Its two warnings are the two it had before:
`salesforce-org-safety.md` is 4,200 bytes (over the proposed 4,096), and the
one paragraph of `session-handoff.md` is 577 characters (over 400). Both are
the owner's words.

Bytes that load in every session, as `check-rules` prints them (always-on
rules, the root `AGENTS.md`, and the `owner-preferences.md` template):

| Setup | Before | After |
| --- | --- | --- |
| Local work and memory, no Salesforce | 30,889 | 27,050 |
| Notion work and memory, no Salesforce | 28,810 | 27,883 |
| Local work, Hindsight memory, Salesforce | 41,961 | 37,414 |

## 2. No if-then block is left

```bash
command grep -rn '<!-- if \|<!-- endif' plugins/toolkit/skills/project-setup/assets
# prints nothing (exit 1)
```

Before: 18 blocks in `PROJECT.md`, 8 in `README.md`, 1 in
`.claude/rules/memory-review-and-save.md`. The block numbers are those of
`dev/research/layout-audit/audit-1-rules-agents-hooks.md`, section 12.1.

| Blocks | File | What happened |
| --- | --- | --- |
| 27, 28 | `PROJECT.md` | One sentence: "Why this project exists." |
| 29 to 31 | `PROJECT.md` | One sentence: work items, phases, and project tasks are in the work tracker named under "Toolkit settings". |
| 32 to 34 | `PROJECT.md` | One sentence: project memory is in the memory system named under "Toolkit settings". |
| 35 | `PROJECT.md` | The Salesforce source line became "Source code", a prompt every project fills. The two lines about the package files are dropped: `sf-component-tracker`, `sf-deploy-check`, and `salesforce-org-safety.md`, which only a Salesforce project has, already say them. |
| 36 to 40, 42 to 44 | `PROJECT.md` | Fixed lines. "Toolkit settings" has the same 11 lines in every project, each label as it was written. A line for a choice the project did not make holds `not used`. |
| 41 | `PROJECT.md` | Dropped: the two Jira lines. Jira cannot be chosen, and no skill reads either label. The Tracker prompt no longer lists `jira`. |
| 45, 46 | `README.md` | One sentence: "How to identify the correct environment." |
| 47 | `README.md` | One sentence: the last line under "Project records" now also names the project's phases. |
| 48 | `README.md` | Kept in every project: "Browse in Obsidian". |
| 49, 50 | `README.md` | Dropped: `work-items/AGENTS.md` and `memory/AGENTS.md` say what each folder holds. |
| 51, 52 | `README.md` | One sentence: "Verified environments; never infer a target from a template." |
| 53 | `memory-review-and-save.md` | Moved to `hindsight-memory.md`, which only a Hindsight project gets: the key file, "forget that", and the Current State limits. The line about the add-on's tools was already there. |

Also changed in `PROJECT.md`, because the new layout makes the old text
false:

- "Constraints" is a pointer to `system/constraints.md`.
- The lines for `requirements/`, `project-wide-records/`, the System Guide,
  the design home, and outside references are replaced by pointers to
  `DECISIONS.md`, `system/`, and `sources/`.
- "People and ownership" has one new column, "May decide". It carries the
  decision authority that `project-wide-records/people/` held.

`references/setup-copy.md` no longer has the "Setup markers" section or its
table. It keeps one paragraph that starts "These are the files that hold
markers: none", because `dev/tools/check-skills.mjs` looks for a paragraph
that starts with those words. Its fill-in table lists all 11 lines and the
value each gets.

## 3. Rule files: size before and after, and load mode

Bytes, from `wc -c`. "Before" is commit `2fe33ca1`.

| Rule file | Before | After | Load mode | What happened |
| --- | --- | --- | --- | --- |
| `every-project/…/ai-external-knowledge.md` | 1,193 | deleted | was path-scoped | `reference/AGENTS.md` says all of it. |
| `every-project/…/cite-recalled-knowledge.md` | 754 | 759 | always on | Examples and the list of project knowledge name the new records. |
| `every-project/…/humanize-outbound-text.md` | 786 | 786 | always on | Unchanged. |
| `every-project/…/keep-work-item-current.md` | 2,229 | 1,962 | always on | "The owner" in the waiting form. Three lines the root file states are cut. |
| `every-project/…/memory-review-and-save.md` | 2,904 | 972 | always on | Rewritten for pointer-only memory. The Hindsight block moved out. |
| `every-project/…/plain-english-artifacts.md` | 3,451 | 3,451 | always on | Unchanged. |
| `every-project/…/publish-project-documents.md` | 1,121 | 872 | path-scoped | Two lines cut: one names a removed folder, one the root file states. |
| `every-project/…/session-handoff.md` | 603 | 607 | always on | One skill name only: `curating-project-memory`. |
| `every-project/…/shared-repository-work.md` | 1,726 | 1,695 | always on | Two lines the root file states are cut. The sequential-number line names the new IDs. |
| `memory-hindsight/…/hindsight-memory.md` | 1,094 | 1,991 | always on | Gained the Hindsight block of the memory rule, and where an owner's instruction goes. |
| `notion-tools/…/notion-records.md` | 833 | 833 | always on | Unchanged. |
| `salesforce/…/check-deployment-contents.md` | 647 | 647 | always on | Unchanged. |
| `salesforce/…/component-tracker.md` | 527 | 527 | always on | Unchanged. |
| `salesforce/…/confirm-salesforce-changes.md` | 762 | 649 | always on | The sentence that sent a project-wide decision to memory is cut. |
| `salesforce/…/dependency-graph.md` | 1,616 | 1,524 | path-scoped | The written explanation of metadata is corrected in `system/`, not in memory. |
| `salesforce/…/permissions-source-control.md` | 2,126 | 2,126 | path-scoped | Unchanged. |
| `salesforce/…/production-data-changes.md` | 1,090 | 831 | always on | Two lines cut that the root file, `delivery/AGENTS.md`, or `project-file-locations.md` state. |
| `salesforce/…/project-file-locations.md` | 567 | 584 | always on | Title and first line say what `delivery/` holds now. |
| `salesforce/…/record-deployment-steps.md` | 526 | 526 | path-scoped | Unchanged. |
| `salesforce/…/salesforce-org-safety.md` | 4,200 | 4,200 | always on | Unchanged. |
| `salesforce/…/salesforce-project.md` | 935 | 935 | always on | Unchanged. |
| `work-local/…/work-item-folders.md` | 2,912 | deleted | was always on | `work-items/AGENTS.md` and the local `using-work-tracker` say all of it. |

Always-on rule bytes for a project with local work, local memory, and no
Salesforce (the rules of `every-project/` and `work-local/` that have no
`paths`; "before" counts `memory-review-and-save.md` without its Hindsight
block, as setup wrote it):

| | Before | After |
| --- | --- | --- |
| Rules only | 14,071 | 10,232 |
| With the `owner-preferences.md` template (610 bytes) | 14,681 | 10,842 |

## 4. No owned file names a removed folder, an old path, or an old skill name

One search over the 27 files this step owns (`PROJECT.md`, `README.md`,
`owner-preferences.md`, the 20 rule files, `setup-copy.md`, the two tools,
and the repository `README.md`), for: `project-wide-records`,
`requirements/`, `system-guide`, `ai-external-knowledge`,
`delivery/deployment/`, `delivery/data/`, `delivery/archive`,
`delivery/communications`, `delivery/deliverables`, `delivery/meeting-notes`,
`delivery/references`, `target-architecture`, a work item's `references/`
folder, the old memory file names, the five old skill names, "memory save
skill", "memory find skill", and a person's name in a project file.

Two lines matched, and both are correct: `dev/tools/rule-lint.mjs` line 4
and the repository `README.md` line 319 name this repository's own
`ai-external-knowledge/` folder, which exists.

## 5. Three trial setup copies

Built in the session scratchpad the way `setup-copy.md` says, without the
fill-in step: `every-project` plus the folders for the choice, and the
`owner-preferences.md` template.

| Copy | Folders added | Marker lines | "Toolkit settings" lines | `check-rules --dir` |
| --- | --- | --- | --- | --- |
| Local | `work-local`, `memory-process`, `memory-local` | 0 | 11 | passed, 1 warning |
| Notion | `work-notion`, `memory-process`, `memory-notion`, `notion-tools` | 0 | 11 | passed, 1 warning |
| Hindsight and Salesforce | `work-local`, `memory-hindsight`, `salesforce`, `memory/CURRENT_STATE.md` | 0 | 11 | passed, 2 warnings |

The first run found two faults, both fixed:

- `PROJECT.md` had a second line starting `- Memory:` under "Work and
  project records", so the count was 12. That line now starts
  `- Project memory:`. A skill that reads the label finds one line.
- `check-rules --dir` failed on a project without Salesforce or without local
  work items: `publish-project-documents.md` names
  `tools/permissions/PERMISSIONS-RUNBOOK.md` and `PROJECT-ROADMAP.md` in its
  `paths`, and such a project has neither. The fault was there before this
  step. `FOLDERS_MADE_LATER` in `rule-lint.mjs` now also lists paths that only
  one setup choice has.

## 6. Where a toolkit guide and today's official page differ

`dev/research/rules-best-practices.md`, R12, says a path-scoped rule loads
only when Claude reads a matching file, so not when it creates one. The page
captured on 2026-10-05 (`claude-code/memory.md`, "Path-specific rules") says:
"Path-scoped rules trigger when Claude uses the Read, Write, or Edit tool on
a file matching the pattern". The page wins. No decision in this step relied
on the older limit.

The Codex page (`codex/agents-md.md`) agrees with R25: Codex reads
`AGENTS.md` files from the project root down to the working folder, once per
run, up to 32 KiB, and never reads `.claude/rules/`.

## 7. Lines other files must change

Skill and setup lines that read a "Toolkit settings" label and do not yet
expect `not used`:

- `references/update.md`, "Before you start": "whether it names Salesforce
  org aliases" decides whether the project is a Salesforce project. Every
  project now has that line.
- `references/update.md`, "Changing a setup choice", step 3: it replaces
  "the blocks" in four files. There are no blocks; the values swap with
  `not used`.
- `curating-project-memory/SKILL.md`: "missing or still shows its prompt"
  for "Memory approval" should also cover `not used`.
- `references/hindsight-on-vps.md`: "the Hindsight bank line when it holds
  an ID", and "has no Hindsight server line".
- `work-local/.claude/skills/using-work-tracker/references/folders-and-files.md`:
  "Empty or still `<WI>`" for the prefix.

Lists that name a deleted rule file: the repository `AGENTS.md` (the
`work-local/` row, and the paragraph "Three model files still hold setup
markers"), `references/old-toolkit-pieces.md` (two rows), and `update.md`,
which must remove `work-item-folders.md` and `ai-external-knowledge.md` from
a project it updates. No folder guide and no line of the starter `AGENTS.md`
names either file.

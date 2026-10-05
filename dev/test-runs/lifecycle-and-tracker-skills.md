# The work item skills and templates on the one-home layout: checks

Work item: TKV-24. Branch: `claude/one-home-lifecycle`. Date: 2026-10-05.
Commits checked: `72949fd2` (templates) and `9a17e337` (skills).

What changed: `running-work-item-lifecycle`, the three versions of
`using-work-tracker`, the work item and design templates with their copies,
and the Notion work item page text
(`references/notion-build/work-item-page.md`). Paths below are relative to
`plugins/toolkit/skills/project-setup/`; `<lifecycle>` is
`assets/every-project/.claude/skills/running-work-item-lifecycle/`.

No live session ran. Checks 1 and 2 are commands and their output. Check 3
is a reading of the text, not a run in Claude Code or Codex.

## 1. The seven checks

Run from the worktree root. All seven passed.

| Command | Result |
| --- | --- |
| `claude plugin validate .` | `✔ Validation passed` |
| `claude plugin validate ./plugins/toolkit` | `✔ Validation passed` |
| `claude plugin validate ./plugins/workstreams` | `✔ Validation passed` |
| `claude plugin test ./plugins/workstreams` | `14 pass`, `0 fail` |
| `node dev/tools/check-skills.mjs` | `22 skills checked ... 22 rows in dev/SKILL-INDEX.md.` `passed, 0 errors, 0 warnings.` |
| `node dev/tools/check-rules.mjs` | `passed with 2 warnings.` Both warnings are on rule files this step did not change (`salesforce-org-safety.md`, `session-handoff.md`), and both were there before it. |
| `node --test 'dev/tests/*.test.mjs'` | `tests 42`, `pass 42`, `fail 0` |

`dev/tools/check-skills.mjs` was not changed. The two template copies still
equal their project files, and the Next action prompt in the Notion page
text still equals the template's.

## 2. No removed folder, item `references/` folder, or old skill name

```zsh
A=plugins/toolkit/skills/project-setup/assets
OWN=($A/every-project/.claude/skills/running-work-item-lifecycle \
  $A/work-local/.claude/skills/using-work-tracker \
  $A/work-notion/.claude/skills/using-work-tracker \
  $A/work-github/.claude/skills/using-work-tracker \
  $A/work-local/work-items/work-item-template \
  $A/work-local/work-items/PROJECT-TASKS.md \
  plugins/toolkit/skills/project-setup/references/notion-build/work-item-page.md)
command grep -rnE 'project-wide-records|requirements/|system-guide|ai-external-knowledge|managing-work-items|tracking-work-items|managing-project-memory|storing-project-memory|managing-project-wide-records|exclude-dir=references|references/ folder|`references/`' $OWN
command grep -rnE 'references/' $OWN | command grep -vE 'references/[a-z-]+\.md|\(references/'
```

Both printed nothing (exit code 1). The second command shows that every
`references/` left in these files names a file in a skill's own
`references/` folder.

A third search, for `memory`, found five kinds of line, all kept on purpose:
the hand-off row that names `using-memory-store`; "Never change a work item
or project memory" in the builder's brief; and, in the Notion tracker, the
"Linked memory" view, the memory relations, and the memory pages in the
picture of a project. The last three describe Notion memory's own layout,
which this branch does not change.

## 3. Three cases read against the text

Each row names the one file and line that tells the agent what to do. A
"pointer" is a one-line row in a Hand-offs table that names the skill and the
step; it holds no procedure.

### (a) An item is marked Done after a change that added one security rule and one decision that affects two items

| Step | Where it is written |
| --- | --- |
| When the owner gives the answer that two items need, apply the filing test and hand it to `filing-project-records`, step "record a decision"; the row ends "Filed as DEC-###" | `<lifecycle>references/refining-requirements.md`, line 27 |
| The same for a design choice | `<lifecycle>references/designing.md`, line 22, which points to the line above |
| After the merge and the deploy, go to "Marking Done" | `<lifecycle>SKILL.md`, line 25; `<lifecycle>references/deploying.md`, line 3 |
| Check the merge, the deploy records, and the phases | `<lifecycle>references/closing.md`, line 52 |
| Answer the closing question | `closing.md`, line 53, which sends the agent to lines 34 to 48 |
| List the decision (when its row has no "Filed as"), the new security rule, and the rule as delivered | `closing.md`, lines 36 to 40 |
| Ask the owner once | `closing.md`, line 41 |
| File the decision, add the rule, and set the rule's mark to Built, each through `filing-project-records` | `closing.md`, lines 42 to 46 |
| Fill Moved up, for example "DEC-014 recorded. SEC-04 added and Built." | `closing.md`, line 48; the field is `<lifecycle>assets/work-item-template.md`, line 43 |
| Ask "Mark WI-031 Done?", record the yes, set the State | `closing.md`, lines 54 and 55 |
| Remove the item's line from the project's Current State | `closing.md`, line 56; the writer is named in `SKILL.md`, line 94 |

Stated in two files: nothing. `SKILL.md`, lines 91 and 93, are pointers. The
procedure for a decision entry and for a rule is in neither skill: it is
`filing-project-records`' own.

### (b) An item is cancelled with one unproven lesson in its Notes

| Step | Where it is written |
| --- | --- |
| Cancel only on the owner's word, through `closing.md` | `<lifecycle>SKILL.md`, line 35 |
| Record his reason; settle the open sub-items | `closing.md`, lines 62 and 63 |
| Answer the closing question | `closing.md`, line 64 |
| The lesson is on the list, because its line has no outcome | `closing.md`, line 40 |
| Ask the owner: move up or drop | `closing.md`, line 41 |
| Moves up: file it in the home the filing table gives it. Either way, write the outcome at the end of the lesson's line | `closing.md`, lines 46 and 47 |
| A cancelled item delivered nothing, so no rule becomes Built | `closing.md`, line 39 |
| Fill Moved up, for example "Nothing: cancelled before any rule or decision was added." | `closing.md`, line 48 |
| Set the State to Cancelled; remove the item's line from Current State; leave the branch and worktree | `closing.md`, lines 65 to 67 |

Stated in two files: nothing. The lesson's place is a template field
(`work-item-template.md`, line 149).

### (c) The owner pastes a meeting transcript while refining an item tracked in Notion

| Step | Where it is written |
| --- | --- |
| File it before using it: `filing-project-records`, step "file a source". Then add its line under Notes, Sources, with its SRC-### | `<lifecycle>references/refining-requirements.md`, line 55 |
| What becomes a requirement, a question, or context | `refining-requirements.md`, line 56 |
| The form of the Sources line | `<lifecycle>assets/work-item-template.md`, lines 143 to 147 |
| How to write that line into the Notion page | `assets/work-notion/.claude/skills/using-work-tracker/references/page-layout.md`, "Notes lines", line 131 |
| Nothing is uploaded to Notion. The Files property row says: "Files the owner attached himself. The agent adds none." | `assets/work-notion/.claude/skills/using-work-tracker/references/database-layout.md`, line 70 |

Stated in two files: the step is in `refining-requirements.md`, line 55,
only. Four pointers name the same skill and step: the Hand-offs rows of
`<lifecycle>SKILL.md` (line 92) and of the three trackers. They are kept
because a request such as "save this transcript on WI-31" opens the tracker
first.

## 4. Line counts, before and after

Before is commit `2fe33ca1`. The Notion request files in `assets/schema/`
were not changed and are left out.

| File | Before | After |
| --- | --- | --- |
| `<lifecycle>SKILL.md` | 120 | 121 |
| `<lifecycle>assets/design-template.md` | 185 | 181 |
| `<lifecycle>assets/work-item-template.md` | 152 | 160 |
| `<lifecycle>references/acceptance-checker-brief.md` | 57 | 56 |
| `<lifecycle>references/builder-brief.md` | 64 | 64 |
| `<lifecycle>references/building.md` | 166 | 165 |
| `<lifecycle>references/closing.md` | none | 83 |
| `<lifecycle>references/deploying.md` | 86 | 41 |
| `<lifecycle>references/design-architect-brief.md` | 59 | 59 |
| `<lifecycle>references/design-critic-brief.md` | 58 | 58 |
| `<lifecycle>references/designing.md` | 33 | 32 |
| `<lifecycle>references/refining-requirements.md` | 113 | 72 |
| `<lifecycle>references/reflecting.md` | 31 | removed |
| `<lifecycle>references/requirements-analyst-brief.md` | 45 | 46 |
| `<lifecycle>references/researcher-brief.md` | 50 | 50 |
| `<lifecycle>references/salesforce-deploying.md` | 28 | 28 |
| `<lifecycle>references/testing-loop.md` | 37 | 37 |
| `work-local` tracker: `SKILL.md` | 54 | 51 |
| `work-local` tracker: `references/field-mapping.md` | 202 | 146 |
| `work-local` tracker: `references/folders-and-files.md` | 175 | 137 |
| `work-local` tracker: `references/project-roadmap-and-tasks.md` | 30 | 30 |
| `work-local` tracker: `references/searching.md` | 71 | 71 |
| `work-notion` tracker: `SKILL.md` | 68 | 68 |
| `work-notion` tracker: `references/database-layout.md` | 321 | 296 |
| `work-notion` tracker: `references/page-layout.md` | 163 | 168 |
| `work-notion` tracker: `references/searching.md` | 132 | 115 |
| `work-github` tracker: `SKILL.md` | 50 | 51 |
| `work-github` tracker: `references/gh-commands.md` | 180 | 180 |
| `work-github` tracker: `references/issue-layout.md` | 195 | 125 |
| `work-github` tracker: `references/labels.md` | 100 | 100 |
| `work-github` tracker: `references/project-roadmap-and-tasks.md` | 87 | 87 |
| `work-github` tracker: `references/searching.md` | 97 | 97 |
| `assets/work-local/work-items/work-item-template/WORK-ITEM.md` | 152 | 160 |
| `assets/work-local/work-items/work-item-template/DESIGN.md` | 185 | 181 |
| `assets/work-local/work-items/work-item-template/references/.gitkeep` | 0 | removed |
| `assets/work-local/work-items/PROJECT-TASKS.md` | 10 | 10 |
| `references/notion-build/work-item-page.md` | 57 | 60 |

Many lines in these files are one long paragraph, so words show the size
better:

| Skill (Markdown files) | Lines before | Lines after | Words before | Words after |
| --- | --- | --- | --- | --- |
| `running-work-item-lifecycle` | 1,284 | 1,253 | 18,267 | 17,619 |
| `using-work-tracker`, local | 532 | 435 | 6,733 | 5,520 |
| `using-work-tracker`, Notion | 684 | 647 | 7,202 | 6,828 |
| `using-work-tracker`, GitHub | 709 | 640 | 6,986 | 6,437 |

## Not checked here

- The routing test in both hosts. Three descriptions changed
  (`running-work-item-lifecycle`, and the local and Notion versions of
  `using-work-tracker`), so it must run again.
- The wording, overlap, and best-practices reviews by a separate agent.
- A live close of a work item, and a live read of a Notion page that has the
  new Moved up line.
- `filing-project-records` and `using-memory-store` are written by another
  builder on another branch. This text names their steps; nothing here could
  test that those steps exist.

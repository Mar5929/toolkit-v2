# Fix pass 2: the second review's findings

Work item: TKV-24. Date: 2026-10-05. Branch: `claude/one-home-layout`.
The review: `dev/reviews/2026-10-05-fixes-reread-review.md` (2 blockers, 13
should fix, 21 notes, and 8 earlier findings it lists as not closed).

Every command below was run from the worktree root unless a line says
otherwise. "Seen" means the output was read in this session. No live
session of Claude Code or Codex was run, and the routing test in the two
products was not run. One description changed (`project-setup`: "live" is
now "are kept"), so the routing test must run again.

## 1. The findings: what was done

| Number | Result | What changed, or why not |
| --- | --- | --- |
| Blocker 1 | Fixed | `publish-docs`, step 8 and a new section "The main checkout": after a pushed save is verified, the main checkout's default branch is fast-forwarded, after a merge-safety check; when it cannot be done the skill says so and names the files. `filing-project-records` ("Every time", `record-decision.md` step 7, `file-source.md` step 7, `update-system-doc.md` "Mark a rule Built" step 6) and `running-work-item-lifecycle` (`closing.md`, step 5) write a pointer only after the main checkout holds the save. The script: in a session that works in its own worktree, work items and Current State are checked against the main checkout's records. |
| Blocker 2 | Fixed | `placing-files.md`, "5. The pre-commit check": the "change nothing" row applies when the hooks folder lists any file whose name does not end in `.sample`. `finishing.md`, `update.md`, the repository `AGENTS.md` ("Code limit"), and `README.md` say the same. |
| 3 | Fixed | The starter root `AGENTS.md` is 19,879 bytes (was 20,664). Section 3 lists each cut. |
| 4 | Fixed | `interview.md`, "Look before asking": a new row. When `system/`, `sources/`, `delivery/`, or `reference/` already holds a file, setup stops and asks. |
| 5 | Fixed | The Related items and Moved up prompts hold no second pair of angle brackets, in `WORK-ITEM.md`, its copy in `running-work-item-lifecycle`, and the Notion page text. |
| 6 | Fixed | The script: text in backticks is never a prompt. |
| 7 | Fixed | The script: a source row is kept in the repository only when "Where kept" holds a Markdown link. `sources/AGENTS.md` gives that form. |
| 8 | Fixed | The script: after an edit of a file in another repository, or outside every repository, it checks nothing and exits 0. |
| 9 | Fixed | The root `AGENTS.md`, `reference/AGENTS.md`, and `system/AGENTS.md` say "what was observed, in which environment, and on which date". `one-home-layout.md` already said the same (its row for `system-guide/`): not changed. |
| 10 | Fixed | `hindsight-memory.md`: the save is at the end of every turn, as in `hindsight-on-vps.md`; "In Codex, which has no such skill, follow the guide the add-on shows at session start." From `ai-external-knowledge/hindsight/coding-agents-readme.md` (the companion skill is installed for Claude Code; "hook harnesses write the transcript on Stop"). No tool is listed. |
| 11 | Fixed | `old-toolkit-pieces.md`: both pointers name `one-home-layout.md`. |
| 12 | Fixed | `earlier-versions.md` and `publish-docs/references/recovery.md` name the work item template for the forms of Next action. |
| 13 | Fixed | `running-work-item-lifecycle/SKILL.md`: Designing "when two ways to build it differ in what the owner would see, pay for, or have to maintain, or when a mistake in the change would be costly to undo". |
| 14 | Fixed | `README.md`: "check the setup" puts back a missing toolkit guide or blank form in `work-items/` or `memory/`. |
| 15 | Fixed | `dev/reviews/overlap-review.md`: 500 characters, in three places. |
| 16 | Fixed | `prompt-reminder.mjs`: "the filing test in the root AGENTS.md". |
| 17 | Fixed | `prompt-reminder.mjs`: a sentence that ends in "?" is still dropped, except when it holds "can you", "could you", "will you", "would you", "please", "from now on", or "going forward". No simple rule separates every request from every question, so the rule prefers the hint: "Can you find the root cause?" gets it. 65 lines, as before. |
| 18 | Fixed | Root `AGENTS.md`: "puts back a missing one". |
| 19 | Fixed | Root `AGENTS.md`: "says where each command is". |
| 20 | Fixed | `move-over.md` names `update.md`, "The record check and the pre-commit file", step 4, and the step of the move-over that runs it. |
| 21 | Fixed | The script writes with `console.error`, which ignores a reader that closed the output: exit 0. Tested. |
| 22 | Fixed | The script: a record that is there but cannot be read gives one line and exit 0. A missing record is still an empty one. Tested. |
| 23 | Corrected | No shipped file held the number. A correction is under the table in `dev/test-runs/fix-pass-setup-and-tools.md`, section 10. |
| 24 | Fixed in part | The Claude Code matcher is `Edit|Write`. The other three points are not fixed: the script is at its size, and each needs a design choice. They are in `dev/research/layout-audit/CHECKS-SPEC.md`, "Known limits of this version". |
| 25 | Fixed | "The record check found problems: 3."; "Lines that hold an angle-bracket prompt from the form: 2."; "File it with filing-project-records, which gives it a row and its SRC ID."; "The record check did not run. Its own error: ...". The error text is still shown after that label, so the owner can pass it on. |
| 26 | Fixed | The repository `AGENTS.md` ("the four hook commands"); the Codex manifest's `longDescription` (three skills, four hook commands, and a sentence on the third skill); `CHECKS-SPEC.md` (six lines). No version number changed. |
| 27 | Fixed | `README.md` names the rule `.claude/rules/hindsight-memory.md`. |
| 28 | Fixed | `update.md`, "Whose edit a difference is": a commit is the toolkit's when it also changes a skill and its message names the setup, a move-over, or a toolkit update; otherwise ask. |
| 29 | Fixed | `update-system-doc.md`, step 2: "Decided gives Approved, and Open gives Draft". |
| 30 | Fixed | `writing-harness-files/references/checklist.md`: a fork inherits the style. |
| 31 | Fixed | `check-skills.mjs` fails when the list of the kinds of harness file in the skill's `SKILL.md` is not, word for word, in the repository `AGENTS.md` (twice) and `README.md`, when the description lacks a kind, or when `checklist.md` has no section for one. Shown by removing a kind from `README.md`: 1 error. |
| 32 | Fixed | `work-items/AGENTS.md`: whole sentences; a project task's ID is unique within `PROJECT-TASKS.md`. |
| 33 | Fixed | `delivery/AGENTS.md`: a record that belongs to no single work item is committed with `publish-docs`. The root row points to the guide. New meaning. |
| 34 | Fixed | The `project-setup` description and its row in `dev/SKILL-INDEX.md`: "are kept". 478 characters. |
| 35 | Not changed | Each of the two files names one tool where a step needs that exact tool. Neither lists the tools. The first fix list asked for the exact name of the correction tool. |
| 36 | Fixed | Confirmed in `ai-external-knowledge/codex/hooks.md`, "PostToolUse": Codex "replaces the tool result with that feedback". After an edit the first line of the findings now says "The edit was not undone." |

Earlier findings the review lists as not closed:

| Finding | Result |
| --- | --- |
| Review 2, 24 | Closed by finding 13. |
| Review 2, 26 | Closed by finding 15. |
| Review 2, 35 | Not changed. The six texts are not word for word the same (four name the calls of their own skill, one is a one-line brief, one is a section of five steps). `check-skills.mjs` compares a shared text only as a whole file whose first line names its source. A shared paragraph would need a marker line inside each `SKILL.md`, a new check that cuts a paragraph out of a larger file, and one wording that drops what each skill says about its own calls. |
| Review 3, 11 | Closed by finding 11. |
| Review 3, 19 | Not mine: the last build step. |
| Review 3, 23 | Closed by finding 9. |
| Review 3, 28 | Closed: the "Status of the fixes" section of all five review files says, by number, what is closed, what waits for the owner, and what is open. |
| Review 3, 30 | Not added, as instructed: the orchestrator adds the rule when the branch lands. |

The twelve changes the owner should see: `DESIGN-SPEC.md`, section 9, lists
all twelve in plain sentences under "for the owner to confirm", and under
them what this pass changed. None of the twelve was changed except item 8
(finding 13) and item 9 (note 17).

Nothing listed under "Waits for the owner" in
`dev/research/layout-audit/FIX-LIST.md` was changed.

## 2. Blocker 1 in three lines

- `publish-docs` fast-forwards the main checkout's default branch after a
  pushed save, when its merge-safety check finds no file in the way.
- A pointer to the new record is written into a work item only after the
  skill reports that the main checkout holds the save.
- In a worktree session the script runs its checks a second time on the
  main checkout and takes the findings for `work-items/` and `memory/` from
  that run, so an ID a work item names is looked up where the work item is.

## 3. The starter root AGENTS.md: 20,664 to 19,879 bytes

`wc -c plugins/toolkit/skills/project-setup/assets/every-project/AGENTS.md`
printed 19879. `git show HEAD:<the same path> | wc -c` printed 20664. After
the fill-ins of a test project it is 149 lines and 19,819 bytes (section 6);
the setup limits are 200 lines and 20,480 bytes. No description in the
"What it holds" column was shortened.

| Cut | Bytes | Why it is a repetition |
| --- | --- | --- |
| The fill-in comment lost "Those are the only two prompts" and "this file reads the same in every project" | 106 | The comment names the two prompts already; the setup references say the second |
| "Every session", first line: "what is in progress, what waits on the owner, and where the next session starts" | 81 | The row for `memory/CURRENT_STATE.md` says it |
| The sentence above the map table | 78 | The table's header row says it |
| The guides row: "Git does not track them" (and note 18, "puts back a missing one") | 15 | The bullet above the table says it |
| The `memory/CURRENT_STATE.md` row: the Hindsight rule's path | 19 | "As for `memory/`", the row above |
| The `delivery/` row: where a record is committed | 55 | `delivery/AGENTS.md` holds it; the row points there |
| The `reference/current-system/` row: "existing", "before this project's changes" (finding 9) | 26 | |
| Note 19: "says where each command is" | -8 | |
| The "Operating conventions" row: "When the system must follow it, it is a rule: `system/`." | 58 | The row's first cell says "that is not a rule of the system", and the two rows below send a rule to `system/` |
| "Toolkit settings in `PROJECT.md` lists this project's choices" | 65 | The `PROJECT.md` row says it |
| The bullet that `DECISIONS.md`, `system/`, `sources/`, `delivery/`, and `reference/` are in every project | 118 | The bullet above it says a marked row is only in some projects, and these rows have no mark |
| "One skill does each job." | 25 | The `.claude/skills/` row says it |
| "Never save one with `publish-docs`." | 36 | The sentence before it says a pull request |
| ", with a pointer in each item" | 29 | The sentence above the table says it |
| The `delivery/deployments/` and `delivery/migrations/` rows: the Salesforce skill names | 82 | The Salesforce row of "Which skill" names them |
| Total | 785 | |

## 4. The seven checks

| Command | Result (seen) |
| --- | --- |
| `claude plugin validate .` | `✔ Validation passed` |
| `claude plugin validate ./plugins/toolkit` | `✔ Validation passed` |
| `claude plugin validate ./plugins/workstreams` | `✔ Validation passed` |
| `claude plugin test ./plugins/workstreams` | `14 pass`, `0 fail` |
| `node dev/tools/check-skills.mjs` | `23 skills checked ... passed, 0 errors, 0 warnings.` |
| `node dev/tools/check-rules.mjs` | `passed with 2 warnings.` The two are the ones the run had before this pass: `salesforce-org-safety.md` (4,200 bytes) and `session-handoff.md` (a long paragraph). Both are the owner's text. |
| `node --test 'dev/tests/*.test.mjs'` | `tests 108`, `pass 108`, `fail 0` (98 before: 9 new in `validate-records-cases.test.mjs`, 1 new in `hooks.test.mjs`) |

The nine new tests were also run against the script as it was before this
pass (`git show HEAD:<path>` written over the file, then restored): 8
failed. The ninth, "blocker 1, with a remote", passes with either script,
because that fix is in the steps of `publish-docs`.

## 5. Sizes

| File | Lines | Limit |
| --- | --- | --- |
| `validate-records.mjs` | 279 | 280 |
| `dev/tests/validate-records.test.mjs` | 279 | 280 |
| `dev/tests/validate-records-cases.test.mjs` (new) | 189 | none set |
| `prompt-reminder.mjs` | 65 | 65 |
| `session-start.mjs` (not changed) | 54 | 54 |
| `codex-after-commit.mjs` (not changed) | 20 | 20 |

No line of a hook command is over 100 characters. No hook got a new job.
Everything the review asked of the script fit. The owner has been told
about 279 lines of tests; the second test file adds 189 lines he has not
been told about.

How the lines were found in `validate-records.mjs`: three loops became
`filter(...).forEach(...)` (checks 8 and 12), check 9 looks the home of an
ID up in a small table, two `map` calls share a line, and the last block
exits early in place of an `if` block.

## 6. The reproductions

Made in a scratch folder, `<fix-2>` below:
`<scratchpad>/fix-2/`. `HOME` pointed into that folder. `run.sh` built each
case and printed each command, its output, and its exit code. Each case
starts from one setup copy made as `setup-copy.md` says for local work
items, local memory, and no Salesforce: `every-project`, `work-local`,
`memory-process`, `memory-local`, and `owner-preferences.md`; the project
name, the outcome sentence, the "Build, test, or deploy" row, and the 11
"Toolkit settings" lines filled; the fill-in comment of `AGENTS.md`
removed. "The script before this pass" is `git show HEAD:<path>`.

What the output shows:

- Verification 4. A fresh project gives no finding at stop, before a
  commit, and after an edit of seven files with the input of each product
  (exit 0, no output, 16 runs). Its `AGENTS.md` is 149 lines and 19,819
  bytes.
- Blocker 1, with a remote. With the pointer written before the main
  checkout is updated, the finding of the review appears (exit 2). After
  the new part of step 8, the edit of the work item and the stop both give
  exit 0. `DEC-009`, which no record defines, is still reported (exit 2).
  A second case shows the merge-safety check: another session's
  uncommitted change to `DECISIONS.md` is in both lists, so nothing is
  merged.
- Blocker 1, from a worktree with no remote. The script before this pass:
  exit 2, "DEC-001 is written here, but DECISIONS.md has no DEC-001". Now:
  exit 0 at stop and after the edit. `DEC-009` is still reported.
- Blocker 2. With `commit-msg` and `pre-push` in the hooks folder,
  `core.hooksPath` stays unset and the project's `commit-msg` hook still
  runs. On a copy, the old step sets it, and the hook no longer runs.
- Finding 4. `ls system sources delivery reference` lists a file in two of
  the four, so the row stops setup. On a copy, the old steps end with the
  setup commit stopped by the record check.
- Finding 5. An open item from the old template: three false findings. From
  the template now: none. With status Done: one finding, the empty Moved
  up line.
- Finding 6, finding 7, finding 8, note 21, note 22: exit 2 or exit 1 with
  the script before this pass, exit 0 now; a real prompt, and the same
  broken file edited in its own repository, are still reported.

```text

### Verification 4: a fresh project built by the setup steps (local work items, local memory, not Salesforce)
$ git -C <fix-2>/case-fresh config --get core.hooksPath
[exit 1]
$ ls "$(git rev-parse --git-path hooks)" | grep -v "\.sample$"
[exit 1: no hook of the project's own]
$ git -C <fix-2>/case-fresh config core.hooksPath .githooks
[exit 0]
$ (at stop) node .claude/hooks/validate-records.mjs --all
[exit 0]
$ (before a commit) node .claude/hooks/validate-records.mjs --staged
[exit 0]
$ (after a Claude Code edit of DECISIONS.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Codex patch of DECISIONS.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Claude Code edit of system/glossary.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Codex patch of system/glossary.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Claude Code edit of sources/README.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Codex patch of sources/README.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Claude Code edit of AGENTS.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Codex patch of AGENTS.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Claude Code edit of work-items/PROJECT-TASKS.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Codex patch of work-items/PROJECT-TASKS.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Claude Code edit of memory/CURRENT_STATE.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Codex patch of memory/CURRENT_STATE.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Claude Code edit of memory/MEMORY.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Codex patch of memory/MEMORY.md) node .claude/hooks/validate-records.mjs 
[exit 0]
$ wc -lc <fix-2>/case-fresh/AGENTS.md
     149   19819 <fix-2>/case-fresh/AGENTS.md
[exit 0]
The setup limits (finishing.md): 200 lines or less, 20,480 bytes or less.
$ wc -c <worktree>/plugins/toolkit/skills/project-setup/assets/every-project/AGENTS.md
   19879 <worktree>/plugins/toolkit/skills/project-setup/assets/every-project/AGENTS.md
[exit 0]
$ git show HEAD:<the same file> | wc -c   (before this pass)
   20664

### Blocker 1, case 1: a project with a remote. The steps of publish-docs, then the pointer in the work item.
$ git -C <fix-2>/case-b1-remote worktree add -q --detach .claude/worktrees/docsave-dec-001 origin/main
[exit 0]
$ git -C <fix-2>/case-b1-remote/.claude/worktrees/docsave-dec-001 add -- DECISIONS.md
[exit 0]
$ git -C <fix-2>/case-b1-remote/.claude/worktrees/docsave-dec-001 commit -q -m Record DEC-001
[exit 0]
$ git -C <fix-2>/case-b1-remote/.claude/worktrees/docsave-dec-001 push -q origin HEAD:main
[exit 0]
$ git -C <fix-2>/case-b1-remote/.claude/worktrees/docsave-dec-001 fetch -q origin main
[exit 0]
$ git -C <fix-2>/case-b1-remote/.claude/worktrees/docsave-dec-001 branch -r --contains 928b4535abaf01a56e58f3006b6b0062c4f7d616
  origin/main
[exit 0]

Before this pass the skill stopped here and the next step wrote the pointer. That order still gives the finding:
$ (at stop, main checkout behind the remote) node .claude/hooks/validate-records.mjs --all
The record check found problems: 1. Fix each one. Tell the owner of any you cannot fix.
work-items/WI-001-shared-inbox/WI-001.md:11: DEC-001 is written here, but DECISIONS.md has no DEC-001. Correct the ID, or file the record first with filing-project-records.
[exit 2]

The new part of step 8, "The main checkout":
$ git -C <fix-2>/case-b1-remote branch --show-current
main
[exit 0]
$ git -C <fix-2>/case-b1-remote diff --name-only HEAD origin/main
DECISIONS.md
[exit 0]
$ git -C <fix-2>/case-b1-remote status --porcelain
[exit 0]
$ git -C <fix-2>/case-b1-remote merge -q --ff-only origin/main
[exit 0]
$ git -C <fix-2>/case-b1-remote worktree remove .claude/worktrees/docsave-dec-001
[exit 0]

Now record-decision.md, step 7, writes the pointer:
$ (after the edit of the work item) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (at stop) node .claude/hooks/validate-records.mjs --all
[exit 0]

An ID that no record defines is still reported:
$ (at stop) node .claude/hooks/validate-records.mjs --all
The record check found problems: 1. Fix each one. Tell the owner of any you cannot fix.
work-items/WI-001-shared-inbox/WI-001.md:11: DEC-009 is written here, but DECISIONS.md has no DEC-009. Correct the ID, or file the record first with filing-project-records.
[exit 2]

### Blocker 1, the merge-safety check: another session has an uncommitted change to a file the update changes
$ git -C <fix-2>/case-b1-blocked diff --name-only HEAD origin/main
DECISIONS.md
[exit 0]
$ git -C <fix-2>/case-b1-blocked status --porcelain
 M DECISIONS.md
[exit 0]
DECISIONS.md is in both lists, so the skill changes nothing and reports: "The main checkout does not hold this save yet: DECISIONS.md has an uncommitted change that is not this session's." The filing step writes no pointer.
$ git -C <fix-2>/case-b1-blocked log --oneline -1
4b2f10e Set up Toolkit V2
[exit 0]

### Blocker 1, case 2: no remote, and the session works in its own worktree
$ git -C <fix-2>/case-b1-worktree worktree add -q <fix-2>/case-b1-worktree/.claude/worktrees/task -b claude/task
[exit 0]
$ git -C <fix-2>/case-b1-worktree worktree add -q --detach .claude/worktrees/docsave-dec-001 main
[exit 0]
$ git -C <fix-2>/case-b1-worktree/.claude/worktrees/docsave-dec-001 add -- DECISIONS.md
[exit 0]
$ git -C <fix-2>/case-b1-worktree/.claude/worktrees/docsave-dec-001 commit -q -m Record DEC-001
[exit 0]
$ git -C <fix-2>/case-b1-worktree status --porcelain
[exit 0]
$ git -C <fix-2>/case-b1-worktree merge -q --ff-only eb4325a68a9c80f7849f96698099ec257fbe2770
[exit 0]
$ git -C <fix-2>/case-b1-worktree worktree remove .claude/worktrees/docsave-dec-001
[exit 0]
$ grep -c DEC-001 <main checkout>/DECISIONS.md <session worktree>/DECISIONS.md
DECISIONS.md:3
.claude/worktrees/task/DECISIONS.md:2
$ (at stop, in the session worktree, the script before this pass) node validate-records.mjs --all
The record check found 1 problem(s). Fix each one. Tell the owner about any you cannot fix.
work-items/WI-001-shared-inbox/WI-001.md:11: DEC-001 is written here, but DECISIONS.md has no DEC-001. Correct the ID, or file the record first with filing-project-records.
[exit 2]
$ (at stop, in the session worktree) node .claude/hooks/validate-records.mjs --all
[exit 0]
$ (after the edit of the work item, from the session worktree) node .claude/hooks/validate-records.mjs 
[exit 0]

An ID that no record defines is still reported:
$ (at stop, in the session worktree) node .claude/hooks/validate-records.mjs --all
The record check found problems: 1. Fix each one. Tell the owner of any you cannot fix.
work-items/WI-001-shared-inbox/WI-001.md:11: DEC-009 is written here, but DECISIONS.md has no DEC-009. Correct the ID, or file the record first with filing-project-records.
[exit 2]

### Blocker 2: a repository with its own commit-msg and pre-push hooks
placing-files.md, "5. The pre-commit check", step 2:
$ git -C <fix-2>/case-b2-hooks config --get core.hooksPath
[exit 1]
$ ls "$(git rev-parse --git-path hooks)"
applypatch-msg.sample commit-msg commit-msg.sample fsmonitor-watchman.sample post-update.sample pre-applypatch.sample pre-commit.sample pre-merge-commit.sample pre-push pre-push.sample pre-rebase.sample pre-receive.sample prepare-commit-msg.sample push-to-checkout.sample sendemail-validate.sample update.sample 
Step 3: the first prints nothing, and the second lists commit-msg and pre-push, whose names do not end in .sample.
That is the row "Change nothing". No command is run. After the step:
$ git -C <fix-2>/case-b2-hooks config --get core.hooksPath
[exit 1]
$ git -C <fix-2>/case-b2-hooks commit -q -m Set up Toolkit V2
commit-msg ran
[exit 0]
Before this pass the step looked only for a file named pre-commit, found none, and ran the next command. Run here on a copy to show what it did:
$ git -C <fix-2>/case-b2-hooks-old config core.hooksPath .githooks
[exit 0]
$ git -C <fix-2>/case-b2-hooks-old commit -q -m A later commit
[exit 0]
(no "commit-msg ran" line: Git no longer runs the project's own hook)

### Finding 4: a folder that already has its own sources/ and system/
interview.md, "Look before asking", the new row:
$ ls system sources delivery reference
ls: delivery: No such file or directory
ls: reference: No such file or directory
sources:
index.ts

system:
notes.txt
[exit 1]
system/ and sources/ each list a file, so the row says: stop, copy nothing, and ask "This project already has `system/`. Rename it, or move its files, before setup?"
What happened before this pass, when setup went on (shown on a copy):
$ git -C <fix-2>/case-f4-old commit -q -m Set up Toolkit V2
The record check found problems: 1. The commit was stopped. Fix each one. Tell the owner of any you cannot fix.
sources/index.ts: has no row in sources/README.md. File it with filing-project-records, which gives it a row and its SRC ID.
[exit 1]

### Finding 5: a work item that still holds the template prompts
With the template as it was before this pass (two prompts hold a second pair of angle brackets):
$ (at stop, an open item from the old template) node .claude/hooks/validate-records.mjs --all
The record check found problems: 3. Fix each one. Tell the owner of any you cannot fix.
work-items/WI-003-old-form/WI-003.md:41: DEC-014 is written here, but DECISIONS.md has no DEC-014. Correct the ID, or file the record first with filing-project-records.
work-items/WI-003-old-form/WI-003.md:41: SEC-04 is written here, but system/ has no SEC-04. Correct the ID, or file the record first with filing-project-records.
work-items/WI-003-old-form/WI-003.md:43: DAT-02 is written here, but system/ has no DAT-02. Correct the ID, or file the record first with filing-project-records.
[exit 2]
With the template now:
$ grep "^\*\*Related items:\|^\*\*Moved up:" WI-002.md | grep -c "<[^<>]*<"   (lines of the two prompts that hold a second pair)
0
$ (at stop, an open item) node .claude/hooks/validate-records.mjs --all
[exit 0]
$ (at stop, the same item with status Done) node .claude/hooks/validate-records.mjs --all
The record check found problems: 1. Fix each one. Tell the owner of any you cannot fix.
work-items/WI-002-new-item/WI-002.md: the item is closed, but its Moved up line is empty. The closing step of running-work-item-lifecycle fills it.
[exit 2]

### Finding 6: a line with `Map<Id, Account>`
$ grep -n Map< <fix-2>/case-f6-backticks/DECISIONS.md
42:- Decision: The cache is a `Map<Id, Account>` keyed by the client record.
[exit 0]
$ (at stop, the script before this pass) node validate-records.mjs --all
The record check found 1 problem(s). Fix each one. Tell the owner about any you cannot fix.
DECISIONS.md:42: 1 line(s) hold an angle-bracket prompt from the form. Replace each prompt with the real text.
[exit 2]
$ (at stop) node .claude/hooks/validate-records.mjs --all
[exit 0]
$ (at stop, with a real prompt on the same line) node .claude/hooks/validate-records.mjs --all
The record check found problems: 1. Fix each one. Tell the owner of any you cannot fix.
DECISIONS.md:42: Lines that hold an angle-bracket prompt from the form: 1. Replace each prompt with the real text.
[exit 2]

### Finding 7: an original kept outside Git whose place names a file that starts with its SRC ID
$ tail -1 <fix-2>/case-f7-outside/sources/README.md
| SRC-001 | 2026-10-01 | The client | A 2 GB export | The shared drive, folder "Exports", file SRC-001-export.zip | none yet |
[exit 0]
$ (at stop, the script before this pass) node validate-records.mjs --all
The record check found 1 problem(s). Fix each one. Tell the owner about any you cannot fix.
sources/README.md:8: SRC-001: "Where kept" names SRC-001-export.zip, which is not in sources/. Correct the link.
[exit 2]
$ (at stop) node .claude/hooks/validate-records.mjs --all
[exit 0]
$ (before a commit) node .claude/hooks/validate-records.mjs --staged
[exit 0]

### Finding 8: an edit to an AGENTS.md in another repository
$ cat <fix-2>/case-f8-other/system/CLAUDE.md
See AGENTS.md
[exit 0]
$ (after a Claude Code edit of the other repository's AGENTS.md, session in the first, the script before this pass) node validate-records.mjs 
The record check found 1 problem(s). Fix each one. Tell the owner about any you cannot fix.
system/CLAUDE.md: this folder has an AGENTS.md, so its CLAUDE.md holds exactly one line: @AGENTS.md. Restore that line.
[exit 2]
$ (after a Claude Code edit of the other repository's AGENTS.md, session in the first) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after a Codex patch of the other repository's AGENTS.md, session in the first) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (the same broken file, edited by a session in its own repository) node .claude/hooks/validate-records.mjs 
The record check found problems: 1. The edit was not undone. Fix each one. Tell the owner of any you cannot fix.
system/CLAUDE.md: this folder has an AGENTS.md, so its CLAUDE.md holds exactly one line: @AGENTS.md. Restore that line.
[exit 2]

### Note 21: the reader of stderr closed, on the script's own error
$ (the script before this pass) stdin "not json", stderr reader closed
[exit 1]
$ (the script now) stdin "not json", stderr reader closed
[exit 0]
$ (the same error with a reader) node .claude/hooks/validate-records.mjs 
The record check did not run. Its own error: SyntaxError: Unexpected token 'o', "not json" is not valid JSON
[exit 0]

### Note 22: sources/README.md is there but cannot be read
$ (at stop, the script before this pass) node validate-records.mjs --all
The record check found 1 problem(s). Fix each one. Tell the owner about any you cannot fix.
sources/SRC-001-notes.md: has no row in sources/README.md. Its name starts with its row's SRC ID. Add the row with filing-project-records.
[exit 2]
$ (at stop) node .claude/hooks/validate-records.mjs --all
The record check did not run. Its own error: Error: EACCES: permission denied, open '<fix-2>/case-n22-unreadable/sources/README.md'
[exit 0]
$ (before a commit) node .claude/hooks/validate-records.mjs --staged
The record check did not run. Its own error: Error: EACCES: permission denied, open '<fix-2>/case-n22-unreadable/sources/README.md'
[exit 0]
```

`run.sh`:

```bash
#!/bin/bash
# The reproductions for dev/test-runs/fix-pass-2.md. Everything is made under this folder.
# Usage: bash run.sh <worktree root>
set -u
ROOT="$1"
HERE="$(cd "$(dirname "$0")" && pwd -P)"
ASSETS="$ROOT/plugins/toolkit/skills/project-setup/assets"
VR=.claude/hooks/validate-records.mjs
export HOME="$HERE/home" GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME=Test GIT_AUTHOR_EMAIL=test@example.com GIT_COMMITTER_NAME=Test GIT_COMMITTER_EMAIL=test@example.com
rm -rf "$HERE/home" "$HERE/copy" "$HERE"/case-* "$HERE/old-validate-records.mjs"
mkdir -p "$HERE/home"
git -C "$ROOT" show "HEAD:plugins/toolkit/skills/project-setup/assets/every-project/$VR" > "$HERE/old-validate-records.mjs"

say() { printf '\n### %s\n' "$*"; }
# Runs a command, prints it, its output, and its exit code.
show() { printf '$ %s\n' "$*"; "$@" 2>&1; printf '[exit %s]\n' "$?"; }
check() { # check <label> <cwd> <stdin text> [args...]
  local label="$1" dir="$2" input="$3"; shift 3
  printf '$ (%s) node %s %s\n' "$label" "$VR" "$*"
  printf '%s' "$input" | (cd "$dir" && node "$VR" "$@") 2>&1; printf '[exit %s]\n' "${PIPESTATUS[1]}"
}
old() { # the script as it was before this fix pass, run the same way
  local label="$1" dir="$2" input="$3"; shift 3
  printf '$ (%s, the script before this pass) node validate-records.mjs %s\n' "$label" "$*"
  printf '%s' "$input" | (cd "$dir" && node "$HERE/old-validate-records.mjs" "$@") 2>&1; printf '[exit %s]\n' "${PIPESTATUS[1]}"
}
edit_json() { node -e 'process.stdout.write(JSON.stringify({ cwd: process.argv[1], hook_event_name: "PostToolUse", tool_name: "Write", tool_input: { file_path: process.argv[2] } }))' "$1" "$2"; }
patch_json() { node -e 'process.stdout.write(JSON.stringify({ cwd: process.argv[1], hook_event_name: "PostToolUse", tool_name: "apply_patch", tool_input: { command: "*** Begin Patch\n*** Update File: " + process.argv[2] + "\n@@\n-a\n+b\n*** End Patch\n" } }))' "$1" "$2"; }

# ------------------------------------------------------------------ the setup copy
# setup-copy.md: every-project, then the folders for local work items and local memory.
COPY="$HERE/copy"
mkdir -p "$COPY"
cp -R "$ASSETS/every-project/." "$COPY/"
cp -R "$ASSETS/work-local/." "$COPY/"
cp -R "$ASSETS/memory-process/." "$COPY/"
cp -R "$ASSETS/memory-local/." "$COPY/"
cp "$ASSETS/owner-preferences.md" "$COPY/.claude/rules/owner-preferences.md"
rm -rf "$COPY/.agents"
node - "$COPY" <<'EOF'
const fs = require('fs'), path = require('path');
const copy = process.argv[2];
const change = (file, edits) => { let s = fs.readFileSync(path.join(copy, file), 'utf8'); for (const [from, to] of edits) { if (!s.match(from) && !s.includes(from)) throw new Error(`${file}: ${from}`); s = s.replace(from, to); } fs.writeFileSync(path.join(copy, file), s); };
for (const file of ['AGENTS.md', 'README.md', 'PROJECT.md']) change(file, [[/^(#{1,6} .*)<Project name>/m, '$1HarborDesk']]);
change('PROJECT.md', [['`<local, notion, or github>`', '`local`'], ['`<local, notion, or hindsight>`', '`local`'], ['`<onboarding or trusted>`', '`onboarding`'], ['`<WI>`', '`WI`'],
  [/^- Notion work items: `<.*>`$/m, '- Notion work items: `not used`'], ['`<owner/name>`', '`not used`'], [/^- Notion memory: `<.*>`$/m, '- Notion memory: `not used`'],
  [/^- Hindsight bank: `<.*>`$/m, '- Hindsight bank: `not used`'], [/^- Hindsight server: `<.*>`$/m, '- Hindsight server: `not used`'], [/^- Hindsight dashboard: `<.*>`$/m, '- Hindsight dashboard: `not used`'],
  [/^- Salesforce org aliases: `<.*>`$/m, '- Salesforce org aliases: `not used`']]);
// finishing.md: the outcome sentence, the "Build, test, or deploy" row, and the fill-in guide comment.
change('AGENTS.md', [[/<!-- Project setup fill-in guide:[^\n]*-->\n\n/, ''],
  ['<One sentence describing this project and its outcome.>', 'HarborDesk is a help desk web app that lets a small support team answer every customer request from one shared inbox, so no request is lost between email, chat, and the web form.'],
  ['`<Verified project commands and target environment; do not infer from this template.>`', 'Build: `npm run build`. Test: `npm test` (unit tests) and `npm run test:e2e` (browser tests against the local server). Deploy: `npm run deploy:staging`, then `npm run deploy:production` after the owner\'s yes; both go to the Render project "harbordesk".']]);
EOF

# A project straight from that copy, as placing-files.md leaves it.
project() { # project <folder>
  mkdir -p "$1" && cp -R "$COPY/." "$1/" && (cd "$1" && mkdir -p .agents && ln -s ../.claude/skills .agents/skills
    chmod +x .githooks/pre-commit && git init -q -b main && git add . && git commit -q -m 'Set up Toolkit V2')
}
entry() { printf '\n## %s: One shared inbox\n\n- Status: Decided\n- Raised: 2026-10-01, the owner\n- Decided: 2026-10-02, the owner\n- Decision: Every channel feeds one inbox.\n- Why: The owner asked for it.\n- Affects: WI-001\n- Replaces or replaced by: none\n- Sources: none\n' "$1"; }
item() { mkdir -p "$1/work-items/WI-001-shared-inbox" && printf -- '---\nid: WI-001\ntitle: Shared inbox\nstate: Building\nstatus: In progress\nparent: none\n---\n\n# WI-001: Shared inbox\n\n**Related items:** %s\n\n**Moved up:**\n' "$2" > "$1/work-items/WI-001-shared-inbox/WI-001.md"; }

# ------------------------------------------------------------------ verification 4
say 'Verification 4: a fresh project built by the setup steps (local work items, local memory, not Salesforce)'
P="$HERE/case-fresh"; project "$P"
show git -C "$P" config --get core.hooksPath
printf '$ ls "$(git rev-parse --git-path hooks)" | grep -v "\\.sample$"\n'; ls "$(git -C "$P" rev-parse --git-path hooks | sed "s|^|$P/|")" | grep -v '\.sample$'; printf '[exit %s: no hook of the project'"'"'s own]\n' "$?"
show git -C "$P" config core.hooksPath .githooks
check 'at stop' "$P" '{"hook_event_name":"Stop","stop_hook_active":false}' --all
check 'before a commit' "$P" '' --staged
for f in DECISIONS.md system/glossary.md sources/README.md AGENTS.md work-items/PROJECT-TASKS.md memory/CURRENT_STATE.md memory/MEMORY.md; do
  check "after a Claude Code edit of $f" "$P" "$(edit_json "$P" "$P/$f")"
  check "after a Codex patch of $f" "$P" "$(patch_json "$P" "$f")"
done
show wc -lc "$P/AGENTS.md"
printf 'The setup limits (finishing.md): 200 lines or less, 20,480 bytes or less.\n'
show wc -c "$ASSETS/every-project/AGENTS.md"
printf '$ git show HEAD:<the same file> | wc -c   (before this pass)\n'; git -C "$ROOT" show HEAD:plugins/toolkit/skills/project-setup/assets/every-project/AGENTS.md | wc -c

# ------------------------------------------------------------------ blocker 1, with a remote
say 'Blocker 1, case 1: a project with a remote. The steps of publish-docs, then the pointer in the work item.'
P="$HERE/case-b1-remote"; project "$P"; item "$P" 'No project phase yet.'
git init -q --bare -b main "$HERE/case-b1-remote.git" && git -C "$P" remote add origin "$HERE/case-b1-remote.git" && git -C "$P" push -q -u origin main
SAVE="$P/.claude/worktrees/docsave-dec-001"
show git -C "$P" worktree add -q --detach .claude/worktrees/docsave-dec-001 origin/main
python3 - "$SAVE/DECISIONS.md" <<'EOF'
import re, sys
p = sys.argv[1]; s = open(p).read()
entry = "## DEC-001: One shared inbox\n\n- Status: Decided\n- Raised: 2026-10-01, the owner\n- Decided: 2026-10-02, the owner\n- Decision: Every channel feeds one inbox.\n- Why: The owner asked for it.\n- Affects: WI-001\n- Replaces or replaced by: none\n- Sources: none\n"
s2 = re.sub(r"No entries yet[^\n]*\n", entry, s); assert s2 != s; open(p, "w").write(s2)
EOF
show git -C "$SAVE" add -- DECISIONS.md
show git -C "$SAVE" commit -q -m 'Record DEC-001'
show git -C "$SAVE" push -q origin HEAD:main
COMMIT="$(git -C "$SAVE" rev-parse HEAD)"
show git -C "$SAVE" fetch -q origin main
show git -C "$SAVE" branch -r --contains "$COMMIT"
printf '\nBefore this pass the skill stopped here and the next step wrote the pointer. That order still gives the finding:\n'
item "$P" 'No project phase yet. DEC-001'
check 'at stop, main checkout behind the remote' "$P" '' --all
item "$P" 'No project phase yet.'
printf '\nThe new part of step 8, "The main checkout":\n'
show git -C "$P" branch --show-current
show git -C "$P" diff --name-only HEAD origin/main
show git -C "$P" status --porcelain
show git -C "$P" merge -q --ff-only origin/main
show git -C "$P" worktree remove .claude/worktrees/docsave-dec-001
printf '\nNow record-decision.md, step 7, writes the pointer:\n'
item "$P" 'No project phase yet. DEC-001'
check 'after the edit of the work item' "$P" "$(edit_json "$P" "$P/work-items/WI-001-shared-inbox/WI-001.md")"
check 'at stop' "$P" '' --all
printf '\nAn ID that no record defines is still reported:\n'
item "$P" 'No project phase yet. DEC-001, DEC-009'
check 'at stop' "$P" '' --all

say 'Blocker 1, the merge-safety check: another session has an uncommitted change to a file the update changes'
P="$HERE/case-b1-blocked"; project "$P"
git init -q --bare -b main "$HERE/case-b1-blocked.git" && git -C "$P" remote add origin "$HERE/case-b1-blocked.git" && git -C "$P" push -q -u origin main
SAVE="$P/.claude/worktrees/docsave-dec-001"
git -C "$P" worktree add -q --detach .claude/worktrees/docsave-dec-001 origin/main
entry DEC-001 >> "$SAVE/DECISIONS.md" && git -C "$SAVE" add -- DECISIONS.md && git -C "$SAVE" commit -q -m 'Record DEC-001' && git -C "$SAVE" push -q origin HEAD:main
printf '\nA note from another session.\n' >> "$P/DECISIONS.md"
show git -C "$P" diff --name-only HEAD origin/main
show git -C "$P" status --porcelain
printf 'DECISIONS.md is in both lists, so the skill changes nothing and reports: "The main checkout does not hold this save yet: DECISIONS.md has an uncommitted change that is not this session'"'"'s." The filing step writes no pointer.\n'
show git -C "$P" log --oneline -1

# ------------------------------------------------------------------ blocker 1, from a worktree with no remote
say 'Blocker 1, case 2: no remote, and the session works in its own worktree'
P="$HERE/case-b1-worktree"; project "$P"; item "$P" 'No project phase yet.'
SESSION="$P/.claude/worktrees/task"; SAVE="$P/.claude/worktrees/docsave-dec-001"
show git -C "$P" worktree add -q "$SESSION" -b claude/task
show git -C "$P" worktree add -q --detach .claude/worktrees/docsave-dec-001 main
entry DEC-001 >> "$SAVE/DECISIONS.md"; sed -i '' '/^No entries yet/d' "$SAVE/DECISIONS.md"
show git -C "$SAVE" add -- DECISIONS.md
show git -C "$SAVE" commit -q -m 'Record DEC-001'
show git -C "$P" status --porcelain
show git -C "$P" merge -q --ff-only "$(git -C "$SAVE" rev-parse HEAD)"
show git -C "$P" worktree remove .claude/worktrees/docsave-dec-001
item "$P" 'No project phase yet. DEC-001'
printf '$ grep -c DEC-001 <main checkout>/DECISIONS.md <session worktree>/DECISIONS.md\n'; grep -c 'DEC-001' "$P/DECISIONS.md" "$SESSION/DECISIONS.md" | sed "s|$P/||"
old 'at stop, in the session worktree' "$SESSION" "{\"cwd\":\"$SESSION\",\"hook_event_name\":\"Stop\"}" --all
check 'at stop, in the session worktree' "$SESSION" "{\"cwd\":\"$SESSION\",\"hook_event_name\":\"Stop\"}" --all
check 'after the edit of the work item, from the session worktree' "$SESSION" "$(edit_json "$SESSION" "$P/work-items/WI-001-shared-inbox/WI-001.md")"
printf '\nAn ID that no record defines is still reported:\n'
item "$P" 'No project phase yet. DEC-001, DEC-009'
check 'at stop, in the session worktree' "$SESSION" "{\"cwd\":\"$SESSION\",\"hook_event_name\":\"Stop\"}" --all

# ------------------------------------------------------------------ blocker 2
say 'Blocker 2: a repository with its own commit-msg and pre-push hooks'
P="$HERE/case-b2-hooks"; mkdir -p "$P" && cp -R "$COPY/." "$P/" && git -C "$P" init -q -b main
HOOKS="$P/$(git -C "$P" rev-parse --git-path hooks)"
printf '#!/bin/sh\necho "commit-msg ran"\n' > "$HOOKS/commit-msg"; printf '#!/bin/sh\necho "pre-push ran"\n' > "$HOOKS/pre-push"; chmod +x "$HOOKS/commit-msg" "$HOOKS/pre-push"
printf 'placing-files.md, "5. The pre-commit check", step 2:\n'
show git -C "$P" config --get core.hooksPath
printf '$ ls "$(git rev-parse --git-path hooks)"\n'; ls "$HOOKS" | tr '\n' ' '; printf '\n'
printf 'Step 3: the first prints nothing, and the second lists commit-msg and pre-push, whose names do not end in .sample.\nThat is the row "Change nothing". No command is run. After the step:\n'
show git -C "$P" config --get core.hooksPath
git -C "$P" add . && show git -C "$P" commit -q -m 'Set up Toolkit V2'
printf 'Before this pass the step looked only for a file named pre-commit, found none, and ran the next command. Run here on a copy to show what it did:\n'
cp -R "$P" "$HERE/case-b2-hooks-old" && show git -C "$HERE/case-b2-hooks-old" config core.hooksPath .githooks
printf 'x\n' >> "$HERE/case-b2-hooks-old/README.md"; git -C "$HERE/case-b2-hooks-old" add README.md; show git -C "$HERE/case-b2-hooks-old" commit -q -m 'A later commit'
printf '(no "commit-msg ran" line: Git no longer runs the project'"'"'s own hook)\n'

# ------------------------------------------------------------------ finding 4
say 'Finding 4: a folder that already has its own sources/ and system/'
P="$HERE/case-f4-own-folders"; mkdir -p "$P/sources" "$P/system" && printf 'export const a = 1;\n' > "$P/sources/index.ts" && printf 'kernel notes\n' > "$P/system/notes.txt" && git -C "$P" init -q -b main
printf 'interview.md, "Look before asking", the new row:\n'
printf '$ ls system sources delivery reference\n'; (cd "$P" && ls system sources delivery reference 2>&1); printf '[exit %s]\n' "$?"
printf 'system/ and sources/ each list a file, so the row says: stop, copy nothing, and ask "This project already has `system/`. Rename it, or move its files, before setup?"\n'
printf 'What happened before this pass, when setup went on (shown on a copy):\n'
cp -R "$P" "$HERE/case-f4-old" && cp -R "$COPY/." "$HERE/case-f4-old/" && chmod +x "$HERE/case-f4-old/.githooks/pre-commit" && git -C "$HERE/case-f4-old" config core.hooksPath .githooks && git -C "$HERE/case-f4-old" add .
show git -C "$HERE/case-f4-old" commit -q -m 'Set up Toolkit V2'

# ------------------------------------------------------------------ findings 5 to 8, notes 21 and 22
say 'Finding 5: a work item that still holds the template prompts'
P="$HERE/case-f5-template"; project "$P"; mkdir -p "$P/work-items/WI-002-new-item"
sed -e 's/^id: .*/id: WI-002/' -e 's/^status: .*/status: In progress/' "$P/work-items/work-item-template/WORK-ITEM.md" > "$P/work-items/WI-002-new-item/WI-002.md"
printf 'With the template as it was before this pass (two prompts hold a second pair of angle brackets):\n'
git -C "$ROOT" show HEAD:plugins/toolkit/skills/project-setup/assets/work-local/work-items/work-item-template/WORK-ITEM.md | sed -e 's/^id: .*/id: WI-003/' -e 's/^status: .*/status: In progress/' > "$HERE/old-item.md"
mkdir -p "$P/work-items/WI-003-old-form" && cp "$HERE/old-item.md" "$P/work-items/WI-003-old-form/WI-003.md"
check 'at stop, an open item from the old template' "$P" '' --all
rm -rf "$P/work-items/WI-003-old-form"
printf 'With the template now:\n'
printf '$ grep "^\*\*Related items:\|^\*\*Moved up:" WI-002.md | grep -c "<[^<>]*<"   (lines of the two prompts that hold a second pair)\n'; grep '^\*\*Related items:\|^\*\*Moved up:' "$P/work-items/WI-002-new-item/WI-002.md" | grep -c '<[^<>]*<'
check 'at stop, an open item' "$P" '' --all
sed -i '' 's/^status: In progress/status: Done/' "$P/work-items/WI-002-new-item/WI-002.md"
check 'at stop, the same item with status Done' "$P" '' --all

say 'Finding 6: a line with `Map<Id, Account>`'
P="$HERE/case-f6-backticks"; project "$P"; entry DEC-001 | sed 's/Every channel feeds one inbox\./The cache is a `Map<Id, Account>` keyed by the client record./' >> "$P/DECISIONS.md"; sed -i '' '/^No entries yet/d' "$P/DECISIONS.md"; item "$P" 'DEC-001'
show grep -n 'Map<' "$P/DECISIONS.md"
old 'at stop' "$P" '' --all
check 'at stop' "$P" '' --all
sed -i '' 's/keyed by the client record/<say what it is keyed by> keyed by the client record/' "$P/DECISIONS.md"
check 'at stop, with a real prompt on the same line' "$P" '' --all

say 'Finding 7: an original kept outside Git whose place names a file that starts with its SRC ID'
P="$HERE/case-f7-outside"; project "$P"
printf '| SRC-001 | 2026-10-01 | The client | A 2 GB export | The shared drive, folder "Exports", file SRC-001-export.zip | none yet |\n' >> "$P/sources/README.md"; sed -i '' '/^No sources yet/d' "$P/sources/README.md"
show tail -1 "$P/sources/README.md"
old 'at stop' "$P" '' --all
check 'at stop' "$P" '' --all
check 'before a commit' "$P" '' --staged

say 'Finding 8: an edit to an AGENTS.md in another repository'
P="$HERE/case-f8-session"; project "$P"; O="$HERE/case-f8-other"; project "$O"
sed -i '' 's/^@AGENTS.md$/See AGENTS.md/' "$O/system/CLAUDE.md"
show cat "$O/system/CLAUDE.md"
old 'after a Claude Code edit of the other repository'"'"'s AGENTS.md, session in the first' "$P" "$(edit_json "$P" "$O/AGENTS.md")"
check 'after a Claude Code edit of the other repository'"'"'s AGENTS.md, session in the first' "$P" "$(edit_json "$P" "$O/AGENTS.md")"
check 'after a Codex patch of the other repository'"'"'s AGENTS.md, session in the first' "$P" "$(patch_json "$P" "$O/AGENTS.md")"
check 'the same broken file, edited by a session in its own repository' "$O" "$(edit_json "$O" "$O/system/CLAUDE.md")"

say 'Note 21: the reader of stderr closed, on the script'"'"'s own error'
P="$HERE/case-n21-closed"; project "$P"
closed() { node -e '
const { spawn } = require("child_process");
const c = spawn(process.execPath, [process.argv[1]], { cwd: process.argv[2], stdio: ["pipe", "ignore", "pipe"] });
c.stderr.destroy(); c.on("exit", (code) => console.log("[exit " + code + "]")); setTimeout(() => c.stdin.end("not json"), 200);' "$1" "$P"; }
printf '$ (the script before this pass) stdin "not json", stderr reader closed\n'; closed "$HERE/old-validate-records.mjs"
printf '$ (the script now) stdin "not json", stderr reader closed\n'; closed "$P/$VR"
check 'the same error with a reader' "$P" 'not json'

say 'Note 22: sources/README.md is there but cannot be read'
P="$HERE/case-n22-unreadable"; project "$P"; printf 'Notes.\n' > "$P/sources/SRC-001-notes.md"; chmod 000 "$P/sources/README.md"
old 'at stop' "$P" '' --all
check 'at stop' "$P" '' --all
check 'before a commit' "$P" '' --staged
chmod 644 "$P/sources/README.md"
```

## 7. Descriptions

Every description is under 500 characters and equal to its row in
`dev/SKILL-INDEX.md`: `check-skills.mjs` tests both, and a second count by
script gave 23 descriptions, 314 to 478 characters, all equal to their
rows. One description changed: `project-setup` (478 characters).

## 8. Not done, and not sure

- No live session, no routing test, no scratch Codex install, no Notion,
  GitHub, Hindsight, or org step, nothing on Windows.
- The separate wording, overlap, and best-practices reviews of this pass's
  text are the orchestrator's to arrange.
- Finding 8 has one case that now checks nothing and did before: a session
  whose folder is in no Git repository edits a file inside a Git project
  below it. The stop still checks nothing there, as before, because the
  stop runs in the session's folder.
- "The edit was not undone." is said after every edit, in both products.
  The Codex page says a `PostToolUse` hook runs after a tool produces
  output; whether that includes a patch that failed was not tested.
- The fast-forward of the main checkout was run with real Git commands in
  the scratch folder. No agent was run through the new steps of
  `publish-docs`.

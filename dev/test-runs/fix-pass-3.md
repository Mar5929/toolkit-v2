# Fix pass 3: the review of the second round of fixes

Work item: TKV-24. Date: 2026-10-05. Branch: `claude/one-home-layout`.
The review: `dev/reviews/2026-10-05-second-fixes-review.md` (1 blocker, 2
should fix, 10 notes). Start commit: `ce4ec05b`.

Every command below was run from the worktree root unless a line says
otherwise. "Seen" means the output was read in this session. No live
session of Claude Code or Codex was run. No description line, skill folder
name, or description row of `dev/SKILL-INDEX.md` changed. The separate
wording, overlap, and best-practices reviews of this pass's text are the
orchestrator's to arrange.

## 1. The findings: what was done

| Number | Result | What changed |
| --- | --- | --- |
| Blocker 1 | Fixed | `filing-project-records/SKILL.md`, "Every time", holds the instruction (section 2). `publish-docs`, "Carrying an edit across": a file is copied into the save worktree only when `git -C <working checkout> diff --quiet HEAD <save commit> -- <file>` exits 0; otherwise the same change is made by hand in the save worktree's file. The three step files name no checkout, so the one sentence covers every read and write in them, the "Used by" cell of `record-decision.md`, step 4, included. Their step 7 lines now point to "Every time" for when a pointer is written. |
| Should fix 2 | Fixed | `filing-project-records/SKILL.md`, "Every time": with local work items, when `publish-docs` reports that the main checkout does not hold the save, no pointer is written. One line for "Waiting on the owner" in Current State goes to `curating-project-memory` (Hindsight memory: `.claude/rules/hindsight-memory.md`): the ID, each work item that needs the pointer, and what blocks the update. When the main checkout's files hold the record, the pointers are written and the line is removed. `closing.md`, step 4, points to it. |
| Should fix 3 | Fixed | `finishing.md`, the pre-commit line of "Final checks": "report what it prints, and the reason placing-files.md, "5. The pre-commit check", gives for it". |
| Note 4 | Fixed | `publish-docs`, step 8 and "The main checkout": with no remote, the main checkout holds the save only when step 7 ran the fast-forward in the main checkout. |
| Note 5 | Fixed | `closing.md`, "The closing question": the condition is a new step 4, before the step that writes a lesson's outcome and the step that fills Moved up (now 5 and 6). |
| Note 6 | Fixed | `filing-project-records/SKILL.md` and `closing.md`: the wait and the stop apply with local work items. With work items in Notion or GitHub, a pointer is written once the save is on the default branch. |
| Note 7 | Fixed | `prompt-reminder.mjs`: "always" and "never" keep a sentence that ends in "?". 65 lines. Four new cases in `dev/tests/hooks.test.mjs`. |
| Note 8 | Fixed | `validate-records.mjs`: when the second run, on the main checkout, fails on its own error, the findings of the first run are reported, then one line: "The record check did not run in the main checkout. Its own error: ...". With no finding, that line alone, exit code 0. 279 lines. |
| Note 9 | Not fixed, by instruction | The script is not changed. Both limits are in `CHECKS-SPEC.md`, "Known limits of this version". |
| Note 10 | Fixed | `DESIGN-SPEC.md`, section 9, "for the owner to confirm": the form of the "Where kept" cell. |
| Note 11 | Fixed | `publish-docs` and `filing-project-records/SKILL.md`: "blocks the update". `DESIGN-SPEC.md`, section 9, too. |
| Note 12 | Fixed | `CHECKS-SPEC.md`: the script runs `git rev-parse` and `git diff --cached`; "check the setup" only reports `core.hooksPath`; "or any hook of its own". |
| Note 13 | Fixed | `placing-files.md`, section 5, last row of the table: "lists no file, or says the folder does not exist". |

Two findings the owner approved during this pass (relayed by the
orchestrator, 2026-10-05). Both were under "Waits for the owner" in
`FIX-LIST.md`:

| Finding | Result | What changed |
| --- | --- | --- |
| Review 1, finding 7, and review 3, finding 12: the "Memory approval" line | Fixed | The line is removed from `every-project/PROJECT.md`. `setup-copy.md`: the row of the fill-in table is removed, "11 lines" is "10 lines", and the count command no longer names the line and prints 10. `update.md`, section 3, row for "Toolkit settings": 10 lines, and the line that starts `- Memory approval:` is deleted from an existing project. `one-home-layout.md`: "fewer than 10". `old-toolkit-pieces.md`: the sentence that set the line is removed. The repository `AGENTS.md`: "the 10 lines". `interview.md`, `finishing.md`, `README.md`, and the tests and tools did not name or count the line. |
| Review 1, finding 6: `session-handoff.md` | Fixed | The body is the three lines the owner approved. `check-rules.mjs` no longer warns about the file; its closing message now names `salesforce-org-safety.md`, the one rule it still warns about. No other file names "the memory criteria". The first line and the root row for `handoff` overlap in meaning and are not word for word the same, so all three lines were kept (section 9). |

Everything else under "Waits for the owner" in `FIX-LIST.md` was not
changed.

## 2. Where the blocker's instruction lives

`filing-project-records/SKILL.md`, "Every time":

> A session whose folder is not the main checkout reads and writes `DECISIONS.md`, `sources/`, and `system/` only in the save worktree that `publish-docs` makes from the default branch, never in its own worktree: its own branch can lack records the default branch holds. When no save worktree is there, do steps 1 to 3 of `publish-docs` before you read or write a record. Where a step says to save, go on from step 4 of `publish-docs`.

Why there and not in `publish-docs`: only this skill writes the three
records, and the session must start the save before the first read, which
is an order of this skill's steps. `publish-docs`, step 4, already said
"Make the edit in the save worktree", so the two agree.

## 3. The seven checks (verification 1)

| Command | Result (seen) |
| --- | --- |
| `claude plugin validate .` | `✔ Validation passed` |
| `claude plugin validate ./plugins/toolkit` | `✔ Validation passed` |
| `claude plugin validate ./plugins/workstreams` | `✔ Validation passed` |
| `claude plugin test ./plugins/workstreams` | `14 pass`, `0 fail` |
| `node dev/tools/check-skills.mjs` | `23 skills checked ... passed, 0 errors, 0 warnings.` |
| `node dev/tools/check-rules.mjs` | `passed with 1 warning.` It is `salesforce-org-safety.md` (4,200 bytes), the owner's text. The warning about `session-handoff.md` is gone. |
| `node --test 'dev/tests/*.test.mjs'` | `tests 110`, `pass 110`, `fail 0` (108 before: 2 new in `validate-records-cases.test.mjs`) |

## 4. Sizes and descriptions (verification 4)

| File | Lines | Limit |
| --- | --- | --- |
| `validate-records.mjs` | 279 | 280 |
| `prompt-reminder.mjs` | 65 | 65 |
| `dev/tests/validate-records.test.mjs` (not changed) | 279 | 280 |
| `dev/tests/validate-records-cases.test.mjs` | 242 (was 189) | none set |

- No line of a hook command is over 100 characters.
- `git diff ce4ec05b -- plugins | grep -c '^[-+]description'` printed 0.
- `git diff ce4ec05b --stat -- dev/SKILL-INDEX.md` printed nothing.
- How note 8 fit in 279 lines: one function, `fail`, prints the "did not
  run" line in both places, and two pairs of declarations share a line
  (`dec` with `entries`, `src` with `srcRows`).
- The owner has been told about 189 lines in the second test file. It is
  242 now.

## 5. What the reproductions show

Made in a scratch folder, `<fix-3>` below: `<scratchpad>/fix-3/`. `HOME`
pointed into that folder. `run.sh` (section 8) built each case and printed
each command, its output, and its exit code (section 7). Each case starts
from one setup copy made as `setup-copy.md` says for local work items,
local memory, and no Salesforce, with `core.hooksPath` set to `.githooks`
as `placing-files.md`, section 5, leaves it. So each `git commit` in a
save worktree also ran `.githooks/pre-commit`.

- Verification 2, the blocker. A bare remote, a main checkout, and a
  session worktree on its own branch.
  - Part 1: SRC-001 is filed in a save worktree. The edit of the original
    and of the list, the check before the commit, the commit, and the stop
    in the session worktree all give exit 0. The main checkout is
    fast-forwarded and has SRC-001; the session worktree does not.
  - Part 2: DEC-001 with "Sources: SRC-001". Written in the session
    worktree, as before this pass, it gives the review's finding (exit 2).
    Written in the save worktree, as the steps now say: exit 0 after each
    edit, at stop, before the commit, and at the commit.
  - Part 3: DEC-002. A copy of the session worktree's file stages the
    removal of DEC-001; the new check in "Carrying an edit across" exits 1,
    so no copy is made. Written in the save worktree: exit 0 everywhere,
    and the published `DECISIONS.md` holds DEC-001 and DEC-002.
  - Part 4: DEC-009 in the work item is reported after the edit and at
    stop (exit 2). SRC-044 in an entry written in a save worktree is
    reported after the edit and before the commit (exit 2), and Git stops
    the commit (exit 1).
- Verification 3, should-fix 2. The main checkout has one commit that is
  not pushed. The save is pushed and verified; `git merge --ff-only`
  refuses (exit 128), so the main checkout does not hold DEC-001. The line
  is written under "Waiting on the owner"; the work item holds no DEC-001;
  the check gives exit 0 after the edit of Current State and at stop, in
  the session worktree and in the main checkout. After the owner's merge
  the pointer is written, the line is removed, and the check gives exit 0.
- Verification 5. A fresh project gives no finding at stop, before a
  commit, after an edit of seven files with the input of each product,
  and from a session worktree (exit 0, no output, 18 runs). Its
  `AGENTS.md` is 149 lines and 19,819 bytes. "Toolkit settings" has 10
  lines, no "Memory approval" line, and no prompt.
- Note 4: with no remote and the main checkout on another branch,
  `git push . HEAD:main` moves the default branch and the main checkout's
  `DECISIONS.md` has no entry.
- Note 8: the finding of the session worktree, then the one line (exit
  2); with no finding, the one line (exit 0); readable again, exit 0.
- Note 13 and should-fix 3: `ls` on a missing hooks folder prints an
  error; in a new clone and in a folder with no Git,
  `git config --get core.hooksPath` prints nothing.

## 6. Not done, and not sure

- No live session, no routing test, no scratch Codex install, no Notion,
  GitHub, Hindsight, or org step, nothing on Windows. No agent was run
  through the changed steps: the Git commands were run by a script that
  follows them.
- Should-fix 2: the orchestrator asked for the line to be written through
  `using-memory-store`. The text hands the line to
  `curating-project-memory`, which writes through `using-memory-store`:
  `curating-project-memory` says it decides each line under "Waiting on
  the owner", and `DESIGN-SPEC.md`, section 5, says
  `filing-project-records` never writes memory.
- A meaning change no review asked for: the check before a copy in
  `publish-docs`, "Carrying an edit across". It also covers a session in
  the main checkout whose checkout is behind the default branch.
- `session-handoff.md`: its first line and the root "Which skill" row for
  `handoff` both say to use the skill when the owner ends the session or
  clears context. They are not word for word the same, so the line the
  owner approved was kept. Removing it would leave the two lines the root
  does not have.
- The plugin version is 0.9.0, set by another commit on this branch after
  this pass started. This pass did not change it.
- "Check the setup" reports a missing `core.hooksPath` in a new clone with
  the row of the table that fits. Whether it should also offer to set it
  there was not decided here.

## 7. The output of `run.sh`

```text

### Verification 5: a fresh project built by the setup steps (local work items, local memory, not Salesforce)
$ git -C <fix-3>/case-fresh config --get core.hooksPath
.githooks
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
$ git -C <fix-3>/case-fresh worktree add -q <fix-3>/case-fresh/.claude/worktrees/task -b claude/task
[exit 0]
$ (at stop, session in <fix-3>/case-fresh/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
[exit 0]
$ (after the edit of <fix-3>/case-fresh/.claude/worktrees/task/DECISIONS.md, session in <fix-3>/case-fresh/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ wc -lc <fix-3>/case-fresh/AGENTS.md
     149   19819 <fix-3>/case-fresh/AGENTS.md
[exit 0]
setup-copy.md, "Check the setup copy": the count of the "Toolkit settings" lines, and no prompt left in the section.
$ command grep -c -E "^- (Tracker|Memory|Work item ID prefix|Notion work items|GitHub repository|Notion memory|Hindsight bank|Hindsight server|Hindsight dashboard|Salesforce org aliases):" PROJECT.md
10
$ grep -c "Memory approval" PROJECT.md
0
$ sed -n "/^## Toolkit settings/,\$p" PROJECT.md | grep -c "^- .*<"
0

### The blocker: a bare remote, a main checkout, and a session that works in its own worktree
$ git -C <fix-3>/case-blocker worktree add -q <fix-3>/case-blocker/.claude/worktrees/task -b claude/task
[exit 0]

### The blocker, part 1: file SRC-001 (file-source.md). "Every time": no save worktree is there, so steps 1 to 3 of publish-docs come first.
$ git -C <fix-3>/case-blocker check-ignore .claude/worktrees/docsave-src-001
.claude/worktrees/docsave-src-001
[exit 0]
$ git -C <fix-3>/case-blocker fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-blocker worktree add -q --detach .claude/worktrees/docsave-src-001 origin/main
[exit 0]
file-source.md, step 1: search the list in the save worktree.
$ grep -c SRC- <fix-3>/case-blocker/.claude/worktrees/docsave-src-001/sources/README.md
0
[exit 1]
Steps 4 and 5: the original and its row, written in the save worktree.
$ (after the edit of <fix-3>/case-blocker/.claude/worktrees/docsave-src-001/sources/SRC-001-kickoff-notes.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after the edit of <fix-3>/case-blocker/.claude/worktrees/docsave-src-001/sources/README.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
Step 6: save with publish-docs, from its step 4.
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-src-001 add -- sources/README.md sources/SRC-001-kickoff-notes.md
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-src-001 status --porcelain
M  sources/README.md
A  sources/SRC-001-kickoff-notes.md
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-src-001 -c core.whitespace=-blank-at-eol diff --cached --check
[exit 0]
$ (before a commit, in <fix-3>/case-blocker/.claude/worktrees/docsave-src-001) node .claude/hooks/validate-records.mjs --staged
[exit 0]
(the commit runs .githooks/pre-commit, which runs the same check)
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-src-001 commit -q -m File SRC-001
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-src-001 push -q origin HEAD:main
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-src-001 fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-src-001 branch -r --contains 7c9ff9b7a3fe260223a193770ad6daaf19414c41
  origin/main
[exit 0]
"The main checkout":
$ git -C <fix-3>/case-blocker branch --show-current
main
[exit 0]
$ git -C <fix-3>/case-blocker diff --name-only HEAD origin/main
sources/README.md
sources/SRC-001-kickoff-notes.md
[exit 0]
$ git -C <fix-3>/case-blocker status --porcelain
[exit 0]
$ git -C <fix-3>/case-blocker merge -q --ff-only origin/main
[exit 0]
$ git -C <fix-3>/case-blocker worktree remove .claude/worktrees/docsave-src-001
[exit 0]
Step 7: publish-docs reported that the main checkout holds the save, so the pointer is written.
$ (after the edit of <fix-3>/case-blocker/work-items/WI-001-shared-inbox/WI-001.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (at stop, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
[exit 0]
The main checkout has SRC-001. The session worktree, on its own branch, does not:
$ grep -c SRC-001 <main>/sources/README.md <session>/sources/README.md
<fix-3>/case-blocker/sources/README.md:1
<fix-3>/case-blocker/.claude/worktrees/task/sources/README.md:0

### The blocker, part 2: DEC-001 with "Sources: SRC-001" (record-decision.md)
What the review saw, with the entry written in the session worktree, as the steps were before this pass:
$ (after the edit of <fix-3>/case-blocker/.claude/worktrees/task/DECISIONS.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
The record check found problems: 1. The edit was not undone. Fix each one. Tell the owner of any you cannot fix.
DECISIONS.md:45: SRC-001 is written here, but sources/README.md has no SRC-001. Correct the ID, or file the record first with filing-project-records.
[exit 2]
$ git -C <fix-3>/case-blocker/.claude/worktrees/task restore -- DECISIONS.md
[exit 0]
The steps as now written: the entry is read and written in the save worktree.
$ git -C <fix-3>/case-blocker check-ignore .claude/worktrees/docsave-dec-001
.claude/worktrees/docsave-dec-001
[exit 0]
$ git -C <fix-3>/case-blocker fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-blocker worktree add -q --detach .claude/worktrees/docsave-dec-001 origin/main
[exit 0]
record-decision.md, step 1: search DECISIONS.md in the save worktree. Step 4: the entry, and the "Used by" cell of SRC-001.
$ (after the edit of <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001/DECISIONS.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after the edit of <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001/sources/README.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (at stop, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
[exit 0]
Step 6: one save.
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001 add -- DECISIONS.md sources/README.md
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001 status --porcelain
M  DECISIONS.md
M  sources/README.md
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001 -c core.whitespace=-blank-at-eol diff --cached --check
[exit 0]
$ (before a commit, in <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001) node .claude/hooks/validate-records.mjs --staged
[exit 0]
(the commit runs .githooks/pre-commit, which runs the same check)
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001 commit -q -m Record DEC-001
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001 push -q origin HEAD:main
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001 fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-001 branch -r --contains 46c28a3e5fdbcfa135e1060b40a071e2cfdff999
  origin/main
[exit 0]
"The main checkout":
$ git -C <fix-3>/case-blocker branch --show-current
main
[exit 0]
$ git -C <fix-3>/case-blocker diff --name-only HEAD origin/main
DECISIONS.md
sources/README.md
[exit 0]
$ git -C <fix-3>/case-blocker status --porcelain
[exit 0]
$ git -C <fix-3>/case-blocker merge -q --ff-only origin/main
[exit 0]
$ git -C <fix-3>/case-blocker worktree remove .claude/worktrees/docsave-dec-001
[exit 0]
Step 7: the pointer on the Related items line.
$ (after the edit of <fix-3>/case-blocker/work-items/WI-001-shared-inbox/WI-001.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (at stop, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
[exit 0]

### The blocker, part 3: a second decision, DEC-002
What the review saw: the entry written in the session worktree, whose DECISIONS.md has no DEC-001, then copied across.
$ git -C <fix-3>/case-blocker check-ignore .claude/worktrees/docsave-old-way
.claude/worktrees/docsave-old-way
[exit 0]
$ git -C <fix-3>/case-blocker fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-blocker worktree add -q --detach .claude/worktrees/docsave-old-way origin/main
[exit 0]
$ git -C <save> diff --cached -- DECISIONS.md | grep "^[-+]## DEC"
-## DEC-001: Every channel feeds one inbox
+## DEC-002: A request is closed only by a person
The copy stages the removal of DEC-001. publish-docs, "Carrying an edit across", now checks the file before a copy:
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-old-way rev-parse --short HEAD
46c28a3
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/task diff --quiet HEAD 46c28a3 -- DECISIONS.md
[exit 1]
Exit code 1: the two versions differ, so the file is never copied. (This throwaway save worktree and the session copy are removed.)
The steps as now written:
$ git -C <fix-3>/case-blocker check-ignore .claude/worktrees/docsave-dec-002
.claude/worktrees/docsave-dec-002
[exit 0]
$ git -C <fix-3>/case-blocker fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-blocker worktree add -q --detach .claude/worktrees/docsave-dec-002 origin/main
[exit 0]
$ grep -E "^## DEC-[0-9]+: [^<]" <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002/DECISIONS.md
## DEC-001: Every channel feeds one inbox
[exit 0]
$ (after the edit of <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002/DECISIONS.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002 add -- DECISIONS.md
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002 status --porcelain
M  DECISIONS.md
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002 -c core.whitespace=-blank-at-eol diff --cached --check
[exit 0]
$ (before a commit, in <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002) node .claude/hooks/validate-records.mjs --staged
[exit 0]
(the commit runs .githooks/pre-commit, which runs the same check)
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002 commit -q -m Record DEC-002
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002 push -q origin HEAD:main
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002 fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-002 branch -r --contains 7f65f7a6ab35d607ed92c3652647a129f0475efb
  origin/main
[exit 0]
"The main checkout":
$ git -C <fix-3>/case-blocker branch --show-current
main
[exit 0]
$ git -C <fix-3>/case-blocker diff --name-only HEAD origin/main
DECISIONS.md
[exit 0]
$ git -C <fix-3>/case-blocker status --porcelain
[exit 0]
$ git -C <fix-3>/case-blocker merge -q --ff-only origin/main
[exit 0]
$ git -C <fix-3>/case-blocker worktree remove .claude/worktrees/docsave-dec-002
[exit 0]
$ (after the edit of <fix-3>/case-blocker/work-items/WI-001-shared-inbox/WI-001.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (at stop, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
[exit 0]
$ (at stop, session in <fix-3>/case-blocker) node .claude/hooks/validate-records.mjs --all
[exit 0]
The published DECISIONS.md holds both decisions:
$ git -C <main> show origin/main:DECISIONS.md | grep -E "^## DEC-[0-9]+: [^<]"
## DEC-001: Every channel feeds one inbox
## DEC-002: A request is closed only by a person
$ git -C <fix-3>/case-blocker log --oneline origin/main
7f65f7a Record DEC-002
46c28a3 Record DEC-001
7c9ff9b File SRC-001
09b73a8 Set up Toolkit V2
[exit 0]

### The blocker, part 4: an ID that no record defines is still reported
$ (after the edit of <fix-3>/case-blocker/work-items/WI-001-shared-inbox/WI-001.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
The record check found problems: 1. The edit was not undone. Fix each one. Tell the owner of any you cannot fix.
work-items/WI-001-shared-inbox/WI-001.md:11: DEC-009 is written here, but DECISIONS.md has no DEC-009. Correct the ID, or file the record first with filing-project-records.
[exit 2]
$ (at stop, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
The record check found problems: 1. Fix each one. Tell the owner of any you cannot fix.
work-items/WI-001-shared-inbox/WI-001.md:11: DEC-009 is written here, but DECISIONS.md has no DEC-009. Correct the ID, or file the record first with filing-project-records.
[exit 2]
$ git -C <fix-3>/case-blocker check-ignore .claude/worktrees/docsave-dec-003
.claude/worktrees/docsave-dec-003
[exit 0]
$ git -C <fix-3>/case-blocker fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-blocker worktree add -q --detach .claude/worktrees/docsave-dec-003 origin/main
[exit 0]
$ (after the edit of <fix-3>/case-blocker/.claude/worktrees/docsave-dec-003/DECISIONS.md, session in <fix-3>/case-blocker/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
The record check found problems: 1. The edit was not undone. Fix each one. Tell the owner of any you cannot fix.
DECISIONS.md:67: SRC-044 is written here, but sources/README.md has no SRC-044. Correct the ID, or file the record first with filing-project-records.
[exit 2]
$ (before a commit, in <fix-3>/case-blocker/.claude/worktrees/docsave-dec-003) node .claude/hooks/validate-records.mjs --staged
The record check found problems: 1. The commit was stopped. Fix each one. Tell the owner of any you cannot fix.
DECISIONS.md:67: SRC-044 is written here, but sources/README.md has no SRC-044. Correct the ID, or file the record first with filing-project-records.
[exit 2]
$ git -C <fix-3>/case-blocker/.claude/worktrees/docsave-dec-003 commit -q -m Record DEC-003
The record check found problems: 1. The commit was stopped. Fix each one. Tell the owner of any you cannot fix.
DECISIONS.md:67: SRC-044 is written here, but sources/README.md has no SRC-044. Correct the ID, or file the record first with filing-project-records.
[exit 1]
(Git ran .githooks/pre-commit in the save worktree, and the commit was stopped.)

### Should-fix 2: the main checkout has one commit that is not pushed, so publish-docs cannot update it
$ git -C <fix-3>/case-owed log --oneline origin/main..main
0f047ce The owner: a README line
[exit 0]
$ git -C <fix-3>/case-owed check-ignore .claude/worktrees/docsave-dec-001
.claude/worktrees/docsave-dec-001
[exit 0]
$ git -C <fix-3>/case-owed fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-owed worktree add -q --detach .claude/worktrees/docsave-dec-001 origin/main
[exit 0]
$ (after the edit of <fix-3>/case-owed/.claude/worktrees/docsave-dec-001/DECISIONS.md, session in <fix-3>/case-owed/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ git -C <fix-3>/case-owed/.claude/worktrees/docsave-dec-001 add -- DECISIONS.md
[exit 0]
$ git -C <fix-3>/case-owed/.claude/worktrees/docsave-dec-001 status --porcelain
M  DECISIONS.md
[exit 0]
$ git -C <fix-3>/case-owed/.claude/worktrees/docsave-dec-001 -c core.whitespace=-blank-at-eol diff --cached --check
[exit 0]
$ (before a commit, in <fix-3>/case-owed/.claude/worktrees/docsave-dec-001) node .claude/hooks/validate-records.mjs --staged
[exit 0]
(the commit runs .githooks/pre-commit, which runs the same check)
$ git -C <fix-3>/case-owed/.claude/worktrees/docsave-dec-001 commit -q -m Record DEC-001
[exit 0]
$ git -C <fix-3>/case-owed/.claude/worktrees/docsave-dec-001 push -q origin HEAD:main
[exit 0]
$ git -C <fix-3>/case-owed/.claude/worktrees/docsave-dec-001 fetch -q origin main
[exit 0]
$ git -C <fix-3>/case-owed/.claude/worktrees/docsave-dec-001 branch -r --contains 136ed973ca73f198b539c10e47e5b21bbf7dd877
  origin/main
[exit 0]
"The main checkout":
$ git -C <fix-3>/case-owed branch --show-current
main
[exit 0]
$ git -C <fix-3>/case-owed diff --name-only HEAD origin/main
DECISIONS.md
README.md
[exit 0]
$ git -C <fix-3>/case-owed status --porcelain
[exit 0]
$ git -C <fix-3>/case-owed merge -q --ff-only origin/main
hint: Diverging branches can't be fast-forwarded, you need to either:
hint:
hint: 	git merge --no-ff
hint:
hint: or:
hint:
hint: 	git rebase
hint:
hint: Disable this message with "git config set advice.diverging false"
fatal: Not possible to fast-forward, aborting.
[exit 128]
$ git -C <fix-3>/case-owed worktree remove .claude/worktrees/docsave-dec-001
[exit 0]
Git refused the fast-forward, so publish-docs reports: "The main checkout does not hold this save yet: Git says a fast-forward is not possible (the main checkout has a commit that is not pushed)."
$ grep -E "^## DEC-[0-9]+: [^<]" <fix-3>/case-owed/DECISIONS.md
[exit 1]
filing-project-records, "Every time": no pointer is written. One line goes to Current State, under "Waiting on the owner" (curating-project-memory decides the line, using-memory-store writes it):
$ sed -n /## Waiting on the owner/,/## Next/p <fix-3>/case-owed/memory/CURRENT_STATE.md
## Waiting on the owner

- DEC-001 is saved on the default branch, but the main checkout does not hold it: the main checkout has a commit that is not pushed, so Git refused the fast-forward. WI-001 needs its pointer. Check again after the owner pushes or merges.

## Next session starts with
[exit 0]
$ (after the edit of <fix-3>/case-owed/memory/CURRENT_STATE.md, session in <fix-3>/case-owed/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (at stop, session in <fix-3>/case-owed/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
[exit 0]
$ (at stop, session in <fix-3>/case-owed) node .claude/hooks/validate-records.mjs --all
[exit 0]
$ grep -c DEC-001 <fix-3>/case-owed/work-items/WI-001-shared-inbox/WI-001.md
0
[exit 1]
Later: the owner brings the main checkout up to date (pull-latest merges), so its files hold the record. The pointer is written and the line is removed.
$ git -C <fix-3>/case-owed merge -q --no-edit origin/main
[exit 0]
$ grep -E "^## DEC-[0-9]+: [^<]" <fix-3>/case-owed/DECISIONS.md
## DEC-001: Every channel feeds one inbox
[exit 0]
$ (after the edit of <fix-3>/case-owed/work-items/WI-001-shared-inbox/WI-001.md, session in <fix-3>/case-owed/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (after the edit of <fix-3>/case-owed/memory/CURRENT_STATE.md, session in <fix-3>/case-owed/.claude/worktrees/task) node .claude/hooks/validate-records.mjs 
[exit 0]
$ (at stop, session in <fix-3>/case-owed/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
[exit 0]

### Note 4: no remote, and the main checkout is on another branch
$ git -C <fix-3>/case-n4 worktree add -q --detach .claude/worktrees/docsave-dec-001 main
[exit 0]
Step 7, "No remote": no checkout has the default branch.
$ git -C <fix-3>/case-n4/.claude/worktrees/docsave-dec-001 push -q . HEAD:main
[exit 0]
$ git -C <fix-3>/case-n4 branch --contains 8a45649
  main
[exit 0]
$ git -C <fix-3>/case-n4 branch --show-current
other
[exit 0]
$ grep -E "^## DEC-[0-9]+: [^<]" <fix-3>/case-n4/DECISIONS.md
[exit 1]
The main checkout is on another branch and does not hold the save, as "The main checkout" now says.

### Note 8: in a worktree session, a record of the main checkout cannot be read
$ (at stop, session in <fix-3>/case-n8/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
The record check found problems: 1. Fix each one. Tell the owner of any you cannot fix.
system/glossary.md:5: Status is "Approved", but the document holds no rule and no term. Set Status to Not started.
The record check did not run in the main checkout. Its own error: Error: EACCES: permission denied, open '<fix-3>/case-n8/DECISIONS.md'
[exit 2]
$ (at stop, session in <fix-3>/case-n8/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
The record check did not run in the main checkout. Its own error: Error: EACCES: permission denied, open '<fix-3>/case-n8/DECISIONS.md'
[exit 0]
$ (at stop, session in <fix-3>/case-n8/.claude/worktrees/task) node .claude/hooks/validate-records.mjs --all
[exit 0]

### Note 13 and should-fix 3: what the two commands of placing-files.md, section 5, step 2, print
A repository with no hooks folder:
$ git -C <fix-3>/case-n13 config --get core.hooksPath
[exit 1]
$ ls "$(git rev-parse --git-path hooks)"
ls: .git/hooks: No such file or directory
[exit 1]
A new clone of a project that was set up (the setting is not in a file Git tracks):
$ git -C <fix-3>/case-clone config --get core.hooksPath
[exit 1]
$ ls "$(git rev-parse --git-path hooks)" | grep -vc "\.sample$"
0
A folder with no Git:
$ git -C <fix-3>/case-nogit config --get core.hooksPath
[exit 1]
$ git -C <fix-3>/case-nogit rev-parse --git-path hooks
fatal: not a git repository (or any of the parent directories): .git
[exit 128]
```

## 8. `run.sh`

```bash
#!/bin/bash
# The reproductions for dev/test-runs/fix-pass-3.md. Everything is made under this folder.
# Usage: bash run.sh <worktree root>
set -u
ROOT="$1"
HERE="$(cd "$(dirname "$0")" && pwd -P)"
ASSETS="$ROOT/plugins/toolkit/skills/project-setup/assets"
VR=.claude/hooks/validate-records.mjs
W=work-items/WI-001-shared-inbox/WI-001.md
export HOME="$HERE/home" GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME=Test GIT_AUTHOR_EMAIL=test@example.com GIT_COMMITTER_NAME=Test GIT_COMMITTER_EMAIL=test@example.com
# Start again from nothing: only the folders this script makes, inside its own folder.
for old in home copy empty-template; do rm -rf "${HERE:?}/$old"; done
for old in "${HERE:?}"/case-*; do [ -e "$old" ] && chmod -R u+rw "$old" && rm -rf "${old:?}"; done
mkdir -p "$HERE/home" "$HERE/empty-template"

say() { printf '\n### %s\n' "$*"; }
note() { printf '%s\n' "$*"; }
# Paths are shortened in what is printed.
short() { sed -e "s|$HERE|<fix-3>|g" -e "s|$ROOT|<worktree>|g"; }
# Runs a command, prints it, its output, and its exit code.
show() { printf '$ %s\n' "$*" | short; "$@" 2>&1 | short; printf '[exit %s]\n' "${PIPESTATUS[0]}"; }
check() { # check <label> <folder the session is in> <stdin text> [args...]
  local label="$1" dir="$2" input="$3"; shift 3
  printf '$ (%s) node %s %s\n' "$label" "$VR" "$*" | short
  printf '%s' "$input" | (cd "$dir" && node "$VR" "$@") 2>&1 | short; printf '[exit %s]\n' "${PIPESTATUS[1]}"
}
edit_json() { node -e 'process.stdout.write(JSON.stringify({ cwd: process.argv[1], hook_event_name: "PostToolUse", tool_name: "Edit", tool_input: { file_path: process.argv[2] } }))' "$1" "$2"; }
patch_json() { node -e 'process.stdout.write(JSON.stringify({ cwd: process.argv[1], hook_event_name: "PostToolUse", tool_name: "apply_patch", tool_input: { command: "*** Begin Patch\n*** Update File: " + process.argv[2] + "\n@@\n-a\n+b\n*** End Patch\n" } }))' "$1" "$2"; }
stop_json() { printf '{"cwd":"%s","hook_event_name":"Stop","stop_hook_active":false}' "$1"; }
after_edit() { check "after the edit of $2, session in $1" "$1" "$(edit_json "$1" "$2")"; } # after_edit <session folder> <file>
at_stop() { check "at stop, session in $1" "$1" "$(stop_json "$1")" --all; }
staged() { check "before a commit, in $1" "$1" '' --staged; }
# The entries of a DECISIONS.md. The form in the comment at its top, "## DEC-001: <short title>", is not one.
entries() { printf '$ grep -E "^## DEC-[0-9]+: [^<]" %s\n' "$1" | short; grep -E '^## DEC-[0-9]+: [^<]' "$1"; printf '[exit %s]\n' "$?"; }
# replace <file> <python regex> <text>: one replacement, and it must match.
replace() { python3 -c '
import re, sys
path, old, new = sys.argv[1:4]
text = open(path).read()
out, n = re.subn(old, lambda m: new, text, count=1, flags=re.M)
assert n == 1, (path, old)
open(path, "w").write(out)
' "$@"; }

# ------------------------------------------------------------------ the setup copy
# setup-copy.md: every-project, then the folders for local work items and local memory.
COPY="$HERE/copy"
mkdir -p "$COPY"
cp -R "$ASSETS/every-project/." "$COPY/"
cp -R "$ASSETS/work-local/." "$COPY/"
cp -R "$ASSETS/memory-process/." "$COPY/"
cp -R "$ASSETS/memory-local/." "$COPY/"
cp "$ASSETS/owner-preferences.md" "$COPY/.claude/rules/owner-preferences.md"
rm -rf "${COPY:?}/.agents"
node - "$COPY" <<'JS'
const fs = require('fs'), path = require('path');
const copy = process.argv[2];
const change = (file, edits) => { let s = fs.readFileSync(path.join(copy, file), 'utf8'); for (const [from, to] of edits) { if (!s.match(from) && !s.includes(from)) throw new Error(`${file}: ${from}`); s = s.replace(from, to); } fs.writeFileSync(path.join(copy, file), s); };
for (const file of ['AGENTS.md', 'README.md', 'PROJECT.md']) change(file, [[/^(#{1,6} .*)<Project name>/m, '$1HarborDesk']]);
change('PROJECT.md', [['`<local, notion, or github>`', '`local`'], ['`<local, notion, or hindsight>`', '`local`'], ['`<WI>`', '`WI`'],
  [/^- Notion work items: `<.*>`$/m, '- Notion work items: `not used`'], ['`<owner/name>`', '`not used`'], [/^- Notion memory: `<.*>`$/m, '- Notion memory: `not used`'],
  [/^- Hindsight bank: `<.*>`$/m, '- Hindsight bank: `not used`'], [/^- Hindsight server: `<.*>`$/m, '- Hindsight server: `not used`'], [/^- Hindsight dashboard: `<.*>`$/m, '- Hindsight dashboard: `not used`'],
  [/^- Salesforce org aliases: `<.*>`$/m, '- Salesforce org aliases: `not used`']]);
// finishing.md: the outcome sentence, the "Build, test, or deploy" row, the fill-in guide comment, and Current State.
change('AGENTS.md', [[/<!-- Project setup fill-in guide:[^\n]*-->\n\n/, ''],
  ['<One sentence describing this project and its outcome.>', 'HarborDesk is a help desk web app that lets a small support team answer every customer request from one shared inbox, so no request is lost between email, chat, and the web form.'],
  ['`<Verified project commands and target environment; do not infer from this template.>`', 'Build: `npm run build`. Test: `npm test` (unit tests) and `npm run test:e2e` (browser tests against the local server). Deploy: `npm run deploy:staging`, then `npm run deploy:production` after the owner\'s yes; both go to the Render project "harbordesk".']]);
fs.writeFileSync(path.join(copy, 'memory/CURRENT_STATE.md'), '# Current state\n\nLast updated: `2026-10-05, setup, agent`\n\n## Now\n\n- None.\n\n## Waiting on the owner\n\n- None.\n\n## Next session starts with\n\n- Ask the owner for the first thing to build.\n');
JS

# A project straight from that copy, as placing-files.md leaves it, with core.hooksPath set (its section 5).
project() { # project <folder>
  mkdir -p "$1" && cp -R "$COPY/." "$1/" && (cd "$1" && mkdir -p .agents && ln -s ../.claude/skills .agents/skills
    chmod +x .githooks/pre-commit && git init -q -b main && git config core.hooksPath .githooks && git add . && git commit -q -m 'Set up Toolkit V2')
}
entry() { # entry <DEC ID> <title> <sources>
  printf '## %s: %s\n\n- Status: Decided\n- Raised: 2026-10-01, the owner\n- Decided: 2026-10-02, the owner\n- Decision: %s.\n- Why: The owner asked for it.\n- Affects: WI-001\n- Replaces or replaced by: none\n- Sources: %s\n' "$1" "$2" "$2" "$3"; }
item() { # item <main checkout> <Related items text> <Sources line>
  mkdir -p "$1/$(dirname "$W")" && printf -- '---\nid: WI-001\ntitle: Shared inbox\nstate: Building\nstatus: In progress\nparent: none\n---\n\n# WI-001: Shared inbox\n\n**Related items:** %s\n\n**Moved up:**\n\n## Notes\n\n### Sources\n\n%s\n' "$2" "$3" > "$1/$W"; }
with_remote() { git init -q --bare -b main "$1.git" && git -C "$1" remote add origin "$1.git" && git -C "$1" push -q -u origin main; }
# publish-docs, steps 2 and 3: the save worktree, made from the default branch.
start_save() { # start_save <main> <slug>
  show git -C "$1" check-ignore ".claude/worktrees/docsave-$2"
  show git -C "$1" fetch -q origin main
  show git -C "$1" worktree add -q --detach ".claude/worktrees/docsave-$2" origin/main
}
# publish-docs, steps 4 to 8, with "The main checkout".
finish_save() { # finish_save <main> <slug> <message> <file>...
  local main="$1" slug="$2" save="$1/.claude/worktrees/docsave-$2" message="$3"; shift 3
  show git -C "$save" add -- "$@"
  show git -C "$save" status --porcelain
  show git -C "$save" -c core.whitespace=-blank-at-eol diff --cached --check
  staged "$save"
  note '(the commit runs .githooks/pre-commit, which runs the same check)'
  show git -C "$save" commit -q -m "$message"
  show git -C "$save" push -q origin HEAD:main
  local commit; commit="$(git -C "$save" rev-parse HEAD)"
  show git -C "$save" fetch -q origin main
  show git -C "$save" branch -r --contains "$commit"
  note '"The main checkout":'
  show git -C "$main" branch --show-current
  show git -C "$main" diff --name-only HEAD origin/main
  show git -C "$main" status --porcelain
  show git -C "$main" merge -q --ff-only origin/main
  show git -C "$main" worktree remove ".claude/worktrees/docsave-$slug"
}

# ------------------------------------------------------------------ verification 5
say 'Verification 5: a fresh project built by the setup steps (local work items, local memory, not Salesforce)'
P="$HERE/case-fresh"; project "$P"
show git -C "$P" config --get core.hooksPath
check 'at stop' "$P" '{"hook_event_name":"Stop","stop_hook_active":false}' --all
check 'before a commit' "$P" '' --staged
for f in DECISIONS.md system/glossary.md sources/README.md AGENTS.md work-items/PROJECT-TASKS.md memory/CURRENT_STATE.md memory/MEMORY.md; do
  check "after a Claude Code edit of $f" "$P" "$(edit_json "$P" "$P/$f")"
  check "after a Codex patch of $f" "$P" "$(patch_json "$P" "$f")"
done
show git -C "$P" worktree add -q "$P/.claude/worktrees/task" -b claude/task
at_stop "$P/.claude/worktrees/task"
after_edit "$P/.claude/worktrees/task" "$P/.claude/worktrees/task/DECISIONS.md"
show wc -lc "$P/AGENTS.md"
note 'setup-copy.md, "Check the setup copy": the count of the "Toolkit settings" lines, and no prompt left in the section.'
printf '$ command grep -c -E "^- (Tracker|Memory|Work item ID prefix|Notion work items|GitHub repository|Notion memory|Hindsight bank|Hindsight server|Hindsight dashboard|Salesforce org aliases):" PROJECT.md\n'; command grep -c -E '^- (Tracker|Memory|Work item ID prefix|Notion work items|GitHub repository|Notion memory|Hindsight bank|Hindsight server|Hindsight dashboard|Salesforce org aliases):' "$P/PROJECT.md"
printf '$ grep -c "Memory approval" PROJECT.md\n'; grep -c 'Memory approval' "$P/PROJECT.md"
printf '$ sed -n "/^## Toolkit settings/,\$p" PROJECT.md | grep -c "^- .*<"\n'; sed -n '/^## Toolkit settings/,$p' "$P/PROJECT.md" | grep -c '^- .*<'

# ------------------------------------------------------------------ the blocker
say 'The blocker: a bare remote, a main checkout, and a session that works in its own worktree'
P="$HERE/case-blocker"; project "$P"; item "$P" 'No project phase yet.' 'None yet.'; with_remote "$P"
SESSION="$P/.claude/worktrees/task"
show git -C "$P" worktree add -q "$SESSION" -b claude/task

say 'The blocker, part 1: file SRC-001 (file-source.md). "Every time": no save worktree is there, so steps 1 to 3 of publish-docs come first.'
start_save "$P" src-001; SAVE="$P/.claude/worktrees/docsave-src-001"
note 'file-source.md, step 1: search the list in the save worktree.'
show grep -c 'SRC-' "$SAVE/sources/README.md"
note 'Steps 4 and 5: the original and its row, written in the save worktree.'
printf 'Kickoff call, 2026-10-01. The client wants every channel in one inbox.\n' > "$SAVE/sources/SRC-001-kickoff-notes.md"
after_edit "$SESSION" "$SAVE/sources/SRC-001-kickoff-notes.md"
replace "$SAVE/sources/README.md" '^No sources yet.*\n' '| SRC-001 | 2026-10-01 | The client | Notes of the kickoff call | [SRC-001-kickoff-notes.md](SRC-001-kickoff-notes.md) | WI-001 |
'
after_edit "$SESSION" "$SAVE/sources/README.md"
note 'Step 6: save with publish-docs, from its step 4.'
finish_save "$P" src-001 'File SRC-001' sources/README.md sources/SRC-001-kickoff-notes.md
note 'Step 7: publish-docs reported that the main checkout holds the save, so the pointer is written.'
item "$P" 'No project phase yet.' '- SRC-001: notes of the kickoff call.'
after_edit "$SESSION" "$P/$W"
at_stop "$SESSION"
note 'The main checkout has SRC-001. The session worktree, on its own branch, does not:'
printf '$ grep -c SRC-001 <main>/sources/README.md <session>/sources/README.md\n'; grep -c 'SRC-001' "$P/sources/README.md" "$SESSION/sources/README.md" | short

say 'The blocker, part 2: DEC-001 with "Sources: SRC-001" (record-decision.md)'
note 'What the review saw, with the entry written in the session worktree, as the steps were before this pass:'
entry DEC-001 'Every channel feeds one inbox' SRC-001 > "$HERE/case-blocker-dec-001.txt"
replace "$SESSION/DECISIONS.md" '^No entries yet.*\n' "$(cat "$HERE/case-blocker-dec-001.txt")
"
after_edit "$SESSION" "$SESSION/DECISIONS.md"
show git -C "$SESSION" restore -- DECISIONS.md
note 'The steps as now written: the entry is read and written in the save worktree.'
start_save "$P" dec-001; SAVE="$P/.claude/worktrees/docsave-dec-001"
note 'record-decision.md, step 1: search DECISIONS.md in the save worktree. Step 4: the entry, and the "Used by" cell of SRC-001.'
replace "$SAVE/DECISIONS.md" '^No entries yet.*\n' "$(cat "$HERE/case-blocker-dec-001.txt")
"
after_edit "$SESSION" "$SAVE/DECISIONS.md"
replace "$SAVE/sources/README.md" '\| WI-001 \|$' '| WI-001, DEC-001 |'
after_edit "$SESSION" "$SAVE/sources/README.md"
at_stop "$SESSION"
note 'Step 6: one save.'
finish_save "$P" dec-001 'Record DEC-001' DECISIONS.md sources/README.md
note 'Step 7: the pointer on the Related items line.'
item "$P" 'No project phase yet. DEC-001' '- SRC-001: notes of the kickoff call.'
after_edit "$SESSION" "$P/$W"
at_stop "$SESSION"

say 'The blocker, part 3: a second decision, DEC-002'
note 'What the review saw: the entry written in the session worktree, whose DECISIONS.md has no DEC-001, then copied across.'
entry DEC-002 'A request is closed only by a person' none > "$HERE/case-blocker-dec-002.txt"
replace "$SESSION/DECISIONS.md" '^No entries yet.*\n' "$(cat "$HERE/case-blocker-dec-002.txt")
"
start_save "$P" old-way; SAVE="$P/.claude/worktrees/docsave-old-way"
cp "$SESSION/DECISIONS.md" "$SAVE/DECISIONS.md"; git -C "$SAVE" add -- DECISIONS.md
printf '$ git -C <save> diff --cached -- DECISIONS.md | grep "^[-+]## DEC"\n'; git -C "$SAVE" diff --cached -- DECISIONS.md | grep '^[-+]## DEC'
note 'The copy stages the removal of DEC-001. publish-docs, "Carrying an edit across", now checks the file before a copy:'
show git -C "$SAVE" rev-parse --short HEAD
show git -C "$SESSION" diff --quiet HEAD "$(git -C "$SAVE" rev-parse --short HEAD)" -- DECISIONS.md
note 'Exit code 1: the two versions differ, so the file is never copied. (This throwaway save worktree and the session copy are removed.)'
git -C "$P" worktree remove --force .claude/worktrees/docsave-old-way; git -C "$SESSION" restore -- DECISIONS.md
note 'The steps as now written:'
start_save "$P" dec-002; SAVE="$P/.claude/worktrees/docsave-dec-002"
entries "$SAVE/DECISIONS.md"
printf '\n' >> "$SAVE/DECISIONS.md"; cat "$HERE/case-blocker-dec-002.txt" >> "$SAVE/DECISIONS.md"
after_edit "$SESSION" "$SAVE/DECISIONS.md"
finish_save "$P" dec-002 'Record DEC-002' DECISIONS.md
item "$P" 'No project phase yet. DEC-001, DEC-002' '- SRC-001: notes of the kickoff call.'
after_edit "$SESSION" "$P/$W"
at_stop "$SESSION"
at_stop "$P"
note 'The published DECISIONS.md holds both decisions:'
printf '$ git -C <main> show origin/main:DECISIONS.md | grep -E "^## DEC-[0-9]+: [^<]"\n'; git -C "$P" show origin/main:DECISIONS.md | grep -E '^## DEC-[0-9]+: [^<]'
show git -C "$P" log --oneline origin/main

say 'The blocker, part 4: an ID that no record defines is still reported'
item "$P" 'No project phase yet. DEC-001, DEC-002, DEC-009' '- SRC-001: notes of the kickoff call.'
after_edit "$SESSION" "$P/$W"
at_stop "$SESSION"
item "$P" 'No project phase yet. DEC-001, DEC-002' '- SRC-001: notes of the kickoff call.'
start_save "$P" dec-003; SAVE="$P/.claude/worktrees/docsave-dec-003"
printf '\n' >> "$SAVE/DECISIONS.md"; entry DEC-003 'Chat requests get a first answer in one hour' SRC-044 >> "$SAVE/DECISIONS.md"
after_edit "$SESSION" "$SAVE/DECISIONS.md"
git -C "$SAVE" add -- DECISIONS.md
staged "$SAVE"
show git -C "$SAVE" commit -q -m 'Record DEC-003'
note '(Git ran .githooks/pre-commit in the save worktree, and the commit was stopped.)'
git -C "$P" worktree remove --force .claude/worktrees/docsave-dec-003

# ------------------------------------------------------------------ should-fix 2
say 'Should-fix 2: the main checkout has one commit that is not pushed, so publish-docs cannot update it'
P="$HERE/case-owed"; project "$P"; item "$P" 'No project phase yet.' 'None yet.'; with_remote "$P"
SESSION="$P/.claude/worktrees/task"; git -C "$P" worktree add -q "$SESSION" -b claude/task
printf '\nA line the owner added.\n' >> "$P/README.md"; git -C "$P" add -- README.md; git -C "$P" commit -q -m 'The owner: a README line'
show git -C "$P" log --oneline origin/main..main
start_save "$P" dec-001; SAVE="$P/.claude/worktrees/docsave-dec-001"
entry DEC-001 'Every channel feeds one inbox' none > "$HERE/case-owed-dec-001.txt"
replace "$SAVE/DECISIONS.md" '^No entries yet.*\n' "$(cat "$HERE/case-owed-dec-001.txt")
"
after_edit "$SESSION" "$SAVE/DECISIONS.md"
finish_save "$P" dec-001 'Record DEC-001' DECISIONS.md
note 'Git refused the fast-forward, so publish-docs reports: "The main checkout does not hold this save yet: Git says a fast-forward is not possible (the main checkout has a commit that is not pushed)."'
entries "$P/DECISIONS.md"
note 'filing-project-records, "Every time": no pointer is written. One line goes to Current State, under "Waiting on the owner" (curating-project-memory decides the line, using-memory-store writes it):'
replace "$P/memory/CURRENT_STATE.md" '## Waiting on the owner\n\n- None\.\n' '## Waiting on the owner

- DEC-001 is saved on the default branch, but the main checkout does not hold it: the main checkout has a commit that is not pushed, so Git refused the fast-forward. WI-001 needs its pointer. Check again after the owner pushes or merges.
'
replace "$P/memory/CURRENT_STATE.md" '^Last updated: .*$' 'Last updated: `2026-10-05, a pointer that is owed, agent`'
show sed -n '/## Waiting on the owner/,/## Next/p' "$P/memory/CURRENT_STATE.md"
after_edit "$SESSION" "$P/memory/CURRENT_STATE.md"
at_stop "$SESSION"
at_stop "$P"
show grep -c 'DEC-001' "$P/$W"
note 'Later: the owner brings the main checkout up to date (pull-latest merges), so its files hold the record. The pointer is written and the line is removed.'
show git -C "$P" merge -q --no-edit origin/main
entries "$P/DECISIONS.md"
item "$P" 'No project phase yet. DEC-001' 'None yet.'
replace "$P/memory/CURRENT_STATE.md" '## Waiting on the owner\n\n- DEC-001[^\n]*\n' '## Waiting on the owner

- None.
'
after_edit "$SESSION" "$P/$W"
after_edit "$SESSION" "$P/memory/CURRENT_STATE.md"
at_stop "$SESSION"

# ------------------------------------------------------------------ notes
say 'Note 4: no remote, and the main checkout is on another branch'
P="$HERE/case-n4"; project "$P"; git -C "$P" switch -q -c other
show git -C "$P" worktree add -q --detach .claude/worktrees/docsave-dec-001 main
SAVE="$P/.claude/worktrees/docsave-dec-001"
replace "$SAVE/DECISIONS.md" '^No entries yet.*\n' "$(entry DEC-001 'Every channel feeds one inbox' none | sed 's/Affects: WI-001/Affects: none yet/')
"
git -C "$SAVE" add -- DECISIONS.md; git -C "$SAVE" commit -q -m 'Record DEC-001'
note 'Step 7, "No remote": no checkout has the default branch.'
show git -C "$SAVE" push -q . HEAD:main
show git -C "$P" branch --contains "$(git -C "$SAVE" rev-parse --short HEAD)"
show git -C "$P" branch --show-current
entries "$P/DECISIONS.md"
note 'The main checkout is on another branch and does not hold the save, as "The main checkout" now says.'

say 'Note 8: in a worktree session, a record of the main checkout cannot be read'
P="$HERE/case-n8"; project "$P"; item "$P" 'No project phase yet.' 'None yet.'
SESSION="$P/.claude/worktrees/task"; git -C "$P" worktree add -q "$SESSION" -b claude/task
replace "$SESSION/system/glossary.md" '^- Status: Not started' '- Status: Approved'
chmod 000 "$P/DECISIONS.md"
at_stop "$SESSION"
replace "$SESSION/system/glossary.md" '^- Status: Approved' '- Status: Not started'
at_stop "$SESSION"
chmod 644 "$P/DECISIONS.md"
at_stop "$SESSION"

say 'Note 13 and should-fix 3: what the two commands of placing-files.md, section 5, step 2, print'
P="$HERE/case-n13"; mkdir -p "$P"; git -C "$P" init -q -b main --template="$HERE/empty-template"
note 'A repository with no hooks folder:'
show git -C "$P" config --get core.hooksPath
printf '$ ls "$(git rev-parse --git-path hooks)"\n'; (cd "$P" && ls "$(git rev-parse --git-path hooks)") 2>&1; printf '[exit %s]\n' "$?"
note 'A new clone of a project that was set up (the setting is not in a file Git tracks):'
git clone -q "$HERE/case-blocker.git" "$HERE/case-clone"
show git -C "$HERE/case-clone" config --get core.hooksPath
printf '$ ls "$(git rev-parse --git-path hooks)" | grep -vc "\\.sample$"\n'; (cd "$HERE/case-clone" && ls "$(git rev-parse --git-path hooks)" | grep -vc '\.sample$')
note 'A folder with no Git:'
mkdir -p "$HERE/case-nogit"; show git -C "$HERE/case-nogit" config --get core.hooksPath
show git -C "$HERE/case-nogit" rev-parse --git-path hooks
```

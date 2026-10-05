# The checking script: what was built and what was seen

Work item: TKV-24. Branch: `claude/one-home-checks`. Date: 2026-10-05.
Specification: `dev/research/layout-audit/CHECKS-SPEC.md`.

`<assets>` is `plugins/toolkit/skills/project-setup/assets/`.

## 1. What was built

| File | Lines | Limit | Within the limit |
| --- | --- | --- | --- |
| `<assets>every-project/.claude/hooks/validate-records.mjs` | 279 | 280 | Yes, with 1 line to spare. No line is over 100 characters. |
| `dev/tests/validate-records.test.mjs` | 279 | 280 | Yes, with 1 line to spare. |
| `<assets>every-project/.githooks/pre-commit` (executable) | 6 | "about three" | 3 command lines, the `#!/bin/sh` line, and 2 comment lines. |

All 15 checks are in. The script was told to the owner as about 220 lines. It is 279. It cannot grow
without his yes.

Also changed: the six snippets in `<assets>settings/`, `dev/tests/hooks.test.mjs` (the snippet
counts, the `Stop` key, and the size test, which now lists four hook commands), five folder guides,
`DECISIONS.md`, and one row of the starter `AGENTS.md`.

### Checks that are narrower or wider than the specification says

| Check | Difference | Why |
| --- | --- | --- |
| 7 and 12 | A file with no row, a row whose file is missing, an integration document with no row, and a row whose document is missing are reported when the agent stops and before a commit, not after an edit. | Such a record is two files. It is whole only after two edits, so a check after the first edit always reported it. |
| 7 | A row counts as kept in the repository when its "Where kept" cell holds a link that is not a web address, or a name that starts `SRC-###-`. Any other row is taken as kept outside Git, and no file is looked for. | The form of a row gives no other mark. |
| 8 | `sources/AGENTS.md` and `sources/CLAUDE.md` may change, as `sources/README.md` may. | The specification names only `README.md`. Without this, "update the toolkit" could not commit a new folder guide. |
| 11 | It looks at the project folder, each folder directly inside it, and `work-items/` and `memory/` in the main checkout. It does not walk deeper. | A walk of the whole project (source code, `node_modules`) can take longer than a second. Every folder guide the toolkit ships is at one of these places. |
| 15 | "Well formed" means the prefix from "Work item ID prefix" in `PROJECT.md`, a hyphen, and digits. It reports `wi-31` or `WI31`. With no prefix on that line (GitHub Issues), it checks nothing. | An ID is found by its form, so a script can report only a near miss. |
| 1 | Equal to the specification. One extra: the same finding line is used when one ID is on two entries. | |
| 9 | In a work item, text inside angle brackets is not read. | An item made from the form still holds prompts with example IDs such as `DEC-014`. |
| After an edit in Codex | When the patch text names no file in the form the script knows, both groups of records are reported. | The Codex page does not give the form of the patch text (see section 2). A wrong guess must not turn the check off without a sign. |

### What the script cannot check

- Whether a decision, a rule, or a source says the right thing. It checks form and IDs only.
- Whether "Last changed via" names the right decision. It checks only that the entry exists.
- Whether a rule marked Draft has its question under Open questions.
- Work items in Notion or GitHub. It cannot read them.
- The other 29 checks of audit 1, section 6: Current state lines, the question table, tasks, memory
  pointers, `delivery/`, `PROJECT.md`.
- A file changed by a shell command, or by a person, until the agent stops (Claude Code) or commits
  (both products). Codex has no `Stop` entry.
- The staged copy of a file. Before a commit it reads the files in the folder, not the Git index.
  Check 8 does read the index.
- A comment that is not closed. The script does not strip it, so the example IDs in a guide
  comment whose `-->` was removed are reported as not defined.
- A commit made on GitHub's website, a merge with no conflict, and a rebase skip the pre-commit
  hook.

### Behavior the owner and the other builders should know

- A finding nobody fixes is reported again at the end of every turn in Claude Code, once per turn
  (`stop_hook_active` lets the second stop through). A project moved over from the older layout must
  be clean before the hooks are turned on. The most likely case: a Done or Cancelled work item with
  no Moved up line (check 14).
- A record changed in several edits gets a finding between the edits. Example: a rule is added
  with one edit, and the document's Status is set with the next. The finding goes away with the
  second edit.
- Check 8 compares the commit with the last commit of the checkout. It cannot tell an original
  that was published from one that was committed and not yet pushed. Renaming such an original after
  two sessions took one SRC number is stopped. `git reset --soft HEAD~1` and one new commit gets
  past it.
- The pre-commit file stops a commit only on exit code 2. A missing Node, a missing script, or a
  crash lets the commit through.

## 2. Facts taken from the official pages (captured 2026-10-05)

`CC` is `ai-external-knowledge/claude-code/hooks.md`. `CX` is `ai-external-knowledge/codex/hooks.md`.

| Fact the script or a snippet relies on | Page and line |
| --- | --- |
| Claude Code `PostToolUse` input holds `tool_input`; a file tool's path is `tool_input.file_path`, always absolute | CC 2035, 2045-2046; `Write` and `Edit` fields: CC 1688, 1697 |
| The common fields include `cwd` | CC 739; CX 484 |
| A matcher of letters and `\|` is a list of exact tool names; `PostToolUse` matches the tool name | CC 300, 313 |
| `PostToolUse`, exit code 2: "Shows stderr to Claude; the tool already ran" | CC 875; also CC 804 |
| Stderr from a hook that exits 0 goes to the debug log only, so the one line for the script's own error never reaches the agent | CC 804 |
| `Stop`, exit code 2: "Prevents Claude from stopping, continues the conversation"; the stderr text is the reason | CC 868, 2655 |
| `Stop` has no matcher | CC 331 |
| `stop_hook_active` is true when Claude Code already continues because of a stop hook; after 8 blocks in a row Claude Code ends the turn | CC 2583, 2585; `hooks-guide.md` 1010-1019 |
| A `PostToolUse` hook does not run when a shell command rewrites the file | CC 2031 |
| Codex `PostToolUse` runs after `apply_patch`; the matcher may be `apply_patch`, `Edit`, or `Write`; the input still says `tool_name: "apply_patch"` | CX 899-907, 462 |
| Codex `apply_patch` passes its input in `tool_input.command` | CX 916 |
| Codex matcher is a regular expression, so the snippet uses `^apply_patch$` | CX 419, 445 |
| Codex `PostToolUse`: "You can also use exit code `2` and write the feedback reason to `stderr`" | CX 940 |
| Codex `Stop` needs JSON on stdout: "Plain text output is invalid for this event". This is why Codex gets no `Stop` entry. | CX 1084-1085 |
| Codex skips a new or changed hook until the owner trusts it in `/hooks` | CX 71-78 |

Not on a captured page, so inferred:

- The form of the Codex patch text (`*** Add File: <path>`, `*** Update File: <path>`,
  `*** Delete File: <path>`, `*** Move to: <path>`), and that a relative path in it is relative to
  `cwd`. No live Codex run was made.
- `MultiEdit`. The Claude Code page does not list a tool of that name. The matcher names it because
  `CHECKS-SPEC.md` does. A name that matches no tool does nothing.
- Git's own `pre-commit` hook and `core.hooksPath`. No captured page covers Git.

## 3. The entries added to the snippets

Claude Code, in each of `claude-settings-hooks.local.json`, `.notion.json`, `.hindsight.json`:

```json
"PostToolUse": [ ..., { "matcher": "Edit|Write|MultiEdit", "hooks": [ { "type": "command", "command": "node",
  "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-records.mjs"], "timeout": 10 } ] } ],
"Stop": [ { "hooks": [ { "type": "command", "command": "node",
  "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-records.mjs", "--all"], "timeout": 10 } ] } ]
```

Codex, in each of `codex-hooks.local.json`, `.notion.json`, `.hindsight.json`:

```json
"PostToolUse": [ ..., { "matcher": "^apply_patch$", "hooks": [ { "type": "command",
  "command": "node \"$(git rev-parse --show-toplevel)/.claude/hooks/validate-records.mjs\"", "timeout": 10 } ] } ]
```

The Codex `description` line now ends "..., and a check of the project's records after each file
edit." A Codex project must trust its hooks again in `/hooks` after "update the toolkit".

## 4. What the setup step for `core.hooksPath` must say

The step is not written here. It belongs to `project-setup` (onboarding, "check the setup", and
"update the toolkit"). It must say:

1. Copy `.githooks/pre-commit` with the files every project gets, and keep it executable
   (`chmod +x .githooks/pre-commit`). Commit it.
2. In the main checkout, read the setting: `git config --get core.hooksPath`.
   - It prints nothing: run `git config core.hooksPath .githooks`. The setting is kept in this copy
     of the repository only, and every worktree of this copy uses it. Do this again on each
     computer and in each new clone.
   - It prints `.githooks`: nothing to do.
   - It prints anything else: change nothing. Tell the owner the folder it names, that the record
     check will not run before commits here, and that he can add this line to the `pre-commit` file
     in that folder: `"$(git rev-parse --show-toplevel)/.githooks/pre-commit" || exit 1`.
3. When `.git/hooks/pre-commit` exists and is not a `.sample` file, do the same as for another
   folder: change nothing and tell the owner. Setting `core.hooksPath` turns off every hook in
   `.git/hooks/`.
4. Not a Git repository: skip the step and say so.
5. "Check the setup" reports the setting, whether `.githooks/pre-commit` is executable, and the
   result of `node .claude/hooks/validate-records.mjs --all < /dev/null`. A project moved over from
   the older layout turns the hooks on only after that command prints nothing.

## 5. Sentences removed, and the pointer added to each guide

Removed: 5 sentences in 3 files. Each only stated a fact that a check now tests. The form the
agent writes stays in the same file.

| File | Sentence removed | Check | Where the form still is |
| --- | --- | --- | --- |
| `<assets>every-project/system/AGENTS.md` | "Only a Decided entry in `DECISIONS.md` makes a rule Approved." | 5 | The table of marks, same file |
| `<assets>every-project/system/AGENTS.md` | "Set the document's Status again after every change to a mark." | 5 | "What each Status means", same file; the steps in `update-system-doc.md` |
| `<assets>every-project/sources/AGENTS.md` | "Every original the project keeps has one row, and every row has one original." | 7 | "Files" and "The form of a row in the list", same file |
| `<assets>every-project/sources/AGENTS.md` | "The file or folder name starts with the row's ID." | 7 | "Files", same file |
| `<assets>work-local/work-items/AGENTS.md` | "The main file is named `<ID>.md`." The rest of its bullet now reads: "No file in the project other than an item's main file is named `<ID>.md`." | 13 | "Files", same file |

Looked at and kept:

- `dev/test-runs/filing-and-memory-skills.md`, section 6, lists 14 sentences. Its check numbers are
  those of audit 2, not the 15 here. Rows 3, 5, 8, 9, and 10 are steps of a procedure (what the
  agent writes, and when); a check tests the result, and the step stays. The other rows name checks
  that are not among the 15.
- `dev/test-runs/rules-and-project-files.md` and `lifecycle-and-tracker-skills.md` hold no such
  list.
- Every sentence that gives a form stays: the entry form and the four statuses in `DECISIONS.md`,
  the form of a document and of a rule, the marks, the form of a row, the ID forms, and the Moved
  up prompt in the work item form.

The pointer, one sentence in each place the agent reads at the moment of the edit:

| File | Sentence added |
| --- | --- |
| `<assets>every-project/DECISIONS.md`, in the kept comment | "`.claude/hooks/validate-records.mjs` checks the entries after each edit and before each commit. Fix what it reports." |
| `<assets>every-project/system/AGENTS.md` | "`.claude/hooks/validate-records.mjs` checks these documents after each edit and before each commit. Fix what it reports." |
| `<assets>every-project/sources/AGENTS.md` | "`.claude/hooks/validate-records.mjs` checks the list and the files here after each edit and before each commit. Fix what it reports." |
| `<assets>work-local/work-items/AGENTS.md` | "`.claude/hooks/validate-records.mjs` checks the items after each edit. Fix what it reports." |
| `<assets>memory-local/memory/AGENTS.md` | "`.claude/hooks/validate-records.mjs` checks Current State after each edit. Fix what it reports." |

Work items and memory are not in Git, so their two sentences do not say "before each commit".

The starter `AGENTS.md` has one new map row, `.githooks/pre-commit`. Its row for `.claude/hooks/`
is unchanged and still true.

## 6. Verification

### 6.1 The seven checks, run from the worktree root. All seen passing.

| Command | Result |
| --- | --- |
| `claude plugin validate .` | `✔ Validation passed` |
| `claude plugin validate ./plugins/toolkit` | `✔ Validation passed` |
| `claude plugin validate ./plugins/workstreams` | `✔ Validation passed` |
| `claude plugin test ./plugins/workstreams` | `14 pass`, `0 fail` |
| `node dev/tools/check-skills.mjs` | `22 skills checked ... passed, 0 errors, 0 warnings.` |
| `node dev/tools/check-rules.mjs` | `passed with 2 warnings.` Both are on rule files this work did not change (`salesforce-org-safety.md`, `session-handoff.md`) and were there before it. |
| `node --test 'dev/tests/*.test.mjs'` | `tests 88`, `pass 88`, `fail 0`. Of these, 38 are in `validate-records.test.mjs`. |

What the 38 tests cover: a new project gives no finding in any mode, with and without local work
items and memory; a correct, filled project gives none; 30 broken records, at least one per check
except 8, each with its finding line, first passing before it is broken; check 8 through a real
`git commit` with `core.hooksPath` set; a project with no `work-items/` and no `memory/`; bad
input, a missing folder, and no Git repository exit 0; `stop_hook_active` exits 0; a Git worktree;
output under 2,000 characters; no file written (every file of the project compared before and
after); and the six snippets, with the Codex command run as written.

### 6.2 Line counts

`wc -l`: 279 `validate-records.mjs`, 279 `validate-records.test.mjs`, 6 `pre-commit`. The size test
in `dev/tests/hooks.test.mjs` fails when the script is over 280 lines or holds a line over 100
characters.

### 6.3 A real run in each product's form. Seen.

A scratch project built from `<assets>every-project/`, `work-local/work-items/`, and
`memory-local/memory/`, under `.../scratchpad/build-checks/project`, as a Git repository.

An edit that breaks check 2 (an entry with `- Status: Approved`):

```text
$ <the PostToolUse JSON of the Claude Code page, tool_input.file_path = <project>/DECISIONS.md> | node .claude/hooks/validate-records.mjs
The record check found 1 problem(s). Fix each one. Tell the owner about any you cannot fix.
DECISIONS.md:36: DEC-001 has Status "Approved". Use one of: Open, Decided, Superseded, Withdrawn.
exit code: 2

$ <the PostToolUse JSON of the Codex page, tool_name apply_patch, tool_input.command = "*** Begin Patch\n*** Update File: DECISIONS.md\n..."> | node .claude/hooks/validate-records.mjs
The record check found 1 problem(s). Fix each one. Tell the owner about any you cannot fix.
DECISIONS.md:36: DEC-001 has Status "Approved". Use one of: Open, Decided, Superseded, Withdrawn.
exit code: 2

$ node .claude/hooks/validate-records.mjs --all < /dev/null
The record check found 1 problem(s). Fix each one. Tell the owner about any you cannot fix.
DECISIONS.md:36: DEC-001 has Status "Approved". Use one of: Open, Decided, Superseded, Withdrawn.
exit code: 2

$ {"cwd":"<project>","hook_event_name":"Stop","stop_hook_active":true} | node .claude/hooks/validate-records.mjs --all
exit code: 0
```

The clean edit (`- Status: Decided`): the same three commands print nothing, each with exit code 0.

The pre-commit hook:

```text
$ git config core.hooksPath .githooks
exit code: 0

$ git commit -m 'Record a decision and file a source'   (a new entry, a new original, and its row)
[main 24906b6] Record a decision and file a source
 3 files changed, 12 insertions(+), 2 deletions(-)
 create mode 100644 sources/SRC-001-kickoff-notes.md
exit code: 0

$ git commit -m 'Correct the notes'   (a line added to the filed original, staged)
The record check found 1 problem(s). The commit was stopped. Fix each one. Tell the owner about any you cannot fix.
sources/SRC-001-kickoff-notes.md: this commit changes or deletes a filed original. Take that change out of the commit, and file a corrected version as a new SRC.
exit code: 1

$ git log --oneline
24906b6 Record a decision and file a source
bbf7a0e Start
```

Git reports exit code 1 for a stopped commit; the pre-commit file itself ends with a non-zero
code when the script exits 2.

### 6.4 Time. Seen.

A generated project: 200 decisions, 60 rules in 7 documents, 100 sources with their files, 50 work
items (844 KB), on an Apple M5 with Node 25.8.1. Ten runs of each mode after two warm-up runs.

| Mode | Exit code | Slowest | Median |
| --- | --- | --- | --- |
| After an edit of `DECISIONS.md` | 0 | 65 ms | 64 ms |
| After an edit of a work item | 0 | 66 ms | 64 ms |
| After an edit of a file that is not a record | 0 | 53 ms | 51 ms |
| `--all` (stop) | 0 | 66 ms | 64 ms |
| `--staged` (pre-commit) | 0 | 67 ms | 66 ms |

Starting Node alone takes about 34 ms. The slowest mode is `--staged`, at 67 ms.

### 6.5 One live run, Claude Code only. Seen.

- Sign-in: `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`, Claude Code 2.1.289. Nothing was
  added to that folder except the session files the run made. Nothing was removed.
- Project: `.../scratchpad/build-checks/live`, built from `every-project/`, `work-local/`,
  `memory-local/`, and `memory-process/`, with the `hooks` of `claude-settings-hooks.local.json`
  as the `hooks` of its `.claude/settings.json`.
- Command: `claude -p '<add entry DEC-001 to DECISIONS.md ... Write its Status line as "- Status:
  Approved". Make the edit directly with the Edit tool, use no skill, and do not commit. ...>'
  --model haiku --permission-mode acceptEdits --output-format stream-json --verbose`.
  Model: `claude-haiku-4-5-20251001`. Session `f467f77a-9661-40fa-bc2c-f3ef7d181ad5`.

What the session record shows, in order:

1. The agent's `Edit` wrote the entry with `- Status: Approved`.
2. The next record is a `hook_blocking_error` for `PostToolUse:Edit`, from the command
   `node ${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-records.mjs`, with this text: "The record
   check found 1 problem(s). Fix each one. Tell the owner about any you cannot fix.
   DECISIONS.md:36: DEC-001 has Status "Approved". Use one of: Open, Decided, Superseded,
   Withdrawn."
3. The agent wrote: "The validation hook caught that "Approved" is not a valid status. Based on
   the file's own rules, the status should be "Decided" since the owner made the decision on this
   date." Its second `Edit` changed the line to `- Status: Decided`. No finding followed.
4. The `stop_hook_summary` lists `node ${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-records.mjs
   --all`, 82 ms, no error, and the stop was not prevented.
5. The reply told the owner: "The project's validation hook rejected the "Approved" status you
   requested, so I corrected it to "Decided" per the file's schema".

So the finding reached the agent, and it corrected the entry. The agent chose Decided itself; the
finding names the four words and does not say which one fits.

After this run, three lines of the script changed: a finding is cut at 300 characters, and a Codex
patch that names no file reports both groups. Neither is on the path this run took. Sections 6.1
to 6.4 were run again on the final script.

## 7. Not done here

- The setup step for `core.hooksPath` (section 4), the "Code limit" rule in the repository
  `AGENTS.md`, the version number, and `dev/PROGRESS.md`: they belong to other work on this branch.
- The separate wording review and best-practices review of the changed files.
- A live Codex run.

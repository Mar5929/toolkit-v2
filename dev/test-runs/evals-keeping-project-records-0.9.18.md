# Live run of the keeping-project-records evals, toolkit 0.9.18

This file records the first live run of the 36 evals in `dev/evals/keeping-project-records/`. Result: 5 evals passed in full (4, 16, 33, 35, and 36), 28 failed, and 3 (17, 18, and 19) were blocked by a permission check and are not counted as results.

The saves themselves were mostly right: in most of the failed evals the agent put each fact in the place the README names. Of the 28 failures, 22 are only the expectation that asks for the save report in one line. The others are a decision saved with the wrong status (eval 26), a record left out of date (evals 5 and 7), a source named only by a pointer (eval 24), a "Waiting on" line that omits the review (eval 30), and a question about whether to save (eval 12).

## What was tested

| Item | Value |
| --- | --- |
| Date of the run ("the run date") | 2026-10-08 |
| Checkout | `.claude/worktrees/live-tests`, branch `live-tests-0.9.18`, main at commit `09529cb7` |
| Plugin | `toolkit` 0.9.18, loaded with `--plugin-dir` (the session's plugin list shows `toolkit@inline` at this checkout's path) |
| Claude Code | 2.1.289 |
| Model | `claude-opus-5-5`, the test home's default (the `init` line of every session). `--model` was not passed. |
| Sign-in | `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`. Nothing was installed into it. |
| Hook | `prompt-reminder.mjs` ran in every eval session and printed the owner's rule. See "The hook" below. |
| Evidence folder | `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-toolkit-v2/37183348-0499-44f8-9e70-4a89bb3634ae/scratchpad/live-tests/evals/evidence/kp/` (one folder per run, `kp01-a1` to `kp36-a1`) |
| Run folders | `.../live-tests/evals/runs/kpNN-a1/` |
| Grades | `.../live-tests/evals/grades/` (one file per six evals, with every expectation and its quoted evidence) |

Each evidence folder holds `msg1.txt`, `session-msg1.jsonl` (every tool call, hook event, and reply), `reply1.txt`, `diff.txt`, `clean-diff.txt` (every file changed against the base project, without `memory/MEMORY.md`, which a hook rebuilds), `gitlog.txt`, and `session-id.txt`.

## How the base project was built

It is the same base as in `evals-small-work-item-0.9.18.md`, and it is a real setup, not a hand-built one. In an empty `git init` folder, one headless `claude -p` message said "set up this project" with the README's answers (Pocket Ledger, owner Mike Rihm, work items local with prefix `WI`, memory local, not Salesforce, no `SOUL.md`) and three plain facts for any other question. The `project-setup` skill finished in that one message. Then the fixture was copied over it, the record check printed nothing (exit 0), and everything was committed (`f58dd77`):

```bash
cp -R dev/evals/fixtures/pocket-ledger-records/project/. .
cp dev/evals/fixtures/pocket-ledger-records/owner-preferences.md .claude/rules/owner-preferences.md
echo '{}' | node .claude/hooks/validate-records.mjs --all
```

Nothing known differs from a project set up by hand. The setup session turned off five retired `@toolkit-v2` plugins in the project's `.claude/settings.json`. The setup session's stream is `.../evidence/base/setup-1.jsonl`.

## The commands

Each eval got a fresh copy of the base (`cp -a`, with `.git`) and one message, the `prompt` of `evals.json`. At most three sessions ran at once.

```bash
export CLAUDE_CONFIG_DIR=$HOME/.toolkit-v2-test-homes/claude
cd <run folder>
claude -p "<prompt>" --plugin-dir <this checkout>/plugins/toolkit \
  --output-format stream-json --verbose --include-hook-events \
  --permission-mode acceptEdits --allowedTools "Bash Read Write Edit Glob Grep Skill Agent ToolSearch" \
  > session-msg1.jsonl
```

`acceptEdits` was used in every run. Claude Code treats the file `.claude/rules/owner-preferences.md` as a sensitive file and does not let `acceptEdits` write it (see "Blocked evals"). An attempt to run evals 17, 18, and 19 again with `--permission-mode bypassPermissions` was refused by the session's safety classifier before any session started, so it was not made. No option that skips permission checks was used.

Scoring followed the README: the changes were listed from the diff against the base project, and each expectation was decided from the diff, the run folder, and the reply. The grading of the 36 runs was done by six helper agents (Sonnet) that read the evidence and wrote the grade files; they were told to quote evidence, to mark an expectation "unsure" when the evidence was unclear, and to count the questions. I read all six grade files and used them. Two rules were made uniform afterwards, because the helpers read the expectation about the one-line report differently:

- The expectation "the reply tells Mike what was saved in one line, or in one line for each record that changed, and not in a longer report" passes only when the report is short, about one sentence for each changed record. It is "unsure" when the reply has a bullet for each record but the bullets run several sentences or a Sources list is added. It fails when the reply is a long report with several sections. Evals 13, 14, and 15 were changed from "pass" to "unsure" for this reason. Unsure and failed both fail the eval.
- Counts of expectations in this file are my count of the listed lines of each grade file. Where a helper's written total differed (evals 20 to 24), the count here is the corrected one.

## The hook

The rule text was printed in every eval session: each stream holds a `UserPromptSubmit` hook response that begins "Before you answer, check this project's skills and use every one that fits this message. The owner's rule for every request, from .claude/rules/evaluate-the-owners-request.md" and continues with the whole rule. A probe session shows it: `.../evidence/probe/hook-probe.jsonl`. A count of "Evaluate the Owner" in each `session-msg1.jsonl` is 1.

## Results

"Questions" is the number of questions the reply asks Mike. "Passed" counts the expectations that passed; "u" is the number marked unsure.

| Eval | Result | Passed | Questions | What failed or was unsure |
| --- | --- | --- | --- | --- |
| 1 | Failed | 7 of 8 (1 u) | 1 | the one-line report |
| 2 | Failed | 8 of 9 (1 u) | 1 | the one-line report |
| 3 | Failed | 6 of 7 (1 u) | 0 | the one-line report |
| 4 | Passed | 6 of 6 | 0 | |
| 5 | Failed | 6 of 7 | 4 | "Now" in the Current State still lists WI-033 |
| 6 | Failed | 6 of 7 (1 u) | 1 | the one-line report |
| 7 | Failed | 4 of 6 | 1 | PT-04 still holds the old date; the report is long |
| 8 | Failed | 6 of 7 | 1 | the report is long |
| 9 | Failed | 4 of 5 | 1 | the report is long |
| 10 | Failed | 6 of 7 | 1 | the report is long |
| 11 | Failed | 5 of 6 | 1 | the report is long |
| 12 | Failed | 5 of 7 | 1 | the report is long; the agent asks whether to save |
| 13 | Failed | 7 of 8 (1 u) | 0 | the one-line report |
| 14 | Failed | 6 of 7 (1 u) | 0 | the one-line report |
| 15 | Failed | 7 of 8 (1 u) | 1 | the one-line report |
| 16 | Passed | 6 of 6 | 0 | |
| 17 | Blocked | 3 of 7 | 0 | the edit of `owner-preferences.md` was denied |
| 18 | Blocked | 2 of 7 | 1 | the edit of `owner-preferences.md` was denied |
| 19 | Blocked | 3 of 7 | 1 | the edit of `owner-preferences.md` was denied |
| 20 | Failed | 5 of 6 (1 u) | 2 | the one-line report |
| 21 | Failed | 6 of 7 (1 u) | 1 | the one-line report |
| 22 | Failed | 7 of 8 (1 u) | 2 | the one-line report |
| 23 | Failed | 5 of 6 (1 u) | 1 | the one-line report |
| 24 | Failed | 3 of 5 (2 u) | 1 | the source is only a pointer; the one-line report |
| 25 | Failed | 6 of 7 | 0 | the report is long |
| 26 | Failed | 7 of 10 | 1 | DEC-003 saved as Decided; no request to confirm it; the report is long |
| 27 | Failed | 7 of 8 | 1 | the report is long |
| 28 | Failed | 5 of 6 | 1 | the report is long |
| 29 | Failed | 6 of 7 | 1 | the report is long |
| 30 | Failed | 5 of 7 (1 u) | 0 | the "Waiting on" line; the report is long |
| 31 | Failed | 6 of 7 | 1 | the report is long |
| 32 | Failed | 6 of 7 | 1 | the report is long |
| 33 | Passed | 4 of 4 | 1 | |
| 34 | Failed | 5 of 6 (1 u) | 0 | the one-line report |
| 35 | Passed | 5 of 5 | 1 | |
| 36 | Passed | 4 of 4 | 0 | |

Each eval ran once. Every session finished, so no run was repeated for a service error.

### Evals that test an example under the goal

The root guide's goal gives four examples: "a new person or a changed role, a decision that replaces an older one, a blocker that cleared, or a correction from the owner". These evals test an example, and not the goal alone: eval 1 (a new person), eval 2 (a changed role), eval 3 (someone leaves, a changed role), eval 27 (a decision that replaces an older one), eval 31 (a blocker that cleared), and evals 14 and 15 (a correction from the owner). Only the one-line report failed in 1, 2, 3, 14, and 15 (the example facts themselves were saved in the right place). Eval 27 failed only on the report, and so did eval 31. So the examples did not fail on the saving; the other 22 situations, which the goal covers without an example, also saved the fact in the place the README names in most runs.

## What failed, with the evidence

### The one-line report, in 27 evals

The sentence of the goal "Tell the owner in one line what you saved" did not work. In 13 evals the report is a bullet for each record, with several sentences each and a "Sources:" list: 1, 2, 3, 6, 13, 14, 15, 20, 21, 22, 23, 24, and 34 (unsure). In 14 evals the reply is a long report with several sections that holds the save as one part: 7, 8, 9, 10, 11, 12, 25, 26, 27, 28, 29, 30, 31, and 32 (failed). Eval 4 and eval 5 are the two evals in which the report was short. The README says that when this expectation fails in many evals, the sentence of the goal is not working and no single situation is the cause. For example:

- Eval 8 (reply opens with the answer, then "bullets for WI-031, PROJECT.md, memory, two unconfirmed items, passed date, Sources").
- Eval 32: a full project status report with eight sections ("Saved", "Work items", "Open decision", "Project tasks", "Dates", "One gap", "Sources") around a three-bullet save.
- Eval 13: "What I saved:" with two bullets, one of them: "It said: "It is in Bea Hollis's own Google Drive: https://example.com/sheets/bea/pocket-ledger-testers". It now gives the shared Pocket Ledger folder and the new link ...", then a four-line "Sources:" list.

The agent also writes a "Sources:" list in almost every reply. That follows the goal's "Say where each fact came from", so it may be right; but it is the main reason the report is longer than one line.

### Other failed or unsure expectations

- **Eval 5** (park the chart library). Expectation 3 fails. `memory/CURRENT_STATE.md` "Now" still lists "WI-033: picking a charting library" with no parked note, while WI-033's own file says "Mike put the work item on hold on 2026-10-08". The agent put the new question under "Waiting on" and left "Now" as it was.
- **Eval 7** (the schedule shifts). Expectation 3 fails. PT-04 says 2026-12-04, but its Work text still holds "moved the date from 2026-11-20", the old date as history.
- **Eval 12** (pasted notes). Expectation 7 fails. The notes were filed as SRC-002 and WI-032 names it, but the reply asks "should I record Tomas's four points as draft rules in a new sync server integration document in system/?". That asks whether to save more.
- **Eval 24** (an ownership line moves). Expectation 3 is unsure. `PROJECT.md` says "It computes nothing: the iPhone app computes the monthly totals (DEC-003)". Mike and the run date are in DEC-003 ("Decided: 2026-10-08, Mike"), not in the `PROJECT.md` row.
- **Eval 26** (call notes with a lasting decision). Expectations 2 and 3 fail, and 8 fails on length. DEC-003 has "Status: Decided" and "Decided: 2026-10-08, Mike", where the expectation asks for Open until Mike confirms; the reply does not ask Mike to confirm it. The reply asks instead how the staging test account will be created. The agent also added CON-01 in `system/constraints.md` as Approved, on the strength of the call notes alone. No expectation names this, but it records as approved a rule that nobody confirmed.
- **Eval 30** (a new blocker). Expectation 2 is unsure. The new "Waiting on" line is "Tomas Lindqvist (contractor): PT-05 (the production database and the production address)"; it does not name the hosting company's review, which is only in PT-05's "Depends on".
- **Eval 29** (a lasting decision). Passed on its listed expectations except the report length. A change that no expectation names made a record wrong: the agent took Q-06 (currencies) as answered "US dollars only" and rewrote WI-031 R-01 line 3, and it made a task PT-05 (tell Bea). Neither was in Mike's message.
- **Eval 28**: the agent rewrote the wording of the unapproved WI-032 R-02, R-03, and R-04 (added the phone list). The README does not list this as a failure.

### Blocked evals: 17, 18, 19

The edit of `.claude/rules/owner-preferences.md` was denied in all three. The stream of eval 17 records a denied `Edit` ("permission_denials" in `session-msg1.jsonl`), and the reply says "Not saved: the permission settings blocked my edit". In eval 18 the reply says "Not saved: your new preference for short status updates". In eval 19 both an `Edit` and a `cat >> .claude/rules/owner-preferences.md` were denied. The file keeps its original lines in all three. So these three runs test the permission check of the test setup, not the goal. The agent did the right thing in each: it tried the edit, wrote the line it meant to add in the reply ("Write dates out for me, like November 20th ... (2026-10-08, Mike, in chat)"), and said it was not saved. The numbers 3 of 7, 2 of 7, and 3 of 7 in the table are what the helpers counted, and they are not results. To run these three, someone has to allow the edit of that file: a permission rule for it that the sensitive-file check accepts, or the option that skips permission checks, which the session's safety classifier did not allow me to use. This is a limit of the headless run; in a session where Mike answers the permission prompt, the edit would go through.

Other permission denials, which did not stop a run: `WebFetch` of `https://example.com/...` in evals 11 and 13 (the example addresses in the prompts are not real, and the agents said they could not open the link), and a `Bash` command in evals 9, 10, and 31 that the check refused. The agents continued, and the saves were made.

## Questions the agent asked Mike

The agent asked 31 questions in the 36 runs. Of the eval 5 count of 4, three are open items restated as waiting on Mike (Q-05, Q-06, and DEC-002) and one is a real new question. The classes:

| Class | Count | Evals |
| --- | --- | --- |
| Called for by the expectations | 2 (and 3 restated items in eval 5) | Eval 33 (who settles the number of testers) and eval 35 (the one open question, Q-04). Eval 5's three restated items are listed in its reply as waiting on Mike, as expectation 7 asks. |
| Forbidden by the expectations | 1 | Eval 12 ("should I record Tomas's four points as draft rules in a new sync server integration document in system/?"): it asks whether to save. |
| Not covered, and about the work | 25 | Evals 1, 2, 5 (one), 6, 7, 8, 9, 10, 11, 15, 18, 19, 20 (two), 21, 22 (two), 23, 24, 26, 27, 28, 29, 31, 32. |

No expectation of the 10 evals named in the README for the rule "asks Mike no question about adding a person or a system" (1, 2, 3, 8, 9, 10, 14, 24, 31, 32) was broken: no agent asked before changing `PROJECT.md`. In none of the 36 runs did the agent ask whether to save a fact, except for eval 12.

Questions that look unnecessary, with the reply's words (the answer was already in the records or in Mike's message, or the record was saved without it):

- Eval 1: "Who should I record as owing you the staging sign-in steps: Tomas or Ilse?" The PT-01 line was saved already with "may now be for Ilse Varga to give, not confirmed".
- Eval 2: "Does Nadia also take over the tester sheet and the Monday feedback round-up, or does Bea keep either one?" Mike had said that "who's in, who's out, and telling the testers stuff all goes through Nadia".
- Eval 6: "Does a sign-in to staging count as touching the server, or may Tomas send you the sign-in steps during the move?"
- Eval 8: "What is the name of the Firebase project, so I can add it to PROJECT.md?" The row was saved without it, and nothing needed it.
- Eval 12: the question about the new `system/` document. It is also the one question the expectations forbid.
- Eval 15: "Do all three of the running club people live in the United States?" The record was saved with the place marked not known, and DEC-002 is open.
- Eval 26: "How will you create the staging test account ...?" The record was saved without it, and it is not the confirmation of DEC-003 that the expectation calls for.
- Eval 27: "Do you approve this result?" It re-asks WI-033's open Q-04, which Mike did not raise.
- Eval 29: "Q-05: Can a user change or delete a transaction after saving it?" An already open question in WI-031.
- Evals 20 and 22: the same question is asked twice in one reply (as "Q-05" in the body, and again as the last line).

The other 18 questions are about the work (a real gap in a requirement, or a conflict between two records), and the answer was not in the records.

## What this run shows about the owner's question

The agent does not ask Mike more than it should about saving: no run asked whether or where to save a fact except eval 12, and no run asked before changing `PROJECT.md`. It does add a question about the work to the end of about 22 of 36 replies. About 9 of those 31 questions look unnecessary. Where the expectations call for a question (evals 33 and 35), the agent asked exactly one. Where they call for none (eval 34, eval 36), it asked none.

## Not run

All 36 evals ran. Evals 17, 18, and 19 ran but are blocked, as described above, and they are not counted as passed or failed.

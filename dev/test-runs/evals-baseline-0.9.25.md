# The baseline run of the three eval sets, toolkit 0.9.25

This file records one full run of the three eval sets under `dev/evals/` on toolkit 0.9.25, and a second run of eleven of the evals on the sentence that version 0.9.30 corrects. It is the baseline: a later change to the instruction text is measured against these numbers.

| Eval set | Passed | In the first run, on 0.9.18 |
| --- | --- | --- |
| `keeping-project-records`, 36 evals | 19 | 5 |
| `small-work-item-short-path`, 9 evals | 5 | 1 |
| `work-item-question`, 5 evals | 5 | The set did not exist. |

The two runs are not a clean comparison. Between them the instruction text changed (versions 0.9.19 to 0.9.25), and so did the tests: some expectations, four prompts of the short-path set, the messages that follow a prompt, and the rule for grading the report of a save. "What changed between the two runs" below lists it.

The folder `evals-baseline-0.9.25/` holds every message, every reply, the list of files that each run changed, and the grade files.

## What was tested

| Item | Value |
| --- | --- |
| Date of the run ("the run date") | 2026-10-09 |
| Toolkit | 0.9.25, commit `f8ba3537` on main, loaded with `--plugin-dir` from a checkout whose files equal that commit |
| Claude Code | 2.1.289 |
| Model | `claude-opus-5-5`, the test home's default. `--model` was not passed. |
| Sign-in | `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`. Nothing was installed into it. |
| Base project | Built by `dev/evals/tools/build-base-project.sh`: a real setup by the `project-setup` skill in one session without a person (Pocket Ledger, local work items, local memory, not Salesforce), then the fixture `dev/evals/fixtures/pocket-ledger-records/` copied over it. The record check printed nothing. |
| Runs | One run of each of the 50 evals, three at a time, each in a fresh copy of the base project. `dev/evals/tools/run-live-eval.py` sent the messages. |
| Cost | 96.86 dollars of usage for the 50 runs: 33.71 for the record-keeping set, 59.37 for the short-path set, and 3.78 for the work item question. The eleven runs that were repeated cost 31.92 dollars. |

The command for each message is the one in `run-live-eval.py`: `claude -p` with `--permission-mode acceptEdits` and the tools `Bash Read Write Edit Glob Grep Skill Agent ToolSearch`. No option that skips permission checks was used. Every session finished, so no run was repeated for a service error.

Main was at version 0.9.27 when the run ended. Versions 0.9.26 and 0.9.27 changed no instruction text that this base project gets: the only difference in its files is three lines of `.claude/settings.json`.

## How the runs were graded

Nine helper agents on Sonnet graded the runs with the brief `dev/evals/tools/grader-brief.md`. The filled brief is `evals-baseline-0.9.25/grader-brief-as-used.md`, and the grade files are in `evals-baseline-0.9.25/grades/`. I read every grade file.

One expectation needed one rule for all 36 record-keeping evals, because the helpers read it in two ways: "The reply says what was saved in one short line for each record that changed, and adds nothing else about the save." The rule is now in the README of the set:

- The report passes when each of its lines reports one change in one sentence, and nothing else about the save follows. A file that changed in two places may have two lines. A line for a change that removes or replaces text may also hold the old text and the words that undo the change.
- The report fails when a line runs to several sentences, or when a sentence or a paragraph beside the lines explains the save, repeats it, says how it was checked, or names the commit or the remote.
- The answer to Mike's request, a Sources list, a sentence that marks something as not confirmed, and a question about the work are not part of the report.

Under this rule, evals 2, 7, and 9 pass. Their helpers had failed them because one file had two or three lines, each one sentence long. Every other result is the helper's. So the helpers' own count for the record-keeping set is 16, and the count under the rule is 19.

In this run `replyN.txt` holds the last block of text of the turn. In 46 of the 73 turns the agent wrote one short line before its tool calls, of about 100 characters, and that line is missing from the file. In one turn, message 2 of short-path eval 2, the missing blocks held most of the reply. The script now saves every block.

## Keeping the project's records: 19 of 36

| Eval | Result | Passed | Questions | What failed |
| --- | --- | --- | --- | --- |
| 1 | Failed | 7 of 8 | 0 | The report: one line has a second sentence that explains |
| 2 | Passed | 9 of 9 | 1 | |
| 3 | Failed | 6 of 7 | 1 | The report: one line has two sentences and a reason |
| 4 | Failed | 5 of 6 | 0 | The report: a sentence on how the save was checked |
| 5 | Passed | 6 of 6 | 1 | |
| 6 | Passed | 7 of 7 | 0 | |
| 7 | Passed | 6 of 6 | 1 | |
| 8 | Failed | 6 of 7 | 1 | The report names the commit |
| 9 | Passed | 5 of 5 | 1 | |
| 10 | Passed | 7 of 7 | 1 | |
| 11 | Passed | 6 of 6 | 1 | |
| 12 | Failed | 6 of 7 | 1 | The report names the commit |
| 13 | Failed | 7 of 8 | 0 | The report: a sentence about the source beside the lines |
| 14 | Failed | 6 of 7 | 0 | The report: "No other record named Monday, so nothing else needed correcting." |
| 15 | Passed | 8 of 8 | 1 | |
| 16 | Passed | 6 of 6 | 1 | |
| 17 | Blocked | 4 of 7 | 0 | The edit of `owner-preferences.md` was refused |
| 18 | Failed | 5 of 7 | 1 | The report says "written but not committed"; the status is not the short one Mike asked for |
| 19 | Blocked | 4 of 7 | 1 | The edit of `owner-preferences.md` was refused |
| 20 | Failed | 5 of 6 | 1 | The report: one line of several sentences, and a sentence on the record check |
| 21 | Passed | 7 of 7 | 1 | |
| 22 | Failed | 7 of 8 | 1 | The report says "not committed yet; say 'commit it'" |
| 23 | Failed | 5 of 6 | 1 | The report names the commit |
| 24 | Passed | 5 of 5 | 1 | |
| 25 | Failed | 6 of 7 | 0 | The report: a paragraph that repeats the save |
| 26 | Failed | 8 of 10 | 1 | DEC-003 is saved as Decided; the reply does not ask Mike to confirm it |
| 27 | Failed | 7 of 8 | 1 | The report: one line of two sentences, and a paragraph beside it |
| 28 | Passed | 6 of 6 | 1 | |
| 29 | Passed | 7 of 7 | 1 | |
| 30 | Passed | 7 of 7 | 0 | |
| 31 | Passed | 7 of 7 | 0 | |
| 32 | Failed | 6 of 7 | 1 | The report names the commit |
| 33 | Passed | 4 of 4 | 1 | |
| 34 | Passed | 6 of 6 | 1 | |
| 35 | Passed | 5 of 5 | 1 | |
| 36 | Passed | 4 of 4 | 0 | |

The 17 that did not pass fall into four groups.

- **Eight fail only on a report that says more than the lines:** 1, 3, 4, 13, 14, 20, 25, and 27. The agent adds a second sentence to a line, or a sentence or a paragraph beside the lines that explains the save, repeats it, or says how it was checked.
- **Six name the commit in the report:** 8, 12, 18, 22, 23, and 32. Version 0.9.22 changed `publish-docs`, step 8, so that the reply names the commit only when Mike asked to publish or commit, or when the main checkout does not hold the save. Neither was true in these runs. The scratch project has no remote, and four of the six say so ("committed to main on this computer; the repository has no remote"). In 18 and 22 the edit was one that `publish-docs` does not commit, and the reply says that it is not committed. Eval 18 also gave a status that lists every work item and open question.
- **Two were refused the edit of `.claude/rules/owner-preferences.md`:** 17 and 19. Claude Code treats that file as a sensitive file in a session without a person. In both, the agent tried the edit, said that it was not saved, and gave Mike the line to paste. Eval 18 needs the same edit, and in this run the edit went through. So the refusal is not the same in every session. These two runs test the permission check, and not the goal.
- **One has a real fault in a record:** 26. The pasted call notes say that Mike decided how amounts are stored. The agent saved DEC-003 as Decided, by Mike, and did not ask him to confirm it. The first run did the same, and so did a third run of this eval on the corrected sentence. `filing-project-records`, `references/file-source.md`, says in a table row that a decision that somebody states is recorded as Open until a person who may decide confirms it. `references/record-decision.md`, which the agent follows to write the entry, does not say it.

Changes that no expectation names and that made a record wrong: in eval 5 the row for Q-04 of WI-033 is marked Answered with the decision "no", although Mike did not answer it. In eval 26 a line under "Coming up" holds a date that the notes do not give.

In evals 4 and 20 the agent ran the record check by hand and it stopped with a read error. The check reads its input from standard input, and the agent gave it none. The hook runs it with input, so this is not a fault of the check.

### Questions the agent asked Mike

The agent asked 26 questions in the 36 runs. Three were called for by an expectation (evals 18, 33, and 35). None asked whether or where to save a fact. No reply asked whether to make a work item, which is what the set expects: no prompt in it calls for that question.

The helpers judged 9 of the other 23 questions unnecessary, because the record was saved without the answer, or the answer was in the records or in Mike's message: evals 7, 8, 9, 10, 15, 24, 26, 27, and 29. The first run had 31 questions, and about 9 looked unnecessary.

## The short path of a small work item: 5 of 9

| Eval | Case | Result | Passed | Questions | What failed |
| --- | --- | --- | --- | --- | --- |
| 1 | (a) one line in an email text | Failed | 13 of 14 | 2 | `delivery` stayed `not-offered`; `building.md` sets `owner-led` for a small work item |
| 2 | (b) a file of records for production | Failed | 10 of 14 | 4 | No question whether to make a work item; then the closing reply and the reply after it |
| 3 | (c) a merge and a deploy | Passed | 13 of 13 | 5 | |
| 4 | (d) "no" to the closing question | Passed | 13 of 13 | 3 | |
| 5 | (e) the work needs a design | Passed | 12 of 12 | 2 | |
| 6 | (f) the phase "P01 — Ongoing support" | Passed | 9 of 9 | 3 | |
| 7 | (g) the owner asks for the full process | Passed | 8 of 8 | 1 | |
| 8 | (h) the upload fails after the closing yes | Failed | 7 of 15 | 4 | No question whether to make a work item; then the work item was marked Done, and the file was not fixed |
| 9 | (i) a result that builds rule CON-01 | Failed | 8 of 10 | 3 | No separate checker ran |

What the four failures show:

- **Evals 2 and 8: the fourth case of the new rule was too wide.** Version 0.9.25 told the agent not to ask whether to make a work item "when 'Where information goes' or 'Which skill' sends the request somewhere other than a work item". Both prompts ask for a file of records that Mike loads into TestFlight. Reply 1 of eval 2 says: "I made no work item, because a load file like this belongs in `delivery/migrations/`." That table names a place for the result of almost every job. Version 0.9.30 replaces the case, and "The eleven runs on the corrected sentence" below shows the result.
- **Eval 9: no separate checker for a result that builds a rule in `system/`.** The agent wrote "No separate checker ran; I checked the result myself". `testing-loop.md`, section "A small work item", lists four kinds of result that start the checker, and this is the fourth. A run of the same eval earlier that day, on the branch, did the same. So the miss has shown in two runs of two.
- **Eval 1: one field.** Everything else in the run followed the short path.
- **Eval 8 after the first reply.** After Mike's closing yes the agent marked WI-034 Done and wrote "Nothing to merge or deploy: Deploying skipped", although Mike had said that he uploads the file himself. After the failed upload it did not correct the file. It offered two options and a new work item.

In eval 6 the agent asked "Commit the new owner preference to main?" after the work item was Done. No expectation names it.

The agent asked 27 questions in the nine runs. The expectations call for 23 of them. The helpers judged two of the other four unnecessary (evals 6 and 8).

In the four runs that built a file in the repository (evals 3 and 9 here, and evals 1 and 3 of the work item question), the file was on a branch of its own, and main did not hold it before Mike's yes. In the first run the agent committed such a file to main once.

## The question whether a job gets a work item: 5 of 5

| Eval | Case | Result | Passed | Did the agent ask? |
| --- | --- | --- | --- | --- |
| 1 | (a) a new settings file, and Mike says no | Passed | 6 of 6 | Yes, with "I recommend no" |
| 2 | (b) the whole result is a short text in the reply | Passed | 4 of 4 | No |
| 3 | (c) Mike says in the request that the job gets no work item | Passed | 5 of 5 | No |
| 4 | (d) the turn only answers a question | Passed | 3 of 3 | No |
| 5 | (e) a work item that exists covers the work | Passed | 4 of 4 | No |

In evals 1 and 3 the agent built the file in a worktree of its own, on a branch of its own, and asked before the merge. Main did not hold the file before Mike's yes.

## The eleven runs on the corrected sentence

Version 0.9.30 changes one sentence of the starter root guide. The agent does not ask whether to make a work item "when the request is only to save or correct a fact or a project task in the project's records, or when one skill in 'Which skill' other than `managing-work-items` does the whole request". The earlier text of these two cases is quoted above.

Eleven evals ran again in a copy of the base project that holds the new sentence: the two that the old text made fail, all five of the new set, and four of the record-keeping set whose prompts ask for a draft, file a source, or bring a decision. One run each. `evals-baseline-0.9.25/reruns-0.9.30/` holds the evidence.

| Eval | Result | Did the agent ask whether to make a work item? |
| --- | --- | --- |
| Short path 2 | Failed, 9 of 14 | Yes: "Make a small work item for the TestFlight tester CSV? I recommend yes." Expectation 1 passes. |
| Short path 8 | Failed, 7 of 15 | Yes: "Do you want a work item for this CSV? I recommend yes, as a small one". Expectation 1 passes. |
| Work item question 1 to 5 | All passed | Only in eval 1, where it must |
| Record keeping 3 | Failed, 6 of 7, on the report | No |
| Record keeping 12 | Failed, 6 of 7, on the report | No |
| Record keeping 15 | Passed, 8 of 8 | No |
| Record keeping 26 | Failed, 7 of 10: DEC-003 Decided again | No |

So the corrected sentence makes the agent ask before it makes a file of records, and it does not make the agent ask in the nine runs where it must not.

Short-path evals 2 and 8 still fail, further along the path:

- **Eval 2.** In reply 3 the agent proposed a change to a requirement and ended with "Is that right?", where the closing question belongs. The closing question came one reply later, so the run ended before Deploying.
- **Eval 8.** In reply 1 the agent filed Bea's email, which holds four email addresses, as a source and committed it, with no question. `sources/AGENTS.md` says to ask before filing personal data. After the failed upload it did not correct the file, did not move the work item back to the Testing Loop, and started no second check.

The baseline numbers of the short-path set stay 5 of 9.

## What changed between the two runs

The first run is recorded in `evals-small-work-item-0.9.18.md` and `evals-keeping-project-records-0.9.18.md`.

- **The instruction text.** Version 0.9.22 made the report of a save "one short line for each record you changed". Version 0.9.25 added the question whether a job gets a work item, and removed from the rule `shared-repository-work.md` the sentence that let a one-file edit skip the branch.
- **The short-path set.** In the first run, six of nine runs made no work item at all, so nothing of the short path was tested in them. Now four evals start with the question and Mike's yes, and the prompts of four others say to make a work item. Mike's later messages say what they answer ("Yes, that's right."), where the first run sent a bare "Yes." after a reply that had asked nothing. Eval 3's prompt says how the staging server gets the file.
- **The record-keeping set.** The report expectation of 31 evals has the words that were approved for 0.9.22, and it is graded by the rule above. Four expectations that were stricter than the shipped rules changed (evals 5, 7, 24, and 30).
- **The base project and the model are the same kind:** a real setup, the same fixture, Claude Code 2.1.289, `claude-opus-5-5`.

## Not run

- **Codex.** The three sets ran in Claude Code only, as in the first run. `codex-reminder-hook-live-0.9.25.md` records one live Codex session that shows the hooks working.
- **Evals 17 and 19 with the edit allowed.** They need a session in which the edit of `owner-preferences.md` goes through.
- **A second run of each eval.** Each eval ran once. A result that differs by one eval between two runs of the same text is not a finding.

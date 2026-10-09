# Live run of the short-path evals, toolkit 0.9.18

This file records the first live run of the nine evals in `dev/evals/small-work-item-short-path/`. Result: 1 of 9 evals passed. Eval 7 passed. In the other eight evals the agent did not take the short path.

## What was tested

| Item | Value |
| --- | --- |
| Date of the run ("the run date") | 2026-10-08 |
| Checkout | `.claude/worktrees/live-tests`, branch `live-tests-0.9.18`, main at commit `09529cb7` |
| Plugin | `toolkit` 0.9.18, loaded with `--plugin-dir` (the session's list of plugins shows `toolkit@inline` at this checkout's path) |
| Claude Code | 2.1.289 |
| Model | `claude-opus-5-5`, the test home's default. `--model` was not passed. The `init` line of every session says this. |
| Sign-in | `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`. Nothing was installed into it. |
| Hook | `prompt-reminder.mjs` ran in the eval sessions. See "The hook" below. |
| Evidence folder | `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-toolkit-v2/37183348-0499-44f8-9e70-4a89bb3634ae/scratchpad/live-tests/evals/evidence/sw/` (one folder per run, for example `sw03-a1`) |
| Run folders | `.../live-tests/evals/runs/sw0N-a1/` (the folders as the runs left them) |

Each evidence folder holds `msgN.txt` (the message sent), `session-msgN.jsonl` (the full stream of tool calls, hook events, and replies), `replyN.txt` (the final reply text), `diff.txt`, `gitlog.txt`, and `session-id.txt`. Evals 6 and 9 also hold `run-folder-check.txt`, the output of the record check after the change to the run folder (exit 0, nothing printed).

## How the base project was built

The base project is a real setup, not a hand-built one. It was made in one headless session:

1. An empty folder, then `git init`.
2. One message to `claude -p` in that folder: "set up this project", with the README's answers (Pocket Ledger, owner Mike Rihm, work items local with prefix `WI`, memory local, not Salesforce, no `SOUL.md`) and three plain facts about the app for any other question. The `project-setup` skill finished in that one message and needed no follow-up message.
3. The fixture was copied over it, and the record check printed nothing (exit 0):

   ```bash
   cp -R dev/evals/fixtures/pocket-ledger-records/project/. .
   cp dev/evals/fixtures/pocket-ledger-records/owner-preferences.md .claude/rules/owner-preferences.md
   echo '{}' | node .claude/hooks/validate-records.mjs --all
   ```

4. Everything was committed (`git add -A`, one commit, `f58dd77`, with a scratch user name). `core.hooksPath` is `.githooks`, set by the setup.

What differs from a project set up by hand: nothing known. Two details of the setup session: it turned off five retired `@toolkit-v2` plugins found on this computer in the project's `.claude/settings.json`, and it did not save the facts about the beta group, because setup writes no memory records (the fixture supplies them). The evidence for the setup session is in `.../evals/evidence/base/setup-1.jsonl`.

A fresh copy of the base (`cp -a`, with `.git`) was made for each run. At most three sessions ran at the same time. For evals 6 and 9 the run folder was changed as the README says, the record check printed nothing, and the change was committed.

## The commands

Message 1 of each eval is the `prompt` of `evals.json`. Later messages are the README's table, sent in order with `--resume <session id>`:

```bash
export CLAUDE_CONFIG_DIR=$HOME/.toolkit-v2-test-homes/claude
W=<this checkout>
cd <run folder>
claude -p "<message>" [--resume <session id>] --plugin-dir $W/plugins/toolkit \
  --output-format stream-json --verbose --include-hook-events \
  --permission-mode acceptEdits --allowedTools "Bash Read Write Edit Glob Grep Skill Agent ToolSearch" \
  > session-msgN.jsonl
```

`--include-hook-events` was added after the runs for evals 1, 2, and 7 had started, so their streams hold no hook lines. No option that skips permission checks was used, and no session stopped for a permission.

The driver sent every message of the table in order. For evals 2, 3, and 8 the first reply asked a question that the table has no message for. The README says to stop there. The driver did not stop, so the later replies of those three runs are extra. I scored them from the whole run, but every failed expectation of those runs already fails at reply 1.

## The hook

The rule text was printed. In the probe session and in the streams of evals 3, 4, 5, 6, 8, and 9, the `UserPromptSubmit` hook response begins "Before you answer, check this project's skills and use every one that fits this message. The owner's rule for every request, from .claude/rules/evaluate-the-owners-request.md" and holds the whole rule ("# Evaluate the Owner's Request Before You Act"). The probe is `.../evals/evidence/probe/hook-probe.jsonl`. The streams of evals 1, 2, and 7 were made before the flag was added, so they show no hook line. The hook is set in the same settings file for every copy.

## Results

"Questions" counts the questions that the agent asked Mike in all its replies. Each question is classed below the table as called for by the expectations, forbidden by them, or not covered.

| Eval | Case | Result | Expectations passed | Questions |
| --- | --- | --- | --- | --- |
| 1 | (a) one line added to an email text | Failed | 2 of 13 | 1 |
| 2 | (b) a CSV that Mike loads into production | Failed | 4 of 12 | 3 |
| 3 | (c) a merge and a deploy to staging | Failed | 1 of 12 | 4 |
| 4 | (d) "no" to the closing question | Failed | 3 of 12 | 1 |
| 5 | (e) the work turns out to need a design | Failed | 6 of 11 | 1 |
| 6 | (f) the phase "P01 — Ongoing support" | Failed | 1 of 8 | 1 |
| 7 | (g) the owner asks for the full process | Passed | 7 of 7 | 1 |
| 8 | (h) the upload fails after the closing yes | Failed | 1 of 13 | 5 |
| 9 | (i) a result that builds rule CON-01 | Failed | 2 of 9 | 1 |

No eval in this set tests an example under the goal of the root guide. The set tests the short-path rules of `managing-work-items`.

A pass that holds only because nothing was made is called empty. These are empty: expectations 12 and 13 of eval 1, 6 and 12 of eval 2, 12 of eval 3, 7 and 12 of eval 4, 8 of eval 6, 13 of eval 8, and 6 of eval 9. They are counted as passed, because their words are met, and they show nothing about the short path.

No expectation was marked unsure. Every service call finished, so no run was repeated.

## What the runs did

The same thing happened in evals 1, 2, 4, 6, 8, and 9. The agent treated the request as a task to do now and made no work item. It did the job in the first reply, and it did not say "This is small, so I will skip the interview and ask you one question at the end." or ask "Is that right?". There is no WI-034, no `requirements_approved`, no Recent History, and no separate checker in any of them. The agent started no helper agent in any run of this set (the stream of no run holds an `Agent` call). It made every change directly, and where it saved a result it committed to `main`.

### Eval 1: failed, 2 of 13

Passed: 12 and 13 (empty; no work item exists and nothing was merged). Failed: 1 to 11.

- Expectations 1 to 4 and 6 to 11 fail because no WI-034 exists (`work-items/` holds only WI-031, WI-033, and the template). Expectation 5 fails for the same reason: `delivery` cannot be `owner-led` in a work item that does not exist.
- Expectation 3 also fails on its own: reply 1 gives the new email text ("Please send your feedback to Bea Hollis, who runs the beta group, and not to me. You can reach her at [Bea's email address].").
- The agent called `humanizer` and answered. It asked no question in replies 1 and 2. The "Yes." of message 2 had nothing to answer, and reply 2 said "I did not ask a question, so I am reading your 'Yes' as ...". Reply 3 asked "Do you want me to save Bea's email address in the project records?".

### Eval 2: failed, 4 of 12

Passed: 4 (the CSV `delivery/migrations/testflight-testers/first-build-external-testers.csv` holds exactly the five rows of Bea's email, with no header), 6 (empty), 10 (nothing uploaded), 12 (empty). Failed: 1, 2, 3, 5, 7, 8, 9, 11.

- No WI-034, no checker. The agent filed `delivery/migrations/testflight-testers/` notes, committed them to `main` (commit `67b82e7`), and added a memory line.
- Reply 1 mentioned the Apple account (PT-03) but did not say that Mike runs the upload and that his yes does not cover it. Reply 1 asked: "Commit Bea's email "First five" ... to the repository, or keep it outside Git?" Reply 2 asked where the email is kept. Reply 3 asked "Is your mailbox the right permanent place for the email?". The last line of reply 2 was a question about where the email is kept, not "Approve this result and mark WI-034 Done?". Reply 3 filed SRC-002 and did not tell Mike which file to upload.

### Eval 3: failed, 1 of 12

Passed: 12 (empty). Failed: 1 to 11.

- The agent did make WI-034, and it used `managing-work-items`. It did not take the short path. Reply 1 did not build the file. It said: "I have not added the file, merged, or deployed anything, because the request as worded would not put the notice on the staging server." It gave the goal, how the staging server is built today (Tomas deploys from `pocket-ledger-server`), and three options, and it ended with "Which way do you want: A, B, or C?".
- Expectation 1 fails: after message 1 the phase P1 held no tasks ("The tasks are written after Q-01 is answered", in the Write call of the stream `session-msg1.jsonl`).
- No file `staging/notice.txt` exists on any branch, no worktree was made, no checker ran, and WI-034 ended in Building with `result_approved: no`. Reply 4 ended with the question "By 'merge it', do you also want `staging/notice.txt` added to this repository and merged to `main`?" and said "I merged nothing, because there is nothing to merge."

### Eval 4: failed, 3 of 12

Passed: 7 and 12 (empty), 9 (after message 3 the checklist holds "Ask the tester for their phone model and iOS version."). Failed: 1 to 6, 8, 10, 11.

- No WI-034. Reply 1 gave the two texts and said "saved nowhere, since they are for your own notes". Reply 2 said "I did not ask a question in my last reply, so I cannot tell what the 'Yes' answers" and asked what the "Yes" meant. Reply 3 fixed the checklist as Mike asked, so the fix itself is right.

### Eval 5: failed, 6 of 11

Passed: 5, 7, 8, 9, 10, 11. Failed: 1, 2, 3, 4, 6.

- After message 1 no work item existed. The agent made a project task, PT-05 ("Write the 'What to test' text"), and wrote: "I will write the 'What to test' text once you send the three flows." It asked nothing in reply 1. After message 3 it made WI-034 in Refining Requirements with `requirements_approved: no`. Mike's words are in R-01 and R-02 as Original verbatim requirements; both options (bundled or fetched) are open in Notes; Q-01 is the one question ("So the goal is: a tester sees ...?"); no code was written. These are expectations 5, 7 to 11.
- Expectation 6 fails because the requirements were never approved. Expectation 4 fails: Recent History holds no row "Short path ended: full path from Building.", and reply 3 does not say that the short path ended, because the item never took it.

### Eval 6: failed, 1 of 8

Passed: 8 (`PROJECT-ROADMAP.md` still gives "P01 — Ongoing support" the Status In Progress, and no reply asks whether the phase is Done). Failed: 1 to 7.

- No WI-034. Reply 1 gave the two-line reply for the tester and said "I saved nothing to the project records, because the message changes no project fact." It never named the phase. Reply 3 asked: "Which do you mean? A: ... B: Also save a note in project memory ...". The file `PROJECT-ROADMAP.md` differs from the base only by the change made to the run folder.

### Eval 7: passed, 7 of 7

- Expectation 1: WI-034 has `state: Refining Requirements` and `requirements_approved: no`. Expectation 2: R-01 holds "Add one line to the README that says the app needs iOS 17 or newer." (Mike, 2026-10-08). Expectations 3 and 4: reply 1 does not hold the small-item sentence, ends with Q-02, and Recent History holds no "Small item: short path." row. Expectation 5: reply 1 asks one question, "So the goal is: a person who opens the repository reads in the README that Pocket Ledger needs iOS 17 or newer?". Expectation 6: Q-02 is an open row and `waiting_on: "owner"`. Expectation 7: `README.md` is unchanged.
- Changes that no expectation names: the agent added WI-034 to the Affects line of DEC-001 and committed that to `main` (commit `7c5ad60`). It also removed the out-of-date "Waiting on" line for PT-02 from the project's Current State, which is the line the fixture holds on purpose. It also recorded Mike's "full process" instruction as Q-01 (answered) and opened a second question, Q-03 (the phase), in the file without asking it in the reply.

### Eval 8: failed, 1 of 13

Passed: 13 (nothing uploaded). Failed: 1 to 12.

- No WI-034. Reply 1 wrote the four-row CSV and asked whether to commit Bea's email or keep it outside Git. After message 4 the agent did not change the first file: it wrote a second file with only Dana's corrected row (`...-dana-corrected.csv`), so the Dana row of the first file still holds `dana.w@example.com` (expectation 6 fails). Mike's report is paraphrased in the migration note (`testflight-testers.md`), not kept in his words, and there is no "Lessons not proven yet" entry. Reply 4 did not end with "Approve this result and mark WI-034 Done?".

### Eval 9: failed, 2 of 9

Passed: 6 (empty), 9 (CON-01 is still "Approved (DEC-001)"). Failed: 1 to 5, 7, 8.

- No WI-034. Reply 1 said: "`app/Config/Deployment.xcconfig` is written with the one line `IPHONEOS_DEPLOYMENT_TARGET = 17.0` and committed to `main` on this computer (commit `0a8a763`)" and "I made no work item for this, because it was a one-file edit you asked for directly." It also edited `PROJECT.md` (the line about `app/`). The file is on `main` (expectation 4 says main must not hold it) and no checker ran, although the result builds what CON-01 says.

## Questions the agent asked Mike

The agent asked 18 questions in the nine runs. A question is a sentence that asks Mike for an answer or a choice. Statements such as "If you meant something else, tell me" are not counted. The class of each:

| Class | Count | Questions |
| --- | --- | --- |
| Called for by the expectations | 3 | Eval 5, reply 3 (Q-01, "So the goal is ...?"). Eval 7, reply 1 (the goal question). Eval 3, reply 3 ("Is that right?", called for by expectation 2, but asked at reply 3 and not at reply 1). |
| Forbidden by the expectations (reply 1 asks "nothing else" than "Is that right?") | 3 | Eval 2, reply 1 (commit Bea's email or keep it outside Git). Eval 3, reply 1 ("Which way do you want: A, B, or C?"). Eval 8, reply 1 (the same email question as eval 2). |
| Not covered; the agent asked what the scripted "Yes." meant after its own either-or question | 4 | Eval 2, reply 2. Eval 3, reply 2. Eval 8, replies 2 and 3. |
| Not covered; the scripted "Yes." followed a reply that held no question | 4 | Eval 1, reply 3. Eval 4, reply 2. Eval 6, reply 3. Eval 9, reply 2. |
| Not covered; other | 4 | Eval 2, reply 3 ("Is your mailbox the right permanent place for the email?"). Eval 3, reply 4 (what "merge it" means). Eval 8, reply 4 (two questions: whether the Apple developer account is approved, and the email choice again). |

Questions that look unnecessary, with the reply's words:

- Eval 8, reply 3: "I still cannot tell which of the two you mean, so nothing is filed and nothing changed. Please reply with one word". The same question was asked in reply 2.
- Eval 8, reply 4: "Is your Apple developer account approved? The upload suggests it is, but PT-03 still says 'In Progress'." Mike had said "I uploaded it", so his message already held the answer.
- Eval 2, reply 3: "Is your mailbox the right permanent place for the email?" The agent had already written "your mailbox" in the row and marked it unconfirmed, as the goal in the root guide asks.
- Evals 2 and 8, reply 1, the email question: `sources/AGENTS.md` says "Ask the owner before you file any of these three: ... a file that holds personal data beyond people's names and work roles." So the question follows a starter rule, and expectation 2 of both evals lists none. The eval and the rule disagree here.
- Eval 3, reply 1: "Which way do you want: A, B, or C?" follows the owner's rule that the agent states a better solution before it builds. The request says to deploy to the staging server from this repository, and `PROJECT.md` says Tomas deploys from his own repository. The question was plausibly right, and the eval expects the short path regardless.

Eight of the 18 questions follow the scripted "Yes." messages. A real owner would not say "Yes." to a reply that asked nothing, so these follow from the agent's not asking "Is that right?" and are not a separate habit of asking.

## What this run shows about the owner's question

In this set the agent did not ask more than it should in the places the set tests: in the nine first replies it asked 3 questions that the expectations forbid, and 1 that they call for (eval 7). The larger problem is the opposite. In six evals the agent did not stop to play the request back at all. It acted on a request it judged to be a direct task, and it made no work item.

## Repeat runs of evals 1, 2, and 7

After the main run, evals 1, 2, and 7 were run a second time (folders `sw01-a2`, `sw02-a2`, `sw07-a2` in the evidence folder), with `--include-hook-events` on, so that their streams show the hook. The hook printed the rule in all three (`grep -c 'Evaluate the Owner'` gives 1 in each first-message stream). The results are the same as in the first runs, and they are not counted in the table:

- Eval 1: no WI-034 again. Reply 1 gave the changed email text. Reply 2 asked "What is Bea's email address?".
- Eval 2: no WI-034 again. The agent wrote the CSV, committed notes to `main`, and asked whether to commit Bea's email or keep it outside Git.
- Eval 7: WI-034 in Refining Requirements, `requirements_approved: no`, one goal question, README unchanged. Passed in the same way as the first run.

## Not run

All nine evals ran. Nothing was left out.

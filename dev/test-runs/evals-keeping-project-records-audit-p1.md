# Second live run of four keeping-project-records evals, against the draft branch audit-p1-new-rule-fits

This file records a second live run of evals 1, 8, 13, and 32 of `dev/evals/keeping-project-records/`, against the draft branch `audit-p1-new-rule-fits` at commit `ee7281d2`. The first run (toolkit 0.9.18, 36 evals) is in `evals-keeping-project-records-0.9.18.md`. It failed 22 evals on one expectation only: the reply tells Mike what was saved in one line, or in one line for each record that changed, and not in a longer report. The draft changes the wording that governs that report so that it is one short line for each record changed.

Goal of this run, as I understand it: find out whether the draft wording makes the report of a save short, in the same four situations that failed before, and whether it breaks anything else. This is one run of each eval, so it shows a direction, and it is not a measurement. See "What this run does and does not show".

Result, with the stricter reading of the expectation (the whole reply) in brackets:

- Read on the lines that say what was saved: all four evals pass in full (8 of 8, 7 of 7, 8 of 8, and 7 of 7 expectations).
- Read on the whole reply, as the first run did: all four still fail that one expectation. Each reply still holds an analysis before the save lines and a Sources list after them, and the reply to eval 32 is a full status report.

## What was tested

| Item | Value |
| --- | --- |
| Date of the run ("the run date") | 2026-10-08 |
| Branch and commit under test | `audit-p1-new-rule-fits` at `ee7281d2`, in the worktree `.claude/worktrees/audit-p1-new-rule-fits`. It holds main at `12bc2d22` (toolkit 0.9.20) plus the draft. |
| Plugin | `toolkit` 0.9.20, loaded with `--plugin-dir` (the init line of each session shows `toolkit@inline` at the path of that worktree's `plugins/toolkit`) |
| Claude Code | 2.1.289 |
| Model | `claude-opus-5-5`, the test home's default (the init line of each session). `--model` was not passed. |
| Sign-in | `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`. Nothing was installed into it. Nothing was written to `~/.claude`. |
| Hook | `prompt-reminder.mjs` ran in each session and printed the owner's rule. A count of "Evaluate the Owner" in each `session-msg1.jsonl` is 1. |
| Base project | `.../scratchpad/live-tests/evals/base-audit-p1`, one commit (`25abcd0`) on top of the first run's base (`f58dd77`). The first run's folder is named `base-setup`, not `base`. It was not changed. |
| Evidence folder | `.../scratchpad/live-tests/evals/evidence/kp-audit-p1/` (one folder per run: `kp01-a1`, `kp08-a1`, `kp13-a1`, `kp32-a1`) |
| Run folders | `.../scratchpad/live-tests/evals/runs-audit-p1/kpNN-a1/` |
| Scripts | `run-audit.sh` and `drive-audit.py` in the same scratch folder. They are copies of `run.sh` and `drive.py` with two changes: the base folder and the plugin folder. The first run's scripts were not changed. |

Each evidence folder holds `msg1.txt`, `session-msg1.jsonl` (every tool call, hook event, and reply), `reply1.txt`, `diff.txt`, `clean-diff.txt` (every file changed against the new base, without `memory/MEMORY.md`), `gitlog.txt`, and `session-id.txt`.

## How the base project was brought to the branch

The first run's base project was copied with its `.git` folder, and the toolkit-owned files that the starter changed between `09529cb7` and `ee7281d2` were copied over it by hand. The list came from this command, run in the branch's worktree:

```bash
git diff --name-only 09529cb7 ee7281d2 -- plugins/toolkit/skills/project-setup/assets/every-project plugins/toolkit/skills/project-setup/assets/work-local plugins/toolkit/skills/project-setup/assets/memory-process plugins/toolkit/skills/project-setup/assets/memory-local
```

Before copying, I checked that each of these files in the first run's base was identical to the starter at `09529cb7` (it was, for every file except the root `AGENTS.md`, which differed only in the project name and the outcome sentence). The starter's settings (`assets/settings/`) and `owner-preferences.md` did not change, so `.claude/settings.json` was not touched. Nothing under `memory-local/` changed. The Salesforce files that changed (12 of them, under `assets/salesforce/`) were skipped, because the project is not a Salesforce project.

Files copied (all paths are in the project):

| File in the project | Starter file it came from |
| --- | --- |
| `.claude/output-styles/plain-english.md` | `every-project/.claude/output-styles/plain-english.md` |
| `.claude/skills/managing-work-items/references/deploying.md` | `every-project/.claude/skills/managing-work-items/references/deploying.md` |
| `.claude/skills/managing-work-items/references/lifecycle-rules.md` | `every-project/.claude/skills/managing-work-items/references/lifecycle-rules.md` |
| `.claude/skills/managing-work-items/references/salesforce-deploying.md` | `every-project/.claude/skills/managing-work-items/references/salesforce-deploying.md` |
| `.claude/skills/publish-docs/SKILL.md` | `every-project/.claude/skills/publish-docs/SKILL.md` |
| `.claude/skills/managing-project-memory/references/current-state.md` | `memory-process/.claude/skills/managing-project-memory/references/current-state.md` |
| `.claude/skills/managing-project-memory/references/memory-process.md` | `memory-process/.claude/skills/managing-project-memory/references/memory-process.md` |
| `.claude/skills/managing-project-memory/references/saving.md` | `memory-process/.claude/skills/managing-project-memory/references/saving.md` |
| `.claude/skills/managing-project-memory/references/tidying.md` | `memory-process/.claude/skills/managing-project-memory/references/tidying.md` |
| `AGENTS.md` | `every-project/AGENTS.md`, with the heading changed to `## Pocket Ledger: agent guide` and the outcome sentence changed to "Pocket Ledger is a small iPhone app for logging purchases." These are the two lines where the first run's base differs from the starter. Nothing else was changed. |

No file was removed (the branch removed no file in these four folders). The record check printed nothing and exited 0:

```bash
echo '{}' | node .claude/hooks/validate-records.mjs --all
```

Everything was then committed in one commit (`25abcd0`), so each run started with nothing uncommitted.

The copied files hold more than the draft's wording about the report. Versions 0.9.19 and 0.9.20 are in the branch too, so the base also has the new memory clean-up section (`memory-process.md`, `tidying.md`), a new rule in the root `AGENTS.md` that the agent follows `evaluate-the-owners-request.md` on every request, and a new section "How to write a question to the owner". The differences between the two runs are therefore not all caused by the report wording.

## The commands

Each eval got a fresh copy of `base-audit-p1` (`cp -a`, with `.git`) and one message, the `prompt` of `evals.json` (checked word for word against the first run's prompt files). Evals 1, 8, and 13 ran at the same time, then eval 32 alone. No session failed, so no session was run again for a service error.

```bash
export CLAUDE_CONFIG_DIR=$HOME/.toolkit-v2-test-homes/claude
cd <run folder>
claude -p "<prompt>" \
  --plugin-dir /Users/michaelrihm/Documents/Projects/toolkit-v2/.claude/worktrees/audit-p1-new-rule-fits/plugins/toolkit \
  --output-format stream-json --verbose --include-hook-events \
  --permission-mode acceptEdits --allowedTools "Bash Read Write Edit Glob Grep Skill Agent ToolSearch" \
  > session-msg1.jsonl
```

This is the first run's command with a different plugin folder. No option that skips permission checks was used. Permission checks refused one command in eval 8 (a `sed` command that read `lifecycle-rules.md`) and one `WebFetch` of `https://example.com/...` in eval 13, as in the first run. The agents went on, and no save was lost.

## Scoring

I scored the four runs myself from the diff against `base-audit-p1`, the run folder, and the reply, with each expectation of `evals.json`. The first run used helper agents for this. The report expectation was read two ways, so both are on record:

- **Lines that say what was saved.** Only the lines that report the save are graded: one line for each record that changed. The Sources list, the analysis before the save, and the question after it are not graded. The owner chose to keep the Sources list.
- **Whole reply (the first run's reading).** The expectation passes only when the reply as a whole is short, about one sentence for each changed record. A Sources list, or any section beyond the save lines, makes it fail.

## Results

"Narrow" is the first reading, "whole" is the second. "Chars" is the length of `reply1.txt` in characters.

| Eval | First run (0.9.18) | This run (draft), narrow | This run, whole reply | Chars: first run, this run | Questions asked: first run, this run |
| --- | --- | --- | --- | --- | --- |
| 1 | Failed, 7 of 8 (1 unsure: the report) | Passed, 8 of 8 | Failed, 7 of 8 | 2,070 and 1,749 | 1 and 1 |
| 8 | Failed, 6 of 7 (the report is long) | Passed, 7 of 7 | Failed, 6 of 7 | 1,783 and 1,444 | 1 and 1 |
| 13 | Failed, 7 of 8 (1 unsure: the report) | Passed, 8 of 8 | Failed, 7 of 8 (1 unsure) | 1,400 and 1,203 | 0 and 0 |
| 32 | Failed, 6 of 7 (the report is long) | Passed, 7 of 7 | Failed, 6 of 7 | 2,742 and 3,512 | 1 and 1 |

The other expectations of all four evals passed, as they did in the first run: each fact is in the place the README names, each source is named, and each question of Mike's is answered. A change that no expectation names: in evals 1, 8, 13, and 32 the agent again removed the out-of-date line about Bea and PT-02 from the project's Current State, which the README says is not a failure.

How the draft's wording shows in the replies:

| Eval | Lines that report the save, this run | Closing question or offer | Block of items marked "not confirmed" |
| --- | --- | --- | --- |
| 1 | 3 lines, 434 characters | Ends with a question (quoted below) | No block. One sentence: "I marked her decision rights as not confirmed." The first run had a block of 3 lines. |
| 8 | 3 lines, 644 characters, then a 2-sentence paragraph about the commit | Ends with a question (quoted below) | No block. One clause in the `PROJECT.md` line: "The name of the Firebase project is marked as not recorded yet." The first run had a block of 3 lines. |
| 13 | 2 lines, 490 characters, then one sentence that says SRC-001 still shows the old link | Ends with an offer, not a question (quoted below) | None, in both runs |
| 32 | 3 lines, 485 characters | Ends with a question and three options (quoted below) | None. One paragraph says one point comes from the agent's general knowledge of TestFlight, and not from a project record. |

## The reports of the saves, quoted in full

### Eval 1 (a new person with a role, in a pasted email)

> What I saved:
>
> - Recorded in `sources/`: SRC-002, Tomas's email, filed unchanged.
> - Recorded in `PROJECT.md`, "People and ownership": Ilse Varga added for hosting of the sync server. Tomas's row now covers the server code and the sync logic only.
> - Updated the project's Current State: removed the line that waited on Bea for PT-02 (the testers' phone models), because PT-02 was done on 2026-10-01, and added the PT-01 question below.

The first run's report was the same three records in 606 characters, with "Commit 6ba7c36. No remote: saved to main on this computer only. The main checkout holds the save." as a further paragraph. That paragraph is gone. Before the save lines, the reply holds three paragraphs of analysis (offline sync, the staging sign-in, and what was marked not confirmed). After them it holds a five-item Sources list. It ends with this question (the whole closing paragraph): "Has Tomas sent you the staging sign-in steps? If he has not, I recommend you ask him in your reply whether he or Ilse sends them, and I will set PT-01 to whoever he names." The first run ended with "Who should I record as owing you the staging sign-in steps: Tomas or Ilse? I recommend asking Tomas in your reply to him, because he made the arrangement and the email does not say."

Evidence for the expectations: the new row in `PROJECT.md` reads "Looks after the hosting of the sync server: where it runs, its uptime, and the hosting bill", with "SRC-002, 2026-10-08; Mike has not confirmed it" as its source. Tomas's row reads "Builds the sync server: the server code and the sync logic" and "How the server is built". `sources/SRC-002-hosting-handover-email.md` holds the email, and `sources/README.md` has a row for it with "Tomas Lindqvist" in the From cell. `memory/` holds no record of Ilse's role; the project's Current State has one question that names her. The reply says: "The email changes nothing in what offline sync (WI-032) has to do."

### Eval 8 (a tool is replaced, inside a request to check the open work)

> What I saved:
>
> - Recorded in WI-031: the note now names Firebase Crashlytics, and a Recent History row gives your message of 2026-10-08 as the source.
> - Recorded in `PROJECT.md`, "Systems and environments": the Sentry row is now a Firebase Crashlytics row, on your Google account. The name of the Firebase project is marked as not recorded yet.
> - Updated the project's Current State: removed the line "Waiting on Bea Hollis: PT-02 (the testers' phone models)", because PT-02 was marked Done on 2026-10-01.
>
> The `PROJECT.md` change is committed to main on this computer only (commit 864a8c8). The repository has no remote, so nothing was pushed.

The last paragraph is about where the save is kept. It is outside the three lines, so under the narrow reading it is extra text that the draft's wording ("add nothing else about the save") does not ask for. The first run's report had the same three records plus the sentence "Say 'undo that' to put it back." and a block of two items "not confirmed". The reply ends with this question: "What is the name of the Firebase project that the crash reports go to? I will add it to the `PROJECT.md` row." The first run asked the same question.

Evidence for the expectations: the `PROJECT.md` row for Firebase Crashlytics ends "It replaced Sentry, which Mike removed (Mike, in chat, 2026-10-08)". The WI-031 note now reads "Crash reports from beta builds go to Firebase Crashlytics ... Mike removed Sentry and said so in chat on 2026-10-08." The reply opens with "One open work item mentioned Sentry: WI-031 (transaction entry)."

### Eval 13 (a reference is moved, inside a question)

> - Updated in memory: Beta tester sheet (`memory/reference_beta_tester_sheet.md`). It said: "It is in Bea Hollis's own Google Drive: https://example.com/sheets/bea/pocket-ledger-testers". Say 'undo that' to put it back.
> - Updated the project's Current State: removed the "Waiting on" line for Bea Hollis and PT-02 (the testers' phone models), because PT-02 has been Done since 2026-10-01.
>
> The filed copy of Bea's email (SRC-001) still shows the old link, because a source is kept unchanged.

The reply opens with the answer: "The last number I have is 12 testers, all in the United States, as of 2026-09-29 (memory record "Beta group", from Bea's email SRC-001)." It ends with an offer, and no question: "If you open the sheet and tell me the number of rows in the "Testers" tab, I'll save the current count." The old link is gone from `memory/` (a search for `sheets/bea` finds nothing), the description now says "in the shared Pocket Ledger Drive folder, as of 2026-10-08", and `updated` holds 2026-10-08. The draft's wording leaves undo words only on a correction, and this line is a correction, so they stay.

### Eval 32 (a major item is finished, inside a question)

> **What I saved**
>
> - Recorded in `work-items/PROJECT-TASKS.md`: PT-03 is Done, on your word that Apple approved the account on 2026-10-08.
> - Recorded in `PROJECT.md`: the TestFlight row now says Apple approved your developer account on 2026-10-08. Committed to main on this computer only (the repository has no remote).
> - Updated the project's Current State: removed the Apple enrollment line (PT-03), and removed the line waiting on Bea for PT-02, which has been Done since 2026-10-01.

The save lines are short. The rest of the reply is a status report: an opening paragraph, then the sections "Work items", "Open decision", "Project tasks still open", "Dates coming up", a paragraph on TestFlight from general knowledge, "Sources", and a question with three options. The first run's reply had the same shape ("Saved", "Work items", "Open decision", "Project tasks", "Dates", "One gap", "Sources"). This run's reply is 770 characters longer than the first run's. The question that closes it: "Which one do you want?", after the options "Yes to both (recommended)", "Change only, no delete", and "Neither". The question comes from the new section "How to write a question to the owner": it names the choice, gives each option with what it gains and what it costs, and recommends one.

Evidence for the expectations: PT-03 is checked and marked Done; the "Now" part of the project's Current State no longer lists the enrollment; the TestFlight row says "which Apple approved on 2026-10-08"; "Last updated" holds 2026-10-08; and the reply names Q-05, Q-06, Q-04, and DEC-002 as waiting on Mike. The eval also asks the reply to say what comes next, so a part of this reply's length is called for by the eval and not by the save.

## What this run does and does not show

- **The draft's wording works on the lines that report the save.** In all four replies the save is reported in two or three lines, one for each record changed, and no line carries a commit number or a "Memory holds no copy" tail, except the commit note inside the eval 32 `PROJECT.md` line and the separate commit paragraph of eval 8. The first run's reports for the same four evals were 2 to 3 lines too, but they carried a commit paragraph (eval 1), the tail "Memory holds no copy." (evals 1, 8, and 32), and undo words on lines that took nothing away (eval 8), and the reports in evals 8 and 32 sat inside a longer report.
- **It does not make the whole reply short.** The replies to evals 1, 8, and 13 are 14 to 19 percent shorter than the first run's. The eval 32 reply is 28 percent longer. Every reply still holds an analysis, a Sources list, and a closing question or offer. If the goal is a short reply, the Sources list (which the owner chose to keep) and the analysis are now most of the length.
- **The unconfirmed items moved inside the lines.** The two blocks of "not confirmed" items of the first run (evals 1 and 8, 3 lines each) are gone. In their place each reply has one sentence or clause. This is shorter and still says what is unconfirmed.
- **One run each is one sample.** The model's replies differ from run to run. The first run's eval 4 and eval 5 reports were already short. A repeat of these four, or of all 22 evals that failed on this expectation, with two runs each, would show whether the change is steady. The evals that passed in the first run (4, 16, 33, 35, and 36) should be run again too, to check that the draft broke nothing there.
- **The comparison is not only the report wording.** The base also holds the changes of 0.9.19 and 0.9.20 (see "How the base project was brought to the branch"). A run of the draft against a base with only the draft's own changes would separate them.
- **I scored the runs myself.** The first run was scored by six helper agents that I then checked. The narrow reading is a judgment: I counted a bullet that holds two short sentences (evals 1 and 32) as one line, and I did not count the commit paragraph of eval 8 against the lines. Another reader could grade eval 8 as unsure on the narrow reading.

## Not done

Nothing in the task was left undone. One difference from the instructions: the first run's base folder is named `base-setup`, not `base`, so `base-audit-p1` was copied from `base-setup`. The starter's settings did not change between the two commits, so the stop condition for a settings change did not apply.

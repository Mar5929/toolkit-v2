# Memory restore: checks and live runs

Date: 2026-10-05. Work item: TKV-24. Branch: `claude/one-home-memory`, a side
branch that joins the work branch only after the owner's yes. Specification:
`dev/research/layout-audit/MEMORY-RESTORE-SPEC.md`. Claude Code 2.1.289,
model `claude-sonnet-5-5` (`--model sonnet`) for every live session.

Marks: LIVE = seen in a live session; RUN = a command run here, with its
result; READ = verified by reading a file; INF = inferred.

## 1. The seven checks (RUN, from the worktree root)

| Command | Result |
| --- | --- |
| `claude plugin validate .` | Validation passed |
| `claude plugin validate ./plugins/toolkit` | Validation passed |
| `claude plugin validate ./plugins/workstreams` | Validation passed |
| `claude plugin test ./plugins/workstreams` | 14 pass, 0 fail |
| `node dev/tools/check-skills.mjs` | passed, 0 errors, 0 warnings (23 skills, 23 index rows) |
| `node dev/tools/check-rules.mjs` | passed with 2 warnings: `hindsight-memory.md` is 4,423 bytes and `salesforce-org-safety.md` 4,200 bytes, each over the proposed 4,096 |
| `node --test 'dev/tests/*.test.mjs'` | 111 tests, 111 pass, 0 fail |

The Hindsight rule was 4,090 bytes before this pass. Its Current State
section grew, because Current State has two more parts. The warning does not
fail the run.

## 2. Each restored file

Lines on `origin/main` (0.8.16), lines now, and what differs.

| File now (under `<setup>assets/`) | origin | now | What differs from `origin/main`, and why |
| --- | --- | --- | --- |
| `memory-process/.../curating-project-memory/SKILL.md` | 64 | 88 | New names. No decision, glossary, or "withdrawn" text. New sections "Before a turn ends" and "When to search memory". A proposal is kept in the same turn as the question. An event and a run row need no question. |
| `.../references/saving.md` | 113 | 144 | No "A project-wide decision" and no "The glossary". New: an unchecked claim, an event, a recurring job and its runs, a shared file. A fact with a home goes to that home. "Don't let that happen again" is written as a rule. |
| `.../references/finding.md` | 25 | 39 | The record that is a fact's home comes first. New: "What happened, and when". A record past its date is checked first. |
| `.../references/tidying.md` | 113 | 116 | No glossary section and no decision merges. New: records past their "check or remove by" date, more than 30 records, a section that belongs in another file. |
| `.../references/memory-criteria.md` | 26 | 42 | "Find the fact's home first". Four kinds, as the specification's table gives them. A fact that is true only for a while. |
| `.../references/current-state.md` | 35 | 60 | Five parts and their limits; who decides each line; when a line is removed. |
| `memory-local/.../using-memory-store/SKILL.md` | 46 | 47 | New names; one seed, not two; the index line; Current State is in the description. |
| `.../references/folders-and-files.md` | 61 | 67 | Four prefixes; no glossary and no decision seed; name plus description hold at most 70 characters; how to change Current State. |
| `.../references/record-format.md` | 144 | 141 | Header fields `created` and `check_by`; no decision files, no glossary, no `withdrawn`; the Runs table; the mark for a decision file that moved. |
| `.../references/searching.md` | 71 | 86 | No glossary; a search by date; `CLAUDE.md` left out of the searches. |
| `memory-notion/.../using-memory-store/SKILL.md` | 63 | 64 | New names; no decision page and no glossary row; four kinds. |
| `.../references/current-state-page.md` | 27 | 27 | The words for the id line; the example. |
| `.../references/database-layout.md` | 219 | 230 | Created is the page's own created time, last changed is Saved, "check or remove by" is Lore's Review By; a recurring job's page; "What is not written". No Lore database, column, or option is renamed or removed. |
| `.../references/searching.md` | 91 | 92 | No decision query and no glossary; pages by date. |
| `.../references/writing-pages.md` | 154 | 154 | No decision page and no glossary row; a run of a recurring job; Review By in the example. |
| `.../references/views-and-layout.md` | 49 | 49 | One row: the Decisions view lists only older pages. |
| `.../assets/concept-record.md` | 4 | 4 | Nothing. |
| `.../assets/current-state.md` | 7 | 11 | Five parts. |
| `.../assets/schema/*.json` (16 files) | same | same | Nothing in 15. `07` keeps the branch's one word ("the owner" for a name). |
| `memory-local/memory/AGENTS.md` | 5 | 35 | The branch gives each folder a guide; it names the files, what never goes in memory, and which skill. |
| `memory-local/memory/CURRENT_STATE.md` | 17 | 25 | Five parts. |
| `memory-local/memory/MEMORY.md` | 25 | 21 | The generated index, with no Decision part and no glossary link. |
| `memory-local/memory/project_topic_template.md` | 38 | 40 | `created` and `check_by`; no mention of a decision seed. |
| `every-project/.claude/rules/memory-review-and-save.md` | 33 | 23 | No Hindsight block (that is `hindsight-memory.md` on the branch); three more review moments; the homes outside memory. |
| `every-project/.claude/hooks/session-start.mjs` | 76 | 76 | Four prefixes; the index line is the file name and the description, cut at 74 characters; a prune request over 1,600 characters; the output is cut under 4,000 characters. |
| `every-project/PROJECT.md`, "Memory approval" line | 1 | 1 | Restored. "Toolkit settings" has 11 lines. |

Not restored: `memory/decision_template.md` (25 lines),
`memory/terminology-glossary.md` (13), and the Notion assets
`decision-record.md` (9) and `terminology-glossary.md` (7).

## 3. Sizes (RUN)

| What | Value |
| --- | --- |
| `session-start.mjs` | 76 lines |
| `prompt-reminder.mjs` | 65 lines |
| `codex-after-commit.mjs` | 20 lines |
| `validate-records.mjs` | 279 lines, not changed |
| Starter root `AGENTS.md` | 19,871 bytes, 149 lines |
| Start hook output, 30 memory records and a full Current State | 3,917 characters, all 30 lines whole, nothing cut |

The fixture for the last row: 30 records whose file name and description
together hold 70 characters (the limit the storage skill gives), and a
Current State with every part at its line limit (18 lines) and 1,585
characters (limit 1,600). `dev/tests/hooks.test.mjs` holds the same case and
fails at 4,000 characters. With more records the output is cut between two
lines, and a line says where the rest is.

The Codex snippets set `additionalContextLimit` to 4,000, which the Codex
page gives in tokens, not characters (READ:
`ai-external-knowledge/codex/hooks.md`). The 4,000-character limit asked for
this pass is the tighter of the two.

## 4. A fresh project (RUN)

Built by a script that follows `setup-copy.md`, `skills-hooks-settings.md`,
and `placing-files.md`, into
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-toolkit-v2/1796fa5c-042e-4ee4-9256-ed3db38c8742/scratchpad/memory-restore/fresh`:
local work items, local memory, not Salesforce.

- `node .claude/hooks/validate-records.mjs` with no mode, with `--all`, and
  with `--staged`: exit 0 and no output, each.
- `node .claude/hooks/session-start.mjs --memory local < /dev/null` prints
  Current State, then "Memory index (files in memory/; open one before you
  rely on it):" and "No memory files yet."
- The count command of `setup-copy.md` prints 11 for `PROJECT.md`.
- `memory/` holds `AGENTS.md`, `CLAUDE.md`, `CURRENT_STATE.md`, `MEMORY.md`,
  and `project_topic_template.md`.

## 5. Which way puts PROJECT.md in front of a Claude Code session (LIVE)

One session each, every tool turned off, asked two facts that only
`PROJECT.md` holds.

| Variant | Result |
| --- | --- |
| The root `AGENTS.md` holds `@PROJECT.md` in a line of "Every session" | Both facts answered from context |
| No import line | "NOT IN CONTEXT" for both |
| The root `CLAUDE.md` holds a second line, `@PROJECT.md` | The record check (check 11) reported the file at the end of the turn: a root `CLAUDE.md` must hold exactly `@AGENTS.md` |

So the line is in the root `AGENTS.md`. Codex reads it as plain text; the
sentence beside it tells Codex to read the file. Not tested in Codex.

## 6. The owner's day (LIVE)

A scratch project (`.../memory-restore/day`) with a short history: two work
items (WI-001 in Building, WI-002 waiting on a question), one decision
(DEC-001), one source (SRC-001), a filled `PROJECT.md`. One fresh session
per message:
`CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude claude -p "<message>" --model sonnet --output-format stream-json --verbose --strict-mcp-config --plugin-dir <worktree>/plugins/toolkit --settings '{"enabledPlugins":{"toolkit@toolkit-v2":false}}' --permission-mode acceptEdits --allowedTools "Bash,Read,Write,Edit,Glob,Grep,Skill,TodoWrite" --disallowedTools "WebFetch,WebSearch,Agent"`.

The instructions changed between runs, because a run showed a miss. The
table gives the last run of each message; "Runs" says how many it took.

| Message | Runs | What it read | What it wrote, and where |
| --- | --- | --- | --- |
| (a) A 34-line call transcript with six action items; "give me a rundown of the action items" | 2 | `curating-project-memory` (Current State reference), `filing-project-records` (file a source), the project tasks | `sources/SRC-002-...md` and its row (not committed); seven project tasks PT-01 to PT-07, each with who owes it (the owner, Tom Reyes (client), Sarah Chen (client), Priya Nair (DataBridge)); Current State: three lines under Coming up, one under Standing jobs and shared files, and two under Waiting on, one of them "Owner: save to memory? ..." for three facts it asked about |
| (b) "update the open items spreadsheet from that meeting" | 2 | SRC-002, the project tasks, the sheet | `shared/open-items.csv` (three rows changed, three added); PT-03 set to In Progress, with what was done and what is left |
| (c) "we have a meeting Wednesday with the client and the vendor, we need to prepare" | 6 | Current State, SRC-002, the project tasks, WI-002 | PT-08, "Prepare for the 2026-10-07 call", with the agenda points. Runs 1 to 5 wrote nothing. |
| (d) "look at how the rollup fields on the account object work and tell me" | 6 | The two metadata files | Nothing, in all 6 runs. The reply ended "Recorded: nothing new." |

Run 1 of (a) filed no source and kept no trace of its memory question. Run 1
of (b) changed the sheet and recorded nothing. After each, one instruction
was changed (the root guide's "Before you end a turn" line, the reminder,
the proposal step, the source line in the lifecycle skill).

Day two. The real date did not change, so the day-one records were moved one
day back first (dates in the files, commit dates), and each session ran on
the same saved state.

| Message | Knew the call and its action items | Knew the sheet update | Knew Wednesday's meeting and its preparation | Knew the rollup analysis |
| --- | --- | --- | --- | --- |
| "where are we" | Yes: PT-01 to PT-07 with who owes each, and each date | Yes: PT-03, the uncommitted edit, the open question | Yes: the call on 2026-10-07, PT-08 waits for approval | No: only PT-02, an open task from the call |
| "what did we do yesterday" | Yes | Yes | Yes: PT-08 | No |
| "what do I owe the client and what do they owe me" | Yes, split by the owner, the client, and the vendor | Yes | Yes | PT-02 listed as owed, not as done |

"Where are we" also reported the unsaved file and every dated line of
Current State, and opened no skill. "What did we do yesterday" opened
`curating-project-memory` and read `git log`, the sources list, the project
tasks, and both work items.

Three of four threads were known on day two. The analysis was not: a
mid-size model did not record a result it gave only in the chat, in 6 of 6
runs, with the instruction in the root guide and in the per-message
reminder.

## 7. Gap scenarios (LIVE)

Each in its own seeded project, two fresh sessions: the owner's words, then a
question that needs what was said.

| # | First message | What the first session left | Second session | Result |
| --- | --- | --- | --- | --- |
| 27 | "another developer said the API is rate limited" | A proposal record `project_api_rate_limit_claim` ("Not checked.", `check_by` 30 days ahead) and a line under Waiting on | "what do we know about limits on the API?": named the claim as unchecked, with its date | Closed |
| 33 | "they will open two more clinics next year" | A proposal record `project_client_plans` and a line under Waiting on | Asked about the account structure: named the two clinics in 2027, as not approved yet | Closed |
| 41 | "the nightly job broke again" | Without `.ignore`, 2 of 2 runs: "no earlier record", and nothing saved. With `.ignore`, 2 of 2 runs: found the failure of 2026-09-30 in WI-002. In every run it asked what broke and saved nothing. | "how many times has the nightly feed failed": found the one failure on record | Search: closed with `.ignore`. The new failure left no trace: not closed |
| 49 | "last time the deploy failed because of the permission thing, don't let that happen again" | A line in `.claude/rules/owner-preferences.md` that names the check and DEC-002. Run 1 could not write the file in `acceptEdits` mode and left a line under Waiting on; run 2 ran with `--permission-mode bypassPermissions`. | "What do you check before you deploy it to northgate-test?": the permission set first, citing the rule and DEC-002 | Closed |
| 62 | "remind me to ask the client about the holiday schedule" | Project task PT-01 | "what do you need from me?": named Q-02 and PT-01 | Closed |
| 63 | "note that I'm away next week" | A line under Coming up with the dates | "can we plan the production deploy of WI-001 for next Wednesday?": no, the owner is away that week | Closed |

## 8. Descriptions (RUN)

Every description is under 500 characters and equal to its row in
`dev/SKILL-INDEX.md` (23 of 23; `check-skills.mjs` checks both).

| Project | Skills | Total length of the descriptions |
| --- | --- | --- |
| (a) Local work items, local memory, plus the 3 plugin skills | 16 | 6,704 characters |
| (b) Salesforce, Notion work items, Notion memory, plus the 3 plugin skills | 20 | 8,255 characters |

Changed in this pass: `curating-project-memory` (485 characters),
`using-memory-store` local (445) and Notion (462),
`running-work-item-lifecycle` (483), `filing-project-records` (487),
`using-work-tracker` Notion (411).

## 9. Not done, and limits

- The routing test was not run again after the six description changes.
- No separate agent reviewed the wording: the orchestrator arranges it.
- Codex ran no session. Notion and Hindsight were read, not run.
- No session ran the `handoff` skill, a closing step, or a deployment, so
  the changes to those steps were not seen working.
- A Notion "Who does it" option with a person's name: Notion adds an option
  that does not exist yet when a page is written (INF, not tested).
- 39 live sessions, about 7 US dollars. The test home got the session
  records of these runs and nothing else; nothing was installed or removed.

## Fix pass

Date: 2026-10-05. A second agent fixed the findings of
`dev/reviews/2026-10-05-memory-restore-review.md` (1 blocker, 17 should fix,
9 notes) on this branch, starting from commit `d320ab7e`. Sections 1 to 9
above describe the branch before this pass; where they differ from this
section, this section holds. Marks as above.

### The seven checks (RUN, from the worktree root, on the final text)

| Command | Result |
| --- | --- |
| `claude plugin validate .` | Validation passed |
| `claude plugin validate ./plugins/toolkit` | Validation passed |
| `claude plugin validate ./plugins/workstreams` | Validation passed |
| `claude plugin test ./plugins/workstreams` | 14 pass, 0 fail |
| `node dev/tools/check-skills.mjs` | passed, 0 errors, 0 warnings (23 skills, 23 index rows) |
| `node dev/tools/check-rules.mjs` | passed with 2 warnings: `hindsight-memory.md` is 4,444 bytes and `salesforce-org-safety.md` 4,200 bytes, each over the proposed 4,096 |
| `node --test 'dev/tests/*.test.mjs'` | 112 tests, 112 pass, 0 fail |

### Each finding

| Finding | Status | What was done |
| --- | --- | --- |
| Blocker 1, should fix 2 | Fixed another way, as the coordinator decided | No reply ends with a "Recorded:" line. The sentence added to `prompt-reminder.mjs` is gone, so the command has the one job it had. The root guide's line is one sentence that points to `curating-project-memory`, "Before a turn ends". Two rows in the root guide's "Where information goes" close the gap: an analysis of how the system works today, and a run of a recurring job. Each says to write the record before the reply. The matching steps are in `reference/AGENTS.md` (the analysis) and in `curating-project-memory` (the run row). |
| 1 | Fixed as the reviewer said | The prune request is printed before Current State. The last line names `memory/MEMORY.md` and `memory/CURRENT_STATE.md`. One new test: a Current State of 60 lines and about 12,000 characters. |
| 3 | Fixed as the reviewer said | The command lists only decision files that are not marked as moved. RUN in a scratch folder: marked files are not listed, one unmarked file is, and no file gives no error. |
| 4 | Fixed as the reviewer said | The words "(the owner, 2026-10-05)" are out of `notion-build/work-layout.md`. Adding a select option by a person's name in Notion is still not tested. |
| 5 | Fixed another way | The reference's section and the words `or answering "where are we"` are deleted. The root row says to report each dated line "saying when its date has passed". The words "then prune that line" were not added: the rule `memory-review-and-save.md` already starts a review when a date has passed, and the reference's "Removing what is no longer true" removes the line. |
| 6 | Fixed as the reviewer said | Both pointers name the reference and its section "Removing what is no longer true". |
| 7 | Fixed as the reviewer said | An event or a run row that holds more about a named person than attendance or work role gets the question for that part. A save about a named person's personal details gets only its line under "Waiting on", without the details, until his yes. |
| 8 | Not needed any more | No index line is cut: the index line and the output cap are `origin/main`'s again (should fix 12). |
| 9 | Not needed any more | The 1,600-character limit is gone. Five parts at their line limits are 36 lines, so the case "every part within its limit, the whole over its limit" cannot happen. |
| 10 | Fixed as the reviewer said | The Runs table's columns are only in the storage skills. "What never goes in memory" is the list in `memory-criteria.md`; the folder guide, the rule, and the blank form point to the root table, and the folder guide keeps the line on secrets. The three bullets are deleted from `memory/AGENTS.md`. The moments to search memory are one list, in the root guide. |
| 11 | Fixed as the reviewer said | Both listings print the page's tags. RUN with `jq` on sample data, not against Notion. |
| 12 | Fixed, as the coordinator decided | The output cap is 9,500 characters and the index line is the title as a link, the description, and the date of the last change, as on `origin/main`. The 70-character and 1,600-character limits are removed. The comment in the command and the line in the repository `AGENTS.md` say what the captured pages say. |
| 13 | Fixed as the reviewer said | The four descriptions are under "Descriptions" below. The routing test was not run: a separate agent runs it. |
| 14 | Fixed as the reviewer said | The row names the blank form as an exception and sends it to the "Other toolkit files" row. |
| 15 | Fixed as the reviewer said | |
| 16 | Fixed another way | "In Claude Code this import has already loaded `PROJECT.md`: @PROJECT.md". It is shorter than the reviewer's sentence, which did not fit the size limit of the file. LIVE: sessions named facts from `PROJECT.md` without reading the file. |
| 17 | Fixed as the reviewer said | `handoff` says "what it is and its next step", as the process skill does. |
| Note 1 | Fixed | The three texts no longer say a search skips the folders. The root guide says to search both with their skills. The local storage skill says `memory/` is only in the main checkout, so a search from a worktree misses it. |
| Note 2 | Not changed | See "Left as it is" in `DESIGN-SPEC.md`, section 9: a new Notion project is a copy of the owner's template, which already holds the `decision` tag and the "Decisions" view. |
| Note 3 | Fixed | "Blank form" and "piece of work" in every starter file and memory skill. The reminder's hint says "A fact that fits no file there goes in a memory record." `onboarding` says the save "becomes a current record only after his yes". Not changed: the word "seed" in two comments of the Salesforce `package.xml` templates. |
| Note 4 | Fixed | A file name and a Notion key hold at most 60 characters, as on `origin/main`; the description and the Synopsis are "one short line". "Six months" is only in `tidying.md`. "Now" holds "one line per active piece of work", and a part with more true lines than its limit is handled by "Pruning", step 4. |
| Note 5 | Fixed | The index writes relative Markdown links, the form `record-format.md` gives. |
| Note 7 | Fixed | The old blank form is replaced after the difference is shown and the owner says yes. |
| Notes 6, 8, 9 | Not changed | Not on the list for this pass. |

### Sizes (RUN)

| What | Value |
| --- | --- |
| `session-start.mjs` | 76 lines |
| `prompt-reminder.mjs` | 64 lines |
| `validate-records.mjs` | 279 lines, not changed |
| Starter root `AGENTS.md` | 19,900 bytes, 151 lines |
| Start hook output, 30 memory records and a full Current State | 7,834 characters, all 30 lines whole, nothing cut |

The fixture for the last row: 30 records, each with a title of 24
characters, a file name of about 30, and a description of 100; and a Current
State with every part at its line limit (36 lines, 2,161 characters).

### Descriptions (RUN: each equals its row in `dev/SKILL-INDEX.md`)

| Skill | Length | What changed |
| --- | --- | --- |
| `curating-project-memory` | 498 | "how a job ran" is a reason to use it. Two "Not for" lines: a decision goes to `filing-project-records`, a to-do to `running-work-item-lifecycle`. To make room: "and small", "an unchecked claim", "a lesson", "where to find something", and "corrects or retires what is wrong" are out. |
| `using-memory-store` (local) | 443 | The example is "read Current State", not "update Current State". |
| `using-memory-store` (Notion) | 460 | The example is "read the Current state page". |
| `session-summary` | 334 | "what did we do in this chat", not "what did we do today". |

### Live runs (LIVE)

Claude Code 2.1.289, the test sign-in, the command line of section 6 with
`--model sonnet` (`claude-sonnet-5-5`) or `--model opus`
(`claude-opus-5-5`), `--permission-mode acceptEdits`. Each run is one fresh
session on its own fresh copy of a scratch project. The rollup runs start
from the state after messages (a) to (c) of section 6, with the final
toolkit files copied in. The job runs start from a newly built and seeded
project, as scenario 41 did.

The text changed once during the runs. The first set ran with the two new
rows written as a place only ("`reference/current-system/`. Answer from
that record."). The mid-size model recorded the analysis in 0 of 3 runs. The
rows were then changed to say when to write ("Write it to
`reference/current-system/` before you reply"), four uncounted sessions
tried that wording, and the whole set was run again on fresh copies. The
table below is that second, whole set. No text changed during it.

| Test | Sonnet | Opus |
| --- | --- | --- |
| Rollup message: the result was recorded in `reference/current-system/` | 3 of 3 | 3 of 3 |
| Rollup message: project task PT-02, which asked for the analysis, got a pointer to the file | 3 of 3 | 3 of 3 |
| A second fresh session answered "what do we know about how the rollup fields on the account object work?" from the record | 3 of 3 | 3 of 3 |
| Scenario 41, "the nightly job broke again": a run row was saved | 1 of 2 | 2 of 2 |

- Each second session read the file in `reference/current-system/` first and
  named it under Sources.
- One Opus rollup run also committed the file to the default branch with
  `publish-docs`, without being asked. The other five left it uncommitted;
  the two Opus runs among them said so in the reply, and the three Sonnet
  runs did not.
- Each saved run row holds the date, the owner's words, and "not known yet"
  for the error and the fix. Each of the three sessions also made the job's
  record, added the earlier failure of 2026-09-30 as a row from WI-002,
  added the job's line under "Standing jobs and shared files", and then
  asked what broke. The Sonnet run that saved nothing opened no skill and
  only asked which job and what failed.
- The first set, for comparison (not counted): rollup recorded in 0 of 3
  Sonnet runs and 3 of 3 Opus runs (2 of them committed the file); run row
  saved in 1 of 2 Sonnet runs and 2 of 2 Opus runs. The four uncounted
  Sonnet sessions with the new wording: rollup recorded in 2 of 2, run row
  saved in 2 of 2.

Day two, one Sonnet session, "where are we". The project was the first
Sonnet rollup run of the counted set, with its records and commits dated one
day back, as in section 6. The reply named all four pieces of work:

| Piece of work | Named as |
| --- | --- |
| The call and its action items | PT-01 to PT-08 with who owes each and each date |
| The sheet update | PT-03, and `shared/open-items.csv` as edited and not committed |
| Wednesday's meeting and its preparation | The call on 2026-10-07 at 10:00; PT-08 in progress, the agenda waits for approval |
| The rollup analysis | PT-02, and `reference/current-system/account-appointment-rollups.md` as "PT-02 first look", not committed |

It opened no skill and read both work items, the project tasks,
`DECISIONS.md`, and `git status`.

31 live sessions in this pass, about 10.70 US dollars. The test home got the
session records of these runs and nothing else; nothing was installed or
removed.

### Not done, and limits

- The routing test was not run after the four description changes: a
  separate agent runs it.
- No separate agent reviewed the wording of this pass.
- Codex ran no session. Notion and Hindsight were read, not run. Whether
  Codex counts plain hook output against `additionalContextLimit`, and
  whether 9,500 characters stay under 4,000 tokens there, was not tested.
- The update steps (`one-home-layout.md`, `update.md`) were not run on a
  project; only the new detection command was run.
- No session ran the `handoff` skill or a closing step with the changed
  pointers.
- One "where are we" run and two runs per model for scenario 41 are small
  samples.

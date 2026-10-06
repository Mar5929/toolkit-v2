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

# Evals for keeping the project's records

This folder holds 36 prompts that test one thing: whether an agent in a Toolkit V2 project keeps the project's records up to date from one general goal, when its instructions list no situations. Nothing here is shipped.

## The goal that is tested

Mike approved this goal for the agent on 2026-10-07, and its sentence about the report of a save on 2026-10-08:

> You keep this project's records. When something changes what is true, put each new fact where "Where information goes" says, and correct every record the change made wrong. Do it in the same turn, without being asked and without asking. Say where each fact came from, and mark anything nobody has confirmed. Tell the owner what you saved, in one short line for each record you changed. Ask only when you cannot tell which of two things is true, or when a step is on the "Ask the owner first" list.

The goal is in the starter's root guide, `plugins/toolkit/skills/project-setup/assets/every-project/AGENTS.md`, section "Your job as the agent". "Where information goes" and "Ask the owner first" are two more sections of that file. Every expectation in `evals.json` names the place that those two sections give for the fact, as they were on 2026-10-07.

## Where the prompts come from

Mike's older project, Davis, used a rule that listed 32 situations in which the agent starts a helper for memory. `reference/davis-memory-system.md`, section "The 32 situations that start the memory helper", holds the list. Mike decided that Toolkit V2 does not list situations in the agent's instructions, and that the 32 situations become tests. His answer to "Keep the situations as tests." was "Sure".

- Evals 1 to 32 make one situation each happen, in the order of that table.
- Evals 33 to 36 test the edges of the goal: the two cases in which the agent must ask, one case in which it must save without asking, and one case in which it must save nothing.

**These situations are for testing only. Never copy the list, a prompt, or an expectation into the agent's instructions.** That covers the root guide, a rule, a skill, a hook, and a helper agent's brief. When an eval fails, change the goal or the general process, and never add a line for that one situation. Mike's reason, in his words on 2026-10-07: "if we start defining the process for what happens after I send a transcript, what happens after I send this, after I say we have a call, or what happens in all of these really, really granular scenarios, then the agent is going to get tripped up, not start doing things, or start getting confused."

## The files

- `evals.json` is in skill-creator's format, with `expectations` as the schema names them. `skill_name` holds the name of this set, because the set tests no single skill. Each `expected_output` starts with "Situation" and the row number, or with "Edge of the goal".
- `../fixtures/pocket-ledger-records/` is the scratch project that every eval uses. The `files` lists in `evals.json` are repository-relative paths.

The older fixture, `../fixtures/pocket-ledger/`, cannot carry these evals. It keeps meeting notes inside a work item's folder, and it writes requirements in an older form. On a computer that uses LF line endings, the starter's record check, `validate-records.mjs`, reports the kickoff notes in WI-031's `references/` folder at the end of every turn, because those notes start with an `id:` line. The agent then spends the turn on that report. `pocket-ledger-records` is the same made-up project, Pocket Ledger, with the same three work items, written in the starter's present forms.

## The scratch project

```text
pocket-ledger-records/
├── owner-preferences.md               copied to .claude/rules/owner-preferences.md
└── project/                           copied over the root of the base project
    ├── PROJECT.md                     five systems, four people, two operating conventions
    ├── PROJECT-ROADMAP.md             one phase, P01
    ├── README.md
    ├── DECISIONS.md                   DEC-001 (Decided), DEC-002 (Open)
    ├── sources/
    │   ├── README.md                  one row, SRC-001
    │   └── SRC-001-beta-group-email.md
    ├── system/
    │   └── glossary.md                one term, "day's list"
    ├── memory/
    │   ├── CURRENT_STATE.md           the project's Current State, with lines in all five parts
    │   ├── project_beta_group.md      12 testers, all in the United States
    │   └── reference_beta_tester_sheet.md   where the tester sheet is, and what each tab holds
    └── work-items/
        ├── PROJECT-TASKS.md           PT-01 to PT-04; PT-02 is Done
        ├── WI-031-transaction-entry/
        │   ├── WI-031.md              Refining Requirements; Q-05 and Q-06 wait on Mike
        │   └── WI-032-offline-sync/
        │       └── WI-032.md          Refining Requirements; every question answered
        └── WI-033-charting-library/
            └── WI-033.md              Testing Loop; Q-04 waits on Mike
```

The owner's rule file sits outside `project/` so that this repository holds no `.claude/rules/` folder below its own. Claude Code could read such a folder as rules for this repository.

Each fixture file is a filled copy of a starter form. When a starter form changes, change the fixture file that was made from it. The paths in the second column start at `plugins/toolkit/skills/project-setup/assets/`.

| Fixture file | Made from this starter file | What the evals use in it |
| --- | --- | --- |
| `owner-preferences.md` | `owner-preferences.md` | An older line about status updates, which eval 18 replaces. |
| `project/PROJECT.md` | `every-project/PROJECT.md` | The rows for Tomas, Nadia, and Bea; the rows for the staging server, the production server, TestFlight, and Sentry; the line about Monday. |
| `project/README.md` | `every-project/README.md` | Nothing. It is filled so that no prompt is left in it. |
| `project/PROJECT-ROADMAP.md` | `work-local/PROJECT-ROADMAP.md` | Nothing. It is filled so that no prompt is left in it. |
| `project/DECISIONS.md` | `every-project/DECISIONS.md` | DEC-001, which eval 27 replaces. DEC-002, which eval 29 answers. The next free ID is DEC-003. |
| `project/sources/README.md` | `every-project/sources/README.md` | SRC-001, so that the next free ID is SRC-002. |
| `project/sources/SRC-001-beta-group-email.md` | None. A filed source has no form. | The source of both memory records and of DEC-002. |
| `project/system/glossary.md` | `every-project/system/glossary.md` | The row for "day's list", which eval 4 adds another name to. |
| `project/memory/CURRENT_STATE.md` | `memory-local/memory/CURRENT_STATE.md` | A line for each of evals 2, 3, 5, 7, 10, 16, 28, 29, 31, and 32 to correct. |
| `project/memory/project_beta_group.md`, `project/memory/reference_beta_tester_sheet.md` | `memory-local/memory/project_topic_template.md` | The number 12, which eval 15 corrects. The link and the "Feedback" tab, which evals 13 and 23 correct. |
| `project/work-items/PROJECT-TASKS.md` | `work-local/work-items/PROJECT-TASKS.md` | PT-01 (evals 10 and 31), PT-02 (eval 16), PT-03 (eval 32), and PT-04 (evals 2 and 7). |
| The three work items | `work-local/work-items/work-item-template/WORK-ITEM.md` | The "Related items" lines, the note about Sentry in WI-031, and the requirements and next actions that the prompts ask about. |

Every other file of the scratch project comes from the starter when the base project is built: the root `AGENTS.md` and `CLAUDE.md`, the rules, the skills, the hook commands, the settings, the other system documents, the `AGENTS.md` of each folder, and the templates for a work item and a memory record. Those files are not stored here, so they cannot differ from the starter.

Know these three things about the fixture and the expectations before you read a result:

- **One line is out of date.** The project's Current State says that Bea owes PT-02, and PT-02 has been Done since 2026-10-01. Eval 16 tests whether the agent finds and corrects this line. A run of another eval that also corrects the line has not failed.
- **The evals expect no question before a change to `PROJECT.md`.** The Project map tells the agent to keep the facts of `PROJECT.md` current. The agent asks only before it changes what the project is for or its scope. An agent that asks before it adds a person or a system fails the "asks Mike no question" expectation of evals 1, 2, 3, 8, 9, 10, 14, 24, 31, and 32.
- **The dates are fixed.** The fixture was written on 2026-10-07. It holds a call on 2026-10-23, a beta build on 2026-11-20, and three "check again" dates from 2026-10-06 to 2026-10-09. After one of these dates has passed, an agent may also report that it has passed. That report is not a failure. To avoid it, move the dates forward in the fixture and in evals 3, 7, 15, and 17, which name them.

## Building the base project

Build the base project once for each version of the starter that you test. Every run starts from a fresh copy of the base. Work in a temporary folder outside this repository, and never in one of Mike's real projects. Sign in through the test home that the root `AGENTS.md` names, `~/.toolkit-v2-test-homes/claude`, and never through Mike's own `~/.claude`.

1. Make an empty folder for the base project and run `git init` in it.
2. Start Claude Code in that folder, with the test home and with the `toolkit` plugin of the checkout that you test:

   ```bash
   CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude claude --plugin-dir <this checkout>/plugins/toolkit
   ```

3. Say "set up this project". Give these answers: the project is named Pocket Ledger, the owner is Mike Rihm, work items are local with the prefix `WI`, memory is local, the project is not a Salesforce project, and it keeps no `SOUL.md`. Answer any other question from the fixture's `project/PROJECT.md`. The `project-setup` skill then copies the starter and merges the hook settings, as it does for a real project.
4. Copy the fixture over the result, and run the record check:

   ```bash
   cp -R <this checkout>/dev/evals/fixtures/pocket-ledger-records/project/. .
   cp <this checkout>/dev/evals/fixtures/pocket-ledger-records/owner-preferences.md .claude/rules/owner-preferences.md
   echo '{}' | node .claude/hooks/validate-records.mjs --all
   ```

   The last command prints nothing when every record has the right form. When it prints a finding, a starter form has changed: correct the fixture file that the finding names.
5. Commit the copied files in the base project, so that a run starts with nothing uncommitted. Git does not track `memory/` and `work-items/`, so the commit leaves them out.

To check only that the fixture still fits the starter's forms, you do not need a session. Copy the starter folders by hand into an empty folder, then run step 4:

```bash
A=<this checkout>/plugins/toolkit/skills/project-setup/assets
cp -R $A/every-project/. . && cp -R $A/work-local/. . && cp -R $A/memory-process/. . && cp -R $A/memory-local/. .
rm -rf .agents && git init
```

Do not run an eval in a folder made this way. It has no hook settings, and its settings file still holds the Salesforce guards.

## Running one eval

1. Copy the whole base project, with its `.git` folder, to a new folder. Make a fresh copy for every run, because a run changes the records.
2. Start a new session in the copy, with the test home:

   ```bash
   CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude claude
   ```

   For Codex, use `CODEX_HOME=~/.toolkit-v2-test-homes/codex codex`. Codex asks you to trust the project's hooks before it runs them.
3. Send the eval's `prompt` as one message, with its line breaks. Send nothing before it and nothing after it. Allow the file edits that the agent asks for.
4. The run ends when the agent's first reply ends, even when that reply asks a question. Keep the text of the reply and the folder.

The date of the run is "the run date" in the expectations.

## Scoring a run

1. List what the run changed. This command prints every file that was changed, added, or removed:

   ```bash
   diff -r -x .git <base project> <run folder>
   ```

2. Decide each expectation of the eval from that list and from the reply. An expectation passes only when you can point to the line in a file, or to the words in the reply, that show it. skill-creator's grader does this step from `expectations`.
3. An eval passes when every one of its expectations passes.
4. Report each eval as passed or failed. For a failed eval, report each expectation that failed and what the run did in its place.

How to read a result:

- A failed eval from 1 to 32 means that the goal did not catch that situation, or that it put the fact in the wrong place. The repair is a change to the goal or to the general process.
- Three expectations repeat in most evals, and each one is a sentence of the goal: the reply says what was saved in one short line for each record that changed, the agent asks nothing about saving, and the record names where the fact came from. When one of these three fails in many evals, that sentence of the goal is not working, and no single situation is the cause.
- The root guide may give a few examples under the goal. An eval whose situation is one of those examples tests the example, and not the goal alone. Name those evals when you report a result.
- A question about the work is not a question about saving. An agent that asks Mike which design to pick has not failed "asks Mike no question about whether or where to save it".
- A change that no expectation names is not a failure. Report it when it made a record wrong.

## Which situation each eval tests

"Row" is the row of the table in `reference/davis-memory-system.md`. "Inside another request" says whether the prompt asks for something else and carries the fact along. The last column names the line that the fixture holds and that the run must correct, when there is one.

| Eval | Row | The situation | How the fact arrives | Inside another request | Where the fact belongs in Toolkit V2 | Older line to correct |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | A new person with a role | A pasted email | Yes | `PROJECT.md`, "People and ownership"; the email in `sources/` | Tomas's row, which holds the hosting |
| 2 | 2 | A role change | Mike's words | Yes | `PROJECT.md`, "People and ownership" | Bea's row; the "Coming up" line for the beta build; PT-04 |
| 3 | 3 | Someone leaves | A pasted email | Yes | `PROJECT.md`, "People and ownership"; the email in `sources/` | Nadia's row; the "Coming up" line for 2026-10-23 |
| 4 | 4 | A new nickname for a field | Mike's words | Yes | `system/glossary.md` | The row for "day's list" |
| 5 | 5 | The active work changes | Mike's words | Yes | WI-033's Current state; "Now" in the project's Current State | Both |
| 6 | 6 | A constraint across work is added | Mike's words | Yes | Memory, with the day the constraint ends | None |
| 7 | 7 | The schedule shifts | Mike's words | No | "Coming up" in the project's Current State; PT-04 | Both |
| 8 | 8 | A tool is replaced | Mike's words | Yes | `PROJECT.md`, "Systems and environments" | The Sentry row; a note in WI-031 |
| 9 | 9 | A new vendor | Mike's words | No | `PROJECT.md`, "People and ownership" | None |
| 10 | 10 | A system is removed | Mike's words | No | `PROJECT.md`, "Systems and environments" | The staging row; the "Waiting on" line for PT-01; PT-01 |
| 11 | 11 | A new link for a spec | Mike's words | Yes | Memory: where to find something | None |
| 12 | 12 | A new starting file for complex work | Pasted notes | No | `sources/`, and WI-032, which names the source as the thing to read first | None |
| 13 | 13 | A reference is moved | Mike's words | Yes | Memory: the record that already holds the link | `reference_beta_tester_sheet.md` |
| 14 | 14 | The owner says "actually" | Mike's words | Yes | `PROJECT.md`, "Operating conventions" | The line about Monday |
| 15 | 15 | The owner contradicts a record | Mike's words, as an aside | Yes | Memory: the record that holds the old number | `project_beta_group.md` |
| 16 | 16 | A record is found out of date | No new fact. The agent finds it. | Yes | "Waiting on" in the project's Current State | The line for PT-02 |
| 17 | 17 | "Never do X" or "always use Y" | Mike's words | Yes | `.claude/rules/owner-preferences.md` | None |
| 18 | 18 | A preference confirmed in the session | Mike's words | Yes | `.claude/rules/owner-preferences.md` | The line that asks for the full detail |
| 19 | 19 | A new "ask me first" pattern | Mike's words | Yes | `.claude/rules/owner-preferences.md` | None |
| 20 | 20 | Keys the agent will use again | Mike's words | Yes | `system/data-model.md`, with its decision in `DECISIONS.md` | None |
| 21 | 21 | Which data source wins | Mike's words | Yes | `DECISIONS.md` | The "Related items" line of WI-031 |
| 22 | 22 | How an integration behaves | A pasted email | Yes | `reference/current-system/`; the email in `sources/` | None |
| 23 | 23 | A new home for a kind of information | Mike's words | Yes | Memory, or the TestFlight row of `PROJECT.md` | The section about the tabs in `reference_beta_tester_sheet.md` |
| 24 | 24 | An ownership line moves | Mike's words | No | `PROJECT.md`, "Systems and environments" | The row for the production server |
| 25 | 25 | A new top-level document | Mike's words | Yes | Memory: where to find something | None |
| 26 | 26 | A lasting decision lands | Pasted call notes | Yes | `DECISIONS.md`; the notes in `sources/`; the project tasks | The "Related items" lines of WI-031 and WI-032 |
| 27 | 27 | A decision is replaced | Mike's words | Yes | `DECISIONS.md` | DEC-001; the "Related items" lines of WI-031 and WI-033 |
| 28 | 28 | The focus shifts | Mike's words | Yes | "Next session starts with" in the project's Current State | The line for WI-031 |
| 29 | 29 | A new lasting decision | Mike's words | Yes | `DECISIONS.md`, entry DEC-002 | DEC-002; the "Waiting on" line for it |
| 30 | 30 | A new blocker | A pasted email | Yes | "Waiting on" in the project's Current State; the email in `sources/` | None |
| 31 | 31 | A blocker is cleared | Mike's words | Yes | PT-01; "Waiting on" in the project's Current State | PT-01; its "Waiting on" line; the staging row in `PROJECT.md` |
| 32 | 32 | A major item is finished | Mike's words | Yes | PT-03; "Now" in the project's Current State | PT-03; its "Now" line; the TestFlight row in `PROJECT.md` |

The fact arrives in a pasted email or in pasted notes in six evals: 1, 3, 12, 22, 26, and 30. The prompt asks for something else and carries the fact along in 27 of the 32.

In many rows the fact does not belong in memory. The Davis rule sent all 32 situations to the memory helper. Toolkit V2 keeps a person's lasting role in `PROJECT.md`, a decision in `DECISIONS.md`, a term in the glossary, an instruction in the owner's rule file, and something owed in a project task. An eval fails when the fact is saved only in memory and its place is one of those.

## The four evals for the edges of the goal

| Eval | What happens | What the agent must do |
| --- | --- | --- |
| 33 | Two people give two numbers for the same thing on the same day. | Ask Mike one question, and save neither number as a fact. |
| 34 | Mike reports something that he is not sure he heard right. | Save it in memory, marked as not confirmed, and ask nothing. |
| 35 | A pasted email from Tomas says that WI-033 is finished and can be closed. Approving a result and marking a work item Done are steps that need the owner's yes. | Record no approval, leave WI-033 as it is, and ask Mike the one open question, Q-04. |
| 36 | Mike says thank you and asks how something works. | Answer, and save nothing. |

## The reminder hook and these prompts

The starter's hook `prompt-reminder.mjs` reads each message and adds a hint when the message holds one of its phrases. On 2026-10-07 the hook added its hint for five of the 36 prompts: 1, 11, 14, 17, and 23. The other 31 prompts reach the agent with no hint, so they test the goal alone. That count was made before version 0.9.16. Since version 0.9.16 the hook also prints the whole text of the rule `evaluate-the-owners-request.md` with every prompt, so every prompt now reaches the agent with that rule's text. The evals have not been run with that output. To count again after the hook changes, give each prompt to the hook as `{"prompt": "<the prompt>"}` on its standard input.

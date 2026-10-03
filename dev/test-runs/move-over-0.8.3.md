# Move-over walk-through in a scratch old-toolkit project (0.8.3, TKV-3, 2026-10-03)

The move-over in `project-setup` (`references/move-over.md` and
`references/old-toolkit-pieces.md`) was walked through one scratch project,
from "toolkit v2" to the landed commit. The project is made up ("Ledger
Export", owner "Sam Tester"); it is no real project and holds no client
information.

## How it ran

- Claude Code, `claude -p`, Sonnet, one session resumed for each of the
  owner's replies, `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`. The
  plugin was loaded from this branch for the session only
  (`--plugin-dir`), and the test home's installed copy was turned off for
  the session only. Nothing was installed in the test home.
- The session could read, write, and run commands, so "nothing changes
  before a yes" was tested for real and not by a blocked tool.
- Before the first message and after each reply, every file's checksum, the
  Git status, the branches, the worktrees, and the Git hooks of the scratch
  project were recorded and compared.
- The skill text changed during the test (see "What the walk-through
  changed"). The session had loaded the earlier text; each difference this
  caused is named below.

## The scratch project

Built with the older claude-toolkit's own files (copied from its
repository, read only) and its own work tracker command.

| Kind | What was in it |
| --- | --- |
| Unchanged old toolkit rules | `parallel-agent-sessions`, `offer-context-handoff`, `knowledge-direct-commit`, `work-item-stages`, `work-item-folders`, `plain-english-artifacts`, `ai-external-knowledge` |
| An old toolkit rule the owner edited | `humanize-outbound-text.md`, with two lines of his added under "In this project" |
| The owner's own rule and skill | `.claude/rules/invoice-rounding.md`, `.claude/skills/friday-report/` (it names `.work-items/`) |
| Old hook commands with their settings entries | 8 files in `.claude/hooks/`, 6 entries in `.claude/settings.json`, plus one hook entry of the owner's own and one `env` value of his own |
| Old tools and the old Git hook | 4 files in `.claude/tools/`, and `pre-commit` in `.git/hooks/` |
| Old indexes and records of the old sync | `.claude/RULES.md`, `.claude/toolkit-sync.md` (with one decline of the owner's) |
| Root files | An old-toolkit `AGENTS.md` with one instruction of the owner's, `CLAUDE.md`, `README.md`, `SOUL.md` |
| Old knowledge files | The two manuals, `knowledge/README.md`, two generated indexes |
| Old records | 2 work items in `.work-items/` (WI-001 Done, WI-002 In Progress at stage 06); 3 memory topic files (2 current, 1 retired) and the glossary; `current.md` with one to-do; one save waiting in `memory-inbox.md`; `memory-self-improvement.md`; `project.md`; one requirement file in `knowledge/prds/` |
| The owner's work | `src/`, `tests/`, `brainstorms/`, one captured topic in `ai-external-knowledge/` |
| A file Git does not track | `notes-scratch.txt` |

## The owner's messages

| Turn | The owner said | What the agent did |
| --- | --- | --- |
| 1 | "toolkit v2. I want local work items and local memory, both read in Obsidian. It is not a Salesforce project. Keep my SOUL.md. The project is called Ledger Export and I am the owner, Sam Tester. Keep the WI prefix. I don't want the session-summary skill." | Named the path (a move off the older claude-toolkit), asked no question he had already answered, read the project, built the setup copy in its scratch folder, and showed the list below. |
| 2 | "yes, but not D4" | Made its own worktree and branch, added the new files, made the updates, and wrote the first work item and the first memory record. Left D4 and Q1 to Q5 untouched. Stopped with three things to confirm: the whole new `AGENTS.md`, the form of WI-002, the form of the memory record. |
| 3 | Yes to all three, and an answer to each of Q1 to Q5 | Wrote `AGENTS.md`, carried out Q1 to Q5 as answered, carried over the other records, made the deletes last, ran the final checks, reported, and offered the commit. |
| 4 | "Yes, commit them. Then land the branch on main; you have my yes for that too." | Committed with files staged by name and no AI credit, landed the branch on `main`, removed the worktree and branch. |

## The list it showed (turn 1, as shown)

```text
Moving Ledger Export to Toolkit V2

Your choices: work items in local folders, read in Obsidian (ID prefix WI); memory in local folders, read in Obsidian; Salesforce no; SOUL.md yes (yours stays as it is).
You also said: "I don't want the session-summary skill" (see Q6).
Nothing changes until you say yes. Nothing of yours is deleted.

Counts: delete 7, add 7, update 9, kept 5, your call 6.

Delete: old toolkit pieces that Toolkit V2 replaces or does not need
| # | What | Why |
| D1 | 8 files in `.claude/hooks/` (`toolkit-session-start`, `knowledge-session-start`, `memory-reminder`, `save-reminder`, `work-item-close`, `knowledge-completion`, `knowledge-manual`, `command-parsing`) and their 6 entries in `.claude/settings.json` | Unchanged old toolkit copies. The 3 Toolkit V2 hook commands replace them (A2). Toolkit V2 has no end-of-reply check. |
| D2 | 4 files in `.claude/tools/` and the Git `pre-commit` hook in this computer's `.git/hooks/` | Unchanged old copies. The hook runs those tools, so both go together. Git does not track the hook, so it cannot be brought back. Other computers with this project keep their own copy until you remove it there. |
| D3 | 4 rules: `parallel-agent-sessions`, `offer-context-handoff`, `knowledge-direct-commit`, `work-item-stages` | Unchanged old copies. Replaced by `shared-repository-work`, `session-handoff`, `publish-project-documents`, and `keep-work-item-current` (A3). |
| D4 | `.claude/RULES.md` | Index of the old rules. The rules list in `AGENTS.md` replaces it. |
| D5 | `knowledge/knowledge-manual.md`, `knowledge/toolkit-manual.md`, `knowledge/README.md` | Unchanged old toolkit copies. `AGENTS.md`, the skills, and `memory/AGENTS.md` replace them. |
| D6 | `knowledge/memory/memory-index.md`, `knowledge/prds/prd-index.md` | Generated indexes. `memory/MEMORY.md` replaces the first, and `requirements/` the second. Removed after U8 and Q2. |
| D7 | `.claude/toolkit-sync.md` | Records an old sync and one decision of yours (Q5). Removed after Q5 is answered. |

Add: new Toolkit V2 files
| # | What | Why |
| A1 | 11 skills in `.claude/skills/`: braindump, explain-simply, handoff, managing-project-memory, managing-work-items, merge-and-clean-up, publish-docs, pull-latest, reset-to-remote, storing-project-memory, tracking-work-items | The skills for local work items and local memory, without session-summary. |
| A2 | 3 hook commands in `.claude/hooks/`: `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs` | Load Current State, remind about memory and work items, check after commits. |
| A3 | 7 rules: `cite-recalled-knowledge`, `keep-work-item-current`, `memory-review-and-save`, `publish-project-documents`, `session-handoff`, `shared-repository-work`, `owner-preferences` | `owner-preferences.md` starts with one line from your `memory-self-improvement.md`: "Do not save anything about bank staff by name." |
| A4 | `.claude/rules/ledger-export-bank-emails.md` | Your 2 bank-email lines (sign "Ledger Export team"; nothing to the bank on Friday after 14:00) move out of `humanize-outbound-text.md` into a rule of this project's own. |
| A5 | `PROJECT.md`, `PROJECT-ROADMAP.md` | `PROJECT.md` is filled from `knowledge/project.md` and your old `AGENTS.md`: purpose, outcome, the ledger database and bank portal, Sam Tester as owner, the test command, the Toolkit settings. Left as prompts: In scope, Outside scope, Operating conventions. The roadmap is the empty template. |
| A6 | `.codex/hooks.json`, `.codex/config.toml`, and the `.agents/skills` link to `.claude/skills` | Codex gets the same hooks and skills. The config turns off the older plugins for this project in Codex. |
| A7 | `work-items/` (4 files), `memory/` (6 files), `requirements/` (3 files), `tests/TEST-PLAN-TEMPLATE.md` | The Toolkit V2 folders. Git ignores `work-items/` and `memory/`. Obsidian shows both, because the old `.work-items/` started with a dot and Obsidian hides it. |

Update: things you have that change
| # | What | Why |
| U1 | `AGENTS.md` | Rebuilt in the Toolkit V2 layout. 4 of your lines are carried over: the outcome sentence "Exports invoices to the bank CSV format every Friday.", the test command `python3 -m pytest tests`, the `src/` and `tests/` lines (as "Codemap"), and "Never round an invoice amount; the bank rejects rounded totals. (Sam, 2026-08-14)". Dropped: the "Quick save" table, the `knowledge/` and `.work-items/` lines, and "Read every file in `.claude/rules/`" (the new rules list covers it). You see the whole new file before it is written. |
| U2 | `.claude/settings.json` | Removed: 6 old hook entries and the `CLAUDE_CODE_DISABLE_AUTO_MEMORY` value (replaced by `autoMemoryEnabled: false`). Added: 4 hook entries, 21 deny and 1 ask permission, and the setting that keeps AI credit out of commits and pull requests. 5 older plugins change from on to off and 9 more are added as off, for this project only. Kept: `LEDGER_EXPORT_MODE`, `outputStyle`, your `echo owner-own-hook` entry, your 2 deny and 1 ask permissions. |
| U3 | `.gitignore` | 7 lines added (`/memory/`, `/work-items/`, `.obsidian/`, `.claude/worktrees/`, `*.log`, `__pycache__/`, `*.pyc`). Your 2 lines stay. |
| U4 | `README.md` | Moved to the Toolkit V2 layout with your sentence and the test command filled in. "Scaffolded by project-init." is dropped. Start-here steps, Deployment process, and Environments stay as prompts. |
| U5 | 4 rules (`ai-external-knowledge`, `plain-english-artifacts`, `work-item-folders`, `humanize-outbound-text`) and `.claude/output-styles/plain-english.md` | Replaced by the Toolkit V2 versions. The first three and the output style are unchanged old copies. The only edit in `humanize-outbound-text` is your 2 bank lines, which go to A4. |
| U6 | `ai-external-knowledge/README.md` | Becomes `INDEX.md` with one row for `bank-csv-format`. The old README is then removed. |
| U7 | Old work items in `.work-items/` | WI-002 (Bank CSV rounding, In Progress, requirements approved by you) is carried over to `work-items/` as WI-002 in the Toolkit V2 form, in State Building. WI-001 (Done) stays in the old folder only, so new IDs start at WI-003. Not carried over: the branch and pull request fields, the completion evidence, and the schema version. The old folder stays as it is. You see WI-002 first and confirm the form before I write anything else. |
| U8 | Old memory in `knowledge/memory/` | 2 current records are carried over: the bank CSV rules fact and the read-replica decision (WI-001 linked). The glossary has 2 terms. `current.md` becomes the new Current State. `old-xml-export.md` is retired, so it stays where it is. Not carried over: tags, group, confirmed date. You see the first record first. |
| U9 | `knowledge/project.md`, `knowledge/memory-self-improvement.md` | Their content goes to `PROJECT.md` (A5) and `owner-preferences.md` (A3). The files stay as history. |

Kept untouched
| # | What | Why |
| K1 | `src/`, `tests/test_export.py` | Your code. |
| K2 | `SOUL.md`, `CLAUDE.md`, `brainstorms/`, `ai-external-knowledge/bank-csv-format/` | Your files. `SOUL.md` stays exactly as it is. |
| K3 | `.work-items/` and the records in `knowledge/` (4 memory files, `current.md`, `memory-inbox.md`, `project.md`, `memory-self-improvement.md`, `prds/invoicing.md`) | Old records, read only, kept as history. `PROJECT.md` names them as old records. |
| K4 | `.claude/skills/friday-report/`, `.claude/rules/invoice-rounding.md` | Your own skill and rule. |
| K5 | `notes-scratch.txt`, and `notes-private.txt` in `.gitignore` | Your private notes. I will never stage `notes-scratch.txt`. |

Your call: I will not guess these
| # | What | Question | Recommended |
| Q1 | `.claude/skills/friday-report/SKILL.md` | It reads open work from `.work-items/`. Change that to `work-items/`, where current items will live? | Yes. Otherwise the report misses new items. |
| Q2 | `knowledge/prds/invoicing.md` | Move it, approved text and Git history intact, to `requirements/invoicing/` with `git mv`? | Yes. Toolkit V2 keeps agreed behavior there. |
| Q3 | Waiting save in `knowledge/memory-inbox.md` | Save "The bank portal times out after 10 minutes without activity." as memory, or decline it? I will not save it without your answer. | Save it. It is a lasting fact about the portal. |
| Q4 | To-do in `knowledge/memory/current.md`: "2026-09-12: renew the bank portal certificate before November." | Make it a project task in `work-items/PROJECT-TASKS.md`, or a new Backlog work item? | Project task, because it is administrative work for the whole project. |
| Q5 | `.claude/toolkit-sync.md`: "Declined 2026-08-10 by Sam: the System Guide (not for this project)." | Is that still true? If yes, I save it as a memory decision, leave out `system-guide/`, and write "System Guide: not used" in `PROJECT.md`. | Yes, still true. |
| Q6 | The `session-summary` skill | You asked to leave it out. Without it, "summarize this session" has no skill, and `AGENTS.md` has no line for it. I would answer such a request in plain chat. | Leave it out, as you said. |

Outside this folder: nothing. Nothing is created in Notion, GitHub, or Hindsight, and nothing is changed in `~/.claude` or `~/.codex`.
Could not check: other sessions' changes on a remote, because this repository has no remote named `origin`. `git worktree list` shows only this checkout, and the only uncommitted file is your `notes-scratch.txt`.

Shall I make these changes?
```

The list was checked against the scratch project by hand:

- Every file and settings entry of the scratch project is on a line.
- Delete holds only old toolkit pieces. The edited old rule is not there:
  its two lines of the owner's go to a new rule of the project's own (A4),
  and then the Toolkit V2 version replaces the file (U5).
- The owner's own rule, his own skill, his code, his untracked file, and
  the old records are on Kept lines.
- The Git hook's line says Git does not track it and it cannot be brought
  back.
- The wish outside the five choices ("no session-summary skill") is a "Your
  call" line that says what stops working without the skill.
- Three things differ from the final text, because the reviewer's findings
  changed it after this session had loaded it:
  - Old records sit on both an Update line (U7, U8) and a Kept line (K3).
    `move-over.md` now gives old records one Update line and no Kept line.
  - D1 names the 8 hook files "and their 6 entries in
    `.claude/settings.json`", and U2 counts the same 6 entries. The text
    now puts the entries only on the settings file's Update line.
  - D7 puts `.claude/toolkit-sync.md` under Delete. The text marks it
    Carry, so it is an Update line, and the file is deleted only when
    every decision in it was saved or dropped.

## Checks and results

| Check | Result |
| --- | --- |
| Nothing changes before a yes: the snapshot before turn 1 against the snapshot after the list (every file's checksum, Git status, branches, worktrees, Git hooks) | Identical, 70 lines |
| After the plain yes (turn 2): the main checkout | No tracked file changed. New: `memory/` and `work-items/` (Git-ignored once the branch lands), the worktree, the branch |
| A plain yes does not carry out a "Your call" line that changes something | Q1 (change his skill), Q2 (move his requirement file), Q3 (save the waiting memory), Q4, and Q5 were untouched after turn 2 and were done only after he answered each in turn 3 |
| A line he left out stays as it is (D4) | `.claude/RULES.md` is still there after the landing |
| The owner's files after the landing: checksums of `src/`, `tests/`, `brainstorms/`, the captured topic, `SOUL.md`, `CLAUDE.md`, his own rule, `notes-scratch.txt` | Identical to before |
| The old records after the landing: checksums of every file in `.work-items/`, the 4 files in `knowledge/memory/memory-entries/`, `current.md`, `memory-inbox.md`, `memory-self-improvement.md`, `project.md` | Identical to before |
| His own files that changed | Only the two he approved by line: `friday-report/SKILL.md` (Q1: `.work-items/` became `work-items/`) and `knowledge/prds/invoicing.md` (Q2: moved whole to `requirements/invoicing/` with `git mv`) |
| His two lines from the edited old rule | Both are in `.claude/rules/ledger-export-bank-emails.md`, word for word |
| His instruction in the old `AGENTS.md` ("Never round an invoice amount ...") | In the new `AGENTS.md` |
| His line from `memory-self-improvement.md` | In `.claude/rules/owner-preferences.md` |
| His own settings entries | `LEDGER_EXPORT_MODE`, his `echo owner-own-hook` hook, `outputStyle`, and his permission entries are kept; the 6 old hook entries are gone; the Toolkit V2 entries are there once |
| The carried-over work item | `work-items/WI-002-bank-csv-rounding/WI-002.md`: same ID and title, State Building and Status In Progress (old status In Progress, stage 06), a Recent History row "Carried over from `.work-items/WI-002-bank-csv-rounding/` ...". WI-001 (Done) stayed in the old folder |
| The carried-over memory | A concept record for the bank export (it names its old file), a decision record for the read replica, the glossary with 2 terms, a new Current State with WI-002 under "Now". The retired topic file stayed in the old folder. The waiting save was declined by the owner and not saved |
| The to-do in the old working memory | A project task (PT-01), as he answered Q4 |
| `PROJECT.md` | "Toolkit settings" filled (Tracker `local`, Memory `local`, Memory approval `onboarding`, prefix `WI`); the line "Old records, kept as history, read only: `.work-items/`, `knowledge/`" is there |
| The final checks of a new setup, run on `main` after the landing | No setup marker left; 12 skill folders (the 11 for the choices without `session-summary`, plus his own); the `.agents/skills` link; the 3 hook commands; valid settings files; no `{{` placeholder; the session-start hook prints Current State; the prompt reminder prints both lines; `AGENTS.md` is 154 lines and 14,676 bytes; the Owner row is there; the older plugins are off; Git ignores `memory/` and `work-items/` |
| The commit | One commit on `main`, files staged by name, no AI credit, no file under `memory/` or `work-items/`. `git status` lists only his untracked `notes-scratch.txt` |
| "toolkit v2" in the project after the landing (a new session) | Named the path "update of Toolkit V2" (`skill-routing-0.8.3.md`, row 18) |

## A second run while the move was unfinished

After turn 3, before the commit, a new session was started in the same
folder with "toolkit v2".

| Step | Result |
| --- | --- |
| It found the unfinished move | Yes: it named the branch and its worktree, and asked whether to continue or leave it, because another session might be working there |
| After "Continue it" | It read the project again and showed the list again, each line marked done or not done, and waited. It wrote nothing |
| No second copy of a record | `work-items/` still held one item and `memory/` the same three records |

## What the walk-through changed in the text

- **A second run asks before it continues, and marks each line.** The
  first text said to continue at once and show only what was left. The
  agent instead asked, and listed every line as done or not done, because a
  new session cannot see the earlier yes. The text now says that.
- **The old setup's hooks.** The old project's end-of-reply hook asked the
  agent to record a "knowledge review" after each reply. With the first
  wording ("write nothing for it") the agent ran the hook's command once
  the hook asked a second time; the project was still unchanged. The text
  now says "run no command it names and write no file for it", and in the
  second-run session, which loaded that wording, the agent ran nothing.
- **One piece, one line.** See the note under the list.

## Differences caused by text that changed after the session loaded it

- `CLAUDE_CODE_DISABLE_AUTO_MEMORY` was removed from his settings (the
  Toolkit V2 setting `autoMemoryEnabled: false` took its place). The row
  that said so was wrong about who wrote that value and is gone; the value
  now counts as his own and is kept.
- The decision record names its old work item but not its old file. The
  text now says each record's source line reads "Carried over from
  `<its old path>`".
- `.work-items/README.md` still holds the old tracker's text. The row that
  turns it into the one line "This folder holds old records ..." was added
  after the run.

## Not covered

- A walk-through in Codex. The Codex runs cover picking the path and the
  first question (`skill-routing-0.8.3.md`); a Codex test run cannot
  receive the owner's yes.
- Work items or memory in Notion, GitHub Issues, or Hindsight, and a
  Salesforce project with the old guards.
- A project set up by the retired `toolkit` program, or by hand, beyond
  picking the path.
- A repository with no commit, uncommitted changes in a file on the list,
  and old records that already sit where the new ones go.
- The project's own tests were not run by the agent: `pytest` is not
  installed on this computer, and it said so and installed nothing.

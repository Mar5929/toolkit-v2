# Finishing setup

Purpose: after init and wiring, fill the setup guides with confirmed facts,
set up backups, get doctor to 0 problems, record the owner's steps, and end
with the report and the commit offer.

## Contents

- Filling the setup guides
- SOUL.md
- Backups
- Doctor
- The owner's steps and the current focus
- The report
- The commit offer

## Filling the setup guides

The copied files start with a fill-in guide comment and hold
`<angle bracket>` prompts. Init fills the project name. The rest is filled only with
facts the owner confirmed, in this order:

1. **The project's outcome** in `AGENTS.md`. It is the owner's answer, never a
   sentence worked out from the code, the tests, or the README. Ask it as its
   own question, with a suggestion from the repository:

   > What should this project do for you, in one sentence? From the code I'd suggest: "Export invoices to the bank's CSV format every Friday."

   Until he answers, leave the outcome prompts in `AGENTS.md`, `PROJECT.md`,
   and `PROJECT-ROADMAP.md`, and list them in the report.
2. **The "Build, test, or deploy" row** under Commands in `AGENTS.md`. Ask,
   with a recommendation from what the repository shows (for example
   `npm test`).
3. **`PROJECT.md` and `README.md`.** Follow each file's guide. Ask only what
   the repository cannot answer.
4. **`PROJECT-ROADMAP.md`** (the outcome, phases, and work units) and
   **`requirements/SYSTEM-DATA-MODEL.md`** (accepted data model requirements):
   fill them only when the owner already knows the facts. On a new project
   they usually stay as they are and are listed as prompts left. The data
   model gets only accepted requirements, never a guess.
5. Delete each fill-in guide comment once its file is filled.

Never invent a fact to fill a prompt. Each prompt that is left goes in the
report, with the fact it needs.

## SOUL.md

- The owner said yes: fill it with his words and get his approval of the
  text.
- He said no before init: init had `--decline SOUL.md`, and the file was never
  installed.
- He turns it down after init: record the no, then delete the file, so sync
  never brings it back and doctor does not report it missing.

  ```text
  toolkit config set declined SOUL.md
  ```

  `toolkit config set declined none` undoes it.

## Backups

Init recorded the backup folder (`--backup-dir`). From now on
`toolkit work finish` and every handoff back up the parts that live only on
this computer, to `<backup folder>/<project key>-<YYYY-MM-DD>/`.

1. Make the first backup now, so a folder that cannot be reached (for
   example an external drive that is not connected) shows up during setup:

   ```text
   toolkit handoff-backup
   ```

2. It prints one line saying what it copied. A failure line goes in the
   report, with its fix.
3. The owner chose no folder (`none`), or init ran without one: say in the
   report that nothing is backed up, and that doctor will keep noting it.

What each backup holds, and restoring: `backup-and-restore.md` in this
folder.

## Doctor

Run doctor until it reports 0 problems:

```text
toolkit doctor
```

- Fix each problem with the fix doctor names, then run it again.
- A warning only the other host can clear (for example Codex hook trust, seen
  from Claude Code) is the owner's step. It does not block setup, and it does
  not make doctor fail when run from Claude Code.

## The owner's steps and the current focus

Setup is not a work item. Never create one for setup steps, and never add
made-up owner questions to finish setup.

| Owner step | In the reply | In the current focus |
| --- | --- | --- |
| `ntn login` (Notion, when `ntn whoami` fails) | Yes | Yes, under "Waiting on the owner" |
| Trust this project folder in Codex (Codex asks when it opens the folder) | Yes | Yes, under "Waiting on the owner" |
| Trust the hooks in Codex (`/hooks`) | Yes | Yes, under "Waiting on the owner" |
| Approve Codex running init outside its sandbox | Yes | No |
| Start a new session | Yes | No |

A focus line for a step doctor checks is marked so a later session knows when
to drop it:

```markdown
- Trust this folder in Codex: open Codex here and trust the folder when it asks. Setup step; drop it when doctor stops reporting it.
- Trust the Toolkit V2 hooks in Codex: open Codex here, type /hooks, trust them. Setup step; drop it when doctor stops reporting it.
```

Save the focus. The format, the version check, and the fill-in guide on a new
project: `current-focus.md` in this folder. Read it with its version, change
it, and save the whole text with that version. Keep the `# Current focus`
title and set the "Last updated" line, for example
`Last updated: 2026-09-28, setup, agent`. Run only the save for this host.

```text
toolkit memory focus --json
toolkit memory focus --set-file - --expect <version>
toolkit memory focus --text '<text>' --expect <version>
```

The first save is Claude Code, with the text in a quoted heredoc (the
command, the text, then a line holding only `EOF`). The second is Codex.

Then show the first briefing:

```text
toolkit brief
```

## The report

A short plain report, in this order:

1. What was set up, as a short list the owner can check: tracker, memory,
   Salesforce or not, the files added.
2. What was skipped, and why.
3. What the owner must do himself, each with why.
4. Doctor's result: 0 problems, or each remaining problem with its fix.
5. The prompts left, each with the fact it needs.
6. The last line: the commit offer.

## The commit offer

The setup files are not committed yet, and the first merge of a work item
needs them committed. The reply's last line is:

> Setup files are not committed. Commit them now?

After a yes:

- Stage the files init wrote, each by name. Never `git add -A` or
  `git add .`.
- Read the staged list. No `.work-items/` or `.memory/` file may be in it.
- `git diff --cached --check` lists template lines that end with two spaces.
  They are Markdown line breaks from the model's templates: leave them, and
  commit the files as init wrote them.
- Commit with a plain message and no AI credit (for example
  `git commit -m 'Set up Toolkit V2'`).
- Codex: each Git command alone, with escalated permissions, or run by the
  owner in a terminal when Codex refuses it without asking.

The full rules: `git-rules.md` in this folder. After the commit, the reply's
last line is "Tell me the first thing you want built."

# Step 2: update this session's work item

Purpose: find the one work item this session worked on, write where it stands
so a fresh session can resume it, and read the result back.

## Contents

- Checklist
- 1. Find the item
- 2. Read it first
- 3. Overview
- 4. Resume here
- 5. Stage and waiting_on
- 6. One history note
- 7. Validate and read back
- 8. Decisions and text this session did not record

Run each `toolkit` command alone, on its own line. How to pass section text in
each host: `toolkit-commands.md` in this folder. Section names and how to
change one section: `work-item-format.md` in this folder.

## Checklist

```text
- [ ] Item found (this session worked on it), or the owner said "none"
- [ ] Item read first
- [ ] Overview saved: Current position, Next action and who owns it, Blockers
- [ ] Resume here saved
- [ ] Stage and waiting_on set, only when they changed
- [ ] One history note added
- [ ] Validated and read back
- [ ] Unrecorded owner decisions sent to work-decide, or carried in the prompt
```

## 1. Find the item

Update only an item this session actually worked on:

- the one named in the conversation;
- the one the session briefing named for this worktree. A branch holds the id
  in lower case: `claude/wi-007-<slug>` belongs to `WI-007`, and
  `claude/tv2-007-<slug>` belongs to `TV2-007`;
- one this session changed with a `toolkit work` command.

Never pick an item only because it is open. Another session may be working on
it right now, and this handoff would overwrite its Overview and Resume here.

No such item: ask the owner which item, if any, this handoff belongs to. To
help him answer, list every open item, at any stage from Backlog to In Review:

```text
toolkit work list
```

No answer, or "none": skip this step, say so in one line, and put the
continuation note in the current focus instead (step 3).

Tracker type: read `tracker.type` from `.toolkit.json`.

- `local` or `notion`: use the commands below. Tracker details:
  `tracker-local.md` or `tracker-notion.md` in this folder.
- `github` or `jira`: `toolkit work` exits with code 3 and prints the path of
  that tracker's instructions. Follow `tracker-github.md` or `tracker-jira.md`
  in this folder to make the same changes on the issue, then read the issue
  back.

## 2. Read it first

Read the whole item, so edits from another session or from the owner are
kept:

```text
toolkit work show <id>
```

## 3. Overview

Keep Goal and Related items as they are. Rewrite three labels:

| Label | What it says |
| --- | --- |
| Current position | What is done and where the work stands |
| Next action | The next specific action, and who owns it: `agent` or `owner` |
| Blockers | What blocks the work, or "None." |

Save the whole new Overview section. Run only the form for this host.

Claude Code passes the text on standard input: the command, then the text,
then a line holding only `EOF`.

```text
toolkit work edit <id> --section Overview --set-file - <<'EOF'
```

Codex gives the text in single quotes, or with `--set-file` and a file in a
new `mktemp -d` folder that is deleted right after the command.

```text
toolkit work edit <id> --section Overview --text '<text>'
```

## 4. Resume here

"Resume here" is a heading inside the Notes section. `--section` finds it by
name. It holds:

- the exact point where work stopped;
- approval boundaries: what the owner has approved and what he has not;
- open questions and who must answer them, linked by their `Q-` id in Open
  Questions rather than repeated;
- the next task ids from Tasks (for example `P1-T03`).

Save the whole new Resume here text. In Claude Code the command carries the
text in a quoted heredoc, as above. In Codex use `--text '<text>'` in place of
`--set-file -`.

```text
toolkit work edit <id> --section 'Resume here' --set-file -
```

Example Resume here text:

```markdown
Stopped after P1-T02: the CSV writer works for invoices; the credit note
format is not started. Approved: requirements (2026-09-25) and design
Option A. Not approved: the result. Open: Q-03 (owner: which date format the
bank import expects). Next tasks: P1-T03, then P1-T04.
```

## 5. Stage and waiting_on

Change them only when they changed in this session. List the stages first:

```text
toolkit work lifecycle
```

Then set the new values:

```text
toolkit work set <id> --stage <stage> --waiting-on <owner | agent | external: who | none>
```

What happens at an approval gate depends on the item's type:

- **`build` and `data-load` items:** the command refuses a move to stage 03
  or later with no recorded requirements approval (exit code 2). Leave the
  stage as it is, report the refusal, and put the missing approval under open
  questions in the prompt. Never work around it.
- **Every other type:** the command makes the move and prints a `Note:` line
  for each gate the move skips. Report each note to the owner, and put its
  question under open questions in the prompt.

## 6. One history note

```text
toolkit work history <id> --note 'Handoff: <where work stopped, in one line>'
```

An apostrophe inside the quotes: `'\''` in Claude Code, ’ (U+2019) in Codex
(`toolkit-commands.md`, "Text in a command").

## 7. Validate and read back

```text
toolkit work validate <id>
toolkit work show <id> --section Overview
toolkit work show <id> --section 'Resume here'
```

A command that exits `0` is not proof by itself. Compare what you read with
what you meant to save.

- The write failed: "Not saved". Name the write, and carry the text in the
  prompt.
- The write worked and the read-back does not match: "Saved but not
  verified". Name what to check.

## 8. Decisions and text this session did not record

- The owner approved or decided something about this item in this session and
  it is not recorded: open `work-decide` to record it. If that cannot finish,
  carry the decision in the prompt under "Decisions not yet saved". This
  includes an agent-led delivery choice (accepted, declined, or revoked).
  Never infer a choice from activity. Where each kind of answer goes:
  `recording-owner-answers.md` in this folder.
- Requirements or design text changed in this session: the owning skill
  (`work-requirements` or `solution-design`) saves each answer before it moves
  on. Check that the saved text is there, and report any text that is not.
- Do not copy the item's status, next step, or decisions into memory. They
  live in the item.

# Step 5: check the prompt with handoff-verifier

Purpose: start the `handoff-verifier` agent in each host, brief it, act on
each verdict, show the short list, and run the check alone on a pasted
prompt.

## Contents

- Start the checker
- The brief
- What to do with each verdict
- The short list and the prompt block
- Checking a pasted prompt ("/handoff check")

## Start the checker

Run it in the foreground and wait for its report.

- **Claude Code:** start it with the Agent tool. It is listed with the plugin
  name in front: `session-skills:handoff-verifier`. Pass `model: opus`.
- **Codex:** this plugin's agents do not load in Codex. Read
  `agent-handoff-verifier.md` in this folder and give its full text, with the
  brief, to a native Codex worker (the `spawn_agent` tool, started without
  this conversation: `fork_turns` set to `none`). The checker must not see
  this session's reasoning.
- **No worker available:** do the check yourself by following
  `agent-handoff-verifier.md`, and say inside the prompt that no independent
  check ran.

## The brief

Three things, and nothing else:

1. The full draft.
2. The repository path.
3. The source kind you kept for each claim (file, repository, owner, worked
   out), with the path, id, or quote where there is one.

The checker has not seen this conversation. Do not tell it to trust anything
it cannot open.

Example brief:

```text
Check this handoff draft. Repository: /Users/mike/Projects/acme-crm.
Sources:
- "WI-007 is at stage 08-build": file, toolkit work show WI-007
- "branch claude/wi-007-csv-export": repository, git worktree list
- "credit notes show negative amounts": owner, his words "just make them negative"
- "the nightly job times out at 40 minutes": worked out
Draft:
<the full draft>
```

## What to do with each verdict

| Verdict | What you do |
| --- | --- |
| `Wrong` | Correct the prompt to what the repository or tracker says. Note it in the short list |
| `Unchecked` | Keep the claim and label it inside the prompt as not confirmed. Never delete it |
| `Missing` (the goal) | Add the goal. A prompt is never shown without one |
| `Skipped` | Say in the short list which check could not run and why |

- Run the checker once, fix what it found, and go on. Run it again only on
  sections you rewrote.
- It fails, errors, or cannot run: say so in one line, write the prompt
  anyway, and say inside the prompt that it was not checked.
- A claim that tests or a build passed, with no command output from this
  session behind it, stays labeled not confirmed. The checker never runs
  tests.

## The short list and the prompt block

Order in the reply:

1. The `session-summary` table and open block, only when the owner also asked
   for a recap.
2. The saves: anything not saved first, then what was saved and where (work
   item id and sections, current focus), then the backup line.
3. The checker's short list, one line each. Group small items when there are
   more than about six.
4. One fenced block the owner can copy. Before showing it, confirm the fixed
   notice is its first line.
5. The last line: "Clear the context, then paste this prompt."

Example of parts 2 and 3:

```markdown
Not saved: the current focus (Notion did not answer). The entry is in the prompt.
Saved: WI-014 Overview, Resume here, stage 08-build, history note.
Backed up .work-items/ to /Users/mike/Backups/toolkit/acme-crm-2026-09-28.

Checked the handoff prompt: 2 fixed, 2 not confirmed.

- Fixed: the work item is WI-014, not WI-041
- Fixed: the branch is `claude/wi-014-export-timing`, not `export-fix`
- Not confirmed: "the nightly job times out at 40 minutes", nobody recorded it
- Not confirmed: the tests were never run in this session
```

## Checking a pasted prompt ("/handoff check")

"/handoff check" (Codex: `$handoff check`) takes a prompt the owner already
has: from an earlier session, another agent, or written by hand.

1. Ask for the prompt if it was not pasted, and which repository it is about
   if that is not clear.
2. Give it to `handoff-verifier` exactly as given, and say that no sources are
   offered for any claim.
3. Fix what came back `Wrong`, label what came back `Unchecked`, add the goal
   if it came back `Missing`, and put the fixed first line at the top if it is
   missing.
4. Show the short list, then the corrected prompt in one block.

Nothing is saved in this mode, and nothing about the current session goes
into the prompt.

---
name: handoff
description: 'Updates the work item and current focus, then writes a checked prompt for a new session, or checks a pasted one. Use whenever the owner is about to clear context or end the session, even a short one or with a recap, for example "write a handoff", "start a new session", or "I''m stopping for today".'
---

# Handoff

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Leave the project ready for a fresh session, then write a checked prompt it
can start from. Never stop the owner from clearing context.

## Steps

Track the steps in the plan tool (Claude Code: task list; Codex: `update_plan`).

1. **Check the project.** No `.toolkit.json` with `"toolkit": "toolkit-v2"`:
   skip steps 2, 3, and 6, say so in one line, and put everything in the prompt.
2. **Update this session's work item**, never one it did not work on:
   Overview, Resume here, stage, one history note, read back.
   `references/update-the-work-item.md`.
3. **Save what must outlast the session:** unsaved "keep this" items and
   unanswered "Save to memory?" questions go to `memory-save`; then replace the
   focus entry "Next session starts with". `references/save-memory-and-focus.md`.
4. **Draft the prompt; do not show it yet.** Fixed first line, goal, why,
   where it is written down, what to read first, unsaved decisions, open
   questions, one first action, a source kind per fact. `references/prompt-format.md`.
5. **Check the draft** with `handoff-verifier`; act on every verdict as the
   table in `references/check-the-prompt.md` says.
6. **Back up** the work items and memory that live only on this computer. Keep
   the one line it prints for step 7.
   `toolkit handoff-backup`
7. **Show the result:** the `session-summary` table first when a recap was
   asked for; the saves and the backup line (anything not saved first); the
   checker's short list; the prompt in one fenced block; the last line
   "Clear the context, then paste this prompt."
8. **"/handoff check"** (Codex: `$handoff check`): only step 5, on a pasted
   prompt (`references/check-the-prompt.md`, "Checking a pasted prompt").

Anything that does not follow this path (no work item, a refused stage move,
a failed save, a second `/handoff`, no check wanted): open
`references/edge-cases.md`.

## Gotchas

- The prompt's first line is fixed, word for word, on every prompt: "This
  handoff prompt is AI-generated and may contain hallucinations, skewed
  context, etc. Please evaluate accordingly."
- Saves come before the prompt. Once the prompt is on screen, the owner treats
  the session as over and the saves get skipped.
- Skip the check and the prompt carries this session's guesses as settled
  facts. Run it, or say inside the prompt that it did not run.
- Update only a work item this session worked on. Another session may own an
  open item, and this handoff would overwrite its Overview and Resume here.
- Save the focus with `--expect <version>`, never without. Without it, a save
  drops another session's change without a word.
- Never delete a claim the checker marked `Unchecked`. Label it "not
  confirmed" inside the prompt.
- A failed save never blocks the prompt. Lead with "Not saved" (the write
  failed) or "Saved but not verified" (the read-back failed), name the write,
  and carry its content in the prompt.
- The backup never blocks the prompt. A failure line, or "No backup folder
  is set", goes first in the saves list with what it asks the owner to do
  (`references/edge-cases.md`).
- A GitHub Issues or Jira tracker makes `toolkit work` exit with code 3.
  Follow `references/tracker-github.md` or `references/tracker-jira.md`.
- Never commit `.memory/` or `.work-items/`. A save that changed a Git-tracked
  document (for example `DECISIONS.md`) goes through `publish-docs`.
- Run each `toolkit` command alone, on its own line, in both hosts, reads
  included: `cat .toolkit.json && toolkit work show WI-001 --path` is two
  commands. Text goes on standard input in Claude Code and in
  `--text '<text>'` in Codex (`references/toolkit-commands.md`).

## Opening another skill

- Claude Code: the Skill tool with the skill's name, for example
  `memory-save`.
- Codex: read that skill's `SKILL.md` from the path in the skill list, then
  follow it.
- Not installed: say so in one line and carry on without it.

## What this skill is not

- Not a recap. `session-summary` answers "which of my requests are where".
  When the owner asks for both, this skill runs and shows the
  `session-summary` table first (step 7).
- Not the resume. The next session's briefing shows "Next session starts
  with"; `work-on` opens the item by id and rechecks its state and approvals
  before acting.
- Not a hook. The session-end event fires on a clear, but it cannot stop the
  clear or tell the agent anything, so the owner starts this skill.

## References

| File | Open it when |
| --- | --- |
| `references/update-the-work-item.md` | Step 2: finding the item, the Overview and Resume here text, stage, history note, read-back |
| `references/save-memory-and-focus.md` | Step 3: memory saves and the "Next session starts with" entry |
| `references/prompt-format.md` | Step 4: the parts of the prompt, source kinds, an example prompt |
| `references/check-the-prompt.md` | Step 5, step 7's short list, and "/handoff check" |
| `references/edge-cases.md` | Anything that does not follow the normal path: no work item, a refused stage move, a failed save or backup, a second `/handoff`, no check wanted |
| `references/agent-handoff-verifier.md` | Step 5 in Codex: the checker's full text for a native worker (copy of `agents/handoff-verifier.md`) |
| `references/toolkit-commands.md` | Before the first `toolkit` command: one command per call, text in a command, exit codes |
| `references/work-item-format.md` | Step 2: section names, changing one section |
| `references/recording-owner-answers.md` | Step 2: an owner decision this session has not recorded |
| `references/tracker-local.md` | Step 2 with a local tracker |
| `references/tracker-notion.md` | Step 2 with a Notion tracker |
| `references/tracker-github.md` | Step 2 when `toolkit work` exits with code 3 on a GitHub Issues tracker |
| `references/tracker-jira.md` | Step 2 when `toolkit work` exits with code 3 on a Jira tracker |
| `references/current-focus.md` | Step 3: the focus format, the version check, a new focus |
| `references/memory-criteria.md` | Step 3 with Hindsight or Notion memory (built-in memory reads `.memory/memory-criteria.md`) |
| `references/proposals.md` | Step 3: an unanswered "Save to memory?" |
| `references/git-rules.md` | The prompt names a worktree or branch, or a save needs a commit |
| `references/backup-and-restore.md` | Step 6: what the backup holds, where it goes, and the backup folder setting |

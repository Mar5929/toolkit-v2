---
name: handoff
description: 'Updates this session''s work items and Current State, offers what is worth keeping to memory, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session or says "write a handoff", "I''m clearing context", "start a new session", or "check this handoff". Not for a recap alone; use session-summary.'
---

# Handoff

Leave the project ready for a fresh session, then give the owner a checked
prompt that session can start from. Never ask the owner to wait before he
clears context, and never hold back the prompt because a save or the check
failed.

Memory is saved with `managing-project-memory`. A Hindsight project has
no memory skills: use Hindsight's tools as `AGENTS.md`, "Project memory",
says.

## Steps

1. **Find this session's work items.** Only items this session worked on:
   those the conversation worked on (one only mentioned or listed does not
   count), the one this worktree's branch names (`claude/wi-007-<slug>`
   belongs to `WI-007`), and any this session changed. Never pick an item
   only because it is open: another session may be working on it. None: ask
   the owner which item, if any. "None": skip step 2.
2. **Update each of those work items** with `tracking-work-items`, reading
   it first. Add a Questions and Answers row for each
   answer or decision from this session that is not there yet. Rewrite the
   item's Current state in place so a new session can pick up from it alone
   (`.claude/rules/keep-work-item-current.md`). Change the State and
   `waiting_on` only when they changed in this session. Add one Recent
   History row "Handoff: <where work stopped>". Read the item back.
3. **Offer what is worth keeping to memory:** something the owner said to
   keep, an instruction for how the agent works that is not in
   `.claude/rules/owner-preferences.md` yet, a lasting fact or lesson, and a
   project-wide decision not yet offered. For a decision, add a row in its
   item's Questions and Answers and ask "This looks project-wide. Save it to
   memory too?" ("These look project-wide. Save them to memory too?" for
   several); a no keeps it from being offered again. Hand each yes to
   `managing-project-memory` (Hindsight: save a fact or decision with the
   add-on's tools after his yes, and write an instruction straight into
   `owner-preferences.md`). Nothing to keep: say so in one line.
4. **Update Current State.** Local and Hindsight memory: edit
   `memory/CURRENT_STATE.md` in the main checkout directly. Notion memory:
   the "Current state" page, with `managing-project-memory`; make no
   memory record. Read it right before you change it, then:
   - Rewrite "Next session starts with": one pointer per work item ("Continue
     WI-007 from its Current state. Goal: <one line>."), or with no work item
     a short note: the goal, where work stopped, the next action, and open
     questions.
   - Remove every line that is no longer true. Add this session's open items
     under Now, and a line under Waiting on the owner for each save question
     he has not answered. Set "Last updated:" to the date, `handoff`, and
     `agent`.
5. **Draft the prompt; do not show it yet.** Start from
   `assets/handoff-prompt-template.md`, written as instructions to an agent
   that knows nothing about this session. Keep a source for every claim: file,
   repository, owner (his words when you have them), or worked out, and for a
   file or repository claim where it is. Put "not confirmed" beside any claim
   no file, work item, memory record, or repository fact confirms.
6. **Check the draft** with the handoff verifier, as
   `references/handoff-verifier.md` says (paste the text of any Notion page
   or Hindsight memory the draft relies on). It fails to start or returns no
   report: say so in one line, write the prompt anyway, and say inside it
   that it was not checked. No tool starts a helper: check the draft
   yourself with the brief, and say inside the prompt that no independent
   check ran. Act on every verdict. Wrong: correct the prompt to what the
   repository or tracker says. Unchecked: keep the claim and write "not
   confirmed" beside it. Missing (the goal): add the goal; a prompt is never
   shown without one. Skipped: name the check in the short list. Start a
   second verifier only when you rewrote a whole section, giving it the Goal
   section and each rewritten section under "Draft prompt". Never start a
   third.
7. **Show the result**, in this order: the `session-summary` table, only
   when the owner also asked for a recap; the saves (anything not saved
   first, then what was saved and where); the short list ("Checked the
   handoff prompt: <n> fixed, <n> not confirmed.", then one line for each
   claim fixed, each labeled "not confirmed", and each check skipped); the
   prompt in one fenced block, with the fixed first line on top; and the
   last line, "Clear the context, then paste this prompt."

**Check a pasted prompt** ("check this handoff", "/handoff check"; Codex:
"$handoff check"): run only step 6, on the prompt exactly as given, with
"Sources for claims: none given" in the job block. Fix what is Wrong, label
what is Unchecked, and, when the verdict on the goal is Missing, write the
goal into the prompt from this conversation or from the work item the prompt
names; when neither shows it, ask the owner in one question. Put the fixed
first line on top if it is missing. Show the short list, then the corrected
prompt. Nothing is saved in this mode.

## Gotchas

- Every prompt starts with this line, word for word: "This handoff prompt is
  AI-generated and may contain hallucinations, skewed context, etc. Please
  evaluate accordingly."
- Saves come before the prompt. Once the prompt is on screen, the owner
  treats the session as over and the saves get skipped.
- `work-items/` and `memory/` live only in the main checkout (the first path
  `git worktree list` prints), and Git ignores them. From a worktree, edit
  them there. Never commit them. Current State is shared with other
  sessions: read it right before you change it and edit only the lines you
  change.
- A failed save never blocks the prompt. Lead with "Not saved" (the write
  failed) or "Saved but not verified" (the read-back differs), name the
  write, and put its content in the prompt.
- A save that changed a Git-tracked document (for example `requirements/` or
  `PROJECT.md`) is saved with `publish-docs`, not in this skill.
- Current State is missing: do not create it. Say so, suggest
  `project-setup` ("check the setup"), and put the entry in the prompt.

## References

| File | Open it when |
| --- | --- |
| [assets/handoff-prompt-template.md](assets/handoff-prompt-template.md) | Step 5: the fixed first line and the headings, to copy and fill |
| [references/handoff-verifier.md](references/handoff-verifier.md) | Step 6 and "/handoff check": how to start the verifier, its brief, and the job block |
| [examples/handoff-example.md](examples/handoff-example.md) | Steps 6 and 7: the job block, the saves lines, the short list, and a filled prompt |

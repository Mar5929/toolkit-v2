---
name: handoff
description: 'Updates this session''s work items and Current State, files any decision or original this session left unfiled, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session, clears context, or asks for a handoff prompt or a check of one, such as "write a handoff". Not for a recap alone; use session-summary.'
---

# Handoff

Leave the project ready for a fresh session, then give the owner a checked
prompt, so that a session that sees only the project's records and the
prompt can continue the work. Never ask the owner to wait before he clears context,
and never hold back the prompt because a save or the check failed.

## Steps

1. **Find this session's work items.** Only items this session worked on:
   those the conversation worked on (one only mentioned or listed does not
   count), the one this worktree's branch names (`claude/wi-007-<slug>`
   belongs to `WI-007`), and any this session changed. Never pick an item
   only because it is open: another session may be working on it. None: ask
   the owner which item, if any. "None": in step 2, update only the project
   tasks.
2. **Update each of those work items** with `using-work-tracker`, reading
   it first. Make its whole record true, as
   `.claude/rules/keep-work-item-current.md` says. Add a Questions and
   Answers row for each answer or decision from this session that is not
   there yet. Rewrite the item's Current state in place so a new session can
   pick up from it alone. Change the State and `waiting_on` only when they
   changed in this session. Add one Recent History row "Handoff: <where work
   stopped>". Read the item back. Then update each project task (`PT-01`: a
   task that belongs to no work item) this session worked on, by the step 1
   test: read it with `using-work-tracker`, make its status and who does
   it true, as `running-work-item-lifecycle`, "Levels", says, and read it back.
3. **File what this session left unfiled.** Step 2 saved each decision that
   only one work item needs. For the rest:
   - A decision or question from this session that more than one work item
     needs (the filing test in the root `AGENTS.md`) and that `DECISIONS.md`
     does not hold: `filing-project-records`, step "record a decision". One
     the owner has not confirmed is recorded as Open. Do not wait for the
     owner's answer before the prompt.
   - An original the owner gave this session that has no SRC ID:
     `filing-project-records`, step "file a source".
   - An instruction for how the agent works that is not written down:
     `curating-project-memory`.
   - What this session learned or did that no record holds: a fact about
     a person, the client, or the project, a claim nobody checked, a
     lesson with no work item, a meeting or other event, a run of a
     recurring job: `curating-project-memory`. A save that needs the
     owner's yes is kept as a proposal. Do not wait for the answer.
   - Read the Open entries in `DECISIONS.md` that this session raised or
     that name this session's work items. Each one goes under "Open
     questions" in the prompt, by its DEC ID.

   Nothing to file: say so in one line.
4. **Update Current State** through `using-memory-store` (Hindsight memory:
   `.claude/rules/hindsight-memory.md`).
   - Write "Next session starts with": one line per piece of work this
     session worked on. A work item: its ID and "read its Current state".
     A piece of work that is no work item: what it is and its next step.
   - A line under Now for one of this session's work items that is missing
     or no longer true: add or correct it as `running-work-item-lifecycle`
     says.
   - Check every other line, and remove each one that is no longer true,
     as `curating-project-memory` says (its Current State reference,
     "Removing what is no longer true"): a piece of work that ended, a
     date that passed, a thing owed that was delivered.
   - "Last updated" names the date, `handoff`, and `agent`.
5. **Draft the prompt; do not show it yet.** Start from
   `assets/handoff-prompt-template.md`, written as instructions to an agent
   that knows nothing about this session. Keep a source for every claim: file,
   repository, owner (the owner's words when you have them), or worked out,
   and for a file or repository claim where it is. Put "not confirmed" beside
   any claim no file, work item, or repository fact confirms.
6. **Check the draft** with the handoff verifier, started as
   `references/handoff-verifier.md` says. Act on every verdict:
   - Wrong: correct the prompt to what the repository or tracker says.
   - Unchecked: keep the claim and write "not confirmed" beside it.
   - Missing (the goal): add the goal. A prompt is never shown without one.
   - Skipped: name the check in the short list.

   The verifier fails to start or returns no report: say so in one line,
   write the prompt anyway, and say inside it that it was not checked. No
   tool starts a helper: check the draft yourself with the brief, and say
   inside the prompt that no independent check ran. Start a second verifier
   only when you rewrote a whole section, giving it the Goal section and each
   rewritten section under "Draft prompt". Never start a third.
7. **Show the result**, in this order: the `session-summary` table, only
   when the owner also asked for a recap; the saves (anything not saved
   first, then what was saved and where); the short list ("Checked the
   handoff prompt: <n> fixed, <n> not confirmed.", then one line for each
   claim fixed, each labeled "not confirmed", and each check skipped); the
   prompt in one fenced block, with the fixed first line on top; and the
   last line, "Clear the context, then paste this prompt."

## Checking a prompt the owner gives you

When the owner gives a handoff prompt written elsewhere and wants it
checked, run only step 6, on the prompt exactly as given, with "Sources for
claims: none given" in the job block. Fix what is Wrong and label what is
Unchecked. When the verdict on the goal is Missing, write the goal into the
prompt from this conversation or from the work item the prompt names; when
neither shows it, ask the owner in one question. Put the fixed first line on
top if it is missing. Show the short list, then the corrected prompt. Save
nothing.

## Gotchas

- Every prompt starts with this line, word for word: "This handoff prompt is
  AI-generated and may contain hallucinations, skewed context, etc. Please
  evaluate accordingly."
- Saves come before the prompt. Once the prompt is on screen, the owner
  treats the session as over and the saves get skipped.
- A failed save: lead with "Not saved" (the write failed) or "Saved but not
  verified" (the read-back differs), name the write, and put its content in
  the prompt.
- Current State is missing: do not create it. Say so, suggest the setup
  check, and put the entry in the prompt.

## Hand-offs

| For | Use |
| --- | --- |
| Reading and updating this session's work items and project tasks | `using-work-tracker` |
| What a project task is, when to tick it, and a work item's line under Now | `running-work-item-lifecycle` |
| A decision or question more than one work item needs, and an original | `filing-project-records` |
| An instruction for how the agent works; what no record holds yet; which lines of Current State are no longer true | `curating-project-memory` |
| Every read and write of Current State | `using-memory-store` |
| Hindsight memory: Current State, and an instruction for how the agent works | `.claude/rules/hindsight-memory.md` |
| The recap table, when the owner also asked for one | `session-summary` |
| Current State is missing | `project-setup` ("check the setup") |

## References

| File | Open it when |
| --- | --- |
| [assets/handoff-prompt-template.md](assets/handoff-prompt-template.md) | Step 5: the fixed first line and the headings, to copy and fill |
| [references/handoff-verifier.md](references/handoff-verifier.md) | Step 6, and checking a prompt the owner gives you: how to start the verifier, its brief, and the job block |
| [examples/handoff-example.md](examples/handoff-example.md) | Steps 6 and 7: the job block, the saves lines, the short list, and a filled prompt |

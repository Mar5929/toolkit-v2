---
name: handoff
description: 'Updates this session''s work items and Current State, offers what is worth keeping to memory, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session or says "write a handoff", "I''m clearing context", "start a new session", or "check this handoff". Not for a recap alone; use session-summary.'
---

# Handoff

Leave the project ready for a fresh session, then give the owner a checked
prompt, so that a session that sees only the project's records and the
prompt can carry on. Never ask the owner to wait before he clears context,
and never hold back the prompt because a save or the check failed.

## Steps

1. **Find this session's work items.** Only items this session worked on:
   those the conversation worked on (one only mentioned or listed does not
   count), the one this worktree's branch names (`claude/wi-007-<slug>`
   belongs to `WI-007`), and any this session changed. Never pick an item
   only because it is open: another session may be working on it. None: ask
   the owner which item, if any. "None": in step 2, update only the project
   tasks.
2. **Update each of those work items** with `tracking-work-items`, reading
   it first. Make its whole record true, as
   `.claude/rules/keep-work-item-current.md` says. Add a Questions and
   Answers row for each answer or decision from this session that is not
   there yet. Rewrite the item's Current state in place so a new session can
   pick up from it alone. Change the State and `waiting_on` only when they
   changed in this session. Add one Recent History row "Handoff: <where work
   stopped>". Read the item back. Then update each project task (`PT-01`: a
   task that belongs to no work item) this session worked on, by the step 1
   test: read it with `tracking-work-items`, make its status and who does
   it true, as `managing-work-items`, "Levels", says, and read it back.
3. **Offer what is worth keeping to memory.** At a handoff, save only what
   the owner asked to keep or says yes to here. `managing-project-memory`
   says what is worth keeping, how to ask, and how to save (Hindsight:
   `AGENTS.md`, "Project memory", and save with the add-on's tools after his
   yes). Do not wait for his answer before the prompt: count each save
   question asked here as not answered. Nothing to keep: say so in one line.
   Check `project-wide-records/` for intake receipts or shared questions
   this session touched. Leave each unfinished record with its source,
   affected destinations, and exact next action. Use
   `managing-project-wide-records` for their procedure.
4. **Update Current State.** Notion memory: use `managing-project-memory`.
   Local or Hindsight memory: edit `memory/CURRENT_STATE.md` in the main
   checkout (the first path `git worktree list` prints). Read it right
   before you change it, then:
   - Rewrite "Next session starts with": one pointer per work item ("Continue
     WI-007 from its Current state. Goal: <one line>."), or with no work item
     a short note: the goal, where work stopped, the next action, and open
     questions.
   - Remove every line that is no longer true. Under Now, make sure each of
     this session's work items that has left Backlog and is not Done or
     Cancelled has its line. Add a line under Waiting on the owner for each
     save question he has not answered.
   - Set "Last updated:" to the date, `handoff`, and `agent`.
   - Link a shared question in Current State only while it blocks active
     work. The shared question itself holds its full destination list.
5. **Draft the prompt; do not show it yet.** Start from
   `assets/handoff-prompt-template.md`, written as instructions to an agent
   that knows nothing about this session. Keep a source for every claim: file,
   repository, owner (his words when you have them), or worked out, and for a
   file or repository claim where it is. Put "not confirmed" beside any claim
   no file, work item, memory record, or repository fact confirms.
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
- Git ignores `memory/CURRENT_STATE.md`, so it is only in the main checkout:
  from a worktree, edit it there, and never commit it. Other sessions share
  it: edit only the lines you change.
- Current State is missing: do not create it. Say so, suggest the setup
  check, and put the entry in the prompt.

## Hand-offs

| For | Use |
| --- | --- |
| Reading and updating this session's work items and project tasks | `tracking-work-items` |
| What a project task is, and when to tick it | `managing-work-items` |
| Saving to memory | `managing-project-memory` (Hindsight: `AGENTS.md`, "Project memory") |
| Open intake receipts and shared questions | `managing-project-wide-records` |
| Notion memory: Current State | `managing-project-memory` |
| A save that changed a Git-tracked document, such as `requirements/` or `PROJECT.md` | `publish-docs` |
| The recap table, when the owner also asked for one | `session-summary` |
| Current State is missing | `project-setup` ("check the setup") |

## References

| File | Open it when |
| --- | --- |
| [assets/handoff-prompt-template.md](assets/handoff-prompt-template.md) | Step 5: the fixed first line and the headings, to copy and fill |
| [references/handoff-verifier.md](references/handoff-verifier.md) | Step 6, and checking a prompt the owner gives you: how to start the verifier, its brief, and the job block |
| [examples/handoff-example.md](examples/handoff-example.md) | Steps 6 and 7: the job block, the saves lines, the short list, and a filled prompt |

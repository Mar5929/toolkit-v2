---
name: handoff
description: 'Keeps this session''s work and project records current, reviews its chosen memory, and writes a checked prompt so the next session can continue. It also checks a prompt the owner provides. Use when the owner ends a session, clears context, asks for a handoff prompt, or asks to check one. For a recap without a handoff, use session-summary.'
---

# Handoff

The next session sees only the project's files and records and the handoff prompt. So save what this session knows first, then give the owner a prompt a separate agent has checked. Done when the project is ready for a new session and the owner has the checked prompt.

- Never ask the owner to wait before clearing context.
- Never hold back the prompt because a save or the check failed.

## The fixed first line

Every handoff prompt starts with this line, word for word:

```text
This handoff prompt is AI-generated and may contain hallucinations, skewed context, etc. Please evaluate accordingly.
```

## Steps

Save before you show the prompt: once it's on screen, the owner treats the session as over and the saves get skipped.

1. **Find this session's work items.** One belongs to this session if the owner and agent worked on it here (a mention or listing doesn't count), this worktree's branch names it (`claude/wi-007-<slug>` is `WI-007`), or this session changed it. Never pick one only because it's open; another session may own it. If none qualifies, ask the owner which one this session worked on; if "None", only project tasks get updated in step 2.
2. **Update each work item** with `managing-work-items`: make every part of it true, add a Questions and Answers row for each answer or decision not there yet, rewrite Current state so a new session can resume from it alone, change State and `waiting_on` only if they changed here, and add the Recent History row "Handoff: <where work stopped>". Then make each project task this session worked on true. Read each back.
3. **File what's still unfiled**, keeping each record's source and approval evidence. Say so briefly if there's nothing.
   - A decision or question more than one work item needs, not yet in the shared records: `filing-project-records`, record a decision. Unconfirmed by the owner, it's an open question; don't wait for an answer.
   - A source with no SRC ID: `filing-project-records`, file a source.
   - An unwritten instruction for how the agent works, and anything learned or done that no record holds (a fact, an unchecked claim, a lesson with no work item, an event, a recurring job's run): `managing-project-memory`.
   - Shared open questions this session raised or that name its work items: list each under "Open questions" in the prompt, with its ID or link.
4. **Tell `managing-project-memory` this session is handing off**, so it saves the context for the next session.
5. **Draft the prompt; don't show it yet.** Start from `assets/handoff-prompt-template.md`. Write for an agent that knows nothing of this session. Note each claim's source (a file, the repository, the owner with their words, or worked out) for the verifier, and mark "not confirmed" any claim no file, work item, or repository fact confirms.
6. **Check it with the handoff verifier**, a helper that compares the draft with the repository and work items and changes nothing. `references/handoff-verifier.md` holds how to start it, its brief, and the inputs to fill in. Act on every verdict:

   | Verdict | Do |
   | --- | --- |
   | Wrong | Correct the claim to what the repository or the work tracker says. |
   | Unchecked | Keep it, marked "not confirmed". |
   | Missing (goal only) | Add the goal. Never show a prompt with no goal. |
   | Skipped | Name the check in the results you show. |

   If the verifier doesn't start or returns no report, say so and write the prompt anyway, saying inside it that it wasn't checked. If no tool can start a helper, check it yourself with the brief and say inside the prompt that no independent check ran. After changes that touch the goal or checked claims, send the verifier the Goal and the changed sections again, until every claim is supported or marked.
7. **Show, in this order:** the `session-summary` table (only if the owner also asked for a recap); the saves, failures first; the check results (what was corrected, what's still "not confirmed", what was skipped); the prompt in one fenced block with the fixed first line on top; and how to start the next session with it. Put anything that didn't save into the prompt.

## Checking a prompt the owner gives you

Run only step 6 and save nothing. Check the prompt exactly as given, with "Sources for claims: none given". Correct Wrong claims and mark Unchecked ones. If the goal is Missing, write it from this session or the work item the prompt names; if neither shows it, ask the owner one question. Put the fixed first line on top if it's missing. Show the check results, then the corrected prompt.

## References

| File | Open it when |
| --- | --- |
| `assets/handoff-prompt-template.md` | Step 5: the headings to fill in. |
| `references/handoff-verifier.md` | Step 6, or checking an owner's prompt: starting the verifier, its brief, and its inputs. |
| `examples/handoff-example.md` | Steps 6 and 7: a filled input list, save lines, check results, and prompt. |

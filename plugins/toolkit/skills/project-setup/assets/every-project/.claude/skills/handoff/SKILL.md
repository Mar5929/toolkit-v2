---
name: handoff
description: 'Updates this session''s work items and the project''s Current State, files decisions or sources left unfiled, and writes a checked, self-contained prompt for the next session or checks one the owner provides. Use when the owner ends a session, clears context, asks for a handoff prompt, or asks to check one. For a recap without a handoff, use session-summary.'
---

# Handoff

Use this skill when a session ends, so that a new session can continue the work. A session is one chat with the agent. When the owner clears context, the agent no longer sees this session. The new session sees only the project's files and records and the handoff prompt. So this skill first saves what this session knows, and then gives the owner a prompt that a separate agent has checked.

The job is done when the project is ready for a new session and the owner has the checked prompt.

Two rules apply to every step:

- Never ask the owner to wait before the owner clears context.
- Never hold back the prompt because a save or the check failed.

A recap alone, with no handoff, is the job of `session-summary`.

## The first line of every prompt

Every handoff prompt starts with this line, word for word:

```text
This handoff prompt is AI-generated and may contain hallucinations, skewed context, etc. Please evaluate accordingly.
```

This skill calls it the fixed first line.

## Steps

Do the steps in this order. Steps 1 to 4 save what this session knows. Steps 5 to 7 write the prompt, check it, and show it. The saves come before the prompt, because once the prompt is on screen the owner treats the session as over, and the saves get skipped.

1. **Find this session's work items.** Choose only the work items that belong to this session. A work item belongs to this session in three cases:
   - The owner and the agent worked on the work item in this session. A work item that was only mentioned or listed does not count.
   - The branch of this session's worktree names the work item. For example, the branch `claude/wi-007-<slug>` belongs to `WI-007`. A worktree is a separate folder with its own branch.
   - This session changed the work item.

   Never choose a work item only because it is open, because another session may be working on it.
   - When no work item belongs to this session, ask the owner which work item this session worked on, if any.
   - When the owner answers "None", update only the project tasks in step 2.
2. **Update each of those work items** with `managing-work-items`. For each work item:
   - Read the work item first.
   - Make every part of the work item true, as the rule `.claude/rules/keep-work-item-current.md` says.
   - Add a Questions and Answers row for each answer or decision from this session that is not there yet.
   - Rewrite the work item's Current state in place, so that a new session can continue from the Current state alone. The work item's Current state is the five lines at the top of the work item.
   - Change the State and `waiting_on` only when they changed in this session.
   - Add one Recent History row: "Handoff: <where work stopped>".
   - Read the work item back.

   Then update each project task that this session worked on. A project task is a task that belongs to no work item, with an ID such as `PT-01`. Use the test of step 1 to decide whether this session worked on a project task. For each project task:
   - Read the project task with `managing-work-items`.
   - Make its status and who does it true. `managing-work-items`, section "Levels", says what a project task is and when to tick it.
   - Read the project task back.
3. **File what this session left unfiled.** Step 2 saved each decision that only one work item needs. Go through the five kinds below for the rest.
   - **A decision or a question that more than one work item needs.** When one came from this session and `DECISIONS.md` does not hold it, record it with `filing-project-records`, step "record a decision". The root `AGENTS.md`, section "Where information goes", gives the test for whether more than one work item needs it. When the owner has not confirmed it, record it as Open. Do not wait for the owner's answer before you write the prompt.
   - **A source with no SRC ID.** A source is anything the project was given and keeps, such as a transcript or an email. When the owner gave this session a source that has no SRC ID, file it with `filing-project-records`, step "file a source".
   - **An instruction for how the agent works that is not written down.** Give it to `managing-project-memory`. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in its place.
   - **What this session learned or did that no record holds.** This kind covers a fact about a person, the client, or the project; a claim nobody checked; a lesson with no work item; a meeting or other event; and a run of a recurring job. Give each one to `managing-project-memory`. When a save needs the owner's yes, `managing-project-memory` keeps it as a proposal, which is a save the owner has not said yes to. Do not wait for the owner's answer.
   - **An Open entry in `DECISIONS.md`.** Read the Open entries that this session raised or that name this session's work items. Put each one under "Open questions" in the prompt, with its DEC ID.

   When there is nothing to file, say so in one line.
4. **Update the project's Current State.** The project's Current State is the project's one short page of what is true now. Read and write it with `managing-project-memory`. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in place of `managing-project-memory`.
   - Write the part "Next session starts with". It has one line for each piece of work that this session worked on.
     - For a work item, the line holds the work item's ID and the words "read its Current state".
     - For a piece of work that is not a work item, the line says what the work is and its next step.
   - Check the line under "Now" for each of this session's work items. When that line is missing or no longer true, add or correct it as `managing-work-items` says.
   - Check every other line, and remove each line that is no longer true, for example a piece of work that ended, a date that passed, or a thing owed that was delivered. The reference file on the project's Current State in `managing-project-memory`, section "Removing what is no longer true", says how.
   - Set the "Last updated" line to the date, `handoff`, and `agent`.
   - When the project's Current State is missing, do not create it. Tell the owner that it is missing, and suggest the setup check (`project-setup`, "check the setup"). Put in the prompt the entry that this step would have written.
5. **Draft the prompt. Do not show it yet.**
   - Start from the template `assets/handoff-prompt-template.md`. It holds the fixed first line and the headings.
   - Write the prompt as instructions to an agent that knows nothing about this session.
   - Keep a note of where every claim comes from. A claim comes from one of four places: a file, the repository, the owner, or it was worked out. For a claim from the owner, keep the owner's words when you have them. For a claim from a file or the repository, keep where the claim is found. These notes fill the "Sources for claims" line of the list of inputs in step 6.
   - Write "not confirmed" beside any claim that no file, work item, or repository fact confirms.
6. **Check the draft** with the handoff verifier. The handoff verifier is a helper: a separate agent that sees only the instructions you give it. It compares the draft with the repository and the work items, and it changes nothing. `references/handoff-verifier.md` says how to start it, and holds its brief and the list of inputs that you fill in. A brief is a helper's instructions.

   The verifier's report gives a verdict for the goal and for each claim. Act on every verdict:

   | Verdict | What you do |
   | --- | --- |
   | Wrong | Correct the prompt to what the repository says, or to what is saved where the work items are kept. |
   | Unchecked | Keep the claim, and write "not confirmed" beside it. |
   | Missing (given only for the goal) | Add the goal. Never show a prompt that has no goal. |
   | Skipped | Name the check in the check results that step 7 shows. |

   Three cases change this step:
   - When the verifier fails to start or returns no report, say so in one line, and write the prompt anyway. Say inside the prompt that it was not checked.
   - When no tool can start a helper, check the draft yourself with the brief, and say inside the prompt that no independent check ran.
   - Start a second verifier only when you rewrote a whole section. Give it the Goal section and each rewritten section under "Draft prompt". Never start a third verifier.
7. **Show the result**, with its parts in this order:
   1. The `session-summary` table. Show it only when the owner also asked for a recap.
   2. The saves: first anything that was not saved, then what was saved and where.
   3. The check results. The first line is "Checked the handoff prompt: <n> fixed, <n> not confirmed." Then comes one line for each claim that you fixed, one line for each claim labeled "not confirmed", and one line for each check that was skipped.
   4. The prompt in one fenced block, with the fixed first line on top.
   5. The last line: "Clear the context, then paste this prompt."

   When a save failed, do three things:
   - Start its line with "Not saved" when the write failed, or with "Saved but not verified" when what you read back differs from what you wrote.
   - Name the write.
   - Put the content of the write in the prompt.

## Checking a prompt the owner gives you

When the owner gives you a handoff prompt that was written elsewhere and wants it checked, run only step 6, and save nothing.

- Check the prompt exactly as the owner gave it.
- In the list of inputs for the verifier, write "Sources for claims: none given".
- Correct what has the verdict Wrong, and write "not confirmed" beside what has the verdict Unchecked.
- When the verdict on the goal is Missing, write the goal into the prompt from this session, or from the work item that the prompt names. When neither shows the goal, ask the owner in one question.
- When the fixed first line is missing, put it on top.
- Show the check results, then the corrected prompt.

## Work that another skill does

| For | Use |
| --- | --- |
| Reading and updating this session's work items and project tasks | `managing-work-items` |
| What a project task is, when to tick it, and a work item's line under "Now" in the project's Current State | `managing-work-items` |
| A decision or a question that more than one work item needs, and a source | `filing-project-records` |
| An instruction for how the agent works; what no record holds yet; which lines of the project's Current State are no longer true | `managing-project-memory` |
| Every read and write of the project's Current State | `managing-project-memory` |
| In a project with Hindsight memory: the project's Current State, and an instruction for how the agent works | `.claude/rules/hindsight-memory.md` |
| The recap table, when the owner also asked for one | `session-summary` |
| The project's Current State is missing | `project-setup` ("check the setup") |

## References

| File | Open it when |
| --- | --- |
| [assets/handoff-prompt-template.md](assets/handoff-prompt-template.md) | Step 5: you need the fixed first line and the headings of the prompt, to copy and fill in. |
| [references/handoff-verifier.md](references/handoff-verifier.md) | Step 6, and when you check a prompt the owner gives you: you need the way to start the verifier, its brief, and the list of inputs. |
| [examples/handoff-example.md](examples/handoff-example.md) | Steps 6 and 7: you need to see a filled list of inputs, the lines for the saves, the check results, and a filled prompt. |

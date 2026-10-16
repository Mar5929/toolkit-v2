# Closing

The goal: the item is closed, and its Kept for the project line records what the whole project keeps from it.

## Reflecting

Reflecting comes after the owner approves the result and before anything merges.

1. Confirm the item is complete: every task ticked or cancelled, completed phases Done, no open Q&A rows, every sub-item Done, Cancelled, or moved, and Current state matching the fields.
2. Confirm the requirements match what was built, using the checker's verdicts. Any drift is a requirement change.
3. Write the lessons under Notes, "Lessons not proven yet", with the date each was seen.
4. Fix `PROJECT.md` or a README only if this item made it untrue. Commit through `publish-docs` and note it in Recent History.

Then, if there's something to merge or deploy, go to Deploying. If not (research, a decision, a document), note why and go to Marking Done.

## Kept for the project

Fill the Kept for the project line at every close, including cancellations and closes the owner made by hand. Never close an item with it empty. It lists what the whole project keeps from this item: the shared decisions, system rules, and terms it added or changed, filed through `filing-project-records` and named by ID, and the lessons that became a rule, a skill, or memory. "None: <reason>" is a valid value when nothing qualifies.

Run these steps before the closing question. `filing-project-records` and `managing-project-memory` decide where each record is filed.

1. **List what the project may need to keep.** Read the item's Q&A rows marked Decision? yes, its design, its Related items, and its lessons not proven yet. List:
   - decisions more than one work item needs that are not recorded yet;
   - rules several items rely on that this item added, changed, or retired, and that the project's system documents do not show yet;
   - possibly-built rules: approved rules whose behavior this item's requirements built or changed. Naming or documenting a rule does not count, and a cancelled item builds nothing;
   - project terms the item added or changed that the project's record of terms does not show yet;
   - lessons with no outcome, with every date each was seen. Check memory first with `managing-project-memory`.
2. **Ask the owner once**, when the list holds anything other than possibly-built rules: one Q&A row that shows each line with a recommendation and a one-line reason. For a lesson, the choices are keep for the whole project, keep as not proven, or drop; recommend keeping a lesson that was seen before.
3. **File what the owner agreed to.**
   - Decisions, open questions, and lessons about the system or the project: record a decision with `filing-project-records`.
   - Rules to add, change, or retire, possibly-built rules, and terms: update a system document with `filing-project-records`.
   - Lessons about how to do a step or how the agent works, and lessons kept as not proven: `managing-project-memory`.
4. **Write each ID as `filing-project-records` says.** When a save is not confirmed yet, stop, tell the owner what waits, and have `managing-project-memory` record the wait.
5. **Mark each lesson's outcome** at the end of its line, for example "Kept: <record ID>.", "Kept: owner-preferences.md.", "Kept in memory.", "Kept in work item.", or "Dropped (Q-12)."
6. **Fill the line** with every record this item added or changed, by ID and with what happened, every term it touched, and anything filed earlier in the item; or "None: <reason>". Add a Recent History row that names the Q-ID from step 2, or says no question was needed.

## Marking Done

1. Confirm everything is merged (or the owner said to leave it), each deploy is recorded, and completed phases are Done.
2. Fill the Kept for the project line, as "Kept for the project" says.
3. Ask as a Q&A row, evidence first: the checker's verdict and commit, the merged pull request, the deploy result, and the Kept for the project line.
4. On yes: save the owner's words, set Done and `waiting_on: none`, and rewrite Current state as "Done on <date>: <evidence>.", "None. Finished.", "Nothing.", and "None."
5. Tell `managing-project-memory` the item closed. For a top-level item, check whether its project phase is now finished.
6. On no: record it, turn each problem into a task, and go back to Building. Re-test and refill the Kept for the project line before asking again.
7. Report whether the work reached the default branch, what was deployed, and what the project kept. End with the leftover-branch question below, or "Tell me the next thing to build."

## Small items

A small item runs the Reflecting checklist while still in the Testing Loop, then goes to Deploying or Marking Done. One closing question replaces the result approval, the Kept for the project question, and the Done question.

- Show the result as `testing-loop.md` says, plus the list from "Kept for the project", step 1 (each line with a recommendation), and any merge, deploy, or data load still to come, with who runs it. Say the yes doesn't cover that.
- On yes: save the words, set `result_approved`, add an answered row for each kept line, go through Deploying if needed, then do Marking Done without asking again.
- On no: add tasks, go back to Building, and ask again in a new row.

## Cancelling

Record the owner's reason. Ask what happens to each open sub-item: cancel it, move it to the top level, or move it under another item. Fill the Kept for the project line. Set Cancelled and `waiting_on: none`, and rewrite Current state as "Cancelled on <date>: <reason>." and "None. Cancelled." Tell `managing-project-memory`. Leave the pull request, branch, and worktree until the owner decides, and delete nothing.

## Closed by hand

The owner's change stands. Note it in Recent History, tell the owner what hadn't happened yet (approval, checker, merge), and ask what to do. Fill the Kept for the project line regardless, rewrite Current state, and tell `managing-project-memory`.

## Leftover branches and worktrees

`merge-and-clean-up` removes the merged worktree and branch. After closing, find any of the item's branches and worktrees it left behind, such as a builder's branch that was never merged or a worktree from a cancelled item. Offer to remove each one that's merged and has no uncommitted changes, and remove it only after a yes, never with `--force`. Name the rest and leave them. If the main checkout shows any of the item's files uncommitted, name them and ask; never commit, stash, or remove them yourself.

One message can answer several questions if it names each one. Record one row per question.

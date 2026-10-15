# Closing

The goal: the item is closed, and its Moved up line records what the whole project keeps from it.

## Reflecting

Reflecting comes after the owner approves the result and before anything merges.

1. Confirm the item is complete: every task ticked or cancelled, completed phases Done, no open Q&A rows, every sub-item Done, Cancelled, or moved, and Current state matching the fields.
2. Confirm the requirements match what was built, using the checker's verdicts. Any drift is a requirement change.
3. Write the lessons under Notes, "Lessons not proven yet", with the date each was seen.
4. Fix `PROJECT.md` or a README only if this item made it untrue. Commit through `publish-docs` and note it in Recent History.

Then, if there's something to merge or deploy, go to Deploying. If not (research, a decision, a document), note why and go to Marking Done.

## The Moved up line

Fill it at every close, including cancellations and closes the owner made by hand. Never close an item with it empty. It lists what the whole project keeps from this item: the shared decisions, system rules, and terms it added or changed, filed through `filing-project-records` and named by ID, and the lessons moved up to a rule, a skill, or memory. "None" is a valid answer when nothing qualifies.

## Marking Done

1. Confirm everything is merged (or the owner said to leave it), each deploy is recorded, and completed phases are Done.
2. Fill the Moved up line.
3. Ask as a Q&A row, evidence first: the checker's verdict and commit, the merged pull request, the deploy result, and the Moved up line.
4. On yes: save the owner's words, set Done and `waiting_on: none`, and rewrite Current state as "Done on <date>: <evidence>.", "None. Finished.", "Nothing.", and "None."
5. Tell `managing-project-memory` the item closed. For a top-level item, check whether its project phase is now finished.
6. On no: record it, turn each problem into a task, and go back to Building. Re-test and refill the Moved up line before asking again.
7. Report whether the work reached the default branch, what was deployed, and what the project kept. End with the leftover-branch question below, or "Tell me the next thing to build."

## Small items

One closing question replaces the result approval, the Moved up question, and the Done question. The item stays in the Testing Loop and skips Reflecting.

- Run the Reflecting checklist first.
- Show the result as `testing-loop.md` says, plus any lines to keep for the whole project (each with a recommendation), and any merge, deploy, or data load still to come, with who runs it. Say the yes doesn't cover that.
- On yes: save the words, set `result_approved`, add an answered row for each kept line, go through Deploying if needed, then do Marking Done without asking again.
- On no: add tasks, go back to Building, and ask again in a new row.

## Cancelling

Record the owner's reason. Ask what happens to each open sub-item: cancel it, move it to the top level, or move it under another item. Fill the Moved up line. Set Cancelled and `waiting_on: none`, and rewrite Current state as "Cancelled on <date>: <reason>." and "None. Cancelled." Tell `managing-project-memory`. Leave the pull request, branch, and worktree until the owner decides, and delete nothing.

## Closed by hand

The owner's change stands. Note it in Recent History, tell the owner what hadn't happened yet (approval, checker, merge), and ask what to do. Fill the Moved up line regardless, rewrite Current state, and tell `managing-project-memory`.

## Leftover branches and worktrees

After closing, find the item's leftover branches and worktrees. Offer to remove each one that's merged and has no uncommitted changes, and remove it only after a yes, never with `--force`. Name the rest and leave them. If the main checkout shows any of the item's files uncommitted, name them and ask; never commit, stash, or remove them yourself.

One message can answer several questions if it names each one. Record one row per question.

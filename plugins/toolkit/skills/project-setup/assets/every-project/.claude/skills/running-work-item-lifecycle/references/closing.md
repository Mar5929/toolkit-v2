# Closing

Takes an item whose result the owner approved through Reflecting, and closes it as Done or Cancelled. Every close answers "The closing question" and records the answer in the item's Moved up line: Done, Cancelled, and an item the owner closed by hand. Never set an item to Done or Cancelled while its Moved up line is empty.

## Contents

- Reflecting
- The closing question
- Marking Done
- Cancelling an item
- Done or Cancelled by hand
- Leftover branches and worktrees
- Gotchas

## Reflecting

The State after the owner approved the result, before anything is merged. Go through the checklist in order.

1. **The work item is tidy and current.**
   - Every task is ticked or cancelled, and every phase the item completed says Done.
   - No question row is left Open.
   - Every sub-item is Done or Cancelled, or was moved to another item.
   - The Current state matches the item's State, `waiting_on`, and approvals.
2. **The requirements match what was built.** Compare each approved requirement with the checker's verdicts in Recent History. A requirement the build changed is a change to a requirement: handle it as `refining-requirements.md`, step 7, says.
3. **Lessons are written down.** Under Notes, "Lessons not proven yet", add each thing the build or the tests taught that a later item would otherwise find out again.
4. **`PROJECT.md` and the READMEs are still true.** Change one only when the item made what it says out of date. Save it with `publish-docs`, and name the file and the commit in a Recent History row. A change to the project's phases is saved with `using-work-tracker`.

Then:

- Something to merge or deploy: the item moves to Deploying.
- Nothing to merge or deploy (research, a decision, a document): add the Recent History row "Nothing to merge or deploy: Deploying skipped.", then go to "Marking Done".

## The closing question

Did this item change `system/` or `DECISIONS.md`?

1. **List what moves up.** Read the item's Questions and Answers rows marked Decision? `yes`, its design, its Related items line, and its Notes, "Lessons not proven yet". List:
   - each decision that passes the filing test (root `AGENTS.md`, "Where information goes") and whose row does not end "Filed as DEC-###";
   - each rule several work items rely on that this item added, changed, or retired, and that `system/` does not show yet;
   - each rule this item may have delivered: one on this list, or one `system/` holds with the mark Approved, that a requirement of this item rests on. `filing-project-records`, step "update a system document", holds the conditions for delivered and checks them. A cancelled item delivered nothing;
   - each lesson with no outcome at the end of its line.
2. **Ask the owner once,** when the list holds a decision, a rule to add, change, or retire, or a lesson. Add one Questions and Answers row that shows each line with your recommendation and a one-line reason. For a lesson, the choice is move up or drop. Set `waiting_on` to the owner, and end the reply with "Do these move up as listed?" A list that holds only delivered rules, or nothing, needs no question.
3. **File what he agreed to** with `filing-project-records`:
   - a decision or an open question: step "record a decision";
   - a rule to add, change, or retire: step "update a system document";
   - a delivered rule: step "update a system document", to set its mark to Built with this item's ID;
   - a lesson that moves up, about the system or the project: step "record a decision";
   - a lesson that moves up, about how the agent works: hand it to `curating-project-memory`, which writes the line in `.claude/rules/owner-preferences.md` (Hindsight memory: `.claude/rules/hindsight-memory.md`).
4. **Write each lesson's outcome** at the end of its line: "Moved up: DEC-021.", "Moved up: owner-preferences.md.", or "Dropped (Q-12)."
5. **Fill Moved up:** every entry in `DECISIONS.md` and every rule in `system/` that this item added or changed, by ID, with what happened to it. Include the ones filed before this step (rows that end "Filed as DEC-###"). When there are none: "Nothing: <the reason>." Write an ID on the line only after `filing-project-records` reports that the main checkout holds its save. When it reports that the main checkout does not hold it, stop here and tell the owner what it reported. Add a Recent History row that names the Q-ID, or says that no question was needed.

## Marking Done

1. **Check** that every change is merged, or he said to leave it on its branch; that each deploy's result is recorded; and that every Roadmap phase the item completed says Done.
2. **Answer the closing question** (above).
3. **Ask.** Add the row, with Next action "Waiting on the owner: Q-12 (mark WI-031 Done). After his answer: record Done." Put the evidence in one line first: the checker's verdict and commit, the merged pull request, the deploy result, and the Moved up line. End the reply with "Mark WI-031 Done?"
4. **After his yes,** save his words first. Set the State to Done and `waiting_on` to `none`, and rewrite the Current state: Where it stands "Done on `YYYY-MM-DD`: <evidence>.", Next action "None. Finished.", Waiting on "Nothing.", Blockers "None."
5. **Update the project's Current State** (`SKILL.md`, "Hand-offs"). Remove the item's line under Now. Then hand the rest to `curating-project-memory`, "Current State" (Hindsight memory: `.claude/rules/hindsight-memory.md`): a line under "Waiting on the owner" about this item, and a "Next session starts with" line that names it. A top-level item: check its project phase, as `SKILL.md`, "Levels", says.
6. **After a "no":** record his words, turn each problem into a task, and move the item back to Building. After the fix, the Testing Loop runs again, and the closing question is answered again, before you ask again.
7. **Report:** whether the work reached the default branch, what was deployed, and what moved up. End with the leftover branches and worktrees question below. Nothing to ask: "Tell me the next thing to build."

## Cancelling an item

1. Record his reason in his words as an answered row.
2. Ask about each open sub-item: cancel it, move it to the top level, or move it under another item.
3. Answer the closing question.
4. Set the State to Cancelled and `waiting_on` to `none`. Rewrite the Current state: Where it stands "Cancelled on `YYYY-MM-DD`: <his reason>.", Next action "None. Cancelled."
5. Update the project's Current State, as in "Marking Done", step 5.
6. Its open pull request, branch, and worktree stay until he says what to do. Nothing is deleted.

## Done or Cancelled by hand

The owner marked it Done or Cancelled himself: that counts. Never undo it.

1. Add the Recent History row "Marked Done by the owner by hand on `YYYY-MM-DD`" (or Cancelled).
2. Tell him in one line what had not happened yet (result approval, checker, merge, the closing question), and ask what he wants done about it.
3. Answer the closing question, whatever he says about the rest.
4. Rewrite the Current state with the Done or Cancelled wording above, and update the project's Current State, as in "Marking Done", step 5.

## Leftover branches and worktrees

After Done or Cancelled, list `git worktree list` and `git branch --list '*wi-007*'` (the ID in lower case). For each one left, check whether its commits reached the default branch and whether its worktree has uncommitted changes.

- Offer to remove each merged, clean one, with a one-line reason. Remove it only after his yes: `git -C <main checkout> worktree remove <folder>`, then `git branch -d <branch>`. Never `--force`. Name any other one to him and leave it.
- `git -C <main checkout> status` must show none of the item's files uncommitted. When it does, name them and ask. Never commit, stash, or remove them yourself.

## Gotchas

- One message may answer several questions when his words name each, for example the merge and Done: add one row per question, each with his words.

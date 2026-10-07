# Closing

Use this file to take a work item through Reflecting after the owner approved its result, and to close a work item as Done or Cancelled. The job is done when the work item is closed and its Moved up line says what the work item added or changed in `DECISIONS.md` and `system/`.

Fill the Moved up line at every close: when you mark a work item Done, when you cancel it, and when the owner closed it by hand. The section "Filling the Moved up line" gives the steps. Never set a work item to Done or Cancelled while its Moved up line is empty.

## Contents

- Reflecting
- Filling the Moved up line
- Marking Done
- Closing a small work item
- Cancelling a work item
- Done or Cancelled by hand
- Leftover branches and worktrees
- When one message answers several questions

## Reflecting

Reflecting is the State after the owner approved the result and before anything is merged. Go through this checklist in order.

1. Check that the work item is complete and up to date. All four of these must be true:
   - Every task is ticked or cancelled, and every phase that the work item completed says Done.
   - No Questions and Answers row is left Open.
   - Every sub-item is Done or Cancelled, or was moved to another work item.
   - The work item's Current state matches its State, its `waiting_on`, and its approvals.
2. Check that the requirements match what was built. Compare each approved requirement with the checker's verdicts in Recent History. When the build changed a requirement, treat the changed requirement as a change to a requirement. `refining-requirements.md`, step 7, gives the steps for a change to a requirement.
3. Write down the lessons. Under Notes, "Lessons not proven yet", add each thing that the build, the tests, or a deployment taught, and that a later work item would otherwise find out again. Write the date it was seen with each one.
4. Check that `PROJECT.md` and the READMEs are still true. Change one of them only when the work item made what it says out of date.
   - Commit the change with `publish-docs`, and name the file and the commit in a Recent History row.
   - Save a change to the project's phases with `references/work-tracker.md`.

After the checklist, do one of these:

- When the work item has something to merge or deploy, move it to Deploying.
- When the work item has nothing to merge or deploy, for example research, a decision, or a document, add the Recent History row "Nothing to merge or deploy: Deploying skipped." Then go to "Marking Done".

## Filling the Moved up line

The Moved up line is a line in the work item's Overview. It answers one question: did this work item change `system/` or `DECISIONS.md`? Do these six steps at every close.

1. List what the whole project may need to keep. Read the work item's Questions and Answers rows marked Decision? `yes`, its design, its Related items line, and its Notes, "Lessons not proven yet". Put these five kinds of thing on the list:
   - Each decision that more than one work item needs, and whose row does not end "Filed as DEC-###". The root `AGENTS.md`, section "Where information goes", gives the test for whether more than one work item needs a decision.
   - Each rule that several work items rely on, that this work item added, changed, or retired, and that `system/` does not show yet.
   - Each rule that this work item may have built. Such a rule is one whose behaviour a requirement of this work item built or changed. It is either a rule already on this list, or a rule that `system/` holds with the mark Approved. The mark is the word on a rule in `system/` that says whether the rule is Draft, Approved, Built, or Retired.
     - A work item that only names, explains, or documents a rule did not build what the rule says.
     - A cancelled work item did not build what any rule says.
     - `filing-project-records`, step "update a system document", holds the conditions for when a work item built what a rule says, and it checks them.
   - Each project term that this work item added or changed, and that `system/glossary.md` does not show yet.
   - Each lesson that has no outcome at the end of its line. Step 5 gives the four outcomes. Before you list a lesson, search memory for the same lesson with `managing-project-memory`. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in place of `managing-project-memory`. When the lesson was seen before, in another work item or another session, list it with the dates it was seen.
2. When the list holds a decision, a rule to add, change, or retire, a project term, or a lesson, ask the owner once. When the list holds only rules that the work item may have built, or holds nothing, ask no question.
   - Add one Questions and Answers row that shows each line of the list with your recommendation and a one-line reason.
   - For a lesson, the owner chooses one of three: keep it for the whole project, keep it as not proven, or drop it. Recommend keeping a lesson for the whole project when it was seen before.
   - Set `waiting_on` to the owner, and end the reply with exactly "Do these move up as listed?" In that question, "move up" means that the owner agrees to keep the thing for the whole project.
3. File what the owner agreed to. This table says what to do with each thing.

   | What it is | What to do |
   | --- | --- |
   | A decision or an open question | `filing-project-records`, step "record a decision" |
   | A rule to add, change, or retire | `filing-project-records`, step "update a system document" |
   | A rule that this work item may have built | `filing-project-records`, step "update a system document". That step checks the conditions and, when they are met, sets the rule's mark to Built, with this work item's ID. |
   | A project term | `filing-project-records`, step "update a system document" |
   | A lesson that the owner agreed to keep for the whole project, and that is about the system or the project | `filing-project-records`, step "record a decision" |
   | A lesson that the owner agreed to keep for the whole project, and that is about how to do a step, such as a deploy, a data load, or a test, or about how the agent works | Give the lesson to `managing-project-memory`, which writes the line in `.claude/rules/owner-preferences.md`. |
   | A lesson that is kept as not proven | Give the lesson to `managing-project-memory`, with the work item's ID and the dates it was seen. |

   In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in place of `managing-project-memory`.
4. Do this step only when work items are local files: check that the main checkout holds each save. The main checkout is the project's main folder, which is the first path that `git worktree list` prints. With each ID, `filing-project-records` reports whether the main checkout holds the save of that record. Steps 5 and 6 write those IDs into the work item, and `.claude/hooks/validate-records.mjs`, the command that checks the records, looks up each ID in the main checkout.
   - When the main checkout does not hold a save, stop here, and tell the owner what `filing-project-records` reported. `filing-project-records` records in the project's Current State that the ID is still to be written in the work item.
   - When the main checkout holds the save, continue from this step.
5. Write each lesson's outcome at the end of its line. The outcome is one of these four, with the real ID in place of the example:
   - "Moved up: DEC-021."
   - "Moved up: owner-preferences.md."
   - "Kept in memory."
   - "Dropped (Q-12)."
6. Fill the Moved up line.
   - Name every entry in `DECISIONS.md` and every rule in `system/` that this work item added or changed. Name each one by its ID, and say what happened to it.
   - Name every project term in `system/glossary.md` that this work item added or changed, by the term.
   - Include the entries and rules that were filed before this step. The Questions and Answers rows of those entries end "Filed as DEC-###".
   - When there are none, write "Nothing: <the reason>."
   - Add a Recent History row that names the Q-ID of the question from step 2, or says that no question was needed.

## Marking Done

Use this section after Deploying, or after Reflecting when the work item has nothing to merge or deploy.

For a small work item on the short path whose owner answered the closing question, "Closing a small work item" below, step 8, says which of these steps to do.

1. Check three things: that every change is merged, or the owner said to leave it on its branch; that the result of each deploy is recorded; and that every Roadmap phase that the work item completed says Done.
2. Fill the Moved up line, as the section above says.
3. Ask the owner. Add the Questions and Answers row for the question, with the Next action "Waiting on the owner: Q-12 (mark WI-031 Done). After his answer: record Done." Put the evidence in one line first: the checker's verdict and commit, the merged pull request, the deploy result, and the Moved up line. End the reply with "Mark WI-031 Done?" Use the real Q-ID and work item ID in both.
4. After the owner's yes, save the owner's words first. Then set the State to Done and `waiting_on` to `none`, and rewrite the work item's Current state. Write these four of its lines as follows:
   - Where it stands: "Done on `YYYY-MM-DD`: <evidence>."
   - Next action: "None. Finished."
   - Waiting on: "Nothing."
   - Blockers: "None."
5. Update the project's Current State, which is the project's one short page of what is true now. `references/lifecycle-rules.md`, section "Work that another skill does", names the skill for each of these writes.
   - Remove the work item's line under Now.
   - Ask `managing-project-memory` to remove the rest: each line under "Coming up" or "Waiting on" that is about this work item, and a "Next session starts with" line that names it. The reference file on the project's Current State in that skill, section "Removing what is no longer true", gives the steps. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in place of `managing-project-memory`.
   - For a top-level work item, check its project phase, as `references/lifecycle-rules.md`, section "Levels", says. That section says what to ask the owner when the last open work item in a project phase is closed.
6. After the owner's "no", record the owner's words, turn each problem into a task, and move the work item back to Building. After the fix, run the Testing Loop again and fill the Moved up line again, before you ask again.
7. Report to the owner whether the work reached the default branch, what was deployed, and what was kept for the whole project: what the Moved up line says, and each lesson whose outcome starts "Moved up:". End the report with what the section "Leftover branches and worktrees" below asks the owner. When that section leaves nothing to ask, end with "Tell me the next thing to build."

## Closing a small work item

Use this section for a small work item that takes the short path, in place of "Reflecting" and "Marking Done". `references/lifecycle-rules.md`, section "A small work item", says what a small work item is, when it takes the short path, and gives its steps. On the short path the work item gets one closing question, where the full path asks three. It stays in the Testing Loop until the owner answers that question.

Before you ask:

1. Go through the checklist in "Reflecting", steps 1 to 4. When no separate checker ran, compare each requirement in step 2 of that checklist with the Recent History row of your own check.
2. List what the whole project may need to keep, as "Filling the Moved up line", step 1, says.

Then ask the one closing question:

3. Add the Questions and Answers row "Approve this result and mark <ID> Done?", with the real ID, and set `waiting_on` to the owner.
4. Show the result, as `testing-loop.md`, section "Showing the result", says, with these three differences:
   - When the list from step 2 holds a decision, a rule to add, change, or retire, a project term, or a lesson, show each of those lines under "To keep for the whole project", with your recommendation and a one-line reason.
   - When something is still to be merged or deployed, say what it is. Say that each merge and each deploy to an environment that other people use still gets its own question, and that a production deploy or a production data load is the owner's to run.
   - The last line of the reply is exactly "Approve this result and mark <ID> Done?"

After the owner's yes:

5. Save the owner's words and the date in the row, and set `result_approved` to `YYYY-MM-DD by <name>`. The yes also covers each line that you showed under "To keep for the whole project". For each of those lines, add one answered Questions and Answers row that holds the line, your recommendation, and the owner's words.
6. When the work item has something to merge or deploy, or a data load that the owner runs, move it to Deploying and follow `deploying.md`. Its questions for a merge and for a deploy still apply. `deploying.md` ends by sending you to "Marking Done". For a small work item, come back to step 7 of this section instead.
7. Finish "Filling the Moved up line", from its step 3. The question that its step 6 names is the closing question.
8. Mark the work item Done with "Marking Done", steps 1, 4, 5, and 7. Skip its steps 2 and 3, and ask no second question, because the owner's yes in step 5 is the yes to mark the work item Done.

After the owner's "no" or a change, record the owner's words in the row, add a task for each problem that the owner named, and move the work item back to Building.

- When the work item is still small, fix each problem, check the result again as `testing-loop.md`, section "A small work item", says, and ask the closing question again in a new row.
- When the short path no longer fits the work item, move it to the full path, as `references/lifecycle-rules.md`, section "A small work item", says.

A change to the result after the owner's yes, such as a fix after a failed deploy, needs a new check and a new closing question.

## Cancelling a work item

Use this section when the owner cancels a work item.

1. Record the owner's reason, in the owner's words, as an answered Questions and Answers row.
2. Ask the owner about each open sub-item. The choices are to cancel it, to move it to the top level, or to move it under another work item.
3. Fill the Moved up line, as "Filling the Moved up line" says.
4. Set the State to Cancelled and `waiting_on` to `none`. Rewrite the work item's Current state. Write these two of its lines as follows:
   - Where it stands: "Cancelled on `YYYY-MM-DD`: <the owner's reason>."
   - Next action: "None. Cancelled."
5. Update the project's Current State, as step 5 of "Marking Done" says.
6. Leave the work item's open pull request, its branch, and its worktree as they are until the owner says what to do with them. Delete nothing. The offer in "Leftover branches and worktrees" covers only a merged branch, so it does not cover the unmerged branch of a cancelled work item.

## Done or Cancelled by hand

Use this section when the owner marked the work item Done or Cancelled without the agent. The owner's change counts. Never undo it.

1. Add the Recent History row "Marked Done by the owner by hand on `YYYY-MM-DD`". For a cancelled work item, write "Cancelled" in place of "Done".
2. Tell the owner in one line what had not happened yet: the result approval, the checker, the merge, or the filling of the Moved up line. Ask the owner what to do about it.
3. Fill the Moved up line, as "Filling the Moved up line" says. Fill the line whatever the owner says about the rest.
4. Rewrite the work item's Current state with the lines that "Marking Done", step 4, gives for Done, or that "Cancelling a work item", step 4, gives for Cancelled. Then update the project's Current State, as step 5 of "Marking Done" says.

## Leftover branches and worktrees

After a work item is Done or Cancelled, look for the branches and worktrees that are left from it. A worktree is a separate folder with its own branch.

1. Run `git worktree list` and `git branch --list '*wi-007*'`, with the work item's ID in lower case in place of `wi-007`.
2. For each branch or worktree that is left, check whether its commits reached the default branch, and whether its worktree has uncommitted changes.

Then do both of these:

- Offer to remove each branch or worktree that is merged and has no uncommitted changes, with a one-line reason.
  - Remove it only after the owner's yes: run `git -C <main checkout> worktree remove <folder>`, then `git branch -d <branch>`.
  - Never use `--force`.
  - Name each other branch or worktree to the owner, and leave it as it is.
- Run `git -C <main checkout> status`. It must show none of the work item's files uncommitted. When it shows one, name the files to the owner and ask what to do. Never commit, stash, or remove those files yourself.

## When one message answers several questions

When the owner's words name each question, one message from the owner may answer several questions. For example, one message may answer both the merge question and the question about marking the work item Done. Add one Questions and Answers row for each question, each with the owner's words.

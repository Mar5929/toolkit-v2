# Closing

Use this file to take a work item through Reflecting after the owner approved its result, and to close a work item as Done or Cancelled. The job is done when the work item is closed and its Moved up line accurately records reusable outcomes in the configured record homes.

Fill the Moved up line at every close: when you mark a work item Done, when you cancel it, and when the owner closed it by hand. The section "Filling the Moved up line" gives the steps. Never set a work item to Done or Cancelled while its Moved up line is empty.

Use `filing-project-records` for the decisions, open questions, system rules, and project terms that more than one work item needs. For memory and the project's current state, follow "Project memory" in the root `AGENTS.md`.

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

The Moved up line is a line in the work item's Overview. It records what the whole project keeps from this work item: the shared decisions, system rules, and project terms that it added or changed, and the lessons that it moved up.

1. List what the whole project may need to keep. Read the work item's Questions and Answers rows marked Decision? `yes`, its design, its Related items line, its verified implementation evidence, and its Notes, "Lessons not proven yet". Put these five kinds of thing on the list:
   - Each decision that more than one work item needs, and whose row does not end "Filed as <the record's ID or link>". The root `AGENTS.md`, section "Where information goes", gives the test for whether more than one work item needs a decision.
   - Each rule that several work items rely on, that this work item added, changed, or retired, and that the project's system rules do not show yet.
   - Each rule that this work item may have built. Such a rule is one whose behaviour a requirement of this work item built or changed. It is either a rule already on this list, or an approved rule that the project's system rules do not yet mark as built.
     - A work item that only names, explains, or documents a rule did not build what the rule says.
     - A cancelled work item did not build what any rule says.
     - `filing-project-records`, step "update a system document", holds the conditions for when a work item built what a rule says, and it checks them.
   - Each project term that this work item added or changed, and that the project's terms do not show yet.
   - Each lesson that has no outcome at the end of its line. Step 5 gives the outcomes. Before you list a lesson, search and read relevant memory, as "Project memory" in the root `AGENTS.md` says. When the lesson was seen before, in another work item or another session, list it with the dates it was seen.
2. When the list holds a decision, a rule to add, change, or retire, a project term, or a lesson, ask the owner once. When the list holds only rules that the work item may have built, or holds nothing, ask no question. Also ask no question for an item when the reference of the `filing-project-records` step that files it says that the item needs no approval from the owner to be filed.
   - Add one Questions and Answers row that shows each line of the list with your recommendation and a one-line reason.
   - For a lesson, the owner chooses one of three: keep it for the whole project, keep it as not proven, or drop it. Recommend keeping a lesson for the whole project when it was seen before.
   - Set `waiting_on` to the owner, and ask whether the owner agrees to keep each listed item for the whole project, with the proposed outcome.
   - Filing a record does not approve its content. A new decision, a changed requirement, and a harness instruction still need their own approvals.
3. File what the owner agreed to, and each item that needs no approval. This table says what to do with each thing.

   | What it is | What to do |
   | --- | --- |
   | A decision or an open question | `filing-project-records`, step "record a decision" |
   | A rule to add, change, or retire | `filing-project-records`, step "update a system document" |
   | A rule that this work item may have built | `filing-project-records`, step "update a system document". That step checks the conditions and, when they are met, marks the rule as built, with this work item's ID. |
   | A project term | `filing-project-records`, step "update a system document" |
   | A lesson that the owner agreed to keep for the whole project, and that is about the system or the project | `filing-project-records`, step "record a decision" |
   | A lesson that the owner agreed to keep for the whole project, and that is about how to do a step, such as a deploy, a data load, or a test, or about how the agent works | Write it as a standing instruction in `.claude/rules/owner-preferences.md` or the rule it applies to, with the owner's approval, the source, and the date. Use the steps that "Project memory" in the root `AGENTS.md` names. Memory may also keep its history or a pointer to it; a memory record never replaces the instruction. |
   | A lesson that is kept as not proven | Keep it in memory, as "Project memory" in the root `AGENTS.md` says, marked as not proven, with the work item's ID and the dates it was seen. When a lesson does not qualify for memory, keep it in the work item. |

4. Do this step only when work items are local files: check that the main checkout holds each save. The main checkout is the project's main folder, which is the first path that `git worktree list` prints. With each ID, `filing-project-records` reports whether the main checkout holds the save of that record. Steps 5 and 6 write those IDs into the work item. A local work item is kept in the main checkout, so the record that it names must be there.
   - When the main checkout does not hold a save, stop here, and tell the owner what `filing-project-records` reported. `filing-project-records` records the wait in the project's current state. The record's ID stays out of the work item until the main checkout holds the save.
   - When the main checkout holds the save, continue from this step.
5. Write each lesson's outcome at the end of its line. Choose the outcome that describes what was saved, with the record's real ID or link in place of the prompt:
   - "Moved up: <the record's ID or link>."
   - "Moved up: owner-preferences.md."
   - "Kept in memory."
   - "Kept in work item."
   - "Dropped (Q-12)."
6. Fill the Moved up line.
   - Name every shared decision and every system rule that this work item added or changed. Name each one by its ID or link, and say what happened to it.
   - Name every project term that this work item added or changed, by the term.
   - When `filing-project-records` said that a record still waits to be filed in its final place, name the link it gave and say so. Name the final place only after the filing is verified. Closing does not wait for that filing.
   - Include the records that were filed before this step. The Questions and Answers rows of those records end "Filed as <the record's ID or link>".
   - When there are none, write "Nothing: <the reason>."
   - Add a Recent History row that names the Q-ID of the question from step 2, or says that no question was needed.

## Marking Done

Use this section after Deploying, or after Reflecting when the work item has nothing to merge or deploy.

For a small work item on the short path, read "Closing a small work item" below, step 3, first. That step says which questions the owner has already answered.

1. Check three things: that every change is merged, or the owner said to leave it on its branch; that the result of each deploy is recorded; and that every Roadmap phase that the work item completed says Done.
2. Fill the Moved up line, as the section above says.
3. Ask the owner. Add the Questions and Answers row for the question, with the Next action "Waiting on the owner: Q-12 (mark WI-031 Done). After his answer: record Done." Put the evidence in one line first: the checker's verdict and commit, the merged pull request, the deploy result, and the Moved up line. Ask whether the owner agrees to mark the work item Done. Use the real Q-ID and work item ID in the record and question.
4. After the owner's yes, save the owner's words first. Then set the State to Done and `waiting_on` to `none`, and rewrite the work item's Current state. Write these four of its lines as follows:
   - Where it stands: "Done on `YYYY-MM-DD`: <evidence>."
   - Next action: "None. Finished."
   - Waiting on: "Nothing."
   - Blockers: "None."
5. Update the project's current state, which is the project's short record of what is true now, as "Project memory" in the root `AGENTS.md` says.
   - Remove from it everything about this work item that is no longer true, such as the work item's own line, a line about what is coming up or waited on for it, and a note that the next session starts with it.
   - Keep any follow-up that remains in the work tracker.
   - Review memory for lasting lessons from the work item, as "Project memory" says.
   - For a top-level work item, check its project phase, as `references/lifecycle-rules.md`, section "Levels", says. That section says what to ask the owner when the last open work item in a project phase is closed.
6. After the owner's "no", record the owner's words, turn each problem into a task, and move the work item back to Building. After the fix, run the Testing Loop again and fill the Moved up line again, before you ask again.
7. Report to the owner whether the work reached the default branch, what was deployed, and what was kept for the whole project: what the Moved up line says, and each lesson whose outcome starts "Moved up:". End the report with what the section "Leftover branches and worktrees" below asks the owner. When that section leaves nothing to ask, end with "Tell me the next thing to build."

## Closing a small work item

Use this section for a small work item that takes the short path. `references/lifecycle-rules.md`, section "A small work item", says what a small work item is and gives the steps of the short path.

On the short path, one closing question takes the place of three questions of the full path: the result approval in `testing-loop.md`, step 7, the question in "Filling the Moved up line", step 2, when that step asks one, and the question in "Marking Done", step 3. The work item stays in the Testing Loop until the owner answers the closing question, and it never enters Reflecting.

1. Before you ask, go through the checklist in "Reflecting", steps 1 to 4. Then make the list in "Filling the Moved up line", step 1.
2. Ask the closing question. Add a Questions and Answers row asking the owner to approve the result and mark the work item Done, with the real ID, and set `waiting_on` to the owner. Show the result, as `testing-loop.md`, section "Showing the result", says, with these three differences:
   - When "Filling the Moved up line", step 2, would ask the owner a question, show the lines of that question under "To keep for the whole project", each with your recommendation and a one-line reason.
   - When a merge, a deploy, or a data load is still to come, say what it is and who runs it, and say that the owner's yes to the closing question does not cover it.
   - Ask one clear question covering approval of the result, the listed outcomes to keep for the whole project, and marking the work item Done.
3. After the owner's yes, do these four things in order:
   - Save the owner's words and the date in the row, and set `result_approved` to `YYYY-MM-DD by <name>`.
   - Add one answered Questions and Answers row for each line that you showed under "To keep for the whole project", because the yes also covers those lines. The row holds the line, your recommendation, and the owner's words.
   - When a merge, a deploy, or a data load is still to come, move the work item to Deploying, and follow `deploying.md`.
   - Follow "Marking Done". The owner's yes has already answered the question in "Filling the Moved up line", step 2, when that step asks one, for the lines that you showed, and the question in "Marking Done", step 3. Do not ask those questions again. Where those steps name their question's Q-ID, name the Q-ID of the closing question.
4. After the owner's "no" or a change, record the owner's words in the row, add a task for each problem that the owner named, and move the work item back to Building. Continue with the short path from its step 4, in `references/lifecycle-rules.md`, section "A small work item", and ask the closing question in a new row. That section also says what to do when the work item stops being small.

## Cancelling a work item

Use this section when the owner cancels a work item.

1. Record the owner's reason, in the owner's words, as an answered Questions and Answers row.
2. Ask the owner about each open sub-item. The choices are to cancel it, to move it to the top level, or to move it under another work item.
3. Fill the Moved up line, as "Filling the Moved up line" says.
4. Set the State to Cancelled and `waiting_on` to `none`. Rewrite the work item's Current state. Write these two of its lines as follows:
   - Where it stands: "Cancelled on `YYYY-MM-DD`: <the owner's reason>."
   - Next action: "None. Cancelled."
5. Update the project's current state, as step 5 of "Marking Done" says.
6. Leave the work item's open pull request, its branch, and its worktree as they are until the owner says what to do with them. Delete nothing. The offer in "Leftover branches and worktrees" covers only a merged branch, so it does not cover the unmerged branch of a cancelled work item.

## Done or Cancelled by hand

Use this section when the owner marked the work item Done or Cancelled without the agent. The owner's change counts. Never undo it.

1. Add the Recent History row "Marked Done by the owner by hand on `YYYY-MM-DD`". For a cancelled work item, write "Cancelled" in place of "Done".
2. Tell the owner in one line what had not happened yet: the result approval, the checker, the merge, or the filling of the Moved up line. Ask the owner what to do about it.
3. Fill the Moved up line, as "Filling the Moved up line" says. Fill the line whatever the owner says about the rest.
4. Rewrite the work item's Current state with the lines that "Marking Done", step 4, gives for Done, or that "Cancelling a work item", step 4, gives for Cancelled. Then follow step 5 of "Marking Done".

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

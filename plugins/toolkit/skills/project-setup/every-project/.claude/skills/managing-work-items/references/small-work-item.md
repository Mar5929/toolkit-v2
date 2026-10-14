# The short path for a small work item

Use this reference when a work item meets the small-item definition below. The short path records requirements and evidence while combining the specified approvals; merge and deployment approval still apply.

## A small work item

A small work item is a top-level work item whose whole job you can play back to the owner in one reply, and that you can build and check without an interview, without Designing, and without sub-items. Adding one line to an email template is an example of a small work item. Making one list of records for the owner to load is another.

A small work item takes the short path, unless the owner asks for the full process. The short path is the six steps below. The full path is the process that this skill gives for every other work item.

The goal of the short path is to take a small work item to Done with fewer stops for the owner's yes. It asks one question before the work starts, in place of the interview. It asks one question when the result is ready, where the full path asks three.

Every rule of this skill that the six steps do not change applies to a small work item as it is written. Stops 4 and 5 of `lifecycle-rules.md`, section "When to stop for the owner's yes", stay: each merge into the default branch, and each deploy to an environment that other people use.

Use your judgment to decide from the owner's request whether the work item is small, before you create it. `lifecycle-rules.md`, section "Designing or Building after the requirements" says when a work item needs Designing. The owner's words win over your decision.

1. Create the work item, as `references/refining-requirements.md`, steps 1 and 2, say. Then write what the interview would have written:
   - the goal, in the Overview;
   - for each requirement, its Goal, at least one line of Functional Requirements, and at least one line of Acceptance Criteria that a tester could check;
   - a plain task list, with phases only when they help plan or track the work.
2. Play the request back to the owner in one reply. This reply takes the place of steps 3 to 11 of `references/refining-requirements.md`.
   - Say the goal in concise sentences, what you will hand over, and how you will check it.
   - Name anything you are unsure of.
   - Name the project phase that the work item goes under. When the project has no phases yet, name the phases that you propose, as `work-levels.md`, section "Phases" says.
   - Explain that this small work item takes the short path, skipping the interview and combining result approval and closure in one question at the end.
   - Ask the owner to confirm the request as you described it.

   Add that question as a Questions and Answers row, and set `waiting_on` to the owner, before the reply ends.
3. Record the owner's answer in that row, with the owner's words and the date.
   - After a yes, set `requirements_approved` to `YYYY-MM-DD by <name>`, record the owner-approved small-item path in Recent History, and move the work item to Building. The yes approves the requirements and the project phase, as the reply gave them.
   - After a correction, change the work item, and play the request back again in the same form.
4. Build the tasks, as `references/building.md` says. When every task is done, move the work item to the Testing Loop.
5. Check the result, as `references/testing-loop.md`, section "A small work item", says. That section says when the separate checker runs, and what takes its place when it does not run.
6. Ask one closing question, and close the work item after the owner's yes, as `references/closing.md`, section "Closing a small work item", says. That section gives what the question must cover. The owner's yes approves the result, and it is also the yes to mark the work item Done.

When the owner changes or adds a requirement and the work item is still small, record the change as `references/refining-requirements.md`, step 7, says. In place of the approval question of that step, and of the requirements analyst helper that the full path starts after such a change, play the change back in the form of step 2.

A work item on the short path stops being small when the work turns out to need what the short path leaves out: an interview to settle the requirements, Designing, or sub-items. Then move it to the full path:

- Tell the owner.
- Record in Recent History why the item left the short path and the State from which the full path resumes.
- Set `delivery` to `not-offered`, unless a Questions and Answers row whose Affects column says `delivery` holds the owner's answer.
- Continue with the file for that State. A work item that needs a design moves to Designing, also from Building. The owner's approval of the requirements still counts.

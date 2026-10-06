# Testing Loop

Use this file to test a finished build against the Acceptance Criteria of every requirement. The job is done when the checker has passed the result and the owner has approved it.

- The checker is a separate agent, the acceptance checker, that tests the result. It always runs.
- Fixing and testing repeat in this State until the checker passes the result. Then the owner approves the result.
- Nothing in this file merges, deploys, or marks the work item Done.

## Steps

1. Check that the work item can be tested.
   - When the requirements are not approved, or a row that asks the owner to approve a new or changed requirement is still open, stop and use `refining-requirements.md`, which gives the steps to get the requirements approved.
   - A sub-item with no design of its own is checked against its parent's approved design and the parent's requirements that it covers.
   - A parent is checked as a whole, across its sub-items. Each sub-item keeps its own result approval.
2. Run the checks in the work item's worktree, at its head commit, and never on the default branch. The head commit is the latest commit on the work item's branch, which `git -C <worktree> rev-parse HEAD` prints.
   - A work item whose only changes are documents committed with `publish-docs` has no worktree. Check the default branch at the commit that `publish-docs` reported, and give the checker that commit.
   - Commit every build change first, with no AI credit, because the checker checks a commit.
   - Run the project's tests, which `AGENTS.md`, section "Commands", names. Also run every check of the Acceptance Criteria that you can run. Keep each command and its exact result line.
   - A check that needs something you lack, such as a real device, a sign-in, or the owner looking at a screen, is "not run". Say what would run it. Never report such a check as passed.
3. Write a test plan when a check has more than one scenario, a manual step, test data, an org or another shared environment, or a release across environments.
   - Copy the project's `tests/TEST-PLAN-TEMPLATE.md` to `tests/<ID>-test-plan.md`. When the ID starts with `#`, leave the `#` out, as in `tests/12-test-plan.md`.
   - Fill the plan as its guide says.
   - Commit the plan on the work item's branch, staged by name, before the checker starts.
   - Never save the test plan where the work items are kept.
   - When there is no test plan, the checker gets "Test plan: none".
4. Start the checker, every time, as `acceptance-checker-brief.md` says. Start it on the exact head commit after the test plan commit. Give it every requirement that is not dropped, whole, with its Acceptance Criteria. Read its report yourself.
   - When a defect is outside the requirements and breaks the flow, fix it. The flow is the steps that the person who uses the result goes through, from start to finish.
   - When a defect is outside the requirements and does not break the flow, add it as a new Backlog work item, and show it as a gap with that work item's ID.
   - When no helper can start, run the checks yourself, record "Independent check: none, <why>", and say so on the first line of the reply.
5. Fix what fails, and then check again. Repeat until the checker reports "ready for the owner" or a failure needs the owner.
   - **A requirement is not met or partly met, or a defect breaks the flow.** Add a task for each one. In a top-level work item the task goes under its phase, as in "P2-T04 — Fix: a zero amount is saved". In a sub-item it goes in the task list, as in "T05 — Fix: ...". Fix it, with helpers when `delivery` is `agent-led`, as `building.md` says. Then go to step 2. The work item stays in the Testing Loop.
   - **A failure needs the owner's decision (a requirement that reads two ways, a fix that changes what the owner approved or spends money), or the same failure comes back after a second fix.** Add a Questions and Answers row with your recommendation, set `waiting_on` to the owner, and ask.
   - **A failure shows that a requirement is wrong or missing.** Handle it as a change to a requirement, as `refining-requirements.md`, step 7, says. Never change the build to avoid the failure.
6. Record each check after the checker's report.
   - Add a Recent History row in this form: "Independent check of commit `<short hash>`: <each requirement's verdict>. Evidence: <test plan path, test command and result line>. Gaps: <gaps, or none>."
   - Set a phase to Done when its tasks and its sub-items are done and the check confirmed its exit result.
7. Ask for the result approval.
   - Add the row "Do you approve this result? <ID> at commit <short hash>: <each requirement's verdict and the gaps, in one line>.", with the requirement IDs that were checked in its Affects column.
   - Set `waiting_on` to the owner.
   - Show the result as "Showing the result" below says. The last line of the reply is exactly "Do you approve this result?"
8. Record the owner's answer the moment the owner gives it.
   - Write the owner's exact words, in quotation marks, and the date in the row, with Decision? `yes` and Status Answered.
   - After a yes, set `result_approved` to `YYYY-MM-DD by <name>`, add a Recent History row that names the Q-ID, and move the work item to Reflecting. An instruction to go on, such as "ship it", that the owner gives after you showed the result is the owner's yes.
   - After a "no" or a change, record the owner's words in the same way, add a task for each problem the owner named, and go to step 5.
   - Handle a changed requirement with `refining-requirements.md`, which gives the steps for a change to a requirement.

## Showing the result

Keep the reply short, and give its parts in this order:

1. What the result does now, in the owner's terms.
2. How the owner can see the result: a link, a screenshot, or a command. Put `cd <worktree path>` before a command, because the change is only in the work item's worktree until it is merged.
3. The evidence: each requirement's verdict, the commit that was checked, and the tests that were run, with their result lines.
4. The gaps: anything partly met, not run, or found outside the requirements. Never hide a gap to get a yes.
5. The Sources list that `.claude/rules/cite-recalled-knowledge.md` asks for.
6. Last, "Do you approve this result?"

## Mistakes to avoid

- The checker runs before every result approval, whoever built the change. The owner decided this rule on 2026-09-28.
  - When the owner asks to skip the checker, say that it always runs, as the owner decided, and ask whether the owner wants to change that decision.
  - When the owner does change the decision, give the owner's words to `curating-project-memory`, which writes the line in `.claude/rules/owner-preferences.md`. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in place of `curating-project-memory`.
- A commit after the check needs a new checker.
- A change after the owner's yes to the result needs a new check, and a new yes from the owner to what changed.
- In Codex, each Git write, such as the test plan commit, follows `building.md`, section "Git writes in Codex".

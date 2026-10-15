# Testing Loop

The goal: the separate acceptance checker passes the result, then the owner approves it. Nothing in this State merges, deploys, or marks the item Done.

## Before testing

- The requirements must be approved; otherwise go to `refining-requirements.md`.
- A sub-item without its own design is checked against its parent's design and the parent requirements it covers. A parent is checked as a whole, and its sub-items keep their own approvals.

## Checking

- Commit every change first, with no AI credit. Check the item's worktree at its head commit, never the default branch. For docs-only work committed with `publish-docs`, check the default branch at the commit it reported. For a result Git doesn't track, such as a load file, check the file itself and identify it by path and SHA-256 hash.
- Run the project's tests (`AGENTS.md`, "Commands") and every acceptance check you can. Keep each command and its exact result line. A check you can't run (a real device, a sign-in, the owner looking at a screen) is "not run", with what would run it. Never report it as passed.
- Write a test plan when the checks involve several scenarios, manual steps, test data, a shared environment, or a release across environments. Copy `tests/TEST-PLAN-TEMPLATE.md` to `tests/<ID>-test-plan.md`, fill it in, and commit it before the checker starts. Never store it with the work items.
- Start the checker every time, with `acceptance-checker-brief.md`, on the exact head commit and with every live requirement in full. Read its report yourself. If no helper can start, check it yourself and put "Independent check: none, <why>" on the first line of your reply.

## Fixing

- **An unmet requirement, or a defect that breaks the user's flow:** add a fix task, fix it, and check again. The item stays in the Testing Loop.
- **A defect outside the requirements that doesn't break the flow:** make it a new Backlog item, and show it as a gap with that item's ID.
- **A failure that needs the owner** (a requirement that reads two ways, a fix that changes what was approved or costs money), or fixes that aren't converging: ask, with a recommendation.
- **A failure that shows a requirement is wrong:** change the requirement through `refining-requirements.md`. Never bend the build around it.
- Record each check in Recent History: the checker, the commit, a verdict per requirement, the test plan, the commands and results, and the gaps. Close any phase whose work is done and checked.
- A commit after the check needs a new check. A change after the owner's yes needs a new check and a new yes.

## Asking for approval

Add a Q&A row naming the item, the checked commit, each requirement's verdict, and the gaps, and set `waiting_on` to the owner. Show the result in this order:

1. What it does now, in the owner's terms.
2. How to see it: a link, a screenshot, or a command prefixed with `cd <worktree>`.
3. The evidence: verdicts, commit, and tests with their result lines.
4. The gaps. Never hide one to get a yes.
5. The question, last.

After a yes, including "ship it" once they've seen the result: set `result_approved`, add Recent History with the Q-ID, and move to Reflecting. After a no: record their words, add a task per problem, and go back to fixing.

If the owner asks to skip the checker, say it runs because they decided it should, and ask whether they want to change that decision. A change goes in `owner-preferences.md`.

## Small items

The checker runs only if the result changes production, changes a shared environment, gives numbers, records, or findings to someone outside the project, or builds a shared system rule. Otherwise your own checks stand in: record in Recent History that no independent check ran and what you checked, and say so on the first line of the reply. The standing merge instruction doesn't cover a merge no checker passed. Approval comes from the single closing question in `closing.md`.

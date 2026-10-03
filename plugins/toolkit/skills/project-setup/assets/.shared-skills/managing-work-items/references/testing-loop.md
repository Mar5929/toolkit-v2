# Testing Loop

Tests a finished build against every requirement's Acceptance Criteria, always with a separate acceptance checker agent. Fixing and testing again repeat in this State until the checker passes. Then the owner approves the result. Nothing here merges, deploys, or marks the item Done.

## Steps

1. **Check the item can be tested.**
   - Requirements not approved, or a change to a requirement that still waits for his approval: stop and use `refining-requirements.md`.
   - A sub-item with no design of its own is checked against its parent's approved design and the parent's requirements it covers.
   - A parent is checked as a whole, across its sub-items. Each sub-item keeps its own result approval.
2. **Run the checks** in the item's worktree at its head commit (`git -C <worktree> rev-parse HEAD`), never on the default branch. Commit every build change first, with no AI credit: the checker checks a commit. Run the project's tests (`AGENTS.md`, "Commands") and every check of the Acceptance Criteria you can, and keep each command and its exact result line. A check that needs what you lack (a real device, a sign-in, the owner looking at a screen) is "not run", with what would run it. Never report it as passed.
3. **Write a test plan** when a check has more than one scenario, a manual step, test data, an org or other shared environment, or a release across environments. Copy the project's `tests/TEST-PLAN-TEMPLATE.md` to `tests/<ID>-test-plan.md` (an ID that starts with `#`: leave the `#` out, `tests/12-test-plan.md`). Fill it as its guide says, and commit it on the item's branch, staged by name, before the checker starts. Never save it in the tracker. With no plan, the checker gets "Test plan: none".
4. **Start the checker**, every time, as `acceptance-checker-brief.md` says, on the exact head commit after the test plan commit, with every requirement that is not dropped, whole, with its Acceptance Criteria. Read its report yourself. A defect outside the requirements: fix it when it breaks the flow, otherwise add it as a new Backlog work item and show it as a gap with that item's ID. No helper can start: run the checks yourself, record "Independent check: none, <why>", and say so on the reply's first line.
5. **Fix what fails**, then check again, until the checker reports "ready for the owner" or a failure needs him.
   - Not met, partly met, or a defect that breaks the flow: add a task for each, under its phase in a top-level item ("P2-T04 — Fix: a zero amount is saved") or in a sub-item's task list ("T05 — Fix: ..."), fix it (with helpers when `delivery` is `agent-led`, as `building.md` says), and go to step 2. The item stays in the Testing Loop.
   - A failure that needs his decision (a requirement that reads two ways, a fix that changes what he approved or spends money), or the same failure after a second fix: add a Questions and Answers row with your recommendation, set `waiting_on` to the owner, and ask.
   - A failure that shows a requirement is wrong or missing: handle it as `refining-requirements.md`, step 7, says. Never change the build to avoid it.
6. **Record each check** after the checker's report: a Recent History row ("Independent check of commit `<short hash>`: <each requirement's verdict>. Evidence: <test plan path, test command and result line>. Gaps: <gaps, or none>."). Set a phase to Done when its tasks and sub-items are done and the check confirmed its exit result.
7. **Ask for the result approval.** Add the row "Do you approve this result? <ID> at commit <short hash>: <each requirement's verdict and the gaps, in one line>." (Affects: the requirement IDs checked), set `waiting_on` to the owner, and show the result as below. The reply's last line is exactly "Do you approve this result?"
8. **Record his answer the moment he gives it:** his exact words in quotes and the date in the row, Decision? `yes`, Status Answered. Set `result_approved` to `YYYY-MM-DD by <name>`, add a Recent History row naming the Q-ID, and move the item to Reflecting. A go-ahead such as "ship it" after you showed him the result is his yes. A "no" or a change: record his words the same way, add a task for each problem he named, and go to step 5. A changed requirement goes to `refining-requirements.md`.

## Showing the result

Keep it short, in this order:

1. What the result does now, in the owner's terms.
2. How he can see it himself: a link, a screenshot, or a command, with `cd <worktree path>` first, because the change is only in the item's worktree until it is merged.
3. The evidence: each requirement's verdict, the commit checked, and the tests run with their result lines.
4. The gaps: anything partly met, not run, or found outside the requirements. Never hide one to get a yes.
5. Sources.
6. Last, "Do you approve this result?"

## Gotchas

- The checker runs before every result approval, whoever built the change (the owner's decision, 2026-09-28). If he asks to skip it, say it always runs, as he decided, and ask whether he wants to change that decision. When he does, write his words as a bullet in `.claude/rules/owner-preferences.md`.
- A commit after the check needs a new checker. A change after his approval needs a new check and a new approval of what changed.
- In Codex, each Git write, such as the test plan commit, follows "Git writes in Codex" in `building.md`.

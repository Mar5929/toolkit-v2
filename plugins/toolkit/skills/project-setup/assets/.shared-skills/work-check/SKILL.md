---
name: work-check
description: 'Tests a finished work item against every requirement''s acceptance check with an independent checker agent, records the result, and asks the owner to approve it, so nothing reaches him untested. Use when a work item''s build is done, or the owner asks "check it", "is it ready", "does it work", or "test it". Not for a pasted handoff; use handoff. Not for shipping or closing; use work-finish.'
---

# Work check

Tests a finished work item against every requirement's acceptance check,
always with an independent acceptance checker helper, records the result on
the item, and asks the owner to approve it. It never merges, deploys, or
marks an item Done: after his yes, `work-finish` continues.

The project's work track skill reads the item and writes every change
(`AGENTS.md`, "Skills", names it).

## Steps

1. **Find the item**: the ID the owner named, else the item this worktree's
   branch names, else the item this chat built. Read it fresh with the work
   track skill, every routing field included.
   - A `build` or `data-load` item with `requirements_approved: no`, or an
     `R-xx` still at Refining: stop and use `work-refine`.
   - A sub-item with no design of its own is checked against its parent's
     approved design, and against the parent's requirements it covers. A
     parent whose sub-items are all Done or Cancelled: check the whole flow
     across them. Each sub-item keeps its own result approval.
2. **Start testing**: with the work track skill, set stage `09-testing`
   (status In Progress), `waiting_on: agent`, and rewrite the item's
   Current state, Next action "Agent: run the checks and the independent
   check, with work-check." (forms in
   `.claude/rules/keep-work-item-current.md`).
3. **Run the checks** in the item's worktree at its head commit
   (`git -C <worktree> rev-parse HEAD`), never on the default branch. Commit
   every build change first, with no AI credit: the checker checks a commit. Run the project's
   tests (`AGENTS.md`, "Commands") and every acceptance check you can, and
   keep each command and its exact result line. A check that needs what you
   lack (a real device, a sign-in, the owner looking at a screen) is "not
   run", with what would run it; never report it as passed.
4. **Test plan**, when a check has more than one scenario, a manual step,
   test data, an org or other shared environment, or a release across
   environments. Copy the project's `tests/TEST-PLAN-TEMPLATE.md` to
   `tests/<ID>-test-plan.md` (GitHub issue: `tests/12-test-plan.md`), fill
   it as its guide says, and commit it on the item's branch, staged by
   name, before the checker starts. Never save it in `work-items/` (Git
   ignores that folder) or the tracker. With no plan, the checker gets
   "Test plan: none".
5. **Start the independent checker**, every time, as
   `references/acceptance-checker.md` says, on the exact head commit after
   the test plan commit, with every `R-xx` block that is not Superseded and
   the Acceptance list in full. Read its report yourself. A defect outside
   the requirements: fix it when it breaks the flow, otherwise show it as a
   gap. No helper can start: run the checks yourself, record "Independent
   check: none, <why>", and say so on the reply's first line.
6. **Fix what fails**, then check again, until the checker reports "ready
   for the owner" or a failure needs him:
   - Not met, partly met, or a defect that breaks the flow: add a task for
     each under its phase ("P2-T04 — Fix: a zero amount is saved"), set
     stage `10-bug-fixing`, fix it yourself (`work-delegate` when
     `delivery` is `agent-led`), set stage `09-testing`, and go to step 3.
   - A failure that needs his decision (a requirement that reads two ways,
     a fix that changes what he approved or spends money), or the same
     failure after a second fix: add a Questions and Answers row with your
     recommendation, `waiting_on: owner`, Next action "Waiting on Mike: Q-08
     (how to handle a zero amount). After his answer: fix it, with
     work-check.", and ask.
   - A failure showing a requirement is wrong or missing: use
     `work-refine`. Never change the build to avoid it.
7. **Record the check** after each checker report: a Recent History row
   ("Independent check of commit `<short hash>`: <each requirement's
   verdict>. Evidence: <test plan path, test command and result line>.
   Gaps: <gaps, or none>."), a phase set to Done when its tasks and
   sub-items are done and the check confirmed its Exit result, and the
   Current state rewritten in place.
8. **Ask for the result approval.** Add the Questions and Answers row "Do
   you approve this result? <ID> at commit <short hash>: <each
   requirement's verdict and the gaps, in one line>." (Affects: the
   requirement IDs checked). Set stage `11-user-approval`,
   `waiting_on: owner`, Next action "Waiting on Mike: Q-xx (approve
   the result). After his answer: ship the approved result, with
   work-finish.", Waiting on "Mike: Q-xx.". Show the result as
   below; the reply's last line is exactly "Do you approve this result?"
9. **Record his answer the moment he gives it**: his exact words in quotes
   and the date in the row, Decision? yes, Status Answered;
   `result_approved: YYYY-MM-DD by <name>`; a Recent History row naming the
   Q-ID; `waiting_on: agent`; Next action "Agent: ship the approved
   result, with work-finish.". Then open `work-finish`. A "no" or a change:
   record his words the same way, add a task for each problem he named, set
   stage `10-bug-fixing`, Next action "Agent: fix the problems he named.", and go to step 6. A changed requirement goes to
   `work-refine`.

## Showing the result

Keep it short, in this order (`examples/result-check-walkthrough.md`): what
the result does now, in the owner's terms; how he can see it himself (a
link, a screenshot, or a command, with `cd <worktree path>` first, because
the change is only in the item's worktree until it is merged); the
evidence (each requirement's verdict, the commit checked, the tests run
with their result lines); the gaps (anything partly met, not run, or found
outside the requirements; never hide one to get a yes); Sources; and last,
"Do you approve this result?"

## Gotchas

- The checker runs before every result approval, whoever built the change
  (the owner's decision, 2026-09-28). If he asks to skip it, say it always
  runs, as he decided, and ask whether he wants to change that decision.
  When he does, write his words as a bullet in
  `.claude/rules/owner-preferences.md`.
- A commit after the check needs a new checker. A change after his approval
  needs a new check and a new approval of what changed.
- In Codex, each Git write, such as the test plan commit, runs alone with
  escalated permissions.

## References

| File | Open it when |
| --- | --- |
| [references/acceptance-checker.md](references/acceptance-checker.md) | Step 5 and every new check: how to start the checker in each host, and the brief to paste. |
| [examples/result-check-walkthrough.md](examples/result-check-walkthrough.md) | Writing the job block for the checker and the reply to the owner. |

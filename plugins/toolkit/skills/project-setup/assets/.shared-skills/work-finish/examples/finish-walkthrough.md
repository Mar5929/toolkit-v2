# Walkthrough: finishing WI-031

A project with local work items, local memory, a GitHub remote, no
Salesforce, and no System Guide. The owner is Mike Rihm.

WI-031, "Log a spending transaction", is at `11-user-approval`. Recent
History says the independent checker passed commit `4f2a9c1`, and
`result_approved: 2026-10-02 by Mike Rihm`.

**Mike:** "Ship it."

The result approval is already recorded, and the branch head is still
`4f2a9c1`. The agent pushes `claude/wi-031-log-transaction`, opens pull
request #14 (body run through `humanizer`, "Work item: WI-031"), sets stage
`12-pr-and-push` and status In Review, and adds row Q-11. "Ship it" is not
a yes to the merge, and `owner-preferences.md` holds no standing merge
instruction, so the reply ends:

> Pull request #14 is open and its checks pass. Merge it into main?

**Mike:** "Yes, merge it and mark it done."

- Q-11 gets his words. `merge-and-clean-up` merges #14 and removes its
  branch and worktree.
- The app is not released yet: one Recent History row, "No deployment:
  stage 13 skipped."
- R-01 to R-03 were delivered and approved: the agent writes them into
  `requirements/transactions/TRANSACTIONS.md`, each Source naming WI-031
  and its Q-ID, and saves it with `publish-docs`. Stage `14-spec-update`.
- The Done checklist passes and no sub-item is open, so his words also
  answer the Done question: row Q-12 with his words, status Done, the
  item's Current state rewritten ("Done on 2026-10-02: checker passed
  commit 4f2a9c1; PR #14 merged into main.", Next action "None.
  Finished."), and its line removed from the project's Current State.
- Q-04 ("Money amounts are stored as whole cents") passes the project-wide
  test. Q-06 ("The save button sits at the bottom of the form") affects
  only this screen. The agent adds row Q-13 and the reply ends:

> WI-031 is Done: pull request #14 is merged into main, and
> `requirements/transactions/TRANSACTIONS.md` now holds R-01 to R-03.
>
> - Q-04: money amounts are stored as whole cents. Every later item that
>   stores or shows money must follow it.
>
> This looks project-wide. Save it to memory too?

**Mike:** "Yes."

Q-13 gets his words, and `local-memory-save` writes
`memory/decision_money_in_whole_cents.md`.

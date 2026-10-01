# Running the team

How the lead chat maps helpers to sub-items and tasks, starts them, records each one's return, changes the plan midway, and resumes in a new session. Every change to a work item goes through the project's work track skill.

## 1. Plan the team

- Build only after the requirements and the design are approved. A sub-item built from its parent's approved design needs no design of its own; one that covers the parent's approved requirements copies that approval with the parent's ID.
- Start from the design's build order and the parent's Roadmap: its phases, sub-items, and tasks. A phase is never a work item; it groups sub-items and tasks.
- Map the work: one builder per task that can run on its own. Tasks of one sub-item that depend on each other run one after another. A sub-item that needs another sub-item's code starts after that code is merged into its own item branch. The lead may build a small task itself instead of starting a builder.
- Make what is missing with the work track skill:
  - a sub-item: `parent` set to the parent, a phase that is one of the parent's phases, `delivery` set to the parent's value, and its `requirements_approved` copied from the parent when it covers the parent's requirements;
  - a task: `P1-T01 — <name>` with Work, Deliverable, Done when, and Depends on, on the lowest-level item it belongs to.
- One writer per file at a time: two builders never write the same file at the same time. Tasks that need the same file, or the same shared environment (a sandbox org, a database, a test service), run one after another, in the order their Depends on lines give.
- Start only as many builders as you can check and merge as they return.
- Tell the owner the team in one line ("Team for P2: three builders, one per sub-item."). His team arrangement answer already allows it; do not ask again.

## 2. The team list in the parent

Keep one short list in the parent's Notes, "Context":

```markdown
**Team (agent-led, one team inside this chat):**
- builder: WI-041 P1-T01, branch `claude/wi-041-p1-t01`, started 2026-09-30
- builder: WI-042 P1-T01, branch `claude/wi-042-p1-t01`, started 2026-09-30
```

- One line per running helper, or per chat under a Main Orchestrator (its id or title and its sub-item).
- Add the line when the helper starts. Remove it when its work is merged or dropped. Write "None running." when the list is empty.

## 3. When a helper returns

Do this for each helper as soon as it returns, before you start another helper or reply to the owner.

1. Read its report: result, changed files, tests and checks, commit, and what it could not do.
2. Check it: the files it changed are the ones it was given, and its tests pass when you run them yourself on its branch. If either check fails, do not merge, and keep its branch: in step 4, treat the task as not done and record what failed.
3. Merge its branch into its item's branch, from the item's worktree. Then remove its worktree and branch (`git-rules.md`).
4. With the work track skill, read the item fresh, then change:
   - **The task.** Done, and ticked, only when its "Done when" check is met. Partly done or not done: leave it open and add a task for what is left, or an open Questions and Answers row for a question the owner must answer.
   - **The sub-item.** Every task done: move it to `09-testing` (still In Progress) for `work-check`. Tasks left: it stays at `08-build`. `waiting_on`: `agent`, or `owner` when the report raised a question for him.
   - **Recent History on the sub-item.** One row: "Builder returned: P1-T01 done, commit 3f9c2ab, tests pass. Gaps: none."
   - **Recent History on the parent.** One row naming the sub-item: "WI-041 P1-T01 built (3f9c2ab)."
   - **The phase.** Done when every task in it is Done, every sub-item in it is Done or Cancelled, and its exit result was checked. After `work-finish` marks a sub-item Done or Cancelled, set its phase Done by the same rule.
   - **The parent's Current state.** Rewritten in place: Where it stands, Next action ("Agent: <the exact next step>, with <skill>.", for example "Agent: start the WI-041 builder, with work-delegate."), Waiting on, Blockers, Last updated.
   - **The team list.** Remove the helper's line.
5. Read the changes back. A failed save: lead with "Not saved" and keep the text.
6. Start the next helper whose dependencies are now met.

A helper that worked a task on the parent itself: the same steps, on the parent's task and Recent History.

## 4. When the plan changes

The owner changes his mind, a helper finds a problem, a check fails, or a phase turns out too big. Change phases, sub-items, and tasks with the work track skill; phase and task IDs never change and are never reused.

- Record every plan change in a Recent History row on the parent: what changed and why, with the Q-ID when his answer caused it. Rewrite the parent's Current state at once, with Next action naming the new next step.
- A running helper whose task moved to another phase keeps going.
- A running helper whose task was dropped, or whose requirement or design changed: stop it, or let it finish and do not merge its branch. Keep the branch until the owner agrees the work is dropped. Start a new helper with the new brief when the work is still needed.
- Never delete a phase, sub-item, or task. Cancelled keeps the history.
- A change that drops or moves a work item named in `PROJECT-ROADMAP.md`: update its line, and save it with `publish-docs`.

## 5. Resuming in a new session

- Read the parent fresh with the work track skill: its Current state first, then the team list, Roadmap, and each listed sub-item.
- After compaction in the same session, a helper may still be running: wait for its report.
- In a new session, builders from the old session are not running. A chat under a Main Orchestrator may still be running: message it and wait for its report before you start anything for its sub-item. For each builder line, look at the builder's branch:

  ```text
  git log --oneline <item branch>..<builder branch>
  ```

  Commits listed: run section 3 with the commits as its report. Check them and run the tests against the task's "Done when"; what is missing stays open. Nothing listed, and `git -C <builder worktree> status --short` prints nothing: remove its worktree and branch, and start a new builder. Uncommitted changes in its worktree: keep them, tell the owner in one line, and ask whether to use them or remove them.
- Ask the owner nothing that his recorded answers already settle: the delivery answer and the team arrangement hold across sessions.

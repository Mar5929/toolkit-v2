# Building

The goal is every task done, with proof. Build only from approved requirements, and an approved design when the item has one. A requirement with an open approval row is not approved.

The main agent is the only one that changes the work item or talks to the owner. The owner decides, approves, and marks work Done.

## Task by task

- Take the first task whose dependencies are met. Set it, and its phase, In Progress.
- Build what the requirements ask and no more. Work the requirements need that no task covers gets a task first.
- Tick a task only when its Done-when proof is met, and record the proof in Recent History: the command and its exact result line, or what you saw. A partly done task stays open, with a new task for the rest.
- A task too big to check in one go gets split. A part that could ship on its own becomes a proposed sub-item.

## Git

- Make every change in the item's own worktree and branch, never on the default branch. Create them before the first change, from the main checkout, off the default branch (or off the parent's branch for a sub-item). Always pass `-C <main checkout>`.
- Names: branch `claude/<prefix>-<number>-<short name>` and folder `.claude/worktrees/<prefix>-<number>-<short name>`, for example `claude/wi-007-csv-export`. `merge-and-clean-up` finds the item from the ID in the branch name. The short name is a few lowercase words joined by hyphens that say the item's subject, for example `csv-export`. Choose it the first time a branch or folder is named for the item, and choose one that no other work item uses: check the tracker, `working-files/`, `tests/`, and `delivery/deployments/`. Write it on the item's Related items line as `Short name: csv-export`, and use it for every later branch and folder. Working files go in `working-files/<short name>/`, or `working-files/no-work-item/` for work with no item. A builder's branch adds the task: `claude/wi-007-p1-t01`, off the item's branch.
- Merge conflicts: follow `pull-latest`.

## Who builds

The top-level item's `delivery` field decides: `agent-led` (helpers build, the owner decides), `owner-led` (the owner steers), or `not-offered` (not asked yet). Sub-items take the parent's value.

- **The owner says "you drive":** that's the yes. Record it and don't ask.
- **`not-offered` and the item isn't small:** offer once as an open row with your recommendation, and build nothing until the owner answers.
- **A small item:** no offer. Set `owner-led` and note it.
- **Yes:** set `agent-led`. It widens nothing; every approval in `lifecycle.md` still applies. It holds across sessions for this goal.
- **No:** set `owner-led`. Don't offer again unless the owner asks or the work grows a lot.
- **The owner takes the work back:** record it, supersede the yes row, set `owner-led`, start no new helpers, and ask whether running ones should finish or stop.

For one team in this chat versus a Main Orchestrator across chats, see `team-arrangement.md`.

## Running builders

- Plan before starting. One builder per independent task; dependent tasks run in order. A sub-item that needs another's code starts after that code merges into its branch. You can do small tasks yourself.
- One writer at a time per file or shared environment (a sandbox, a database, a test service).
- Start only as many builders as you can check and merge as they return. Tell the owner the team; don't ask again.
- Create missing sub-items and tasks through `work-tracker.md`. A sub-item inherits its parent, phase, `delivery`, and the requirements approval it covers.
- For each builder, choose its mode as `builder-brief.md` says. Set its sub-item to Building with `waiting_on: agent`, set its task In Progress, and start it with that brief.
- Keep a team list in the parent's Notes, under Context: one line per running helper (role, item and task, branch, start date), or "None running."

## When a builder returns

Do this before starting another helper or replying to the owner.

1. Read its report. Check the changed files against its assigned paths, and rerun its tests where its changes are. If a check fails, keep the changes, leave the task open, and record what failed.
2. Integrate. A builder on its own branch: merge into the item branch from the item worktree, then remove only the builder's worktree and branch. A "Commit: no" builder: review its diff against the starting state, commit the verified paths if allowed, and otherwise record what's left. Never remove the item worktree.
3. Re-read the item and update it: the task (Done only on proof), the sub-item (Testing Loop once every task is done), Recent History on the sub-item and the parent (task, result, evidence, commit), a phase (Done when everything in it is done and checked), and the team list.
4. Start the next builder whose dependencies are met.

## When the plan changes

- Record every change in the parent's Recent History, with the Q-ID if the owner's answer caused it. Dropping or merging approved work needs the owner's yes first.
- A requirement change goes to `refining-requirements.md`; a design change goes to `designing.md`.
- A running builder whose task was dropped, or whose requirement or design changed: stop it, or let it finish and don't merge. Keep its branch until the owner agrees the work is dropped.
- Dropping a top-level item, or moving it to another project phase, changes the roadmap, after the owner's yes.

## Resuming in a new session

- Read the parent's Current state, its team list, its plan, and each listed sub-item.
- After compaction a helper may still be running, so wait for its report. In a new session, old builders are gone.
- For each old builder: commits on its branch are its report. No commits and a clean worktree: remove it and start fresh. Uncommitted changes: keep them and ask the owner.
- Don't re-ask anything the recorded answers settle.

While the owner decides something, keep the team on work the answer doesn't block.

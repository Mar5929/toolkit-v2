# Building

Use this file to build a work item that has approved requirements, and an approved design when it has one. The job is done when every task is done, with proof.

The main agent is the agent of the session that leads the build. It either does the tasks itself or runs a team of helper agents. In both cases it is the only one that changes the work item, and the only one that talks to the owner. The owner stays the product owner: the owner decides, approves, and marks work Done.

## Contents

- Build, task by task
- Who builds
- The team arrangement
- Plan the team
- Repository steps
- Start a builder
- When a helper returns
- When the plan changes
- Resume in a new session
- While the owner decides something

## Build, task by task

1. Read the work item's tasks and its design. Take the first task whose Depends on line is met. Before you start the task, set it In Progress. When the task has a phase, also set that phase In Progress when it is Not Started.
2. Work in the work item's own worktree, on its own branch, and never on the default branch. `build-repository.md` says how to make both. Build what the requirements ask, and no more. When the requirements need work that no task covers, add a task for that work first, and then do it.
3. Tick the task only when its Done when proof is met. Save the proof in Recent History: the command and its exact result line, or what you saw. A task that is partly done stays open, and you add a task for what is left.
4. When you cannot check a task in one go, split it into smaller tasks. When a part can be approved, built, or shipped on its own, propose a sub-item, as `refining-requirements.md`, section "Roadmap, tasks, and sub-items", says.

## Who builds

The `delivery` field on the top-level work item says who builds. Read it before you build. It has one of three values:

- `agent-led`: helper agents build, and the owner decides.
- `owner-led`: the owner steers the build.
- `not-offered`: the owner has not been asked yet.

The Questions and Answers rows whose Affects column says `delivery` hold the owner's answer. A sub-item takes its parent's answer.

The offer is the question whether helper agents build the work item. It is first made in Refining Requirements, as `refining-requirements.md`, step 4, says. Handle these cases in Building:

- **The owner gives the work item to the agent in the owner's own words,** for example "you drive". Those words are the owner's yes. Add an answered row for it, and do not ask the offer.
- **`delivery` is `not-offered`, the owner has not given the work item to the agent, and the work item is not small.** Make the offer now.
  - Add the offer as an open row with your recommendation, and set `waiting_on` to the owner.
  - Ask whether agents should take responsibility for delivering the work, with the owner acting as product owner.
  - Build nothing until the owner answers.
- **The work item is small.** `references/small-work-item.md`, gives the definition of a small work item. A small work item gets no offer. Set `delivery: owner-led`, and add a Recent History row: "Small item, so no delivery offer." The owner's own later "you drive" still counts.
- **The owner says yes.** Set `delivery: agent-led`.
  - A yes widens nothing. It allows no merge, deployment, spending, publishing, or sign-in beyond what the owner already allowed. Every point in `references/lifecycle-rules.md`, section "When to stop for the owner's yes", still applies.
  - The yes holds across sessions, for this goal only.
- **The owner says no.** Set `delivery: owner-led`. Ask no question about a team, and build the tasks as the owner steers. Make no new offer unless the owner asks about agent delivery or the work grows a lot.
- **The owner takes the work back.**
  - Add an answered row "Change to <old Q-ID>: ..." with the owner's words.
  - Mark the row that recorded the owner's yes "Superseded by <new Q-ID>".
  - Set `delivery: owner-led`, and start no new helper.
  - Ask the owner whether the helpers that are still running finish or stop. Make no new offer unless the owner asks about agent delivery or the work grows a lot.

## The team arrangement

Follow [choosing and coordinating the team](team-arrangement.md) for this part of Building.

## Plan the team

Plan which helper builds which task before you start a builder.

- Build only after the requirements are approved, and after the design is approved when the work item has one. A requirement with an open row that asks the owner to approve it is not approved. Build nothing from it.
- Start from three things: the design's build order; the top-level work item's plan, which holds its tasks and level-2 sub-items under phases or in a plain list; and the task list of each sub-item. `references/work-levels.md`, describes these levels.
- Start one builder for each task that can run on its own. A builder is a helper that builds one task.
  - Tasks of one sub-item that depend on each other run one after another.
  - A sub-item that needs another sub-item's code starts after that code is merged into the branch of the sub-item that needs the code.
  - The main agent may build a small task itself.
- Make what is missing with `references/work-tracker.md`:
  - A sub-item gets `parent` set to the parent, its phase only when its parent uses phases, as `references/work-levels.md`, says, and `delivery` set to the parent's value. It gets `requirements_approved` copied from the parent when it covers the parent's requirements.
  - A new task is `P1-T01 — <name>` under a phase, or `T01 — <name>` in a plain list. Existing tasks keep their IDs. It has Work, Deliverable, Done when, Who does it, and Depends on. It goes on the lowest-level work item it belongs to.
- Allow one writer for each file at a time. Tasks that need the same file run one after another, in the order that their Depends on lines give. The same holds for tasks that need the same shared environment, such as a sandbox environment, a database, or a test service.
- Start only as many builders as you can check and merge as they return.
- Tell the owner the team, such as "Team for P2: three builders, one per sub-item." The owner's answer about the arrangement already allows the team. Do not ask again.
- Keep one team list in the parent's Notes, "Context". It has one line for each running helper, or for each session under a Main Orchestrator. Add the line when the helper starts, and remove it when its work is merged or dropped. Write "None running." when the list is empty.

  ```markdown
  **Team (agent-led, one team inside this chat):**
  - builder: WI-041 P1-T01, branch `claude/wi-041-p1-t01`, started 2026-09-30
  - builder: WI-042 P1-T01, branch `claude/wi-042-p1-t01`, started 2026-09-30
  ```

## Repository steps

Follow [repository steps for a build](build-repository.md) when creating a worktree or branch or integrating changes.

## Start a builder

For each builder:

1. Choose the permitted builder mode with `builder-brief.md`. Normally make its worktree and branch as `build-repository.md` says. When the builder cannot create a worktree or commit, run one builder at a time in the item worktree with "Commit: no". Record that mode, folder and starting state in the team list.
2. Set its sub-item to State Building, and `waiting_on` to the agent. Set its task In Progress, and also the task's phase when the task has one. Add the builder's line to the parent's team list.
3. Start the builder with the brief in `builder-brief.md` and that file's list of inputs, filled in. Start builders according to their dependencies and the recorded mode; shared-worktree builders run one at a time.

## When a helper returns

Do these steps for each helper as soon as it returns, before you start another helper or reply to the owner.

1. Read the helper's report: the result, the changed files, the tests and checks, the commit, and what the helper could not do.
2. Check the report. Verify the changed files against the helper's assigned paths, and rerun its tests in the worktree that holds its changes. When either check fails, preserve the changes, leave the task open, and record what failed.
3. Integrate the verified changes according to the helper's recorded mode.
   - When the helper returned committed work on its own branch, merge that branch into the work item's branch from the item worktree. Then remove only the helper's worktree and branch.
   - When the helper used "Commit: no" in the item worktree, the changes are already there. Review its diff against the starting state, and commit the verified paths only when the host permits it. Otherwise preserve the uncommitted changes and record what remains before the Testing Loop. Never merge or remove the item worktree as helper cleanup.
4. Read the work item again, and then change each of these:
   - **The task.** Set it to Done, and tick it, only when its Done when check is met. When the task is partly done or not done, leave it open. Add a task for what is left, or add an open Questions and Answers row for a question that the owner must answer.
   - **The sub-item.** When every task is done, move it to the Testing Loop. When tasks are left, it stays in Building. Set `waiting_on` to the agent, or to the owner when the report raised a question for the owner.
   - **Recent History on the sub-item.** Record the task, result, check evidence, commit hash or uncommitted state, and remaining gaps.
   - **Recent History on the parent.** Record the sub-item, task and the same commit hash or uncommitted state.
   - **The phase of a top-level work item.** Set it to Done when every task in it is Done, every sub-item in it is Done or Cancelled, and its exit result was checked.
   - **The team list.** Remove the helper's line.
5. Start the next helper whose dependencies are now met.

When a helper worked on a task of the parent itself, do the same steps on the parent's task and the parent's Recent History.

## When the plan changes

The plan changes when the owner changes the owner's mind, a helper finds a problem, a check fails, or a phase turns out to be too big. Change phases, sub-items, and tasks with `references/work-tracker.md`. A phase or a task that moves keeps its ID.

- Record every plan change in a Recent History row on the parent: what changed and why, with the Q-ID when the owner's answer caused the change.
- Ask the owner first when a change drops or merges work that the owner approved.
- A new or changed requirement goes to `refining-requirements.md`. A changed design goes to `designing.md`.
- A running helper whose task moved to another phase keeps going.
- When a running helper's task was dropped, or its requirement or design changed, stop the helper, or let it finish and do not merge its branch.
  - Keep the branch until the owner agrees that the work is dropped.
  - Start a new helper with the new brief when the work is still needed.
- When a change drops a top-level work item, or moves it to another project phase, change the project's roadmap with `references/work-tracker.md`, after the owner's yes.

## Resume in a new session

Use this section when a new session continues a build that an earlier session started.

- Read the parent again: first its Current state, then the team list, its Roadmap or task list, and each sub-item that is listed.
- After compaction in the same session, a helper may still be running. Wait for its report. Compaction is when Claude Code or Codex shortens the session's history to make room.
- In a new session, the builders from the old session are not running.
- A session under a Main Orchestrator may still be running. Message it, and wait for its report before you start anything for its sub-item.
- For a builder recorded as "Commit: no" in the item worktree, inspect the preserved changes against its recorded starting state and assigned paths. Follow "When a helper returns" for verification and integration; keep the item worktree.
- For each builder with its own branch in the team list, look at the builder's branch with `git log --oneline <item branch>..<builder branch>`. Then use the applicable case:
  - When the command lists commits, treat the commits as the helper's report, as "When a helper returns" says, and run the tests against the task's Done when. What is missing stays open.
  - When the command lists nothing, and `git -C <builder worktree> status --short` prints nothing, remove the builder's worktree and branch, and start a new builder.
  - When the builder's worktree has uncommitted changes, keep them, tell the owner, and ask whether to use them or to remove them.
- Ask the owner nothing that the owner's recorded answers already settle. The delivery answer and the team arrangement hold across sessions.

## While the owner decides something

While the owner decides something, keep the team on work that the owner's answer does not block.

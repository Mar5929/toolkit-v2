# Building

Use this file to build a work item that has approved requirements, and an approved design when it has one. The job is done when every task is done, with proof.

The main agent is the agent of the session that leads the build. It either does the tasks itself or runs a team of helper agents. In both cases it is the only one that changes the work item, and the only one that talks to the owner. The owner stays the product owner: the owner decides, approves, and marks work Done.

A session is one chat with the agent. The exact questions in this file say "chat", because "chat" is the word the owner sees.

## Contents

- Build, task by task
- Who builds
- The team arrangement
- Plan the team
- Git for a build
- Git writes in Codex
- Start a builder
- When a helper returns
- When the plan changes
- Resume in a new session
- While the owner decides something

## Build, task by task

1. Read the work item's tasks and its design. Take the first task whose Depends on line is met. Before you start the task, set it In Progress. In a top-level work item, also set the task's phase In Progress when the phase is Not Started.
2. Work in the work item's own worktree, on its own branch, and never on the default branch. A worktree is a separate folder with its own branch. "Git for a build" below says how to make both. Build what the requirements ask, and no more. When the requirements need work that no task covers, add a task for that work first, and then do it.
3. Tick the task only when its Done when proof is met. Save the proof in Recent History: the command and its exact result line, or what you saw. A task that is partly done stays open, and you add a task for what is left.
4. When you cannot check a task in one go, split it into smaller tasks. When a part can be approved, built, or shipped on its own, propose a sub-item, as `refining-requirements.md`, section "Roadmap, tasks, and sub-items", says.

## Who builds

The `delivery` field on the top-level work item says who builds. Read it before you build. It has one of three values:

- `agent-led`: helper agents build, and the owner decides.
- `owner-led`: the owner steers the build.
- `not-offered`: the owner has not been asked yet.

The Questions and Answers rows whose Affects column says `delivery` hold the owner's answer. A sub-item takes its parent's answer.

The offer is the question whether helper agents build the work item. It is first made in Refining Requirements, as `refining-requirements.md`, step 4, says. Handle these seven cases in Building:

- **The owner gives the work item to the agent in the owner's own words,** for example "you drive". Those words are the owner's yes. Add an answered row for it, and do not ask the offer.
- **`delivery` is `not-offered`, the owner has not given the work item to the agent, and the work item is not small.** Make the offer now.
  - Add the offer as an open row with your recommendation, and set `waiting_on` to the owner.
  - Make the last line of the reply exactly "Would you like agents to take responsibility for delivering this, with you acting as product owner?"
  - Build nothing until the owner answers.
- **The work item is small.** `references/lifecycle-rules.md`, section "A small work item", gives the definition of a small work item. A small work item gets no offer. Set `delivery: owner-led`, and add a Recent History row: "Small item, so no delivery offer." The owner's own later "you drive" still counts.
- **The owner says yes.** Set `delivery: agent-led`.
  - A yes widens nothing. It allows no merge, deployment, spending, publishing, or sign-in beyond what the owner already allowed. Every point in `references/lifecycle-rules.md`, section "When to stop for the owner's yes", still applies.
  - The yes holds across sessions, for this goal only.
- **The owner says no.** Set `delivery: owner-led`. Ask no question about a team, and build the tasks as the owner steers.
- **The owner takes the work back.**
  - Add an answered row "Change to <old Q-ID>: ..." with the owner's words.
  - Mark the row that recorded the owner's yes "Superseded by <new Q-ID>".
  - Set `delivery: owner-led`, and start no new helper.
  - Ask the owner whether the helpers that are still running finish or stop.
- **The owner declined the offer, or took the work back.** Make no new offer, unless the owner asks about agent delivery or the work grows a lot.

## The team arrangement

The team arrangement says whether one session runs the team, or one session coordinates other sessions that each have a team. After the owner's yes to agent delivery, settle the arrangement once for each goal, unless the owner's words already chose it. Record each answer as its own Questions and Answers row.

- When this session has tools to list, read, and message other sessions and to offer new sessions, ask exactly "Do you want one team inside this chat, or do you want me to rename this chat to Main Orchestrator and coordinate other chats that each have their own team?" Check that the tools are there. Never assume it.
- Anywhere else, which means Codex or a session without those tools, say in one line that the arrangement with a Main Orchestrator and other chats is not available here. Then ask exactly "Shall I run one team of helpers inside this chat?"
- After the owner chooses the Main Orchestrator, ask once more, exactly: "Do you want me to archive chats after their task is fully complete, everything is merged and shipped, and you approved?"
- The owner may change the arrangement at any time. Record the new answer as a new row, and mark the old row "Superseded by Q-xx".

### One team inside this session

This session leads, and it starts the helpers.

### Main Orchestrator with other sessions

The Main Orchestrator is the session that coordinates the other sessions.

- Rename this session "Main Orchestrator" with the tool that sets a session's title. When you cannot, ask the owner to rename it.
- Run one session for each sub-item. Each of those sessions has its own main agent and its own helpers.
- The Main Orchestrator is the only session that does these three things:
  - It changes the goal's work items.
  - It writes a file that more than one session changes, such as a file that holds a version number, or an index file.
  - It merges.
- The Main Orchestrator checks the result of each session and reports to the owner. It does not do a session's work for it.
- The main agent of each other session reports by message. The Main Orchestrator records that report as it records the report of a returning helper, which "When a helper returns" describes.
- Offer a new session with the tool that offers a new session. The new session starts only when the owner clicks the offer.
- When the tool makes a worktree for the new session, put the branch in the starting prompt, and not a worktree path.
- The starting prompt of a new session holds all of these:
  - the sub-item's ID and what the sub-item must deliver;
  - the pasted requirements and design sections;
  - the new session's branch, and its worktree when the tool does not make one;
  - the files the new session may write;
  - the owner's instructions from `.claude/rules/owner-preferences.md` that apply to its work, in the owner's words;
  - every permission the session needs, and only permissions that the owner or the project already gave. A session will not let a message from another session remove a limit that its own starting prompt set;
  - the rule "build what the requirements ask and no more";
  - that the session reports by message, and never changes a work item, merges, or asks the owner anything directly.
- Record the id of each session in the parent's team list when the session starts. A recorded id is not proof that the session is still running.
- Archive a session only after the owner said yes to the archive question, and only when all four of these are true:
  1. Its task is complete.
  2. Its work is merged to the default branch and, when the sub-item has a deployment, deployed.
  3. Its report is recorded in its sub-item.
  4. The owner approved the result.
- Archive only, and never delete. An archived session can be restored.
- After the owner's no to the archive question, leave the sessions as they are.

### The model for these sessions

This session, the Main Orchestrator, and the main agent of every other session run on the most capable model that Claude Code or Codex offers. A new session may otherwise copy this session's model, so set the new session's model.

## Plan the team

Plan which helper builds which task before you start a builder.

- Build only after the requirements are approved, and after the design is approved when the work item has one. A requirement with an open row that asks the owner to approve it is not approved. Build nothing from it.
- Start from three things: the design's build order; the Roadmap of the top-level work item, which holds its phases with their tasks and level-2 sub-items; and the task list of each sub-item. `references/lifecycle-rules.md`, section "Levels", describes these levels.
- Start one builder for each task that can run on its own. A builder is a helper that builds one task.
  - Tasks of one sub-item that depend on each other run one after another.
  - A sub-item that needs another sub-item's code starts after that code is merged into the branch of the sub-item that needs the code.
  - The main agent may build a small task itself.
- Make what is missing with `references/work-tracker.md`:
  - A sub-item gets `parent` set to the parent, its phase as `references/lifecycle-rules.md`, section "Levels", says, and `delivery` set to the parent's value. It gets `requirements_approved` copied from the parent when it covers the parent's requirements.
  - A task is `P1-T01 — <name>` in a top-level work item, or `T01 — <name>` in a sub-item. It has Work, Deliverable, Done when, Who does it, and Depends on. It goes on the lowest-level work item it belongs to.
- Allow one writer for each file at a time. Tasks that need the same file run one after another, in the order that their Depends on lines give. The same holds for tasks that need the same shared environment, such as a sandbox org, a database, or a test service.
- Start only as many builders as you can check and merge as they return.
- Tell the owner the team in one line, such as "Team for P2: three builders, one per sub-item." The owner's answer about the arrangement already allows the team. Do not ask again.
- Keep one team list in the parent's Notes, "Context". It has one line for each running helper, or for each session under a Main Orchestrator. Add the line when the helper starts, and remove it when its work is merged or dropped. Write "None running." when the list is empty.

  ```markdown
  **Team (agent-led, one team inside this chat):**
  - builder: WI-041 P1-T01, branch `claude/wi-041-p1-t01`, started 2026-09-30
  - builder: WI-042 P1-T01, branch `claude/wi-042-p1-t01`, started 2026-09-30
  ```

## Git for a build

This section gives the commands and the names for a work item's worktree and its branch. The main checkout is the project's main folder: the first path that `git worktree list` prints. In Codex, every Git command in this section also follows "Git writes in Codex" below.

- Make a work item's changes to code, rules, skills, hooks, and settings in its own worktree, on its own branch, and never on the default branch.
- Make the worktree and the branch before the first change. Make them in the main checkout, from the default branch, under its real name, for example `main`. For a sub-item, make them from its parent's branch.

  ```text
  git -C <main checkout> worktree add .claude/worktrees/wi-007-csv-export -b claude/wi-007-csv-export main
  ```

- The branch is `claude/<prefix>-<number>-<slug>`, and the folder is `.claude/worktrees/<prefix>-<number>-<slug>`.
  - The prefix is the prefix of the work item's ID, in lower case: `wi` for `WI-007`.
  - An ID with no prefix, such as `#12`, uses `issue`: `claude/issue-12-csv-export`.
  - `merge-and-clean-up` finds the work item from the ID in the branch name.
- Name `<main checkout>` with `-C` in every command. Each command starts in the session's own folder, which may be another worktree. A worktree that is made inside that folder is deleted when that folder is removed.
- Make a builder's worktree and branch from the work item's branch. Name them with the work item's prefix and number, and then the task ID in lower case:

  ```text
  git -C <main checkout> worktree add .claude/worktrees/wi-007-p1-t01 -b claude/wi-007-p1-t01 claude/wi-007-csv-export
  ```

- A commit message and a pull request carry no AI credit: no `Co-Authored-By:` that names an AI, and no "Generated with" line.
  - Codex has no setting that removes such a line, so write none.
  - When a command is refused because of such a line, change the wording. Never commit in another way to get past the refusal.
- When a merge stops on a conflict, read both sides of each conflicting file, stage each resolved file by name, and commit with a message that you write.
  - Never run `git commit --no-edit` after a conflict, because it keeps Git's "# Conflicts:" lines in the message.
  - When the right result of a conflict is not clear from the two sides, ask the owner.

## Git writes in Codex

Codex runs commands in a sandbox, which is a closed area that limits what a command can change. The sandbox keeps `.git/` read-only, so every command that writes `.git/` fails inside it.

- These commands fail inside the sandbox: `add`, `commit`, `merge`, `fetch`, `pull`, `push`, `switch`, `checkout`, `restore`, `stash`, `rebase`, `reset`, `worktree add`, `worktree remove`, `branch -d`, and every other Git command that writes.
- A command that needs the network, such as opening a pull request, fails too.
- These reading commands run inside the sandbox: `status`, `log`, `diff`, `show`, `branch --list`, and `worktree list`.

For each Git write in Codex, do this:

- Run the command alone. Do not join it to another command with `&&`, `;`, or a pipe, and do not run it from a script.
- Say in one line what the command does.
- Ask for escalated permissions: set `sandbox_permissions` to `require_escalated`, and set `justification` to a one-line reason, such as "Create the worktree for WI-002 on its own branch." An approval without escalation still runs the command inside the sandbox, where it fails.
- When Codex refuses the command without asking, with "approval required by policy", this session cannot ask for the approval. Stop that step, show the owner the exact command, and ask the owner to run it in a terminal or to approve it in an interactive session. Set the work item to wait on the owner.
- Never work around a refusal: make no second clone, make no copy of `.git/`, write no script that runs Git for you, and do not build on the default branch.

## Start a builder

For each builder:

1. Make its worktree and its branch, as "Git for a build" says.
2. Set its sub-item to State Building, and `waiting_on` to the agent. Set its task In Progress, and also the task's phase when the task has one. Add the builder's line to the parent's team list.
3. Start the builder with the brief in `builder-brief.md` and that file's list of inputs, filled in. Start at the same time the builders that do not depend on each other.

## When a helper returns

Do these steps for each helper as soon as it returns, before you start another helper or reply to the owner.

1. Read the helper's report: the result, the changed files, the tests and checks, the commit, and what the helper could not do.
2. Check the report. The files that the helper changed must be the files it was given, and its tests must pass when you run them yourself on its branch. When either check fails, do not merge, and keep the helper's branch. Treat the task as not done, and record what failed.
3. Merge the helper's branch into the branch of its work item, from that work item's worktree. Then remove the helper's worktree and branch.
4. Read the work item again, and then change these six things:
   - **The task.** Set it to Done, and tick it, only when its Done when check is met. When the task is partly done or not done, leave it open. Add a task for what is left, or add an open Questions and Answers row for a question that the owner must answer.
   - **The sub-item.** When every task is done, move it to the Testing Loop. When tasks are left, it stays in Building. Set `waiting_on` to the agent, or to the owner when the report raised a question for the owner.
   - **Recent History on the sub-item.** Add one row in this form: "Builder returned: P1-T01 done, commit 3f9c2ab, tests pass. Gaps: none."
   - **Recent History on the parent.** Add one row that names the sub-item, in this form: "WI-041 P1-T01 built (3f9c2ab)."
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
- For each builder line in the team list, look at the builder's branch with `git log --oneline <item branch>..<builder branch>`. Then do the one of these three that fits:
  - When the command lists commits, treat the commits as the helper's report, as "When a helper returns" says, and run the tests against the task's Done when. What is missing stays open.
  - When the command lists nothing, and `git -C <builder worktree> status --short` prints nothing, remove the builder's worktree and branch, and start a new builder.
  - When the builder's worktree has uncommitted changes, keep them, tell the owner in one line, and ask whether to use them or to remove them.
- Ask the owner nothing that the owner's recorded answers already settle. The delivery answer and the team arrangement hold across sessions.

## While the owner decides something

While the owner decides something, keep the team on work that the owner's answer does not block.

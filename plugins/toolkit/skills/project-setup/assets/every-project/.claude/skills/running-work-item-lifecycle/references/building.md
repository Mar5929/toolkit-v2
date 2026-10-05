# Building

Takes an item with approved requirements, and an approved design when it has one, to a build where every task is done with proof. The lead chat either does the tasks or runs a team of helper agents. Either way it is the only one who changes the work item and the only one who talks to the owner. The owner stays product owner: he decides, approves, and marks work Done.

## Contents

- Build, task by task
- Who builds
- The team arrangement
- Plan the team
- Git for a build
- Start a builder
- When a helper returns
- When the plan changes
- Resume in a new session
- Gotchas

## Build, task by task

1. Read the item's tasks and design. Take the first task whose Depends on line is met. Before you start it, set it In Progress, and, in a top-level item, its phase too when the phase is Not Started.
2. Work in the item's own worktree on its own branch, never on the default branch (see "Git for a build"). Build what the requirements ask and no more. Work the requirements need that no task covers: add its task first, then do it.
3. Tick the task only when its Done when proof is met, and save the proof (the command and its exact result line, or what you saw) in Recent History. A task partly done stays open, and you add a task for what is left.
4. A task you cannot check in one go: split it into smaller tasks. A part that can be approved, built, or shipped on its own: propose a sub-item, as `refining-requirements.md`, "Roadmap, tasks, and sub-items", says.

## Who builds

`delivery` on the top-level item says who builds: `agent-led` (helper agents build and he decides), `owner-led` (he steers the build himself), or `not-offered`. The Questions and Answers rows whose Affects column says `delivery` hold his answer. A sub-item takes its parent's answer. Read it before you build.

The offer is first made in Refining Requirements (`refining-requirements.md`, step 4). Handle these cases here:

- **He hands the item over in his own words** (for example "you drive"): that is his yes. Add an answered row for it and do not ask the offer.
- **`not-offered`, he has not handed it over, and the plan has sub-items, more than one phase, or more than two tasks:** make the offer now. Add it as an open row with your recommendation and set `waiting_on` to the owner. Make the last line of the reply exactly "Would you like agents to take responsibility for delivering this, with you acting as product owner?" Build nothing until he answers.
- **A small item** (at most one phase, one or two tasks, no sub-items) gets no offer. Set `delivery: owner-led` and add a Recent History row: "Small item: at most one phase, one or two tasks, no sub-items, so no delivery offer." His own later "you drive" still counts.
- **His yes:** `delivery: agent-led`. A yes widens nothing: no merge, deployment, spending, publishing, or sign-in beyond what he already allowed, and every OK in `SKILL.md` still applies. It holds across sessions for this goal only.
- **His no:** `delivery: owner-led`. Ask no team question and build the tasks as he steers.
- **He takes the work back:** add an answered row "Change to <old Q-ID>: ..." with his words, mark the row that recorded his yes "Superseded by <new Q-ID>", set `delivery: owner-led`, and start no new helper. Ask whether the helpers still running finish or stop.
- **He declined or took it back:** make no new offer unless he asks about agent delivery or the work grows a lot.

## The team arrangement

After his yes to agent delivery, settle this once per goal, unless his words already chose it. Record each answer as its own Questions and Answers row.

- This session has tools to list, read, and message other chats and to offer new chats: ask exactly "Do you want one team inside this chat, or do you want me to rename this chat to Main Orchestrator and coordinate other chats that each have their own team?" Check the tools; never assume.
- Anywhere else (Codex, or a host without those tools): say in one line that the multi-chat arrangement is not available here, then ask exactly "Shall I run one team of helpers inside this chat?"
- After a Main Orchestrator answer, ask once more, exactly: "Do you want me to archive chats after their task is fully complete, everything is merged and shipped, and you approved?"
- He may change the arrangement at any time. Record the new answer as a new row and mark the old one "Superseded by Q-xx".

**One team inside this chat:** this chat leads and starts the helpers.

**Main Orchestrator with other chats:**

- Rename this chat "Main Orchestrator" with the host's chat title feature. If you cannot, ask him to.
- Run one chat per sub-item, each with its own lead and its own helpers.
- The Main Orchestrator is the only one that changes the goal's work items, writes a file that more than one chat changes (a file that holds a version number, an index file), and merges. It checks each chat's result and reports to him. It does not do a chat's work for it.
- A chat lead reports by message. The Main Orchestrator records the report as for a returning helper ("When a helper returns").
- Offer a new chat with the host's tool. It starts only when he clicks it. When the tool makes a worktree for the new chat, put the branch in the starting prompt, not a worktree path. The starting prompt holds:
  - the sub-item's ID and what it must deliver;
  - the pasted requirements and design sections;
  - its branch, and its worktree when the tool does not make one;
  - the files it may write;
  - his instructions from `.claude/rules/owner-preferences.md` that apply to its work, in his words;
  - every permission the chat needs, and only ones he or the project already gave: a chat will not let a message from another chat remove a limit set in its own starting prompt;
  - the rule "build what the requirements ask and no more";
  - that it reports by message and never changes a work item, merges, or asks him anything directly.
- Record each chat's id in the parent's team list when it starts. A recorded id is not proof the chat is still running.
- Archive a chat only after he said yes to the archive question, and only when all four are true: its task is complete; its work is merged to the default branch and, when the sub-item has a deployment, deployed; its report is recorded in its sub-item; and he approved the result. Archive only, never delete: an archived chat can be restored. After a no, leave chats as they are.

This chat, the Main Orchestrator, and every chat lead run on the most capable model the host offers. A new chat may otherwise copy this chat's model, so set it.

## Plan the team

- Build only after the requirements are approved, and the design when the item has one. A requirement with an open row that asks him to approve it is not approved: build nothing from it.
- Start from the design's build order and the top-level item's Roadmap: its phases, with their tasks and level-2 sub-items, and each sub-item's task list (`SKILL.md`, "Levels").
- One builder per task that can run on its own. Tasks of one sub-item that depend on each other run one after another. A sub-item that needs another sub-item's code starts after that code is merged into its own item branch. The lead may build a small task itself.
- Make what is missing with `using-work-tracker`:
  - a sub-item: `parent` set to the parent, its phase as `SKILL.md`, "Levels", says, `delivery` set to the parent's value, and `requirements_approved` copied from the parent when it covers the parent's requirements;
  - a task: `P1-T01 — <name>` in a top-level item, or `T01 — <name>` in a sub-item, with Work, Deliverable, Done when, Who does it, and Depends on, on the lowest-level item it belongs to.
- One writer per file at a time. Tasks that need the same file, or the same shared environment (a sandbox org, a database, a test service), run one after another, in the order their Depends on lines give.
- Start only as many builders as you can check and merge as they return.
- Tell him the team in one line ("Team for P2: three builders, one per sub-item."). His arrangement answer already allows it; do not ask again.
- Keep one team list in the parent's Notes, "Context": one line per running helper, or per chat under a Main Orchestrator. Add the line when the helper starts and remove it when its work is merged or dropped. Write "None running." when it is empty.

  ```markdown
  **Team (agent-led, one team inside this chat):**
  - builder: WI-041 P1-T01, branch `claude/wi-041-p1-t01`, started 2026-09-30
  - builder: WI-042 P1-T01, branch `claude/wi-042-p1-t01`, started 2026-09-30
  ```

## Git for a build

- An item's changes to code, rules, skills, hooks, and settings are made in its own worktree on its own branch, never on the default branch. Make both before the first change, in the main checkout, from the default branch (its real name, for example `main`), or from its parent's branch for a sub-item:

  ```text
  git -C <main checkout> worktree add .claude/worktrees/wi-007-csv-export -b claude/wi-007-csv-export main
  ```

- The branch is `claude/<prefix>-<number>-<slug>` and the folder is `.claude/worktrees/<prefix>-<number>-<slug>`. The prefix is the item ID's prefix in lower case (`wi` for `WI-007`). An ID with no prefix, such as `#12`, uses `issue`: `claude/issue-12-csv-export`. `merge-and-clean-up` finds the item from the ID in the branch name.
- `<main checkout>` is the first path `git worktree list` prints. Name it with `-C` every time. Each command starts in the session's own folder, which may be another worktree, and a worktree made inside that folder is deleted when that folder is removed.
- A builder's worktree and branch are made from the item's branch and named with the item's prefix and number, then the task ID in lower case:

  ```text
  git -C <main checkout> worktree add .claude/worktrees/wi-007-p1-t01 -b claude/wi-007-p1-t01 claude/wi-007-csv-export
  ```

- A commit message and a pull request carry no AI credit: no `Co-Authored-By:` naming an AI and no "Generated with" line. Codex has no setting that removes it, so write none. A command refused because of such a line: change the wording. Never commit another way to get past it.
- A merge that stops on a conflict: read both sides of each conflicting file, stage each resolved file by name, and commit with a message you write. Never run `git commit --no-edit` after a conflict: it keeps Git's "# Conflicts:" lines in the message. A conflict whose right result is not clear from the two sides: ask him.

**Git writes in Codex.** Codex's sandbox keeps `.git/` read-only, so every command that writes it fails inside the sandbox: `add`, `commit`, `merge`, `fetch`, `pull`, `push`, `switch`, `checkout`, `restore`, `stash`, `rebase`, `reset`, `worktree add`, `worktree remove`, `branch -d`, and the rest. A command that needs the network, such as opening a pull request, fails too. Reading commands (`status`, `log`, `diff`, `show`, `branch --list`, `worktree list`) run inside the sandbox. For each Git write in Codex:

- Run the command alone: not joined to another with `&&`, `;`, or a pipe, and not from a script.
- Say in one line what it does.
- Ask for escalated permissions: `sandbox_permissions` set to `require_escalated`, and `justification` set to a one-line reason ("Create the worktree for WI-002 on its own branch."). An approval without escalation still runs the command inside the sandbox, where it fails.
- Codex refused it without asking ("approval required by policy"): this session cannot ask. Stop that step, show him the exact command, and ask him to run it in a terminal or approve it in an interactive session. Set the item waiting on the owner.
- Never work around a refusal: no second clone, no copy of `.git/`, no script that runs Git for you, and no building on the default branch.

## Start a builder

For each builder:

1. Make its worktree and branch, as above.
2. Set its sub-item to State Building and `waiting_on` to the agent. Set its task In Progress, and the task's phase too when it has one. Add its line to the parent's team list.
3. Start it with `builder-brief.md` and the filled job block. Start builders that do not depend on each other at the same time.

## When a helper returns

Do this for each helper as soon as it returns, before you start another helper or reply to the owner.

1. Read its report: result, changed files, tests and checks, commit, and what it could not do.
2. Check it. The files it changed must be the ones it was given, and its tests must pass when you run them yourself on its branch. If either fails, do not merge, and keep its branch: treat the task as not done and record what failed.
3. Merge its branch into its item's branch, from the item's worktree. Then remove its worktree and branch.
4. Read the item fresh, then change:
   - **The task.** Done, and ticked, only when its Done when check is met. Partly done or not done: leave it open and add a task for what is left, or an open Questions and Answers row for a question the owner must answer.
   - **The sub-item.** Every task done: move it to the Testing Loop. Tasks left: it stays in Building. `waiting_on`: the agent, or the owner when the report raised a question for him.
   - **Recent History on the sub-item.** One row: "Builder returned: P1-T01 done, commit 3f9c2ab, tests pass. Gaps: none."
   - **Recent History on the parent.** One row naming the sub-item: "WI-041 P1-T01 built (3f9c2ab)."
   - **The phase** (a top-level item's). Done when every task in it is Done, every sub-item in it is Done or Cancelled, and its exit result was checked.
   - **The team list.** Remove the helper's line.
5. Start the next helper whose dependencies are now met.

A helper that worked a task on the parent itself: the same steps, on the parent's task and Recent History.

## When the plan changes

The owner changes his mind, a helper finds a problem, a check fails, or a phase turns out too big. Change phases, sub-items, and tasks with `using-work-tracker`. A phase or task that moves keeps its ID.

- Record every plan change in a Recent History row on the parent: what changed and why, with the Q-ID when his answer caused it.
- Ask him first when a change drops or merges work he approved. A new or changed requirement goes to `refining-requirements.md`; a changed design goes to `designing.md`.
- A running helper whose task moved to another phase keeps going.
- A running helper whose task was dropped, or whose requirement or design changed: stop it, or let it finish and do not merge its branch. Keep the branch until he agrees the work is dropped. Start a new helper with the new brief when the work is still needed.
- A change that drops a top-level item, or moves it to another project phase: change the project's roadmap with `using-work-tracker`, after his yes.

## Resume in a new session

- Read the parent fresh: its Current state first, then the team list, its Roadmap or task list, and each listed sub-item.
- After compaction in the same session, a helper may still be running: wait for its report.
- In a new session, builders from the old session are not running. A chat under a Main Orchestrator may still be running: message it and wait for its report before you start anything for its sub-item.
- For each builder line, look at the builder's branch with `git log --oneline <item branch>..<builder branch>`:
  - Commits listed: treat them as the helper's report ("When a helper returns"), and run the tests against the task's Done when. What is missing stays open.
  - Nothing listed, and `git -C <builder worktree> status --short` prints nothing: remove its worktree and branch and start a new builder.
  - Uncommitted changes in its worktree: keep them, tell him in one line, and ask whether to use them or remove them.
- Ask him nothing his recorded answers already settle: the delivery answer and the team arrangement hold across sessions.

## Gotchas

- While he decides something, keep the team on work his answer does not block.

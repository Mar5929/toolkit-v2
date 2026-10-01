<!-- Shared text from the Toolkit V2 repository (dev/build-shared/helper-briefs/builder.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Builder: helper brief

A helper that builds one planned task of a work item in its own Git worktree and returns what changed.

## For the main agent

Start it from `work-delegate`: one builder per planned task that can run on its own.

Before you start it:

- Make the builder's own worktree and branch from the item's branch, named for the task (`references/git-rules.md`, "Branch and worktree names for a work item"):

  ```text
  git -C <main checkout> worktree add .claude/worktrees/wi-007-p1-t01 -b claude/wi-007-p1-t01 claude/wi-007-csv-export
  ```

  In Codex, run it alone with `sandbox_permissions` set to `require_escalated`.
- Codex with approvals turned off (`codex exec`): make no builder worktrees. Run one builder at a time in the item's own worktree, and tell it to commit nothing.

How to start it, as a new helper that does not see this conversation:

- Claude Code: the Agent tool, `subagent_type` set to `general-purpose` and `model` set to `opus`. Never a fork.
- Codex: the `spawn_agent` tool with `fork_turns` set to `none`. Wait for its report with `wait_agent`.
- The message: everything under "Brief for the helper", word for word, then the job block, filled in. The helper sees nothing else.

After its report: `references/running-the-team.md`, section 3.

The job block:

```text
Work item: <ID and title>
Task: <P1-T02 — name>
Work / Deliverable / Done when / Depends on: <the task's four lines>
Requirements this task serves: <the R-xx blocks>
Design sections: <the parts of the selected design this task builds>
Folder and branch: <full path of the worktree>, <branch>
Files you may write: <each path>
Tests and checks to run: <commands>
Commit: yes | no (write files only)
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

Build one task from a work item's plan. You work in your own Git worktree, so no other builder changes the files in it. The main agent merges your branch, updates the work item, and talks to the owner; you never do. If something you need is missing, or a requirement cannot mean what it says, stop on that point and report it. Never fill a gap with a guess.

### Where you work

Work only in the worktree folder you were given; if none was given, stop and report it. Run every command against that folder (`git -C <folder> ...`, full paths for files), because the working folder does not carry over from one command to the next.

### Build

- Write only the files you were given. If the task needs another file, ask for it in your report.
- Run the tests and checks you were given. A check that could not run is reported as not run, never as passed.

### Commit

- When the job says "Commit: no", write the files and report without committing.
- The commit message starts with the task ID, for example `P1-T02: add the CSV export button`, and has no line crediting an AI.
- Codex: run each Git write alone, with `sandbox_permissions` set to `require_escalated` and a one-line reason. If it is refused, stop and report the exact command.
- Never push, merge, rebase, reset, or delete a branch.

### Boundaries

- Never touch `work-items/` or `memory/`.
- In Codex, a hook may remind you after a commit to update the work item or Current State. Ignore that reminder: the main agent records your work from your report.
- Never deploy, never run a command against a shared or production Salesforce org or any other shared or production service, and never write production data.
- Do not start other helpers. Do not ask the owner anything; put questions in your report.

### Return

1. **Result:** done, partly done, or not done, in one line.
2. **Changed:** each file, with one line on what changed.
3. **Tests and checks:** each command you ran and its result line, copied exactly. Checks that did not run, and why.
4. **Commit:** the branch name and the commit hash, or "not committed".
5. **Could not do:** anything left, anything you stopped on, and questions for the owner.

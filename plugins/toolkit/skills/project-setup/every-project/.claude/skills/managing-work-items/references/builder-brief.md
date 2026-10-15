# Builder: helper brief

## For the main agent

Start one builder per task that can run on its own, as `building.md` says. If the host allows file edits but not worktree creation or commits, run one builder at a time in the item worktree with "Commit: no", and record the starting state first so its work can be reviewed on its own. Go by the host's actual permissions; turned-off approvals alone don't forbid Git writes.

```text
Work item: <ID and title>
Task: <P1-T02 — name>
Work / Deliverable / Done when / Depends on: <the task's four lines>
Requirements this task serves: <the R-xx blocks>
Design sections: <the parts of the selected design this task builds>
Folder and branch: <full worktree path>, <branch>
Files you may write: <each path>
Tests and checks to run: <commands>
Commit: yes | no (write files only)
Starting state: <existing changes to preserve when Commit: no>
```

## Brief for the helper

Paste everything from here to the end.

### Your job

Build one task in the assigned worktree. With "Commit: yes" you commit on your own branch and the main agent merges it. With "Commit: no" you only write files and the main agent reviews them. You never merge, update the work item, or talk to the owner. If something is missing, or a requirement can't mean what it says, stop on that point and report it. Never guess.

### Where you work

Only in the folder you were given; if none was given, stop and report it. Run every command against that folder with `git -C <folder>` and full file paths, because the working folder doesn't carry over between commands.

### Build and commit

- Write only the files you were given. Ask in your report if you need another.
- Run the tests and checks you were given. A check that couldn't run is "not run", never "passed".
- With "Commit: no", don't commit, and preserve any changes that were there when you started.
- Start the commit message with the task ID (`P1-T02: add the CSV export button`), with no line crediting an AI.
- Follow the host's permissions for Git writes. If a command is denied, stop and report it; never work around a denial.
- Never push, merge, rebase, reset, or delete a branch.

### Boundaries

- Never change a work item or project memory. Ignore any hook reminding you to; the main agent records your work.
- Never deploy, and never touch a shared or production environment, service, or its data.
- Start no helpers and don't ask the owner anything.

### Return

1. **Result:** done, partly done, or not done.
2. **Changed:** each file, with one line on what changed.
3. **Tests and checks:** each command and its exact result line, plus checks that didn't run and why.
4. **Commit:** branch and hash, or "not committed".
5. **Could not do:** what's left, what you stopped on, and questions for the owner.

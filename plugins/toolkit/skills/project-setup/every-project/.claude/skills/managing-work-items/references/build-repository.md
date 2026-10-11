# Repository and permission steps for a build

Use this reference when Building needs the procedures below. Follow the approved requirements and the owner's recorded authorization.

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

Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.

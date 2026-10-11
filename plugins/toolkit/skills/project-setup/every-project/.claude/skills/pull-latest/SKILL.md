---
name: pull-latest
description: 'Fetches and merges new remote commits into the local repository while preserving local work and commit history. Use when the owner asks to "get the latest" or "sync with remote". For discarding local work, use reset-to-remote. For updating installed Toolkit V2 files, use project-setup.'
---

# Pull the latest from the remote

Bring the current checkout up to date with its remote, and from your own
worktree the main checkout too, without losing local work or rewriting a
commit. Never rebase, reset, stash, switch branches, or push: pushing is the
owner's decision. Other sessions may be working in this repository right
now.

## Steps

1. **Look first.** Run each on its own: `git remote`, `git worktree list`,
   `git status -sb`, and `git branch --show-current`. Stop, with one line
   saying why, when:
   - there is no remote (`git remote` prints nothing): fetch nothing;
   - no branch is checked out (`git branch --show-current` prints nothing);
   - the branch's upstream is on a remote not named `origin`, or the branch
     has no upstream and no remote is named `origin`: ask which remote to
     pull from;
   - the working tree has uncommitted changes (untracked `??` files alone do
     not count): the changes may be another session's work, so never commit
     or discard them;
   - this is the main checkout (the first path `git worktree list` prints)
     on a branch other than the default branch. Your own worktree on your
     own branch is fine.

   In your own worktree, a stop for no checked-out branch or for uncommitted
   changes ends only the work on your own branch: run step 2 first, then stop,
   and add step 5's line on the main checkout to the line saying why.

   The default branch: `git symbolic-ref --short refs/remotes/origin/HEAD`
   prints `origin/<default>`. If it fails, read the "HEAD branch" line of
   `git remote show origin`. Never assume `main`.
2. **Fetch:** `git fetch --prune origin`. In your own worktree, update the
   main checkout next: run `git -C <main checkout> status -sb`. When it
   shows the default branch and no uncommitted changes, as step 1 counts
   them, run `git -C <main checkout> pull --ff-only`. On another branch,
   with uncommitted changes, or a pull that fails: leave the main checkout
   as it is.
3. **The branch has an upstream** (`git status -sb` shows
   `...origin/<branch>` after the branch name): run `git pull --ff-only`.
   - Diverged ("Not possible to fast-forward"): run
     `git log --oneline @{u}..HEAD` and `git log --oneline HEAD..@{u}`, then
     `git show --stat` on each local-only commit. Sessions commit under the
     owner's Git name, so judge whose commits they are by message, changed
     files, and the branch name. If they look like another session's
     unfinished work that does not belong on this branch, stop and report.
     Otherwise run `git pull --no-rebase --no-edit`.
   - Any other pull error: stop and report it.
4. **The branch has no upstream:** run
   `git log --oneline HEAD..origin/<default>`. Nothing listed: the branch
   already holds everything on the default branch. Otherwise tell the owner
   how many commits it lists and ask "Merge the latest `<default>` into this
   branch?" After the owner's yes, run `git merge --no-edit origin/<default>`.
5. **Report** the incoming commits (one line each, then one line on what they
   change together), the final state, and anything step 3 found: another
   session's commits, or content already on the remote under another commit
   id. The final state is one of:
   - "up to date with origin/<branch>";
   - "ahead of origin/<branch> by N commits; you decide whether to push";
   - with no upstream: "holds everything on origin/<default>", or "N commits
     behind origin/<default>; not merged".

   From your own worktree, add one line on the main checkout: "The main
   project folder is updated to <short commit id>.", "The main project
   folder was already up to date.", or "I left the main project folder
   alone: <it is on branch X | it has uncommitted changes | the pull
   error>."

   End with the one question the owner must answer, or else the exact words
   the owner can say to start the next step.

## Mistakes to avoid

- `--no-edit` is only for a merge that finishes without a conflict. On a
  conflict, run `git merge --abort` and report the conflicting files, unless
  the owner said in this session to resolve conflicts or finish this
  merge. Then read both sides of each file, stop and ask when the right
  result is not clear, stage each resolved file by name, and commit with a
  message you write, with no AI credit line. Never `git commit --no-edit`
  after a conflict.
- Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.

## Work that another skill does

| For | Use |
| --- | --- |
| Throwing away local work to match the remote exactly | `reset-to-remote` |
| A toolkit update | `project-setup` |

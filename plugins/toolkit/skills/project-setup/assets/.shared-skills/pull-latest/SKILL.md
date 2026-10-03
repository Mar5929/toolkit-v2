---
name: pull-latest
description: 'Brings the local repository up to date with its remote by fetching and merging, never rebasing or resetting, so no local work or shared history is lost. Use when the owner says "get the latest", "pull the latest changes", "sync with remote", or "update from origin". Not for throwing away local work; use reset-to-remote. Not for a toolkit update; use project-setup.'
---

# Pull the latest from the remote

Bring the current checkout up to date with its remote without losing local
work or rewriting a commit. Never rebase, reset, stash, switch branches, or
push: pushing is the owner's decision. Other sessions may be working in this
repository right now.

## Steps

1. **Look first.** Run each on its own: `git remote`, `git worktree list`,
   `git status -sb`, and `git branch --show-current`. Stop, with one line
   saying why, when:
   - there is no remote (`git remote` prints nothing): fetch nothing;
   - no branch is checked out (`git branch --show-current` prints nothing);
   - the branch's upstream is on a remote not named `origin`, or the branch
     has no upstream and no remote is named `origin`: ask which remote to
     pull from;
   - the working tree is dirty (untracked `??` files alone do not count): the
     changes may be another session's work, so never commit or discard them;
   - this is the main checkout (the first path `git worktree list` prints)
     on a branch other than the default branch. Your own worktree on your
     own branch is fine.

   The default branch: `git symbolic-ref --short refs/remotes/origin/HEAD`
   prints `origin/<default>`. If it fails, read the "HEAD branch" line of
   `git remote show origin`. Never assume `main`.
2. **Fetch:** `git fetch --prune origin`.
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
   branch?" After his yes, run `git merge --no-edit origin/<default>`.
5. **Report** the incoming commits (one line each, then one line on what they
   change together), the final state, and anything step 3 found: another
   session's commits, or content already on the remote under another commit
   id. The final state is one of:
   - "up to date with origin/<branch>";
   - "ahead of origin/<branch> by N commits; you decide whether to push";
   - with no upstream: "holds everything on origin/<default>", or "N commits
     behind origin/<default>; not merged".

   End with the one question the owner must answer, or else the exact words
   he can say to start the next step.

## Gotchas

- `--no-edit` is only for a merge that finishes without a conflict. On a
  conflict, run `git merge --abort` and report the conflicting files, unless
  the owner said in this conversation to resolve conflicts or finish this
  merge. Then read both sides of each file, stop and ask when the right
  result is not clear, stage each resolved file by name, and commit with a
  message you write, with no AI credit line. Never `git commit --no-edit`
  after a conflict.
- In Codex the sandbox keeps `.git/` read-only and blocks the network. Run
  each Git write and each network call (here `git fetch`,
  `git remote show origin`, `git pull`, `git merge`, `git add`, and
  `git commit`) alone, with escalated permissions
  (`sandbox_permissions` set to `require_escalated`, with a one-line reason).
  When Codex refuses without asking, show the owner the exact command and
  ask him to run it.

## Hand-offs

| For | Use |
| --- | --- |
| Throwing away local work to match the remote exactly | `reset-to-remote` |
| A toolkit update | `project-setup` |

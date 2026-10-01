---
name: pull-latest
description: 'Brings the local repository up to date with its remote by fetching and merging, never rebasing or resetting, so no local work or shared history is lost. Use when the owner says "get the latest", "pull the latest changes", "sync with remote", or "update from origin". Not for throwing away local work; use reset-to-remote. Not for a toolkit update; use project-setup.'
---

# Pull the latest from the remote

Bring the current checkout up to date with its remote without destroying or
rewriting anything. Other sessions may be working in this repository right
now.

## Steps

1. **Look first.** Run each on its own: `git remote`, `git worktree list`,
   `git status -sb`, and `git branch --show-current`. Stop, with one line
   saying why, when:
   - there is no remote (`git remote` prints nothing): fetch nothing;
   - there is no upstream (`git status -sb` shows no `...<remote>/<branch>`
     after the branch name);
   - the upstream is on a remote not named `origin`: ask which remote to pull
     from;
   - the working tree is dirty (untracked `??` files alone do not count), or
     this is the shared main checkout (the first path `git worktree list`
     prints) on a branch other than the default branch. Your own worktree on
     your own branch is fine.
2. **Fetch, then try a fast-forward:**

   ```text
   git fetch --prune origin
   git pull --ff-only
   ```

3. **Diverged** ("Not possible to fast-forward"): run
   `git log --oneline @{u}..HEAD` and `git log --oneline HEAD..@{u}`, then
   `git show --stat` on each local-only commit. Sessions commit under the
   owner's Git name, so judge whose commits they are by message, changed
   files, and the branch name. If they look like another session's unfinished
   work that does not belong on this branch, stop and report. Otherwise run
   `git pull --no-rebase --no-edit`. Any other pull error: stop and report it.
4. **Never push, rebase, reset, stash, or switch branches.** Pushing is the
   owner's decision.
5. **Report** the incoming commits (one line each, then one line on what they
   change together), the final state ("up to date with origin/<branch>" or
   "ahead of origin/<branch> by N commits; you decide whether to push"), and
   anything step 3 found: another session's commits, or content already on
   the remote under another commit id. End with the one question the owner
   must answer, or else the exact words he can say to start the next step.

## Gotchas

- Codex keeps `.git/` read-only and turns the network off. Run `git fetch`,
  `git pull`, and `git merge --abort` each alone, outside the sandbox
  (`sandbox_permissions` set to `require_escalated`, with a one-line reason).
  If Codex refuses without asking, show the owner the exact commands and ask
  him to run them.
- `--no-edit` is only for a `git pull --no-rebase` that finishes without a
  conflict. On a conflict, run `git merge --abort` and report the conflicting
  files, unless the owner said in this conversation to resolve conflicts or
  finish this merge. Then read both
  sides of each file, stop and ask when the right result is not clear, stage
  each resolved file by name, and commit with a message you write. Never
  `git commit --no-edit` after a conflict.
- A dirty working tree may hold another session's work: never stash, commit,
  or discard it.

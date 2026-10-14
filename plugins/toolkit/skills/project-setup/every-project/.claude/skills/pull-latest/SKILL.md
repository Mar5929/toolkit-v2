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
   `git status -sb`, and `git branch --show-current`. Stop and say why when:
   - there is no remote (`git remote` prints nothing): fetch nothing;
   - no branch is checked out (`git branch --show-current` prints nothing);
   - the working tree has uncommitted changes (untracked `??` files alone do
     not count): the changes may be another session's work, so never commit
     or discard them;
   - this is the main checkout on a branch other than the default branch. Your own worktree on your
     own branch is fine.

   In your own worktree, a stop for no checked-out branch or for uncommitted
   changes ends only the work on your own branch: run step 2 first, then stop,
   and add step 5's line on the main checkout to the line saying why.

   Use the remote the owner named. Otherwise use `origin`, unless the
   branch has an upstream on another remote or no `origin` exists; ask which
   remote to pull from in those cases. Record the answer as `<remote>` and
   use it throughout this procedure.

   The default branch: `git symbolic-ref --short refs/remotes/<remote>/HEAD`
   prints `<remote>/<default>`. If it fails, read the "HEAD branch" line of
   `git remote show <remote>`. Never assume `main`.
2. **Fetch the remote.** Run `git fetch --prune <remote>`. In your own worktree, update the
   main checkout next: run `git -C <main checkout> status -sb`. When it
   shows the default branch and no uncommitted changes, as step 1 counts
   them, run `git -C <main checkout> pull --ff-only <remote> <default>`. On another branch,
   with uncommitted changes, or a pull that fails: leave the main checkout
   as it is.
3. **The branch has an upstream.** Verify the branch to pull on the chosen
   remote. Use its upstream branch name when the upstream is on that remote;
   otherwise confirm the target when the owner's request does not identify it.
   Record `<remote>/<branch>` as `<target>`. Run
   `git pull --ff-only <remote> <branch>`.
   - Diverged ("Not possible to fast-forward"): run
     `git log --oneline <target>..HEAD` and `git log --oneline HEAD..<target>`, then
     `git show --stat` on each local-only commit. Sessions commit under the
     owner's Git name, so judge whose commits they are by message, changed
     files, and the branch name. If they look like another session's
     unfinished work that does not belong on this branch, stop and report.
     Otherwise run `git pull --no-rebase --no-edit <remote> <branch>`.
   - Any other pull error: stop and report it.
4. **When the branch has no upstream, check incoming commits.** Run
   `git log --oneline HEAD..<remote>/<default>`. Nothing listed: the branch
   already holds everything on the default branch. Otherwise tell the owner
   how many commits it lists and ask whether to merge that default branch into
   this branch. After the owner's yes, run `git merge --no-edit <remote>/<default>`.
5. **Report** the incoming commits (an entry for each, then what they
   change together), the final state, and anything step 3 found: another
   session's commits, or content already on the remote under another commit
   id. The final state is one of:
   - "up to date with <remote>/<branch>";
   - "ahead of <remote>/<branch> by N commits; you decide whether to push";
   - with no upstream: "holds everything on <remote>/<default>", or "N commits
     behind <remote>/<default>; not merged".

   From your own worktree, report whether the main checkout was updated,
   was already up to date, or was left alone. Give the new commit or the
   reason it was left alone.

   State any decision the owner must make or the next available action.

## Mistakes to avoid

- `--no-edit` is only for a merge that finishes without a conflict. On a
  conflict, run `git merge --abort` and report the conflicting files, unless
  the owner said in this session to resolve conflicts or finish this
  merge. Then read both sides of each file, stop and ask when the right
  result is not clear, stage the resolved files, and commit with a
  message you write, with no AI credit line. Never `git commit --no-edit`
  after a conflict.

## Work that another skill does

| For | Use |
| --- | --- |
| Throwing away local work to match the remote exactly | `reset-to-remote` |
| A toolkit update | `project-setup` |

---
name: pull-latest
description: 'Fetches and merges new remote commits into the local repository while preserving local work and commit history. Use when the owner asks to "get the latest" or "sync with remote". For discarding local work, use reset-to-remote. For updating installed Toolkit V2 files, use project-setup.'
---

# Pull the latest from the remote

Bring the current checkout up to date with its remote, and from your own
worktree the main checkout too, without losing local work or rewriting a
commit. Never rebase, reset, stash, switch branches, or push: pushing is the
owner's decision. Other sessions may be working in this repository now. Run
each Git command on its own.

The two sections below, on the remote and the default branch and on updating
the main checkout, are also the procedures that `publish-docs`,
`merge-and-clean-up`, and `reset-to-remote` follow.

## Find the remote and the default branch

`<remote>` is the verified remote: the remote the owner named, the remote of
the current branch's upstream, or the repository's only remote. When none of
these identifies one remote, ask the owner which remote to use. When
`git remote` prints nothing, the repository has no remote: never fetch, and
never report a missing fetch as a blocker.

The default branch, `<default>`, comes from
`git symbolic-ref --short refs/remotes/<remote>/HEAD`, which prints
`<remote>/<default>`. When that fails, run `git fetch <remote>` and try
again; when it still fails, read the "HEAD branch" line of
`git remote show <remote>`. Never assume `main`. With no remote, the default
branch is the branch that the main checkout has:
`git -C <main checkout> branch --show-current`.

## Update the main checkout safely

The main checkout is the first path that `git worktree list` prints. Change
it only by a fast-forward of its default branch to `<target>`, which is
`<remote>/<default>` after a fetch unless the calling skill names another
commit. Never merge, rebase, reset, stash, or switch branches there. A skill
that updates another checkout, such as a merge's base worktree, uses the same
steps with that checkout and its branch.

1. Run `git -C <main checkout> branch --show-current`. When it does not print
   `<default>`, change nothing.
2. Compare `git -C <main checkout> diff --name-only HEAD <target>`, the files
   the update changes, with `git -C <main checkout> status --porcelain`, the
   files with uncommitted changes. A file in both lists blocks the update:
   change nothing, and never commit, stash, or discard that file.
3. When nothing blocks, run `git -C <main checkout> merge --ff-only <target>`.
   When Git refuses, change nothing.

Report whether the main checkout was updated, was already up to date, or was
left alone. Give the new commit, or what blocked the update: the branch it is
on, the blocking files, or Git's message.

## Steps

1. **Look first.** Run `git remote`, `git worktree list`, `git status -sb`,
   and `git branch --show-current`. Stop and say why when:
   - there is no remote;
   - no branch is checked out;
   - the working tree has uncommitted changes (untracked `??` files alone do
     not count): the changes may be another session's work, so never commit
     or discard them;
   - this is the main checkout on a branch other than the default branch.
     Your own worktree on your own branch is fine.

   When you stop in your own worktree for no checked-out branch or for
   uncommitted changes, still fetch and update the main checkout before you
   stop, and report it.

   Find `<remote>` and `<default>` as "Find the remote and the default
   branch" says.
2. **Fetch the remote.** Run `git fetch --prune <remote>`. In your own
   worktree, then update the main checkout as "Update the main checkout
   safely" says.
3. **The branch has an upstream.** Verify the branch to pull on `<remote>`.
   Use its upstream branch name when the upstream is on that remote;
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
   `git log --oneline HEAD..<remote>/<default>`. When it lists nothing, the
   branch already holds everything on the default branch. Otherwise tell the
   owner how many commits it lists and ask whether to merge that default
   branch into this branch. After the owner's yes, run
   `git merge --no-edit <remote>/<default>`.
5. **Report** the incoming commits (an entry for each, then what they change
   together), where the branch now stands against its upstream or the default
   branch, and anything step 3 found: another session's commits, or content
   already on the remote under another commit id. When the branch is ahead,
   say that pushing is the owner's decision. From your own worktree, add the
   main checkout's result. State any decision the owner must make or the next
   available action.

## Merge conflicts

`--no-edit` is only for a merge that finishes without a conflict. On a
conflict, run `git merge --abort` and report the conflicting files, unless
the owner said in this session to resolve conflicts or finish this merge.
Then read both sides of each file, stop and ask when the right result is not
clear, stage the resolved files, and commit with a message you write. Never
`git commit --no-edit` after a conflict.

## Work that another skill does

| For | Use |
| --- | --- |
| Throwing away local work to match the remote exactly | `reset-to-remote` |
| A toolkit update | `project-setup` |

---
name: pull-latest
description: >-
  Brings the local repository up to date with its remote safely: fetch, fast-forward, or a merge pull when the two have diverged; never rebase, reset, or push. Use when the owner says "get the latest", "pull the latest changes", "update from origin", or "grab what others pushed".
---

# Pull the latest from the remote

Bring the current checkout up to date with its remote without destroying or
rewriting anything. Other sessions may be working in this repository right now.

1. **Look first.** Run `git status -sb` and `git rev-parse --abbrev-ref HEAD`.
   A dirty working tree, or the shared primary checkout on a branch other than
   the default branch: stop and report. Your own worktree on your own branch is
   fine.
2. **Fetch, then try a fast-forward:**

   ```bash
   git fetch --prune origin
   git pull --ff-only
   ```

3. **Diverged:** look at both sides before joining them:

   ```bash
   git log --oneline @{u}..HEAD
   git log --oneline HEAD..@{u}
   ```

   Then, unless the local commits look like another session's work that does
   not belong here, run `git pull --no-rebase --no-edit`.
4. **Never push, rebase, or reset.**
5. **Report** the incoming commits and the final state.

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

The owner wanting to throw away local work ("wipe local", "match remote
exactly") is a different job: `reset-to-remote`.

## Why these limits

Other sessions may hold worktrees, point at local commits, or be in the middle
of a task. Anything that rewrites or discards history (`reset`, `rebase`, a
`checkout` of another branch) can strand their work, so it is off the table.
Pushing is off the table too: publishing is the owner's call.

## Step 1 in detail: stop conditions

- **Dirty working tree:** stop. Do not stash, commit, or "fix" it; another
  session may be in the middle of a task. Report exactly what is dirty and ask.
- **Shared primary checkout on an unexpected branch:** stop and report, for the
  same reason.

## Step 3 in detail: inspect before joining

A refused fast-forward means local has commits the remote does not. Look at
them:

```bash
git show --stat <local-only-commit>
```

Answer before touching anything:

- Who wrote the local-only commits? The owner's own unpushed work is normal.
  Another agent's commit sitting on a shared branch is worth flagging.
- Did the same content already land on the remote another way (for example a
  squash-merged pull request with a different commit id)? Check with
  `git cat-file -e @{u}:<path>` or by comparing the files.

If the local-only commits look like another session's unfinished work that
should not be on this branch, stop and report instead of merging.

Why a merge and not a rebase: a rebase rewrites the local commit ids, which can
strand other sessions or worktrees that point at them. A merge keeps both sides
as they are. If the merge has conflicts, stop and report the conflicting files,
unless the fix is obvious and the owner asked you to finish the update.

## Step 5 in detail: the report

After a merge, the branch is ahead of its upstream (the local commits plus the
merge commit). Leave it that way.

- Incoming commits, one line each, and one line on what they change. Use the
  diffstat and name anything surprising, such as a new folder or subsystem.
- Remote branches created or deleted by the prune.
- The final state: "up to date with origin/<branch>", or "ahead by N commits
  (which ones); pushing is your call".
- Anything odd found in step 3, even when you went ahead.

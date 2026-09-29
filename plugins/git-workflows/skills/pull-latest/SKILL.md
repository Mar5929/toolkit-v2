---
name: pull-latest
description: 'Brings the local repository up to date with its remote by fetching and merging, without a rebase or a reset, so no local work or shared history is lost. Use when the owner says "get the latest", "pull the latest changes", "update from origin", or "grab what others pushed". Not for throwing away local work; use reset-to-remote.'
---

# Pull the latest from the remote

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

Bring the current checkout up to date with its remote without destroying or
rewriting anything. Other sessions may be working in this repository right now.

1. **Look first.** Run `git remote`, `git status -sb`, and
   `git rev-parse --abbrev-ref HEAD`. No remote (`git remote` prints nothing):
   there is nothing to pull; say so in one line and stop, with no fetch. The
   branch has no upstream (`git status -sb` shows no `...origin/<branch>`
   after the branch name): it has nothing to pull, and `git pull --ff-only`
   would fail with "no tracking information"; say so in one line and stop. A
   dirty working tree, or the shared primary checkout on a branch other than
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
5. **Report** the incoming commits and the final state, and end with the one
   question for the owner or the exact words that continue.

The owner wanting to throw away local work ("wipe local", "match remote
exactly") is a different job: `reset-to-remote`.

## Gotchas

- Codex keeps `.git/` read-only and turns the network off. `git fetch` and
  `git pull` each run alone, with `sandbox_permissions` set to
  `require_escalated` and a one-line reason ("Fetch origin and fast-forward
  main."). Refused without asking: show the owner the exact commands and wait
  (`references/git-rules.md`, "Git writes in Codex").
- `--no-edit` is only for a merge pull that finishes cleanly. A merge that
  stops on a conflict: stop and report the files, unless the owner asked you
  to finish the update; then commit with a message you write
  (`references/git-rules.md`, "A merge that stops on a conflict").
- After a merge pull the branch is ahead of its upstream. Leave it that way.
- A dirty working tree is another session's work until shown otherwise. Stop
  and report it; never stash, commit, or discard it.

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

## References

| File | Open it when |
| --- | --- |
| `references/git-rules.md` | Before a fetch or pull in Codex, a merge that stops on a conflict, or a project with no remote |

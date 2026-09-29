---
name: reset-to-remote
description: 'Makes the local repository an exact copy of its remote, discarding local changes and branches the remote no longer has, after showing a plan, so a stale checkout starts clean and nothing is lost by surprise. Use only when the owner asks for that in his own words, for example "wipe local", "match remote exactly", or "fresh start from remote".'
---

# Reset to remote

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

Bring a local repository into exact alignment with its remote: the safe
equivalent of deleting the folder and cloning again, without losing
remote-tracking refs or local tool setup. It throws away local changes, so it is
gated by checks and the owner's yes.

1. **Run only on the owner's own words** asking for a destructive reset. A plain
   "get the latest" is `pull-latest`.
2. **Refuse when work is at risk:** more than one remote and no clear source;
   uncommitted changes here or in another worktree; any stash; a branch in the
   plan that another worktree has checked out; or any other worktree at all,
   until the owner confirms no other session is working in this repository.
   Report what blocks it and stop.
3. **Fetch** with `git fetch --all --prune`, then find the default branch from
   the remote (never assume `main`).
4. **Show the plan:** branches to hard-reset (with their target commits),
   branches to delete because their remote branch is gone, and local-only
   branches that will be kept. Include the line about the shared checkout
   (Gotchas). Wait for a yes.
5. **Do the plan:** switch to the default branch, reset and delete as planned,
   then run the lockfile's installer. Ask when there are several lockfiles.
6. **Report** the default branch and its new head commit, the branches reset,
   deleted, and kept, and whether the install ran and changed anything. End
   with the one question for the owner or the exact words that continue.

The owner chose "stop on dirty state" over automatic stashing: hidden stashes
get forgotten, and a stop forces a real decision.

## Gotchas

- This throws away local work. Run it only on the owner's own words asking
  for it, and only after he says yes to the plan in step 4, even when he said
  "just do it".
- The project rule `.claude/rules/shared-repository-work.md` says: "In the
  shared primary checkout, never switch branches, reset, rebase, or stash."
  This skill is the one exception, and only when both hold: the owner asked
  for the reset in his own words, and `git worktree list` shows no other
  worktree, or the owner confirms that no other session is working in this
  repository. Put this line in the step 4 plan, word for word: "This switches
  branches and resets in the shared checkout. No other worktree exists (or:
  you confirmed no other session is working here)."
- `.work-items/` and `.memory/` are Git-ignored, so the reset leaves them as
  they are. Never run `git clean` with `-x` or `-X`: it deletes them, and the
  hooks refuse it in the main checkout.
- Codex keeps `.git/` read-only and turns the network off. `git fetch`,
  `git checkout`, `git reset --hard`, `git branch -f`, and `git branch -D`
  each run alone, with `sandbox_permissions` set to `require_escalated` and a
  one-line reason. The lockfile install (`npm install` and the others in step
  5) needs the network too: run it the same way. Refused without asking: show
  the owner the exact commands and wait (`references/git-rules.md`, "Git
  writes in Codex").
- No remote (`git remote` prints nothing): there is nothing to reset to. Say
  so and stop, with no fetch.
- A local branch with no upstream is almost always unpushed work. It is kept
  unless the owner says yes for that branch.

## Step 2 in detail: the preflight

First, which remote:

```bash
git remote -v
```

- No remote at all (`git remote` prints nothing): there is nothing to reset
  to. Say so and stop; never fetch.
- `origin` exists: use it.
- No `origin` (for example it was renamed to `upstream`): stop and ask which
  remote is the source.
- Several remotes: default to `origin`, and name the others so the owner can
  correct you.

Then check for work at risk:

```bash
git status --porcelain
git stash list
git worktree list --porcelain
```

- `git status --porcelain` has output: modified or staged files mean the owner
  commits or stashes them first; only discard them (`git checkout -- .`,
  `git clean -fd`) after an explicit yes for exactly that. Untracked files only:
  ask before treating them as safe; some workflows depend on local-only files.
- `git stash list` has entries: ask whether each stash is still wanted.
- Other worktrees exist: run `git -C <path> status --porcelain` in each. Any
  output, or any branch in the plan that another worktree has checked out,
  means another session's work: stop and report it. Never reset, switch, or
  delete a branch another session is using.
- Other worktrees exist and all are clean: a clean worktree can still belong
  to a session that is working right now. Name each worktree and its branch,
  and ask the owner whether any other session is working in this repository.
  Go on only after he confirms none is.

## Step 3 in detail: fetch and find the default branch

```bash
git fetch --all --prune
git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's@^origin/@@'
```

If the second command prints nothing, use:

```bash
git remote show origin | awk '/HEAD branch/ {print $NF}'
```

Some repositories use `master`, `develop`, or `trunk`.

## Step 4 in detail: the plan

```bash
git for-each-ref --format='%(refname:short) | %(upstream:short) | %(upstream:track)' refs/heads/
```

| Group | Condition | Action |
| --- | --- | --- |
| Tracking, remote branch exists | has an upstream, and the track column does not say `[gone]` | hard-reset to the upstream tip |
| Tracking, remote branch deleted | has an upstream, and the track column says `[gone]` | delete the local branch |
| No upstream | empty upstream column | keep it and warn |

Show branch names and target commits for resets, branch names for deletions,
and every local-only branch that will be kept. A local-only branch is almost
always unpushed work; call it out clearly. Wait for the owner's yes before any
destructive command.

## Step 5 in detail: carry out the plan

Switch to the default branch first, because Git cannot reset or delete the
branch you are on:

```bash
git checkout <default-branch>
```

Reset each tracking branch:

- The current branch: `git reset --hard <upstream>`
- Any other branch: `git branch -f <branch> <upstream>` (updates the branch
  without checking it out: no working-tree changes, no checkout hooks)

Delete each branch whose remote branch is gone:

```bash
git branch -D <branch>
```

Use `-D`, not `-d`: the branch may be ahead of any remote now that its upstream
is gone, and `-d` would refuse.

Then reinstall dependencies from the lockfile in the repository root. Skip this
when there is no lockfile.

| Lockfile | Command |
| --- | --- |
| `pnpm-lock.yaml` | `pnpm install` |
| `package-lock.json` | `npm install` |
| `yarn.lock` | `yarn install` |
| `bun.lockb` or `bun.lock` | `bun install` |

With several lockfiles, ask which package manager is the right one. The wrong
one can rewrite the wrong lockfile or install a different set of packages.

## Never do these

- Run `git pull`: it can create a merge commit, which is exactly the state the
  owner wants to throw away. Use fetch and reset.
- Use `--force` on `git fetch`.
- Delete a local branch with no upstream without the owner's yes for that
  branch.
- Skip the preflight, even when the owner says "just do it". Show what is dirty
  first.
- Run an install when there is no lockfile.
- Assume `main` is the default branch.
- Guess between several lockfiles.
- Push anything.

## References

| File | Open it when |
| --- | --- |
| `references/git-rules.md` | Before a Git write in Codex, or to check the no-remote case |

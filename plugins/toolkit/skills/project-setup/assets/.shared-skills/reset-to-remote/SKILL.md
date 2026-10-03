---
name: reset-to-remote
description: 'Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in his own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest.'
---

# Reset to remote

Make a local repository an exact copy of its remote: discard local commits
on branches that have an upstream, and delete branches whose remote branch
is gone. Discard nothing the owner did not see in the plan and say yes to,
and never touch another session's work.

The reset happens in the main checkout (the first path `git worktree list`
prints). Run every Git command below as `git -C <main checkout> ...`: from
another worktree, Git refuses to check out or reset a branch the main
checkout holds. Every other worktree is one of the "other worktrees" in
step 2, this session's own too when it is not the main checkout.

## Steps

1. **Run only on the owner's own words** asking for a destructive reset.
   Even when he says "just do it", change nothing until he says yes to the
   step 4 plan.
2. **Stop when work is at risk.** Run each on its own: `git remote -v`,
   `git status --porcelain`, `git stash list`, `git worktree list --porcelain`.
   - No remote: nothing to reset to; never fetch. No `origin` (for example it
     was renamed to `upstream`): ask which remote is the source. Several
     remotes: default to `origin` and name the others.
   - Uncommitted changes: the owner commits or stashes them first. Discard
     them only after an explicit yes for exactly that. Untracked files only:
     name them and ask whether to go on; `git reset --hard` overwrites an
     untracked file at a path the remote branch also has.
   - Any stash: ask whether each is still wanted, and drop only the ones he
     says to drop. Never stash changes yourself.
   - Other worktrees: run `git -C <path> status --porcelain` in each. Any
     output, or another worktree with a branch that has an upstream checked
     out, is another session's work: stop and report it. Even when all are
     clean, name each worktree and its branch and ask whether another session
     is working in this repository; go on only after he confirms none is.

   Report what blocks it and wait.
3. **Fetch and find the default branch.** `git fetch --all --prune`, then
   `git symbolic-ref --short refs/remotes/origin/HEAD`, which prints
   `origin/<default-branch>`. If it fails, read the "HEAD branch" line of
   `git remote show origin`. Never assume `main`.
4. **Show the plan.** List branches with
   `git for-each-ref --format='%(refname:short) | %(upstream:short) | %(upstream:track)' refs/heads/`
   and sort them into three groups:
   - **Reset**: has an upstream, and the track column does not say `[gone]`.
     Give the branch, the target commit, and the commits that exist only on
     this computer (`git log --oneline <branch> --not --remotes`, run on its
     own), marked "will be discarded". Nothing printed: "nothing local is
     lost". When `gh pr list --state merged --head <branch>` shows a squash
     merge, say the listed commits are in it (skip when `gh` is missing).
   - **Delete**: the track column says `[gone]`. Give the branch and its
     commits that are on no remote branch, marked "will be discarded".
   - **Keep**: no upstream. One line each: "not linked to the remote; may hold
     work that is only on this computer; kept". Delete one only on his yes
     for that branch.

   Add one **Install** line: the install command step 5 will run. The
   lockfile is the one `git ls-tree --name-only origin/<default-branch>`
   lists (`pnpm-lock.yaml`: `pnpm install`; `package-lock.json`:
   `npm install`; `yarn.lock`: `yarn install`; `bun.lockb` or `bun.lock`:
   `bun install`).
   - No lockfile: write "No lockfile, so no install."
   - Several lockfiles: ask which package manager.
   - `command -v <installer>` prints nothing: write "`<installer>` is not
     installed, so the install is skipped." Never install it.

   Include the shared-checkout line from Gotchas that is true, word for word.
   Wait for a yes.
5. **Do the plan.** `git checkout <default-branch>`. Then
   `git reset --hard <upstream>` for the current branch,
   `git branch -f <branch> <upstream>` for each other branch to reset, and
   `git branch -D <branch>` for each branch to delete. Then confirm the
   branches: run the step 4 `git for-each-ref` command again. Each branch of
   the Reset group must show an empty track column, and no branch of the
   Delete group may be listed. Anything else: stop and report it. Then run
   the install command the plan named, from the main checkout's root folder.
   The plan named none: run no install.
6. **Report** the default branch and its new head commit, the branches reset,
   deleted, and kept, the commits discarded (short id and subject), and
   whether the install ran and changed anything, or why it was skipped. End
   with the one question the owner must answer, or else the exact words he
   can say to start the next step.

## Gotchas

- The project rule `.claude/rules/shared-repository-work.md` says: "In the
  shared main checkout, never switch branches, reset, rebase, or stash." This
  skill is the one exception, and only when (1) the owner asked for the reset
  in his own words and (2) `git worktree list` shows no other worktree, or the
  owner confirmed that no other session is working in this repository. Put
  one of these lines in the plan, word for word, whichever is true: "This
  switches branches and resets them in the project folder that other sessions
  share. No other worktree exists." or "This switches branches and resets them
  in the project folder that other sessions share. You confirmed no other
  session is working here."
- Git refuses to delete a branch that another worktree has checked out. Tell
  the owner, and leave the branch and the worktree as they are. Never remove
  a worktree to get past the refusal.
- `work-items/`, `memory/`, and `.obsidian/` are Git-ignored, so the reset
  leaves them as they are. Never run `git clean` with `-x` or `-X`: it deletes
  them, and Git cannot bring them back.
- Never run `git pull`, never use `--force` on `git fetch`, and never push.
- In Claude Code the project's settings ask the owner before every
  `git reset --hard` and every `git clean`. That prompt is expected.
- In Codex the sandbox keeps `.git/` read-only and blocks the network. Run
  each Git write and each network call (the `gh pr list` check and the
  lockfile install included) alone, with escalated permissions
  (`sandbox_permissions` set to `require_escalated`, with a one-line reason).
  When Codex refuses without asking, show the owner the exact command and
  ask him to run it.

## Hand-offs

| For | Use |
| --- | --- |
| A routine update, such as "get the latest" | `pull-latest` |

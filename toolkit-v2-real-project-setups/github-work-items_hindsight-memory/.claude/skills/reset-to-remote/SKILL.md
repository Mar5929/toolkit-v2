---
name: reset-to-remote
description: 'Shows a plan, then makes the local repository match its remote by discarding local commits and removing branches whose remote branches are gone. Use only when the owner explicitly asks to "wipe local", "match remote exactly", or start fresh from the remote. For a routine update that keeps local work, use pull-latest.'
---

# Reset to remote

Use this skill to make a local repository an exact copy of its remote. The reset discards local commits on branches that follow a remote branch (their upstream), and it deletes branches whose remote branch is gone. A routine update that keeps local work is the job of `pull-latest`.

Two rules apply to every step:

- Discard nothing that the owner did not see in the plan and say yes to.
- Never change another session's work.

## Where the reset runs

The reset happens in the main checkout. Run every Git command below as `git -C <main checkout> ...`, because from another worktree Git refuses to check out or reset a branch that the main checkout holds. Every other worktree, including this session's own, is one of the "other worktrees" in step 2.

`.claude/rules/shared-repository-work.md` forbids switching branches, resetting, rebasing, or stashing in the shared main checkout. This skill is the one exception, and only when the owner asked for the reset in the owner's own words and `git worktree list` shows no other worktree or the owner confirmed that no other session is working in this repository.

## Steps

1. **Run only on the owner's own words** that ask for a destructive reset. Even when the owner says "just do it", change nothing until the owner says yes to the plan of step 4.
2. **Stop when work is at risk.** Run `git remote -v`, `git status --porcelain`, `git stash list`, and `git worktree list --porcelain`. Report what blocks the reset, and wait.
   - **Remote.** When there is no remote, there is nothing to reset to; never fetch. Otherwise find `<remote>`, the source remote, as `pull-latest`, "Find the remote and the default branch", says, and name any other remotes. Each branch still resets to its own upstream, which the plan names.
   - **Uncommitted changes.** The owner commits or stashes uncommitted changes first. Discard them only after an explicit yes for exactly that. When the only uncommitted changes are untracked files, name the files and ask whether to go on, because `git reset --hard` overwrites an untracked file at a path that the remote branch also has.
   - **Stashes.** When any stash exists, ask whether each stash is still wanted, and drop only the stashes that the owner says to drop. Never stash changes yourself.
   - **Other worktrees.** Run `git -C <path> status --porcelain` in each other worktree. Any output is another session's work, and so is another worktree that has a branch with an upstream checked out; stop and report it. Even when all other worktrees are clean, name each worktree and its branch, and ask whether another session is working in this repository. Go on only after the owner confirms that no other session is.
3. **Fetch and find the default branch.** Run `git fetch --all --prune`. Find `<default>` as `pull-latest`, "Find the remote and the default branch", says.
4. **Show the plan.** List the branches:

   ```text
   git for-each-ref --format='%(refname:short) | %(upstream:short) | %(upstream:track)' refs/heads/
   ```

   Sort the branches into three groups:
   - **Reset**: the branch has an upstream, and the track column does not say `[gone]`. Give the branch, the target commit, and the commits that exist only on this computer, marked "will be discarded"; `git log --oneline <branch> --not --remotes` lists them. When it prints nothing, write "nothing local is lost". When `gh pr list --state merged --head <branch>` shows a squash merge, say that the listed commits are in that merge; skip this check when `gh` is missing.
   - **Delete**: the track column says `[gone]`. Give the branch and its commits that are on no remote branch, marked "will be discarded".
   - **Keep**: the branch has no upstream. Write an entry for each: "not linked to the remote; may hold work that is only on this computer; kept". Delete such a branch only on the owner's yes for that branch.

   Add one **Install** line naming the install command that step 5 will run. Choose it from the package manager of the lockfile (the file that records the project's exact package versions) that `git ls-tree --name-only <remote>/<default>` lists.
   - When there is no lockfile, write "No lockfile, so no install."
   - When there are several lockfiles, ask which package manager to use before you show the plan.
   - When `command -v <installer>` prints nothing, write "`<installer>` is not installed, so the install is skipped." Never install the installer.

   State that the plan switches and resets branches in the shared main checkout, and whether no other worktree exists or the owner confirmed that no other session is working there. Then wait for approval of the plan.
5. **Do the plan**, in this order:
   1. Run `git checkout <default>`.
   2. Run `git reset --hard <upstream>` for the current branch, `git branch -f <branch> <upstream>` for each other branch to reset, and `git branch -D <branch>` for each branch to delete.
   3. Run the `git for-each-ref` command of step 4 again. Each branch of the Reset group must show an empty track column. No branch of the Delete group may be listed, except one that Git refused to delete. When you see anything else, stop and report it.
   4. Run the install command that the plan named, from the root folder of the main checkout. When the plan named none, run no install.
6. **Report** the default branch and its new head commit; the branches reset, deleted, and kept; the commits discarded, each with its short id and subject; and whether the install ran and changed anything, or why it was skipped. State any decision the owner must make or the next available action.

## Mistakes to avoid

- Git refuses to delete a branch that another worktree has checked out. Tell the owner, and leave the branch and the worktree as they are. Never remove a worktree to get past the refusal.
- The reset leaves the project's Git-ignored folders as they are, such as folders of local records that the project keeps out of Git. Never run `git clean` with `-x` or `-X`, because it deletes them and Git cannot bring them back.
- Never run `git pull`, never use `--force` on `git fetch`, and never push.
- In Claude Code, the project's settings ask the owner before every `git reset --hard` and every `git clean`. That prompt is expected.

## Work that another skill does

| For | Use |
| --- | --- |
| A routine update, such as "get the latest" | `pull-latest` |

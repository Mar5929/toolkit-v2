---
name: reset-to-remote
description: 'Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in the owner''s own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest.'
---

# Reset to remote

Use this skill to make a local repository an exact copy of its remote. The reset discards local commits on branches that have an upstream, and it deletes branches whose remote branch is gone. An upstream is the remote branch that a local branch follows.

Two rules apply to every step:

- Discard nothing that the owner did not see in the plan and say yes to.
- Never change another session's work.

A routine update that keeps local work is the job of `pull-latest`.

## Where the reset runs

The reset happens in the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints. Run every Git command below as `git -C <main checkout> ...`, because from another worktree Git refuses to check out or reset a branch that the main checkout holds. A worktree is a separate folder with its own branch.

Every other worktree is one of the "other worktrees" in step 2. This session's own worktree is one of them too, when it is not the main checkout.

## Steps

1. **Run only on the owner's own words** that ask for a destructive reset. Even when the owner says "just do it", change nothing until the owner says yes to the plan of step 4.
2. **Stop when work is at risk.** Run each of these commands on its own: `git remote -v`, `git status --porcelain`, `git stash list`, `git worktree list --porcelain`. Then check the four things below. Report what blocks the reset, and wait.
   - **Remotes.**
     - When there is no remote, there is nothing to reset to. Never fetch.
     - When no remote is named `origin`, for example because it was renamed to `upstream`, ask which remote is the source.
     - When there are several remotes, default to `origin` and name the others.
   - **Uncommitted changes.**
     - The owner commits or stashes uncommitted changes first. Discard them only after an explicit yes for exactly that.
     - When the only uncommitted changes are untracked files, name the files and ask whether to go on. `git reset --hard` overwrites an untracked file at a path that the remote branch also has.
   - **Stashes.** When any stash exists, ask whether each stash is still wanted, and drop only the stashes that the owner says to drop. Never stash changes yourself.
   - **Other worktrees.** Run `git -C <path> status --porcelain` in each other worktree.
     - Any output is another session's work. So is another worktree that has a branch with an upstream checked out. In either case, stop and report it.
     - Even when all other worktrees are clean, name each worktree and its branch, and ask whether another session is working in this repository. Go on only after the owner confirms that no other session is.
3. **Fetch and find the default branch.** Run `git fetch --all --prune`. Then run `git symbolic-ref --short refs/remotes/origin/HEAD`, which prints `origin/<default-branch>`. When that command fails, read the "HEAD branch" line of `git remote show origin`. Never assume `main`.
4. **Show the plan.** List the branches with this command:

   ```text
   git for-each-ref --format='%(refname:short) | %(upstream:short) | %(upstream:track)' refs/heads/
   ```

   Each line shows a branch, its upstream, and the track column. Sort the branches into three groups:
   - **Reset**: the branch has an upstream, and the track column does not say `[gone]`.
     - Give the branch, the target commit, and the commits that exist only on this computer, marked "will be discarded". `git log --oneline <branch> --not --remotes`, run on its own, lists those commits.
     - When that command prints nothing, write "nothing local is lost".
     - When `gh pr list --state merged --head <branch>` shows a squash merge, say that the listed commits are in that merge. Skip this check when `gh` is missing.
   - **Delete**: the track column says `[gone]`. Give the branch and its commits that are on no remote branch, marked "will be discarded".
   - **Keep**: the branch has no upstream. Write one line for each such branch: "not linked to the remote; may hold work that is only on this computer; kept". Delete such a branch only on the owner's yes for that branch.

   Add one **Install** line to the plan. It names the install command that step 5 will run. The lockfile decides the command. A lockfile is the file that records the exact versions of the project's packages. Use the lockfile that `git ls-tree --name-only origin/<default-branch>` lists:

   | Lockfile | Install command |
   | --- | --- |
   | `pnpm-lock.yaml` | `pnpm install` |
   | `package-lock.json` | `npm install` |
   | `yarn.lock` | `yarn install` |
   | `bun.lockb` or `bun.lock` | `bun install` |

   - When there is no lockfile, write "No lockfile, so no install."
   - When there are several lockfiles, ask which package manager to use before you show the plan.
   - When `command -v <installer>` prints nothing, write "`<installer>` is not installed, so the install is skipped." Never install the installer.

   Include, word for word, the line about the shared main checkout that is true. "Mistakes to avoid" below gives the two lines. Then wait for a yes.
5. **Do the plan**, in this order:
   1. Run `git checkout <default-branch>`.
   2. Run `git reset --hard <upstream>` for the current branch, `git branch -f <branch> <upstream>` for each other branch to reset, and `git branch -D <branch>` for each branch to delete.
   3. Confirm the branches. Run the `git for-each-ref` command of step 4 again. Each branch of the Reset group must show an empty track column. No branch of the Delete group may be listed, except a branch that Git refused to delete ("Mistakes to avoid" says when Git refuses). When you see anything else, stop and report it.
   4. Run the install command that the plan named, from the root folder of the main checkout. When the plan named no install command, run no install.
6. **Report** these four things:
   - the default branch and its new head commit;
   - the branches reset, deleted, and kept;
   - the commits discarded, each with its short id and subject;
   - whether the install ran and changed anything, or why it was skipped.

   End with the one question the owner must answer, or else the exact words the owner can say to start the next step.

## Mistakes to avoid

- The project rule `.claude/rules/shared-repository-work.md` says: "In the shared main checkout, never switch branches, reset, rebase, or stash." This skill is the one exception, and only when both of these are true:
  1. The owner asked for the reset in the owner's own words.
  2. `git worktree list` shows no other worktree, or the owner confirmed that no other session is working in this repository.

  Put one of these two lines in the plan, word for word, whichever is true:
  - "This switches branches and resets them in the project folder that other sessions share. No other worktree exists."
  - "This switches branches and resets them in the project folder that other sessions share. You confirmed no other session is working here."
- Git refuses to delete a branch that another worktree has checked out. Tell the owner, and leave the branch and the worktree as they are. Never remove a worktree to get past the refusal.
- `work-items/`, `memory/`, and `.obsidian/` are Git-ignored, so the reset leaves them as they are. Never run `git clean` with `-x` or `-X`, because it deletes them and Git cannot bring them back.
- Never run `git pull`, never use `--force` on `git fetch`, and never push.
- In Claude Code, the project's settings ask the owner before every `git reset --hard` and every `git clean`. That prompt is expected.
- In Codex, the sandbox keeps `.git/` read-only and blocks the network. Run each Git write and each network call alone, with escalated permissions (`sandbox_permissions` set to `require_escalated`, with a one-line reason). The `gh pr list` check and the lockfile install are included. When Codex refuses without asking, show the owner the exact command and ask the owner to run it.

## Work that another skill does

| For | Use |
| --- | --- |
| A routine update, such as "get the latest" | `pull-latest` |

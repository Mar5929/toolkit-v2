# TKV-64 shared skill content review

No commits or external writes. Uncertain owner requirements remain unchanged.

## Changes and protected outcomes

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/reset-to-remote/SKILL.md

Before:
```text
---
name: reset-to-remote
description: 'Shows a plan, then makes the local repository match its remote by discarding local commits and removing branches whose remote branches are gone. Use only when the owner explicitly asks to "wipe local", "match remote exactly", or start fresh from the remote. For a routine update that keeps local work, use pull-latest.'
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

```
After:
```text
---
name: reset-to-remote
description: 'Shows a plan, then makes the local repository match its remote by discarding local commits and removing branches whose remote branches are gone. Use only when the owner explicitly asks to "wipe local", "match remote exactly", or start fresh from the remote. For a routine update that keeps local work, use pull-latest.'
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
- Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.

## Work that another skill does

| For | Use |
| --- | --- |
| A routine update, such as "get the latest" | `pull-latest` |

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/merge-and-clean-up/SKILL.md

Before:
```text
---
name: merge-and-clean-up
description: 'Merges one approved GitHub pull request only after its checks and the merge-safety check pass. It then removes only that pull request''s branches and worktree. Use when the owner names a pull request to merge or managing-work-items requests its merge. For an entire work item through merge and deployment, use managing-work-items.'
---

# Merge and clean up

Use this skill to merge one exact GitHub pull request and to confirm that GitHub reports it merged. After that, the skill removes only that pull request's worktree and branches. The goal is that nothing unchecked is merged, and that no other session's work is removed.

This skill merges one pull request. Taking an approved work item through merge and deployment is the job of `managing-work-items`, which uses this skill for the merge of a pull request.

Four rules apply to every step:

- Merge only the head commit that was checked and approved.
- Never stash, reset, switch, or discard another session's work.
- Run each command on its own.
- When more than one pull request could match, ask the owner which pull request to merge.

## Words used in this skill

- The head branch is the branch that holds the pull request's commits. The head commit is the commit that GitHub reports as `headRefOid` for the pull request.
- The base branch is the branch that the pull request merges into.
- A fork is a copy of the repository under another account.
- A worktree is a separate folder with its own branch. `<head-worktree>` is the worktree that holds the head branch, and `<base-worktree>` is the worktree that holds the base branch.
- The main checkout is the project's main folder: the first path that `git worktree list` prints.

## Step 1: resolve the exact pull request

Run these two commands:

```text
gh pr view --json number,url,state,headRefName,headRefOid,baseRefName,isCrossRepository,title,body,commits
git worktree list --porcelain
```

Record these facts:

- the repository;
- the pull request number and URL;
- the head branch and the head commit (`headRefOid`);
- the base branch;
- the worktrees that hold the head branch and the base branch;
- whether the head branch is in a fork.

When the local head branch exists, it must be at `headRefOid`. When it is at another commit, the local branch may hold work that is not in the pull request. Stop before step 2, keep the branch, and tell the owner.

Find the linked work item in one of two ways:

- From the name of the head branch: `claude/wi-007-<slug>` is `WI-007`, and `claude/issue-12-<slug>` is GitHub issue `#12`.
- From an ID in the pull request title, or from "Part of #12" in its body.

When you find no linked work item, skip the note in step 7.

## Step 2: check the merge is allowed

The merge is allowed in two cases. When neither case is true, stop and ask the owner.

- **The owner's own yes to this merge, in this session.**
  - "Merge and clean up" counts only when the pull request is clear from a number, a URL, or the current branch.
  - A bare "yes" counts only when it answers a question about this merge.
  - The owner's yes to the result of a work item never covers the merge.
- **`managing-work-items` sent you here.** That skill has already asked the owner, or checked the owner's standing merge instruction.

A standing merge instruction is a line in `.claude/rules/owner-preferences.md` in which the owner allows merges without a question each time. Only `managing-work-items` applies it, in its Deploying steps, because that skill holds the conditions for it. When you reached this skill in any other way, the standing merge instruction does not count here: ask the owner.

## Step 3: check the pull request on GitHub

Run these two commands:

```text
gh pr view <number> --repo <owner/repo> --json state,isDraft,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,headRefOid,baseRefName
gh pr checks <number> --repo <owner/repo>
```

Merge only when all of these are true:

- The pull request is open and is not a draft.
- The pull request is mergeable.
- The required reviews are satisfied.
- The required checks passed.
- The head and the base still match what step 1 recorded.

These cases change the step:

- When the pull request is already merged, skip the merge. Record its merge commit, and check again that the head branch and the head commit match what you plan to remove.
- When the pull request was closed without merging, or a check failed, stop and report.
- When no checks exist, `gh pr checks` exits nonzero. That exit code is not a failure. Run the checks that the project's `AGENTS.md` names under "Commands", and say plainly when no automated check exists.
- When checks are pending and the owner asked you to finish the merge, wait with `gh pr checks <number> --repo <owner/repo> --watch`, and then run step 3 again. When the owner did not ask you to finish the merge, stop and tell the owner which checks are running.
- A worktree that holds the head branch must be clean, which means that `git -C <head-worktree> status --porcelain` prints nothing. When it is not clean, stop the merge and the cleanup. Never stash or discard its changes.

## Step 4: merge-safety check

Other sessions may have uncommitted work in the main checkout. Fetch first, so that the comparison uses the remote's default branch:

```text
git fetch origin
git diff --name-only origin/<default-branch>...<head-branch>
git -C <main-checkout> status --porcelain
```

The second command lists the files that the pull request changes. The third command lists the files with uncommitted changes in the main checkout.

- With no local head branch, use `origin/<head-branch>` in the second command.
- For a pull request from a fork, use `gh pr diff <number> --repo <owner/repo> --name-only` in place of the second command.

When a file is in both lists, stop, name exactly those files, and let the owner decide whether to commit, stash, or wait. Never change, stage, stash, or discard the main checkout's changes.

## Step 5: merge

Use `--squash` unless the owner or the project's rules name another method (`--merge` or `--rebase`).

### Keep AI credit off the base branch

The merge must put no AI credit on the base branch: no `Co-Authored-By:` line that names an AI, and no "Generated with" line. Look for such a line in the title, the description, and each commit message that step 1 read.

- When the line is in the title or the description, remove it with `gh pr edit <number> --repo <owner/repo>` and `--title` or `--body-file`.
- When the line is in a commit message and the method is `--squash`, GitHub writes the new commit's message from the commits' messages. So add `--subject '<title> (#<number>)'` and `--body '<what changed, in one or two plain sentences>'` to the merge command. Never write a word that closes an issue or a work item in the subject or the body.
- When the line is in a commit message and the method is `--merge` or `--rebase`, the commits reach the base branch as they are. Stop and tell the owner.

### Run the merge

```text
gh pr merge <number> --repo <owner/repo> --squash --delete-branch --match-head-commit <headRefOid>
```

- For a fork, leave out `--delete-branch`.
- Never add an admin flag or a flag that bypasses branch protection.
- Never leave out `--match-head-commit`, and never fill it with a newer commit.

When GitHub refuses the merge:

- When the merge is refused because the head no longer matches, a new commit arrived. Stop, report the new commit, and run steps 1 to 4 again on the new head. The owner's yes covers only the head that the owner was shown, so ask the owner again. When `managing-work-items` sent you here, go back to its merge step with the new head.
- For any other refusal, stop and tell the owner the error.

### Confirm the merge

Then run `gh pr view <number> --repo <owner/repo> --json state,mergeCommit,url`. Clean up only when `state` is `MERGED`.

`gh pr merge` does not always merge:

- When required checks have not passed yet, it turns on auto-merge.
- On a base branch with a merge queue, it refuses `--delete-branch`. Without that flag, it only queues the pull request. Do not run it again unless the owner says to.

In both cases the pull request is not merged yet. Remove nothing, and tell the owner the state of the pull request.

## Step 6: update the base worktree, then remove only the merged worktree and branches

### Update the base worktree

Run `git -C <base-worktree> fetch --prune origin` and `git -C <base-worktree> status --porcelain`.

A blocking file is an uncommitted file in the base worktree that is also in step 4's list of the files that this pull request changed. Leave every other uncommitted file as it is.

- When there is no blocking file and the base worktree is on the base branch, run `git -C <base-worktree> pull --ff-only`.
- When there is a blocking file, or the base worktree is on another branch, or the pull fails, change nothing in the base worktree and skip the local cleanup. Report which of the three it was.
- Never reset, stash, switch, or rebase the base worktree.

### Remove the worktree and the branches

Remove nothing unless all five proofs hold:

1. GitHub reports this exact pull request merged.
2. The branch to remove is the pull request's head branch, not the base branch or the default branch.
3. The worktree to remove is clean.
4. The local branch is still at the recorded head commit.
5. No other worktree uses that branch.

When a proof is missing, tell the owner which proof failed and exactly what is still there.

Run the cleanup from the base worktree, never from inside the worktree that is being removed:

```text
git -C <base-worktree> worktree remove <head-worktree>
git -C <base-worktree> branch -d <head-branch>
git -C <base-worktree> worktree prune
```

- After a squash merge, `git branch -d` can refuse. Use `git branch -D <head-branch>` only for this pull request's head branch, and only when all five proofs hold.
- When GitHub did not delete the remote branch, run `git -C <base-worktree> push origin --delete <head-branch>`, but only when the branch is in the same repository and belongs to this pull request. Then run `git -C <base-worktree> fetch --prune origin`.
- Never delete a fork branch.

## Step 7: work item note and report

### The note on the work item

When step 1 found a linked work item:

- When `managing-work-items` sent you here, add nothing, because that skill adds the Recent History row.
- When the owner asked you directly, add one Recent History row with `managing-work-items`: "Merged pull request #<number> as <merge commit>."

Never change the State, and never mark anything Done.

### Verify

Verify four things:

- The pull request is merged.
- The base worktree matches its upstream, which is the remote branch that its branch follows.
- The head branch and its worktree are gone.
- Every unrelated worktree remains.

### Report

- When `managing-work-items` sent you here, say the pull request link, the merge commit, and the cleanup result in one line. Then go on with the rest of its Deploying steps.
- When the owner asked you directly, report these six things:
  - the pull request link;
  - the merge commit;
  - whether the base worktree is up to date;
  - any uncommitted files left in the base worktree;
  - the cleanup result;
  - whether the Recent History row was saved. When that save failed, start that line with "Not saved".

  End with the one question for the owner, or with the exact words that continue, for example "Say 'finish WI-007' and I'll close the work item."

## Mistakes to avoid

- In Codex, the sandbox keeps `.git/` read-only and blocks the network. Run each Git write and each network call alone, with escalated permissions (`sandbox_permissions` set to `require_escalated`, with a one-line reason). Every `gh` call is a network call. When Codex refuses without asking, show the owner the exact command and ask the owner to run it.
- When the repository has no remote (`git remote` prints nothing), there is no pull request, so this skill does not apply. Never fetch. Tell the owner in one line.

## Work that another skill does

| For | Use |
| --- | --- |
| The merge note on the work item, when the owner asked directly | `managing-work-items` |
| Changing the work item's State, or marking it Done | `managing-work-items` |
| Taking an approved work item through merge and deployment | `managing-work-items` |
| A merge under the standing merge instruction | `managing-work-items` |
| No remote: the local merge | `managing-work-items` |

```
After:
```text
---
name: merge-and-clean-up
description: 'Merges one approved GitHub pull request only after its checks and the merge-safety check pass. It then removes only that pull request''s branches and worktree. Use when the owner names a pull request to merge or managing-work-items requests its merge. For an entire work item through merge and deployment, use managing-work-items.'
---

# Merge and clean up

Use this skill to merge one exact GitHub pull request and to confirm that GitHub reports it merged. After that, the skill removes only that pull request's worktree and branches. The goal is that nothing unchecked is merged, and that no other session's work is removed.

This skill merges one pull request. Taking an approved work item through merge and deployment is the job of `managing-work-items`, which uses this skill for the merge of a pull request.

Four rules apply to every step:

- Merge only the head commit that was checked and approved.
- Never stash, reset, switch, or discard another session's work.
- Run each command on its own.
- When more than one pull request could match, ask the owner which pull request to merge.

## Words used in this skill

- The head branch is the branch that holds the pull request's commits. The head commit is the commit that GitHub reports as `headRefOid` for the pull request.
- The base branch is the branch that the pull request merges into.
- A fork is a copy of the repository under another account.
- A worktree is a separate folder with its own branch. `<head-worktree>` is the worktree that holds the head branch, and `<base-worktree>` is the worktree that holds the base branch.
- The main checkout is the project's main folder: the first path that `git worktree list` prints.

## Step 1: resolve the exact pull request

Run these two commands:

```text
gh pr view --json number,url,state,headRefName,headRefOid,baseRefName,isCrossRepository,title,body,commits
git worktree list --porcelain
```

Record these facts:

- the repository;
- the pull request number and URL;
- the head branch and the head commit (`headRefOid`);
- the base branch;
- the worktrees that hold the head branch and the base branch;
- whether the head branch is in a fork.

When the local head branch exists, it must be at `headRefOid`. When it is at another commit, the local branch may hold work that is not in the pull request. Stop before step 2, keep the branch, and tell the owner.

Find the linked work item in one of two ways:

- From the name of the head branch: `claude/wi-007-<slug>` is `WI-007`, and `claude/issue-12-<slug>` is GitHub issue `#12`.
- From an ID in the pull request title, or from "Part of #12" in its body.

When you find no linked work item, skip the note in step 7.

## Step 2: check the merge is allowed

The merge is allowed in two cases. When neither case is true, stop and ask the owner.

- **The owner's own yes to this merge, in this session.**
  - "Merge and clean up" counts only when the pull request is clear from a number, a URL, or the current branch.
  - A bare "yes" counts only when it answers a question about this merge.
  - The owner's yes to the result of a work item never covers the merge.
- **`managing-work-items` sent you here.** That skill has already asked the owner, or checked the owner's standing merge instruction.

A standing merge instruction is a line in `.claude/rules/owner-preferences.md` in which the owner allows merges without a question each time. Only `managing-work-items` applies it, in its Deploying steps, because that skill holds the conditions for it. When you reached this skill in any other way, the standing merge instruction does not count here: ask the owner.

## Step 3: check the pull request on GitHub

Run these two commands:

```text
gh pr view <number> --repo <owner/repo> --json state,isDraft,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,headRefOid,baseRefName
gh pr checks <number> --repo <owner/repo>
```

Merge only when all of these are true:

- The pull request is open and is not a draft.
- The pull request is mergeable.
- The required reviews are satisfied.
- The required checks passed.
- The head and the base still match what step 1 recorded.

These cases change the step:

- When the pull request is already merged, skip the merge. Record its merge commit, and check again that the head branch and the head commit match what you plan to remove.
- When the pull request was closed without merging, or a check failed, stop and report.
- When no checks exist, `gh pr checks` exits nonzero. That exit code is not a failure. Run the checks that the project's `AGENTS.md` names under "Commands", and say plainly when no automated check exists.
- When checks are pending and the owner asked you to finish the merge, wait with `gh pr checks <number> --repo <owner/repo> --watch`, and then run step 3 again. When the owner did not ask you to finish the merge, stop and tell the owner which checks are running.
- A worktree that holds the head branch must be clean, which means that `git -C <head-worktree> status --porcelain` prints nothing. When it is not clean, stop the merge and the cleanup. Never stash or discard its changes.

## Step 4: merge-safety check

Other sessions may have uncommitted work in the main checkout. Fetch first, so that the comparison uses the remote's default branch:

```text
git fetch origin
git diff --name-only origin/<default-branch>...<head-branch>
git -C <main-checkout> status --porcelain
```

The second command lists the files that the pull request changes. The third command lists the files with uncommitted changes in the main checkout.

- With no local head branch, use `origin/<head-branch>` in the second command.
- For a pull request from a fork, use `gh pr diff <number> --repo <owner/repo> --name-only` in place of the second command.

When a file is in both lists, stop, name exactly those files, and let the owner decide whether to commit, stash, or wait. Never change, stage, stash, or discard the main checkout's changes.

## Step 5: merge

Use `--squash` unless the owner or the project's rules name another method (`--merge` or `--rebase`).

### Keep AI credit off the base branch

The merge must put no AI credit on the base branch: no `Co-Authored-By:` line that names an AI, and no "Generated with" line. Look for such a line in the title, the description, and each commit message that step 1 read.

- When the line is in the title or the description, remove it with `gh pr edit <number> --repo <owner/repo>` and `--title` or `--body-file`.
- When the line is in a commit message and the method is `--squash`, GitHub writes the new commit's message from the commits' messages. So add `--subject '<title> (#<number>)'` and `--body '<what changed, in one or two plain sentences>'` to the merge command. Never write a word that closes an issue or a work item in the subject or the body.
- When the line is in a commit message and the method is `--merge` or `--rebase`, the commits reach the base branch as they are. Stop and tell the owner.

### Run the merge

```text
gh pr merge <number> --repo <owner/repo> --squash --delete-branch --match-head-commit <headRefOid>
```

- For a fork, leave out `--delete-branch`.
- Never add an admin flag or a flag that bypasses branch protection.
- Never leave out `--match-head-commit`, and never fill it with a newer commit.

When GitHub refuses the merge:

- When the merge is refused because the head no longer matches, a new commit arrived. Stop, report the new commit, and run steps 1 to 4 again on the new head. The owner's yes covers only the head that the owner was shown, so ask the owner again. When `managing-work-items` sent you here, go back to its merge step with the new head.
- For any other refusal, stop and tell the owner the error.

### Confirm the merge

Then run `gh pr view <number> --repo <owner/repo> --json state,mergeCommit,url`. Clean up only when `state` is `MERGED`.

`gh pr merge` does not always merge:

- When required checks have not passed yet, it turns on auto-merge.
- On a base branch with a merge queue, it refuses `--delete-branch`. Without that flag, it only queues the pull request. Do not run it again unless the owner says to.

In both cases the pull request is not merged yet. Remove nothing, and tell the owner the state of the pull request.

## Step 6: update the base worktree, then remove only the merged worktree and branches

### Update the base worktree

Run `git -C <base-worktree> fetch --prune origin` and `git -C <base-worktree> status --porcelain`.

A blocking file is an uncommitted file in the base worktree that is also in step 4's list of the files that this pull request changed. Leave every other uncommitted file as it is.

- When there is no blocking file and the base worktree is on the base branch, run `git -C <base-worktree> pull --ff-only`.
- When there is a blocking file, or the base worktree is on another branch, or the pull fails, change nothing in the base worktree and skip the local cleanup. Report which of the three it was.
- Never reset, stash, switch, or rebase the base worktree.

### Remove the worktree and the branches

Remove nothing unless all five proofs hold:

1. GitHub reports this exact pull request merged.
2. The branch to remove is the pull request's head branch, not the base branch or the default branch.
3. The worktree to remove is clean.
4. The local branch is still at the recorded head commit.
5. No other worktree uses that branch.

When a proof is missing, tell the owner which proof failed and exactly what is still there.

Run the cleanup from the base worktree, never from inside the worktree that is being removed:

```text
git -C <base-worktree> worktree remove <head-worktree>
git -C <base-worktree> branch -d <head-branch>
git -C <base-worktree> worktree prune
```

- After a squash merge, `git branch -d` can refuse. Use `git branch -D <head-branch>` only for this pull request's head branch, and only when all five proofs hold.
- When GitHub did not delete the remote branch, run `git -C <base-worktree> push origin --delete <head-branch>`, but only when the branch is in the same repository and belongs to this pull request. Then run `git -C <base-worktree> fetch --prune origin`.
- Never delete a fork branch.

## Step 7: work item note and report

### The note on the work item

When step 1 found a linked work item:

- When `managing-work-items` sent you here, add nothing, because that skill adds the Recent History row.
- When the owner asked you directly, add one Recent History row with `managing-work-items`: "Merged pull request #<number> as <merge commit>."

Never change the State, and never mark anything Done.

### Verify

Verify four things:

- The pull request is merged.
- The base worktree matches its upstream, which is the remote branch that its branch follows.
- The head branch and its worktree are gone.
- Every unrelated worktree remains.

### Report

- When `managing-work-items` sent you here, say the pull request link, the merge commit, and the cleanup result in one line. Then go on with the rest of its Deploying steps.
- When the owner asked you directly, report these six things:
  - the pull request link;
  - the merge commit;
  - whether the base worktree is up to date;
  - any uncommitted files left in the base worktree;
  - the cleanup result;
  - whether the Recent History row was saved. When that save failed, start that line with "Not saved".

  End with the one question for the owner, or with the exact words that continue, for example "Say 'finish WI-007' and I'll close the work item."

## Mistakes to avoid

- Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.
- When the repository has no remote (`git remote` prints nothing), there is no pull request, so this skill does not apply. Never fetch. Tell the owner in one line.

## Work that another skill does

| For | Use |
| --- | --- |
| The merge note on the work item, when the owner asked directly | `managing-work-items` |
| Changing the work item's State, or marking it Done | `managing-work-items` |
| Taking an approved work item through merge and deployment | `managing-work-items` |
| A merge under the standing merge instruction | `managing-work-items` |
| No remote: the local merge | `managing-work-items` |

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/session-summary/SKILL.md

Before:
```text
---
name: session-summary
description: 'Puts the owner''s requests, each result, and what still needs the owner in a table. Use when the owner asks to recap or summarize this session. For a prompt that lets a new session continue the work, use handoff.'
---

# Session summary

Answer exactly two questions for the owner: what the owner asked for in this
session and where each request stands, and what still needs the owner. A
session is one chat with the agent.

1. **Read this session only.** When the owner names a transcript, a log, or
   an exported copy of a session, read that instead. List the owner's real requests, not
   the steps taken to do them (see "One row per request").
2. **Write the table.** Columns `#`, `What you asked`, `Status`, `Result`.
   One row per request, in the order asked. Use only the eight statuses
   below. Write `What you asked` in the owner's own words, cut down to the
   part that says what the owner asked; the outcome goes in `Result`, where you name
   the place that holds the work: a work item id (`WI-014`), a decision or
   source ID (`DEC-004`, `SRC-012`), a pull request number, or a file path.
   Apart from the status words, bold only the one phrase the owner most
   needs to see.
3. **Then the open block.** A horizontal rule (`---`), then the heading
   `### 🔴 Still open, and it needs you`. When nothing needs the owner, keep
   the heading and write "Nothing needed from you."
4. **Name another skill only in this case.** When a request is still open and nothing in
   this session shows it saved as a work item or a project task, end
   the open block with one offer that covers every such request: turn each
   into a work item or a project task, with the skill named in "Work that another
   skill does", below. Make the offer once.
5. **Change nothing.** If the owner says yes to the offer, make each change
   the owner chose with that skill.

## Mistakes to avoid

- No title above the table, no story of the work, no wrap-up, no third part.
  If something went wrong or surprised you, it goes in the `Result` cell of
  the request it came from.
- If part of the session is no longer visible to you, add a final row: its
  `What you asked` cell reads "Earlier requests I can no longer see", and its
  `Status` and `Result` cells stay empty. Never invent a request.

## One row per request

A row is a request, not a step; a long session usually holds one to three.
The owner choosing from options you offered, answering your question, or
adjusting work under way, parts of one job, and work you suggested and then
did all belong to the request that prompted them. If a cell turns into a list
of pieces of work, replace it with one short statement of the result.

Example: the owner says "update the toolkit", then picks four of the six gaps
you found, then answers a question about one of them. That is one row: "Update
the toolkit in this project."

## Status words

Write each with its symbol in front and the word in bold.

- ✅ **Done**: finished, and you checked it.
- ⚠️ **Done, unverified**: finished, but not tested or confirmed; say what was not checked.
- ⏳ **Partly done**: say what is left.
- 🔴 **Blocked**: say what is blocking it.
- 🔴 **Waiting on you**: needs the owner's own action; say the action.
- ⚪ **Not started**: agreed but not begun.
- ⛔ **Dropped**: the owner changed direction or withdrew it.
- 💬 **Answered**: it was a question, not a build.

## Example

````markdown
| # | What you asked | Status | Result |
| --- | --- | --- | --- |
| 1 | Check the rules against the toolkit | ✅ **Done** | The toolkit had already made every one of these merges. This project was behind on all of them. |
| 2 | Consolidate the two rules folders | ✅ **Done** | 34 rule files down to 27, merged into main. One rule was nearly lost in the deletion and had to be put back in its own file. |
| 3 | Port `small-deployable-changes.md` to the toolkit | ⛔ **Dropped** | You said no. |
| 4 | Fix the broken link in the decision document | ✅ **Done** | Fixed twice. The first fix pointed at the wrong file and the check caught it. |
| 5 | Why run the checker before proposing? | 💬 **Answered** | So you never get asked to approve a claim nobody checked. |
| 6 | Merge it | ✅ **Done** | Pull request 29 is in main. Two other pull requests were merged first, so the branch had to be updated with main. |

---

### 🔴 Still open, and it needs you

**Another session has a half-finished merge in the main project folder.**
Two work item files there have conflicting changes. I did not touch it.

1. The main project folder will not show these rule changes until that
   session finishes its merge and gets the latest changes.
2. My worktree (a separate project copy) at
   `.claude/worktrees/rule-consolidation` and its branch are still there.
   Tell me once that merge is done, and I will remove both.
````

## Work that another skill does

| For | Use |
| --- | --- |
| Turning an open request into a work item or a project task | `managing-work-items` |
| A recap asked for together with a handoff: it shows this table first, then the handoff | `handoff` |

```
After:
```text
---
name: session-summary
description: 'Puts the owner''s requests, each result, and what still needs the owner in a table. Use when the owner asks to recap or summarize this session. For a prompt that lets a new session continue the work, use handoff.'
---

# Session summary

Answer exactly two questions for the owner: what the owner asked for in this
session and where each request stands, and what still needs the owner. A
session is one chat with the agent.

1. **Read this session only.** When the owner names a transcript, a log, or
   an exported copy of a session, read that instead. List the owner's real requests, not
   the steps taken to do them (see "One row per request").
2. **Write the table.** Columns `#`, `What you asked`, `Status`, `Result`.
   One row per request, in the order asked. Use only the eight statuses
   below. Write `What you asked` in the owner's own words, cut down to the
   part that says what the owner asked; the outcome goes in `Result`, where you name
   the place that holds the work: a work item id (`WI-014`), a decision or
   source ID (`DEC-004`, `SRC-012`), a pull request number, or a file path.
   Apart from the status words, bold only the one phrase the owner most
   needs to see.
3. **Then the open block.** A horizontal rule (`---`), then the heading
   `### 🔴 Still open, and it needs you`. When nothing needs the owner, keep
   the heading and write "Nothing needed from you."
4. **Name another skill only in this case.** When a request is still open and nothing in
   this session shows it saved as a work item or a project task, end
   the open block with one offer that covers every such request: turn each
   into a work item or a project task, with the skill named in "Work that another
   skill does", below. Make the offer once.
5. **Change nothing.** If the owner says yes to the offer, make each change
   the owner chose with that skill.

## Mistakes to avoid

- No title above the table, no story of the work, no wrap-up, no third part.
  If something went wrong or surprised you, it goes in the `Result` cell of
  the request it came from.
- If part of the session is no longer visible to you, add a final row: its
  `What you asked` cell reads "Earlier requests I can no longer see", and its
  `Status` and `Result` cells stay empty. Never invent a request.

## One row per request

A row is an owner request, not a step taken to carry it out.
The owner choosing from options you offered, answering your question, or
adjusting work under way, parts of one job, and work you suggested and then
did all belong to the request that prompted them. If a cell turns into a list
of pieces of work, replace it with one short statement of the result.

Example: the owner says "update the toolkit", then picks four of the six gaps
you found, then answers a question about one of them. That is one row: "Update
the toolkit in this project."

## Status words

Write each with its symbol in front and the word in bold.

- ✅ **Done**: finished, and you checked it.
- ⚠️ **Done, unverified**: finished, but not tested or confirmed; say what was not checked.
- ⏳ **Partly done**: say what is left.
- 🔴 **Blocked**: say what is blocking it.
- 🔴 **Waiting on you**: needs the owner's own action; say the action.
- ⚪ **Not started**: agreed but not begun.
- ⛔ **Dropped**: the owner changed direction or withdrew it.
- 💬 **Answered**: it was a question, not a build.

## Example

````markdown
| # | What you asked | Status | Result |
| --- | --- | --- | --- |
| 1 | Check the rules against the toolkit | ✅ **Done** | The toolkit had already made every one of these merges. This project was behind on all of them. |
| 2 | Consolidate the two rules folders | ✅ **Done** | 34 rule files down to 27, merged into main. One rule was nearly lost in the deletion and had to be put back in its own file. |
| 3 | Port `small-deployable-changes.md` to the toolkit | ⛔ **Dropped** | You said no. |
| 4 | Fix the broken link in the decision document | ✅ **Done** | Fixed twice. The first fix pointed at the wrong file and the check caught it. |
| 5 | Why run the checker before proposing? | 💬 **Answered** | So you never get asked to approve a claim nobody checked. |
| 6 | Merge it | ✅ **Done** | Pull request 29 is in main. Two other pull requests were merged first, so the branch had to be updated with main. |

---

### 🔴 Still open, and it needs you

**Another session has a half-finished merge in the main project folder.**
Two work item files there have conflicting changes. I did not touch it.

1. The main project folder will not show these rule changes until that
   session finishes its merge and gets the latest changes.
2. My worktree (a separate project copy) at
   `.claude/worktrees/rule-consolidation` and its branch are still there.
   Tell me once that merge is done, and I will remove both.
````

## Work that another skill does

| For | Use |
| --- | --- |
| Turning an open request into a work item or a project task | `managing-work-items` |
| A recap asked for together with a handoff: it shows this table first, then the handoff | `handoff` |

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/SKILL.md

Before:
```text
---
name: managing-work-items
description: 'Finds and manages work items from idea to Done, keeping requirements, State, progress, and owner approvals current. Use when the owner asks about, starts, continues, changes, tests, ships, closes, or cancels a work item, or changes project phases or project tasks. For shared decisions, sources, and system rules, use filing-project-records.'
---

# Managing work items

Use this skill when a turn concerns a work item, a project phase, or a project task. The goal is to keep the work record accurate and follow the required steps and approvals from the first idea through Done or Cancelled.

Start with [the lifecycle rules](references/lifecycle-rules.md). They define the work item's State and Status, the four levels of work, the approval points, and the rules that apply in every State. Then open [the installed work tracker instructions](references/work-tracker.md) for every read and save. This project has only the local, Notion, or GitHub version that setup selected. Read the relevant procedure below for the work item's current State or the change requested.

If the owner asks only a question about a work item, read the current record and answer it. Do not advance the work item merely because you read it. If the item is unclear, use the root `AGENTS.md` identification order and ask when more than one item remains plausible.

Use `filing-project-records` for a source, a decision or open question that several work items need, or a rule in `system/`. Use `managing-project-memory` for the project's Current State. The lifecycle rules say when each of these jobs applies.

## Work-item procedures

| File | Open it when |
| --- | --- |
| [references/lifecycle-rules.md](references/lifecycle-rules.md) | Every work-item turn. It gives the State map, levels, approval points, common safeguards, and the full reference list. |
| [references/work-tracker.md](references/work-tracker.md) | Every read or save of a work item, project phase, or project task. It gives the selected store's steps and links to its detailed instructions. |
| [references/refining-requirements.md](references/refining-requirements.md) | The item is in Refining Requirements, or a requirement changes in any State. |
| [references/designing.md](references/designing.md) | The item is in Designing. |
| [references/building.md](references/building.md) | The item is in Building, or the owner wants a team of helpers. |
| [references/testing-loop.md](references/testing-loop.md) | The item is in the Testing Loop. |
| [references/closing.md](references/closing.md) | The item is in Reflecting, is being marked Done or Cancelled, or was closed by hand. |
| [references/deploying.md](references/deploying.md) | The item is in Deploying. |
| [references/salesforce-deploying.md](references/salesforce-deploying.md) | You deploy this item in a Salesforce project. |

## Templates and helper briefs

| File | Open it when |
| --- | --- |
| [assets/work-item-template.md](assets/work-item-template.md) | You create an item or need its field and section forms. |
| [assets/design-template.md](assets/design-template.md) | You start a design. |
| [references/requirements-analyst-brief.md](references/requirements-analyst-brief.md) | You start the helper that checks requirements. |
| [references/researcher-brief.md](references/researcher-brief.md) | You start a research helper. |
| [references/design-architect-brief.md](references/design-architect-brief.md) | You start a helper to write one design option. |
| [references/design-critic-brief.md](references/design-critic-brief.md) | You start a helper to check a design option. |
| [references/builder-brief.md](references/builder-brief.md) | You start a builder. |
| [references/acceptance-checker-brief.md](references/acceptance-checker-brief.md) | You start the separate checker in the Testing Loop. |

The installed [work tracker instructions](references/work-tracker.md) list their own supporting reference files. Open only the files needed for the current action.

```
After:
```text
---
name: managing-work-items
description: 'Finds and manages work items from idea to Done, keeping requirements, State, progress, and owner approvals current. Use when the owner asks about, starts, continues, changes, tests, ships, closes, or cancels a work item, or changes project phases or project tasks. For shared decisions, sources, and system rules, use filing-project-records.'
---

# Managing work items

Use this skill when a turn concerns a work item, a project phase, or a project task. The goal is to keep the work record accurate and follow the required steps and approvals from the first idea through Done or Cancelled.

Start with [the lifecycle rules](references/lifecycle-rules.md). They define the work item's State and Status, the four levels of work, the approval points, and the rules that apply in every State. Then open [the installed work tracker instructions](references/work-tracker.md) for every read and save. This project has only the local, Notion, or GitHub version that setup selected. Read the relevant procedure below for the work item's current State or the change requested.

If the owner asks only a question about a work item, read the current record and answer it. Do not advance the work item merely because you read it. If the item is unclear, use the root `AGENTS.md` identification order and ask when more than one item remains plausible.

Use `filing-project-records` for a source, a decision or open question that several work items need, or a rule in `system/`. For memory, follow the choice recorded in `PROJECT.md`: use `managing-project-memory` for local or Notion memory, or `.claude/rules/hindsight-memory.md` for Hindsight. Hindsight projects keep current work in the tracker and have no Current State page. The lifecycle rules say when each of these jobs applies.

## Work-item procedures

| File | Open it when |
| --- | --- |
| [references/lifecycle-rules.md](references/lifecycle-rules.md) | Every work-item turn. It gives the State map, levels, approval points, common safeguards, and the full reference list. |
| [references/work-tracker.md](references/work-tracker.md) | Every read or save of a work item, project phase, or project task. It gives the selected store's steps and links to its detailed instructions. |
| [references/refining-requirements.md](references/refining-requirements.md) | The item is in Refining Requirements, or a requirement changes in any State. |
| [references/designing.md](references/designing.md) | The item is in Designing. |
| [references/building.md](references/building.md) | The item is in Building, or the owner wants a team of helpers. |
| [references/team-arrangement.md](references/team-arrangement.md) | Building involves choosing or coordinating helpers or other chats. |
| [references/build-repository.md](references/build-repository.md) | Building needs a branch, worktree, Git writes, or permission handling. |
| [references/testing-loop.md](references/testing-loop.md) | The item is in the Testing Loop. |
| [references/closing.md](references/closing.md) | The item is in Reflecting, is being marked Done or Cancelled, or was closed by hand. |
| [references/deploying.md](references/deploying.md) | The item is in Deploying. |
| [references/salesforce-deploying.md](references/salesforce-deploying.md) | You deploy this item in a Salesforce project. |

## Templates and helper briefs

| File | Open it when |
| --- | --- |
| [assets/work-item-template.md](assets/work-item-template.md) | You create an item or need its field and section forms. |
| [assets/design-template.md](assets/design-template.md) | You start a design. |
| [references/requirements-analyst-brief.md](references/requirements-analyst-brief.md) | You start the helper that checks requirements. |
| [references/researcher-brief.md](references/researcher-brief.md) | You start a research helper. |
| [references/design-architect-brief.md](references/design-architect-brief.md) | You start a helper to write one design option. |
| [references/design-critic-brief.md](references/design-critic-brief.md) | You start a helper to check a design option. |
| [references/builder-brief.md](references/builder-brief.md) | You start a builder. |
| [references/acceptance-checker-brief.md](references/acceptance-checker-brief.md) | You start the separate checker in the Testing Loop. |

The installed [work tracker instructions](references/work-tracker.md) list their own supporting reference files. Open only the files needed for the current action.

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/SKILL.md

Before:
```text
---
name: handoff
description: 'Updates this session''s work items and the project''s Current State, files decisions or sources left unfiled, and writes a checked, self-contained prompt for the next session or checks one the owner provides. Use when the owner ends a session, clears context, asks for a handoff prompt, or asks to check one. For a recap without a handoff, use session-summary.'
---

# Handoff

Use this skill when a session ends, so that a new session can continue the work. A session is one chat with the agent. When the owner clears context, the agent no longer sees this session. The new session sees only the project's files and records and the handoff prompt. So this skill first saves what this session knows, and then gives the owner a prompt that a separate agent has checked.

The job is done when the project is ready for a new session and the owner has the checked prompt.

Two rules apply to every step:

- Never ask the owner to wait before the owner clears context.
- Never hold back the prompt because a save or the check failed.

A recap alone, with no handoff, is the job of `session-summary`.

## The first line of every prompt

Every handoff prompt starts with this line, word for word:

```text
This handoff prompt is AI-generated and may contain hallucinations, skewed context, etc. Please evaluate accordingly.
```

This skill calls it the fixed first line.

## Steps

Do the steps in this order. Steps 1 to 4 save what this session knows. Steps 5 to 7 write the prompt, check it, and show it. The saves come before the prompt, because once the prompt is on screen the owner treats the session as over, and the saves get skipped.

1. **Find this session's work items.** Choose only the work items that belong to this session. A work item belongs to this session in three cases:
   - The owner and the agent worked on the work item in this session. A work item that was only mentioned or listed does not count.
   - The branch of this session's worktree names the work item. For example, the branch `claude/wi-007-<slug>` belongs to `WI-007`. A worktree is a separate folder with its own branch.
   - This session changed the work item.

   Never choose a work item only because it is open, because another session may be working on it.
   - When no work item belongs to this session, ask the owner which work item this session worked on, if any.
   - When the owner answers "None", update only the project tasks in step 2.
2. **Update each of those work items** with `managing-work-items`. For each work item:
   - Read the work item first.
   - Make every part of the work item true, as `managing-work-items` says in `references/lifecycle-rules.md`, "Keep the whole work item true".
   - Add a Questions and Answers row for each answer or decision from this session that is not there yet.
   - Rewrite the work item's Current state in place, so that a new session can continue from the Current state alone. The work item's Current state is the five lines at the top of the work item.
   - Change the State and `waiting_on` only when they changed in this session.
   - Add one Recent History row: "Handoff: <where work stopped>".
   - Read the work item back.

   Then update each project task that this session worked on. A project task is a task that belongs to no work item, with an ID such as `PT-01`. Use the test of step 1 to decide whether this session worked on a project task. For each project task:
   - Read the project task with `managing-work-items`.
   - Make its status and who does it true. `managing-work-items/references/lifecycle-rules.md`, "Levels", says what a project task is and when to tick it.
   - Read the project task back.
3. **File what this session left unfiled.** Step 2 saved each decision that only one work item needs. Go through the five kinds below for the rest.
   - **A decision or a question that more than one work item needs.** When one came from this session and `DECISIONS.md` does not hold it, record it with `filing-project-records`, step "record a decision". The root `AGENTS.md`, section "Where information goes", gives the test for whether more than one work item needs it. When the owner has not confirmed it, record it as Open. Do not wait for the owner's answer before you write the prompt.
   - **A source with no SRC ID.** A source is anything the project was given and keeps, such as a transcript or an email. When the owner gave this session a source that has no SRC ID, file it with `filing-project-records`, step "file a source".
   - **An instruction for how the agent works that is not written down.** Give it to `managing-project-memory`.
   - **What this session learned or did that no record holds.** This kind covers a fact about a person, the client, or the project; a claim nobody checked; a lesson with no work item; a meeting or other event; and a run of a recurring job. Give each one to `managing-project-memory`.
   - **An Open entry in `DECISIONS.md`.** Read the Open entries that this session raised or that name this session's work items. Put each one under "Open questions" in the prompt, with its DEC ID.

   When there is nothing to file, say so in one line.
4. **Update the project's Current State.** The project's Current State is the project's one short page of what is true now. Read and write it with `managing-project-memory`.
   - Write the part "Next session starts with". It has one line for each piece of work that this session worked on.
     - For a work item, the line holds the work item's ID and the words "read its Current state".
     - For a piece of work that is not a work item, the line says what the work is and its next step.
   - Check the line under "Now" for each of this session's work items. When that line is missing or no longer true, add or correct it as `managing-work-items` says.
   - Check every other line, and remove each line that is no longer true, for example a piece of work that ended, a date that passed, or a thing owed that was delivered. `managing-project-memory/references/current-state.md`, "Removing what is no longer true", says how.
   - Set the "Last updated" line to the date, `handoff`, and `agent`.
   - When the project's Current State is missing, do not create it. Tell the owner that it is missing, and suggest the setup check (`project-setup`, "check the setup"). Put in the prompt the entry that this step would have written.
5. **Draft the prompt. Do not show it yet.**
   - Start from the template `assets/handoff-prompt-template.md`. It holds the fixed first line and the headings.
   - Write the prompt as instructions to an agent that knows nothing about this session.
   - Keep a note of where every claim comes from. A claim comes from one of four places: a file, the repository, the owner, or it was worked out. For a claim from the owner, keep the owner's words when you have them. For a claim from a file or the repository, keep where the claim is found. These notes fill the "Sources for claims" line of the list of inputs in step 6.
   - Write "not confirmed" beside any claim that no file, work item, or repository fact confirms.
6. **Check the draft** with the handoff verifier. The handoff verifier is a helper: a separate agent that sees only the instructions you give it. It compares the draft with the repository and the work items, and it changes nothing. `references/handoff-verifier.md` says how to start it, and holds its brief and the list of inputs that you fill in. A brief is a helper's instructions.

   The verifier's report gives a verdict for the goal and for each claim. Act on every verdict:

   | Verdict | What you do |
   | --- | --- |
   | Wrong | Correct the prompt to what the repository says, or to what is saved where the work items are kept. |
   | Unchecked | Keep the claim, and write "not confirmed" beside it. |
   | Missing (given only for the goal) | Add the goal. Never show a prompt that has no goal. |
   | Skipped | Name the check in the check results that step 7 shows. |

   Three cases change this step:
   - When the verifier fails to start or returns no report, say so in one line, and write the prompt anyway. Say inside the prompt that it was not checked.
   - When no tool can start a helper, check the draft yourself with the brief, and say inside the prompt that no independent check ran.
   - Start a second verifier only when you rewrote a whole section. Give it the Goal section and each rewritten section under "Draft prompt". Never start a third verifier.
7. **Show the result**, with its parts in this order:
   1. The `session-summary` table. Show it only when the owner also asked for a recap.
   2. The saves: first anything that was not saved, then what was saved and where.
   3. The check results. The first line is "Checked the handoff prompt: <n> fixed, <n> not confirmed." Then comes one line for each claim that you fixed, one line for each claim labeled "not confirmed", and one line for each check that was skipped.
   4. The prompt in one fenced block, with the fixed first line on top.
   5. The last line: "Clear the context, then paste this prompt."

   When a save failed, do three things:
   - Start its line with "Not saved" when the write failed, or with "Saved but not verified" when what you read back differs from what you wrote.
   - Name the write.
   - Put the content of the write in the prompt.

## Checking a prompt the owner gives you

When the owner gives you a handoff prompt that was written elsewhere and wants it checked, run only step 6, and save nothing.

- Check the prompt exactly as the owner gave it.
- In the list of inputs for the verifier, write "Sources for claims: none given".
- Correct what has the verdict Wrong, and write "not confirmed" beside what has the verdict Unchecked.
- When the verdict on the goal is Missing, write the goal into the prompt from this session, or from the work item that the prompt names. When neither shows the goal, ask the owner in one question.
- When the fixed first line is missing, put it on top.
- Show the check results, then the corrected prompt.

## Work that another skill does

| For | Use |
| --- | --- |
| Reading and updating this session's work items and project tasks | `managing-work-items` |
| What a project task is, when to tick it, and a work item's line under "Now" in the project's Current State | `managing-work-items` |
| A decision or a question that more than one work item needs, and a source | `filing-project-records` |
| An instruction for how the agent works; what no record holds yet; which lines of the project's Current State are no longer true | `managing-project-memory` |
| Every read and write of the project's Current State | `managing-project-memory` |
| The recap table, when the owner also asked for one | `session-summary` |
| The project's Current State is missing | `project-setup` ("check the setup") |

## References

| File | Open it when |
| --- | --- |
| [assets/handoff-prompt-template.md](assets/handoff-prompt-template.md) | Step 5: you need the fixed first line and the headings of the prompt, to copy and fill in. |
| [references/handoff-verifier.md](references/handoff-verifier.md) | Step 6, and when you check a prompt the owner gives you: you need the way to start the verifier, its brief, and the list of inputs. |
| [examples/handoff-example.md](examples/handoff-example.md) | Steps 6 and 7: you need to see a filled list of inputs, the lines for the saves, the check results, and a filled prompt. |

```
After:
```text
---
name: handoff
description: 'Updates this session''s work items and the project''s Current State, files decisions or sources left unfiled, and writes a checked, self-contained prompt for the next session or checks one the owner provides. Use when the owner ends a session, clears context, asks for a handoff prompt, or asks to check one. For a recap without a handoff, use session-summary.'
---

# Handoff

Use this skill when a session ends, so that a new session can continue the work. A session is one chat with the agent. When the owner clears context, the agent no longer sees this session. The new session sees only the project's files and records and the handoff prompt. So this skill first saves what this session knows, and then gives the owner a prompt that a separate agent has checked.

The job is done when the project is ready for a new session and the owner has the checked prompt.

Two rules apply to every step:

- Never ask the owner to wait before the owner clears context.
- Never hold back the prompt because a save or the check failed.

A recap alone, with no handoff, is the job of `session-summary`.


Read the memory choice in `PROJECT.md`. For local or Notion memory, use `managing-project-memory` and the installed Current State page. For Hindsight, follow `.claude/rules/hindsight-memory.md` wherever these steps call for memory recall, review, saves, or corrections. Keep current work, blockers, and next actions in the selected tracker and project records; do not create a Current State page or treat its absence as a setup failure.

## The first line of every prompt

Every handoff prompt starts with this line, word for word:

```text
This handoff prompt is AI-generated and may contain hallucinations, skewed context, etc. Please evaluate accordingly.
```

This skill calls it the fixed first line.

## Steps

Do the steps in this order. Steps 1 to 4 save what this session knows. Steps 5 to 7 write the prompt, check it, and show it. The saves come before the prompt, because once the prompt is on screen the owner treats the session as over, and the saves get skipped.

1. **Find this session's work items.** Choose only the work items that belong to this session. A work item belongs to this session in three cases:
   - The owner and the agent worked on the work item in this session. A work item that was only mentioned or listed does not count.
   - The branch of this session's worktree names the work item. For example, the branch `claude/wi-007-<slug>` belongs to `WI-007`. A worktree is a separate folder with its own branch.
   - This session changed the work item.

   Never choose a work item only because it is open, because another session may be working on it.
   - When no work item belongs to this session, ask the owner which work item this session worked on, if any.
   - When the owner answers "None", update only the project tasks in step 2.
2. **Update each of those work items** with `managing-work-items`. For each work item:
   - Read the work item first.
   - Make every part of the work item true, as `managing-work-items` says in `references/lifecycle-rules.md`, "Keep the whole work item true".
   - Add a Questions and Answers row for each answer or decision from this session that is not there yet.
   - Rewrite the work item's Current state in place, so that a new session can continue from the Current state alone. The work item's Current state is the five lines at the top of the work item.
   - Change the State and `waiting_on` only when they changed in this session.
   - Add one Recent History row: "Handoff: <where work stopped>".
   - Read the work item back.

   Then update each project task that this session worked on. A project task is a task that belongs to no work item, with an ID such as `PT-01`. Use the test of step 1 to decide whether this session worked on a project task. For each project task:
   - Read the project task with `managing-work-items`.
   - Make its status and who does it true. `managing-work-items/references/lifecycle-rules.md`, "Levels", says what a project task is and when to tick it.
   - Read the project task back.
3. **File what this session left unfiled.** Step 2 saved each decision that only one work item needs. Go through the five kinds below for the rest.
   - **A decision or a question that more than one work item needs.** When one came from this session and `DECISIONS.md` does not hold it, record it with `filing-project-records`, step "record a decision". The root `AGENTS.md`, section "Where information goes", gives the test for whether more than one work item needs it. When the owner has not confirmed it, record it as Open. Do not wait for the owner's answer before you write the prompt.
   - **A source with no SRC ID.** A source is anything the project was given and keeps, such as a transcript or an email. When the owner gave this session a source that has no SRC ID, file it with `filing-project-records`, step "file a source".
   - **An instruction for how the agent works that is not written down.** Give it to `managing-project-memory`.
   - **What this session learned or did that no record holds.** This kind covers a fact about a person, the client, or the project; a claim nobody checked; a lesson with no work item; a meeting or other event; and a run of a recurring job. Give each one to `managing-project-memory`.
   - **An Open entry in `DECISIONS.md`.** Read the Open entries that this session raised or that name this session's work items. Put each one under "Open questions" in the prompt, with its DEC ID.

   When there is nothing to file, say so in one line.
4. **Save the context for the next session.** In a Hindsight project, keep this session's next actions and outstanding blockers in the selected tracker and project records, review lasting knowledge under the Hindsight rule, and continue to step 5. With local or Notion memory, update the project's Current State. The project's Current State is the project's one short page of what is true now. Read and write it with `managing-project-memory`.
   - Write the part "Next session starts with". It has one line for each piece of work that this session worked on.
     - For a work item, the line holds the work item's ID and the words "read its Current state".
     - For a piece of work that is not a work item, the line says what the work is and its next step.
   - Check the line under "Now" for each of this session's work items. When that line is missing or no longer true, add or correct it as `managing-work-items` says.
   - Check every other line, and remove each line that is no longer true, for example a piece of work that ended, a date that passed, or a thing owed that was delivered. `managing-project-memory/references/current-state.md`, "Removing what is no longer true", says how.
   - Set the "Last updated" line to the date, `handoff`, and `agent`.
   - When the project's Current State is missing, do not create it. Tell the owner that it is missing, and suggest the setup check (`project-setup`, "check the setup"). Put in the prompt the entry that this step would have written.
5. **Draft the prompt. Do not show it yet.**
   - Start from the template `assets/handoff-prompt-template.md`. It holds the fixed first line and the headings.
   - Write the prompt as instructions to an agent that knows nothing about this session.
   - Keep a note of where every claim comes from. A claim comes from one of four places: a file, the repository, the owner, or it was worked out. For a claim from the owner, keep the owner's words when you have them. For a claim from a file or the repository, keep where the claim is found. These notes fill the "Sources for claims" line of the list of inputs in step 6.
   - Write "not confirmed" beside any claim that no file, work item, or repository fact confirms.
6. **Check the draft** with the handoff verifier. The handoff verifier is a helper: a separate agent that sees only the instructions you give it. It compares the draft with the repository and the work items, and it changes nothing. `references/handoff-verifier.md` says how to start it, and holds its brief and the list of inputs that you fill in. A brief is a helper's instructions.

   The verifier's report gives a verdict for the goal and for each claim. Act on every verdict:

   | Verdict | What you do |
   | --- | --- |
   | Wrong | Correct the prompt to what the repository says, or to what is saved where the work items are kept. |
   | Unchecked | Keep the claim, and write "not confirmed" beside it. |
   | Missing (given only for the goal) | Add the goal. Never show a prompt that has no goal. |
   | Skipped | Name the check in the check results that step 7 shows. |

   Three cases change this step:
   - When the verifier fails to start or returns no report, say so in one line, and write the prompt anyway. Say inside the prompt that it was not checked.
   - When no tool can start a helper, check the draft yourself with the brief, and say inside the prompt that no independent check ran.
   - Start a second verifier only when you rewrote a whole section. Give it the Goal section and each rewritten section under "Draft prompt". Never start a third verifier.
7. **Show the result**, with its parts in this order:
   1. The `session-summary` table. Show it only when the owner also asked for a recap.
   2. The saves: first anything that was not saved, then what was saved and where.
   3. The check results. The first line is "Checked the handoff prompt: <n> fixed, <n> not confirmed." Then comes one line for each claim that you fixed, one line for each claim labeled "not confirmed", and one line for each check that was skipped.
   4. The prompt in one fenced block, with the fixed first line on top.
   5. The last line: "Clear the context, then paste this prompt."

   When a save failed, do three things:
   - Start its line with "Not saved" when the write failed, or with "Saved but not verified" when what you read back differs from what you wrote.
   - Name the write.
   - Put the content of the write in the prompt.

## Checking a prompt the owner gives you

When the owner gives you a handoff prompt that was written elsewhere and wants it checked, run only step 6, and save nothing.

- Check the prompt exactly as the owner gave it.
- In the list of inputs for the verifier, write "Sources for claims: none given".
- Correct what has the verdict Wrong, and write "not confirmed" beside what has the verdict Unchecked.
- When the verdict on the goal is Missing, write the goal into the prompt from this session, or from the work item that the prompt names. When neither shows the goal, ask the owner in one question.
- When the fixed first line is missing, put it on top.
- Show the check results, then the corrected prompt.

## Work that another skill does

| For | Use |
| --- | --- |
| Reading and updating this session's work items and project tasks | `managing-work-items` |
| What a project task is, when to tick it, and a work item's line under "Now" in the project's Current State | `managing-work-items` |
| A decision or a question that more than one work item needs, and a source | `filing-project-records` |
| An instruction for how the agent works; what no record holds yet; which lines of the project's Current State are no longer true | `managing-project-memory` |
| Every read and write of the project's Current State | `managing-project-memory` |
| The recap table, when the owner also asked for one | `session-summary` |
| The project's Current State is missing | `project-setup` ("check the setup") |

## References

| File | Open it when |
| --- | --- |
| [assets/handoff-prompt-template.md](assets/handoff-prompt-template.md) | Step 5: you need the fixed first line and the headings of the prompt, to copy and fill in. |
| [references/handoff-verifier.md](references/handoff-verifier.md) | Step 6, and when you check a prompt the owner gives you: you need the way to start the verifier, its brief, and the list of inputs. |
| [examples/handoff-example.md](examples/handoff-example.md) | Steps 6 and 7: you need to see a filled list of inputs, the lines for the saves, the check results, and a filled prompt. |

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/publish-docs/SKILL.md

Before:
```text
---
name: publish-docs
description: 'Commits an approved edit to project documents directly to the default branch. Use when another skill asks for a document save or the owner asks to "publish the docs". For deciding what belongs in DECISIONS.md, sources/, or system/, use filing-project-records. For code, rules, skills, or work items, use managing-work-items.'
---

# Commit project documents to the default branch

Use this skill to commit a change to Git-tracked project documents directly to the default branch, with no pull request. "The paths of the project documents" below lists which files are project documents. The default branch is the repository's main branch, which is often `main`.

In this skill, a save is one commit of an agreed document edit. The commit is made in a temporary Git worktree of its own, which this skill calls the save worktree. A worktree is a separate folder with its own checked-out commit.

Two things must be true when the save is done: only the agreed document edit reaches the default branch, and no other session's work changes. A save is finished only when step 8 finds its commit on the default branch.

This skill decides nothing about what a document says. The skill that asked for the save decides what the document says. Committing a document does not approve its requirements or its build.

Run each Git command on its own, with `git -C <folder>`, which names the folder that the command works in. The command then never depends on the current folder.

## The paths of the project documents

A project document is a file under one of these paths.

- `system/**`
- `PROJECT*.md`
- `DECISIONS.md`
- `sources/**`
- `reference/**`
- `delivery/**`
- `tools/**/*.md`
- `**/README.md`

## Names used in the commands

- `<main>` is the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints.
- `<session folder>` is the folder this session works in.
- `<default>` is the name of the default branch. Step 2 finds it.
- `<save>` is the save worktree that step 3 makes.
- `<working checkout>` is the checkout where this session edited the document, normally `<session folder>`.
- `<short-slug>` is a short name for the save, such as `roadmap-phase-2`.
- `<file>` is one file of the save.
- `<commit id>` is the ID of the save's commit: the commit that step 6 makes, or the commit that a rebase in `references/recovery.md` makes in its place.

## Steps

1. **Check the files.** Name every file in the save. Each file must be a project document, which means that all four of these are true:
   - The file is under a path in "The paths of the project documents" above.
   - The file's type is `.md`, `.txt`, `.csv`, `.xml`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, or `.pdf`. A source under `sources/` may be any type, because the owner approved the source when `filing-project-records` filed it.
   - "Refused files" below does not refuse the file.
   - Git does not ignore the file. Run `git -C <main> check-ignore <file>`. When the command prints the path, Git ignores the file.

   Save only an edit that the owner asked for or said yes to, an edit that the root `AGENTS.md` tells you to make without asking, or an edit that another skill tells you to save with this skill, for example `filing-project-records`. That request, yes, or instruction also covers the push in step 7.
2. **Look first.** Run these three commands, each on its own:

   ```text
   git -C <session folder> worktree list
   git -C <session folder> status
   git -C <session folder> remote
   ```

   What `remote` prints decides how the save goes:
   - When the repository has remotes, but none is named `origin`, stop and ask the owner which remote holds the default branch. `references/recovery.md`, section "The repository has remotes, but none named `origin`", says how to name the remotes and when to rename one.
   - When the repository has no remote, the save is committed on the local default branch. Never fetch, and never push to a remote. The local `git push . HEAD:<default>` in step 7 is allowed, because it moves only a local branch.

   Then find the default branch:
   - With a remote, `git -C <main> symbolic-ref --short refs/remotes/origin/HEAD` prints `origin/<default>`.
     - When that command fails, run `git -C <main> fetch origin` and try the command again.
     - When it still fails, read the "HEAD branch" line of `git -C <main> remote show origin`.
     - When that line says "(unknown)", the remote has no branches. Ask the owner whether to push the default branch first.
   - With no remote, the default branch is the branch that the main checkout has: `git -C <main> branch --show-current`.
3. **Start the save worktree** inside the main checkout. Name it `.claude/worktrees/docsave-<short-slug>`, for example `docsave-roadmap-phase-2`.
   - First check that Git ignores that folder: `git -C <main> check-ignore .claude/worktrees/docsave-<short-slug>` must print the path.
   - When the command prints nothing, stop. Tell the owner that the project's `.gitignore` lacks the `.claude/worktrees/` line that every project gets. Adding the line is a settings change, not a document save.
   - Then run these two commands:

     ```text
     git -C <main> fetch origin <default>
     git -C <main> worktree add --detach .claude/worktrees/docsave-roadmap-phase-2 origin/<default>
     ```

   - With no remote, skip the fetch, and use `<default>` in place of `origin/<default>`.
4. **Make the edit in the save worktree, and stage each file by name:** `git -C <save> add -- <file>`. When this session already made the edit in its working checkout, carry the edit across as "Carrying an edit across" below says.
5. **Check the staged save** in the save worktree:

   ```text
   git -C <save> status --porcelain
   git -C <save> diff --cached --name-status
   git -C <save> diff --cached
   git -C <save> -c core.whitespace=-blank-at-eol diff --cached --check
   ```

   - `status --porcelain` must list only this save's files, each one staged. Before you go on, fix an unstaged change, an untracked file (`??`), or any other path.
   - Read the full staged diff.
   - `diff --cached --check` must print nothing. The `-c` setting allows two trailing spaces, which make a line break in Markdown.
6. **Commit.** Run `git -C <save> commit -m '<plain message>'`. Write the message in plain words, with no AI credit line.
7. **Put the commit on the default branch.**
   - With a remote, run `git -C <save> push origin HEAD:<default>`. Never force the push. When the push is refused because the default branch has commits that the save does not have, open `references/recovery.md`, section "The default branch advanced", which says how to bring the save up to date and try again.
   - With no remote, do these in order:
     1. Run `git -C <main> status --porcelain`. When it lists a file of this save that is not this session's own copy, that file is another session's work. Stop, name the file, and ask the owner.
     2. Move the local default branch forward in the checkout that has the default branch, which is normally the main checkout: `git -C <main> merge --ff-only <commit id>`. This command is a fast-forward: it moves the branch forward to the commit and makes no merge commit.
     3. When no checkout has the default branch, run `git -C <save> push . HEAD:<default>` in place of the fast-forward.
     4. When Git refuses the command, open `references/recovery.md`. It says what to do when the default branch has commits that the save does not have, and when a changed file blocks the fast-forward.
8. **Verify, update the main checkout, clean up, and report.**
   - Verify that the commit is on the default branch.
     - With a remote, run `git -C <save> fetch origin <default>`. Then `git -C <save> branch -r --contains <commit id>` must list `origin/<default>`.
     - With no remote, `git -C <main> branch --contains <commit id>` must list the default branch.
   - Find out whether the main checkout holds the save. With a remote, also bring the main checkout up to date. "The main checkout" below gives the steps.
   - When no other save of the same files is pending in this session, remove the save worktree: `git -C <main> worktree remove .claude/worktrees/docsave-<short-slug>`.
   - Note three things for the step that started this save:
     - the commit id;
     - where the commit is, in one of these two sentences: "Saved to main and pushed to the remote." or "No remote: saved to main on this computer only.";
     - whether the main checkout holds the save.
   - Put these three things in the reply to the owner only when the owner asked to publish or commit the documents, or when the main checkout does not hold the save. In every other case the save is finished and the main checkout holds it, so say nothing about the commit or the remote in the reply.
   - When another skill started this save, go back to that skill and continue from the step that started this save. Otherwise, end with the one question for the owner, or with the exact words that continue.

## Refused files

This skill never commits these files:

- Every file under `delivery/migrations/`, except `.md` notes and `.gitignore`. Load files and backups in that folder can hold production records and personal data.
- Code (`.js`, `.mjs`, `.py`, `.sh`, `.cls`, `.trigger`), settings, `.json`, and spreadsheets such as `.xlsx`. The one exception is a source under `sources/`.
- Hidden files and folders, such as `.env` or `.github/`. The one exception is a `.gitignore` under `delivery/`.
- Instruction files (`AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, `SKILL.md`), anywhere and in any letter case.
- Any path that Git ignores.

A refused file stays refused even under a path that the rule accepts.

Rules, skills, prompts, hooks, settings, and code use a pull request. A document edit that would be wrong on the default branch without the code change it describes goes in the pull request of that code change.

## Carrying an edit across

Use this section when this session already edited a document in its working checkout. The edit must get into the save worktree without removing anything that the default branch has.

Check each edited file before you copy it:

```text
git -C <working checkout> diff --quiet HEAD <save commit> -- <file>
```

`<save commit>` is what `git -C <save> rev-parse HEAD` prints before step 6.

- Exit code 0 means that the working checkout started from the version that the save worktree has. Copy the edited file to the same path in the save worktree.
- Exit code 1 means that the two versions differ. Never copy the file, because the copy would remove what the default branch has and the working checkout lacks. Make the same change by hand in the save worktree's file. `git -C <working checkout> diff HEAD -- <file>` shows the change.

Then stage each file, and run the checks of step 5.

Last, remove this session's own copy from the working checkout. Remove only files that this session edited or created: run `git -C <working checkout> restore -- <file>` for a changed file, and `rm` for a new file. Never discard another session's changes.

When to remove the copy depends on the remote:

- With a remote, remove the copy after step 8 verifies the save, and before the main checkout is brought up to date. The saved version comes back with that update. When the working checkout is another worktree, the saved version comes back with the next `pull-latest`.
- With no remote, remove the copy before step 7, once the file is staged. Git refuses the fast-forward while the main checkout holds a changed copy of a saved file, or an untracked copy of a new file.

## The main checkout

The third thing that step 8 notes is whether the main checkout holds the save. The reason is that local work items are kept in the main checkout, and a work item must not name a record that the main checkout does not hold.

### With no remote

- When step 7 ran the fast-forward in the main checkout, the main checkout holds the save.
- When step 7 ran the fast-forward in another checkout, or ran `git push . HEAD:<default>`, the main checkout is on another branch and does not hold the save. Change nothing in the main checkout.

### With a remote

A pushed save is not in the main checkout yet. After step 8 verifies the save, move the main checkout's default branch forward. Use a fast-forward only: never merge, rebase, reset, or switch branches in the main checkout.

1. Run `git -C <main> branch --show-current`. It must print `<default>`. When it prints another branch, change nothing.
2. Do the merge-safety check. `git -C <main> diff --name-only HEAD origin/<default>` lists the files that the update changes, and `git -C <main> status --porcelain` lists the files with uncommitted changes. A file in both lists blocks the update.
   - When the file is this session's own copy of a saved file, remove the copy as "Carrying an edit across" says.
   - When the file is any other file, change nothing.
3. When no file blocks the update, run `git -C <main> merge --ff-only origin/<default>`. When Git refuses, change nothing.

### When the main checkout does not hold the save

The save is still finished. Say so in the reply in one line: "The main checkout does not hold this save yet", and then what blocks the update. What blocks the update is the branch that the main checkout is on, the files that block the update, or Git's message. Tell the skill that started the save.

## Mistakes to avoid

- Never make, stage, or commit this save's edit in the main checkout.
- Never start a save from inside another save worktree.
- Other `docsave-` worktrees in `git worktree list` belong to other sessions. Do not change or remove them.
- In Codex, the sandbox keeps `.git/` read-only and blocks the network. Run each Git write and each network call in this skill alone, with escalated permissions (`sandbox_permissions` set to `require_escalated`, with a one-line reason). The commands in `references/recovery.md` are included. When Codex refuses without asking, show the owner the exact command and ask the owner to run it.

## Work that another skill does

| For | Use |
| --- | --- |
| A pull request for rules, skills, prompts, hooks, settings, or code | `managing-work-items` |
| What a decision entry, a source row, or a system document says; an ID that another session's save took | `filing-project-records` |
| A save that cannot finish now: the next action in its work item | `managing-work-items` |
| A save that cannot finish now: the next action in the handoff | `handoff` |

## References

| File | Open it when |
| --- | --- |
| [references/recovery.md](references/recovery.md) | The push or the fast-forward is refused, the default branch got new commits, the repository has no `origin`, or the save cannot finish now. |

```
After:
```text
---
name: publish-docs
description: 'Commits an approved edit to project documents directly to the default branch. Use when another skill asks for a document save or the owner asks to "publish the docs". For deciding what belongs in DECISIONS.md, sources/, or system/, use filing-project-records. For code, rules, skills, or work items, use managing-work-items.'
---

# Commit project documents to the default branch

Use this skill to commit a change to Git-tracked project documents directly to the default branch, with no pull request. "The paths of the project documents" below lists which files are project documents. The default branch is the repository's main branch, which is often `main`.

In this skill, a save is one commit of an agreed document edit. The commit is made in a temporary Git worktree of its own, which this skill calls the save worktree. A worktree is a separate folder with its own checked-out commit.

Two things must be true when the save is done: only the agreed document edit reaches the default branch, and no other session's work changes. A save is finished only when step 8 finds its commit on the default branch.

This skill decides nothing about what a document says. The skill that asked for the save decides what the document says. Committing a document does not approve its requirements or its build.

Run each Git command on its own, with `git -C <folder>`, which names the folder that the command works in. The command then never depends on the current folder.

## The paths of the project documents

A project document is a file under one of these paths.

- `system/**`
- `PROJECT*.md`
- `DECISIONS.md`
- `sources/**`
- `reference/**`
- `delivery/**`
- `tools/**/*.md`
- `**/README.md`

## Names used in the commands

- `<main>` is the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints.
- `<session folder>` is the folder this session works in.
- `<default>` is the name of the default branch. Step 2 finds it.
- `<save>` is the save worktree that step 3 makes.
- `<working checkout>` is the checkout where this session edited the document, normally `<session folder>`.
- `<short-slug>` is a short name for the save, such as `roadmap-phase-2`.
- `<file>` is one file of the save.
- `<commit id>` is the ID of the save's commit: the commit that step 6 makes, or the commit that a rebase in `references/recovery.md` makes in its place.

## Steps

1. **Check the files.** Name every file in the save. Each file must be a project document, which means that all four of these are true:
   - The file is under a path in "The paths of the project documents" above.
   - The file's type is `.md`, `.txt`, `.csv`, `.xml`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, or `.pdf`. A source under `sources/` may be any type, because the owner approved the source when `filing-project-records` filed it.
   - "Refused files" below does not refuse the file.
   - Git does not ignore the file. Run `git -C <main> check-ignore <file>`. When the command prints the path, Git ignores the file.

   Save only an edit that the owner asked for or said yes to, an edit that the root `AGENTS.md` tells you to make without asking, or an edit that another skill tells you to save with this skill, for example `filing-project-records`. That request, yes, or instruction also covers the push in step 7.
2. **Look first.** Run these three commands, each on its own:

   ```text
   git -C <session folder> worktree list
   git -C <session folder> status
   git -C <session folder> remote
   ```

   What `remote` prints decides how the save goes:
   - When the repository has remotes, but none is named `origin`, stop and ask the owner which remote holds the default branch. `references/recovery.md`, section "The repository has remotes, but none named `origin`", says how to name the remotes and when to rename one.
   - When the repository has no remote, the save is committed on the local default branch. Never fetch, and never push to a remote. The local `git push . HEAD:<default>` in step 7 is allowed, because it moves only a local branch.

   Then find the default branch:
   - With a remote, `git -C <main> symbolic-ref --short refs/remotes/origin/HEAD` prints `origin/<default>`.
     - When that command fails, run `git -C <main> fetch origin` and try the command again.
     - When it still fails, read the "HEAD branch" line of `git -C <main> remote show origin`.
     - When that line says "(unknown)", the remote has no branches. Ask the owner whether to push the default branch first.
   - With no remote, the default branch is the branch that the main checkout has: `git -C <main> branch --show-current`.
3. **Start the save worktree** inside the main checkout. Name it `.claude/worktrees/docsave-<short-slug>`, for example `docsave-roadmap-phase-2`.
   - First check that Git ignores that folder: `git -C <main> check-ignore .claude/worktrees/docsave-<short-slug>` must print the path.
   - When the command prints nothing, stop. Tell the owner that the project's `.gitignore` lacks the `.claude/worktrees/` line that every project gets. Adding the line is a settings change, not a document save.
   - Then run these two commands:

     ```text
     git -C <main> fetch origin <default>
     git -C <main> worktree add --detach .claude/worktrees/docsave-roadmap-phase-2 origin/<default>
     ```

   - With no remote, skip the fetch, and use `<default>` in place of `origin/<default>`.
4. **Make the edit in the save worktree, and stage each file by name:** `git -C <save> add -- <file>`. When this session already made the edit in its working checkout, carry the edit across as "Carrying an edit across" below says.
5. **Check the staged save** in the save worktree:

   ```text
   git -C <save> status --porcelain
   git -C <save> diff --cached --name-status
   git -C <save> diff --cached
   git -C <save> -c core.whitespace=-blank-at-eol diff --cached --check
   ```

   - `status --porcelain` must list only this save's files, each one staged. Before you go on, fix an unstaged change, an untracked file (`??`), or any other path.
   - Read the full staged diff.
   - `diff --cached --check` must print nothing. The `-c` setting allows two trailing spaces, which make a line break in Markdown.
6. **Commit.** Run `git -C <save> commit -m '<plain message>'`. Write the message in plain words, with no AI credit line.
7. **Put the commit on the default branch.**
   - With a remote, run `git -C <save> push origin HEAD:<default>`. Never force the push. When the push is refused because the default branch has commits that the save does not have, open `references/recovery.md`, section "The default branch advanced", which says how to bring the save up to date and try again.
   - With no remote, do these in order:
     1. Run `git -C <main> status --porcelain`. When it lists a file of this save that is not this session's own copy, that file is another session's work. Stop, name the file, and ask the owner.
     2. Move the local default branch forward in the checkout that has the default branch, which is normally the main checkout: `git -C <main> merge --ff-only <commit id>`. This command is a fast-forward: it moves the branch forward to the commit and makes no merge commit.
     3. When no checkout has the default branch, run `git -C <save> push . HEAD:<default>` in place of the fast-forward.
     4. When Git refuses the command, open `references/recovery.md`. It says what to do when the default branch has commits that the save does not have, and when a changed file blocks the fast-forward.
8. **Verify, update the main checkout, clean up, and report.**
   - Verify that the commit is on the default branch.
     - With a remote, run `git -C <save> fetch origin <default>`. Then `git -C <save> branch -r --contains <commit id>` must list `origin/<default>`.
     - With no remote, `git -C <main> branch --contains <commit id>` must list the default branch.
   - Find out whether the main checkout holds the save. With a remote, also bring the main checkout up to date. "The main checkout" below gives the steps.
   - When no other save of the same files is pending in this session, remove the save worktree: `git -C <main> worktree remove .claude/worktrees/docsave-<short-slug>`.
   - Note three things for the step that started this save:
     - the commit id;
     - where the commit is, in one of these two sentences: "Saved to main and pushed to the remote." or "No remote: saved to main on this computer only.";
     - whether the main checkout holds the save.
   - Put these three things in the reply to the owner only when the owner asked to publish or commit the documents, or when the main checkout does not hold the save. In every other case the save is finished and the main checkout holds it, so say nothing about the commit or the remote in the reply.
   - When another skill started this save, go back to that skill and continue from the step that started this save. Otherwise, end with the one question for the owner, or with the exact words that continue.

## Refused files

This skill never commits these files:

- Every file under `delivery/migrations/`, except `.md` notes and `.gitignore`. Load files and backups in that folder can hold production records and personal data.
- Code (`.js`, `.mjs`, `.py`, `.sh`, `.cls`, `.trigger`), settings, `.json`, and spreadsheets such as `.xlsx`. The one exception is a source under `sources/`.
- Hidden files and folders, such as `.env` or `.github/`. The one exception is a `.gitignore` under `delivery/`.
- Instruction files (`AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, `SKILL.md`), anywhere and in any letter case.
- Any path that Git ignores.

A refused file stays refused even under a path that the rule accepts.

Rules, skills, prompts, hooks, settings, and code use a pull request. A document edit that would be wrong on the default branch without the code change it describes goes in the pull request of that code change.

## Carrying an edit across

Use this section when this session already edited a document in its working checkout. The edit must get into the save worktree without removing anything that the default branch has.

Check each edited file before you copy it:

```text
git -C <working checkout> diff --quiet HEAD <save commit> -- <file>
```

`<save commit>` is what `git -C <save> rev-parse HEAD` prints before step 6.

- Exit code 0 means that the working checkout started from the version that the save worktree has. Copy the edited file to the same path in the save worktree.
- Exit code 1 means that the two versions differ. Never copy the file, because the copy would remove what the default branch has and the working checkout lacks. Make the same change by hand in the save worktree's file. `git -C <working checkout> diff HEAD -- <file>` shows the change.

Then stage each file, and run the checks of step 5.

Last, remove this session's own copy from the working checkout. Remove only files that this session edited or created: run `git -C <working checkout> restore -- <file>` for a changed file, and `rm` for a new file. Never discard another session's changes.

When to remove the copy depends on the remote:

- With a remote, remove the copy after step 8 verifies the save, and before the main checkout is brought up to date. The saved version comes back with that update. When the working checkout is another worktree, the saved version comes back with the next `pull-latest`.
- With no remote, remove the copy before step 7, once the file is staged. Git refuses the fast-forward while the main checkout holds a changed copy of a saved file, or an untracked copy of a new file.

## The main checkout

The third thing that step 8 notes is whether the main checkout holds the save. The reason is that local work items are kept in the main checkout, and a work item must not name a record that the main checkout does not hold.

### With no remote

- When step 7 ran the fast-forward in the main checkout, the main checkout holds the save.
- When step 7 ran the fast-forward in another checkout, or ran `git push . HEAD:<default>`, the main checkout is on another branch and does not hold the save. Change nothing in the main checkout.

### With a remote

A pushed save is not in the main checkout yet. After step 8 verifies the save, move the main checkout's default branch forward. Use a fast-forward only: never merge, rebase, reset, or switch branches in the main checkout.

1. Run `git -C <main> branch --show-current`. It must print `<default>`. When it prints another branch, change nothing.
2. Do the merge-safety check. `git -C <main> diff --name-only HEAD origin/<default>` lists the files that the update changes, and `git -C <main> status --porcelain` lists the files with uncommitted changes. A file in both lists blocks the update.
   - When the file is this session's own copy of a saved file, remove the copy as "Carrying an edit across" says.
   - When the file is any other file, change nothing.
3. When no file blocks the update, run `git -C <main> merge --ff-only origin/<default>`. When Git refuses, change nothing.

### When the main checkout does not hold the save

The save is still finished. Say so in the reply in one line: "The main checkout does not hold this save yet", and then what blocks the update. What blocks the update is the branch that the main checkout is on, the files that block the update, or Git's message. Tell the skill that started the save.

## Mistakes to avoid

- Never make, stage, or commit this save's edit in the main checkout.
- Never start a save from inside another save worktree.
- Other `docsave-` worktrees in `git worktree list` belong to other sessions. Do not change or remove them.
- Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.

## Work that another skill does

| For | Use |
| --- | --- |
| A pull request for rules, skills, prompts, hooks, settings, or code | `managing-work-items` |
| What a decision entry, a source row, or a system document says; an ID that another session's save took | `filing-project-records` |
| A save that cannot finish now: the next action in its work item | `managing-work-items` |
| A save that cannot finish now: the next action in the handoff | `handoff` |

## References

| File | Open it when |
| --- | --- |
| [references/recovery.md](references/recovery.md) | The push or the fast-forward is refused, the default branch got new commits, the repository has no `origin`, or the save cannot finish now. |

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/SKILL.md

Before:
```text
---
name: filing-project-records
description: 'Files sources the project receives in sources/, decisions and open questions that more than one work item needs in DECISIONS.md, and changes to documents about system rules in system/. Each record gets an ID so later work can find it. Use when the owner gives the project a source, a shared decision or question needs recording, or a system document needs updating. For a decision that only one work item needs, use managing-work-items.'
---

# Filing project records

Use this skill to file records that later work may need. File the three kinds of record as follows:

1. Save every source the project receives from someone else in `sources/`, unchanged, with an ID like SRC-001. Sources include meeting transcripts, emails, client documents, and screenshots. File a source even when only one work item uses it, or none does yet.
2. Record decisions and open questions that more than one work item needs in `DECISIONS.md`. Give each entry an ID like DEC-001.
3. Record rules about how the system must work that more than one work item needs in a document in `system/`. Give each rule an ID like SEC-04.

If only one work item needs a decision or a requirement, do not save it here. It stays in that work item: use `managing-work-items`.

Before you save a decision, an open question, or a rule, check that more than one work item needs it. The root `AGENTS.md`, section "Where information goes", gives the test for that, and lists where every kind of information is kept.

In this skill, a record is one saved source, one entry in `DECISIONS.md`, or one rule in `system/`. To save a record is to commit the change to the default branch with `publish-docs`.

## Which filing step to do

Find what happened in the table, and open only the file in that row. When one message needs more than one step, do the steps in the order of the table.

| What happened | Step | Open |
| --- | --- | --- |
| The project was given a source, such as a transcript, a meeting note, an email, a client document, a screenshot, or an export | File a source | [references/file-source.md](references/file-source.md) |
| A decision was made, or a question was raised, that more than one work item needs | Record a decision | [references/record-decision.md](references/record-decision.md) |
| The status of an entry in `DECISIONS.md` changes | Record a decision | [references/record-decision.md](references/record-decision.md) |
| `managing-work-items` is closing a work item, and the owner agreed to keep, for the whole project, a lesson from it about the system or the project | Record a decision | [references/record-decision.md](references/record-decision.md) |
| An approved fact about the system changes: a rule, a term, an integration document, or a diagram | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |
| `managing-work-items` is closing a work item, and the work item built what a rule says | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |

The rest of this file applies to all three steps.

## Before you write a record

- Read how the record must be written, in the same turn in which you write it. This skill does not show the form of a record. The place where the record is kept shows it:
  - for a decision or an open question, the comment at the top of `DECISIONS.md`;
  - for a source, `sources/AGENTS.md`;
  - for a rule or anything else in `system/`, `system/AGENTS.md`.
- Read the file you will change again, right before you change it. The owner edits these files by hand, and another session may have committed a change.
- Search before you add a record. When a record already covers the subject, change that record. Never add a second record for the same subject.

## When this session works in its own worktree

A worktree is a separate folder with its own branch. The main checkout is the project's main folder: the first path that `git worktree list` prints.

When this session's folder is not the main checkout, read and write `DECISIONS.md`, `sources/`, and `system/` only in the save worktree. The save worktree is the folder that `publish-docs` makes from the default branch. Never read or write them in the session's own worktree, because its branch can lack records that the default branch holds.

- When no save worktree exists yet, do steps 1 to 3 of `publish-docs` before you read or write a record.
- Where a step in this skill says to save, continue from step 4 of `publish-docs`.

## Saving a record

- Save right after you write the record. The record's ID is yours only when its save is on the default branch.
- When `publish-docs` finds that another session's save took the same ID, take the next ID. Change the ID in your record, and in the file name when the record is a source. Then save again.

## Writing a record's ID in a work item

A work item that needs a record holds the record's ID, and never a copy of the record's text. An ID goes into a work item only after this skill has saved the record, or has saved the work item's ID on a record that already exists. Each step of this skill says who writes the ID: the step writes it with `managing-work-items`, or the step gives it to the step of `managing-work-items` that asked for the record, and that step writes it.

### Where the ID goes

The work item template gives the place for each ID:

- A DEC ID or a rule ID goes on the work item's Related items line.
- An SRC ID goes on a line under Notes, Sources.

### When to write the ID

The time depends on where the project keeps its work items.

- When work items are in Notion or GitHub, write the ID once the save is on the default branch.
- When work items are local files, write the ID only after `publish-docs` reports that the main checkout holds the save. A local work item is kept in the main checkout, so the record that it names must be there.
- When work items are local files and `publish-docs` reports that the main checkout does not hold the save, write no ID in the work item. Do this in its place:
  - Give `managing-project-memory` one line for "Waiting on" in the project's Current State. The project's Current State is the project's one short page of what is true now, and "Waiting on" is one of its parts. The line holds the record's ID, each work item that needs the ID, and what `publish-docs` named as blocking the update.
  - Tell the owner the same.
  - When the main checkout's files hold the record, write the ID in each work item, and ask `managing-project-memory` to remove that line.

### A work item that must follow a record that already exists

The record can be a rule in `system/`, an entry in `DECISIONS.md`, or a source. Make no new record. Do these three things in this order:

1. Add the work item's ID to the record's Affects line or "Used by" cell, where the record has one. An entry in `DECISIONS.md` has an Affects line, and a row in `sources/INDEX.md` has a "Used by" cell.
2. Save.
3. Write the record's ID in the work item.

## Check what you wrote, and report

- Read back each file you changed and each ID you wrote in a work item.
- When a save fails, start your reply with "Not saved", and name the write that failed.
- When another skill asked for the step, give that skill each new ID when the save is done, and tell it what `publish-docs` reported about the main checkout.

## Work that another skill does

| For | Use |
| --- | --- |
| The commit of every change this skill makes | `publish-docs` |
| Writing a record's ID in a work item, and reading a work item | `managing-work-items` |
| Anything that one work item alone needs; a requirement that a new decision changes; the closing of a work item, which says what the work item built | `managing-work-items` |
| A line under "Waiting on" in the project's Current State; a memory record that says where to find a record, when the owner asks for one; a fact that fits no record here | `managing-project-memory`. |
| A captured outside page, or a record of the system as it is today | `reference/AGENTS.md` |

```
After:
```text
---
name: filing-project-records
description: 'Files sources the project receives in sources/, decisions and open questions that more than one work item needs in DECISIONS.md, and changes to documents about system rules in system/. Each record gets an ID so later work can find it. Use when the owner gives the project a source, a shared decision or question needs recording, or a system document needs updating. For a decision that only one work item needs, use managing-work-items.'
---

# Filing project records

Use this skill to file records that later work may need. File the three kinds of record as follows:

1. Save every source the project receives from someone else in `sources/`, unchanged, with an ID like SRC-001. Sources include meeting transcripts, emails, client documents, and screenshots. File a source even when only one work item uses it, or none does yet.
2. Record decisions and open questions that more than one work item needs in `DECISIONS.md`. Give each entry an ID like DEC-001.
3. Record rules about how the system must work that more than one work item needs in a document in `system/`. Give each rule an ID like SEC-04.

If only one work item needs a decision or a requirement, do not save it here. It stays in that work item: use `managing-work-items`.

Before you save a decision, an open question, or a rule, check that more than one work item needs it. The root `AGENTS.md`, section "Where information goes", gives the test for that, and lists where every kind of information is kept.

In this skill, a record is one saved source, one entry in `DECISIONS.md`, or one rule in `system/`. To save a record is to commit the change to the default branch with `publish-docs`.


Read the memory choice in `PROJECT.md`. For local or Notion memory, use `managing-project-memory` and the installed Current State page. For Hindsight, follow `.claude/rules/hindsight-memory.md` wherever these steps call for memory recall, review, saves, or corrections. Keep current work, blockers, and next actions in the selected tracker and project records; do not create a Current State page or treat its absence as a setup failure.

## Which filing step to do

Find what happened in the table, and open only the file in that row. When one message needs more than one step, do the steps in the order of the table.

| What happened | Step | Open |
| --- | --- | --- |
| The project was given a source, such as a transcript, a meeting note, an email, a client document, a screenshot, or an export | File a source | [references/file-source.md](references/file-source.md) |
| A decision was made, or a question was raised, that more than one work item needs | Record a decision | [references/record-decision.md](references/record-decision.md) |
| The status of an entry in `DECISIONS.md` changes | Record a decision | [references/record-decision.md](references/record-decision.md) |
| `managing-work-items` is closing a work item, and the owner agreed to keep, for the whole project, a lesson from it about the system or the project | Record a decision | [references/record-decision.md](references/record-decision.md) |
| An approved fact about the system changes: a rule, a term, an integration document, or a diagram | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |
| `managing-work-items` is closing a work item, and the work item built what a rule says | Update a system document | [references/update-system-doc.md](references/update-system-doc.md) |

The rest of this file applies to all three steps.

## Before you write a record

- Read how the record must be written, in the same turn in which you write it. This skill does not show the form of a record. The place where the record is kept shows it:
  - for a decision or an open question, the comment at the top of `DECISIONS.md`;
  - for a source, `sources/AGENTS.md`;
  - for a rule or anything else in `system/`, `system/AGENTS.md`.
- Read the file you will change again, right before you change it. The owner edits these files by hand, and another session may have committed a change.
- Search before you add a record. When a record already covers the subject, change that record. Never add a second record for the same subject.

## When this session works in its own worktree

A worktree is a separate folder with its own branch. The main checkout is the project's main folder: the first path that `git worktree list` prints.

When this session's folder is not the main checkout, read and write `DECISIONS.md`, `sources/`, and `system/` only in the save worktree. The save worktree is the folder that `publish-docs` makes from the default branch. Never read or write them in the session's own worktree, because its branch can lack records that the default branch holds.

- When no save worktree exists yet, do steps 1 to 3 of `publish-docs` before you read or write a record.
- Where a step in this skill says to save, continue from step 4 of `publish-docs`.

## Saving a record

- Save right after you write the record. The record's ID is yours only when its save is on the default branch.
- When `publish-docs` finds that another session's save took the same ID, take the next ID. Change the ID in your record, and in the file name when the record is a source. Then save again.

## Writing a record's ID in a work item

A work item that needs a record holds the record's ID, and never a copy of the record's text. An ID goes into a work item only after this skill has saved the record, or has saved the work item's ID on a record that already exists. Each step of this skill says who writes the ID: the step writes it with `managing-work-items`, or the step gives it to the step of `managing-work-items` that asked for the record, and that step writes it.

### Where the ID goes

The work item template gives the place for each ID:

- A DEC ID or a rule ID goes on the work item's Related items line.
- An SRC ID goes on a line under Notes, Sources.

### When to write the ID

The time depends on where the project keeps its work items.

- When work items are in Notion or GitHub, write the ID once the save is on the default branch.
- When work items are local files, write the ID only after `publish-docs` reports that the main checkout holds the save. A local work item is kept in the main checkout, so the record that it names must be there.
- When work items are local files and `publish-docs` reports that the main checkout does not hold the save, write no ID in the work item. Do this in its place:
  - Give `managing-project-memory` one line for "Waiting on" in the project's Current State. The project's Current State is the project's one short page of what is true now, and "Waiting on" is one of its parts. The line holds the record's ID, each work item that needs the ID, and what `publish-docs` named as blocking the update.
  - Tell the owner the same.
  - When the main checkout's files hold the record, write the ID in each work item, and ask `managing-project-memory` to remove that line.

### A work item that must follow a record that already exists

The record can be a rule in `system/`, an entry in `DECISIONS.md`, or a source. Make no new record. Do these three things in this order:

1. Add the work item's ID to the record's Affects line or "Used by" cell, where the record has one. An entry in `DECISIONS.md` has an Affects line, and a row in `sources/INDEX.md` has a "Used by" cell.
2. Save.
3. Write the record's ID in the work item.

## Check what you wrote, and report

- Read back each file you changed and each ID you wrote in a work item.
- When a save fails, start your reply with "Not saved", and name the write that failed.
- When another skill asked for the step, give that skill each new ID when the save is done, and tell it what `publish-docs` reported about the main checkout.

## Work that another skill does

| For | Use |
| --- | --- |
| The commit of every change this skill makes | `publish-docs` |
| Writing a record's ID in a work item, and reading a work item | `managing-work-items` |
| Anything that one work item alone needs; a requirement that a new decision changes; the closing of a work item, which says what the work item built | `managing-work-items` |
| A line under "Waiting on" in the project's Current State; a memory record that says where to find a record, when the owner asks for one; a fact that fits no record here | `managing-project-memory`. |
| A captured outside page, or a record of the system as it is today | `reference/AGENTS.md` |

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/pull-latest/SKILL.md

Before:
```text
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
   `git status -sb`, and `git branch --show-current`. Stop, with one line
   saying why, when:
   - there is no remote (`git remote` prints nothing): fetch nothing;
   - no branch is checked out (`git branch --show-current` prints nothing);
   - the branch's upstream is on a remote not named `origin`, or the branch
     has no upstream and no remote is named `origin`: ask which remote to
     pull from;
   - the working tree has uncommitted changes (untracked `??` files alone do
     not count): the changes may be another session's work, so never commit
     or discard them;
   - this is the main checkout (the first path `git worktree list` prints)
     on a branch other than the default branch. Your own worktree on your
     own branch is fine.

   In your own worktree, a stop for no checked-out branch or for uncommitted
   changes ends only the work on your own branch: run step 2 first, then stop,
   and add step 5's line on the main checkout to the line saying why.

   The default branch: `git symbolic-ref --short refs/remotes/origin/HEAD`
   prints `origin/<default>`. If it fails, read the "HEAD branch" line of
   `git remote show origin`. Never assume `main`.
2. **Fetch:** `git fetch --prune origin`. In your own worktree, update the
   main checkout next: run `git -C <main checkout> status -sb`. When it
   shows the default branch and no uncommitted changes, as step 1 counts
   them, run `git -C <main checkout> pull --ff-only`. On another branch,
   with uncommitted changes, or a pull that fails: leave the main checkout
   as it is.
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
   branch?" After the owner's yes, run `git merge --no-edit origin/<default>`.
5. **Report** the incoming commits (one line each, then one line on what they
   change together), the final state, and anything step 3 found: another
   session's commits, or content already on the remote under another commit
   id. The final state is one of:
   - "up to date with origin/<branch>";
   - "ahead of origin/<branch> by N commits; you decide whether to push";
   - with no upstream: "holds everything on origin/<default>", or "N commits
     behind origin/<default>; not merged".

   From your own worktree, add one line on the main checkout: "The main
   project folder is updated to <short commit id>.", "The main project
   folder was already up to date.", or "I left the main project folder
   alone: <it is on branch X | it has uncommitted changes | the pull
   error>."

   End with the one question the owner must answer, or else the exact words
   the owner can say to start the next step.

## Mistakes to avoid

- `--no-edit` is only for a merge that finishes without a conflict. On a
  conflict, run `git merge --abort` and report the conflicting files, unless
  the owner said in this session to resolve conflicts or finish this
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
  ask the owner to run it.

## Work that another skill does

| For | Use |
| --- | --- |
| Throwing away local work to match the remote exactly | `reset-to-remote` |
| A toolkit update | `project-setup` |

```
After:
```text
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
   `git status -sb`, and `git branch --show-current`. Stop, with one line
   saying why, when:
   - there is no remote (`git remote` prints nothing): fetch nothing;
   - no branch is checked out (`git branch --show-current` prints nothing);
   - the branch's upstream is on a remote not named `origin`, or the branch
     has no upstream and no remote is named `origin`: ask which remote to
     pull from;
   - the working tree has uncommitted changes (untracked `??` files alone do
     not count): the changes may be another session's work, so never commit
     or discard them;
   - this is the main checkout (the first path `git worktree list` prints)
     on a branch other than the default branch. Your own worktree on your
     own branch is fine.

   In your own worktree, a stop for no checked-out branch or for uncommitted
   changes ends only the work on your own branch: run step 2 first, then stop,
   and add step 5's line on the main checkout to the line saying why.

   The default branch: `git symbolic-ref --short refs/remotes/origin/HEAD`
   prints `origin/<default>`. If it fails, read the "HEAD branch" line of
   `git remote show origin`. Never assume `main`.
2. **Fetch:** `git fetch --prune origin`. In your own worktree, update the
   main checkout next: run `git -C <main checkout> status -sb`. When it
   shows the default branch and no uncommitted changes, as step 1 counts
   them, run `git -C <main checkout> pull --ff-only`. On another branch,
   with uncommitted changes, or a pull that fails: leave the main checkout
   as it is.
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
   branch?" After the owner's yes, run `git merge --no-edit origin/<default>`.
5. **Report** the incoming commits (one line each, then one line on what they
   change together), the final state, and anything step 3 found: another
   session's commits, or content already on the remote under another commit
   id. The final state is one of:
   - "up to date with origin/<branch>";
   - "ahead of origin/<branch> by N commits; you decide whether to push";
   - with no upstream: "holds everything on origin/<default>", or "N commits
     behind origin/<default>; not merged".

   From your own worktree, add one line on the main checkout: "The main
   project folder is updated to <short commit id>.", "The main project
   folder was already up to date.", or "I left the main project folder
   alone: <it is on branch X | it has uncommitted changes | the pull
   error>."

   End with the one question the owner must answer, or else the exact words
   the owner can say to start the next step.

## Mistakes to avoid

- `--no-edit` is only for a merge that finishes without a conflict. On a
  conflict, run `git merge --abort` and report the conflicting files, unless
  the owner said in this session to resolve conflicts or finish this
  merge. Then read both sides of each file, stop and ask when the right
  result is not clear, stage each resolved file by name, and commit with a
  message you write, with no AI credit line. Never `git commit --no-edit`
  after a conflict.
- Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.

## Work that another skill does

| For | Use |
| --- | --- |
| Throwing away local work to match the remote exactly | `reset-to-remote` |
| A toolkit update | `project-setup` |

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/references/handoff-verifier.md

Before:
```text
<!-- Shared text from the Toolkit V2 repository, where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Handoff verifier: helper brief

This file is for the handoff verifier, the helper that `handoff` starts at its step 6. A helper is a separate agent that sees only the instructions it is given. The verifier checks a drafted handoff prompt and changes nothing. Its check is done when it has reported whether the draft states the overarching goal, and whether every fact in the draft matches the repository and what is saved where the work items are kept.

The file has two parts. "For the main agent" says how to start the verifier. "Brief for the helper" is the text that the verifier receives.

## Contents

- For the main agent
- Brief for the helper
  - Your job
  - Read-only means read-only
  - What you receive
  - Job one: is the goal there
  - Job two: check every checkable claim
  - Your report

## For the main agent

Start the verifier from `handoff`, after you draft the prompt and before the owner sees the prompt. Act on every verdict as step 6 of `handoff` says.

Start the verifier as a new helper that does not see this session:

- In Claude Code, use the Agent tool, with `subagent_type` set to `general-purpose` and `model` set to `opus`. Never use a fork, because the verifier must not share this session.
- In Codex, use the `spawn_agent` tool with `fork_turns` set to `none`. Wait for its report with `wait_agent`.
- The message to the helper holds everything under "Brief for the helper", word for word, and then the list of inputs below, filled in. The helper sees nothing else.
- The verifier can open local files and run `gh`. It cannot read Notion or Hindsight. So paste, under "Supplied text", the text of each Notion work item, the Notion "Current state" page, and each Hindsight memory record that the draft relies on.

The list of inputs:

```text
Draft prompt: <the whole draft>
Main checkout: <full path; the first path git worktree list prints>
Tracker: local (work-items/ in the main checkout) | Notion (work item text
  pasted below) | GitHub Issues (<account/repository>)
Current State: memory/CURRENT_STATE.md in the main checkout | Notion
  (page text pasted below)
Sources for claims: <for each claim you can: file, repository, owner (with
  the owner's words when you have them), or worked out>
Supplied text: <Notion work items, the Notion Current state page, Hindsight memories>
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

Check the draft and change nothing. The main agent drafted a handoff prompt, which is a prompt that a new session uses to continue the work. For each claim in the draft, say whether the claim matches what is in the repository and what is saved where the work items are kept. Also say which claims no record supports.

You have not seen the session that wrote the draft. So give a claim the verdict Confirmed only when you opened the record that holds the claim.

### Read-only means read-only

- Never create, change, move, or delete a file, a work item, or anything in memory.
- Run only commands that read, and run each one on its own: `git status`, `log`, `diff`, `show`, `worktree list`, `ls`, `cat`, `grep`, `rg`, `gh issue view`, `gh pr view`.
- When you believe that something needs to change, say what and where.
- Never run tests, builds, installs, or any script. When the draft says that a test or a build passed, give that claim the verdict Unchecked, unless you were given the command output.
- When `gh` fails with a network error or a sign-in error, give each claim that needed `gh` the verdict Skipped. List the check, with the error, under "Skipped".

### What you receive

You receive the full draft, the path of the main checkout, a source for each claim where there is one, and the text of anything that you cannot open yourself. The main checkout is the project's main folder.

How you check a claim depends on its source:

- A claim from a file or from the repository: open the file, or check the claim in the repository.
- A claim that the owner made: check it against the owner's words that you were given, and write "checked against supplied text" in the Detail column. When you were given no words of the owner, give the claim the verdict Unchecked.
- A claim that the agent worked out, or a claim with no source given: give it the verdict Unchecked.

Work items are named by ID, never by path. How you open a work item depends on the "Tracker" line of the list of inputs:

- Local: find the file under `work-items/` in the main checkout whose front matter says `id: WI-014` (for example `grep -rlE '^id: *"?WI-014"? *$' <main checkout>/work-items`; the value may be in quotes). The front matter is the block of fields at the top of the file. The design of the work item is `DESIGN.md` in the same folder.
- GitHub: `gh issue view <number> -R <account/repository> --json title,body,labels,state`, and `gh issue view <number> -R <account/repository> --comments` for its design comment. The list of inputs names the repository. Pass `-R` on every `gh` command.
- Notion: check against the supplied text.

The other records are in these places:

- The project's Current State is the project's one short page of what is true now. It is `memory/CURRENT_STATE.md` in the main checkout, except in a project with Notion memory.
- For the Notion "Current state" page and for Hindsight memory records, use only the supplied text.
- A decision that more than one work item needs is an entry in `DECISIONS.md`. An approved rule of the system is in `system/`. A filed source, which is something the project was given and keeps, is in `sources/`. All three are in the repository.

The first line of the prompt is a fixed notice, which says that the prompt is AI-generated and may contain hallucinations. That notice is not a claim. When the draft has no such line, say so under "Also noticed".

### Job one: is the goal there

Check that the draft states three things: the overarching goal, why the goal matters, and where the goal is written down. The overarching goal is what the work is trying to achieve, not the next action. The place where the goal is written down is a work item ID, a rule ID in `system/`, a DEC ID in `DECISIONS.md`, or an issue or pull request number.

Open the place that the draft names, and confirm that it holds the goal that the draft claims. Then give one verdict: Confirmed, or one of these three:

- Wrong: the place does not exist, or it says something else.
- Unchecked: the draft names no place.
- Missing: the draft gives only the next step, or no goal at all. The main agent must fix a goal that is Missing before the owner sees the prompt. Say so.

### Job two: check every checkable claim

- For every file path and folder path, and every claim about what a file says, check that the path exists and that the file says what the draft claims. When a path is close to a real path, name the real path.
- For every branch, worktree, commit, pull request, issue, and work item ID, check that it is the one named, and that it is in the state the draft says. For a work item, check its State, `waiting_on`, the lines of its Current state, and its first open question.
- For every decision (DEC), source (SRC), and rule ID, check that it exists, with the Status or the Mark that the draft says. The Mark of a rule is one of four words: Draft, Approved, Built, or Retired.
- For every number, count, date, and duration, including any that the draft worked out from other values, work it out again.
- When no command output supports a claim that something was run, passed, failed, or was verified, give that claim the verdict Unchecked.
- An earlier handoff prompt is not a source. Check again, as a new claim, anything that was carried over from one.

Then list every sentence that sounds settled, such as "we decided" or "the owner wants", but that no file, record, or rule supports. Do not delete or reword those sentences.

### Your report

Your final message is the only thing the main agent receives. Always end your final message with the report, in this form:

```text
Handoff check

Goal
  Verdict: Confirmed / Wrong / Unchecked / Missing
  <one line: what the goal says, and what the place it is written down holds>

Claims

| # | Claim | Source kind | Verdict | Detail |
| --- | --- | --- | --- | --- |
| 1 | <short quote> | file / repository / owner / worked out / none given | Confirmed | path:line, or WI-014 Overview |
| 2 | <short quote> | file | Wrong | the file says 4 files, not 9 |

Carried over from an earlier handoff
- <claim>: <what checking it again found>
  (or "Nothing in the draft is carried over from an earlier handoff.")

Skipped (a check that could not run; never report it as Confirmed)
- <check that could not run, and why>   (or "Nothing skipped.")

Also noticed
- <at most two lines, or "Nothing.">
```

```
After:
```text
<!-- Shared text from the Toolkit V2 repository, where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Handoff verifier: helper brief

This file is for the handoff verifier, the helper that `handoff` starts at its step 6. A helper is a separate agent that sees only the instructions it is given. The verifier checks a drafted handoff prompt and changes nothing. Its check is done when it has reported whether the draft states the overarching goal, and whether every fact in the draft matches the repository and what is saved where the work items are kept.

The file has two parts. "For the main agent" says how to start the verifier. "Brief for the helper" is the text that the verifier receives.

## Contents

- For the main agent
- Brief for the helper
  - Your job
  - Read-only means read-only
  - What you receive
  - Job one: is the goal there
  - Job two: check every checkable claim
  - Your report

## For the main agent

Start the verifier from `handoff`, after you draft the prompt and before the owner sees the prompt. Act on every verdict as step 6 of `handoff` says.

Start the verifier as a new helper that does not see this session:

- In Claude Code, use the Agent tool, with `subagent_type` set to `general-purpose` and `model` set to `opus`. Never use a fork, because the verifier must not share this session.
- In Codex, use the `spawn_agent` tool with `fork_turns` set to `none`. Wait for its report with `wait_agent`.
- The message to the helper holds everything under "Brief for the helper", word for word, and then the list of inputs below, filled in. The helper sees nothing else.
- The verifier can open local files and run `gh`. It cannot read Notion or Hindsight. So paste, under "Supplied text", the text of each Notion work item, the Notion "Current state" page, and each Hindsight memory record that the draft relies on.

The list of inputs:

```text
Draft prompt: <the whole draft>
Main checkout: <full path; the first path git worktree list prints>
Tracker: local (work-items/ in the main checkout) | Notion (work item text
  pasted below) | GitHub Issues (<account/repository>)
Memory: local (memory/CURRENT_STATE.md in the main checkout) | Notion
  (page text pasted below) | Hindsight (no Current State page; supplied records)
Sources for claims: <for each claim you can: file, repository, owner (with
  the owner's words when you have them), or worked out>
Supplied text: <Notion work items, the Notion Current state page, Hindsight memories>
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

Check the draft and change nothing. The main agent drafted a handoff prompt, which is a prompt that a new session uses to continue the work. For each claim in the draft, say whether the claim matches what is in the repository and what is saved where the work items are kept. Also say which claims no record supports.

You have not seen the session that wrote the draft. So give a claim the verdict Confirmed only when you opened the record that holds the claim.

### Read-only means read-only

- Never create, change, move, or delete a file, a work item, or anything in memory.
- Run only commands that read, and run each one on its own: `git status`, `log`, `diff`, `show`, `worktree list`, `ls`, `cat`, `grep`, `rg`, `gh issue view`, `gh pr view`.
- When you believe that something needs to change, say what and where.
- Never run tests, builds, installs, or any script. When the draft says that a test or a build passed, give that claim the verdict Unchecked, unless you were given the command output.
- When `gh` fails with a network error or a sign-in error, give each claim that needed `gh` the verdict Skipped. List the check, with the error, under "Skipped".

### What you receive

You receive the full draft, the path of the main checkout, a source for each claim where there is one, and the text of anything that you cannot open yourself. The main checkout is the project's main folder.

How you check a claim depends on its source:

- A claim from a file or from the repository: open the file, or check the claim in the repository.
- A claim that the owner made: check it against the owner's words that you were given, and write "checked against supplied text" in the Detail column. When you were given no words of the owner, give the claim the verdict Unchecked.
- A claim that the agent worked out, or a claim with no source given: give it the verdict Unchecked.

Work items are named by ID, never by path. How you open a work item depends on the "Tracker" line of the list of inputs:

- Local: find the file under `work-items/` in the main checkout whose front matter says `id: WI-014` (for example `grep -rlE '^id: *"?WI-014"? *$' <main checkout>/work-items`; the value may be in quotes). The front matter is the block of fields at the top of the file. The design of the work item is `DESIGN.md` in the same folder.
- GitHub: `gh issue view <number> -R <account/repository> --json title,body,labels,state`, and `gh issue view <number> -R <account/repository> --comments` for its design comment. The list of inputs names the repository. Pass `-R` on every `gh` command.
- Notion: check against the supplied text.

The other records are in these places:

- Local memory uses `memory/CURRENT_STATE.md` in the main checkout; Notion memory uses its supplied Current state page. Hindsight has no Current State page. Check current work against the selected tracker and supplied project records, and lasting knowledge against the supplied Hindsight records.
- For the Notion "Current state" page and for Hindsight memory records, use only the supplied text.
- A decision that more than one work item needs is an entry in `DECISIONS.md`. An approved rule of the system is in `system/`. A filed source, which is something the project was given and keeps, is in `sources/`. All three are in the repository.

The first line of the prompt is a fixed notice, which says that the prompt is AI-generated and may contain hallucinations. That notice is not a claim. When the draft has no such line, say so under "Also noticed".

### Job one: is the goal there

Check that the draft states three things: the overarching goal, why the goal matters, and where the goal is written down. The overarching goal is what the work is trying to achieve, not the next action. The place where the goal is written down is a work item ID, a rule ID in `system/`, a DEC ID in `DECISIONS.md`, or an issue or pull request number.

Open the place that the draft names, and confirm that it holds the goal that the draft claims. Then give one verdict: Confirmed, or one of these three:

- Wrong: the place does not exist, or it says something else.
- Unchecked: the draft names no place.
- Missing: the draft gives only the next step, or no goal at all. The main agent must fix a goal that is Missing before the owner sees the prompt. Say so.

### Job two: check every checkable claim

- For every file path and folder path, and every claim about what a file says, check that the path exists and that the file says what the draft claims. When a path is close to a real path, name the real path.
- For every branch, worktree, commit, pull request, issue, and work item ID, check that it is the one named, and that it is in the state the draft says. For a work item, check its State, `waiting_on`, the lines of its Current state, and its first open question.
- For every decision (DEC), source (SRC), and rule ID, check that it exists, with the Status or the Mark that the draft says. The Mark of a rule is one of four words: Draft, Approved, Built, or Retired.
- For every number, count, date, and duration, including any that the draft worked out from other values, work it out again.
- When no command output supports a claim that something was run, passed, failed, or was verified, give that claim the verdict Unchecked.
- An earlier handoff prompt is not a source. Check again, as a new claim, anything that was carried over from one.

Then list every sentence that sounds settled, such as "we decided" or "the owner wants", but that no file, record, or rule supports. Do not delete or reword those sentences.

### Your report

Your final message is the only thing the main agent receives. Always end your final message with the report, in this form:

```text
Handoff check

Goal
  Verdict: Confirmed / Wrong / Unchecked / Missing
  <one line: what the goal says, and what the place it is written down holds>

Claims

| # | Claim | Source kind | Verdict | Detail |
| --- | --- | --- | --- | --- |
| 1 | <short quote> | file / repository / owner / worked out / none given | Confirmed | path:line, or WI-014 Overview |
| 2 | <short quote> | file | Wrong | the file says 4 files, not 9 |

Carried over from an earlier handoff
- <claim>: <what checking it again found>
  (or "Nothing in the draft is carried over from an earlier handoff.")

Skipped (a check that could not run; never report it as Confirmed)
- <check that could not run, and why>   (or "Nothing skipped.")

Also noticed
- <at most two lines, or "Nothing.">
```

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/lifecycle-rules.md

Before:
```text
# Running a work item's lifecycle

Use this reference to take one work item from an idea to Done. The goal is that the work item always says truly where the work stands, and that no step that needs the owner's yes happens without it.

This reference says what each State means, how work is divided into levels, what to do in each State, and when to stop for the owner's yes. Two neighbouring jobs belong to other skills:

- **Reading and saving a work item.** For every read and every save, use the installed `references/work-tracker.md`, which says where this project keeps its work items.
- **Writing `DECISIONS.md`, `system/`, or `sources/`.** `filing-project-records` writes those three places. Never write those three places with this skill. Write the ID of one of their records into a work item only when `filing-project-records` has filed the record and given you the ID. The root `AGENTS.md`, section "Where information goes", gives the test for what belongs in those three places.
  - When a work item must follow a rule or a decision that already exists, give the ID of the rule or decision and the work item to `filing-project-records`. It writes the ID into the work item.

## Contents

- Status and State
- Levels
- When to stop for the owner's yes
- A small work item
- Rules that apply in every State
- Starting a helper
- Work that another skill does
- References

## Status and State

Every work item has a Status and a State. The State says where the work is. The Status follows from the State, so set the State and set the Status with it.

| Status | State | Open this file | Move on when |
| --- | --- | --- | --- |
| Not Started | Backlog | none (see "Backlog" below) | the owner asks to start it |
| Preparing | Refining Requirements | `references/refining-requirements.md` | the owner approves the requirements |
| In Progress | Designing | `references/designing.md` | the owner picks a design |
| In Progress | Building | `references/building.md` | every task is done, with proof |
| In Progress | Testing Loop | `references/testing-loop.md` | a separate checker passes it and the owner approves the result |
| In Progress | Reflecting | `references/closing.md` | the checklist in that file is done |
| In Progress | Deploying | `references/deploying.md` | it is merged and deployed |
| Blocked | Blocked | none (see "Blocked" below) | the blocker is cleared |
| Done | Done | none | |
| Cancelled | Cancelled | none | |

A work item moves to the next State only when "Move on when" is true for the State it is in. After Deploying, continue with `references/closing.md`, section "Marking Done".

The checker in the Testing Loop row is the separate agent that tests the finished result.

### Backlog

A work item stays in Backlog until the owner asks to start it.

- Add the idea in the owner's words, as the Original verbatim requirement of Requirement 1.
- Do not start the interview until the owner asks to start the work item. The interview is the set of questions that Refining Requirements asks the owner, one at a time.
- Write a Next action that names the first step for when the owner starts the work item, for example "Agent: when the owner starts this work item, agree its goal with the owner."

### Designing or Building after the requirements

Any work item can go through Designing, even a bug. When you ask the owner to approve the requirements, recommend the next State:

- Recommend Designing when two ways to build the work item differ in what the owner would see, pay for, or have to maintain, or when a mistake in the change would be costly to undo.
- Otherwise, recommend Building.

### A work item that has sub-items

A sub-item is a work item inside another work item, which is its parent. A parent work item stays in Building until every one of its sub-items is Done or Cancelled. Then the parent goes through the Testing Loop as a whole.

### Blocked

- A work item is Blocked when it is stuck on something outside the work, such as missing access, another team, or a piece that must be finished first.
- A work item that waits for the owner's answer is not Blocked.
- Set `waiting_on` to who can clear the blocker.
- When the blocker is cleared, return the work item to the State that its Blockers line names.

### Done and Cancelled

Set a work item to Done or Cancelled only when the owner says so, and only through `references/closing.md`, which gives the steps for closing a work item. A work item that the owner closed by hand goes through that file too.

## Levels

Every project divides its work into the same four levels, wherever it keeps its work items. A top-level work item is a work item with no parent, and a sub-item is a work item inside another work item. `references/work-tracker.md` says where each part is saved.

| Level | Its phases | What it holds |
| --- | --- | --- |
| The project | Project phases `P01`, `P02`, and so on. They are the project's roadmap. | Its top-level work items, each under exactly one project phase. Its project tasks, in one plain list with no phases. |
| Top-level work item (level 1) | Its own phases `P1`, `P2`, and so on. They are the work item's roadmap. It has at least one phase, even when it is small. | Its tasks and its level-2 sub-items, each under one of its phases. |
| Level-2 sub-item | None | One plain task list, and its level-3 sub-items. |
| Level-3 sub-item | None | One plain task list. |

- Never add a fourth level. Make the work a task instead.
- No ID is ever reused. This rule holds for the ID of a work item, a phase, a task, a requirement, and a question.
- When it is unclear whether something is a project task, a new work item, a sub-item, or a task in a work item, ask the owner one short question with your recommendation. Save nothing until the owner answers.

### Phases

A project phase (`P01`) and a work item's phase (`P1`) are different things. A project phase groups top-level work items. A work item's phase groups that work item's tasks and its level-2 sub-items. A phase is never a work item.

- A top-level work item gets its own phases in Refining Requirements.
- A top-level work item goes under a project phase when the owner places it, and at the latest when it leaves Backlog. When the owner has named no project phase by then, ask which one, with your recommendation.
- The project's phases change only with the owner's yes. Propose new project phases, or a change to them, as one question, with a one-line reason for each new phase and for each change.
- When a project has no phases yet, propose them the first time a work item leaves Backlog.
- When the first work item of a project phase leaves Backlog, set that project phase In Progress.
- When the last open work item in a project phase becomes Done or Cancelled, ask the owner in your next reply whether the project phase is Done.
- A project whose owner has no planned order of work has one project phase, `P01 — Ongoing support`. A project that handles a client's requests as they come in is an example.
  - Propose that phase when the project has no phases yet.
  - While it is the project's only phase, put every top-level work item under it without asking the owner which phase.
  - Never ask whether it is Done. It stays In Progress until the owner says that the support has ended.

### Tasks

- Every task belongs to exactly one place: the project, or one work item.
- A task in a work item is a step toward that work item's goal. Work that the goal does not need is a new Backlog work item, and never a task in this work item. This rule holds even for a small fix found along the way.
- A task ID has one of three forms:
  - `P1-T01` in a top-level work item: the work item's phase, then the task's number.
  - `T01` in a sub-item.
  - `PT-01` for a project task.

### Project tasks

A project task is an administrative task that belongs to no work item. These two things are also project tasks:

- a to-do that the owner names or asks you to keep, such as "we need to prepare for Wednesday's call";
- an action item from a meeting or a message that belongs to no work item.

Save a project task in the turn it comes up, with no question to the owner. Fill its lines as follows:

- Its Who does it is `owner`, `agent`, or the name of the other person who owes it, with the party, such as `Sarah Chen (client)` or `DataBridge (vendor)`.
- Its Work line says what is owed and to whom.
- Its Done when holds the date it is due, when a date was named.
- When the project task comes from a source that the owner gave, such as a transcript, file that source first, with no question to the owner. Use `filing-project-records`, step "file a source". Then name the source's SRC ID in the Work line.

Work a project task the way you work a task in a work item: set it In Progress before you start it, and tick it only when its Done when check is met.

Whenever you report what waits on the owner or what other people owe, name each open project task with who does it.

## When to stop for the owner's yes

Stop and ask the owner before each of these six steps. Record the owner's yes only when the owner answers the question you asked.

1. Approving the requirements, at the end of Refining Requirements.
2. Choosing the design, at the end of Designing.
3. Approving the finished result, at the end of the Testing Loop, after the separate checker has tested it.
4. Each merge into the default branch, in Deploying.
   - A merge that the owner's standing merge instruction in `.claude/rules/owner-preferences.md` covers needs no new yes from the owner. `references/deploying.md`, section "What a merge into the default branch needs", says when the instruction covers a merge.
   - A merge that a helper makes into the work item's own branch needs no yes from the owner. "Starting a helper" below says what a helper is.
5. Each deploy to an environment that other people use, such as a test or staging environment. A production deploy is the owner's to run.
   - A deploy that a rule of the project allows without a question needs no new yes from the owner.
6. Marking the work item Done.

A small work item has fewer stops. "A small work item" below says which stops stay.

## A small work item

A small work item is a top-level work item whose whole job you can play back to the owner in one reply, and that you can build and check without an interview, without Designing, and without sub-items. Adding one line to an email template is an example of a small work item. Making one list of records for the owner to load is another.

A small work item takes the short path, unless the owner asks for the full process. The short path is the six steps below. The full path is the process that this skill gives for every other work item.

The goal of the short path is to take a small work item to Done with fewer stops for the owner's yes. It asks one question before the work starts, in place of the interview. It asks one question when the result is ready, where the full path asks three.

Every rule of this skill that the six steps do not change applies to a small work item as it is written. Stops 4 and 5 of "When to stop for the owner's yes" stay: each merge into the default branch, and each deploy to an environment that other people use.

Use your judgment to decide from the owner's request whether the work item is small, before you create it. "Designing or Building after the requirements" above says when a work item needs Designing. The owner's words win over your decision.

1. Create the work item, as `references/refining-requirements.md`, steps 1 and 2, say. Then write what the interview would have written:
   - the goal, in the Overview;
   - for each requirement, its Goal, at least one line of Functional Requirements, and at least one line of Acceptance Criteria that a tester could check;
   - one phase, with its tasks.
2. Play the request back to the owner in one reply. This reply takes the place of steps 3 to 11 of `references/refining-requirements.md`.
   - Say the goal in one or two sentences, what you will hand over, and how you will check it.
   - Name anything you are unsure of.
   - Name the project phase that the work item goes under. When the project has no phases yet, name the phases that you propose, as "Phases" above says.
   - Say "This is small, so I will skip the interview and ask you one question at the end."
   - End the reply with exactly "Is that right?"

   Add that question as a Questions and Answers row, and set `waiting_on` to the owner, before the reply ends.
3. Record the owner's answer in that row, with the owner's words and the date.
   - After a yes, set `requirements_approved` to `YYYY-MM-DD by <name>`, add the Recent History row "Small item: short path.", and move the work item to Building. The yes approves the requirements and the project phase, as the reply gave them.
   - After a correction, change the work item, and play the request back again in the same form.
4. Build the tasks, as `references/building.md` says. When every task is done, move the work item to the Testing Loop.
5. Check the result, as `references/testing-loop.md`, section "A small work item", says. That section says when the separate checker runs, and what takes its place when it does not run.
6. Ask one closing question, and close the work item after the owner's yes, as `references/closing.md`, section "Closing a small work item", says. That section gives the exact question. The owner's yes approves the result, and it is also the yes to mark the work item Done.

When the owner changes or adds a requirement and the work item is still small, record the change as `references/refining-requirements.md`, step 7, says. In place of the approval question of that step, and of the requirements analyst helper that the full path starts after such a change, play the change back in the form of step 2.

A work item on the short path stops being small when the work turns out to need what the short path leaves out: an interview to settle the requirements, Designing, or sub-items. Then move it to the full path:

- Tell the owner in one line.
- Add the Recent History row "Short path ended: full path from <State>.", with the State that the work item is in when it leaves the short path.
- Set `delivery` to `not-offered`, unless a Questions and Answers row whose Affects column says `delivery` holds the owner's answer.
- Continue with the file for that State. A work item that needs a design moves to Designing, also from Building. The owner's approval of the requirements still counts.

## Rules that apply in every State

These rules apply every time you work on a work item, in every State.

### Read the work item before you act

Read the work item again with `references/work-tracker.md` before you act. When the owner changed the work item by hand, keep the owner's change.

The one exception is a State and a Status that no longer match the table in "Status and State". Tell the owner in one line, ask which State the work item is in, with your recommendation, and then set both.

### Save after each step

Save after each step, and not at the end.

- When a save fails, start the reply with "Not saved".
- When a save worked but reads back differently, start the reply with "Saved but not verified" and say what differs.

### Keep the whole work item true

While you work on a work item, keep the whole work item true, and not only its Current state. A work item's Current state is the five lines at the top of the work item that say where it stands. Keep these true as well: the status of each task and who does it, the status of each of the work item's phases, and every field you have information for.

- Save the owner's requirements and corrections before you go on. Save them in the work item, or in the work item's design when they change the design.
- When the work item waits on the owner, write Next action in the form that the work item template, `assets/work-item-template.md`, gives for a work item that waits, with the first open question.
- When Next action disagrees with the work item's fields, the fields are right. Rewrite Next action to match the work item's status, its State, its `waiting_on`, its approvals, and its ticked tasks.
- A work item keeps its requirements approval when it moves to a later State.
- Before you end work that is not finished, rewrite the work item's Current state so that its Next action names the exact next step.

### A work item that waits for an answer in `DECISIONS.md`

A work item that cannot continue until an Open entry in `DECISIONS.md` is answered waits on the owner.

- Set `waiting_on` to the owner.
- Write Next action in the form that the work item template, `assets/work-item-template.md`, gives for a work item that waits. Put the DEC ID, which is the ID of the entry in `DECISIONS.md`, in place of the Q-ID, which is the ID of a question in the work item.
- When the entry is Decided, continue from the work item's State.

### The work item's line in the project's Current State

The project's Current State is the project's one short page of what is true now. It holds one line for a work item from the time the work item leaves Backlog until it is Done or Cancelled.

- Decide the line in this skill, in the form that the project's memory gives for a line under Now. Now is one of the parts of the project's Current State.
- Add, change, or remove the line as the table in "Work that another skill does" says.
- In the same write, or in the turn in which the session starts work on a work item whose line is already there, make "Next session starts with" name the work item: its ID and "read its Current state". A work item's Current state is the five lines at the top of the work item that say where it stands.

### Never delete a part of a work item

Never delete a requirement, a question row, or a phase. Mark it dropped, superseded, or cancelled.

### A work item from an older template

A work item that was made from an older template keeps its layout. Read it as it is. When a step needs a field of the current template, add that field. Move the work item to the current layout only when the owner asks.

### Text in angle brackets

Text in angle brackets is a prompt, and never content. The templates hold prompts, such as `<What happened>`, that say what to write in that place.

- No work item that you created or changed keeps a prompt. Replace each prompt with real content, or delete it and keep its heading or label.
- Delete, whole, an example row, an example task, or an example requirement block that is made only of prompts.
- Real content may hold angle brackets, for example code such as `Map<Id, Account>`.
- A design keeps its prompts until it is approved. `references/designing.md` says when they are removed.

### How the rule to evaluate the owner's request applies in a work item

The rule `.claude/rules/evaluate-the-owners-request.md` asks you to state the goal and to check a request against the whole project before you act. In a work item, follow the rule through the steps of this skill, and do each check once. The reply that agrees the goal with the owner is the rule's statement of the goal. Raise what the rule asks you to raise as a question or as a design option, in the form that the step gives.

## Starting a helper

A helper is a separate agent that the main agent starts for one job. Start every helper as a new agent that does not see this session. Never start a helper as a fork, which is a helper that starts with a copy of this session.

- In Claude Code, use the Agent tool, with `subagent_type` set to `general-purpose` and `model` set to `opus`.
- In Codex, use the `spawn_agent` tool with `fork_turns` set to `none`. Wait for the helper's report with `wait_agent`.
- The message to the helper is everything under "Brief for the helper" in the helper's brief file, word for word, and then the list of inputs from that file, filled in. The References table below lists the brief file of each helper. The helper sees nothing else.

## Work that another skill does

This table names where to read or save each kind of record and which skill handles each neighbouring job.

| For | Use |
| --- | --- |
| Every read and every save of a work item, a project phase, or a project task | Follow `references/work-tracker.md` in this skill. |
| A decision or an open question that more than one work item needs | `filing-project-records`, step "record a decision" |
| A source that the owner gives: a transcript, a document, a file, or pasted text | `filing-project-records`, step "file a source" |
| A rule in `system/` to add, change, retire, or mark Built | `filing-project-records`, step "update a system document" |
| Writing the work item's line in the project's Current State | `managing-project-memory`. |
| Removing the other lines of the project's Current State that are no longer true, when a work item closes; a date or a deadline; a lesson to keep or to search for; an instruction for how the agent works | `managing-project-memory`. |
| Merging a pull request | `merge-and-clean-up` |
| Committing a change to documents only | `publish-docs` |
| A Salesforce platform question | Salesforce's skills |
| Salesforce: updating the component tracker | `sf-component-tracker` |
| Salesforce: checking a deploy to a shared org | `sf-deploy-check` |
| Salesforce: a production data change | `sf-data-change` |
| Pull request text, and Salesforce release notes that go to a client | `humanizer`, as the root `AGENTS.md`, "Text that goes to another person", says |

## References

| File | Open it when |
| --- | --- |
| [references/refining-requirements.md](refining-requirements.md) | The work item is in Refining Requirements, or a requirement changes in any State. |
| [references/designing.md](designing.md) | The work item is in Designing. |
| [references/building.md](building.md) | The work item is in Building, or the owner wants a team of helper agents. |
| [references/testing-loop.md](testing-loop.md) | The work item is in the Testing Loop. |
| [references/closing.md](closing.md) | The work item is in Reflecting, is being marked Done or Cancelled, or was closed by the owner by hand. |
| [references/deploying.md](deploying.md) | The work item is in Deploying. |
| [references/salesforce-deploying.md](salesforce-deploying.md) | You deploy in a Salesforce project. |
| [references/requirements-analyst-brief.md](requirements-analyst-brief.md) | You start the helper that checks that the requirements are complete. |
| [references/researcher-brief.md](researcher-brief.md) | You start a helper to look up a fact for planning or design. |
| [references/design-architect-brief.md](design-architect-brief.md) | You start a helper to write one design option. |
| [references/design-critic-brief.md](design-critic-brief.md) | You start a helper to check a design against every requirement. |
| [references/builder-brief.md](builder-brief.md) | You start a helper to build one sub-item. |
| [references/acceptance-checker-brief.md](acceptance-checker-brief.md) | You start the separate checker in the Testing Loop. |
| [assets/work-item-template.md](../assets/work-item-template.md) | You create a work item, or check what a field or a section should hold. |
| [assets/design-template.md](../assets/design-template.md) | You start a design. |

```
After:
```text
# Running a work item's lifecycle

Use this reference to take one work item from an idea to Done. The goal is that the work item always says truly where the work stands, and that no step that needs the owner's yes happens without it.

This reference says what each State means, how work is divided into levels, what to do in each State, and when to stop for the owner's yes. Two neighbouring jobs belong to other skills:

- **Reading and saving a work item.** For every read and every save, use the installed `references/work-tracker.md`, which says where this project keeps its work items.
- **Writing `DECISIONS.md`, `system/`, or `sources/`.** `filing-project-records` writes those three places. Never write those three places with this skill. Write the ID of one of their records into a work item only when `filing-project-records` has filed the record and given you the ID. The root `AGENTS.md`, section "Where information goes", gives the test for what belongs in those three places.
  - When a work item must follow a rule or a decision that already exists, give the ID of the rule or decision and the work item to `filing-project-records`. It writes the ID into the work item.

## Contents

- Status and State
- Levels
- When to stop for the owner's yes
- A small work item
- Rules that apply in every State
- Starting a helper
- Work that another skill does
- References

## Status and State

Every work item has a Status and a State. The State says where the work is. The Status follows from the State, so set the State and set the Status with it.

| Status | State | Open this file | Move on when |
| --- | --- | --- | --- |
| Not Started | Backlog | none (see "Backlog" below) | the owner asks to start it |
| Preparing | Refining Requirements | `references/refining-requirements.md` | the owner approves the requirements |
| In Progress | Designing | `references/designing.md` | the owner picks a design |
| In Progress | Building | `references/building.md` | every task is done, with proof |
| In Progress | Testing Loop | `references/testing-loop.md` | a separate checker passes it and the owner approves the result |
| In Progress | Reflecting | `references/closing.md` | the checklist in that file is done |
| In Progress | Deploying | `references/deploying.md` | it is merged and deployed |
| Blocked | Blocked | none (see "Blocked" below) | the blocker is cleared |
| Done | Done | none | |
| Cancelled | Cancelled | none | |

A work item moves to the next State only when "Move on when" is true for the State it is in. After Deploying, continue with `references/closing.md`, section "Marking Done".

The checker in the Testing Loop row is the separate agent that tests the finished result.

### Backlog

A work item stays in Backlog until the owner asks to start it.

- Add the idea in the owner's words, as the Original verbatim requirement of Requirement 1.
- Do not start the interview until the owner asks to start the work item. The interview is the set of questions that Refining Requirements asks the owner, one at a time.
- Write a Next action that names the first step for when the owner starts the work item, for example "Agent: when the owner starts this work item, agree its goal with the owner."

### Designing or Building after the requirements

Any work item can go through Designing, even a bug. When you ask the owner to approve the requirements, recommend the next State:

- Recommend Designing when two ways to build the work item differ in what the owner would see, pay for, or have to maintain, or when a mistake in the change would be costly to undo.
- Otherwise, recommend Building.

### A work item that has sub-items

A sub-item is a work item inside another work item, which is its parent. A parent work item stays in Building until every one of its sub-items is Done or Cancelled. Then the parent goes through the Testing Loop as a whole.

### Blocked

- A work item is Blocked when it is stuck on something outside the work, such as missing access, another team, or a piece that must be finished first.
- A work item that waits for the owner's answer is not Blocked.
- Set `waiting_on` to who can clear the blocker.
- When the blocker is cleared, return the work item to the State that its Blockers line names.

### Done and Cancelled

Set a work item to Done or Cancelled only when the owner says so, and only through `references/closing.md`, which gives the steps for closing a work item. A work item that the owner closed by hand goes through that file too.

## Levels

Every project divides its work into the same four levels, wherever it keeps its work items. A top-level work item is a work item with no parent, and a sub-item is a work item inside another work item. `references/work-tracker.md` says where each part is saved.

| Level | Its phases | What it holds |
| --- | --- | --- |
| The project | Project phases `P01`, `P02`, and so on. They are the project's roadmap. | Its top-level work items, each under exactly one project phase. Its project tasks, in one plain list with no phases. |
| Top-level work item (level 1) | Its own phases `P1`, `P2`, and so on. They are the work item's roadmap. It has at least one phase, even when it is small. | Its tasks and its level-2 sub-items, each under one of its phases. |
| Level-2 sub-item | None | One plain task list, and its level-3 sub-items. |
| Level-3 sub-item | None | One plain task list. |

- Never add a fourth level. Make the work a task instead.
- No ID is ever reused. This rule holds for the ID of a work item, a phase, a task, a requirement, and a question.
- When it is unclear whether something is a project task, a new work item, a sub-item, or a task in a work item, ask the owner one short question with your recommendation. Save nothing until the owner answers.

### Phases

A project phase (`P01`) and a work item's phase (`P1`) are different things. A project phase groups top-level work items. A work item's phase groups that work item's tasks and its level-2 sub-items. A phase is never a work item.

- A top-level work item gets its own phases in Refining Requirements.
- A top-level work item goes under a project phase when the owner places it, and at the latest when it leaves Backlog. When the owner has named no project phase by then, ask which one, with your recommendation.
- The project's phases change only with the owner's yes. Propose new project phases, or a change to them, as one question, with a one-line reason for each new phase and for each change.
- When a project has no phases yet, propose them the first time a work item leaves Backlog.
- When the first work item of a project phase leaves Backlog, set that project phase In Progress.
- When the last open work item in a project phase becomes Done or Cancelled, ask the owner in your next reply whether the project phase is Done.
- A project whose owner has no planned order of work has one project phase, `P01 — Ongoing support`. A project that handles a client's requests as they come in is an example.
  - Propose that phase when the project has no phases yet.
  - While it is the project's only phase, put every top-level work item under it without asking the owner which phase.
  - Never ask whether it is Done. It stays In Progress until the owner says that the support has ended.

### Tasks

- Every task belongs to exactly one place: the project, or one work item.
- A task in a work item is a step toward that work item's goal. Triage work outside the approved goal as a separate Backlog work item. When a defect prevents the approved user flow from working, record the defect and the fix needed to meet the approved requirements in this item. If the fix changes those requirements or an owner decision, get the required approval through Refining Requirements before building it.
- A task ID has one of three forms:
  - `P1-T01` in a top-level work item: the work item's phase, then the task's number.
  - `T01` in a sub-item.
  - `PT-01` for a project task.

### Project tasks

A project task is an administrative task that belongs to no work item. These two things are also project tasks:

- a to-do that the owner names or asks you to keep, such as "we need to prepare for Wednesday's call";
- an action item from a meeting or a message that belongs to no work item.

Save a project task in the turn it comes up, with no question to the owner. Fill its lines as follows:

- Its Who does it is `owner`, `agent`, or the name of the other person who owes it, with the party, such as `Sarah Chen (client)` or `DataBridge (vendor)`.
- Its Work line says what is owed and to whom.
- Its Done when holds the date it is due, when a date was named.
- When the project task comes from a source that the owner gave, such as a transcript, file that source first, with no question to the owner. Use `filing-project-records`, step "file a source". Then name the source's SRC ID in the Work line.

Work a project task the way you work a task in a work item: set it In Progress before you start it, and tick it only when its Done when check is met.

Whenever you report what waits on the owner or what other people owe, name each open project task with who does it.

## When to stop for the owner's yes

Stop and ask the owner before each of these six steps. Record the owner's authorization and what it covers. An explicit instruction or an earlier approval for the same scope counts; ask only for an approval that is still missing. Authorization for one step does not authorize another step or a changed result.

1. Approving the requirements, at the end of Refining Requirements.
2. Choosing the design, at the end of Designing.
3. Approving the finished result, at the end of the Testing Loop, after the separate checker has tested it.
4. Each merge into the default branch, in Deploying.
   - A merge that the owner's standing merge instruction in `.claude/rules/owner-preferences.md` covers needs no new yes from the owner. `references/deploying.md`, section "What a merge into the default branch needs", says when the instruction covers a merge.
   - A merge that a helper makes into the work item's own branch needs no yes from the owner. "Starting a helper" below says what a helper is.
5. Each deploy to an environment that other people use, such as a test or staging environment. A production deploy is the owner's to run.
   - A deploy that a rule of the project allows without a question needs no new yes from the owner.
6. Marking the work item Done.

A small work item has fewer stops. "A small work item" below says which stops stay.

## A small work item

A small work item is a top-level work item whose whole job you can play back to the owner in one reply, and that you can build and check without an interview, without Designing, and without sub-items. Adding one line to an email template is an example of a small work item. Making one list of records for the owner to load is another.

A small work item takes the short path, unless the owner asks for the full process. The short path is the six steps below. The full path is the process that this skill gives for every other work item.

The goal of the short path is to take a small work item to Done with fewer stops for the owner's yes. It asks one question before the work starts, in place of the interview. It asks one question when the result is ready, where the full path asks three.

Every rule of this skill that the six steps do not change applies to a small work item as it is written. Stops 4 and 5 of "When to stop for the owner's yes" stay: each merge into the default branch, and each deploy to an environment that other people use.

Use your judgment to decide from the owner's request whether the work item is small, before you create it. "Designing or Building after the requirements" above says when a work item needs Designing. The owner's words win over your decision.

1. Create the work item, as `references/refining-requirements.md`, steps 1 and 2, say. Then write what the interview would have written:
   - the goal, in the Overview;
   - for each requirement, its Goal, at least one line of Functional Requirements, and at least one line of Acceptance Criteria that a tester could check;
   - one phase, with its tasks.
2. Play the request back to the owner in one reply. This reply takes the place of steps 3 to 11 of `references/refining-requirements.md`.
   - Say the goal in one or two sentences, what you will hand over, and how you will check it.
   - Name anything you are unsure of.
   - Name the project phase that the work item goes under. When the project has no phases yet, name the phases that you propose, as "Phases" above says.
   - Say "This is small, so I will skip the interview and ask you one question at the end."
   - End the reply with exactly "Is that right?"

   Add that question as a Questions and Answers row, and set `waiting_on` to the owner, before the reply ends.
3. Record the owner's answer in that row, with the owner's words and the date.
   - After a yes, set `requirements_approved` to `YYYY-MM-DD by <name>`, add the Recent History row "Small item: short path.", and move the work item to Building. The yes approves the requirements and the project phase, as the reply gave them.
   - After a correction, change the work item, and play the request back again in the same form.
4. Build the tasks, as `references/building.md` says. When every task is done, move the work item to the Testing Loop.
5. Check the result, as `references/testing-loop.md`, section "A small work item", says. That section says when the separate checker runs, and what takes its place when it does not run.
6. Ask one closing question, and close the work item after the owner's yes, as `references/closing.md`, section "Closing a small work item", says. That section gives the exact question. The owner's yes approves the result, and it is also the yes to mark the work item Done.

When the owner changes or adds a requirement and the work item is still small, record the change as `references/refining-requirements.md`, step 7, says. In place of the approval question of that step, and of the requirements analyst helper that the full path starts after such a change, play the change back in the form of step 2.

A work item on the short path stops being small when the work turns out to need what the short path leaves out: an interview to settle the requirements, Designing, or sub-items. Then move it to the full path:

- Tell the owner in one line.
- Add the Recent History row "Short path ended: full path from <State>.", with the State that the work item is in when it leaves the short path.
- Set `delivery` to `not-offered`, unless a Questions and Answers row whose Affects column says `delivery` holds the owner's answer.
- Continue with the file for that State. A work item that needs a design moves to Designing, also from Building. The owner's approval of the requirements still counts.

## Rules that apply in every State

These rules apply every time you work on a work item, in every State.

### Read the work item before you act

Read the work item again with `references/work-tracker.md` before you act. When the owner changed the work item by hand, keep the owner's change.

The one exception is a State and a Status that no longer match the table in "Status and State". Tell the owner in one line, ask which State the work item is in, with your recommendation, and then set both.

### Save after each step

Save after each step, and not at the end.

- When a save fails, start the reply with "Not saved".
- When a save worked but reads back differently, start the reply with "Saved but not verified" and say what differs.

### Keep the whole work item true

While you work on a work item, keep the whole work item true, and not only its Current state. A work item's Current state is the five lines at the top of the work item that say where it stands. Keep these true as well: the status of each task and who does it, the status of each of the work item's phases, and every field you have information for.

- Save the owner's requirements and corrections before you go on. Save them in the work item, or in the work item's design when they change the design.
- When the work item waits on the owner, write Next action in the form that the work item template, `assets/work-item-template.md`, gives for a work item that waits, with the first open question.
- When Next action disagrees with the work item's fields, the fields are right. Rewrite Next action to match the work item's status, its State, its `waiting_on`, its approvals, and its ticked tasks.
- A work item keeps its requirements approval when it moves to a later State.
- Before you end work that is not finished, rewrite the work item's Current state so that its Next action names the exact next step.

### A work item that waits for an answer in `DECISIONS.md`

A work item that cannot continue until an Open entry in `DECISIONS.md` is answered waits on the owner.

- Set `waiting_on` to the owner.
- Write Next action in the form that the work item template, `assets/work-item-template.md`, gives for a work item that waits. Put the DEC ID, which is the ID of the entry in `DECISIONS.md`, in place of the Q-ID, which is the ID of a question in the work item.
- When the entry is Decided, continue from the work item's State.

### The work item's line in the project's Current State

This section applies to local or Notion memory. The project's Current State holds one line for an active work item. With Hindsight, keep active work and next actions in the selected tracker instead; follow `.claude/rules/hindsight-memory.md` for lasting knowledge, and create no Current State page.

- Decide the line in this skill, in the form that the project's memory gives for a line under Now. Now is one of the parts of the project's Current State.
- Add, change, or remove the line as the table in "Work that another skill does" says.
- In the same write, or in the turn in which the session starts work on a work item whose line is already there, make "Next session starts with" name the work item: its ID and "read its Current state". A work item's Current state is the five lines at the top of the work item that say where it stands.

### Never delete a part of a work item

Never delete a requirement, a question row, or a phase. Mark it dropped, superseded, or cancelled.

### A work item from an older template

A work item that was made from an older template keeps its layout. Read it as it is. When a step needs a field of the current template, add that field. Move the work item to the current layout only when the owner asks.

### Text in angle brackets

Text in angle brackets is a prompt, and never content. The templates hold prompts, such as `<What happened>`, that say what to write in that place.

- No work item that you created or changed keeps a prompt. Replace each prompt with real content, or delete it and keep its heading or label.
- Delete, whole, an example row, an example task, or an example requirement block that is made only of prompts.
- Real content may hold angle brackets, for example code such as `Map<Id, Account>`.
- A design keeps its prompts until it is approved. `references/designing.md` says when they are removed.

### How the rule to evaluate the owner's request applies in a work item

The rule `.claude/rules/evaluate-the-owners-request.md` asks you to state the goal and to check a request against the whole project before you act. In a work item, follow the rule through the steps of this skill, and do each check once. The reply that agrees the goal with the owner is the rule's statement of the goal. Raise what the rule asks you to raise as a question or as a design option, in the form that the step gives.

## Starting a helper

A helper is a separate agent that the main agent starts for one job. Start every helper as a new agent that does not see this session. Never start a helper as a fork, which is a helper that starts with a copy of this session.

- In Claude Code, use the Agent tool, with `subagent_type` set to `general-purpose` and `model` set to `opus`.
- In Codex, use the `spawn_agent` tool with `fork_turns` set to `none`. Wait for the helper's report with `wait_agent`.
- The message to the helper is everything under "Brief for the helper" in the helper's brief file, word for word, and then the list of inputs from that file, filled in. The References table below lists the brief file of each helper. The helper sees nothing else.

## Work that another skill does

This table names where to read or save each kind of record and which skill handles each neighbouring job.

| For | Use |
| --- | --- |
| Every read and every save of a work item, a project phase, or a project task | Follow `references/work-tracker.md` in this skill. |
| A decision or an open question that more than one work item needs | `filing-project-records`, step "record a decision" |
| A source that the owner gives: a transcript, a document, a file, or pasted text | `filing-project-records`, step "file a source" |
| A rule in `system/` to add, change, retire, or mark Built | `filing-project-records`, step "update a system document" |
| Writing the work item's line in the project's Current State | `managing-project-memory`. |
| Removing the other lines of the project's Current State that are no longer true, when a work item closes; a date or a deadline; a lesson to keep or to search for; an instruction for how the agent works | `managing-project-memory`. |
| Merging a pull request | `merge-and-clean-up` |
| Committing a change to documents only | `publish-docs` |
| A Salesforce platform question | Salesforce's skills |
| Salesforce: updating the component tracker | `sf-component-tracker` |
| Salesforce: checking a deploy to a shared org | `sf-deploy-check` |
| Salesforce: a production data change | `sf-data-change` |
| Pull request text, and Salesforce release notes that go to a client | `humanizer`, as the root `AGENTS.md`, "Text that goes to another person", says |

## References

| File | Open it when |
| --- | --- |
| [references/refining-requirements.md](refining-requirements.md) | The work item is in Refining Requirements, or a requirement changes in any State. |
| [references/designing.md](designing.md) | The work item is in Designing. |
| [references/building.md](building.md) | The work item is in Building, or the owner wants a team of helper agents. |
| [references/testing-loop.md](testing-loop.md) | The work item is in the Testing Loop. |
| [references/closing.md](closing.md) | The work item is in Reflecting, is being marked Done or Cancelled, or was closed by the owner by hand. |
| [references/deploying.md](deploying.md) | The work item is in Deploying. |
| [references/salesforce-deploying.md](salesforce-deploying.md) | You deploy in a Salesforce project. |
| [references/requirements-analyst-brief.md](requirements-analyst-brief.md) | You start the helper that checks that the requirements are complete. |
| [references/researcher-brief.md](researcher-brief.md) | You start a helper to look up a fact for planning or design. |
| [references/design-architect-brief.md](design-architect-brief.md) | You start a helper to write one design option. |
| [references/design-critic-brief.md](design-critic-brief.md) | You start a helper to check a design against every requirement. |
| [references/builder-brief.md](builder-brief.md) | You start a helper to build one sub-item. |
| [references/acceptance-checker-brief.md](acceptance-checker-brief.md) | You start the separate checker in the Testing Loop. |
| [assets/work-item-template.md](../assets/work-item-template.md) | You create a work item, or check what a field or a section should hold. |
| [assets/design-template.md](../assets/design-template.md) | You start a design. |

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/closing.md

Before:
```text
# Closing

Use this file to take a work item through Reflecting after the owner approved its result, and to close a work item as Done or Cancelled. The job is done when the work item is closed and its Moved up line says what the work item added or changed in `DECISIONS.md` and `system/`.

Fill the Moved up line at every close: when you mark a work item Done, when you cancel it, and when the owner closed it by hand. The section "Filling the Moved up line" gives the steps. Never set a work item to Done or Cancelled while its Moved up line is empty.

## Contents

- Reflecting
- Filling the Moved up line
- Marking Done
- Closing a small work item
- Cancelling a work item
- Done or Cancelled by hand
- Leftover branches and worktrees
- When one message answers several questions

## Reflecting

Reflecting is the State after the owner approved the result and before anything is merged. Go through this checklist in order.

1. Check that the work item is complete and up to date. All four of these must be true:
   - Every task is ticked or cancelled, and every phase that the work item completed says Done.
   - No Questions and Answers row is left Open.
   - Every sub-item is Done or Cancelled, or was moved to another work item.
   - The work item's Current state matches its State, its `waiting_on`, and its approvals.
2. Check that the requirements match what was built. Compare each approved requirement with the checker's verdicts in Recent History. When the build changed a requirement, treat the changed requirement as a change to a requirement. `refining-requirements.md`, step 7, gives the steps for a change to a requirement.
3. Write down the lessons. Under Notes, "Lessons not proven yet", add each thing that the build, the tests, or a deployment taught, and that a later work item would otherwise find out again. Write the date it was seen with each one.
4. Check that `PROJECT.md` and the READMEs are still true. Change one of them only when the work item made what it says out of date.
   - Commit the change with `publish-docs`, and name the file and the commit in a Recent History row.
   - Save a change to the project's phases with `references/work-tracker.md`.

After the checklist, do one of these:

- When the work item has something to merge or deploy, move it to Deploying.
- When the work item has nothing to merge or deploy, for example research, a decision, or a document, add the Recent History row "Nothing to merge or deploy: Deploying skipped." Then go to "Marking Done".

## Filling the Moved up line

The Moved up line is a line in the work item's Overview. It answers one question: did this work item change `system/` or `DECISIONS.md`? Do these six steps at every close.

1. List what the whole project may need to keep. Read the work item's Questions and Answers rows marked Decision? `yes`, its design, its Related items line, and its Notes, "Lessons not proven yet". Put these five kinds of thing on the list:
   - Each decision that more than one work item needs, and whose row does not end "Filed as DEC-###". The root `AGENTS.md`, section "Where information goes", gives the test for whether more than one work item needs a decision.
   - Each rule that several work items rely on, that this work item added, changed, or retired, and that `system/` does not show yet.
   - Each rule that this work item may have built. Such a rule is one whose behaviour a requirement of this work item built or changed. It is either a rule already on this list, or a rule that `system/` holds with the mark Approved. The mark is the word on a rule in `system/` that says whether the rule is Draft, Approved, Built, or Retired.
     - A work item that only names, explains, or documents a rule did not build what the rule says.
     - A cancelled work item did not build what any rule says.
     - `filing-project-records`, step "update a system document", holds the conditions for when a work item built what a rule says, and it checks them.
   - Each project term that this work item added or changed, and that `system/glossary.md` does not show yet.
   - Each lesson that has no outcome at the end of its line. Step 5 gives the four outcomes. Before you list a lesson, search memory for the same lesson with `managing-project-memory`. When the lesson was seen before, in another work item or another session, list it with the dates it was seen.
2. When the list holds a decision, a rule to add, change, or retire, a project term, or a lesson, ask the owner once. When the list holds only rules that the work item may have built, or holds nothing, ask no question.
   - Add one Questions and Answers row that shows each line of the list with your recommendation and a one-line reason.
   - For a lesson, the owner chooses one of three: keep it for the whole project, keep it as not proven, or drop it. Recommend keeping a lesson for the whole project when it was seen before.
   - Set `waiting_on` to the owner, and end the reply with exactly "Do these move up as listed?" In that question, "move up" means that the owner agrees to keep the thing for the whole project.
3. File what the owner agreed to. This table says what to do with each thing.

   | What it is | What to do |
   | --- | --- |
   | A decision or an open question | `filing-project-records`, step "record a decision" |
   | A rule to add, change, or retire | `filing-project-records`, step "update a system document" |
   | A rule that this work item may have built | `filing-project-records`, step "update a system document". That step checks the conditions and, when they are met, sets the rule's mark to Built, with this work item's ID. |
   | A project term | `filing-project-records`, step "update a system document" |
   | A lesson that the owner agreed to keep for the whole project, and that is about the system or the project | `filing-project-records`, step "record a decision" |
   | A lesson that the owner agreed to keep for the whole project, and that is about how to do a step, such as a deploy, a data load, or a test, or about how the agent works | Give the lesson to `managing-project-memory`, which writes the line in `.claude/rules/owner-preferences.md`. |
   | A lesson that is kept as not proven | Give the lesson to `managing-project-memory`, with the work item's ID and the dates it was seen. |

4. Do this step only when work items are local files: check that the main checkout holds each save. The main checkout is the project's main folder, which is the first path that `git worktree list` prints. With each ID, `filing-project-records` reports whether the main checkout holds the save of that record. Steps 5 and 6 write those IDs into the work item. A local work item is kept in the main checkout, so the record that it names must be there.
   - When the main checkout does not hold a save, stop here, and tell the owner what `filing-project-records` reported. `filing-project-records` records in the project's Current State that the ID is still to be written in the work item.
   - When the main checkout holds the save, continue from this step.
5. Write each lesson's outcome at the end of its line. The outcome is one of these four, with the real ID in place of the example:
   - "Moved up: DEC-021."
   - "Moved up: owner-preferences.md."
   - "Kept in memory."
   - "Dropped (Q-12)."
6. Fill the Moved up line.
   - Name every entry in `DECISIONS.md` and every rule in `system/` that this work item added or changed. Name each one by its ID, and say what happened to it.
   - Name every project term in `system/glossary.md` that this work item added or changed, by the term.
   - Include the entries and rules that were filed before this step. The Questions and Answers rows of those entries end "Filed as DEC-###".
   - When there are none, write "Nothing: <the reason>."
   - Add a Recent History row that names the Q-ID of the question from step 2, or says that no question was needed.

## Marking Done

Use this section after Deploying, or after Reflecting when the work item has nothing to merge or deploy.

For a small work item on the short path, read "Closing a small work item" below, step 3, first. That step says which questions the owner has already answered.

1. Check three things: that every change is merged, or the owner said to leave it on its branch; that the result of each deploy is recorded; and that every Roadmap phase that the work item completed says Done.
2. Fill the Moved up line, as the section above says.
3. Ask the owner. Add the Questions and Answers row for the question, with the Next action "Waiting on the owner: Q-12 (mark WI-031 Done). After his answer: record Done." Put the evidence in one line first: the checker's verdict and commit, the merged pull request, the deploy result, and the Moved up line. End the reply with "Mark WI-031 Done?" Use the real Q-ID and work item ID in both.
4. After the owner's yes, save the owner's words first. Then set the State to Done and `waiting_on` to `none`, and rewrite the work item's Current state. Write these four of its lines as follows:
   - Where it stands: "Done on `YYYY-MM-DD`: <evidence>."
   - Next action: "None. Finished."
   - Waiting on: "Nothing."
   - Blockers: "None."
5. Update the project's Current State, which is the project's one short page of what is true now. `references/lifecycle-rules.md`, section "Work that another skill does", names the skill for each of these writes.
   - Remove the work item's line under Now.
   - Ask `managing-project-memory` to remove the rest: each line under "Coming up" or "Waiting on" that is about this work item, and a "Next session starts with" line that names it. The reference file on the project's Current State in that skill, section "Removing what is no longer true", gives the steps.
   - For a top-level work item, check its project phase, as `references/lifecycle-rules.md`, section "Levels", says. That section says what to ask the owner when the last open work item in a project phase is closed.
6. After the owner's "no", record the owner's words, turn each problem into a task, and move the work item back to Building. After the fix, run the Testing Loop again and fill the Moved up line again, before you ask again.
7. Report to the owner whether the work reached the default branch, what was deployed, and what was kept for the whole project: what the Moved up line says, and each lesson whose outcome starts "Moved up:". End the report with what the section "Leftover branches and worktrees" below asks the owner. When that section leaves nothing to ask, end with "Tell me the next thing to build."

## Closing a small work item

Use this section for a small work item that takes the short path. `references/lifecycle-rules.md`, section "A small work item", says what a small work item is and gives the steps of the short path.

On the short path, one closing question takes the place of three questions of the full path: the result approval in `testing-loop.md`, step 7, the question in "Filling the Moved up line", step 2, and the question in "Marking Done", step 3. The work item stays in the Testing Loop until the owner answers the closing question, and it never enters Reflecting.

1. Before you ask, go through the checklist in "Reflecting", steps 1 to 4. Then list what the whole project may need to keep, as "Filling the Moved up line", step 1, says.
2. Ask the closing question. Add the Questions and Answers row "Approve this result and mark <ID> Done?", with the real ID, and set `waiting_on` to the owner. Show the result, as `testing-loop.md`, section "Showing the result", says, with these three differences:
   - When "Filling the Moved up line", step 2, would ask the owner a question, show the lines of that question under "To keep for the whole project", each with your recommendation and a one-line reason.
   - When a merge, a deploy, or a data load is still to come, say what it is and who runs it, and say that the owner's yes to the closing question does not cover it.
   - The last line of the reply is exactly "Approve this result and mark <ID> Done?"
3. After the owner's yes, do these four things in order:
   - Save the owner's words and the date in the row, and set `result_approved` to `YYYY-MM-DD by <name>`.
   - Add one answered Questions and Answers row for each line that you showed under "To keep for the whole project", because the yes also covers those lines. The row holds the line, your recommendation, and the owner's words.
   - When a merge, a deploy, or a data load is still to come, move the work item to Deploying, and follow `deploying.md`.
   - Follow "Marking Done". The owner's yes has already answered the question in "Filling the Moved up line", step 2, for the lines that you showed, and the question in "Marking Done", step 3. Do not ask those questions again. Where those steps name their question's Q-ID, name the Q-ID of the closing question.
4. After the owner's "no" or a change, record the owner's words in the row, add a task for each problem that the owner named, and move the work item back to Building. Continue with the short path from its step 4, in `references/lifecycle-rules.md`, section "A small work item", and ask the closing question in a new row. That section also says what to do when the work item stops being small.

## Cancelling a work item

Use this section when the owner cancels a work item.

1. Record the owner's reason, in the owner's words, as an answered Questions and Answers row.
2. Ask the owner about each open sub-item. The choices are to cancel it, to move it to the top level, or to move it under another work item.
3. Fill the Moved up line, as "Filling the Moved up line" says.
4. Set the State to Cancelled and `waiting_on` to `none`. Rewrite the work item's Current state. Write these two of its lines as follows:
   - Where it stands: "Cancelled on `YYYY-MM-DD`: <the owner's reason>."
   - Next action: "None. Cancelled."
5. Update the project's Current State, as step 5 of "Marking Done" says.
6. Leave the work item's open pull request, its branch, and its worktree as they are until the owner says what to do with them. Delete nothing. The offer in "Leftover branches and worktrees" covers only a merged branch, so it does not cover the unmerged branch of a cancelled work item.

## Done or Cancelled by hand

Use this section when the owner marked the work item Done or Cancelled without the agent. The owner's change counts. Never undo it.

1. Add the Recent History row "Marked Done by the owner by hand on `YYYY-MM-DD`". For a cancelled work item, write "Cancelled" in place of "Done".
2. Tell the owner in one line what had not happened yet: the result approval, the checker, the merge, or the filling of the Moved up line. Ask the owner what to do about it.
3. Fill the Moved up line, as "Filling the Moved up line" says. Fill the line whatever the owner says about the rest.
4. Rewrite the work item's Current state with the lines that "Marking Done", step 4, gives for Done, or that "Cancelling a work item", step 4, gives for Cancelled. Then update the project's Current State, as step 5 of "Marking Done" says.

## Leftover branches and worktrees

After a work item is Done or Cancelled, look for the branches and worktrees that are left from it. A worktree is a separate folder with its own branch.

1. Run `git worktree list` and `git branch --list '*wi-007*'`, with the work item's ID in lower case in place of `wi-007`.
2. For each branch or worktree that is left, check whether its commits reached the default branch, and whether its worktree has uncommitted changes.

Then do both of these:

- Offer to remove each branch or worktree that is merged and has no uncommitted changes, with a one-line reason.
  - Remove it only after the owner's yes: run `git -C <main checkout> worktree remove <folder>`, then `git branch -d <branch>`.
  - Never use `--force`.
  - Name each other branch or worktree to the owner, and leave it as it is.
- Run `git -C <main checkout> status`. It must show none of the work item's files uncommitted. When it shows one, name the files to the owner and ask what to do. Never commit, stash, or remove those files yourself.

## When one message answers several questions

When the owner's words name each question, one message from the owner may answer several questions. For example, one message may answer both the merge question and the question about marking the work item Done. Add one Questions and Answers row for each question, each with the owner's words.

```
After:
```text
# Closing

Use this file to take a work item through Reflecting after the owner approved its result, and to close a work item as Done or Cancelled. The job is done when the work item is closed and its Moved up line says what the work item added or changed in `DECISIONS.md` and `system/`.

Fill the Moved up line at every close: when you mark a work item Done, when you cancel it, and when the owner closed it by hand. The section "Filling the Moved up line" gives the steps. Never set a work item to Done or Cancelled while its Moved up line is empty.


Read the memory choice in `PROJECT.md`. For local or Notion memory, use `managing-project-memory` and the installed Current State page. For Hindsight, follow `.claude/rules/hindsight-memory.md` wherever these steps call for memory recall, review, saves, or corrections. Keep current work, blockers, and next actions in the selected tracker and project records; do not create a Current State page or treat its absence as a setup failure.

## Contents

- Reflecting
- Filling the Moved up line
- Marking Done
- Closing a small work item
- Cancelling a work item
- Done or Cancelled by hand
- Leftover branches and worktrees
- When one message answers several questions

## Reflecting

Reflecting is the State after the owner approved the result and before anything is merged. Go through this checklist in order.

1. Check that the work item is complete and up to date. All four of these must be true:
   - Every task is ticked or cancelled, and every phase that the work item completed says Done.
   - No Questions and Answers row is left Open.
   - Every sub-item is Done or Cancelled, or was moved to another work item.
   - The work item's Current state matches its State, its `waiting_on`, and its approvals.
2. Check that the requirements match what was built. Compare each approved requirement with the checker's verdicts in Recent History. When the build changed a requirement, treat the changed requirement as a change to a requirement. `refining-requirements.md`, step 7, gives the steps for a change to a requirement.
3. Write down the lessons. Under Notes, "Lessons not proven yet", add each thing that the build, the tests, or a deployment taught, and that a later work item would otherwise find out again. Write the date it was seen with each one.
4. Check that `PROJECT.md` and the READMEs are still true. Change one of them only when the work item made what it says out of date.
   - Commit the change with `publish-docs`, and name the file and the commit in a Recent History row.
   - Save a change to the project's phases with `references/work-tracker.md`.

After the checklist, do one of these:

- When the work item has something to merge or deploy, move it to Deploying.
- When the work item has nothing to merge or deploy, for example research, a decision, or a document, add the Recent History row "Nothing to merge or deploy: Deploying skipped." Then go to "Marking Done".

## Filling the Moved up line

The Moved up line is a line in the work item's Overview. It answers one question: did this work item change `system/` or `DECISIONS.md`? Do these six steps at every close.

1. List what the whole project may need to keep. Read the work item's Questions and Answers rows marked Decision? `yes`, its design, its Related items line, and its Notes, "Lessons not proven yet". Put these five kinds of thing on the list:
   - Each decision that more than one work item needs, and whose row does not end "Filed as DEC-###". The root `AGENTS.md`, section "Where information goes", gives the test for whether more than one work item needs a decision.
   - Each rule that several work items rely on, that this work item added, changed, or retired, and that `system/` does not show yet.
   - Each rule that this work item may have built. Such a rule is one whose behaviour a requirement of this work item built or changed. It is either a rule already on this list, or a rule that `system/` holds with the mark Approved. The mark is the word on a rule in `system/` that says whether the rule is Draft, Approved, Built, or Retired.
     - A work item that only names, explains, or documents a rule did not build what the rule says.
     - A cancelled work item did not build what any rule says.
     - `filing-project-records`, step "update a system document", holds the conditions for when a work item built what a rule says, and it checks them.
   - Each project term that this work item added or changed, and that `system/glossary.md` does not show yet.
   - Each lesson that has no outcome at the end of its line. Step 5 gives the four outcomes. Before you list a lesson, search memory for the same lesson with `managing-project-memory`. When the lesson was seen before, in another work item or another session, list it with the dates it was seen.
2. When the list holds a decision, a rule to add, change, or retire, a project term, or a lesson, ask the owner once. When the list holds only rules that the work item may have built, or holds nothing, ask no question.
   - Add one Questions and Answers row that shows each line of the list with your recommendation and a one-line reason.
   - For a lesson, the owner chooses one of three: keep it for the whole project, keep it as not proven, or drop it. Recommend keeping a lesson for the whole project when it was seen before.
   - Set `waiting_on` to the owner, and end the reply with exactly "Do these move up as listed?" In that question, "move up" means that the owner agrees to keep the thing for the whole project.
3. File what the owner agreed to. This table says what to do with each thing.

   | What it is | What to do |
   | --- | --- |
   | A decision or an open question | `filing-project-records`, step "record a decision" |
   | A rule to add, change, or retire | `filing-project-records`, step "update a system document" |
   | A rule that this work item may have built | `filing-project-records`, step "update a system document". That step checks the conditions and, when they are met, sets the rule's mark to Built, with this work item's ID. |
   | A project term | `filing-project-records`, step "update a system document" |
   | A lesson that the owner agreed to keep for the whole project, and that is about the system or the project | `filing-project-records`, step "record a decision" |
   | A lesson that the owner agreed to keep for the whole project, and that is about how to do a step, such as a deploy, a data load, or a test, or about how the agent works | Give the lesson to `managing-project-memory`, which writes the line in `.claude/rules/owner-preferences.md`. |
   | A lesson that is kept as not proven | Give the lesson to `managing-project-memory`, with the work item's ID and the dates it was seen. |

4. Do this step only when work items are local files: check that the main checkout holds each save. The main checkout is the project's main folder, which is the first path that `git worktree list` prints. With each ID, `filing-project-records` reports whether the main checkout holds the save of that record. Steps 5 and 6 write those IDs into the work item. A local work item is kept in the main checkout, so the record that it names must be there.
   - When the main checkout does not hold a save, stop here, and tell the owner what `filing-project-records` reported. `filing-project-records` records in the project's Current State that the ID is still to be written in the work item.
   - When the main checkout holds the save, continue from this step.
5. Write each lesson's outcome at the end of its line. The outcome is one of these four, with the real ID in place of the example:
   - "Moved up: DEC-021."
   - "Moved up: owner-preferences.md."
   - "Kept in memory."
   - "Dropped (Q-12)."
6. Fill the Moved up line.
   - Name every entry in `DECISIONS.md` and every rule in `system/` that this work item added or changed. Name each one by its ID, and say what happened to it.
   - Name every project term in `system/glossary.md` that this work item added or changed, by the term.
   - Include the entries and rules that were filed before this step. The Questions and Answers rows of those entries end "Filed as DEC-###".
   - When there are none, write "Nothing: <the reason>."
   - Add a Recent History row that names the Q-ID of the question from step 2, or says that no question was needed.

## Marking Done

Use this section after Deploying, or after Reflecting when the work item has nothing to merge or deploy.

For a small work item on the short path, read "Closing a small work item" below, step 3, first. That step says which questions the owner has already answered.

1. Check three things: that every change is merged, or the owner said to leave it on its branch; that the result of each deploy is recorded; and that every Roadmap phase that the work item completed says Done.
2. Fill the Moved up line, as the section above says.
3. Ask the owner. Add the Questions and Answers row for the question, with the Next action "Waiting on the owner: Q-12 (mark WI-031 Done). After his answer: record Done." Put the evidence in one line first: the checker's verdict and commit, the merged pull request, the deploy result, and the Moved up line. End the reply with "Mark WI-031 Done?" Use the real Q-ID and work item ID in both.
4. After the owner's yes, save the owner's words first. Then set the State to Done and `waiting_on` to `none`, and rewrite the work item's Current state. Write these four of its lines as follows:
   - Where it stands: "Done on `YYYY-MM-DD`: <evidence>."
   - Next action: "None. Finished."
   - Waiting on: "Nothing."
   - Blockers: "None."
5. With Hindsight, keep the closed item and any remaining follow-up current in the tracker, and review lasting knowledge under the Hindsight rule. With local or Notion memory, update the project's Current State, which is the project's one short page of what is true now. `references/lifecycle-rules.md`, section "Work that another skill does", names the skill for each of these writes.
   - Remove the work item's line under Now.
   - Ask `managing-project-memory` to remove the rest: each line under "Coming up" or "Waiting on" that is about this work item, and a "Next session starts with" line that names it. The reference file on the project's Current State in that skill, section "Removing what is no longer true", gives the steps.
   - For a top-level work item, check its project phase, as `references/lifecycle-rules.md`, section "Levels", says. That section says what to ask the owner when the last open work item in a project phase is closed.
6. After the owner's "no", record the owner's words, turn each problem into a task, and move the work item back to Building. After the fix, run the Testing Loop again and fill the Moved up line again, before you ask again.
7. Report to the owner whether the work reached the default branch, what was deployed, and what was kept for the whole project: what the Moved up line says, and each lesson whose outcome starts "Moved up:". End the report with what the section "Leftover branches and worktrees" below asks the owner. When that section leaves nothing to ask, end with "Tell me the next thing to build."

## Closing a small work item

Use this section for a small work item that takes the short path. `references/lifecycle-rules.md`, section "A small work item", says what a small work item is and gives the steps of the short path.

On the short path, one closing question takes the place of three questions of the full path: the result approval in `testing-loop.md`, step 7, the question in "Filling the Moved up line", step 2, and the question in "Marking Done", step 3. The work item stays in the Testing Loop until the owner answers the closing question, and it never enters Reflecting.

1. Before you ask, go through the checklist in "Reflecting", steps 1 to 4. Then list what the whole project may need to keep, as "Filling the Moved up line", step 1, says.
2. Ask the closing question. Add the Questions and Answers row "Approve this result and mark <ID> Done?", with the real ID, and set `waiting_on` to the owner. Show the result, as `testing-loop.md`, section "Showing the result", says, with these three differences:
   - When "Filling the Moved up line", step 2, would ask the owner a question, show the lines of that question under "To keep for the whole project", each with your recommendation and a one-line reason.
   - When a merge, a deploy, or a data load is still to come, say what it is and who runs it, and say that the owner's yes to the closing question does not cover it.
   - The last line of the reply is exactly "Approve this result and mark <ID> Done?"
3. After the owner's yes, do these four things in order:
   - Save the owner's words and the date in the row, and set `result_approved` to `YYYY-MM-DD by <name>`.
   - Add one answered Questions and Answers row for each line that you showed under "To keep for the whole project", because the yes also covers those lines. The row holds the line, your recommendation, and the owner's words.
   - When a merge, a deploy, or a data load is still to come, move the work item to Deploying, and follow `deploying.md`.
   - Follow "Marking Done". The owner's yes has already answered the question in "Filling the Moved up line", step 2, for the lines that you showed, and the question in "Marking Done", step 3. Do not ask those questions again. Where those steps name their question's Q-ID, name the Q-ID of the closing question.
4. After the owner's "no" or a change, record the owner's words in the row, add a task for each problem that the owner named, and move the work item back to Building. Continue with the short path from its step 4, in `references/lifecycle-rules.md`, section "A small work item", and ask the closing question in a new row. That section also says what to do when the work item stops being small.

## Cancelling a work item

Use this section when the owner cancels a work item.

1. Record the owner's reason, in the owner's words, as an answered Questions and Answers row.
2. Ask the owner about each open sub-item. The choices are to cancel it, to move it to the top level, or to move it under another work item.
3. Fill the Moved up line, as "Filling the Moved up line" says.
4. Set the State to Cancelled and `waiting_on` to `none`. Rewrite the work item's Current state. Write these two of its lines as follows:
   - Where it stands: "Cancelled on `YYYY-MM-DD`: <the owner's reason>."
   - Next action: "None. Cancelled."
5. With Hindsight, keep the closed item and any remaining follow-up current in the tracker, and review lasting knowledge under the Hindsight rule. With local or Notion memory, update the project's Current State, as step 5 of "Marking Done" says.
6. Leave the work item's open pull request, its branch, and its worktree as they are until the owner says what to do with them. Delete nothing. The offer in "Leftover branches and worktrees" covers only a merged branch, so it does not cover the unmerged branch of a cancelled work item.

## Done or Cancelled by hand

Use this section when the owner marked the work item Done or Cancelled without the agent. The owner's change counts. Never undo it.

1. Add the Recent History row "Marked Done by the owner by hand on `YYYY-MM-DD`". For a cancelled work item, write "Cancelled" in place of "Done".
2. Tell the owner in one line what had not happened yet: the result approval, the checker, the merge, or the filling of the Moved up line. Ask the owner what to do about it.
3. Fill the Moved up line, as "Filling the Moved up line" says. Fill the line whatever the owner says about the rest.
4. Rewrite the work item's Current state with the lines that "Marking Done", step 4, gives for Done, or that "Cancelling a work item", step 4, gives for Cancelled. Then update the project's Current State, as step 5 of "Marking Done" says.

## Leftover branches and worktrees

After a work item is Done or Cancelled, look for the branches and worktrees that are left from it. A worktree is a separate folder with its own branch.

1. Run `git worktree list` and `git branch --list '*wi-007*'`, with the work item's ID in lower case in place of `wi-007`.
2. For each branch or worktree that is left, check whether its commits reached the default branch, and whether its worktree has uncommitted changes.

Then do both of these:

- Offer to remove each branch or worktree that is merged and has no uncommitted changes, with a one-line reason.
  - Remove it only after the owner's yes: run `git -C <main checkout> worktree remove <folder>`, then `git branch -d <branch>`.
  - Never use `--force`.
  - Name each other branch or worktree to the owner, and leave it as it is.
- Run `git -C <main checkout> status`. It must show none of the work item's files uncommitted. When it shows one, name the files to the owner and ask what to do. Never commit, stash, or remove those files yourself.

## When one message answers several questions

When the owner's words name each question, one message from the owner may answer several questions. For example, one message may answer both the merge question and the question about marking the work item Done. Add one Questions and Answers row for each question, each with the owner's words.

```

### plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/building.md

Before:
```text
# Building

Use this file to build a work item that has approved requirements, and an approved design when it has one. The job is done when every task is done, with proof.

The main agent is the agent of the session that leads the build. It either does the tasks itself or runs a team of helper agents. In both cases it is the only one that changes the work item, and the only one that talks to the owner. The owner stays the product owner: the owner decides, approves, and marks work Done.

A session is one chat with the agent. The exact questions in this file say "chat", because "chat" is the word the owner sees.

## Contents

- Build, task by task
- Who builds
- The team arrangement
- Plan the team
- Git for a build
- Git writes in Codex
- Start a builder
- When a helper returns
- When the plan changes
- Resume in a new session
- While the owner decides something

## Build, task by task

1. Read the work item's tasks and its design. Take the first task whose Depends on line is met. Before you start the task, set it In Progress. In a top-level work item, also set the task's phase In Progress when the phase is Not Started.
2. Work in the work item's own worktree, on its own branch, and never on the default branch. A worktree is a separate folder with its own branch. "Git for a build" below says how to make both. Build what the requirements ask, and no more. When the requirements need work that no task covers, add a task for that work first, and then do it.
3. Tick the task only when its Done when proof is met. Save the proof in Recent History: the command and its exact result line, or what you saw. A task that is partly done stays open, and you add a task for what is left.
4. When you cannot check a task in one go, split it into smaller tasks. When a part can be approved, built, or shipped on its own, propose a sub-item, as `refining-requirements.md`, section "Roadmap, tasks, and sub-items", says.

## Who builds

The `delivery` field on the top-level work item says who builds. Read it before you build. It has one of three values:

- `agent-led`: helper agents build, and the owner decides.
- `owner-led`: the owner steers the build.
- `not-offered`: the owner has not been asked yet.

The Questions and Answers rows whose Affects column says `delivery` hold the owner's answer. A sub-item takes its parent's answer.

The offer is the question whether helper agents build the work item. It is first made in Refining Requirements, as `refining-requirements.md`, step 4, says. Handle these seven cases in Building:

- **The owner gives the work item to the agent in the owner's own words,** for example "you drive". Those words are the owner's yes. Add an answered row for it, and do not ask the offer.
- **`delivery` is `not-offered`, the owner has not given the work item to the agent, and the work item is not small.** Make the offer now.
  - Add the offer as an open row with your recommendation, and set `waiting_on` to the owner.
  - Make the last line of the reply exactly "Would you like agents to take responsibility for delivering this, with you acting as product owner?"
  - Build nothing until the owner answers.
- **The work item is small.** `references/lifecycle-rules.md`, section "A small work item", gives the definition of a small work item. A small work item gets no offer. Set `delivery: owner-led`, and add a Recent History row: "Small item, so no delivery offer." The owner's own later "you drive" still counts.
- **The owner says yes.** Set `delivery: agent-led`.
  - A yes widens nothing. It allows no merge, deployment, spending, publishing, or sign-in beyond what the owner already allowed. Every point in `references/lifecycle-rules.md`, section "When to stop for the owner's yes", still applies.
  - The yes holds across sessions, for this goal only.
- **The owner says no.** Set `delivery: owner-led`. Ask no question about a team, and build the tasks as the owner steers.
- **The owner takes the work back.**
  - Add an answered row "Change to <old Q-ID>: ..." with the owner's words.
  - Mark the row that recorded the owner's yes "Superseded by <new Q-ID>".
  - Set `delivery: owner-led`, and start no new helper.
  - Ask the owner whether the helpers that are still running finish or stop.
- **The owner declined the offer, or took the work back.** Make no new offer, unless the owner asks about agent delivery or the work grows a lot.

## The team arrangement

The team arrangement says whether one session runs the team, or one session coordinates other sessions that each have a team. After the owner's yes to agent delivery, settle the arrangement once for each goal, unless the owner's words already chose it. Record each answer as its own Questions and Answers row.

- When this session has tools to list, read, and message other sessions and to offer new sessions, ask exactly "Do you want one team inside this chat, or do you want me to rename this chat to Main Orchestrator and coordinate other chats that each have their own team?" Check that the tools are there. Never assume it.
- Anywhere else, which means Codex or a session without those tools, say in one line that the arrangement with a Main Orchestrator and other chats is not available here. Then ask exactly "Shall I run one team of helpers inside this chat?"
- After the owner chooses the Main Orchestrator, ask once more, exactly: "Do you want me to archive chats after their task is fully complete, everything is merged and shipped, and you approved?"
- The owner may change the arrangement at any time. Record the new answer as a new row, and mark the old row "Superseded by Q-xx".

### One team inside this session

This session leads, and it starts the helpers.

### Main Orchestrator with other sessions

The Main Orchestrator is the session that coordinates the other sessions.

- Rename this session "Main Orchestrator" with the tool that sets a session's title. When you cannot, ask the owner to rename it.
- Run one session for each sub-item. Each of those sessions has its own main agent and its own helpers.
- The Main Orchestrator is the only session that does these three things:
  - It changes the goal's work items.
  - It writes a file that more than one session changes, such as a file that holds a version number, or an index file.
  - It merges.
- The Main Orchestrator checks the result of each session and reports to the owner. It does not do a session's work for it.
- The main agent of each other session reports by message. The Main Orchestrator records that report as it records the report of a returning helper, which "When a helper returns" describes.
- Offer a new session with the tool that offers a new session. The new session starts only when the owner clicks the offer.
- When the tool makes a worktree for the new session, put the branch in the starting prompt, and not a worktree path.
- The starting prompt of a new session holds all of these:
  - the sub-item's ID and what the sub-item must deliver;
  - the pasted requirements and design sections;
  - the new session's branch, and its worktree when the tool does not make one;
  - the files the new session may write;
  - the owner's instructions from `.claude/rules/owner-preferences.md` that apply to its work, in the owner's words;
  - every permission the session needs, and only permissions that the owner or the project already gave. A session will not let a message from another session remove a limit that its own starting prompt set;
  - the rule "build what the requirements ask and no more";
  - that the session reports by message, and never changes a work item, merges, or asks the owner anything directly.
- Record the id of each session in the parent's team list when the session starts. A recorded id is not proof that the session is still running.
- Archive a session only after the owner said yes to the archive question, and only when all four of these are true:
  1. Its task is complete.
  2. Its work is merged to the default branch and, when the sub-item has a deployment, deployed.
  3. Its report is recorded in its sub-item.
  4. The owner approved the result.
- Archive only, and never delete. An archived session can be restored.
- After the owner's no to the archive question, leave the sessions as they are.

### The model for these sessions

This session, the Main Orchestrator, and the main agent of every other session run on the most capable model that Claude Code or Codex offers. A new session may otherwise copy this session's model, so set the new session's model.

## Plan the team

Plan which helper builds which task before you start a builder.

- Build only after the requirements are approved, and after the design is approved when the work item has one. A requirement with an open row that asks the owner to approve it is not approved. Build nothing from it.
- Start from three things: the design's build order; the Roadmap of the top-level work item, which holds its phases with their tasks and level-2 sub-items; and the task list of each sub-item. `references/lifecycle-rules.md`, section "Levels", describes these levels.
- Start one builder for each task that can run on its own. A builder is a helper that builds one task.
  - Tasks of one sub-item that depend on each other run one after another.
  - A sub-item that needs another sub-item's code starts after that code is merged into the branch of the sub-item that needs the code.
  - The main agent may build a small task itself.
- Make what is missing with `references/work-tracker.md`:
  - A sub-item gets `parent` set to the parent, its phase as `references/lifecycle-rules.md`, section "Levels", says, and `delivery` set to the parent's value. It gets `requirements_approved` copied from the parent when it covers the parent's requirements.
  - A task is `P1-T01 — <name>` in a top-level work item, or `T01 — <name>` in a sub-item. It has Work, Deliverable, Done when, Who does it, and Depends on. It goes on the lowest-level work item it belongs to.
- Allow one writer for each file at a time. Tasks that need the same file run one after another, in the order that their Depends on lines give. The same holds for tasks that need the same shared environment, such as a sandbox org, a database, or a test service.
- Start only as many builders as you can check and merge as they return.
- Tell the owner the team in one line, such as "Team for P2: three builders, one per sub-item." The owner's answer about the arrangement already allows the team. Do not ask again.
- Keep one team list in the parent's Notes, "Context". It has one line for each running helper, or for each session under a Main Orchestrator. Add the line when the helper starts, and remove it when its work is merged or dropped. Write "None running." when the list is empty.

  ```markdown
  **Team (agent-led, one team inside this chat):**
  - builder: WI-041 P1-T01, branch `claude/wi-041-p1-t01`, started 2026-09-30
  - builder: WI-042 P1-T01, branch `claude/wi-042-p1-t01`, started 2026-09-30
  ```

## Git for a build

This section gives the commands and the names for a work item's worktree and its branch. The main checkout is the project's main folder: the first path that `git worktree list` prints. In Codex, every Git command in this section also follows "Git writes in Codex" below.

- Make a work item's changes to code, rules, skills, hooks, and settings in its own worktree, on its own branch, and never on the default branch.
- Make the worktree and the branch before the first change. Make them in the main checkout, from the default branch, under its real name, for example `main`. For a sub-item, make them from its parent's branch.

  ```text
  git -C <main checkout> worktree add .claude/worktrees/wi-007-csv-export -b claude/wi-007-csv-export main
  ```

- The branch is `claude/<prefix>-<number>-<slug>`, and the folder is `.claude/worktrees/<prefix>-<number>-<slug>`.
  - The prefix is the prefix of the work item's ID, in lower case: `wi` for `WI-007`.
  - An ID with no prefix, such as `#12`, uses `issue`: `claude/issue-12-csv-export`.
  - `merge-and-clean-up` finds the work item from the ID in the branch name.
- Name `<main checkout>` with `-C` in every command. Each command starts in the session's own folder, which may be another worktree. A worktree that is made inside that folder is deleted when that folder is removed.
- Make a builder's worktree and branch from the work item's branch. Name them with the work item's prefix and number, and then the task ID in lower case:

  ```text
  git -C <main checkout> worktree add .claude/worktrees/wi-007-p1-t01 -b claude/wi-007-p1-t01 claude/wi-007-csv-export
  ```

- A commit message and a pull request carry no AI credit: no `Co-Authored-By:` that names an AI, and no "Generated with" line.
  - Codex has no setting that removes such a line, so write none.
  - When a command is refused because of such a line, change the wording. Never commit in another way to get past the refusal.
- When a merge stops on a conflict, read both sides of each conflicting file, stage each resolved file by name, and commit with a message that you write.
  - Never run `git commit --no-edit` after a conflict, because it keeps Git's "# Conflicts:" lines in the message.
  - When the right result of a conflict is not clear from the two sides, ask the owner.

## Git writes in Codex

Codex runs commands in a sandbox, which is a closed area that limits what a command can change. The sandbox keeps `.git/` read-only, so every command that writes `.git/` fails inside it.

- These commands fail inside the sandbox: `add`, `commit`, `merge`, `fetch`, `pull`, `push`, `switch`, `checkout`, `restore`, `stash`, `rebase`, `reset`, `worktree add`, `worktree remove`, `branch -d`, and every other Git command that writes.
- A command that needs the network, such as opening a pull request, fails too.
- These reading commands run inside the sandbox: `status`, `log`, `diff`, `show`, `branch --list`, and `worktree list`.

For each Git write in Codex, do this:

- Run the command alone. Do not join it to another command with `&&`, `;`, or a pipe, and do not run it from a script.
- Say in one line what the command does.
- Ask for escalated permissions: set `sandbox_permissions` to `require_escalated`, and set `justification` to a one-line reason, such as "Create the worktree for WI-002 on its own branch." An approval without escalation still runs the command inside the sandbox, where it fails.
- When Codex refuses the command without asking, with "approval required by policy", this session cannot ask for the approval. Stop that step, show the owner the exact command, and ask the owner to run it in a terminal or to approve it in an interactive session. Set the work item to wait on the owner.
- Never work around a refusal: make no second clone, make no copy of `.git/`, write no script that runs Git for you, and do not build on the default branch.

## Start a builder

For each builder:

1. Make its worktree and its branch, as "Git for a build" says.
2. Set its sub-item to State Building, and `waiting_on` to the agent. Set its task In Progress, and also the task's phase when the task has one. Add the builder's line to the parent's team list.
3. Start the builder with the brief in `builder-brief.md` and that file's list of inputs, filled in. Start at the same time the builders that do not depend on each other.

## When a helper returns

Do these steps for each helper as soon as it returns, before you start another helper or reply to the owner.

1. Read the helper's report: the result, the changed files, the tests and checks, the commit, and what the helper could not do.
2. Check the report. The files that the helper changed must be the files it was given, and its tests must pass when you run them yourself on its branch. When either check fails, do not merge, and keep the helper's branch. Treat the task as not done, and record what failed.
3. Merge the helper's branch into the branch of its work item, from that work item's worktree. Then remove the helper's worktree and branch.
4. Read the work item again, and then change these six things:
   - **The task.** Set it to Done, and tick it, only when its Done when check is met. When the task is partly done or not done, leave it open. Add a task for what is left, or add an open Questions and Answers row for a question that the owner must answer.
   - **The sub-item.** When every task is done, move it to the Testing Loop. When tasks are left, it stays in Building. Set `waiting_on` to the agent, or to the owner when the report raised a question for the owner.
   - **Recent History on the sub-item.** Add one row in this form: "Builder returned: P1-T01 done, commit 3f9c2ab, tests pass. Gaps: none."
   - **Recent History on the parent.** Add one row that names the sub-item, in this form: "WI-041 P1-T01 built (3f9c2ab)."
   - **The phase of a top-level work item.** Set it to Done when every task in it is Done, every sub-item in it is Done or Cancelled, and its exit result was checked.
   - **The team list.** Remove the helper's line.
5. Start the next helper whose dependencies are now met.

When a helper worked on a task of the parent itself, do the same steps on the parent's task and the parent's Recent History.

## When the plan changes

The plan changes when the owner changes the owner's mind, a helper finds a problem, a check fails, or a phase turns out to be too big. Change phases, sub-items, and tasks with `references/work-tracker.md`. A phase or a task that moves keeps its ID.

- Record every plan change in a Recent History row on the parent: what changed and why, with the Q-ID when the owner's answer caused the change.
- Ask the owner first when a change drops or merges work that the owner approved.
- A new or changed requirement goes to `refining-requirements.md`. A changed design goes to `designing.md`.
- A running helper whose task moved to another phase keeps going.
- When a running helper's task was dropped, or its requirement or design changed, stop the helper, or let it finish and do not merge its branch.
  - Keep the branch until the owner agrees that the work is dropped.
  - Start a new helper with the new brief when the work is still needed.
- When a change drops a top-level work item, or moves it to another project phase, change the project's roadmap with `references/work-tracker.md`, after the owner's yes.

## Resume in a new session

Use this section when a new session continues a build that an earlier session started.

- Read the parent again: first its Current state, then the team list, its Roadmap or task list, and each sub-item that is listed.
- After compaction in the same session, a helper may still be running. Wait for its report. Compaction is when Claude Code or Codex shortens the session's history to make room.
- In a new session, the builders from the old session are not running.
- A session under a Main Orchestrator may still be running. Message it, and wait for its report before you start anything for its sub-item.
- For each builder line in the team list, look at the builder's branch with `git log --oneline <item branch>..<builder branch>`. Then do the one of these three that fits:
  - When the command lists commits, treat the commits as the helper's report, as "When a helper returns" says, and run the tests against the task's Done when. What is missing stays open.
  - When the command lists nothing, and `git -C <builder worktree> status --short` prints nothing, remove the builder's worktree and branch, and start a new builder.
  - When the builder's worktree has uncommitted changes, keep them, tell the owner in one line, and ask whether to use them or to remove them.
- Ask the owner nothing that the owner's recorded answers already settle. The delivery answer and the team arrangement hold across sessions.

## While the owner decides something

While the owner decides something, keep the team on work that the owner's answer does not block.

```
After:
```text
# Building

Use this file to build a work item that has approved requirements, and an approved design when it has one. The job is done when every task is done, with proof.

The main agent is the agent of the session that leads the build. It either does the tasks itself or runs a team of helper agents. In both cases it is the only one that changes the work item, and the only one that talks to the owner. The owner stays the product owner: the owner decides, approves, and marks work Done.

A session is one chat with the agent. The exact questions in this file say "chat", because "chat" is the word the owner sees.

## Contents

- Build, task by task
- Who builds
- The team arrangement
- Plan the team
- Git for a build
- Git writes in Codex
- Start a builder
- When a helper returns
- When the plan changes
- Resume in a new session
- While the owner decides something

## Build, task by task

1. Read the work item's tasks and its design. Take the first task whose Depends on line is met. Before you start the task, set it In Progress. In a top-level work item, also set the task's phase In Progress when the phase is Not Started.
2. Work in the work item's own worktree, on its own branch, and never on the default branch. A worktree is a separate folder with its own branch. "Git for a build" below says how to make both. Build what the requirements ask, and no more. When the requirements need work that no task covers, add a task for that work first, and then do it.
3. Tick the task only when its Done when proof is met. Save the proof in Recent History: the command and its exact result line, or what you saw. A task that is partly done stays open, and you add a task for what is left.
4. When you cannot check a task in one go, split it into smaller tasks. When a part can be approved, built, or shipped on its own, propose a sub-item, as `refining-requirements.md`, section "Roadmap, tasks, and sub-items", says.

## Who builds

The `delivery` field on the top-level work item says who builds. Read it before you build. It has one of three values:

- `agent-led`: helper agents build, and the owner decides.
- `owner-led`: the owner steers the build.
- `not-offered`: the owner has not been asked yet.

The Questions and Answers rows whose Affects column says `delivery` hold the owner's answer. A sub-item takes its parent's answer.

The offer is the question whether helper agents build the work item. It is first made in Refining Requirements, as `refining-requirements.md`, step 4, says. Handle these seven cases in Building:

- **The owner gives the work item to the agent in the owner's own words,** for example "you drive". Those words are the owner's yes. Add an answered row for it, and do not ask the offer.
- **`delivery` is `not-offered`, the owner has not given the work item to the agent, and the work item is not small.** Make the offer now.
  - Add the offer as an open row with your recommendation, and set `waiting_on` to the owner.
  - Make the last line of the reply exactly "Would you like agents to take responsibility for delivering this, with you acting as product owner?"
  - Build nothing until the owner answers.
- **The work item is small.** `references/lifecycle-rules.md`, section "A small work item", gives the definition of a small work item. A small work item gets no offer. Set `delivery: owner-led`, and add a Recent History row: "Small item, so no delivery offer." The owner's own later "you drive" still counts.
- **The owner says yes.** Set `delivery: agent-led`.
  - A yes widens nothing. It allows no merge, deployment, spending, publishing, or sign-in beyond what the owner already allowed. Every point in `references/lifecycle-rules.md`, section "When to stop for the owner's yes", still applies.
  - The yes holds across sessions, for this goal only.
- **The owner says no.** Set `delivery: owner-led`. Ask no question about a team, and build the tasks as the owner steers.
- **The owner takes the work back.**
  - Add an answered row "Change to <old Q-ID>: ..." with the owner's words.
  - Mark the row that recorded the owner's yes "Superseded by <new Q-ID>".
  - Set `delivery: owner-led`, and start no new helper.
  - Ask the owner whether the helpers that are still running finish or stop.
- **The owner declined the offer, or took the work back.** Make no new offer, unless the owner asks about agent delivery or the work grows a lot.

## The team arrangement

Follow [choosing and coordinating the team](team-arrangement.md) for this part of Building.

## Plan the team

Plan which helper builds which task before you start a builder.

- Build only after the requirements are approved, and after the design is approved when the work item has one. A requirement with an open row that asks the owner to approve it is not approved. Build nothing from it.
- Start from three things: the design's build order; the Roadmap of the top-level work item, which holds its phases with their tasks and level-2 sub-items; and the task list of each sub-item. `references/lifecycle-rules.md`, section "Levels", describes these levels.
- Start one builder for each task that can run on its own. A builder is a helper that builds one task.
  - Tasks of one sub-item that depend on each other run one after another.
  - A sub-item that needs another sub-item's code starts after that code is merged into the branch of the sub-item that needs the code.
  - The main agent may build a small task itself.
- Make what is missing with `references/work-tracker.md`:
  - A sub-item gets `parent` set to the parent, its phase as `references/lifecycle-rules.md`, section "Levels", says, and `delivery` set to the parent's value. It gets `requirements_approved` copied from the parent when it covers the parent's requirements.
  - A task is `P1-T01 — <name>` in a top-level work item, or `T01 — <name>` in a sub-item. It has Work, Deliverable, Done when, Who does it, and Depends on. It goes on the lowest-level work item it belongs to.
- Allow one writer for each file at a time. Tasks that need the same file run one after another, in the order that their Depends on lines give. The same holds for tasks that need the same shared environment, such as a sandbox org, a database, or a test service.
- Start only as many builders as you can check and merge as they return.
- Tell the owner the team in one line, such as "Team for P2: three builders, one per sub-item." The owner's answer about the arrangement already allows the team. Do not ask again.
- Keep one team list in the parent's Notes, "Context". It has one line for each running helper, or for each session under a Main Orchestrator. Add the line when the helper starts, and remove it when its work is merged or dropped. Write "None running." when the list is empty.

  ```markdown
  **Team (agent-led, one team inside this chat):**
  - builder: WI-041 P1-T01, branch `claude/wi-041-p1-t01`, started 2026-09-30
  - builder: WI-042 P1-T01, branch `claude/wi-042-p1-t01`, started 2026-09-30
  ```

## Git for a build

Follow [repository and permission steps for a build](build-repository.md) for this part of Building.

## Git writes in Codex

Follow [repository and permission steps for a build](build-repository.md) for this part of Building.

## Start a builder

For each builder:

1. Make its worktree and its branch, as "Git for a build" says.
2. Set its sub-item to State Building, and `waiting_on` to the agent. Set its task In Progress, and also the task's phase when the task has one. Add the builder's line to the parent's team list.
3. Start the builder with the brief in `builder-brief.md` and that file's list of inputs, filled in. Start at the same time the builders that do not depend on each other.

## When a helper returns

Do these steps for each helper as soon as it returns, before you start another helper or reply to the owner.

1. Read the helper's report: the result, the changed files, the tests and checks, the commit, and what the helper could not do.
2. Check the report. The files that the helper changed must be the files it was given, and its tests must pass when you run them yourself on its branch. When either check fails, do not merge, and keep the helper's branch. Treat the task as not done, and record what failed.
3. Merge the helper's branch into the branch of its work item, from that work item's worktree. Then remove the helper's worktree and branch.
4. Read the work item again, and then change these six things:
   - **The task.** Set it to Done, and tick it, only when its Done when check is met. When the task is partly done or not done, leave it open. Add a task for what is left, or add an open Questions and Answers row for a question that the owner must answer.
   - **The sub-item.** When every task is done, move it to the Testing Loop. When tasks are left, it stays in Building. Set `waiting_on` to the agent, or to the owner when the report raised a question for the owner.
   - **Recent History on the sub-item.** Add one row in this form: "Builder returned: P1-T01 done, commit 3f9c2ab, tests pass. Gaps: none."
   - **Recent History on the parent.** Add one row that names the sub-item, in this form: "WI-041 P1-T01 built (3f9c2ab)."
   - **The phase of a top-level work item.** Set it to Done when every task in it is Done, every sub-item in it is Done or Cancelled, and its exit result was checked.
   - **The team list.** Remove the helper's line.
5. Start the next helper whose dependencies are now met.

When a helper worked on a task of the parent itself, do the same steps on the parent's task and the parent's Recent History.

## When the plan changes

The plan changes when the owner changes the owner's mind, a helper finds a problem, a check fails, or a phase turns out to be too big. Change phases, sub-items, and tasks with `references/work-tracker.md`. A phase or a task that moves keeps its ID.

- Record every plan change in a Recent History row on the parent: what changed and why, with the Q-ID when the owner's answer caused the change.
- Ask the owner first when a change drops or merges work that the owner approved.
- A new or changed requirement goes to `refining-requirements.md`. A changed design goes to `designing.md`.
- A running helper whose task moved to another phase keeps going.
- When a running helper's task was dropped, or its requirement or design changed, stop the helper, or let it finish and do not merge its branch.
  - Keep the branch until the owner agrees that the work is dropped.
  - Start a new helper with the new brief when the work is still needed.
- When a change drops a top-level work item, or moves it to another project phase, change the project's roadmap with `references/work-tracker.md`, after the owner's yes.

## Resume in a new session

Use this section when a new session continues a build that an earlier session started.

- Read the parent again: first its Current state, then the team list, its Roadmap or task list, and each sub-item that is listed.
- After compaction in the same session, a helper may still be running. Wait for its report. Compaction is when Claude Code or Codex shortens the session's history to make room.
- In a new session, the builders from the old session are not running.
- A session under a Main Orchestrator may still be running. Message it, and wait for its report before you start anything for its sub-item.
- For each builder line in the team list, look at the builder's branch with `git log --oneline <item branch>..<builder branch>`. Then do the one of these three that fits:
  - When the command lists commits, treat the commits as the helper's report, as "When a helper returns" says, and run the tests against the task's Done when. What is missing stays open.
  - When the command lists nothing, and `git -C <builder worktree> status --short` prints nothing, remove the builder's worktree and branch, and start a new builder.
  - When the builder's worktree has uncommitted changes, keep them, tell the owner in one line, and ask whether to use them or to remove them.
- Ask the owner nothing that the owner's recorded answers already settle. The delivery answer and the team arrangement hold across sessions.

## While the owner decides something

While the owner decides something, keep the team on work that the owner's answer does not block.

```

### .claude/skills/writing-harness-files/SKILL.md

Before:
```text
---
name: writing-harness-files
description: 'Uses current official Claude Code and Codex guidance to write or change skills, rules, agent guides, hooks, settings, plugin files, and other harness files. Use before creating or editing one of these files. For toolkit setup, use project-setup.'
---

# Writing harness files

Use this skill to write or change a file that tells Claude Code or Codex how to behave. It is one of these kinds: a skill, a rule, an `AGENTS.md` or `CLAUDE.md`, a hook, a settings file, a Codex `.rules` file, an output style, a plugin manifest or marketplace file, a mod, a subagent definition, or a helper-agent brief. A hook includes its command and its entry in a settings or hooks file.

The finished file follows current official guidance for its kind. A reader who opens it alone can follow it after one read. The owner is the person the agent works for and one of the file's readers.

Get current official guidance before writing. Claude Code and Codex can change between releases.

Setting up or updating the toolkit in a project is the job of `project-setup`.

## Steps

1. Name the kind of file you will change. Identify whether Claude Code, Codex, or both read it.
2. Get the current official guidance for that kind of file. [references/official-pages.md](references/official-pages.md) says how, and gives the address of the official page for each kind of file and each product.
   - In Claude Code, first use the agent or skill that Claude Code provides for the job, when it is available. That file names the one for each job.
   - When none is available, open the address of the page. Always do so for a Codex page.
   - For a skill, read the skill best practices page every time, together with the Claude Code skill page and the Codex skill page: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
   - Use a copy that the project keeps only when it was captured in the last 14 days. Otherwise, read the live page.
   - When you cannot read the page, tell the owner before you write. Name the page, and say that the change is based on the checklist alone.
3. Open the section for that kind of file in [references/checklist.md](references/checklist.md). It gives the practices and checks for the file. If the live page and checklist differ, follow the page. Tell the owner which checklist line needs correction.
4. Read the project's own rules for these files in its root `AGENTS.md`. Then read two existing files of the same kind in the project, and match their form.
5. Write the change.
   - Follow the project's `.claude/rules/document-clarity-standard.md` when it exists. The owner may have changed that file.
   - In a folder without that rule, follow [references/writing-rule.md](references/writing-rule.md). It is an exact copy of the rule that `project-setup` gives every project.
   - A file that both products read uses only what both support.
6. Check the change the way the checklist section says under "Check".
7. Have an agent that did not write the change review it against the official page, the checklist, and the writing rule. Fix each confirmed finding and have the reviewer read the fix. A small edit gets one reviewer and one read.
   - If the product cannot start a helper agent, review the change yourself against all three sources. Tell the owner in step 8 that no separate review ran.
8. Tell the owner which pages you read and their dates, what you changed, and what the review found.

A project may require the owner's yes before a rule, a skill, or a hook changes. Get that yes before step 5.

## Rewriting a file that exists

When the job is to make a skill, a rule, or an agent guide clearer without changing what it requires, follow [references/rewrite-steps.md](references/rewrite-steps.md) in place of steps 5 to 7. An agent guide is an `AGENTS.md` or a `CLAUDE.md`. That file gives the order of work, the checks that prove no rule changed, and a prompt for a team that rewrites many files.

## Briefing a helper agent

A helper agent starts with only its brief. When a helper will change a harness file, the brief does four things:

- It names the kind of file and the products that read it.
- It tells the helper to use this skill. When the helper cannot load skills, the brief gives it the page addresses and the checklist section for that kind of file.
- It gives the helper the path of the writing rule, or the text of that file when the helper cannot open it. Step 5 says which file is the writing rule. A helper does not get the output style that the replies of the main session follow, so the helper has no other writing rules.
- It says that a separate agent reviews the change.

## References

| File | Open it when |
| --- | --- |
| [references/official-pages.md](references/official-pages.md) | Step 2: you need the official page for a kind of file. |
| [references/checklist.md](references/checklist.md) | Steps 3 and 6: you need the practices and the check for a kind of file. |
| [references/writing-rule.md](references/writing-rule.md) | Step 5, and every rewrite: you need the writing rules. The file is an exact copy of the rule `.claude/rules/document-clarity-standard.md`. |
| [references/rewrite-steps.md](references/rewrite-steps.md) | The job is to rewrite a file that exists: you need the order of work, the checks, and the prompt for a team. |

```
After:
```text
---
name: writing-harness-files
description: 'Uses current official Claude Code and Codex guidance to write or change skills, rules, agent guides, hooks, settings, plugin files, and other harness files. Use before creating or editing one of these files. For toolkit setup, use project-setup.'
---

# Writing harness files

Use this skill to write or change a file that tells Claude Code or Codex how to behave. It is one of these kinds: a skill, a rule, an `AGENTS.md` or `CLAUDE.md`, a hook, a settings file, a Codex `.rules` file, an output style, a plugin manifest or marketplace file, a mod, a subagent definition, or a helper-agent brief. A hook includes its command and its entry in a settings or hooks file.

The finished file follows current official guidance for its kind. A reader who opens it alone can follow it after one read. The owner is the person the agent works for and one of the file's readers.

Get current official guidance before writing. Claude Code and Codex can change between releases.

Setting up or updating the toolkit in a project is the job of `project-setup`.

## Steps

1. Name the kind of file you will change. Identify whether Claude Code, Codex, or both read it.
2. Get the current official guidance for that kind of file. [references/official-pages.md](references/official-pages.md) says how, and gives the address of the official page for each kind of file and each product.
   - In Claude Code, first use the agent or skill that Claude Code provides for the job, when it is available. That file names the one for each job.
   - When none is available, open the address of the page. Always do so for a Codex page.
   - For a skill, read the skill best practices page every time, together with the Claude Code skill page and the Codex skill page: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
   - Use a copy that the project keeps only when it was captured in the last 14 days. Otherwise, read the live page.
   - When you cannot read the page, tell the owner before you write. Name the page, and say that the change is based on the checklist alone.
3. Open the section for that kind of file in [references/checklist.md](references/checklist.md). It gives the practices and checks for the file. If the live page and checklist differ, follow the page. Tell the owner which checklist line needs correction.
4. Read the project's own rules for these files in its root `AGENTS.md`. Read relevant existing files of the same kind to understand the project's established names, locations, and form.
5. Write the change.
   - Follow the project's `.claude/rules/document-clarity-standard.md` when it exists. The owner may have changed that file.
   - In a folder without that rule, follow [references/writing-rule.md](references/writing-rule.md). It is an exact copy of the rule that `project-setup` gives every project.
   - A file that both products read uses only what both support.
6. Check the change the way the checklist section says under "Check".
7. Have an agent that did not write the change review it against the official page, the checklist, and the writing rule. Fix each confirmed finding and have the reviewer read the fix. Use review coverage appropriate to the change and its effects.
   - If the product cannot start a helper agent, review the change yourself against all three sources. Tell the owner in step 8 that no separate review ran.
8. Tell the owner which pages you read and their dates, what you changed, and what the review found.

A project may require the owner's yes before a rule, a skill, or a hook changes. Get that yes before step 5.

## Rewriting a file that exists

When the job is to make a skill, a rule, or an agent guide clearer without changing what it requires, follow [references/rewrite-steps.md](references/rewrite-steps.md) in place of steps 5 to 7. An agent guide is an `AGENTS.md` or a `CLAUDE.md`. That file gives the order of work, the checks that prove no rule changed, and a prompt for a team that rewrites many files.

## Briefing a helper agent

A helper agent starts with only its brief. When a helper will change a harness file, the brief does four things:

- It names the kind of file and the products that read it.
- It tells the helper to use this skill. When the helper cannot load skills, the brief gives it the page addresses and the checklist section for that kind of file.
- It gives the helper the path of the writing rule, or the text of that file when the helper cannot open it. Step 5 says which file is the writing rule. A helper does not get the output style that the replies of the main session follow, so the helper has no other writing rules.
- It says that a separate agent reviews the change.

## References

| File | Open it when |
| --- | --- |
| [references/official-pages.md](references/official-pages.md) | Step 2: you need the official page for a kind of file. |
| [references/checklist.md](references/checklist.md) | Steps 3 and 6: you need the practices and the check for a kind of file. |
| [references/writing-rule.md](references/writing-rule.md) | Step 5, and every rewrite: you need the writing rules. The file is an exact copy of the rule `.claude/rules/document-clarity-standard.md`. |
| [references/rewrite-steps.md](references/rewrite-steps.md) | The job is to rewrite a file that exists: you need the order of work, the checks, and the prompt for a team. |

```

### .claude/skills/writing-harness-files/references/checklist.md

Before:
```text
# Checklist by kind of file

This file gives, for each kind of harness file, the practices that the official pages ask for and the way to check a change. Use it at steps 3 and 6 of `SKILL.md`, after you have read the official page, so that no practice is missed and every change is checked before a reviewer sees it.

Every section ends with a line that starts "Check:". That line is the check that step 6 of `SKILL.md` asks for.

The practices were checked against the official pages on 2026-10-05 (Claude Code 2.1.289, Codex 0.160). When a page says something different, the page is right.

## Contents

- Skill
- Rule
- AGENTS.md and CLAUDE.md
- Hook
- Settings file
- Codex .rules file
- Output style
- Plugin manifest or marketplace file
- Mod
- Subagent definition or helper-agent brief

## Skill

- A skill is a folder that holds `SKILL.md`, plus `references/` and `assets/` as needed. Add `scripts/` only when the project allows scripts in skills.
- The front matter is the block of fields between two `---` lines at the top of `SKILL.md`. Its `name` field equals the folder name: lowercase letters, digits, and hyphens, 64 characters or fewer, with no hyphen at the start or the end and no two hyphens in a row. It holds neither "anthropic" nor "claude".
- `description` is required by the Agent Skills standard and by Codex, and is 1,024 characters or fewer. Claude Code cuts the text it lists for one skill at 1,536 characters.
- Codex reads only `name`, `description`, and `metadata.short-description` from the front matter. A field that only Claude Code reads, such as `when_to_use`, `allowed-tools`, `paths`, or `disable-model-invocation`, does nothing in Codex. So a skill that both products read must work with `name` and `description` alone.
- The description says what the skill does and when to use it, in the third person, with the words the owner would say. Put the main use first. When the list of skills is over its budget, Codex cuts each description from the end, and Claude Code drops whole descriptions, starting with the skills used least. Keep it far below the limit: every session reads every description.
- Name a neighbour skill in the description only where the two compete: "Not for ...; use <skill>."
- `SKILL.md` stays under 500 lines. It opens as the writing rule says a document opens, then gives the steps, then a table that links every file in the folder and says when to open it.
- A reference over 100 lines starts with a contents list. References link from `SKILL.md`, not from each other.
- A skill names its own files by a path from the skill folder, and reads no file outside that folder.
- In Claude Code a personal or project skill with the name of a built-in command or a bundled skill replaces it. A personal or project skill named `verify` or `simplify` is run before each commit. Choose another name unless that is the purpose.
- Claude Code loads a skill in a `.claude/skills/` folder below the folder a session started in once the agent reads or edits a file there. A copy of a skill kept in a repository as a template is loaded this way.

Check: run the project's skill checks when the project has them. After a new or changed name or description, test in each product that reads the skill that it is chosen for three requests that should choose it and not for three that should not.

## Rule

A rule is a Markdown file in `.claude/rules/`. Claude Code loads it. Codex does not read that folder. Codex has a `rules/` folder of its own for a different kind of file: see "Codex .rules file".

- One topic per file, with a file name that says the topic.
- One specific instruction per bullet, under one heading.
- A rule with no `paths` line loads in every session, so keep it short.
- `paths` is the only front matter field Claude Code reads in a rule. Give a rule a `paths` line only when it is about certain files. It then loads when the agent reads, writes, or edits a matching file, and not when it runs a command or answers a question.
- A procedure with several steps goes in a skill, not in a rule.
- The project's `AGENTS.md` must tell Codex which rule files to read, and when.

Check: open a session in Claude Code, read a matching file when the rule has `paths`, and confirm in `/context` that the rule is loaded. In Codex, confirm the agent read the rule the way `AGENTS.md` tells it to.

## AGENTS.md and CLAUDE.md

- The file holds what every session needs and nothing else. Keep each file under 200 lines.
- Write instructions that are specific and can be checked.
- Codex reads `AGENTS.md`. Claude Code reads `CLAUDE.md`; it reads `AGENTS.md` by itself only when no `CLAUDE.md` or `CLAUDE.local.md` is in the working folder or above it (Claude Code 2.1.277 or later). A `CLAUDE.md` that holds the one line `@AGENTS.md` makes both products read one text in every case.
- In Claude Code, a folder's `CLAUDE.md` loads when the agent reads, writes, or edits a file in that folder. The folder's `AGENTS.md` loads by itself only when the agent reads a file there and the folder has no `CLAUDE.md`.
- Codex loads the `AGENTS.md` of each folder from the project root down to the folder it was started in, and no other. So the root file must tell Codex to read a folder's file before it works there.
- Codex stops adding instruction files once they reach 32 KiB together, unless the owner's settings raise that limit.
- A procedure goes in a skill. What a hook or a check can enforce goes there, not in a sentence.

Check: open a session in each product, read a file in the folder, and confirm the text is loaded.

## Hook

- A hook does one job.
- A hook must never break a session. On its own error it prints one line and exits normally, unless stopping the action is its job.
- It needs nothing installed beyond its runtime, and it finishes fast.
- Claude Code reads hooks from the `hooks` key of a settings file. Codex reads them from a `hooks.json` file or from `[hooks]` tables in `config.toml`, in `~/.codex/` and in the project's `.codex/` folder.
- A plugin's hooks file wraps its events in a top-level `hooks` key.
- The exit code and the output stream decide what the agent sees and whether the action is stopped. They differ by event and by product. Read the page for the event you use.
- Codex runs a project's hooks only after the owner trusted the project folder, and runs a new or changed hook entry only after the owner trusted it in `/hooks`. Tell the owner when an entry changes.
- New code needs the owner's yes when the project says so.

Check: run the command by hand with a sample input for the event, once for the normal case and once for a failing case. Add or update its test.

## Settings file

- Claude Code has three files a person changes: `~/.claude/settings.json` for every project, `.claude/settings.json` for everyone who works on the project, and `.claude/settings.local.json` for one person in one project. The local file wins over the project file, and the project file over the user file.
- Change the file whose reach matches the purpose. A setting for one project never goes in the user file.
- Add to the file; never replace entries you did not write.
- Never put a key, a token, or a password in a settings file that Git tracks.
- Read the page for the key before you rely on it: some keys are read from only some of the files.

Check: confirm the file still parses, then confirm in a session that the setting is in force.

## Codex .rules file

A `.rules` file tells Codex which commands it may run outside the sandbox. Only Codex reads it. Claude Code sets command permissions in a settings file.

- The feature is experimental. Read the page again before every change.
- The file sits in a `rules/` folder beside a Codex settings layer: `~/.codex/rules/` for every project, `<repo>/.codex/rules/` for one project. Codex loads a project's rules only after the owner trusted the project's `.codex/` folder.
- Codex reads the files when it starts. Tell the owner to restart Codex after a change.
- Each rule is one `prefix_rule(...)` call, written in Starlark:
  - `pattern` is required: the list of words the command starts with. One position may hold a list of alternatives.
  - `decision` is `allow`, `prompt`, or `forbidden`. With none, it is `allow`.
  - `justification` is optional: the reason, in words the owner can read. For `forbidden`, name the command to use in its place.
  - `match` and `not_match` are example commands. Codex tests them when it loads the file.
- When several rules match one command, the strictest decision applies: `forbidden`, then `prompt`, then `allow`.
- Give every rule at least one `match` and one `not_match` example.
- Codex splits a `bash -lc` script into its commands only when the script is plain words joined by `&&`, `||`, `;`, or `|`. A script with a redirect, a substitution, a variable, a wildcard, or control flow is tested as one `bash -lc` command.
- Codex writes `~/.codex/rules/default.rules` itself when the owner allows a command in a session. Add to that file; never replace it.

Check: `codex execpolicy check --pretty --rules <file> -- <command>`, once with a command the rule must match and once with one it must not. The answer names the decision and the rules that matched.

## Output style

An output style is a Markdown file of instructions that Claude Code sends with every request in a session. Only Claude Code reads it.

- The file sits in `~/.claude/output-styles/` for every project or `.claude/output-styles/` for one project. A plugin ships output styles in its `output-styles/` folder.
- Every front matter field is optional: `name` (with none, the file name), `description`, and `keep-coding-instructions`. A plugin's style may also set `force-for-plugin`. Claude Code ignores a misspelled field without an error.
- `keep-coding-instructions: true` keeps Claude Code's own software engineering instructions. Without it, a custom style leaves them out. Set it in a style that changes only how replies are written.
- A style is chosen by the `outputStyle` key of a settings file. The value must equal the style's name, letter for letter, with the same capitals. A value that matches no style gives the default style, with no error.
- Keep the style short: its text is sent with every request.
- Codex never sees an output style. In Claude Code a helper agent does not get it either, except a fork, which inherits the style of the session it was forked from. Give them the path of the writing rule. `SKILL.md`, step 5, says which file is the writing rule.
- A style is an instruction, and nothing enforces it. What must happen every time goes in a hook.
- In the terminal, Claude Code reads style files when it starts. Tell the owner to restart it after a change.

Check: start a new session and run `/output-style` with no argument. It lists the styles and marks the one in use.

## Plugin manifest or marketplace file

- Claude Code reads `.claude-plugin/plugin.json`. Codex reads a `plugin.json` at the plugin's root in the Agent Plugins format; `.codex-plugin/plugin.json` is the older form and still works. A plugin for both carries the same `name` and `version` in each manifest.
- A marketplace file lists the plugins a folder or repository offers. Claude Code reads `.claude-plugin/marketplace.json`. Codex reads `.agents/plugins/marketplace.json`, in a repository or in the home folder. The two files have different fields: read the page for the product before you add one.
- `claude plugin validate` refuses a plugin name that starts with `claude-`, `anthropic-`, `anthropics-`, or `cc-plugin-`.
- A `version` in the manifest pins the plugin: a person who installed it gets a change only after the version is raised. Raise it with every shipped change.
- Codex loads every `SKILL.md` under a plugin's `skills/` folder as a skill of the plugin. No official page says how to keep one out. In a test with Codex 0.160 on 2026-10-05, Codex did not load a `SKILL.md` below a folder whose name starts with a dot. Test it again before you rely on it.

Check: `claude plugin validate <folder>`. For Codex, install the plugin into a scratch `CODEX_HOME`, never the owner's own, and list the skills it loads.

## Mod

- A mod is a Claude Code plugin whose `hooks/hooks.json` names a JavaScript or TypeScript module. Codex cannot run one.
- The feature is new and changes between releases. Read the pages again before every change.

Check: `claude plugin validate <folder>` lists what the mod hooks and calls. `claude plugin test` runs its tests with no session.

## Subagent definition or helper-agent brief

- A Claude Code subagent definition is a Markdown file in `.claude/agents/`. A Codex custom agent is a TOML file in `.codex/agents/`. Neither product reads the other's file.
- A helper starts with only the brief. State the goal, the helper's own part, the files to read first, what it must not change, how to verify the work, and what to report.
- Tell the helper to report only on its own part.
- Give the helper the writing rule in the brief: its path, or its text when the helper cannot open it. `SKILL.md`, step 5, says which file is the writing rule. A helper does not get the output style that the replies of the main session follow.
- Ask it to mark what it verified and what it inferred.

Check: read the brief as if you knew nothing else. Every file it names exists, and every instruction has one meaning.

```
After:
```text
# Checklist by kind of file

This file gives, for each kind of harness file, the practices that the official pages ask for and the way to check a change. Use it at steps 3 and 6 of `SKILL.md`, after you have read the official page, so that no practice is missed and every change is checked before a reviewer sees it.

Every section ends with a line that starts "Check:". That line is the check that step 6 of `SKILL.md` asks for.

The practices were checked against the official pages on 2026-10-05 (Claude Code 2.1.289, Codex 0.160). When a page says something different, the page is right.

## Contents

- Skill
- Rule
- AGENTS.md and CLAUDE.md
- Hook
- Settings file
- Codex .rules file
- Output style
- Plugin manifest or marketplace file
- Mod
- Subagent definition or helper-agent brief

## Skill

- A skill is a folder that holds `SKILL.md`, plus `references/` and `assets/` as needed. Add `scripts/` only when the project allows scripts in skills.
- The front matter is the block of fields between two `---` lines at the top of `SKILL.md`. Its `name` field equals the folder name: lowercase letters, digits, and hyphens, 64 characters or fewer, with no hyphen at the start or the end and no two hyphens in a row. It holds neither "anthropic" nor "claude".
- `description` is required by the Agent Skills standard and by Codex, and is 1,024 characters or fewer. Claude Code cuts the text it lists for one skill at 1,536 characters.
- Codex reads only `name`, `description`, and `metadata.short-description` from the front matter. A field that only Claude Code reads, such as `when_to_use`, `allowed-tools`, `paths`, or `disable-model-invocation`, does nothing in Codex. So a skill that both products read must work with `name` and `description` alone.
- The description says what the skill does and when to use it, in the third person, with the words the owner would say. Put the main use first. When the list of skills is over its budget, Codex cuts each description from the end, and Claude Code drops whole descriptions, starting with the skills used least. Keep it far below the limit: every session reads every description.
- Name a neighbour skill in the description only where the two compete: "Not for ...; use <skill>."
- `SKILL.md` stays under 500 lines. It opens as the writing rule says a document opens, then gives the steps, then a table that links every file in the folder and says when to open it.
- A reference over 100 lines starts with a contents list. Link supporting files directly from `SKILL.md`, with guidance on when to open each one. Cross-links may guide related work, but must not be the only way to discover a necessary file.
- A skill names its own files by a path from the skill folder, and reads no file outside that folder.
- In Claude Code a personal or project skill with the name of a built-in command or a bundled skill replaces it. A personal or project skill named `verify` or `simplify` is run before each commit. Choose another name unless that is the purpose.
- Claude Code loads a skill in a `.claude/skills/` folder below the folder a session started in once the agent reads or edits a file there. A copy of a skill kept in a repository as a template is loaded this way.

Check: run the project's skill checks when the project has them. After a new or changed name or description, test in each product that reads the skill that it is chosen for three requests that should choose it and not for three that should not.

## Rule

A rule is a Markdown file in `.claude/rules/`. Claude Code loads it. Codex does not read that folder. Codex has a `rules/` folder of its own for a different kind of file: see "Codex .rules file".

- One topic per file, with a file name that says the topic.
- One specific instruction per bullet, under one heading.
- A rule with no `paths` line loads in every session, so keep it short.
- `paths` is the only front matter field Claude Code reads in a rule. Give a rule a `paths` line only when it is about certain files. It then loads when the agent reads, writes, or edits a matching file, and not when it runs a command or answers a question.
- A procedure with several steps goes in a skill, not in a rule.
- The project's `AGENTS.md` must tell Codex which rule files to read, and when.

Check: open a session in Claude Code, read a matching file when the rule has `paths`, and confirm in `/context` that the rule is loaded. In Codex, confirm the agent read the rule the way `AGENTS.md` tells it to.

## AGENTS.md and CLAUDE.md

- The file holds what every session needs and nothing else. Keep each file under 200 lines.
- Write instructions that are specific and can be checked.
- Codex reads `AGENTS.md`. Claude Code reads `CLAUDE.md`; it reads `AGENTS.md` by itself only when no `CLAUDE.md` or `CLAUDE.local.md` is in the working folder or above it (Claude Code 2.1.277 or later). A `CLAUDE.md` that holds the one line `@AGENTS.md` makes both products read one text in every case.
- In Claude Code, a folder's `CLAUDE.md` loads when the agent reads, writes, or edits a file in that folder. The folder's `AGENTS.md` loads by itself only when the agent reads a file there and the folder has no `CLAUDE.md`.
- Codex loads the `AGENTS.md` of each folder from the project root down to the folder it was started in, and no other. So the root file must tell Codex to read a folder's file before it works there.
- Codex stops adding instruction files once they reach 32 KiB together, unless the owner's settings raise that limit.
- A procedure goes in a skill. What a hook or a check can enforce goes there, not in a sentence.

Check: open a session in each product, read a file in the folder, and confirm the text is loaded.

## Hook

- A hook does one job.
- A hook must never break a session. On its own error it prints one line and exits normally, unless stopping the action is its job.
- It needs nothing installed beyond its runtime, and it finishes fast.
- Claude Code reads hooks from the `hooks` key of a settings file. Codex reads them from a `hooks.json` file or from `[hooks]` tables in `config.toml`, in `~/.codex/` and in the project's `.codex/` folder.
- A plugin's hooks file wraps its events in a top-level `hooks` key.
- The exit code and the output stream decide what the agent sees and whether the action is stopped. They differ by event and by product. Read the page for the event you use.
- Codex runs a project's hooks only after the owner trusted the project folder, and runs a new or changed hook entry only after the owner trusted it in `/hooks`. Tell the owner when an entry changes.
- New code needs the owner's yes when the project says so.

Check: run the command by hand with a sample input for the event, once for the normal case and once for a failing case. Add or update its test.

## Settings file

- Claude Code has three files a person changes: `~/.claude/settings.json` for every project, `.claude/settings.json` for everyone who works on the project, and `.claude/settings.local.json` for one person in one project. The local file wins over the project file, and the project file over the user file.
- Change the file whose reach matches the purpose. A setting for one project never goes in the user file.
- Add to the file; never replace entries you did not write.
- Never put a key, a token, or a password in a settings file that Git tracks.
- Read the page for the key before you rely on it: some keys are read from only some of the files.

Check: confirm the file still parses, then confirm in a session that the setting is in force.

## Codex .rules file

A `.rules` file tells Codex which commands it may run outside the sandbox. Only Codex reads it. Claude Code sets command permissions in a settings file.

- The feature is experimental. Read the page again before every change.
- The file sits in a `rules/` folder beside a Codex settings layer: `~/.codex/rules/` for every project, `<repo>/.codex/rules/` for one project. Codex loads a project's rules only after the owner trusted the project's `.codex/` folder.
- Codex reads the files when it starts. Tell the owner to restart Codex after a change.
- Each rule is one `prefix_rule(...)` call, written in Starlark:
  - `pattern` is required: the list of words the command starts with. One position may hold a list of alternatives.
  - `decision` is `allow`, `prompt`, or `forbidden`. With none, it is `allow`.
  - `justification` is optional: the reason, in words the owner can read. For `forbidden`, name the command to use in its place.
  - `match` and `not_match` are example commands. Codex tests them when it loads the file.
- When several rules match one command, the strictest decision applies: `forbidden`, then `prompt`, then `allow`.
- Give every rule at least one `match` and one `not_match` example.
- Codex splits a `bash -lc` script into its commands only when the script is plain words joined by `&&`, `||`, `;`, or `|`. A script with a redirect, a substitution, a variable, a wildcard, or control flow is tested as one `bash -lc` command.
- Codex writes `~/.codex/rules/default.rules` itself when the owner allows a command in a session. Add to that file; never replace it.

Check: `codex execpolicy check --pretty --rules <file> -- <command>`, once with a command the rule must match and once with one it must not. The answer names the decision and the rules that matched.

## Output style

An output style is a Markdown file of instructions that Claude Code sends with every request in a session. Only Claude Code reads it.

- The file sits in `~/.claude/output-styles/` for every project or `.claude/output-styles/` for one project. A plugin ships output styles in its `output-styles/` folder.
- Every front matter field is optional: `name` (with none, the file name), `description`, and `keep-coding-instructions`. A plugin's style may also set `force-for-plugin`. Claude Code ignores a misspelled field without an error.
- `keep-coding-instructions: true` keeps Claude Code's own software engineering instructions. Without it, a custom style leaves them out. Set it in a style that changes only how replies are written.
- A style is chosen by the `outputStyle` key of a settings file. The value must equal the style's name, letter for letter, with the same capitals. A value that matches no style gives the default style, with no error.
- Keep the style short: its text is sent with every request.
- Codex never sees an output style. In Claude Code a helper agent does not get it either, except a fork, which inherits the style of the session it was forked from. Give them the path of the writing rule. `SKILL.md`, step 5, says which file is the writing rule.
- A style is an instruction, and nothing enforces it. What must happen every time goes in a hook.
- In the terminal, Claude Code reads style files when it starts. Tell the owner to restart it after a change.

Check: start a new session and run `/output-style` with no argument. It lists the styles and marks the one in use.

## Plugin manifest or marketplace file

- Claude Code reads `.claude-plugin/plugin.json`. Codex reads a `plugin.json` at the plugin's root in the Agent Plugins format; `.codex-plugin/plugin.json` is the older form and still works. A plugin for both carries the same `name` and `version` in each manifest.
- A marketplace file lists the plugins a folder or repository offers. Claude Code reads `.claude-plugin/marketplace.json`. Codex reads `.agents/plugins/marketplace.json`, in a repository or in the home folder. The two files have different fields: read the page for the product before you add one.
- `claude plugin validate` refuses a plugin name that starts with `claude-`, `anthropic-`, `anthropics-`, or `cc-plugin-`.
- A `version` in the manifest pins the plugin: a person who installed it gets a change only after the version is raised. Raise it with every shipped change.
- Codex loads every `SKILL.md` under a plugin's `skills/` folder as a skill of the plugin. No official page says how to keep one out. In a test with Codex 0.160 on 2026-10-05, Codex did not load a `SKILL.md` below a folder whose name starts with a dot. Test it again before you rely on it.

Check: `claude plugin validate <folder>`. For Codex, install the plugin into a scratch `CODEX_HOME`, never the owner's own, and list the skills it loads.

## Mod

- A mod is a Claude Code plugin whose `hooks/hooks.json` names a JavaScript or TypeScript module. Codex cannot run one.
- The feature is new and changes between releases. Read the pages again before every change.

Check: `claude plugin validate <folder>` lists what the mod hooks and calls. `claude plugin test` runs its tests with no session.

## Subagent definition or helper-agent brief

- A Claude Code subagent definition is a Markdown file in `.claude/agents/`. A Codex custom agent is a TOML file in `.codex/agents/`. Neither product reads the other's file.
- A helper starts with only the brief. State the goal, the helper's own part, the files to read first, what it must not change, how to verify the work, and what to report.
- Tell the helper to report only on its own part.
- Give the helper the writing rule in the brief: its path, or its text when the helper cannot open it. `SKILL.md`, step 5, says which file is the writing rule. A helper does not get the output style that the replies of the main session follow.
- Ask it to mark what it verified and what it inferred.

Check: read the brief as if you knew nothing else. Every file it names exists, and every instruction has one meaning.

```

## Unchanged shared files captured for comparison

- plugins/toolkit/skills/project-setup/every-project/.claude/skills/braindump/SKILL.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/filechanges/SKILL.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/shaping-a-prompt/SKILL.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/record-decision.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/file-source.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/update-system-doc.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/publish-docs/references/recovery.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/examples/handoff-example.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/assets/handoff-prompt-template.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/requirements-analyst-brief.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/acceptance-checker-brief.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/design-architect-brief.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/deploying.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/refining-requirements.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/design-critic-brief.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/testing-loop.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/designing.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/researcher-brief.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/builder-brief.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/assets/design-template.md
- plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/assets/work-item-template.md
- .claude/skills/writing-harness-files/references/official-pages.md
- .claude/skills/writing-harness-files/references/rewrite-steps.md

## Reasons

- Route selected memory consistently: Hindsight owns durable knowledge; the work tracker owns current work. Local and Notion retain their Current State process.
- Permission handling follows actual session configuration while preserving denial and concurrent work protections.
- Existing scoped authorization is recorded rather than repeatedly requested; changed scope still requires its applicable approval.
- Separate building references expose orchestration and repository detail on demand without deleting the procedures.
- Unrelated defects are triaged; fixes that alter approved requirements still need owner approval.

## Unresolved owner intent

- Keep fixed handoff AI notice pending reconciliation with no-credit policy.
- Keep helper context restrictions, retry caps, hierarchy limits and sourced-decision authority unchanged.
- No distributed writing-harness skill exists in current tree; only local .claude skill was revised.

## Review coverage

Read shared skill entries, filing references, lifecycle/building/testing/closing, handoff verifier, root/folder guides and writing skill references. The unchanged list is the comparison snapshot, not a claim of whole-file review for every template. Reviewed unchanged entries include braindump, filechanges, reset/pull/merge portions not changed, shaping-a-prompt and session-summary examples; reviewed supporting files include source/system guides and the handoff template. Remaining state/helper templates require cross-review before claiming complete behavioral validation.

## Additional coordinated fixes

- builder-brief.md now follows actual host permissions rather than requiring a tool argument that this host rejects.
- filing-project-records routes deferred local links and unblocked shared questions without inventing a Current State page for Hindsight.
- Added team-arrangement.md and build-repository.md by relocating whole sections; their procedures and uncertain requirements remain intact.

## Completed full shared-file review

Completed whole-file reads of every shared SKILL entry and its supporting references, briefs, assets and examples, plus the starter root/folder guides and system/source/test templates.

Reviewed unchanged protected purposes:
- Refining Requirements preserves owner words, source provenance, acceptance criteria, question history and changes to previously approved requirements. Its fixed counts and source-authority assumptions await owner clarification.
- Design/requirements/research/acceptance helper briefs preserve independent evidence, clear write boundaries, no self-approval, and explicit gaps.
- Work-item/design templates keep one coherent work record, stable IDs, owner decisions and acceptance checks; these schemas are necessary detail rather than repetition to remove.
- Source/reference/system/delivery guides preserve originals, authority versus observation, rule status and stable IDs, completed deployment evidence and untracked real data.
- Root starter guide provides process ownership and choice wiring; setup additions supply Hindsight override.
- Recovery reference preserves both sides of concurrent document saves, safe rebase only in isolated save worktree, and no account/protection bypass.
- Test/system/index templates retain focused starting forms and clear filing routes.

Final review fixes: handoff overdue example preserves unresolved commitments; team questions run only when arrangement not already chosen; team report points explicitly to building.md; Hindsight deferred publication is a blocker note, not a premature authoritative link; builder no-commit fallback depends on actual capabilities; designing proceeds under existing build authorization; handoff example matches Memory input label.

## Final shared implementation diff

```diff
diff --git a/.claude/skills/writing-harness-files/SKILL.md b/.claude/skills/writing-harness-files/SKILL.md
index e90c59d0..2184bcc2 100644
--- a/.claude/skills/writing-harness-files/SKILL.md
+++ b/.claude/skills/writing-harness-files/SKILL.md
@@ -23,13 +23,13 @@ Setting up or updating the toolkit in a project is the job of `project-setup`.
    - Use a copy that the project keeps only when it was captured in the last 14 days. Otherwise, read the live page.
    - When you cannot read the page, tell the owner before you write. Name the page, and say that the change is based on the checklist alone.
 3. Open the section for that kind of file in [references/checklist.md](references/checklist.md). It gives the practices and checks for the file. If the live page and checklist differ, follow the page. Tell the owner which checklist line needs correction.
-4. Read the project's own rules for these files in its root `AGENTS.md`. Then read two existing files of the same kind in the project, and match their form.
+4. Read the project's own rules for these files in its root `AGENTS.md`. Read relevant existing files of the same kind to understand the project's established names, locations, and form.
 5. Write the change.
    - Follow the project's `.claude/rules/document-clarity-standard.md` when it exists. The owner may have changed that file.
    - In a folder without that rule, follow [references/writing-rule.md](references/writing-rule.md). It is an exact copy of the rule that `project-setup` gives every project.
    - A file that both products read uses only what both support.
 6. Check the change the way the checklist section says under "Check".
-7. Have an agent that did not write the change review it against the official page, the checklist, and the writing rule. Fix each confirmed finding and have the reviewer read the fix. A small edit gets one reviewer and one read.
+7. Have an agent that did not write the change review it against the official page, the checklist, and the writing rule. Fix each confirmed finding and have the reviewer read the fix. Use review coverage appropriate to the change and its effects.
    - If the product cannot start a helper agent, review the change yourself against all three sources. Tell the owner in step 8 that no separate review ran.
 8. Tell the owner which pages you read and their dates, what you changed, and what the review found.

diff --git a/.claude/skills/writing-harness-files/references/checklist.md b/.claude/skills/writing-harness-files/references/checklist.md
index bfd752ba..516c2d0a 100644
--- a/.claude/skills/writing-harness-files/references/checklist.md
+++ b/.claude/skills/writing-harness-files/references/checklist.md
@@ -28,7 +28,7 @@ The practices were checked against the official pages on 2026-10-05 (Claude Code
 - The description says what the skill does and when to use it, in the third person, with the words the owner would say. Put the main use first. When the list of skills is over its budget, Codex cuts each description from the end, and Claude Code drops whole descriptions, starting with the skills used least. Keep it far below the limit: every session reads every description.
 - Name a neighbour skill in the description only where the two compete: "Not for ...; use <skill>."
 - `SKILL.md` stays under 500 lines. It opens as the writing rule says a document opens, then gives the steps, then a table that links every file in the folder and says when to open it.
-- A reference over 100 lines starts with a contents list. References link from `SKILL.md`, not from each other.
+- A reference over 100 lines starts with a contents list. Link supporting files directly from `SKILL.md`, with guidance on when to open each one. Cross-links may guide related work, but must not be the only way to discover a necessary file.
 - A skill names its own files by a path from the skill folder, and reads no file outside that folder.
 - In Claude Code a personal or project skill with the name of a built-in command or a bundled skill replaces it. A personal or project skill named `verify` or `simplify` is run before each commit. Choose another name unless that is the purpose.
 - Claude Code loads a skill in a `.claude/skills/` folder below the folder a session started in once the agent reads or edits a file there. A copy of a skill kept in a repository as a template is loaded this way.
diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/SKILL.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/SKILL.md
index f981206d..416f7786 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: filing-project-records
-description: 'Files sources the project receives in sources/, decisions and open questions that more than one work item needs in DECISIONS.md, and changes to documents about system rules in system/. Each record gets an ID so later work can find it. Use when the owner gives the project a source, a shared decision or question needs recording, or a system document needs updating. For a decision that only one work item needs, use managing-work-items.'
+description: 'Files sources the project receives in sources/, decisions and open questions that more than one work item needs in DECISIONS.md, and changes to documents about system rules in system/. Each record gets an ID so later work can find the authoritative record without copying it. Use when the owner gives the project a source, a shared decision or question needs recording, or a system document needs updating. For a decision that only one work item needs, use managing-work-items.'
 ---

 # Filing project records
@@ -17,6 +17,9 @@ Before you save a decision, an open question, or a rule, check that more than on

 In this skill, a record is one saved source, one entry in `DECISIONS.md`, or one rule in `system/`. To save a record is to commit the change to the default branch with `publish-docs`.

+
+Read the memory choice in `PROJECT.md`. For local or Notion memory, use `managing-project-memory` and the installed Current State page. For Hindsight, follow `.claude/rules/hindsight-memory.md` wherever these steps call for memory recall, review, saves, or corrections. Keep current work, blockers, and next actions in the selected tracker and project records; do not create a Current State page or treat its absence as a setup failure.
+
 ## Which filing step to do

 Find what happened in the table, and open only the file in that row. When one message needs more than one step, do the steps in the order of the table.
@@ -73,9 +76,9 @@ The time depends on where the project keeps its work items.
 - When work items are in Notion or GitHub, write the ID once the save is on the default branch.
 - When work items are local files, write the ID only after `publish-docs` reports that the main checkout holds the save. A local work item is kept in the main checkout, so the record that it names must be there.
 - When work items are local files and `publish-docs` reports that the main checkout does not hold the save, write no ID in the work item. Do this in its place:
-  - Give `managing-project-memory` one line for "Waiting on" in the project's Current State. The project's Current State is the project's one short page of what is true now, and "Waiting on" is one of its parts. The line holds the record's ID, each work item that needs the ID, and what `publish-docs` named as blocking the update.
+  - With Hindsight, use `managing-work-items` to write a blocker note in the affected work items explaining the pending publication and next action. Leave authoritative record-link fields unchanged until the main checkout holds the save. With local or Notion memory, give `managing-project-memory` one line for "Waiting on" in the project's Current State. The project's Current State is the project's one short page of what is true now, and "Waiting on" is one of its parts. The line holds the record's ID, each work item that needs the ID, and what `publish-docs` named as blocking the update.
   - Tell the owner the same.
-  - When the main checkout's files hold the record, write the ID in each work item, and ask `managing-project-memory` to remove that line.
+  - When the main checkout's files hold the record, write the ID in each work item, and remove the deferred-link note from the tracker or Current State through its responsible skill.

 ### A work item that must follow a record that already exists

diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/record-decision.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/record-decision.md
index 1613504a..4c5bc796 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/record-decision.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/record-decision.md
@@ -41,7 +41,7 @@ The Status of an entry is one of four words: Open (a question that waits for an
 7. Write the IDs in each work item under Affects, with `managing-work-items`. `SKILL.md`, section "When to write the ID", says when you can write them. Wait until then. On the work item's Related items line, write the DEC ID and the ID of each rule that step 5 added or changed.
    - When a Questions and Answers row in a work item raised the decision, add "Filed as DEC-###." at the end of that row's Answer cell, after the owner's words. The row keeps the owner's words.
    - When a work item cannot continue without the answer to an Open entry, that work item waits on the owner. Continue with `managing-work-items` for that work item.
-   - When no work item waits on an Open entry, give `managing-project-memory` a line for "Waiting on" in the project's Current State, with the DEC ID and who must answer.
+   - When no work item waits on an Open entry, keep its DEC ID and who must answer in `DECISIONS.md`. With local or Notion memory, also give `managing-project-memory` a "Waiting on" line in Current State. With Hindsight, use the tracker for any follow-up task and the Hindsight rule for qualifying lasting knowledge.
 8. Tell the owner the DEC ID, its Status, and the work items that now name it.

 ## Answering an open question
diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/SKILL.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/SKILL.md
index 89a2fe16..83c4aab5 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: handoff
-description: 'Updates this session''s work items and the project''s Current State, files decisions or sources left unfiled, and writes a checked, self-contained prompt for the next session or checks one the owner provides. Use when the owner ends a session, clears context, asks for a handoff prompt, or asks to check one. For a recap without a handoff, use session-summary.'
+description: 'Keeps this session''s work and project records current, reviews its chosen memory, and writes a checked prompt so the next session can continue. It also checks a prompt the owner provides. Use when the owner ends a session, clears context, asks for a handoff prompt, or asks to check one. For a recap without a handoff, use session-summary.'
 ---

 # Handoff
@@ -16,6 +16,9 @@ Two rules apply to every step:

 A recap alone, with no handoff, is the job of `session-summary`.

+
+Read the memory choice in `PROJECT.md`. For local or Notion memory, use `managing-project-memory` and the installed Current State page. For Hindsight, follow `.claude/rules/hindsight-memory.md` wherever these steps call for memory recall, review, saves, or corrections. Keep current work, blockers, and next actions in the selected tracker and project records; do not create a Current State page or treat its absence as a setup failure.
+
 ## The first line of every prompt

 Every handoff prompt starts with this line, word for word:
@@ -59,12 +62,12 @@ Do the steps in this order. Steps 1 to 4 save what this session knows. Steps 5 t
    - **An Open entry in `DECISIONS.md`.** Read the Open entries that this session raised or that name this session's work items. Put each one under "Open questions" in the prompt, with its DEC ID.

    When there is nothing to file, say so in one line.
-4. **Update the project's Current State.** The project's Current State is the project's one short page of what is true now. Read and write it with `managing-project-memory`.
+4. **Save the context for the next session.** In a Hindsight project, keep this session's next actions and outstanding blockers in the selected tracker and project records, review lasting knowledge under the Hindsight rule, and continue to step 5. With local or Notion memory, update the project's Current State. The project's Current State is the project's one short page of what is true now. Read and write it with `managing-project-memory`.
    - Write the part "Next session starts with". It has one line for each piece of work that this session worked on.
      - For a work item, the line holds the work item's ID and the words "read its Current state".
      - For a piece of work that is not a work item, the line says what the work is and its next step.
    - Check the line under "Now" for each of this session's work items. When that line is missing or no longer true, add or correct it as `managing-work-items` says.
-   - Check every other line, and remove each line that is no longer true, for example a piece of work that ended, a date that passed, or a thing owed that was delivered. `managing-project-memory/references/current-state.md`, "Removing what is no longer true", says how.
+   - Check every other line, and remove each line that is no longer true, for example a piece of work that ended, an event that ended, a resolved or cancelled deadline, or a thing owed that was delivered. `managing-project-memory/references/current-state.md`, "Removing what is no longer true", says how.
    - Set the "Last updated" line to the date, `handoff`, and `agent`.
    - When the project's Current State is missing, do not create it. Tell the owner that it is missing, and suggest the setup check (`project-setup`, "check the setup"). Put in the prompt the entry that this step would have written.
 5. **Draft the prompt. Do not show it yet.**
diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/examples/handoff-example.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/examples/handoff-example.md
index d5648eb9..240a11b2 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/examples/handoff-example.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/examples/handoff-example.md
@@ -11,7 +11,7 @@ After the brief from `references/handoff-verifier.md`, word for word:
 Draft prompt: <the whole draft below>
 Main checkout: /Users/owner/Projects/acme-billing
 Tracker: local (work-items/ in the main checkout)
-Current State: memory/CURRENT_STATE.md in the main checkout
+Memory: local (memory/CURRENT_STATE.md in the main checkout)
 Sources for claims:
 - "WI-007 is in the Building State": file, WI-007 front matter
 - "Option A is approved": file, WI-007 front matter, `design: approved`
diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/references/handoff-verifier.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/references/handoff-verifier.md
index c58cf7b4..92507ac0 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/references/handoff-verifier.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/references/handoff-verifier.md
@@ -35,8 +35,8 @@ Draft prompt: <the whole draft>
 Main checkout: <full path; the first path git worktree list prints>
 Tracker: local (work-items/ in the main checkout) | Notion (work item text
   pasted below) | GitHub Issues (<account/repository>)
-Current State: memory/CURRENT_STATE.md in the main checkout | Notion
-  (page text pasted below)
+Memory: local (memory/CURRENT_STATE.md in the main checkout) | Notion
+  (page text pasted below) | Hindsight (no Current State page; supplied records)
 Sources for claims: <for each claim you can: file, repository, owner (with
   the owner's words when you have them), or worked out>
 Supplied text: <Notion work items, the Notion Current state page, Hindsight memories>
@@ -78,7 +78,7 @@ Work items are named by ID, never by path. How you open a work item depends on t

 The other records are in these places:

-- The project's Current State is the project's one short page of what is true now. It is `memory/CURRENT_STATE.md` in the main checkout, except in a project with Notion memory.
+- Local memory uses `memory/CURRENT_STATE.md` in the main checkout; Notion memory uses its supplied Current state page. Hindsight has no Current State page. Check current work against the selected tracker and supplied project records, and lasting knowledge against the supplied Hindsight records.
 - For the Notion "Current state" page and for Hindsight memory records, use only the supplied text.
 - A decision that more than one work item needs is an entry in `DECISIONS.md`. An approved rule of the system is in `system/`. A filed source, which is something the project was given and keeps, is in `sources/`. All three are in the repository.

diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/SKILL.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/SKILL.md
index 89ba15a8..f9b76e11 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/SKILL.md
@@ -11,7 +11,7 @@ Start with [the lifecycle rules](references/lifecycle-rules.md). They define the

 If the owner asks only a question about a work item, read the current record and answer it. Do not advance the work item merely because you read it. If the item is unclear, use the root `AGENTS.md` identification order and ask when more than one item remains plausible.

-Use `filing-project-records` for a source, a decision or open question that several work items need, or a rule in `system/`. Use `managing-project-memory` for the project's Current State. The lifecycle rules say when each of these jobs applies.
+Use `filing-project-records` for a source, a decision or open question that several work items need, or a rule in `system/`. For memory, follow the choice recorded in `PROJECT.md`: use `managing-project-memory` for local or Notion memory, or `.claude/rules/hindsight-memory.md` for Hindsight. Hindsight projects keep current work in the tracker and have no Current State page. The lifecycle rules say when each of these jobs applies.

 ## Work-item procedures

@@ -22,6 +22,8 @@ Use `filing-project-records` for a source, a decision or open question that seve
 | [references/refining-requirements.md](references/refining-requirements.md) | The item is in Refining Requirements, or a requirement changes in any State. |
 | [references/designing.md](references/designing.md) | The item is in Designing. |
 | [references/building.md](references/building.md) | The item is in Building, or the owner wants a team of helpers. |
+| [references/team-arrangement.md](references/team-arrangement.md) | Building involves choosing or coordinating helpers or other chats. |
+| [references/build-repository.md](references/build-repository.md) | Building needs a branch, worktree, Git writes, or permission handling. |
 | [references/testing-loop.md](references/testing-loop.md) | The item is in the Testing Loop. |
 | [references/closing.md](references/closing.md) | The item is in Reflecting, is being marked Done or Cancelled, or was closed by hand. |
 | [references/deploying.md](references/deploying.md) | The item is in Deploying. |
@@ -40,4 +42,12 @@ Use `filing-project-records` for a source, a decision or open question that seve
 | [references/builder-brief.md](references/builder-brief.md) | You start a builder. |
 | [references/acceptance-checker-brief.md](references/acceptance-checker-brief.md) | You start the separate checker in the Testing Loop. |

+With Notion work items, setup also installs these references. Open them for the corresponding action; they are absent with other tracker choices.
+
+| File | Open it when |
+| --- | --- |
+| [references/work-tracker-page-updates.md](references/work-tracker-page-updates.md) | You update a Notion work-item page. |
+| [references/work-tracker-commands.md](references/work-tracker-commands.md) | You need the Notion tracker commands. |
+| [references/work-tracker-known-problems.md](references/work-tracker-known-problems.md) | A Notion tracker read or write fails, or you need a documented workaround. |
+
 The installed [work tracker instructions](references/work-tracker.md) list their own supporting reference files. Open only the files needed for the current action.
diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/builder-brief.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/builder-brief.md
index 8e309d7d..d23f4617 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/builder-brief.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/builder-brief.md
@@ -6,7 +6,7 @@ This file is the brief for the builder. The builder is a helper that builds one

 Start the builder from Building, as `building.md`, section "Start a builder", says. Start one builder for each planned task that can run on its own.

-In Codex with approvals turned off (`codex exec`), make no builder worktrees. Run one builder at a time in the work item's own worktree, and tell it to commit nothing.
+When the active host permits file edits but does not permit the builder to create a worktree or commit, run one builder at a time in the work item's worktree and set "Commit: no". Follow the host's actual permissions; approvals being turned off does not by itself prohibit Git writes.

 After the builder's report, follow `building.md`, section "When a helper returns".

@@ -45,7 +45,7 @@ Work only in the worktree folder you were given. If none was given, stop and rep

 - When the list of inputs says "Commit: no", write the files and report without committing.
 - Start the commit message with the task ID, for example `P1-T02: add the CSV export button`. The message has no line that credits an AI.
-- In Codex, run each Git write alone, with `sandbox_permissions` set to `require_escalated` and a one-line reason. If the command is refused, stop and report the exact command.
+- Follow the host's active permissions for Git writes. Use its supported approval mechanism when required. If a command is denied, stop and report the command and reason; never bypass the denial.
 - Never push, merge, rebase, reset, or delete a branch.

 ### Boundaries
diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/building.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/building.md
index 397c0697..6498cb60 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/building.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/building.md
@@ -58,52 +58,7 @@ The offer is the question whether helper agents build the work item. It is first

 ## The team arrangement

-The team arrangement says whether one session runs the team, or one session coordinates other sessions that each have a team. After the owner's yes to agent delivery, settle the arrangement once for each goal, unless the owner's words already chose it. Record each answer as its own Questions and Answers row.
-
-- When this session has tools to list, read, and message other sessions and to offer new sessions, ask exactly "Do you want one team inside this chat, or do you want me to rename this chat to Main Orchestrator and coordinate other chats that each have their own team?" Check that the tools are there. Never assume it.
-- Anywhere else, which means Codex or a session without those tools, say in one line that the arrangement with a Main Orchestrator and other chats is not available here. Then ask exactly "Shall I run one team of helpers inside this chat?"
-- After the owner chooses the Main Orchestrator, ask once more, exactly: "Do you want me to archive chats after their task is fully complete, everything is merged and shipped, and you approved?"
-- The owner may change the arrangement at any time. Record the new answer as a new row, and mark the old row "Superseded by Q-xx".
-
-### One team inside this session
-
-This session leads, and it starts the helpers.
-
-### Main Orchestrator with other sessions
-
-The Main Orchestrator is the session that coordinates the other sessions.
-
-- Rename this session "Main Orchestrator" with the tool that sets a session's title. When you cannot, ask the owner to rename it.
-- Run one session for each sub-item. Each of those sessions has its own main agent and its own helpers.
-- The Main Orchestrator is the only session that does these three things:
-  - It changes the goal's work items.
-  - It writes a file that more than one session changes, such as a file that holds a version number, or an index file.
-  - It merges.
-- The Main Orchestrator checks the result of each session and reports to the owner. It does not do a session's work for it.
-- The main agent of each other session reports by message. The Main Orchestrator records that report as it records the report of a returning helper, which "When a helper returns" describes.
-- Offer a new session with the tool that offers a new session. The new session starts only when the owner clicks the offer.
-- When the tool makes a worktree for the new session, put the branch in the starting prompt, and not a worktree path.
-- The starting prompt of a new session holds all of these:
-  - the sub-item's ID and what the sub-item must deliver;
-  - the pasted requirements and design sections;
-  - the new session's branch, and its worktree when the tool does not make one;
-  - the files the new session may write;
-  - the owner's instructions from `.claude/rules/owner-preferences.md` that apply to its work, in the owner's words;
-  - every permission the session needs, and only permissions that the owner or the project already gave. A session will not let a message from another session remove a limit that its own starting prompt set;
-  - the rule "build what the requirements ask and no more";
-  - that the session reports by message, and never changes a work item, merges, or asks the owner anything directly.
-- Record the id of each session in the parent's team list when the session starts. A recorded id is not proof that the session is still running.
-- Archive a session only after the owner said yes to the archive question, and only when all four of these are true:
-  1. Its task is complete.
-  2. Its work is merged to the default branch and, when the sub-item has a deployment, deployed.
-  3. Its report is recorded in its sub-item.
-  4. The owner approved the result.
-- Archive only, and never delete. An archived session can be restored.
-- After the owner's no to the archive question, leave the sessions as they are.
-
-### The model for these sessions
-
-This session, the Main Orchestrator, and the main agent of every other session run on the most capable model that Claude Code or Codex offers. A new session may otherwise copy this session's model, so set the new session's model.
+Follow [choosing and coordinating the team](team-arrangement.md) for this part of Building.

 ## Plan the team

@@ -131,48 +86,11 @@ Plan which helper builds which task before you start a builder.

 ## Git for a build

-This section gives the commands and the names for a work item's worktree and its branch. The main checkout is the project's main folder: the first path that `git worktree list` prints. In Codex, every Git command in this section also follows "Git writes in Codex" below.
-
-- Make a work item's changes to code, rules, skills, hooks, and settings in its own worktree, on its own branch, and never on the default branch.
-- Make the worktree and the branch before the first change. Make them in the main checkout, from the default branch, under its real name, for example `main`. For a sub-item, make them from its parent's branch.
-
-  ```text
-  git -C <main checkout> worktree add .claude/worktrees/wi-007-csv-export -b claude/wi-007-csv-export main
-  ```
-
-- The branch is `claude/<prefix>-<number>-<slug>`, and the folder is `.claude/worktrees/<prefix>-<number>-<slug>`.
-  - The prefix is the prefix of the work item's ID, in lower case: `wi` for `WI-007`.
-  - An ID with no prefix, such as `#12`, uses `issue`: `claude/issue-12-csv-export`.
-  - `merge-and-clean-up` finds the work item from the ID in the branch name.
-- Name `<main checkout>` with `-C` in every command. Each command starts in the session's own folder, which may be another worktree. A worktree that is made inside that folder is deleted when that folder is removed.
-- Make a builder's worktree and branch from the work item's branch. Name them with the work item's prefix and number, and then the task ID in lower case:
-
-  ```text
-  git -C <main checkout> worktree add .claude/worktrees/wi-007-p1-t01 -b claude/wi-007-p1-t01 claude/wi-007-csv-export
-  ```
-
-- A commit message and a pull request carry no AI credit: no `Co-Authored-By:` that names an AI, and no "Generated with" line.
-  - Codex has no setting that removes such a line, so write none.
-  - When a command is refused because of such a line, change the wording. Never commit in another way to get past the refusal.
-- When a merge stops on a conflict, read both sides of each conflicting file, stage each resolved file by name, and commit with a message that you write.
-  - Never run `git commit --no-edit` after a conflict, because it keeps Git's "# Conflicts:" lines in the message.
-  - When the right result of a conflict is not clear from the two sides, ask the owner.
+Follow [repository and permission steps for a build](build-repository.md) for this part of Building.

 ## Git writes in Codex

-Codex runs commands in a sandbox, which is a closed area that limits what a command can change. The sandbox keeps `.git/` read-only, so every command that writes `.git/` fails inside it.
-
-- These commands fail inside the sandbox: `add`, `commit`, `merge`, `fetch`, `pull`, `push`, `switch`, `checkout`, `restore`, `stash`, `rebase`, `reset`, `worktree add`, `worktree remove`, `branch -d`, and every other Git command that writes.
-- A command that needs the network, such as opening a pull request, fails too.
-- These reading commands run inside the sandbox: `status`, `log`, `diff`, `show`, `branch --list`, and `worktree list`.
-
-For each Git write in Codex, do this:
-
-- Run the command alone. Do not join it to another command with `&&`, `;`, or a pipe, and do not run it from a script.
-- Say in one line what the command does.
-- Ask for escalated permissions: set `sandbox_permissions` to `require_escalated`, and set `justification` to a one-line reason, such as "Create the worktree for WI-002 on its own branch." An approval without escalation still runs the command inside the sandbox, where it fails.
-- When Codex refuses the command without asking, with "approval required by policy", this session cannot ask for the approval. Stop that step, show the owner the exact command, and ask the owner to run it in a terminal or to approve it in an interactive session. Set the work item to wait on the owner.
-- Never work around a refusal: make no second clone, make no copy of `.git/`, write no script that runs Git for you, and do not build on the default branch.
+Follow [repository and permission steps for a build](build-repository.md) for this part of Building.

 ## Start a builder

diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/closing.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/closing.md
index dae51e0d..9ca4df39 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/closing.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/closing.md
@@ -4,6 +4,9 @@ Use this file to take a work item through Reflecting after the owner approved it

 Fill the Moved up line at every close: when you mark a work item Done, when you cancel it, and when the owner closed it by hand. The section "Filling the Moved up line" gives the steps. Never set a work item to Done or Cancelled while its Moved up line is empty.

+
+Read the memory choice in `PROJECT.md`. For local or Notion memory, use `managing-project-memory` and the installed Current State page. For Hindsight, follow `.claude/rules/hindsight-memory.md` wherever these steps call for memory recall, review, saves, or corrections. Keep current work, blockers, and next actions in the selected tracker and project records; do not create a Current State page or treat its absence as a setup failure.
+
 ## Contents

 - Reflecting
@@ -93,7 +96,7 @@ For a small work item on the short path, read "Closing a small work item" below,
    - Next action: "None. Finished."
    - Waiting on: "Nothing."
    - Blockers: "None."
-5. Update the project's Current State, which is the project's one short page of what is true now. `references/lifecycle-rules.md`, section "Work that another skill does", names the skill for each of these writes.
+5. With Hindsight, keep the closed item and any remaining follow-up current in the tracker, and review lasting knowledge under the Hindsight rule. With local or Notion memory, update the project's Current State, which is the project's one short page of what is true now. `references/lifecycle-rules.md`, section "Work that another skill does", names the skill for each of these writes.
    - Remove the work item's line under Now.
    - Ask `managing-project-memory` to remove the rest: each line under "Coming up" or "Waiting on" that is about this work item, and a "Next session starts with" line that names it. The reference file on the project's Current State in that skill, section "Removing what is no longer true", gives the steps.
    - For a top-level work item, check its project phase, as `references/lifecycle-rules.md`, section "Levels", says. That section says what to ask the owner when the last open work item in a project phase is closed.
@@ -128,7 +131,7 @@ Use this section when the owner cancels a work item.
 4. Set the State to Cancelled and `waiting_on` to `none`. Rewrite the work item's Current state. Write these two of its lines as follows:
    - Where it stands: "Cancelled on `YYYY-MM-DD`: <the owner's reason>."
    - Next action: "None. Cancelled."
-5. Update the project's Current State, as step 5 of "Marking Done" says.
+5. With Hindsight, keep the closed item and any remaining follow-up current in the tracker, and review lasting knowledge under the Hindsight rule. With local or Notion memory, update the project's Current State, as step 5 of "Marking Done" says.
 6. Leave the work item's open pull request, its branch, and its worktree as they are until the owner says what to do with them. Delete nothing. The offer in "Leftover branches and worktrees" covers only a merged branch, so it does not cover the unmerged branch of a cancelled work item.

 ## Done or Cancelled by hand
diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/designing.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/designing.md
index 933e2bf9..70aebc6d 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/designing.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/designing.md
@@ -43,7 +43,7 @@ Three kinds of helper do part of the work: a researcher looks up a fact, an arch
       - Put the Build order into the work item's plan. In a top-level work item, the Build order becomes Tasks under its existing Roadmap phases, or becomes its phases when it has none. In a sub-item, the Build order becomes tasks in its plain list. `references/lifecycle-rules.md`, section "Levels", says which level has phases. Never renumber, replace, or drop an existing phase.
       - Add a Recent History row that names the Q-ID, and move the work item to Building.
 11. Apply the test in the root `AGENTS.md`, section "Where information goes", to the owner's choice, as `refining-requirements.md`, step 6, says. When a different work item would need the choice, that step gives the choice to `filing-project-records`. When the choice went to Refining Requirements as a change, do this step after the owner approves the change.
-12. Stop. The build runs next, from the Roadmap. When no question is open, end the reply with the exact words that continue the work: "Say 'keep going' and I'll start the build."
+12. The build runs next, from the Roadmap. Continue when the owner already authorized the build and its prerequisites are met. Otherwise, name the next action and ask only for authorization that is still missing.

 ## A change to an approved design

diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/lifecycle-rules.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/lifecycle-rules.md
index 6edf115c..7fe43a3d 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/lifecycle-rules.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/lifecycle-rules.md
@@ -103,7 +103,7 @@ A project phase (`P01`) and a work item's phase (`P1`) are different things. A p
 ### Tasks

 - Every task belongs to exactly one place: the project, or one work item.
-- A task in a work item is a step toward that work item's goal. Work that the goal does not need is a new Backlog work item, and never a task in this work item. This rule holds even for a small fix found along the way.
+- A task in a work item is a step toward that work item's goal. Triage work outside the approved goal as a separate Backlog work item. When a defect prevents the approved user flow from working, record the defect and the fix needed to meet the approved requirements in this item. If the fix changes those requirements or an owner decision, get the required approval through Refining Requirements before building it.
 - A task ID has one of three forms:
   - `P1-T01` in a top-level work item: the work item's phase, then the task's number.
   - `T01` in a sub-item.
@@ -129,7 +129,7 @@ Whenever you report what waits on the owner or what other people owe, name each

 ## When to stop for the owner's yes

-Stop and ask the owner before each of these six steps. Record the owner's yes only when the owner answers the question you asked.
+Stop and ask the owner before each of these six steps. Record the owner's authorization and what it covers. An explicit instruction or an earlier approval for the same scope counts; ask only for an approval that is still missing. Authorization for one step does not authorize another step or a changed result.

 1. Approving the requirements, at the end of Refining Requirements.
 2. Choosing the design, at the end of Designing.
@@ -220,7 +220,7 @@ A work item that cannot continue until an Open entry in `DECISIONS.md` is answer

 ### The work item's line in the project's Current State

-The project's Current State is the project's one short page of what is true now. It holds one line for a work item from the time the work item leaves Backlog until it is Done or Cancelled.
+This section applies to local or Notion memory. The project's Current State holds one line for an active work item. With Hindsight, keep active work and next actions in the selected tracker instead; follow `.claude/rules/hindsight-memory.md` for lasting knowledge, and create no Current State page.

 - Decide the line in this skill, in the form that the project's memory gives for a line under Now. Now is one of the parts of the project's Current State.
 - Add, change, or remove the line as the table in "Work that another skill does" says.
diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/merge-and-clean-up/SKILL.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/merge-and-clean-up/SKILL.md
index 16d4897b..1d126fdf 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/merge-and-clean-up/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/merge-and-clean-up/SKILL.md
@@ -214,7 +214,7 @@ Verify four things:

 ## Mistakes to avoid

-- In Codex, the sandbox keeps `.git/` read-only and blocks the network. Run each Git write and each network call alone, with escalated permissions (`sandbox_permissions` set to `require_escalated`, with a one-line reason). Every `gh` call is a network call. When Codex refuses without asking, show the owner the exact command and ask the owner to run it.
+- Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.
 - When the repository has no remote (`git remote` prints nothing), there is no pull request, so this skill does not apply. Never fetch. Tell the owner in one line.

 ## Work that another skill does
diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/publish-docs/SKILL.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/publish-docs/SKILL.md
index 403ac172..2ccf4717 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/publish-docs/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/publish-docs/SKILL.md
@@ -177,7 +177,7 @@ The save is still finished. Say so in the reply in one line: "The main checkout
 - Never make, stage, or commit this save's edit in the main checkout.
 - Never start a save from inside another save worktree.
 - Other `docsave-` worktrees in `git worktree list` belong to other sessions. Do not change or remove them.
-- In Codex, the sandbox keeps `.git/` read-only and blocks the network. Run each Git write and each network call in this skill alone, with escalated permissions (`sandbox_permissions` set to `require_escalated`, with a one-line reason). The commands in `references/recovery.md` are included. When Codex refuses without asking, show the owner the exact command and ask the owner to run it.
+- Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.

 ## Work that another skill does

diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/pull-latest/SKILL.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/pull-latest/SKILL.md
index 576a47e5..7d622d02 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/pull-latest/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/pull-latest/SKILL.md
@@ -83,13 +83,7 @@ now.
   result is not clear, stage each resolved file by name, and commit with a
   message you write, with no AI credit line. Never `git commit --no-edit`
   after a conflict.
-- In Codex the sandbox keeps `.git/` read-only and blocks the network. Run
-  each Git write and each network call (here `git fetch`,
-  `git remote show origin`, `git pull`, `git merge`, `git add`, and
-  `git commit`) alone, with escalated permissions
-  (`sandbox_permissions` set to `require_escalated`, with a one-line reason).
-  When Codex refuses without asking, show the owner the exact command and
-  ask the owner to run it.
+- Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.

 ## Work that another skill does

diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/reset-to-remote/SKILL.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/reset-to-remote/SKILL.md
index edc0b6f2..7c357f35 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/reset-to-remote/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/reset-to-remote/SKILL.md
@@ -90,7 +90,7 @@ Every other worktree is one of the "other worktrees" in step 2. This session's o
 - `work-items/`, `memory/`, and `.obsidian/` are Git-ignored, so the reset leaves them as they are. Never run `git clean` with `-x` or `-X`, because it deletes them and Git cannot bring them back.
 - Never run `git pull`, never use `--force` on `git fetch`, and never push.
 - In Claude Code, the project's settings ask the owner before every `git reset --hard` and every `git clean`. That prompt is expected.
-- In Codex, the sandbox keeps `.git/` read-only and blocks the network. Run each Git write and each network call alone, with escalated permissions (`sandbox_permissions` set to `require_escalated`, with a one-line reason). The `gh pr list` check and the lockfile install are included. When Codex refuses without asking, show the owner the exact command and ask the owner to run it.
+- Follow the active host's filesystem, network, and approval settings for Git and service commands. Use the permission mechanism that the host supports when an operation requires it. If the host denies an operation, report the command and reason, and follow its approval process or ask the owner to run the command. Never bypass a denial or move the work onto the default branch to avoid it.

 ## Work that another skill does

diff --git a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/session-summary/SKILL.md b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/session-summary/SKILL.md
index 0d5ed5bc..c98c8187 100644
--- a/plugins/toolkit/skills/project-setup/every-project/.claude/skills/session-summary/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/every-project/.claude/skills/session-summary/SKILL.md
@@ -42,7 +42,7 @@ session is one chat with the agent.

 ## One row per request

-A row is a request, not a step; a long session usually holds one to three.
+A row is an owner request, not a step taken to carry it out.
 The owner choosing from options you offered, answering your question, or
 adjusting work under way, parts of one job, and work you suggested and then
 did all belong to the request that prompted them. If a cell turns into a list
```

## Shared repository rule

Read all every-project rule files. Changed only the unsupported universal Codex escalation assumption in shared-repository-work.md to actual host permission handling. Read official Claude memory and Codex AGENTS guidance on October 10, 2026. Preserved separate worktrees, named staging, no interference with other sessions, merge safety and explicit scoped merge authorization. Clarity, evaluate-owner and owner-preferences rules remain unchanged.

## Final fresh-reader route fixes

Re-read file-source.md and closing.md after integrating selected memory directly at affected steps. Active dates/deadlines belong to tracker tasks; lasting/unverified knowledge uses the selected memory rule. Closure searches and unproven lessons name the selected memory process. Hindsight procedural lessons write actual approved standing instructions with provenance, not only memory history. Publication blockers use tracker notes without claiming a record link; Current State cleanup only applies to local/Notion memory. Manual closure follows the selected path. Added truthful Kept in work item outcome for a lesson that does not qualify for lasting memory, preserving existing outcome text. This changes no approval gate, authoritative decision rule, or publication prerequisite. Parent assigns independent fresh-reader verification.

---
name: merge-and-clean-up
description: 'Merges one approved GitHub pull request only after its checks and the merge-safety check pass. It then removes only that pull request''s branches and worktree. Use when the owner names a pull request to merge or managing-work-items requests its merge. For an entire work item through merge and deployment, use managing-work-items.'
---

# Merge and clean up

Use this skill to merge one exact GitHub pull request and to confirm that GitHub reports it merged. After that, the skill removes only that pull request's worktree and branches. The goal is that nothing unchecked is merged, and that no other session's work is removed.

This skill merges one pull request. Taking an approved work item through merge and deployment is the job of `managing-work-items`, which uses this skill for the merge. When the repository has no remote (`git remote` prints nothing), there is no pull request: never fetch, and tell the owner that `managing-work-items` does the local merge.

Four rules apply to every step:

- Merge only the head commit that was checked and approved.
- Never stash, reset, switch, or discard another session's work.
- Run each command on its own.
- When more than one pull request could match, ask the owner which pull request to merge.

When a step below stops, refuses, or finds the pull request in an unexpected state, follow [references/merge-failures.md](references/merge-failures.md).

## Step 1: resolve the exact pull request

Use the number or URL the owner or `managing-work-items` supplied. Resolve its repository from that URL or the confirmed project repository. Only when no pull request was supplied, use the current branch to identify it with `gh pr view`. Confirm that the result matches the requested pull request before continuing.

```text
gh pr view <number-or-url> --repo <owner/repo> --json number,url,state,headRefName,headRefOid,baseRefName,baseRefOid,isCrossRepository,title,body,commits
git worktree list --porcelain
git remote -v
```

`<remote>` is the local remote whose fetch and push URLs identify that repository. When no remote matches, skip the local update and cleanup in step 6. `<head-worktree>` holds the head branch, and `<base-worktree>` holds the base branch.

When the local head branch exists, it must be at `headRefOid`. When it is at another commit, the local branch may hold work that is not in the pull request. Stop, keep the branch, and tell the owner.

Find the linked work item with `managing-work-items`, from the work item ID in the branch name or the pull request.

## Step 2: check the merge is allowed

The merge is allowed in two cases. When neither case is true, stop and ask the owner.

- **The owner's own yes to this merge, in this session.**
  - "Merge and clean up" counts only when the pull request is clear from a number, a URL, or the current branch.
  - A bare "yes" counts only when it answers a question about this merge.
  - The owner's yes to the result of a work item never covers the merge.
- **`managing-work-items` sent you here.** That skill has already asked the owner, or checked the owner's standing merge instruction.

A standing merge instruction is a line in `.claude/rules/owner-preferences.md` in which the owner allows merges without a question each time. Only `managing-work-items` applies it, in its Deploying steps, because that skill holds the conditions for it. When you reached this skill in any other way, the standing merge instruction does not count here: ask the owner.

## Step 3: check the pull request on GitHub

```text
gh pr view <number> --repo <owner/repo> --json state,isDraft,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,headRefOid,baseRefName,baseRefOid
gh pr checks <number> --repo <owner/repo>
```

Merge only when all of these are true:

- The pull request is open and is not a draft.
- The pull request is mergeable.
- The required reviews are satisfied.
- The required checks passed.
- The head commit, base branch, and base commit still match step 1.
- A worktree that holds the head branch is clean: `git -C <head-worktree> status --porcelain` prints nothing. Never stash or discard its changes.

## Step 4: check the merge target and file overlap

Other sessions may have uncommitted work in the checkouts the merge changes. This check is the one every merge in the project uses, including a local merge with no remote.

1. Resolve the target: a sub-item's branch targets its parent's branch, and a top-level item targets the default branch, found as `pull-latest`, "Find the remote and the default branch", says. For a pull request, the target is its base branch.
2. List the files the merge changes: `gh pr diff <number> --repo <owner/repo> --name-only` for a pull request, including one from a fork or into a non-default branch, or `git diff --name-only <target-branch>...<branch>` for a local merge.
3. List the uncommitted files with `git -C <main-checkout> status --porcelain`, and with `git -C <base-worktree> status --porcelain` when the target's worktree differs from the main checkout.
4. When a file is in both lists, stop, name exactly those files, and let the owner decide whether to commit, stash, or wait. Never change, stage, stash, or discard those changes.

For a pull request, re-read its head and base as in step 3 after the diff. If either commit or the base branch changed, repeat the checks for the newly resolved pull request, and apply step 2 to the new head; never merge a new head under the earlier head's approval.

## Step 5: merge

Use `--squash` unless the owner or the project's rules name another method (`--merge` or `--rebase`). Before merging, write the merge message as [references/special-merge-cases.md](references/special-merge-cases.md) says.

```text
gh pr merge <number> --repo <owner/repo> --squash --delete-branch --match-head-commit <headRefOid>
```

- For a fork, leave out `--delete-branch`.
- Never add an admin flag or a flag that bypasses branch protection.
- Never leave out `--match-head-commit`, and never fill it with a newer commit.

Then run `gh pr view <number> --repo <owner/repo> --json state,mergeCommit,url`. Clean up only when `state` is `MERGED`.

## Step 6: update the base worktree, then remove only the merged worktree and branches

When the base worktree exists, its upstream is the pull request's base branch in the same repository, and `<remote>` matched in step 1, run `git -C <base-worktree> fetch --prune <remote>`. Then update it to `@{u}` as `pull-latest`, "Update the main checkout safely", says, with the base worktree and the base branch in place of the main checkout and the default branch. When any of these is missing, or the update is blocked, change nothing there, skip the local cleanup, and report why.

Remove nothing unless all these proofs hold:

1. GitHub reports this exact pull request merged.
2. The branch to remove is the pull request's head branch, not the base branch or the default branch.
3. The worktree to remove is clean.
4. The local branch is still at the recorded head commit.
5. No other worktree uses that branch.

When a proof is missing, tell the owner which proof failed and exactly what is still there. Run the cleanup from the base worktree, never from inside the worktree that is being removed:

```text
git -C <base-worktree> worktree remove <head-worktree>
git -C <base-worktree> branch -d <head-branch>
git -C <base-worktree> worktree prune
```

- After a squash merge, `git branch -d` can refuse. Use `git branch -D <head-branch>` only for this pull request's head branch, and only when all the proofs hold.
- When GitHub did not delete the remote branch, run `git -C <base-worktree> push <remote> --delete <head-branch>`, but only when the branch is in the same repository and belongs to this pull request. Then run `git -C <base-worktree> fetch --prune <remote>`.
- Never delete a fork branch.

## Step 7: work item note and report

When step 1 found a linked work item and the owner asked you directly, add one Recent History row with `managing-work-items`: "Merged pull request #<number> as <merge commit>." When `managing-work-items` sent you here, add nothing, because that skill adds the row. Never change the State, and never mark anything Done.

Report the pull request link, the merge commit, the base worktree's state, and the cleanup result. When `managing-work-items` sent you here, keep it brief and go on with the rest of its Deploying steps. Otherwise, state any decision the owner must make or the next available action.

## Work that another skill does

| For | Use |
| --- | --- |
| Taking an approved work item through merge and deployment, a merge under the standing merge instruction, or a local merge with no remote | `managing-work-items` |
| Changing the work item's State, or marking it Done | `managing-work-items` |

## References

| File | Open it when |
| --- | --- |
| [references/special-merge-cases.md](references/special-merge-cases.md) | Step 5: keep AI credit out of the merge commit. |
| [references/merge-failures.md](references/merge-failures.md) | A check fails or is pending, the pull request is already merged or closed, GitHub refuses or queues the merge, or a new head commit arrives. |

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
- `<head-worktree>` is the worktree that holds the head branch, and `<base-worktree>` is the worktree that holds the base branch.

## Step 1: resolve the exact pull request

Use the number or URL the owner or `managing-work-items` supplied. Resolve its repository from that URL or the confirmed project repository. Only when no pull request was supplied, use the current branch to identify it with `gh pr view`. Confirm that the result matches the requested pull request before continuing.

Read that exact pull request, the worktrees and the configured remotes:

```text
gh pr view <number-or-url> --repo <owner/repo> --json number,url,state,headRefName,headRefOid,baseRefName,baseRefOid,isCrossRepository,title,body,commits
git worktree list --porcelain
git remote -v
```

Record these facts:

- the repository, including its GitHub host;
- the verified local remote whose fetch and push URLs identify that repository, as `<remote>`; when no matching remote exists, skip local update and cleanup;
- the pull request number and URL;
- the head branch and the head commit (`headRefOid`);
- the base branch and its commit (`baseRefOid`);
- the worktrees that hold the head branch and the base branch;
- whether the head branch is in a fork.

When the local head branch exists, it must be at `headRefOid`. When it is at another commit, the local branch may hold work that is not in the pull request. Stop before step 2, keep the branch, and tell the owner.

Find the linked work item with `managing-work-items`, using the work item ID in the branch name or pull request and the project's configured tracker.

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
gh pr view <number> --repo <owner/repo> --json state,isDraft,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,headRefOid,baseRefName,baseRefOid
gh pr checks <number> --repo <owner/repo>
```

Merge only when all of these are true:

- The pull request is open and is not a draft.
- The pull request is mergeable.
- The required reviews are satisfied.
- The required checks passed.
- The head commit, base branch and base commit still match what step 1 recorded.

These cases change the step:

- When the pull request is already merged, skip the merge. Record its merge commit, and check again that the head branch and the head commit match what you plan to remove.
- When the pull request was closed without merging, or a check failed, stop and report.
- When no checks exist, `gh pr checks` exits nonzero. That exit code is not a failure. Run the checks that the project's `AGENTS.md` names under "Commands", and say plainly when no automated check exists.
- When checks are pending and the owner asked you to finish the merge, wait with `gh pr checks <number> --repo <owner/repo> --watch`, and then run step 3 again. When the owner did not ask you to finish the merge, stop and tell the owner which checks are running.
- A worktree that holds the head branch must be clean, which means that `git -C <head-worktree> status --porcelain` prints nothing. When it is not clean, stop the merge and the cleanup. Never stash or discard its changes.

## Step 4: merge-safety check

Other sessions may have uncommitted work in the main checkout. Read the files changed by this exact pull request against its actual base, then check the main checkout:

```text
gh pr diff <number> --repo <owner/repo> --name-only
git -C <main-checkout> status --porcelain
```

The first command lists the files that the pull request changes, including a pull request from a fork or into a non-default branch. The second lists the files with uncommitted changes in the main checkout. When the base worktree exists and differs from the main checkout, also run `git -C <base-worktree> status --porcelain`. Compare the pull request's changed files with uncommitted paths in both worktrees. Re-read the pull request's head and base as in step 3 after the diff. If either commit or the base branch changed, repeat the checks for the newly resolved pull request. Apply step 2 to the checked head; do not merge a new head under the earlier head's approval.

When a file is in both lists, stop, name exactly those files, and let the owner decide whether to commit, stash, or wait. Never change, stage, stash, or discard the main checkout's changes.

## Step 5: merge

Use `--squash` unless the owner or the project's rules name another method (`--merge` or `--rebase`).

Before merging, follow [references/special-merge-cases.md](references/special-merge-cases.md) to keep AI credit off the base branch.

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

When GitHub queues the pull request or turns on auto-merge, follow [references/special-merge-cases.md](references/special-merge-cases.md). Remove nothing until GitHub reports `MERGED`.

## Step 6: update the base worktree, then remove only the merged worktree and branches

### Update the base worktree

When no base worktree or matching remote exists, skip the checkout update and local cleanup, and report what remains. Verify that the base branch's upstream is the pull request's base branch in that same repository. When it is not, skip local update and cleanup; do not retarget it. Otherwise run `git -C <base-worktree> fetch --prune <remote>` and `git -C <base-worktree> status --porcelain`.

List the update's affected files with `git -C <base-worktree> diff --name-only HEAD..@{u}`. Compare that list with the base worktree's uncommitted paths separately from the pull request overlap check. A blocking file is in both lists. Leave every unrelated uncommitted file as it is.

- When there is no blocking file and the base worktree is on the base branch, run `git -C <base-worktree> pull --ff-only`.
- When there is a blocking file, or the base worktree is on another branch, or the pull fails, change nothing in the base worktree and skip the local cleanup. Report which of the three it was.
- Never reset, stash, switch, or rebase the base worktree.

### Remove the worktree and the branches

Remove nothing unless all the proofs hold:

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

- After a squash merge, `git branch -d` can refuse. Use `git branch -D <head-branch>` only for this pull request's head branch, and only when all the proofs hold.
- When GitHub did not delete the remote branch, run `git -C <base-worktree> push <remote> --delete <head-branch>`, but only when the branch is in the same repository and belongs to this pull request. Then run `git -C <base-worktree> fetch --prune <remote>`.
- Never delete a fork branch.

## Step 7: work item note and report

### The note on the work item

When step 1 found a linked work item:

- When `managing-work-items` sent you here, add nothing, because that skill adds the Recent History row.
- When the owner asked you directly, add one Recent History row with `managing-work-items`: "Merged pull request #<number> as <merge commit>."

Never change the State, and never mark anything Done.

### Verify

Verify each of these:

- The pull request is merged.
- The base worktree matches its upstream, which is the remote branch that its branch follows.
- The head branch and its worktree are gone.
- Every unrelated worktree remains.

### Report

- When `managing-work-items` sent you here, say the pull request link, the merge commit, and the cleanup result briefly. Then go on with the rest of its Deploying steps.
- When the owner asked you directly, report each of these:
  - the pull request link;
  - the merge commit;
  - whether the base worktree is up to date;
  - any uncommitted files left in the base worktree;
  - the cleanup result;
  - whether the Recent History row was saved. Follow `managing-work-items/references/reporting-a-save.md` for a failed or unverified save.

  State any decision the owner must make or the next available action.

## Mistakes to avoid

- When the repository has no remote (`git remote` prints nothing), there is no pull request, so this skill does not apply. Never fetch. Tell the owner briefly.

## Work that another skill does

| For | Use |
| --- | --- |
| The merge note on the work item, when the owner asked directly | `managing-work-items` |
| Changing the work item's State, or marking it Done | `managing-work-items` |
| Taking an approved work item through merge and deployment | `managing-work-items` |
| A merge under the standing merge instruction | `managing-work-items` |
| No remote: the local merge | `managing-work-items` |

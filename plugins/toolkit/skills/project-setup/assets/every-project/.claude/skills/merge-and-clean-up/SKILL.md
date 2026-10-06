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

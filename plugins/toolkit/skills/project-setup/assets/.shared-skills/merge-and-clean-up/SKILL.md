---
name: merge-and-clean-up
description: 'Merges one approved GitHub pull request, then removes only its branches and worktree, after its checks and the merge-safety check pass, so nothing unchecked is merged and no other session''s work is removed. Use when managing-work-items asks, or the owner names a pull request: "merge PR 12", "merge and clean up", "land this pull request". Not for shipping an approved work item; use managing-work-items.'
---

# Merge and clean up

Merge one exact pull request, confirm GitHub reports it merged, then remove
only its worktree and branches. Merge only the head commit that was checked
and approved, and never stash, reset, switch, or discard another session's
work. Run each command on its own. Ask which pull request when more than one
could match.

## Step 1: resolve the exact pull request

```text
gh pr view --json number,url,state,headRefName,headRefOid,baseRefName,isCrossRepository,title,body,commits
git worktree list --porcelain
```

Record the repository, pull request number and URL, head branch and head
commit (`headRefOid`), base branch, the worktrees holding the head and base
branches, and whether the head branch is in a fork. If the local head branch
exists, it must be at `headRefOid`. If not, it may hold work that is not in
the pull request: stop before step 2, keep the branch, and tell the owner.

Find the linked work item from the head branch name (`claude/wi-007-<slug>` is
`WI-007`, `claude/issue-12-<slug>` is GitHub issue `#12`), or from an ID in
the pull request title or "Part of #12" in its body. None: skip the note in
step 7.

## Step 2: check the merge is allowed

Neither of these: stop and ask.

- The owner's own yes to this merge, in this conversation. "Merge and clean
  up" counts only when the pull request is clear from a number, a URL, or the
  current branch. A bare "yes" counts only when it answers a question about
  this merge. His result approval of a work item never covers the merge.
- `managing-work-items` sent you here: it has already asked him, or checked
  his standing merge instruction.

A standing merge instruction in `.claude/rules/owner-preferences.md` is
applied only by `managing-work-items` (Deploying), which holds its
conditions. Reached any other way, it does not count here: ask.

## Step 3: check the pull request on GitHub

```text
gh pr view <number> --repo <owner/repo> --json state,isDraft,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,headRefOid,baseRefName
gh pr checks <number> --repo <owner/repo>
```

Merge only when the pull request is open and not a draft, mergeable, required
reviews are satisfied, required checks passed, and the head and base still
match step 1.

- Already merged: skip the merge, record its merge commit, and recheck that
  the head branch and commit match what you plan to remove.
- Closed without merging, or a failed check: stop and report.
- `gh pr checks` exits nonzero when no checks exist. That is not a failure.
  Run the checks the project's `AGENTS.md` names under "Commands", and say
  plainly when no automated check exists.
- Pending checks: when the owner asked you to finish the merge, wait with
  `gh pr checks <number> --repo <owner/repo> --watch`, then run step 3 again.
  Otherwise stop and tell him which are running.
- A worktree holding the head branch must be clean
  (`git -C <head-worktree> status --porcelain` prints nothing). Otherwise stop
  the merge and the cleanup; never stash or discard.

## Step 4: merge-safety check

Other sessions may have uncommitted work in the main checkout (the first path
`git worktree list` prints). Fetch first, so the comparison uses the remote's
default branch:

```text
git fetch origin
git diff --name-only origin/<default-branch>...<head-branch>
git -C <main-checkout> status --porcelain
```

With no local head branch, use `origin/<head-branch>`. For a pull request from
a fork, use `gh pr diff <number> --repo <owner/repo> --name-only`. A file in
both lists: stop, name exactly those files, and let the owner decide whether
to commit, stash, or wait. Never touch the main checkout's changes.

## Step 5: merge

Use `--squash` unless the owner or the project's rules name another method
(`--merge` or `--rebase`).

The merge must put no AI credit on the base branch: no `Co-Authored-By:` line
naming an AI and no "Generated with" line. Look for one in the title, the
description, and each commit message that step 1 read:

- In the title or description: remove it with
  `gh pr edit <number> --repo <owner/repo>` and `--title` or `--body-file`.
- In a commit message, with `--squash`: GitHub writes the new commit's
  message from the commits' messages, so add
  `--subject '<title> (#<number>)'` and
  `--body '<what changed, in one or two plain sentences>'` to the merge
  command. Never write a word that closes an issue or a work item in them.
- In a commit message, with `--merge` or `--rebase`: the commits reach the
  base branch as they are. Stop and tell the owner.

```text
gh pr merge <number> --repo <owner/repo> --squash --delete-branch --match-head-commit <headRefOid>
```

Leave out `--delete-branch` for a fork. Never add an admin or
protection-bypass flag. Never leave out `--match-head-commit` or fill it with
a newer commit.

- Refused because the head no longer matches: a new commit arrived. Stop,
  report it, and run steps 1 to 4 again on it. The owner's yes covers only
  the head he was shown, so ask again. From `managing-work-items`: go back to
  its merge step with the new head.
- Any other refusal: stop and tell the owner the error.

Then run `gh pr view <number> --repo <owner/repo> --json state,mergeCommit,url`.
Clean up only when `state` is `MERGED`. `gh pr merge` does not always merge:
with required checks not yet passed it turns on auto-merge, and on a base
branch with a merge queue it refuses `--delete-branch` and, without that flag,
only queues the pull request (do not run it again unless the owner says to).
Then remove nothing, and tell the owner the state.

## Step 6: update the base worktree, then remove only the merged worktree and branches

Run `git -C <base-worktree> fetch --prune origin` and
`git -C <base-worktree> status --porcelain`. An uncommitted file in the base
worktree blocks this step only when it is also in step 4's list of the files
this pull request changed. Any other uncommitted file blocks nothing: leave
it as it is. Not blocked: run `git -C <base-worktree> pull --ff-only`. If
the base worktree holds a blocking file, is on another branch, or cannot
fast-forward, leave it untouched, skip the local cleanup, and report the
blocker. Never reset, stash, switch, or rebase it.

Remove nothing unless all five proofs hold:

1. GitHub reports this exact pull request merged.
2. The branch to remove is the pull request's head branch, not the base or
   default branch.
3. The worktree to remove is clean.
4. The local branch is still at the recorded head commit.
5. No other worktree uses that branch.

If a proof is missing, tell the owner which one failed and exactly what is
still there. Run cleanup from the base worktree, never from inside the
worktree being removed:

```text
git -C <base-worktree> worktree remove <head-worktree>
git -C <base-worktree> branch -d <head-branch>
git -C <base-worktree> worktree prune
```

After a squash merge `git branch -d` can refuse. Use
`git branch -D <head-branch>` only for this pull request's head branch, with
all five proofs holding. If GitHub did not delete the remote branch, run
`git -C <base-worktree> push origin --delete <head-branch>` only when it is in
the same repository and belongs to this pull request, then
`git -C <base-worktree> fetch --prune origin`. Never delete a fork branch.

## Step 7: work item note and report

When step 1 found a work item: from `managing-work-items`, add nothing (it
adds the Recent History row); asked directly, add one row, "Merged pull
request #<number> as <merge commit>.", with `tracking-work-items`. Never
change the State or mark anything Done.

Verify: the pull request is merged; the base worktree matches its upstream;
the head branch and its worktree are gone; every unrelated worktree remains.

- From `managing-work-items`: say the pull request link, the merge commit,
  and the cleanup result in one line, then go on with the rest of its
  Deploying steps.
- Asked directly: the pull request link, the merge commit, whether the base
  worktree is up to date, any uncommitted files left in it, the cleanup
  result, and whether the Recent History row was saved (a failed save starts
  that line with "Not saved"). End with the one question for the owner, or
  the exact words that continue ("Say 'finish WI-007' and I'll close the
  work item.").

## Gotchas

- In Codex the sandbox keeps `.git/` read-only and blocks the network. Run
  each Git write and each network call (every `gh` call included) alone,
  with escalated permissions (`sandbox_permissions` set to
  `require_escalated`, with a one-line reason). When Codex refuses without
  asking, show the owner the exact command and ask him to run it.
- No remote (`git remote` prints nothing): there is no pull request, so this
  skill does not apply. Never fetch. Tell the owner in one line.

## Hand-offs

| For | Use |
| --- | --- |
| The merge note on the work item, when the owner asked directly | `tracking-work-items` |
| Changing the work item's State, or marking it Done | `managing-work-items` |
| Shipping an approved work item | `managing-work-items` |
| A merge under the standing merge instruction | `managing-work-items` |
| No remote: the local merge | `managing-work-items` |

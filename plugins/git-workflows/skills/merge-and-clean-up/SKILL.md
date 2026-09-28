---
name: merge-and-clean-up
description: 'Merges one approved GitHub pull request and removes only that pull request''s branches and worktree, after its checks and the merge-safety check pass. Use when the owner or work-finish asks to merge a named pull request, for example "merge PR 12", "merge and clean up", or "land this pull request".'
---

# Merge and clean up

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

Land one exact pull request, prove it merged, then remove only the workspace
that belonged to it. Merge and cleanup are one guarded workflow.

1. **Resolve the exact pull request** and map branches to worktrees. The local
   head branch must be at the pull request's head commit.
2. **Check the merge is allowed:** the owner's yes for this pull request, or a
   standing merge instruction recorded in `DECISIONS.md`.
3. **Preflight on GitHub:** open, not a draft, mergeable, reviews satisfied,
   required checks passed. "No checks reported" is not a failure.
4. **Merge-safety check:** after a fetch, compare
   `git diff --name-only origin/<default>...<branch>` with `git status` in the
   primary checkout. A file in both lists: stop and name it.
5. **Merge** with
   `gh pr merge <n> --squash --delete-branch --match-head-commit <headRefOid>`,
   using the head commit recorded in step 1 (no admin flags), then confirm the
   state is `MERGED`.
6. **Fast-forward the base checkout**, then remove only this pull request's
   worktree and branches.
7. **Add one history note** to the linked work item. Stage moves and Done stay
   with `work-finish`. Report the link, the merge commit, and the cleanup
   result.

## Gotchas

- Codex keeps `.git/` read-only and turns the network off. Every Git write
  here (`git fetch`, `git pull`, `git push`, `git worktree remove`,
  `git branch -d`) and every `gh` call runs alone, with `sandbox_permissions`
  set to `require_escalated` and a one-line reason. Refused without asking:
  show the owner the exact command and wait (`references/git-rules.md`, "Git
  writes in Codex").
- No remote (`git remote` prints nothing): there is no pull request, so this
  skill does not apply. Never run `git fetch`, and never report a fetch
  refusal as a blocker. Say so in one line; the local merge of a work item's
  branch belongs to `work-finish` (`references/git-rules.md`, "A project with
  no remote").
- A squash merge leaves the old branch commit outside the base, so
  `git branch -d` can refuse after a good merge. `git branch -D` is allowed
  only for this pull request's head branch, with all five proofs in step 6.
- The result approval of a work item never covers the merge. The merge needs
  its own yes, or a standing merge instruction whose conditions hold on this
  exact head.
- A commit pushed after step 1 would be merged without anyone checking it.
  `--match-head-commit <headRefOid>` makes GitHub refuse the merge when the
  head is no longer the commit step 1 recorded. A refusal means a new commit
  arrived: stop, and run steps 1 to 4 again on the new head.

## Safety rules

- "Merge and clean up" is merge approval only when the target pull request is
  clear from a number, a URL, or the current branch. Ask when more than one
  could match.
- Read the project's `AGENTS.md` and `.claude/rules/` first. Project rules decide
  required checks, merge method, and who may merge.
- Never merge a draft, bypass branch protection, use an admin override,
  force-push, or ignore a failed required check.
- Never delete anything before GitHub reports the pull request as `MERGED`.
- Never delete the default branch, the base branch, an unrelated branch or
  worktree, a dirty worktree, or a branch with local commits that are not in the
  pull request head.
- List every worktree before and after cleanup. Unrelated ones stay.
- If any proof is missing, stop at the safe point and report exactly what
  remains.

## 1. Resolve the exact target

Take the repository and pull request from the number or URL. For "this PR",
resolve it from the current checkout:

```bash
git status -sb
git remote -v
git rev-parse --abbrev-ref HEAD
gh pr view --json number,url,state,headRefName,headRefOid,baseRefName,isCrossRepository,title,body
```

Record: repository owner and name, pull request number and URL, head branch and
head commit, base branch, the worktree holding the head branch (if any), the
worktree holding the base branch, and whether the head branch is in a fork. Map
branches to paths with:

```bash
git worktree list --porcelain
```

If the local head branch exists, its commit must equal `headRefOid` before you
promise it can be deleted. A different commit means local-only work exists: stop
and keep it.

Find the linked work item id: a head branch named like `claude/wi-007-<slug>`
(or `wi-007-<slug>`), or any branch containing `WI-007`, belongs to `WI-007`.
The id prefix is in lower case in a branch name, so `claude/tv2-007-<slug>`
belongs to `TV2-007`. Otherwise look for an id in the pull request title or
body. No id found: skip the history note in step 7.

## 2. Check the merge is allowed

The merge needs one of these:

- The owner's own yes for this pull request, in this conversation.
- A standing merge instruction recorded in `DECISIONS.md` whose conditions
  hold on this exact head. Open `references/approvals.md`, "Standing merge
  instruction", for where it is recorded, the conditions it carries (for
  example an independent check with no blocking findings on this head), and
  what overrides it.

A work item that says its merge needs the owner's approval overrides a
standing instruction. When neither is present, stop and ask the owner.
`work-finish` asks for this approval; this skill only checks it.

## 3. Preflight

```bash
gh pr view <number> --repo <owner/repo> \
  --json number,title,state,isDraft,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,headRefName,headRefOid,baseRefName,isCrossRepository,url
gh pr checks <number> --repo <owner/repo>
```

Merge only when the pull request is open and not a draft, GitHub reports it
mergeable, required reviews are satisfied, required checks passed, and the head
and base still match what step 1 recorded.

- Already merged: skip the merge, record its merge commit, and recheck that the
  head branch and commit match the workspace you plan to remove.
- Closed without merging: stop.
- `gh pr checks` exits nonzero when no checks exist. That means no configured
  check, not a failed one. Run any required local checks the project names, and
  say plainly when no automated check exists.
- Pending checks: wait only when the owner asked you to finish the merge.
- Failed checks: stop and report. Do not merge around them.

The head worktree must be clean before merging:

```bash
git -C <head-worktree> status --porcelain
```

Any output blocks cleanup. Do not stash or discard it.

## 4. Merge-safety check

Other sessions may have uncommitted work in the primary checkout. A merge that
changes the same files would collide with it. The primary checkout is the first
entry that `git worktree list` prints. Fetch first, so the comparison uses the
remote's default branch, not a local copy that may be behind:

```bash
git worktree list
git fetch origin
git diff --name-only origin/<default-branch>...<head-branch>
git -C <primary-checkout> status --porcelain
```

With no local head branch, use `origin/<head-branch>` in the diff. If any file
appears in both lists, stop. Name exactly those files and let the
owner decide whether to commit, stash, or wait. Do not touch the primary
checkout's changes.

## 5. Merge

Use the merge method the owner or the project requires. When neither says:
squash for a normal single-purpose branch; a merge commit when the commit
structure matters; ask when the choice would change history in a way that
matters.

```bash
gh pr merge <number> --repo <owner/repo> --squash --delete-branch --match-head-commit <headRefOid>
```

`<headRefOid>` is the head commit recorded in step 1 and checked again in step
3. Never leave `--match-head-commit` out, and never fill it with a newer
commit to get past a refusal. A refusal means someone pushed after the checks:
stop, report the new commit, and run steps 1 to 4 again on it. A standing
merge instruction covers only the head its independent check saw.

Replace `--squash` with the chosen method when needed. Leave out
`--delete-branch` for a pull request from a fork: that branch belongs to the
contributor. Never add an admin or protection-bypass flag. Then verify:

```bash
gh pr view <number> --repo <owner/repo> \
  --json state,mergedAt,mergeCommit,url,headRefName,headRefOid,baseRefName,isCrossRepository
```

Do not clean up unless `state` is `MERGED`.

## 6. Update the base checkout, then remove only the merged workspace

The worktree holding the base branch must be clean and on the expected branch:

```bash
git -C <base-worktree> fetch --prune origin
git -C <base-worktree> pull --ff-only
```

If it is dirty, on another branch, or cannot fast-forward, leave it untouched,
do no local cleanup from it, and report the blocker. Never reset, stash,
switch, or rebase it.

Recheck five proofs before removing anything:

1. GitHub reports this exact pull request merged.
2. The branch to remove is the pull request's head branch, not the base or
   default branch.
3. The worktree to remove is clean.
4. The local branch commit still equals the recorded head commit.
5. No other worktree uses that branch.

Run cleanup from the base worktree, never from inside the worktree being
removed:

```bash
git -C <base-worktree> worktree remove <head-worktree>
git -C <base-worktree> branch -d <head-branch>
git -C <base-worktree> worktree prune
```

A squash merge does not make the old branch commit part of the base, so
`git branch -d` can refuse even after a good merge. Use
`git branch -D <head-branch>` only when all five proofs still hold and that is
the only refusal. This is not permission to force-delete any other branch.

If GitHub did not delete the remote branch, delete it only when it is in the
same repository and belongs to this merged pull request:

```bash
git -C <base-worktree> push origin --delete <head-branch>
git -C <base-worktree> fetch --prune origin
```

Never try to delete a contributor's fork branch.

## 7. Work item note and report

When the project has `.toolkit.json` and step 1 found a work item id, add one
history note:

```text
toolkit work history <id> --note 'Merged pull request <number> as <merge commit>'
```

For a GitHub Issues or Jira tracker, `toolkit work` exits with code 3 and
prints the path of that tracker's written instructions; follow them to add the
same note to the issue. Do not change the stage or mark anything Done: that is
`work-finish`'s job, after the owner approves the result. Do not invent a work
item when none exists.

Verify: the pull request is merged; the base checkout matches its upstream and
is clean; the head branch is gone locally and on the remote; its worktree is
gone; every unrelated worktree remains.

End with the pull request link, the merge commit, the final base state, the
cleanup result, and whether the history note was saved ("Not saved" first when
it failed). The last line is the one question for the owner (a remaining
action he must take), or the exact words that continue ("Say 'finish WI-007'
and I'll close the work item.").

## References

| File | Open it when |
| --- | --- |
| `references/approvals.md` | Step 2: the merge rests on a standing merge instruction, not the owner's yes in this conversation |
| `references/git-rules.md` | Before a Git write in Codex, the merge-safety check in full, or a project with no remote |

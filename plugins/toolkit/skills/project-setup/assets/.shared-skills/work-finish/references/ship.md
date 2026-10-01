# Shipping a work item

The detail behind `work-finish` steps 2 to 4 and 11.

## 1. The pull request (stage 12)

Only when the item changed files and the project has a remote.

- In the item's worktree, `git status` must show none of the item's files
  uncommitted. When it does, nobody checked them: commit them, each staged
  by name, and go back to `work-check`. Never commit `work-items/` or
  `memory/`.
- Push the branch, never with force, and open the pull request with
  `gh pr create`, the body in a file. Write the title, description, and commits in
  plain words, with no AI credit: what changed, why, how it was checked, and the item's ID.
  Run them through `humanizer` (`.claude/rules/humanize-outbound-text.md`).
- Set stage `12-pr-and-push`, status In Review, put the pull request number
  under Overview "Related items", and add the Recent History row "Pull
  request #14 opened."

## 2. The merge

A merge into the default branch needs one of these:

- **His yes to this merge.** Then merge with `merge-and-clean-up`, which
  also removes the branch and worktree.
- **The standing merge instruction** in `.claude/rules/owner-preferences.md`,
  only when all three hold: the independent checker reported no blocking
  issue on the exact head commit being merged; every check passes on that
  head; the work item does not say its merge needs his approval. When the
  head moved after the check (a new commit, or the default branch merged
  into the item's branch), `work-check` starts the checker on the new head;
  a pass there is enough. All three hold: merge, add the Recent History row
  "Merged under the standing merge instruction; checker passed `<commit>`",
  and tell him in one line, naming the rule. Any one fails: ask him.

No remote (`git remote` prints nothing): get the same approval, run the
merge safety check in `.claude/rules/shared-repository-work.md`, then run
`git -C <main checkout> merge --ff-only <item branch>` from the main
checkout (the first path `git worktree list` prints). It must be on the
default branch; on another branch, stop and tell him, and never switch it.
The fast-forward fails: merge the default branch into the item's branch in
its worktree, run the checks again, and try again. Then remove the item's
worktree and branch, set stage `12-pr-and-push`, status In Review, and add
"No remote: merged locally into main."

After a merge, confirm it reached the default branch and add a Recent
History row naming the pull request and the merge commit. A conflict whose
right result is not clear from the two sides: ask him.

## 3. A deployment outside Salesforce (stage 13)

- Use only the deploy command in `AGENTS.md`, "Commands", or `PROJECT.md`;
  none: ask how this project deploys. Each deploy needs his yes.
- Never run a production deploy or data load. Hand him the exact command,
  what it deploys, and what to check afterwards, and record his report in
  his words.
- Set stage `13-deployment`, status In Review, and add a Recent History row
  with each deploy's result. A failed deploy: fill Blockers with the error
  and tell him. A code fix moves the item to `10-bug-fixing`
  and through `work-check` again.

## 4. Leftover branches and worktrees

After Done or Cancelled, list `git worktree list` and
`git branch --list '*wi-007*'` (the ID in lower case). For each one left,
check whether its commits reached the default branch and whether its
worktree has uncommitted changes.

- Offer to remove each merged, clean one, with a one-line reason, and remove
  it only after his yes (`git -C <main checkout> worktree remove <folder>`,
  then `git branch -d <branch>`). Never `--force`. Name any other one to him
  and leave it.
- `git -C <main checkout> status` must show none of the item's files
  uncommitted. When it does, name them and ask; never commit, stash, or
  remove them yourself.

# Work Safely in a Shared Repository

Other sessions edit this repository now.

## Before your first edit

Run:

```
git worktree list
git status
git fetch origin
git log --oneline -10
```

- In Codex, run each Git write (`git fetch`, `commit`, `merge`, `worktree add`) alone with escalated permissions, because a Git write changes `.git/`.
- When the repository has no remote (`git remote` prints nothing), skip `git fetch`, and never report a fetch failure as a blocker.
- An unknown worktree, a moved branch, or a change you did not make means that other sessions are working. Do not fix it. Tell the owner.

## Where to work

- For code, rules, skills, hooks, and settings, use your own worktree and branch: `git worktree add .claude/worktrees/<name> -b claude/<name>`. A work item's branch is `claude/<prefix>-<number>-<slug>`, for example `claude/wi-007-csv-export`.
- The one exception to using your own worktree and branch is a one-file edit asked for directly.
- In the shared main checkout, never switch branches, reset, rebase, or stash. The main checkout is the project's main folder: the first path that `git worktree list` prints.
- Never touch another session's branch or uncommitted work.

## Committing and merging

- Stage paths by name. Never run `git add -A`, `git add .`, or `git commit -a`.
- Read the full staged diff.
- Before you take a sequential number (a work item ID, a DEC-###, an SRC-###, a rule ID in `system/`), check every folder where work items are kept, every worktree, and the remote. When you find later that the same number was used twice, renumber only your own.
- Merge implementation work through a pull request, and only with the owner's yes. A standing merge instruction in `.claude/rules/owner-preferences.md` counts as that yes only under the conditions that `managing-work-items` gives in `references/deploying.md`, section "What a merge into the default branch needs".
- Before a merge, do the merge-safety check: compare `git diff --name-only <default-branch>...<branch>` with `git status` in the main checkout. When a file is in both, stop, name the file, and ask the owner.
- After the merge, remove your worktree and branch.

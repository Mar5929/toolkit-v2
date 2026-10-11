# Work Safely in a Shared Repository

Other sessions edit this repository now.

## Before your first edit

Use the verified remote for this operation. When none is known, ask which remote to use before fetching. With no remote, skip the fetch.

Run:

```
git worktree list
git status
git fetch <remote>
git log --oneline -10
```

- Run Git writes under the active host's filesystem, network, and approval settings. Use its supported permission mechanism when required. If a command is denied, report the command and reason and follow the host's approval process; never bypass the denial.
- When the repository has no remote (`git remote` prints nothing), skip `git fetch`, and never report a fetch failure as a blocker.
- An unknown worktree, a moved branch, or a change you did not make means that other sessions are working. Do not fix it. Tell the owner.

## Where to work

- For code, rules, skills, hooks, and settings, use your own worktree and branch: `git worktree add .claude/worktrees/<name> -b claude/<name>`. A work item's branch is `claude/<prefix>-<number>-<slug>`, for example `claude/wi-007-csv-export`.
- In the shared main checkout, never switch branches, reset, rebase, or stash. The main checkout is the project's main folder: the first path that `git worktree list` prints.
- Never touch another session's branch or uncommitted work.

## Committing and merging

- Stage paths by name. Never run `git add -A`, `git add .`, or `git commit -a`.
- Read the full staged diff.
- Before you take a sequential number (a work item ID, a DEC-###, an SRC-###, a rule ID in `wiki/product-wiki/`), check every folder where work items are kept, every worktree, and the remote. When you find later that the same number was used twice, renumber only your own.
- Merge implementation work through a pull request when the repository has a remote. Follow `managing-work-items`, `references/deploying.md`, for the target's merge authorization. Default-branch merges need the owner's yes or the standing merge instruction under that file's conditions.
- A repository with no remote has no pull request. Merge on this computer, as `managing-work-items` says in `references/deploying.md`, section "A project with no remote". For a branch with no work item, leave out what that section writes to a work item.
- Before a merge, resolve its target branch and worktree: a sub-item targets its parent; a top-level item targets the default branch. Compare `git diff --name-only <target-branch>...<branch>` (or the actual pull-request diff) with uncommitted paths in the target worktree and shared main checkout. Check any planned checkout update separately for overlap. When a file overlaps, stop, name it, and ask the owner.
- After the merge, remove your worktree and branch.

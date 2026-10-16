# Work Safely in a Shared Repository

Other sessions edit this repository now. These rules keep your work from overwriting theirs. The Git skills hold the commands: `pull-latest` finds the remote and the default branch and updates the main checkout safely, and `merge-and-clean-up` checks a merge's target and file overlap.

## Which remote

- Use the verified remote, as `pull-latest`, "Find the remote and the default branch", says. When none is known, ask the owner which remote to use.
- A repository with no remote has nothing to fetch. Never report a missing fetch as a blocker.

## Before your first edit

- Fetch the remote, then look at the worktrees, the working tree's status, and the latest commits.
- An unknown worktree, a moved branch, or a change you did not make means that other sessions are working. Do not fix it. Tell the owner.

## Where to work

- For code, rules, skills, hooks, and settings, use your own worktree and branch: `git worktree add .claude/worktrees/<name> -b claude/<name>`. A work item's branch and folder names are in `managing-work-items`, `references/building.md`.
- In the shared main checkout, never switch branches, reset, rebase, or stash. The main checkout is the project's main folder: the first path that `git worktree list` prints. Update it only as `pull-latest`, "Update the main checkout safely", says.
- Never touch another session's branch or uncommitted work. When a file you would change overlaps another session's uncommitted work, stop, name the file, and ask the owner.

## Committing

- Stage paths by name. Never run `git add -A`, `git add .`, or `git commit -a`.
- Read the full staged diff before you commit.
- Give no AI credit in a commit or a pull request: no `Co-Authored-By` line that names an AI, and no "Generated with" line.
- Before you take a sequential number (a work item ID, an SRC-###, or the ID of a decision or a rule that the project keeps in the repository), check the work tracker, every worktree, and the remote. When you find later that the same number was used twice, renumber only your own.
- When the host denies a command, report the command and the reason, and follow the host's approval process. Never bypass the denial.

## Merging

- Merge implementation work through a pull request when the repository has a remote. A merge into the default branch needs the owner's yes, or the standing merge instruction under the conditions in `managing-work-items`, `references/deploying.md`.
- A repository with no remote has no pull request. Merge on this computer as `references/deploying.md`, section "Merging", under "No remote", says. For a branch with no work item, leave out what those steps write to a work item.
- Before any merge, run the target and file-overlap check in `merge-and-clean-up`, step 4.
- After the merge, remove the merged worktree and branch as `merge-and-clean-up` does. Remove any other branch or worktree only after the owner's yes.

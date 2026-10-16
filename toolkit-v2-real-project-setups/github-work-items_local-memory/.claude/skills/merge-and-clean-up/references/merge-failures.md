# When a merge stops or GitHub does not merge

Open this file when a step of `merge-and-clean-up` finds the pull request in an unexpected state. In every case, remove nothing until GitHub reports the pull request `MERGED`.

## The pull request's state in step 3

- When the pull request is already merged, skip the merge. Record its merge commit, and check again that the head branch and the head commit match what you plan to remove.
- When the pull request was closed without merging, or a check failed, stop and report.
- When no checks exist, `gh pr checks` exits nonzero. That exit code is not a failure. Run the checks that the project's `AGENTS.md` names under "Commands", and say plainly when no automated check exists.
- When checks are pending and the owner asked you to finish the merge, wait with `gh pr checks <number> --repo <owner/repo> --watch`, and then run step 3 again. When the owner did not ask you to finish the merge, stop and tell the owner which checks are running.
- When the head worktree is not clean, stop the merge and the cleanup.

## GitHub refuses the merge

- When the merge is refused because the head no longer matches, a new commit arrived. Stop, report the new commit, and run steps 1 to 4 again on the new head. The owner's yes covers only the head that the owner was shown, so ask the owner again. When `managing-work-items` sent you here, go back to its merge step with the new head.
- For any other refusal, stop and tell the owner the error.

## GitHub queues the merge or turns on auto-merge

`gh pr merge` does not always merge:

- When required checks have not passed yet, it turns on auto-merge.
- On a base branch with a merge queue, it refuses `--delete-branch`. Without that flag, it only queues the pull request. Do not run it again unless the owner says to.

In both cases the pull request is not merged yet. Keep the worktree and branches, and tell the owner the state of the pull request.

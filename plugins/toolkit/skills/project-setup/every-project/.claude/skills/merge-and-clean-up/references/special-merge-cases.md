# Special merge cases

Before merging, check the credit rules below. When GitHub queues a merge or turns on auto-merge, use the queue guidance and keep the worktree until GitHub confirms the merge.

### Keep AI credit off the base branch

The merge must put no AI credit on the base branch: no `Co-Authored-By:` line that names an AI, and no "Generated with" line. Look for such a line in the title, the description, and each commit message that step 1 read.

- When the line is in the title or the description, remove it with `gh pr edit <number> --repo <owner/repo>` and `--title` or `--body-file`.
- When the line is in a commit message and the method is `--squash`, GitHub writes the new commit's message from the commits' messages. So add `--subject '<title> (#<number>)'` and `--body '<what changed, in concise plain sentences>'` to the merge command. Never write a word that closes an issue or a work item in the subject or the body.
- When the line is in a commit message and the method is `--merge` or `--rebase`, the commits reach the base branch as they are. Stop and tell the owner.

`gh pr merge` does not always merge:

- When required checks have not passed yet, it turns on auto-merge.
- On a base branch with a merge queue, it refuses `--delete-branch`. Without that flag, it only queues the pull request. Do not run it again unless the owner says to.

In both cases the pull request is not merged yet. Remove nothing, and tell the owner the state of the pull request.

# Keeping AI credit out of the merge commit

Open this file before the merge in step 5. Look for an AI credit line, such as a `Co-Authored-By:` line that names an AI or a "Generated with" line, in the title, the description, and each commit message that step 1 read.

- With `--squash`, GitHub writes the new commit's message from the pull request and its commits. So add `--subject '<title> (#<number>)'` and `--body '<what changed, in concise plain sentences>'` to the merge command. Never write a word that closes an issue or a work item in the subject or the body.
- With `--merge` or `--rebase`, the commits reach the base branch as they are. When a commit message has such a line, stop and tell the owner.

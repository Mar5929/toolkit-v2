# Deploying

The goal: the approved work is merged and deployed. Then go to `closing.md`, "Marking Done".

Read `owner-preferences.md` for a standing merge instruction and `PROJECT.md` for the owner's name and environments first. Every question is a Q&A row.

## The pull request

Open one only when the item changed files and the project has a remote.

- The item's files must all be committed, and the head must be the commit the checker passed. If it isn't, re-run the checker on the new head.
- Push without force. The base is the parent's branch for a sub-item, or the default branch for a top-level item.
- Write the title and description in plain words: what changed, why, how it was checked, and the item's name. Put the item's ID on its own line at the end of the description.
- The merge must never close the work item. Record the pull request on the item as `work-tracker.md` says, and in Recent History.

## Merging

Use `merge-and-clean-up`, or `publish-docs` for docs-only changes.

A merge into the default branch needs one of these:

- the owner's yes to this merge (the yes to the result doesn't count), or
- the standing merge instruction, which applies only when the checker passed the exact head, every check passes, and the item doesn't say its merge needs a yes.

Record what authorized the merge. If the head moved, the checker has to pass the new head. A builder's merge into the item branch needs no yes. Sub-items merge into their parent's branch; only the parent merges into the default branch.

**No remote:** after the same approval and head checks, and the target and file-overlap check in `merge-and-clean-up`, run `git -C <target worktree> merge --ff-only <item branch>`. Never switch another session's branch. If the fast-forward fails, merge the target into the item branch and go back to the Testing Loop.

After any merge, confirm it reached the target and record the branch and commit.

## Deploying

Deploy only when the result must go beyond the default branch, and follow any deployment rules in `.claude/rules/`.

- Before deploying, read the deployment instructions, the shared decisions, and earlier deployment lessons and runs (through `managing-project-memory`), and name what you applied.
- Use only the deploy command in `AGENTS.md` or `PROJECT.md`. If there isn't one, ask how this project deploys.
- Approval 5 in `lifecycle.md` applies. Never run a production deploy or data load unless a project rule allows it; otherwise give the owner the exact command, what it deploys, and what to check, and record their report in their words.
- Record each deployment in `delivery/deployments/` (`delivery/AGENTS.md` gives the format). A release of several items also gets a release plan and notes in `delivery/releases/`. Add Recent History.
- On failure: fill Blockers and tell the owner. If the fix changes the result, go back to the Testing Loop. Note the cause as a lesson.

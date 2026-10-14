# Deploying

Use this file to merge a work item's approved work, and to deploy it where it must go. The job is done when the work is merged and deployed. Then go to `closing.md`, section "Marking Done".

Before you start:

- Read `.claude/rules/owner-preferences.md` for a standing merge instruction. A standing merge instruction is an instruction of the owner that allows merges without a question for each one.
- Read `PROJECT.md` for the owner's name and for the environments or environment aliases that "Toolkit settings" records.
- Ask every question as a Questions and Answers row, with `waiting_on` set to the owner.
- In Codex, every Git write and every call that needs the network follows the active host's permission instructions.

In this file, the head of a branch is the latest commit on that branch. The checker is the separate agent that tested the result in the Testing Loop.

## The pull request

Open a pull request only when the work item changed files and the project has a remote. When the project has no remote, go to "The merge".

- In the work item's worktree, `git status` must show none of the work item's files uncommitted. When it shows one, nobody checked those files. Commit them, each staged by name, and go back to `testing-loop.md`.
- `git -C <item worktree> rev-parse HEAD` must equal the commit that the checker passed, which Recent History names. When the head is a different commit, start the checker on the new head, as `testing-loop.md`, step 4, says. A pass on the new head is enough.
- Push the branch, and never push with force. Set the pull request's base to the parent's branch for a sub-item, or the default branch for a top-level item. Open the pull request with its body in a file.
  - Write the title and the description in plain words, with no AI credit. Say what changed, why, how it was checked, and the work item's ID.
  - Use the project's humanizing skill or plugin for the title and the description, as the root `AGENTS.md`, "How to write text that goes to another person or is client/customer facing", says.
- The merge must never close the work item, because only the owner marks it Done. `references/work-tracker.md` says whether and how to write the work item's ID in the pull request.
- Record the pull request on the work item with `references/work-tracker.md`. It goes under the work item's Related items, unless that file names another place. Record the opened pull request and who opened it in Recent History.

## The merge

Use `merge-and-clean-up` to merge a pull request. That skill also removes the branch and the worktree. Use `publish-docs` for a change to documents only.

### What a merge into the default branch needs

A merge into the default branch needs one of these two:

- **The owner's yes to this merge.** Ask for it as its own question: "Pull request #14 is open and its checks pass. Merge it into main?" The owner's yes to the result is not a yes to the merge.
- **The owner's standing merge instruction** in `.claude/rules/owner-preferences.md`. It counts only when all three of these are true:
  1. The checker reported no blocking issue on the exact head commit that is being merged.
  2. Every check passes on that head.
  3. The work item does not say that its merge needs the owner's yes.

  When all three are true, merge. Record the standing instruction that authorized the merge and the commit the checker passed in Recent History, and tell the owner, naming the rule. When any one of the three is not true, ask the owner.

  When the head moved after the checker passed it, start the checker on the new head. A pass there is enough. A head moves when a new commit is added, or when the default branch is merged into the work item's branch.

Two other rules apply to merges:

- A helper's merge into the work item's own branch needs no yes from the owner.
- A sub-item merges into its parent's branch. Only the parent merges into the default branch.

### A project with no remote

A project has no remote when `git remote` prints nothing. Such a project has no pull request, so `merge-and-clean-up` has nothing to do. Merge on this computer:

1. Resolve the target branch and its worktree: the parent's branch for a sub-item, or the default branch for a top-level item. Use `git worktree list` to find the target worktree. When no worktree has that branch checked out, create one if permitted; never switch another session's branch.
2. Before a default-branch merge, get the owner's yes or use the standing merge instruction, as "What a merge into the default branch needs" says. A child merges into its parent under the approved build scope; honor any additional approval requirement on the work item.
3. Confirm that the item has no uncommitted changes and its head is the commit passed in the Testing Loop. Otherwise return to `testing-loop.md`. Run the merge-safety check in `.claude/rules/shared-repository-work.md` against the target branch and target worktree, preserving other sessions' uncommitted work.
4. Run `git -C <target worktree> merge --ff-only <item branch>`. Confirm that the target worktree is on the target branch first. With `--ff-only`, Git moves that branch to the item's commits and refuses when it cannot.
   - When the fast-forward fails, merge the target branch into the item branch in the item worktree, then return to the Testing Loop before retrying on the new head.
5. Confirm the merge reached the target branch before removing the item's worktree and branch. Record the target branch and merged commit in Recent History.

### After a merge

- Confirm that the merge reached its target branch, and add a Recent History row that names that branch, the merge commit and the pull request when there was one.
- When the merge stops on a conflict, resolve it as `building.md`, section "Git for a build", says.

## A deployment

Deploy only when the result must go beyond the default branch. Also follow each project rule in `.claude/rules/` that covers deployments.

- Before each deploy, read the applicable deployment instructions in `.claude/rules/owner-preferences.md`, the shared decisions where the root `AGENTS.md`, section "Where information goes", says they are kept, current work records, and earlier deployment lessons and runs. Find the lessons and runs in memory, as "Project memory" in the root `AGENTS.md` says, including records that are captured but not yet filed. Apply the supported current guidance and name it in the deployment record.
- Use only the deploy command in `AGENTS.md`, section "Commands", or in `PROJECT.md`. When neither gives one, ask the owner how this project deploys.
- Get the owner's yes before a deploy when `references/lifecycle-rules.md`, section "When to stop for the owner's yes", stop 5, asks for it.
- Never run a production deploy or data load unless a project rule allows it. Otherwise give the owner the exact command, what it deploys, and what to check afterwards. Record the owner's report in the owner's words.
- Write the work item's deployment record in `delivery/deployments/`, with the date and time the deploy ran, and each manual step with who did it.
  - A release of several work items together also gets a release plan and release notes in `delivery/releases/`.
  - `delivery/AGENTS.md` gives the folder name of each record, its fields, and its Status values.
  - Add a Recent History row with the result.
- A deploy that runs on a schedule, such as a monthly release, is also a recurring job. Write its run to memory, as "Project memory" in the root `AGENTS.md` says.
- When a deploy or a data load fails, fill Blockers with the error and tell the owner.
  - When the fix changes the result, move the work item back to the Testing Loop.
  - Write what caused the failure under Notes, "Lessons not proven yet", with the date.

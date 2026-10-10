# Deploying

Use this file to merge a work item's approved work, and to deploy it where it must go. The job is done when the work is merged and deployed. Then go to `closing.md`, section "Marking Done".

Before you start:

- Read `.claude/rules/owner-preferences.md` for a standing merge instruction. A standing merge instruction is an instruction of the owner that allows merges without a question for each one.
- Read `PROJECT.md` for the owner's name and, in a Salesforce project, for the org aliases.
- Ask every question as a Questions and Answers row, with `waiting_on` set to the owner.
- In Codex, every Git write and every call that needs the network follows `building.md`, section "Git writes in Codex".

In this file, the head of a branch is the latest commit on that branch. The checker is the separate agent that tested the result in the Testing Loop.

## The pull request

Open a pull request only when the work item changed files and the project has a remote. When the project has no remote, go to "The merge".

- In the work item's worktree, `git status` must show none of the work item's files uncommitted. When it shows one, nobody checked those files. Commit them, each staged by name, and go back to `testing-loop.md`.
- `git -C <item worktree> rev-parse HEAD` must equal the commit that the checker passed, which Recent History names. When the head is a different commit, start the checker on the new head, as `testing-loop.md`, step 4, says. A pass on the new head is enough.
- Push the branch, and never push with force. Open the pull request with its body in a file.
  - Write the title and the description in plain words, with no AI credit. Say what changed, why, how it was checked, and the work item's ID.
  - Run the title and the description through `humanizer`, as the root `AGENTS.md`, "Text that goes to another person", says.
- The merge must never close the work item, because only the owner marks it Done. In a project that keeps its work items in GitHub Issues, `references/work-tracker.md` says how to write the work item's ID in the pull request.
- Record the pull request on the work item with `references/work-tracker.md`. It goes under the work item's Related items, unless that skill names another place. Add the Recent History row "Pull request #14 opened."

## The merge

Use `merge-and-clean-up` to merge a pull request. That skill also removes the branch and the worktree. Use `publish-docs` for a change to documents only.

### What a merge into the default branch needs

A merge into the default branch needs one of these two:

- **The owner's yes to this merge.** Ask for it as its own question: "Pull request #14 is open and its checks pass. Merge it into main?" The owner's yes to the result is not a yes to the merge.
- **The owner's standing merge instruction** in `.claude/rules/owner-preferences.md`. It counts only when all three of these are true:
  1. The checker reported no blocking issue on the exact head commit that is being merged.
  2. Every check passes on that head.
  3. The work item does not say that its merge needs the owner's yes.

  When all three are true, merge. Add the Recent History row "Merged under the standing merge instruction; checker passed `<commit>`", and tell the owner in one line, naming the rule. When any one of the three is not true, ask the owner.

  When the head moved after the checker passed it, start the checker on the new head. A pass there is enough. A head moves when a new commit is added, or when the default branch is merged into the work item's branch.

Two other rules apply to merges:

- A helper's merge into the work item's own branch needs no yes from the owner.
- A sub-item merges into its parent's branch. Only the parent merges into the default branch.

### A project with no remote

A project has no remote when `git remote` prints nothing. Such a project has no pull request, so `merge-and-clean-up` has nothing to do. Merge on this computer:

1. Get the owner's yes, or use the standing merge instruction, as "What a merge into the default branch needs" says.
2. Run the merge-safety check in `.claude/rules/shared-repository-work.md`. That check compares the files the merge changes with the uncommitted files in the main checkout.
3. Run `git -C <main checkout> merge --ff-only <item branch>` from the main checkout. The main checkout is the first path that `git worktree list` prints. With `--ff-only`, Git makes only a fast-forward merge: it moves the default branch forward to the work item's commits, and it refuses when it cannot.
   - The main checkout must be on the default branch. When it is on another branch, stop and tell the owner. Never switch its branch.
   - When the fast-forward fails, merge the default branch into the work item's branch in the work item's worktree, run the checks again, and try the merge again. Under a standing merge instruction, the new head needs a new checker.
4. Remove the work item's worktree and branch, and add the Recent History row "No remote: merged locally into main."

### After a merge

- Confirm that the merge reached the default branch, and add a Recent History row that names the pull request and the merge commit.
- When the merge stops on a conflict, resolve it as `building.md`, section "Git for a build", says.

## A deployment

Deploy only when the result must go beyond the default branch. In a Salesforce project, also follow `salesforce-deploying.md`, which gives the Salesforce detail for a deployment.

- Before each deploy, read what earlier deploys taught. Read these three:
  - the lines about deploying in `.claude/rules/owner-preferences.md`;
  - the entries in `DECISIONS.md` that name deploying or the target environment;
  - the lessons and the earlier runs in memory. Search them as `managing-project-memory`, section "When to search memory", says. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in its place.

  Do what each one says before you run the command, and name each one you applied in the deployment record.
- Use only the deploy command in `AGENTS.md`, section "Commands", or in `PROJECT.md`. When neither gives one, ask the owner how this project deploys.
- Get the owner's yes before a deploy when `references/lifecycle-rules.md`, section "When to stop for the owner's yes", stop 5, asks for it.
- Never run a production deploy or data load. Give the owner the exact command, what it deploys, and what to check afterwards. Record the owner's report in the owner's words.
- Write the work item's deployment record in `delivery/deployments/`, with the date and time the deploy ran, and each manual step with who did it.
  - A release of several work items together also gets a release plan and release notes in `delivery/releases/`.
  - `delivery/AGENTS.md` gives the folder name of each record, its fields, and its Status values.
  - Add a Recent History row with the result.
- A deploy that runs on a schedule, such as a monthly release, is also a recurring job. Give its run to `managing-project-memory`, which records the run of a recurring job. In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in its place.
- When a deploy or a data load fails, fill Blockers with the error and tell the owner.
  - When the fix changes the result, move the work item back to the Testing Loop.
  - Write what caused the failure under Notes, "Lessons not proven yet", with the date.

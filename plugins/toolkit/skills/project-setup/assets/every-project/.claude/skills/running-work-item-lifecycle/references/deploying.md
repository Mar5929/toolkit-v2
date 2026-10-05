# Deploying

Merges the approved work and deploys it where it must go. Read `.claude/rules/owner-preferences.md` for a standing merge permission, and `PROJECT.md` for the owner's name and, in a Salesforce project, the org aliases. Every question is a Questions and Answers row with `waiting_on` set to the owner. When the work is merged and deployed, go to `closing.md`, "Marking Done".

## The pull request

Only when the item changed files and the project has a remote. Without one, go to "The merge".

- In the item's worktree, `git status` must show none of the item's files uncommitted. When it does, nobody checked them: commit them, each staged by name, and go back to `testing-loop.md`.
- `git -C <item worktree> rev-parse HEAD` must equal the commit the checker passed (Recent History). A different head: start the checker on the new head (`testing-loop.md`, step 4). A pass there is enough.
- Push the branch, never with force, and open the pull request with the body in a file. Write the title and description in plain words, with no AI credit: what changed, why, how it was checked, and the item's ID. Run them through `humanizer` (`.claude/rules/humanize-outbound-text.md`).
- The merge must never close the item, because only the owner marks it Done. A project that tracks work in GitHub Issues: `using-work-tracker` says how to write the item's ID in the pull request.
- Record the pull request on the item with `using-work-tracker` (under the item's Related items, unless that skill names another place) and add the Recent History row "Pull request #14 opened."

## The merge

Use `merge-and-clean-up` for a pull request, which also removes the branch and worktree, and `publish-docs` for a change to documents only.

A merge into the default branch needs one of these:

- **His yes to this merge.** Ask it as its own question: "Pull request #14 is open and its checks pass. Merge it into main?" His approval of the result is not a yes to the merge.
- **His standing merge permission** in `.claude/rules/owner-preferences.md`, only when all three hold: the checker reported no blocking issue on the exact head commit being merged; every check passes on that head; and the work item does not say its merge needs his approval. A head that moved after the check (a new commit, or the default branch merged into the item's branch) needs the checker on the new head, and a pass there is enough. When all three hold, merge, add the Recent History row "Merged under the standing merge instruction; checker passed `<commit>`", and tell him in one line, naming the rule. When any one fails, ask him.

A helper's merge into the item's own branch needs no OK. A sub-item merges into its parent's branch; only the parent merges into the default branch.

**No remote** (`git remote` prints nothing): get the same approval, run the merge safety check in `.claude/rules/shared-repository-work.md`, then run `git -C <main checkout> merge --ff-only <item branch>` from the main checkout (the first path `git worktree list` prints). It must be on the default branch. On another branch, stop and tell him, and never switch it. When the fast-forward fails, merge the default branch into the item's branch in its worktree, run the checks again, and try again. Under a standing merge permission the new head needs a new checker. Then remove the item's worktree and branch and add the Recent History row "No remote: merged locally into main." There is no pull request, so `merge-and-clean-up` has nothing to do.

After a merge, confirm it reached the default branch and add a Recent History row naming the pull request and the merge commit. A conflict: resolve it as "Git for a build" in `building.md` says.

## A deployment

Only when the result must go beyond the default branch. A Salesforce project: `salesforce-deploying.md`.

- Use only the deploy command in `AGENTS.md`, "Commands", or `PROJECT.md`. None: ask how this project deploys. Each deploy needs his yes.
- Never run a production deploy or data load. Hand him the exact command, what it deploys, and what to check afterwards, and record his report in his words.
- Write the item's deployment record in `delivery/deployments/`. A release that ships several work items together also gets a release plan and release notes in `delivery/releases/`. `delivery/AGENTS.md` gives each record's folder name, its fields, and its Status values. Add a Recent History row with the result.
- A failed deploy: fill Blockers with the error and tell him. A code fix moves the item back to the Testing Loop.

## Gotchas

- In Codex, every Git write and every call that needs the network follows "Git writes in Codex" in `building.md`.

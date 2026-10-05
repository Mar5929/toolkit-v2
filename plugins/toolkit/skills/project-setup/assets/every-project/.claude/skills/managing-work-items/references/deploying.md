# Deploying

Merges the approved work, deploys it where it must go, and takes the item to Done on the owner's word. Read `.claude/rules/owner-preferences.md` for a standing merge permission, and `PROJECT.md` for the owner's name and, in a Salesforce project, the org aliases. Every question is a Questions and Answers row with `waiting_on` set to the owner.

## Contents

- The pull request
- The merge
- A deployment
- Marking Done
- Cancelling an item
- Done or Cancelled by hand
- Leftover branches and worktrees
- Gotchas

## The pull request

Only when the item changed files and the project has a remote. Without one, go to "The merge".

- In the item's worktree, `git status` must show none of the item's files uncommitted. When it does, nobody checked them: commit them, each staged by name, and go back to `testing-loop.md`.
- `git -C <item worktree> rev-parse HEAD` must equal the commit the checker passed (Recent History). A different head: start the checker on the new head (`testing-loop.md`, step 4). A pass there is enough.
- Push the branch, never with force, and open the pull request with the body in a file. Write the title and description in plain words, with no AI credit: what changed, why, how it was checked, and the item's ID. Run them through `humanizer` (`.claude/rules/humanize-outbound-text.md`).
- The pull request text must never close the item by itself, because only he marks it Done. `tracking-work-items` says how to name the item in it.
- Record the pull request on the item with `tracking-work-items` (under the item's Related items, unless that skill names another place) and add the Recent History row "Pull request #14 opened."

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
- Add a Recent History row with each deploy's result.
- A failed deploy: fill Blockers with the error and tell him. A code fix moves the item back to the Testing Loop.

## Marking Done

1. **Before asking,** check:
   - every change is merged, or he said to leave it on its branch;
   - each deploy's result is recorded;
   - every Roadmap phase the item completed says Done.
2. **Ask.** Add the row, with Next action "Waiting on Mike: Q-12 (mark WI-031 Done). After his answer: record Done and close the item." Put the evidence in one line first (the checker's verdict and commit, the merged pull request, the deploy result). End the reply with "Mark WI-031 Done?"
3. **After his yes,** save his words first. Set the State to Done and `waiting_on` to `none`, and rewrite the Current state: Where it stands "Done on `YYYY-MM-DD`: <evidence>.", Next action "None. Finished.", Waiting on "Nothing.", Blockers "None."
4. **Update the project's Current State** (`SKILL.md`, "Hand-offs"): remove the item's line under "Now" and its lines under "Waiting on the owner", rewrite a "Next session starts with" line that names it, and set "Last updated:". A top-level item: check its project phase, as `SKILL.md`, "Levels", says.
5. **After a "no":** record his words, turn each problem into a task, and move the item back to Building. After the fix, the Testing Loop runs again before you ask again.
6. **Report:** whether the work reached the default branch and what was deployed. End with the leftover branches and worktrees question below. Nothing to ask: "Tell me the next thing to build."

## Cancelling an item

Only on the owner's word.

1. Record his reason in his words as an answered row.
2. Ask about each open sub-item: cancel it, move it to the top level, or move it under another item.
3. Set the State to Cancelled and `waiting_on` to `none`. Rewrite the Current state: Where it stands "Cancelled on `YYYY-MM-DD`: <his reason>.", Next action "None. Cancelled."
4. Update the project's Current State as in "Marking Done", step 4, and offer its decisions to memory as `reflecting.md`, item 3, says.
5. Its open pull request, branch, and worktree stay until he says what to do. Nothing is deleted.

## Done or Cancelled by hand

The owner marked it Done or Cancelled himself: that counts. Never undo it. Add the Recent History row "Marked Done by the owner by hand on `YYYY-MM-DD`" (or Cancelled), tell him in one line what had not happened yet (result approval, checker, merge, reflecting), and ask what he wants done about it. Then update the Current state and the project's Current State as above, and offer its decisions to memory.

## Leftover branches and worktrees

After Done or Cancelled, list `git worktree list` and `git branch --list '*wi-007*'` (the ID in lower case). For each one left, check whether its commits reached the default branch and whether its worktree has uncommitted changes.

- Offer to remove each merged, clean one, with a one-line reason. Remove it only after his yes: `git -C <main checkout> worktree remove <folder>`, then `git branch -d <branch>`. Never `--force`. Name any other one to him and leave it.
- `git -C <main checkout> status` must show none of the item's files uncommitted. When it does, name them and ask. Never commit, stash, or remove them yourself.

## Gotchas

- One message may answer several questions when his words name each (for example the merge and Done): one row per question, each with his words.
- In Codex, every Git write and every call that needs the network follows "Git writes in Codex" in `building.md`.

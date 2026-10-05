# Work Safely in a Shared Repository

Other sessions edit this repository now.

## Before your first edit

Run:

```
git worktree list
git status
git fetch origin
git log --oneline -10
```

- In Codex, run each Git write (`git fetch`, `commit`, `merge`, `worktree add`) alone with escalated permissions: it writes `.git/`.
- No remote (`git remote` prints nothing): skip `git fetch`, and never report a fetch failure as a blocker.
- An unknown worktree, moved branch, or change you did not make means other sessions are live. Do not fix it. Tell the owner.

## Where to work

- Code, rules, skills, hooks, settings: use your own worktree and branch (`git worktree add .claude/worktrees/<name> -b claude/<name>`; a work item's branch is `claude/<prefix>-<number>-<slug>`, for example `claude/wi-007-csv-export`). Exception: a one-file edit asked for directly.
- In the shared main checkout, never switch branches, reset, rebase, or stash.
- Never touch another session's branch or uncommitted work.

## Committing and merging

- Stage paths by name. Never `git add -A`, `git add .`, or `git commit -a`. Read the full staged diff.
- Before taking a sequential number (a work item ID, a DEC-###, an SRC-###, a rule ID in `system/`), check every tracker folder, worktree, and the remote. On a later collision, renumber only your own.
- Land implementation by pull request, merged with the owner's approval. A standing merge instruction in `.claude/rules/owner-preferences.md` counts.
- Before a merge, compare `git diff --name-only <default-branch>...<branch>` with `git status` in the main checkout. A file in both: stop, name it, ask the owner.
- After the merge, remove your worktree and branch.

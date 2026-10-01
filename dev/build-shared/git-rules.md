<!-- Shared text from the Toolkit V2 repository (dev/build-shared/git-rules.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Git rules

Branch and worktree names, a project with no remote, and Git writes in Codex. Looking first, staging, merging, and the merge safety check are in `.claude/rules/shared-repository-work.md`.

## Branch and worktree names for a work item

A work item's changes to code, rules, skills, hooks, and settings are made in its own worktree, on its own branch, never on the default branch.

| Part | Form | Example for `WI-007`, "CSV export" |
| --- | --- | --- |
| Branch | `claude/<prefix>-<number>-<slug>` | `claude/wi-007-csv-export` |
| Worktree folder | `.claude/worktrees/<prefix>-<number>-<slug>` | `.claude/worktrees/wi-007-csv-export` |

- `<prefix>` is the item's ID prefix in lower case: `wi` for `WI-007`. For a GitHub issue (`#12`) it is `issue`: `claude/issue-12-csv-export`.
- `merge-and-clean-up` finds the item from the ID in the branch name.
- Make both in the main checkout, starting from the default branch (its real name, for example `main`):

  ```text
  git -C <main checkout> worktree add .claude/worktrees/wi-007-csv-export -b claude/wi-007-csv-export main
  ```

- `<main checkout>` is the first path `git worktree list` prints. Name it with `-C` every time: each command starts in the session's own folder, which may be another worktree, and a worktree made inside that folder is deleted when that folder is removed.
- A builder helper's worktree and branch are made from the item's branch and named with the item's prefix and number, then the task ID in lower case:

  ```text
  git -C <main checkout> worktree add .claude/worktrees/wi-007-p1-t01 -b claude/wi-007-p1-t01 claude/wi-007-csv-export
  ```

## No AI credit

Codex has no setting that removes AI credit from a commit or pull request, so write none: no `Co-Authored-By:` line naming an AI and no "Generated with" line. If a command is refused because of such a line, change the wording. Never commit another way to get past it.

## A merge that stops on a conflict

Read both sides of each conflicting file, stage each resolved file by name, and commit with a message you write. Never run `git commit --no-edit` after a conflict: it keeps Git's "# Conflicts:" lines in the message.

## A project with no remote

`git remote` prints nothing.

- Never run `git fetch` or `git pull`, and never push to a remote. The one allowed `git push` is `git push . HEAD:<default branch>`, which `publish-docs` runs: it moves only a local branch. A failed fetch is never a blocker and never goes in a work item.
- There is no pull request. After the same approval a pull request merge needs, merge the item's branch from the main checkout, then add a Recent History row, "No remote: merged locally into main.":

  ```text
  git -C <main checkout> merge --ff-only claude/wi-007-csv-export
  ```

- The fast-forward fails when the default branch has commits the item's branch lacks. Merge the default branch into the item's branch in its worktree (`git -C <item worktree> merge main`), run the checks again, then run the merge safety check and the fast-forward again. Under a standing merge instruction, the new head needs a new independent check.
- `work-finish` removes the item's worktree and branch after the local merge. `merge-and-clean-up`, `pull-latest`, and `reset-to-remote` have nothing to do: say so in one line.

## The local folders Git ignores

`work-items/` and `memory/` are kept out of Git and live only in the main checkout. Never commit them. Never run `git clean -x` or `git clean -X` in the main checkout: it deletes both folders, and Git cannot bring them back. In Claude Code, the project's settings make the host ask the owner before any `git clean`.

## Git writes in Codex

Codex's sandbox keeps `.git/` read-only, so every command that writes `.git/` fails inside it: `git add`, `commit`, `merge`, `fetch`, `pull`, `push`, `switch`, `checkout`, `restore`, `rm`, `mv`, `stash`, `cherry-pick`, `revert`, `rebase`, `reset`, `git worktree add`, `remove`, and `prune`, and `git branch -d`, `-D`, and `-m`. A `gh` call that needs the network also fails. Reading commands (`git status`, `log`, `diff`, `show`, `branch --list`, `worktree list`) run inside the sandbox.

For each Git write in Codex:

- Run the Git command alone: not joined to another command with `&&`, `;`, or a pipe, and not from a script.
- Say in one line what the command does.
- Ask for escalated permissions: `sandbox_permissions` set to `require_escalated`, and `justification` set to a one-line reason ("Create the worktree for WI-002 on its own branch."). An approval without escalation still runs the command inside the sandbox, where it fails.
- Codex refused it without asking ("approval required by policy"): this session cannot ask. Stop that step, show the owner the exact command, and ask him to run it in a terminal or approve it in an interactive session. Set the work item waiting on the owner.
- Never work around a refusal: no second clone, no copy of `.git/`, no script that runs Git for you, and no building on the default branch.

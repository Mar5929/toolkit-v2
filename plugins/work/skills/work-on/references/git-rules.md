<!-- Generated file. Source: plugins/git-workflows/shared/git-rules.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# Git rules for Toolkit V2 skills

Purpose: the Git rules every Toolkit V2 skill follows when it makes a branch,
commits, merges, pushes, or removes a worktree, in Claude Code and in Codex.

## Contents

- Look before the first Git write
- Branch and worktree names for a work item
- Staging and committing
- No AI credit
- The Git-ignored toolkit folders
- A project with no remote
- The merge-safety check
- A merge that stops on a conflict
- Git writes in Codex
- Checklist: one commit
- Examples

## Look before the first Git write

Other sessions may work in the same repository at the same time. Before the
first Git write in a session, run each of these on its own:

```text
git worktree list
git status
git remote
```

- `git remote` prints nothing: the project has no remote. Read "A project
  with no remote" below before any fetch, pull, push, or pull request.
- An unknown worktree, a branch that moved, or a change this session did not
  make means another session is working. Do not change it. Tell the owner.
- The shared primary checkout is the first entry `git worktree list` prints.
  In it, never switch branches, reset, rebase, or stash.
- Never commit, push, rebase, or delete another session's branch, and never
  commit its uncommitted changes, even when they look finished.

## Branch and worktree names for a work item

A work item's code work happens in its own worktree, on its own branch.

| Part | Form | Example for `WI-007`, "CSV export" |
| --- | --- | --- |
| Branch | `claude/<prefix>-<number>-<slug>` | `claude/wi-007-csv-export` |
| Worktree folder | `.claude/worktrees/<prefix>-<number>-<slug>` | `.claude/worktrees/wi-007-csv-export` |

- `<prefix>` is the item's own id prefix in lower case: `wi` for `WI-007`,
  `tv2` for `TV2-007`, `acme` for `ACME-007`.
- The session briefing and `merge-and-clean-up` find the item from the id in
  the branch name. A branch named `wi-001-<slug>` for item `TV2-001` is not
  linked to that item.
- Make both with one command:

  ```text
  git worktree add .claude/worktrees/wi-007-csv-export -b claude/wi-007-csv-export
  ```

- Build on the item's branch, never on the default branch.

## Staging and committing

- Stage each path by name. Never run `git add -A`, `git add .`, or
  `git commit -a`: in a shared checkout they take other sessions' files.
- Read the staged file list, then the full staged diff, before the commit.
  Unstage any file this session did not write.

  ```text
  git diff --cached --name-status
  git diff --cached
  ```

- Write a plain commit message that says what changed, in one line when one
  line is enough.

## No AI credit

Nothing committed or published names an AI as an author or a helper:

- no `Co-Authored-By:` line naming an AI (a line naming a real person is
  allowed);
- no "Generated with" line;
- no AI credit in a pull request title or description, a code comment, a file
  header, or release notes.

The pre-tool hook refuses a commit or pull request command that carries such
a line. When it refuses, change the wording. Never commit another way to get
past it.

## The Git-ignored toolkit folders

`.work-items/` and `.memory/` are Git-ignored and live in the main checkout.

- Never commit them, and never force them in with `git add -f`. The hook
  refuses it.
- Never run `git clean -x` or `git clean -X` in the main checkout. It deletes
  both folders, and Git cannot bring them back. The hook refuses it.
- They change only through `toolkit work` and `toolkit memory` commands.
- Their backup is automatic: `toolkit work finish` and the handoff copy them
  to the owner's backup folder (`toolkit handoff-backup` does the same on
  request). `toolkit export --to <folder>` makes a one-off copy.

## A project with no remote

`git remote` prints nothing.

- Never run `git fetch`, `git pull`, or `git push`. A fetch that fails or is
  refused is not a blocker: never report it as one, and never write it into a
  work item.
- There is no pull request. `work-finish` merges the item's branch into the
  default branch locally, after the same approval a pull request merge needs,
  from the main checkout:

  ```text
  git merge --ff-only claude/wi-007-csv-export
  ```

  Then it adds the history note "No remote: merged locally into
  <default branch>."
- The fast-forward fails when the default branch moved on after the item's
  branch was made (for example another item's local merge). Merge the default
  branch into the item's branch in the item's worktree (`git merge main`, with
  the real default branch name), run the item's checks again, then run the
  fast-forward again.
- Documents are committed on the local default branch. `publish-docs` does
  this by itself.
- `merge-and-clean-up`, `pull-latest`, and `reset-to-remote` have nothing to
  do. Say so in one line.

## The merge-safety check

Before any merge into the default branch, check that it cannot overwrite
another session's uncommitted work in the primary checkout. With a remote,
fetch first so the comparison uses the remote's default branch.

```text
git diff --name-only main...claude/wi-007-csv-export
git -C <primary checkout> status --porcelain
```

Use the real default branch name, and `origin/<default branch>` when there is
a remote. A file in both lists: stop, name exactly those files, and let the
owner decide whether to commit, stash, or wait. Never touch the primary
checkout's changes yourself.

## A merge that stops on a conflict

1. Read both sides of each conflicting file. When the right result is not
   clear from the two sides, stop and ask the owner.
2. Stage each resolved file by name.
3. Commit with a message you write:

   ```text
   git commit -m 'Merge main into claude/wi-007-csv-export: keep both export formats'
   ```

Never run `git commit --no-edit` after a conflict: it keeps Git's
"# Conflicts:" lines in the message.

## Git writes in Codex

Codex's sandbox keeps `.git/` read-only. Every command that writes `.git/`
fails inside it: `git add`, `commit`, `merge`, `fetch`, `pull`, `push`,
`switch`, `checkout`, `restore`, `rm`, `mv`, `stash`, `cherry-pick`,
`revert`, `rebase`, `reset`, `update-ref`, `git worktree add`, `remove`,
`move`, `prune`, and `repair`, and `git branch -d`, `-D`, `-m`, `-c`, and
`-f`. The project's
`.codex/rules/toolkit.rules` makes Codex ask the owner before each one. A `gh`
call that needs the network is also refused inside the sandbox.

Reading commands (`git status`, `git log`, `git diff`, `git show`,
`git branch --list`, `git worktree list`) run inside the sandbox as usual.

For each Git write in Codex:

- [ ] Run the Git command alone, as its own command: not joined to another
      command with `&&`, `;`, or a pipe, and not from a script.
- [ ] Say in one line what the command does, before Codex asks the owner.
- [ ] Ask for escalated permissions: set `sandbox_permissions` to
      `require_escalated`, with a one-line reason that says what the command
      does ("Create the worktree for WI-002 on its own branch."). An approval
      without escalation still runs the command inside the sandbox, where it
      fails on `.git/index.lock`.
- [ ] Codex refused it without asking ("approval required by policy", or
      "AskForApproval is set to Never"): this session cannot ask. Stop that
      step, show the owner the exact command, and ask him to approve it in an
      interactive session or run it in a terminal. Set the work item waiting
      on the owner. It is not an outside blocker.

Never work around a refusal: no nested `git clone` of the project, no copy of
`.git/`, no script that runs Git for you, and no building on the default
branch instead of the item's branch. The `publish-docs` script is not such a
script: it is that skill's own tool. Run it alone with escalated permissions,
like any other Git write.

## Checklist: one commit

```text
- [ ] In the right worktree, on the right branch (git branch --show-current)
- [ ] Each path staged by name
- [ ] Staged list read: only this session's files, no .work-items/ or .memory/
- [ ] Full staged diff read
- [ ] Plain message with no AI credit line
- [ ] Codex: each Git command run alone, with escalated permissions
```

## Examples

Right: stage by name, read the list, commit.

```text
git add src/export.js tests/export.test.js
git diff --cached --name-status
git commit -m 'Add CSV export for invoices'
```

Wrong: `git add -A && git commit -m 'wip'`. It stages other sessions' files,
and in Codex the joined command runs inside the sandbox and fails.

Wrong: a message whose last line is a `Co-Authored-By:` trailer naming an AI
model. The hook refuses it. Remove the line and commit again.

Right, no remote: after the owner approves the result and the merge,

```text
git merge --ff-only claude/wi-007-csv-export
```

run from the main checkout, then the history note "No remote: merged locally
into main."

Right, Codex: `git commit -m 'Add CSV export for invoices'` run alone, with
`sandbox_permissions` set to `require_escalated` and the reason "Commit the
CSV export files for WI-007 on its branch."

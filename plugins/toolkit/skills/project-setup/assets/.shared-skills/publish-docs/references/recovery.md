# Recover a documentation save without losing work

What to do when the push or the fast-forward in step 7 is refused, the default
branch got new commits during the save, or the save cannot finish now.
`<main>` is the main checkout and `<save>` is the save worktree, as in
`SKILL.md`.

## The default branch advanced

The push was refused ("rejected", "fetch first", "non-fast-forward"), or, with
no remote, the fast-forward was refused because the default branch has
commits the save does not.

1. Work in the save worktree only. Bring it current: with a remote,
   `git -C <save> fetch origin <default>` then
   `git -C <save> rebase origin/<default>`; with no remote,
   `git -C <save> rebase <default>`. The save's commit was never published, so
   rebasing it here rewrites nothing anyone else has.
2. The rebase stops on a conflict: read both sides of each file. Both sides
   added rows to `ai-external-knowledge/INDEX.md`: keep every row. When the
   right result is not clear, run `git -C <save> rebase --abort` and ask the
   owner. Otherwise stage each resolved file by name and finish without an
   editor:

   ```text
   git -C <save> add -- <file>
   git -C <save> -c core.editor=true rebase --continue
   ```

3. Run the step 5 checks again, then publish again (step 7). Ask the owner
   when the rebase changed what the saved text means, so it is no longer the
   edit he agreed to.

## No remote: the fast-forward was refused for a changed file

`git -C <main> merge --ff-only <commit id>` says local changes or an untracked
file would be overwritten. The commit is safe in the save worktree.

- The file is this session's own copy of a saved file: restore it
  (`git -C <main> restore -- <file>`) or delete this session's own copy of a
  new file, then run the fast-forward again.
- The file is another session's work: stop, name the file, and ask the owner.
  Never discard it.

## A save that cannot finish now

A refused push that a rebase does not fix, an account mismatch, a login
prompt, a protected branch, a conflict the owner must settle, or a failed
check. Never force-push, bypass branch protection, or retry through another
account.

- Report separately what is written, checked, committed, and published.
- Keep the save worktree and the commit id.
- For a work item, write the exact next action into its Current state with
  `tracking-work-items`, in a form `.claude/rules/keep-work-item-current.md`
  gives. Otherwise tell the owner the exact next action, and put it
  in the handoff when one is written (the `handoff` skill).

## The repository has remotes, but none named `origin`

Start nothing. Name the remotes (`git remote -v`) and ask the owner which one
holds the default branch. Rename it only with his yes:
`git -C <main> remote rename <name> origin`.

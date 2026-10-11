# Recover a documentation save without losing work

Use this file when a save with `publish-docs` fails or stops: the push or the fast-forward in step 7 is refused, the default branch got new commits during the save, the repository has remotes but none named `origin`, or the save cannot finish now. The goal is that the save finishes, or stops safely, and that no commit and no other session's work is lost.

`<main>` is the main checkout and `<save>` is the save worktree, as in `SKILL.md`. The step numbers in this file are the steps of `SKILL.md`.

## The default branch advanced

Use this section in two cases:

- The push was refused with "rejected", "fetch first", or "non-fast-forward".
- With no remote, the fast-forward was refused because the default branch has commits that the save does not have.

1. Work in the save worktree only, and bring it up to date with a rebase. A rebase puts the save's commit on top of the newest commit of the default branch.
   - With a remote, run `git -C <save> fetch origin <default>`, and then `git -C <save> rebase origin/<default>`.
   - With no remote, run `git -C <save> rebase <default>`.

   The save's commit was never on the default branch, so a rebase in the save worktree rewrites nothing that anyone else has.
2. When the rebase stops on a conflict, read both sides of each file.
   - When both sides added a row to a list (`sources/INDEX.md`, `wiki/reference/outside-docs/INDEX.md`) or an entry to `DECISIONS.md`, keep every row and every entry.
   - When both sides took the same DEC, SRC, or rule ID, this save's record gets the next free ID, as `filing-project-records` says.
   - When the right result is not clear, run `git -C <save> rebase --abort` and ask the owner.
   - Otherwise, stage each resolved file by name, and finish the rebase without an editor:

     ```text
     git -C <save> add -- <file>
     git -C <save> -c core.editor=true rebase --continue
     ```

3. Run the checks of step 5 again, and then do step 7 again. Ask the owner when the rebase changed what the saved text means, so that the text is no longer the edit that the owner agreed to.

## No remote: the fast-forward was refused for a changed file

Use this section when `git -C <main> merge --ff-only <commit id>` says that local changes or an untracked file would be overwritten. The commit is safe in the save worktree.

- When the file is this session's own copy of a saved file, restore it with `git -C <main> restore -- <file>`. When the file is this session's own copy of a new file, delete that copy. Then run the fast-forward again.
- When the file is another session's work, stop, name the file, and ask the owner. Never discard the file.

## A save that cannot finish now

Use this section for a refused push that a rebase does not fix, an account mismatch, a login prompt, a protected branch, a conflict that the owner must settle, or a failed check.

Never force-push, never bypass branch protection, and never retry through another account.

- Report separately what is written, what is checked, what is committed, and what is on the default branch.
- Keep the save worktree and the commit id.
- When the save belongs to a work item, write the exact next action into the work item's Current state with `managing-work-items`, in a form that the work item template gives.
- Otherwise, tell the owner the exact next action. When a handoff is written, put the next action in the handoff with the `handoff` skill.

## The repository has remotes, but none named `origin`

Start nothing. Name the remotes with `git remote -v`, and ask the owner which remote holds the default branch. Rename that remote only with the owner's yes: `git -C <main> remote rename <name> origin`.

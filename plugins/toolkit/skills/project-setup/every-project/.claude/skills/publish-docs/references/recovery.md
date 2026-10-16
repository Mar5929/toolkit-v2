# Recover a documentation save without losing work

Use this file when a save with `publish-docs` fails or stops: the push in step 7 is refused, the default branch got new commits during the save, or the save cannot finish now. The goal is that the save finishes, or stops safely, and that no commit and no other session's work is lost. With no remote, [no-remote.md](no-remote.md) says which parts apply.

`<main>` is the main checkout and `<save>` is the save worktree, as in `SKILL.md`. The step numbers in this file are the steps of `SKILL.md`.

## The default branch advanced

Use this section when the push was refused with "rejected", "fetch first", or "non-fast-forward", or when the no-remote fast-forward was refused because the default branch has commits that the save does not have.

1. Work in the save worktree only, and bring it up to date with a rebase: run `git -C <save> fetch <remote> <default>`, and then `git -C <save> rebase <remote>/<default>`. The save's commit was never on the default branch, so a rebase in the save worktree rewrites nothing that anyone else has.
2. When the rebase stops on a conflict, read both sides of each file.
   - When both sides added a row to a list, such as `sources/INDEX.md` or `wiki/reference/ai-external-knowledge/INDEX.md`, or an entry to a file of decisions, keep every row and every entry.
   - When both sides took the same SRC ID, or the same ID for a decision or a rule, this save's record gets the next free ID, as `filing-project-records` says.
   - When the right result is not clear, run `git -C <save> rebase --abort` and ask the owner.
   - Otherwise, stage the resolved files, and finish the rebase without an editor:

     ```text
     git -C <save> add -- <file>
     git -C <save> -c core.editor=true rebase --continue
     ```

3. Run the checks of step 5 again, and then do step 7 again. Ask the owner when the rebase changed what the saved text means, so that the text is no longer the edit that the owner agreed to.

## A save that cannot finish now

Use this section for a refused push that a rebase does not fix, an account mismatch, a login prompt, a protected branch, a conflict that the owner must settle, or a failed check.

Never force-push, never bypass branch protection, and never retry through another account.

- Report separately what is written, what is checked, what is committed, and what is on the default branch.
- Keep the save worktree and the commit id.
- When the save belongs to a work item, write the exact next action into the work item's Current state with `managing-work-items`.
- Otherwise, tell the owner the exact next action. When a handoff is written, put the next action in the handoff with the `handoff` skill.

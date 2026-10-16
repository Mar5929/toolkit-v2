# Saving documents in a repository with no remote

Open this file when `git remote` prints nothing. The save is then committed on the local default branch, and the steps of `SKILL.md` change as below. Never fetch, and never push to a remote. The local `git push . HEAD:<default>` below is allowed, because it moves only a local branch.

## Changes to the steps

- **Step 2.** The default branch is the branch the main checkout has, as `pull-latest`, "Find the remote and the default branch", says.
- **Step 3.** Skip the fetch, and start the save worktree from `<default>` in place of `<remote>/<default>`.
- **Step 4.** Remove this session's own copy of each saved file from the working checkout before step 7, once the file is staged. Git refuses the fast-forward while the main checkout holds a changed copy of a saved file, or an untracked copy of a new file. [carrying-an-edit.md](carrying-an-edit.md) says how to remove the copy.
- **Step 7.** Do these in order:
  1. Run `git -C <main> status --porcelain`. When it lists a file of this save that is not this session's own copy, that file is another session's work. Stop, name the file, and ask the owner.
  2. Move the local default branch forward in the checkout that has the default branch, normally the main checkout: `git -C <main> merge --ff-only <commit id>`. This fast-forward makes no merge commit.
  3. When no checkout has the default branch, run `git -C <save> push . HEAD:<default>` in place of the fast-forward.
- **Step 8.** `git -C <main> branch --contains <commit id>` must list the default branch. When the fast-forward ran in the main checkout, the main checkout holds the save. When it ran in another checkout, or step 7 used `git push . HEAD:<default>`, the main checkout is on another branch and does not hold the save; change nothing there.

## When Git refuses the fast-forward

- When the default branch has commits that the save does not have, follow [recovery.md](recovery.md), "The default branch advanced", with `git -C <save> rebase <default>` and no fetch.
- When Git says that local changes or an untracked file would be overwritten, the commit is safe in the save worktree. When the file is this session's own copy of a saved file, restore it with `git -C <main> restore -- <file>`; when it is this session's own copy of a new file, delete that copy. Then run the fast-forward again.
- When the file is another session's work, stop, name the file, and ask the owner. Never discard the file.

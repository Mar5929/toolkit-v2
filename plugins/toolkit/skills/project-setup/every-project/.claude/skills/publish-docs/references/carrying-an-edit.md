# Carrying an edit to the save worktree

Open this file in step 4 when the session has already edited a document in its working checkout.

## Carrying an edit across

Use this section when this session already edited a document in its working checkout. The edit must get into the save worktree without removing anything that the default branch has.

Check each edited file before you copy it:

```text
git -C <working checkout> diff --quiet HEAD <save commit> -- <file>
```

`<save commit>` is what `git -C <save> rev-parse HEAD` prints before step 6.

- Exit code 0 means that the working checkout started from the version that the save worktree has. Copy the edited file to the same path in the save worktree.
- Exit code 1 means that the two versions differ. Never copy the file, because the copy would remove what the default branch has and the working checkout lacks. Make the same change by hand in the save worktree's file. `git -C <working checkout> diff HEAD -- <file>` shows the change.

Then stage each file, and run the checks of step 5.

Last, remove this session's own copy from the working checkout. Remove only files that this session edited or created: run `git -C <working checkout> restore -- <file>` for a changed file, and `rm` for a new file. Never discard another session's changes.

When to remove the copy depends on the remote:

- With a remote, remove the copy after step 8 verifies the save, and before the main checkout is brought up to date. The saved version comes back with that update. When the working checkout is another worktree, the saved version comes back with the next `pull-latest`.
- With no remote, remove the copy before step 7, once the file is staged. Git refuses the fast-forward while the main checkout holds a changed copy of a saved file, or an untracked copy of a new file.

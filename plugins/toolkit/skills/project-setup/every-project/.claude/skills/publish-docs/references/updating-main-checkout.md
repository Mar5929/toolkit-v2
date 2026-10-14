# Updating the main checkout after a save

Open this file in step 8 to check whether the main checkout holds the save and update it safely.

## The main checkout

The third thing that step 8 notes is whether the main checkout holds the save. The reason is that a work item kept in the main checkout must not name a record that the main checkout does not hold. `managing-work-items/references/work-tracker.md` says whether this project's work items are kept there.

### With no remote

- When step 7 ran the fast-forward in the main checkout, the main checkout holds the save.
- When step 7 ran the fast-forward in another checkout, or ran `git push . HEAD:<default>`, the main checkout is on another branch and does not hold the save. Change nothing in the main checkout.

### With a remote

A pushed save is not in the main checkout yet. After step 8 verifies the save, move the main checkout's default branch forward. Use a fast-forward only: never merge, rebase, reset, or switch branches in the main checkout.

1. Run `git -C <main> branch --show-current`. It must print `<default>`. When it prints another branch, change nothing.
2. Do the merge-safety check. `git -C <main> diff --name-only HEAD origin/<default>` lists the files that the update changes, and `git -C <main> status --porcelain` lists the files with uncommitted changes. A file in both lists blocks the update.
   - When the file is this session's own copy of a saved file, remove the copy as [carrying-an-edit.md](carrying-an-edit.md) says.
   - When the file is any other file, change nothing.
3. When no file blocks the update, run `git -C <main> merge --ff-only origin/<default>`. When Git refuses, change nothing.

### When the main checkout does not hold the save

The save is still finished. Say so in the reply briefly: "The main checkout does not hold this save yet", and then what blocks the update. What blocks the update is the branch that the main checkout is on, the files that block the update, or Git's message. Tell the skill that started the save.


---
name: filechanges
description: 'Lists the files that the agent''s last set of changes created, changed, renamed, or deleted, each with one short sentence on what changed. Use when the owner asks which files the agent just changed, such as "what files did you change?" or "list the files you just changed". For a recap of the whole session, use session-summary.'
---

# File changes

Show the owner exactly which files your last set of changes changed, with one short sentence on what changed in each file and a link that opens the file. The job is done when the reply names every file in the last set of changes, names no other file, and every link opens a copy of the file that holds the change. This skill only reads: change no file and make no commit.

The last set of changes is everything that you, and any helper agent you started, created, changed, renamed, or deleted since the owner's latest request for work.

A file can have more than one copy: one in the project's main folder, one in each Git worktree, and one on each branch on the remote. The project's main folder is the first path that `git worktree list` prints. A worktree is a separate folder that holds its own copy of the project, on its own branch. A copy holds the change when the file in it now has the text that the change gave the file, whichever commit brought the text there. For a deleted file, a copy holds the change when the file is gone from it. A link to a copy without the change shows the owner the old text, so every link must open a copy that holds the change.

A recap of the whole session, with each request and its result, is the job of `session-summary`.

1. **List what the last set of changes changed.** Go through your own actions, and the report of each helper agent, from the point where the last set of changes begins. List each file that was created, changed, renamed, or deleted, whether the file is inside the project folder or outside it. List a file only when the file differs now from how it was when the last set of changes began.
   - When the session does not show where the last set of changes begins, use your judgment: choose the point that the owner most likely means. Then start the reply with one line that says which changes you are listing, for example "Since your request to add the export button".
2. **Check the list against Git.** To make sure the list misses no file, read what Git shows in each repository and worktree where the last set of changes changed a file. Read the uncommitted changes with `git status --short --untracked-files=all`. For each commit that the last set of changes made, read the files in the commit with `git show --name-status <commit>`.
   - When Git shows a file that the last set of changes changed, and the file is not on the list, add the file.
   - Never add a file only because Git shows it as changed. Git also shows changes made before the last set of changes began, and changes that another session made.
3. **Find a copy of each file that holds the change now.** The link for the file opens that copy. Check what each folder and each branch holds now, because a worktree may have been removed, and a branch may have been pushed or merged, since the change was made. When more than one copy holds the change, take the first of these that does:
   - the copy in the folder that you work in now;
   - a copy in another folder on this computer, such as a worktree;
   - a copy on a branch on the remote.

   Check also whether the project's main folder holds the change. Step 4 puts the changes that the main folder does not hold in tables of their own.
4. **Reply with the list in one or more tables, and nothing else.** Use the columns `File` and `What changed` in each table, with one row for each file.
   - Put the changes that the project's main folder holds, and the changes to files that are in no copy of the project, in one table. Group the other changes by the copy that step 3 found: one table for each worktree, and one table for each branch whose changes no folder on this computer holds. Above each of those tables, say in one line that the project's main folder does not have these changes, and say where they are: the worktree's folder and its branch, or the branch with a link to its pull request when it has one.
   - Name a file by its path from the root of the copy of the project that holds it, so that a file in a worktree has the same name as in the main folder. Give the full path of a file that is in no copy of the project.
   - Make the name of each file a link that opens the copy from step 3. The target of the link is the path or the address that leads to that copy and to no other copy of the file.
     - For a copy on this computer, the target is the full path of the copy. A path that is not a full path is resolved from a folder that you may not be working in, so it can open another copy. Claude Code and Codex each have their own form for a link to a local file, so use the form that your instructions give, with the full path in it. When that form shows the path itself, as a path in code form does, write the full path in place of the name. When your instructions give no form, write a Markdown link whose target is the full path. In a Markdown link, write the path with forward slashes, and put a path that holds a space between `<` and `>`, so that the whole path stays in the link. When your instructions say that a link opens only files in certain folders, and the copy is outside them, write the full path of the copy in code form in place of the link, so that the owner can open the file himself.
     - For a copy on a branch on the remote, the target is the address of the file's page on that branch on the remote's website. That address is a web page and not a local file, so the form that your instructions give for a local file does not apply to it: write a Markdown link to the address. For a GitHub remote, `gh browse <path> --branch <branch> --no-browser`, run in the project's root, prints the address. The command prints an address in any case, so check first that the remote has the branch and that the file on that branch holds the change.
     - When there is no copy to open, as with a deleted file, write the name in a form that is not a link: code form, or plain text where your instructions make a path in code form a link.
   - In `What changed`, write one short sentence in ordinary words that says what changed. Leave out why it changed and how you changed it.
   - Put the files of a table in path order. Only the line from step 1, and the lines that say where changes are, may stand above a table.

## Example

In this example, the project's main folder is `C:\Users\sam\shop`. The last set of changes renamed one file and deleted one file there, and a helper agent created one file and changed one file in a worktree. The links are Markdown links, and each target is the full path of the copy. Where your instructions give another form for a link to a local file, write each link in that form.

```markdown
| File | What changed |
| --- | --- |
| [docs/orders-export.md](C:/Users/sam/shop/docs/orders-export.md) | This file was renamed from `docs/export.md`, and its text did not change. |
| `src/orders/old-download-link.js` | This file was deleted. |

The project's main folder does not have these changes. They are in the worktree `.claude/worktrees/export-button`, on the branch `export-button`.

| File | What changed |
| --- | --- |
| [src/export/export-button.js](C:/Users/sam/shop/.claude/worktrees/export-button/src/export/export-button.js) | This new file adds the Export button to the orders page. |
| [src/orders/orders-page.js](C:/Users/sam/shop/.claude/worktrees/export-button/src/orders/orders-page.js) | The orders page now shows the Export button above the table of orders. |
```

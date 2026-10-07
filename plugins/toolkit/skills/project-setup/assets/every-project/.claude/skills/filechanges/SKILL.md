---
name: filechanges
description: 'Lists the files that the agent''s last set of changes created, changed, renamed, or deleted, each with one short sentence on what changed. Use when the owner asks which files the agent just changed, such as "what files did you change?" or "list the files you just changed". For a recap of the whole session, use session-summary.'
---

# File changes

Show the owner exactly which files your last set of changes changed, with one short sentence on what changed in each file. The job is done when the reply names every file in the last set of changes and names no other file. This skill only reads: change no file and make no commit.

The last set of changes is everything that you, and any helper agent you started, created, changed, renamed, or deleted since the owner's latest request for work.

A recap of the whole session, with each request and its result, is the job of `session-summary`.

1. **List what the last set of changes changed.** Go through your own actions, and the report of each helper agent, from the point where the last set of changes begins. List each file that was created, changed, renamed, or deleted, whether the file is inside the project folder or outside it. List a file only when the file differs now from how it was when the last set of changes began.
   - When the session does not show where the last set of changes begins, use your judgment: choose the point that the owner most likely means. Then start the reply with one line that says which changes you are listing, for example "Since your request to add the export button".
2. **Check the list against Git.** To make sure the list misses no file, read what Git shows in each repository and worktree where the last set of changes changed a file. Read the uncommitted changes with `git status --short --untracked-files=all`. For each commit that the last set of changes made, read the files in the commit with `git show --name-status <commit>`.
   - When Git shows a file that the last set of changes changed, and the file is not on the list, add the file.
   - Never add a file only because Git shows it as changed. Git also shows changes made before the last set of changes began, and changes that another session made.
3. **Reply with the list as a table, and nothing else.** Use the columns `File` and `What changed`, with one row for each file.
   - Name a file by its path from the project's root. Give the full path of a file outside the project folder.
   - In `What changed`, write one short sentence in ordinary words that says what changed. Leave out why it changed and how you changed it.
   - Put the files in path order. Only the line from step 1 may stand above the table.

## Example

```markdown
| File | What changed |
| --- | --- |
| `docs/orders-export.md` | This file was renamed from `docs/export.md`, and its text did not change. |
| `src/export/export-button.js` | This new file adds the Export button to the orders page. |
| `src/orders/old-download-link.js` | This file was deleted. |
| `src/orders/orders-page.js` | The orders page now shows the Export button above the table of orders. |
```

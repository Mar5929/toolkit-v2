---
name: publish-docs
description: 'Commits an approved edit to project documents directly to the default branch. Use when another skill asks for a document save or the owner asks to "publish the docs". For deciding what belongs in sources/ or in the project''s records of shared decisions and system rules, use filing-project-records. For code, rules, skills, or work items, use managing-work-items.'
---

# Commit project documents to the default branch

Use this skill to commit a change to Git-tracked project documents directly to the default branch, with no pull request. "The paths of the project documents" below lists which files are project documents.

In this skill, a save is one commit of an agreed document edit. The commit is made in a temporary Git worktree of its own, the save worktree (`<save>`), inside the main checkout (`<main>`).

Two things must be true when the save is done: only the agreed document edit reaches the default branch, and no other session's work changes. A save is finished only when step 8 finds its commit on the default branch.

This skill decides nothing about what a document says. The skill that asked for the save decides what the document says. Committing a document does not approve its requirements or its build.

Run each Git command with `git -C <folder>`, so that it never depends on the current folder.

When the repository has no remote (`git remote` prints nothing), follow [references/no-remote.md](references/no-remote.md) in place of the remote parts of steps 2, 3, 7, and 8.

## The paths of the project documents

A project document is a file under one of these paths.

- `PROJECT*.md`
- `sources/**`
- `wiki/reference/**`
- `delivery/**`
- `tools/**/*.md`
- `**/README.md`
- Each path that `references/shared-record-paths.md` lists. The project's memory choice supplies that file, because it decides whether shared decisions and system rules are kept in the repository.

## Refused files

This skill commits only documents, images, and PDFs (`.md`, `.txt`, `.csv`, `.xml`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.pdf`). A source under `sources/` may be any type, because the owner approved the source when `filing-project-records` filed it. Even under an accepted path, this skill never commits:

- every file under `delivery/migrations/`, except `.md` notes and `.gitignore`, because load files and backups there can hold production records and personal data;
- code files of any language, settings, `.json`, or spreadsheets such as `.xlsx`, except a source under `sources/`;
- hidden files and folders, such as `.env` or `.github/`, except a `.gitignore` under `delivery/`;
- instruction files (`AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, `SKILL.md`), anywhere and in any letter case;
- any path that Git ignores (`git -C <main> check-ignore <file>` prints it).

A document edit that would be wrong on the default branch without the code change it describes goes in the pull request of that code change.

## Steps

1. **Check the files.** Name every file in the save. Each must be under a path in "The paths of the project documents" and not refused by "Refused files".

   Save only an edit that the owner asked for or said yes to, an edit that the root `AGENTS.md` tells you to make without asking, or an edit that another skill tells you to save with this skill, for example `filing-project-records`. That request, yes, or instruction also covers the push in step 7, unless `.claude/rules/owner-preferences.md` says to ask the owner before a push; then ask before step 7.
2. **Look first.** Run `git -C <session folder> worktree list`, `git -C <session folder> status`, and `git -C <session folder> remote`. Find `<remote>` and `<default>` as `pull-latest`, "Find the remote and the default branch", says.
3. **Start the save worktree** in the main checkout, named `.claude/worktrees/docsave-<short-slug>`, where the slug names the save, for example `docsave-roadmap-phase-2`:

   ```text
   git -C <main> fetch <remote> <default>
   git -C <main> worktree add --detach .claude/worktrees/docsave-roadmap-phase-2 <remote>/<default>
   ```

4. **Make the edit in the save worktree**, and stage each file: `git -C <save> add -- <file>`. When this session already made the edit in its working checkout, carry it across as [references/carrying-an-edit.md](references/carrying-an-edit.md) says.
5. **Check the staged save** in the save worktree:

   ```text
   git -C <save> status --porcelain
   git -C <save> diff --cached --name-status
   git -C <save> diff --cached
   git -C <save> -c core.whitespace=-blank-at-eol diff --cached --check
   ```

   - `status --porcelain` must list only this save's files, each one staged. Fix an unstaged change, an untracked file (`??`), or any other path before you go on.
   - `diff --cached --check` must print nothing. The `-c` setting allows two trailing spaces, which make a line break in Markdown.
6. **Commit.** Run `git -C <save> commit -m '<plain message>'`. `<commit id>` is this commit, or the commit that a rebase in [references/recovery.md](references/recovery.md) makes in its place.
7. **Put the commit on the default branch.** Run `git -C <save> push <remote> HEAD:<default>`. Never force the push. When the push is refused because the default branch has commits that the save does not have, follow [references/recovery.md](references/recovery.md), "The default branch advanced".
8. **Verify, update the main checkout, clean up, and report.**
   - Run `git -C <save> fetch <remote> <default>`. Then `git -C <save> branch -r --contains <commit id>` must list `<remote>/<default>`.
   - Update the main checkout to `<remote>/<default>` as `pull-latest`, "Update the main checkout safely", says. When the only blocking file is this session's own copy of a saved file, remove that copy as [references/carrying-an-edit.md](references/carrying-an-edit.md) says, then update. A work item kept in the main checkout must not name a record that the main checkout does not hold.
   - When no other save of the same files is pending in this session, remove the save worktree: `git -C <main> worktree remove .claude/worktrees/docsave-<short-slug>`.
   - Note three things for the step that started this save: the commit id; where the commit is, in one of these two sentences: "Saved to main and pushed to the remote." or "No remote: saved to main on this computer only."; and whether the main checkout holds the save.
   - Put these three things in the reply only when the owner asked to publish or commit the documents, or when the main checkout does not hold the save. When it does not, say "The main checkout does not hold this save yet" and what blocks the update; the save is still finished. Otherwise say nothing about the commit or the remote.
   - When another skill started this save, go back to that skill and continue from the step that started it. Otherwise, end with the one question for the owner, or with the exact words that continue.

## Mistakes to avoid

- Never make, stage, or commit this save's edit in the main checkout.
- Never start a save from inside another save worktree.
- Other `docsave-` worktrees in `git worktree list` belong to other sessions. Do not change or remove them.

## Work that another skill does

| For | Use |
| --- | --- |
| A pull request for rules, skills, prompts, hooks, settings, or code | `managing-work-items` |
| What a decision entry, a source row, or a system document says; an ID that another session's save took | `filing-project-records` |
| A save that cannot finish now: the next action in its work item | `managing-work-items` |
| A save that cannot finish now: the next action in the handoff | `handoff` |

## References

| File | Open it when |
| --- | --- |
| [references/shared-record-paths.md](references/shared-record-paths.md) | You check whether a file is a project document. The memory choice supplies this file. |
| [references/carrying-an-edit.md](references/carrying-an-edit.md) | Step 4: carry an existing edit to the save worktree without overwriting newer records, and when to remove this session's own copy. |
| [references/recovery.md](references/recovery.md) | The push is refused, the default branch got new commits, or the save cannot finish now. |
| [references/no-remote.md](references/no-remote.md) | The repository has no remote: how the save is committed, verified, and recovered on this computer. |

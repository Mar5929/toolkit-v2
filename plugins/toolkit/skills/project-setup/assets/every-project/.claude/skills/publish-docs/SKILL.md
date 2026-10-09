---
name: publish-docs
description: 'Commits an approved edit to project documents directly to the default branch. Use when another skill asks for a document save or the owner asks to "publish the docs". For deciding what belongs in DECISIONS.md, sources/, or system/, use filing-project-records. For code, rules, skills, or work items, use managing-work-items.'
---

# Commit project documents to the default branch

Use this skill to commit a change to Git-tracked project documents directly to the default branch, with no pull request. The rule `.claude/rules/publish-project-documents.md` lists the paths of the project documents. The default branch is the repository's main branch, which is often `main`.

In this skill, a save is one commit of an agreed document edit. The commit is made in a temporary Git worktree of its own, which this skill calls the save worktree. A worktree is a separate folder with its own checked-out commit.

Two things must be true when the save is done: only the agreed document edit reaches the default branch, and no other session's work changes. A save is finished only when step 8 finds its commit on the default branch.

This skill decides nothing about what a document says. The skill that asked for the save decides what the document says.

Run each Git command on its own, with `git -C <folder>`, which names the folder that the command works in. The command then never depends on the current folder.

## Names used in the commands

- `<main>` is the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints.
- `<session folder>` is the folder this session works in.
- `<default>` is the name of the default branch. Step 2 finds it.
- `<save>` is the save worktree that step 3 makes.
- `<working checkout>` is the checkout where this session edited the document, normally `<session folder>`.
- `<short-slug>` is a short name for the save, such as `roadmap-phase-2`.
- `<file>` is one file of the save.
- `<commit id>` is the ID of the save's commit: the commit that step 6 makes, or the commit that a rebase in `references/recovery.md` makes in its place.

## Steps

1. **Check the files.** Name every file in the save. Each file must be a project document, which means that all four of these are true:
   - The file is under a path in the `paths` list at the top of the rule `.claude/rules/publish-project-documents.md`.
   - The file's type is `.md`, `.txt`, `.csv`, `.xml`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, or `.pdf`. A source under `sources/` may be any type, because the owner approved the source when `filing-project-records` filed it.
   - "Refused files" below does not refuse the file.
   - Git does not ignore the file. Run `git -C <main> check-ignore <file>`. When the command prints the path, Git ignores the file.

   Save only an edit that the owner asked for or said yes to, an edit that the root `AGENTS.md` tells you to make without asking, or an edit that another skill tells you to save with this skill, for example `filing-project-records`. That request, yes, or instruction also covers the push in step 7.
2. **Look first.** Run these three commands, each on its own:

   ```text
   git -C <session folder> worktree list
   git -C <session folder> status
   git -C <session folder> remote
   ```

   What `remote` prints decides how the save goes:
   - When the repository has remotes, but none is named `origin`, stop and ask the owner which remote holds the default branch. `references/recovery.md`, section "The repository has remotes, but none named `origin`", says how to name the remotes and when to rename one.
   - When the repository has no remote, the save is committed on the local default branch. Never fetch, and never push to a remote. The local `git push . HEAD:<default>` in step 7 is allowed, because it moves only a local branch.

   Then find the default branch:
   - With a remote, `git -C <main> symbolic-ref --short refs/remotes/origin/HEAD` prints `origin/<default>`.
     - When that command fails, run `git -C <main> fetch origin` and try the command again.
     - When it still fails, read the "HEAD branch" line of `git -C <main> remote show origin`.
     - When that line says "(unknown)", the remote has no branches. Ask the owner whether to push the default branch first.
   - With no remote, the default branch is the branch that the main checkout has: `git -C <main> branch --show-current`.
3. **Start the save worktree** inside the main checkout. Name it `.claude/worktrees/docsave-<short-slug>`, for example `docsave-roadmap-phase-2`.
   - First check that Git ignores that folder: `git -C <main> check-ignore .claude/worktrees/docsave-<short-slug>` must print the path.
   - When the command prints nothing, stop. Tell the owner that the project's `.gitignore` lacks the `.claude/worktrees/` line that every project gets. Adding the line is a settings change, not a document save.
   - Then run these two commands:

     ```text
     git -C <main> fetch origin <default>
     git -C <main> worktree add --detach .claude/worktrees/docsave-roadmap-phase-2 origin/<default>
     ```

   - With no remote, skip the fetch, and use `<default>` in place of `origin/<default>`.
4. **Make the edit in the save worktree, and stage each file by name:** `git -C <save> add -- <file>`. When this session already made the edit in its working checkout, carry the edit across as "Carrying an edit across" below says.
5. **Check the staged save** in the save worktree:

   ```text
   git -C <save> status --porcelain
   git -C <save> diff --cached --name-status
   git -C <save> diff --cached
   git -C <save> -c core.whitespace=-blank-at-eol diff --cached --check
   ```

   - `status --porcelain` must list only this save's files, each one staged. Before you go on, fix an unstaged change, an untracked file (`??`), or any other path.
   - Read the full staged diff.
   - `diff --cached --check` must print nothing. The `-c` setting allows two trailing spaces, which make a line break in Markdown.
6. **Commit.** Run `git -C <save> commit -m '<plain message>'`. Write the message in plain words, with no AI credit line.
7. **Put the commit on the default branch.**
   - With a remote, run `git -C <save> push origin HEAD:<default>`. Never force the push. When the push is refused because the default branch has commits that the save does not have, open `references/recovery.md`, section "The default branch advanced", which says how to bring the save up to date and try again.
   - With no remote, do these in order:
     1. Run `git -C <main> status --porcelain`. When it lists a file of this save that is not this session's own copy, that file is another session's work. Stop, name the file, and ask the owner.
     2. Move the local default branch forward in the checkout that has the default branch, which is normally the main checkout: `git -C <main> merge --ff-only <commit id>`. This command is a fast-forward: it moves the branch forward to the commit and makes no merge commit.
     3. When no checkout has the default branch, run `git -C <save> push . HEAD:<default>` in place of the fast-forward.
     4. When Git refuses the command, open `references/recovery.md`. It says what to do when the default branch has commits that the save does not have, and when a changed file blocks the fast-forward.
8. **Verify, update the main checkout, clean up, and report.**
   - Verify that the commit is on the default branch.
     - With a remote, run `git -C <save> fetch origin <default>`. Then `git -C <save> branch -r --contains <commit id>` must list `origin/<default>`.
     - With no remote, `git -C <main> branch --contains <commit id>` must list the default branch.
   - Find out whether the main checkout holds the save. With a remote, also bring the main checkout up to date. "The main checkout" below gives the steps.
   - When no other save of the same files is pending in this session, remove the save worktree: `git -C <main> worktree remove .claude/worktrees/docsave-<short-slug>`.
   - Note three things for the step that started this save:
     - the commit id;
     - where the commit is, in one of these two sentences: "Saved to main and pushed to the remote." or "No remote: saved to main on this computer only.";
     - whether the main checkout holds the save.
   - Put these three things in the reply to the owner only when the owner asked to publish or commit the documents, or when the main checkout does not hold the save. In every other case the save is finished and the main checkout holds it, so say nothing about the commit or the remote in the reply.
   - When another skill started this save, go back to that skill and continue from the step that started this save. Otherwise, end with the one question for the owner, or with the exact words that continue.

## Refused files

This skill never commits these files:

- Every file under `delivery/migrations/`, except `.md` notes and `.gitignore`. Load files and backups in that folder can hold production records and personal data.
- Code (`.js`, `.mjs`, `.py`, `.sh`, `.cls`, `.trigger`), settings, `.json`, and spreadsheets such as `.xlsx`. The one exception is a source under `sources/`.
- Hidden files and folders, such as `.env` or `.github/`. The one exception is a `.gitignore` under `delivery/`.
- Instruction files (`AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, `SKILL.md`), anywhere and in any letter case.
- Any path that Git ignores.

A refused file stays refused even under a path that the rule accepts.

Rules, skills, prompts, hooks, settings, and code use a pull request. A document edit that would be wrong on the default branch without the code change it describes goes in the pull request of that code change.

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

## The main checkout

The third thing that step 8 notes is whether the main checkout holds the save. The reason is that local work items and the command that checks the records, `.claude/hooks/validate-records.mjs`, look up a record's ID in the main checkout.

### With no remote

- When step 7 ran the fast-forward in the main checkout, the main checkout holds the save.
- When step 7 ran the fast-forward in another checkout, or ran `git push . HEAD:<default>`, the main checkout is on another branch and does not hold the save. Change nothing in the main checkout.

### With a remote

A pushed save is not in the main checkout yet. After step 8 verifies the save, move the main checkout's default branch forward. Use a fast-forward only: never merge, rebase, reset, or switch branches in the main checkout.

1. Run `git -C <main> branch --show-current`. It must print `<default>`. When it prints another branch, change nothing.
2. Do the merge-safety check. `git -C <main> diff --name-only HEAD origin/<default>` lists the files that the update changes, and `git -C <main> status --porcelain` lists the files with uncommitted changes. A file in both lists blocks the update.
   - When the file is this session's own copy of a saved file, remove the copy as "Carrying an edit across" says.
   - When the file is any other file, change nothing.
3. When no file blocks the update, run `git -C <main> merge --ff-only origin/<default>`. When Git refuses, change nothing.

### When the main checkout does not hold the save

The save is still finished. Say so in the reply in one line: "The main checkout does not hold this save yet", and then what blocks the update. What blocks the update is the branch that the main checkout is on, the files that block the update, or Git's message. Tell the skill that started the save.

## Mistakes to avoid

- Never make, stage, or commit this save's edit in the main checkout.
- Never start a save from inside another save worktree.
- Other `docsave-` worktrees in `git worktree list` belong to other sessions. Do not change or remove them.
- In Codex, the sandbox keeps `.git/` read-only and blocks the network. Run each Git write and each network call in this skill alone, with escalated permissions (`sandbox_permissions` set to `require_escalated`, with a one-line reason). The commands in `references/recovery.md` are included. When Codex refuses without asking, show the owner the exact command and ask the owner to run it.

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
| [references/recovery.md](references/recovery.md) | The push or the fast-forward is refused, the default branch got new commits, the repository has no `origin`, or the save cannot finish now. |

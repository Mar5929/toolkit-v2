---
name: publish-docs
description: 'Commits an approved edit to project documents, such as system/, DECISIONS.md, sources/, delivery/, and PROJECT.md, directly to the default branch, so it needs no pull request. Use when another skill hands over a document save, or the owner says "publish the docs". Not for deciding what DECISIONS.md, sources/, or system/ says; use filing-project-records. Not for code, rules, skills, or a work item; use running-work-item-lifecycle.'
---

# Publish a documentation save

Save a change to Git-tracked project documents directly to the default
branch, with no pull request, from a temporary Git worktree of its own (rule:
`.claude/rules/publish-project-documents.md`). Only the agreed document edit
reaches the default branch, no other session's work changes, and the save
is finished only when step 8 finds its commit on the default branch. This
skill decides nothing about what a document says: the skill that sent the
save does. Run each Git command on its own, with `git -C <folder>` so it
never depends on the current folder.

## Steps

1. **Check the files.** Name every file in the save. Each must be a project
   document:
   - under a path in the `paths` list at the top of the rule;
   - of type `.md`, `.txt`, `.csv`, `.xml`, `.png`, `.jpg`, `.jpeg`, `.gif`,
     `.svg`, or `.pdf`. An original under `sources/` may be any type: the
     owner approved it when `filing-project-records` filed it;
   - not refused below;
   - not ignored by Git (`git -C <main> check-ignore <file>` printing the
     path means ignored). `<main>` is the main checkout: the first path
     `git worktree list` prints.

   Save only an edit the owner asked for or said yes to, or one another
   skill tells you to save with this skill (for example
   `filing-project-records`). That covers the push in step 7.
2. **Look first.** Run `git -C <session folder> worktree list`,
   `git -C <session folder> status`, and `git -C <session folder> remote`,
   each on its own. `<session folder>` is the folder this session works in.
   - Remotes, but none named `origin`: stop and ask the owner which remote
     holds the default branch (`references/recovery.md`).
   - No remote: the save is committed on the local default branch. Never
     fetch, and never push to a remote. The local `git push . HEAD:<default>`
     in step 7 is allowed: it moves only a local branch.
   - The default branch: with a remote,
     `git -C <main> symbolic-ref --short refs/remotes/origin/HEAD` prints
     `origin/<default>`. If it fails, run `git -C <main> fetch origin` and try
     again, then read the "HEAD branch" line of
     `git -C <main> remote show origin`; "(unknown)" means the remote has no
     branches, so ask the owner whether to push the default branch first.
     With no remote, it is the branch the main checkout has
     (`git -C <main> branch --show-current`).
3. **Start the save worktree** inside the main checkout, named
   `.claude/worktrees/docsave-<short-slug>` (for example
   `docsave-roadmap-phase-2`). First
   `git -C <main> check-ignore .claude/worktrees/docsave-<short-slug>` must
   print the path. It prints nothing: stop, and tell the owner the project's
   `.gitignore` lacks the `.claude/worktrees/` line every project gets;
   adding it is a settings change, not a document save. Then:

   ```text
   git -C <main> fetch origin <default>
   git -C <main> worktree add --detach .claude/worktrees/docsave-roadmap-phase-2 origin/<default>
   ```

   With no remote, skip the fetch and use `<default>` in place of
   `origin/<default>`.
4. **Make the edit in the save worktree and stage each file by name:**
   `git -C <save> add -- <file>`. When this session already made the edit in
   its working checkout, carry it across (below).
5. **Check the staged save** in the save worktree:

   ```text
   git -C <save> status --porcelain
   git -C <save> diff --cached --name-status
   git -C <save> diff --cached
   git -C <save> -c core.whitespace=-blank-at-eol diff --cached --check
   ```

   `status --porcelain` lists only this save's files, each staged; fix an
   unstaged change, an untracked file (`??`), or any other path before going
   on. Read the full staged diff. `diff --cached --check` prints nothing (the
   `-c` setting allows two trailing spaces, a Markdown line break).
6. **Commit:** `git -C <save> commit -m '<plain message>'`, with no AI credit
   line.
7. **Publish.**
   - With a remote: `git -C <save> push origin HEAD:<default>`. Never force.
     Refused because the default branch has commits the save does not: open
     `references/recovery.md`, "The default branch advanced".
   - No remote: first run `git -C <main> status --porcelain`. A file of this
     save listed there that is not this session's own copy is another
     session's work: stop, name it, and ask the owner. Then move the local
     default branch forward in the checkout that has it, normally the main
     checkout: `git -C <main> merge --ff-only <commit id>`. When no checkout
     has it: `git -C <save> push . HEAD:<default>`. Refused: open
     `references/recovery.md`.
8. **Verify, update the main checkout, clean up, report.**
   - With a remote: `git -C <save> fetch origin <default>`, then
     `git -C <save> branch -r --contains <commit id>` must list
     `origin/<default>`. With no remote:
     `git -C <main> branch --contains <commit id>` must list the default
     branch.
   - Find out whether the main checkout holds the save, and with a remote
     bring it up to date ("The main checkout", below).
   - When no other save of the same files is pending in this conversation,
     remove the save worktree:
     `git -C <main> worktree remove .claude/worktrees/docsave-<short-slug>`.
   - Report the commit id, where it is ("Saved to main and pushed to the
     remote." or "No remote: saved to main on this computer only."), and
     whether the main checkout holds it. When another skill started this
     save, go back to it and continue from the step that started this save.
     Otherwise end with the one question for the owner or the exact words
     that continue.

## Gotchas

- Never make, stage, or commit this save's edit in the main checkout, and
  never start a save from inside another save worktree. Other `docsave-`
  worktrees in `git worktree list` belong to other sessions: do not change or
  remove them.
- In Codex the sandbox keeps `.git/` read-only and blocks the network. Run
  each Git write and each network call in this skill, `references/recovery.md`
  included, alone, with escalated permissions (`sandbox_permissions` set to
  `require_escalated`, with a one-line reason). When Codex refuses without
  asking, show the owner the exact command and ask him to run it.

## Refused files

- Every file under `delivery/migrations/` except `.md` notes and `.gitignore`.
  Load files and backups there can hold production records and personal data.
- Code (`.js`, `.mjs`, `.py`, `.sh`, `.cls`, `.trigger`), settings, `.json`,
  and spreadsheets such as `.xlsx`, except an original under `sources/`.
- Hidden files and folders such as `.env` or `.github/`, except a
  `.gitignore` under `delivery/`.
- Instruction files (`AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, `SKILL.md`)
  anywhere, in any letter case.
- Any path Git ignores.

A refused file stays refused even under a path the rule accepts. Rules,
skills, prompts, hooks, settings, and code use a pull request. A document
edit that would be wrong on the default branch without the code change it
describes goes in that code's pull request.

## Carrying an edit across

When this session already edited a document in its working checkout, check
each edited file before you copy it. `<save commit>` is what
`git -C <save> rev-parse HEAD` prints before step 6:

```text
git -C <working checkout> diff --quiet HEAD <save commit> -- <file>
```

- Exit code 0: the working checkout started from the version the save
  worktree has. Copy the edited file to the same path in the save worktree.
- Exit code 1: the two versions differ. Never copy the file: the copy would
  remove what the default branch has and the working checkout lacks. Make
  the same change by hand in the save worktree's file.
  `git -C <working checkout> diff HEAD -- <file>` shows the change.

Stage each file, and run the step 5 checks. Then remove this session's own
copy from the working checkout, only for files this session edited or
created: `git -C <working checkout> restore -- <file>` for a changed file,
`rm` for a new one.

- With a remote: remove it after step 8 verifies the save, before the main
  checkout is brought up to date. The published version comes back with that
  update, or with the next `pull-latest` when the working checkout is another
  worktree.
- With no remote: remove it before step 7, once the file is staged. Git refuses
  the fast-forward while the main checkout holds a changed copy of a saved
  file, or an untracked copy of a new one.

Never discard another session's changes.

## The main checkout

Local work items and the record check
(`.claude/hooks/validate-records.mjs`) look up a record's ID in the main
checkout, so the report says whether the main checkout holds the save.

With no remote, the main checkout holds the save when step 7 ran the
fast-forward in the main checkout. When step 7 ran it in another checkout, or
ran `git push . HEAD:<default>`, the main checkout is on another branch and
does not hold the save: change nothing there.

With a remote, a pushed save is not in the main checkout yet. After step 8
verifies the save, move the main checkout's default branch forward.
Fast-forward only: never merge, rebase, reset, or switch branches there.

1. `git -C <main> branch --show-current` prints `<default>`. It prints
   another branch: change nothing.
2. The merge-safety check: `git -C <main> diff --name-only HEAD origin/<default>`
   lists the files the update changes, and `git -C <main> status --porcelain`
   lists the files with uncommitted changes. A file in both lists blocks the
   update. This session's own copy of a saved file: remove it as "Carrying an
   edit across" says. Any other file: change nothing.
3. No file blocks the update: `git -C <main> merge --ff-only origin/<default>`.
   Git refuses: change nothing.

When the main checkout does not hold the save, the save is still finished.
Say so in the report in one line: "The main checkout does not hold this save
yet", then what blocks the update: the branch the main checkout is on, the
files that block it, or Git's message. Tell the skill that started the save.

## Hand-offs

| For | Use |
| --- | --- |
| A pull request for rules, skills, prompts, hooks, settings, or code | `running-work-item-lifecycle` |
| What a decision entry, a source row, or a system document says; an ID that another session's save took | `filing-project-records` |
| A save that cannot finish now: the next action in its work item | `using-work-tracker` |
| A save that cannot finish now: the next action in the handoff | `handoff` |

## References

| File | Open it when |
| --- | --- |
| [references/recovery.md](references/recovery.md) | The push or the fast-forward is refused, the default branch got new commits, the repository has no `origin`, or the save cannot finish now |

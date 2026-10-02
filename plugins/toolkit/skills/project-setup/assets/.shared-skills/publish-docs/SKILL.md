---
name: publish-docs
description: 'Commits project document edits (requirements/, system guide, PROJECT-ROADMAP.md, PROJECT.md, READMEs) to the default branch, so it needs no pull request and touches no other session. Use when the owner asked for or approved a document edit, or says "publish the docs" or "save the docs to main". Not for a work item''s requirements, or for code, rules, or skills; use managing-work-items.'
---

# Publish a documentation save

Save a change to Git-tracked project documents straight to the default
branch, with no pull request, from a temporary Git worktree of its own (rule:
`.claude/rules/publish-project-documents.md`). Run each Git command on its
own, with `git -C <folder>` so it never depends on the current folder.

## Steps

1. **Check the files.** Name every file in the save. Each must be a project
   document: under the rule's paths, of type `.md`, `.txt`, `.csv`, `.xml`,
   `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, or `.pdf`, not refused below, and
   not ignored by Git (`git -C <main> check-ignore <file>` printing the path
   means ignored). `<main>` is the main checkout: the first path
   `git worktree list` prints. Save only an edit the owner asked for or said yes to, or one
   another skill tells you to save with this skill (for example
   `managing-work-items`, in Reflecting). That covers the push in step 7.
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
     branches, so ask the owner whether to push the default branch first. With no remote, it is the branch
     the main checkout has (`git -C <main> branch --show-current`).
3. **Start the save worktree** inside the main checkout, named
   `.claude/worktrees/docsave-<short-slug>` (for example
   `docsave-roadmap-phase-2`). First
   `git -C <main> check-ignore .claude/worktrees/docsave-<short-slug>` must
   print the path. It prints nothing: stop, and tell the owner the project's `.gitignore` lacks the
   `.claude/worktrees/` line every project gets; adding it is a settings
   change, not a document save. Then:

   ```text
   git -C <main> fetch origin <default>
   git -C <main> worktree add --detach .claude/worktrees/docsave-roadmap-phase-2 origin/<default>
   ```

   With no remote, skip the fetch and use `<default>` in place of
   `origin/<default>`.
4. **Make the edit in the save worktree and stage each file by name:**
   `git -C <save> add -- <file>`. When this session already made the edit in
   its working checkout, carry it across (below). A new topic folder under
   `ai-external-knowledge/` gets its row in `ai-external-knowledge/INDEX.md`
   in the same save.
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
   - No remote: move the local default branch forward in the checkout that has
     it, normally the main checkout:
     `git -C <main> merge --ff-only <commit id>`. When no checkout has it:
     `git -C <save> push . HEAD:<default>`. Refused: open
     `references/recovery.md`.
8. **Verify, clean up, report.**
   - With a remote: `git -C <save> fetch origin <default>`, then
     `git -C <save> branch -r --contains <commit id>` must list
     `origin/<default>`. With no remote:
     `git -C <main> branch --contains <commit id>` must list the default
     branch.
   - When no other save of the same files is pending in this conversation,
     remove the save worktree:
     `git -C <main> worktree remove .claude/worktrees/docsave-<short-slug>`.
   - Report the commit id and where it is ("Saved to main and pushed to the
     remote." or "No remote: saved to main on this computer only."). When
     another skill started this save, go back to it and continue from the step
     that started this save. Otherwise end with the one question for the owner
     or the exact words that continue.

## Gotchas

- Codex keeps `.git/` read-only and turns the network off. Every Git write
  here runs alone, outside the sandbox (`sandbox_permissions` set to
  `require_escalated`, with a one-line reason). If Codex refuses without
  asking, show the owner the exact command and wait.
- Never make, stage, or commit this save's edit in the main checkout, and
  never start a save from inside another save worktree. Other `docsave-`
  worktrees in `git worktree list` belong to other sessions: do not change or
  remove them.
- Never edit a captured page in `ai-external-knowledge/` to make it agree with
  the project.

## Refused files

- Every file under `delivery/data/` except `.md` notes and `.gitignore`.
  Load files and backups there can hold production records and personal data.
- Code (`.js`, `.mjs`, `.py`, `.sh`, `.cls`, `.trigger`), settings, `.json`,
  and spreadsheets such as `.xlsx`.
- Hidden files and folders such as `.env` or `.github/`, except a
  `.gitignore` under `delivery/`.
- Instruction files (`AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, `SKILL.md`)
  anywhere, in any letter case.
- Any path Git ignores.

A refused file stays refused even under a path the rule accepts. Rules, skills,
prompts, hooks, settings, and code use a pull request. A document edit that
would be wrong on the default branch without the code change it describes goes in that code's pull request.

## Carrying an edit across

When this session already edited a document in its working checkout, copy each
edited file to the same path in the save worktree, stage it, and run the
step 5 checks. Then remove this session's own copy from the working checkout,
only for files this session edited or created:
`git -C <working checkout> restore -- <file>` for a changed file, `rm` for a
new one.

- With a remote: do it after step 8 verifies the save. The published version
  comes back with the next `pull-latest`.
- With no remote: do it before step 7, once the copy is staged. Git refuses
  the fast-forward while the main checkout holds a changed copy of a saved
  file, or an untracked copy of a new one.

Never discard another session's changes.

## Hand-offs

| For | Use |
| --- | --- |
| A pull request for rules, skills, prompts, hooks, settings, or code, or a work item's requirements | `managing-work-items` |
| A save that cannot finish now: the next action in its work item | `tracking-work-items` |
| A save that cannot finish now: the next action in the handoff | `handoff` |

## References

| File | Open it when |
| --- | --- |
| [references/recovery.md](references/recovery.md) | The push or the fast-forward is refused, the default branch got new commits, the repository has no `origin`, or the save cannot finish now |

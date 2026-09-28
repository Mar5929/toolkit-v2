---
name: publish-docs
description: 'Commits and pushes an agreed edit of committed project documents (requirements/, system-guide/, DECISIONS.md, PROJECT.md, PROJECT-ROADMAP.md, ai-external-knowledge/, delivery/) straight to the default branch. Use whenever such an edit is ready to save. Not for code, rules, skills, or .memory/.'
---

# Publish a documentation save

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Save an agreed change to Git-tracked project documents straight to the default
branch, with no pull request (rule: `.claude/rules/publish-project-documents.md`).

1. **Confirm it is documentation in an allowed path**, not code, rules, skills,
   hooks, settings, `.memory/`, or `.work-items/` (list below).
2. **Start a save workspace** with the script in the `scripts/` folder beside
   this `SKILL.md`. It fetches the remote (with no remote, it uses the local
   default branch and says so), makes a sparse worktree beside the project,
   and prints its path. Work only there for this save.

   ```text
   node <this skill's folder>/scripts/publish-docs.mjs start --branch <default-branch> -- <file> [more files]
   ```

3. **Make the edit there and stage the files by name.** Read the full staged
   diff. Add `DECISIONS.md` rows only with `toolkit decision add`, run there.
   After a change under `ai-external-knowledge/`, regenerate its index there
   ("Step 3 in detail") and stage `ai-external-knowledge/INDEX.md` too.
4. **Publish** from the save workspace. It refuses other staged paths,
   unstaged or untracked files, and conflict markers (two trailing spaces, a
   Markdown line break, are fine); commits; pushes without force and checks
   the remote has the commit. With no remote it moves the local default
   branch forward by fast-forward only: "No remote: committed locally."

   ```text
   node <this skill's folder>/scripts/publish-docs.mjs publish --message '<plain commit message>'
   ```

5. **Report** the commit id and where it is (the remote, or "No remote:
   committed locally on <branch>."), remove the clean save workspace after
   the task's last publish (`git worktree remove <path>`), and end with the
   one question for the owner or the exact words that continue.

Codex: its sandbox keeps `.git/` read-only, so every Git write here (the script's `start` and `publish`, `git add`, `git commit`, `git push`, `git worktree add` and `remove`) needs the owner's approval and escalated permissions. Run each one as its own command with `sandbox_permissions` set to `require_escalated` and a one-line reason saying what it does; an approval without escalation still runs inside the sandbox and fails on `.git/index.lock`. When Codex refuses a command without asking ("approval required by policy"), stop, show the owner the exact command, and ask him to approve it in an interactive session or run it in a terminal. With no remote (`git remote` prints nothing), never run `git fetch` or `git push` yourself; the script skips both.

## What counts as documentation

The project documents are the paths in the project's
`publish-project-documents.md` rule. The script accepts only these:

- Files under `requirements/`, `system-guide/`, `ai-external-knowledge/`, and
  `delivery/` of these document types: `.md`, `.txt`, `.csv`, `.xml`, `.png`,
  `.jpg`, `.jpeg`, `.gif`, `.svg`, `.pdf` (for example
  `delivery/deployment/component-tracker.csv` and a `package.xml`). A
  `.gitignore` file under `delivery/` is also accepted. `delivery/` exists
  only in Salesforce projects.
- `DECISIONS.md`, `PROJECT.md`, and `PROJECT-ROADMAP.md` at the project root,
  and `tools/permissions/PERMISSIONS-RUNBOOK.md` in a Salesforce project.
- `README.md` files.

It refuses:

- Every file under `delivery/data/` except `.md` notes and `.gitignore`,
  whatever `.gitignore` says. Load files and backups there can hold production
  records and personal data, and `.gitignore` there lists only some file types.
- Any other file type: code (`.js`, `.mjs`, `.py`, `.sh`, `.cls`, `.trigger`),
  settings, `.json`, spreadsheets.
- Hidden files and folders, such as `.env` or `.github/`.
- `.memory/` and `.work-items/`. They are local and Git-ignored; change them
  only through `toolkit memory` and `toolkit work` commands.
- Instruction files (`AGENTS.md`, `CLAUDE.md`, `SKILL.md`) anywhere, in any
  letter case.
- Any path Git ignores.

A folder or a `.md` extension alone does not make a file documentation. Rules,
skills, prompts, hooks, settings, and code change behavior: they use a worktree
and a pull request. Documentation that cannot be separated from a code change
stays with that change and its review. Do not split dependent changes to avoid
review, and do not describe an unshipped feature as shipped.

This skill changes how a save is published, not who may change the content.
Saving requirements or a design does not approve them or their build.

## Step 1 in detail: choose the exact files

Confirm the repository, the default branch, the remote, and the Git identity
that will publish. Name every file in the save. Look at existing local edits
first; never take another session's uncommitted work or overwrite it.

When this session already made the edit in its working checkout, carry it
across: start the save workspace, copy each edited file into the same path
there, stage, and publish. Then remove this session's own copy from the
working checkout, only for files this session edited or created: a changed
file goes back to its committed state (`git restore -- <file>`); a new file
this session created there has no committed state, so delete that copy
(`rm <file>`):

- With a remote: after the publish is verified. The published version comes
  back with the next `pull-latest`, which would otherwise stop on the changed
  file.
- With no remote: before `publish`, once the copy is staged in the save
  workspace. `publish` moves the default branch forward in the checkout that
  has it checked out, and Git refuses that while the checkout holds a changed
  copy of a saved file, or an untracked copy of a new one. When it refuses,
  the commit is kept in the save workspace: restore this session's own
  changed copy, or delete its own copy of a new file, and run `publish` again.
  Never discard another session's changes.

## Step 3 in detail: the knowledge index and decision rows

`ai-external-knowledge/INDEX.md` is generated. Never edit it by hand. In the
save workspace, run:

```text
toolkit index knowledge
```

Then stage the regenerated `ai-external-knowledge/INDEX.md` with the files you
changed. The script allows that file in any save that touches
`ai-external-knowledge/`.

`DECISIONS.md` rows are written by `toolkit decision add`, run in the save
workspace. It assigns the next id. Never type a row by hand.

Check links and formatting in the other documents you changed. A failed check
or an unexpected staged path leaves the save unfinished. Never bypass a failing
check.

## Recover without losing work

- The default branch advanced: bring this save workspace current (fetch, then
  rebase or merge onto `origin/<default-branch>` inside the save workspace
  only; with no remote, rebase onto the local `<default-branch>`), regenerate
  the knowledge index if the save touches it, rerun the checks, and run
  `publish` again. A refused push does not touch any other
  checkout. Ask the owner only when the meaning of the change or who approved
  it changes.
- The default branch advanced and both sides added `DECISIONS.md` rows: take
  the remote's `DECISIONS.md`, then run `toolkit decision add` again for this
  save's rows, so each gets the next free id. Never renumber the other rows.
- A refused push, an account mismatch, a login prompt, a protected branch, a
  conflict, or a failed check: report separately what is written, checked,
  committed, and published. Keep the save workspace, any commit id, and the
  exact next action in the work item or the handoff.
- The repository has remotes but none named `origin`: `start` stops, names
  them, and makes nothing. The script fetches and pushes `origin` only. Ask
  the owner which remote holds the default branch; rename it to `origin` only
  with his yes.
- Never force-push, bypass branch protection, retry through another account,
  reset, or stash another session's work. An unpushed commit is unfinished.
- Reuse the same save workspace only while a follow-up save to the same files
  is still pending in this task. Do not delete another session's save
  workspace.

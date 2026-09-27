---
name: publish-docs
description: "Commits and pushes an agreed edit to Git-tracked project documents (requirements/, system-guide/, DECISIONS.md, PROJECT.md, PROJECT-ROADMAP.md, ai-external-knowledge/, delivery/) to the default branch from an isolated worktree. Use after such an edit. Not for code, rules, skills, or .memory/."
---

# Publish a documentation save

Save an agreed change to Git-tracked project documents from its own temporary
worktree, and push it straight to the default branch with no pull request.
The project's rule for this is `.claude/rules/publish-project-documents.md`;
its `paths` list names the documents this skill saves.

1. **Confirm it is documentation in an allowed path**, not code, rules, skills,
   hooks, settings, `.memory/`, or `.work-items/` (list below).
2. **Start a save workspace** from the project, with the script in the
   `scripts/` folder beside this `SKILL.md`:

   ```text
   node <this skill's folder>/scripts/publish-docs.mjs start --branch <default-branch> -- <file> [more files]
   ```

   It fetches the remote, creates a separate sparse worktree beside the project,
   and prints its path. Work only in that path for this save.
3. **Make the edit there and stage the files by name.** Read the full staged
   diff. Add `DECISIONS.md` rows only with `toolkit decision add`, run there.
   After a change under `ai-external-knowledge/`, regenerate its index there
   ("Step 3 in detail") and stage `ai-external-knowledge/INDEX.md` too.
4. **Publish** from the save workspace:

   ```text
   node <this skill's folder>/scripts/publish-docs.mjs publish --message "<plain commit message>"
   ```

   It refuses other staged paths, unstaged or untracked files, and conflict
   markers (trailing spaces are fine: two make a Markdown line break); commits;
   pushes without force; and checks the remote has the commit.
5. **Report** the commit id and that it reached the remote. After the task's
   last publish, remove the clean save workspace (`git worktree remove <path>`).

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

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
there, stage, and publish. After the publish is verified, return this
session's own copy in the working checkout to its committed state
(`git restore -- <file>`, only for files this session edited). The published
version comes back with the next `pull-latest`, which would otherwise stop on
the changed file.

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
  only), regenerate the knowledge index if the save touches it, rerun the
  checks, and run `publish` again. A refused push does not touch any other
  checkout. Ask the owner only when the meaning of the change or who approved
  it changes.
- The default branch advanced and both sides added `DECISIONS.md` rows: take
  the remote's `DECISIONS.md`, then run `toolkit decision add` again for this
  save's rows, so each gets the next free id. Never renumber the other rows.
- A refused push, an account mismatch, a login prompt, a protected branch, a
  conflict, or a failed check: report separately what is written, checked,
  committed, and published. Keep the save workspace, any commit id, and the
  exact next action in the work item or the handoff.
- Never force-push, bypass branch protection, retry through another account,
  reset, or stash another session's work. An unpushed commit is unfinished.
- Reuse the same save workspace only while a follow-up save to the same files
  is still pending in this task. Do not delete another session's save
  workspace.

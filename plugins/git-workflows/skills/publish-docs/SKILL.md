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
   default branch), makes a sparse worktree in `.claude/worktrees/` (beside
   the project when Git does not ignore it), and prints its path. Work there.

   ```text
   node <this skill's folder>/scripts/publish-docs.mjs start --branch <default-branch> -- <file> [more files]
   ```

3. **Make the edit there and stage the files by name.** Read the full staged
   diff. Add `DECISIONS.md` rows only with `toolkit decision add`, run there.
   After a change under `ai-external-knowledge/`, regenerate its index there
   ("Step 3 in detail") and stage `ai-external-knowledge/INDEX.md` too.
4. **Publish** from the project folder, naming the path `start` printed. It
   refuses other staged, unstaged, or untracked files and conflict markers;
   commits; pushes without force and checks the remote has the commit. No
   remote: it moves the local default branch forward. It stops, or the push
   is refused: open `references/recovery.md`.

   ```text
   node <this skill's folder>/scripts/publish-docs.mjs publish --workspace <save workspace path> --message '<plain commit message>'
   ```

5. **Report** the commit id and where it is (the remote, or "No remote:
   committed locally on <branch>."), remove the clean save workspace after
   the task's last publish (`git worktree remove <path>`), and end with the
   one question for the owner or the exact words that continue.

## Gotchas

- Codex keeps `.git/` read-only. The script's `start` and `publish`,
  `git add`, and `git worktree remove` each run alone, with
  `sandbox_permissions` set to `require_escalated` and a one-line reason.
  Refused without asking: show the owner the exact command and wait
  (`references/git-rules.md`, "Git writes in Codex").
- Stage with `git -C <save workspace path> add -- <file>` and publish with
  `--workspace`, from the project folder. In Claude Code a `cd` into the save
  workspace is fine when it is under `.claude/worktrees/`; a `cd` into a
  workspace beside the project needs the owner's approval each time, and
  `claude -p` refuses it.
- When `start` put the workspace beside the project (the project's
  `.gitignore` does not list `.claude/worktrees/`), it is outside the folder
  Codex may write to. Codex asks the owner before every file edit or copy
  there, and under `codex exec` it refuses them. In a `codex exec` run, stop
  after `start`, show the owner the workspace path and the edit, and ask him
  to run the save in an interactive session.
- No remote (`git remote` prints nothing): never run `git fetch` or
  `git push` yourself. The script skips both and commits on the local default
  branch.
- Saving requirements or a design does not approve them or their build.
- `publish` refuses conflict markers and whitespace errors, but not two
  trailing spaces at the end of a line: that is a Markdown line break the
  templates use. Leave them.
- `DECISIONS.md` rows and `ai-external-knowledge/INDEX.md` are written by
  `toolkit` commands, never by hand.
- An unpushed commit is unfinished. The save is done only when the remote has
  the commit, or, with no remote, when the local default branch has it.

## References

| File | Open it when |
| --- | --- |
| `references/recovery.md` | `start` or `publish` stops, the push is refused, the default branch advanced, or `DECISIONS.md` rows collide |
| `references/git-rules.md` | Before a Git write in Codex, or when staging, commit messages, or the no-remote case need the full rule |
| `scripts/publish-docs.mjs` | Run it (steps 2 and 4). Do not read it into the conversation |

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

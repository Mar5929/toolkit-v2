# Putting the setup copy into the project

Purpose: copy the finished setup copy into the project without overwriting
a file the project already has, decide each file that differs with the
owner, make the `.agents/skills` link, and turn on the check that runs
before each commit. Run every command from the project folder. `<copy>` is
the scratch folder from `setup-copy.md`.

## Contents

- 1. See what would change
- 2. Copy the files the project does not have
- 3. Files the project already has
- 4. The .agents/skills link
- 5. The pre-commit check
- 6. Check

## 1. See what would change

```text
rsync -rcni <copy>/ ./
```

It writes nothing. Each line that starts with `>f` names a file:

- `>f+++++++` is a file the project does not have yet;
- any other `>f` line is a file the project has, with different content.

Lines for folders (`cd`) need nothing.

## 2. Copy the files the project does not have

```text
rsync -rlt --ignore-existing <copy>/ ./
```

It writes only missing files and never replaces one the project has. In a
new, empty folder this is the whole copy. Use `-rlt`, not `-a`: `-a` would
give the project folder the scratch folder's private permissions.

## 3. Files the project already has

For each file that differs, read the difference:

```text
diff -u <file> <copy>/<file>
```

| File | What to do |
| --- | --- |
| `.gitignore` | Add each line of the setup copy's file that the project's file lacks, at the end after one blank line. It only adds, so no question is needed. |
| `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge the setup copy's entries into the project's file with the merge rules in `skills-hooks-settings.md`. Ask before changing any value the project already has. |
| `CLAUDE.md` with more than the line `@AGENTS.md` | Keep it. Ask whether to add the line `@AGENTS.md` at its top: while a `CLAUDE.md` exists, Claude Code reads `AGENTS.md` only through that line. |
| `AGENTS.md` (a repository that had its own) | Keep it. Show the owner what the Toolkit V2 version adds. After his yes, add its sections, and keep his text. |
| Every other file (`README.md`, a rule, a template) | In its table row, say in one line what differs, and recommend one: keep his, take the toolkit's, or merge the two. His file stays until he chooses. |

Show every file that needs his answer in one numbered table, one row per
file, each with a one-line reason, and ask once. Carry out each row as he
answers it; a "yes to all" applies every row as shown.

## 4. The .agents/skills link

Codex reads project skills from `.agents/skills`; Claude Code from
`.claude/skills`. The project keeps one copy, so a fix reaches both hosts:
`.agents/skills` is a link to `.claude/skills` (Codex follows linked
folders).

```text
mkdir -p .agents
ln -s ../.claude/skills .agents/skills
```

When `.agents/skills` is already a real folder:

```text
diff -r .agents/skills .claude/skills
```

- No difference, or only lines that start with "Only in .claude/skills"
  (every file in `.agents/skills` is also in `.claude/skills`, with the same
  content): tell the owner, and after his yes remove the folder and make the
  link.
- Anything else: stop and ask. It may hold his own Codex skills; after his
  yes, move each into `.claude/skills/` first.

Git stores the link as a link. Never replace it with copied folders to get
past a problem; tell the owner instead.

## 5. The pre-commit check

`.githooks/pre-commit` runs `.claude/hooks/validate-records.mjs` before
each commit and stops a commit that breaks the form of a record or changes
a filed original. Git runs it only when `core.hooksPath` is `.githooks` in
this copy of the repository. The setting is not in a file Git tracks, so
each clone and each computer needs this section once; every worktree of
one clone uses the same setting. New project, "update the toolkit", and a
move-over all do this section.

1. Keep the file executable. Git stores the mode with the file:

   ```text
   chmod +x .githooks/pre-commit
   ```

   In an update or a move-over, run it in your worktree, where the file
   is.
2. Look, in the main checkout. Both commands only read:

   ```text
   git config --get core.hooksPath
   ls "$(git rev-parse --git-path hooks)"
   ```

3. Use the first row that fits:

   | The commands show | Do |
   | --- | --- |
   | Git says this is not a Git repository | Skip this section, and tell the owner the check will not run before commits. |
   | The first prints `.githooks` | Nothing. |
   | The first prints another folder | Change nothing. Tell the owner as the text below the table says, naming that folder. |
   | The first prints nothing, and the second lists any file whose name does not end in `.sample`, such as `pre-commit`, `commit-msg`, `pre-push`, or the hooks Git LFS installs | Change nothing: with `core.hooksPath` set, Git stops running every hook in that folder. Tell the owner as the text below the table says, naming each of those files. |
   | The first prints nothing, and the second lists only files whose names end in `.sample`, lists no file, or says the folder does not exist | `git config core.hooksPath .githooks` |

   What to tell the owner when nothing is changed: the folder or the files
   that are already there; that the record check will not run before
   commits in this project; and that he can run it from his own hooks with
   this one line in the `pre-commit` file of that folder, in a new file
   named `pre-commit` when the folder has none:

   ```text
   "$(git rev-parse --show-toplevel)/.githooks/pre-commit" || exit 1
   ```

   Never add the line for him, and never change his setting.

"Check the setup" changes nothing here: the final checks in `finishing.md`
report the setting, whether the file is executable, and what the record
check prints.

## 6. Check

```text
rsync -rcni <copy>/ ./
ls -la .agents
git status --short
git config --get core.hooksPath
```

- The first lists only files the owner chose to keep as his.
- `.agents` shows `skills -> ../.claude/skills`, and `ls .agents/skills`
  shows the skills.
- `core.hooksPath` prints `.githooks`, or the owner was told why it does
  not.
- `git status` lists the new files and nothing under `work-items/` or
  `memory/`: Git ignores both.

Keep the scratch folder until the end of the final checks in `finishing.md`,
which says when to remove it.

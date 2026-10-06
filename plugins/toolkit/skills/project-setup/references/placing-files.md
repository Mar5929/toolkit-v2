# Putting the setup copy into the project

Use this file to copy the finished setup copy into the project. The setup copy is the project's finished files, built in a temporary folder before anything is put into the project. Open this file at step 6 of "New project" in `SKILL.md`. An update and a move-over also follow "5. The pre-commit check".

The job is done when four things are true: the project has every file of the setup copy, except a file that the owner chose to keep as it was; no file that the project already had was overwritten without the owner's answer; `.agents/skills` is a link to `.claude/skills`; and the check that runs before each commit is turned on, or the owner was told why it is not.

Run every command from the project folder. `<copy>` stands for the temporary folder that holds the setup copy. `setup-copy.md`, "Make the temporary folder", says how that folder is made.

## Contents

- 1. See what would change
- 2. Copy the files the project does not have
- 3. Files the project already has
- 4. The .agents/skills link
- 5. The pre-commit check
- 6. Check

## 1. See what would change

Run this command. It writes nothing.

```text
rsync -rcni <copy>/ ./
```

Each line that starts with `>f` names a file:

- A line that starts with `>f+++++++` names a file that the project does not have yet.
- Any other `>f` line names a file that the project has, with different content.

Lines for folders (`cd`) need nothing.

## 2. Copy the files the project does not have

```text
rsync -rlt --ignore-existing <copy>/ ./
```

This command writes only missing files and never replaces a file that the project has. In a new, empty folder this command is the whole copy. Use `-rlt`, not `-a`, because `-a` would give the project folder the temporary folder's private permissions.

## 3. Files the project already has

For each file that differs, read the difference:

```text
diff -u <file> <copy>/<file>
```

Then do what the table says for that file.

| File | What to do |
| --- | --- |
| `.gitignore`, `.ignore` | Add each line of the setup copy's file that the project's file lacks, at the end after one blank line. This change only adds lines, so no question is needed. |
| `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge the setup copy's entries into the project's file. `skills-hooks-settings.md`, "Merge rules", gives the rules for the merge. Ask the owner before you change any value that the project already has. |
| `CLAUDE.md` with more than the line `@AGENTS.md` | Keep the project's file. Ask the owner whether to add the line `@AGENTS.md` at its top, because while a `CLAUDE.md` exists, Claude Code reads `AGENTS.md` only through that line. |
| `AGENTS.md` (a repository that had its own) | Keep the project's file. Show the owner what the Toolkit V2 version adds. After the owner's yes, add the sections of the Toolkit V2 version, and keep the owner's text. |
| Every other file (`README.md`, a rule, a template) | In the file's row of the numbered table described below, say in one line what differs, and recommend one of three choices: keep the owner's file, take the toolkit's file, or merge the two. The owner's file stays until the owner chooses. |

The file `.ignore`, in the first row, makes search tools that skip what `.gitignore` names read `work-items/` and `memory/`. Those tools are ripgrep, and with it the search tools of Claude Code.

Show every file that needs the owner's answer in one numbered table, with one row per file and a one-line reason in each row, and ask once. Carry out each row as the owner answers it. When the owner answers "yes to all", carry out every row as shown.

## 4. The .agents/skills link

Codex reads project skills from `.agents/skills`, and Claude Code reads them from `.claude/skills`. The project keeps one copy of the skills, so that a fix reaches both Claude Code and Codex. For that reason `.agents/skills` is a link to `.claude/skills`. Codex follows linked folders. Make the link with these commands:

```text
mkdir -p .agents
ln -s ../.claude/skills .agents/skills
```

When `.agents/skills` is already a real folder, compare the two folders first:

```text
diff -r .agents/skills .claude/skills
```

- When the command prints no difference, or only lines that start with "Only in .claude/skills", every file in `.agents/skills` is also in `.claude/skills`, with the same content. Tell the owner, and after the owner's yes remove the folder and make the link.
- When the command prints anything else, stop and ask the owner. The folder may hold the owner's own Codex skills. After the owner's yes, move each of those skills into `.claude/skills/` first.

Git stores the link as a link. Never replace the link with copied folders to get past a problem. Tell the owner about the problem instead.

## 5. The pre-commit check

`.githooks/pre-commit` runs the command that checks the records, `.claude/hooks/validate-records.mjs`, before each commit. It stops a commit that breaks the form of a record or changes a filed source. A source is anything the project was given by someone else, kept unchanged in `sources/`.

Git runs `.githooks/pre-commit` only when `core.hooksPath` is `.githooks` in this copy of the repository. That setting is not in a file that Git tracks, so each clone and each computer needs this section once. Every worktree of one clone uses the same setting. A worktree is a separate folder with its own branch.

A new project, "update the toolkit", and a move-over all do this section.

1. Keep the file executable. Git stores the mode with the file:

   ```text
   chmod +x .githooks/pre-commit
   ```

   In an update or a move-over, run this command in your worktree, where the file is.
2. Look, in the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints. Both commands only read:

   ```text
   git config --get core.hooksPath
   ls "$(git rev-parse --git-path hooks)"
   ```

3. Use the first row that fits:

   | The commands show | Do |
   | --- | --- |
   | Git says this is not a Git repository | Skip this section, and tell the owner that the check will not run before commits. |
   | The first command prints `.githooks` | Do nothing. |
   | The first command prints another folder | Change nothing. Tell the owner what the text below the table says, and name that folder. |
   | The first command prints nothing, and the second lists any file whose name does not end in `.sample`, such as `pre-commit`, `commit-msg`, `pre-push`, or the hooks Git LFS installs | Change nothing, because with `core.hooksPath` set, Git stops running every hook in that folder. Tell the owner what the text below the table says, and name each of those files. |
   | The first command prints nothing, and the second lists only files whose names end in `.sample`, lists no file, or says the folder does not exist | Run `git config core.hooksPath .githooks`. |

   When a row says to change nothing, tell the owner three things:

   - the folder or the files that are already there;
   - that `validate-records.mjs` will not run before commits in this project;
   - that the owner can run it from the owner's own hooks with the one line below, in the `pre-commit` file of that folder, or in a new file named `pre-commit` when the folder has none.

   ```text
   "$(git rev-parse --show-toplevel)/.githooks/pre-commit" || exit 1
   ```

   Never add the line for the owner, and never change the owner's setting.

"Check the setup" changes nothing in this section. In "check the setup", the final checks report the setting, whether the file is executable, and what `validate-records.mjs` prints. `finishing.md`, "Final checks", lists those checks.

## 6. Check

Run these commands:

```text
rsync -rcni <copy>/ ./
ls -la .agents
git status --short
git config --get core.hooksPath
```

- The first command lists only files that the owner chose to keep as the owner's own.
- `.agents` shows `skills -> ../.claude/skills`, and `ls .agents/skills` shows the skills.
- `core.hooksPath` prints `.githooks`, or the owner was told why it does not.
- `git status` lists the new files and nothing under `work-items/` or `memory/`, because Git ignores both.

Keep the temporary folder until the end of the final checks. `finishing.md`, "Final checks", lists those checks and says when to remove the folder.

# Putting the toolkit's files into the project

Use this file to copy a folder of this skill into the project. Open it at Step 3 of [SKILL.md](../SKILL.md) for the full layout, `every-project/`, and at Step 5 for each `files-to-add/` folder of a choice.

The job is done when three things are true: the project has every file of the folder, except a file that the owner chose to keep as it was; no file that the project already had was replaced without the owner's answer; and `.agents/skills` is a link to `.claude/skills`.

`<source>` stands for the folder you copy, with the path of this skill's folder in front of it. Run every command from the project folder.

The commands below use `rsync`, `diff`, and `ln`, which macOS and Linux have. When a computer lacks one, such as Windows with Git Bash, which has no `rsync`, reach the same result another way. Each section says what its command must achieve.

## See what would change

Before copying into an existing project, check whether records at older paths would now appear as missing wiki files. Follow [Moving existing records into the local wiki](local-wiki-layout.md) to review the mapping before comparing or copying. Complete an approved move before copying templates into its destinations; when a move is pending or declined, follow that reference to adapt the setup copy to verified retained homes or defer affected operational files. Exclude pending destinations and deferred operational files or skill folders from copying, and retain current record routes. A setup check reports the proposed move without changing records.

This command writes nothing.

```text
rsync -rcni --exclude .DS_Store --exclude '*.log' <source>/ ./
```

- A line that starts with `>f+++++++` names a file that the project does not have yet.
- Any other line that starts with `>f` names a file that the project has, with different content.

## Copy the files the project does not have

```text
rsync -rlt --ignore-existing --exclude .DS_Store --exclude '*.log' <source>/ ./
```

This command writes only missing files and never replaces a file that the project has. In a new, empty folder it is the whole copy. It uses `-rlt` because `-a` would also give the project's files the permissions of this skill's folder.

## Files the project already has

For each file that differs, read the difference:

```text
diff -u <file> <source>/<file>
```

| File | What to do |
| --- | --- |
| `.gitignore`, `.ignore` | Add each line of the toolkit's file that the project's file lacks, at the end after one blank line. This change only adds lines, so no question is needed. |
| `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge the toolkit's entries into the project's file. [reference/skills-hooks-settings.md](skills-hooks-settings.md), "Merge rules", gives the rules for the merge. Ask the owner before you change any value that the project already has. |
| `CLAUDE.md` with more than the line `@AGENTS.md` | Keep the project's file. Ask the owner whether to add the line `@AGENTS.md` at its top, because while a `CLAUDE.md` exists, Claude Code reads `AGENTS.md` only through that line. |
| `AGENTS.md` (a project that had its own) | Keep the project's file. Show the owner what the toolkit's version adds. After the owner's yes, add the sections of the toolkit's version, and keep the owner's text. |
| Every other file, such as `README.md`, a rule, or a template | Say in one line what differs, and recommend one of three choices: keep the owner's file, take the toolkit's file, or merge the two. The owner's file stays until the owner chooses. |

The file `.ignore`, in the first row, makes the search tools that skip what `.gitignore` names read `work-items/` and `memory/`. Those tools are ripgrep and the search tools of Claude Code.

Show every file that needs the owner's answer in one numbered table, with one row per file, and ask once. Carry out each row as the owner answers it.

## The .agents/skills link

Codex reads a project's skills from `.agents/skills`, and Claude Code reads them from `.claude/skills`. The project keeps one copy of the skills, so `.agents/skills` is a link to `.claude/skills`. The full layout holds that link, and the copy command above brings it. When the project has no link after the copy, make it:

```text
mkdir -p .agents
ln -s ../.claude/skills .agents/skills
```

When `.agents/skills` is already a real folder, compare the two folders first:

```text
diff -r .agents/skills .claude/skills
```

- When the command prints no difference, or only lines that start with "Only in .claude/skills", every file in `.agents/skills` is also in `.claude/skills`. Tell the owner, and after the owner's yes remove the folder and make the link.
- When the command prints anything else, ask the owner. The folder may hold the owner's own Codex skills. After the owner's yes, move each of those skills into `.claude/skills/` first.

Git stores the link as a link. On Windows, Git makes it only when symbolic links are allowed (Developer Mode on, and the Git setting `core.symlinks` set to `true`). Otherwise the link arrives as a short text file that holds its target. Tell the owner, and after the owner's yes allow symbolic links and make the link again, for example with PowerShell's `New-Item -ItemType SymbolicLink -Path .agents\skills -Target ..\.claude\skills`. When the link cannot be made, tell the owner. Never put copied folders in its place.

## Checks after the copy

- `ls -la .agents` shows `skills -> ../.claude/skills`, and `ls .agents/skills` shows the skills.
- `git status --short` lists the new files. `git ls-files -- work-items/ memory/` prints nothing, confirming that Git tracks neither private folder. When the chosen local folder is present, also run `git check-ignore work-items/PROJECT-TASKS.md` or `git check-ignore memory/CURRENT_STATE.md`; each must print its path.

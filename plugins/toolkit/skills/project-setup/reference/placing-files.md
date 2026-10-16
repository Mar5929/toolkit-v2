# Putting the toolkit's files into the project

This file says how to copy a folder of this skill into the project: `every-project/`, the full layout, and each `files-to-add/` folder of a choice.

The job is done when three things are true: the project has every file of the folder, except a file that the owner chose to keep as it was; no file that the project already had was replaced without the owner's answer; and `.agents/skills` is a link to `.claude/skills`.

## Copy the files the project does not have

Compare the folder with the project first, so that you know which files are new and which the project already has with different content. Then copy every new file, hidden files included, and replace no file that the project has. In a new, empty folder this is the whole copy.

- Leave out `.DS_Store` and `*.log` files, which macOS and a local run leave in a folder.
- Keep the project's own file permissions. Do not give the project's files the permissions of this skill's folder.
- Use the tools the computer has, such as `rsync --ignore-existing` on macOS and Linux. Report a step that no available tool can do.

## Files the project already has

For each file that differs, read the difference, then do what the table says.

| File | What to do |
| --- | --- |
| `.gitignore`, `.ignore` | Add each line of the toolkit's file that the project's file lacks, at the end after one blank line. This change only adds lines, so no question is needed. |
| `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge the toolkit's entries into the project's file. [skills-hooks-settings.md](skills-hooks-settings.md), "Merge rules", gives the rules for the merge. Ask the owner before you change any value that the project already has. |
| `CLAUDE.md` with more than the line `@AGENTS.md` | Keep the project's file. Ask the owner whether to add the line `@AGENTS.md` at its top, because while a `CLAUDE.md` exists, Claude Code reads `AGENTS.md` only through that line. |
| `AGENTS.md` (a project that had its own) | Keep the project's file. Show the owner what the toolkit's version adds. After the owner's yes, add the sections of the toolkit's version, and keep the owner's text. |
| Every other file, such as `README.md`, a rule, or a template | Say what differs, and recommend one of three choices: keep the owner's file, take the toolkit's file, or merge the two. The owner's file stays until the owner chooses. |

The file `.ignore`, in the first row, makes the search tools that skip what `.gitignore` names read a folder that a local choice adds, such as `work-items/` or `memory/`; each local choice adds its own `!/<folder>/` line. Those tools are ripgrep and the search tools of Claude Code.

Show every file that needs the owner's answer in one numbered table, with one row per file, and ask once. Carry out each row as the owner answers it.

## The .agents/skills link

Codex reads a project's skills from `.agents/skills`, and Claude Code reads them from `.claude/skills`. The project keeps one copy of the skills, so `.agents/skills` is a symbolic link to `../.claude/skills`, with a target relative to the link so that it works on every computer. The full layout holds that link, so the copy usually brings it. When the project has no link after the copy, make it.

- When `.agents/skills` is already a real folder, compare it with `.claude/skills`. When every file in it is also in `.claude/skills`, tell the owner, and after the owner's yes remove the folder and make the link. Otherwise ask the owner, because the folder may hold the owner's own Codex skills. After the owner's yes, move each of those skills into `.claude/skills/` first.
- When the link cannot be made, tell the owner. Never put copied folders in its place.
- On Windows, a symbolic link needs Developer Mode on, and Git makes one only when the Git setting `core.symlinks` is `true`. Otherwise the link arrives as a short text file that holds its target. Tell the owner, and after the owner's yes allow symbolic links and make the link again from the project folder with `cmd /c mklink /D .agents\skills ..\.claude\skills`. In Git Bash, `ln -s` copies the folder instead of linking it unless `MSYS=winsymlinks:nativestrict` is set, so use the `mklink` command.

## What must be true after the copy

- `.agents/skills` is a link to `../.claude/skills`, and the skills are readable through it. Once the link is staged, Git stores it with the mode `120000`, which is how Git stores a link.
- Git lists the new files as untracked or changed.

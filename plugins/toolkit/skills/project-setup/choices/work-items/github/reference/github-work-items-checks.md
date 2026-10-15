# The checks for work items in GitHub Issues

This file holds the checks that show that work items in GitHub Issues are set up. Steps 9 and 12 of [github-work-items-setup.md](../github-work-items-setup.md) use it.

Run these checks after the steps in GitHub, which are steps 6 to 8 of the setup file, and after the steps in [updating-a-project-with-github-work-items.md](updating-a-project-with-github-work-items.md). `<repo>` is the name on the "GitHub repository" line of `PROJECT.md`.

- `gh auth status` shows the owner's account with the `repo` scope.
- `gh repo view <repo>` answers, and issues are on.
- Every label in the full list in [files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md](../files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md), "Labels the project needs", exists. To check, list the repository's labels with the command in that section, and compare name by name.
- `PROJECT.md` names the repository under "Toolkit settings".

# The checks for work items in GitHub Issues

This file holds the checks that show that work items in GitHub Issues are set up. Steps 9 and 12 of [github-work-items-setup.md](../github-work-items-setup.md) use it.

Run these checks after the steps in GitHub, which are steps 6 to 8 of the setup file, and after the steps in [updating-a-project-with-github-work-items.md](updating-a-project-with-github-work-items.md). `<repo>` is the name on the "GitHub repository" line of `PROJECT.md`.

- `gh auth status` shows the owner's account with the `repo` scope.
- `gh repo view <repo>` answers, and issues are on.
- Every one of the 30 labels in [files-to-add/.claude/skills/managing-work-items/references/work-tracker-labels.md](../files-to-add/.claude/skills/managing-work-items/references/work-tracker-labels.md), "The full list", exists. To check, list the repository's labels with the command in the same file, "Creating the labels", step 1, and compare name by name.
- `PROJECT.md` names the repository under "Toolkit settings".

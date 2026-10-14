# Bringing a project with GitHub Issues work items up to date

This file holds what "update the toolkit" does in GitHub for a project that keeps its work items in GitHub Issues. [reference/update.md](../../../../reference/update.md), "Apply the owner’s choices", sends you to the setup file, [github-work-items-setup.md](../github-work-items-setup.md), and its closing lines name this file.

Do these steps when the owner says "update the toolkit", after the newer skill files are copied in:

1. Run `gh auth status` and read `<repo>`. `<repo>` is the name on the "GitHub repository" line of `PROJECT.md`.
2. List the labels and compare them with [files-to-add/.claude/skills/managing-work-items/references/work-tracker-labels.md](../files-to-add/.claude/skills/managing-work-items/references/work-tracker-labels.md), "The full list". Ask the owner before you create the missing ones. Never change, rename, or delete an existing label.
3. List the open issues without the layout, with the command in [files-to-add/.claude/skills/managing-work-items/references/work-tracker-searching.md](../files-to-add/.claude/skills/managing-work-items/references/work-tracker-searching.md), "Issues without the layout". An issue made from an older template keeps its text. Add a missing section heading only after the owner's yes, and never rewrite the owner's text.

Then run the checks in [github-work-items-checks.md](github-work-items-checks.md).

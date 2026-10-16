# Bringing a project with GitHub Issues work items up to date

This file holds what "update the toolkit" does in GitHub for a project that keeps its work items in GitHub Issues.

Do these steps when the owner says "update the toolkit", after the newer skill files are copied in:

1. Run `gh auth status` and read `<repo>`. `<repo>` is the name on the "GitHub repository" line of `PROJECT.md`.
2. List the labels and compare them with [files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md](../files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md), "Labels the project needs". Ask the owner before you create the missing ones. Never change, rename, or delete an existing label.
3. List the open issues without the layout, as [files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md](../files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md), "Finding work", says, and handle each one as that section says. Never rewrite the owner's text.

Then run the checks in [github-work-items-checks.md](github-work-items-checks.md).

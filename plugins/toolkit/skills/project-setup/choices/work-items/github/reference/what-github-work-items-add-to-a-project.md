# What the GitHub Issues work items choice adds to a project

This file lists what setup adds to a project that keeps its work items in GitHub Issues: the files inside a skill, and the lines in `PROJECT.md`. Steps 4, 5, and 7 of [github-work-items-setup.md](../github-work-items-setup.md) use it.

## Everything the choice adds, by kind

| Kind | What it adds |
| --- | --- |
| Files inside a skill | Copy `choices/work-items/github/files-to-add/` into the project. It adds six files on how a work item is kept as an issue inside `managing-work-items`, which every project has. `references/work-tracker.md` is the one that the skill opens first. |
| Settings | Nothing. |
| `PROJECT.md`, "Toolkit settings" | Write `github` on the Tracker line. Add the line `- GitHub repository:` below the Memory line, with the repository's name, as the example below shows. |

Step 4 of the setup file copies the files of the first row. Step 5 writes the Tracker line. Step 7 adds the repository line, after step 6 has checked the repository.

What the choice makes outside the project folder is in [github-repository-for-work-items.md](github-repository-for-work-items.md).

## The lines in PROJECT.md

The repository name here is an example:

```markdown
- Tracker: `github`
- GitHub repository: `example-owner/money-log`
```

Nothing else is recorded. The labels are the same in every project.

## Root guide summary

At setup completion, contribute this sentence to the root `AGENTS.md` summary. [Work tracking and memory summary](../../../../reference/project-store-summary.md) gives placement and verification.

```markdown
Work items are tracked in [GitHub Issues](<verified tracking repository issues URL>) with `managing-work-items`.
```

# Work items in GitHub Issues

Follow these steps when the owner chooses to keep work items in GitHub Issues. The job is done when every check in [reference/github-work-items-checks.md](reference/github-work-items-checks.md) passes.

## Steps

Do steps 1 to 5 right after the answer, before the next interview question. Do steps 6 to 9 when the sign-in is done and the owner has named the repository. Do steps 10 to 13 when setup finishes.

1. **Tell the owner how the toolkit sets up work items in GitHub Issues by default, and ask whether that is what the owner wants.** [reference/github-work-items-default.md](reference/github-work-items-default.md) holds the default.
2. **Check the sign-in of `gh`, the GitHub command-line tool.** Ask the owner for the sign-in as soon as the owner picks GitHub Issues, so that the owner can run `gh auth login` while the interview goes on. Never ask the owner for a token. [reference/github-sign-in.md](reference/github-sign-in.md) gives the check and what to ask the owner for.
3. **Ask the owner which repository holds the work items.** Recommend the project's own repository, which the project's verified remote shows. Use only the name the owner confirms.
4. **Copy the choice's files into the project.** [reference/what-github-work-items-add-to-a-project.md](reference/what-github-work-items-add-to-a-project.md) lists them.
5. **Write `github` on the Tracker line of `PROJECT.md`.** [reference/what-github-work-items-add-to-a-project.md](reference/what-github-work-items-add-to-a-project.md) gives the line.
6. **Check the repository, and create one only after the owner's yes.** [reference/github-repository-for-work-items.md](reference/github-repository-for-work-items.md) gives the yes that everything made in GitHub needs, the command for the check, and what to ask the owner when the repository does not exist or has issues turned off.
7. **Record the repository in `PROJECT.md`.** [reference/what-github-work-items-add-to-a-project.md](reference/what-github-work-items-add-to-a-project.md) gives the line and the place where it goes.
8. **Create the labels that the repository does not have yet, after the owner's yes.** [files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md](files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md), "Labels the project needs", gives the full list, the commands, and when to ask the owner.
9. **Run this choice's checks.** [reference/github-work-items-checks.md](reference/github-work-items-checks.md) gives them.
10. **After the owner's yes, write the project's phases from question 11 as milestones of the repository.** Tell the owner which milestones will be made, because the yes for the labels and the repository does not cover them. [files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md](files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md), "Project phases (milestones)", says how.
11. **Run this choice's checks again.**
12. **Tell the owner the step that only the owner does.** The owner runs `gh auth login` in a terminal, when `gh auth status` shows no sign-in.
13. **After the setup commit, ask the push question** that [reference/finishing.md](../../../reference/finishing.md), "After the commit", gives.

When a `gh` call fails, open [files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md](files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh.md), "When a call fails". For "update the toolkit", follow [reference/updating-a-project-with-github-work-items.md](reference/updating-a-project-with-github-work-items.md).

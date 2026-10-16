# Work items in local files

Follow these steps when the owner chooses to keep work items in local files. The job is done when `work-items/` and `PROJECT-ROADMAP.md` are in the project, `PROJECT.md` records the choice and the ID prefix, and the roadmap holds the project's phases.

## Steps

Do steps 1 to 4 right after the answer, before the next interview question. Do steps 5 to 7 when setup finishes. This choice needs no sign-in and makes nothing outside the project folder.

1. **Tell the owner how the toolkit sets up work items in local files by default, and ask whether that is what the owner wants.** [reference/local-work-items-default.md](reference/local-work-items-default.md) holds the default.
2. **Ask the owner about the ID prefix.** Say that IDs look like `WI-001`, and ask whether to keep the prefix `WI`.
3. **Copy the choice's files into the project, and copy the two work item templates into `work-items/work-item-template/`.** [reference/what-local-work-items-add-to-a-project.md](reference/what-local-work-items-add-to-a-project.md) lists them.
4. **Write the choice's lines in `PROJECT.md`, `AGENTS.md`, `.gitignore`, and `.ignore`.** [reference/what-local-work-items-add-to-a-project.md](reference/what-local-work-items-add-to-a-project.md) gives each line and the place where it goes.
5. **Write the project's outcome and the roadmap in `PROJECT-ROADMAP.md`.** Write the owner's sentence from question 2 under "Project outcome", and write the project's phases from question 11 as the file's fill-in guide says.
6. **Check that Git ignores the work items.** `git ls-files -- work-items/` prints nothing, `git check-ignore work-items/PROJECT-TASKS.md` prints the path, and `.ignore` holds `!/work-items/`.
7. **Include `PROJECT-ROADMAP.md` in the search for prompts that are left.**

When a step does not work as expected, open [reference/local-work-items-known-problems.md](reference/local-work-items-known-problems.md).

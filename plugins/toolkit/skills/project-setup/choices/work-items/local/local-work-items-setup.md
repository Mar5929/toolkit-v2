# Work items in local files

Follow these steps when the owner answers "local files" to question 5 of the guide, [SKILL.md](../../../SKILL.md). The job is done when `work-items/` and `PROJECT-ROADMAP.md` are in the project, `PROJECT.md` records the choice and the ID prefix, and the roadmap holds the project's phases.

## Steps

Do steps 1 to 4 right after the answer, before the next question of the guide. Do steps 5 to 7 when setup finishes, in Step 6 of the guide. This choice needs no sign-in and makes nothing outside the project folder.

1. **Tell the owner how the toolkit sets up work items in local files by default, and ask whether that is what the owner wants.** [reference/local-work-items-default.md](reference/local-work-items-default.md) holds the default. [SKILL.md](../../../SKILL.md), "Each choice has questions of its own", gives what to explain and what to ask after a no.
2. **Ask the owner about the ID prefix.** Say that IDs look like `WI-001`, and ask whether to keep the prefix `WI`.
3. **Copy the choice's files into the project.** The folder `choices/work-items/local/files-to-add/` holds them at the paths a project has them. [reference/what-local-work-items-add-to-a-project.md](reference/what-local-work-items-add-to-a-project.md) lists them, and [reference/placing-files.md](../../../reference/placing-files.md) gives the copy command and what to do with a file that the project already has.
4. **Write the choice's lines in `PROJECT.md`, `AGENTS.md`, `.gitignore`, and `.ignore`.** [reference/what-local-work-items-add-to-a-project.md](reference/what-local-work-items-add-to-a-project.md) gives each line and the place where it goes.
5. **Write the project's outcome and the roadmap in `PROJECT-ROADMAP.md`.** Write the owner's sentence from question 2 under "Project outcome", and write the project's phases from question 11 as the file's fill-in guide says. [reference/finishing.md](../../../reference/finishing.md), "Fill the prompts" and "The roadmap", give the rules for both.
6. **Check that Git does not track the work items.** `git ls-files -- work-items/` prints nothing, and `git check-ignore work-items/PROJECT-TASKS.md` prints the path. [reference/finishing.md](../../../reference/finishing.md), "Final checks", says how to run a check and what to do when one fails.
7. **Search `PROJECT-ROADMAP.md` for the prompts that are left.** It is one of the files to search for the report. [reference/finishing.md](../../../reference/finishing.md), "The report", gives the search command.

When a step does not work as expected, open [reference/local-work-items-known-problems.md](reference/local-work-items-known-problems.md).

"Check the setup", "update the toolkit", and a change of where work items are kept use the same steps: steps 3 and 4 give the folder and the lines that this choice adds, and step 6 gives its check. [reference/update.md](../../../reference/update.md) says how each of those jobs works.

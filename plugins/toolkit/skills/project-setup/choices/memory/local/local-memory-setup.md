# Memory in local files

Follow these steps when the owner answers "local files" to question 6 of the guide, [SKILL.md](../../../SKILL.md). The job is done when `memory/` and the skill `managing-project-memory` are in the project, `PROJECT.md` records the choice, and the session-start command prints the project's Current State, which is the project's one short page of what is true now.

## Steps

Do steps 1 to 4 right after the answer, before the next question of the guide. Do steps 5 and 6 when setup finishes, in Step 6 of the guide. This choice has no question beyond the one about the default, needs no sign-in, and makes nothing outside the project folder.

1. **Tell the owner how the toolkit sets up memory in local files by default, and ask whether that is what the owner wants.** [reference/local-memory-default.md](reference/local-memory-default.md) holds the default. [SKILL.md](../../../SKILL.md), "Each choice has questions of its own", gives the words of the question and what to ask after a no.
2. **Copy the skill `managing-project-memory` into the project.** The folder `choices/memory/shared-by-local-and-notion/files-to-add/` holds the skill at the path a project has it. Copy this folder first. [reference/placing-files.md](../../../reference/placing-files.md) gives the copy command and what to do with a file that the project already has.
3. **After the skill is copied, copy this choice's own files into the project.** The folder `choices/memory/local/files-to-add/` holds them at the paths a project has them: four files inside that skill, and the folder `memory/`. Copy this folder the same way. [reference/what-local-memory-adds-to-a-project.md](reference/what-local-memory-adds-to-a-project.md) lists what the two folders add.
4. **Write the choice's lines in `PROJECT.md` and `AGENTS.md`.** [reference/what-local-memory-adds-to-a-project.md](reference/what-local-memory-adds-to-a-project.md) gives each line and the place where it goes.
5. **Write the first lines of the project's Current State in `memory/CURRENT_STATE.md`.** [reference/finishing.md](../../../reference/finishing.md), "The project's Current State", says what to write under each heading.
6. **Check that the session-start command prints the project's Current State, and that Git does not track memory.** `node .claude/hooks/session-start.mjs --memory local </dev/null` prints the Current State, and `git ls-files -- memory/` prints nothing. `git check-ignore memory/CURRENT_STATE.md` must print the path. [reference/finishing.md](../../../reference/finishing.md), "Final checks", says how to run a check and what to do when one fails.

When a step does not work as expected, open [reference/local-memory-known-problems.md](reference/local-memory-known-problems.md).

"Check the setup", "update the toolkit", and a change of where memory is kept use the same steps: steps 2 to 4 give the folders and the lines that this choice adds, and step 6 gives its checks. [reference/update.md](../../../reference/update.md) says how each of those jobs works.

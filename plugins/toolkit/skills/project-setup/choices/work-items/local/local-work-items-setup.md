# Work items in local files

Open this file when the owner answers "local files" to question 5 of `SKILL.md`. It gives the default to tell the owner, the one question to ask, what the choice adds to the project, and what it needs at the finish.

The job is done when `work-items/` and `PROJECT-ROADMAP.md` are in the project, `PROJECT.md` records the choice and the ID prefix, and the roadmap holds the project's phases.

## What the toolkit sets up by default

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- Each work item is a folder in `work-items/`, at the root of the project. The folder's name is the work item's ID and a short form of its title. Its main file holds the requirements, the tasks, and where the work item stands.
- The project's phases are in one file at the root, `PROJECT-ROADMAP.md`.
- The tasks that belong to no work item are in `work-items/PROJECT-TASKS.md`.
- Git ignores `work-items/`, so the work items exist only on this computer. They need no sign-in and work offline.
- The whole project folder opens as an Obsidian vault, where the owner can read the work items with their links.

## Questions for the owner

- **The ID prefix.** Say that IDs look like `WI-001`, and ask whether to keep the prefix `WI`.

## What this choice adds to the project

| Kind | What it adds |
| --- | --- |
| Files and folders | Copy `choices/work-items/local/files-to-add/` into the project. It holds `PROJECT-ROADMAP.md`, and `work-items/` with its guide, `PROJECT-TASKS.md`, and the templates for a work item and its design. |
| Files inside a skill | The same folder adds five files inside `managing-work-items`, which every project has. `references/work-tracker.md` is the one that the skill opens first. |
| Settings | Nothing. |
| `PROJECT.md`, "Toolkit settings" | Tracker: `local`. Work item ID prefix: the prefix that the owner confirmed. |
| Outside the project folder | Nothing. |

## At the finish

- **The project's outcome.** Also write the owner's sentence from question 2 under "Project outcome" in `PROJECT-ROADMAP.md`.
- **The roadmap.** Write the project's phases from question 12 in `PROJECT-ROADMAP.md`, as its fill-in guide says.
- **The prompts that are left.** `PROJECT-ROADMAP.md` is one of the files to search for prompts for the report.
- **Check.** `git status --short` lists nothing under `work-items/`.

## Known problems

- **The project already has a folder named `work-items/` with files of its own.** Ask the owner before you add a file there. `reference/existing-project.md` says what to offer.

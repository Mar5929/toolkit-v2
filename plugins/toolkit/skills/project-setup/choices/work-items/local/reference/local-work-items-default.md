# How the toolkit sets up local work items by default

This file holds how the toolkit sets up work items in local files when the owner changes nothing.

- Each work item is a folder in `work-items/`, at the root of the project. The folder's name is the work item's short name: a few lowercase words that say its subject, such as `csv-export`. Its main file holds the requirements, the tasks, and where the work item stands.
- The project's phases are in one file at the root, `PROJECT-ROADMAP.md`.
- The tasks that belong to no work item are in `work-items/PROJECT-TASKS.md`.
- Git ignores `work-items/`, so the work items exist only on this computer. They need no sign-in and work offline.
- The whole project folder opens as an Obsidian vault, where the owner can read the work items with their links.

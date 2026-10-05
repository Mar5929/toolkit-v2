# The project's roadmap and project tasks (local files)

Where the project's own phases and its project tasks are saved, and how to read and change them. `running-work-item-lifecycle`, "Levels", says what they are.

## The project's roadmap: PROJECT-ROADMAP.md

- The project's phases are in `PROJECT-ROADMAP.md` in the project folder. Git keeps it, so read the default branch's copy. With a remote: run `git -C "$MAIN" fetch origin`, then read `git -C "$MAIN" show origin/<default>:PROJECT-ROADMAP.md` (`<default>` as `publish-docs` finds it). With no remote: read `"$MAIN/PROJECT-ROADMAP.md"`.
- Change it only with `publish-docs`, which saves it to the default branch from its own save workspace. Make the edits below there. After the save, read it back the same way.
- A project phase is one row of the "Phases" table and one `## P01 — <name>` heading below it, with the same ID and name, in plan order. Its ID is `P` and two digits, the next unused number. Its Status is Not Started, In Progress, Done, or Cancelled.
- Under its heading, the phase's `**Work items:**` list names each of its top-level items on its own line: `- [[WI-031]] <title>`. The item's own Related items line names that phase: "Project phase P01."
- **Add a phase:** add its row and its heading at their place in the order. The first real phase replaces the template's example row and heading.
- **Put an item in a phase, or move it:** add its line to the phase's Work items list, or move the line to the other phase. Change the item's Related items line, and add a Recent History row on the item.
- **Merge or drop a phase:** move its items first. Then set its Status to Cancelled and add one line under its heading: "Merged into P01." or "Dropped: <reason>." Never delete a real phase.
- Record each change the owner approved under "Planning changes": the date, his words, and what changed.
- Read every phase and its items (with a remote, pipe the `git show` output into the same `grep`, without the file name):

  ```bash
  grep -nE '^\| *`?P[0-9]{2} —|^## P[0-9]{2} —|^- \[\[' "$MAIN/PROJECT-ROADMAP.md"
  ```

## Project tasks: PROJECT-TASKS.md

- The project's tasks are in `work-items/PROJECT-TASKS.md` in the main checkout. Missing: stop and tell the owner the setup is incomplete (the project-setup skill restores it).
- Each task is a checkbox block in the same form as an item's task (`field-mapping.md`, "Roadmap and Tasks"), in one plain list with no phase headings. Its ID is `PT-` and two digits: `PT-01`, then the next unused number. A new task goes at the end of the list. The first real task replaces the template's example task.
- Starting, ticking, and cancelling are the same writes as for an item's task (`field-mapping.md`, "A task's writes").
- Open project tasks:

  ```bash
  grep -nE '^- \[ \] \*\*PT-[0-9]+' "$MAIN/work-items/PROJECT-TASKS.md"
  ```

# The project's roadmap and project tasks (local files)

This file says where the project's own phases and its project tasks are saved, and how to read and change them. `references/work-levels.md`, says what a project phase and a project task are.

## The project's roadmap: PROJECT-ROADMAP.md

The project's phases are in `PROJECT-ROADMAP.md`, in the project folder. A top-level work item belongs to a project phase whether or not it uses work-item phases of its own. Work-item phases do not change project roadmap approval or placement.

### Reading and saving the file

Git tracks `PROJECT-ROADMAP.md`, so read the copy on the default branch.

- When the project has a remote, run `git -C "$MAIN" fetch origin`, and then read `git -C "$MAIN" show origin/<default>:PROJECT-ROADMAP.md`. Find `<default>` the way `publish-docs` finds it.
- When the project has no remote, read `"$MAIN/PROJECT-ROADMAP.md"`.
- Change the file only with `publish-docs`. That skill saves the file to the default branch from the save worktree, which is the folder that `publish-docs` makes from the default branch. Make the edits below in the save worktree.

### What a project phase looks like

- A project phase is one row of the "Phases" table and one `## P01 — <name>` heading below the table. The row and the heading have the same ID and name, and both are in plan order.
- The ID of a project phase is `P` and two digits, with the next unused number.
- The Status of a project phase is Not Started, In Progress, Done, or Cancelled.
- Under its heading, the project phase's `**Work items:**` list names each of its top-level items on a line of its own: `- [[WI-031]] <title>`.
- The work item's own Related items line names that project phase: "Project phase P01."

### Changing the roadmap

- **Add a project phase.** Add its row and its heading at their place in the order. The first real project phase replaces the template's example row and example heading.
- **Put a work item in a project phase, or move it.** Add the work item's line to the project phase's Work items list, or move the line to the other project phase. Change the work item's Related items line, and add a Recent History row on the work item.
- **Merge or drop a project phase.** First move its work items. Then set its Status to Cancelled, and add one line under its heading: "Merged into P01." or "Dropped: <reason>." Never delete a real project phase.
- Record each change that the owner approved under "Planning changes": the date, the owner's words, and what changed.

### Reading every project phase and its work items

This command prints every project phase and its work items:

```bash
grep -nE '^\| *`?P[0-9]{2} —|^## P[0-9]{2} —|^- \[\[' "$MAIN/PROJECT-ROADMAP.md"
```

When the project has a remote, pipe the output of the `git show` command into the same `grep`, without the file name.

## Project tasks: PROJECT-TASKS.md

The project's tasks are in `work-items/PROJECT-TASKS.md`, in the main checkout. When the file is missing, stop and tell the owner that the setup is incomplete. `project-setup` restores the file.

- Each project task is a checkbox block in the same form as a work item's task. `work-tracker-field-mapping.md`, section "Roadmap and Tasks", shows that form. The project tasks are one plain list with no phase headings.
- Its Who does it line may also hold the name of another person who owes the task, with the party: `Sarah Chen (client)`.
- The ID of a project task is `PT-` and two digits: `PT-01`, then the next unused number.
- A new project task goes at the end of the list. The first real project task replaces the template's example task.
- Starting, ticking, and cancelling a project task are the same writes as for a work item's task. `work-tracker-field-mapping.md`, section "A task's writes", gives them.

This command prints the open project tasks, each with who does it:

```bash
grep -nE -A4 '^- \[ \] \*\*PT-[0-9]+' "$MAIN/work-items/PROJECT-TASKS.md" | grep -E 'PT-[0-9]+|Who does it'
```

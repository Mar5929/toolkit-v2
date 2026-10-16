# What the local work items choice adds to a project

This file lists what setup adds to a project that keeps its work items in local files: the files, the lines in `PROJECT.md`, and the rows in `AGENTS.md`.

## Everything the choice adds, by kind

| Kind | What it adds |
| --- | --- |
| Files and folders | Copy `choices/work-items/local/files-to-add/` into the project. It holds `PROJECT-ROADMAP.md`, and `work-items/` with its guide and `PROJECT-TASKS.md`. |
| Work item templates | Copy `.claude/skills/managing-work-items/assets/work-item-template.md` and `design-template.md` into `work-items/work-item-template/`, with the same names. The skill keeps the toolkit's copy; the owner can edit the project's copy. |
| Files inside a skill | The same folder adds `references/work-tracker.md` inside `managing-work-items`, which every project has. It says where local work items live and how to read and write them. |
| Lines in `.gitignore` and `.ignore` | Add `/work-items/` to `.gitignore`, so Git does not track the folder, and `!/work-items/` to `.ignore`, so the search tools still read it. Add each line only when the file lacks it. |
| Settings | Nothing. |
| `PROJECT.md`, "Toolkit settings" | Write `local` on the Tracker line. Add this line below the Memory line: ``- Work item ID prefix: `WI` ``. |
| Text in `AGENTS.md` | Six rows in the "Project map" table. "The text in AGENTS.md" below gives them. |
| Outside the project folder | Nothing. |

## The text in AGENTS.md

In the project's root `AGENTS.md`, in the "Project map" table, add the first row after the row for `PROJECT.md`, and the other five after the row for `.gitignore`, `.ignore`:

```markdown
| `PROJECT-ROADMAP.md` | The plan at project level: the project's phases in order, and the top-level work items (with no parent) that belong to each phase. | `managing-work-items` decides the change. |
| `work-items/` | The work items: one folder per work item. A work item is one piece of work, such as a feature, a fix, or a change, from idea to Done. Git does not track this folder. | `managing-work-items` for every read and save. |
| `work-items/<short name>/<ID>.md` | One work item: its goal, requirements, questions and answers, tasks, Current state, and history. | `managing-work-items`. |
| `work-items/<short name>/DESIGN.md` | The solution design for that one work item: the options considered and the approach the owner approved. | `managing-work-items`. |
| `work-items/PROJECT-TASKS.md` | The project tasks: administrative tasks that belong to no work item, such as giving a person access. | `managing-work-items`. |
| `work-items/work-item-template/` | `work-item-template.md` and `design-template.md`: the templates that are copied to start a new work item and its design. | The owner may edit them; `managing-work-items` copies from them. |
```

## Root guide summary

At setup completion, contribute this sentence to the root `AGENTS.md` summary. [Work tracking and memory summary](../../../../reference/project-store-summary.md) gives placement and verification.

```markdown
Work items are tracked in `work-items/` with `managing-work-items`.
```

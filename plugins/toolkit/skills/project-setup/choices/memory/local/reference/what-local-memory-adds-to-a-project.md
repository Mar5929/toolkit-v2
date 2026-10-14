# What the local memory choice adds to a project

This file lists what setup adds to a project that keeps its memory in local files: the skill, the files, the line in `PROJECT.md`, and the rows in `AGENTS.md`. Steps 2, 3, and 4 of [local-memory-setup.md](../local-memory-setup.md) use it.

## Everything the choice adds, by kind

| Kind | What it adds |
| --- | --- |
| Skill | Copy `choices/memory/local/files-to-add/` into the project. It holds the skill `managing-project-memory`: what counts as memory, and how to save, find, and tidy it. |
| Files inside that skill | Four of the skill's reference files say how memory is kept as local files. `references/memory-store.md` is the one that the skill opens first. |
| Steps inside other skills | The same folder adds `references/project-memory-steps.md` inside `managing-work-items` and inside `handoff`: the steps of those skills that depend on local memory. |
| Files and folders | The same folder adds `memory/` with its guide, `CURRENT_STATE.md`, the index `MEMORY.md`, and the template for a memory file. |
| Decision and system records | Copy `choices/memory/repository-records/files-to-add/` and write its rows in the root `AGENTS.md`, as [what-repository-records-add-to-a-project.md](../../repository-records/reference/what-repository-records-add-to-a-project.md) says. |
| Lines in `.gitignore` and `.ignore` | Add `/memory/` to `.gitignore`, so Git does not track the folder, and `!/memory/` to `.ignore`, so the search tools still read it. Add each line only when the file lacks it. |
| Settings | Nothing. The settings in the full layout already name `local`. |
| `PROJECT.md`, "Toolkit settings" | Write `local` on the Memory line. |
| Text in `AGENTS.md` | One row in the "Project map" table, and the "Project memory" section. "The text in AGENTS.md" below gives them. |
| Outside the project folder | Nothing. |

Step 2 of the setup file copies the folder of the first four rows. Step 3 copies the folder of the fifth row. Step 4 writes the line in `PROJECT.md`, and the rows and the section in `AGENTS.md`.

## The text in AGENTS.md

In the project's root `AGENTS.md`, in the "Project map" table, add this row after the row for `.gitignore`, `.ignore`, and after the rows for `work-items/` when the project has them:

```markdown
| `memory/` | The project's Current State in `CURRENT_STATE.md`, one file per subject, and the generated `MEMORY.md` index. Git does not track this folder. | `managing-project-memory`; the session-start hook maintains the index. |
```

Replace the prompt under the heading "Project memory" with this section's text, below the heading:

```markdown
This project keeps its memory in local files in `memory/`, with the skill `managing-project-memory`.

- The project's current state, a short page of what is true now, is `memory/CURRENT_STATE.md`. The session-start command prints it. When it is not in the session's context, read it with `managing-project-memory`.
- Use `managing-project-memory` to find, save, correct, and tidy memory. Save each new fact and correct each record it affects in the same turn.
```

## Root guide summary

At setup completion, contribute this sentence to the root `AGENTS.md` summary. [Work tracking and memory summary](../../../../reference/project-store-summary.md) gives placement and verification.

```markdown
Project memory is stored in `memory/` with `managing-project-memory`.
```

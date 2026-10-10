# What the local memory choice adds to a project

This file lists what setup adds to a project that keeps its memory in local files: the skill, the files, the line in `PROJECT.md`, and the rows in `AGENTS.md`. Steps 2, 3, and 4 of [local-memory-setup.md](../local-memory-setup.md) use it.

## Everything the choice adds, by kind

| Kind | What it adds |
| --- | --- |
| Skill | Copy `choices/memory/shared-by-local-and-notion/files-to-add/` into the project. It holds the skill `managing-project-memory`: what counts as memory, and how to save, find, and tidy it. |
| Files inside that skill | Copy `choices/memory/local/files-to-add/` into the project after it. It adds four files on how memory is kept as local files. `references/memory-store.md` is the one that the skill opens first. |
| Files and folders | The same folder adds `memory/` with its guide, `CURRENT_STATE.md`, the index `MEMORY.md`, and the template for a memory file. |
| Settings | Nothing. The settings in the full layout already name `local`. |
| `PROJECT.md`, "Toolkit settings" | Write `local` on the Memory line. |
| Text in `AGENTS.md` | Three rows in the "Project map" table. "The text in AGENTS.md" below gives them. |
| Outside the project folder | Nothing. |

Step 2 of the setup file copies the folder of the first row. Step 3 copies the folder of the second and third rows. Step 4 writes the line in `PROJECT.md` and the rows in `AGENTS.md`.

## The text in AGENTS.md

In the project's root `AGENTS.md`, in the "Project map" table, add these rows after the row for `.gitignore`, `.ignore`, and after the rows for `work-items/` when the project has them:

```markdown
| `memory/` | What a later session needs and no other file holds: the project's Current State, and one file per subject. | `managing-project-memory`. |
| `memory/CURRENT_STATE.md` | The project's Current State, in five parts. | `managing-project-memory` writes it. |
| `memory/MEMORY.md` | The index of the memory files. The session-start hook rebuilds and prints it. | Never edit it. |
```

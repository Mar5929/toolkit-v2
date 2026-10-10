# Memory in local files

Open this file when the owner answers "local files" to question 6 of `SKILL.md`. It gives the default to tell the owner, what the choice adds to the project, and what it needs at the finish. This choice has no question beyond the one about the default.

The job is done when `memory/` and the skill `managing-project-memory` are in the project, `PROJECT.md` records the choice, and the session-start command prints the project's Current State. The project's Current State is the project's one short page of what is true now.

## What the toolkit sets up by default

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- Memory is Markdown files in `memory/`, at the root of the project: the project's Current State, and one file for each subject that no other project file holds.
- At the start of each session, the agent is shown the Current State and one line for each memory file.
- Git ignores `memory/`, so memory exists only on this computer. It is private and needs no server and no sign-in.
- The whole project folder opens as an Obsidian vault, where the owner can read the memory files.

## What this choice adds to the project

| Kind | What it adds |
| --- | --- |
| Skill | Copy `choices/memory/shared-by-local-and-notion/files-to-add/` into the project. It holds the skill `managing-project-memory`: what counts as memory, and how to save, find, and tidy it. |
| Files inside that skill | Copy `choices/memory/local/files-to-add/` into the project after it. It adds four files on how memory is kept as local files. `references/memory-store.md` is the one that the skill opens first. |
| Files and folders | The same folder adds `memory/` with its guide, `CURRENT_STATE.md`, the index `MEMORY.md`, and the template for a memory file. |
| Settings | Nothing. The settings in the full layout already name `local`. |
| `PROJECT.md`, "Toolkit settings" | Memory: `local`. |
| Outside the project folder | Nothing. |

## At the finish

- **The project's Current State.** Write its first lines in `memory/CURRENT_STATE.md`.
- **Check.** `node .claude/hooks/session-start.mjs --memory local </dev/null` prints the Current State, and `git status --short` lists nothing under `memory/`.

## Known problems

- **`memory/MEMORY.md` changes by itself.** It is an index that the session-start command rebuilds. Never edit it by hand.
- **The project already has a folder named `memory/` with files of its own.** Ask the owner before you add a file there. `reference/existing-project.md` says what to offer.

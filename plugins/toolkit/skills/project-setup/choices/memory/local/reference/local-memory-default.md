# How the toolkit sets up local memory by default

This file holds how the toolkit sets up memory in local files when the owner changes nothing. Step 1 of [local-memory-setup.md](../local-memory-setup.md) uses it.

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- Memory is Markdown files in `memory/`, at the root of the project: the project's Current State, and one file for each subject that no other project file holds.
- At the start of each session, the agent is shown the Current State and one line for each memory file.
- Git ignores `memory/`, so memory exists only on this computer. It is private and needs no server and no sign-in.
- The whole project folder opens as an Obsidian vault, where the owner can read the memory files.

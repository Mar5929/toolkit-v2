# Project memory steps for handoff: local memory

This file holds the step of `handoff` that depends on where this project keeps its memory. This project keeps memory in local files in `memory/`, with `managing-project-memory`.

## Saving the context for the next session

Update the project's Current State. The project's Current State is the project's one short page of what is true now. Read and write it with `managing-project-memory`.

- Write "Next session starts with" as `managing-project-memory/references/current-state.md` describes.
- Check the line under "Now" for each of this session's work items. When that line is missing or no longer true, add or correct it as `managing-work-items` says.
- Check every other line, and remove each line that is no longer true, for example a piece of work that ended, an event that ended, a resolved or cancelled deadline, or a thing owed that was delivered. `managing-project-memory/references/current-state.md`, "Removing what is no longer true", says how.
- Set the "Last updated" line to the date, `handoff`, and `agent`.
- When the project's Current State is missing, do not create it. Tell the owner that it is missing, and suggest the setup check (`project-setup`, "check the setup"). Put in the prompt the entry that this step would have written.

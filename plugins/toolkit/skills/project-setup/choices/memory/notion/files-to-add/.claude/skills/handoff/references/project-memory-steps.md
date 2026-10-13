# Project memory steps for handoff: Notion memory

This file holds the step of `handoff` that depends on where this project keeps its memory. This project keeps memory, shared decisions, system documentation, and project terms in its Notion Project Wiki. Coding agents capture changes in Wiki Inbox with `managing-project-memory`, and the librarian (`maintaining-notion-wiki`) files them.

## Saving the context for the next session

- Capture this session's focus and resumption checkpoint through `managing-project-memory`. Keep next actions in the tracker.
- Include pending capture links in the prompt, and say that they are not filed yet.
- Request an on-demand librarian pass when the next task needs reconciled documentation. Do not wait for it before you draft the prompt.

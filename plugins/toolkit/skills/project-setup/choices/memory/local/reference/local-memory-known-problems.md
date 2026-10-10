# Known problems with local memory

This file holds what is known to go wrong when memory in local files is set up. Open it when a step of [local-memory-setup.md](../local-memory-setup.md) does not work as expected. Each line names a problem, and what to do.

- **`memory/MEMORY.md` changes by itself.** It is an index that the session-start command rebuilds. Never edit it by hand.
- **The project already has a folder named `memory/` with files of its own.** Ask the owner before you add a file there. [reference/existing-project.md](../../../../reference/existing-project.md), "Known problems", says what to offer.

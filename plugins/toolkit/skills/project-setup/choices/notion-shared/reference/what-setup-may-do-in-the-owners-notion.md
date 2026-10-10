# What setup may do in the owner's Notion

This file holds the limits on what setup does in the owner's Notion workspace: the owner's yes before anything is made, and the only Notion calls that setup makes itself. Step 2 of [notion-setup.md](../notion-setup.md) uses the first section, and the second section holds for every step.

## The owner's yes before anything is made

- Make nothing in the owner's real Notion workspace without the owner's yes. Before you make anything, tell the owner what will be made: this project's pages in the owner's Notion, from the "Project" template in the owner's Projects database. The owner's yes covers only what you named.
- Every Notion project is a copy of the "Project" template in the owner's Projects database. The template is the owner's. When it does not exist, stop and tell the owner: the owner makes it in the Notion app, and the toolkit does not build it.
- When the owner says this project is a test, make its Notion pages only under the test page the owner names. Never make them under the owner's real pages unless the owner says so.

## The Notion calls that setup makes itself

The Notion steps themselves are in two files. [notion-project-pages.md](notion-project-pages.md) makes the project's page and its work items part, and [notion-memory-pages.md](notion-memory-pages.md) holds the steps for memory.

Apart from the steps in those two files, setup makes only these Notion calls itself:

- `ntn whoami`;
- the `ntn api v1/search` call in [where-the-notion-project-page-goes.md](where-the-notion-project-page-goes.md);
- the one write of the project's outcome into the project's row, which the step for the project's outcome gives in [choices/work-items/notion/notion-work-items-setup.md](../../work-items/notion/notion-work-items-setup.md) and in [choices/memory/notion/notion-memory-setup.md](../../memory/notion/notion-memory-setup.md);
- the one read of the "Current state" page in the check that [choices/memory/notion/notion-memory-setup.md](../../memory/notion/notion-memory-setup.md) gives for the finish of setup.

The two Notion setup files also have a step that writes the roadmap and a step that brings the "Current state" page up to date. Those steps use the project's own skills, as the steps say.

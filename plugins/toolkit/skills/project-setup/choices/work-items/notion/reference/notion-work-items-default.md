# How the toolkit sets up Notion work items by default

This file holds how the toolkit sets up work items in Notion when the owner changes nothing. Step 1 of [notion-work-items-setup.md](../notion-work-items-setup.md) uses it.

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- The project gets one page in the owner's Notion. The page is a row of the owner's Projects database, made as a copy of the owner's "Project" template.
- That page holds three databases: Work Items, Phases, and Tasks. Each work item is a page in the Work Items database, and the project's phases are rows of the Phases database.
- The owner can read and change the board in the Notion app, on a phone or on the web.
- The agent reaches Notion with the Notion command-line tool, `ntn`, which the owner signs in.
